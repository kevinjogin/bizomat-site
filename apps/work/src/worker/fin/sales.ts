// Quotes and credit notes (business workspaces), alongside the invoices in docs.ts.
//
// Quotes: a draft is changed freely. Once sent (marked sent, emailed or shared by link) each version is kept exactly as
// it went out (fin_quote_versions), and changing it starts the next version as a draft and withdraws the old link. The
// customer accepts or declines through the secure online link, or a member records their answer. An accepted quote is
// never changed; it is invoiced in full or in parts (progress invoicing), each part a draft invoice that Finance's own
// approval posts. A quote posts nothing to the ledger.
//
// Credit notes: a credit to a customer, on its own or against an invoice. Approving one posts the reverse of a sale
// (income and GST debited, the customer's receivable credited). Its credit is then applied to the customer's invoices
// (which posts nothing: both sit in the same receivable) or paid back to them (a refund, recorded only: BIZOMAT does not
// move money).

import { HttpError, newId, notFound, now, placeholders } from '../lib/util';
import { addDays, isIsoDate, todayIn } from '../../shared/fin/dates';
import type { TaxMode } from '../../shared/fin/tax';
import type { Env } from '../env';
import { type FinAccess, assertMember, assertRecord, canRecord, deny, requireBusiness } from './access';
import { type Chart, type PricedLine, chartOf, docLineAmount, documentLines, journalStmts, reversalStmts, side, systemAccount, validateJournal } from './ledger';
import { type DocLineInput, type PricedDocLine, createDoc, lessDiscount, mayApprove, priceDocLines } from './docs';
import { moneyAccount } from './transactions';
import { auditStmt, runBatch, searchText } from './util';
import { type RenderDoc, type RenderLine, discountOf, renderLine } from './render';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired' | 'converted' | 'cancelled';
export type CreditStatus = 'draft' | 'approved' | 'applied' | 'void';

/** A quote is valid for this many days unless an expiry date is chosen. */
export const QUOTE_VALID_DAYS = 30;

export interface QuoteLineInput extends DocLineInput {
  /** Shown with its price, not in the total. */
  optional?: boolean;
}

export interface QuoteInput {
  number?: string;
  contactId?: string | null;
  issueDate: string;
  expiryDate?: string | null;
  reference?: string;
  salesRepId?: string | null;
  deliveryAddress?: string;
  taxMode?: TaxMode;
  discountBp?: number;
  templateId?: string | null;
  notes?: string;
  terms?: string;
  lines: QuoteLineInput[];
}

export interface QuoteRow {
  id: string;
  org_id: string;
  number: string;
  contact_id: string | null;
  crm_deal_id: string | null;
  issue_date: string;
  expiry_date: string | null;
  reference: string;
  sales_rep_id: string | null;
  delivery_address: string;
  tax_mode: TaxMode;
  discount_bp: number;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  total: number;
  invoiced_bp: number;
  status: QuoteStatus;
  version: number;
  template_id: string | null;
  notes: string;
  terms: string;
  public_nonce: string | null;
  sent_at: number | null;
  viewed_at: number | null;
  accepted_at: number | null;
  accepted_name: string;
  accepted_online: number;
  declined_at: number | null;
  decline_reason: string;
  search: string;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface CreditInput {
  number?: string;
  contactId: string;
  invoiceId?: string | null;
  issueDate: string;
  reference?: string;
  reason?: string;
  taxMode?: TaxMode;
  templateId?: string | null;
  notes?: string;
  lines: DocLineInput[];
  action?: 'draft' | 'approve';
}

export interface CreditRow {
  id: string;
  org_id: string;
  number: string;
  contact_id: string;
  invoice_id: string | null;
  issue_date: string;
  reference: string;
  reason: string;
  tax_mode: TaxMode;
  subtotal: number;
  tax_total: number;
  total: number;
  allocated: number;
  refunded: number;
  status: CreditStatus;
  template_id: string | null;
  notes: string;
  journal_id: string | null;
  void_journal_id: string | null;
  public_nonce: string | null;
  sent_at: number | null;
  viewed_at: number | null;
  search: string;
  created_by: string | null;
  approved_by: string | null;
  approved_at: number | null;
  voided_at: number | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ------------------------------------------------------------------ shared checks

async function checkRefs(db: D1Database, a: FinAccess, r: { contactId?: string | null; templateId?: string | null; salesRepId?: string | null; lines: unknown[] }) {
  requireBusiness(a);
  if (r.contactId) {
    const ct = await db.prepare('SELECT id FROM fin_contacts WHERE id = ? AND org_id = ?').bind(r.contactId, a.orgId).first();
    if (!ct) throw new HttpError(400, 'Choose a customer from this workspace');
  }
  if (r.templateId) {
    const t = await db.prepare('SELECT 1 FROM fin_doc_templates WHERE id = ? AND org_id = ?').bind(r.templateId, a.orgId).first();
    if (!t) throw new HttpError(400, 'Choose a template from this workspace');
  }
  if (r.salesRepId) await assertMember(db, a.orgId, r.salesRepId, 'The salesperson');
  if (!r.lines.length) throw new HttpError(400, 'Add at least one line');
  if (r.lines.length > 200) throw new HttpError(400, 'At most 200 lines');
}

/** The next number for a kind of record (inside the same batch that uses it), or the one typed. */
function numbering(db: D1Database, a: FinAccess, key: 'quote' | 'credit_note', custom: string | undefined) {
  const typed = custom?.trim();
  if (typed) return { sql: '?', args: [typed.slice(0, 40)], stmts: [] as D1PreparedStatement[] };
  return {
    sql: `? || printf('%04d', (SELECT last_number FROM fin_counters WHERE org_id = ? AND key = ?))`,
    args: [a.settings.prefixes[key], a.orgId, key],
    stmts: [db.prepare('INSERT INTO fin_counters (org_id, key, last_number) VALUES (?, ?, 1) ON CONFLICT(org_id, key) DO UPDATE SET last_number = last_number + 1').bind(a.orgId, key)],
  };
}

const contactName = async (db: D1Database, id: string | null | undefined) => (id ? ((await db.prepare('SELECT name FROM fin_contacts WHERE id = ?').bind(id).first<{ name: string }>())?.name ?? '') : '');

// ------------------------------------------------------------------ quotes: pricing and storing

/** Lines priced like an invoice's; optional lines are priced but left out of the totals. */
export function priceQuote(a: FinAccess, chart: Chart, lines: QuoteLineInput[], mode: TaxMode, discountBp: number) {
  const p = priceDocLines(a, chart, lines, mode, 'quote', false, discountBp);
  const counted = p.lines.filter((l) => !(l as QuoteLineInput).optional);
  const subtotal = counted.reduce((n, l) => n + l.net, 0);
  const tax = counted.reduce((n, l) => n + l.tax, 0);
  const discountTotal = counted.reduce((n, l) => n + (l.amount - l.discounted), 0);
  return { lines: p.lines as (PricedDocLine & { optional?: boolean })[], mode: p.mode, subtotal, tax, total: subtotal + tax, discountTotal };
}

function quoteLineStmts(db: D1Database, a: FinAccess, quoteId: string, lines: (PricedDocLine & { optional?: boolean })[]) {
  return lines.map((l, i) =>
    db
      .prepare(
        `INSERT INTO fin_quote_lines (id, org_id, quote_id, line_no, line_kind, item_code, description, quantity_milli, unit, unit_price, discount_bp, optional, account_id, tax_code_id, net, tax, department_id, project_id, cost_centre_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(newId(), a.orgId, quoteId, i + 1, l.lineKind ?? 'item', (l.itemCode ?? '').slice(0, 40), (l.description ?? '').slice(0, 1000), l.quantityMilli, (l.unit ?? '').slice(0, 20), l.unitPrice, l.discountBp, l.lineKind === 'heading' ? 0 : l.optional ? 1 : 0, l.accountId ?? null, l.taxCodeId ?? null, l.net, l.tax, l.departmentId ?? null, l.projectId ?? null, l.costCentreId ?? null),
  );
}

export function quoteEventStmt(db: D1Database, orgId: string, quoteId: string, action: string, actor: { id?: string | null; name?: string }, detail: Record<string, unknown> = {}) {
  return db
    .prepare('INSERT INTO fin_quote_events (id, org_id, quote_id, action, actor_id, actor_name, detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), orgId, quoteId, action, actor.id ?? null, (actor.name ?? '').slice(0, 120), JSON.stringify(detail), now());
}

async function quoteValues(db: D1Database, a: FinAccess, input: QuoteInput) {
  if (!isIsoDate(input.issueDate)) throw new HttpError(400, 'Use a valid date (YYYY-MM-DD)');
  const expiry = input.expiryDate ?? addDays(input.issueDate, QUOTE_VALID_DAYS);
  if (!isIsoDate(expiry)) throw new HttpError(400, 'Use a valid expiry date');
  if (expiry < input.issueDate) throw new HttpError(400, 'The expiry date is before the date of the quote');
  await checkRefs(db, a, input);
  const chart = await chartOf(db, a);
  const priced = priceQuote(a, chart, input.lines, input.taxMode ?? (a.gst ? 'exclusive' : 'none'), input.discountBp ?? 0);
  if (priced.total < 0) throw new HttpError(400, 'The total cannot be below zero');
  return { expiry, priced };
}

export async function createQuote(env: Env, a: FinAccess, input: QuoteInput, opts: { crmDealId?: string | null; from?: string } = {}) {
  const db = env.DB;
  if (!a.perms.sales.create) deny('You cannot create quotes');
  const { expiry, priced } = await quoteValues(db, a, input);
  const id = newId();
  const t = now();
  const num = numbering(db, a, 'quote', input.number);
  await runBatch(db, [
    ...num.stmts,
    db
      .prepare(
        `INSERT INTO fin_quotes (id, org_id, number, contact_id, crm_deal_id, issue_date, expiry_date, reference, sales_rep_id, delivery_address, tax_mode, discount_bp, subtotal, discount_total, tax_total, total, template_id, notes, terms, created_by, created_at, updated_at)
         VALUES (?, ?, ${num.sql}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.orgId, ...num.args, input.contactId ?? null, opts.crmDealId ?? null, input.issueDate, expiry, (input.reference ?? '').slice(0, 200), input.salesRepId ?? null, (input.deliveryAddress ?? '').slice(0, 500), priced.mode, input.discountBp ?? 0, priced.subtotal, priced.discountTotal, priced.tax, priced.total, input.templateId ?? null, (input.notes ?? '').slice(0, 4000), (input.terms ?? '').slice(0, 4000), a.userId, t, t),
    ...quoteLineStmts(db, a, id, priced.lines),
  ]);
  const row = (await db.prepare('SELECT * FROM fin_quotes WHERE id = ?').bind(id).first<QuoteRow>())!;
  await db.batch([
    db.prepare('UPDATE fin_quotes SET search = ? WHERE id = ?').bind(searchText(row.number, await contactName(db, row.contact_id), row.reference), id),
    quoteEventStmt(db, a.orgId, id, 'created', { id: a.userId, name: a.userName }, opts.from ? { from: opts.from } : {}),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'quote.created', targetType: 'quote', targetId: id, after: { number: row.number, total: row.total } }),
  ]);
  return { id, number: row.number };
}

