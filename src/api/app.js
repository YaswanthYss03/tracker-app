/**
 * HTTP API.
 *
 *   /health              public status
 *   /api/v1/auth         sign up / log in / refresh / log out
 *   /api/v1/me           my account               (Bearer token)
 *   /api/v1/devices      my trackers, history, trips, alerts, geofences, share links (Bearer token)
 *   /api/v1/public       share-link view          (no login)
 *   /api/v1/admin        support & stock tools    (x-api-key or admin login)
 *   everything else      websites: admin site (admin/dist) on ADMIN_DOMAIN, customer site (web/dist) elsewhere
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { AppError } = require('../lib/errors');
const { requireAuth, createRateLimits } = require('./middleware');
const { createAuthRouter } = require('./routes/auth');
const { createMeRouter } = require('./routes/me');
const { createInquiriesRouter } = require('./routes/inquiries');
const { createDevicesRouter } = require('./routes/devices');
const { createAdminRouter } = require('./routes/admin');
const { createTrackingRouter, createPublicRouter } = require('./routes/tracking');

const WEB_DIST = path.join(__dirname, '../../web/dist');
const ADMIN_DIST = path.join(__dirname, '../../admin/dist');

/** Free space on the disk holding the app (in Docker: the host's disk). */
function diskUsage() {
  try {
    const s = fs.statfsSync('/');
    const total = s.blocks * s.bsize;
    const free = s.bavail * s.bsize;
    return { freeGb: Math.round((free / 1e9) * 10) / 10, freePercent: Math.round((free / total) * 100) };
  } catch {
    return null;
  }
}

function createApp(deps) {
  const { config, logger, pingDatabase, gateway, writer, cache, authService, ownership, registry } = deps;
  // Late-bound callbacks (the live server and processors are created after the app).
  const hooks = deps.hooks || { geofencesChanged() {}, shareLinkRevoked() {} };
  const app = express();
  app.disable('x-powered-by');
  // Behind Nginx/a load balancer, trust its X-Forwarded-For so rate limits see client IPs.
  app.set('trust proxy', config.trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // Map tiles come from OpenStreetMap; live updates use a same-origin WebSocket.
          'img-src': ["'self'", 'data:', 'blob:', 'https://*.tile.openstreetmap.org'],
          'connect-src': ["'self'", 'https://accounts.google.com/gsi/'],
          // "Sign in with Google" button (Google Identity Services)
          'script-src': ["'self'", 'https://accounts.google.com/gsi/client'],
          'frame-src': ["'self'", 'https://accounts.google.com/gsi/'],
        },
      },
      // Google's sign-in popup needs to talk back to this page.
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    })
  );
  app.use(cors({ origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',') }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', async (req, res) => {
    const database = await pingDatabase();
    const w = writer.stats();
    const disk = diskUsage();
    const healthy = database && !w.failing && (disk === null || disk.freePercent >= 10);
    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'degraded',
      database,
      uptimeS: Math.round(process.uptime()),
      gateway: gateway.stats(),
      devicesOnline: cache.onlineCount(),
      liveClients: deps.realtimeStats ? deps.realtimeStats() : undefined,
      push: deps.pushEnabled,
      writer: { backlog: w.backlog, failing: w.failing, dropped: w.dropped },
      disk,
    });
  });

  const limits = createRateLimits(deps.rateLimits);
  const auth = requireAuth(authService);
  app.use('/api', limits.api);
  app.use('/api/v1/auth', createAuthRouter({ authService, limits }));
  app.use('/api/v1/me', auth, createMeRouter({ authService }));
  app.use('/api/v1/inquiries', createInquiriesRouter({ authService, limits, mailer: deps.mailer, support: config.support, logger }));
  app.use('/api/v1/devices', auth, createDevicesRouter({ ownership, cache, limits }));
  app.use(
    '/api/v1/devices',
    auth,
    createTrackingRouter({ ownership, registry, processors: deps.processors, hooks, config, limits })
  );
  app.use('/api/v1/public', createPublicRouter({ cache }));
  // Mobile app asks this at start: below minVersion it must update.
  app.get('/api/v1/app/config', (req, res) => {
    res.json({
      data: {
        minVersion: config.app?.minVersion || '1.0.0',
        latestVersion: config.app?.latestVersion || '1.0.0',
        // Apps show the Google button only when this is set (web client ID).
        googleWebClientId: config.google?.clientIds?.[0] || null,
        support: config.support || {},
      },
    });
  });
  app.use('/api/v1/admin', createAdminRouter(deps));

  // Admin website: only on ADMIN_DOMAIN.
  const adminHost = (req) => Boolean(config.adminDomain) && req.hostname === config.adminDomain;
  const spa = (dir) => {
    const files = express.static(dir, { index: false, maxAge: '1h' });
    return [
      files,
      (req, res, next) => {
        if (req.method !== 'GET' || /^\/(api\/|socket\.io\/|health$)/.test(req.path)) return next();
        res.set('Cache-Control', 'no-cache');
        res.sendFile(path.join(dir, 'index.html'));
      },
    ];
  };
  const onlyIf = (test, handlers) => handlers.map((h) => (req, res, next) => (test(req) ? h(req, res, next) : next()));
  if (fs.existsSync(path.join(ADMIN_DIST, 'index.html'))) {
    app.use(onlyIf(adminHost, spa(ADMIN_DIST)));
  }
  // The old /admin pages on the customer site now live on the admin website.
  app.get(/^\/admin(\/.*)?$/, (req, res, next) => {
    if (adminHost(req) || !config.adminDomain) return next();
    res.redirect(302, `https://${config.adminDomain}${req.path.replace(/^\/admin/, '') || '/'}`);
  });

  // Customer website (built with `npm run web:build`). Unknown non-API paths return
  // index.html so the React router can handle them (/devices/..., /share/...).
  if (fs.existsSync(path.join(WEB_DIST, 'index.html'))) {
    app.use(onlyIf((req) => !adminHost(req), spa(WEB_DIST)));
  }

  app.use((req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof AppError) {
      return res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } });
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' } });
    }
    logger.error({ err: err.message, stack: err.stack, path: req.path }, 'unhandled API error');
    res.status(500).json({ error: { code: 'INTERNAL', message: 'Internal server error' } });
  });

  return app;
}

module.exports = { createApp };
