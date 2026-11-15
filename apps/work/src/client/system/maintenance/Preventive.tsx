// Preventive maintenance (stage M2): schedules per asset, templates per asset class, the calendar (a forecast of what is
// due) and "Generate due work orders now". The server (src/worker/maintenance/pm.ts) makes each work order once per due
// occurrence, from the cron every 15 minutes, from the button, and straight after a reading.
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import {
  BASIS_LABELS,
  JOB_TYPE_LABELS,
  PRIORITY_LABELS,
  TRIGGER_LABELS,
  UNIT_LABELS,
  dateText,
  dateTimeText,
  localToday,
  minutesText,
  mtPage,
  mtPath,
  nextDueText,
  triggerText,
  useSites,
  type Meter,
  type MtMe,
  type Schedule,
} from './api';
import { PriorityBadge, Props, Section, WoBadge, options } from './common';
import { AssetPicker, PersonSelect, useAssetLabel, type PickedAsset } from './pickers';

type View = 'schedules' | 'calendar' | 'templates';

export function PreventivePage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Preventive maintenance');
  const [params, setParams] = useSearchParams();
  const view = (params.get('view') as View) || 'schedules';
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const qc = useQueryClient();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const generate = async () => {
    setBusy(true);
    try {
      const r = await post<{ made: { number: string; workOrderId: string }[]; skipped: number }>(mtPath(companyId, '/pm/generate'), { today: localToday() });
      toast(r.made.length ? `${r.made.length} work ${r.made.length === 1 ? 'order' : 'orders'} made: ${r.made.map((m) => m.number).join(', ')}` : 'Nothing is due: no work orders made');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack">
      <div className="row wrap">
        <nav className="tabs grow" aria-label="Preventive maintenance">
          {([['schedules', 'Schedules'], ['calendar', 'Calendar'], ['templates', 'Templates for asset classes']] as [View, string][]).map(([v, l]) => (
            <button key={v} className={`tab${view === v ? ' active' : ''}`} aria-current={view === v ? 'page' : undefined} onClick={() => set('view', v === 'schedules' ? '' : v)}>{l}</button>
          ))}
        </nav>
        {me.can.managePm ? <button className="btn" disabled={busy} onClick={generate}><Icon name="refresh" /> {busy ? 'Generating…' : 'Generate due work orders now'}</button> : null}
        {me.can.managePm && view !== 'templates' ? <Link className="btn primary" to={mtPage(companyId, '/preventive/new')}><Icon name="plus" /> New schedule</Link> : null}
        {me.can.managePm && view === 'templates' ? <Link className="btn primary" to={mtPage(companyId, '/preventive/templates/new')}><Icon name="plus" /> New template</Link> : null}
      </div>
      <p className="muted small">Work orders are made automatically when each schedule comes due (checked every 15 minutes), and at once when a reading triggers one. A schedule never makes two work orders for the same due date or reading.</p>
      {view === 'calendar' ? <Calendar companyId={companyId} /> : view === 'templates' ? <Templates companyId={companyId} /> : <Schedules companyId={companyId} me={me} params={params} set={set} />}
    </div>
  );
}

