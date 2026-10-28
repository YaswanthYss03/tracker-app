// Map: Leaflet drawn imperatively so vehicles can glide smoothly between positions.
//   <MapView markers routes dots circles polygons fitTo fitKey follow ... tools expandable />
// Marker kinds: 'vehicle' (round picture with a status ring, plate tag, red pulse when selected),
//               'dot'     (vehicle colour dot with a red ring: the details page),
//               'replay'  (coloured dot with a white edge and an optional plate tag).
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VEHICLE_SVG } from '../lib/vehicleArtData';
import Icon from './Icon';

const INDIA = [20.6, 78.9];
const PHOTO = new Set(['car', 'van', 'truck', 'tractor']);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function art(type) {
  if (PHOTO.has(type)) return `<img alt="" src="/art/${type}.png">`;
  return VEHICLE_SVG[type] || VEHICLE_SVG.other;
}

function markerHtml(m, showLabels) {
  if (m.kind === 'dot') return `<div class="mk pdot" style="--fill:${m.fill || '#202020'}"><div class="halo"></div><div class="pt"></div></div>`;
  if (m.kind === 'replay') {
    return `<div class="mk" style="--fill:${m.fill || '#d93636'}"><div class="pt"></div>${m.label ? `<div class="ptag"><i></i>${esc(m.label)}</div>` : ''}</div>`;
  }
  return `<div class="mk ${m.dashed ? 'dash' : ''} ${m.selected ? 'sel' : ''} ${showLabels ? '' : 'nolabel'}" style="--ring:${m.ring || '#333'}">` +
    '<div class="core"></div><div class="ring"></div><div class="ring b"></div>' +
    `<div class="bub">${art(m.vehicle)}</div><div class="tag">${esc(m.label || '')}</div></div>`;
}
const keyOf = (m, showLabels) => [m.kind, m.fill, m.ring, m.dashed, m.selected, m.vehicle, m.label, showLabels].join('|');

export default function MapCanvas({
  ref, markers = [], routes = [], dots = [], circles = [], polygons = [], fitTo, fitKey, follow, satellite = false,
  showLabels = true, onMarkerClick, onClick, initialCenter, initialZoom = 13, padding = 50,
}) {
  const el = useRef(null);
  const map = useRef(null);
  const base = useRef({});
  const objs = useRef({ markers: new Map(), routes: new Map(), dots: new Map(), shapes: new Map() });
  const last = useRef({ fit: null, follow: null });
  const cb = useRef({ onMarkerClick, onClick });
  cb.current = { onMarkerClick, onClick };

  useImperativeHandle(ref, () => ({
    zoomIn: () => map.current?.zoomIn(),
    zoomOut: () => map.current?.zoomOut(),
    refit: () => { last.current.fit = null; fit(); },
    invalidate: () => map.current?.invalidateSize(),
  }));

  // create the map once
  useEffect(() => {
    const m = L.map(el.current, { zoomControl: false, center: initialCenter ? [initialCenter.lat, initialCenter.lon] : INDIA, zoom: initialCenter ? initialZoom : 5, attributionControl: true });
    base.current.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' });
    base.current.sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Imagery &copy; Esri' });
    base.current.street.addTo(m);
    m.attributionControl.setPrefix(false);
    m.on('click', (e) => cb.current.onClick?.({ lat: e.latlng.lat, lon: e.latlng.lng }));
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      // Layers belong to this map instance: forget them so a re-created map redraws everything.
      for (const o of objs.current.markers.values()) o.stopped = true;
      for (const s of Object.values(objs.current)) s.clear();
      last.current = { fit: null, follow: null };
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // street / satellite
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const { street, sat } = base.current;
    if (satellite) { m.removeLayer(street); sat.addTo(m); } else { m.removeLayer(sat); street.addTo(m); }
  }, [satellite]);

  // markers (with smooth gliding)
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const store = objs.current.markers;
    const seen = new Set();
    for (const d of markers) {
      if (d.lat == null || d.lon == null) continue;
      seen.add(d.id);
      const key = keyOf(d, showLabels);
      let o = store.get(d.id);
      if (!o) {
        const marker = L.marker([d.lat, d.lon], { icon: L.divIcon({ className: '', html: markerHtml(d, showLabels), iconSize: [0, 0] }), keyboard: false, zIndexOffset: d.selected ? 1000 : 0 });
        marker.on('click', (e) => { L.DomEvent.stopPropagation(e); cb.current.onMarkerClick?.(d.id); });
        marker.addTo(m);
        o = { marker, key, to: [d.lat, d.lon], last: performance.now() };
        store.set(d.id, o);
      } else {
        if (o.key !== key) {
          o.marker.setIcon(L.divIcon({ className: '', html: markerHtml(d, showLabels), iconSize: [0, 0] }));
          o.marker.setZIndexOffset(d.selected ? 1000 : 0);
          o.key = key;
        }
        glide(o, d.lat, d.lon);
      }
    }
    for (const [id, o] of store) if (!seen.has(id)) { o.stopped = true; o.marker.remove(); store.delete(id); }
  }, [markers, showLabels]);

  // routes
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    sync(objs.current.routes, routes, (r) => L.polyline(r.points.map((p) => [p.lat, p.lon]), { color: r.color || '#d93636', weight: 5, opacity: 0.95, lineJoin: 'round', lineCap: 'round' }), m);
  }, [routes]);

  // trip start / end dots
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    sync(objs.current.dots, dots, (d) => L.marker([d.lat, d.lon], { icon: L.divIcon({ className: '', html: '<div class="endpoint"></div>', iconSize: [0, 0] }), interactive: false, keyboard: false }), m);
  }, [dots]);

  // geofences
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const shapes = [
      ...circles.map((c) => ({ ...c, key: `c${c.id}`, make: () => L.circle([c.lat, c.lon], { radius: c.radiusM, color: c.color || '#d93636', weight: c.draft ? 3 : 2.5, dashArray: c.draft ? '6 6' : undefined, fillColor: c.color || '#d93636', fillOpacity: c.draft ? 0.3 : 0.22 }) })),
      ...polygons.map((p) => ({ ...p, key: `p${p.id}`, make: () => L.polygon(p.points, { color: p.color || '#d93636', weight: 2.5, fillOpacity: 0.22 }) })),
    ];
    sync(objs.current.shapes, shapes.map((s) => ({ ...s, id: s.key })), (s) => s.make(), m);
  }, [circles, polygons]);

  function fit() {
    const m = map.current;
    const pts = (fitTo || []).filter((p) => p && p.lat != null);
    if (!m || !pts.length) return;
    if (pts.length === 1) m.setView([pts[0].lat, pts[0].lon], Math.max(m.getZoom(), 14));
    else m.fitBounds(pts.map((p) => [p.lat, p.lon]), { padding: [padding, padding], maxZoom: 16 });
  }
  useEffect(() => {
    if (fitKey === undefined || fitKey === last.current.fit) return;
    if (!(fitTo || []).length) return;
    last.current.fit = fitKey;
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, fitTo?.length]);

  useEffect(() => {
    const m = map.current;
    if (!m || !follow) return;
    const k = `${follow.lat},${follow.lon}`;
    if (k === last.current.follow) return;
    last.current.follow = k;
    m.setView([follow.lat, follow.lon], Math.max(m.getZoom(), 15), { animate: true });
  }, [follow?.lat, follow?.lon]);

  return <div ref={el} style={{ position: 'absolute', inset: 0 }} />;
}

