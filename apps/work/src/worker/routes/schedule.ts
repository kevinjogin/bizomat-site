// Project controls API: schedule (CPM), settings and calendars, task scheduling data, dependencies, applying the
// calculated dates, baselines, progress and cost records, earned value and the project controls summary. Every route
// enforces the existing project and task permissions (services/access.ts): view to read, edit to change task data,
// manage for settings, calendars and baselines, finance rights for budgets, costs and earned value.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, newId, notFound, now, parseJson } from '../lib/util';
import { requireProject, requireTask } from '../services/access';
import { auditEventStmt } from '../services/audit';
import { svcFromContext } from '../services/context';
import { updateItem } from '../services/item-ops';
import { loadColumns } from '../services/mappers';
import { wsAtLeast } from '../services/permissions';
import { buildSchedule, scheduleDTO, scheduleSettings } from '../services/schedule/project';
import { calendarProblems, normaliseCalendar } from '../services/schedule/calendar';
import { compareBaseline, createBaseline, listBaselines, loadBaseline, projectCurrency } from '../services/schedule/baselines';
import { buildEarnedValue } from '../services/schedule/earned-value';
import { prefixTaken } from '../services/schedule/task-keys';
import { decimalText, toScaled } from '../../shared/money';
import { isIsoDate } from '../../shared/dates';
import {
  CONSTRAINT_TYPES,
  DURATION_UNITS,
  EARNING_METHODS,
  LINK_TYPES,
  PREFIX_RE,
  PV_PROFILES,
  SCHEDULING_TYPES,
  lagToMinutes,
  type CalendarDefinition,
} from '../../shared/schedule';

export const scheduleRoutes = new Hono<AppEnv>();

const isoDate = z.string().refine((v) => isIsoDate(v), 'Expected a date (YYYY-MM-DD)').transform((v) => v.slice(0, 10));
const statusQuery = (c: { req: { query: (k: string) => string | undefined } }) => {
  const s = c.req.query('statusDate');
  return s && isIsoDate(s) ? s.slice(0, 10) : null;
};

// ---------------------------------------------------------------- schedule

scheduleRoutes.get('/boards/:id/schedule', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  const m = await buildSchedule(c.env, p.board, { statusDate: statusQuery(c) });
  return c.json(scheduleDTO(m, { canEdit: p.caps.level !== 'view', canManage: p.caps.level === 'manage' }));
});

scheduleRoutes.put('/boards/:id/schedule/settings', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manage');
  const input = await body(
    c,
    z.object({
      prefix: z.string().trim().toUpperCase().optional(),
      timelineColumnId: z.string().max(64).nullable().optional(),
      projectStart: isoDate.nullable().optional(),
      criticalDays: z.number().min(0).max(100).optional(),
      nearCriticalDays: z.number().min(0).max(365).optional(),
      defaultEarningMethod: z.enum(EARNING_METHODS).optional(),
      defaultPvProfile: z.enum(PV_PROFILES).optional(),
    }),
  );
  const board = p.board;
  const before = scheduleSettings(board);
  if (input.prefix !== undefined && input.prefix !== before.prefix) {
    if (!PREFIX_RE.test(input.prefix)) throw badRequest('A prefix is 2 to 10 capital letters or digits, starting with a letter (for example LASER)');
    if (await prefixTaken(c.env.DB, board.workspace_id, input.prefix, board.id)) throw new HttpError(409, `${input.prefix} is already used by another project in this organisation`);
  }
  if (input.timelineColumnId) {
    const col = await c.env.DB.prepare("SELECT 1 FROM columns WHERE id = ? AND board_id = ? AND type = 'timeline'").bind(input.timelineColumnId, board.id).first();
    if (!col) throw badRequest('Choose a timeline column of this project');
  }
  const crit = input.criticalDays ?? before.criticalDays;
  const near = input.nearCriticalDays ?? before.nearCriticalDays;
  if (near < crit) throw badRequest('The near-critical threshold must be at least the critical threshold');
  const all = parseJson<Record<string, unknown>>(board.settings_json, {});
  const sched = { ...((all.schedule as object) ?? {}) } as Record<string, unknown>;
  for (const k of ['timelineColumnId', 'projectStart', 'criticalDays', 'nearCriticalDays', 'defaultEarningMethod', 'defaultPvProfile'] as const) if (input[k] !== undefined) sched[k] = input[k];
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE boards SET settings_json = ?, task_prefix = COALESCE(?, task_prefix), updated_at = ? WHERE id = ?').bind(JSON.stringify({ ...all, schedule: sched }), input.prefix ?? null, t, board.id),
    auditEventStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: user.id, type: 'schedule.settings_changed', before, after: { ...before, ...input }, metadata: { ip: clientIp(c) } }),
  ]);
  const fresh = await c.env.DB.prepare('SELECT * FROM boards WHERE id = ?').bind(board.id).first<typeof board>();
  return c.json({ settings: scheduleSettings(fresh!) });
});

