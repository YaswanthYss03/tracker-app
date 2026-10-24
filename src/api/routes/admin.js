/**
 * Admin endpoints. Authenticate with EITHER
 *   - header "x-api-key: <ADMIN_API_KEY>"  (scripts, emergencies), or
 *   - "Authorization: Bearer <access token>" of a user with role "admin"  (admin website;
 *     when ADMIN_DOMAIN is set, only requests made through that host are accepted)
 *
 *   GET    /devices                         ?q=&status=&limit=&offset= list/search trackers (+ live state, total)
 *   POST   /devices                         register { imei, simNumber?, model?, name? } -> activation code
 *   POST   /devices/bulk                    { imeis: [...] } or { firstImei, count } -> codes (for box labels)
 *   GET    /devices/:imei                   one tracker, with owner/viewers
 *   PATCH  /devices/:imei                   { status?, simNumber?, model?, name? } (suspend disconnects it)
 *   DELETE /devices/:imei                   ?force=true delete tracker + all its data (claimed ones need force)
 *   POST   /devices/:imei/reset-code        new activation code (also clears a claim lock)
 *   POST   /devices/:imei/release           remove owner/viewers, wipe history, back to stock
 *   GET    /devices/:imei/positions         ?from=ISO&to=ISO&limit=1000
 *   POST   /devices/:imei/commands          { command: "WHERE#" } -> device reply
 *   GET    /users                           ?email=part&limit= search accounts
 *   PATCH  /users/:userId                   { role: user|admin }
 *   GET    /inquiries                       ?status=new|done&kind=contact|partner contact + partner requests
 *   PATCH  /inquiries/:id                   { status: new|done }
 *   GET    /connections                     trackers connected right now
 *   GET    /raw-packets                     ?imei=&limit= unknown/unparseable packets
 *   GET    /stats                           ingest + writer counters
 *   GET    /system                          database size, compression, counts
 */
const express = require('express');
const deviceAdmin = require('../../services/deviceAdmin');
const devicesRepo = require('../../db/repositories/devices');
const positionsRepo = require('../../db/repositories/positions');
const rawPacketsRepo = require('../../db/repositories/rawPackets');
const { prisma } = require('../../db/client');
const { runCommand } = require('../../services/commands');
const { safeEqual } = require('../../lib/secrets');
const { AppError, badRequest, unauthorized } = require('../../lib/errors');
const { parse, wrap, z } = require('../validate');
const { adminDevice } = require('../dto');

const registerSchema = z.object({
  imei: z.string().regex(/^\d{15}$/, 'must be 15 digits'),
  simNumber: z.string().max(20).optional(),
  model: z.string().max(40).optional(),
  name: z.string().max(80).optional(),
});
const statusSchema = z.object({ status: z.enum(['inventory', 'active', 'suspended']) });
const patchSchema = z
  .object({
    status: z.enum(['inventory', 'active', 'suspended']).optional(),
    simNumber: z.string().trim().max(20).nullable().optional(),
    model: z.string().trim().min(1).max(40).optional(),
    name: z.string().trim().max(80).nullable().optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, 'nothing to update');
const bulkSchema = z.union([
  z.object({ imeis: z.array(z.string().regex(/^\d{15}$/, 'each IMEI must be 15 digits')).min(1).max(1000), model: z.string().max(40).optional() }),
  z.object({ firstImei: z.string().regex(/^\d{15}$/), count: z.number().int().min(1).max(1000), model: z.string().max(40).optional() }),
]);
const rangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(5000).default(1000),
});
const commandSchema = z.object({
  command: z.string().regex(/^[\x20-\x7e]{1,200}$/, '1-200 printable ASCII characters'),
});

