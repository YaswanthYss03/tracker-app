/**
 * Sends a text command to a connected tracker, waits for its reply and
 * records both in the audit log (commands_log).
 *
 * Customers can only send the allow-listed commands below; admins can send
 * any text. Engine cut-off (RELAY) is deliberately not offered to customers.
 */
const commandsRepo = require('../db/repositories/commands');
const { CommandError } = require('../gateway/deviceRegistry');
const { AppError } = require('../lib/errors');

const COMMAND_ERRORS = {
  DEVICE_OFFLINE: [409, 'Tracker is not connected right now'],
  DISCONNECTED: [502, 'Tracker disconnected before replying'],
  TIMEOUT: [504, 'No reply from the tracker'],
};

/** Customer command types -> GT06N SMS-style text. */
const CUSTOMER_COMMANDS = {
  locate: () => 'WHERE#',
  status: () => 'STATUS#',
  setInterval: ({ seconds }) => `TIMER,${seconds}#`,
  reboot: () => 'RESET#',
};

async function runCommand({ registry, deviceId, userId = null, command, timeoutMs }) {
  const log = await commandsRepo.logSent({ deviceId, userId, command });
  const sentAt = new Date();
  try {
    const response = await registry.sendCommand(deviceId, command, timeoutMs);
    await commandsRepo.logResult(log.id, { status: 'replied', response });
    return { command, response, sentAt, respondedAt: new Date() };
  } catch (err) {
    if (!(err instanceof CommandError)) throw err;
    await commandsRepo.logResult(log.id, { status: err.code === 'TIMEOUT' ? 'timeout' : 'failed' });
    const [status, message] = COMMAND_ERRORS[err.code] || [500, err.message];
    throw new AppError(status, err.code, message);
  }
}

module.exports = { runCommand, CUSTOMER_COMMANDS };
