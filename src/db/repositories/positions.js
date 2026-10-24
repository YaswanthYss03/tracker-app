// GPS points (TimescaleDB hypertable).
const { Prisma } = require('@prisma/client');
const { prisma } = require('../client');

/**
 * Inserts many points in one statement. Re-sent duplicates (same device and
 * GPS time) are silently skipped by the primary key.
 * @returns {Promise<number>} rows actually inserted
 */
async function insertMany(rows) {
  if (rows.length === 0) return 0;

  const values = rows.map(
    (r) => Prisma.sql`(
      ${r.deviceId}::uuid, ${r.gpsTime}::timestamptz, ${r.receivedAt}::timestamptz,
      ${r.lat}::float8, ${r.lon}::float8, ${r.speed}::int2, ${r.course}::int2,
      ${r.satellites}::int2, ${r.valid}::boolean, ${r.acc ?? null}::boolean,
      ${r.extra ? JSON.stringify(r.extra) : null}::jsonb
    )`
  );

  return prisma.$executeRaw`
    INSERT INTO positions
      (device_id, gps_time, received_at, lat, lon, speed, course, satellites, valid, acc, extra)
    VALUES ${Prisma.join(values)}
    ON CONFLICT (device_id, gps_time) DO NOTHING`;
}

/** Points for one device in a time range, newest first. */
function findRange(deviceId, { from, to, limit = 1000 }) {
  return prisma.position.findMany({
    where: { deviceId, gpsTime: { gte: from, lte: to } },
    orderBy: { gpsTime: 'desc' },
    take: limit,
  });
}

/** Route points for one device, oldest first (only the fields a map needs). */
function findRoute(deviceId, { from, to, limit = 100_000 }) {
  return prisma.position.findMany({
    where: { deviceId, gpsTime: { gte: from, lte: to } },
    orderBy: { gpsTime: 'asc' },
    take: limit,
    select: { gpsTime: true, lat: true, lon: true, speed: true, course: true, acc: true },
  });
}

module.exports = { insertMany, findRange, findRoute };
