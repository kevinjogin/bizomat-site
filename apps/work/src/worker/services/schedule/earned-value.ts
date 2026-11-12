// Earned value for a project at a status date, against an approved baseline (baselines.ts). Planned value comes from
// the baseline's budgets and planned-value curves on the baseline's own calendar; earned value from progress as
// recorded on or before the status date (task_progress_entries; today's values for today); actual cost from dated
// cost entries (task_cost_entries) on or before the status date. Where a task has no dated cost, today's figure in the
// actual-cost column is used for today only and marked; for a past date it is unavailable. Estimates are never used as
// actual cost.

import { parseJson } from '../../lib/util';
import { scaledToDecimal, toScaled } from '../../../shared/money';
import { EARNING_METHOD_LABELS, PV_PROFILE_LABELS, type CalendarDefinition, type EarningMethod, type PvProfile } from '../../../shared/schedule';
import { addDays, isIsoDate } from '../../../shared/dates';
import { WorkCalendar } from './calendar';
import { evaluateTasks, evmMetrics, indexStatus, type EvmMetrics, type EvmTaskInput, type PvCurve } from './evm';
import { actualCostColumn, loadBaseline, projectCurrency, type BaselineRow } from './baselines';
import { statusDateFor, type ScheduleModel } from './project';

interface ProgressRow {
  item_id: string;
  as_of: string;
  percent_complete: number | null;
  physical_percent: number | null;
  units_done: number | null;
  milestones_json: string | null;
}

interface CostRow {
  item_id: string;
  spent_on: string;
  amount: string;
  currency: string;
  category: string;
}

export interface EvmOptions {
  baselineId?: string | null;
  statusDate?: string | null;
  /** Restrict to one board group (cost category / WBS level 1). */
  groupId?: string | null;
}

const money = (v: bigint | null) => (v == null ? null : scaledToDecimal(v, 2));

function metricsDTO(m: EvmMetrics) {
  return {
    bac: money(m.bac),
    pv: money(m.pv),
    ev: money(m.ev),
    ac: money(m.ac),
    cv: money(m.cv),
    sv: money(m.sv),
    cpi: m.cpi,
    spi: m.spi,
    cpiStatus: indexStatus(m.cpi),
    spiStatus: indexStatus(m.spi),
    eac: { cpi: money(m.eac.cpi), budget: money(m.eac.budget), cpiSpi: money(m.eac.cpiSpi) },
    etc: { cpi: money(m.etc.cpi), budget: money(m.etc.budget), cpiSpi: money(m.etc.cpiSpi) },
    vac: { cpi: money(m.vac.cpi), budget: money(m.vac.budget), cpiSpi: money(m.vac.cpiSpi) },
    tcpiBac: m.tcpiBac,
    tcpiEac: m.tcpiEac,
    acCoverage: m.acCoverage,
    earlyStage: m.earlyStage,
  };
}

export type EvmMetricsDTO = ReturnType<typeof metricsDTO>;

