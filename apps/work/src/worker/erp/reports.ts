// BIZOMAT ERP, Release 1 reports (/api/erp/c/:company/reports/...): product catalogue, lifecycle, bill of materials
// cost, where-used, revisions and changes, and suppliers. Each filters, lists the records behind its numbers (the screen
// links each row to its record) and exports CSV (?format=csv). Numbers come only from the company's own records.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { can, requireErp } from './access';
import { LIFECYCLE, PRODUCT_TYPES, SUPPLIER_STATUS, TYPE_LABELS, csvResponse, dollars, likeOf, validDate, wantsCsv } from './util';
import { rollUp } from './engineering';
import { SUPPLIER_LABELS } from './suppliers';

export const reportRoutes = new Hono<AppEnv>();

const LIFECYCLE_LABELS: Record<(typeof LIFECYCLE)[number], string> = { draft: 'Draft', active: 'Active', phased_out: 'Phased out', obsolete: 'Obsolete' };
const typeLabel = (t: string) => TYPE_LABELS[t as keyof typeof TYPE_LABELS] ?? t;
const day = (ms: number | null | undefined) => (ms ? new Date(ms).toISOString().slice(0, 10) : '');

/** The product filters every product report shares: type, lifecycle, category, text; archived products are left out. */
function productFilter(c: any, alias = 'p') {
  const where = [`${alias}.company_id = ?`, `${alias}.archived_at IS NULL`];
  const args: unknown[] = [];
  const type = c.req.query('type');
  if (type && (PRODUCT_TYPES as readonly string[]).includes(type)) {
    where.push(`${alias}.type = ?`);
    args.push(type);
  }
  const lifecycle = c.req.query('lifecycle');
  if (lifecycle && (LIFECYCLE as readonly string[]).includes(lifecycle)) {
    where.push(`${alias}.lifecycle = ?`);
    args.push(lifecycle);
  }
  const category = c.req.query('category');
  if (category) {
    where.push(`${alias}.category = ?`);
    args.push(String(category).slice(0, 80));
  }
  const q = c.req.query('q');
  if (q?.trim()) {
    where.push(`${alias}.search LIKE ?`);
    args.push(likeOf(q));
  }
  return { where, args };
}

