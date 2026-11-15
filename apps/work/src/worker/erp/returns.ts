// BIZOMAT ERP, Release 5 part A: customer returns (/api/erp/c/:company/...). Who may do what: access.ts (returns.raise,
// returns.authorise, returns.receive, sales.edit for the credit note). Docs: docs/erp/release-5-supply-chain.md.
//
// Return (RMA-00001) of shipped goods of a sales order, with a reason. Statuses: requested, authorised (by a sales
// manager), rejected, received, closed, or cancelled before it is received. Receiving goes through Release 2's
// customer_return movement (StockOps), into a location chosen by the warehouse (a quarantine location to inspect it
// first), valued at the cost the goods left at, in one transaction with the order line's returned quantity (its CHECK
// refuses returning more than was shipped) and a once-only key. A return may name a Quality inspection or NCR of the
// same company. A draft credit note is made in Finance once per return, through Finance's own createCredit, for the
// order's Finance customer, by someone whose Finance role may create credit notes; it is linked to the shipment's
// invoice when that invoice is approved, else it stands on its own (Finance applies it later).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { createCredit } from '../fin/sales';
import { todayIn } from '../../shared/fin/dates';
import { assertCan, can, requireErp, type ErpAccess } from './access';
import { badState, csvResponse, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zDate, zId, zText } from './util';
import { loadSettings } from './settings';
import { StockOps, onceStmt, q6, runStock } from './stock';
import { stockKey } from './inventory';
import { financeOrgsFor, maybeFin } from './suppliers';
import { recordFiles } from './record-files';
import { label } from './manufacturing';
import { lenient, loadSo, soLines } from './sales';

export const returnRoutes = new Hono<AppEnv>();

export const RMA_STATUS = { requested: 'Requested', authorised: 'Authorised', received: 'Received', closed: 'Closed', rejected: 'Rejected', cancelled: 'Cancelled' } as const;
export const RMA_REASONS = { damaged: 'Damaged in transit', wrong_item: 'Wrong item sent', faulty: 'Faulty', not_needed: 'No longer needed', other: 'Other' } as const;
const zKey = z.string().trim().min(8).max(80).optional();

const RMA_SELECT = `SELECT r.*, o.number AS so_number, o.currency, s.number AS shipment_number, ab.name AS authorised_name, rb.name AS received_name, cb.name AS created_name,
  i.number AS inspection_number, n.number AS ncr_number,
  (SELECT e.status FROM erp_integration_events e WHERE e.company_id = r.company_id AND e.source_type = 'rma' AND e.source_id = r.id AND e.kind = 'finance.credit_note') AS credit_status
  FROM erp_rmas r JOIN erp_sales_orders o ON o.company_id = r.company_id AND o.id = r.so_id LEFT JOIN erp_shipments s ON s.company_id = r.company_id AND s.id = r.shipment_id
  LEFT JOIN users ab ON ab.id = r.authorised_by LEFT JOIN users rb ON rb.id = r.received_by LEFT JOIN users cb ON cb.id = r.created_by
  LEFT JOIN erp_qc_inspections i ON i.company_id = r.company_id AND i.id = r.inspection_id LEFT JOIN erp_qc_ncrs n ON n.company_id = r.company_id AND n.id = r.ncr_id`;

export function rmaDTO(r: any) {
  return {
    id: r.id,
    number: r.number,
    salesOrderId: r.so_id,
    salesOrderNumber: r.so_number,
    shipmentId: r.shipment_id,
    shipmentNumber: r.shipment_number ?? null,
    customerName: r.customer_name,
    status: r.status,
    statusLabel: label(RMA_STATUS, r.status),
    reason: r.reason,
    reasonLabel: label(RMA_REASONS, r.reason),
    details: r.details,
    authorisedByName: r.authorised_name ?? null,
    authorisedAt: r.authorised_at,
    decisionNote: r.decision_note,
    receivedByName: r.received_name ?? null,
    receivedAt: r.received_at,
    inspectionId: r.inspection_id,
    inspectionNumber: r.inspection_number ?? null,
    ncrId: r.ncr_id,
    ncrNumber: r.ncr_number ?? null,
    creditStatus: r.credit_status ?? 'none',
    createdByName: r.created_name ?? null,
    createdAt: r.created_at,
  };
}

