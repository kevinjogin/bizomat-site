// Sentence-style automation builder ("When … if … then …") and the board
// automations panel. Produces the JSON accepted by `automationSchema` in
// src/worker/services/automations.ts.

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { useUser } from '../../lib/session';
import { timeAgo } from '../../lib/format';
import { isComputed, labelsOf, type FilterOperator } from '../../../shared/columns';
import { OPERATOR_LABELS, operatorsFor, opNeedsValue, type FilterGroup, type FilterRule } from '../../../shared/filters';
import type { BoardBundle, BoardDTO, ColumnDTO, GroupDTO, MemberDTO } from '../../../shared/types';
import { Icon } from '../ui/Icon';
import { EmptyState, ErrorBox, Field, Loading, Switch } from '../ui/ui';
import { Modal, useConfirm, useToast } from '../ui/overlays';
import '../../styles/admin.css';

// ------------------------------------------------------------------ types

export type Trigger =
  | { type: 'item_created'; includeSubitems?: boolean }
  | { type: 'status_changed'; columnId: string; to?: string; from?: string }
  | { type: 'column_changed'; columnId: string }
  | { type: 'item_moved_to_group'; groupId?: string }
  | { type: 'update_posted' }
  | { type: 'date_arrived'; columnId: string; offsetDays: number }
  | { type: 'recurring'; interval: 'daily' | 'weekly' | 'monthly'; weekday?: number; dayOfMonth?: number; hourUtc: number };

export type Action =
  | { type: 'set_value'; columnId: string; value: unknown }
  | { type: 'set_date_today'; columnId: string }
  | { type: 'clear_value'; columnId: string }
  | { type: 'notify'; target: 'assignees' | 'creator' | 'user'; userId?: string; message: string }
  | { type: 'assign'; columnId: string; userId: string }
  | { type: 'move_to_group'; groupId: string }
  | { type: 'create_item'; groupId?: string; name: string }
  | { type: 'create_subitem'; name: string }
  | { type: 'archive_item' }
  | { type: 'duplicate_item'; groupId?: string }
  | { type: 'send_webhook'; integrationId: string };

export interface AutomationDraft {
  id?: string;
  name: string;
  enabled?: boolean;
  trigger: Trigger;
  conditions?: FilterGroup;
  actions: Action[];
}

export interface AutomationDTO extends AutomationDraft {
  id: string;
  boardId: string;
  enabled: boolean;
  conditions: FilterGroup;
  lastRunAt: number | null;
  runCount: number;
  createdBy: string;
  boardName?: string;
}

const TRIGGERS: { type: Trigger['type']; label: string }[] = [
  { type: 'item_created', label: 'an item is created' },
  { type: 'status_changed', label: 'a status changes' },
  { type: 'column_changed', label: 'a column value changes' },
  { type: 'item_moved_to_group', label: 'an item moves to a group' },
  { type: 'update_posted', label: 'an update is posted' },
  { type: 'date_arrived', label: 'a date arrives' },
  { type: 'recurring', label: 'on a recurring schedule' },
];

const ACTIONS: { type: Action['type']; label: string; recurringOk?: boolean }[] = [
  { type: 'set_value', label: 'set a column value' },
  { type: 'set_date_today', label: 'set a date to today' },
  { type: 'clear_value', label: 'clear a column' },
  { type: 'assign', label: 'assign someone' },
  { type: 'move_to_group', label: 'move the item to a group' },
  { type: 'notify', label: 'send a notification', recurringOk: true },
  { type: 'create_item', label: 'create an item', recurringOk: true },
  { type: 'create_subitem', label: 'create a subitem' },
  { type: 'duplicate_item', label: 'duplicate the item' },
  { type: 'archive_item', label: 'archive the item' },
  { type: 'send_webhook', label: 'send a webhook', recurringOk: true },
];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// --------------------------------------------------------------- helpers

function settable(c: ColumnDTO) {
  if (isComputed(c.type) || ['files', 'dependency', 'location'].includes(c.type)) return false;
  if (c.type === 'progress' && c.settings?.mode && c.settings.mode !== 'manual') return false;
  return true;
}

function defaultTrigger(type: Trigger['type'], cols: ColumnDTO[]): Trigger {
  const status = cols.find((c) => c.type === 'status');
  const date = cols.find((c) => c.type === 'date' || c.type === 'timeline');
  switch (type) {
    case 'status_changed': return { type, columnId: status?.id ?? '' };
    case 'column_changed': return { type, columnId: cols.find((c) => !isComputed(c.type))?.id ?? '' };
    case 'date_arrived': return { type, columnId: date?.id ?? '', offsetDays: 0 };
    case 'recurring': return { type, interval: 'weekly', weekday: 0, hourUtc: 8 };
    case 'item_moved_to_group': return { type };
    case 'item_created': return { type };
    default: return { type } as Trigger;
  }
}

