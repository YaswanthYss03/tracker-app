// Profile details, alert settings (who gets which push), quiet hours, test push.
const { startApp, resetData } = require('./helpers');
const test = require('node:test');
const assert = require('node:assert/strict');
const pino = require('pino');
const { createNotifier } = require('../src/notifications/notifier');

let ctx;
test.before(async () => {
  ctx = await startApp();
});
test.after(async () => ctx.close());
test.beforeEach(async () => {
  await resetData(ctx.prisma);
  ctx.fakeFcm.sent.length = 0;
});
const api = (...a) => ctx.api(...a);
const user = async (email) => (await api('POST', '/api/v1/auth/register', { body: { email, password: 'correct horse battery', acceptTerms: true } })).body.data;

test('profile: phone, company and alert settings', async () => {
  const u = await user('p@x.com');
  let res = await api('GET', '/api/v1/me', { token: u.accessToken });
  assert.deepEqual(res.body.data.alerts, { offline: true, longStop: true, gpsLost: true, quietHours: false });
  res = await api('PATCH', '/api/v1/me', { token: u.accessToken, body: { name: 'Meera Raman', phone: '+91 90000 00100', company: 'Pavakie Pvt. Ltd.', alerts: { longStop: false, quietHours: true } } });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.phone, '+91 90000 00100');
  assert.equal(res.body.data.company, 'Pavakie Pvt. Ltd.');
  assert.deepEqual(res.body.data.alerts, { offline: true, longStop: false, gpsLost: true, quietHours: true });
  res = await api('PATCH', '/api/v1/me', { token: u.accessToken, body: { company: '' } });
  assert.equal(res.body.data.company, null);
  assert.equal((await api('PATCH', '/api/v1/me', { token: u.accessToken, body: { phone: 'call me' } })).status, 400);
  assert.equal((await api('PATCH', '/api/v1/me', { token: u.accessToken, body: { alerts: { sms: true } } })).status, 400);
  assert.equal((await api('PATCH', '/api/v1/me', { token: u.accessToken, body: {} })).status, 400);
});

test('push test goes to my phones only', async () => {
  const u = await user('t@x.com');
  const other = await user('t2@x.com');
  await api('POST', '/api/v1/me/push-tokens', { token: u.accessToken, body: { token: 'tok-mine-1', platform: 'android' } });
  await api('POST', '/api/v1/me/push-tokens', { token: other.accessToken, body: { token: 'tok-other', platform: 'android' } });
  const res = await api('POST', '/api/v1/me/push-test', { token: u.accessToken });
  assert.deepEqual(res.body.data, { sent: 1, phones: 1 });
  assert.deepEqual(ctx.fakeFcm.sent[0].tokens, ['tok-mine-1']);
  assert.equal(ctx.fakeFcm.sent[0].title, 'Test notification');
});

test('alerts respect each person\'s settings and quiet hours; SOS always goes through', async () => {
  const owner = await user('o@x.com');
  const fam = await user('f@x.com');
  const reg = await api('POST', '/api/v1/admin/devices', { key: ctx.adminKey, body: { imei: '359710049095001' } });
  const id = (await api('POST', '/api/v1/devices/claim', { token: owner.accessToken, body: { imei: '359710049095001', activationCode: reg.body.data.activationCode, registrationNumber: 'TN 37 CK 1187', driverName: 'Divya Mohan' } })).body.data.id;
  await api('POST', `/api/v1/devices/${id}/viewers`, { token: owner.accessToken, body: { email: 'f@x.com' } });
  await api('POST', '/api/v1/me/push-tokens', { token: owner.accessToken, body: { token: 'tok-owner-1', platform: 'android' } });
  await api('POST', '/api/v1/me/push-tokens', { token: fam.accessToken, body: { token: 'tok-family-1', platform: 'android' } });
  await api('PATCH', '/api/v1/me', { token: fam.accessToken, body: { alerts: { longStop: false, quietHours: true } } });

  const sent = [];
  const fcm = { enabled: true, send: async (tokens, msg) => { sent.push({ tokens: [...tokens].sort(), ...msg }); return { sent: tokens.length, deadTokens: [] }; } };
  const day = createNotifier({ fcm, logger: pino({ level: 'silent' }), now: () => new Date('2026-10-22T06:00:00Z') }); // 11:30 IST
  const night = createNotifier({ fcm, logger: pino({ level: 'silent' }), now: () => new Date('2026-10-22T18:00:00Z') }); // 23:30 IST

  await day.notify({ id: 'e1', deviceId: id, type: 'long_stop', payload: { minutes: 503 } });
  await day.notify({ id: 'e2', deviceId: id, type: 'gps_lost' });
  await night.notify({ id: 'e3', deviceId: id, type: 'gps_lost' });
  await night.notify({ id: 'e4', deviceId: id, type: 'sos' });

  assert.deepEqual(sent.map((s) => s.tokens), [['tok-owner-1'], ['tok-family-1', 'tok-owner-1'], ['tok-owner-1'], ['tok-family-1', 'tok-owner-1']]);
  assert.equal(sent[0].title, 'Long stop · 8 h 23 min');
  assert.equal(sent[0].body, 'TN 37 CK 1187 has been parked for 8 h 23 min. Driver: Divya Mohan.');
});
