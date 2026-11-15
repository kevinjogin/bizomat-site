// BIZOMAT ERP, Release 1: the supplier master, the procurement foundation (/api/erp/c/:company/suppliers...).
//
// A supplier (SUP-0001) starts pending and is approved, put on hold or blocked by a procurement manager (or an ERP
// administrator) who did not create it (segregation of duties; the one-person company exception is recorded). An ABN is
// checked for its form and check digits only: it is "format checked", never "verified" (no register lookup here).
//
// Payment is Finance's job. A supplier links to the Finance supplier contact it is paid as (fin_contacts), never a copy:
// the link is made only by someone who may see (to pick one) or create (to make one) contacts in that Finance workspace,
// checked here with Finance's own permissions, as src/worker/company/links.ts does for customers. The Finance workspace
// is the company's own: a registered company's Finance (co_tools), the example company's, or, for a person's own
// company, a business workspace they own that no registered company runs.
//
// Supplier performance (on time, in full, lead time, refused quantities) is measured from goods receipts (Release 2,
// performance.ts).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { abnValid, formatAbn } from '../company/verify';
import { companyTools } from '../company/access';
import { canRecord, hasPerm, loadAccess as finAccess, scopeSql, type FinAccess } from '../fin/access';
import { can, requireErp, segregation, type ErpAccess } from './access';
import { NUMBER_RE, SUPPLIER_STATUS, badState, changed, csvResponse, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zCurrency, zText } from './util';
import { filesOf } from './files';
import { PERFORMANCE_HELP, supplierPerformance } from './performance';
// Release 4: the supplier's quality figures (read only)
import { supplierQuality } from './quality-reports';

export const supplierRoutes = new Hono<AppEnv>();

export const SUPPLIER_LABELS: Record<(typeof SUPPLIER_STATUS)[number], string> = { pending: 'Pending approval', approved: 'Approved', on_hold: 'On hold', blocked: 'Blocked' };
export const ABN_NOTE = 'Format checked: the ABN has 11 digits and its check digits are right. It is not looked up on the Australian Business Register.';

const zEmail = z.union([z.literal(''), z.string().trim().toLowerCase().email('Give a valid email address').max(320)]);
const zAbn = z
  .string()
  .trim()
  .max(20)
  .transform((s) => s.replace(/\s+/g, ''));

/** An ABN's form and check digits (ABR's published algorithm), never a register lookup. */
function checkAbn(abn: string | undefined) {
  if (abn && !abnValid(abn)) throw new HttpError(400, 'That ABN fails its check digits: check it and try again');
}

const fields = {
  number: zText(40).optional(),
  legalName: zText(200).min(1),
  tradingName: zText(200).optional(),
  abn: zAbn.optional(),
  category: zText(80).optional(),
  email: zEmail.optional(),
  phone: zText(40).optional(),
  website: z.union([z.literal(''), z.string().trim().max(300).regex(/^https?:\/\/[^\s]+$/i, 'A website starts with https://')]).optional(),
  postalAddress: zText(500).optional(),
  deliveryAddress: zText(500).optional(),
  paymentTermsDays: z.number().int().min(0).max(365).nullable().optional(),
  currency: zCurrency.optional(),
  deliveryTerms: zText(200).optional(),
  leadTimeDays: z.number().int().min(0).max(1000).nullable().optional(),
  notes: zText(5000).optional(),
};
const COLUMNS: Record<string, string> = {
  legalName: 'legal_name',
  tradingName: 'trading_name',
  abn: 'abn',
  category: 'category',
  email: 'email',
  phone: 'phone',
  website: 'website',
  postalAddress: 'postal_address',
  deliveryAddress: 'delivery_address',
  paymentTermsDays: 'payment_terms_days',
  currency: 'currency',
  deliveryTerms: 'delivery_terms',
  leadTimeDays: 'lead_time_days',
  notes: 'notes',
};

