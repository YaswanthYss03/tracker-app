/**
 * Turns a packet's protocol number + info bytes into a plain message object.
 *
 *   parsePacket(0x01, info) -> { type: 'login', imei, ... }
 *
 * Message types: login, location, heartbeat, alarm, commandReply,
 * timeRequest, unknown. Field layouts follow the GT06 / GT06N protocol docs;
 * optional trailing fields are only read when present, because firmware
 * versions differ.
 */
const { PROTOCOL, ALARM_TYPES, TERMINAL_ALARM_BITS } = require('./constants');

class ParseError extends Error {}

/**
 * Login (0x01): 8-byte BCD terminal ID (IMEI with a leading 0), then on newer
 * firmware a 2-byte type ID and a 2-byte timezone/language word.
 */
function parseLogin(info) {
  if (info.length < 8) throw new ParseError(`login payload too short (${info.length} bytes)`);
  const imei = info.subarray(0, 8).toString('hex').replace(/^0+/, '');
  if (!/^\d{15,16}$/.test(imei)) throw new ParseError(`invalid terminal ID ${imei}`);

  const msg = { type: 'login', imei };
  if (info.length >= 12) {
    // Bits 15-4: timezone as hours*100 + minutes (e.g. 530 = 5:30); bit 3: 1 = west.
    const word = info.readUInt16BE(10);
    const value = word >> 4;
    const minutes = Math.floor(value / 100) * 60 + (value % 100);
    msg.timezoneOffsetMin = word & 0x08 ? -minutes : minutes;
  }
  return msg;
}

/**
 * GPS block shared by 0x12, 0x16, 0x22 and 0x26 (first 18 bytes of info):
 *   date/time  6 bytes  YY MM DD HH mm ss (UTC when the device is set to GMT)
 *   gps info   1 byte   low nibble = satellites
 *   latitude   4 bytes  degrees * 1,800,000
 *   longitude  4 bytes  degrees * 1,800,000
 *   speed      1 byte   km/h
 *   course     2 bytes  bits 0-9 heading + status flags
 */
function parseGpsBlock(info) {
  if (info.length < 18) throw new ParseError(`GPS block too short (${info.length} bytes)`);

  const gpsTime = new Date(Date.UTC(2000 + info[0], info[1] - 1, info[2], info[3], info[4], info[5]));
  if (Number.isNaN(gpsTime.getTime())) throw new ParseError('invalid GPS date');

  const courseStatus = info.readUInt16BE(16);
  // 0x1000: fix valid · 0x0800: west · 0x0400: north · bits 0-9: course
  let lat = info.readUInt32BE(7) / 1_800_000;
  let lon = info.readUInt32BE(11) / 1_800_000;
  if (!(courseStatus & 0x0400)) lat = -lat;
  if (courseStatus & 0x0800) lon = -lon;

  return {
    gpsTime,
    lat: round6(lat),
    lon: round6(lon),
    speed: info[15],
    course: courseStatus & 0x03ff,
    satellites: info[6] & 0x0f,
    valid: Boolean(courseStatus & 0x1000),
  };
}

/** Cell tower block: MCC(2) MNC(1) LAC(2) CellID(3). */
function parseLbs(info, offset) {
  if (info.length < offset + 8) return undefined;
  return {
    mcc: info.readUInt16BE(offset),
    mnc: info[offset + 2],
    lac: info.readUInt16BE(offset + 3),
    cellId: info.readUIntBE(offset + 5, 3),
  };
}

/**
 * Terminal information byte (heartbeat and alarm packets):
 *   bit 0: armed · bit 1: ACC (ignition) on · bit 2: charging (external power)
 *   bits 3-5: alarm (SOS / low battery / power cut / vibration)
 *   bit 6: GPS tracking on · bit 7: oil/electricity cut (relay)
 */
function parseTerminalInfo(byte) {
  return {
    armed: Boolean(byte & 0x01),
    acc: Boolean(byte & 0x02),
    charging: Boolean(byte & 0x04),
    alarm: TERMINAL_ALARM_BITS[(byte >> 3) & 0x07] ?? null,
    gpsTracking: Boolean(byte & 0x40),
    relayCut: Boolean(byte & 0x80),
  };
}

function alarmName(code) {
  if (code in ALARM_TYPES) return ALARM_TYPES[code];
  return `unknown_0x${code.toString(16).padStart(2, '0')}`;
}

