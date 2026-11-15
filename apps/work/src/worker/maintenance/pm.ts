// Preventive maintenance (stage M2): schedules per asset, templates per asset class, the generation of work orders and
// the forecast (/api/maintenance/c/:company/pm/...).
//
// A schedule is time based (every N days, weeks or months, counted from the last completion or on fixed dates), meter
// based (every N units of a meter's life total) or condition based (a reading below or above a limit). It carries the
// work order it makes: job type (preventive or inspection), priority, tasks, required parts, estimate, trade or
// technician, instructions, safety, an inspection template, and lead days (time based: made that many days before it is
// due; meter and condition based: due that many days after it is made). Paused schedules make nothing.
//
// Generation is idempotent: each due occurrence has a key (t:<due date>, m:<due meter total>, c:<reading id>) unique per
// schedule, and a schedule holds at most one outstanding occurrence (a unique partial index), both written in the same
// transaction as the work order. Two runs at the same moment (the cron and the button, or two crons) make one work
// order; the other transaction fails whole and is counted as skipped. It runs from the app's 15-minute cron
// (runMaintenance in src/worker/index.ts), from "Generate due work orders now", and straight after each reading.
//
// When the work order is completed, the next due date or meter value moves on (completion basis: from the completion;
// fixed basis: it moved on when the work order was made). Cancelling it skips that occurrence. Reopening it takes its
// place back (if no newer occurrence is outstanding) without moving the schedule back.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { assertPerson, isManager, requireMt, type MtAccess } from './access';
import { loadAsset } from './routes-assets';
import { PRIORITY, eventStmt, likeOf, nextNumber, searchText, validDate, zDate, zId, zText } from './util';
import { addDays, addInterval, assertSite, daysBetween, eventIfStmt, inCompany, inSiteSql, isUnique, todayNear, utcDate, type IntervalUnit } from './m2util';

export const pmRoutes = new Hono<AppEnv>();

export const TRIGGERS = ['time', 'meter', 'condition'] as const;
export const UNITS = ['day', 'week', 'month'] as const;
export const BASES = ['completion', 'fixed'] as const;
export const PM_JOB_TYPES = ['preventive', 'inspection'] as const;
type Trigger = (typeof TRIGGERS)[number];

const part = z.object({ part: zText(200).min(1), quantity: z.number().positive().max(1e6) });
const defFields = {
  name: zText(200).min(1),
  description: zText(5000).optional(),
  intervalN: z.number().int().min(1).max(3650).nullable().optional(),
  intervalUnit: z.enum(UNITS).nullable().optional(),
  basis: z.enum(BASES).optional(),
  meterInterval: z.number().positive().max(1e12).nullable().optional(),
  condBelow: z.number().finite().nullable().optional(),
  condAbove: z.number().finite().nullable().optional(),
  startDate: zDate.optional(),
  jobType: z.enum(PM_JOB_TYPES).optional(),
  priority: z.enum(PRIORITY).optional(),
  tasks: z.array(zText(500).min(1)).max(100).optional(),
  parts: z.array(part).max(100).optional(),
  estimatedHours: z.number().min(0).max(100000).nullable().optional(),
  leadDays: z.number().int().min(0).max(365).optional(),
  trade: zText(80).optional(),
  assignedTo: zId.nullable().optional(),
  inspectionTemplateId: zId.nullable().optional(),
  instructions: zText(20000).optional(),
  safety: zText(10000).optional(),
  active: z.boolean().optional(),
};
const scheduleCreate = z.object({ ...defFields, triggerKind: z.enum(TRIGGERS), assetId: zId, meterId: zId.nullable().optional(), firstDueMeter: z.number().min(0).max(1e12).nullable().optional() });
const scheduleUpdate = z.object({ ...defFields, name: zText(200).min(1).optional(), nextDueDate: zDate.optional(), nextDueMeter: z.number().min(0).max(1e12).nullable().optional() });
const templateCreate = z.object({ ...defFields, triggerKind: z.enum(TRIGGERS), assetCategory: zText(80).min(1), siteId: zId.nullable().optional(), meterName: zText(120).optional() });
const templateUpdate = z.object({ ...defFields, name: zText(200).min(1).optional() });

/** The definition columns given in the input (shared by schedules and templates). */
function defColumns(i: Partial<z.infer<typeof scheduleCreate>>): Record<string, unknown> {
  const map: Record<string, [string, unknown]> = {
    name: ['name', i.name],
    description: ['description', i.description],
    intervalN: ['interval_n', i.intervalN],
    intervalUnit: ['interval_unit', i.intervalUnit],
    basis: ['basis', i.basis],
    meterInterval: ['meter_interval', i.meterInterval],
    condBelow: ['cond_below', i.condBelow],
    condAbove: ['cond_above', i.condAbove],
    startDate: ['start_date', i.startDate],
    jobType: ['job_type', i.jobType],
    priority: ['priority', i.priority],
    tasks: ['tasks_json', i.tasks === undefined ? undefined : JSON.stringify(i.tasks)],
    parts: ['parts_json', i.parts === undefined ? undefined : JSON.stringify(i.parts)],
    estimatedHours: ['estimated_minutes', i.estimatedHours === undefined ? undefined : i.estimatedHours === null ? null : Math.round(i.estimatedHours * 60)],
    leadDays: ['lead_days', i.leadDays],
    trade: ['trade', i.trade],
    assignedTo: ['assigned_to', i.assignedTo],
    inspectionTemplateId: ['inspection_template_id', i.inspectionTemplateId],
    instructions: ['instructions', i.instructions],
    safety: ['safety', i.safety],
    active: ['active', i.active === undefined ? undefined : i.active ? 1 : 0],
  };
  const out: Record<string, unknown> = {};
  for (const [, [col, v]] of Object.entries(map)) if (v !== undefined) out[col] = v;
  return out;
}

