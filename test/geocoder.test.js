const test = require('node:test');
const assert = require('node:assert/strict');
const { createGeocoder, shortAddress } = require('../src/services/geocoder');

const answer = (address) => ({ ok: true, json: async () => ({ address }) });

test('shortAddress: road near area, falls back to town or display name', () => {
  assert.equal(shortAddress({ address: { road: 'Avinashi Road', suburb: 'Peelamedu', city: 'Coimbatore' } }), 'Avinashi Road, near Peelamedu');
  assert.equal(shortAddress({ address: { road: 'NH 544', city: 'Coimbatore' } }), 'NH 544, Coimbatore');
  assert.equal(shortAddress({ address: { suburb: 'Gandhipuram', city: 'Coimbatore' } }), 'Gandhipuram, Coimbatore');
  assert.equal(shortAddress({ display_name: 'A, B, C, India' }), 'A, B');
  assert.equal(shortAddress({}), null);
});

test('caches by ~11 m, shares in-flight lookups, spaces requests', async () => {
  const calls = [];
  const g = createGeocoder({
    userAgent: 'test', minIntervalMs: 30,
    fetchImpl: async (url, opts) => { calls.push({ url, at: Date.now(), ua: opts.headers['user-agent'] }); return answer({ road: `R${calls.length}`, city: 'X' }); },
  });
  const [a, b] = await Promise.all([g.reverse(11.01681, 76.95581), g.reverse(11.01683, 76.95579)]);
  assert.equal(a, 'R1, X');
  assert.equal(b, 'R1, X'); // same rounded key -> one request
  assert.equal(await g.reverse(11.0168, 76.9558), 'R1, X'); // cached
  assert.equal(await g.reverse(12, 77), 'R2, X');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].ua, 'test');
  assert.ok(calls[1].at - calls[0].at >= 25, 'second request waits for the interval');
});

test('failures are not cached; a full queue gives up', async () => {
  let fail = true;
  const g = createGeocoder({ userAgent: 't', minIntervalMs: 0, maxQueue: 1, fetchImpl: async () => (fail ? { ok: false, status: 429 } : answer({ road: 'Ok Road' })) });
  assert.equal(await g.reverse(1, 1), null);
  fail = false;
  assert.equal(await g.reverse(1, 1), 'Ok Road');
  const p = g.reverse(2, 2);
  assert.equal(await g.reverse(3, 3), null); // queue full
  assert.equal(await p, 'Ok Road');
});
