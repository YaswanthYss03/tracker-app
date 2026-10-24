/**
 * Live updates over the WebSocket.
 *
 *   const { live, connected } = useLive(deviceIds, { onAlert })
 *   live[deviceId] -> latest live state ({ lat, lon, speed, ignition, online, ... })
 *
 *   useShareLive(shareToken) for the public share page.
 */
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getAccessToken, refreshSession } from './api';

export function useLive(deviceIds, { onAlert, onRevoked } = {}) {
  const [live, setLive] = useState({});
  const [connected, setConnected] = useState(false);
  const handlers = useRef({ onAlert, onRevoked });
  handlers.current = { onAlert, onRevoked };
  const key = [...deviceIds].sort().join(',');

  useEffect(() => {
    if (!key) return undefined;
    const ids = key.split(',');
    let socket;
    let cancelled = false;

    async function connect() {
      const token = await getAccessToken();
      if (cancelled || !token) return;
      socket = io({ auth: { token }, transports: ['websocket'], reconnectionDelayMax: 10_000 });

      socket.on('connect', () => {
        setConnected(true);
        for (const deviceId of ids) {
          socket.emit('subscribe', { deviceId }, (res) => {
            if (res?.ok) setLive((prev) => ({ ...prev, [deviceId]: res.live }));
          });
        }
      });
      socket.on('disconnect', () => setConnected(false));
      socket.on('live', (state) => setLive((prev) => ({ ...prev, [state.deviceId]: state })));
      socket.on('alert', (a) => handlers.current.onAlert?.(a));
      socket.on('access_revoked', (p) => handlers.current.onRevoked?.(p.deviceId));
      // Token expired or rejected: refresh it and reconnect with the new one.
      const reauth = async () => {
        socket.close();
        if (!cancelled && (await refreshSession())) connect();
      };
      socket.on('session_expired', reauth);
      socket.on('connect_error', (err) => {
        if (['UNAUTHORIZED', 'TOKEN_EXPIRED'].includes(err?.data?.code)) reauth();
      });
    }

    connect();
    return () => {
      cancelled = true;
      socket?.close();
    };
  }, [key]);

  return { live, connected };
}

export function useShareLive(shareToken) {
  const [live, setLive] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io({ auth: { shareToken }, transports: ['websocket'], reconnectionDelayMax: 10_000 });
    socket.on('live', setLive);
    socket.on('connect_error', (err) => {
      if (err?.data?.code === 'SHARE_LINK_INVALID') {
        setError('This link has expired or was revoked.');
        socket.close();
      }
    });
    socket.on('session_expired', () => {
      setError('This link has expired.');
      socket.close();
    });
    return () => socket.close();
  }, [shareToken]);

  return { live, error };
}
