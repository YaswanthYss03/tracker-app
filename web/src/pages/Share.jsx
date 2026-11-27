// Public live-location page for share links (no login).
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../lib/api';
import { useShareLive } from '../lib/live';
import { dateTime, timeAgo } from '../lib/format';
import { STATUS_LABEL, statusGroup } from '../lib/status';
import { Brand } from '../components/Layout';
import { MapView } from '../components/MapView';
import { ErrorBox, Spinner } from '../components/ui';

export default function Share() {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const { live, error: liveError } = useShareLive(token);
  useEffect(() => { api(`/public/share/${token}`, { auth: false }).then((r) => setInfo(r.data)).catch(setError); }, [token]);
  const state = live || info?.live;
  const pos = state?.lat != null ? { lat: state.lat, lon: state.lon } : null;
  const g = statusGroup(state);

  return (
    <div className="public">
      <div className="public-head"><Brand />{info && <span className="muted small right">Link expires {dateTime(info.expiresAt)}</span>}</div>
      <div className="page" style={{ maxWidth: 1000 }}>
        {error || liveError ? <ErrorBox error={liveError || error} /> : !info ? <Spinner /> : (
          <div className="stack">
            <div className="card row wrap" style={{ gap: 16 }}>
              <strong style={{ fontSize: 18 }}>{info.name || 'Shared vehicle'}</strong>
              <span className={`pill ${g === 'moving' ? 'ok' : ''}`}><span className={`dot ${g}`} />{STATUS_LABEL[g]}</span>
              <span className="muted small">{state?.speed ?? 0} km/h, updated {timeAgo(state?.gpsTime)}</span>
            </div>
            <MapView height={540} markers={pos ? [{ id: 'v', kind: 'dot', lat: pos.lat, lon: pos.lon, fill: '#202020' }] : []} follow={pos} initialCenter={pos || undefined} initialZoom={16} fitButton={false} note={!pos ? 'No position yet' : undefined} />
          </div>
        )}
      </div>
    </div>
  );
}
