import { useState } from 'react';
import { COLUMN_TYPES, canConvert, columnTypes, getColumnType, PALETTE, type LabelOption } from '../../shared/columns';
import { checkFormula } from '../../shared/formula';
import type { ColumnDTO } from '../../shared/types';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/overlays';
import { Field } from '../components/ui/ui';

const CATEGORY_ORDER = ['basic', 'choice', 'people', 'time', 'numbers', 'contact', 'advanced', 'system'];

export function ColumnTypePicker({ value, onChange, allowed }: { value: string; onChange: (t: string) => void; allowed?: string[] }) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Column type">
      {CATEGORY_ORDER.map((cat) => {
        const types = COLUMN_TYPES.filter((t) => columnTypes[t].category === cat && (!allowed || allowed.includes(t)));
        if (!types.length) return null;
        return (
          <optgroup key={cat} label={cat[0].toUpperCase() + cat.slice(1)}>
            {types.map((t) => <option key={t} value={t}>{columnTypes[t].label}</option>)}
          </optgroup>
        );
      })}
    </select>
  );
}

export function ColumnDialog({ column, columns, onClose, onSave }: { column?: ColumnDTO; columns: ColumnDTO[]; onClose: () => void; onSave: (input: { title: string; type: string; settings: Record<string, unknown>; required: boolean; description: string }) => Promise<boolean | void> }) {
  const [title, setTitle] = useState(column?.title ?? '');
  const [type, setType] = useState(column?.type ?? 'text');
  const [settings, setSettings] = useState<Record<string, any>>(column?.settings ?? getColumnType('text').defaultSettings());
  const [required, setRequired] = useState(column?.required ?? false);
  const [description, setDescription] = useState(column?.description ?? '');
  const [busy, setBusy] = useState(false);
  const changeType = (t: string) => {
    setType(t);
    if (!column || column.type !== t) {
      const defaults = getColumnType(t).defaultSettings() as Record<string, any>;
      // Keep labels when switching between label types.
      const carry = settings.labels ?? settings.options;
      if (carry && (t === 'status' || t === 'priority')) defaults.labels = carry;
      if (carry && t === 'dropdown') defaults.options = carry;
      setSettings(column && column.type !== t && ['status', 'priority', 'dropdown'].includes(t) && !['status', 'priority', 'dropdown'].includes(column.type) ? { ...defaults, labels: undefined, options: undefined } : defaults);
    }
    if (!title || title === getColumnType(type).label) setTitle(getColumnType(t).label);
  };
  const allowedTypes = column ? [column.type, ...COLUMN_TYPES.filter((t) => canConvert(column.type, t))] : undefined;
  const formulaError = type === 'formula' && settings.formula ? checkFormula(settings.formula) : null;
  const save = async () => {
    setBusy(true);
    const s = { ...settings };
    if (column && column.type !== type && ['status', 'priority', 'dropdown'].includes(type) && !s.labels && !s.options) {
      // Let the server derive labels from existing values.
      delete s.labels;
      delete s.options;
    }
    const ok = await onSave({ title: title.trim() || getColumnType(type).label, type, settings: column && column.type !== type && !s.labels && !s.options && ['status', 'priority', 'dropdown'].includes(type) ? (undefined as any) : s, required, description });
    setBusy(false);
    if (ok !== false) onClose();
  };
  return (
    <Modal
      title={column ? `Column settings · ${column.title}` : 'Add column'}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={busy || !!formulaError}>{column ? 'Save changes' : 'Add column'}</button>
        </>
      }
    >
      <div className="row wrap" style={{ alignItems: 'flex-start', gap: 16 }}>
        <div className="grow" style={{ minWidth: 220 }}>
          <Field label="Title" htmlFor="col-title">
            <input id="col-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          </Field>
        </div>
        <div style={{ width: 240 }}>
          <Field label="Type" hint={column ? 'Only safe conversions are offered.' : undefined}>
            <ColumnTypePicker value={type} onChange={changeType} allowed={allowedTypes} />
          </Field>
        </div>
      </div>
      <Field label="Description" htmlFor="col-desc">
        <input id="col-desc" className="input" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Optional help text" />
      </Field>
      {!getColumnType(type).computed ? (
        <label className="checkbox" style={{ marginBottom: 12 }}>
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} /> Required (cannot be cleared once set; enforced in forms)
        </label>
      ) : null}
      <TypeSettings type={type} settings={settings} setSettings={setSettings} columns={columns} formulaError={formulaError} />
    </Modal>
  );
}

