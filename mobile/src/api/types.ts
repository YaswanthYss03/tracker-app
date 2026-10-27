// Shapes returned by the backend (see src/api/dto.js on the server).

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  /** false for accounts created with Google that never set a password */
  hasPassword?: boolean;
  googleLinked?: boolean;
  phone?: string | null;
  company?: string | null;
  /** Which alerts are pushed to this person (always recorded) */
  alerts?: { offline: boolean; longStop: boolean; gpsLost: boolean; quietHours: boolean };
};

export type Live = {
  deviceId?: string;
  lat: number | null;
  lon: number | null;
  speed: number | null;
  heading: number | null;
  satellites: number | null;
  gpsTime: string | null;
  ignition: boolean | null;
  externalPower: boolean | null;
  batteryLevel: number | null;
  batteryPercent: number | null;
  gsmSignal: number | null;
  lastSeenAt: string | null;
  online: boolean;
};

export type Device = {
  id: string;
  name: string | null;
  icon: string | null;
  /** Number plate, e.g. TN 38 AB 1234 */
  registrationNumber?: string | null;
  /** Main driver's name (same as mainDriver?.name). */
  driverName?: string | null;
  mainDriver?: Driver | null;
  backupDriver?: Driver | null;
  /** Body colour: white, silver, black, blue, red, yellow, orange, green */
  color?: string | null;
  /** km driven today (trips started since local midnight, incl. in progress) */
  todayKm?: number;
  /** Next service date YYYY-MM-DD (vehicle list only) */
  serviceDue?: string | null;
  model: string;
  imei: string;
  simNumber?: string | null;
  status: 'inventory' | 'active' | 'suspended';
  role: 'owner' | 'viewer';
  notify: boolean;
  speedLimitKmh: number | null;
  timezone: string;
  live: Live;
};

export type Driver = {
  id: string;
  name: string;
  phone: string | null;
  licenceNo: string | null;
  /** YYYY-MM-DD */
  licenceExpiry: string | null;
  /** Illustration key a1..a8 (used when there is no photo). */
  avatar: string | null;
  /** /api/v1/drivers/:id/photo?v=... (needs the access token) */
  photoUrl: string | null;
};

export type DriverVehicle = { id: string; name: string | null; registrationNumber: string | null; icon: string | null };
export type DriverFull = Driver & { mainOf: DriverVehicle[]; backupOf: DriverVehicle[] };

export type ServiceRecord = {
  id: string;
  type: 'general' | 'oil' | 'tyres' | 'brakes' | 'battery' | 'other';
  /** YYYY-MM-DD */
  date: string;
  odometerKm: number | null;
  garage: string | null;
  /** Whole rupees */
  cost: number | null;
  notes: string | null;
  nextDueDate: string | null;
};
export type NextService = { date: string; daysLeft: number; progress: number; type: ServiceRecord['type'] };

export type AlertEvent = {
  id: string;
  deviceId: string;
  type: string;
  time: string;
  lat: number | null;
  lon: number | null;
  details: Record<string, any> | null;
};

export type Trip = {
  id: string;
  startTime: string;
  endTime: string | null;
  start: { lat: number; lon: number };
  end: { lat: number; lon: number } | null;
  distanceKm: number;
  maxSpeed: number;
  avgSpeed: number;
  durationS: number;
  idleS: number;
  inProgress: boolean;
};

export type RoutePoint = { t: string; lat: number; lon: number; speed: number; heading: number; ignition: boolean | null };

export type Geofence = {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  center?: { lat: number; lon: number };
  radiusM?: number;
  points?: [number, number][];
  alertOnEnter: boolean;
  alertOnExit: boolean;
};

export type Member = { userId: string; email: string; name: string | null; role: 'owner' | 'viewer'; since: string };

export const deviceName = (d: Pick<Device, 'name' | 'imei'>) => d.name || `Tracker ${d.imei.slice(-4)}`;

/** Number plate if set, else the vehicle name. */
export const plateOrName = (d: Pick<Device, 'name' | 'imei' | 'registrationNumber'>) => d.registrationNumber || deviceName(d);

/** A trip the owner started by hand. New data goes into the latest one. */
export type TripLog = {
  id: string;
  number: number;
  name: string | null;
  startedAt: string;
  /** When the next trip began; null = the current trip. */
  endedAt: string | null;
  current: boolean;
  distanceKm: number;
  maxSpeed: number;
  avgSpeed: number;
  durationS: number;
  idleS: number;
  start: { lat: number; lon: number } | null;
  end: { lat: number; lon: number } | null;
  points: number;
};
