/**
 * Geofence enter/exit detection.
 *
 * Fences are cached per device (reloaded after any change). A crossing only
 * counts when two consecutive points agree, so GPS jitter on the border
 * doesn't produce enter/exit/enter spam. The first point after startup (or
 * after a fence is created) just records inside/outside without an alert.
 */
const { insideGeofence } = require('../lib/geo');

class GeofenceMonitor {
  constructor({ load, fire, isActive, logger }) {
    this.load = load; // deviceId -> Promise<fence rows>
    this.fire = fire; // (deviceId, type, { time, point, payload }) -> Promise
    this.isActive = isActive;
    this.logger = logger;
    this.fences = new Map(); // deviceId -> Promise<fences>
    this.state = new Map(); // `${deviceId}:${fenceId}` -> { inside, pending }
  }

  invalidate(deviceId) {
    this.fences.delete(deviceId);
  }

  reset(deviceId) {
    this.fences.delete(deviceId);
    for (const key of this.state.keys()) if (key.startsWith(`${deviceId}:`)) this.state.delete(key);
  }

  getFences(deviceId) {
    let p = this.fences.get(deviceId);
    if (!p) {
      p = this.load(deviceId).catch((err) => {
        this.fences.delete(deviceId);
        this.logger.error({ err: err.message, deviceId }, 'failed to load geofences');
        return [];
      });
      this.fences.set(deviceId, p);
    }
    return p;
  }

  async onPosition(e) {
    if (!e.isLatest || e.reupload || !this.isActive(e.deviceId)) return;
    const fences = await this.getFences(e.deviceId);
    const p = e.point;

    for (const f of fences) {
      const key = `${e.deviceId}:${f.id}`;
      const inside = insideGeofence(f, p.lat, p.lon);
      const s = this.state.get(key);
      if (!s) {
        this.state.set(key, { inside, pending: null });
        continue;
      }
      if (inside === s.inside) {
        s.pending = null;
        continue;
      }
      if (s.pending !== inside) {
        s.pending = inside; // wait for a second point to confirm
        continue;
      }
      s.inside = inside;
      s.pending = null;
      if ((inside && f.alertOnEnter) || (!inside && f.alertOnExit)) {
        await this.fire(e.deviceId, inside ? 'geofence_enter' : 'geofence_exit', {
          time: p.gpsTime,
          point: p,
          payload: { geofenceId: f.id, name: f.name },
        });
      }
    }
  }
}

module.exports = { GeofenceMonitor };
