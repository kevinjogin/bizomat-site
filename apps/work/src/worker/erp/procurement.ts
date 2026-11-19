// BIZOMAT ERP, Release 2: purchase requisitions, requests for quotation and supplier quotations
// (/api/erp/c/:company/...). Purchase orders and receipts are purchasing.ts.
//
// Requisition (REQ-00001): someone asks for goods (products or free-text items) with a department, a required date, a
// budget reference and a reason. Draft, submitted, approved or rejected by a procurement manager who did not raise it
// (segregation of duties; the one-person company exception is recorded), converted once a request for quotation or a
// purchase order is made from it, or cancelled.
//
// Request for quotation (RFQ-00001): made from an approved requisition or directly, sent to approved suppliers only.
// Each supplier's copy is a PDF from Finance's document engine; "sent" is recorded by hand (the email outbox cannot
// attach a PDF: docs/erp/release-2.md). Each supplier's quotation is recorded (prices per line, lead time, freight,
// payment terms, validity, attachments); the comparison marks the cheapest and the fastest. A buyer selects one with a
// reason; a procurement manager who did not select it approves the choice; a purchase order is then made from it.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, andAll, body, newId, notFound, now } from '../lib/util';
import { hasPerm } from '../fin/access';
import { pdfResponse } from '../fin/render';
import { can, requireErp, segregation, type ErpAccess } from './access';
import { badState, csvResponse, dollars, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zCurrency, zDate, zId, zMoney, zQty, zText } from './util';
import { financeOrgsFor, maybeFin } from './suppliers';
import { recordFiles } from './record-files';
import { rfqPdf } from './print';

export const procurementRoutes = new Hono<AppEnv>();

export const REQ_STATUS = ['draft', 'submitted', 'approved', 'rejected', 'converted', 'cancelled'] as const;
export const REQ_LABELS: Record<(typeof REQ_STATUS)[number], string> = { draft: 'Draft', submitted: 'Submitted', approved: 'Approved', rejected: 'Rejected', converted: 'Converted', cancelled: 'Cancelled' };
export const RFQ_STATUS = ['draft', 'sent', 'awarded', 'approved', 'ordered', 'cancelled'] as const;
export const RFQ_LABELS: Record<(typeof RFQ_STATUS)[number], string> = { draft: 'Draft', sent: 'Sent', awarded: 'Supplier selected', approved: 'Selection approved', ordered: 'Ordered', cancelled: 'Cancelled' };

export const zLineIn = z.object({
  productId: zId.nullable().optional(),
  item: zText(300).optional(),
  specification: zText(2000).optional(),
  quantity: zQty,
  uom: zText(20).optional(),
});

export interface CheckedLine {
  productId: string | null;
  productNumber: string | null;
  item: string;
  specification: string;
  quantity: number;
  uom: string;
}

/** Lines checked: a product of this company (its name and unit by default) or a free-text item. */
export async function checkLines(db: D1Database, companyId: string, lines: z.infer<typeof zLineIn>[]): Promise<CheckedLine[]> {
  if (!lines.length) throw new HttpError(400, 'Add at least one line');
  if (lines.length > 200) throw new HttpError(400, 'At most 200 lines');
  const ids = [...new Set(lines.map((l) => l.productId).filter((x): x is string => !!x))];
  const products = new Map<string, { id: string; number: string; name: string; uom: string; type: string }>();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const rows = await db.prepare(`SELECT id, number, name, uom, type FROM erp_products WHERE company_id = ? AND id IN (${chunk.map(() => '?').join(',')})`).bind(companyId, ...chunk).all<any>();
    for (const r of rows.results) products.set(r.id, r);
  }
  return lines.map((l, i) => {
    if (l.productId) {
      const p = products.get(l.productId);
      if (!p) throw new HttpError(400, `Line ${i + 1}: choose a product of this company`);
      return { productId: p.id, productNumber: p.number, item: (l.item ?? '').trim() || p.name, specification: l.specification ?? '', quantity: l.quantity, uom: (l.uom ?? '').trim() || p.uom || 'each' };
    }
    if (!(l.item ?? '').trim()) throw new HttpError(400, `Line ${i + 1}: choose a product or describe the item`);
    return { productId: null, productNumber: null, item: l.item!.trim(), specification: l.specification ?? '', quantity: l.quantity, uom: (l.uom ?? '').trim() || 'each' };
  });
}

