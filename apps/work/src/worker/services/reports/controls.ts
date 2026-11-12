// Report sections L (Schedule and critical path), M (Baseline comparison) and N (Earned value and forecasts).
//
// Nothing is calculated here. The schedule is built once, at the report's status date, by the same function as the
// live schedule (services/schedule/project.ts); the baseline comparison is compareBaseline and earned value is
// buildEarnedValue, both on that schedule, exactly as the /schedule, /baselines/compare and /evm endpoints call them.
// This file only selects, labels and formats their results for a report, so a report shows the numbers the live
// project controls screens showed at that status date.
//
// Finance: earned value is money, and so is the cost part of the baseline comparison. Both are included only when the
// person generating the report may see the project's finances and has not left finances out (the Finances option).
// Otherwise the section says so and holds no figure, and the report is not marked as containing financial data.

import type { Env } from '../../env';
import type { BoardRow } from '../permissions';
import { currencyInfo, formatMoney } from '../../../shared/money';
import { CRITICALITY_LABELS, LINK_TYPE_LABELS, formatLink, type Criticality, type DurationUnit, type LinkType } from '../../../shared/schedule';
import { compareBaseline, loadBaseline, type BaselineComparisonRow } from '../schedule/baselines';
import { buildEarnedValue, type EvmMetricsDTO } from '../schedule/earned-value';
import { buildSchedule, type ScheduleModel } from '../schedule/project';

// ------------------------------------------------------------------ section L: schedule and critical path

export interface ScheduleTaskRow {
  itemId: string;
  key: string | null;
  wbs: string;
  name: string;
  summary: boolean;
  milestone: boolean;
  plannedStart: string | null;
  plannedFinish: string | null;
  earlyStart: string | null;
  earlyFinish: string | null;
  lateStart: string | null;
  lateFinish: string | null;
  /** Working days. */
  durationDays: number | null;
  totalFloatDays: number | null;
  freeFloatDays: number | null;
  criticality: Criticality;
  criticalityLabel: string;
  /** "LASER-0001 FS+2d": the other task's key (its name when it has none), the link type and the lag. */
  predecessors: string[];
  successors: string[];
  actualStart: string | null;
  actualFinish: string | null;
  percentComplete: number | null;
}

export interface DependencyRow {
  linkId: string;
  predecessorKey: string | null;
  predecessorName: string;
  successorKey: string | null;
  successorName: string;
  type: LinkType;
  typeLabel: string;
  /** "+2d", "-1d", or "0" without lag. */
  lag: string;
  lagDays: number;
  /** Relationship float in working days (null when the schedule cannot be calculated). */
  floatDays: number | null;
  critical: boolean;
  /** 'link': a typed dependency; 'column': from the board's Dependency column (finish to start, no lag). */
  source: 'link' | 'column';
}

export interface ScheduleSection {
  statusDate: string;
  calendar: { name: string; scope: 'project' | 'organisation' | 'default'; timezone: string; hoursPerDay: number };
  projectStart: string | null;
  /** The forecast finish: the end of the critical path. */
  projectFinish: string | null;
  criticalDurationDays: number | null;
  valid: boolean;
  counts: Record<Criticality, number>;
  /** Each critical path as task keys (a task's name when it has no key), first to last. */
  criticalPaths: string[][];
  tasks: ScheduleTaskRow[];
  dependencies: DependencyRow[];
  nearCritical: { itemId: string; key: string | null; name: string; totalFloatDays: number | null; earlyStart: string | null; earlyFinish: string | null }[];
  milestones: { itemId: string; key: string | null; name: string; baselineDate: string | null; forecastDate: string | null; actualDate: string | null; criticalityLabel: string }[];
  /** The baseline the milestones' baseline dates come from, or null without one. */
  milestoneBaseline: { number: number; name: string } | null;
  plannedVsActual: { itemId: string; key: string | null; name: string; plannedStart: string | null; actualStart: string | null; plannedFinish: string | null; actualFinish: string | null; forecastFinish: string | null; percentComplete: number | null; state: 'Finished' | 'In progress' }[];
  warnings: string[];
  note: string;
}

