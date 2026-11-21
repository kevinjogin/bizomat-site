// Parts reserved for a work order, purchase requisitions raised from one, and the maintenance stores' stocktakes, under
// /api/maintenance/c/:company/... Stock stays in ERP Inventory, requisitions in Procurement and the posting of counts
// in Inventory: nothing here keeps a second record of them, and nothing is posted to Finance.
//
//   Reserve      stock for a required part line, in the maintenance stores: ERP Inventory's own reservation
//                (erp_reservations, through StockOps.reserve), linked to the work order and the line by
//                mt_wo_reservations. The assigned technician, supervisors and administrators reserve, as they issue.
//                Issuing (routes-parts.ts) takes from the reservation first. Releasing it here, or completing or
//                cancelling the work order, gives it back to free stock; Inventory cannot release or issue it. No value
//                moves, so no Finance posting is recorded, not even as planned.
//   Requisition  from chosen part lines, through Procurement's own createRequisition, by someone who holds the ERP right
//                to raise requisitions; mt_wo_requisitions links it in the same transaction. It is approved and ordered
//                in Procurement under Procurement's rules.
//   Stocktakes   ERP Inventory's counts of the maintenance stores, through Inventory's own functions (openCount,
//                recordCounted, closeCount). Starting, submitting and cancelling one needs the ERP right to move stock
//                (inventory.operate); technicians and above enter what they counted without an ERP role. Only Inventory
//                approves a count and posts its differences, under inventory.approve and segregation of duties.
// Reservations and stocktakes need ERP Inventory (the Warehouse: stock module) switched on for the company,
// requisitions need Procurement. Every statement names the company (test-node/company-queries.test.ts).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { can, type Capability, type ErpAccess } from '../erp/access';
import { loadSettings } from '../erp/settings';
import { StockOps, q6, unitCostOrNull, type StockKey } from '../erp/stock';
import { COUNT_SELECT, closeCount, countDTO, countLinesOf, loadCount, loadStockProduct, openCount, recordCounted, stockKey } from '../erp/inventory';
import { createRequisition } from '../erp/procurement';
import { MODULES, moduleEnabled } from '../platform/flags';
import { requireMt, type MtAccess } from './access';
import { eventStmt, validDate, zDate, zId, zText } from './util';
import { doneStmt, todayNear } from './m2util';
import { STORE_FREE, STORE_STOCK_FROM } from './routes-setup';
import { REQUISITION_RIGHT_NOTE, erpAccessOrNone, openWoReservations, reservationTakenStmt, runParts, storeLocation, workable } from './routes-parts';

export const stockRoutes = new Hono<AppEnv>();

const zQ = z.number().positive().max(1e9);
const zKey = z.string().trim().min(8).max(80).optional();

// ------------------------------------------------------------------ shared

/** 403 when a module this needs is switched off for the company (moduleSwitchGate does not cover /maintenance). */
async function assertModule(db: D1Database, companyId: string, m: 'inventory' | 'procurement') {
  if (!(await moduleEnabled(db, m, companyId))) throw new HttpError(403, `${MODULES[m].label} is switched off for this company. Ask BIZOMAT support if you need it.`, { code: 'MODULE_DISABLED', module: m });
}

const RIGHT_NEEDED: Partial<Record<Capability, string>> = {
  'inventory.operate': 'Starting, submitting or cancelling a stocktake needs an ERP role that may move stock (a warehouse manager or operator, or an ERP administrator). An ERP administrator gives ERP roles in Administration.',
  'requisitions.raise': REQUISITION_RIGHT_NOTE,
};

/** The person's ERP access when it holds `cap`, else 403 naming the right (a maintenance role gives no ERP right). */
async function erpRight(db: D1Database, a: MtAccess, cap: Capability) {
  const erp = await erpAccessOrNone(db, a);
  if (!erp || !can(erp, cap)) throw new HttpError(403, RIGHT_NEEDED[cap] ?? 'You do not have the ERP right this needs', { code: 'ERP_RIGHT_NEEDED', capability: cap });
  return erp;
}

