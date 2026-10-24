/**
 * Structured JSON logger (pino). In development, `npm run dev` pipes the
 * output through pino-pretty for readable, colored lines.
 *
 * Use child loggers to attach context: logger.child({ imei }).info('login')
 */
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: undefined, // drop pid/hostname noise
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['req.headers["x-api-key"]', 'req.headers.authorization'],
});

module.exports = logger;
