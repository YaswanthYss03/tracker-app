// Theme access: useColors() returns the palette for the phone's light/dark setting.
import { useColorScheme } from 'react-native';
import { dark, light, type Palette } from './colors';

export function useColors(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

// Design v2: inputs 14, cards 20, sheets 26, buttons are pills.
export const radius = { sm: 10, md: 16, input: 14, card: 20, lg: 24, sheet: 26, pill: 999 };

/** Soft card shadow (and a stronger one for lifted / selected items). */
export const shadow = {
  card: { elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  lifted: { elevation: 6, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
};
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export { fonts, type } from './typography';
export type { Palette } from './colors';