export function supplierDTO(s: any) {
  return {
    id: s.id,
    number: s.number,
    legalName: s.legal_name,
    tradingName: s.trading_name,
    name: s.trading_name || s.legal_name,
    abn: s.abn ? formatAbn(s.abn) : '',
    abnCheck: s.abn ? 'format_checked' : 'none',
    category: s.category,
    email: s.email,
    phone: s.phone,
    website: s.website,
    postalAddress: s.postal_address,
    deliveryAddress: s.delivery_address,
    paymentTermsDays: s.payment_terms_days,
    currency: s.currency,
    deliveryTerms: s.delivery_terms,
    leadTimeDays: s.lead_time_days,
    status: s.status,
    statusLabel: SUPPLIER_LABELS[s.status as keyof typeof SUPPLIER_LABELS] ?? s.status,
    statusNote: s.status_note,
    approvedByName: s.approved_by_name ?? null,
    approvedAt: s.approved_at,
    sodException: !!s.sod_exception,
    financeLinked: !!s.fin_contact_id,
    notes: s.notes,
    productCount: s.product_count ?? undefined,
    createdBy: s.created_by,
    createdByName: s.created_by_name ?? null,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    archivedAt: s.archived_at,
  };
}

const SUPPLIER_SELECT = `SELECT s.*, au.name AS approved_by_name, cu.name AS created_by_name,
       (SELECT COUNT(*) FROM erp_product_suppliers x WHERE x.company_id = s.company_id AND x.supplier_id = s.id) AS product_count
  FROM erp_suppliers s LEFT JOIN users au ON au.id = s.approved_by LEFT JOIN users cu ON cu.id = s.created_by`;

export async function loadSupplier(db: D1Database, companyId: string, id: string) {
  const s = await db.prepare(`${SUPPLIER_SELECT} WHERE s.company_id = ? AND s.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!s) throw notFound('Supplier');
  return s;
}

const SORTS: Record<string, string> = { number: 's.number COLLATE NOCASE', name: "COALESCE(NULLIF(s.trading_name, ''), s.legal_name) COLLATE NOCASE", status: 's.status', category: 's.category COLLATE NOCASE', updated: 's.updated_at', created: 's.created_at' };

supplierRoutes.get('/c/:company/suppliers', async (c) => {
  const a = await requireErp(c, 'suppliers.view');
  const db = c.env.DB;
  const where = ['s.company_id = ?'];
  const args: unknown[] = [a.companyId];
  where.push(c.req.query('archived') === '1' ? 's.archived_at IS NOT NULL' : 's.archived_at IS NULL');
  const status = c.req.query('status');
  if (status && (SUPPLIER_STATUS as readonly string[]).includes(status)) {
    where.push('s.status = ?');
    args.push(status);
  }
  const category = c.req.query('category');
  if (category) {
    where.push('s.category = ?');
    args.push(category.slice(0, 80));
  }
  const q = c.req.query('q');
  if (q?.trim()) {
    where.push('s.search LIKE ?');
    args.push(likeOf(q));
  }
  const sort = SORTS[c.req.query('sort') ?? ''] ?? SORTS.number;
  const dir = c.req.query('dir') === 'desc' ? 'DESC' : 'ASC';
  const sql = `${SUPPLIER_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort} ${dir}, s.rowid`;
  if (wantsCsv(c)) {
    const rows = await db.prepare(`${sql} LIMIT 10000`).bind(...args).all<any>();
    return csvResponse('suppliers', [
      ['Number', 'Legal name', 'Trading name', 'ABN', 'ABN check', 'Category', 'Status', 'Email', 'Phone', 'Payment terms (days)', 'Currency', 'Lead time (days)', 'Delivery terms', 'Products supplied', 'Linked to Finance'],
      ...rows.results.map((s) => [s.number, s.legal_name, s.trading_name, s.abn ? formatAbn(s.abn) : '', s.abn ? 'Format checked' : '', s.category, SUPPLIER_LABELS[s.status as keyof typeof SUPPLIER_LABELS], s.email, s.phone, s.payment_terms_days ?? '', s.currency, s.lead_time_days ?? '', s.delivery_terms, s.product_count, s.fin_contact_id ? 'yes' : '']),
    ]);
  }
  const { limit, offset } = paging(c);
  const [rows, total, cats] = await Promise.all([
    db.prepare(`${sql} LIMIT ? OFFSET ?`).bind(...args, limit, offset).all<any>(),
    db.prepare(`SELECT COUNT(*) AS n FROM erp_suppliers s WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>(),
    db.prepare("SELECT DISTINCT category FROM erp_suppliers WHERE company_id = ? AND category <> '' ORDER BY category COLLATE NOCASE LIMIT 200").bind(a.companyId).all<{ category: string }>(),
  ]);
  return c.json({ suppliers: rows.results.map(supplierDTO), total: total?.n ?? 0, categories: cats.results.map((r) => r.category), can: { create: can(a, 'suppliers.edit') } });
});

