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
 *   /privacy, /terms, /cookies, /refunds   legal pages (public)
 *   anything else                    404 page
 */
import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router';
import { useAuth } from './lib/auth';
import { Spinner } from './components/ui';
import { CustomerLayout } from './components/Layout';
import Login from './pages/Login';
const Register = lazy(() => import('./pages/Register'));
const Forgot = lazy(() => import('./pages/Forgot'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Vehicles = lazy(() => import('./pages/Vehicles'));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'));
const MapPage = lazy(() => import('./pages/MapPage'));
const ReplayPage = lazy(() => import('./pages/Replay'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Drivers = lazy(() => import('./pages/Drivers'));
const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));
const Partner = lazy(() => import('./pages/Partner'));
const Share = lazy(() => import('./pages/Share'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));
const Cookies = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Cookies })));
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })));
const Refunds = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Refunds })));

// Browser tab title and search-engine description for each page.
const DEFAULT_DESC = 'Pavakie Tracker: live location, replay, alerts and service records for your vehicles.';
const PAGES = [
  [/^\/login$/, 'Log in', 'Log in to Pavakie Tracker to see where your vehicles are.'],
  [/^\/register$/, 'Create account', 'Create a Pavakie Tracker account and add your vehicle tracker.'],
  [/^\/forgot$/, 'Reset password', 'Reset your Pavakie Tracker password with an emailed code.'],
  [/^\/privacy$/, 'Privacy Policy', 'What Pavakie Tracker collects, why, who sees it and your choices.'],
  [/^\/terms$/, 'Terms of Service', 'The terms for using Pavakie Tracker.'],
  [/^\/cookies$/, 'Cookie Policy', 'What the Pavakie Tracker website stores in your browser.'],
  [/^\/refunds$/, 'Refund Policy', 'Returns, cancellation, warranty and refunds for Pavakie trackers and plans.'],
  [/^\/share\//, 'Live location', 'A shared live vehicle location from Pavakie Tracker.'],
  [/^\/$/, 'Dashboard'],
  [/^\/vehicles$/, 'Vehicles'],
  [/^\/vehicles\/[^/]+\/replay$/, 'Vehicle replay'],
  [/^\/vehicles\/[^/]+\/trips$/, 'Vehicle trips'],
  [/^\/vehicles\/[^/]+\/report$/, 'Vehicle report'],
  [/^\/vehicles\/[^/]+\/alerts$/, 'Vehicle alerts'],
  [/^\/vehicles\/[^/]+\/geofences$/, 'Vehicle geofences'],
  [/^\/vehicles\/[^/]+\/settings$/, 'Vehicle settings'],
  [/^\/vehicles\//, 'Vehicle'],
  [/^\/map$/, 'Live map'],
  [/^\/replay$/, 'Replay'],
  [/^\/alerts$/, 'Alerts'],
  [/^\/drivers$/, 'Drivers'],
  [/^\/profile$/, 'Profile and settings'],
  [/^\/contact$/, 'Contact us'],
  [/^\/partner$/, 'Partner with us'],
];

function TitleManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const hit = PAGES.find(([re]) => re.test(pathname));
    document.title = hit ? `${hit[1]} | Pavakie` : 'Page not found | Pavakie';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', hit?.[2] || DEFAULT_DESC);
  }, [pathname]);
  return null;
}

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
    <Suspense fallback={<Spinner />}>
    <TitleManager />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/share/:token" element={<Share />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/refunds" element={<Refunds />} />

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

      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}
