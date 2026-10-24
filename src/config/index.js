/**
 * Reads and validates environment variables once at startup.
 * A missing or invalid value stops the app with a clear message instead of
 * failing later in a confusing way.
 */
require('dotenv').config();
const { z } = require('zod');

const int = (def) => z.coerce.number().int().positive().default(def);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']).default('info'),

  PORT: int(3000),
  TCP_PORT: int(5023),
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL is required' })
    .regex(/^postgres(ql)?:\/\//, 'DATABASE_URL must start with postgresql://'),

  ADMIN_API_KEY: z
    .string()
    .default('')
    .refine((v) => v === '' || v.length >= 32, 'ADMIN_API_KEY must be empty or at least 32 characters'),
  CORS_ORIGIN: z.string().default('*'),
  // Host name of the admin website (e.g. admin.example.com). When set, the admin
  // site is served only there and admin logins only work there. Empty = admin site off.
  ADMIN_DOMAIN: z.string().trim().toLowerCase().default(''),
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET is required (generate with: openssl rand -hex 48)' })
    .min(32, 'JWT_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_TTL_MIN: int(15),
  REFRESH_TOKEN_TTL_DAYS: int(30),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  FIREBASE_CREDENTIALS_FILE: z.string().default('./secrets/firebase.json'),
  OFFLINE_AFTER_MIN: int(10),
  EMAIL_API_KEY: z.string().default(''),
  EMAIL_FROM: z.string().default('Pavakie Tracker <onboarding@resend.dev>'),
  // on = always, off = never, auto = only when email sending is configured
  EMAIL_VERIFICATION: z.enum(['auto', 'on', 'off']).default('auto'),
  // "Sign in with Google": OAuth client IDs (comma separated). The FIRST must be
  // the Web client ID; apps use it to request ID tokens. Empty = off.
  GOOGLE_CLIENT_IDS: z.string().default(''),
  // Shown on the "Contact us" page in the app; inquiries are emailed to SUPPORT_EMAIL.
  SUPPORT_EMAIL: z.string().default(''),
  SUPPORT_PHONE: z.string().default(''),
  SUPPORT_WHATSAPP: z.string().default(''),
  SUPPORT_ADDRESS: z.string().default(''),
  APP_MIN_VERSION: z.string().default('1.0.0'),
  APP_LATEST_VERSION: z.string().default('1.0.0'),

  LOGIN_TIMEOUT_MS: int(30_000),
  SOCKET_IDLE_TIMEOUT_MS: int(600_000),
  MAX_CONNECTIONS_PER_IP: int(50),
  MAX_CONNECTIONS: int(10_000),
  COMMAND_TIMEOUT_MS: int(30_000),

  FUTURE_TOLERANCE_MIN: int(10),
  MAX_POINT_AGE_DAYS: int(7),
  STATIONARY_MIN_DISTANCE_M: int(15),
  STATIONARY_STORE_INTERVAL_S: int(300),
  MAX_IMPLIED_SPEED_KMH: int(300),

  BATCH_FLUSH_MS: int(1000),
  BATCH_MAX_ROWS: int(500),
  BATCH_MAX_BACKLOG: int(50_000),
  DEVICE_STATE_FLUSH_MS: int(5000),
});

function loadConfig(env = process.env) {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    // Logger isn't available yet; print plainly and stop.
    console.error(`Invalid configuration:\n${problems}\nCheck your .env file (see .env.example).`);
    process.exit(1);
  }
  const e = parsed.data;

  return {
    env: e.NODE_ENV,
    logLevel: e.LOG_LEVEL,
    httpPort: e.PORT,
    tcpPort: e.TCP_PORT,
    databaseUrl: e.DATABASE_URL,
    adminApiKey: e.ADMIN_API_KEY,
    corsOrigin: e.CORS_ORIGIN,
    adminDomain: e.ADMIN_DOMAIN,
    trustProxy: e.TRUST_PROXY,
    firebaseCredentialsFile: e.FIREBASE_CREDENTIALS_FILE,
    offlineAfterMs: e.OFFLINE_AFTER_MIN * 60_000,
    email: { apiKey: e.EMAIL_API_KEY, from: e.EMAIL_FROM, verification: e.EMAIL_VERIFICATION },
    app: { minVersion: e.APP_MIN_VERSION, latestVersion: e.APP_LATEST_VERSION },
    google: { clientIds: e.GOOGLE_CLIENT_IDS.split(',').map((s) => s.trim()).filter(Boolean) },
    support: { email: e.SUPPORT_EMAIL, phone: e.SUPPORT_PHONE, whatsapp: e.SUPPORT_WHATSAPP, address: e.SUPPORT_ADDRESS },
    auth: {
      jwtSecret: e.JWT_SECRET,
      accessTokenTtlS: e.ACCESS_TOKEN_TTL_MIN * 60,
      refreshTokenTtlMs: e.REFRESH_TOKEN_TTL_DAYS * 86_400_000,
    },
    gateway: {
      loginTimeoutMs: e.LOGIN_TIMEOUT_MS,
      idleTimeoutMs: e.SOCKET_IDLE_TIMEOUT_MS,
      maxConnectionsPerIp: e.MAX_CONNECTIONS_PER_IP,
      maxConnections: e.MAX_CONNECTIONS,
      commandTimeoutMs: e.COMMAND_TIMEOUT_MS,
    },
    filters: {
      futureToleranceMs: e.FUTURE_TOLERANCE_MIN * 60_000,
      maxPointAgeMs: e.MAX_POINT_AGE_DAYS * 86_400_000,
      stationaryMinDistanceM: e.STATIONARY_MIN_DISTANCE_M,
      stationaryStoreIntervalMs: e.STATIONARY_STORE_INTERVAL_S * 1000,
      maxImpliedSpeedKmh: e.MAX_IMPLIED_SPEED_KMH,
    },
    writer: {
      flushMs: e.BATCH_FLUSH_MS,
      maxRows: e.BATCH_MAX_ROWS,
      maxBacklog: e.BATCH_MAX_BACKLOG,
      deviceStateFlushMs: e.DEVICE_STATE_FLUSH_MS,
    },
  };
}

module.exports = loadConfig();
module.exports.loadConfig = loadConfig;
