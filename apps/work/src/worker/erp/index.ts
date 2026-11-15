// BIZOMAT ERP, Release 1 (owner's brief "BIZOMAT ERP — full enterprise functionality", 14 Nov 2026): Products and
// Engineering (product master, variants, revisions, change requests and change orders, multi-level bills of materials,
// engineering documents) and the supplier master. The API under /api/erp (signed in), mounted by src/worker/app.ts: the
// same Worker, database, file store, accounts and session as the rest of the ERP. Tables:
// migrations/0020_erp_engineering_procurement.sql. Who may do what: access.ts. Docs: docs/erp/release-1.md.
//
//   GET  /c/:company/me                       the caller's ERP roles and what they may do
//   GET  /c/:company/overview                 counts for the Products and Engineering hub
//   GET  /c/:company/roles, PUT /roles/:user  ERP roles (ERP administrators)
//   GET  /c/:company/events                   the company's ERP history (ERP administrators and executives)
//   GET  /c/:company/operations           counts for the Operations hub (purchasing and inventory)
//   products.ts, engineering.ts, changes.ts, documents.ts, suppliers.ts, files.ts, reports.ts: the records (Release 1)
//   settings.ts, procurement.ts, purchasing.ts, record-files.ts, inventory.ts, stock-reports.ts: Release 2
//   manufacturing.ts, production.ts, planning.ts, mfg-reports.ts: Release 3 (manufacturing)
//   quality.ts, ncr.ts, quality-reports.ts: Release 4 part A (quality)

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, now } from '../lib/util';
import { CAPABILITIES, ERP_ROLES, ROLE_LABELS, can, capabilities, companyPeople, requireErp } from './access';
import { eventDTO, eventStmt } from './util';
import { productRoutes } from './products';
import { engineeringRoutes } from './engineering';
import { changeRoutes } from './changes';
import { documentRoutes } from './documents';
import { supplierRoutes } from './suppliers';
import { fileRoutes } from './files';
import { reportRoutes } from './reports';
import { settingsRoutes } from './settings';
import { inventoryRoutes } from './inventory';
import { procurementRoutes } from './procurement';
import { purchasingRoutes } from './purchasing';
import { recordFileRoutes } from './record-files';
import { stockReportRoutes } from './stock-reports';
import { manufacturingRoutes } from './manufacturing';
import { productionRoutes } from './production';
import { planningRoutes } from './planning';
import { mfgReportRoutes } from './mfg-reports';
// Release 4 part A: quality
import { qualityRoutes, qualityCounts } from './quality';
import { ncrRoutes } from './ncr';
import { qualityReportRoutes } from './quality-reports';

export const erpRoutes = new Hono<AppEnv>();

erpRoutes.get('/c/:company/me', async (c) => {
  const a = await requireErp(c, 'products.view');
  return c.json({
    company: { id: a.companyId, name: a.companyName, kind: a.kind },
    user: { id: a.userId, name: a.userName },
    companyRole: a.companyRole,
    roles: a.roles,
    roleLabels: a.roles.map((r) => ROLE_LABELS[r]),
    solo: a.solo,
    can: capabilities(a),
  });
});

