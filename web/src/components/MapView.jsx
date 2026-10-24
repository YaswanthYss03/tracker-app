// Leaflet map with OpenStreetMap tiles, plus helpers.
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const INDIA = [20.6, 78.9];

export function MapView({ center, zoom = 13, className = 'map', children }) {
  return (
    <MapContainer center={center || INDIA} zoom={center ? zoom : 5} className={className} scrollWheelZoom>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      {children}
    </MapContainer>
  );
}

/** Arrow marker rotated to the heading; grey when offline. */
export function vehicleIcon({ online = true, heading = 0 } = {}) {
  return L.divIcon({
    className: '',
    html: `<div class="vehicle-marker ${online ? '' : 'offline'}"><svg viewBox="0 0 24 24" style="transform:rotate(${Number(heading) || 0}deg)"><path d="M12 2l7 19-7-4-7 4z"/></svg></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

/** Fits the map to the given [lat, lon] points whenever `fitKey` changes. */
export function FitBounds({ points, fitKey, maxZoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    const valid = (points || []).filter((p) => p && p[0] != null && p[1] != null);
    if (valid.length === 1) map.setView(valid[0], Math.max(map.getZoom(), 14));
    else if (valid.length > 1) map.fitBounds(valid, { padding: [30, 30], maxZoom });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey]);
  return null;
}

/** Keeps the map centred on a moving point (when follow is on). */
export function Follow({ point, follow }) {
  const map = useMap();
  useEffect(() => {
    if (follow && point && point[0] != null) map.panTo(point, { animate: true });
  }, [follow, point?.[0], point?.[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export function ClickToPick({ onPick }) {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) });
  return null;
}
