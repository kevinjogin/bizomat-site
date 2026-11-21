// Parts, labour and downtime on a work order (stage M3), under /api/maintenance/c/:company/work-orders/:id/...
//
//   Required parts  what the job needs (mt_wo_parts): a line names an ERP product (one line per product on a work order)
//            or describes the part in words. Each line shows what is issued, reserved, free in the maintenance stores,
//            short and on a requisition (requiredPartsOf). Reserving and requisitions are in routes-stock.ts.
//   Parts    issued from a maintenance store (an ERP warehouse marked as one) and returned to it through ERP Inventory's
//            StockOps, in one transaction with the movement in the ledger (maintenance_issue, maintenance_return, source
//            work_order): no second stock system. An issue takes first from what is reserved for the work order at the
//            same location, lot and serial, then from free stock. Stock can never go below zero, so two people issuing
//            the last unit at the same moment cannot both succeed. The parts cost is the ledger's value of those
//            movements; its posting to Finance is recorded as planned, as in Releases 2 and 3 (nothing is posted). The
//            assigned technician issues to their own work orders, supervisors and administrators to any. StockOps needs
//            an ERP access: it is resolved for the same person and company (loadErpAccess); no ERP role is given or needed.
//   Labour   Stage 1's timer, plus time entered by hand; each line is priced when recorded (routes-setup.ts).
//   Downtime when the asset was down, for the reliability reports.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { can, loadErpAccess, type ErpAccess } from '../erp/access';
import { loadSettings } from '../erp/settings';
import { StockOps, currentUnitCost, q6, runStock } from '../erp/stock';
import { stockKey } from '../erp/inventory';
import { REQ_LABELS } from '../erp/procurement';
import { PO_LABELS } from '../erp/purchasing';
import { moduleEnabled } from '../platform/flags';
import { assertPerson, deny, isManager, requireMt, type MtAccess } from './access';
import { assertUnlocked, canWork, loadWorkOrder } from './routes-work';
import { LOCKED, eventStmt, likeOf, validDate, zId, zText } from './util';
import { STORE_FREE, STORE_STOCK_FROM, priceLabourStmt } from './routes-setup';
import { doneStmt, isUnique, utcDate } from './m2util';
import { inspectionsOf } from './routes-inspections';

export const partsRoutes = new Hono<AppEnv>();

const zQ = z.number().positive().max(1e9);
const zKey = z.string().trim().min(8).max(80).optional();
const line = z.object({ productId: zId, locationId: zId, lot: zText(80).optional(), serial: zText(80).optional(), quantity: zQ });

/** One stock transaction; a once-only key already used (the same request sent twice) answers 409. */
export async function runParts(db: D1Database, stmts: D1PreparedStatement[]) {
  try {
    return await runStock(db, stmts);
  } catch (e) {
    if (/mt_done/.test(String((e as Error)?.message ?? e))) throw new HttpError(409, 'This was already done: refresh to see it');
    throw e;
  }
}

/** A work order the caller may work on (the assigned technician, supervisors, administrators) and that is not locked. */
export async function workable(c: any) {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB as D1Database;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  if (!canWork(a, w)) deny('Only the assigned technician, a supervisor or an administrator can do this on this work order');
  assertUnlocked(w);
  return { a, w, db };
}

/** The location must be in a maintenance store and outside quarantine (n: the line it is on, named in the message). */
export async function storeLocation(db: D1Database, companyId: string, locationId: string, n?: number) {
  const msg = (text: string) => (n ? `Line ${n}: ${text}` : text.charAt(0).toUpperCase() + text.slice(1));
  const l = await db
    .prepare('SELECT l.kind, l.code, w.code AS wh, (SELECT 1 FROM mt_stores s WHERE s.company_id = w.company_id AND s.warehouse_id = w.id) AS store FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.id = ?')
    .bind(companyId, locationId)
    .first<{ kind: string; code: string; wh: string; store: number | null }>();
  if (!l) throw new HttpError(400, msg('choose a location of this company'));
  if (!l.store) throw new HttpError(400, msg(`${l.wh}/${l.code} is not in a maintenance store. An administrator marks warehouses as maintenance stores in Maintenance settings.`));
  if (l.kind === 'quarantine') throw new HttpError(400, msg('stock in quarantine cannot be issued, returned or reserved here'));
}