/** Checks a whole definition (the stored row merged with the change). */
async function checkDefinition(db: D1Database, a: MtAccess, d: Record<string, any>, meter: any | null) {
  const kind = d.trigger_kind as Trigger;
  if (kind === 'time') {
    if (!d.interval_n || !d.interval_unit) throw new HttpError(400, 'A time-based schedule needs an interval: every how many days, weeks or months');
  } else if (kind === 'meter') {
    if (!d.meter_interval) throw new HttpError(400, 'A meter-based schedule needs the interval in meter units');
    if (meter && !meter.rising) throw new HttpError(400, 'A meter-based schedule needs a rising meter (hours, kilometres, cycles), not a gauge');
  } else if (kind === 'condition') {
    if (d.cond_below === null && d.cond_above === null && (!meter || (meter.expected_min === null && meter.expected_max === null))) {
      throw new HttpError(400, 'A condition-based schedule needs a lower or upper limit, or a meter with an expected range');
    }
    if (d.cond_below !== null && d.cond_above !== null && d.cond_below > d.cond_above) throw new HttpError(400, 'The lower limit cannot be above the upper limit');
  }
  if (d.assigned_to) await assertPerson(db, a, d.assigned_to, 'technician', 'The technician');
  if (d.inspection_template_id) {
    const t = await db.prepare('SELECT archived_at FROM mt_insp_templates WHERE company_id = ? AND id = ?').bind(a.companyId, d.inspection_template_id).first<{ archived_at: number | null }>();
    if (!t) throw new HttpError(400, 'Choose an inspection template of this company');
    if (t.archived_at) throw new HttpError(400, 'That inspection template is archived');
  }
}

const DEFAULTS: Record<string, unknown> = { description: '', interval_n: null, interval_unit: null, basis: 'completion', meter_interval: null, cond_below: null, cond_above: null, start_date: null, job_type: 'preventive', priority: 'medium', tasks_json: '[]', parts_json: '[]', estimated_minutes: null, lead_days: 0, trade: '', assigned_to: null, inspection_template_id: null, instructions: '', safety: '', active: 1 };
const DEF_COLS = Object.keys(DEFAULTS).concat('name');

/** The starting due state of a schedule. */
function initialState(d: Record<string, any>, meter: any | null, today: string, firstDueMeter?: number | null) {
  if (d.trigger_kind === 'time') {
    const start = d.start_date ?? today;
    return { start_date: start, anchor_day: Number(start.slice(8, 10)), next_due_date: start, next_due_meter: null };
  }
  if (d.trigger_kind === 'meter') return { start_date: null, anchor_day: null, next_due_date: null, next_due_meter: firstDueMeter ?? Number(meter?.last_total ?? 0) + Number(d.meter_interval) };
  return { start_date: null, anchor_day: null, next_due_date: null, next_due_meter: null };
}

async function meterOf(db: D1Database, companyId: string, meterId: string | null | undefined, assetId: string) {
  if (!meterId) return null;
  const m = await db.prepare('SELECT * FROM mt_meters WHERE company_id = ? AND id = ?').bind(companyId, meterId).first<any>();
  if (!m) throw new HttpError(400, 'Choose a meter of this company');
  if (m.asset_id !== assetId) throw new HttpError(400, 'Choose a meter of the same asset');
  if (m.archived_at) throw new HttpError(400, 'That meter is archived');
  return m;
}

// ------------------------------------------------------------------ shapes

const SCHEDULE_SELECT = `SELECT s.*, a.number AS asset_number, a.name AS asset_name, a.status AS asset_status, pt.name AS template_name, m.name AS meter_name, m.unit AS meter_unit,
    m.last_total AS meter_total, m.last_value AS meter_value, it.name AS insp_name, u.name AS assignee_name,
    (SELECT w.id || '|' || w.number || '|' || w.status || '|' || COALESCE(w.due_finish, '') FROM mt_pm_occurrences o JOIN mt_work_orders w ON w.company_id = o.company_id AND w.id = o.work_order_id
      WHERE o.company_id = s.company_id AND o.schedule_id = s.id AND o.open_slot = 1) AS open_wo,
    (SELECT xs.site_id FROM mt_asset_sites xs WHERE xs.company_id = s.company_id AND xs.asset_id = s.asset_id) AS site_id
  FROM mt_pm_schedules s
  JOIN mt_assets a ON a.company_id = s.company_id AND a.id = s.asset_id
  LEFT JOIN mt_pm_templates pt ON pt.company_id = s.company_id AND pt.id = s.template_id
  LEFT JOIN mt_meters m ON m.company_id = s.company_id AND m.id = s.meter_id
  LEFT JOIN mt_insp_templates it ON it.company_id = s.company_id AND it.id = s.inspection_template_id
  LEFT JOIN users u ON u.id = s.assigned_to`;

function defDTO(s: any) {
  return {
    name: s.name,
    description: s.description,
    triggerKind: s.trigger_kind,
    intervalN: s.interval_n,
    intervalUnit: s.interval_unit,
    basis: s.basis,
    meterInterval: s.meter_interval,
    condBelow: s.cond_below,
    condAbove: s.cond_above,
    startDate: s.start_date,
    jobType: s.job_type,
    priority: s.priority,
    tasks: parseJson<string[]>(s.tasks_json, []),
    parts: parseJson<{ part: string; quantity: number }[]>(s.parts_json, []),
    estimatedMinutes: s.estimated_minutes,
    leadDays: s.lead_days,
    trade: s.trade,
    assignedTo: s.assigned_to,
    assignedToName: s.assignee_name ?? null,
    inspectionTemplateId: s.inspection_template_id,
    inspectionTemplateName: s.insp_name ?? null,
    instructions: s.instructions,
    safety: s.safety,
    active: !!s.active,
  };
}

export function scheduleDTO(s: any) {
  const [woId, woNumber, woStatus, woDue] = s.open_wo ? String(s.open_wo).split('|') : [];
  return {
    id: s.id,
    assetId: s.asset_id,
    assetNumber: s.asset_number ?? null,
    assetName: s.asset_name ?? null,
    siteId: s.site_id ?? null,
    templateId: s.template_id,
    templateName: s.template_name ?? null,
    ...defDTO(s),
    meterId: s.meter_id,
    meterName: s.meter_name ?? null,
    meterUnit: s.meter_unit ?? null,
    meterTotal: s.meter_total ?? null,
    nextDueDate: s.next_due_date,
    nextDueMeter: s.next_due_meter,
    lastDoneDate: s.last_done_date,
    lastDoneMeter: s.last_done_meter,
    openWorkOrder: woId ? { id: woId, number: woNumber, status: woStatus, dueFinish: woDue || null } : null,
    createdAt: s.created_at,
  };
}

