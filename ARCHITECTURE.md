# GPS Tracker Platform — How It Works

This document explains the whole backend: what the product does, how a tracker's data moves through the system, and how the code is organised. Read it top to bottom once; afterwards use the section headings as a map.

Related docs: [README.md](README.md) (setup, API reference), [DEPLOY_AWS.md](DEPLOY_AWS.md) (production deployment).

---

## 1. What the system does

We sell a **GT06N GPS tracker** with an **Airtel IoT SIM** inside. The tracker sends its position over the mobile network to our server. Customers use our app to see where their vehicle is, its route history, trips, and alerts on their phone.

The backend has three jobs:

1. **Receive** binary data from trackers (TCP port 5023) and store it safely.
2. **Understand** it: live position, trips, daily distance, alerts (ignition, overspeed, geofence, SOS, power cut, offline).
3. **Serve** it securely to the people allowed to see it: REST API, live WebSocket, push notifications.

---

## 2. Business flow (from warehouse to customer)

```
 WAREHOUSE                         CUSTOMER                              LATER
 ─────────                         ────────                              ─────
 1. Admin registers tracker        4. Buys tracker, installs it          8. Shares with family
    (IMEI + SIM number)               in the vehicle                        (viewers by email)
        │                                  │                             9. Creates geofences,
        ▼                                  ▼                                share links, sets
 2. Server creates a secret        5. Creates an account in the app         speed limit
    activation code                   (email + password, accepts terms)  10. Sells the vehicle →
    e.g. K7QM4-ZT9XH                       │                                 "release" tracker:
        │                                  ▼                                 history wiped,
        ▼                          6. "Add device": IMEI + code              back to stock
 3. IMEI + code printed               → becomes OWNER                       → next buyer claims
    on the box                             │                                 with the same code
                                           ▼
                                   7. Sees live map, history, trips,
                                      daily report, gets alerts
```

Tracker status in the database: `inventory` (registered, not claimed) → `active` (claimed) → back to `inventory` when released. `suspended` blocks the tracker completely.

**Why IMEI + code and not IMEI alone?** The IMEI is printed on the device and easy to guess. If the IMEI alone gave access, anyone could track someone else. The secret code proves the person has the box.

---

## 3. System architecture

```
                         ┌──────────────────────────── AWS Lightsail server (Docker) ───────────────────────────┐
                         │                                                                                      │
 GT06N tracker ──TCP:5023──▶ Gateway ──▶ Protocol parser ──▶ Ingest pipeline ──┬──▶ Batch writer ──▶ PostgreSQL │
 (Airtel SIM)            │  (login,       (bytes → JS          (filters, live    │                    + TimescaleDB│
        ▲                │   ACKs)         objects)             state cache)     │                       ▲        │
        │ commands       │     ▲                                                 ├──▶ Processors ─────────┤        │
        └────────────────│─────┘ (WHERE#, STATUS#…)                              │    (trips, alerts,     │        │
                         │                                                       │     geofences)         │        │
                         │                                                       │        │               │        │
                         │                                                       ▼        ▼               │        │
 Mobile app / web ─HTTPS:443─▶ Caddy ──▶ Express API ◀── reads ──────────── live state + database ◀───────┘        │
                         │   (TLS)     + WebSocket ──── pushes live positions & alerts ──▶ app                      │
                         │                  │                                                                    │
                         │                  └──▶ Firebase (FCM) ──▶ push notification on the phone               │
                         └──────────────────────────────────────────────────────────────────────────────────────┘
```

Everything runs in **one Node.js process** (plus the database and Caddy containers). That's enough for the beta and the first ~1,000 trackers. Section 14 describes how to split it later.

---

## 4. Tech stack

