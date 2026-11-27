/**
 * Brand colours (from the design).
 *   White   #FFFFFF — page background
 *   Ink     #202020 — text, icons, dark chips
 *   Red     #D93636 — accent: buttons, active tab, highlights
 * Grey #F2F2F2 is used for controls and cards on the white page.
 * (The keys keep their old names so existing code needn't change.)
 */
export const brand = {
  iceSilver: '#FFFFFF',
  aubergine: '#202020',
  marigold: '#D93636',
};

export type Palette = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  textMuted: string;
  accent: string;
  onAccent: string;
  accentText: string; // accent used AS TEXT (safe on this theme's background)
  border: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  offline: string;
  overlay: string;
  dark: boolean;
};

export const light: Palette = {
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
  overlay: 'rgba(0, 0, 0, 0.4)',
  dark: false,
};

export const dark: Palette = {
  bg: '#141414',
  surface: '#222222',
  surface2: '#2E2E2E',
  text: '#F2F2F2',
  textMuted: '#A8A8A8',
  accent: '#E5484D',
  onAccent: '#FFFFFF',
  accentText: '#FF7A7F',
  border: '#333333',
  success: '#5FC78A',
  successSoft: '#1E3A2A',
  danger: '#F2867D',
  dangerSoft: '#4A1F1C',
  offline: '#9AA0AA',
  overlay: 'rgba(0, 0, 0, 0.6)',
  dark: true,
};