/** Approved suppliers only (purchasing never goes to a pending, held or blocked one). */
export async function approvedSupplier(db: D1Database, companyId: string, id: string) {
  const s = await db.prepare('SELECT * FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!s) throw notFound('Supplier');
  if (s.archived_at || s.status !== 'approved') throw new HttpError(400, `${s.number} ${s.legal_name} is not an approved supplier (${s.archived_at ? 'archived' : s.status.replace('_', ' ')})`);
  return s;
}

const lineDTO = (l: any) => ({
  id: l.id,
  position: l.position,
  productId: l.product_id,
  productNumber: l.product_number ?? null,
  item: l.item,
  specification: l.specification,
  quantity: l.quantity,
  uom: l.uom,
  estUnitCostCents: l.est_unit_cost_cents ?? null,
});

// ------------------------------------------------------------------ requisitions

const REQ_SELECT = `SELECT r.*, u.name AS requester_name, d.name AS department_name, dc.name AS decided_name,
  (SELECT COUNT(*) FROM erp_requisition_lines x WHERE x.company_id = r.company_id AND x.requisition_id = r.id) AS line_count
  FROM erp_requisitions r LEFT JOIN users u ON u.id = r.requester_id LEFT JOIN co_departments d ON d.id = r.department_id LEFT JOIN users dc ON dc.id = r.decided_by`;

export function requisitionDTO(r: any) {
  return {
    id: r.id,
    number: r.number,
    title: r.title,
    requesterId: r.requester_id,
    requesterName: r.requester_name ?? null,
    departmentId: r.department_id,
    departmentName: r.department_name ?? null,
    requiredDate: r.required_date,
    budgetRef: r.budget_ref,
    reason: r.reason,
    status: r.status,
    statusLabel: REQ_LABELS[r.status as keyof typeof REQ_LABELS] ?? r.status,
    estimatedTotalCents: r.estimated_total_cents,
    currency: r.currency,
    submittedAt: r.submitted_at,
    decidedByName: r.decided_name ?? null,
    decidedAt: r.decided_at,
    decisionNote: r.decision_note,
    sodException: !!r.sod_exception,
    lineCount: r.line_count ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function loadRequisition(db: D1Database, companyId: string, id: string) {
  const r = await db.prepare(`${REQ_SELECT} WHERE r.company_id = ? AND r.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!r) throw notFound('Requisition');
  return r;
}

async function checkDepartment(db: D1Database, a: ErpAccess, id: string | null | undefined) {
  if (!id) return null;
  if (a.kind !== 'registered') throw new HttpError(400, 'Departments belong to registered companies');
  const d = await db.prepare('SELECT id FROM co_departments WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(a.companyId, id).first();
  if (!d) throw new HttpError(400, 'Choose a department of this company');
  return id;
}

const reqFields = {
  title: zText(200).optional(),
  departmentId: zId.nullable().optional(),
  requiredDate: zDate.optional(),
  budgetRef: zText(200).optional(),
  reason: zText(2000).optional(),
  currency: zCurrency.optional(),
  lines: z.array(zLineIn.extend({ estUnitCostCents: zMoney.optional() })).max(200).optional(),
};

function reqLineStmts(db: D1Database, companyId: string, reqId: string, lines: (CheckedLine & { estUnitCostCents: number | null })[]) {
  return lines.map((l, i) =>
    db
      .prepare('INSERT INTO erp_requisition_lines (id, company_id, requisition_id, position, product_id, item, specification, quantity, uom, est_unit_cost_cents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), companyId, reqId, i + 1, l.productId, l.item, l.specification, l.quantity, l.uom, l.estUnitCostCents),
  );
}

const estimate = (lines: { quantity: number; estUnitCostCents: number | null }[]) => lines.reduce((s, l) => s + (l.estUnitCostCents === null ? 0 : Math.round(l.quantity * l.estUnitCostCents)), 0);

/** What the requisition form offers: departments, and budget references from Finance when the person may see budgets. */
procurementRoutes.get('/c/:company/requisition-options', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const departments = a.kind === 'registered' ? (await db.prepare('SELECT id, name FROM co_departments WHERE company_id = ? AND archived_at IS NULL ORDER BY name COLLATE NOCASE').bind(a.companyId).all<{ id: string; name: string }>()).results : [];
  const budgets: { value: string; label: string }[] = [];
  for (const o of await financeOrgsFor(db, a)) {
    const fa = await maybeFin(db, o.id, c.get('user'));
    if (!fa) continue;
    if (hasPerm(fa, 'budgets', 'view')) {
      const rows = await db.prepare('SELECT name, start_month FROM fin_budgets WHERE org_id = ? ORDER BY start_month DESC, name LIMIT 50').bind(o.id).all<{ name: string; start_month: string }>();
      for (const b of rows.results) budgets.push({ value: `Budget: ${b.name} (${b.start_month})`, label: `${b.name} (from ${b.start_month})` });
    }
    if (hasPerm(fa, 'accounting', 'view') || hasPerm(fa, 'budgets', 'view')) {
      const rows = await db.prepare("SELECT kind, name, code FROM fin_tracking WHERE org_id = ? AND archived_at IS NULL AND kind IN ('project','cost_centre') ORDER BY kind, name LIMIT 100").bind(o.id).all<{ kind: string; name: string; code: string }>();
      for (const t of rows.results) budgets.push({ value: `${t.kind === 'project' ? 'Project' : 'Cost centre'}: ${t.code ? `${t.code} ` : ''}${t.name}`, label: `${t.kind === 'project' ? 'Project' : 'Cost centre'} ${t.code ? `${t.code} ` : ''}${t.name}` });
    }
  }
  return c.json({ departments, budgets, financeBudgets: budgets.length > 0 });
});

procurementRoutes.get('/c/:company/requisitions', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where: string[] = [];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status === 'open') where.push("r.status IN ('draft','submitted','approved')");
  else if (status) {
    where.push('r.status = ?');
    args.push(status);
  }
  if (c.req.query('mine') === '1') {
    where.push('r.requester_id = ?');
    args.push(a.userId);
  }
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('r.search LIKE ?');
    args.push(likeOf(q));
  }
  const sorts: Record<string, string> = { number: 'r.number COLLATE NOCASE DESC', required: "COALESCE(r.required_date, '9999')", status: 'r.status, r.created_at DESC', newest: 'r.created_at DESC' };
  const order = sorts[c.req.query('sort') ?? ''] ?? sorts.newest;
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${REQ_SELECT} WHERE r.company_id = ?${andAll(where)} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(requisitionDTO);
  if (csv) return csvResponse('requisitions', [['Number', 'Title', 'Status', 'Requested by', 'Department', 'Required', 'Budget', 'Estimated total', 'Currency', 'Lines'], ...list.map((r) => [r.number, r.title, r.statusLabel, r.requesterName ?? '', r.departmentName ?? '', r.requiredDate ?? '', r.budgetRef, dollars(r.estimatedTotalCents), r.currency, r.lineCount ?? ''])]);
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_requisitions r WHERE r.company_id = ?${andAll(where)}`).bind(...args).first<{ n: number }>();
  return c.json({ requisitions: list, total: total?.n ?? 0, limit, offset, can: { raise: can(a, 'requisitions.raise'), approve: can(a, 'requisitions.approve') } });
});

const zRequisitionIn = z.object({ ...reqFields, submit: z.boolean().optional() });

/**
 * Raises a requisition (draft, or submitted for approval). The route below and MRP's purchase suggestions (planning.ts)
 * both come through here; the caller checks that the person may raise requisitions.
 */
export async function createRequisition(db: D1Database, a: ErpAccess, input: z.infer<typeof zRequisitionIn>, note = '') {
  const lines = (await checkLines(db, a.companyId, input.lines ?? [])).map((l, i) => ({ ...l, estUnitCostCents: input.lines![i].estUnitCostCents ?? null }));
  const department = await checkDepartment(db, a, input.departmentId);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'requisition');
  const t = now();
  const status = input.submit ? 'submitted' : 'draft';
  await db.batch([
    db
      .prepare(
        'INSERT INTO erp_requisitions (id, company_id, number, title, requester_id, department_id, required_date, budget_ref, reason, status, estimated_total_cents, currency, submitted_at, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(id, a.companyId, number, input.title ?? '', a.userId, department, input.requiredDate ?? null, input.budgetRef ?? '', input.reason ?? '', status, estimate(lines), input.currency ?? 'AUD', input.submit ? t : null, searchText(number, input.title, input.reason, ...lines.map((l) => l.item)), a.userId, t, t),
    ...reqLineStmts(db, a.companyId, id, lines),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: input.submit ? 'requisition.submitted' : 'requisition.created', entityType: 'requisition', entityId: id, summary: `${number} ${input.submit ? 'raised and submitted' : 'drafted'}: ${lines.length} line${lines.length === 1 ? '' : 's'}${note ? ` (${note})` : ''}`, at: t }),
  ]);
  return { id, number, status };
}

