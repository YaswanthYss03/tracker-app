// Unknown / unparseable packets, kept briefly to debug firmware differences.
const { prisma } = require('../client');

const RETENTION_DAYS = 7;

function insert({ imei, remote, protocol, hex, reason }) {
  return prisma.rawPacket.create({
    data: { imei, remote, protocol, hex: hex.slice(0, 2000), reason: reason.slice(0, 200) },
  });
}

function recent({ imei, limit = 50 } = {}) {
  return prisma.rawPacket.findMany({
    where: imei ? { imei } : undefined,
    orderBy: { receivedAt: 'desc' },
    take: limit,
  });
}

async function deleteExpired() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
  const { count } = await prisma.rawPacket.deleteMany({ where: { receivedAt: { lt: cutoff } } });
  return count;
}

module.exports = { insert, recent, deleteExpired };
