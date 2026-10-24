/**
 * Push notifications (Firebase Cloud Messaging).
 *
 * While logged in: ask permission (Android 13+), send this phone's FCM token
 * to the server (POST /me/push-tokens), keep it updated, and open the right
 * tracker when a notification is tapped. On logout the token is removed so
 * the phone stops getting that account's alerts.
 *
 * The server sends alerts to the Android channel "alerts"; if the channel
 * doesn't exist yet, Android shows them in the default channel.
 *
 * In Expo Go (quick testing without a native build) the Firebase native
 * module doesn't exist, so push is skipped there and everything else works.
 */
import { useEffect } from 'react';
import { PermissionsAndroid, Platform, TurboModuleRegistry } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { isRunningInExpoGo } from 'expo';
import type { RemoteMessage } from '@react-native-firebase/messaging';
import { api } from '@/api/client';

const TOKEN_KEY = 'pavakie.pushToken';

const IN_EXPO_GO =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient || isRunningInExpoGo();

/**
 * Firebase messaging, loaded only when its native module is actually in the
 * app (real builds). Expo Go doesn't contain it, and requiring the JS package
 * there throws "Native module NativeRNFBTurboApp is not registered".
 */
function loadMessaging(): typeof import('@react-native-firebase/messaging') | null {
  if (IN_EXPO_GO) return null;
  if (!TurboModuleRegistry.get('NativeRNFBTurboApp') && !TurboModuleRegistry.get('RNFBAppModule')) return null;
  try {
    return require('@react-native-firebase/messaging');
  } catch {
    return null;
  }
}

async function saveToken(token: string) {
  await api('/me/push-tokens', { method: 'POST', body: { token, platform: Platform.OS === 'ios' ? 'ios' : 'android' } });
  await SecureStore.setItemAsync(TOKEN_KEY, token).catch(() => {});
}

function openFromMessage(message: RemoteMessage | null) {
  const deviceId = message?.data?.deviceId;
  if (typeof deviceId === 'string') router.push({ pathname: '/device/[id]', params: { id: deviceId, tab: 'alerts' } });
}

export function usePushNotifications() {
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    let cancelled = false;

    (async () => {
      const fcm = loadMessaging();
      if (!fcm) return; // Expo Go: no push
      const { getInitialNotification, getMessaging, getToken, onNotificationOpenedApp, onTokenRefresh, requestPermission } = fcm;
      try {
        if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
          const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
          if (result !== PermissionsAndroid.RESULTS.GRANTED) return;
        }
        const messaging = getMessaging();
        await requestPermission(messaging);
        const token = await getToken(messaging);
        if (cancelled) return;
        await saveToken(token);
        unsubscribers.push(onTokenRefresh(messaging, (t) => saveToken(t).catch(() => {})));
        unsubscribers.push(onNotificationOpenedApp(messaging, openFromMessage));
        openFromMessage(await getInitialNotification(messaging)); // app was opened from a notification
      } catch (err) {
        console.warn('Push notifications unavailable:', (err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribers.forEach((u) => u());
    };
  }, []);
}

/** Call before logging out. */
export async function unregisterPush() {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) await api('/me/push-tokens', { method: 'DELETE', body: { token } });
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* best effort */
  }
}
