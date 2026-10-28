// Charts drawn with plain SVG / divs: speedometer, speed line chart, bar chart, totals row.
import { useEffect, useRef, useState } from 'react';

/** Speedometer dial (0-100 km/h scale). `value` null = not playing: needle rests at 0. */
export function Speedometer({ value, size = 150, caption }) {
  const max = 100;
  const fr = Math.max(0, Math.min(1, (value ?? 0) / max));
  const at = (v, r) => {
    const a = ((-120 + 240 * (v / max) - 90) * Math.PI) / 180;
    return [60 + r * Math.cos(a), 60 + r * Math.sin(a)];
  };
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const v = i * 10;
    const [x1, y1] = at(v, 40);
    const [x2, y2] = at(v, i % 2 === 0 ? 37 : 40);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }).join('');
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={value != null ? `Speedometer ${value} km/h` : 'Speedometer'}>
      <circle cx="60" cy="60" r="57" fill="var(--bg)" stroke="var(--border)" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="var(--surface-2)" strokeWidth="7" strokeDasharray="184.3 276.5" transform="rotate(150 60 60)" />
      {fr > 0 && <circle cx="60" cy="60" r="44" fill="none" stroke="var(--accent)" strokeWidth="7" strokeDasharray={`${(184.3 * fr).toFixed(1)} 276.5`} transform="rotate(150 60 60)" />}
      <path d={ticks} stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" />
      {[0, 20, 40, 60, 80, 100].map((v) => {
        const [x, y] = at(v, 29);
        return <text key={v} x={x} y={y + 3} fontSize="8" fill="var(--muted)" textAnchor="middle">{v}</text>;
      })}
      <line x1="60" y1="60" x2="60" y2="25" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${(-120 + 240 * fr).toFixed(1)} 60 60)`} style={{ transition: 'transform 0.2s' }} />
      <circle cx="60" cy="60" r="5" fill="var(--ink)" />
      {value != null && (
        <>
          <text x="60" y="94" fontSize="21" fontWeight="700" fill="var(--ink)" textAnchor="middle">{value}</text>
          <text x="60" y="105" fontSize="8.5" fill="var(--muted)" textAnchor="middle">{caption ?? 'km/h'}</text>
        </>
      )}
    </svg>
  );
}

/** Distance and driving on the left, top and average speed on the right, the dial in the exact middle. */
export function ReplayTotals({ distanceKm, driveText, top, avg, playSpeed, caption, size = 150 }) {
  const stat = (v, l) => (<div className="stat"><b>{v}</b><span>{l}</span></div>);
  return (
    <div className="totals-row">
      <div className="col">{stat(`${distanceKm} km`, 'Distance')}{stat(driveText, 'Driving')}</div>
      <Speedometer value={playSpeed} size={size} caption={caption} />
      <div className="col r">{stat(`${top} km/h`, 'Top speed')}{stat(avg ? `${avg} km/h` : '-', 'Avg speed')}</div>
    </div>
  );
}

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/**
 * Speed (km/h) over time as a line chart. `points` = one line ([ms, speed]);
 * `series` = several coloured lines. `cursor` 0..1 draws a marker.
 */
export function SpeedChart({ points, series, height = 160, cursor }) {
  const [ref, w] = useWidth();
  const lines = series || [{ points: points || [], color: 'var(--accent)' }];
  const all = lines.flatMap((l) => l.points);
  const pad = { l: 34, r: 8, t: 10, b: 22 };
  const max = Math.max(60, Math.ceil(Math.max(...all.map((p) => p[1]), 0) / 20) * 20);
  const t0 = all.length ? Math.min(...all.map((p) => p[0])) : 0;
  const t1 = all.length ? Math.max(...all.map((p) => p[0])) : 1;
  const x = (t) => pad.l + ((t - t0) / Math.max(1, t1 - t0)) * (w - pad.l - pad.r);
  const y = (v) => pad.t + (1 - v / max) * (height - pad.t - pad.b);
  const path = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
  const ticks = [0, max / 2, max];
  const clock = (t) => new Date(t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const cx = cursor != null ? pad.l + cursor * (w - pad.l - pad.r) : null;
  const single = lines.length === 1;
  return (
    <div ref={ref} style={{ width: '100%', height }}>
      {w > 0 && all.length > 1 && (
        <svg width={w} height={height} role="img" aria-label={`Speed chart, top ${Math.max(0, ...all.map((p) => p[1]))} km/h`}>
          <defs>
            <linearGradient id="spdfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={lines[0].color} stopOpacity="0.22" />
              <stop offset="1" stopColor={lines[0].color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeDasharray={v ? '3 4' : undefined} />
              <text x={pad.l - 8} y={y(v) + 4} fontSize="11" fill="var(--muted)" textAnchor="end">{Math.round(v)}</text>
            </g>
          ))}
          {single && lines[0].points.length > 1 && (
            <path d={`${path(lines[0].points)} L${x(lines[0].points[lines[0].points.length - 1][0]).toFixed(1)},${y(0)} L${x(lines[0].points[0][0]).toFixed(1)},${y(0)} Z`} fill="url(#spdfill)" />
          )}
          {lines.map((l, i) => l.points.length > 1 && (
            <path key={i} d={path(l.points)} stroke={l.color} strokeWidth={single ? 2 : 1.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          <text x={pad.l} y={height - 4} fontSize="11" fill="var(--muted)">{clock(t0)}</text>
          <text x={w - pad.r} y={height - 4} fontSize="11" fill="var(--muted)" textAnchor="end">{clock(t1)}</text>
          {cx != null && <line x1={cx} x2={cx} y1={pad.t} y2={y(0)} stroke="var(--ink)" strokeWidth="1" />}
        </svg>
      )}
    </div>
  );
}

/**
 * Bars with a value above and a label below. items: [{ label, sub, value, text }].
 * `scroll`: fixed-width columns that scroll sideways (30 days), opened at the right end.
 */
export function BarChart({ items, color = 'accent', scroll, height = 150, onPick, activeIndex }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const ref = useRef(null);
  useEffect(() => { if (scroll && ref.current) ref.current.scrollLeft = ref.current.scrollWidth; }, [scroll, items.length]);
  return (
    <div ref={ref} className={`bars ${scroll ? 'scroll' : ''}`} style={{ height }}>
      {items.map((it, i) => {
        const Tag = onPick ? 'button' : 'div';
        return (
          <Tag key={i} type={onPick ? 'button' : undefined} className={`bar-col ${onPick ? 'pick' : ''}`} style={scroll ? { minWidth: 26, flex: '0 0 26px' } : undefined} onClick={onPick ? () => onPick(i) : undefined} aria-label={`${it.label}: ${it.text || it.value}`}>
            <div className="v">{it.text}</div>
            <div className={`b ${!it.value ? '' : activeIndex === i ? 'on' : color === 'ink' ? 'ink' : 'on'}`} style={{ height: Math.max(4, (it.value / max) * (height - 56)) }} />
            <div className="l">{it.label}</div>
            <div className="l2">{it.sub}</div>
          </Tag>
        );
      })}
    </div>
  );
}