export async function loadQuote(db: D1Database, a: FinAccess, id: string): Promise<QuoteRow> {
  requireBusiness(a);
  const q = await db.prepare('SELECT * FROM fin_quotes WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(id, a.orgId).first<QuoteRow>();
  if (!q) throw notFound('Quote');
  assertRecord(a, 'sales', 'view', q, 'Quote');
  return q;
}

export async function quoteInput(db: D1Database, q: QuoteRow): Promise<QuoteInput> {
  const lines = await db.prepare('SELECT * FROM fin_quote_lines WHERE quote_id = ? AND org_id = ? ORDER BY line_no').bind(q.id, q.org_id).all<any>();
  return {
    number: q.number,
    contactId: q.contact_id,
    issueDate: q.issue_date,
    expiryDate: q.expiry_date,
    reference: q.reference,
    salesRepId: q.sales_rep_id,
    deliveryAddress: q.delivery_address,
    taxMode: q.tax_mode,
    discountBp: q.discount_bp,
    templateId: q.template_id,
    notes: q.notes,
    terms: q.terms,
    lines: lines.results.map((l) => ({ lineKind: l.line_kind, itemCode: l.item_code, description: l.description, quantity: l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price, discountBp: l.discount_bp, optional: !!l.optional, accountId: l.account_id, taxCodeId: l.tax_code_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
  };
}

const EDITABLE: QuoteStatus[] = ['draft', 'sent', 'viewed', 'declined', 'expired'];

/**
 * Change a quote. A draft is rewritten. One that was sent becomes the next version, as a draft: the version the
 * customer saw stays as it was, and its online link is withdrawn (send the new version again).
 */
export async function updateQuote(env: Env, a: FinAccess, q: QuoteRow, patch: Partial<QuoteInput>) {
  const db = env.DB;
  assertRecord(a, 'sales', 'edit', q, 'Quote');
  if (!EDITABLE.includes(q.status)) {
    throw new HttpError(409, q.status === 'accepted' ? 'An accepted quote keeps what the customer agreed to. Duplicate it to make a new quote.' : `This quote is ${q.status}`);
  }
  const current = await quoteInput(db, q);
  const next: QuoteInput = { ...current, ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)) };
  const { expiry, priced } = await quoteValues(db, a, next);
  const revise = q.status !== 'draft';
  const number = next.number?.trim() || q.number;
  const t = now();
  await runBatch(db, [
    db.prepare('DELETE FROM fin_quote_lines WHERE quote_id = ? AND org_id = ?').bind(q.id, a.orgId),
    ...quoteLineStmts(db, a, q.id, priced.lines),
    db
      .prepare(
        `UPDATE fin_quotes SET number = ?, contact_id = ?, issue_date = ?, expiry_date = ?, reference = ?, sales_rep_id = ?, delivery_address = ?, tax_mode = ?, discount_bp = ?, subtotal = ?, discount_total = ?, tax_total = ?, total = ?, template_id = ?, notes = ?, terms = ?, search = ?, updated_at = ?
           ${revise ? ", version = version + 1, status = 'draft', public_nonce = NULL, sent_at = NULL, viewed_at = NULL, declined_at = NULL, decline_reason = ''" : ''}
         WHERE id = ? AND org_id = ? AND status = ?`,
      )
      .bind(number, next.contactId ?? null, next.issueDate, expiry, (next.reference ?? '').slice(0, 200), next.salesRepId ?? null, (next.deliveryAddress ?? '').slice(0, 500), priced.mode, next.discountBp ?? 0, priced.subtotal, priced.discountTotal, priced.tax, priced.total, next.templateId ?? null, (next.notes ?? '').slice(0, 4000), (next.terms ?? '').slice(0, 4000), searchText(number, await contactName(db, next.contactId), next.reference), t, q.id, a.orgId, q.status),
    quoteEventStmt(db, a.orgId, q.id, revise ? 'revised' : 'updated', { id: a.userId, name: a.userName }, revise ? { version: q.version + 1 } : {}),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'quote.updated', targetType: 'quote', targetId: q.id, before: { total: q.total, version: q.version }, after: { total: priced.total, version: revise ? q.version + 1 : q.version } }),
  ]);
}

/** The quote as the customer was sent it: kept once per version. */
export async function quoteSnapshot(db: D1Database, q: QuoteRow) {
  const [lines, contact, rep] = await Promise.all([
    db.prepare('SELECT * FROM fin_quote_lines WHERE quote_id = ? AND org_id = ? ORDER BY line_no').bind(q.id, q.org_id).all<any>(),
    q.contact_id ? db.prepare('SELECT name, abn, address, email FROM fin_contacts WHERE id = ?').bind(q.contact_id).first<any>() : Promise.resolve(null),
    q.sales_rep_id ? db.prepare('SELECT name FROM users WHERE id = ?').bind(q.sales_rep_id).first<{ name: string }>() : Promise.resolve(null),
  ]);
  const rates = new Map((await db.prepare('SELECT id, rate_bp FROM fin_tax_codes WHERE org_id = ?').bind(q.org_id).all<{ id: string; rate_bp: number }>()).results.map((r) => [r.id, r.rate_bp]));
  return {
    number: q.number,
    version: q.version,
    contact: contact ? { name: contact.name, abn: contact.abn, address: contact.address, email: contact.email } : null,
    issueDate: q.issue_date,
    expiryDate: q.expiry_date,
    reference: q.reference,
    salesRep: rep?.name ?? '',
    deliveryAddress: q.delivery_address,
    taxMode: q.tax_mode,
    discountBp: q.discount_bp,
    subtotal: q.subtotal,
    discountTotal: q.discount_total,
    taxTotal: q.tax_total,
    total: q.total,
    notes: q.notes,
    terms: q.terms,
    templateId: q.template_id,
    lines: lines.results.map((l) => ({ lineKind: l.line_kind, itemCode: l.item_code, description: l.description, quantity: l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price, discountBp: l.discount_bp, optional: !!l.optional, taxCodeId: l.tax_code_id, taxRateBp: l.tax_code_id ? (rates.get(l.tax_code_id) ?? 0) : null, net: l.net, tax: l.tax })),
  };
}

