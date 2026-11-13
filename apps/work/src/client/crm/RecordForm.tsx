// Create or edit a lead, contact, company, deal or activity. The fields come from src/shared/crm/fields.ts (the same
// definitions the server validates with) and the organisation's custom fields.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, errorMessage, patch, post } from '../lib/api';
import { useSession } from '../lib/session';
import { Modal, useToast } from '../components/ui/overlays';
import { useDebounced } from '../lib/hooks';
import { FIELDS, ENTITY_LABELS, type CrmEntity, type FieldDef } from '../../shared/crm/fields';
import type { DuplicateDTO } from '../../shared/crm/types';
import { CustomFieldInputs, MoneyInput, OptionSelect, RecordPicker, TagPicker, UserSelect } from './ui';
import { ENTITY_PATH, crm, optionsOf, recordPath, useCurrentOrg, useCustomFields, usePipelines, useRefreshOrg } from './lib';

/** The fields the form shows, in order, by record type. */
const FORM: Record<CrmEntity, string[]> = {
  lead: ['firstName', 'lastName', 'companyName', 'jobTitle', 'email', 'phone', 'website', 'country', 'industry', 'source', 'status', 'estimatedValue', 'priority', 'ownerId', 'followUpDate', 'description'],
  contact: ['firstName', 'lastName', 'jobTitle', 'companyId', 'email', 'phone', 'mobile', 'website', 'source', 'status', 'priority', 'ownerId', 'nextFollowUp', 'address', 'city', 'region', 'postcode', 'country', 'description'],
  company: ['name', 'website', 'industry', 'size', 'annualRevenue', 'phone', 'email', 'status', 'ownerId', 'address', 'city', 'region', 'postcode', 'country', 'description'],
  deal: ['title', 'value', 'pipelineId', 'stageId', 'expectedCloseDate', 'probability', 'companyId', 'ownerId', 'priority', 'source', 'competitors', 'description'],
  activity: ['title', 'type', 'dueDate', 'dueTime', 'durationMin', 'assignedTo', 'priority', 'contactId', 'companyId', 'dealId', 'leadId', 'location', 'description'],
};

const WIDE = new Set(['description', 'address', 'title', 'name', 'competitors']);

type Values = Record<string, any>;