supplierRoutes.post('/c/:company/suppliers', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  await rateLimit(db, `erp-write:${a.userId}`, 300, 60_000);
  const input = await body(c, z.object(fields));
  checkAbn(input.abn);
  let number = input.number?.trim();
  if (number) {
    if (!NUMBER_RE.test(number)) throw new HttpError(400, 'A supplier number may use letters, digits and . _ / - (up to 40)');
    const dup = await db.prepare('SELECT 1 FROM erp_suppliers WHERE company_id = ? AND number = ?').bind(a.companyId, number).first();
    if (dup) throw new HttpError(409, `Supplier number ${number} is already used`);
  } else number = await nextNumber(db, a.companyId, 'supplier');
  if (input.abn) {
    const dup = await db.prepare('SELECT number FROM erp_suppliers WHERE company_id = ? AND abn = ? AND archived_at IS NULL').bind(a.companyId, input.abn).first<{ number: string }>();
    if (dup) throw new HttpError(409, `Supplier ${dup.number} already has that ABN`);
  }
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_suppliers (id, company_id, number, legal_name, trading_name, abn, category, email, phone, website, postal_address, delivery_address, payment_terms_days, currency, delivery_terms, lead_time_days, status, notes, search, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        a.companyId,
        number,
        input.legalName,
        input.tradingName ?? '',
        input.abn ?? '',
        input.category ?? '',
        input.email ?? '',
        input.phone ?? '',
        input.website ?? '',
        input.postalAddress ?? '',
        input.deliveryAddress ?? '',
        input.paymentTermsDays ?? null,
        input.currency ?? 'AUD',
        input.deliveryTerms ?? '',
        input.leadTimeDays ?? null,
        input.notes ?? '',
        searchText(number, input.legalName, input.tradingName, input.abn, input.category, input.email),
        a.userId,
        t,
        t,
      ),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.created', entityType: 'supplier', entityId: id, summary: `Supplier ${number} ${input.legalName} added (pending approval)${input.abn ? '; ABN format checked' : ''}`, after: { legalName: input.legalName, abn: input.abn ?? '', status: 'pending' }, at: t }),
  ]);
  return c.json(supplierDTO(await loadSupplier(db, a.companyId, id)), 201);
});

async function contactsOf(db: D1Database, companyId: string, supplierId: string) {
  const rows = await db.prepare('SELECT * FROM erp_supplier_contacts WHERE company_id = ? AND supplier_id = ? ORDER BY is_primary DESC, name COLLATE NOCASE').bind(companyId, supplierId).all<any>();
  return rows.results.map((x) => ({ id: x.id, name: x.name, role: x.role, email: x.email, phone: x.phone, isPrimary: !!x.is_primary }));
}

