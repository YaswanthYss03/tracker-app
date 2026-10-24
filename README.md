# GT06N GPS Tracker Server

Backend for a GPS tracking product built on GT06N trackers with Airtel IoT SIMs.

- **TCP gateway (port 5023)**: GT06N devices connect here. Only trackers registered by an admin are accepted.
- **PostgreSQL + TimescaleDB**: GPS points are stored compressed after 7 days and deleted after 180 days.
- **HTTP API (port 3000)**: customer accounts, claiming trackers with IMEI + activation code, sharing with family, and admin/support tools.

Roadmap: stage 1 foundation ✅ · stage 2 users & access ✅ · stage 3 live map, history, trips, alerts + push, geofences, share links ✅ · stage 4 production ops (HTTPS, backups, monitoring) ✅ · next: AWS deploy + real-tracker test.

## Web app (customer site + admin panel)

React app in [web/](web/), built into the Docker image and served by the backend at the same address as the API:

| URL | Who | What |
|---|---|---|
| `/login`, `/register` | everyone | sign in / sign up (terms consent) |
| `/` | customers | my trackers on a live map, **Add tracker** (IMEI + activation code) |
| `/devices/:id` | owner, viewers | Live (map, battery, ask the tracker) · History (day replay) · Trips · Daily report · Alerts · Geofences (draw circles) · Sharing (owner) · Settings / release |
| `/account` | customers | profile, password, log out everywhere, delete account |
| `/share/:token` | anyone with the link | live position only |
| `/admin` | role `admin` | dashboard (health, data, connected trackers) |
| `/admin/trackers` | admin | search by IMEI/SIM/name, register one or many (CSV of activation codes), export |
| `/admin/trackers/:imei` | admin | edit SIM/model/name, suspend, reset code, release, delete, map, positions, unknown packets, command console |
| `/admin/users` | admin | search accounts, see their trackers, grant/remove admin |

**First admin:** sign up on the site, then `npm run admin -- make-admin you@example.com` (on the server: `docker compose exec app node scripts/admin-cli.js make-admin you@example.com`). After that, admins can promote others in `/admin/users`.

