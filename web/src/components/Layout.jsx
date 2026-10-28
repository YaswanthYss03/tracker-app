// Signed-in shell: sidebar navigation, top bar (search, alerts, theme, account) and the page.
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { FleetProvider, useFleet, useUnreadAlerts } from '../lib/data';
import { initials, plateOrName } from '../lib/format';
import { STATUS_LABEL, statusGroup } from '../lib/status';
import { setPref, usePref } from '../lib/prefs';
import Icon from './Icon';
import { IconButton, Menu, MenuItem } from './ui';
import { VehicleThumb } from './vehicle';

const NAV = [
  ['/', 'Dashboard', 'dashboard', true],
  ['/vehicles', 'Vehicles', 'car'],
  ['/map', 'Live map', 'map'],
  ['/replay', 'Replay', 'trips'],
  ['/alerts', 'Alerts', 'bell'],
  ['/drivers', 'Drivers', 'users'],
];

export function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark"><Icon name="pin" size={20} stroke={2.2} /></div>
      <div className="brand-name">Pavakie</div>
    </div>
  );
}

function Sidebar({ open, onClose }) {
  const unread = useUnreadAlerts();
  const { user } = useAuth();
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main">
      <Brand />
      <nav className="nav-group">
        {NAV.map(([to, label, icon, end]) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Icon name={icon} size={20} />
            {label}
            {to === '/alerts' && unread > 0 && <span className="count">{unread > 99 ? '99+' : unread}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="nav-label">Account</div>
      <nav className="nav-group">
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}><Icon name="user" size={20} />Profile and settings</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}><Icon name="help" size={20} />Help and contact</NavLink>
      </nav>
      <div className="sidebar-foot">
        <div className="row" style={{ padding: '6px 8px' }}>
          <div className="initials" style={{ width: 36, height: 36, fontSize: 13 }}>{initials(user?.name, user?.email)}</div>
          <div style={{ minWidth: 0 }}>
            <div className="bold ellipsis small">{user?.name || 'Your account'}</div>
            <div className="tiny muted ellipsis">{user?.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Jump to a vehicle by plate, name or driver. */
function VehicleSearch() {
  const { devices, stateOf } = useFleet();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  useEffect(() => {
    const down = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, []);
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return devices.filter((d) => [d.registrationNumber, d.name, d.driverName, d.imei].some((v) => v?.toLowerCase().includes(s))).slice(0, 6);
  }, [q, devices]);
  return (
    <div className="search" ref={box}>
      <Icon name="search" size={18} className="icon" />
      <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Search vehicle, plate or driver" aria-label="Search vehicles" />
      {open && q.trim() && (
        <div className="search-results">
          {hits.length === 0 && <div className="muted small" style={{ padding: 12 }}>No vehicle matches.</div>}
          {hits.map((d) => (
            <button key={d.id} type="button" onClick={() => { setOpen(false); setQ(''); nav(`/vehicles/${d.id}`); }}>
              <VehicleThumb device={d} size="sm" />
              <div style={{ minWidth: 0 }}>
                <div className="plate">{plateOrName(d)}</div>
                <div className="tiny muted">{d.driverName || 'No driver'} - {STATUS_LABEL[statusGroup(stateOf(d))]}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { connected } = useFleet();
  const unread = useUnreadAlerts();
  const theme = usePref('theme');
  const nav = useNavigate();
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  return (
    <header className="topbar">
      <IconButton className="menu-btn" icon="menu" label="Open menu" onClick={onMenu} />
      <VehicleSearch />
      <div className="right row" style={{ gap: 6 }}>
        {connected && <span className="live-dot" title="Live updates are on">Live</span>}
        <IconButton icon={dark ? 'sun' : 'moon'} label={dark ? 'Switch to light' : 'Switch to dark'} onClick={() => setPref('theme', dark ? 'light' : 'dark')} />
        <IconButton icon="bell" label={unread ? `Alerts, ${unread} new` : 'Alerts'} badge={unread} onClick={() => nav('/alerts')} />
        <Menu trigger={<button type="button" className="initials" style={{ width: 38, height: 38, fontSize: 13, border: 0, cursor: 'pointer', marginLeft: 4 }} aria-label="Account menu">{initials(user?.name, user?.email)}</button>}>
          <div style={{ padding: '8px 12px 6px' }}>
            <div className="bold ellipsis">{user?.name || 'Your account'}</div>
            <div className="tiny muted ellipsis">{user?.email}</div>
          </div>
          <hr className="divider" />
          <MenuItem icon="user" onClick={() => nav('/profile')}>Profile and settings</MenuItem>
          <MenuItem icon="help" onClick={() => nav('/contact')}>Contact us</MenuItem>
          <MenuItem icon="building" onClick={() => nav('/partner')}>Partner with us</MenuItem>
          <hr className="divider" />
          <MenuItem icon="logout" danger onClick={logout}>Log out</MenuItem>
        </Menu>
      </div>
    </header>
  );
}

export function CustomerLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <FleetProvider>
      <div className="shell">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className={`scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
        <div className="main">
          <Topbar onMenu={() => setOpen(true)} />
          <Outlet />
        </div>
      </div>
    </FleetProvider>
  );
}
