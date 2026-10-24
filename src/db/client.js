// Shared Prisma client (one connection pool for the whole app).
const { PrismaClient } = require('@prisma/client');

// Query errors are thrown and handled (or logged) by the caller, so Prisma
// itself only prints warnings.
const prisma = new PrismaClient({
  log: [{ level: 'warn', emit: 'stdout' }],
});

async function pingDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

module.exports = { prisma, pingDatabase };