procurementRoutes.post('/c/:company/requisitions', async (c) => {
  const a = await requireErp(c, 'requisitions.raise');
  const input = await body(c, zRequisitionIn);
  return c.json(await createRequisition(c.env.DB, a, input), 201);
});

procurementRoutes.get('/c/:company/requisitions/:id', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const r = await loadRequisition(db, a.companyId, c.req.param('id'));
  const lines = await db.prepare('SELECT x.*, p.number AS product_number FROM erp_requisition_lines x LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id WHERE x.company_id = ? AND x.requisition_id = ? ORDER BY x.position').bind(a.companyId, r.id).all<any>();
  const rfqs = await db.prepare('SELECT id, number, status FROM erp_rfqs WHERE company_id = ? AND requisition_id = ? ORDER BY created_at').bind(a.companyId, r.id).all<any>();
  const pos = await db.prepare('SELECT id, number, status FROM erp_purchase_orders WHERE company_id = ? AND requisition_id = ? ORDER BY created_at').bind(a.companyId, r.id).all<any>();
  const mine = r.requester_id === a.userId || r.created_by === a.userId;
  const approver = can(a, 'requisitions.approve');
  return c.json({
    requisition: requisitionDTO(r),
    lines: lines.results.map(lineDTO),
    rfqs: rfqs.results.map((x) => ({ id: x.id, number: x.number, status: x.status, statusLabel: RFQ_LABELS[x.status as keyof typeof RFQ_LABELS] })),
    purchaseOrders: pos.results.map((x) => ({ id: x.id, number: x.number, status: x.status })),
    files: await recordFiles(db, a.companyId, 'requisition', r.id),
    history: await historyOf(db, a.companyId, { entityType: 'requisition', entityId: r.id }),
    can: {
      edit: r.status === 'draft' && (mine || a.roles.includes('erp_admin')),
      submit: r.status === 'draft' && (mine || a.roles.includes('erp_admin')),
      approve: r.status === 'submitted' && approver && (!mine || a.solo),
      cancel: ['draft', 'submitted', 'approved'].includes(r.status) && (mine || approver),
      rfq: r.status === 'approved' && can(a, 'purchasing.edit'),
      order: r.status === 'approved' && can(a, 'purchasing.edit'),
      files: can(a, 'requisitions.raise'),
      segregation: r.status === 'submitted' && approver && mine && !a.solo ? 'You raised this requisition, so another procurement manager must approve it.' : null,
    },
  });
});

procurementRoutes.put('/c/:company/requisitions/:id', async (c) => {
  const a = await requireErp(c, 'requisitions.raise');
  const db = c.env.DB;
  const r = await loadRequisition(db, a.companyId, c.req.param('id'));
  if (r.status !== 'draft') badState(`${r.number} is ${r.status}: only a draft can change`);
  if (r.requester_id !== a.userId && r.created_by !== a.userId && !a.roles.includes('erp_admin')) throw new HttpError(403, 'Only the person who raised it can change it');
  const input = await body(c, z.object(reqFields));
  const lines = input.lines ? (await checkLines(db, a.companyId, input.lines)).map((l, i) => ({ ...l, estUnitCostCents: input.lines![i].estUnitCostCents ?? null })) : null;
  const department = input.departmentId === undefined ? r.department_id : await checkDepartment(db, a, input.departmentId);
  const t = now();
  const title = input.title ?? r.title;
  const reason = input.reason ?? r.reason;
  await db.batch([
    db
      .prepare("UPDATE erp_requisitions SET title = ?, department_id = ?, required_date = ?, budget_ref = ?, reason = ?, currency = ?, estimated_total_cents = COALESCE(?, estimated_total_cents), search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'")
      .bind(title, department, input.requiredDate === undefined ? r.required_date : input.requiredDate, input.budgetRef ?? r.budget_ref, reason, input.currency ?? r.currency, lines ? estimate(lines) : null, searchText(r.number, title, reason, ...(lines ?? []).map((l) => l.item)), t, a.companyId, r.id),
    ...(lines ? [db.prepare('DELETE FROM erp_requisition_lines WHERE company_id = ? AND requisition_id = ?').bind(a.companyId, r.id), ...reqLineStmts(db, a.companyId, r.id, lines)] : []),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'requisition.updated', entityType: 'requisition', entityId: r.id, summary: `${r.number} changed`, at: t }),
  ]);
  return c.json({ ok: true });
});

procurementRoutes.post('/c/:company/requisitions/:id/:action{submit|approve|reject|cancel}', async (c) => {
  const action = c.req.param('action');
  const a = await requireErp(c, action === 'approve' || action === 'reject' ? 'requisitions.approve' : 'purchasing.view');
  const db = c.env.DB;
  const r = await loadRequisition(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ note: zText(1000).optional() }));
  const mine = r.requester_id === a.userId || r.created_by === a.userId;
  const t = now();
  let next: string;
  let sod = false;
  let from: string[];
  if (action === 'submit') {
    if (!mine && !a.roles.includes('erp_admin')) throw new HttpError(403, 'Only the person who raised it can submit it');
    from = ['draft'];
    next = 'submitted';
    const n = await db.prepare('SELECT COUNT(*) AS n FROM erp_requisition_lines WHERE company_id = ? AND requisition_id = ?').bind(a.companyId, r.id).first<{ n: number }>();
    if (!n?.n) badState('Add at least one line before submitting');
  } else if (action === 'approve' || action === 'reject') {
    from = ['submitted'];
    next = action === 'approve' ? 'approved' : 'rejected';
    sod = segregation(a, r.requester_id ?? r.created_by, 'raised this requisition');
    if (action === 'reject' && !input.note) throw new HttpError(400, 'Say why it is rejected');
  } else {
    if (!mine && !can(a, 'requisitions.approve')) throw new HttpError(403, 'Only the person who raised it or a procurement manager can cancel it');
    from = ['draft', 'submitted', 'approved'];
    next = 'cancelled';
  }
  if (!from.includes(r.status)) badState(`${r.number} is ${r.status}`);
  const decided = action === 'approve' || action === 'reject';
  const res = await db.batch([
    db
      .prepare(
        `UPDATE erp_requisitions SET status = ?, ${action === 'submit' ? 'submitted_at = ?,' : ''} ${decided ? 'decided_by = ?, decided_at = ?, decision_note = ?, sod_exception = ?,' : ''} updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`,
      )
      .bind(next, ...(action === 'submit' ? [t] : []), ...(decided ? [a.userId, t, input.note ?? '', sod ? 1 : 0] : []), t, a.companyId, r.id, r.status),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: `requisition.${next}`,
      entityType: 'requisition',
      entityId: r.id,
      summary: `${r.number} ${next}${input.note ? `: ${input.note}` : ''}${sod ? ' by the person who raised it (company of one: recorded exception)' : ''}`,
      after: { status: next, sodException: sod },
      at: t,
    }),
  ]);
  if (!res[0].meta.changes) badState('Someone changed this requisition at the same moment: refresh and try again');
  return c.json({ ok: true, status: next });
});