export type QuoteSnapshot = Awaited<ReturnType<typeof quoteSnapshot>>;

export async function snapshotStmt(db: D1Database, q: QuoteRow, actorId: string | null) {
  return db.prepare('INSERT OR IGNORE INTO fin_quote_versions (id, org_id, quote_id, version, snapshot_json, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId(), q.org_id, q.id, q.version, JSON.stringify(await quoteSnapshot(db, q)), actorId, now());
}

/** A snapshot as the engine draws it. */
export function snapshotRender(s: QuoteSnapshot, status: string, accepted?: { name: string; at: number | null; online: boolean }): RenderDoc {
  const lines: RenderLine[] = s.lines.map((l) => ({ ...renderLine(l, new Map()), taxRateBp: l.taxRateBp }));
  return {
    kind: 'quote',
    number: s.number,
    status,
    issueDate: s.issueDate,
    dueDate: s.expiryDate,
    reference: s.reference,
    salesRep: s.salesRep,
    taxMode: s.taxMode,
    discountBp: s.discountBp,
    discountTotal: s.discountTotal,
    subtotal: s.subtotal,
    taxTotal: s.taxTotal,
    total: s.total,
    amountPaid: 0,
    amountDue: s.total,
    notes: s.notes,
    terms: s.terms,
    deliveryAddress: s.deliveryAddress,
    acceptedName: accepted?.name,
    acceptedAt: accepted?.at ?? null,
    acceptedOnline: accepted?.online,
    lines,
  };
}

/** A quote as it is now, as the engine draws it. */
export function quoteRender(q: QuoteRow, lines: any[], rates: Map<string, number>, salesRep: string): RenderDoc {
  const rl = lines.map((l) => renderLine({ lineKind: l.line_kind ?? l.lineKind, itemCode: l.item_code ?? l.itemCode, description: l.description, quantity: l.quantity ?? l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price ?? l.unitPrice, discountBp: l.discount_bp ?? l.discountBp, taxCodeId: l.tax_code_id ?? l.taxCodeId, optional: l.optional }, rates));
  return {
    kind: 'quote',
    number: q.number,
    status: q.status,
    issueDate: q.issue_date,
    dueDate: q.expiry_date,
    reference: q.reference,
    salesRep,
    taxMode: q.tax_mode,
    discountBp: q.discount_bp,
    discountTotal: q.discount_total ?? discountOf(rl, q.discount_bp),
    subtotal: q.subtotal,
    taxTotal: q.tax_total,
    total: q.total,
    amountPaid: 0,
    amountDue: q.total,
    notes: q.notes,
    terms: q.terms,
    deliveryAddress: q.delivery_address,
    acceptedName: q.accepted_name || undefined,
    acceptedAt: q.accepted_at,
    acceptedOnline: !!q.accepted_online,
    lines: rl,
  };
}

/** Sent and viewed quotes past their expiry date become expired (recorded on each quote). */
export async function expireQuotes(db: D1Database, orgId: string, today: string) {
  const cond = "org_id = ? AND deleted_at IS NULL AND status IN ('sent','viewed') AND expiry_date IS NOT NULL AND expiry_date < ?";
  await db.batch([
    db.prepare(`INSERT INTO fin_quote_events (id, org_id, quote_id, action, actor_name, detail_json, created_at) SELECT lower(hex(randomblob(16))), org_id, id, 'expired', '', '{}', ? FROM fin_quotes WHERE ${cond}`).bind(now(), orgId, today),
    db.prepare(`UPDATE fin_quotes SET status = 'expired', updated_at = ? WHERE ${cond}`).bind(now(), orgId, today),
  ]);
}

// ------------------------------------------------------------------ the CRM deal a quote is for

/** A line on the CRM deal's timeline, when the workspace and the CRM belong to the same company. No amounts. */
export async function dealEventStmt(db: D1Database, financeOrgId: string, dealId: string | null, actorId: string | null, summary: string, data: Record<string, unknown>) {
  if (!dealId) return null;
  const crm = await db
    .prepare("SELECT t2.ref_id FROM co_tools t1 JOIN co_tools t2 ON t2.company_id = t1.company_id AND t2.app = 'crm' JOIN co_companies co ON co.id = t1.company_id AND co.deleted_at IS NULL WHERE t1.app = 'finance' AND t1.ref_id = ?")
    .bind(financeOrgId)
    .first<{ ref_id: string }>();
  if (!crm) return null;
  const deal = await db.prepare('SELECT id, company_id FROM crm_deals WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(dealId, crm.ref_id).first<{ id: string; company_id: string | null }>();
  if (!deal) return null;
  return db
    .prepare('INSERT INTO crm_events (id, org_id, type, actor_id, contact_id, company_id, deal_id, lead_id, summary, data_json, created_at) VALUES (?, ?, ?, ?, NULL, ?, ?, NULL, ?, ?, ?)')
    .bind(newId(), crm.ref_id, 'finance_quote', actorId, deal.company_id, deal.id, summary.slice(0, 500), JSON.stringify(data), now());
}

async function withDealEvent(db: D1Database, q: QuoteRow, actorId: string | null, summary: string, stmts: D1PreparedStatement[]) {
  const ev = await dealEventStmt(db, q.org_id, q.crm_deal_id, actorId, summary, { quoteId: q.id, number: q.number });
  return ev ? [...stmts, ev] : stmts;
}

// ------------------------------------------------------------------ quote lifecycle

/** Mark a quote sent (it went to the customer some other way, or by email or link here). Keeps this version. */
export async function markQuoteSent(env: Env, a: FinAccess, q: QuoteRow, how: 'marked' | 'email' | 'link', detail: Record<string, unknown> = {}) {
  const db = env.DB;
  assertRecord(a, 'sales', 'edit', q, 'Quote');
  if (!['draft', 'sent', 'viewed'].includes(q.status)) throw new HttpError(409, `This quote is ${q.status}`);
  const today = todayIn(a.org.timezone);
  if (q.expiry_date && q.expiry_date < today) throw new HttpError(400, 'This quote has expired: change its expiry date first');
  if (!q.contact_id) throw new HttpError(400, 'Choose the customer first');
  const t = now();
  const first = q.status === 'draft';
  await runBatch(
    db,
    await withDealEvent(db, q, a.userId, first ? `Quote ${q.number} sent${q.version > 1 ? ` (version ${q.version})` : ''}` : `Quote ${q.number} sent again`, [
      await snapshotStmt(db, q, a.userId),
      db.prepare("UPDATE fin_quotes SET status = CASE WHEN status = 'draft' THEN 'sent' ELSE status END, sent_at = COALESCE(sent_at, ?), updated_at = ? WHERE id = ? AND org_id = ?").bind(t, t, q.id, a.orgId),
      quoteEventStmt(db, a.orgId, q.id, how === 'email' ? 'emailed' : how === 'link' ? 'link_created' : 'sent', { id: a.userId, name: a.userName }, { version: q.version, ...detail }),
    ]),
  );
}

/** Record the customer's acceptance (a member, from what the customer said or signed). */
export async function acceptQuote(env: Env, a: FinAccess | null, q: QuoteRow, by: { name: string; online: boolean; actorId: string | null; ip?: string | null }) {
  const db = env.DB;
  const allowed: QuoteStatus[] = by.online ? ['sent', 'viewed'] : ['draft', 'sent', 'viewed', 'expired', 'declined'];
  if (!allowed.includes(q.status)) throw new HttpError(409, q.status === 'accepted' ? 'This quote has already been accepted' : `This quote is ${q.status}`);
  if (a) assertRecord(a, 'sales', 'edit', q, 'Quote');
  const name = by.name.trim().slice(0, 120);
  if (name.length < 2) throw new HttpError(400, 'Type the name of the person accepting');
  const t = now();
  const r = await runBatch(
    db,
    await withDealEvent(db, q, by.actorId, `Quote ${q.number} accepted${by.online ? ' online' : ''}`, [
      await snapshotStmt(db, q, by.actorId),
      db.prepare("UPDATE fin_quotes SET status = 'accepted', accepted_at = ?, accepted_name = ?, accepted_online = ?, declined_at = NULL, decline_reason = '', updated_at = ? WHERE id = ? AND org_id = ? AND status = ?").bind(t, name, by.online ? 1 : 0, t, q.id, q.org_id, q.status),
      quoteEventStmt(db, q.org_id, q.id, 'accepted', { id: by.actorId, name }, { version: q.version, online: by.online, ...(by.ip ? { ip: by.ip } : {}) }),
    ]),
  );
  if (!r?.[1]?.meta.changes) throw new HttpError(409, 'The quote changed at the same time; refresh and try again');
}

export async function declineQuote(env: Env, a: FinAccess | null, q: QuoteRow, by: { reason: string; online: boolean; actorId: string | null; name?: string; ip?: string | null }) {
  const db = env.DB;
  const allowed: QuoteStatus[] = by.online ? ['sent', 'viewed'] : ['draft', 'sent', 'viewed', 'expired'];
  if (!allowed.includes(q.status)) throw new HttpError(409, `This quote is ${q.status}`);
  if (a) assertRecord(a, 'sales', 'edit', q, 'Quote');
  const t = now();
  await runBatch(
    db,
    await withDealEvent(db, q, by.actorId, `Quote ${q.number} declined${by.online ? ' online' : ''}`, [
      db.prepare("UPDATE fin_quotes SET status = 'declined', declined_at = ?, decline_reason = ?, updated_at = ? WHERE id = ? AND org_id = ? AND status = ?").bind(t, by.reason.trim().slice(0, 1000), t, q.id, q.org_id, q.status),
      quoteEventStmt(db, q.org_id, q.id, 'declined', { id: by.actorId, name: by.name ?? '' }, { online: by.online, ...(by.ip ? { ip: by.ip } : {}) }),
    ]),
  );
}

/** The customer opened the online link: a sent quote becomes viewed (once). Nothing else changes. */
export async function quoteViewed(db: D1Database, q: QuoteRow) {
  if (q.status !== 'sent') {
    if (!q.viewed_at) await db.prepare('UPDATE fin_quotes SET viewed_at = ? WHERE id = ? AND viewed_at IS NULL').bind(now(), q.id).run();
    return;
  }
  const t = now();
  await db.batch(
    await withDealEvent(db, q, null, `Quote ${q.number} viewed by the customer`, [
      db.prepare("UPDATE fin_quotes SET status = 'viewed', viewed_at = COALESCE(viewed_at, ?), updated_at = ? WHERE id = ? AND status = 'sent'").bind(t, t, q.id),
      quoteEventStmt(db, q.org_id, q.id, 'viewed', { name: '' }, { version: q.version }),
    ]),
  );
}

export async function cancelQuote(env: Env, a: FinAccess, q: QuoteRow) {
  const db = env.DB;
  assertRecord(a, 'sales', 'edit', q, 'Quote');
  if (q.status === 'converted' || q.status === 'cancelled') throw new HttpError(409, `This quote is ${q.status}`);
  const t = now();
  await runBatch(
    db,
    await withDealEvent(db, q, a.userId, `Quote ${q.number} cancelled`, [
      db.prepare("UPDATE fin_quotes SET status = 'cancelled', public_nonce = NULL, updated_at = ? WHERE id = ? AND org_id = ?").bind(t, q.id, a.orgId),
      quoteEventStmt(db, a.orgId, q.id, 'cancelled', { id: a.userId, name: a.userName }),
      auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'quote.cancelled', targetType: 'quote', targetId: q.id }),
    ]),
  );
}

