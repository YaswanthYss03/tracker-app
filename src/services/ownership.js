/**
 * Who can see which tracker.
 *
 *   claim    customer enters IMEI + activation code → becomes the owner
 *   share    owner adds viewers by email (family, drivers)
 *   release  owner gives the tracker up (e.g. selling it) → back to stock
 *
 * Privacy rules:
 * - Claiming wipes any history recorded before the claim (factory tests, a
 *   previous owner), but keeps the current live position.
 * - Releasing wipes history and the live position, removes all members and
 *   returns the tracker to "inventory" so the next buyer can claim it with
 *   the same activation code.
 */
const { EventEmitter } = require('events');
const { prisma } = require('../db/client');
const { verifyActivationCode } = require('../lib/secrets');
const { AppError, badRequest, notFound, conflict } = require('../lib/errors');
const { normalizeEmail } = require('./auth');

const MAX_FAILED_CLAIMS = 5;
const CLAIM_LOCK_MS = 60 * 60 * 1000; // 1 hour
const MAX_VIEWERS = 10;

const invalidClaim = () => new AppError(400, 'INVALID_CLAIM', 'IMEI or activation code is incorrect');

/** Deletes everything recorded for a device (not its audit log). */
async function wipeHistory(tx, deviceId) {
  await tx.position.deleteMany({ where: { deviceId } });
  await tx.trip.deleteMany({ where: { deviceId } });
  await tx.dailyStat.deleteMany({ where: { deviceId } });
  await tx.event.deleteMany({ where: { deviceId } });
  await tx.geofence.deleteMany({ where: { deviceId } });
  await tx.shareLink.deleteMany({ where: { deviceId } });
}

/**
 * @param {object} deps
 * @param {import('../pipeline/stateCache').DeviceStateCache} [deps.cache] live state to keep in sync (absent in CLI)
 */
