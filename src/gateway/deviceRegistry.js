/**
 * Which devices are connected right now, and sending commands to them.
 *
 * Request/response matching: every command gets a unique "server flag"
 * number; the device echoes it in its reply, so we know which waiting
 * request to resolve.
 *
 * This lives in memory, so commands only reach devices connected to this
 * process. When running several gateway servers, replace it with a Redis
 * pub/sub version exposing the same functions.
 */
const { buildCommand } = require('../protocol/gt06');

class CommandError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code; // DEVICE_OFFLINE | TIMEOUT | DISCONNECTED
  }
}

class DeviceRegistry {
  constructor() {
    this.sessions = new Map(); // deviceId -> session
    this.nextServerFlag = 1;
  }

  /** Registers a logged-in session; an older connection for the same device is closed. */
  register(session) {
    const old = this.sessions.get(session.deviceId);
    if (old && old !== session) old.socket.destroy();
    this.sessions.set(session.deviceId, session);
  }

  unregister(session) {
    if (session.deviceId && this.sessions.get(session.deviceId) === session) {
      this.sessions.delete(session.deviceId);
    }
    for (const pending of session.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new CommandError('DISCONNECTED', 'Device disconnected before replying'));
    }
    session.pending.clear();
  }

  /** Closes a device's connection (e.g. after suspending it). */
  disconnect(deviceId) {
    const s = this.sessions.get(deviceId);
    if (s) s.socket.destroy();
    return Boolean(s);
  }

  isConnected(deviceId) {
    const s = this.sessions.get(deviceId);
    return Boolean(s && !s.socket.destroyed);
  }

  /** Sends a text command (e.g. "WHERE#") and resolves with the device's reply. */
  sendCommand(deviceId, command, timeoutMs) {
    const session = this.sessions.get(deviceId);
    if (!session || session.socket.destroyed) {
      return Promise.reject(new CommandError('DEVICE_OFFLINE', 'Device is not connected'));
    }

    const serverFlag = this.nextServerFlag;
    this.nextServerFlag = this.nextServerFlag >= 0xffffffff ? 1 : this.nextServerFlag + 1;
    session.outSerial = (session.outSerial + 1) & 0xffff;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        session.pending.delete(serverFlag);
        reject(new CommandError('TIMEOUT', `No reply from device within ${timeoutMs} ms`));
      }, timeoutMs);
      session.pending.set(serverFlag, { resolve, reject, timer });
      session.socket.write(buildCommand(command, serverFlag, session.outSerial));
    });
  }

  /** Called by the gateway when a command reply arrives. Returns true if matched. */
  handleResponse(session, serverFlag, text) {
    let flag = serverFlag;
    let pending = session.pending.get(flag);

    // Some firmware doesn't echo the flag correctly; if exactly one command
    // is waiting on this connection, assume the reply belongs to it.
    if (!pending && session.pending.size === 1) {
      [[flag, pending]] = session.pending.entries();
    }
    if (!pending) return false;

    clearTimeout(pending.timer);
    session.pending.delete(flag);
    pending.resolve(text);
    return true;
  }

  list() {
    return [...this.sessions.values()].map((s) => ({
      deviceId: s.deviceId,
      imei: s.imei,
      remoteAddress: s.remote,
      connectedAt: s.connectedAt,
      lastPacketAt: s.lastPacketAt,
    }));
  }

  get size() {
    return this.sessions.size;
  }
}

module.exports = { DeviceRegistry, CommandError };
