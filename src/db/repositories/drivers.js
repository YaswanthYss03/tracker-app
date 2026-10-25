/**
 * Drivers belong to one user. Vehicles point at a main and a backup driver.
 * Photo bytes are only read by the photo endpoint (never in lists).
 */
const { prisma } = require('../client');

const PUBLIC = {
  id: true, userId: true, name: true, phone: true, licenceNo: true, licenceExpiry: true,
  avatar: true, photoUpdatedAt: true, createdAt: true,
};
const VEHICLE = { id: true, name: true, registrationNumber: true, icon: true, imei: true };

/** The user's drivers with the vehicles they drive, A–Z. */
function listForUser(userId) {
  return prisma.driver.findMany({
    where: { userId },
    select: { ...PUBLIC, mainOf: { select: VEHICLE }, backupOf: { select: VEHICLE } },
    orderBy: { name: 'asc' },
  });
}

function findOwned(userId, id) {
  return prisma.driver.findFirst({
    where: { id, userId },
    select: { ...PUBLIC, mainOf: { select: VEHICLE }, backupOf: { select: VEHICLE } },
  });
}

/** Adds .mainDriver / .backupDriver (public fields) to each device. */
async function attachToDevices(devices) {
  const ids = [...new Set(devices.flatMap((d) => [d.mainDriverId, d.backupDriverId]).filter(Boolean))];
  const rows = ids.length ? await prisma.driver.findMany({ where: { id: { in: ids } }, select: PUBLIC }) : [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const d of devices) {
    d.mainDriver = d.mainDriverId ? byId.get(d.mainDriverId) ?? null : null;
    d.backupDriver = d.backupDriverId ? byId.get(d.backupDriverId) ?? null : null;
  }
  return devices;
}

/** Find the user's driver with this name, or create one (old "driverName" field). */
async function idForName(userId, name) {
  const found = await prisma.driver.findFirst({ where: { userId, name }, select: { id: true } });
  if (found) return found.id;
  return (await prisma.driver.create({ data: { userId, name }, select: { id: true } })).id;
}

module.exports = { listForUser, findOwned, attachToDevices, idForName, PUBLIC };
