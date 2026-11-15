// BIZOMAT ERP, Release 2: purchase orders, goods receipts, the draft bill in Finance and supplier performance
// (/api/erp/c/:company/...).
//
// Purchase order (PO-00001), to an approved supplier only, made from an approved quotation choice, a requisition or
// directly. Lines: product or free-text item, specification, quantity, unit price, discount, tax code (the company's
// Finance tax codes when it runs Finance, else GST or none). Statuses: draft, awaiting_approval, approved, sent,
// partially_received, received, cancelled, closed. Approval (erp_settings): a buyer's order at or below the company's
// limit, in the company's currency, is approved when submitted ("within_limit"); above it, or in another currency, a
// procurement manager who did not submit it approves ("manager"); in a company of one the submitter's own approval is
// the recorded exception ("solo"). The rule and the limit are stored on the order. An amendment after approval keeps
// the earlier version in erp_po_revisions and goes back to draft and approval. The PDF comes from Finance's engine;
// "sent" is recorded by hand (no email attachment yet).
//
// Goods receipt (GR-00001): all or part of an approved order: received, accepted, damaged and rejected quantities with
// reasons, lot and serial numbers and expiry dates. Accepted product quantities enter stock through the inventory
// service in the same transaction as the receipt and the order's received quantities, whose CHECK refuses receiving
// more than ordered (two people receiving the last units at once cannot both succeed). A client key (requestKey) makes
// a double submission return the first receipt. Products marked "inspection required" are flagged, and their lines wait
// for an inspection in Quality (Release 4, quality.ts).
//
// Draft bill: one draft supplier bill per receipt, made by Finance's own createDoc in the company's Finance business
// workspace, for the supplier's Finance contact, by someone whose Finance role may create bills. erp_integration_events
// holds one row per receipt (unique idempotency key), so a retry or a double click never makes a second bill.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { createDoc } from '../fin/docs';
import { docLineAmount } from '../fin/ledger';
import { pdfResponse } from '../fin/render';
import { splitTax } from '../../shared/fin/tax';
import { can, requireErp, segregation, type ErpAccess } from './access';
import { badState, csvResponse, dollars, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zCurrency, zDate, zId, zText } from './util';
import { loadSettings } from './settings';
import { StockOps, q6, stockError, type StockKey } from './stock';
import { loadLocation, loadStockProduct, stockKey } from './inventory';
import { financeOrgsFor, maybeFin } from './suppliers';
import { approvedSupplier, checkLines, loadRfq } from './procurement';
import { recordFiles } from './record-files';
import { purchaseOrderPdf } from './print';

export const purchasingRoutes = new Hono<AppEnv>();

export const PO_STATUS = ['draft', 'awaiting_approval', 'approved', 'sent', 'partially_received', 'received', 'cancelled', 'closed'] as const;
export const PO_LABELS: Record<(typeof PO_STATUS)[number], string> = {
  draft: 'Draft',
  awaiting_approval: 'Awaiting approval',
  approved: 'Approved',
  sent: 'Sent',
  partially_received: 'Partly received',
  received: 'Received',
  cancelled: 'Cancelled',
  closed: 'Closed',
};
export const RULE_LABELS: Record<string, string> = {
  within_limit: 'Approved on submit: within the company’s approval limit',
  manager: 'Approved by a procurement manager',
  solo: 'Approved by the submitter: company of one (recorded exception)',
};
const RECEIVABLE = ['approved', 'sent', 'partially_received'];
const AMENDABLE = ['approved', 'sent', 'partially_received'];

// ------------------------------------------------------------------ tax codes

interface TaxOption {
  value: string;
  label: string;
  rateBp: number;
}

/** The Finance business workspace whose tax codes a supplier's orders use: the supplier's linked one, else the company's only one. */
async function financeOrgFor(db: D1Database, a: ErpAccess, supplier: { fin_org_id: string | null } | null) {
  const orgs = await financeOrgsFor(db, a);
  if (supplier?.fin_org_id && orgs.some((o) => o.id === supplier.fin_org_id)) return orgs.find((o) => o.id === supplier.fin_org_id)!;
  return orgs.length === 1 ? orgs[0] : null;
}

const BASIC_TAX: TaxOption[] = [
  { value: 'GST', label: 'GST 10%', rateBp: 1000 },
  { value: 'NONE', label: 'No GST', rateBp: 0 },
];

async function taxOptions(db: D1Database, finOrgId: string | null): Promise<TaxOption[]> {
  if (!finOrgId) return BASIC_TAX;
  const rows = await db.prepare("SELECT id, code, name, rate_bp FROM fin_tax_codes WHERE org_id = ? AND archived_at IS NULL AND direction IN ('purchases','both') ORDER BY code").bind(finOrgId).all<{ id: string; code: string; name: string; rate_bp: number }>();
  return rows.results.length ? rows.results.map((t) => ({ value: t.id, label: `${t.code} ${t.name} (${t.rate_bp / 100}%)`, rateBp: t.rate_bp })) : BASIC_TAX;
}

purchasingRoutes.get('/c/:company/purchase-order-options', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const supplierId = c.req.query('supplierId');
  const supplier = supplierId ? await db.prepare('SELECT id, fin_org_id, payment_terms_days, currency, delivery_address FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(a.companyId, supplierId).first<any>() : null;
  const org = await financeOrgFor(db, a, supplier);
  const settings = await loadSettings(db, a.companyId);
  const options = await taxOptions(db, org?.id ?? null);
  return c.json({
    financeOrg: org,
    taxCodes: options,
    defaultTaxCode: options.find((o) => o.rateBp === 1000)?.value ?? options[0]?.value ?? 'GST',
    currency: supplier?.currency ?? settings.currency,
    paymentTermsDays: supplier?.payment_terms_days ?? null,
    approvalLimitCents: settings.poApprovalLimitCents,
    companyCurrency: settings.currency,
    email: { available: false, note: 'Email with the PDF attached is not available yet: download the PDF, send it from your own email, then record it as sent.' },
  });
});

// ------------------------------------------------------------------ purchase orders

const zPoLine = z.object({
  id: zId.optional(),
  productId: zId.nullable().optional(),
  item: zText(300).optional(),
  specification: zText(2000).optional(),
  quantity: z.number().positive().max(1e9),
  uom: zText(20).optional(),
  unitPriceCents: z.number().int().min(0).max(1e11),
  discountBp: z.number().int().min(0).max(10_000).optional(),
  taxCode: zText(64).optional(),
  requiredDate: zDate.optional(),
});
type PoLineIn = z.infer<typeof zPoLine>;

const poHeader = {
  supplierId: zId.optional(),
  orderDate: zDate.optional(),
  requiredDate: zDate.optional(),
  deliveryAddress: zText(500).optional(),
  paymentTermsDays: z.number().int().min(0).max(365).nullable().optional(),
  currency: zCurrency.optional(),
  taxMode: z.enum(['exclusive', 'inclusive', 'none']).optional(),
  notes: zText(4000).optional(),
  terms: zText(2000).optional(),
};

interface PricedLine {
  id: string | null;
  productId: string | null;
  productNumber: string | null;
  item: string;
  specification: string;
  quantity: number;
  uom: string;
  unitPriceCents: number;
  discountBp: number;
  taxCode: string;
  taxRateBp: number;
  net: number;
  tax: number;
  requiredDate: string | null;
}