function defaultAction(type: Action['type'], cols: ColumnDTO[], groups: GroupDTO[], userId: string): Action {
  const date = cols.find((c) => c.type === 'date');
  const person = cols.find((c) => c.type === 'person' || c.type === 'people');
  switch (type) {
    case 'set_value': return { type, columnId: cols.find(settable)?.id ?? '', value: null };
    case 'set_date_today': return { type, columnId: date?.id ?? '' };
    case 'clear_value': return { type, columnId: cols.find(settable)?.id ?? '' };
    case 'assign': return { type, columnId: person?.id ?? '', userId };
    case 'move_to_group': return { type, groupId: groups[groups.length - 1]?.id ?? '' };
    case 'notify': return { type, target: 'assignees', message: '"{item}" needs your attention' };
    case 'create_item': return { type, groupId: groups[0]?.id, name: 'New task {date}' };
    case 'create_subitem': return { type, name: 'Follow-up for {item}' };
    case 'duplicate_item': return { type };
    case 'archive_item': return { type };
    case 'send_webhook': return { type, integrationId: '' };
  }
}

export function describeAutomation(a: AutomationDraft, cols: ColumnDTO[], groups: GroupDTO[], members: MemberDTO[]): string {
  const col = (id?: string) => cols.find((c) => c.id === id)?.title ?? 'a column';
  const group = (id?: string) => groups.find((g) => g.id === id)?.name ?? 'a group';
  const label = (colId: string, id?: string) => labelsOf(cols.find((c) => c.id === colId) ?? { id: '', title: '', type: '', settings: {} }).find((l) => l.id === id)?.label ?? id;
  const person = (id?: string) => members.find((m) => m.id === id)?.name ?? 'someone';
  const t = a.trigger;
  let when = '';
  switch (t.type) {
    case 'item_created': when = 'an item is created'; break;
    case 'status_changed': when = `${col(t.columnId)} changes${t.from ? ` from ${label(t.columnId, t.from)}` : ''}${t.to ? ` to ${label(t.columnId, t.to)}` : ''}`; break;
    case 'column_changed': when = `${col(t.columnId)} changes`; break;
    case 'item_moved_to_group': when = `an item moves to ${t.groupId ? group(t.groupId) : 'any group'}`; break;
    case 'update_posted': when = 'an update is posted'; break;
    case 'date_arrived': when = `${col(t.columnId)} ${t.offsetDays === 0 ? 'arrives' : t.offsetDays < 0 ? `is ${-t.offsetDays} day(s) away` : `passed ${t.offsetDays} day(s) ago`}`; break;
    case 'recurring': when = t.interval === 'daily' ? `every day at ${t.hourUtc}:00 UTC` : t.interval === 'weekly' ? `every ${WEEKDAYS[t.weekday ?? 0]} at ${t.hourUtc}:00 UTC` : `on day ${t.dayOfMonth ?? 1} of every month at ${t.hourUtc}:00 UTC`; break;
  }
  const then = a.actions
    .map((x) => {
      switch (x.type) {
        case 'set_value': return `set ${col(x.columnId)}`;
        case 'set_date_today': return `set ${col(x.columnId)} to today`;
        case 'clear_value': return `clear ${col(x.columnId)}`;
        case 'assign': return `assign ${person(x.userId)}`;
        case 'move_to_group': return `move to ${group(x.groupId)}`;
        case 'notify': return `notify ${x.target === 'user' ? person(x.userId) : x.target}`;
        case 'create_item': return `create "${x.name}"`;
        case 'create_subitem': return `create subitem "${x.name}"`;
        case 'duplicate_item': return 'duplicate the item';
        case 'archive_item': return 'archive the item';
        case 'send_webhook': return 'send a webhook';
      }
      return '';
    })
    .join(', then ');
  const cond = a.conditions?.rules?.length ? ` and ${a.conditions.rules.length} condition(s) match` : '';
  return `When ${when}${cond}, ${then}.`;
}

// ----------------------------------------------------------- value editor

