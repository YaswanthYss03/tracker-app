#!/usr/bin/env node
/**
 * Fake GT06N trackers for testing without hardware.
 *
 *   npm run simulate                                   # 1 device, localhost:5023
 *   npm run simulate -- --devices 50 --interval 10     # 50 devices (IMEIs base+0..49)
 *   npm run simulate -- --alarms --reupload --jump     # extra scenarios
 *   npm run simulate -- --host 1.2.3.4 --imei 359710049095095
 *
 * Each device: logs in, asks for the time (0x8A), then loops:
 *   drive (ignition on, moving)  ->  park (ignition off, GPS jitter)  -> ...
 * sending 0x22 locations every --interval seconds and heartbeats (0x13) with
 * ignition/battery/signal every 15 s. Answers server commands (0x80) like a
 * real device (WHERE# returns the position).
 *
 * Options:
 *   --alarms     send an alarm packet (power cut / SOS / vibration) every ~45 s
 *   --reupload   after login, send 10 old "buffered" points (re-upload flag set)
 *   --jump       once, send a GPS glitch 500 km away (should be dropped)
 *   --duration   stop after N seconds (0 = run until Ctrl+C)
 *   --quiet      only print a summary line every 10 s
 *
 * Devices must be registered first: npm run admin -- add <IMEI>
 * (or for many: npm run admin -- add-range <firstIMEI> <count>)
 */
const net = require('net');
const { parseArgs } = require('util');
const { buildPacket, extractPackets, decodeFrame, PROTOCOL } = require('../src/protocol/gt06');

const { values: opt } = parseArgs({
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '5023' },
    imei: { type: 'string', default: '359710049095095' },
    devices: { type: 'string', default: '1' },
    interval: { type: 'string', default: '5' },
    duration: { type: 'string', default: '0' },
    alarms: { type: 'boolean', default: false },
    reupload: { type: 'boolean', default: false },
    jump: { type: 'boolean', default: false },
    quiet: { type: 'boolean', default: false },
  },
});

const PORT = Number(opt.port);
const COUNT = Number(opt.devices);
const INTERVAL_MS = Number(opt.interval) * 1000;
const DRIVE_POINTS = 24; // points per driving phase
const PARK_POINTS = 12; // points per parked phase
const ALARMS = ['power_cut', 'sos', 'vibration'];
const ALARM_CODES = { sos: 0x01, power_cut: 0x02, vibration: 0x03 };

const totals = { connected: 0, sent: 0, closed: 0 };

// ---------- packet encoding ----------

function gpsBlock({ time, lat, lon, speed, course, valid = true, satellites = 9 }) {
  const b = Buffer.alloc(18);
  b.writeUInt8(time.getUTCFullYear() - 2000, 0);
  b.writeUInt8(time.getUTCMonth() + 1, 1);
  b.writeUInt8(time.getUTCDate(), 2);
  b.writeUInt8(time.getUTCHours(), 3);
  b.writeUInt8(time.getUTCMinutes(), 4);
  b.writeUInt8(time.getUTCSeconds(), 5);
  b.writeUInt8(0xc0 | satellites, 6);
  b.writeUInt32BE(Math.round(Math.abs(lat) * 1_800_000), 7);
  b.writeUInt32BE(Math.round(Math.abs(lon) * 1_800_000), 11);
  b.writeUInt8(Math.min(255, Math.round(speed)), 15);
  const status = (valid ? 0x1000 : 0) | (lat >= 0 ? 0x0400 : 0) | (lon < 0 ? 0x0800 : 0) | (course & 0x3ff);
  b.writeUInt16BE(status, 16);
  return b;
}

const LBS = Buffer.from([0x01, 0x94, 0x31, 0x12, 0x34, 0x00, 0xab, 0xcd]); // MCC 404, MNC 49 (Airtel)

function terminalByte({ acc, charging = true, alarm = null }) {
  const alarmBits = { vibration: 0b001, power_cut: 0b010, low_battery: 0b011, sos: 0b100 }[alarm] || 0;
  return (acc ? 0x02 : 0) | (charging ? 0x04 : 0) | (alarmBits << 3) | 0x40;
}