supplierRoutes.get('/c/:company/suppliers/:id', async (c) => {
  const a = await requireErp(c, 'suppliers.view');
  const db = c.env.DB;
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  const products = can(a, 'products.view')
    ? (
        await db
          .prepare(
            `SELECT x.*, p.number, p.name, p.type FROM erp_product_suppliers x JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
              WHERE x.company_id = ? AND x.supplier_id = ? ORDER BY p.number COLLATE NOCASE`,
          )
          .bind(a.companyId, s.id)
          .all<any>()
      ).results.map((x) => ({ productId: x.product_id, number: x.number, name: x.name, type: x.type, supplierPartNumber: x.supplier_part_number, priceCents: x.price_cents, currency: x.currency, leadTimeDays: x.lead_time_days, moq: x.moq, preferred: !!x.preferred }))
    : [];
  const own = s.created_by === a.userId;
  const approver = can(a, 'suppliers.approve');
  return c.json({
    supplier: supplierDTO(s),
    abnNote: s.abn ? ABN_NOTE : null,
    contacts: await contactsOf(db, a.companyId, s.id),
    products,
    files: await filesOf(db, a.companyId, 'supplier_id', s.id),
    finance: await financeView(db, a, s, c.get('user')),
    quality: can(a, 'quality.view') ? await supplierQuality(db, a.companyId, s.id) : null,
    performance: { measured: true, note: PERFORMANCE_HELP, ...((await supplierPerformance(db, a.companyId, s.id))[0] ?? { orders: 0, receipts: 0, onTimeRate: null, onTimeMeasured: 0, inFullRate: null, inFullMeasured: 0, avgLeadTimeDays: null, rejectedQty: 0, receivedQty: 0 }) },
    history: await historyOf(db, a.companyId, { entityType: 'supplier', entityId: s.id }, 100),
    can: {
      edit: !s.archived_at && can(a, 'suppliers.edit'),
      approve: !s.archived_at && approver && s.status !== 'approved' && (!own || a.solo),
      hold: !s.archived_at && approver && s.status === 'approved',
      block: !s.archived_at && approver && s.status !== 'blocked',
      segregation: own && !a.solo && approver && s.status !== 'approved' ? 'You created this supplier, so another procurement manager must approve it.' : null,
    },
  });
});

supplierRoutes.patch('/c/:company/suppliers/:id', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  if (s.archived_at) badState(`${s.number} is archived: restore it first`);
  const input = await body(c, z.object({ ...fields, legalName: zText(200).min(1).optional() }));
  checkAbn(input.abn);
  const row: Record<string, unknown> = {};
  for (const [k, col] of Object.entries(COLUMNS)) if ((input as any)[k] !== undefined) row[col] = (input as any)[k];
  if (input.number !== undefined && input.number.trim() && input.number.trim() !== s.number) {
    if (!NUMBER_RE.test(input.number.trim())) throw new HttpError(400, 'A supplier number may use letters, digits and . _ / - (up to 40)');
    const dup = await db.prepare('SELECT 1 FROM erp_suppliers WHERE company_id = ? AND number = ? AND id <> ?').bind(a.companyId, input.number.trim(), s.id).first();
    if (dup) throw new HttpError(409, `Supplier number ${input.number.trim()} is already used`);
    row.number = input.number.trim();
  }
  if (row.abn && row.abn !== s.abn) {
    const dup = await db.prepare('SELECT number FROM erp_suppliers WHERE company_id = ? AND abn = ? AND id <> ? AND archived_at IS NULL').bind(a.companyId, row.abn, s.id).first<{ number: string }>();
    if (dup) throw new HttpError(409, `Supplier ${dup.number} already has that ABN`);
  }
  const diff = changed(s, row);
  if (!diff.any) return c.json(supplierDTO(s));
  const t = now();
  const merged = { ...s, ...row };
  // A change to who the supplier is (name or ABN) after approval sends it back for approval.
  const reapprove = s.status === 'approved' && ('legal_name' in diff.after || 'abn' in diff.after);
  await db.batch([
    db
      .prepare(`UPDATE erp_suppliers SET ${Object.keys(row).map((k) => `${k} = ?`).join(', ')}, ${reapprove ? "status = 'pending', approved_by = NULL, approved_at = NULL, sod_exception = 0, " : ''}search = ?, updated_at = ? WHERE company_id = ? AND id = ?`)
      .bind(...Object.values(row), searchText(merged.number, merged.legal_name, merged.trading_name, merged.abn, merged.category, merged.email), t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.updated', entityType: 'supplier', entityId: s.id, summary: `${s.number} details changed${reapprove ? '; legal name or ABN changed, so it needs approval again' : ''}`, before: diff.before, after: diff.after, at: t }),
  ]);
  return c.json(supplierDTO(await loadSupplier(db, a.companyId, s.id)));
});

