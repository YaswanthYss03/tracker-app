# Pavakie app — design v2 (from the Claude Design prototype)

Source: `mobile/Multi-vehicle GPS tracker — mobile app – Pavakie — complete app (opens on Home, press Play).html`
(33 screens, 390×844). Branch: `design/home-map` (Home, bell, full-screen map and Trips tab already done).

## 1. The pattern (what the design is made of)

**Layout**
- Light grey page (`#F2F2F2`), content on white cards. Generous 16–20 px side margins.
- Every screen: a top bar (back ‹ or ✕, 22 px bold title, one round action on the right).
- Lists are white rounded cards (radius 20–22) with a soft shadow; the selected/active card lifts (white, bigger shadow).
- One primary action per screen as a full-width pill button at the bottom (52 px, radius 26).
- Bottom bar: Home · Map · Trips · Profile, active tab in a tinted pill.

**Type** (DM Sans + DM Mono only)
- 22 px/700 titles · 16 px/700 names · 14–15 px body · 12–13 px labels/captions · 28–36 px numbers (speed, km).
- Number plates always in **DM Mono** with wide spacing ("TN 38 BX 4521") — the vehicle's identity everywhere.

**Shapes & sizes**
- Round icon buttons 44–58 px (white, shadow) · chips 40–44 px pills · inputs 52 px white, radius 14 · cards radius 20–22 · sheets radius 26 top.
- Status = coloured dot + word: green moving, black stopped, amber idle, hollow grey offline.
- Small coloured badges on icons for counts (bell 3, wrench 2), red dot for unread.

**Imagery**
- Flat side-view vehicle drawings on a soft tinted tile matching the vehicle's colour.
- Illustrated driver avatars (round, tinted background).

**Motion**
- Small and functional: tab underline slides (0.2 s), panels grow with height (0.3 s ease), map glow on the selected vehicle, sheets slide up, full-screen map grows from its card.

**States designed for**: loading (grey skeleton blocks), offline banner ("Offline · saved 4 min ago"), error ("Couldn't load vehicles · Try again"), empty ("Add your first vehicle"), sample data (dashed banner + "Sample" labels), no GPS, vehicle offline ("Offline since 5:25 PM · last data shown").

## 2. Colours

The design uses red `#D93636` with near-black text. You asked to **keep the app's current colours**, so every design colour is mapped onto the existing palette:

| Design | Becomes (current app) |
|---|---|
| Page `#F2F2F2` | Ice Silver `#DDE3E8` |
| Cards `#FFFFFF` | surface `#F2F5F7` (or white) |
| Text `#202020` / muted `#5E5E5E` | Deep Aubergine `#3A0F34` / `#6D5068` |
| Red buttons, active tab, chips | Marigold `#EAAA00` fill with Aubergine text |
| Red icons on white | Aubergine icons |
| Red tint backgrounds `#FBE4E4` | Marigold tint |
| Green / amber / grey status | unchanged meaning (existing success / marigold / offline) |
| Danger (remove, offline alerts) | existing danger red |

## 3. Screens — design vs. today

| Design screen | Today | Work |
|---|---|---|
| **Home** (+ loading, offline, error, empty, sample) | Done on this branch | Add the missing states, wrench badge (service due), selected-card lift |
| **Map** (+ satellite, no GPS) | Basic map tab | Plate labels on markers, selected-vehicle glow, zoom ±, layers, full screen; bottom sheet with plate chips, vehicle card, address line, ‹ Details › |
| **Vehicle details** (Driver / Service / Tracker tabs, big map, offline) | 8-tab page | New hero (picture, big speed, status + time, address), map card, totals (distance, driving hours, avg), "Replay a day", three tabs |
| **Trips** (+ range, compare) | Simple list | Vehicle chips (multi-select = compare), date + from/to time, week bars, route map, playback slider, totals + speed gauge, compare table |
| **Trip** | Inside vehicle page | Route, play/scrub, from → to with times, distance/duration/avg/top, speed chart, driver card with call |
| **Alerts** | List | Type filter chips with counts, unread dot, mark all read |
| **Notification** (push preview) | Plain push | Rich push: title, body with plate + driver, actions "Call driver" / "Open vehicle" |
| **Drivers** / **Add-Edit driver** / **Driver photo** | Driver = text field | New: drivers with photo, phone, licence + expiry, main/backup per vehicle |
| **Service** (add record) | — | New: service records, next-service progress, reminders |
| **Vehicles** / **Add-Edit vehicle** / **Discard** / **Remove** | Add tracker form | Vehicle list; editor with big coloured picture, type, colour, main driver, plate, name, IMEI counter; discard + type-plate-to-remove dialogs |
| **Profile** / **Edit profile** | Profile list | Header with initials, counts (vehicles, drivers, new alerts), alert toggles, quiet hours, satellite, plates on map; edit name/email/phone/company |

## 4. Backend needed (data the design shows that doesn't exist yet)

1. **Drivers**: `drivers` (name, phone, licence no., licence expiry, photo or illustration) + main/backup driver per vehicle. Existing `driver_name` values move into it.
2. **Vehicle colour** (recolours the vehicle picture).
3. **Service records**: type, date, odometer, garage, cost, next due (date/km) → "In 19 days" bar and the wrench badge.
4. **Vehicle totals**: total distance, driving hours, average speed (from trips).
5. **Alerts**: new "long stop" and "GPS lost" events; per-user toggles (offline, long stop, GPS lost) and quiet hours; push notifications with action buttons.
6. **Address line** ("Mettupalayam Road, near Race Course"): reverse geocoding — see decisions.
7. **Profile**: company field (phone exists on the other branch).
8. **Replay a day / trip playback**: uses existing stored positions.

## 5. Phases (each tested on the emulator before the next)

1. **Foundation** — DM Mono, shared components in the design's shapes (top bar, round buttons, chips, underline tabs, cards, sheets, dialogs, toggles, inputs, pill button), flat vehicle drawings with colour.
2. **Home states + Map tab** — loading/offline/error/empty; map bottom sheet, chips, plate labels, zoom, layers.
3. **Vehicle details** — hero, totals, replay a day, Tracker tab (connection, last GPS, ignition, battery, signal, satellites).
4. **Drivers + vehicle editor** — backend + Drivers grid, add/edit driver, photo sheet, add/edit/remove vehicle.
5. **Service** — backend + Service tab, add record, reminders, wrench badge.
6. **Trips + Trip** — chips, date/time, week bars, playback, compare, trip detail with speed chart.
7. **Alerts + Profile** — type chips, new alert types, rich push, alert settings, quiet hours, profile + edit.
8. **Polish** — sample-data mode, transitions, accessibility, dark mode check, APK.

## 6. Decisions needed

1. Logo: design's bold "Pavakie" + pin tile, or keep the script wordmark.
2. Vehicle pictures: design's flat coloured drawings, or the current 3D renders.
3. Address line: free OpenStreetMap lookup (Nominatim; slow-ish, must be cached and rate-limited), or show coordinates/nothing.
4. Satellite layer: needs a paid map key (MapTiler/Mapbox) — skip or add later.
5. "Try sample data" demo mode: include or skip.
6. Battery: the GT06N reports a level (0–6) and external power, not volts — show % instead of "12.6 V".
