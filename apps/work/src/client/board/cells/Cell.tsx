// Generic cell renderer + editor driven by the shared column registry. Every
// column type is handled here once; tables, cards and the item panel reuse it.

import { useRef, useState, type ReactNode } from 'react';
import { getColumnType, labelsOf, type LabelOption } from '../../../shared/columns';
import type { ColumnDTO, ItemDTO, MemberDTO } from '../../../shared/types';
import { Avatar } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { Popover } from '../../components/ui/overlays';
import { formatDate, todayISO } from '../../lib/format';
import { upload, errorMessage } from '../../lib/api';
import { appUrl } from '../../lib/base';

export interface CellCtx {
  members: MemberDTO[];
  items: ItemDTO[];
  boardId: string;
  memberName: (id: string) => string | undefined;
  onUploaded?: () => void;
  toast?: (m: string, k?: 'info' | 'error') => void;
}

const COMPUTED = new Set(['formula', 'created_at', 'updated_at']);

export function isReadOnlyColumn(col: ColumnDTO) {
  return COMPUTED.has(col.type) || (col.type === 'progress' && !!col.settings?.mode && col.settings.mode !== 'manual');
}

export function LabelPill({ label, empty = '' }: { label?: LabelOption | null; empty?: string }) {
  return (
    <div className="label-cell" style={{ background: label?.color ?? 'var(--surface-3)', color: label ? '#fff' : 'var(--text-3)' }}>
      {label?.label ?? empty}
    </div>
  );
}

function PeopleDisplay({ ids, ctx }: { ids: string[]; ctx: CellCtx }) {
  if (!ids.length) return <span className="muted"><Icon name="user" /></span>;
  return (
    <span className="avatar-stack">
      {ids.slice(0, 3).map((id) => {
        const m = ctx.members.find((x) => x.id === id);
        return <Avatar key={id} id={id} name={m?.name ?? 'Former member'} url={m?.avatarUrl} size="sm" />;
      })}
      {ids.length > 3 ? <span className="avatar sm" style={{ background: 'var(--surface-3)', color: 'var(--text-2)' }}>+{ids.length - 3}</span> : null}
    </span>
  );
}