| Part | Technology | Why |
|---|---|---|
| Runtime | Node.js 22 | Handles thousands of idle TCP connections cheaply |
| Tracker protocol | Custom GT06 parser (`src/protocol/gt06`) | Binary protocol, no good library |
| Database | PostgreSQL 16 + **TimescaleDB** | Relational data (users, devices) + time-series GPS points with compression (~90 %) and automatic deletion |
| DB access | Prisma (+ raw SQL for bulk inserts) | Schema/migrations + speed where it matters |
| HTTP API | Express 4, zod validation, helmet, express-rate-limit | Standard, well-known |
| Auth | JWT access tokens + rotating refresh tokens, scrypt password hashes | Mobile-friendly, theft detection |
| Live updates | socket.io (WebSocket) | Live map without polling; works in React Native |
| Web app | React 19 + Vite, React Router 7, Leaflet + OpenStreetMap | Customer site and admin panel, served by the backend |
| Push | Firebase Cloud Messaging (`firebase-admin`) | Free, Android + iOS |
| HTTPS | Caddy | Automatic Let's Encrypt certificates, WebSocket proxying |
| Logs | pino (JSON) | Structured, fast; Docker rotates them |
| Deployment | Docker Compose on AWS Lightsail (2 GB) | Simple, ~$12/month |
| Tests | node:test (unit + integration against a real DB) | No extra framework |

---

## 5. Folder structure

```
src/
├── index.js                     START HERE: creates and wires every component, graceful shutdown
├── config/index.js              reads .env, validates it (zod); app refuses to start on bad config
│
├── protocol/gt06/               ── understanding the tracker's bytes ──
│   ├── constants.js             protocol numbers (0x01 login, 0x12/0x22 location, 0x13 heartbeat…), alarm codes
│   ├── crc.js                   CRC-ITU checksum (detects corrupted packets)
│   ├── framing.js               extractPackets(): finds complete packets in the TCP byte stream; buildPacket()
│   ├── parsers.js               parsePacket(): bytes → { type: 'login' | 'location' | 'heartbeat' | 'alarm' | … }
│   ├── builders.js              packets we send: ACK, command (0x80), time reply (0x8A)
│   └── index.js                 re-exports everything
│
├── gateway/                     ── talking to trackers ──
│   ├── tcpServer.js             TCP server on 5023: login check, ACKs, per-IP limit, timeouts, ordered processing
│   └── deviceRegistry.js        which trackers are connected now; send a command and wait for the reply
│
├── pipeline/                    ── turning messages into data ──
│   ├── ingest.js                receives parsed messages; runs filters; updates live state; emits events
│   ├── filters.js               evaluatePoint(): store this GPS point? does it become the live position?
│   ├── stateCache.js            in-memory live state per tracker; saved to the devices table every 5 s
│   └── batchWriter.js           buffers GPS points, inserts 500 at a time, retries if the DB is down
│
├── processors/                  ── understanding behaviour ──
│   ├── index.js                 subscribes trips/alerts/geofences to ingest events; routes alerts to push + WebSocket
│   ├── trips.js                 TripTracker: detects trip start/end, distance, idle time, daily totals
│   ├── alerts.js                AlertEngine: ignition, overspeed, device alarms, offline/online, cooldowns
│   └── geofences.js             GeofenceMonitor: enter/exit detection with jitter protection
│
├── notifications/
│   ├── fcm.js                   Firebase sender (disabled cleanly if the key file is missing/wrong)
│   └── notifier.js              who gets which alert, notification text, removes dead phone tokens
│
├── realtime/socket.js           socket.io server: auth, subscribe to trackers, 'live' + 'alert' events, revocation
│
├── services/                    ── business rules ──
│   ├── auth.js                  register, login, refresh rotation, logout, password change, delete account
│   ├── ownership.js             claim (IMEI + code), share/remove viewers, release; privacy wipes
│   ├── deviceAdmin.js           register stock, reset activation codes, suspend
│   └── commands.js              send a command, audit-log it; customer command allow-list
│
├── api/                         ── HTTP layer ──
│   ├── app.js                   Express app: security, rate limits, routers, error handler, /health
│   ├── middleware.js            requireAuth (JWT), requireDeviceAccess (owner/viewer), rate limits
│   ├── validate.js              zod helpers, async wrapper
│   ├── dto.js                   JSON shapes sent to clients (never leaks secrets)
│   └── routes/
│       ├── auth.js              /api/v1/auth/*
│       ├── me.js                /api/v1/me/*
│       ├── devices.js           /api/v1/devices (list, claim, settings, sharing, release)
│       ├── tracking.js          /api/v1/devices/:id/* (history, trips, reports, events, geofences, share links, commands) + public share view
│       └── admin.js             /api/v1/admin/* (stock, support, diagnostics) — x-api-key
│
├── db/
│   ├── client.js                single Prisma client (connection pool)
│   └── repositories/            all SQL lives here: devices, positions, trips, events, geofences, shareLinks, commands, rawPackets
│
└── lib/
    ├── logger.js                pino logger
    ├── geo.js                   haversine distance, point-in-polygon, route simplification (Douglas-Peucker)
    ├── secrets.js               activation codes, scrypt hashing, constant-time compare
    └── errors.js                AppError → { error: { code, message } }

web/                             React web app (customer site at /, admin panel at /admin), built into the image
prisma/schema.prisma             database schema;  prisma/migrations/  SQL migrations (incl. TimescaleDB setup)
deploy/Caddyfile                 HTTPS reverse proxy config
docker-compose.yml, Dockerfile   containers: app, db (TimescaleDB), caddy
scripts/                         admin-cli, simulate-device, send-command, deploy, backup, restore
test/                            unit tests (no DB)        itest/   integration tests (real DB)
```

