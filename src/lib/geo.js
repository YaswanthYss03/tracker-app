// Geo helpers: distances, geofence containment and route simplification.

const EARTH_RADIUS_M = 6_371_000;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Great-circle distance between two points, in meters. */
function haversineMeters(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/** Point inside a polygon given as [[lat, lon], ...] (ray casting). */
function pointInPolygon(lat, lon, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lonI] = polygon[i];
    const [latJ, lonJ] = polygon[j];
    const crosses = latI > lat !== latJ > lat && lon < ((lonJ - lonI) * (lat - latI)) / (latJ - latI) + lonI;
    if (crosses) inside = !inside;
  }
  return inside;
}

/** Is the point inside a geofence row ({ type, geometry, radiusM })? */
function insideGeofence(fence, lat, lon) {
  if (fence.type === 'circle') {
    return haversineMeters(fence.geometry.lat, fence.geometry.lon, lat, lon) <= fence.radiusM;
  }
  return pointInPolygon(lat, lon, fence.geometry);
}

// Local flat projection (meters) around a reference latitude; accurate enough
// for simplifying routes of a few hundred km.
function project(p, refLat) {
  const k = Math.cos(toRad(refLat));
  return { x: toRad(p.lon) * EARTH_RADIUS_M * k, y: toRad(p.lat) * EARTH_RADIUS_M };
}

function perpendicularDistance(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 0 && dy === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/**
 * Douglas-Peucker: drops points that lie within `toleranceM` of the line
 * between their neighbours. Keeps first/last. Points need { lat, lon }.
 */
function simplify(points, toleranceM) {
  if (points.length <= 2) return points.slice();
  const refLat = points[0].lat;
  const xy = points.map((p) => project(p, refLat));
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;

  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    let maxDist = 0;
    let index = -1;
    for (let i = start + 1; i < end; i++) {
      const d = perpendicularDistance(xy[i], xy[start], xy[end]);
      if (d > maxDist) {
        maxDist = d;
        index = i;
      }
    }
    if (index !== -1 && maxDist > toleranceM) {
      keep[index] = 1;
      stack.push([start, index], [index, end]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

/** Simplifies with growing tolerance until at most `maxPoints` remain. */
function simplifyToMax(points, maxPoints, startToleranceM = 5) {
  let result = points;
  let tolerance = startToleranceM;
  while (result.length > maxPoints && tolerance < 100_000) {
    result = simplify(points, tolerance);
    tolerance *= 2;
  }
  return result;
}

module.exports = { haversineMeters, pointInPolygon, insideGeofence, simplify, simplifyToMax };
