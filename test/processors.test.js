// Trips, alerts, geofences and geo helpers (no database: stores are faked).
const test = require('node:test');
const assert = require('node:assert/strict');
const pino = require('pino');
const { TripTracker, localDay } = require('../src/processors/trips');
const { AlertEngine } = require('../src/processors/alerts');
const { GeofenceMonitor } = require('../src/processors/geofences');
const { simplify, simplifyToMax, pointInPolygon, insideGeofence, haversineMeters } = require('../src/lib/geo');
const { message, inQuietHours } = require('../src/notifications/notifier');
const { createFcm } = require('../src/notifications/fcm');

const logger = pino({ level: 'silent' });
const T0 = Date.parse('2026-10-22T04:00:00Z'); // 09:30 IST
const DEV = 'dev-1';

// Moves north ~111 m per 0.001 degree.
const pt = (sec, { lat = 12.97, speed = 40, acc = true } = {}) => ({
  gpsTime: new Date(T0 + sec * 1000), lat, lon: 77.59, speed, acc,
});

function fakeTripStore() {
  const s = { trips: new Map(), days: [], nextId: 1 };
  s.findOpenTrip = async () => null;
  s.createTrip = async (data) => {
    const row = { id: `trip-${s.nextId++}`, ...data, endTime: null };
    s.trips.set(row.id, row);
    return row;
  };
  s.updateTrip = async (id, data) => Object.assign(s.trips.get(id), data);
  s.deleteTrip = async (id) => s.trips.delete(id);
  s.addToDay = async (deviceId, day, stats) => s.days.push({ day, ...stats });
  return s;
}

async function feed(tracker, points) {
  for (const p of points) await tracker.onPosition(DEV, p);
}

// ---------------- geo ----------------

test('geo: polygon, circle and simplification', () => {
  const square = [[0, 0], [0, 1], [1, 1], [1, 0]];
  assert.equal(pointInPolygon(0.5, 0.5, square), true);
  assert.equal(pointInPolygon(1.5, 0.5, square), false);
  assert.equal(insideGeofence({ type: 'circle', geometry: { lat: 12.97, lon: 77.59 }, radiusM: 200 }, 12.971, 77.59), true);
  assert.equal(insideGeofence({ type: 'circle', geometry: { lat: 12.97, lon: 77.59 }, radiusM: 100 }, 12.971, 77.59), false);
  assert.ok(Math.abs(haversineMeters(12.97, 77.59, 12.98, 77.59) - 1112) < 5);

  // A straight line collapses to its two ends; a corner is kept.
  const line = Array.from({ length: 50 }, (_, i) => ({ lat: 12.97 + i * 0.0001, lon: 77.59 }));
  assert.equal(simplify(line, 5).length, 2);
  const corner = [...line, { lat: 12.9749, lon: 77.6 }];
  assert.equal(simplify(corner, 5).length, 3);
  assert.ok(simplifyToMax(corner.concat(corner.map((p) => ({ lat: p.lat, lon: p.lon + 0.0001 }))), 10).length <= 10);
});

// ---------------- trips ----------------

test('trips: ignition on -> drive -> ignition off makes one trip and a daily total', async () => {
  const store = fakeTripStore();
  const tracker = new TripTracker({ store, getTimezone: () => 'Asia/Kolkata', logger });
  const points = [];
  for (let i = 0; i <= 10; i++) points.push(pt(i * 10, { lat: 12.97 + i * 0.001 })); // ~1.1 km in 100 s
  points.push(pt(110, { lat: 12.98, speed: 0, acc: true })); // stopped, engine idling
  points.push(pt(130, { lat: 12.98, speed: 0, acc: false })); // ignition off
  await feed(tracker, points);

  assert.equal(store.trips.size, 1);
  const [trip] = store.trips.values();
  assert.ok(trip.endTime, 'trip finished');
  assert.ok(trip.distanceM > 1000 && trip.distanceM < 1200, `distance ${trip.distanceM}`);
  assert.equal(trip.durationS, 130);
  assert.equal(trip.idleS, 20);
  assert.equal(trip.maxSpeed, 40);
  assert.deepEqual(store.days.map((d) => d.day), ['2026-10-22']);
  assert.equal(tracker.activeTrip(DEV), null);
});

