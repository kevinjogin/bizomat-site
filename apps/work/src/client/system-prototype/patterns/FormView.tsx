// The create and edit form pattern: grouped fields with labels and short descriptions, sensible defaults, validation
// with an error summary, Save draft, Save and continue, Cancel, and a warning before leaving with unsaved changes.
import { useEffect, useRef, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
import { Modal, useToast } from '../../components/ui/overlays';
import { pad } from '../format';
import { PIcon } from '../icons';
import { Panel } from '../kit';
import { sectionOf } from '../nav';
import { useRows } from '../registry';
import { PageHeader, StateNote, useVisit } from '../shell/PageHeader';
import { useErp } from '../state';
import type { EntityDef, FieldDef, NavPage, Row } from '../types';

function nextId(rows: Row[]): string {
  const sample = rows.find((r) => /\d+$/.test(r.id))?.id ?? 'REC-0000';
  const prefix = sample.replace(/\d+$/, '');
  const width = sample.length - prefix.length;
  const max = rows.filter((r) => r.id.startsWith(prefix)).reduce((m, r) => Math.max(m, Number(r.id.slice(prefix.length)) || 0), 0);
  return `${prefix}${pad(max + 1, width)}`;
}

function validate(fields: FieldDef[], v: Record<string, any>): Record<string, string> {
  const e: Record<string, string> = {};
  fields.forEach((f) => {
    const val = v[f.name];
    if (f.required && (val === '' || val === undefined || val === null)) e[f.name] = `Enter ${f.label.toLowerCase().replace(/ \(.*\)$/, '')}.`;
    else if ((f.type === 'number' || f.type === 'money') && val !== '' && val !== undefined) {
      if (Number.isNaN(Number(val))) e[f.name] = `${f.label} must be a number.`;
      else if (f.min !== undefined && Number(val) < f.min) e[f.name] = `${f.label} must be at least ${f.min}.`;
    }
  });
  return e;
}

export function FormView({ def, page }: { def: EntityDef; page: NavPage }) {
  const form = def.form!;
  const section = sectionOf(page.path);
  const fields = form.groups.flatMap((g) => g.fields);
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.type === 'checkbox' ? false : '')]));
  const [values, setValues] = useState<Record<string, any>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const leaving = useRef(false);
  const rows = useRows(def.key);
  const { createRecord, patchRecord } = useErp();
  const toast = useToast();
  const navigate = useNavigate();
  const summaryRef = useRef<HTMLDivElement>(null);
  useVisit(`/${page.path}/new`, form.title);

  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [dirty]);

  const set = (name: string, v: any) => {
    setValues((s) => ({ ...s, [name]: v }));
    setDirty(true);
    if (errors[name]) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== name)));
  };
  const save = (mode: 'draft' | 'continue') => {
    const errs = validate(mode === 'draft' ? fields.filter((f) => f === fields[0]) : fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    const id = draftId ?? nextId(rows);
    const body = form.toRow(values);
    const row: Row = mode === 'draft' ? { id, ...body, status: 'Draft' } : { id, status: def.workflow ? 'Awaiting approval' : 'Open', ...body };
    if (draftId) patchRecord(def.key, id, row);
    else createRecord(def.key, row);
    setDirty(false);
    if (mode === 'draft') {
      setDraftId(id);
      setSavedAt(new Date().toTimeString().slice(0, 5));
      toast(`Draft ${id} saved (this visit only).`);
    } else {
      leaving.current = true;
      toast(`${def.label} ${id} saved (this visit only).`);
      navigate(`/${page.path}/${id}`);
    }
  };
  const errorList = Object.entries(errors);
  return (
    <div className="erp-page erp-form-page">
      <PageHeader crumbs={[{ label: 'Home', to: '/' }, { label: section?.label ?? '', to: `/${section?.pages[0].path}` }, { label: page.label, to: `/${page.path}` }, { label: 'New' }]} title={form.title} states={page.state} subtitle={form.intro} />
      <StateNote page={page} />
      <form
        className="erp-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save('continue');
        }}
      >
        {errorList.length ? (
          <div className="erp-alert danger erp-error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
            <PIcon name="alert" />
            <div>
              <strong>
                {errorList.length === 1 ? 'One thing needs fixing' : `${errorList.length} things need fixing`} before saving
              </strong>
              <ul>
                {errorList.map(([k, msg]) => (
                  <li key={k}>
                    <button type="button" className="erp-linkbtn" onClick={() => document.getElementById(`f-${k}`)?.focus()}>
                      {msg}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        {form.groups.map((g) => (
          <Panel key={g.title} title={g.title}>
            {g.description ? <p className="muted small erp-group-desc">{g.description}</p> : null}
            <div className="erp-form-grid">
              {g.fields.map((f) => (
                <FormField key={f.name} f={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => set(f.name, v)} />
              ))}
            </div>
          </Panel>
        ))}
        <div className="erp-form-actions">
          <span className="muted small" aria-live="polite">
            {savedAt ? `Draft ${draftId} saved at ${savedAt}.` : dirty ? 'Unsaved changes.' : 'Fields marked required must be filled in to save.'}
          </span>
          <span className="spacer" />
          <button type="button" className="btn" onClick={() => navigate(`/${page.path}`)}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={() => save('draft')}>
            Save draft
          </button>
          <button type="submit" className="btn primary">
            Save and continue
          </button>
        </div>
      </form>
      {dirty ? <LeaveGuard title={form.title} leaving={leaving} /> : null}
    </div>
  );
}

/** Asks before leaving a form with unsaved changes. Mounted only while there are changes, so nothing else is blocked. */
function LeaveGuard({ title, leaving }: { title: string; leaving: { current: boolean } }) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => !leaving.current && currentLocation.pathname !== nextLocation.pathname);
  if (blocker.state !== 'blocked') return null;
  return (
    <Modal
      title="Leave without saving?"
      onClose={() => blocker.reset()}
      footer={
        <>
          <button type="button" className="btn" onClick={() => blocker.reset()}>
            Stay on this form
          </button>
          <button type="button" className="btn danger" onClick={() => blocker.proceed()}>
            Leave without saving
          </button>
        </>
      }
    >
      <p>Your changes to “{title}” are not saved. If you leave now, they are lost.</p>
    </Modal>
  );
}

function FormField({ f, value, error, onChange }: { f: FieldDef; value: any; error?: string; onChange: (v: any) => void }) {
  const id = `f-${f.name}`;
  const describedBy = [f.description ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  const common = { id, 'aria-invalid': !!error, 'aria-describedby': describedBy, 'aria-required': f.required || undefined };
  if (f.type === 'checkbox')
    return (
      <div className={`field${f.wide ? ' erp-wide' : ''}`}>
        <label className="checkbox" htmlFor={id}>
          <input type="checkbox" {...common} checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}
        </label>
        {f.description ? <span id={`${id}-hint`} className="hint">{f.description}</span> : null}
      </div>
    );
  return (
    <div className={`field${f.wide ? ' erp-wide' : ''}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required ? <span className="erp-req"> (required)</span> : null}
      </label>
      {f.type === 'select' ? (
        <select className={`select${error ? ' invalid' : ''}`} {...common} value={value} onChange={(e) => onChange(e.target.value)}>
          {f.default === undefined ? <option value="">Choose…</option> : null}
          {f.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : f.type === 'textarea' ? (
        <textarea className={`textarea${error ? ' invalid' : ''}`} {...common} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          className={`input${error ? ' invalid' : ''}`}
          {...common}
          type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'}
          inputMode={f.type === 'money' ? 'decimal' : undefined}
          min={f.min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error ? (
        <span id={`${id}-error`} className="error">
          {error}
        </span>
      ) : null}
      {f.description ? (
        <span id={`${id}-hint`} className="hint">
          {f.description}
        </span>
      ) : null}
    </div>
  );
}
