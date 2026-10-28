// Main and backup driver of a vehicle. Change a driver from a picker (4 per row, 5 over 24).
// Picking a driver who already drives another vehicle asks: swap, or replace and leave that one empty.
import { useState } from 'react';
import { api, errorText } from '../../lib/api';
import { useDrivers, useRefresh } from '../../lib/data';
import { plateOrName } from '../../lib/format';
import { useToast } from '../../lib/toast';
import DriverForm from '../../components/DriverForm';
import Icon from '../../components/Icon';
import { Button, Card, ErrorBox, IconButton, Modal } from '../../components/ui';
import { DriverAvatar } from '../../components/vehicle';

const FIELD = { main: 'mainDriverId', backup: 'backupDriverId' };
const label = (v) => v.registrationNumber || v.name || 'another vehicle';

export default function DriverCard({ device, canEdit }) {
  const { data: drivers = [] } = useDrivers();
  const refresh = useRefresh();
  const toast = useToast();
  const [pick, setPick] = useState(null); // 'main' | 'backup'
  const [conflict, setConflict] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [turn, setTurn] = useState(0);

  const main = device.mainDriver || null;
  const backup = device.backupDriver || null;
  const current = pick === 'main' ? main : backup;
  const other = pick === 'main' ? backup : main;
  const patch = (id, body) => api(`/devices/${id}`, { method: 'PATCH', body });
  const elsewhere = (d, slot) => (slot === 'main' ? d.mainOf : d.backupOf).filter((v) => v.id !== device.id);
  const close = () => { setPick(null); setConflict(null); setError(null); };

  async function run(job, done) {
    setBusy(true);
    setError(null);
    try {
      await job();
      await refresh();
      if (done) toast(done);
      close();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  function assign(d, slot, others, swap) {
    return run(async () => {
      for (let i = 0; i < others.length; i += 1) await patch(others[i].id, { [FIELD[slot]]: swap && i === 0 && current ? current.id : null });
      await patch(device.id, { [FIELD[slot]]: d.id });
    }, 'Driver changed');
  }

  function choose(d) {
    const others = elsewhere(d, pick);
    if (others.length) setConflict(d);
    else assign(d, pick, [], false);
  }

  const choices = drivers.filter((d) => d.id !== other?.id);
  const cols = choices.length > 24 ? 'five' : '';

  const Slot = ({ role, driver, slot }) => {
    if (!driver) {
      return canEdit ? (
        <button type="button" className="driver-card empty" onClick={() => setPick(slot)}>
          <span className="avatar" style={{ width: 52, height: 52, background: 'var(--bg)', color: 'var(--accent)' }}><Icon name="plus" size={22} stroke={2.2} /></span>
          <span><span className="role" style={{ display: 'block' }}>{role}</span><span className="name">Add driver</span></span>
        </button>
      ) : <div className="muted small">No {role.toLowerCase()} driver set.</div>;
    }
    return (
      <div className="driver-card">
        <DriverAvatar driver={driver} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={`role ${slot}`}>{role}</div>
          <div className="name ellipsis">{driver.name}</div>
          {driver.phone && <a className="tiny muted" href={`tel:${driver.phone.replace(/[^+\d]/g, '')}`}>{driver.phone}</a>}
        </div>
        {canEdit && <IconButton icon="edit" label={`Change ${slot} driver`} filled onClick={() => setPick(slot)} />}
      </div>
    );
  };

  return (
    <Card title="Drivers" action={canEdit && <Button size="sm" variant="ghost" icon="plus" onClick={() => setAdding(true)}>New driver</Button>}>
      <div>
        <Slot role="MAIN" driver={main} slot="main" />
        {canEdit && main && backup ? (
          <div className="swap-row">
            <button type="button" className={`swap-btn ${turn % 2 ? 'turn' : ''}`} aria-label="Swap main and backup driver" onClick={() => { setTurn(turn + 1); run(() => patch(device.id, { mainDriverId: backup.id, backupDriverId: main.id }), 'Drivers swapped'); }}>
              <Icon name="swapV" size={16} stroke={2.2} />
            </button>
          </div>
        ) : <div style={{ height: 8 }} />}
        <Slot role="BACKUP" driver={backup} slot="backup" />
      </div>

      {pick && (
        <Modal title={conflict ? 'Driver already assigned' : pick === 'main' ? 'Main driver' : 'Backup driver'} onClose={close}>
          {conflict ? (
            <>
              <div className="row">
                <DriverAvatar driver={conflict} size={52} />
                <div>
                  <div className="bold">{conflict.name}</div>
                  <div className="small" style={{ color: 'var(--danger)' }}>{pick === 'main' ? 'Main' : 'Backup'} driver of {elsewhere(conflict, pick).map(label).join(', ')}</div>
                </div>
              </div>
              {current && <Button variant="primary" icon="swap" loading={busy} onClick={() => assign(conflict, pick, elsewhere(conflict, pick), true)}>Swap with {current.name.split(' ')[0]}</Button>}
              <Button onClick={() => assign(conflict, pick, elsewhere(conflict, pick), false)} disabled={busy}>Replace and leave {label(elsewhere(conflict, pick)[0])} empty</Button>
              <Button variant="ghost" onClick={() => setConflict(null)} disabled={busy}>Back</Button>
            </>
          ) : (
            <>
              <div className={`person-grid ${cols}`}>
                {choices.map((d) => {
                  const on = current?.id === d.id;
                  const taken = elsewhere(d, pick).length > 0;
                  return (
                    <button key={d.id} type="button" className={`person ${on ? 'on' : ''}`} disabled={busy} onClick={() => (on ? close() : choose(d))} title={taken ? `Drives ${elsewhere(d, pick).map(label).join(', ')}` : d.name}>
                      <span className="ring">
                        <DriverAvatar driver={d} size={cols ? 50 : 56} />
                        {taken && <span className="taken"><Icon name="swap" size={11} stroke={2.4} /></span>}
                      </span>
                      <span className="name ellipsis">{d.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
                <button type="button" className="person" onClick={() => { close(); setAdding(true); }} aria-label="Add a new driver">
                  <span className="ring"><span className="plus"><Icon name="plus" size={22} stroke={2.2} /></span></span>
                  <span className="name">Add</span>
                </button>
              </div>
              <div className="tiny muted">A small red badge means that driver already drives another vehicle.</div>
              <ErrorBox error={error} />
              {current && <button type="button" className="link" style={{ color: 'var(--danger)', alignSelf: 'center' }} disabled={busy} onClick={() => run(() => patch(device.id, { [FIELD[pick]]: null }), 'Driver removed')}>{pick === 'backup' ? 'No backup driver' : 'Remove main driver'}</button>}
            </>
          )}
          {conflict && <ErrorBox error={error} />}
        </Modal>
      )}
      {adding && <DriverForm onClose={() => setAdding(false)} />}
      {editing && <DriverForm driver={editing} onClose={() => setEditing(null)} />}
    </Card>
  );
}
