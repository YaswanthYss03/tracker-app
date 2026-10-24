// One tracker: header with live status + tabs.
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { api } from '../../lib/api';
import { useLive } from '../../lib/live';
import { alertText, SEVERE_ALERTS } from '../../lib/format';
import { useAsync, Spinner, ErrorBox, OnlinePill, Pill, useToast } from '../../components/ui';
import { LiveTab, HistoryTab, TripsTab, ReportTab, AlertsTab } from './trackingTabs';
import { GeofencesTab, SharingTab, SettingsTab } from './manageTabs';

const TABS = [
  ['live', 'Live'],
  ['history', 'History'],
  ['trips', 'Trips'],
  ['report', 'Daily report'],
  ['alerts', 'Alerts'],
  ['geofences', 'Geofences'],
  ['sharing', 'Sharing', true],
  ['settings', 'Settings'],
];

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState('live');
  const [newAlerts, setNewAlerts] = useState([]);
  const { data, error, loading, reload } = useAsync(() => api(`/devices/${id}`), [id]);
  const device = data?.data;

  const { live, connected } = useLive(device ? [device.id] : [], {
    onAlert: (a) => {
      setNewAlerts((list) => [a, ...list].slice(0, 20));
      toast(alertText(a), SEVERE_ALERTS.has(a.type) ? 'danger' : '');
    },
    onRevoked: () => {
      toast('You no longer have access to this tracker', 'danger');
      navigate('/');
    },
  });

  if (loading && !device) return <Spinner />;
  if (error) {
    return (
      <div className="stack">
        <ErrorBox error={error} />
        <Link to="/">← Back to my trackers</Link>
      </div>
    );
  }

  const state = live[device.id] || device.live;
  const isOwner = device.role === 'owner';
  const props = { device, state, isOwner, reload, newAlerts, connected };

  return (
    <>
      <div className="page-head">
        <div>
          <Link to="/" className="small">← My trackers</Link>
          <h1>{device.name || `Tracker ${device.imei.slice(-4)}`}</h1>
          <div className="row small muted">
            <OnlinePill online={state.online} lastSeenAt={state.lastSeenAt} />
            {state.ignition != null && <Pill tone={state.ignition ? 'brand' : ''}>Ignition {state.ignition ? 'on' : 'off'}</Pill>}
            {!isOwner && <Pill>Shared with you</Pill>}
            <span className="mono">IMEI {device.imei}</span>
          </div>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {TABS.filter(([, , ownerOnly]) => !ownerOnly || isOwner).map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'live' && <LiveTab {...props} />}
      {tab === 'history' && <HistoryTab {...props} />}
      {tab === 'trips' && <TripsTab {...props} />}
      {tab === 'report' && <ReportTab {...props} />}
      {tab === 'alerts' && <AlertsTab {...props} />}
      {tab === 'geofences' && <GeofencesTab {...props} />}
      {tab === 'sharing' && isOwner && <SharingTab {...props} />}
      {tab === 'settings' && <SettingsTab {...props} />}
    </>
  );
}
