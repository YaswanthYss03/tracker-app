/**
 * GT06 packet framing: finding complete packets in a TCP byte stream,
 * splitting them into parts, and building new frames.
 *
 * Short form (start bits 0x78 0x78):
 *   [0x78 0x78] [len:1] [protocol:1] [info:N] [serial:2] [crc:2] [0x0D 0x0A]
 *   len = 1 (protocol) + N (info) + 2 (serial) + 2 (crc)
 * Long form (start bits 0x79 0x79) is identical except "len" is 2 bytes.
 */
const { crc16Itu } = require('./crc');

/**
 * Pulls every complete, valid packet out of a stream buffer.
 * TCP can split one packet across reads or glue several together, so the
 * leftover bytes are returned for the caller to prepend to the next chunk.
 *
 * @param {Buffer} buffer accumulated bytes
 * @returns {{ packets: Buffer[], rest: Buffer, invalid: number }}
 */
function extractPackets(buffer) {
  const packets = [];
  let invalid = 0;
  let offset = 0;

  while (offset + 5 <= buffer.length) {
    const b0 = buffer[offset];
    const b1 = buffer[offset + 1];
    const isShort = b0 === 0x78 && b1 === 0x78;
    const isLong = b0 === 0x79 && b1 === 0x79;

    if (!isShort && !isLong) {
      // Garbage or a lost frame boundary: skip ahead one byte to resync.
      offset += 1;
      continue;
    }

    const headerLen = isShort ? 3 : 4; // start bits + length field
    const bodyLen = isShort ? buffer[offset + 2] : buffer.readUInt16BE(offset + 2);
    const totalLen = headerLen + bodyLen + 2; // + stop bits 0x0D 0x0A

    if (bodyLen < 5) {
      // Too short to hold protocol + serial + crc; not a real frame.
      offset += 1;
      continue;
    }
    if (offset + totalLen > buffer.length) break; // wait for more data

    const frame = buffer.subarray(offset, offset + totalLen);
    if (frame[totalLen - 2] !== 0x0d || frame[totalLen - 1] !== 0x0a) {
      offset += 1;
      continue;
    }

    // CRC covers [length field .. serial].
    const crcExpected = frame.readUInt16BE(totalLen - 4);
    const crcActual = crc16Itu(frame, 2, totalLen - 4);
    if (crcExpected !== crcActual) {
      invalid += 1;
      offset += 1;
      continue;
    }

    packets.push(Buffer.from(frame));
    offset += totalLen;
  }

  return { packets, rest: Buffer.from(buffer.subarray(offset)), invalid };
}

/** Splits a validated frame into protocol number, info payload and serial. */
function decodeFrame(frame) {
  const isShort = frame[0] === 0x78;
  const headerLen = isShort ? 3 : 4;
  const protocol = frame[headerLen];
  const infoStart = headerLen + 1;
  const infoEnd = frame.length - 6; // serial(2) + crc(2) + stop(2)
  return {
    protocol,
    info: frame.subarray(infoStart, infoEnd),
    serial: frame.readUInt16BE(infoEnd),
  };
}

/**
 * Builds a complete frame. Uses the long (0x79 0x79) form automatically
 * when the body doesn't fit in one length byte, or when `long` is set.
 */
function buildPacket(protocol, info, serial, { long = false } = {}) {
  const bodyLen = 1 + info.length + 2 + 2;
  const useLong = long || bodyLen > 0xff;
  const headerLen = useLong ? 4 : 3;
  const buf = Buffer.alloc(headerLen + bodyLen + 2);

  buf[0] = useLong ? 0x79 : 0x78;
  buf[1] = useLong ? 0x79 : 0x78;
  if (useLong) buf.writeUInt16BE(bodyLen, 2);
  else buf[2] = bodyLen;

  buf[headerLen] = protocol;
  info.copy(buf, headerLen + 1);
  const serialPos = headerLen + 1 + info.length;
  buf.writeUInt16BE(serial & 0xffff, serialPos);
  buf.writeUInt16BE(crc16Itu(buf, 2, serialPos + 2), serialPos + 2);
  buf[buf.length - 2] = 0x0d;
  buf[buf.length - 1] = 0x0a;
  return buf;
}

module.exports = { extractPackets, decodeFrame, buildPacket };
