// Approved baselines: an immutable copy of the plan (dates, durations, work, owners, budgets, planned value curves,
// earning methods and dependencies) at the moment of approval. Rows are only ever inserted (database triggers refuse
// updates, migration 0008); a revised baseline is a new row that points to the one it replaces, so baseline 0, the
// original, is always there to compare with.

import { newId, now, parseJson } from '../../lib/util';
import { resolveColumnCurrency } from '../../../shared/finance';
import { scaledToDecimal, toScaled } from '../../../shared/money';
import type { CalendarDefinition, EarningMethod, PvProfile } from '../../../shared/schedule';
import { WorkCalendar } from './calendar';
import type { ScheduleModel } from './project';

export interface BaselineRow {
  id: string;
  board_id: string;
  workspace_id: string;
  number: number;
  name: string;
  notes: string;
  reason: string;
  approved_by: string;
  approved_on: string;
  previous_baseline_id: string | null;
  project_start: string | null;
  project_finish: string | null;
  currency: string | null;
  bac: string | null;
  calendar_json: string;
  settings_json: string;
  created_by: string;
  created_at: number;
}

export interface BaselineTaskRow {
  baseline_id: string;
  item_id: string;
  task_key: string | null;
  wbs: string;
  name: string;
  planned_start: string | null;
  planned_finish: string | null;
  duration_minutes: number | null;
  work_minutes: number | null;
  owners_json: string;
  planned_cost: string | null;
  pv_profile: PvProfile;
  pv_json: string;
  earning_method: EarningMethod;
  milestone: number;
  summary: number;
  predecessors_json: string;
}

/** The budget column: approved budget, else estimated cost (finance roles of currency columns). */
export function budgetColumn(m: ScheduleModel) {
  const fin = m.columns.filter((c) => c.type === 'currency');
  const role = (c: { settings_json: string }) => parseJson<{ financeRole?: string }>(c.settings_json, {}).financeRole;
  return fin.find((c) => role(c) === 'approved_budget') ?? fin.find((c) => role(c) === 'estimated_cost') ?? null;
}

export function actualCostColumn(m: ScheduleModel) {
  return m.columns.find((c) => c.type === 'currency' && parseJson<{ financeRole?: string }>(c.settings_json, {}).financeRole === 'actual_cost') ?? null;
}

export async function projectCurrency(db: D1Database, m: ScheduleModel): Promise<string | null> {
  if (m.board.currency) return m.board.currency;
  const ws = await db.prepare('SELECT default_currency FROM workspaces WHERE id = ?').bind(m.board.workspace_id).first<{ default_currency: string | null }>();
  return ws?.default_currency ?? null;
}

export async function listBaselines(db: D1Database, boardId: string): Promise<BaselineRow[]> {
  return (await db.prepare('SELECT * FROM project_baselines WHERE board_id = ? ORDER BY number').bind(boardId).all<BaselineRow>()).results;
}

export async function loadBaseline(db: D1Database, boardId: string, id: string | null | undefined): Promise<{ baseline: BaselineRow; tasks: BaselineTaskRow[] } | null> {
  const b = id
    ? await db.prepare('SELECT * FROM project_baselines WHERE id = ? AND board_id = ?').bind(id, boardId).first<BaselineRow>()
    : await db.prepare('SELECT * FROM project_baselines WHERE board_id = ? ORDER BY number DESC LIMIT 1').bind(boardId).first<BaselineRow>();
  if (!b) return null;
  const tasks = await db.prepare('SELECT * FROM baseline_tasks WHERE baseline_id = ? ORDER BY wbs').bind(b.id).all<BaselineTaskRow>();
  return { baseline: b, tasks: tasks.results };
}

export interface NewBaseline {
  name: string;
  notes: string;
  reason: string;
  approvedBy: string;
  approvedOn: string;
}

