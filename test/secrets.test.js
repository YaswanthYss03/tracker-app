// Activation codes and hashing.
const test = require('node:test');
const assert = require('node:assert/strict');
const s = require('../src/lib/secrets');

test('activation codes are 10 unambiguous characters in two groups', () => {
  const codes = new Set();
  for (let i = 0; i < 200; i++) {
    const code = s.generateActivationCode();
    assert.match(code, /^[A-HJKMNP-Z2-9]{5}-[A-HJKMNP-Z2-9]{5}$/);
    codes.add(code);
  }
  assert.equal(codes.size, 200);
});

test('hash verifies the right code, in any case or spacing, and rejects others', async () => {
  const code = s.generateActivationCode();
  const hash = await s.hashActivationCode(code);
  assert.ok(!hash.includes(code.replace('-', '')));
  assert.equal(await s.verifyActivationCode(code, hash), true);
  assert.equal(await s.verifyActivationCode(code.toLowerCase().replace('-', ' '), hash), true);
  assert.equal(await s.verifyActivationCode('AAAAA-AAAAA', hash), false);
  assert.equal(await s.verifyActivationCode(code, 'garbage'), false);
});

test('safeEqual compares keys without accepting empty values', () => {
  assert.equal(s.safeEqual('abc', 'abc'), true);
  assert.equal(s.safeEqual('abc', 'abd'), false);
  assert.equal(s.safeEqual('', ''), false);
  assert.equal(s.safeEqual(undefined, 'abc'), false);
});
