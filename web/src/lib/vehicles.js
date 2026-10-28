// Vehicle types and body colours (stored in device.icon and device.color).
export const VEHICLES = [
  { type: 'car', label: 'Car' },
  { type: 'bike', label: 'Bike' },
  { type: 'scooter', label: 'Scooter' },
  { type: 'bus', label: 'Bus' },
  { type: 'van', label: 'Van' },
  { type: 'truck', label: 'Truck' },
  { type: 'auto', label: 'Auto' },
  { type: 'bicycle', label: 'Cycle' },
  { type: 'tractor', label: 'Tractor' },
  { type: 'other', label: 'Other' },
];

export const VEHICLE_COLORS = [
  { key: 'white', label: 'White', hex: '#F4F4F2', tint: '#ECEDEF' },
  { key: 'silver', label: 'Silver', hex: '#BFC5CC', tint: '#E3E7EC' },
  { key: 'black', label: 'Black', hex: '#2B2B2E', tint: '#D9DADD' },
  { key: 'blue', label: 'Blue', hex: '#2F6DB5', tint: '#DCE6F3' },
  { key: 'red', label: 'Red', hex: '#C8302E', tint: '#F4DEDE' },
  { key: 'yellow', label: 'Yellow', hex: '#E8C21C', tint: '#F5EDC9' },
  { key: 'orange', label: 'Orange', hex: '#E07B24', tint: '#F6E2CC' },
  { key: 'green', label: 'Green', hex: '#3D8B4F', tint: '#DCEFE0' },
];

export const colorOf = (key) => VEHICLE_COLORS.find((c) => c.key === key) || null;
const TYPE_TINT = { car: '#DCE6F3', bike: '#F4DEDE', scooter: '#F5EDC9', bus: '#E3E3E3', van: '#E3E7EC', truck: '#F6E2CC', auto: '#F5EDC9', bicycle: '#DCEFE0', tractor: '#DCEFE0', other: '#E3E7EC' };
export const tintOf = (d) => colorOf(d.color)?.tint || TYPE_TINT[d.icon] || TYPE_TINT.other;

export function normPlate(input) {
  const s = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const m = s.match(/^([A-Z]{2})(\d{1,2})([A-Z]{0,3})(\d{1,4})$/);
  return m ? [m[1], m[2], m[3], m[4]].filter(Boolean).join(' ') : input.toUpperCase().trim().replace(/\s+/g, ' ');
}