export async function loadSchedule(db: D1Database, companyId: string, id: string) {
  const s = await db.prepare(`${SCHEDULE_SELECT} WHERE s.company_id = ? AND s.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!s) throw notFound('Schedule');
  return s;
}

// ------------------------------------------------------------------ templates for an asset class

/** Gives every asset of the template's class (and site) that has none its own schedule. Idempotent. */
export async function applyTemplate(db: D1Database, companyId: string, tpl: any, actorId: string | null, today: string) {
  const assets = await db
    .prepare(
      `SELECT a.id, a.number FROM mt_assets a WHERE a.company_id = ? AND a.archived_at IS NULL AND a.status <> 'disposed' AND a.category = ? COLLATE NOCASE
         ${tpl.site_id ? `AND ${inSiteSql('a')}` : ''}
         AND NOT EXISTS (SELECT 1 FROM mt_pm_schedules s WHERE s.company_id = a.company_id AND s.template_id = ? AND s.asset_id = a.id)
       ORDER BY a.number COLLATE NOCASE LIMIT 500`,
    )
    .bind(companyId, tpl.asset_category, ...(tpl.site_id ? [tpl.site_id] : []), tpl.id)
    .all<{ id: string; number: string }>();
  const made: string[] = [];
  const skipped: { assetNumber: string; reason: string }[] = [];
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const asset of assets.results) {
    let meter: any = null;
    if (tpl.trigger_kind !== 'time') {
      meter = await db.prepare('SELECT * FROM mt_meters WHERE company_id = ? AND asset_id = ? AND name = ? COLLATE NOCASE AND archived_at IS NULL ORDER BY created_at LIMIT 1').bind(companyId, asset.id, tpl.meter_name).first<any>();
      if (!meter) {
        skipped.push({ assetNumber: asset.number, reason: `no meter named ${tpl.meter_name}` });
        continue;
      }
      if (tpl.trigger_kind === 'meter' && !meter.rising) {
        skipped.push({ assetNumber: asset.number, reason: `${tpl.meter_name} is a gauge, not a rising meter` });
        continue;
      }
    }
    const def: Record<string, any> = {};
    for (const k of DEF_COLS) def[k] = tpl[k];
    def.trigger_kind = tpl.trigger_kind;
    const st = initialState(def, meter, today);
    // A template's first due date may already have passed: each asset then starts from today.
    if (st.next_due_date && st.next_due_date < today) st.next_due_date = today;
    const row: Record<string, unknown> = { ...def, ...st, id: newId(), company_id: companyId, asset_id: asset.id, template_id: tpl.id, meter_id: meter?.id ?? null, created_by: actorId, created_at: t, updated_at: t };
    const keys = Object.keys(row);
    stmts.push(db.prepare(`INSERT OR IGNORE INTO mt_pm_schedules (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => row[k])));
    stmts.push(eventStmt(db, { companyId, actorId, action: 'pm.schedule_created', assetId: asset.id, summary: `Preventive maintenance "${tpl.name}" set up from the template for ${tpl.asset_category}`, at: t }));
    made.push(asset.number);
  }
  for (let i = 0; i < stmts.length; i += 100) await db.batch(stmts.slice(i, i + 100));
  return { made, skipped };
}

// ------------------------------------------------------------------ generation

export interface Made {
  scheduleId: string;
  scheduleName: string;
  workOrderId: string;
  number: string;
  dueDate: string;
  key: string;
}

/**
 * Makes the work orders that are due: for one company (the button, a reading) or every company (the cron). Templates
 * are applied to new assets of their class first. Returns what was made; occurrences another run made first are
 * counted as skipped.
 */
export async function generateDue(db: D1Database, o: { companyId?: string; meterId?: string; scheduleId?: string; today: string; actorId: string | null; limit?: number }) {
  if (!o.meterId && !o.scheduleId) {
    const tpls = await db.prepare(`SELECT * FROM mt_pm_templates WHERE active = 1 ${o.companyId ? 'AND company_id = ?' : ''} ORDER BY company_id, created_at LIMIT 200`).bind(...(o.companyId ? [o.companyId] : [])).all<any>();
    for (const tpl of tpls.results) await applyTemplate(db, tpl.company_id, tpl, o.actorId, o.today);
  }
  const where = ['s.active = 1'];
  const args: unknown[] = [];
  if (o.companyId) {
    where.push('s.company_id = ?');
    args.push(o.companyId);
  }
  if (o.meterId) {
    where.push('s.meter_id = ?');
    args.push(o.meterId);
  }
  if (o.scheduleId) {
    where.push('s.id = ?');
    args.push(o.scheduleId);
  }
  const rows = await db
    .prepare(
      `SELECT s.*, r.id AS reading_id, r.value AS reading_value, m.last_total AS meter_total, m.expected_min, m.expected_max, it.name AS insp_name, it.archived_at AS insp_archived
         FROM mt_pm_schedules s
         JOIN mt_assets a ON a.company_id = s.company_id AND a.id = s.asset_id AND a.archived_at IS NULL AND a.status <> 'disposed'
         LEFT JOIN mt_meters m ON m.company_id = s.company_id AND m.id = s.meter_id
         LEFT JOIN mt_readings r ON r.company_id = m.company_id AND r.meter_id = m.id AND r.seq = m.last_seq
         LEFT JOIN mt_insp_templates it ON it.company_id = s.company_id AND it.id = s.inspection_template_id
        WHERE ${where.join(' AND ')}
          AND NOT EXISTS (SELECT 1 FROM mt_pm_occurrences x WHERE x.company_id = s.company_id AND x.schedule_id = s.id AND x.open_slot = 1)
          AND (
            (s.trigger_kind = 'time' AND s.next_due_date IS NOT NULL AND date(s.next_due_date, '-' || s.lead_days || ' days') <= ?)
            OR (s.trigger_kind = 'meter' AND m.archived_at IS NULL AND m.last_total IS NOT NULL AND s.next_due_meter IS NOT NULL AND m.last_total >= s.next_due_meter - 1e-9)
            OR (s.trigger_kind = 'condition' AND m.archived_at IS NULL AND r.id IS NOT NULL
                AND ((COALESCE(s.cond_below, m.expected_min) IS NOT NULL AND r.value < COALESCE(s.cond_below, m.expected_min))
                  OR (COALESCE(s.cond_above, m.expected_max) IS NOT NULL AND r.value > COALESCE(s.cond_above, m.expected_max)))
                AND NOT EXISTS (SELECT 1 FROM mt_pm_occurrences x2 WHERE x2.company_id = s.company_id AND x2.schedule_id = s.id AND x2.occurrence_key = 'c:' || r.id))
          )
        ORDER BY s.next_due_date, s.created_at LIMIT ?`,
    )
    .bind(...args, o.today, o.limit ?? 200)
    .all<any>();
  const made: Made[] = [];
  let skipped = 0;
  for (const s of rows.results) {
    try {
      const m = await makeOccurrence(db, s, o.today, o.actorId);
      if (m) made.push(m);
    } catch (e) {
      if (isUnique(e)) skipped++;
      else throw e;
    }
  }
  return { made, skipped, checked: rows.results.length };
}