function TypeSettings({ type, settings, setSettings, columns, formulaError }: { type: string; settings: Record<string, any>; setSettings: (s: Record<string, any>) => void; columns: ColumnDTO[]; formulaError: string | null }) {
  const set = (k: string, v: unknown) => setSettings({ ...settings, [k]: v });
  switch (type) {
    case 'status':
    case 'priority':
      return <LabelsEditor labels={settings.labels ?? []} onChange={(l) => set('labels', l)} allowDone={type === 'status'} />;
    case 'dropdown':
      return (
        <>
          <label className="checkbox" style={{ marginBottom: 10 }}><input type="checkbox" checked={settings.multiple !== false} onChange={(e) => set('multiple', e.target.checked)} /> Allow multiple selections</label>
          <LabelsEditor labels={settings.options ?? []} onChange={(l) => set('options', l)} />
        </>
      );
    case 'number':
    case 'percentage':
      return (
        <div className="row wrap">
          <Field label="Decimals"><input className="input" type="number" min={0} max={6} value={settings.decimals ?? 0} onChange={(e) => set('decimals', Number(e.target.value))} /></Field>
          <Field label="Minimum"><input className="input" type="number" value={settings.min ?? ''} onChange={(e) => set('min', e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
          <Field label="Maximum"><input className="input" type="number" value={settings.max ?? ''} onChange={(e) => set('max', e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
        </div>
      );
    case 'currency':
      return (
        <div className="row wrap">
          <Field label="Currency code"><input className="input" value={settings.currency ?? 'USD'} maxLength={3} onChange={(e) => set('currency', e.target.value.toUpperCase())} /></Field>
          <Field label="Decimals"><input className="input" type="number" min={0} max={4} value={settings.decimals ?? 2} onChange={(e) => set('decimals', Number(e.target.value))} /></Field>
          <Field label="Minimum"><input className="input" type="number" value={settings.min ?? ''} onChange={(e) => set('min', e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
        </div>
      );
    case 'rating':
      return <Field label="Maximum stars"><input className="input" type="number" min={3} max={10} value={settings.max ?? 5} onChange={(e) => set('max', Number(e.target.value))} /></Field>;
    case 'text':
    case 'long_text':
      return (
        <div className="row wrap">
          <Field label="Maximum length"><input className="input" type="number" min={1} value={settings.maxLength ?? ''} onChange={(e) => set('maxLength', e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
          <Field label="Pattern (regular expression)" hint="e.g. ^[A-Z]{3}-\d+$"><input className="input mono" value={settings.pattern ?? ''} onChange={(e) => set('pattern', e.target.value || undefined)} /></Field>
        </div>
      );
    case 'progress':
      return (
        <Field label="Progress source">
          <select className="select" value={settings.mode ?? 'manual'} onChange={(e) => set('mode', e.target.value)}>
            <option value="manual">Manual (slider)</option>
            <option value="subitems">Completed subitems</option>
            <option value="status">Status column position</option>
          </select>
        </Field>
      );
    case 'formula':
      return (
        <Field label="Formula" error={formulaError} hint={<>Reference columns with {'{Column title}'}. Functions: SUM, AVG, MIN, MAX, ROUND, ABS, IF, AND, OR, NOT, CONCAT, LEN, UPPER, LOWER, TODAY, DAYS, ADD_DAYS, ISBLANK, COALESCE.</>}>
          <textarea className="textarea mono" rows={3} value={settings.formula ?? ''} onChange={(e) => set('formula', e.target.value)} placeholder="ROUND({Deal value} * {Probability} / 100, 0)" />
          <div className="row wrap" style={{ gap: 4, marginTop: 6 }}>
            {columns.filter((c) => c.type !== 'formula').map((c) => (
              <button key={c.id} type="button" className="badge" style={{ cursor: 'pointer', border: 0 }} onClick={() => set('formula', `${settings.formula ?? ''}{${c.title}}`)}>{c.title}</button>
            ))}
          </div>
        </Field>
      );
    case 'date':
      return <p className="muted small">Dates drive the calendar view, due-date notifications and date-based automations.</p>;
    case 'timeline':
      return <p className="muted small">Timelines drive the Gantt view (start, end, drag to reschedule).</p>;
    default:
      return null;
  }
}

function LabelsEditor({ labels, onChange, allowDone }: { labels: LabelOption[]; onChange: (l: LabelOption[]) => void; allowDone?: boolean }) {
  const update = (i: number, patch: Partial<LabelOption>) => onChange(labels.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const move = (i: number, d: number) => {
    const next = [...labels];
    const [x] = next.splice(i, 1);
    next.splice(Math.max(0, Math.min(next.length, i + d)), 0, x);
    onChange(next);
  };
  return (
    <div className="field">
      <label>Labels</label>
      <div className="col" style={{ gap: 6 }}>
        {labels.map((l, i) => (
          <div key={l.id} className="row">
            <input type="color" value={l.color} onChange={(e) => update(i, { color: e.target.value })} aria-label={`Colour for ${l.label}`} style={{ width: 32, height: 28, border: 0, background: 'none', padding: 0 }} />
            <input className="input sm grow" value={l.label} onChange={(e) => update(i, { label: e.target.value })} aria-label="Label text" maxLength={60} />
            {allowDone ? (
              <label className="checkbox small" title="Items with this label count as complete"><input type="checkbox" checked={!!l.done} onChange={(e) => update(i, { done: e.target.checked || undefined })} /> Done</label>
            ) : null}
            <button className="btn ghost icon sm" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0}><Icon name="chevronDown" size={14} className="" /></button>
            <button className="btn ghost icon sm" aria-label="Remove label" onClick={() => onChange(labels.filter((_, j) => j !== i))}><Icon name="trash" size={14} /></button>
          </div>
        ))}
        <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => onChange([...labels, { id: `l${Math.random().toString(36).slice(2, 8)}`, label: `Label ${labels.length + 1}`, color: PALETTE[labels.length % PALETTE.length] }])}>
          <Icon name="plus" /> Add label
        </button>
      </div>
    </div>
  );
}
