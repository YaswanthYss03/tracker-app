// Dashboard: the fleet at a glance, and what needs attention. Everything on it is clickable.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueries } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useAlertsFeed, useDrivers, useFleet, useUnreadAlerts } from '../lib/data';
import { fleetMarkers, fleetRows, countByGroup } from '../lib/fleet';
import { ALERT_ICONS, SEVERE_ALERTS, agoText, alertText, dayLabel, duration, isoDay, km, plateOrName } from '../lib/format';
import { DUE_SOON_DAYS, daysUntil, dueText } from '../lib/service';
import { GROUPS, STATUS_LABEL, STATUS_RING } from '../lib/status';
import { BarChart, Sparkline } from '../components/Charts';
import Icon from '../components/Icon';
import { MapView } from '../components/MapView';
import { Button, Card, Chip, Empty, PageHead, Skeleton } from '../components/ui';
import VehicleForm from '../components/VehicleForm';
import VehicleRow from '../components/VehicleRow';
import { VehicleThumb } from '../components/vehicle';

const DAY = 86_400_000;
const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

function Kpi({ icon, tone, label, value, unit, foot, extra, to }) {
  const nav = useNavigate();
  return (
    <button type="button" className="card" onClick={() => nav(to)} aria-label={`${label}: ${value}${unit ? ` ${unit}` : ''}. Open`}>
      <div className="kpi">
        <div className="kpi-top"><span className={`kpi-icon ${tone || ''}`}><Icon name={icon} size={18} /></span>{label}<Icon name="chevR" size={16} className="go" /></div>
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <div className="kpi-value">{value}{unit && <small>{unit}</small>}</div>
          {extra}
        </div>
        <div className="kpi-foot">{foot}</div>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { devices, stateOf, isLoading } = useFleet();
  const { data: drivers = [] } = useDrivers();
  const nav = useNavigate();
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  const [hover, setHover] = useState(null);
  const feed = useAlertsFeed();
  const unread = useUnreadAlerts();
  const rows = useMemo(() => fleetRows(devices, stateOf), [devices, stateOf]);
  const counts = countByGroup(rows);
  const total = devices.length;
  const kmToday = devices.reduce((a, d) => a + (d.todayKm || 0), 0);

  // distance for the last 7 days, summed over all vehicles
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => isoDay(Date.now() - (6 - i) * DAY)), []);
  const reports = useQueries({
    queries: devices.slice(0, 25).map((d) => ({
      queryKey: ['report', d.id, week[0], week[6]],
      queryFn: () => api(`/devices/${d.id}/reports/daily?from=${week[0]}&to=${week[6]}`),
      staleTime: 60_000,
    })),
  });
  const perDay = week.map((day) => reports.reduce((a, q) => a + (q.data?.data?.days || []).filter((x) => x.day === day).reduce((s, x) => s + x.distanceKm, 0), 0));
  const weekTotal = perDay.reduce((a, b) => a + b, 0);
  const perVehicle = devices.slice(0, 25).map((d, i) => ({ d, t: reports[i]?.data?.data?.total }));
  const fleetWeek = perVehicle.reduce((a, { t }) => ({
    trips: a.trips + (t?.trips || 0), drivingS: a.drivingS + (t?.drivingS || 0), idleS: a.idleS + (t?.idleS || 0), maxSpeed: Math.max(a.maxSpeed, t?.maxSpeed || 0),
  }), { trips: 0, drivingS: 0, idleS: 0, maxSpeed: 0 });
  const weekLoading = reports.some((q) => q.isLoading);
  const yesterday = perDay[5];
  const deltaPct = yesterday > 0 ? Math.round(((kmToday - yesterday) / yesterday) * 100) : null;

  const alerts = (feed.data || []).slice(0, 6);
  const alertsToday = (feed.data || []).filter((e) => Date.now() - Date.parse(e.time) < DAY).length;

  // What needs attention, most urgent first.
  const attention = useMemo(() => {
    const out = [];
    for (const { d, s, g } of rows) {
      const name = plateOrName(d);
      if (g === 'nogps') out.push({ k: `g${d.id}`, tone: 'amber', icon: 'gpsOff', title: `${name} has no GPS fix`, sub: 'Ignition on, no location for 15 minutes', to: `/vehicles/${d.id}`, rank: 2 });
      if (g === 'offline' && s?.lastSeenAt && Date.now() - Date.parse(s.lastSeenAt) > 3_600_000) out.push({ k: `o${d.id}`, tone: '', icon: 'wifiOff', title: `${name} is offline`, sub: `Last seen ${agoText(s.lastSeenAt).toLowerCase()}`, to: `/vehicles/${d.id}`, rank: 3 });
      if (d.serviceDue) {
        const days = daysUntil(d.serviceDue);
        if (days <= DUE_SOON_DAYS) out.push({ k: `s${d.id}`, tone: days < 0 ? 'red' : 'amber', icon: 'wrench', title: `${name} service ${dueText(days).toLowerCase()}`, sub: 'Open the service record', to: `/vehicles/${d.id}`, rank: days < 0 ? 1 : 4 });
      }
      if (!d.mainDriver && d.role === 'owner') out.push({ k: `d${d.id}`, tone: '', icon: 'user', title: `${name} has no driver`, sub: 'Assign a main driver', to: `/vehicles/${d.id}`, rank: 5 });
    }
    for (const dr of drivers) {
      if (!dr.licenceExpiry) continue;
      const days = Math.round((Date.parse(`${dr.licenceExpiry}T00:00:00Z`) - Date.now()) / DAY);
      if (days <= 30) out.push({ k: `l${dr.id}`, tone: days < 0 ? 'red' : 'amber', icon: 'card', title: `${dr.name}'s licence ${days < 0 ? 'has expired' : `expires in ${days} days`}`, sub: 'Update the licence date', to: '/drivers', rank: days < 0 ? 1 : 4 });
    }
    return out.sort((a, b) => a.rank - b.rank);
  }, [rows, drivers]);

  const shownRows = rows.filter((r) => filter === 'all' || r.g === filter);
  const markers = fleetMarkers(shownRows, hover);
  const first = (user?.name || '').split(' ')[0];

  return (
    <div className="page">
      <div className="page-head greet">
        <div>
          <h1>{greeting()}{first ? `, ${first}` : ''}</h1>
          <div className="sub">{total === 0 ? 'Add your first vehicle to get started.' : counts.moving ? `${counts.moving} of ${total} vehicles are moving right now.` : `${total} ${total === 1 ? 'vehicle' : 'vehicles'}, none moving right now.`}</div>
        </div>
        <div className="actions quick">
          <Button size="sm" icon="map" onClick={() => nav('/map')}>Live map</Button>
          <Button size="sm" icon="replay" onClick={() => nav('/replay')}>Replay today</Button>
          <Button size="sm" icon="users" onClick={() => nav('/drivers?add=1')}>Add driver</Button>
          <Button variant="primary" size="sm" icon="carPlus" data-tour="add" onClick={() => setAdding(true)}>Add vehicle</Button>
        </div>
      </div>

      <div className="stack lg">
        <div className="grid c4">
          <Kpi icon="car" tone="grey" label="Vehicles" value={total} to="/vehicles" foot={`${total - counts.offline} online, ${counts.offline} offline`} />
          <Kpi icon="play" tone="green" label="Moving now" value={counts.moving} to="/vehicles?status=moving" foot={`${counts.stopped} stopped, ${counts.nogps} without GPS`} />
          <Kpi icon="trips" label="Distance today" value={km(kmToday)} unit="km" to="/replay"
            extra={<Sparkline values={perDay} />}
            foot={<span className="row" style={{ gap: 6 }}>{deltaPct != null && <span className={`delta ${deltaPct >= 0 ? 'up' : 'down'}`}>{deltaPct >= 0 ? '+' : ''}{deltaPct}%</span>}{deltaPct != null ? 'vs yesterday' : `${km(weekTotal)} km in 7 days`}</span>} />
          <Kpi icon="bell" tone="amber" label="Alerts, last 24 h" value={alertsToday} to="/alerts" foot={unread ? <span className="row" style={{ gap: 6 }}><span className="delta down">{unread} new</span>since you last looked</span> : 'Nothing new'} />
        </div>

        <div className="grid c4">
          <Kpi icon="trips" tone="grey" label="Distance, 7 days" value={weekLoading ? '-' : km(weekTotal)} unit="km" to="/replay" foot={`${km(weekTotal / 7)} km a day across the fleet`} />
          <Kpi icon="navigate" tone="grey" label="Trips, 7 days" value={weekLoading ? '-' : fleetWeek.trips} to="/replay" foot={total ? `${(fleetWeek.trips / total).toFixed(1)} per vehicle` : 'No vehicles yet'} />
          <Kpi icon="clock" tone="green" label="Riding time, 7 days" value={weekLoading ? '-' : duration(fleetWeek.drivingS)} to="/replay" foot={`Top speed ${fleetWeek.maxSpeed} km/h`} />
          <Kpi icon="pause" tone="amber" label="Idle, engine on" value={weekLoading ? '-' : duration(fleetWeek.idleS)} to="/replay" foot={`${drivers.length} ${drivers.length === 1 ? 'driver' : 'drivers'} on the team`} />
        </div>

        <div className="grid main-side">
          <Card pad={false}>
            <div className="card-head" style={{ padding: '18px 20px 14px', marginBottom: 0 }}>
              <h2>Live map</h2>
              <Button size="sm" variant="ghost" icon="expand" onClick={() => nav('/map')}>Open full map</Button>
            </div>
            <MapView
              height={470} expandable
              markers={markers}
              fitTo={shownRows.filter((r) => r.s?.lat != null).map((r) => ({ lat: r.s.lat, lon: r.s.lon }))}
              fitKey={`${filter}-${markers.length}`}
              onMarkerClick={(id) => nav(`/vehicles/${id}`)}
              overlay={total > 0 && (
                <>
                  <Chip size="sm" on={filter === 'all'} onClick={() => setFilter('all')}>All {total}</Chip>
                  {GROUPS.filter((g) => counts[g] > 0).map((g) => <Chip key={g} size="sm" on={filter === g} ring={filter === g ? undefined : STATUS_RING[g]} onClick={() => setFilter(filter === g ? 'all' : g)}>{counts[g]} {STATUS_LABEL[g]}</Chip>)}
                </>
              )}
              style={{ borderRadius: 0, border: 0, borderTop: '1px solid var(--border)' }}
            />
          </Card>

          <Card pad={false} title="Live fleet" action={<Button size="sm" variant="ghost" onClick={() => nav('/vehicles')}>All vehicles</Button>}>
            <div className="live-list" style={{ padding: '0 8px 10px' }} onMouseLeave={() => setHover(null)}>
              {isLoading ? <div className="stack" style={{ padding: 8 }}><Skeleton h={60} /><Skeleton h={60} /></div> : shownRows.length === 0 ? (
                <Empty icon="car" title={total ? 'No vehicle in this status' : 'No vehicles yet'} action={!total && <Button variant="primary" icon="carPlus" onClick={() => setAdding(true)}>Add vehicle</Button>} />
              ) : shownRows.map(({ d, s }) => (
                <div key={d.id} onMouseEnter={() => setHover(d.id)}>
                  <VehicleRow device={d} state={s} selected={hover === d.id} onClick={() => nav(`/vehicles/${d.id}`)} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid c2">
          <Card title="Distance, last 7 days" action={<span className="muted small">Click a day to replay it</span>}>
            {reports.some((q) => q.isLoading) && weekTotal === 0 ? <Skeleton h={220} /> : (
              <BarChart
                height={230}
                activeIndex={6}
                onPick={(i) => nav(`/replay?date=${week[i]}`)}
                items={week.map((day, i) => ({
                  label: new Date(`${day}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'short' }),
                  sub: String(new Date(`${day}T12:00:00`).getDate()),
                  value: perDay[i],
                  text: perDay[i] ? String(Math.round(perDay[i])) : '',
                }))}
              />
            )}
          </Card>

          <Card title="Needs attention" action={attention.length > 0 && <span className="pill warn">{attention.length}</span>}>
            {attention.length === 0 ? (
              <div className="row" style={{ gap: 12, padding: '10px 0' }}><span className="ico" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--success-soft)', color: 'var(--success)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={20} stroke={2.4} /></span><div><div className="bold">Everything looks fine</div><div className="small muted">No offline vehicles, overdue services or expiring licences.</div></div></div>
            ) : (
              <div>
                {attention.slice(0, 6).map((a) => (
                  <div key={a.k} className="item click" onClick={() => nav(a.to)}>
                    <span className={`ico ${a.tone}`}><Icon name={a.icon} size={16} /></span>
                    <div className="body"><div className="t">{a.title}</div><div className="d">{a.sub}</div></div>
                    <Icon name="chevR" size={16} color="var(--muted)" />
                  </div>
                ))}
                {attention.length > 6 && <div className="small muted center" style={{ paddingTop: 10 }}>and {attention.length - 6} more</div>}
              </div>
            )}
          </Card>
        </div>

        <div className="grid c2">
          <Card title="Recent alerts" action={<Button size="sm" variant="ghost" onClick={() => nav('/alerts')}>View all</Button>}>
            {alerts.length === 0 ? <div className="muted small">All quiet. No alerts in the last 7 days.</div> : (
              <div>
                {alerts.map((e) => (
                  <div key={e.id} className="item click" onClick={() => nav(`/vehicles/${e.deviceId}/alerts`)}>
                    <span className={`ico ${SEVERE_ALERTS.has(e.type) ? 'red' : ''}`}><Icon name={ALERT_ICONS[e.type] || 'bell'} size={16} /></span>
                    <div className="body"><div className="t">{alertText(e)}</div><div className="d">{e.deviceName}, {dayLabel(e.time)} {new Date(e.time).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</div></div>
                    <Icon name="chevR" size={16} color="var(--muted)" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Fleet status">
            {total === 0 ? <Empty icon="car" title="No vehicles yet" /> : (
              <div className="stack">
                <div className="stackbar" role="img" aria-label="Vehicles by status">
                  {GROUPS.map((g) => counts[g] > 0 && <span key={g} title={`${STATUS_LABEL[g]}: ${counts[g]}`} style={{ flex: counts[g], background: STATUS_RING[g], cursor: 'pointer' }} onClick={() => nav(`/vehicles?status=${g}`)} />)}
                </div>
                <div>
                  {GROUPS.map((g) => (
                    <div key={g} className="item click" style={{ padding: '10px 0' }} onClick={() => nav(`/vehicles?status=${g}`)}>
                      <span className={`dot ${g}`} />
                      <div className="body"><div className="t" style={{ fontWeight: 500 }}>{STATUS_LABEL[g]}</div></div>
                      <b>{counts[g]}</b>
                      <Icon name="chevR" size={16} color="var(--muted)" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card pad={false} title="Vehicles, last 7 days" action={<span className="muted small">Click a vehicle to open it</span>}>
          {total === 0 ? <Empty icon="car" title="No vehicles yet" /> : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Vehicle</th><th>Status</th><th className="num">Today</th><th className="num">Distance</th><th className="num hide-s">Trips</th><th className="num hide-s">Riding</th><th className="num hide-s">Idle</th><th className="num hide-s">Top speed</th></tr></thead>
                <tbody>
                  {perVehicle.map(({ d, t: x }) => {
                    const g = rows.find((r) => r.d.id === d.id)?.g || 'offline';
                    return (
                      <tr key={d.id} className="click" onClick={() => nav(`/vehicles/${d.id}`)}>
                        <td className="bold">{plateOrName(d)}</td>
                        <td><span className="row" style={{ gap: 8 }}><span className={`dot ${g}`} />{STATUS_LABEL[g]}</span></td>
                        <td className="num">{km(d.todayKm || 0)} km</td>
                        <td className="num">{x ? `${km(x.distanceKm)} km` : '-'}</td>
                        <td className="num hide-s">{x ? x.trips : '-'}</td>
                        <td className="num hide-s">{x ? duration(x.drivingS) : '-'}</td>
                        <td className="num hide-s">{x ? duration(x.idleS) : '-'}</td>
                        <td className="num hide-s">{x ? `${x.maxSpeed} km/h` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      {adding && <VehicleForm onClose={() => setAdding(false)} />}
    </div>
  );
}
