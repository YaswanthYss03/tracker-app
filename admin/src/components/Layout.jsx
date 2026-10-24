// Admin shell: aubergine sidebar (collapses to a top bar on phones) + page area.
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z', end: true },
  { to: '/trackers', label: 'Trackers', icon: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z' },
  { to: '/users', label: 'Users', icon: 'M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1a4.2 4.2 0 0 1 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z' },
  { to: '/inquiries', label: 'Inquiries', icon: 'M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 9h12v2H6zm8 5H6v-2h8zm4-6H6V6h12z', badge: true },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openInquiries, setOpenInquiries] = useState(0);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    api('/admin/inquiries?status=new&limit=1').then((r) => setOpenInquiries(r.open)).catch(() => {});
  }, [location.pathname]);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="side-brand">
          <span className="wordmark">Pavakie</span>
          <span className="side-tag">ADMIN</span>
          <button className="menu-btn" aria-label="Menu" onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" fill="currentColor" /></svg>
          </button>
        </div>
        <nav className="side-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={n.icon} fill="currentColor" /></svg>
              <span>{n.label}</span>
              {n.badge && openInquiries > 0 && <span className="count">{openInquiries}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="side-user">
          <div className="avatar">{(user?.name || user?.email || '?').charAt(0).toUpperCase()}</div>
          <div className="who">
            <div className="name">{user?.name || 'Admin'}</div>
            <div className="mail">{user?.email}</div>
          </div>
          <button
            className="logout"
            title="Log out"
            aria-label="Log out"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M16 17v-3H9v-4h7V7l5 5zM14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="currentColor" /></svg>
          </button>
        </div>
      </aside>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
