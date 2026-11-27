/**
 * Routes
 *   /login, /register, /forgot       sign in, sign up, reset password
 *   /                                dashboard
 *   /vehicles                        all vehicles
 *   /vehicles/:id/:section?          one vehicle: overview, replay, trips, report, alerts, geofences, settings
 *   /map                             live map
 *   /replay                          replay a day, compare vehicles
 *   /alerts                          alerts from all vehicles
 *   /drivers                         drivers
 *   /profile, /contact, /partner     account and help
 *   /share/:token                    public live link (no login)
 *   /privacy, /terms                 legal pages (public)
 */
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router';
import { useAuth } from './lib/auth';
import { Spinner } from './components/ui';
import { CustomerLayout } from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import MapPage from './pages/MapPage';
import ReplayPage from './pages/Replay';
import Alerts from './pages/Alerts';
import Drivers from './pages/Drivers';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Partner from './pages/Partner';
import Share from './pages/Share';
import { Privacy, Terms } from './pages/Legal';

function RequireUser() {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Spinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

// Old links: /devices/:id
function OldDevice() {
  const { id } = useParams();
  return <Navigate to={`/vehicles/${id}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/share/:token" element={<Share />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      <Route element={<RequireUser />}>
        <Route element={<CustomerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/:id/:section?" element={<VehicleDetail />} />
          <Route path="devices/:id" element={<OldDevice />} />
          <Route path="map" element={<MapPage />} />
          <Route path="replay" element={<ReplayPage />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Navigate to="/profile" replace />} />
          <Route path="contact" element={<Contact />} />
          <Route path="partner" element={<Partner />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
