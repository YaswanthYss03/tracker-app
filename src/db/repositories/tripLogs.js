// Trips the owner starts by hand. A trip runs from its start until the next one starts.
const { prisma } = require('../client');
const { haversineMeters } = require('../../lib/geo');
const positionsRepo = require('./positions');

const MAX_LOGS = 200;

/** Newest first. */
function list(deviceId) {
  return prisma.tripLog.findMany({ where: { deviceId }, orderBy: { startedAt: 'desc' }, take: MAX_LOGS });
}

function find(deviceId, id) {
  return prisma.tripLog.findFirst({ where: { id, deviceId } });
}

function create(deviceId, { name, createdBy }) {
  return prisma.tripLog.create({ data: { deviceId, name: name || null, createdBy: createdBy ?? null } });
}

function remove(id) {
  return prisma.tripLog.delete({ where: { id } }).catch(() => {});
}

/**
 * Distance, speeds and times of the positions between two moments.
 * Jumps that would need more than 250 km/h are GPS glitches and are skipped;
 * time standing (under 5 km/h) is idle, gaps over 10 minutes are not counted.
 */
function statsFrom(rows) {
  let distanceM = 0;
  let maxSpeed = 0;
  let idleS = 0;
  for (let i = 0; i < rows.length; i += 1) {
    const r = rows[i];
    if (r.speed > maxSpeed) maxSpeed = r.speed;
    if (i === 0) continue;
    const p = rows[i - 1];
    const dt = (r.gpsTime - p.gpsTime) / 1000;
    if (dt <= 0) continue;
    const d = haversineMeters(p.lat, p.lon, r.lat, r.lon);
    if (d / dt <= 250 / 3.6) distanceM += d;
    if (dt <= 600 && r.speed < 5) idleS += dt;
  }
  const first = rows[0];
  const last = rows[rows.length - 1];
  const durationS = first ? Math.max(0, Math.round((last.gpsTime - first.gpsTime) / 1000)) : 0;
  const drivingH = Math.max(0, durationS - idleS) / 3600;
  const km = distanceM / 1000;
  return {
    startLat: first?.lat ?? null, startLon: first?.lon ?? null,
    endLat: last?.lat ?? null, endLon: last?.lon ?? null,
    distanceM: Math.round(distanceM), maxSpeed, idleS: Math.round(idleS), durationS,
    avgSpeed: drivingH > 0.01 ? Math.round(km / drivingH) : 0,
    points: rows.length,
  };
}

async function statsBetween(deviceId, from, to) {
  const rows = await positionsRepo.findRoute(deviceId, { from, to });
  return { rows, stats: statsFrom(rows) };
}

module.exports = { list, find, create, remove, statsBetween, statsFrom };
