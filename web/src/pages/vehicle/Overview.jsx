// Vehicle overview: speed, status and address, the map, totals, then drivers, service and tracker.
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { api } from '../../lib/api';
import { useAddress } from '../../lib/data';
import { shortAddress, timeAgo } from '../../lib/format';
import { STATUS_LABEL, statusGroup } from '../../lib/status';
import { colorOf } from '../../lib/vehicles';
import Icon from '../../components/Icon';
import { MapView } from '../../components/MapView';
import { Button, Card } from '../../components/ui';
import { VehicleThumb } from '../../components/vehicle';
import DriverCard from './DriverCard';
import ServiceCard from './ServiceCard';
import TrackerCard from './TrackerCard';

export default function Overview({ device, state, isOwner }) {
  const nav = useNavigate();
  const g = statusGroup(state);
  const hasPos = state.lat != null && state.lon != null;
  const { address, loading } = useAddress(state.lat, state.lon);
  const summary = useQuery({ queryKey: ['summary', device.id], queryFn: () => api(`/devices/${device.id}/summary`), select: (r) => r.data }).data;
  const fmt = (n) => (n == null ? '-' : n.toLocaleString('en-IN', { maximumFractionDigits: n >= 100 ? 0 : 1 }));
  const moving = g === 'moving' || g === 'stopped';

  return (
    <div className="grid main-side">
      <div className="stack">
        <Card>
          <div className="row" style={{ gap: 20, alignItems: 'center' }}>
            <VehicleThumb device={device} size="lg" dimmed={g === 'offline'} />
            <div style={{ minWidth: 0, flex: 1 }}>
              {moving ? (
                <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>{state.speed ?? 0}<span style={{ fontSize: 16, fontWeight: 500, color: 'var(--muted)', letterSpacing: 0, marginLeft: 6 }}>km/h</span></div>
              ) : (
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: g === 'nogps' ? 'var(--warn-ink)' : 'var(--muted)' }}>{STATUS_LABEL[g]}</div>
              )}
              <div className={`status ${g}`} style={{ marginTop: 4 }}><span className={`dot ${g}`} />{state.lastSeenAt ? `${STATUS_LABEL[g]}, ${timeAgo(state.lastSeenAt)}` : 'Never connected'}</div>
              <div className="row small muted" style={{ gap: 6, marginTop: 4 }}>
                <Icon name="pin" size={14} />
                <span className="ellipsis">{hasPos ? address ? shortAddress(address, 60) : loading ? 'Finding address...' : `${state.lat.toFixed(5)}, ${state.lon.toFixed(5)}` : 'No GPS position yet'}</span>
              </div>
            </div>
          </div>
          <hr className="divider" style={{ margin: '18px 0' }} />
          <div className="row wrap" style={{ gap: 28 }}>
            <div className="stat"><b>{fmt(summary?.totalKm)} km</b><span>Total distance</span></div>
            <div className="stat"><b>{fmt(summary?.drivingHours)} h</b><span>Driving hours</span></div>
            <div className="stat"><b>{fmt(summary?.avgSpeed)} km/h</b><span>Average speed</span></div>
            <div className="stat"><b>{Math.round(device.todayKm ?? 0)} km</b><span>Today</span></div>
            <Button className="right" variant="soft-red" icon="replay" onClick={() => nav(`/vehicles/${device.id}/replay`)}>Replay a day</Button>
          </div>
        </Card>
        <MapView
          height={380}
          expandable
          markers={hasPos ? [{ id: device.id, kind: 'dot', lat: state.lat, lon: state.lon, fill: colorOf(device.color)?.hex || '#202020' }] : []}
          fitTo={hasPos ? [{ lat: state.lat, lon: state.lon }] : []}
          fitKey={device.id}
          follow={hasPos ? { lat: state.lat, lon: state.lon } : null}
          note={!hasPos ? 'No location yet' : undefined}
          initialCenter={hasPos ? { lat: state.lat, lon: state.lon } : undefined}
          initialZoom={15}
        />
      </div>
      <div className="stack">
        <DriverCard device={device} canEdit={isOwner} />
        <ServiceCard device={device} canEdit={isOwner} />
        <TrackerCard device={device} state={state} />
      </div>
    </div>
  );
}
