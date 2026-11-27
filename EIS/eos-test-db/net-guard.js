// Preloaded into the local backend: refuses every connection that leaves this machine.
const net = require('node:net');
// NET_GUARD_ALLOW: a comma-separated list of the only outside hosts that may be reached.
const allowed = new Set((process.env.NET_GUARD_ALLOW || '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean));
const local = (h) => typeof h === 'string' && (/^(localhost|::1|127(\.\d{1,3}){3})$/i.test(h.replace(/^\[|\]$/g, '')) || allowed.has(h.toLowerCase()));
const orig = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const a = Array.isArray(args[0]) ? args[0][0] : args[0];
  let host = 'localhost', isLocal = true;
  if (a && typeof a === 'object') { if (typeof a.path !== 'string') { host = a.host ?? 'localhost'; isLocal = local(host); } }
  else if (!(typeof a === 'string' && !/^\d+$/.test(a))) { host = typeof args[1] === 'string' ? args[1] : 'localhost'; isLocal = local(host); }
  if (!isLocal) { console.error('[net-guard] BLOCKED outbound connection to ' + host); throw new Error('[net-guard] blocked: ' + host); }
  return orig.apply(this, args);
};
const of = globalThis.fetch;
if (of) globalThis.fetch = (i, init) => { let h = null; try { h = new URL(typeof i === 'string' ? i : i.url ?? i.href).hostname; } catch {} ; if (!local(h)) { console.error('[net-guard] BLOCKED fetch to ' + h); return Promise.reject(new Error('[net-guard] blocked: ' + h)); } return of(i, init); };
console.error('[net-guard] installed: only loopback connections allowed' + (allowed.size ? ', plus ' + [...allowed].join(', ') : ''));
