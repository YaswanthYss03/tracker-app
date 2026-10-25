// Alerts / events (ignition, overspeed, geofence, power cut, offline, ...).
const { prisma } = require('../client');

function create({ deviceId, time, type, lat = null, lon = null, payload = null }) {
  return prisma.event.create({ data: { deviceId, time, type, lat, lon, payload } });
}

function list(deviceId, { from, to, types, limit = 200 }) {
  return prisma.event.findMany({
    where: { deviceId, time: { gte: from, lte: to }, ...(types?.length ? { type: { in: types } } : {}) },
    orderBy: { time: 'desc' },
    take: limit,
  });
}

/** Alerts from every tracker the user can see (owner or viewer). */
function listForUser(userId, { from, limit = 200 }) {
  return prisma.event.findMany({
    where: { time: { gte: from }, device: { access: { some: { userId } } } },
    include: { device: { select: { name: true, imei: true, registrationNumber: true } } },
    orderBy: { time: 'desc' },
    take: limit,
  });
}

module.exports = { create, list, listForUser };
