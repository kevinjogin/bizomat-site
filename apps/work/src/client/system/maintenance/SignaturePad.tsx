// A signature drawn with a finger, a pen or the mouse, handed on as a PNG picture (at most 1000 pixels wide, far under
// the server's limit). The canvas's size is set as its own properties, never as a style attribute.
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

const INK = '#0a1f33';
const PAPER = '#ffffff';
const HEIGHT = 180;
const MAX_WIDTH = 1000;

export function SignaturePad({ id, label, onChange, disabled }: { id: string; label: string; onChange: (image: string | null) => void; disabled?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const moved = useRef(false);
  const ratio = useRef(1);

  const paint = () => {
    const c = ref.current;
    const g = c?.getContext('2d');
    if (!c || !g) return;
    g.fillStyle = PAPER;
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = INK;
    g.lineWidth = 2.5 * ratio.current;
    g.lineCap = 'round';
    g.lineJoin = 'round';
  };

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    ratio.current = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(Math.max(280, c.clientWidth || 320) * ratio.current);
    c.height = Math.round(HEIGHT * ratio.current);
    paint();
  }, []);

  const at = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * e.currentTarget.width) / (r.width || 1), y: ((e.clientY - r.top) * e.currentTarget.height) / (r.height || 1) };
  };

  /** The drawing as a PNG data address, scaled down to at most 1000 pixels wide. */
  const exportPng = (): string | null => {
    const c = ref.current;
    if (!c) return null;
    const scale = Math.min(1, MAX_WIDTH / c.width);
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(c.width * scale));
    out.height = Math.max(1, Math.round(c.height * scale));
    const g = out.getContext('2d');
    if (!g) return null;
    g.fillStyle = PAPER;
    g.fillRect(0, 0, out.width, out.height);
    g.drawImage(c, 0, 0, out.width, out.height);
    return out.toDataURL('image/png');
  };

  const clear = () => {
    paint();
    moved.current = false;
    onChange(null);
  };

  return (
    <div className="stack">
      <canvas
        ref={ref}
        id={id}
        className="mt-signature"
        role="img"
        aria-label={`${label}: sign here with a finger, a pen or the mouse`}
        aria-describedby={`${id}-hint`}
        onPointerDown={(e) => {
          if (disabled) return;
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          const g = e.currentTarget.getContext('2d');
          const p = at(e);
          g?.beginPath();
          g?.moveTo(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (disabled || !drawing.current) return;
          const g = e.currentTarget.getContext('2d');
          const p = at(e);
          g?.lineTo(p.x, p.y);
          g?.stroke();
          moved.current = true;
        }}
        onPointerUp={() => {
          if (!drawing.current) return;
          drawing.current = false;
          if (moved.current) onChange(exportPng());
        }}
        onPointerCancel={() => {
          drawing.current = false;
        }}
      />
      <div className="row wrap">
        <span id={`${id}-hint`} className="muted small grow">Sign in the box. Clear it to start again.</span>
        <button type="button" className="btn sm" disabled={disabled} onClick={clear}>Clear the signature</button>
      </div>
    </div>
  );
}