// ------------------------------------------------------------------ section M: baseline comparison

export interface BaselineSection {
  statusDate: string;
  available: boolean;
  /** Why there is no comparison (no baseline, or the selected one is not this project's). */
  reason: string | null;
  baseline: { id: string; number: number; name: string; approvedBy: string; approvedOn: string; projectStart: string | null; projectFinish: string | null } | null;
  forecastFinish: string | null;
  /** Working days; positive = the forecast finishes later than the baseline. */
  projectFinishVarianceDays: number | null;
  /** The original baseline (number 0), when the compared baseline is a later one. */
  original: { number: 0; name: string; projectFinish: string | null; finishVarianceDays: number | null } | null;
  /** True when the rows carry budgets and cost variance (finance allowed and amounts recorded). */
  costIncluded: boolean;
  currency: string | null;
  bac: string | null;
  rows: BaselineComparisonRow[];
  note: string;
}

// ------------------------------------------------------------------ section N: earned value and forecasts

export interface EvmForecast {
  method: 'cpi' | 'budget' | 'cpiSpi';
  label: string;
  formula: string;
  eac: string | null;
  etc: string | null;
  vac: string | null;
}

export interface EvmTaskRow {
  itemId: string;
  key: string | null;
  wbs: string;
  name: string;
  method: string;
  methodLabel: string;
  bac: string | null;
  pv: string | null;
  ev: string | null;
  ac: string | null;
  cv: string | null;
  sv: string | null;
  plannedPercent: number | null;
  earnedPercent: number | null;
  note: string | null;
}

export interface EvmSection {
  statusDate: string;
  /** False when finances are not part of this report: then no figure below is filled in. */
  financeAllowed: boolean;
  /** True when earned value could be calculated (an approved baseline with a budget). */
  available: boolean;
  reason: string | null;
  currency: string | null;
  baseline: { id: string; number: number; name: string; approvedOn: string; approvedBy: string } | null;
  /** Exactly as GET /api/boards/:id/evm returns them for the same status date and baseline. */
  metrics: EvmMetricsDTO | null;
  cpiText: string | null;
  spiText: string | null;
  /** Shown when less than a tenth of the work is earned. */
  caution: string | null;
  forecasts: EvmForecast[];
  tasks: EvmTaskRow[];
  /** The latest points of the trend (cumulative PV, EV, AC, CPI and SPI). */
  trend: { date: string; pv: string | null; ev: string | null; ac: string | null; cpi: number | null; spi: number | null }[];
  trendPoints: number;
  warnings: string[];
  definitions: Record<string, string>;
}

export interface ControlsSections {
  schedule?: ScheduleSection;
  baseline?: BaselineSection;
  evm?: EvmSection;
}

// ------------------------------------------------------------------ display helpers (shared by the renderers)

/** A money figure for display, or `empty` when it is unavailable: unavailable never reads as zero. */
export function moneyText(v: string | null | undefined, currency: string | null, empty = 'Unavailable'): string {
  if (v == null) return empty;
  return formatMoney(v, currency) || empty;
}

/** CPI, SPI or TCPI at two decimals, as the indices are judged. */
export function indexText(v: number | null | undefined, empty = 'Unavailable'): string {
  return v == null ? empty : (Math.round(v * 100) / 100).toFixed(2);
}

/** Working days with a sign: +3 later or longer, -2 earlier or shorter. */
export function signedDays(v: number | null | undefined, empty = '-'): string {
  if (v == null) return empty;
  return v > 0 ? `+${v}` : String(v);
}

export function daysText(v: number | null | undefined, empty = '-'): string {
  return v == null ? empty : String(v);
}

export function percentText(v: number | null | undefined, empty = '-'): string {
  return v == null ? empty : `${Math.round(v * 10) / 10}%`;
}

export function dateText(v: string | null | undefined, empty = '-'): string {
  return v ?? empty;
}

