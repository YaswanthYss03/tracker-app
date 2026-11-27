// First-time tour: dims the page, highlights one feature at a time and shows a small card with
// Back / Next and a Skip. Starts once per account; Profile and settings can replay it.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { setPref, usePref } from '../lib/prefs';

const REPLAY_EVENT = 'pavakie:tour';
export const replayTour = () => window.dispatchEvent(new Event(REPLAY_EVENT));

// side: the element lives in the sidebar, which is a slide-out menu on narrow screens.
const STEPS = [
  { id: 'add', title: 'Add your vehicle', body: 'Enter the IMEI printed on your tracker and the activation code that came with it.' },
  { id: 'vehicles', side: true, title: 'Your vehicles', body: 'Open any vehicle to see where it is now, its speed and whether the ignition is on.' },
  { id: 'alerts', title: 'Alerts', body: 'Overspeed, power cut, geofence and offline alerts show up here.' },
  { id: 'map', side: true, title: 'Live map', body: 'See every vehicle on one live map.' },
  { id: 'replay', side: true, title: 'Replay', body: 'Play back any ride at 1x to 10x speed, with stop markers.' },
  { id: 'profile', side: true, title: 'Profile and settings', body: 'Notification settings, your drivers and sharing, and this tour again any time.' },
];

const PAD = 6;
const CARD_W = 340;
const GAP = 14;
const NARROW = '(max-width: 900px)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const find = (id) => document.querySelector(`[data-tour="${id}"]`);

export default function Tour({ onMenu }) {
  const { user } = useAuth();
  const seen = usePref('tourSeen');
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [vw, setVw] = useState({ w: window.innerWidth, h: window.innerHeight });
  const cardRef = useRef(null);
  const nextRef = useRef(null);
  const step = STEPS[index];

  const finish = useCallback(() => {
    setActive(false);
    setIndex(0);
    setRect(null);
    onMenu(false);
    if (user?.id) setPref('tourSeen', { ...seen, [user.id]: true });
  }, [onMenu, seen, user?.id]);

  // First time on this account: begin on the dashboard once its buttons are on the page.
  useEffect(() => {
    if (!user?.id || seen[user.id] || active || pathname !== '/') return;
    let stop = false;
    (async () => {
      for (let i = 0; i < 20 && !stop; i++) {
        if (find('add')) { await sleep(500); if (!stop) { setIndex(0); setActive(true); } return; }
        await sleep(250);
      }
    })();
    return () => { stop = true; };
  }, [user?.id, seen, active, pathname]);

  // "Take the tour" from Profile: go to the dashboard, then start.
  useEffect(() => {
    const go = () => { nav('/'); setTimeout(() => { setIndex(0); setActive(true); }, 400); };
    window.addEventListener(REPLAY_EVENT, go);
    return () => window.removeEventListener(REPLAY_EVENT, go);
  }, [nav]);

  // Find the current step's element; skip the step if it isn't there.
  useEffect(() => {
    if (!active || !step) return;
    let stop = false;
    setRect(null);
    (async () => {
      const narrow = window.matchMedia(NARROW).matches;
      onMenu(narrow && !!step.side);
      if (narrow && step.side) await sleep(260); // menu slide-in
      for (let i = 0; i < 10 && !stop; i++) {
        const el = find(step.id);
        if (el && el.getClientRects().length) {
          el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          if (!stop) setRect(el.getBoundingClientRect());
          return;
        }
        await sleep(120);
      }
      if (!stop) (index >= STEPS.length - 1 ? finish : () => setIndex((n) => n + 1))();
    })();
    return () => { stop = true; };
  }, [active, index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the highlight on the element when the window changes.
  useEffect(() => {
    if (!active) return;
    const upd = () => {
      setVw({ w: window.innerWidth, h: window.innerHeight });
      const el = step && find(step.id);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener('resize', upd);
    window.addEventListener('scroll', upd, true);
    return () => { window.removeEventListener('resize', upd); window.removeEventListener('scroll', upd, true); };
  }, [active, step]);

  // Keyboard: Escape skips, arrows move, Tab stays inside the card.
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); finish(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); index >= STEPS.length - 1 ? finish() : setIndex(index + 1); }
      else if (e.key === 'ArrowLeft' && index > 0) { e.preventDefault(); setIndex(index - 1); }
      else if (e.key === 'Tab' && cardRef.current) {
        const items = [...cardRef.current.querySelectorAll('button')];
        if (!items.length) return;
        const i = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [active, index, finish]);

  useLayoutEffect(() => { if (rect) nextRef.current?.focus({ preventScroll: true }); }, [rect, index]);

  if (!active || !step) return null;
  const last = index >= STEPS.length - 1;
  const cardW = Math.min(CARD_W, vw.w - 32);
  let cardStyle = { width: cardW, left: 16, top: 16 };
  let arrow = null;
  if (rect) {
    const cx = rect.left + rect.width / 2;
    const left = Math.max(16, Math.min(vw.w - 16 - cardW, cx - cardW / 2));
    const below = rect.top + rect.height / 2 < vw.h / 2;
    // Sidebar items sit at the left, so on wide screens the card goes to their right.
    if (step.side && !window.matchMedia(NARROW).matches) {
      cardStyle = { width: cardW, left: rect.right + PAD + GAP, top: Math.max(16, Math.min(vw.h - 220, rect.top + rect.height / 2 - 70)) };
      arrow = { left: -6, top: 54, side: 'left' };
    } else {
      cardStyle = below ? { width: cardW, left, top: rect.bottom + PAD + GAP } : { width: cardW, left, bottom: vw.h - rect.top + PAD + GAP };
      arrow = { left: Math.max(18, Math.min(cardW - 30, cx - left - 6)), [below ? 'top' : 'bottom']: -6 };
    }
  }

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-label="App tour">
      <div className="tour-dim" onClick={finish} />
      {rect && <div className="tour-hole" style={{ left: rect.left - PAD, top: rect.top - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }} />}
      {rect && (
        <div className="tour-card" ref={cardRef} style={cardStyle} key={step.id}>
          {arrow && <span className="tour-arrow" style={arrow} />}
          <div className="tour-title" aria-live="polite">{step.title}</div>
          <div className="tour-body">{step.body}</div>
          <div className="tour-foot">
            <button type="button" className="tour-skip" onClick={finish}>Skip</button>
            <span className="tour-count" aria-label={`Step ${index + 1} of ${STEPS.length}`}>{index + 1} of {STEPS.length}</span>
            {index > 0 && <button type="button" className="btn sm" onClick={() => setIndex(index - 1)}>Back</button>}
            <button type="button" className="btn sm primary" ref={nextRef} onClick={last ? finish : () => setIndex(index + 1)}>{last ? 'Done' : 'Next'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
