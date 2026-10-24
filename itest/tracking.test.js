// Stage 3 integration tests: history, trips, daily report, alerts, geofences,
// share links, commands and the live WebSocket. Real database + pipeline.
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');
const { io } = require('socket.io-client');

const IMEI = '359710049095095';
const PASSWORD = 'correct horse battery';
let ctx;

test.before(async () => {
  ctx = await startApp();
});
test.after(async () => ctx.close());
test.beforeEach(async () => resetData(ctx.prisma));

const api = (...args) => ctx.api(...args);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function signup(email) {
  const res = await api('POST', '/api/v1/auth/register', { body: { email, password: PASSWORD, acceptTerms: true } });
  assert.equal(res.status, 201);
  return res.body.data;
}

/** Registers + claims a tracker and "connects" it to the pipeline. */
async function ownedTracker(email = 'owner@x.com') {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: IMEI } });
  const owner = await signup(email);
  const claim = await api('POST', '/api/v1/devices/claim', {
    token: owner.accessToken, body: { imei: IMEI, activationCode: reg.body.data.activationCode, name: 'Test car' },
  });
  assert.equal(claim.status, 201);
  const device = await ctx.prisma.device.findUnique({ where: { imei: IMEI } });
  ctx.ingest.deviceConnected(device);
  return { owner, deviceId: device.id, url: `/api/v1/devices/${device.id}`, ctx: { deviceId: device.id, imei: IMEI } };
}

/** Sends one 0x22 location through the real ingest pipeline. */
function sendPoint(dev, t, { lat, lon = 77.59, speed, acc }) {
  ctx.ingest.handleLocation(dev.ctx, {
    type: 'location', protocol: 0x22, acc, reupload: false,
    point: { gpsTime: new Date(t), lat, lon, speed, course: 0, satellites: 9, valid: true },
  });
}

async function settle(deviceId) {
  await ctx.writer.flush();
  await ctx.processors.trips.devices.get(deviceId)?.chain;
  await ctx.processors.idle(deviceId);
  await ctx.processors.alerts.devices.get(deviceId)?.chain;
}

test('a drive produces history, a trip, a daily total and alerts', async () => {
  const dev = await ownedTracker();
  const token = dev.owner.accessToken;
  await api('PATCH', dev.url, { token, body: { speedLimitKmh: 60 } });
  // Geofence around the destination (~2.2 km north)
  const fence = await api('POST', `${dev.url}/geofences`, {
    token, body: { name: 'Office', type: 'circle', center: { lat: 12.99, lon: 77.59 }, radiusM: 300 },
  });
  assert.equal(fence.status, 201);

  const t0 = Date.now() - 20 * 60_000;
  sendPoint(dev, t0, { lat: 12.97, speed: 0, acc: false }); // parked
  for (let i = 1; i <= 12; i++) {
    // ignition on, 70 km/h north for 2 minutes
    sendPoint(dev, t0 + i * 10_000, { lat: 12.97 + i * 0.0018, speed: 70, acc: true });
  }
  sendPoint(dev, t0 + 130_000, { lat: 12.9902, speed: 0, acc: true }); // arrived, idling
  sendPoint(dev, t0 + 160_000, { lat: 12.9902, speed: 0, acc: false }); // ignition off
  await settle(dev.deviceId);

  // History
  let res = await api('GET', `${dev.url}/positions?from=${new Date(t0 - 1000).toISOString()}`, { token });
  assert.equal(res.status, 200);
  assert.ok(res.body.data.originalCount >= 14);
  const ts = res.body.data.points.map((p) => Date.parse(p.t));
  assert.deepEqual(ts, [...ts].sort((a, b) => a - b), 'oldest first');

  // Trip
  res = await api('GET', `${dev.url}/trips`, { token });
  assert.equal(res.body.count, 1);
  const trip = res.body.data[0];
  assert.equal(trip.inProgress, false);
  assert.ok(trip.distanceKm > 2 && trip.distanceKm < 2.6, `distance ${trip.distanceKm}`);
  assert.equal(trip.maxSpeed, 70);
  assert.equal(trip.idleS, 30);
  const route = await api('GET', `${dev.url}/trips/${trip.id}/route`, { token });
  assert.ok(route.body.data.count >= 2);

  // Daily report
  res = await api('GET', `${dev.url}/reports/daily`, { token });
  assert.equal(res.body.data.total.trips, 1);
  assert.equal(res.body.data.timezone, 'Asia/Kolkata');

  // Alerts
  res = await api('GET', `${dev.url}/events`, { token });
  const types = res.body.data.map((e) => e.type).reverse();
  assert.deepEqual(types, ['ignition_on', 'overspeed', 'geofence_enter', 'ignition_off']);
  assert.deepEqual(res.body.data.find((e) => e.type === 'geofence_enter').details, { geofenceId: fence.body.data.id, name: 'Office' });
  assert.deepEqual(ctx.pushed.slice(-4).map((e) => e.type), types, 'each alert goes to push');

  res = await api('GET', `${dev.url}/events?type=overspeed`, { token });
  assert.equal(res.body.count, 1);
  assert.equal((await api('GET', `${dev.url}/events?type=bogus`, { token })).status, 400);
  assert.equal((await api('GET', `${dev.url}/positions?from=2020-01-01T00:00:00Z`, { token })).status, 400);
});