/** Adds, updates (by JSON of the data) and removes layers keyed by id. */
function sync(store, items, make, m) {
  const seen = new Set();
  for (const it of items) {
    seen.add(it.id);
    const sig = JSON.stringify(it);
    const cur = store.get(it.id);
    if (cur && cur.sig === sig) continue;
    if (cur) cur.layer.remove();
    const layer = make(it);
    layer.addTo(m);
    store.set(it.id, { layer, sig });
  }
  for (const [id, o] of store) if (!seen.has(id)) { o.layer.remove(); store.delete(id); }
}

// Vehicles glide to the new position over about as long as the gap since the last update.
function glide(o, lat, lon) {
  const now = performance.now();
  if (o.to && o.to[0] === lat && o.to[1] === lon) return;
  const cur = o.marker.getLatLng();
  o.from = [cur.lat, cur.lng];
  o.to = [lat, lon];
  o.t0 = now;
  o.dur = Math.max(100, Math.min(2000, now - (o.last || now - 1000)));
  o.last = now;
  if (o.raf) return;
  const step = () => {
    if (o.stopped) return;
    const k = Math.min(1, (performance.now() - o.t0) / o.dur);
    o.marker.setLatLng([o.from[0] + (o.to[0] - o.from[0]) * k, o.from[1] + (o.to[1] - o.from[1]) * k]);
    o.raf = k < 1 ? requestAnimationFrame(step) : 0;
  };
  o.raf = requestAnimationFrame(step);
}

/**
 * A map card with the usual buttons: map / satellite, zoom, show all, and a bigger / smaller toggle.
 * Pass the same props as MapCanvas. `height` is the normal height in px; `tools` hides the buttons.
 */
export function MapView({ height = 360, tools = true, expandable = false, fitButton = true, note, className = '', style, ...rest }) {
  const canvas = useRef(null);
  const [sat, setSat] = useState(false);
  const [big, setBig] = useState(false);
  return (
    <div className={`map-card ${className}`} style={{ height: big ? Math.round(height * 1.7) : height, transition: 'height 0.25s', ...style }}>
      <MapCanvas ref={canvas} satellite={sat} {...rest} />
      {tools && (
        <div className="map-tools">
          <button type="button" className={`map-btn layer ${sat ? 'on' : ''}`} onClick={() => setSat(!sat)} aria-pressed={sat} aria-label="Satellite view">
            <Icon name="layers" size={18} stroke={2} />
            {sat ? 'SAT' : 'MAP'}
          </button>
          <div className="map-zoom">
            <button type="button" onClick={() => canvas.current?.zoomIn()} aria-label="Zoom in"><Icon name="plus" size={18} stroke={2.2} /></button>
            <button type="button" onClick={() => canvas.current?.zoomOut()} aria-label="Zoom out"><Icon name="minus" size={18} stroke={2.2} /></button>
          </div>
          {fitButton && (
            <button type="button" className="map-btn" onClick={() => canvas.current?.refit()} aria-label="Show everything"><Icon name="fit" size={18} stroke={2} /></button>
          )}
          {expandable && (
            <button type="button" className="map-btn" onClick={() => setBig(!big)} aria-label={big ? 'Smaller map' : 'Bigger map'}>
              <Icon name={big ? 'shrink' : 'expand'} size={17} stroke={2.2} />
            </button>
          )}
        </div>
      )}
      {note && <div className="map-note">{note}</div>}
    </div>
  );
}
