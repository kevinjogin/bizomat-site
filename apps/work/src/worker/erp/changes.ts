// BIZOMAT ERP, Release 1: engineering change control (/api/erp/c/:company/...).
//
// A change request (ECR, ECR-0001) says what should change and why: submitted, under review, approved or rejected by
// an engineering approver. A change order (ECO, ECO-0001) carries the work: it holds one new revision per product
// (status in_change), is drafted by an engineer, submitted, approved and released by an engineering approver who is not
// the person who drafted it (segregation of duties; the exception for a one-person company is recorded). Releasing
// releases its revisions and supersedes each product's previous released revision in one transaction; a second release
// of the same change order at the same moment is refused (release_token).
//
// While a change order is a draft its revisions can change; once submitted they are locked. Sending it back ("return to
// draft") unlocks them; cancelling it returns them to plain drafts.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { assertCan, can, requireErp, segregation, type ErpAccess } from './access';
import { ECO_STATUS, ECR_STATUS, badState, csvResponse, eventStmt, eventStmtIf, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zId, zText } from './util';
import { loadProduct } from './products';
import { newRevisionStatements, revisionDTO } from './engineering';

export const changeRoutes = new Hono<AppEnv>();

const ECR_LABELS: Record<(typeof ECR_STATUS)[number], string> = { submitted: 'Submitted', under_review: 'Under review', approved: 'Approved', rejected: 'Rejected' };
const ECO_LABELS: Record<(typeof ECO_STATUS)[number], string> = { draft: 'Draft', submitted: 'Submitted', approved: 'Approved', released: 'Released', cancelled: 'Cancelled' };

// ------------------------------------------------------------------ change requests