async function makeOccurrence(db: D1Database, s: any, today: string, actorId: string | null): Promise<Made | null> {
  const t = now();
  let key: string;
  let due: string;
  let dueMeter: number | null = null;
  let readingId: string | null = null;
  const sched: Record<string, unknown> = {};
  let missed = 0;
  if (s.trigger_kind === 'time') {
    due = s.next_due_date;
    const unit = s.interval_unit as IntervalUnit;
    if (s.basis === 'fixed') {
      // More than one occurrence behind (the schedule started in the past, or generation was paused): start from the
      // latest due date that has come, and record how many earlier ones were passed over.
      let next = addInterval(due, s.interval_n, unit, s.anchor_day);
      while (next <= today && missed < 1000) {
        due = next;
        next = addInterval(due, s.interval_n, unit, s.anchor_day);
        missed++;
      }
      sched.next_due_date = next;
    }
    key = `t:${due}`;
  } else if (s.trigger_kind === 'meter') {
    dueMeter = Number(s.next_due_meter);
    key = `m:${dueMeter}`;
    due = addDays(today, s.lead_days);
    if (s.basis === 'fixed') {
      let next = dueMeter + Number(s.meter_interval);
      while (next <= Number(s.meter_total) && missed < 100000) {
        next += Number(s.meter_interval);
        missed++;
      }
      sched.next_due_meter = next;
    }
  } else {
    readingId = s.reading_id;
    key = `c:${readingId}`;
    due = addDays(today, s.lead_days);
  }
  const assigned = s.assigned_to && (await inCompany(db, s.company_id, s.assigned_to)) ? s.assigned_to : null;
  const number = await nextNumber(db, s.company_id, 'work_order');
  const woId = newId();
  const reason = s.trigger_kind === 'time' ? `due ${due}` : s.trigger_kind === 'meter' ? `meter at ${s.meter_total}, due at ${dueMeter}` : `reading ${s.reading_value} outside the limits`;
  const description = s.description ? `${s.name}: ${s.description}` : s.name;
  const row: Record<string, unknown> = {
    id: woId,
    company_id: s.company_id,
    number,
    asset_id: s.asset_id,
    description,
    job_type: s.job_type === 'inspection' ? 'inspection' : 'preventive',
    priority: s.priority,
    status: assigned ? 'assigned' : 'open',
    trade: s.trade,
    assigned_to: assigned,
    due_start: due < today ? due : today,
    due_finish: due,
    estimated_minutes: s.estimated_minutes,
    instructions: s.instructions,
    safety: s.safety,
    search: searchText(number, description, s.trade),
    created_by: actorId,
    created_at: t,
    updated_at: t,
  };
  const keys = Object.keys(row);
  const stmts: D1PreparedStatement[] = [db.prepare(`INSERT INTO mt_work_orders (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => row[k]))];
  parseJson<string[]>(s.tasks_json, []).forEach((text, i) => stmts.push(db.prepare('INSERT INTO mt_wo_tasks (id, company_id, work_order_id, position, text, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId(), s.company_id, woId, i + 1, String(text).slice(0, 500), actorId, t)));
  parseJson<{ part: string; quantity: number }[]>(s.parts_json, []).forEach((p, i) => stmts.push(db.prepare('INSERT INTO mt_wo_parts (id, company_id, work_order_id, position, part, quantity, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), s.company_id, woId, i + 1, String(p.part).slice(0, 200), Number(p.quantity) > 0 ? Number(p.quantity) : 1, actorId, t)));
  if (s.inspection_template_id && !s.insp_archived) {
    stmts.push(db.prepare("INSERT INTO mt_wo_inspections (id, company_id, work_order_id, template_id, template_name, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, 'open', ?, ?)").bind(newId(), s.company_id, woId, s.inspection_template_id, s.insp_name, actorId, t));
  }
  // The occurrence after the work order (it points at it): its key and the open slot are unique per schedule.
  stmts.push(
    db
      .prepare('INSERT INTO mt_pm_occurrences (id, company_id, schedule_id, occurrence_key, due_date, due_meter, trigger_reading_id, work_order_id, open_slot, made_by, made_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)')
      .bind(newId(), s.company_id, s.id, key, due, dueMeter, readingId, woId, actorId, t),
  );
  const set = { ...sched, last_work_order_id: woId, updated_at: t };
  stmts.push(db.prepare(`UPDATE mt_pm_schedules SET ${Object.keys(set).map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ?`).bind(...Object.values(set), s.company_id, s.id));
  stmts.push(
    eventStmt(db, {
      companyId: s.company_id,
      actorId,
      action: 'work_order.created',
      assetId: s.asset_id,
      workOrderId: woId,
      summary: `Work order ${number} made by preventive maintenance "${s.name}" (${reason})${missed && s.trigger_kind === 'time' ? `; ${missed} earlier due ${missed === 1 ? 'date was' : 'dates were'} passed over` : ''}`,
      after: { scheduleId: s.id, key, dueDate: due, dueMeter, generatedBy: actorId ? 'person' : 'schedule' },
      at: t,
    }),
  );
  await db.batch(stmts);
  return { scheduleId: s.id, scheduleName: s.name, workOrderId: woId, number, dueDate: due, key };
}

// ------------------------------------------------------------------ when a preventive work order is completed, cancelled or reopened

async function occurrenceOf(db: D1Database, companyId: string, woId: string) {
  return db
    .prepare(
      `SELECT o.id AS occ_id, o.due_date, o.due_meter, o.made_at, s.*, m.last_total AS meter_total,
              (SELECT COUNT(*) FROM mt_pm_occurrences y WHERE y.company_id = o.company_id AND y.schedule_id = o.schedule_id AND y.made_at > o.made_at) AS newer
         FROM mt_pm_occurrences o JOIN mt_pm_schedules s ON s.company_id = o.company_id AND s.id = o.schedule_id
         LEFT JOIN mt_meters m ON m.company_id = s.company_id AND m.id = s.meter_id
        WHERE o.company_id = ? AND o.work_order_id = ?`,
    )
    .bind(companyId, woId)
    .first<any>();
}

/** Statements for completing a work order: its occurrence is done, and its schedule's next due moves on. */
export async function pmCompleteStmts(db: D1Database, companyId: string, wo: { id: string; asset_id: string; number: string }, t: number, actorId: string | null) {
  const o = await occurrenceOf(db, companyId, wo.id);
  if (!o) return [];
  const guard = 'EXISTS (SELECT 1 FROM mt_work_orders gw WHERE gw.company_id = ? AND gw.id = ? AND gw.status = \'completed\' AND gw.completed_at = ?)';
  const g = [companyId, wo.id, t];
  const doneDate = utcDate(t);
  const total = o.meter_total === null || o.meter_total === undefined ? null : Number(o.meter_total);
  const stmts = [db.prepare(`UPDATE mt_pm_occurrences SET open_slot = NULL WHERE company_id = ? AND id = ? AND ${guard}`).bind(companyId, o.occ_id, ...g)];
  if (o.newer) return stmts;
  let nextDate: string | null = o.next_due_date;
  let nextMeter: number | null = o.next_due_meter;
  if (o.trigger_kind === 'time' && o.basis !== 'fixed') nextDate = addInterval(doneDate, o.interval_n, o.interval_unit);
  if (o.trigger_kind === 'meter' && o.basis !== 'fixed') nextMeter = (total ?? Number(o.due_meter)) + Number(o.meter_interval);
  stmts.push(
    db
      .prepare(`UPDATE mt_pm_schedules SET next_due_date = ?, next_due_meter = ?, last_done_date = ?, last_done_meter = ?, updated_at = ? WHERE company_id = ? AND id = ? AND ${guard}`)
      .bind(nextDate, nextMeter, doneDate, total, t, companyId, o.id, ...g),
    eventIfStmt(
      db,
      {
        companyId,
        actorId,
        action: 'pm.completed',
        assetId: wo.asset_id,
        workOrderId: wo.id,
        summary: `Preventive maintenance "${o.name}" done with ${wo.number}; next due ${o.trigger_kind === 'time' ? nextDate : o.trigger_kind === 'meter' ? `at ${nextMeter}` : 'on the next reading outside the limits'}`,
        before: { nextDueDate: o.next_due_date, nextDueMeter: o.next_due_meter },
        after: { nextDueDate: nextDate, nextDueMeter: nextMeter, doneDate, doneMeter: total },
        at: t,
      },
      guard,
      g,
    ),
  );
  return stmts;
}

/** Statements for cancelling a work order: its occurrence is skipped, and a completion-based schedule moves on from its due. */
export async function pmCancelStmts(db: D1Database, companyId: string, wo: { id: string; asset_id: string; number: string }, t: number, actorId: string | null) {
  const o = await occurrenceOf(db, companyId, wo.id);
  if (!o) return [];
  const guard = 'EXISTS (SELECT 1 FROM mt_work_orders gw WHERE gw.company_id = ? AND gw.id = ? AND gw.status = \'cancelled\' AND gw.cancelled_at = ?)';
  const g = [companyId, wo.id, t];
  const stmts = [db.prepare(`UPDATE mt_pm_occurrences SET open_slot = NULL WHERE company_id = ? AND id = ? AND ${guard}`).bind(companyId, o.occ_id, ...g)];
  if (o.newer || o.basis === 'fixed' || o.trigger_kind === 'condition') return stmts;
  const nextDate = o.trigger_kind === 'time' ? addInterval(o.due_date, o.interval_n, o.interval_unit, o.anchor_day) : o.next_due_date;
  const nextMeter = o.trigger_kind === 'meter' ? Number(o.due_meter) + Number(o.meter_interval) : o.next_due_meter;
  stmts.push(
    db.prepare(`UPDATE mt_pm_schedules SET next_due_date = ?, next_due_meter = ?, updated_at = ? WHERE company_id = ? AND id = ? AND ${guard}`).bind(nextDate, nextMeter, t, companyId, o.id, ...g),
    eventIfStmt(db, { companyId, actorId, action: 'pm.skipped', assetId: wo.asset_id, workOrderId: wo.id, summary: `Preventive maintenance "${o.name}": ${wo.number} cancelled, so this occurrence is skipped`, after: { nextDueDate: nextDate, nextDueMeter: nextMeter }, at: t }, guard, g),
  );
  return stmts;
}

/** Statements for reopening a work order: its occurrence is outstanding again, unless a newer one already is. */
export async function pmReopenStmts(db: D1Database, companyId: string, wo: { id: string }, t: number) {
  const o = await occurrenceOf(db, companyId, wo.id);
  if (!o) return [];
  return [
    db
      .prepare(
        `UPDATE mt_pm_occurrences SET open_slot = CASE WHEN EXISTS (SELECT 1 FROM mt_pm_occurrences x WHERE x.company_id = ?1 AND x.schedule_id = ?2 AND x.open_slot = 1 AND x.id <> ?3) THEN NULL ELSE 1 END
          WHERE company_id = ?1 AND id = ?3 AND EXISTS (SELECT 1 FROM mt_work_orders gw WHERE gw.company_id = ?1 AND gw.id = ?4 AND gw.status NOT IN ('completed','closed','cancelled') AND gw.updated_at = ?5)`,
      )
      .bind(companyId, o.id, o.occ_id, wo.id, t),
  ];
}

// ------------------------------------------------------------------ routes: schedules

pmRoutes.get('/c/:company/pm/schedules', async (c) => {
  const a = await requireMt(c);
  const qp = (k: string) => c.req.query(k) ?? '';
  const where = ['s.company_id = ?'];
  const args: unknown[] = [a.companyId];
  if (qp('assetId')) {
    where.push('s.asset_id = ?');
    args.push(qp('assetId').slice(0, 64));
  }
  if (qp('templateId')) {
    where.push('s.template_id = ?');
    args.push(qp('templateId').slice(0, 64));
  }
  if (qp('siteId')) {
    where.push(inSiteSql('a'));
    args.push(qp('siteId').slice(0, 64));
  }
  if (qp('active') === '1') where.push('s.active = 1');
  if (qp('active') === '0') where.push('s.active = 0');
  if ((TRIGGERS as readonly string[]).includes(qp('trigger'))) {
    where.push('s.trigger_kind = ?');
    args.push(qp('trigger'));
  }
  if (qp('q').trim()) {
    where.push('(lower(s.name) LIKE ? OR a.search LIKE ?)');
    args.push(likeOf(qp('q')), likeOf(qp('q')));
  }
  const rows = await c.env.DB.prepare(`${SCHEDULE_SELECT} WHERE ${where.join(' AND ')} ORDER BY s.active DESC, COALESCE(s.next_due_date, '9999-12-31'), a.number COLLATE NOCASE, s.name LIMIT 500`).bind(...args).all<any>();
  return c.json({ schedules: rows.results.map(scheduleDTO), can: { manage: isManager(a) } });
});

pmRoutes.post('/c/:company/pm/schedules', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const input = await body(c, scheduleCreate);
  const asset = await loadAsset(db, a.companyId, input.assetId).catch(() => {
    throw new HttpError(400, 'Choose an asset from this company');
  });
  if (asset.archived_at) throw new HttpError(400, 'That asset is archived');
  if (input.triggerKind !== 'time' && !input.meterId) throw new HttpError(400, 'Choose the meter or gauge this schedule follows');
  const meter = input.triggerKind === 'time' ? null : await meterOf(db, a.companyId, input.meterId, asset.id);
  const today = todayNear(c.req.query('today'));
  const def: Record<string, any> = { ...DEFAULTS, ...defColumns(input), trigger_kind: input.triggerKind };
  await checkDefinition(db, a, def, meter);
  const st = initialState(def, meter, today, input.firstDueMeter);
  const id = newId();
  const t = now();
  const row: Record<string, unknown> = { ...def, ...st, id, company_id: a.companyId, asset_id: asset.id, meter_id: meter?.id ?? null, created_by: a.userId, created_at: t, updated_at: t };
  const keys = Object.keys(row);
  await db.batch([
    db.prepare(`INSERT INTO mt_pm_schedules (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => row[k])),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'pm.schedule_created', assetId: asset.id, summary: `Preventive maintenance "${def.name}" set up (${describeTrigger({ ...def, meter_unit: meter?.unit ?? '' })})`, after: { scheduleId: id, ...defDTO(def), ...st }, at: t }),
  ]);
  return c.json(scheduleDTO(await loadSchedule(db, a.companyId, id)), 201);
});

