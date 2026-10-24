/**
 * Buffers GPS points and writes them in batches (every `flushMs`, or as soon
 * as `maxRows` are waiting). One INSERT of 500 rows is far cheaper than 500
 * single inserts.
 *
 * If the database is down, rows stay in memory and are retried with
 * increasing delay (up to 30 s). Location packets get no ACK, so the device
 * won't resend them; this buffer is what prevents data loss during short
 * outages. Beyond `maxBacklog` rows, the oldest are dropped and counted.
 */
const MAX_RETRY_DELAY_MS = 30_000;

class BatchWriter {
  constructor({ insert, flushMs, maxRows, maxBacklog, logger }) {
    this.insert = insert;
    this.flushMs = flushMs;
    this.maxRows = maxRows;
    this.maxBacklog = maxBacklog;
    this.logger = logger;

    this.queue = [];
    this.flushing = null; // promise of the flush in progress
    this.timer = null;
    this.stopped = false;
    this.failures = 0;

    this.inserted = 0;
    this.dropped = 0;
    this.lastError = null;
    this.lastFlushAt = null;
  }

  add(row) {
    this.queue.push(row);
    if (!this.flushing) this.trimBacklog();
    if (this.queue.length >= this.maxRows && !this.flushing && this.failures === 0) {
      this.flush();
    }
  }

  start() {
    this.schedule();
  }

  schedule() {
    if (this.stopped) return;
    const delay = this.failures
      ? Math.min(this.flushMs * 2 ** this.failures, MAX_RETRY_DELAY_MS)
      : this.flushMs;
    this.timer = setTimeout(async () => {
      await this.flush();
      this.schedule();
    }, delay);
  }

  /** Writes everything currently queued. Safe to call concurrently. */
  flush() {
    if (this.flushing) return this.flushing;
    if (this.queue.length === 0) return Promise.resolve();

    this.flushing = (async () => {
      while (this.queue.length > 0) {
        const batch = this.queue.slice(0, this.maxRows);
        try {
          await this.insert(batch);
          this.queue.splice(0, batch.length);
          this.inserted += batch.length;
          this.failures = 0;
          this.lastFlushAt = new Date();
        } catch (err) {
          this.failures += 1;
          this.lastError = err.message;
          this.logger.error(
            { err: err.message, backlog: this.queue.length, attempt: this.failures },
            'failed to save positions, will retry'
          );
          break;
        }
      }
    })().finally(() => {
      this.flushing = null;
      this.trimBacklog();
    });
    return this.flushing;
  }

  trimBacklog() {
    const excess = this.queue.length - this.maxBacklog;
    if (excess > 0) {
      this.queue.splice(0, excess);
      this.dropped += excess;
      this.logger.warn({ dropped: excess, totalDropped: this.dropped }, 'position backlog full, dropped oldest points');
    }
  }

  /** Stops the timer and tries (a few times) to write what's left. */
  async stop() {
    this.stopped = true;
    clearTimeout(this.timer);
    for (let attempt = 0; attempt < 3 && this.queue.length > 0; attempt++) {
      await this.flush();
    }
    if (this.queue.length > 0) {
      this.logger.error({ lost: this.queue.length }, 'shutting down with unsaved positions');
    }
  }

  stats() {
    return {
      backlog: this.queue.length,
      inserted: this.inserted,
      dropped: this.dropped,
      failing: this.failures > 0,
      lastError: this.lastError,
      lastFlushAt: this.lastFlushAt,
    };
  }
}

module.exports = { BatchWriter };
