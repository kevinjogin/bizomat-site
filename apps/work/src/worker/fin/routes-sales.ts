// Quotes and credit notes: list, create, change, the quote lifecycle (send, accept, decline, cancel, duplicate,
// invoice), credit note approval, applying credit, refunds and voids, PDFs and live previews. Also the secure online
// links and emails for quotes, invoices and credit notes.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, newId, notFound, now, randomToken } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { todayIn } from '../../shared/fin/dates';
import { formatMoney } from '../../shared/crm/money';
import { type FinAccess, assertRecord, deny, requireBusiness, requireOrg, requirePerm, scopeSql } from './access';
import { chartOf } from './ledger';
import { type DocRow, loadDoc, priceDocLines } from './docs';
import { fmtDate } from './document';
import { type PartyRow, linkPath, pdfResponse, personName, renderBasics, renderPdf } from './render';
import {
  type CreditInput,
  type CreditRow,
  type QuoteInput,
  type QuoteRow,
  type QuoteSnapshot,
  acceptQuote,
  allocateCredit,
  approveCredit,
  cancelQuote,
  createCredit,
  createQuote,
  creditDTOs,
  creditFromInvoice,
  creditRender,
  declineQuote,
  deleteCredit,
  deleteQuote,
  duplicateQuote,
  expireQuotes,
  invoiceQuote,
  loadCredit,
  loadQuote,
  markQuoteSent,
  priceQuote,
  quoteDTOs,
  quoteEventStmt,
  quoteRender,
  refundCredit,
  removeAllocation,
  snapshotRender,
  updateCredit,
  updateQuote,
  voidCredit,
  voidRefund,
} from './sales';
import { auditStmt, csvOf, finUrl } from './util';
import { queueAndKick } from '../services/email/outbox';
import { refuseExample } from '../system/example';

export const salesRoutes = new Hono<AppEnv>();

const text = (max: number) => z.string().trim().max(max);
const id = () => z.string().max(64);
const isoDate = () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date as YYYY-MM-DD');

