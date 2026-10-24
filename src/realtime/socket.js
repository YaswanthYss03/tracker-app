/**
 * Live updates over WebSocket (socket.io, same port as the HTTP API).
 *
 * Connect with one of:
 *   io(URL, { auth: { token: '<access token>' } })      logged-in user
 *   io(URL, { auth: { shareToken: '<share link token>' } })   public share link
 *
 * Logged-in users then subscribe per tracker:
 *   socket.emit('subscribe', { deviceId }, (res) => ...)   res = { ok, live } or { ok: false, error }
 *   socket.emit('unsubscribe', { deviceId })
 * Share-link sockets are subscribed to their one tracker automatically.
 *
 * Server events:
 *   'live'            { deviceId, lat, lon, speed, heading, ignition, batteryPercent, online, ... }
 *                     (same shape as GET /devices/:id/live; at most 1 per second per tracker).
 *                     Share-link sockets get only position fields (like the public HTTP view).
 *   'alert'           { id, deviceId, type, time, lat, lon, details }   (members only, not share links)
 *   'access_revoked'  { deviceId }   you were removed / the tracker was released
 *   'session_expired' the access token or share link expired: reconnect with a fresh one
 */
const { Server } = require('socket.io');
const { liveState, eventDto } = require('../api/dto');
const { schemas } = require('../api/validate');

const LIVE_MIN_INTERVAL_MS = 1000;
const MAX_TIMER_MS = 2 ** 31 - 1;

const membersRoom = (id) => `members:${id}`; // owner/viewers: full live state + alerts
const shareRoom = (id) => `share:${id}`; // public share links: position only

function createRealtime({ httpServer, config, authService, ownership, shareLinks, cache, logger }) {
  const log = logger.child({ component: 'realtime' });
  const io = new Server(httpServer, {
    cors: { origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',') },
    serveClient: false,
  });

  io.use(async (socket, next) => {
    const { token, shareToken } = socket.handshake.auth || {};
    try {
      if (token) {
        socket.data.user = authService.verifyAccessToken(token);
        socket.data.expiresAt = socket.data.user.exp * 1000;
      } else if (shareToken && typeof shareToken === 'string') {
        const link = await shareLinks.findValid(shareToken);
        if (!link) throw Object.assign(new Error('Share link expired or revoked'), { code: 'SHARE_LINK_INVALID' });
        socket.data.share = { token: shareToken, deviceId: link.deviceId };
        socket.data.expiresAt = link.expiresAt.getTime();
      } else {
        throw Object.assign(new Error('Send auth.token or auth.shareToken'), { code: 'UNAUTHORIZED' });
      }
      next();
    } catch (err) {
      const e = new Error(err.message);
      e.data = { code: err.code || 'UNAUTHORIZED' };
      next(e);
    }
  });

  const snapshot = (deviceId) => ({ deviceId, ...liveState({ id: deviceId }, cache) });
  const publicSnapshot = (deviceId) => {
    const s = snapshot(deviceId);
    return {
      deviceId, lat: s.lat, lon: s.lon, speed: s.speed, heading: s.heading,
      gpsTime: s.gpsTime, online: s.online, lastSeenAt: s.lastSeenAt,
    };
  };

  io.on('connection', (socket) => {
    const expiry = setTimeout(() => {
      socket.emit('session_expired');
      socket.disconnect(true);
    }, Math.max(0, Math.min(socket.data.expiresAt - Date.now(), MAX_TIMER_MS)));
    socket.on('disconnect', () => clearTimeout(expiry));

    if (socket.data.share) {
      const { deviceId } = socket.data.share;
      socket.join(shareRoom(deviceId));
      socket.emit('live', publicSnapshot(deviceId));
      return;
    }

    socket.on('subscribe', async (payload, ack) => {
      const reply = typeof ack === 'function' ? ack : () => {};
      const deviceId = payload?.deviceId;
      try {
        if (!schemas.uuid.safeParse(deviceId).success) return reply({ ok: false, error: 'NOT_FOUND' });
        const access = await ownership.getAccess(socket.data.user.id, deviceId);
        if (!access) return reply({ ok: false, error: 'NOT_FOUND' });
        socket.join(membersRoom(deviceId));
        reply({ ok: true, live: { deviceId, ...liveState(access.device, cache) } });
      } catch (err) {
        log.error({ err: err.message }, 'subscribe failed');
        reply({ ok: false, error: 'INTERNAL' });
      }
    });

    socket.on('unsubscribe', (payload, ack) => {
      const deviceId = payload?.deviceId;
      if (typeof deviceId === 'string') socket.leave(membersRoom(deviceId));
      if (typeof ack === 'function') ack({ ok: true });
    });
  });

  // Throttle 'live' to 1/s per tracker (heartbeat + location can arrive together).
  const lastSent = new Map();
  const pending = new Map();
  function publishLive(deviceId) {
    if (pending.has(deviceId)) return;
    const wait = LIVE_MIN_INTERVAL_MS - (Date.now() - (lastSent.get(deviceId) || 0));
    const send = () => {
      pending.delete(deviceId);
      lastSent.set(deviceId, Date.now());
      io.to(membersRoom(deviceId)).emit('live', snapshot(deviceId));
      io.to(shareRoom(deviceId)).emit('live', publicSnapshot(deviceId));
    };
    if (wait <= 0) send();
    else pending.set(deviceId, setTimeout(send, wait));
  }

  function publishAlert(event) {
    io.to(membersRoom(event.deviceId)).emit('alert', eventDto(event));
  }

  /** Removes a user's sockets (or everyone's, userId = null) from a tracker. */
  async function revokeAccess(deviceId, userId = null) {
    for (const s of await io.in(membersRoom(deviceId)).fetchSockets()) {
      if (userId === null || s.data.user.id === userId) {
        s.leave(membersRoom(deviceId));
        s.emit('access_revoked', { deviceId });
      }
    }
    if (userId === null) {
      for (const s of await io.in(shareRoom(deviceId)).fetchSockets()) s.disconnect(true);
    }
  }

  async function revokeShareLink(token) {
    const sockets = await io.fetchSockets();
    for (const s of sockets) if (s.data.share?.token === token) s.disconnect(true);
  }

  ownership.events.on('accessRevoked', ({ deviceId, userId }) => revokeAccess(deviceId, userId).catch(() => {}));
  ownership.events.on('released', ({ deviceId }) => revokeAccess(deviceId, null).catch(() => {}));

  return {
    io,
    publishLive,
    publishAlert,
    revokeAccess,
    revokeShareLink,
    connectionCount: () => io.engine.clientsCount,
    close: () => new Promise((resolve) => io.close(() => resolve())),
  };
}

module.exports = { createRealtime };