export async function buildEarnedValue(db: D1Database, m: ScheduleModel, opts: EvmOptions = {}) {
  const baselines = (await db.prepare('SELECT id, number, name, approved_on, approved_by FROM project_baselines WHERE board_id = ? ORDER BY number').bind(m.board.id).all<Pick<BaselineRow, 'id' | 'number' | 'name' | 'approved_on' | 'approved_by'>>()).results;
  const currency = await projectCurrency(db, m);
  const loaded = await loadBaseline(db, m.board.id, opts.baselineId ?? null);
  const statusDate = opts.statusDate && isIsoDate(opts.statusDate) ? opts.statusDate.slice(0, 10) : m.statusDate;
  if (!loaded) return { available: false as const, reason: 'Create an approved baseline first: earned value measures progress against it.', baselines, currency, statusDate };
  const { baseline, tasks: bTasks } = loaded;
  if (!baseline.currency || baseline.bac == null) {
    return { available: false as const, reason: 'This baseline has no budget: give the project a currency and an approved budget (or estimated cost) column, then create a new baseline.', baselines, currency, statusDate, baseline: { id: baseline.id, number: baseline.number, name: baseline.name } };
  }
  const bcalDef = parseJson<CalendarDefinition>(baseline.calendar_json, m.calendar);
  const epoch = [m.cal.epoch, baseline.project_start ? addDays(baseline.project_start, -14) : m.cal.epoch].sort()[0];
  const bcal = new WorkCalendar(bcalDef, epoch);

  const [progressRes, costRes] = await Promise.all([
    db.prepare('SELECT item_id, as_of, percent_complete, physical_percent, units_done, milestones_json FROM task_progress_entries WHERE board_id = ? ORDER BY as_of, created_at').bind(m.board.id).all<ProgressRow>(),
    db.prepare('SELECT item_id, spent_on, amount, currency, category FROM task_cost_entries WHERE board_id = ? ORDER BY spent_on').bind(m.board.id).all<CostRow>(),
  ]);
  const progressBy = new Map<string, ProgressRow[]>();
  for (const p of progressRes.results) progressBy.set(p.item_id, [...(progressBy.get(p.item_id) ?? []), p]);
  const costBy = new Map<string, CostRow[]>();
  let otherCurrency = 0;
  for (const c of costRes.results) {
    if (c.currency !== baseline.currency) {
      otherCurrency++;
      continue;
    }
    costBy.set(c.item_id, [...(costBy.get(c.item_id) ?? []), c]);
  }
  const acCol = actualCostColumn(m);
  // The real today: current values stand in for a record only at today's date, never for a past status date.
  const today = statusDateFor(m.calendar);
  const inGroup = (itemId: string) => !opts.groupId || m.byId.get(itemId)?.groupId === opts.groupId;
  const leaf = bTasks.filter((t) => !t.summary && t.planned_cost != null && inGroup(t.item_id));

  /** Inputs for one status date. */
  const inputsAt = (date: string): { inputs: EvmTaskInput[]; undatedActuals: number } => {
    let undatedActuals = 0;
    const isToday = date >= today;
    const inputs = leaf.map((bt): EvmTaskInput => {
      const cur = m.byId.get(bt.item_id);
      const sched = cur?.schedule ?? null;
      const earning = parseJson<{ milestones?: { name: string; weight: number; doneOn?: string | null }[]; unitsTotal?: number; unitsDone?: number }>(sched?.earning_json, {});
      const pvJson = parseJson<{ points?: [number, number][]; milestones?: { date: string; weight: number }[] }>(bt.pv_json, {});
      const hist = (progressBy.get(bt.item_id) ?? []).filter((p) => p.as_of <= date);
      const last = hist[hist.length - 1];
      const percent = last?.percent_complete ?? (isToday ? cur?.percentComplete ?? null : null);
      const physical = last?.physical_percent ?? (isToday ? sched?.physical_percent ?? null : null);
      const unitsDone = last?.units_done ?? (isToday ? earning.unitsDone ?? null : null);
      const msDone = last?.milestones_json ? parseJson<string[]>(last.milestones_json, []) : null;
      const curve: PvCurve = { profile: bt.pv_profile, points: pvJson.points, milestones: (pvJson.milestones ?? []).filter((x) => isIsoDate(x.date)).map((x) => ({ offset: bcal.finishOffset(x.date), weight: x.weight })) };
      let ac: bigint | null = null;
      const entries = (costBy.get(bt.item_id) ?? []).filter((c) => c.spent_on <= date);
      if (entries.length) ac = entries.reduce((n, c) => n + (toScaled(c.amount) ?? 0n), 0n);
      else if ((costBy.get(bt.item_id) ?? []).length === 0 && isToday && acCol && cur) {
        const v = toScaled(cur.values[acCol.id]);
        if (v != null) {
          ac = v;
          undatedActuals++;
        }
      }
      return {
        id: bt.item_id,
        bac: toScaled(bt.planned_cost) ?? 0n,
        start: bt.planned_start ? bcal.startOffset(bt.planned_start) : 0,
        finish: bt.planned_finish ? bcal.finishOffset(bt.planned_finish) : 0,
        curve,
        method: (bt.earning_method as EarningMethod) ?? 'percent_complete',
        percentComplete: percent,
        physicalPercent: physical,
        started: !!cur?.actualStart && cur.actualStart <= date,
        finished: !!cur?.actualFinish && cur.actualFinish <= date,
        milestones: (earning.milestones ?? []).map((ms) => ({ weight: ms.weight, done: msDone ? msDone.includes(ms.name) : !!ms.doneOn && ms.doneOn <= date })),
        unitsDone,
        unitsTotal: earning.unitsTotal ?? null,
        ac,
      };
    });
    return { inputs, undatedActuals };
  };

  const { inputs, undatedActuals } = inputsAt(statusDate);
  const statusOffset = bcal.finishOffset(statusDate);
  const rows = evaluateTasks(inputs, statusOffset);
  const metrics = evmMetrics(rows);

  // Trend: cumulative values at weekly (or, for longer projects, monthly) points up to the status date.
  const start = baseline.project_start ?? m.projectStart;
  const points: string[] = [];
  if (start && start <= statusDate) {
    const days = Math.max(1, Math.round((Date.parse(statusDate) - Date.parse(start)) / 86_400_000));
    const step = days <= 26 * 7 ? 7 : 30;
    for (let d = start; d < statusDate && points.length < 59; d = addDays(d, step)) points.push(d);
    points.push(statusDate);
  }
  const trend = points.map((d) => {
    const at = inputsAt(d);
    const mm = evmMetrics(evaluateTasks(at.inputs, bcal.finishOffset(d)));
    return { date: d, pv: money(mm.pv), ev: money(mm.ev), ac: money(mm.ac), cpi: mm.cpi, spi: mm.spi };
  });
  // Planned (baseline) cumulative curve to the baseline finish, for budget versus forecast.
  const plan: { date: string; pv: string | null }[] = [];
  if (start && baseline.project_finish) {
    const days = Math.max(1, Math.round((Date.parse(baseline.project_finish) - Date.parse(start)) / 86_400_000));
    const step = Math.max(7, Math.ceil(days / 40));
    for (let d = start; d <= baseline.project_finish; d = addDays(d, step)) plan.push({ date: d, pv: money(evmMetrics(evaluateTasks(inputs, bcal.finishOffset(d))).pv) });
    plan.push({ date: baseline.project_finish, pv: money(metrics.bac) });
  }
  // Actual cost by category (cost entries), on or before the status date.
  const byCategory = new Map<string, bigint>();
  for (const [itemId, list] of costBy) {
    if (!inGroup(itemId)) continue;
    for (const c of list) if (c.spent_on <= statusDate) byCategory.set(c.category || 'Uncategorised', (byCategory.get(c.category || 'Uncategorised') ?? 0n) + (toScaled(c.amount) ?? 0n));
  }

  const warnings: string[] = [];
  if (otherCurrency) warnings.push(`${otherCurrency} cost entr${otherCurrency === 1 ? 'y is' : 'ies are'} in another currency than the baseline (${baseline.currency}) and not counted: no exchange rates are assumed.`);
  if (undatedActuals) warnings.push(`${undatedActuals} task${undatedActuals === 1 ? '' : 's'} have no dated cost entries; today's figure in the actual cost column is used for today only.`);
  if (metrics.ac == null) warnings.push('No actual cost is recorded, so cost performance (CV, CPI, EAC, ETC, VAC, TCPI) is unavailable.');
  if (metrics.earlyStage) warnings.push('Less than 10% of the work is earned: performance indices can change a lot as work progresses.');
  const noted = rows.filter((r) => r.note);
  if (noted.length) warnings.push(`${noted.length} task${noted.length === 1 ? '' : 's'} earn nothing yet because of missing progress data (${Array.from(new Set(noted.map((r) => r.note))).join('; ')}).`);
  const notInBaseline = m.tasks.filter((t) => !t.summary && inGroup(t.itemId) && !bTasks.some((b) => b.item_id === t.itemId));
  if (notInBaseline.length) warnings.push(`${notInBaseline.length} task${notInBaseline.length === 1 ? ' was' : 's were'} added after this baseline and ${notInBaseline.length === 1 ? 'is' : 'are'} not in its budget.`);

  return {
    available: true as const,
    currency: baseline.currency,
    statusDate,
    baselines,
    baseline: { id: baseline.id, number: baseline.number, name: baseline.name, approvedOn: baseline.approved_on, approvedBy: baseline.approved_by, projectStart: baseline.project_start, projectFinish: baseline.project_finish },
    group: opts.groupId ?? null,
    metrics: metricsDTO(metrics),
    tasks: rows.map((r) => {
      const t = m.byId.get(r.id);
      const bt = leaf.find((b) => b.item_id === r.id)!;
      return {
        itemId: r.id,
        key: t?.key ?? bt.task_key,
        wbs: t?.wbs ?? bt.wbs,
        name: t?.name ?? bt.name,
        method: bt.earning_method,
        methodLabel: EARNING_METHOD_LABELS[bt.earning_method as EarningMethod] ?? bt.earning_method,
        pvProfile: PV_PROFILE_LABELS[bt.pv_profile as PvProfile] ?? bt.pv_profile,
        bac: money(r.bac),
        pv: money(r.pv),
        ev: money(r.ev),
        ac: money(r.ac),
        cv: r.ac == null ? null : money(r.ev - r.ac),
        sv: money(r.ev - r.pv),
        plannedPercent: r.plannedPercent,
        earnedPercent: r.earnedPercent,
        note: r.note,
      };
    }),
    trend,
    plan,
    costByCategory: Array.from(byCategory, ([category, amount]) => ({ category, amount: money(amount) })),
    warnings,
    definitions: EVM_DEFINITIONS,
  };
}

