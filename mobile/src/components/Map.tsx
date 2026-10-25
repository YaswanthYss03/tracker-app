/**
 * Free map: MapLibre GL JS + OpenFreeMap tiles (OpenStreetMap data), rendered
 * in a WebView. No API key, no usage fees.
 *
 * The component is declarative: pass markers / route / circles / polygons as
 * props and the map updates. `follow` keeps a point centred; `fitTo` + `fitKey`
 * zoom to show a set of points whenever fitKey changes.
 *
 * To switch to Google Maps later (iOS release), replace this file only;
 * screens use the same props.
 */
import { useEffect, useImperativeHandle, useMemo, useRef, useState, type ComponentType, type Ref } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView as RNWebView, type WebViewMessageEvent } from 'react-native-webview';
import { brand } from '@/theme/colors';
import { VEHICLE_ART } from '@/lib/vehicleArt';
import { VEHICLE_SPRITES } from '@/lib/vehicleSprites';
import { useColors } from '@/theme';

export type LatLon = { lat: number; lon: number };
/** vehicle: a vehicle type (device.icon) to draw instead of the plain arrow. */
export type MapMarker = LatLon & { id: string; heading?: number | null; online?: boolean; label?: string; vehicle?: string | null };
export type MapDot = LatLon & { id: string; color: string };
export type MapCircle = LatLon & { id: string; radiusM: number; draft?: boolean };
export type MapPolygon = { id: string; points: [number, number][] };

type Props = {
  markers?: MapMarker[];
  dots?: MapDot[];
  route?: LatLon[];
  circles?: MapCircle[];
  polygons?: MapPolygon[];
  /** Keep this point centred (eases when it moves). */
  follow?: LatLon | null;
  /** Zoom to show these points whenever fitKey changes. */
  fitTo?: LatLon[];
  fitKey?: string | number;
  initialCenter?: LatLon;
  initialZoom?: number;
  onMarkerPress?: (id: string) => void;
  onLongPress?: (p: LatLon) => void;
  /** Show each marker's label (number plate) under it. */
  showLabels?: boolean;
  /** Highlighted marker: glow behind it, dark label, drawn on top. */
  selectedId?: string | null;
  /** Map padding (px) so fit/follow keep points clear of overlays like a bottom sheet. */
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
  ref?: Ref<AppMapHandle>;
  style?: StyleProp<ViewStyle>;
};

export type AppMapHandle = { zoomIn: () => void; zoomOut: () => void };

const INDIA: LatLon = { lat: 20.6, lon: 78.9 };

// react-native-webview's class typings don't match React 19's JSX types yet.
const WebView = RNWebView as unknown as ComponentType<any>;
type WebViewHandle = { injectJavaScript: (js: string) => void };

