// Jump anywhere: pages, actions, vehicles and drivers. Opens with Ctrl+K (or Cmd+K, or "/").
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { useDrivers, useFleet } from '../lib/data';
import { plateOrName } from '../lib/format';
import { setPref, usePref } from '../lib/prefs';
import { STATUS_LABEL, statusGroup } from '../lib/status';
import Icon from './Icon';
import { VehicleThumb } from './vehicle';

const PAGES = [
  ['Dashboard', '/', 'dashboard'], ['Vehicles', '/vehicles', 'car'], ['Live map', '/map', 'map'], ['Replay', '/replay', 'trips'],
  ['Alerts', '/alerts', 'bell'], ['Drivers', '/drivers', 'users'], ['Profile and settings', '/profile', 'user'], ['Contact us', '/contact', 'help'], ['Partner with us', '/partner', 'building'],
];

export default function CommandPalette({ open, onClose }) {
  const nav = useNavigate();
  const { logout } = useAuth();
  const { devices, stateOf } = useFleet();
  const { data: drivers = [] } = useDrivers();
  const theme = usePref('theme');
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const input = useRef(null);
  const list = useRef(null);

  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 20); } }, [open]);

  const groups = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hit = (s) => words.every((w) => s.toLowerCase().includes(w));
    const go = (path) => () => nav(path);
    const actions = [
      { label: 'Add vehicle', icon: 'carPlus', run: go('/vehicles?add=1') },
      { label: 'Add driver', icon: 'plus', run: go('/drivers?add=1') },
      { label: 'Replay today', icon: 'replay', run: go('/replay') },
      { label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', icon: theme === 'dark' ? 'sun' : 'moon', run: () => setPref('theme', theme === 'dark' ? 'light' : 'dark') },
      { label: 'Log out', icon: 'logout', run: logout },
    ].filter((a) => hit(a.label));
    const pages = PAGES.filter(([l]) => hit(l)).map(([label, path, icon]) => ({ label, icon, hint: 'Page', run: go(path) }));
    const vehicles = devices
      .filter((d) => !words.length || hit([d.registrationNumber, d.name, d.mainDriver?.name, d.imei].filter(Boolean).join(' ')))
      .slice(0, words.length ? 8 : 5)
      .map((d) => ({ label: plateOrName(d), mono: true, thumb: d, sub: `${d.mainDriver?.name || 'No driver'}, ${STATUS_LABEL[statusGroup(stateOf(d))]}`, hint: 'Vehicle', run: go(`/vehicles/${d.id}`) }));
    const people = !words.length ? [] : drivers.filter((d) => hit(`${d.name} ${d.phone || ''}`)).slice(0, 4).map((d) => ({ label: d.name, icon: 'user', sub: d.phone || 'Driver', hint: 'Driver', run: go('/drivers') }));
    return [['Vehicles', vehicles], ['Pages', pages], ['Actions', actions], ['Drivers', people]].filter(([, l]) => l.length);
  }, [q, devices, drivers, theme, nav, logout, stateOf]);
  const flat = groups.flatMap(([, l]) => l);

  useEffect(() => { setI(0); }, [q]);
  useEffect(() => { list.current?.querySelector('.cmd-item.on')?.scrollIntoView({ block: 'nearest' }); }, [i]);

  if (!open) return null;
  const choose = (item) => { onClose(); item?.run(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(flat.length - 1, x + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(flat[i]); }
    else if (e.key === 'Escape') onClose();
  };
  let n = -1;
  return (
    <div className="cmd-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmd" role="dialog" aria-modal="true" aria-label="Search">
        <div className="cmd-input">
          <Icon name="search" size={20} color="var(--muted)" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search a vehicle, driver, page or action" aria-label="Search" />
          <kbd>Esc</kbd>
        </div>
        <div className="cmd-list" ref={list}>
          {flat.length === 0 && <div className="muted small center" style={{ padding: 32 }}>Nothing matches "{q}".</div>}
          {groups.map(([title, items]) => (
            <div key={title}>
              <div className="cmd-group">{title}</div>
              {items.map((it) => {
                n += 1;
                const idx = n;
                return (
                  <button key={`${title}${it.label}`} type="button" className={`cmd-item ${idx === i ? 'on' : ''}`} onMouseMove={() => setI(idx)} onClick={() => choose(it)}>
                    {it.thumb ? <VehicleThumb device={it.thumb} size="sm" /> : <span className="ico"><Icon name={it.icon} size={17} /></span>}
                    <span style={{ minWidth: 0 }}>
                      <span className={it.mono ? 'plate' : 'bold'} style={{ display: 'block' }}>{it.label}</span>
                      {it.sub && <span className="tiny muted">{it.sub}</span>}
                    </span>
                    {it.hint && <span className="hint">{it.hint}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmd-foot"><span><kbd>Up</kbd> <kbd>Down</kbd> to move</span><span><kbd>Enter</kbd> to open</span></div>
      </div>
    </div>
  );
}
