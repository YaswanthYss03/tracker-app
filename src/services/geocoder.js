/**
 * Street address for a position ("Avinashi Road, near Peelamedu"), from the free
 * OpenStreetMap Nominatim service.
 *
 * Nominatim's usage policy: at most 1 request per second, a real User-Agent,
 * and cache results. So:
 *   - positions are rounded to ~11 m and cached in memory (LRU, also misses),
 *   - one shared queue sends at most one request per `minIntervalMs`,
 *   - identical lookups in flight are shared,
 *   - when the queue is long the lookup gives up (null) instead of piling up.
 */
const DEFAULTS = {
  url: 'https://nominatim.openstreetmap.org/reverse',
  minIntervalMs: 1100,
  maxEntries: 5000,
  maxQueue: 20,
  timeoutMs: 6000,
};

/** Short, readable address from a Nominatim answer. */
function shortAddress(json) {
  const a = json?.address || {};
  const road = a.road || a.pedestrian || a.footway || a.highway || a.path;
  const area = a.neighbourhood || a.suburb || a.quarter || a.hamlet || a.village || a.city_district;
  const town = a.city || a.town || a.village || a.county || a.state_district;
  if (road && area && area !== road) return `${road}, near ${area}`;
  if (road && town) return `${road}, ${town}`;
  if (area && town && area !== town) return `${area}, ${town}`;
  if (road || area || town) return road || area || town;
  const parts = String(json?.display_name || '').split(',').map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts.slice(0, 2).join(', ') : null;
}

function createGeocoder({ userAgent, logger, fetchImpl = fetch, now = Date.now, ...opts } = {}) {
  const o = { ...DEFAULTS, ...opts };
  const log = logger?.child({ component: 'geocoder' });
  const cache = new Map(); // key -> address | null (insertion order = LRU order)
  const inflight = new Map(); // key -> Promise
  let queue = Promise.resolve();
  let waiting = 0;
  let lastAt = 0;

  const keyOf = (lat, lon) => `${lat.toFixed(4)},${lon.toFixed(4)}`;

  function remember(key, value) {
    cache.delete(key);
    cache.set(key, value);
    if (cache.size > o.maxEntries) cache.delete(cache.keys().next().value);
  }

  async function request(lat, lon) {
    const wait = lastAt + o.minIntervalMs - now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastAt = now();
    const url = `${o.url}?format=jsonv2&zoom=17&addressdetails=1&accept-language=en&lat=${lat}&lon=${lon}`;
    const res = await fetchImpl(url, { headers: { 'user-agent': userAgent, accept: 'application/json' }, signal: AbortSignal.timeout(o.timeoutMs) });
    if (!res.ok) throw new Error(`nominatim ${res.status}`);
    return shortAddress(await res.json());
  }

  /** Address for lat/lon, or null if unknown / busy / failed. */
  async function reverse(lat, lon) {
    const key = keyOf(lat, lon);
    if (cache.has(key)) {
      const v = cache.get(key);
      remember(key, v);
      return v;
    }
    if (inflight.has(key)) return inflight.get(key);
    if (waiting >= o.maxQueue) return null;

    waiting += 1;
    const p = (queue = queue.then(async () => {
      try {
        const [rlat, rlon] = key.split(',').map(Number);
        const address = await request(rlat, rlon);
        remember(key, address);
        return address;
      } catch (err) {
        log?.warn({ err: err.message }, 'reverse geocoding failed');
        return null; // not cached: try again next time
      } finally {
        waiting -= 1;
        inflight.delete(key);
      }
    }));
    inflight.set(key, p);
    return p;
  }

  return { reverse, size: () => cache.size };
}

module.exports = { createGeocoder, shortAddress };