async function loadRma(db: D1Database, companyId: string, id: string) {
  const r = await db.prepare(`${RMA_SELECT} WHERE r.company_id = ? AND r.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!r) throw notFound('Return');
  return r;
}

async function rmaLines(db: D1Database, companyId: string, rmaId: string) {
  return (
    await db
      .prepare(
        `SELECT x.*, l.position, l.description, l.uom, l.shipped_qty, l.returned_qty, l.unit_price_cents, l.discount_bp, l.tax_code, p.number AS product_number, p.name AS product_name, lo.code AS location_code, w.code AS warehouse_code, lo.kind AS location_kind
           FROM erp_rma_lines x JOIN erp_so_lines l ON l.company_id = x.company_id AND l.id = x.so_line_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
           LEFT JOIN erp_locations lo ON lo.company_id = x.company_id AND lo.id = x.location_id LEFT JOIN erp_warehouses w ON w.company_id = lo.company_id AND w.id = lo.warehouse_id
          WHERE x.company_id = ? AND x.rma_id = ? ORDER BY l.position`,
      )
      .bind(companyId, rmaId)
      .all<any>()
  ).results;
}

returnRoutes.get('/c/:company/rmas', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['r.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const qp = (k: string) => c.req.query(k)?.trim();
  const status = qp('status');
  if (status === 'open') where.push("r.status IN ('requested','authorised','received')");
  else if (status && Object.hasOwn(RMA_STATUS, status)) {
    where.push('r.status = ?');
    args.push(status);
  }
  if (qp('reason') && Object.hasOwn(RMA_REASONS, qp('reason')!)) {
    where.push('r.reason = ?');
    args.push(qp('reason'));
  }
  if (qp('soId')) {
    where.push('r.so_id = ?');
    args.push(qp('soId'));
  }
  if (qp('q')) {
    where.push('r.search LIKE ?');
    args.push(likeOf(qp('q')!));
  }
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${RMA_SELECT} WHERE ${where.join(' AND ')} ORDER BY r.created_at DESC, r.rowid DESC LIMIT ? OFFSET ?`).bind(...args, csv ? 20000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(rmaDTO);
  if (csv) return csvResponse('returns', [['Number', 'Sales order', 'Shipment', 'Customer', 'Status', 'Reason', 'Details', 'Raised', 'Received', 'Credit note'], ...list.map((r) => [r.number, r.salesOrderNumber, r.shipmentNumber ?? '', r.customerName, r.statusLabel, r.reasonLabel, r.details, new Date(r.createdAt).toISOString().slice(0, 10), r.receivedAt ? new Date(r.receivedAt).toISOString().slice(0, 10) : '', r.creditStatus === 'done' ? 'made' : ''])]);
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_rmas r WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ returns: list, total: total?.n ?? 0, limit, offset, statuses: Object.entries(RMA_STATUS).map(([value, l]) => ({ value, label: l })), reasons: Object.entries(RMA_REASONS).map(([value, l]) => ({ value, label: l })), can: { raise: can(a, 'returns.raise') } });
});

