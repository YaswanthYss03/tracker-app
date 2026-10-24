// Sign-up email verification (on when the server can send email).
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');

const PASSWORD = 'correct horse battery';
let ctx;

test.before(async () => {
  ctx = await startApp({ requireEmailVerification: true });
});
test.after(async () => ctx.close());
test.beforeEach(async () => {
  await resetData(ctx.prisma);
  ctx.emails.length = 0;
});

const api = (...args) => ctx.api(...args);
const lastCode = () => ctx.emails.at(-1).text.match(/\b(\d{6})\b/)[1];
const register = (email, password = PASSWORD) =>
  api('POST', '/api/v1/auth/register', { body: { email, password, acceptTerms: true } });

test('sign up sends a code; no tokens and no login until verified', async () => {
  const res = await register('New@x.com');
  assert.equal(res.status, 201);
  assert.deepEqual(res.body.data, { verificationRequired: true, email: 'new@x.com' });
  assert.equal(ctx.emails.length, 1);
  assert.match(ctx.emails[0].subject, /verification code/);

  const login = await api('POST', '/api/v1/auth/login', { body: { email: 'new@x.com', password: PASSWORD } });
  assert.equal(login.status, 403);
  assert.equal(login.body.error.code, 'EMAIL_NOT_VERIFIED');
  // Wrong password still says wrong password (doesn't reveal the account).
  const wrong = await api('POST', '/api/v1/auth/login', { body: { email: 'new@x.com', password: 'nope nope nope' } });
  assert.equal(wrong.status, 401);
});

test('correct code verifies and logs in; code works once', async () => {
  await register('a@x.com');
  const code = lastCode();
  const bad = await api('POST', '/api/v1/auth/verify-email', { body: { email: 'a@x.com', code: code === '000000' ? '111111' : '000000' } });
  assert.equal(bad.status, 400);

  const ok = await api('POST', '/api/v1/auth/verify-email', { body: { email: 'a@x.com', code } });
  assert.equal(ok.status, 200);
  assert.ok(ok.body.data.accessToken);
  assert.equal(ok.body.data.user.email, 'a@x.com');

  const again = await api('POST', '/api/v1/auth/verify-email', { body: { email: 'a@x.com', code } });
  assert.equal(again.status, 409);
  const login = await api('POST', '/api/v1/auth/login', { body: { email: 'a@x.com', password: PASSWORD } });
  assert.equal(login.status, 200);
  // A verified email can't be signed up again.
  assert.equal((await register('a@x.com')).status, 409);
});

test('resend replaces the old code; 5 wrong tries lock the code', async () => {
  await register('b@x.com');
  const first = lastCode();
  assert.equal((await api('POST', '/api/v1/auth/resend-verification', { body: { email: 'b@x.com' } })).status, 204);
  const second = lastCode();
  if (first !== second) {
    assert.equal((await api('POST', '/api/v1/auth/verify-email', { body: { email: 'b@x.com', code: first } })).status, 400);
  }
  const wrong = second === '000000' ? '111111' : '000000';
  for (let i = 0; i < 5; i++) await api('POST', '/api/v1/auth/verify-email', { body: { email: 'b@x.com', code: wrong } });
  assert.equal((await api('POST', '/api/v1/auth/verify-email', { body: { email: 'b@x.com', code: second } })).status, 400);

  // Resend for unknown or verified emails does nothing but looks the same.
  const before = ctx.emails.length;
  assert.equal((await api('POST', '/api/v1/auth/resend-verification', { body: { email: 'ghost@x.com' } })).status, 204);
  assert.equal(ctx.emails.length, before);
});

test('signing up again before verifying updates the password and sends a new code', async () => {
  await register('c@x.com', 'first password 1');
  await register('c@x.com', 'second password 2');
  assert.equal(ctx.emails.length, 2);
  await api('POST', '/api/v1/auth/verify-email', { body: { email: 'c@x.com', code: lastCode() } });
  const old = await api('POST', '/api/v1/auth/login', { body: { email: 'c@x.com', password: 'first password 1' } });
  assert.equal(old.status, 401);
  const now = await api('POST', '/api/v1/auth/login', { body: { email: 'c@x.com', password: 'second password 2' } });
  assert.equal(now.status, 200);
});
