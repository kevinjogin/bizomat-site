// The Schedule tab of the task panel: one task's scheduling data, its dependencies, the latest approved baseline,
// progress and cost records. Everything comes from the server (GET /api/items/:id/schedule, which runs the project's
// schedule calculation); nothing is recalculated here. Each change goes to the API, then the board's schedule data is
// refreshed (invalidateControls), so every view shows the new dates and critical path.
// Progressive disclosure: identity, dates and task settings first; the measures most tasks never need (physical
// percent, work and units, earning methods, planned value curves) sit in the collapsible Advanced part.

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CONSTRAINT_LABELS,
  CONSTRAINT_TYPES,
  CRITICALITY_LABELS,
  DURATION_UNITS,
  EARNING_METHODS,
  EARNING_METHOD_LABELS,
  LINK_TYPES,
  LINK_TYPE_LABELS,
  PV_PROFILES,
  PV_PROFILE_LABELS,
  SCHEDULING_TYPES,
  SCHEDULING_TYPE_LABELS,
  formatLink,
  minutesToUnit,
  type ConstraintType,
  type DurationUnit,
  type EarningMethod,
  type LinkDTO,
  type LinkType,
  type PvProfile,
  type SchedulingType,
  type TaskScheduleDTO,
} from '../../../shared/schedule';
import { formatScaled, sumScaled, formatMoney } from '../../../shared/money';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading, Switch } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { CriticalBadge, TaskKey, fmtDate, fmtDays, invalidateControls } from './schedule';

// ---------------------------------------------------------------- the API's answer (src/worker/routes/schedule.ts)

interface EarningMilestone {
  name: string;
  weight: number;
  doneOn?: string | null;
}

interface ProgressEntry {
  id: string;
  as_of: string;
  percent_complete: number | null;
  physical_percent: number | null;
  units_done: number | null;
  note: string;
  created_by: string;
  created_at: number;
}

interface CostEntry {
  id: string;
  spent_on: string;
  amount: string;
  currency: string;
  category: string;
  note: string;
  created_by: string;
  created_at: number;
}

/** One task against the latest approved baseline (services/schedule/baselines.ts, BaselineComparisonRow). */
interface BaselineRow {
  inBaseline: boolean;
  baselineStart: string | null;
  baselineFinish: string | null;
  baselineDurationDays: number | null;
  currentStart: string | null;
  currentFinish: string | null;
  currentDurationDays: number | null;
  actualStart: string | null;
  actualFinish: string | null;
  startVarianceDays: number | null;
  finishVarianceDays: number | null;
  durationVarianceDays: number | null;
  progressVariance: number | null;
  plannedPercent: number | null;
  percentComplete: number | null;
}

export interface ItemSchedule {
  task: TaskScheduleDTO;
  earning: { milestones?: EarningMilestone[]; unitsTotal?: number | null; unitsDone?: number | null };
  pv: { points?: [number, number][]; milestones?: { date: string; weight: number }[] };
  links: LinkDTO[];
  names: Record<string, { key: string | null; name: string; wbs: string; summary: boolean }>;
  hoursPerDay: number;
  daysPerWeek: number;
  statusDate: string;
  timelineColumnId: string | null;
  progress: ProgressEntry[];
  costs: CostEntry[] | null;
  baseline: { number: number; name: string; row: BaselineRow } | null;
  canEdit: boolean;
  canUpdateProgress: boolean;
  canViewFinance: boolean;
  canEditFinance: boolean;
}

// ---------------------------------------------------------------- shared helpers

type Body = Record<string, unknown>;

interface Ctx {
  d: ItemSchedule;
  t: TaskScheduleDTO;
  /** Changes to the task's scheduling data (not on an archived board). */
  canEdit: boolean;
  /** False on an archived board: nothing can be recorded. */
  writable: boolean;
  boardId: string;
  /** PATCH /api/items/:id/schedule. Resolves false, after showing the server's message, when the change is refused. */
  save: (body: Body, done?: string) => Promise<boolean>;
  /** Any other request, with the same refresh and error handling. */
  run: (req: () => Promise<unknown>, done?: string) => Promise<boolean>;
  memberName: (id: string) => string | undefined;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const pct = (v: number | null | undefined) => (v == null ? '—' : `${round2(v)}%`);
const workDays = (v: number | null | undefined) => (v == null ? '—' : `${round2(v)} working day${Math.abs(v) === 1 ? '' : 's'}`);
const span = (a: string | null, b: string | null) => (a || b ? `${fmtDate(a)} to ${fmtDate(b)}` : '—');
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const UNIT_LABELS: Record<DurationUnit, string> = { minutes: 'minutes', hours: 'hours', days: 'working days', weeks: 'weeks' };
const SHORT_UNIT: Record<DurationUnit, string> = { minutes: 'min', hours: 'h', days: 'd', weeks: 'w' };
const startsWithStart = (c: ConstraintType) => c === 'SNET' || c === 'SNLT' || c === 'MSO';

/** "1.2.10" after "1.2.9". */
function wbsCompare(a: string, b: string) {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? -1) - (y[i] ?? -1);
    if (d) return d;
  }
  return 0;
}

/** A labelled value in the two-column grid. */
function Item({ label, children, wide, hint }: { label: string; children: ReactNode; wide?: boolean; hint?: ReactNode }) {
  return (
    <div className={`ts-field${wide ? ' ts-wide' : ''}`}>
      <span className="ts-label">{label}</span>
      <div className="ts-value">{children}</div>
      {hint ? <p className="ts-hint">{hint}</p> : null}
    </div>
  );
}

