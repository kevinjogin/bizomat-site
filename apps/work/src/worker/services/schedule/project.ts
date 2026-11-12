// A project's schedule: loads the board, its tasks, scheduling data, links and calendar; resolves each task's
// duration, constraints and actual dates; numbers the work breakdown structure; runs the CPM engine (cpm.ts) on the
// working-time axis (calendar.ts); rolls results up to summary tasks; and lists schedule quality warnings. Every view,
// endpoint and report uses this one function, so they all show the same numbers.

import type { Env } from '../../env';
import type { BoardRow } from '../permissions';
import {
  DEFAULT_CALENDAR,
  DEFAULT_SCHEDULE_SETTINGS,
  EARNING_METHODS,
  PV_PROFILES,
  type CalendarDefinition,
  type ConstraintType,
  type Criticality,
  type DurationUnit,
  type EarningMethod,
  type LinkDTO,
  type LinkType,
  type PvProfile,
  type ScheduleDTO,
  type ScheduleSettings,
  type ScheduleWarning,
  type SchedulingType,
  type TaskScheduleDTO,
} from '../../../shared/schedule';
import { addDays, diffDays, isIsoDate, todayIn, toIsoDate } from '../../../shared/dates';
import { parseJson, sha256Hex } from '../../lib/util';
import { WorkCalendar, normaliseCalendar } from './calendar';
import { runCpm, type CpmLink, type CpmResult, type CpmTask } from './cpm';
import { ensureTaskKeys } from './task-keys';

export interface ScheduleRow {
  item_id: string;
  duration_minutes: number | null;
  duration_unit: DurationUnit;
  remaining_minutes: number | null;
  milestone: number;
  constraint_type: ConstraintType;
  constraint_date: string | null;
  actual_start: string | null;
  actual_finish: string | null;
  percent_complete: number | null;
  physical_percent: number | null;
  scheduling_type: SchedulingType;
  work_minutes: number | null;
  units: number | null;
  earning_method: EarningMethod | null;
  earning_json: string;
  pv_profile: PvProfile | null;
  pv_json: string;
  updated_at: number;
}

export interface LinkRow {
  id: string;
  predecessor_id: string;
  successor_id: string;
  type: LinkType;
  lag_minutes: number;
  lag_unit: DurationUnit;
  updated_at: number;
}

interface ItemLite {
  id: string;
  group_id: string;
  parent_item_id: string | null;
  name: string;
  position: number;
  values_json: string;
  updated_at: number;
  completed_at: number | null;
  task_key: string | null;
  created_at: number;
}

interface ColumnLite {
  id: string;
  type: string;
  title: string;
  settings_json: string;
}

export function scheduleSettings(board: Pick<BoardRow, 'settings_json'> & { task_prefix?: string | null }): ScheduleSettings {
  const s = parseJson<{ schedule?: Partial<ScheduleSettings> }>(board.settings_json, {}).schedule ?? {};
  const earning = EARNING_METHODS.includes(s.defaultEarningMethod as EarningMethod) ? (s.defaultEarningMethod as EarningMethod) : DEFAULT_SCHEDULE_SETTINGS.defaultEarningMethod;
  const pv = PV_PROFILES.includes(s.defaultPvProfile as PvProfile) ? (s.defaultPvProfile as PvProfile) : DEFAULT_SCHEDULE_SETTINGS.defaultPvProfile;
  const crit = Number.isFinite(s.criticalDays) ? Math.max(0, Number(s.criticalDays)) : DEFAULT_SCHEDULE_SETTINGS.criticalDays;
  const near = Number.isFinite(s.nearCriticalDays) ? Math.max(crit, Number(s.nearCriticalDays)) : Math.max(crit, DEFAULT_SCHEDULE_SETTINGS.nearCriticalDays);
  return {
    prefix: board.task_prefix ?? null,
    timelineColumnId: typeof s.timelineColumnId === 'string' ? s.timelineColumnId : null,
    projectStart: isIsoDate(s.projectStart) ? s.projectStart.slice(0, 10) : null,
    criticalDays: crit,
    nearCriticalDays: near,
    defaultEarningMethod: earning,
    defaultPvProfile: pv,
  };
}

