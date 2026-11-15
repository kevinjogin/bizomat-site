// Parts, labour and downtime on a work order (stage M3), under /api/maintenance/c/:company/work-orders/:id/...
//
//   Parts    issued from a maintenance store (an ERP warehouse marked as one) and returned to it through ERP Inventory's
//            StockOps, in one transaction with the movement in the ledger (maintenance_issue, maintenance_return, source
//            work_order): no second stock system. Stock can never go below zero, so two people issuing the last unit at
//            the same moment cannot both succeed. The parts cost is the ledger's value of those movements; its posting to
//            Finance is recorded as planned, as in Releases 2 and 3 (nothing is posted). The assigned technician issues
//            to their own work orders, supervisors and administrators to any. StockOps needs an ERP access: it is
//            resolved for the same person and company (loadErpAccess); no ERP role is given or needed.
//   Labour   Stage 1's timer, plus time entered by hand; each line is priced when recorded (routes-setup.ts).
//   Downtime when the asset was down, for the reliability reports.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { loadErpAccess } from '../erp/access';
import { loadSettings } from '../erp/settings';
import { StockOps, currentUnitCost, q6, runStock } from '../erp/stock';
import { stockKey } from '../erp/inventory';
import { assertPerson, deny, isManager, requireMt, type MtAccess } from './access';
import { assertUnlocked, canWork, loadWorkOrder } from './routes-work';
import { eventStmt, validDate, zId, zText } from './util';
import { priceLabourStmt } from './routes-setup';
import { doneStmt, utcDate } from './m2util';
import { inspectionsOf } from './routes-inspections';

export const partsRoutes = new Hono<AppEnv>();

const zQ = z.number().positive().max(1e9);
const zKey = z.string().trim().min(8).max(80).optional();
const line = z.object({ productId: zId, locationId: zId, lot: zText(80).optional(), serial: zText(80).optional(), quantity: zQ });

async function workable(c: any) {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB as D1Database;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  if (!canWork(a, w)) deny('Only the assigned technician, a supervisor or an administrator can do this on this work order');
  assertUnlocked(w);
  return { a, w, db };
}

/** The location must be in a maintenance store and outside quarantine. */
async function storeLocation(db: D1Database, companyId: string, locationId: string, n: number) {
  const l = await db
    .prepare('SELECT l.kind, l.code, w.code AS wh, (SELECT 1 FROM mt_stores s WHERE s.company_id = w.company_id AND s.warehouse_id = w.id) AS store FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.id = ?')
    .bind(companyId, locationId)
    .first<{ kind: string; code: string; wh: string; store: number | null }>();
  if (!l) throw new HttpError(400, `Line ${n}: choose a location of this company`);
  if (!l.store) throw new HttpError(400, `Line ${n}: ${l.wh}/${l.code} is not in a maintenance store. An administrator marks warehouses as maintenance stores in Maintenance settings.`);
  if (l.kind === 'quarantine') throw new HttpError(400, `Line ${n}: stock in quarantine cannot be issued or returned here`);
}

