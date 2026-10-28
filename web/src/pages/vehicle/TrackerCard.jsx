// What the tracker reports right now.
import { timeOnly } from '../../lib/format';
import Icon from '../../components/Icon';
import { Card } from '../../components/ui';

const SIGNAL = ['No signal', 'Weak', 'Fair', 'Good', 'Excellent'];

export default function TrackerCard({ state, device }) {
  const tile = (icon, value, label) => (
    <div className="tile"><span className="ico"><Icon name={icon} size={17} /></span><div style={{ minWidth: 0 }}><b>{value}</b><span>{label}</span></div></div>
  );
  return (
    <Card title="Tracker" action={<span className="tiny muted mono">{device.imei}</span>}>
      <div className="tile-grid">
        {tile(state.online ? 'wifi' : 'wifiOff', state.online ? 'Online' : 'Offline', 'Connection')}
        {tile('clock', state.gpsTime ? timeOnly(state.gpsTime) : '-', 'Last GPS fix')}
        {tile('key', state.ignition == null ? '-' : state.ignition ? 'On' : 'Off', 'Ignition')}
        {tile('battery', state.batteryPercent != null ? `${state.batteryPercent}%` : '-', state.externalPower ? 'Battery, charging' : 'Battery')}
        {tile('signal', state.gsmSignal != null ? SIGNAL[Math.max(0, Math.min(4, state.gsmSignal))] : '-', 'Mobile signal')}
        {tile('gps', state.satellites != null ? String(state.satellites) : '-', 'Satellites')}
      </div>
    </Card>
  );
}