/**
 * The access StockOps writes with, from the maintenance access alone (the company and the person): releasing what a work
 * order reserved never depends on an ERP role, so completing or cancelling it always works. StockOps checks no right.
 */
function stockActor(a: MtAccess): ErpAccess {
  return { companyId: a.companyId, kind: a.kind, companyName: a.companyName, companyRole: a.companyRole as ErpAccess['companyRole'], userId: a.userId, userName: a.userName, roles: [], solo: false };
}

/** One work order transaction; a CHECK or UNIQUE refusal (someone changed the same records at the same moment) answers 409. */
export async function runWoBatch(db: D1Database, stmts: D1PreparedStatement[], conflictMessage: string) {
  try {
    return await db.batch(stmts);
  } catch (e) {
    if (/CHECK constraint failed|UNIQUE constraint failed/i.test(String((e as Error)?.message ?? e))) throw new HttpError(409, conflictMessage);
    throw e;
  }
}

/**
 * The statements that give back to free stock everything still reserved for a work order, when it is completed or
 * cancelled (routes-work.ts puts them in the same transaction). None when nothing is reserved. The reservations'
 * updates have no status guard: a release or issue at the same moment fails the reservation's CHECK, and the whole
 * completion with it. The StockOps access comes from the maintenance access, never from an ERP role.
 */
export async function woReservationReleaseStmts(db: D1Database, a: MtAccess, w: { id: string; number: string; asset_id: string }, why: 'completed' | 'cancelled', t: number): Promise<D1PreparedStatement[]> {
  const open = (await openWoReservations(db, a.companyId, w.id)).filter((r) => r.open > 1e-9);
  if (!open.length) return [];
  const ops = new StockOps(db, stockActor(a), await loadSettings(db, a.companyId), t);
  const updates: D1PreparedStatement[] = [];
  for (const r of open) {
    const key: StockKey = { productId: r.product_id, locationId: r.location_id, lot: r.lot, serial: r.serial };
    ops.reserve(key, -r.open, { source: 'work_order', sourceId: w.id, reference: r.reference, reason: `Released: ${w.number} was ${why}` });
    updates.push(reservationTakenStmt(db, a.companyId, r.id, 'released', r.open, t));
  }
  const event = eventStmt(db, {
    companyId: a.companyId,
    actorId: a.userId,
    action: 'parts.reservations_released',
    assetId: w.asset_id,
    workOrderId: w.id,
    summary: `Stock still reserved for ${w.number} released: ${open.length} reservation${open.length === 1 ? '' : 's'} (the work order was ${why})`,
    after: { reservations: open.map((r) => ({ id: r.id, quantity: r.open })) },
    at: t,
  });
  // No posting kind: a reservation moves no value, so no Finance posting is recorded.
  return [...ops.stmts, ...ops.finish({ type: 'work_order', id: w.id }), ...updates, event];
}

// ------------------------------------------------------------------ reserving for a required part