partsRoutes.post('/c/:company/work-orders/:id/stock/issue', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ lines: z.array(line).min(1).max(50), requestKey: zKey }));
  const erp = await loadErpAccess(db, a.companyId, c.get('user'));
  const ops = new StockOps(db, erp, await loadSettings(db, a.companyId));
  const before: D1PreparedStatement[] = input.requestKey ? [doneStmt(db, a.companyId, `wo-issue:${input.requestKey}`, ops.t)] : [];
  const after: D1PreparedStatement[] = [];
  const summary: string[] = [];
  for (const [i, x] of input.lines.entries()) {
    await storeLocation(db, a.companyId, x.locationId, i + 1);
    const { p, l, key } = await stockKey(db, a.companyId, { productId: x.productId, locationId: x.locationId, lot: x.lot, serial: x.serial }, { incoming: false, quantity: x.quantity });
    await ops.takeOut('maintenance_issue', key, x.quantity, { source: 'work_order', sourceId: w.id, reference: w.number, reason: `Issued to ${w.number}` });
    after.push(
      db
        .prepare('INSERT INTO mt_wo_stock (company_id, work_order_id, product_id, issued_qty, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id, work_order_id, product_id) DO UPDATE SET issued_qty = round(issued_qty + excluded.issued_qty, 6), updated_at = excluded.updated_at')
        .bind(a.companyId, w.id, p.id, x.quantity, ops.t),
    );
    summary.push(`${x.quantity} ${p.uom} of ${p.number} ${p.name} from ${l.warehouse_code}/${l.code}${key.lot ? ` lot ${key.lot}` : ''}${key.serial ? ` serial ${key.serial}` : ''}`);
  }
  after.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'parts.issued', assetId: w.asset_id, workOrderId: w.id, summary: `Parts issued: ${summary.join('; ')}`.slice(0, 500), after: { groupId: ops.groupId, lines: input.lines }, at: ops.t }));
  await runStock(db, ops.all(before, after, { type: 'work_order', id: w.id, kind: 'finance.maintenance_posting' }));
  return c.json({ ok: true, groupId: ops.groupId }, 201);
});

/** The average cost at which the work order took a product (issued less returned), for a return; else its cost now. */
async function issuedUnitCost(db: D1Database, companyId: string, woId: string, productId: string) {
  const r = await db
    .prepare("SELECT COALESCE(SUM(-value_delta_cents), 0) AS v, COALESCE(SUM(-on_hand_delta), 0) AS q FROM erp_stock_moves WHERE company_id = ? AND source_type = 'work_order' AND source_id = ? AND product_id = ? AND move_type IN ('maintenance_issue','maintenance_return')")
    .bind(companyId, woId, productId)
    .first<{ v: number; q: number }>();
  return r && r.q > 1e-9 ? r.v / r.q : currentUnitCost(db, companyId, productId);
}

partsRoutes.post('/c/:company/work-orders/:id/stock/return', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ lines: z.array(line.extend({ expiry: z.string().optional() })).min(1).max(50), reason: zText(500).optional(), requestKey: zKey }));
  const issued = new Map(((await db.prepare('SELECT product_id, issued_qty FROM mt_wo_stock WHERE company_id = ? AND work_order_id = ?').bind(a.companyId, w.id).all<{ product_id: string; issued_qty: number }>()).results).map((r) => [r.product_id, r.issued_qty]));
  const erp = await loadErpAccess(db, a.companyId, c.get('user'));
  const ops = new StockOps(db, erp, await loadSettings(db, a.companyId));
  const before: D1PreparedStatement[] = input.requestKey ? [doneStmt(db, a.companyId, `wo-return:${input.requestKey}`, ops.t)] : [];
  const after: D1PreparedStatement[] = [];
  const summary: string[] = [];
  for (const [i, x] of input.lines.entries()) {
    const have = issued.get(x.productId) ?? 0;
    if (x.quantity > have + 1e-9) throw new HttpError(400, `Line ${i + 1}: ${q6(have)} of that part is issued to ${w.number}; more cannot come back`);
    issued.set(x.productId, q6(have - x.quantity));
    await storeLocation(db, a.companyId, x.locationId, i + 1);
    const row = await db.prepare('SELECT expiry FROM erp_stock WHERE company_id = ? AND product_id = ? AND location_id = ? AND lot = ? AND serial = ?').bind(a.companyId, x.productId, x.locationId, (x.lot ?? '').trim(), (x.serial ?? '').trim()).first<{ expiry: string | null }>();
    const expiry = (x.expiry && validDate(x.expiry) ? x.expiry : null) ?? row?.expiry ?? null;
    const { p, l, key } = await stockKey(db, a.companyId, { productId: x.productId, locationId: x.locationId, lot: x.lot, serial: x.serial }, { incoming: true, quantity: x.quantity, expiry });
    const unitCost = await issuedUnitCost(db, a.companyId, w.id, p.id);
    await ops.addIn('maintenance_return', key, x.quantity, { source: 'work_order', sourceId: w.id, reference: w.number, reason: input.reason ?? 'Not used', unitCost, expiry });
    // the CHECK on issued_qty refuses returning more than was issued, also when two returns arrive together
    after.push(db.prepare('UPDATE mt_wo_stock SET issued_qty = round(issued_qty - ?, 6), updated_at = ? WHERE company_id = ? AND work_order_id = ? AND product_id = ?').bind(x.quantity, ops.t, a.companyId, w.id, p.id));
    summary.push(`${x.quantity} ${p.uom} of ${p.number} ${p.name} to ${l.warehouse_code}/${l.code}`);
  }
  after.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'parts.returned', assetId: w.asset_id, workOrderId: w.id, summary: `Parts returned: ${summary.join('; ')}`.slice(0, 500), after: { groupId: ops.groupId, lines: input.lines }, at: ops.t }));
  await runStock(db, ops.all(before, after, { type: 'work_order', id: w.id, kind: 'finance.maintenance_posting' }));
  return c.json({ ok: true, groupId: ops.groupId }, 201);
});

