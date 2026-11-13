// CRM settings of one organisation, and the person's own CRM preferences.
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, del, errorMessage, get, patch, post, put } from '../lib/api';
import { appUrl } from '../lib/base';
import { usePageTitle } from '../lib/hooks';
import { CURRENCIES } from '../../shared/money';
import { Icon } from '../components/ui/Icon';
import { EmptyState, Loading, PageHeader, Switch } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { LEAD_STATUS_KINDS, LIST_KEYS, LIST_LABELS, type ListKey, type ListOption } from '../../shared/crm/defaults';
import { CUSTOM_FIELD_TYPE_LABELS, CUSTOM_FIELD_TYPES, ENTITY_LABELS, RECORD_ENTITIES, type CustomFieldType, type RecordEntity } from '../../shared/crm/fields';
import { ACTION_LABELS as PERM_ACTION_LABELS, CONFIGURABLE_ROLES, CRM_ROLE_LABELS, MODULE_LABELS, type CrmModule, type CrmPerms } from '../../shared/crm/roles';
import type { CustomFieldDTO, EmailTemplateDTO, PipelineDTO, ProductDTO } from '../../shared/crm/types';
import { MoneyInput } from './ui';
import { crm, dateTime, useCurrentOrg, useCustomFields, useMoney, usePipelines, useRefreshOrg, useTags } from './lib';

const TABS = [
  { key: 'organisation', label: 'Organisation', icon: 'building', admin: true },
  { key: 'pipelines', label: 'Pipelines and stages', icon: 'kanban', settings: true },
  { key: 'fields', label: 'Custom fields', icon: 'form', settings: true },
  { key: 'lists', label: 'Statuses and lists', icon: 'list', settings: true },
  { key: 'tags', label: 'Tags', icon: 'hash', settings: true },
  { key: 'products', label: 'Products and services', icon: 'briefcase', settings: true },
  { key: 'templates', label: 'Email templates', icon: 'mail' },
  { key: 'permissions', label: 'Permissions', icon: 'shield', admin: true },
  { key: 'notifications', label: 'My notifications', icon: 'bell' },
  { key: 'calendar', label: 'Calendar feed', icon: 'calendar' },
  { key: 'integrations', label: 'Integrations', icon: 'plug' },
  { key: 'audit', label: 'Audit trail', icon: 'history', admin: true },
];