const calendarSchema = z.object({
  name: z.string().trim().min(1).max(100),
  timezone: z.string().min(1).max(64),
  workingDays: z.array(z.number().int().min(1).max(7)).min(1).max(7),
  dayStart: z.string(),
  dayEnd: z.string(),
  breaks: z.array(z.object({ start: z.string(), end: z.string() })).max(6),
  exceptions: z
    .array(z.object({ start: isoDate, end: isoDate, name: z.string().trim().max(100), working: z.boolean(), kind: z.enum(['holiday', 'shutdown', 'project', 'working']).optional() }))
    .max(500),
});

scheduleRoutes.get('/boards/:id/schedule/calendar', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  const m = await buildSchedule(c.env, p.board);
  return c.json({ calendar: m.calendar, scope: m.calendarScope, hoursPerDay: m.cal.hoursPerDay, daysPerWeek: m.cal.daysPerWeek, canManage: p.caps.level === 'manage', canSetOrganisation: wsAtLeast(p.wsRole, 'admin') });
});

/** scope 'project': this project's own calendar; 'organisation': the default for every project without its own. */
scheduleRoutes.put('/boards/:id/schedule/calendar', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manage');
  const input = await body(c, z.object({ scope: z.enum(['project', 'organisation']), calendar: calendarSchema }));
  if (input.scope === 'organisation' && !wsAtLeast(p.wsRole, 'admin')) throw new HttpError(403, 'Only organisation administrators change the organisation calendar');
  const def = normaliseCalendar(input.calendar as CalendarDefinition);
  const problems = calendarProblems(def);
  if (problems.length) throw badRequest(problems.join('. '));
  const boardId = input.scope === 'project' ? p.board.id : null;
  const t = now();
  const existing = await c.env.DB.prepare("SELECT id FROM project_calendars WHERE workspace_id = ? AND COALESCE(board_id, '') = ?").bind(p.board.workspace_id, boardId ?? '').first<{ id: string }>();
  await c.env.DB.batch([
    existing
      ? c.env.DB.prepare('UPDATE project_calendars SET definition_json = ?, updated_by = ?, updated_at = ? WHERE id = ?').bind(JSON.stringify(def), user.id, t, existing.id)
      : c.env.DB.prepare('INSERT INTO project_calendars (id, workspace_id, board_id, definition_json, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), p.board.workspace_id, boardId, JSON.stringify(def), user.id, t),
    auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, actorId: user.id, type: 'schedule.calendar_changed', after: { scope: input.scope, name: def.name, workingDays: def.workingDays, dayStart: def.dayStart, dayEnd: def.dayEnd, exceptions: def.exceptions.length } }),
  ]);
  return c.json({ ok: true, calendar: def });
});

/** Back to the organisation's (or the standard) calendar. */
scheduleRoutes.delete('/boards/:id/schedule/calendar', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manage');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM project_calendars WHERE board_id = ?').bind(p.board.id),
    auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, actorId: user.id, type: 'schedule.calendar_changed', after: { scope: 'project', removed: true } }),
  ]);
  return c.json({ ok: true });
});

// ---------------------------------------------------------------- task scheduling data

scheduleRoutes.get('/items/:id/schedule', async (c) => {
  const user = c.get('user');
  const t = await requireTask(c.env.DB, c.req.param('id'), user.id, 'view');
  const m = await buildSchedule(c.env, t.board, { statusDate: statusQuery(c) });
  const task = m.byId.get(t.item.id);
  if (!task) throw notFound('Task');
  const progress = await c.env.DB.prepare('SELECT id, as_of, percent_complete, physical_percent, units_done, milestones_json, note, created_by, created_at FROM task_progress_entries WHERE item_id = ? ORDER BY as_of DESC, created_at DESC LIMIT 100').bind(t.item.id).all();
  const costs = t.caps.viewFinance
    ? (await c.env.DB.prepare('SELECT id, spent_on, amount, currency, category, note, created_by, created_at FROM task_cost_entries WHERE item_id = ? ORDER BY spent_on DESC, created_at DESC LIMIT 200').bind(t.item.id).all()).results
    : null;
  const baseline = await loadBaseline(c.env.DB, t.board.id, null);
  const cmp = baseline ? compareBaseline(m, baseline).rows.find((r) => r.itemId === t.item.id) ?? null : null;
  const { es: _es, ef: _ef, ls: _ls, lf: _lf, totalFloat: _tf, values: _v, schedule, complete: _c, ...dto } = task;
  const earning = parseJson<Record<string, unknown>>(schedule?.earning_json, {});
  const pv = parseJson<Record<string, unknown>>(schedule?.pv_json, {});
  return c.json({
    task: dto,
    earning,
    pv,
    links: m.links.filter((l) => l.predecessorId === t.item.id || l.successorId === t.item.id),
    names: Object.fromEntries(m.tasks.map((x) => [x.itemId, { key: x.key, name: x.name, wbs: x.wbs, summary: x.summary }])),
    hoursPerDay: m.cal.hoursPerDay,
    daysPerWeek: m.cal.daysPerWeek,
    statusDate: m.statusDate,
    timelineColumnId: m.timelineColumnId,
    progress: progress.results,
    costs,
    baseline: baseline && cmp ? { number: baseline.baseline.number, name: baseline.baseline.name, row: cmp } : null,
    canEdit: t.caps.edit,
    canUpdateProgress: t.caps.updateStatus || t.caps.edit,
    canViewFinance: t.caps.viewFinance,
    canEditFinance: t.caps.editFinance,
  });
});

