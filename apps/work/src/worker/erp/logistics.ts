// BIZOMAT ERP, Release 5 part A: carriers, shipments and their pick lists, packages, dispatch, delivery confirmation,
// the customer's dispatch email, the delivery schedule and the draft invoice in Finance (/api/erp/c/:company/...). Who
// may do what: access.ts (carriers.setup, shipping.plan, shipping.pick, shipping.pack, shipping.dispatch,
// shipping.deliver, sales.edit for the invoice). Docs: docs/erp/release-5-supply-chain.md.
//
// Shipment (SHP-00001) of a sales order: the allocated stock it carries, line by line. Its pick list comes from the
// lines' allocations (Release 2 reservations: soonest expiry first, then the oldest). Statuses: planned, picking,
// picked, packed, dispatched, delivered, cancelled.
//
// Dispatch issues the picked stock through StockOps (movement sales_dispatch, source shipment) and consumes its
// reservations, in one transaction with the order line's shipped quantity (its CHECK refuses shipping more than was
// ordered) and a once-only key, so a double submission makes one dispatch and two dispatches of the last unit cannot both
// succeed (the stock CHECK). The Finance posting of the stock's value is recorded as planned, as every stock movement's is.
//
// The dispatch email to the customer is asked for per shipment, goes through the email outbox, is never sent for the
// example company, and the shipment records what happened to it (queued, not set up on this service, no address...).
//
// Draft invoice: one draft customer invoice per shipment, through Finance's own createDoc (kind invoice) in the
// company's Finance business workspace, for the order's Finance customer, by someone whose Finance role may create
// invoices. The shipped quantities at the order's prices, discounts and tax codes, and the freight charge as a line.
// Idempotent and claim-guarded exactly as Release 2's draft bill (erp_integration_events); nothing is written to fin_*
// outside Finance's functions.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { createDoc } from '../fin/docs';
import { queueAndKick } from '../services/email/outbox';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';
import { todayIn } from '../../shared/fin/dates';
import { assertCan, can, requireErp, type ErpAccess } from './access';
import { badState, csvResponse, dollars, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zDate, zId, zText } from './util';
import { loadSettings } from './settings';
import { StockOps, onceStmt, q6, runStock, type StockKey } from './stock';
import { financeOrgsFor, maybeFin } from './suppliers';
import { recordFiles } from './record-files';
import { addDays, label, todayIso } from './manufacturing';
import { OPEN_SO, customerEmail, lenient, lineAllocations, loadSo, pickTax, salesTaxOptions, soLines, soStatusStmt } from './sales';

export const logisticsRoutes = new Hono<AppEnv>();

export const SHIPMENT_STATUS = { planned: 'Planned', picking: 'Picking', picked: 'Picked', packed: 'Packed', dispatched: 'Dispatched', delivered: 'Delivered', cancelled: 'Cancelled' } as const;
export const PACKAGE_KINDS = { box: 'Box', carton: 'Carton', pallet: 'Pallet', crate: 'Crate', envelope: 'Envelope', other: 'Other' } as const;
export const NOTIFY_STATUS: Record<string, string> = {
  '': '',
  queued: 'Dispatch email queued to the customer',
  not_configured: 'Not sent: email is not set up on this service',
  example: 'Not sent: the example company sends no email',
  no_address: 'Not sent: the customer has no email address',
  invalid_address: 'Not sent: the email address is not valid',
  suppressed: 'Not sent: email to this address bounced or was refused before',
  duplicate: 'Already queued',
  failed: 'Not sent: the email could not be queued',
};
const OPEN_SHIPMENT = ['planned', 'picking', 'picked', 'packed'];
const zKey = z.string().trim().min(8).max(80).optional();
const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/;
const zEmail = z.string().trim().email('Enter a valid email address').max(254);

// ------------------------------------------------------------------ carriers

const carrierDTO = (c: any) => ({
  id: c.id,
  code: c.code,
  name: c.name,
  services: parseJson<string[]>(c.services_json, []),
  trackingUrl: c.tracking_url,
  phone: c.phone,
  email: c.email,
  accountRef: c.account_ref,
  notes: c.notes,
  archived: !!c.archived_at,
  shipments: c.shipments ?? undefined,
  createdAt: c.created_at,
});

/** The carrier's tracking page for a tracking number, from its template (https only). */
export function trackingLink(template: string | null | undefined, tracking: string | null | undefined): string | null {
  if (!template || !tracking) return null;
  const url = template.replace('{tracking}', encodeURIComponent(tracking));
  return /^https:\/\//.test(url) ? url : null;
}

const zTrackingUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === '' || (/^https:\/\/[^\s]+$/.test(v) && v.includes('{tracking}')), 'Use an https address with {tracking} where the tracking number goes');
const zCarrier = {
  code: zText(40).regex(CODE_RE, 'Use letters, digits and . _ / - (up to 40)'),
  name: zText(200).min(1, 'Give the carrier’s name'),
  services: z.array(zText(80).min(1)).max(30).optional(),
  trackingUrl: zTrackingUrl.optional(),
  phone: zText(50).optional(),
  email: z.union([zEmail, z.literal('')]).optional(),
  accountRef: zText(100).optional(),
  notes: zText(2000).optional(),
};

logisticsRoutes.get('/c/:company/carriers', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const all = c.req.query('archived') === '1';
  const rows = await c.env.DB.prepare(`SELECT ca.*, (SELECT COUNT(*) FROM erp_shipments s WHERE s.company_id = ca.company_id AND s.carrier_id = ca.id AND s.status <> 'cancelled') AS shipments FROM erp_carriers ca WHERE ca.company_id = ? ${all ? '' : 'AND ca.archived_at IS NULL'} ORDER BY ca.name COLLATE NOCASE`).bind(a.companyId).all<any>();
  return c.json({ carriers: rows.results.map(carrierDTO), can: { setup: can(a, 'carriers.setup') } });
});

logisticsRoutes.post('/c/:company/carriers', async (c) => {
  const a = await requireErp(c, 'carriers.setup');
  const db = c.env.DB;
  const input = await body(c, z.object(zCarrier));
  const dup = await db.prepare('SELECT 1 FROM erp_carriers WHERE company_id = ? AND code = ?').bind(a.companyId, input.code).first();
  if (dup) throw new HttpError(409, `A carrier with the code ${input.code} exists`);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO erp_carriers (id, company_id, code, name, services_json, tracking_url, phone, email, account_ref, notes, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, input.code, input.name, JSON.stringify([...new Set(input.services ?? [])]), input.trackingUrl ?? '', input.phone ?? '', input.email ?? '', input.accountRef ?? '', input.notes ?? '', a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'carrier.created', entityType: 'carrier', entityId: id, summary: `Carrier ${input.code} ${input.name} added`, at: t }),
  ]);
  return c.json({ id }, 201);
});