/** Lines priced as Finance prices them (whole cents, three-decimal quantities, GST split per line). */
async function priceLines(db: D1Database, companyId: string, lines: PoLineIn[], options: TaxOption[], mode: 'exclusive' | 'inclusive' | 'none') {
  const checked = await checkLines(db, companyId, lines);
  const rates = new Map(options.map((o) => [o.value, o.rateBp]));
  const defaultCode = options.find((o) => o.rateBp === 1000)?.value ?? options[0].value;
  const priced: PricedLine[] = checked.map((l, i) => {
    const input = lines[i];
    const quantity = Math.round(input.quantity * 1000) / 1000;
    if (quantity <= 0) throw new HttpError(400, `Line ${i + 1}: use a quantity of at least 0.001`);
    // 'GST' and 'NONE' also name the Finance workspace's own 10% and nil purchase codes
    const alias = input.taxCode === 'GST' && !rates.has('GST') ? defaultCode : input.taxCode === 'NONE' && !rates.has('NONE') ? options.find((o) => o.rateBp === 0)?.value : input.taxCode;
    const taxCode = mode === 'none' ? (options.find((o) => o.rateBp === 0)?.value ?? 'NONE') : (alias ?? defaultCode);
    if (!rates.has(taxCode) && !(mode === 'none' && taxCode === 'NONE')) throw new HttpError(400, `Line ${i + 1}: choose a tax code from the list`);
    const rate = mode === 'none' ? 0 : (rates.get(taxCode) ?? 0);
    const amount = docLineAmount(input.unitPriceCents, Math.round(quantity * 1000), input.discountBp ?? 0);
    const s = splitTax(amount, rate, mode);
    return { id: input.id ?? null, productId: l.productId, productNumber: l.productNumber, item: l.item, specification: l.specification, quantity, uom: l.uom, unitPriceCents: input.unitPriceCents, discountBp: input.discountBp ?? 0, taxCode, taxRateBp: rate, net: s.net, tax: s.tax, requiredDate: input.requiredDate ?? null };
  });
  const subtotal = priced.reduce((s, l) => s + l.net, 0);
  const tax = priced.reduce((s, l) => s + l.tax, 0);
  return { lines: priced, subtotal, tax, total: subtotal + tax };
}

const PO_SELECT = `SELECT o.*, s.number AS supplier_number, s.legal_name AS supplier_name, s.trading_name AS supplier_trading, s.abn AS supplier_abn, s.postal_address AS supplier_address, s.email AS supplier_email,
  s.fin_org_id AS supplier_fin_org, s.fin_contact_id AS supplier_fin_contact, cb.name AS created_name, ab.name AS approved_name, sb.name AS submitted_name, q.number AS rfq_number, rq.number AS requisition_number
  FROM erp_purchase_orders o JOIN erp_suppliers s ON s.company_id = o.company_id AND s.id = o.supplier_id
  LEFT JOIN users cb ON cb.id = o.created_by LEFT JOIN users ab ON ab.id = o.approved_by LEFT JOIN users sb ON sb.id = o.submitted_by
  LEFT JOIN erp_rfqs q ON q.company_id = o.company_id AND q.id = o.rfq_id LEFT JOIN erp_requisitions rq ON rq.company_id = o.company_id AND rq.id = o.requisition_id`;