const percent = z.number().min(0).max(100);

scheduleRoutes.patch('/items/:id/schedule', async (c) => {
  const user = c.get('user');
  const auth = await requireTask(c.env.DB, c.req.param('id'), user.id, 'edit');
  const input = await body(
    c,
    z.object({
      duration: z.number().min(0).max(1_000_000).nullable().optional(),
      durationUnit: z.enum(DURATION_UNITS).optional(),
      /** Set the planned finish from the planned start and the duration. */
      applyDuration: z.boolean().optional(),
      plannedStart: isoDate.nullable().optional(),
      plannedFinish: isoDate.nullable().optional(),
      milestone: z.boolean().optional(),
      constraintType: z.enum(CONSTRAINT_TYPES).optional(),
      constraintDate: isoDate.nullable().optional(),
      actualStart: isoDate.nullable().optional(),
      actualFinish: isoDate.nullable().optional(),
      percentComplete: percent.nullable().optional(),
      physicalPercent: percent.nullable().optional(),
      remaining: z.number().min(0).max(1_000_000).nullable().optional(),
      schedulingType: z.enum(SCHEDULING_TYPES).optional(),
      /** Work in hours; units as a fraction (1 = one full-time person). */
      workHours: z.number().min(0).max(1_000_000).nullable().optional(),
      units: z.number().min(0.01).max(100).nullable().optional(),
      earningMethod: z.enum(EARNING_METHODS).nullable().optional(),
      earningMilestones: z.array(z.object({ name: z.string().trim().min(1).max(100), weight: z.number().min(0).max(1000), doneOn: isoDate.nullable().optional() })).max(50).optional(),
      unitsTotal: z.number().min(0).max(1e9).nullable().optional(),
      unitsDone: z.number().min(0).max(1e9).nullable().optional(),
      pvProfile: z.enum(PV_PROFILES).nullable().optional(),
      pvPoints: z.array(z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)])).max(20).optional(),
      pvMilestones: z.array(z.object({ date: isoDate, weight: z.number().min(0).max(1000) })).max(50).optional(),
    }),
  );
  const db = c.env.DB;
  const m = await buildSchedule(c.env, auth.board);
  const task = m.byId.get(auth.item.id);
  if (!task) throw notFound('Task');
  if (task.summary && (input.duration != null || input.plannedStart !== undefined || input.plannedFinish !== undefined)) throw new HttpError(409, 'A summary task takes its dates from its subtasks');
  const cal = m.cal;
  const cur = task.schedule;
  const unit = input.durationUnit ?? cur?.duration_unit ?? 'days';
  const toMin = (v: number) => lagToMinutes(v, unit, cal.hoursPerDay, cal.daysPerWeek);

  // Durations, work and units (fixed duration by default; fixed work / fixed units as chosen).
  let duration: number | null = input.duration === undefined ? cur?.duration_minutes ?? null : input.duration == null ? null : toMin(input.duration);
  const schedulingType = input.schedulingType ?? cur?.scheduling_type ?? 'fixed_duration';
  let work = input.workHours === undefined ? cur?.work_minutes ?? null : input.workHours == null ? null : Math.round(input.workHours * 60);
  let units = input.units === undefined ? cur?.units ?? null : input.units;
  if (schedulingType === 'fixed_work' && work != null && units && input.duration === undefined && (input.workHours !== undefined || input.units !== undefined)) duration = Math.round(work / units);
  else if (schedulingType === 'fixed_units' && duration != null && units) work = Math.round(duration * units);
  else if (schedulingType === 'fixed_duration' && duration && work != null && input.workHours !== undefined) units = Math.round((work / duration) * 1000) / 1000;
  const milestone = input.milestone ?? !!cur?.milestone;
  if (milestone) duration = 0;

  // Planned dates (the timeline column) and their consistency with the duration.
  const start = input.plannedStart === undefined ? task.plannedStart : input.plannedStart;
  let finish = input.plannedFinish === undefined ? task.plannedFinish : input.plannedFinish;
  if (input.applyDuration && duration != null) {
    if (!start) throw badRequest('Set a planned start first, then the finish follows from the duration');
    finish = duration === 0 ? start : cal.finishDateFor(start, duration);
  }
  if (start && finish && finish < start) throw badRequest('The planned finish cannot be before the planned start');
  if ((start == null) !== (finish == null) && (input.plannedStart !== undefined || input.plannedFinish !== undefined)) throw badRequest('Give both a planned start and a planned finish');
  if (start && finish && duration != null && !milestone) {
    const span = cal.workingMinutesBetween(start, finish);
    if (duration > span || duration <= span - cal.minutesPerDay) {
      if (input.plannedStart !== undefined || input.plannedFinish !== undefined) duration = span;
      else throw badRequest(`A duration of ${Math.round((duration / cal.minutesPerDay) * 100) / 100} working days does not fit ${start} to ${finish} (${Math.round((span / cal.minutesPerDay) * 100) / 100} working days). Change the dates, or use "Set finish from duration".`);
    }
  }

  const actualStart = input.actualStart === undefined ? cur?.actual_start ?? null : input.actualStart;
  const actualFinish = input.actualFinish === undefined ? cur?.actual_finish ?? null : input.actualFinish;
  if (actualStart && actualFinish && actualFinish < actualStart) throw badRequest('The actual finish cannot be before the actual start');
  if (actualFinish && !actualStart) throw badRequest('Give the actual start too');
  if (actualStart && actualStart > m.statusDate) throw badRequest('The actual start cannot be in the future');
  if (actualFinish && actualFinish > m.statusDate) throw badRequest('The actual finish cannot be in the future');
  const constraintType = input.constraintType ?? cur?.constraint_type ?? 'ASAP';
  const constraintDate = constraintType === 'ASAP' ? null : input.constraintDate === undefined ? cur?.constraint_date ?? null : input.constraintDate;
  if (constraintType !== 'ASAP' && !constraintDate) throw badRequest('This constraint needs a date');

  let pct = input.percentComplete === undefined ? undefined : input.percentComplete;
  if (actualFinish && !cur?.actual_finish && pct === undefined) pct = 100;
  const earning = { ...parseJson<Record<string, unknown>>(cur?.earning_json, {}) };
  if (input.earningMilestones) earning.milestones = input.earningMilestones;
  if (input.unitsTotal !== undefined) earning.unitsTotal = input.unitsTotal;
  if (input.unitsDone !== undefined) earning.unitsDone = input.unitsDone;
  const pv = { ...parseJson<Record<string, unknown>>(cur?.pv_json, {}) };
  if (input.pvPoints) pv.points = input.pvPoints;
  if (input.pvMilestones) pv.milestones = input.pvMilestones;

  const t = now();
  const row = {
    duration_minutes: duration,
    duration_unit: unit,
    remaining_minutes: input.remaining === undefined ? cur?.remaining_minutes ?? null : input.remaining == null ? null : toMin(input.remaining),
    milestone: milestone ? 1 : 0,
    constraint_type: constraintType,
    constraint_date: constraintDate,
    actual_start: actualStart,
    actual_finish: actualFinish,
    // With a progress column on the board, percent complete lives there (one place); otherwise here.
    percent_complete: m.progressColumnId ? cur?.percent_complete ?? null : pct === undefined ? cur?.percent_complete ?? null : pct,
    physical_percent: input.physicalPercent === undefined ? cur?.physical_percent ?? null : input.physicalPercent,
    scheduling_type: schedulingType,
    work_minutes: work,
    units,
    earning_method: input.earningMethod === undefined ? cur?.earning_method ?? null : input.earningMethod,
    earning_json: JSON.stringify(earning),
    pv_profile: input.pvProfile === undefined ? cur?.pv_profile ?? null : input.pvProfile,
    pv_json: JSON.stringify(pv),
  };
  const stmts = [
    db
      .prepare(
        `INSERT INTO task_schedules (item_id, board_id, duration_minutes, duration_unit, remaining_minutes, milestone, constraint_type, constraint_date, actual_start, actual_finish, percent_complete, physical_percent, scheduling_type, work_minutes, units, earning_method, earning_json, pv_profile, pv_json, updated_by, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21)
         ON CONFLICT(item_id) DO UPDATE SET duration_minutes = ?3, duration_unit = ?4, remaining_minutes = ?5, milestone = ?6, constraint_type = ?7, constraint_date = ?8, actual_start = ?9, actual_finish = ?10,
           percent_complete = ?11, physical_percent = ?12, scheduling_type = ?13, work_minutes = ?14, units = ?15, earning_method = ?16, earning_json = ?17, pv_profile = ?18, pv_json = ?19, updated_by = ?20, updated_at = ?21`,
      )
      .bind(auth.item.id, auth.board.id, row.duration_minutes, row.duration_unit, row.remaining_minutes, row.milestone, row.constraint_type, row.constraint_date, row.actual_start, row.actual_finish, row.percent_complete, row.physical_percent, row.scheduling_type, row.work_minutes, row.units, row.earning_method, row.earning_json, row.pv_profile, row.pv_json, user.id, t),
    auditEventStmt(db, { workspaceId: auth.board.workspace_id, boardId: auth.board.id, itemId: auth.item.id, actorId: user.id, type: 'task.schedule_changed', before: cur ?? null, after: row, metadata: { fields: Object.keys(input) } }),
  ];
  if (pct !== undefined || input.physicalPercent !== undefined || input.unitsDone !== undefined) {
    stmts.push(
      db
        .prepare('INSERT INTO task_progress_entries (id, item_id, board_id, as_of, percent_complete, physical_percent, units_done, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), auth.item.id, auth.board.id, m.statusDate, pct ?? task.percentComplete ?? null, row.physical_percent, (earning.unitsDone as number | undefined) ?? null, '', user.id, t),
    );
  }
  await db.batch(stmts);
  // Planned dates and percent complete go through the normal item update (activity, realtime, automations).
  const values: Record<string, unknown> = {};
  if (start !== task.plannedStart || finish !== task.plannedFinish) {
    if (!m.timelineColumnId) throw new HttpError(409, 'Add a timeline column to this project to hold planned dates');
    values[m.timelineColumnId] = start && finish ? { start, end: finish } : null;
  }
  if (pct !== undefined && m.progressColumnId) values[m.progressColumnId] = pct;
  if (Object.keys(values).length) {
    const svc = svcFromContext(c);
    const item = await db.prepare('SELECT * FROM items WHERE id = ?').bind(auth.item.id).first<typeof auth.item>();
    await updateItem(svc, auth.board, item!, { values }, await loadColumns(db, auth.board.id));
  }
  return c.json({ ok: true });
});

