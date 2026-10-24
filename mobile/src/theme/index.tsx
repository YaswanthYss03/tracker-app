// Theme access: useColors() returns the palette for the phone's light/dark setting.
import { useColorScheme } from 'react-native';
import { dark, light, type Palette } from './colors';

export function useColors(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export { fonts, type } from './typography';
export type { Palette } from './colors';
