// Alerts grouped by day (newest first): "Today", "Yesterday", then "Mon, 21 Oct".
export function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function groupByDay<T extends { time: string }>(items: T[]): { title: string; data: T[] }[] {
  const out: { title: string; data: T[] }[] = [];
  for (const it of items) {
    const title = dayLabel(it.time);
    const last = out[out.length - 1];
    if (last && last.title === title) last.data.push(it);
    else out.push({ title, data: [it] });
  }
  return out;
}