/** The work order's reservations that are still open, with their stock key (open = quantity less issued and released). */
export async function openWoReservations(db: D1Database, companyId: string, woId: string) {
  const rows = await db
    .prepare(
      `SELECT r.id, r.quantity, r.issued_qty, r.released_qty, r.reference, x.part_id, s.product_id, s.location_id, s.lot, s.serial
         FROM mt_wo_reservations x JOIN erp_reservations r ON r.company_id = x.company_id AND r.id = x.reservation_id
         JOIN erp_stock s ON s.company_id = r.company_id AND s.id = r.stock_id
        WHERE x.company_id = ? AND x.work_order_id = ? AND r.status = 'open' ORDER BY r.created_at, r.rowid`,
    )
    .bind(companyId, woId)
    .all<{ id: string; quantity: number; issued_qty: number; released_qty: number; reference: string; part_id: string | null; product_id: string; location_id: string; lot: string; serial: string }>();
  return rows.results.map((r) => ({ ...r, open: q6(r.quantity - r.issued_qty - r.released_qty) }));
}

/**
 * The statement that records what was issued from (or released from) a reservation. It has no status guard on purpose:
 * a concurrent issue or release makes issued plus released go over the quantity, the reservation's CHECK fails, and the
 * whole transaction with it.
 */
export function reservationTakenStmt(db: D1Database, companyId: string, reservationId: string, kind: 'issued' | 'released', qty: number, t: number) {
  const col = kind === 'issued' ? 'issued_qty' : 'released_qty';
  return db
    .prepare(`UPDATE erp_reservations SET ${col} = round(${col} + ?, 6), status = CASE WHEN round(quantity - issued_qty - released_qty - ?, 6) <= 1e-9 THEN '${kind}' ELSE status END, updated_at = ? WHERE company_id = ? AND id = ?`)
    .bind(qty, qty, t, companyId, reservationId);
}

partsRoutes.post('/c/:company/work-orders/:id/stock/issue', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ lines: z.array(line).min(1).max(50), requestKey: zKey }));
  const erp = await loadErpAccess(db, a.companyId, c.get('user'));
  const ops = new StockOps(db, erp, await loadSettings(db, a.companyId));
  const before: D1PreparedStatement[] = input.requestKey ? [doneStmt(db, a.companyId, `wo-issue:${input.requestKey}`, ops.t)] : [];
  const after: D1PreparedStatement[] = [];
  const summary: string[] = [];
  // What is reserved for this work order is taken first, at the same location, lot and serial.
  const reserved = await openWoReservations(db, a.companyId, w.id);
  for (const [i, x] of input.lines.entries()) {
    await storeLocation(db, a.companyId, x.locationId, i + 1);
    const { p, l, key } = await stockKey(db, a.companyId, { productId: x.productId, locationId: x.locationId, lot: x.lot, serial: x.serial }, { incoming: false, quantity: x.quantity });
    let left = x.quantity;
    for (const r of reserved) {
      if (left <= 1e-9) break;
      if (r.open <= 1e-9 || r.product_id !== key.productId || r.location_id !== key.locationId || r.lot !== (key.lot ?? '') || r.serial !== (key.serial ?? '')) continue;
      const take = q6(Math.min(r.open, left));
      await ops.takeOut('maintenance_issue', key, take, { source: 'work_order', sourceId: w.id, reference: w.number, reason: `Issued to ${w.number} from its reservation`, fromReserved: true });
      after.push(reservationTakenStmt(db, a.companyId, r.id, 'issued', take, ops.t));
      r.open = q6(r.open - take);
      left = q6(left - take);
    }
    if (left > 1e-9) await ops.takeOut('maintenance_issue', key, left, { source: 'work_order', sourceId: w.id, reference: w.number, reason: `Issued to ${w.number}` });
    after.push(
      db
        .prepare('INSERT INTO mt_wo_stock (company_id, work_order_id, product_id, issued_qty, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id, work_order_id, product_id) DO UPDATE SET issued_qty = round(issued_qty + excluded.issued_qty, 6), updated_at = excluded.updated_at')
        .bind(a.companyId, w.id, p.id, x.quantity, ops.t),
    );
    summary.push(`${x.quantity} ${p.uom} of ${p.number} ${p.name} from ${l.warehouse_code}/${l.code}${key.lot ? ` lot ${key.lot}` : ''}${key.serial ? ` serial ${key.serial}` : ''}`);
  }
  after.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'parts.issued', assetId: w.asset_id, workOrderId: w.id, summary: `Parts issued: ${summary.join('; ')}`.slice(0, 500), after: { groupId: ops.groupId, lines: input.lines }, at: ops.t }));
  await runParts(db, ops.all(before, after, { type: 'work_order', id: w.id, kind: 'finance.maintenance_posting' }));
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
  await runParts(db, ops.all(before, after, { type: 'work_order', id: w.id, kind: 'finance.maintenance_posting' }));
  return c.json({ ok: true, groupId: ops.groupId }, 201);
});

