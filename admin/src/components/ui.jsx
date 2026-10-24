// Small shared UI pieces.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { errorText } from '../lib/api';

/** Loads data with an async function; reload() runs it again. */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      setState({ data: await fnRef.current(), error: null, loading: false });
    } catch (error) {
      setState({ data: null, error, loading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => {
    run();
  }, [run]);
  return { ...state, reload: run };
}

export function Spinner() {
  return <div className="spinner" role="status" aria-label="Loading" />;
}

export function ErrorBox({ error }) {
  if (!error) return null;
  return <div className="alert-box error">{typeof error === 'string' ? error : errorText(error)}</div>;
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}

export function Pill({ tone, children, dot }) {
  return (
    <span className={`pill ${tone || ''}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

export function OnlinePill({ online, lastSeenAt }) {
  if (online) return <Pill tone="ok" dot>Online</Pill>;
  return <Pill dot>{lastSeenAt ? 'Offline' : 'Never connected'}</Pill>;
}

const STATUS_TONE = { inventory: '', active: 'brand', suspended: 'danger' };
const STATUS_LABEL = { inventory: 'In stock', active: 'Claimed', suspended: 'Suspended' };
export function StatusPill({ status }) {
  return <Pill tone={STATUS_TONE[status]}>{STATUS_LABEL[status] || status}</Pill>;
}

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="card-head">
          <h2>{title}</h2>
          <button className="btn ghost small" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Confirmation dialog (no browser confirm()).
 * requireText: the user must type this exact text to enable the button.
 */
export function ConfirmModal({ title, message, confirmLabel = 'Confirm', danger, requireText, onConfirm, onClose }) {
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  async function go() {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }
  return (
    <Modal title={title} onClose={onClose}>
      <div className="stack">
        <div>{message}</div>
        {requireText && (
          <label className="field">
            Type <code>{requireText}</code> to confirm
            <input value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus />
          </label>
        )}
        <ErrorBox error={error} />
        <div className="row end">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className={`btn ${danger ? 'danger solid' : 'primary'}`}
            disabled={busy || (requireText && typed !== requireText)}
            onClick={go}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const ToastContext = createContext(() => {});
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((text, tone) => {
    const id = Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tone || ''}`}>{t.text}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);

/** Copy text to the clipboard with feedback. */
export function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
    >
      {done ? 'Copied' : label}
    </button>
  );
}
