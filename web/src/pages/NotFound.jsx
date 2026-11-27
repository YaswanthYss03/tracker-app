// Shown for any address that is not a page of the site.
import { Link } from 'react-router';
import { useAuth } from '../lib/auth';
import { Brand } from '../components/Layout';
import PublicFooter from '../components/PublicFooter';

export default function NotFound() {
  const { user } = useAuth();
  return (
    <div className="public notfound">
      <div className="public-head"><Link to="/" aria-label="Pavakie home"><Brand /></Link></div>
      <main className="notfound-body">
        <div className="notfound-code" aria-hidden="true">404</div>
        <h1>This page does not exist</h1>
        <p className="muted">The address may be mistyped, or the page may have moved.</p>
        <Link to={user ? '/' : '/login'} className="btn primary lg">{user ? 'Go to the dashboard' : 'Go to log in'}</Link>
      </main>
      <PublicFooter />
    </div>
  );
}
