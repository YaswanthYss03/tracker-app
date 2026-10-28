// All vehicles: search, filter by status, sort (click a column), table or cards. "Add vehicle" opens the form.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useFleet } from '../lib/data';
import { fleetRows, countByGroup } from '../lib/fleet';
import { agoText, plateOrName } from '../lib/format';
import { setPref, usePref } from '../lib/prefs';
import { DUE_SOON_DAYS, daysUntil, dueText } from '../lib/service';
import { GROUPS, STATUS_LABEL, STATUS_ORDER } from '../lib/status';
import { tintOf } from '../lib/vehicles';
import Icon from '../components/Icon';
import { Button, Card, Chip, Empty, PageHead, Seg, Skeleton } from '../components/ui';
import VehicleForm from '../components/VehicleForm';
import { SpeedText, StatusLine } from '../components/VehicleRow';
import { DriverAvatar, VehicleImage, VehicleThumb } from '../components/vehicle';

const COLS = [
  ['plate', 'Vehicle', ''], ['driver', 'Driver', 'hide-s'], ['today', 'Today', 'num hide-s'], ['speed', 'Speed', 'num'], ['status', 'Status', ''], ['service', 'Service', 'hide-s'],
];

export default function Vehicles() {
  const { devices, stateOf, isLoading } = useFleet();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const view = usePref('vehiclesView');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState(GROUPS.includes(params.get('status')) ? params.get('status') : 'all');
  const [sort, setSort] = useState({ key: 'recent', dir: 1 });
  const [adding, setAdding] = useState(params.get('add') === '1');
  useEffect(() => { if (params.get('add')) { setAdding(true); setParams({}, { replace: true }); } }, [params, setParams]);
  const rows = useMemo(() => fleetRows(devices, stateOf), [devices, stateOf]);
  const counts = countByGroup(rows);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const seen = (r) => (r.s?.lastSeenAt ? Date.parse(r.s.lastSeenAt) : 0);
    const val = {
      recent: (r) => -seen(r), plate: (r) => plateOrName(r.d), driver: (r) => r.d.mainDriver?.name || '~', today: (r) => r.d.todayKm || 0,
      speed: (r) => (r.g === 'moving' ? r.s.speed ?? 0 : -1), status: (r) => STATUS_ORDER[r.g], service: (r) => (r.d.serviceDue ? daysUntil(r.d.serviceDue) : 1e9),
    }[sort.key];
    return rows
      .filter((r) => filter === 'all' || r.g === filter)
      .filter((r) => !s || [r.d.registrationNumber, r.d.name, r.d.mainDriver?.name, r.d.imei].some((v) => v?.toLowerCase().includes(s)))
      .sort((a, b) => { const x = val(a); const y = val(b); return (typeof x === 'string' ? x.localeCompare(y) : x - y) * sort.dir; });
  }, [rows, q, filter, sort]);

  const click = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: key === 'speed' || key === 'today' ? -1 : 1 }));

  return (
    <div className="page">
      <PageHead title="Vehicles" sub={`${devices.length} ${devices.length === 1 ? 'vehicle' : 'vehicles'} on your account`}>
        <Seg value={view} onChange={(v) => setPref('vehiclesView', v)} options={[['table', 'Table'], ['cards', 'Cards']]} />
        <Button variant="primary" icon="carPlus" onClick={() => setAdding(true)}>Add vehicle</Button>
      </PageHead>

      <div className="stack">
        <Card className="tight">
          <div className="row wrap" style={{ gap: 10 }}>
            <div className="row wrap" style={{ gap: 8, flex: 1 }}>
              <Chip size="sm" on={filter === 'all'} onClick={() => setFilter('all')}>All {devices.length}</Chip>
              {GROUPS.map((g) => (
                <Chip key={g} size="sm" on={filter === g} dot={filter === g ? undefined : g} onClick={() => setFilter(filter === g ? 'all' : g)}>{STATUS_LABEL[g]} {counts[g]}</Chip>
              ))}
            </div>
            <div className="search" style={{ maxWidth: 260, flex: '1 1 200px' }}>
              <Icon name="search" size={16} className="icon" style={{ top: 9 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by plate, name or driver" aria-label="Filter vehicles" style={{ height: 36, fontSize: 14 }} />
            </div>
          </div>
        </Card>

        {isLoading ? (
          <Card><div className="stack">{[0, 1, 2, 3].map((i) => <Skeleton key={i} h={58} />)}</div></Card>
        ) : devices.length === 0 ? (
          <Card><Empty icon="car" title="Add your first vehicle" action={<Button variant="primary" icon="carPlus" onClick={() => setAdding(true)}>Add vehicle</Button>}>Use the tracker ID and activation code printed on the tracker box.</Empty></Card>
        ) : shown.length === 0 ? (
          <Card><Empty icon="search" title="No vehicle matches"><Button onClick={() => { setQ(''); setFilter('all'); }}>Show all vehicles</Button></Empty></Card>
        ) : view === 'cards' ? (
          <div className="vgrid">
            {shown.map(({ d, s, g }) => {
              const due = d.serviceDue ? daysUntil(d.serviceDue) : null;
              return (
                <button key={d.id} type="button" className="vcard" onClick={() => nav(`/vehicles/${d.id}`)}>
                  <div className="art" style={{ background: tintOf(d) }}>
                    <span className="st"><span className={`pill ${g === 'moving' ? 'ok' : g === 'nogps' ? 'warn' : ''}`}><span className={`dot ${g}`} />{STATUS_LABEL[g]}</span></span>
                    {due != null && due <= DUE_SOON_DAYS && <span className="sv"><span className={`pill ${due < 0 ? 'danger' : 'warn'}`}><Icon name="wrench" size={12} stroke={2.2} />{dueText(due)}</span></span>}
                    <VehicleImage type={d.icon} dimmed={g === 'offline'} />
                  </div>
                  <div className="body">
                    <div><div className="plate" style={{ fontSize: 17 }}>{d.registrationNumber || plateOrName(d)}</div>{d.registrationNumber && d.name && <div className="tiny muted">{d.name}</div>}</div>
                    <div className="nums">
                      <div className="driver-line">{d.mainDriver ? <><DriverAvatar driver={d.mainDriver} size={24} /><span>{d.mainDriver.name}</span></> : <span className="bold" style={{ color: 'var(--ink)' }}>No driver</span>}</div>
                      <div className="big">{g === 'moving' || g === 'stopped' ? <>{s.speed ?? 0}<small>km/h</small></> : <span style={{ fontSize: 14, color: 'var(--muted)' }}>{s.lastSeenAt ? STATUS_LABEL[g] : 'Waiting'}</span>}</div>
                    </div>
                    <div className="row between tiny muted"><span>{Math.round(d.todayKm ?? 0)} km today</span><span>{agoText(s.lastSeenAt)}</span></div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <Card pad={false}>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    {COLS.map(([key, label, cls], i) => (
                      <th key={key} className={`sort ${cls} ${sort.key === key ? 'on' : ''}`} style={i === 0 ? { paddingLeft: 20 } : undefined} onClick={() => click(key)} aria-sort={sort.key === key ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
                        {label}<span className="arrow">{sort.key === key ? (sort.dir > 0 ? '↑' : '↓') : '↕'}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map(({ d, s, g }) => {
                    const due = d.serviceDue ? daysUntil(d.serviceDue) : null;
                    return (
                      <tr key={d.id} className="click" onClick={() => nav(`/vehicles/${d.id}`)}>
                        <td style={{ paddingLeft: 20 }}>
                          <div className="row"><VehicleThumb device={d} dimmed={g === 'offline'} /><div style={{ minWidth: 0 }}><div className="plate" style={{ fontSize: 15 }}>{d.registrationNumber || plateOrName(d)}</div>{d.registrationNumber && d.name && <div className="tiny muted ellipsis">{d.name}</div>}</div></div>
                        </td>
                        <td className="hide-s">{d.mainDriver ? <div className="row" style={{ gap: 8 }}><DriverAvatar driver={d.mainDriver} size={26} /><span>{d.mainDriver.name}</span></div> : <span className="muted">No driver</span>}</td>
                        <td className="num hide-s">{Math.round(d.todayKm ?? 0)} km</td>
                        <td className="num"><SpeedText state={s} group={g} /></td>
                        <td><StatusLine state={s} group={g} /></td>
                        <td className="hide-s">{due == null ? <span className="muted">-</span> : <span className={`pill ${due < 0 ? 'danger' : due <= DUE_SOON_DAYS ? 'warn' : ''}`}>{dueText(due)}</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
      {adding && <VehicleForm onClose={() => setAdding(false)} />}
    </div>
  );
}
