// Plays progress 0 -> 1 over `durationMs` while playing.
import { useCallback, useEffect, useRef, useState } from 'react';

export function usePlayback(durationMs = 12_000) {
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
