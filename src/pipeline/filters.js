/**
 * Decides whether an incoming GPS point is stored, and whether it becomes
 * the device's live position. Pure function, so it's easy to test.
 *
 * Returns { store: boolean, isLatest: boolean, reason?: string }
 *   reason (when not stored): no_fix | zero_coordinates | out_of_range |
 *   future_time | too_old | duplicate | impossible_jump | stationary
 */
const { haversineMeters } = require('../lib/geo');

// After this many rejected "impossible jumps" in a row, accept the next
// point anyway: the stored live position was probably the wrong one.
const MAX_JUMP_REJECTS = 3;
const STOPPED_SPEED_KMH = 3;
const MIN_JUMP_DISTANCE_M = 1000;

function evaluatePoint(state, point, now, cfg) {
  const drop = (reason) => ({ store: false, isLatest: false, reason });

  if (!point.valid) return drop('no_fix');
  if (point.lat === 0 && point.lon === 0) return drop('zero_coordinates');
  if (Math.abs(point.lat) > 90 || Math.abs(point.lon) > 180) return drop('out_of_range');

  const t = point.gpsTime.getTime();
  // Usually means the device isn't set to GMT (send GMT,E,0,0#).
  if (t > now + cfg.futureToleranceMs) return drop('future_time');
  if (t < now - cfg.maxPointAgeMs) return drop('too_old');

  const lastT = state.gpsTime ? state.gpsTime.getTime() : null;
  if (lastT === t) return drop('duplicate');

  // Older than the live position: a buffered point arriving late. Keep it in
  // history, but it must not replace the live position.
  if (lastT !== null && t < lastT) return { store: true, isLatest: false };

  if (lastT !== null && state.lat != null) {
    const distM = haversineMeters(state.lat, state.lon, point.lat, point.lon);
    const hours = (t - lastT) / 3_600_000;
    const impliedKmh = distM / 1000 / hours;
    if (
      distM > MIN_JUMP_DISTANCE_M &&
      impliedKmh > cfg.maxImpliedSpeedKmh &&
      (state.jumpRejects || 0) < MAX_JUMP_REJECTS
    ) {
      return drop('impossible_jump');
    }
  }

  // An ignition change is always worth storing (trips start/end on it).
  const accChanged = point.acc != null && state.storedAcc != null && point.acc !== state.storedAcc;

  // Parked: GPS drifts a few meters. Store at most one point per interval.
  if (state.storedTime && point.speed < STOPPED_SPEED_KMH && !accChanged) {
    const distM = haversineMeters(state.storedLat, state.storedLon, point.lat, point.lon);
    if (distM < cfg.stationaryMinDistanceM && t - state.storedTime.getTime() < cfg.stationaryStoreIntervalMs) {
      return drop('stationary');
    }
  }

  return { store: true, isLatest: true };
}

module.exports = { evaluatePoint, MAX_JUMP_REJECTS };