reportRoutes.get('/c/:company/reports/catalogue', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const f = productFilter(c);
  const args = [a.companyId, ...f.args];
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.sku, p.name, p.type, p.category, p.lifecycle, p.uom, p.standard_cost_cents, p.price_cents, p.currency, p.variant_of,
              (SELECT r.label FROM erp_revisions r WHERE r.company_id = p.company_id AND r.product_id = p.id AND r.status = 'released') AS released,
              (SELECT COUNT(*) FROM erp_product_suppliers x WHERE x.company_id = p.company_id AND x.product_id = p.id) AS suppliers
         FROM erp_products p WHERE ${f.where.join(' AND ')} ORDER BY p.number COLLATE NOCASE LIMIT 5000`,
    )
    .bind(...args)
    .all<any>();
  if (wantsCsv(c)) {
    return csvResponse('product-catalogue', [
      ['Number', 'SKU', 'Name', 'Type', 'Category', 'Lifecycle', 'Unit', 'Released revision', 'Standard cost', 'Price', 'Currency', 'Variant', 'Suppliers'],
      ...rows.results.map((p) => [p.number, p.sku ?? '', p.name, typeLabel(p.type), p.category, LIFECYCLE_LABELS[p.lifecycle as keyof typeof LIFECYCLE_LABELS], p.uom, p.released ?? '', dollars(p.standard_cost_cents), dollars(p.price_cents), p.currency, p.variant_of ? 'yes' : '', p.suppliers]),
    ]);
  }
  const count = (key: string) => {
    const m = new Map<string, number>();
    for (const p of rows.results) m.set(p[key] || '', (m.get(p[key] || '') ?? 0) + 1);
    return [...m.entries()].sort((x, y) => y[1] - x[1]).map(([value, n]) => ({ value, n }));
  };
  return c.json({
    total: rows.results.length,
    byType: count('type').map((x) => ({ ...x, label: typeLabel(x.value) })),
    byCategory: count('category').map((x) => ({ ...x, label: x.value || 'No category' })),
    withoutRelease: rows.results.filter((p) => !p.released).length,
    withoutCost: rows.results.filter((p) => p.standard_cost_cents === null).length,
    rows: rows.results.slice(0, 500).map((p) => ({ id: p.id, number: p.number, sku: p.sku, name: p.name, type: p.type, typeLabel: typeLabel(p.type), category: p.category, lifecycle: p.lifecycle, released: p.released, standardCostCents: p.standard_cost_cents, priceCents: p.price_cents, currency: p.currency, isVariant: !!p.variant_of, suppliers: p.suppliers })),
    truncated: rows.results.length > 500,
  });
});

reportRoutes.get('/c/:company/reports/lifecycle', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const f = productFilter(c);
  const rows = await db
    .prepare(`SELECT p.id, p.number, p.name, p.type, p.lifecycle, p.effective_from, p.effective_to, p.updated_at FROM erp_products p WHERE ${f.where.join(' AND ')} ORDER BY p.lifecycle, p.number COLLATE NOCASE LIMIT 5000`)
    .bind(a.companyId, ...f.args)
    .all<any>();
  // Products whose effective end date falls in the next 90 days (or has passed while still active).
  const today = new Date().toISOString().slice(0, 10);
  const soon = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  const ending = rows.results.filter((p) => p.effective_to && p.effective_to <= soon && (p.lifecycle === 'active' || p.lifecycle === 'draft'));
  if (wantsCsv(c)) {
    return csvResponse('product-lifecycle', [['Number', 'Name', 'Type', 'Lifecycle', 'Effective from', 'Effective to', 'Last changed'], ...rows.results.map((p) => [p.number, p.name, typeLabel(p.type), LIFECYCLE_LABELS[p.lifecycle as keyof typeof LIFECYCLE_LABELS], p.effective_from ?? '', p.effective_to ?? '', day(p.updated_at)])]);
  }
  return c.json({
    stages: LIFECYCLE.map((l) => ({ value: l, label: LIFECYCLE_LABELS[l], n: rows.results.filter((p) => p.lifecycle === l).length })),
    ending: ending.map((p) => ({ id: p.id, number: p.number, name: p.name, lifecycle: p.lifecycle, effectiveTo: p.effective_to, passed: p.effective_to < today })),
    rows: rows.results.slice(0, 500).map((p) => ({ id: p.id, number: p.number, name: p.name, typeLabel: typeLabel(p.type), lifecycle: p.lifecycle, lifecycleLabel: LIFECYCLE_LABELS[p.lifecycle as keyof typeof LIFECYCLE_LABELS], effectiveFrom: p.effective_from, effectiveTo: p.effective_to, updatedAt: p.updated_at })),
    truncated: rows.results.length > 500,
  });
});

reportRoutes.get('/c/:company/reports/bom-cost', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const f = productFilter(c);
  // Products with a released bill of materials (at most 200 a report: the roll-up reads every level).
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.type, p.currency, p.standard_cost_cents, p.price_cents, r.id AS revision_id, r.label
         FROM erp_products p JOIN erp_revisions r ON r.company_id = p.company_id AND r.product_id = p.id AND r.status = 'released'
        WHERE ${f.where.join(' AND ')} AND EXISTS (SELECT 1 FROM erp_bom_lines l WHERE l.company_id = r.company_id AND l.revision_id = r.id)
        ORDER BY p.number COLLATE NOCASE LIMIT 201`,
    )
    .bind(a.companyId, ...f.args)
    .all<any>();
  const out = [];
  for (const p of rows.results.slice(0, 200)) {
    const cost = await rollUp(db, a.companyId, p.revision_id, p.currency);
    out.push({
      id: p.id,
      number: p.number,
      name: p.name,
      typeLabel: typeLabel(p.type),
      revision: p.label,
      revisionId: p.revision_id,
      currency: p.currency,
      rolledUpCents: cost.unitCostCents,
      complete: cost.complete,
      missing: cost.missing,
      mixedCurrency: cost.mixedCurrency,
      standardCostCents: p.standard_cost_cents,
      priceCents: p.price_cents,
      marginCents: cost.complete && cost.unitCostCents !== null && p.price_cents !== null ? p.price_cents - cost.unitCostCents : null,
    });
  }
  if (wantsCsv(c)) {
    return csvResponse('bom-cost', [
      ['Number', 'Name', 'Type', 'Revision', 'Rolled-up cost', 'Complete', 'Missing costs', 'Other currencies', 'Standard cost', 'Price', 'Margin', 'Currency'],
      ...out.map((p) => [p.number, p.name, p.typeLabel, p.revision, dollars(p.rolledUpCents), p.complete ? 'yes' : 'no', p.missing.join(' '), p.mixedCurrency.join(' '), dollars(p.standardCostCents), dollars(p.priceCents), dollars(p.marginCents), p.currency]),
    ]);
  }
  return c.json({ rows: out, truncated: rows.results.length > 200, incomplete: out.filter((p) => !p.complete).length });
});

