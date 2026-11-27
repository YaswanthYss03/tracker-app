// Vehicle settings: speed limit, time zone (with every country), notifications, edit, release or leave.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useRefresh } from '../../lib/data';
import { ZONES, clockIn, offsetMinutes, utcLabel, zoneName } from '../../lib/timezones';
import { useToast } from '../../lib/toast';
import Icon from '../../components/Icon';
import VehicleForm from '../../components/VehicleForm';
import { Button, Card, Chip, Confirm, Modal, Setting, Switch } from '../../components/ui';

export default function Settings({ device, isOwner }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const refresh = useRefresh();
  const qc = useQueryClient();
  const [limit, setLimit] = useState(device.speedLimitKmh || null);
  const saved = useRef(device.speedLimitKmh || null);
  const [timezone, setTimezone] = useState(device.timezone);
  const [notify, setNotify] = useState(device.notify);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const patch = async (body, msg = 'Settings saved') => {
    try { await api(`/devices/${device.id}`, { method: 'PATCH', body }); await refresh(); toast(msg); } catch (e) { toast(errorText(e), 'error'); }
  };
  useEffect(() => {
    if (limit === saved.current) return undefined;
    const t = setTimeout(() => { saved.current = limit; patch({ speedLimitKmh: limit }, limit ? `Speed limit set to ${limit} km/h` : 'Speed alerts turned off'); }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);
  const step = (by) => setLimit((l) => Math.max(10, Math.min(250, (l ?? (by > 0 ? 40 : 45)) + by)));

  async function toggleNotify(v) {
    setNotify(v);
    try { await api(`/devices/${device.id}/notifications`, { method: 'PATCH', body: { enabled: v } }); toast(v ? 'Alerts on' : 'Alerts off'); } catch { setNotify(!v); toast('Could not change that', 'error'); }
  }
  async function leaveOrRelease() {
    if (confirm === 'release') await api(`/devices/${device.id}/release`, { method: 'POST', body: { confirmImei: device.imei } });
    else await api(`/devices/${device.id}/members/${user.id}`, { method: 'DELETE' });
    qc.removeQueries({ queryKey: ['device', device.id] });
    await refresh();
    toast(confirm === 'release' ? 'Tracker released' : 'You left this tracker');
    nav('/vehicles');
  }

  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <Card>
        {isOwner && (
          <>
            <Setting title="Vehicle details" desc="Number plate, name, type, colour and main driver"><Button size="sm" icon="edit" onClick={() => setEditing(true)}>Edit vehicle</Button></Setting>
            <div className="setting" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14 }}>
              <div className="grow"><div className="t bold">Speed limit</div><div className="d small muted">Get an alert when the vehicle goes faster than this. Off means no speed alerts.</div></div>
              <div className="row" style={{ justifyContent: 'center', gap: 24 }}>
                <button type="button" className="icon-btn filled" aria-label="Lower the limit" onClick={() => step(-5)} style={{ width: 44, height: 44 }}><Icon name="minus" size={20} stroke={2.4} /></button>
                <div style={{ minWidth: 120, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: limit ? 'var(--ink)' : 'var(--muted)' }}>{limit ?? 'Off'}</div>
                  <div className="small muted">{limit ? 'km/h' : 'no speed alerts'}</div>
                </div>
                <button type="button" className="icon-btn filled" aria-label="Raise the limit" onClick={() => step(5)} style={{ width: 44, height: 44 }}><Icon name="plus" size={20} stroke={2.4} /></button>
              </div>
              <div className="chips" style={{ justifyContent: 'center' }}>
                {[null, 40, 60, 80, 100, 120].map((v) => <Chip key={String(v)} size="sm" on={(limit || null) === v} onClick={() => setLimit(v)}>{v ?? 'Off'}</Chip>)}
              </div>
            </div>
            <Setting title="Time zone" desc="Used for daily reports">
              <button type="button" className="btn outline sm" onClick={() => setZoneOpen(true)}><b>{utcLabel(offsetMinutes(timezone))}</b><span className="muted">{zoneName(timezone)}</span><Icon name="chevR" size={14} /></button>
            </Setting>
          </>
        )}
        <Setting title="Alerts for this vehicle" desc="Send its alerts to my phone and account"><Switch checked={notify} onChange={toggleNotify} label="Alerts for this vehicle" /></Setting>
      </Card>

      <Card>
        <Setting title={isOwner ? 'Release tracker' : 'Leave tracker'} desc={isOwner ? 'Selling the vehicle or tracker? Releasing deletes all history, removes everyone, and lets the next owner add it with the code on the box.' : 'Stop seeing this tracker. The owner can share it with you again.'}>
          <Button variant="danger" size="sm" onClick={() => setConfirm(isOwner ? 'release' : 'leave')}>{isOwner ? 'Release' : 'Leave'}</Button>
        </Setting>
      </Card>
      <p className="muted tiny center">IMEI {device.imei} - {device.model}</p>

      {zoneOpen && <ZonePicker value={timezone} onClose={() => setZoneOpen(false)} onPick={(z) => { setZoneOpen(false); if (z !== timezone) { setTimezone(z); patch({ timezone: z }, `Time zone set to ${zoneName(z)}`); } }} />}
      {editing && <VehicleForm device={device} onClose={() => setEditing(false)} />}
      {confirm && <Confirm danger title={confirm === 'release' ? 'Release tracker' : 'Leave tracker'} message={confirm === 'release' ? 'This permanently deletes history, trips, alerts, geofences and share links, and removes all viewers.' : 'You will no longer see this tracker.'} confirmLabel={confirm === 'release' ? 'Release' : 'Leave'} requireText={confirm === 'release' ? device.imei : undefined} onConfirm={leaveOrRelease} onClose={() => setConfirm(null)} />}
    </div>
  );
}

/** Every country's time zones, with UTC offset and the time there now. */
function ZonePicker({ value, onPick, onClose }) {
  const [q, setQ] = useState('');
  const now = useMemo(() => new Date(), []);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^utc/, '');
    const rows = ZONES.map((z) => ({ ...z, utc: utcLabel(offsetMinutes(z.zone, now)) }));
    const hit = s ? rows.filter((z) => `${z.country} ${z.city} ${z.zone}`.toLowerCase().includes(s) || z.utc.toLowerCase().replace('utc', '').includes(s)) : rows;
    const cur = hit.find((z) => z.zone === value);
    return cur && !s ? [cur, ...hit.filter((z) => z !== cur)] : hit;
  }, [q, value, now]);
  return (
    <Modal title="Time zone" onClose={onClose}>
      <div className="search" style={{ maxWidth: 'none' }}>
        <Icon name="search" size={18} className="icon" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country, city or UTC+5:30" autoFocus aria-label="Search time zones" />
      </div>
      <div style={{ maxHeight: 380, overflow: 'auto', margin: '0 -8px' }}>
        {list.length === 0 && <div className="muted small center" style={{ padding: 24 }}>No time zone matches "{q}".</div>}
        {list.map((z) => (
          <button key={z.zone} type="button" className="vrow" style={{ borderRadius: 12, padding: '10px 8px' }} onClick={() => onPick(z.zone)} aria-pressed={z.zone === value}>
            <span className="bold" style={{ width: 86 }}>{z.utc}</span>
            <span className="mid"><span>{z.country}</span><span className="tiny muted">{z.city}</span></span>
            <span className="small muted">{clockIn(z.zone, now)}</span>
            <span style={{ width: 18 }}>{z.zone === value && <Icon name="check" size={16} stroke={2.6} color="var(--accent)" />}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
