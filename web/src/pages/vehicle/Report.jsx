// Report: distance and riding time per day for this week, last week or the last 30 days.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { downloadCsv, duration, isoDay, km } from '../../lib/format';
import { BarChart } from '../../components/Charts';
import { Button, Card, Seg, Skeleton } from '../../components/ui';

const DAY = 86_400_000;
const at = (iso, plus = 0) => isoDay(new Date(`${iso}T12:00:00`).getTime() + plus * DAY);

function daysOf(range) {
  const today = isoDay();
  if (range === '30') return Array.from({ length: 30 }, (_, i) => at(today, i - 29));
  const dow = (new Date(`${today}T12:00:00`).getDay() + 6) % 7; // Monday = 0
  const monday = at(today, -dow + (range === 'last' ? -7 : 0));
  return Array.from({ length: 7 }, (_, i) => at(monday, i));
}

export default function Report({ device }) {
  const [range, setRange] = useState('week');
  const days = daysOf(range);
  const from = days[0];
  const to = days[days.length - 1];
  const q = useQuery({ queryKey: ['report', device.id, from, to], queryFn: () => api(`/devices/${device.id}/reports/daily?from=${from}&to=${to}`) });
  const report = q.data?.data;
  const byDay = Object.fromEntries((report?.days || []).map((d) => [d.day, d]));
  const label = (d) => {
    const dt = new Date(`${d}T12:00:00`);
    return [String(dt.getDate()), dt.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, range === '30' ? 1 : 3)];
  };
  const hrs = (s) => (s >= 3600 ? `${Math.round(s / 360) / 10}h` : s >= 60 ? `${Math.round(s / 60)}m` : '');
  const items = (get, text) => days.map((d) => ({ label: label(d)[0], sub: label(d)[1], value: get(byDay[d] || {}) || 0, text: text(get(byDay[d] || {}) || 0) }));

  return (
    <div className="stack">
      <div className="row between wrap">
        <Seg value={range} onChange={setRange} options={[['week', 'This week'], ['last', 'Last week'], ['30', '30 days']]} />
        <Button size="sm" icon="download" disabled={!report} onClick={() => downloadCsv(`report-${from}-${to}.csv`, [['Date', 'Distance (km)', 'Trips', 'Riding time (min)', 'Idle (min)', 'Top speed (km/h)'], ...days.map((d) => { const x = byDay[d] || {}; return [d, x.distanceKm || 0, x.trips || 0, Math.round((x.drivingS || 0) / 60), Math.round((x.idleS || 0) / 60), x.maxSpeed || 0]; })])}>Download CSV</Button>
      </div>
      {q.isLoading || !report ? <Skeleton h={300} /> : (
        <>
          <Card>
            <div className="grid c4 keep2">
              {[[km(report.total.distanceKm), 'km driven'], [String(report.total.trips), 'trips'], [duration(report.total.drivingS), 'riding time'], [duration(report.total.idleS), 'idle, engine on']].map(([v, k]) => (
                <div key={k} className="stat"><b style={{ fontSize: 24 }}>{v}</b><span>{k}</span></div>
              ))}
            </div>
          </Card>
          <div className="grid c2">
            <Card title="Distance per day" action={<span className="muted small">km</span>}>
              <BarChart items={items((x) => x.distanceKm, (v) => (v ? String(Math.round(v)) : ''))} scroll={range === '30'} />
            </Card>
            <Card title="Riding time per day">
              <BarChart color="ink" items={items((x) => x.drivingS, hrs)} scroll={range === '30'} />
            </Card>
          </div>
          <p className="muted tiny">{report.note}. Times are in {report.timezone}.</p>
        </>
      )}
    </div>
  );
}
