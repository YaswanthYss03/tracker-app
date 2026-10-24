/**
 * Turns parsed device messages into stored points and live state.
 *
 *   gateway ──msg──> Ingest ──> filters ──> BatchWriter (positions table)
 *                       │──> DeviceStateCache (live state)
 *                       └──> events: 'position', 'status', 'alarm'
 *
 * Later stages (live map, trips, alerts, geofences) subscribe to the events
 * instead of touching the gateway.
 */
const { EventEmitter } = require('events');
const { evaluatePoint } = require('./filters');

class Ingest extends EventEmitter {
  constructor({ cache, writer, filters, logger, now = () => Date.now() }) {
    super();
    this.cache = cache;
    this.writer = writer;
    this.filters = filters;
    this.logger = logger;
    this.now = now;
    this.counters = { received: 0, stored: 0, dropped: {} };
  }

  /** Called after a successful login. */
  deviceConnected(device) {
    const state = this.cache.load(device);
    state.connected = true;
    this.touch(device.id);
    this.emit('status', { deviceId: device.id, imei: device.imei, connected: true });
    return state;
  }

  deviceDisconnected(deviceId, stillConnected) {
    const state = this.cache.get(deviceId);
    if (!state) return;
    state.connected = stillConnected;
    if (!stillConnected) this.emit('status', { deviceId, imei: state.imei, connected: false });
  }

  /** Any packet from a device counts as "seen". */
  touch(deviceId) {
    const state = this.cache.get(deviceId);
    if (!state) return;
    state.lastSeenAt = new Date(this.now());
    this.cache.markDirty(deviceId);
  }

  handleLocation(ctx, msg) {
    const state = this.cache.get(ctx.deviceId);
    if (!state) return null;
    this.touch(ctx.deviceId);

    // ACC from a re-uploaded (old) packet must not overwrite the live value.
    if (msg.acc !== undefined && !msg.reupload) state.acc = msg.acc;

    return this.processPoint(ctx, state, msg);
  }

  handleHeartbeat(ctx, msg) {
    const state = this.cache.get(ctx.deviceId);
    if (!state) return;
    this.touch(ctx.deviceId);
    this.applyStatus(state, msg);
    this.emit('status', {
      deviceId: ctx.deviceId,
      imei: ctx.imei,
      acc: state.acc,
      charging: state.charging,
      batteryLevel: state.batteryLevel,
      gsmSignal: state.gsmSignal,
    });

    // The alarm bits in heartbeats repeat until cleared; report only changes.
    const alarm = msg.status.alarm;
    if (alarm !== state.terminalAlarm) {
      state.terminalAlarm = alarm;
      if (alarm) this.emitAlarm(ctx, alarm, null, 'heartbeat');
    }
  }

  handleAlarm(ctx, msg) {
    const state = this.cache.get(ctx.deviceId);
    if (!state) return;
    this.touch(ctx.deviceId);
    this.applyStatus(state, msg);
    if (msg.acc !== undefined) state.acc = msg.acc;
    this.processPoint(ctx, state, msg);
    if (msg.alarm) this.emitAlarm(ctx, msg.alarm, msg.point, 'alarm_packet');
  }

  // ---- internals ----

  applyStatus(state, msg) {
    if (msg.status) {
      state.acc = msg.status.acc;
      state.charging = msg.status.charging;
    }
    if (msg.batteryLevel !== undefined) state.batteryLevel = msg.batteryLevel;
    if (msg.gsmSignal !== undefined) state.gsmSignal = msg.gsmSignal;
  }

  processPoint(ctx, state, msg) {
    const now = this.now();
    const p = msg.point;
    this.counters.received += 1;
    const acc = msg.acc !== undefined ? msg.acc : msg.reupload ? null : state.acc ?? null;

    const decision = evaluatePoint(state, { ...p, acc }, now, this.filters);
    if (!decision.store) {
      this.counters.dropped[decision.reason] = (this.counters.dropped[decision.reason] || 0) + 1;
      if (decision.reason === 'impossible_jump') state.jumpRejects = (state.jumpRejects || 0) + 1;
      if (decision.reason === 'future_time') {
        this.logger.warn({ imei: ctx.imei, gpsTime: p.gpsTime }, 'point in the future: is the device set to GMT (GMT,E,0,0#)?');
      } else {
        this.logger.debug({ imei: ctx.imei, reason: decision.reason }, 'point dropped');
      }
      return decision;
    }

    const row = {
      deviceId: ctx.deviceId,
      gpsTime: p.gpsTime,
      receivedAt: new Date(now),
      lat: p.lat,
      lon: p.lon,
      speed: p.speed,
      course: p.course,
      satellites: p.satellites,
      valid: p.valid,
      acc,
      extra: compact({
        protocol: msg.protocol,
        lbs: msg.lbs,
        reupload: msg.reupload || undefined,
        uploadMode: msg.uploadMode,
        mileage: msg.mileage,
      }),
    };
    this.writer.add(row);
    this.counters.stored += 1;

    if (decision.isLatest) {
      Object.assign(state, {
        lat: p.lat,
        lon: p.lon,
        speed: p.speed,
        course: p.course,
        satellites: p.satellites,
        gpsTime: p.gpsTime,
        storedLat: p.lat,
        storedLon: p.lon,
        storedTime: p.gpsTime,
        storedAcc: acc ?? state.storedAcc ?? null,
        jumpRejects: 0,
      });
      this.cache.markDirty(ctx.deviceId);
    }

    this.emit('position', {
      deviceId: ctx.deviceId,
      imei: ctx.imei,
      point: row,
      isLatest: decision.isLatest,
      reupload: Boolean(msg.reupload),
    });
    return decision;
  }

  emitAlarm(ctx, type, point, source) {
    this.logger.info({ imei: ctx.imei, alarm: type, source }, 'device alarm');
    this.emit('alarm', { deviceId: ctx.deviceId, imei: ctx.imei, type, point, source, time: new Date(this.now()) });
  }

  stats() {
    return { ...this.counters, dropped: { ...this.counters.dropped } };
  }
}

function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined && v !== null) out[k] = v;
  return Object.keys(out).length ? out : null;
}

module.exports = { Ingest };