Develop the UI with hot reload: `npm run dev` (API on :3000) and `npm run web:dev` (UI on http://localhost:5173, proxies API + WebSocket). Production build: `npm run web:build` (Docker does this automatically).

Maps use OpenStreetMap tiles (fine for the beta; switch to a paid tile provider before heavy traffic).

## Quick start (local)

Requirements: Node.js 22, Docker.

```bash
cp .env.example .env              # then set POSTGRES_PASSWORD, DATABASE_URL password, ADMIN_API_KEY
npm install
docker compose up -d db           # database only (localhost:5440)
npm run db:migrate                # create tables
npm run admin -- add 359710049095095 --sim 9876543210   # register a tracker, prints its activation code
npm run dev                       # server with readable logs
npm run simulate                  # fake tracker (another terminal)
```

Or run everything in Docker: `docker compose up -d --build` (migrations run automatically on start). The API is then at `https://localhost` (Caddy, self-signed certificate locally) and `http://localhost:3000` from this machine only.

## Project layout

```
src/
  index.js                 wiring + graceful shutdown
  config/                  .env validation (zod) — app refuses to start on bad config
  lib/                     logger (pino), geo math, activation codes & hashing, errors
  protocol/gt06/           framing, parsers (login, location, heartbeat, alarm, command reply, time request), builders
  gateway/                 TCP server (login whitelist, timeouts, per-IP limit) + connected-device registry / commands
  pipeline/                ingest (filters → live state cache → batch writer), emits position/status/alarm events
  processors/              trips + daily totals, alerts (ignition/overspeed/alarms/offline), geofences
  notifications/           Firebase push (fcm.js) and alert texts/recipients (notifier.js)
  realtime/                WebSocket live map (socket.io)
  db/                      Prisma client + repositories (raw SQL for bulk inserts)
  services/                deviceAdmin (stock), auth (accounts/tokens), ownership (claim/share/release)
  api/                     Express app, middleware (auth, device access, rate limits), routes, JSON shapes
prisma/                    schema + migrations (TimescaleDB hypertable, compression, retention)
scripts/                   admin-cli, simulate-device, send-command, deploy
test/                      unit + gateway tests (npm test) — no database needed
itest/                     API integration tests against a gps_test database (npm run test:integration)
web/                       React web app: customer site + admin panel (Vite, Leaflet, socket.io)
```

## How a location flows

1. Tracker connects → must send **login** within 30 s with a **registered, non-suspended IMEI**, else it's disconnected without an ACK.
2. Login / heartbeat / alarm packets are **ACKed immediately**; time requests get the server's UTC time.
3. Each GPS point goes through **filters**:
   - dropped: no GPS fix, 0,0, timestamps > 10 min in the future (device not on GMT) or > 7 days old, duplicates, impossible jumps (> 300 km/h implied), parked jitter (< 15 m, at most one point per 5 min)
   - an **ignition change is always stored**
   - **late / re-uploaded** points are stored in history but never replace the live position
4. Accepted points are written in **batches** (every 1 s or 500 rows). If the database is down they wait in memory and are retried; `/health` shows the backlog.
5. The **live state** (position, ignition, battery, signal, last seen) lives in memory and is saved to the `devices` table every 5 s.

Unknown or unparseable packets are saved to `raw_packets` for 7 days (see them with `GET /api/v1/admin/raw-packets`) — useful when a firmware variant sends something new.

## Admin tool

```bash
npm run admin -- add <IMEI> [--sim <number>] [--name "Car 1"]   # prints activation code ONCE
npm run admin -- add-range <firstIMEI> <count>                   # a shipment, CSV output
npm run admin -- list [--status inventory|active|suspended]
npm run admin -- show <IMEI>
npm run admin -- reset-code <IMEI>
npm run admin -- suspend <IMEI>  |  activate <IMEI>
npm run admin -- release <IMEI>                                   # support: unlink owner, wipe, back to stock
```
On the server: `docker compose exec app node scripts/admin-cli.js <command>`.

Activation codes look like `K7QM4-ZT9XH`, are stored only as a hash, and are what the customer enters (with the IMEI) to claim the tracker. Print both on the box or a card inside it.

## Customer API

Log in, then send `Authorization: Bearer <accessToken>` on every request. Access tokens last 15 minutes; when one expires (`401 TOKEN_EXPIRED`), call `/auth/refresh` with the refresh token to get a new pair (the old refresh token stops working). Store the refresh token securely on the phone (Keychain / Keystore).

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` `{email, password, name?, acceptTerms:true}` | anyone | Sign up. Returns tokens, or `{verificationRequired, email}` when email verification is on |
| POST | `/api/v1/auth/verify-email` `{email, code}` | anyone | Confirm the 6-digit sign-up code (returns tokens) |
| POST | `/api/v1/auth/resend-verification` `{email}` | anyone | Send a new sign-up code |
| POST | `/api/v1/auth/login` `{email, password}` | anyone | Log in (`403 EMAIL_NOT_VERIFIED` if the email isn't confirmed) |
| POST | `/api/v1/auth/google` `{idToken}` | anyone | Sign in / sign up with Google (needs `GOOGLE_CLIENT_IDS`) |
| POST | `/api/v1/inquiries` `{kind: contact\|partner, ...}` | anyone | Contact us / Partner with us forms (admins: `GET /api/v1/admin/inquiries`) |
| POST | `/api/v1/auth/refresh` `{refreshToken}` | anyone | New token pair |
| POST | `/api/v1/auth/logout` `{refreshToken}` | anyone | End this session |
| GET / PATCH | `/api/v1/me` `{name}` | user | Profile |
| POST | `/api/v1/me/password` `{currentPassword, newPassword}` | user | Change password (logs out all sessions) |
| POST | `/api/v1/me/logout-all` | user | Log out everywhere |
| DELETE | `/api/v1/me` `{password}` | user | Delete account (owned trackers are released) |
| POST / DELETE | `/api/v1/me/push-tokens` `{token, platform}` | user | Register phone for notifications (used in stage 3) |
| GET | `/api/v1/devices` | user | My trackers with live state |
| POST | `/api/v1/devices/claim` `{imei, activationCode, name?, vehicleType?}` | user | Add a tracker from the box. `vehicleType`: car, bike, scooter, bus, van, truck, auto, bicycle, tractor, other (saved as `icon`) |
| GET | `/api/v1/devices/:id` · `/api/v1/devices/:id/live` | owner, viewer | Tracker / live state only |
| PATCH | `/api/v1/devices/:id` `{name, icon, speedLimitKmh, timezone}` | owner | Settings |
| PATCH | `/api/v1/devices/:id/notifications` `{enabled}` | owner, viewer | My alerts on/off |
| GET | `/api/v1/devices/:id/members` | owner | Who has access |
| POST | `/api/v1/devices/:id/viewers` `{email}` | owner | Share (the person must have an account) |
| DELETE | `/api/v1/devices/:id/members/:userId` | owner / that viewer | Remove a viewer, or leave |
| POST | `/api/v1/devices/:id/release` `{confirmImei}` | owner | Give the tracker up: wipes history, back to stock |

Live state looks like:
```json
{ "lat": 12.973046, "lon": 77.595214, "speed": 40, "heading": 40, "satellites": 9,
  "gpsTime": "2026-10-22T13:08:20.000Z", "ignition": true, "externalPower": true,
  "batteryLevel": 5, "batteryPercent": 75, "gsmSignal": 4, "lastSeenAt": "...", "online": true }
```

Rules that protect users:
- A tracker someone else can't see returns **404** (no way to find out it exists); viewer trying an owner action → **403**.
- Wrong IMEI and wrong code give the same `INVALID_CLAIM` error. **5 wrong codes lock that tracker for 1 hour** (`429 CLAIM_LOCKED`; admin `reset-code` unlocks).
- Claiming wipes history recorded before the sale (factory tests, previous owner); releasing wipes everything.
- Rate limits: login 10 per 15 min per IP+email, sign-up 30/hour per IP, claim 10/hour per user, 600 API calls/min per IP.

## Tracking API (stage 3)

All under `/api/v1/devices/:id` with the Bearer token. Times are ISO-8601 UTC.

| Method | Path | Who | Purpose |
|---|---|---|---|
| GET | `/positions?from&to&maxPoints=2000` | owner, viewer | Route history, oldest first, simplified for maps (max 7 days; default last 24 h) |
| GET | `/trips?from&to` | owner, viewer | Trips (max 31 days); the current one has `inProgress: true` |
| GET | `/trips/:tripId/route` | owner, viewer | Path of one trip |
| GET | `/reports/daily?from=YYYY-MM-DD&to=` | owner, viewer | Distance, max speed, driving/idle time, trips per day (device timezone) |
| GET | `/events?from&to&type=overspeed,sos` | owner, viewer | Alerts (max 31 days) |
| GET / POST | `/geofences` | read: all · create: owner | Circle `{name, type:"circle", center:{lat,lon}, radiusM}` or polygon `{name, type:"polygon", points:[[lat,lon],...]}` (max 20) |
| PATCH / DELETE | `/geofences/:fenceId` | owner | Rename, toggle `alertOnEnter`/`alertOnExit`, change shape |
| POST / GET | `/share-links` `{expiresInMinutes}` | owner | Temporary public link (5 min – 7 days) |
| DELETE | `/share-links/:token` | owner | Revoke (open viewers are disconnected) |
| POST | `/commands` `{type: locate\|status\|reboot\|setInterval, seconds?}` | owner | Sends `WHERE#` / `STATUS#` / `RESET#` / `TIMER,n#`; returns the tracker's reply. Engine cut-off is not available to customers. |

Public, no login: `GET /api/v1/public/share/:token` → name + live position (no battery/alerts/history).

**How things are detected**
- **Trip**: starts when ignition turns on (or after 60 s of movement if the ACC wire isn't connected); ends when ignition turns off while stopped (or after 5 min stopped without ACC, 60 min stopped, or 30 min without data). Trips under 100 m are dropped. Idle = engine on while stopped.
- **Alerts**: `ignition_on/off`, `overspeed` (above the owner's `speedLimitKmh` for 30 s), `geofence_enter/exit` (two points in a row must agree), tracker alarms `sos`, `power_cut`, `vibration`, `low_battery`, `power_off` (with cooldowns), `offline` after `OFFLINE_AFTER_MIN` without data, then `online`. Only claimed trackers; re-uploaded old points never trigger alerts.

### Live map (WebSocket)

socket.io on the same port as the API:

```js
import { io } from 'socket.io-client';
const socket = io('https://api.example.com', { auth: { token: accessToken } });
socket.emit('subscribe', { deviceId }, (res) => { /* res.ok, res.live = current state */ });
socket.on('live', (live) => { /* { deviceId, lat, lon, speed, heading, ignition, batteryPercent, online, ... } */ });
socket.on('alert', (a) => { /* { type, time, lat, lon, details } */ });
socket.on('access_revoked', ({ deviceId }) => { /* removed from this tracker */ });
socket.on('session_expired', () => { /* refresh the token, reconnect */ });
```
A share-link page connects with `{ auth: { shareToken } }` and receives `live` for that tracker only (no alerts).

### Push notifications

Every alert is pushed (Firebase Cloud Messaging) to the owner and viewers who have notifications on for that tracker and registered a phone with `POST /api/v1/me/push-tokens`. Setup:
1. Firebase console → ⚙️ Project settings → **Service accounts → Generate new private key**.
2. Save it as `secrets/firebase.json` (git- and Docker-ignored; mounted read-only into the container). On a server: `~/gps-server/secrets/firebase.json`.
3. Restart. The log says `push notifications enabled` (or why it's disabled). `google-services.json` is the **app's** file and is rejected here.

Without the key everything else works; alerts are still saved and sent over the WebSocket. Dead phone tokens are removed automatically. Android: create a notification channel with id `alerts` in the app.

## Admin API

`GET /health` — public. `200` when healthy, `503` when the database is down or writes are failing:
```json
{ "status": "ok", "database": true, "gateway": { "connections": 3, "devicesConnected": 3 },
  "devicesOnline": 3, "writer": { "backlog": 0, "failing": false, "dropped": 0 } }
```

Header `x-api-key: <ADMIN_API_KEY>`:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/admin/devices?status=&limit=&offset=` | Registered trackers with live state |
| POST | `/api/v1/admin/devices` `{imei, simNumber?, model?, name?}` | Register; returns `activationCode` once |
| GET | `/api/v1/admin/devices/:imei` | One tracker, with owner/viewers |
| POST | `/api/v1/admin/devices/:imei/release` | Remove owner/viewers, wipe history, back to stock |
| GET | `/api/v1/admin/users?email=` | Search accounts (with their trackers) |
| PATCH | `/api/v1/admin/devices/:imei` `{status}` | `inventory` / `active` / `suspended` (suspending disconnects it) |
| POST | `/api/v1/admin/devices/:imei/reset-code` | New activation code |
| GET | `/api/v1/admin/devices/:imei/positions?from=&to=&limit=` | History (default last 24 h) |
| POST | `/api/v1/admin/devices/:imei/commands` `{command:"WHERE#"}` | Send a command, returns the device's reply (audit-logged) |
| GET | `/api/v1/admin/connections` | Trackers connected now |
| GET | `/api/v1/admin/raw-packets?imei=&limit=` | Unknown/unparseable packets |
| GET | `/api/v1/admin/stats` | Points received/stored/dropped (by reason), writer status |

Errors always look like `{ "error": { "code": "BAD_REQUEST", "message": "...", "details": [...] } }`.

From the terminal: `npm run command -- <IMEI> "WHERE#"`.

## Configuration

All settings are in `.env` (documented in [.env.example](.env.example)). The important ones:

| Variable | Default | Purpose |
|---|---|---|
| `POSTGRES_PASSWORD` | — | Database password (used by docker compose) |
| `DATABASE_URL` | — | Connection string for the app/Prisma on your machine (`localhost:5440`) |
| `DB_HOST_PORT` | `5440` | Local port for the database (localhost only) |
| `ADMIN_API_KEY` | empty | ≥ 32 chars; empty disables admin endpoints |
| `JWT_SECRET` | — | ≥ 32 chars, required; signs login tokens (changing it logs everyone out) |
| `ACCESS_TOKEN_TTL_MIN` / `REFRESH_TOKEN_TTL_DAYS` | `15` / `30` | Login token lifetimes |
| `TRUST_PROXY` | `0` | Set `1` behind Nginx so rate limits see real client IPs |
| `FIREBASE_CREDENTIALS_FILE` | `./secrets/firebase.json` | Firebase service-account key; missing = push disabled |
| `OFFLINE_AFTER_MIN` | `10` | Silence before an `offline` alert |
| `PORT` / `TCP_PORT` | `3000` / `5023` | HTTP API / tracker port |
| `LOGIN_TIMEOUT_MS` | `30000` | Close connections that don't log in |
| `MAX_CONNECTIONS_PER_IP` | `50` | Mobile networks share IPs (CGNAT) — keep generous |
| `FUTURE_TOLERANCE_MIN`, `MAX_POINT_AGE_DAYS`, `STATIONARY_*`, `MAX_IMPLIED_SPEED_KMH` | see file | Location filters |
| `BATCH_FLUSH_MS`, `BATCH_MAX_ROWS`, `BATCH_MAX_BACKLOG` | `1000`, `500`, `50000` | Database write batching |

## Database

- Schema: [prisma/schema.prisma](prisma/schema.prisma). Change it, then `npx prisma migrate dev --name <change>` (local DB running).
- Browse data: `npm run db:studio`.
- Reset local data: `docker compose down -v` (deletes the database volume).
- Retention: positions are compressed after 7 days and dropped after 180 days (see the init migration to change).

## Tracker setup (SMS to the SIM)

```
APN,airteliot.com#
SERVER,0,<SERVER_IP>,5023,0#
GMT,E,0,0#        ← report UTC; otherwise points are dropped as "future_time"
TIMER,10#
RESET#
```
Register the IMEI with the admin tool **before** pointing the tracker at the server.

## Operations

- **HTTPS**: Caddy ([deploy/Caddyfile](deploy/Caddyfile)) terminates TLS for `API_DOMAIN` with automatic Let's Encrypt certificates, redirects HTTP → HTTPS, adds HSTS, and proxies the WebSocket. Port 3000 and the database are bound to localhost.
- **Health**: `GET /health` is `503` when the database is down, position writes are failing, or the disk has < 10 % free — point an uptime monitor at it.
- **System info**: `GET /api/v1/admin/system` → database size, compression savings, counts, memory.
- **Backups**: `npm run backup` locally or `scripts/backup.sh` on the server (cron nightly; optional S3 copy). `scripts/restore.sh <dump>` test-restores into a scratch database; `CONFIRM=yes scripts/restore.sh <dump> gps` replaces live data. `npm run deploy` backs up before every deploy.
- **Logs**: JSON, rotated by Docker (10 MB × 5 per container).

## Deployment

Step-by-step production guide: [DEPLOY_AWS.md](DEPLOY_AWS.md) (Lightsail 2 GB, domain + HTTPS, firewall, backups, monitoring, tracker SMS). After the first setup, `npm run deploy` runs the tests, backs up the database, uploads the code and rebuilds; migrations apply on container start.

## Email verification

New accounts confirm their email with a 6-digit code (valid 15 minutes, 5 tries). `EMAIL_VERIFICATION` in `.env` controls it: `auto` (default) turns it on only when `EMAIL_API_KEY` is set, so nobody gets locked out while emails are only logged; `on` / `off` force it. Accounts created before this feature count as verified.

## Sign in with Google

Set `GOOGLE_CLIENT_IDS` to the Web client ID of the Firebase project (Authentication → Sign-in method → Google → Web SDK configuration). The phone app and website read it from `GET /api/v1/app/config`, so no app rebuild is needed to switch it on. The Android app also needs its signing certificate's SHA-1 added in Firebase (Project settings → Android app), then a fresh `google-services.json` and an app rebuild. Google accounts are linked to an existing account with the same email; accounts created with Google have no password until the user sets one (Profile → Set a password).
