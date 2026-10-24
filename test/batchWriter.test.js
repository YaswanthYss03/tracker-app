// Batch writer: batching, retry while the database is down, backlog limit.
const test = require('node:test');
const assert = require('node:assert/strict');
const pino = require('pino');
const { BatchWriter } = require('../src/pipeline/batchWriter');

const logger = pino({ level: 'silent' });
const make = (insert, over = {}) => new BatchWriter({ insert, flushMs: 10_000, maxRows: 3, maxBacklog: 10, logger, ...over });

test('writes in batches of maxRows', async () => {
  const batches = [];
  const w = make(async (rows) => batches.push(rows.length));
  for (let i = 0; i < 7; i++) w.add({ i });
  await w.flush();
  assert.deepEqual(batches, [3, 3, 1]);
  assert.equal(w.stats().inserted, 7);
  assert.equal(w.stats().backlog, 0);
});

test('keeps rows and retries after a database error', async () => {
  let fail = true;
  const saved = [];
  const w = make(async (rows) => {
    if (fail) throw new Error('db down');
    saved.push(...rows);
  });
  w.add({ i: 1 });
  w.add({ i: 2 });
  await w.flush();
  assert.equal(w.stats().backlog, 2);
  assert.equal(w.stats().failing, true);

  fail = false;
  await w.flush();
  assert.deepEqual(saved.map((r) => r.i), [1, 2]);
  assert.equal(w.stats().failing, false);
});

test('drops the oldest rows beyond maxBacklog', async () => {
  const w = make(async () => {
    throw new Error('db down');
  }, { maxRows: 100 });
  for (let i = 0; i < 15; i++) w.add({ i });
  assert.equal(w.stats().backlog, 10);
  assert.equal(w.stats().dropped, 5);
  assert.equal(w.queue[0].i, 5);
});

test('stop() writes remaining rows', async () => {
  const saved = [];
  const w = make(async (rows) => saved.push(...rows));
  w.start();
  w.add({ i: 1 });
  await w.stop();
  assert.equal(saved.length, 1);
});
