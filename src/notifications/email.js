/**
 * Transactional email (password reset codes) via Resend's HTTP API.
 *
 * Without EMAIL_API_KEY the server runs in "log only" mode: the email
 * (including the code) is written to the server log, so an admin can help
 * a user before a domain + email provider are set up.
 */
function createMailer({ apiKey, from, logger }) {
  const log = logger.child({ component: 'email' });

  if (!apiKey) {
    log.warn('email not configured (EMAIL_API_KEY): emails will only be logged');
    return {
      enabled: false,
      async send({ to, subject, text }) {
        log.warn({ to, subject, text }, 'email NOT sent (log only mode)');
      },
    };
  }

  return {
    enabled: true,
    async send({ to, subject, text, html }) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from, to: [to], subject, text, html }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`email provider answered ${res.status}: ${body.slice(0, 200)}`);
      }
      log.info({ to, subject }, 'email sent');
    },
  };
}

/** Password reset email (plain text + simple branded HTML). */
function resetEmail(code) {
  const text = `Your Pavakie Tracker password reset code is ${code}.\n\nIt expires in 15 minutes. If you didn't ask for this, you can ignore this email.`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#DDE3E8;padding:32px">
      <div style="max-width:420px;margin:auto;background:#ffffff;border-radius:16px;padding:28px;color:#3A0F34">
        <h2 style="margin:0 0 8px">Reset your password</h2>
        <p>Enter this code in the Pavakie Tracker app:</p>
        <p style="font-size:34px;letter-spacing:8px;font-weight:bold;background:#EAAA00;color:#3A0F34;text-align:center;border-radius:12px;padding:14px 0">${code}</p>
        <p style="color:#6D5068;font-size:13px">It expires in 15 minutes. If you didn't ask for this, ignore this email.</p>
      </div>
    </div>`;
  return { subject: `${code} is your Pavakie Tracker reset code`, text, html };
}

/** Sign-up verification email. */
function verifyEmail(code) {
  const text = `Welcome to Pavakie Tracker! Your verification code is ${code}.\n\nIt expires in 15 minutes.`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#DDE3E8;padding:32px">
      <div style="max-width:420px;margin:auto;background:#ffffff;border-radius:16px;padding:28px;color:#3A0F34">
        <h2 style="margin:0 0 8px">Confirm your email</h2>
        <p>Enter this code in the Pavakie Tracker app to finish creating your account:</p>
        <p style="font-size:34px;letter-spacing:8px;font-weight:bold;background:#EAAA00;color:#3A0F34;text-align:center;border-radius:12px;padding:14px 0">${code}</p>
        <p style="color:#6D5068;font-size:13px">It expires in 15 minutes. If you didn't sign up, ignore this email.</p>
      </div>
    </div>`;
  return { subject: `${code} is your Pavakie Tracker verification code`, text, html };
}

module.exports = { createMailer, resetEmail, verifyEmail };
