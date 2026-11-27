// Thin bar shown while the browser is offline, so a stalled page is explained.
import { useSyncExternalStore } from 'react';
import Icon from './Icon';

const subscribe = (cb) => {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => { window.removeEventListener('online', cb); window.removeEventListener('offline', cb); };
};

export function useOnline() {
  return useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
}

export default function OfflineBanner() {
  if (useOnline()) return null;
  return (
    <div className="offline-bar" role="status">
      <Icon name="info" size={16} />
      You are offline. Showing the last information we have; it will refresh when you reconnect.
    </div>
  );
}