reportRoutes.get('/c/:company/reports/where-used', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const f = productFilter(c, 'p');
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.type,
              COUNT(DISTINCT CASE WHEN r.status = 'released' THEN r.product_id END) AS released_parents,
              COUNT(DISTINCT CASE WHEN r.status IN ('draft','in_change') THEN r.product_id END) AS open_parents,
              group_concat(DISTINCT CASE WHEN r.status = 'released' THEN pp.number END) AS parent_numbers
         FROM erp_products p JOIN erp_bom_lines l ON l.company_id = p.company_id AND l.component_id = p.id
         JOIN erp_revisions r ON r.company_id = l.company_id AND r.id = l.revision_id AND r.status IN ('draft','in_change','released')
         JOIN erp_products pp ON pp.company_id = r.company_id AND pp.id = r.product_id
        WHERE ${f.where.join(' AND ')} GROUP BY p.id ORDER BY released_parents DESC, p.number COLLATE NOCASE LIMIT 2000`,
    )
    .bind(a.companyId, ...f.args)
    .all<any>();
  const unused = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM erp_products p WHERE ${f.where.join(' AND ')} AND p.type IN ('raw_material','component','purchased_item','consumable','manufactured_part','subassembly')
          AND NOT EXISTS (SELECT 1 FROM erp_bom_lines l WHERE l.company_id = p.company_id AND l.component_id = p.id)`,
    )
    .bind(a.companyId, ...f.args)
    .first<{ n: number }>();
  if (wantsCsv(c)) {
    return csvResponse('where-used', [['Number', 'Name', 'Type', 'Used in released products', 'Used in open revisions', 'Released parents'], ...rows.results.map((p) => [p.number, p.name, typeLabel(p.type), p.released_parents, p.open_parents, String(p.parent_numbers ?? '').split(',').filter(Boolean).join(' ')])]);
  }
  return c.json({
    rows: rows.results.map((p) => ({ id: p.id, number: p.number, name: p.name, typeLabel: typeLabel(p.type), releasedParents: p.released_parents, openParents: p.open_parents, parentNumbers: String(p.parent_numbers ?? '').split(',').filter(Boolean) })),
    unusedParts: unused?.n ?? 0,
  });
});

reportRoutes.get('/c/:company/reports/changes', async (c) => {
  const a = await requireErp(c, 'reports.view');
  const db = c.env.DB;
  const where = ['o.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status && ['draft', 'submitted', 'approved', 'released', 'cancelled'].includes(status)) {
    where.push('o.status = ?');
    args.push(status);
  }
  const from = c.req.query('from');
  if (from && validDate(from)) {
    where.push('o.created_at >= ?');
    args.push(Date.parse(`${from}T00:00:00Z`));
  }
  const to = c.req.query('to');
  if (to && validDate(to)) {
    where.push('o.created_at < ?');
    args.push(Date.parse(`${to}T00:00:00Z`) + 86400000);
  }
  const rows = await db
    .prepare(
      `SELECT o.id, o.number, o.title, o.status, o.created_at, o.submitted_at, o.approved_at, o.released_at, o.sod_exception, q.number AS request_number,
              cu.name AS created_by_name, au.name AS approved_by_name, ru.name AS released_by_name,
              (SELECT group_concat(p.number || ' ' || r.label, ', ') FROM erp_revisions r JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id WHERE r.company_id = o.company_id AND r.eco_id = o.id) AS revisions
         FROM erp_change_orders o LEFT JOIN erp_change_requests q ON q.company_id = o.company_id AND q.id = o.request_id
         LEFT JOIN users cu ON cu.id = o.created_by LEFT JOIN users au ON au.id = o.approved_by LEFT JOIN users ru ON ru.id = o.released_by
        WHERE ${where.join(' AND ')} ORDER BY o.created_at DESC LIMIT 5000`,
    )
    .bind(...args)
    .all<any>();
  const requests = await db.prepare('SELECT status, COUNT(*) AS n FROM erp_change_requests WHERE company_id = ? GROUP BY status').bind(a.companyId).all<{ status: string; n: number }>();
  const revisions = await db.prepare('SELECT status, COUNT(*) AS n FROM erp_revisions WHERE company_id = ? GROUP BY status').bind(a.companyId).all<{ status: string; n: number }>();
  // Days from submission to release, for change orders released in the period.
  const released = rows.results.filter((o) => o.released_at && o.submitted_at);
  const avgDays = released.length ? Math.round((released.reduce((s, o) => s + (o.released_at - o.submitted_at), 0) / released.length / 86400000) * 10) / 10 : null;
  if (wantsCsv(c)) {
    return csvResponse('revisions-and-changes', [
      ['Change order', 'Title', 'Status', 'Change request', 'Revisions', 'Drafted by', 'Drafted', 'Approved by', 'Approved', 'Released by', 'Released', 'Recorded exception'],
      ...rows.results.map((o) => [o.number, o.title, o.status, o.request_number ?? '', o.revisions ?? '', o.created_by_name ?? '', day(o.created_at), o.approved_by_name ?? '', day(o.approved_at), o.released_by_name ?? '', day(o.released_at), o.sod_exception ? 'one-person company' : '']),
    ]);
  }
  return c.json({
    requests: Object.fromEntries(requests.results.map((r) => [r.status, r.n])),
    revisions: Object.fromEntries(revisions.results.map((r) => [r.status, r.n])),
    averageDaysToRelease: avgDays,
    exceptions: rows.results.filter((o) => o.sod_exception).length,
    rows: rows.results.slice(0, 500).map((o) => ({ id: o.id, number: o.number, title: o.title, status: o.status, requestNumber: o.request_number, revisions: o.revisions ?? '', createdByName: o.created_by_name, approvedByName: o.approved_by_name, releasedByName: o.released_by_name, createdAt: o.created_at, releasedAt: o.released_at, sodException: !!o.sod_exception })),
  });
});

