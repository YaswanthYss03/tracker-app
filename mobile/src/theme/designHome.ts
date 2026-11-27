// Colours of the Home design (light): grey page, white cards, red accent.
// Dark mode keeps the app's own dark palette.
import type { Palette } from '@/theme/colors';
import { useColors } from '@/theme';

export const designLight: Palette & { green: string; greenText: string; amber: string; amberText: string; track: string } = {
  bg: '#FFFFFF',
  surface: '#F2F2F2',
  surface2: '#E4E4E4',
  text: '#202020',
  textMuted: '#5E5E5E',
  accent: '#D93636',
  onAccent: '#FFFFFF',
  accentText: '#D93636',
  border: '#E3E3E3',
  success: '#1F8A55',
  successSoft: '#E3F1E8',
  danger: '#B42828',
  dangerSoft: '#FBE5E5',
  offline: '#8A8A8A',
  overlay: 'rgba(0,0,0,0.4)',
  dark: false,
  green: '#1F8A55',
  greenText: '#1B6B43',
  amber: '#C27400',
  amberText: '#7F4A00',
  track: '#EDEDED',
};


export function useHomeColors() {
  const c = useColors();
  if (!c.dark) return designLight;
  return { ...c, green: c.success, greenText: c.success, amber: '#EAAA00', amberText: '#EAAA00', track: c.surface2 };
}