/** Location 0x12 (GPS + LBS) and 0x22 (adds ACC, upload mode, re-upload flag). */
function parseLocation(protocol, info) {
  const msg = {
    type: 'location',
    protocol,
    point: parseGpsBlock(info),
    lbs: parseLbs(info, 18),
    acc: undefined, // 0x12 doesn't carry ACC; the latest heartbeat value is used instead
    reupload: false,
  };

  if (protocol === PROTOCOL.LOCATION_GT06N && info.length >= 29) {
    msg.acc = info[26] === 0x01;
    msg.uploadMode = info[27];
    // 0x00 = real-time, 0x01 = re-uploaded (buffered while the device had no network)
    msg.reupload = info[28] === 0x01;
    if (info.length >= 33) msg.mileage = info.readUInt32BE(29);
  }
  return msg;
}

/**
 * Heartbeat 0x13: terminal info(1) voltage level(1) GSM signal(1) alarm/language(2).
 * Voltage level 0-6 (0 = no power, 6 = full); GSM signal 0-4.
 */
function parseHeartbeat(info) {
  if (info.length < 1) throw new ParseError('empty heartbeat');
  const msg = { type: 'heartbeat', status: parseTerminalInfo(info[0]) };
  if (info.length >= 2) msg.batteryLevel = info[1];
  if (info.length >= 3) msg.gsmSignal = info[2];
  if (info.length >= 4) msg.alarm = alarmName(info[3]);
  return msg;
}

/**
 * Alarm 0x16 / 0x26: GPS block(18), LBS length(1) + LBS(8), terminal info(1),
 * voltage(1), GSM(1), alarm type(1), language(1).
 */
function parseAlarm(protocol, info) {
  const point = parseGpsBlock(info);
  let lbsLen = info[18];
  if (!lbsLen || 18 + lbsLen > info.length) lbsLen = 9; // fall back to the documented size
  const s = 18 + lbsLen; // start of the status block

  const msg = { type: 'alarm', protocol, point, lbs: parseLbs(info, 19), reupload: false };
  if (info.length >= s + 1) msg.status = parseTerminalInfo(info[s]);
  if (info.length >= s + 2) msg.batteryLevel = info[s + 1];
  if (info.length >= s + 3) msg.gsmSignal = info[s + 2];
  if (info.length >= s + 4) {
    msg.alarmCode = info[s + 3];
    msg.alarm = alarmName(info[s + 3]);
  } else {
    msg.alarm = msg.status?.alarm ?? null;
  }
  msg.acc = msg.status?.acc;
  return msg;
}

/**
 * Command reply:
 *   0x15: [length:1] [server flag:4] [text ASCII] [language:2, optional]
 *   0x21: [server flag:4] [encoding:1, 1=ASCII 2=UTF-16BE] [text]
 */
function parseCommandReply(protocol, info) {
  if (info.length < 5) throw new ParseError('command reply too short');
  let serverFlag;
  let text;

  if (protocol === PROTOCOL.COMMAND_RESPONSE) {
    const end = Math.min(1 + info[0], info.length);
    serverFlag = info.readUInt32BE(1);
    text = info.subarray(5, end).toString('ascii');
  } else {
    serverFlag = info.readUInt32BE(0);
    const content = Buffer.from(info.subarray(5));
    text =
      info[4] === 2 && content.length % 2 === 0
        ? content.swap16().toString('utf16le')
        : content.toString('ascii');
  }
  return { type: 'commandReply', serverFlag, text: text.replace(/\0+$/, '').trim() };
}

/** Dispatches on protocol number. Throws ParseError for malformed payloads. */
function parsePacket(protocol, info) {
  switch (protocol) {
    case PROTOCOL.LOGIN:
      return parseLogin(info);
    case PROTOCOL.LOCATION:
    case PROTOCOL.LOCATION_GT06N:
      return parseLocation(protocol, info);
    case PROTOCOL.HEARTBEAT:
      return parseHeartbeat(info);
    case PROTOCOL.ALARM:
    case PROTOCOL.ALARM_GT06N:
      return parseAlarm(protocol, info);
    case PROTOCOL.COMMAND_RESPONSE:
    case PROTOCOL.COMMAND_RESPONSE_GT06N:
      return parseCommandReply(protocol, info);
    case PROTOCOL.TIME_REQUEST:
      return { type: 'timeRequest' };
    default:
      return { type: 'unknown', protocol };
  }
}

function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}

module.exports = {
  ParseError,
  parsePacket,
  parseLogin,
  parseGpsBlock,
  parseLocation,
  parseHeartbeat,
  parseAlarm,
  parseCommandReply,
  parseTerminalInfo,
};
