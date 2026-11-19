// BIZOMAT ERP, Release 5 part A: sales orders (/api/erp/c/:company/...). Who may do what: access.ts (sales.view,
// sales.edit, sales.confirm, sales.allocate, production.plan for make to order). Docs: docs/erp/release-5-supply-chain.md.
//
// Sales order (SO-00001) for the company's existing customer record: the CRM company (and contact) and the Finance
// contact the company bills it as. Only references are stored, never a copy of the customer; the name on the order is a
// snapshot, as Finance keeps on its own documents. In a registered company the CRM company and the Finance contact are
// one customer record through the company's link (co_customer_links, src/worker/company/links.ts); a person's own or
// example company has no such link, so the order names both. Every choice is checked with the CRM's and Finance's own
// permissions.
//
// Lines: ERP products (not services), quantity, price, discount and Finance tax codes, priced exactly as Finance prices
// lines (docLineAmount, splitTax), as Release 2's purchase orders are. Statuses: draft, confirmed, partially_allocated,
// allocated, partially_shipped, shipped, invoiced (worked out from the lines, the shipments and their draft invoices,
// in the same transaction as each change), closed and cancelled. A confirmed order is amended with a reason: the version
// before is kept in erp_so_revisions.
//
// Allocation reserves stock for a line through StockOps (Release 2's reservations; soonest expiry first, then the
// oldest), outside quarantine. The line's allocated_qty moves in the same transaction, and its CHECK refuses allocating
// more than is still to ship. Make to order: a manufacturing order made from a line through Release 3's createMo, in
// the same transaction as its link (erp_so_mo_links), which the order shows too. Confirmed orders are demand in MRP
// (planning.ts). A won CRM deal becomes a draft order for its customer.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { docLineAmount } from '../fin/ledger';
import { hasPerm as finHasPerm, scopeSql as finScopeSql } from '../fin/access';
import { assertRecord as crmAssertRecord, loadAccess as crmAccess, scopeSql as crmScopeSql, type OrgAccess } from '../crm/access';
import { splitTax } from '../../shared/fin/tax';
import { companyTools } from '../company/access';
import { assertCan, can, requireErp, type ErpAccess } from './access';
import { badState, csvResponse, dollars, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zDate, zId, zText } from './util';
import { loadSettings } from './settings';
import { StockOps, availableByProduct, onceStmt, q6, runStock, type StockKey } from './stock';
import { financeOrgsFor, maybeFin } from './suppliers';
import { recordFiles } from './record-files';
import { createMo } from './production';
import { label, todayIso } from './manufacturing';

export const salesRoutes = new Hono<AppEnv>();

export const SO_STATUS = {
  draft: 'Draft',
  confirmed: 'Confirmed',
  partially_allocated: 'Partly allocated',
  allocated: 'Allocated',
  partially_shipped: 'Partly shipped',
  shipped: 'Shipped',
  invoiced: 'Invoiced',
  closed: 'Closed',
  cancelled: 'Cancelled',
} as const;
export type SoStatus = keyof typeof SO_STATUS;
export const FULFIL = { stock: 'From stock', make: 'Make to order' } as const;
/** Orders still being fulfilled: they allocate, ship, and count as demand in MRP. */
export const OPEN_SO = ['confirmed', 'partially_allocated', 'allocated', 'partially_shipped'] as const;
const zKey = z.string().trim().min(8).max(80).optional();

/** The JSON body of an action, or {} when it has none. */
export async function lenient<T>(c: any, schema: z.ZodType<T>): Promise<T> {
  const raw = await c.req.json().catch(() => ({}));
  const r = schema.safeParse(raw ?? {});
  if (!r.success) throw new HttpError(400, 'Invalid request', r.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })));
  return r.data;
}

// ------------------------------------------------------------------ the company's customers (CRM and Finance)

/** The CRM organisations the company runs: a registered company's, the example's, or those a person owns themselves. */
export async function crmOrgsFor(db: D1Database, a: ErpAccess): Promise<{ id: string; name: string }[]> {
  if (a.kind === 'registered') {
    const id = (await companyTools(db, a.companyId)).crm;
    if (!id) return [];
    const o = await db.prepare('SELECT id, name FROM crm_orgs WHERE id = ? AND deleted_at IS NULL').bind(id).first<{ id: string; name: string }>();
    return o ? [o] : [];
  }
  if (a.kind === 'demo') {
    const o = await db.prepare('SELECT o.id, o.name FROM sys_demo d JOIN crm_orgs o ON o.id = d.crm_org_id WHERE d.company_id = ? AND d.user_id = ? AND o.deleted_at IS NULL').bind(a.companyId, a.userId).first<{ id: string; name: string }>();
    return o ? [o] : [];
  }
  const rows = await db
    .prepare(
      `SELECT o.id, o.name FROM crm_orgs o JOIN crm_members m ON m.org_id = o.id AND m.user_id = ? AND m.role = 'owner'
        WHERE o.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'crm' AND t.ref_id = o.id)
          AND NOT EXISTS (SELECT 1 FROM sys_demo d WHERE d.crm_org_id = o.id) ORDER BY o.name COLLATE NOCASE LIMIT 20`,
    )
    .bind(a.userId)
    .all<{ id: string; name: string }>();
  return rows.results;
}

async function maybeCrm(db: D1Database, orgId: string, user: { id: string; name: string }): Promise<OrgAccess | null> {
  try {
    return await crmAccess(db, orgId, user);
  } catch {
    return null;
  }
}

/** The Finance contact a registered company bills a CRM company as (its one customer record), if linked. */
async function linkedContact(db: D1Database, a: ErpAccess, crmCompanyId: string, finOrgId: string | null): Promise<string | null> {
  if (a.kind !== 'registered' || !finOrgId) return null;
  const r = await db.prepare('SELECT l.fin_contact_id FROM co_customer_links l JOIN fin_contacts f ON f.id = l.fin_contact_id AND f.org_id = ? WHERE l.company_id = ? AND l.crm_company_id = ?').bind(finOrgId, a.companyId, crmCompanyId).first<{ fin_contact_id: string }>();
  return r?.fin_contact_id ?? null;
}

async function linkedCrmCompany(db: D1Database, a: ErpAccess, finContactId: string): Promise<string | null> {
  if (a.kind !== 'registered') return null;
  const r = await db.prepare('SELECT crm_company_id FROM co_customer_links WHERE company_id = ? AND fin_contact_id = ?').bind(a.companyId, finContactId).first<{ crm_company_id: string }>();
  return r?.crm_company_id ?? null;
}

export interface Customer {
  crmOrgId: string | null;
  crmCompanyId: string | null;
  crmContactId: string | null;
  finOrgId: string | null;
  finContactId: string | null;
  name: string;
  contactName: string;
  address: string;
}

/**
 * Checks a customer choice against the company's CRM and Finance, each with its own permissions, and returns the
 * references to store. A CRM company carries its linked Finance contact (registered companies); a person's own or
 * example company names the Finance contact separately.
 */
