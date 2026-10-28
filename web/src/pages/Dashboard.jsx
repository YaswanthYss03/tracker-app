// Dashboard: the whole fleet at a glance. Numbers, live map, this week's distance, alerts, service.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueries } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAlertsFeed, useFleet, useUnreadAlerts } from '../lib/data';
import { fleetMarkers, fleetRows, countByGroup } from '../lib/fleet';
import { ALERT_ICONS, alertText, dayLabel, isoDay, km, plateOrName, timeAgo } from '../lib/format';
import { DUE_SOON_DAYS, daysUntil, dueText } from '../lib/service';
import { GROUPS, SEVERE_ALERTS_SET, STATUS_LABEL, STATUS_RING } from '../lib/dashboardHelpers';
import Icon from '../components/Icon';
import { BarChart } from '../components/Charts';
import { MapView } from '../components/MapView';
import { Button, Card, Empty, Kpi, PageHead, Skeleton } from '../components/ui';
import VehicleForm from '../components/VehicleForm';
import VehicleRow from '../components/VehicleRow';
import { VehicleThumb } from '../components/vehicle';

const DAY = 86_400_000;

export default function Dashboard() {
  const { devices, stateOf, isLoading } = useFleet();
  const nav = useNavigate();
  const [adding, setAdding] = useState(false);
  const feed = useAlertsFeed();
  const unread = useUnreadAlerts();
  const rows = useMemo(() => fleetRows(devices, stateOf), [devices, stateOf]);
  const counts = countByGroup(rows);
  const total = devices.length;
  const kmToday = devices.reduce((a, d) => a + (d.todayKm || 0), 0);
  const online = total - counts.offline;

  // service due soon or overdue, soonest first
  const service = devices
    .filter((d) => d.serviceDue)
    .map((d) => ({ d, days: daysUntil(d.serviceDue) }))
    .filter((x) => x.days <= DUE_SOON_DAYS)
    .sort((a, b) => a.days - b.days);

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
  const alerts = (feed.data || []).slice(0, 7);
  const alertsToday = (feed.data || []).filter((e) => Date.now() - Date.parse(e.time) < DAY).length;
  const markers = fleetMarkers(rows);

  return (
    <div className="page">
      <PageHead title="Dashboard" sub="Your fleet right now">
        <Button icon="trips" onClick={() => nav('/replay')}>Replay</Button>
        <Button variant="primary" icon="carPlus" onClick={() => setAdding(true)}>Add vehicle</Button>
      </PageHead>

      <div className="stack lg">
        <div className="grid c4">
          <Kpi icon="car" tone="grey" label="Vehicles" value={total} foot={`${online} online, ${counts.offline} offline`} onClick={() => nav('/vehicles')} />
          <Kpi icon="play" tone="green" label="Moving now" value={counts.moving} foot={`${counts.stopped} stopped, ${counts.nogps} without GPS`} onClick={() => nav('/map')} />
          <Kpi icon="trips" label="Distance today" value={km(kmToday)} unit="km" foot={`${km(weekTotal)} km in the last 7 days`} />
          <Kpi icon="bell" tone="amber" label="Alerts, last 24 h" value={alertsToday} foot={unread ? `${unread} new since you last looked` : 'Nothing new'} onClick={() => nav('/alerts')} />
        </div>

        <div className="grid main-side">
          <Card pad={false}>
            <div className="card-head" style={{ padding: '18px 20px 14px', marginBottom: 0 }}>
              <h2>Live map</h2>
              <Button size="sm" variant="ghost" icon="expand" onClick={() => nav('/map')}>Open</Button>
            </div>
            <MapView height={400} markers={markers} fitTo={markers} fitKey={markers.length} onMarkerClick={(id) => nav(`/vehicles/${id}`)} expandable style={{ borderRadius: 0, border: 0, borderTop: '1px solid var(--border)' }} />
          </Card>

          <div className="stack">
            <Card title="Fleet status">
              {total === 0 ? <Empty icon="car" title="No vehicles yet" /> : (
                <div className="stack">
                  <div className="stackbar" role="img" aria-label="Vehicles by status">
                    {GROUPS.map((g) => counts[g] > 0 && <span key={g} style={{ flex: counts[g], background: STATUS_RING[g] }} />)}
                  </div>
                  <div className="stack sm">
                    {GROUPS.map((g) => (
                      <div key={g} className="row between">
                        <span className={`status ${g}`} style={{ color: 'var(--ink)' }}><span className={`dot ${g}`} />{STATUS_LABEL[g]}</span>
                        <b>{counts[g]}</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
            <Card title="Service due" action={service.length > 0 && <span className="pill warn">{service.length}</span>}>
              {service.length === 0 ? (
                <div className="muted small">No service is due in the next {DUE_SOON_DAYS} days.</div>
              ) : (
                <div>
                  {service.slice(0, 4).map(({ d, days }) => (
                    <div key={d.id} className="item click" onClick={() => nav(`/vehicles/${d.id}`)}>
                      <VehicleThumb device={d} size="sm" />
                      <div className="body"><div className="t plate">{plateOrName(d)}</div><div className="d" style={{ color: days < 0 ? 'var(--danger)' : undefined }}>{dueText(days)}</div></div>
                      <Icon name="chevR" size={16} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="grid c2">
          <Card title="Distance, last 7 days" action={<span className="muted small">{km(weekTotal)} km total</span>}>
            {reports.some((q) => q.isLoading) && weekTotal === 0 ? <Skeleton h={160} /> : (
              <BarChart
                height={250}
                items={week.map((day, i) => ({
                  label: new Date(`${day}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'short' }),
                  sub: String(new Date(`${day}T12:00:00`).getDate()),
                  value: perDay[i],
                  text: perDay[i] ? String(Math.round(perDay[i])) : '',
                }))}
                activeIndex={6}
              />
            )}
          </Card>

          <Card title="Recent alerts" action={<Button size="sm" variant="ghost" onClick={() => nav('/alerts')}>View all</Button>}>
            {alerts.length === 0 ? <div className="muted small">All quiet. No alerts in the last 7 days.</div> : (
              <div>
                {alerts.map((e) => {
                  const severe = SEVERE_ALERTS_SET.has(e.type);
                  return (
                    <div key={e.id} className="item click" onClick={() => nav(`/vehicles/${e.deviceId}/alerts`)}>
                      <span className={`ico ${severe ? 'red' : ''}`}><Icon name={ALERT_ICONS[e.type] || 'bell'} size={16} /></span>
                      <div className="body"><div className="t">{alertText(e)}</div><div className="d">{e.deviceName} - {dayLabel(e.time)}, {timeAgo(e.time)}</div></div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <Card title="Fleet" pad={false} action={<Button size="sm" variant="ghost" onClick={() => nav('/vehicles')}>All vehicles</Button>}>
          {isLoading ? <div className="stack" style={{ padding: 16 }}><Skeleton h={58} /><Skeleton h={58} /></div> : devices.length === 0 ? (
            <Empty icon="car" title="Add your first vehicle" action={<Button variant="primary" icon="carPlus" onClick={() => setAdding(true)}>Add vehicle</Button>} />
          ) : (
            <div style={{ padding: '4px 8px 10px' }}>
              {rows.slice().sort((a, b) => (a.g === 'moving' ? 0 : 1) - (b.g === 'moving' ? 0 : 1)).slice(0, 6).map(({ d, s }) => (
                <VehicleRow key={d.id} device={d} state={s} onClick={() => nav(`/vehicles/${d.id}`)} />
              ))}
            </div>
          )}
        </Card>
      </div>
      {adding && <VehicleForm onClose={() => setAdding(false)} />}
    </div>
  );
}