const line = z.object({
  lineKind: z.enum(['item', 'heading']).optional(),
  itemCode: text(40).optional(),
  unit: text(20).optional(),
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

const quoteSchema = z.object({
  number: text(40).optional(),
  contactId: id().nullable().optional(),
  issueDate: isoDate(),
  expiryDate: isoDate().nullable().optional(),
  reference: text(200).optional(),
  salesRepId: id().nullable().optional(),
  deliveryAddress: text(500).optional(),
  taxMode: z.enum(['inclusive', 'exclusive', 'none']).optional(),
  discountBp: z.number().int().min(0).max(10_000).optional(),
  templateId: id().nullable().optional(),
  notes: text(4000).optional(),
  terms: text(4000).optional(),
  lines: z.array(line.extend({ optional: z.boolean().optional() })).min(1).max(200),
});

const creditSchema = z.object({
  number: text(40).optional(),
  contactId: id(),
  invoiceId: id().nullable().optional(),
  issueDate: isoDate(),
  reference: text(200).optional(),
  reason: text(1000).optional(),
  taxMode: z.enum(['inclusive', 'exclusive', 'none']).optional(),
  templateId: id().nullable().optional(),
  notes: text(4000).optional(),
  lines: z.array(line).min(1).max(200),
  action: z.enum(['draft', 'approve']).optional(),
});

const wait = (c: any) => (p: Promise<unknown>) => c.executionCtx.waitUntil(p);

const partyOf = (db: D1Database, orgId: string, contactId: string | null | undefined) =>
  contactId ? db.prepare('SELECT name, abn, address, email FROM fin_contacts WHERE id = ? AND org_id = ?').bind(contactId, orgId).first<PartyRow & { email: string }>() : Promise.resolve(null);

function listFilters(c: any, a: FinAccess, alias: string) {
  const scope = scopeSql(a, 'sales', alias);
  const where = [`${alias}.org_id = ?`, `${alias}.deleted_at IS NULL`, scope.sql];
  const args: unknown[] = [a.orgId, ...scope.args];
  const q = (c.req.query('q') ?? '').trim().toLowerCase();
  if (q) {
    where.push(`${alias}.search LIKE ?`);
    args.push(`%${q.replace(/[%_]/g, '')}%`);
  }
  const contact = c.req.query('contact');
  if (contact) {
    where.push(`${alias}.contact_id = ?`);
    args.push(contact);
  }
  const from = c.req.query('from');
  const to = c.req.query('to');
  if (from) {
    where.push(`${alias}.issue_date >= ?`);
    args.push(from);
  }
  if (to) {
    where.push(`${alias}.issue_date <= ?`);
    args.push(to);
  }
  return { where, args };
}

// ------------------------------------------------------------------ quotes

const QUOTE_SELECT = `SELECT q.*, ct.name AS contact_name, sr.name AS sales_rep_name, u.name AS created_by_name
  FROM fin_quotes q LEFT JOIN fin_contacts ct ON ct.id = q.contact_id LEFT JOIN users sr ON sr.id = q.sales_rep_id LEFT JOIN users u ON u.id = q.created_by`;

salesRoutes.get('/orgs/:org/quotes', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  if (a.perms.sales.view === 'none') deny('You cannot see quotes');
  await expireQuotes(c.env.DB, a.orgId, todayIn(a.org.timezone));
  const f = listFilters(c, a, 'q');
  const status = c.req.query('status');
  if (status === 'open') f.where.push("q.status IN ('draft','sent','viewed')");
  else if (status === 'won') f.where.push("q.status IN ('accepted','converted')");
  else if (status && ['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired', 'converted', 'cancelled'].includes(status)) {
    f.where.push('q.status = ?');
    f.args.push(status);
  }
  const deal = c.req.query('deal');
  if (deal) {
    f.where.push('q.crm_deal_id = ?');
    f.args.push(deal);
  }
  const csv = c.req.query('format') === 'csv';
  const rows = await c.env.DB.prepare(`${QUOTE_SELECT} WHERE ${f.where.join(' AND ')} ORDER BY q.issue_date DESC, q.created_at DESC LIMIT ${csv ? 10_000 : 500}`).bind(...f.args).all<any>();
  const dtos = await quoteDTOs(c.env.DB, a, rows.results);
  if (csv) {
    requirePerm(a, 'sales', 'export', 'You cannot export quotes');
    const out: unknown[][] = [['Number', 'Customer', 'Date', 'Expires', 'Reference', 'Status', 'Version', 'Subtotal', 'GST', 'Total', 'Invoiced %']];
    for (const d of dtos) out.push([d.number, d.contactName ?? '', d.issueDate, d.expiryDate ?? '', d.reference, d.status, d.version, (d.subtotal / 100).toFixed(2), (d.taxTotal / 100).toFixed(2), (d.total / 100).toFixed(2), (d.invoicedBp / 100).toString()]);
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'quote.exported', targetType: 'quote', metadata: { rows: dtos.length } }).run();
    return new Response(csvOf(out), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="quotes.csv"' } });
  }
  const open = dtos.filter((d) => ['draft', 'sent', 'viewed'].includes(d.status));
  const won = dtos.filter((d) => d.status === 'accepted' || d.status === 'converted');
  const decided = dtos.filter((d) => ['accepted', 'converted', 'declined'].includes(d.status)).length;
  return c.json({
    rows: dtos,
    totals: { open: open.reduce((n, d) => n + d.total, 0), openCount: open.length, won: won.reduce((n, d) => n + d.total, 0), wonCount: won.length, winRate: decided ? Math.round((won.length / decided) * 100) : null },
  });
});

salesRoutes.post('/orgs/:org/quotes', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, quoteSchema);
  return c.json(await createQuote(c.env, a, input as QuoteInput), 201);
});