/** An amount in a table whose header names the currency: the currency's decimals, no code; n/a when unavailable. */
export function amountText(v: string | null | undefined, currency: string | null): string {
  if (v == null) return 'n/a';
  return formatMoney(v, null, { digits: currencyInfo(currency)?.minor ?? 2 }) || 'n/a';
}

/** The project finish against the baseline, in words. */
export function finishVarianceWords(days: number | null): string {
  if (days == null) return 'Not available';
  const n = Math.abs(days);
  const unit = n === 1 ? 'working day' : 'working days';
  if (days > 0) return `${n} ${unit} later than the baseline`;
  if (days < 0) return `${n} ${unit} earlier than the baseline`;
  return 'On the baseline finish';
}

/** The measures of section N, labelled, in the order they are read. */
export function evmMeasures(e: EvmSection): [string, string][] {
  const m = e.metrics!;
  const money = (v: string | null) => moneyText(v, e.currency);
  return [
    ['Budget at completion (BAC)', money(m.bac)],
    ['Planned value (PV)', money(m.pv)],
    ['Earned value (EV)', money(m.ev)],
    ['Actual cost (AC)', `${money(m.ac)} (recorded for ${m.acCoverage.withActuals} of ${m.acCoverage.tasks} budgeted tasks)`],
    ['Cost variance (CV = EV - AC)', money(m.cv)],
    ['Schedule variance (SV = EV - PV)', money(m.sv)],
    ['Cost performance index (CPI = EV / AC)', indexText(m.cpi)],
    ['Schedule performance index (SPI = EV / PV)', indexText(m.spi)],
    ['To-complete performance index to meet BAC (TCPI)', indexText(m.tcpiBac)],
    ['To-complete performance index to meet EAC by CPI (TCPI)', indexText(m.tcpiEac)],
  ];
}

/** Which money figures a report holds: used to mark it as containing financial data. */
export function controlsIncludeFinance(c: ControlsSections, sections: readonly string[]): boolean {
  return (sections.includes('evm') && !!c.evm?.financeAllowed && !!c.evm.available && !!c.evm.metrics) || (sections.includes('baseline') && !!c.baseline?.costIncluded);
}

// ------------------------------------------------------------------ build

export interface ControlsInput {
  board: BoardRow;
  sections: readonly string[];
  /** YYYY-MM-DD: the report period's end, never later than today. */
  statusDate: string;
  baselineId: string | null;
  /** The person generating the report may see the project's finances. */
  financeAllowed: boolean;
  /** Finances were not switched off for this report. */
  includeFinance: boolean;
  /** Keeps a list to the report's limit and records what was cut. */
  cap: <T>(rows: T[], what: string) => T[];
}

const NO_FINANCE_ACCESS = "Earned value is not shown: the access of the person who generated this report does not include this project's finances. No financial figure appears in this section.";
const FINANCE_LEFT_OUT = 'Earned value is not shown: finances were left out of this report (the Finances option was switched off). No financial figure appears in this section.';

function cpiWords(m: EvmMetricsDTO): string {
  const v = indexText(m.cpi);
  switch (m.cpiStatus) {
    case 'below':
      return `Over budget: CPI ${v} is below 1.00, so the work done has cost more than its budget.`;
    case 'above':
      return `Under budget: CPI ${v} is above 1.00, so the work done has cost less than its budget.`;
    case 'on':
      return `On budget: CPI ${v}, the work done has cost what it was budgeted to cost.`;
    default:
      return m.ac == null ? 'Cost performance is unavailable: no actual cost is recorded by the status date.' : 'Cost performance is unavailable: it needs both earned value and actual cost.';
  }
}

function spiWords(m: EvmMetricsDTO): string {
  const v = indexText(m.spi);
  switch (m.spiStatus) {
    case 'below':
      return `Behind plan: SPI ${v} is below 1.00, so less work has been done than planned by the status date.`;
    case 'above':
      return `Ahead of plan: SPI ${v} is above 1.00, so more work has been done than planned by the status date.`;
    case 'on':
      return `On plan: SPI ${v}, the work done matches the work planned by the status date.`;
    default:
      return 'Schedule performance is unavailable: no work was planned to be done by the status date.';
  }
}

