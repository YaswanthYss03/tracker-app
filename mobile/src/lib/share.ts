// "Share live location": creates a 1-hour public link and opens the phone's share sheet.
import { Share } from 'react-native';
import { api } from '@/api/client';
import { API_URL } from '@/config';
import type { Device } from '@/api/types';

export async function shareLiveLocation(device: Pick<Device, 'id' | 'name'>) {
  const { data } = await api(`/devices/${device.id}/share-links`, { method: 'POST', body: { expiresInMinutes: 60 } });
  await Share.share({ message: `Live location of ${device.name || 'my vehicle'} (valid 1 hour): ${API_URL}/share/${data.token}` });
}

/** "Share current location": a Google Maps link to where the vehicle is right now. */
export async function shareCurrentLocation(device: Pick<Device, 'name' | 'registrationNumber'>, lat: number, lon: number) {
  const who = device.registrationNumber || device.name || 'My vehicle';
  await Share.share({ message: `${who} is here: https://www.google.com/maps?q=${lat},${lon}` });
}