logisticsRoutes.patch('/c/:company/carriers/:id', async (c) => {
  const a = await requireErp(c, 'carriers.setup');
  const db = c.env.DB;
  const ca = await db.prepare('SELECT * FROM erp_carriers WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!ca) throw notFound('Carrier');
  const input = await body(c, z.object({ ...zCarrier, code: zCarrier.code.optional(), name: zCarrier.name.optional(), archived: z.boolean().optional() }));
  if (input.code && input.code.toLowerCase() !== String(ca.code).toLowerCase()) {
    const dup = await db.prepare('SELECT 1 FROM erp_carriers WHERE company_id = ? AND code = ? AND id <> ?').bind(a.companyId, input.code, ca.id).first();
    if (dup) throw new HttpError(409, `A carrier with the code ${input.code} exists`);
  }
  const t = now();
  const next = {
    code: input.code ?? ca.code,
    name: input.name ?? ca.name,
    services_json: input.services ? JSON.stringify([...new Set(input.services)]) : ca.services_json,
    tracking_url: input.trackingUrl ?? ca.tracking_url,
    phone: input.phone ?? ca.phone,
    email: input.email ?? ca.email,
    account_ref: input.accountRef ?? ca.account_ref,
    notes: input.notes ?? ca.notes,
    archived_at: input.archived === undefined ? ca.archived_at : input.archived ? (ca.archived_at ?? t) : null,
  };
  await db.batch([
    db.prepare('UPDATE erp_carriers SET code = ?, name = ?, services_json = ?, tracking_url = ?, phone = ?, email = ?, account_ref = ?, notes = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(next.code, next.name, next.services_json, next.tracking_url, next.phone, next.email, next.account_ref, next.notes, next.archived_at, t, a.companyId, ca.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'carrier.changed', entityType: 'carrier', entityId: ca.id, summary: `Carrier ${next.code} ${next.name} ${input.archived === true ? 'archived' : input.archived === false ? 'restored' : 'changed'}`, at: t }),
  ]);
  return c.json(carrierDTO({ ...ca, ...next, updated_at: t }));
});

async function loadCarrier(db: D1Database, companyId: string, id: string) {
  const ca = await db.prepare('SELECT * FROM erp_carriers WHERE company_id = ? AND id = ?').bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!ca) throw new HttpError(400, 'Choose a carrier of this company');
  return ca;
}

function checkService(ca: any, service: string | undefined) {
  if (!service) return '';
  const list = parseJson<string[]>(ca.services_json, []);
  if (list.length && !list.includes(service)) throw new HttpError(400, `${ca.name} offers: ${list.join(', ')}`);
  return service;
}

// ------------------------------------------------------------------ shipments: loading and DTOs

const SHP_SELECT = `SELECT s.*, o.number AS so_number, o.customer_name, o.customer_po, o.currency, o.promised_date AS so_promised, o.requested_date AS so_requested, o.status AS so_status, o.tax_mode,
  ca.code AS carrier_code, ca.name AS carrier_name, ca.tracking_url AS carrier_tracking_url, db_.name AS dispatched_name, dr.name AS delivery_recorded_name,
  (SELECT COUNT(*) FROM erp_packages p WHERE p.company_id = s.company_id AND p.shipment_id = s.id) AS package_count,
  (SELECT COALESCE(SUM(p.weight_kg), 0) FROM erp_packages p WHERE p.company_id = s.company_id AND p.shipment_id = s.id) AS weight_kg,
  (SELECT e.status FROM erp_integration_events e WHERE e.company_id = s.company_id AND e.source_type = 'shipment' AND e.source_id = s.id AND e.kind = 'finance.draft_invoice') AS invoice_status
  FROM erp_shipments s JOIN erp_sales_orders o ON o.company_id = s.company_id AND o.id = s.so_id
  LEFT JOIN erp_carriers ca ON ca.company_id = s.company_id AND ca.id = s.carrier_id LEFT JOIN users db_ ON db_.id = s.dispatched_by LEFT JOIN users dr ON dr.id = s.delivery_recorded_by`;

export function shipmentDTO(s: any) {
  const today = todayIso();
  const due = s.window_end ?? s.planned_date;
  return {
    id: s.id,
    number: s.number,
    salesOrderId: s.so_id,
    salesOrderNumber: s.so_number,
    customerName: s.customer_name,
    customerPo: s.customer_po,
    status: s.status,
    statusLabel: label(SHIPMENT_STATUS, s.status),
    carrierId: s.carrier_id,
    carrierCode: s.carrier_code ?? null,
    carrierName: s.carrier_name ?? null,
    service: s.service,
    trackingNumber: s.tracking_number,
    trackingUrl: trackingLink(s.carrier_tracking_url, s.tracking_number),
    freightCostCents: s.freight_cost_cents,
    freightChargeCents: s.freight_charge_cents,
    freightTaxCode: s.freight_tax_code,
    currency: s.currency,
    plannedDate: s.planned_date,
    windowStart: s.window_start,
    windowEnd: s.window_end,
    shipTo: s.ship_to,
    notes: s.notes,
    notify: !!s.notify,
    notifyEmail: s.notify_email,
    notifyStatus: s.notify_status,
    notifyLabel: NOTIFY_STATUS[s.notify_status] ?? s.notify_status,
    packages: s.package_count ?? 0,
    weightKg: s.weight_kg === undefined ? undefined : Math.round(Number(s.weight_kg) * 1000) / 1000,
    dispatchedAt: s.dispatched_at,
    dispatchedByName: s.dispatched_name ?? null,
    deliveredAt: s.delivered_at,
    receivedBy: s.received_by,
    deliveryNote: s.delivery_note,
    deliveryRecordedByName: s.delivery_recorded_name ?? null,
    cancelledAt: s.cancelled_at,
    cancelReason: s.cancel_reason,
    invoiceStatus: s.invoice_status ?? 'none',
    late: OPEN_SHIPMENT.includes(s.status) && !!due && due < today,
    createdAt: s.created_at,
  };
}

export async function loadShipment(db: D1Database, companyId: string, id: string) {
  const s = await db.prepare(`${SHP_SELECT} WHERE s.company_id = ? AND s.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!s) throw notFound('Shipment');
  return s;
}

async function shipmentLines(db: D1Database, companyId: string, shipmentId: string) {
  return (
    await db
      .prepare(
        `SELECT x.*, l.position, l.description, l.uom, l.quantity AS ordered, l.unit_price_cents, l.discount_bp, l.tax_code, l.tax_rate_bp, l.shipped_qty AS line_shipped, p.number AS product_number, p.name AS product_name
           FROM erp_shipment_lines x JOIN erp_so_lines l ON l.company_id = x.company_id AND l.id = x.so_line_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
          WHERE x.company_id = ? AND x.shipment_id = ? ORDER BY l.position`,
      )
      .bind(companyId, shipmentId)
      .all<any>()
  ).results;
}

async function pickLines(db: D1Database, companyId: string, shipmentId: string) {
  return (
    await db
      .prepare(
        `SELECT k.*, p.number AS product_number, p.name AS product_name, p.uom, l.code AS location_code, l.name AS location_name, w.code AS warehouse_code, u.name AS picked_name,
                r.status AS reservation_status, r.quantity - r.issued_qty - r.released_qty AS reservation_open
           FROM erp_pick_lines k JOIN erp_products p ON p.company_id = k.company_id AND p.id = k.product_id JOIN erp_locations l ON l.company_id = k.company_id AND l.id = k.location_id
           JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id LEFT JOIN users u ON u.id = k.picked_by LEFT JOIN erp_reservations r ON r.company_id = k.company_id AND r.id = k.reservation_id
          WHERE k.company_id = ? AND k.shipment_id = ? ORDER BY w.code, l.code, k.position`,
      )
      .bind(companyId, shipmentId)
      .all<any>()
  ).results;
}

const pickDTO = (k: any) => ({
  id: k.id,
  shipmentLineId: k.shipment_line_id,
  productId: k.product_id,
  productNumber: k.product_number,
  productName: k.product_name,
  uom: k.uom,
  locationId: k.location_id,
  location: `${k.warehouse_code}/${k.location_code}`,
  locationName: k.location_name,
  lot: k.lot,
  serial: k.serial,
  expiry: k.expiry,
  suggestedQty: q6(k.suggested_qty),
  pickedQty: k.picked_qty === null ? null : q6(k.picked_qty),
  pickedByName: k.picked_name ?? null,
  pickedAt: k.picked_at,
});

const packageDTO = (p: any) => ({ id: p.id, seq: p.seq, kind: p.kind, kindLabel: label(PACKAGE_KINDS, p.kind), weightKg: p.weight_kg, lengthCm: p.length_cm, widthCm: p.width_cm, heightCm: p.height_cm, contents: parseJson<{ soLineId: string; productNumber: string; quantity: number }[]>(p.contents_json, []), notes: p.notes, createdAt: p.created_at });

/** The shipment's status from its pick lines (planned, picking, picked), written in the same transaction as a pick. */
function pickStatusStmts(db: D1Database, companyId: string, shipmentId: string, t: number) {
  return [
    db
      .prepare('UPDATE erp_shipment_lines SET picked_qty = (SELECT COALESCE(round(SUM(COALESCE(k.picked_qty, 0)), 6), 0) FROM erp_pick_lines k WHERE k.company_id = erp_shipment_lines.company_id AND k.shipment_line_id = erp_shipment_lines.id) WHERE company_id = ? AND shipment_id = ?')
      .bind(companyId, shipmentId),
    db
      .prepare(
        `UPDATE erp_shipments SET status = CASE
           WHEN NOT EXISTS (SELECT 1 FROM erp_pick_lines k WHERE k.company_id = ?1 AND k.shipment_id = ?2 AND k.picked_qty IS NULL) THEN 'picked'
           WHEN EXISTS (SELECT 1 FROM erp_pick_lines k WHERE k.company_id = ?1 AND k.shipment_id = ?2 AND k.picked_qty IS NOT NULL) THEN 'picking'
           ELSE 'planned' END, updated_at = ?3
         WHERE company_id = ?1 AND id = ?2 AND status IN ('planned','picking','picked')`,
      )
      .bind(companyId, shipmentId, t),
  ];
}

// ------------------------------------------------------------------ shipments: plan

const zShipmentFields = {
  carrierId: zId.nullable().optional(),
  service: zText(80).optional(),
  trackingNumber: zText(100).optional(),
  freightCostCents: z.number().int().min(0).max(1e11).optional(),
  freightChargeCents: z.number().int().min(0).max(1e11).optional(),
  freightTaxCode: zText(64).optional(),
  plannedDate: zDate.optional(),
  windowStart: zDate.optional(),
  windowEnd: zDate.optional(),
  shipTo: zText(500).optional(),
  notes: zText(2000).optional(),
  notify: z.boolean().optional(),
  notifyEmail: z.union([zEmail, z.literal('')]).optional(),
};

logisticsRoutes.post('/c/:company/sales-orders/:id/shipments', async (c) => {
  const a = await requireErp(c, 'shipping.plan');
  const db = c.env.DB;
  const o = await loadSo(db, a.companyId, c.req.param('id'));
  if (!(OPEN_SO as readonly string[]).includes(o.status)) badState(o.status === 'draft' ? 'Confirm the order first' : `${o.number} is ${o.status.replace('_', ' ')}`);
  const input = await lenient(c, z.object({ ...zShipmentFields, lines: z.array(z.object({ soLineId: zId, quantity: z.number().positive().max(1e9) })).max(200).optional(), requestKey: zKey }));
  const lines = await soLines(db, a.companyId, o.id);
  const allocs = await lineAllocations(db, a.companyId, lines.map((l) => l.id));
  const free = (lineId: string) => allocs.filter((x) => x.so_line_id === lineId).reduce((s, x) => q6(s + Math.max(0, x.quantity - x.issued_qty - x.released_qty - Number(x.on_shipment))), 0);
  const wanted = input.lines?.length ? input.lines : lines.map((l) => ({ soLineId: l.id, quantity: free(l.id) })).filter((x) => x.quantity > 1e-9);
  if (!wanted.length) badState('Nothing allocated is waiting to ship: allocate stock to the order first (a shipment carries allocated stock)');
  if (input.windowStart && input.windowEnd && input.windowStart > input.windowEnd) throw new HttpError(400, 'The delivery window ends before it starts');
  const carrier = input.carrierId ? await loadCarrier(db, a.companyId, input.carrierId) : null;
  if (carrier?.archived_at) throw new HttpError(400, `${carrier.name} is archived`);
  const service = carrier ? checkService(carrier, input.service) : '';
  const fin = (await financeOrgsFor(db, a))[0] ?? null;
  const freightTax = pickTax(await salesTaxOptions(db, o.fin_org_id ?? fin?.id ?? null), input.freightTaxCode, o.tax_mode, 'Freight charge').taxCode;
  const id = newId();
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  const pickStmts: D1PreparedStatement[] = [];
  let pos = 0;
  for (const w of wanted) {
    const line = lines.find((l) => l.id === w.soLineId);
    if (!line) throw new HttpError(400, 'A line of another order was sent');
    const qty = q6(w.quantity);
    const avail = free(line.id);
    if (qty > avail + 1e-9) throw new HttpError(400, `Line ${line.position} (${line.product_number}): ${avail} allocated is waiting to ship; allocate more first`);
    const slId = newId();
    stmts.push(db.prepare('INSERT INTO erp_shipment_lines (id, company_id, shipment_id, so_line_id, product_id, quantity) VALUES (?, ?, ?, ?, ?, ?)').bind(slId, a.companyId, id, line.id, line.product_id, qty));
    let left = qty;
    for (const r of allocs.filter((x) => x.so_line_id === line.id)) {
      if (left <= 1e-9) break;
      const can_ = q6(r.quantity - r.issued_qty - r.released_qty - Number(r.on_shipment));
      if (can_ <= 1e-9) continue;
      const take = q6(Math.min(can_, left));
      pickStmts.push(db.prepare('INSERT INTO erp_pick_lines (id, company_id, shipment_id, shipment_line_id, position, product_id, location_id, lot, serial, expiry, reservation_id, suggested_qty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, id, slId, ++pos, r.product_id, r.location_id, r.lot, r.serial, r.expiry, r.reservation_id, take));
      left = q6(left - take);
    }
  }
  const number = await nextNumber(db, a.companyId, 'shipment');
  const before = input.requestKey ? [onceStmt(db, a.companyId, `shipment:${input.requestKey}`, t)] : [];
  try {
    await db.batch([
      ...before,
      db
        .prepare(
          `INSERT INTO erp_shipments (id, company_id, number, so_id, status, carrier_id, service, tracking_number, freight_cost_cents, freight_charge_cents, freight_tax_code, planned_date, window_start, window_end, ship_to, notes, notify, notify_email, search, created_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'planned', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(id, a.companyId, number, o.id, carrier?.id ?? null, service, input.trackingNumber ?? '', input.freightCostCents ?? 0, input.freightChargeCents ?? 0, freightTax, input.plannedDate ?? o.promised_date ?? null, input.windowStart ?? null, input.windowEnd ?? null, (input.shipTo ?? '').trim() || o.delivery_address, input.notes ?? '', input.notify ? 1 : 0, input.notifyEmail ?? '', searchText(number, o.number, o.customer_name, input.trackingNumber, carrier?.name), a.userId, t, t),
      ...stmts,
      ...pickStmts,
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.planned', entityType: 'shipment', entityId: id, summary: `${number} planned for ${o.number} (${o.customer_name})${carrier ? ` with ${carrier.name}` : ''}`, at: t }),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.shipment_planned', entityType: 'sales_order', entityId: o.id, summary: `${number} planned`, at: t }),
    ]);
  } catch (e) {
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) throw new HttpError(409, 'This shipment was already made: refresh to see it');
    throw e;
  }
  return c.json({ id, number }, 201);
});