export function RecordFormDialog({ entity, initial, onClose, onSaved, title }: { entity: CrmEntity; initial?: Values & { id?: string }; onClose: () => void; onSaved?: (row: any) => void; title?: string }) {
  const org = useCurrentOrg();
  const { session } = useSession();
  const toast = useToast();
  const navigate = useNavigate();
  const refresh = useRefreshOrg();
  const pipelines = usePipelines().data ?? [];
  const cfs = (useCustomFields().data ?? []).filter((f) => f.entity === entity && !f.archived);
  const editing = !!initial?.id;
  // A choice that must be made starts on its first option (priority on Medium), as the select shows it.
  const [values, setValues] = useState<Values>(() => {
    const v: Values = { ...(initial ?? {}) };
    // A new record is the creator's unless someone else is chosen (as the server does).
    if (!initial?.id && session) {
      if (FORM[entity].includes('ownerId') && v.ownerId === undefined) v.ownerId = session.user.id;
      if (FORM[entity].includes('assignedTo') && v.assignedTo === undefined) v.assignedTo = session.user.id;
    }
    for (const key of ['status', 'priority', 'type']) {
      const f = FIELDS[entity].find((x) => x.key === key && !x.readOnly);
      if (!f || !FORM[entity].includes(key) || v[key]) continue;
      v[key] = key === 'priority' ? 'medium' : optionsOf(f.list, org.settings)[0]?.key;
    }
    return v;
  });
  const [custom, setCustom] = useState<Record<string, unknown>>(() => ({ ...(initial?.custom ?? {}) }));
  const [tagIds, setTagIds] = useState<string[]>(() => (initial?.tags ?? []).map((t: any) => t.id));
  const [contacts, setContacts] = useState<{ id: string; name: string }[]>(() => initial?.contacts ?? []);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: unknown) => setValues((x) => ({ ...x, [k]: v }));

  // Deals: the default pipeline and its first stage.
  useEffect(() => {
    if (entity !== 'deal' || values.pipelineId || !pipelines.length) return;
    const p = pipelines.find((x) => x.isDefault && !x.archived) ?? pipelines.find((x) => !x.archived);
    if (p) setValues((x) => ({ ...x, pipelineId: p.id, stageId: x.stageId ?? p.stages[0]?.id }));
  }, [entity, pipelines, values.pipelineId]);

  // Duplicate warning while typing (contacts, leads, companies).
  const probe = useDebounced(JSON.stringify({ email: values.email, phone: values.phone, firstName: values.firstName, lastName: values.lastName, name: values.name, website: values.website, companyName: values.companyName }), 500);
  const [dups, setDups] = useState<DuplicateDTO[]>([]);
  useEffect(() => {
    if (entity === 'deal' || entity === 'activity') return;
    const p = JSON.parse(probe);
    if (!Object.values(p).some((v) => typeof v === 'string' && v.trim().length >= 3)) return setDups([]);
    let live = true;
    post<DuplicateDTO[]>(crm(org.id, '/duplicates'), { entity, probe: p, excludeId: initial?.id ?? null })
      .then((r) => live && setDups(r))
      .catch(() => live && setDups([]));
    return () => {
      live = false;
    };
  }, [probe, entity, org.id, initial?.id]);

  const fields = useMemo(() => FORM[entity].map((k) => FIELDS[entity].find((f) => f.key === k)!).filter(Boolean), [entity]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const body: Values = {};
    for (const f of fields) {
      if (!(f.key in values)) continue;
      const v = values[f.key];
      if (['company', 'contact', 'deal', 'lead'].includes(f.type)) body[f.key] = v?.id ?? v ?? null;
      else body[f.key] = v === '' && ['date', 'time', 'money', 'int', 'percent', 'user'].includes(f.type) ? null : v;
    }
    if (entity !== 'activity' && cfs.length) body.custom = custom;
    if (!editing && entity !== 'activity') body.tagIds = tagIds;
    if (!editing && entity === 'deal' && contacts.length) body.contactIds = contacts.map((c) => c.id);
    if (editing) {
      // only what changed
      for (const k of Object.keys(body)) if (k !== 'custom' && JSON.stringify(body[k] ?? null) === JSON.stringify(refValue(initial![k]) ?? null)) delete body[k];
    }
    try {
      const path = crm(org.id, `/${ENTITY_PATH[entity]}${editing ? `/${initial!.id}` : ''}`);
      const row = editing ? await patch(path, body) : await post(path, body);
      if (editing && entity !== 'activity' && JSON.stringify(tagIds) !== JSON.stringify((initial?.tags ?? []).map((t: any) => t.id))) {
        const { put } = await import('../lib/api');
        await put(crm(org.id, `/${ENTITY_PATH[entity]}/${initial!.id}/tags`), { tagIds });
      }
      await refresh();
      toast(editing ? 'Saved' : `${ENTITY_LABELS[entity].one} created`);
      onSaved?.(row);
      onClose();
      if (!editing && !onSaved) navigate(recordPath(org.id, entity, row.id));
    } catch (err) {
      if (err instanceof ApiError && Array.isArray(err.details)) {
        setErrors(Object.fromEntries((err.details as { path: string; message: string }[]).map((d) => [d.path, d.message])));
      }
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      wide
      title={title ?? `${editing ? 'Edit' : 'New'} ${ENTITY_LABELS[entity].one.toLowerCase()}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="crm-record-form" className="btn primary" disabled={busy}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Create'}
          </button>
        </>
      }
    >
      <form id="crm-record-form" className="crm-form-grid" onSubmit={submit} noValidate>
        {dups.length ? (
          <div className="info-box crm-span" role="status">
            <strong>Possible duplicate.</strong>{' '}
            {dups.slice(0, 3).map((d, i) => (
              <span key={d.id}>
                {i ? '; ' : ''}
                <a href={`${document.baseURI.replace(/\/$/, '')}${recordPath(org.id, d.entity, d.id)}`} target="_blank" rel="noopener">
                  {d.name}
                </a>{' '}
                ({d.entity}, {d.reason.toLowerCase()})
              </span>
            ))}
            . You can still save.
          </div>
        ) : null}
        {fields.map((f) => (
          <FieldInput key={f.key} f={f} values={values} set={set} error={errors[f.key]} pipelines={pipelines} />
        ))}
        {entity === 'deal' && !editing ? (
          <div className="field crm-span">
            <label>Contacts on the deal</label>
            <div className="row wrap">
              {contacts.map((c) => (
                <span key={c.id} className="crm-tag">
                  {c.name}
                  <button type="button" className="btn ghost icon sm" aria-label={`Remove ${c.name}`} onClick={() => setContacts(contacts.filter((x) => x.id !== c.id))}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <RecordPicker entity="contact" value={null} onChange={(v) => v && !contacts.some((c) => c.id === v.id) && setContacts([...contacts, v])} placeholder="Add a contact" />
          </div>
        ) : null}
        {entity !== 'activity' ? (
          <div className="field crm-span">
            <label>Tags</label>
            <TagPicker value={tagIds} onChange={setTagIds} />
          </div>
        ) : null}
        {cfs.length ? (
          <>
            <h3 className="crm-span crm-form-section">More details</h3>
            <CustomFieldInputs fields={cfs} value={custom} onChange={setCustom} currency={org.currency} />
          </>
        ) : null}
      </form>
    </Modal>
  );
}

function refValue(v: any) {
  return v && typeof v === 'object' && 'id' in v ? v.id : v;
}

function FieldInput({ f, values, set, error, pipelines }: { f: FieldDef; values: Values; set: (k: string, v: unknown) => void; error?: string; pipelines: { id: string; name: string; archived: boolean; stages: { id: string; name: string; probability: number }[] }[] }) {
  const org = useCurrentOrg();
  const id = `crm-f-${f.key}`;
  const v = values[f.key];
  let input: React.ReactNode;
  switch (f.type) {
    case 'longtext':
      input = <textarea id={id} className="textarea" rows={4} value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} />;
      break;
    case 'enum':
      input = <OptionSelect id={id} options={optionsOf(f.list, org.settings)} value={v ?? ''} allowEmpty={!['status', 'priority', 'type'].includes(f.key)} emptyLabel="Not set" onChange={(x) => set(f.key, x)} />;
      break;
    case 'user':
      input = <UserSelect id={id} value={v ?? null} onChange={(x) => set(f.key, x)} />;
      break;
    case 'money':
      input = <MoneyInput id={id} currency={org.currency} value={v ?? null} onChange={(x) => set(f.key, x)} />;
      break;
    case 'date':
      input = <input id={id} className="input" type="date" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} />;
      break;
    case 'time':
      input = <input id={id} className="input" type="time" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} />;
      break;
    case 'int':
    case 'percent':
      input = <input id={id} className="input" type="number" min={0} max={f.type === 'percent' || f.key === 'score' ? 100 : undefined} placeholder={f.key === 'probability' ? 'From the stage' : undefined} value={v ?? ''} onChange={(e) => set(f.key, e.target.value === '' ? null : Number(e.target.value))} />;
      break;
    case 'company':
    case 'contact':
    case 'deal':
    case 'lead':
      input = <RecordPicker id={id} entity={f.type} value={v && typeof v === 'object' ? v : null} onChange={(x) => set(f.key, x)} />;
      break;
    case 'pipeline':
      input = (
        <select id={id} className="select" value={v ?? ''} onChange={(e) => {
          const p = pipelines.find((x) => x.id === e.target.value);
          set('pipelineId', e.target.value);
          set('stageId', p?.stages[0]?.id ?? null);
        }}>
          {pipelines.filter((p) => !p.archived || p.id === v).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      );
      break;
    case 'stage': {
      const p = pipelines.find((x) => x.id === values.pipelineId);
      input = (
        <select id={id} className="select" value={v ?? ''} onChange={(e) => set('stageId', e.target.value)}>
          {(p?.stages ?? []).map((s) => (
            <option key={s.id} value={s.id}>{s.name} ({s.probability}%)</option>
          ))}
        </select>
      );
      break;
    }
    case 'email':
      input = <input id={id} className="input" type="email" autoComplete="off" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} />;
      break;
    case 'url':
      input = <input id={id} className="input" type="url" placeholder="example.com" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} />;
      break;
    case 'phone':
      input = <input id={id} className="input" type="tel" value={v ?? ''} onChange={(e) => set(f.key, e.target.value)} />;
      break;
    default:
      input = <input id={id} className="input" value={v ?? ''} maxLength={f.maxLength} onChange={(e) => set(f.key, e.target.value)} required={f.required} />;
  }
  return (
    <div className={`field${WIDE.has(f.key) ? ' crm-span' : ''}`}>
      <label htmlFor={id}>
        {f.label}
        {f.required ? ' *' : ''}
      </label>
      {input}
      {error ? <span className="error">{error}</span> : null}
    </div>
  );
}