// ---------------------------------------------------------------- progress and cost records

scheduleRoutes.post('/items/:id/progress', async (c) => {
  const user = c.get('user');
  const auth = await requireTask(c.env.DB, c.req.param('id'), user.id, 'updateStatus');
  const input = await body(c, z.object({ asOf: isoDate, percentComplete: percent.nullable().optional(), physicalPercent: percent.nullable().optional(), unitsDone: z.number().min(0).max(1e9).nullable().optional(), milestonesDone: z.array(z.string().max(100)).max(50).optional(), note: z.string().trim().max(500).optional() }));
  const m = await buildSchedule(c.env, auth.board);
  if (input.asOf > m.statusDate) throw badRequest('Progress cannot be recorded for a future date');
  const t = now();
  await c.env.DB.batch([
    c.env.DB
      .prepare('INSERT INTO task_progress_entries (id, item_id, board_id, as_of, percent_complete, physical_percent, units_done, milestones_json, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), auth.item.id, auth.board.id, input.asOf, input.percentComplete ?? null, input.physicalPercent ?? null, input.unitsDone ?? null, input.milestonesDone ? JSON.stringify(input.milestonesDone) : null, input.note ?? '', user.id, t),
    auditEventStmt(c.env.DB, { workspaceId: auth.board.workspace_id, boardId: auth.board.id, itemId: auth.item.id, actorId: user.id, type: 'task.progress_recorded', after: input }),
  ]);
  // The latest record is also the task's current progress (the progress column when the board has one).
  const later = await c.env.DB.prepare('SELECT 1 FROM task_progress_entries WHERE item_id = ? AND as_of > ? LIMIT 1').bind(auth.item.id, input.asOf).first();
  if (!later && (input.percentComplete != null || input.physicalPercent != null)) {
    await c.env.DB
      .prepare(
        `INSERT INTO task_schedules (item_id, board_id, percent_complete, physical_percent, updated_by, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         ON CONFLICT(item_id) DO UPDATE SET percent_complete = COALESCE(?3, percent_complete), physical_percent = COALESCE(?4, physical_percent), updated_by = ?5, updated_at = ?6`,
      )
      .bind(auth.item.id, auth.board.id, m.progressColumnId ? null : input.percentComplete ?? null, input.physicalPercent ?? null, user.id, t)
      .run();
    if (m.progressColumnId && input.percentComplete != null) {
      const item = await c.env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(auth.item.id).first<typeof auth.item>();
      await updateItem(svcFromContext(c), auth.board, item!, { values: { [m.progressColumnId]: input.percentComplete } }, await loadColumns(c.env.DB, auth.board.id));
    }
  }
  return c.json({ ok: true }, 201);
});

scheduleRoutes.post('/items/:id/costs', async (c) => {
  const user = c.get('user');
  const auth = await requireTask(c.env.DB, c.req.param('id'), user.id, 'editFinance');
  const input = await body(c, z.object({ spentOn: isoDate, amount: z.union([z.string().max(40), z.number()]), category: z.string().trim().max(60).optional(), note: z.string().trim().max(500).optional() }));
  const text = decimalText(input.amount);
  const scaled = text == null ? null : toScaled(text);
  if (scaled == null || scaled === 0n) throw badRequest('Enter an amount (use a negative amount to correct an earlier entry)');
  const m = await buildSchedule(c.env, auth.board);
  if (input.spentOn > m.statusDate) throw badRequest('A cost cannot be recorded for a future date');
  const currency = await projectCurrency(c.env.DB, m);
  if (!currency) throw new HttpError(409, 'Choose the project (or organisation) currency first');
  const id = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO task_cost_entries (id, item_id, board_id, spent_on, amount, currency, category, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, auth.item.id, auth.board.id, input.spentOn, text, currency, input.category ?? '', input.note ?? '', user.id, now()),
    auditEventStmt(c.env.DB, { workspaceId: auth.board.workspace_id, boardId: auth.board.id, itemId: auth.item.id, actorId: user.id, type: 'finance.cost_recorded', after: { spentOn: input.spentOn, amount: text, currency, category: input.category ?? '' } }),
  ]);
  return c.json({ ok: true, id, currency }, 201);
});

