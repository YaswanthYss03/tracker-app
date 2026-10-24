/**
 * In-memory live state of each device (latest position, ignition, battery,
 * last seen). The API reads from here, so "where is it now?" never touches
 * the positions table. Changed devices are saved to the devices table in
 * one batched UPDATE every few seconds.
 */
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

class DeviceStateCache {
  constructor({ logger }) {
    this.logger = logger;
    this.states = new Map(); // deviceId -> state
    this.dirty = new Set();
    this.timer = null;
    this.save = null;
  }

  /** Creates (or refreshes identity of) the state from a device DB row. */
  load(device) {
    let s = this.states.get(device.id);
    if (!s) {
      s = {
        deviceId: device.id,
        lat: device.lastLat,
        lon: device.lastLon,
        speed: device.lastSpeed,
        course: device.lastCourse,
        satellites: device.lastSatellites,
        gpsTime: device.lastGpsTime,
        acc: device.lastAcc,
        charging: device.lastCharging,
        batteryLevel: device.lastBatteryLevel,
        gsmSignal: device.lastGsmSignal,
        lastSeenAt: device.lastSeenAt,
        // Last point actually stored (for the parked/jitter filter)
        storedLat: device.lastLat,
        storedLon: device.lastLon,
        storedTime: device.lastGpsTime,
        storedAcc: device.lastAcc,
        jumpRejects: 0,
        terminalAlarm: null,
        connected: false,
      };
      this.states.set(device.id, s);
    }
    s.imei = device.imei;
    s.status = device.status;
    s.name = device.name;
    s.timezone = device.timezone;
    s.speedLimitKmh = device.speedLimitKmh;
    return s;
  }

  get(deviceId) {
    return this.states.get(deviceId);
  }

  /** Forgets the live position (tracker released to a new owner). Keeps connection state. */
  clearPosition(deviceId) {
    const s = this.states.get(deviceId);
    if (!s) return;
    Object.assign(s, {
      lat: null, lon: null, speed: null, course: null, satellites: null, gpsTime: null,
      storedLat: null, storedLon: null, storedTime: null, storedAcc: null, jumpRejects: 0,
    });
  }

  markDirty(deviceId) {
    this.dirty.add(deviceId);
  }

  isOnline(state, now = Date.now()) {
    if (!state) return false;
    if (state.connected) return true;
    return Boolean(state.lastSeenAt && now - state.lastSeenAt.getTime() < ONLINE_WINDOW_MS);
  }

  onlineCount() {
    let n = 0;
    for (const s of this.states.values()) if (this.isOnline(s)) n++;
    return n;
  }

  /** Starts periodic saving with save(states[]) -> Promise. */
  startFlushing(save, intervalMs) {
    this.save = save;
    this.timer = setInterval(() => this.flush(), intervalMs);
  }

  async flush() {
    if (!this.save || this.dirty.size === 0) return;
    const ids = [...this.dirty];
    this.dirty.clear();
    const snapshot = ids.map((id) => this.states.get(id)).filter(Boolean);
    try {
      await this.save(snapshot);
    } catch (err) {
      for (const id of ids) this.dirty.add(id); // retry next time
      this.logger.error({ err: err.message, devices: ids.length }, 'failed to save device states');
    }
  }

  async stop() {
    clearInterval(this.timer);
    await this.flush();
  }
}

module.exports = { DeviceStateCache, ONLINE_WINDOW_MS };
