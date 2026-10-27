/**
 * Tracking data for one tracker: /api/v1/devices/:deviceId/...
 *
 *   GET    /positions          ?from&to&maxPoints   route history (max 7 days, simplified)   viewer
 *   GET    /trips              ?from&to             trips (max 31 days) incl. one in progress viewer
 *   GET    /trips/:tripId/route ?maxPoints          the path of one trip                     viewer
 *   GET    /trip-logs                               hand-started trips with numbers         viewer
 *   POST   /trip-logs          { name? } starts a new trip; new data goes into it         owner
 *   DELETE /trip-logs/:id      its data joins the trip before it                          owner
 *   GET    /trip-logs/:id/route ?maxPoints          the path of one hand-started trip      viewer
 *   GET    /summary                                 totals: distance, driving hours, avg speed viewer
 *   GET    /reports/daily      ?from&to (YYYY-MM-DD) distance, driving/idle time per day      viewer
 *   GET    /events             ?from&to&type=a,b    alerts (max 31 days)                     viewer
 *   GET    /geofences                                                                        viewer
 *   POST   /geofences          circle or polygon                                             owner
 *   PATCH  /geofences/:id      name / alerts / shape                                         owner
 *   DELETE /geofences/:id                                                                     owner
 *   POST   /share-links        { expiresInMinutes } -> token                                 owner
 *   GET    /share-links        active links                                                  owner
 *   DELETE /share-links/:token                                                               owner
 *   POST   /commands           { type: locate|status|setInterval|reboot, seconds? }          owner
 *
 * Times are ISO-8601 UTC. Defaults: last 24 h for positions, last 7 days otherwise.
 */
const crypto = require('crypto');
const express = require('express');
const { parse, wrap, z, schemas } = require('../validate');
const { requireDeviceAccess } = require('../middleware');
const { eventDto, tripDto, tripLogDto, geofenceDto } = require('../dto');
const { badRequest, notFound, AppError } = require('../../lib/errors');
const { simplifyToMax } = require('../../lib/geo');
const { localDay } = require('../../processors/trips');
const { runCommand, CUSTOMER_COMMANDS } = require('../../services/commands');
const positionsRepo = require('../../db/repositories/positions');
const tripsRepo = require('../../db/repositories/trips');
const tripLogsRepo = require('../../db/repositories/tripLogs');
const eventsRepo = require('../../db/repositories/events');
const geofencesRepo = require('../../db/repositories/geofences');
const shareLinksRepo = require('../../db/repositories/shareLinks');
const { prisma } = require('../../db/client');

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const MAX_GEOFENCES = 20;
const EVENT_TYPES = [
  'ignition_on', 'ignition_off', 'overspeed', 'geofence_enter', 'geofence_exit',
  'sos', 'power_cut', 'vibration', 'low_battery', 'power_off', 'offline', 'online', 'long_stop', 'gps_lost',
];

/** from/to with defaults and a maximum span. */
function timeRange(query, { defaultMs, maxMs }) {
  const q = parse(z.object({ from: z.coerce.date().optional(), to: z.coerce.date().optional() }), query);
  const to = q.to ?? new Date();
  const from = q.from ?? new Date(to.getTime() - defaultMs);
  if (from > to) throw badRequest('"from" must be before "to"');
  if (to - from > maxMs) throw badRequest(`Time range too long (max ${Math.round(maxMs / DAY)} days)`);
  return { from, to };
}

const maxPointsSchema = z.object({ maxPoints: z.coerce.number().int().min(10).max(10_000).default(2000) });

function routeDto(rows, maxPoints) {
  const points = rows.map((r) => ({
    t: r.gpsTime, lat: r.lat, lon: r.lon, speed: r.speed, heading: r.course, ignition: r.acc,
  }));
  const simplified = simplifyToMax(points, maxPoints);
  return { points: simplified, count: simplified.length, originalCount: points.length };
}

const latLon = z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) });
const pointPair = z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]);
const fenceBase = {
  name: z.string().trim().min(1).max(60),
  alertOnEnter: z.boolean().default(true),
  alertOnExit: z.boolean().default(true),
};
const createFenceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('circle'), center: latLon, radiusM: z.number().int().min(50).max(50_000), ...fenceBase }),
  z.object({ type: z.literal('polygon'), points: z.array(pointPair).min(3).max(100), ...fenceBase }),
]);
const updateFenceSchema = z
  .object({
    name: fenceBase.name.optional(),
    alertOnEnter: z.boolean().optional(),
    alertOnExit: z.boolean().optional(),
    center: latLon.optional(),
    radiusM: z.number().int().min(50).max(50_000).optional(),
    points: z.array(pointPair).min(3).max(100).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, 'nothing to update');

const commandSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('locate') }),
  z.object({ type: z.literal('status') }),
  z.object({ type: z.literal('reboot') }),
  z.object({ type: z.literal('setInterval'), seconds: z.number().int().min(10).max(3600) }),
]);