// ---------------------------------------------------------------- dependencies

const linkInput = z.object({ type: z.enum(LINK_TYPES).default('FS'), lag: z.number().min(-10_000).max(10_000).default(0), lagUnit: z.enum(DURATION_UNITS).default('days') });

/** Would adding pred -> succ close a loop? (Is pred reachable from succ along existing links?) */
function wouldLoop(links: { predecessorId: string; successorId: string }[], pred: string, succ: string): string[] | null {
  const out = new Map<string, string[]>();
  for (const l of links) out.set(l.predecessorId, [...(out.get(l.predecessorId) ?? []), l.successorId]);
  const prev = new Map<string, string>();
  const stack = [succ];
  const seen = new Set([succ]);
  while (stack.length) {
    const n = stack.pop()!;
    if (n === pred) {
      const path = [pred];
      let k = pred;
      while (k !== succ) {
        k = prev.get(k)!;
        path.unshift(k);
      }
      return [pred, ...path];
    }
    for (const x of out.get(n) ?? []) if (!seen.has(x)) {
      seen.add(x);
      prev.set(x, n);
      stack.push(x);
    }
  }
  return null;
}

scheduleRoutes.post('/boards/:id/links', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'edit');
  const input = await body(c, linkInput.extend({ predecessorId: z.string().max(64), successorId: z.string().max(64) }));
  if (input.predecessorId === input.successorId) throw badRequest('A task cannot depend on itself');
  const m = await buildSchedule(c.env, p.board);
  const a = m.byId.get(input.predecessorId);
  const b = m.byId.get(input.successorId);
  if (!a || !b) throw badRequest('Both tasks must be active tasks of this project');
  if (a.summary || b.summary) throw badRequest('Link the subtasks of a summary task, not the summary task itself');
  if (m.links.some((l) => l.predecessorId === a.itemId && l.successorId === b.itemId)) throw new HttpError(409, `${a.key ?? a.name} is already a predecessor of ${b.key ?? b.name}`);
  const loop = wouldLoop(m.links, a.itemId, b.itemId);
  if (loop) throw badRequest(`This link would create a loop: ${loop.map((id) => m.byId.get(id)?.key ?? id).join(' → ')}`);
  const id = newId();
  const t = now();
  const lag = lagToMinutes(input.lag, input.lagUnit, m.cal.hoursPerDay, m.cal.daysPerWeek);
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO task_links (id, board_id, predecessor_id, successor_id, type, lag_minutes, lag_unit, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, p.board.id, a.itemId, b.itemId, input.type, lag, input.lagUnit, user.id, t, t),
    auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, itemId: b.itemId, actorId: user.id, type: 'task.dependency_added', after: { predecessor: a.key, successor: b.key, type: input.type, lagMinutes: lag } }),
  ]);
  return c.json({ id }, 201);
});

