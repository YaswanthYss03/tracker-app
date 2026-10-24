// Device records: registration (admin), lookup on login, and saving live state.
const { Prisma } = require('@prisma/client');
const { prisma } = require('../client');

function findByImei(imei) {
  return prisma.device.findUnique({ where: { imei } });
}

function findById(id) {
  return prisma.device.findUnique({ where: { id } });
}

function create({ imei, simNumber, model, name, activationCodeHash }) {
  return prisma.device.create({
    data: { imei, simNumber, model, name, activationCodeHash },
  });
}

/** Search by IMEI / SIM / name (partial), optional status filter. */
function searchWhere({ status, q } = {}) {
  const where = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { imei: { contains: q } },
      { simNumber: { contains: q } },
      { name: { contains: q, mode: 'insensitive' } },
    ];
  }
  return where;
}

function list({ status, q, limit = 100, offset = 0 } = {}) {
  return prisma.device.findMany({
    where: searchWhere({ status, q }),
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

function count({ status, q } = {}) {
  return prisma.device.count({ where: searchWhere({ status, q }) });
}

function updateDetails(imei, data) {
  return prisma.device.update({ where: { imei }, data });
}

function remove(id) {
  return prisma.device.delete({ where: { id } });
}

function setStatus(imei, status) {
  return prisma.device.update({ where: { imei }, data: { status } });
}

function setActivationCodeHash(imei, activationCodeHash) {
  return prisma.device.update({
    where: { imei },
    data: { activationCodeHash, failedClaimAttempts: 0, claimLockedUntil: null },
  });
}

/**
 * Saves the in-memory live state of many devices in one UPDATE statement.
 * Only moves last_gps_time forward, so a stale write can't replace a newer one.
 */
async function saveStates(states) {
  if (states.length === 0) return 0;

  const rows = states.map(
    (s) => Prisma.sql`(
      ${s.deviceId}::uuid,
      ${s.lat ?? null}::float8, ${s.lon ?? null}::float8,
      ${s.speed ?? null}::int2, ${s.course ?? null}::int2, ${s.satellites ?? null}::int2,
      ${s.gpsTime ?? null}::timestamptz,
      ${s.acc ?? null}::boolean, ${s.charging ?? null}::boolean,
      ${s.batteryLevel ?? null}::int2, ${s.gsmSignal ?? null}::int2,
      ${s.lastSeenAt ?? null}::timestamptz
    )`
  );

  return prisma.$executeRaw`
    UPDATE devices AS d SET
      last_lat        = CASE WHEN v.gps_time IS NOT NULL AND (d.last_gps_time IS NULL OR v.gps_time >= d.last_gps_time) THEN v.lat ELSE d.last_lat END,
      last_lon        = CASE WHEN v.gps_time IS NOT NULL AND (d.last_gps_time IS NULL OR v.gps_time >= d.last_gps_time) THEN v.lon ELSE d.last_lon END,
      last_speed      = CASE WHEN v.gps_time IS NOT NULL AND (d.last_gps_time IS NULL OR v.gps_time >= d.last_gps_time) THEN v.speed ELSE d.last_speed END,
      last_course     = CASE WHEN v.gps_time IS NOT NULL AND (d.last_gps_time IS NULL OR v.gps_time >= d.last_gps_time) THEN v.course ELSE d.last_course END,
      last_satellites = CASE WHEN v.gps_time IS NOT NULL AND (d.last_gps_time IS NULL OR v.gps_time >= d.last_gps_time) THEN v.satellites ELSE d.last_satellites END,
      last_gps_time   = GREATEST(d.last_gps_time, v.gps_time),
      last_acc           = COALESCE(v.acc, d.last_acc),
      last_charging      = COALESCE(v.charging, d.last_charging),
      last_battery_level = COALESCE(v.battery_level, d.last_battery_level),
      last_gsm_signal    = COALESCE(v.gsm_signal, d.last_gsm_signal),
      last_seen_at       = GREATEST(d.last_seen_at, v.last_seen_at),
      updated_at         = now()
    FROM (VALUES ${Prisma.join(rows)}) AS v(
      id, lat, lon, speed, course, satellites, gps_time, acc, charging, battery_level, gsm_signal, last_seen_at
    )
    WHERE d.id = v.id`;
}

module.exports = {
  findByImei,
  findById,
  create,
  list,
  count,
  updateDetails,
  remove,
  setStatus,
  setActivationCodeHash,
  saveStates,
};