pmRoutes.get('/c/:company/pm/schedules/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const s = await loadSchedule(db, a.companyId, c.req.param('id'));
  const occ = await db
    .prepare(
      `SELECT o.*, w.number, w.status, w.completed_at, w.due_finish FROM mt_pm_occurrences o JOIN mt_work_orders w ON w.company_id = o.company_id AND w.id = o.work_order_id
        WHERE o.company_id = ? AND o.schedule_id = ? ORDER BY o.made_at DESC LIMIT 200`,
    )
    .bind(a.companyId, s.id)
    .all<any>();
  return c.json({
    schedule: scheduleDTO(s),
    occurrences: occ.results.map((o) => ({
      id: o.id,
      key: o.occurrence_key,
      dueDate: o.due_date,
      dueMeter: o.due_meter,
      open: o.open_slot === 1,
      madeAt: o.made_at,
      workOrder: { id: o.work_order_id, number: o.number, status: o.status, completedAt: o.completed_at, dueFinish: o.due_finish },
      onTime: o.completed_at && ['completed', 'closed'].includes(o.status) ? utcDate(o.completed_at) <= o.due_date : null,
    })),
    can: { manage: isManager(a), edit: isManager(a) && !s.template_id },
  });
});

pmRoutes.patch('/c/:company/pm/schedules/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const s = await loadSchedule(db, a.companyId, c.req.param('id'));
  const input = await body(c, scheduleUpdate);
  const cols = defColumns(input);
  if (s.template_id && Object.keys(cols).some((k) => k !== 'active')) throw new HttpError(409, `This schedule follows the template "${s.template_name}": change the template, or pause this asset's schedule`);
  const meter = s.meter_id ? await db.prepare('SELECT * FROM mt_meters WHERE company_id = ? AND id = ?').bind(a.companyId, s.meter_id).first<any>() : null;
  const merged: Record<string, any> = { ...s, ...cols };
  await checkDefinition(db, a, merged, meter);
  const set: Record<string, unknown> = { ...cols };
  if (input.nextDueDate !== undefined || input.nextDueMeter !== undefined) {
    if (s.open_wo) throw new HttpError(409, `Work order ${String(s.open_wo).split('|')[1]} of this schedule is still outstanding: complete or cancel it first`);
    if (input.nextDueDate !== undefined) {
      if (s.trigger_kind !== 'time' || !input.nextDueDate) throw new HttpError(400, 'Only a time-based schedule has a next due date');
      set.next_due_date = input.nextDueDate;
    }
    if (input.nextDueMeter !== undefined) {
      if (s.trigger_kind !== 'meter' || input.nextDueMeter === null) throw new HttpError(400, 'Only a meter-based schedule has a next due meter value');
      set.next_due_meter = input.nextDueMeter;
    }
  }
  if (cols.start_date && s.trigger_kind === 'time') {
    set.anchor_day = Number(String(cols.start_date).slice(8, 10));
    if (!s.open_wo && s.last_done_date === null) set.next_due_date = cols.start_date;
  }
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(set)) {
    if (JSON.stringify(s[k] ?? null) !== JSON.stringify(v ?? null)) {
      before[k] = s[k] ?? null;
      after[k] = v;
    }
  }
  if (!Object.keys(after).length) return c.json(scheduleDTO(s));
  const t = now();
  const keys = Object.keys(after);
  await db.batch([
    db.prepare(`UPDATE mt_pm_schedules SET ${keys.map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE company_id = ? AND id = ?`).bind(...keys.map((k) => after[k]), t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: after.active === 0 ? 'pm.paused' : after.active === 1 ? 'pm.resumed' : 'pm.schedule_updated', assetId: s.asset_id, summary: after.active === 0 ? `Preventive maintenance "${s.name}" paused` : after.active === 1 ? `Preventive maintenance "${s.name}" resumed` : `Preventive maintenance "${s.name}" changed: ${keys.map((k) => k.replace(/_json$|_id$/, '').replace(/_/g, ' ')).join(', ')}`, before, after, at: t }),
  ]);
  return c.json(scheduleDTO(await loadSchedule(db, a.companyId, s.id)));
});

