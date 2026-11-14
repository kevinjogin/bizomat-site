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
//   products.ts, engineering.ts, changes.ts, documents.ts, suppliers.ts, files.ts, reports.ts: the records

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

// ------------------------------------------------------------------ roles

const ROLE_HELP: Record<string, string> = {
  erp_admin: 'Everything, including ERP roles',
  executive: 'Reads every product, change, document, supplier and report',
  engineer: 'Products, variants, bills of materials, revisions, change requests and draft change orders, documents',
  engineering_approver: 'Approves and releases change orders and approves documents, and does an engineer’s work',
  buyer: 'Suppliers, their contacts and the prices products are bought at',
  procurement_manager: 'Approves, holds and blocks suppliers, and does a buyer’s work',
  viewer: 'Reads products, engineering records and suppliers',
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
    db.prepare('DELETE FROM erp_user_roles WHERE company_id = ? AND user_id = ?').bind(a.companyId, target.id),
    ...roles.map((r) => db.prepare('INSERT INTO erp_user_roles (company_id, user_id, role, set_by, set_at) VALUES (?, ?, ?, ?, ?)').bind(a.companyId, target.id, r, a.userId, t)),
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