export async function resolveCustomer(db: D1Database, a: ErpAccess, user: { id: string; name: string }, input: { crmCompanyId?: string | null; crmContactId?: string | null; finContactId?: string | null }): Promise<Customer> {
  const fin = (await financeOrgsFor(db, a))[0] ?? null;
  const out: Customer = { crmOrgId: null, crmCompanyId: null, crmContactId: null, finOrgId: fin?.id ?? null, finContactId: null, name: '', contactName: '', address: '' };
  if (!input.crmCompanyId && !input.finContactId) throw new HttpError(400, 'Choose the customer');
  if (input.crmCompanyId) {
    const orgs = await crmOrgsFor(db, a);
    if (!orgs.length) throw new HttpError(400, 'This company does not run a CRM: choose a customer from Finance');
    const row = await db.prepare(`SELECT * FROM crm_companies WHERE id = ? AND org_id IN (${orgs.map(() => '?').join(',')}) AND deleted_at IS NULL`).bind(String(input.crmCompanyId).slice(0, 64), ...orgs.map((o) => o.id)).first<any>();
    if (!row) throw new HttpError(400, 'Choose a customer from the company’s CRM');
    const ca = await maybeCrm(db, row.org_id, user);
    if (!ca) throw new HttpError(403, 'You have no access to the company’s CRM, so you cannot choose its customers');
    crmAssertRecord(ca, 'companies', 'view', row, 'Customer');
    out.crmOrgId = row.org_id;
    out.crmCompanyId = row.id;
    out.name = row.name;
    out.address = [row.address, row.city, row.region, row.postcode, row.country].filter((x: string) => x && x.trim()).join(', ');
    if (input.crmContactId) {
      const ct = await db.prepare('SELECT * FROM crm_contacts WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(String(input.crmContactId).slice(0, 64), row.org_id).first<any>();
      if (!ct || (ct.company_id && ct.company_id !== row.id)) throw new HttpError(400, 'Choose a contact of that customer');
      crmAssertRecord(ca, 'contacts', 'view', ct, 'Contact');
      out.crmContactId = ct.id;
      out.contactName = `${ct.first_name} ${ct.last_name}`.trim();
    }
    const linked = await linkedContact(db, a, row.id, fin?.id ?? null);
    if (linked) {
      if (input.finContactId && input.finContactId !== linked) throw new HttpError(400, `${row.name} is billed as another customer in Finance: keep the one customer record`);
      out.finContactId = linked;
    } else if (input.finContactId) {
      if (a.kind === 'registered') throw new HttpError(400, `Link ${row.name} to its Finance customer in the CRM first (the company’s In Finance panel): one customer record`);
      out.finContactId = await checkFinContact(db, a, user, fin?.id ?? null, input.finContactId);
    }
    return out;
  }
  out.finContactId = await checkFinContact(db, a, user, fin?.id ?? null, input.finContactId!);
  const ct = await db.prepare('SELECT name, address FROM fin_contacts WHERE id = ?').bind(out.finContactId).first<{ name: string; address: string }>();
  out.name = ct?.name ?? '';
  out.address = ct?.address ?? '';
  const crmId = await linkedCrmCompany(db, a, out.finContactId);
  if (crmId) {
    const orgs = await crmOrgsFor(db, a);
    const row = orgs.length ? await db.prepare(`SELECT id, org_id FROM crm_companies WHERE id = ? AND org_id IN (${orgs.map(() => '?').join(',')}) AND deleted_at IS NULL`).bind(crmId, ...orgs.map((o) => o.id)).first<any>() : null;
    if (row) {
      out.crmOrgId = row.org_id;
      out.crmCompanyId = row.id;
    }
  }
  return out;
}

async function checkFinContact(db: D1Database, a: ErpAccess, user: { id: string; name: string }, finOrgId: string | null, id: string): Promise<string> {
  if (!finOrgId) throw new HttpError(400, 'This company does not run a Finance business workspace: choose a customer from the CRM');
  const fa = await maybeFin(db, finOrgId, user);
  if (!fa || !finHasPerm(fa, 'contacts', 'view')) throw new HttpError(403, 'You have no access to the company’s Finance customers');
  const ct = await db.prepare("SELECT id FROM fin_contacts WHERE id = ? AND org_id = ? AND kind IN ('customer','both') AND archived_at IS NULL").bind(String(id).slice(0, 64), finOrgId).first<{ id: string }>();
  if (!ct) throw new HttpError(400, 'Choose a customer from the company’s Finance');
  return ct.id;
}

/** The customer's email (the CRM contact's, else the CRM company's, else the Finance contact's), for a dispatch email. */
export async function customerEmail(db: D1Database, so: any): Promise<string> {
  if (so.crm_contact_id) {
    const r = await db.prepare('SELECT email FROM crm_contacts WHERE id = ? AND org_id = ?').bind(so.crm_contact_id, so.crm_org_id).first<{ email: string }>();
    if (r?.email) return r.email;
  }
  if (so.crm_company_id) {
    const r = await db.prepare('SELECT email FROM crm_companies WHERE id = ? AND org_id = ?').bind(so.crm_company_id, so.crm_org_id).first<{ email: string }>();
    if (r?.email) return r.email;
  }
  if (so.fin_contact_id) {
    const r = await db.prepare('SELECT email FROM fin_contacts WHERE id = ? AND org_id = ?').bind(so.fin_contact_id, so.fin_org_id).first<{ email: string }>();
    if (r?.email) return r.email;
  }
  return '';
}

// ------------------------------------------------------------------ tax codes and pricing

interface TaxOption {
  value: string;
  label: string;
  rateBp: number;
}
const BASIC_TAX: TaxOption[] = [
  { value: 'GST', label: 'GST 10%', rateBp: 1000 },
  { value: 'NONE', label: 'No GST', rateBp: 0 },
];

/** The sales tax codes of the company's Finance workspace (else GST or none). */
export async function salesTaxOptions(db: D1Database, finOrgId: string | null): Promise<TaxOption[]> {
  if (!finOrgId) return BASIC_TAX;
  const rows = await db.prepare("SELECT id, code, name, rate_bp FROM fin_tax_codes WHERE org_id = ? AND archived_at IS NULL AND direction IN ('sales','both') ORDER BY code").bind(finOrgId).all<{ id: string; code: string; name: string; rate_bp: number }>();
  return rows.results.length ? rows.results.map((t) => ({ value: t.id, label: `${t.code} ${t.name} (${t.rate_bp / 100}%)`, rateBp: t.rate_bp })) : BASIC_TAX;
}

/**
 * The tax mode an order is priced in: as chosen, except that a Finance workspace not registered for GST records no GST,
 * so its orders carry none (Finance prices the invoice the same way).
 */
export async function taxModeFor(db: D1Database, finOrgId: string | null, mode: 'exclusive' | 'inclusive' | 'none'): Promise<'exclusive' | 'inclusive' | 'none'> {
  if (!finOrgId) return mode;
  const r = await db.prepare('SELECT kind, gst_registered FROM fin_orgs WHERE id = ?').bind(finOrgId).first<{ kind: string; gst_registered: number }>();
  return r && !(r.kind === 'business' && r.gst_registered) ? 'none' : mode;
}

/** A tax code chosen on a line or a freight charge: the workspace's own, else GST or none (named by their usual codes). */
export function pickTax(options: TaxOption[], code: string | undefined, mode: 'exclusive' | 'inclusive' | 'none', where: string) {
  const rates = new Map(options.map((o) => [o.value, o.rateBp]));
  const defaultCode = options.find((o) => o.rateBp === 1000)?.value ?? options[0].value;
  const alias = code === 'GST' && !rates.has('GST') ? defaultCode : code === 'NONE' && !rates.has('NONE') ? options.find((o) => o.rateBp === 0)?.value : code;
  const taxCode = mode === 'none' ? (options.find((o) => o.rateBp === 0)?.value ?? 'NONE') : (alias ?? defaultCode);
  if (!rates.has(taxCode) && !(mode === 'none' && taxCode === 'NONE')) throw new HttpError(400, `${where}: choose a tax code from the list`);
  return { taxCode, rate: mode === 'none' ? 0 : (rates.get(taxCode) ?? 0) };
}

const zLine = z.object({
  id: zId.optional(),
  productId: zId,
  description: zText(1000).optional(),
  quantity: z.number().positive().max(1e9),
  unitPriceCents: z.number().int().min(0).max(1e11).optional(),
  discountBp: z.number().int().min(0).max(10_000).optional(),
  taxCode: zText(64).optional(),
  promisedDate: zDate.optional(),
  fulfil: z.enum(['stock', 'make']).optional(),
});
type LineIn = z.infer<typeof zLine>;

interface PricedLine {
  id: string | null;
  productId: string;
  productNumber: string;
  description: string;
  quantity: number;
  uom: string;
  unitPriceCents: number;
  discountBp: number;
  taxCode: string;
  taxRateBp: number;
  net: number;
  tax: number;
  promisedDate: string | null;
  fulfil: 'stock' | 'make';
}

/** Lines priced as Finance prices them (whole cents, three-decimal quantities, GST split per line). */
async function priceLines(db: D1Database, companyId: string, lines: LineIn[], options: TaxOption[], mode: 'exclusive' | 'inclusive' | 'none'): Promise<{ lines: PricedLine[]; subtotal: number; tax: number; total: number }> {
  if (!lines.length) throw new HttpError(400, 'Add at least one line');
  if (lines.length > 200) throw new HttpError(400, 'At most 200 lines');
  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = new Map<string, any>();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const rows = await db.prepare(`SELECT id, number, name, uom, type, price_cents, archived_at FROM erp_products WHERE company_id = ? AND id IN (${chunk.map(() => '?').join(',')})`).bind(companyId, ...chunk).all<any>();
    for (const r of rows.results) products.set(r.id, r);
  }
  const priced = lines.map((l, i) => {
    const p = products.get(l.productId);
    if (!p) throw new HttpError(400, `Line ${i + 1}: choose a product of this company`);
    if (p.type === 'service') throw new HttpError(400, `Line ${i + 1}: ${p.number} is a service; a sales order ships products`);
    if (p.archived_at && !l.id) throw new HttpError(400, `Line ${i + 1}: ${p.number} is archived`);
    const quantity = Math.round(l.quantity * 1000) / 1000;
    if (quantity <= 0) throw new HttpError(400, `Line ${i + 1}: use a quantity of at least 0.001`);
    const unit = l.unitPriceCents ?? p.price_cents;
    if (unit === null || unit === undefined) throw new HttpError(400, `Line ${i + 1}: ${p.number} has no list price: give the price`);
    const { taxCode, rate } = pickTax(options, l.taxCode, mode, `Line ${i + 1}`);
    const amount = docLineAmount(unit, Math.round(quantity * 1000), l.discountBp ?? 0);
    const s = splitTax(amount, rate, mode);
    return { id: l.id ?? null, productId: p.id, productNumber: p.number, description: (l.description ?? '').trim() || p.name, quantity, uom: p.uom || 'each', unitPriceCents: unit, discountBp: l.discountBp ?? 0, taxCode, taxRateBp: rate, net: s.net, tax: s.tax, promisedDate: l.promisedDate ?? null, fulfil: l.fulfil ?? 'stock' };
  });
  const subtotal = priced.reduce((s, l) => s + l.net, 0);
  const tax = priced.reduce((s, l) => s + l.tax, 0);
  return { lines: priced, subtotal, tax, total: subtotal + tax };
}

