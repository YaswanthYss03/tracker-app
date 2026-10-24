// Admin panel API: admin login (role), search, edit, bulk register, delete, roles.
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');

const PASSWORD = 'correct horse battery';
let ctx;

test.before(async () => {
  ctx = await startApp();
});
test.after(async () => ctx.close());
test.beforeEach(async () => resetData(ctx.prisma));

const api = (...args) => ctx.api(...args);

async function signup(email) {
  const res = await api('POST', '/api/v1/auth/register', { body: { email, password: PASSWORD, acceptTerms: true } });
  return res.body.data;
}

async function adminUser(email = 'admin@x.com') {
  const u = await signup(email);
  await ctx.prisma.user.update({ where: { id: u.user.id }, data: { role: 'admin' } });
  return u; // token issued before promotion still works: the role is checked in the DB
}

test('admin endpoints accept an admin login, refuse normal users', async () => {
  const admin = await adminUser();
  const user = await signup('user@x.com');
  assert.equal((await api('GET', '/api/v1/admin/devices', { token: admin.accessToken })).status, 200);
  assert.equal((await api('GET', '/api/v1/admin/devices', { token: user.accessToken })).status, 403);
  assert.equal((await api('GET', '/api/v1/admin/devices')).status, 401);
  assert.equal((await api('GET', '/api/v1/admin/devices', { key: 'wrong-key' })).status, 401);
  assert.equal((await api('GET', '/api/v1/admin/devices', { key: ctx.adminKey })).status, 200);

  // Demoted admin loses access immediately, even with a valid token.
  await ctx.prisma.user.update({ where: { id: admin.user.id }, data: { role: 'user' } });
  assert.equal((await api('GET', '/api/v1/admin/devices', { token: admin.accessToken })).status, 403);
});

test('bulk register, search with total, edit, suspend', async () => {
  const { accessToken: token } = await adminUser();
  let res = await api('POST', '/api/v1/admin/devices/bulk', { token, body: { firstImei: '359710049400000', count: 3 } });
  assert.equal(res.status, 201);
  assert.equal(res.body.created, 3);
  assert.match(res.body.data[0].activationCode, /^[A-Z0-9]{5}-[A-Z0-9]{5}$/);

  res = await api('POST', '/api/v1/admin/devices/bulk', { token, body: { imeis: ['359710049400002', '359710049499999'] } });
  assert.equal(res.body.created, 1);
  assert.equal(res.body.failed, 1, 'duplicate is reported, not fatal');

  res = await api('GET', '/api/v1/admin/devices?q=4940000&limit=2', { token });
  assert.equal(res.body.count, 2);
  assert.equal(res.body.total, 3);

  res = await api('PATCH', '/api/v1/admin/devices/359710049400000', { token, body: { simNumber: '9000012345', name: 'Shop demo' } });
  assert.equal(res.body.data.simNumber, '9000012345');
  res = await api('GET', '/api/v1/admin/devices?q=9000012', { token });
  assert.equal(res.body.total, 1, 'search by SIM');
  res = await api('GET', '/api/v1/admin/devices?q=shop', { token });
  assert.equal(res.body.total, 1, 'search by name, any case');

  res = await api('PATCH', '/api/v1/admin/devices/359710049400000', { token, body: { status: 'suspended', simNumber: null } });
  assert.equal(res.body.data.status, 'suspended');
  assert.equal(res.body.data.simNumber, null);
  assert.equal((await api('PATCH', '/api/v1/admin/devices/359710049400000', { token, body: { imei: '1' } })).status, 400);
});

test('delete: refused for claimed trackers unless forced; removes all data', async () => {
  const { accessToken: token } = await adminUser();
  const reg = await api('POST', '/api/v1/admin/devices', { token, body: { imei: '359710049500000' } });
  const owner = await signup('owner@x.com');
  await api('POST', '/api/v1/devices/claim', {
    token: owner.accessToken, body: { imei: '359710049500000', activationCode: reg.body.data.activationCode },
  });
  const device = await ctx.prisma.device.findUnique({ where: { imei: '359710049500000' } });
  await ctx.prisma.position.create({
    data: { deviceId: device.id, gpsTime: new Date(), lat: 12.97, lon: 77.59, speed: 0, course: 0, satellites: 8, valid: true },
  });

  let res = await api('DELETE', '/api/v1/admin/devices/359710049500000', { token });
  assert.equal(res.status, 409);
  res = await api('DELETE', '/api/v1/admin/devices/359710049500000?force=true', { token });
  assert.equal(res.status, 204);
  assert.equal(await ctx.prisma.device.count(), 0);
  assert.equal(await ctx.prisma.position.count(), 0);
  assert.equal((await api('GET', '/api/v1/devices', { token: owner.accessToken })).body.count, 0);
  assert.equal((await api('DELETE', '/api/v1/admin/devices/359710049500000', { token })).status, 404);
});

test('roles: promote and demote, but not yourself', async () => {
  const admin = await adminUser();
  const user = await signup('user@x.com');
  let res = await api('PATCH', `/api/v1/admin/users/${user.user.id}`, { token: admin.accessToken, body: { role: 'admin' } });
  assert.equal(res.body.data.role, 'admin');
  assert.equal((await api('GET', '/api/v1/admin/system', { token: user.accessToken })).status, 200);
  res = await api('PATCH', `/api/v1/admin/users/${admin.user.id}`, { token: admin.accessToken, body: { role: 'user' } });
  assert.equal(res.status, 400);
  res = await api('PATCH', '/api/v1/admin/users/00000000-0000-0000-0000-000000000000', { token: admin.accessToken, body: { role: 'admin' } });
  assert.equal(res.status, 404);
});
