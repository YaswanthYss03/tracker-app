/**
 * Colourful vehicle illustrations with a 3D look (side view, facing right):
 * gradient-shaded bodies, glass with reflections, rim highlights and a soft
 * ground shadow. One SVG string per vehicle type, used by the map (WebView)
 * and by the app screens (react-native-svg SvgXml), so they always match.
 *
 * viewBox is 0 0 64 64. Gradient ids are prefixed per type so several
 * drawings can sit in the same HTML page.
 */

/** Lighten (amt > 0) or darken (amt < 0) a hex colour. */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Shared gradients: body (light top → dark bottom), glass, hub, plus a second body colour. */
function defs(p: string, body: string, second?: string) {
  const grad = (id: string, c: string) =>
    `<linearGradient id="${p}${id}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${shade(c, 0.45)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.35)}"/></linearGradient>`;
  return (
    '<defs>' +
    grad('b', body) +
    (second ? grad('s', second) : '') +
    `<linearGradient id="${p}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3F4FF"/><stop offset=".5" stop-color="#8CC8F0"/><stop offset="1" stop-color="#3D7FB8"/></linearGradient>` +
    `<radialGradient id="${p}h" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#C9CED6"/><stop offset="1" stop-color="#7D8590"/></radialGradient>` +
    '</defs>'
  );
}

const shadow = (rx = 27, cx = 32) => `<ellipse cx="${cx}" cy="56" rx="${rx}" ry="3.6" fill="#000" opacity=".22"/>`;

/** Tyre with a shiny hub. */
function wheel(p: string, cx: number, cy: number, r: number, hub = `url(#${p}h)`) {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#22232A"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r - 1}" fill="none" stroke="#3A3C46" stroke-width="1"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.55).toFixed(1)}" fill="${hub}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.18).toFixed(1)}" fill="#50545E"/>`
  );
}