class FakeDevice {
  constructor(imei, index) {
    this.imei = imei;
    this.serial = 1;
    // Spread devices around Bengaluru
    this.lat = 12.9716 + (index % 10) * 0.01;
    this.lon = 77.5946 + Math.floor(index / 10) * 0.01;
    this.course = (index * 37) % 360;
    this.step = 0;
    this.acc = true;
    this.inbox = Buffer.alloc(0);
    this.timers = [];
  }

  log(...args) {
    if (!opt.quiet) console.log(`[${this.imei}]`, ...args);
  }

  send(protocol, info) {
    if (this.socket.destroyed) return;
    this.socket.write(buildPacket(protocol, info, this.serial++));
    totals.sent += 1;
  }

  login() {
    this.send(PROTOCOL.LOGIN, Buffer.from(this.imei.padStart(16, '0'), 'hex'));
  }

  location({ time, lat = this.lat, lon = this.lon, speed, acc = this.acc, reupload = false } = {}) {
    if (!time) {
      // GPS time has 1-second resolution: keep live points strictly increasing.
      const t = Math.max(Math.floor(Date.now() / 1000) * 1000, (this.lastLiveTime || 0) + 1000);
      this.lastLiveTime = t;
      time = new Date(t);
    }
    const info = Buffer.concat([
      gpsBlock({ time, lat, lon, speed: speed ?? (acc ? 40 : 0), course: this.course }),
      LBS,
      Buffer.from([acc ? 1 : 0, 0x00, reupload ? 1 : 0]),
    ]);
    this.send(PROTOCOL.LOCATION_GT06N, info);
  }

  heartbeat(alarm = null) {
    this.send(PROTOCOL.HEARTBEAT, Buffer.from([terminalByte({ acc: this.acc, alarm }), 5, 4, 0x00, 0x02]));
  }

  alarm(type) {
    const info = Buffer.concat([
      gpsBlock({ time: new Date(), lat: this.lat, lon: this.lon, speed: this.acc ? 40 : 0, course: this.course }),
      Buffer.from([0x09]),
      LBS,
      Buffer.from([terminalByte({ acc: this.acc, charging: type !== 'power_cut', alarm: type }), 4, 4, ALARM_CODES[type], 0x02]),
    ]);
    this.send(PROTOCOL.ALARM, info);
    this.log(`alarm sent: ${type}`);
  }

  // One step of the drive/park cycle.
  tick() {
    const phase = this.step % (DRIVE_POINTS + PARK_POINTS);
    const driving = phase < DRIVE_POINTS;
    if (driving !== this.acc) {
      this.acc = driving;
      this.log(driving ? 'ignition ON, driving' : 'ignition OFF, parked');
    }
    if (driving) {
      // ~40 km/h, gently curving
      const metersPerTick = (40 / 3.6) * (INTERVAL_MS / 1000);
      this.course = (this.course + 5) % 360;
      const rad = (this.course * Math.PI) / 180;
      this.lat += (metersPerTick * Math.cos(rad)) / 111_320;
      this.lon += (metersPerTick * Math.sin(rad)) / (111_320 * Math.cos((this.lat * Math.PI) / 180));
      this.location({ speed: 40 });
    } else {
      // Parked: GPS jitter of a few meters
      const jitter = () => (Math.random() - 0.5) * 0.00006;
      this.location({ lat: this.lat + jitter(), lon: this.lon + jitter(), speed: 0, acc: false });
    }
    this.step += 1;
  }

  sendReuploadBatch() {
    this.log('sending 10 buffered (re-uploaded) points from 20 minutes ago');
    const start = Date.now() - 20 * 60_000;
    for (let i = 0; i < 10; i++) {
      this.location({
        time: new Date(start + i * 30_000),
        lat: this.lat - 0.01 + i * 0.001,
        lon: this.lon - 0.01,
        speed: 35,
        acc: true,
        reupload: true,
      });
    }
  }