/** Read-only rendering of a value. */
export function CellDisplay({ column, value, item, ctx }: { column: ColumnDTO; value: unknown; item?: ItemDTO; ctx: CellCtx }): ReactNode {
  const def = getColumnType(column.type);
  switch (column.type) {
    case 'status':
    case 'priority': {
      const l = labelsOf(column).find((x) => x.id === value);
      return <LabelPill label={l} />;
    }
    case 'dropdown': {
      const ids = Array.isArray(value) ? (value as string[]) : [];
      const labels = labelsOf(column);
      return ids.length ? (
        <span className="row" style={{ gap: 4, overflow: 'hidden' }}>
          {ids.map((id) => {
            const l = labels.find((x) => x.id === id);
            return l ? <span key={id} className="badge" style={{ background: l.color, color: '#fff' }}>{l.label}</span> : null;
          })}
        </span>
      ) : null;
    }
    case 'person':
      return <PeopleDisplay ids={typeof value === 'string' ? [value] : []} ctx={ctx} />;
    case 'people':
      return <PeopleDisplay ids={Array.isArray(value) ? (value as string[]) : []} ctx={ctx} />;
    case 'date': {
      if (typeof value !== 'string') return null;
      const overdue = value.slice(0, 10) < todayISO() && item && !item.completedAt;
      return <span className={overdue ? 'danger-text' : ''} title={overdue ? 'Overdue' : undefined}>{formatDate(value)}{overdue ? ' !' : ''}</span>;
    }
    case 'timeline': {
      const v = value as { start: string; end: string } | null;
      if (!v) return null;
      const t = todayISO();
      const pct = v.end <= t ? 100 : v.start >= t ? 0 : Math.round(((Date.parse(t) - Date.parse(v.start)) / Math.max(1, Date.parse(v.end) - Date.parse(v.start))) * 100);
      const label = `${formatDate(v.start)} – ${formatDate(v.end)}`;
      const text = (color: string) => ({ position: 'absolute', inset: 0, fontSize: 11.5, color, display: 'flex', justifyContent: 'center', lineHeight: '22px', fontWeight: 600, whiteSpace: 'nowrap' }) as const;
      // The label is drawn twice: dark over the track, white over the elapsed part (clipped to it), so every
      // character stays readable whatever the progress, in both themes.
      return (
        <div style={{ width: '100%', padding: '0 4px' }}>
          <div style={{ position: 'relative', height: 22, borderRadius: 11, background: 'var(--surface-3)', overflow: 'hidden' }}>
            <span style={text('var(--text)')}>{label}</span>
            <span aria-hidden style={{ position: 'absolute', inset: 0, background: 'var(--accent-fill)', clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
              <span style={text('#fff')}>{label}</span>
            </span>
          </div>
        </div>
      );
    }
    case 'checkbox':
      return value ? <Icon name="check" size={18} className="success-text" /> : <span style={{ width: 16, height: 16, border: '1.5px solid var(--border-strong)', borderRadius: 4, display: 'inline-block' }} />;
    case 'tags':
      return Array.isArray(value) ? (
        <span className="row" style={{ gap: 4, overflow: 'hidden' }}>{(value as string[]).map((t) => <span key={t} className="badge accent">{t}</span>)}</span>
      ) : null;
    case 'link':
      return typeof value === 'string' ? (
        <a href={value} target="_blank" rel="noopener noreferrer nofollow" onClick={(e) => e.stopPropagation()} className="ellipsis">{value.replace(/^https?:\/\//, '')}</a>
      ) : null;
    case 'email':
      return typeof value === 'string' ? <a href={`mailto:${value}`} onClick={(e) => e.stopPropagation()} className="ellipsis">{value}</a> : null;
    case 'phone':
      return typeof value === 'string' ? <a href={`tel:${value.replace(/[^+0-9]/g, '')}`} onClick={(e) => e.stopPropagation()}>{value}</a> : null;
    case 'progress': {
      if (typeof value !== 'number') return <span className="muted small">–</span>;
      return (
        <div className="row" style={{ width: '100%', padding: '0 6px', gap: 6 }}>
          <div className="progress-bar"><span style={{ width: `${value}%` }} /></div>
          <span className="small muted" style={{ width: 32, textAlign: 'right' }}>{Math.round(value)}%</span>
        </div>
      );
    }
    case 'rating': {
      const max = Number(column.settings.max ?? 5);
      const v = typeof value === 'number' ? value : 0;
      return <span aria-label={`${v} of ${max}`} style={{ color: '#f5a524', letterSpacing: 1 }}>{'★'.repeat(v)}<span style={{ color: 'var(--border-strong)' }}>{'★'.repeat(Math.max(0, max - v))}</span></span>;
    }
    case 'files':
      return Array.isArray(value) && value.length ? <span className="row small"><Icon name="paperclip" /> {value.length}</span> : null;
    case 'dependency':
      return Array.isArray(value) && value.length ? (
        <span className="row small ellipsis" title={(value as string[]).map((id) => ctx.items.find((i) => i.id === id)?.name ?? '').join(', ')}>
          <Icon name="link" /> {(value as string[]).map((id) => ctx.items.find((i) => i.id === id)?.name ?? '?').join(', ')}
        </span>
      ) : null;
    case 'location':
      return value ? <span className="row small ellipsis"><Icon name="pin" /> {def.toText(value, column.settings)}</span> : null;
    case 'long_text':
      return typeof value === 'string' ? <span className="ellipsis" style={{ maxWidth: '100%' }}>{value}</span> : null;
    default: {
      const text = def.toText(value, column.settings, { userName: ctx.memberName });
      return text ? <span className="ellipsis">{text}</span> : null;
    }
  }
}

const INLINE_TYPES = new Set(['text', 'number', 'currency', 'percentage', 'link', 'email', 'phone']);

function alignFor(type: string) {
  return ['text', 'long_text', 'link', 'email', 'tags', 'dependency', 'location', 'dropdown'].includes(type) ? 'left' : '';
}

/** Interactive cell: click / Enter to edit. */
export function Cell({ column, item, value, ctx, canEdit, onChange, variant = 'table' }: { column: ColumnDTO; item: ItemDTO; value: unknown; ctx: CellCtx; canEdit: boolean; onChange: (v: unknown) => void; variant?: 'table' | 'panel' }) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const readOnly = !canEdit || isReadOnlyColumn(column);
  const start = () => {
    if (readOnly) return;
    if (column.type === 'checkbox') return onChange(!value);
    setEditing(true);
  };
  if (editing && INLINE_TYPES.has(column.type)) {
    return <InlineInput column={column} value={value} onDone={(v, changed) => { setEditing(false); if (changed) onChange(v); }} />;
  }
  return (
    <>
      <div
        ref={ref}
        className={`cell ${alignFor(column.type)}${readOnly ? ' readonly' : ''}`}
        style={variant === 'panel' ? { justifyContent: 'flex-start' } : undefined}
        tabIndex={0}
        role="button"
        aria-label={`${column.title}: ${getColumnType(column.type).toText(value, column.settings, { userName: ctx.memberName }) || 'empty'}`}
        onClick={start}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            start();
          }
          if ((e.key === 'Delete' || e.key === 'Backspace') && !readOnly && value != null) {
            e.preventDefault();
            onChange(null);
          }
        }}
      >
        <CellDisplay column={column} value={value} item={item} ctx={ctx} />
      </div>
      {editing && !INLINE_TYPES.has(column.type) ? (
        <Popover anchor={ref} onClose={() => setEditing(false)} width={column.type === 'long_text' ? 340 : 260}>
          <PopoverEditor column={column} value={value} item={item} ctx={ctx} onChange={onChange} close={() => setEditing(false)} />
        </Popover>
      ) : null}
    </>
  );
}

