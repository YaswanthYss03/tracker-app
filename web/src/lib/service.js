// Service records: types and "when is the next service" text.
export const SERVICE_TYPES = [
  { type: 'general', label: 'General service' },
  { type: 'oil', label: 'Oil change' },
  { type: 'tyres', label: 'Tyres' },
  { type: 'brakes', label: 'Brakes' },
  { type: 'battery', label: 'Battery' },
  { type: 'other', label: 'Other' },
];
export const serviceType = (t) => SERVICE_TYPES.find((x) => x.type === t) || SERVICE_TYPES[5];

/** Service due within this many days counts as "due soon". */
export const DUE_SOON_DAYS = 15;

export function daysUntil(isoDay) {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.parse(`${isoDay}T00:00:00Z`) - today) / 86400000);
}

export function dueText(days) {
  if (days === 0) return 'Due today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  return days === -1 ? 'Overdue by 1 day' : `Overdue by ${-days} days`;
}

export const longDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const rupees = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
