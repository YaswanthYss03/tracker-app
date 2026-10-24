# Pavakie Tracker — Android app

React Native (Expo SDK 58, Expo Router, TypeScript) app for tracker owners and family. It talks to the same backend as the web site (`../src`), so every screen reuses an existing API.

**Brand:** Ice Silver `#DDE3E8` background · Deep Aubergine `#3A0F34` text · Marigold `#EAAA00` highlights (never as text on the light background) · Pinyon Script (wordmark) · Notable (big numbers) · Prata (headings) · DM Sans (body). Tokens live in `src/theme/`.

## Screens
| Route | What |
|---|---|
| `(auth)/index` | Welcome slides → Create account / Log in |
| `(auth)/login`, `register`, `forgot-password` | Account access; reset password with a 6-digit email code |
| `(app)/(tabs)/index` | My trackers: map + list with live status, "+" to add |
| `(app)/add-tracker` | Scan the IMEI barcode (camera) or type it + activation code |
| `(app)/device/[id]` | Tabs: Live · History (day replay) · Trips · Report · Alerts · Geofences · Sharing (owner) · Settings |
| `(app)/(tabs)/alerts` | Alerts from all trackers |
| `(app)/(tabs)/account` | Profile, password, log out (everywhere), delete account, privacy/terms |
| `share/[token]` | Public live view of a share link |

Code map: `src/api/client.ts` (API + token refresh, secure storage) · `src/auth/` · `src/live/useLive.ts` (WebSocket) · `src/push/push.ts` (Firebase notifications) · `src/components/` (UI kit, map, banners) · `src/screens/device/` (tracker tabs).

## Configuration (environment variables at build time)
| Variable | Default | Purpose |
|---|---|---|
| `API_URL` | `https://15-135-38-209.sslip.io` | Backend address |
| `ALLOW_HTTP` | — | `1` only for local tests against `http://10.0.2.2:3000` (emulator → this computer) |

`google-services.json` (Firebase app config for `com.pavakie.tracker`) is in this folder.

## Quick testing: Expo Go (no build, low memory)
1. Install **Expo Go** from the Play Store on your phone.
2. `npm start` (phone and laptop on the same Wi-Fi; if that's blocked use `npx expo start --tunnel`).
3. Scan the QR code with Expo Go. Code changes appear on the phone instantly.

Push notifications are skipped in Expo Go (the Firebase module only exists in real builds); everything else works against the live server.

## Real APK: EAS Build (Expo's cloud — nothing heavy runs on your laptop)
1. Create a free account at **expo.dev**, then `npx eas-cli login`.
2. `npm run build:apk` → first time it asks to link the project and create a signing key (say yes; Expo stores the key safely).
3. When the build finishes (~10–20 min in the queue), open the link on your phone and install the APK.
`npm run build:store` produces the AAB for the Play Store. Profiles are in `eas.json`.

## Local native build (needs ~10 GB free RAM)
```bash
npm install
npx expo prebuild --platform android --clean        # generates android/ (re-run after changing app.config.ts)

# Test build against the server on this computer (docker compose up), emulator only:
API_URL=http://10.0.2.2:3000 ALLOW_HTTP=1 npx expo prebuild --platform android --clean
cd android && API_URL=http://10.0.2.2:3000 ALLOW_HTTP=1 ./gradlew assembleRelease

# Production build (live server):
cd android && ./gradlew assembleRelease     # -> app/build/outputs/apk/release/app-release.apk
```
Install on a phone: enable "Install unknown apps" for your file manager, copy the APK, open it. Or with USB debugging: `adb install -r app-release.apk`.

During development with hot reload: `npx expo run:android` (installs a development build and starts Metro).

## Maps
Free **MapLibre GL + OpenFreeMap** tiles (OpenStreetMap data) in a WebView: no API key, no fees (`src/components/Map.tsx`). For the iOS release we plan Google Maps; only `Map.tsx` needs replacing because screens pass the same props (markers, route, circles, follow, fitTo).

## Push notifications
The app registers its FCM token after login (`POST /me/push-tokens`) and removes it on logout. The **server** needs the Firebase service-account key at `secrets/firebase.json` to send. Tapping a notification opens that tracker's alerts.

## Releasing to Google Play
1. Create an upload keystore (keep it safe — losing it means you can't update the app):
   `keytool -genkeypair -v -keystore pavakie-upload.jks -alias pavakie -keyalg RSA -keysize 2048 -validity 10000`
2. Configure release signing in `android/app/build.gradle` (or use EAS Build, which manages keys for you).
3. `./gradlew bundleRelease` → `app/build/outputs/bundle/release/app-release.aab`.
4. Play Console ($25 once): create app → upload AAB to **Internal testing** → privacy policy URL `<server>/privacy` → Data safety form (location, email; encrypted in transit; users can delete).
5. Bump `version` and `android.versionCode` in `app.config.ts` for every release.