stockRoutes.post('/c/:company/work-orders/:id/parts/:partId/reserve', async (c) => {
  const { a, w, db } = await workable(c);
  await assertModule(db, a.companyId, 'inventory');
  const input = await body(c, z.object({ quantity: zQ.optional(), locationId: zId.optional(), lot: zText(80).optional(), serial: zText(80).optional(), requestKey: zKey }));
  const line = await db.prepare('SELECT * FROM mt_wo_parts WHERE company_id = ? AND work_order_id = ? AND id = ?').bind(a.companyId, w.id, c.req.param('partId')).first<any>();
  if (!line) throw notFound('Part line');
  if (!line.product_id) throw new HttpError(400, 'Link this line to a product first: only products are kept in stock');
  const p = await loadStockProduct(db, a.companyId, line.product_id);
  if (p.type === 'service') throw new HttpError(400, `${p.number} is a service: services are not kept in stock`);
  const [issued, held] = await db.batch([
    db.prepare('SELECT issued_qty FROM mt_wo_stock WHERE company_id = ? AND work_order_id = ? AND product_id = ?').bind(a.companyId, w.id, p.id),
    db
      .prepare("SELECT COALESCE(SUM(r.quantity - r.issued_qty - r.released_qty), 0) AS q FROM mt_wo_reservations x JOIN erp_reservations r ON r.company_id = x.company_id AND r.id = x.reservation_id WHERE x.company_id = ? AND x.part_id = ? AND r.status = 'open'")
      .bind(a.companyId, line.id),
  ]);
  const toFind = Math.max(0, q6(line.quantity - Number((issued.results[0] as any)?.issued_qty ?? 0) - Number((held.results[0] as any)?.q ?? 0)));
  if (toFind <= 1e-9) throw new HttpError(409, 'Nothing is left to reserve: it is issued or reserved already');
  if (input.quantity !== undefined && input.quantity > toFind + 1e-9) throw new HttpError(400, `At most ${toFind} ${p.uom} is still needed for this line`);
  const want = q6(input.quantity ?? toFind);
  const picks: { key: StockKey; stockId: string; location: string; take: number }[] = [];
  if (input.locationId) {
    await storeLocation(db, a.companyId, input.locationId);
    const { l, key } = await stockKey(db, a.companyId, { productId: p.id, locationId: input.locationId, lot: input.lot, serial: input.serial }, { incoming: false, quantity: want });
    const row = await db.prepare('SELECT id, on_hand, reserved FROM erp_stock WHERE company_id = ? AND product_id = ? AND location_id = ? AND lot = ? AND serial = ?').bind(a.companyId, key.productId, key.locationId, key.lot ?? '', key.serial ?? '').first<{ id: string; on_hand: number; reserved: number }>();
    const free = row ? Math.max(0, q6(row.on_hand - row.reserved)) : 0;
    if (!row || free < want - 1e-9) throw new HttpError(409, `Only ${free} ${p.uom} is free at ${l.warehouse_code}/${l.code}`);
    picks.push({ key, stockId: row.id, location: `${l.warehouse_code}/${l.code}`, take: want });
  } else {
    // The soonest expiry first, then by store and location.
    const rows = await db
      .prepare(
        `SELECT s.id, s.location_id, s.lot, s.serial, ${STORE_FREE} AS free, l.code AS location_code, w.code AS warehouse_code FROM ${STORE_STOCK_FROM}
          WHERE s.company_id = ? AND s.product_id = ? AND s.on_hand - s.reserved > 1e-9
          ORDER BY COALESCE(s.expiry, '9999-12-31'), w.code COLLATE NOCASE, l.code COLLATE NOCASE, s.lot, s.serial LIMIT 200`,
      )
      .bind(a.companyId, p.id)
      .all<{ id: string; location_id: string; lot: string; serial: string; free: number; location_code: string; warehouse_code: string }>();
    let left = want;
    for (const r of rows.results) {
      if (left <= 1e-9) break;
      const take = r.serial ? (left >= 1 - 1e-9 ? 1 : 0) : q6(Math.min(Number(r.free), left));
      if (take <= 1e-9) break;
      picks.push({ key: { productId: p.id, locationId: r.location_id, lot: r.lot, serial: r.serial }, stockId: r.id, location: `${r.warehouse_code}/${r.location_code}`, take });
      left = q6(left - take);
    }
    if (!picks.length) throw new HttpError(409, `No ${p.number} is free in the maintenance stores. Raise a requisition for it.`);
  }
  const ops = new StockOps(db, stockActor(a), await loadSettings(db, a.companyId));
  const reference = `${w.number} (${p.number})`;
  const after: D1PreparedStatement[] = [];
  const reserved: { reservationId: string; locationId: string; location: string; lot: string; serial: string; quantity: number }[] = [];
  for (const k of picks) {
    const resId = newId();
    ops.reserve(k.key, k.take, { source: 'work_order', sourceId: w.id, reference });
    after.push(
      db.prepare('INSERT INTO erp_reservations (id, company_id, stock_id, product_id, quantity, reference, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(resId, a.companyId, k.stockId, p.id, k.take, reference, a.userId, ops.t, ops.t),
      db.prepare('INSERT INTO mt_wo_reservations (id, company_id, reservation_id, work_order_id, part_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, resId, w.id, line.id, a.userId, ops.t),
    );
    reserved.push({ reservationId: resId, locationId: k.key.locationId, location: k.location, lot: k.key.lot ?? '', serial: k.key.serial ?? '', quantity: k.take });
  }
  const total = q6(reserved.reduce((n, r) => n + r.quantity, 0));
  after.push(
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'parts.reserved',
      assetId: w.asset_id,
      workOrderId: w.id,
      summary: `Reserved ${total} ${p.uom} of ${p.number} ${p.name}: ${reserved.map((r) => `${r.quantity} at ${r.location}${r.lot ? ` lot ${r.lot}` : ''}${r.serial ? ` serial ${r.serial}` : ''}`).join('; ')}`.slice(0, 500),
      after: { partId: line.id, reserved },
      at: ops.t,
    }),
  );
  const before = input.requestKey ? [doneStmt(db, a.companyId, `wo-reserve:${input.requestKey}`, ops.t)] : [];
  // No posting kind: reserving moves no value, so no Finance posting is recorded.
  await runParts(db, ops.all(before, after, { type: 'work_order', id: w.id }));
  return c.json({ reserved, short: Math.max(0, q6(want - total)) }, 201);
});