async function fullQuote(c: any, quoteId: string) {
  const a = await requireOrg(c);
  await expireQuotes(c.env.DB, a.orgId, todayIn(a.org.timezone));
  await loadQuote(c.env.DB, a, quoteId);
  const row = await c.env.DB.prepare(`${QUOTE_SELECT} WHERE q.id = ? AND q.org_id = ?`).bind(quoteId, a.orgId).first();
  return (await quoteDTOs(c.env.DB, a, [row], true))[0];
}

/** The live preview of a quote: as it would be saved, drawn by the same engine as its PDF. Nothing is saved. */
salesRoutes.post('/orgs/:org/quotes/preview', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  const input = await body(c, quoteSchema.extend({ quoteId: id().optional(), lines: quoteSchema.shape.lines.element.array().max(200) }));
  let existing: QuoteRow | null = null;
  if (input.quoteId) existing = await loadQuote(c.env.DB, a, input.quoteId);
  else if (!a.perms.sales.create) deny('You cannot create quotes');
  const chart = await chartOf(c.env.DB, a);
  const priced = priceQuote(a, chart, input.lines, input.taxMode ?? (a.gst ? 'exclusive' : 'none'), input.discountBp ?? 0);
  const [basics, contact, salesRep] = await Promise.all([renderBasics(c.env, a.orgId, a.org.logo_key, input.templateId), partyOf(c.env.DB, a.orgId, input.contactId), personName(c.env.DB, input.salesRepId)]);
  if (input.contactId && !contact) throw new HttpError(400, 'Choose a customer from this workspace');
  const status = existing && existing.status !== 'draft' && ['sent', 'viewed', 'declined', 'expired'].includes(existing.status) ? 'draft' : (existing?.status ?? 'draft');
  const row = {
    ...(existing ?? {}),
    number: input.number?.trim() || existing?.number || 'Draft',
    status,
    issue_date: input.issueDate,
    expiry_date: input.expiryDate ?? null,
    reference: input.reference ?? '',
    tax_mode: priced.mode,
    discount_bp: input.discountBp ?? 0,
    discount_total: priced.discountTotal,
    subtotal: priced.subtotal,
    tax_total: priced.tax,
    total: priced.total,
    notes: input.notes ?? '',
    terms: input.terms ?? '',
    delivery_address: input.deliveryAddress ?? '',
    accepted_name: existing?.accepted_name ?? '',
    accepted_at: existing?.accepted_at ?? null,
    accepted_online: existing?.accepted_online ?? 0,
  } as QuoteRow;
  const lines = priced.lines.map((l) => ({ ...l, quantity: l.quantityMilli / 1000 }));
  return pdfResponse(await renderPdf(c.env, a, quoteRender(row, lines, basics.rates, salesRep), contact, basics), row.number, true);
});

salesRoutes.get('/orgs/:org/quotes/:id', async (c) => c.json(await fullQuote(c, c.req.param('id'))));

salesRoutes.patch('/orgs/:org/quotes/:id', async (c) => {
  const a = await requireOrg(c);
  const q = await loadQuote(c.env.DB, a, c.req.param('id'));
  const input = await body(c, quoteSchema.partial());
  await updateQuote(c.env, a, q, input as Partial<QuoteInput>);
  return c.json(await fullQuote(c, q.id));
});

salesRoutes.delete('/orgs/:org/quotes/:id', async (c) => {
  const a = await requireOrg(c);
  await deleteQuote(c.env, a, await loadQuote(c.env.DB, a, c.req.param('id')));
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/quotes/:id/sent', async (c) => {
  const a = await requireOrg(c);
  await markQuoteSent(c.env, a, await loadQuote(c.env.DB, a, c.req.param('id')), 'marked');
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/quotes/:id/accept', async (c) => {
  const a = await requireOrg(c);
  const q = await loadQuote(c.env.DB, a, c.req.param('id'));
  const { name } = await body(c, z.object({ name: text(120).min(2, 'Type the name of the person who accepted') }));
  await acceptQuote(c.env, a, q, { name, online: false, actorId: a.userId });
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/quotes/:id/decline', async (c) => {
  const a = await requireOrg(c);
  const q = await loadQuote(c.env.DB, a, c.req.param('id'));
  const { reason } = await body(c, z.object({ reason: text(1000).optional() }));
  await declineQuote(c.env, a, q, { reason: reason ?? '', online: false, actorId: a.userId, name: a.userName });
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/quotes/:id/cancel', async (c) => {
  const a = await requireOrg(c);
  await cancelQuote(c.env, a, await loadQuote(c.env.DB, a, c.req.param('id')));
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/quotes/:id/duplicate', async (c) => {
  const a = await requireOrg(c);
  return c.json(await duplicateQuote(c.env, a, await loadQuote(c.env.DB, a, c.req.param('id'))), 201);
});