/** Delete a quote that never went to the customer; any other is cancelled instead. */
export async function deleteQuote(env: Env, a: FinAccess, q: QuoteRow) {
  const db = env.DB;
  assertRecord(a, 'sales', 'delete', q, 'Quote');
  const sent = await db.prepare('SELECT COUNT(*) AS n FROM fin_quote_versions WHERE quote_id = ?').bind(q.id).first<{ n: number }>();
  if (q.status !== 'draft' || sent?.n || q.invoiced_bp > 0) throw new HttpError(409, 'Only a quote that was never sent is deleted. Cancel this one instead.');
  await db.batch([
    db.prepare('UPDATE fin_quotes SET deleted_at = ?, public_nonce = NULL, updated_at = ? WHERE id = ? AND org_id = ?').bind(now(), now(), q.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'quote.deleted', targetType: 'quote', targetId: q.id }),
  ]);
}

export async function duplicateQuote(env: Env, a: FinAccess, q: QuoteRow) {
  const input = await quoteInput(env.DB, q);
  const today = todayIn(a.org.timezone);
  const r = await createQuote(env, a, { ...input, number: undefined, issueDate: today, expiryDate: addDays(today, QUOTE_VALID_DAYS) }, { crmDealId: q.crm_deal_id, from: q.number });
  await env.DB.batch([quoteEventStmt(env.DB, a.orgId, q.id, 'duplicated', { id: a.userId, name: a.userName }, { quoteId: r.id, number: r.number })]);
  return r;
}

/** Each part of a quote invoiced, so all the parts add up to its lines exactly. */
function share(amount: number, fromBp: number, toBp: number) {
  return Math.round((amount * toBp) / 10_000) - Math.round((amount * fromBp) / 10_000);
}

/**
 * An accepted quote becomes a draft invoice: all that is left of it, or a percentage of the whole (progress
 * invoicing). The parts' amounts add up to the quote's exactly; GST is worked out on each invoice. Optional lines go on
 * it only when chosen. Lines without an account take the default sales account.
 */
export async function invoiceQuote(env: Env, a: FinAccess, q: QuoteRow, opts: { percent?: number; optionalLineIds?: string[] }, waitUntil?: (p: Promise<unknown>) => void) {
  const db = env.DB;
  if (!a.perms.sales.create) deny('You cannot create invoices');
  assertRecord(a, 'sales', 'view', q, 'Quote');
  if (q.status !== 'accepted') throw new HttpError(409, q.status === 'converted' ? 'This quote has been invoiced in full' : 'Only an accepted quote is invoiced: record the customer’s acceptance first');
  if (!q.contact_id) throw new HttpError(400, 'Choose the customer first');
  const left = 10_000 - q.invoiced_bp;
  const part = opts.percent === undefined ? left : Math.round(opts.percent * 100);
  if (!Number.isInteger(part) || part < 1 || part > left) throw new HttpError(400, `Invoice between 0.01% and ${(left / 100).toString()}% of this quote`);
  const from = q.invoiced_bp;
  const to = from + part;
  const whole = from === 0 && to === 10_000;
  const rows = (await db.prepare('SELECT * FROM fin_quote_lines WHERE quote_id = ? AND org_id = ? ORDER BY line_no').bind(q.id, a.orgId).all<any>()).results;
  const chosen = new Set(opts.optionalLineIds ?? []);
  const sales = await db.prepare("SELECT id, tax_code_id FROM fin_accounts WHERE org_id = ? AND type = 'revenue' AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1").bind(a.orgId).first<{ id: string; tax_code_id: string | null }>();
  const label = whole ? '' : ` (${(part / 100).toString()}% of quote ${q.number})`;
  const lines: DocLineInput[] = [];
  for (const l of rows) {
    if (l.line_kind === 'heading') {
      lines.push({ lineKind: 'heading', description: l.description, unitPrice: 0 });
      continue;
    }
    if (l.optional && !chosen.has(l.id)) continue;
    const common = { itemCode: l.item_code, accountId: l.account_id ?? sales?.id ?? null, taxCodeId: l.tax_code_id ?? (a.gst ? (sales?.tax_code_id ?? null) : null), departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id };
    if (whole) lines.push({ ...common, description: l.description, quantity: l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price, discountBp: l.discount_bp });
    // A part: its share of the line after every discount (the whole quote's too), so the parts' amounts add up to the
    // quote's exactly. GST is worked out on each invoice, so a part's GST can differ from a straight share by a cent.
    else lines.push({ ...common, description: `${l.description}${label}`.slice(0, 1000), quantity: 1, unit: '', unitPrice: share(lessDiscount(docLineAmount(l.unit_price, l.quantity_milli, l.discount_bp), q.discount_bp), from, to), discountBp: 0 });
  }
  if (!lines.some((l) => l.lineKind !== 'heading')) throw new HttpError(400, 'This quote has no lines to invoice');
  // Claim the share first, so two people cannot invoice the same part; give it back if the invoice cannot be made.
  const t = now();
  const claim = await db.prepare("UPDATE fin_quotes SET invoiced_bp = ?, status = CASE WHEN ? = 10000 THEN 'converted' ELSE status END, updated_at = ? WHERE id = ? AND org_id = ? AND invoiced_bp = ? AND status = 'accepted'").bind(to, to, t, q.id, a.orgId, from).run();
  if (!claim.meta.changes) throw new HttpError(409, 'This quote was invoiced at the same time; refresh and try again');
  let doc: { id: string; number: string; status: string };
  try {
    doc = await createDoc(
      env,
      a,
      {
        kind: 'invoice',
        contactId: q.contact_id,
        issueDate: todayIn(a.org.timezone),
        reference: (q.reference || `Quote ${q.number}`).slice(0, 200),
        taxMode: q.tax_mode,
        // A part carries the whole-quote discount inside its lines (above); the whole quote keeps it as it was.
        discountBp: whole ? q.discount_bp : 0,
        templateId: q.template_id,
        notes: q.notes,
        deliveryAddress: q.delivery_address,
        salesRepId: q.sales_rep_id,
        quoteId: q.id,
        lines,
        action: 'draft',
      },
      waitUntil,
    );
  } catch (e) {
    await db.prepare("UPDATE fin_quotes SET invoiced_bp = ?, status = 'accepted', updated_at = ? WHERE id = ? AND org_id = ? AND invoiced_bp = ?").bind(from, now(), q.id, a.orgId, to).run();
    throw e;
  }
  await runBatch(
    db,
    await withDealEvent(db, q, a.userId, to === 10_000 ? `Quote ${q.number} invoiced in full` : `Quote ${q.number}: ${(part / 100).toString()}% invoiced`, [
      db.prepare('UPDATE fin_docs SET quote_bp = ? WHERE id = ? AND org_id = ?').bind(part, doc.id, a.orgId),
      quoteEventStmt(db, a.orgId, q.id, 'invoiced', { id: a.userId, name: a.userName }, { invoiceId: doc.id, number: doc.number, bp: part }),
      auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'quote.invoiced', targetType: 'quote', targetId: q.id, after: { invoice: doc.id, bp: part } }),
    ]),
  );
  return doc;
}

