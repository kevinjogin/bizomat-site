// BIZOMAT ERP, Release 3: manufacturing set-up (/api/erp/c/:company/...). Who may do what: access.ts
// (manufacturing.view, manufacturing.setup, routings.release, production.plan, settings.manage).
//
//   mfg-settings                        over-completion tolerance, reserving on release, the finished-goods location, the
//                                       MRP horizon (ERP administrators)
//   products/:id/planning               made or bought, lead times, safety stock, order sizes (production managers)
//   work-centres, machines              capacity calendar (working days, hours per day, efficiency, machines in
//                                       parallel), cost rates (labour, machine, overhead per labour hour or as a
//                                       percentage), status; a machine may name a Maintenance asset of the same company,
//                                       and shows as down while that asset has an open breakdown work order (read only)
//   routings                            revisions of a product's routing: draft, released (by an engineering approver
//                                       who did not draft it; the one-person exception is recorded), superseded; copied
//                                       to a new draft; operations with work centre, machine, set-up and run time,
//                                       crew, inspection point, outsourcing and predecessors (with overlap)
//
// Manufacturing orders and the shop floor are production.ts; the schedule, MRP and capacity are planning.ts.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { can, requireErp, segregation, type ErpAccess } from './access';
import { badState, changed, csvResponse, dollars, eventStmt, eventStmtIf, historyOf, likeOf, searchText, wantsCsv, zId, zMoney, zText } from './util';
import { loadLocation } from './inventory';
import { loadProduct } from './products';
import { recordFiles } from './record-files';

export const manufacturingRoutes = new Hono<AppEnv>();

// ------------------------------------------------------------------ fixed lists and their labels

export const METHODS = { make_to_stock: 'Make to stock', make_to_order: 'Make to order', engineer_to_order: 'Engineer to order' } as const;
export const PRODUCTION_TYPES = { discrete: 'Discrete', assembly: 'Assembly', batch: 'Batch', repetitive: 'Repetitive', job: 'Job' } as const;
export const PRIORITIES = { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' } as const;
export const MO_STATUS = { draft: 'Draft', released: 'Released', in_progress: 'In progress', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' } as const;
export const OP_STATUS = { pending: 'Not started', in_progress: 'In progress', paused: 'Paused', completed: 'Completed' } as const;
export const WC_STATUS = { active: 'Active', on_hold: 'On hold', inactive: 'Inactive' } as const;
export const ROUTING_STATUS = { draft: 'Draft', released: 'Released', superseded: 'Superseded' } as const;
export const REPORT_KINDS = { good: 'Good output', scrap: 'Scrap', rework: 'Rework', downtime: 'Downtime' } as const;
export const TIME_KINDS = { labour: 'Labour', machine: 'Machine' } as const;
export const DEMAND_KINDS = { forecast: 'Forecast', confirmed: 'Confirmed' } as const;
export const SUGGESTION_KINDS = { buy: 'Buy', make: 'Make', expedite: 'Expedite' } as const;
export const SOURCES = { make: 'Make', buy: 'Buy' } as const;
export const COST_ELEMENTS = ['materials', 'labour', 'machine', 'outsourcing', 'overheads', 'scrap', 'rework'] as const;
export type CostElement = (typeof COST_ELEMENTS)[number];
export const ELEMENT_LABELS: Record<CostElement, string> = { materials: 'Materials', labour: 'Labour', machine: 'Machine', outsourcing: 'Outsourcing', overheads: 'Overheads', scrap: 'Scrap', rework: 'Rework' };
export const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const label = <T extends Record<string, string>>(map: T, v: string) => (Object.hasOwn(map, v) ? map[v as keyof T] : v);
export const isKey = <T extends Record<string, string>>(map: T, v: unknown): v is keyof T & string => typeof v === 'string' && Object.hasOwn(map, v);

const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/;
const zCode = zText(40).regex(CODE_RE, 'Use letters, digits and . _ / - (up to 40)');

// ------------------------------------------------------------------ dates and the capacity calendar

const DAY_MS = 86_400_000;
export const todayIso = () => new Date(now()).toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);
/** ISO weekday: Monday 1 to Sunday 7. */
export const weekday = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return d === 0 ? 7 : d;
};
/** The Monday of the week a date falls in. */
export const weekStart = (iso: string) => addDays(iso, 1 - weekday(iso));
export const parseDays = (s: string | null | undefined) => [...new Set(String(s ?? '').split(',').map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 7))].sort();

/** The date itself if it is a working day, else the next one (a calendar with no working days: the date itself). */
export function nextWorkingDay(iso: string, days: number[]) {
  if (!days.length) return iso;
  let d = iso;
  for (let i = 0; i < 7 && !days.includes(weekday(d)); i++) d = addDays(d, 1);
  return d;
}

/** `n` working days after a working day. */
export function addWorkingDays(iso: string, n: number, days: number[]) {
  let d = nextWorkingDay(iso, days);
  for (let i = 0; i < n; i++) d = nextWorkingDay(addDays(d, 1), days);
  return d;
}

export interface WorkCentreRow {
  id: string;
  code: string;
  name: string;
  status: string;
  working_days: string;
  hours_per_day: number;
  efficiency_pct: number;
  machines: number;
  labour_rate_cents: number;
  machine_rate_cents: number;
  overhead_rate_cents: number;
  overhead_pct: number;
  archived_at: number | null;
}

/** Productive hours a work centre gives on one working day: hours per day, times machines, times efficiency. */
export const dailyHours = (w: Pick<WorkCentreRow, 'hours_per_day' | 'machines' | 'efficiency_pct'>) => w.hours_per_day * w.machines * (w.efficiency_pct / 100);

/** Available hours in the week starting on `monday`. */
export function weekHours(w: WorkCentreRow, monday: string) {
  const days = parseDays(w.working_days);
  let n = 0;
  for (let i = 0; i < 7; i++) if (days.includes(weekday(addDays(monday, i)))) n++;
  return Math.round(n * dailyHours(w) * 100) / 100;
}

// ------------------------------------------------------------------ settings

export interface MfgSettings {
  overCompletionPct: number;
  reserveOnRelease: boolean;
  fgLocationId: string | null;
  mrpHorizonDays: number;
}

export async function loadMfgSettings(db: D1Database, companyId: string): Promise<MfgSettings> {
  const r = await db.prepare('SELECT * FROM erp_mfg_settings WHERE company_id = ?').bind(companyId).first<any>();
  return { overCompletionPct: Number(r?.over_completion_pct ?? 0), reserveOnRelease: r ? !!r.reserve_on_release : true, fgLocationId: r?.fg_location_id ?? null, mrpHorizonDays: Number(r?.mrp_horizon_days ?? 90) };
}

manufacturingRoutes.get('/c/:company/mfg-settings', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const s = await loadMfgSettings(c.env.DB, a.companyId);
  const loc = s.fgLocationId ? await loadLocation(c.env.DB, a.companyId, s.fgLocationId).catch(() => null) : null;
  return c.json({ settings: { ...s, fgLocationCode: loc ? `${loc.warehouse_code}/${loc.code}` : null }, can: { manage: can(a, 'settings.manage') } });
});