// ------------------------------------------------------------------ required parts

/** A required part line as it comes in: a product of the company, or the part in words (or both: words then label it). */
export const partItem = z.object({ part: zText(200).optional(), productId: zId.nullable().optional(), quantity: z.number().positive().max(1e6) });
type PartIn = z.infer<typeof partItem>;
export interface PartLine {
  part: string;
  quantity: number;
  productId: string | null;
  productNumber: string | null;
}

/**
 * Required part lines checked: each names a product of this company that is not archived (its name is the part when
 * none is written) or describes the part, and a product is on one line only. Every query names the company.
 */
export async function checkPartLines(db: D1Database, companyId: string, lines: PartIn[]): Promise<PartLine[]> {
  const ids = [...new Set(lines.map((l) => l.productId).filter((x): x is string => !!x))];
  const products = new Map<string, { id: string; number: string; name: string; archived_at: number | null }>();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const rows = await db.prepare(`SELECT id, number, name, archived_at FROM erp_products WHERE company_id = ? AND id IN (${chunk.map(() => '?').join(',')})`).bind(companyId, ...chunk).all<{ id: string; number: string; name: string; archived_at: number | null }>();
    for (const r of rows.results) products.set(r.id, r);
  }
  const seen = new Set<string>();
  return lines.map((l, i) => {
    const at = (text: string) => (lines.length > 1 ? `Part ${i + 1}: ${text}` : text);
    const part = (l.part ?? '').trim();
    if (l.productId) {
      const p = products.get(l.productId);
      if (!p) throw new HttpError(400, at('Choose a product of this company'));
      if (p.archived_at) throw new HttpError(400, at(`${p.number} is archived`));
      if (seen.has(p.id)) throw new HttpError(400, at(`${p.number} is listed twice: give one line its total quantity`));
      seen.add(p.id);
      return { part: part || p.name, quantity: l.quantity, productId: p.id, productNumber: p.number };
    }
    if (!part) throw new HttpError(400, at('Choose a product or write the part'));
    return { part, quantity: l.quantity, productId: null, productNumber: null };
  });
}

