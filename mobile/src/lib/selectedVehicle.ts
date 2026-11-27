// The vehicle picked last, shared by Home (highlighted row) and the Map tab
// (selected marker and sheet). Kept in memory for this app session.
import { useSyncExternalStore } from 'react';

let selected: string | null = null;
const listeners = new Set<() => void>();

export function selectVehicle(id: string | null) {
  if (id === selected) return;
  selected = id;
  listeners.forEach((l) => l());
}

export function useSelectedVehicle(): string | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selected,
  );
}