export function ValueEditor({ column, value, onChange, members }: { column?: ColumnDTO; value: unknown; onChange: (v: unknown) => void; members: MemberDTO[] }) {
  if (!column) return <span className="muted small">Pick a column</span>;
  const t = column.type;
  if (t === 'status' || t === 'priority' || t === 'dropdown') {
    const cur = Array.isArray(value) ? value[0] : value;
    return (
      <select className="select sm" value={String(cur ?? '')} onChange={(e) => onChange(e.target.value || null)} aria-label="Value">
        <option value="">(empty)</option>
        {labelsOf(column).map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
      </select>
    );
  }
  if (t === 'person' || t === 'people') {
    const cur = Array.isArray(value) ? value[0] : value;
    return (
      <select className="select sm" value={String(cur ?? '')} onChange={(e) => onChange(e.target.value ? (t === 'people' ? [e.target.value] : e.target.value) : null)} aria-label="Person">
        <option value="">(nobody)</option>
        {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    );
  }
  if (t === 'checkbox') {
    return (
      <select className="select sm" value={value ? 'true' : 'false'} onChange={(e) => onChange(e.target.value === 'true')} aria-label="Checked">
        <option value="true">Checked</option>
        <option value="false">Unchecked</option>
      </select>
    );
  }
  if (['number', 'currency', 'percentage', 'rating', 'progress'].includes(t)) {
    return <input className="input sm" type="number" value={value == null ? '' : String(value)} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} aria-label="Number" style={{ width: 120 }} />;
  }
  if (t === 'date') return <input className="input sm" type="date" value={String(value ?? '')} onChange={(e) => onChange(e.target.value || null)} aria-label="Date" />;
  if (t === 'timeline') {
    const v = (value ?? {}) as { start?: string; end?: string };
    return (
      <span className="row">
        <input className="input sm" type="date" value={v.start ?? ''} onChange={(e) => onChange({ ...v, start: e.target.value })} aria-label="Start date" />
        →
        <input className="input sm" type="date" value={v.end ?? ''} onChange={(e) => onChange({ ...v, end: e.target.value })} aria-label="End date" />
      </span>
    );
  }
  if (t === 'tags') {
    return <input className="input sm" value={Array.isArray(value) ? value.join(', ') : ''} placeholder="tag1, tag2" onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} aria-label="Tags" />;
  }
  return <input className="input sm" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} aria-label="Text value" />;
}

// ------------------------------------------------------- condition editor

