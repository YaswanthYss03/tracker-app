// Shared UI pieces: buttons, fields, modal, drawer, tabs, chips, empty states.
import { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon';
import { errorText } from '../lib/api';

export function Spinner() {
  return <div className="spinner" role="status" aria-label="Loading" />;
}

export function Button({ variant, size, block, icon, children, loading, className = '', ...rest }) {
  const cls = ['btn', variant, size, block ? 'block' : '', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} disabled={loading || rest.disabled} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} stroke={2.1} />}
      {children}
    </button>
  );
}

export function IconButton({ icon, label, filled, size, badge, onClick, className = '', ...rest }) {
  return (
    <button type="button" className={`icon-btn ${filled ? 'filled' : ''} ${size || ''} ${className}`} aria-label={label} title={label} onClick={onClick} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 16 : 20} stroke={2} />
      {badge ? <span className="badge-dot">{badge > 99 ? '99+' : badge}</span> : null}
    </button>
  );
}

export function Card({ title, action, children, className = '', pad = true, ...rest }) {
  return (
    <section className={`card ${pad ? '' : 'pad0'} ${className}`} {...rest}>
      {(title || action) && (
        <div className="card-head" style={!pad ? { padding: '18px 20px 0' } : undefined}>
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHead({ title, sub, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {children && <div className="actions">{children}</div>}
    </div>
  );
}

export function Field({ label, hint, error, children, className = '' }) {
  const id = useId();
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {typeof children === 'function' ? children(id) : children}
      {error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

export function Input({ label, hint, error, className = '', ...rest }) {
  // A password field gets an eye to show or hide what was typed.
  const isPassword = rest.type === 'password';
  const [shown, setShown] = useState(false);
  return (
    <Field label={label} hint={hint} error={error}>
      {(id) => (isPassword ? (
        <div className="pw-wrap">
          <input id={id} className={`input pw ${error ? 'bad' : ''} ${className}`} {...rest} type={shown ? 'text' : 'password'} />
          <button type="button" className="pw-eye" onClick={() => setShown((v) => !v)} aria-label={shown ? 'Hide password' : 'Show password'} aria-pressed={shown} title={shown ? 'Hide password' : 'Show password'}>
            <Icon name={shown ? 'eyeOff' : 'eye'} size={20} />
          </button>
        </div>
      ) : (
        <input id={id} className={`input ${error ? 'bad' : ''} ${className}`} {...rest} />
      ))}
    </Field>
  );
}

export function Select({ label, hint, error, children, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(id) => <select id={id} className="select" {...rest}>{children}</select>}
    </Field>
  );
}

export function Textarea({ label, hint, error, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(id) => <textarea id={id} className="textarea" {...rest} />}
    </Field>
  );
}

export function Switch({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={!!checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}

export function Setting({ title, desc, children }) {
  return (
    <div className="setting">
      <div className="grow">
        <div className="t">{title}</div>
        {desc && <div className="d">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export function ErrorBox({ error }) {
  if (!error) return null;
  return <div className="alert-box" role="alert">{typeof error === 'string' ? error : errorText(error)}</div>;
}

export function Notice({ tone = 'info', children }) {
  return <div className={`alert-box ${tone}`}>{children}</div>;
}

export function Empty({ icon = 'info', title, children, action }) {
  return (
    <div className="empty">
      <div className="ico"><Icon name={icon} size={24} /></div>
      {title && <h3>{title}</h3>}
      {children && <div className="small">{children}</div>}
      {action}
    </div>
  );
}

export function Skeleton({ h = 20, w = '100%', r }) {
  return <div className="skeleton" style={{ height: h, width: w, borderRadius: r }} aria-hidden />;
}

export function Tabs({ value, onChange, options, className = '' }) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {options.map(([key, label, icon]) => (
        <button key={key} type="button" role="tab" aria-selected={value === key} className={`tab ${value === key ? 'on' : ''}`} onClick={() => onChange(key)}>
          {icon && <Icon name={icon} size={17} />}
          {label}
        </button>
      ))}
    </div>
  );
}

export function Seg({ value, onChange, options }) {
  return (
    <div className="seg" role="tablist">
      {options.map(([key, label]) => (
        <button key={key} type="button" role="tab" aria-selected={value === key} className={value === key ? 'on' : ''} onClick={() => onChange(key)}>{label}</button>
      ))}
    </div>
  );
}

export function Chip({ on, onClick, children, size, dot, ring, className = '', ...rest }) {
  return (
    <button type="button" aria-pressed={!!on} className={`chip ${on ? 'on' : ''} ${size || ''} ${className}`} onClick={onClick} {...rest}>
      {dot && <span className={`dot ${dot}`} />}
      {ring && <span className="dot" style={{ background: ring }} />}
      {children}
    </button>
  );
}

export function StatusDot({ group }) {
  return <span className={`dot ${group}`} />;
}

export function Pill({ tone, children }) {
  return <span className={`pill ${tone || ''}`}>{children}</span>;
}

export function Plate({ value, size, className = '' }) {
  return <span className={`plate ${className}`} style={size ? { fontSize: size } : undefined}>{value}</span>;
}

export function Kpi({ icon, tone, label, value, unit, foot, onClick }) {
  const body = (
    <div className="kpi">
      <div className="kpi-top">
        <span className={`kpi-icon ${tone || ''}`}><Icon name={icon} size={18} /></span>
        {label}
      </div>
      <div className="kpi-value">{value}{unit && <small>{unit}</small>}</div>
      {foot && <div className="kpi-foot">{foot}</div>}
    </div>
  );
  return onClick ? (
    <button type="button" className="card" onClick={onClick} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit' }}>{body}</button>
  ) : (
    <div className="card">{body}</div>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal dialog; on small screens it slides up from the bottom.
 * Keyboard: focus moves into the dialog and comes back when it closes, Tab stays inside it,
 * Esc closes it, and Enter in a text field presses the primary button.
 */
export function Modal({ title, onClose, children, footer, wide }) {
  const box = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  useEffect(() => {
    const before = document.activeElement;
    const root = box.current;
    if (root && !root.contains(document.activeElement)) {
      (root.querySelector('.modal-body input:not([type="hidden"]):not([disabled]), .modal-body textarea, .modal-body select') || root.querySelector('.modal-foot button') || root.querySelector('button'))?.focus();
    }
    return () => { if (before && before.focus) before.focus(); };
  }, []);
  const onKeyDown = (e) => {
    if (e.key === 'Tab' && box.current) {
      const items = [...box.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    } else if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'file', 'range'].includes(e.target.type)) {
      const go = box.current?.querySelector('.modal-foot .btn.primary:not(:disabled)');
      if (go) { e.preventDefault(); go.click(); }
    }
  };
  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={box} className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onKeyDown={onKeyDown}>
        <div className="modal-head">
          <h2>{title}</h2>
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/** Side panel from the right (used for a single trip). */
export function Drawer({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div className="backdrop" style={{ zIndex: 84 }} onMouseDown={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <IconButton icon="x" label="Close" size="sm" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
      </aside>
    </>
  );
}

/** "Are you sure": optionally type a word (e.g. the plate) to confirm. */
export function Confirm({ title, message, confirmLabel = 'Confirm', danger, requireText, onConfirm, onClose, children }) {
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ok = !requireText || typed.trim().toUpperCase() === requireText.trim().toUpperCase();
  async function go() {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={go} loading={busy} disabled={!ok}>{confirmLabel}</Button>
        </>
      }
    >
      {message && <p className="muted">{message}</p>}
      {children}
      {requireText && (
        <Input label={`Type ${requireText} to confirm`} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" className="plate-input" />
      )}
      <ErrorBox error={error} />
    </Modal>
  );
}

/** Small menu that opens under a button; closes on outside click. */
export function Menu({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <span onClick={() => setOpen(!open)}>{trigger}</span>
      {open && <div className="popover" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  );
}

export function MenuItem({ icon, danger, children, ...rest }) {
  return (
    <button type="button" className={`opt ${danger ? 'danger' : ''}`} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

/** Loads data with an async function; reload() runs it again. */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fnRef.current().then(
      (data) => alive && setState({ data, error: null, loading: false }),
      (error) => alive && setState({ data: null, error, loading: false }),
    );
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return { ...state, reload: () => setTick((t) => t + 1) };
}
