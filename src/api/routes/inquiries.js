/**
 * /api/v1/inquiries — "Contact us" and "Partner with us" forms (app + website).
 *
 *   POST /   { kind: 'contact', name, email, phone?, message }
 *            { kind: 'partner', name, email, phone, company?, city, partnerType, message? }
 *            -> 201 { id }. Logged-in users are linked automatically.
 *
 * Admins read them at GET /api/v1/admin/inquiries. When email is configured,
 * each one is also emailed to SUPPORT_EMAIL.
 */
const express = require('express');
const { prisma } = require('../../db/client');
const { parse, wrap, z, schemas } = require('../validate');

const PARTNER_TYPES = ['dealer', 'installer', 'fleet', 'reseller', 'other'];

const phone = z.string().trim().regex(/^[+\d][\d\s-]{6,19}$/, 'enter a valid phone number');
const base = {
  name: z.string().trim().min(1).max(80),
  email: schemas.email,
};
const inquirySchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('contact'), ...base, phone: phone.optional(), message: z.string().trim().min(5).max(2000) }),
  z.object({
    kind: z.literal('partner'),
    ...base,
    phone,
    company: z.string().trim().max(120).optional(),
    city: z.string().trim().min(1).max(80),
    partnerType: z.enum(PARTNER_TYPES),
    message: z.string().trim().max(2000).optional(),
  }),
]);

function createInquiriesRouter({ authService, limits, mailer, support, logger }) {
  const router = express.Router();

  router.post('/', limits.inquiry, wrap(async (req, res) => {
    const body = parse(inquirySchema, req.body);
    // Optional login: link the message to the account if a valid token was sent.
    let userId = null;
    const match = (req.get('authorization') || '').match(/^Bearer\s+(.+)$/i);
    if (match) {
      try {
        userId = authService.verifyAccessToken(match[1]).id;
      } catch {
        /* treat as anonymous */
      }
    }
    const row = await prisma.inquiry.create({ data: { ...body, message: body.message || '', userId } });

    if (support?.email && mailer?.enabled) {
      const title = body.kind === 'partner' ? `New partner request: ${body.company || body.name}` : `Contact message from ${body.name}`;
      const lines = Object.entries(body).filter(([k]) => k !== 'kind').map(([k, v]) => `${k}: ${v}`);
      mailer.send({ to: support.email, subject: title, text: lines.join('\n') }).catch((err) => {
        logger?.error({ err: err.message }, 'failed to email inquiry');
      });
    }
    res.status(201).json({ data: { id: row.id } });
  }));

  return router;
}

module.exports = { createInquiriesRouter, PARTNER_TYPES };
