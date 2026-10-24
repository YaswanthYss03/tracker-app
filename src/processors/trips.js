/**
 * Detects trips from the live position stream and keeps per-day totals.
 *
 * Start: ignition (ACC) turns on, or the vehicle moves (>= 5 km/h) for 60 s
 *        (for trackers whose ACC wire isn't connected).
 * End:   - ACC goes off while stopped (if ACC was seen on during the trip)
 *        - otherwise: stopped (< 3 km/h) for 5 minutes
 *        - always: stopped for 60 minutes, or no data for 30 minutes
 * Idle:  ACC on while stopped.
 * Trips shorter than 100 m are discarded (e.g. engine started and stopped).
 *
 * Open trips are saved every minute, so a server restart resumes them.
 * Points for one device are processed strictly in order.
 */
const { haversineMeters } = require('../lib/geo');

const MOVING_KMH = 5;
const STOPPED_KMH = 3;
const START_MOVING_MS = 60_000;
const STOP_END_MS = 5 * 60_000;
const LONG_STOP_END_MS = 60 * 60_000;
const MAX_GAP_MS = 30 * 60_000;
const PERSIST_EVERY_MS = 60_000;
const MIN_TRIP_M = 100;
const MAX_STEP_S = 300; // never count more than 5 min between two points

/** 'YYYY-MM-DD' of a timestamp in a timezone. */
function localDay(ms, timezone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(ms));
}

class TripTracker {
  /**
   * @param {object} deps
   * @param {object} deps.store  { findOpenTrip, createTrip, updateTrip, deleteTrip, addToDay }
   * @param {(deviceId: string) => string} deps.getTimezone
   */
  constructor({ store, getTimezone, logger }) {
    this.store = store;
    this.getTimezone = getTimezone;
    this.logger = logger;
    this.devices = new Map();
  }

  device(deviceId) {
    let d = this.devices.get(deviceId);
    if (!d) {
      d = { chain: Promise.resolve(), loaded: false, trip: null, candidate: [] };
      this.devices.set(deviceId, d);
    }
    return d;
  }

  /** Feed a stored live point ({ gpsTime, lat, lon, speed, acc }). Returns a promise (for tests). */
  onPosition(deviceId, row) {
    const d = this.device(deviceId);
    const p = { t: row.gpsTime.getTime(), lat: row.lat, lon: row.lon, speed: row.speed, acc: row.acc };
    d.chain = d.chain
      .then(() => this.process(deviceId, d, p))
      .catch((err) => this.logger.error({ err: err.message, deviceId }, 'trip processing failed'));
    return d.chain;
  }

  /** Forget a device (released to a new owner). */
  reset(deviceId) {
    this.devices.delete(deviceId);
  }

  /** Summary of the trip in progress, if any. */
  activeTrip(deviceId) {
    const trip = this.devices.get(deviceId)?.trip;
    if (!trip) return null;
    return {
      id: trip.id,
      startTime: new Date(trip.start.t),
      distanceM: Math.round(trip.distanceM),
      maxSpeed: trip.maxSpeed,
      durationS: Math.round((trip.last.t - trip.start.t) / 1000),
      idleS: Math.round(trip.idleS),
    };
  }

  async process(deviceId, d, p) {
    if (!d.loaded) {
      d.loaded = true;
      const open = await this.store.findOpenTrip(deviceId);
      if (open) d.trip = this.fromRow(open);
    }

    if (d.trip && p.t - d.trip.last.t > MAX_GAP_MS) {
      await this.finish(deviceId, d, d.trip.last);
    }
    if (d.trip) return this.continueTrip(deviceId, d, p);

    if (p.acc === true) return this.start(deviceId, d, [p]);
    if (p.speed >= MOVING_KMH) {
      d.candidate.push(p);
      if (p.t - d.candidate[0].t >= START_MOVING_MS) return this.start(deviceId, d, d.candidate);
    } else {
      d.candidate = [];
    }
  }