function createOwnershipService({ cache } = {}) {
  // 'accessRevoked' { deviceId, userId } and 'released' { deviceId }: lets the
  // live map drop connections that just lost access.
  const events = new EventEmitter();

  async function claim(userId, { imei, activationCode, name }) {
    const cleanImei = String(imei || '').trim();
    if (!/^\d{15}$/.test(cleanImei)) throw invalidClaim();

    const device = await prisma.device.findUnique({ where: { imei: cleanImei } });
    if (!device) throw invalidClaim();

    if (device.claimLockedUntil && device.claimLockedUntil > new Date()) {
      const minutes = Math.ceil((device.claimLockedUntil - Date.now()) / 60_000);
      throw new AppError(429, 'CLAIM_LOCKED', `Too many wrong attempts for this tracker. Try again in ${minutes} min.`);
    }

    if (!(await verifyActivationCode(activationCode, device.activationCodeHash))) {
      const updated = await prisma.device.update({
        where: { id: device.id },
        data: { failedClaimAttempts: { increment: 1 } },
      });
      if (updated.failedClaimAttempts >= MAX_FAILED_CLAIMS) {
        await prisma.device.update({
          where: { id: device.id },
          data: { failedClaimAttempts: 0, claimLockedUntil: new Date(Date.now() + CLAIM_LOCK_MS) },
        });
      }
      throw invalidClaim();
    }

    if (device.status === 'suspended') {
      throw new AppError(403, 'DEVICE_SUSPENDED', 'This tracker is suspended. Please contact support.');
    }

    const owner = await prisma.deviceAccess.findFirst({ where: { deviceId: device.id, role: 'owner' } });
    if (owner?.userId === userId) return { device, alreadyOwned: true };
    if (owner) {
      throw conflict('This tracker is already registered to another account. Ask the owner to share it with you.');
    }

    const claimed = await prisma.$transaction(async (tx) => {
      // Only succeeds while the tracker is unclaimed, so two simultaneous
      // claims can't both win.
      const { count } = await tx.device.updateMany({
        where: { id: device.id, status: 'inventory' },
        data: {
          status: 'active',
          failedClaimAttempts: 0,
          claimLockedUntil: null,
          ...(name ? { name } : {}),
        },
      });
      if (count === 0) throw conflict('This tracker was just claimed by another account.');
      await wipeHistory(tx, device.id);
      await tx.deviceAccess.deleteMany({ where: { deviceId: device.id } });
      await tx.deviceAccess.create({ data: { deviceId: device.id, userId, role: 'owner' } });
      return tx.device.findUnique({ where: { id: device.id } });
    });

    syncCache(claimed);
    return { device: claimed, alreadyOwned: false };
  }

  /** Devices the user owns or can view, with their role. */
  async function listForUser(userId) {
    const rows = await prisma.deviceAccess.findMany({
      where: { userId },
      include: { device: true },
      orderBy: { createdAt: 'asc' },
    });
    return rows;
  }

  /** The user's access row (with device), or null. */
  function getAccess(userId, deviceId) {
    return prisma.deviceAccess.findUnique({
      where: { deviceId_userId: { deviceId, userId } },
      include: { device: true },
    });
  }

  async function updateDevice(deviceId, patch) {
    const device = await prisma.device.update({ where: { id: deviceId }, data: patch });
    syncCache(device);
    return device;
  }

  function setNotify(deviceId, userId, notify) {
    return prisma.deviceAccess.update({
      where: { deviceId_userId: { deviceId, userId } },
      data: { notify },
    });
  }

  function listMembers(deviceId) {
    return prisma.deviceAccess.findMany({
      where: { deviceId },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async function addViewer(deviceId, ownerId, email) {
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user) throw notFound('No account with that email. Ask them to sign up first.');
    if (user.id === ownerId) throw badRequest('You already own this tracker');

    const count = await prisma.deviceAccess.count({ where: { deviceId, role: 'viewer' } });
    if (count >= MAX_VIEWERS) throw badRequest(`A tracker can be shared with at most ${MAX_VIEWERS} people`);

    try {
      return await prisma.deviceAccess.create({
        data: { deviceId, userId: user.id, role: 'viewer' },
        include: { user: { select: { id: true, email: true, name: true } } },
      });
    } catch (err) {
      if (err.code === 'P2002') throw conflict('Already shared with this person');
      throw err;
    }
  }

  /** Owner removes a viewer, or a viewer leaves. The owner can't remove themselves (use release). */
  async function removeMember(deviceId, actor, targetUserId) {
    const isSelf = actor.userId === targetUserId;
    if (actor.role !== 'owner' && !isSelf) {
      throw new AppError(403, 'FORBIDDEN', 'Only the owner can remove other people');
    }
    if (actor.role === 'owner' && isSelf) {
      throw badRequest('The owner cannot leave. Release the tracker instead.');
    }
    const { count } = await prisma.deviceAccess.deleteMany({
      where: { deviceId, userId: targetUserId, role: 'viewer' },
    });
    if (count === 0) throw notFound('That person does not have access');
    events.emit('accessRevoked', { deviceId, userId: targetUserId });
  }

  /** Gives the tracker back to stock: wipes data, removes everyone. */
  async function release(deviceId) {
    if (cache) cache.clearPosition(deviceId);
    const device = await prisma.$transaction(async (tx) => {
      await wipeHistory(tx, deviceId);
      await tx.deviceAccess.deleteMany({ where: { deviceId } });
      return tx.device.update({
        where: { id: deviceId },
        data: {
          status: 'inventory',
          name: null,
          icon: null,
          registrationNumber: null,
          driverName: null,
          speedLimitKmh: null,
          lastLat: null,
          lastLon: null,
          lastSpeed: null,
          lastCourse: null,
          lastSatellites: null,
          lastGpsTime: null,
        },
      });
    });
    syncCache(device);
    events.emit('released', { deviceId });
    return device;
  }

  async function releaseAllOwnedBy(userId) {
    const owned = await prisma.deviceAccess.findMany({ where: { userId, role: 'owner' } });
    for (const { deviceId } of owned) await release(deviceId);
    return owned.length;
  }

  function syncCache(device) {
    const state = cache?.get(device.id);
    if (state) {
      state.status = device.status;
      state.name = device.name;
      state.timezone = device.timezone;
      state.speedLimitKmh = device.speedLimitKmh;
    }
  }

  return {
    events,
    claim,
    listForUser,
    getAccess,
    updateDevice,
    setNotify,
    listMembers,
    addViewer,
    removeMember,
    release,
    releaseAllOwnedBy,
  };
}

module.exports = { createOwnershipService, MAX_FAILED_CLAIMS, MAX_VIEWERS };
