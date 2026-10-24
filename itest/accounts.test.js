// Stage 2 integration tests: accounts, claiming, sharing, releasing.
// Needs the database: docker compose up -d db  →  npm run test:integration
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');

const IMEI = '359710049095095';
const PASSWORD = 'correct horse battery';
let ctx;

test.before(async () => {
  ctx = await startApp();
});
test.after(async () => ctx.close());
test.beforeEach(async () => resetData(ctx.prisma));

const api = (...args) => ctx.api(...args);

async function signup(email, name = 'Test') {
  const res = await api('POST', '/api/v1/auth/register', {
    body: { email, password: PASSWORD, name, acceptTerms: true },
  });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.data;
}

async function registerTracker(imei = IMEI) {
  const res = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei } });
  assert.equal(res.status, 201);
  return res.body.data.activationCode;
}

const claim = (token, activationCode, imei = IMEI) =>
  api('POST', '/api/v1/devices/claim', { token, body: { imei, activationCode } });

// ---------------------------------------------------------------------------

test('register: validates input and refuses duplicates', async () => {
  let res = await api('POST', '/api/v1/auth/register', { body: { email: 'a@x.com', password: PASSWORD } });
  assert.equal(res.status, 400);
  assert.ok(res.body.error.details.some((d) => d.field === 'acceptTerms'));

  res = await api('POST', '/api/v1/auth/register', { body: { email: 'bad', password: 'short', acceptTerms: true } });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.error.details.map((d) => d.field).sort(), ['email', 'password']);

  const user = await signup('Owner@Example.com');
  assert.equal(user.user.email, 'owner@example.com');
  assert.ok(user.accessToken && user.refreshToken);

  res = await api('POST', '/api/v1/auth/register', {
    body: { email: 'owner@example.com', password: PASSWORD, acceptTerms: true },
  });
  assert.equal(res.status, 409);
});

test('login, /me and token checks', async () => {
  await signup('a@x.com');
  let res = await api('POST', '/api/v1/auth/login', { body: { email: 'a@x.com', password: 'wrong-password' } });
  assert.equal(res.status, 401);
  res = await api('POST', '/api/v1/auth/login', { body: { email: 'nobody@x.com', password: PASSWORD } });
  assert.equal(res.status, 401);
  assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');

  res = await api('POST', '/api/v1/auth/login', { body: { email: 'A@x.com', password: PASSWORD } });
  assert.equal(res.status, 200);
  const { accessToken } = res.body.data;

  assert.equal((await api('GET', '/api/v1/me', { token: accessToken })).body.data.email, 'a@x.com');
  assert.equal((await api('GET', '/api/v1/me')).status, 401);
  assert.equal((await api('GET', '/api/v1/me', { token: 'garbage' })).status, 401);
  assert.equal((await api('GET', '/api/v1/devices', { token: accessToken + 'x' })).status, 401);
});

test('refresh rotates tokens; reusing an old one revokes the whole session family', async () => {
  const { refreshToken: first } = await signup('a@x.com');

  const r1 = await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: first } });
  assert.equal(r1.status, 200);
  const second = r1.body.data.refreshToken;
  assert.notEqual(second, first);

  // Old token reused (e.g. stolen) -> rejected, and the new one is revoked too.
  assert.equal((await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: first } })).status, 401);
  assert.equal((await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: second } })).status, 401);
});

test('logout revokes the refresh token', async () => {
  const { refreshToken } = await signup('a@x.com');
  assert.equal((await api('POST', '/api/v1/auth/logout', { body: { refreshToken } })).status, 204);
  assert.equal((await api('POST', '/api/v1/auth/refresh', { body: { refreshToken } })).status, 401);
});