  async start(deviceId, d, points) {
    const first = points[0];
    const row = await this.store.createTrip({
      deviceId,
      startTime: new Date(first.t),
      startLat: first.lat,
      startLon: first.lon,
      endLat: first.lat,
      endLon: first.lon,
    });
    d.trip = {
      id: row.id, start: first, last: first, distanceM: 0, maxSpeed: first.speed, idleS: 0,
      accSeenOn: first.acc === true, stoppedSince: null, stopPoint: null, persistedAt: first.t,
    };
    d.candidate = [];
    for (const p of points.slice(1)) this.accumulate(d.trip, p);
  }

  accumulate(trip, p) {
    const dt = Math.min((p.t - trip.last.t) / 1000, MAX_STEP_S);
    if (dt < 0) return;
    trip.distanceM += haversineMeters(trip.last.lat, trip.last.lon, p.lat, p.lon);
    trip.maxSpeed = Math.max(trip.maxSpeed, p.speed);
    if (p.acc === true) trip.accSeenOn = true;
    // The interval since the previous point is idle if the vehicle was stopped
    // with the engine on at the start of it.
    if (trip.last.speed < STOPPED_KMH && trip.last.acc === true) trip.idleS += dt;
    const stopped = p.speed < STOPPED_KMH;
    if (stopped) {
      if (trip.stoppedSince === null) {
        trip.stoppedSince = p.t;
        trip.stopPoint = p;
      }
    } else {
      trip.stoppedSince = null;
      trip.stopPoint = null;
    }
    trip.last = p;
  }

  async continueTrip(deviceId, d, p) {
    const trip = d.trip;
    this.accumulate(trip, p);

    const stoppedFor = trip.stoppedSince === null ? 0 : p.t - trip.stoppedSince;
    if (trip.accSeenOn && p.acc === false && p.speed < STOPPED_KMH) return this.finish(deviceId, d, p);
    if (!trip.accSeenOn && stoppedFor >= STOP_END_MS) return this.finish(deviceId, d, trip.stopPoint);
    if (stoppedFor >= LONG_STOP_END_MS) return this.finish(deviceId, d, trip.stopPoint);

    if (p.t - trip.persistedAt >= PERSIST_EVERY_MS) {
      trip.persistedAt = p.t;
      await this.store.updateTrip(trip.id, this.numbers(trip, p, false));
    }
  }

  numbers(trip, end, finished) {
    const durationS = Math.max(0, Math.round((end.t - trip.start.t) / 1000));
    const idleS = Math.min(Math.round(trip.idleS), durationS);
    const drivingS = durationS - idleS;
    return {
      ...(finished ? { endTime: new Date(end.t) } : {}),
      endLat: end.lat,
      endLon: end.lon,
      distanceM: Math.round(trip.distanceM),
      maxSpeed: trip.maxSpeed,
      avgSpeed: drivingS > 0 ? Math.round(trip.distanceM / 1000 / (drivingS / 3600)) : 0,
      durationS,
      idleS,
    };
  }

  async finish(deviceId, d, endPoint) {
    const trip = d.trip;
    d.trip = null;
    if (trip.distanceM < MIN_TRIP_M) {
      await this.store.deleteTrip(trip.id);
      return null;
    }
    const n = this.numbers(trip, endPoint, true);
    await this.store.updateTrip(trip.id, n);
    await this.store.addToDay(deviceId, localDay(trip.start.t, this.getTimezone(deviceId)), {
      distanceM: n.distanceM,
      maxSpeed: n.maxSpeed,
      drivingS: n.durationS - n.idleS,
      idleS: n.idleS,
    });
    this.logger.debug({ deviceId, tripId: trip.id, ...n }, 'trip finished');
    return n;
  }

  /** Rebuilds in-memory state from an open trip row after a restart. */
  fromRow(row) {
    const startT = row.startTime.getTime();
    const last = { t: startT + row.durationS * 1000, lat: row.endLat ?? row.startLat, lon: row.endLon ?? row.startLon, speed: 0, acc: null };
    return {
      id: row.id,
      start: { t: startT, lat: row.startLat, lon: row.startLon, speed: 0, acc: null },
      last,
      distanceM: row.distanceM,
      maxSpeed: row.maxSpeed,
      idleS: row.idleS,
      accSeenOn: false,
      stoppedSince: null,
      stopPoint: null,
      persistedAt: last.t,
    };
  }
}

module.exports = { TripTracker, localDay };