export function poDTO(o: any) {
  return {
    id: o.id,
    number: o.number,
    revision: o.revision,
    supplierId: o.supplier_id,
    supplierNumber: o.supplier_number,
    supplierName: o.supplier_trading || o.supplier_name,
    status: o.status,
    statusLabel: PO_LABELS[o.status as keyof typeof PO_LABELS] ?? o.status,
    requisitionId: o.requisition_id,
    requisitionNumber: o.requisition_number ?? null,
    rfqId: o.rfq_id,
    rfqNumber: o.rfq_number ?? null,
    quotationId: o.quotation_id,
    orderDate: o.order_date,
    requiredDate: o.required_date,
    deliveryAddress: o.delivery_address,
    paymentTermsDays: o.payment_terms_days,
    currency: o.currency,
    taxMode: o.tax_mode,
    finOrgId: o.fin_org_id,
    notes: o.notes,
    terms: o.terms,
    subtotalCents: o.subtotal_cents,
    taxCents: o.tax_cents,
    totalCents: o.total_cents,
    approvalRule: o.approval_rule,
    approvalRuleLabel: o.approval_rule ? RULE_LABELS[o.approval_rule] : null,
    approvalLimitCents: o.approval_limit_cents,
    submittedByName: o.submitted_name ?? null,
    submittedAt: o.submitted_at,
    approvedByName: o.approved_name ?? null,
    approvedAt: o.approved_at,
    sodException: !!o.sod_exception,
    sentAt: o.sent_at,
    sentVia: o.sent_via,
    cancelledAt: o.cancelled_at,
    cancelReason: o.cancel_reason,
    closedAt: o.closed_at,
    createdByName: o.created_name ?? null,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}

export async function loadPo(db: D1Database, companyId: string, id: string) {
  const o = await db.prepare(`${PO_SELECT} WHERE o.company_id = ? AND o.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!o) throw notFound('Purchase order');
  return o;
}

async function poLines(db: D1Database, companyId: string, poId: string) {
  return (
    await db
      .prepare('SELECT l.*, p.number AS product_number, p.name AS product_name FROM erp_po_lines l LEFT JOIN erp_products p ON p.company_id = l.company_id AND p.id = l.product_id WHERE l.company_id = ? AND l.po_id = ? ORDER BY l.position')
      .bind(companyId, poId)
      .all<any>()
  ).results;
}

const poLineDTO = (l: any) => ({
  id: l.id,
  position: l.position,
  productId: l.product_id,
  productNumber: l.product_number ?? null,
  item: l.item,
  specification: l.specification,
  quantity: l.quantity,
  uom: l.uom,
  unitPriceCents: l.unit_price_cents,
  discountBp: l.discount_bp,
  taxCode: l.tax_code,
  taxRateBp: l.tax_rate_bp,
  netCents: l.net_cents,
  taxCents: l.tax_cents,
  received: q6(l.received_qty),
  rejected: q6(l.rejected_qty),
  outstanding: Math.max(0, q6(l.quantity - l.received_qty)),
  requiredDate: l.required_date,
});

function lineInsert(db: D1Database, companyId: string, poId: string, l: PricedLine, position: number) {
  return db
    .prepare('INSERT INTO erp_po_lines (id, company_id, po_id, position, product_id, item, specification, quantity, uom, unit_price_cents, discount_bp, tax_code, tax_rate_bp, net_cents, tax_cents, required_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), companyId, poId, position, l.productId, l.item, l.specification, l.quantity, l.uom, l.unitPriceCents, l.discountBp, l.taxCode, l.taxRateBp, l.net, l.tax, l.requiredDate);
}

purchasingRoutes.get('/c/:company/purchase-orders', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['o.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status === 'open') where.push("o.status IN ('draft','awaiting_approval','approved','sent','partially_received')");
  else if (status === 'to_receive') where.push("o.status IN ('approved','sent','partially_received')");
  else if (status) {
    where.push('o.status = ?');
    args.push(status);
  }
  const supplier = c.req.query('supplierId');
  if (supplier) {
    where.push('o.supplier_id = ?');
    args.push(supplier);
  }
  const from = c.req.query('from');
  const to = c.req.query('to');
  if (from) {
    where.push('o.order_date >= ?');
    args.push(from);
  }
  if (to) {
    where.push('o.order_date <= ?');
    args.push(to);
  }
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('o.search LIKE ?');
    args.push(likeOf(q));
  }
  const sorts: Record<string, string> = { number: 'o.number COLLATE NOCASE DESC', date: 'o.order_date DESC, o.created_at DESC', required: "COALESCE(o.required_date, '9999')", total: 'o.total_cents DESC', supplier: 's.legal_name COLLATE NOCASE' };
  const order = sorts[c.req.query('sort') ?? ''] ?? sorts.date;
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${PO_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(poDTO);
  if (csv) {
    return csvResponse('purchase-orders', [
      ['Number', 'Revision', 'Supplier', 'Status', 'Order date', 'Required', 'Currency', 'Subtotal', 'Tax', 'Total', 'Approval rule', 'Approved by'],
      ...list.map((o) => [o.number, o.revision, o.supplierName, o.statusLabel, o.orderDate, o.requiredDate ?? '', o.currency, dollars(o.subtotalCents), dollars(o.taxCents), dollars(o.totalCents), o.approvalRuleLabel ?? '', o.approvedByName ?? '']),
    ]);
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_purchase_orders o JOIN erp_suppliers s ON s.company_id = o.company_id AND s.id = o.supplier_id WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ purchaseOrders: list, total: total?.n ?? 0, limit, offset, can: { create: can(a, 'purchasing.edit') } });
});

purchasingRoutes.post('/c/:company/purchase-orders', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const input = await body(c, z.object({ ...poHeader, fromQuotationId: zId.optional(), fromRequisitionId: zId.optional(), lines: z.array(zPoLine).max(200).optional() }));
  const t = now();
  const today = new Date(t).toISOString().slice(0, 10);
  let supplierId = input.supplierId;
  let lines: PoLineIn[] = input.lines ?? [];
  let rfq: any = null;
  let quote: any = null;
  let req: any = null;
  let paymentTerms = input.paymentTermsDays;
  let currency = input.currency;
  if (input.fromQuotationId) {
    quote = await db.prepare('SELECT * FROM erp_quotations WHERE company_id = ? AND id = ?').bind(a.companyId, input.fromQuotationId).first<any>();
    if (!quote) throw notFound('Quotation');
    rfq = await loadRfq(db, a.companyId, quote.rfq_id);
    if (rfq.status !== 'approved' || rfq.selected_quotation_id !== quote.id) badState(`${rfq.number}: the order is made from the selected quotation once its choice is approved`);
    supplierId = quote.supplier_id;
    const rl = await db
      .prepare('SELECT l.*, ql.unit_price_cents FROM erp_rfq_lines l LEFT JOIN erp_quotation_lines ql ON ql.company_id = l.company_id AND ql.rfq_line_id = l.id AND ql.quotation_id = ? WHERE l.company_id = ? AND l.rfq_id = ? ORDER BY l.position')
      .bind(quote.id, a.companyId, rfq.id)
      .all<any>();
    lines = rl.results.map((l) => ({ productId: l.product_id, item: l.item, specification: l.specification, quantity: l.quantity, uom: l.uom, unitPriceCents: l.unit_price_cents ?? 0 }));
    if (quote.freight_cents > 0) lines.push({ productId: null, item: 'Freight', quantity: 1, uom: 'each', unitPriceCents: quote.freight_cents });
    paymentTerms = paymentTerms ?? quote.payment_terms_days;
    currency = currency ?? quote.currency;
    if (rfq.requisition_id) req = { id: rfq.requisition_id };
  } else if (input.fromRequisitionId) {
    req = await db.prepare('SELECT * FROM erp_requisitions WHERE company_id = ? AND id = ?').bind(a.companyId, input.fromRequisitionId).first<any>();
    if (!req) throw notFound('Requisition');
    if (req.status !== 'approved') badState(`${req.number} is ${req.status}: an order is made from an approved requisition`);
    if (!lines.length) {
      const rl = await db.prepare('SELECT * FROM erp_requisition_lines WHERE company_id = ? AND requisition_id = ? ORDER BY position').bind(a.companyId, req.id).all<any>();
      lines = rl.results.map((l) => ({ productId: l.product_id, item: l.item, specification: l.specification, quantity: l.quantity, uom: l.uom, unitPriceCents: l.est_unit_cost_cents ?? 0 }));
    }
    currency = currency ?? req.currency;
  }
  if (!supplierId) throw new HttpError(400, 'Choose the supplier');
  const supplier = await approvedSupplier(db, a.companyId, supplierId);
  const org = await financeOrgFor(db, a, supplier);
  const options = await taxOptions(db, org?.id ?? null);
  const mode = input.taxMode ?? 'exclusive';
  const priced = await priceLines(db, a.companyId, lines, options, mode);
  const settings = await loadSettings(db, a.companyId);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'purchase_order');
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_purchase_orders (id, company_id, number, supplier_id, requisition_id, rfq_id, quotation_id, order_date, required_date, delivery_address, payment_terms_days, currency, tax_mode, fin_org_id, notes, terms, subtotal_cents, tax_cents, total_cents, search, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        a.companyId,
        number,
        supplier.id,
        req?.id ?? null,
        rfq?.id ?? null,
        quote?.id ?? null,
        input.orderDate ?? today,
        input.requiredDate ?? rfq?.required_date ?? req?.required_date ?? null,
        input.deliveryAddress ?? rfq?.delivery_address ?? '',
        paymentTerms ?? supplier.payment_terms_days ?? null,
        currency ?? supplier.currency ?? settings.currency,
        mode,
        org?.id ?? null,
        input.notes ?? '',
        input.terms ?? '',
        priced.subtotal,
        priced.tax,
        priced.total,
        searchText(number, supplier.legal_name, supplier.trading_name, ...priced.lines.map((l) => l.item)),
        a.userId,
        t,
        t,
      ),
    ...priced.lines.map((l, i) => lineInsert(db, a.companyId, id, l, i + 1)),
    ...(rfq
      ? [
          db.prepare("UPDATE erp_rfqs SET status = 'ordered', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'approved'").bind(t, a.companyId, rfq.id),
          eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.ordered', entityType: 'rfq', entityId: rfq.id, summary: `${rfq.number}: purchase order ${number} made from the approved quotation`, at: t }),
        ]
      : []),
    ...(input.fromRequisitionId
      ? [
          db.prepare("UPDATE erp_requisitions SET status = 'converted', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'approved'").bind(t, a.companyId, req.id),
          eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'requisition.converted', entityType: 'requisition', entityId: req.id, summary: `${req.number} converted to purchase order ${number}`, at: t }),
        ]
      : []),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'po.created', entityType: 'purchase_order', entityId: id, summary: `${number} drafted for ${supplier.number} ${supplier.legal_name}: ${dollars(priced.total)} ${currency ?? supplier.currency}${rfq ? ` from ${rfq.number}` : ''}`, at: t }),
  ]);
  return c.json({ id, number, status: 'draft' }, 201);
});

purchasingRoutes.get('/c/:company/purchase-orders/:id', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const o = await loadPo(db, a.companyId, c.req.param('id'));
  const lines = await poLines(db, a.companyId, o.id);
  const receipts = await db.prepare('SELECT r.*, u.name AS by_name FROM erp_receipts r LEFT JOIN users u ON u.id = r.created_by WHERE r.company_id = ? AND r.po_id = ? ORDER BY r.created_at').bind(a.companyId, o.id).all<any>();
  const revisions = await db.prepare('SELECT v.revision, v.reason, v.changed_at, v.snapshot_json, u.name AS by_name FROM erp_po_revisions v LEFT JOIN users u ON u.id = v.changed_by WHERE v.company_id = ? AND v.po_id = ? ORDER BY v.revision DESC').bind(a.companyId, o.id).all<any>();
  const options = await taxOptions(db, o.fin_org_id);
  const settings = await loadSettings(db, a.companyId);
  const editor = can(a, 'purchasing.edit');
  const mine = o.submitted_by === a.userId;
  const received = lines.some((l) => l.received_qty > 0);
  return c.json({
    purchaseOrder: poDTO(o),
    lines: lines.map(poLineDTO),
    taxCodes: options,
    receipts: receipts.results.map((r) => ({ id: r.id, number: r.number, receivedDate: r.received_date, deliveryRef: r.delivery_ref, onTime: r.on_time === null ? null : !!r.on_time, inspectionRequired: !!r.inspection_required, byName: r.by_name ?? null, createdAt: r.created_at })),
    revisions: revisions.results.map((v) => ({ revision: v.revision, reason: v.reason, changedAt: v.changed_at, byName: v.by_name ?? null, snapshot: JSON.parse(v.snapshot_json) })),
    files: await recordFiles(db, a.companyId, 'purchase_order', o.id),
    history: await historyOf(db, a.companyId, { entityType: 'purchase_order', entityId: o.id }),
    approvalLimitCents: settings.poApprovalLimitCents,
    companyCurrency: settings.currency,
    email: { available: false, note: 'Email with the PDF attached is not available yet: download the PDF, send it from your own email, then record it as sent.' },
    can: {
      edit: o.status === 'draft' && editor,
      submit: o.status === 'draft' && editor,
      approve: o.status === 'awaiting_approval' && can(a, 'purchasing.approve') && (!mine || a.solo),
      reject: o.status === 'awaiting_approval' && can(a, 'purchasing.approve'),
      send: (o.status === 'approved' || o.status === 'sent') && editor,
      receive: RECEIVABLE.includes(o.status) && can(a, 'receiving.post'),
      amend: AMENDABLE.includes(o.status) && editor,
      cancel: ['draft', 'awaiting_approval', 'approved', 'sent'].includes(o.status) && !received && editor,
      close: (o.status === 'partially_received' || o.status === 'received') && (editor || can(a, 'purchasing.approve')),
      files: editor,
      segregation: o.status === 'awaiting_approval' && mine && !a.solo && can(a, 'purchasing.approve') ? 'You submitted this order, so another procurement manager must approve it.' : null,
    },
  });
});

purchasingRoutes.put('/c/:company/purchase-orders/:id', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const o = await loadPo(db, a.companyId, c.req.param('id'));
  if (o.status !== 'draft') badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}: amend it to change it`);
  const input = await body(c, z.object({ ...poHeader, supplierId: z.never().optional(), lines: z.array(zPoLine).min(1).max(200).optional() }));
  const mode = input.taxMode ?? o.tax_mode;
  const existing = await poLines(db, a.companyId, o.id);
  const linesIn: PoLineIn[] =
    input.lines ??
    existing.map((l) => ({ id: l.id, productId: l.product_id, item: l.item, specification: l.specification, quantity: l.quantity, uom: l.uom, unitPriceCents: l.unit_price_cents, discountBp: l.discount_bp, taxCode: l.tax_code, requiredDate: l.required_date }));
  const priced = await priceLines(db, a.companyId, linesIn, await taxOptions(db, o.fin_org_id), mode);
  const byId = new Map(existing.map((l) => [l.id, l]));
  const keep = new Set<string>();
  const stmts: D1PreparedStatement[] = [];
  priced.lines.forEach((l, i) => {
    const old = l.id ? byId.get(l.id) : undefined;
    if (l.id && !old) throw new HttpError(400, `Line ${i + 1} is not a line of this order`);
    if (old) {
      keep.add(old.id);
      if (l.quantity < old.received_qty - 1e-9) throw new HttpError(400, `Line ${i + 1}: ${old.received_qty} has already been received, so the quantity cannot be lower`);
      if (old.received_qty > 0 && (old.product_id ?? null) !== (l.productId ?? null)) throw new HttpError(400, `Line ${i + 1} has been received: its product cannot change`);
      stmts.push(
        db
          .prepare('UPDATE erp_po_lines SET position = ?, product_id = ?, item = ?, specification = ?, quantity = ?, uom = ?, unit_price_cents = ?, discount_bp = ?, tax_code = ?, tax_rate_bp = ?, net_cents = ?, tax_cents = ?, required_date = ? WHERE company_id = ? AND id = ?')
          .bind(i + 1, l.productId, l.item, l.specification, l.quantity, l.uom, l.unitPriceCents, l.discountBp, l.taxCode, l.taxRateBp, l.net, l.tax, l.requiredDate, a.companyId, old.id),
      );
    } else stmts.push(lineInsert(db, a.companyId, o.id, l, i + 1));
  });
  for (const old of existing) {
    if (keep.has(old.id)) continue;
    if (old.received_qty > 0) throw new HttpError(400, `The line for ${old.item} has been received: it cannot be removed`);
    stmts.unshift(db.prepare('DELETE FROM erp_po_lines WHERE company_id = ? AND id = ?').bind(a.companyId, old.id));
  }
  const t = now();
  await db.batch([
    ...stmts,
    db
      .prepare("UPDATE erp_purchase_orders SET order_date = ?, required_date = ?, delivery_address = ?, payment_terms_days = ?, currency = ?, tax_mode = ?, notes = ?, terms = ?, subtotal_cents = ?, tax_cents = ?, total_cents = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'")
      .bind(
        input.orderDate ?? o.order_date,
        input.requiredDate === undefined ? o.required_date : input.requiredDate,
        input.deliveryAddress ?? o.delivery_address,
        input.paymentTermsDays === undefined ? o.payment_terms_days : input.paymentTermsDays,
        input.currency ?? o.currency,
        mode,
        input.notes ?? o.notes,
        input.terms ?? o.terms,
        priced.subtotal,
        priced.tax,
        priced.total,
        searchText(o.number, o.supplier_name, o.supplier_trading, ...priced.lines.map((l) => l.item)),
        t,
        a.companyId,
        o.id,
      ),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'po.updated', entityType: 'purchase_order', entityId: o.id, summary: `${o.number} changed: ${dollars(priced.total)} ${input.currency ?? o.currency}`, before: { totalCents: o.total_cents }, after: { totalCents: priced.total }, at: t }),
  ]);
  return c.json({ ok: true, totalCents: priced.total });
});

