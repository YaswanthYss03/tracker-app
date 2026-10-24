// "Sign in with Google", passwordless accounts, and the contact / partner forms.
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');

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
const token = (sub, email, verified = 'yes') => `google-test-token|${sub}|${email}|${verified}`;
const google = (idToken) => api('POST', '/api/v1/auth/google', { body: { idToken } });

test('Google: first sign-in creates a verified account without a password; next one logs in', async () => {
  let res = await google(token('g-1', 'New@Gmail.com'));
  assert.equal(res.status, 201);
  assert.equal(res.body.data.user.email, 'new@gmail.com');
  assert.equal(res.body.data.user.hasPassword, false);
  assert.equal(res.body.data.user.googleLinked, true);
  assert.ok(res.body.data.accessToken);

  res = await google(token('g-1', 'new@gmail.com'));
  assert.equal(res.status, 200);
  assert.equal(await ctx.prisma.user.count(), 1);

  // No password: password login fails, change-password explains how to set one.
  const login = await api('POST', '/api/v1/auth/login', { body: { email: 'new@gmail.com', password: 'whatever123' } });
  assert.equal(login.status, 401);
  const change = await api('POST', '/api/v1/me/password', {
    token: res.body.data.accessToken, body: { currentPassword: 'x', newPassword: 'new password 1' },
  });
  assert.equal(change.body.error.code, 'NO_PASSWORD');

  // Deleting needs the email typed in instead of a password.
  const wrong = await api('DELETE', '/api/v1/me', { token: res.body.data.accessToken, body: { confirmEmail: 'other@x.com' } });
  assert.equal(wrong.status, 400);
  const del = await api('DELETE', '/api/v1/me', { token: res.body.data.accessToken, body: { confirmEmail: 'NEW@gmail.com' } });
  assert.equal(del.status, 204);
});

test('Google: links to an existing email account, which keeps its password', async () => {
  await api('POST', '/api/v1/auth/register', { body: { email: 'me@x.com', password: 'my password 1', acceptTerms: true } });
  const res = await google(token('g-2', 'me@x.com'));
  assert.equal(res.status, 200);
  assert.equal(res.body.data.user.hasPassword, true);
  assert.equal(res.body.data.user.googleLinked, true);
  const login = await api('POST', '/api/v1/auth/login', { body: { email: 'me@x.com', password: 'my password 1' } });
  assert.equal(login.status, 200);
});

test('Google: bad or unverified tokens are refused', async () => {
  assert.equal((await google('not-a-real-google-token-at-all')).status, 401);
  assert.equal((await google(token('g-3', 'x@x.com', 'no'))).status, 401);
  assert.equal(await ctx.prisma.user.count(), 0);
});

test('app config tells apps the Google client and support contacts', async () => {
  const { body } = await api('GET', '/api/v1/app/config');
  assert.equal(body.data.googleWebClientId, 'test-web-client.apps.googleusercontent.com');
  assert.equal(body.data.support.email, 'support@example.com');
});

test('contact and partner forms are saved, emailed to support, and listed for admins', async () => {
  let res = await api('POST', '/api/v1/inquiries', {
    body: { kind: 'contact', name: 'Asha', email: 'asha@x.com', message: 'My tracker shows offline.' },
  });
  assert.equal(res.status, 201);

  const user = await api('POST', '/api/v1/auth/register', { body: { email: 'dealer@x.com', password: 'my password 1', acceptTerms: true } });
  res = await api('POST', '/api/v1/inquiries', {
    token: user.body.data.accessToken,
    body: { kind: 'partner', name: 'Ravi', email: 'dealer@x.com', phone: '+91 98765 43210', company: 'Ravi Motors', city: 'Chennai', partnerType: 'dealer' },
  });
  assert.equal(res.status, 201);
  assert.equal(ctx.emails.length, 2);
  assert.equal(ctx.emails[1].to, 'support@example.com');
  assert.match(ctx.emails[1].subject, /Ravi Motors/);

  // Validation: partner needs phone + city + type.
  res = await api('POST', '/api/v1/inquiries', { body: { kind: 'partner', name: 'X', email: 'x@x.com' } });
  assert.equal(res.status, 400);

  res = await api('GET', '/api/v1/admin/inquiries', { key: ctx.adminKey });
  assert.equal(res.body.total, 2);
  assert.equal(res.body.open, 2);
  const partner = res.body.data.find((r) => r.kind === 'partner');
  assert.equal(partner.userId, user.body.data.user.id);

  res = await api('PATCH', `/api/v1/admin/inquiries/${partner.id}`, { key: ctx.adminKey, body: { status: 'done' } });
  assert.equal(res.body.data.status, 'done');
  res = await api('GET', '/api/v1/admin/inquiries?status=new', { key: ctx.adminKey });
  assert.equal(res.body.total, 1);
  // Normal users can't read them.
  assert.equal((await api('GET', '/api/v1/admin/inquiries', { token: user.body.data.accessToken })).status, 403);
});