const svg = (inner: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${inner}</svg>`;

function car(c = '#E53935') {
  const p = 'vcar';
  return svg(
    defs(p, c) + shadow() +
    `<path d="M6 44Q6 34 12 33L20 32L26 22Q28 19 32 19L42 19Q45 19 47 22L52 31L56 32Q60 33 60 38L60 44Q60 47 57 47L9 47Q6 47 6 44Z" fill="url(#${p}b)"/>` +
    `<path d="M27.5 23Q29 21 31 21L34.5 21L34.5 31L22.5 31Z" fill="url(#${p}g)"/>` +
    `<path d="M37 21L42 21Q44 21 45 23L49.5 31L37 31Z" fill="url(#${p}g)"/>` +
    `<path d="M29 22.5L31 22.5L26 30L24 30Z" fill="#fff" opacity=".55"/>` +
    `<path d="M10 35.5L56 35.5" stroke="#fff" stroke-width="1.3" opacity=".45" stroke-linecap="round"/>` +
    `<path d="M35.8 32L35.8 44" stroke="${shade(c, -0.5)}" stroke-width="1" opacity=".5"/>` +
    `<rect x="30" y="37" width="3.5" height="1.2" rx=".6" fill="${shade(c, -0.55)}"/>` +
    `<rect x="55.5" y="35" width="4.5" height="3" rx="1.2" fill="#FFE27A"/>` +
    `<rect x="6" y="36" width="3" height="3" rx="1" fill="#FF4D4D"/>` +
    `<rect x="5" y="43" width="56" height="3.4" rx="1.7" fill="${shade(c, -0.45)}"/>` +
    `<circle cx="17" cy="47" r="7.6" fill="${shade(c, -0.6)}"/><circle cx="49" cy="47" r="7.6" fill="${shade(c, -0.6)}"/>` +
    wheel(p, 17, 47, 6.2) + wheel(p, 49, 47, 6.2)
  );
}

function bike(c = '#1E88E5') {
  const p = 'vbike';
  return svg(
    defs(p, c, '#8A929E') + shadow(26) +
    wheel(p, 14, 46, 8.5) + wheel(p, 50, 46, 8.5) +
    `<path d="M5 41Q7 33 18 33" stroke="url(#${p}b)" stroke-width="3.2" fill="none" stroke-linecap="round"/>` +
    `<path d="M47 29L50.5 46" stroke="#B9C0CA" stroke-width="3" stroke-linecap="round"/>` +
    `<rect x="25" y="36" width="14" height="9" rx="2.5" fill="url(#${p}s)"/>` +
    `<path d="M27 39L37 39M27 42L37 42" stroke="#5E6670" stroke-width="1"/>` +
    `<path d="M20 44L37 44" stroke="#D5DAE1" stroke-width="3.2" stroke-linecap="round"/>` +
    `<path d="M19 35L30 27.5L41 27.5Q45 28 47 31.5L41 37.5L25 39Z" fill="url(#${p}b)"/>` +
    `<path d="M31 29.5L40 29.5" stroke="#fff" stroke-width="1.4" opacity=".55" stroke-linecap="round"/>` +
    `<path d="M16 32Q19 27.5 30 27.5L28.5 31.5L17 33Z" fill="#2B2D33"/>` +
    `<path d="M44 24.5L49 22.5" stroke="#3A3C44" stroke-width="2.6" stroke-linecap="round"/>` +
    `<circle cx="49.5" cy="28.5" r="2.8" fill="#FFE27A" stroke="#C9A93A" stroke-width=".6"/>`
  );
}

function scooter(c = '#14B8A6') {
  const p = 'vsco';
  return svg(
    defs(p, c) + shadow(25) +
    `<rect x="29" y="41.5" width="17" height="3.2" rx="1.2" fill="#46525C"/>` +
    `<path d="M8 46Q7 33 20 33L32 33Q35.5 33 35.5 37L35.5 42.5L44 42.5L46.5 29L48.5 29L53 44Q53 47.5 49.5 47.5L11 47.5Q8 47.5 8 46Z" fill="url(#${p}b)"/>` +
    `<path d="M12 36Q14 34.5 20 34.5L31 34.5" stroke="#fff" stroke-width="1.4" opacity=".5" stroke-linecap="round" fill="none"/>` +
    `<path d="M45 30L47.5 21L51.5 21L50 30Z" fill="url(#${p}b)"/>` +
    `<path d="M12 32Q12 27.5 18 27.5L30 27.5Q33.5 27.5 32.5 32Z" fill="#2B2D33"/>` +
    `<path d="M44 20L53 19" stroke="#3A3C44" stroke-width="2.6" stroke-linecap="round"/>` +
    `<ellipse cx="52.5" cy="24" rx="2" ry="2.6" fill="#FFE27A"/>` +
    `<rect x="7" y="38" width="2.6" height="3" rx="1" fill="#FF4D4D"/>` +
    wheel(p, 16, 48, 6.6) + wheel(p, 49, 48, 6.6)
  );
}

function bus(c = '#F9A825') {
  const p = 'vbus';
  const win = [8, 18, 28, 38].map((x) => `<rect x="${x}" y="20" width="8" height="10" rx="1.5" fill="url(#${p}g)"/>` +
    `<path d="M${x + 1.5} 21.5L${x + 4} 21.5L${x + 1.5} 25Z" fill="#fff" opacity=".6"/>`).join('');
  return svg(
    defs(p, c) + shadow(28) +
    `<rect x="4" y="15" width="56" height="32" rx="5" fill="url(#${p}b)"/>` +
    `<rect x="4" y="15" width="56" height="3" rx="1.5" fill="#fff" opacity=".35"/>` +
    win +
    `<path d="M48 20L55 20Q58 20 58.5 23L59 30L48 30Z" fill="url(#${p}g)"/>` +
    `<rect x="4" y="34" width="56" height="3" fill="${shade(c, -0.45)}"/>` +
    `<rect x="40.5" y="31" width="6" height="14" rx="1" fill="${shade(c, -0.25)}" stroke="${shade(c, -0.5)}" stroke-width=".8"/>` +
    `<rect x="56.5" y="39" width="3.5" height="3" rx="1" fill="#FFE27A"/>` +
    `<rect x="4" y="39" width="2.5" height="3" rx="1" fill="#FF4D4D"/>` +
    `<circle cx="15" cy="47" r="7.4" fill="${shade(c, -0.6)}"/><circle cx="49" cy="47" r="7.4" fill="${shade(c, -0.6)}"/>` +
    wheel(p, 15, 47, 6.2) + wheel(p, 49, 47, 6.2)
  );
}

function van(c = '#ECEFF3', stripe = '#3B82F6') {
  const p = 'vvan';
  return svg(
    defs(p, c) + shadow() +
    `<path d="M5 44L5 22Q5 17 10 17L42 17Q46 17 48 20L56 31Q60 32 60 37L60 44Q60 47 57 47L8 47Q5 47 5 44Z" fill="url(#${p}b)" stroke="#AEB6C2" stroke-width=".8"/>` +
    `<rect x="9" y="21" width="14" height="9" rx="1.5" fill="url(#${p}g)"/>` +
    `<rect x="26" y="21" width="14" height="9" rx="1.5" fill="url(#${p}g)"/>` +
    `<path d="M43.5 21L47 21L53.5 31L43.5 31Z" fill="url(#${p}g)"/>` +
    `<path d="M10.5 22.5L13 22.5L10.5 26Z" fill="#fff" opacity=".7"/>` +
    `<rect x="5" y="34" width="55" height="3.2" fill="${stripe}"/>` +
    `<path d="M41.8 31.5L41.8 44" stroke="#9AA3AF" stroke-width="1"/>` +
    `<rect x="55.5" y="38" width="4.5" height="3" rx="1.2" fill="#FFE27A"/>` +
    `<rect x="5" y="38" width="2.6" height="3" rx="1" fill="#FF4D4D"/>` +
    `<rect x="4.5" y="43.5" width="56" height="3" rx="1.5" fill="#7C8592"/>` +
    `<circle cx="16" cy="47" r="7.4" fill="#5B6370"/><circle cx="49" cy="47" r="7.4" fill="#5B6370"/>` +
    wheel(p, 16, 47, 6.1) + wheel(p, 49, 47, 6.1)
  );
}

function truck(cab = '#FB8C00', box = '#546E7A') {
  const p = 'vtrk';
  return svg(
    defs(p, cab, box) + shadow(29) +
    `<rect x="3" y="13" width="36" height="31" rx="2.5" fill="url(#${p}s)"/>` +
    `<rect x="3" y="13" width="36" height="2.6" rx="1.3" fill="#fff" opacity=".3"/>` +
    `<path d="M15 16L15 41M27 16L27 41" stroke="#3E525C" stroke-width="1" opacity=".6"/>` +
    `<path d="M40.5 44L40.5 22Q40.5 19.5 43 19.5L52 19.5Q54.5 19.5 55.5 22L60.5 32L60.5 44Z" fill="url(#${p}b)"/>` +
    `<path d="M43.5 22.5L51.8 22.5L56 31L43.5 31Z" fill="url(#${p}g)"/>` +
    `<path d="M45 23.8L47.5 23.8L45 27.5Z" fill="#fff" opacity=".65"/>` +
    `<rect x="57" y="36" width="3.5" height="3" rx="1" fill="#FFE27A"/>` +
    `<rect x="2.5" y="42.5" width="59" height="4.5" rx="1.5" fill="#37474F"/>` +
    wheel(p, 12, 48, 5.8) + wheel(p, 25, 48, 5.8) + wheel(p, 51, 48, 5.8)
  );
}

function auto(body = '#2E9E4F', top = '#FFD21F') {
  const p = 'vauto';
  return svg(
    defs(p, body, top) + shadow(25) +
    `<path d="M10 28L12.5 14Q13.2 11 17 11L38 11Q41.8 11 42.6 14L46 28Z" fill="url(#${p}s)"/>` +
    `<path d="M15 13.3L39 13.3" stroke="#fff" stroke-width="1.3" opacity=".55" stroke-linecap="round"/>` +
    `<path d="M14.5 27L16.3 16.5L30 16.5L30 27Z" fill="#26303A"/>` +
    `<path d="M33.5 16.5L39.5 16.5L42.6 27L33.5 27Z" fill="url(#${p}g)"/>` +
    `<path d="M35 18L37 18L35.5 22Z" fill="#fff" opacity=".7"/>` +
    `<path d="M8 46L8 34Q8 28 14 28L40 28Q44 28 47 33L54 42Q56 46.5 52 47.5L10 47.5Z" fill="url(#${p}b)"/>` +
    `<path d="M11 31L42 31" stroke="#fff" stroke-width="1.3" opacity=".45" stroke-linecap="round"/>` +
    `<rect x="8" y="38" width="44" height="2.6" fill="${top}"/>` +
    `<circle cx="51.5" cy="35.5" r="2.4" fill="#FFE27A"/>` +
    wheel(p, 17, 47.5, 5.8) + wheel(p, 49, 47.5, 5.4)
  );
}

function bicycle(c = '#22A447') {
  const p = 'vcyc';
  const spokes = (cx: number) =>
    [0, 45, 90, 135].map((a) => {
      const r = (a * Math.PI) / 180, dx = (Math.cos(r) * 8).toFixed(1), dy = (Math.sin(r) * 8).toFixed(1);
      return `<path d="M${cx - +dx} ${44 - +dy}L${cx + +dx} ${44 + +dy}" stroke="#AAB2BD" stroke-width=".7"/>`;
    }).join('');
  const ring = (cx: number) =>
    `<circle cx="${cx}" cy="44" r="10" fill="none" stroke="#22232A" stroke-width="3.2"/>` +
    `<circle cx="${cx}" cy="44" r="8.3" fill="none" stroke="url(#${p}h)" stroke-width="1"/>` + spokes(cx) +
    `<circle cx="${cx}" cy="44" r="1.8" fill="url(#${p}h)"/>`;
  return svg(
    defs(p, c) + shadow(28) + ring(14) + ring(50) +
    `<path d="M14 44L25 28L44 28L32 44Z M25 28L32 44" stroke="url(#${p}b)" stroke-width="3.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="M44 28L50 44" stroke="url(#${p}b)" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M25 28L23.5 22" stroke="#4A4E57" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M19 21L28 21" stroke="#2B2D33" stroke-width="3.4" stroke-linecap="round"/>` +
    `<path d="M44 28L45.5 22.5L50 21.5" stroke="#3A3C44" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="32" cy="44" r="3.2" fill="url(#${p}h)" stroke="#5E6670" stroke-width=".8"/>`
  );
}