// ------------------------------------------------------------------ requests for quotation

const RFQ_SELECT = `SELECT q.*, rq.number AS requisition_number, sb.name AS selected_name, ab.name AS approved_name, cb.name AS created_name,
  (SELECT COUNT(*) FROM erp_rfq_suppliers x WHERE x.company_id = q.company_id AND x.rfq_id = q.id) AS supplier_count,
  (SELECT COUNT(*) FROM erp_quotations x WHERE x.company_id = q.company_id AND x.rfq_id = q.id) AS quotation_count
  FROM erp_rfqs q LEFT JOIN erp_requisitions rq ON rq.company_id = q.company_id AND rq.id = q.requisition_id
  LEFT JOIN users sb ON sb.id = q.selected_by LEFT JOIN users ab ON ab.id = q.approved_by LEFT JOIN users cb ON cb.id = q.created_by`;

export function rfqDTO(q: any) {
  return {
    id: q.id,
    number: q.number,
    title: q.title,
    requisitionId: q.requisition_id,
    requisitionNumber: q.requisition_number ?? null,
    requiredDate: q.required_date,
    replyBy: q.reply_by,
    currency: q.currency,
    deliveryAddress: q.delivery_address,
    notes: q.notes,
    status: q.status,
    statusLabel: RFQ_LABELS[q.status as keyof typeof RFQ_LABELS] ?? q.status,
    selectedQuotationId: q.selected_quotation_id,
    selectionReason: q.selection_reason,
    selectedBy: q.selected_by,
    selectedByName: q.selected_name ?? null,
    selectedAt: q.selected_at,
    approvedByName: q.approved_name ?? null,
    approvedAt: q.approved_at,
    sodException: !!q.sod_exception,
    supplierCount: q.supplier_count ?? undefined,
    quotationCount: q.quotation_count ?? undefined,
    createdByName: q.created_name ?? null,
    createdAt: q.created_at,
  };
}

export async function loadRfq(db: D1Database, companyId: string, id: string) {
  const q = await db.prepare(`${RFQ_SELECT} WHERE q.company_id = ? AND q.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!q) throw notFound('Request for quotation');
  return q;
}

const rfqFields = {
  title: zText(200).optional(),
  requiredDate: zDate.optional(),
  replyBy: zDate.optional(),
  currency: zCurrency.optional(),
  deliveryAddress: zText(500).optional(),
  notes: zText(4000).optional(),
  lines: z.array(zLineIn).max(200).optional(),
  supplierIds: z.array(zId).max(30).optional(),
};

function rfqLineStmts(db: D1Database, companyId: string, rfqId: string, lines: CheckedLine[]) {
  return lines.map((l, i) =>
    db
      .prepare('INSERT INTO erp_rfq_lines (id, company_id, rfq_id, position, product_id, item, specification, quantity, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), companyId, rfqId, i + 1, l.productId, l.item, l.specification, l.quantity, l.uom),
  );
}

procurementRoutes.get('/c/:company/rfqs', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where: string[] = [];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status === 'open') where.push("q.status IN ('draft','sent','awarded','approved')");
  else if (status) {
    where.push('q.status = ?');
    args.push(status);
  }
  const s = c.req.query('q')?.trim();
  if (s) {
    where.push('q.search LIKE ?');
    args.push(likeOf(s));
  }
  const order = c.req.query('sort') === 'reply' ? "COALESCE(q.reply_by, '9999')" : c.req.query('sort') === 'number' ? 'q.number COLLATE NOCASE DESC' : 'q.created_at DESC';
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${RFQ_SELECT} WHERE q.company_id = ?${andAll(where)} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(rfqDTO);
  if (csv) return csvResponse('requests-for-quotation', [['Number', 'Title', 'Status', 'Requisition', 'Reply by', 'Required', 'Currency', 'Suppliers', 'Quotations'], ...list.map((q) => [q.number, q.title, q.statusLabel, q.requisitionNumber ?? '', q.replyBy ?? '', q.requiredDate ?? '', q.currency, q.supplierCount ?? '', q.quotationCount ?? ''])]);
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_rfqs q WHERE q.company_id = ?${andAll(where)}`).bind(...args).first<{ n: number }>();
  return c.json({ rfqs: list, total: total?.n ?? 0, limit, offset, can: { create: can(a, 'purchasing.edit') } });
});

procurementRoutes.post('/c/:company/rfqs', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const input = await body(c, z.object({ ...rfqFields, requisitionId: zId.nullable().optional() }));
  let req: any = null;
  let lines: CheckedLine[];
  if (input.requisitionId) {
    req = await loadRequisition(db, a.companyId, input.requisitionId);
    if (req.status !== 'approved') badState(`${req.number} is ${req.status}: a request for quotation is made from an approved requisition`);
  }
  if (input.lines?.length) lines = await checkLines(db, a.companyId, input.lines);
  else if (req) {
    const rows = await db.prepare('SELECT * FROM erp_requisition_lines WHERE company_id = ? AND requisition_id = ? ORDER BY position').bind(a.companyId, req.id).all<any>();
    lines = rows.results.map((l) => ({ productId: l.product_id, productNumber: null, item: l.item, specification: l.specification, quantity: l.quantity, uom: l.uom }));
  } else throw new HttpError(400, 'Add at least one line');
  const suppliers = [];
  for (const sid of [...new Set(input.supplierIds ?? [])]) suppliers.push(await approvedSupplier(db, a.companyId, sid));
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'rfq');
  const t = now();
  const title = input.title || req?.title || '';
  await db.batch([
    db
      .prepare('INSERT INTO erp_rfqs (id, company_id, number, title, requisition_id, required_date, reply_by, currency, delivery_address, notes, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, number, title, req?.id ?? null, input.requiredDate ?? req?.required_date ?? null, input.replyBy ?? null, input.currency ?? req?.currency ?? 'AUD', input.deliveryAddress ?? '', input.notes ?? '', searchText(number, title, ...lines.map((l) => l.item), ...suppliers.map((s) => s.legal_name)), a.userId, t, t),
    ...rfqLineStmts(db, a.companyId, id, lines),
    ...suppliers.map((s) => db.prepare('INSERT INTO erp_rfq_suppliers (company_id, rfq_id, supplier_id) VALUES (?, ?, ?)').bind(a.companyId, id, s.id)),
    ...(req
      ? [
          db.prepare("UPDATE erp_requisitions SET status = 'converted', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'approved'").bind(t, a.companyId, req.id),
          eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'requisition.converted', entityType: 'requisition', entityId: req.id, summary: `${req.number} converted to request for quotation ${number}`, at: t }),
        ]
      : []),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.created', entityType: 'rfq', entityId: id, summary: `${number} created${req ? ` from ${req.number}` : ''}: ${lines.length} line${lines.length === 1 ? '' : 's'}, ${suppliers.length} supplier${suppliers.length === 1 ? '' : 's'}`, at: t }),
  ]);
  return c.json({ id, number }, 201);
});

