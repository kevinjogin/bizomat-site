// Invoices, bills, purchase orders and expense claims: list, create, change, submit, approve, return, void, delete,
// payments, purchase order to bill, mark as sent, PDF and CSV.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, now } from '../lib/util';
import { todayIn } from '../../shared/fin/dates';
import { DOC_KINDS, DOC_LABELS, type DocKind } from '../../shared/fin/settings';
import { assertRecord, deny, requireBusiness, requireOrg, requirePerm, scopeSql } from './access';
import { type DocInput, addPayment, approveDoc, createDoc, docDTOs, docInput, docLink, loadDoc, moduleOf, updateDoc, voidDoc, voidPayment } from './docs';
import { invoicePdf } from './pdf';
import { auditStmt, csvOf, finNotify, runBatch } from './util';

export const docRoutes = new Hono<AppEnv>();

const text = (max: number) => z.string().trim().max(max);
const id = () => z.string().max(64);
const isoDate = () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date as YYYY-MM-DD');

const docLine = z.object({
  description: text(1000).optional(),
  quantity: z.number().min(-1_000_000).max(1_000_000).optional(),
  unitPrice: z.number().int().min(-1_000_000_000_000).max(1_000_000_000_000),
  discountBp: z.number().int().min(0).max(10_000).optional(),
  accountId: id().nullable().optional(),
  taxCodeId: id().nullable().optional(),
  departmentId: id().nullable().optional(),
  projectId: id().nullable().optional(),
  costCentreId: id().nullable().optional(),
});

const docSchema = z.object({
  kind: z.enum(DOC_KINDS as [DocKind, ...DocKind[]]),
  number: text(40).optional(),
  contactId: id().nullable().optional(),
  claimantId: id().nullable().optional(),
  issueDate: isoDate(),
  dueDate: isoDate().nullable().optional(),
  reference: text(200).optional(),
  taxMode: z.enum(['inclusive', 'exclusive', 'none']).optional(),
  templateId: id().nullable().optional(),
  notes: text(4000).optional(),
  terms: text(2000).optional(),
  lines: z.array(docLine).min(1).max(200),
  action: z.enum(['draft', 'submit', 'approve']).optional(),
});

const kindOf = (s: string | undefined): DocKind => {
  const k = (s ?? '').replace(/-/g, '_') as DocKind;
  if (!DOC_KINDS.includes(k)) throw new HttpError(404, 'Not found');
  return k;
};

const SELECT = `SELECT d.*, ct.name AS contact_name, cu.name AS claimant_name, u.name AS created_by_name,
  (SELECT COUNT(*) FROM fin_files f WHERE f.org_id = d.org_id AND f.parent_type = 'doc' AND f.parent_id = d.id AND f.deleted_at IS NULL) AS file_count
  FROM fin_docs d LEFT JOIN fin_contacts ct ON ct.id = d.contact_id LEFT JOIN users cu ON cu.id = d.claimant_id LEFT JOIN users u ON u.id = d.created_by`;

