// Alerts from all my vehicles (last 7 days). New ones (since you last looked) have a dot.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { markAlertsSeen, useAlertsFeed } from '../lib/data';
import AlertList, { FEED_FILTERS } from '../components/AlertList';
import { Button, Card, ErrorBox, PageHead } from '../components/ui';

export default function Alerts() {
  const feed = useAlertsFeed();
  const nav = useNavigate();
  // The "new" dots stay for this visit; leaving the page marks everything as seen.
  const [visitSeen] = useState(readSeenOnce);
  const [readAll, setReadAll] = useState(false);
  useEffect(() => () => markAlertsSeen(), []);
  const seenAt = visitSeen || Date.now();
  return (
    <div className="page">
      <PageHead title="Alerts" sub="From all your vehicles, last 7 days">
        <Button icon="checks" onClick={() => { setReadAll(true); markAlertsSeen(); }}>Mark all as read</Button>
        <Button icon="sliders" onClick={() => nav('/profile')}>Alert settings</Button>
      </PageHead>
      <ErrorBox error={feed.error} />
      <Card>
        <AlertList
          items={feed.data || []}
          filters={FEED_FILTERS}
          showVehicle
          loading={feed.isLoading}
          isNew={(e) => !readAll && Date.parse(e.time) > seenAt}
          onOpen={(e) => nav(`/vehicles/${e.deviceId}/alerts`)}
        />
      </Card>
    </div>
  );
}

function readSeenOnce() {
  try { return Number(localStorage.getItem('pk.alertsSeenAt') || 0); } catch { return 0; }
}