returnRoutes.post('/c/:company/rmas', async (c) => {
  const a = await requireErp(c, 'returns.raise');
  const db = c.env.DB;
  const input = await body(c, z.object({ soId: zId, shipmentId: zId.nullable().optional(), reason: z.enum(Object.keys(RMA_REASONS) as [string, ...string[]]), details: zText(2000).optional(), lines: z.array(z.object({ soLineId: zId, quantity: z.number().positive().max(1e9) })).min(1).max(200) }));
  const o = await loadSo(db, a.companyId, input.soId);
  if (o.status === 'draft' || o.status === 'cancelled') badState('Only goods shipped on an order can come back');
  if (input.shipmentId) {
    const s = await db.prepare("SELECT id FROM erp_shipments WHERE company_id = ? AND id = ? AND so_id = ? AND status IN ('dispatched','delivered')").bind(a.companyId, input.shipmentId, o.id).first();
    if (!s) throw new HttpError(400, 'Choose a dispatched shipment of this order');
  }
  const lines = await soLines(db, a.companyId, o.id);
  const pending = (await db.prepare("SELECT x.so_line_id, SUM(x.quantity - x.received_qty) AS q FROM erp_rma_lines x JOIN erp_rmas r ON r.company_id = x.company_id AND r.id = x.rma_id WHERE x.company_id = ? AND r.so_id = ? AND r.status IN ('requested','authorised') GROUP BY x.so_line_id").bind(a.companyId, o.id).all<{ so_line_id: string; q: number }>()).results;
  const seen = new Set<string>();
  for (const x of input.lines) {
    const l = lines.find((y) => y.id === x.soLineId);
    if (!l) throw new HttpError(400, 'A line of another order was sent');
    if (seen.has(l.id)) throw new HttpError(400, `Line ${l.position} is listed twice`);
    seen.add(l.id);
    const can_ = q6(l.shipped_qty - l.returned_qty - Number(pending.find((p) => p.so_line_id === l.id)?.q ?? 0));
    if (x.quantity > can_ + 1e-9) throw new HttpError(400, `Line ${l.position} (${l.product_number}): at most ${Math.max(0, can_)} can come back (shipped less returned and already asked for)`);
  }
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'rma');
  const t = now();
  await db.batch([
    db.prepare("INSERT INTO erp_rmas (id, company_id, number, so_id, shipment_id, status, reason, details, customer_name, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'requested', ?, ?, ?, ?, ?, ?, ?)").bind(id, a.companyId, number, o.id, input.shipmentId ?? null, input.reason, input.details ?? '', o.customer_name, searchText(number, o.number, o.customer_name, input.details), a.userId, t, t),
    ...input.lines.map((x) => {
      const l = lines.find((y) => y.id === x.soLineId)!;
      return db.prepare('INSERT INTO erp_rma_lines (id, company_id, rma_id, so_line_id, product_id, quantity) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, id, l.id, l.product_id, q6(x.quantity));
    }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rma.requested', entityType: 'rma', entityId: id, summary: `${number} raised for ${o.number} (${o.customer_name}): ${label(RMA_REASONS, input.reason).toLowerCase()}`, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.return_raised', entityType: 'sales_order', entityId: o.id, summary: `Return ${number} raised`, at: t }),
  ]);
  return c.json({ id, number }, 201);
});

returnRoutes.get('/c/:company/rmas/:id', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const r = await loadRma(db, a.companyId, c.req.param('id'));
  const lines = await rmaLines(db, a.companyId, r.id);
  const credit = await db.prepare("SELECT * FROM erp_integration_events WHERE company_id = ? AND source_type = 'rma' AND source_id = ? AND kind = 'finance.credit_note'").bind(a.companyId, r.id).first<any>();
  return c.json({
    rma: rmaDTO(r),
    lines: lines.map((x) => ({ id: x.id, soLineId: x.so_line_id, position: x.position, productId: x.product_id, productNumber: x.product_number, productName: x.product_name, uom: x.uom, quantity: q6(x.quantity), receivedQty: q6(x.received_qty), location: x.location_code ? `${x.warehouse_code}/${x.location_code}` : null, quarantine: x.location_kind === 'quarantine', lot: x.lot, serial: x.serial, unitCostCents: x.unit_cost_cents, unitPriceCents: x.unit_price_cents })),
    credit: await creditInfo(c, a, r, credit),
    files: await recordFiles(db, a.companyId, 'rma', r.id),
    history: await historyOf(db, a.companyId, { entityType: 'rma', entityId: r.id }),
    can: {
      authorise: can(a, 'returns.authorise') && r.status === 'requested',
      receive: can(a, 'returns.receive') && r.status === 'authorised',
      cancel: can(a, 'returns.raise') && ['requested', 'authorised'].includes(r.status),
      close: can(a, 'returns.authorise') && r.status === 'received',
      quality: (can(a, 'returns.raise') || can(a, 'quality.raise')) && !['cancelled', 'rejected'].includes(r.status),
    },
  });
});