test('changing the password logs out other sessions', async () => {
  const { accessToken, refreshToken } = await signup('a@x.com');
  let res = await api('POST', '/api/v1/me/password', {
    token: accessToken, body: { currentPassword: 'nope-nope', newPassword: 'new password 123' },
  });
  assert.equal(res.status, 401);
  res = await api('POST', '/api/v1/me/password', {
    token: accessToken, body: { currentPassword: PASSWORD, newPassword: 'new password 123' },
  });
  assert.equal(res.status, 204);
  assert.equal((await api('POST', '/api/v1/auth/refresh', { body: { refreshToken } })).status, 401);
  res = await api('POST', '/api/v1/auth/login', { body: { email: 'a@x.com', password: 'new password 123' } });
  assert.equal(res.status, 200);
});

test('claim: wrong code fails, right code makes you owner, others are refused', async () => {
  const code = await registerTracker();
  const a = await signup('a@x.com');
  const b = await signup('b@x.com');

  let res = await claim(a.accessToken, 'AAAAA-AAAAA');
  assert.equal(res.status, 400);
  assert.equal(res.body.error.code, 'INVALID_CLAIM');
  // Unknown IMEI gives the same answer (no way to probe which IMEIs exist).
  res = await claim(a.accessToken, code, '123456789012345');
  assert.equal(res.body.error.code, 'INVALID_CLAIM');

  res = await claim(a.accessToken, code.toLowerCase().replace('-', ' ')); // forgiving format
  assert.equal(res.status, 201);
  assert.equal(res.body.data.role, 'owner');
  assert.equal(res.body.data.status, 'active');
  assert.equal(res.body.data.imei, IMEI);

  assert.equal((await claim(a.accessToken, code)).status, 200); // already yours
  res = await claim(b.accessToken, code);
  assert.equal(res.status, 409);

  const list = await api('GET', '/api/v1/devices', { token: a.accessToken });
  assert.equal(list.body.count, 1);
  assert.equal((await api('GET', '/api/v1/devices', { token: b.accessToken })).body.count, 0);
});

test('claim: 5 wrong codes lock the tracker for an hour, admin reset clears it', async () => {
  await registerTracker();
  const a = await signup('a@x.com');
  for (let i = 0; i < 5; i++) assert.equal((await claim(a.accessToken, 'WRONG-CODE1')).status, 400);

  const reset = await api('POST', `/api/v1/admin/devices/${IMEI}/reset-code`, { key: ctx.adminKey });
  // Locked even with a correct code... (use the old code path: check the lock first)
  const locked = await ctx.prisma.device.findUnique({ where: { imei: IMEI } });
  assert.equal(locked.claimLockedUntil, null, 'reset-code clears the lock');

  const res = await claim(a.accessToken, reset.body.data.activationCode);
  assert.equal(res.status, 201);
});

test('claim: lock blocks even the correct code', async () => {
  const code = await registerTracker();
  const a = await signup('a@x.com');
  for (let i = 0; i < 5; i++) await claim(a.accessToken, 'WRONG-CODE1');
  const res = await claim(a.accessToken, code);
  assert.equal(res.status, 429);
  assert.equal(res.body.error.code, 'CLAIM_LOCKED');
});

test('claim: suspended trackers cannot be claimed', async () => {
  const code = await registerTracker();
  await api('PATCH', `/api/v1/admin/devices/${IMEI}`, { key: ctx.adminKey, body: { status: 'suspended' } });
  const a = await signup('a@x.com');
  const res = await claim(a.accessToken, code);
  assert.equal(res.status, 403);
  assert.equal(res.body.error.code, 'DEVICE_SUSPENDED');
});

