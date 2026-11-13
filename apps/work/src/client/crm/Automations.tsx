// Automations: Trigger -> Conditions -> Actions. Only what the engine runs can be chosen; every execution is listed
// in the history.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { del, errorMessage, get, post, put } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, Loading, PageHeader, Switch } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { ACTION_LABELS, CONDITION_FIELDS, PRESETS, RECIPIENT_LABELS, TRIGGERS, actionsFor, type AutomationAction, type AutomationCondition, type Recipient, type TriggerConfig, type TriggerType } from '../../shared/crm/automations';
import { PRIORITIES } from '../../shared/crm/defaults';
import type { AutomationDTO, AutomationRunDTO } from '../../shared/crm/types';
import { MoneyInput, OptionSelect, UserSelect } from './ui';
import { crm, dateTime, recordPath, useCurrentOrg, useMoney, usePeople, usePipelines } from './lib';
import { Link } from 'react-router-dom';

function describe(a: AutomationDTO, stageName: (id?: string | null) => string, fmt: (n: number) => string, people: (id: string) => string) {
  const t = TRIGGERS[a.trigger].label;
  const when = [
    a.trigger === 'deal.stage_changed' && a.config.stageId ? `(${stageName(a.config.stageId)})` : '',
    a.trigger === 'deal.closed' && a.config.outcome && a.config.outcome !== 'any' ? `(${a.config.outcome})` : '',
    a.trigger === 'deal.closing_soon' ? `(${a.config.days ?? 7} days before)` : '',
  ].join('');
  const conds = a.conditions.map((c) => `${c.field} ${c.op} ${c.field === 'value' || c.field === 'estimatedValue' ? fmt(Number(c.value)) : c.value ?? ''}`).join(' and ');
  const acts = a.actions.map((x) => (x.type === 'notify' ? `notify ${x.to === 'users' ? (x.userIds ?? []).map(people).join(', ') : RECIPIENT_LABELS[x.to].toLowerCase()}` : x.type === 'create_activity' ? `create “${x.title}” due in ${x.dueInDays} days` : x.type === 'set_priority' ? `set priority to ${x.priority}` : x.type === 'flag_deal' ? 'flag the deal' : `assign to ${people(x.userId)}`)).join(', then ');
  return `${t} ${when}${conds ? `, if ${conds}` : ''}: ${acts}.`;
}

