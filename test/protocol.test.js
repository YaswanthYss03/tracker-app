// GT06 protocol: framing, parsers and builders.
// Login packet + ACK and the location payload come from the official GT06 protocol document.
const test = require('node:test');
const assert = require('node:assert/strict');
const gt06 = require('../src/protocol/gt06');

const hex = (s) => Buffer.from(s.replace(/\s+/g, ''), 'hex');
const DOC_LOCATION_INFO = hex('0B 08 1D 11 2E 10 CC 02 7A C7 EB 0C 46 58 49 00 14 8F 01 CC 00 28 7D 00 1F B8');
const LOGIN = hex('78 78 0D 01 01 23 45 67 89 01 23 45 00 01 8C DD 0D 0A');

function roundTrip(frame) {
  const { packets } = gt06.extractPackets(frame);
  assert.equal(packets.length, 1, 'frame should be valid');
  return gt06.decodeFrame(packets[0]);
}

test('login: parses documented packet and builds the documented ACK', () => {
  const { protocol, info, serial } = roundTrip(LOGIN);
  assert.equal(protocol, 0x01);
  assert.equal(serial, 1);
  assert.deepEqual(gt06.parsePacket(protocol, info), { type: 'login', imei: '123456789012345' });
  assert.deepEqual(gt06.buildAck(0x01, serial), hex('78 78 05 01 00 01 D9 DC 0D 0A'));
});

test('login: reads timezone word on newer firmware (GMT+5:30)', () => {
  const info = Buffer.concat([hex('0123456789012345'), hex('3600'), Buffer.from([0x21, 0x20])]); // 530 << 4
  const msg = gt06.parseLogin(info);
  assert.equal(msg.timezoneOffsetMin, 330);
});

test('login: rejects malformed terminal IDs', () => {
  assert.throws(() => gt06.parseLogin(hex('0123')), gt06.ParseError);
  assert.throws(() => gt06.parseLogin(hex('0A0B0C0D0E0F0A0B')), gt06.ParseError);
});

test('location 0x12: documented payload to decimal degrees', () => {
  const { protocol, info } = roundTrip(gt06.buildPacket(0x12, DOC_LOCATION_INFO, 3));
  const msg = gt06.parsePacket(protocol, info);
  assert.equal(msg.type, 'location');
  assert.equal(msg.point.gpsTime.toISOString(), '2011-08-29T17:46:16.000Z');
  assert.equal(msg.point.lat, 23.111668);
  assert.equal(msg.point.lon, 114.409285);
  assert.equal(msg.point.speed, 0);
  assert.equal(msg.point.course, 143);
  assert.equal(msg.point.satellites, 12);
  assert.equal(msg.point.valid, true);
  assert.deepEqual(msg.lbs, { mcc: 460, mnc: 0, lac: 0x287d, cellId: 0x001fb8 });
  assert.equal(msg.acc, undefined);
  assert.equal(msg.reupload, false);
});

test('location 0x22: reads ACC, upload mode, re-upload flag and mileage', () => {
  const info = Buffer.concat([DOC_LOCATION_INFO, hex('01 00 01'), hex('00 00 30 39')]);
  const msg = gt06.parsePacket(0x22, info);
  assert.equal(msg.acc, true);
  assert.equal(msg.uploadMode, 0);
  assert.equal(msg.reupload, true);
  assert.equal(msg.mileage, 12345);
});

test('location: south/west hemispheres give negative coordinates', () => {
  const info = Buffer.from(DOC_LOCATION_INFO);
  info.writeUInt16BE(0x1800 | 90, 16); // fix + west, south (north bit clear)
  const { point } = gt06.parsePacket(0x12, info);
  assert.ok(point.lat < 0 && point.lon < 0);
  assert.equal(point.course, 90);
});

test('location: too-short payload throws ParseError', () => {
  assert.throws(() => gt06.parsePacket(0x12, hex('0B08')), gt06.ParseError);
});

test('heartbeat 0x13: terminal info, battery, signal, alarm', () => {
  // ACC on + charging + GPS tracking, voltage 5, GSM 4, no alarm, English
  const msg = gt06.parsePacket(0x13, Buffer.from([0x46, 5, 4, 0x00, 0x02]));
  assert.equal(msg.type, 'heartbeat');
  assert.deepEqual(msg.status, {
    armed: false, acc: true, charging: true, alarm: null, gpsTracking: true, relayCut: false,
  });
  assert.equal(msg.batteryLevel, 5);
  assert.equal(msg.gsmSignal, 4);
  assert.equal(msg.alarm, null);

  // power-cut bits (010) set, ACC off, not charging
  const cut = gt06.parsePacket(0x13, Buffer.from([0b0101_0000, 3, 2]));
  assert.equal(cut.status.alarm, 'power_cut');
  assert.equal(cut.status.acc, false);
  assert.equal(cut.status.charging, false);
});

