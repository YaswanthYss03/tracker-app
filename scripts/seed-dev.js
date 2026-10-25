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
  { imei: '359710049099001', registrationNumber: 'TN 66 AF 9032', driver: 'Priya Sundar', backup: 'Karthik Raja', name: 'Sales car', vehicleType: 'car', color: 'red' },
  { imei: '359710049099002', registrationNumber: 'TN 37 BQ 6603', driver: 'Ravi Thangam', name: 'School bus', vehicleType: 'bus', color: 'yellow' },
  { imei: '359710049099003', registrationNumber: 'TN 38 BX 4521', driver: 'Arun Kumar', backup: 'Karthik Raja', name: 'Delivery truck', vehicleType: 'truck', color: 'orange' },
  { imei: '359710049099004', registrationNumber: 'TN 37 CK 1187', driver: 'Divya Mohan', name: 'Staff van', vehicleType: 'van', color: 'blue' },
  { imei: '359710049099005', registrationNumber: 'TN 99 D 7745', driver: 'Senthil Pandi', name: 'Courier bike', vehicleType: 'bike', color: 'black' },
];
// Sample drivers (fake numbers in the 90000 range).
const DRIVERS = [
  { name: 'Priya Sundar', phone: '+91 90000 00101', licenceNo: 'TN66 2015 0001234', licenceExpiry: '2028-03-14', avatar: 'a2' },
  { name: 'Ravi Thangam', phone: '+91 90000 00102', licenceNo: 'TN37 2009 0004567', licenceExpiry: '2026-12-01', avatar: 'a7' },
  { name: 'Arun Kumar', phone: '+91 90000 00103', licenceNo: 'TN38 2012 0007890', licenceExpiry: '2027-07-20', avatar: 'a1' },
  { name: 'Divya Mohan', phone: '+91 90000 00104', licenceNo: 'TN37 2018 0002345', licenceExpiry: '2029-01-09', avatar: 'a4' },
  { name: 'Senthil Pandi', phone: '+91 90000 00105', licenceNo: 'TN99 2011 0009931', licenceExpiry: '2026-11-12', avatar: 'a5' },
  { name: 'Karthik Raja', phone: '+91 90000 00106', licenceNo: 'TN38 2016 0005678', licenceExpiry: '2027-02-28', avatar: 'a3' },
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

  // Drivers: create missing ones, update the rest (matched by name).
  const existing = (await call('GET', '/drivers', { token })).body?.data || [];
  const driverId = {};
  for (const d of DRIVERS) {
    const found = existing.find((e) => e.name === d.name);
    const res = found
      ? await call('PATCH', `/drivers/${found.id}`, { token, body: d })
      : await call('POST', '/drivers', { token, body: d });
    driverId[d.name] = res.body?.data?.id;
  }

  for (const v of VEHICLES) {
    const reg = await call('POST', '/admin/devices', { key: KEY, body: { imei: v.imei } });
    let code = reg.body?.data?.activationCode;
    if (!code) code = (await call('POST', `/admin/devices/${v.imei}/reset-code`, { key: KEY })).body?.data?.activationCode;
    const claim = await call('POST', '/devices/claim', { token, body: { imei: v.imei, activationCode: code, name: v.name, vehicleType: v.vehicleType, registrationNumber: v.registrationNumber } });
    const id = claim.body?.data?.id;
    if (id) {
      await call('PATCH', `/devices/${id}`, {
        token,
        body: {
          name: v.name, icon: v.vehicleType, registrationNumber: v.registrationNumber, color: v.color,
          mainDriverId: driverId[v.driver] ?? null, backupDriverId: v.backup ? driverId[v.backup] ?? null : null,
        },
      });
    }
    console.log(v.imei, claim.status === 201 ? 'added' : claim.status === 200 ? 'already yours (details updated)' : JSON.stringify(claim.body));
  }
  console.log(`Log in with ${EMAIL} (password in this file).`);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