test('access control: strangers get 404, viewers can read but not change', async () => {
  const code = await registerTracker();
  const owner = await signup('owner@x.com');
  const friend = await signup('friend@x.com');
  const stranger = await signup('stranger@x.com');
  const deviceId = (await claim(owner.accessToken, code)).body.data.id;
  const url = `/api/v1/devices/${deviceId}`;

  assert.equal((await api('GET', url, { token: stranger.accessToken })).status, 404);
  assert.equal((await api('GET', '/api/v1/devices/not-a-uuid', { token: owner.accessToken })).status, 404);

  // Share with friend
  let res = await api('POST', `${url}/viewers`, { token: owner.accessToken, body: { email: 'FRIEND@x.com' } });
  assert.equal(res.status, 201);
  assert.equal((await api('POST', `${url}/viewers`, { token: owner.accessToken, body: { email: 'friend@x.com' } })).status, 409);
  assert.equal((await api('POST', `${url}/viewers`, { token: owner.accessToken, body: { email: 'ghost@x.com' } })).status, 404);

  res = await api('GET', url, { token: friend.accessToken });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.role, 'viewer');
  assert.equal(res.body.data.simNumber, undefined);
  assert.equal((await api('GET', `${url}/live`, { token: friend.accessToken })).status, 200);

  // Viewer can't change settings, share, see members or release
  assert.equal((await api('PATCH', url, { token: friend.accessToken, body: { name: 'Mine' } })).status, 403);
  assert.equal((await api('POST', `${url}/viewers`, { token: friend.accessToken, body: { email: 'stranger@x.com' } })).status, 403);
  assert.equal((await api('GET', `${url}/members`, { token: friend.accessToken })).status, 403);
  assert.equal((await api('POST', `${url}/release`, { token: friend.accessToken, body: { confirmImei: IMEI } })).status, 403);

  // Viewer can toggle their own notifications
  res = await api('PATCH', `${url}/notifications`, { token: friend.accessToken, body: { enabled: false } });
  assert.deepEqual(res.body.data, { notify: false });

  // Owner settings
  res = await api('PATCH', url, { token: owner.accessToken, body: { name: 'Family car', speedLimitKmh: 80, timezone: 'Asia/Kolkata' } });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.name, 'Family car');
  assert.equal((await api('PATCH', url, { token: owner.accessToken, body: { timezone: 'Mars/Base' } })).status, 400);
  assert.equal((await api('PATCH', url, { token: owner.accessToken, body: { imei: '1' } })).status, 400);

  // Members; owner removes the friend
  res = await api('GET', `${url}/members`, { token: owner.accessToken });
  assert.deepEqual(res.body.data.map((m) => m.role), ['owner', 'viewer']);
  const friendId = res.body.data[1].userId;
  assert.equal((await api('DELETE', `${url}/members/${friendId}`, { token: owner.accessToken })).status, 204);
  assert.equal((await api('GET', url, { token: friend.accessToken })).status, 404);
});

test('a viewer can leave; the owner cannot leave without releasing', async () => {
  const code = await registerTracker();
  const owner = await signup('owner@x.com');
  const friend = await signup('friend@x.com');
  const deviceId = (await claim(owner.accessToken, code)).body.data.id;
  const url = `/api/v1/devices/${deviceId}`;
  await api('POST', `${url}/viewers`, { token: owner.accessToken, body: { email: 'friend@x.com' } });

  const ownerId = owner.user.id;
  assert.equal((await api('DELETE', `${url}/members/${ownerId}`, { token: friend.accessToken })).status, 403);
  assert.equal((await api('DELETE', `${url}/members/${ownerId}`, { token: owner.accessToken })).status, 400);
  assert.equal((await api('DELETE', `${url}/members/${friend.user.id}`, { token: friend.accessToken })).status, 204);
});

test('claim wipes old history but keeps the live position; release wipes everything', async () => {
  const code = await registerTracker();
  const device = await ctx.prisma.device.findUnique({ where: { imei: IMEI } });
  // Factory test data recorded before the sale
  await ctx.prisma.device.update({ where: { id: device.id }, data: { lastLat: 12.97, lastLon: 77.59, lastGpsTime: new Date() } });
  await ctx.prisma.position.create({
    data: { deviceId: device.id, gpsTime: new Date(), lat: 12.97, lon: 77.59, speed: 0, course: 0, satellites: 8, valid: true },
  });

  const owner = await signup('owner@x.com');
  const res = await claim(owner.accessToken, code);
  assert.equal(res.body.data.live.lat, 12.97);
  assert.equal(await ctx.prisma.position.count({ where: { deviceId: device.id } }), 0);

  // New data after the claim, then release
  await ctx.prisma.position.create({
    data: { deviceId: device.id, gpsTime: new Date(), lat: 13, lon: 77.6, speed: 30, course: 0, satellites: 8, valid: true },
  });
  const url = `/api/v1/devices/${device.id}`;
  assert.equal((await api('POST', `${url}/release`, { token: owner.accessToken, body: { confirmImei: 'wrong' } })).status, 400);
  assert.equal((await api('POST', `${url}/release`, { token: owner.accessToken, body: { confirmImei: IMEI } })).status, 204);

  const after = await ctx.prisma.device.findUnique({ where: { id: device.id } });
  assert.equal(after.status, 'inventory');
  assert.equal(after.lastLat, null);
  assert.equal(await ctx.prisma.position.count({ where: { deviceId: device.id } }), 0);
  assert.equal((await api('GET', url, { token: owner.accessToken })).status, 404);

  // The next buyer claims with the same code from the box
  const buyer = await signup('buyer@x.com');
  assert.equal((await claim(buyer.accessToken, code)).status, 201);
});

