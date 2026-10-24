// Ingest filters: which points are stored and which become the live position.
const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluatePoint, MAX_JUMP_REJECTS } = require('../src/pipeline/filters');

const cfg = {
  futureToleranceMs: 10 * 60_000,
  maxPointAgeMs: 7 * 86_400_000,
  stationaryMinDistanceM: 15,
  stationaryStoreIntervalMs: 300_000,
  maxImpliedSpeedKmh: 300,
};
const NOW = Date.parse('2026-10-22T10:00:00Z');
const at = (secondsAgo) => new Date(NOW - secondsAgo * 1000);
const point = (over = {}) => ({ gpsTime: at(0), lat: 12.9716, lon: 77.5946, speed: 40, course: 0, satellites: 9, valid: true, ...over });

// State after a stored point 60 s ago at the same place.
const state = (over = {}) => ({
  gpsTime: at(60), lat: 12.9716, lon: 77.5946,
  storedTime: at(60), storedLat: 12.9716, storedLon: 77.5946,
  jumpRejects: 0, ...over,
});

test('first point for a device is stored and becomes live', () => {
  assert.deepEqual(evaluatePoint({}, point(), NOW, cfg), { store: true, isLatest: true });
});

test('drops points without a GPS fix, at 0,0 or out of range', () => {
  assert.equal(evaluatePoint({}, point({ valid: false }), NOW, cfg).reason, 'no_fix');
  assert.equal(evaluatePoint({}, point({ lat: 0, lon: 0 }), NOW, cfg).reason, 'zero_coordinates');
  assert.equal(evaluatePoint({}, point({ lat: 95 }), NOW, cfg).reason, 'out_of_range');
});

test('drops future and very old timestamps', () => {
  assert.equal(evaluatePoint({}, point({ gpsTime: new Date(NOW + 11 * 60_000) }), NOW, cfg).reason, 'future_time');
  assert.equal(evaluatePoint({}, point({ gpsTime: new Date(NOW + 5 * 60_000) }), NOW, cfg).store, true);
  assert.equal(evaluatePoint({}, point({ gpsTime: at(8 * 86_400) }), NOW, cfg).reason, 'too_old');
});

test('drops exact duplicates of the live point', () => {
  assert.equal(evaluatePoint(state(), point({ gpsTime: at(60) }), NOW, cfg).reason, 'duplicate');
});

test('late (re-uploaded) points are stored but never become live', () => {
  const r = evaluatePoint(state(), point({ gpsTime: at(600), lat: 12.95 }), NOW, cfg);
  assert.deepEqual(r, { store: true, isLatest: false });
});

test('drops impossible jumps, but gives up after repeated rejections', () => {
  const far = point({ lat: 17.38, lon: 78.48 }); // ~500 km away, 60 s later
  assert.equal(evaluatePoint(state(), far, NOW, cfg).reason, 'impossible_jump');
  assert.equal(evaluatePoint(state({ jumpRejects: MAX_JUMP_REJECTS }), far, NOW, cfg).store, true);
});

test('normal driving distance is accepted', () => {
  // ~670 m in 60 s = ~40 km/h
  assert.equal(evaluatePoint(state(), point({ lat: 12.9776 }), NOW, cfg).store, true);
});

test('parked jitter is skipped until the store interval passes', () => {
  const jitter = point({ lat: 12.97165, speed: 0 }); // ~5 m away
  assert.equal(evaluatePoint(state(), jitter, NOW, cfg).reason, 'stationary');

  const longAgo = state({ gpsTime: at(400), storedTime: at(400) });
  assert.equal(evaluatePoint(longAgo, jitter, NOW, cfg).store, true);

  const moved = point({ lat: 12.9718, speed: 0 }); // ~22 m away
  assert.equal(evaluatePoint(state(), moved, NOW, cfg).store, true);
});

test('an ignition change is stored even while parked', () => {
  const parked = state({ storedAcc: true });
  assert.equal(evaluatePoint(parked, point({ lat: 12.97165, speed: 0, acc: false }), NOW, cfg).store, true);
  assert.equal(evaluatePoint(parked, point({ lat: 12.97165, speed: 0, acc: true }), NOW, cfg).reason, 'stationary');
});