interface QuoteRow {
  id: string;
  supplier_id: string;
  supplier_number: string;
  supplier_name: string;
  reference: string;
  received_date: string | null;
  valid_until: string | null;
  lead_time_days: number | null;
  freight_cents: number;
  payment_terms_days: number | null;
  currency: string;
  notes: string;
  subtotal_cents: number;
  total_cents: number;
}

/** The comparison table: each quotation's prices against each line; the cheapest and fastest complete quotations. */
export function compare(rfq: { currency: string }, lines: any[], quotes: QuoteRow[], qlines: any[], today: string) {
  const byQuote = new Map<string, Map<string, any>>();
  for (const l of qlines) {
    if (!byQuote.has(l.quotation_id)) byQuote.set(l.quotation_id, new Map());
    byQuote.get(l.quotation_id)!.set(l.rfq_line_id, l);
  }
  const rows = quotes.map((q) => {
    const m = byQuote.get(q.id) ?? new Map();
    const priced = lines.map((l) => {
      const x = m.get(l.id);
      const unit = x?.unit_price_cents ?? null;
      return { lineId: l.id, unitPriceCents: unit, totalCents: unit === null ? null : Math.round(unit * l.quantity), leadTimeDays: x?.lead_time_days ?? null, note: x?.note ?? '' };
    });
    const complete = priced.every((p) => p.unitPriceCents !== null);
    const lead = q.lead_time_days ?? (priced.some((p) => p.leadTimeDays !== null) ? Math.max(...priced.map((p) => p.leadTimeDays ?? 0)) : null);
    return {
      quotationId: q.id,
      supplierId: q.supplier_id,
      supplierNumber: q.supplier_number,
      supplierName: q.supplier_name,
      reference: q.reference,
      receivedDate: q.received_date,
      validUntil: q.valid_until,
      expired: !!q.valid_until && q.valid_until < today,
      leadTimeDays: lead,
      freightCents: q.freight_cents,
      paymentTermsDays: q.payment_terms_days,
      currency: q.currency,
      otherCurrency: q.currency !== rfq.currency,
      notes: q.notes,
      lines: priced,
      complete,
      subtotalCents: q.subtotal_cents,
      totalCents: q.total_cents,
      cheapest: false,
      fastest: false,
    };
  });
  const eligible = rows.filter((r) => r.complete && !r.otherCurrency && !r.expired);
  if (eligible.length) {
    const min = Math.min(...eligible.map((r) => r.totalCents));
    for (const r of eligible) if (r.totalCents === min) r.cheapest = true;
    const leads = eligible.filter((r) => r.leadTimeDays !== null);
    if (leads.length) {
      const fast = Math.min(...leads.map((r) => r.leadTimeDays!));
      for (const r of leads) if (r.leadTimeDays === fast) r.fastest = true;
    }
  }
  const lineBest = lines.map((l) => {
    const prices = rows.filter((r) => !r.otherCurrency).map((r) => r.lines.find((x) => x.lineId === l.id)?.unitPriceCents).filter((x): x is number => x !== null && x !== undefined);
    return { lineId: l.id, lowestUnitPriceCents: prices.length ? Math.min(...prices) : null };
  });
  return {
    quotations: rows,
    lineBest,
    note: 'Cheapest: the lowest total with freight among complete, valid quotations in the request’s currency. Fastest: the shortest lead time among them.',
  };
}

