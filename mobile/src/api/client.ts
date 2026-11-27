/**
 * API client (same logic as web/src/lib/api.js).
 *
 * - Access token (15 min) lives in memory only.
 * - Refresh token is kept in Android secure storage (expo-secure-store), so
 *   the app stays logged in across restarts. On 401 the client refreshes
 *   once (the server rotates the refresh token) and retries.
 */
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/config';
import type { User } from './types';

const RT_KEY = 'pavakie.refreshToken';
const USER_KEY = 'pavakie.user';
const BASE = `${API_URL}/api/v1`;

type Session = { accessToken: string | null; refreshToken: string | null; user: User | null };
const session: Session = { accessToken: null, refreshToken: null, user: null };

const listeners = new Set<(u: User | null) => void>();
export function onSessionChange(fn: (u: User | null) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
const notify = () => listeners.forEach((fn) => fn(session.user));

/** Loads the saved session at app start. */
export async function loadSession(): Promise<User | null> {
  try {
    session.refreshToken = await SecureStore.getItemAsync(RT_KEY);
    const raw = await SecureStore.getItemAsync(USER_KEY);
    session.user = raw ? JSON.parse(raw) : null;
  } catch {
    session.refreshToken = null;
    session.user = null;
  }
  return session.user;
}

export function getUser() {
  return session.user;
}

export async function setSession(data: { user?: User; accessToken?: string; refreshToken?: string }) {
  session.user = data.user ?? session.user;
  session.accessToken = data.accessToken ?? null;
  session.refreshToken = data.refreshToken ?? null;
  await persist();
  notify();
}

export async function updateUser(user: User) {
  session.user = user;
  await persist();
  notify();
}

export async function clearSession() {
  session.user = null;
  session.accessToken = null;
  session.refreshToken = null;
  await persist();
  notify();
}

async function persist() {
  try {
    if (session.refreshToken) await SecureStore.setItemAsync(RT_KEY, session.refreshToken);
    else await SecureStore.deleteItemAsync(RT_KEY);
    if (session.user) await SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user));
    else await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    /* secure storage unavailable: session just won't survive a restart */
  }
}

export function getRefreshToken() {
  return session.refreshToken;
}

export class ApiError extends Error {
  code?: string;
  status?: number;
  details?: { field?: string; message: string }[];
  constructor(message: string, opts: { code?: string; status?: number; details?: ApiError['details'] } = {}) {
    super(message);
    Object.assign(this, opts);
  }
}

const NETWORK_MESSAGE = 'No internet connection. Check your network and try again.';
const SERVER_MESSAGE = "We can't reach the server right now. Please try again in a moment.";
const TIMEOUT_MS = 20000;

/** fetch that gives up after 20 s (a bad connection can otherwise hang for minutes). */
async function request(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch (err) {
    const timedOut = (err as Error)?.name === 'AbortError';
    throw new ApiError(timedOut ? 'The server is taking too long to answer. Please try again.' : NETWORK_MESSAGE, { code: 'NETWORK' });
  } finally {
    clearTimeout(timer);
  }
}

let refreshing: Promise<boolean> | null = null;

/** New token pair. false (and logged out) if the session is gone; network errors keep the session. */
export function refreshSession(): Promise<boolean> {
  if (!session.refreshToken) return Promise.resolve(false);
  refreshing ??= (async () => {
    try {
      const res = await request(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
      if (!res.ok) {
        if (res.status === 401) await clearSession();
        return false;
      }
      const { data } = await res.json();
      await setSession(data);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

export async function getAccessToken() {
  if (!session.accessToken) await refreshSession();
  return session.accessToken;
}

type Options = { method?: string; body?: unknown; auth?: boolean };

/** api('/devices'), api('/devices/claim', { method: 'POST', body }) -> parsed JSON (null for 204). */
export async function api<T = any>(path: string, { method = 'GET', body, auth = true }: Options = {}): Promise<T> {
  const send = () =>
    request(BASE + path, {
      method,
      headers: {
        accept: 'application/json',
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(auth && session.accessToken ? { authorization: `Bearer ${session.accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  if (auth && !session.accessToken && session.refreshToken) await refreshSession();
  let res = await send();
  if (res.status === 401 && auth && session.refreshToken && (await refreshSession())) res = await send();
  if (res.status === 204) return null as T;

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    if (res.status === 401 && auth) await clearSession();
    // A 5xx with no JSON body is the proxy or load balancer answering for a server that is down.
    const unreachable = res.status >= 500 && !json?.error;
    throw new ApiError(json?.error?.message || (unreachable ? SERVER_MESSAGE : `Request failed (${res.status})`), {
      code: json?.error?.code || (unreachable ? 'SERVER' : undefined),
      status: res.status,
      details: json?.error?.details,
    });
  }
  return json as T;
}

/** One readable line for an error, including field details. */
export function errorText(err: unknown): string {
  if (!err) return '';
  const e = err as ApiError;
  if (e.details?.length) return e.details.map((d) => `${d.field || 'value'}: ${d.message}`).join(' · ');
  return e.message || 'Something went wrong';
}