test('deleting an account releases owned trackers and removes the user', async () => {
  const code = await registerTracker();
  const owner = await signup('owner@x.com');
  const deviceId = (await claim(owner.accessToken, code)).body.data.id;

  assert.equal((await api('DELETE', '/api/v1/me', { token: owner.accessToken, body: { password: 'wrong-one' } })).status, 401);
  assert.equal((await api('DELETE', '/api/v1/me', { token: owner.accessToken, body: { password: PASSWORD } })).status, 204);

  assert.equal(await ctx.prisma.user.count(), 0);
  const device = await ctx.prisma.device.findUnique({ where: { id: deviceId } });
  assert.equal(device.status, 'inventory');
  assert.equal((await api('POST', '/api/v1/auth/refresh', { body: { refreshToken: owner.refreshToken } })).status, 401);
  // Old access token still parses but the account is gone
  assert.equal((await api('GET', '/api/v1/me', { token: owner.accessToken })).status, 401);
});

test('admin: device shows members; admin release; user search', async () => {
  const code = await registerTracker();
  const owner = await signup('owner@x.com');
  await claim(owner.accessToken, code);

  let res = await api('GET', `/api/v1/admin/devices/${IMEI}`, { key: ctx.adminKey });
  assert.equal(res.body.data.members[0].email, 'owner@x.com');
  assert.equal(res.body.data.activationCodeHash, undefined);

  res = await api('GET', '/api/v1/admin/users?email=owner', { key: ctx.adminKey });
  assert.equal(res.body.data[0].devices[0].imei, IMEI);

  res = await api('POST', `/api/v1/admin/devices/${IMEI}/release`, { key: ctx.adminKey });
  assert.equal(res.body.data.status, 'inventory');
  assert.equal((await api('GET', '/api/v1/devices', { token: owner.accessToken })).body.count, 0);

  assert.equal((await api('GET', '/api/v1/admin/users')).status, 401);
});

test('push tokens are saved per user', async () => {
  const a = await signup('a@x.com');
  const body = { token: 'fcm-token-1234567890', platform: 'android' };
  assert.equal((await api('POST', '/api/v1/me/push-tokens', { token: a.accessToken, body })).status, 204);
  assert.equal((await api('POST', '/api/v1/me/push-tokens', { token: a.accessToken, body })).status, 204);
  assert.equal(await ctx.prisma.pushToken.count(), 1);
  await api('DELETE', '/api/v1/me/push-tokens', { token: a.accessToken, body: { token: body.token } });
  assert.equal(await ctx.prisma.pushToken.count(), 0);
});

test('login is rate limited per IP + email', async () => {
  await signup('a@x.com');
  let last;
  for (let i = 0; i < 11; i++) {
    last = await api('POST', '/api/v1/auth/login', { body: { email: 'limited@x.com', password: 'wrong-password' } });
  }
  assert.equal(last.status, 429);
  assert.equal(last.body.error.code, 'RATE_LIMITED');
  // A different email from the same IP is not blocked
  const ok = await api('POST', '/api/v1/auth/login', { body: { email: 'a@x.com', password: PASSWORD } });
  assert.equal(ok.status, 200);
});
