// Vehicle types (stored in device.icon). The colourful drawings live in
// vehicleArt.ts; `icon` is a plain Material Design icon name kept as a fallback.
import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
export type VehicleType = 'car' | 'bike' | 'scooter' | 'bus' | 'van' | 'truck' | 'auto' | 'bicycle' | 'tractor' | 'other';

export const VEHICLES: { type: VehicleType; label: string; icon: IconName }[] = [
  { type: 'car', label: 'Car', icon: 'car' },
  { type: 'bike', label: 'Bike', icon: 'motorbike' },
  { type: 'scooter', label: 'Scooter', icon: 'moped' },
  { type: 'bus', label: 'Bus', icon: 'bus' },
  { type: 'van', label: 'Van', icon: 'van-utility' },
  { type: 'truck', label: 'Truck', icon: 'truck' },
  { type: 'auto', label: 'Auto', icon: 'rickshaw' },
  { type: 'bicycle', label: 'Cycle', icon: 'bicycle' },
  { type: 'tractor', label: 'Tractor', icon: 'tractor' },
  { type: 'other', label: 'Other', icon: 'map-marker' },
];

export function vehicleOf(icon: string | null | undefined) {
  return VEHICLES.find((v) => v.type === icon) ?? null;
}