/** "Generate due work orders now": the same generation as the cron, for this company. */
pmRoutes.post('/c/:company/pm/generate', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const input = await body(c, z.object({ today: z.string().optional() }).default({}));
  const r = await generateDue(c.env.DB, { companyId: a.companyId, today: todayNear(input.today), actorId: a.userId });
  return c.json({ made: r.made, skipped: r.skipped });
});

export function describeTrigger(s: any): string {
  if (s.trigger_kind === 'time') return `every ${s.interval_n} ${s.interval_unit}${s.interval_n === 1 ? '' : 's'}${s.basis === 'fixed' ? ' on fixed dates' : ' from the last completion'}`;
  if (s.trigger_kind === 'meter') return `every ${s.meter_interval}${s.meter_unit ? ` ${s.meter_unit}` : ' units'}`;
  const parts = [s.cond_below !== null && s.cond_below !== undefined ? `below ${s.cond_below}` : '', s.cond_above !== null && s.cond_above !== undefined ? `above ${s.cond_above}` : ''].filter(Boolean);
  return `when a reading is ${parts.length ? parts.join(' or ') : 'outside the expected range'}`;
}

// ------------------------------------------------------------------ routes: templates

const templateDTO = (t: any) => ({ id: t.id, assetCategory: t.asset_category, siteId: t.site_id, siteName: t.site_name ?? null, meterName: t.meter_name, schedules: t.schedules ?? 0, ...defDTO(t), createdAt: t.created_at });
const TEMPLATE_SELECT = `SELECT t.*, st.name AS site_name, it.name AS insp_name, u.name AS assignee_name, (SELECT COUNT(*) FROM mt_pm_schedules s WHERE s.company_id = t.company_id AND s.template_id = t.id) AS schedules
  FROM mt_pm_templates t LEFT JOIN mt_sites st ON st.company_id = t.company_id AND st.id = t.site_id
  LEFT JOIN mt_insp_templates it ON it.company_id = t.company_id AND it.id = t.inspection_template_id LEFT JOIN users u ON u.id = t.assigned_to`;

