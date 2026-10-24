/**
 * Connects the ingest event stream to everything that reacts to it:
 *
 *   ingest 'position' ─> trips, alerts (ignition/overspeed), geofences, live map
 *   ingest 'status'   ─> alerts (ignition, back online), live map
 *   ingest 'alarm'    ─> alerts (SOS, power cut, ...)
 *   alerts 'event'    ─> live map 'alert' + push notification
 *   every minute      ─> offline check
 *
 * Only claimed (status "active") trackers produce trips and alerts.
 */
const { TripTracker } = require('./trips');
const { AlertEngine } = require('./alerts');
const { GeofenceMonitor } = require('./geofences');
const tripsRepo = require('../db/repositories/trips');
const eventsRepo = require('../db/repositories/events');
const geofencesRepo = require('../db/repositories/geofences');

function startProcessors({ ingest, cache, ownership, notifier, logger, offlineAfterMs }) {
  const log = logger.child({ component: 'processors' });
  const isActive = (id) => cache.get(id)?.status === 'active';
  let realtime = null; // attached once the HTTP server exists

  const trips = new TripTracker({
    store: tripsRepo,
    getTimezone: (id) => cache.get(id)?.timezone,
    logger: log,
  });
  const alerts = new AlertEngine({
    store: eventsRepo,
    getState: (id) => cache.get(id),
    logger: log,
    offlineAfterMs,
  });
  const geofences = new GeofenceMonitor({
    load: geofencesRepo.listForDevice,
    fire: (deviceId, type, data) => alerts.fire(deviceId, type, data),
    isActive,
    logger: log,
  });

  // Alerts for one tracker are evaluated strictly in packet order (the
  // geofence check may wait for the database to load fences).
  const queues = new Map();
  function inOrder(deviceId, fn) {
    const next = (queues.get(deviceId) || Promise.resolve())
      .then(fn)
      .catch((err) => log.error({ err: err.message, deviceId }, 'alert processing failed'));
    queues.set(deviceId, next);
    next.then(() => queues.get(deviceId) === next && queues.delete(deviceId));
    return next;
  }

  ingest.on('position', (e) => {
    realtime?.publishLive(e.deviceId);
    if (!isActive(e.deviceId) || !e.isLatest || e.reupload) return;
    trips.onPosition(e.deviceId, e.point);
    inOrder(e.deviceId, async () => {
      await geofences.onPosition(e);
      alerts.onPosition(e);
    });
  });
  ingest.on('status', (e) => {
    realtime?.publishLive(e.deviceId);
    inOrder(e.deviceId, () => alerts.onStatus(e));
  });
  ingest.on('alarm', (e) => inOrder(e.deviceId, () => alerts.onAlarm(e)));

  alerts.on('event', (event) => {
    log.info({ deviceId: event.deviceId, type: event.type }, 'alert');
    realtime?.publishAlert(event);
    notifier.notify(event);
  });

  // A released tracker starts fresh for its next owner.
  ownership.events.on('released', ({ deviceId }) => {
    trips.reset(deviceId);
    alerts.reset(deviceId);
    geofences.reset(deviceId);
  });

  const offlineTimer = setInterval(() => alerts.checkOffline(cache.states.values()), 60_000);

  return {
    trips,
    alerts,
    geofences,
    /** Resolves when queued alert checks for a device are done (tests). */
    idle: (deviceId) => queues.get(deviceId) || Promise.resolve(),
    attachRealtime(rt) {
      realtime = rt;
    },
    stop() {
      clearInterval(offlineTimer);
    },
  };
}

module.exports = { startProcessors };