async function loadLink(c: { env: AppEnv['Bindings'] }, id: string) {
  const l = await c.env.DB.prepare('SELECT * FROM task_links WHERE id = ?').bind(id).first<{ id: string; board_id: string; predecessor_id: string; successor_id: string; type: string; lag_minutes: number; lag_unit: string }>();
  if (!l) throw notFound('Dependency');
  return l;
}

scheduleRoutes.patch('/links/:id', async (c) => {
  const user = c.get('user');
  const l = await loadLink(c, c.req.param('id'));
  const p = await requireProject(c.env.DB, l.board_id, user.id, 'edit');
  const input = await body(c, linkInput.partial());
  const m = await buildSchedule(c.env, p.board);
  const unit = input.lagUnit ?? (l.lag_unit as (typeof DURATION_UNITS)[number]);
  const lag = input.lag === undefined ? l.lag_minutes : lagToMinutes(input.lag, unit, m.cal.hoursPerDay, m.cal.daysPerWeek);
  const type = input.type ?? l.type;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE task_links SET type = ?, lag_minutes = ?, lag_unit = ?, updated_at = ? WHERE id = ?').bind(type, lag, unit, now(), l.id),
    auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, itemId: l.successor_id, actorId: user.id, type: 'task.dependency_changed', before: { type: l.type, lagMinutes: l.lag_minutes }, after: { type, lagMinutes: lag } }),
  ]);
  return c.json({ ok: true });
});

