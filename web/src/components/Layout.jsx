// Top bar + page container for the customer site. (Admins use the separate admin website.)
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';

function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <img src="/favicon.svg" alt="" />
        <span>Pavakie Tracker</span>
      </Link>
      <nav className="nav">
        <NavLink to="/" end>My trackers</NavLink>
        <NavLink to="/account">Account</NavLink>
      </nav>
      <div className="user">
        <span className="email muted">{user?.email}</span>
        <button
          className="btn small"
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export function CustomerLayout() {
  return (
    <>
      <TopBar />
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}