// ------------------------------------------------------------------ labour entered by hand

partsRoutes.post('/c/:company/work-orders/:id/labour', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ date: z.string(), minutes: z.number().int().min(1).max(24 * 60), userId: zId.optional(), note: zText(500).optional() }));
  if (!validDate(input.date)) throw new HttpError(400, 'Use a date like 2026-11-14');
  if (input.date > utcDate(now() + 86_400_000)) throw new HttpError(400, 'Time cannot be entered for a future date');
  const userId = input.userId ?? a.userId;
  if (userId !== a.userId) {
    if (!isManager(a)) deny('Only supervisors and administrators enter time for someone else');
    await assertPerson(db, a, userId, 'technician', 'The person');
  }
  const start = Date.parse(`${input.date}T00:00:00Z`);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO mt_labour (id, company_id, work_order_id, user_id, started_at, ended_at, minutes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, w.id, userId, start, start + input.minutes * 60_000, input.minutes, t),
    priceLabourStmt(db, a.companyId, w.id, { labourId: id }, { entry: 'manual', note: input.note, t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'labour.entered', assetId: w.asset_id, workOrderId: w.id, summary: `Time entered: ${input.minutes} min on ${input.date}${userId !== a.userId ? ' for someone else' : ''}${input.note ? ` (${input.note})` : ''}`, after: { labourId: id, userId, date: input.date, minutes: input.minutes }, at: t }),
  ]);
  return c.json({ id }, 201);
});

