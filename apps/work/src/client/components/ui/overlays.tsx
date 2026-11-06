import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

// ------------------------------------------------------------------ Modal

export function Modal({ title, onClose, children, footer, wide, labelledBy }: { title: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean; labelledBy?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>('input, textarea, select, button:not(.modal-close)');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && ref.current) {
        const focusables = ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const f = focusables[0];
        const l = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === f) {
          e.preventDefault();
          l.focus();
        } else if (!e.shiftKey && document.activeElement === l) {
          e.preventDefault();
          f.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prev?.focus?.();
    };
  }, [onClose]);
  const id = labelledBy ?? 'modal-title';
  return createPortal(
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={id} ref={ref}>
        <div className="modal-header">
          <h2 id={id} className="grow">
            {title}
          </h2>
          <button className="btn ghost icon sm modal-close" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

// ------------------------------------------------------- Confirm dialogs

interface ConfirmOpts {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  /** Require typing this text to enable the confirm button. */
  typeToConfirm?: string;
}

const ConfirmCtx = createContext<(o: ConfirmOpts) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<(ConfirmOpts & { resolve: (v: boolean) => void }) | null>(null);
  const [typed, setTyped] = useState('');
  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((resolve) => {
    setTyped('');
    setState({ ...o, resolve });
  }), []);
  const close = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };
  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state ? (
        <Modal
          title={state.title}
          onClose={() => close(false)}
          footer={
            <>
              <button className="btn" onClick={() => close(false)}>
                Cancel
              </button>
              <button className={`btn ${state.danger ? 'danger' : 'primary'}`} disabled={!!state.typeToConfirm && typed !== state.typeToConfirm} onClick={() => close(true)}>
                {state.confirmLabel ?? 'Confirm'}
              </button>
            </>
          }
        >
          {state.message ? <div style={{ marginBottom: 12 }}>{state.message}</div> : null}
          {state.typeToConfirm ? (
            <div className="field">
              <label htmlFor="confirm-type">
                Type <strong>{state.typeToConfirm}</strong> to confirm
              </label>
              <input id="confirm-type" className="input" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
            </div>
          ) : null}
        </Modal>
      ) : null}
    </ConfirmCtx.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmCtx);

// ----------------------------------------------------------------- Toasts

interface Toast {
  id: number;
  message: string;
  kind: 'info' | 'error';
  action?: { label: string; run: () => void };
}
const ToastCtx = createContext<(message: string, kind?: 'info' | 'error', action?: Toast['action']) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, kind: 'info' | 'error' = 'info', action?: Toast['action']) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, message, kind, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 6000 : 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      {createPortal(
        <div className="toasts" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.kind === 'error' ? 'error' : ''}`}>
              <span>{t.message}</span>
              {t.action ? (
                <button className="btn sm" onClick={t.action.run}>
                  {t.action.label}
                </button>
              ) : null}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

// --------------------------------------------------------------- Popover

export function Popover({
  anchor,
  point,
  onClose,
  children,
  align = 'start',
  width,
}: {
  anchor?: RefObject<HTMLElement | null> | HTMLElement | null;
  point?: { x: number; y: number };
  onClose: () => void;
  children: ReactNode;
  align?: 'start' | 'end' | 'center';
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const a = anchor && 'current' in (anchor as any) ? (anchor as RefObject<HTMLElement>).current : (anchor as HTMLElement | null);
    const rect = point ? { left: point.x, right: point.x, top: point.y, bottom: point.y, width: 0 } : a?.getBoundingClientRect();
    if (!rect) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left = align === 'end' ? rect.right - w : align === 'center' ? rect.left + rect.width / 2 - w / 2 : rect.left;
    let top = rect.bottom + 4;
    if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
    if (left < 8) left = 8;
    if (top + h > window.innerHeight - 8) top = Math.max(8, rect.top - h - 4);
    setPos({ top, left });
  }, [anchor, point, align]);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && ref.current) {
        const items = Array.from(ref.current.querySelectorAll<HTMLElement>('.menu-item:not([disabled])'));
        if (!items.length) return;
        e.preventDefault();
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next = e.key === 'ArrowDown' ? items[(i + 1) % items.length] : items[(i - 1 + items.length) % items.length];
        next.focus();
      }
    };
    const t = setTimeout(() => document.addEventListener('mousedown', onDown), 0);
    document.addEventListener('keydown', onKey, true);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [onClose]);
  return createPortal(
    <div ref={ref} className="popover" style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width }} role="menu">
      {children}
    </div>,
    document.body,
  );
}

export function MenuItem({ icon, children, onClick, danger, shortcut, disabled, active }: { icon?: string; children: ReactNode; onClick: () => void; danger?: boolean; shortcut?: string; disabled?: boolean; active?: boolean }) {
  return (
    <button className={`menu-item${danger ? ' danger' : ''}${active ? ' active' : ''}`} role="menuitem" onClick={onClick} disabled={disabled}>
      {icon ? <Icon name={icon} size={15} /> : null}
      <span className="grow ellipsis">{children}</span>
      {shortcut ? <span className="shortcut">{shortcut}</span> : null}
    </button>
  );
}

export const MenuSep = () => <div className="menu-sep" role="separator" />;

/** Button that opens a dropdown menu. */
export function Dropdown({ trigger, children, align, width, label }: { trigger: (open: () => void, ref: RefObject<HTMLButtonElement | null>) => ReactNode; children: (close: () => void) => ReactNode; align?: 'start' | 'end'; width?: number; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      {trigger(() => setOpen((o) => !o), ref)}
      {open ? (
        <Popover anchor={ref} onClose={() => setOpen(false)} align={align} width={width}>
          {label ? <div className="menu-label">{label}</div> : null}
          {children(() => setOpen(false))}
        </Popover>
      ) : null}
    </>
  );
}

/** Right-click context menu helper. */
export function useContextMenu() {
  const [menu, setMenu] = useState<{ x: number; y: number; data: any } | null>(null);
  const open = (e: React.MouseEvent, data: any) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, data });
  };
  return { menu, open, close: () => setMenu(null) };
}
