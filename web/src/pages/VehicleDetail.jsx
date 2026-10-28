// One vehicle. The tabs (Overview, Replay, Trips, Report, Alerts, Geofences, Settings) are the
// same functions the app has, as pages.  /vehicles/:id/:section
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '../lib/api';
import { useDevice } from '../lib/data';
import { plateOrName } from '../lib/format';
import { STATUS_LABEL, statusGroup } from '../lib/status';
import AlertList, { VEHICLE_FILTERS } from '../components/AlertList';
import Icon from '../components/Icon';
import VehicleForm from '../components/VehicleForm';
import { Button, Card, ErrorBox, Skeleton, Tabs } from '../components/ui';
import { VehicleThumb } from '../components/vehicle';
import { ReplayView } from './Replay';
import Geofences from './vehicle/Geofences';
import Overview from './vehicle/Overview';
import Report from './vehicle/Report';
import Settings from './vehicle/Settings';
import ShareDialog from './vehicle/ShareDialog';
import Trips from './vehicle/Trips';

const TABS = [
  ['overview', 'Overview', 'car'],
  ['replay', 'Replay', 'replay'],
  ['trips', 'Trips', 'trips'],
  ['report', 'Report', 'activity'],
  ['alerts', 'Alerts', 'bell'],
  ['geofences', 'Geofences', 'shapes'],
  ['settings', 'Settings', 'sliders'],
];

function VehicleAlerts({ device }) {
  const q = useQuery({ queryKey: ['events', device.id], queryFn: () => api(`/devices/${device.id}/events?limit=300`), select: (r) => r.data });
  return <Card><AlertList items={q.data || []} filters={VEHICLE_FILTERS} loading={q.isLoading} /></Card>;
}

export default function VehicleDetail() {
  const { id, section = 'overview' } = useParams();
  const nav = useNavigate();
  const { device, state, isLoading, error } = useDevice(id);
  const [sharing, setSharing] = useState(false);
  const [editing, setEditing] = useState(false);

  if (isLoading) return <div className="page"><Skeleton h={60} w="40%" /><div style={{ height: 16 }} /><Skeleton h={400} /></div>;
  if (!device) return <div className="page"><ErrorBox error={error ? errorText(error) : 'Vehicle not found'} /><Button onClick={() => nav('/vehicles')} style={{ marginTop: 12 }}>Back to vehicles</Button></div>;

  const g = statusGroup(state);
  const isOwner = device.role === 'owner';
  const hasPos = state.lat != null;
  const props = { device, state, isOwner };
  const tabs = isOwner ? TABS : TABS;

  return (
    <div className="page">
      <div className="row small" style={{ marginBottom: 10 }}>
        <Link to="/vehicles" className="muted row" style={{ gap: 4 }}><Icon name="chevL" size={16} />Vehicles</Link>
      </div>
      <div className="page-head" style={{ marginBottom: 6 }}>
        <div className="row" style={{ gap: 16 }}>
          <VehicleThumb device={device} dimmed={g === 'offline'} />
          <div>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
              <h1 className="plate" style={{ fontSize: 26 }}>{plateOrName(device)}</h1>
              <span className={`pill ${g === 'moving' ? 'ok' : g === 'nogps' ? 'warn' : ''}`}><span className={`dot ${g}`} />{STATUS_LABEL[g]}</span>
              {!isOwner && <span className="pill">Shared with you</span>}
            </div>
            {device.registrationNumber && device.name && <div className="sub muted">{device.name}</div>}
          </div>
        </div>
        <div className="actions">
          <Button icon="share" onClick={() => setSharing(true)}>Share</Button>
          <Button icon="navigate" disabled={!hasPos} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${state.lat},${state.lon}`, '_blank', 'noopener')}>Navigate</Button>
          {isOwner && <Button icon="edit" onClick={() => setEditing(true)}>Edit</Button>}
        </div>
      </div>
      <Tabs value={section} onChange={(s) => nav(s === 'overview' ? `/vehicles/${id}` : `/vehicles/${id}/${s}`)} options={tabs} />
      <div style={{ marginTop: 20 }}>
        {section === 'overview' && <Overview {...props} />}
        {section === 'replay' && <ReplayView lockedId={id} />}
        {section === 'trips' && <Trips {...props} />}
        {section === 'report' && <Report {...props} />}
        {section === 'alerts' && <VehicleAlerts {...props} />}
        {section === 'geofences' && <Geofences {...props} />}
        {section === 'settings' && <Settings {...props} />}
      </div>
      {sharing && <ShareDialog device={device} state={state} isOwner={isOwner} onClose={() => setSharing(false)} />}
      {editing && <VehicleForm device={device} onClose={() => setEditing(false)} />}
    </div>
  );
}