export async function quoteDTOs(db: D1Database, a: FinAccess, rows: any[], full = false) {
  const ids = rows.map((r) => r.id);
  const [lines, events, versions, invoices] = full && ids.length
    ? await Promise.all([
        db.prepare(`SELECT * FROM fin_quote_lines WHERE org_id = ? AND quote_id IN (${placeholders(ids.length)}) ORDER BY line_no`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT e.*, u.name AS user_name FROM fin_quote_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.org_id = ? AND e.quote_id IN (${placeholders(ids.length)}) ORDER BY e.created_at DESC LIMIT 200`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT quote_id, version, created_at FROM fin_quote_versions WHERE org_id = ? AND quote_id IN (${placeholders(ids.length)}) ORDER BY version DESC`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT id, quote_id, number, status, total, quote_bp FROM fin_docs WHERE org_id = ? AND deleted_at IS NULL AND quote_id IN (${placeholders(ids.length)}) ORDER BY created_at`).bind(a.orgId, ...ids).all<any>(),
      ])
    : [{ results: [] as any[] }, { results: [] as any[] }, { results: [] as any[] }, { results: [] as any[] }];
  const today = todayIn(a.org.timezone);
  return rows.map((r) => {
    const mine = canRecord(a, 'sales', 'edit', r);
    return {
      id: r.id,
      number: r.number,
      contactId: r.contact_id,
      contactName: r.contact_name ?? null,
      crmDealId: r.crm_deal_id,
      issueDate: r.issue_date,
      expiryDate: r.expiry_date,
      reference: r.reference,
      salesRepId: r.sales_rep_id,
      salesRepName: r.sales_rep_name ?? null,
      deliveryAddress: r.delivery_address,
      taxMode: r.tax_mode,
      discountBp: r.discount_bp,
      subtotal: r.subtotal,
      discountTotal: r.discount_total,
      taxTotal: r.tax_total,
      total: r.total,
      invoicedBp: r.invoiced_bp,
      status: r.status as QuoteStatus,
      version: r.version,
      templateId: r.template_id,
      notes: r.notes,
      terms: r.terms,
      online: !!r.public_nonce,
      sentAt: r.sent_at,
      viewedAt: r.viewed_at,
      acceptedAt: r.accepted_at,
      acceptedName: r.accepted_name,
      acceptedOnline: !!r.accepted_online,
      declinedAt: r.declined_at,
      declineReason: r.decline_reason,
      expiringSoon: ['sent', 'viewed'].includes(r.status) && !!r.expiry_date && r.expiry_date >= today && r.expiry_date <= addDays(today, 7),
      createdBy: r.created_by,
      createdByName: r.created_by_name ?? null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      lines: lines.results.filter((l) => l.quote_id === r.id).map((l) => ({ id: l.id, lineKind: l.line_kind, itemCode: l.item_code, description: l.description, quantity: l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price, discountBp: l.discount_bp, optional: !!l.optional, accountId: l.account_id, taxCodeId: l.tax_code_id, net: l.net, tax: l.tax, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
      events: events.results.filter((e) => e.quote_id === r.id).map((e) => ({ id: e.id, action: e.action, by: e.user_name ?? e.actor_name ?? '', detail: JSON.parse(e.detail_json || '{}'), at: e.created_at })),
      versions: versions.results.filter((v) => v.quote_id === r.id).map((v) => ({ version: v.version, at: v.created_at })),
      invoices: invoices.results.filter((d) => d.quote_id === r.id).map((d) => ({ id: d.id, number: d.number, status: d.status, total: d.total, bp: d.quote_bp })),
      can: {
        edit: mine && EDITABLE.includes(r.status),
        send: mine && ['draft', 'sent', 'viewed'].includes(r.status),
        respond: mine && ['draft', 'sent', 'viewed', 'expired', 'declined'].includes(r.status),
        invoice: !!a.perms.sales.create && r.status === 'accepted',
        cancel: mine && r.status !== 'converted' && r.status !== 'cancelled',
        delete: canRecord(a, 'sales', 'delete', r) && r.status === 'draft' && r.version === 1 && !r.sent_at && r.invoiced_bp === 0,
        duplicate: !!a.perms.sales.create,
      },
    };
  });
}

// ------------------------------------------------------------------ credit notes

/** The reverse of a sale: income and GST debited, the customer's receivable credited. */
export function creditNoteLedger(chart: Chart, cn: { total: number; contactId: string; number: string }, lines: PricedDocLine[]) {
  return documentLines(chart, { kind: 'invoice', total: cn.total, contactId: cn.contactId, number: cn.number }, lines.filter((l) => l.accountId) as unknown as PricedLine[]).map((l) => ({ ...l, debit: l.credit, credit: l.debit, taxAmount: l.taxAmount === undefined ? undefined : -l.taxAmount }));
}

function creditLineStmts(db: D1Database, a: FinAccess, noteId: string, lines: PricedDocLine[]) {
  return lines.map((l, i) =>
    db
      .prepare(
        `INSERT INTO fin_credit_note_lines (id, org_id, credit_note_id, line_no, line_kind, item_code, description, quantity_milli, unit, unit_price, discount_bp, account_id, tax_code_id, net, tax, department_id, project_id, cost_centre_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(newId(), a.orgId, noteId, i + 1, l.lineKind ?? 'item', (l.itemCode ?? '').slice(0, 40), (l.description ?? '').slice(0, 1000), l.quantityMilli, (l.unit ?? '').slice(0, 20), l.unitPrice, l.discountBp, l.accountId ?? null, l.taxCodeId ?? null, l.net, l.tax, l.departmentId ?? null, l.projectId ?? null, l.costCentreId ?? null),
  );
}

async function creditValues(db: D1Database, a: FinAccess, input: CreditInput, approving: boolean, selfId?: string) {
  if (!isIsoDate(input.issueDate)) throw new HttpError(400, 'Use a valid date (YYYY-MM-DD)');
  if (!input.contactId) throw new HttpError(400, 'Choose the customer');
  await checkRefs(db, a, input);
  let invoice: { id: string; number: string; total: number; contact_id: string | null; status: string } | null = null;
  if (input.invoiceId) {
    invoice = await db.prepare("SELECT id, number, total, contact_id, status FROM fin_docs WHERE id = ? AND org_id = ? AND kind = 'invoice' AND deleted_at IS NULL").bind(input.invoiceId, a.orgId).first();
    if (!invoice) throw new HttpError(400, 'Choose an invoice from this workspace');
    if (!['approved', 'part_paid', 'paid'].includes(invoice.status)) throw new HttpError(400, 'A credit note corrects an approved invoice');
    if (invoice.contact_id !== input.contactId) throw new HttpError(400, 'The credit note is for the invoice’s customer');
  }
  const chart = await chartOf(db, a);
  const priced = priceDocLines(a, chart, input.lines, input.taxMode ?? (a.gst ? 'exclusive' : 'none'), 'credit_note', approving, 0);
  if (priced.total < 0) throw new HttpError(400, 'The total cannot be below zero');
  if (approving && priced.total === 0) throw new HttpError(400, 'Approve a credit note with a total above zero');
  if (invoice) {
    const other = await db.prepare("SELECT COALESCE(SUM(total), 0) AS n FROM fin_credit_notes WHERE org_id = ? AND invoice_id = ? AND status <> 'void' AND deleted_at IS NULL AND id <> ?").bind(a.orgId, invoice.id, selfId ?? '').first<{ n: number }>();
    if ((other?.n ?? 0) + priced.total > invoice.total) throw new HttpError(400, `Credit notes for invoice ${invoice.number} would be more than the invoice`);
  }
  return { chart, priced, invoice };
}

export async function loadCredit(db: D1Database, a: FinAccess, id: string): Promise<CreditRow> {
  requireBusiness(a);
  const n = await db.prepare('SELECT * FROM fin_credit_notes WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(id, a.orgId).first<CreditRow>();
  if (!n) throw notFound('Credit note');
  assertRecord(a, 'sales', 'view', n, 'Credit note');
  return n;
}

export async function creditInput(db: D1Database, n: CreditRow): Promise<CreditInput> {
  const lines = await db.prepare('SELECT * FROM fin_credit_note_lines WHERE credit_note_id = ? AND org_id = ? ORDER BY line_no').bind(n.id, n.org_id).all<any>();
  return {
    number: n.number,
    contactId: n.contact_id,
    invoiceId: n.invoice_id,
    issueDate: n.issue_date,
    reference: n.reference,
    reason: n.reason,
    taxMode: n.tax_mode,
    templateId: n.template_id,
    notes: n.notes,
    lines: lines.results.map((l) => ({ lineKind: l.line_kind, itemCode: l.item_code, description: l.description, quantity: l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price, discountBp: l.discount_bp, accountId: l.account_id, taxCodeId: l.tax_code_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
  };
}

/** A draft credit note for an invoice: its lines, ready to change (a full credit unless the lines are edited). */
export async function creditFromInvoice(db: D1Database, a: FinAccess, invoiceId: string): Promise<CreditInput> {
  const d = await db.prepare("SELECT * FROM fin_docs WHERE id = ? AND org_id = ? AND kind = 'invoice' AND deleted_at IS NULL").bind(invoiceId, a.orgId).first<any>();
  if (!d) throw notFound('Invoice');
  assertRecord(a, 'sales', 'view', d, 'Invoice');
  const lines = await db.prepare('SELECT * FROM fin_doc_lines WHERE doc_id = ? AND org_id = ? ORDER BY line_no').bind(d.id, a.orgId).all<any>();
  const bp = d.discount_bp ?? 0;
  return {
    contactId: d.contact_id,
    invoiceId: d.id,
    issueDate: todayIn(a.org.timezone),
    reference: d.number,
    reason: '',
    taxMode: d.tax_mode,
    templateId: d.template_id,
    // The invoice's whole-document discount is carried into each line, so the credit matches what was charged.
    lines: lines.results.map((l) => ({ lineKind: l.line_kind ?? 'item', itemCode: l.item_code ?? '', description: l.description, quantity: l.quantity_milli / 1000, unit: l.unit ?? '', unitPrice: l.unit_price, discountBp: bp ? Math.min(10_000, 10_000 - Math.round(((10_000 - l.discount_bp) * (10_000 - bp)) / 10_000)) : l.discount_bp, accountId: l.account_id, taxCodeId: l.tax_code_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
  };
}

export async function createCredit(env: Env, a: FinAccess, input: CreditInput) {
  const db = env.DB;
  if (!a.perms.sales.create) deny('You cannot create credit notes');
  const approving = input.action === 'approve';
  if (approving && !mayApprove(a, 'invoice')) deny('You cannot approve credit notes');
  const { chart, priced } = await creditValues(db, a, input, approving);
  const id = newId();
  const t = now();
  const num = numbering(db, a, 'credit_note', input.number);
  await runBatch(db, [
    ...num.stmts,
    db
      .prepare(
        `INSERT INTO fin_credit_notes (id, org_id, number, contact_id, invoice_id, issue_date, reference, reason, tax_mode, subtotal, tax_total, total, template_id, notes, created_by, created_at, updated_at)
         VALUES (?, ?, ${num.sql}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.orgId, ...num.args, input.contactId, input.invoiceId ?? null, input.issueDate, (input.reference ?? '').slice(0, 200), (input.reason ?? '').slice(0, 1000), priced.mode, priced.subtotal, priced.tax, priced.total, input.templateId ?? null, (input.notes ?? '').slice(0, 4000), a.userId, t, t),
    ...creditLineStmts(db, a, id, priced.lines),
  ]);
  const row = (await db.prepare('SELECT * FROM fin_credit_notes WHERE id = ?').bind(id).first<CreditRow>())!;
  await db.batch([
    db.prepare('UPDATE fin_credit_notes SET search = ? WHERE id = ?').bind(searchText(row.number, await contactName(db, row.contact_id), row.reference), id),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.created', targetType: 'credit_note', targetId: id, after: { number: row.number, total: row.total } }),
  ]);
  if (approving) await approveCredit(env, a, row, chart, priced.lines);
  return { id, number: row.number };
}

export async function updateCredit(env: Env, a: FinAccess, n: CreditRow, patch: Partial<CreditInput>) {
  const db = env.DB;
  assertRecord(a, 'sales', 'edit', n, 'Credit note');
  if (n.status !== 'draft') throw new HttpError(409, 'Only a draft credit note is changed. Void an approved one and make a new one.');
  const current = await creditInput(db, n);
  const next: CreditInput = { ...current, ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)) };
  const { chart, priced } = await creditValues(db, a, next, false, n.id);
  const number = next.number?.trim() || n.number;
  await runBatch(db, [
    db.prepare('DELETE FROM fin_credit_note_lines WHERE credit_note_id = ? AND org_id = ?').bind(n.id, a.orgId),
    ...creditLineStmts(db, a, n.id, priced.lines),
    db
      .prepare('UPDATE fin_credit_notes SET number = ?, contact_id = ?, invoice_id = ?, issue_date = ?, reference = ?, reason = ?, tax_mode = ?, subtotal = ?, tax_total = ?, total = ?, template_id = ?, notes = ?, search = ?, updated_at = ? WHERE id = ? AND org_id = ? AND status = ?')
      .bind(number, next.contactId, next.invoiceId ?? null, next.issueDate, (next.reference ?? '').slice(0, 200), (next.reason ?? '').slice(0, 1000), priced.mode, priced.subtotal, priced.tax, priced.total, next.templateId ?? null, (next.notes ?? '').slice(0, 4000), searchText(number, await contactName(db, next.contactId), next.reference), now(), n.id, a.orgId, 'draft'),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.updated', targetType: 'credit_note', targetId: n.id, before: { total: n.total }, after: { total: priced.total } }),
  ]);
  if (patch.action === 'approve') {
    const fresh = (await db.prepare('SELECT * FROM fin_credit_notes WHERE id = ?').bind(n.id).first<CreditRow>())!;
    await approveCredit(env, a, fresh, chart);
  }
}

/**
 * Approve: post the credit note. One made for an invoice is then applied to it, up to what the invoice still owes;
 * the rest stays as credit for the customer.
 */
export async function approveCredit(env: Env, a: FinAccess, n: CreditRow, chartIn?: Chart, linesIn?: PricedDocLine[]) {
  const db = env.DB;
  if (!mayApprove(a, 'invoice')) deny('You cannot approve credit notes');
  if (n.status !== 'draft') throw new HttpError(409, `This credit note is ${n.status}`);
  let chart = chartIn;
  let lines = linesIn;
  if (!chart || !lines) {
    const p = await creditValues(db, a, await creditInput(db, n), true, n.id);
    chart = p.chart;
    lines = p.priced.lines;
  } else if (lines.some((l) => !l.accountId && l.amount !== 0)) throw new HttpError(400, 'Choose an account for every line before approving');
  if (n.total <= 0) throw new HttpError(400, 'Approve a credit note with a total above zero');
  const ledger = creditNoteLedger(chart, { total: n.total, contactId: n.contact_id, number: n.number }, lines);
  validateJournal(a, chart, n.issue_date, ledger);
  const journalId = newId();
  const t = now();
  const stmts: D1PreparedStatement[] = [
    // The ledger's source types are fixed by the database (0011_finance.sql): a credit note posts as a sales document
    // ('invoice') and its refund as a 'payment', each with the credit note as its source (journalDTOs names them).
    ...journalStmts(db, { id: journalId, orgId: a.orgId, date: n.issue_date, sourceType: 'invoice', sourceId: n.id, memo: `Credit note ${n.number}`, createdBy: a.userId, lines: ledger }),
    db.prepare("UPDATE fin_credit_notes SET status = 'approved', journal_id = ?, approved_by = ?, approved_at = ?, updated_at = ? WHERE id = ? AND org_id = ? AND status = 'draft'").bind(journalId, a.userId, t, t, n.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.approved', targetType: 'credit_note', targetId: n.id, after: { journal: journalId } }),
  ];
  if (n.invoice_id) {
    const inv = await db.prepare('SELECT total, amount_paid, status FROM fin_docs WHERE id = ? AND org_id = ?').bind(n.invoice_id, a.orgId).first<{ total: number; amount_paid: number; status: string }>();
    const amount = inv && ['approved', 'part_paid'].includes(inv.status) ? Math.min(n.total, inv.total - inv.amount_paid) : 0;
    if (amount > 0) stmts.push(...allocationStmts(db, a, { id: n.id, total: n.total }, n.invoice_id, amount, n.issue_date >= todayIn(a.org.timezone) ? n.issue_date : todayIn(a.org.timezone)));
  }
  await runBatch(db, stmts);
}

function allocationStmts(db: D1Database, a: FinAccess, n: { id: string; total: number }, invoiceId: string, amount: number, date: string) {
  const t = now();
  return [
    db.prepare('INSERT INTO fin_credit_allocations (id, org_id, credit_note_id, invoice_id, date, amount, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.orgId, n.id, invoiceId, date, amount, a.userId, t),
    // The database refuses more than the credit has left, or more than the invoice owes (CHECK constraints), and the
    // whole batch is rolled back.
    db.prepare("UPDATE fin_credit_notes SET allocated = allocated + ?, status = CASE WHEN allocated + ? + refunded >= total THEN 'applied' ELSE status END, updated_at = ? WHERE id = ? AND org_id = ?").bind(amount, amount, t, n.id, a.orgId),
    db.prepare("UPDATE fin_docs SET amount_paid = amount_paid + ?, status = CASE WHEN amount_paid + ? >= total THEN 'paid' ELSE 'part_paid' END, updated_at = ? WHERE id = ? AND org_id = ?").bind(amount, amount, t, invoiceId, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.applied', targetType: 'credit_note', targetId: n.id, after: { invoice: invoiceId, amount } }),
  ];
}

const remaining = (n: CreditRow) => n.total - n.allocated - n.refunded;

/** Apply credit to one of the customer's open invoices. Posts nothing (see the top of this file). */
export async function allocateCredit(env: Env, a: FinAccess, n: CreditRow, p: { invoiceId: string; amount: number; date?: string }) {
  const db = env.DB;
  if (!mayApprove(a, 'invoice')) deny('You cannot apply credit');
  if (n.status !== 'approved') throw new HttpError(409, n.status === 'applied' ? 'All of this credit has been used' : 'Approve the credit note first');
  if (!Number.isSafeInteger(p.amount) || p.amount <= 0) throw new HttpError(400, 'Enter the amount to apply');
  if (p.amount > remaining(n)) throw new HttpError(400, `The credit has ${(remaining(n) / 100).toFixed(2)} left`);
  const inv = await db.prepare("SELECT id, contact_id, total, amount_paid, status, issue_date FROM fin_docs WHERE id = ? AND org_id = ? AND kind = 'invoice' AND deleted_at IS NULL").bind(p.invoiceId, a.orgId).first<any>();
  if (!inv) throw notFound('Invoice');
  if (inv.contact_id !== n.contact_id) throw new HttpError(400, 'Credit is applied to the same customer’s invoices');
  if (!['approved', 'part_paid'].includes(inv.status)) throw new HttpError(409, inv.status === 'paid' ? 'That invoice is paid' : 'That invoice is not open');
  if (p.amount > inv.total - inv.amount_paid) throw new HttpError(400, `The invoice owes ${((inv.total - inv.amount_paid) / 100).toFixed(2)}`);
  const date = p.date ?? todayIn(a.org.timezone);
  if (!isIsoDate(date)) throw new HttpError(400, 'Use a valid date (YYYY-MM-DD)');
  if (date < n.issue_date || date < inv.issue_date) throw new HttpError(400, 'Apply credit on or after the dates of both the credit note and the invoice');
  await runBatch(db, allocationStmts(db, a, n, inv.id, p.amount, date));
}

/** Take back credit applied to an invoice: the invoice owes it again and the credit has it again. */
export async function removeAllocation(env: Env, a: FinAccess, n: CreditRow, allocationId: string) {
  const db = env.DB;
  if (!mayApprove(a, 'invoice')) deny('You cannot change applied credit');
  const al = await db.prepare('SELECT * FROM fin_credit_allocations WHERE id = ? AND org_id = ? AND credit_note_id = ?').bind(allocationId, a.orgId, n.id).first<any>();
  if (!al) throw notFound('Applied credit');
  if (al.voided_at) throw new HttpError(409, 'Already removed');
  const t = now();
  await runBatch(db, [
    db.prepare('UPDATE fin_credit_allocations SET voided_at = ? WHERE id = ? AND voided_at IS NULL').bind(t, al.id),
    db.prepare("UPDATE fin_credit_notes SET allocated = allocated - ?, status = CASE WHEN status = 'applied' THEN 'approved' ELSE status END, updated_at = ? WHERE id = ? AND org_id = ?").bind(al.amount, t, n.id, a.orgId),
    db.prepare("UPDATE fin_docs SET amount_paid = amount_paid - ?, status = CASE WHEN amount_paid - ? > 0 THEN 'part_paid' ELSE 'approved' END, updated_at = ? WHERE id = ? AND org_id = ?").bind(al.amount, al.amount, t, al.invoice_id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.unapplied', targetType: 'credit_note', targetId: n.id, after: { invoice: al.invoice_id, amount: al.amount } }),
  ]);
}

/** Record money paid back to the customer: Dr receivable (the customer), Cr the money account. */
export async function refundCredit(env: Env, a: FinAccess, n: CreditRow, p: { accountId: string; date: string; amount: number; reference?: string }) {
  const db = env.DB;
  if (!mayApprove(a, 'invoice')) deny('You cannot record refunds');
  if (n.status !== 'approved') throw new HttpError(409, n.status === 'applied' ? 'All of this credit has been used' : 'Approve the credit note first');
  if (!Number.isSafeInteger(p.amount) || p.amount <= 0) throw new HttpError(400, 'Enter the amount paid back');
  if (p.amount > remaining(n)) throw new HttpError(400, `The credit has ${(remaining(n) / 100).toFixed(2)} left`);
  const chart = await chartOf(db, a);
  moneyAccount(chart, p.accountId);
  const ar = systemAccount(chart, 'ar');
  const description = `Refund of credit note ${n.number}${p.reference ? ` ${p.reference}` : ''}`;
  const ledger = [
    { ...side(p.amount), accountId: ar.id, contactId: n.contact_id, description },
    { ...side(-p.amount), accountId: p.accountId, contactId: n.contact_id, description },
  ];
  validateJournal(a, chart, p.date, ledger);
  if (p.date < n.issue_date) throw new HttpError(400, 'A refund is on or after the date of the credit note');
  const id = newId();
  const journalId = newId();
  const t = now();
  await runBatch(db, [
    ...journalStmts(db, { id: journalId, orgId: a.orgId, date: p.date, sourceType: 'payment', sourceId: n.id, memo: description, createdBy: a.userId, lines: ledger }),
    db.prepare('INSERT INTO fin_credit_refunds (id, org_id, credit_note_id, account_id, date, amount, reference, journal_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, n.id, p.accountId, p.date, p.amount, (p.reference ?? '').slice(0, 100), journalId, a.userId, t),
    db.prepare("UPDATE fin_credit_notes SET refunded = refunded + ?, status = CASE WHEN allocated + refunded + ? >= total THEN 'applied' ELSE status END, updated_at = ? WHERE id = ? AND org_id = ?").bind(p.amount, p.amount, t, n.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.refunded', targetType: 'credit_note', targetId: n.id, after: { amount: p.amount, refund: id } }),
  ]);
  return { id };
}

export async function voidRefund(env: Env, a: FinAccess, n: CreditRow, refundId: string, date?: string | null) {
  const db = env.DB;
  if (!mayApprove(a, 'invoice')) deny('You cannot void refunds');
  const r = await db.prepare('SELECT * FROM fin_credit_refunds WHERE id = ? AND org_id = ? AND credit_note_id = ?').bind(refundId, a.orgId, n.id).first<any>();
  if (!r) throw notFound('Refund');
  if (r.voided_at) throw new HttpError(409, 'Already void');
  const rev = await reversalStmts(db, a, r.journal_id, { date, memo: `Refund of credit note ${n.number} voided` });
  const t = now();
  await runBatch(db, [
    ...rev.stmts,
    db.prepare('UPDATE fin_credit_refunds SET voided_at = ?, void_journal_id = ? WHERE id = ? AND org_id = ?').bind(t, rev.reversalId, r.id, a.orgId),
    db.prepare("UPDATE fin_credit_notes SET refunded = refunded - ?, status = CASE WHEN status = 'applied' THEN 'approved' ELSE status END, updated_at = ? WHERE id = ? AND org_id = ?").bind(r.amount, t, n.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.refund_voided', targetType: 'credit_note', targetId: n.id, after: { refund: r.id, reversal: rev.reversalId } }),
  ]);
}

/** Void: an approved credit note with no credit in use is reversed; a draft is simply voided. */
export async function voidCredit(env: Env, a: FinAccess, n: CreditRow, date?: string | null) {
  const db = env.DB;
  assertRecord(a, 'sales', 'edit', n, 'Credit note');
  if (n.status === 'void') throw new HttpError(409, 'Already void');
  if (n.allocated > 0 || n.refunded > 0) throw new HttpError(409, 'Remove the credit applied to invoices and void its refunds first');
  const stmts: D1PreparedStatement[] = [];
  let voidJournal: string | null = null;
  if (n.journal_id) {
    if (!mayApprove(a, 'invoice')) deny('Only people who can approve can void an approved credit note');
    const rev = await reversalStmts(db, a, n.journal_id, { date, memo: `Credit note ${n.number} voided` });
    stmts.push(...rev.stmts);
    voidJournal = rev.reversalId;
  }
  const t = now();
  stmts.push(
    db.prepare("UPDATE fin_credit_notes SET status = 'void', void_journal_id = ?, voided_at = ?, public_nonce = NULL, updated_at = ? WHERE id = ? AND org_id = ? AND allocated = 0 AND refunded = 0").bind(voidJournal, t, t, n.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.voided', targetType: 'credit_note', targetId: n.id, after: { reversal: voidJournal } }),
  );
  await runBatch(db, stmts);
}

export async function deleteCredit(env: Env, a: FinAccess, n: CreditRow) {
  const db = env.DB;
  assertRecord(a, 'sales', 'delete', n, 'Credit note');
  if (n.status !== 'draft') throw new HttpError(409, 'Approved credit notes are voided, not deleted');
  await db.batch([
    db.prepare('UPDATE fin_credit_notes SET deleted_at = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(now(), now(), n.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'credit_note.deleted', targetType: 'credit_note', targetId: n.id }),
  ]);
}

export async function creditDTOs(db: D1Database, a: FinAccess, rows: any[], full = false) {
  const ids = rows.map((r) => r.id);
  const [lines, allocations, refunds] = full && ids.length
    ? await Promise.all([
        db.prepare(`SELECT * FROM fin_credit_note_lines WHERE org_id = ? AND credit_note_id IN (${placeholders(ids.length)}) ORDER BY line_no`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT al.*, d.number AS invoice_number FROM fin_credit_allocations al JOIN fin_docs d ON d.id = al.invoice_id WHERE al.org_id = ? AND al.credit_note_id IN (${placeholders(ids.length)}) ORDER BY al.date`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT r.*, ac.name AS account_name FROM fin_credit_refunds r JOIN fin_accounts ac ON ac.id = r.account_id WHERE r.org_id = ? AND r.credit_note_id IN (${placeholders(ids.length)}) ORDER BY r.date`).bind(a.orgId, ...ids).all<any>(),
      ])
    : [{ results: [] as any[] }, { results: [] as any[] }, { results: [] as any[] }];
  return rows.map((r) => {
    const mine = canRecord(a, 'sales', 'edit', r);
    const approver = mayApprove(a, 'invoice');
    return {
      id: r.id,
      number: r.number,
      contactId: r.contact_id,
      contactName: r.contact_name ?? null,
      invoiceId: r.invoice_id,
      invoiceNumber: r.invoice_number ?? null,
      issueDate: r.issue_date,
      reference: r.reference,
      reason: r.reason,
      taxMode: r.tax_mode,
      subtotal: r.subtotal,
      taxTotal: r.tax_total,
      total: r.total,
      allocated: r.allocated,
      refunded: r.refunded,
      remaining: r.status === 'void' ? 0 : r.total - r.allocated - r.refunded,
      status: r.status as CreditStatus,
      templateId: r.template_id,
      notes: r.notes,
      journalId: r.journal_id,
      online: !!r.public_nonce,
      sentAt: r.sent_at,
      viewedAt: r.viewed_at,
      createdBy: r.created_by,
      createdByName: r.created_by_name ?? null,
      approvedAt: r.approved_at,
      voidedAt: r.voided_at,
      createdAt: r.created_at,
      lines: lines.results.filter((l) => l.credit_note_id === r.id).map((l) => ({ id: l.id, lineKind: l.line_kind, itemCode: l.item_code, description: l.description, quantity: l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price, discountBp: l.discount_bp, accountId: l.account_id, taxCodeId: l.tax_code_id, net: l.net, tax: l.tax, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
      allocations: allocations.results.filter((x) => x.credit_note_id === r.id).map((x) => ({ id: x.id, invoiceId: x.invoice_id, invoiceNumber: x.invoice_number, date: x.date, amount: x.amount, removed: !!x.voided_at })),
      refunds: refunds.results.filter((x) => x.credit_note_id === r.id).map((x) => ({ id: x.id, accountId: x.account_id, accountName: x.account_name, date: x.date, amount: x.amount, reference: x.reference, voided: !!x.voided_at })),
      can: {
        edit: mine && r.status === 'draft',
        delete: canRecord(a, 'sales', 'delete', r) && r.status === 'draft',
        approve: r.status === 'draft' && approver,
        apply: r.status === 'approved' && approver,
        void: r.status !== 'void' && mine && (r.status === 'draft' || approver) && r.allocated === 0 && r.refunded === 0,
      },
    };
  });
}

/** A credit note as the engine draws it. */
export function creditRender(n: CreditRow & { invoice_number?: string | null }, lines: any[], rates: Map<string, number>): RenderDoc {
  const rl = lines.map((l) => renderLine({ lineKind: l.line_kind ?? l.lineKind, itemCode: l.item_code ?? l.itemCode, description: l.description, quantity: l.quantity ?? l.quantity_milli / 1000, unit: l.unit, unitPrice: l.unit_price ?? l.unitPrice, discountBp: l.discount_bp ?? l.discountBp, taxCodeId: l.tax_code_id ?? l.taxCodeId }, rates));
  return {
    kind: 'credit_note',
    number: n.number,
    status: n.status,
    issueDate: n.issue_date,
    dueDate: null,
    reference: n.reference,
    salesRep: '',
    taxMode: n.tax_mode,
    discountBp: 0,
    discountTotal: 0,
    subtotal: n.subtotal,
    taxTotal: n.tax_total,
    total: n.total,
    amountPaid: n.allocated + n.refunded,
    amountDue: n.status === 'void' ? 0 : n.total - n.allocated - n.refunded,
    notes: n.notes,
    terms: '',
    deliveryAddress: '',
    reason: n.reason,
    relatedNumber: n.invoice_number ?? undefined,
    lines: rl,
  };
}
