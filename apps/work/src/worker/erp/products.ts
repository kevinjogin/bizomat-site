// BIZOMAT ERP, Release 1: the product master (/api/erp/c/:company/products). A product has a number (PRD-00001 or one
// given by hand), an optional SKU, its type, costs and units, a lifecycle, technical properties, variants (each a
// product of its own with the attributes that set it apart), engineering revisions (engineering.ts) and the suppliers
// that sell it. Every new product starts with revision A as a draft.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { can, requireErp, type ErpAccess } from './access';
import {
  LIFECYCLE,
  NUMBER_RE,
  PRODUCT_TYPES,
  TYPE_LABELS,
  changed,
  csvResponse,
  dollars,
  eventStmt,
  historyOf,
  likeOf,
  nextNumber,
  paging,
  searchText,
  validDate,
  wantsCsv,
  zCurrency,
  zDate,
  zId,
  zMoney,
  zText,
} from './util';
import { filesOf } from './files';
import { documentsOf } from './documents';

export const productRoutes = new Hono<AppEnv>();

const kv = z.object({ key: zText(80).min(1), value: zText(500) });
const fields = {
  number: zText(40).optional(),
  sku: zText(80).optional(),
  name: zText(200).min(1),
  description: zText(5000).optional(),
  category: zText(80).optional(),
  subcategory: zText(80).optional(),
  family: zText(80).optional(),
  type: z.enum(PRODUCT_TYPES),
  uom: zText(20).min(1).optional(),
  manufacturer: zText(120).optional(),
  standardCostCents: zMoney.optional(),
  currentCostCents: zMoney.optional(),
  priceCents: zMoney.optional(),
  currency: zCurrency.optional(),
  weight: z.number().min(0).max(1e9).nullable().optional(),
  weightUnit: z.enum(['g', 'kg', 't', 'lb']).optional(),
  length: z.number().min(0).max(1e9).nullable().optional(),
  width: z.number().min(0).max(1e9).nullable().optional(),
  height: z.number().min(0).max(1e9).nullable().optional(),
  dimensionUnit: z.enum(['mm', 'cm', 'm', 'in', 'ft']).optional(),
  material: zText(120).optional(),
  properties: z.array(kv).max(60).optional(),
  lifecycle: z.enum(LIFECYCLE).optional(),
  effectiveFrom: zDate.optional(),
  effectiveTo: zDate.optional(),
  variantAttributes: z.record(z.string().max(40), zText(120)).optional(),
};
const createSchema = z.object(fields);
const updateSchema = z.object({ ...fields, name: zText(200).min(1).optional(), type: z.enum(PRODUCT_TYPES).optional() });
/** The attributes that set a variant apart. */
export const VARIANT_KEYS = ['size', 'model', 'configuration', 'material', 'finish', 'options'] as const;

const COLUMNS: Record<string, string> = {
  sku: 'sku',
  name: 'name',
  description: 'description',
  category: 'category',
  subcategory: 'subcategory',
  family: 'family',
  type: 'type',
  uom: 'uom',
  manufacturer: 'manufacturer',
  standardCostCents: 'standard_cost_cents',
  currentCostCents: 'current_cost_cents',
  priceCents: 'price_cents',
  currency: 'currency',
  weight: 'weight',
  weightUnit: 'weight_unit',
  length: 'length',
  width: 'width',
  height: 'height',
  dimensionUnit: 'dimension_unit',
  material: 'material',
  lifecycle: 'lifecycle',
  effectiveFrom: 'effective_from',
  effectiveTo: 'effective_to',
};