partsRoutes.delete('/c/:company/work-orders/:id/labour/:labourId', async (c) => {
  const { a, w, db } = await workable(c);
  const l = await db.prepare("SELECT l.*, k.entry, k.entered_by FROM mt_labour l JOIN mt_labour_costs k ON k.labour_id = l.id WHERE l.company_id = ? AND l.work_order_id = ? AND l.id = ? AND k.entry = 'manual'").bind(a.companyId, w.id, c.req.param('labourId')).first<any>();
  if (!l) throw notFound('Time entry');
  if (!isManager(a) && l.user_id !== a.userId) deny('You can remove only your own time entries');
  await db.batch([
    db.prepare('DELETE FROM mt_labour_costs WHERE labour_id = ?').bind(l.id),
    db.prepare('DELETE FROM mt_labour WHERE company_id = ? AND id = ?').bind(a.companyId, l.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'labour.removed', assetId: w.asset_id, workOrderId: w.id, summary: `Time entry removed: ${l.minutes} min`, before: { labourId: l.id, minutes: l.minutes, userId: l.user_id } }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ downtime

partsRoutes.put('/c/:company/work-orders/:id/downtime', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ startedAt: z.number().int().positive(), endedAt: z.number().int().positive().nullable().optional(), cause: zText(500).optional() }));
  const t = now();
  if (input.startedAt > t + 5 * 60_000) throw new HttpError(400, 'Downtime cannot start in the future');
  if (input.endedAt && input.endedAt < input.startedAt) throw new HttpError(400, 'Downtime cannot end before it starts');
  if (input.endedAt && input.endedAt > t + 5 * 60_000) throw new HttpError(400, 'Downtime cannot end in the future');
  const before = await db.prepare('SELECT started_at, ended_at, cause FROM mt_downtime WHERE company_id = ? AND work_order_id = ?').bind(a.companyId, w.id).first<any>();
  await db.batch([
    db
      .prepare('INSERT INTO mt_downtime (company_id, work_order_id, asset_id, started_at, ended_at, cause, recorded_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(company_id, work_order_id) DO UPDATE SET asset_id = excluded.asset_id, started_at = excluded.started_at, ended_at = excluded.ended_at, cause = excluded.cause, recorded_by = excluded.recorded_by, updated_at = excluded.updated_at')
      .bind(a.companyId, w.id, w.asset_id, input.startedAt, input.endedAt ?? null, input.cause ?? before?.cause ?? '', a.userId, t),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'downtime.recorded',
      assetId: w.asset_id,
      workOrderId: w.id,
      summary: input.endedAt ? `Downtime recorded: ${Math.round((input.endedAt - input.startedAt) / 60000)} min` : 'Downtime started (the asset is down)',
      before: before ? { startedAt: before.started_at, endedAt: before.ended_at } : undefined,
      after: { startedAt: input.startedAt, endedAt: input.endedAt ?? null },
      at: t,
    }),
  ]);
  return c.json({ startedAt: input.startedAt, endedAt: input.endedAt ?? null });
});