async function loadTemplate(db: D1Database, companyId: string, id: string) {
  const t = await db.prepare(`${TEMPLATE_SELECT} WHERE t.company_id = ? AND t.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!t) throw notFound('Template');
  return t;
}

pmRoutes.get('/c/:company/pm/templates', async (c) => {
  const a = await requireMt(c);
  const rows = await c.env.DB.prepare(`${TEMPLATE_SELECT} WHERE t.company_id = ? ORDER BY t.active DESC, t.name COLLATE NOCASE LIMIT 300`).bind(a.companyId).all<any>();
  return c.json({ templates: rows.results.map(templateDTO), can: { manage: isManager(a) } });
});

pmRoutes.post('/c/:company/pm/templates', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const input = await body(c, templateCreate);
  if (input.triggerKind !== 'time' && !input.meterName?.trim()) throw new HttpError(400, 'Name the meter or gauge each asset of the class has (for example Hours)');
  await assertSite(db, a.companyId, input.siteId);
  const def: Record<string, any> = { ...DEFAULTS, ...defColumns(input), trigger_kind: input.triggerKind };
  await checkDefinition(db, a, def, null);
  const id = newId();
  const t = now();
  const row: Record<string, unknown> = { ...def, id, company_id: a.companyId, asset_category: input.assetCategory, site_id: input.siteId ?? null, meter_name: input.meterName?.trim() ?? '', created_by: a.userId, created_at: t, updated_at: t };
  const keys = Object.keys(row);
  await db.batch([
    db.prepare(`INSERT INTO mt_pm_templates (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => row[k])),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'pm.template_created', summary: `Preventive maintenance template "${def.name}" for ${input.assetCategory} created`, after: { templateId: id, ...input }, at: t }),
  ]);
  const tpl = await loadTemplate(db, a.companyId, id);
  const applied = def.active ? await applyTemplate(db, a.companyId, tpl, a.userId, todayNear(c.req.query('today'))) : { made: [], skipped: [] };
  return c.json({ template: templateDTO(await loadTemplate(db, a.companyId, id)), applied }, 201);
});

pmRoutes.get('/c/:company/pm/templates/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const t = await loadTemplate(db, a.companyId, c.req.param('id'));
  const rows = await db.prepare(`${SCHEDULE_SELECT} WHERE s.company_id = ? AND s.template_id = ? ORDER BY a.number COLLATE NOCASE LIMIT 500`).bind(a.companyId, t.id).all<any>();
  return c.json({ template: templateDTO(t), schedules: rows.results.map(scheduleDTO), can: { manage: isManager(a) } });
});

/** Changes a template and every schedule made from it (their due state is kept). */
pmRoutes.patch('/c/:company/pm/templates/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const tpl = await loadTemplate(db, a.companyId, c.req.param('id'));
  const input = await body(c, templateUpdate);
  const cols = defColumns(input);
  delete cols.start_date;
  const merged: Record<string, any> = { ...tpl, ...cols };
  await checkDefinition(db, a, merged, null);
  if (!Object.keys(cols).length) return c.json(templateDTO(tpl));
  const t = now();
  const keys = Object.keys(cols);
  await db.batch([
    db.prepare(`UPDATE mt_pm_templates SET ${keys.map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE company_id = ? AND id = ?`).bind(...keys.map((k) => cols[k]), t, a.companyId, tpl.id),
    db.prepare(`UPDATE mt_pm_schedules SET ${keys.map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE company_id = ? AND template_id = ?`).bind(...keys.map((k) => cols[k]), t, a.companyId, tpl.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'pm.template_updated', summary: `Preventive maintenance template "${merged.name}" changed (${tpl.schedules} schedules follow it)`, before: Object.fromEntries(keys.map((k) => [k, tpl[k]])), after: cols, at: t }),
  ]);
  return c.json(templateDTO(await loadTemplate(db, a.companyId, tpl.id)));
});