function ecrDTO(r: any) {
  return {
    id: r.id,
    number: r.number,
    title: r.title,
    description: r.description,
    reason: r.reason,
    status: r.status,
    statusLabel: ECR_LABELS[r.status as keyof typeof ECR_LABELS] ?? r.status,
    requestedBy: r.requested_by,
    requestedByName: r.requested_by_name ?? null,
    decidedByName: r.decided_by_name ?? null,
    decidedAt: r.decided_at,
    decisionNote: r.decision_note,
    productCount: r.product_count ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function loadEcr(db: D1Database, companyId: string, id: string) {
  const r = await db
    .prepare(
      `SELECT r.*, u.name AS requested_by_name, d.name AS decided_by_name FROM erp_change_requests r
         LEFT JOIN users u ON u.id = r.requested_by LEFT JOIN users d ON d.id = r.decided_by WHERE r.company_id = ? AND r.id = ?`,
    )
    .bind(companyId, String(id).slice(0, 64))
    .first<any>();
  if (!r) throw notFound('Change request');
  return r;
}

async function productsOfEcr(db: D1Database, companyId: string, id: string) {
  const rows = await db
    .prepare('SELECT p.id, p.number, p.name, p.type FROM erp_change_request_products x JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id WHERE x.company_id = ? AND x.request_id = ? ORDER BY p.number COLLATE NOCASE')
    .bind(companyId, id)
    .all<{ id: string; number: string; name: string; type: string }>();
  return rows.results;
}

async function checkProducts(db: D1Database, companyId: string, ids: string[]) {
  const unique = [...new Set(ids)];
  if (!unique.length) return [];
  const rows = await db.prepare(`SELECT id, number FROM erp_products WHERE company_id = ? AND id IN (${unique.map(() => '?').join(',')})`).bind(companyId, ...unique).all<{ id: string; number: string }>();
  if (rows.results.length !== unique.length) throw notFound('Product');
  return rows.results;
}

changeRoutes.get('/c/:company/change-requests', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const where = ['r.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status && (ECR_STATUS as readonly string[]).includes(status)) {
    where.push('r.status = ?');
    args.push(status);
  } else if (status === 'open') where.push("r.status IN ('submitted','under_review')");
  const q = c.req.query('q');
  if (q?.trim()) {
    where.push('r.search LIKE ?');
    args.push(likeOf(q));
  }
  const product = c.req.query('productId');
  if (product) {
    where.push('EXISTS (SELECT 1 FROM erp_change_request_products x WHERE x.company_id = r.company_id AND x.request_id = r.id AND x.product_id = ?)');
    args.push(product.slice(0, 64));
  }
  const { limit, offset } = paging(c);
  const sql = `SELECT r.*, u.name AS requested_by_name, d.name AS decided_by_name,
                      (SELECT COUNT(*) FROM erp_change_request_products x WHERE x.company_id = r.company_id AND x.request_id = r.id) AS product_count
                 FROM erp_change_requests r LEFT JOIN users u ON u.id = r.requested_by LEFT JOIN users d ON d.id = r.decided_by
                WHERE ${where.join(' AND ')} ORDER BY r.created_at DESC, r.rowid DESC`;
  if (wantsCsv(c)) {
    const rows = await db.prepare(`${sql} LIMIT 10000`).bind(...args).all<any>();
    return csvResponse('change-requests', [['Number', 'Title', 'Status', 'Requested by', 'Products', 'Raised', 'Decided by', 'Decision note'], ...rows.results.map((r) => [r.number, r.title, ECR_LABELS[r.status as keyof typeof ECR_LABELS], r.requested_by_name ?? '', r.product_count, new Date(r.created_at).toISOString().slice(0, 10), r.decided_by_name ?? '', r.decision_note])]);
  }
  const [rows, total] = await Promise.all([
    db.prepare(`${sql} LIMIT ? OFFSET ?`).bind(...args, limit, offset).all<any>(),
    db.prepare(`SELECT COUNT(*) AS n FROM erp_change_requests r WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>(),
  ]);
  return c.json({ requests: rows.results.map(ecrDTO), total: total?.n ?? 0 });
});

changeRoutes.post('/c/:company/change-requests', async (c) => {
  const a = await requireErp(c, 'changes.raise');
  const db = c.env.DB;
  await rateLimit(db, `erp-write:${a.userId}`, 300, 60_000);
  const input = await body(c, z.object({ title: zText(200).min(1), description: zText(5000).optional(), reason: zText(2000).optional(), productIds: z.array(zId).max(100).optional() }));
  const products = await checkProducts(db, a.companyId, input.productIds ?? []);
  const id = newId();
  const t = now();
  const number = await nextNumber(db, a.companyId, 'change_request');
  await db.batch([
    db
      .prepare("INSERT INTO erp_change_requests (id, company_id, number, title, description, reason, status, requested_by, search, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'submitted', ?, ?, ?, ?)")
      .bind(id, a.companyId, number, input.title, input.description ?? '', input.reason ?? '', a.userId, searchText(number, input.title, input.description, ...products.map((p) => p.number)), t, t),
    ...products.map((p) => db.prepare('INSERT INTO erp_change_request_products (company_id, request_id, product_id) VALUES (?, ?, ?)').bind(a.companyId, id, p.id)),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'change_request.created', entityType: 'change_request', entityId: id, summary: `Change request ${number} raised: ${input.title}`, after: { title: input.title, products: products.map((p) => p.number) }, at: t }),
  ]);
  return c.json(ecrDTO(await loadEcr(db, a.companyId, id)), 201);
});

changeRoutes.get('/c/:company/change-requests/:id', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const r = await loadEcr(db, a.companyId, c.req.param('id'));
  const orders = await db.prepare('SELECT id, number, title, status FROM erp_change_orders WHERE company_id = ? AND request_id = ? ORDER BY created_at').bind(a.companyId, r.id).all<any>();
  const open = r.status === 'submitted' || r.status === 'under_review';
  return c.json({
    request: ecrDTO(r),
    products: await productsOfEcr(db, a.companyId, r.id),
    changeOrders: orders.results.map((o) => ({ id: o.id, number: o.number, title: o.title, status: o.status, statusLabel: ECO_LABELS[o.status as keyof typeof ECO_LABELS] })),
    history: await historyOf(db, a.companyId, { entityType: 'change_request', entityId: r.id }, 50),
    can: { review: open && r.status === 'submitted' && can(a, 'changes.review'), decide: open && can(a, 'changes.review'), raiseOrder: r.status === 'approved' && can(a, 'changes.raise') },
  });
});

changeRoutes.post('/c/:company/change-requests/:id/review', async (c) => {
  const a = await requireErp(c, 'changes.review');
  const db = c.env.DB;
  const r = await loadEcr(db, a.companyId, c.req.param('id'));
  if (r.status !== 'submitted') badState(`${r.number} is ${ECR_LABELS[r.status as keyof typeof ECR_LABELS].toLowerCase()}, not submitted`);
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_change_requests SET status = 'under_review', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'submitted'").bind(t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'change_request.review', entityType: 'change_request', entityId: r.id, summary: `${r.number} taken under review`, before: { status: 'submitted' }, after: { status: 'under_review' }, at: t }),
  ]);
  if (!res[0].meta.changes) badState(`${r.number} changed meanwhile: reload it`);
  return c.json(ecrDTO(await loadEcr(db, a.companyId, r.id)));
});

changeRoutes.post('/c/:company/change-requests/:id/decide', async (c) => {
  const a = await requireErp(c, 'changes.review');
  const db = c.env.DB;
  const r = await loadEcr(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ decision: z.enum(['approved', 'rejected']), note: zText(2000).optional() }));
  if (r.status !== 'submitted' && r.status !== 'under_review') badState(`${r.number} is already ${ECR_LABELS[r.status as keyof typeof ECR_LABELS].toLowerCase()}`);
  if (input.decision === 'rejected' && !input.note?.trim()) throw new HttpError(400, 'Say why the request is rejected');
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_change_requests SET status = ?, decided_by = ?, decided_at = ?, decision_note = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('submitted','under_review')").bind(input.decision, a.userId, t, input.note ?? '', t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `change_request.${input.decision}`, entityType: 'change_request', entityId: r.id, summary: `${r.number} ${input.decision}${input.note ? `: ${input.note}` : ''}`, before: { status: r.status }, after: { status: input.decision, note: input.note ?? '' }, at: t }),
  ]);
  if (!res[0].meta.changes) badState(`${r.number} changed meanwhile: reload it`);
  return c.json(ecrDTO(await loadEcr(db, a.companyId, r.id)));
});

// ------------------------------------------------------------------ change orders

function ecoDTO(o: any) {
  return {
    id: o.id,
    number: o.number,
    title: o.title,
    description: o.description,
    reason: o.reason,
    status: o.status,
    statusLabel: ECO_LABELS[o.status as keyof typeof ECO_LABELS] ?? o.status,
    requestId: o.request_id,
    requestNumber: o.request_number ?? null,
    createdBy: o.created_by,
    createdByName: o.created_by_name ?? null,
    submittedAt: o.submitted_at,
    approvedAt: o.approved_at,
    approvedByName: o.approved_by_name ?? null,
    releasedAt: o.released_at,
    releasedByName: o.released_by_name ?? null,
    cancelledAt: o.cancelled_at,
    decisionNote: o.decision_note,
    sodException: !!o.sod_exception,
    revisionCount: o.revision_count ?? undefined,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}

const ECO_SELECT = `SELECT o.*, q.number AS request_number, cu.name AS created_by_name, au.name AS approved_by_name, ru.name AS released_by_name,
       (SELECT COUNT(*) FROM erp_revisions x WHERE x.company_id = o.company_id AND x.eco_id = o.id) AS revision_count
  FROM erp_change_orders o
  LEFT JOIN erp_change_requests q ON q.company_id = o.company_id AND q.id = o.request_id
  LEFT JOIN users cu ON cu.id = o.created_by LEFT JOIN users au ON au.id = o.approved_by LEFT JOIN users ru ON ru.id = o.released_by`;

async function loadEco(db: D1Database, companyId: string, id: string) {
  const o = await db.prepare(`${ECO_SELECT} WHERE o.company_id = ? AND o.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!o) throw notFound('Change order');
  return o;
}

async function revisionsOfEco(db: D1Database, companyId: string, ecoId: string) {
  const rows = await db
    .prepare(
      `SELECT r.*, p.number AS product_number, p.name AS product_name, p.type AS product_type,
              (SELECT COUNT(*) FROM erp_bom_lines l WHERE l.company_id = r.company_id AND l.revision_id = r.id) AS line_count,
              (SELECT pr.id FROM erp_revisions pr WHERE pr.company_id = r.company_id AND pr.product_id = r.product_id AND pr.status = 'released' AND pr.id <> r.id) AS released_id,
              (SELECT pr.label FROM erp_revisions pr WHERE pr.company_id = r.company_id AND pr.product_id = r.product_id AND pr.status = 'released' AND pr.id <> r.id) AS released_label,
              (SELECT pr.id FROM erp_revisions pr WHERE pr.company_id = r.company_id AND pr.product_id = r.product_id AND pr.superseded_by = r.id) AS superseded_id,
              (SELECT pr.label FROM erp_revisions pr WHERE pr.company_id = r.company_id AND pr.product_id = r.product_id AND pr.superseded_by = r.id) AS superseded_label
         FROM erp_revisions r JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id
        WHERE r.company_id = ? AND r.eco_id = ? ORDER BY p.number COLLATE NOCASE`,
    )
    .bind(companyId, ecoId)
    .all<any>();
  return rows.results.map((r) => ({
    ...revisionDTO(r),
    productNumber: r.product_number,
    productName: r.product_name,
    productType: r.product_type,
    lineCount: r.line_count,
    // what the revision replaces (before release) or replaced (after), for "compare"
    previousId: r.released_id ?? r.superseded_id ?? null,
    previousLabel: r.released_label ?? r.superseded_label ?? null,
  }));
}

function ecoCan(a: ErpAccess, o: any) {
  const raise = can(a, 'changes.raise');
  const approve = can(a, 'changes.approve');
  const own = o.created_by === a.userId;
  return {
    edit: o.status === 'draft' && raise,
    submit: o.status === 'draft' && raise,
    approve: o.status === 'submitted' && approve && (!own || a.solo),
    returnToDraft: o.status === 'submitted' && approve,
    release: o.status === 'approved' && approve && (!own || a.solo),
    cancel: (o.status === 'draft' && raise) || ((o.status === 'submitted' || o.status === 'approved') && approve),
    // the reason the approve and release buttons are missing, for the screen
    segregation: own && !a.solo && approve && (o.status === 'submitted' || o.status === 'approved') ? 'You drafted this change order, so another engineering approver must approve and release it.' : null,
  };
}

changeRoutes.get('/c/:company/change-orders', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const where = ['o.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status && (ECO_STATUS as readonly string[]).includes(status)) {
    where.push('o.status = ?');
    args.push(status);
  } else if (status === 'open') where.push("o.status IN ('draft','submitted','approved')");
  const q = c.req.query('q');
  if (q?.trim()) {
    where.push('o.search LIKE ?');
    args.push(likeOf(q));
  }
  const product = c.req.query('productId');
  if (product) {
    where.push('EXISTS (SELECT 1 FROM erp_revisions x WHERE x.company_id = o.company_id AND x.eco_id = o.id AND x.product_id = ?)');
    args.push(product.slice(0, 64));
  }
  const { limit, offset } = paging(c);
  const sql = `${ECO_SELECT} WHERE ${where.join(' AND ')} ORDER BY o.created_at DESC, o.rowid DESC`;
  if (wantsCsv(c)) {
    const rows = await db.prepare(`${sql} LIMIT 10000`).bind(...args).all<any>();
    return csvResponse('change-orders', [
      ['Number', 'Title', 'Status', 'Change request', 'Revisions', 'Drafted by', 'Approved by', 'Released by', 'Released', 'Recorded exception'],
      ...rows.results.map((o) => [o.number, o.title, ECO_LABELS[o.status as keyof typeof ECO_LABELS], o.request_number ?? '', o.revision_count, o.created_by_name ?? '', o.approved_by_name ?? '', o.released_by_name ?? '', o.released_at ? new Date(o.released_at).toISOString().slice(0, 10) : '', o.sod_exception ? 'one-person company' : '']),
    ]);
  }
  const [rows, total] = await Promise.all([db.prepare(`${sql} LIMIT ? OFFSET ?`).bind(...args, limit, offset).all<any>(), db.prepare(`SELECT COUNT(*) AS n FROM erp_change_orders o WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>()]);
  return c.json({ orders: rows.results.map(ecoDTO), total: total?.n ?? 0 });
});

/** Statements that put one product into a draft change order: its open draft revision, else a new one. */
async function addProductStatements(db: D1Database, a: ErpAccess, eco: { id: string; number: string }, productId: string) {
  const p = await loadProduct(db, a.companyId, productId);
  const open = await db
    .prepare(
      `SELECT r.id, r.label, r.status, r.eco_id, o.number AS eco_number FROM erp_revisions r LEFT JOIN erp_change_orders o ON o.company_id = r.company_id AND o.id = r.eco_id
        WHERE r.company_id = ? AND r.product_id = ? AND r.status IN ('draft','in_change')`,
    )
    .bind(a.companyId, p.id)
    .first<{ id: string; label: string; status: string; eco_id: string | null; eco_number: string | null }>();
  const t = now();
  if (open) {
    if (open.eco_id === eco.id) badState(`${p.number} is already in ${eco.number}`);
    if (open.eco_id) badState(`${p.number} revision ${open.label} is already in change order ${open.eco_number}`);
    return {
      label: open.label,
      stmts: [
        db.prepare("UPDATE erp_revisions SET status = 'in_change', eco_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft' AND eco_id IS NULL").bind(eco.id, t, a.companyId, open.id),
        eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'revision.in_change', entityType: 'revision', entityId: open.id, productId: p.id, summary: `Revision ${open.label} of ${p.number} added to change order ${eco.number}`, before: { status: 'draft' }, after: { status: 'in_change', changeOrder: eco.number }, at: t }),
      ],
    };
  }
  const made = await newRevisionStatements(db, a, p, { eco });
  return { label: made.label, stmts: made.stmts };
}

changeRoutes.post('/c/:company/change-orders', async (c) => {
  const a = await requireErp(c, 'changes.raise');
  const db = c.env.DB;
  await rateLimit(db, `erp-write:${a.userId}`, 300, 60_000);
  const input = await body(c, z.object({ title: zText(200).min(1), description: zText(5000).optional(), reason: zText(2000).optional(), requestId: zId.optional(), productIds: z.array(zId).max(100).optional() }));
  let productIds = input.productIds;
  let req: any = null;
  if (input.requestId) {
    req = await loadEcr(db, a.companyId, input.requestId);
    if (req.status !== 'approved') badState(`${req.number} is ${ECR_LABELS[req.status as keyof typeof ECR_LABELS].toLowerCase()}: only an approved change request becomes a change order`);
    if (!productIds) productIds = (await productsOfEcr(db, a.companyId, req.id)).map((p) => p.id);
  }
  const id = newId();
  const t = now();
  const number = await nextNumber(db, a.companyId, 'change_order');
  const eco = { id, number };
  const stmts: D1PreparedStatement[] = [
    db
      .prepare("INSERT INTO erp_change_orders (id, company_id, number, title, description, reason, request_id, status, created_by, search, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)")
      .bind(id, a.companyId, number, input.title, input.description ?? '', input.reason ?? req?.reason ?? '', req?.id ?? null, a.userId, searchText(number, input.title, input.description, req?.number), t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'change_order.created', entityType: 'change_order', entityId: id, summary: `Change order ${number} drafted: ${input.title}${req ? ` (from ${req.number})` : ''}`, after: { title: input.title, request: req?.number ?? null }, at: t }),
  ];
  for (const pid of [...new Set(productIds ?? [])]) stmts.push(...(await addProductStatements(db, a, eco, pid)).stmts);
  await db.batch(stmts);
  return c.json(ecoDTO(await loadEco(db, a.companyId, id)), 201);
});

changeRoutes.get('/c/:company/change-orders/:id', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  return c.json({ order: ecoDTO(o), revisions: await revisionsOfEco(db, a.companyId, o.id), history: await historyOf(db, a.companyId, { entityType: 'change_order', entityId: o.id }, 100), can: ecoCan(a, o) });
});

changeRoutes.patch('/c/:company/change-orders/:id', async (c) => {
  const a = await requireErp(c, 'changes.raise');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (o.status !== 'draft') badState(`${o.number} is ${o.status}: only a draft change order can change`);
  const input = await body(c, z.object({ title: zText(200).min(1).optional(), description: zText(5000).optional(), reason: zText(2000).optional() }));
  const row: Record<string, unknown> = {};
  for (const k of ['title', 'description', 'reason'] as const) if (input[k] !== undefined && input[k] !== o[k]) row[k] = input[k];
  if (!Object.keys(row).length) return c.json(ecoDTO(o));
  const t = now();
  await db.batch([
    db.prepare(`UPDATE erp_change_orders SET ${Object.keys(row).map((k) => `${k} = ?`).join(', ')}, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'`).bind(...Object.values(row), searchText(o.number, (row.title as string) ?? o.title, (row.description as string) ?? o.description, o.request_number), t, a.companyId, o.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'change_order.updated', entityType: 'change_order', entityId: o.id, summary: `${o.number} details changed`, before: Object.fromEntries(Object.keys(row).map((k) => [k, o[k]])), after: row, at: t }),
  ]);
  return c.json(ecoDTO(await loadEco(db, a.companyId, o.id)));
});

changeRoutes.post('/c/:company/change-orders/:id/products', async (c) => {
  const a = await requireErp(c, 'changes.raise');
  assertCan(a, 'products.edit');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (o.status !== 'draft') badState(`${o.number} is ${o.status}: products can be added only while it is a draft`);
  const input = await body(c, z.object({ productId: zId }));
  const { label, stmts } = await addProductStatements(db, a, o, input.productId);
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_change_orders SET updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'").bind(t, a.companyId, o.id),
    ...stmts,
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'change_order.product_added', entityType: 'change_order', entityId: o.id, summary: `Revision ${label} added to ${o.number}`, at: t }),
  ]);
  if (!res[0].meta.changes) badState(`${o.number} changed meanwhile: reload it`);
  return c.json({ order: ecoDTO(await loadEco(db, a.companyId, o.id)), revisions: await revisionsOfEco(db, a.companyId, o.id) }, 201);
});

