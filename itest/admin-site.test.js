// With ADMIN_DOMAIN set, admin logins only work through the admin website's host.
const { startApp, resetData } = require('./helpers');
const http = require('node:http');
const test = require('node:test');
const assert = require('node:assert/strict');

let ctx;
test.before(async () => {
  ctx = await startApp({ adminDomain: 'admin.pavakie.test' });
});
test.after(async () => ctx.close());
test.beforeEach(async () => resetData(ctx.prisma));

/** GET with a custom Host header (fetch doesn't allow changing it). */
function get(path, { host, token } = {}) {
  const { port } = new URL(ctx.base);
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path, headers: { host, ...(token && { authorization: `Bearer ${token}` }) } }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function adminToken() {
  const reg = await ctx.api('POST', '/api/v1/auth/register', { body: { email: 'boss@x.com', password: 'boss password 1', acceptTerms: true } });
  await ctx.prisma.user.update({ where: { email: 'boss@x.com' }, data: { role: 'admin' } });
  const login = await ctx.api('POST', '/api/v1/auth/login', { body: { email: 'boss@x.com', password: 'boss password 1' } });
  assert.ok(reg.body.data);
  return login.body.data.accessToken;
}

test('admin login works on the admin host, not on the customer host', async () => {
  const token = await adminToken();
  const onAdmin = await get('/api/v1/admin/stats', { host: 'admin.pavakie.test', token });
  assert.equal(onAdmin.status, 200);
  const onCustomer = await get('/api/v1/admin/stats', { host: 'track.pavakie.test', token });
  assert.equal(onCustomer.status, 403);
  assert.match(onCustomer.body, /ADMIN_SITE_ONLY/);
});

test('the API key still works from anywhere (scripts, CLI)', async () => {
  const res = await ctx.api('GET', '/api/v1/admin/stats', { key: ctx.adminKey });
  assert.equal(res.status, 200);
});

test('old /admin pages on the customer site redirect to the admin website', async () => {
  const res = await get('/admin/trackers', { host: 'track.pavakie.test' });
  assert.equal(res.status, 302);
  assert.equal(res.headers.location, 'https://admin.pavakie.test/trackers');
});
