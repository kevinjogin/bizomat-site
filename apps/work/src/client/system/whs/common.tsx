// Small pieces shared by the WHS screens: badges, the workflow stepper, the risk level, uploads (the camera on a phone),
// files, notes and consultation, the history, dialogs and pickers. Lists and property lists reuse the maintenance
// screens' pieces.
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorMessage, post } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { Modal, useToast } from '../../components/ui/overlays';
import { FileList as MtFileList } from '../maintenance/common';
import type { MtFile } from '../maintenance/api';
import { timeAgo } from '../../lib/format';
import { dateTimeText, whsPath, type Labels, type WhsComment, type WhsFile, type WhsMe } from './api';

export { History, Props, Section, FilterPanel } from '../maintenance/common';

export const options = (labels: Labels, keys?: readonly string[]) => (keys ?? Object.keys(labels)).map((v) => <option key={v} value={v}>{labels[v] ?? v}</option>);

const STATUS_TONE: Record<string, string> = {
  reported: 'warning',
  assessment: 'accent',
  controls_assigned: 'accent',
  implementation: 'accent',
  verification: 'accent',
  immediate_response: 'warning',
  classified: 'accent',
  investigation: 'warning',
  corrective_action: 'accent',
  closed: 'success',
  cancelled: '',
  open: 'accent',
  in_progress: 'warning',
  completed: 'accent',
  verified: 'success',
  draft: '',
  submitted: 'warning',
  approved: 'success',
  superseded: '',
  to_submit: 'warning',
  not_notifiable: '',
  assessing: 'warning',
};
export const StatusBadge = ({ status, label }: { status: string; label: string }) => <span className={`badge ${STATUS_TONE[status] ?? ''}`}>{label}</span>;

/** A risk level: the darker the higher, with its name in words (never colour alone). */
export function RiskBadge({ level, label, rank, high }: { level: string | null; label: string; rank?: number | null; high?: boolean }) {
  if (!level) return <span className="muted small">Not rated</span>;
  return <span className={`badge whs-risk whs-risk-${Math.min(Math.max(Number(rank ?? 1), 1), 6)}${high ? ' whs-risk-high' : ''}`}>{label}</span>;
}

export const ConfidentialBadge = () => (
  <span className="badge whs-confidential" title="Confidential: seen only by the reporter, WHS managers and health officers">
    <Icon name="lock" size={12} /> Confidential
  </span>
);

/** The steps of a workflow, the current one marked. */
export function Stepper({ steps, current, label = 'Progress' }: { steps: [string, string][]; current: string; label?: string }) {
  const at = steps.findIndex(([k]) => k === current);
  return (
    <ol className="qc-steps whs-steps" aria-label={label}>
      {steps.map(([k, text], i) => (
        <li key={k} className={i < at ? 'done' : i === at ? 'current' : ''} aria-current={i === at ? 'step' : undefined}>
          {text}
        </li>
      ))}
    </ol>
  );
}

/** Runs an action, says how it went, and refreshes the company's WHS data; the action's answer, else null. */
export function useWhsAct(companyId: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return async <T,>(fn: () => Promise<T>, done: string): Promise<T | null> => {
    try {
      const r = await fn();
      if (done) toast(done);
      await qc.invalidateQueries({ queryKey: ['whs', companyId] });
      return r;
    } catch (err) {
      toast(errorMessage(err), 'error');
      return null;
    }
  };
}

/** Add photos or documents to a WHS record. On a phone, "Take a photo" opens the camera. */
export function WhsUpload({ companyId, kind, id, onDone, label = 'Add photos or documents', big, camera }: { companyId: string; kind: string; id: string; onDone: () => void; label?: string; big?: boolean; camera?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.set('file', f);
        fd.set('kind', kind);
        fd.set('id', id);
        await api(whsPath(companyId, '/files'), { method: 'POST', form: fd });
      }
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
      <input ref={input} type="file" multiple={!camera} className="sr-only" accept={camera ? 'image/*' : 'image/*,.pdf,.txt,.csv,.docx,.xlsx,.pptx,.odt,.ods,.zip,.md'} capture={camera ? 'environment' : undefined} onChange={(e) => void pick(e.target.files)} aria-label={label} tabIndex={-1} />
      <button type="button" className={`btn${big ? ' whs-big' : ''}`} disabled={busy} onClick={() => input.current?.click()}>
        <Icon name={camera ? 'image' : 'upload'} /> {busy ? 'Uploading…' : label}
      </button>
    </>
  );
}

export function WhsFiles({ companyId, files, onRemoved, canRemove }: { companyId: string; files: WhsFile[]; onRemoved: () => void; canRemove?: boolean }) {
  const act = useWhsAct(companyId);
  const list: MtFile[] = files.map((f) => ({ ...f, uploadedBy: f.uploadedBy ?? null }));
  return <MtFileList files={list} canRemove={() => !!canRemove} onRemove={(f) => void act(() => api(whsPath(companyId, `/files/${f.id}`), { method: 'DELETE' }), 'File removed').then(onRemoved)} />;
}

