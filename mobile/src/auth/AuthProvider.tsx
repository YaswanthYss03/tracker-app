// Login state for the whole app (same flow as web/src/lib/auth.jsx).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, clearSession, getRefreshToken, loadSession, onSessionChange, refreshSession, setSession, updateUser } from '@/api/client';
import type { User } from '@/api/types';
import { unregisterPush } from '@/push/push';

type AuthValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  /** Returns the user, or { verificationRequired, email } when the email must be confirmed first. */
  register: (fields: { email: string; password: string; name?: string; acceptTerms: boolean }) => Promise<User | Verification>;
  /** Confirms the emailed code and logs in. */
  verifyEmail: (email: string, code: string) => Promise<User>;
  /** Logs in (or signs up) with a Google ID token. */
  loginWithGoogle: (idToken: string) => Promise<User>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

export type Verification = { verificationRequired: true; email: string };

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const off = onSessionChange(setUser);
    (async () => {
      const saved = await loadSession();
      setUser(saved);
      if (saved) await refreshSession(); // gets a fresh access token (or logs out if the session expired)
      setReady(true);
    })();
    return off;
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    await setSession(data);
    return data.user as User;
  }

  async function register(fields: { email: string; password: string; name?: string; acceptTerms: boolean }) {
    const { data } = await api('/auth/register', { method: 'POST', body: fields, auth: false });
    if (data.verificationRequired) return data as Verification;
    await setSession(data);
    return data.user as User;
  }

  async function loginWithGoogle(idToken: string) {
    const { data } = await api('/auth/google', { method: 'POST', body: { idToken }, auth: false });
    await setSession(data);
    return data.user as User;
  }

  async function verifyEmail(email: string, code: string) {
    const { data } = await api('/auth/verify-email', { method: 'POST', body: { email, code }, auth: false });
    await setSession(data);
    return data.user as User;
  }

  async function logout() {
    await unregisterPush();
    const rt = getRefreshToken();
    if (rt) await api('/auth/logout', { method: 'POST', body: { refreshToken: rt }, auth: false }).catch(() => {});
    await clearSession();
  }

  async function reloadUser() {
    const { data } = await api('/me');
    await updateUser(data);
  }

  return <AuthContext.Provider value={{ user, ready, login, register, verifyEmail, loginWithGoogle, logout, reloadUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
