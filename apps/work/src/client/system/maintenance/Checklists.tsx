// Inspection templates (stage M2): checklists of pass/fail, number and text items, used for inspections on work orders,
// inspection rounds (one work order over many assets, Rounds.tsx) and prestart checks. Supervisors and administrators
// make and change them; items taken out are archived, so recorded results keep their own copy.
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { FAIL_ACTION_LABELS, ITEM_KIND_LABELS, mtPage, mtPath, type InspItem, type MtMe } from './api';
import { Section, options } from './common';

interface TemplateRow {
  id: string;
  name: string;
  description: string;
  failAction: string;
  items: number;
  critical: number;
  archived: boolean;
}

export function ChecklistsPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Inspection templates');
  const q = useQuery({ queryKey: ['mt', companyId, 'insp-templates'], queryFn: () => get<{ templates: TemplateRow[] }>(mtPath(companyId, '/inspection-templates')) });
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="grow muted small">Checklists for inspections on work orders, inspection rounds (one work order over many assets) and prestart checks. A failed inspection makes its follow-up once; a failed critical item in a prestart sets the asset out of service and raises a request.</p>
        {me.role !== 'requester' ? <Link className="btn" to={mtPage(companyId, '/rounds')}><Icon name="target" /> Inspection rounds</Link> : null}
        {me.can.managePm ? <Link className="btn primary" to={mtPage(companyId, '/checklists/new')}><Icon name="plus" /> New template</Link> : null}
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : !q.data.templates.length ? (
        <EmptyState icon="checkSquare" title="No inspection templates yet">{me.can.managePm ? 'Make one with the items to check: pass or fail, a number with its limits, or text.' : 'Supervisors and administrators make inspection templates.'}</EmptyState>
      ) : (
        <table className="data-table mt-table">
          <thead><tr><th>Template</th><th>Items</th><th>When it fails</th></tr></thead>
          <tbody>
            {q.data.templates.map((t) => (
              <tr key={t.id}>
                <td data-label="Template"><Link className="mt-primary" to={mtPage(companyId, `/checklists/${t.id}`)}>{t.name}</Link>{t.description ? <div className="muted small">{t.description}</div> : null}</td>
                <td data-label="Items" className="mt-num">{t.items}{t.critical ? ` (${t.critical} critical)` : ''}</td>
                <td data-label="When it fails">{FAIL_ACTION_LABELS[t.failAction] ?? t.failAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

interface ItemForm {
  id?: string;
  label: string;
  kind: string;
  unit: string;
  min: string;
  max: string;
  required: boolean;
  critical: boolean;
}

const newItem = (): ItemForm => ({ label: '', kind: 'pass_fail', unit: '', min: '', max: '', required: true, critical: false });

export function ChecklistEditor({ companyId, me }: { companyId: string; me: MtMe }) {
  const { templateId = '' } = useParams();
  const isNew = !templateId || templateId === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['mt', companyId, 'insp-template', templateId], queryFn: () => get<{ id: string; name: string; description: string; failAction: string; archived: boolean; items: InspItem[] }>(mtPath(companyId, `/inspection-templates/${templateId}`)), enabled: !isNew, retry: false });
  const [form, setForm] = useState<{ name: string; description: string; failAction: string; items: ItemForm[] } | null>(isNew ? { name: '', description: '', failAction: 'work_order', items: [newItem()] } : null);
  const [busy, setBusy] = useState(false);
  usePageTitle(isNew ? 'New inspection template' : (q.data?.name ?? 'Inspection template'));
  if (!isNew && q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!isNew && !q.data) return <Loading />;
  const f = form ?? { name: q.data!.name, description: q.data!.description, failAction: q.data!.failAction, items: q.data!.items.map((i) => ({ id: i.id, label: i.label, kind: i.kind, unit: i.unit, min: i.min != null ? String(i.min) : '', max: i.max != null ? String(i.max) : '', required: i.required, critical: i.critical })) };
  const set = (next: typeof f) => setForm(next);
  const setItem = (n: number, change: Partial<ItemForm>) => set({ ...f, items: f.items.map((x, i) => (i === n ? { ...x, ...change } : x)) });
  const move = (n: number, by: number) => {
    const items = [...f.items];
    const [it] = items.splice(n, 1);
    items.splice(Math.max(0, Math.min(items.length, n + by)), 0, it);
    set({ ...f, items });
  };
  const editable = me.can.managePm;
  const save = async () => {
    setBusy(true);
    try {
      const body = {
        name: f.name.trim(),
        description: f.description,
        failAction: f.failAction,
        items: f.items.filter((i) => i.label.trim()).map((i) => ({ ...(i.id ? { id: i.id } : {}), label: i.label.trim(), kind: i.kind, unit: i.unit, min: i.kind === 'number' && i.min !== '' ? Number(i.min) : null, max: i.kind === 'number' && i.max !== '' ? Number(i.max) : null, required: i.required, critical: i.critical })),
      };
      const r = isNew ? await post<{ id: string }>(mtPath(companyId, '/inspection-templates'), body) : await patch<{ id: string }>(mtPath(companyId, `/inspection-templates/${templateId}`), body);
      toast('Template saved');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      setForm(null);
      navigate(mtPage(companyId, `/checklists/${r.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const archive = async () => {
    try {
      await patch(mtPath(companyId, `/inspection-templates/${templateId}`), { archived: !q.data!.archived });
      toast(q.data!.archived ? 'Restored' : 'Archived');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-head">
        <h2 className="mt-title">{isNew ? 'New inspection template' : f.name}</h2>
        {!isNew && editable ? (
          <div className="mt-head-actions">
            {!q.data!.archived && me.can.manageWork ? <Link className="btn" to={mtPage(companyId, `/rounds/new?templateId=${encodeURIComponent(templateId)}`)}><Icon name="target" /> Start an inspection round</Link> : null}
            <button className="btn ghost" onClick={archive}>{q.data!.archived ? 'Restore' : 'Archive'}</button>
          </div>
        ) : null}
      </div>
      <Section title="Template">
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="ck-name">Name</label><input id="ck-name" className="input" maxLength={200} disabled={!editable} value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></div>
          <div className="field"><label htmlFor="ck-fail">When an inspection fails</label><select id="ck-fail" className="select" disabled={!editable} value={f.failAction} onChange={(e) => set({ ...f, failAction: e.target.value })}>{options(FAIL_ACTION_LABELS)}</select></div>
          <div className="field crm-span"><label htmlFor="ck-desc">Description</label><input id="ck-desc" className="input" maxLength={2000} disabled={!editable} value={f.description} onChange={(e) => set({ ...f, description: e.target.value })} /></div>
        </div>
        <p className="muted small">A prestart check always raises a request when an item fails, and sets the asset out of service when a critical item fails.</p>
      </Section>
      <Section title={`Items (${f.items.filter((i) => i.label.trim()).length})`}>
        <ol className="mt-items">
          {f.items.map((it, n) => (
            <li key={it.id ?? `new-${n}`} className="mt-item">
              <div className="mt-item-grid">
                <div className="field mt-item-label"><label htmlFor={`ck-l-${n}`}>Item {n + 1}</label><input id={`ck-l-${n}`} className="input" maxLength={300} disabled={!editable} value={it.label} onChange={(e) => setItem(n, { label: e.target.value })} placeholder="What to check" /></div>
                <div className="field"><label htmlFor={`ck-k-${n}`}>Kind</label><select id={`ck-k-${n}`} className="select" disabled={!editable} value={it.kind} onChange={(e) => setItem(n, { kind: e.target.value })}>{options(ITEM_KIND_LABELS)}</select></div>
                {it.kind === 'number' ? (
                  <>
                    <div className="field"><label htmlFor={`ck-u-${n}`}>Unit</label><input id={`ck-u-${n}`} className="input" maxLength={20} disabled={!editable} value={it.unit} onChange={(e) => setItem(n, { unit: e.target.value })} /></div>
                    <div className="field"><label htmlFor={`ck-min-${n}`}>Minimum</label><input id={`ck-min-${n}`} className="input" type="number" step="any" disabled={!editable} value={it.min} onChange={(e) => setItem(n, { min: e.target.value })} /></div>
                    <div className="field"><label htmlFor={`ck-max-${n}`}>Maximum</label><input id={`ck-max-${n}`} className="input" type="number" step="any" disabled={!editable} value={it.max} onChange={(e) => setItem(n, { max: e.target.value })} /></div>
                  </>
                ) : null}
              </div>
              <div className="row wrap small">
                <label className="checkbox"><input type="checkbox" disabled={!editable} checked={it.required} onChange={(e) => setItem(n, { required: e.target.checked })} /> Required</label>
                <label className="checkbox"><input type="checkbox" disabled={!editable || it.kind === 'text'} checked={it.critical} onChange={(e) => setItem(n, { critical: e.target.checked })} /> Critical (a prestart failure sets the asset out of service)</label>
                {editable ? (
                  <span className="row mt-item-tools">
                    <button className="btn ghost icon sm" aria-label={`Move item ${n + 1} up`} disabled={n === 0} onClick={() => move(n, -1)}><Icon name="chevronDown" size={14} className="mt-flip" /></button>
                    <button className="btn ghost icon sm" aria-label={`Move item ${n + 1} down`} disabled={n === f.items.length - 1} onClick={() => move(n, 1)}><Icon name="chevronDown" size={14} /></button>
                    <button className="btn ghost icon sm" aria-label={`Remove item ${n + 1}`} onClick={() => set({ ...f, items: f.items.filter((_, i) => i !== n) })}><Icon name="trash" size={14} /></button>
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        {editable ? (
          <div className="row wrap">
            <button className="btn" onClick={() => set({ ...f, items: [...f.items, newItem()] })}><Icon name="plus" /> Add an item</button>
            <button className="btn primary" disabled={busy || !f.name.trim() || !f.items.some((i) => i.label.trim())} onClick={save}>{busy ? 'Saving…' : 'Save template'}</button>
            <Link className="btn" to={mtPage(companyId, '/checklists')}>Back</Link>
          </div>
        ) : null}
      </Section>
    </div>
  );
}
