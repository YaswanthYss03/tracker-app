#!/usr/bin/env node
/**
 * Admin tool for tracker stock. Talks to the database directly.
 *
 *   npm run admin -- add <IMEI> [--sim <number>] [--model GT06N] [--name "Car 1"]
 *   npm run admin -- add-range <firstIMEI> <count>     (e.g. a shipment; prints CSV)
 *   npm run admin -- list [--status inventory|active|suspended]
 *   npm run admin -- show <IMEI>
 *   npm run admin -- reset-code <IMEI>
 *   npm run admin -- suspend <IMEI>
 *   npm run admin -- activate <IMEI>       (allow a suspended device again)
 *   npm run admin -- release <IMEI>        (remove owner/viewers, wipe history, back to stock)
 *   npm run admin -- make-admin <email>    (give an existing account access to the admin web panel)
 *   npm run admin -- remove-admin <email>
 *
 * On the server:  docker compose exec app node scripts/admin-cli.js add <IMEI>
 *
 * Activation codes are shown ONCE (only a hash is stored). Print them on the box.
 */
require('dotenv').config();
const { parseArgs } = require('util');
const { prisma } = require('../src/db/client');
const deviceAdmin = require('../src/services/deviceAdmin');
const devices = require('../src/db/repositories/devices');
const { createOwnershipService } = require('../src/services/ownership');

const USAGE = `Usage:
  add <IMEI> [--sim <number>] [--model <model>] [--name <name>]
  add-range <firstIMEI> <count>
  list [--status inventory|active|suspended]
  show <IMEI>
  reset-code <IMEI>
  suspend <IMEI>
  activate <IMEI>
  release <IMEI>
  make-admin <email>
  remove-admin <email>`;

function fmtDate(d) {
  return d ? new Date(d).toISOString().replace('T', ' ').slice(0, 19) : '-';
}

/**
 * Asks the running server (same machine) to do an admin action, so its
 * in-memory state stays in sync (live connections, alerts, trip tracking).
 * Returns null if the server isn't reachable; callers then fall back to the
 * database and warn that the server will only notice after a restart.
 */
async function callServer(method, path, body) {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`http://127.0.0.1:${process.env.PORT || 3000}/api/v1/admin${path}`, {
      method,
      headers: { 'x-api-key': key, ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10_000),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error?.message || `server answered ${res.status}`);
    return json;
  } catch (err) {
    if (err.cause?.code === 'ECONNREFUSED' || err.name === 'TimeoutError') return null;
    throw err;
  }
}

const OFFLINE_NOTE = '(server not running: it will pick up this change when it starts)';

async function run() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      sim: { type: 'string' },
      model: { type: 'string' },
      name: { type: 'string' },
      status: { type: 'string' },
    },
  });
  const [cmd, ...args] = positionals;

  switch (cmd) {
    case 'add': {
      const { device, activationCode } = await deviceAdmin.registerDevice({
        imei: args[0],
        simNumber: values.sim,
        model: values.model,
        name: values.name,
      });
      console.log(`Registered ${device.imei} (${device.model})`);
      console.log(`Activation code: ${activationCode}`);
      console.log('Save it now: it cannot be shown again (use reset-code to issue a new one).');
      break;
    }

    case 'add-range': {
      const first = args[0];
      const count = Number(args[1]);
      deviceAdmin.assertImei(first);
      if (!Number.isInteger(count) || count < 1 || count > 1000) throw new Error('count must be 1-1000');
      console.log('imei,activation_code');
      for (let i = 0; i < count; i++) {
        const imei = (BigInt(first) + BigInt(i)).toString().padStart(15, '0');
        try {
          const { activationCode } = await deviceAdmin.registerDevice({ imei, model: values.model });
          console.log(`${imei},${activationCode}`);
        } catch (err) {
          console.error(`${imei}: ${err.message}`);
        }
      }
      break;
    }

    case 'list': {
      const list = await devices.list({ status: values.status, limit: 500 });
      if (list.length === 0) return console.log('No devices.');
      console.log('IMEI             STATUS      MODEL   SIM            LAST SEEN');
      for (const d of list) {
        console.log(
          `${d.imei.padEnd(16)} ${d.status.padEnd(11)} ${d.model.padEnd(7)} ${(d.simNumber || '-').padEnd(14)} ${fmtDate(d.lastSeenAt)}`
        );
      }
      console.log(`${list.length} device(s)`);
      break;
    }

    case 'show': {
      const d = await deviceAdmin.getByImei(args[0]);
      const { activationCodeHash, ...rest } = d; // never print the hash
      console.log(rest);
      const members = await createOwnershipService().listMembers(d.id);
      console.log(members.length ? 'Access:' : 'Access: nobody (not claimed)');
      for (const m of members) console.log(`  ${m.role.padEnd(6)} ${m.user.email}`);
      break;
    }

    case 'release': {
      const d = await deviceAdmin.getByImei(args[0]);
      const viaServer = await callServer('POST', `/devices/${d.imei}/release`);
      if (!viaServer) await createOwnershipService().release(d.id);
      console.log(`${d.imei} released: owner/viewers removed, history wiped, back in stock.${viaServer ? '' : ` ${OFFLINE_NOTE}`}`);
      break;
    }

    case 'reset-code': {
      const { device, activationCode } = await deviceAdmin.resetActivationCode(args[0]);
      console.log(`New activation code for ${device.imei}: ${activationCode}`);
      break;
    }

    case 'suspend':
    case 'activate': {
      let target = 'suspended';
      if (cmd === 'activate') {
        // Back to "active" if a customer owns it, otherwise back to stock.
        const existing = await deviceAdmin.getByImei(args[0]);
        const owners = await prisma.deviceAccess.count({ where: { deviceId: existing.id, role: 'owner' } });
        target = owners > 0 ? 'active' : 'inventory';
      }
      deviceAdmin.assertImei(args[0]);
      const viaServer = await callServer('PATCH', `/devices/${args[0]}`, { status: target });
      const d = viaServer ? viaServer.data : await deviceAdmin.setStatus(args[0], target);
      console.log(`${d.imei} is now ${d.status}${viaServer ? (cmd === 'suspend' ? ' (disconnected)' : '') : ` ${OFFLINE_NOTE}`}`);
      break;
    }

    case 'make-admin':
    case 'remove-admin': {
      const email = String(args[0] || '').trim().toLowerCase();
      if (!email) throw new Error('email required');
      const role = cmd === 'make-admin' ? 'admin' : 'user';
      const user = await prisma.user.update({ where: { email }, data: { role } }).catch((err) => {
        if (err.code === 'P2025') throw new Error(`No account with email ${email} (sign up in the web app first)`);
        throw err;
      });
      console.log(`${user.email} is now ${user.role === 'admin' ? 'an admin' : 'a normal user'}.`);
      break;
    }

    default:
      console.log(USAGE);
      process.exitCode = cmd ? 1 : 0;
  }
}

run()
  .catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