// ------------------------------------------------------------------ loading and DTOs

const SO_SELECT = `SELECT o.*, cb.name AS created_name, fb.name AS confirmed_name FROM erp_sales_orders o LEFT JOIN users cb ON cb.id = o.created_by LEFT JOIN users fb ON fb.id = o.confirmed_by`;

export function soDTO(o: any) {
  const today = todayIso();
  const due = o.promised_date ?? o.requested_date;
  const open = (OPEN_SO as readonly string[]).includes(o.status);
  return {
    id: o.id,
    number: o.number,
    revision: o.revision,
    status: o.status,
    statusLabel: label(SO_STATUS, o.status),
    customerName: o.customer_name,
    contactName: o.contact_name,
    crmOrgId: o.crm_org_id,
    crmCompanyId: o.crm_company_id,
    crmContactId: o.crm_contact_id,
    crmDealId: o.crm_deal_id,
    finOrgId: o.fin_org_id,
    finContactId: o.fin_contact_id,
    orderDate: o.order_date,
    requestedDate: o.requested_date,
    promisedDate: o.promised_date,
    deliveryAddress: o.delivery_address,
    shippingTerms: o.shipping_terms,
    customerPo: o.customer_po,
    currency: o.currency,
    taxMode: o.tax_mode,
    notes: o.notes,
    subtotalCents: o.subtotal_cents,
    taxCents: o.tax_cents,
    totalCents: o.total_cents,
    late: open && !!due && due < today,
    confirmedByName: o.confirmed_name ?? null,
    confirmedAt: o.confirmed_at,
    cancelledAt: o.cancelled_at,
    cancelReason: o.cancel_reason,
    closedAt: o.closed_at,
    closeReason: o.close_reason,
    createdByName: o.created_name ?? null,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}

export async function loadSo(db: D1Database, companyId: string, id: string) {
  const o = await db.prepare(`${SO_SELECT} WHERE o.company_id = ? AND o.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!o) throw notFound('Sales order');
  return o;
}

export async function soLines(db: D1Database, companyId: string, soId: string) {
  return (
    await db
      .prepare(
        `SELECT l.*, p.number AS product_number, p.name AS product_name, p.type AS product_type,
                (SELECT COALESCE(SUM(sl.quantity), 0) FROM erp_shipment_lines sl JOIN erp_shipments s ON s.company_id = sl.company_id AND s.id = sl.shipment_id WHERE sl.company_id = l.company_id AND sl.so_line_id = l.id AND s.status IN ('planned','picking','picked','packed')) AS on_shipment
           FROM erp_so_lines l JOIN erp_products p ON p.company_id = l.company_id AND p.id = l.product_id WHERE l.company_id = ? AND l.so_id = ? ORDER BY l.position`,
      )
      .bind(companyId, soId)
      .all<any>()
  ).results;
}

/**
 * The order's status worked out from its lines, shipments and draft invoices, written in the same transaction as the
 * change that moves it: shipped in full (invoiced when every dispatched shipment has its draft invoice), partly
 * shipped, allocated in full, partly allocated, or confirmed. Drafts, cancelled and closed orders keep their status.
 */
export function soStatusStmt(db: D1Database, companyId: string, soId: string, t = now()) {
  return db
    .prepare(
      `UPDATE erp_sales_orders SET status = (
         SELECT CASE
           WHEN SUM(l.quantity - l.shipped_qty) <= 1e-9 THEN
             CASE WHEN NOT EXISTS (SELECT 1 FROM erp_shipments s WHERE s.company_id = ?1 AND s.so_id = ?2 AND s.status IN ('dispatched','delivered')
                    AND NOT EXISTS (SELECT 1 FROM erp_integration_events e WHERE e.company_id = s.company_id AND e.source_type = 'shipment' AND e.source_id = s.id AND e.kind = 'finance.draft_invoice' AND e.status = 'done'))
                  THEN 'invoiced' ELSE 'shipped' END
           WHEN SUM(l.shipped_qty) > 1e-9 THEN 'partially_shipped'
           WHEN SUM(CASE WHEN l.quantity - l.shipped_qty - l.allocated_qty > 1e-9 THEN 1 ELSE 0 END) = 0 THEN 'allocated'
           WHEN SUM(l.allocated_qty) > 1e-9 THEN 'partially_allocated'
           ELSE 'confirmed' END
         FROM erp_so_lines l WHERE l.company_id = ?1 AND l.so_id = ?2), updated_at = ?3
       WHERE company_id = ?1 AND id = ?2 AND status NOT IN ('draft','cancelled','closed')`,
    )
    .bind(companyId, soId, t);
}

/** Open allocations of a line (reservations not yet issued or released), with where they are. */
async function lineAllocations(db: D1Database, companyId: string, lineIds: string[]) {
  if (!lineIds.length) return [];
  return (
    await db
      .prepare(
        `SELECT x.so_line_id, r.id AS reservation_id, r.quantity, r.issued_qty, r.released_qty, r.status, s.location_id, s.lot, s.serial, s.expiry, l.code AS location_code, w.code AS warehouse_code, r.product_id,
                (SELECT COALESCE(SUM(pk.suggested_qty), 0) FROM erp_pick_lines pk JOIN erp_shipments sh ON sh.company_id = pk.company_id AND sh.id = pk.shipment_id WHERE pk.company_id = r.company_id AND pk.reservation_id = r.id AND sh.status IN ('planned','picking','picked','packed')) AS on_shipment
           FROM erp_so_allocations x JOIN erp_reservations r ON r.company_id = x.company_id AND r.id = x.reservation_id JOIN erp_stock s ON s.company_id = r.company_id AND s.id = r.stock_id
           JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
          WHERE x.company_id = ? AND x.so_line_id IN (${lineIds.map(() => '?').join(',')}) AND r.status = 'open'
          ORDER BY COALESCE(s.expiry, '9999-12-31'), r.created_at`,
      )
      .bind(companyId, ...lineIds)
      .all<any>()
  ).results;
}
export { lineAllocations };

// ------------------------------------------------------------------ options and lists

salesRoutes.get('/c/:company/sales-order-options', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const user = c.get('user');
  const q = (c.req.query('q') ?? '').trim();
  const fin = (await financeOrgsFor(db, a))[0] ?? null;
  const fa = fin ? await maybeFin(db, fin.id, user) : null;
  const crmOrgs = await crmOrgsFor(db, a);
  const crm: { orgId: string; name: string; access: boolean; companies: any[] }[] = [];
  for (const o of crmOrgs) {
    const ca = await maybeCrm(db, o.id, user);
    if (!ca || ca.perms.companies.view === 'none') {
      crm.push({ orgId: o.id, name: o.name, access: false, companies: [] });
      continue;
    }
    const scope = crmScopeSql(ca, 'companies', 'co');
    // Contacts follow the person's own rights in the CRM, as companies do (audit L3: a custom role limited to its own
    // contacts saw every contact of a company here).
    const contactScope = crmScopeSql(ca, 'contacts', 'ct');
    const rows = await db
      .prepare(`SELECT co.id, co.name, co.email, co.address, co.city, co.region, co.postcode, co.country FROM crm_companies co WHERE co.org_id = ? AND co.deleted_at IS NULL ${q ? 'AND lower(co.name) LIKE ?' : ''} AND ${scope.sql} ORDER BY co.name COLLATE NOCASE LIMIT 100`)
      .bind(o.id, ...(q ? [likeOf(q)] : []), ...scope.args)
      .all<any>();
    const companies = [];
    for (const r of rows.results) {
      const contacts = (
        await db
          .prepare(`SELECT ct.id, ct.first_name, ct.last_name, ct.email FROM crm_contacts ct WHERE ct.org_id = ? AND ct.company_id = ? AND ct.deleted_at IS NULL AND ${contactScope.sql} ORDER BY ct.first_name LIMIT 20`)
          .bind(o.id, r.id, ...contactScope.args)
          .all<any>()
      ).results;
      companies.push({
        id: r.id,
        name: r.name,
        email: r.email,
        address: [r.address, r.city, r.region, r.postcode, r.country].filter((x: string) => x && x.trim()).join(', '),
        finContactId: await linkedContact(db, a, r.id, fin?.id ?? null),
        contacts: contacts.map((x) => ({ id: x.id, name: `${x.first_name} ${x.last_name}`.trim(), email: x.email })),
      });
    }
    crm.push({ orgId: o.id, name: o.name, access: true, companies });
  }
  const finScope = fa ? finScopeSql(fa, 'contacts', 'fc') : { sql: '0', args: [] };
  const finContacts = fa && finHasPerm(fa, 'contacts', 'view')
    ? (
        await db
          .prepare(`SELECT fc.id, fc.name, fc.email, fc.address FROM fin_contacts fc WHERE fc.org_id = ? AND fc.kind IN ('customer','both') AND fc.archived_at IS NULL ${q ? 'AND lower(fc.name) LIKE ?' : ''} AND ${finScope.sql} ORDER BY fc.name COLLATE NOCASE LIMIT 100`)
          .bind(fin!.id, ...(q ? [likeOf(q)] : []), ...finScope.args)
          .all<any>()
      ).results
    : [];
  const options = await salesTaxOptions(db, fin?.id ?? null);
  const settings = await loadSettings(db, a.companyId);
  const gst = fin ? (await taxModeFor(db, fin.id, 'exclusive')) !== 'none' : null;
  return c.json({
    gstRegistered: gst,
    taxNote: gst === false ? 'The company’s Finance workspace is not registered for GST, so its orders carry no GST.' : null,
    linkKind: a.kind === 'registered' ? 'link' : 'separate',
    note:
      a.kind === 'registered'
        ? 'Customers are the company’s CRM companies and the Finance customers they are billed as (one customer record). Link a CRM company to Finance from its In Finance panel in the CRM.'
        : 'Choose the CRM company and, to invoice it, the Finance customer it is billed as. Neither is copied: the order keeps references.',
    crm,
    finance: fin ? { orgId: fin.id, name: fin.name, access: !!fa && finHasPerm(fa, 'contacts', 'view'), contacts: finContacts.map((x: any) => ({ id: x.id, name: x.name, email: x.email, address: x.address })) } : null,
    taxCodes: options,
    defaultTaxCode: options.find((o) => o.rateBp === 1000)?.value ?? options[0]?.value ?? 'GST',
    currency: settings.currency,
    products: (await db.prepare("SELECT id, number, name, uom, price_cents, type FROM erp_products WHERE company_id = ? AND archived_at IS NULL AND type <> 'service' ORDER BY number COLLATE NOCASE LIMIT 2000").bind(a.companyId).all<any>()).results.map((p) => ({ id: p.id, number: p.number, name: p.name, uom: p.uom, priceCents: p.price_cents })),
  });
});

salesRoutes.get('/c/:company/sales-orders', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['o.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const qp = (k: string) => c.req.query(k)?.trim();
  const status = qp('status');
  if (status === 'open') where.push(`o.status IN (${OPEN_SO.map((s) => `'${s}'`).join(',')})`);
  else if (status && Object.hasOwn(SO_STATUS, status)) {
    where.push('o.status = ?');
    args.push(status);
  }
  if (qp('q')) {
    where.push('o.search LIKE ?');
    args.push(likeOf(qp('q')!));
  }
  if (qp('crmCompanyId')) {
    where.push('o.crm_company_id = ?');
    args.push(qp('crmCompanyId'));
  }
  if (qp('finContactId')) {
    where.push('o.fin_contact_id = ?');
    args.push(qp('finContactId'));
  }
  if (qp('productId')) {
    where.push('EXISTS (SELECT 1 FROM erp_so_lines l WHERE l.company_id = o.company_id AND l.so_id = o.id AND l.product_id = ?)');
    args.push(qp('productId'));
  }
  if (qp('late') === '1') {
    where.push(`o.status IN (${OPEN_SO.map((s) => `'${s}'`).join(',')}) AND COALESCE(o.promised_date, o.requested_date) < ?`);
    args.push(todayIso());
  }
  if (qp('from')) {
    where.push('o.order_date >= ?');
    args.push(qp('from'));
  }
  if (qp('to')) {
    where.push('o.order_date <= ?');
    args.push(qp('to'));
  }
  const sorts: Record<string, string> = { newest: 'o.created_at DESC', number: 'o.number COLLATE NOCASE', customer: 'o.customer_name COLLATE NOCASE', due: "COALESCE(o.promised_date, o.requested_date, '9999')", total: 'o.total_cents DESC' };
  const order = sorts[qp('sort') ?? ''] ?? sorts.newest;
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${SO_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order}, o.rowid DESC LIMIT ? OFFSET ?`).bind(...args, csv ? 20000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(soDTO);
  if (csv) {
    return csvResponse('sales-orders', [
      ['Number', 'Customer', 'Contact', 'Status', 'Order date', 'Requested', 'Promised', 'Customer PO', 'Currency', 'Subtotal', 'Tax', 'Total', 'Late'],
      ...list.map((o) => [o.number, o.customerName, o.contactName, o.statusLabel, o.orderDate, o.requestedDate ?? '', o.promisedDate ?? '', o.customerPo, o.currency, dollars(o.subtotalCents), dollars(o.taxCents), dollars(o.totalCents), o.late ? 'yes' : '']),
    ]);
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_sales_orders o WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ orders: list, total: total?.n ?? 0, limit, offset, statuses: Object.entries(SO_STATUS).map(([value, l]) => ({ value, label: l })), can: { edit: can(a, 'sales.edit'), confirm: can(a, 'sales.confirm') } });
});

