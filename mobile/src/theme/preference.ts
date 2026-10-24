/**
 * Appearance preference: follow the phone (system), or force light / dark.
 * Saved on the device and applied at app start. Every screen already reads
 * the color scheme through useColors(), so changing it re-themes the app.
 */
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemePref = 'system' | 'light' | 'dark';
const KEY = 'pavakie.themePref';

let current: ThemePref = 'system';
const listeners = new Set<(p: ThemePref) => void>();

function apply(pref: ThemePref) {
  Appearance.setColorScheme(pref === 'system' ? 'auto' : pref);
}

/** Call once at startup, before the first screen renders. */
export async function loadThemePref() {
  try {
    const saved = (await SecureStore.getItemAsync(KEY)) as ThemePref | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') current = saved;
  } catch {
    /* default: system */
  }
  apply(current);
  return current;
}

export async function setThemePref(pref: ThemePref) {
  current = pref;
  apply(pref);
  listeners.forEach((fn) => fn(pref));
  await SecureStore.setItemAsync(KEY, pref).catch(() => {});
}

export function useThemePref() {
  const [pref, setPref] = useState(current);
  useEffect(() => {
    listeners.add(setPref);
    return () => {
      listeners.delete(setPref);
    };
  }, []);
  return pref;
}
