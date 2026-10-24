// Packets the server sends to the device.
const { PROTOCOL } = require('./constants');
const { buildPacket } = require('./framing');

/**
 * Standard acknowledgement: 78 78 05 [protocol] [serial:2] [crc:2] 0D 0A
 * Used for login, heartbeat and alarm packets.
 */
function buildAck(protocol, serial) {
  return buildPacket(protocol, Buffer.alloc(0), serial);
}

/**
 * Online command (0x80) carrying SMS-style text such as "WHERE#".
 *   info = [cmd length:1] [server flag:4] [command ASCII]
 * The device echoes the server flag in its reply, which is how replies are
 * matched to commands.
 */
function buildCommand(command, serverFlag, serial) {
  const content = Buffer.from(command, 'ascii');
  const info = Buffer.alloc(1 + 4 + content.length);
  info[0] = 4 + content.length;
  info.writeUInt32BE(serverFlag >>> 0, 1);
  content.copy(info, 5);
  return buildPacket(PROTOCOL.COMMAND, info, serial);
}

/** Reply to a time request (0x8A): current UTC time as YY MM DD HH mm ss. */
function buildTimeResponse(serial, now = new Date()) {
  const info = Buffer.from([
    now.getUTCFullYear() - 2000,
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  ]);
  return buildPacket(PROTOCOL.TIME_REQUEST, info, serial);
}

module.exports = { buildAck, buildCommand, buildTimeResponse };