test('trips: without ACC, movement for 60 s starts a trip and 5 min stopped ends it', async () => {
  const store = fakeTripStore();
  const tracker = new TripTracker({ store, getTimezone: () => 'Asia/Kolkata', logger });
  const points = [];
  for (let i = 0; i <= 12; i++) points.push(pt(i * 10, { lat: 12.97 + i * 0.001, acc: false }));
  await feed(tracker, points);
  assert.equal(store.trips.size, 1, 'started after 60 s of movement');
  assert.ok(tracker.activeTrip(DEV));

  const stop = [];
  for (let i = 0; i <= 31; i++) stop.push(pt(130 + i * 10, { lat: 12.982, speed: 0, acc: false }));
  await feed(tracker, stop);
  const [trip] = store.trips.values();
  assert.ok(trip.endTime);
  assert.equal(trip.endTime.getTime(), T0 + 130_000, 'ends where the stop began');
});

test('trips: short ignition on/off with no movement is discarded', async () => {
  const store = fakeTripStore();
  const tracker = new TripTracker({ store, getTimezone: () => 'UTC', logger });
  await feed(tracker, [pt(0, { speed: 0 }), pt(30, { speed: 0 }), pt(60, { speed: 0, acc: false })]);
  assert.equal(store.trips.size, 0);
  assert.equal(store.days.length, 0);
});

test('trips: a 30-minute data gap closes the open trip', async () => {
  const store = fakeTripStore();
  const tracker = new TripTracker({ store, getTimezone: () => 'UTC', logger });
  const points = [];
  for (let i = 0; i <= 10; i++) points.push(pt(i * 10, { lat: 12.97 + i * 0.001 }));
  points.push(pt(100 + 31 * 60, { lat: 13.1 })); // reappears 31 min later
  await feed(tracker, points);
  const trips = [...store.trips.values()];
  assert.equal(trips[0].durationS, 100);
  assert.ok(trips[0].endTime);
  assert.equal(trips.length, 2, 'a new trip starts with the new point (ACC on)');
});

test('localDay uses the device timezone', () => {
  const late = Date.parse('2026-10-22T20:00:00Z'); // 01:30 next day in India
  assert.equal(localDay(late, 'Asia/Kolkata'), '2026-10-23');
  assert.equal(localDay(late, 'UTC'), '2026-10-22');
});

// ---------------- alerts ----------------

function makeAlerts(state = {}) {
  const saved = [];
  let now = T0;
  const states = { [DEV]: { deviceId: DEV, status: 'active', speedLimitKmh: 60, ...state } };
  const engine = new AlertEngine({
    store: { create: async (e) => { const row = { id: `e${saved.length}`, ...e }; saved.push(row); return row; } },
    getState: (id) => states[id],
    logger,
    offlineAfterMs: 10 * 60_000,
    now: () => now,
  });
  return { engine, saved, states, setNow: (t) => (now = t), types: () => saved.map((e) => e.type) };
}

const pos = (sec, over = {}) => ({ deviceId: DEV, isLatest: true, reupload: false, point: pt(sec, over) });
const flush = () => new Promise((r) => setImmediate(r));

test('alerts: ignition changes (first value is silent)', async () => {
  const a = makeAlerts();
  a.engine.onPosition(pos(0, { acc: false }));
  a.engine.onPosition(pos(10, { acc: true }));
  a.engine.onStatus({ deviceId: DEV, acc: true });
  a.engine.onStatus({ deviceId: DEV, acc: false });
  await flush();
  assert.deepEqual(a.types(), ['ignition_on', 'ignition_off']);
});

test('alerts: overspeed after 30 s, once, re-armed after slowing down', async () => {
  const a = makeAlerts();
  for (let s = 0; s <= 40; s += 10) a.engine.onPosition(pos(s, { speed: 80 }));
  await flush();
  assert.deepEqual(a.types(), ['overspeed']);
  assert.deepEqual(a.saved[0].payload, { speed: 80, limit: 60 });

  for (let s = 50; s <= 120; s += 10) a.engine.onPosition(pos(s, { speed: 40 })); // 70 s under limit-5
  for (let s = 130; s <= 170; s += 10) a.engine.onPosition(pos(s, { speed: 90 }));
  await flush();
  assert.deepEqual(a.types(), ['overspeed', 'overspeed']);
});

