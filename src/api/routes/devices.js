/**
 * /api/v1/devices — a customer's trackers.
 *
 *   GET    /                              trackers I own or can view (with live state, todayKm)
 *   POST   /claim                         { imei, activationCode, name?, vehicleType? } -> 201 (200 if already mine)
 *   GET    /:deviceId                     one tracker                         (owner, viewer)
 *   GET    /:deviceId/live                live state only (light, for polling) (owner, viewer)
 *   PATCH  /:deviceId                     { name, icon (vehicle type), registrationNumber, color,
 *                                           mainDriverId, backupDriverId, speedLimitKmh, timezone } (owner)
 *   PATCH  /:deviceId/notifications       { enabled } my alert setting         (owner, viewer)
 *   GET    /:deviceId/members             who has access                       (owner)
 *   POST   /:deviceId/viewers             { email } share with someone         (owner)
 *   DELETE /:deviceId/members/:userId     remove a viewer / leave              (owner, or the viewer)
 *   POST   /:deviceId/release             { confirmImei } give the tracker up  (owner)
 *
 * Device IDs are internal UUIDs; the IMEI is only used once, to claim.
 */
const express = require('express');
const { parse, wrap, z, schemas, isValidTimezone } = require('../validate');
const { customerDevice, liveState, member } = require('../dto');
const { requireDeviceAccess } = require('../middleware');
const { badRequest } = require('../../lib/errors');
const { prisma } = require('../../db/client');
const { localMidnight } = require('../../lib/time');
const driversRepo = require('../../db/repositories/drivers');

// Vehicle type is stored in devices.icon; apps show a matching map icon.
const VEHICLE_TYPES = ['car', 'bike', 'scooter', 'bus', 'van', 'truck', 'auto', 'bicycle', 'tractor', 'other'];
const vehicleType = z.enum(VEHICLE_TYPES);
// Number plate, e.g. "TN 38 AB 1234" (stored upper-case, single spaces).
const registrationNumber = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase().replace(/\s+/g, ' '))
  .pipe(z.string().regex(/^[A-Z0-9][A-Z0-9 -]{2,14}$/, 'use letters, numbers, spaces or hyphens (3-15 characters)'));
// Older apps send a driver's name; it becomes (or matches) one of my drivers.
const driverName = z.string().trim().min(1).max(60);
const VEHICLE_COLORS = ['white', 'silver', 'black', 'blue', 'red', 'yellow', 'orange', 'green'];
const color = z.enum(VEHICLE_COLORS);

