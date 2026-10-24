/**
 * CRC-ITU (a.k.a. CRC-16/X-25) as used by the GT06 protocol.
 * Reflected polynomial 0x8408, initial value 0xFFFF, final XOR 0xFFFF.
 * It is computed over the bytes from "packet length" up to and including
 * "serial number" (i.e. everything between the start bits and the CRC).
 */
function crc16Itu(buf, start = 0, end = buf.length) {
  let crc = 0xffff;
  for (let i = start; i < end; i++) {
    crc ^= buf[i];
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0x8408 : crc >>> 1;
    }
  }
  return ~crc & 0xffff;
}

module.exports = { crc16Itu };