test('alerts: short overspeed burst and no speed limit do nothing', async () => {
  const a = makeAlerts();
  a.engine.onPosition(pos(0, { speed: 80 }));
  a.engine.onPosition(pos(20, { speed: 80 }));
  a.engine.onPosition(pos(30, { speed: 50 }));
  const b = makeAlerts({ speedLimitKmh: null });
  for (let s = 0; s <= 60; s += 10) b.engine.onPosition(pos(s, { speed: 150 }));
  await flush();
  assert.deepEqual(a.types(), []);
  assert.deepEqual(b.types(), []);
});

test('alerts: device alarms with cooldown; only claimed trackers; re-uploads ignored', async () => {
  const a = makeAlerts();
  a.engine.onAlarm({ deviceId: DEV, type: 'power_cut', time: new Date(T0) });
  a.engine.onAlarm({ deviceId: DEV, type: 'power_cut', time: new Date(T0) }); // cooldown
  a.engine.onAlarm({ deviceId: DEV, type: 'sos', time: new Date(T0) });
  a.engine.onAlarm({ deviceId: DEV, type: 'geofence_enter', time: new Date(T0) }); // device-side fences ignored
  a.setNow(T0 + 11 * 60_000);
  a.engine.onAlarm({ deviceId: DEV, type: 'power_cut', time: new Date(T0) });
  await flush();
  assert.deepEqual(a.types(), ['power_cut', 'sos', 'power_cut']);

  const b = makeAlerts({ status: 'inventory' });
  b.engine.onAlarm({ deviceId: DEV, type: 'sos', time: new Date(T0) });
  b.engine.onPosition(pos(0, { acc: false }));
  b.engine.onPosition(pos(10, { acc: true }));
  const c = makeAlerts();
  c.engine.onPosition(pos(0, { acc: false }));
  c.engine.onPosition({ ...pos(10, { acc: true }), reupload: true });
  await flush();
  assert.deepEqual(b.types(), []);
  assert.deepEqual(c.types(), []);
});

test('alerts: offline after 10 min of silence, online on the next packet', async () => {
  const a = makeAlerts();
  const state = a.states[DEV];
  state.lastSeenAt = new Date(T0);
  a.setNow(T0 + 5 * 60_000);
  a.engine.checkOffline([state]);
  a.setNow(T0 + 11 * 60_000);
  a.engine.checkOffline([state]);
  a.engine.checkOffline([state]); // no duplicate
  a.engine.onStatus({ deviceId: DEV, connected: true });
  await flush();
  assert.deepEqual(a.types(), ['offline', 'online']);
});

test('alerts: long stop after 4 h parked (once per stop), only while connected', async () => {
  const a = makeAlerts();
  const state = a.states[DEV];
  a.engine.onPosition(pos(0, { acc: true }));
  a.engine.onStatus({ deviceId: DEV, acc: false }); // parked at T0
  const tick = (min) => {
    a.setNow(T0 + min * 60_000);
    state.lastSeenAt = new Date(T0 + min * 60_000 - 30_000); // heartbeats keep coming
    a.engine.checkOffline([state]);
  };
  tick(200);
  tick(241);
  tick(300); // no duplicate
  await flush();
  assert.deepEqual(a.types(), ['ignition_off', 'long_stop']);
  assert.equal(a.saved[1].payload.minutes, 241);

  // Driving again re-arms it; a disconnected tracker gets "offline", not "long stop".
  a.engine.onStatus({ deviceId: DEV, acc: true });
  a.engine.onStatus({ deviceId: DEV, acc: false });
  a.setNow(T0 + 600 * 60_000);
  state.lastSeenAt = new Date(T0 + 400 * 60_000);
  a.engine.checkOffline([state]);
  await flush();
  assert.deepEqual(a.types(), ['ignition_off', 'long_stop', 'ignition_on', 'ignition_off', 'offline']);
});