/** The order's status once approved again: what has been received decides it. */
const statusAfterApproval = `CASE WHEN NOT EXISTS (SELECT 1 FROM erp_po_lines l WHERE l.company_id = erp_purchase_orders.company_id AND l.po_id = erp_purchase_orders.id AND l.received_qty > 0) THEN 'approved'
  WHEN NOT EXISTS (SELECT 1 FROM erp_po_lines l WHERE l.company_id = erp_purchase_orders.company_id AND l.po_id = erp_purchase_orders.id AND l.received_qty < l.quantity - 1e-9) THEN 'received' ELSE 'partially_received' END`;

purchasingRoutes.post('/c/:company/purchase-orders/:id/:action{submit|approve|reject|sent|cancel|close|amend}', async (c) => {
  const action = c.req.param('action');
  const a = await requireErp(c, action === 'approve' || action === 'reject' ? 'purchasing.approve' : action === 'close' ? 'purchasing.view' : 'purchasing.edit');
  const db = c.env.DB;
  const o = await loadPo(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ note: zText(1000).optional(), reason: zText(1000).optional() }));
  const t = now();
  const ev = (act: string, summary: string, after?: unknown) => eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `po.${act}`, entityType: 'purchase_order', entityId: o.id, summary, after, at: t });
  const guard = async (stmts: D1PreparedStatement[]) => {
    const res = await db.batch(stmts);
    if (!res[0].meta.changes) badState('Someone changed this order at the same moment: refresh and try again');
  };

  if (action === 'submit') {
    if (o.status !== 'draft') badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}`);
    const lines = await poLines(db, a.companyId, o.id);
    if (!lines.length) badState('Add at least one line first');
    const supplier = await approvedSupplier(db, a.companyId, o.supplier_id);
    const settings = await loadSettings(db, a.companyId);
    const limit = settings.poApprovalLimitCents;
    const within = limit !== null && o.currency === settings.currency && o.total_cents <= limit;
    const solo = !within && can(a, 'purchasing.approve') && a.solo;
    const rule = within ? 'within_limit' : solo ? 'solo' : null;
    const next = rule ? 'approved' : 'awaiting_approval';
    const why = within
      ? `at or below the approval limit of ${dollars(limit)} ${settings.currency}: approved on submit`
      : limit === null
        ? 'no approval limit is set: a procurement manager approves every order'
        : o.currency !== settings.currency
          ? `in ${o.currency}, not ${settings.currency}: a procurement manager approves it`
          : `above the approval limit of ${dollars(limit)} ${settings.currency}: a procurement manager approves it`;
    await guard([
      db
        .prepare(`UPDATE erp_purchase_orders SET status = ${rule ? statusAfterApproval : "'awaiting_approval'"}, submitted_by = ?, submitted_at = ?, approval_rule = ?, approval_limit_cents = ?, approved_by = ?, approved_at = ?, sod_exception = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'`)
        .bind(a.userId, t, rule, limit, rule ? a.userId : null, rule ? t : null, solo ? 1 : 0, t, a.companyId, o.id),
      ev('submitted', `${o.number} submitted (${dollars(o.total_cents)} ${o.currency}), ${why}${solo ? '; approved by the submitter (company of one: recorded exception)' : ''}`, { status: next, rule, limitCents: limit, supplier: supplier.number }),
    ]);
    return c.json({ ok: true, status: next, rule });
  }
  if (action === 'approve' || action === 'reject') {
    if (o.status !== 'awaiting_approval') badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}`);
    if (action === 'reject') {
      if (!input.note) throw new HttpError(400, 'Say why it goes back');
      await guard([
        db.prepare("UPDATE erp_purchase_orders SET status = 'draft', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'awaiting_approval'").bind(t, a.companyId, o.id),
        ev('returned', `${o.number} returned to draft: ${input.note}`),
      ]);
      return c.json({ ok: true, status: 'draft' });
    }
    const sod = segregation(a, o.submitted_by, 'submitted this purchase order');
    await approvedSupplier(db, a.companyId, o.supplier_id);
    await guard([
      db
        .prepare(`UPDATE erp_purchase_orders SET status = ${statusAfterApproval}, approval_rule = ?, approved_by = ?, approved_at = ?, sod_exception = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'awaiting_approval'`)
        .bind(sod ? 'solo' : 'manager', a.userId, t, sod ? 1 : 0, t, a.companyId, o.id),
      ev('approved', `${o.number} approved by ${a.userName}${sod ? ' who submitted it (company of one: recorded exception)' : ''}`, { rule: sod ? 'solo' : 'manager' }),
    ]);
    return c.json({ ok: true, status: 'approved' });
  }
  if (action === 'sent') {
    if (o.status !== 'approved' && o.status !== 'sent') badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}: an order is sent once approved`);
    await guard([
      db.prepare("UPDATE erp_purchase_orders SET status = 'sent', sent_at = ?, sent_via = 'manual', sent_by = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('approved','sent')").bind(t, a.userId, t, a.companyId, o.id),
      ev('sent', `${o.number}${o.revision > 1 ? ` revision ${o.revision}` : ''} recorded as sent manually to ${o.supplier_name}`, { via: 'manual' }),
    ]);
    return c.json({ ok: true, status: 'sent' });
  }
  if (action === 'cancel') {
    if (!['draft', 'awaiting_approval', 'approved', 'sent'].includes(o.status)) badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}: close it instead`);
    if (!input.reason) throw new HttpError(400, 'Say why it is cancelled');
    await guard([
      db
        .prepare("UPDATE erp_purchase_orders SET status = 'cancelled', cancelled_by = ?, cancelled_at = ?, cancel_reason = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('draft','awaiting_approval','approved','sent') AND NOT EXISTS (SELECT 1 FROM erp_po_lines l WHERE l.company_id = ? AND l.po_id = ? AND l.received_qty > 0)")
        .bind(a.userId, t, input.reason, t, a.companyId, o.id, a.companyId, o.id),
      ev('cancelled', `${o.number} cancelled: ${input.reason}`),
    ]);
    return c.json({ ok: true, status: 'cancelled' });
  }
  if (action === 'close') {
    if (!can(a, 'purchasing.edit') && !can(a, 'purchasing.approve')) throw new HttpError(403, 'Only buyers and procurement managers can close an order');
    if (o.status !== 'partially_received' && o.status !== 'received') badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}: only a received or partly received order closes`);
    await guard([
      db.prepare("UPDATE erp_purchase_orders SET status = 'closed', closed_by = ?, closed_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('partially_received','received')").bind(a.userId, t, t, a.companyId, o.id),
      ev('closed', `${o.number} closed${o.status === 'partially_received' ? ': the rest is no longer expected' : ''}${input.reason ? ` (${input.reason})` : ''}`),
    ]);
    return c.json({ ok: true, status: 'closed' });
  }
  // amend: keep this version, then back to draft for changes and approval
  if (!AMENDABLE.includes(o.status)) badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}: only an approved, sent or partly received order is amended`);
  if (!input.reason) throw new HttpError(400, 'Say why the order is amended');
  const lines = await poLines(db, a.companyId, o.id);
  const snapshot = { ...poDTO(o), lines: lines.map(poLineDTO) };
  await guard([
    db
      .prepare("UPDATE erp_purchase_orders SET status = 'draft', revision = revision + 1, approval_rule = NULL, approval_limit_cents = NULL, approved_by = NULL, approved_at = NULL, submitted_by = NULL, submitted_at = NULL, sod_exception = 0, sent_at = NULL, sent_via = NULL, sent_by = NULL, updated_at = ? WHERE company_id = ? AND id = ? AND revision = ? AND status IN ('approved','sent','partially_received')")
      .bind(t, a.companyId, o.id, o.revision),
    db.prepare('INSERT INTO erp_po_revisions (id, company_id, po_id, revision, snapshot_json, reason, changed_by, changed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, o.id, o.revision, JSON.stringify(snapshot).slice(0, 200_000), input.reason, a.userId, t),
    ev('amended', `${o.number} amended (revision ${o.revision} kept, now revision ${o.revision + 1}): ${input.reason}. It goes back to approval.`, { from: o.revision, to: o.revision + 1 }),
  ]);
  return c.json({ ok: true, status: 'draft', revision: o.revision + 1 });
});

async function poPdfBytes(c: any, a: ErpAccess, o: any) {
  const lines = await poLines(c.env.DB, a.companyId, o.id);
  return purchaseOrderPdf(
    c.env,
    a,
    {
      number: o.number,
      status: o.status,
      revision: o.revision,
      orderDate: o.order_date,
      requiredDate: o.required_date,
      reference: [o.rfq_number ? `RFQ ${o.rfq_number}` : '', o.requisition_number ? `REQ ${o.requisition_number}` : ''].filter(Boolean).join(', '),
      buyer: o.created_name ?? '',
      taxMode: o.tax_mode,
      subtotal: o.subtotal_cents,
      tax: o.tax_cents,
      total: o.total_cents,
      notes: o.notes,
      terms: o.terms,
      deliveryAddress: o.delivery_address,
      currency: o.currency,
      paymentTermsDays: o.payment_terms_days,
    },
    { name: o.supplier_name, abn: o.supplier_abn, address: o.supplier_address, email: o.supplier_email },
    lines.map((l) => ({ itemCode: l.product_number ?? '', description: [l.item, l.specification].filter(Boolean).join('\n'), quantity: l.quantity, unit: l.uom, unitPriceCents: l.unit_price_cents, discountBp: l.discount_bp, taxRateBp: l.tax_rate_bp })),
  );
}

purchasingRoutes.get('/c/:company/purchase-orders/:id/pdf', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const o = await loadPo(c.env.DB, a.companyId, c.req.param('id'));
  return pdfResponse(await poPdfBytes(c, a, o), o.revision > 1 ? `${o.number}-rev-${o.revision}` : o.number, c.req.query('inline') === '1');
});

/** The PDF of a purchase order as it would be saved (the live preview; nothing is saved). */
purchasingRoutes.post('/c/:company/purchase-orders/preview', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const input = await body(c, z.object({ ...poHeader, number: zText(40).optional(), revision: z.number().int().min(1).max(1000).optional(), lines: z.array(zPoLine).max(200).optional() }));
  const supplier = input.supplierId ? await db.prepare('SELECT * FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(a.companyId, input.supplierId).first<any>() : null;
  const org = await financeOrgFor(db, a, supplier);
  const mode = input.taxMode ?? 'exclusive';
  const priced = input.lines?.length ? await priceLines(db, a.companyId, input.lines, await taxOptions(db, org?.id ?? null), mode) : { lines: [] as PricedLine[], subtotal: 0, tax: 0, total: 0 };
  const bytes = await purchaseOrderPdf(
    c.env,
    a,
    { number: input.number || 'PO (new)', status: 'draft', revision: input.revision ?? 1, orderDate: input.orderDate ?? new Date(now()).toISOString().slice(0, 10), requiredDate: input.requiredDate ?? null, reference: '', buyer: a.userName, taxMode: mode, subtotal: priced.subtotal, tax: priced.tax, total: priced.total, notes: input.notes ?? '', terms: input.terms ?? '', deliveryAddress: input.deliveryAddress ?? '', currency: input.currency ?? supplier?.currency ?? 'AUD', paymentTermsDays: input.paymentTermsDays ?? supplier?.payment_terms_days ?? null },
    supplier ? { name: supplier.legal_name, abn: supplier.abn, address: supplier.postal_address, email: supplier.email } : { name: '' },
    priced.lines.map((l) => ({ itemCode: l.productNumber ?? '', description: [l.item, l.specification].filter(Boolean).join('\n'), quantity: l.quantity, unit: l.uom, unitPriceCents: l.unitPriceCents, discountBp: l.discountBp, taxRateBp: l.taxRateBp })),
  );
  return pdfResponse(bytes, 'purchase-order-preview', true);
});

// ------------------------------------------------------------------ goods receipts

const zReceiptLine = z.object({
  poLineId: zId,
  received: z.number().min(0).max(1e9),
  damaged: z.number().min(0).max(1e9).optional(),
  rejected: z.number().min(0).max(1e9).optional(),
  reason: zText(500).optional(),
  locationId: zId.nullable().optional(),
  lot: zText(80).optional(),
  serials: z.array(zText(80).min(1)).max(1000).optional(),
  expiry: zDate.optional(),
});

const RECEIPT_SELECT = `SELECT r.*, o.number AS po_number, o.currency, s.number AS supplier_number, s.legal_name AS supplier_name, u.name AS by_name
  FROM erp_receipts r JOIN erp_purchase_orders o ON o.company_id = r.company_id AND o.id = r.po_id JOIN erp_suppliers s ON s.company_id = r.company_id AND s.id = r.supplier_id LEFT JOIN users u ON u.id = r.created_by`;

export function receiptDTO(r: any) {
  return {
    id: r.id,
    number: r.number,
    poId: r.po_id,
    poNumber: r.po_number,
    supplierId: r.supplier_id,
    supplierNumber: r.supplier_number,
    supplierName: r.supplier_name,
    receivedDate: r.received_date,
    deliveryRef: r.delivery_ref,
    notes: r.notes,
    onTime: r.on_time === null ? null : !!r.on_time,
    inspectionRequired: !!r.inspection_required,
    groupId: r.group_id,
    byName: r.by_name ?? null,
    createdAt: r.created_at,
  };
}

async function loadReceipt(db: D1Database, companyId: string, id: string) {
  const r = await db.prepare(`${RECEIPT_SELECT} WHERE r.company_id = ? AND r.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!r) throw notFound('Goods receipt');
  return r;
}