function InlineInput({ column, value, onDone }: { column: ColumnDTO; value: unknown; onDone: (v: unknown, changed: boolean) => void }) {
  const numeric = ['number', 'currency', 'percentage'].includes(column.type);
  const [text, setText] = useState(value == null ? '' : String(value));
  const finish = (commit: boolean) => {
    if (!commit) return onDone(value, false);
    const v = text.trim() === '' ? null : numeric ? Number(text.replace(/[, ]/g, '')) : text.trim();
    if (numeric && v !== null && !Number.isFinite(v as number)) return onDone(value, false);
    onDone(v, v !== value);
  };
  return (
    <input
      className="cell-input"
      autoFocus
      inputMode={numeric ? 'decimal' : undefined}
      type={column.type === 'email' ? 'email' : column.type === 'link' ? 'url' : 'text'}
      value={text}
      aria-label={column.title}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => finish(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') finish(true);
        if (e.key === 'Escape') finish(false);
      }}
    />
  );
}

function PopoverEditor({ column, value, item, ctx, onChange, close }: { column: ColumnDTO; value: unknown; item: ItemDTO; ctx: CellCtx; onChange: (v: unknown) => void; close: () => void }) {
  switch (column.type) {
    case 'status':
    case 'priority':
    case 'dropdown': {
      const labels = labelsOf(column);
      const multi = column.type === 'dropdown' && column.settings.multiple !== false;
      const current = Array.isArray(value) ? (value as string[]) : value ? [value as string] : [];
      return (
        <div className="col" style={{ gap: 4, padding: 4 }}>
          {labels.map((l) => (
            <button
              key={l.id}
              className="btn"
              style={{ background: l.color, color: '#fff', borderColor: current.includes(l.id) ? 'var(--text)' : l.color, justifyContent: 'center' }}
              onClick={() => {
                if (column.type === 'dropdown') {
                  const next = multi ? (current.includes(l.id) ? current.filter((x) => x !== l.id) : [...current, l.id]) : [l.id];
                  onChange(next.length ? next : null);
                  if (!multi) close();
                } else {
                  onChange(l.id);
                  close();
                }
              }}
            >
              {current.includes(l.id) ? <Icon name="check" /> : null} {l.label}
            </button>
          ))}
          {current.length ? <button className="btn ghost sm" onClick={() => { onChange(null); close(); }}>Clear</button> : null}
        </div>
      );
    }
    case 'person':
    case 'people':
      return <PeoplePicker multi={column.type === 'people'} value={value} ctx={ctx} onChange={(v) => { onChange(v); if (column.type === 'person') close(); }} />;
    case 'date':
      return (
        <div className="col" style={{ padding: 6 }}>
          <input className="input" type="date" autoFocus defaultValue={typeof value === 'string' ? value.slice(0, 10) : ''} aria-label={column.title} onChange={(e) => onChange(e.target.value || null)} />
          <div className="row">
            <button className="btn sm" onClick={() => { onChange(todayISO()); close(); }}>Today</button>
            <button className="btn ghost sm" onClick={() => { onChange(null); close(); }}>Clear</button>
            <span className="spacer" />
            <button className="btn primary sm" onClick={close}>Done</button>
          </div>
        </div>
      );
    case 'timeline': {
      const v = (value as { start: string; end: string } | null) ?? { start: '', end: '' };
      return <TimelineEditor value={v} onChange={onChange} close={close} />;
    }
    case 'long_text':
      return <LongTextEditor value={typeof value === 'string' ? value : ''} onSave={(v) => { onChange(v || null); close(); }} />;
    case 'tags':
      return <TagsEditor value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
    case 'rating': {
      const max = Number(column.settings.max ?? 5);
      return (
        <div className="row" style={{ padding: 8 }} role="radiogroup" aria-label={column.title}>
          {Array.from({ length: max }, (_, i) => (
            <button key={i} className="btn ghost icon sm" aria-label={`${i + 1} stars`} style={{ color: (value as number) > i ? '#f5a524' : 'var(--border-strong)', fontSize: 18 }} onClick={() => { onChange(i + 1); close(); }}>★</button>
          ))}
          <button className="btn ghost sm" onClick={() => { onChange(null); close(); }}>Clear</button>
        </div>
      );
    }
    case 'progress':
      return (
        <div className="col" style={{ padding: 8 }}>
          <input type="range" min={0} max={100} step={5} defaultValue={typeof value === 'number' ? value : 0} aria-label={column.title} onChange={(e) => onChange(Number(e.target.value))} />
          <button className="btn primary sm" onClick={close}>Done</button>
        </div>
      );
    case 'location':
      return <LocationEditor value={value as any} onSave={(v) => { onChange(v); close(); }} />;
    case 'dependency':
      return <DependencyPicker value={Array.isArray(value) ? (value as string[]) : []} item={item} ctx={ctx} onChange={onChange} />;
    case 'files':
      return <FilesEditor value={Array.isArray(value) ? (value as string[]) : []} item={item} column={column} ctx={ctx} close={close} />;
    default:
      return <div className="muted small" style={{ padding: 8 }}>This column is read-only.</div>;
  }
}

