// Live map of every vehicle. Pick one from the list or the map; the panel below the list shows
// its speed and address, with previous / next and Details.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAddress, useFleet } from '../lib/data';
import { fleetMarkers, fleetRows, countByGroup } from '../lib/fleet';
import { plateOrName, shortAddress } from '../lib/format';
import { GROUPS, STATUS_LABEL, STATUS_ORDER } from '../lib/status';
import { setPref, usePref } from '../lib/prefs';
import Icon from '../components/Icon';
import { MapView } from '../components/MapView';
import { Button, Chip, Empty, IconButton, Skeleton, Switch } from '../components/ui';
import VehicleRow, { SpeedText } from '../components/VehicleRow';
import { VehicleThumb } from '../components/vehicle';

export default function MapPage() {
  const { devices, stateOf, isLoading } = useFleet();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const labels = usePref('platesOnMap');
  const [filter, setFilter] = useState('all');
  const [hover, setHover] = useState(null);
  const rows = useMemo(
    () => fleetRows(devices, stateOf).sort((a, b) => STATUS_ORDER[a.g] - STATUS_ORDER[b.g] || plateOrName(a.d).localeCompare(plateOrName(b.d))),
    [devices, stateOf],
  );
  const counts = countByGroup(rows);
  const shown = rows.filter((r) => filter === 'all' || r.g === filter);
  const located = rows.filter((r) => r.s?.lat != null);

  const [selectedId, setSelectedId] = useState(params.get('v'));
  useEffect(() => {
    if (!rows.length) return;
    if (!selectedId || !rows.some((r) => r.d.id === selectedId)) setSelectedId((located[0] ?? rows[0]).d.id);
  }, [rows, located, selectedId]);

  const index = Math.max(0, rows.findIndex((r) => r.d.id === selectedId));
  const sel = rows[index];
  const pos = sel?.s?.lat != null ? { lat: sel.s.lat, lon: sel.s.lon } : null;
  const { address, loading: addrLoading } = useAddress(pos?.lat, pos?.lon);
  const pick = (id) => { setSelectedId(id); setParams({ v: id }, { replace: true }); };
  const step = (by) => rows.length && pick(rows[(index + by + rows.length) % rows.length].d.id);
  const markers = fleetMarkers(rows, hover || selectedId);
  const [fitCount, setFitCount] = useState(0);

  return (
    <div className="map-layout">
      <div className="map-side">
        <div className="head">
          <div className="row between">
            <h2>Live map</h2>
            <label className="row small" style={{ gap: 8 }}>Plates <Switch checked={labels} onChange={(v) => setPref('platesOnMap', v)} label="Show number plates on the map" /></label>
          </div>
          <div className="chips">
            <Chip size="sm" on={filter === 'all'} onClick={() => setFilter('all')}>All {devices.length}</Chip>
            {GROUPS.map((g) => counts[g] > 0 && (
              <Chip key={g} size="sm" on={filter === g} dot={filter === g ? undefined : g} onClick={() => setFilter(filter === g ? 'all' : g)}>{counts[g]} {STATUS_LABEL[g]}</Chip>
            ))}
          </div>
        </div>
        <div className="list" onMouseLeave={() => setHover(null)}>
          {isLoading ? <div className="stack" style={{ padding: 8 }}><Skeleton h={60} /><Skeleton h={60} /></div> : shown.length === 0 ? (
            <Empty icon="car" title={devices.length ? 'No vehicle in this status' : 'No vehicles yet'} />
          ) : shown.map(({ d, s }) => <div key={d.id} onMouseEnter={() => setHover(d.id)}><VehicleRow device={d} state={s} selected={d.id === selectedId} onClick={() => pick(d.id)} /></div>)}
        </div>
        {sel && (
          <div className="map-sel">
            <div className="row">
              <VehicleThumb device={sel.d} dimmed={sel.g === 'offline'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="plate" style={{ fontSize: 17 }}>{plateOrName(sel.d)}</div>
                <div className="row small muted" style={{ gap: 6, alignItems: 'flex-start' }}>
                  <Icon name="pin" size={14} style={{ marginTop: 3, flex: 'none' }} />
                  <span>{!pos ? 'No GPS position yet' : address ? shortAddress(address, 46) : addrLoading ? 'Finding address...' : `${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}`}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 22 }}><SpeedText state={sel.s} group={sel.g} /></div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <IconButton icon="chevL" label="Previous vehicle" filled onClick={() => step(-1)} />
              <Button variant="primary" block onClick={() => nav(`/vehicles/${sel.d.id}`)}>Details</Button>
              <IconButton icon="chevR" label="Next vehicle" filled onClick={() => step(1)} />
            </div>
          </div>
        )}
      </div>
      <div className="map-main">
        <MapView
          height="100%"
          markers={markers}
          fitTo={located.map((r) => ({ lat: r.s.lat, lon: r.s.lon }))}
          fitKey={`${located.length}-${fitCount}`}
          follow={pos}
          showLabels={labels}
          onMarkerClick={pick}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}
