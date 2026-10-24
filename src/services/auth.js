/**
 * User accounts and login tokens.
 *
 * - Passwords: salted scrypt hashes (src/lib/secrets.js).
 * - Access token: short-lived JWT (default 15 min) sent as "Authorization: Bearer ...".
 * - Refresh token: long random string (default 30 days), stored only as a
 *   SHA-256 hash. Every refresh returns a NEW refresh token and revokes the
 *   old one ("rotation"). If a revoked token is ever used again, someone has
 *   a stolen copy, so all of that user's sessions are revoked.
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { prisma } = require('../db/client');
const { hashSecret, verifySecret } = require('../lib/secrets');
const { AppError, conflict, unauthorized } = require('../lib/errors');
const { OAuth2Client } = require('google-auth-library');
const { resetEmail, verifyEmail } = require('../notifications/email');

const RESET_CODE_TTL_MS = 15 * 60_000;
const RESET_MAX_ATTEMPTS = 5;

const ISSUER = 'gps-tracker';

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

// Used to spend the same time on "unknown email" as on "wrong password",
// so response timing doesn't reveal which emails have accounts.
let dummyHash;
const getDummyHash = () => (dummyHash ??= hashSecret('not-a-real-password'));

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    hasPassword: Boolean(user.passwordHash),
    googleLinked: Boolean(user.googleId),
  };
}

/**
 * @param {boolean} [requireEmailVerification] new accounts must confirm their
 *   email with a 6-digit code before they can log in (needs a working mailer).
 * @param {string[]} [googleClientIds] OAuth client IDs whose Google ID tokens we
 *   accept ("Sign in with Google"); empty = Google sign-in off.
 * @param {(token: string, audience: string[]) => Promise<object>} [verifyGoogleToken]
 *   returns the token's payload; replaceable in tests.
 */
