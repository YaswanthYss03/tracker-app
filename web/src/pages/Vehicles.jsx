// All vehicles: search, filter by status, sort, and a table. "Add vehicle" opens the form.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useFleet } from '../lib/data';
import { fleetRows, countByGroup } from '../lib/fleet';
import { plateOrName } from '../lib/format';
import { DUE_SOON_DAYS, daysUntil, dueText } from '../lib/service';
import { GROUPS, STATUS_LABEL, STATUS_ORDER } from '../lib/status';
import Icon from '../components/Icon';
import { Button, Card, Chip, Empty, PageHead, Skeleton } from '../components/ui';
import VehicleForm from '../components/VehicleForm';
import { SpeedText, StatusLine } from '../components/VehicleRow';
import { DriverAvatar, VehicleThumb } from '../components/vehicle';

const SORTS = [['recent', 'Most recently updated'], ['plate', 'Number plate (A-Z)'], ['speed', 'Fastest first'], ['status', 'Moving first']];

export default function Vehicles() {
  const { devices, stateOf, isLoading } = useFleet();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [adding, setAdding] = useState(false);
  const rows = useMemo(() => fleetRows(devices, stateOf), [devices, stateOf]);
  const counts = countByGroup(rows);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const seen = (r) => (r.s?.lastSeenAt ? Date.parse(r.s.lastSeenAt) : 0);
    return rows
      .filter((r) => filter === 'all' || r.g === filter)
      .filter((r) => !s || [r.d.registrationNumber, r.d.name, r.d.driverName, r.d.imei].some((v) => v?.toLowerCase().includes(s)))
      .sort((a, b) => {
        if (sort === 'plate') return plateOrName(a.d).localeCompare(plateOrName(b.d));
        if (sort === 'speed') return (b.g === 'moving' ? b.s.speed ?? 0 : -1) - (a.g === 'moving' ? a.s.speed ?? 0 : -1);
        if (sort === 'status') return STATUS_ORDER[a.g] - STATUS_ORDER[b.g];
        return seen(b) - seen(a);
      });
  }, [rows, q, filter, sort]);

  return (
    <div className="page">
      <PageHead title="Vehicles" sub={`${devices.length} ${devices.length === 1 ? 'vehicle' : 'vehicles'} on your account`}>
        <Button variant="primary" icon="carPlus" onClick={() => setAdding(true)}>Add vehicle</Button>
      </PageHead>

      <Card pad={false}>
        <div className="row wrap" style={{ padding: 16, gap: 10 }}>
          <div className="row wrap" style={{ gap: 8, flex: 1 }}>
            <Chip size="sm" on={filter === 'all'} onClick={() => setFilter('all')}>All {devices.length}</Chip>
            {GROUPS.map((g) => (
              <Chip key={g} size="sm" on={filter === g} dot={filter === g ? undefined : g} onClick={() => setFilter(filter === g ? 'all' : g)}>
                {STATUS_LABEL[g]} {counts[g]}
              </Chip>
            ))}
          </div>
          <div className="search" style={{ maxWidth: 240, flex: '1 1 200px' }}>
            <Icon name="search" size={16} className="icon" style={{ top: 9 }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plate, name or driver" aria-label="Search vehicles" style={{ height: 36, fontSize: 14 }} />
          </div>
          <select className="select" style={{ width: 210, height: 36, fontSize: 14 }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort vehicles">
            {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="stack" style={{ padding: 16 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} h={58} />)}</div>
        ) : devices.length === 0 ? (
          <Empty icon="car" title="Add your first vehicle" action={<Button variant="primary" icon="carPlus" onClick={() => setAdding(true)}>Add vehicle</Button>}>
            Use the tracker ID and activation code printed on the tracker box.
          </Empty>
        ) : shown.length === 0 ? (
          <Empty icon="search" title="No vehicle matches">
            <Button onClick={() => { setQ(''); setFilter('all'); }}>Show all</Button>
          </Empty>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20 }}>Vehicle</th>
                  <th className="hide-s">Driver</th>
                  <th className="num hide-s">Today</th>
                  <th className="num">Speed</th>
                  <th>Status</th>
                  <th className="hide-s" style={{ paddingRight: 20 }}>Service</th>
                </tr>
              </thead>
              <tbody>
                {shown.map(({ d, s, g }) => {
                  const due = d.serviceDue ? daysUntil(d.serviceDue) : null;
                  return (
                    <tr key={d.id} className="click" onClick={() => nav(`/vehicles/${d.id}`)}>
                      <td style={{ paddingLeft: 20 }}>
                        <div className="row">
                          <VehicleThumb device={d} dimmed={g === 'offline'} />
                          <div style={{ minWidth: 0 }}>
                            <div className="plate" style={{ fontSize: 15 }}>{d.registrationNumber || plateOrName(d)}</div>
                            {d.registrationNumber && d.name && <div className="tiny muted ellipsis">{d.name}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="hide-s">
                        {d.mainDriver ? <div className="row" style={{ gap: 8 }}><DriverAvatar driver={d.mainDriver} size={26} /><span>{d.mainDriver.name}</span></div> : <span className="muted">No driver</span>}
                      </td>
                      <td className="num hide-s">{Math.round(d.todayKm ?? 0)} km</td>
                      <td className="num"><SpeedText state={s} group={g} /></td>
                      <td><StatusLine state={s} group={g} /></td>
                      <td className="hide-s" style={{ paddingRight: 20 }}>
                        {due == null ? <span className="muted">-</span> : <span className={`pill ${due < 0 ? 'danger' : due <= DUE_SOON_DAYS ? 'warn' : ''}`}>{dueText(due)}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {adding && <VehicleForm onClose={() => setAdding(false)} />}
    </div>
  );
}