erpRoutes.get('/c/:company/overview', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const [p, eco, ecr, docs, sup] = await db.batch([
    db
      .prepare(
        `SELECT COUNT(*) AS total, SUM(CASE WHEN lifecycle = 'active' THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM erp_revisions r WHERE r.company_id = p.company_id AND r.product_id = p.id AND r.status = 'released') THEN 1 ELSE 0 END) AS unreleased
           FROM erp_products p WHERE p.company_id = ? AND p.archived_at IS NULL`,
      )
      .bind(a.companyId),
    db.prepare("SELECT SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft, SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS submitted, SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved FROM erp_change_orders WHERE company_id = ?").bind(a.companyId),
    db.prepare("SELECT SUM(CASE WHEN status IN ('submitted','under_review') THEN 1 ELSE 0 END) AS open FROM erp_change_requests WHERE company_id = ?").bind(a.companyId),
    db.prepare("SELECT SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft, COUNT(*) AS total FROM erp_documents WHERE company_id = ?").bind(a.companyId),
    db.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending, SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved FROM erp_suppliers WHERE company_id = ? AND archived_at IS NULL").bind(a.companyId),
  ]);
  const one = (r: D1Result) => (r.results[0] ?? {}) as Record<string, number | null>;
  return c.json({
    products: { total: one(p).total ?? 0, active: one(p).active ?? 0, unreleased: one(p).unreleased ?? 0 },
    changeOrders: { draft: one(eco).draft ?? 0, submitted: one(eco).submitted ?? 0, approved: one(eco).approved ?? 0 },
    changeRequests: { open: one(ecr).open ?? 0 },
    documents: { total: one(docs).total ?? 0, draft: one(docs).draft ?? 0 },
    suppliers: can(a, 'suppliers.view') ? { total: one(sup).total ?? 0, pending: one(sup).pending ?? 0, approved: one(sup).approved ?? 0 } : null,
  });
});