/** A date saved when the field loses focus (or on Enter); it goes back to the saved value when the server refuses it. */
function DateInput({ value, label, onSave, max }: { value: string | null; label: string; onSave: (v: string | null) => Promise<boolean>; max?: string }) {
  const [v, setV] = useState(value ?? '');
  useEffect(() => setV(value ?? ''), [value]);
  const commit = async () => {
    const next = v || null;
    if (next === value) return;
    if (next && !isDate(next)) return setV(value ?? '');
    if (!(await onSave(next))) setV(value ?? '');
  };
  return (
    <input
      type="date"
      className="input sm ts-date"
      aria-label={label}
      value={v}
      max={max}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => void commit()}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
    />
  );
}

/** A number saved when the field loses focus (or on Enter), checked against its range first. */
function NumberInput({ value, label, onSave, min, max, suffix, rangeText }: { value: number | null; label: string; onSave: (v: number | null) => Promise<boolean>; min?: number; max?: number; suffix?: string; rangeText?: string }) {
  const toast = useToast();
  const text = value == null ? '' : String(round2(value));
  const [v, setV] = useState(text);
  useEffect(() => setV(text), [text]);
  const commit = async () => {
    if (v.trim() === text) return;
    const n = v.trim() === '' ? null : Number(v);
    if (n != null && (!Number.isFinite(n) || (min != null && n < min) || (max != null && n > max))) {
      toast(rangeText ?? `Enter a number${min != null ? ` of at least ${min}` : ''}${max != null ? ` and at most ${max}` : ''}`, 'error');
      return setV(text);
    }
    if (!(await onSave(n))) setV(text);
  };
  return (
    <span className="ts-inline">
      <input
        type="number"
        className="input sm ts-num"
        inputMode="decimal"
        step="any"
        min={min}
        max={max}
        aria-label={label}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
      />
      {suffix ? <span className="muted small">{suffix}</span> : null}
    </span>
  );
}

// ---------------------------------------------------------------- the tab

export function TaskScheduleTab({ itemId, boardId, archived = false, memberName }: { itemId: string; boardId: string; archived?: boolean; memberName: (id: string) => string | undefined }) {
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['item-schedule', itemId], queryFn: () => get<ItemSchedule>(`/items/${itemId}/schedule`) });
  if (q.isLoading) return <Loading label="Calculating the schedule…" />;
  if (q.error || !q.data) return <ErrorBox error={q.error ?? new Error('The schedule is not available')} retry={() => q.refetch()} />;
  const d = q.data;
  const t = d.task;

  const run = async (req: () => Promise<unknown>, done?: string) => {
    try {
      await req();
      invalidateControls(qc, boardId);
      void qc.invalidateQueries({ queryKey: ['item', itemId] });
      void qc.invalidateQueries({ queryKey: ['item-activity', itemId] });
      if (done) toast(done);
      return true;
    } catch (e) {
      toast(errorMessage(e), 'error');
      return false;
    }
  };
  const c: Ctx = {
    d,
    t,
    canEdit: d.canEdit && !archived,
    writable: !archived,
    boardId,
    run,
    save: (body, done) => run(() => patch(`/items/${itemId}/schedule`, body), done),
    memberName,
  };

  return (
    <div className="ts">
      <Identity t={t} />
      {t.conflicts.length ? (
        <ul className="pc-warnings" aria-label="Scheduling conflicts">
          {t.conflicts.map((m) => <li key={m}>{m}</li>)}
        </ul>
      ) : null}
      <DatesSection c={c} />
      <SettingsSection c={c} />
      <Advanced c={c} />
      <Dependencies c={c} />
      {d.baseline ? <BaselineSection c={c} /> : null}
      <ProgressSection c={c} />
      {d.canViewFinance && d.costs ? <CostsSection c={c} costs={d.costs} /> : null}
    </div>
  );
}

// ---------------------------------------------------------------- identity

function Identity({ t }: { t: TaskScheduleDTO }) {
  const marked = t.criticality === 'critical' || t.criticality === 'near_critical';
  return (
    <div className="ts-ident">
      <Item label="Task ID">{t.key ? <TaskKey value={t.key} copy /> : '—'}</Item>
      <Item label="WBS">{t.wbs || '—'}</Item>
      <Item label="Criticality">{marked ? <CriticalBadge criticality={t.criticality} /> : CRITICALITY_LABELS[t.criticality]}</Item>
      <Item label="Total float">
        <span className={(t.totalFloatDays ?? 0) < 0 ? 'pc-neg' : undefined}>{workDays(t.totalFloatDays)}</span>
      </Item>
      <Item label="Free float">{workDays(t.freeFloatDays)}</Item>
    </div>
  );
}

// ---------------------------------------------------------------- dates

function DatesSection({ c }: { c: Ctx }) {
  const { t, d } = c;
  const planEditable = c.canEdit && !t.summary && !!d.timelineColumnId;
  const actualEditable = c.canEdit && !t.summary;
  // Planned dates come in pairs: clearing one clears the plan; a first date also sets the other (from the duration
  // when there is one). Otherwise only the changed date is sent, and the duration follows the dates.
  const setPlanned = (which: 'start' | 'finish', v: string | null) => {
    if (!v) return c.save({ plannedStart: null, plannedFinish: null });
    const other = which === 'start' ? t.plannedFinish : t.plannedStart;
    if (!other) return which === 'start' && t.durationMinutes != null ? c.save({ plannedStart: v, applyDuration: true }) : c.save({ plannedStart: v, plannedFinish: v });
    return c.save(which === 'start' ? { plannedStart: v } : { plannedFinish: v });
  };
  return (
    <section className="pc-section" aria-labelledby="ts-dates">
      <h3 id="ts-dates">Dates</h3>
      {t.summary ? <p className="ts-hint ts-note">A summary task takes its dates from its subtasks.</p> : !d.timelineColumnId ? <p className="ts-hint ts-note">Add a timeline column to this project to hold planned dates.</p> : null}
      <div className="task-sched-grid">
        <Item label="Planned start">{planEditable ? <DateInput label="Planned start" value={t.plannedStart} onSave={(v) => setPlanned('start', v)} /> : fmtDate(t.plannedStart)}</Item>
        <Item label="Planned finish">{planEditable ? <DateInput label="Planned finish" value={t.plannedFinish} onSave={(v) => setPlanned('finish', v)} /> : fmtDate(t.plannedFinish)}</Item>
        <Item label="Duration" wide>
          <DurationEditor c={c} />
        </Item>
        <Item label="Elapsed">{t.elapsedDays == null ? '—' : `${t.elapsedDays} calendar day${t.elapsedDays === 1 ? '' : 's'}`}</Item>
        <Item label="Percent complete">
          {c.canEdit && !t.summary ? <NumberInput label="Percent complete" value={t.percentComplete} min={0} max={100} suffix="%" rangeText="Enter a percentage from 0 to 100" onSave={(v) => c.save({ percentComplete: v })} /> : pct(t.percentComplete)}
        </Item>
        <Item label="Early start and finish">{span(t.earlyStart, t.earlyFinish)}</Item>
        <Item label="Late start and finish">{span(t.lateStart, t.lateFinish)}</Item>
        <Item label="Actual start">{actualEditable ? <DateInput label="Actual start" value={t.actualStart} max={d.statusDate} onSave={(v) => c.save({ actualStart: v })} /> : fmtDate(t.actualStart)}</Item>
        <Item label="Actual finish">{actualEditable ? <DateInput label="Actual finish" value={t.actualFinish} max={d.statusDate} onSave={(v) => c.save({ actualFinish: v })} /> : fmtDate(t.actualFinish)}</Item>
      </div>
    </section>
  );
}