manufacturingRoutes.put('/c/:company/mfg-settings', async (c) => {
  const a = await requireErp(c, 'settings.manage');
  const db = c.env.DB;
  const input = await body(c, z.object({ overCompletionPct: z.number().min(0).max(100).optional(), reserveOnRelease: z.boolean().optional(), fgLocationId: zId.nullable().optional(), mrpHorizonDays: z.number().int().min(7).max(730).optional() }));
  const before = await loadMfgSettings(db, a.companyId);
  if (input.fgLocationId) {
    const l = await loadLocation(db, a.companyId, input.fgLocationId);
    if (l.archived_at || l.warehouse_archived) throw new HttpError(400, `Location ${l.code} is archived`);
    if (l.kind === 'quarantine') throw new HttpError(400, 'Finished goods cannot go into quarantine by default');
  }
  const after: MfgSettings = {
    overCompletionPct: input.overCompletionPct ?? before.overCompletionPct,
    reserveOnRelease: input.reserveOnRelease ?? before.reserveOnRelease,
    fgLocationId: input.fgLocationId !== undefined ? input.fgLocationId : before.fgLocationId,
    mrpHorizonDays: input.mrpHorizonDays ?? before.mrpHorizonDays,
  };
  const diff = changed(before as unknown as Record<string, unknown>, after as unknown as Record<string, unknown>);
  if (diff.any) {
    const t = now();
    await db.batch([
      db
        .prepare(
          `INSERT INTO erp_mfg_settings (company_id, over_completion_pct, reserve_on_release, fg_location_id, mrp_horizon_days, updated_by, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
           ON CONFLICT(company_id) DO UPDATE SET over_completion_pct = ?2, reserve_on_release = ?3, fg_location_id = ?4, mrp_horizon_days = ?5, updated_by = ?6, updated_at = ?7`,
        )
        .bind(a.companyId, after.overCompletionPct, after.reserveOnRelease ? 1 : 0, after.fgLocationId, after.mrpHorizonDays, a.userId, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'settings.changed', entityType: 'settings', entityId: a.companyId, summary: 'Manufacturing settings changed', before: diff.before, after: diff.after, at: t }),
    ]);
  }
  return c.json({ settings: after });
});

// ------------------------------------------------------------------ product planning data

export interface Planning {
  source: '' | 'make' | 'buy';
  purchaseLeadDays: number | null;
  mfgLeadDays: number | null;
  safetyStock: number;
  minOrderQty: number | null;
  orderMultiple: number | null;
}

export const planningDTO = (r: any): Planning => ({
  source: (r?.source ?? '') as Planning['source'],
  purchaseLeadDays: r?.purchase_lead_days ?? null,
  mfgLeadDays: r?.mfg_lead_days ?? null,
  safetyStock: Number(r?.safety_stock ?? 0),
  minOrderQty: r?.min_order_qty ?? null,
  orderMultiple: r?.order_multiple ?? null,
});

manufacturingRoutes.get('/c/:company/products/:id/planning', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  const r = await db.prepare('SELECT * FROM erp_product_planning WHERE company_id = ? AND product_id = ?').bind(a.companyId, p.id).first<any>();
  const routing = await db.prepare("SELECT id, revision, lead_time_days FROM erp_routings WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(a.companyId, p.id).first<any>();
  return c.json({ product: { id: p.id, number: p.number, name: p.name }, planning: planningDTO(r), releasedRouting: routing ? { id: routing.id, revision: routing.revision, leadTimeDays: routing.lead_time_days } : null, can: { edit: can(a, 'production.plan') } });
});

manufacturingRoutes.put('/c/:company/products/:id/planning', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  const input = await body(
    c,
    z.object({
      source: z.enum(['', 'make', 'buy']).optional(),
      purchaseLeadDays: z.number().int().min(0).max(1000).nullable().optional(),
      mfgLeadDays: z.number().int().min(0).max(1000).nullable().optional(),
      safetyStock: z.number().min(0).max(1e9).optional(),
      minOrderQty: z.number().positive().max(1e9).nullable().optional(),
      orderMultiple: z.number().positive().max(1e9).nullable().optional(),
    }),
  );
  if (p.type === 'service') throw new HttpError(400, `${p.number} is a service: services are not planned`);
  const old = planningDTO(await db.prepare('SELECT * FROM erp_product_planning WHERE company_id = ? AND product_id = ?').bind(a.companyId, p.id).first<any>());
  const next: Planning = {
    source: input.source ?? old.source,
    purchaseLeadDays: input.purchaseLeadDays !== undefined ? input.purchaseLeadDays : old.purchaseLeadDays,
    mfgLeadDays: input.mfgLeadDays !== undefined ? input.mfgLeadDays : old.mfgLeadDays,
    safetyStock: input.safetyStock ?? old.safetyStock,
    minOrderQty: input.minOrderQty !== undefined ? input.minOrderQty : old.minOrderQty,
    orderMultiple: input.orderMultiple !== undefined ? input.orderMultiple : old.orderMultiple,
  };
  const diff = changed(old as unknown as Record<string, unknown>, next as unknown as Record<string, unknown>);
  if (diff.any) {
    const t = now();
    await db.batch([
      db
        .prepare(
          `INSERT INTO erp_product_planning (company_id, product_id, source, purchase_lead_days, mfg_lead_days, safety_stock, min_order_qty, order_multiple, updated_by, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
           ON CONFLICT(company_id, product_id) DO UPDATE SET source = ?3, purchase_lead_days = ?4, mfg_lead_days = ?5, safety_stock = ?6, min_order_qty = ?7, order_multiple = ?8, updated_by = ?9, updated_at = ?10`,
        )
        .bind(a.companyId, p.id, next.source, next.purchaseLeadDays, next.mfgLeadDays, next.safetyStock, next.minOrderQty, next.orderMultiple, a.userId, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'product.planning_changed', entityType: 'product', entityId: p.id, productId: p.id, summary: `Planning data of ${p.number} changed`, before: diff.before, after: diff.after, at: t }),
    ]);
  }
  return c.json({ planning: next });
});

// ------------------------------------------------------------------ work centres and machines

export function workCentreDTO(w: any) {
  return {
    id: w.id,
    code: w.code,
    name: w.name,
    description: w.description ?? '',
    status: w.status,
    statusLabel: label(WC_STATUS, w.status),
    workingDays: parseDays(w.working_days),
    workingDaysText: parseDays(w.working_days).map((d) => DAY_NAMES[d]).join(', '),
    hoursPerDay: w.hours_per_day,
    efficiencyPct: w.efficiency_pct,
    machines: w.machines,
    labourRateCents: w.labour_rate_cents,
    machineRateCents: w.machine_rate_cents,
    overheadRateCents: w.overhead_rate_cents,
    overheadPct: w.overhead_pct,
    dailyHours: Math.round(dailyHours(w) * 100) / 100,
    weeklyHours: Math.round(parseDays(w.working_days).length * dailyHours(w) * 100) / 100,
    machineCount: w.machine_count ?? undefined,
    openOperations: w.open_ops ?? undefined,
    archived: !!w.archived_at,
    createdAt: w.created_at,
    updatedAt: w.updated_at,
  };
}

export async function loadWorkCentre(db: D1Database, companyId: string, id: string): Promise<WorkCentreRow & Record<string, any>> {
  const w = await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ? AND id = ?').bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!w) throw notFound('Work centre');
  return w;
}

/**
 * Whether machines linked to Maintenance assets are down: an open breakdown or emergency repair work order on the asset
 * (read from Maintenance, never changed). Keyed by asset id.
 */