erpRoutes.get('/c/:company/operations', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const today = new Date().toISOString().slice(0, 10);
  const [req, rfq, po, rec, low, adj, cnt, wh, mo, insp, mrp] = await db.batch([
    db.prepare("SELECT SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS submitted, SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved, SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft FROM erp_requisitions WHERE company_id = ?").bind(a.companyId),
    db.prepare("SELECT SUM(CASE WHEN status IN ('draft','sent') THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN status = 'awarded' THEN 1 ELSE 0 END) AS awarded FROM erp_rfqs WHERE company_id = ?").bind(a.companyId),
    db.prepare("SELECT SUM(CASE WHEN status = 'awaiting_approval' THEN 1 ELSE 0 END) AS awaiting, SUM(CASE WHEN status IN ('approved','sent','partially_received') THEN 1 ELSE 0 END) AS to_receive, SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft FROM erp_purchase_orders WHERE company_id = ?").bind(a.companyId),
    db.prepare('SELECT COUNT(*) AS n, SUM(CASE WHEN inspection_required = 1 THEN 1 ELSE 0 END) AS inspection FROM erp_receipts WHERE company_id = ? AND created_at >= ?').bind(a.companyId, Date.now() - 30 * 86_400_000),
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM erp_product_stock ps WHERE ps.company_id = ? AND ps.reorder_point IS NOT NULL AND
           (SELECT COALESCE(SUM(s.on_hand - s.reserved), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = ps.company_id AND s.product_id = ps.product_id AND l.kind <> 'quarantine')
           + (SELECT COALESCE(SUM(pl.quantity - pl.received_qty), 0) FROM erp_po_lines pl JOIN erp_purchase_orders o ON o.company_id = pl.company_id AND o.id = pl.po_id WHERE pl.company_id = ps.company_id AND pl.product_id = ps.product_id AND o.status IN ('approved','sent','partially_received')) <= ps.reorder_point`,
      )
      .bind(a.companyId),
    db.prepare("SELECT COUNT(*) AS n FROM erp_adjustments WHERE company_id = ? AND status = 'pending'").bind(a.companyId),
    db.prepare("SELECT SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS submitted FROM erp_counts WHERE company_id = ?").bind(a.companyId),
    db.prepare('SELECT (SELECT COUNT(*) FROM erp_warehouses WHERE company_id = ?1 AND archived_at IS NULL) AS warehouses, (SELECT COALESCE(SUM(value_cents), 0) FROM erp_valuation WHERE company_id = ?1) AS value').bind(a.companyId),
    // Release 3: manufacturing orders, outstanding inspections and the latest MRP run's open suggestions
    db
      .prepare(
        `SELECT SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft, SUM(CASE WHEN status = 'released' THEN 1 ELSE 0 END) AS released, SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN status IN ('draft','released','in_progress') AND required_date IS NOT NULL AND (required_date < ?2 OR finish_date > required_date) THEN 1 ELSE 0 END) AS late
           FROM erp_mfg_orders WHERE company_id = ?1`,
      )
      .bind(a.companyId, today),
    db.prepare("SELECT COUNT(*) AS n FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id WHERE o.company_id = ? AND o.inspection = 1 AND o.inspection_result IS NULL AND o.status IN ('in_progress','paused') AND mo.status IN ('released','in_progress')").bind(a.companyId),
    db
      .prepare(
        `SELECT SUM(CASE WHEN s.kind = 'make' THEN 1 ELSE 0 END) AS make, SUM(CASE WHEN s.kind = 'buy' THEN 1 ELSE 0 END) AS buy, SUM(CASE WHEN s.kind = 'expedite' THEN 1 ELSE 0 END) AS expedite
           FROM erp_mrp_suggestions s WHERE s.company_id = ?1 AND s.status = 'open' AND s.run_id = (SELECT id FROM erp_mrp_runs WHERE company_id = ?1 ORDER BY created_at DESC, rowid DESC LIMIT 1)`,
      )
      .bind(a.companyId),
  ]);
  const one = (r: D1Result) => (r.results[0] ?? {}) as Record<string, number | null>;
  // Release 4 part A: inspections waiting, failed, nonconformances and corrective actions (quality.ts)
  const quality = await qualityCounts(db, a.companyId);
  return c.json({
    quality,
    requisitions: { draft: one(req).draft ?? 0, submitted: one(req).submitted ?? 0, approved: one(req).approved ?? 0 },
    rfqs: { open: one(rfq).open ?? 0, awarded: one(rfq).awarded ?? 0 },
    purchaseOrders: { draft: one(po).draft ?? 0, awaitingApproval: one(po).awaiting ?? 0, toReceive: one(po).to_receive ?? 0 },
    receipts: { last30Days: one(rec).n ?? 0, inspection: one(rec).inspection ?? 0 },
    stock: { belowReorder: one(low).n ?? 0, pendingAdjustments: one(adj).n ?? 0, openCounts: one(cnt).open ?? 0, countsToApprove: one(cnt).submitted ?? 0, warehouses: one(wh).warehouses ?? 0, valueCents: one(wh).value ?? 0 },
    manufacturing: {
      draft: one(mo).draft ?? 0,
      released: one(mo).released ?? 0,
      inProgress: one(mo).in_progress ?? 0,
      toClose: one(mo).completed ?? 0,
      late: one(mo).late ?? 0,
      inspections: one(insp).n ?? 0,
      suggestions: { make: one(mrp).make ?? 0, buy: one(mrp).buy ?? 0, expedite: one(mrp).expedite ?? 0 },
    },
    can: capabilities(a),
  });
});

// ------------------------------------------------------------------ roles

const ROLE_HELP: Record<string, string> = {
  erp_admin: 'Everything, including ERP roles',
  executive: 'Reads every product, change, document, supplier and report',
  engineer: 'Products, variants, bills of materials, revisions, change requests and draft change orders, documents',
  engineering_approver: 'Approves and releases change orders and approves documents, and does an engineer’s work',
  buyer: 'Suppliers and their prices, requests for quotation, quotations and purchase orders',
  procurement_manager: 'Approves requisitions, quotation choices, purchase orders over the limit and suppliers, and does a buyer’s work',
  warehouse_manager: 'Warehouses and locations, stock settings, approves adjustments and counts, and does an operator’s work',
  warehouse_operator: 'Receives goods; issues, transfers, reserves, returns, quarantines and counts stock; issues materials to manufacturing orders',
  production_manager: 'Work centres, machines and routings; plans, releases, completes and closes manufacturing orders; the master production schedule and MRP; and does an operator’s work',
  production_operator: 'Runs operations on the shop floor: start, stop, time, output, scrap, rework, downtime and inspections; issues materials and receives finished goods',
  quality_manager: 'Inspection plans and their release, inspections, nonconformance dispositions, verification and closure; approves and closes corrective actions',
  quality_inspector: 'Records inspections with readings and photos, puts failed lots into quarantine, raises nonconformances and proposes corrective actions',
  viewer: 'Reads products, engineering records, suppliers, purchasing, stock, manufacturing and quality',
};

erpRoutes.get('/c/:company/roles', async (c) => {
  const a = await requireErp(c, 'roles.manage');
  return c.json({
    kind: a.kind,
    roles: ERP_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r], help: ROLE_HELP[r] })),
    matrix: Object.fromEntries(Object.entries(CAPABILITIES).map(([k, v]) => [k, ['erp_admin', ...v]])),
    people: await companyPeople(c.env.DB, a),
  });
});

erpRoutes.put('/c/:company/roles/:userId', async (c) => {
  const a = await requireErp(c, 'roles.manage');
  if (a.kind !== 'registered') throw new HttpError(400, 'Only a registered company has other people to give roles to');
  const input = await body(c, z.object({ roles: z.array(z.enum(ERP_ROLES)).max(ERP_ROLES.length) }));
  const people = await companyPeople(c.env.DB, a);
  const target = people.find((p) => p.id === c.req.param('userId'));
  if (!target) throw new HttpError(404, 'Person not found');
  if (target.companyRole !== 'member') throw new HttpError(400, 'The company’s owner and administrators are always ERP administrators');
  const roles = [...new Set(input.roles)];
  const t = now();
  const db = c.env.DB;
  await db.batch([
    // Release 2 keeps every role in erp_role_grants (erp_user_roles lists Release 1's roles in a CHECK); both are read.
    db.prepare('DELETE FROM erp_user_roles WHERE company_id = ? AND user_id = ?').bind(a.companyId, target.id),
    db.prepare('DELETE FROM erp_role_grants WHERE company_id = ? AND user_id = ?').bind(a.companyId, target.id),
    ...roles.map((r) => db.prepare('INSERT INTO erp_role_grants (company_id, user_id, role, set_by, set_at) VALUES (?, ?, ?, ?, ?)').bind(a.companyId, target.id, r, a.userId, t)),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'role.changed',
      entityType: 'role',
      entityId: target.id,
      summary: `${target.name}: ERP roles ${roles.length ? roles.map((r) => ROLE_LABELS[r]).join(', ') : 'back to the default (viewer)'}`,
      before: { roles: target.rolesAreDefault ? ['default'] : target.roles },
      after: { roles: roles.length ? roles : ['default'] },
      at: t,
    }),
  ]);
  return c.json((await companyPeople(db, a)).find((p) => p.id === target.id));
});

erpRoutes.get('/c/:company/events', async (c) => {
  const a = await requireErp(c, 'products.view');
  if (!a.roles.includes('erp_admin') && !a.roles.includes('executive')) throw new HttpError(403, 'Only ERP administrators and executives can read the whole history');
  const before = Number(c.req.query('before')) || Number.MAX_SAFE_INTEGER;
  const rows = await c.env.DB.prepare('SELECT e.*, u.name AS actor_name FROM erp_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.company_id = ? AND e.created_at < ? ORDER BY e.created_at DESC, e.rowid DESC LIMIT 100')
    .bind(a.companyId, before)
    .all<any>();
  return c.json({ events: rows.results.map(eventDTO) });
});

erpRoutes.route('/', productRoutes);
erpRoutes.route('/', engineeringRoutes);
erpRoutes.route('/', changeRoutes);
erpRoutes.route('/', documentRoutes);
erpRoutes.route('/', supplierRoutes);
erpRoutes.route('/', fileRoutes);
erpRoutes.route('/', reportRoutes);
// Release 2: purchasing and inventory
erpRoutes.route('/', settingsRoutes);
erpRoutes.route('/', procurementRoutes);
erpRoutes.route('/', purchasingRoutes);
erpRoutes.route('/', recordFileRoutes);
erpRoutes.route('/', inventoryRoutes);
erpRoutes.route('/', stockReportRoutes);
// Release 3: manufacturing
erpRoutes.route('/', manufacturingRoutes);
erpRoutes.route('/', productionRoutes);
erpRoutes.route('/', planningRoutes);
erpRoutes.route('/', mfgReportRoutes);
// Release 4 part A: quality
erpRoutes.route('/', qualityRoutes);
erpRoutes.route('/', ncrRoutes);
erpRoutes.route('/', qualityReportRoutes);
