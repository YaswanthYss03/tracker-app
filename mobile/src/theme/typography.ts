/**
 * Type scale — two fonts for all text:
 *   Prata    — screen and section titles
 *   DM Sans  — everything else (body, buttons, inputs, big numbers, labels)
 * Pinyon Script is only used inside the logo (wordmark + "P" loader), as artwork.
 * DM Mono is only used for vehicle number plates (the vehicle's identity).
 */
import { Prata_400Regular } from '@expo-google-fonts/prata';
import { PinyonScript_400Regular } from '@expo-google-fonts/pinyon-script';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { DMMono_500Medium } from '@expo-google-fonts/dm-mono';

export const fontAssets = {
  Prata_400Regular,
  PinyonScript_400Regular,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  DMMono_500Medium,
};

export const fonts = {
  script: 'PinyonScript_400Regular', // logo only
  heading: 'Prata_400Regular',
  body: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
  mono: 'DMMono_500Medium', // number plates
};

export const type = {
  wordmark: { fontFamily: fonts.script, fontSize: 52, lineHeight: 72 },
  displayXL: { fontFamily: fonts.bold, fontSize: 52, lineHeight: 60, letterSpacing: -1 },
  display: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.5 },
  h1: { fontFamily: fonts.heading, fontSize: 32, lineHeight: 42 },
  h2: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 32 },
  h3: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 23 },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  label: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.4 },
  // Design v2 sizes
  title: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 32 },
  name: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  fieldLabel: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18 },
  plate: { fontFamily: fonts.mono, fontSize: 17, lineHeight: 22, letterSpacing: 1 },
  number: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
} as const;

export type TypeVariant = keyof typeof type;
