import { useState } from 'react';
import { labelsOf } from '../../../shared/columns';
import type { ColumnDTO, MemberDTO } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { isReadOnlyColumn } from '../cells/Cell';
import { Field } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { api, errorMessage } from '../../lib/api';
import '../../styles/views.css';

const UNSUPPORTED = new Set(['files', 'dependency']);

export function formEligible(columns: ColumnDTO[]) {
  return columns.filter((c) => !isReadOnlyColumn(c) && !UNSUPPORTED.has(c.type));
}

function FieldInput({ col, value, onChange, members }: { col: ColumnDTO; value: unknown; onChange: (v: unknown) => void; members: MemberDTO[] }) {
  const id = `f-${col.id}`;
  switch (col.type) {
    case 'long_text':
      return <textarea id={id} className="textarea" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} maxLength={20000} />;
    case 'number': case 'currency': case 'percentage':
      return <input id={id} className="input" type="number" step="any" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />;
    case 'date':
      return <input id={id} className="input" type="date" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value || null)} />;
    case 'timeline': {
      const v = (value as { start?: string; end?: string }) ?? {};
      return (
        <div className="row">
          <input id={id} className="input" type="date" aria-label={`${col.title} start`} value={v.start ?? ''} onChange={(e) => onChange({ ...v, start: e.target.value })} />
          <input className="input" type="date" aria-label={`${col.title} end`} value={v.end ?? ''} min={v.start} onChange={(e) => onChange({ ...v, end: e.target.value })} />
        </div>
      );
    }
    case 'status': case 'priority':
      return (
        <select id={id} className="select" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">—</option>
          {labelsOf(col).map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      );
    case 'dropdown': {
      const cur = Array.isArray(value) ? (value as string[]) : [];
      if (col.settings.multiple === false) {
        return (
          <select id={id} className="select" value={cur[0] ?? ''} onChange={(e) => onChange(e.target.value ? [e.target.value] : null)}>
            <option value="">—</option>
            {labelsOf(col).map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        );
      }
      return (
        <div className="row wrap" role="group" aria-label={col.title}>
          {labelsOf(col).map((l) => (
            <label key={l.id} className="checkbox">
              <input type="checkbox" checked={cur.includes(l.id)} onChange={(e) => onChange(e.target.checked ? [...cur, l.id] : cur.filter((x) => x !== l.id))} /> {l.label}
            </label>
          ))}
        </div>
      );
    }
    case 'person':
      return (
        <select id={id} className="select" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">—</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      );
    case 'people': {
      const cur = Array.isArray(value) ? (value as string[]) : [];
      return (
        <select id={id} className="select" multiple value={cur} style={{ height: 96 }} onChange={(e) => onChange(Array.from(e.target.selectedOptions).map((o) => o.value))}>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      );
    }
    case 'checkbox':
      return <label className="checkbox"><input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> Yes</label>;
    case 'tags':
      return <input id={id} className="input" placeholder="Comma-separated" value={Array.isArray(value) ? (value as string[]).join(', ') : ((value as string) ?? '')} onChange={(e) => onChange(e.target.value)} />;
    case 'rating': {
      const max = Number(col.settings.max ?? 5);
      return (
        <div className="row" role="radiogroup" aria-label={col.title}>
          {Array.from({ length: max }, (_, i) => (
            <button type="button" key={i} className="btn ghost icon sm" aria-label={`${i + 1} stars`} aria-pressed={(value as number) === i + 1} style={{ color: (value as number) > i ? '#f5a524' : 'var(--border-strong)', fontSize: 18 }} onClick={() => onChange(i + 1)}>★</button>
          ))}
        </div>
      );
    }
    case 'progress':
      return <input id={id} type="range" min={0} max={100} step={5} value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
    case 'location':
      return <input id={id} className="input" placeholder="Address" value={((value as any)?.address as string) ?? ''} onChange={(e) => onChange(e.target.value ? { address: e.target.value } : null)} />;
    case 'email':
      return <input id={id} className="input" type="email" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'link':
      return <input id={id} className="input" type="url" placeholder="https://" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'phone':
      return <input id={id} className="input" type="tel" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    default:
      return <input id={id} className="input" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} maxLength={1000} />;
  }
}

