// Trips and per-day totals.
const { prisma } = require('../client');

function findOpenTrip(deviceId) {
  return prisma.trip.findFirst({ where: { deviceId, endTime: null }, orderBy: { startTime: 'desc' } });
}

function createTrip(data) {
  return prisma.trip.create({ data });
}

/** Saves progress (open trip) or the final numbers (with endTime). */
function updateTrip(id, data) {
  return prisma.trip.update({ where: { id }, data });
}

function deleteTrip(id) {
  return prisma.trip.delete({ where: { id } }).catch(() => {});
}

function listTrips(deviceId, { from, to, limit = 200 }) {
  return prisma.trip.findMany({
    where: { deviceId, startTime: { gte: from, lte: to } },
    orderBy: { startTime: 'desc' },
    take: limit,
  });
}

function findTrip(deviceId, id) {
  return prisma.trip.findFirst({ where: { id, deviceId } });
}

/** Adds one finished trip to the day's totals (day = 'YYYY-MM-DD' in the device's timezone). */
function addToDay(deviceId, day, { distanceM, maxSpeed, drivingS, idleS }) {
  return prisma.$executeRaw`
    INSERT INTO daily_stats (device_id, day, distance_m, max_speed, driving_s, idle_s, trips_count)
    VALUES (${deviceId}::uuid, ${day}::date, ${distanceM}, ${maxSpeed}::int2, ${drivingS}, ${idleS}, 1)
    ON CONFLICT (device_id, day) DO UPDATE SET
      distance_m  = daily_stats.distance_m + EXCLUDED.distance_m,
      max_speed   = GREATEST(daily_stats.max_speed, EXCLUDED.max_speed),
      driving_s   = daily_stats.driving_s + EXCLUDED.driving_s,
      idle_s      = daily_stats.idle_s + EXCLUDED.idle_s,
      trips_count = daily_stats.trips_count + 1`;
}

function listDays(deviceId, { from, to }) {
  return prisma.dailyStat.findMany({
    where: { deviceId, day: { gte: from, lte: to } },
    orderBy: { day: 'asc' },
  });
}

module.exports = { findOpenTrip, createTrip, updateTrip, deleteTrip, listTrips, findTrip, addToDay, listDays };