export async function loadCalendar(db: D1Database, board: Pick<BoardRow, 'id' | 'workspace_id'>): Promise<{ calendar: CalendarDefinition; scope: 'project' | 'organisation' | 'default'; updatedAt: number }> {
  const rows = await db
    .prepare('SELECT board_id, definition_json, updated_at FROM project_calendars WHERE workspace_id = ? AND (board_id = ? OR board_id IS NULL)')
    .bind(board.workspace_id, board.id)
    .all<{ board_id: string | null; definition_json: string; updated_at: number }>();
  const own = rows.results.find((r) => r.board_id === board.id);
  const org = rows.results.find((r) => r.board_id == null);
  const row = own ?? org;
  if (!row) return { calendar: DEFAULT_CALENDAR, scope: 'default', updatedAt: 0 };
  return { calendar: normaliseCalendar(parseJson(row.definition_json, {})), scope: own ? 'project' : 'organisation', updatedAt: row.updated_at };
}

function idsOf(v: unknown): string[] {
  if (typeof v === 'string' && v) return [v];
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  return [];
}

export interface ScheduledTask extends TaskScheduleDTO {
  es: number | null;
  ef: number | null;
  ls: number | null;
  lf: number | null;
  totalFloat: number | null;
  /** Raw values, for EVM and reports. */
  values: Record<string, unknown>;
  schedule: ScheduleRow | null;
  complete: boolean;
}

export interface ScheduleModel {
  board: BoardRow;
  settings: ScheduleSettings;
  calendar: CalendarDefinition;
  calendarScope: 'project' | 'organisation' | 'default';
  cal: WorkCalendar;
  timelineColumnId: string | null;
  progressColumnId: string | null;
  columns: ColumnLite[];
  groups: { id: string; name: string; position: number; wbs: string; color: string }[];
  tasks: ScheduledTask[];
  byId: Map<string, ScheduledTask>;
  links: LinkDTO[];
  cpm: CpmResult;
  statusDate: string;
  statusOffset: number;
  projectStart: string;
  projectStartOffset: number;
  summary: ScheduleDTO['summary'];
  warnings: ScheduleWarning[];
  inputsVersion: string;
}