function forecasts(m: EvmMetricsDTO): EvmForecast[] {
  return [
    { method: 'cpi', label: 'EAC by CPI', formula: 'BAC / CPI: the remaining work continues at the cost efficiency achieved so far', eac: m.eac.cpi, etc: m.etc.cpi, vac: m.vac.cpi },
    { method: 'budget', label: 'EAC by budget rate', formula: 'AC + (BAC - EV): the remaining work is done at its budgeted cost', eac: m.eac.budget, etc: m.etc.budget, vac: m.vac.budget },
    { method: 'cpiSpi', label: 'EAC by CPI x SPI', formula: 'AC + (BAC - EV) / (CPI x SPI): cost and schedule performance both continue', eac: m.eac.cpiSpi, etc: m.etc.cpiSpi, vac: m.vac.cpiSpi },
  ];
}

export async function buildControlsSections(db: D1Database, input: ControlsInput): Promise<ControlsSections> {
  const want = (s: string) => input.sections.includes(s);
  const m = await buildSchedule({ DB: db } as Env, input.board, { statusDate: input.statusDate });
  const loaded = await loadBaseline(db, m.board.id, input.baselineId);
  const baselineMissing = !!input.baselineId && !loaded;
  const moneyAllowed = input.financeAllowed && input.includeFinance;
  const out: ControlsSections = {};
  if (want('schedule')) out.schedule = scheduleSection(m, loaded, input.cap);
  if (want('baseline')) out.baseline = await baselineSection(db, m, loaded, baselineMissing, moneyAllowed, input.cap);
  if (want('evm')) {
    const base: EvmSection = { statusDate: m.statusDate, financeAllowed: moneyAllowed, available: false, reason: null, currency: null, baseline: null, metrics: null, cpiText: null, spiText: null, caution: null, forecasts: [], tasks: [], trend: [], trendPoints: 0, warnings: [], definitions: {} };
    if (!moneyAllowed) out.evm = { ...base, reason: input.financeAllowed ? FINANCE_LEFT_OUT : NO_FINANCE_ACCESS };
    else if (baselineMissing) out.evm = { ...base, reason: 'The selected baseline is not one of the approved baselines of this project.' };
    else {
      const ev = await buildEarnedValue(db, m, { baselineId: input.baselineId, statusDate: input.statusDate });
      if (!ev.available) out.evm = { ...base, statusDate: ev.statusDate, reason: ev.reason };
      else {
        const trendPoints = ev.trend.length;
        out.evm = {
          ...base,
          statusDate: ev.statusDate,
          available: true,
          currency: ev.currency,
          baseline: { id: ev.baseline.id, number: ev.baseline.number, name: ev.baseline.name, approvedOn: ev.baseline.approvedOn, approvedBy: ev.baseline.approvedBy },
          metrics: ev.metrics,
          cpiText: cpiWords(ev.metrics),
          spiText: spiWords(ev.metrics),
          caution: ev.metrics.earlyStage ? 'Early stage: less than 10% of the work is earned, so CPI, SPI and the forecasts can change a lot as work progresses.' : null,
          forecasts: forecasts(ev.metrics),
          tasks: input.cap(
            ev.tasks.map((t) => ({ itemId: t.itemId, key: t.key, wbs: t.wbs, name: t.name, method: t.method, methodLabel: t.methodLabel, bac: t.bac, pv: t.pv, ev: t.ev, ac: t.ac, cv: t.cv, sv: t.sv, plannedPercent: t.plannedPercent, earnedPercent: t.earnedPercent, note: t.note })),
            'Earned value by task',
          ),
          trend: ev.trend.slice(-12),
          trendPoints,
          warnings: ev.warnings,
          definitions: ev.definitions,
        };
      }
    }
  }
  return out;
}

