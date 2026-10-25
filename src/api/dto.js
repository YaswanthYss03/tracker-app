/**
 * JSON shapes returned by the API. Live state comes from the in-memory cache
 * when the device has been active since startup, otherwise from the
 * devices table.
 */

// GT06 reports battery as a level 0-6. Rough percentage for display.
const BATTERY_PERCENT = [0, 5, 15, 30, 50, 75, 100];

function liveState(device, cache) {
  const s = cache?.get(device.id);
  const src = s
    ? {
        lat: s.lat, lon: s.lon, speed: s.speed, course: s.course, satellites: s.satellites,
        gpsTime: s.gpsTime, acc: s.acc, charging: s.charging, batteryLevel: s.batteryLevel,
        gsmSignal: s.gsmSignal, lastSeenAt: s.lastSeenAt,
      }
    : {
        lat: device.lastLat, lon: device.lastLon, speed: device.lastSpeed, course: device.lastCourse,
        satellites: device.lastSatellites, gpsTime: device.lastGpsTime, acc: device.lastAcc,
        charging: device.lastCharging, batteryLevel: device.lastBatteryLevel,
        gsmSignal: device.lastGsmSignal, lastSeenAt: device.lastSeenAt,
      };

  return {
    lat: src.lat ?? null,
    lon: src.lon ?? null,
    speed: src.speed ?? null, // km/h
    heading: src.course ?? null, // degrees
    satellites: src.satellites ?? null,
    gpsTime: src.gpsTime ?? null, // when the device recorded the position (UTC)
    ignition: src.acc ?? null,
    externalPower: src.charging ?? null,
    batteryLevel: src.batteryLevel ?? null, // 0-6 as reported
    batteryPercent: src.batteryLevel != null ? BATTERY_PERCENT[src.batteryLevel] ?? null : null,
    gsmSignal: src.gsmSignal ?? null, // 0-4
    lastSeenAt: src.lastSeenAt ?? null,
    online: cache ? cache.isOnline(s ?? { lastSeenAt: device.lastSeenAt }) : false,
  };
}

/** What a customer sees. `access` is their device_access row. */
function customerDevice(device, access, { cache }) {
  const isOwner = access.role === 'owner';
  return {
    id: device.id,
    name: device.name,
    icon: device.icon,
    registrationNumber: device.registrationNumber ?? null,
    color: device.color ?? null,
    mainDriver: device.mainDriver ? driverDto(device.mainDriver) : null,
    backupDriver: device.backupDriver ? driverDto(device.backupDriver) : null,
    driverName: device.mainDriver?.name ?? null, // older apps
    model: device.model,
    imei: device.imei,
    simNumber: isOwner ? device.simNumber : undefined,
    status: device.status,
    role: access.role,
    notify: access.notify,
    speedLimitKmh: device.speedLimitKmh,
    timezone: device.timezone,
    live: liveState(device, cache),
  };
}

/** A driver as apps see it. photoUrl changes when the photo does (cache busting). */
function driverDto(d) {
  return {
    id: d.id,
    name: d.name,
    phone: d.phone ?? null,
    licenceNo: d.licenceNo ?? null,
    licenceExpiry: d.licenceExpiry ? d.licenceExpiry.toISOString().slice(0, 10) : null,
    avatar: d.avatar ?? null,
    photoUrl: d.photoUpdatedAt ? `/api/v1/drivers/${d.id}/photo?v=${d.photoUpdatedAt.getTime()}` : null,
  };
}

/** What an admin sees (never the activation code hash). */
function adminDevice(device, { cache, registry, members }) {
  return {
    id: device.id,
    imei: device.imei,
    simNumber: device.simNumber,
    model: device.model,
    name: device.name,
    status: device.status,
    speedLimitKmh: device.speedLimitKmh,
    timezone: device.timezone,
    createdAt: device.createdAt,
    claimLockedUntil: device.claimLockedUntil,
    connected: registry.isConnected(device.id),
    live: liveState(device, cache),
    members: members?.map(member),
  };
}

function member(access) {
  return {
    userId: access.user.id,
    email: access.user.email,
    name: access.user.name,
    role: access.role,
    since: access.createdAt,
  };
}

function eventDto(e) {
  return { id: e.id, deviceId: e.deviceId, type: e.type, time: e.time, lat: e.lat, lon: e.lon, details: e.payload ?? null };
}

function tripDto(t) {
  return {
    id: t.id,
    startTime: t.startTime,
    endTime: t.endTime, // null while the trip is in progress
    start: { lat: t.startLat, lon: t.startLon },
    end: t.endLat != null ? { lat: t.endLat, lon: t.endLon } : null,
    distanceKm: Math.round(t.distanceM / 100) / 10,
    maxSpeed: t.maxSpeed,
    avgSpeed: t.avgSpeed,
    durationS: t.durationS,
    idleS: t.idleS,
  };
}

function geofenceDto(f) {
  return {
    id: f.id,
    name: f.name,
    type: f.type,
    ...(f.type === 'circle'
      ? { center: f.geometry, radiusM: f.radiusM }
      : { points: f.geometry }),
    alertOnEnter: f.alertOnEnter,
    alertOnExit: f.alertOnExit,
    createdAt: f.createdAt,
  };
}

module.exports = { driverDto, liveState, customerDevice, adminDevice, member, eventDto, tripDto, geofenceDto };
