// Vehicle body colours (device.color). `tint` is the soft tile behind the picture.
export const VEHICLE_COLORS = [
  { key: 'white', label: 'White', hex: '#F4F4F2', tint: '#ECEDEF' },
  { key: 'silver', label: 'Silver', hex: '#BFC5CC', tint: '#E3E7EC' },
  { key: 'black', label: 'Black', hex: '#2B2B2E', tint: '#D9DADD' },
  { key: 'blue', label: 'Blue', hex: '#2F6DB5', tint: '#DCE6F3' },
  { key: 'red', label: 'Red', hex: '#C8302E', tint: '#F4DEDE' },
  { key: 'yellow', label: 'Yellow', hex: '#E8C21C', tint: '#F5EDC9' },
  { key: 'orange', label: 'Orange', hex: '#E07B24', tint: '#F6E2CC' },
  { key: 'green', label: 'Green', hex: '#3D8B4F', tint: '#DCEFE0' },
] as const;

export type VehicleColor = (typeof VEHICLE_COLORS)[number]['key'];

export function colorOf(key?: string | null) {
  return VEHICLE_COLORS.find((c) => c.key === key) ?? null;
}
