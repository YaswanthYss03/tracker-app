/**
 * Live updates over the WebSocket (same protocol as web/src/lib/live.js).
 *   const { live, connected } = useLive(deviceIds, { onAlert })
 * Reconnects with a fresh token after expiry; pauses while the app is in the background.
 */
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { io, type Socket } from 'socket.io-client';
import { API_URL } from '@/config';
import { getAccessToken, refreshSession } from '@/api/client';
import type { AlertEvent, Live } from '@/api/types';

type Handlers = { onAlert?: (a: AlertEvent) => void; onRevoked?: (deviceId: string) => void };

export function useLive(deviceIds: string[], handlers: Handlers = {}) {
  const [live, setLive] = useState<Record<string, Live>>({});
  const [connected, setConnected] = useState(false);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const h = useRef(handlers);
  h.current = handlers;
  const key = [...deviceIds].sort().join(',');

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => setAppActive(s === 'active'));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!key || !appActive) return undefined;
    const ids = key.split(',');
    let socket: Socket | null = null;
    let cancelled = false;

    async function connect() {
      const token = await getAccessToken();
      if (cancelled || !token) return;
      socket = io(API_URL, { auth: { token }, transports: ['websocket'], reconnectionDelayMax: 10_000 });
      socket.on('connect', () => {
        setConnected(true);
        for (const deviceId of ids) {
          socket!.emit('subscribe', { deviceId }, (res: { ok: boolean; live?: Live }) => {
            if (res?.ok && res.live) setLive((prev) => ({ ...prev, [deviceId]: res.live! }));
          });
        }
      });
      socket.on('disconnect', () => setConnected(false));
      socket.on('live', (state: Live & { deviceId: string }) => setLive((prev) => ({ ...prev, [state.deviceId]: state })));
      socket.on('alert', (a: AlertEvent) => h.current.onAlert?.(a));
      socket.on('access_revoked', (p: { deviceId: string }) => h.current.onRevoked?.(p.deviceId));
      const reauth = async () => {
        socket?.close();
        if (!cancelled && (await refreshSession())) connect();
      };
      socket.on('session_expired', reauth);
      socket.on('connect_error', (err: any) => {
        if (['UNAUTHORIZED', 'TOKEN_EXPIRED'].includes(err?.data?.code)) reauth();
      });
    }

    connect();
    return () => {
      cancelled = true;
      socket?.close();
      setConnected(false);
    };
  }, [key, appActive]);

  return { live, connected };
}