changeRoutes.delete('/c/:company/change-orders/:id/revisions/:revisionId', async (c) => {
  const a = await requireErp(c, 'changes.raise');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (o.status !== 'draft') badState(`${o.number} is ${o.status}: revisions can be taken out only while it is a draft`);
  const r = await db
    .prepare('SELECT r.id, r.label, r.product_id, p.number FROM erp_revisions r JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id WHERE r.company_id = ? AND r.id = ? AND r.eco_id = ?')
    .bind(a.companyId, String(c.req.param('revisionId')).slice(0, 64), o.id)
    .first<{ id: string; label: string; product_id: string; number: string }>();
  if (!r) throw notFound('Revision');
  const t = now();
  await db.batch([
    db.prepare("UPDATE erp_revisions SET status = 'draft', eco_id = NULL, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'in_change'").bind(t, a.companyId, r.id),
    db.prepare('UPDATE erp_change_orders SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, o.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'change_order.revision_removed', entityType: 'change_order', entityId: o.id, summary: `Revision ${r.label} of ${r.number} taken out of ${o.number}; it stays as a draft`, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'revision.draft', entityType: 'revision', entityId: r.id, productId: r.product_id, summary: `Revision ${r.label} of ${r.number} taken out of change order ${o.number}`, before: { status: 'in_change' }, after: { status: 'draft' }, at: t }),
  ]);
  return c.json({ ok: true });
});

/** One status step guarded by the status it comes from, with its history line (also guarded). */
async function step(
  db: D1Database,
  a: ErpAccess,
  o: any,
  from: string[],
  set: Record<string, unknown>,
  action: string,
  summary: string,
  extra: (guard: string, guardArgs: unknown[], t: number) => D1PreparedStatement[] = () => [],
) {
  const t = now();
  const token = newId();
  const cols = { ...set, release_token: token, updated_at: t };
  const guard = 'EXISTS (SELECT 1 FROM erp_change_orders g WHERE g.company_id = ? AND g.id = ? AND g.release_token = ?)';
  const gArgs = [a.companyId, o.id, token];
  const res = await db.batch([
    db.prepare(`UPDATE erp_change_orders SET ${Object.keys(cols).map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ? AND status IN (${from.map(() => '?').join(',')})`).bind(...Object.values(cols), a.companyId, o.id, ...from),
    ...extra(guard, gArgs, t),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action, entityType: 'change_order', entityId: o.id, summary, before: { status: o.status }, after: { status: set.status, ...(set.decision_note ? { note: set.decision_note } : {}) }, at: t }, guard, gArgs),
  ]);
  if (!res[0].meta.changes) badState(`${o.number} changed meanwhile: reload it`);
}