// ------------------------------------------------------------------ create and change

const zHeader = {
  crmCompanyId: zId.nullable().optional(),
  crmContactId: zId.nullable().optional(),
  finContactId: zId.nullable().optional(),
  orderDate: zDate.optional(),
  requestedDate: zDate.optional(),
  promisedDate: zDate.optional(),
  deliveryAddress: zText(500).optional(),
  shippingTerms: zText(200).optional(),
  customerPo: zText(100).optional(),
  taxMode: z.enum(['exclusive', 'inclusive', 'none']).optional(),
  notes: zText(4000).optional(),
};
const zCreate = z.object({ ...zHeader, lines: z.array(zLine).min(1).max(200), confirm: z.boolean().optional() });

function lineInsert(db: D1Database, companyId: string, soId: string, l: PricedLine, position: number, id = newId()) {
  return db
    .prepare('INSERT INTO erp_so_lines (id, company_id, so_id, position, product_id, description, quantity, uom, unit_price_cents, discount_bp, tax_code, tax_rate_bp, net_cents, tax_cents, promised_date, fulfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, companyId, soId, position, l.productId, l.description, l.quantity, l.uom, l.unitPriceCents, l.discountBp, l.taxCode, l.taxRateBp, l.net, l.tax, l.promisedDate, l.fulfil);
}

const soSearch = (number: string, customer: Customer | { name: string; contactName: string }, po: string, lines: { productNumber: string; description: string }[]) => searchText(number, customer.name, customer.contactName, po, ...lines.map((l) => `${l.productNumber} ${l.description}`));

/** Makes a draft sales order (also used for an order from a won deal). */
export async function createSo(db: D1Database, a: ErpAccess, user: { id: string; name: string }, input: z.infer<typeof zCreate> & { crmDealId?: string }) {
  const customer = await resolveCustomer(db, a, user, input);
  const options = await salesTaxOptions(db, customer.finOrgId);
  const mode = await taxModeFor(db, customer.finOrgId, input.taxMode ?? 'exclusive');
  const priced = await priceLines(db, a.companyId, input.lines, options, mode);
  const settings = await loadSettings(db, a.companyId);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'sales_order');
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO erp_sales_orders (id, company_id, number, status, crm_org_id, crm_company_id, crm_contact_id, crm_deal_id, fin_org_id, fin_contact_id, customer_name, contact_name, order_date, requested_date, promised_date, delivery_address, shipping_terms, customer_po, currency, tax_mode, notes, subtotal_cents, tax_cents, total_cents, search, created_by, created_at, updated_at)
         VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id, a.companyId, number, customer.crmOrgId, customer.crmCompanyId, customer.crmContactId, input.crmDealId ?? null, customer.finOrgId, customer.finContactId, customer.name.slice(0, 300), customer.contactName.slice(0, 200),
        input.orderDate ?? todayIso(), input.requestedDate ?? null, input.promisedDate ?? null, (input.deliveryAddress ?? '').trim() || customer.address, input.shippingTerms ?? '', input.customerPo ?? '', settings.currency, mode, input.notes ?? '',
        priced.subtotal, priced.tax, priced.total, soSearch(number, customer, input.customerPo ?? '', priced.lines), a.userId, t, t,
      ),
    ...priced.lines.map((l, i) => lineInsert(db, a.companyId, id, l, i + 1)),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.created', entityType: 'sales_order', entityId: id, summary: `${number} drafted for ${customer.name}: ${priced.lines.length} line${priced.lines.length === 1 ? '' : 's'}, ${(priced.total / 100).toFixed(2)} ${settings.currency}${input.crmDealId ? ' (from a won deal in the CRM)' : ''}`, after: { customer: customer.name, total: priced.total }, at: t }),
  ];
  try {
    await db.batch(stmts);
  } catch (e) {
    if (/UNIQUE constraint failed: erp_sales_orders\.company_id, erp_sales_orders\.crm_deal_id|erp_sales_orders_deal/i.test(String((e as Error)?.message))) throw new HttpError(409, 'This deal already has a sales order');
    throw e;
  }
  return { id, number };
}

