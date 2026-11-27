// Sign-in layout: a looping map video (light or dark version) with a translucent layer over it,
// what the product does on the left, and the form on the right.
import { useEffect, useState } from 'react';
import { setPref, usePref } from '../lib/prefs';
import { Brand } from './Layout';
import Icon from './Icon';
import { IconButton } from './ui';
import PublicFooter from './PublicFooter';

const POINTS = [
  ['pin', 'See every vehicle live on one map'],
  ['trips', 'Replay any day or trip with a speed chart'],
  ['bell', 'Get alerts for stops, speeding and geofences'],
  ['wrench', 'Keep service records and reminders'],
];

function useDark() {
  const theme = usePref('theme');
  const query = window.matchMedia?.('(prefers-color-scheme: dark)');
  const [system, setSystem] = useState(!!query?.matches);
  useEffect(() => {
    if (!query) return undefined;
    const on = (e) => setSystem(e.matches);
    query.addEventListener('change', on);
    return () => query.removeEventListener('change', on);
  }, [query]);
  return theme === 'dark' || (theme === 'system' && system);
}

export default function AuthShell({ children }) {
  const dark = useDark();
  const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="auth">
      <video
        key={dark ? 'dark' : 'light'}
        className="auth-video"
        src={`/video/auth-${dark ? 'dark' : 'light'}.mp4`}
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="auth-veil" />
      <IconButton className="auth-theme" icon={dark ? 'sun' : 'moon'} label={dark ? 'Switch to light' : 'Switch to dark'} onClick={() => setPref('theme', dark ? 'light' : 'dark')} />
      <div className="auth-layout">
        <div className="auth-copy">
          <Brand />
          <h2>Know where every vehicle is, and how it is driven.</h2>
          <div className="bullets">
            {POINTS.map(([icon, text]) => (
              <div key={text}><span className="ico"><Icon name={icon} size={18} /></span>{text}</div>
            ))}
          </div>
        </div>
        <div className="auth-card">{children}</div>
      </div>
      <div className="auth-foot"><PublicFooter /></div>
    </div>
  );
}