changeRoutes.post('/c/:company/change-orders/:id/submit', async (c) => {
  const a = await requireErp(c, 'changes.raise');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (o.status !== 'draft') badState(`${o.number} is ${o.status}, not a draft`);
  if (!o.revision_count) badState(`${o.number} has no revisions: add the products it changes first`);
  await step(db, a, o, ['draft'], { status: 'submitted', submitted_by: a.userId, submitted_at: now() }, 'change_order.submitted', `${o.number} submitted for approval`);
  return c.json(ecoDTO(await loadEco(db, a.companyId, o.id)));
});

changeRoutes.post('/c/:company/change-orders/:id/approve', async (c) => {
  const a = await requireErp(c, 'changes.approve');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (o.status !== 'submitted') badState(`${o.number} is ${o.status}: only a submitted change order can be approved`);
  const input = await body(c, z.object({ note: zText(2000).optional() }).default({}));
  const exception = segregation(a, o.created_by, 'drafted this change order');
  await step(
    db,
    a,
    o,
    ['submitted'],
    { status: 'approved', approved_by: a.userId, approved_at: now(), decision_note: input.note ?? '', sod_exception: exception || o.sod_exception ? 1 : 0 },
    'change_order.approved',
    `${o.number} approved${exception ? ' by the person who drafted it (one-person company, recorded exception)' : ''}${input.note ? `: ${input.note}` : ''}`,
  );
  return c.json(ecoDTO(await loadEco(db, a.companyId, o.id)));
});