export function productDTO(p: any) {
  return {
    id: p.id,
    number: p.number,
    sku: p.sku ?? '',
    name: p.name,
    description: p.description,
    category: p.category,
    subcategory: p.subcategory,
    family: p.family,
    type: p.type,
    typeLabel: TYPE_LABELS[p.type as keyof typeof TYPE_LABELS] ?? p.type,
    uom: p.uom,
    manufacturer: p.manufacturer,
    standardCostCents: p.standard_cost_cents,
    currentCostCents: p.current_cost_cents,
    priceCents: p.price_cents,
    currency: p.currency,
    weight: p.weight,
    weightUnit: p.weight_unit,
    length: p.length,
    width: p.width,
    height: p.height,
    dimensionUnit: p.dimension_unit,
    material: p.material,
    properties: parseJson<{ key: string; value: string }[]>(p.properties_json, []),
    lifecycle: p.lifecycle,
    effectiveFrom: p.effective_from,
    effectiveTo: p.effective_to,
    variantOf: p.variant_of,
    variantOfNumber: p.parent_number ?? null,
    variantOfName: p.parent_name ?? null,
    variantAttributes: parseJson<Record<string, string>>(p.variant_json, {}),
    releasedRevision: p.released_label ?? null,
    releasedRevisionId: p.released_id ?? null,
    archived: !!p.archived_at,
    createdBy: p.created_by,
    createdByName: p.creator ?? null,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

const SELECT = `SELECT p.*, pp.number AS parent_number, pp.name AS parent_name, u.name AS creator,
       (SELECT r.label FROM erp_revisions r WHERE r.company_id = p.company_id AND r.product_id = p.id AND r.status = 'released') AS released_label,
       (SELECT r.id FROM erp_revisions r WHERE r.company_id = p.company_id AND r.product_id = p.id AND r.status = 'released') AS released_id
  FROM erp_products p
  LEFT JOIN erp_products pp ON pp.company_id = p.company_id AND pp.id = p.variant_of
  LEFT JOIN users u ON u.id = p.created_by`;

export async function loadProduct(db: D1Database, companyId: string, id: string) {
  const p = await db.prepare(`${SELECT} WHERE p.company_id = ? AND p.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!p) throw notFound('Product');
  return p;
}

function rowFrom(input: Partial<z.infer<typeof createSchema>>) {
  const row: Record<string, unknown> = {};
  for (const [k, col] of Object.entries(COLUMNS)) {
    const v = (input as any)[k];
    if (v === undefined) continue;
    row[col] = k === 'sku' ? (v === '' ? null : v) : v;
  }
  if (input.properties !== undefined) row.properties_json = JSON.stringify(input.properties);
  if (input.variantAttributes !== undefined) {
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(input.variantAttributes)) if (v.trim()) clean[k.trim().toLowerCase().slice(0, 40)] = v.trim();
    row.variant_json = JSON.stringify(clean);
  }
  return row;
}

function checkDates(row: Record<string, unknown>) {
  const from = row.effective_from as string | null | undefined;
  const to = row.effective_to as string | null | undefined;
  if (from && to && validDate(from) && validDate(to) && to < from) throw new HttpError(400, 'The effective end date is before the start date');
}

async function uniqueCheck(db: D1Database, companyId: string, row: Record<string, unknown>, selfId?: string) {
  if (row.number) {
    const hit = await db.prepare('SELECT id FROM erp_products WHERE company_id = ? AND number = ?').bind(companyId, row.number).first<{ id: string }>();
    if (hit && hit.id !== selfId) throw new HttpError(409, `Product number ${row.number} is already used in this company`);
  }
  if (row.sku) {
    const hit = await db.prepare('SELECT id FROM erp_products WHERE company_id = ? AND sku = ?').bind(companyId, row.sku).first<{ id: string }>();
    if (hit && hit.id !== selfId) throw new HttpError(409, `SKU ${row.sku} is already used in this company`);
  }
}

const searchOf = (r: Record<string, unknown>) => searchText(r.number as string, r.sku as string, r.name as string, r.description as string, r.category as string, r.subcategory as string, r.family as string, r.manufacturer as string, r.material as string);

/** Insert statements for a new product and its first revision (A, draft). */
export async function productStatements(db: D1Database, a: ErpAccess, input: z.infer<typeof createSchema>, variantOf: string | null) {
  const row = rowFrom(input);
  let number = input.number?.trim() || '';
  if (number) {
    if (!NUMBER_RE.test(number)) throw new HttpError(400, 'A product number may use letters, digits and . _ / - (up to 40)');
  } else number = await nextNumber(db, a.companyId, 'product');
  row.number = number;
  checkDates(row);
  await uniqueCheck(db, a.companyId, row);
  const id = newId();
  const revId = newId();
  const t = now();
  row.search = searchOf(row);
  const cols = ['id', 'company_id', 'variant_of', 'created_by', 'created_at', 'updated_at', ...Object.keys(row)];
  const vals = [id, a.companyId, variantOf, a.userId, t, t, ...Object.values(row)];
  return {
    id,
    revId,
    number,
    stmts: [
      db.prepare(`INSERT INTO erp_products (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`).bind(...vals),
      db.prepare("INSERT INTO erp_revisions (id, company_id, product_id, label, status, description, created_by, created_at, updated_at) VALUES (?, ?, ?, 'A', 'draft', 'First revision', ?, ?, ?)").bind(revId, a.companyId, id, a.userId, t, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: variantOf ? 'product.variant_created' : 'product.created', entityType: 'product', entityId: id, productId: id, summary: `Product ${number} ${input.name} created${variantOf ? ' as a variant' : ''}`, after: { number, name: input.name, type: input.type }, at: t }),
    ],
  };
}

productRoutes.get('/c/:company/products', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const q = (k: string) => c.req.query(k) ?? '';
  const where = ['p.company_id = ?'];
  const args: unknown[] = [a.companyId];
  where.push(q('archived') === '1' ? 'p.archived_at IS NOT NULL' : 'p.archived_at IS NULL');
  if (q('q')) {
    where.push('p.search LIKE ?');
    args.push(likeOf(q('q')));
  }
  if ((PRODUCT_TYPES as readonly string[]).includes(q('type'))) {
    where.push('p.type = ?');
    args.push(q('type'));
  }
  if ((LIFECYCLE as readonly string[]).includes(q('lifecycle'))) {
    where.push('p.lifecycle = ?');
    args.push(q('lifecycle'));
  }
  if (q('category')) {
    where.push('p.category = ?');
    args.push(q('category'));
  }
  if (q('variantOf')) {
    where.push('p.variant_of = ?');
    args.push(q('variantOf'));
  }
  const sorts: Record<string, string> = { number: 'p.number COLLATE NOCASE', name: 'p.name COLLATE NOCASE', type: 'p.type', updated: 'p.updated_at', created: 'p.created_at', cost: 'p.standard_cost_cents', lifecycle: 'p.lifecycle' };
  const sort = sorts[q('sort')] ?? 'p.number COLLATE NOCASE';
  const dir = q('dir') === 'desc' ? 'DESC' : 'ASC';
  const csv = wantsCsv(c);
  const { limit, offset } = csv ? { limit: 10000, offset: 0 } : paging(c);
  const [rows, total, cats] = await db.batch([
    db.prepare(`${SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort} ${dir}, p.id LIMIT ? OFFSET ?`).bind(...args, limit, offset),
    db.prepare(`SELECT COUNT(*) AS n FROM erp_products p WHERE ${where.join(' AND ')}`).bind(...args),
    db.prepare("SELECT DISTINCT category FROM erp_products WHERE company_id = ? AND category <> '' ORDER BY category COLLATE NOCASE LIMIT 200").bind(a.companyId),
  ]);
  const products = (rows.results as any[]).map(productDTO);
  if (csv) {
    return csvResponse('products', [
      ['Number', 'SKU', 'Name', 'Type', 'Category', 'Subcategory', 'Family', 'Unit', 'Lifecycle', 'Released revision', 'Standard cost', 'Current cost', 'Price', 'Currency', 'Manufacturer', 'Material', 'Variant of'],
      ...products.map((p) => [p.number, p.sku, p.name, p.typeLabel, p.category, p.subcategory, p.family, p.uom, p.lifecycle, p.releasedRevision ?? '', dollars(p.standardCostCents), dollars(p.currentCostCents), dollars(p.priceCents), p.currency, p.manufacturer, p.material, p.variantOfNumber ?? '']),
    ]);
  }
  return c.json({ products, total: (total.results[0] as any)?.n ?? 0, categories: (cats.results as any[]).map((r) => r.category) });
});

productRoutes.post('/c/:company/products', async (c) => {
  const a = await requireErp(c, 'products.edit');
  await rateLimit(c.env.DB, `erp-product:${a.userId}`, 120, 60_000);
  const input = await body(c, createSchema);
  const made = await productStatements(c.env.DB, a, input, null);
  await c.env.DB.batch(made.stmts);
  return c.json(productDTO(await loadProduct(c.env.DB, a.companyId, made.id)), 201);
});

productRoutes.post('/c/:company/products/:id/variants', async (c) => {
  const a = await requireErp(c, 'products.edit');
  const parent = await loadProduct(c.env.DB, a.companyId, c.req.param('id'));
  if (parent.variant_of) throw new HttpError(400, 'A variant cannot have variants of its own: add it to the base product');
  const input = await body(c, createSchema.partial({ type: true, name: true }));
  const attrs = input.variantAttributes ?? {};
  if (!Object.values(attrs).some((v) => v && v.trim())) throw new HttpError(400, 'Give at least one attribute that sets the variant apart (size, model, configuration, material, finish or options)');
  const base = productDTO(parent);
  const made = await productStatements(
    c.env.DB,
    a,
    {
      ...input,
      name: input.name?.trim() || `${base.name} (${Object.values(attrs).filter(Boolean).join(', ')})`,
      type: input.type ?? base.type,
      category: input.category ?? base.category,
      subcategory: input.subcategory ?? base.subcategory,
      family: input.family ?? (base.family || base.name),
      uom: input.uom ?? base.uom,
      manufacturer: input.manufacturer ?? base.manufacturer,
      currency: input.currency ?? base.currency,
      material: input.material ?? base.material,
      variantAttributes: attrs,
    } as any,
    parent.id,
  );
  await c.env.DB.batch(made.stmts);
  return c.json(productDTO(await loadProduct(c.env.DB, a.companyId, made.id)), 201);
});

productRoutes.get('/c/:company/products/:id', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  const [variants, revisions, suppliers] = await db.batch([
    db.prepare(`${SELECT} WHERE p.company_id = ? AND p.variant_of = ? ORDER BY p.number COLLATE NOCASE`).bind(a.companyId, p.id),
    db
      .prepare(
        `SELECT r.*, o.number AS eco_number, o.status AS eco_status, u.name AS released_by_name,
                (SELECT COUNT(*) FROM erp_bom_lines l WHERE l.company_id = r.company_id AND l.revision_id = r.id) AS lines
           FROM erp_revisions r LEFT JOIN erp_change_orders o ON o.company_id = r.company_id AND o.id = r.eco_id
           LEFT JOIN users u ON u.id = r.released_by
          WHERE r.company_id = ? AND r.product_id = ? ORDER BY r.created_at, r.rowid`,
      )
      .bind(a.companyId, p.id),
    db
      .prepare(
        `SELECT ps.*, s.number AS supplier_number, s.legal_name, s.trading_name, s.status AS supplier_status FROM erp_product_suppliers ps
           JOIN erp_suppliers s ON s.company_id = ps.company_id AND s.id = ps.supplier_id
          WHERE ps.company_id = ? AND ps.product_id = ? ORDER BY ps.preferred DESC, s.legal_name COLLATE NOCASE`,
      )
      .bind(a.companyId, p.id),
  ]);
  const { revisionDTO } = await import('./engineering');
  return c.json({
    product: productDTO(p),
    variants: (variants.results as any[]).map(productDTO),
    revisions: (revisions.results as any[]).map(revisionDTO),
    suppliers: can(a, 'suppliers.view') ? (suppliers.results as any[]).map(productSupplierDTO) : [],
    files: await filesOf(db, a.companyId, 'product_id', p.id),
    documents: await documentsOf(db, a.companyId, p.id),
    history: await historyOf(db, a.companyId, { productId: p.id }, 60),
    can: {
      edit: can(a, 'products.edit') && !p.archived_at,
      raiseChange: can(a, 'changes.raise'),
      approve: can(a, 'changes.approve'),
      editDocuments: can(a, 'documents.edit'),
      editSuppliers: can(a, 'product_suppliers.edit'),
      viewSuppliers: can(a, 'suppliers.view'),
    },
  });
});

productRoutes.patch('/c/:company/products/:id', async (c) => {
  const a = await requireErp(c, 'products.edit');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  if (p.archived_at) throw new HttpError(409, `${p.number} is archived: restore it first`);
  const input = await body(c, updateSchema);
  const row = rowFrom(input);
  if (input.number !== undefined) {
    const num = input.number.trim();
    if (!NUMBER_RE.test(num)) throw new HttpError(400, 'A product number may use letters, digits and . _ / - (up to 40)');
    row.number = num;
  }
  const merged = { ...p, ...row };
  checkDates(merged);
  await uniqueCheck(db, a.companyId, row, p.id);
  const diff = changed(p, row);
  if (!diff.any) return c.json(productDTO(p));
  const t = now();
  row.updated_at = t;
  row.search = searchOf(merged);
  const cols = Object.keys(row);
  await db.batch([
    db.prepare(`UPDATE erp_products SET ${cols.map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ?`).bind(...Object.values(row), a.companyId, p.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'product.updated', entityType: 'product', entityId: p.id, productId: p.id, summary: `Product ${merged.number} changed`, before: diff.before, after: diff.after, at: t }),
  ]);
  return c.json(productDTO(await loadProduct(db, a.companyId, p.id)));
});

for (const [verb, archived] of [['archive', true], ['restore', false]] as const) {
  productRoutes.post(`/c/:company/products/:id/${verb}`, async (c) => {
    const a = await requireErp(c, 'products.edit');
    const db = c.env.DB;
    const p = await loadProduct(db, a.companyId, c.req.param('id'));
    if (!!p.archived_at === archived) return c.json(productDTO(p));
    if (archived) {
      const used = await db
        .prepare("SELECT COUNT(*) AS n FROM erp_bom_lines l JOIN erp_revisions r ON r.company_id = l.company_id AND r.id = l.revision_id WHERE l.company_id = ? AND l.component_id = ? AND r.status IN ('draft','in_change','released')")
        .bind(a.companyId, p.id)
        .first<{ n: number }>();
      if (used && used.n > 0) throw new HttpError(409, `${p.number} is used in ${used.n} bill${used.n === 1 ? '' : 's'} of materials still in use: change those first`);
    }
    const t = now();
    await db.batch([
      db.prepare('UPDATE erp_products SET archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(archived ? t : null, t, a.companyId, p.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: archived ? 'product.archived' : 'product.restored', entityType: 'product', entityId: p.id, productId: p.id, summary: `Product ${p.number} ${archived ? 'archived' : 'restored'}`, at: t }),
    ]);
    return c.json(productDTO(await loadProduct(db, a.companyId, p.id)));
  });
}

// ------------------------------------------------------------------ who supplies a product

export function productSupplierDTO(r: any) {
  return {
    productId: r.product_id,
    supplierId: r.supplier_id,
    supplierNumber: r.supplier_number ?? null,
    supplierName: r.trading_name || r.legal_name || null,
    supplierStatus: r.supplier_status ?? null,
    productNumber: r.product_number ?? null,
    productName: r.product_name ?? null,
    supplierPartNumber: r.supplier_part_number,
    priceCents: r.price_cents,
    currency: r.currency,
    leadTimeDays: r.lead_time_days,
    moq: r.moq,
    preferred: !!r.preferred,
    notes: r.notes,
  };
}

const supplierLink = z.object({
  supplierPartNumber: zText(80).optional(),
  priceCents: zMoney.optional(),
  currency: zCurrency.optional(),
  leadTimeDays: z.number().int().min(0).max(1000).nullable().optional(),
  moq: z.number().positive().max(1e9).nullable().optional(),
  preferred: z.boolean().optional(),
  notes: zText(1000).optional(),
});

productRoutes.put('/c/:company/products/:id/suppliers/:supplierId', async (c) => {
  const a = await requireErp(c, 'product_suppliers.edit');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  const s = await db.prepare('SELECT id, number, legal_name, status, currency, lead_time_days FROM erp_suppliers WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(a.companyId, zId.parse(c.req.param('supplierId'))).first<any>();
  if (!s) throw notFound('Supplier');
  if (s.status === 'blocked') throw new HttpError(409, `${s.number} is blocked: it cannot be added as a product supplier`);
  const input = await body(c, supplierLink);
  const old = await db.prepare('SELECT * FROM erp_product_suppliers WHERE company_id = ? AND product_id = ? AND supplier_id = ?').bind(a.companyId, p.id, s.id).first<any>();
  const t = now();
  const next = {
    supplier_part_number: input.supplierPartNumber ?? old?.supplier_part_number ?? '',
    price_cents: input.priceCents !== undefined ? input.priceCents : old?.price_cents ?? null,
    currency: input.currency ?? old?.currency ?? s.currency ?? 'AUD',
    lead_time_days: input.leadTimeDays !== undefined ? input.leadTimeDays : old?.lead_time_days ?? s.lead_time_days ?? null,
    moq: input.moq !== undefined ? input.moq : old?.moq ?? null,
    preferred: input.preferred !== undefined ? (input.preferred ? 1 : 0) : old?.preferred ?? 0,
    notes: input.notes ?? old?.notes ?? '',
  };
  const stmts = [];
  if (next.preferred) stmts.push(db.prepare('UPDATE erp_product_suppliers SET preferred = 0, updated_at = ? WHERE company_id = ? AND product_id = ? AND supplier_id <> ? AND preferred = 1').bind(t, a.companyId, p.id, s.id));
  stmts.push(
    db
      .prepare(
        `INSERT INTO erp_product_suppliers (company_id, product_id, supplier_id, supplier_part_number, price_cents, currency, lead_time_days, moq, preferred, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(company_id, product_id, supplier_id) DO UPDATE SET supplier_part_number = excluded.supplier_part_number, price_cents = excluded.price_cents, currency = excluded.currency,
           lead_time_days = excluded.lead_time_days, moq = excluded.moq, preferred = excluded.preferred, notes = excluded.notes, updated_at = excluded.updated_at`,
      )
      .bind(a.companyId, p.id, s.id, next.supplier_part_number, next.price_cents, next.currency, next.lead_time_days, next.moq, next.preferred, next.notes, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: old ? 'product.supplier_changed' : 'product.supplier_added', entityType: 'product', entityId: p.id, productId: p.id, summary: `${s.number} ${s.legal_name} ${old ? 'changed as' : 'added as'} a supplier of ${p.number}`, before: old ?? undefined, after: next, at: t }),
  );
  await db.batch(stmts);
  const row = await db
    .prepare('SELECT ps.*, s.number AS supplier_number, s.legal_name, s.trading_name, s.status AS supplier_status FROM erp_product_suppliers ps JOIN erp_suppliers s ON s.company_id = ps.company_id AND s.id = ps.supplier_id WHERE ps.company_id = ? AND ps.product_id = ? AND ps.supplier_id = ?')
    .bind(a.companyId, p.id, s.id)
    .first<any>();
  return c.json(productSupplierDTO(row));
});

productRoutes.delete('/c/:company/products/:id/suppliers/:supplierId', async (c) => {
  const a = await requireErp(c, 'product_suppliers.edit');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  const supplierId = zId.parse(c.req.param('supplierId'));
  const old = await db.prepare('SELECT 1 FROM erp_product_suppliers WHERE company_id = ? AND product_id = ? AND supplier_id = ?').bind(a.companyId, p.id, supplierId).first();
  if (!old) throw notFound('Product supplier');
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM erp_product_suppliers WHERE company_id = ? AND product_id = ? AND supplier_id = ?').bind(a.companyId, p.id, supplierId),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'product.supplier_removed', entityType: 'product', entityId: p.id, productId: p.id, summary: `A supplier was removed from ${p.number}`, before: { supplierId }, at: t }),
  ]);
  return c.json({ ok: true });
});
