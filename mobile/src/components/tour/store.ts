// App tour state: which tour step is showing, and the screen elements it can point at.
// Screens register an element with useTourTarget('id'); the overlay measures it when its step shows.
import { useEffect, useRef, useSyncExternalStore, type ComponentRef } from 'react';
import type { View } from 'react-native';

export type ViewNode = ComponentRef<typeof View>;

// Bottom tab bar geometry, shared by the bar and the tour (which highlights tabs by position).
export const TAB_BAR = { height: 70, padTop: 6, padBottom: 8, padX: 8, count: 4 };

const targets = new Map<string, { current: ViewNode | null }>();

export function useTourTarget(id: string | undefined) {
  const ref = useRef<ViewNode>(null);
  useEffect(() => {
    if (!id) return;
    targets.set(id, ref);
    return () => {
      if (targets.get(id) === ref) targets.delete(id);
    };
  }, [id]);
  return ref;
}

export function getTarget(id: string) {
  return targets.get(id)?.current ?? null;
}

type State = { active: boolean };
let state: State = { active: false };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

export const startTour = () => set({ active: true });
export const stopTour = () => set({ active: false });

export function useTourActive(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state.active,
  );
}
