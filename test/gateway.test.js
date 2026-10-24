// Gateway behaviour over a real TCP socket, with an in-memory "database".
const test = require('node:test');
const assert = require('node:assert/strict');
const net = require('net');
const pino = require('pino');
const gt06 = require('../src/protocol/gt06');
const { createGateway } = require('../src/gateway/tcpServer');
const { DeviceRegistry } = require('../src/gateway/deviceRegistry');
const { DeviceStateCache } = require('../src/pipeline/stateCache');
const { Ingest } = require('../src/pipeline/ingest');

const logger = pino({ level: 'silent' });
const IMEI = '359710049095095';
const filters = {
  futureToleranceMs: 600_000, maxPointAgeMs: 7 * 86_400_000,
  stationaryMinDistanceM: 15, stationaryStoreIntervalMs: 300_000, maxImpliedSpeedKmh: 300,
};

async function startGateway(over = {}) {
  const devices = new Map([
    [IMEI, { id: '11111111-1111-1111-1111-111111111111', imei: IMEI, status: 'inventory' }],
    ['359710049095096', { id: '22222222-2222-2222-2222-222222222222', imei: '359710049095096', status: 'suspended' }],
  ]);
  const rows = [];
  const raw = [];
  const cache = new DeviceStateCache({ logger });
  const writer = { add: (r) => rows.push(r) };
  const ingest = new Ingest({ cache, writer, filters, logger });
  const registry = new DeviceRegistry();
  const gateway = createGateway({
    config: { loginTimeoutMs: 300, idleTimeoutMs: 60_000, maxConnectionsPerIp: 50, maxConnections: 100, commandTimeoutMs: 1000, ...over },
    deviceRepo: { findByImei: async (imei) => devices.get(imei) || null },
    rawPacketRepo: { insert: async (r) => raw.push(r) },
    ingest,
    registry,
    logger,
  });
  await gateway.listen(0);
  const port = gateway.server.address().port;
  return { gateway, port, rows, raw, registry, cache };
}

/** Minimal fake device: collects decoded server packets and close state. */
function connect(port) {
  const socket = net.connect(port, '127.0.0.1');
  const client = { socket, received: [], closed: false, buffer: Buffer.alloc(0) };
  socket.on('data', (d) => {
    client.buffer = Buffer.concat([client.buffer, d]);
    const { packets, rest } = gt06.extractPackets(client.buffer);
    client.buffer = rest;
    for (const p of packets) client.received.push(gt06.decodeFrame(p));
  });
  socket.on('close', () => (client.closed = true));
  socket.on('error', () => {});
  return new Promise((resolve) => socket.on('connect', () => resolve(client)));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms = 1000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (fn()) return;
    await wait(10);
  }
  assert.fail('condition not met in time');
}

const login = (imei, serial = 1) => gt06.buildPacket(0x01, Buffer.from(imei.padStart(16, '0'), 'hex'), serial);

function location(serial, { lat = 12.9716, lon = 77.5946, secondsAgo = 0 } = {}) {
  const t = new Date(Date.now() - secondsAgo * 1000);
  const b = Buffer.alloc(29);
  [t.getUTCFullYear() - 2000, t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds()]
    .forEach((v, i) => b.writeUInt8(v, i));
  b.writeUInt8(0xc9, 6);
  b.writeUInt32BE(Math.round(lat * 1_800_000), 7);
  b.writeUInt32BE(Math.round(lon * 1_800_000), 11);
  b.writeUInt8(40, 15);
  b.writeUInt16BE(0x1400 | 90, 16);
  b.writeUInt8(1, 26); // ACC on
  return gt06.buildPacket(0x22, b, serial);
}

test('registered device: login ACK, heartbeat ACK, location stored', async (t) => {
  const { gateway, port, rows, cache } = await startGateway();
  t.after(() => gateway.close());
  const c = await connect(port);

  c.socket.write(login(IMEI, 1));
  await until(() => c.received.length === 1);
  assert.equal(c.received[0].protocol, 0x01);
  assert.equal(c.received[0].serial, 1);

  c.socket.write(gt06.buildPacket(0x13, Buffer.from([0x46, 5, 4, 0, 2]), 2));
  await until(() => c.received.length === 2);
  assert.equal(c.received[1].protocol, 0x13);

  c.socket.write(location(3));
  await until(() => rows.length === 1);
  assert.equal(rows[0].deviceId, '11111111-1111-1111-1111-111111111111');
  assert.equal(rows[0].acc, true);

  const state = cache.get('11111111-1111-1111-1111-111111111111');
  assert.equal(state.batteryLevel, 5);
  assert.equal(state.lat, 12.9716);
  assert.equal(state.connected, true);
  c.socket.destroy();
});