/** Freezes the current schedule as the next baseline. Budgets come from the budget column, in the project currency. */
export async function createBaseline(db: D1Database, m: ScheduleModel, input: NewBaseline, userId: string): Promise<{ id: string; number: number; skippedCurrency: number }> {
  const prev = await db.prepare('SELECT id, number FROM project_baselines WHERE board_id = ? ORDER BY number DESC LIMIT 1').bind(m.board.id).first<{ id: string; number: number }>();
  const number = prev ? prev.number + 1 : 0;
  const id = newId();
  const t = now();
  const currency = await projectCurrency(db, m);
  const ws = await db.prepare('SELECT default_currency FROM workspaces WHERE id = ?').bind(m.board.workspace_id).first<{ default_currency: string | null }>();
  const budget = budgetColumn(m);
  const budgetCurrency = budget ? resolveColumnCurrency(parseJson(budget.settings_json, {}), m.board.currency ?? null, ws?.default_currency ?? null).currency : null;
  // Budgets in another currency are not converted (no exchange rates are assumed): they are left out and counted.
  const useBudget = budget && budgetCurrency && currency && budgetCurrency === currency;
  let bac = 0n;
  let skippedCurrency = 0;
  const label = (itemId: string) => m.byId.get(itemId)?.key ?? itemId;
  const rows = m.tasks.map((task) => {
    const raw = budget ? task.values[budget.id] : undefined;
    const scaled = useBudget && !task.summary ? toScaled(raw) : null;
    if (budget && !useBudget && raw != null && raw !== '') skippedCurrency++;
    if (scaled != null) bac += scaled;
    const preds = m.links.filter((l) => l.successorId === task.itemId).map((l) => ({ id: l.predecessorId, key: label(l.predecessorId), type: l.type, lagMinutes: l.lagMinutes }));
    return db
      .prepare(
        `INSERT INTO baseline_tasks (baseline_id, item_id, task_key, wbs, name, planned_start, planned_finish, duration_minutes, work_minutes, owners_json, planned_cost, pv_profile, pv_json, earning_method, milestone, summary, predecessors_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        task.itemId,
        task.key,
        task.wbs,
        task.name,
        task.earlyStart ?? task.plannedStart,
        task.earlyFinish ?? task.plannedFinish,
        task.durationMinutes,
        task.workMinutes,
        JSON.stringify(task.owners),
        scaled == null ? null : scaledToDecimal(scaled, 4),
        task.pvProfile,
        task.schedule?.pv_json ?? '{}',
        task.earningMethod,
        task.milestone ? 1 : 0,
        task.summary ? 1 : 0,
        JSON.stringify(preds),
      );
  });
  const header = db
    .prepare(
      `INSERT INTO project_baselines (id, board_id, workspace_id, number, name, notes, reason, approved_by, approved_on, previous_baseline_id, project_start, project_finish, currency, bac, calendar_json, settings_json, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      m.board.id,
      m.board.workspace_id,
      number,
      input.name,
      input.notes,
      input.reason,
      input.approvedBy,
      input.approvedOn,
      prev?.id ?? null,
      m.summary.projectStart,
      m.summary.projectFinish,
      useBudget ? currency : null,
      useBudget ? scaledToDecimal(bac, 4) : null,
      JSON.stringify(m.calendar),
      JSON.stringify({ ...m.settings, statusDate: m.statusDate, budgetColumnId: budget?.id ?? null }),
      userId,
      t,
    );
  // One batch: the baseline and all of its tasks are written together or not at all.
  await db.batch([header, ...rows]);
  return { id, number, skippedCurrency };
}

export interface BaselineComparisonRow {
  itemId: string;
  key: string | null;
  wbs: string;
  name: string;
  inBaseline: boolean;
  inPlan: boolean;
  baselineStart: string | null;
  baselineFinish: string | null;
  baselineDurationDays: number | null;
  baselineCost: string | null;
  currentStart: string | null;
  currentFinish: string | null;
  currentDurationDays: number | null;
  currentCost: string | null;
  actualStart: string | null;
  actualFinish: string | null;
  /** Working days; positive = later or longer than the baseline. */
  startVarianceDays: number | null;
  finishVarianceDays: number | null;
  durationVarianceDays: number | null;
  /** Current budget minus baseline budget. */
  costVariance: string | null;
  /** Percent complete now minus percent planned by the status date (percentage points). */
  progressVariance: number | null;
  plannedPercent: number | null;
  percentComplete: number | null;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function compareBaseline(m: ScheduleModel, b: { baseline: BaselineRow; tasks: BaselineTaskRow[] }): { rows: BaselineComparisonRow[]; projectFinishVarianceDays: number | null } {
  const bcal = new WorkCalendar(parseJson<CalendarDefinition>(b.baseline.calendar_json, m.calendar), m.cal.epoch);
  const cal = m.cal;
  const mpd = cal.minutesPerDay;
  const budget = budgetColumn(m);
  const seen = new Set<string>();
  const rows: BaselineComparisonRow[] = [];
  const startVar = (a: string | null, z: string | null) => (a && z ? r2((cal.startOffset(z) - cal.startOffset(a)) / mpd) : null);
  const finishVar = (a: string | null, z: string | null) => (a && z ? r2((cal.finishOffset(z) - cal.finishOffset(a)) / mpd) : null);
  for (const bt of b.tasks) {
    seen.add(bt.item_id);
    const cur = m.byId.get(bt.item_id);
    const curStart = cur ? cur.actualStart ?? cur.earlyStart ?? cur.plannedStart : null;
    const curFinish = cur ? cur.actualFinish ?? cur.earlyFinish ?? cur.plannedFinish : null;
    const curCost = cur && budget ? toScaled(cur.values[budget.id]) : null;
    const baseCost = bt.planned_cost != null ? toScaled(bt.planned_cost) : null;
    let plannedPercent: number | null = null;
    if (bt.planned_start && bt.planned_finish) {
      const s = bcal.startOffset(bt.planned_start);
      const f = bcal.finishOffset(bt.planned_finish);
      const so = bcal.finishOffset(m.statusDate);
      plannedPercent = f <= s ? (so >= f ? 100 : 0) : r2(Math.min(1, Math.max(0, (so - s) / (f - s))) * 100);
    }
    rows.push({
      itemId: bt.item_id,
      key: bt.task_key,
      wbs: cur?.wbs ?? bt.wbs,
      name: cur?.name ?? bt.name,
      inBaseline: true,
      inPlan: !!cur,
      baselineStart: bt.planned_start,
      baselineFinish: bt.planned_finish,
      baselineDurationDays: bt.duration_minutes == null ? null : r2(bt.duration_minutes / (bcal.minutesPerDay || mpd)),
      baselineCost: baseCost == null ? null : scaledToDecimal(baseCost, 2),
      currentStart: curStart,
      currentFinish: curFinish,
      currentDurationDays: cur?.durationDays ?? null,
      currentCost: curCost == null ? null : scaledToDecimal(curCost, 2),
      actualStart: cur?.actualStart ?? null,
      actualFinish: cur?.actualFinish ?? null,
      startVarianceDays: startVar(bt.planned_start, curStart),
      finishVarianceDays: finishVar(bt.planned_finish, curFinish),
      durationVarianceDays: cur?.durationMinutes != null && bt.duration_minutes != null ? r2((cur.durationMinutes - bt.duration_minutes) / mpd) : null,
      costVariance: curCost != null && baseCost != null ? scaledToDecimal(curCost - baseCost, 2) : null,
      progressVariance: cur?.percentComplete != null && plannedPercent != null ? r2(cur.percentComplete - plannedPercent) : null,
      plannedPercent,
      percentComplete: cur?.percentComplete ?? null,
    });
  }
  for (const cur of m.tasks) {
    if (seen.has(cur.itemId)) continue;
    rows.push({
      itemId: cur.itemId,
      key: cur.key,
      wbs: cur.wbs,
      name: cur.name,
      inBaseline: false,
      inPlan: true,
      baselineStart: null,
      baselineFinish: null,
      baselineDurationDays: null,
      baselineCost: null,
      currentStart: cur.earlyStart ?? cur.plannedStart,
      currentFinish: cur.earlyFinish ?? cur.plannedFinish,
      currentDurationDays: cur.durationDays,
      currentCost: null,
      actualStart: cur.actualStart,
      actualFinish: cur.actualFinish,
      startVarianceDays: null,
      finishVarianceDays: null,
      durationVarianceDays: null,
      costVariance: null,
      progressVariance: null,
      plannedPercent: null,
      percentComplete: cur.percentComplete,
    });
  }
  return { rows, projectFinishVarianceDays: finishVar(b.baseline.project_finish, m.summary.projectFinish) };
}