salesRoutes.post('/c/:company/sales-orders', async (c) => {
  const a = await requireErp(c, 'sales.edit');
  const db = c.env.DB;
  const input = await body(c, zCreate);
  if (input.confirm) assertCan(a, 'sales.confirm');
  const made = await createSo(db, a, c.get('user'), input);
  if (input.confirm) await confirmSo(db, a, made.id);
  return c.json(made, 201);
});

/** A won CRM deal to a draft sales order for its customer: lines from the deal's items whose product's SKU is an ERP product's. */
salesRoutes.post('/c/:company/sales-orders/from-deal', async (c) => {
  const a = await requireErp(c, 'sales.edit');
  const db = c.env.DB;
  const user = c.get('user');
  const input = await body(c, z.object({ crmDealId: zId }));
  const orgs = await crmOrgsFor(db, a);
  if (!orgs.length) throw new HttpError(400, 'This company does not run a CRM');
  const deal = await db.prepare(`SELECT * FROM crm_deals WHERE id = ? AND org_id IN (${orgs.map(() => '?').join(',')}) AND deleted_at IS NULL`).bind(input.crmDealId, ...orgs.map((o) => o.id)).first<any>();
  if (!deal) throw notFound('Deal');
  const ca = await maybeCrm(db, deal.org_id, user);
  if (!ca) throw new HttpError(403, 'You have no access to the company’s CRM');
  crmAssertRecord(ca, 'deals', 'view', deal, 'Deal');
  if (deal.status !== 'won') throw new HttpError(400, 'Only a won deal becomes a sales order');
  if (!deal.company_id) throw new HttpError(400, 'Give the deal a company first: the order is made out to it');
  const existing = await db.prepare("SELECT id, number FROM erp_sales_orders WHERE company_id = ? AND crm_deal_id = ? AND status <> 'cancelled'").bind(a.companyId, deal.id).first<{ id: string; number: string }>();
  if (existing) return c.json({ ...existing, existing: true });
  const settings = await loadSettings(db, a.companyId);
  if (deal.currency && deal.currency !== settings.currency) throw new HttpError(400, `The deal is in ${deal.currency} and the ERP keeps ${settings.currency}: make the order by hand`);
  const items = (await db.prepare('SELECT i.name, i.quantity_milli, i.unit_price, i.discount_bp, p.sku FROM crm_deal_items i LEFT JOIN crm_products p ON p.org_id = i.org_id AND p.id = i.product_id WHERE i.org_id = ? AND i.deal_id = ? ORDER BY i.position, i.created_at').bind(deal.org_id, deal.id).all<any>()).results;
  const lines: LineIn[] = [];
  const unmatched: string[] = [];
  for (const it of items) {
    const p = it.sku ? await db.prepare("SELECT id FROM erp_products WHERE company_id = ? AND sku = ? AND archived_at IS NULL AND type <> 'service'").bind(a.companyId, it.sku).first<{ id: string }>() : null;
    if (p) lines.push({ productId: p.id, description: it.name, quantity: it.quantity_milli / 1000, unitPriceCents: it.unit_price, discountBp: it.discount_bp });
    else unmatched.push(it.name);
  }
  if (!lines.length) {
    throw new HttpError(400, items.length ? 'None of the deal’s items is an ERP product (matched by SKU). Make the order by hand and choose the products.' : 'The deal has no items. Make the order by hand and choose the products.', { unmatched });
  }
  const made = await createSo(db, a, user, {
    crmCompanyId: deal.company_id,
    lines,
    notes: unmatched.length ? `From the won deal "${deal.title}". Items not matched to an ERP product: ${unmatched.join(', ')}.` : `From the won deal "${deal.title}".`,
    customerPo: '',
    crmDealId: deal.id,
  });
  return c.json({ ...made, unmatched }, 201);
});

salesRoutes.put('/c/:company/sales-orders/:id', async (c) => {
  const a = await requireErp(c, 'sales.edit');
  const db = c.env.DB;
  const o = await loadSo(db, a.companyId, c.req.param('id'));
  if (o.status !== 'draft') badState('Only a draft order is changed here: amend a confirmed order with a reason');
  const input = await body(c, z.object({ ...zHeader, lines: z.array(zLine).min(1).max(200) }));
  const customer =
    input.crmCompanyId !== undefined || input.finContactId !== undefined
      ? await resolveCustomer(db, a, c.get('user'), { crmCompanyId: input.crmCompanyId ?? null, crmContactId: input.crmContactId ?? null, finContactId: input.finContactId ?? null })
      : { crmOrgId: o.crm_org_id, crmCompanyId: o.crm_company_id, crmContactId: o.crm_contact_id, finOrgId: o.fin_org_id, finContactId: o.fin_contact_id, name: o.customer_name, contactName: o.contact_name, address: o.delivery_address };
  const mode = await taxModeFor(db, customer.finOrgId, input.taxMode ?? o.tax_mode);
  const priced = await priceLines(db, a.companyId, input.lines, await salesTaxOptions(db, customer.finOrgId), mode);
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM erp_so_lines WHERE company_id = ? AND so_id = ?').bind(a.companyId, o.id),
    ...priced.lines.map((l, i) => lineInsert(db, a.companyId, o.id, l, i + 1)),
    db
      .prepare(
        `UPDATE erp_sales_orders SET crm_org_id = ?, crm_company_id = ?, crm_contact_id = ?, fin_org_id = ?, fin_contact_id = ?, customer_name = ?, contact_name = ?, order_date = ?, requested_date = ?, promised_date = ?, delivery_address = ?, shipping_terms = ?, customer_po = ?, tax_mode = ?, notes = ?,
                subtotal_cents = ?, tax_cents = ?, total_cents = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'`,
      )
      .bind(
        customer.crmOrgId, customer.crmCompanyId, customer.crmContactId, customer.finOrgId, customer.finContactId, customer.name.slice(0, 300), customer.contactName.slice(0, 200), input.orderDate ?? o.order_date,
        input.requestedDate !== undefined ? input.requestedDate : o.requested_date, input.promisedDate !== undefined ? input.promisedDate : o.promised_date, input.deliveryAddress ?? o.delivery_address, input.shippingTerms ?? o.shipping_terms, input.customerPo ?? o.customer_po, mode, input.notes ?? o.notes,
        priced.subtotal, priced.tax, priced.total, soSearch(o.number, customer, input.customerPo ?? o.customer_po, priced.lines), t, a.companyId, o.id,
      ),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.changed', entityType: 'sales_order', entityId: o.id, summary: `${o.number} changed: ${(priced.total / 100).toFixed(2)} ${o.currency}`, before: { total: o.total_cents }, after: { total: priced.total }, at: t }),
  ]);
  return c.json({ id: o.id });
});