salesRoutes.post('/orgs/:org/quotes/:id/invoice', async (c) => {
  const a = await requireOrg(c);
  const q = await loadQuote(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ percent: z.number().min(0.01).max(100).optional(), optionalLineIds: z.array(id()).max(200).optional() }));
  return c.json(await invoiceQuote(c.env, a, q, input, wait(c)), 201);
});

async function quotePdf(env: Env, a: FinAccess, q: QuoteRow) {
  const [basics, lines, contact, salesRep] = await Promise.all([
    renderBasics(env, a.orgId, a.org.logo_key, q.template_id),
    env.DB.prepare('SELECT * FROM fin_quote_lines WHERE quote_id = ? AND org_id = ? ORDER BY line_no').bind(q.id, a.orgId).all<any>(),
    partyOf(env.DB, a.orgId, q.contact_id),
    personName(env.DB, q.sales_rep_id),
  ]);
  return renderPdf(env, a, quoteRender(q, lines.results, basics.rates, salesRep), contact, basics);
}

salesRoutes.get('/orgs/:org/quotes/:id/pdf', async (c) => {
  const a = await requireOrg(c);
  const q = await loadQuote(c.env.DB, a, c.req.param('id'));
  return pdfResponse(await quotePdf(c.env, a, q), q.number, c.req.query('inline') === '1');
});

/** A version as it was sent: drawn from its snapshot, so later changes never alter it. */
async function versionPdf(env: Env, a: FinAccess, q: QuoteRow, version: number) {
  const v = await env.DB.prepare('SELECT snapshot_json FROM fin_quote_versions WHERE quote_id = ? AND org_id = ? AND version = ?').bind(q.id, a.orgId, version).first<{ snapshot_json: string }>();
  if (!v) throw notFound('Version');
  const s = JSON.parse(v.snapshot_json) as QuoteSnapshot;
  const basics = await renderBasics(env, a.orgId, a.org.logo_key, s.templateId);
  const latest = version === q.version;
  const status = latest ? q.status : 'sent';
  const accepted = latest && q.accepted_name ? { name: q.accepted_name, at: q.accepted_at, online: !!q.accepted_online } : undefined;
  return renderPdf(env, a, snapshotRender(s, status, accepted), s.contact, basics);
}

salesRoutes.get('/orgs/:org/quotes/:id/versions/:v/pdf', async (c) => {
  const a = await requireOrg(c);
  const q = await loadQuote(c.env.DB, a, c.req.param('id'));
  const v = Number(c.req.param('v'));
  if (!Number.isInteger(v) || v < 1) throw notFound('Version');
  return pdfResponse(await versionPdf(c.env, a, q, v), `${q.number}-v${v}`, c.req.query('inline') === '1');
});

// ------------------------------------------------------------------ credit notes

const CREDIT_SELECT = `SELECT n.*, ct.name AS contact_name, d.number AS invoice_number, u.name AS created_by_name
  FROM fin_credit_notes n LEFT JOIN fin_contacts ct ON ct.id = n.contact_id LEFT JOIN fin_docs d ON d.id = n.invoice_id LEFT JOIN users u ON u.id = n.created_by`;

