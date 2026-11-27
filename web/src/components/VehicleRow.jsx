// One vehicle as a row: picture, plate, driver and km today, speed and last update.
import { agoText, plateOrName } from '../lib/format';
import { DUE_SOON_DAYS, daysUntil } from '../lib/service';
import { STATUS_LABEL, statusGroup } from '../lib/status';
import { DriverAvatar, VehicleThumb } from './vehicle';

export function SpeedText({ state, group }) {
  const moving = group === 'moving' || group === 'stopped';
  if (!moving) return <span className="bold small" style={{ color: group === 'nogps' ? 'var(--warn-ink)' : 'var(--muted)' }}>{state?.lastSeenAt ? STATUS_LABEL[group] : 'Waiting'}</span>;
  return <span className="speed"><b>{state.speed ?? 0}</b><span>km/h</span></span>;
}

export function StatusLine({ state, group }) {
  return (
    <span className={`status ${group}`} style={{ fontSize: 12 }}>
      <span className={`dot ${group}`} />
      {agoText(state?.lastSeenAt)}
    </span>
  );
}

export default function VehicleRow({ device, state, selected, onClick }) {
  const group = statusGroup(state);
  const due = device.serviceDue ? daysUntil(device.serviceDue) : null;
  return (
    <button type="button" className={`vrow ${selected ? 'on' : ''}`} onClick={onClick}>
      <VehicleThumb device={device} dimmed={group === 'offline'} warn={due != null && due <= DUE_SOON_DAYS ? due : undefined} />
      <span className="mid">
        {device.registrationNumber ? <span className="plate">{device.registrationNumber}</span> : <span className="muted bold">{plateOrName(device)}</span>}
        <span className="driver-line">
          {device.mainDriver ? (<><DriverAvatar driver={device.mainDriver} size={20} /><span className="ellipsis">{device.mainDriver.name.split(' ')[0]}</span></>) : <span className="bold" style={{ color: 'var(--ink)' }}>No driver</span>}
          <span>{Math.round(device.todayKm ?? 0)} km today</span>
        </span>
      </span>
      <span className="end">
        <SpeedText state={state} group={group} />
        <StatusLine state={state} group={group} />
      </span>
    </button>
  );
}