export async function assetStates(db: D1Database, companyId: string, assetIds: (string | null | undefined)[]) {
  const ids = [...new Set(assetIds.filter((x): x is string => !!x))].slice(0, 500);
  const map = new Map<string, { assetId: string; number: string; name: string; status: string; down: boolean; workOrder: { id: string; number: string; description: string } | null }>();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const rows = await db
      .prepare(
        `SELECT a.id, a.number, a.name, a.status,
                (SELECT w.id || '|' || w.number || '|' || substr(w.description, 1, 200) FROM mt_work_orders w WHERE w.company_id = a.company_id AND w.asset_id = a.id
                   AND w.job_type IN ('breakdown','emergency_repair') AND w.status IN ('open','assigned','in_progress','on_hold') ORDER BY w.created_at DESC LIMIT 1) AS wo
           FROM mt_assets a WHERE a.company_id = ? AND a.id IN (${chunk.map(() => '?').join(',')})`,
      )
      .bind(companyId, ...chunk)
      .all<{ id: string; number: string; name: string; status: string; wo: string | null }>();
    for (const r of rows.results) {
      const [woId, woNumber, ...desc] = (r.wo ?? '').split('|');
      map.set(r.id, { assetId: r.id, number: r.number, name: r.name, status: r.status, down: !!r.wo, workOrder: r.wo ? { id: woId, number: woNumber, description: desc.join('|') } : null });
    }
  }
  return map;
}

export function machineDTO(m: any, states?: Map<string, any>) {
  const asset = m.asset_id ? states?.get(m.asset_id) ?? null : null;
  return {
    id: m.id,
    workCentreId: m.work_centre_id,
    workCentreCode: m.wc_code ?? null,
    code: m.code,
    name: m.name,
    status: m.status,
    machineRateCents: m.machine_rate_cents,
    assetId: m.asset_id,
    asset: asset ? { id: asset.assetId, number: asset.number, name: asset.name, status: asset.status } : null,
    down: !!asset?.down,
    breakdown: asset?.workOrder ?? null,
    notes: m.notes,
    archived: !!m.archived_at,
  };
}

const zWorkCentre = z.object({
  code: zCode,
  name: zText(200).min(1, 'Give the work centre a name'),
  description: zText(2000).optional(),
  status: z.enum(['active', 'on_hold', 'inactive']).optional(),
  workingDays: z.array(z.number().int().min(1).max(7)).min(1, 'Choose at least one working day').max(7).optional(),
  hoursPerDay: z.number().gt(0).max(24).optional(),
  efficiencyPct: z.number().gt(0).max(200).optional(),
  machines: z.number().int().min(1).max(1000).optional(),
  labourRateCents: z.number().int().min(0).max(1e9).optional(),
  machineRateCents: z.number().int().min(0).max(1e9).optional(),
  overheadRateCents: z.number().int().min(0).max(1e9).optional(),
  overheadPct: z.number().min(0).max(1000).optional(),
});

function checkOverhead(rate: number, pct: number) {
  if (rate > 0 && pct > 0) throw new HttpError(400, 'Overhead is either a rate per labour hour or a percentage of labour and machine cost, not both');
}

const WC_LIST = `SELECT w.*, (SELECT COUNT(*) FROM erp_machines m WHERE m.company_id = w.company_id AND m.work_centre_id = w.id AND m.archived_at IS NULL) AS machine_count,
  (SELECT COUNT(*) FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id
     WHERE o.company_id = w.company_id AND o.work_centre_id = w.id AND o.status <> 'completed' AND mo.status IN ('released','in_progress')) AS open_ops
  FROM erp_work_centres w`;

manufacturingRoutes.get('/c/:company/work-centres', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const where = ['w.company_id = ?'];
  const args: unknown[] = [a.companyId];
  if (c.req.query('archived') !== '1') where.push('w.archived_at IS NULL');
  const status = c.req.query('status');
  if (status && isKey(WC_STATUS, status)) {
    where.push('w.status = ?');
    args.push(status);
  }
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('w.search LIKE ?');
    args.push(likeOf(q));
  }
  const rows = await db.prepare(`${WC_LIST} WHERE ${where.join(' AND ')} ORDER BY w.code COLLATE NOCASE LIMIT 500`).bind(...args).all<any>();
  const list = rows.results.map(workCentreDTO);
  if (wantsCsv(c)) {
    return csvResponse('work-centres', [
      ['Code', 'Name', 'Status', 'Working days', 'Hours per day', 'Efficiency %', 'Machines', 'Hours per week', 'Labour rate', 'Machine rate', 'Overhead per hour', 'Overhead %', 'Open operations'],
      ...list.map((w) => [w.code, w.name, w.statusLabel, w.workingDaysText, w.hoursPerDay, w.efficiencyPct, w.machines, w.weeklyHours, dollars(w.labourRateCents), dollars(w.machineRateCents), dollars(w.overheadRateCents), w.overheadPct, w.openOperations ?? 0]),
    ]);
  }
  const machines = await db.prepare('SELECT m.*, w.code AS wc_code FROM erp_machines m JOIN erp_work_centres w ON w.company_id = m.company_id AND w.id = m.work_centre_id WHERE m.company_id = ? AND m.archived_at IS NULL ORDER BY m.code COLLATE NOCASE LIMIT 2000').bind(a.companyId).all<any>();
  const states = await assetStates(db, a.companyId, machines.results.map((m) => m.asset_id));
  return c.json({ workCentres: list, machines: machines.results.map((m) => machineDTO(m, states)), can: { setup: can(a, 'manufacturing.setup') } });
});

manufacturingRoutes.post('/c/:company/work-centres', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const input = await body(c, zWorkCentre);
  checkOverhead(input.overheadRateCents ?? 0, input.overheadPct ?? 0);
  if (await db.prepare('SELECT 1 FROM erp_work_centres WHERE company_id = ? AND code = ?').bind(a.companyId, input.code).first()) throw new HttpError(409, `A work centre ${input.code} already exists`);
  const id = newId();
  const t = now();
  const days = (input.workingDays ?? [1, 2, 3, 4, 5]).slice().sort().join(',');
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_work_centres (id, company_id, code, name, description, status, working_days, hours_per_day, efficiency_pct, machines, labour_rate_cents, machine_rate_cents, overhead_rate_cents, overhead_pct, search, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.companyId, input.code, input.name, input.description ?? '', input.status ?? 'active', days, input.hoursPerDay ?? 8, input.efficiencyPct ?? 100, input.machines ?? 1, input.labourRateCents ?? 0, input.machineRateCents ?? 0, input.overheadRateCents ?? 0, input.overheadPct ?? 0, searchText(input.code, input.name, input.description), a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_centre.created', entityType: 'work_centre', entityId: id, summary: `Work centre ${input.code} ${input.name} created`, at: t }),
  ]);
  return c.json(workCentreDTO(await loadWorkCentre(db, a.companyId, id)), 201);
});