scheduleRoutes.delete('/links/:id', async (c) => {
  const user = c.get('user');
  const l = await loadLink(c, c.req.param('id'));
  const p = await requireProject(c.env.DB, l.board_id, user.id, 'edit');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM task_links WHERE id = ?').bind(l.id),
    auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, itemId: l.successor_id, actorId: user.id, type: 'task.dependency_removed', before: { predecessorId: l.predecessor_id, successorId: l.successor_id, type: l.type, lagMinutes: l.lag_minutes } }),
  ]);
  return c.json({ ok: true });
});

/** Writes the calculated early dates into the planned dates (timeline column) of tasks not yet finished. */
scheduleRoutes.post('/boards/:id/schedule/apply', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'edit');
  const input = await body(c, z.object({ itemIds: z.array(z.string().max(64)).max(5000).optional(), statusDate: isoDate.optional() }));
  // The same status date as the schedule on screen (today unless given): unstarted late work moves to it.
  const m = await buildSchedule(c.env, p.board, { statusDate: input.statusDate ?? null });
  if (!m.summary.valid) throw new HttpError(409, 'The schedule has a dependency loop; fix it first');
  if (!m.timelineColumnId) throw new HttpError(409, 'Add a timeline column to this project to hold planned dates');
  const only = input.itemIds ? new Set(input.itemIds) : null;
  const changes = m.tasks.filter((t) => !t.summary && !t.complete && t.earlyStart && t.earlyFinish && (!only || only.has(t.itemId)) && (t.plannedStart !== t.earlyStart || t.plannedFinish !== t.earlyFinish));
  const svc = svcFromContext(c);
  const cols = await loadColumns(c.env.DB, p.board.id);
  for (const t of changes) {
    const item = await c.env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(t.itemId).first<Parameters<typeof updateItem>[2]>();
    if (item) await updateItem(svc, p.board, item, { values: { [m.timelineColumnId]: { start: t.earlyStart, end: t.earlyFinish } } }, cols);
  }
  await auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, actorId: user.id, type: 'schedule.applied', after: { tasks: changes.length } }).run();
  return c.json({ updated: changes.length });
});

// ---------------------------------------------------------------- baselines

scheduleRoutes.get('/boards/:id/baselines', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  const rows = await listBaselines(c.env.DB, p.board.id);
  return c.json({
    baselines: rows.map((b) => ({ id: b.id, number: b.number, name: b.name, notes: b.notes, reason: b.reason, approvedBy: b.approved_by, approvedOn: b.approved_on, previousBaselineId: b.previous_baseline_id, projectStart: b.project_start, projectFinish: b.project_finish, currency: p.caps.viewFinance ? b.currency : null, bac: p.caps.viewFinance ? b.bac : null, createdAt: b.created_at })),
    canCreate: p.caps.level === 'manage',
  });
});

scheduleRoutes.post('/boards/:id/baselines', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manage');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(120), notes: z.string().trim().max(2000).default(''), reason: z.string().trim().max(1000).default(''), approvedBy: z.string().trim().min(1).max(120), approvedOn: isoDate }));
  // The plan as it stands, without moving unstarted work to today: a baseline records the approved plan, not a forecast.
  const m = await buildSchedule(c.env, p.board, { plan: true });
  if (!m.summary.valid) throw new HttpError(409, 'The schedule has a dependency loop; fix it before approving a baseline');
  const prev = await c.env.DB.prepare('SELECT 1 FROM project_baselines WHERE board_id = ? LIMIT 1').bind(p.board.id).first();
  if (prev && !input.reason) throw badRequest('Give the reason for the revised baseline');
  const r = await createBaseline(c.env.DB, m, input, user.id);
  await auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, actorId: user.id, type: 'baseline.approved', after: { id: r.id, number: r.number, name: input.name, approvedBy: input.approvedBy, approvedOn: input.approvedOn, reason: input.reason } }).run();
  return c.json(r, 201);
});

scheduleRoutes.get('/boards/:id/baselines/compare', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  const m = await buildSchedule(c.env, p.board, { statusDate: statusQuery(c) });
  const b = await loadBaseline(c.env.DB, p.board.id, c.req.query('baseline') ?? null);
  if (!b) return c.json({ available: false, reason: 'No approved baseline yet' });
  const original = b.baseline.number === 0 ? null : await loadBaseline(c.env.DB, p.board.id, (await c.env.DB.prepare('SELECT id FROM project_baselines WHERE board_id = ? AND number = 0').bind(p.board.id).first<{ id: string }>())?.id ?? null);
  const cmp = compareBaseline(m, b);
  const hideCost = !p.caps.viewFinance;
  return c.json({
    available: true,
    statusDate: m.statusDate,
    baseline: { id: b.baseline.id, number: b.baseline.number, name: b.baseline.name, approvedBy: b.baseline.approved_by, approvedOn: b.baseline.approved_on, projectStart: b.baseline.project_start, projectFinish: b.baseline.project_finish, currency: hideCost ? null : b.baseline.currency },
    original: original ? { number: 0, name: original.baseline.name, projectFinish: original.baseline.project_finish, finishVarianceDays: compareBaseline(m, original).projectFinishVarianceDays } : null,
    forecastFinish: m.summary.projectFinish,
    projectFinishVarianceDays: cmp.projectFinishVarianceDays,
    rows: hideCost ? cmp.rows.map((r) => ({ ...r, baselineCost: null, currentCost: null, costVariance: null })) : cmp.rows,
  });
});