procurementRoutes.get('/c/:company/rfqs/:id', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const q = await loadRfq(db, a.companyId, c.req.param('id'));
  const lines = await db.prepare('SELECT x.*, p.number AS product_number FROM erp_rfq_lines x LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id WHERE x.company_id = ? AND x.rfq_id = ? ORDER BY x.position').bind(a.companyId, q.id).all<any>();
  const suppliers = await db
    .prepare(
      `SELECT x.*, s.number, s.legal_name, s.trading_name, s.email, s.status, u.name AS sent_name FROM erp_rfq_suppliers x JOIN erp_suppliers s ON s.company_id = x.company_id AND s.id = x.supplier_id
         LEFT JOIN users u ON u.id = x.sent_by WHERE x.company_id = ? AND x.rfq_id = ? ORDER BY s.legal_name COLLATE NOCASE`,
    )
    .bind(a.companyId, q.id)
    .all<any>();
  const quotes = await db
    .prepare('SELECT x.*, s.number AS supplier_number, s.legal_name AS supplier_name FROM erp_quotations x JOIN erp_suppliers s ON s.company_id = x.company_id AND s.id = x.supplier_id WHERE x.company_id = ? AND x.rfq_id = ? ORDER BY x.created_at')
    .bind(a.companyId, q.id)
    .all<QuoteRow>();
  const qlines = await db.prepare('SELECT ql.* FROM erp_quotation_lines ql JOIN erp_quotations x ON x.company_id = ql.company_id AND x.id = ql.quotation_id WHERE x.company_id = ? AND x.rfq_id = ?').bind(a.companyId, q.id).all<any>();
  const today = new Date(now()).toISOString().slice(0, 10);
  const comparison = compare(q, lines.results, quotes.results, qlines.results, today);
  const po = await db.prepare('SELECT id, number, status FROM erp_purchase_orders WHERE company_id = ? AND rfq_id = ? ORDER BY created_at').bind(a.companyId, q.id).all<any>();
  const files = [];
  for (const x of quotes.results) files.push(...(await recordFiles(db, a.companyId, 'quotation', x.id)).map((f) => ({ ...f, quotationId: x.id })));
  const editor = can(a, 'purchasing.edit');
  const open = q.status === 'draft' || q.status === 'sent';
  const selectedByMe = q.selected_by === a.userId;
  if (wantsCsv(c)) {
    return csvResponse(`comparison-${q.number}`, [
      ['Line', 'Item', 'Quantity', 'Unit', ...comparison.quotations.flatMap((x) => [`${x.supplierName} unit price`, `${x.supplierName} line total`])],
      ...lines.results.map((l, i) => [i + 1, l.item, l.quantity, l.uom, ...comparison.quotations.flatMap((x) => [dollars(x.lines[i].unitPriceCents), dollars(x.lines[i].totalCents)])]),
      ['', 'Freight', '', '', ...comparison.quotations.flatMap((x) => ['', dollars(x.freightCents)])],
      ['', 'Total', '', '', ...comparison.quotations.flatMap((x) => ['', dollars(x.totalCents)])],
      ['', 'Lead time (days)', '', '', ...comparison.quotations.flatMap((x) => ['', x.leadTimeDays ?? ''])],
      ['', 'Payment terms (days)', '', '', ...comparison.quotations.flatMap((x) => ['', x.paymentTermsDays ?? ''])],
      ['', 'Valid until', '', '', ...comparison.quotations.flatMap((x) => ['', x.validUntil ?? ''])],
      ['', 'Marked', '', '', ...comparison.quotations.flatMap((x) => ['', [x.cheapest ? 'cheapest' : '', x.fastest ? 'fastest' : ''].filter(Boolean).join(', ')])],
    ]);
  }
  return c.json({
    rfq: rfqDTO(q),
    lines: lines.results.map(lineDTO),
    suppliers: suppliers.results.map((s) => ({ supplierId: s.supplier_id, number: s.number, name: s.trading_name || s.legal_name, email: s.email, status: s.status, sentAt: s.sent_at, sentVia: s.sent_via, sentByName: s.sent_name ?? null, quoted: quotes.results.some((x) => x.supplier_id === s.supplier_id) })),
    comparison,
    quotationFiles: files,
    purchaseOrders: po.results,
    files: await recordFiles(db, a.companyId, 'rfq', q.id),
    history: await historyOf(db, a.companyId, { entityType: 'rfq', entityId: q.id }),
    email: { available: false, note: 'Email with the PDF attached is not available yet: download the PDF, send it from your own email, then record it as sent.' },
    can: {
      edit: q.status === 'draft' && editor,
      suppliers: open && editor,
      send: open && editor,
      quote: open && editor,
      select: q.status === 'sent' && editor && quotes.results.length > 0,
      unselect: q.status === 'awarded' && (editor || can(a, 'purchasing.approve')),
      approve: q.status === 'awarded' && can(a, 'purchasing.approve') && (!selectedByMe || a.solo),
      order: q.status === 'approved' && editor,
      cancel: ['draft', 'sent', 'awarded', 'approved'].includes(q.status) && editor,
      segregation: q.status === 'awarded' && selectedByMe && !a.solo && can(a, 'purchasing.approve') ? 'You selected this supplier, so another procurement manager must approve the choice.' : null,
    },
  });
});

procurementRoutes.put('/c/:company/rfqs/:id', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const q = await loadRfq(db, a.companyId, c.req.param('id'));
  if (q.status !== 'draft') badState(`${q.number} is ${q.status}: only a draft changes (record quotations against it instead)`);
  const input = await body(c, z.object({ ...rfqFields, supplierIds: z.never().optional() }));
  const lines = input.lines ? await checkLines(db, a.companyId, input.lines) : null;
  if (lines) {
    const quoted = await db.prepare('SELECT 1 FROM erp_quotations WHERE company_id = ? AND rfq_id = ? LIMIT 1').bind(a.companyId, q.id).first();
    if (quoted) badState('Quotations are recorded against these lines: the lines cannot change');
  }
  const t = now();
  const title = input.title ?? q.title;
  await db.batch([
    db
      .prepare("UPDATE erp_rfqs SET title = ?, required_date = ?, reply_by = ?, currency = ?, delivery_address = ?, notes = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'")
      .bind(title, input.requiredDate === undefined ? q.required_date : input.requiredDate, input.replyBy === undefined ? q.reply_by : input.replyBy, input.currency ?? q.currency, input.deliveryAddress ?? q.delivery_address, input.notes ?? q.notes, searchText(q.number, title, ...(lines ?? []).map((l) => l.item)), t, a.companyId, q.id),
    ...(lines ? [db.prepare('DELETE FROM erp_rfq_lines WHERE company_id = ? AND rfq_id = ?').bind(a.companyId, q.id), ...rfqLineStmts(db, a.companyId, q.id, lines)] : []),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.updated', entityType: 'rfq', entityId: q.id, summary: `${q.number} changed`, at: t }),
  ]);
  return c.json({ ok: true });
});

procurementRoutes.post('/c/:company/rfqs/:id/suppliers', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const q = await loadRfq(db, a.companyId, c.req.param('id'));
  if (q.status !== 'draft' && q.status !== 'sent') badState(`${q.number} is ${q.status}`);
  const input = await body(c, z.object({ supplierId: zId }));
  const s = await approvedSupplier(db, a.companyId, input.supplierId);
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO erp_rfq_suppliers (company_id, rfq_id, supplier_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING').bind(a.companyId, q.id, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.supplier_added', entityType: 'rfq', entityId: q.id, summary: `${q.number}: ${s.number} ${s.legal_name} invited to quote`, at: t }),
  ]);
  return c.json({ ok: true }, 201);
});

procurementRoutes.delete('/c/:company/rfqs/:id/suppliers/:supplierId', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const q = await loadRfq(db, a.companyId, c.req.param('id'));
  if (q.status !== 'draft' && q.status !== 'sent') badState(`${q.number} is ${q.status}`);
  const quoted = await db.prepare('SELECT 1 FROM erp_quotations WHERE company_id = ? AND rfq_id = ? AND supplier_id = ?').bind(a.companyId, q.id, c.req.param('supplierId')).first();
  if (quoted) badState('This supplier has a quotation recorded: it stays on the request');
  await db.batch([
    db.prepare('DELETE FROM erp_rfq_suppliers WHERE company_id = ? AND rfq_id = ? AND supplier_id = ?').bind(a.companyId, q.id, c.req.param('supplierId')),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.supplier_removed', entityType: 'rfq', entityId: q.id, summary: `${q.number}: a supplier removed`, at: now() }),
  ]);
  return c.json({ ok: true });
});

