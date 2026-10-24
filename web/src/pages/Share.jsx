// Public live-location page for share links (no login).
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Marker } from 'react-leaflet';
import { api } from '../lib/api';
import { useShareLive } from '../lib/live';
import { dateTime, timeAgo } from '../lib/format';
import { MapView, Follow, vehicleIcon } from '../components/MapView';
import { ErrorBox, OnlinePill, Spinner } from '../components/ui';

export default function Share() {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const { live, error: liveError } = useShareLive(token);

  useEffect(() => {
    api(`/public/share/${token}`, { auth: false }).then((r) => setInfo(r.data)).catch(setError);
  }, [token]);

  const state = live || info?.live;
  const pos = state?.lat != null ? [state.lat, state.lon] : null;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div className="brand"><img src="/favicon.svg" alt="" width={26} /> Pavakie Tracker</div>
        {info && <span className="muted small">Link expires {dateTime(info.expiresAt)}</span>}
      </div>
      {error || liveError ? (
        <ErrorBox error={liveError || error} />
      ) : !info ? (
        <Spinner />
      ) : (
        <div className="stack">
          <div className="card row">
            <strong>{info.name || 'Shared vehicle'}</strong>
            <OnlinePill online={state?.online} lastSeenAt={state?.lastSeenAt} />
            <span className="muted small">{state?.speed ?? 0} km/h · updated {timeAgo(state?.gpsTime)}</span>
          </div>
          {pos ? (
            <MapView center={pos} zoom={16} className="map tall">
              <Follow point={pos} follow />
              <Marker position={pos} icon={vehicleIcon({ online: state.online, heading: state.heading })} />
            </MapView>
          ) : (
            <div className="card">No position yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