function createAuthService({
  jwtSecret, accessTokenTtlS, refreshTokenTtlMs, ownership, mailer, logger,
  requireEmailVerification = false, googleClientIds = [], verifyGoogleToken,
}) {
  const googleClient = new OAuth2Client();
  const checkGoogleToken = verifyGoogleToken ||
    (async (idToken, audience) => (await googleClient.verifyIdToken({ idToken, audience })).getPayload());

  async function issueTokens(user) {
    const accessToken = jwt.sign({ role: user.role }, jwtSecret, {
      subject: user.id,
      expiresIn: accessTokenTtlS,
      issuer: ISSUER,
      algorithm: 'HS256',
    });
    const refreshToken = crypto.randomBytes(32).toString('base64url');
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTtlMs);
    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: sha256(refreshToken), expiresAt: refreshTokenExpiresAt },
    });
    return { accessToken, accessTokenExpiresIn: accessTokenTtlS, refreshToken, refreshTokenExpiresAt };
  }

  /**
   * Creates the account. With email verification on, it returns
   * { verificationRequired: true, email } and emails a code instead of tokens;
   * otherwise it logs the user in right away.
   */
  async function register({ email, password, name }) {
    const clean = normalizeEmail(email);
    const data = { passwordHash: await hashSecret(password), name: name || null, termsAcceptedAt: new Date() };
    let user;
    try {
      user = await prisma.user.create({
        data: { email: clean, ...data, emailVerifiedAt: requireEmailVerification ? null : new Date() },
      });
    } catch (err) {
      if (err.code !== 'P2002') throw err;
      // An account that was never verified can be signed up again (e.g. the
      // person mistyped the password or lost the code); a verified one can't.
      const existing = await prisma.user.findUnique({ where: { email: clean } });
      if (!existing || existing.emailVerifiedAt || !requireEmailVerification) {
        throw conflict('An account with this email already exists');
      }
      user = await prisma.user.update({ where: { id: existing.id }, data });
    }
    if (!requireEmailVerification) return { user: publicUser(user), ...(await issueTokens(user)) };
    await sendVerificationCode(user);
    return { verificationRequired: true, email: user.email };
  }

  async function sendVerificationCode(user) {
    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    await prisma.emailVerification.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
    await prisma.emailVerification.create({
      data: { userId: user.id, codeHash: await hashSecret(code), expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS) },
    });
    try {
      await mailer?.send({ to: user.email, ...verifyEmail(code) });
    } catch (err) {
      logger?.error({ err: err.message }, 'failed to send verification email');
    }
  }

  /** Sends a new code if the account exists and isn't verified yet (always resolves the same). */
  async function resendVerification(email) {
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (user && !user.emailVerifiedAt) await sendVerificationCode(user);
  }

  /** Confirms the email with the code and logs the user in. */
  async function verifyEmailCode(email, code) {
    const invalid = () => new AppError(400, 'INVALID_CODE', 'The code is incorrect or has expired. Request a new one.');
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user) throw invalid();
    if (user.emailVerifiedAt) throw new AppError(409, 'ALREADY_VERIFIED', 'This email is already verified. Please log in.');
    const row = await prisma.emailVerification.findFirst({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!row || row.attempts >= RESET_MAX_ATTEMPTS) throw invalid();
    if (!(await verifySecret(String(code), row.codeHash))) {
      await prisma.emailVerification.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
      throw invalid();
    }
    const [, verified] = await prisma.$transaction([
      prisma.emailVerification.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
      prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } }),
    ]);
    return { user: publicUser(verified), ...(await issueTokens(verified)) };
  }

  async function login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    const ok = user?.passwordHash
      ? await verifySecret(password, user.passwordHash)
      : (await verifySecret(password, await getDummyHash()), false);
    if (!ok) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
    if (!user.emailVerifiedAt && requireEmailVerification) {
      throw new AppError(403, 'EMAIL_NOT_VERIFIED', 'Please verify your email first. Check your inbox for the code.');
    }
    return { user: publicUser(user), ...(await issueTokens(user)) };
  }

  /**
   * "Sign in with Google": checks the Google ID token, then logs in the user
   * with that Google account, links it to an existing account with the same
   * (Google-verified) email, or creates a new account.
   */
  async function googleSignIn(idToken) {
    if (googleClientIds.length === 0) throw new AppError(503, 'GOOGLE_DISABLED', 'Google sign-in is not set up yet');
    let payload;
    try {
      payload = await checkGoogleToken(idToken, googleClientIds);
    } catch (err) {
      logger?.warn({ err: err.message }, 'rejected Google ID token');
      throw new AppError(401, 'INVALID_GOOGLE_TOKEN', 'Google sign-in failed. Please try again.');
    }
    if (!payload?.sub || !payload.email || payload.email_verified === false) {
      throw new AppError(401, 'INVALID_GOOGLE_TOKEN', 'Your Google account has no verified email');
    }
    const email = normalizeEmail(payload.email);
    let user = await prisma.user.findUnique({ where: { googleId: payload.sub } });
    let created = false;
    if (!user) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        // Google has verified the email, so this is the same person.
        user = await prisma.user.update({
          where: { id: existing.id },
          data: { googleId: payload.sub, emailVerifiedAt: existing.emailVerifiedAt || new Date(), name: existing.name || payload.name || null },
        });
      } else {
        try {
          user = await prisma.user.create({
            data: { email, googleId: payload.sub, name: payload.name || null, termsAcceptedAt: new Date(), emailVerifiedAt: new Date() },
          });
          created = true;
        } catch (err) {
          if (err.code !== 'P2002') throw err;
          user = await prisma.user.findUnique({ where: { email } }); // signed up at the same moment
        }
      }
    }
    return { user: publicUser(user), created, ...(await issueTokens(user)) };
  }

  async function refresh(refreshToken) {
    const invalid = () => new AppError(401, 'INVALID_REFRESH_TOKEN', 'Session expired, please log in again');
    if (!refreshToken) throw invalid();

    const row = await prisma.refreshToken.findUnique({
      where: { tokenHash: sha256(refreshToken) },
      include: { user: true },
    });
    if (!row) throw invalid();
    if (row.revokedAt) {
      await revokeAll(row.userId); // reuse of an old token: treat as theft
      throw invalid();
    }
    if (row.expiresAt < new Date()) throw invalid();

    // Revoke exactly once; a concurrent refresh with the same token loses.
    const { count } = await prisma.refreshToken.updateMany({
      where: { id: row.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (count === 0) {
      await revokeAll(row.userId);
      throw invalid();
    }
    return { user: publicUser(row.user), ...(await issueTokens(row.user)) };
  }

  async function logout(refreshToken) {
    if (!refreshToken) return;
    await prisma.refreshToken.updateMany({
      where: { tokenHash: sha256(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async function revokeAll(userId) {
    await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  /** Returns { id, role } or throws 401. */
  function verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, jwtSecret, { algorithms: ['HS256'], issuer: ISSUER });
      return { id: payload.sub, role: payload.role, exp: payload.exp };
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw new AppError(401, 'TOKEN_EXPIRED', 'Access token expired');
      throw unauthorized('Invalid access token');
    }
  }

  async function getUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw unauthorized('Account no longer exists');
    return user;
  }

  async function updateProfile(userId, { name }) {
    const user = await prisma.user.update({ where: { id: userId }, data: { name } });
    return publicUser(user);
  }

  async function assertPassword(userId, password) {
    const user = await getUser(userId);
    if (!user.passwordHash) {
      throw new AppError(400, 'NO_PASSWORD', 'This account signs in with Google and has no password yet. Use "Forgot password" to set one.');
    }
    if (!(await verifySecret(password, user.passwordHash))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Password is incorrect');
    }
    return user;
  }

  /** Changing the password logs out every other session. */
  async function changePassword(userId, currentPassword, newPassword) {
    await assertPassword(userId, currentPassword);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: await hashSecret(newPassword) } });
    await revokeAll(userId);
  }

  /**
   * Deletes the account and its personal data. Trackers the user owns are
   * released (history wiped, back to stock) so a new owner can claim them.
   */
  async function deleteAccount(userId, { password, confirmEmail }) {
    const user = await getUser(userId);
    if (user.passwordHash) await assertPassword(userId, password || '');
    else if (normalizeEmail(confirmEmail) !== user.email) {
      throw new AppError(400, 'CONFIRM_EMAIL', 'Type your email address to confirm');
    }
    await ownership.releaseAllOwnedBy(userId);
    await prisma.user.delete({ where: { id: userId } });
  }

  /**
   * Sends a 6-digit reset code if the email has an account. Always resolves
   * the same way, so nobody can find out which emails are registered.
   */
  async function requestPasswordReset(email) {
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user) {
      await getDummyHash(); // similar timing for unknown emails
      return;
    }
    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    // Only the newest code works.
    await prisma.passwordReset.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
    await prisma.passwordReset.create({
      data: { userId: user.id, codeHash: await hashSecret(code), expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS) },
    });
    try {
      await mailer?.send({ to: user.email, ...resetEmail(code) });
    } catch (err) {
      logger?.error({ err: err.message }, 'failed to send reset email');
    }
  }

  /** Checks the code and sets the new password; logs out every session. */
  async function resetPassword(email, code, newPassword) {
    const invalid = () => new AppError(400, 'INVALID_CODE', 'The code is incorrect or has expired. Request a new one.');
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user) throw invalid();
    const reset = await prisma.passwordReset.findFirst({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!reset || reset.attempts >= RESET_MAX_ATTEMPTS) throw invalid();

    if (!(await verifySecret(String(code), reset.codeHash))) {
      await prisma.passwordReset.update({ where: { id: reset.id }, data: { attempts: { increment: 1 } } });
      throw invalid();
    }
    await prisma.$transaction([
      prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
      prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashSecret(newPassword) } }),
    ]);
    await revokeAll(user.id);
  }

  async function savePushToken(userId, { token, platform }) {
    await prisma.pushToken.upsert({
      where: { token },
      create: { token, userId, platform },
      update: { userId, platform },
    });
  }

  async function deletePushToken(userId, token) {
    await prisma.pushToken.deleteMany({ where: { token, userId } });
  }

  return {
    register,
    login,
    refresh,
    logout,
    revokeAll,
    verifyAccessToken,
    getUser,
    updateProfile,
    changePassword,
    deleteAccount,
    savePushToken,
    deletePushToken,
    publicUser,
    requestPasswordReset,
    resetPassword,
    verifyEmailCode,
    resendVerification,
    googleSignIn,
    googleEnabled: googleClientIds.length > 0,
    requireEmailVerification,
  };
}

module.exports = { createAuthService, normalizeEmail };