salesRoutes.get('/orgs/:org/credit-notes', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  if (a.perms.sales.view === 'none') deny('You cannot see credit notes');
  const f = listFilters(c, a, 'n');
  const status = c.req.query('status');
  if (status === 'open') f.where.push("n.status = 'approved'");
  else if (status && ['draft', 'approved', 'applied', 'void'].includes(status)) {
    f.where.push('n.status = ?');
    f.args.push(status);
  }
  const invoice = c.req.query('invoice');
  if (invoice) {
    f.where.push('n.invoice_id = ?');
    f.args.push(invoice);
  }
  const csv = c.req.query('format') === 'csv';
  const rows = await c.env.DB.prepare(`${CREDIT_SELECT} WHERE ${f.where.join(' AND ')} ORDER BY n.issue_date DESC, n.created_at DESC LIMIT ${csv ? 10_000 : 500}`).bind(...f.args).all<any>();
  const dtos = await creditDTOs(c.env.DB, a, rows.results);
  if (csv) {
    requirePerm(a, 'sales', 'export', 'You cannot export credit notes');
    const out: unknown[][] = [['Number', 'Customer', 'Date', 'Invoice', 'Reason', 'Status', 'Subtotal', 'GST', 'Total', 'Applied', 'Refunded', 'Remaining']];
    for (const d of dtos) out.push([d.number, d.contactName ?? '', d.issueDate, d.invoiceNumber ?? '', d.reason, d.status, (d.subtotal / 100).toFixed(2), (d.taxTotal / 100).toFixed(2), (d.total / 100).toFixed(2), (d.allocated / 100).toFixed(2), (d.refunded / 100).toFixed(2), (d.remaining / 100).toFixed(2)]);
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.exported', targetType: 'credit_note', metadata: { rows: dtos.length } }).run();
    return new Response(csvOf(out), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="credit-notes.csv"' } });
  }
  const live = dtos.filter((d) => d.status !== 'void' && d.status !== 'draft');
  return c.json({ rows: dtos, totals: { total: live.reduce((n, d) => n + d.total, 0), remaining: live.reduce((n, d) => n + d.remaining, 0) } });
});

salesRoutes.post('/orgs/:org/credit-notes', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, creditSchema);
  return c.json(await createCredit(c.env, a, input as CreditInput), 201);
});

/** A new credit note's details from an invoice (its customer and lines), for the editor. Saves nothing. */
salesRoutes.get('/orgs/:org/credit-notes/from-invoice/:invoice', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  if (!a.perms.sales.create) deny('You cannot create credit notes');
  return c.json(await creditFromInvoice(c.env.DB, a, c.req.param('invoice')));
});

async function fullCredit(c: any, noteId: string) {
  const a = await requireOrg(c);
  await loadCredit(c.env.DB, a, noteId);
  const row = await c.env.DB.prepare(`${CREDIT_SELECT} WHERE n.id = ? AND n.org_id = ?`).bind(noteId, a.orgId).first();
  return (await creditDTOs(c.env.DB, a, [row], true))[0];
}

salesRoutes.post('/orgs/:org/credit-notes/preview', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  const input = await body(c, creditSchema.extend({ creditNoteId: id().optional(), contactId: id().optional(), lines: z.array(line).max(200) }));
  let existing: CreditRow | null = null;
  if (input.creditNoteId) existing = await loadCredit(c.env.DB, a, input.creditNoteId);
  else if (!a.perms.sales.create) deny('You cannot create credit notes');
  const chart = await chartOf(c.env.DB, a);
  const priced = priceDocLines(a, chart, input.lines, input.taxMode ?? (a.gst ? 'exclusive' : 'none'), 'credit_note', false, 0);
  const [basics, contact, invoice] = await Promise.all([
    renderBasics(c.env, a.orgId, a.org.logo_key, input.templateId),
    partyOf(c.env.DB, a.orgId, input.contactId),
    input.invoiceId ? c.env.DB.prepare("SELECT number FROM fin_docs WHERE id = ? AND org_id = ? AND kind = 'invoice'").bind(input.invoiceId, a.orgId).first<{ number: string }>() : Promise.resolve(null),
  ]);
  const row = {
    ...(existing ?? { allocated: 0, refunded: 0 }),
    number: input.number?.trim() || existing?.number || 'Draft',
    status: existing?.status ?? 'draft',
    issue_date: input.issueDate,
    reference: input.reference ?? '',
    reason: input.reason ?? '',
    tax_mode: priced.mode,
    subtotal: priced.subtotal,
    tax_total: priced.tax,
    total: priced.total,
    notes: input.notes ?? '',
    invoice_number: invoice?.number ?? null,
  } as CreditRow & { invoice_number: string | null };
  const lines = priced.lines.map((l) => ({ ...l, quantity: l.quantityMilli / 1000 }));
  return pdfResponse(await renderPdf(c.env, a, creditRender(row, lines, basics.rates), contact, basics), row.number, true);
});

