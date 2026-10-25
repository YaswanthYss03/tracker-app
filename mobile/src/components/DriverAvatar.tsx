/**
 * A driver's round picture: their photo if uploaded, otherwise one of eight
 * simple illustrations (a1..a8), otherwise an illustration picked from the name.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';
import { getAccessToken } from '@/api/client';
import { API_URL } from '@/config';
import type { Driver } from '@/api/types';

type Hair = 'short' | 'long' | 'bun' | 'cap' | 'curly' | 'side';
type Look = { bg: string; skin: string; hair: string; shirt: string; style: Hair };

export const AVATARS: Record<string, Look> = {
  a1: { bg: '#DCE6F3', skin: '#C98E62', hair: '#2A1A12', shirt: '#2F6DB5', style: 'short' },
  a2: { bg: '#F6DDE0', skin: '#E0AC84', hair: '#2A1A12', shirt: '#C8302E', style: 'long' },
  a3: { bg: '#DCEFE0', skin: '#A86F48', hair: '#1E1410', shirt: '#3D8B4F', style: 'side' },
  a4: { bg: '#E8E0F3', skin: '#D49A6E', hair: '#3A2418', shirt: '#7A4FA8', style: 'bun' },
  a5: { bg: '#F6E2CC', skin: '#B97B52', hair: '#1E1410', shirt: '#E07B24', style: 'cap' },
  a6: { bg: '#D9EFEB', skin: '#8E5B3C', hair: '#14100E', shirt: '#2A8C82', style: 'long' },
  a7: { bg: '#E3E7EC', skin: '#B07A55', hair: '#9AA0A6', shirt: '#2E3E5C', style: 'short' },
  a8: { bg: '#F5EDC9', skin: '#E6B892', hair: '#4A2E1E', shirt: '#E8C21C', style: 'curly' },
};
export const AVATAR_KEYS = Object.keys(AVATARS);

/** Stable illustration for a name (until the user picks one). */
export function avatarForName(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_KEYS[h % AVATAR_KEYS.length];
}

function hairShape(style: Hair, color: string, accent: string) {
  switch (style) {
    case 'long':
      return <Path d="M31 47 C29 26 40 20 50 20 C61 20 71 26 69 47 L71 70 C66 66 65 55 66 45 C62 35 56 32 50 32 C44 32 38 35 34 45 C35 55 34 66 29 70 Z" fill={color} />;
    case 'bun':
      return (
        <G>
          <Circle cx={50} cy={19} r={8} fill={color} />
          <Path d="M32 45 C31 28 40 23 50 23 C61 23 69 28 68 45 C66 36 60 31 50 31 C40 31 34 36 32 45 Z" fill={color} />
        </G>
      );
    case 'cap':
      return (
        <G>
          <Path d="M31 41 C31 26 40 21 50 21 C60 21 69 26 69 41 Z" fill={accent} />
          <Path d="M48 39 L82 41 C82 45 70 46 58 45 Z" fill={accent} />
          <Rect x={33} y={39} width={34} height={4} rx={2} fill="rgba(0,0,0,0.18)" />
        </G>
      );
    case 'curly':
      return (
        <G fill={color}>
          {[[34, 36], [40, 28], [48, 24], [56, 25], [63, 30], [67, 38], [33, 44], [67, 46]].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={7} />
          ))}
        </G>
      );
    case 'side':
      return <Path d="M32 45 C30 27 41 21 51 21 C63 21 70 28 68 45 C64 34 54 30 44 34 C38 36 34 40 32 45 Z" fill={color} />;
    default:
      return <Path d="M32 44 C31 28 40 22 50 22 C61 22 69 28 68 44 C66 36 60 32 50 32 C40 32 34 36 32 44 Z" fill={color} />;
  }
}

export function Illustration({ look, size }: { look: Look; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="round">
          <Circle cx={50} cy={50} r={50} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#round)">
        <Rect width={100} height={100} fill={look.bg} />
        <Path d="M14 104 C14 80 30 71 50 71 C70 71 86 80 86 104 Z" fill={look.shirt} />
        <Rect x={43} y={58} width={14} height={15} rx={4} fill={look.skin} />
        <Path d="M43 66 Q50 72 57 66 L57 70 Q50 75 43 70 Z" fill="rgba(0,0,0,0.12)" />
        <Ellipse cx={50} cy={46} rx={17} ry={19} fill={look.skin} />
        <Circle cx={33} cy={48} r={3.5} fill={look.skin} />
        <Circle cx={67} cy={48} r={3.5} fill={look.skin} />
        {hairShape(look.style, look.hair, look.shirt)}
        <Circle cx={44} cy={48} r={1.9} fill="#2A1A12" />
        <Circle cx={56} cy={48} r={1.9} fill="#2A1A12" />
        <Path d="M45 55.5 Q50 59 55 55.5" stroke="#7A3B2A" strokeWidth={1.8} strokeLinecap="round" fill="none" />
      </G>
    </Svg>
  );
}

/** Access token for photo requests (photos are private). */
function useToken() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getAccessToken().then((t) => alive && setToken(t ?? null)).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return token;
}

export function DriverAvatar({
  driver, size = 56, localUri,
}: {
  driver: Pick<Driver, 'name' | 'avatar' | 'photoUrl'> | null;
  size?: number;
  /** A just-picked photo not uploaded yet. */
  localUri?: string | null;
}) {
  const token = useToken();
  const [failed, setFailed] = useState(false);
  const round = { width: size, height: size, borderRadius: size / 2, overflow: 'hidden' as const };

  if (localUri) return <Image source={{ uri: localUri }} style={round} contentFit="cover" />;
  if (driver?.photoUrl && token && !failed) {
    return (
      <Image
        source={{ uri: `${API_URL}${driver.photoUrl}`, headers: { Authorization: `Bearer ${token}` } }}
        style={round}
        contentFit="cover"
        cachePolicy="disk"
        onError={() => setFailed(true)}
        accessibilityLabel={driver.name}
      />
    );
  }
  const key = driver?.avatar && AVATARS[driver.avatar] ? driver.avatar : avatarForName(driver?.name || '?');
  return (
    <View style={round} accessibilityLabel={driver?.name}>
      <Illustration look={AVATARS[key]} size={size} />
    </View>
  );
}
