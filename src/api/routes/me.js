/**
 * /api/v1/me — the logged-in user's account.
 *
 *   GET    /                 profile
 *   PATCH  /                 { name }
 *   POST   /password         { currentPassword, newPassword } -> 204, logs out all sessions
 *   POST   /logout-all       -> 204
 *   DELETE /                 { password } (or { confirmEmail } for Google-only accounts) -> 204;
 *                            deletes the account; owned trackers are released
 *   POST   /push-tokens      { token, platform: android|ios|web } -> 204
 *   DELETE /push-tokens      { token } -> 204
 *   GET    /events           ?days=7&limit=200 alerts from all my trackers
 */
const express = require('express');
const { parse, wrap, z, schemas } = require('../validate');
const eventsRepo = require('../../db/repositories/events');
const { eventDto } = require('../dto');

function createMeRouter({ authService }) {
  const router = express.Router();

  router.get('/', wrap(async (req, res) => {
    res.json({ data: authService.publicUser(await authService.getUser(req.user.id)) });
  }));

  router.patch('/', wrap(async (req, res) => {
    const { name } = parse(z.object({ name: z.string().trim().min(1).max(80) }), req.body);
    res.json({ data: await authService.updateProfile(req.user.id, { name }) });
  }));

  router.post('/password', wrap(async (req, res) => {
    const body = parse(
      z.object({ currentPassword: z.string().min(1).max(128), newPassword: schemas.password }),
      req.body
    );
    await authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
    res.status(204).end();
  }));

  router.post('/logout-all', wrap(async (req, res) => {
    await authService.revokeAll(req.user.id);
    res.status(204).end();
  }));

  router.delete('/', wrap(async (req, res) => {
    const body = parse(
      z.object({ password: z.string().min(1).max(128).optional(), confirmEmail: z.string().max(254).optional() }),
      req.body
    );
    await authService.deleteAccount(req.user.id, body);
    res.status(204).end();
  }));

  const pushSchema = z.object({
    token: z.string().min(10).max(4096),
    platform: z.enum(['android', 'ios', 'web']),
  });

  router.post('/push-tokens', wrap(async (req, res) => {
    await authService.savePushToken(req.user.id, parse(pushSchema, req.body));
    res.status(204).end();
  }));

  router.delete('/push-tokens', wrap(async (req, res) => {
    const { token } = parse(z.object({ token: z.string().min(1).max(4096) }), req.body);
    await authService.deletePushToken(req.user.id, token);
    res.status(204).end();
  }));

  router.get('/events', wrap(async (req, res) => {
    const q = parse(
      z.object({
        days: z.coerce.number().int().min(1).max(31).default(7),
        limit: z.coerce.number().int().min(1).max(500).default(200),
      }),
      req.query
    );
    const rows = await eventsRepo.listForUser(req.user.id, { from: new Date(Date.now() - q.days * 86_400_000), limit: q.limit });
    res.json({
      data: rows.map((e) => ({ ...eventDto(e), deviceName: e.device.name || `Tracker ${e.device.imei.slice(-4)}` })),
      count: rows.length,
    });
  }));

  return router;
}

module.exports = { createMeRouter };
