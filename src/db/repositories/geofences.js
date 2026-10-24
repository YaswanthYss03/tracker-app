// Geofences: circles { lat, lon } + radius, or polygons [[lat, lon], ...].
const { prisma } = require('../client');

function listForDevice(deviceId) {
  return prisma.geofence.findMany({ where: { deviceId }, orderBy: { createdAt: 'asc' } });
}

function count(deviceId) {
  return prisma.geofence.count({ where: { deviceId } });
}

function find(deviceId, id) {
  return prisma.geofence.findFirst({ where: { id, deviceId } });
}

function create(data) {
  return prisma.geofence.create({ data });
}

function update(id, data) {
  return prisma.geofence.update({ where: { id }, data });
}

function remove(id) {
  return prisma.geofence.delete({ where: { id } });
}

module.exports = { listForDevice, count, find, create, update, remove };
