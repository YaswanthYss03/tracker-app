// Signed-in shell: sidebar navigation, top bar (search, alerts, theme, account) and the page.
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { FleetProvider, useUnreadAlerts } from '../lib/data';
import { initials } from '../lib/format';
import { setPref, usePref } from '../lib/prefs';
import Icon from './Icon';
import CommandPalette from './CommandPalette';
import Tour from './Tour';
import OfflineBanner from './OfflineBanner';
import { IconButton, Menu, MenuItem } from './ui';

const NAV = [
  ['/', 'Dashboard', 'dashboard', true],
  ['/vehicles', 'Vehicles', 'car', false, 'vehicles'],
  ['/map', 'Live map', 'map', false, 'map'],
  ['/replay', 'Replay', 'trips', false, 'replay'],
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
        {NAV.map(([to, label, icon, end, tour]) => (
          <NavLink key={to} to={to} end={end} data-tour={tour} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Icon name={icon} size={20} />
            {label}
            {to === '/alerts' && unread > 0 && <span className="count">{unread > 99 ? '99+' : unread}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="nav-label">Account</div>
      <nav className="nav-group">
        <NavLink to="/profile" data-tour="profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}><Icon name="user" size={20} />Profile and settings</NavLink>
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

function PaletteTrigger({ onOpen }) {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  return (
    <button type="button" className="cmd-trigger" onClick={onOpen} aria-label="Search vehicles, pages and actions">
      <Icon name="search" size={18} />
      <span className="ellipsis">Search vehicles, pages and actions</span>
      <kbd>{mac ? 'Cmd K' : 'Ctrl K'}</kbd>
    </button>
  );
}

function Topbar({ onMenu, onSearch }) {
  const { user, logout } = useAuth();
  const unread = useUnreadAlerts();
  const theme = usePref('theme');
  const nav = useNavigate();
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  return (
    <header className="topbar">
      <IconButton className="menu-btn" icon="menu" label="Open menu" onClick={onMenu} />
      <PaletteTrigger onOpen={onSearch} />
      <div className="right row" style={{ gap: 6 }}>
        <IconButton icon={dark ? 'sun' : 'moon'} label={dark ? 'Switch to light' : 'Switch to dark'} onClick={() => setPref('theme', dark ? 'light' : 'dark')} />
        <IconButton icon="bell" data-tour="alerts" label={unread ? `Alerts, ${unread} new` : 'Alerts'} badge={unread} onClick={() => nav('/alerts')} />
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
  const [search, setSearch] = useState(false);
  const loc = useLocation();
  // Ctrl+K / Cmd+K, or "/" outside a text field, opens the search.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '');
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setSearch(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <FleetProvider>
      <div className="shell">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className={`scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
        <div className="main">
          <Topbar onMenu={() => setOpen(true)} onSearch={() => setSearch(true)} />
          <OfflineBanner />
          <Outlet />
        </div>
      </div>
      <CommandPalette open={search} onClose={() => setSearch(false)} />
      <Tour onMenu={setOpen} />
    </FleetProvider>
  );
}
