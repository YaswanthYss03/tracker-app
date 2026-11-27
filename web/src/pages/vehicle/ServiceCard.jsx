// Service history: one tag per record, the chosen record's details, next service due, and Add.
import { useState } from 'react';
import { useService } from '../../lib/data';
import { DUE_SOON_DAYS, daysUntil, dueText, longDate, rupees, serviceType } from '../../lib/service';
import Icon from '../../components/Icon';
import ServiceForm from '../../components/ServiceForm';
import { Button, Card, IconButton, Skeleton } from '../../components/ui';

export default function ServiceCard({ device, canEdit }) {
  const { data, isLoading } = useService(device.id);
  const [picked, setPicked] = useState(null);
  const [form, setForm] = useState(null); // 'new' | record
  const records = data?.data || [];
  const next = data?.next || null;
  const selected = records.find((r) => r.id === picked) || records[0] || null;
  const dueDate = selected?.nextDueDate || next?.date || null;
  const days = dueDate ? daysUntil(dueDate) : null;
  const late = days != null && days < 0;
  const progress = dueDate && next && dueDate === next.date ? next.progress : null;

  return (
    <Card title="Service" action={canEdit && <Button size="sm" variant="ghost" icon="plus" onClick={() => setForm('new')}>Add record</Button>}>
      {isLoading ? <Skeleton h={90} /> : !selected ? (
        <div className="muted small center" style={{ padding: '10px 0' }}>No service records yet. Keep the history here and get a reminder before the next one.</div>
      ) : (
        <div className="stack">
          <div className="row wrap" style={{ gap: 6 }}>
            {records.map((r) => (
              <button key={r.id} type="button" className={`tag-btn ${r.id === selected.id ? 'on' : ''}`} onClick={() => setPicked(r.id)} aria-pressed={r.id === selected.id}>
                {serviceType(r.type).label}<small>{longDate(r.date)}</small>
              </button>
            ))}
          </div>
          <div className="tile" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12, padding: 16 }}>
            <div className="row">
              <span className="ico" style={{ width: 38, height: 38 }}><Icon name="wrench" size={18} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{serviceType(selected.type).label}</b>
                <span>{[longDate(selected.date), selected.garage].filter(Boolean).join(' - ')}</span>
              </div>
              {canEdit && <IconButton icon="edit" label="Edit this record" size="sm" onClick={() => setForm(selected)} />}
            </div>
            {(selected.odometerKm != null || selected.cost != null) && (
              <div className="row" style={{ gap: 28 }}>
                {selected.odometerKm != null && <div className="stat"><b>{selected.odometerKm.toLocaleString('en-IN')} km</b><span>Odometer</span></div>}
                {selected.cost != null && <div className="stat"><b>{rupees(selected.cost)}</b><span>Cost</span></div>}
              </div>
            )}
            {selected.notes && <div className="small">{selected.notes}</div>}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }} className="stack sm">
              <div className="row between small">
                <span className="muted">Next service due</span>
                <b style={{ color: late ? 'var(--danger)' : days != null && days <= DUE_SOON_DAYS ? 'var(--warn-ink)' : undefined }}>{dueDate ? `${longDate(dueDate)} - ${dueText(days)}` : 'Not set'}</b>
              </div>
              {progress != null && <div className="progress"><span style={{ width: `${Math.round(progress * 100)}%`, background: late ? 'var(--danger)' : undefined }} /></div>}
            </div>
          </div>
        </div>
      )}
      {form && <ServiceForm deviceId={device.id} record={form === 'new' ? null : form} onClose={() => setForm(null)} />}
    </Card>
  );
}