manufacturingRoutes.get('/c/:company/work-centres/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const w = await loadWorkCentre(db, a.companyId, c.req.param('id'));
  const machines = await db.prepare('SELECT m.*, ? AS wc_code FROM erp_machines m WHERE m.company_id = ? AND m.work_centre_id = ? ORDER BY m.archived_at IS NOT NULL, m.code COLLATE NOCASE').bind(w.code, a.companyId, w.id).all<any>();
  const states = await assetStates(db, a.companyId, machines.results.map((m) => m.asset_id));
  const ops = await db
    .prepare(
      `SELECT o.id, o.op_no, o.name, o.status, o.planned_start, o.planned_finish, o.good_qty, o.max_qty, mo.id AS mo_id, mo.number AS mo_number, mo.status AS mo_status, mo.quantity, p.number AS product_number, p.name AS product_name
         FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id
        WHERE o.company_id = ? AND o.work_centre_id = ? AND o.status <> 'completed' AND mo.status IN ('released','in_progress')
        ORDER BY COALESCE(o.planned_start, '9999'), mo.number LIMIT 200`,
    )
    .bind(a.companyId, w.id)
    .all<any>();
  return c.json({
    workCentre: workCentreDTO(w),
    machines: machines.results.map((m) => machineDTO(m, states)),
    operations: ops.results.map((o) => ({ id: o.id, opNo: o.op_no, name: o.name, status: o.status, statusLabel: label(OP_STATUS, o.status), plannedStart: o.planned_start, plannedFinish: o.planned_finish, goodQty: o.good_qty, quantity: o.quantity, moId: o.mo_id, moNumber: o.mo_number, moStatus: o.mo_status, productNumber: o.product_number, productName: o.product_name })),
    history: await historyOf(db, a.companyId, { entityType: 'work_centre', entityId: w.id }),
    can: { setup: can(a, 'manufacturing.setup') },
  });
});

manufacturingRoutes.patch('/c/:company/work-centres/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const w = await loadWorkCentre(db, a.companyId, c.req.param('id'));
  const input = await body(c, zWorkCentre.partial().extend({ archived: z.boolean().optional() }));
  if (input.code && input.code.toLowerCase() !== w.code.toLowerCase() && (await db.prepare('SELECT 1 FROM erp_work_centres WHERE company_id = ? AND code = ? AND id <> ?').bind(a.companyId, input.code, w.id).first())) {
    throw new HttpError(409, `A work centre ${input.code} already exists`);
  }
  const next = {
    code: input.code ?? w.code,
    name: input.name ?? w.name,
    description: input.description ?? w.description,
    status: input.status ?? w.status,
    working_days: input.workingDays ? input.workingDays.slice().sort().join(',') : w.working_days,
    hours_per_day: input.hoursPerDay ?? w.hours_per_day,
    efficiency_pct: input.efficiencyPct ?? w.efficiency_pct,
    machines: input.machines ?? w.machines,
    labour_rate_cents: input.labourRateCents ?? w.labour_rate_cents,
    machine_rate_cents: input.machineRateCents ?? w.machine_rate_cents,
    overhead_rate_cents: input.overheadRateCents ?? w.overhead_rate_cents,
    overhead_pct: input.overheadPct ?? w.overhead_pct,
    archived_at: input.archived === undefined ? w.archived_at : input.archived ? w.archived_at ?? now() : null,
  };
  checkOverhead(next.overhead_rate_cents, next.overhead_pct);
  if (input.archived && !w.archived_at) {
    const open = await db.prepare("SELECT COUNT(*) AS n FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id WHERE o.company_id = ? AND o.work_centre_id = ? AND mo.status IN ('draft','released','in_progress')").bind(a.companyId, w.id).first<{ n: number }>();
    if (open?.n) badState(`${w.code} has operations on ${open.n} open manufacturing order${open.n === 1 ? '' : 's'}: finish them first`);
    const routed = await db.prepare("SELECT COUNT(*) AS n FROM erp_routing_operations o JOIN erp_routings r ON r.company_id = o.company_id AND r.id = o.routing_id WHERE o.company_id = ? AND o.work_centre_id = ? AND r.status IN ('draft','released')").bind(a.companyId, w.id).first<{ n: number }>();
    if (routed?.n) badState(`${w.code} is used by ${routed.n} routing operation${routed.n === 1 ? '' : 's'} in a draft or released routing`);
  }
  const diff = changed(w, next);
  if (!diff.any) return c.json(workCentreDTO(w));
  const t = now();
  await db.batch([
    db
      .prepare(
        `UPDATE erp_work_centres SET code = ?, name = ?, description = ?, status = ?, working_days = ?, hours_per_day = ?, efficiency_pct = ?, machines = ?, labour_rate_cents = ?, machine_rate_cents = ?, overhead_rate_cents = ?, overhead_pct = ?, archived_at = ?, search = ?, updated_at = ?
          WHERE company_id = ? AND id = ?`,
      )
      .bind(next.code, next.name, next.description, next.status, next.working_days, next.hours_per_day, next.efficiency_pct, next.machines, next.labour_rate_cents, next.machine_rate_cents, next.overhead_rate_cents, next.overhead_pct, next.archived_at, searchText(next.code, next.name, next.description), t, a.companyId, w.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'work_centre.changed', entityType: 'work_centre', entityId: w.id, summary: `Work centre ${next.code} changed`, before: diff.before, after: diff.after, at: t }),
  ]);
  return c.json(workCentreDTO(await loadWorkCentre(db, a.companyId, w.id)));
});

/** A Maintenance asset of this company (for a machine link), or 400. */
async function checkAsset(db: D1Database, companyId: string, assetId: string | null | undefined) {
  if (!assetId) return null;
  const r = await db.prepare('SELECT id FROM mt_assets WHERE company_id = ? AND id = ?').bind(companyId, assetId).first<{ id: string }>();
  if (!r) throw new HttpError(400, 'Choose a Maintenance asset of this company');
  return r.id;
}

const zMachine = z.object({
  workCentreId: zId,
  code: zCode,
  name: zText(200).min(1, 'Give the machine a name'),
  status: z.enum(['active', 'inactive']).optional(),
  machineRateCents: zMoney.optional(),
  assetId: zId.nullable().optional(),
  notes: zText(2000).optional(),
});

manufacturingRoutes.get('/c/:company/mfg-assets', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const rows = await c.env.DB.prepare("SELECT id, number, name, status FROM mt_assets WHERE company_id = ? AND status <> 'disposed' ORDER BY number COLLATE NOCASE LIMIT 1000").bind(a.companyId).all<any>();
  return c.json({ assets: rows.results.map((r) => ({ id: r.id, number: r.number, name: r.name, status: r.status })) });
});

manufacturingRoutes.post('/c/:company/machines', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const input = await body(c, zMachine);
  const w = await loadWorkCentre(db, a.companyId, input.workCentreId);
  if (w.archived_at) throw new HttpError(400, `${w.code} is archived`);
  if (await db.prepare('SELECT 1 FROM erp_machines WHERE company_id = ? AND code = ?').bind(a.companyId, input.code).first()) throw new HttpError(409, `A machine ${input.code} already exists`);
  const asset = await checkAsset(db, a.companyId, input.assetId);
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare('INSERT INTO erp_machines (id, company_id, work_centre_id, code, name, status, machine_rate_cents, asset_id, notes, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, w.id, input.code, input.name, input.status ?? 'active', input.machineRateCents ?? null, asset, input.notes ?? '', a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'machine.created', entityType: 'work_centre', entityId: w.id, summary: `Machine ${input.code} ${input.name} added to ${w.code}${asset ? ' (linked to a Maintenance asset)' : ''}`, at: t }),
  ]);
  const m = await db.prepare('SELECT m.*, ? AS wc_code FROM erp_machines m WHERE m.company_id = ? AND m.id = ?').bind(w.code, a.companyId, id).first<any>();
  return c.json(machineDTO(m, await assetStates(db, a.companyId, [m.asset_id])), 201);
});