salesRoutes.get('/orgs/:org/credit-notes/:id', async (c) => c.json(await fullCredit(c, c.req.param('id'))));

salesRoutes.patch('/orgs/:org/credit-notes/:id', async (c) => {
  const a = await requireOrg(c);
  const n = await loadCredit(c.env.DB, a, c.req.param('id'));
  const input = await body(c, creditSchema.partial());
  await updateCredit(c.env, a, n, input as Partial<CreditInput>);
  return c.json(await fullCredit(c, n.id));
});

salesRoutes.delete('/orgs/:org/credit-notes/:id', async (c) => {
  const a = await requireOrg(c);
  await deleteCredit(c.env, a, await loadCredit(c.env.DB, a, c.req.param('id')));
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/credit-notes/:id/approve', async (c) => {
  const a = await requireOrg(c);
  await approveCredit(c.env, a, await loadCredit(c.env.DB, a, c.req.param('id')));
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/credit-notes/:id/void', async (c) => {
  const a = await requireOrg(c);
  const n = await loadCredit(c.env.DB, a, c.req.param('id'));
  const { date } = await body(c, z.object({ date: isoDate().nullable().optional() }));
  await voidCredit(c.env, a, n, date);
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/credit-notes/:id/allocations', async (c) => {
  const a = await requireOrg(c);
  const n = await loadCredit(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ invoiceId: id(), amount: z.number().int().min(1), date: isoDate().optional() }));
  await allocateCredit(c.env, a, n, input);
  return c.json({ ok: true }, 201);
});

salesRoutes.post('/orgs/:org/credit-notes/:id/allocations/:aid/remove', async (c) => {
  const a = await requireOrg(c);
  await removeAllocation(c.env, a, await loadCredit(c.env.DB, a, c.req.param('id')), c.req.param('aid'));
  return c.json({ ok: true });
});

salesRoutes.post('/orgs/:org/credit-notes/:id/refunds', async (c) => {
  const a = await requireOrg(c);
  const n = await loadCredit(c.env.DB, a, c.req.param('id'));
  const input = await body(c, z.object({ accountId: id(), date: isoDate(), amount: z.number().int().min(1), reference: text(100).optional() }));
  return c.json(await refundCredit(c.env, a, n, input), 201);
});

salesRoutes.post('/orgs/:org/credit-notes/:id/refunds/:rid/void', async (c) => {
  const a = await requireOrg(c);
  const n = await loadCredit(c.env.DB, a, c.req.param('id'));
  const { date } = await body(c, z.object({ date: isoDate().nullable().optional() }));
  await voidRefund(c.env, a, n, c.req.param('rid'), date);
  return c.json({ ok: true });
});

async function creditPdf(env: Env, a: FinAccess, n: CreditRow) {
  const [basics, lines, contact, invoice] = await Promise.all([
    renderBasics(env, a.orgId, a.org.logo_key, n.template_id),
    env.DB.prepare('SELECT * FROM fin_credit_note_lines WHERE credit_note_id = ? AND org_id = ? ORDER BY line_no').bind(n.id, a.orgId).all<any>(),
    partyOf(env.DB, a.orgId, n.contact_id),
    n.invoice_id ? env.DB.prepare('SELECT number FROM fin_docs WHERE id = ? AND org_id = ?').bind(n.invoice_id, a.orgId).first<{ number: string }>() : Promise.resolve(null),
  ]);
  return renderPdf(env, a, creditRender({ ...n, invoice_number: invoice?.number ?? null }, lines.results, basics.rates), contact, basics);
}

