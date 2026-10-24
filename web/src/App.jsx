/**
 * Routes
 *   /login, /register            sign in / sign up
 *   /                            customer: my trackers
 *   /devices/:id                 customer: one tracker (live, history, trips, report, alerts, geofences, sharing, settings)
 *   /account                     customer: profile, password, delete account
 *   /share/:token                public share link (no login)
 *   /privacy, /terms             legal pages (public; linked from the app and Play Store)
 */
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { useAuth } from './lib/auth';
import { Spinner } from './components/ui';
import { CustomerLayout } from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Devices from './pages/customer/Devices';
import DeviceDetail from './pages/customer/DeviceDetail';
import Account from './pages/customer/Account';
import Share from './pages/Share';
import { Privacy, Terms } from './pages/Legal';

function RequireUser() {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Spinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/share/:token" element={<Share />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      <Route element={<RequireUser />}>
        <Route element={<CustomerLayout />}>
          <Route index element={<Devices />} />
          <Route path="devices/:id" element={<DeviceDetail />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Route>


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