manufacturingRoutes.patch('/c/:company/machines/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const m = await db.prepare('SELECT m.*, w.code AS wc_code FROM erp_machines m JOIN erp_work_centres w ON w.company_id = m.company_id AND w.id = m.work_centre_id WHERE m.company_id = ? AND m.id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!m) throw notFound('Machine');
  const input = await body(c, zMachine.partial().extend({ archived: z.boolean().optional() }));
  if (input.workCentreId && input.workCentreId !== m.work_centre_id) await loadWorkCentre(db, a.companyId, input.workCentreId);
  if (input.code && input.code.toLowerCase() !== m.code.toLowerCase() && (await db.prepare('SELECT 1 FROM erp_machines WHERE company_id = ? AND code = ? AND id <> ?').bind(a.companyId, input.code, m.id).first())) throw new HttpError(409, `A machine ${input.code} already exists`);
  const next = {
    work_centre_id: input.workCentreId ?? m.work_centre_id,
    code: input.code ?? m.code,
    name: input.name ?? m.name,
    status: input.status ?? m.status,
    machine_rate_cents: input.machineRateCents !== undefined ? input.machineRateCents : m.machine_rate_cents,
    asset_id: input.assetId !== undefined ? await checkAsset(db, a.companyId, input.assetId) : m.asset_id,
    notes: input.notes ?? m.notes,
    archived_at: input.archived === undefined ? m.archived_at : input.archived ? m.archived_at ?? now() : null,
  };
  const diff = changed(m, next);
  if (diff.any) {
    const t = now();
    await db.batch([
      db
        .prepare('UPDATE erp_machines SET work_centre_id = ?, code = ?, name = ?, status = ?, machine_rate_cents = ?, asset_id = ?, notes = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?')
        .bind(next.work_centre_id, next.code, next.name, next.status, next.machine_rate_cents, next.asset_id, next.notes, next.archived_at, t, a.companyId, m.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'machine.changed', entityType: 'work_centre', entityId: next.work_centre_id, summary: `Machine ${next.code} changed`, before: diff.before, after: diff.after, at: t }),
    ]);
  }
  const fresh = await db.prepare('SELECT m.*, w.code AS wc_code FROM erp_machines m JOIN erp_work_centres w ON w.company_id = m.company_id AND w.id = m.work_centre_id WHERE m.company_id = ? AND m.id = ?').bind(a.companyId, m.id).first<any>();
  return c.json(machineDTO(fresh, await assetStates(db, a.companyId, [fresh.asset_id])));
});

// ------------------------------------------------------------------ routings

