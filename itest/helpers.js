/**
 * Integration test setup: runs against a separate database "gps_test" on the
 * same PostgreSQL server as DATABASE_URL (start it with: docker compose up -d db).
 *
 * Must be required BEFORE any src/ module, because it points DATABASE_URL at
 * the test database.
 */
require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

const baseUrl = new URL(process.env.DATABASE_URL);
const testUrl = new URL(baseUrl);
testUrl.pathname = '/gps_test';
process.env.DATABASE_URL = testUrl.toString();
process.env.LOG_LEVEL = 'silent';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-test-secret-test-secret-123';

const { PrismaClient } = require('@prisma/client');

let prepared = false;

/** Creates gps_test if needed and applies migrations (once per process). */
async function prepareDatabase() {
  if (prepared) return;
  const admin = new PrismaClient({ datasources: { db: { url: baseUrl.toString() } } });
  const exists = await admin.$queryRaw`SELECT 1 FROM pg_database WHERE datname = 'gps_test'`;
  if (exists.length === 0) await admin.$executeRawUnsafe('CREATE DATABASE gps_test');
  await admin.$disconnect();

  execSync('npx prisma migrate deploy', {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: testUrl.toString() },
    stdio: 'pipe',
  });
  prepared = true;
}

/** Empties every table between tests. */
async function resetData(prisma) {
  await prisma.$executeRawUnsafe(`
    TRUNCATE users, devices, device_access, positions, trips, daily_stats, events, geofences,
             share_links, push_tokens, refresh_tokens, commands_log, raw_packets, inquiries CASCADE`);
}

/** Starts the HTTP app on a random port with real services and stub gateway/writer. */
/** @param {{ requireEmailVerification?: boolean, adminDomain?: string }} [opts] */
async function startApp({ requireEmailVerification = false, adminDomain = '' } = {}) {
  await prepareDatabase();
  const pino = require('pino');
  const { loadConfig } = require('../src/config');
  const { prisma, pingDatabase } = require('../src/db/client');
  const { DeviceStateCache } = require('../src/pipeline/stateCache');
  const { DeviceRegistry } = require('../src/gateway/deviceRegistry');
  const { createOwnershipService } = require('../src/services/ownership');
  const { createAuthService } = require('../src/services/auth');
  const { createApp } = require('../src/api/app');
  const { BatchWriter } = require('../src/pipeline/batchWriter');
  const { Ingest } = require('../src/pipeline/ingest');
  const { startProcessors } = require('../src/processors');
  const { createRealtime } = require('../src/realtime/socket');
  const positionsRepo = require('../src/db/repositories/positions');
  const shareLinksRepo = require('../src/db/repositories/shareLinks');

  const config = loadConfig({ ...process.env, ADMIN_API_KEY: 'a'.repeat(40) });
  const logger = pino({ level: 'silent' });
  const cache = new DeviceStateCache({ logger });
  const registry = new DeviceRegistry();
  const ownership = createOwnershipService({ cache });
  const emails = []; // emails that would have been sent
  const mailer = { enabled: true, send: async (m) => emails.push(m) };
  const authService = createAuthService({
    ...config.auth, ownership, mailer, logger, requireEmailVerification,
    // Fake Google: the test token "google|<sub>|<email>|<verified?>" stands for a checked ID token.
    googleClientIds: ['test-web-client.apps.googleusercontent.com'],
    verifyGoogleToken: async (token) => {
      const [tag, sub, email, verified] = token.split('|');
      if (tag !== 'google-test-token') throw new Error('bad token');
      return { sub, email, email_verified: verified !== 'no', name: 'Google User' };
    },
  });

  // Real pipeline: ingest -> batch writer (flushed by tests) -> processors.
  const writer = new BatchWriter({ insert: positionsRepo.insertMany, flushMs: 60_000, maxRows: 500, maxBacklog: 10_000, logger });
  const ingest = new Ingest({ cache, writer, filters: config.filters, logger });
  const pushed = []; // notifications that would have been sent
  const processors = startProcessors({
    ingest, cache, ownership, logger,
    notifier: { notify: (e) => pushed.push(e) },
    offlineAfterMs: config.offlineAfterMs,
  });
  let realtime = null;
  const hooks = {
    geofencesChanged: (id) => processors.geofences.invalidate(id),
    shareLinkRevoked: (t) => realtime?.revokeShareLink(t),
  };

  const app = createApp({
    config: { ...config, adminDomain, google: { clientIds: ['test-web-client.apps.googleusercontent.com'] }, support: { email: 'support@example.com', phone: '+91 90000 00000', whatsapp: '', address: '' } },
    logger, pingDatabase, cache, registry, ownership, authService, processors, hooks, writer, ingest, mailer,
    rateLimits: { register: 10_000, claim: 10_000, commands: 10_000, forgotPassword: 10_000, resetPassword: 10_000, google: 10_000, inquiry: 10_000 }, // tests sign up many users from one IP
    gateway: { stats: () => ({ connections: 0, devicesConnected: 0 }) },
    // Fake address lookup (no calls to OpenStreetMap from tests).
    geocoder: { reverse: async (lat, lon) => (lat > 0 ? `Test Road, near ${lat.toFixed(2)},${lon.toFixed(2)}` : null) },
  });

  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  realtime = createRealtime({ httpServer: server, config, authService, ownership, shareLinks: shareLinksRepo, cache, logger });
  processors.attachRealtime(realtime);
  const base = `http://127.0.0.1:${server.address().port}`;

  /** Small fetch wrapper: api('POST', '/api/v1/...', { body, token, key }) -> { status, body } */
  async function api(method, url, { body, token, key, host } = {}) {
    const headers = { 'content-type': 'application/json' };
    if (host) headers.host = host;
    if (token) headers.authorization = `Bearer ${token}`;
    if (key) headers['x-api-key'] = key;
    const res = await fetch(base + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  }

  return {
    api,
    base,
    prisma,
    cache,
    ingest,
    writer,
    processors,
    realtime,
    registry,
    pushed,
    emails,
    adminKey: 'a'.repeat(40),
    async close() {
      processors.stop();
      await realtime.close();
      await prisma.$disconnect();
    },
  };
}

module.exports = { startApp, resetData };