reportRoutes.get('/c/:company/reports/suppliers', async (c) => {
  const a = await requireErp(c, 'reports.view');
  if (!can(a, 'suppliers.view')) return c.json({ rows: [] });
  const db = c.env.DB;
  const where = ['s.company_id = ?', 's.archived_at IS NULL'];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status && (SUPPLIER_STATUS as readonly string[]).includes(status)) {
    where.push('s.status = ?');
    args.push(status);
  }
  const category = c.req.query('category');
  if (category) {
    where.push('s.category = ?');
    args.push(String(category).slice(0, 80));
  }
  const q = c.req.query('q');
  if (q?.trim()) {
    where.push('s.search LIKE ?');
    args.push(likeOf(q));
  }
  const rows = await db
    .prepare(
      `SELECT s.id, s.number, s.legal_name, s.trading_name, s.abn, s.category, s.status, s.currency, s.payment_terms_days, s.lead_time_days, s.fin_contact_id, s.sod_exception,
              (SELECT COUNT(*) FROM erp_product_suppliers x WHERE x.company_id = s.company_id AND x.supplier_id = s.id) AS products,
              (SELECT COUNT(*) FROM erp_product_suppliers x WHERE x.company_id = s.company_id AND x.supplier_id = s.id AND x.preferred = 1) AS preferred
         FROM erp_suppliers s WHERE ${where.join(' AND ')} ORDER BY s.number COLLATE NOCASE LIMIT 5000`,
    )
    .bind(...args)
    .all<any>();
  if (wantsCsv(c)) {
    return csvResponse('supplier-list', [
      ['Number', 'Legal name', 'Trading name', 'ABN', 'ABN check', 'Category', 'Status', 'Currency', 'Payment terms (days)', 'Lead time (days)', 'Products', 'Preferred for', 'Linked to Finance'],
      ...rows.results.map((s) => [s.number, s.legal_name, s.trading_name, s.abn, s.abn ? 'Format checked' : '', s.category, SUPPLIER_LABELS[s.status as keyof typeof SUPPLIER_LABELS], s.currency, s.payment_terms_days ?? '', s.lead_time_days ?? '', s.products, s.preferred, s.fin_contact_id ? 'yes' : '']),
    ]);
  }
  return c.json({
    byStatus: SUPPLIER_STATUS.map((st) => ({ value: st, label: SUPPLIER_LABELS[st], n: rows.results.filter((s) => s.status === st).length })),
    rows: rows.results.slice(0, 500).map((s) => ({ id: s.id, number: s.number, name: s.trading_name || s.legal_name, legalName: s.legal_name, category: s.category, status: s.status, statusLabel: SUPPLIER_LABELS[s.status as keyof typeof SUPPLIER_LABELS], products: s.products, preferred: s.preferred, financeLinked: !!s.fin_contact_id, leadTimeDays: s.lead_time_days, paymentTermsDays: s.payment_terms_days })),
    performance: 'Measured from goods receipts: see the supplier delivery performance report.',
  });
});