supplierRoutes.post('/c/:company/suppliers/:id/status', async (c) => {
  const a = await requireErp(c, 'suppliers.approve');
  const db = c.env.DB;
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  if (s.archived_at) badState(`${s.number} is archived: restore it first`);
  const input = await body(c, z.object({ status: z.enum(['approved', 'on_hold', 'blocked']), note: zText(1000).optional() }));
  if (input.status === s.status) badState(`${s.number} is already ${SUPPLIER_LABELS[s.status as keyof typeof SUPPLIER_LABELS].toLowerCase()}`);
  if (input.status === 'on_hold' && s.status !== 'approved') badState('Only an approved supplier can be put on hold');
  if (input.status !== 'approved' && !input.note?.trim()) throw new HttpError(400, input.status === 'blocked' ? 'Say why the supplier is blocked' : 'Say why the supplier is on hold');
  const exception = input.status === 'approved' ? segregation(a, s.created_by, 'created this supplier') : false;
  const t = now();
  const set = input.status === 'approved' ? { status: 'approved', status_note: input.note ?? '', approved_by: a.userId, approved_at: t, sod_exception: exception ? 1 : 0 } : { status: input.status, status_note: input.note ?? '' };
  const res = await db.batch([
    db.prepare(`UPDATE erp_suppliers SET ${Object.keys(set).map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`).bind(...Object.values(set), t, a.companyId, s.id, s.status),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: `supplier.${input.status}`,
      entityType: 'supplier',
      entityId: s.id,
      summary: `${s.number} ${SUPPLIER_LABELS[input.status].toLowerCase()}${exception ? ' by the person who created it (one-person company, recorded exception)' : ''}${input.note ? `: ${input.note}` : ''}`,
      before: { status: s.status },
      after: { status: input.status, note: input.note ?? '' },
      at: t,
    }),
  ]);
  if (!res[0].meta.changes) badState(`${s.number} changed meanwhile: reload it`);
  return c.json(supplierDTO(await loadSupplier(db, a.companyId, s.id)));
});

for (const [path, archived] of [
  ['archive', true],
  ['restore', false],
] as const) {
  supplierRoutes.post(`/c/:company/suppliers/:id/${path}`, async (c) => {
    const a = await requireErp(c, 'suppliers.edit');
    const db = c.env.DB;
    const s = await loadSupplier(db, a.companyId, c.req.param('id'));
    if (!!s.archived_at === archived) return c.json(supplierDTO(s));
    const t = now();
    await db.batch([
      db.prepare('UPDATE erp_suppliers SET archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(archived ? t : null, t, a.companyId, s.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `supplier.${path}d`, entityType: 'supplier', entityId: s.id, summary: `${s.number} ${archived ? 'archived' : 'restored'}`, at: t }),
    ]);
    return c.json(supplierDTO(await loadSupplier(db, a.companyId, s.id)));
  });
}

// ------------------------------------------------------------------ contacts

const contactSchema = z.object({ name: zText(120).min(1), role: zText(80).optional(), email: zEmail.optional(), phone: zText(40).optional(), isPrimary: z.boolean().optional() });

supplierRoutes.post('/c/:company/suppliers/:id/contacts', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  const input = await body(c, contactSchema);
  const count = await db.prepare('SELECT COUNT(*) AS n FROM erp_supplier_contacts WHERE company_id = ? AND supplier_id = ?').bind(a.companyId, s.id).first<{ n: number }>();
  if ((count?.n ?? 0) >= 100) badState('A supplier can have up to 100 contacts');
  const primary = input.isPrimary || !count?.n;
  const id = newId();
  const t = now();
  await db.batch([
    ...(primary ? [db.prepare('UPDATE erp_supplier_contacts SET is_primary = 0 WHERE company_id = ? AND supplier_id = ?').bind(a.companyId, s.id)] : []),
    db
      .prepare('INSERT INTO erp_supplier_contacts (id, company_id, supplier_id, name, role, email, phone, is_primary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, s.id, input.name, input.role ?? '', input.email ?? '', input.phone ?? '', primary ? 1 : 0, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.contact_added', entityType: 'supplier', entityId: s.id, summary: `Contact ${input.name} added to ${s.number}`, at: t }),
  ]);
  return c.json({ contacts: await contactsOf(db, a.companyId, s.id) }, 201);
});