function PeoplePicker({ multi, value, ctx, onChange }: { multi: boolean; value: unknown; ctx: CellCtx; onChange: (v: unknown) => void }) {
  const [q, setQ] = useState('');
  const current = Array.isArray(value) ? (value as string[]) : typeof value === 'string' ? [value] : [];
  const list = ctx.members.filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.email.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="col" style={{ gap: 2, padding: 4 }}>
      <input className="input sm" placeholder="Search people" value={q} onChange={(e) => setQ(e.target.value)} autoFocus aria-label="Search people" />
      {list.map((m) => {
        const on = current.includes(m.id);
        return (
          <button key={m.id} className={`menu-item${on ? ' active' : ''}`} onClick={() => onChange(multi ? (on ? current.filter((x) => x !== m.id) : [...current, m.id]) : on ? null : m.id)}>
            <Avatar id={m.id} name={m.name} url={m.avatarUrl} size="sm" /> <span className="grow ellipsis">{m.name}</span> {on ? <Icon name="check" /> : null}
          </button>
        );
      })}
      {current.length ? <button className="btn ghost sm" onClick={() => onChange(null)}>Clear</button> : null}
    </div>
  );
}

function TimelineEditor({ value, onChange, close }: { value: { start: string; end: string }; onChange: (v: unknown) => void; close: () => void }) {
  const [start, setStart] = useState(value.start);
  const [end, setEnd] = useState(value.end);
  const invalid = !!start && !!end && end < start;
  return (
    <div className="col" style={{ padding: 6 }}>
      <label className="label">Start<input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
      <label className="label">End<input className="input" type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} /></label>
      {invalid ? <span className="error small danger-text">End must be after start</span> : null}
      <div className="row">
        <button className="btn ghost sm" onClick={() => { onChange(null); close(); }}>Clear</button>
        <span className="spacer" />
        <button className="btn primary sm" disabled={!start || !end || invalid} onClick={() => { onChange({ start, end }); close(); }}>Save</button>
      </div>
    </div>
  );
}

