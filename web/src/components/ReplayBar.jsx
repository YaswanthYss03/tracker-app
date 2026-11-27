// Play / pause, a slider to drag through the replay, and the speed (1x to 10x).
import Icon from './Icon';
import { SPEEDS } from '../lib/replay';

export default function ReplayBar({ progress, playing, onToggle, onSeek, disabled, label, speed, onSpeed }) {
  return (
    <div className="stack sm">
      <div className="replay-bar">
        <button type="button" className="play-btn" onClick={onToggle} disabled={disabled} aria-label={playing ? 'Pause' : 'Play'} style={{ opacity: disabled ? 0.4 : 1 }}>
          <Icon name={playing ? 'pause' : 'play'} size={18} stroke={2.2} />
        </button>
        <input type="range" className="scrub" min={0} max={1000} value={Math.round(progress * 1000)} disabled={disabled} onChange={(e) => onSeek(Number(e.target.value) / 1000)} style={{ '--p': `${progress * 100}%` }} aria-label="Playback position" />
        <span className="small bold" style={{ minWidth: 64, textAlign: 'right' }}>{label || ''}</span>
      </div>
      {onSpeed && (
        <div className="speed-seg" role="radiogroup" aria-label="Replay speed" title="1x plays one minute of the ride every second">
          <span className="small muted">Speed</span>
          {SPEEDS.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={speed === s} className={speed === s ? 'on' : ''} onClick={() => onSpeed(s)}>{s}x</button>
          ))}
        </div>
      )}
    </div>
  );
}
