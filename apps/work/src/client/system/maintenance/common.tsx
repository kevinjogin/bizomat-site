// Small pieces shared by the maintenance screens: badges, the history list, notes, files with upload, and a property list.
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { api, errorMessage } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { formatBytes, timeAgo } from '../../lib/format';
import { Icon } from '../../components/ui/Icon';
import { useToast } from '../../components/ui/overlays';
import {
  ASSET_STATUS_LABELS,
  CRITICALITY_LABELS,
  PRIORITY_LABELS,
  REQUEST_STATUS_LABELS,
  WO_STATUS_LABELS,
  dateTimeText,
  mtPath,
  type MtComment,
  type MtEvent,
  type MtFile,
  type Priority,
  type RequestStatus,
  type WoStatus,
} from './api';

const WO_TONE: Record<WoStatus, string> = { open: 'accent', assigned: 'accent', in_progress: 'warning', on_hold: '', completed: 'success', closed: '', cancelled: 'danger' };
const REQUEST_TONE: Record<RequestStatus, string> = { submitted: 'accent', awaiting_approval: 'warning', approved: 'accent', declined: 'danger', info_requested: 'warning', converted: 'accent', completed: 'success', closed: '' };
const PRIORITY_TONE: Record<Priority, string> = { low: '', medium: 'accent', high: 'warning', urgent: 'danger' };
const CRITICALITY_TONE: Record<string, string> = { low: '', medium: 'accent', high: 'warning', critical: 'danger' };
const ASSET_TONE: Record<string, string> = { operating: 'success', standby: 'accent', under_maintenance: 'warning', out_of_service: 'danger', disposed: '' };

export const WoBadge = ({ status }: { status: WoStatus }) => <span className={`badge ${WO_TONE[status]}`}>{WO_STATUS_LABELS[status]}</span>;
export const RequestBadge = ({ status }: { status: RequestStatus }) => <span className={`badge ${REQUEST_TONE[status]}`}>{REQUEST_STATUS_LABELS[status]}</span>;
export const PriorityBadge = ({ priority }: { priority: Priority }) => <span className={`badge ${PRIORITY_TONE[priority]}`}>{PRIORITY_LABELS[priority]}</span>;
export const CriticalityBadge = ({ value }: { value: string }) => <span className={`badge ${CRITICALITY_TONE[value] ?? ''}`}>{CRITICALITY_LABELS[value] ?? value}</span>;
export const AssetStatusBadge = ({ value }: { value: string }) => <span className={`badge ${ASSET_TONE[value] ?? ''}`}>{ASSET_STATUS_LABELS[value] ?? value}</span>;

