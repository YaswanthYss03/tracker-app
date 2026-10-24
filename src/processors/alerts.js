/**
 * Turns the live stream into stored alerts ("events"):
 *
 *   ignition_on / ignition_off   ACC changes (location or heartbeat packets)
 *   overspeed                    above the owner's speed limit for 30 s;
 *                                fires again only after 60 s back under (limit - 5)
 *   sos, power_cut, vibration,   alarms reported by the tracker itself
 *   low_battery, power_off
 *   offline / online             no packet for OFFLINE_AFTER_MIN / first packet after that
 *   geofence_enter / _exit       fired by the geofence monitor through fire()
 *
 * Only claimed (active) trackers get alerts; re-uploaded (old) points never
 * trigger them. Repeating device alarms have a cooldown so phones aren't spammed.
 * Emits 'event' with the saved row.
 */
const { EventEmitter } = require('events');

const OVERSPEED_AFTER_MS = 30_000;
const OVERSPEED_REARM_MS = 60_000;
const DEVICE_ALARMS = new Set(['sos', 'power_cut', 'vibration', 'low_battery', 'power_off']);
const COOLDOWN_MS = {
  sos: 60_000,
  power_cut: 10 * 60_000,
  vibration: 10 * 60_000,
  power_off: 10 * 60_000,
  low_battery: 6 * 3_600_000,
};

class AlertEngine extends EventEmitter {
  constructor({ store, getState, logger, offlineAfterMs, now = () => Date.now() }) {
    super();
    this.store = store; // { create(event) -> row }
    this.getState = getState; // deviceId -> live state (status, speedLimitKmh, lastSeenAt, ...)
    this.logger = logger;
    this.offlineAfterMs = offlineAfterMs;
    this.now = now;
    this.devices = new Map();
  }

  st(deviceId) {
    let s = this.devices.get(deviceId);
    if (!s) {
      s = { acc: undefined, overSince: null, overActive: false, belowSince: null, offline: false, lastFired: {} };
      this.devices.set(deviceId, s);
    }
    return s;
  }

  isActive(deviceId) {
    return this.getState(deviceId)?.status === 'active';
  }

  reset(deviceId) {
    this.devices.delete(deviceId);
  }

  onPosition(e) {
    if (!e.isLatest || e.reupload || !this.isActive(e.deviceId)) return;
    const p = e.point;
    this.markSeen(e.deviceId);
    this.updateIgnition(e.deviceId, p.acc, p.gpsTime, p);
    this.checkOverspeed(e.deviceId, p);
  }

  onStatus(e) {
    if (!this.isActive(e.deviceId)) return;
    if (e.connected === false) return;
    this.markSeen(e.deviceId);
    if (e.acc !== undefined) this.updateIgnition(e.deviceId, e.acc, new Date(this.now()), null);
  }

  onAlarm(e) {
    if (!this.isActive(e.deviceId) || !DEVICE_ALARMS.has(e.type)) return;
    this.fire(e.deviceId, e.type, { time: e.time, point: e.point, payload: { source: e.source } });
  }

  updateIgnition(deviceId, acc, time, point) {
    if (acc === null || acc === undefined) return;
    const s = this.st(deviceId);
    if (s.acc === undefined) {
      s.acc = acc; // first value seen: no event
      return;
    }
    if (acc !== s.acc) {
      s.acc = acc;
      this.fire(deviceId, acc ? 'ignition_on' : 'ignition_off', { time, point });
    }
  }

  checkOverspeed(deviceId, p) {
    const limit = this.getState(deviceId)?.speedLimitKmh;
    const s = this.st(deviceId);
    if (!limit) {
      s.overSince = null;
      s.overActive = false;
      return;
    }
    const t = p.gpsTime.getTime();
    if (p.speed > limit) {
      s.belowSince = null;
      if (s.overSince === null) s.overSince = t;
      if (!s.overActive && t - s.overSince >= OVERSPEED_AFTER_MS) {
        s.overActive = true;
        this.fire(deviceId, 'overspeed', { time: p.gpsTime, point: p, payload: { speed: p.speed, limit } });
      }
      return;
    }
    s.overSince = null;
    if (s.overActive && p.speed <= limit - 5) {
      if (s.belowSince === null) s.belowSince = t;
      if (t - s.belowSince >= OVERSPEED_REARM_MS) {
        s.overActive = false;
        s.belowSince = null;
      }
    }
  }

  /** First packet after being offline -> "online". */
  markSeen(deviceId) {
    const s = this.st(deviceId);
    if (s.offline) {
      s.offline = false;
      this.fire(deviceId, 'online', { time: new Date(this.now()) });
    }
  }

  /** Run every minute with all live states. */
  checkOffline(states) {
    const now = this.now();
    for (const state of states) {
      if (state.status !== 'active' || !state.lastSeenAt) continue;
      const s = this.st(state.deviceId);
      if (!s.offline && now - state.lastSeenAt.getTime() >= this.offlineAfterMs) {
        s.offline = true;
        this.fire(state.deviceId, 'offline', {
          time: new Date(now),
          point: state.lat != null ? { lat: state.lat, lon: state.lon } : null,
          payload: { lastSeenAt: state.lastSeenAt },
        });
      }
    }
  }

  /**
   * Saves and emits an event, respecting per-type cooldowns. Events of one
   * device are saved and emitted strictly in the order they happened, so a
   * phone never gets "ignition off" before "ignition on".
   */
  fire(deviceId, type, { time, point = null, payload = null } = {}) {
    const s = this.st(deviceId);
    const now = this.now();
    const cooldown = COOLDOWN_MS[type] || 0;
    if (cooldown && now - (s.lastFired[type] || 0) < cooldown) return Promise.resolve(null);
    s.lastFired[type] = now;

    const data = {
      deviceId,
      time: time || new Date(now),
      type,
      lat: point?.lat ?? null,
      lon: point?.lon ?? null,
      payload,
    };
    s.chain = (s.chain || Promise.resolve()).then(async () => {
      try {
        const row = await this.store.create(data);
        this.emit('event', row);
        return row;
      } catch (err) {
        this.logger.error({ err: err.message, deviceId, type }, 'failed to save alert');
        return null;
      }
    });
    return s.chain;
  }
}

module.exports = { AlertEngine, DEVICE_ALARMS, COOLDOWN_MS };
