/**
 * /api/v1/geocode — street address for a position (logged-in users only).
 *
 *   GET /reverse?lat=11.0168&lon=76.9558 -> { data: { address: "Avinashi Road, near Peelamedu" | null } }
 */
const express = require('express');
const { parse, wrap, z } = require('../validate');

function createGeocodeRouter({ geocoder }) {
  const router = express.Router();
  const query = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180),
  });

  router.get('/reverse', wrap(async (req, res) => {
    const { lat, lon } = parse(query, req.query);
    const address = await geocoder.reverse(lat, lon);
    res.set('cache-control', 'private, max-age=3600').json({ data: { address } });
  }));

  return router;
}

module.exports = { createGeocodeRouter };