pmRoutes.post('/c/:company/pm/templates/:id/apply', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const tpl = await loadTemplate(db, a.companyId, c.req.param('id'));
  if (!tpl.active) throw new HttpError(409, 'This template is paused');
  return c.json(await applyTemplate(db, a.companyId, tpl, a.userId, todayNear(c.req.query('today'))));
});

// ------------------------------------------------------------------ the forecast (PM calendar)

/**
 * What is due between two dates: outstanding preventive work orders, the next due date of each time-based schedule and
 * the dates after it (projected as if each is done on time), and meter-based schedules projected from the meter's
 * average daily use over its last 90 days of readings. Condition-based schedules cannot be forecast.
 */
pmRoutes.get('/c/:company/pm/forecast', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const today = todayNear(c.req.query('today'));
  const from = validDate(c.req.query('from') ?? '') ? c.req.query('from')! : today;
  let to = validDate(c.req.query('to') ?? '') ? c.req.query('to')! : addDays(from, 90);
  if (to < from) throw new HttpError(400, 'The end date cannot be before the start date');
  if (daysBetween(from, to) > 400) to = addDays(from, 400);
  const site = c.req.query('siteId');
  const rows = await db.prepare(`${SCHEDULE_SELECT} WHERE s.company_id = ? AND s.active = 1 ${site ? `AND ${inSiteSql('a')}` : ''} ORDER BY s.name LIMIT 500`).bind(a.companyId, ...(site ? [site.slice(0, 64)] : [])).all<any>();
  const entries: { date: string; kind: 'open' | 'due' | 'projected'; scheduleId: string; name: string; assetId: string; assetNumber: string; assetName: string; triggerKind: string; workOrder?: { id: string; number: string; status: string }; note?: string }[] = [];
  const unforecast: { scheduleId: string; name: string; assetNumber: string; reason: string }[] = [];
  for (const s of rows.results) {
    const base = { scheduleId: s.id, name: s.name, assetId: s.asset_id, assetNumber: s.asset_number, assetName: s.asset_name, triggerKind: s.trigger_kind };
    const dto = scheduleDTO(s);
    if (dto.openWorkOrder) {
      const d = dto.openWorkOrder.dueFinish ?? today;
      if (d <= to) entries.push({ ...base, date: d < from ? from : d, kind: 'open', workOrder: { id: dto.openWorkOrder.id, number: dto.openWorkOrder.number, status: dto.openWorkOrder.status }, note: d < from ? `Overdue since ${d}` : undefined });
    }
    if (s.trigger_kind === 'time' && s.next_due_date) {
      let d: string = s.next_due_date;
      // the occurrence already made is the outstanding work order above (fixed basis: next_due_date is the one after it)
      if (dto.openWorkOrder && s.basis !== 'fixed') d = addInterval(d, s.interval_n, s.interval_unit, s.basis === 'fixed' ? s.anchor_day : null);
      let first = true;
      for (let i = 0; i < 400 && d <= to; i++) {
        if (d >= from) entries.push({ ...base, date: d, kind: first && !dto.openWorkOrder ? 'due' : 'projected' });
        first = false;
        d = addInterval(d, s.interval_n, s.interval_unit, s.basis === 'fixed' ? s.anchor_day : null);
      }
    } else if (s.trigger_kind === 'meter') {
      const usage = await db
        .prepare('SELECT MIN(read_at) AS t0, MAX(read_at) AS t1, MIN(total) AS v0, MAX(total) AS v1 FROM mt_readings WHERE company_id = ? AND meter_id = ? AND total IS NOT NULL AND read_at >= ?')
        .bind(a.companyId, s.meter_id, Date.parse(`${today}T00:00:00Z`) - 90 * 86_400_000)
        .first<{ t0: number | null; t1: number | null; v0: number | null; v1: number | null }>();
      const days = usage?.t0 && usage.t1 ? (usage.t1 - usage.t0) / 86_400_000 : 0;
      const perDay = days >= 1 && usage!.v1! > usage!.v0! ? (usage!.v1! - usage!.v0!) / days : 0;
      if (!perDay || s.next_due_meter === null || s.meter_total === null) {
        unforecast.push({ scheduleId: s.id, name: s.name, assetNumber: s.asset_number, reason: `due at ${s.next_due_meter ?? '?'}${s.meter_unit ? ` ${s.meter_unit}` : ''}; not enough readings to project a date` });
        continue;
      }
      let at = Number(s.next_due_meter);
      for (let i = 0; i < 200; i++) {
        const d = addDays(today, Math.max(0, Math.ceil((at - Number(s.meter_total)) / perDay)));
        if (d > to) break;
        if (d >= from && !(i === 0 && dto.openWorkOrder)) entries.push({ ...base, date: d, kind: 'projected', note: `at ${Math.round(at * 100) / 100}${s.meter_unit ? ` ${s.meter_unit}` : ''} (about ${Math.round(perDay * 10) / 10} a day)` });
        at += Number(s.meter_interval);
      }
    } else if (s.trigger_kind === 'condition') {
      unforecast.push({ scheduleId: s.id, name: s.name, assetNumber: s.asset_number, reason: describeTrigger(s) });
    }
  }
  entries.sort((x, y) => (x.date === y.date ? x.assetNumber.localeCompare(y.assetNumber) : x.date < y.date ? -1 : 1));
  return c.json({ from, to, today, entries: entries.slice(0, 2000), unforecast });
});

/** The schedules of one asset (for the asset's page). */
export async function loadSchedulesOfAsset(db: D1Database, companyId: string, assetId: string) {
  const rows = await db.prepare(`${SCHEDULE_SELECT} WHERE s.company_id = ? AND s.asset_id = ? ORDER BY s.active DESC, s.name LIMIT 100`).bind(companyId, assetId).all<any>();
  return rows.results.map(scheduleDTO);
}