  handleServerPacket(frame) {
    const { protocol, info } = decodeFrame(frame);
    if (protocol === PROTOCOL.LOGIN) {
      this.log('login accepted');
      return this.onLoggedIn();
    }
    if (protocol === PROTOCOL.TIME_REQUEST) {
      const t = new Date(Date.UTC(2000 + info[0], info[1] - 1, info[2], info[3], info[4], info[5]));
      return this.log(`server time: ${t.toISOString()}`);
    }
    if (protocol === PROTOCOL.COMMAND) {
      const serverFlag = info.readUInt32BE(1);
      const command = info.subarray(5, 1 + info[0]).toString('ascii');
      this.log(`command received: ${command}`);
      const text = command.toUpperCase().startsWith('WHERE')
        ? `Lat:N${this.lat.toFixed(6)},Lon:E${this.lon.toFixed(6)},Course:${this.course}.00,Speed:${this.acc ? 40 : 0}.00,DateTime:${new Date().toISOString().slice(0, 19).replace('T', ' ')}`
        : `${command.replace(/#$/, '')}:OK`;
      const content = Buffer.from(text, 'ascii');
      const reply = Buffer.alloc(1 + 4 + content.length + 2);
      reply[0] = 4 + content.length;
      reply.writeUInt32BE(serverFlag, 1);
      content.copy(reply, 5);
      reply.writeUInt16BE(0x0002, 5 + content.length);
      return this.send(PROTOCOL.COMMAND_RESPONSE, reply);
    }
    // heartbeat/alarm ACKs: nothing to do
  }

  onLoggedIn() {
    totals.connected += 1;
    this.send(PROTOCOL.TIME_REQUEST, Buffer.alloc(0));
    this.heartbeat();
    this.tick();

    if (opt.reupload) setTimeout(() => this.sendReuploadBatch(), 1500);
    if (opt.jump) {
      setTimeout(() => {
        this.log('sending GPS glitch 500 km away (should be dropped)');
        this.location({ lat: this.lat + 4.5, lon: this.lon, speed: 40 });
      }, INTERVAL_MS * 2 + 500);
    }

    // Stagger devices so they don't all send at the same instant.
    const offset = Math.random() * INTERVAL_MS;
    setTimeout(() => this.timers.push(setInterval(() => this.tick(), INTERVAL_MS)), offset);
    this.timers.push(setInterval(() => this.heartbeat(), 15_000));
    if (opt.alarms) {
      let n = 0;
      this.timers.push(setInterval(() => this.alarm(ALARMS[n++ % ALARMS.length]), 45_000));
    }
  }

  connect() {
    this.socket = net.connect(PORT, opt.host, () => {
      this.log(`connected to ${opt.host}:${PORT}`);
      this.login();
    });
    this.socket.on('data', (data) => {
      this.inbox = Buffer.concat([this.inbox, data]);
      const { packets, rest } = extractPackets(this.inbox);
      this.inbox = rest;
      packets.forEach((f) => this.handleServerPacket(f));
    });
    this.socket.on('close', () => {
      totals.closed += 1;
      this.timers.forEach(clearInterval);
      this.log('connection closed by server');
    });
    this.socket.on('error', (err) => this.log(`error: ${err.message}`));
  }

  stop() {
    this.timers.forEach(clearInterval);
    this.socket.end();
  }
}

// ---------- start ----------

const devices = [];
for (let i = 0; i < COUNT; i++) {
  const imei = (BigInt(opt.imei) + BigInt(i)).toString().padStart(15, '0');
  const d = new FakeDevice(imei, i);
  devices.push(d);
  // Ramp up connections (20 per 100 ms) instead of all at once.
  setTimeout(() => d.connect(), Math.floor(i / 20) * 100);
}

if (opt.quiet || COUNT > 1) {
  setInterval(() => {
    console.log(`devices logged in: ${totals.connected}/${COUNT}, packets sent: ${totals.sent}, closed: ${totals.closed}`);
  }, 10_000);
}

function stopAll() {
  devices.forEach((d) => d.stop());
  setTimeout(() => process.exit(0), 300);
}
process.on('SIGINT', stopAll);
if (Number(opt.duration) > 0) setTimeout(stopAll, Number(opt.duration) * 1000);