logisticsRoutes.get('/c/:company/shipments', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['s.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const qp = (k: string) => c.req.query(k)?.trim();
  const status = qp('status');
  if (status === 'open') where.push("s.status IN ('planned','picking','picked','packed')");
  else if (status === 'to_pick') where.push("s.status IN ('planned','picking')");
  else if (status === 'in_transit') where.push("s.status = 'dispatched'");
  else if (status && Object.hasOwn(SHIPMENT_STATUS, status)) {
    where.push('s.status = ?');
    args.push(status);
  }
  if (qp('q')) {
    where.push('s.search LIKE ?');
    args.push(likeOf(qp('q')!));
  }
  if (qp('carrierId')) {
    where.push('s.carrier_id = ?');
    args.push(qp('carrierId'));
  }
  if (qp('soId')) {
    where.push('s.so_id = ?');
    args.push(qp('soId'));
  }
  if (qp('from')) {
    where.push('s.planned_date >= ?');
    args.push(qp('from'));
  }
  if (qp('to')) {
    where.push('s.planned_date <= ?');
    args.push(qp('to'));
  }
  if (qp('uninvoiced') === '1') where.push("s.status IN ('dispatched','delivered') AND NOT EXISTS (SELECT 1 FROM erp_integration_events e WHERE e.company_id = s.company_id AND e.source_type = 'shipment' AND e.source_id = s.id AND e.kind = 'finance.draft_invoice' AND e.status = 'done')");
  const sorts: Record<string, string> = { newest: 's.created_at DESC', number: 's.number COLLATE NOCASE', planned: "COALESCE(s.planned_date, '9999')", customer: 'o.customer_name COLLATE NOCASE' };
  const order = sorts[qp('sort') ?? ''] ?? sorts.newest;
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${SHP_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order}, s.rowid DESC LIMIT ? OFFSET ?`).bind(...args, csv ? 20000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(shipmentDTO);
  if (csv) {
    return csvResponse('shipments', [
      ['Number', 'Sales order', 'Customer', 'Status', 'Carrier', 'Service', 'Tracking number', 'Planned', 'Window from', 'Window to', 'Packages', 'Weight (kg)', 'Freight cost', 'Freight charge', 'Dispatched', 'Delivered', 'Received by'],
      ...list.map((s) => [s.number, s.salesOrderNumber, s.customerName, s.statusLabel, s.carrierName ?? '', s.service, s.trackingNumber, s.plannedDate ?? '', s.windowStart ?? '', s.windowEnd ?? '', s.packages, s.weightKg ?? '', dollars(s.freightCostCents), dollars(s.freightChargeCents), s.dispatchedAt ? new Date(s.dispatchedAt).toISOString() : '', s.deliveredAt ? new Date(s.deliveredAt).toISOString() : '', s.receivedBy]),
    ]);
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_shipments s JOIN erp_sales_orders o ON o.company_id = s.company_id AND o.id = s.so_id WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ shipments: list, total: total?.n ?? 0, limit, offset, statuses: Object.entries(SHIPMENT_STATUS).map(([value, l]) => ({ value, label: l })) });
});

/** Whether email can go out on this service (for the dispatch email's note on the screen). */
async function emailAvailable(env: any) {
  return emailConfig(await emailEnv(env)).provider !== 'none';
}

logisticsRoutes.get('/c/:company/shipments/:id', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  const [lines, picks, packages] = await Promise.all([shipmentLines(db, a.companyId, s.id), pickLines(db, a.companyId, s.id), db.prepare('SELECT * FROM erp_packages WHERE company_id = ? AND shipment_id = ? ORDER BY seq').bind(a.companyId, s.id).all<any>()]);
  const integration = await db.prepare("SELECT * FROM erp_integration_events WHERE company_id = ? AND source_type = 'shipment' AND source_id = ? ORDER BY created_at").bind(a.companyId, s.id).all<any>();
  const inv = integration.results.find((e) => e.kind === 'finance.draft_invoice');
  const open = OPEN_SHIPMENT.includes(s.status);
  const email = await emailAvailable(c.env);
  return c.json({
    shipment: shipmentDTO(s),
    lines: lines.map((x) => ({ id: x.id, soLineId: x.so_line_id, position: x.position, productId: x.product_id, productNumber: x.product_number, productName: x.product_name, description: x.description, uom: x.uom, quantity: q6(x.quantity), pickedQty: q6(x.picked_qty), shippedQty: q6(x.shipped_qty), orderedQty: q6(x.ordered), unitPriceCents: x.unit_price_cents })),
    picks: picks.map(pickDTO),
    packages: packages.results.map(packageDTO),
    invoice: await invoiceInfo(c, a, s, inv),
    integration: integration.results.map((e) => ({ id: e.id, kind: e.kind, kindLabel: e.kind === 'finance.draft_invoice' ? 'Draft invoice in Finance' : 'Stock posting to Finance', status: e.status, note: e.last_error, amountCents: e.amount_cents, createdAt: e.created_at })),
    notifyNote: !email ? 'Email is not set up on this service, so the dispatch email cannot be sent. Tell the customer another way.' : a.kind === 'demo' ? 'This is the example company: it sends no email.' : null,
    files: await recordFiles(db, a.companyId, 'shipment', s.id),
    proofOfDelivery: await recordFiles(db, a.companyId, 'delivery', s.id),
    history: await historyOf(db, a.companyId, { entityType: 'shipment', entityId: s.id }),
    can: {
      plan: can(a, 'shipping.plan') && open,
      pick: can(a, 'shipping.pick') && ['planned', 'picking', 'picked'].includes(s.status),
      pack: can(a, 'shipping.pack') && ['picked', 'packed'].includes(s.status),
      dispatch: can(a, 'shipping.dispatch') && s.status === 'packed',
      deliver: can(a, 'shipping.deliver') && s.status === 'dispatched',
      proof: can(a, 'shipping.deliver') && ['dispatched', 'delivered'].includes(s.status),
      cancel: can(a, 'shipping.plan') && open,
      tracking: (can(a, 'shipping.plan') || can(a, 'shipping.dispatch')) && s.status !== 'cancelled',
    },
  });
});

logisticsRoutes.patch('/c/:company/shipments/:id', async (c) => {
  const a = await requireErp(c, 'sales.view');
  if (!can(a, 'shipping.plan') && !can(a, 'shipping.dispatch')) assertCan(a, 'shipping.plan');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (s.status === 'cancelled') badState('This shipment is cancelled');
  const input = await body(c, z.object(zShipmentFields));
  const planning = ['carrierId', 'freightCostCents', 'freightChargeCents', 'freightTaxCode', 'plannedDate', 'windowStart', 'windowEnd', 'shipTo', 'notify', 'notifyEmail'].some((k) => (input as any)[k] !== undefined);
  if (planning) assertCan(a, 'shipping.plan');
  const dispatched = ['dispatched', 'delivered'].includes(s.status);
  if (dispatched && (input.carrierId !== undefined || input.shipTo !== undefined || input.notify !== undefined || input.notifyEmail !== undefined || input.plannedDate !== undefined)) badState('This shipment has left: only the tracking number, freight, delivery window and notes change now');
  if (input.freightChargeCents !== undefined && s.invoice_status === 'done' && input.freightChargeCents !== s.freight_charge_cents) badState('The draft invoice is made: change the freight charge on the invoice in Finance');
  const carrierId = input.carrierId === undefined ? s.carrier_id : input.carrierId;
  const carrier = carrierId ? await loadCarrier(db, a.companyId, carrierId) : null;
  if (carrier?.archived_at && carrierId !== s.carrier_id) throw new HttpError(400, `${carrier.name} is archived`);
  const service = input.service !== undefined || input.carrierId !== undefined ? (carrier ? checkService(carrier, input.service ?? (input.carrierId === undefined ? s.service : '')) : '') : s.service;
  const windowStart = input.windowStart !== undefined ? input.windowStart : s.window_start;
  const windowEnd = input.windowEnd !== undefined ? input.windowEnd : s.window_end;
  if (windowStart && windowEnd && windowStart > windowEnd) throw new HttpError(400, 'The delivery window ends before it starts');
  const freightTax = input.freightTaxCode !== undefined ? pickTax(await salesTaxOptions(db, (await loadSo(db, a.companyId, s.so_id)).fin_org_id), input.freightTaxCode, s.tax_mode, 'Freight charge').taxCode : s.freight_tax_code;
  const t = now();
  const next = {
    carrier_id: carrier?.id ?? null,
    service,
    tracking_number: input.trackingNumber ?? s.tracking_number,
    freight_cost_cents: input.freightCostCents ?? s.freight_cost_cents,
    freight_charge_cents: input.freightChargeCents ?? s.freight_charge_cents,
    freight_tax_code: freightTax,
    planned_date: input.plannedDate !== undefined ? input.plannedDate : s.planned_date,
    window_start: windowStart,
    window_end: windowEnd,
    ship_to: input.shipTo ?? s.ship_to,
    notes: input.notes ?? s.notes,
    notify: input.notify === undefined ? s.notify : input.notify ? 1 : 0,
    notify_email: input.notifyEmail ?? s.notify_email,
  };
  const changes = Object.fromEntries(Object.entries(next).filter(([k, v]) => (s as any)[k] !== v));
  if (!Object.keys(changes).length) return c.json(shipmentDTO(s));
  await db.batch([
    db
      .prepare('UPDATE erp_shipments SET carrier_id = ?, service = ?, tracking_number = ?, freight_cost_cents = ?, freight_charge_cents = ?, freight_tax_code = ?, planned_date = ?, window_start = ?, window_end = ?, ship_to = ?, notes = ?, notify = ?, notify_email = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = ?')
      .bind(next.carrier_id, next.service, next.tracking_number, next.freight_cost_cents, next.freight_charge_cents, next.freight_tax_code, next.planned_date, next.window_start, next.window_end, next.ship_to, next.notes, next.notify, next.notify_email, searchText(s.number, s.so_number, s.customer_name, next.tracking_number, carrier?.name), t, a.companyId, s.id, s.status),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.changed', entityType: 'shipment', entityId: s.id, summary: `${s.number} changed: ${Object.keys(changes).map((k) => k.replace(/_/g, ' ')).join(', ')}`, before: Object.fromEntries(Object.keys(changes).map((k) => [k, (s as any)[k]])), after: changes, at: t }),
  ]);
  return c.json(shipmentDTO(await loadShipment(db, a.companyId, s.id)));
});

logisticsRoutes.post('/c/:company/shipments/:id/cancel', async (c) => {
  const a = await requireErp(c, 'shipping.plan');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (!OPEN_SHIPMENT.includes(s.status)) badState(`${s.number} is ${s.status}: it cannot be cancelled`);
  const input = await lenient(c, z.object({ reason: zText(500).optional() }));
  const t = now();
  const r = await db.batch([
    db.prepare("UPDATE erp_shipments SET status = 'cancelled', cancelled_by = ?, cancelled_at = ?, cancel_reason = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('planned','picking','picked','packed')").bind(a.userId, t, input.reason ?? '', t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.cancelled', entityType: 'shipment', entityId: s.id, summary: `${s.number} cancelled${input.reason ? `: ${input.reason}` : ''}; its stock stays allocated to ${s.so_number}`, at: t }),
  ]);
  if (!r[0].meta.changes) badState('This shipment changed at the same moment: refresh');
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ pick and pack

logisticsRoutes.post('/c/:company/shipments/:id/pick', async (c) => {
  const a = await requireErp(c, 'shipping.pick');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (!['planned', 'picking', 'picked'].includes(s.status)) badState(s.status === 'packed' ? 'This shipment is packed: remove its packages to pick again' : `${s.number} is ${s.status}`);
  const input = await body(c, z.object({ lines: z.array(z.object({ pickLineId: zId, pickedQty: z.number().min(0).max(1e9) })).min(1).max(500), all: z.boolean().optional() }));
  const picks = await pickLines(db, a.companyId, s.id);
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const x of input.lines) {
    const k = picks.find((p) => p.id === x.pickLineId);
    if (!k) throw new HttpError(400, 'A pick line of another shipment was sent');
    if (x.pickedQty > k.suggested_qty + 1e-9) throw new HttpError(400, `${k.product_number} at ${k.warehouse_code}/${k.location_code}: at most ${q6(k.suggested_qty)} is on the pick list`);
    if (k.serial && x.pickedQty !== 0 && x.pickedQty !== 1) throw new HttpError(400, 'A serial number is one unit');
    stmts.push(db.prepare('UPDATE erp_pick_lines SET picked_qty = ?, picked_by = ?, picked_at = ? WHERE company_id = ? AND id = ?').bind(q6(x.pickedQty), a.userId, t, a.companyId, k.id));
  }
  const short = input.lines.filter((x) => {
    const k = picks.find((p) => p.id === x.pickLineId)!;
    return x.pickedQty < k.suggested_qty - 1e-9;
  });
  await db.batch([
    ...stmts,
    ...pickStatusStmts(db, a.companyId, s.id, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.picked', entityType: 'shipment', entityId: s.id, summary: `${s.number}: ${input.lines.length} pick line${input.lines.length === 1 ? '' : 's'} recorded${short.length ? ` (${short.length} short)` : ''}`, at: t }),
  ]);
  return c.json(shipmentDTO(await loadShipment(db, a.companyId, s.id)));
});

const zPackage = z.object({
  kind: z.enum(Object.keys(PACKAGE_KINDS) as [string, ...string[]]).optional(),
  weightKg: z.number().min(0).max(1e6).nullable().optional(),
  lengthCm: z.number().min(0).max(1e5).nullable().optional(),
  widthCm: z.number().min(0).max(1e5).nullable().optional(),
  heightCm: z.number().min(0).max(1e5).nullable().optional(),
  contents: z.array(z.object({ soLineId: zId, quantity: z.number().positive().max(1e9) })).max(200).optional(),
  notes: zText(500).optional(),
});

logisticsRoutes.post('/c/:company/shipments/:id/packages', async (c) => {
  const a = await requireErp(c, 'shipping.pack');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (!['picked', 'packed'].includes(s.status)) badState(['planned', 'picking'].includes(s.status) ? 'Pick the shipment before packing it' : `${s.number} is ${s.status}`);
  const input = await body(c, zPackage);
  const lines = await shipmentLines(db, a.companyId, s.id);
  const existing = (await db.prepare('SELECT contents_json FROM erp_packages WHERE company_id = ? AND shipment_id = ?').bind(a.companyId, s.id).all<{ contents_json: string }>()).results.flatMap((p) => parseJson<{ soLineId: string; quantity: number }[]>(p.contents_json, []));
  const contents = (input.contents ?? []).map((x) => {
    const l = lines.find((y) => y.so_line_id === x.soLineId);
    if (!l) throw new HttpError(400, 'Pack only what this shipment carries');
    const packed = existing.filter((e) => e.soLineId === x.soLineId).reduce((n, e) => n + e.quantity, 0);
    if (q6(packed + x.quantity) > q6(l.picked_qty) + 1e-9) throw new HttpError(400, `${l.product_number}: ${q6(l.picked_qty)} was picked and ${q6(packed)} is packed already`);
    return { soLineId: x.soLineId, productNumber: l.product_number, quantity: q6(x.quantity) };
  });
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare('INSERT INTO erp_packages (id, company_id, shipment_id, seq, kind, weight_kg, length_cm, width_cm, height_cm, contents_json, notes, created_by, created_at) VALUES (?, ?, ?, (SELECT COALESCE(MAX(seq), 0) + 1 FROM erp_packages WHERE company_id = ? AND shipment_id = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, s.id, a.companyId, s.id, input.kind ?? 'box', input.weightKg ?? null, input.lengthCm ?? null, input.widthCm ?? null, input.heightCm ?? null, JSON.stringify(contents), input.notes ?? '', a.userId, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.package_added', entityType: 'shipment', entityId: s.id, summary: `${s.number}: ${label(PACKAGE_KINDS, input.kind ?? 'box').toLowerCase()} added${input.weightKg ? `, ${input.weightKg} kg` : ''}`, at: t }),
  ]);
  return c.json({ id }, 201);
});

logisticsRoutes.delete('/c/:company/shipments/:id/packages/:pid', async (c) => {
  const a = await requireErp(c, 'shipping.pack');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (!['picked', 'packed'].includes(s.status)) badState(`${s.number} is ${s.status}: its packages cannot change`);
  const t = now();
  const r = await db.batch([
    db.prepare('DELETE FROM erp_packages WHERE company_id = ? AND shipment_id = ? AND id = ?').bind(a.companyId, s.id, c.req.param('pid')),
    // with no package left, a packed shipment goes back to picked
    db.prepare("UPDATE erp_shipments SET status = 'picked', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'packed' AND NOT EXISTS (SELECT 1 FROM erp_packages p WHERE p.company_id = ? AND p.shipment_id = ?)").bind(t, a.companyId, s.id, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.package_removed', entityType: 'shipment', entityId: s.id, summary: `${s.number}: a package removed`, at: t }),
  ]);
  if (!r[0].meta.changes) throw notFound('Package');
  return c.json({ ok: true });
});

logisticsRoutes.post('/c/:company/shipments/:id/packed', async (c) => {
  const a = await requireErp(c, 'shipping.pack');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (s.status !== 'picked') badState(s.status === 'packed' ? 'This shipment is packed already' : 'Pick the shipment before packing it');
  if (!s.package_count) badState('Add at least one package: its weight, size and contents');
  const lines = await shipmentLines(db, a.companyId, s.id);
  if (!lines.some((l) => l.picked_qty > 1e-9)) badState('Nothing was picked for this shipment');
  const t = now();
  const r = await db.batch([
    db.prepare("UPDATE erp_shipments SET status = 'packed', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'picked'").bind(t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.packed', entityType: 'shipment', entityId: s.id, summary: `${s.number} packed: ${s.package_count} package${s.package_count === 1 ? '' : 's'}`, at: t }),
  ]);
  if (!r[0].meta.changes) badState('This shipment changed at the same moment: refresh');
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ dispatch

/** The dispatch email, when asked for: through the outbox, never for the example company. Returns what happened. */
async function notifyDispatch(c: any, a: ErpAccess, s: any): Promise<string> {
  if (!s.notify) return '';
  if (a.kind === 'demo') return 'example';
  const db = c.env.DB as D1Database;
  const so = await loadSo(db, a.companyId, s.so_id);
  const to = (s.notify_email || (await customerEmail(db, so))).trim();
  if (!to) return 'no_address';
  const reg = a.kind === 'registered' ? await db.prepare('SELECT legal_name, name FROM co_companies WHERE id = ?').bind(a.companyId).first<{ legal_name: string; name: string }>() : null;
  const organisation = reg?.legal_name || reg?.name || a.companyName;
  const fresh = await loadShipment(db, a.companyId, s.id);
  const window = fresh.window_start && fresh.window_end ? (fresh.window_start === fresh.window_end ? fresh.window_start : `${fresh.window_start} to ${fresh.window_end}`) : fresh.window_end ?? fresh.window_start ?? fresh.planned_date ?? null;
  const r = await queueAndKick(c.env, (p) => c.executionCtx.waitUntil(p), {
    to,
    toName: so.contact_name || so.customer_name,
    data: {
      template: 'erp_dispatch',
      organisation,
      order: so.number,
      shipment: fresh.number,
      customerPo: so.customer_po || null,
      carrier: fresh.carrier_name ?? null,
      service: fresh.service || null,
      tracking: fresh.tracking_number || null,
      trackingUrl: trackingLink(fresh.carrier_tracking_url, fresh.tracking_number),
      window,
      packages: fresh.package_count ? `${fresh.package_count}${fresh.weight_kg ? `, ${Math.round(Number(fresh.weight_kg) * 1000) / 1000} kg` : ''}` : null,
    },
    idempotencyKey: `erp-dispatch:${a.companyId}:${s.id}`,
  });
  return r.queued ? 'queued' : r.reason;
}

logisticsRoutes.post('/c/:company/shipments/:id/dispatch', async (c) => {
  const a = await requireErp(c, 'shipping.dispatch');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  const input = await lenient(c, z.object({ trackingNumber: zText(100).optional(), requestKey: zKey }));
  // a double submission, or a retry after it went: the shipment is dispatched once
  if (s.status === 'dispatched' || s.status === 'delivered') return c.json({ ...shipmentDTO(s), existing: true });
  if (s.status !== 'packed') badState(['planned', 'picking', 'picked'].includes(s.status) ? 'Pick and pack the shipment before dispatching it' : `${s.number} is ${s.status}`);
  const picks = (await pickLines(db, a.companyId, s.id)).filter((k) => k.picked_qty > 1e-9);
  if (!picks.length) badState('Nothing was picked for this shipment');
  const settings = await loadSettings(db, a.companyId);
  const t = now();
  const ops = new StockOps(db, a, settings, t);
  const reference = `${s.number} ${s.so_number}`;
  const after: D1PreparedStatement[] = [];
  const perLine = new Map<string, { shipped: number; fromAllocation: number }>();
  const lines = await shipmentLines(db, a.companyId, s.id);
  for (const k of picks) {
    const qty = q6(k.picked_qty);
    const key: StockKey = { productId: k.product_id, locationId: k.location_id, lot: k.lot, serial: k.serial };
    const reserved = !!k.reservation_id && k.reservation_status === 'open';
    if (k.reservation_id && (!reserved || Number(k.reservation_open) < qty - 1e-9)) badState(`The allocation of ${k.product_number} at ${k.warehouse_code}/${k.location_code} changed since it was picked: refresh and pick again`);
    await ops.takeOut('sales_dispatch', key, qty, { source: 'shipment', sourceId: s.id, reference, reason: `Dispatched to ${s.customer_name}`, fromReserved: reserved });
    if (reserved) {
      // the reservation's CHECK (issued plus released never above the quantity) guards it
      after.push(db.prepare("UPDATE erp_reservations SET issued_qty = round(issued_qty + ?, 6), status = CASE WHEN round(quantity - issued_qty - released_qty - ?, 6) <= 1e-9 THEN 'issued' ELSE status END, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'").bind(qty, qty, t, a.companyId, k.reservation_id));
    }
    const sl = lines.find((l) => l.id === k.shipment_line_id)!;
    const cur = perLine.get(sl.so_line_id) ?? { shipped: 0, fromAllocation: 0 };
    cur.shipped = q6(cur.shipped + qty);
    if (reserved) cur.fromAllocation = q6(cur.fromAllocation + qty);
    perLine.set(sl.so_line_id, cur);
  }
  // the order line's CHECK refuses shipping more than was ordered (two dispatches of its last units cannot both pass)
  for (const [lineId, v] of perLine) after.push(db.prepare('UPDATE erp_so_lines SET shipped_qty = round(shipped_qty + ?, 6), allocated_qty = round(allocated_qty - ?, 6) WHERE company_id = ? AND id = ?').bind(v.shipped, v.fromAllocation, a.companyId, lineId));
  after.push(
    db.prepare('UPDATE erp_shipment_lines SET shipped_qty = picked_qty WHERE company_id = ? AND shipment_id = ?').bind(a.companyId, s.id),
    db.prepare("UPDATE erp_shipments SET status = 'dispatched', tracking_number = ?, dispatched_by = ?, dispatched_at = ?, group_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'packed'").bind(input.trackingNumber ?? s.tracking_number, a.userId, t, ops.groupId, t, a.companyId, s.id),
    soStatusStmt(db, a.companyId, s.so_id, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.dispatched', entityType: 'shipment', entityId: s.id, summary: `${s.number} dispatched to ${s.customer_name}${s.carrier_name ? ` with ${s.carrier_name}` : ''}: ${lines.map((l) => `${q6(perLine.get(l.so_line_id)?.shipped ?? 0)} ${l.uom} of ${l.product_number}`).join(', ')}`, after: { tracking: input.trackingNumber ?? s.tracking_number }, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.dispatched', entityType: 'sales_order', entityId: s.so_id, summary: `${s.number} dispatched`, at: t }),
  );
  try {
    await runStock(db, ops.all([onceStmt(db, a.companyId, `dispatch:${s.id}`, t)], after, { type: 'shipment', id: s.id }));
  } catch (e) {
    if (e instanceof HttpError && e.status === 409) {
      const again = await loadShipment(db, a.companyId, s.id);
      if (again.status === 'dispatched' || again.status === 'delivered') return c.json({ ...shipmentDTO(again), existing: true });
    }
    throw e;
  }
  const notify = await notifyDispatch(c, a, s).catch(() => 'failed');
  if (notify) {
    await db.batch([
      db.prepare('UPDATE erp_shipments SET notify_status = ? WHERE company_id = ? AND id = ?').bind(notify.slice(0, 40), a.companyId, s.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.notified', entityType: 'shipment', entityId: s.id, summary: `${s.number}: ${NOTIFY_STATUS[notify] ?? notify}`, at: now() }),
    ]);
  }
  return c.json({ ...shipmentDTO(await loadShipment(db, a.companyId, s.id)), existing: false }, 201);
});

// ------------------------------------------------------------------ delivery confirmation

logisticsRoutes.post('/c/:company/shipments/:id/deliver', async (c) => {
  const a = await requireErp(c, 'shipping.deliver');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (s.status === 'delivered') return c.json({ ...shipmentDTO(s), existing: true });
  if (s.status !== 'dispatched') badState('Dispatch the shipment before confirming its delivery');
  const input = await body(c, z.object({ receivedBy: zText(200).min(1, 'Say who received it'), deliveredAt: z.number().int().min(0).max(4e12).optional(), note: zText(1000).optional() }));
  const t = now();
  const at = input.deliveredAt ?? t;
  if (at < s.dispatched_at) throw new HttpError(400, 'The delivery is before the dispatch');
  if (at > t + 3_600_000) throw new HttpError(400, 'The delivery time is in the future');
  const r = await db.batch([
    db.prepare("UPDATE erp_shipments SET status = 'delivered', delivered_at = ?, received_by = ?, delivery_note = ?, delivery_recorded_by = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'dispatched'").bind(at, input.receivedBy, input.note ?? '', a.userId, t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.delivered', entityType: 'shipment', entityId: s.id, summary: `${s.number} delivered: received by ${input.receivedBy}`, after: { deliveredAt: at, receivedBy: input.receivedBy }, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.delivered', entityType: 'sales_order', entityId: s.so_id, summary: `${s.number} delivered to ${s.customer_name}`, at: t }),
  ]);
  if (!r[0].meta.changes) return c.json({ ...shipmentDTO(await loadShipment(db, a.companyId, s.id)), existing: true });
  return c.json(shipmentDTO(await loadShipment(db, a.companyId, s.id)));
});

// ------------------------------------------------------------------ the delivery schedule

logisticsRoutes.get('/c/:company/delivery-schedule', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const today = todayIso();
  const from = /^\d{4}-\d{2}-\d{2}$/.test(c.req.query('from') ?? '') ? c.req.query('from')! : addDays(today, -7);
  const to = /^\d{4}-\d{2}-\d{2}$/.test(c.req.query('to') ?? '') ? c.req.query('to')! : addDays(today, 21);
  const rows = await db
    .prepare(
      `${SHP_SELECT} WHERE s.company_id = ? AND s.status <> 'cancelled' AND (
         (COALESCE(s.window_start, s.planned_date) <= ? AND COALESCE(s.window_end, s.planned_date) >= ?) OR s.status = 'dispatched' OR (s.planned_date IS NULL AND s.status IN ('planned','picking','picked','packed')))
       ORDER BY COALESCE(s.planned_date, s.window_start, '9999'), s.number LIMIT 1000`,
    )
    .bind(a.companyId, to, from)
    .all<any>();
  const unplanned = await db
    .prepare(
      `SELECT o.id, o.number, o.customer_name, o.status, COALESCE(o.promised_date, o.requested_date) AS due,
              (SELECT round(SUM(l.quantity - l.shipped_qty), 6) FROM erp_so_lines l WHERE l.company_id = o.company_id AND l.so_id = o.id) AS to_ship,
              (SELECT round(SUM(l.allocated_qty), 6) FROM erp_so_lines l WHERE l.company_id = o.company_id AND l.so_id = o.id) AS allocated
         FROM erp_sales_orders o WHERE o.company_id = ? AND o.status IN ('confirmed','partially_allocated','allocated','partially_shipped') AND COALESCE(o.promised_date, o.requested_date) <= ?
          AND NOT EXISTS (SELECT 1 FROM erp_shipments s WHERE s.company_id = o.company_id AND s.so_id = o.id AND s.status IN ('planned','picking','picked','packed'))
        ORDER BY due, o.number LIMIT 500`,
    )
    .bind(a.companyId, to)
    .all<any>();
  const list = rows.results.map(shipmentDTO);
  const days = new Map<string, typeof list>();
  for (const s of list) {
    const d = s.status === 'dispatched' && !s.plannedDate ? today : (s.plannedDate ?? s.windowStart ?? 'unscheduled');
    days.set(d, [...(days.get(d) ?? []), s]);
  }
  if (wantsCsv(c)) {
    return csvResponse('delivery-schedule', [
      ['Planned', 'Window from', 'Window to', 'Shipment', 'Sales order', 'Customer', 'Status', 'Carrier', 'Tracking number', 'Late'],
      ...list.map((s) => [s.plannedDate ?? '', s.windowStart ?? '', s.windowEnd ?? '', s.number, s.salesOrderNumber, s.customerName, s.statusLabel, s.carrierName ?? '', s.trackingNumber, s.late ? 'yes' : '']),
    ]);
  }
  return c.json({
    from,
    to,
    days: [...days.entries()].sort(([x], [y]) => (x < y ? -1 : 1)).map(([date, shipments]) => ({ date, shipments })),
    toPlan: unplanned.results.map((o) => ({ id: o.id, number: o.number, customerName: o.customer_name, status: o.status, due: o.due, toShip: q6(Number(o.to_ship ?? 0)), allocated: q6(Number(o.allocated ?? 0)), late: !!o.due && o.due < today })),
  });
});

// ------------------------------------------------------------------ the draft invoice in Finance

async function invoiceInfo(c: any, a: ErpAccess, s: any, ev: any | undefined) {
  const db = c.env.DB as D1Database;
  const so = await loadSo(db, a.companyId, s.so_id);
  const orgs = await financeOrgsFor(db, a);
  const orgId = so.fin_org_id ?? orgs[0]?.id ?? null;
  const org = orgId ? orgs.find((o) => o.id === orgId) : undefined;
  const fa = org ? await maybeFin(db, org.id, c.get('user')) : null;
  const contact = so.fin_contact_id ?? (await relinkedContact(db, a, so));
  let reason: string | null = null;
  if (!orgs.length) reason = 'The company does not run a Finance business workspace.';
  else if (!org) reason = 'The order’s Finance workspace is not this company’s.';
  else if (!contact) reason = so.crm_company_id && a.kind === 'registered' ? `Link ${so.customer_name} to its Finance customer first: open the company in the CRM, In Finance.` : 'The order has no Finance customer to invoice.';
  else if (!fa) reason = 'You have no access to the company’s Finance workspace.';
  else if (!fa.perms.sales.create) reason = 'Your Finance role cannot create invoices.';
  else if (!can(a, 'sales.edit')) reason = 'Only sales managers and ERP administrators can ask for the invoice.';
  else if (!['dispatched', 'delivered'].includes(s.status)) reason = 'The invoice is made once the shipment is dispatched.';
  const done = ev?.status === 'done';
  return {
    status: ev?.status ?? 'none',
    invoiceId: done ? ev.target_ref : null,
    url: done && fa && ev.target_org_id === fa.orgId ? `/erp/finance/o/${fa.orgId}/invoices/${ev.target_ref}` : null,
    canCreate: !done && !reason,
    reason: done ? null : reason,
    lastError: ev?.status === 'failed' ? ev.last_error : null,
    attempts: ev?.attempts ?? 0,
  };
}

/** A registered company's order for a CRM company not yet linked to Finance when it was made: the link made since. */
async function relinkedContact(db: D1Database, a: ErpAccess, so: any): Promise<string | null> {
  if (a.kind !== 'registered' || !so.crm_company_id || !so.fin_org_id) return null;
  const r = await db.prepare('SELECT l.fin_contact_id FROM co_customer_links l JOIN fin_contacts f ON f.id = l.fin_contact_id AND f.org_id = ? WHERE l.company_id = ? AND l.crm_company_id = ?').bind(so.fin_org_id, a.companyId, so.crm_company_id).first<{ fin_contact_id: string }>();
  return r?.fin_contact_id ?? null;
}

const SALES_TAX_KEYS: Record<string, string> = { GST: 'gst_sales', NONE: 'free_sales' };

logisticsRoutes.post('/c/:company/shipments/:id/invoice', async (c) => {
  const a = await requireErp(c, 'sales.edit');
  const db = c.env.DB;
  const s = await loadShipment(db, a.companyId, c.req.param('id'));
  if (!['dispatched', 'delivered'].includes(s.status)) badState('The invoice is made once the shipment is dispatched');
  const so = await loadSo(db, a.companyId, s.so_id);
  const org = (await financeOrgsFor(db, a)).find((x) => x.id === (so.fin_org_id ?? ''));
  if (!org) badState('The company does not run a Finance business workspace for this order');
  let contactId: string | null = so.fin_contact_id;
  if (!contactId) {
    contactId = await relinkedContact(db, a, so);
    if (!contactId) badState(so.crm_company_id && a.kind === 'registered' ? `Link ${so.customer_name} to its Finance customer first: open the company in the CRM, In Finance` : 'The order has no Finance customer to invoice');
    await db.prepare('UPDATE erp_sales_orders SET fin_contact_id = ? WHERE company_id = ? AND id = ? AND fin_contact_id IS NULL').bind(contactId, a.companyId, so.id).run();
  }
  const fa = await maybeFin(db, org.id, c.get('user'));
  if (!fa) throw new HttpError(403, 'You have no access to the company’s Finance workspace');
  if (!fa.perms.sales.create) throw new HttpError(403, 'Your Finance role cannot create invoices');
  const key = `invoice:shipment:${a.companyId}:${s.id}`;
  const t = now();
  // One row per shipment: a second request finds it and never makes a second invoice.
  await db
    .prepare("INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, target_org_id, created_by, created_at, updated_at) VALUES (?, ?, 'finance.draft_invoice', 'shipment', ?, 'finance', ?, 'pending', 0, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING")
    .bind(newId(), a.companyId, s.id, key, org.id, a.userId, t, t)
    .run();
  const ev = (await db.prepare('SELECT * FROM erp_integration_events WHERE idempotency_key = ?').bind(key).first<any>())!;
  if (ev.status === 'done') return c.json({ invoiceId: ev.target_ref, existing: true, url: `/erp/finance/o/${ev.target_org_id}/invoices/${ev.target_ref}` });
  // claim it: only one request at a time makes the invoice (attempts moves on, compared and set in one statement)
  const claim = await db
    .prepare("UPDATE erp_integration_events SET attempts = attempts + 1, status = 'pending', updated_at = ? WHERE idempotency_key = ? AND attempts = ? AND status IN ('pending','failed') AND (attempts = 0 OR status = 'failed' OR updated_at < ?)")
    .bind(t, key, ev.attempts, t - 120_000)
    .run();
  if (!claim.meta.changes) throw new HttpError(409, 'The draft invoice is being made now: refresh in a moment');
  const reference = `${s.number} ${so.number}`;
  try {
    // An invoice made before a crash, between Finance saving it and this row being marked done, is found, not made again.
    const before = await db.prepare("SELECT id FROM fin_docs WHERE org_id = ? AND kind = 'invoice' AND reference = ? AND deleted_at IS NULL").bind(org.id, reference).first<{ id: string }>();
    let invoiceId = before?.id;
    if (!invoiceId) {
      const lines = (await shipmentLines(db, a.companyId, s.id)).filter((l) => l.shipped_qty > 1e-9);
      if (!lines.length) badState('Nothing was shipped on this shipment');
      const codes = await db.prepare('SELECT id, system_key FROM fin_tax_codes WHERE org_id = ? AND archived_at IS NULL').bind(org.id).all<{ id: string; system_key: string | null }>();
      const ids = new Set(codes.results.map((x) => x.id));
      const bySystem = new Map(codes.results.filter((x) => x.system_key).map((x) => [x.system_key!, x.id]));
      const taxCodeFor = (code: string) => (ids.has(code) ? code : SALES_TAX_KEYS[code] ? (bySystem.get(SALES_TAX_KEYS[code]) ?? null) : null);
      const sales = await db.prepare("SELECT id FROM fin_accounts WHERE org_id = ? AND type = 'revenue' AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1").bind(org.id).first<{ id: string }>();
      const invLines = lines.map((l) => ({
        itemCode: l.product_number ?? '',
        description: [l.description, `${so.number} line ${l.position}`].filter(Boolean).join(' - ').slice(0, 1000),
        unit: l.uom,
        quantity: Math.round(l.shipped_qty * 1000) / 1000,
        unitPrice: l.unit_price_cents,
        discountBp: l.discount_bp,
        accountId: sales?.id ?? null,
        taxCodeId: taxCodeFor(l.tax_code),
      }));
      if (s.freight_charge_cents > 0) invLines.push({ itemCode: '', description: `Freight${s.carrier_name ? `: ${s.carrier_name}` : ''}${s.service ? ` ${s.service}` : ''}`, unit: '', quantity: 1, unitPrice: s.freight_charge_cents, discountBp: 0, accountId: sales?.id ?? null, taxCodeId: taxCodeFor(s.freight_tax_code) });
      const made = await createDoc(c.env, fa, {
        kind: 'invoice',
        contactId,
        issueDate: todayIn(fa.org.timezone || 'Australia/Sydney'),
        reference,
        taxMode: so.tax_mode,
        deliveryAddress: s.ship_to,
        notes: `Made from BIZOMAT ERP shipment ${s.number} of sales order ${so.number}${so.customer_po ? ` (your order ${so.customer_po})` : ''}. Check the amounts, GST and accounts before approving.`,
        action: 'draft',
        lines: invLines,
      });
      invoiceId = made.id;
    }
    await db.batch([
      db.prepare("UPDATE erp_integration_events SET status = 'done', target_ref = ?, target_org_id = ?, last_error = '', updated_at = ? WHERE idempotency_key = ?").bind(invoiceId, org.id, now(), key),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'shipment.invoice_drafted', entityType: 'shipment', entityId: s.id, summary: `Draft invoice made in Finance for ${s.number} (${reference})`, after: { finOrg: org.id, invoice: invoiceId }, at: now() }),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.invoice_drafted', entityType: 'sales_order', entityId: so.id, summary: `Draft invoice made in Finance for ${s.number}`, at: now() }),
      soStatusStmt(db, a.companyId, so.id),
    ]);
    return c.json({ invoiceId, existing: !!before, url: `/erp/finance/o/${org.id}/invoices/${invoiceId}` }, before ? 200 : 201);
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : 'Finance could not make the invoice';
    await db.prepare("UPDATE erp_integration_events SET status = 'failed', last_error = ?, updated_at = ? WHERE idempotency_key = ?").bind(msg.slice(0, 200), now(), key).run();
    throw e;
  }
});
