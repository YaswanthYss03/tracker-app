// Audit log of commands sent to devices.
const { prisma } = require('../client');

function logSent({ deviceId, userId = null, command }) {
  return prisma.commandLog.create({ data: { deviceId, userId, command } });
}

function logResult(id, { status, response = null }) {
  return prisma.commandLog.update({
    where: { id },
    data: { status, response, respondedAt: status === 'replied' ? new Date() : null },
  });
}

module.exports = { logSent, logResult };