docRoutes.get('/orgs/:org/docs', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  const kind = kindOf(c.req.query('kind'));
  const m = moduleOf(kind);
  if (a.perms[m].view === 'none') deny('You cannot see these records');
  const scope = scopeSql(a, m, 'd');
  const where = ['d.org_id = ?', 'd.kind = ?', 'd.deleted_at IS NULL', scope.sql];
  const args: unknown[] = [a.orgId, kind, ...scope.args];
  // A claim is also visible to the person reimbursed.
  if (kind === 'expense_claim' && a.perms[m].view === 'own') {
    where[3] = '(d.created_by = ? OR d.claimant_id = ?)';
    args.splice(2, scope.args.length, a.userId, a.userId);
  }
  const today = todayIn(a.org.timezone);
  const status = c.req.query('status');
  if (status === 'open') where.push("d.status IN ('approved','part_paid')");
  else if (status === 'overdue') {
    where.push("d.status IN ('approved','part_paid') AND d.due_date < ?");
    args.push(today);
  } else if (status === 'awaiting') where.push("d.status IN ('draft','submitted')");
  else if (status && ['draft', 'submitted', 'approved', 'part_paid', 'paid', 'billed', 'void'].includes(status)) {
    where.push('d.status = ?');
    args.push(status);
  }
  const q = (c.req.query('q') ?? '').trim().toLowerCase();
  if (q) {
    where.push('d.search LIKE ?');
    args.push(`%${q.replace(/[%_]/g, '')}%`);
  }
  const contact = c.req.query('contact');
  if (contact) {
    where.push('d.contact_id = ?');
    args.push(contact);
  }
  const from = c.req.query('from');
  const to = c.req.query('to');
  if (from) {
    where.push('d.issue_date >= ?');
    args.push(from);
  }
  if (to) {
    where.push('d.issue_date <= ?');
    args.push(to);
  }
  const csv = c.req.query('format') === 'csv';
  const rows = await c.env.DB.prepare(`${SELECT} WHERE ${where.join(' AND ')} ORDER BY d.issue_date DESC, d.created_at DESC LIMIT ${csv ? 10_000 : 500}`).bind(...args).all<any>();
  const dtos = await docDTOs(c.env.DB, a, rows.results, today);
  if (csv) {
    requirePerm(a, m, 'export', 'You cannot export these records');
    const out: unknown[][] = [['Number', 'Contact', 'Date', 'Due', 'Reference', 'Status', 'Subtotal', 'GST', 'Total', 'Paid', 'Due amount']];
    for (const d of dtos) out.push([d.number, d.contactName ?? d.claimantName ?? '', d.issueDate, d.dueDate ?? '', d.reference, d.status, (d.subtotal / 100).toFixed(2), (d.taxTotal / 100).toFixed(2), (d.total / 100).toFixed(2), (d.amountPaid / 100).toFixed(2), (d.amountDue / 100).toFixed(2)]);
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: `${kind}.exported`, targetType: 'doc', metadata: { rows: dtos.length } }).run();
    return new Response(csvOf(out), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${DOC_LABELS[kind].path}.csv"` } });
  }
  const totals = dtos.reduce((t, d) => ({ total: t.total + (d.status === 'void' ? 0 : d.total), due: t.due + d.amountDue, overdue: t.overdue + (d.overdue ? d.amountDue : 0) }), { total: 0, due: 0, overdue: 0 });
  return c.json({ rows: dtos, totals });
});

docRoutes.post('/orgs/:org/docs', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, docSchema);
  const r = await createDoc(c.env, a, input as DocInput, (p) => c.executionCtx.waitUntil(p));
  return c.json(r, 201);
});

async function fullDoc(c: any, docId: string) {
  const a = await requireOrg(c);
  await loadDoc(c.env.DB, a, docId);
  const row = await c.env.DB.prepare(`${SELECT} WHERE d.id = ? AND d.org_id = ?`).bind(docId, a.orgId).first();
  return (await docDTOs(c.env.DB, a, [row], todayIn(a.org.timezone), true))[0];
}

docRoutes.get('/orgs/:org/docs/:id', async (c) => c.json(await fullDoc(c, c.req.param('id'))));

docRoutes.patch('/orgs/:org/docs/:id', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  const input = await body(c, docSchema.partial().omit({ kind: true }));
  await updateDoc(c.env, a, d, input as Partial<DocInput>, (p) => c.executionCtx.waitUntil(p));
  return c.json(await fullDoc(c, d.id));
});

docRoutes.post('/orgs/:org/docs/:id/submit', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  if (d.status !== 'draft') throw new HttpError(409, 'Only a draft is submitted');
  await updateDoc(c.env, a, d, { action: 'submit' }, (p) => c.executionCtx.waitUntil(p));
  return c.json({ ok: true });
});

docRoutes.post('/orgs/:org/docs/:id/approve', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  await approveDoc(c.env, a, d, (p) => c.executionCtx.waitUntil(p));
  return c.json({ ok: true });
});

docRoutes.post('/orgs/:org/docs/:id/reject', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  if (!a.perms[moduleOf(d.kind)].approve) deny('You cannot approve these records');
  if (d.status !== 'submitted') throw new HttpError(409, 'Only a submitted document is returned');
  const { note } = await body(c, z.object({ note: text(500).min(1, 'Say why it is returned') }));
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE fin_docs SET status = 'draft', rejected_note = ?, submitted_at = NULL, updated_at = ? WHERE id = ? AND org_id = ?").bind(note, now(), d.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: `${d.kind}.returned`, targetType: 'doc', targetId: d.id, after: { note } }),
  ]);
  if (d.created_by) await finNotify(c.env, { orgId: a.orgId, orgName: a.org.name, userIds: [d.created_by], type: 'approved', title: `${a.userName} returned ${DOC_LABELS[d.kind].one.toLowerCase()} ${d.number}`, body: note, link: docLink(a.orgId, d), actorId: a.userId }, (p) => c.executionCtx.waitUntil(p));
  return c.json({ ok: true });
});

