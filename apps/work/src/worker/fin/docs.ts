// Sales invoices, supplier bills, purchase orders and expense claims (business workspaces). A document is a draft until
// it is approved; approving an invoice, bill or claim posts it to the ledger (purchase orders never post). Payments are
// recorded against it, in part or in full: BIZOMAT records payments, it does not move money.

import { HttpError, newId, notFound, now, placeholders } from '../lib/util';
import { addDays, isIsoDate } from '../../shared/fin/dates';
import { codeFits, splitTax, type TaxMode } from '../../shared/fin/tax';
import { DOC_LABELS, type DocKind } from '../../shared/fin/settings';
import type { Env } from '../env';
import { type FinAccess, assertMember, assertRecord, canRecord, deny, membersWithPerm, requireBusiness } from './access';
import { type Chart, type PricedLine, MAX_AMOUNT, chartOf, docLineAmount, documentLines, journalStmts, paymentLines, reversalStmts, validateJournal } from './ledger';
import { moneyAccount } from './transactions';
import { auditStmt, finNotify, runBatch, searchText } from './util';

export type DocStatus = 'draft' | 'submitted' | 'approved' | 'part_paid' | 'paid' | 'billed' | 'void';

export interface DocLineInput {
  /** 'heading': a title that groups the lines after it (no amount). */
  lineKind?: 'item' | 'heading';
  itemCode?: string;
  unit?: string;
  description?: string;
  /** Up to three decimals. */
  quantity?: number;
  unitPrice: number;
  discountBp?: number;
  accountId?: string | null;
  taxCodeId?: string | null;
  departmentId?: string | null;
  projectId?: string | null;
  costCentreId?: string | null;
}

export interface DocInput {
  kind: DocKind;
  number?: string;
  contactId?: string | null;
  claimantId?: string | null;
  issueDate: string;
  dueDate?: string | null;
  reference?: string;
  taxMode?: TaxMode;
  templateId?: string | null;
  notes?: string;
  terms?: string;
  lines: DocLineInput[];
  action?: 'draft' | 'submit' | 'approve';
  recurringId?: string | null;
  sourceDocId?: string | null;
  deliveryAddress?: string;
  salesRepId?: string | null;
  /** A discount on the whole document (basis points), applied to every line before tax. */
  discountBp?: number;
  /** The quote an invoice is made from (set by the server only). */
  quoteId?: string | null;
}

export const moduleOf = (kind: DocKind) => (kind === 'invoice' ? 'sales' : 'purchases') as 'sales' | 'purchases';
const approvalKey = (kind: DocKind) => (kind === 'invoice' ? 'invoices' : kind === 'expense_claim' ? 'expenseClaims' : 'bills') as 'invoices' | 'bills' | 'expenseClaims';

/** Whether this person may approve (and so post) this kind of document. */
export function mayApprove(a: FinAccess, kind: DocKind): boolean {
  const m = moduleOf(kind);
  return a.perms[m].approve || (a.perms[m].create && !a.settings.approvals[approvalKey(kind)]);
}

export interface PricedDocLine extends DocLineInput {
  quantityMilli: number;
  discountBp: number;
  /** As entered, after the line's own discount and before the whole-document discount. */
  amount: number;
  discounted: number;
  net: number;
  tax: number;
}

/** A share taken off an amount, rounded to the cent: the whole-document discount on one line. */
export function lessDiscount(amount: number, bp: number): number {
  return bp ? amount - Math.round((amount * bp) / 10_000) : amount;
}

/**
 * Net and tax per line (accounts are required only when the document is approved). Headings carry no amount. The
 * whole-document discount comes off each line before its tax is worked out, so the GST on every line is exact.
 */