function createTrackingRouter({ ownership, registry, processors, hooks, config, limits }) {
  const router = express.Router({ mergeParams: true });
  const viewer = requireDeviceAccess(ownership, 'viewer');
  const owner = requireDeviceAccess(ownership, 'owner');

  // ---- history ----
  router.get('/:deviceId/positions', viewer, wrap(async (req, res) => {
    const { from, to } = timeRange(req.query, { defaultMs: DAY, maxMs: 7 * DAY });
    const { maxPoints } = parse(maxPointsSchema, req.query);
    const rows = await positionsRepo.findRoute(req.device.id, { from, to });
    res.json({ data: { from, to, ...routeDto(rows, maxPoints) } });
  }));

  // ---- trips ----
  router.get('/:deviceId/trips', viewer, wrap(async (req, res) => {
    const { from, to } = timeRange(req.query, { defaultMs: 7 * DAY, maxMs: 31 * DAY });
    const rows = await tripsRepo.listTrips(req.device.id, { from, to });
    const active = processors?.trips.activeTrip(req.device.id);
    const data = rows.map((t) => {
      // The trip in progress: use the live numbers instead of the last saved ones.
      if (!t.endTime && active?.id === t.id) {
        return { ...tripDto({ ...t, ...active }), inProgress: true };
      }
      return { ...tripDto(t), inProgress: !t.endTime };
    });
    res.json({ data, count: data.length });
  }));

  router.get('/:deviceId/trips/:tripId/route', viewer, wrap(async (req, res) => {
    const { tripId } = parse(z.object({ tripId: schemas.uuid }), req.params);
    const trip = await tripsRepo.findTrip(req.device.id, tripId);
    if (!trip) throw notFound('Trip not found');
    const { maxPoints } = parse(maxPointsSchema, req.query);
    const end = trip.endTime ?? new Date();
    const rows = await positionsRepo.findRoute(req.device.id, { from: trip.startTime, to: end });
    res.json({ data: { trip: tripDto(trip), ...routeDto(rows, maxPoints) } });
  }));

  // ---- hand-started trips ("+ New trip") ----
  // Everything recorded after a trip is started belongs to it, until the next one is started.
  const logWindow = (logs, i) => ({ from: logs[i].startedAt, to: i === 0 ? new Date() : logs[i - 1].startedAt });

  router.get('/:deviceId/trip-logs', viewer, wrap(async (req, res) => {
    const logs = await tripLogsRepo.list(req.device.id); // newest first
    const data = await Promise.all(logs.map(async (log, i) => {
      const { from, to } = logWindow(logs, i);
      const { stats } = await tripLogsRepo.statsBetween(req.device.id, from, to);
      return tripLogDto(log, { number: logs.length - i, endedAt: i === 0 ? null : logs[i - 1].startedAt, stats });
    }));
    res.json({ data, count: data.length });
  }));

  router.post('/:deviceId/trip-logs', owner, wrap(async (req, res) => {
    const { name } = parse(z.object({ name: z.string().trim().max(60).optional() }), req.body ?? {});
    // No name given: "Trip 1", "Trip 2", ... in the order they were started.
    const before = (await tripLogsRepo.list(req.device.id)).length;
    const log = await tripLogsRepo.create(req.device.id, { name: name || `Trip ${before + 1}`, createdBy: req.user.id });
    const total = before + 1;
    res.status(201).json({ data: tripLogDto(log, { number: total, endedAt: null, stats: tripLogsRepo.statsFrom([]) }) });
  }));

  router.delete('/:deviceId/trip-logs/:id', owner, wrap(async (req, res) => {
    const { id } = parse(z.object({ id: schemas.uuid }), req.params);
    const log = await tripLogsRepo.find(req.device.id, id);
    if (!log) throw notFound('Trip not found');
    await tripLogsRepo.remove(id);
    res.status(204).end();
  }));

  router.get('/:deviceId/trip-logs/:id/route', viewer, wrap(async (req, res) => {
    const { id } = parse(z.object({ id: schemas.uuid }), req.params);
    const { maxPoints } = parse(maxPointsSchema, req.query);
    const logs = await tripLogsRepo.list(req.device.id);
    const i = logs.findIndex((l) => l.id === id);
    if (i === -1) throw notFound('Trip not found');
    const { from, to } = logWindow(logs, i);
    const { rows, stats } = await tripLogsRepo.statsBetween(req.device.id, from, to);
    // Same shape as /trips/:id/route so the app can show it with the same screen.
    const trip = {
      id,
      startTime: from,
      endTime: i === 0 ? null : to,
      start: stats.startLat != null ? { lat: stats.startLat, lon: stats.startLon } : { lat: 0, lon: 0 },
      end: stats.endLat != null ? { lat: stats.endLat, lon: stats.endLon } : null,
      distanceKm: Math.round(stats.distanceM / 100) / 10,
      maxSpeed: stats.maxSpeed, avgSpeed: stats.avgSpeed, durationS: stats.durationS, idleS: stats.idleS,
      inProgress: i === 0,
    };
    res.json({ data: { trip, ...routeDto(rows, maxPoints) } });
  }));

  // Totals over all saved trips (trips are deleted when the vehicle is released,
  // so these are the current owner's numbers).
  router.get('/:deviceId/summary', viewer, wrap(async (req, res) => {
    const [row] = await prisma.$queryRaw`
      SELECT COALESCE(SUM(distance_m), 0)::bigint AS distance_m,
             COALESCE(SUM(GREATEST(duration_s - idle_s, 0)), 0)::bigint AS driving_s,
             COUNT(*)::int AS trips
      FROM trips WHERE device_id = ${req.device.id}::uuid AND end_time IS NOT NULL`;
    const distanceKm = Number(row.distance_m) / 1000;
    const drivingH = Number(row.driving_s) / 3600;
    res.json({
      data: {
        totalKm: Math.round(distanceKm * 10) / 10,
        drivingHours: Math.round(drivingH * 10) / 10,
        avgSpeed: drivingH > 0.01 ? Math.round(distanceKm / drivingH) : 0,
        trips: row.trips,
      },
    });
  }));

  // ---- daily report ----
  router.get('/:deviceId/reports/daily', viewer, wrap(async (req, res) => {
    const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD');
    const q = parse(z.object({ from: day.optional(), to: day.optional() }), req.query);
    const tz = req.device.timezone;
    const to = q.to ?? localDay(Date.now(), tz);
    const from = q.from ?? localDay(Date.parse(`${to}T00:00:00Z`) - 6 * DAY, 'UTC');
    if (from > to) throw badRequest('"from" must be before "to"');
    if (Date.parse(to) - Date.parse(from) > 92 * DAY) throw badRequest('Time range too long (max 92 days)');

    const rows = await tripsRepo.listDays(req.device.id, { from: new Date(from), to: new Date(to) });
    const data = rows.map((r) => ({
      day: r.day.toISOString().slice(0, 10),
      distanceKm: Math.round(r.distanceM / 100) / 10,
      maxSpeed: r.maxSpeed,
      drivingS: r.drivingS,
      idleS: r.idleS,
      trips: r.tripsCount,
    }));
    const total = data.reduce(
      (acc, d) => ({
        distanceKm: Math.round((acc.distanceKm + d.distanceKm) * 10) / 10,
        drivingS: acc.drivingS + d.drivingS,
        idleS: acc.idleS + d.idleS,
        trips: acc.trips + d.trips,
        maxSpeed: Math.max(acc.maxSpeed, d.maxSpeed),
      }),
      { distanceKm: 0, drivingS: 0, idleS: 0, trips: 0, maxSpeed: 0 }
    );
    res.json({ data: { from, to, timezone: tz, days: data, total, note: 'Only finished trips are counted' } });
  }));

  // ---- events / alerts ----
  router.get('/:deviceId/events', viewer, wrap(async (req, res) => {
    const { from, to } = timeRange(req.query, { defaultMs: 7 * DAY, maxMs: 31 * DAY });
    const q = parse(
      z.object({
        type: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(1000).default(200),
      }),
      req.query
    );
    const types = q.type ? q.type.split(',').map((t) => t.trim()) : undefined;
    const unknown = types?.filter((t) => !EVENT_TYPES.includes(t));
    if (unknown?.length) throw badRequest(`Unknown event type(s): ${unknown.join(', ')}`);
    const rows = await eventsRepo.list(req.device.id, { from, to, types, limit: q.limit });
    res.json({ data: rows.map(eventDto), count: rows.length });
  }));

  // ---- geofences ----
  router.get('/:deviceId/geofences', viewer, wrap(async (req, res) => {
    const rows = await geofencesRepo.listForDevice(req.device.id);
    res.json({ data: rows.map(geofenceDto), count: rows.length });
  }));

  router.post('/:deviceId/geofences', owner, wrap(async (req, res) => {
    const body = parse(createFenceSchema, req.body);
    if ((await geofencesRepo.count(req.device.id)) >= MAX_GEOFENCES) {
      throw badRequest(`At most ${MAX_GEOFENCES} geofences per tracker`);
    }
    const row = await geofencesRepo.create({
      deviceId: req.device.id,
      name: body.name,
      type: body.type,
      geometry: body.type === 'circle' ? body.center : body.points,
      radiusM: body.type === 'circle' ? body.radiusM : null,
      alertOnEnter: body.alertOnEnter,
      alertOnExit: body.alertOnExit,
    });
    hooks.geofencesChanged(req.device.id);
    res.status(201).json({ data: geofenceDto(row) });
  }));

  router.patch('/:deviceId/geofences/:fenceId', owner, wrap(async (req, res) => {
    const { fenceId } = parse(z.object({ fenceId: schemas.uuid }), { fenceId: req.params.fenceId });
    const fence = await geofencesRepo.find(req.device.id, fenceId);
    if (!fence) throw notFound('Geofence not found');
    const body = parse(updateFenceSchema, req.body);

    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.alertOnEnter !== undefined) data.alertOnEnter = body.alertOnEnter;
    if (body.alertOnExit !== undefined) data.alertOnExit = body.alertOnExit;
    if (fence.type === 'circle') {
      if (body.points) throw badRequest('This geofence is a circle: use center/radiusM');
      if (body.center) data.geometry = body.center;
      if (body.radiusM) data.radiusM = body.radiusM;
    } else {
      if (body.center || body.radiusM) throw badRequest('This geofence is a polygon: use points');
      if (body.points) data.geometry = body.points;
    }
    const row = await geofencesRepo.update(fence.id, data);
    hooks.geofencesChanged(req.device.id);
    res.json({ data: geofenceDto(row) });
  }));

  router.delete('/:deviceId/geofences/:fenceId', owner, wrap(async (req, res) => {
    const { fenceId } = parse(z.object({ fenceId: schemas.uuid }), { fenceId: req.params.fenceId });
    const fence = await geofencesRepo.find(req.device.id, fenceId);
    if (!fence) throw notFound('Geofence not found');
    await geofencesRepo.remove(fence.id);
    hooks.geofencesChanged(req.device.id);
    res.status(204).end();
  }));

  // ---- share links ----
  router.post('/:deviceId/share-links', owner, wrap(async (req, res) => {
    const { expiresInMinutes } = parse(
      z.object({ expiresInMinutes: z.number().int().min(5).max(7 * 24 * 60).default(60) }),
      req.body
    );
    const token = crypto.randomBytes(24).toString('base64url');
    const link = await shareLinksRepo.create({
      token,
      deviceId: req.device.id,
      createdBy: req.user.id,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60_000),
    });
    res.status(201).json({ data: { token, expiresAt: link.expiresAt, apiUrl: `/api/v1/public/share/${token}` } });
  }));

  router.get('/:deviceId/share-links', owner, wrap(async (req, res) => {
    const links = await shareLinksRepo.listActive(req.device.id);
    res.json({
      data: links.map((l) => ({ token: l.token, expiresAt: l.expiresAt, createdAt: l.createdAt })),
      count: links.length,
    });
  }));

  router.delete('/:deviceId/share-links/:token', owner, wrap(async (req, res) => {
    const revoked = await shareLinksRepo.revoke(req.device.id, req.params.token);
    if (!revoked) throw notFound('Share link not found');
    hooks.shareLinkRevoked(req.params.token);
    res.status(204).end();
  }));

  // ---- commands ----
  router.post('/:deviceId/commands', limits.commands, owner, wrap(async (req, res) => {
    const body = parse(commandSchema, req.body);
    const result = await runCommand({
      registry,
      deviceId: req.device.id,
      userId: req.user.id,
      command: CUSTOMER_COMMANDS[body.type](body),
      timeoutMs: config.gateway.commandTimeoutMs,
    });
    res.json({ data: { type: body.type, response: result.response, sentAt: result.sentAt, respondedAt: result.respondedAt } });
  }));

  return router;
}

/** Public, no login: GET /api/v1/public/share/:token -> live position of a shared tracker. */
function createPublicRouter({ cache }) {
  const { liveState } = require('../dto');
  const router = express.Router();
  router.get('/share/:token', wrap(async (req, res) => {
    const link = await shareLinksRepo.findValid(String(req.params.token).slice(0, 100));
    if (!link) throw new AppError(404, 'SHARE_LINK_INVALID', 'This link has expired or was revoked');
    const live = liveState(link.device, cache);
    res.json({
      data: {
        name: link.device.name,
        expiresAt: link.expiresAt,
        live: {
          lat: live.lat, lon: live.lon, speed: live.speed, heading: live.heading,
          gpsTime: live.gpsTime, online: live.online, lastSeenAt: live.lastSeenAt,
        },
      },
    });
  }));
  return router;
}

module.exports = { createTrackingRouter, createPublicRouter, EVENT_TYPES };
