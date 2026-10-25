// Expo app configuration.
//
// Environment variables (set in mobile/.env or your shell before building):
//   API_URL                  backend address (default: the live beta server)
//   (Maps: free MapLibre + OpenFreeMap tiles, no key needed. Google Maps comes later with the iOS app.)
//   ALLOW_HTTP=1             local testing only: allow plain-HTTP API (e.g. http://10.0.2.2:3000 from the emulator)
import type { ExpoConfig } from 'expo/config';

const API_URL = process.env.API_URL || 'https://15-135-38-209.sslip.io';
const ALLOW_HTTP = process.env.ALLOW_HTTP === '1';

const config: ExpoConfig = {
  name: 'Pavakie Tracker',
  slug: 'pavakie-tracker',
  scheme: 'pavakie',
  version: '1.1.1',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  android: {
    package: 'com.pavakie.tracker',
    versionCode: 3,
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      backgroundColor: '#3A0F34',
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: ['android.permission.CAMERA', 'android.permission.POST_NOTIFICATIONS'],
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#DDE3E8',
        image: './assets/images/splash-icon.png',
        imageWidth: 220,
        dark: { backgroundColor: '#1C0A1A', image: './assets/images/splash-icon-dark.png' },
      },
    ],
    'expo-secure-store',
    ['expo-camera', { cameraPermission: 'Scan the IMEI barcode on your tracker box.', recordAudioAndroid: false }],
    // Driver photos: take one or choose from files
    ['expo-image-picker', { photosPermission: 'Choose a photo for a driver.', cameraPermission: 'Take a photo of a driver.', microphonePermission: false }],
    '@react-native-firebase/app',
    '@react-native-firebase/messaging',
    // Sign in with Google (Android reads the OAuth setup from google-services.json)
    '@react-native-google-signin/google-signin',
    ['expo-build-properties', { android: { minSdkVersion: 26, usesCleartextTraffic: ALLOW_HTTP } }],
  ],
  extra: {
    apiUrl: API_URL,
    // Google sign-in Web client ID (public, not a secret). The server's /app/config can override it.
    googleWebClientId:
      process.env.GOOGLE_WEB_CLIENT_ID || '182333320089-o1rdce5a5ualcm5u60tal253kdnv8l5g.apps.googleusercontent.com',
  },
  experiments: { typedRoutes: true },
};

export default config;