export function Settings() {
  const org = useCurrentOrg();
  const { tab = 'notifications' } = useParams();
  const admin = org.role === 'owner' || org.role === 'admin';
  const tabs = TABS.filter((t) => (t.admin ? admin : t.settings ? org.perms.settings.manage : true));
  const current = tabs.find((t) => t.key === tab) ? tab : tabs[0].key;
  usePageTitle('Settings');
  return (
    <div className="page crm-page">
      <PageHeader title="Settings" icon="settings" subtitle={`${org.name}: CRM settings, and your own preferences`} />
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings">
          {tabs.map((t) => (
            <NavLink key={t.key} to={`/o/${org.id}/settings/${t.key}`} className={() => `nav-item${current === t.key ? ' active' : ''}`}>
              <Icon name={t.icon} /> {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="stack-lg crm-settings-body">
          {current === 'organisation' ? <OrgSettings /> : null}
          {current === 'pipelines' ? <Pipelines /> : null}
          {current === 'fields' ? <CustomFields /> : null}
          {current === 'lists' ? <Lists /> : null}
          {current === 'tags' ? <Tags /> : null}
          {current === 'products' ? <Products /> : null}
          {current === 'templates' ? <Templates /> : null}
          {current === 'permissions' ? <Permissions /> : null}
          {current === 'notifications' ? <NotificationPrefs /> : null}
          {current === 'calendar' ? <CalendarFeed /> : null}
          {current === 'integrations' ? <Integrations /> : null}
          {current === 'audit' ? <Audit /> : null}
        </div>
      </div>
    </div>
  );
}

function OrgSettings() {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const logo = useRef<HTMLInputElement>(null);
  const [f, setF] = useState({ name: org.name, industry: org.industry, website: org.website, phone: org.phone, email: org.email, address: org.address, country: org.country, description: org.description, currency: org.currency, timezone: org.timezone });
  const [money, setMoney] = useState({ highValueDeal: org.settings.highValueDeal, closingSoonDays: org.settings.closingSoonDays });
  const [deleting, setDeleting] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patch(crm(org.id), { ...f, settings: money });
      toast('Saved');
      await refresh();
      await qc.invalidateQueries({ queryKey: ['crm', 'orgs'] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const zones = (Intl as any).supportedValuesOf ? ((Intl as any).supportedValuesOf('timeZone') as string[]) : [org.timezone];
  return (
    <>
      <form className="card card-pad stack" onSubmit={save}>
        <div className="row">
          <button type="button" className="crm-avatar" onClick={() => logo.current?.click()} aria-label="Change the organisation's logo">
            {org.logoUrl ? <img className="crm-avatar-img" src={appUrl(org.logoUrl)} alt="" /> : <span className="crm-avatar-icon"><Icon name="building" size={22} /></span>}
          </button>
          <input ref={logo} type="file" hidden accept="image/png,image/jpeg,image/gif,image/webp" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const form = new FormData();
            form.set('file', file);
            try {
              await api(crm(org.id, '/logo'), { method: 'POST', form });
              await refresh();
              await qc.invalidateQueries({ queryKey: ['crm', 'orgs'] });
            } catch (err) {
              toast(errorMessage(err), 'error');
            }
          }} />
          <p className="muted small">Your organisation's logo (PNG, JPEG, GIF or WebP, up to 5 MB).</p>
        </div>
        <div className="crm-form-grid">
          {(['name', 'industry', 'website', 'phone', 'email', 'country'] as const).map((k) => (
            <div className="field" key={k}><label htmlFor={`org-${k}`}>{{ name: 'Name', industry: 'Industry', website: 'Website', phone: 'Phone', email: 'Email', country: 'Country' }[k]}</label><input id={`org-${k}`} className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
          ))}
          <div className="field crm-span"><label htmlFor="org-address">Address</label><input id="org-address" className="input" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
          <div className="field crm-span"><label htmlFor="org-desc">About the business</label><textarea id="org-desc" className="textarea" rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
          <div className="field"><label htmlFor="org-cur">Currency</label><select id="org-cur" className="select" value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}: {c.name}</option>)}</select><span className="hint">Fixed once the organisation has deals.</span></div>
          <div className="field"><label htmlFor="org-tz">Time zone</label><select id="org-tz" className="select" value={f.timezone} onChange={(e) => setF({ ...f, timezone: e.target.value })}>{[...new Set(['UTC', org.timezone, ...zones])].map((z) => <option key={z} value={z}>{z}</option>)}</select><span className="hint">Today, overdue and calendar times follow it.</span></div>
          <div className="field"><label htmlFor="org-hv">High-value deal from</label><MoneyInput id="org-hv" currency={org.currency} value={money.highValueDeal} onChange={(v) => setMoney({ ...money, highValueDeal: v ?? 0 })} /></div>
          <div className="field"><label htmlFor="org-cs">"Closing soon" means within (days)</label><input id="org-cs" className="input" type="number" min={1} max={365} value={money.closingSoonDays} onChange={(e) => setMoney({ ...money, closingSoonDays: Number(e.target.value) })} /></div>
        </div>
        <div><button className="btn primary" type="submit">Save</button></div>
      </form>
      {org.role === 'owner' ? (
        <section className="card card-pad stack crm-danger-zone">
          <h2 className="crm-subhead">Delete the organisation</h2>
          <p className="muted small">Every member loses access at once and pending invitations stop working. The records stay stored and can be recovered by a BIZOMAT operator on request.</p>
          <div><button className="btn danger" onClick={() => setDeleting(true)}>Delete {org.name}</button></div>
        </section>
      ) : null}
      {deleting ? <DeleteOrg onClose={() => setDeleting(false)} onDone={async () => { await qc.invalidateQueries({ queryKey: ['crm', 'orgs'] }); navigate('/'); }} /> : null}
    </>
  );
}

function DeleteOrg({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const [name, setName] = useState('');
  return (
    <Modal title={`Delete ${org.name}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn danger" disabled={name !== org.name} onClick={async () => { try { await del(crm(org.id), { confirmName: name }); onDone(); } catch (e) { toast(errorMessage(e), 'error'); } }}>Delete</button></>}>
      <div className="field"><label htmlFor="del-name">Type the organisation's name to confirm</label><input id="del-name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
    </Modal>
  );
}

// ------------------------------------------------------------------ pipelines

function Pipelines() {
  const org = useCurrentOrg();
  const q = usePipelines();
  const [editing, setEditing] = useState<PipelineDTO | 'new' | null>(null);
  if (!q.data) return <Loading />;
  return (
    <>
      <div className="row"><p className="muted grow">Each pipeline has its own stages; a stage's probability gives a deal's weighted value unless the deal sets its own.</p><button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" /> New pipeline</button></div>
      {q.data.map((p) => (
        <section key={p.id} className="card card-pad stack">
          <div className="row">
            <strong className="grow">{p.name}</strong>
            {p.isDefault ? <span className="badge accent">Default</span> : null}
            {p.archived ? <span className="badge">Archived</span> : null}
            <button className="btn sm" onClick={() => setEditing(p)}><Icon name="edit" size={14} /> Edit</button>
          </div>
          <ol className="crm-stage-list">
            {p.stages.map((s) => <li key={s.id}>{s.name} <span className="muted small">{s.probability}%{s.rotDays ? `, stale after ${s.rotDays} days` : ''}</span></li>)}
          </ol>
        </section>
      ))}
      {editing ? <PipelineDialog pipeline={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => q.refetch()} /> : null}
      <p className="muted small">{org.name} can have up to 50 pipelines.</p>
    </>
  );
}

function PipelineDialog({ pipeline, onClose, onSaved }: { pipeline: PipelineDTO | null; onClose: () => void; onSaved: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const [name, setName] = useState(pipeline?.name ?? '');
  const [stages, setStages] = useState(pipeline?.stages.map((s) => ({ id: s.id as string | undefined, name: s.name, probability: s.probability, rotDays: s.rotDays })) ?? [{ id: undefined, name: 'New', probability: 10, rotDays: null }, { id: undefined, name: 'In progress', probability: 50, rotDays: null }]);
  const [isDefault, setIsDefault] = useState(pipeline?.isDefault ?? false);
  const [archived, setArchived] = useState(pipeline?.archived ?? false);
  const [moveTo, setMoveTo] = useState<Record<string, string>>({});
  const [needsMove, setNeedsMove] = useState<{ stageId: string; count: number } | null>(null);
  const save = async () => {
    try {
      if (pipeline) await put(crm(org.id, `/pipelines/${pipeline.id}`), { name, stages, isDefault, archived, moveDealsTo: moveTo });
      else await post(crm(org.id, '/pipelines'), { name, stages: stages.map(({ id: _id, ...s }) => s) });
      toast('Pipeline saved');
      onSaved();
      onClose();
    } catch (e: any) {
      if (e?.details?.code === 'STAGE_HAS_DEALS') setNeedsMove({ stageId: e.details.stageId, count: e.details.count });
      else toast(errorMessage(e), 'error');
    }
  };
  const move = (i: number, d: number) => {
    const s = [...stages];
    const [x] = s.splice(i, 1);
    s.splice(i + d, 0, x);
    setStages(s);
  };
  const removed = pipeline?.stages.find((s) => s.id === needsMove?.stageId);
  return (
    <Modal wide title={pipeline ? `Edit ${pipeline.name}` : 'New pipeline'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!name.trim() || !stages.length || stages.some((s) => !s.name.trim())} onClick={save}>Save</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="pl-name">Name</label><input id="pl-name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <table className="data-table">
          <thead><tr><th>Stage</th><th>Probability (%)</th><th>Stale after (days)</th><th aria-label="Order" /></tr></thead>
          <tbody>
            {stages.map((s, i) => (
              <tr key={i}>
                <td><input className="input sm" aria-label="Stage name" value={s.name} onChange={(e) => setStages(stages.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} /></td>
                <td><input className="input sm crm-num" type="number" min={0} max={100} aria-label="Probability" value={s.probability} onChange={(e) => setStages(stages.map((x, j) => (j === i ? { ...x, probability: Number(e.target.value) } : x)))} /></td>
                <td><input className="input sm crm-num" type="number" min={1} max={365} aria-label="Stale after days" value={s.rotDays ?? ''} onChange={(e) => setStages(stages.map((x, j) => (j === i ? { ...x, rotDays: e.target.value ? Number(e.target.value) : null } : x)))} /></td>
                <td className="row">
                  <button className="btn ghost icon sm" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><Icon name="chevronLeft" size={12} /></button>
                  <button className="btn ghost icon sm" aria-label="Move down" disabled={i === stages.length - 1} onClick={() => move(i, 1)}><Icon name="chevronRight" size={12} /></button>
                  <button className="btn ghost icon sm" aria-label="Remove stage" disabled={stages.length === 1} onClick={() => setStages(stages.filter((_, j) => j !== i))}><Icon name="trash" size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div><button className="btn sm" onClick={() => setStages([...stages, { id: undefined, name: '', probability: 50, rotDays: null }])}><Icon name="plus" size={14} /> Add a stage</button></div>
        {needsMove && removed ? (
          <div className="info-box">
            “{removed.name}” has {needsMove.count} deal{needsMove.count === 1 ? '' : 's'}. Move them to{' '}
            <select className="select sm" aria-label="Move deals to" value={moveTo[removed.id] ?? ''} onChange={(e) => setMoveTo({ ...moveTo, [removed.id]: e.target.value })}>
              <option value="">Choose a stage</option>
              {stages.filter((s) => s.id).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>{' '}
            and save again.
          </div>
        ) : null}
        {pipeline ? (
          <>
            <label className="checkbox"><input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} /> Default pipeline (new deals start here)</label>
            <label className="checkbox"><input type="checkbox" checked={archived} disabled={pipeline.isDefault} onChange={(e) => setArchived(e.target.checked)} /> Archived (hidden from the board; its deals stay)</label>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ custom fields

function CustomFields() {
  const org = useCurrentOrg();
  const toast = useToast();
  const q = useCustomFields();
  const [entity, setEntity] = useState<RecordEntity>('contact');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<CustomFieldType>('text');
  const [options, setOptions] = useState('');
  const [required, setRequired] = useState(false);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post(crm(org.id, '/custom-fields'), { entity, label, type, required, options: type === 'select' || type === 'multiselect' ? options.split(/\n|,/).map((s) => s.trim()).filter(Boolean) : undefined });
      setLabel('');
      setOptions('');
      q.refetch();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const toggle = async (f: CustomFieldDTO, body: Record<string, unknown>) => {
    try {
      await patch(crm(org.id, `/custom-fields/${f.id}`), body);
      q.refetch();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <>
      <form className="card card-pad stack" onSubmit={add}>
        <h2 className="crm-subhead">Add a field</h2>
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="cf-entity">For</label><select id="cf-entity" className="select" value={entity} onChange={(e) => setEntity(e.target.value as RecordEntity)}>{RECORD_ENTITIES.map((x) => <option key={x} value={x}>{ENTITY_LABELS[x].many}</option>)}</select></div>
          <div className="field"><label htmlFor="cf-type">Type</label><select id="cf-type" className="select" value={type} onChange={(e) => setType(e.target.value as CustomFieldType)}>{CUSTOM_FIELD_TYPES.map((t) => <option key={t} value={t}>{CUSTOM_FIELD_TYPE_LABELS[t]}</option>)}</select></div>
          <div className="field crm-span"><label htmlFor="cf-label">Label</label><input id="cf-label" className="input" required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="For example: Contract number, Region, Renewal date" /></div>
          {type === 'select' || type === 'multiselect' ? <div className="field crm-span"><label htmlFor="cf-opts">Choices (one per line)</label><textarea id="cf-opts" className="textarea" rows={3} value={options} onChange={(e) => setOptions(e.target.value)} /></div> : null}
        </div>
        <label className="checkbox"><input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} /> Required on new records</label>
        <div><button className="btn primary" type="submit" disabled={!label.trim()}>Add field</button></div>
      </form>
      {RECORD_ENTITIES.map((e) => {
        const list = (q.data ?? []).filter((f) => f.entity === e);
        if (!list.length) return null;
        return (
          <section key={e} className="card">
            <h2 className="crm-subhead card-pad">{ENTITY_LABELS[e].many}</h2>
            <table className="data-table">
              <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>In use</th></tr></thead>
              <tbody>
                {list.map((f) => (
                  <tr key={f.id} className={f.archived ? 'muted' : undefined}>
                    <td>{f.label}{f.options.length ? <div className="muted small">{f.options.join(', ')}</div> : null}</td>
                    <td>{CUSTOM_FIELD_TYPE_LABELS[f.type]}</td>
                    <td><Switch checked={f.required} label={`${f.label} required`} onChange={(v) => toggle(f, { required: v })} /></td>
                    <td><Switch checked={!f.archived} label={`${f.label} in use`} onChange={(v) => toggle(f, { archived: !v })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
      {!q.data?.length ? <EmptyState icon="form" title="No custom fields yet">Add the details your business tracks: for engineering firms a project number, for manufacturers a part family, and so on.</EmptyState> : null}
    </>
  );
}

// ------------------------------------------------------------------ lists

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'option';
}

function Lists() {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const [which, setWhich] = useState<ListKey>('leadStatuses');
  const [items, setItems] = useState<ListOption[]>(org.settings[which]);
  useEffect(() => setItems(org.settings[which]), [which, org.settings]);
  const save = async () => {
    try {
      await patch(crm(org.id), { settings: { [which]: items } });
      toast('Saved');
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section className="card card-pad stack">
      <div className="row wrap">
        <select className="select" aria-label="List" value={which} onChange={(e) => setWhich(e.target.value as ListKey)}>
          {LIST_KEYS.map((k) => <option key={k} value={k}>{LIST_LABELS[k]}</option>)}
        </select>
        <span className="muted small grow">Records keep their value when an option is archived; it is no longer offered for new ones.</span>
      </div>
      <table className="data-table">
        <thead><tr><th>Label</th>{which === 'leadStatuses' ? <th>Counts as</th> : null}<th>Colour</th><th>Offered</th></tr></thead>
        <tbody>
          {items.map((o, i) => (
            <tr key={o.key}>
              <td><input className="input sm" aria-label="Label" value={o.label} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} /><div className="muted small mono">{o.key}</div></td>
              {which === 'leadStatuses' ? (
                <td>
                  <select className="select sm" aria-label="Counts as" value={o.kind ?? 'open'} disabled={o.key === 'converted'} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, kind: e.target.value } : x)))}>
                    {LEAD_STATUS_KINDS.filter((k) => k !== 'converted' || o.key === 'converted').map((k) => <option key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</option>)}
                  </select>
                </td>
              ) : null}
              <td><input type="color" aria-label="Colour" value={o.color ?? '#0f766e'} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, color: e.target.value } : x)))} /></td>
              <td><Switch checked={!o.archived} disabled={o.key === 'converted'} label={`${o.label} offered`} onChange={(v) => setItems(items.map((x, j) => (j === i ? { ...x, archived: !v || undefined } : x)))} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row">
        <button className="btn sm" onClick={() => {
          const label = window.prompt('Name of the new option');
          if (!label?.trim()) return;
          let key = slug(label);
          while (items.some((x) => x.key === key)) key = `${key}_2`.slice(0, 40);
          setItems([...items, { key, label: label.trim(), ...(which === 'leadStatuses' ? { kind: 'open' } : {}) }]);
        }}><Icon name="plus" size={14} /> Add an option</button>
        <span className="grow" />
        <button className="btn primary" onClick={save}>Save</button>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ tags

function Tags() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useTags();
  const [name, setName] = useState('');
  return (
    <section className="card card-pad stack">
      <form className="row" onSubmit={async (e) => { e.preventDefault(); try { await post(crm(org.id, '/tags'), { name }); setName(''); q.refetch(); } catch (err) { toast(errorMessage(err), 'error'); } }}>
        <input className="input" aria-label="New tag" placeholder="New tag" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn primary" disabled={!name.trim()}>Add</button>
      </form>
      <table className="data-table">
        <thead><tr><th>Tag</th><th>Colour</th><th>Used on</th><th aria-label="Delete" /></tr></thead>
        <tbody>
          {(q.data ?? []).map((t) => (
            <tr key={t.id}>
              <td><input className="input sm" aria-label="Tag name" defaultValue={t.name} onBlur={async (e) => { if (e.target.value !== t.name) { await patch(crm(org.id, `/tags/${t.id}`), { name: e.target.value }).catch((err) => toast(errorMessage(err), 'error')); q.refetch(); } }} /></td>
              <td><input type="color" aria-label="Colour" defaultValue={t.color} onChange={async (e) => { await patch(crm(org.id, `/tags/${t.id}`), { color: e.target.value }).catch(() => null); q.refetch(); }} /></td>
              <td className="small">{t.uses} records</td>
              <td><button className="btn ghost icon sm" aria-label={`Delete ${t.name}`} onClick={async () => { if (await confirm({ title: `Delete the tag “${t.name}”?`, message: 'It is removed from every record.', confirmLabel: 'Delete', danger: true })) { await del(crm(org.id, `/tags/${t.id}`)); q.refetch(); } }}><Icon name="trash" size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// ------------------------------------------------------------------ products

function Products() {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const toast = useToast();
  const q = useQuery({ queryKey: ['crm', org.id, 'products'], queryFn: () => get<ProductDTO[]>(crm(org.id, '/products')) });
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [sku, setSku] = useState('');
  return (
    <section className="card card-pad stack">
      <form className="row wrap" onSubmit={async (e) => { e.preventDefault(); try { await post(crm(org.id, '/products'), { name, sku, unitPrice: price ?? 0 }); setName(''); setSku(''); setPrice(null); q.refetch(); } catch (err) { toast(errorMessage(err), 'error'); } }}>
        <input className="input" aria-label="Product or service" placeholder="Product or service" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" aria-label="Code" placeholder="Code (optional)" value={sku} onChange={(e) => setSku(e.target.value)} />
        <MoneyInput currency={org.currency} ariaLabel="Unit price" value={price} onChange={setPrice} />
        <button className="btn primary" disabled={!name.trim()}>Add</button>
      </form>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Code</th><th>Unit price</th><th>Offered</th></tr></thead>
        <tbody>
          {(q.data ?? []).map((p) => (
            <tr key={p.id} className={p.active ? undefined : 'muted'}>
              <td>{p.name}</td>
              <td className="small mono">{p.sku}</td>
              <td className="crm-num-cell">{fmt(p.unitPrice)}</td>
              <td><Switch checked={p.active} label={`${p.name} offered`} onChange={async (v) => { await patch(crm(org.id, `/products/${p.id}`), { active: v }).catch((err) => toast(errorMessage(err), 'error')); q.refetch(); }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// ------------------------------------------------------------------ email templates

function Templates() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['crm', org.id, 'email-templates'], queryFn: () => get<EmailTemplateDTO[]>(crm(org.id, '/email-templates')) });
  const [editing, setEditing] = useState<EmailTemplateDTO | 'new' | null>(null);
  return (
    <>
      <div className="row"><p className="muted grow">Templates fill in an email you then send from your own mail program. Placeholders: {'{{first_name}}'}, {'{{contact}}'}, {'{{company}}'}, {'{{deal}}'}.</p>{org.perms.activities.create ? <button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" /> New template</button> : null}</div>
      {(q.data ?? []).map((t) => (
        <section key={t.id} className="card card-pad stack">
          <div className="row"><strong className="grow">{t.name}</strong>{t.shared ? <span className="badge accent">Shared</span> : <span className="badge">Only me</span>}{t.mine || org.perms.settings.manage ? <><button className="btn sm" onClick={() => setEditing(t)}>Edit</button><button className="btn ghost icon sm" aria-label={`Delete ${t.name}`} onClick={async () => { if (await confirm({ title: `Delete “${t.name}”?`, confirmLabel: 'Delete', danger: true })) { await del(crm(org.id, `/email-templates/${t.id}`)); q.refetch(); } }}><Icon name="trash" size={14} /></button></> : null}</div>
          <div className="small"><strong>{t.subject}</strong></div>
          <div className="crm-text small muted">{t.body}</div>
        </section>
      ))}
      {q.data && !q.data.length ? <EmptyState icon="mail" title="No templates yet" /> : null}
      {editing ? <TemplateDialog t={editing === 'new' ? null : editing} canShare={org.perms.settings.manage} onClose={() => setEditing(null)} onSave={async (b) => { try { if (editing === 'new') await post(crm(org.id, '/email-templates'), b); else await patch(crm(org.id, `/email-templates/${editing.id}`), b); setEditing(null); q.refetch(); } catch (e) { toast(errorMessage(e), 'error'); } }} /> : null}
    </>
  );
}

function TemplateDialog({ t, canShare, onClose, onSave }: { t: EmailTemplateDTO | null; canShare: boolean; onClose: () => void; onSave: (b: { name: string; subject: string; body: string; shared: boolean }) => void }) {
  const [b, setB] = useState({ name: t?.name ?? '', subject: t?.subject ?? '', body: t?.body ?? '', shared: t?.shared ?? false });
  return (
    <Modal wide title={t ? `Edit ${t.name}` : 'New template'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!b.name.trim() || !b.subject.trim()} onClick={() => onSave(b)}>Save</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="tp-name">Name</label><input id="tp-name" className="input" value={b.name} onChange={(e) => setB({ ...b, name: e.target.value })} /></div>
        <div className="field"><label htmlFor="tp-subject">Subject</label><input id="tp-subject" className="input" value={b.subject} onChange={(e) => setB({ ...b, subject: e.target.value })} /></div>
        <div className="field"><label htmlFor="tp-body">Message</label><textarea id="tp-body" className="textarea" rows={8} value={b.body} onChange={(e) => setB({ ...b, body: e.target.value })} /></div>
        {canShare ? <label className="checkbox"><input type="checkbox" checked={b.shared} onChange={(e) => setB({ ...b, shared: e.target.checked })} /> Share with the organisation</label> : null}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ permissions

function Permissions() {
  const org = useCurrentOrg();
  const toast = useToast();
  const q = useQuery({ queryKey: ['crm', org.id, 'permissions'], queryFn: () => get<{ roles: Record<string, CrmPerms>; modules: { module: CrmModule; actions: { action: string; kind: 'scope' | 'bool' }[] }[] }>(crm(org.id, '/permissions')) });
  const [role, setRole] = useState<(typeof CONFIGURABLE_ROLES)[number]>('sales');
  if (!q.data) return <Loading />;
  const perms = q.data.roles[role];
  const set = async (module: CrmModule, action: string, value: unknown) => {
    try {
      await put(crm(org.id, `/permissions/${role}`), { [module]: { ...(perms[module] as unknown as Record<string, unknown>), [action]: value } });
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section className="card card-pad stack">
      <div className="row wrap">
        <label className="row">Role <select className="select" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>{CONFIGURABLE_ROLES.map((r) => <option key={r} value={r}>{CRM_ROLE_LABELS[r]}</option>)}</select></label>
        <span className="grow" />
        <button className="btn sm" onClick={async () => { await del(crm(org.id, `/permissions/${role}`)); q.refetch(); toast('Back to the defaults'); }}>Restore the defaults</button>
      </div>
      <p className="muted small">The owner and administrators always have every permission. "Own" means records the person owns (activities: assigned to or created by them). The server enforces every setting.</p>
      <div className="crm-table-scroll">
        <table className="data-table crm-perm-table">
          <thead><tr><th>Area</th><th>Permissions</th></tr></thead>
          <tbody>
            {q.data.modules.map(({ module, actions }) => (
              <tr key={module}>
                <th scope="row">{MODULE_LABELS[module]}</th>
                <td>
                  <div className="row wrap">
                    {actions.map(({ action, kind }) => {
                      const v = (perms[module] as unknown as Record<string, unknown>)[action];
                      return kind === 'scope' ? (
                        <label key={action} className="row small crm-perm">
                          {PERM_ACTION_LABELS[action]}
                          <select className="select sm" value={String(v)} onChange={(e) => set(module, action, e.target.value)}>
                            <option value="all">All</option>
                            <option value="own">Own</option>
                            <option value="none">None</option>
                          </select>
                        </label>
                      ) : (
                        <label key={action} className="checkbox small crm-perm"><input type="checkbox" checked={!!v} onChange={(e) => set(module, action, e.target.checked)} /> {PERM_ACTION_LABELS[action]}</label>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ notifications

function NotificationPrefs() {
  const toast = useToast();
  const q = useQuery({ queryKey: ['crm', 'notification-prefs'], queryFn: () => get<{ type: string; label: string; inApp: boolean; email: boolean }[]>('/crm/me/notification-prefs') });
  if (!q.data) return <Loading />;
  const save = async (list: typeof q.data) => {
    try {
      await put('/crm/me/notification-prefs', list.map(({ type, inApp, email }) => ({ type, inApp, email })));
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section className="card card-pad stack">
      <p className="muted small">For you, in every CRM organisation you belong to. Email goes out only while BIZOMAT's email service is connected.</p>
      <table className="data-table">
        <thead><tr><th>Notification</th><th>In BIZOMAT</th><th>By email</th></tr></thead>
        <tbody>
          {q.data.map((p) => (
            <tr key={p.type}>
              <td>{p.label}</td>
              <td><Switch checked={p.inApp} label={`${p.label} in BIZOMAT`} onChange={(v) => save(q.data!.map((x) => (x.type === p.type ? { ...x, inApp: v } : x)))} /></td>
              <td><Switch checked={p.email} label={`${p.label} by email`} onChange={(v) => save(q.data!.map((x) => (x.type === p.type ? { ...x, email: v } : x)))} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function CalendarFeed() {
  const org = useCurrentOrg();
  const toast = useToast();
  const q = useQuery({ queryKey: ['crm', org.id, 'calendar-feed'], queryFn: () => get<{ active: boolean; createdAt?: number; lastUsedAt?: number | null }>(crm(org.id, '/calendar-feed')) });
  const [url, setUrl] = useState<string | null>(null);
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">Your CRM activities in your own calendar</h2>
      <p>Subscribe to a private address in Google Calendar ("From URL"), Outlook ("Subscribe from web") or Apple Calendar. It lists the activities assigned to you in {org.name} that have a date, from 30 days ago onwards, and updates as they change (calendar programs refresh it every few hours).</p>
      <p className="muted small">Anyone with the address can read those activities' titles and times: keep it private. Making a new address stops the old one.</p>
      {q.data?.active ? <p className="small">An address is active since {dateTime(q.data.createdAt)}{q.data.lastUsedAt ? `, last read ${dateTime(q.data.lastUsedAt)}` : ', not read yet'}.</p> : null}
      {url ? (
        <div className="row"><input className="input" readOnly value={url} aria-label="Calendar address" onFocus={(e) => e.target.select()} /><button className="btn" onClick={() => navigator.clipboard?.writeText(url).then(() => toast('Address copied'))}>Copy</button></div>
      ) : null}
      <div className="row">
        <button className="btn primary" onClick={async () => { try { const r = await post<{ url: string }>(crm(org.id, '/calendar-feed')); setUrl(r.url); q.refetch(); } catch (e) { toast(errorMessage(e), 'error'); } }}>{q.data?.active ? 'Make a new address' : 'Make my calendar address'}</button>
        {q.data?.active ? <button className="btn" onClick={async () => { await del(crm(org.id, '/calendar-feed')); setUrl(null); q.refetch(); }}>Stop the address</button> : null}
      </div>
    </section>
  );
}

function Integrations() {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['crm', 'integrations'], queryFn: () => get<{ mailbox: { id: string; name: string; configured: boolean; requirement: string }[] }>('/crm/integrations') });
  return (
    <>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Email</h2>
        <ul className="crm-integrations">
          <li><span className="badge success">Working</span> <strong>Logging emails</strong>: write from a template, send from your own mail program, and the email is logged on the customer's timeline.</li>
          <li><span className={`badge ${org.emailConnected ? 'success' : ''}`}>{org.emailConnected ? 'Connected' : 'Not connected'}</span> <strong>BIZOMAT notifications and invitations by email</strong>: {org.emailConnected ? 'sent through BIZOMAT\'s email service.' : 'the platform\'s email service is not set up, so invitations show a link to share and notifications stay in the app.'}</li>
          {(q.data?.mailbox ?? []).map((m) => (
            <li key={m.id}><span className="badge">Not available</span> <strong>{m.name} synchronisation</strong>: {m.requirement}</li>
          ))}
        </ul>
      </section>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Calendar</h2>
        <ul className="crm-integrations">
          <li><span className="badge success">Working</span> <strong>Add to calendar</strong>: every dated activity downloads as an .ics file.</li>
          <li><span className="badge success">Working</span> <strong>Calendar feed</strong>: a private subscription address for your activities (Settings, Calendar feed).</li>
        </ul>
      </section>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Project Management</h2>
        <ul className="crm-integrations">
          <li><span className="badge success">Working</span> <strong>Project tasks</strong>: turn any activity into a task in a BIZOMAT Project Management project you can add tasks to; the task links back here.</li>
        </ul>
      </section>
    </>
  );
}

function Audit() {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['crm', org.id, 'audit'], queryFn: () => get<{ id: string; action: string; actorName: string | null; targetType: string | null; metadata: Record<string, unknown>; after: unknown; createdAt: number }[]>(crm(org.id, '/audit')) });
  if (!q.data) return <Loading />;
  return (
    <section className="card">
      <div className="crm-table-scroll">
        <table className="data-table">
          <thead><tr><th>When</th><th>Who</th><th>What</th><th>Details</th></tr></thead>
          <tbody>
            {q.data.map((e) => (
              <tr key={e.id}>
                <td className="small">{dateTime(e.createdAt)}</td>
                <td className="small">{e.actorName ?? 'System'}</td>
                <td className="small mono">{e.action}</td>
                <td className="small muted">{[e.after ? JSON.stringify(e.after).slice(0, 160) : '', Object.keys(e.metadata ?? {}).length ? JSON.stringify(e.metadata).slice(0, 120) : ''].filter(Boolean).join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
