// Sign-in layout: a dark panel with what the product does, and the form on the right.
import { Brand } from './Layout';
import Icon from './Icon';

const POINTS = [
  ['pin', 'See every vehicle live on one map'],
  ['trips', 'Replay any day or trip with a speed chart'],
  ['bell', 'Get alerts for stops, speeding and geofences'],
  ['wrench', 'Keep service records and reminders'],
];

export default function AuthShell({ children }) {
  return (
    <div className="auth">
      <div className="auth-side">
        <Brand />
        <div>
          <h2>Know where every vehicle is, and how it is driven.</h2>
          <div className="bullets">
            {POINTS.map(([icon, text]) => (
              <div key={text}><span className="ico"><Icon name={icon} size={18} /></span>{text}</div>
            ))}
          </div>
        </div>
        <div className="small" style={{ color: 'rgba(255,255,255,0.55)' }}>Pavakie Tracker</div>
      </div>
      <div className="auth-main">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}