async function rfqForPrint(c: any, a: ErpAccess, q: any, supplierId: string | null) {
  const db = c.env.DB as D1Database;
  const lines = await db.prepare('SELECT x.*, p.number AS product_number FROM erp_rfq_lines x LEFT JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id WHERE x.company_id = ? AND x.rfq_id = ? ORDER BY x.position').bind(a.companyId, q.id).all<any>();
  let supplier: any = null;
  if (supplierId) {
    supplier = await db.prepare('SELECT s.* FROM erp_rfq_suppliers x JOIN erp_suppliers s ON s.company_id = x.company_id AND s.id = x.supplier_id WHERE x.company_id = ? AND x.rfq_id = ? AND x.supplier_id = ?').bind(a.companyId, q.id, supplierId).first<any>();
    if (!supplier) throw notFound('Supplier on this request');
  }
  const buyer = (await db.prepare('SELECT name FROM users WHERE id = ?').bind(q.created_by).first<{ name: string }>())?.name ?? '';
  return rfqPdf(
    c.env,
    a,
    { number: q.number, status: q.status, date: new Date(q.created_at).toISOString().slice(0, 10), replyBy: q.reply_by, requiredDate: q.required_date, buyer, notes: q.notes, deliveryAddress: q.delivery_address, currency: q.currency },
    supplier ? { name: supplier.legal_name, abn: supplier.abn, address: supplier.postal_address, email: supplier.email } : null,
    lines.results.map((l) => ({ itemCode: l.product_number ?? '', description: [l.item, l.specification].filter(Boolean).join('\n'), quantity: l.quantity, unit: l.uom })),
  );
}

procurementRoutes.get('/c/:company/rfqs/:id/pdf', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const q = await loadRfq(c.env.DB, a.companyId, c.req.param('id'));
  const bytes = await rfqForPrint(c, a, q, c.req.query('supplierId') ?? null);
  return pdfResponse(bytes, q.number, c.req.query('inline') === '1');
});

/** The PDF of a request for quotation as it would be saved (the live preview; nothing is saved). */
procurementRoutes.post('/c/:company/rfqs/preview', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const input = await body(c, z.object({ ...rfqFields, number: zText(40).optional() }));
  const lines = input.lines?.length ? await checkLines(c.env.DB, a.companyId, input.lines) : [];
  const bytes = await rfqPdf(
    c.env,
    a,
    { number: input.number || 'RFQ (new)', status: 'draft', date: new Date(now()).toISOString().slice(0, 10), replyBy: input.replyBy ?? null, requiredDate: input.requiredDate ?? null, buyer: a.userName, notes: input.notes ?? '', deliveryAddress: input.deliveryAddress ?? '', currency: input.currency ?? 'AUD' },
    null,
    lines.map((l) => ({ itemCode: l.productNumber ?? '', description: [l.item, l.specification].filter(Boolean).join('\n'), quantity: l.quantity, unit: l.uom })),
  );
  return pdfResponse(bytes, 'rfq-preview', true);
});

/** Records that the request was sent to a supplier (by hand: downloaded and sent from the person's own email). */
procurementRoutes.post('/c/:company/rfqs/:id/sent', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const q = await loadRfq(db, a.companyId, c.req.param('id'));
  if (q.status !== 'draft' && q.status !== 'sent') badState(`${q.number} is ${q.status}`);
  const input = await body(c, z.object({ supplierId: zId }));
  const s = await db.prepare('SELECT s.number, s.legal_name FROM erp_rfq_suppliers x JOIN erp_suppliers s ON s.company_id = x.company_id AND s.id = x.supplier_id WHERE x.company_id = ? AND x.rfq_id = ? AND x.supplier_id = ?').bind(a.companyId, q.id, input.supplierId).first<any>();
  if (!s) throw notFound('Supplier on this request');
  const t = now();
  await db.batch([
    db.prepare("UPDATE erp_rfq_suppliers SET sent_at = ?, sent_via = 'manual', sent_by = ? WHERE company_id = ? AND rfq_id = ? AND supplier_id = ?").bind(t, a.userId, a.companyId, q.id, input.supplierId),
    db.prepare("UPDATE erp_rfqs SET status = 'sent', updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('draft','sent')").bind(t, a.companyId, q.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.sent', entityType: 'rfq', entityId: q.id, summary: `${q.number} sent manually to ${s.number} ${s.legal_name}`, after: { via: 'manual' }, at: t }),
  ]);
  return c.json({ ok: true });
});