export function priceDocLines(a: FinAccess, chart: Chart, lines: DocLineInput[], mode: TaxMode, kind: DocKind | 'quote' | 'credit_note', requireAccounts: boolean, docDiscountBp = 0) {
  const effective: TaxMode = a.gst ? mode : 'none';
  const use = kind === 'invoice' || kind === 'quote' || kind === 'credit_note' ? 'sales' : 'purchases';
  if (!Number.isInteger(docDiscountBp) || docDiscountBp < 0 || docDiscountBp > 10_000) throw new HttpError(400, 'A discount is between 0% and 100%');
  const out: PricedDocLine[] = lines.map((l) => {
    if (l.lineKind === 'heading') {
      return { ...l, lineKind: 'heading' as const, unitPrice: 0, quantityMilli: 0, discountBp: 0, accountId: null, taxCodeId: null, amount: 0, discounted: 0, net: 0, tax: 0 };
    }
    const quantityMilli = Math.round((l.quantity ?? 1) * 1000);
    if (!Number.isSafeInteger(quantityMilli) || Math.abs(quantityMilli) > 1e9) throw new HttpError(400, 'Use a sensible quantity');
    if (!Number.isSafeInteger(l.unitPrice) || Math.abs(l.unitPrice) > MAX_AMOUNT) throw new HttpError(400, 'Prices are whole cents');
    const discountBp = l.discountBp ?? 0;
    const amount = docLineAmount(l.unitPrice, quantityMilli, discountBp);
    if (l.accountId) {
      const acc = chart.accounts.get(l.accountId);
      if (!acc) throw new HttpError(400, 'Choose accounts from this workspace');
      if (acc.archived_at) throw new HttpError(400, `The account ${acc.name} is archived`);
    } else if (requireAccounts && amount !== 0) throw new HttpError(400, 'Choose an account for every line before approving');
    let taxCodeId = a.gst ? (l.taxCodeId ?? null) : null;
    let rate = 0;
    if (taxCodeId) {
      const tc = chart.taxCodes.get(taxCodeId);
      if (!tc) throw new HttpError(400, 'Choose tax codes from this workspace');
      if (!codeFits(tc.direction, use)) throw new HttpError(400, `${tc.code} is not a ${use} tax code`);
      rate = tc.rate_bp;
    } else taxCodeId = null;
    const discounted = lessDiscount(amount, docDiscountBp);
    const s = splitTax(discounted, rate, effective);
    return { ...l, lineKind: 'item' as const, taxCodeId, quantityMilli, discountBp, amount, discounted, net: s.net, tax: s.tax };
  });
  const subtotal = out.reduce((n, l) => n + l.net, 0);
  const tax = out.reduce((n, l) => n + l.tax, 0);
  const gross = out.reduce((n, l) => n + l.amount, 0);
  const discountTotal = gross - out.reduce((n, l) => n + l.discounted, 0);
  return { lines: out, mode: effective, subtotal, tax, total: subtotal + tax, discountTotal };
}

export interface DocRow {
  id: string;
  org_id: string;
  kind: DocKind;
  number: string;
  contact_id: string | null;
  claimant_id: string | null;
  issue_date: string;
  due_date: string | null;
  reference: string;
  tax_mode: TaxMode;
  subtotal: number;
  tax_total: number;
  total: number;
  amount_paid: number;
  status: DocStatus;
  template_id: string | null;
  notes: string;
  terms: string;
  journal_id: string | null;
  void_journal_id: string | null;
  source_doc_id: string | null;
  recurring_id: string | null;
  sent_at: number | null;
  rejected_note: string;
  created_by: string | null;
  submitted_at: number | null;
  approved_by: string | null;
  approved_at: number | null;
  voided_at: number | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  delivery_address: string;
  sales_rep_id: string | null;
  discount_bp: number;
  quote_id: string | null;
  quote_bp: number;
  public_nonce: string | null;
  viewed_at: number | null;
}

