// Drivers: everyone who drives your vehicles. Click one to edit, or add a new driver.
import { useState } from 'react';
import { useDrivers } from '../lib/data';
import { dmy, plateOrName } from '../lib/format';
import Icon from '../components/Icon';
import DriverForm from '../components/DriverForm';
import { Button, Card, Empty, PageHead, Skeleton } from '../components/ui';
import { DriverAvatar } from '../components/vehicle';

function licenceState(iso) {
  if (!iso) return null;
  const days = Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.now()) / 86400000);
  if (days < 0) return { tone: 'danger', text: `Licence expired ${dmy(iso)}` };
  if (days <= 30) return { tone: 'warn', text: `Licence expires in ${days} days` };
  return { tone: '', text: `Licence valid to ${dmy(iso)}` };
}

export default function Drivers() {
  const { data: drivers = [], isLoading } = useDrivers();
  const [form, setForm] = useState(null); // 'new' | driver
  return (
    <div className="page">
      <PageHead title="Drivers" sub={`${drivers.length} ${drivers.length === 1 ? 'driver' : 'drivers'}`}>
        <Button variant="primary" icon="plus" onClick={() => setForm('new')}>Add driver</Button>
      </PageHead>
      {isLoading ? (
        <div className="grid c3"><Skeleton h={150} r={20} /><Skeleton h={150} r={20} /><Skeleton h={150} r={20} /></div>
      ) : drivers.length === 0 ? (
        <Card><Empty icon="users" title="No drivers yet" action={<Button variant="primary" icon="plus" onClick={() => setForm('new')}>Add driver</Button>}>Add the people who drive your vehicles, then assign them from a vehicle.</Empty></Card>
      ) : (
        <div className="grid c3">
          {drivers.map((d) => {
            const lic = licenceState(d.licenceExpiry);
            return (
              <button key={d.id} type="button" className="card" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit' }} onClick={() => setForm(d)}>
                <div className="row" style={{ gap: 14 }}>
                  <DriverAvatar driver={d} size={64} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="bold ellipsis" style={{ fontSize: 17 }}>{d.name}</div>
                    {d.phone ? <div className="small muted row" style={{ gap: 6 }}><Icon name="phone" size={14} />{d.phone}</div> : <div className="small muted">No phone</div>}
                    {d.licenceNo && <div className="tiny muted mono">{d.licenceNo}</div>}
                  </div>
                  <Icon name="edit" size={16} color="var(--muted)" />
                </div>
                <div className="stack sm" style={{ marginTop: 14 }}>
                  {lic && <span className={`pill ${lic.tone}`} style={{ alignSelf: 'flex-start' }}>{lic.text}</span>}
                  <div className="row wrap" style={{ gap: 6 }}>
                    {d.mainOf.map((v) => <span key={v.id} className="pill accent"><span className="plate" style={{ fontSize: 11 }}>{plateOrName(v)}</span></span>)}
                    {d.backupOf.map((v) => <span key={v.id} className="pill"><span className="plate" style={{ fontSize: 11 }}>{plateOrName(v)}</span> backup</span>)}
                    {!d.mainOf.length && !d.backupOf.length && <span className="tiny muted">Not driving a vehicle</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {form && <DriverForm driver={form === 'new' ? null : form} onClose={() => setForm(null)} />}
    </div>
  );
}
