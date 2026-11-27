// Geofences: areas on the map. Each has its own colour (map and list). Click the map to place a new one.
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '../../lib/api';
import { useToast } from '../../lib/toast';
import Icon from '../../components/Icon';
import { MapView } from '../../components/MapView';
import { Button, Card, Confirm, Empty, ErrorBox, Input } from '../../components/ui';

export const FENCE_COLORS = ['#D93636', '#2F6DB5', '#1F8A55', '#C27400', '#7A4FA8', '#2A8C82', '#C2437A', '#5B6770'];
const colorFor = (i) => FENCE_COLORS[i % FENCE_COLORS.length];

export default function Geofences({ device, state, isOwner }) {
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['geofences', device.id], queryFn: () => api(`/devices/${device.id}/geofences`) });
  const fences = q.data?.data || [];
  const hasPos = state.lat != null;
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const reload = () => qc.invalidateQueries({ queryKey: ['geofences', device.id] });

  async function save() {
    setError(null);
    try {
      await api(`/devices/${device.id}/geofences`, { method: 'POST', body: { name: draft.name.trim(), type: 'circle', center: { lat: draft.lat, lon: draft.lon }, radiusM: draft.radiusM } });
      setDraft(null);
      await reload();
      toast('Area saved');
    } catch (e) {
      setError(errorText(e));
    }
  }
  const toggle = async (f, key) => { await api(`/devices/${device.id}/geofences/${f.id}`, { method: 'PATCH', body: { [key]: !f[key] } }); reload(); };

  const circles = [
    ...fences.map((f, i) => ({ f, i })).filter(({ f }) => f.type === 'circle' && f.center).map(({ f, i }) => ({ id: f.id, lat: f.center.lat, lon: f.center.lon, radiusM: f.radiusM || 0, color: colorFor(i) })),
    ...(draft?.lat != null ? [{ id: 'draft', lat: draft.lat, lon: draft.lon, radiusM: draft.radiusM, draft: true, color: colorFor(fences.length) }] : []),
  ];
  const polygons = fences.map((f, i) => ({ f, i })).filter(({ f }) => f.type === 'polygon' && f.points).map(({ f, i }) => ({ id: f.id, points: f.points, color: colorFor(i) }));
  const fit = [...(hasPos ? [{ lat: state.lat, lon: state.lon }] : []), ...fences.filter((f) => f.center).map((f) => ({ lat: f.center.lat, lon: f.center.lon }))];

  return (
    <div className="grid main-side">
      <MapView
        height={480}
        expandable
        markers={hasPos ? [{ id: device.id, kind: 'dot', lat: state.lat, lon: state.lon, fill: '#202020' }] : []}
        circles={circles}
        polygons={polygons}
        fitTo={fit}
        fitKey={fences.length}
        onClick={draft ? ({ lat, lon }) => setDraft({ ...draft, lat, lon }) : undefined}
        note={draft && draft.lat == null ? 'Click the map to place the centre' : undefined}
      />
      <div className="stack">
        {isOwner && !draft && <Button variant="primary" icon="plus" onClick={() => setDraft({ lat: state.lat, lon: state.lon, radiusM: 200, name: '' })}>Add area</Button>}
        {draft && (
          <Card title="New area" action={<span className="dot" style={{ background: colorFor(fences.length), width: 12, height: 12 }} />}>
            <div className="stack">
              <p className="muted small">Click the map to move the centre. The coloured circle shows the radius.</p>
              <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Home, Office, School" maxLength={60} autoFocus />
              <div className="field">
                <label htmlFor="radius">Radius, {draft.radiusM} m</label>
                <input id="radius" className="range" type="range" min={50} max={5000} step={50} value={draft.radiusM} onChange={(e) => setDraft({ ...draft, radiusM: Number(e.target.value) })} />
              </div>
              <ErrorBox error={error} />
              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
                <Button variant="primary" disabled={draft.lat == null || !draft.name.trim()} onClick={save}>Save area</Button>
              </div>
            </div>
          </Card>
        )}
        <Card title="Areas">
          {q.isLoading ? <div className="muted small">Loading...</div> : fences.length === 0 ? (
            <Empty icon="shapes" title="No areas yet">Add one to get an alert when the vehicle enters or leaves.</Empty>
          ) : fences.map((f, i) => (
            <div key={f.id} className="item">
              <span className="dot" style={{ background: colorFor(i), width: 12, height: 12 }} />
              <div className="body">
                <div className="t">{f.name}</div>
                <div className="d">{f.type === 'circle' ? `${f.radiusM} m radius` : `${f.points?.length}-point area`}</div>
              </div>
              {isOwner && (
                <>
                  {[['alertOnEnter', 'Enter'], ['alertOnExit', 'Leave']].map(([k, l]) => (
                    <button key={k} type="button" aria-pressed={f[k]} aria-label={`Alert on ${l.toLowerCase()}`} onClick={() => toggle(f, k)}
                      style={{ height: 26, padding: '0 10px', borderRadius: 13, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${f[k] ? colorFor(i) : 'var(--border)'}`, background: f[k] ? colorFor(i) : 'transparent', color: f[k] ? '#fff' : 'var(--muted)' }}>{l}</button>
                  ))}
                  <button type="button" className="icon-btn sm" aria-label={`Delete ${f.name}`} onClick={() => setDeleting(f)} style={{ color: 'var(--danger)' }}><Icon name="trash" size={16} /></button>
                </>
              )}
            </div>
          ))}
        </Card>
      </div>
      {deleting && (
        <Confirm danger title="Delete area" message={`Delete "${deleting.name}"? You will stop getting alerts for it.`} confirmLabel="Delete"
          onConfirm={async () => { await api(`/devices/${device.id}/geofences/${deleting.id}`, { method: 'DELETE' }); await reload(); toast('Area deleted'); }}
          onClose={() => setDeleting(null)} />
      )}
    </div>
  );
}
