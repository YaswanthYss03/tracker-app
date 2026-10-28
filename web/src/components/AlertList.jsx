// Alerts grouped by day, with filter chips. Used for one vehicle and for all vehicles.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ALERT_ICONS, SEVERE_ALERTS, alertText, groupByDay } from '../lib/format';
import Icon from './Icon';
import { Chip, Empty } from './ui';

export const VEHICLE_FILTERS = [
  ['all', 'All', null],
  ['important', 'Important', (e) => SEVERE_ALERTS.has(e.type)],
  ['ignition', 'Ignition', (e) => e.type.startsWith('ignition')],
  ['speed', 'Speed', (e) => e.type === 'overspeed'],
  ['areas', 'Areas', (e) => e.type.startsWith('geofence')],
  ['status', 'Status', (e) => ['offline', 'online', 'long_stop', 'gps_lost', 'low_battery', 'power_off'].includes(e.type)],
];

export const FEED_FILTERS = [
  ['all', 'All', null],
  ['offline', 'Offline', (e) => ['offline', 'online'].includes(e.type)],
  ['long_stop', 'Long stop', (e) => e.type === 'long_stop'],
  ['gps_lost', 'GPS lost', (e) => e.type === 'gps_lost'],
  ['warning', 'Warnings', (e) => ['overspeed', 'sos', 'power_cut', 'vibration', 'low_battery', 'power_off'].includes(e.type)],
  ['other', 'Ignition and areas', (e) => e.type.startsWith('ignition') || e.type.startsWith('geofence')],
];

const tone = (t) => {
  if (t === 'online' || t === 'ignition_on') return 'green';
  if (['overspeed', 'sos', 'power_cut', 'vibration', 'low_battery', 'power_off'].includes(t)) return 'red';
  if (t === 'long_stop' || t === 'gps_lost') return 'amber';
  return '';
};

export default function AlertList({ items, filters, showVehicle, onOpen, isNew, loading }) {
  const nav = useNavigate();
  const [filter, setFilter] = useState('all');
  const [limit, setLimit] = useState(60);
  const fn = filters.find((f) => f[0] === filter)?.[2];
  const counts = useMemo(() => Object.fromEntries(filters.map(([k, , f]) => [k, f ? items.filter(f).length : items.length])), [filters, items]);
  const shown = fn ? items.filter(fn) : items;
  const groups = groupByDay(shown.slice(0, limit));
  return (
    <div>
      <div className="chips" style={{ marginBottom: 6 }}>
        {filters.filter(([k]) => k === 'all' || counts[k] > 0).map(([k, label]) => (
          <Chip key={k} size="sm" on={filter === k} onClick={() => { setFilter(k); setLimit(60); }}>{label} {counts[k]}</Chip>
        ))}
      </div>
      {loading ? <div className="muted small center" style={{ padding: 32 }}>Loading...</div> : groups.length === 0 ? (
        <Empty icon="bell" title="All quiet">No alerts here in the last 7 days.</Empty>
      ) : groups.map((g) => (
        <div key={g.title}>
          <div className="list-day">{g.title}</div>
          {g.items.map((e) => (
            <div key={e.id} className={`item ${onOpen ? 'click' : ''}`} onClick={onOpen ? () => onOpen(e) : undefined}>
              <span className={`ico ${tone(e.type)}`}><Icon name={ALERT_ICONS[e.type] || 'bell'} size={16} /></span>
              <div className="body">
                <div className="t">{alertText(e)}</div>
                <div className="d">{showVehicle && e.deviceName ? <span className="plate copyable" role="link" title="Open this vehicle" style={{ padding: '1px 4px', margin: '0 -4px', cursor: 'pointer' }} onClick={(ev) => { ev.stopPropagation(); nav(`/vehicles/${e.deviceId}`); }}>{e.deviceName}</span> : null}{showVehicle && e.deviceName ? ' - ' : ''}{new Date(e.time).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</div>
              </div>
              {isNew?.(e) && <span className="dot" style={{ background: 'var(--accent)' }} aria-label="New" />}
              {e.lat != null && <a className="icon-btn sm" href={`https://www.google.com/maps?q=${e.lat},${e.lon}`} target="_blank" rel="noreferrer" aria-label="Open on map" onClick={(ev) => ev.stopPropagation()}><Icon name="pin" size={16} /></a>}
            </div>
          ))}
        </div>
      ))}
      {shown.length > limit && <div className="center" style={{ paddingTop: 14 }}><button type="button" className="btn sm" onClick={() => setLimit(limit + 60)}>Show more ({shown.length - limit} left)</button></div>}
    </div>
  );
}