function tractor(c = '#D32F2F') {
  const p = 'vtrac';
  return svg(
    defs(p, c) + shadow(28, 33) +
    `<path d="M15 31L16.5 13L33 13L33 31" stroke="#30333B" stroke-width="2.4" fill="url(#${p}g)" fill-opacity=".55"/>` +
    `<rect x="13" y="9.5" width="22" height="4.5" rx="1.5" fill="url(#${p}b)"/>` +
    `<rect x="46" y="16" width="3" height="12" rx="1" fill="#3D4048"/>` +
    `<path d="M22 42L24 29Q24.5 27.5 26 27.5L54 27.5Q58.5 27.5 58.5 32L58.5 42Z" fill="url(#${p}b)"/>` +
    `<path d="M27 30L55 30" stroke="#fff" stroke-width="1.3" opacity=".5" stroke-linecap="round"/>` +
    `<path d="M54 33L54 40M56.3 33L56.3 40" stroke="${shade(c, -0.5)}" stroke-width="1"/>` +
    `<circle cx="57" cy="31" r="1.4" fill="#FFE27A"/>` +
    `<circle cx="18" cy="43" r="12.5" fill="#22232A"/>` +
    [0, 30, 60, 90, 120, 150].map((a) => {
      const r = (a * Math.PI) / 180, x = (Math.cos(r) * 11.6).toFixed(1), y = (Math.sin(r) * 11.6).toFixed(1);
      return `<path d="M${18 - +x} ${43 - +y}L${18 + +x} ${43 + +y}" stroke="#3E4049" stroke-width="2.2" stroke-dasharray="2.2 19"/>`;
    }).join('') +
    `<circle cx="18" cy="43" r="7" fill="#FFC928"/><circle cx="18" cy="43" r="7" fill="url(#${p}h)" opacity=".45"/><circle cx="18" cy="43" r="2.2" fill="#8A6A00"/>` +
    wheel(p, 51, 48, 6.6, '#FFC928')
  );
}

function pin() {
  const p = 'vpin';
  return svg(
    defs(p, '#EAAA00') + shadow(10) +
    `<path d="M32 6C21 6 14 14 14 24C14 37 32 54 32 54C32 54 50 37 50 24C50 14 43 6 32 6Z" fill="url(#${p}b)" stroke="#9C7200" stroke-width=".8"/>` +
    `<circle cx="32" cy="24" r="7.5" fill="#3A0F34"/><circle cx="32" cy="24" r="3.4" fill="#fff"/>` +
    `<ellipse cx="25" cy="15" rx="4" ry="2.4" fill="#fff" opacity=".55" transform="rotate(-35 25 15)"/>`
  );
}

const ART: Record<string, string> = {
  car: car(),
  bike: bike(),
  scooter: scooter(),
  bus: bus(),
  van: van(),
  truck: truck(),
  auto: auto(),
  bicycle: bicycle(),
  tractor: tractor(),
  other: pin(),
};

/** SVG markup for a vehicle type, or null when the type is unknown/unset. */
export function vehicleSvg(type: string | null | undefined): string | null {
  return (type && ART[type]) || null;
}

export const VEHICLE_ART = ART;
