/**
 * Firebase Cloud Messaging sender.
 *
 * Reads the service-account key from FIREBASE_CREDENTIALS_FILE. If the file
 * is missing or is the wrong kind of file (e.g. the app's
 * google-services.json), push is disabled with a clear log message and every
 * send is a no-op, so the rest of the server keeps working.
 */
const fs = require('fs');
const path = require('path');

// Errors that mean "this phone token is dead, stop using it".
const DEAD_TOKEN_ERRORS = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument',
]);

function disabled(reason, logger) {
  logger.warn({ reason }, 'push notifications disabled');
  return { enabled: false, reason, send: async () => ({ sent: 0, deadTokens: [] }) };
}

function createFcm({ credentialsFile, logger }) {
  const file = path.resolve(credentialsFile || '');
  if (!credentialsFile || !fs.existsSync(file)) {
    return disabled(`no Firebase key at ${file}`, logger);
  }

  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return disabled(`cannot read ${file}: ${err.message}`, logger);
  }
  if (credentials.type !== 'service_account') {
    const hint = credentials.project_info
      ? 'this is google-services.json (the Android app file); use the service-account key from Firebase > Project settings > Service accounts'
      : 'expected a Firebase service-account key ("type": "service_account")';
    return disabled(hint, logger);
  }

  const { initializeApp, cert } = require('firebase-admin/app');
  const { getMessaging } = require('firebase-admin/messaging');
  const app = initializeApp({ credential: cert(credentials) }, 'gps-tracker');
  const messaging = getMessaging(app);
  logger.info({ project: credentials.project_id }, 'push notifications enabled');

  /**
   * Sends one notification to many phone tokens.
   * @returns {{ sent: number, deadTokens: string[] }}
   */
  async function send(tokens, { title, body, data = {} }) {
    if (tokens.length === 0) return { sent: 0, deadTokens: [] };
    const res = await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      android: { priority: 'high', notification: { channelId: 'alerts', sound: 'default' } },
      apns: { payload: { aps: { sound: 'default' } } },
    });
    const deadTokens = [];
    res.responses.forEach((r, i) => {
      if (!r.success && DEAD_TOKEN_ERRORS.has(r.error?.code)) deadTokens.push(tokens[i]);
    });
    return { sent: res.successCount, deadTokens };
  }

  return { enabled: true, send };
}

module.exports = { createFcm };