/** Display date of a working-minute offset (finish semantics except at the very start of the project). */
export function finishDate(cal: WorkCalendar, offset: number, projectStartOffset: number): string {
  return offset > projectStartOffset ? cal.dateAtFinish(offset) : cal.dateAtStart(offset);
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * `plan: true` schedules without a status date (the plan as approved, for baselines); otherwise work not started is not
 * scheduled before the status date (today unless given), which gives the current forecast.
 */
export async function buildSchedule(env: Env, board: BoardRow, opts: { statusDate?: string | null; plan?: boolean } = {}): Promise<ScheduleModel> {
  const db = env.DB;
  await ensureTaskKeys(db, board);
  const fresh = (await db.prepare('SELECT * FROM boards WHERE id = ?').bind(board.id).first<BoardRow>()) ?? board;
  const settings = scheduleSettings(fresh);
  const [groupsRes, columnsRes, itemsRes, schedRes, linkRes, calendarInfo] = await Promise.all([
    db.prepare('SELECT id, name, color, position FROM groups WHERE board_id = ? AND archived_at IS NULL ORDER BY position').bind(board.id).all<{ id: string; name: string; color: string; position: number }>(),
    db.prepare('SELECT id, type, title, settings_json FROM columns WHERE board_id = ? ORDER BY position').bind(board.id).all<ColumnLite>(),
    db.prepare('SELECT id, group_id, parent_item_id, name, position, values_json, updated_at, completed_at, task_key, created_at FROM items WHERE board_id = ? AND archived_at IS NULL').bind(board.id).all<ItemLite>(),
    db.prepare('SELECT * FROM task_schedules WHERE board_id = ?').bind(board.id).all<ScheduleRow>(),
    db.prepare('SELECT id, predecessor_id, successor_id, type, lag_minutes, lag_unit, updated_at FROM task_links WHERE board_id = ?').bind(board.id).all<LinkRow>(),
    loadCalendar(db, board),
  ]);
  const columns = columnsRes.results;
  const timelineCol = columns.find((c) => c.id === settings.timelineColumnId && c.type === 'timeline') ?? columns.find((c) => c.type === 'timeline') ?? null;
  const progressCol = columns.find((c) => c.type === 'progress') ?? null;
  const depCols = columns.filter((c) => c.type === 'dependency');
  const peopleCols = columns.filter((c) => c.type === 'person' || c.type === 'people');
  const calendar = calendarInfo.calendar;
  const statusDate = opts.statusDate && isIsoDate(opts.statusDate) ? opts.statusDate.slice(0, 10) : todayIn(calendar.timezone);
  const schedules = new Map(schedRes.results.map((r) => [r.item_id, r]));

  // ---------------------------------------------------------------- work breakdown structure
  const groups = groupsRes.results.map((g, i) => ({ ...g, wbs: String(i + 1) }));
  const groupWbs = new Map(groups.map((g) => [g.id, g.wbs]));
  const items = itemsRes.results.filter((i) => groupWbs.has(i.group_id));
  const children = new Map<string, ItemLite[]>();
  for (const it of items) if (it.parent_item_id) children.set(it.parent_item_id, [...(children.get(it.parent_item_id) ?? []), it]);
  const wbs = new Map<string, string>();
  for (const g of groups) {
    const top = items.filter((i) => i.group_id === g.id && !i.parent_item_id).sort((a, b) => a.position - b.position);
    top.forEach((t, i) => {
      wbs.set(t.id, `${g.wbs}.${i + 1}`);
      (children.get(t.id) ?? []).sort((a, b) => a.position - b.position).forEach((c, j) => wbs.set(c.id, `${g.wbs}.${i + 1}.${j + 1}`));
    });
  }
  const ordered = [...items].filter((i) => wbs.has(i.id)).sort((a, b) => {
    const pa = wbs.get(a.id)!.split('.').map(Number);
    const pb = wbs.get(b.id)!.split('.').map(Number);
    for (let k = 0; k < Math.max(pa.length, pb.length); k++) if ((pa[k] ?? -1) !== (pb[k] ?? -1)) return (pa[k] ?? -1) - (pb[k] ?? -1);
    return 0;
  });

  // ---------------------------------------------------------------- dates on the working-time axis
  const valuesOf = new Map(ordered.map((i) => [i.id, parseJson<Record<string, unknown>>(i.values_json, {})]));
  const planned = (id: string): { start: string; end: string } | null => {
    if (!timelineCol) return null;
    const v = valuesOf.get(id)?.[timelineCol.id] as { start?: string; end?: string } | undefined;
    return v && isIsoDate(v.start) && isIsoDate(v.end) ? { start: v.start.slice(0, 10), end: v.end.slice(0, 10) } : null;
  };
  const known: string[] = [statusDate];
  if (settings.projectStart) known.push(settings.projectStart);
  if (fresh.start_date && isIsoDate(fresh.start_date)) known.push(fresh.start_date);
  for (const it of ordered) {
    const p = planned(it.id);
    if (p) known.push(p.start);
    const s = schedules.get(it.id);
    if (s?.actual_start) known.push(s.actual_start);
    if (s?.constraint_date) known.push(s.constraint_date);
  }
  const epoch = addDays(known.sort()[0], -14);
  const cal = new WorkCalendar(calendar, epoch);
  const plannedStarts = ordered.map((i) => planned(i.id)?.start).filter((x): x is string => !!x).sort();
  const projectStart = settings.projectStart ?? (fresh.start_date && isIsoDate(fresh.start_date) ? fresh.start_date.slice(0, 10) : null) ?? plannedStarts[0] ?? statusDate;
  const projectStartOffset = cal.startOffset(projectStart);
  const statusOffset = cal.startOffset(statusDate);

  // ---------------------------------------------------------------- links (typed links, plus the Dependency column)
  const summaryIds = new Set(ordered.filter((i) => (children.get(i.id) ?? []).length > 0).map((i) => i.id));
  const live = new Set(ordered.map((i) => i.id));
  const warnings: ScheduleWarning[] = [];
  const links: LinkDTO[] = [];
  const pairs = new Set<string>();
  for (const l of linkRes.results) {
    if (!live.has(l.predecessor_id) || !live.has(l.successor_id)) continue;
    pairs.add(`${l.predecessor_id}>${l.successor_id}`);
    links.push({ id: l.id, predecessorId: l.predecessor_id, successorId: l.successor_id, type: l.type, lagMinutes: l.lag_minutes, lagUnit: l.lag_unit, source: 'link', floatDays: null, critical: false });
  }
  for (const col of depCols) {
    for (const it of ordered) {
      for (const pred of idsOf(valuesOf.get(it.id)?.[col.id])) {
        if (!live.has(pred) || pred === it.id || pairs.has(`${pred}>${it.id}`)) continue;
        pairs.add(`${pred}>${it.id}`);
        links.push({ id: `col:${pred}:${it.id}`, predecessorId: pred, successorId: it.id, type: 'FS', lagMinutes: 0, lagUnit: 'days', source: 'column', floatDays: null, critical: false });
      }
    }
  }
  const summaryLinks = links.filter((l) => summaryIds.has(l.predecessorId) || summaryIds.has(l.successorId));
  if (summaryLinks.length) warnings.push({ code: 'summary_link', message: 'Links to summary tasks (tasks with subtasks) are ignored: link their subtasks instead.', itemIds: Array.from(new Set(summaryLinks.flatMap((l) => [l.predecessorId, l.successorId]))) });

  // ---------------------------------------------------------------- activities for the CPM engine
  const cpmTasks: CpmTask[] = [];
  const meta = new Map<string, { dur: number | null; plannedStart: string | null; plannedFinish: string | null; complete: boolean; percent: number | null; actualStart: string | null; actualFinish: string | null }>();
  const missing: string[] = [];
  for (const it of ordered) {
    const s = schedules.get(it.id) ?? null;
    const p = planned(it.id);
    const values = valuesOf.get(it.id)!;
    const progressVal = progressCol ? values[progressCol.id] : undefined;
    const complete = it.completed_at != null || !!s?.actual_finish;
    const percent = complete ? 100 : typeof progressVal === 'number' ? progressVal : s?.percent_complete ?? null;
    let dur: number | null = null;
    const span = p ? cal.workingMinutesBetween(p.start, p.end) : null;
    if (s?.milestone) dur = 0;
    else if (span != null && s?.duration_minutes != null && s.duration_minutes <= span && s.duration_minutes > span - cal.minutesPerDay) dur = s.duration_minutes;
    else if (span != null) dur = span;
    else if (s?.duration_minutes != null) dur = s.duration_minutes;
    // Actual dates: recorded ones first; otherwise a finished task finished when it was marked done, and a task with
    // progress started on its planned start.
    let actualFinish = s?.actual_finish ?? (complete && it.completed_at ? todayIn(calendar.timezone, it.completed_at) : null);
    let actualStart = s?.actual_start ?? ((complete || (percent ?? 0) > 0) && p ? p.start : null);
    if (actualFinish && !actualStart) actualStart = p?.start && p.start <= actualFinish ? p.start : actualFinish;
    if (actualStart && actualFinish && actualFinish < actualStart) actualFinish = actualStart;
    meta.set(it.id, { dur, plannedStart: p?.start ?? null, plannedFinish: p?.end ?? null, complete, percent, actualStart, actualFinish });
    if (summaryIds.has(it.id)) continue;
    if (dur == null) {
      missing.push(it.id);
      continue;
    }
    const c = s && s.constraint_type !== 'ASAP' && s.constraint_date ? s.constraint_type : null;
    cpmTasks.push({
      id: it.id,
      duration: dur,
      anchor: p ? cal.startOffset(p.start) : null,
      constraint: c ? { type: c, offset: ['SNET', 'SNLT', 'MSO'].includes(c) ? cal.startOffset(s!.constraint_date!) : cal.finishOffset(s!.constraint_date!) } : null,
      actualStart: actualStart ? cal.startOffset(actualStart) : null,
      actualFinish: actualFinish ? cal.finishOffset(actualFinish) : null,
      remaining: s?.remaining_minutes ?? null,
    });
  }
  const scheduledIds = new Set(cpmTasks.map((t) => t.id));
  const cpmLinks: CpmLink[] = links
    .filter((l) => scheduledIds.has(l.predecessorId) && scheduledIds.has(l.successorId))
    .map((l) => ({ id: l.id, from: l.predecessorId, to: l.successorId, type: l.type, lag: l.lagMinutes }));
  const cpm = runCpm(cpmTasks, cpmLinks, {
    projectStart: projectStartOffset,
    statusOffset: opts.plan ? null : statusOffset,
    critical: Math.round(settings.criticalDays * cal.minutesPerDay),
    nearCritical: Math.round(settings.nearCriticalDays * cal.minutesPerDay),
  });

  // ---------------------------------------------------------------- results per task
  const mpd = cal.minutesPerDay;
  const owners = (id: string) => Array.from(new Set(peopleCols.flatMap((c) => idsOf(valuesOf.get(id)?.[c.id]))));
  const tasks: ScheduledTask[] = ordered.map((it) => {
    const s = schedules.get(it.id) ?? null;
    const m = meta.get(it.id)!;
    const r = cpm.tasks.get(it.id);
    const summary = summaryIds.has(it.id);
    const criticality: Criticality = summary ? 'non_critical' : r ? r.criticality : 'unscheduled';
    const fd = (o: number) => finishDate(cal, o, projectStartOffset);
    return {
      itemId: it.id,
      key: it.task_key,
      wbs: wbs.get(it.id)!,
      name: it.name,
      groupId: it.group_id,
      parentItemId: it.parent_item_id,
      summary,
      milestone: !!s?.milestone || (m.dur === 0 && !summary),
      plannedStart: m.plannedStart,
      plannedFinish: m.plannedFinish,
      durationMinutes: m.dur,
      durationUnit: s?.duration_unit ?? 'days',
      durationDays: m.dur == null ? null : round2(m.dur / mpd),
      elapsedDays: m.plannedStart && m.plannedFinish ? diffDays(m.plannedStart, m.plannedFinish) + 1 : null,
      remainingMinutes: s?.remaining_minutes ?? null,
      actualStart: m.actualStart,
      actualFinish: m.actualFinish,
      actualDurationDays: m.actualStart && m.actualFinish ? round2(cal.workingMinutesBetween(m.actualStart, m.actualFinish) / mpd) : null,
      percentComplete: m.percent,
      physicalPercent: s?.physical_percent ?? null,
      constraintType: s?.constraint_type ?? 'ASAP',
      constraintDate: s?.constraint_date ?? null,
      schedulingType: s?.scheduling_type ?? 'fixed_duration',
      workMinutes: s?.work_minutes ?? null,
      units: s?.units ?? null,
      earningMethod: s?.earning_method ?? settings.defaultEarningMethod,
      pvProfile: s?.pv_profile ?? settings.defaultPvProfile,
      owners: owners(it.id),
      earlyStart: r && criticality !== 'invalid' ? cal.dateAtStart(r.es) : null,
      earlyFinish: r && criticality !== 'invalid' ? (r.ef > r.es ? cal.dateAtFinish(r.ef) : fd(r.ef)) : null,
      lateStart: r && criticality !== 'invalid' ? cal.dateAtStart(r.ls) : null,
      lateFinish: r && criticality !== 'invalid' ? (r.lf > r.ls ? cal.dateAtFinish(r.lf) : fd(r.lf)) : null,
      totalFloatDays: r && criticality !== 'invalid' ? round2(r.totalFloat / mpd) : null,
      freeFloatDays: r && criticality !== 'invalid' ? round2(r.freeFloat / mpd) : null,
      criticality,
      predecessors: links.filter((l) => l.successorId === it.id).map((l) => l.predecessorId),
      successors: links.filter((l) => l.predecessorId === it.id).map((l) => l.successorId),
      conflicts: r?.conflicts ?? [],
      es: r && criticality !== 'invalid' ? r.es : null,
      ef: r && criticality !== 'invalid' ? r.ef : null,
      ls: r && criticality !== 'invalid' ? r.ls : null,
      lf: r && criticality !== 'invalid' ? r.lf : null,
      totalFloat: r && criticality !== 'invalid' ? r.totalFloat : null,
      values: valuesOf.get(it.id)!,
      schedule: s,
      complete: m.complete,
    };
  });
  const byId = new Map(tasks.map((t) => [t.itemId, t]));

  // Summary tasks: dates and float from their subtasks; progress weighted by duration.
  for (const t of tasks) {
    if (!t.summary) continue;
    const kids = (children.get(t.itemId) ?? []).map((k) => byId.get(k.id)!).filter((k) => k && k.es != null);
    if (!kids.length) continue;
    t.es = Math.min(...kids.map((k) => k.es!));
    t.ef = Math.max(...kids.map((k) => k.ef!));
    t.ls = Math.min(...kids.map((k) => k.ls!));
    t.lf = Math.max(...kids.map((k) => k.lf!));
    t.totalFloat = Math.min(...kids.map((k) => k.totalFloat!));
    t.earlyStart = cal.dateAtStart(t.es);
    t.earlyFinish = finishDate(cal, t.ef, projectStartOffset);
    t.lateStart = cal.dateAtStart(t.ls);
    t.lateFinish = finishDate(cal, t.lf, projectStartOffset);
    t.totalFloatDays = round2(t.totalFloat / mpd);
    t.durationMinutes = t.ef - t.es;
    t.durationDays = round2((t.ef - t.es) / mpd);
    t.criticality = kids.some((k) => k.criticality === 'critical') ? 'critical' : kids.some((k) => k.criticality === 'near_critical') ? 'near_critical' : 'non_critical';
    const weight = kids.reduce((n, k) => n + Math.max(1, k.durationMinutes ?? 0), 0);
    t.percentComplete = round2(kids.reduce((n, k) => n + (k.percentComplete ?? 0) * Math.max(1, k.durationMinutes ?? 0), 0) / weight);
  }
  for (const l of links) {
    const r = cpm.links.get(l.id);
    if (r) {
      l.floatDays = round2(r.float / mpd);
      l.critical = r.critical;
    }
  }

  // ---------------------------------------------------------------- schedule quality warnings
  const label = (id: string) => byId.get(id)?.key ?? byId.get(id)?.name ?? id;
  if (!cpm.valid) {
    for (const cyc of cpm.cycles) warnings.push({ code: 'cycle', message: `Dependency loop: ${[...cyc, cyc[0]].map(label).join(' → ')}. Remove one of these links; until then the schedule cannot be calculated.`, itemIds: cyc });
  }
  for (const t of tasks) if (t.conflicts.length) warnings.push({ code: 'constraint_conflict', message: `${label(t.itemId)}: ${t.conflicts.join('; ')}`, itemIds: [t.itemId] });
  if (cpm.valid) {
    for (const t of tasks) {
      if (t.summary || t.complete || !t.plannedStart || !t.earlyStart || !t.predecessors.length) continue;
      if (t.plannedStart < t.earlyStart) warnings.push({ code: 'date_conflict', message: `${label(t.itemId)} is planned to start ${t.plannedStart}, but its predecessors allow ${t.earlyStart} at the earliest.`, itemIds: [t.itemId] });
    }
  }
  if (missing.length && cpmTasks.length) warnings.push({ code: 'missing_duration', message: `${missing.length} task${missing.length === 1 ? ' has' : 's have'} no dates or duration, so ${missing.length === 1 ? 'it is' : 'they are'} not in the schedule.`, itemIds: missing });
  if (cpm.valid && cpmLinks.length) {
    const finish = cpm.projectFinish;
    const openStart = tasks.filter((t) => scheduledIds.has(t.itemId) && !t.complete && !t.predecessors.some((p) => scheduledIds.has(p)) && t.es != null && t.es > projectStartOffset);
    const openEnd = tasks.filter((t) => scheduledIds.has(t.itemId) && !t.complete && !t.successors.some((s) => scheduledIds.has(s)) && t.ef != null && t.ef < finish);
    if (openStart.length) warnings.push({ code: 'open_start', message: `${openStart.length} task${openStart.length === 1 ? '' : 's'} start after the project start without a predecessor (missing logic).`, itemIds: openStart.map((t) => t.itemId) });
    if (openEnd.length) warnings.push({ code: 'open_end', message: `${openEnd.length} task${openEnd.length === 1 ? '' : 's'} finish before the project end without a successor (missing logic).`, itemIds: openEnd.map((t) => t.itemId) });
    if (cpm.components > 1) warnings.push({ code: 'disconnected', message: `The linked tasks form ${cpm.components} separate networks; the critical path covers only the longest.`, itemIds: [] });
  }
  for (const t of tasks) {
    if (t.actualStart && t.actualStart > statusDate) warnings.push({ code: 'actual_conflict', message: `${label(t.itemId)} has an actual start after the status date (${statusDate}).`, itemIds: [t.itemId] });
  }

  const counts: Record<Criticality, number> = { critical: 0, near_critical: 0, non_critical: 0, invalid: 0, unscheduled: 0 };
  for (const t of tasks) if (!t.summary) counts[t.criticality]++;
  const projectFinish = cpm.valid && cpmTasks.length ? finishDate(cal, cpm.projectFinish, projectStartOffset) : null;

  const inputsVersion = (
    await sha256Hex(
      JSON.stringify([
        fresh.settings_json,
        fresh.task_prefix,
        calendar,
        statusDate,
        groups.map((g) => [g.id, g.position]),
        columns.map((c) => [c.id, c.type]),
        itemsRes.results.map((i) => [i.id, i.updated_at, i.completed_at, i.position, i.group_id]),
        schedRes.results.map((s) => [s.item_id, s.updated_at]),
        linkRes.results.map((l) => [l.id, l.updated_at]),
      ]),
    )
  ).slice(0, 16);

  return {
    board: fresh,
    settings,
    calendar,
    calendarScope: calendarInfo.scope,
    cal,
    timelineColumnId: timelineCol?.id ?? null,
    progressColumnId: progressCol?.id ?? null,
    columns,
    groups,
    tasks,
    byId,
    links,
    cpm,
    statusDate,
    statusOffset,
    projectStart,
    projectStartOffset,
    summary: {
      projectStart,
      projectFinish,
      criticalDurationDays: projectFinish ? round2((cpm.projectFinish - projectStartOffset) / mpd) : null,
      counts,
      criticalPaths: cpm.criticalPaths,
      valid: cpm.valid,
      hoursPerDay: cal.hoursPerDay,
    },
    warnings,
    inputsVersion,
  };
}

export function scheduleDTO(m: ScheduleModel, perms: { canEdit: boolean; canManage: boolean }): ScheduleDTO {
  return {
    boardId: m.board.id,
    settings: { ...m.settings, timelineColumnId: m.timelineColumnId },
    calendar: m.calendar,
    calendarScope: m.calendarScope,
    tasks: m.tasks.map(({ es: _es, ef: _ef, ls: _ls, lf: _lf, totalFloat: _tf, values: _v, schedule: _s, complete: _c, ...t }) => t),
    links: m.links,
    summary: m.summary,
    warnings: m.warnings,
    inputsVersion: m.inputsVersion,
    calculatedAt: Date.now(),
    canEdit: perms.canEdit,
    canManage: perms.canManage,
  };
}

/** Today's date for a project (its calendar's time zone). */
export function statusDateFor(calendar: CalendarDefinition, now = Date.now()): string {
  return todayIn(calendar.timezone, now) || toIsoDate(now);
}
