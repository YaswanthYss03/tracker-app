// Footer of the public pages (sign-in, legal, not found): copyright, legal links, support email.
import { Link } from 'react-router';
import { useAppConfig } from '../lib/data';

export default function PublicFooter() {
  const email = useAppConfig()?.support?.email;
  return (
    <footer className="public-foot">
      <span>&copy; {new Date().getFullYear()} Pavakie</span>
      <nav aria-label="Legal and contact">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/cookies">Cookie Policy</Link>
        <Link to="/refunds">Refund Policy</Link>
        {email && <a href={`mailto:${email}`}>{email}</a>}
      </nav>
    </footer>
  );
}
