// Service records: add/edit/delete, next service, estimated odometer, list flag, privacy, release.
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

const day = (offset) => new Date(Date.now() + offset * 86_400_000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

async function setup() {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: '359710049096001' } });
  const u = (await api('POST', '/api/v1/auth/register', { body: { email: 'o@x.com', password: 'correct horse battery', acceptTerms: true } })).body.data;
  const id = (await api('POST', '/api/v1/devices/claim', { token: u.accessToken, body: { imei: '359710049096001', activationCode: reg.body.data.activationCode } })).body.data.id;
  return { t: u.accessToken, id };
}

test('add, list, next service, estimated odometer, edit and delete', async () => {
  const { t, id } = await setup();
  let res = await api('GET', `/api/v1/devices/${id}/service`, { token: t });
  assert.deepEqual(res.body, { data: [], next: null, estimatedOdometerKm: null });

  res = await api('POST', `/api/v1/devices/${id}/service`, {
    token: t, body: { type: 'general', date: day(-20), odometerKm: 91330, garage: 'KG Auto Care', cost: 6850, nextDueDate: day(10) },
  });
  assert.equal(res.status, 201);
  const general = res.body.data;
  // A later record without a next date doesn't hide the general service's due date.
  await api('POST', `/api/v1/devices/${id}/service`, { token: t, body: { type: 'tyres', date: day(-5), cost: 12000 } });
  await ctx.prisma.trip.create({ data: { deviceId: id, startTime: new Date(Date.now() - 3 * 86_400_000), endTime: new Date(Date.now() - 3 * 86_400_000 + 3600_000), startLat: 11, startLon: 77, distanceM: 42_400 } });

  res = await api('GET', `/api/v1/devices/${id}/service`, { token: t });
  assert.deepEqual(res.body.data.map((r) => r.type), ['tyres', 'general']);
  assert.equal(res.body.next.date, day(10));
  assert.equal(res.body.next.daysLeft, 10);
  assert.ok(Math.abs(res.body.next.progress - 20 / 30) < 0.01);
  assert.equal(res.body.estimatedOdometerKm, 91330 + 42);

  // The vehicle list carries the next due date (for the Home badge).
  const list = (await api('GET', '/api/v1/devices', { token: t })).body.data;
  assert.equal(list[0].serviceDue, day(10));

  res = await api('PATCH', `/api/v1/devices/${id}/service/${general.id}`, { token: t, body: { garage: '', cost: 7000 } });
  assert.equal(res.body.data.garage, null);
  assert.equal(res.body.data.cost, 7000);
  assert.equal((await api('DELETE', `/api/v1/devices/${id}/service/${general.id}`, { token: t })).status, 204);
  res = await api('GET', `/api/v1/devices/${id}/service`, { token: t });
  assert.equal(res.body.next, null);
});

test('validation, viewers read only, strangers out, release deletes records', async () => {
  const { t, id } = await setup();
  const post = (body, token = t) => api('POST', `/api/v1/devices/${id}/service`, { token, body });
  assert.equal((await post({ type: 'wash', date: day(0) })).status, 400);
  assert.equal((await post({ type: 'oil', date: day(3) })).status, 400); // future
  assert.equal((await post({ type: 'oil', date: day(-3), nextDueDate: day(-4) })).status, 400);
  assert.equal((await post({ type: 'oil', date: '24/10/2026' })).status, 400);
  assert.equal((await post({ type: 'oil', date: day(-1), cost: -5 })).status, 400);
  assert.equal((await post({ type: 'oil', date: day(-1), nextDueDate: day(90) })).status, 201);

  const v = (await api('POST', '/api/v1/auth/register', { body: { email: 'v@x.com', password: 'correct horse battery', acceptTerms: true } })).body.data;
  await api('POST', `/api/v1/devices/${id}/viewers`, { token: t, body: { email: 'v@x.com' } });
  assert.equal((await api('GET', `/api/v1/devices/${id}/service`, { token: v.accessToken })).body.data.length, 1);
  assert.equal((await post({ type: 'oil', date: day(-1) }, v.accessToken)).status, 403);

  const s = (await api('POST', '/api/v1/auth/register', { body: { email: 's@x.com', password: 'correct horse battery', acceptTerms: true } })).body.data;
  assert.equal((await api('GET', `/api/v1/devices/${id}/service`, { token: s.accessToken })).status, 404);

  await api('POST', `/api/v1/devices/${id}/release`, { token: t, body: { confirmImei: '359710049096001' } });
  assert.equal(await ctx.prisma.serviceRecord.count({ where: { deviceId: id } }), 0);
});
