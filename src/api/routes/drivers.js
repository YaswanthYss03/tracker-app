/**
 * /api/v1/drivers — my drivers.
 *
 *   GET    /                list (with the vehicles each one drives)
 *   POST   /                { name, phone?, licenceNo?, licenceExpiry? (YYYY-MM-DD), avatar?, mainVehicleIds? } -> 201
 *   GET    /:id
 *   PATCH  /:id             same fields; mainVehicleIds = the full list of vehicles they are main driver of
 *   DELETE /:id             -> 204 (vehicles lose this driver)
 *   PUT    /:id/photo       { image: base64 JPEG/PNG, max 70 KB } -> driver
 *   DELETE /:id/photo       -> driver
 *   GET    /:id/photo       the image (me, or anyone who can see a vehicle they drive)
 */
const express = require('express');
const { parse, wrap, z, schemas } = require('../validate');
const { driverDto } = require('../dto');
const { badRequest, notFound } = require('../../lib/errors');
const { prisma } = require('../../db/client');
const driversRepo = require('../../db/repositories/drivers');

const MAX_DRIVERS = 100;
const MAX_PHOTO_BYTES = 70 * 1024;
const AVATARS = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'];

const fields = {
  name: z.string().trim().min(1).max(60),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{6,20}$/, 'enter a valid phone number').nullable(),
  licenceNo: z.string().trim().transform((v) => v.toUpperCase().replace(/\s+/g, ' ')).pipe(z.string().min(4).max(30)).nullable(),
  licenceExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD').refine((v) => !Number.isNaN(Date.parse(v)), 'invalid date').nullable(),
  avatar: z.enum(AVATARS).nullable(),
  mainVehicleIds: z.array(schemas.uuid).max(50),
};
const createSchema = z.object({
  name: fields.name,
  phone: fields.phone.optional(),
  licenceNo: fields.licenceNo.optional(),
  licenceExpiry: fields.licenceExpiry.optional(),
  avatar: fields.avatar.optional(),
  mainVehicleIds: fields.mainVehicleIds.optional(),
}).strict();
const updateSchema = createSchema.partial().strict().refine((v) => Object.keys(v).length > 0, 'nothing to update');

// Empty strings from forms mean "not set".
const blankToNull = (body) => Object.fromEntries(Object.entries(body || {}).map(([k, v]) => [k, v === '' ? null : v]));

function dataOf(body) {
  const data = {};
  for (const k of ['name', 'phone', 'licenceNo', 'avatar']) if (body[k] !== undefined) data[k] = body[k];
  if (body.licenceExpiry !== undefined) data.licenceExpiry = body.licenceExpiry ? new Date(`${body.licenceExpiry}T00:00:00Z`) : null;
  return data;
}

const vehicleDto = (v) => ({ id: v.id, name: v.name, registrationNumber: v.registrationNumber, icon: v.icon });
const fullDto = (d) => ({ ...driverDto(d), mainOf: d.mainOf.map(vehicleDto), backupOf: d.backupOf.map(vehicleDto) });

function createDriversRouter() {
  const router = express.Router();

  /** Makes `driverId` the main driver of exactly these (owned) vehicles. */
  async function setMainVehicles(tx, userId, driverId, ids) {
    const owned = await tx.deviceAccess.count({ where: { userId, role: 'owner', deviceId: { in: ids } } });
    if (owned !== new Set(ids).size) throw badRequest('You can only assign drivers to vehicles you own');
    await tx.device.updateMany({ where: { mainDriverId: driverId, id: { notIn: ids } }, data: { mainDriverId: null } });
    await tx.device.updateMany({ where: { id: { in: ids }, backupDriverId: driverId }, data: { backupDriverId: null } });
    await tx.device.updateMany({ where: { id: { in: ids } }, data: { mainDriverId: driverId } });
  }

  async function owned(req) {
    const { id } = parse(z.object({ id: schemas.uuid }), req.params);
    const d = await driversRepo.findOwned(req.user.id, id);
    if (!d) throw notFound('Driver not found');
    return d;
  }

  router.get('/', wrap(async (req, res) => {
    const rows = await driversRepo.listForUser(req.user.id);
    res.json({ data: rows.map(fullDto), count: rows.length });
  }));

  router.post('/', wrap(async (req, res) => {
    const body = parse(createSchema, blankToNull(req.body));
    if ((await prisma.driver.count({ where: { userId: req.user.id } })) >= MAX_DRIVERS) {
      throw badRequest(`You can add at most ${MAX_DRIVERS} drivers`);
    }
    const id = await prisma.$transaction(async (tx) => {
      const d = await tx.driver.create({ data: { userId: req.user.id, ...dataOf(body) }, select: { id: true } });
      if (body.mainVehicleIds) await setMainVehicles(tx, req.user.id, d.id, body.mainVehicleIds);
      return d.id;
    });
    res.status(201).json({ data: fullDto(await driversRepo.findOwned(req.user.id, id)) });
  }));

  router.get('/:id', wrap(async (req, res) => {
    res.json({ data: fullDto(await owned(req)) });
  }));

  router.patch('/:id', wrap(async (req, res) => {
    const d = await owned(req);
    const body = parse(updateSchema, blankToNull(req.body));
    await prisma.$transaction(async (tx) => {
      const data = dataOf(body);
      if (Object.keys(data).length) await tx.driver.update({ where: { id: d.id }, data });
      if (body.mainVehicleIds) await setMainVehicles(tx, req.user.id, d.id, body.mainVehicleIds);
    });
    res.json({ data: fullDto(await driversRepo.findOwned(req.user.id, d.id)) });
  }));

  router.delete('/:id', wrap(async (req, res) => {
    const d = await owned(req);
    await prisma.driver.delete({ where: { id: d.id } });
    res.status(204).end();
  }));

  router.put('/:id/photo', wrap(async (req, res) => {
    const d = await owned(req);
    const { image } = parse(z.object({ image: z.string().min(100).max(Math.ceil(MAX_PHOTO_BYTES / 3) * 4 + 4) }), req.body);
    const bytes = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    if (!isJpeg && !isPng) throw badRequest('Photo must be a JPEG or PNG image');
    if (bytes.length > MAX_PHOTO_BYTES) throw badRequest('Photo is too large (max 70 KB)');
    await prisma.driver.update({
      where: { id: d.id },
      data: { photo: bytes, photoType: isJpeg ? 'image/jpeg' : 'image/png', photoUpdatedAt: new Date() },
    });
    res.json({ data: fullDto(await driversRepo.findOwned(req.user.id, d.id)) });
  }));

  router.delete('/:id/photo', wrap(async (req, res) => {
    const d = await owned(req);
    await prisma.driver.update({ where: { id: d.id }, data: { photo: null, photoType: null, photoUpdatedAt: null } });
    res.json({ data: fullDto(await driversRepo.findOwned(req.user.id, d.id)) });
  }));

  router.get('/:id/photo', wrap(async (req, res) => {
    const { id } = parse(z.object({ id: schemas.uuid }), req.params);
    const userId = req.user.id;
    // Mine, or the driver of a vehicle shared with me.
    const d = await prisma.driver.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { mainOf: { some: { access: { some: { userId } } } } },
          { backupOf: { some: { access: { some: { userId } } } } },
        ],
      },
      select: { photo: true, photoType: true },
    });
    if (!d?.photo) throw notFound('No photo');
    res.set('content-type', d.photoType).set('cache-control', 'private, max-age=31536000, immutable').send(Buffer.from(d.photo));
  }));

  return router;
}

module.exports = { createDriversRouter, MAX_PHOTO_BYTES };