**Layering rule:** routes → services → repositories → database. Routes never write SQL; repositories never know about HTTP. The tracker side (gateway → pipeline → processors) never imports the API.

---

## 6. Startup flow (`src/index.js`)

```
1. config            load + validate .env (exit with a clear message if wrong)
2. database          connect with retry (10 × 3 s), so the app survives the DB starting slowly
3. DeviceStateCache  in-memory live state; start saving changes to `devices` every 5 s
4. BatchWriter       start the 1-second flush timer for GPS points
5. Ingest            connects filters + cache + writer
6. DeviceRegistry    empty list of connected trackers
7. Ownership + Auth  services; Firebase sender (enabled only if secrets/firebase.json is valid)
8. Processors        trips, alerts, geofences subscribe to ingest events; offline check every minute
9. Gateway           TCP server listens on 5023
10. HTTP app         Express on 3000 (behind Caddy), then the socket.io server on the same port
11. Housekeeping     hourly cleanup of old debug packets
12. Signals          on SIGTERM/SIGINT: stop processors → close WebSocket/HTTP → close tracker
                     sockets → flush buffered GPS points → save live state → disconnect DB → exit
```

Migrations run before the app starts (`prisma migrate deploy` in the Docker command).

---

## 7. Tracker data flow — one packet, start to finish

### 7.1 The GT06 packet

Layout of a `0x22` location packet (byte values shortened for illustration):

```
78 78 | 22 | 22 | 1A 0A 16 0E 1E 0F | C9 | 01 6A …(lat) | 08 3C …(lon) | 28 | 14 5A | …LBS… | 01 00 00 | 00 05 | 4C 2E | 0D 0A
start  len  type  date/time (UTC)    sats  latitude       longitude      spd  course  cell     ACC re-up  serial  CRC     stop
```
Latitude/longitude are integers: `degrees × 1,800,000`. The course word also holds flags (GPS fix valid, north/south, east/west).

### 7.2 Step by step

