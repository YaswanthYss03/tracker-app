/**
 * TCP gateway that GT06N trackers connect to.
 *
 * Per connection:
 *   1. The device must send a login packet within LOGIN_TIMEOUT_MS, with an
 *      IMEI that an admin registered and that isn't suspended. Otherwise the
 *      connection is closed without an ACK.
 *   2. Login, heartbeat and alarm packets are ACKed immediately.
 *   3. Parsed messages go to the ingest pipeline; command replies go to the
 *      device registry; time requests get the current UTC time.
 *   4. Unknown or unparseable packets are saved to raw_packets for debugging.
 *
 * Packets of one connection are handled strictly in order (a promise chain),
 * so the async login lookup always finishes before that device's locations.
 */
const net = require('net');
const gt06 = require('../protocol/gt06');

const MAX_BUFFER_BYTES = 4096; // guard against endless junk without a valid frame
const MAX_BAD_FRAMES = 50; // CRC failures before we give up on a connection
const MAX_PACKETS_BEFORE_LOGIN = 5;
const MAX_RAW_LOGS_PER_CONNECTION = 20;
const WARN_THROTTLE_MS = 10 * 60 * 1000;

function createGateway({ config, deviceRepo, rawPacketRepo, ingest, registry, logger }) {
  const log = logger.child({ component: 'gateway' });
  const ipCounts = new Map();
  const sockets = new Set();
  const lastWarned = new Map(); // throttles repeated warnings (e.g. a scanner hammering us)
  let nextSessionId = 1;

  const server = net.createServer(handleConnection);
  server.maxConnections = config.maxConnections;
  server.on('error', (err) => log.error({ err: err.message }, 'server error'));

  function warnOnce(key, obj, msg) {
    const now = Date.now();
    if (now - (lastWarned.get(key) || 0) < WARN_THROTTLE_MS) return;
    lastWarned.set(key, now);
    if (lastWarned.size > 10_000) lastWarned.clear();
    log.warn(obj, msg);
  }

  function handleConnection(socket) {
    const ip = socket.remoteAddress || 'unknown';
    const count = ipCounts.get(ip) || 0;
    if (count >= config.maxConnectionsPerIp) {
      warnOnce(`ip:${ip}`, { ip, limit: config.maxConnectionsPerIp }, 'too many connections from one IP, refusing');
      socket.destroy();
      return;
    }
    ipCounts.set(ip, count + 1);
    sockets.add(socket);

    const session = {
      id: nextSessionId++,
      socket,
      ip,
      remote: `${ip}:${socket.remotePort}`,
      imei: null,
      deviceId: null,
      buffer: Buffer.alloc(0),
      chain: Promise.resolve(),
      pending: new Map(), // commands waiting for a reply
      outSerial: 0,
      connectedAt: new Date(),
      lastPacketAt: null,
      badFrames: 0,
      packetsBeforeLogin: 0,
      rawLogged: 0,
    };
    session.log = log.child({ remote: session.remote });
    session.log.debug('connection opened');

    socket.setKeepAlive(true, 60_000);
    socket.setTimeout(config.idleTimeoutMs);
    const loginTimer = setTimeout(() => {
      if (!session.deviceId) {
        session.log.info('no valid login in time, closing');
        socket.destroy();
      }
    }, config.loginTimeoutMs);

    socket.on('data', (chunk) => {
      session.buffer = Buffer.concat([session.buffer, chunk]);
      const { packets, rest, invalid } = gt06.extractPackets(session.buffer);
      session.buffer = rest;

      if (invalid) {
        session.badFrames += invalid;
        session.log.warn({ invalid }, 'dropped packet(s) with bad CRC');
        if (session.badFrames > MAX_BAD_FRAMES) {
          session.log.warn('too many bad packets, closing');
          socket.destroy();
          return;
        }
      }
      if (session.buffer.length > MAX_BUFFER_BYTES) {
        session.log.warn({ bytes: session.buffer.length }, 'no valid packet in buffer, discarding');
        session.buffer = Buffer.alloc(0);
      }

      for (const frame of packets) {
        session.chain = session.chain
          .then(() => handleFrame(session, frame, loginTimer))
          .catch((err) => session.log.error({ err: err.message }, 'failed to handle packet'));
      }
    });

    socket.on('timeout', () => {
      session.log.info({ imei: session.imei }, 'idle timeout, closing');
      socket.destroy();
    });

    socket.on('error', (err) => {
      // ECONNRESET is normal when a tracker loses signal.
      session.log.debug({ err: err.code || err.message }, 'socket error');
    });

    socket.on('close', () => {
      clearTimeout(loginTimer);
      sockets.delete(socket);
      const n = (ipCounts.get(ip) || 1) - 1;
      if (n <= 0) ipCounts.delete(ip);
      else ipCounts.set(ip, n);

      if (session.deviceId) {
        registry.unregister(session);
        ingest.deviceDisconnected(session.deviceId, registry.isConnected(session.deviceId));
        session.log.info('device disconnected');
      }
    });
  }

  function write(session, buf) {
    if (!session.socket.destroyed) session.socket.write(buf);
  }

  async function handleFrame(session, frame, loginTimer) {
    if (session.socket.destroyed) return;
    session.lastPacketAt = new Date();
    const { protocol, info, serial } = gt06.decodeFrame(frame);

    let msg;
    try {
      msg = gt06.parsePacket(protocol, info);
    } catch (err) {
      if (!(err instanceof gt06.ParseError)) throw err;
      logRaw(session, frame, protocol, `parse_error: ${err.message}`);
      // Keep logged-in devices happy even if we couldn't read the payload.
      if (session.deviceId && gt06.NEEDS_ACK.has(protocol)) write(session, gt06.buildAck(protocol, serial));
      return;
    }

    if (msg.type === 'login') {
      await handleLogin(session, msg, serial, loginTimer);
      return;
    }

    if (!session.deviceId) {
      session.packetsBeforeLogin += 1;
      if (session.packetsBeforeLogin > MAX_PACKETS_BEFORE_LOGIN) {
        session.log.info('data without login, closing');
        session.socket.destroy();
      }
      return;
    }

    // ACK first, so slow processing never makes the tracker think we're gone.
    if (gt06.NEEDS_ACK.has(protocol)) write(session, gt06.buildAck(protocol, serial));

    const ctx = { deviceId: session.deviceId, imei: session.imei };
    switch (msg.type) {
      case 'location':
        ingest.handleLocation(ctx, msg);
        break;
      case 'heartbeat':
        ingest.handleHeartbeat(ctx, msg);
        break;
      case 'alarm':
        ingest.handleAlarm(ctx, msg);
        break;
      case 'commandReply': {
        ingest.touch(session.deviceId);
        const matched = registry.handleResponse(session, msg.serverFlag, msg.text);
        session.log.info({ imei: session.imei, matched, reply: msg.text }, 'command reply');
        break;
      }
      case 'timeRequest':
        ingest.touch(session.deviceId);
        write(session, gt06.buildTimeResponse(serial));
        break;
      default:
        ingest.touch(session.deviceId);
        logRaw(session, frame, protocol, 'unknown_protocol');
    }
  }

  async function handleLogin(session, msg, serial, loginTimer) {
    if (session.deviceId) {
      // Repeated login on the same connection: fine if it's the same device.
      if (msg.imei === session.imei) write(session, gt06.buildAck(gt06.PROTOCOL.LOGIN, serial));
      else session.socket.destroy();
      return;
    }

    let device;
    try {
      device = await deviceRepo.findByImei(msg.imei);
    } catch (err) {
      session.log.error({ err: err.message, imei: msg.imei }, 'device lookup failed, closing');
      session.socket.destroy(); // the device will reconnect and retry
      return;
    }

    if (!device) {
      warnOnce(`imei:${msg.imei}`, { imei: msg.imei, ip: session.ip }, 'unregistered IMEI, connection refused');
      session.socket.destroy();
      return;
    }
    if (device.status === 'suspended') {
      warnOnce(`imei:${msg.imei}`, { imei: msg.imei }, 'suspended device, connection refused');
      session.socket.destroy();
      return;
    }
    if (session.socket.destroyed) return;

    clearTimeout(loginTimer);
    session.imei = device.imei;
    session.deviceId = device.id;
    session.log = session.log.child({ imei: device.imei });

    registry.register(session);
    ingest.deviceConnected(device);
    write(session, gt06.buildAck(gt06.PROTOCOL.LOGIN, serial));

    session.log.info({ timezoneOffsetMin: msg.timezoneOffsetMin }, 'device logged in');
    if (msg.timezoneOffsetMin) {
      session.log.warn(
        { timezoneOffsetMin: msg.timezoneOffsetMin },
        'device timezone is not GMT; times may be wrong (send GMT,E,0,0#)'
      );
    }
  }

  function logRaw(session, frame, protocol, reason) {
    session.log.info({ protocol: `0x${protocol.toString(16).padStart(2, '0')}`, reason }, 'unhandled packet');
    if (session.rawLogged >= MAX_RAW_LOGS_PER_CONNECTION) return;
    session.rawLogged += 1;
    rawPacketRepo
      .insert({ imei: session.imei, remote: session.remote, protocol, hex: frame.toString('hex'), reason })
      .catch((err) => session.log.warn({ err: err.message }, 'failed to save raw packet'));
  }

  return {
    server,
    listen(port) {
      return new Promise((resolve) => server.listen(port, '0.0.0.0', resolve));
    },
    /** Stops accepting connections and closes existing ones. */
    async close() {
      await new Promise((resolve) => {
        server.close(() => resolve());
        for (const s of sockets) s.destroy();
      });
    },
    stats() {
      return { connections: sockets.size, devicesConnected: registry.size };
    },
  };
}

module.exports = { createGateway };