/** The statements that add part lines to a work order, positions from `from` (a line may bring its own id). */
export function partLineStmts(db: D1Database, companyId: string, woId: string, lines: (PartLine & { id?: string })[], actorId: string, t: number, from = 1) {
  return lines.map((p, i) =>
    db.prepare('INSERT INTO mt_wo_parts (id, company_id, work_order_id, position, part, quantity, product_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(p.id ?? newId(), companyId, woId, from + i, p.part, p.quantity, p.productId, actorId, t),
  );
}

/** Preventive maintenance's part lines (pm.ts): the same rules; productNumber comes from the database, never the client. */
export async function checkPmParts(db: D1Database, companyId: string, lines: PartIn[]) {
  return (await checkPartLines(db, companyId, lines)).map((l) => (l.productId ? { part: l.part, quantity: l.quantity, productId: l.productId, productNumber: l.productNumber ?? undefined } : { part: l.part, quantity: l.quantity }));
}

/**
 * The part lines of a work order made by preventive maintenance, from the schedule's stored lines. A product archived
 * since keeps its line as text, and older lines naming a product twice link only the first, so making the work order
 * never fails on the one-line-per-product rule.
 */
export function pmPartStmts(db: D1Database, companyId: string, woId: string, partsJson: string | null, actorId: string | null, t: number) {
  const seen = new Set<string>();
  return parseJson<{ part: string; quantity: number; productId?: string | null }[]>(partsJson, []).map((p, i) => {
    const productId = p.productId && !seen.has(p.productId) ? p.productId : null;
    if (productId) seen.add(productId);
    return db
      .prepare('INSERT INTO mt_wo_parts (id, company_id, work_order_id, position, part, quantity, product_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, (SELECT p.id FROM erp_products p WHERE p.company_id = ? AND p.id = ? AND p.archived_at IS NULL), ?, ?)')
      .bind(newId(), companyId, woId, i + 1, String(p.part ?? '').slice(0, 200), Number(p.quantity) > 0 ? Number(p.quantity) : 1, companyId, productId, actorId, t);
  });
}

const partLabel = (p: { quantity: number; part: string; productNumber?: string | null }) => `${p.quantity} × ${p.productNumber ? `${p.productNumber} ` : ''}${p.part}`;

/** Whether stock is still reserved for this part line (then its product cannot change and the line cannot go). */
async function lineReserved(db: D1Database, companyId: string, partId: string) {
  const r = await db
    .prepare("SELECT 1 AS x FROM mt_wo_reservations x JOIN erp_reservations r ON r.company_id = x.company_id AND r.id = x.reservation_id WHERE x.company_id = ? AND x.part_id = ? AND r.status = 'open' LIMIT 1")
    .bind(companyId, partId)
    .first();
  return !!r;
}

async function assertProductOnce(db: D1Database, companyId: string, w: { id: string; number: string }, line: PartLine, exceptId?: string) {
  if (!line.productId) return;
  const other = await db.prepare('SELECT id FROM mt_wo_parts WHERE company_id = ? AND work_order_id = ? AND product_id = ? AND id <> ?').bind(companyId, w.id, line.productId, exceptId ?? '').first();
  if (other) throw new HttpError(409, `${line.productNumber} is already a required part of ${w.number}: change its quantity`);
}

/** Runs a part-line change; the one-line-per-product index refusing it (two people at once) answers 409. */
async function runPartLine(db: D1Database, stmts: D1PreparedStatement[], line: PartLine, woNumber: string) {
  try {
    await db.batch(stmts);
  } catch (e) {
    if (isUnique(e) && line.productId) throw new HttpError(409, `${line.productNumber} is already a required part of ${woNumber}: change its quantity`);
    throw e;
  }
}

partsRoutes.post('/c/:company/work-orders/:id/parts', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, partItem);
  const [line] = await checkPartLines(db, a.companyId, [input]);
  await assertProductOnce(db, a.companyId, w, line);
  const pos = await db.prepare('SELECT COALESCE(MAX(position), 0) + 1 AS p FROM mt_wo_parts WHERE company_id = ? AND work_order_id = ?').bind(a.companyId, w.id).first<{ p: number }>();
  const t = now();
  const id = newId();
  await runPartLine(
    db,
    [
      ...partLineStmts(db, a.companyId, w.id, [{ ...line, id }], a.userId, t, pos?.p ?? 1),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'part.added', assetId: w.asset_id, workOrderId: w.id, summary: `Part added: ${partLabel(line)}`, after: line, at: t }),
    ],
    line,
    w.number,
  );
  return c.json({ id }, 201);
});

partsRoutes.patch('/c/:company/work-orders/:id/parts/:partId', async (c) => {
  const { a, w, db } = await workable(c);
  const part = await db.prepare('SELECT x.*, p.number AS product_number FROM mt_wo_parts x LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id WHERE x.company_id = ? AND x.work_order_id = ? AND x.id = ?').bind(a.companyId, w.id, c.req.param('partId')).first<any>();
  if (!part) throw notFound('Part line');
  const input = await body(c, partItem.partial());
  const productChanges = input.productId !== undefined && (input.productId ?? null) !== (part.product_id ?? null);
  if (productChanges && (await lineReserved(db, a.companyId, part.id))) throw new HttpError(409, 'Release the stock reserved for this part first');
  let next: PartLine;
  if (productChanges) {
    // A new product: its name is the part unless one is written; taking the product off keeps the words.
    [next] = await checkPartLines(db, a.companyId, [{ part: input.part ?? (input.productId ? undefined : part.part), productId: input.productId ?? null, quantity: input.quantity ?? part.quantity }]);
    await assertProductOnce(db, a.companyId, w, next, part.id);
  } else {
    const text = input.part !== undefined ? input.part.trim() : part.part;
    if (!text && !part.product_id) throw new HttpError(400, 'Choose a product or write the part');
    next = { part: text || part.part, quantity: input.quantity ?? part.quantity, productId: part.product_id ?? null, productNumber: part.product_number ?? null };
  }
  const before = { part: part.part, quantity: part.quantity, productId: part.product_id ?? null, productNumber: part.product_number ?? null };
  await runPartLine(
    db,
    [
      db.prepare('UPDATE mt_wo_parts SET part = ?, quantity = ?, product_id = ? WHERE company_id = ? AND id = ?').bind(next.part, next.quantity, next.productId, a.companyId, part.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'part.updated', assetId: w.asset_id, workOrderId: w.id, summary: `Part changed: ${partLabel(next)}`, before, after: next }),
    ],
    next,
    w.number,
  );
  return c.json({ ok: true });
});