stockRoutes.post('/c/:company/work-orders/:id/reservations/:reservationId/unreserve', async (c) => {
  const { a, w, db } = await workable(c);
  const r = await db
    .prepare(
      `SELECT r.*, s.location_id, s.lot, s.serial FROM mt_wo_reservations x JOIN erp_reservations r ON r.company_id = x.company_id AND r.id = x.reservation_id
         JOIN erp_stock s ON s.company_id = r.company_id AND s.id = r.stock_id WHERE x.company_id = ? AND x.work_order_id = ? AND x.reservation_id = ?`,
    )
    .bind(a.companyId, w.id, c.req.param('reservationId'))
    .first<any>();
  if (!r) throw notFound('Reservation');
  if (r.status !== 'open') throw new HttpError(409, 'This reservation is closed');
  const input = await body(c, z.object({ quantity: zQ.optional(), reason: zText(500).optional(), requestKey: zKey }));
  const open = q6(r.quantity - r.issued_qty - r.released_qty);
  if (input.quantity !== undefined && input.quantity > open + 1e-9) throw new HttpError(400, `At most ${open} is open on this reservation`);
  const qn = q6(input.quantity ?? open);
  const ops = new StockOps(db, stockActor(a), await loadSettings(db, a.companyId));
  ops.reserve({ productId: r.product_id, locationId: r.location_id, lot: r.lot, serial: r.serial }, -qn, { source: 'work_order', sourceId: w.id, reference: r.reference, reason: input.reason ?? 'Released on the work order' });
  await runParts(
    db,
    ops.all(
      input.requestKey ? [doneStmt(db, a.companyId, `wo-unreserve:${input.requestKey}`, ops.t)] : [],
      [
        reservationTakenStmt(db, a.companyId, r.id, 'released', qn, ops.t),
        eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'parts.reservation_released', assetId: w.asset_id, workOrderId: w.id, summary: `Released ${qn} reserved for ${r.reference}${input.reason ? `: ${input.reason}` : ''}`.slice(0, 500), after: { reservationId: r.id, quantity: qn }, at: ops.t }),
      ],
      { type: 'work_order', id: w.id },
    ),
  );
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ requisitions from a work order