purchasingRoutes.post('/c/:company/purchase-orders/:id/receipts', async (c) => {
  const a = await requireErp(c, 'receiving.post');
  const db = c.env.DB;
  const input = await body(
    c,
    z.object({ requestKey: z.string().trim().min(8).max(80).optional(), receivedDate: zDate.optional(), deliveryRef: zText(200).optional(), notes: zText(2000).optional(), lines: z.array(zReceiptLine).min(1).max(200) }),
  );
  if (input.requestKey) {
    const done = await db.prepare('SELECT id, number FROM erp_receipts WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string; number: string }>();
    if (done) return c.json({ id: done.id, number: done.number, replayed: true });
  }
  const o = await loadPo(db, a.companyId, c.req.param('id'));
  if (!RECEIVABLE.includes(o.status)) badState(`${o.number} is ${PO_LABELS[o.status as keyof typeof PO_LABELS]}: goods are received against an approved order`);
  const lines = await poLines(db, a.companyId, o.id);
  const byId = new Map(lines.map((l) => [l.id, l]));
  const settings = await loadSettings(db, a.companyId);
  const t = now();
  const receivedDate = input.receivedDate ?? new Date(t).toISOString().slice(0, 10);
  const id = newId();
  const ops = new StockOps(db, a, settings, t);
  const lineStmts: D1PreparedStatement[] = [];
  const poStmts: D1PreparedStatement[] = [];
  let inspection = false;
  const seen = new Set<string>();
  const summary: string[] = [];
  for (const [i, x] of input.lines.entries()) {
    const l = byId.get(x.poLineId);
    if (!l) throw new HttpError(400, `Line ${i + 1} is not a line of ${o.number}`);
    if (seen.has(l.id)) throw new HttpError(400, `Line ${i + 1}: each order line once per receipt`);
    seen.add(l.id);
    const damaged = x.damaged ?? 0;
    const rejected = x.rejected ?? 0;
    const accepted = q6(x.received - damaged - rejected);
    if (accepted < -1e-9) throw new HttpError(400, `Line ${i + 1}: damaged and rejected are more than was received`);
    if (x.received <= 0) continue;
    if ((damaged > 0 || rejected > 0) && !x.reason) throw new HttpError(400, `Line ${i + 1}: say why some was damaged or rejected`);
    const outstanding = q6(l.quantity - l.received_qty);
    if (accepted > outstanding + 1e-9) throw new HttpError(400, `Line ${i + 1} (${l.item}): ${outstanding} ${l.uom} is outstanding, ${accepted} cannot be accepted`);
    let locationId: string | null = null;
    let lot = '';
    let serials: string[] = [];
    let expiry: string | null = null;
    let unitCost: number | null = null;
    let lineInspection = false;
    if (l.product_id && accepted > 0) {
      const p = await loadStockProduct(db, a.companyId, l.product_id);
      if (p.type !== 'service') {
        locationId = x.locationId ?? p.default_location_id;
        if (!locationId) throw new HttpError(400, `Line ${i + 1} (${p.number}): choose where it goes`);
        const loc = await loadLocation(db, a.companyId, locationId);
        lot = p.track_lots ? (x.lot ?? '').trim() : '';
        expiry = x.expiry ?? null;
        serials = p.track_serials ? [...new Set((x.serials ?? []).map((s) => s.trim()).filter(Boolean))] : [];
        if (p.track_serials) {
          if (!Number.isInteger(accepted)) throw new HttpError(400, `Line ${i + 1} (${p.number}): serial-numbered items are received in whole units`);
          if (serials.length !== accepted) throw new HttpError(400, `Line ${i + 1} (${p.number}): give ${accepted} different serial number${accepted === 1 ? '' : 's'}, one for each unit accepted`);
        }
        // the same checks as any stock coming in (lot, expiry, an open location)
        await stockKey(db, a.companyId, { productId: p.id, locationId: loc.id, lot, serial: serials[0] }, { incoming: true, expiry });
        // the order's net price per unit, in the company's stock currency; another currency is valued at standard cost
        const net = splitTax(docLineAmount(l.unit_price_cents, Math.round(l.quantity * 1000), l.discount_bp), l.tax_rate_bp, o.tax_mode).net;
        unitCost = o.currency === settings.currency ? net / l.quantity : (p.standard_cost_cents ?? 0);
        lineInspection = !!p.inspection_required;
        inspection ||= lineInspection;
        const ref = `${o.number} / receipt`;
        if (serials.length) for (const s of serials) await ops.addIn('receipt', { productId: p.id, locationId: loc.id, lot, serial: s }, 1, { source: 'receipt', sourceId: id, reference: ref, unitCost, expiry });
        else await ops.addIn('receipt', { productId: p.id, locationId: loc.id, lot, serial: '' } as StockKey, accepted, { source: 'receipt', sourceId: id, reference: ref, unitCost, expiry });
      }
    }
    lineStmts.push(
      db
        .prepare(
          'INSERT INTO erp_receipt_lines (id, company_id, receipt_id, po_line_id, product_id, location_id, received_qty, accepted_qty, damaged_qty, rejected_qty, reason, lot, serials_json, expiry, unit_cost_cents, inspection_required) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        )
        .bind(newId(), a.companyId, id, l.id, l.product_id, locationId, x.received, accepted, damaged, rejected, x.reason ?? '', lot, JSON.stringify(serials), expiry, unitCost, lineInspection ? 1 : 0),
    );
    // the CHECK on erp_po_lines refuses more accepted than ordered, so a concurrent receipt of the same units fails whole
    poStmts.push(db.prepare('UPDATE erp_po_lines SET received_qty = round(received_qty + ?, 6), rejected_qty = round(rejected_qty + ?, 6) WHERE company_id = ? AND id = ?').bind(accepted, q6(damaged + rejected), a.companyId, l.id));
    summary.push(`${l.product_number ?? l.item}: ${accepted} accepted${damaged ? `, ${damaged} damaged` : ''}${rejected ? `, ${rejected} rejected` : ''}`);
  }
  if (!lineStmts.length) throw new HttpError(400, 'Give the quantity received on at least one line');
  const number = await nextNumber(db, a.companyId, 'receipt');
  const onTime = o.required_date ? (receivedDate <= o.required_date ? 1 : 0) : null;
  const head = db
    .prepare(
      `INSERT INTO erp_receipts (id, company_id, number, po_id, supplier_id, received_date, delivery_ref, notes, request_key, on_time, inspection_required, group_id, created_by, created_at)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM erp_purchase_orders WHERE company_id = ? AND id = ? AND status IN ('approved','sent','partially_received'))`,
    )
    .bind(id, a.companyId, number, o.id, o.supplier_id, receivedDate, input.deliveryRef ?? '', input.notes ?? '', input.requestKey ?? null, onTime, inspection ? 1 : 0, ops.groupId, a.userId, t, a.companyId, o.id);
  const after = [
    ...poStmts,
    db
      .prepare(
        `UPDATE erp_purchase_orders SET status = CASE WHEN NOT EXISTS (SELECT 1 FROM erp_po_lines l WHERE l.company_id = ?1 AND l.po_id = ?2 AND l.received_qty < l.quantity - 1e-9) THEN 'received' ELSE 'partially_received' END, updated_at = ?3
          WHERE company_id = ?1 AND id = ?2 AND status IN ('approved','sent','partially_received')`,
      )
      .bind(a.companyId, o.id, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'receipt.posted', entityType: 'receipt', entityId: id, summary: `${number} against ${o.number}: ${summary.join('; ')}${inspection ? '. Inspection required.' : ''}`, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'po.received', entityType: 'purchase_order', entityId: o.id, summary: `Goods receipt ${number}: ${summary.join('; ')}`, at: t }),
  ];
  try {
    // the receipt (only while the order can be received), its lines (which need the receipt), stock, then the order
    await db.batch(ops.all([head, ...lineStmts], after, { type: 'receipt', id }));
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (input.requestKey && /UNIQUE constraint failed: erp_receipts\.company_id, erp_receipts\.request_key|erp_receipts_request/i.test(msg)) {
      const done = await db.prepare('SELECT id, number FROM erp_receipts WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string; number: string }>();
      if (done) return c.json({ id: done.id, number: done.number, replayed: true });
    }
    if (/FOREIGN KEY constraint failed/i.test(msg)) badState(`${o.number} changed at the same moment and cannot be received now: refresh`);
    stockError(e);
  }
  return c.json({ id, number, inspectionRequired: inspection, onTime: onTime === null ? null : !!onTime }, 201);
});

purchasingRoutes.get('/c/:company/receipts', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['r.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const add = (sql: string, v: unknown) => {
    where.push(sql);
    args.push(v);
  };
  if (c.req.query('supplierId')) add('r.supplier_id = ?', c.req.query('supplierId'));
  if (c.req.query('poId')) add('r.po_id = ?', c.req.query('poId'));
  if (c.req.query('from')) add('r.received_date >= ?', c.req.query('from'));
  if (c.req.query('to')) add('r.received_date <= ?', c.req.query('to'));
  if (c.req.query('inspection') === '1') where.push('r.inspection_required = 1');
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('(r.number LIKE ? OR o.number LIKE ? OR s.legal_name LIKE ? OR r.delivery_ref LIKE ?)');
    const l = likeOf(q);
    args.push(l, l, l, l);
  }
  const order = c.req.query('sort') === 'number' ? 'r.number COLLATE NOCASE DESC' : 'r.received_date DESC, r.created_at DESC';
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${RECEIPT_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(receiptDTO);
  if (csv) return csvResponse('goods-receipts', [['Number', 'Purchase order', 'Supplier', 'Received', 'Delivery reference', 'On time', 'Inspection required', 'By'], ...list.map((r) => [r.number, r.poNumber, r.supplierName, r.receivedDate, r.deliveryRef, r.onTime === null ? '' : r.onTime ? 'yes' : 'no', r.inspectionRequired ? 'yes' : '', r.byName ?? ''])]);
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_receipts r JOIN erp_purchase_orders o ON o.company_id = r.company_id AND o.id = r.po_id JOIN erp_suppliers s ON s.company_id = r.company_id AND s.id = r.supplier_id WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ receipts: list, total: total?.n ?? 0, limit, offset, can: { receive: can(a, 'receiving.post') } });
});