function scheduleSection(m: ScheduleModel, loaded: Awaited<ReturnType<typeof loadBaseline>>, cap: ControlsInput['cap']): ScheduleSection {
  const label = (id: string) => m.byId.get(id)?.key ?? m.byId.get(id)?.name ?? id;
  const lagOf = (l: { type: LinkType; lagMinutes: number; lagUnit: DurationUnit }) => formatLink(l.type, l.lagMinutes, l.lagUnit, m.cal.hoursPerDay, m.cal.daysPerWeek);
  const leaf = m.tasks.filter((t) => !t.summary);
  const baselineFinish = new Map((loaded?.tasks ?? []).map((t) => [t.item_id, t.planned_finish]));
  const tasks: ScheduleTaskRow[] = m.tasks.map((t) => ({
    itemId: t.itemId,
    key: t.key,
    wbs: t.wbs,
    name: t.name,
    summary: t.summary,
    milestone: t.milestone,
    plannedStart: t.plannedStart,
    plannedFinish: t.plannedFinish,
    earlyStart: t.earlyStart,
    earlyFinish: t.earlyFinish,
    lateStart: t.lateStart,
    lateFinish: t.lateFinish,
    durationDays: t.durationDays,
    totalFloatDays: t.totalFloatDays,
    freeFloatDays: t.freeFloatDays,
    criticality: t.criticality,
    criticalityLabel: t.summary ? 'Summary' : CRITICALITY_LABELS[t.criticality],
    predecessors: m.links.filter((l) => l.successorId === t.itemId).map((l) => `${label(l.predecessorId)} ${lagOf(l)}`),
    successors: m.links.filter((l) => l.predecessorId === t.itemId).map((l) => `${label(l.successorId)} ${lagOf(l)}`),
    actualStart: t.actualStart,
    actualFinish: t.actualFinish,
    percentComplete: t.percentComplete,
  }));
  const dependencies: DependencyRow[] = m.links.map((l) => {
    const a = m.byId.get(l.predecessorId);
    const b = m.byId.get(l.successorId);
    const full = lagOf(l);
    return {
      linkId: l.id,
      predecessorKey: a?.key ?? null,
      predecessorName: a?.name ?? '',
      successorKey: b?.key ?? null,
      successorName: b?.name ?? '',
      type: l.type,
      typeLabel: LINK_TYPE_LABELS[l.type],
      lag: l.lagMinutes ? full.slice(l.type.length) : '0',
      lagDays: Math.round((l.lagMinutes / m.cal.minutesPerDay) * 100) / 100,
      floatDays: l.floatDays,
      critical: l.critical,
      source: l.source,
    };
  });
  return {
    statusDate: m.statusDate,
    calendar: { name: m.calendar.name, scope: m.calendarScope, timezone: m.calendar.timezone, hoursPerDay: m.cal.hoursPerDay },
    projectStart: m.summary.projectStart,
    projectFinish: m.summary.projectFinish,
    criticalDurationDays: m.summary.criticalDurationDays,
    valid: m.summary.valid,
    counts: m.summary.counts,
    criticalPaths: m.summary.criticalPaths.map((p) => p.map(label)),
    tasks: cap(tasks, 'Schedule'),
    dependencies: cap(dependencies, 'Dependency register'),
    nearCritical: leaf
      .filter((t) => t.criticality === 'near_critical')
      .sort((a, b) => (a.totalFloatDays ?? 0) - (b.totalFloatDays ?? 0))
      .map((t) => ({ itemId: t.itemId, key: t.key, name: t.name, totalFloatDays: t.totalFloatDays, earlyStart: t.earlyStart, earlyFinish: t.earlyFinish })),
    milestones: leaf
      .filter((t) => t.milestone)
      .map((t) => ({ itemId: t.itemId, key: t.key, name: t.name, baselineDate: baselineFinish.get(t.itemId) ?? null, forecastDate: t.earlyFinish, actualDate: t.actualFinish, criticalityLabel: CRITICALITY_LABELS[t.criticality] })),
    milestoneBaseline: loaded ? { number: loaded.baseline.number, name: loaded.baseline.name } : null,
    plannedVsActual: cap(
      leaf
        .filter((t) => t.actualStart || t.actualFinish)
        .map((t) => ({ itemId: t.itemId, key: t.key, name: t.name, plannedStart: t.plannedStart, actualStart: t.actualStart, plannedFinish: t.plannedFinish, actualFinish: t.actualFinish, forecastFinish: t.actualFinish ? null : t.earlyFinish, percentComplete: t.percentComplete, state: t.actualFinish ? ('Finished' as const) : ('In progress' as const) })),
      'Planned against actual dates',
    ),
    warnings: m.warnings.map((w) => w.message),
    note: `Calculated with the critical path method at the status date (${m.statusDate}) on the ${m.calendar.name} calendar (${m.cal.hoursPerDay} working hours a day): work not yet started is not scheduled before the status date. Durations, float and lags are in working days. Critical: total float at or below ${m.settings.criticalDays} working day(s); near-critical: up to ${m.settings.nearCriticalDays}. Every task of the project is listed, whatever the list filters. A dash means the value is not available (the task is not in the calculated schedule).`,
  };
}