salesRoutes.get('/orgs/:org/credit-notes/:id/pdf', async (c) => {
  const a = await requireOrg(c);
  const n = await loadCredit(c.env.DB, a, c.req.param('id'));
  return pdfResponse(await creditPdf(c.env, a, n), n.number, c.req.query('inline') === '1');
});

// ------------------------------------------------------------------ secure online links and email

type Shared = { kind: 'quote'; row: QuoteRow } | { kind: 'invoice'; row: DocRow } | { kind: 'credit_note'; row: CreditRow };

const TABLE = { quote: 'fin_quotes', invoice: 'fin_docs', credit_note: 'fin_credit_notes' } as const;

async function loadShared(c: any, a: FinAccess, kind: Shared['kind'], recordId: string): Promise<Shared> {
  if (kind === 'quote') return { kind, row: await loadQuote(c.env.DB, a, recordId) };
  if (kind === 'credit_note') return { kind, row: await loadCredit(c.env.DB, a, recordId) };
  const d = await loadDoc(c.env.DB, a, recordId);
  if (d.kind !== 'invoice') throw new HttpError(400, 'Only invoices are shared online');
  return { kind, row: d };
}

/** Whether the record may go to the customer as it is: an approved invoice or credit note, a quote that can be sent. */
function assertShareable(a: FinAccess, s: Shared) {
  assertRecord(a, 'sales', 'edit', s.row, 'Record');
  if (s.kind === 'invoice' && !['approved', 'part_paid', 'paid'].includes(s.row.status)) throw new HttpError(400, 'Approve the invoice before sending it');
  if (s.kind === 'credit_note' && !['approved', 'applied'].includes(s.row.status)) throw new HttpError(400, 'Approve the credit note before sending it');
  if (s.kind === 'quote' && !['draft', 'sent', 'viewed'].includes(s.row.status)) throw new HttpError(409, `This quote is ${s.row.status}`);
}

/** The record's online link, made the first time it is needed. */
async function ensureLink(env: Env, a: FinAccess, s: Shared): Promise<string> {
  let nonce = s.row.public_nonce;
  if (!nonce) {
    nonce = randomToken(18);
    const r = await env.DB.prepare(`UPDATE ${TABLE[s.kind]} SET public_nonce = ? WHERE id = ? AND org_id = ? AND public_nonce IS NULL`).bind(nonce, s.row.id, a.orgId).run();
    if (!r.meta.changes) nonce = (await env.DB.prepare(`SELECT public_nonce FROM ${TABLE[s.kind]} WHERE id = ?`).bind(s.row.id).first<{ public_nonce: string }>())!.public_nonce;
  }
  return finUrl(env, await linkPath(env, s.kind, s.row.id, nonce!));
}

async function sentStmts(env: Env, a: FinAccess, s: Shared, how: 'link' | 'email' | 'marked', detail: Record<string, unknown>) {
  const db = env.DB;
  if (s.kind === 'quote') {
    await markQuoteSent(env, a, s.row, how, detail);
    return;
  }
  const t = now();
  await db.batch([
    db.prepare(`UPDATE ${TABLE[s.kind]} SET sent_at = COALESCE(sent_at, ?), updated_at = ? WHERE id = ? AND org_id = ?`).bind(t, t, s.row.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: `${s.kind}.${how === 'email' ? 'emailed' : how === 'link' ? 'link_created' : 'marked_sent'}`, targetType: s.kind === 'invoice' ? 'doc' : s.kind, targetId: s.row.id, metadata: detail }),
  ]);
}

const KIND_PATH: Record<string, Shared['kind']> = { quotes: 'quote', docs: 'invoice', 'credit-notes': 'credit_note' };

