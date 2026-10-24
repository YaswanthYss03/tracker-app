/**
 * Shared middleware: authentication, device access checks, rate limits.
 */
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { AppError, unauthorized, notFound } = require('../lib/errors');
const { schemas } = require('./validate');

/** Requires "Authorization: Bearer <access token>". Sets req.user = { id, role }. */
function requireAuth(authService) {
  return (req, res, next) => {
    const header = req.get('authorization') || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return next(unauthorized('Missing "Authorization: Bearer <token>" header'));
    try {
      req.user = authService.verifyAccessToken(match[1]);
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Loads the user's access to :deviceId. Responds 404 when the user has no
 * access (so nobody can probe which devices exist) and 403 when a viewer
 * tries an owner-only action. Sets req.access and req.device.
 */
function requireDeviceAccess(ownership, minRole = 'viewer') {
  return async (req, res, next) => {
    try {
      const { deviceId } = req.params;
      if (!schemas.uuid.safeParse(deviceId).success) throw notFound('Device not found');
      const access = await ownership.getAccess(req.user.id, deviceId);
      if (!access) throw notFound('Device not found');
      if (minRole === 'owner' && access.role !== 'owner') {
        throw new AppError(403, 'FORBIDDEN', 'Only the owner can do this');
      }
      req.access = access;
      req.device = access.device;
      next();
    } catch (err) {
      next(err);
    }
  };
}

function limiter({ windowMs, limit, key, message }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: key || ((req) => ipKeyGenerator(req.ip)),
    handler: (req, res, next) =>
      next(new AppError(429, 'RATE_LIMITED', message || 'Too many requests, please slow down')),
  });
}

const DEFAULT_LIMITS = { api: 600, register: 30, login: 10, refresh: 30, claim: 10, commands: 10, forgotPassword: 5, resetPassword: 10, google: 30, inquiry: 5 };

/**
 * Rate limits per route group. Created per app so tests get fresh counters;
 * `overrides` changes the request counts, e.g. { register: 1000 } in tests.
 */
function createRateLimits(overrides = {}) {
  const n = { ...DEFAULT_LIMITS, ...overrides };
  return {
    // All API calls from one IP. Generous because mobile networks share IPs.
    api: limiter({ windowMs: 60_000, limit: n.api }),
    register: limiter({ windowMs: 60 * 60_000, limit: n.register, message: 'Too many sign-ups from this network, try later' }),
    // Per IP + email, so one attacker can't lock out everyone on a shared IP.
    login: limiter({
      windowMs: 15 * 60_000,
      limit: n.login,
      key: (req) => `${ipKeyGenerator(req.ip)}|${String(req.body?.email || '').toLowerCase()}`,
      message: 'Too many login attempts, try again in 15 minutes',
    }),
    refresh: limiter({ windowMs: 60_000, limit: n.refresh }),
    google: limiter({ windowMs: 15 * 60_000, limit: n.google, message: 'Too many sign-in attempts, try again later' }),
    // Contact / partner forms: stops spam floods from one network.
    inquiry: limiter({ windowMs: 60 * 60_000, limit: n.inquiry, message: 'Too many messages, please try again later' }),
    // Per IP + email: stops email bombing and code guessing.
    forgotPassword: limiter({
      windowMs: 60 * 60_000,
      limit: n.forgotPassword,
      key: (req) => `${ipKeyGenerator(req.ip)}|${String(req.body?.email || '').toLowerCase()}`,
      message: 'Too many reset requests, try again in an hour',
    }),
    resetPassword: limiter({
      windowMs: 15 * 60_000,
      limit: n.resetPassword,
      key: (req) => `${ipKeyGenerator(req.ip)}|${String(req.body?.email || '').toLowerCase()}`,
      message: 'Too many attempts, try again later',
    }),
    // Per user (on top of the per-tracker lock after 5 wrong codes).
    claim: limiter({
      windowMs: 60 * 60_000,
      limit: n.claim,
      key: (req) => `user:${req.user.id}`,
      message: 'Too many claim attempts, try again in an hour',
    }),
    // Commands reach the tracker over its SIM: keep them rare.
    commands: limiter({
      windowMs: 60_000,
      limit: n.commands,
      key: (req) => `user:${req.user.id}`,
      message: 'Too many commands, wait a minute',
    }),
  };
}

module.exports = { requireAuth, requireDeviceAccess, createRateLimits };
