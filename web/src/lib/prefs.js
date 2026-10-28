// Small preferences kept in this browser: theme and "plates on map".
import { useSyncExternalStore } from 'react';

const listeners = new Set();
const read = (k, d) => {
  try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; }
};
const state = { theme: read('pk.theme', 'system'), platesOnMap: read('pk.platesOnMap', true) };

function apply() {
  const el = document.documentElement;
  if (state.theme === 'system') el.removeAttribute('data-theme');
  else el.setAttribute('data-theme', state.theme);
}
apply();

export function setPref(key, value) {
  state[key] = value;
  try { localStorage.setItem(`pk.${key}`, JSON.stringify(value)); } catch { /* private mode */ }
  apply();
  listeners.forEach((l) => l());
}

export function usePref(key) {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state[key],
  );
}