function ConditionEditor({ value, onChange, columns, groups, members }: { value: FilterGroup; onChange: (g: FilterGroup) => void; columns: ColumnDTO[]; groups: GroupDTO[]; members: MemberDTO[] }) {
  const colMap = new Map(columns.map((c) => [c.id, c]));
  const fields = [
    { id: 'done', label: 'Item is done' },
    { id: 'name', label: 'Name' },
    { id: 'group', label: 'Group' },
    ...columns.filter((c) => !['files', 'dependency', 'formula'].includes(c.type)).map((c) => ({ id: c.id, label: c.title })),
  ];
  const rules = value.rules as FilterRule[];
  const opsFor = (field: string): FilterOperator[] => (field === 'done' ? ['is', 'is_not'] : operatorsFor(field, colMap).filter((o) => o !== 'includes_me'));
  const setRule = (i: number, r: FilterRule) => onChange({ ...value, rules: rules.map((x, j) => (j === i ? r : x)) });
  return (
    <div className="col" style={{ gap: 6, width: '100%' }}>
      {rules.map((r, i) => {
        const col = colMap.get(r.field);
        const needs = r.field !== 'done' && opNeedsValue(r.op);
        return (
          <div key={i} className="rule-row">
            {i > 0 ? (
              <select className="select sm" style={{ width: 70 }} value={value.op} onChange={(e) => onChange({ ...value, op: e.target.value as 'and' | 'or' })} aria-label="Combine conditions">
                <option value="and">and</option>
                <option value="or">or</option>
              </select>
            ) : null}
            <select className="select sm" value={r.field} aria-label="Condition field" onChange={(e) => setRule(i, { field: e.target.value, op: opsFor(e.target.value)[0] ?? 'is', value: undefined })}>
              {fields.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
            <select className="select sm" value={r.op} aria-label="Operator" onChange={(e) => setRule(i, { ...r, op: e.target.value as FilterOperator })}>
              {opsFor(r.field).map((o) => <option key={o} value={o}>{r.field === 'done' ? (o === 'is' ? 'yes' : 'no') : OPERATOR_LABELS[o]}</option>)}
            </select>
            {needs ? (
              r.field === 'group' ? (
                <select className="select sm" value={String(r.value ?? '')} onChange={(e) => setRule(i, { ...r, value: e.target.value })} aria-label="Group">
                  <option value="">Choose…</option>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              ) : col && ['status', 'priority', 'dropdown', 'person', 'people'].includes(col.type) && (r.op === 'any_of' || r.op === 'none_of') ? (
                <select multiple className="select sm" style={{ height: 70 }} value={(Array.isArray(r.value) ? r.value : []).map(String)} aria-label="Values" onChange={(e) => setRule(i, { ...r, value: Array.from(e.target.selectedOptions).map((o) => o.value) })}>
                  {(col.type === 'person' || col.type === 'people' ? members.map((m) => ({ id: m.id, label: m.name })) : labelsOf(col)).map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              ) : col && ['status', 'priority', 'dropdown', 'person', 'people', 'checkbox'].includes(col.type) ? (
                <ValueEditor column={col} value={r.value} members={members} onChange={(v) => setRule(i, { ...r, value: Array.isArray(v) ? v[0] : v })} />
              ) : r.op === 'within_next_days' || r.op === 'within_last_days' ? (
                <input className="input sm" type="number" min={0} style={{ width: 80 }} value={String(r.value ?? 7)} onChange={(e) => setRule(i, { ...r, value: Number(e.target.value) })} aria-label="Days" />
              ) : col && (col.type === 'date' || col.type === 'timeline' || col.type === 'created_at' || col.type === 'updated_at') ? (
                <input className="input sm" type="date" value={String(r.value ?? '')} onChange={(e) => setRule(i, { ...r, value: e.target.value })} aria-label="Date" />
              ) : (
                <input className="input sm" value={String(r.value ?? '')} onChange={(e) => setRule(i, { ...r, value: e.target.value })} aria-label="Value" />
              )
            ) : null}
            <button type="button" className="btn ghost icon sm" aria-label="Remove condition" onClick={() => onChange({ ...value, rules: rules.filter((_, j) => j !== i) })}>
              <Icon name="x" size={14} />
            </button>
          </div>
        );
      })}
      <div>
        <button type="button" className="btn sm" onClick={() => onChange({ ...value, rules: [...rules, { field: 'done', op: 'is_not' }] })}>
          <Icon name="plus" size={13} /> Add condition
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- builder

export function AutomationBuilder({
  board,
  columns,
  groups,
  members,
  automation,
  onClose,
  onSaved,
}: {
  board: BoardDTO;
  columns: ColumnDTO[];
  groups: GroupDTO[];
  members: MemberDTO[];
  automation?: any;
  onClose(): void;
  onSaved(): void;
}) {
  const me = useUser();
  const init: AutomationDraft = automation ?? { name: '', trigger: defaultTrigger('status_changed', columns), conditions: { op: 'and', rules: [] }, actions: [defaultAction('notify', columns, groups, me.id)] };
  const [name, setName] = useState<string>(init.name);
  const [trigger, setTrigger] = useState<Trigger>(init.trigger);
  const [conditions, setConditions] = useState<FilterGroup>(init.conditions ?? { op: 'and', rules: [] });
  const [actions, setActions] = useState<Action[]>(init.actions);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const integrations = useQuery({ queryKey: ['integrations', board.workspaceId], queryFn: () => get<any[]>(`/workspaces/${board.workspaceId}/integrations`), retry: false });

  const statusCols = columns.filter((c) => c.type === 'status');
  const dateCols = columns.filter((c) => c.type === 'date' || c.type === 'timeline');
  const personCols = columns.filter((c) => c.type === 'person' || c.type === 'people');
  const isRecurring = trigger.type === 'recurring';
  const actionChoices = ACTIONS.filter((a) => !isRecurring || a.recurringOk);
  const setAction = (i: number, a: Action) => setActions(actions.map((x, j) => (j === i ? a : x)));
  const draft: AutomationDraft = { name, trigger, conditions, actions };

  const save = async () => {
    setError(null);
    setBusy(true);
    const payload = { name: name.trim() || describeAutomation(draft, columns, groups, members).slice(0, 200), trigger, conditions: isRecurring ? { op: 'and', rules: [] } : conditions, actions };
    try {
      if (automation?.id) await patch(`/automations/${automation.id}`, payload);
      else await post(`/boards/${board.id}/automations`, { ...payload, enabled: true });
      onSaved();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const colSelect = (value: string, options: ColumnDTO[], onChange: (id: string) => void, label: string) => (
    <select className="select sm" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {!options.some((o) => o.id === value) ? <option value="">Choose a column…</option> : null}
      {options.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
    </select>
  );

  return (
    <Modal
      title={automation?.id ? 'Edit automation' : 'New automation'}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={busy || actions.length === 0}>{busy ? 'Saving…' : 'Save automation'}</button>
        </>
      }
    >
      <Field label="Name" htmlFor="auto-name" hint="Optional — a description is generated if left empty.">
        <input id="auto-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} placeholder="e.g. Close out finished work" />
      </Field>

      <div className="sentence" aria-label="Trigger">
        <span className="kw">When</span>
        <select className="select sm" value={trigger.type} onChange={(e) => {
          const t = defaultTrigger(e.target.value as Trigger['type'], columns);
          setTrigger(t);
          if (t.type === 'recurring') setActions(actions.filter((a) => ACTIONS.find((x) => x.type === a.type)?.recurringOk).concat(actions.some((a) => ACTIONS.find((x) => x.type === a.type)?.recurringOk) ? [] : [defaultAction('create_item', columns, groups, me.id)]));
        }} aria-label="Trigger type">
          {TRIGGERS.map((t) => <option key={t.type} value={t.type}>{t.label}</option>)}
        </select>
        {trigger.type === 'item_created' ? (
          <label className="checkbox small"><input type="checkbox" checked={!!trigger.includeSubitems} onChange={(e) => setTrigger({ ...trigger, includeSubitems: e.target.checked })} /> include subitems</label>
        ) : null}
        {trigger.type === 'status_changed' ? (
          <>
            {colSelect(trigger.columnId, statusCols, (id) => setTrigger({ ...trigger, columnId: id, to: undefined, from: undefined }), 'Status column')}
            <span>to</span>
            <select className="select sm" value={trigger.to ?? ''} onChange={(e) => setTrigger({ ...trigger, to: e.target.value || undefined })} aria-label="New status">
              <option value="">any status</option>
              {labelsOf(columns.find((c) => c.id === trigger.columnId) ?? { id: '', title: '', type: '', settings: {} }).map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </>
        ) : null}
        {trigger.type === 'column_changed' ? colSelect(trigger.columnId, columns.filter((c) => !isComputed(c.type)), (id) => setTrigger({ ...trigger, columnId: id }), 'Column') : null}
        {trigger.type === 'item_moved_to_group' ? (
          <select className="select sm" value={trigger.groupId ?? ''} onChange={(e) => setTrigger({ ...trigger, groupId: e.target.value || undefined })} aria-label="Group">
            <option value="">any group</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        ) : null}
        {trigger.type === 'date_arrived' ? (
          <>
            {colSelect(trigger.columnId, dateCols, (id) => setTrigger({ ...trigger, columnId: id }), 'Date column')}
            <select className="select sm" value={String(trigger.offsetDays)} onChange={(e) => setTrigger({ ...trigger, offsetDays: Number(e.target.value) })} aria-label="Timing">
              {[-7, -3, -2, -1, 0, 1, 2, 3, 7].map((d) => (
                <option key={d} value={d}>{d === 0 ? 'on the day' : d < 0 ? `${-d} day(s) before` : `${d} day(s) after`}</option>
              ))}
            </select>
          </>
        ) : null}
        {trigger.type === 'recurring' ? (
          <>
            <select className="select sm" value={trigger.interval} onChange={(e) => setTrigger({ ...trigger, interval: e.target.value as 'daily' | 'weekly' | 'monthly' })} aria-label="Interval">
              <option value="daily">every day</option>
              <option value="weekly">every week</option>
              <option value="monthly">every month</option>
            </select>
            {trigger.interval === 'weekly' ? (
              <select className="select sm" value={String(trigger.weekday ?? 0)} onChange={(e) => setTrigger({ ...trigger, weekday: Number(e.target.value) })} aria-label="Weekday">
                {WEEKDAYS.map((d, i) => <option key={d} value={i}>on {d}</option>)}
              </select>
            ) : null}
            {trigger.interval === 'monthly' ? (
              <select className="select sm" value={String(trigger.dayOfMonth ?? 1)} onChange={(e) => setTrigger({ ...trigger, dayOfMonth: Number(e.target.value) })} aria-label="Day of month">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>on day {d}</option>)}
              </select>
            ) : null}
            <select className="select sm" value={String(trigger.hourUtc)} onChange={(e) => setTrigger({ ...trigger, hourUtc: Number(e.target.value) })} aria-label="Hour (UTC)">
              {Array.from({ length: 24 }, (_, i) => i).map((h) => <option key={h} value={h}>at {String(h).padStart(2, '0')}:00 UTC</option>)}
            </select>
          </>
        ) : null}
      </div>

      {!isRecurring ? (
        <div className="sentence" aria-label="Conditions">
          <span className="kw">If</span>
          {conditions.rules.length === 0 ? <span className="muted small">always (no conditions)</span> : null}
          <ConditionEditor value={conditions} onChange={setConditions} columns={columns} groups={groups} members={members} />
        </div>
      ) : (
        <p className="muted small">Scheduled automations run without an item, so they can create items, notify people or send webhooks. Schedules are checked every 15 minutes.</p>
      )}

      {actions.map((a, i) => (
        <div key={i} className="sentence" aria-label={`Action ${i + 1}`}>
          <span className="kw">{i === 0 ? 'Then' : 'And'}</span>
          <select className="select sm" value={a.type} onChange={(e) => setAction(i, defaultAction(e.target.value as Action['type'], columns, groups, me.id))} aria-label="Action type">
            {actionChoices.map((x) => <option key={x.type} value={x.type}>{x.label}</option>)}
          </select>
          {a.type === 'set_value' ? (
            <>
              {colSelect(a.columnId, columns.filter(settable), (id) => setAction(i, { ...a, columnId: id, value: null }), 'Column to set')}
              <span>to</span>
              <ValueEditor column={columns.find((c) => c.id === a.columnId)} value={a.value} members={members} onChange={(v) => setAction(i, { ...a, value: v })} />
            </>
          ) : null}
          {a.type === 'set_date_today' ? colSelect(a.columnId, columns.filter((c) => c.type === 'date'), (id) => setAction(i, { ...a, columnId: id }), 'Date column') : null}
          {a.type === 'clear_value' ? colSelect(a.columnId, columns.filter(settable), (id) => setAction(i, { ...a, columnId: id }), 'Column to clear') : null}
          {a.type === 'assign' ? (
            <>
              <select className="select sm" value={a.userId} onChange={(e) => setAction(i, { ...a, userId: e.target.value })} aria-label="Person">
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <span>in</span>
              {colSelect(a.columnId, personCols, (id) => setAction(i, { ...a, columnId: id }), 'Person column')}
            </>
          ) : null}
          {a.type === 'move_to_group' || a.type === 'duplicate_item' || a.type === 'create_item' ? (
            <select className="select sm" value={a.groupId ?? ''} onChange={(e) => setAction(i, { ...a, groupId: e.target.value || undefined } as Action)} aria-label="Group">
              {a.type !== 'move_to_group' ? <option value="">{a.type === 'create_item' ? 'in the first group' : 'in the same group'}</option> : null}
              {groups.map((g) => <option key={g.id} value={g.id}>in {g.name}</option>)}
            </select>
          ) : null}
          {a.type === 'create_item' || a.type === 'create_subitem' ? (
            <input className="input sm" value={a.name} onChange={(e) => setAction(i, { ...a, name: e.target.value })} aria-label="Name" placeholder="Name — use {date} or {item}" maxLength={300} />
          ) : null}
          {a.type === 'notify' ? (
            <>
              <select className="select sm" value={a.target} onChange={(e) => setAction(i, { ...a, target: e.target.value as 'assignees' | 'creator' | 'user', userId: e.target.value === 'user' ? a.userId ?? me.id : undefined })} aria-label="Recipient">
                {!isRecurring ? <option value="assignees">the assignees</option> : null}
                {!isRecurring ? <option value="creator">the item creator</option> : null}
                <option value="user">a specific person</option>
              </select>
              {a.target === 'user' ? (
                <select className="select sm" value={a.userId ?? ''} onChange={(e) => setAction(i, { ...a, userId: e.target.value })} aria-label="Person to notify">
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              ) : null}
              <input className="input sm" style={{ flex: 1 }} value={a.message} onChange={(e) => setAction(i, { ...a, message: e.target.value })} aria-label="Message" maxLength={500} placeholder="Message — use {item} or {board}" />
            </>
          ) : null}
          {a.type === 'send_webhook' ? (
            integrations.data?.length ? (
              <select className="select sm" value={a.integrationId} onChange={(e) => setAction(i, { ...a, integrationId: e.target.value })} aria-label="Integration">
                <option value="">Choose an integration…</option>
                {integrations.data.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.provider}{x.status !== 'connected' ? `, ${x.status}` : ''})</option>)}
              </select>
            ) : (
              <span className="muted small">No integrations yet — an admin can add one under Integrations.</span>
            )
          ) : null}
          <span className="spacer" />
          {actions.length > 1 ? (
            <button type="button" className="btn ghost icon sm" aria-label="Remove action" onClick={() => setActions(actions.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button>
          ) : null}
        </div>
      ))}
      {actions.length < 10 ? (
        <button type="button" className="btn sm" onClick={() => setActions([...actions, defaultAction(isRecurring ? 'notify' : 'notify', columns, groups, me.id)])}>
          <Icon name="plus" size={13} /> Add another action
        </button>
      ) : null}

      <div className="info-box" style={{ marginTop: 14 }}>
        <Icon name="bolt" size={14} /> {describeAutomation(draft, columns, groups, members)}
      </div>
      {error ? <div className="error-box" role="alert" style={{ marginTop: 10 }}>{error}</div> : null}
    </Modal>
  );
}

// -------------------------------------------------------------- run log

interface RunRow {
  id: string;
  item_id: string | null;
  item_name: string | null;
  status: 'running' | 'succeeded' | 'failed' | 'skipped';
  attempts: number;
  depth: number;
  error: string | null;
  result: unknown;
  started_at: number;
  finished_at: number | null;
  next_retry_at: number | null;
}

const RUN_BADGE: Record<string, string> = { succeeded: 'success', failed: 'danger', running: 'accent', skipped: '' };

export function RunsDialog({ automation, onClose }: { automation: { id: string; name: string }; onClose: () => void }) {
  const q = useQuery({ queryKey: ['automation-runs', automation.id], queryFn: () => get<RunRow[]>(`/automations/${automation.id}/runs`), refetchInterval: 15_000 });
  return (
    <Modal title={`Run log · ${automation.name}`} onClose={onClose} wide>
      {q.isLoading ? <Loading /> : null}
      {q.error ? <ErrorBox error={q.error} /> : null}
      {q.data && q.data.length === 0 ? <EmptyState icon="history" title="No runs yet">Runs appear here each time the automation fires.</EmptyState> : null}
      {q.data?.length ? (
        <table className="data-table responsive">
          <thead><tr><th>When</th><th>Status</th><th>Item</th><th>Attempts</th><th>Details</th></tr></thead>
          <tbody>
            {q.data.map((r) => (
              <tr key={r.id}>
                <td title={new Date(r.started_at).toLocaleString()} style={{ whiteSpace: 'nowrap' }}>{timeAgo(r.started_at)}</td>
                <td><span className={`badge ${RUN_BADGE[r.status] ?? ''}`}>{r.status}</span></td>
                <td className="small">{r.item_name ?? (r.item_id ? 'Deleted item' : '—')}</td>
                <td className="small">{r.attempts}</td>
                <td className="small" style={{ maxWidth: 320, wordBreak: 'break-word' }}>
                  {r.error ? <span className="danger-text">{r.error}</span> : Array.isArray(r.result) ? (r.result as unknown[]).filter(Boolean).join(' · ') : ''}
                  {r.next_retry_at ? <div className="muted">Retry scheduled {new Date(r.next_retry_at).toLocaleTimeString()}</div> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Modal>
  );
}

// ---------------------------------------------------------------- panel

function recipes(columns: ColumnDTO[], groups: GroupDTO[], meId: string): { id: string; title: string; draft: AutomationDraft | null; missing?: string }[] {
  const status = columns.find((c) => c.type === 'status');
  const doneLabel = status ? labelsOf(status).find((l) => l.done) ?? labelsOf(status).at(-1) : undefined;
  const date = columns.find((c) => c.type === 'date');
  const person = columns.find((c) => c.type === 'person' || c.type === 'people');
  const doneGroup = groups.find((g) => /done|complete|closed/i.test(g.name)) ?? groups[groups.length - 1];
  return [
    {
      id: 'done-date',
      title: 'When status changes to Done, set a date to today',
      missing: !status || !doneLabel ? 'a status column' : !date ? 'a date column' : undefined,
      draft: status && doneLabel && date ? { name: `When ${status.title} is ${doneLabel.label}, set ${date.title} to today`, trigger: { type: 'status_changed', columnId: status.id, to: doneLabel.id }, conditions: { op: 'and', rules: [] }, actions: [{ type: 'set_date_today', columnId: date.id }] } : null,
    },
    {
      id: 'assign-new',
      title: 'When an item is created, assign it to me',
      missing: !person ? 'a person column' : undefined,
      draft: person ? { name: 'Assign new items to me', trigger: { type: 'item_created' }, conditions: { op: 'and', rules: [] }, actions: [{ type: 'assign', columnId: person.id, userId: meId }] } : null,
    },
    {
      id: 'move-done',
      title: 'When status changes to Done, move the item to a group',
      missing: !status || !doneLabel ? 'a status column' : groups.length < 2 ? 'at least two groups' : undefined,
      draft: status && doneLabel && doneGroup && groups.length > 1 ? { name: `Move ${doneLabel.label} items to ${doneGroup.name}`, trigger: { type: 'status_changed', columnId: status.id, to: doneLabel.id }, conditions: { op: 'and', rules: [] }, actions: [{ type: 'move_to_group', groupId: doneGroup.id }] } : null,
    },
    {
      id: 'due-notify',
      title: 'When the due date arrives and the item is not done, notify assignees',
      missing: !date ? 'a date column' : undefined,
      draft: date ? { name: `Remind assignees when ${date.title} arrives`, trigger: { type: 'date_arrived', columnId: date.id, offsetDays: 0 }, conditions: { op: 'and', rules: [{ field: 'done', op: 'is_not' }] }, actions: [{ type: 'notify', target: 'assignees', message: '"{item}" is due today' }] } : null,
    },
    {
      id: 'weekly-task',
      title: 'Every Monday, create a recurring task',
      missing: groups.length ? undefined : 'a group',
      draft: groups.length ? { name: 'Weekly check-in', trigger: { type: 'recurring', interval: 'weekly', weekday: 0, hourUtc: 8 }, conditions: { op: 'and', rules: [] }, actions: [{ type: 'create_item', groupId: groups[0].id, name: 'Weekly check-in {date}' }] } : null,
    },
  ];
}

export function AutomationsPanel({ bundle }: { bundle: BoardBundle }) {
  const { board, columns, groups, members } = bundle;
  const me = useUser();
  const canManage = board.access === 'edit' || board.access === 'admin';
  const q = useQuery({ queryKey: ['automations', board.id], queryFn: () => get<AutomationDTO[]>(`/boards/${board.id}/automations`) });
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<AutomationDraft | null>(null);
  const [runs, setRuns] = useState<AutomationDTO | null>(null);
  const [showRecipes, setShowRecipes] = useState(false);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['automations', board.id] });
    qc.invalidateQueries({ queryKey: ['automations', 'workspace', board.workspaceId] });
  };
  const act = async (fn: () => Promise<unknown>, msg?: string) => {
    try {
      await fn();
      refresh();
      if (msg) toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const list = q.data ?? [];
  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row wrap">
        <div className="grow">
          <h2>Automations</h2>
          <p className="muted small" style={{ margin: 0 }}>Rules run on the server whenever their trigger fires. Each run is logged.</p>
        </div>
        {canManage ? (
          <>
            <button className="btn" onClick={() => setShowRecipes((s) => !s)}><Icon name="template" /> Recipes</button>
            <button className="btn primary" onClick={() => setEditing({ name: '', trigger: defaultTrigger('status_changed', columns), conditions: { op: 'and', rules: [] }, actions: [defaultAction('notify', columns, groups, me.id)] })}>
              <Icon name="plus" /> Add automation
            </button>
          </>
        ) : null}
      </div>
      {showRecipes && canManage ? (
        <div className="card">
          {recipes(columns, groups, me.id).map((r) => (
            <div key={r.id} className="list-row">
              <Icon name="bolt" />
              <span className="grow">
                {r.title}
                {r.missing ? <div className="muted small">Needs {r.missing} on this board.</div> : null}
              </span>
              <button className="btn sm" disabled={!r.draft} onClick={() => { setEditing(r.draft); setShowRecipes(false); }}>Use</button>
            </div>
          ))}
        </div>
      ) : null}
      {q.isLoading ? <Loading /> : null}
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {q.data && list.length === 0 ? (
        <div className="card">
          <EmptyState icon="bolt" title="No automations on this board" action={canManage ? <button className="btn primary" onClick={() => setShowRecipes(true)}>Browse recipes</button> : undefined}>
            Automate repetitive work: set dates, assign people, move items and send reminders.
          </EmptyState>
        </div>
      ) : null}
      {list.length ? (
        <div className="card">
          {list.map((a) => (
            <div key={a.id} className="list-row" style={{ alignItems: 'flex-start' }}>
              {canManage ? <Switch label={`${a.enabled ? 'Disable' : 'Enable'} ${a.name}`} checked={a.enabled} onChange={(v) => act(() => patch(`/automations/${a.id}`, { enabled: v }), v ? 'Automation enabled' : 'Automation paused')} /> : <Icon name="bolt" />}
              <span className="grow" style={{ minWidth: 0 }}>
                <strong>{a.name}</strong> {!a.enabled ? <span className="badge">Paused</span> : null}
                <div className="muted small">{describeAutomation(a, columns, groups, members)}</div>
                <div className="muted small">{a.runCount} run(s){a.lastRunAt ? ` · last ${timeAgo(a.lastRunAt)}` : ''}</div>
              </span>
              <button className="btn ghost sm" onClick={() => setRuns(a)}><Icon name="history" size={14} /> Log</button>
              {canManage ? (
                <>
                  <button className="btn ghost icon sm" aria-label={`Edit ${a.name}`} onClick={() => setEditing(a)}><Icon name="edit" size={14} /></button>
                  <button
                    className="btn ghost icon sm"
                    aria-label={`Delete ${a.name}`}
                    onClick={async () => {
                      if (await confirm({ title: `Delete "${a.name}"?`, message: 'Its run history will be deleted too.', danger: true, confirmLabel: 'Delete' })) act(() => del(`/automations/${a.id}`), 'Automation deleted');
                    }}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {editing ? <AutomationBuilder board={board} columns={columns} groups={groups} members={members} automation={editing} onClose={() => setEditing(null)} onSaved={() => { refresh(); toast('Automation saved'); }} /> : null}
      {runs ? <RunsDialog automation={runs} onClose={() => setRuns(null)} /> : null}
    </div>
  );
}