async function baselineSection(
  db: D1Database,
  m: ScheduleModel,
  loaded: Awaited<ReturnType<typeof loadBaseline>>,
  baselineMissing: boolean,
  moneyAllowed: boolean,
  cap: ControlsInput['cap'],
): Promise<BaselineSection> {
  const empty: BaselineSection = { statusDate: m.statusDate, available: false, reason: null, baseline: null, forecastFinish: m.summary.projectFinish, projectFinishVarianceDays: null, original: null, costIncluded: false, currency: null, bac: null, rows: [], note: '' };
  if (!loaded) {
    return { ...empty, reason: baselineMissing ? 'The selected baseline is not one of the approved baselines of this project, so there is nothing to compare with.' : 'This project has no approved baseline yet, so there is nothing to compare the current schedule with. A project manager approves one in the project controls.' };
  }
  const b = loaded.baseline;
  const cmp = compareBaseline(m, loaded);
  let original: BaselineSection['original'] = null;
  if (b.number !== 0) {
    const id = (await db.prepare('SELECT id FROM project_baselines WHERE board_id = ? AND number = 0').bind(m.board.id).first<{ id: string }>())?.id ?? null;
    const o = id ? await loadBaseline(db, m.board.id, id) : null;
    if (o) original = { number: 0, name: o.baseline.name, projectFinish: o.baseline.project_finish, finishVarianceDays: compareBaseline(m, o).projectFinishVarianceDays };
  }
  const withCost = moneyAllowed && (b.bac != null || cmp.rows.some((r) => r.baselineCost != null || r.currentCost != null || r.costVariance != null));
  const rows = withCost ? cmp.rows : cmp.rows.map((r) => ({ ...r, baselineCost: null, currentCost: null, costVariance: null }));
  return {
    ...empty,
    available: true,
    baseline: { id: b.id, number: b.number, name: b.name, approvedBy: b.approved_by, approvedOn: b.approved_on, projectStart: b.project_start, projectFinish: b.project_finish },
    projectFinishVarianceDays: cmp.projectFinishVarianceDays,
    original,
    costIncluded: withCost,
    currency: withCost ? b.currency : null,
    bac: withCost ? b.bac : null,
    rows: cap(rows, 'Baseline comparison'),
    note:
      `Compared at the status date (${m.statusDate}). Variances are in working days: positive means later or longer than the baseline. Current dates are actual dates where recorded, otherwise the calculated schedule. Progress variance is percent complete minus the percent the baseline planned by the status date (percentage points).` +
      (withCost ? ' Cost variance is the current budget minus the baseline budget.' : moneyAllowed ? '' : ' Budgets and cost variance are not shown: finances are not part of this report.'),
  };
}
