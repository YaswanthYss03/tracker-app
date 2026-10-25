/**
 * Service history of one vehicle: /api/v1/devices/:deviceId/service
 *
 *   GET    /             records (newest first), next service, estimated odometer   viewer
 *   POST   /             { type, date, odometerKm?, garage?, cost?, notes?, nextDueDate? } owner
 *   PATCH  /:recordId    same fields                                               owner
 *   DELETE /:recordId                                                              owner
 *
 * Dates are YYYY-MM-DD (the vehicle's local calendar). Cost in whole rupees.
 */
const express = require('express');
const { parse, wrap, z, schemas } = require('../validate');
const { requireDeviceAccess } = require('../middleware');
const { badRequest, notFound } = require('../../lib/errors');
const { prisma } = require('../../db/client');
const { localDate } = require('../../lib/time');

const TYPES = ['general', 'oil', 'tyres', 'brakes', 'battery', 'other'];
const MAX_RECORDS = 500;
const DAY = 86_400_000;

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD').refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'invalid date');
const fields = {
  type: z.enum(TYPES),
  date: day,
  odometerKm: z.number().int().min(0).max(3_000_000).nullable(),
  garage: z.string().trim().max(80).nullable(),
  cost: z.number().int().min(0).max(10_000_000).nullable(),
  notes: z.string().trim().max(500).nullable(),
  nextDueDate: day.nullable(),
};
const createSchema = z.object({
  type: fields.type,
  date: fields.date,
  odometerKm: fields.odometerKm.optional(),
  garage: fields.garage.optional(),
  cost: fields.cost.optional(),
  notes: fields.notes.optional(),
  nextDueDate: fields.nextDueDate.optional(),
}).strict();
const updateSchema = createSchema.partial().strict().refine((v) => Object.keys(v).length > 0, 'nothing to update');

const toDate = (d) => (d ? new Date(`${d}T00:00:00Z`) : d);
const iso = (d) => (d ? d.toISOString().slice(0, 10) : null);
const blankToNull = (body) => Object.fromEntries(Object.entries(body || {}).map(([k, v]) => [k, v === '' ? null : v]));

function dataOf(body) {
  const data = {};
  for (const k of ['type', 'odometerKm', 'garage', 'cost', 'notes']) if (body[k] !== undefined) data[k] = body[k];
  if (body.date !== undefined) data.date = toDate(body.date);
  if (body.nextDueDate !== undefined) data.nextDueDate = toDate(body.nextDueDate);
  return data;
}

function recordDto(r) {
  return {
    id: r.id, type: r.type, date: iso(r.date), odometerKm: r.odometerKm, garage: r.garage, cost: r.cost,
    notes: r.notes, nextDueDate: iso(r.nextDueDate),
  };
}

/** Next service: the due date of the most recent record that has one. */
function nextService(records, today) {
  const r = records.find((x) => x.nextDueDate);
  if (!r) return null;
  const t = Date.parse(`${today}T00:00:00Z`);
  const from = r.date.getTime();
  const due = r.nextDueDate.getTime();
  return {
    date: iso(r.nextDueDate),
    daysLeft: Math.round((due - t) / DAY),
    // Share of the interval already used (0 = just serviced, 1 = due today).
    progress: due > from ? Math.max(0, Math.min(1, (t - from) / (due - from))) : 1,
    type: r.type,
  };
}

function checkDates(date, nextDueDate, today) {
  if (date && date > today) throw badRequest('The service date cannot be in the future');
  if (date && nextDueDate && nextDueDate <= date) throw badRequest('Next service must be after the service date');
}

function createServiceRouter({ ownership }) {
  const router = express.Router();
  const viewer = requireDeviceAccess(ownership, 'viewer');
  const owner = requireDeviceAccess(ownership, 'owner');
  const today = (req) => localDate(Date.now(), req.device.timezone || 'Asia/Kolkata');

  router.get('/:deviceId/service', viewer, wrap(async (req, res) => {
    const records = await prisma.serviceRecord.findMany({ where: { deviceId: req.device.id }, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }] });
    // Odometer now ≈ last reading + km driven since that day.
    let estimatedOdometerKm = null;
    const withOdo = records.find((r) => r.odometerKm != null);
    if (withOdo) {
      const [row] = await prisma.$queryRaw`
        SELECT COALESCE(SUM(distance_m), 0)::bigint AS m FROM trips
        WHERE device_id = ${req.device.id}::uuid AND start_time >= ${withOdo.date}`;
      estimatedOdometerKm = withOdo.odometerKm + Math.round(Number(row.m) / 1000);
    }
    res.json({ data: records.map(recordDto), next: nextService(records, today(req)), estimatedOdometerKm });
  }));

  router.post('/:deviceId/service', owner, wrap(async (req, res) => {
    const body = parse(createSchema, blankToNull(req.body));
    checkDates(body.date, body.nextDueDate, today(req));
    if ((await prisma.serviceRecord.count({ where: { deviceId: req.device.id } })) >= MAX_RECORDS) {
      throw badRequest(`At most ${MAX_RECORDS} service records per vehicle`);
    }
    const r = await prisma.serviceRecord.create({ data: { deviceId: req.device.id, createdBy: req.user.id, ...dataOf(body) } });
    res.status(201).json({ data: recordDto(r) });
  }));

  async function findRecord(req) {
    const { recordId } = parse(z.object({ recordId: schemas.uuid }), req.params);
    const r = await prisma.serviceRecord.findFirst({ where: { id: recordId, deviceId: req.device.id } });
    if (!r) throw notFound('Service record not found');
    return r;
  }

  router.patch('/:deviceId/service/:recordId', owner, wrap(async (req, res) => {
    const r = await findRecord(req);
    const body = parse(updateSchema, blankToNull(req.body));
    const date = body.date ?? iso(r.date);
    const next = body.nextDueDate !== undefined ? body.nextDueDate : iso(r.nextDueDate);
    checkDates(date, next, today(req));
    const updated = await prisma.serviceRecord.update({ where: { id: r.id }, data: dataOf(body) });
    res.json({ data: recordDto(updated) });
  }));

  router.delete('/:deviceId/service/:recordId', owner, wrap(async (req, res) => {
    const r = await findRecord(req);
    await prisma.serviceRecord.delete({ where: { id: r.id } });
    res.status(204).end();
  }));

  return router;
}

/** Next service date per vehicle (for the list): Map id -> 'YYYY-MM-DD'. */
async function serviceDueDates(deviceIds) {
  if (!deviceIds.length) return new Map();
  const rows = await prisma.$queryRaw`
    SELECT DISTINCT ON (device_id) device_id::text AS id, next_due_date
    FROM service_records
    WHERE device_id = ANY(${deviceIds}::uuid[]) AND next_due_date IS NOT NULL
    ORDER BY device_id, date DESC, created_at DESC`;
  return new Map(rows.map((r) => [r.id, iso(r.next_due_date)]));
}

module.exports = { createServiceRouter, serviceDueDates, SERVICE_TYPES: TYPES };