supplierRoutes.patch('/c/:company/suppliers/:id/contacts/:contactId', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  const x = await db.prepare('SELECT * FROM erp_supplier_contacts WHERE company_id = ? AND supplier_id = ? AND id = ?').bind(a.companyId, s.id, String(c.req.param('contactId')).slice(0, 64)).first<any>();
  if (!x) throw notFound('Contact');
  const input = await body(c, contactSchema.partial());
  const row: Record<string, unknown> = {};
  for (const k of ['name', 'role', 'email', 'phone'] as const) if (input[k] !== undefined) row[k] = input[k];
  if (input.isPrimary !== undefined) row.is_primary = input.isPrimary ? 1 : 0;
  const diff = changed(x, row);
  if (!diff.any) return c.json({ contacts: await contactsOf(db, a.companyId, s.id) });
  const t = now();
  await db.batch([
    ...(input.isPrimary ? [db.prepare('UPDATE erp_supplier_contacts SET is_primary = 0 WHERE company_id = ? AND supplier_id = ?').bind(a.companyId, s.id)] : []),
    db.prepare(`UPDATE erp_supplier_contacts SET ${Object.keys(row).map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE company_id = ? AND id = ?`).bind(...Object.values(row), t, a.companyId, x.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.contact_changed', entityType: 'supplier', entityId: s.id, summary: `Contact ${row.name ?? x.name} of ${s.number} changed`, before: diff.before, after: diff.after, at: t }),
  ]);
  return c.json({ contacts: await contactsOf(db, a.companyId, s.id) });
});

supplierRoutes.delete('/c/:company/suppliers/:id/contacts/:contactId', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  const x = await db.prepare('SELECT * FROM erp_supplier_contacts WHERE company_id = ? AND supplier_id = ? AND id = ?').bind(a.companyId, s.id, String(c.req.param('contactId')).slice(0, 64)).first<any>();
  if (!x) throw notFound('Contact');
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM erp_supplier_contacts WHERE company_id = ? AND id = ?').bind(a.companyId, x.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.contact_removed', entityType: 'supplier', entityId: s.id, summary: `Contact ${x.name} removed from ${s.number}`, at: t }),
  ]);
  return c.json({ contacts: await contactsOf(db, a.companyId, s.id) });
});

// ------------------------------------------------------------------ the Finance link

/** The Finance business workspaces this ERP company is paid through. */
export async function financeOrgsFor(db: D1Database, a: ErpAccess): Promise<{ id: string; name: string }[]> {
  if (a.kind === 'registered') {
    const id = (await companyTools(db, a.companyId)).finance;
    if (!id) return [];
    const o = await db.prepare("SELECT id, name FROM fin_orgs WHERE id = ? AND kind = 'business' AND deleted_at IS NULL").bind(id).first<{ id: string; name: string }>();
    return o ? [o] : [];
  }
  if (a.kind === 'demo') {
    const o = await db.prepare("SELECT o.id, o.name FROM sys_demo d JOIN fin_orgs o ON o.id = d.fin_org_id WHERE d.company_id = ? AND d.user_id = ? AND o.kind = 'business' AND o.deleted_at IS NULL").bind(a.companyId, a.userId).first<{ id: string; name: string }>();
    return o ? [o] : [];
  }
  // A person's own company: business workspaces they own that no registered company runs and that are not the example's.
  const rows = await db
    .prepare(
      `SELECT o.id, o.name FROM fin_orgs o JOIN fin_members m ON m.org_id = o.id AND m.user_id = ? AND m.role = 'owner'
        WHERE o.kind = 'business' AND o.deleted_at IS NULL
          AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'finance' AND t.ref_id = o.id)
          AND NOT EXISTS (SELECT 1 FROM sys_demo d WHERE d.fin_org_id = o.id)
        ORDER BY o.name COLLATE NOCASE LIMIT 20`,
    )
    .bind(a.userId)
    .all<{ id: string; name: string }>();
  return rows.results;
}

