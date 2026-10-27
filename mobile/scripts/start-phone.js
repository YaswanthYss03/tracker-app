#!/usr/bin/env node
// Starts Metro for Expo Go with the laptop's real Wi-Fi/LAN address in the QR code.
// Plain `expo start` can pick a Docker address (172.17.0.1, br-...), which the
// phone can't reach ("Failed to download remote update").
//   npm run phone          -> same Wi-Fi as the phone
//   npm run phone -- --tunnel   -> if the phone can't reach the laptop at all
const os = require('os');
const { spawn } = require('child_process');

function lanAddress() {
  const virtual = /^(docker|br-|veth|virbr|lo|tun|tap|tailscale|zt|vmnet|vboxnet)/i;
  const wifiFirst = /^(wl|wlan|wi|en|eth)/i;
  const found = [];
  for (const [name, list] of Object.entries(os.networkInterfaces())) {
    if (virtual.test(name)) continue;
    for (const a of list || []) if (a.family === 'IPv4' && !a.internal) found.push({ name, address: a.address });
  }
  found.sort((x, y) => Number(wifiFirst.test(y.name)) - Number(wifiFirst.test(x.name)));
  return found[0];
}

const lan = lanAddress();
const extra = process.argv.slice(2);
const tunnel = extra.includes('--tunnel');
if (!lan && !tunnel) {
  console.error('No Wi-Fi/LAN address found. Connect the laptop to Wi-Fi, or run: npm run phone -- --tunnel');
  process.exit(1);
}
if (lan && !tunnel) console.log(`\nPhone address: http://${lan.address}:8081  (${lan.name})\nPhone and laptop must be on the same Wi-Fi.\n`);
if (process.env.DRY_RUN) process.exit(0);

const env = { ...process.env, ...(lan && !tunnel ? { REACT_NATIVE_PACKAGER_HOSTNAME: lan.address } : {}) };
const child = spawn('npx', ['expo', 'start', '--go', ...(tunnel ? [] : ['--lan']), ...extra], { stdio: 'inherit', env });
child.on('exit', (code) => process.exit(code ?? 0));