partsRoutes.delete('/c/:company/work-orders/:id/downtime', async (c) => {
  const { a, w, db } = await workable(c);
  if (!isManager(a)) deny('Only supervisors and administrators remove downtime');
  await db.batch([
    db.prepare('DELETE FROM mt_downtime WHERE company_id = ? AND work_order_id = ?').bind(a.companyId, w.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'downtime.removed', assetId: w.asset_id, workOrderId: w.id, summary: 'Downtime removed' }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ what the work order detail adds

const MOVE_NAMES: Record<string, string> = { maintenance_issue: 'Issued', maintenance_return: 'Returned' };

/** Inspections, parts used (from the ledger), labour costs, downtime, readings and the schedule behind a work order. */
export async function workOrderExtras(db: D1Database, a: MtAccess, w: any) {
  const [moves, labour, downtime, readings, occ] = await db.batch([
    db
      .prepare(
        `SELECT m.*, p.number AS product_number, p.name AS product_name, p.uom, l.code AS location_code, wh.code AS warehouse_code, u.name AS by_name
           FROM erp_stock_moves m JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id
           JOIN erp_locations l ON l.company_id = m.company_id AND l.id = m.location_id JOIN erp_warehouses wh ON wh.company_id = l.company_id AND wh.id = l.warehouse_id
           LEFT JOIN users u ON u.id = m.created_by
          WHERE m.company_id = ? AND m.source_type = 'work_order' AND m.source_id = ? ORDER BY m.created_at, m.rowid LIMIT 500`,
      )
      .bind(a.companyId, w.id),
    db.prepare('SELECT k.*, l.user_id, u.name AS user_name FROM mt_labour_costs k JOIN mt_labour l ON l.id = k.labour_id LEFT JOIN users u ON u.id = l.user_id WHERE k.company_id = ? AND k.work_order_id = ? ORDER BY k.work_date, k.created_at').bind(a.companyId, w.id),
    db.prepare('SELECT d.*, u.name AS recorder FROM mt_downtime d LEFT JOIN users u ON u.id = d.recorded_by WHERE d.company_id = ? AND d.work_order_id = ?').bind(a.companyId, w.id),
    db.prepare('SELECT r.*, m.name AS meter_name, m.unit FROM mt_readings r JOIN mt_meters m ON m.company_id = r.company_id AND m.id = r.meter_id WHERE r.company_id = ? AND r.work_order_id = ? ORDER BY r.read_at').bind(a.companyId, w.id),
    db.prepare('SELECT o.due_date, o.due_meter, o.occurrence_key, s.id AS schedule_id, s.name, s.trigger_kind FROM mt_pm_occurrences o JOIN mt_pm_schedules s ON s.company_id = o.company_id AND s.id = o.schedule_id WHERE o.company_id = ? AND o.work_order_id = ?').bind(a.companyId, w.id),
  ]);
  const manager = isManager(a);
  const mv = moves.results as any[];
  const byProduct = new Map<string, { productId: string; number: string; name: string; uom: string; issued: number; costCents: number }>();
  for (const m of mv) {
    const p = byProduct.get(m.product_id) ?? { productId: m.product_id, number: m.product_number, name: m.product_name, uom: m.uom, issued: 0, costCents: 0 };
    p.issued = q6(p.issued - m.on_hand_delta);
    p.costCents += -m.value_delta_cents;
    byProduct.set(m.product_id, p);
  }
  const lab = labour.results as any[];
  const d = downtime.results[0] as any;
  const o = occ.results[0] as any;
  return {
    inspections: await inspectionsOf(db, a.companyId, w.id),
    stock: {
      moves: mv.map((m) => ({ id: m.id, type: m.move_type, typeLabel: MOVE_NAMES[m.move_type] ?? m.move_type, productId: m.product_id, productNumber: m.product_number, productName: m.product_name, uom: m.uom, location: `${m.warehouse_code}/${m.location_code}`, lot: m.lot, serial: m.serial, quantity: q6(-m.on_hand_delta), unitCostCents: manager ? m.unit_cost_cents : undefined, valueCents: manager ? -m.value_delta_cents : undefined, byName: m.by_name ?? null, at: m.created_at })),
      byProduct: [...byProduct.values()].filter((p) => Math.abs(p.issued) > 1e-9 || p.costCents).map((p) => ({ ...p, costCents: manager ? p.costCents : undefined })),
      costCents: manager ? mv.reduce((s, m) => s - m.value_delta_cents, 0) : undefined,
      financePosting: 'Planned: the parts cost is in the stock ledger and on this work order; posting it to Finance is not built yet.',
    },
    labourCosts: lab.map((k) => ({ labourId: k.labour_id, entry: k.entry, workDate: k.work_date, minutes: k.minutes, userId: k.user_id, userName: k.user_name ?? null, note: k.note, rateCents: manager ? k.rate_cents : undefined, rateSource: manager ? k.rate_source : undefined, costCents: manager ? k.cost_cents : undefined })),
    costs: manager
      ? {
          labourCents: lab.reduce((s, k) => s + (k.cost_cents ?? 0), 0),
          labourUnpricedMinutes: lab.filter((k) => k.cost_cents === null).reduce((s, k) => s + k.minutes, 0),
          partsCents: mv.reduce((s, m) => s - m.value_delta_cents, 0),
          totalCents: lab.reduce((s, k) => s + (k.cost_cents ?? 0), 0) + mv.reduce((s, m) => s - m.value_delta_cents, 0),
        }
      : null,
    downtime: d ? { startedAt: d.started_at, endedAt: d.ended_at, minutes: d.ended_at ? Math.round((d.ended_at - d.started_at) / 60000) : null, cause: d.cause, recordedByName: d.recorder ?? null } : null,
    readings: (readings.results as any[]).map((r) => ({ id: r.id, meterId: r.meter_id, meterName: r.meter_name, unit: r.unit, value: r.value, reset: !!r.reset, outOfRange: !!r.out_of_range, readAt: r.read_at })),
    preventive: o ? { scheduleId: o.schedule_id, name: o.name, triggerKind: o.trigger_kind, dueDate: o.due_date, dueMeter: o.due_meter } : null,
  };
}