export async function maybeFin(db: D1Database, orgId: string, user: { id: string; name: string }): Promise<FinAccess | null> {
  try {
    return await finAccess(db, orgId, user);
  } catch {
    return null;
  }
}

/** What the person may see of a supplier's Finance link. */
async function financeView(db: D1Database, a: ErpAccess, s: any, user: { id: string; name: string }) {
  const orgs = await financeOrgsFor(db, a);
  const editable = can(a, 'suppliers.edit') && !s.archived_at;
  const access = await Promise.all(orgs.map(async (o) => ({ ...o, fa: await maybeFin(db, o.id, user) })));
  const options = access.map((o) => ({ id: o.id, name: o.name, access: !!o.fa, canPick: !!o.fa && hasPerm(o.fa, 'contacts', 'view'), canCreate: !!o.fa && !!o.fa.perms.contacts.create }));
  if (!s.fin_contact_id) return { linked: false, contact: null, orgs: options, canLink: editable && options.some((o) => o.canPick || o.canCreate) };
  const holder = access.find((o) => o.id === s.fin_org_id);
  let contact: { id: string; name: string; url: string } | null = null;
  if (holder?.fa) {
    const row = await db.prepare('SELECT id, name, created_by, archived_at FROM fin_contacts WHERE id = ? AND org_id = ?').bind(s.fin_contact_id, holder.fa.orgId).first<any>();
    if (row && canRecord(holder.fa, 'contacts', 'view', row)) contact = { id: row.id, name: row.name, url: `/erp/finance/o/${holder.fa.orgId}/contacts/${row.id}` };
  }
  return {
    linked: true,
    orgName: holder?.name ?? null,
    contact,
    // linked, but this person cannot see Finance's contact: say so without its details
    hidden: !contact,
    orgs: options,
    canLink: editable,
  };
}

supplierRoutes.get('/c/:company/suppliers/:id/finance/contacts', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  await loadSupplier(db, a.companyId, c.req.param('id'));
  const orgId = String(c.req.query('org') ?? '');
  const org = (await financeOrgsFor(db, a)).find((o) => o.id === orgId);
  if (!org) throw notFound('Finance workspace');
  const fa = await maybeFin(db, org.id, c.get('user'));
  if (!fa) throw new HttpError(403, 'You have no access to this Finance workspace');
  if (!hasPerm(fa, 'contacts', 'view')) throw new HttpError(403, 'Your Finance role cannot see suppliers');
  const scope = scopeSql(fa, 'contacts', 'f');
  const q = c.req.query('q');
  const rows = await db
    .prepare(
      `SELECT f.id, f.name, f.email, f.abn FROM fin_contacts f WHERE f.org_id = ? AND f.kind IN ('supplier','both') AND f.archived_at IS NULL AND ${scope.sql}
         AND NOT EXISTS (SELECT 1 FROM erp_suppliers s WHERE s.company_id = ? AND s.fin_contact_id = f.id)
         ${q?.trim() ? 'AND f.search LIKE ?' : ''} ORDER BY f.name COLLATE NOCASE LIMIT 50`,
    )
    .bind(fa.orgId, ...scope.args, a.companyId, ...(q?.trim() ? [likeOf(q)] : []))
    .all<{ id: string; name: string; email: string; abn: string }>();
  return c.json({ contacts: rows.results });
});