const claimSchema = z.object({
  imei: z.string().trim().regex(/^\d{15}$/, 'must be the 15-digit IMEI'),
  activationCode: z.string().trim().min(5).max(20),
  name: z.string().trim().min(1).max(80).optional(),
  vehicleType: vehicleType.optional(),
  registrationNumber: registrationNumber.optional(),
  driverName: driverName.optional(),
  mainDriverId: schemas.uuid.optional(),
  color: color.optional(),
});
const updateSchema = z
  .object({
    name: z.string().trim().min(1).max(80).nullable().optional(),
    icon: vehicleType.nullable().optional(), // vehicle type
    registrationNumber: registrationNumber.nullable().optional(),
    driverName: driverName.nullable().optional(),
    mainDriverId: schemas.uuid.nullable().optional(),
    backupDriverId: schemas.uuid.nullable().optional(),
    color: color.nullable().optional(),
    speedLimitKmh: z.number().int().min(10).max(250).nullable().optional(),
    timezone: z.string().refine(isValidTimezone, 'unknown timezone').optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, 'nothing to update');

/**
 * Distance driven today (since local midnight in each vehicle's timezone), from
 * trips that started today, including the one in progress. km, one decimal.
 */
async function distanceToday(devices) {
  if (devices.length === 0) return new Map();
  const ids = devices.map((d) => d.id);
  const since = devices.map((d) => localMidnight(Date.now(), d.timezone || 'Asia/Kolkata'));
  const rows = await prisma.$queryRaw`
    SELECT t.device_id::text AS id, COALESCE(SUM(t.distance_m), 0)::bigint AS m
    FROM trips t
    JOIN unnest(${ids}::uuid[], ${since}::timestamptz[]) AS p(device_id, since) ON p.device_id = t.device_id
    WHERE t.start_time >= p.since
    GROUP BY t.device_id`;
  return new Map(rows.map((r) => [r.id, Math.round(Number(r.m) / 100) / 10]));
}

/**
 * Turns driverName / mainDriverId / backupDriverId into device fields, checking
 * the drivers are mine. Main and backup can't be the same person: setting the
 * backup as main moves them (the backup slot is cleared).
 */
async function driverFields(userId, body, current = {}) {
  const out = {};
  if (body.driverName !== undefined) out.mainDriverId = body.driverName ? await driversRepo.idForName(userId, body.driverName) : null;
  if (body.mainDriverId !== undefined) out.mainDriverId = body.mainDriverId;
  if (body.backupDriverId !== undefined) out.backupDriverId = body.backupDriverId;
  const ids = [...new Set([out.mainDriverId, out.backupDriverId].filter(Boolean))];
  if (ids.length && (await prisma.driver.count({ where: { userId, id: { in: ids } } })) !== ids.length) {
    throw badRequest('Driver not found');
  }
  const main = out.mainDriverId !== undefined ? out.mainDriverId : current.mainDriverId;
  const backup = out.backupDriverId !== undefined ? out.backupDriverId : current.backupDriverId;
  if (main && main === backup) {
    if (body.backupDriverId !== undefined) throw badRequest('Main and backup driver must be different people');
    out.backupDriverId = null;
  }
  return out;
}

function createDevicesRouter({ ownership, cache, limits }) {
  const router = express.Router();
  const viewer = requireDeviceAccess(ownership, 'viewer');
  const owner = requireDeviceAccess(ownership, 'owner');
  const dto = (device, access) => customerDevice(device, access, { cache });

  router.get('/', wrap(async (req, res) => {
    const rows = await ownership.listForUser(req.user.id);
    await driversRepo.attachToDevices(rows.map((a) => a.device));
    const todayKm = await distanceToday(rows.map((a) => a.device));
    res.json({ data: rows.map((a) => ({ ...dto(a.device, a), todayKm: todayKm.get(a.device.id) ?? 0 })), count: rows.length });
  }));

  router.post('/claim', limits.claim, wrap(async (req, res) => {
    const body = parse(claimSchema, req.body);
    let { device, alreadyOwned } = await ownership.claim(req.user.id, body);
    if (!alreadyOwned && (body.vehicleType || body.registrationNumber || body.driverName || body.mainDriverId || body.color)) {
      device = await ownership.updateDevice(device.id, {
        ...(body.vehicleType && { icon: body.vehicleType }),
        ...(body.registrationNumber && { registrationNumber: body.registrationNumber }),
        ...(body.color && { color: body.color }),
        ...(await driverFields(req.user.id, { driverName: body.driverName, mainDriverId: body.mainDriverId })),
      });
    }
    const access = await ownership.getAccess(req.user.id, device.id);
    await driversRepo.attachToDevices([device]);
    res.status(alreadyOwned ? 200 : 201).json({ data: dto(device, access) });
  }));

  router.get('/:deviceId', viewer, wrap(async (req, res) => {
    await driversRepo.attachToDevices([req.device]);
    res.json({ data: dto(req.device, req.access) });
  }));

  router.get('/:deviceId/live', viewer, (req, res) => {
    res.json({ data: { id: req.device.id, ...liveState(req.device, cache) } });
  });

  router.patch('/:deviceId', owner, wrap(async (req, res) => {
    const { driverName, mainDriverId, backupDriverId, ...patch } = parse(updateSchema, req.body);
    const drivers = await driverFields(req.user.id, { driverName, mainDriverId, backupDriverId }, req.device);
    const device = await ownership.updateDevice(req.device.id, { ...patch, ...drivers });
    await driversRepo.attachToDevices([device]);
    res.json({ data: dto(device, req.access) });
  }));

  router.patch('/:deviceId/notifications', viewer, wrap(async (req, res) => {
    const { enabled } = parse(z.object({ enabled: z.boolean() }), req.body);
    const access = await ownership.setNotify(req.device.id, req.user.id, enabled);
    res.json({ data: { notify: access.notify } });
  }));

  router.get('/:deviceId/members', owner, wrap(async (req, res) => {
    const rows = await ownership.listMembers(req.device.id);
    res.json({ data: rows.map(member), count: rows.length });
  }));

  router.post('/:deviceId/viewers', owner, wrap(async (req, res) => {
    const { email } = parse(z.object({ email: schemas.email }), req.body);
    const access = await ownership.addViewer(req.device.id, req.user.id, email);
    res.status(201).json({ data: member(access) });
  }));

  router.delete('/:deviceId/members/:userId', viewer, wrap(async (req, res) => {
    const { userId } = parse(z.object({ userId: schemas.uuid }), req.params);
    await ownership.removeMember(req.device.id, req.access, userId);
    res.status(204).end();
  }));

  router.post('/:deviceId/release', owner, wrap(async (req, res) => {
    const { confirmImei } = parse(z.object({ confirmImei: z.string() }), req.body);
    if (confirmImei !== req.device.imei) {
      throw badRequest('confirmImei must match the tracker IMEI (this deletes its history)');
    }
    await ownership.release(req.device.id);
    res.status(204).end();
  }));

  return router;
}

module.exports = { createDevicesRouter };