stockRoutes.post('/c/:company/work-orders/:id/requisition', async (c) => {
  const { a, w, db } = await workable(c);
  await assertModule(db, a.companyId, 'procurement');
  const erp = await erpRight(db, a, 'requisitions.raise');
  const input = await body(
    c,
    z.object({
      lines: z.array(z.object({ partId: zId, quantity: z.number().positive().max(1e9) })).min(1).max(100),
      title: zText(200).optional(),
      requiredDate: zDate.optional(),
      departmentId: zId.nullable().optional(),
      reason: zText(2000).optional(),
      submit: z.boolean().optional(),
      requestKey: zKey,
    }),
  );
  if (new Set(input.lines.map((l) => l.partId)).size !== input.lines.length) throw new HttpError(400, 'Choose each part line once');
  const parts = new Map(((await db.prepare('SELECT id, part, product_id FROM mt_wo_parts WHERE company_id = ? AND work_order_id = ?').bind(a.companyId, w.id).all<{ id: string; part: string; product_id: string | null }>()).results).map((x) => [x.id, x]));
  const lines = [];
  for (const [i, l] of input.lines.entries()) {
    const x = parts.get(l.partId);
    if (!x) throw new HttpError(400, `Line ${i + 1} is not a required part of ${w.number}`);
    if (x.product_id) {
      const cost = await unitCostOrNull(db, a.companyId, x.product_id);
      lines.push({ productId: x.product_id, quantity: l.quantity, estUnitCostCents: cost === null ? undefined : Math.round(cost) });
    } else lines.push({ productId: null, item: x.part, quantity: l.quantity });
  }
  const today = todayNear(c.req.query('today'));
  const due = [w.due_start, w.due_finish].find((d) => d && validDate(d) && d >= today);
  let departmentId = input.departmentId;
  if (departmentId === undefined) {
    // The work order's department while it is still in use, so the default never makes the requisition fail.
    const d = w.department_id ? await db.prepare('SELECT id FROM co_departments WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(a.companyId, w.department_id).first<{ id: string }>() : null;
    departmentId = a.kind === 'registered' && d ? d.id : null;
  }
  const title = (input.title || `For ${w.number} on ${w.asset_number} ${w.asset_name}`).slice(0, 200);
  const reason = (input.reason || `Parts for maintenance work order ${w.number}: ${w.description}`).slice(0, 2000);
  try {
    const r = await createRequisition(db, erp, { title, requiredDate: input.requiredDate || due || today, departmentId, reason, lines, submit: input.submit }, `from maintenance work order ${w.number}`, (made) => [
      ...(input.requestKey ? [doneStmt(db, a.companyId, `wo-req:${input.requestKey}`, made.t)] : []),
      db.prepare('INSERT INTO mt_wo_requisitions (id, company_id, requisition_id, work_order_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, made.id, w.id, a.userId, made.t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'requisition.raised', assetId: w.asset_id, workOrderId: w.id, summary: `Requisition ${made.number} raised for ${lines.length} part line${lines.length === 1 ? '' : 's'}`, after: { requisitionId: made.id, lines: input.lines }, at: made.t }),
    ]);
    return c.json(r, 201);
  } catch (e) {
    if (/mt_done/.test(String((e as Error)?.message ?? e))) throw new HttpError(409, 'This was already done: refresh to see it');
    throw e;
  }
});

// ------------------------------------------------------------------ stocktakes of the maintenance stores

const STOCKTAKE_LABELS: Record<string, string> = { open: 'Counting', submitted: 'Waiting for approval in Inventory', posted: 'Posted', cancelled: 'Cancelled' };
const STATUS_FILTERS: Record<string, string[]> = { active: ['open', 'submitted'], open: ['open'], submitted: ['submitted'], posted: ['posted'], cancelled: ['cancelled'], all: ['open', 'submitted', 'posted', 'cancelled'] };
const SORTS: Record<string, string> = {
  due_asc: "COALESCE(n.due_date, '9999-12-31'), n.number DESC",
  due_desc: "COALESCE(n.due_date, '0000-01-01') DESC, n.number DESC",
  number_asc: 'n.number COLLATE NOCASE',
  number_desc: 'n.number COLLATE NOCASE DESC',
};

/** A count of a maintenance store (ERP Inventory's), else 404: another warehouse's counts are Inventory's alone. */
async function loadStocktake(db: D1Database, companyId: string, id: string) {
  const n = await loadCount(db, companyId, id).catch(() => null);
  const store = n ? await db.prepare('SELECT 1 AS x FROM mt_stores WHERE company_id = ? AND warehouse_id = ?').bind(companyId, n.warehouse_id).first() : null;
  if (!n || !store) throw notFound('Stocktake');
  return n;
}

function stocktakeDTO(n: any, today: string) {
  return {
    ...countDTO(n),
    store: { id: n.warehouse_id, code: n.warehouse_code, name: n.warehouse_name },
    statusLabel: STOCKTAKE_LABELS[n.status] ?? n.status,
    overdue: (n.status === 'open' || n.status === 'submitted') && !!n.due_date && n.due_date < today,
  };
}

stockRoutes.get('/c/:company/stocktakes', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  await assertModule(db, a.companyId, 'inventory');
  const today = todayNear(c.req.query('today'));
  const statuses = STATUS_FILTERS[c.req.query('status') ?? 'active'] ?? STATUS_FILTERS.active;
  const storeId = (c.req.query('storeId') ?? '').slice(0, 64);
  const order = SORTS[c.req.query('sort') ?? ''] ?? SORTS.due_asc;
  const [rows, stores, locations] = await db.batch([
    db
      .prepare(
        `${COUNT_SELECT} WHERE n.company_id = ? AND EXISTS (SELECT 1 FROM mt_stores ms WHERE ms.company_id = n.company_id AND ms.warehouse_id = n.warehouse_id)
            AND n.status IN (${statuses.map(() => '?').join(',')}) ${storeId ? 'AND n.warehouse_id = ?' : ''} ORDER BY ${order} LIMIT 300`,
      )
      .bind(a.companyId, ...statuses, ...(storeId ? [storeId] : [])),
    db.prepare('SELECT w.id, w.code, w.name FROM mt_stores ms JOIN erp_warehouses w ON w.company_id = ms.company_id AND w.id = ms.warehouse_id WHERE ms.company_id = ? AND w.archived_at IS NULL ORDER BY w.code COLLATE NOCASE').bind(a.companyId),
    db
      .prepare('SELECT l.id, l.code, l.name, l.warehouse_id FROM erp_locations l JOIN mt_stores ms ON ms.company_id = l.company_id AND ms.warehouse_id = l.warehouse_id WHERE l.company_id = ? AND l.archived_at IS NULL ORDER BY l.code COLLATE NOCASE LIMIT 500')
      .bind(a.companyId),
  ]);
  const erp = await erpAccessOrNone(db, a);
  const locs = locations.results as any[];
  return c.json({
    stocktakes: (rows.results as any[]).map((n) => stocktakeDTO(n, today)),
    stores: (stores.results as any[]).map((s) => ({ id: s.id, code: s.code, name: s.name, locations: locs.filter((l) => l.warehouse_id === s.id).map((l) => ({ id: l.id, code: l.code, name: l.name })) })),
    today,
    can: { start: !!erp && can(erp, 'inventory.operate'), approveInInventory: !!erp && can(erp, 'inventory.approve') },
  });
});

stockRoutes.post('/c/:company/stocktakes', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  await assertModule(db, a.companyId, 'inventory');
  await erpRight(db, a, 'inventory.operate');
  const input = await body(c, z.object({ warehouseId: zId, locationId: zId.nullable().optional(), kind: z.enum(['stocktake', 'cycle']).default('stocktake'), dueDate: zDate.optional(), notes: zText(1000).optional() }));
  const wh = await db.prepare('SELECT w.code, (SELECT 1 FROM mt_stores ms WHERE ms.company_id = w.company_id AND ms.warehouse_id = w.id) AS store FROM erp_warehouses w WHERE w.company_id = ? AND w.id = ?').bind(a.companyId, input.warehouseId).first<{ code: string; store: number | null }>();
  if (!wh) throw notFound('Warehouse');
  if (!wh.store) throw new HttpError(400, `${wh.code} is not a maintenance store. An administrator marks maintenance stores in Maintenance settings.`);
  const t = now();
  const r = await openCount(db, a, input, {
    requireLines: true,
    extra: [eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'stocktake.started', summary: `Stocktake of the maintenance store ${wh.code} started${input.dueDate ? `, due ${input.dueDate}` : ''}`, after: { warehouseId: input.warehouseId, locationId: input.locationId ?? null, kind: input.kind, dueDate: input.dueDate ?? null }, at: t })],
  });
  return c.json({ id: r.id, number: r.number, lines: r.lines }, 201);
});

