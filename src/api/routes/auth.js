/**
 * /api/v1/auth — sign up, log in, refresh, log out.
 *
 *   POST /register  { email, password, name?, acceptTerms: true } -> 201 user + tokens,
 *                   or { verificationRequired: true, email } when email verification is on
 *   POST /google              { idToken }       -> user + tokens (201 when a new account was created)
 *   POST /verify-email        { email, code }   -> user + tokens (account confirmed)
 *   POST /resend-verification { email }         -> 204 (new code if not verified yet)
 *   POST /login     { email, password }                           -> user + tokens
 *   POST /refresh   { refreshToken }                              -> user + NEW tokens (old one stops working)
 *   POST /logout    { refreshToken }                              -> 204
 *   POST /forgot-password { email }                               -> 204 (code emailed if the account exists)
 *   POST /reset-password  { email, code, newPassword }            -> 204, logs out all sessions
 */
const express = require('express');
const { parse, wrap, z, schemas } = require('../validate');

const registerSchema = z.object({
  email: schemas.email,
  password: schemas.password,
  name: z.string().trim().min(1).max(80).optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'you must accept the terms and privacy policy' }),
  }),
});
const loginSchema = z.object({ email: schemas.email, password: z.string().min(1).max(128) });
const tokenSchema = z.object({ refreshToken: z.string().min(10).max(200) });

function createAuthRouter({ authService, limits }) {
  const router = express.Router();

  router.post('/register', limits.register, wrap(async (req, res) => {
    const body = parse(registerSchema, req.body);
    res.status(201).json({ data: await authService.register(body) });
  }));

  router.post('/login', limits.login, wrap(async (req, res) => {
    const body = parse(loginSchema, req.body);
    res.json({ data: await authService.login(body) });
  }));

  router.post('/refresh', limits.refresh, wrap(async (req, res) => {
    const { refreshToken } = parse(tokenSchema, req.body);
    res.json({ data: await authService.refresh(refreshToken) });
  }));

  router.post('/google', limits.google, wrap(async (req, res) => {
    const { idToken } = parse(z.object({ idToken: z.string().min(20).max(4096) }), req.body);
    const result = await authService.googleSignIn(idToken);
    res.status(result.created ? 201 : 200).json({ data: result });
  }));

  router.post('/verify-email', limits.resetPassword, wrap(async (req, res) => {
    const body = parse(z.object({ email: schemas.email, code: z.string().regex(/^\d{6}$/, 'must be 6 digits') }), req.body);
    res.json({ data: await authService.verifyEmailCode(body.email, body.code) });
  }));

  router.post('/resend-verification', limits.forgotPassword, wrap(async (req, res) => {
    const { email } = parse(z.object({ email: schemas.email }), req.body);
    await authService.resendVerification(email);
    res.status(204).end();
  }));

  router.post('/forgot-password', limits.forgotPassword, wrap(async (req, res) => {
    const { email } = parse(z.object({ email: schemas.email }), req.body);
    await authService.requestPasswordReset(email);
    res.status(204).end();
  }));

  router.post('/reset-password', limits.resetPassword, wrap(async (req, res) => {
    const body = parse(
      z.object({ email: schemas.email, code: z.string().regex(/^\d{6}$/, 'must be 6 digits'), newPassword: schemas.password }),
      req.body
    );
    await authService.resetPassword(body.email, body.code, body.newPassword);
    res.status(204).end();
  }));

  router.post('/logout', wrap(async (req, res) => {
    const { refreshToken } = parse(tokenSchema, req.body);
    await authService.logout(refreshToken);
    res.status(204).end();
  }));

  return router;
}

module.exports = { createAuthRouter };