for (const [path, kind] of Object.entries(KIND_PATH)) {
  /** The secure online link (made on first use). A quote shared this way counts as sent. */
  salesRoutes.post(`/orgs/:org/${path}/:id/link`, async (c) => {
    const a = await requireOrg(c);
    requireBusiness(a);
    const s = await loadShared(c, a, kind, c.req.param('id'));
    assertShareable(a, s);
    if (s.kind === 'quote' && !s.row.contact_id) throw new HttpError(400, 'Choose the customer first');
    const url = await ensureLink(c.env, a, s);
    await sentStmts(c.env, a, s, 'link', {});
    return c.json({ url });
  });

  /** Withdraw the link: the address stops working. A new one can be made later. */
  salesRoutes.delete(`/orgs/:org/${path}/:id/link`, async (c) => {
    const a = await requireOrg(c);
    const s = await loadShared(c, a, kind, c.req.param('id'));
    assertRecord(a, 'sales', 'edit', s.row, 'Record');
    await c.env.DB.batch([
      c.env.DB.prepare(`UPDATE ${TABLE[kind]} SET public_nonce = NULL WHERE id = ? AND org_id = ?`).bind(s.row.id, a.orgId),
      ...(kind === 'quote' ? [quoteEventStmt(c.env.DB, a.orgId, s.row.id, 'link_withdrawn', { id: a.userId, name: a.userName })] : []),
      auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: `${kind}.link_withdrawn`, targetType: kind === 'invoice' ? 'doc' : kind, targetId: s.row.id }),
    ]);
    return c.json({ ok: true });
  });

  /**
   * Email the customer the online link (the email holds the link, not the file). Needs email to be set up on this
   * service; sending never marks an invoice paid.
   */
  salesRoutes.post(`/orgs/:org/${path}/:id/email`, async (c) => {
    const a = await requireOrg(c);
    requireBusiness(a);
    await refuseExample(c.env.DB, 'finance', a.orgId, 'email');
    await rateLimit(c.env.DB, `fin-doc-email:${a.userId}`, 30, 60 * 60_000);
    const s = await loadShared(c, a, kind, c.req.param('id'));
    assertShareable(a, s);
    const input = await body(c, z.object({ to: z.string().trim().email('Enter a valid email address').max(254).optional(), message: text(2000).optional() }));
    const contact = await partyOf(c.env.DB, a.orgId, s.row.contact_id);
    const to = input.to ?? contact?.email ?? '';
    if (!to) throw new HttpError(400, 'The customer has no email address: add one, or type the address');
    const url = await ensureLink(c.env, a, s);
    const amount = formatMoney(s.kind === 'invoice' ? s.row.total - s.row.amount_paid : s.kind === 'credit_note' ? s.row.total : s.row.total, a.org.currency);
    const date = s.kind === 'quote' ? s.row.expiry_date : s.kind === 'invoice' ? s.row.due_date : null;
    const r = await queueAndKick(c.env, wait(c), {
      to,
      toName: contact?.name ?? '',
      data: { template: 'fin_document', organisation: a.org.legal_name || a.org.name, replyEmail: a.org.email || null, kind: s.kind, number: s.row.number, amount, dateLabel: s.kind === 'quote' ? 'Valid until' : s.kind === 'invoice' ? 'Due' : null, date: date ? fmtDate(date) : null, url, message: input.message ?? null },
      idempotencyKey: `fin-doc:${s.kind}:${s.row.id}:${newId()}`,
      sensitive: true,
    });
    if (!r.queued) {
      if (r.reason === 'not_configured') throw new HttpError(503, 'Email is not set up on this service yet. Copy the link and send it from your own email instead.');
      if (r.reason === 'invalid_address') throw new HttpError(400, 'Enter a valid email address');
      if (r.reason === 'suppressed') throw new HttpError(409, 'Email to this address bounced or was refused before, so nothing was sent. Check the address.');
      throw new HttpError(409, 'This email was already queued');
    }
    await sentStmts(c.env, a, s, 'email', { to });
    return c.json({ ok: true, to });
  });
}