export function FormView(props: BoardViewProps) {
  const { bundle, view, canEdit, members, updateViewSettings, access } = props;
  const eligible = formEligible(bundle.columns);
  const fields = (view.settings.formColumns ?? []).map((id) => eligible.find((c) => c.id === id)).filter((c): c is ColumnDTO => !!c);
  const title = view.settings.formTitle ?? bundle.board.name;
  const description = view.settings.formDescription ?? '';
  const [name, setName] = useState('');
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const canSubmit = access !== 'view';
  const builder = canEdit;

  const toggleField = (id: string, on: boolean) => {
    const cur = view.settings.formColumns ?? [];
    updateViewSettings({ formColumns: on ? [...cur, id] : cur.filter((x) => x !== id) });
  };
  const moveField = (id: string, dir: -1 | 1) => {
    const cur = [...(view.settings.formColumns ?? [])];
    const i = cur.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= cur.length) return;
    [cur[i], cur[j]] = [cur[j], cur[i]];
    updateViewSettings({ formColumns: cur });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const missing = fields.filter((f) => f.required && (values[f.id] == null || values[f.id] === '' || (Array.isArray(values[f.id]) && !(values[f.id] as unknown[]).length)));
    if (!name.trim()) return setError('Please enter a name.');
    if (missing.length) return setError(`Required: ${missing.map((m) => m.title).join(', ')}`);
    const clean: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.id];
      if (v == null || v === '') continue;
      if (f.type === 'timeline' && (!(v as any).start || !(v as any).end)) continue;
      clean[f.id] = v;
    }
    setBusy(true);
    try {
      await api(`/views/${view.id}/submit`, { method: 'POST', body: { name: name.trim(), values: clean } });
      setDone(true);
      setName('');
      setValues({});
      props.actions.refresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`form-view${builder ? '' : ' public'}`}>
      {builder ? (
        <aside className="card form-builder" aria-label="Form builder">
          <h3 style={{ marginBottom: 10 }}>Form settings</h3>
          <Field label="Title" htmlFor="form-title">
            <input id="form-title" className="input sm" defaultValue={title} maxLength={200} onBlur={(e) => e.target.value !== title && updateViewSettings({ formTitle: e.target.value })} />
          </Field>
          <Field label="Description" htmlFor="form-desc">
            <textarea id="form-desc" className="textarea" rows={3} defaultValue={description} maxLength={2000} onBlur={(e) => e.target.value !== description && updateViewSettings({ formDescription: e.target.value })} />
          </Field>
          <Field label="New items go to group" htmlFor="form-group">
            <select id="form-group" className="select sm" value={view.settings.formGroupId ?? ''} onChange={(e) => updateViewSettings({ formGroupId: e.target.value || undefined })}>
              <option value="">First group</option>
              {bundle.groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </Field>
          <div className="label" style={{ marginBottom: 6 }}>Questions</div>
          <div className="field-list">
            {eligible.map((c) => {
              const on = (view.settings.formColumns ?? []).includes(c.id);
              return (
                <div key={c.id} className="row">
                  <label className="checkbox grow"><input type="checkbox" checked={on} onChange={(e) => toggleField(c.id, e.target.checked)} /> <span className="ellipsis">{c.title}</span>{c.required ? <span className="danger-text">*</span> : null}</label>
                  {on ? (
                    <>
                      <button className="btn ghost icon sm" aria-label={`Move ${c.title} up`} onClick={() => moveField(c.id, -1)}><Icon name="chevronLeft" size={12} /></button>
                      <button className="btn ghost icon sm" aria-label={`Move ${c.title} down`} onClick={() => moveField(c.id, 1)}><Icon name="chevronRight" size={12} /></button>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
          <p className="muted small" style={{ marginTop: 10 }}>Submissions create items on this board. Anyone with edit access to the board can submit.</p>
        </aside>
      ) : null}
      <div className="card form-card">
        {done ? (
          <div className="empty">
            <div className="empty-icon"><Icon name="check" size={24} /></div>
            <h3>Thanks — your response was recorded.</h3>
            <button className="btn primary" onClick={() => setDone(false)}>Submit another</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 style={{ marginBottom: 4 }}>{title}</h2>
            {description ? <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>{description}</p> : null}
            <hr />
            <Field label="Name *" htmlFor="f-name">
              <input id="f-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={500} required />
            </Field>
            {fields.map((f) => (
              <Field key={f.id} label={`${f.title}${f.required ? ' *' : ''}`} htmlFor={`f-${f.id}`} hint={f.description || undefined}>
                <FieldInput col={f} value={values[f.id]} members={members} onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))} />
              </Field>
            ))}
            {fields.length === 0 && builder ? <p className="muted small">Choose questions in the form settings.</p> : null}
            {error ? <div className="error-box" role="alert" style={{ marginBottom: 12 }}>{error}</div> : null}
            {canSubmit ? (
              <button className="btn primary lg" disabled={busy}>{busy ? 'Submitting…' : 'Submit'}</button>
            ) : (
              <div className="info-box">You have view-only access to this board, so you can't submit this form.</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