export function AppMap({
  markers = [], dots = [], route = [], circles = [], polygons = [], follow, fitTo, fitKey,
  initialCenter, initialZoom, onMarkerPress, onLongPress, showLabels, selectedId, padding, ref, style,
}: Props) {
  const c = useColors();
  const web = useRef<WebViewHandle>(null);
  const [ready, setReady] = useState(false);
  const handlers = useRef({ onMarkerPress, onLongPress });
  handlers.current = { onMarkerPress, onLongPress };
  useImperativeHandle(ref, () => ({
    zoomIn: () => web.current?.injectJavaScript('map.zoomIn({ duration: 250 }); true;'),
    zoomOut: () => web.current?.injectJavaScript('map.zoomOut({ duration: 250 }); true;'),
  }), []);

  // The page is built once per theme; later changes go through update().
  const html = useMemo(
    () => buildHtml({
      dark: c.dark,
      center: initialCenter || INDIA,
      zoom: initialCenter ? initialZoom ?? 14 : 4,
      routeColor: c.dark ? brand.marigold : brand.aubergine,
    }),
    [c.dark] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const payload = JSON.stringify({
    markers, dots, route, circles, polygons, follow: follow || null,
    fitTo: fitTo || null, fitKey: fitKey ?? null, longPress: Boolean(onLongPress),
    labels: Boolean(showLabels), selectedId: selectedId ?? null, padding: padding || null,
  });

  useEffect(() => {
    if (ready) web.current?.injectJavaScript(`window.update(${payload}); true;`);
  }, [payload, ready]);

  function onMessage(e: WebViewMessageEvent) {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'ready') setReady(true);
      else if (msg.type === 'marker') handlers.current.onMarkerPress?.(msg.id);
      else if (msg.type === 'longpress') handlers.current.onLongPress?.({ lat: msg.lat, lon: msg.lon });
    } catch {
      /* ignore */
    }
  }

  return (
    <View style={[styles.box, { backgroundColor: c.surface2 }, style]}>
      <WebView
        ref={web}
        key={c.dark ? 'dark' : 'light'}
        source={{ html, baseUrl: 'https://localhost/' }}
        originWhitelist={['*']}
        onMessage={onMessage}
        onLoadStart={() => setReady(false)}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        overScrollMode="never"
        style={{ flex: 1, backgroundColor: 'transparent' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({ box: { flex: 1, overflow: 'hidden' } });

function buildHtml({ dark, center, zoom, routeColor }: { dark: boolean; center: LatLon; zoom: number; routeColor: string }) {
  const style = dark ? 'https://tiles.openfreemap.org/styles/dark' : 'https://tiles.openfreemap.org/styles/liberty';
  return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@500&display=swap" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<style>
  html,body,#map{margin:0;height:100%;width:100%;background:${dark ? '#1C0A1A' : '#DDE3E8'}}
  .veh{width:34px;height:34px;border-radius:50%;background:${brand.aubergine};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center}
  .veh.off{background:#7A7F89}
  .veh svg{width:18px;height:18px;transition:transform .4s}
  .veh.has-icon{width:46px;height:46px;position:relative;overflow:visible;background:#fff;border-color:${brand.aubergine}}
  .veh.has-icon .art{width:40px;height:40px;margin-top:-3px}
  .veh.has-icon .art svg{width:40px;height:40px;transition:none}
  .veh.has-icon.off{border-color:#7A7F89}
  .veh.has-icon.off .art{filter:grayscale(1);opacity:.6}
  /* 3D vehicle seen from above; the whole picture turns with the heading */
  .veh3d{width:58px;height:58px;cursor:pointer}
  .veh3d img{width:58px;height:58px;display:block;transition:transform .4s;filter:drop-shadow(0 0 1.5px rgba(255,255,255,.9))}
  .veh3d.off img{filter:grayscale(1) opacity(.65) drop-shadow(0 0 1.5px rgba(255,255,255,.9))}
  /* small marigold pointer that circles the icon to show the heading */
  .veh .ptr{position:absolute;inset:-13px;transition:transform .4s;pointer-events:none}
  .veh .ptr:before{content:'';position:absolute;top:0;left:50%;margin-left:-6px;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:9px solid ${brand.marigold};filter:drop-shadow(0 0 1px rgba(0,0,0,.6))}
  .veh.off .ptr:before{border-bottom-color:#7A7F89}
  /* number plate under a marker; dark when selected */
  .lbl{position:absolute;left:50%;top:100%;transform:translate(-50%,2px);white-space:nowrap;font:500 11px/1 'DM Mono',monospace;letter-spacing:.5px;color:${brand.aubergine};background:#fff;padding:4px 7px;border-radius:7px;box-shadow:0 1px 4px rgba(0,0,0,.25);pointer-events:none;display:none}
  .labels .lbl{display:block}
  .sel .lbl{display:block;background:${brand.aubergine};color:#fff}
  /* soft marigold glow behind the selected vehicle */
  .glow{position:absolute;left:50%;top:50%;width:96px;height:96px;margin:-48px 0 0 -48px;border-radius:50%;background:radial-gradient(circle,rgba(234,170,0,.55) 0%,rgba(234,170,0,.25) 45%,rgba(234,170,0,0) 70%);pointer-events:none;display:none;animation:pulse 1.8s ease-in-out infinite}
  .sel .glow{display:block}
  @keyframes pulse{0%,100%{transform:scale(.85);opacity:.9}50%{transform:scale(1.1);opacity:.6}}
  .dot{width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)}
  .maplibregl-ctrl-attrib{font-size:10px}
</style></head><body><div id="map"></div><script>
const post = (m) => window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(m));
const map = new maplibregl.Map({ container: 'map', style: '${style}', center: [${center.lon}, ${center.lat}], zoom: ${zoom}, attributionControl: { compact: true }, pitchWithRotate: false });
map.touchPitch.disable();
let ready = false, pending = null, lastFit = null, lastFollow = null, lastPad = null, longPressOn = false;
const markerObjs = new Map(), dotObjs = new Map();

function circlePolygon(lat, lon, r) {
  const pts = [], R = 6371000;
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    const dLat = (r / R) * Math.cos(a), dLon = (r / (R * Math.cos(lat * Math.PI / 180))) * Math.sin(a);
    pts.push([lon + dLon * 180 / Math.PI, lat + dLat * 180 / Math.PI]);
  }
  return pts;
}
const fc = (features) => ({ type: 'FeatureCollection', features });
const VEH = ${JSON.stringify(VEHICLE_ART)};
const SPRITE = ${JSON.stringify(VEHICLE_SPRITES)};

function vehicleEl(m) {
  const el = document.createElement('div');
  const color = m.online === false ? '#fff' : '${brand.marigold}';
  const path = m.vehicle && VEH[m.vehicle];
  const sprite = m.vehicle && SPRITE[m.vehicle];
  if (sprite) {
    el.className = 'veh3d' + (m.online === false ? ' off' : '');
    el.innerHTML = '<img alt="" src="' + sprite + '">';
  } else if (path) {
    el.className = 'veh has-icon' + (m.online === false ? ' off' : '');
    el.innerHTML = '<div class="ptr"></div><div class="art">' + path + '</div>';
  } else {
    el.className = 'veh' + (m.online === false ? ' off' : '');
    el.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2l7 19-7-4-7 4z" fill="' + color + '"/></svg>';
  }
  el.style.position = 'relative';
  el.insertAdjacentHTML('afterbegin', '<div class="glow"></div>');
  const lbl = document.createElement('div');
  lbl.className = 'lbl';
  el.appendChild(lbl);
  el.addEventListener('click', (e) => { e.stopPropagation(); post({ type: 'marker', id: m.id }); });
  return el;
}

function syncMarkers(list, s) {
  const seen = new Set();
  document.getElementById('map').classList.toggle('labels', !!s.labels);
  for (const m of list) {
    seen.add(m.id);
    let obj = markerObjs.get(m.id);
    const key = String(m.online !== false) + (m.vehicle || '');
    if (obj && obj.key !== key) { obj.marker.remove(); obj = null; }
    if (!obj) {
      const el = vehicleEl(m);
      obj = { key, el, marker: new maplibregl.Marker({ element: el }).setLngLat([m.lon, m.lat]).addTo(map) };
      markerObjs.set(m.id, obj);
    }
    obj.marker.setLngLat([m.lon, m.lat]);
    const sel = m.id === s.selectedId;
    obj.el.classList.toggle('sel', sel);
    obj.el.style.zIndex = sel ? '5' : '1';
    obj.el.querySelector('.lbl').textContent = m.label || '';
    (obj.el.querySelector('.ptr') || obj.el.querySelector('img') || obj.el.querySelector('svg')).style.transform = 'rotate(' + (m.heading || 0) + 'deg)';
  }
  for (const [id, obj] of markerObjs) if (!seen.has(id)) { obj.marker.remove(); markerObjs.delete(id); }
}

function syncDots(list) {
  const seen = new Set();
  for (const d of list) {
    seen.add(d.id);
    let obj = dotObjs.get(d.id);
    if (!obj) {
      const el = document.createElement('div');
      el.className = 'dot';
      obj = { el, marker: new maplibregl.Marker({ element: el }).setLngLat([d.lon, d.lat]).addTo(map) };
      dotObjs.set(d.id, obj);
    }
    obj.el.style.background = d.color;
    obj.marker.setLngLat([d.lon, d.lat]);
  }
  for (const [id, obj] of dotObjs) if (!seen.has(id)) { obj.marker.remove(); dotObjs.delete(id); }
}

function apply(s) {
  syncMarkers(s.markers || [], s);
  const pad = JSON.stringify(s.padding);
  if (s.padding && pad !== lastPad) lastPad = pad, map.setPadding({ top: s.padding.top || 0, bottom: s.padding.bottom || 0, left: s.padding.left || 0, right: s.padding.right || 0 });
  syncDots(s.dots || []);
  map.getSource('route').setData(fc((s.route || []).length > 1 ? [{ type: 'Feature', geometry: { type: 'LineString', coordinates: s.route.map((p) => [p.lon, p.lat]) } }] : []));
  const fence = (c) => ({ type: 'Feature', properties: { draft: !!c.draft }, geometry: { type: 'Polygon', coordinates: [circlePolygon(c.lat, c.lon, c.radiusM)] } });
  const polys = (s.polygons || []).map((p) => ({ type: 'Feature', properties: { draft: false }, geometry: { type: 'Polygon', coordinates: [[...p.points.map(([la, lo]) => [lo, la]), [p.points[0][1], p.points[0][0]]]] } }));
  map.getSource('fences').setData(fc([...(s.circles || []).map(fence), ...polys]));
  longPressOn = !!s.longPress;

  if (s.fitTo && s.fitKey !== null && s.fitKey !== lastFit && s.fitTo.length) {
    lastFit = s.fitKey;
    if (s.fitTo.length === 1) map.jumpTo({ center: [s.fitTo[0].lon, s.fitTo[0].lat], zoom: Math.max(map.getZoom(), 14) });
    else {
      const b = new maplibregl.LngLatBounds();
      s.fitTo.forEach((p) => b.extend([p.lon, p.lat]));
      map.fitBounds(b, { padding: 50, maxZoom: 16, duration: 600 });
    }
  }
  if (s.follow) {
    const k = s.follow.lat + ',' + s.follow.lon;
    if (k !== lastFollow) {
      lastFollow = k;
      map.easeTo({ center: [s.follow.lon, s.follow.lat], zoom: Math.max(map.getZoom(), 14), duration: 600 });
    }
  }
}

window.update = (s) => { pending = s; if (ready) apply(s); };

map.on('load', () => {
  map.addSource('route', { type: 'geojson', data: fc([]) });
  map.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '${routeColor}', 'line-width': 5 } });
  map.addSource('fences', { type: 'geojson', data: fc([]) });
  map.addLayer({ id: 'fences-fill', type: 'fill', source: 'fences', paint: { 'fill-color': '${brand.marigold}', 'fill-opacity': ['case', ['get', 'draft'], 0.28, 0.16] } });
  map.addLayer({ id: 'fences-line', type: 'line', source: 'fences', filter: ['!', ['get', 'draft']], paint: { 'line-color': '${dark ? '#E9EDF1' : brand.aubergine}', 'line-width': 2 } });
  map.addLayer({ id: 'draft-line', type: 'line', source: 'fences', filter: ['get', 'draft'], paint: { 'line-color': '${brand.marigold}', 'line-width': 3, 'line-dasharray': [2, 2] } });
  ready = true;
  if (pending) apply(pending);
  post({ type: 'ready' });
});

// Long press (touch) -> place a geofence centre
let pressTimer = null, start = null;
map.on('touchstart', (e) => {
  if (!longPressOn || e.originalEvent.touches.length > 1) return;
  start = e.point;
  pressTimer = setTimeout(() => { const ll = map.unproject(start); post({ type: 'longpress', lat: ll.lat, lon: ll.lng }); }, 550);
});
map.on('touchmove', (e) => { if (start && (Math.abs(e.point.x - start.x) > 8 || Math.abs(e.point.y - start.y) > 8)) clearTimeout(pressTimer); });
map.on('touchend', () => clearTimeout(pressTimer));
map.on('contextmenu', (e) => { if (longPressOn) post({ type: 'longpress', lat: e.lngLat.lat, lon: e.lngLat.lng }); });
</script></body></html>`;
}
