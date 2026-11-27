// Screen-size helpers so one layout fits small phones (320–360 dp wide, e.g. iPhone SE,
// older Android) up to large ones (412+ dp, e.g. Realme, Pro Max).
import { useWindowDimensions } from 'react-native';

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    /** Narrow phone (under 360 dp wide): shrink pictures and big numbers a little. */
    small: width < 360,
    /** Very narrow (under 340 dp). */
    tiny: width < 340,
    /** Short screen (under 700 dp high). */
    short: height < 700,
  };
}