test('alerts: GPS lost when the ignition is on and no fix for 15 min; re-armed by a new position', async () => {
  const a = makeAlerts();
  const state = a.states[DEV];
  a.engine.onPosition(pos(0, { acc: false }));
  a.engine.onPosition(pos(10, { acc: true }));
  state.gpsTime = new Date(T0 + 10_000);
  const tick = (min) => {
    a.setNow(T0 + min * 60_000);
    state.lastSeenAt = new Date(T0 + min * 60_000 - 20_000);
    a.engine.checkOffline([state]);
  };
  tick(10);
  tick(16);
  tick(20); // once
  a.engine.onPosition(pos(21 * 60, { acc: true }));
  state.gpsTime = new Date(T0 + 21 * 60_000);
  tick(30);
  tick(37);
  await flush();
  assert.deepEqual(a.types(), ['ignition_on', 'gps_lost', 'gps_lost']);

  // Parked (ignition off): a stale fix is normal, no alert.
  const b = makeAlerts();
  b.engine.onPosition(pos(0, { acc: false }));
  b.states[DEV].gpsTime = new Date(T0);
  b.setNow(T0 + 60 * 60_000);
  b.states[DEV].lastSeenAt = new Date(T0 + 59 * 60_000);
  b.engine.checkOffline([b.states[DEV]]);
  await flush();
  assert.deepEqual(b.types(), []);
});

// ---------------- geofences ----------------

test('geofences: enter/exit need two points in a row; first point is silent', async () => {
  const fired = [];
  const fence = { id: 'f1', name: 'Home', type: 'circle', geometry: { lat: 12.97, lon: 77.59 }, radiusM: 100, alertOnEnter: true, alertOnExit: true };
  const mon = new GeofenceMonitor({
    load: async () => [fence],
    fire: async (deviceId, type, data) => fired.push({ type, name: data.payload.name }),
    isActive: () => true,
    logger,
  });
  const at = (sec, lat) => mon.onPosition({ deviceId: DEV, isLatest: true, reupload: false, point: pt(sec, { lat }) });

  await at(0, 12.98); // outside (first point: no alert)
  await at(10, 12.9701); // inside once (jitter?)
  await at(20, 12.98); // back outside -> nothing
  await at(30, 12.9701);
  await at(40, 12.9702); // inside twice -> enter
  await at(50, 12.98);
  await at(60, 12.981); // outside twice -> exit
  assert.deepEqual(fired, [{ type: 'geofence_enter', name: 'Home' }, { type: 'geofence_exit', name: 'Home' }]);
});

// ---------------- notifications ----------------

test('notification texts: what happened + vehicle (+ driver)', () => {
  assert.deepEqual(message({ type: 'overspeed', payload: { speed: 82, limit: 60 } }, 'TN 38 BX 4521', 'Arun'), {
    title: 'Overspeed · 82 km/h', body: 'TN 38 BX 4521 is going 82 km/h (limit 60 km/h). Driver: Arun.',
  });
  assert.equal(message({ type: 'geofence_enter', payload: { name: 'Home' } }, null).body, 'Your vehicle entered Home.');
  assert.deepEqual(message({ type: 'long_stop', payload: { minutes: 503 } }, 'TN 37 CK 1187', 'Divya Mohan'), {
    title: 'Long stop · 8 h 23 min', body: 'TN 37 CK 1187 has been parked for 8 h 23 min. Driver: Divya Mohan.',
  });
  assert.equal(message({ type: 'gps_lost' }, 'TN 38 AZ 2210').body, 'TN 38 AZ 2210 is online but has no location.');
});

test('quiet hours are 22:00-07:00 in the vehicle timezone', () => {
  assert.equal(inQuietHours(new Date('2026-10-22T17:00:00Z')), true); // 22:30 IST
  assert.equal(inQuietHours(new Date('2026-10-22T01:00:00Z')), true); // 06:30 IST
  assert.equal(inQuietHours(new Date('2026-10-22T02:00:00Z')), false); // 07:30 IST
  assert.equal(inQuietHours(new Date('2026-10-22T17:00:00Z'), 'UTC'), false); // 17:00 UTC
});

test('push is disabled (not crashing) without a key, or with the app file by mistake', () => {
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  assert.equal(createFcm({ credentialsFile: '/nonexistent/firebase.json', logger }).enabled, false);

  const wrong = path.join(os.tmpdir(), `google-services-${process.pid}.json`);
  fs.writeFileSync(wrong, JSON.stringify({ project_info: { project_id: 'x' }, client: [] }));
  const fcm = createFcm({ credentialsFile: wrong, logger });
  fs.unlinkSync(wrong);
  assert.equal(fcm.enabled, false);
  assert.match(fcm.reason, /google-services\.json/);
});