test('login and location in the same TCP chunk are handled in order', async (t) => {
  const { gateway, port, rows } = await startGateway();
  t.after(() => gateway.close());
  const c = await connect(port);
  c.socket.write(Buffer.concat([login(IMEI, 1), location(2)]));
  await until(() => rows.length === 1);
  c.socket.destroy();
});

test('unregistered IMEI is disconnected without an ACK', async (t) => {
  const { gateway, port } = await startGateway();
  t.after(() => gateway.close());
  const c = await connect(port);
  c.socket.write(login('123456789012345'));
  await until(() => c.closed);
  assert.equal(c.received.length, 0);
});

test('suspended device is disconnected without an ACK', async (t) => {
  const { gateway, port } = await startGateway();
  t.after(() => gateway.close());
  const c = await connect(port);
  c.socket.write(login('359710049095096'));
  await until(() => c.closed);
  assert.equal(c.received.length, 0);
});

test('connection without login is closed after the login timeout', async (t) => {
  const { gateway, port, rows } = await startGateway();
  t.after(() => gateway.close());
  const c = await connect(port);
  c.socket.write(location(1)); // ignored: not logged in
  await until(() => c.closed, 1500);
  assert.equal(rows.length, 0);
});

test('per-IP connection limit', async (t) => {
  const { gateway, port } = await startGateway({ maxConnectionsPerIp: 2 });
  t.after(() => gateway.close());
  const a = await connect(port);
  const b = await connect(port);
  const c = await connect(port);
  await until(() => c.closed);
  assert.equal(a.closed, false);
  assert.equal(b.closed, false);
  a.socket.destroy();
  b.socket.destroy();
});

test('time request gets the server time; unknown packets are logged raw', async (t) => {
  const { gateway, port, raw } = await startGateway();
  t.after(() => gateway.close());
  const c = await connect(port);
  c.socket.write(login(IMEI, 1));
  c.socket.write(gt06.buildPacket(0x8a, Buffer.alloc(0), 2));
  c.socket.write(gt06.buildPacket(0x94, Buffer.from([0x00, 0x01, 0x02]), 3));
  await until(() => c.received.length === 2 && raw.length === 1);
  assert.equal(c.received[1].protocol, 0x8a);
  assert.equal(c.received[1].info.length, 6);
  assert.equal(raw[0].protocol, 0x94);
  assert.equal(raw[0].imei, IMEI);
  c.socket.destroy();
});

test('commands reach the device and its reply resolves the request', async (t) => {
  const { gateway, port, registry } = await startGateway();
  t.after(() => gateway.close());
  const c = await connect(port);
  c.socket.write(login(IMEI, 1));
  await until(() => c.received.length === 1);

  const pending = registry.sendCommand('11111111-1111-1111-1111-111111111111', 'WHERE#', 1000);
  await until(() => c.received.length === 2);
  const cmd = c.received[1];
  assert.equal(cmd.protocol, 0x80);
  const flag = cmd.info.readUInt32BE(1);

  const text = Buffer.from('Lat:N12.97,Lon:E77.59');
  const reply = Buffer.concat([Buffer.from([4 + text.length]), Buffer.alloc(4), text]);
  reply.writeUInt32BE(flag, 1);
  c.socket.write(gt06.buildPacket(0x15, reply, 2));
  assert.equal(await pending, 'Lat:N12.97,Lon:E77.59');
  c.socket.destroy();
});

test('a reconnect replaces the old connection for the same device', async (t) => {
  const { gateway, port, registry } = await startGateway();
  t.after(() => gateway.close());
  const first = await connect(port);
  first.socket.write(login(IMEI, 1));
  await until(() => first.received.length === 1);

  const second = await connect(port);
  second.socket.write(login(IMEI, 1));
  await until(() => first.closed && second.received.length === 1);
  assert.equal(registry.isConnected('11111111-1111-1111-1111-111111111111'), true);
  second.socket.destroy();
});
