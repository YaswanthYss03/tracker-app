// Admin: "Contact us" messages and "Partner with us" requests from the app and website.
import { useState } from 'react';
import { api } from '../lib/api';
import { dateTime } from '../lib/format';
import { useAsync, Spinner, ErrorBox, Empty, Pill } from '../components/ui';

const PARTNER_LABELS = { dealer: 'Dealer', installer: 'Installer', fleet: 'Fleet owner', reseller: 'Reseller', other: 'Other' };

export default function Inquiries() {
  const [status, setStatus] = useState('new');
  const [kind, setKind] = useState('');
  const { data, error, loading, reload } = useAsync(
    () => api(`/admin/inquiries?limit=200${status ? `&status=${status}` : ''}${kind ? `&kind=${kind}` : ''}`),
    [status, kind]
  );
  const rows = data?.data || [];

  async function mark(id, next) {
    await api(`/admin/inquiries/${id}`, { method: 'PATCH', body: { status: next } });
    reload();
  }

  return (
    <>
      <div className="page-head">
        <h1>Inquiries</h1>
        {data && <span className="muted">{data.open} open</span>}
      </div>
      <div className="row" style={{ marginBottom: 12, gap: 8 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="new">Open</option>
          <option value="done">Done</option>
          <option value="">All</option>
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Type">
          <option value="">Contact + partner</option>
          <option value="contact">Contact us</option>
          <option value="partner">Partner requests</option>
        </select>
      </div>
      <ErrorBox error={error} />
      {loading && !data ? <Spinner /> : rows.length === 0 ? <Empty>Nothing here.</Empty> : (
        <div className="stack">
          {rows.map((r) => (
            <div key={r.id} className="card">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stack" style={{ gap: 4 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <Pill tone={r.kind === 'partner' ? 'brand' : undefined}>{r.kind === 'partner' ? `Partner · ${PARTNER_LABELS[r.partnerType] || r.partnerType}` : 'Contact'}</Pill>
                    <strong>{r.name}</strong>
                    {r.company && <span className="muted">· {r.company}</span>}
                    {r.city && <span className="muted">· {r.city}</span>}
                  </div>
                  <div className="small">
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone && <> · <a href={`tel:${r.phone.replace(/[^\d+]/g, '')}`}>{r.phone}</a></>}
                  </div>
                </div>
                <div className="stack" style={{ gap: 6, alignItems: 'flex-end' }}>
                  <span className="muted small">{dateTime(r.createdAt)}</span>
                  {r.status === 'new'
                    ? <button className="btn small" onClick={() => mark(r.id, 'done')}>Mark done</button>
                    : <button className="btn small" onClick={() => mark(r.id, 'new')}>Reopen</button>}
                </div>
              </div>
              {r.message && <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>{r.message}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
