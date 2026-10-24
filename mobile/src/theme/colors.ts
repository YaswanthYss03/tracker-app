/**
 * Brand colors.
 *   Ice Silver #DDE3E8 — background
 *   Deep Aubergine #3A0F34 — most text
 *   Marigold #EAAA00 — highlight
 *
 * Contrast rule: marigold is a FILL/ACCENT color. Never put marigold text on
 * the light background (≈2:1, unreadable); put aubergine text on marigold
 * instead (≈8:1). On the dark theme marigold text is fine.
 */
export const brand = {
  iceSilver: '#DDE3E8',
  aubergine: '#3A0F34',
  marigold: '#EAAA00',
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
  bg: brand.iceSilver,
  surface: '#F2F5F7',
  surface2: '#E6EBEF',
  text: brand.aubergine,
  textMuted: '#6D5068',
  accent: brand.marigold,
  onAccent: brand.aubergine,
  accentText: brand.aubergine, // marigold text is not readable on ice silver
  border: '#C3CBD3',
  success: '#2E7D4F',
  successSoft: '#D5EBDD',
  danger: '#B3261E',
  dangerSoft: '#F6D9D6',
  offline: '#7A7F89',
  overlay: 'rgba(58, 15, 52, 0.45)',
  dark: false,
};

export const dark: Palette = {
  bg: '#1C0A1A',
  surface: '#2B1128',
  surface2: '#3A1835',
  text: '#E9EDF1',
  textMuted: '#B8A9B5',
  accent: brand.marigold,
  onAccent: brand.aubergine,
  accentText: brand.marigold,
  border: '#45233F',
  success: '#5FC78A',
  successSoft: '#1E3A2A',
  danger: '#F2867D',
  dangerSoft: '#4A1F1C',
  offline: '#9AA0AA',
  overlay: 'rgba(0, 0, 0, 0.55)',
  dark: true,
};
