// GT06 / GT06N protocol numbers and status codes.

const PROTOCOL = {
  LOGIN: 0x01,
  LOCATION: 0x12, // GPS + LBS
  HEARTBEAT: 0x13, // status information
  COMMAND_RESPONSE: 0x15, // device's text reply to a server command
  ALARM: 0x16, // GPS + LBS + status (alarm)
  COMMAND_RESPONSE_GT06N: 0x21, // newer firmware's reply format
  LOCATION_GT06N: 0x22, // GPS + LBS + ACC + re-upload flag
  ALARM_GT06N: 0x26,
  COMMAND: 0x80, // server -> device text command (e.g. "WHERE#")
  TIME_REQUEST: 0x8a, // device asks the server for the current time
  INFO_TRANSMISSION: 0x94, // misc info (external voltage etc.), logged only
};

// Packets the device expects us to acknowledge with the standard 5-byte reply.
// Without the login and heartbeat ACKs the tracker drops the connection.
const NEEDS_ACK = new Set([
  PROTOCOL.LOGIN,
  PROTOCOL.HEARTBEAT,
  PROTOCOL.ALARM,
  PROTOCOL.ALARM_GT06N,
]);

// Alarm type byte in heartbeat (0x13) and alarm (0x16/0x26) packets.
// Codes beyond the documented ones vary by firmware; unknown codes are
// reported as "unknown_0xNN" so they show up in logs.
const ALARM_TYPES = {
  0x00: null, // normal, no alarm
  0x01: 'sos',
  0x02: 'power_cut',
  0x03: 'vibration',
  0x04: 'geofence_enter',
  0x05: 'geofence_exit',
  0x06: 'overspeed',
  0x09: 'vibration',
  0x0e: 'low_battery',
  0x0f: 'low_battery',
  0x11: 'power_off',
  0x19: 'low_battery',
};

// Alarm bits (3-5) inside the heartbeat terminal-info byte.
const TERMINAL_ALARM_BITS = {
  0b000: null,
  0b001: 'vibration',
  0b010: 'power_cut',
  0b011: 'low_battery',
  0b100: 'sos',
};

module.exports = { PROTOCOL, NEEDS_ACK, ALARM_TYPES, TERMINAL_ALARM_BITS };