purchasingRoutes.get('/c/:company/receipts/:id', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const r = await loadReceipt(db, a.companyId, c.req.param('id'));
  const lines = await db
    .prepare(
      `SELECT x.*, pl.item, pl.uom, pl.quantity AS ordered, pl.unit_price_cents, p.number AS product_number, l.code AS location_code, w.code AS warehouse_code
         FROM erp_receipt_lines x JOIN erp_po_lines pl ON pl.company_id = x.company_id AND pl.id = x.po_line_id LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
         LEFT JOIN erp_locations l ON l.company_id = x.company_id AND l.id = x.location_id LEFT JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
        WHERE x.company_id = ? AND x.receipt_id = ? ORDER BY pl.position`,
    )
    .bind(a.companyId, r.id)
    .all<any>();
  const integration = await db.prepare("SELECT * FROM erp_integration_events WHERE company_id = ? AND source_type = 'receipt' AND source_id = ? ORDER BY created_at").bind(a.companyId, r.id).all<any>();
  const bill = integration.results.find((e) => e.kind === 'finance.draft_bill');
  const billView = await billInfo(c, a, r, bill);
  return c.json({
    receipt: receiptDTO(r),
    lines: lines.results.map((x) => ({
      id: x.id,
      poLineId: x.po_line_id,
      productId: x.product_id,
      productNumber: x.product_number ?? null,
      item: x.item,
      uom: x.uom,
      ordered: x.ordered,
      received: q6(x.received_qty),
      accepted: q6(x.accepted_qty),
      damaged: q6(x.damaged_qty),
      rejected: q6(x.rejected_qty),
      reason: x.reason,
      location: x.location_code ? `${x.warehouse_code}/${x.location_code}` : null,
      lot: x.lot,
      serials: JSON.parse(x.serials_json),
      expiry: x.expiry,
      unitCostCents: x.unit_cost_cents,
      inspectionRequired: !!x.inspection_required,
    })),
    integration: integration.results.map(integrationDTO),
    bill: billView,
    files: await recordFiles(db, a.companyId, 'receipt', r.id),
    history: await historyOf(db, a.companyId, { entityType: 'receipt', entityId: r.id }),
    inspectionNote: r.inspection_required ? 'Inspection required: inspect the flagged lines in Quality. The goods stay in stock where they were received unless a failed inspection puts them into quarantine.' : null,
    // Release 4: inspections of this receipt's lines
    inspections: (
      await db.prepare("SELECT id, number, status, result, receipt_line_id FROM erp_qc_inspections WHERE company_id = ? AND receipt_id = ? AND status <> 'cancelled' ORDER BY created_at").bind(a.companyId, r.id).all<any>()
    ).results.map((i) => ({ id: i.id, number: i.number, status: i.status, result: i.result, receiptLineId: i.receipt_line_id })),
  });
});