async function confirmSo(db: D1Database, a: ErpAccess, id: string) {
  const o = await loadSo(db, a.companyId, id);
  if (o.status !== 'draft') badState(`${o.number} is ${label(SO_STATUS, o.status).toLowerCase()}`);
  const t = now();
  const r = await db.batch([
    db.prepare("UPDATE erp_sales_orders SET status = 'confirmed', confirmed_by = ?, confirmed_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'").bind(a.userId, t, t, a.companyId, o.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.confirmed', entityType: 'sales_order', entityId: o.id, summary: `${o.number} confirmed for ${o.customer_name}`, at: t }),
  ]);
  if (!r[0].meta.changes) badState('This order was confirmed or changed at the same moment: refresh');
}

/** Statements that release a line's open allocations (the reservations go back to available stock). */
async function releaseStmts(ops: StockOps, db: D1Database, companyId: string, lineIds: string[], reason: string, t: number) {
  const allocs = await lineAllocations(db, companyId, lineIds);
  const stmts: D1PreparedStatement[] = [];
  for (const r of allocs) {
    const open = q6(r.quantity - r.issued_qty - r.released_qty);
    if (open <= 1e-9) continue;
    if (Number(r.on_shipment) > 1e-9) badState(`Some of this stock is on a shipment that is not dispatched: cancel the shipment first`);
    ops.reserve({ productId: r.product_id, locationId: r.location_id, lot: r.lot, serial: r.serial }, -open, { source: 'sales_order', sourceId: r.so_line_id, reference: reason });
    stmts.push(
      db.prepare("UPDATE erp_reservations SET released_qty = round(released_qty + ?, 6), status = 'released', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'").bind(open, t, companyId, r.reservation_id),
      db.prepare('UPDATE erp_so_lines SET allocated_qty = round(allocated_qty - ?, 6) WHERE company_id = ? AND id = ?').bind(open, companyId, r.so_line_id),
    );
  }
  return stmts;
}

salesRoutes.post('/c/:company/sales-orders/:id/:action{confirm|cancel|close|amend}', async (c) => {
  const a = await requireErp(c, 'sales.confirm');
  const db = c.env.DB;
  const action = c.req.param('action');
  const o = await loadSo(db, a.companyId, c.req.param('id'));
  const t = now();
  if (action === 'confirm') {
    await confirmSo(db, a, o.id);
    return c.json({ ok: true });
  }
  if (action === 'cancel' || action === 'close') {
    const input = await lenient(c, z.object({ reason: zText(500).optional() }));
    if (['cancelled', 'closed'].includes(o.status)) badState(`${o.number} is already ${o.status}`);
    const lines = await soLines(db, a.companyId, o.id);
    if (action === 'cancel' && lines.some((l) => l.shipped_qty > 1e-9)) badState('Goods were shipped on this order: close it instead of cancelling it');
    if (action === 'close' && !input.reason && lines.some((l) => l.quantity - l.shipped_qty > 1e-9)) throw new HttpError(400, 'Say why the order is closed before everything is shipped');
    const open = await db.prepare("SELECT COUNT(*) AS n FROM erp_shipments WHERE company_id = ? AND so_id = ? AND status IN ('planned','picking','picked','packed')").bind(a.companyId, o.id).first<{ n: number }>();
    if (open?.n) badState('A shipment of this order is not dispatched yet: cancel or dispatch it first');
    const mos = await db.prepare("SELECT mo.number FROM erp_so_mo_links k JOIN erp_so_lines l ON l.company_id = k.company_id AND l.id = k.so_line_id JOIN erp_mfg_orders mo ON mo.company_id = k.company_id AND mo.id = k.mo_id WHERE k.company_id = ? AND l.so_id = ? AND mo.status IN ('draft','released','in_progress')").bind(a.companyId, o.id).all<{ number: string }>();
    const settings = await loadSettings(db, a.companyId);
    const ops = new StockOps(db, a, settings, t);
    const release = await releaseStmts(ops, db, a.companyId, lines.map((l) => l.id), `${o.number} ${action === 'cancel' ? 'cancelled' : 'closed'}`, t);
    const status = action === 'cancel' ? 'cancelled' : 'closed';
    const upd =
      action === 'cancel'
        ? db.prepare("UPDATE erp_sales_orders SET status = 'cancelled', cancelled_by = ?, cancelled_at = ?, cancel_reason = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status NOT IN ('cancelled','closed')").bind(a.userId, t, input.reason ?? '', t, a.companyId, o.id)
        : db.prepare("UPDATE erp_sales_orders SET status = 'closed', closed_by = ?, closed_at = ?, close_reason = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status NOT IN ('cancelled','closed')").bind(a.userId, t, input.reason ?? '', t, a.companyId, o.id);
    const ev = eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `so.${status}`, entityType: 'sales_order', entityId: o.id, summary: `${o.number} ${status}${input.reason ? `: ${input.reason}` : ''}${mos.results.length ? ` (manufacturing orders still open: ${mos.results.map((m) => m.number).join(', ')})` : ''}`, at: t });
    await runStock(db, ops.all([upd], [...release, ev], { type: 'sales_order', id: o.id }));
    return c.json({ ok: true, openManufacturingOrders: mos.results.map((m) => m.number) });
  }
  // amend: a confirmed order's header and lines, with a reason; the version before is kept
  if (['draft', 'cancelled', 'closed'].includes(o.status)) badState(o.status === 'draft' ? 'Change a draft directly; amend a confirmed order' : `${o.number} is ${o.status}`);
  const input = await body(c, z.object({ ...zHeader, lines: z.array(zLine).min(1).max(200), reason: zText(500).min(1, 'Say why the order changes') }));
  if (input.crmCompanyId !== undefined && input.crmCompanyId !== o.crm_company_id) throw new HttpError(400, 'The customer of a confirmed order cannot change: cancel it and make a new one');
  const current = await soLines(db, a.companyId, o.id);
  const byId = new Map(current.map((l) => [l.id, l]));
  for (const l of input.lines) if (l.id && !byId.has(l.id)) throw new HttpError(400, 'A line of another order was sent');
  const kept = new Set(input.lines.filter((l) => l.id).map((l) => l.id!));
  const linked = new Set((await db.prepare('SELECT DISTINCT so_line_id FROM erp_so_mo_links WHERE company_id = ?').bind(a.companyId).all<{ so_line_id: string }>()).results.map((r) => r.so_line_id));
  for (const l of current) {
    if (kept.has(l.id)) continue;
    if (l.shipped_qty > 1e-9 || l.allocated_qty > 1e-9 || linked.has(l.id) || Number(l.on_shipment) > 1e-9) throw new HttpError(400, `Line ${l.position} (${l.product_number}) has stock allocated, shipped or a manufacturing order: it cannot be removed`);
  }
  const mode = await taxModeFor(db, o.fin_org_id, input.taxMode ?? o.tax_mode);
  const priced = await priceLines(db, a.companyId, input.lines, await salesTaxOptions(db, o.fin_org_id), mode);
  for (const p of priced.lines) {
    if (!p.id) continue;
    const was = byId.get(p.id)!;
    if (p.productId !== was.product_id && (was.shipped_qty > 1e-9 || was.allocated_qty > 1e-9 || linked.has(was.id))) throw new HttpError(400, `Line ${was.position}: the product cannot change once stock is allocated, shipped or made for it`);
    if (p.quantity < q6(was.shipped_qty + was.allocated_qty) - 1e-9) throw new HttpError(400, `Line ${was.position}: the quantity cannot go below what is allocated and shipped (${q6(was.shipped_qty + was.allocated_qty)})`);
  }
  const snapshot = { header: soDTO(o), lines: current.map((l) => ({ id: l.id, position: l.position, product: l.product_number, description: l.description, quantity: l.quantity, unitPriceCents: l.unit_price_cents, discountBp: l.discount_bp, taxCode: l.tax_code, netCents: l.net_cents, taxCents: l.tax_cents, promisedDate: l.promised_date })) };
  const stmts: D1PreparedStatement[] = [
    db.prepare('INSERT INTO erp_so_revisions (id, company_id, so_id, revision, snapshot_json, reason, changed_by, changed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, o.id, o.revision, JSON.stringify(snapshot).slice(0, 200_000), input.reason, a.userId, t),
  ];
  for (const l of current) if (!kept.has(l.id)) stmts.push(db.prepare('DELETE FROM erp_so_lines WHERE company_id = ? AND id = ? AND allocated_qty = 0 AND shipped_qty = 0').bind(a.companyId, l.id));
  priced.lines.forEach((p, i) => {
    if (p.id)
      stmts.push(
        db
          .prepare('UPDATE erp_so_lines SET position = ?, product_id = ?, description = ?, quantity = ?, uom = ?, unit_price_cents = ?, discount_bp = ?, tax_code = ?, tax_rate_bp = ?, net_cents = ?, tax_cents = ?, promised_date = ?, fulfil = ? WHERE company_id = ? AND id = ?')
          .bind(i + 1, p.productId, p.description, p.quantity, p.uom, p.unitPriceCents, p.discountBp, p.taxCode, p.taxRateBp, p.net, p.tax, p.promisedDate, p.fulfil, a.companyId, p.id),
      );
    else stmts.push(lineInsert(db, a.companyId, o.id, p, i + 1));
  });
  stmts.push(
    db
      .prepare('UPDATE erp_sales_orders SET revision = revision + 1, requested_date = ?, promised_date = ?, delivery_address = ?, shipping_terms = ?, customer_po = ?, tax_mode = ?, notes = ?, subtotal_cents = ?, tax_cents = ?, total_cents = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND revision = ?')
      .bind(input.requestedDate !== undefined ? input.requestedDate : o.requested_date, input.promisedDate !== undefined ? input.promisedDate : o.promised_date, input.deliveryAddress ?? o.delivery_address, input.shippingTerms ?? o.shipping_terms, input.customerPo ?? o.customer_po, mode, input.notes ?? o.notes, priced.subtotal, priced.tax, priced.total, soSearch(o.number, { name: o.customer_name, contactName: o.contact_name }, input.customerPo ?? o.customer_po, priced.lines), t, a.companyId, o.id, o.revision),
    soStatusStmt(db, a.companyId, o.id, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.amended', entityType: 'sales_order', entityId: o.id, summary: `${o.number} amended to revision ${o.revision + 1}: ${input.reason}`, before: { revision: o.revision, total: o.total_cents }, after: { revision: o.revision + 1, total: priced.total }, at: t }),
  );
  try {
    await db.batch(stmts);
  } catch (e) {
    if (/CHECK constraint failed/i.test(String((e as Error)?.message))) throw new HttpError(409, 'Stock was allocated or shipped on this order at the same moment: refresh and try again');
    throw e;
  }
  return c.json({ ok: true, revision: o.revision + 1 });
});

// ------------------------------------------------------------------ allocation

/** Stock that can be allocated to a product: available outside quarantine, soonest expiry first, then the oldest. */
async function allocatable(db: D1Database, companyId: string, productId: string) {
  return (
    await db
      .prepare(
        `SELECT s.*, l.code AS location_code, l.kind, w.code AS warehouse_code,
                (SELECT MIN(m.created_at) FROM erp_stock_moves m WHERE m.company_id = s.company_id AND m.product_id = s.product_id AND m.location_id = s.location_id AND m.lot = s.lot AND m.serial = s.serial AND m.on_hand_delta > 0) AS first_in
           FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
          WHERE s.company_id = ? AND s.product_id = ? AND l.kind <> 'quarantine' AND l.archived_at IS NULL AND s.on_hand - s.reserved > 1e-9
          ORDER BY COALESCE(s.expiry, '9999-12-31'), first_in, s.rowid`,
      )
      .bind(companyId, productId)
      .all<any>()
  ).results;
}

salesRoutes.post('/c/:company/sales-orders/:id/allocate', async (c) => {
  const a = await requireErp(c, 'sales.allocate');
  const db = c.env.DB;
  const o = await loadSo(db, a.companyId, c.req.param('id'));
  if (!(OPEN_SO as readonly string[]).includes(o.status)) badState(o.status === 'draft' ? 'Confirm the order before allocating stock' : `${o.number} is ${label(SO_STATUS, o.status).toLowerCase()}`);
  const input = await lenient(c, z.object({ lines: z.array(z.object({ lineId: zId, quantity: z.number().positive().max(1e9).optional() })).max(200).optional(), requestKey: zKey }));
  const lines = await soLines(db, a.companyId, o.id);
  const chosen = input.lines?.length ? input.lines.map((x) => ({ line: lines.find((l) => l.id === x.lineId), quantity: x.quantity })) : lines.map((l) => ({ line: l, quantity: undefined as number | undefined }));
  const settings = await loadSettings(db, a.companyId);
  const t = now();
  const ops = new StockOps(db, a, settings, t);
  const after: D1PreparedStatement[] = [];
  const result: { lineId: string; productNumber: string; allocated: number; short: number }[] = [];
  for (const { line, quantity } of chosen) {
    if (!line) throw new HttpError(400, 'A line of another order was sent');
    const need = q6(line.quantity - line.shipped_qty - line.allocated_qty);
    let want = quantity === undefined ? need : Math.min(q6(quantity), need);
    if (quantity !== undefined && quantity > need + 1e-9) throw new HttpError(400, `Line ${line.position}: at most ${need} is still to allocate`);
    if (want <= 1e-9) continue;
    let got = 0;
    for (const s of await allocatable(db, a.companyId, line.product_id)) {
      if (want <= 1e-9) break;
      const take = q6(Math.min(want, s.on_hand - s.reserved));
      if (take <= 1e-9) continue;
      const resId = newId();
      const key: StockKey = { productId: s.product_id, locationId: s.location_id, lot: s.lot, serial: s.serial };
      ops.reserve(key, take, { source: 'sales_order', sourceId: o.id, reference: `${o.number} line ${line.position}` });
      after.push(
        db.prepare('INSERT INTO erp_reservations (id, company_id, stock_id, product_id, quantity, reference, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(resId, a.companyId, s.id, s.product_id, take, `${o.number} line ${line.position} (${o.customer_name})`.slice(0, 200), a.userId, t, t),
        db.prepare('INSERT INTO erp_so_allocations (company_id, so_line_id, reservation_id, created_at) VALUES (?, ?, ?, ?)').bind(a.companyId, line.id, resId, t),
      );
      want = q6(want - take);
      got = q6(got + take);
    }
    if (got > 0) after.push(db.prepare('UPDATE erp_so_lines SET allocated_qty = round(allocated_qty + ?, 6) WHERE company_id = ? AND id = ?').bind(got, a.companyId, line.id));
    result.push({ lineId: line.id, productNumber: line.product_number, allocated: got, short: want });
  }
  if (!result.some((r) => r.allocated > 0)) {
    return c.json({ allocated: result, note: result.length ? 'No stock is available to allocate: it is all reserved, in quarantine or not in stock.' : 'Everything on this order is allocated or shipped.' });
  }
  after.push(
    soStatusStmt(db, a.companyId, o.id, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.allocated', entityType: 'sales_order', entityId: o.id, summary: `${o.number}: allocated ${result.filter((r) => r.allocated > 0).map((r) => `${r.allocated} of ${r.productNumber}`).join(', ')}${result.some((r) => r.short > 0) ? `; short ${result.filter((r) => r.short > 0).map((r) => `${r.short} of ${r.productNumber}`).join(', ')}` : ''}`, at: t }),
  );
  const before = input.requestKey ? [onceStmt(db, a.companyId, `so-allocate:${input.requestKey}`, t)] : [];
  try {
    await db.batch([...before, ...ops.stmts, ...after]);
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (/UNIQUE constraint failed: erp_done/i.test(msg)) return c.json({ allocated: [], existing: true });
    if (/CHECK constraint failed/i.test(msg)) throw new HttpError(409, 'The stock or the order changed at the same moment (someone else allocated it). Refresh and try again.');
    throw e;
  }
  return c.json({ allocated: result }, 201);
});

salesRoutes.post('/c/:company/sales-orders/:id/deallocate', async (c) => {
  const a = await requireErp(c, 'sales.allocate');
  const db = c.env.DB;
  const o = await loadSo(db, a.companyId, c.req.param('id'));
  const input = await lenient(c, z.object({ lineId: zId.optional() }));
  const lines = await soLines(db, a.companyId, o.id);
  const ids = input.lineId ? lines.filter((l) => l.id === input.lineId).map((l) => l.id) : lines.map((l) => l.id);
  if (!ids.length) throw notFound('Line');
  const settings = await loadSettings(db, a.companyId);
  const t = now();
  const ops = new StockOps(db, a, settings, t);
  const release = await releaseStmts(ops, db, a.companyId, ids, `${o.number} allocation released`, t);
  if (!release.length) return c.json({ ok: true, released: 0 });
  await runStock(db, [...ops.stmts, ...release, soStatusStmt(db, a.companyId, o.id, t), eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.deallocated', entityType: 'sales_order', entityId: o.id, summary: `${o.number}: allocation released${input.lineId ? ` on line ${lines.find((l) => l.id === input.lineId)?.position}` : ''}`, at: t })]);
  return c.json({ ok: true, released: release.length / 2 });
});

// ------------------------------------------------------------------ make to order

salesRoutes.post('/c/:company/sales-orders/:id/lines/:lineId/make', async (c) => {
  const a = await requireErp(c, 'production.plan');
  const db = c.env.DB;
  const o = await loadSo(db, a.companyId, c.req.param('id'));
  if (!(OPEN_SO as readonly string[]).includes(o.status)) badState(o.status === 'draft' ? 'Confirm the order before making to order' : `${o.number} is ${label(SO_STATUS, o.status).toLowerCase()}`);
  const line = (await soLines(db, a.companyId, o.id)).find((l) => l.id === c.req.param('lineId'));
  if (!line) throw notFound('Line');
  const input = await lenient(c, z.object({ quantity: z.number().positive().max(1e9).optional(), requiredDate: zDate.optional(), startDate: zDate.optional(), requestKey: zKey }));
  const made = await db.prepare("SELECT COALESCE(SUM(k.quantity), 0) AS q FROM erp_so_mo_links k JOIN erp_mfg_orders mo ON mo.company_id = k.company_id AND mo.id = k.mo_id WHERE k.company_id = ? AND k.so_line_id = ? AND mo.status <> 'cancelled'").bind(a.companyId, line.id).first<{ q: number }>();
  const open = q6(line.quantity - line.shipped_qty - line.allocated_qty - Number(made?.q ?? 0));
  if (open <= 1e-9) badState(`Line ${line.position} is already allocated, shipped or being made in full`);
  const qty = q6(input.quantity ?? open);
  if (qty > open + 1e-9) throw new HttpError(400, `At most ${open} is still to make for line ${line.position}`);
  const t = now();
  const requiredDate = input.requiredDate ?? line.promised_date ?? o.promised_date ?? o.requested_date ?? undefined;
  const mo = await createMo(
    db,
    a,
    { productId: line.product_id, quantity: qty, requiredDate: requiredDate ?? undefined, startDate: input.startDate ?? undefined, method: 'make_to_order', customerRef: `${o.number} ${o.customer_name}`.slice(0, 200), notes: `Made to order for ${o.number} line ${line.position} (${o.customer_name}).` },
    {
      reason: `made to order for ${o.number} line ${line.position}`,
      after: (moId) => [
        ...(input.requestKey ? [onceStmt(db, a.companyId, `so-make:${input.requestKey}`, t)] : []),
        db.prepare('INSERT INTO erp_so_mo_links (company_id, so_line_id, mo_id, quantity, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(a.companyId, line.id, moId, qty, a.userId, t),
        db.prepare("UPDATE erp_so_lines SET fulfil = 'make' WHERE company_id = ? AND id = ?").bind(a.companyId, line.id),
        eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'so.made_to_order', entityType: 'sales_order', entityId: o.id, productId: line.product_id, summary: `${o.number} line ${line.position}: manufacturing order for ${qty} ${line.uom} of ${line.product_number}`, after: { mo: moId, quantity: qty }, at: t }),
      ],
    },
  ).catch((e) => {
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) throw new HttpError(409, 'This was already done: refresh to see the manufacturing order');
    throw e;
  });
  return c.json(mo, 201);
});

// ------------------------------------------------------------------ one order

salesRoutes.get('/c/:company/sales-orders/:id', async (c) => {
  const a = await requireErp(c, 'sales.view');
  const db = c.env.DB;
  const o = await loadSo(db, a.companyId, c.req.param('id'));
  const lines = await soLines(db, a.companyId, o.id);
  const allocs = await lineAllocations(db, a.companyId, lines.map((l) => l.id));
  const stock = await availableByProduct(db, a.companyId, lines.map((l) => l.product_id));
  const mos = (
    await db
      .prepare(`SELECT k.so_line_id, k.quantity AS link_qty, mo.id, mo.number, mo.status, mo.quantity, mo.completed_qty, mo.required_date, mo.finish_date FROM erp_so_mo_links k JOIN erp_mfg_orders mo ON mo.company_id = k.company_id AND mo.id = k.mo_id JOIN erp_so_lines l ON l.company_id = k.company_id AND l.id = k.so_line_id WHERE k.company_id = ? AND l.so_id = ? ORDER BY mo.number`)
      .bind(a.companyId, o.id)
      .all<any>()
  ).results;
  const shipments = (await db.prepare('SELECT s.*, ca.name AS carrier_name FROM erp_shipments s LEFT JOIN erp_carriers ca ON ca.company_id = s.company_id AND ca.id = s.carrier_id WHERE s.company_id = ? AND s.so_id = ? ORDER BY s.created_at').bind(a.companyId, o.id).all<any>()).results;
  const invoices = shipments.length
    ? (await db.prepare(`SELECT source_id, status, target_ref, target_org_id, last_error FROM erp_integration_events WHERE company_id = ? AND kind = 'finance.draft_invoice' AND source_type = 'shipment' AND source_id IN (${shipments.map(() => '?').join(',')})`).bind(a.companyId, ...shipments.map((s) => s.id)).all<any>()).results
    : [];
  const rmas = (await db.prepare('SELECT id, number, status, reason, created_at FROM erp_rmas WHERE company_id = ? AND so_id = ? ORDER BY created_at').bind(a.companyId, o.id).all<any>()).results;
  const revisions = (await db.prepare('SELECT r.*, u.name AS by_name FROM erp_so_revisions r LEFT JOIN users u ON u.id = r.changed_by WHERE r.company_id = ? AND r.so_id = ? ORDER BY r.revision DESC').bind(a.companyId, o.id).all<any>()).results;
  const open = (OPEN_SO as readonly string[]).includes(o.status);
  const finLinked = !!o.fin_contact_id || (!!o.crm_company_id && !!(await linkedContact(db, a, o.crm_company_id, o.fin_org_id)));
  return c.json({
    order: soDTO(o),
    lines: lines.map((l) => {
      const st = stock.get(l.product_id);
      const toShip = q6(l.quantity - l.shipped_qty);
      const making = mos.filter((m) => m.so_line_id === l.id && m.status !== 'cancelled').reduce((s, m) => s + Number(m.link_qty), 0);
      return {
        id: l.id,
        position: l.position,
        productId: l.product_id,
        productNumber: l.product_number,
        productName: l.product_name,
        description: l.description,
        quantity: q6(l.quantity),
        uom: l.uom,
        unitPriceCents: l.unit_price_cents,
        discountBp: l.discount_bp,
        taxCode: l.tax_code,
        taxRateBp: l.tax_rate_bp,
        netCents: l.net_cents,
        taxCents: l.tax_cents,
        promisedDate: l.promised_date,
        fulfil: l.fulfil,
        fulfilLabel: label(FULFIL, l.fulfil),
        allocatedQty: q6(l.allocated_qty),
        shippedQty: q6(l.shipped_qty),
        returnedQty: q6(l.returned_qty),
        onShipmentQty: q6(Number(l.on_shipment)),
        toAllocateQty: Math.max(0, q6(toShip - l.allocated_qty)),
        makingQty: q6(making),
        availableQty: st?.available ?? 0,
        shortQty: open ? Math.max(0, q6(toShip - l.allocated_qty - making - (st?.available ?? 0))) : 0,
        allocations: allocs
          .filter((x) => x.so_line_id === l.id)
          .map((x) => ({ reservationId: x.reservation_id, location: `${x.warehouse_code}/${x.location_code}`, lot: x.lot, serial: x.serial, expiry: x.expiry, quantity: q6(x.quantity - x.issued_qty - x.released_qty), onShipment: q6(Number(x.on_shipment)) })),
        manufacturingOrders: mos.filter((m) => m.so_line_id === l.id).map((m) => ({ id: m.id, number: m.number, status: m.status, statusLabel: label({ draft: 'Draft', released: 'Released', in_progress: 'In progress', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' }, m.status), quantity: q6(m.link_qty), completedQty: q6(m.completed_qty), requiredDate: m.required_date, finishDate: m.finish_date })),
      };
    }),
    shipments: shipments.map((s) => {
      const inv = invoices.find((x) => x.source_id === s.id);
      return { id: s.id, number: s.number, status: s.status, carrierName: s.carrier_name ?? null, trackingNumber: s.tracking_number, plannedDate: s.planned_date, dispatchedAt: s.dispatched_at, deliveredAt: s.delivered_at, invoice: inv ? { status: inv.status, invoiceId: inv.status === 'done' ? inv.target_ref : null } : null };
    }),
    returns: rmas.map((r) => ({ id: r.id, number: r.number, status: r.status, reason: r.reason, createdAt: r.created_at })),
    revisions: revisions.map((r) => ({ revision: r.revision, reason: r.reason, byName: r.by_name ?? null, changedAt: r.changed_at, snapshot: parseJson<Record<string, unknown>>(r.snapshot_json, {}) })),
    files: await recordFiles(db, a.companyId, 'sales_order', o.id),
    history: await historyOf(db, a.companyId, { entityType: 'sales_order', entityId: o.id }),
    finance: {
      linked: finLinked,
      note: finLinked
        ? null
        : o.crm_company_id && a.kind === 'registered'
          ? `To invoice, link ${o.customer_name} to its Finance customer: open the company in the CRM, In Finance.`
          : 'To invoice, the order needs the Finance customer it is billed as.',
    },
    can: {
      edit: can(a, 'sales.edit') && o.status === 'draft',
      confirm: can(a, 'sales.confirm') && o.status === 'draft',
      amend: can(a, 'sales.confirm') && !['draft', 'cancelled', 'closed'].includes(o.status),
      cancel: can(a, 'sales.confirm') && !['cancelled', 'closed'].includes(o.status) && !lines.some((l) => l.shipped_qty > 1e-9),
      close: can(a, 'sales.confirm') && !['draft', 'cancelled', 'closed'].includes(o.status),
      allocate: can(a, 'sales.allocate') && open,
      make: can(a, 'production.plan') && open,
      ship: can(a, 'shipping.plan') && open,
      returns: can(a, 'returns.raise') && lines.some((l) => l.shipped_qty - l.returned_qty > 1e-9),
    },
  });
});