```
┌─ gateway/tcpServer.js ───────────────────────────────────────────────────────────────────────────┐
│ 1. TCP 'data' event: bytes appended to the connection's buffer                                   │
│ 2. protocol extractPackets(): finds complete frames, checks length/stop bytes/CRC;              │
│    leftovers wait for the next chunk (TCP can split or glue packets)                             │
│ 3. Each frame is queued on the connection's promise chain → packets of one tracker are handled   │
│    strictly in order (the login DB lookup always finishes before its locations are processed)    │
│ 4. protocol parsePacket() → message object                                                       │
│ 5. LOGIN: look up IMEI in `devices`. Unknown or suspended → close, no ACK.                        │
│           Known → remember IMEI/deviceId on the session, registry.register(), send ACK            │
│    Not logged in yet and not a login → ignored (closed after 5 such packets or 30 s)              │
│ 6. Login/heartbeat/alarm → ACK immediately (otherwise the tracker hangs up)                       │
│ 7. Dispatch: location → ingest.handleLocation · heartbeat → handleHeartbeat · alarm → handleAlarm │
│              command reply → registry.handleResponse · time request → reply with UTC time         │
│              unknown/unparseable → saved to raw_packets (debugging firmware differences)          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─ pipeline/ingest.js ─────────────────────────────────────────────────────────────────────────────┐
│ 8.  touch(): lastSeenAt = now                                                                     │
│ 9.  filters.evaluatePoint() decides (see 7.3)                                                     │
│ 10. Stored → row added to BatchWriter                                                             │
│ 11. Newest point → live state updated (lat, lon, speed, ignition…) and marked "dirty"             │
│ 12. emit('position' | 'status' | 'alarm')                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
┌─ pipeline/batchWriter.js ────────────┐   ┌─ pipeline/stateCache.js ──────────────────────────────┐
│ 13. every 1 s or 500 rows: one       │   │ 14. every 5 s: one UPDATE for all changed trackers     │
│     INSERT … ON CONFLICT DO NOTHING  │   │     (devices.last_lat, last_seen_at, battery…); never  │
│     DB down → keep rows, retry with  │   │     moves last_gps_time backwards                      │
│     back-off (max 50,000 in memory)  │   └────────────────────────────────────────────────────────┘
└──────────────────────────────────────┘
┌─ processors/index.js (listens to ingest events) ─────────────────────────────────────────────────┐
│ 15. realtime.publishLive()  → WebSocket 'live' to everyone watching (max 1/s per tracker)         │
│ 16. Only claimed trackers, only newest real-time points:                                          │
│       trips.onPosition()       → trip start/progress/end, daily totals                           │
│       per-tracker ordered queue: geofences.onPosition() then alerts.onPosition()                  │
│ 17. AlertEngine 'event' → saved in `events` → WebSocket 'alert' + push notification               │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Filters (`pipeline/filters.js`)

| Check | Result |
|---|---|
| No GPS fix, 0,0, out of range | dropped |
| GPS time > 10 min in the future | dropped (usually the tracker isn't set to GMT → warning in logs) |
| Older than 7 days | dropped |
| Same timestamp as the live point | dropped (duplicate) |
| Older than the live point (buffered/re-uploaded) | **stored in history, does NOT change the live position** |
| Implies > 300 km/h from the live point (and > 1 km) | dropped as a GPS glitch (accepted after 3 in a row, in case the live point was wrong) |
| Parked (< 3 km/h, < 15 m moved, < 5 min since last stored) | skipped (GPS jitter) — **unless ignition changed** |
| Otherwise | stored and becomes the live position |

Every drop reason is counted: `GET /api/v1/admin/stats`.

---

## 8. Processors — turning points into meaning

### 8.1 Trips (`processors/trips.js`)

```
          ACC on  ─or─  moving ≥ 5 km/h for 60 s
 [no trip] ───────────────────────────────────────▶ [trip in progress] ──every 60 s──▶ progress saved
     ▲                                                     │
     │   ACC off while stopped        (if ACC was seen on) │  distance += haversine(prev, point)
     │   stopped 5 min                (if no ACC signal)   │  idle += time stopped with engine on
     │   stopped 60 min / no data 30 min (always)          │  maxSpeed
     └─────────────────────────────────────────────────────┘
                     on end: trip row finished; < 100 m → discarded;
                     daily_stats += distance, driving, idle, trips (day in the tracker's timezone)
```
After a restart, an open trip is reloaded from the database and continues.

### 8.2 Alerts (`processors/alerts.js`)

| Alert | Trigger | Repeat protection |
|---|---|---|
| `ignition_on` / `ignition_off` | ACC changes (location or heartbeat) | first value after start is silent |
| `overspeed` | above owner's `speedLimitKmh` for 30 s | re-armed after 60 s below (limit − 5) |
| `geofence_enter` / `_exit` | from GeofenceMonitor | 2 consecutive points must agree |
| `sos`, `power_cut`, `vibration`, `low_battery`, `power_off` | tracker's own alarm packets | cooldowns: SOS 1 min, others 10 min, low battery 6 h |
| `offline` / `online` | no packet for `OFFLINE_AFTER_MIN` (10) / first packet after | fires once per outage |

Alerts of one tracker are saved and sent **in the order they happened** (per-tracker promise chains), so a phone never sees "ignition off" before "ignition on".

### 8.3 Geofences (`processors/geofences.js`)

Circles (`center` + `radiusM`) or polygons (`[[lat, lon], …]`). Fences are cached per tracker and reloaded when the owner changes them. Inside/outside is computed in JavaScript (`lib/geo.js`); a crossing counts only when two points in a row agree.

### 8.4 Notifications (`notifications/`)

```
alert row ─▶ notifier: device_access rows with notify = true ─▶ their push_tokens ─▶ FCM sendEachForMulticast
                                                                                    └─ dead tokens deleted
```
Missing or wrong Firebase key → push disabled with a log message; everything else keeps working.

---

## 9. API request flow

```
HTTPS request ─▶ Caddy (TLS, HSTS, gzip) ─▶ Express
   │
   ├─ helmet (security headers) · CORS · JSON body ≤ 100 kB · rate limit (600/min per IP)
   ├─ route-specific rate limits (login, register, claim, commands)
   ├─ requireAuth: verify JWT → req.user = { id, role }
   ├─ requireDeviceAccess: look up device_access(user, device)
   │      none → 404 (never reveal that a tracker exists) · viewer on owner-only action → 403
   ├─ zod validation → 400 with a list of bad fields
   ├─ service (business rules) → repository (SQL)
   ├─ dto.js shapes the response (no hashes, no SIM number for viewers)
   └─ error handler: AppError → { "error": { "code", "message", "details" } }; anything else → 500 + log
```

### 9.1 Authentication (`services/auth.js`)

```
register/login ──▶ access token (JWT, 15 min)  +  refresh token (random, 30 days, stored as SHA-256 hash)

access token expired (401 TOKEN_EXPIRED)
   └─▶ POST /auth/refresh { refreshToken }
         ├─ valid → old refresh token revoked, NEW pair returned (rotation)
         └─ already-revoked token used again → someone stole it → ALL sessions of that user revoked
```
Password change and "log out everywhere" revoke all refresh tokens. Deleting an account releases owned trackers and removes personal data.

### 9.2 Claim, share, release (`services/ownership.js`)

```
CLAIM  imei + code
  ├─ unknown IMEI or wrong code → same error (INVALID_CLAIM); 5 wrong codes → tracker locked 1 h
  ├─ suspended → 403 · owned by someone else → 409 · already mine → 200
  └─ transaction: status inventory→active (only one claimer can win) · wipe pre-sale history · create owner row

SHARE  owner adds viewer by email (account must exist, max 10)   ·   viewer can leave, owner can remove

RELEASE (owner, confirms IMEI)  or admin  or account deletion
  └─ wipe positions/trips/events/geofences/share links · remove all access · reset live position
     · status → inventory · open WebSockets get 'access_revoked' · processors forget the tracker
```

### 9.3 Commands (`services/commands.js`)

```
owner: POST /devices/:id/commands { type: "locate" }      admin: any text command
   └─▶ allow-list → "WHERE#" ─▶ commands_log (sent) ─▶ registry.sendCommand()
          └─▶ 0x80 packet with a unique "server flag" ─▶ tracker replies 0x15/0x21 with the same flag
                 └─▶ matched → reply returned + logged · no reply in 30 s → 504 · not connected → 409
```
Engine cut-off (`RELAY`) is not available to customers.

### 9.4 Live map (`realtime/socket.js`)

```
connect { auth: { token } } ──▶ JWT checked ──▶ socket.emit('subscribe', { deviceId }) ──▶ access checked
   └─ joins rooms  device:<id> (live)  +  members:<id> (alerts)
connect { auth: { shareToken } } ──▶ link checked ──▶ joins device:<id> only (no alerts)

server → client:  'live' (position/status, ≤ 1/s)  ·  'alert'  ·  'access_revoked'  ·  'session_expired'
```
Sockets are disconnected when the access token or share link expires, when a viewer is removed, when a tracker is released, or when a share link is revoked.

---

## 10. Database (`prisma/schema.prisma`)

| Table | Holds | Notes |
|---|---|---|
| `users` | accounts | password as scrypt hash, `terms_accepted_at` |
| `devices` | trackers | IMEI, SIM, status, activation code hash, settings, **last_\*** live state, claim lock |
| `device_access` | who sees which tracker | role `owner` / `viewer`, `notify` |
| `positions` | every stored GPS point | **TimescaleDB hypertable**: 1-day chunks, compressed after 7 days, deleted after 180 days; PK (device, gps_time) prevents duplicates |
| `trips` | detected trips | open trip has `end_time = null` |
| `daily_stats` | per-day totals | distance, max speed, driving/idle seconds, trips |
| `events` | alerts | type, time, position, details |
| `geofences` | circles / polygons | geometry as JSON |
| `share_links` | temporary public links | expiry, revocation |
| `push_tokens` | phones for notifications | removed when Firebase says they're dead |
| `refresh_tokens` | login sessions | SHA-256 hash, revoked_at |
| `commands_log` | audit of every command | who, what, reply, status |
| `raw_packets` | unknown/broken tracker packets | kept 7 days for debugging |

Migrations: `prisma/migrations/`. The first one also creates the TimescaleDB hypertable and its compression/retention policies (Prisma doesn't know TimescaleDB, so that part is hand-written SQL).

---

## 11. Security summary

| Threat | Protection |
|---|---|
| Someone tracks a person by guessing an IMEI | IMEI + secret code to claim; every endpoint and WebSocket checks access; 404 for others' trackers |
| Guessing activation codes | 31¹⁰ possible codes, hashed, 5 tries → 1 h lock per tracker, 10 claims/hour per user, same error for wrong IMEI or code |
| Fake tracker injecting locations | only registered, non-suspended IMEIs; login within 30 s; per-IP connection limit; CRC checks |
| Stolen login token | 15-min access tokens; refresh rotation with reuse detection |
| Password brute force | login limit 10 per 15 min per IP + email; scrypt; equal timing for unknown emails |
| Data leak at rest | passwords, codes and refresh tokens stored only as hashes |
| Network sniffing | HTTPS everywhere (Caddy), HSTS |
| Exposed internals | port 3000 and the database bound to localhost; only 80/443/5023 public |
| Engine cut-off misuse | not exposed to customers; all commands audit-logged |
| Previous owner sees new owner's data (or vice versa) | history wiped on claim and on release |
| Privacy law (India DPDP) | terms consent recorded, account deletion, 180-day retention |

---

## 12. Configuration

All settings come from `.env` (template: `.env.example`), validated at startup by `src/config/index.js`. Key groups: server ports and log level · database (`POSTGRES_PASSWORD`, `DATABASE_URL`) · security (`ADMIN_API_KEY`, `JWT_SECRET`, `CORS_ORIGIN`, `TRUST_PROXY`) · tracker connections (timeouts, per-IP limit) · location filters · write batching · push (`FIREBASE_CREDENTIALS_FILE`) · alerts (`OFFLINE_AFTER_MIN`) · HTTPS (`API_DOMAIN`) · backups.

Secrets that must never be committed or shared: `.env`, `secrets/firebase.json` (both git- and Docker-ignored).

---

## 13. Operations

| Area | How |
|---|---|
| Deploy | `npm run deploy` → tests → server .env check → **database backup** → upload (rsync) → `docker compose up -d --build` (migrations run on start) → health check |
| HTTPS | Caddy gets/renews certificates for `API_DOMAIN` automatically |
| Logs | `npm run logs` (JSON; Docker rotates 10 MB × 5) |
| Health | `GET /health` → 503 if DB down, writes failing or disk < 10 % free; watched by UptimeRobot |
| Diagnostics | `/api/v1/admin/stats` (points received/stored/dropped), `/admin/system` (DB size, compression), `/admin/connections`, `/admin/raw-packets` |
| Backups | Lightsail daily snapshots + nightly `scripts/backup.sh` (14 days, optional S3); `scripts/restore.sh` tested |
| Graceful restart | buffered points and live state are saved before exit; trackers reconnect by themselves; Caddy holds requests up to 10 s |

---

## 14. Testing

| Suite | Command | Covers |
|---|---|---|
| Unit (55) | `npm test` | GT06 parsing (incl. official document samples), framing, filters, batch writer, activation codes, gateway over real TCP sockets, trips, alerts, geofences, geo math, push setup |
| Integration (23) | `npm run test:integration` (needs `docker compose up -d db`) | accounts, token rotation, claim/lock/share/release, privacy wipes, full drive → history/trips/daily/alerts, geofences, share links, commands, WebSocket auth/live/alerts/revocation |
| Simulator | `npm run simulate -- --devices 200 --alarms --reupload --jump` | fake GT06N trackers: driving/parking, heartbeats, alarms, re-uploads, glitches, command replies |

Verified so far: 200 simulated trackers, every point stored, ~34 MB app memory; database outage with no data loss; backup → restore with identical counts.

---

## 15. Limits today and how to grow

| Today | When it matters | Next step |
|---|---|---|
| One Node process holds all tracker connections and live state | > ~1,000–5,000 trackers or high availability needed | Run several gateway processes behind an AWS Network Load Balancer; move the device registry and live state to **Redis** (pub/sub for commands and WebSocket fan-out) |
| Database on the same server | heavy reports / > ~1,000 trackers | Move to a separate server or managed PostgreSQL with TimescaleDB |
| Parser tested against the protocol document and simulator | before inviting customers | **Capture real packets from our GT06N firmware** (`/admin/raw-packets`) and add them as test fixtures |
| Daily report counts finished trips only | — | Optionally include the trip in progress |
| Email + password login | — | Phone OTP, Google/Apple sign-in |
| Web admin uses the same login as customers (role `admin`) | many staff with different permissions | Finer roles (support vs. stock manager) |

Future feature ideas (driver scoring, maintenance reminders, AI summaries, fuel/temperature sensors) build on the same `positions`, `trips` and `events` data.

---

## 16. Glossary

| Term | Meaning |
|---|---|
| **IMEI** | 15-digit tracker identity, sent in the login packet |
| **ACC** | ignition wire; ACC on = engine on |
| **ACK** | small reply the tracker needs after login/heartbeat/alarm, or it disconnects |
| **Heartbeat** | periodic status packet (ignition, battery, signal) |
| **Re-upload** | points the tracker buffered while it had no network, sent later |
| **Hypertable** | TimescaleDB table split into time chunks (fast inserts, compression, retention) |
| **Claim / release** | link a tracker to an account / give it back to stock |
| **Owner / viewer** | full control / read-only access to a tracker |
| **Access / refresh token** | short login proof sent with each request / long-lived token to get a new access token |
| **FCM** | Firebase Cloud Messaging — Google's push notification service |
| **Geofence** | an area on the map that triggers alerts on enter/exit |