/** Duration as a value and a unit. With planned dates, the dates decide the duration: a new duration is applied with
 * "Set finish from duration". Without dates, it is saved when the field loses focus. */
function DurationEditor({ c }: { c: Ctx }) {
  const { t, d } = c;
  const inUnit = (u: DurationUnit) => (t.durationMinutes == null ? '' : String(round2(minutesToUnit(t.durationMinutes, u, d.hoursPerDay, d.daysPerWeek))));
  const [unit, setUnit] = useState<DurationUnit>(t.durationUnit);
  const [val, setVal] = useState(inUnit(t.durationUnit));
  useEffect(() => {
    setUnit(t.durationUnit);
    setVal(inUnit(t.durationUnit));
  }, [t.durationMinutes, t.durationUnit, d.hoursPerDay, d.daysPerWeek]);
  const toast = useToast();

  if (!c.canEdit || t.summary || t.milestone) {
    return (
      <>
        {t.milestone ? 'None (milestone)' : t.durationMinutes == null ? 'Not set' : `${inUnit(t.durationUnit)} ${UNIT_LABELS[t.durationUnit]}`}
        {!t.milestone && t.durationUnit !== 'days' && t.durationDays != null ? <span className="muted small">({workDays(t.durationDays)})</span> : null}
      </>
    );
  }
  const reset = () => {
    setUnit(t.durationUnit);
    setVal(inUnit(t.durationUnit));
  };
  const num = val.trim() === '' ? null : Number(val);
  const valid = num == null || (Number.isFinite(num) && num >= 0);
  const stored = inUnit(unit);
  const dirty = num == null ? stored !== '' : !valid || stored === '' || Number(stored) !== round2(num);
  const canApply = !!t.plannedStart && num != null && valid;
  const apply = async () => {
    if (!valid) return toast('Enter the duration as a number of 0 or more', 'error');
    if (!(await c.save({ duration: num, durationUnit: unit, applyDuration: true }, 'Planned finish set from the duration'))) reset();
  };
  const saveAlone = async () => {
    if (!dirty) return;
    if (!valid) {
      toast('Enter the duration as a number of 0 or more', 'error');
      return reset();
    }
    if (!(await c.save({ duration: num, durationUnit: unit }))) reset();
  };
  const changeUnit = (u: DurationUnit) => {
    // An unchanged number keeps the same length, shown in the new unit; a typed number is read in the new unit.
    if (!dirty) {
      setUnit(u);
      setVal(inUnit(u));
      void c.save({ durationUnit: u }).then((ok) => !ok && reset());
    } else setUnit(u);
  };
  return (
    <div className="ts-stack">
      <div className="ts-inline">
        <input
          type="number"
          className="input sm ts-num"
          inputMode="decimal"
          step="any"
          min={0}
          aria-label="Duration"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => { if (!t.plannedStart) void saveAlone(); }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            if (t.plannedStart) void apply();
            else (e.target as HTMLInputElement).blur();
          }}
        />
        <select className="select sm" aria-label="Duration unit" value={unit} onChange={(e) => changeUnit(e.target.value as DurationUnit)}>
          {DURATION_UNITS.map((u) => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
        </select>
        <button type="button" className={`btn sm${dirty && canApply ? ' primary' : ''}`} disabled={!canApply} title={t.plannedStart ? 'Keep the planned start and move the planned finish to fit the duration' : 'Set a planned start first'} onClick={() => void apply()}>
          <Icon name="calendar" size={13} /> Set finish from duration
        </button>
      </div>
      {t.durationUnit !== 'days' && t.durationDays != null && !dirty ? <p className="ts-hint">{workDays(t.durationDays)}</p> : null}
      {dirty && t.plannedStart ? <p className="ts-hint">The planned dates set the duration. Select Set finish from duration to apply the new one.</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------- task settings

function SettingsSection({ c }: { c: Ctx }) {
  const { t } = c;
  const [ctype, setCtype] = useState<ConstraintType>(t.constraintType);
  const [cdate, setCdate] = useState(t.constraintDate ?? '');
  useEffect(() => {
    setCtype(t.constraintType);
    setCdate(t.constraintDate ?? '');
  }, [t.constraintType, t.constraintDate]);
  const reset = () => {
    setCtype(t.constraintType);
    setCdate(t.constraintDate ?? '');
  };
  const saveConstraint = async (type: ConstraintType, date: string) => {
    if (type === 'ASAP') {
      if (t.constraintType !== 'ASAP' && !(await c.save({ constraintType: 'ASAP' }))) reset();
      return;
    }
    if (!isDate(date)) return; // waits for a date
    if (type === t.constraintType && date === t.constraintDate) return;
    if (!(await c.save({ constraintType: type, constraintDate: date }))) reset();
  };
  const changeType = (v: ConstraintType) => {
    // A new constraint starts from the task's own planned start or finish, whichever it is about.
    const date = cdate || (startsWithStart(v) ? t.plannedStart : t.plannedFinish) || '';
    setCtype(v);
    setCdate(date);
    void saveConstraint(v, date);
  };
  // A milestone has no duration: switching it on puts the finish on the start; switching it off takes the length
  // from the planned dates again.
  const setMilestone = (on: boolean) =>
    on
      ? c.save(t.plannedStart ? { milestone: true, applyDuration: true } : { milestone: true })
      : c.save(t.plannedStart && t.plannedFinish ? { milestone: false, plannedStart: t.plannedStart, plannedFinish: t.plannedFinish } : { milestone: false, duration: null });
  const editable = c.canEdit && !t.summary;
  return (
    <section className="pc-section" aria-labelledby="ts-settings">
      <h3 id="ts-settings">Task settings</h3>
      <div className="task-sched-grid">
        <Item label="Milestone">
          {editable ? (
            <span className="ts-inline">
              <Switch checked={t.milestone} label="Milestone" onChange={(v) => void setMilestone(v)} />
              <span className="small">{t.milestone ? 'Yes: a point in time, no duration' : 'No'}</span>
            </span>
          ) : t.milestone ? 'Yes' : 'No'}
        </Item>
        <Item label="Constraint" hint={ctype !== 'ASAP' && !cdate && editable ? 'Choose a date to save this constraint.' : undefined}>
          {editable ? (
            <span className="ts-inline">
              <select className="select sm" aria-label="Constraint type" value={ctype} onChange={(e) => changeType(e.target.value as ConstraintType)}>
                {CONSTRAINT_TYPES.map((k) => <option key={k} value={k}>{CONSTRAINT_LABELS[k]}</option>)}
              </select>
              {ctype !== 'ASAP' ? (
                <input
                  type="date"
                  className="input sm ts-date"
                  aria-label="Constraint date"
                  value={cdate}
                  onChange={(e) => setCdate(e.target.value)}
                  onBlur={() => void saveConstraint(ctype, cdate)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                />
              ) : null}
            </span>
          ) : (
            <>
              {CONSTRAINT_LABELS[t.constraintType]}
              {t.constraintType !== 'ASAP' ? ` ${fmtDate(t.constraintDate)}` : ''}
            </>
          )}
        </Item>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- advanced

function Advanced({ c }: { c: Ctx }) {
  const { t, d } = c;
  const editable = c.canEdit && !t.summary;
  const remaining = t.remainingMinutes == null ? null : minutesToUnit(t.remainingMinutes, t.durationUnit, d.hoursPerDay, d.daysPerWeek);
  const select = <K extends string>(label: string, value: K, keys: readonly K[], labels: Record<K, string>, field: string) =>
    editable ? (
      <select className="select sm ts-select-wide" aria-label={label} value={value} onChange={(e) => void c.save({ [field]: e.target.value })}>
        {keys.map((k) => <option key={k} value={k}>{labels[k]}</option>)}
      </select>
    ) : (
      labels[value]
    );
  const milestones = d.earning.milestones ?? [];
  return (
    <details className="ts-advanced">
      <summary>
        <Icon name="chevronRight" size={14} className="ts-chev" /> Advanced
        <span className="muted small">physical progress, work, earned value and planned value</span>
      </summary>
      <div className="ts-advanced-body task-sched-grid">
        <Item label="Physical percent complete">
          {editable ? <NumberInput label="Physical percent complete" value={t.physicalPercent} min={0} max={100} suffix="%" rangeText="Enter a percentage from 0 to 100" onSave={(v) => c.save({ physicalPercent: v })} /> : pct(t.physicalPercent)}
        </Item>
        <Item label="Remaining duration">
          {editable ? <NumberInput label="Remaining duration" value={remaining} min={0} suffix={UNIT_LABELS[t.durationUnit]} rangeText="Enter the remaining duration as a number of 0 or more" onSave={(v) => c.save({ remaining: v })} /> : remaining == null ? '—' : `${round2(remaining)} ${UNIT_LABELS[t.durationUnit]}`}
        </Item>
        <Item label="Scheduling type" wide>{select<SchedulingType>('Scheduling type', t.schedulingType, SCHEDULING_TYPES, SCHEDULING_TYPE_LABELS, 'schedulingType')}</Item>
        <Item label="Work">
          {editable ? <NumberInput label="Work in hours" value={t.workMinutes == null ? null : t.workMinutes / 60} min={0} suffix="hours" rangeText="Enter the work in hours, 0 or more" onSave={(v) => c.save({ workHours: v })} /> : t.workMinutes == null ? '—' : `${round2(t.workMinutes / 60)} hours`}
        </Item>
        <Item label="Units" hint="1 is one person full time.">
          {editable ? <NumberInput label="Units" value={t.units} min={0.01} max={100} rangeText="Enter units from 0.01 to 100 (1 is one person full time)" onSave={(v) => c.save({ units: v })} /> : t.units == null ? '—' : String(round2(t.units))}
        </Item>
        <Item label="Earning method" wide hint="How earned value is measured for this task.">
          {select<EarningMethod>('Earning method', t.earningMethod, EARNING_METHODS, EARNING_METHOD_LABELS, 'earningMethod')}
        </Item>
        {t.earningMethod === 'weighted_milestones' ? (
          <div className="ts-wide">
            <RowsEditor
              label="Weighted milestones"
              hint="Each milestone earns its share of the weights when it is done."
              canEdit={editable}
              addLabel="Add milestone"
              cols={[
                { key: 'name', label: 'Milestone', type: 'text' },
                { key: 'weight', label: 'Weight', type: 'number' },
                { key: 'doneOn', label: 'Done on', type: 'date' },
              ]}
              rows={milestones.map((m) => ({ name: m.name, weight: String(m.weight), doneOn: m.doneOn ?? '' }))}
              blank={{ name: '', weight: '1', doneOn: '' }}
              check={(rows) => (rows.every((r) => r.name.trim() && Number.isFinite(Number(r.weight)) && Number(r.weight) >= 0 && r.weight.trim() !== '') ? null : 'Give each milestone a name and a weight of 0 or more')}
              onSave={(rows) => c.save({ earningMilestones: rows.map((r) => ({ name: r.name.trim(), weight: Number(r.weight), doneOn: r.doneOn || null })) })}
            />
          </div>
        ) : null}
        {t.earningMethod === 'units' ? (
          <>
            <Item label="Units in total">{editable ? <NumberInput label="Units in total" value={d.earning.unitsTotal ?? null} min={0} onSave={(v) => c.save({ unitsTotal: v })} /> : d.earning.unitsTotal ?? '—'}</Item>
            <Item label="Units done">{editable ? <NumberInput label="Units done" value={d.earning.unitsDone ?? null} min={0} onSave={(v) => c.save({ unitsDone: v })} /> : d.earning.unitsDone ?? '—'}</Item>
          </>
        ) : null}
        <Item label="Planned value profile" wide hint="How the task's budget is spread over its dates.">
          {select<PvProfile>('Planned value profile', t.pvProfile, PV_PROFILES, PV_PROFILE_LABELS, 'pvProfile')}
        </Item>
        {t.pvProfile === 'milestones' ? (
          <div className="ts-wide">
            <RowsEditor
              label="Milestone payments"
              canEdit={editable}
              addLabel="Add payment"
              cols={[
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'weight', label: 'Weight', type: 'number' },
              ]}
              rows={(d.pv.milestones ?? []).map((m) => ({ date: m.date, weight: String(m.weight) }))}
              blank={{ date: t.plannedFinish ?? '', weight: '1' }}
              check={(rows) => (rows.every((r) => isDate(r.date) && r.weight.trim() !== '' && Number(r.weight) >= 0) ? null : 'Give each payment a date and a weight of 0 or more')}
              onSave={(rows) => c.save({ pvMilestones: rows.map((r) => ({ date: r.date, weight: Number(r.weight) })) })}
            />
          </div>
        ) : null}
        {t.pvProfile === 'custom' ? (
          <div className="ts-wide">
            <RowsEditor
              label="Custom curve"
              hint="Points of the curve: the share of the planned value reached at each share of the task's time."
              canEdit={editable}
              addLabel="Add point"
              cols={[
                { key: 'time', label: 'Time elapsed (%)', type: 'number' },
                { key: 'value', label: 'Planned value (%)', type: 'number' },
              ]}
              rows={(d.pv.points ?? []).map(([x, y]) => ({ time: String(round2(x * 100)), value: String(round2(y * 100)) }))}
              blank={{ time: '50', value: '50' }}
              check={(rows) => (rows.every((r) => [r.time, r.value].every((v) => v.trim() !== '' && Number(v) >= 0 && Number(v) <= 100)) ? null : 'Enter each point as two percentages from 0 to 100')}
              onSave={(rows) => c.save({ pvPoints: rows.map((r) => [Number(r.time) / 100, Number(r.value) / 100]) })}
            />
          </div>
        ) : null}
      </div>
    </details>
  );
}

interface RowCol {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date';
}

/** A small list of rows edited together and saved with one button. */
function RowsEditor({ label, hint, cols, rows, blank, canEdit, addLabel, check, onSave }: { label: string; hint?: string; cols: RowCol[]; rows: Record<string, string>[]; blank: Record<string, string>; canEdit: boolean; addLabel: string; check: (rows: Record<string, string>[]) => string | null; onSave: (rows: Record<string, string>[]) => Promise<boolean> }) {
  const toast = useToast();
  const saved = JSON.stringify(rows);
  const [draft, setDraft] = useState(rows);
  useEffect(() => setDraft(rows), [saved]);
  const dirty = JSON.stringify(draft) !== saved;
  const set = (i: number, k: string, v: string) => setDraft(draft.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const save = async () => {
    const problem = check(draft);
    if (problem) return toast(problem, 'error');
    await onSave(draft);
  };
  return (
    <div className="ts-rows">
      <span className="ts-label">{label}</span>
      {draft.length ? (
        <table className="pc-table ts-rows-table">
          <thead>
            <tr>
              {cols.map((col) => <th key={col.key} scope="col">{col.label}</th>)}
              {canEdit ? <th scope="col"><span className="sr-only">Remove</span></th> : null}
            </tr>
          </thead>
          <tbody>
            {draft.map((r, i) => (
              <tr key={i}>
                {cols.map((col) => (
                  <td key={col.key}>
                    {canEdit ? (
                      <input className={`input sm${col.type === 'number' ? ' ts-num' : col.type === 'date' ? ' ts-date' : ''}`} type={col.type} step={col.type === 'number' ? 'any' : undefined} aria-label={`${col.label}, row ${i + 1}`} value={r[col.key] ?? ''} maxLength={col.type === 'text' ? 100 : undefined} onChange={(e) => set(i, col.key, e.target.value)} />
                    ) : col.type === 'date' ? fmtDate(r[col.key] || null) : r[col.key] || '—'}
                  </td>
                ))}
                {canEdit ? (
                  <td>
                    <button type="button" className="btn ghost icon sm" aria-label={`Remove row ${i + 1}`} onClick={() => setDraft(draft.filter((_, j) => j !== i))}><Icon name="trash" size={13} /></button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="ts-hint">None yet.</p>
      )}
      {canEdit ? (
        <div className="row">
          <button type="button" className="btn ghost sm" onClick={() => setDraft([...draft, { ...blank }])}><Icon name="plus" size={13} /> {addLabel}</button>
          {dirty ? (
            <>
              <button type="button" className="btn primary sm" onClick={() => void save()}>Save</button>
              <button type="button" className="btn ghost sm" onClick={() => setDraft(rows)}>Cancel</button>
            </>
          ) : null}
        </div>
      ) : null}
      {hint ? <p className="ts-hint">{hint}</p> : null}
    </div>
  );
}

// ---------------------------------------------------------------- predecessors and successors

interface LinkDraft {
  type: LinkType;
  lag: string;
  unit: DurationUnit;
}

function LinkFields({ value, onChange }: { value: LinkDraft; onChange: (v: LinkDraft) => void }) {
  return (
    <>
      <select className="select sm" aria-label="Link type" value={value.type} onChange={(e) => onChange({ ...value, type: e.target.value as LinkType })}>
        {LINK_TYPES.map((k) => <option key={k} value={k}>{k} · {LINK_TYPE_LABELS[k]}</option>)}
      </select>
      <input className="input sm ts-num" type="number" step="any" aria-label="Lag" title="Lag: a positive value waits, a negative value overlaps" value={value.lag} onChange={(e) => onChange({ ...value, lag: e.target.value })} />
      <select className="select sm" aria-label="Lag unit" value={value.unit} onChange={(e) => onChange({ ...value, unit: e.target.value as DurationUnit })}>
        {DURATION_UNITS.map((u) => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
      </select>
    </>
  );
}

/** The lag as a number, or an error sentence. */
function lagOf(f: LinkDraft): number | string {
  const n = f.lag.trim() === '' ? 0 : Number(f.lag);
  if (!Number.isFinite(n) || n < -10000 || n > 10000) return 'Enter the lag as a number from -10000 to 10000';
  return n;
}

function Dependencies({ c }: { c: Ctx }) {
  const { t, d } = c;
  const [adding, setAdding] = useState<null | 'pred' | 'succ'>(null);
  const preds = d.links.filter((l) => l.successorId === t.itemId);
  const succs = d.links.filter((l) => l.predecessorId === t.itemId);
  const canLink = c.canEdit && !t.summary;
  const group = (dir: 'pred' | 'succ', links: LinkDTO[]) => (
    <div className="ts-deps">
      <div className="ts-dep-head">
        <span>{dir === 'pred' ? 'Predecessors' : 'Successors'} ({links.length})</span>
        <span className="muted small">{dir === 'pred' ? 'tasks this one waits for' : 'tasks that wait for this one'}</span>
      </div>
      {links.length ? (
        <ul className="ts-links">
          {links.map((l) => <LinkRow key={l.id} l={l} otherId={dir === 'pred' ? l.predecessorId : l.successorId} c={c} />)}
        </ul>
      ) : (
        <p className="ts-hint">None.</p>
      )}
      {adding === dir ? (
        <AddLink c={c} dir={dir} onDone={() => setAdding(null)} />
      ) : canLink ? (
        <button type="button" className="btn ghost sm" onClick={() => setAdding(dir)}><Icon name="plus" size={13} /> Add {dir === 'pred' ? 'predecessor' : 'successor'}</button>
      ) : null}
    </div>
  );
  return (
    <section className="pc-section" aria-labelledby="ts-deps">
      <h3 id="ts-deps">Predecessors and successors</h3>
      {t.summary ? <p className="ts-hint ts-note">Link the subtasks of a summary task, not the summary task itself.</p> : null}
      {group('pred', preds)}
      {group('succ', succs)}
    </section>
  );
}

function LinkRow({ l, otherId, c }: { l: LinkDTO; otherId: string; c: Ctx }) {
  const { d } = c;
  const toast = useToast();
  const other = d.names[otherId];
  const who = other?.key ?? other?.name ?? 'this task';
  const unitValue = (minutes: number, unit: DurationUnit) => String(round2(minutesToUnit(minutes, unit, d.hoursPerDay, d.daysPerWeek)));
  const [editing, setEditing] = useState<LinkDraft | null>(null);
  const lagWords = l.lagMinutes ? `, ${l.lagMinutes > 0 ? 'lag' : 'lead'} ${unitValue(Math.abs(l.lagMinutes), l.lagUnit)} ${SHORT_UNIT[l.lagUnit]}` : '';
  const save = async () => {
    if (!editing) return;
    const lag = lagOf(editing);
    if (typeof lag === 'string') return toast(lag, 'error');
    if (await c.run(() => patch(`/links/${l.id}`, { type: editing.type, lag, lagUnit: editing.unit }), 'Dependency changed')) setEditing(null);
  };
  return (
    <li className={`ts-link${l.critical ? ' critical' : ''}`}>
      <TaskKey value={other?.key} />
      <span className="ts-link-name" title={other?.name}>{other?.name ?? 'A task no longer in this project'}</span>
      {editing ? (
        <span className="ts-inline">
          <LinkFields value={editing} onChange={setEditing} />
          <button type="button" className="btn primary sm" onClick={() => void save()}>Save</button>
          <button type="button" className="btn ghost sm" onClick={() => setEditing(null)}>Cancel</button>
        </span>
      ) : (
        <>
          <span className="ts-link-type" title={`${LINK_TYPE_LABELS[l.type]}${lagWords}`}>{formatLink(l.type, l.lagMinutes, l.lagUnit, d.hoursPerDay, d.daysPerWeek)}</span>
          <span className="muted small">{LINK_TYPE_LABELS[l.type]}</span>
          {l.critical ? <CriticalBadge criticality="critical" compact /> : null}
          {l.source === 'column' ? (
            <span className="muted small ts-link-src">from the Dependency column</span>
          ) : c.canEdit ? (
            <span className="ts-link-actions">
              <button type="button" className="btn ghost icon sm" aria-label={`Change the link with ${who}`} title="Change type or lag" onClick={() => setEditing({ type: l.type, lag: unitValue(l.lagMinutes, l.lagUnit), unit: l.lagUnit })}><Icon name="edit" size={13} /></button>
              <button type="button" className="btn ghost icon sm" aria-label={`Remove the link with ${who}`} title="Remove this dependency" onClick={() => void c.run(() => del(`/links/${l.id}`), 'Dependency removed')}><Icon name="trash" size={13} /></button>
            </span>
          ) : null}
        </>
      )}
    </li>
  );
}

function AddLink({ c, dir, onDone }: { c: Ctx; dir: 'pred' | 'succ'; onDone: () => void }) {
  const { t, d } = c;
  const toast = useToast();
  const [other, setOther] = useState('');
  const [f, setF] = useState<LinkDraft>({ type: 'FS', lag: '0', unit: 'days' });
  const linked = new Set(d.links.filter((l) => (dir === 'pred' ? l.successorId === t.itemId : l.predecessorId === t.itemId)).map((l) => (dir === 'pred' ? l.predecessorId : l.successorId)));
  // Any other task of the project that is not a summary task and not linked this way already.
  const options = Object.entries(d.names)
    .filter(([id, n]) => id !== t.itemId && !n.summary && !linked.has(id))
    .sort(([, a], [, b]) => wbsCompare(a.wbs, b.wbs));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!other) return;
    const lag = lagOf(f);
    if (typeof lag === 'string') return toast(lag, 'error');
    const body = { predecessorId: dir === 'pred' ? other : t.itemId, successorId: dir === 'pred' ? t.itemId : other, type: f.type, lag, lagUnit: f.unit };
    if (await c.run(() => post(`/boards/${c.boardId}/links`, body), dir === 'pred' ? 'Predecessor added' : 'Successor added')) onDone();
  };
  return (
    <form className="ts-link-form" onSubmit={(e) => void submit(e)}>
      <select className="select sm ts-task-pick" aria-label={dir === 'pred' ? 'Predecessor task' : 'Successor task'} value={other} onChange={(e) => setOther(e.target.value)} autoFocus>
        <option value="">{dir === 'pred' ? 'Choose the task this one waits for…' : 'Choose the task that waits for this one…'}</option>
        {options.map(([id, n]) => <option key={id} value={id}>{n.key ? `${n.key}  ` : ''}{n.name}</option>)}
      </select>
      <LinkFields value={f} onChange={setF} />
      <button className="btn primary sm" disabled={!other}>Add</button>
      <button type="button" className="btn ghost sm" onClick={onDone}>Cancel</button>
    </form>
  );
}

// ---------------------------------------------------------------- baseline comparison

/** Working days (or percentage points): positive is later or longer, or, for progress, ahead. */
function Variance({ v, unit, aheadIsPositive = false }: { v: number | null; unit: string; aheadIsPositive?: boolean }) {
  if (v == null) return <>—</>;
  const bad = aheadIsPositive ? v < 0 : v > 0;
  const good = aheadIsPositive ? v > 0 : v < 0;
  return <span className={bad ? 'pc-neg' : good ? 'pc-pos' : undefined}>{v > 0 ? '+' : ''}{round2(v)} {unit}</span>;
}

function BaselineSection({ c }: { c: Ctx }) {
  const b = c.d.baseline!;
  const r = b.row;
  return (
    <section className="pc-section" aria-labelledby="ts-baseline">
      <h3 id="ts-baseline">Baseline {b.number}: {b.name}</h3>
      {!r.inBaseline ? (
        <p className="ts-hint ts-note">This task was added after the baseline was approved, so it has no baseline dates.</p>
      ) : (
        <>
          <div className="ts-table-wrap">
            <table className="pc-table ts-compare">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Measure</span></th>
                  <th scope="col">Baseline</th>
                  <th scope="col">Current</th>
                  <th scope="col">Actual</th>
                  <th scope="col" className="num">Variance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ts-rowhead">Start</td>
                  <td>{fmtDate(r.baselineStart)}</td>
                  <td>{fmtDate(r.currentStart)}</td>
                  <td>{fmtDate(r.actualStart)}</td>
                  <td className="num"><Variance v={r.startVarianceDays} unit="d" /></td>
                </tr>
                <tr>
                  <td className="ts-rowhead">Finish</td>
                  <td>{fmtDate(r.baselineFinish)}</td>
                  <td>{fmtDate(r.currentFinish)}</td>
                  <td>{fmtDate(r.actualFinish)}</td>
                  <td className="num"><Variance v={r.finishVarianceDays} unit="d" /></td>
                </tr>
                <tr>
                  <td className="ts-rowhead">Duration</td>
                  <td>{fmtDays(r.baselineDurationDays)}</td>
                  <td>{fmtDays(r.currentDurationDays)}</td>
                  <td>{fmtDays(c.t.actualDurationDays)}</td>
                  <td className="num"><Variance v={r.durationVarianceDays} unit="d" /></td>
                </tr>
                <tr>
                  <td className="ts-rowhead">Progress</td>
                  <td>{pct(r.plannedPercent)} planned</td>
                  <td>{pct(r.percentComplete)}</td>
                  <td>—</td>
                  <td className="num"><Variance v={r.progressVariance} unit="points" aheadIsPositive /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ts-hint">Variance in working days: positive is later or longer than the baseline. Current is the actual date when there is one, otherwise the calculated date.</p>
        </>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- progress

function ProgressSection({ c }: { c: Ctx }) {
  const { d, t } = c;
  const toast = useToast();
  const canRecord = d.canUpdateProgress && c.writable;
  const [asOf, setAsOf] = useState(d.statusDate);
  const [percent, setPercent] = useState('');
  const [physical, setPhysical] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const p = percent.trim() === '' ? null : Number(percent);
    const ph = physical.trim() === '' ? null : Number(physical);
    const bad = (v: number | null) => v != null && (!Number.isFinite(v) || v < 0 || v > 100);
    if (!isDate(asOf)) return toast('Choose the date of this progress', 'error');
    if (p == null && ph == null) return toast('Enter the percent complete', 'error');
    if (bad(p) || bad(ph)) return toast('Enter percentages from 0 to 100', 'error');
    setBusy(true);
    const ok = await c.run(() => post(`/items/${t.itemId}/progress`, { asOf, percentComplete: p, physicalPercent: ph, note: note.trim() || undefined }), 'Progress recorded');
    setBusy(false);
    if (ok) {
      setPercent('');
      setPhysical('');
      setNote('');
    }
  };
  return (
    <section className="pc-section" aria-labelledby="ts-progress">
      <h3 id="ts-progress">Progress</h3>
      {canRecord ? (
        <form className="ts-form" onSubmit={(e) => void submit(e)}>
          <label className="ts-field">
            <span className="ts-label">As of</span>
            <input type="date" className="input sm" value={asOf} max={d.statusDate} required onChange={(e) => setAsOf(e.target.value)} />
          </label>
          <label className="ts-field">
            <span className="ts-label">Percent complete</span>
            <input type="number" className="input sm" inputMode="decimal" min={0} max={100} step="any" value={percent} onChange={(e) => setPercent(e.target.value)} />
          </label>
          <label className="ts-field">
            <span className="ts-label">Physical percent (optional)</span>
            <input type="number" className="input sm" inputMode="decimal" min={0} max={100} step="any" value={physical} onChange={(e) => setPhysical(e.target.value)} />
          </label>
          <label className="ts-field ts-form-wide">
            <span className="ts-label">Note (optional)</span>
            <input type="text" className="input sm" value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} />
          </label>
          <div className="ts-form-actions">
            <button className="btn primary sm" disabled={busy}>Record progress</button>
          </div>
        </form>
      ) : null}
      {d.progress.length ? (
        <div className="ts-table-wrap">
          <table className="pc-table">
            <thead>
              <tr>
                <th scope="col">As of</th>
                <th scope="col" className="num">Complete</th>
                <th scope="col" className="num">Physical</th>
                <th scope="col">Note</th>
                <th scope="col">By</th>
              </tr>
            </thead>
            <tbody>
              {d.progress.map((p) => (
                <tr key={p.id}>
                  <td>{fmtDate(p.as_of)}</td>
                  <td className="num">{pct(p.percent_complete)}</td>
                  <td className="num">{pct(p.physical_percent)}</td>
                  <td className="wrap">{p.note || <span className="muted">—</span>}</td>
                  <td>{c.memberName(p.created_by) ?? <span className="muted">Former member</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="ts-hint">No progress recorded yet.</p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- costs

function CostsSection({ c, costs }: { c: Ctx; costs: CostEntry[] }) {
  const { d, t } = c;
  const toast = useToast();
  const canAdd = d.canEditFinance && c.writable;
  const [spentOn, setSpentOn] = useState(d.statusDate);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const currencies = Array.from(new Set(costs.map((x) => x.currency)));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isDate(spentOn)) return toast('Choose the date of this cost', 'error');
    if (!amount.trim()) return toast('Enter an amount (use a negative amount to correct an earlier entry)', 'error');
    setBusy(true);
    const ok = await c.run(() => post(`/items/${t.itemId}/costs`, { spentOn, amount: amount.trim().replace(/,/g, ''), category: category.trim() || undefined, note: note.trim() || undefined }), 'Cost recorded');
    setBusy(false);
    if (ok) {
      setAmount('');
      setNote('');
    }
  };
  return (
    <section className="pc-section" aria-labelledby="ts-costs">
      <h3 id="ts-costs">Costs</h3>
      {canAdd ? (
        <form className="ts-form" onSubmit={(e) => void submit(e)}>
          <label className="ts-field">
            <span className="ts-label">Date</span>
            <input type="date" className="input sm" value={spentOn} max={d.statusDate} required onChange={(e) => setSpentOn(e.target.value)} />
          </label>
          <label className="ts-field">
            <span className="ts-label">Amount{currencies.length === 1 ? ` (${currencies[0]})` : ''}</span>
            <input type="text" className="input sm" inputMode="decimal" value={amount} placeholder="0.00" maxLength={40} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className="ts-field">
            <span className="ts-label">Category (optional)</span>
            <input type="text" className="input sm" value={category} maxLength={60} placeholder="Labour, materials…" onChange={(e) => setCategory(e.target.value)} />
          </label>
          <label className="ts-field ts-form-wide">
            <span className="ts-label">Note (optional)</span>
            <input type="text" className="input sm" value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} />
          </label>
          <div className="ts-form-actions">
            <button className="btn primary sm" disabled={busy}>Add cost</button>
          </div>
          <p className="ts-hint ts-form-wide">Costs are never changed or deleted: use a negative amount to correct an earlier entry.</p>
        </form>
      ) : null}
      {costs.length ? (
        <div className="ts-table-wrap">
          <table className="pc-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Category</th>
                <th scope="col" className="num">Amount</th>
                <th scope="col">Note</th>
                <th scope="col">By</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((x) => (
                <tr key={x.id}>
                  <td>{fmtDate(x.spent_on)}</td>
                  <td>{x.category || <span className="muted">—</span>}</td>
                  <td className="num">{formatMoney(x.amount, x.currency)}</td>
                  <td className="wrap">{x.note || <span className="muted">—</span>}</td>
                  <td>{c.memberName(x.created_by) ?? <span className="muted">Former member</span>}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {currencies.map((cur) => (
                <tr key={cur} className="ts-total">
                  <td colSpan={2}>Total</td>
                  <td className="num">{formatScaled(sumScaled(costs.filter((x) => x.currency === cur).map((x) => x.amount)).total, cur)}</td>
                  <td colSpan={2} />
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      ) : (
        <p className="ts-hint">No costs recorded yet.</p>
      )}
    </section>
  );
}