partsRoutes.delete('/c/:company/work-orders/:id/parts/:partId', async (c) => {
  const { a, w, db } = await workable(c);
  const part = await db.prepare('SELECT x.*, p.number AS product_number FROM mt_wo_parts x LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id WHERE x.company_id = ? AND x.work_order_id = ? AND x.id = ?').bind(a.companyId, w.id, c.req.param('partId')).first<any>();
  if (!part) throw notFound('Part line');
  if (await lineReserved(db, a.companyId, part.id)) throw new HttpError(409, 'Release the stock reserved for this part first');
  await db.batch([
    // The reservations' history stays; they no longer name the line (a composite key cannot set itself to NULL).
    db.prepare('UPDATE mt_wo_reservations SET part_id = NULL WHERE company_id = ? AND part_id = ?').bind(a.companyId, part.id),
    db.prepare('DELETE FROM mt_wo_parts WHERE company_id = ? AND id = ?').bind(a.companyId, part.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'part.removed', assetId: w.asset_id, workOrderId: w.id, summary: `Part removed: ${partLabel({ quantity: part.quantity, part: part.part, productNumber: part.product_number })}`, before: { part: part.part, quantity: part.quantity, productId: part.product_id ?? null } }),
  ]);
  return c.json({ ok: true });
});

/** Products to choose for a required part (technicians and above): what is free in the maintenance stores, no costs. */
partsRoutes.get('/c/:company/parts/products', async (c) => {
  const a = await requireMt(c, 'technician');
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const rows = await c.env.DB.prepare(
    `SELECT p.id, p.number, p.name, p.uom, p.type,
            (SELECT COALESCE(SUM(${STORE_FREE}), 0) FROM ${STORE_STOCK_FROM} WHERE s.company_id = p.company_id AND s.product_id = p.id) AS available
       FROM erp_products p
      WHERE p.company_id = ? AND p.archived_at IS NULL ${q ? "AND (lower(p.number) LIKE ? OR lower(p.name) LIKE ? OR lower(COALESCE(p.sku, '')) LIKE ?)" : ''}
      ORDER BY p.number COLLATE NOCASE LIMIT 30`,
  )
    .bind(a.companyId, ...(q ? [likeOf(q), likeOf(q), likeOf(q)] : []))
    .all<{ id: string; number: string; name: string; uom: string; type: string; available: number }>();
  return c.json({ products: rows.results.map((p) => ({ id: p.id, number: p.number, name: p.name, uom: p.uom, type: p.type, stocked: p.type !== 'service', available: q6(Number(p.available ?? 0)) })) });
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
    db.prepare('DELETE FROM mt_labour_costs WHERE company_id = ? AND labour_id = ?').bind(a.companyId, l.id),
    db.prepare('DELETE FROM mt_labour WHERE company_id = ? AND id = ?').bind(a.companyId, l.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'labour.removed', assetId: w.asset_id, workOrderId: w.id, summary: `Time entry removed: ${l.minutes} min`, before: { labourId: l.id, minutes: l.minutes, userId: l.user_id } }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ downtime

/**
 * The statements that record a work order's downtime (one row per work order, replaced) and its history line. Shared by
 * PUT /downtime and work recorded after it was done; the caller checks the times.
 */
export async function downtimeStmts(db: D1Database, a: Pick<MtAccess, 'companyId' | 'userId'>, w: { id: string; asset_id: string }, input: { startedAt: number; endedAt?: number | null; cause?: string }, t: number) {
  const before = await db.prepare('SELECT started_at, ended_at, cause FROM mt_downtime WHERE company_id = ? AND work_order_id = ?').bind(a.companyId, w.id).first<any>();
  return [
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
  ];
}

partsRoutes.put('/c/:company/work-orders/:id/downtime', async (c) => {
  const { a, w, db } = await workable(c);
  const input = await body(c, z.object({ startedAt: z.number().int().positive(), endedAt: z.number().int().positive().nullable().optional(), cause: zText(500).optional() }));
  const t = now();
  if (input.startedAt > t + 5 * 60_000) throw new HttpError(400, 'Downtime cannot start in the future');
  if (input.endedAt && input.endedAt < input.startedAt) throw new HttpError(400, 'Downtime cannot end before it starts');
  if (input.endedAt && input.endedAt > t + 5 * 60_000) throw new HttpError(400, 'Downtime cannot end in the future');
  await db.batch(await downtimeStmts(db, a, w, input, t));
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

/** Inspections, required parts, parts used (from the ledger), labour costs, downtime, readings and the schedule behind a work order. */
export async function workOrderExtras(db: D1Database, a: MtAccess, w: any) {
  const [moves, labour, downtime, readings, occ] = await db.batch([
    db
      .prepare(
        `SELECT m.*, p.number AS product_number, p.name AS product_name, p.uom, l.code AS location_code, wh.code AS warehouse_code, u.name AS by_name
           FROM erp_stock_moves m JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id
           JOIN erp_locations l ON l.company_id = m.company_id AND l.id = m.location_id JOIN erp_warehouses wh ON wh.company_id = l.company_id AND wh.id = l.warehouse_id
           LEFT JOIN users u ON u.id = m.created_by
          WHERE m.company_id = ? AND m.source_type = 'work_order' AND m.source_id = ? AND m.move_type IN ('maintenance_issue','maintenance_return') ORDER BY m.created_at, m.rowid LIMIT 500`,
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
    requiredParts: await requiredPartsOf(db, a, w),
    stock: {
      moves: mv.map((m) => ({ id: m.id, type: m.move_type, typeLabel: MOVE_NAMES[m.move_type] ?? m.move_type, productId: m.product_id, productNumber: m.product_number, productName: m.product_name, uom: m.uom, locationId: m.location_id, location: `${m.warehouse_code}/${m.location_code}`, lot: m.lot, serial: m.serial, quantity: q6(-m.on_hand_delta), unitCostCents: manager ? m.unit_cost_cents : undefined, valueCents: manager ? -m.value_delta_cents : undefined, byName: m.by_name ?? null, at: m.created_at })),
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

// ------------------------------------------------------------------ required parts on the work order

export const PART_STATUS_LABELS: Record<string, string> = {
  issued: 'Issued',
  reserved: 'Reserved',
  in_stores: 'In the stores',
  on_requisition: 'On a requisition',
  short: 'Short',
  not_stocked: 'Not a stocked product',
  service: 'Service',
  needed: 'Needed',
};
const RESERVATION_LABELS: Record<string, string> = { open: 'Reserved', issued: 'Issued', released: 'Released' };

/** Why a maintenance person cannot raise a requisition: purchasing rights come from ERP roles, not maintenance ones. */
export const REQUISITION_RIGHT_NOTE =
  'Raising a purchase requisition needs an ERP role that may raise requisitions (an engineer, buyer, procurement manager, warehouse or production staff, or an ERP administrator). An ERP administrator gives ERP roles in Administration.';

/** The ERP access of a maintenance person, or none: Maintenance never depends on an ERP role being resolvable. */
export async function erpAccessOrNone(db: D1Database, a: Pick<MtAccess, 'companyId' | 'userId' | 'userName'>): Promise<ErpAccess | null> {
  try {
    return await loadErpAccess(db, a.companyId, { id: a.userId, name: a.userName });
  } catch {
    return null;
  }
}

/**
 * What each required part needs: issued (net of returns), still outstanding, reserved for the line, free in the
 * maintenance stores, short, on a requisition raised from this work order and still to order; with the reservations and
 * the requisitions (and their purchase orders). No costs. Requesters see no stock figures. Requisitions that were
 * rejected or cancelled no longer count as ordering anything.
 */
export async function requiredPartsOf(db: D1Database, a: MtAccess, w: any) {
  const [lines, reservations, requisitions, reqLines, orders, free] = await db.batch([
    db
      .prepare(
        `SELECT x.*, p.number AS product_number, p.name AS product_name, p.uom, p.type AS product_type, p.archived_at AS product_archived, COALESCE(st.issued_qty, 0) AS issued
           FROM mt_wo_parts x LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
           LEFT JOIN mt_wo_stock st ON st.company_id = x.company_id AND st.work_order_id = x.work_order_id AND st.product_id = x.product_id
          WHERE x.company_id = ? AND x.work_order_id = ? ORDER BY x.position, x.created_at`,
      )
      .bind(a.companyId, w.id),
    db
      .prepare(
        `SELECT r.*, x.part_id, s.location_id, s.lot, s.serial, p.number AS product_number, p.name AS product_name, p.uom, l.code AS location_code, wh.code AS warehouse_code, u.name AS by_name
           FROM mt_wo_reservations x JOIN erp_reservations r ON r.company_id = x.company_id AND r.id = x.reservation_id
           JOIN erp_stock s ON s.company_id = r.company_id AND s.id = r.stock_id JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id
           JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses wh ON wh.company_id = l.company_id AND wh.id = l.warehouse_id
           LEFT JOIN users u ON u.id = r.created_by
          WHERE x.company_id = ? AND x.work_order_id = ? ORDER BY r.created_at, r.rowid`,
      )
      .bind(a.companyId, w.id),
    db
      .prepare(
        `SELECT q.id, q.number, q.title, q.status, q.required_date, q.created_at, u.name AS by_name,
                (SELECT COUNT(*) FROM erp_requisition_lines rl WHERE rl.company_id = q.company_id AND rl.requisition_id = q.id) AS line_count
           FROM mt_wo_requisitions x JOIN erp_requisitions q ON q.company_id = x.company_id AND q.id = x.requisition_id LEFT JOIN users u ON u.id = q.requester_id
          WHERE x.company_id = ? AND x.work_order_id = ? ORDER BY q.created_at, q.rowid`,
      )
      .bind(a.companyId, w.id),
    db
      .prepare(
        `SELECT rl.product_id, rl.item, rl.quantity FROM mt_wo_requisitions x JOIN erp_requisitions q ON q.company_id = x.company_id AND q.id = x.requisition_id
           JOIN erp_requisition_lines rl ON rl.company_id = q.company_id AND rl.requisition_id = q.id
          WHERE x.company_id = ? AND x.work_order_id = ? AND q.status IN ('draft','submitted','approved','converted')`,
      )
      .bind(a.companyId, w.id),
    db
      .prepare(
        `SELECT o.id, o.number, o.status, COALESCE(o.requisition_id, f.requisition_id) AS requisition_id FROM erp_purchase_orders o
           LEFT JOIN erp_rfqs f ON f.company_id = o.company_id AND f.id = o.rfq_id
          WHERE o.company_id = ? AND COALESCE(o.requisition_id, f.requisition_id) IN (SELECT x.requisition_id FROM mt_wo_requisitions x WHERE x.company_id = ? AND x.work_order_id = ?)
          ORDER BY o.created_at, o.rowid`,
      )
      .bind(a.companyId, a.companyId, w.id),
    db
      .prepare(
        `SELECT s.product_id, SUM(${STORE_FREE}) AS free FROM ${STORE_STOCK_FROM}
          WHERE s.company_id = ? AND s.product_id IN (SELECT x.product_id FROM mt_wo_parts x WHERE x.company_id = ? AND x.work_order_id = ? AND x.product_id IS NOT NULL)
          GROUP BY s.product_id`,
      )
      .bind(a.companyId, a.companyId, w.id),
  ]);
  const requester = a.role === 'requester';
  const freeBy = new Map((free.results as any[]).map((r) => [r.product_id as string, q6(Number(r.free ?? 0))]));
  const res = (reservations.results as any[]).map((r) => ({ ...r, open: r.status === 'open' ? q6(r.quantity - r.issued_qty - r.released_qty) : 0 }));
  const sameItem = (a1: string, b1: string) => a1.trim().toLowerCase() === b1.trim().toLowerCase();
  const onReq = (productId: string | null, item: string) => q6((reqLines.results as any[]).filter((l) => (productId ? l.product_id === productId : !l.product_id && sameItem(String(l.item), item))).reduce((n, l) => n + Number(l.quantity), 0));
  const out = (lines.results as any[]).map((x) => {
    const product = !!x.product_id;
    const service = product && x.product_type === 'service';
    const stocked = product && !service;
    const issued = product ? q6(Number(x.issued)) : 0;
    const outstanding = Math.max(0, q6(x.quantity - issued));
    const reserved = q6(res.filter((r) => r.part_id === x.id).reduce((n, r) => n + r.open, 0));
    const available = requester || !product ? null : (freeBy.get(x.product_id) ?? 0);
    const shortfall = available === null ? null : Math.max(0, q6(outstanding - reserved - available));
    const onRequisition = onReq(x.product_id ?? null, x.part);
    const toOrder = requester ? null : stocked ? Math.max(0, q6((shortfall ?? 0) - onRequisition)) : Math.max(0, q6(x.quantity - onRequisition));
    let status: string;
    if (!product) status = onRequisition >= x.quantity - 1e-9 ? 'on_requisition' : 'not_stocked';
    else if (service) status = onRequisition >= x.quantity - 1e-9 ? 'on_requisition' : 'service';
    else if (outstanding <= 1e-9) status = 'issued';
    else if (reserved >= outstanding - 1e-9) status = 'reserved';
    else if (shortfall === null) status = onRequisition >= outstanding - reserved - 1e-9 ? 'on_requisition' : 'needed';
    else if (shortfall <= 1e-9) status = 'in_stores';
    else if (onRequisition >= shortfall - 1e-9) status = 'on_requisition';
    else status = 'short';
    return {
      id: x.id,
      position: x.position,
      part: x.part,
      quantity: x.quantity,
      productId: x.product_id ?? null,
      productNumber: x.product_number ?? null,
      productName: x.product_name ?? null,
      uom: x.uom ?? null,
      productType: x.product_type ?? null,
      productArchived: !!x.product_archived,
      stocked,
      issued,
      outstanding,
      reserved,
      available,
      shortfall,
      onRequisition,
      toOrder,
      status,
      statusLabel: PART_STATUS_LABELS[status],
    };
  });
  const pos = orders.results as any[];
  const work = canWork(a, w) && !(LOCKED as string[]).includes(w.status);
  const [inventoryOn, procurementOn, erp] = work
    ? await Promise.all([moduleEnabled(db, 'inventory', a.companyId).catch(() => true), moduleEnabled(db, 'procurement', a.companyId).catch(() => true), erpAccessOrNone(db, a)])
    : [false, false, null];
  const raise = work && procurementOn && !!erp && can(erp, 'requisitions.raise');
  return {
    lines: out,
    reservations: res.map((r) => ({
      id: r.id,
      partId: r.part_id ?? null,
      productId: r.product_id,
      productNumber: r.product_number,
      productName: r.product_name,
      uom: r.uom,
      locationId: r.location_id,
      location: `${r.warehouse_code}/${r.location_code}`,
      lot: r.lot,
      serial: r.serial,
      quantity: q6(r.quantity),
      issued: q6(r.issued_qty),
      released: q6(r.released_qty),
      open: r.open,
      status: r.status,
      statusLabel: RESERVATION_LABELS[r.status] ?? r.status,
      reference: r.reference,
      byName: r.by_name ?? null,
      createdAt: r.created_at,
    })),
    requisitions: (requisitions.results as any[]).map((q) => ({
      id: q.id,
      number: q.number,
      title: q.title,
      status: q.status,
      statusLabel: REQ_LABELS[q.status as keyof typeof REQ_LABELS] ?? q.status,
      requiredDate: q.required_date,
      lineCount: q.line_count,
      purchaseOrders: pos.filter((o) => o.requisition_id === q.id).map((o) => ({ id: o.id, number: o.number, status: o.status, statusLabel: PO_LABELS[o.status as keyof typeof PO_LABELS] ?? o.status })),
      byName: q.by_name ?? null,
      createdAt: q.created_at,
    })),
    can: {
      reserve: work && inventoryOn,
      raiseRequisition: raise,
      requisitionNote: work && !raise ? (procurementOn ? REQUISITION_RIGHT_NOTE : 'Procurement is switched off for this company, so requisitions cannot be raised here.') : null,
    },
  };
}