stockRoutes.get('/c/:company/stocktakes/:countId', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  await assertModule(db, a.companyId, 'inventory');
  const n = await loadStocktake(db, a.companyId, c.req.param('countId'));
  const lines = await countLinesOf(db, a.companyId, n);
  const erp = await erpAccessOrNone(db, a);
  const operate = !!erp && can(erp, 'inventory.operate');
  const open = n.status === 'open';
  const counter = n.submitted_by ?? n.created_by;
  return c.json({
    stocktake: stocktakeDTO(n, todayNear(c.req.query('today'))),
    lines,
    can: {
      count: open,
      submit: open && operate && n.lines > 0 && n.counted === n.lines,
      cancel: open && operate,
      approveInInventory: n.status === 'submitted' && !!erp && can(erp, 'inventory.approve') && (counter !== a.userId || erp.solo),
    },
    note: open && !operate ? 'Someone with an ERP role that may move stock (a warehouse manager or operator, or an ERP administrator) submits it for approval.' : null,
  });
});

stockRoutes.put('/c/:company/stocktakes/:countId/counted', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  await assertModule(db, a.companyId, 'inventory');
  const n = await loadStocktake(db, a.companyId, c.req.param('countId'));
  const input = await body(c, z.object({ lines: z.array(z.object({ id: zId, counted: z.number().min(0).max(1e9).nullable() })).min(1).max(2000) }));
  await recordCounted(db, a, n, input.lines);
  const fresh = await loadCount(db, a.companyId, n.id);
  return c.json({ ok: true, counted: fresh.counted, lines: fresh.lines });
});

