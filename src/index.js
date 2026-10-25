/**
 * Entry point. Wires the pieces together:
 *
 *   TCP gateway (:5023) -> ingest pipeline -> batch writer -> PostgreSQL
 *                                   └-> device state cache -> devices table
 *                                   └-> processors: trips, alerts, geofences -> push + live map
 *   HTTP API + WebSocket (:3000) read the cache and the database.
 *
 * On SIGINT/SIGTERM (Ctrl+C, `docker stop`) it stops accepting connections,
 * saves buffered positions and device states, then exits.
 */
const config = require('./config');
const logger = require('./lib/logger');
const { prisma, pingDatabase } = require('./db/client');
const devicesRepo = require('./db/repositories/devices');
const positionsRepo = require('./db/repositories/positions');
const rawPacketsRepo = require('./db/repositories/rawPackets');
const { DeviceStateCache } = require('./pipeline/stateCache');
const { BatchWriter } = require('./pipeline/batchWriter');
const { Ingest } = require('./pipeline/ingest');
const { DeviceRegistry } = require('./gateway/deviceRegistry');
const { createGateway } = require('./gateway/tcpServer');
const { createApp } = require('./api/app');
const { createOwnershipService } = require('./services/ownership');
const { createAuthService } = require('./services/auth');
const { startProcessors } = require('./processors');
const { createFcm } = require('./notifications/fcm');
const { createNotifier } = require('./notifications/notifier');
const { createRealtime } = require('./realtime/socket');
const { createMailer } = require('./notifications/email');
const shareLinksRepo = require('./db/repositories/shareLinks');

async function connectWithRetry(attempts = 10, delayMs = 3000) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      logger.info('database connected');
      return;
    } catch (err) {
      logger.warn({ attempt: i, err: err.message.split('\n')[0] }, 'database not reachable yet');
      if (i === attempts) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function main() {
  await connectWithRetry();

  const cache = new DeviceStateCache({ logger });
  cache.startFlushing(devicesRepo.saveStates, config.writer.deviceStateFlushMs);

  const writer = new BatchWriter({ insert: positionsRepo.insertMany, logger, ...config.writer });
  writer.start();

  const ingest = new Ingest({ cache, writer, filters: config.filters, logger });
  const registry = new DeviceRegistry();

  const ownership = createOwnershipService({ cache });
  const mailer = createMailer({ ...config.email, logger });
  const requireEmailVerification =
    config.email.verification === 'on' || (config.email.verification === 'auto' && mailer.enabled);
  logger.info({ requireEmailVerification }, 'email verification for new accounts');
  const authService = createAuthService({
    ...config.auth, ownership, mailer, logger, requireEmailVerification, googleClientIds: config.google.clientIds,
  });
  logger.info({ googleSignIn: config.google.clientIds.length > 0 }, 'google sign-in');
  const fcm = createFcm({ credentialsFile: config.firebaseCredentialsFile, logger });
  const notifier = createNotifier({ fcm, logger });
  const processors = startProcessors({
    ingest, cache, ownership, logger,
    notifier,
    offlineAfterMs: config.offlineAfterMs,
  });

  const gateway = createGateway({
    config: config.gateway,
    deviceRepo: devicesRepo,
    rawPacketRepo: rawPacketsRepo,
    ingest,
    registry,
    logger,
  });
  await gateway.listen(config.tcpPort);
  logger.info({ port: config.tcpPort }, 'listening for GT06N devices');

  let realtime = null;
  const hooks = {
    geofencesChanged: (deviceId) => processors.geofences.invalidate(deviceId),
    shareLinkRevoked: (token) => realtime?.revokeShareLink(token),
  };
  const app = createApp({
    config, logger, pingDatabase, gateway, ingest, writer, cache, registry, ownership, authService, mailer,
    processors, hooks, notifier, pushEnabled: fcm.enabled, realtimeStats: () => realtime?.connectionCount() ?? 0,
  });
  const httpServer = app.listen(config.httpPort, '0.0.0.0', () =>
    logger.info({ port: config.httpPort, adminApi: Boolean(config.adminApiKey) }, 'HTTP API listening')
  );
  realtime = createRealtime({
    httpServer, config, authService, ownership, shareLinks: shareLinksRepo, cache, logger,
  });
  processors.attachRealtime(realtime);

  // Housekeeping: drop debug packets older than 7 days.
  const cleanup = setInterval(() => {
    rawPacketsRepo
      .deleteExpired()
      .then((n) => n && logger.info({ deleted: n }, 'old raw packets deleted'))
      .catch((err) => logger.warn({ err: err.message }, 'raw packet cleanup failed'));
  }, 60 * 60 * 1000);

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, 'shutting down');
    clearInterval(cleanup);

    processors.stop();
    await realtime.close().catch(() => {}); // also closes the HTTP server
    await gateway.close();
    await writer.stop();
    await cache.stop();
    await prisma.$disconnect().catch(() => {});
    logger.info('shutdown complete');
    process.exit(0);
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.fatal({ err: err.message }, 'startup failed');
  process.exit(1);
});