changeRoutes.post('/c/:company/change-orders/:id/return', async (c) => {
  const a = await requireErp(c, 'changes.approve');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (o.status !== 'submitted' && o.status !== 'approved') badState(`${o.number} is ${o.status}: only a submitted or approved change order can go back to draft`);
  const input = await body(c, z.object({ note: zText(2000).min(1, 'Say what needs to change') }));
  await step(db, a, o, ['submitted', 'approved'], { status: 'draft', approved_by: null, approved_at: null, decision_note: input.note, sod_exception: 0 }, 'change_order.returned', `${o.number} sent back to draft: ${input.note}`);
  return c.json(ecoDTO(await loadEco(db, a.companyId, o.id)));
});

changeRoutes.post('/c/:company/change-orders/:id/cancel', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (!['draft', 'submitted', 'approved'].includes(o.status)) badState(`${o.number} is ${o.status} and cannot be cancelled`);
  assertCan(a, o.status === 'draft' ? 'changes.raise' : 'changes.approve');
  const input = await body(c, z.object({ note: zText(2000).optional() }).default({}));
  await step(db, a, o, [o.status], { status: 'cancelled', cancelled_by: a.userId, cancelled_at: now(), decision_note: input.note ?? '' }, 'change_order.cancelled', `${o.number} cancelled${input.note ? `: ${input.note}` : ''}; its revisions stay as drafts`, (guard, gArgs, t) => [
    db.prepare(`UPDATE erp_revisions SET status = 'draft', eco_id = NULL, updated_at = ? WHERE company_id = ? AND eco_id = ? AND status = 'in_change' AND ${guard}`).bind(t, a.companyId, o.id, ...gArgs),
  ]);
  return c.json(ecoDTO(await loadEco(db, a.companyId, o.id)));
});