stockRoutes.post('/c/:company/stocktakes/:countId/submit', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  await assertModule(db, a.companyId, 'inventory');
  await erpRight(db, a, 'inventory.operate');
  const n = await loadStocktake(db, a.companyId, c.req.param('countId'));
  const t = now();
  const r = await closeCount(db, a, n, 'submit', [eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'stocktake.submitted', summary: `Stocktake ${n.number} of ${n.warehouse_code} submitted for approval in Inventory`, after: { countId: n.id }, at: t })]);
  if (!r.changed) throw new HttpError(409, `${n.number} changed at the same moment: refresh and try again`);
  return c.json({ ok: true });
});

stockRoutes.post('/c/:company/stocktakes/:countId/cancel', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  await assertModule(db, a.companyId, 'inventory');
  await erpRight(db, a, 'inventory.operate');
  const n = await loadStocktake(db, a.companyId, c.req.param('countId'));
  const input = await body(c, z.object({ reason: zText(1000).min(1, 'Say why it is cancelled') }));
  if (n.status === 'submitted') throw new HttpError(409, `${n.number} is waiting for approval: a warehouse manager cancels it in Inventory`);
  if (n.status !== 'open') throw new HttpError(409, `${n.number} is ${STOCKTAKE_LABELS[n.status]?.toLowerCase() ?? n.status}`);
  const t = now();
  const r = await closeCount(db, a, n, 'cancel', [eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'stocktake.cancelled', summary: `Stocktake ${n.number} of ${n.warehouse_code} cancelled: ${input.reason}`.slice(0, 500), after: { countId: n.id, reason: input.reason }, at: t })]);
  if (!r.changed) throw new HttpError(409, `${n.number} changed at the same moment: refresh and try again`);
  return c.json({ ok: true });
});