export function integrationDTO(e: any) {
  return { id: e.id, kind: e.kind, kindLabel: e.kind === 'finance.draft_bill' ? 'Draft bill in Finance' : 'Inventory posting to Finance', status: e.status, attempts: e.attempts, lastError: e.last_error, targetRef: e.target_ref, amountCents: e.amount_cents, createdAt: e.created_at, updatedAt: e.updated_at };
}

// ------------------------------------------------------------------ the draft bill in Finance

async function billInfo(c: any, a: ErpAccess, r: any, ev: any | undefined) {
  const db = c.env.DB as D1Database;
  const s = await db.prepare('SELECT fin_org_id, fin_contact_id FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(a.companyId, r.supplier_id).first<any>();
  const orgs = await financeOrgsFor(db, a);
  const org = s?.fin_org_id ? orgs.find((o) => o.id === s.fin_org_id) : undefined;
  const fa = org ? await maybeFin(db, org.id, c.get('user')) : null;
  const accepted = await db.prepare('SELECT COUNT(*) AS n FROM erp_receipt_lines WHERE company_id = ? AND receipt_id = ? AND accepted_qty > 0').bind(a.companyId, r.id).first<{ n: number }>();
  let reason: string | null = null;
  if (!orgs.length) reason = 'The company does not run a Finance business workspace.';
  else if (!s?.fin_contact_id || !org) reason = 'Link the supplier to its Finance contact first (on the supplier’s page).';
  else if (!fa) reason = 'You have no access to the company’s Finance workspace.';
  else if (!fa.perms.purchases.create) reason = 'Your Finance role cannot create bills.';
  else if (!can(a, 'purchasing.edit')) reason = 'Only buyers, procurement managers and ERP administrators can ask for the bill.';
  else if (!accepted?.n) reason = 'Nothing on this receipt was accepted.';
  const done = ev?.status === 'done';
  return {
    status: ev?.status ?? 'none',
    billId: done ? ev.target_ref : null,
    url: done && fa && ev.target_org_id === fa.orgId ? `/erp/finance/o/${fa.orgId}/bills/${ev.target_ref}` : null,
    canCreate: !done && !reason,
    reason: done ? null : reason,
    lastError: ev?.status === 'failed' ? ev.last_error : null,
  };
}

const TAX_KEYS: Record<string, string | null> = { GST: 'gst_purchases', NONE: 'free_purchases' };

purchasingRoutes.post('/c/:company/receipts/:id/bill', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const r = await loadReceipt(db, a.companyId, c.req.param('id'));
  const o = await loadPo(db, a.companyId, r.po_id);
  if (!o.supplier_fin_contact || !o.supplier_fin_org) badState('Link the supplier to its Finance contact first (on the supplier’s page)');
  const org = (await financeOrgsFor(db, a)).find((x) => x.id === o.supplier_fin_org);
  if (!org) badState('The supplier’s Finance workspace is not this company’s');
  const fa = await maybeFin(db, org.id, c.get('user'));
  if (!fa) throw new HttpError(403, 'You have no access to the company’s Finance workspace');
  if (!fa.perms.purchases.create) throw new HttpError(403, 'Your Finance role cannot create bills');
  const key = `bill:receipt:${a.companyId}:${r.id}`;
  const t = now();
  // One row per receipt: a second request finds it and never makes a second bill.
  await db
    .prepare("INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, target_org_id, created_by, created_at, updated_at) VALUES (?, ?, 'finance.draft_bill', 'receipt', ?, 'finance', ?, 'pending', 0, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING")
    .bind(newId(), a.companyId, r.id, key, org.id, a.userId, t, t)
    .run();
  const ev = (await db.prepare('SELECT * FROM erp_integration_events WHERE idempotency_key = ?').bind(key).first<any>())!;
  if (ev.status === 'done') return c.json({ billId: ev.target_ref, existing: true, url: `/erp/finance/o/${ev.target_org_id}/bills/${ev.target_ref}` });
  // claim it: only one request at a time makes the bill (attempts moves on, compared and set in one statement)
  const claim = await db
    .prepare("UPDATE erp_integration_events SET attempts = attempts + 1, status = 'pending', updated_at = ? WHERE idempotency_key = ? AND attempts = ? AND status IN ('pending','failed') AND (attempts = 0 OR status = 'failed' OR updated_at < ?)")
    .bind(t, key, ev.attempts, t - 120_000)
    .run();
  if (!claim.meta.changes) throw new HttpError(409, 'The draft bill is being made now: refresh in a moment');
  const reference = `${r.number} ${o.number}`;
  try {
    // A bill made before a crash, between Finance saving it and this row being marked done, is found, not made again.
    const before = await db.prepare("SELECT id FROM fin_docs WHERE org_id = ? AND kind = 'bill' AND reference = ? AND deleted_at IS NULL").bind(org.id, reference).first<{ id: string }>();
    let billId = before?.id;
    if (!billId) {
      const lines = await db
        .prepare('SELECT x.accepted_qty, pl.item, pl.specification, pl.uom, pl.unit_price_cents, pl.discount_bp, pl.tax_code, pl.tax_rate_bp, p.number AS product_number FROM erp_receipt_lines x JOIN erp_po_lines pl ON pl.company_id = x.company_id AND pl.id = x.po_line_id LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id WHERE x.company_id = ? AND x.receipt_id = ? AND x.accepted_qty > 0 ORDER BY pl.position')
        .bind(a.companyId, r.id)
        .all<any>();
      if (!lines.results.length) badState('Nothing on this receipt was accepted');
      const codes = await db.prepare('SELECT id, system_key FROM fin_tax_codes WHERE org_id = ? AND archived_at IS NULL').bind(org.id).all<{ id: string; system_key: string | null }>();
      const ids = new Set(codes.results.map((x) => x.id));
      const bySystem = new Map(codes.results.filter((x) => x.system_key).map((x) => [x.system_key!, x.id]));
      const taxCodeFor = (code: string) => (o.fin_org_id === org.id && ids.has(code) ? code : TAX_KEYS[code] ? (bySystem.get(TAX_KEYS[code]!) ?? null) : null);
      const billLines = lines.results.map((l) => ({
        itemCode: l.product_number ?? '',
        description: [l.item, l.specification].filter(Boolean).join(' - ').slice(0, 1000),
        unit: l.uom,
        quantity: Math.round(l.accepted_qty * 1000) / 1000,
        unitPrice: l.unit_price_cents,
        discountBp: l.discount_bp,
        taxCodeId: taxCodeFor(l.tax_code),
      }));
      // A workspace not registered for GST records no GST of its own; the GST the supplier charges on an order priced
      // before GST is a line of its own, so the draft bill comes to what the supplier invoices.
      if (!fa.gst && o.tax_mode === 'exclusive') {
        const gst = lines.results.reduce((n, l) => n + splitTax(docLineAmount(l.unit_price_cents, Math.round(l.accepted_qty * 1000), l.discount_bp), l.tax_rate_bp, 'exclusive').tax, 0);
        if (gst > 0) billLines.push({ itemCode: '', description: 'GST charged by the supplier (this workspace is not registered for GST)', unit: '', quantity: 1, unitPrice: gst, discountBp: 0, taxCodeId: null });
      }
      const made = await createDoc(c.env, fa, {
        kind: 'bill',
        contactId: o.supplier_fin_contact,
        issueDate: r.received_date,
        reference,
        taxMode: o.tax_mode,
        notes: `Made from BIZOMAT ERP goods receipt ${r.number} against purchase order ${o.number}. Check the supplier's invoice before approving.`,
        action: 'draft',
        lines: billLines,
      });
      billId = made.id;
    }
    await db.batch([
      db.prepare("UPDATE erp_integration_events SET status = 'done', target_ref = ?, target_org_id = ?, last_error = '', updated_at = ? WHERE idempotency_key = ?").bind(billId, org.id, now(), key),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'receipt.bill_drafted', entityType: 'receipt', entityId: r.id, summary: `Draft bill made in Finance for ${r.number} (${reference})`, after: { finOrg: org.id, bill: billId }, at: now() }),
    ]);
    return c.json({ billId, existing: !!before, url: `/erp/finance/o/${org.id}/bills/${billId}` }, before ? 200 : 201);
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : 'Finance could not make the bill';
    await db.prepare("UPDATE erp_integration_events SET status = 'failed', last_error = ?, updated_at = ? WHERE idempotency_key = ?").bind(msg.slice(0, 200), now(), key).run();
    throw e;
  }
});
