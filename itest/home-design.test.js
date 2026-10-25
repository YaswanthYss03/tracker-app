// Vehicle number + driver, today's distance, and the all-vehicles trips list.
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

test('vehicle number and driver: set on claim, edited later, validated, cleared on release', async () => {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: '359710049098001' } });
  const u = (await api('POST', '/api/v1/auth/register', { body: { email: 'a@x.com', password: 'correct horse battery', acceptTerms: true } })).body.data;
  const claim = await api('POST', '/api/v1/devices/claim', {
    token: u.accessToken, body: { imei: '359710049098001', activationCode: reg.body.data.activationCode, registrationNumber: 'tn 66  af 9032', driverName: 'Priya' },
  });
  assert.equal(claim.body.data.registrationNumber, 'TN 66 AF 9032');
  assert.equal(claim.body.data.driverName, 'Priya');
  const id = claim.body.data.id;
  let res = await api('PATCH', `/api/v1/devices/${id}`, { token: u.accessToken, body: { driverName: 'Ravi' } });
  assert.equal(res.body.data.driverName, 'Ravi');
  res = await api('PATCH', `/api/v1/devices/${id}`, { token: u.accessToken, body: { registrationNumber: '#' } });
  assert.equal(res.status, 400);
  await api('POST', `/api/v1/devices/${id}/release`, { token: u.accessToken, body: { confirmImei: '359710049098001' } });
  const d = await ctx.prisma.device.findUnique({ where: { id } });
  assert.equal(d.registrationNumber, null);
  assert.equal(d.driverName, null);
});

test('vehicle list includes km driven today; /me/trips lists trips of all vehicles', async () => {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: '359710049098002' } });
  const u = (await api('POST', '/api/v1/auth/register', { body: { email: 'b@x.com', password: 'correct horse battery', acceptTerms: true } })).body.data;
  const id = (await api('POST', '/api/v1/devices/claim', { token: u.accessToken, body: { imei: '359710049098002', activationCode: reg.body.data.activationCode, registrationNumber: 'TN 37 BQ 6603' } })).body.data.id;
  const now = Date.now();
  await ctx.prisma.trip.createMany({
    data: [
      { deviceId: id, startTime: new Date(now - 20 * 60_000), endTime: new Date(now - 5 * 60_000), startLat: 11, startLon: 77, distanceM: 12345 },
      { deviceId: id, startTime: new Date(now - 3 * 86_400_000), endTime: new Date(now - 3 * 86_400_000 + 60_000), startLat: 11, startLon: 77, distanceM: 99000 },
    ],
  });
  const list = (await api('GET', '/api/v1/devices', { token: u.accessToken })).body.data;
  assert.equal(list[0].todayKm, 12.3);
  const trips = (await api('GET', '/api/v1/me/trips?days=7', { token: u.accessToken })).body;
  assert.equal(trips.count, 2);
  assert.equal(trips.data[0].vehicle.registrationNumber, 'TN 37 BQ 6603');
  assert.equal((await api('GET', '/api/v1/me/trips?days=1', { token: u.accessToken })).body.count, 1);
});
