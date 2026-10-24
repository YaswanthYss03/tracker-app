// Endpoints added for the mobile app: forgot/reset password, alerts feed, app config.
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');

const PASSWORD = 'correct horse battery';
let ctx;

test.before(async () => {
  ctx = await startApp();
});
test.after(async () => ctx.close());
test.beforeEach(async () => {
  await resetData(ctx.prisma);
  ctx.emails.length = 0;
});

const api = (...args) => ctx.api(...args);
async function signup(email) {
  const res = await api('POST', '/api/v1/auth/register', { body: { email, password: PASSWORD, acceptTerms: true } });
  return res.body.data;
}
const lastCode = () => ctx.emails.at(-1).text.match(/\b(\d{6})\b/)[1];

test('forgot password: unknown email looks the same and sends nothing', async () => {
  const res = await api('POST', '/api/v1/auth/forgot-password', { body: { email: 'nobody@x.com' } });
  assert.equal(res.status, 204);
  assert.equal(ctx.emails.length, 0);
});

test('reset with the emailed code; old sessions end; code works once', async () => {
  const { refreshToken } = await signup('a@x.com');
  assert.equal((await api('POST', '/api/v1/auth/forgot-password', { body: { email: 'A@x.com' } })).status, 204);
  assert.equal(ctx.emails.length, 1);
  assert.equal(ctx.emails[0].to, 'a@x.com');
  const code = lastCode();

  let res = await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code: code === '000000' ? '111111' : '000000', newPassword: 'brand new pass' } });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'INVALID_CODE');

  res = await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code, newPassword: 'brand new pass' } });
  assert.equal(res.status, 204);
  assert.equal((await api('POST', '/api/v1/auth/refresh', { body: { refreshToken } })).status, 401, 'old sessions revoked');
  assert.equal((await api('POST', '/api/v1/auth/login', { body: { email: 'a@x.com', password: 'brand new pass' } })).status, 200);
  assert.equal((await api('POST', '/api/v1/auth/login', { body: { email: 'a@x.com', password: PASSWORD } })).status, 401);

  res = await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code, newPassword: 'another pass 1' } });
  assert.equal(res.status, 400, 'a code works only once');
});

test('5 wrong codes kill the code; a new request replaces the old code', async () => {
  await signup('a@x.com');
  await api('POST', '/api/v1/auth/forgot-password', { body: { email: 'a@x.com' } });
  const first = lastCode();
  const wrong = first === '123456' ? '654321' : '123456';
  for (let i = 0; i < 5; i++) {
    await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code: wrong, newPassword: 'brand new pass' } });
  }
  let res = await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code: first, newPassword: 'brand new pass' } });
  assert.equal(res.status, 400, 'blocked after 5 wrong tries');

  await api('POST', '/api/v1/auth/forgot-password', { body: { email: 'a@x.com' } });
  await api('POST', '/api/v1/auth/forgot-password', { body: { email: 'a@x.com' } });
  const [older, newest] = [ctx.emails.at(-2).text.match(/\b(\d{6})\b/)[1], lastCode()];
  if (older !== newest) {
    res = await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code: older, newPassword: 'brand new pass' } });
    assert.equal(res.status, 400, 'only the newest code works');
  }
  res = await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code: newest, newPassword: 'brand new pass' } });
  assert.equal(res.status, 204);
  assert.equal((await api('POST', '/api/v1/auth/reset-password', { body: { email: 'a@x.com', code: 'abc', newPassword: 'brand new pass' } })).status, 400);
});

test('/me/events: alerts from all trackers I can see, with tracker names', async () => {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: '359710049095095' } });
  const owner = await signup('owner@x.com');
  const friend = await signup('friend@x.com');
  const stranger = await signup('stranger@x.com');
  const claim = await api('POST', '/api/v1/devices/claim', {
    token: owner.accessToken, body: { imei: '359710049095095', activationCode: reg.body.data.activationCode, name: 'Bike' },
  });
  await api('POST', `/api/v1/devices/${claim.body.data.id}/viewers`, { token: owner.accessToken, body: { email: 'friend@x.com' } });
  await ctx.prisma.event.createMany({
    data: [
      { deviceId: claim.body.data.id, time: new Date(), type: 'ignition_on' },
      { deviceId: claim.body.data.id, time: new Date(Date.now() - 10 * 86_400_000), type: 'sos' }, // too old for the default 7 days
    ],
  });

  let res = await api('GET', '/api/v1/me/events', { token: owner.accessToken });
  assert.equal(res.body.count, 1);
  assert.equal(res.body.data[0].deviceName, 'Bike');
  assert.equal(res.body.data[0].type, 'ignition_on');
  assert.equal((await api('GET', '/api/v1/me/events?days=14', { token: friend.accessToken })).body.count, 2);
  assert.equal((await api('GET', '/api/v1/me/events', { token: stranger.accessToken })).body.count, 0);
  assert.equal((await api('GET', '/api/v1/me/events')).status, 401);
});

test('/app/config tells the app its minimum version', async () => {
  const res = await api('GET', '/api/v1/app/config');
  assert.equal(res.status, 200);
  assert.match(res.body.data.minVersion, /^\d+\.\d+\.\d+$/);
});

test('vehicle type: set when claiming, changed later, bad values rejected', async () => {
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: '359710049095111' } });
  const owner = await signup('van@x.com');
  const claim = await api('POST', '/api/v1/devices/claim', {
    token: owner.accessToken, body: { imei: '359710049095111', activationCode: reg.body.data.activationCode, vehicleType: 'bus' },
  });
  assert.equal(claim.status, 201);
  assert.equal(claim.body.data.icon, 'bus');
  const id = claim.body.data.id;
  let res = await api('PATCH', `/api/v1/devices/${id}`, { token: owner.accessToken, body: { icon: 'truck' } });
  assert.equal(res.body.data.icon, 'truck');
  res = await api('PATCH', `/api/v1/devices/${id}`, { token: owner.accessToken, body: { icon: 'spaceship' } });
  assert.equal(res.status, 400);
  res = await api('POST', '/api/v1/devices/claim', {
    token: owner.accessToken, body: { imei: '359710049095111', activationCode: 'XXXXX-XXXXX', vehicleType: 'plane' },
  });
  assert.equal(res.status, 400);
});
