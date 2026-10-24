// Admin login state. Only accounts with role "admin" can use this site.
import { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError, clearSession, getUser, onSessionChange, refreshSession, setSession } from './api';

const AuthContext = createContext(null);

function storedRefreshToken() {
  try {
    return localStorage.getItem('pavakie.admin.refreshToken');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const off = onSessionChange((u) => setUser(u && u.role === 'admin' ? u : null));
    (getUser() ? refreshSession() : Promise.resolve()).finally(() => {
      if (getUser() && getUser().role !== 'admin') clearSession();
      setReady(true);
    });
    return off;
  }, []);

  async function login(email, password) {
    const { data } = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    if (data.user.role !== 'admin') {
      // Not an admin: end that session right away.
      await api('/auth/logout', { method: 'POST', body: { refreshToken: data.refreshToken }, auth: false }).catch(() => {});
      throw new ApiError('This account is not an admin.', { code: 'NOT_ADMIN', status: 403 });
    }
    setSession(data);
    return data.user;
  }

  async function logout() {
    const rt = storedRefreshToken();
    if (rt) await api('/auth/logout', { method: 'POST', body: { refreshToken: rt }, auth: false }).catch(() => {});
    clearSession();
  }

  return <AuthContext.Provider value={{ user: user?.role === 'admin' ? user : null, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