/** Notes, and consultation comments from health and safety representatives. */
export function Comments({ companyId, entityType, entityId, comments, canNote, canConsult }: { companyId: string; entityType: string; entityId: string; comments: WhsComment[]; canNote: boolean; canConsult: boolean }) {
  const [text, setText] = useState('');
  const [kind, setKind] = useState<'note' | 'consultation'>(canNote ? 'note' : 'consultation');
  const [busy, setBusy] = useState(false);
  const act = useWhsAct(companyId);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    const r = await act(() => post(whsPath(companyId, '/comments'), { entityType, entityId, kind, body: text.trim() }), kind === 'consultation' ? 'Consultation comment added' : 'Note added');
    setBusy(false);
    if (r) setText('');
  };
  return (
    <div className="stack">
      {comments.length ? (
        <ul className="mt-comments">
          {comments.map((c) => (
            <li key={c.id}>
              <div className="small">
                <strong>{c.authorName ?? 'Someone'}</strong> {c.kind === 'consultation' ? <span className="badge accent">Consultation</span> : null} <span className="muted" title={dateTimeText(c.at)}>{timeAgo(c.at)}</span>
              </div>
              <div className="mt-pre">{c.body}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">No notes yet.</p>
      )}
      {canNote || canConsult ? (
        <form className="stack" onSubmit={submit}>
          {canNote && canConsult ? (
            <div className="row wrap" role="radiogroup" aria-label="Kind of comment">
              <label className="checkbox"><input type="radio" name={`kind-${entityId}`} checked={kind === 'note'} onChange={() => setKind('note')} /> Note</label>
              <label className="checkbox"><input type="radio" name={`kind-${entityId}`} checked={kind === 'consultation'} onChange={() => setKind('consultation')} /> Consultation comment</label>
            </div>
          ) : null}
          <label className="sr-only" htmlFor={`note-${entityId}`}>Add a comment</label>
          <textarea id={`note-${entityId}`} className="textarea" rows={3} maxLength={5000} placeholder={kind === 'consultation' ? 'A consultation comment, for the record' : 'Add a note'} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row"><button className="btn" disabled={busy || !text.trim()}>{busy ? 'Saving…' : 'Add'}</button></div>
        </form>
      ) : null}
    </div>
  );
}

/** A dialog with one text box, for a step that needs a note or a reason. */
export function NoteDialog({ title, label, confirm, required, danger, intro, onClose, onSave, children }: { title: string; label: string; confirm: string; required?: boolean; danger?: boolean; intro?: ReactNode; onClose: () => void; onSave: (note: string) => Promise<unknown>; children?: ReactNode }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const r = await onSave(note.trim());
    setBusy(false);
    if (r) onClose();
  };
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Back</button><button className={`btn ${danger ? 'danger' : 'primary'}`} disabled={busy || (required && !note.trim())} onClick={() => void save()}>{busy ? 'Saving…' : confirm}</button></>}>
      <div className="stack">
        {intro}
        {children}
        <div className="field"><label htmlFor="whs-note">{label}</label><textarea id="whs-note" className="textarea" rows={3} maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

export function PersonSelect({ me, value, onChange, id, label = 'Responsible person', optional = true }: { me: WhsMe; value: string; onChange: (v: string) => void; id: string; label?: string; optional?: boolean }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {optional ? <option value="">Nobody yet</option> : null}
        {me.people.map((p) => <option key={p.id} value={p.id}>{p.name}{p.id === me.user.id ? ' (you)' : ''}</option>)}
      </select>
    </div>
  );
}

export function SiteSelect({ me, value, onChange, id, label = 'Site' }: { me: WhsMe; value: string; onChange: (v: string) => void; id: string; label?: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Not at a site</option>
        {me.sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </div>
  );
}

/** A likelihood or consequence picker on the company's matrix. */
export function RatingSelect({ id, label, value, onChange, scale, optional }: { id: string; label: string; value: number | ''; onChange: (v: number | '') => void; scale: { value: number; label: string }[]; optional?: boolean }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}>
        {optional ? <option value="">Not rated</option> : null}
        {scale.map((s) => <option key={s.value} value={s.value}>{s.value}. {s.label}</option>)}
      </select>
    </div>
  );
}

/** The level a rating gives on a matrix (worked out on the server too: this only shows it as the person chooses). */
export function levelOf(m: WhsMe['matrix'], l: number | '' | null | undefined, c: number | '' | null | undefined) {
  if (!l || !c) return null;
  const key = m.grid[l - 1]?.[c - 1];
  return m.levels.find((x) => x.key === key) ?? null;
}

export function Warnings({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="whs-warning" role="note">
      <Icon name="alert" size={16} />
      <div>{items.map((w, i) => <p key={i} className="small">{w}</p>)}</div>
    </div>
  );
}

/** The plain words every legal screen carries. */
export function LegalNotice({ text }: { text: string }) {
  return (
    <p className="whs-legal-notice small">
      <Icon name="info" size={14} /> {text}
    </p>
  );
}
