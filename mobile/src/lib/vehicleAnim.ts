// Side-view drawings for the animated vehicles (AnimatedVehicle.tsx).
// Every vehicle is drawn facing right on the same 240 x 140 canvas with its wheels on the
// ground line (y = 116), so all ten share one scene, one road and one speed.
// Wheels are listed separately: the component spins them, the body is drawn without them.

export const SCENE = { w: 240, h: 140, ground: 116 };

export type Wheel = { x: number; r: number };
export type Pal = { body: string; shade: string; light: string; dark: string; glass: string; lamp: string; tail: string };
/** `drive`: the vehicle rolls on the spot (smoke from `exhaust`, or wind when there is none).
 *  `ping`: no road, the pin floats and GPS rings spread out from it. */
type Art = { wheels: Wheel[]; body: (p: Pal) => string; exhaust?: { x: number; y: number }; mode?: 'drive' | 'ping' };

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export function mix(a: string, b: string, t: number) {
  const [x, y] = [hex(a), hex(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

export function palette(body: string): Pal {
  return { body, shade: mix(body, '#000000', 0.22), light: mix(body, '#FFFFFF', 0.3), dark: '#202020', glass: '#CFE6F5', lamp: '#FFD66B', tail: '#E5484D' };
}

/** Dark wheel arch behind a wheel. */
const arch = (p: Pal, x: number, r: number) => `<circle cx="${x}" cy="${SCENE.ground - r}" r="${r + 5}" fill="${p.dark}"/>`;

const ART: Record<string, Art> = {
  car: {
    wheels: [{ x: 78, r: 14 }, { x: 166, r: 14 }],
    exhaust: { x: 38, y: 100 },
    body: (p) => `
      <path d="M38 100 Q38 90 50 88 L76 84 L94 63 Q98 58 106 58 L152 58 Q160 58 166 64 L182 83 L196 87 Q204 90 204 99 L204 104 L38 104 Z" fill="${p.body}"/>
      <path d="M100 66 L88 83 L124 83 L124 66 Z" fill="${p.glass}"/>
      <path d="M130 66 L130 83 L172 83 L160 69 Q158 66 154 66 Z" fill="${p.glass}"/>
      <rect x="38" y="95" width="166" height="3" fill="${p.shade}"/>
      <rect x="142" y="87" width="14" height="3" rx="1.5" fill="${p.shade}"/>
      <rect x="197" y="89" width="7" height="6" rx="2" fill="${p.lamp}"/>
      <rect x="38" y="89" width="5" height="7" rx="2" fill="${p.tail}"/>
      ${arch(p, 78, 14)}${arch(p, 166, 14)}`,
  },
  bike: {
    wheels: [{ x: 74, r: 18 }, { x: 170, r: 18 }],
    exhaust: { x: 82, y: 93 },
    body: (p) => `
      <path d="M84 92 L124 98" stroke="#9A9A9A" stroke-width="6" stroke-linecap="round"/>
      <path d="M74 98 L104 82 M104 82 L150 64" stroke="${p.dark}" stroke-width="5" stroke-linecap="round"/>
      <path d="M170 98 L154 62" stroke="${p.dark}" stroke-width="5" stroke-linecap="round"/>
      <rect x="102" y="78" width="40" height="20" rx="5" fill="#5A5A5A"/>
      <path d="M118 66 Q138 56 154 68 L148 82 L116 82 Z" fill="${p.body}"/>
      <path d="M64 76 Q64 68 76 68 L116 68 L122 76 L100 80 L66 80 Z" fill="${p.dark}"/>
      <path d="M62 82 L96 80 L96 86 L62 88 Z" fill="${p.body}"/>
      <path d="M152 58 L166 56" stroke="${p.dark}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="160" cy="68" r="5.5" fill="${p.lamp}"/>
      <rect x="60" y="76" width="4" height="6" rx="1.5" fill="${p.tail}"/>`,
  },
  scooter: {
    wheels: [{ x: 76, r: 13 }, { x: 170, r: 13 }],
    exhaust: { x: 55, y: 94 },
    body: (p) => `
      <rect x="70" y="58" width="38" height="9" rx="4.5" fill="${p.dark}"/>
      <path d="M56 92 Q54 70 72 67 L108 67 Q118 67 120 80 L122 94 L58 98 Z" fill="${p.body}"/>
      <rect x="116" y="90" width="36" height="9" rx="3" fill="${p.shade}"/>
      <path d="M146 98 L150 68 Q152 60 160 60 L170 62 L174 100 Z" fill="${p.body}"/>
      <path d="M166 76 L170 103" stroke="${p.dark}" stroke-width="5" stroke-linecap="round"/>
      <path d="M156 58 L170 50" stroke="${p.dark}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="170" cy="70" r="4.5" fill="${p.lamp}"/>
      <rect x="55" y="80" width="4" height="7" rx="1.5" fill="${p.tail}"/>
      <rect x="66" y="82" width="22" height="3" rx="1.5" fill="${p.shade}"/>
      ${arch(p, 76, 13)}`,
  },
  bus: {
    wheels: [{ x: 66, r: 14 }, { x: 176, r: 14 }],
    exhaust: { x: 32, y: 98 },
    body: (p) => `
      <rect x="32" y="38" width="178" height="66" rx="11" fill="${p.body}"/>
      <rect x="32" y="84" width="178" height="7" fill="#FFFFFF" opacity="0.4"/>
      <rect x="42" y="50" width="136" height="26" rx="4" fill="${p.glass}"/>
      <path d="M72 50 V76 M102 50 V76 M132 50 V76 M158 50 V76" stroke="${p.body}" stroke-width="3"/>
      <path d="M186 50 L202 50 Q207 50 207 56 L207 78 L186 78 Z" fill="${p.glass}"/>
      <rect x="203" y="91" width="7" height="8" rx="2" fill="${p.lamp}"/>
      <rect x="32" y="91" width="5" height="9" rx="2" fill="${p.tail}"/>
      ${arch(p, 66, 14)}${arch(p, 176, 14)}`,
  },
  van: {
    wheels: [{ x: 70, r: 14 }, { x: 170, r: 14 }],
    exhaust: { x: 38, y: 99 },
    body: (p) => `
      <rect x="38" y="46" width="116" height="58" rx="7" fill="${p.body}"/>
      <path d="M150 58 L178 58 Q186 58 192 66 L204 84 Q208 88 208 94 L208 104 L150 104 Z" fill="${p.body}"/>
      <path d="M156 64 L177 64 Q182 64 186 70 L195 82 L156 82 Z" fill="${p.glass}"/>
      <rect x="38" y="86" width="116" height="5" fill="#FFFFFF" opacity="0.4"/>
      <path d="M96 50 V102" stroke="${p.shade}" stroke-width="2"/>
      <rect x="144" y="84" width="8" height="3" rx="1.5" fill="${p.shade}"/>
      <rect x="201" y="90" width="7" height="6" rx="2" fill="${p.lamp}"/>
      <rect x="38" y="88" width="5" height="9" rx="2" fill="${p.tail}"/>
      ${arch(p, 70, 14)}${arch(p, 170, 14)}`,
  },
  truck: {
    wheels: [{ x: 50, r: 14 }, { x: 88, r: 14 }, { x: 184, r: 14 }],
    exhaust: { x: 147, y: 32 },
    body: (p) => `
      <rect x="28" y="92" width="182" height="10" fill="${p.dark}"/>
      <rect x="144" y="32" width="6" height="28" rx="2" fill="#5A5A5A"/>
      <rect x="28" y="34" width="116" height="58" rx="4" fill="#E9ECEF"/>
      <rect x="28" y="78" width="116" height="9" fill="${p.body}"/>
      <path d="M60 38 V76 M96 38 V76" stroke="#CDD2D8" stroke-width="2"/>
      <path d="M148 56 L176 56 Q184 56 190 66 L204 84 L208 90 L208 100 L148 100 Z" fill="${p.body}"/>
      <path d="M154 62 L175 62 Q180 62 184 68 L194 82 L154 82 Z" fill="${p.glass}"/>
      <rect x="201" y="88" width="7" height="6" rx="2" fill="${p.lamp}"/>
      <rect x="28" y="88" width="4" height="6" rx="1.5" fill="${p.tail}"/>
      ${arch(p, 50, 14)}${arch(p, 88, 14)}${arch(p, 184, 14)}`,
  },
  auto: {
    wheels: [{ x: 70, r: 15 }, { x: 184, r: 13 }],
    exhaust: { x: 50, y: 98 },
    body: (p) => `
      <path d="M50 100 L50 68 Q50 62 57 62 L92 62 L98 76 L98 100 Z" fill="${p.body}"/>
      <path d="M57 72 H88 M57 77 H90 M57 82 H92" stroke="${p.light}" stroke-width="1.6" stroke-linecap="round"/>
      <rect x="92" y="92" width="76" height="7" rx="2" fill="${p.body}"/>
      <rect x="96" y="76" width="36" height="7" rx="3" fill="${p.dark}"/>
      <rect x="96" y="56" width="6" height="24" rx="3" fill="${p.dark}"/>
      <rect x="108" y="38" width="3" height="56" fill="${p.dark}"/>
      <path d="M160 44 L172 42 Q179 44 181 54 L186 88 L172 92 L162 91 Z" fill="${p.body}"/>
      <path d="M163 46 L172 45 L178 64 L168 66 Z" fill="${p.glass}"/>
      <path d="M46 66 Q42 34 80 31 L152 31 Q161 31 162 38 L160 46 L150 42 L88 42 Q66 44 62 66 Z" fill="#F2C811"/>
      <path d="M56 40 Q62 34 80 33" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
      <path d="M166 100 Q166 82 184 82 Q202 82 202 100" fill="none" stroke="${p.body}" stroke-width="5" stroke-linecap="round"/>
      <rect x="172" y="70" width="9" height="9" rx="3" fill="#F5A524"/>
      <path d="M164 50 L158 56" stroke="${p.dark}" stroke-width="3" stroke-linecap="round"/>
      <rect x="47" y="76" width="4" height="9" rx="1.5" fill="${p.tail}"/>
      ${arch(p, 70, 15)}`,
  },
  bicycle: {
    wheels: [{ x: 72, r: 24 }, { x: 170, r: 24 }],
    body: (p) => `
      <path d="M72 92 L112 92 L100 60 Z M100 60 L152 62 L112 92 M152 62 L170 92" fill="none" stroke="${p.body}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M92 55 L112 55" stroke="${p.dark}" stroke-width="6" stroke-linecap="round"/>
      <path d="M100 58 L100 55" stroke="${p.dark}" stroke-width="4"/>
      <path d="M152 62 L158 50 L168 50" fill="none" stroke="${p.dark}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="112" cy="92" r="6" fill="#9A9A9A"/>
      <path d="M106 98 L118 98" stroke="${p.dark}" stroke-width="4" stroke-linecap="round"/>`,
  },
  tractor: {
    wheels: [{ x: 76, r: 30 }, { x: 176, r: 17 }],
    exhaust: { x: 168, y: 42 },
    body: (p) => `
      <rect x="100" y="90" width="88" height="9" rx="2" fill="${p.dark}"/>
      <path d="M116 68 L176 68 Q184 68 186 76 L186 92 L116 92 Z" fill="${p.body}"/>
      <rect x="166" y="44" width="5" height="26" rx="2" fill="${p.dark}"/>
      <rect x="62" y="34" width="52" height="52" rx="6" fill="${p.shade}"/>
      <rect x="67" y="40" width="42" height="34" rx="4" fill="${p.glass}"/>
      <rect x="58" y="28" width="62" height="7" rx="3" fill="${p.dark}"/>
      <path d="M44 86 A32 32 0 0 1 108 86" fill="none" stroke="${p.body}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="184" cy="80" r="4" fill="${p.lamp}"/>`,
  },
  other: {
    wheels: [],
    mode: 'ping',
    body: (p) => `
      <path d="M120 106 C98 80 94 70 94 60 C94 44 105 34 120 34 C135 34 146 44 146 60 C146 70 142 80 120 106 Z" fill="${p.body}"/>
      <circle cx="120" cy="60" r="11" fill="#FFFFFF"/>`,
  },
};

export const ANIM_TYPES = Object.keys(ART);
export const animArt = (type?: string | null) => ART[type ?? ''] ?? ART.other;

/** Default body colour per type when the owner has not chosen one. */
export const DEFAULT_BODY: Record<string, string> = {
  car: '#2F6DB5', bike: '#C8302E', scooter: '#3D8B4F', bus: '#E8C21C', van: '#BFC5CC',
  truck: '#E07B24', auto: '#3D8B4F', bicycle: '#3D8B4F', tractor: '#C8302E', other: '#C8302E',
};

/** The whole body as a standalone SVG string (the component draws wheels on top). */
export function bodySvg(type: string | null | undefined, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SCENE.w} ${SCENE.h}">${animArt(type).body(palette(body))}</svg>`;
}

/** One wheel (tyre, rim, three spokes and a valve so the spin can be seen), in a 2r square. */
export function wheelSvg(r: number) {
  const s = r * 2;
  const rim = r * 0.62;
  const spokes = [0, 120, 240].map((a) => `<line x1="${r}" y1="${r}" x2="${r}" y2="${r - rim}" stroke="#8C8C8C" stroke-width="${Math.max(1.6, r * 0.11)}" stroke-linecap="round" transform="rotate(${a} ${r} ${r})"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><circle cx="${r}" cy="${r}" r="${r}" fill="#202020"/><circle cx="${r}" cy="${r}" r="${rim}" fill="#EDEDED"/>${spokes}<circle cx="${r}" cy="${r}" r="${r * 0.16}" fill="#8C8C8C"/><circle cx="${r}" cy="${r * 0.34}" r="${Math.max(1.4, r * 0.08)}" fill="#E5484D"/></svg>`;
}
