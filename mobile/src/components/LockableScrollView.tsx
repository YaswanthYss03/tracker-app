// A ScrollView that stops scrolling while a finger is on a map inside it, so dragging the map
// pans the map and the page stays put. <AppMap> reports its touches through useScrollLock().
import { createContext, useCallback, useContext, useState } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

const ScrollLock = createContext<(locked: boolean) => void>(() => {});

/** Call with true when a finger goes down on something that pans (a map), false when it lifts. */
export const useScrollLock = () => useContext(ScrollLock);

export function LockableScrollView(props: ScrollViewProps) {
  const [locked, setLocked] = useState(false);
  const lock = useCallback((v: boolean) => setLocked(v), []);
  return (
    <ScrollLock.Provider value={lock}>
      <ScrollView nestedScrollEnabled {...props} scrollEnabled={!locked && props.scrollEnabled !== false} />
    </ScrollLock.Provider>
  );
}