function Schedules({ companyId, me, params, set }: { companyId: string; me: MtMe; params: URLSearchParams; set: (k: string, v: string) => void }) {
  const g = (k: string) => params.get(k) ?? '';
  const sites = useSites(companyId);
  const query = new URLSearchParams();
  for (const k of ['siteId', 'trigger', 'active', 'q']) if (g(k)) query.set(k, g(k));
  const list = useQuery({ queryKey: ['mt', companyId, 'pm', 'schedules', query.toString()], queryFn: () => get<{ schedules: Schedule[] }>(mtPath(companyId, `/pm/schedules?${query}`)) });
  return (
    <div className="stack">
      <div className="mt-filters">
        <div className="field"><label htmlFor="pm-q">Search</label><input id="pm-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Schedule or asset" /></div>
        <div className="field"><label htmlFor="pm-trigger">Trigger</label><select id="pm-trigger" className="select" value={g('trigger')} onChange={(e) => set('trigger', e.target.value)}><option value="">Any</option>{options(TRIGGER_LABELS)}</select></div>
        <div className="field"><label htmlFor="pm-active">State</label><select id="pm-active" className="select" value={g('active')} onChange={(e) => set('active', e.target.value)}><option value="">Active and paused</option><option value="1">Active</option><option value="0">Paused</option></select></div>
        <div className="field"><label htmlFor="pm-site">Site</label><select id="pm-site" className="select" value={g('siteId')} onChange={(e) => set('siteId', e.target.value)}><option value="">All sites</option>{(sites.data?.sites ?? []).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}</select></div>
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : !list.data ? <Loading /> : !list.data.schedules.length ? (
        <EmptyState icon="calendar" title="No preventive maintenance yet">
          {me.can.managePm ? 'Make a schedule for an asset (every so many days, weeks, months or meter units, or when a reading is outside its limits), or a template that covers a whole class of assets.' : 'Supervisors and administrators set up preventive maintenance.'}
        </EmptyState>
      ) : (
        <table className="data-table mt-table">
          <thead><tr><th>Schedule</th><th>Asset</th><th>Trigger</th><th>Next</th><th>State</th></tr></thead>
          <tbody>
            {list.data.schedules.map((s) => (
              <tr key={s.id}>
                <td data-label="Schedule"><Link className="mt-primary" to={mtPage(companyId, `/preventive/${s.id}`)}>{s.name}</Link>{s.templateName ? <div className="muted small">From template {s.templateName}</div> : null}</td>
                <td data-label="Asset"><Link to={mtPage(companyId, `/assets/${s.assetId}`)}>{s.assetNumber} {s.assetName}</Link></td>
                <td data-label="Trigger">{triggerText(s)}</td>
                <td data-label="Next">{s.openWorkOrder ? <Link to={mtPage(companyId, `/work-orders/${s.openWorkOrder.id}`)}>{nextDueText(s)}</Link> : <span className={s.nextDueDate && s.nextDueDate < localToday() ? 'mt-overdue' : ''}>{nextDueText(s)}</span>}</td>
                <td data-label="State">{s.active ? <span className="badge success">Active</span> : <span className="badge">Paused</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ the calendar

interface Forecast {
  from: string;
  to: string;
  today: string;
  entries: { date: string; kind: 'open' | 'due' | 'projected'; scheduleId: string; name: string; assetId: string; assetNumber: string; assetName: string; triggerKind: string; workOrder?: { id: string; number: string; status: string }; note?: string }[];
  unforecast: { scheduleId: string; name: string; assetNumber: string; reason: string }[];
}

const KIND_BADGE: Record<string, [string, string]> = { open: ['Work order open', 'warning'], due: ['Due', 'accent'], projected: ['Projected', ''] };

function Calendar({ companyId }: { companyId: string }) {
  const today = localToday();
  const plus = (n: number) => { const d = new Date(`${today}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(plus(90));
  const [site, setSite] = useState('');
  const sites = useSites(companyId);
  const q = useQuery({ queryKey: ['mt', companyId, 'pm', 'forecast', from, to, site], queryFn: () => get<Forecast>(mtPath(companyId, `/pm/forecast?from=${from}&to=${to}&today=${today}${site ? `&siteId=${site}` : ''}`)) });
  const months = new Map<string, Forecast['entries']>();
  for (const e of q.data?.entries ?? []) months.set(e.date.slice(0, 7), [...(months.get(e.date.slice(0, 7)) ?? []), e]);
  const monthName = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return (
    <div className="stack">
      <div className="mt-filters">
        <div className="field"><label htmlFor="pmc-from">From</label><input id="pmc-from" className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value || today)} /></div>
        <div className="field"><label htmlFor="pmc-to">To</label><input id="pmc-to" className="input" type="date" value={to} onChange={(e) => setTo(e.target.value || plus(90))} /></div>
        <div className="field"><label htmlFor="pmc-site">Site</label><select id="pmc-site" className="select" value={site} onChange={(e) => setSite(e.target.value)}><option value="">All sites</option>{(sites.data?.sites ?? []).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}</select></div>
      </div>
      <p className="muted small">Open work orders, the next due date of each time-based schedule and the dates after it as if each is done on time, and meter-based schedules projected from the meter’s average daily use over the last 90 days.</p>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : !q.data.entries.length ? <p className="muted">Nothing is due in this period.</p> : (
        [...months.entries()].map(([m, entries]) => (
          <Section key={m} title={monthName(m)}>
            <ul className="mt-cal">
              {entries.map((e, i) => (
                <li key={`${e.scheduleId}-${e.date}-${i}`} className="mt-cal-row">
                  <span className={`mt-cal-date${e.date < q.data!.today ? ' mt-overdue' : ''}`}>{dateText(e.date)}</span>
                  <span className={`badge ${KIND_BADGE[e.kind][1]}`}>{KIND_BADGE[e.kind][0]}</span>
                  <span className="grow">
                    <Link to={mtPage(companyId, `/preventive/${e.scheduleId}`)}>{e.name}</Link> on <Link to={mtPage(companyId, `/assets/${e.assetId}`)}>{e.assetNumber} {e.assetName}</Link>
                    {e.workOrder ? <> · <Link className="mt-num" to={mtPage(companyId, `/work-orders/${e.workOrder.id}`)}>{e.workOrder.number}</Link></> : null}
                    {e.note ? <span className="muted small"> · {e.note}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        ))
      )}
      {q.data?.unforecast.length ? (
        <Section title="Not on the calendar">
          <ul className="mt-docs small">
            {q.data.unforecast.map((u) => <li key={u.scheduleId}><Link to={mtPage(companyId, `/preventive/${u.scheduleId}`)}>{u.name}</Link> ({u.assetNumber}): {u.reason}</li>)}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ the schedule form (schedules and templates)

interface Def {
  name: string;
  description: string;
  triggerKind: string;
  intervalN: string;
  intervalUnit: string;
  basis: string;
  meterInterval: string;
  condBelow: string;
  condAbove: string;
  startDate: string;
  jobType: string;
  priority: string;
  tasks: string;
  parts: string;
  hours: string;
  leadDays: string;
  trade: string;
  assignedTo: string;
  inspectionTemplateId: string;
  instructions: string;
  safety: string;
  meterId: string;
}

const blank = (): Def => ({ name: '', description: '', triggerKind: 'time', intervalN: '1', intervalUnit: 'month', basis: 'completion', meterInterval: '', condBelow: '', condAbove: '', startDate: localToday(), jobType: 'preventive', priority: 'medium', tasks: '', parts: '', hours: '', leadDays: '0', trade: '', assignedTo: '', inspectionTemplateId: '', instructions: '', safety: '', meterId: '' });

function fromSchedule(s: Partial<Schedule> & { name: string }): Def {
  return {
    name: s.name,
    description: s.description ?? '',
    triggerKind: s.triggerKind ?? 'time',
    intervalN: s.intervalN != null ? String(s.intervalN) : '1',
    intervalUnit: s.intervalUnit ?? 'month',
    basis: s.basis ?? 'completion',
    meterInterval: s.meterInterval != null ? String(s.meterInterval) : '',
    condBelow: s.condBelow != null ? String(s.condBelow) : '',
    condAbove: s.condAbove != null ? String(s.condAbove) : '',
    startDate: s.startDate ?? localToday(),
    jobType: s.jobType ?? 'preventive',
    priority: s.priority ?? 'medium',
    tasks: (s.tasks ?? []).join('\n'),
    parts: (s.parts ?? []).map((p) => `${p.quantity} x ${p.part}`).join('\n'),
    hours: s.estimatedMinutes != null ? String(s.estimatedMinutes / 60) : '',
    leadDays: String(s.leadDays ?? 0),
    trade: s.trade ?? '',
    assignedTo: s.assignedTo ?? '',
    inspectionTemplateId: s.inspectionTemplateId ?? '',
    instructions: s.instructions ?? '',
    safety: s.safety ?? '',
    meterId: s.meterId ?? '',
  };
}

const num = (v: string) => (v.trim() === '' ? null : Number(v));

/** "2 x Filter" or "Filter" per line. */
function partsOf(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = /^(\d+(?:\.\d+)?)\s*[x×]\s*(.+)$/i.exec(l);
      return m ? { part: m[2].trim(), quantity: Number(m[1]) } : { part: l, quantity: 1 };
    });
}

function defBody(f: Def, edit: boolean) {
  const out: Record<string, unknown> = {
    name: f.name.trim(),
    description: f.description,
    jobType: f.jobType,
    priority: f.priority,
    tasks: f.tasks.split('\n').map((t) => t.trim()).filter(Boolean),
    parts: partsOf(f.parts),
    estimatedHours: num(f.hours),
    leadDays: Number(f.leadDays) || 0,
    trade: f.trade,
    assignedTo: f.assignedTo || null,
    inspectionTemplateId: f.inspectionTemplateId || null,
    instructions: f.instructions,
    safety: f.safety,
  };
  if (!edit) out.triggerKind = f.triggerKind;
  if (f.triggerKind === 'time') Object.assign(out, { intervalN: Number(f.intervalN) || 1, intervalUnit: f.intervalUnit, basis: f.basis, ...(edit ? {} : { startDate: f.startDate || undefined }) });
  if (f.triggerKind === 'meter') Object.assign(out, { meterInterval: num(f.meterInterval) });
  if (f.triggerKind === 'condition') Object.assign(out, { condBelow: num(f.condBelow), condAbove: num(f.condAbove) });
  return out;
}

function DefinitionFields({ companyId, me, f, setF, edit, meters }: { companyId: string; me: MtMe; f: Def; setF: (fn: (x: Def) => Def) => void; edit: boolean; meters?: Meter[] | null }) {
  const templates = useQuery({ queryKey: ['mt', companyId, 'insp-templates'], queryFn: () => get<{ templates: { id: string; name: string }[] }>(mtPath(companyId, '/inspection-templates')) });
  const trades = useQuery({ queryKey: ['mt', companyId, 'trades'], queryFn: () => get<{ trades: { id: string; name: string; archived: boolean }[] }>(mtPath(companyId, '/trades')) });
  const v = (k: keyof Def) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  return (
    <>
      <div className="crm-form-grid">
        <div className="field crm-span"><label htmlFor="pmf-name">Name</label><input id="pmf-name" className="input" maxLength={200} value={f.name} onChange={v('name')} placeholder="For example Monthly press service" /></div>
        <div className="field crm-span"><label htmlFor="pmf-desc">What the work order says (optional)</label><input id="pmf-desc" className="input" maxLength={5000} value={f.description} onChange={v('description')} /></div>
        <div className="field"><label htmlFor="pmf-trigger">Trigger</label><select id="pmf-trigger" className="select" disabled={edit} value={f.triggerKind} onChange={v('triggerKind')}>{options(TRIGGER_LABELS)}</select></div>
        {f.triggerKind === 'time' ? (
          <>
            <div className="field"><label htmlFor="pmf-n">Every</label><input id="pmf-n" className="input" type="number" min="1" step="1" value={f.intervalN} onChange={v('intervalN')} /></div>
            <div className="field"><label htmlFor="pmf-unit">Unit</label><select id="pmf-unit" className="select" value={f.intervalUnit} onChange={v('intervalUnit')}>{options(UNIT_LABELS)}</select></div>
            <div className="field"><label htmlFor="pmf-basis">Counted</label><select id="pmf-basis" className="select" value={f.basis} onChange={v('basis')}>{options(BASIS_LABELS)}</select></div>
            {!edit ? <div className="field"><label htmlFor="pmf-start">First due</label><input id="pmf-start" className="input" type="date" value={f.startDate} onChange={v('startDate')} /></div> : null}
          </>
        ) : null}
        {f.triggerKind !== 'time' && meters !== undefined ? (
          <div className="field">
            <label htmlFor="pmf-meter">{f.triggerKind === 'meter' ? 'Meter' : 'Meter or gauge'}</label>
            <select id="pmf-meter" className="select" value={f.meterId} onChange={v('meterId')}>
              <option value="">{meters === null ? 'Choose the asset first' : meters.some((m) => !m.archived && (f.triggerKind !== 'meter' || m.rising)) ? 'Choose' : 'The asset has none: add one on its page'}</option>
              {(meters ?? []).filter((m) => !m.archived && (f.triggerKind !== 'meter' || m.rising)).map((m) => <option key={m.id} value={m.id}>{m.name}{m.unit ? ` (${m.unit})` : ''}</option>)}
            </select>
          </div>
        ) : null}
        {f.triggerKind === 'meter' ? <div className="field"><label htmlFor="pmf-mi">Every (meter units)</label><input id="pmf-mi" className="input" type="number" min="0" step="any" value={f.meterInterval} onChange={v('meterInterval')} /></div> : null}
        {f.triggerKind === 'condition' ? (
          <>
            <div className="field"><label htmlFor="pmf-below">When a reading is below</label><input id="pmf-below" className="input" type="number" step="any" value={f.condBelow} onChange={v('condBelow')} placeholder="The gauge's minimum" /></div>
            <div className="field"><label htmlFor="pmf-above">or above</label><input id="pmf-above" className="input" type="number" step="any" value={f.condAbove} onChange={v('condAbove')} placeholder="The gauge's maximum" /></div>
          </>
        ) : null}
        <div className="field"><label htmlFor="pmf-lead">Lead days</label><input id="pmf-lead" className="input" type="number" min="0" max="365" step="1" value={f.leadDays} onChange={v('leadDays')} /></div>
        <div className="field"><label htmlFor="pmf-type">Job type</label><select id="pmf-type" className="select" value={f.jobType} onChange={v('jobType')}><option value="preventive">{JOB_TYPE_LABELS.preventive}</option><option value="inspection">{JOB_TYPE_LABELS.inspection}</option></select></div>
        <div className="field"><label htmlFor="pmf-priority">Priority</label><select id="pmf-priority" className="select" value={f.priority} onChange={v('priority')}>{options(PRIORITY_LABELS)}</select></div>
        <div className="field"><label htmlFor="pmf-hours">Estimated hours</label><input id="pmf-hours" className="input" type="number" min="0" step="0.25" value={f.hours} onChange={v('hours')} /></div>
        <div className="field">
          <label htmlFor="pmf-trade">Trade</label>
          <input id="pmf-trade" className="input" list="pmf-trades" maxLength={80} value={f.trade} onChange={v('trade')} />
          <datalist id="pmf-trades">{(trades.data?.trades ?? []).filter((t) => !t.archived).map((t) => <option key={t.id} value={t.name} />)}</datalist>
        </div>
        <PersonSelect me={me} id="pmf-tech" label="Technician" minRole="technician" value={f.assignedTo} onChange={(x) => setF((y) => ({ ...y, assignedTo: x }))} empty="Not assigned" />
        <div className="field"><label htmlFor="pmf-insp">Inspection</label><select id="pmf-insp" className="select" value={f.inspectionTemplateId} onChange={v('inspectionTemplateId')}><option value="">None</option>{(templates.data?.templates ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
        <div className="field crm-span"><label htmlFor="pmf-tasks">Tasks (one a line)</label><textarea id="pmf-tasks" className="textarea" rows={4} value={f.tasks} onChange={v('tasks')} /></div>
        <div className="field crm-span"><label htmlFor="pmf-parts">Required parts (one a line, for example 2 x Hydraulic filter)</label><textarea id="pmf-parts" className="textarea" rows={2} value={f.parts} onChange={v('parts')} /></div>
        <div className="field crm-span"><label htmlFor="pmf-ins">Instructions</label><textarea id="pmf-ins" className="textarea" rows={3} value={f.instructions} onChange={v('instructions')} /></div>
        <div className="field crm-span"><label htmlFor="pmf-safety">Safety requirements</label><textarea id="pmf-safety" className="textarea" rows={2} value={f.safety} onChange={v('safety')} /></div>
      </div>
      <p className="muted small">Lead days: a time-based work order is made that many days before it is due; a meter or condition work order is due that many days after it is made.</p>
    </>
  );
}

export function NewSchedulePage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('New preventive maintenance schedule');
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const [asset, setAsset] = useState<PickedAsset | null>(null);
  const [f, setF] = useState<Def>(blank);
  const [busy, setBusy] = useState(false);
  const preset = useAssetLabel(companyId, asset ? '' : (params.get('assetId') ?? ''));
  const assetId = asset?.id ?? params.get('assetId') ?? '';
  const meters = useQuery({ queryKey: ['mt', companyId, 'meters', assetId], queryFn: () => get<{ meters: Meter[] }>(mtPath(companyId, `/meters?assetId=${assetId}`)), enabled: !!assetId });
  const save = async () => {
    setBusy(true);
    try {
      const s = await post<Schedule>(mtPath(companyId, `/pm/schedules?today=${localToday()}`), { ...defBody(f, false), assetId, meterId: f.triggerKind === 'time' ? null : f.meterId || null });
      toast('Schedule saved');
      navigate(mtPage(companyId, `/preventive/${s.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  if (!me.can.managePm) return <p className="muted">Only supervisors and administrators set up preventive maintenance.</p>;
  return (
    <div className="stack">
      <h2 className="crm-subhead">New preventive maintenance schedule</h2>
      <section className="card card-pad stack">
        <AssetPicker companyId={companyId} id="pmf-asset" value={asset ?? preset} onChange={setAsset} allowNone={false} />
        <DefinitionFields companyId={companyId} me={me} f={f} setF={setF} edit={false} meters={assetId ? (meters.data?.meters ?? []) : null} />
        <div className="row wrap">
          <button className="btn primary" disabled={busy || !assetId || !f.name.trim()} onClick={save}>{busy ? 'Saving…' : 'Save schedule'}</button>
          <Link className="btn" to={mtPage(companyId, '/preventive')}>Cancel</Link>
        </div>
      </section>
    </div>
  );
}

interface ScheduleView {
  schedule: Schedule;
  occurrences: { id: string; key: string; dueDate: string; dueMeter: number | null; open: boolean; madeAt: number; workOrder: { id: string; number: string; status: any; completedAt: number | null; dueFinish: string | null }; onTime: boolean | null }[];
  can: { manage: boolean; edit: boolean };
}

export function ScheduleDetail({ companyId, me }: { companyId: string; me: MtMe }) {
  const { scheduleId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['mt', companyId, 'pm', 'schedule', scheduleId], queryFn: () => get<ScheduleView>(mtPath(companyId, `/pm/schedules/${scheduleId}`)), retry: false });
  const [editing, setEditing] = useState(false);
  const [nextDue, setNextDue] = useState('');
  usePageTitle(q.data?.schedule.name ?? 'Schedule');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const s = q.data.schedule;
  const act = async (body: Record<string, unknown>, done: string) => {
    try {
      await patch(mtPath(companyId, `/pm/schedules/${s.id}`), body);
      toast(done);
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-head">
        <div>
          <h2 className="mt-title">{s.name}</h2>
          <div className="mt-badges">{s.active ? <span className="badge success">Active</span> : <span className="badge">Paused</span>}<span className="badge">{TRIGGER_LABELS[s.triggerKind]}</span><PriorityBadge priority={s.priority} /></div>
        </div>
        <div className="mt-head-actions">
          {q.data.can.edit ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Edit</button> : null}
          {q.data.can.manage ? <button className="btn" onClick={() => act({ active: !s.active }, s.active ? 'Paused' : 'Resumed')}>{s.active ? 'Pause' : 'Resume'}</button> : null}
        </div>
      </div>
      <div className="mt-grid">
        <aside className="stack">
          <Section title="Schedule">
            <Props
              items={[
                ['Asset', <Link key="a" to={mtPage(companyId, `/assets/${s.assetId}`)}>{s.assetNumber} {s.assetName}</Link>],
                ['Trigger', triggerText(s)],
                ['Meter', s.meterName ? `${s.meterName} (now ${s.meterTotal ?? 'no reading'}${s.meterUnit ? ` ${s.meterUnit}` : ''})` : null],
                ['Next', nextDueText(s)],
                ['Last done', s.lastDoneDate ? `${dateText(s.lastDoneDate)}${s.lastDoneMeter != null ? ` at ${s.lastDoneMeter}` : ''}` : 'Not yet'],
                ['Lead days', String(s.leadDays)],
                ['Template', s.templateName],
              ]}
            />
            {s.templateName ? <p className="muted small">This schedule follows its template: change the template to change it. You can pause it for this asset alone.</p> : null}
            {q.data.can.manage && s.triggerKind === 'time' && !s.openWorkOrder ? (
              <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); if (nextDue) void act({ nextDueDate: nextDue }, 'Next due date moved').then(() => setNextDue('')); }}>
                <label className="sr-only" htmlFor="pm-next">Move the next due date</label>
                <input id="pm-next" className="input" type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
                <button className="btn" disabled={!nextDue}>Move the next due date</button>
              </form>
            ) : null}
          </Section>
          <Section title="The work order it makes">
            <Props
              items={[
                ['Job type', JOB_TYPE_LABELS[s.jobType] ?? s.jobType],
                ['Estimated', minutesText(s.estimatedMinutes)],
                ['Trade', s.trade],
                ['Technician', s.assignedToName ?? 'Not assigned'],
                ['Inspection', s.inspectionTemplateName],
                ['Required parts', s.parts.map((p) => `${p.quantity} x ${p.part}`).join(', ')],
              ]}
            />
            {s.tasks.length ? <ol className="small">{s.tasks.map((t, i) => <li key={i}>{t}</li>)}</ol> : null}
            {s.safety ? <p className="mt-safety mt-pre small">{s.safety}</p> : null}
          </Section>
        </aside>
        <Section title={`Work orders made (${q.data.occurrences.length})`}>
          {q.data.occurrences.length ? (
            <table className="data-table mt-table">
              <thead><tr><th>Due</th><th>Work order</th><th>Status</th><th>Done</th></tr></thead>
              <tbody>
                {q.data.occurrences.map((o) => (
                  <tr key={o.id}>
                    <td data-label="Due">{dateText(o.dueDate)}{o.dueMeter != null ? <div className="muted small">at {o.dueMeter}</div> : null}</td>
                    <td data-label="Work order"><Link className="mt-num" to={mtPage(companyId, `/work-orders/${o.workOrder.id}`)}>{o.workOrder.number}</Link><div className="muted small">Made {dateTimeText(o.madeAt)}</div></td>
                    <td data-label="Status"><WoBadge status={o.workOrder.status} /></td>
                    <td data-label="Done">{o.onTime === null ? '' : o.onTime ? <span className="badge success">On time</span> : <span className="badge warning">Late</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="muted small">None yet. The first is made when it comes due.</p>}
        </Section>
      </div>
      {editing ? <EditDefinition companyId={companyId} me={me} title={`Edit ${s.name}`} initial={fromSchedule(s)} path={`/pm/schedules/${s.id}`} onClose={() => setEditing(false)} /> : null}
    </div>
  );
}

function EditDefinition({ companyId, me, title, initial, path, onClose }: { companyId: string; me: MtMe; title: string; initial: Def; path: string; onClose: () => void }) {
  const [f, setF] = useState<Def>(initial);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();
  const save = async () => {
    setBusy(true);
    try {
      await patch(mtPath(companyId, path), defBody(f, true));
      toast('Saved');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.name.trim()} onClick={save}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <DefinitionFields companyId={companyId} me={me} f={f} setF={setF} edit />
    </Modal>
  );
}

// ------------------------------------------------------------------ templates for asset classes

interface Template {
  id: string;
  name: string;
  assetCategory: string;
  siteId: string | null;
  siteName: string | null;
  meterName: string;
  schedules: number;
  triggerKind: 'time' | 'meter' | 'condition';
  intervalN: number | null;
  intervalUnit: 'day' | 'week' | 'month' | null;
  basis: 'completion' | 'fixed';
  meterInterval: number | null;
  condBelow: number | null;
  condAbove: number | null;
  active: boolean;
}

function Templates({ companyId }: { companyId: string }) {
  const q = useQuery({ queryKey: ['mt', companyId, 'pm', 'templates'], queryFn: () => get<{ templates: Template[] }>(mtPath(companyId, '/pm/templates')) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  if (!q.data.templates.length) return <EmptyState icon="template" title="No templates yet">A template covers a whole class of assets: every asset with its category (in a site, if you choose one) gets a schedule of its own, including assets added later.</EmptyState>;
  return (
    <table className="data-table mt-table">
      <thead><tr><th>Template</th><th>Asset class</th><th>Trigger</th><th>Schedules</th><th>State</th></tr></thead>
      <tbody>
        {q.data.templates.map((t) => (
          <tr key={t.id}>
            <td data-label="Template"><Link className="mt-primary" to={mtPage(companyId, `/preventive/templates/${t.id}`)}>{t.name}</Link></td>
            <td data-label="Asset class">{t.assetCategory}{t.siteName ? ` in ${t.siteName}` : ''}</td>
            <td data-label="Trigger">{triggerText({ ...t, meterUnit: t.meterName || null })}</td>
            <td data-label="Schedules" className="mt-num">{t.schedules}</td>
            <td data-label="State">{t.active ? <span className="badge success">Active</span> : <span className="badge">Paused</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function NewTemplatePage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('New preventive maintenance template');
  const navigate = useNavigate();
  const toast = useToast();
  const sites = useSites(companyId);
  const cats = useQuery({ queryKey: ['mt', companyId, 'assets', 'categories'], queryFn: () => get<{ categories: string[] }>(mtPath(companyId, '/assets?limit=1')) });
  const [f, setF] = useState<Def>(blank);
  const [cls, setCls] = useState({ assetCategory: '', siteId: '', meterName: '' });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      const r = await post<{ template: Template; applied: { made: string[]; skipped: { assetNumber: string; reason: string }[] } }>(mtPath(companyId, `/pm/templates?today=${localToday()}`), { ...defBody(f, false), assetCategory: cls.assetCategory, siteId: cls.siteId || null, meterName: cls.meterName });
      toast(`Template saved: ${r.applied.made.length} ${r.applied.made.length === 1 ? 'asset has' : 'assets have'} a schedule from it${r.applied.skipped.length ? `, ${r.applied.skipped.length} skipped` : ''}`);
      navigate(mtPage(companyId, `/preventive/templates/${r.template.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  if (!me.can.managePm) return <p className="muted">Only supervisors and administrators set up preventive maintenance.</p>;
  return (
    <div className="stack">
      <h2 className="crm-subhead">New template for a class of assets</h2>
      <section className="card card-pad stack">
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="pmt-cat">Asset category</label>
            <input id="pmt-cat" className="input" list="pmt-cats" maxLength={80} value={cls.assetCategory} onChange={(e) => setCls((x) => ({ ...x, assetCategory: e.target.value }))} />
            <datalist id="pmt-cats">{(cats.data?.categories ?? []).map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="field"><label htmlFor="pmt-site">Only in the site</label><select id="pmt-site" className="select" value={cls.siteId} onChange={(e) => setCls((x) => ({ ...x, siteId: e.target.value }))}><option value="">Every site</option>{(sites.data?.sites ?? []).filter((s) => !s.archived).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}</select></div>
          {f.triggerKind !== 'time' ? <div className="field"><label htmlFor="pmt-meter">Meter or gauge name on each asset</label><input id="pmt-meter" className="input" maxLength={120} value={cls.meterName} onChange={(e) => setCls((x) => ({ ...x, meterName: e.target.value }))} placeholder="For example Hours" /></div> : null}
        </div>
        <DefinitionFields companyId={companyId} me={me} f={f} setF={setF} edit={false} />
        <div className="row wrap">
          <button className="btn primary" disabled={busy || !f.name.trim() || !cls.assetCategory.trim()} onClick={save}>{busy ? 'Saving…' : 'Save template'}</button>
          <Link className="btn" to={mtPage(companyId, '/preventive?view=templates')}>Cancel</Link>
        </div>
      </section>
    </div>
  );
}

export function TemplateDetail({ companyId, me }: { companyId: string; me: MtMe }) {
  const { templateId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['mt', companyId, 'pm', 'template', templateId], queryFn: () => get<{ template: Template & Schedule; schedules: Schedule[]; can: { manage: boolean } }>(mtPath(companyId, `/pm/templates/${templateId}`)), retry: false });
  const [editing, setEditing] = useState(false);
  usePageTitle(q.data?.template.name ?? 'Template');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const t = q.data.template;
  const run = async (fn: () => Promise<any>, done: (r: any) => string) => {
    try {
      const r = await fn();
      toast(done(r));
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-head">
        <div>
          <h2 className="mt-title">{t.name}</h2>
          <div className="mt-badges">{t.active ? <span className="badge success">Active</span> : <span className="badge">Paused</span>}<span className="badge">{TRIGGER_LABELS[t.triggerKind]}</span></div>
        </div>
        {q.data.can.manage ? (
          <div className="mt-head-actions">
            <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Edit</button>
            {t.active ? <button className="btn" onClick={() => run(() => post(mtPath(companyId, `/pm/templates/${t.id}/apply?today=${localToday()}`), {}), (r) => `${r.made.length} new ${r.made.length === 1 ? 'schedule' : 'schedules'}${r.skipped.length ? `; skipped: ${r.skipped.map((x: any) => `${x.assetNumber} (${x.reason})`).join(', ')}` : ''}`)}>Apply to new assets now</button> : null}
            <button className="btn" onClick={() => run(() => patch(mtPath(companyId, `/pm/templates/${t.id}`), { active: !t.active }), () => (t.active ? 'Paused' : 'Resumed'))}>{t.active ? 'Pause' : 'Resume'}</button>
          </div>
        ) : null}
      </div>
      <Section title="Covers">
        <p>Every asset of the category <strong>{t.assetCategory}</strong>{t.siteName ? <> in <strong>{t.siteName}</strong></> : ' in every site'}: {triggerText({ ...t, meterUnit: null })}{t.meterName ? ` on the meter named ${t.meterName}` : ''}. Assets added later get their schedule when the next generation runs.</p>
      </Section>
      <Section title={`Schedules from it (${q.data.schedules.length})`}>
        {q.data.schedules.length ? (
          <ul className="mt-docs">
            {q.data.schedules.map((s) => (
              <li key={s.id} className="row wrap">
                <Link className="mt-num" to={mtPage(companyId, `/assets/${s.assetId}`)}>{s.assetNumber}</Link>
                <Link className="grow" to={mtPage(companyId, `/preventive/${s.id}`)}>{s.assetName}</Link>
                <span className="small">{nextDueText(s)}</span>
                {s.active ? null : <span className="badge">Paused</span>}
              </li>
            ))}
          </ul>
        ) : <p className="muted small">No asset of this class yet.</p>}
      </Section>
      {editing ? <EditDefinition companyId={companyId} me={me} title={`Edit ${t.name}`} initial={fromSchedule(t)} path={`/pm/templates/${t.id}`} onClose={() => setEditing(false)} /> : null}
    </div>
  );
}