function createAdminRouter({ config, ingest, writer, cache, registry, ownership, authService }) {
  const router = express.Router();

  // API key (scripts) or a logged-in admin user (web panel). The role is
  // re-checked in the database so a demoted admin loses access immediately.
  router.use(wrap(async (req, res, next) => {
    const key = req.get('x-api-key');
    if (key) {
      if (config.adminApiKey && safeEqual(key, config.adminApiKey)) {
        req.admin = { via: 'api-key' };
        return next();
      }
      throw unauthorized('Invalid x-api-key');
    }
    const match = (req.get('authorization') || '').match(/^Bearer\s+(.+)$/i);
    if (!match || !authService) throw unauthorized('Admin login or x-api-key required');
    // Admin logins only count on the admin website, never on the customer site.
    if (config.adminDomain && req.hostname !== config.adminDomain) {
      throw new AppError(403, 'ADMIN_SITE_ONLY', `Use the admin website: https://${config.adminDomain}`);
    }
    const { id } = authService.verifyAccessToken(match[1]);
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
    if (user?.role !== 'admin') throw new AppError(403, 'FORBIDDEN', 'Admin access required');
    req.admin = { via: 'user', userId: user.id };
    next();
  }));

  const dto = (device, members) => adminDevice(device, { cache, registry, members });

  router.get('/devices', wrap(async (req, res) => {
    const status = req.query.status ? parse(statusSchema, { status: req.query.status }).status : undefined;
    const q = typeof req.query.q === 'string' && req.query.q.trim() ? req.query.q.trim().slice(0, 40) : undefined;
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;
    const [list, total] = await Promise.all([
      devicesRepo.list({ status, q, limit, offset }),
      devicesRepo.count({ status, q }),
    ]);
    res.json({ data: list.map((d) => dto(d)), count: list.length, total });
  }));

  router.post('/devices/bulk', wrap(async (req, res) => {
    const body = parse(bulkSchema, req.body);
    const imeis = body.imeis
      ? [...new Set(body.imeis)]
      : Array.from({ length: body.count }, (_, i) => (BigInt(body.firstImei) + BigInt(i)).toString().padStart(15, '0'));
    const results = [];
    for (const imei of imeis) {
      try {
        const { activationCode } = await deviceAdmin.registerDevice({ imei, model: body.model });
        results.push({ imei, activationCode });
      } catch (err) {
        results.push({ imei, error: err.message });
      }
    }
    res.status(201).json({
      data: results,
      created: results.filter((r) => r.activationCode).length,
      failed: results.filter((r) => r.error).length,
    });
  }));

  router.post('/devices', wrap(async (req, res) => {
    const body = parse(registerSchema, req.body);
    const { device, activationCode } = await deviceAdmin.registerDevice(body);
    res.status(201).json({ data: { ...dto(device), activationCode } });
  }));

  router.get('/devices/:imei', wrap(async (req, res) => {
    const device = await deviceAdmin.getByImei(req.params.imei);
    res.json({ data: dto(device, await ownership.listMembers(device.id)) });
  }));

  router.patch('/devices/:imei', wrap(async (req, res) => {
    const { status, ...details } = parse(patchSchema, req.body);
    let device;
    if (Object.keys(details).length) device = await deviceAdmin.updateDetails(req.params.imei, details);
    if (status) device = await deviceAdmin.setStatus(req.params.imei, status);
    const s = cache.get(device.id);
    if (s) {
      s.status = device.status;
      s.name = device.name;
    }
    if (status === 'suspended') registry.disconnect(device.id);
    res.json({ data: dto(device) });
  }));

  router.delete('/devices/:imei', wrap(async (req, res) => {
    const device = await deviceAdmin.deleteDevice(req.params.imei, { force: req.query.force === 'true' });
    registry.disconnect(device.id);
    cache.states.delete(device.id);
    ownership.events.emit('released', { deviceId: device.id });
    res.status(204).end();
  }));

  router.post('/devices/:imei/reset-code', wrap(async (req, res) => {
    const { device, activationCode } = await deviceAdmin.resetActivationCode(req.params.imei);
    res.json({ data: { imei: device.imei, activationCode } });
  }));

  router.post('/devices/:imei/release', wrap(async (req, res) => {
    const device = await deviceAdmin.getByImei(req.params.imei);
    res.json({ data: dto(await ownership.release(device.id), []) });
  }));

  router.get('/devices/:imei/positions', wrap(async (req, res) => {
    const device = await deviceAdmin.getByImei(req.params.imei);
    const q = parse(rangeSchema, req.query);
    const to = q.to ?? new Date();
    const from = q.from ?? new Date(to.getTime() - 24 * 3_600_000);
    if (from > to) throw badRequest('"from" must be before "to"');
    const rows = await positionsRepo.findRange(device.id, { from, to, limit: q.limit });
    res.json({
      data: rows.map((r) => ({
        gpsTime: r.gpsTime, lat: r.lat, lon: r.lon, speed: r.speed, course: r.course,
        satellites: r.satellites, acc: r.acc, receivedAt: r.receivedAt,
      })),
      count: rows.length,
    });
  }));

  router.post('/devices/:imei/commands', wrap(async (req, res) => {
    const device = await deviceAdmin.getByImei(req.params.imei);
    const { command } = parse(commandSchema, req.body);
    const result = await runCommand({
      registry, deviceId: device.id, command, timeoutMs: config.gateway.commandTimeoutMs,
    });
    res.json({ data: { imei: device.imei, ...result } });
  }));

  router.get('/users', wrap(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const email = typeof req.query.email === 'string' ? req.query.email.toLowerCase() : undefined;
    const users = await prisma.user.findMany({
      where: email ? { email: { contains: email } } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { access: { include: { device: { select: { imei: true, name: true } } } } },
    });
    res.json({
      data: users.map((u) => ({
        id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt,
        devices: u.access.map((a) => ({ imei: a.device.imei, name: a.device.name, role: a.role })),
      })),
      count: users.length,
    });
  }));

  router.patch('/users/:userId', wrap(async (req, res) => {
    const { role } = parse(z.object({ role: z.enum(['user', 'admin']) }), req.body);
    if (req.admin.userId === req.params.userId && role !== 'admin') {
      throw badRequest('You cannot remove your own admin role');
    }
    const user = await prisma.user.update({ where: { id: req.params.userId }, data: { role } }).catch((err) => {
      if (err.code === 'P2025' || err.code === 'P2023') throw new AppError(404, 'NOT_FOUND', 'User not found');
      throw err;
    });
    res.json({ data: { id: user.id, email: user.email, role: user.role } });
  }));

  router.get('/inquiries', wrap(async (req, res) => {
    const q = parse(
      z.object({
        status: z.enum(['new', 'done']).optional(),
        kind: z.enum(['contact', 'partner']).optional(),
        limit: z.coerce.number().int().min(1).max(500).default(100),
      }),
      req.query
    );
    const where = { ...(q.status && { status: q.status }), ...(q.kind && { kind: q.kind }) };
    const [rows, total, open] = await Promise.all([
      prisma.inquiry.findMany({ where, orderBy: { createdAt: 'desc' }, take: q.limit }),
      prisma.inquiry.count({ where }),
      prisma.inquiry.count({ where: { status: 'new' } }),
    ]);
    res.json({ data: rows, total, open });
  }));

  router.patch('/inquiries/:id', wrap(async (req, res) => {
    const { id } = parse(z.object({ id: z.string().uuid() }), req.params);
    const { status } = parse(z.object({ status: z.enum(['new', 'done']) }), req.body);
    const row = await prisma.inquiry.update({ where: { id }, data: { status } }).catch((err) => {
      if (err.code === 'P2025') throw new AppError(404, 'NOT_FOUND', 'Inquiry not found');
      throw err;
    });
    res.json({ data: row });
  }));

  router.get('/connections', (req, res) => {
    const list = registry.list();
    res.json({ data: list, count: list.length });
  });

  router.get('/raw-packets', wrap(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 500);
    const rows = await rawPacketsRepo.recent({ imei: req.query.imei, limit });
    res.json({ data: rows.map((r) => ({ ...r, id: r.id.toString() })), count: rows.length });
  }));

  router.get('/system', wrap(async (req, res) => {
    const [[size], compression, counts] = await Promise.all([
      prisma.$queryRaw`SELECT pg_database_size(current_database())::bigint AS bytes,
                              hypertable_size('positions')::bigint AS positions_bytes`,
      prisma.$queryRaw`SELECT * FROM hypertable_compression_stats('positions')`,
      prisma.$queryRaw`SELECT (SELECT count(*) FROM users)::int AS users,
                              (SELECT count(*) FROM devices)::int AS devices,
                              (SELECT count(*) FROM devices WHERE status = 'active')::int AS claimed,
                              (SELECT count(*) FROM trips)::int AS trips,
                              (SELECT count(*) FROM events)::int AS events`,
    ]);
    const mb = (b) => (b == null ? null : Math.round(Number(b) / 1e5) / 10);
    const c = compression[0] || {};
    res.json({
      data: {
        databaseMb: mb(size.bytes),
        positionsMb: mb(size.positions_bytes),
        compression: {
          chunks: Number(c.total_chunks ?? 0),
          compressedChunks: Number(c.number_compressed_chunks ?? 0),
          beforeMb: mb(c.before_compression_total_bytes),
          afterMb: mb(c.after_compression_total_bytes),
        },
        counts: counts[0],
        uptimeS: Math.round(process.uptime()),
        memoryMb: Math.round(process.memoryUsage().rss / 1e6),
      },
    });
  }));

  router.get('/stats', (req, res) => {
    res.json({ data: { ingest: ingest.stats(), writer: writer.stats(), devicesOnline: cache.onlineCount() } });
  });

  return router;
}

module.exports = { createAdminRouter };