export const EVM_DEFINITIONS: Record<string, string> = {
  BAC: 'Budget at completion: the total approved budget in the selected baseline.',
  PV: 'Planned value: the budget of the work planned to be done by the status date (time-phased by each task’s planned value curve).',
  EV: 'Earned value: the budget of the work actually done by the status date (by each task’s earning method).',
  AC: 'Actual cost: the cost recorded for the work by the status date.',
  CV: 'Cost variance = EV − AC. Negative: the work cost more than budgeted.',
  SV: 'Schedule variance = EV − PV. Negative: less work done than planned.',
  CPI: 'Cost performance index = EV / AC. Below 1.00: over budget for the work done.',
  SPI: 'Schedule performance index = EV / PV. Below 1.00: behind planned progress.',
  EAC: 'Estimate at completion. By CPI: BAC / CPI. By budget: AC + (BAC − EV). By CPI × SPI: AC + (BAC − EV) / (CPI × SPI).',
  ETC: 'Estimate to complete = EAC − AC.',
  VAC: 'Variance at completion = BAC − EAC. Negative: forecast to overrun.',
  TCPI: 'To-complete performance index: the cost efficiency needed on the remaining work. To meet BAC: (BAC − EV) / (BAC − AC). To meet EAC: (BAC − EV) / (EAC − AC).',
};
