/**
 * Pavakie admin website (admins only).
 *   /login                 admin login
 *   /                      dashboard
 *   /trackers[/:imei]      register, search and manage trackers
 *   /users                 customer accounts and admin roles
 *   /inquiries             contact messages and partner requests
 */
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { useAuth } from './lib/auth';
import { Spinner } from './components/ui';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trackers from './pages/Trackers';
import TrackerDetail from './pages/TrackerDetail';
import Users from './pages/Users';
import Inquiries from './pages/Inquiries';

function RequireAdmin() {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <div className="auth-page"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAdmin />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="trackers" element={<Trackers />} />
          <Route path="trackers/:imei" element={<TrackerDetail />} />
          <Route path="users" element={<Users />} />
          <Route path="inquiries" element={<Inquiries />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
