// Request validation and async-handler helpers shared by all routes.
const { z } = require('zod');
const { badRequest } = require('../lib/errors');

/** Parses data with a zod schema or throws a 400 listing each bad field. */
function parse(schema, data) {
  const result = schema.safeParse(data ?? {});
  if (!result.success) {
    throw badRequest(
      'Invalid request',
      result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))
    );
  }
  return result.data;
}

/** Wraps async handlers so thrown errors reach the error middleware. */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const email = z.string().trim().toLowerCase().email('must be a valid email').max(254);
const password = z
  .string()
  .min(8, 'must be at least 8 characters')
  .max(128, 'must be at most 128 characters');
const uuid = z.string().uuid();

function isValidTimezone(tz) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

module.exports = { parse, wrap, z, schemas: { email, password, uuid }, isValidTimezone };