export function Automations() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const { fmt } = useMoney();
  const people = usePeople();
  const pipelines = usePipelines().data ?? [];
  const [tab, setTab] = useState<'list' | 'history'>('list');
  const [editing, setEditing] = useState<AutomationDTO | 'new' | null>(null);
  usePageTitle('Automations');
  const q = useQuery({ queryKey: ['crm', org.id, 'automations'], queryFn: () => get<{ automations: AutomationDTO[] }>(crm(org.id, '/automations')), enabled: org.perms.automations.view });
  const runs = useQuery({ queryKey: ['crm', org.id, 'automation-runs'], queryFn: () => get<AutomationRunDTO[]>(crm(org.id, '/automation-runs')), enabled: org.perms.automations.view && tab === 'history' });
  const stageName = (id?: string | null) => pipelines.flatMap((p) => p.stages).find((s) => s.id === id)?.name ?? 'a stage';
  if (!org.perms.automations.view) return <div className="page"><EmptyState icon="bolt" title="Your role does not include automations" /></div>;
  const manage = org.perms.automations.manage;
  const toggle = async (a: AutomationDTO) => {
    try {
      await post(crm(org.id, `/automations/${a.id}/enabled`), { enabled: !a.enabled });
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="page crm-page">
      <PageHeader title="Automations" icon="bolt" subtitle="Notifications, follow-ups and flags that happen by themselves when something changes." actions={manage ? <button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" /> New automation</button> : null} />
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'list'} className={`tab${tab === 'list' ? ' active' : ''}`} onClick={() => setTab('list')}>Automations</button>
        <button role="tab" aria-selected={tab === 'history'} className={`tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>Execution history</button>
      </div>
      {tab === 'list' ? (
        !q.data ? (
          <Loading />
        ) : (
          <div className="stack crm-pad-top">
            {q.data.automations.map((a) => (
              <article key={a.id} className="card card-pad row crm-auto">
                <Switch checked={a.enabled} disabled={!manage} label={`${a.name}: ${a.enabled ? 'on' : 'off'}`} onChange={() => toggle(a)} />
                <div className="grow">
                  <strong>{a.name}</strong>
                  <div className="muted small">{describe(a, stageName, fmt, people.name)}</div>
                  <div className="muted small">{a.runCount} runs{a.lastRunAt ? `, last ${timeAgo(a.lastRunAt)}` : ''}</div>
                </div>
                {manage ? (
                  <>
                    <button className="btn sm" onClick={() => setEditing(a)}><Icon name="edit" size={14} /> Edit</button>
                    <button className="btn ghost icon sm" aria-label={`Delete ${a.name}`} onClick={async () => { if (await confirm({ title: `Delete “${a.name}”?`, message: 'Its history is deleted too.', confirmLabel: 'Delete', danger: true })) { await del(crm(org.id, `/automations/${a.id}`)).catch((e) => toast(errorMessage(e), 'error')); q.refetch(); } }}><Icon name="trash" size={14} /></button>
                  </>
                ) : null}
              </article>
            ))}
            {!q.data.automations.length ? <EmptyState icon="bolt" title="No automations">Start from a template or build your own.</EmptyState> : null}
            {manage ? (
              <section className="card card-pad">
                <h2 className="crm-subhead">Templates</h2>
                <div className="crm-presets">
                  {PRESETS.map((p) => (
                    <button key={p.key} className="tile" onClick={() => setEditing({ id: '', name: p.name, description: p.description, trigger: p.trigger, config: JSON.parse(JSON.stringify(p.config).replace('"{proposalStage}"', 'null')), conditions: JSON.parse(JSON.stringify(p.conditions).replace('"{highValue}"', String(org.settings.highValueDeal))), actions: p.actions, enabled: true, preset: p.key, runCount: 0, lastRunAt: null, createdAt: 0 })}>
                      <strong>{p.name}</strong>
                      <span className="muted small">{p.description}</span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )
      ) : !runs.data ? (
        <Loading />
      ) : !runs.data.length ? (
        <EmptyState icon="history" title="Nothing has run yet" />
      ) : (
        <div className="card crm-pad-top">
          <div className="crm-table-scroll">
            <table className="data-table">
              <thead><tr><th>When</th><th>Automation</th><th>Record</th><th>Result</th><th>Details</th></tr></thead>
              <tbody>
                {runs.data.map((r) => (
                  <tr key={r.id}>
                    <td className="small">{dateTime(r.createdAt)}</td>
                    <td>{r.automationName}</td>
                    <td className="small">{r.entityType && r.entityId ? <Link to={recordPath(org.id, r.entityType as any, r.entityId)}>{r.entityType}</Link> : ''}</td>
                    <td><span className={`badge ${r.status === 'success' ? 'success' : r.status === 'failed' ? 'danger' : ''}`}>{r.status === 'success' ? 'Done' : r.status === 'failed' ? 'Failed' : 'Skipped'}</span></td>
                    <td className="small muted">{r.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {editing ? <AutomationDialog initial={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => q.refetch()} /> : null}
    </div>
  );
}

function AutomationDialog({ initial, onClose, onSaved }: { initial: AutomationDTO | null; onClose: () => void; onSaved: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const pipelines = usePipelines().data ?? [];
  const [name, setName] = useState(initial?.name ?? '');
  const [trigger, setTrigger] = useState<TriggerType>(initial?.trigger ?? 'lead.created');
  const [config, setConfig] = useState<TriggerConfig>(initial?.config ?? {});
  const [conditions, setConditions] = useState<AutomationCondition[]>(initial?.conditions ?? []);
  const [actions, setActions] = useState<AutomationAction[]>(initial?.actions ?? [{ type: 'notify', to: 'owner', message: '' }]);
  const [busy, setBusy] = useState(false);
  const entity = TRIGGERS[trigger].entity;
  const allowed = actionsFor(entity);
  const fields = CONDITION_FIELDS[entity];
  const stages = pipelines.flatMap((p) => p.stages.map((s) => ({ key: s.id, label: pipelines.length > 1 ? `${p.name}: ${s.name}` : s.name })));
  const save = async () => {
    setBusy(true);
    try {
      const body = { name, description: initial?.description ?? '', trigger, config, conditions, actions: actions.filter((a) => allowed.includes(a.type)), enabled: initial?.enabled ?? true };
      if (initial?.id) await put(crm(org.id, `/automations/${initial.id}`), body);
      else await post(crm(org.id, '/automations'), body);
      toast('Automation saved');
      onSaved();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const setAction = (i: number, a: AutomationAction) => setActions(actions.map((x, j) => (j === i ? a : x)));
  return (
    <Modal wide title={initial?.id ? 'Edit automation' : 'New automation'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !name.trim() || !actions.length} onClick={save}>Save</button></>}>
      <div className="stack-lg">
        <div className="field">
          <label htmlFor="au-name">Name</label>
          <input id="au-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <fieldset className="crm-fieldset">
          <legend>When</legend>
          <select className="select" aria-label="Trigger" value={trigger} onChange={(e) => { setTrigger(e.target.value as TriggerType); setConfig({}); setConditions([]); }}>
            {(Object.keys(TRIGGERS) as TriggerType[]).map((t) => <option key={t} value={t}>{TRIGGERS[t].label}</option>)}
          </select>
          {trigger === 'deal.stage_changed' ? (
            <OptionSelect ariaLabel="Stage" allowEmpty emptyLabel="Any stage" options={stages} value={config.stageId ?? ''} onChange={(v) => setConfig({ ...config, stageId: v || null })} />
          ) : null}
          {trigger === 'deal.closed' ? (
            <select className="select" aria-label="Outcome" value={config.outcome ?? 'any'} onChange={(e) => setConfig({ ...config, outcome: e.target.value as 'won' | 'lost' | 'any' })}>
              <option value="any">Won or lost</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          ) : null}
          {trigger === 'deal.closing_soon' ? (
            <label className="row small">Days before the expected close date <input className="input sm crm-num" type="number" min={0} max={365} value={config.days ?? 7} onChange={(e) => setConfig({ ...config, days: Number(e.target.value) })} /></label>
          ) : null}
          {TRIGGERS[trigger].scheduled ? <p className="muted small">Checked every 15 minutes; each record fires once.</p> : null}
        </fieldset>
        <fieldset className="crm-fieldset">
          <legend>Only if (optional)</legend>
          {conditions.map((c, i) => {
            const f = fields.find((x) => x.key === c.field) ?? fields[0];
            return (
              <div key={i} className="row wrap">
                <select className="select sm" aria-label="Field" value={c.field} onChange={(e) => setConditions(conditions.map((x, j) => (j === i ? { field: e.target.value, op: 'eq', value: '' } : x)))}>
                  {fields.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}
                </select>
                <select className="select sm" aria-label="Condition" value={c.op} onChange={(e) => setConditions(conditions.map((x, j) => (j === i ? { ...x, op: e.target.value as AutomationCondition['op'] } : x)))}>
                  {(f.type === 'money' || f.type === 'int' ? ['gte', 'lte', 'eq'] : ['eq', 'neq', 'empty', 'not_empty']).map((o) => <option key={o} value={o}>{{ gte: 'at least', lte: 'at most', eq: 'is', neq: 'is not', empty: 'is empty', not_empty: 'is not empty' }[o]}</option>)}
                </select>
                {c.op === 'empty' || c.op === 'not_empty' ? null : f.type === 'money' ? (
                  <MoneyInput currency={org.currency} ariaLabel="Amount" value={Number(c.value) || 0} onChange={(v) => setConditions(conditions.map((x, j) => (j === i ? { ...x, value: v ?? 0 } : x)))} />
                ) : f.type === 'user' ? (
                  <UserSelect value={(c.value as string) || null} ariaLabel="Person" onChange={(v) => setConditions(conditions.map((x, j) => (j === i ? { ...x, value: v } : x)))} />
                ) : f.type === 'stage' ? (
                  <OptionSelect ariaLabel="Stage" options={stages} value={(c.value as string) ?? ''} onChange={(v) => setConditions(conditions.map((x, j) => (j === i ? { ...x, value: v } : x)))} />
                ) : f.type === 'pipeline' ? (
                  <OptionSelect ariaLabel="Pipeline" options={pipelines.map((p) => ({ key: p.id, label: p.name }))} value={(c.value as string) ?? ''} onChange={(v) => setConditions(conditions.map((x, j) => (j === i ? { ...x, value: v } : x)))} />
                ) : (
                  <input className="input sm" aria-label="Value" value={(c.value as string) ?? ''} placeholder={f.key === 'source' ? 'e.g. referral' : ''} onChange={(e) => setConditions(conditions.map((x, j) => (j === i ? { ...x, value: f.type === 'int' ? Number(e.target.value) : e.target.value } : x)))} />
                )}
                <button className="btn ghost icon sm" aria-label="Remove condition" onClick={() => setConditions(conditions.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button>
              </div>
            );
          })}
          <div><button className="btn sm" onClick={() => setConditions([...conditions, { field: fields[0].key, op: fields[0].type === 'money' ? 'gte' : 'eq', value: '' }])}><Icon name="plus" size={14} /> Add a condition</button></div>
        </fieldset>
        <fieldset className="crm-fieldset">
          <legend>Then</legend>
          {actions.map((a, i) => (
            <div key={i} className="card card-pad stack">
              <div className="row">
                <select className="select sm" aria-label="Action" value={a.type} onChange={(e) => {
                  const t = e.target.value as AutomationAction['type'];
                  setAction(i, t === 'notify' ? { type: 'notify', to: 'owner', message: '' } : t === 'create_activity' ? { type: 'create_activity', activityType: 'follow_up', title: 'Follow up', dueInDays: 2, assignTo: 'owner', priority: 'medium' } : t === 'set_priority' ? { type: 'set_priority', priority: 'high' } : t === 'flag_deal' ? { type: 'flag_deal', reason: '' } : { type: 'assign_owner', userId: '' });
                }}>
                  {allowed.map((t) => <option key={t} value={t}>{ACTION_LABELS[t]}</option>)}
                </select>
                <span className="grow" />
                <button className="btn ghost icon sm" aria-label="Remove action" onClick={() => setActions(actions.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button>
              </div>
              {a.type === 'notify' ? (
                <>
                  <select className="select" aria-label="Who" value={a.to} onChange={(e) => setAction(i, { ...a, to: e.target.value as Recipient })}>
                    {(Object.keys(RECIPIENT_LABELS) as Recipient[]).map((r) => <option key={r} value={r}>{RECIPIENT_LABELS[r]}</option>)}
                  </select>
                  {a.to === 'users' ? <PeoplePicker value={a.userIds ?? []} onChange={(ids) => setAction(i, { ...a, userIds: ids })} /> : null}
                  <input className="input" aria-label="Message" placeholder="Message, e.g. {record} moved to {stage} ({value})" value={a.message ?? ''} onChange={(e) => setAction(i, { ...a, message: e.target.value })} />
                  <p className="muted small">You can use {'{record}'}, {'{value}'}, {'{stage}'}, {'{actor}'}, {'{outcome}'} and {'{closeDate}'}.</p>
                </>
              ) : null}
              {a.type === 'create_activity' ? (
                <div className="crm-form-grid">
                  <div className="field"><label>Type</label><OptionSelect options={org.settings.activityTypes} value={a.activityType} onChange={(v) => setAction(i, { ...a, activityType: v })} /></div>
                  <div className="field"><label>Due in (days)</label><input className="input" type="number" min={0} max={365} value={a.dueInDays} onChange={(e) => setAction(i, { ...a, dueInDays: Number(e.target.value) })} /></div>
                  <div className="field crm-span"><label>Title</label><input className="input" value={a.title} onChange={(e) => setAction(i, { ...a, title: e.target.value })} /></div>
                  <div className="field"><label>Assigned to</label>
                    <select className="select" value={a.assignTo} onChange={(e) => setAction(i, { ...a, assignTo: e.target.value as 'owner' | 'actor' | 'user' })}>
                      <option value="owner">The record's owner</option>
                      <option value="actor">The person who made the change</option>
                      <option value="user">Someone chosen</option>
                    </select>
                  </div>
                  {a.assignTo === 'user' ? <div className="field"><label>Person</label><UserSelect value={a.userId ?? null} allowEmpty={false} onChange={(v) => setAction(i, { ...a, userId: v })} /></div> : null}
                  <div className="field"><label>Priority</label><OptionSelect options={PRIORITIES} value={a.priority ?? 'medium'} onChange={(v) => setAction(i, { ...a, priority: v })} /></div>
                </div>
              ) : null}
              {a.type === 'set_priority' ? <OptionSelect ariaLabel="Priority" options={PRIORITIES} value={a.priority} onChange={(v) => setAction(i, { ...a, priority: v })} /> : null}
              {a.type === 'flag_deal' ? <input className="input" aria-label="Reason" placeholder="Reason shown on the deal" value={a.reason ?? ''} onChange={(e) => setAction(i, { ...a, reason: e.target.value })} /> : null}
              {a.type === 'assign_owner' ? <UserSelect value={a.userId || null} allowEmpty={false} ariaLabel="Assign to" onChange={(v) => setAction(i, { ...a, userId: v ?? '' })} /> : null}
            </div>
          ))}
          <div><button className="btn sm" onClick={() => setActions([...actions, { type: 'notify', to: 'owner', message: '' }])}><Icon name="plus" size={14} /> Add an action</button></div>
        </fieldset>
      </div>
    </Modal>
  );
}

function PeoplePicker({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) {
  const people = usePeople();
  return (
    <div className="row wrap" role="group" aria-label="People">
      {people.members.map((m) => (
        <label key={m.userId} className="checkbox">
          <input type="checkbox" checked={value.includes(m.userId)} onChange={(e) => onChange(e.target.checked ? [...value, m.userId] : value.filter((x) => x !== m.userId))} /> {m.name}
        </label>
      ))}
    </div>
  );
}
