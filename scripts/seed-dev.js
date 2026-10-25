/**
 * Local development data: one test account with five vehicles, created
 * through the API of a backend running on THIS machine.
 *
 *   PORT=3100 TCP_PORT=5123 node src/index.js        (in another terminal)
 *   node scripts/seed-dev.js http://localhost:3100
 *   node scripts/simulate-device.js --port 5123 --devices 4 --imei 359710049099001   (the 5th stays offline)
 *
 * Refuses to run against anything but localhost. Test account (local only):
 *   email: dev@pavakie.test   password: dev-password-123
 */
require('dotenv').config();

const BASE = (process.argv[2] || 'http://localhost:3100').replace(/\/$/, '');
const host = new URL(BASE).hostname;
if (!['localhost', '127.0.0.1', '::1'].includes(host)) {
  console.error('seed-dev only runs against a local backend');
  process.exit(1);
}
const KEY = process.env.ADMIN_API_KEY;
const EMAIL = 'dev@pavakie.test';
const PASSWORD = 'dev-password-123';
const VEHICLES = [
  { imei: '359710049099001', registrationNumber: 'TN 66 AF 9032', driverName: 'Priya', name: 'Sales car', vehicleType: 'car' },
  { imei: '359710049099002', registrationNumber: 'TN 37 BQ 6603', driverName: 'Ravi', name: 'School bus', vehicleType: 'bus' },
  { imei: '359710049099003', registrationNumber: 'TN 38 BX 4521', driverName: 'Arun', name: 'Delivery truck', vehicleType: 'truck' },
  { imei: '359710049099004', registrationNumber: 'TN 37 CK 1187', driverName: 'Divya', name: 'Staff van', vehicleType: 'van' },
  { imei: '359710049099005', registrationNumber: 'TN 99 D 7745', driverName: 'Senthil', name: 'Courier bike', vehicleType: 'bike' },
];

async function call(method, path, { body, token, key } = {}) {
  const res = await fetch(BASE + '/api/v1' + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token && { authorization: `Bearer ${token}` }), ...(key && { 'x-api-key': key }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

(async () => {
  let login = await call('POST', '/auth/login', { body: { email: EMAIL, password: PASSWORD } });
  if (login.status !== 200) {
    await call('POST', '/auth/register', { body: { email: EMAIL, password: PASSWORD, name: 'Dev Fleet', acceptTerms: true } });
    login = await call('POST', '/auth/login', { body: { email: EMAIL, password: PASSWORD } });
  }
  const token = login.body?.data?.accessToken;
  if (!token) throw new Error(`login failed: ${JSON.stringify(login.body)}`);

  for (const v of VEHICLES) {
    const reg = await call('POST', '/admin/devices', { key: KEY, body: { imei: v.imei } });
    let code = reg.body?.data?.activationCode;
    if (!code) code = (await call('POST', `/admin/devices/${v.imei}/reset-code`, { key: KEY })).body?.data?.activationCode;
    const claim = await call('POST', '/devices/claim', { token, body: { imei: v.imei, activationCode: code, name: v.name, vehicleType: v.vehicleType, registrationNumber: v.registrationNumber, driverName: v.driverName } });
    const id = claim.body?.data?.id;
    if (id) {
      // Keep details up to date for vehicles that already existed.
      await call('PATCH', `/devices/${id}`, { token, body: { name: v.name, icon: v.vehicleType, registrationNumber: v.registrationNumber, driverName: v.driverName } });
    }
    console.log(v.imei, claim.status === 201 ? 'added' : claim.status === 200 ? 'already yours (details updated)' : JSON.stringify(claim.body));
  }
  console.log(`Log in with ${EMAIL} (password in this file).`);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