docRoutes.post('/orgs/:org/docs/:id/void', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  const { date } = await body(c, z.object({ date: isoDate().nullable().optional() }));
  await voidDoc(c.env, a, d, date);
  return c.json({ ok: true });
});

docRoutes.delete('/orgs/:org/docs/:id', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  assertRecord(a, moduleOf(d.kind), 'delete', d, DOC_LABELS[d.kind].one);
  if (d.status !== 'draft' && d.status !== 'submitted') throw new HttpError(409, 'Approved documents are voided, not deleted');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_docs SET deleted_at = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(now(), now(), d.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: `${d.kind}.deleted`, targetType: 'doc', targetId: d.id }),
  ]);
  return c.json({ ok: true });
});

docRoutes.post('/orgs/:org/docs/:id/payments', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ accountId: id(), date: isoDate(), amount: z.number().int().min(1), reference: text(100).optional() }));
  return c.json(await addPayment(c.env, a, d, input), 201);
});

docRoutes.post('/orgs/:org/docs/:id/payments/:pid/void', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  const { date } = await body(c, z.object({ date: isoDate().nullable().optional() }));
  await voidPayment(c.env, a, d, c.req.param('pid'), date);
  return c.json({ ok: true });
});

/** A purchase order becomes a draft bill with the same supplier and lines. */
docRoutes.post('/orgs/:org/docs/:id/convert', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  if (d.kind !== 'purchase_order') throw new HttpError(400, 'Only purchase orders become bills');
  if (d.status === 'billed' || d.status === 'void') throw new HttpError(409, `This purchase order is ${d.status}`);
  const input = await docInput(c.env.DB, d);
  const today = todayIn(a.org.timezone);
  const bill = await createDoc(c.env, a, { ...input, kind: 'bill', number: undefined, issueDate: today, dueDate: null, reference: d.number, action: 'draft', sourceDocId: d.id });
  await runBatch(c.env.DB, [
    c.env.DB.prepare("UPDATE fin_docs SET status = 'billed', updated_at = ? WHERE id = ? AND org_id = ?").bind(now(), d.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'purchase_order.billed', targetType: 'doc', targetId: d.id, after: { bill: bill.id } }),
  ]);
  return c.json(bill, 201);
});

docRoutes.post('/orgs/:org/docs/:id/sent', async (c) => {
  const a = await requireOrg(c);
  const d = await loadDoc(c.env.DB, a, c.req.param('id'));
  assertRecord(a, moduleOf(d.kind), 'edit', d);
  await c.env.DB.batch([c.env.DB.prepare('UPDATE fin_docs SET sent_at = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(now(), now(), d.id, a.orgId), auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: `${d.kind}.marked_sent`, targetType: 'doc', targetId: d.id })]);
  return c.json({ ok: true });
});

docRoutes.get('/orgs/:org/docs/:id/pdf', async (c) => {
  const a = await requireOrg(c);
  const dto = await fullDoc(c, c.req.param('id'));
  const tpl = await c.env.DB.prepare(dto.templateId ? 'SELECT * FROM fin_doc_templates WHERE id = ? AND org_id = ?' : 'SELECT * FROM fin_doc_templates WHERE org_id = ? ORDER BY is_default DESC LIMIT 1').bind(...(dto.templateId ? [dto.templateId, a.orgId] : [a.orgId])).first<any>();
  const contact = dto.contactId ? await c.env.DB.prepare('SELECT * FROM fin_contacts WHERE id = ? AND org_id = ?').bind(dto.contactId, a.orgId).first<any>() : null;
  const taxCodes = await c.env.DB.prepare('SELECT id, code, name, rate_bp FROM fin_tax_codes WHERE org_id = ?').bind(a.orgId).all<any>();
  let logo: Uint8Array | null = null;
  if (a.org.logo_key) {
    const obj = await c.env.FILES.get(a.org.logo_key);
    if (obj) logo = new Uint8Array(await obj.arrayBuffer());
  }
  const bytes = await invoicePdf({ org: a.org, gst: a.gst, doc: dto, contact, template: tpl, taxCodes: taxCodes.results, logo });
  return new Response(bytes, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${dto.number.replace(/[^A-Za-z0-9_-]/g, '_')}.pdf"`, 'Cache-Control': 'private, no-store' } });
});