/** Records (or replaces) a supplier's quotation against the request. */
procurementRoutes.put('/c/:company/rfqs/:id/quotations/:supplierId', async (c) => {
  const a = await requireErp(c, 'purchasing.edit');
  const db = c.env.DB;
  const q = await loadRfq(db, a.companyId, c.req.param('id'));
  if (q.status !== 'draft' && q.status !== 'sent') badState(`${q.number} is ${q.status}: quotations are recorded while it is open`);
  const supplierId = c.req.param('supplierId');
  const onIt = await db.prepare('SELECT s.number, s.legal_name FROM erp_rfq_suppliers x JOIN erp_suppliers s ON s.company_id = x.company_id AND s.id = x.supplier_id WHERE x.company_id = ? AND x.rfq_id = ? AND x.supplier_id = ?').bind(a.companyId, q.id, supplierId).first<any>();
  if (!onIt) throw notFound('Supplier on this request');
  const input = await body(
    c,
    z.object({
      reference: zText(100).optional(),
      receivedDate: zDate.optional(),
      validUntil: zDate.optional(),
      leadTimeDays: z.number().int().min(0).max(1000).nullable().optional(),
      freightCents: z.number().int().min(0).max(1e11).optional(),
      paymentTermsDays: z.number().int().min(0).max(365).nullable().optional(),
      currency: zCurrency.optional(),
      notes: zText(4000).optional(),
      lines: z.array(z.object({ rfqLineId: zId, unitPriceCents: zMoney.optional(), leadTimeDays: z.number().int().min(0).max(1000).nullable().optional(), note: zText(500).optional() })).max(200),
    }),
  );
  const lines = await db.prepare('SELECT id, quantity FROM erp_rfq_lines WHERE company_id = ? AND rfq_id = ?').bind(a.companyId, q.id).all<{ id: string; quantity: number }>();
  const byId = new Map(lines.results.map((l) => [l.id, l]));
  for (const l of input.lines) if (!byId.has(l.rfqLineId)) throw new HttpError(400, 'A price is for a line of this request');
  const subtotal = input.lines.reduce((s, l) => s + (l.unitPriceCents === null || l.unitPriceCents === undefined ? 0 : Math.round(l.unitPriceCents * byId.get(l.rfqLineId)!.quantity)), 0);
  const freight = input.freightCents ?? 0;
  const existing = await db.prepare('SELECT id FROM erp_quotations WHERE company_id = ? AND rfq_id = ? AND supplier_id = ?').bind(a.companyId, q.id, supplierId).first<{ id: string }>();
  const id = existing?.id ?? newId();
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_quotations (id, company_id, rfq_id, supplier_id, reference, received_date, valid_until, lead_time_days, freight_cents, payment_terms_days, currency, notes, subtotal_cents, total_cents, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?16)
         ON CONFLICT(company_id, rfq_id, supplier_id) DO UPDATE SET reference = ?5, received_date = ?6, valid_until = ?7, lead_time_days = ?8, freight_cents = ?9, payment_terms_days = ?10, currency = ?11, notes = ?12, subtotal_cents = ?13, total_cents = ?14, updated_at = ?16`,
      )
      .bind(id, a.companyId, q.id, supplierId, input.reference ?? '', input.receivedDate ?? new Date(t).toISOString().slice(0, 10), input.validUntil ?? null, input.leadTimeDays ?? null, freight, input.paymentTermsDays ?? null, input.currency ?? q.currency, input.notes ?? '', subtotal, subtotal + freight, a.userId, t),
    db.prepare('DELETE FROM erp_quotation_lines WHERE company_id = ? AND quotation_id = ?').bind(a.companyId, id),
    ...input.lines.map((l) =>
      db.prepare('INSERT INTO erp_quotation_lines (company_id, quotation_id, rfq_line_id, unit_price_cents, lead_time_days, note) VALUES (?, ?, ?, ?, ?, ?)').bind(a.companyId, id, l.rfqLineId, l.unitPriceCents ?? null, l.leadTimeDays ?? null, l.note ?? ''),
    ),
    db.prepare("UPDATE erp_rfqs SET status = 'sent', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'").bind(t, a.companyId, q.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: existing ? 'quotation.updated' : 'quotation.recorded', entityType: 'rfq', entityId: q.id, summary: `${q.number}: quotation from ${onIt.number} ${onIt.legal_name} ${existing ? 'changed' : 'recorded'}, ${dollars(subtotal + freight)} ${input.currency ?? q.currency} with freight`, after: { quotation: id, totalCents: subtotal + freight }, at: t }),
  ]);
  return c.json({ id, totalCents: subtotal + freight });
});

procurementRoutes.post('/c/:company/rfqs/:id/:action{select|unselect|approve|cancel}', async (c) => {
  const action = c.req.param('action');
  const a = await requireErp(c, action === 'approve' ? 'purchasing.approve' : action === 'unselect' ? 'purchasing.view' : 'purchasing.edit');
  const db = c.env.DB;
  const q = await loadRfq(db, a.companyId, c.req.param('id'));
  const t = now();
  if (action === 'select') {
    if (q.status !== 'sent') badState(`${q.number} is ${q.status}: select a supplier while quotations are open`);
    const input = await body(c, z.object({ quotationId: zId, reason: zText(1000).min(3, 'Say why this supplier is chosen') }));
    const x = await db.prepare('SELECT x.*, s.number AS supplier_number, s.legal_name, s.status AS supplier_status, s.archived_at FROM erp_quotations x JOIN erp_suppliers s ON s.company_id = x.company_id AND s.id = x.supplier_id WHERE x.company_id = ? AND x.rfq_id = ? AND x.id = ?').bind(a.companyId, q.id, input.quotationId).first<any>();
    if (!x) throw notFound('Quotation');
    if (x.supplier_status !== 'approved' || x.archived_at) badState(`${x.supplier_number} is no longer an approved supplier`);
    const unpriced = await db.prepare('SELECT COUNT(*) AS n FROM erp_rfq_lines l WHERE l.company_id = ? AND l.rfq_id = ? AND NOT EXISTS (SELECT 1 FROM erp_quotation_lines ql WHERE ql.company_id = l.company_id AND ql.quotation_id = ? AND ql.rfq_line_id = l.id AND ql.unit_price_cents IS NOT NULL)').bind(a.companyId, q.id, x.id).first<{ n: number }>();
    if (unpriced?.n) badState(`${x.legal_name}'s quotation has no price for ${unpriced.n} line${unpriced.n === 1 ? '' : 's'}: record the prices first`);
    const res = await db.batch([
      db.prepare("UPDATE erp_rfqs SET status = 'awarded', selected_quotation_id = ?, selection_reason = ?, selected_by = ?, selected_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'sent'").bind(x.id, input.reason, a.userId, t, t, a.companyId, q.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.selected', entityType: 'rfq', entityId: q.id, summary: `${q.number}: ${x.supplier_number} ${x.legal_name} selected (${dollars(x.total_cents)} ${x.currency}): ${input.reason}`, after: { quotation: x.id, reason: input.reason }, at: t }),
    ]);
    if (!res[0].meta.changes) badState('Someone changed this request at the same moment: refresh');
    return c.json({ ok: true, status: 'awarded' });
  }
  const input = await body(c, z.object({ note: zText(1000).optional() }));
  if (action === 'unselect') {
    if (!can(a, 'purchasing.edit') && !can(a, 'purchasing.approve')) throw new HttpError(403, 'Only buyers and procurement managers can do this');
    if (q.status !== 'awarded') badState(`${q.number} is ${q.status}`);
    await db.batch([
      db.prepare("UPDATE erp_rfqs SET status = 'sent', selected_quotation_id = NULL, selected_by = NULL, selected_at = NULL, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'awarded'").bind(t, a.companyId, q.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.selection_returned', entityType: 'rfq', entityId: q.id, summary: `${q.number}: selection returned${input.note ? `: ${input.note}` : ''}`, at: t }),
    ]);
    return c.json({ ok: true, status: 'sent' });
  }
  if (action === 'approve') {
    if (q.status !== 'awarded') badState(`${q.number} is ${q.status}: select a supplier first`);
    const sod = segregation(a, q.selected_by, 'selected this supplier');
    const res = await db.batch([
      db.prepare("UPDATE erp_rfqs SET status = 'approved', approved_by = ?, approved_at = ?, sod_exception = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'awarded'").bind(a.userId, t, sod ? 1 : 0, t, a.companyId, q.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.approved', entityType: 'rfq', entityId: q.id, summary: `${q.number}: supplier choice approved${sod ? ' by the person who chose it (company of one: recorded exception)' : ''}`, after: { sodException: sod }, at: t }),
    ]);
    if (!res[0].meta.changes) badState('Someone changed this request at the same moment: refresh');
    return c.json({ ok: true, status: 'approved' });
  }
  if (!['draft', 'sent', 'awarded', 'approved'].includes(q.status)) badState(`${q.number} is ${q.status}`);
  await db.batch([
    db.prepare("UPDATE erp_rfqs SET status = 'cancelled', updated_at = ? WHERE company_id = ? AND id = ?").bind(t, a.companyId, q.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'rfq.cancelled', entityType: 'rfq', entityId: q.id, summary: `${q.number} cancelled${input.note ? `: ${input.note}` : ''}`, at: t }),
  ]);
  return c.json({ ok: true, status: 'cancelled' });
});
