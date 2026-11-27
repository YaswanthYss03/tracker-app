// In-app notification ("Settings saved"): showToast() from anywhere; <ToastHost /> in the root layout shows it.
import { useSyncExternalStore } from 'react';

type Toast = { id: number; text: string } | null;
let current: Toast = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

export function showToast(text: string, ms = 2600) {
  current = { id: Date.now(), text };
  listeners.forEach((l) => l());
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    listeners.forEach((l) => l());
  }, ms);
}

export function useToast(): Toast {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
}