test('tracking data is private to owner and viewers', async () => {
  const dev = await ownedTracker();
  const stranger = await signup('stranger@x.com');
  for (const path of ['positions', 'trips', 'events', 'reports/daily', 'geofences']) {
    assert.equal((await api('GET', `${dev.url}/${path}`, { token: stranger.accessToken })).status, 404, path);
  }
});

test('geofences: validation and owner-only changes', async () => {
  const dev = await ownedTracker();
  const token = dev.owner.accessToken;
  const viewer = await signup('viewer@x.com');
  await api('POST', `${dev.url}/viewers`, { token, body: { email: 'viewer@x.com' } });

  assert.equal((await api('POST', `${dev.url}/geofences`, { token, body: { name: 'X', type: 'polygon', points: [[1, 1], [2, 2]] } })).status, 400);
  assert.equal((await api('POST', `${dev.url}/geofences`, { token, body: { name: 'X', type: 'circle', center: { lat: 1, lon: 1 }, radiusM: 5 } })).status, 400);
  assert.equal((await api('POST', `${dev.url}/geofences`, { token, body: { name: 'X', type: 'square' } })).status, 400);

  const poly = await api('POST', `${dev.url}/geofences`, {
    token, body: { name: 'School', type: 'polygon', points: [[12.97, 77.59], [12.98, 77.59], [12.98, 77.6]], alertOnExit: false },
  });
  assert.equal(poly.status, 201);
  assert.equal(poly.body.data.alertOnExit, false);
  const fenceUrl = `${dev.url}/geofences/${poly.body.data.id}`;

  assert.equal((await api('POST', `${dev.url}/geofences`, { token: viewer.accessToken, body: { name: 'V', type: 'circle', center: { lat: 1, lon: 1 }, radiusM: 100 } })).status, 403);
  assert.equal((await api('GET', `${dev.url}/geofences`, { token: viewer.accessToken })).body.count, 1);

  assert.equal((await api('PATCH', fenceUrl, { token, body: { radiusM: 200 } })).status, 400);
  const renamed = await api('PATCH', fenceUrl, { token, body: { name: 'New school' } });
  assert.equal(renamed.body.data.name, 'New school');
  assert.equal((await api('DELETE', fenceUrl, { token: viewer.accessToken })).status, 403);
  assert.equal((await api('DELETE', fenceUrl, { token })).status, 204);
  assert.equal((await api('DELETE', fenceUrl, { token })).status, 404);
});

test('share links: public live view, revoke, expiry', async () => {
  const dev = await ownedTracker();
  const token = dev.owner.accessToken;
  sendPoint(dev, Date.now() - 5000, { lat: 12.975, speed: 30, acc: true });

  const link = await api('POST', `${dev.url}/share-links`, { token, body: { expiresInMinutes: 30 } });
  assert.equal(link.status, 201);
  const pub = await api('GET', link.body.data.apiUrl);
  assert.equal(pub.status, 200);
  assert.equal(pub.body.data.name, 'Test car');
  assert.equal(pub.body.data.live.lat, 12.975);
  assert.equal(pub.body.data.live.batteryLevel, undefined, 'only basic fields are public');

  assert.equal((await api('GET', `${dev.url}/share-links`, { token })).body.count, 1);
  assert.equal((await api('DELETE', `${dev.url}/share-links/${link.body.data.token}`, { token })).status, 204);
  assert.equal((await api('GET', link.body.data.apiUrl)).status, 404);

  const old = await api('POST', `${dev.url}/share-links`, { token, body: {} });
  await ctx.prisma.shareLink.update({ where: { token: old.body.data.token }, data: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await api('GET', old.body.data.apiUrl)).status, 404);
  assert.equal((await api('POST', `${dev.url}/share-links`, { token, body: { expiresInMinutes: 99999 } })).status, 400);
});

