/**
 * Sends a push notification for each alert to everyone with access to the
 * tracker who has notifications on for it. Dead phone tokens are removed.
 * Runs in the background: a slow or failing push never delays tracking.
 */
const { prisma } = require('../db/client');

const KMH = (v) => `${v} km/h`;

/** Notification text per alert type. */
function message(event, deviceName) {
  const name = deviceName || 'Your vehicle';
  const p = event.payload || {};
  switch (event.type) {
    case 'ignition_on': return { title: name, body: 'Ignition turned ON' };
    case 'ignition_off': return { title: name, body: 'Ignition turned OFF' };
    case 'overspeed': return { title: `${name}: overspeed`, body: `Going ${KMH(p.speed)} (limit ${KMH(p.limit)})` };
    case 'geofence_enter': return { title: name, body: `Entered ${p.name || 'a geofence'}` };
    case 'geofence_exit': return { title: name, body: `Left ${p.name || 'a geofence'}` };
    case 'sos': return { title: `🚨 ${name}: SOS`, body: 'The SOS button was pressed' };
    case 'power_cut': return { title: `⚠️ ${name}: power cut`, body: 'The tracker was disconnected from the vehicle battery' };
    case 'vibration': return { title: name, body: 'Vibration detected' };
    case 'low_battery': return { title: name, body: 'Tracker battery is low' };
    case 'power_off': return { title: name, body: 'The tracker was switched off' };
    case 'offline': return { title: name, body: 'Tracker is offline (no signal)' };
    case 'online': return { title: name, body: 'Tracker is back online' };
    default: return { title: name, body: event.type };
  }
}

function createNotifier({ fcm, logger }) {
  async function notify(event) {
    if (!fcm.enabled) return { sent: 0 };

    const recipients = await prisma.deviceAccess.findMany({
      where: { deviceId: event.deviceId, notify: true },
      include: { user: { include: { pushTokens: true } }, device: { select: { name: true } } },
    });
    const tokens = recipients.flatMap((r) => r.user.pushTokens.map((t) => t.token));
    if (tokens.length === 0) return { sent: 0 };

    const { title, body } = message(event, recipients[0].device.name);
    const result = await fcm.send(tokens, {
      title,
      body,
      data: { type: event.type, deviceId: event.deviceId, eventId: event.id },
    });
    if (result.deadTokens.length) {
      await prisma.pushToken.deleteMany({ where: { token: { in: result.deadTokens } } });
    }
    logger.debug({ type: event.type, sent: result.sent, removed: result.deadTokens.length }, 'push sent');
    return result;
  }

  return {
    notify(event) {
      return notify(event).catch((err) => {
        logger.warn({ err: err.message, type: event.type }, 'push notification failed');
        return { sent: 0 };
      });
    },
  };
}

module.exports = { createNotifier, message };
