// Login state for the whole app.
import { createContext, useContext, useEffect, useState } from 'react';
import { api, clearSession, getUser, onSessionChange, refreshSession, setSession, updateUser } from './api';

const AuthContext = createContext(null);

function storedRefreshToken() {
  try {
    return localStorage.getItem('gps.refreshToken');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const off = onSessionChange(setUser);
    // Restore the session after a page reload.
    (getUser() ? refreshSession() : Promise.resolve()).finally(() => setReady(true));
    return off;
  }, []);

  async function login(email, password) {
    const { data } = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    setSession(data);
    return data.user;
  }

  /** Returns the user, or { verificationRequired, email } when the email must be confirmed first. */
  async function register(fields) {
    const { data } = await api('/auth/register', { method: 'POST', body: fields, auth: false });
    if (data.verificationRequired) return data;
    setSession(data);
    return data.user;
  }

  /** Finishes sign-up/login after /auth/verify-email returned tokens. */
  function completeVerification(data) {
    setSession(data);
    return data.user;
  }

  async function logout() {
    const rt = storedRefreshToken();
    if (rt) await api('/auth/logout', { method: 'POST', body: { refreshToken: rt }, auth: false }).catch(() => {});
    clearSession();
  }

  async function reloadUser() {
    const { data } = await api('/me');
    updateUser(data);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, completeVerification, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
