// Drivers: list, create with vehicles, main/backup on vehicles, photo, privacy.
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

async function user(email) {
  return (await api('POST', '/api/v1/auth/register', { body: { email, password: 'correct horse battery', acceptTerms: true } })).body.data;
}
async function vehicle(u, imei, plate) {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei } });
  return (await api('POST', '/api/v1/devices/claim', { token: u.accessToken, body: { imei, activationCode: reg.body.data.activationCode, registrationNumber: plate } })).body.data.id;
}
// Smallest valid JPEG header + padding (the server checks the magic bytes and size).
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 1)]).toString('base64');

test('create a driver for vehicles, edit, main/backup on a vehicle, delete', async () => {
  const u = await user('d1@x.com');
  const v1 = await vehicle(u, '359710049097001', 'TN 38 BX 4521');
  const v2 = await vehicle(u, '359710049097002', 'TN 37 CK 1187');
  const t = u.accessToken;

  let res = await api('POST', '/api/v1/drivers', { token: t, body: { name: 'Arun Kumar', phone: '+91 90000 00101', licenceNo: 'tn99 2011 0009931', licenceExpiry: '2027-11-12', avatar: 'a3', mainVehicleIds: [v1, v2] } });
  assert.equal(res.status, 201);
  const arun = res.body.data;
  assert.equal(arun.licenceNo, 'TN99 2011 0009931');
  assert.equal(arun.licenceExpiry, '2027-11-12');
  assert.equal(arun.mainOf.length, 2);

  res = await api('POST', '/api/v1/drivers', { token: t, body: { name: 'Karthik Raja', phone: '' } });
  const karthik = res.body.data;
  assert.equal(karthik.phone, null);

  // Backup on v1, then swap.
  res = await api('PATCH', `/api/v1/devices/${v1}`, { token: t, body: { backupDriverId: karthik.id, color: 'orange' } });
  assert.equal(res.body.data.mainDriver.name, 'Arun Kumar');
  assert.equal(res.body.data.backupDriver.name, 'Karthik Raja');
  assert.equal(res.body.data.driverName, 'Arun Kumar');
  assert.equal(res.body.data.color, 'orange');
  res = await api('PATCH', `/api/v1/devices/${v1}`, { token: t, body: { mainDriverId: karthik.id, backupDriverId: arun.id } });
  assert.equal(res.body.data.mainDriver.id, karthik.id);
  assert.equal(res.body.data.backupDriver.id, arun.id);
  assert.equal((await api('PATCH', `/api/v1/devices/${v1}`, { token: t, body: { mainDriverId: arun.id, backupDriverId: arun.id } })).status, 400);

  // Arun main of v2 only now (v1's main is Karthik).
  res = await api('GET', '/api/v1/drivers', { token: t });
  const listed = Object.fromEntries(res.body.data.map((d) => [d.name, d]));
  assert.deepEqual(listed['Arun Kumar'].mainOf.map((v) => v.id), [v2]);
  assert.deepEqual(listed['Arun Kumar'].backupOf.map((v) => v.id), [v1]);

  // Make Arun main of v1 again via the driver: removes him as backup there, and from v2.
  res = await api('PATCH', `/api/v1/drivers/${arun.id}`, { token: t, body: { mainVehicleIds: [v1] } });
  assert.deepEqual(res.body.data.mainOf.map((v) => v.id), [v1]);
  assert.deepEqual(res.body.data.backupOf, []);
  const d2 = (await api('GET', `/api/v1/devices/${v2}`, { token: t })).body.data;
  assert.equal(d2.mainDriver, null);

  // Delete: the vehicle loses the driver.
  assert.equal((await api('DELETE', `/api/v1/drivers/${arun.id}`, { token: t })).status, 204);
  assert.equal((await api('GET', `/api/v1/devices/${v1}`, { token: t })).body.data.mainDriver, null);
});

test('validation and other users', async () => {
  const u = await user('d2@x.com');
  const other = await user('d3@x.com');
  const theirs = await vehicle(other, '359710049097003', 'TN 99 D 7745');
  const t = u.accessToken;
  assert.equal((await api('POST', '/api/v1/drivers', { token: t, body: { name: '' } })).status, 400);
  assert.equal((await api('POST', '/api/v1/drivers', { token: t, body: { name: 'A', phone: 'call me' } })).status, 400);
  assert.equal((await api('POST', '/api/v1/drivers', { token: t, body: { name: 'A', licenceExpiry: '12/11/2026' } })).status, 400);
  assert.equal((await api('POST', '/api/v1/drivers', { token: t, body: { name: 'A', mainVehicleIds: [theirs] } })).status, 400);
  const mine = (await api('POST', '/api/v1/drivers', { token: t, body: { name: 'Mine' } })).body.data;
  // Other user can't see, edit or assign my driver.
  assert.equal((await api('GET', `/api/v1/drivers/${mine.id}`, { token: other.accessToken })).status, 404);
  assert.equal((await api('PATCH', `/api/v1/drivers/${mine.id}`, { token: other.accessToken, body: { name: 'X' } })).status, 404);
  assert.equal((await api('PATCH', `/api/v1/devices/${theirs}`, { token: other.accessToken, body: { mainDriverId: mine.id } })).status, 400);
});

test('photo: upload, viewers of the vehicle can see it, strangers cannot, release clears drivers', async () => {
  const u = await user('d4@x.com');
  const fam = await user('d5@x.com');
  const stranger = await user('d6@x.com');
  const v = await vehicle(u, '359710049097004', 'TN 66 AF 9032');
  const t = u.accessToken;
  const d = (await api('POST', '/api/v1/drivers', { token: t, body: { name: 'Priya', mainVehicleIds: [v] } })).body.data;

  assert.equal((await api('PUT', `/api/v1/drivers/${d.id}/photo`, { token: t, body: { image: Buffer.alloc(300, 7).toString('base64') } })).status, 400);
  let res = await api('PUT', `/api/v1/drivers/${d.id}/photo`, { token: t, body: { image: JPEG } });
  assert.equal(res.status, 200);
  assert.match(res.body.data.photoUrl, new RegExp(`^/api/v1/drivers/${d.id}/photo\\?v=\\d+$`));

  const get = (token) => fetch(`${ctx.base}/api/v1/drivers/${d.id}/photo`, { headers: { authorization: `Bearer ${token}` } });
  let r = await get(t);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-type'), 'image/jpeg');
  assert.equal((await get(fam.accessToken)).status, 404);
  await api('POST', `/api/v1/devices/${v}/viewers`, { token: t, body: { email: 'd5@x.com' } });
  assert.equal((await get(fam.accessToken)).status, 200);
  assert.equal((await get(stranger.accessToken)).status, 404);
  // The viewer sees the driver on the vehicle.
  assert.equal((await api('GET', `/api/v1/devices/${v}`, { token: fam.accessToken })).body.data.mainDriver.name, 'Priya');

  await api('POST', `/api/v1/devices/${v}/release`, { token: t, body: { confirmImei: '359710049097004' } });
  const dev = await ctx.prisma.device.findUnique({ where: { id: v } });
  assert.equal(dev.mainDriverId, null);
  assert.equal((await api('GET', `/api/v1/drivers/${d.id}`, { token: t })).body.data.mainOf.length, 0);
  r = await api('DELETE', `/api/v1/drivers/${d.id}/photo`, { token: t });
  assert.equal(r.body.data.photoUrl, null);
});
