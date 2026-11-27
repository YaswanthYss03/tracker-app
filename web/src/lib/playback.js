// Plays progress 0 -> 1 over `baseMs / speed` while playing. `speed` is 1x..10x (see lib/replay.js).
import { useCallback, useEffect, useRef, useState } from 'react';

const KEY = 'gps.replaySpeed';
const SPEEDS = [1, 2, 3, 5, 10];

/** The chosen replay speed, remembered between visits. */
export function useReplaySpeed() {
  const [speed, set] = useState(() => {
    try { const v = Number(localStorage.getItem(KEY)); return SPEEDS.includes(v) ? v : 1; } catch { return 1; }
  });
  const setSpeed = useCallback((v) => { set(v); try { localStorage.setItem(KEY, String(v)); } catch { /* private mode */ } }, []);
  return [speed, setSpeed];
}

export function usePlayback(baseMs = 12_000, speed = 1) {
  const durationMs = Math.max(600, baseMs / speed);
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const ref = useRef(1);
  ref.current = progress;
  useEffect(() => {
    if (!playing) return undefined;
    if (ref.current >= 1) { ref.current = 0; setProgress(0); }
    let last = Date.now();
    const t = setInterval(() => {
      const now = Date.now();
      const next = Math.min(1, ref.current + (now - last) / durationMs);
      last = now;
      ref.current = next;
      setProgress(next);
      if (next >= 1) setPlaying(false);
    }, 50);
    return () => clearInterval(t);
  }, [playing, durationMs]);
  const seek = useCallback((v) => { setPlaying(false); setProgress(v); }, []);
  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const reset = useCallback(() => { setPlaying(false); setProgress(1); }, []);
  return { progress, playing, seek, toggle, reset };
}