supplierRoutes.post('/c/:company/suppliers/:id/finance', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  await rateLimit(db, `erp-link:${a.userId}`, 60, 60_000);
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  if (s.archived_at) badState(`${s.number} is archived: restore it first`);
  if (s.fin_contact_id) badState(`${s.number} is already linked to Finance: unlink it first`);
  const input = await body(c, z.object({ finOrgId: z.string().min(1).max(64), finContactId: z.string().max(64).optional(), create: z.boolean().optional() }));
  if (!!input.finContactId === !!input.create) throw new HttpError(400, 'Pick a Finance supplier, or ask to create one');
  const org = (await financeOrgsFor(db, a)).find((o) => o.id === input.finOrgId);
  if (!org) throw notFound('Finance workspace');
  const fa = await maybeFin(db, org.id, c.get('user'));
  if (!fa) throw new HttpError(403, 'You have no access to this Finance workspace');
  const t = now();
  let contactId: string;
  let contactName: string;
  const stmts: D1PreparedStatement[] = [];
  if (input.finContactId) {
    if (!hasPerm(fa, 'contacts', 'view')) throw new HttpError(403, 'Your Finance role cannot see suppliers');
    const row = await db.prepare("SELECT id, name, created_by FROM fin_contacts WHERE id = ? AND org_id = ? AND kind IN ('supplier','both') AND archived_at IS NULL").bind(input.finContactId, fa.orgId).first<any>();
    if (!row || !canRecord(fa, 'contacts', 'view', row)) throw notFound('Finance supplier');
    contactId = row.id;
    contactName = row.name;
  } else {
    if (!fa.perms.contacts.create) throw new HttpError(403, 'Your Finance role cannot add suppliers');
    contactId = newId();
    contactName = s.legal_name;
    stmts.push(
      db
        .prepare("INSERT INTO fin_contacts (id, org_id, name, kind, email, phone, abn, address, terms_days, search, created_by, created_at, updated_at) VALUES (?, ?, ?, 'supplier', ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(contactId, fa.orgId, s.legal_name, s.email, s.phone, s.abn, s.postal_address, s.payment_terms_days, searchText(s.legal_name, s.trading_name, s.email, s.phone, s.abn), a.userId, t, t),
    );
  }
  stmts.push(
    db.prepare('UPDATE erp_suppliers SET fin_org_id = ?, fin_contact_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND fin_contact_id IS NULL').bind(fa.orgId, contactId, t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.finance_linked', entityType: 'supplier', entityId: s.id, summary: `${s.number} linked to the Finance supplier ${contactName}${input.create ? ' (created in Finance)' : ''}`, after: { finOrg: org.name, created: !!input.create }, at: t }),
  );
  try {
    await db.batch(stmts);
  } catch (e) {
    if (String(e).includes('UNIQUE')) badState('That Finance supplier is already linked to another supplier');
    throw e;
  }
  return c.json(await financeView(db, a, await loadSupplier(db, a.companyId, s.id), c.get('user')), 201);
});

supplierRoutes.delete('/c/:company/suppliers/:id/finance', async (c) => {
  const a = await requireErp(c, 'suppliers.edit');
  const db = c.env.DB;
  const s = await loadSupplier(db, a.companyId, c.req.param('id'));
  if (!s.fin_contact_id) return c.json(await financeView(db, a, s, c.get('user')));
  const t = now();
  await db.batch([
    db.prepare('UPDATE erp_suppliers SET fin_org_id = NULL, fin_contact_id = NULL, updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.finance_unlinked', entityType: 'supplier', entityId: s.id, summary: `${s.number} unlinked from Finance; the Finance supplier is kept`, at: t }),
  ]);
  return c.json(await financeView(db, a, await loadSupplier(db, a.companyId, s.id), c.get('user')));
});

/** Suppliers a product can be bought from, for the product page's picker. */
supplierRoutes.get('/c/:company/supplier-options', async (c) => {
  const a = await requireErp(c, 'suppliers.view');
  const db = c.env.DB;
  const rows = await db
    .prepare("SELECT id, number, legal_name, trading_name, status, currency FROM erp_suppliers WHERE company_id = ? AND archived_at IS NULL AND status <> 'blocked' ORDER BY number COLLATE NOCASE LIMIT 500")
    .bind(a.companyId)
    .all<any>();
  return c.json({ suppliers: rows.results.map((s) => ({ id: s.id, number: s.number, name: s.trading_name || s.legal_name, status: s.status, statusLabel: SUPPLIER_LABELS[s.status as keyof typeof SUPPLIER_LABELS], currency: s.currency })) });
});