/**
 * Release: in one transaction, the change order becomes released, each product's released revision becomes superseded
 * and the change order's revisions become released. Every statement after the first runs only while this release's
 * one-time token is on the change order, so a second release at the same moment changes nothing and is refused.
 */
changeRoutes.post('/c/:company/change-orders/:id/release', async (c) => {
  const a = await requireErp(c, 'changes.approve');
  const db = c.env.DB;
  const o = await loadEco(db, a.companyId, c.req.param('id'));
  if (o.status === 'released') badState(`${o.number} is already released`);
  if (o.status !== 'approved') badState(`${o.number} is ${o.status}: only an approved change order can be released`);
  const exception = segregation(a, o.created_by, 'drafted this change order');
  const revisions = await revisionsOfEco(db, a.companyId, o.id);
  if (!revisions.length) badState(`${o.number} has no revisions to release`);
  const t = now();
  const token = newId();
  const guard = 'EXISTS (SELECT 1 FROM erp_change_orders g WHERE g.company_id = ? AND g.id = ? AND g.release_token = ?)';
  const gArgs = [a.companyId, o.id, token];
  const stmts: D1PreparedStatement[] = [
    db
      .prepare("UPDATE erp_change_orders SET status = 'released', released_by = ?, released_at = ?, release_token = ?, sod_exception = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'approved'")
      .bind(a.userId, t, token, exception || o.sod_exception ? 1 : 0, t, a.companyId, o.id),
    db
      .prepare(
        `UPDATE erp_revisions SET status = 'superseded', superseded_at = ?, updated_at = ?,
                superseded_by = (SELECT n.id FROM erp_revisions n WHERE n.company_id = erp_revisions.company_id AND n.product_id = erp_revisions.product_id AND n.eco_id = ?)
          WHERE company_id = ? AND status = 'released'
            AND product_id IN (SELECT x.product_id FROM erp_revisions x WHERE x.company_id = ? AND x.eco_id = ? AND x.status = 'in_change')
            AND ${guard}`,
      )
      .bind(t, t, o.id, a.companyId, a.companyId, o.id, ...gArgs),
    db
      .prepare(`UPDATE erp_revisions SET status = 'released', released_by = ?, released_at = ?, updated_at = ?, effective_date = COALESCE(effective_date, ?) WHERE company_id = ? AND eco_id = ? AND status = 'in_change' AND ${guard}`)
      .bind(a.userId, t, t, new Date(t).toISOString().slice(0, 10), a.companyId, o.id, ...gArgs),
    eventStmtIf(
      db,
      {
        companyId: a.companyId,
        actorId: a.userId,
        action: 'change_order.released',
        entityType: 'change_order',
        entityId: o.id,
        summary: `${o.number} released: ${revisions.map((r) => `${r.productNumber} revision ${r.label}`).join(', ')}${exception ? ' (one-person company, recorded exception)' : ''}`.slice(0, 500),
        before: { status: 'approved' },
        after: { status: 'released', revisions: revisions.map((r) => `${r.productNumber} ${r.label}`) },
        at: t,
      },
      guard,
      gArgs,
    ),
    ...revisions.map((r) =>
      eventStmtIf(
        db,
        {
          companyId: a.companyId,
          actorId: a.userId,
          action: 'revision.released',
          entityType: 'revision',
          entityId: r.id,
          productId: r.productId,
          summary: `Revision ${r.label} of ${r.productNumber} released by ${o.number}${r.previousLabel ? `; revision ${r.previousLabel} superseded` : ''}`,
          before: { status: 'in_change', released: r.previousLabel },
          after: { status: 'released' },
          at: t,
        },
        guard,
        gArgs,
      ),
    ),
  ];
  const res = await db.batch(stmts);
  if (!res[0].meta.changes) badState(`${o.number} was released or changed by someone else at the same moment: reload it`);
  return c.json({ order: ecoDTO(await loadEco(db, a.companyId, o.id)), revisions: await revisionsOfEco(db, a.companyId, o.id) });
});
