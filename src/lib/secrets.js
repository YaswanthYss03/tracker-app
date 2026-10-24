/**
 * Activation codes and secret hashing.
 *
 * Activation codes are printed on the tracker's box. They use an alphabet
 * without look-alike characters (no 0/O, 1/I/L) and are stored only as a
 * salted scrypt hash, so a database leak doesn't reveal them.
 */
const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // 31 characters
const CODE_LENGTH = 10; // 31^10 ≈ 8 × 10^14 possibilities

/** Random code like "K7QM4-ZT9XH". */
function generateActivationCode() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  }
  return `${code.slice(0, 5)}-${code.slice(5)}`;
}

/** Uppercases and removes spaces/dashes so "k7qm4 zt9xh" matches "K7QM4-ZT9XH". */
function normalizeActivationCode(code) {
  return String(code || '').toUpperCase().replace(/[\s-]/g, '');
}

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

/** Hash format: scrypt$N$r$p$saltHex$hashHex */
async function hashSecret(secret) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(secret, salt, 32, SCRYPT_PARAMS);
  const { N, r, p } = SCRYPT_PARAMS;
  return `scrypt$${N}$${r}$${p}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function verifySecret(secret, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, N, r, p, saltHex, hashHex] = parts;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(secret, Buffer.from(saltHex, 'hex'), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return crypto.timingSafeEqual(actual, expected);
}

const hashActivationCode = (code) => hashSecret(normalizeActivationCode(code));
const verifyActivationCode = (code, stored) => verifySecret(normalizeActivationCode(code), stored);

/** Constant-time comparison for API keys. */
function safeEqual(given, expected) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(String(expected || ''));
  return a.length === b.length && b.length > 0 && crypto.timingSafeEqual(a, b);
}

module.exports = {
  generateActivationCode,
  normalizeActivationCode,
  hashActivationCode,
  verifyActivationCode,
  hashSecret,
  verifySecret,
  safeEqual,
};