test('alarm 0x16: GPS + LBS + status + alarm type', () => {
  const info = Buffer.concat([
    DOC_LOCATION_INFO.subarray(0, 18),
    hex('09'), DOC_LOCATION_INFO.subarray(18, 26), // LBS length + LBS
    Buffer.from([0x42, 4, 3, 0x01, 0x02]), // ACC on, GPS tracking · voltage 4 · GSM 3 · SOS · English
  ]);
  const msg = gt06.parsePacket(0x16, info);
  assert.equal(msg.type, 'alarm');
  assert.equal(msg.alarm, 'sos');
  assert.equal(msg.acc, true);
  assert.equal(msg.batteryLevel, 4);
  assert.equal(msg.gsmSignal, 3);
  assert.equal(msg.point.lat, 23.111668);
  assert.equal(msg.lbs.mcc, 460);
});

test('alarm: unknown codes are reported, not dropped', () => {
  const info = Buffer.concat([DOC_LOCATION_INFO.subarray(0, 18), hex('09'), DOC_LOCATION_INFO.subarray(18, 26), Buffer.from([0, 4, 3, 0x7e, 0x02])]);
  assert.equal(gt06.parsePacket(0x26, info).alarm, 'unknown_0x7e');
});

test('time request 0x8A: reply carries current UTC time', () => {
  assert.deepEqual(gt06.parsePacket(0x8a, Buffer.alloc(0)), { type: 'timeRequest' });
  const reply = gt06.buildTimeResponse(9, new Date('2026-10-22T08:30:15Z'));
  const { protocol, info, serial } = roundTrip(reply);
  assert.equal(protocol, 0x8a);
  assert.equal(serial, 9);
  assert.deepEqual([...info], [26, 10, 22, 8, 30, 15]);
});

test('commands: 0x80 build and 0x15 / 0x21 replies', () => {
  const { protocol, info, serial } = roundTrip(gt06.buildCommand('WHERE#', 0x01020304, 7));
  assert.equal(protocol, 0x80);
  assert.equal(serial, 7);
  assert.equal(info[0], 10);
  assert.equal(info.readUInt32BE(1), 0x01020304);
  assert.equal(info.subarray(5).toString('ascii'), 'WHERE#');

  const text = Buffer.from('Lat:N23.111668,Lon:E114.409285');
  const r15 = Buffer.concat([Buffer.from([4 + text.length]), hex('0000002A'), text, hex('0002')]);
  assert.deepEqual(gt06.parsePacket(0x15, r15), { type: 'commandReply', serverFlag: 42, text: text.toString() });

  const r21 = Buffer.concat([hex('0000002B01'), Buffer.from('RELAY:OK')]);
  assert.deepEqual(gt06.parsePacket(0x21, r21), { type: 'commandReply', serverFlag: 43, text: 'RELAY:OK' });
});

test('unknown protocol numbers are returned as type unknown', () => {
  assert.deepEqual(gt06.parsePacket(0x94, hex('00 01')), { type: 'unknown', protocol: 0x94 });
});

test('framing: split, concatenated and noisy streams', () => {
  const location = gt06.buildPacket(0x12, DOC_LOCATION_INFO, 3);
  const stream = Buffer.concat([hex('00 FF'), LOGIN, location]);
  const cut = 2 + LOGIN.length + 10;

  const first = gt06.extractPackets(stream.subarray(0, cut));
  assert.equal(first.packets.length, 1);
  const second = gt06.extractPackets(Buffer.concat([first.rest, stream.subarray(cut)]));
  assert.equal(second.packets.length, 1);
  assert.equal(second.rest.length, 0);
});

test('framing: bad CRC is rejected and counted', () => {
  const bad = Buffer.from(LOGIN);
  bad[5] ^= 0xff;
  const { packets, invalid } = gt06.extractPackets(bad);
  assert.equal(packets.length, 0);
  assert.equal(invalid, 1);
});

test('framing: long (0x79 0x79) frames build and parse', () => {
  const info = Buffer.alloc(300, 0xab);
  const frame = gt06.buildPacket(0x94, info, 5);
  assert.equal(frame[0], 0x79);
  const decoded = roundTrip(frame);
  assert.equal(decoded.protocol, 0x94);
  assert.equal(decoded.info.length, 300);
  assert.equal(decoded.serial, 5);
});
