import type { Device, Live } from '@/api/types';

export type TabProps = {
  device: Device;
  state: Live;
  isOwner: boolean;
  reload: () => unknown;
};
