// Temporary public links to a tracker's live position.
const { prisma } = require('../client');

function create({ token, deviceId, createdBy, expiresAt }) {
  return prisma.shareLink.create({ data: { token, deviceId, createdBy, expiresAt } });
}

/** The link with its device if it exists, isn't revoked and hasn't expired. */
function findValid(token) {
  return prisma.shareLink.findFirst({
    where: { token, revokedAt: null, expiresAt: { gt: new Date() } },
    include: { device: true },
  });
}

function listActive(deviceId) {
  return prisma.shareLink.findMany({
    where: { deviceId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
}

async function revoke(deviceId, token) {
  const { count } = await prisma.shareLink.updateMany({
    where: { token, deviceId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return count > 0;
}

module.exports = { create, findValid, listActive, revoke };
