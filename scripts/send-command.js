#!/usr/bin/env node
/**
 * Send a command to a tracker through the admin API.
 *
 *   npm run command -- <IMEI> "WHERE#"
 *   API_URL=http://<SERVER_IP>:3000 ADMIN_API_KEY=<key> npm run command -- <IMEI> "STATUS#"
 *
 * Reads ADMIN_API_KEY from .env (or the environment).
 */
require('dotenv').config();

const API_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;
const API_KEY = process.env.ADMIN_API_KEY;

async function sendCommand(imei, command) {
  const res = await fetch(`${API_URL}/api/v1/admin/devices/${imei}/commands`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify({ command }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${body.error?.message || 'request failed'}`);
  return body.data.response;
}

async function main() {
  const [imei, command = 'WHERE#'] = process.argv.slice(2);
  if (!imei) {
    console.error('Usage: npm run command -- <IMEI> "WHERE#"');
    process.exit(1);
  }
  if (!API_KEY) {
    console.error('ADMIN_API_KEY is not set in .env');
    process.exit(1);
  }
  try {
    console.log(`-> ${command}`);
    console.log(`<- ${await sendCommand(imei, command)}`);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

main();
