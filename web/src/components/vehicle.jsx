// A vehicle's picture and a driver's round picture.
import { useEffect, useState } from 'react';
import { VEHICLE_SVG } from '../lib/vehicleArtData';
import { tintOf } from '../lib/vehicles';
import { getAccessToken } from '../lib/api';
import Icon from './Icon';

const PHOTO_TYPES = new Set(['car', 'van', 'truck', 'tractor']);

export function VehicleImage({ type, dimmed, className }) {
  const style = dimmed ? { opacity: 0.45, filter: 'grayscale(0.6)' } : undefined;
  if (PHOTO_TYPES.has(type)) return <img src={`/art/${type}.png`} alt="" className={className} style={style} />;
  const svg = VEHICLE_SVG[type] || VEHICLE_SVG.other;
  return <span className={className} style={{ display: 'contents', ...style }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Vehicle picture on a soft tile in the vehicle's colour. `warn`: service due (days). */
export function VehicleThumb({ device, size = '', dimmed, warn }) {
  return (
    <div className={`thumb ${size}`} style={{ background: tintOf(device) }}>
      <VehicleImage type={device.icon} dimmed={dimmed} />
      {warn != null && (
        <span className={`wrench ${warn < 0 ? 'late' : ''}`} title={warn < 0 ? 'Service overdue' : 'Service due soon'}>
          <Icon name="wrench" size={12} stroke={2.2} />
        </span>
      )}
    </div>
  );
}

// ---- drivers ----
const AVATARS = {
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
export function avatarForName(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_KEYS[h % AVATAR_KEYS.length];
}

function Hair({ style, color, accent }) {
  switch (style) {
    case 'long': return <path d="M31 47 C29 26 40 20 50 20 C61 20 71 26 69 47 L71 70 C66 66 65 55 66 45 C62 35 56 32 50 32 C44 32 38 35 34 45 C35 55 34 66 29 70 Z" fill={color} />;
    case 'bun': return (<g><circle cx="50" cy="19" r="8" fill={color} /><path d="M32 45 C31 28 40 23 50 23 C61 23 69 28 68 45 C66 36 60 31 50 31 C40 31 34 36 32 45 Z" fill={color} /></g>);
    case 'cap': return (<g><path d="M31 41 C31 26 40 21 50 21 C60 21 69 26 69 41 Z" fill={accent} /><path d="M48 39 L82 41 C82 45 70 46 58 45 Z" fill={accent} /><rect x="33" y="39" width="34" height="4" rx="2" fill="rgba(0,0,0,0.18)" /></g>);
    case 'curly': return (<g fill={color}>{[[34, 36], [40, 28], [48, 24], [56, 25], [63, 30], [67, 38], [33, 44], [67, 46]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" />)}</g>);
    case 'side': return <path d="M32 45 C30 27 41 21 51 21 C63 21 70 28 68 45 C64 34 54 30 44 34 C38 36 34 40 32 45 Z" fill={color} />;
    default: return <path d="M32 44 C31 28 40 22 50 22 C61 22 69 28 68 44 C66 36 60 32 50 32 C40 32 34 36 32 44 Z" fill={color} />;
  }
}

export function Illustration({ look, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs><clipPath id="rd"><circle cx="50" cy="50" r="50" /></clipPath></defs>
      <g clipPath="url(#rd)">
        <rect width="100" height="100" fill={look.bg} />
        <path d="M14 104 C14 80 30 71 50 71 C70 71 86 80 86 104 Z" fill={look.shirt} />
        <rect x="43" y="58" width="14" height="15" rx="4" fill={look.skin} />
        <path d="M43 66 Q50 72 57 66 L57 70 Q50 75 43 70 Z" fill="rgba(0,0,0,0.12)" />
        <ellipse cx="50" cy="46" rx="17" ry="19" fill={look.skin} />
        <circle cx="33" cy="48" r="3.5" fill={look.skin} />
        <circle cx="67" cy="48" r="3.5" fill={look.skin} />
        <Hair style={look.style} color={look.hair} accent={look.shirt} />
        <circle cx="44" cy="48" r="1.9" fill="#2A1A12" />
        <circle cx="56" cy="48" r="1.9" fill="#2A1A12" />
        <path d="M45 55.5 Q50 59 55 55.5" stroke="#7A3B2A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

// Driver photos are private: fetched with the access token and kept as blob URLs.
const photoCache = new Map();
function usePhoto(url) {
  const [src, setSrc] = useState(() => photoCache.get(url) || null);
  useEffect(() => {
    if (!url) { setSrc(null); return undefined; }
    if (photoCache.has(url)) { setSrc(photoCache.get(url)); return undefined; }
    let alive = true;
    (async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const blobUrl = URL.createObjectURL(await res.blob());
        photoCache.set(url, blobUrl);
        if (alive) setSrc(blobUrl);
      } catch { /* show the illustration */ }
    })();
    return () => { alive = false; };
  }, [url]);
  return src;
}

export function DriverAvatar({ driver, size = 44, localSrc }) {
  const photo = usePhoto(localSrc ? null : driver?.photoUrl);
  const key = driver?.avatar && AVATARS[driver.avatar] ? driver.avatar : avatarForName(driver?.name || '?');
  return (
    <div className="avatar" style={{ width: size, height: size }} title={driver?.name}>
      {localSrc || photo ? <img src={localSrc || photo} alt={driver?.name || ''} /> : <Illustration look={AVATARS[key]} size={size} />}
    </div>
  );
}
