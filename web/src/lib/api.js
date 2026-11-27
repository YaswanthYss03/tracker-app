/**
 * API client.
 *
 * - The access token (15 min) lives in memory only.
 * - The refresh token is kept in localStorage so a page reload stays logged
 *   in. When a request gets 401, the client refreshes once (rotating the
 *   refresh token) and retries.
 * - Errors are thrown as ApiError with the server's code and message.
 */

const BASE = '/api/v1';
const RT_KEY = 'gps.refreshToken';
const USER_KEY = 'gps.user';

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode etc. — session just won't survive a reload */
  }
}

const session = {
  accessToken: null,
  refreshToken: readStorage(RT_KEY),
  user: (() => {
    try {
      return JSON.parse(readStorage(USER_KEY) || 'null');
    } catch {
      return null;
    }
  })(),
};

const listeners = new Set();
export function onSessionChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify() {
  for (const fn of listeners) fn(session.user);
}

export function getUser() {
  return session.user;
}

export function setSession({ user, accessToken, refreshToken }) {
  session.user = user ?? session.user;
  session.accessToken = accessToken ?? null;
  session.refreshToken = refreshToken ?? null;
  writeStorage(RT_KEY, session.refreshToken);
  writeStorage(USER_KEY, session.user ? JSON.stringify(session.user) : null);
  notify();
}

/** Updates the stored user (e.g. after a profile change) without touching tokens. */
export function updateUser(user) {
  session.user = user;
  writeStorage(USER_KEY, JSON.stringify(user));
  notify();
}

export function clearSession() {
  session.user = null;
  session.accessToken = null;
  session.refreshToken = null;
  writeStorage(RT_KEY, null);
  writeStorage(USER_KEY, null);
  notify();
}

export class ApiError extends Error {
  constructor(message, { code, status, details } = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const NETWORK_MESSAGE = 'No internet connection. Check your network and try again.';
const SERVER_MESSAGE = "We can't reach the server right now. Please try again in a moment.";
const TIMEOUT_MS = 20000;

/** fetch that gives up after 20 s and reports "offline" the same way whether the browser knows it or not. */
async function request(url, init) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new ApiError(NETWORK_MESSAGE, { code: 'NETWORK' });
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    if (err?.name === 'TimeoutError') throw new ApiError('The server is taking too long to answer. Please try again.', { code: 'NETWORK' });
    throw new ApiError(NETWORK_MESSAGE, { code: 'NETWORK' });
  }
}

let refreshing = null;
/** Gets a new token pair. Returns false (and logs out) if the session is gone. */
export function refreshSession() {
  if (!session.refreshToken) return Promise.resolve(false);
  refreshing ??= (async () => {
    try {
      const res = await request(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
      if (!res.ok) {
        // Only a rejected token ends the session; a server hiccup (5xx) must not log anyone out.
        if (res.status === 401) clearSession();
        return false;
      }
      const { data } = await res.json();
      setSession(data);
      return true;
    } catch {
      return false; // network error: keep the session, try again later
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

/** A valid access token, refreshing if needed (used by the WebSocket). */
export async function getAccessToken() {
  if (!session.accessToken) await refreshSession();
  return session.accessToken;
}

/**
 * api('/devices'), api('/devices/claim', { method: 'POST', body: {...} })
 * Returns the parsed JSON body (or null for 204).
 */
export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const send = () =>
    request(BASE + path, {
      method,
      headers: {
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(auth && session.accessToken ? { authorization: `Bearer ${session.accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  if (auth && !session.accessToken && session.refreshToken) await refreshSession();
  let res = await send();
  if (res.status === 401 && auth && session.refreshToken && (await refreshSession())) {
    res = await send();
  }
  if (res.status === 204) return null;

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* empty or non-JSON body */
  }
  if (!res.ok) {
    if (res.status === 401 && auth) clearSession();
    // A 5xx with no JSON body is the proxy or load balancer answering for a server that is down.
    const unreachable = res.status >= 500 && !json?.error;
    throw new ApiError(json?.error?.message || (unreachable ? SERVER_MESSAGE : `Request failed (${res.status})`), {
      code: json?.error?.code || (unreachable ? 'SERVER' : undefined),
      status: res.status,
      details: json?.error?.details,
    });
  }
  return json;
}

/** Turns an ApiError into one readable line (with field details if any). */
export function errorText(err) {
  if (!err) return '';
  if (err.details?.length) return err.details.map((d) => `${d.field || 'value'}: ${d.message}`).join(' · ');
  return err.message || 'Something went wrong';
}