test('commands: allow-listed types only, owner only, audit-logged', async () => {
  const dev = await ownedTracker();
  const token = dev.owner.accessToken;
  const viewer = await signup('viewer@x.com');
  await api('POST', `${dev.url}/viewers`, { token, body: { email: 'viewer@x.com' } });

  let res = await api('POST', `${dev.url}/commands`, { token, body: { type: 'locate' } });
  assert.equal(res.status, 409); // not connected in this test
  assert.equal(res.body.error.code, 'DEVICE_OFFLINE');
  const log = await ctx.prisma.commandLog.findFirst();
  assert.equal(log.command, 'WHERE#');
  assert.equal(log.userId, dev.owner.user.id);
  assert.equal(log.status, 'failed');

  assert.equal((await api('POST', `${dev.url}/commands`, { token, body: { type: 'relay' } })).status, 400);
  assert.equal((await api('POST', `${dev.url}/commands`, { token, body: { type: 'setInterval', seconds: 1 } })).status, 400);
  assert.equal((await api('POST', `${dev.url}/commands`, { token: viewer.accessToken, body: { type: 'locate' } })).status, 403);
});

// ---------------- WebSocket ----------------

function connect(auth) {
  const socket = io(ctx.base, { auth, transports: ['websocket'], reconnection: false, forceNew: true });
  const events = [];
  socket.onAny((name, payload) => events.push({ name, payload }));
  return new Promise((resolve) => {
    socket.on('connect', () => resolve({ socket, events }));
    socket.on('connect_error', (err) => resolve({ socket, events, error: err }));
  });
}
const emit = (socket, name, payload) => new Promise((r) => socket.emit(name, payload, r));

async function until(fn, ms = 2000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (fn()) return;
    await wait(20);
  }
  assert.fail('condition not met in time');
}

test('websocket: auth, subscribe, live updates, alerts, revocation', async () => {
  const dev = await ownedTracker();
  const token = dev.owner.accessToken;
  const friend = await signup('friend@x.com');
  const stranger = await signup('stranger@x.com');
  await api('POST', `${dev.url}/viewers`, { token, body: { email: 'friend@x.com' } });

  const anon = await connect({});
  assert.equal(anon.error.data.code, 'UNAUTHORIZED');
  anon.socket.close();

  const owner = await connect({ token });
  const sub = await emit(owner.socket, 'subscribe', { deviceId: dev.deviceId });
  assert.equal(sub.ok, true);
  assert.equal(sub.live.deviceId, dev.deviceId);

  const bad = await connect({ token: stranger.accessToken });
  assert.deepEqual(await emit(bad.socket, 'subscribe', { deviceId: dev.deviceId }), { ok: false, error: 'NOT_FOUND' });

  const viewer = await connect({ token: friend.accessToken });
  assert.equal((await emit(viewer.socket, 'subscribe', { deviceId: dev.deviceId })).ok, true);

  const link = await api('POST', `${dev.url}/share-links`, { token, body: { expiresInMinutes: 10 } });
  const shared = await connect({ shareToken: link.body.data.token });
  assert.equal(shared.error, undefined);

  // A location reaches owner, viewer and the share link; not the stranger.
  sendPoint(dev, Date.now() - 1000, { lat: 12.9711, speed: 25, acc: true });
  await until(() => [owner, viewer, shared].every((c) => c.events.some((e) => e.name === 'live' && e.payload.lat === 12.9711)));
  assert.equal(bad.events.filter((e) => e.name === 'live').length, 0);
  const sharedLive = shared.events.find((e) => e.name === 'live' && e.payload.lat === 12.9711).payload;
  assert.equal(sharedLive.batteryLevel, undefined, 'share links get position only');
  assert.equal(sharedLive.ignition, undefined);

  // Alerts go to members only.
  ctx.ingest.handleAlarm(dev.ctx, { type: 'alarm', alarm: 'power_cut', point: { gpsTime: new Date(), lat: 12.9711, lon: 77.59, speed: 0, course: 0, satellites: 9, valid: true } });
  await until(() => owner.events.some((e) => e.name === 'alert' && e.payload.type === 'power_cut'));
  await until(() => viewer.events.some((e) => e.name === 'alert'));
  assert.equal(shared.events.filter((e) => e.name === 'alert').length, 0);

  // Owner removes the friend -> friend's socket is told and stops receiving.
  await api('DELETE', `${dev.url}/members/${friend.user.id}`, { token });
  await until(() => viewer.events.some((e) => e.name === 'access_revoked'));

  // Revoking the share link disconnects that socket.
  await api('DELETE', `${dev.url}/share-links/${link.body.data.token}`, { token });
  await until(() => !shared.socket.connected);

  for (const c of [owner, bad, viewer, shared]) c.socket.close();
});

test('websocket: an invalid share token is refused', async () => {
  const c = await connect({ shareToken: 'not-a-real-token-123' });
  assert.equal(c.error.data.code, 'SHARE_LINK_INVALID');
  c.socket.close();
});
