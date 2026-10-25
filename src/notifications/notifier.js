/**
 * Sends a push notification for each alert to everyone with access to the
 * tracker who has notifications on for it, respecting each person's alert
 * settings (offline / long stop / GPS lost) and quiet hours (22:00-07:00 in
 * the vehicle's timezone; SOS and power cut always get through).
 * Dead phone tokens are removed. Runs in the background: a slow or failing
 * push never delays tracking.
 */
const { prisma } = require('../db/client');

const KMH = (v) => `${v} km/h`;
// Which user setting turns an alert type off (types not listed are always sent).
const SETTING = { offline: 'alertOffline', online: 'alertOffline', long_stop: 'alertLongStop', gps_lost: 'alertGpsLost' };
const URGENT = new Set(['sos', 'power_cut']);

function stopLength(minutes) {
  if (!minutes || minutes < 60) return `${minutes || 0} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Notification text: title says what happened, body names the vehicle (and driver). */
function message(event, vehicle, driver) {
  const v = vehicle || 'Your vehicle';
  const p = event.payload || {};
  const by = driver ? ` Driver: ${driver}.` : '';
  switch (event.type) {
    case 'ignition_on': return { title: 'Ignition on', body: `${v} started.` };
    case 'ignition_off': return { title: 'Ignition off', body: `${v} was switched off.` };
    case 'overspeed': return { title: `Overspeed · ${KMH(p.speed)}`, body: `${v} is going ${KMH(p.speed)} (limit ${KMH(p.limit)}).${by}` };
    case 'geofence_enter': return { title: `Entered ${p.name || 'a geofence'}`, body: `${v} entered ${p.name || 'a geofence'}.` };
    case 'geofence_exit': return { title: `Left ${p.name || 'a geofence'}`, body: `${v} left ${p.name || 'a geofence'}.` };
    case 'sos': return { title: '🚨 SOS', body: `The SOS button was pressed in ${v}.${by}` };
    case 'power_cut': return { title: '⚠️ Power cut', body: `The tracker in ${v} was disconnected from the vehicle battery.` };
    case 'vibration': return { title: 'Vibration detected', body: `${v} detected vibration.` };
    case 'low_battery': return { title: 'Tracker battery low', body: `The tracker in ${v} is low on battery.` };
    case 'power_off': return { title: 'Tracker switched off', body: `The tracker in ${v} was switched off.` };
    case 'offline': return { title: 'Vehicle went offline', body: `${v} stopped reporting.${by}` };
    case 'online': return { title: 'Back online', body: `${v} is reporting again.` };
    case 'long_stop': return { title: `Long stop · ${stopLength(p.minutes)}`, body: `${v} has been parked for ${stopLength(p.minutes)}.${by}` };
    case 'gps_lost': return { title: 'GPS signal lost', body: `${v} is online but has no location.${by}` };
    default: return { title: v, body: event.type };
  }
}

/** 22:00-07:00 in the given timezone. */
function inQuietHours(date, timeZone = 'Asia/Kolkata') {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone }).format(date));
  return hour >= 22 || hour < 7;
}

function createNotifier({ fcm, logger, now = () => new Date() }) {
  async function deliver(tokens, payload) {
    if (tokens.length === 0) return { sent: 0, deadTokens: [] };
    const result = await fcm.send(tokens, payload);
    if (result.deadTokens.length) {
      await prisma.pushToken.deleteMany({ where: { token: { in: result.deadTokens } } });
    }
    return result;
  }

  async function notify(event) {
    if (!fcm.enabled) return { sent: 0 };

    const recipients = await prisma.deviceAccess.findMany({
      where: { deviceId: event.deviceId, notify: true },
      include: {
        user: { include: { pushTokens: true } },
        device: { select: { name: true, registrationNumber: true, imei: true, timezone: true, mainDriver: { select: { name: true } } } },
      },
    });
    if (recipients.length === 0) return { sent: 0 };

    const device = recipients[0].device;
    const quiet = inQuietHours(now(), device.timezone);
    const wanted = recipients.filter((r) => {
      const setting = SETTING[event.type];
      if (setting && r.user[setting] === false) return false;
      if (quiet && r.user.quietHours && !URGENT.has(event.type)) return false;
      return true;
    });
    const tokens = wanted.flatMap((r) => r.user.pushTokens.map((t) => t.token));

    const vehicle = device.registrationNumber || device.name || `Tracker ${device.imei.slice(-4)}`;
    const { title, body } = message(event, vehicle, device.mainDriver?.name);
    const result = await deliver(tokens, { title, body, data: { type: event.type, deviceId: event.deviceId, eventId: event.id } });
    logger.debug({ type: event.type, sent: result.sent, removed: result.deadTokens.length, skipped: recipients.length - wanted.length }, 'push sent');
    return result;
  }

  /** "Is push working?" button in the app. */
  async function sendTest(userId) {
    const tokens = (await prisma.pushToken.findMany({ where: { userId } })).map((t) => t.token);
    const result = await deliver(tokens, {
      title: 'Test notification',
      body: 'Push notifications from Pavakie are working.',
      data: { type: 'test' },
    });
    return { sent: result.sent, phones: tokens.length };
  }

  return {
    enabled: fcm.enabled,
    notify(event) {
      return notify(event).catch((err) => {
        logger.warn({ err: err.message, type: event.type }, 'push notification failed');
        return { sent: 0 };
      });
    },
    sendTest,
  };
}

module.exports = { createNotifier, message, inQuietHours, stopLength };
