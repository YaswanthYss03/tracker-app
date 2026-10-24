/**
 * "Sign in with Google" on the phone. Gets a Google ID token that the server
 * checks at POST /auth/google. The native module isn't in Expo Go, so the
 * button is hidden there (same idea as push notifications).
 */
import { TurboModuleRegistry } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { isRunningInExpoGo } from 'expo';

export const IN_EXPO_GO =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient || isRunningInExpoGo();

/** False in Expo Go (no native Google module there). */
export function googleSignInAvailable() {
  if (IN_EXPO_GO) return false;
  try {
    return TurboModuleRegistry.get('RNGoogleSignin') != null;
  } catch {
    return false;
  }
}

/** Shows Google's account picker. Returns the ID token, or null if the user cancelled. */
export async function getGoogleIdToken(webClientId: string): Promise<string | null> {
  // Loaded lazily so Expo Go never touches the missing native module.
  if (!googleSignInAvailable()) {
    throw new Error(IN_EXPO_GO ? 'Google sign-in works in the installed app, not in Expo Go.' : 'Google sign-in is not available on this phone.');
  }
  const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } = require('@react-native-google-signin/google-signin');
  GoogleSignin.configure({ webClientId });
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    await GoogleSignin.signOut().catch(() => {}); // always let the user pick the account
    const res = await GoogleSignin.signIn();
    if (!isSuccessResponse(res)) return null;
    return res.data.idToken ?? null;
  } catch (e) {
    const err = e as { code?: string };
    if (isErrorWithCode(err) && (err.code === statusCodes.SIGN_IN_CANCELLED || err.code === statusCodes.IN_PROGRESS)) return null;
    if (isErrorWithCode(err) && err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play services are needed for Google sign-in.');
    }
    throw new Error('Google sign-in failed. Please try again or use your email.');
  }
}
