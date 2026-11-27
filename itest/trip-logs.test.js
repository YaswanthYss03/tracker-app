// Hand-started trips: new data belongs to the latest trip until the next one is started.
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');

let ctx;
test.before(async () => {
  ctx = await startApp();
});
test.after(async () => ctx.close());
test.beforeEach(async () => resetData(ctx.prisma));
const api = (...a) => ctx.api(...a);

async function setup() {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: '359710049097001' } });
  const u = (await api('POST', '/api/v1/auth/register', { body: { email: 'o@x.com', password: 'correct horse battery', acceptTerms: true } })).body.data;
  const id = (await api('POST', '/api/v1/devices/claim', { token: u.accessToken, body: { imei: '359710049097001', activationCode: reg.body.data.activationCode } })).body.data.id;
  return { t: u.accessToken, id };
}

/** n positions 10 s apart, ~111 m apart (about 40 km/h), from `start`. */
async function drive(deviceId, start, n, { lat0 = 11, speed = 40 } = {}) {
  await ctx.prisma.position.createMany({
    data: Array.from({ length: n }, (_, i) => ({
      deviceId, gpsTime: new Date(start.getTime() + i * 10_000), lat: lat0 + i * 0.001, lon: 77, speed, course: 0, satellites: 8, valid: true,
    })),
  });
}

test('data belongs to the latest trip; starting a new one splits it; delete merges back', async () => {
  const { t, id } = await setup();
  const url = `/api/v1/devices/${id}/trip-logs`;
  assert.deepEqual((await api('GET', url, { token: t })).body.data, []);

  // Two trips started by hand (start times moved back so the windows are fixed).
  const first = (await api('POST', url, { token: t, body: { name: 'Delivery' } })).body.data;
  assert.equal(first.number, 1);
  assert.equal(first.name, 'Delivery');
  assert.equal(first.current, true);
  const second = (await api('POST', url, { token: t, body: {} })).body.data;
  assert.equal(second.number, 2);
  assert.equal(second.name, 'Trip 2'); // default name when none is given
  const now = Date.now();
  await ctx.prisma.tripLog.update({ where: { id: first.id }, data: { startedAt: new Date(now - 3 * 3600_000) } });
  await ctx.prisma.tripLog.update({ where: { id: second.id }, data: { startedAt: new Date(now - 3600_000) } });

  await drive(id, new Date(now - 4 * 3600_000), 3); // before any trip: belongs to none
  await drive(id, new Date(now - 2.5 * 3600_000), 5, { speed: 40 }); // trip 1
  await drive(id, new Date(now - 30 * 60_000), 3, { speed: 60, lat0: 12 }); // trip 2 (current)

  let list = (await api('GET', url, { token: t })).body.data;
  assert.deepEqual(list.map((l) => [l.number, l.current, l.points]), [[2, true, 3], [1, false, 5]]);
  assert.equal(list[0].maxSpeed, 60);
  assert.equal(list[1].maxSpeed, 40);
  assert.equal(list[1].endedAt, list[0].startedAt);
  assert.ok(Math.abs(list[1].distanceKm - 0.4) < 0.1, `distance ${list[1].distanceKm}`);
  assert.equal(list[1].durationS, 40);

  // Route of one trip: same shape as the automatic trips, only its own points.
  let res = await api('GET', `${url}/${first.id}/route`, { token: t });
  assert.equal(res.body.data.points.length, 5);
  assert.equal(res.body.data.trip.inProgress, false);
  res = await api('GET', `${url}/${second.id}/route`, { token: t });
  assert.equal(res.body.data.points.length, 3);
  assert.equal(res.body.data.trip.inProgress, true);

  // Deleting the current trip gives its data back to the one before it.
  assert.equal((await api('DELETE', `${url}/${second.id}`, { token: t })).status, 204);
  list = (await api('GET', url, { token: t })).body.data;
  assert.deepEqual(list.map((l) => [l.number, l.current, l.points]), [[1, true, 8]]);
});

test('a trip with no data yet is fine: empty route, zero numbers', async () => {
  const { t, id } = await setup();
  const url = `/api/v1/devices/${id}/trip-logs`;
  const fresh = (await api('POST', url, { token: t, body: {} })).body.data;
  assert.equal(fresh.name, 'Trip 1');
  assert.deepEqual([fresh.distanceKm, fresh.durationS, fresh.maxSpeed, fresh.points], [0, 0, 0, 0]);
  const res = await api('GET', `${url}/${fresh.id}/route`, { token: t });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.points.length, 0);
  assert.equal(res.body.data.trip.inProgress, true);
  assert.equal(res.body.data.trip.distanceKm, 0);
});

test('only the owner starts or deletes trips; strangers are out; name is limited', async () => {
  const { t, id } = await setup();
  const url = `/api/v1/devices/${id}/trip-logs`;
  const other = (await api('POST', '/api/v1/auth/register', { body: { email: 's@x.com', password: 'correct horse battery', acceptTerms: true } })).body.data;
  assert.ok([403, 404].includes((await api('GET', url, { token: other.accessToken })).status));
  assert.ok([403, 404].includes((await api('POST', url, { token: other.accessToken, body: {} })).status));
  assert.equal((await api('POST', url, { token: t, body: { name: 'x'.repeat(61) } })).status, 400);
  assert.equal((await api('POST', url, { body: {} })).status, 401);
  assert.equal((await api('DELETE', `${url}/00000000-0000-4000-8000-000000000000`, { token: t })).status, 404);
});