returnRoutes.post('/c/:company/rmas/:id/:action{authorise|reject|cancel|close}', async (c) => {
  const action = c.req.param('action');
  const a = await requireErp(c, action === 'cancel' ? 'returns.raise' : 'returns.authorise');
  const db = c.env.DB;
  const r = await loadRma(db, a.companyId, c.req.param('id'));
  const input = await lenient(c, z.object({ note: zText(1000).optional() }));
  const from: Record<string, string[]> = { authorise: ['requested'], reject: ['requested'], cancel: ['requested', 'authorised'], close: ['received'] };
  const to: Record<string, string> = { authorise: 'authorised', reject: 'rejected', cancel: 'cancelled', close: 'closed' };
  if (!from[action].includes(r.status)) badState(`${r.number} is ${label(RMA_STATUS, r.status).toLowerCase()}`);
  if (action === 'reject' && !input.note) throw new HttpError(400, 'Say why the return is rejected');
  const t = now();
  const set = action === 'authorise' || action === 'reject' ? ', authorised_by = ?, authorised_at = ?, decision_note = ?' : action === 'close' ? ', closed_by = ?, closed_at = ?' : '';
  const setArgs = action === 'authorise' || action === 'reject' ? [a.userId, t, input.note ?? ''] : action === 'close' ? [a.userId, t] : [];
  const res = await db.batch([
    db.prepare(`UPDATE erp_rmas SET status = ?${set}, updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`).bind(to[action], ...setArgs, t, a.companyId, r.id, r.status),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `rma.${to[action]}`, entityType: 'rma', entityId: r.id, summary: `${r.number} ${to[action]}${input.note ? `: ${input.note}` : ''}`, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This return changed at the same moment: refresh');
  return c.json({ ok: true });
});

/** The cost a sales order line's goods left at: the value of its dispatch movements over their quantity. */
async function dispatchedUnitCost(db: D1Database, companyId: string, soLineId: string): Promise<number | null> {
  const r = await db
    .prepare(
      `SELECT SUM(-m.value_delta_cents) AS v, SUM(-m.on_hand_delta) AS q FROM erp_stock_moves m
        WHERE m.company_id = ? AND m.move_type = 'sales_dispatch' AND m.source_type = 'shipment'
          AND m.source_id IN (SELECT x.shipment_id FROM erp_shipment_lines x WHERE x.company_id = ? AND x.so_line_id = ?)
          AND m.product_id = (SELECT product_id FROM erp_so_lines WHERE company_id = ? AND id = ?)`,
    )
    .bind(companyId, companyId, soLineId, companyId, soLineId)
    .first<{ v: number | null; q: number | null }>();
  return r?.q && r.q > 1e-9 ? Number(r.v) / Number(r.q) : null;
}

returnRoutes.post('/c/:company/rmas/:id/receive', async (c) => {
  const a = await requireErp(c, 'returns.receive');
  const db = c.env.DB;
  const r = await loadRma(db, a.companyId, c.req.param('id'));
  if (r.status === 'received' || r.status === 'closed') return c.json({ ok: true, existing: true });
  if (r.status !== 'authorised') badState(r.status === 'requested' ? 'A sales manager authorises the return before it is received' : `${r.number} is ${label(RMA_STATUS, r.status).toLowerCase()}`);
  const input = await body(c, z.object({ lines: z.array(z.object({ lineId: zId, quantity: z.number().min(0).max(1e9), locationId: zId, lot: zText(80).optional(), serial: zText(80).optional(), expiry: zDate.optional() })).min(1).max(200), note: zText(500).optional(), requestKey: zKey }));
  const lines = await rmaLines(db, a.companyId, r.id);
  const settings = await loadSettings(db, a.companyId);
  const t = now();
  const ops = new StockOps(db, a, settings, t);
  const after: D1PreparedStatement[] = [];
  const done: string[] = [];
  for (const x of input.lines) {
    const l = lines.find((y) => y.id === x.lineId);
    if (!l) throw new HttpError(400, 'A line of another return was sent');
    if (x.quantity > l.quantity + 1e-9) throw new HttpError(400, `${l.product_number}: ${q6(l.quantity)} was authorised to come back`);
    if (x.quantity <= 1e-9) continue;
    // a lot's expiry, when not given, is the one it had in stock
    const expiry = x.expiry ?? (x.lot ? ((await db.prepare("SELECT expiry FROM erp_stock WHERE company_id = ? AND product_id = ? AND lot = ? AND expiry IS NOT NULL LIMIT 1").bind(a.companyId, l.product_id, x.lot).first<{ expiry: string }>())?.expiry ?? null) : null);
    const { key, l: loc } = await stockKey(db, a.companyId, { productId: l.product_id, locationId: x.locationId, lot: x.lot, serial: x.serial }, { incoming: true, quantity: x.quantity, expiry });
    const cost = await dispatchedUnitCost(db, a.companyId, l.so_line_id);
    await ops.addIn('customer_return', key, x.quantity, { source: 'rma', sourceId: r.id, reference: `${r.number} ${r.so_number}`, reason: `${label(RMA_REASONS, r.reason)}${input.note ? `: ${input.note}` : ''}`, unitCost: cost, expiry });
    after.push(
      db.prepare('UPDATE erp_rma_lines SET received_qty = ?, location_id = ?, lot = ?, serial = ?, unit_cost_cents = ? WHERE company_id = ? AND id = ?').bind(q6(x.quantity), loc.id, key.lot ?? '', key.serial ?? '', cost, a.companyId, l.id),
      // the order line's CHECK refuses returning more than was shipped
      db.prepare('UPDATE erp_so_lines SET returned_qty = round(returned_qty + ?, 6) WHERE company_id = ? AND id = ?').bind(q6(x.quantity), a.companyId, l.so_line_id),
    );
    done.push(`${q6(x.quantity)} ${l.uom} of ${l.product_number} into ${loc.warehouse_code}/${loc.code}${loc.kind === 'quarantine' ? ' (quarantine)' : ''}`);
  }
  if (!done.length) throw new HttpError(400, 'Receive at least one unit');
  after.push(
    db.prepare("UPDATE erp_rmas SET status = 'received', received_by = ?, received_at = ?, group_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'authorised'").bind(a.userId, t, ops.groupId, t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rma.received', entityType: 'rma', entityId: r.id, summary: `${r.number} received: ${done.join(', ')}`, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.return_received', entityType: 'sales_order', entityId: r.so_id, summary: `Return ${r.number} received`, at: t }),
  );
  try {
    await runStock(db, ops.all([onceStmt(db, a.companyId, `rma-receive:${r.id}`, t)], after, { type: 'rma', id: r.id }));
  } catch (e) {
    if (e instanceof HttpError && e.status === 409) {
      const again = await loadRma(db, a.companyId, r.id);
      if (again.status === 'received') return c.json({ ok: true, existing: true });
    }
    throw e;
  }
  return c.json({ ok: true, groupId: ops.groupId }, 201);
});

/** Links a return to a Quality inspection or NCR of the same company (read only: nothing in Quality changes). */
returnRoutes.put('/c/:company/rmas/:id/quality', async (c) => {
  const a = await requireErp(c, 'sales.view');
  if (!can(a, 'returns.raise') && !can(a, 'quality.raise')) assertCan(a, 'returns.raise');
  const db = c.env.DB;
  const r = await loadRma(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ inspectionId: zId.nullable().optional(), ncrId: zId.nullable().optional() }));
  if (input.inspectionId) {
    const i = await db.prepare('SELECT 1 FROM erp_qc_inspections WHERE company_id = ? AND id = ?').bind(a.companyId, input.inspectionId).first();
    if (!i) throw new HttpError(400, 'Choose an inspection of this company');
  }
  if (input.ncrId) {
    const n = await db.prepare('SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ?').bind(a.companyId, input.ncrId).first();
    if (!n) throw new HttpError(400, 'Choose a nonconformance of this company');
  }
  const t = now();
  const inspectionId = input.inspectionId !== undefined ? input.inspectionId : r.inspection_id;
  const ncrId = input.ncrId !== undefined ? input.ncrId : r.ncr_id;
  await db.batch([
    db.prepare('UPDATE erp_rmas SET inspection_id = ?, ncr_id = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(inspectionId, ncrId, t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rma.quality_linked', entityType: 'rma', entityId: r.id, summary: `${r.number}: linked to quality records`, after: { inspectionId, ncrId }, at: t }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ the draft credit note in Finance

async function creditInfo(c: any, a: ErpAccess, r: any, ev: any | null) {
  const db = c.env.DB as D1Database;
  const so = await loadSo(db, a.companyId, r.so_id);
  const org = (await financeOrgsFor(db, a)).find((o) => o.id === (so.fin_org_id ?? ''));
  const fa = org ? await maybeFin(db, org.id, c.get('user')) : null;
  let reason: string | null = null;
  if (!org) reason = 'The company does not run a Finance business workspace for this order.';
  else if (!so.fin_contact_id) reason = 'The order has no Finance customer: make its invoice first, which links it.';
  else if (!fa) reason = 'You have no access to the company’s Finance workspace.';
  else if (!fa.perms.sales.create) reason = 'Your Finance role cannot create credit notes.';
  else if (!can(a, 'sales.edit')) reason = 'Only sales managers and ERP administrators can ask for the credit note.';
  else if (!['received', 'closed'].includes(r.status)) reason = 'The credit note is made once the goods are received back.';
  const done = ev?.status === 'done';
  return {
    status: ev?.status ?? 'none',
    creditNoteId: done ? ev.target_ref : null,
    url: done && fa && ev.target_org_id === fa.orgId ? `/erp/finance/o/${fa.orgId}/credit-notes/${ev.target_ref}` : null,
    canCreate: !done && !reason,
    reason: done ? null : reason,
    lastError: ev?.status === 'failed' ? ev.last_error : null,
  };
}

const SALES_TAX_KEYS: Record<string, string> = { GST: 'gst_sales', NONE: 'free_sales' };

returnRoutes.post('/c/:company/rmas/:id/credit-note', async (c) => {
  const a = await requireErp(c, 'sales.edit');
  const db = c.env.DB;
  const r = await loadRma(db, a.companyId, c.req.param('id'));
  if (!['received', 'closed'].includes(r.status)) badState('The credit note is made once the goods are received back');
  const so = await loadSo(db, a.companyId, r.so_id);
  const org = (await financeOrgsFor(db, a)).find((x) => x.id === (so.fin_org_id ?? ''));
  if (!org) badState('The company does not run a Finance business workspace for this order');
  if (!so.fin_contact_id) badState('The order has no Finance customer: make its invoice first, which links it');
  const fa = await maybeFin(db, org.id, c.get('user'));
  if (!fa) throw new HttpError(403, 'You have no access to the company’s Finance workspace');
  if (!fa.perms.sales.create) throw new HttpError(403, 'Your Finance role cannot create credit notes');
  const key = `credit:rma:${a.companyId}:${r.id}`;
  const t = now();
  await db
    .prepare("INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, target_org_id, created_by, created_at, updated_at) VALUES (?, ?, 'finance.credit_note', 'rma', ?, 'finance', ?, 'pending', 0, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING")
    .bind(newId(), a.companyId, r.id, key, org.id, a.userId, t, t)
    .run();
  const ev = (await db.prepare('SELECT * FROM erp_integration_events WHERE idempotency_key = ?').bind(key).first<any>())!;
  if (ev.status === 'done') return c.json({ creditNoteId: ev.target_ref, existing: true, url: `/erp/finance/o/${ev.target_org_id}/credit-notes/${ev.target_ref}` });
  const claim = await db
    .prepare("UPDATE erp_integration_events SET attempts = attempts + 1, status = 'pending', updated_at = ? WHERE idempotency_key = ? AND attempts = ? AND status IN ('pending','failed') AND (attempts = 0 OR status = 'failed' OR updated_at < ?)")
    .bind(t, key, ev.attempts, t - 120_000)
    .run();
  if (!claim.meta.changes) throw new HttpError(409, 'The draft credit note is being made now: refresh in a moment');
  const reference = `${r.number} ${so.number}`;
  try {
    const before = await db.prepare('SELECT id FROM fin_credit_notes WHERE org_id = ? AND reference = ? AND deleted_at IS NULL').bind(org.id, reference).first<{ id: string }>();
    let creditId = before?.id;
    if (!creditId) {
      const lines = (await rmaLines(db, a.companyId, r.id)).filter((l) => l.received_qty > 1e-9);
      if (!lines.length) badState('Nothing was received on this return');
      const codes = await db.prepare('SELECT id, system_key FROM fin_tax_codes WHERE org_id = ? AND archived_at IS NULL').bind(org.id).all<{ id: string; system_key: string | null }>();
      const ids = new Set(codes.results.map((x) => x.id));
      const bySystem = new Map(codes.results.filter((x) => x.system_key).map((x) => [x.system_key!, x.id]));
      const taxCodeFor = (code: string) => (ids.has(code) ? code : SALES_TAX_KEYS[code] ? (bySystem.get(SALES_TAX_KEYS[code]) ?? null) : null);
      const sales = await db.prepare("SELECT id FROM fin_accounts WHERE org_id = ? AND type = 'revenue' AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1").bind(org.id).first<{ id: string }>();
      // linked to the shipment's invoice when Finance has approved it (a credit note corrects an approved invoice)
      const inv = r.shipment_id ? await db.prepare("SELECT e.target_ref FROM erp_integration_events e WHERE e.company_id = ? AND e.source_type = 'shipment' AND e.source_id = ? AND e.kind = 'finance.draft_invoice' AND e.status = 'done'").bind(a.companyId, r.shipment_id).first<{ target_ref: string }>() : null;
      const invoice = inv ? await db.prepare("SELECT id, status, contact_id FROM fin_docs WHERE id = ? AND org_id = ? AND kind = 'invoice' AND deleted_at IS NULL").bind(inv.target_ref, org.id).first<{ id: string; status: string; contact_id: string }>() : null;
      const invoiceId = invoice && ['approved', 'part_paid', 'paid'].includes(invoice.status) && invoice.contact_id === so.fin_contact_id ? invoice.id : null;
      const made = await createCredit(c.env, fa, {
        contactId: so.fin_contact_id,
        invoiceId,
        issueDate: todayIn(fa.org.timezone || 'Australia/Sydney'),
        reference,
        reason: `${label(RMA_REASONS, r.reason)}${r.details ? `: ${r.details}` : ''}`.slice(0, 1000),
        taxMode: so.tax_mode,
        notes: `Made from BIZOMAT ERP return ${r.number} of sales order ${so.number}. Check the amounts, GST and accounts before approving.`,
        action: 'draft',
        lines: lines.map((l) => ({ itemCode: l.product_number ?? '', description: `${l.description} - returned on ${r.number}`.slice(0, 1000), unit: l.uom, quantity: Math.round(l.received_qty * 1000) / 1000, unitPrice: l.unit_price_cents, discountBp: l.discount_bp, accountId: sales?.id ?? null, taxCodeId: taxCodeFor(l.tax_code) })),
      });
      creditId = made.id;
    }
    await db.batch([
      db.prepare("UPDATE erp_integration_events SET status = 'done', target_ref = ?, target_org_id = ?, last_error = '', updated_at = ? WHERE idempotency_key = ?").bind(creditId, org.id, now(), key),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rma.credit_drafted', entityType: 'rma', entityId: r.id, summary: `Draft credit note made in Finance for ${r.number} (${reference})`, after: { finOrg: org.id, creditNote: creditId }, at: now() }),
    ]);
    return c.json({ creditNoteId: creditId, existing: !!before, url: `/erp/finance/o/${org.id}/credit-notes/${creditId}` }, before ? 200 : 201);
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : 'Finance could not make the credit note';
    await db.prepare("UPDATE erp_integration_events SET status = 'failed', last_error = ?, updated_at = ? WHERE idempotency_key = ?").bind(msg.slice(0, 200), now(), key).run();
    throw e;
  }
});