export function routingDTO(r: any) {
  return {
    id: r.id,
    productId: r.product_id,
    productNumber: r.product_number ?? null,
    productName: r.product_name ?? null,
    revision: r.revision,
    status: r.status,
    statusLabel: label(ROUTING_STATUS, r.status),
    description: r.description,
    leadTimeDays: r.lead_time_days,
    copiedFrom: r.copied_from,
    releasedByName: r.released_by_name ?? null,
    releasedAt: r.released_at,
    releaseNote: r.release_note,
    sodException: !!r.sod_exception,
    supersededAt: r.superseded_at,
    createdBy: r.created_by,
    createdByName: r.created_by_name ?? null,
    operationCount: r.op_count ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function operationDTO(o: any) {
  return {
    id: o.id,
    opNo: o.op_no,
    name: o.name,
    instructions: o.instructions,
    workCentreId: o.work_centre_id,
    workCentreCode: o.wc_code ?? null,
    workCentreName: o.wc_name ?? null,
    machineId: o.machine_id,
    machineCode: o.machine_code ?? null,
    setupMinutes: o.setup_minutes,
    runMinutes: o.run_minutes,
    crew: o.crew,
    inspection: !!o.inspection,
    inspectionNote: o.inspection_note,
    outsourced: !!o.outsourced,
    supplierId: o.supplier_id,
    supplierName: o.supplier_name ?? null,
    outsourceCostCents: o.outsource_cost_cents,
    outsourceDays: o.outsource_days,
    predecessors: parseJson<number[] | null>(o.predecessors, null),
    overlap: !!o.overlap,
  };
}

const ROUTING_SELECT = `SELECT r.*, p.number AS product_number, p.name AS product_name, rb.name AS released_by_name, cb.name AS created_by_name,
  (SELECT COUNT(*) FROM erp_routing_operations o WHERE o.company_id = r.company_id AND o.routing_id = r.id) AS op_count
  FROM erp_routings r JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id
  LEFT JOIN users rb ON rb.id = r.released_by LEFT JOIN users cb ON cb.id = r.created_by`;

export const OP_SELECT = (table: 'erp_routing_operations' | 'erp_mo_operations') => `SELECT o.*, w.code AS wc_code, w.name AS wc_name, m.code AS machine_code, s.legal_name AS supplier_name
  FROM ${table} o LEFT JOIN erp_work_centres w ON w.company_id = o.company_id AND w.id = o.work_centre_id
  LEFT JOIN erp_machines m ON m.company_id = o.company_id AND m.id = o.machine_id LEFT JOIN erp_suppliers s ON s.company_id = o.company_id AND s.id = o.supplier_id`;

export async function loadRouting(db: D1Database, companyId: string, id: string) {
  const r = await db.prepare(`${ROUTING_SELECT} WHERE r.company_id = ? AND r.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!r) throw notFound('Routing');
  return r;
}

export async function routingOps(db: D1Database, companyId: string, routingId: string) {
  return (await db.prepare(`${OP_SELECT('erp_routing_operations')} WHERE o.company_id = ? AND o.routing_id = ? ORDER BY o.op_no`).bind(companyId, routingId).all<any>()).results;
}

/** The operations an operation waits for: its own list, or (none given) the operation numbered just before it. */
export function predecessorsOf(op: { op_no: number; predecessors: string | null }, all: { op_no: number }[]): number[] {
  const own = parseJson<number[] | null>(op.predecessors, null);
  if (own) return own;
  const before = all.filter((o) => o.op_no < op.op_no).map((o) => o.op_no);
  return before.length ? [Math.max(...before)] : [];
}

const nextRevision = (labels: string[]) => {
  const letters = labels.filter((l) => /^[A-Z]{1,2}$/i.test(l)).map((l) => l.toUpperCase());
  const toN = (s: string) => s.split('').reduce((n, ch) => n * 26 + (ch.charCodeAt(0) - 64), 0);
  let n = letters.length ? Math.max(...letters.map(toN)) + 1 : labels.length + 1;
  let out = '';
  while (n > 0) {
    const m = (n - 1) % 26;
    out = String.fromCharCode(65 + m) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
};

/** Starts a draft routing revision of a product (a copy of `copyFrom` when given). One draft per product at a time. */
async function startRouting(db: D1Database, a: ErpAccess, productId: string, opts: { description?: string; leadTimeDays?: number | null; copyFrom?: any }) {
  const p = await loadProduct(db, a.companyId, productId);
  if (p.archived_at) throw new HttpError(409, `${p.number} is archived`);
  if (p.type === 'service') throw new HttpError(400, `${p.number} is a service: services have no routing`);
  const all = await db.prepare('SELECT id, revision, status FROM erp_routings WHERE company_id = ? AND product_id = ?').bind(a.companyId, p.id).all<{ id: string; revision: string; status: string }>();
  const draft = all.results.find((r) => r.status === 'draft');
  if (draft) badState(`${p.number} already has a draft routing (revision ${draft.revision}). Release or delete it first.`);
  const revision = nextRevision(all.results.map((r) => r.revision));
  const id = newId();
  const t = now();
  const src = opts.copyFrom;
  const stmts = [
    db
      .prepare('INSERT INTO erp_routings (id, company_id, product_id, revision, status, description, lead_time_days, copied_from, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, p.id, revision, 'draft', opts.description ?? src?.description ?? '', opts.leadTimeDays !== undefined ? opts.leadTimeDays : src?.lead_time_days ?? null, src?.id ?? null, a.userId, t, t),
  ];
  if (src) {
    stmts.push(
      db
        .prepare(
          `INSERT INTO erp_routing_operations (id, company_id, routing_id, op_no, name, instructions, work_centre_id, machine_id, setup_minutes, run_minutes, crew, inspection, inspection_note, outsourced, supplier_id, outsource_cost_cents, outsource_days, predecessors, overlap)
           SELECT lower(hex(randomblob(12))), company_id, ?, op_no, name, instructions, work_centre_id, machine_id, setup_minutes, run_minutes, crew, inspection, inspection_note, outsourced, supplier_id, outsource_cost_cents, outsource_days, predecessors, overlap
             FROM erp_routing_operations WHERE company_id = ? AND routing_id = ?`,
        )
        .bind(id, a.companyId, src.id),
    );
  }
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'routing.created', entityType: 'routing', entityId: id, productId: p.id, summary: `Routing revision ${revision} of ${p.number} started${src ? ` as a copy of revision ${src.revision}` : ''}`, at: t }));
  await db.batch(stmts);
  return { id, revision };
}

manufacturingRoutes.get('/c/:company/routings', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const where = ['r.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const qp = (k: string) => c.req.query(k)?.trim();
  if (qp('productId')) {
    where.push('r.product_id = ?');
    args.push(qp('productId'));
  }
  const status = qp('status');
  if (status && isKey(ROUTING_STATUS, status)) {
    where.push('r.status = ?');
    args.push(status);
  } else if (!status) where.push("r.status IN ('draft','released')");
  if (qp('q')) {
    where.push('(p.number LIKE ? OR lower(p.name) LIKE ? OR lower(r.description) LIKE ?)');
    const l = likeOf(qp('q')!);
    args.push(l, l, l);
  }
  const rows = await db.prepare(`${ROUTING_SELECT} WHERE ${where.join(' AND ')} ORDER BY p.number COLLATE NOCASE, r.created_at DESC LIMIT 1000`).bind(...args).all<any>();
  const list = rows.results.map(routingDTO);
  if (wantsCsv(c)) return csvResponse('routings', [['Product', 'Name', 'Revision', 'Status', 'Operations', 'Lead time (days)', 'Released'], ...list.map((r) => [r.productNumber, r.productName, r.revision, r.statusLabel, r.operationCount ?? 0, r.leadTimeDays ?? '', r.releasedAt ? new Date(r.releasedAt).toISOString().slice(0, 10) : ''])]);
  return c.json({ routings: list, can: { setup: can(a, 'manufacturing.setup'), release: can(a, 'routings.release') } });
});

manufacturingRoutes.post('/c/:company/routings', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const input = await body(c, z.object({ productId: zId, description: zText(2000).optional(), leadTimeDays: z.number().int().min(0).max(1000).nullable().optional() }));
  return c.json(await startRouting(c.env.DB, a, input.productId, input), 201);
});

manufacturingRoutes.get('/c/:company/routings/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.view');
  const db = c.env.DB;
  const r = await loadRouting(db, a.companyId, c.req.param('id'));
  const ops = await routingOps(db, a.companyId, r.id);
  const others = await db.prepare('SELECT id, revision, status, released_at FROM erp_routings WHERE company_id = ? AND product_id = ? ORDER BY created_at DESC').bind(a.companyId, r.product_id).all<any>();
  const centres = new Map((await db.prepare('SELECT * FROM erp_work_centres WHERE company_id = ?').bind(a.companyId).all<any>()).results.map((w) => [w.id, w]));
  const machines = new Map((await db.prepare('SELECT id, machine_rate_cents FROM erp_machines WHERE company_id = ?').bind(a.companyId).all<any>()).results.map((m) => [m.id, m]));
  const perUnit = estimateOps(ops, 1, centres, machines);
  return c.json({
    routing: routingDTO(r),
    operations: ops.map((o) => ({ ...operationDTO(o), effectivePredecessors: predecessorsOf(o, ops) })),
    revisions: others.results.map((x) => ({ id: x.id, revision: x.revision, status: x.status, statusLabel: label(ROUTING_STATUS, x.status), releasedAt: x.released_at })),
    estimate: { quantity: 1, ...perUnit, note: 'For one unit: set-up time is spread over the order quantity on a manufacturing order.' },
    files: await recordFiles(db, a.companyId, 'routing', r.id),
    history: await historyOf(db, a.companyId, { entityType: 'routing', entityId: r.id }),
    can: {
      edit: r.status === 'draft' && can(a, 'manufacturing.setup'),
      release: r.status === 'draft' && can(a, 'routings.release') && (r.created_by !== a.userId || a.solo),
      copy: can(a, 'manufacturing.setup'),
    },
  });
});

manufacturingRoutes.patch('/c/:company/routings/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const r = await loadRouting(db, a.companyId, c.req.param('id'));
  if (r.status !== 'draft') badState(`Revision ${r.revision} is ${r.status} and locked. Copy it to a new draft to change it.`);
  const input = await body(c, z.object({ description: zText(2000).optional(), leadTimeDays: z.number().int().min(0).max(1000).nullable().optional() }));
  const next = { description: input.description ?? r.description, lead_time_days: input.leadTimeDays !== undefined ? input.leadTimeDays : r.lead_time_days };
  const diff = changed(r, next);
  if (diff.any) {
    const t = now();
    await db.batch([
      db.prepare("UPDATE erp_routings SET description = ?, lead_time_days = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'").bind(next.description, next.lead_time_days, t, a.companyId, r.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'routing.changed', entityType: 'routing', entityId: r.id, productId: r.product_id, summary: `Routing revision ${r.revision} of ${r.product_number} changed`, before: diff.before, after: diff.after, at: t }),
    ]);
  }
  return c.json(routingDTO(await loadRouting(db, a.companyId, r.id)));
});

manufacturingRoutes.delete('/c/:company/routings/:id', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const r = await loadRouting(db, a.companyId, c.req.param('id'));
  if (r.status !== 'draft') badState('Only a draft routing can be deleted; a released one is superseded by the next release');
  const t = now();
  await db.batch([
    db.prepare("DELETE FROM erp_routings WHERE company_id = ? AND id = ? AND status = 'draft'").bind(a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'routing.deleted', entityType: 'routing', entityId: r.id, productId: r.product_id, summary: `Draft routing revision ${r.revision} of ${r.product_number} deleted`, at: t }),
  ]);
  return c.json({ ok: true });
});

manufacturingRoutes.post('/c/:company/routings/:id/copy', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const r = await loadRouting(db, a.companyId, c.req.param('id'));
  return c.json(await startRouting(db, a, r.product_id, { copyFrom: r }), 201);
});

const zOperation = z.object({
  opNo: z.number().int().min(1).max(9999).optional(),
  name: zText(200).min(1, 'Name the operation'),
  instructions: zText(4000).optional(),
  workCentreId: zId.nullable().optional(),
  machineId: zId.nullable().optional(),
  setupMinutes: z.number().min(0).max(100000).optional(),
  runMinutes: z.number().min(0).max(100000).optional(),
  crew: z.number().min(0).max(100).optional(),
  inspection: z.boolean().optional(),
  inspectionNote: zText(1000).optional(),
  outsourced: z.boolean().optional(),
  supplierId: zId.nullable().optional(),
  outsourceCostCents: zMoney.optional(),
  outsourceDays: z.number().int().min(0).max(1000).nullable().optional(),
  predecessors: z.array(z.number().int().min(1).max(9999)).max(50).nullable().optional(),
  overlap: z.boolean().optional(),
});

/** Checks an operation against its routing: its work centre, machine, supplier and predecessors (lower numbers only). */
async function checkOperation(db: D1Database, companyId: string, routingId: string, op: { op_no: number; work_centre_id: string | null; machine_id: string | null; outsourced: number; supplier_id: string | null; predecessors: number[] | null }, selfId?: string) {
  if (op.outsourced) {
    if (!op.supplier_id) throw new HttpError(400, 'An outsourced operation needs its supplier');
    const s = await db.prepare('SELECT status, archived_at FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(companyId, op.supplier_id).first<any>();
    if (!s) throw new HttpError(400, 'Choose a supplier of this company');
  } else if (!op.work_centre_id) throw new HttpError(400, 'Choose the work centre of the operation');
  if (op.work_centre_id) {
    const w = await loadWorkCentre(db, companyId, op.work_centre_id).catch(() => null);
    if (!w || w.archived_at) throw new HttpError(400, 'Choose an open work centre of this company');
  }
  if (op.machine_id) {
    const m = await db.prepare('SELECT work_centre_id, archived_at FROM erp_machines WHERE company_id = ? AND id = ?').bind(companyId, op.machine_id).first<any>();
    if (!m || m.archived_at) throw new HttpError(400, 'Choose a machine of this company');
    if (op.work_centre_id && m.work_centre_id !== op.work_centre_id) throw new HttpError(400, 'The machine belongs to another work centre');
  }
  const others = (await db.prepare('SELECT id, op_no FROM erp_routing_operations WHERE company_id = ? AND routing_id = ?').bind(companyId, routingId).all<{ id: string; op_no: number }>()).results.filter((o) => o.id !== selfId);
  if (others.some((o) => o.op_no === op.op_no)) throw new HttpError(409, `Operation ${op.op_no} already exists in this routing`);
  for (const p of op.predecessors ?? []) {
    if (p >= op.op_no) throw new HttpError(400, `Operation ${op.op_no} can only wait for operations numbered before it`);
    if (!others.some((o) => o.op_no === p)) throw new HttpError(400, `There is no operation ${p} in this routing`);
  }
}

async function draftRouting(db: D1Database, a: ErpAccess, id: string) {
  const r = await loadRouting(db, a.companyId, id);
  if (r.status !== 'draft') badState(`Revision ${r.revision} of ${r.product_number} is ${r.status} and locked. Copy it to a new draft to change it.`);
  return r;
}

manufacturingRoutes.post('/c/:company/routings/:id/operations', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const r = await draftRouting(db, a, c.req.param('id'));
  const input = await body(c, zOperation);
  const max = await db.prepare('SELECT MAX(op_no) AS m FROM erp_routing_operations WHERE company_id = ? AND routing_id = ?').bind(a.companyId, r.id).first<{ m: number | null }>();
  const opNo = input.opNo ?? (Math.floor(Number(max?.m ?? 0) / 10) + 1) * 10;
  const op = {
    op_no: opNo,
    work_centre_id: input.outsourced ? input.workCentreId ?? null : input.workCentreId ?? null,
    machine_id: input.machineId ?? null,
    outsourced: input.outsourced ? 1 : 0,
    supplier_id: input.outsourced ? input.supplierId ?? null : null,
    predecessors: input.predecessors ?? null,
  };
  await checkOperation(db, a.companyId, r.id, op);
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_routing_operations (id, company_id, routing_id, op_no, name, instructions, work_centre_id, machine_id, setup_minutes, run_minutes, crew, inspection, inspection_note, outsourced, supplier_id, outsource_cost_cents, outsource_days, predecessors, overlap)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.companyId, r.id, opNo, input.name, input.instructions ?? '', op.work_centre_id, op.machine_id, input.setupMinutes ?? 0, input.runMinutes ?? 0, input.crew ?? 1, input.inspection ? 1 : 0, input.inspectionNote ?? '', op.outsourced, op.supplier_id, op.outsourced ? input.outsourceCostCents ?? null : null, op.outsourced ? input.outsourceDays ?? null : null, op.predecessors ? JSON.stringify(op.predecessors) : null, input.overlap ? 1 : 0),
    db.prepare('UPDATE erp_routings SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'routing.operation_added', entityType: 'routing', entityId: r.id, productId: r.product_id, summary: `Operation ${opNo} ${input.name} added to routing revision ${r.revision} of ${r.product_number}`, at: t }),
  ]);
  return c.json({ id, opNo }, 201);
});

manufacturingRoutes.patch('/c/:company/routings/:id/operations/:opId', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const r = await draftRouting(db, a, c.req.param('id'));
  const o = await db.prepare('SELECT * FROM erp_routing_operations WHERE company_id = ? AND routing_id = ? AND id = ?').bind(a.companyId, r.id, c.req.param('opId')).first<any>();
  if (!o) throw notFound('Operation');
  const input = await body(c, zOperation.partial());
  const outsourced = input.outsourced !== undefined ? (input.outsourced ? 1 : 0) : o.outsourced;
  const next = {
    op_no: input.opNo ?? o.op_no,
    name: input.name ?? o.name,
    instructions: input.instructions ?? o.instructions,
    work_centre_id: input.workCentreId !== undefined ? input.workCentreId : o.work_centre_id,
    machine_id: input.machineId !== undefined ? input.machineId : o.machine_id,
    setup_minutes: input.setupMinutes ?? o.setup_minutes,
    run_minutes: input.runMinutes ?? o.run_minutes,
    crew: input.crew ?? o.crew,
    inspection: input.inspection !== undefined ? (input.inspection ? 1 : 0) : o.inspection,
    inspection_note: input.inspectionNote ?? o.inspection_note,
    outsourced,
    supplier_id: outsourced ? (input.supplierId !== undefined ? input.supplierId : o.supplier_id) : null,
    outsource_cost_cents: outsourced ? (input.outsourceCostCents !== undefined ? input.outsourceCostCents : o.outsource_cost_cents) : null,
    outsource_days: outsourced ? (input.outsourceDays !== undefined ? input.outsourceDays : o.outsource_days) : null,
    predecessors: input.predecessors !== undefined ? (input.predecessors ? JSON.stringify(input.predecessors) : null) : o.predecessors,
    overlap: input.overlap !== undefined ? (input.overlap ? 1 : 0) : o.overlap,
  };
  await checkOperation(db, a.companyId, r.id, { ...next, predecessors: parseJson<number[] | null>(next.predecessors, null) }, o.id);
  if (next.op_no !== o.op_no) {
    const refs = (await routingOps(db, a.companyId, r.id)).filter((x) => x.id !== o.id && parseJson<number[] | null>(x.predecessors, null)?.includes(o.op_no));
    if (refs.length) badState(`Operation ${refs[0].op_no} waits for operation ${o.op_no}: change it first`);
  }
  const diff = changed(o, next);
  if (diff.any) {
    const t = now();
    await db.batch([
      db
        .prepare(
          `UPDATE erp_routing_operations SET op_no = ?, name = ?, instructions = ?, work_centre_id = ?, machine_id = ?, setup_minutes = ?, run_minutes = ?, crew = ?, inspection = ?, inspection_note = ?, outsourced = ?, supplier_id = ?, outsource_cost_cents = ?, outsource_days = ?, predecessors = ?, overlap = ?
            WHERE company_id = ? AND id = ?`,
        )
        .bind(next.op_no, next.name, next.instructions, next.work_centre_id, next.machine_id, next.setup_minutes, next.run_minutes, next.crew, next.inspection, next.inspection_note, next.outsourced, next.supplier_id, next.outsource_cost_cents, next.outsource_days, next.predecessors, next.overlap, a.companyId, o.id),
      db.prepare('UPDATE erp_routings SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, r.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'routing.operation_changed', entityType: 'routing', entityId: r.id, productId: r.product_id, summary: `Operation ${next.op_no} of routing revision ${r.revision} changed`, before: diff.before, after: diff.after, at: t }),
    ]);
  }
  return c.json({ ok: true });
});

manufacturingRoutes.delete('/c/:company/routings/:id/operations/:opId', async (c) => {
  const a = await requireErp(c, 'manufacturing.setup');
  const db = c.env.DB;
  const r = await draftRouting(db, a, c.req.param('id'));
  const ops = await routingOps(db, a.companyId, r.id);
  const o = ops.find((x) => x.id === c.req.param('opId'));
  if (!o) throw notFound('Operation');
  const refs = ops.filter((x) => x.id !== o.id && parseJson<number[] | null>(x.predecessors, null)?.includes(o.op_no));
  if (refs.length) badState(`Operation ${refs[0].op_no} waits for operation ${o.op_no}: change it first`);
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM erp_routing_operations WHERE company_id = ? AND id = ?').bind(a.companyId, o.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'routing.operation_removed', entityType: 'routing', entityId: r.id, productId: r.product_id, summary: `Operation ${o.op_no} ${o.name} removed from routing revision ${r.revision}`, at: t }),
  ]);
  return c.json({ ok: true });
});

manufacturingRoutes.post('/c/:company/routings/:id/release', async (c) => {
  const a = await requireErp(c, 'routings.release');
  const db = c.env.DB;
  const r = await loadRouting(db, a.companyId, c.req.param('id'));
  if (r.status !== 'draft') badState(`Revision ${r.revision} is already ${r.status}`);
  const input = await body(c, z.object({ note: zText(2000).optional() }));
  const sod = segregation(a, r.created_by, 'drafted this routing');
  const ops = await routingOps(db, a.companyId, r.id);
  if (!ops.length) badState('Add at least one operation before releasing the routing');
  for (const o of ops) {
    if (!o.outsourced && (!o.work_centre_id || !o.wc_code)) badState(`Operation ${o.op_no} has no work centre`);
  }
  const old = await db.prepare("SELECT id, revision FROM erp_routings WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(a.companyId, r.product_id).first<{ id: string; revision: string }>();
  const t = now();
  const stillDraft = 'EXISTS (SELECT 1 FROM erp_routings WHERE company_id = ? AND id = ? AND status = ?)';
  const res = await db.batch([
    // the earlier released revision is superseded only while this one is still a draft, so a second release at the same
    // moment changes nothing
    db
      .prepare(`UPDATE erp_routings SET status = 'superseded', superseded_by = ?, superseded_at = ?, updated_at = ? WHERE company_id = ? AND product_id = ? AND status = 'released' AND ${stillDraft}`)
      .bind(r.id, t, t, a.companyId, r.product_id, a.companyId, r.id, 'draft'),
    db
      .prepare("UPDATE erp_routings SET status = 'released', released_by = ?, released_at = ?, release_note = ?, sod_exception = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'")
      .bind(a.userId, t, input.note ?? '', sod ? 1 : 0, t, a.companyId, r.id),
    eventStmtIf(
      db,
      {
        companyId: a.companyId,
        actorId: a.userId,
        action: 'routing.released',
        entityType: 'routing',
        entityId: r.id,
        productId: r.product_id,
        summary: `Routing revision ${r.revision} of ${r.product_number} released${old ? `; revision ${old.revision} superseded` : ''}${sod ? ' (company of one: the author released it, recorded exception)' : ''}`,
        after: { note: input.note ?? '', sodException: sod },
        at: t,
      },
      "EXISTS (SELECT 1 FROM erp_routings WHERE company_id = ? AND id = ? AND status = 'released' AND released_at = ?)",
      [a.companyId, r.id, t],
    ),
  ]);
  if (!res[1].meta.changes) badState('This routing was released at the same moment by someone else');
  return c.json(routingDTO(await loadRouting(db, a.companyId, r.id)));
});

// ------------------------------------------------------------------ estimates from operations

export interface OpEstimate {
  labourCents: number;
  machineCents: number;
  outsourceCents: number;
  overheadCents: number;
  labourHours: number;
  machineHours: number;
}

/** Hours of an operation for a quantity: set-up plus run time per unit, in hours. */
export const opHours = (o: { setup_minutes: number; run_minutes: number }, qty: number) => (Number(o.setup_minutes) + Number(o.run_minutes) * qty) / 60;

/**
 * Estimated conversion cost of operations for a quantity: labour = hours x crew x the work centre's labour rate;
 * machine = hours x the machine's rate (else the work centre's); outsourced operations cost their estimate per unit
 * times the quantity (and no labour or machine); overheads = labour hours x the overhead rate, or the overhead
 * percentage of labour and machine cost. Each element is rounded to the cent once, at the end.
 */
export function estimateOps(ops: any[], qty: number, centres: Map<string, any>, machines: Map<string, any>): OpEstimate {
  let labour = 0;
  let machine = 0;
  let outsource = 0;
  let overhead = 0;
  let labourHours = 0;
  let machineHours = 0;
  for (const o of ops) {
    if (o.outsourced) {
      outsource += Number(o.outsource_cost_cents ?? 0) * qty;
      continue;
    }
    const w = centres.get(o.work_centre_id);
    if (!w) continue;
    const h = opHours(o, qty);
    const lh = h * Number(o.crew);
    const l = lh * w.labour_rate_cents;
    const mRate = o.machine_id ? machines.get(o.machine_id)?.machine_rate_cents ?? w.machine_rate_cents : w.machine_rate_cents;
    const m = mRate ? h * mRate : 0;
    labour += l;
    machine += m;
    labourHours += lh;
    if (mRate) machineHours += h;
    overhead += lh * w.overhead_rate_cents + ((l + m) * w.overhead_pct) / 100;
  }
  return { labourCents: Math.round(labour), machineCents: Math.round(machine), outsourceCents: Math.round(outsource), overheadCents: Math.round(overhead), labourHours: Math.round(labourHours * 1000) / 1000, machineHours: Math.round(machineHours * 1000) / 1000 };
}