function LongTextEditor({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [text, setText] = useState(value);
  return (
    <div className="col" style={{ padding: 6 }}>
      <textarea className="textarea" autoFocus value={text} onChange={(e) => setText(e.target.value)} rows={6} maxLength={20000} aria-label="Text" />
      <button className="btn primary sm" onClick={() => onSave(text.trim())}>Save</button>
    </div>
  );
}

function TagsEditor({ value, onChange }: { value: string[]; onChange: (v: unknown) => void }) {
  const [text, setText] = useState('');
  const add = () => {
    const t = text.trim();
    if (!t || value.includes(t)) return setText('');
    onChange([...value, t]);
    setText('');
  };
  return (
    <div className="col" style={{ padding: 6 }}>
      <div className="row wrap" style={{ gap: 4 }}>
        {value.map((t) => (
          <span key={t} className="badge accent">
            {t}
            <button className="btn ghost icon sm" style={{ width: 16, height: 16 }} aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}><Icon name="x" size={10} /></button>
          </span>
        ))}
      </div>
      <input className="input sm" placeholder="Add tag and press Enter" value={text} autoFocus onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} aria-label="New tag" maxLength={50} />
    </div>
  );
}

function LocationEditor({ value, onSave }: { value: { address?: string; lat?: number; lng?: number } | null; onSave: (v: unknown) => void }) {
  const [address, setAddress] = useState(value?.address ?? '');
  const [lat, setLat] = useState(value?.lat?.toString() ?? '');
  const [lng, setLng] = useState(value?.lng?.toString() ?? '');
  return (
    <div className="col" style={{ padding: 6 }}>
      <input className="input sm" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} aria-label="Address" autoFocus />
      <div className="row">
        <input className="input sm" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} aria-label="Latitude" inputMode="decimal" />
        <input className="input sm" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} aria-label="Longitude" inputMode="decimal" />
      </div>
      <span className="muted small">Coordinates are optional; they place the item on the Map view.</span>
      <div className="row">
        <button className="btn ghost sm" onClick={() => onSave(null)}>Clear</button>
        <span className="spacer" />
        <button className="btn primary sm" onClick={() => onSave(address || lat ? { address, ...(lat && lng ? { lat: Number(lat), lng: Number(lng) } : {}) } : null)}>Save</button>
      </div>
    </div>
  );
}

function DependencyPicker({ value, item, ctx, onChange }: { value: string[]; item: ItemDTO; ctx: CellCtx; onChange: (v: unknown) => void }) {
  const [q, setQ] = useState('');
  const options = ctx.items.filter((i) => i.id !== item.id && !i.parentItemId && (!q || i.name.toLowerCase().includes(q.toLowerCase()))).slice(0, 40);
  return (
    <div className="col" style={{ gap: 2, padding: 4 }}>
      <input className="input sm" placeholder="Search items" value={q} onChange={(e) => setQ(e.target.value)} autoFocus aria-label="Search items" />
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button key={o.id} className={`menu-item${on ? ' active' : ''}`} onClick={() => { const next = on ? value.filter((x) => x !== o.id) : [...value, o.id]; onChange(next.length ? next : null); }}>
            <span className="grow ellipsis">{o.name}</span> {on ? <Icon name="check" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function FilesEditor({ value, item, column, ctx, close }: { value: string[]; item: ItemDTO; column: ColumnDTO; ctx: CellCtx; close: () => void }) {
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.set('file', f);
        form.set('scope', 'item');
        form.set('itemId', item.id);
        form.set('columnId', column.id);
        await upload(form);
      }
      ctx.onUploaded?.();
      close();
    } catch (e) {
      ctx.toast?.(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="col" style={{ padding: 6 }}>
      {value.map((id) => (
        <a key={id} className="menu-item" href={appUrl(`/api/files/${id}`)} target="_blank" rel="noopener noreferrer"><Icon name="file" /> File {id.slice(0, 6)}</a>
      ))}
      <input ref={input} type="file" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      <button className="btn sm" disabled={busy} onClick={() => input.current?.click()}><Icon name="upload" /> {busy ? 'Uploading…' : 'Upload files'}</button>
      <span className="muted small">Open the item to manage all attachments.</span>
    </div>
  );
}
