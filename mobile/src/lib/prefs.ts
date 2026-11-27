// Small on-phone preferences (shared across screens, saved in SecureStore).
import { useSyncExternalStore } from 'react';
import * as SecureStore from 'expo-secure-store';

type Prefs = { platesOnMap: boolean; tourSeen: Record<string, boolean> };
const KEY = 'prefs';
let prefs: Prefs = { platesOnMap: true, tourSeen: {} };
let loaded = false;
const listeners = new Set<() => void>();

SecureStore.getItemAsync(KEY)
  .then((raw) => {
    if (raw) prefs = { ...prefs, ...JSON.parse(raw) };
  })
  .catch(() => {})
  .finally(() => {
    loaded = true;
    listeners.forEach((l) => l());
  });

/** True once the saved preferences have been read (so "not seen yet" can be trusted). */
export function usePrefsLoaded(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => loaded,
  );
}

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  prefs = { ...prefs, [key]: value };
  listeners.forEach((l) => l());
  SecureStore.setItemAsync(KEY, JSON.stringify(prefs)).catch(() => {});
}

export function usePref<K extends keyof Prefs>(key: K): Prefs[K] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => prefs[key],
  );
}