// ---------------------------------------------------------------- earned value and the project controls summary

scheduleRoutes.get('/boards/:id/evm', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'viewFinance');
  const m = await buildSchedule(c.env, p.board, { statusDate: statusQuery(c) });
  return c.json(await buildEarnedValue(c.env.DB, m, { baselineId: c.req.query('baseline') ?? null, statusDate: statusQuery(c), groupId: c.req.query('group') ?? null }));
});

scheduleRoutes.get('/boards/:id/controls', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  const m = await buildSchedule(c.env, p.board, { statusDate: statusQuery(c) });
  return c.json(await controlsSummary(c.env.DB, m, p.caps.viewFinance));
});

export async function controlsSummary(db: D1Database, m: Awaited<ReturnType<typeof buildSchedule>>, viewFinance: boolean) {
  const b = await loadBaseline(db, m.board.id, null);
  const cmp = b ? compareBaseline(m, b) : null;
  const ev = viewFinance && b ? await buildEarnedValue(db, m, {}) : null;
  const leaf = m.tasks.filter((t) => !t.summary);
  const open = leaf.filter((t) => !t.complete);
  const label = (t: { key: string | null; name: string }) => ({ key: t.key, name: t.name });
  const cmpBy = new Map((cmp?.rows ?? []).map((r) => [r.itemId, r]));
  const critical = open.filter((t) => t.criticality === 'critical');
  const delayedCritical = critical.filter((t) => (cmpBy.get(t.itemId)?.finishVarianceDays ?? 0) > 0 || (t.totalFloatDays ?? 0) < 0);
  const overdue = open.filter((t) => t.plannedFinish && t.plannedFinish < m.statusDate);
  const soon = m.cal.finishDateFor(m.statusDate, 20 * m.cal.minutesPerDay);
  const milestones = leaf.filter((t) => t.milestone && !t.complete && t.earlyFinish && t.earlyFinish >= m.statusDate && t.earlyFinish <= soon);
  const owners = new Map<string, number>();
  for (const t of critical) for (const o of new Set(t.owners)) owners.set(o, (owners.get(o) ?? 0) + 1);
  const intervention = open
    .filter((t) => t.conflicts.length || (t.totalFloatDays ?? 0) < 0 || (t.criticality === 'critical' && t.plannedFinish && t.plannedFinish < m.statusDate))
    .map((t) => ({ itemId: t.itemId, ...label(t), reason: t.conflicts[0] ?? ((t.totalFloatDays ?? 0) < 0 ? `Negative float: ${t.totalFloatDays} working days` : 'Critical and past its planned finish') }));
  const remainingDays = m.summary.projectFinish ? Math.max(0, Math.round(((m.cpm.projectFinish - m.statusOffset) / m.cal.minutesPerDay) * 100) / 100) : null;
  const metrics = ev && ev.available ? ev.metrics : null;
  return {
    statusDate: m.statusDate,
    valid: m.summary.valid,
    schedule: m.summary,
    warnings: m.warnings,
    baseline: b ? { id: b.baseline.id, number: b.baseline.number, name: b.baseline.name, projectFinish: b.baseline.project_finish } : null,
    forecastFinish: m.summary.projectFinish,
    finishVarianceDays: cmp?.projectFinishVarianceDays ?? null,
    remainingWorkingDays: remainingDays,
    openTasks: open.length,
    completedTasks: leaf.length - open.length,
    criticalTasks: critical.map((t) => ({ itemId: t.itemId, ...label(t), totalFloatDays: t.totalFloatDays, earlyFinish: t.earlyFinish, owners: t.owners })).slice(0, 50),
    nearCriticalCount: open.filter((t) => t.criticality === 'near_critical').length,
    delayedCritical: delayedCritical.map((t) => ({ itemId: t.itemId, ...label(t), finishVarianceDays: cmpBy.get(t.itemId)?.finishVarianceDays ?? null, totalFloatDays: t.totalFloatDays })),
    overdue: overdue.map((t) => ({ itemId: t.itemId, ...label(t), plannedFinish: t.plannedFinish, criticality: t.criticality })).slice(0, 50),
    upcomingMilestones: milestones.map((t) => ({ itemId: t.itemId, ...label(t), date: t.earlyFinish, criticality: t.criticality })),
    criticalByOwner: Array.from(owners, ([userId, count]) => ({ userId, count })).sort((a, z) => z.count - a.count),
    intervention: intervention.slice(0, 50),
    evm: metrics ? { currency: ev!.available ? ev!.currency : null, ...metrics } : null,
    evmReason: !viewFinance ? 'Your access does not include project finances' : !b ? 'No approved baseline yet' : ev && !ev.available ? ev.reason : null,
  };
}