/** An invoice made from a quote gives its share of the quote back when it is voided or deleted. */
export function releaseQuoteStmts(db: D1Database, a: FinAccess, d: DocRow): D1PreparedStatement[] {
  if (!d.quote_id || !d.quote_bp) return [];
  const t = now();
  return [
    db.prepare("UPDATE fin_quotes SET invoiced_bp = MAX(0, invoiced_bp - ?), status = CASE WHEN status = 'converted' THEN 'accepted' ELSE status END, updated_at = ? WHERE id = ? AND org_id = ?").bind(d.quote_bp, t, d.quote_id, a.orgId),
    db.prepare('UPDATE fin_docs SET quote_bp = 0 WHERE id = ? AND org_id = ?').bind(d.id, a.orgId),
    db.prepare('INSERT INTO fin_quote_events (id, org_id, quote_id, action, actor_id, actor_name, detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.orgId, d.quote_id, 'invoice_removed', a.userId, a.userName.slice(0, 120), JSON.stringify({ invoiceId: d.id, number: d.number, bp: d.quote_bp }), t),
  ];
}

export async function prepareDoc(db: D1Database, a: FinAccess, input: DocInput, approving: boolean) {
  requireBusiness(a);
  const chart = await chartOf(db, a);
  if (!isIsoDate(input.issueDate)) throw new HttpError(400, 'Use a valid date (YYYY-MM-DD)');
  if (input.dueDate && !isIsoDate(input.dueDate)) throw new HttpError(400, 'Use a valid due date');
  if (input.dueDate && input.dueDate < input.issueDate) throw new HttpError(400, 'The due date is before the date');
  let contact: { id: string; terms_days: number | null; name: string } | null = null;
  if (input.contactId) {
    contact = await db.prepare('SELECT id, terms_days, name FROM fin_contacts WHERE id = ? AND org_id = ?').bind(input.contactId, a.orgId).first();
    if (!contact) throw new HttpError(400, 'Choose a contact from this workspace');
  } else if (input.kind === 'invoice' || input.kind === 'bill' || input.kind === 'purchase_order') {
    if (approving || input.kind !== 'invoice') throw new HttpError(400, input.kind === 'invoice' ? 'Choose the customer' : 'Choose the supplier');
  }
  if (input.kind === 'expense_claim') await assertMember(db, a.orgId, input.claimantId ?? a.userId, 'The person claiming');
  if (input.templateId) {
    const t = await db.prepare('SELECT 1 FROM fin_doc_templates WHERE id = ? AND org_id = ?').bind(input.templateId, a.orgId).first();
    if (!t) throw new HttpError(400, 'Choose a template from this workspace');
  }
  if (!input.lines.length) throw new HttpError(400, 'Add at least one line');
  if (input.lines.length > 200) throw new HttpError(400, 'At most 200 lines');
  if (input.salesRepId) await assertMember(db, a.orgId, input.salesRepId, 'The salesperson');
  const priced = priceDocLines(a, chart, input.lines, input.taxMode ?? (a.gst ? 'exclusive' : 'none'), input.kind, approving && input.kind !== 'purchase_order', input.discountBp ?? 0);
  if (priced.total < 0) throw new HttpError(400, 'The total cannot be below zero');
  if (approving && priced.total === 0 && input.kind !== 'purchase_order') throw new HttpError(400, 'Approve a document with a total above zero');
  const due = input.dueDate ?? (input.kind === 'purchase_order' ? null : addDays(input.issueDate, contact?.terms_days ?? a.settings.termsDays));
  return { chart, priced, due, contact };
}

function lineStmts(db: D1Database, a: FinAccess, docId: string, lines: PricedDocLine[]) {
  return lines.map((l, i) =>
    db
      .prepare('INSERT INTO fin_doc_lines (id, org_id, doc_id, line_no, line_kind, item_code, unit, description, quantity_milli, unit_price, discount_bp, account_id, tax_code_id, net, tax, department_id, project_id, cost_centre_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), a.orgId, docId, i + 1, l.lineKind ?? 'item', (l.itemCode ?? '').slice(0, 40), (l.unit ?? '').slice(0, 20), (l.description ?? '').slice(0, 1000), l.quantityMilli, l.unitPrice, l.discountBp, l.accountId ?? null, l.taxCodeId ?? null, l.net, l.tax, l.departmentId ?? null, l.projectId ?? null, l.costCentreId ?? null),
  );
}

function postDocStmts(db: D1Database, a: FinAccess, chart: Chart, doc: { id: string; kind: DocKind; number: string; total: number; issueDate: string; contactId?: string | null; claimantId?: string | null }, lines: PricedDocLine[]) {
  if (doc.kind === 'purchase_order') return { journalId: null, stmts: [] as D1PreparedStatement[] };
  const ledger = documentLines(chart, { kind: doc.kind, total: doc.total, contactId: doc.contactId, claimantId: doc.claimantId, number: doc.number }, lines.filter((l) => l.accountId) as unknown as PricedLine[]);
  validateJournal(a, chart, doc.issueDate, ledger);
  const journalId = newId();
  return { journalId, stmts: journalStmts(db, { id: journalId, orgId: a.orgId, date: doc.issueDate, sourceType: doc.kind, sourceId: doc.id, memo: `${DOC_LABELS[doc.kind].one} ${doc.number}`, createdBy: a.userId, lines: ledger }) };
}

function statusFor(a: FinAccess, kind: DocKind, action: DocInput['action']): DocStatus {
  if (action === 'draft') return 'draft';
  if (action === 'submit') return 'submitted';
  return mayApprove(a, kind) ? 'approved' : 'submitted';
}

export async function createDoc(env: Env, a: FinAccess, input: DocInput, waitUntil?: (p: Promise<unknown>) => void) {
  const db = env.DB;
  const m = moduleOf(input.kind);
  if (!a.perms[m].create) deny(`You cannot create ${DOC_LABELS[input.kind].many.toLowerCase()}`);
  const status = statusFor(a, input.kind, input.action ?? 'draft');
  const { chart, priced, due } = await prepareDoc(db, a, input, status === 'approved');
  const id = newId();
  const t = now();
  const custom = input.number?.trim();
  const prefix = a.settings.prefixes[input.kind];
  // The number comes from the counter unless one is typed; the counter moves in the same transaction.
  const numberSql = custom ? '?' : `? || printf('%04d', (SELECT last_number FROM fin_counters WHERE org_id = ? AND key = ?))`;
  const numberArgs = custom ? [custom] : [prefix, a.orgId, input.kind];
  const claimant = input.kind === 'expense_claim' ? (input.claimantId ?? a.userId) : null;
  const stmts: D1PreparedStatement[] = [];
  if (!custom) stmts.push(db.prepare('INSERT INTO fin_counters (org_id, key, last_number) VALUES (?, ?, 1) ON CONFLICT(org_id, key) DO UPDATE SET last_number = last_number + 1').bind(a.orgId, input.kind));
  stmts.push(
    db
      .prepare(
        `INSERT INTO fin_docs (id, org_id, kind, number, contact_id, claimant_id, issue_date, due_date, reference, tax_mode, subtotal, tax_total, total, status, template_id, notes, terms, recurring_id, source_doc_id, search, created_by, submitted_at, created_at, updated_at, delivery_address, sales_rep_id, discount_bp, quote_id)
         VALUES (?, ?, ?, ${numberSql}, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.orgId, input.kind, ...numberArgs, input.contactId ?? null, claimant, input.issueDate, due, (input.reference ?? '').slice(0, 200), priced.mode, priced.subtotal, priced.tax, priced.total, input.templateId ?? null, (input.notes ?? '').slice(0, 4000), (input.terms ?? '').slice(0, 2000), input.recurringId ?? null, input.sourceDocId ?? null, '', a.userId, status === 'submitted' ? t : null, t, t, (input.deliveryAddress ?? '').slice(0, 500), input.salesRepId ?? null, input.discountBp ?? 0, input.quoteId ?? null),
    ...lineStmts(db, a, id, priced.lines),
  );
  await runBatch(db, stmts);
  const row = (await db.prepare('SELECT * FROM fin_docs WHERE id = ?').bind(id).first<DocRow>())!;
  const contactName = input.contactId ? ((await db.prepare('SELECT name FROM fin_contacts WHERE id = ?').bind(input.contactId).first<{ name: string }>())?.name ?? '') : '';
  const after: D1PreparedStatement[] = [db.prepare('UPDATE fin_docs SET search = ? WHERE id = ?').bind(searchText(row.number, contactName, row.reference), id), auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: `${input.kind}.created`, targetType: 'doc', targetId: id, after: { number: row.number, total: priced.total } })];
  if (status === 'submitted') after.push(db.prepare("UPDATE fin_docs SET status = 'submitted' WHERE id = ?").bind(id));
  await db.batch(after);
  if (status === 'approved') await approveDoc(env, a, { ...row, search: '' } as DocRow, waitUntil, chart, priced.lines);
  else if (status === 'submitted') await notifyDocApprovers(env, a, row, waitUntil);
  return { id, number: row.number, status };
}

async function notifyDocApprovers(env: Env, a: FinAccess, d: DocRow, waitUntil?: (p: Promise<unknown>) => void) {
  const approvers = await membersWithPerm(env.DB, a, moduleOf(d.kind), 'approve');
  await finNotify(env, { orgId: a.orgId, orgName: a.org.name, userIds: approvers, type: 'approval', title: `${a.userName} submitted ${DOC_LABELS[d.kind].one.toLowerCase()} ${d.number} for approval`, body: `${(d.total / 100).toFixed(2)} ${a.org.currency}`, link: docLink(a.orgId, d), actorId: a.userId, dedupeKey: `doc-submit:${d.id}:${now()}` }, waitUntil);
}

export const docLink = (orgId: string, d: { kind: DocKind; id: string }) => `/o/${orgId}/${DOC_LABELS[d.kind].path}/${d.id}`;

export async function loadDoc(db: D1Database, a: FinAccess, id: string): Promise<DocRow> {
  const d = await db.prepare('SELECT * FROM fin_docs WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(id, a.orgId).first<DocRow>();
  if (!d) throw notFound('Document');
  assertRecord(a, moduleOf(d.kind), 'view', d, DOC_LABELS[d.kind].one);
  return d;
}

export async function docInput(db: D1Database, d: DocRow): Promise<DocInput> {
  const lines = await db.prepare('SELECT * FROM fin_doc_lines WHERE doc_id = ? AND org_id = ? ORDER BY line_no').bind(d.id, d.org_id).all<any>();
  return {
    kind: d.kind,
    number: d.number,
    contactId: d.contact_id,
    claimantId: d.claimant_id,
    issueDate: d.issue_date,
    dueDate: d.due_date,
    reference: d.reference,
    taxMode: d.tax_mode,
    templateId: d.template_id,
    notes: d.notes,
    terms: d.terms,
    deliveryAddress: d.delivery_address ?? '',
    salesRepId: d.sales_rep_id ?? null,
    discountBp: d.discount_bp ?? 0,
    lines: lines.results.map((l) => ({ lineKind: l.line_kind ?? 'item', itemCode: l.item_code ?? '', unit: l.unit ?? '', description: l.description, quantity: l.quantity_milli / 1000, unitPrice: l.unit_price, discountBp: l.discount_bp, accountId: l.account_id, taxCodeId: l.tax_code_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
  };
}

/** Approve a document: post it (invoices, bills, claims) and mark it approved. */
export async function approveDoc(env: Env, a: FinAccess, d: DocRow, waitUntil?: (p: Promise<unknown>) => void, chartIn?: Chart, linesIn?: PricedDocLine[]) {
  const db = env.DB;
  if (!mayApprove(a, d.kind)) deny(`You cannot approve ${DOC_LABELS[d.kind].many.toLowerCase()}`);
  if (d.status !== 'draft' && d.status !== 'submitted') throw new HttpError(409, `This ${DOC_LABELS[d.kind].one.toLowerCase()} is ${d.status.replace('_', ' ')}`);
  let chart = chartIn;
  let lines = linesIn;
  if (!chart || !lines) {
    const input = await docInput(db, d);
    const p = await prepareDoc(db, a, input, true);
    chart = p.chart;
    lines = p.priced.lines;
  } else if (d.kind !== 'purchase_order' && lines.some((l) => !l.accountId && l.amount !== 0)) throw new HttpError(400, 'Choose an account for every line before approving');
  const post = postDocStmts(db, a, chart, { id: d.id, kind: d.kind, number: d.number, total: d.total, issueDate: d.issue_date, contactId: d.contact_id, claimantId: d.claimant_id }, lines);
  const t = now();
  await runBatch(db, [
    ...post.stmts,
    db.prepare("UPDATE fin_docs SET status = 'approved', journal_id = ?, approved_by = ?, approved_at = ?, rejected_note = '', updated_at = ? WHERE id = ? AND org_id = ? AND status IN ('draft','submitted')").bind(post.journalId, a.userId, t, t, d.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: `${d.kind}.approved`, targetType: 'doc', targetId: d.id, after: { journal: post.journalId } }),
  ]);
  if (d.created_by && d.created_by !== a.userId) {
    await finNotify(env, { orgId: a.orgId, orgName: a.org.name, userIds: [d.created_by], type: 'approved', title: `${a.userName} approved ${DOC_LABELS[d.kind].one.toLowerCase()} ${d.number}`, link: docLink(a.orgId, d), actorId: a.userId }, waitUntil);
  }
}

/**
 * Change a document. Drafts and submitted ones are rewritten (and may be submitted or approved). An approved one
 * without payments is changed by reversing its entry and posting the new one, which needs approval rights.
 */
export async function updateDoc(env: Env, a: FinAccess, d: DocRow, patch: Partial<DocInput>, waitUntil?: (p: Promise<unknown>) => void) {
  const db = env.DB;
  assertRecord(a, moduleOf(d.kind), 'edit', d, DOC_LABELS[d.kind].one);
  if (d.status === 'void' || d.status === 'billed') throw new HttpError(409, `This ${DOC_LABELS[d.kind].one.toLowerCase()} is ${d.status}`);
  if (d.amount_paid > 0) throw new HttpError(409, 'Payments or credits have been recorded: void or remove them before changing the amounts');
  const current = await docInput(db, d);
  const next: DocInput = { ...current, ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)), kind: d.kind };
  const t = now();
  const approved = d.status === 'approved';
  if (approved && !mayApprove(a, d.kind)) deny('Only people who can approve can change an approved document');
  const { chart, priced, due } = await prepareDoc(db, a, next, approved);
  const number = next.number?.trim() || d.number;
  const stmts: D1PreparedStatement[] = [];
  let journalId: string | null = d.journal_id;
  if (approved && d.journal_id) {
    const rev = await reversalStmts(db, a, d.journal_id, { memo: `${DOC_LABELS[d.kind].one} ${d.number} changed: previous entry reversed` });
    const post = postDocStmts(db, a, chart, { id: d.id, kind: d.kind, number, total: priced.total, issueDate: next.issueDate, contactId: next.contactId, claimantId: next.claimantId }, priced.lines);
    stmts.push(...rev.stmts, ...post.stmts);
    journalId = post.journalId;
  }
  const contactName = next.contactId ? ((await db.prepare('SELECT name FROM fin_contacts WHERE id = ?').bind(next.contactId).first<{ name: string }>())?.name ?? '') : '';
  stmts.push(
    db.prepare('DELETE FROM fin_doc_lines WHERE doc_id = ? AND org_id = ?').bind(d.id, a.orgId),
    ...lineStmts(db, a, d.id, priced.lines),
    db
      .prepare('UPDATE fin_docs SET number = ?, contact_id = ?, claimant_id = ?, issue_date = ?, due_date = ?, reference = ?, tax_mode = ?, subtotal = ?, tax_total = ?, total = ?, template_id = ?, notes = ?, terms = ?, journal_id = ?, search = ?, delivery_address = ?, sales_rep_id = ?, discount_bp = ?, updated_at = ? WHERE id = ? AND org_id = ?')
      .bind(number, next.contactId ?? null, d.kind === 'expense_claim' ? (next.claimantId ?? d.claimant_id) : null, next.issueDate, due, (next.reference ?? '').slice(0, 200), priced.mode, priced.subtotal, priced.tax, priced.total, next.templateId ?? null, (next.notes ?? '').slice(0, 4000), (next.terms ?? '').slice(0, 2000), journalId, searchText(number, contactName, next.reference), (next.deliveryAddress ?? '').slice(0, 500), next.salesRepId ?? null, next.discountBp ?? 0, t, d.id, a.orgId),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: `${d.kind}.updated`, targetType: 'doc', targetId: d.id, before: { total: d.total }, after: { total: priced.total, reposted: approved } }),
  );
  await runBatch(db, stmts);
  if (!approved && patch.action && patch.action !== 'draft') {
    const fresh = (await db.prepare('SELECT * FROM fin_docs WHERE id = ?').bind(d.id).first<DocRow>())!;
    if (patch.action === 'approve' && mayApprove(a, d.kind)) await approveDoc(env, a, fresh, waitUntil);
    else if (fresh.status === 'draft') {
      await db.prepare("UPDATE fin_docs SET status = 'submitted', submitted_at = ?, updated_at = ? WHERE id = ?").bind(t, t, d.id).run();
      await notifyDocApprovers(env, a, fresh, waitUntil);
    }
  }
}

/** Void: an approved document without payments is reversed; a draft or submitted one is simply voided. */
export async function voidDoc(env: Env, a: FinAccess, d: DocRow, date?: string | null) {
  const db = env.DB;
  assertRecord(a, moduleOf(d.kind), 'edit', d, DOC_LABELS[d.kind].one);
  if (d.status === 'void') throw new HttpError(409, 'Already void');
  if (d.status === 'billed') throw new HttpError(409, 'This purchase order has been turned into a bill');
  const live = await db.prepare('SELECT COUNT(*) AS n FROM fin_payments WHERE org_id = ? AND doc_id = ? AND voided_at IS NULL').bind(a.orgId, d.id).first<{ n: number }>();
  if (live?.n) throw new HttpError(409, 'Void its payments first');
  const credits = await db.prepare('SELECT COUNT(*) AS n FROM fin_credit_allocations WHERE org_id = ? AND invoice_id = ? AND voided_at IS NULL').bind(a.orgId, d.id).first<{ n: number }>();
  if (credits?.n) throw new HttpError(409, 'Remove the credit applied to it first');
  const stmts: D1PreparedStatement[] = [];
  let voidJournal: string | null = null;
  if (d.journal_id && d.status !== 'draft' && d.status !== 'submitted') {
    if (!mayApprove(a, d.kind)) deny('Only people who can approve can void an approved document');
    const rev = await reversalStmts(db, a, d.journal_id, { date, memo: `${DOC_LABELS[d.kind].one} ${d.number} voided` });
    stmts.push(...rev.stmts);
    voidJournal = rev.reversalId;
  }
  const t = now();
  stmts.push(
    db.prepare("UPDATE fin_docs SET status = 'void', void_journal_id = ?, voided_at = ?, public_nonce = NULL, updated_at = ? WHERE id = ? AND org_id = ?").bind(voidJournal, t, t, d.id, a.orgId),
    ...releaseQuoteStmts(db, a, d),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: `${d.kind}.voided`, targetType: 'doc', targetId: d.id, after: { reversal: voidJournal } }),
  );
  await runBatch(db, stmts);
}

/** Record a payment (money in for an invoice, money out for a bill or claim). */
export async function addPayment(env: Env, a: FinAccess, d: DocRow, p: { accountId: string; date: string; amount: number; reference?: string }) {
  const db = env.DB;
  if (d.kind === 'purchase_order') throw new HttpError(400, 'Purchase orders are not paid; turn one into a bill first');
  if (!mayApprove(a, d.kind)) deny('You cannot record payments');
  if (d.status !== 'approved' && d.status !== 'part_paid') throw new HttpError(409, d.status === 'paid' ? 'Already paid in full' : 'Approve it before recording a payment');
  const due = d.total - d.amount_paid;
  if (!Number.isSafeInteger(p.amount) || p.amount <= 0) throw new HttpError(400, 'Enter the amount paid');
  if (p.amount > due) throw new HttpError(400, `The payment is more than the ${(due / 100).toFixed(2)} still due`);
  const chart = await chartOf(db, a);
  moneyAccount(chart, p.accountId);
  const ledger = paymentLines(chart, { kind: d.kind, accountId: p.accountId, amount: p.amount, contactId: d.contact_id, claimantId: d.claimant_id, description: `Payment ${d.number}${p.reference ? ` ${p.reference}` : ''}` });
  validateJournal(a, chart, p.date, ledger);
  const payId = newId();
  const journalId = newId();
  const paid = d.amount_paid + p.amount;
  const status: DocStatus = paid >= d.total ? 'paid' : 'part_paid';
  await runBatch(db, [
    ...journalStmts(db, { id: journalId, orgId: a.orgId, date: p.date, sourceType: 'payment', sourceId: d.id, memo: `Payment for ${DOC_LABELS[d.kind].one.toLowerCase()} ${d.number}`, createdBy: a.userId, lines: ledger }),
    db.prepare('INSERT INTO fin_payments (id, org_id, doc_id, account_id, date, amount, reference, journal_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(payId, a.orgId, d.id, p.accountId, p.date, p.amount, (p.reference ?? '').slice(0, 100), journalId, a.userId, now()),
    // Guarded by the amount still due, so two payments at once cannot overpay.
    db.prepare('UPDATE fin_docs SET amount_paid = amount_paid + ?, status = ?, updated_at = ? WHERE id = ? AND org_id = ? AND total - amount_paid >= ?').bind(p.amount, status, now(), d.id, a.orgId, p.amount),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'payment.recorded', targetType: 'doc', targetId: d.id, after: { amount: p.amount, date: p.date, payment: payId } }),
  ]);
  const check = await db.prepare('SELECT amount_paid FROM fin_docs WHERE id = ?').bind(d.id).first<{ amount_paid: number }>();
  if ((check?.amount_paid ?? 0) !== paid) throw new HttpError(409, 'Another payment was recorded at the same time; refresh and try again');
  return { id: payId, status };
}

export async function voidPayment(env: Env, a: FinAccess, d: DocRow, paymentId: string, date?: string | null) {
  const db = env.DB;
  if (!mayApprove(a, d.kind)) deny('You cannot void payments');
  const p = await db.prepare('SELECT * FROM fin_payments WHERE id = ? AND org_id = ? AND doc_id = ?').bind(paymentId, a.orgId, d.id).first<any>();
  if (!p) throw notFound('Payment');
  if (p.voided_at) throw new HttpError(409, 'Already void');
  if (p.reconciled) throw new HttpError(409, 'This payment is reconciled. Mark it unreconciled before voiding it.');
  const rev = await reversalStmts(db, a, p.journal_id, { date, memo: `Payment for ${d.number} voided` });
  const paid = d.amount_paid - p.amount;
  const t = now();
  await runBatch(db, [
    ...rev.stmts,
    db.prepare('UPDATE fin_payments SET voided_at = ?, void_journal_id = ? WHERE id = ? AND org_id = ?').bind(t, rev.reversalId, p.id, a.orgId),
    db.prepare('UPDATE fin_docs SET amount_paid = ?, status = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(paid, paid > 0 ? 'part_paid' : 'approved', t, d.id, a.orgId),
    db.prepare("UPDATE fin_statement_lines SET status = 'unmatched', matched_type = NULL, matched_id = NULL WHERE org_id = ? AND matched_type = 'payment' AND matched_id = ?").bind(a.orgId, p.id),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'payment.voided', targetType: 'doc', targetId: d.id, after: { payment: p.id, reversal: rev.reversalId } }),
  ]);
}

export async function docDTOs(db: D1Database, a: FinAccess, rows: any[], today: string, full = false) {
  const ids = rows.map((r) => r.id);
  const [lines, payments, credits, quotes] = full && ids.length
    ? await Promise.all([
        db.prepare(`SELECT * FROM fin_doc_lines WHERE org_id = ? AND doc_id IN (${placeholders(ids.length)}) ORDER BY line_no`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT p.*, ac.name AS account_name FROM fin_payments p JOIN fin_accounts ac ON ac.id = p.account_id WHERE p.org_id = ? AND p.doc_id IN (${placeholders(ids.length)}) ORDER BY p.date`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT al.*, cn.number AS credit_number FROM fin_credit_allocations al JOIN fin_credit_notes cn ON cn.id = al.credit_note_id WHERE al.org_id = ? AND al.invoice_id IN (${placeholders(ids.length)}) ORDER BY al.date`).bind(a.orgId, ...ids).all<any>(),
        db.prepare(`SELECT q.id, q.number FROM fin_quotes q WHERE q.org_id = ? AND q.id IN (SELECT quote_id FROM fin_docs WHERE org_id = ? AND id IN (${placeholders(ids.length)}))`).bind(a.orgId, a.orgId, ...ids).all<any>(),
      ])
    : [{ results: [] as any[] }, { results: [] as any[] }, { results: [] as any[] }, { results: [] as any[] }];
  return rows.map((r) => {
    const m = moduleOf(r.kind);
    const open = r.status === 'approved' || r.status === 'part_paid';
    return {
      id: r.id,
      kind: r.kind,
      number: r.number,
      contactId: r.contact_id,
      contactName: r.contact_name ?? null,
      claimantId: r.claimant_id,
      claimantName: r.claimant_name ?? null,
      issueDate: r.issue_date,
      dueDate: r.due_date,
      reference: r.reference,
      taxMode: r.tax_mode,
      subtotal: r.subtotal,
      taxTotal: r.tax_total,
      total: r.total,
      amountPaid: r.amount_paid,
      amountDue: r.status === 'void' ? 0 : r.total - r.amount_paid,
      status: r.status,
      overdue: open && !!r.due_date && r.due_date < today,
      templateId: r.template_id,
      notes: r.notes,
      terms: r.terms,
      journalId: r.journal_id,
      sourceDocId: r.source_doc_id,
      recurringId: r.recurring_id,
      sentAt: r.sent_at,
      rejectedNote: r.rejected_note,
      createdBy: r.created_by,
      createdByName: r.created_by_name ?? null,
      approvedAt: r.approved_at,
      voidedAt: r.voided_at,
      createdAt: r.created_at,
      fileCount: r.file_count ?? 0,
      deliveryAddress: r.delivery_address ?? '',
      salesRepId: r.sales_rep_id ?? null,
      discountBp: r.discount_bp ?? 0,
      quoteId: r.quote_id ?? null,
      online: !!r.public_nonce,
      viewedAt: r.viewed_at ?? null,
      lines: lines.results.filter((l) => l.doc_id === r.id).map((l) => ({ id: l.id, lineKind: l.line_kind ?? 'item', itemCode: l.item_code ?? '', unit: l.unit ?? '', description: l.description, quantity: l.quantity_milli / 1000, unitPrice: l.unit_price, discountBp: l.discount_bp, accountId: l.account_id, taxCodeId: l.tax_code_id, net: l.net, tax: l.tax, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
      payments: payments.results.filter((p) => p.doc_id === r.id).map((p) => ({ id: p.id, accountId: p.account_id, accountName: p.account_name, date: p.date, amount: p.amount, reference: p.reference, voided: !!p.voided_at, reconciled: !!p.reconciled })),
      credits: credits.results.filter((x) => x.invoice_id === r.id).map((x) => ({ id: x.id, creditNoteId: x.credit_note_id, creditNumber: x.credit_number, date: x.date, amount: x.amount, removed: !!x.voided_at })),
      quoteNumber: quotes.results.find((x) => x.id === r.quote_id)?.number ?? null,
      quoteBp: r.quote_bp ?? 0,
      can: {
        edit: canRecord(a, m, 'edit', r) && ['draft', 'submitted'].includes(r.status) || (r.status === 'approved' && r.amount_paid === 0 && mayApprove(a, r.kind) && canRecord(a, m, 'edit', r)),
        delete: canRecord(a, m, 'delete', r) && ['draft', 'submitted'].includes(r.status),
        approve: ['draft', 'submitted'].includes(r.status) && mayApprove(a, r.kind),
        pay: open && r.kind !== 'purchase_order' && mayApprove(a, r.kind),
        void: r.status !== 'void' && r.status !== 'billed' && canRecord(a, m, 'edit', r) && (['draft', 'submitted'].includes(r.status) || mayApprove(a, r.kind)),
        credit: r.kind === 'invoice' && ['approved', 'part_paid', 'paid'].includes(r.status) && !!a.perms.sales.create,
        share: r.kind === 'invoice' && ['approved', 'part_paid', 'paid'].includes(r.status) && canRecord(a, m, 'edit', r),
      },
    };
  });
}
