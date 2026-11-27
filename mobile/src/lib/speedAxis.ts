// Time axis for the speed chart that doesn't waste space on long stops.
// A stop = 5 minutes or more with no movement (speed under 3 km/h). It is squeezed into a narrow
// band; the driving parts share the rest of the width, so the speed curve is easy to read.
export type Span = { t0: number; t1: number; stop: boolean; x0: number; x1: number };

const MOVING = 3;
const STOP_MS = 5 * 60_000;

export function buildAxis(all: [number, number][], t0: number, t1: number, width: number) {
  const moving = all.filter((p) => p[1] >= MOVING).map((p) => p[0]).sort((a, b) => a - b);
  const stops: [number, number][] = [];
  if (moving.length >= 2) {
    const edge = [t0, ...moving, t1];
    for (let i = 0; i < edge.length - 1; i += 1) if (edge[i + 1] - edge[i] > STOP_MS) stops.push([edge[i], edge[i + 1]]);
  }
  const raw: { t0: number; t1: number; stop: boolean }[] = [];
  let cur = t0;
  for (const [a, b] of stops) {
    if (a > cur) raw.push({ t0: cur, t1: a, stop: false });
    raw.push({ t0: a, t1: b, stop: true });
    cur = b;
  }
  if (t1 > cur || !raw.length) raw.push({ t0: cur, t1: Math.max(t1, cur + 1), stop: false });

  const stopW = stops.length ? Math.max(12, Math.min(26, width / (stops.length * 5))) : 0;
  const drive = raw.filter((s) => !s.stop);
  const total = drive.reduce((a, s) => a + (s.t1 - s.t0), 0) || 1;
  const weights = drive.map((s) => Math.max(s.t1 - s.t0, total * 0.04)); // a short drive stays visible
  const wSum = weights.reduce((a, b) => a + b, 0);
  const driveW = Math.max(40, width - stopW * stops.length);
  let x = 0;
  let di = 0;
  const spans: Span[] = raw.map((s) => {
    const w = s.stop ? stopW : (weights[di++] / wSum) * driveW;
    const o = { ...s, x0: x, x1: x + w };
    x += w;
    return o;
  });
  const xOf = (t: number) => {
    for (const s of spans) if (t <= s.t1) return s.x0 + (s.t1 === s.t0 ? 0 : Math.max(0, (t - s.t0) / (s.t1 - s.t0))) * (s.x1 - s.x0);
    return spans[spans.length - 1].x1;
  };
  const tOf = (px: number) => {
    for (const s of spans) if (px <= s.x1) return s.t0 + (s.x1 === s.x0 ? 0 : Math.max(0, (px - s.x0) / (s.x1 - s.x0))) * (s.t1 - s.t0);
    return t1;
  };
  return { spans, xOf, tOf };
}

/** 125 -> "2h 5m", 45 -> "45m" */
export function compactSpan(ms: number) {
  const m = Math.round(ms / 60000);
  return m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`;
}