/** A list of label and value pairs; empty values are left out. */
export function Props({ items }: { items: [string, ReactNode][] }) {
  const shown = items.filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== false);
  if (!shown.length) return <p className="muted small">Nothing recorded yet.</p>;
  return (
    <dl className="crm-props">
      {shown.map(([k, v]) => (
        <div key={k} className="crm-prop">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const SKIP_KEYS = new Set(['search', 'updated_at']);
const show = (v: unknown) => (v === null || v === undefined || v === '' ? '(empty)' : typeof v === 'object' ? JSON.stringify(v) : String(v));

export function History({ events }: { events: MtEvent[] }) {
  if (!events.length) return <p className="muted small">No history yet.</p>;
  return (
    <ol className="mt-history">
      {events.map((e) => {
        const keys = e.after ? Object.keys(e.after).filter((k) => !SKIP_KEYS.has(k) && e.before && k in e.before) : [];
        return (
          <li key={e.id}>
            <div>
              <strong>{e.actorName ?? 'System'}</strong> <span className="muted small" title={dateTimeText(e.at)}>{timeAgo(e.at)}</span>
            </div>
            <div className="small">{e.summary}</div>
            {keys.length ? (
              <ul className="mt-changes small muted">
                {keys.slice(0, 12).map((k) => (
                  <li key={k}>
                    {k.replace(/_json$|_cents$/, '').replace(/_/g, ' ')}: {show(e.before![k])} → {show(e.after![k])}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function Comments({ comments, onAdd, canAdd, noun = 'note' }: { comments: MtComment[]; onAdd?: (body: string) => Promise<void>; canAdd: boolean; noun?: 'note' | 'comment' }) {
  const placeholder = `Add a ${noun}`;
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!onAdd || !text.trim()) return;
    setBusy(true);
    try {
      await onAdd(text.trim());
      setText('');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack">
      {comments.length ? (
        <ul className="mt-comments">
          {comments.map((c) => (
            <li key={c.id}>
              <div className="small"><strong>{c.authorName ?? 'Someone'}</strong> <span className="muted" title={dateTimeText(c.at)}>{timeAgo(c.at)}</span></div>
              <div className="mt-pre">{c.body}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">No {noun}s yet.</p>
      )}
      {canAdd && onAdd ? (
        <form className="stack" onSubmit={submit}>
          <label className="sr-only" htmlFor="mt-note">{placeholder}</label>
          <textarea id="mt-note" className="textarea" rows={3} maxLength={5000} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row"><button className="btn" disabled={busy || !text.trim()}>{busy ? 'Saving…' : `Add ${noun}`}</button></div>
        </form>
      ) : null}
    </div>
  );
}

/** Upload one or more files to an asset, request or work order. Phones offer the camera for photos. */
export function UploadButton({ companyId, target, onDone, label = 'Add photos or documents', big }: { companyId: string; target: { assetId?: string; requestId?: string; workOrderId?: string }; onDone: () => void; label?: string; big?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) await uploadMtFile(companyId, target, f);
      toast(files.length === 1 ? 'File added' : `${files.length} files added`);
      onDone();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };
  return (
    <>
      <input ref={input} type="file" multiple className="sr-only" accept="image/*,.pdf,.txt,.csv,.docx,.xlsx,.pptx,.odt,.ods,.zip,.mp4,.md" onChange={(e) => void pick(e.target.files)} aria-label={label} tabIndex={-1} />
      <button type="button" className={`btn${big ? ' lg' : ''}`} disabled={busy} onClick={() => input.current?.click()}>
        <Icon name="upload" /> {busy ? 'Uploading…' : label}
      </button>
    </>
  );
}

export async function uploadMtFile(companyId: string, target: { assetId?: string; requestId?: string; workOrderId?: string }, file: File) {
  const fd = new FormData();
  fd.set('file', file);
  for (const [k, v] of Object.entries(target)) if (v) fd.set(k, v);
  return api(mtPath(companyId, '/files'), { method: 'POST', form: fd });
}

export function FileList({ files, canRemove, onRemove }: { files: MtFile[]; canRemove?: (f: MtFile) => boolean; onRemove?: (f: MtFile) => void }) {
  if (!files.length) return <p className="muted small">No photos or documents yet.</p>;
  const photos = files.filter((f) => f.isImage);
  const docs = files.filter((f) => !f.isImage);
  return (
    <div className="stack">
      {photos.length ? (
        <div className="mt-photos">
          {photos.map((f) => (
            <figure key={f.id} className="mt-photo">
              <a href={appUrl(f.url)} target="_blank" rel="noopener">
                <img src={appUrl(f.url)} alt={f.name} loading="lazy" />
              </a>
              <figcaption className="small">
                <span className="ellipsis">{f.name}</span>
                {canRemove?.(f) && onRemove ? <button className="btn ghost icon sm" aria-label={`Remove ${f.name}`} onClick={() => onRemove(f)}><Icon name="trash" size={14} /></button> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      {docs.length ? (
        <ul className="mt-docs">
          {docs.map((f) => (
            <li key={f.id} className="row">
              <Icon name="file" />
              <a className="grow ellipsis" href={`${appUrl(f.url)}?download=1`}>{f.name}</a>
              <span className="muted small">{formatBytes(f.size)} · {f.uploadedByName ?? ''} · {timeAgo(f.createdAt)}</span>
              {canRemove?.(f) && onRemove ? <button className="btn ghost icon sm" aria-label={`Remove ${f.name}`} onClick={() => onRemove(f)}><Icon name="trash" size={14} /></button> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** A section card with a heading and optional actions. */
export function Section({ title, actions, children, id }: { title: string; actions?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section className="card card-pad stack" aria-labelledby={id}>
      <div className="row wrap">
        <h2 className="crm-subhead grow" id={id}>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

/** The filters of a list: always shown on a computer; behind a Filters button on a phone. */
export function FilterPanel({ active, children }: { active: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={`btn mobile-only${active ? ' active' : ''}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="filter" /> Filters{active ? ` (${active})` : ''}
      </button>
      <div className={`mt-filters${open ? '' : ' mt-filters-closed'}`} role="group" aria-label="Filters">
        {children}
      </div>
    </>
  );
}

/** Options for a select of fixed values with labels. */
export const options = (labels: Record<string, string>) => Object.entries(labels).map(([v, l]) => <option key={v} value={v}>{l}</option>);
