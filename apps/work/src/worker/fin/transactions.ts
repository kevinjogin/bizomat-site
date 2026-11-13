// Transactions on money accounts: money in (receive), money out (spend) and transfers, with split lines. Used by the
// routes, by bank statement matching and by recurring transactions, so every path applies the same rules.

import { HttpError, newId, notFound, now, placeholders } from '../lib/util';
import { addDays } from '../../shared/fin/dates';
import { SUBTYPES } from '../../shared/fin/charts';
import type { TaxMode } from '../../shared/fin/tax';
import { type FinAccess, assertMember, assertRecord, canRecord, deny, hasPerm, membersWithPerm } from './access';
import { type AmountLineInput, type Chart, chartOf, journalStmts, priceLines, reversalStmts, transactionLines, validateJournal } from './ledger';
import { auditStmt, finNotify, runBatch, searchText } from './util';
import type { Env } from '../env';

export interface TxInput {
  kind: 'receive' | 'spend' | 'transfer';
  accountId: string;
  toAccountId?: string | null;
  date: string;
  contactId?: string | null;
  payee?: string;
  reference?: string;
  description?: string;
  taxMode?: TaxMode;
  notes?: string;
  personId?: string | null;
  /** Transfers: the amount moved. */
  amount?: number;
  lines?: AmountLineInput[];
  /** draft: keep for later; submit: ask for approval; post: write to the ledger (or submit when approval is needed). */
  action?: 'draft' | 'submit' | 'post';
  recurringId?: string | null;
}

export interface TxRow {
  id: string;
  org_id: string;
  kind: 'receive' | 'spend' | 'transfer';
  account_id: string;
  to_account_id: string | null;
  date: string;
  contact_id: string | null;
  payee: string;
  reference: string;
  description: string;
  tax_mode: TaxMode;
  total: number;
  status: 'draft' | 'submitted' | 'posted' | 'void';
  journal_id: string | null;
  void_journal_id: string | null;
  reconciled: number;
  recurring_id: string | null;
  notes: string;
  person_id: string | null;
  created_by: string | null;
  submitted_at: number | null;
  approved_by: string | null;
  approved_at: number | null;
  rejected_note: string;
  voided_at: number | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export function moneyAccount(chart: Chart, accountId: string | null | undefined, label = 'account') {
  const acc = accountId ? chart.accounts.get(accountId) : undefined;
  if (!acc) throw new HttpError(400, `Choose the ${label} from this workspace`);
  if (!SUBTYPES[acc.subtype]?.money) throw new HttpError(400, `${acc.name} is not a bank, cash, credit card or loan account`);
  if (acc.archived_at) throw new HttpError(400, `The account ${acc.name} is archived`);
  return acc;
}

/** Whether this person's new or changed transaction is posted straight away (else it waits for approval). */
export function postsDirectly(a: FinAccess): boolean {
  return a.perms.banking.approve || !a.settings.approvals.transactions;
}

/** Validated, priced transaction with the statements that write it (and post it when the status is posted). */
export async function prepareTransaction(db: D1Database, a: FinAccess, input: TxInput) {
  const chart = await chartOf(db, a);
  const acc = moneyAccount(chart, input.accountId);
  if (input.contactId) {
    const ok = await db.prepare('SELECT 1 FROM fin_contacts WHERE id = ? AND org_id = ?').bind(input.contactId, a.orgId).first();
    if (!ok) throw new HttpError(400, 'Choose a contact from this workspace');
  }
  if (input.personId) await assertMember(db, a.orgId, input.personId);
  let priced = { lines: [] as ReturnType<typeof priceLines>['lines'], mode: 'none' as TaxMode, subtotal: 0, tax: 0, total: 0 };
  if (input.kind === 'transfer') {
    const to = moneyAccount(chart, input.toAccountId, 'account the money goes to');
    if (to.id === acc.id) throw new HttpError(400, 'Choose two different accounts');
    if (!Number.isSafeInteger(input.amount) || (input.amount ?? 0) <= 0) throw new HttpError(400, 'Enter the amount transferred');
    priced.total = input.amount!;
  } else {
    if (!input.lines?.length) throw new HttpError(400, 'Choose a category and an amount');
    if (input.lines.length > 100) throw new HttpError(400, 'Split into at most 100 lines');
    for (const l of input.lines) {
      const cat = chart.accounts.get(l.accountId);
      if (cat && SUBTYPES[cat.subtype]?.money && cat.id === acc.id) throw new HttpError(400, 'A line cannot go to the same account as the transaction');
    }
    priced = priceLines(a, chart, input.lines, input.taxMode ?? 'inclusive', input.kind === 'receive' ? 'sales' : 'purchases');
    if (priced.total <= 0) throw new HttpError(400, input.kind === 'receive' ? 'Money in must be more than zero (record a refund as money out)' : 'Money out must be more than zero (record a refund as money in)');
  }
  const action = input.action ?? 'post';
  const status: TxRow['status'] = action === 'draft' ? 'draft' : action === 'submit' ? 'submitted' : postsDirectly(a) ? 'posted' : 'submitted';
  return { chart, acc, priced, status };
}

function lineStmts(db: D1Database, a: FinAccess, txId: string, lines: ReturnType<typeof priceLines>['lines']) {
  return lines.map((l, i) =>
    db
      .prepare('INSERT INTO fin_transaction_lines (id, org_id, transaction_id, line_no, account_id, description, net, tax, tax_code_id, department_id, project_id, cost_centre_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), a.orgId, txId, i + 1, l.accountId, (l.description ?? '').slice(0, 300), l.net, l.tax, l.taxCodeId ?? null, l.departmentId ?? null, l.projectId ?? null, l.costCentreId ?? null),
  );
}

function postStmts(db: D1Database, a: FinAccess, chart: Chart, txId: string, input: TxInput, priced: { lines: ReturnType<typeof priceLines>['lines']; total: number }) {
  const lines = transactionLines(chart, { kind: input.kind, accountId: input.accountId, toAccountId: input.toAccountId, total: priced.total, contactId: input.contactId, personId: input.personId, description: input.description || input.payee || '' }, priced.lines);
  validateJournal(a, chart, input.date, lines);
  const journalId = newId();
  return { journalId, stmts: journalStmts(db, { id: journalId, orgId: a.orgId, date: input.date, sourceType: 'transaction', sourceId: txId, memo: input.description || input.payee || '', createdBy: a.userId, lines }) };
}

/** Create a transaction; returns its id and status. */
export async function createTransaction(env: Env, a: FinAccess, input: TxInput, extra: D1PreparedStatement[] = [], waitUntil?: (p: Promise<unknown>) => void) {
  const db = env.DB;
  if (!a.perms.banking.create) deny('You cannot add transactions');
  const { chart, priced, status } = await prepareTransaction(db, a, input);
  const id = newId();
  const t = now();
  const post = status === 'posted' ? postStmts(db, a, chart, id, input, priced) : null;
  const stmts: D1PreparedStatement[] = [
    ...(post?.stmts ?? []),
    db
      .prepare(
        `INSERT INTO fin_transactions (id, org_id, kind, account_id, to_account_id, date, contact_id, payee, reference, description, tax_mode, total, status, journal_id, recurring_id, notes, person_id, search, created_by, submitted_at, approved_by, approved_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        a.orgId,
        input.kind,
        input.accountId,
        input.kind === 'transfer' ? input.toAccountId : null,
        input.date,
        input.contactId ?? null,
        (input.payee ?? '').slice(0, 200),
        (input.reference ?? '').slice(0, 100),
        (input.description ?? '').slice(0, 500),
        input.kind === 'transfer' ? 'none' : priced.mode,
        priced.total,
        status,
        post?.journalId ?? null,
        input.recurringId ?? null,
        (input.notes ?? '').slice(0, 4000),
        input.personId ?? null,
        searchText(input.payee, input.description, input.reference),
        a.userId,
        status === 'submitted' ? t : null,
        status === 'posted' ? a.userId : null,
        status === 'posted' ? t : null,
        t,
        t,
      ),
    ...lineStmts(db, a, id, priced.lines),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: `transaction.${status === 'posted' ? 'posted' : status === 'submitted' ? 'submitted' : 'drafted'}`, targetType: 'transaction', targetId: id, after: { kind: input.kind, date: input.date, total: priced.total } }),
    ...extra,
  ];
  await runBatch(db, stmts);
  if (status === 'submitted') await notifyApprovers(env, a, id, priced.total, input.description || input.payee || 'A transaction', waitUntil);
  return { id, status, total: priced.total };
}

async function notifyApprovers(env: Env, a: FinAccess, id: string, total: number, what: string, waitUntil?: (p: Promise<unknown>) => void) {
  const approvers = await membersWithPerm(env.DB, a, 'banking', 'approve');
  await finNotify(env, { orgId: a.orgId, orgName: a.org.name, userIds: approvers, type: 'approval', title: `${a.userName} submitted a transaction for approval`, body: `${what}: ${(total / 100).toFixed(2)} ${a.org.currency}`, link: `/o/${a.orgId}/transactions/${id}`, actorId: a.userId, dedupeKey: `tx-submit:${id}:${now()}` }, waitUntil);
}

export async function loadTransaction(db: D1Database, a: FinAccess, id: string): Promise<TxRow> {
  const r = await db.prepare('SELECT * FROM fin_transactions WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(id, a.orgId).first<TxRow>();
  if (!r) throw notFound('Transaction');
  assertRecord(a, 'banking', 'view', r, 'Transaction');
  return r;
}

export async function transactionInput(db: D1Database, r: TxRow): Promise<TxInput> {
  const lines = await db.prepare('SELECT * FROM fin_transaction_lines WHERE transaction_id = ? AND org_id = ? ORDER BY line_no').bind(r.id, r.org_id).all<any>();
  return {
    kind: r.kind,
    accountId: r.account_id,
    toAccountId: r.to_account_id,
    date: r.date,
    contactId: r.contact_id,
    payee: r.payee,
    reference: r.reference,
    description: r.description,
    taxMode: r.tax_mode,
    notes: r.notes,
    personId: r.person_id,
    amount: r.kind === 'transfer' ? r.total : undefined,
    lines: lines.results.map((l) => ({ accountId: l.account_id, description: l.description, amount: r.tax_mode === 'inclusive' ? l.net + l.tax : l.net, taxCodeId: l.tax_code_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
  };
}

const LEDGER_FIELDS = ['kind', 'accountId', 'toAccountId', 'date', 'contactId', 'taxMode', 'personId', 'amount', 'lines'] as const;

/**
 * Change a transaction. A draft or submitted one is rewritten. A posted one keeps its description, reference, payee and
 * notes edits in place; anything that changes the ledger reverses its journal and posts a new one (both dated the
 * transaction's date, so the period's figures stay right), which needs approval rights and an open period.
 */
export async function updateTransaction(env: Env, a: FinAccess, r: TxRow, patch: Partial<TxInput>, waitUntil?: (p: Promise<unknown>) => void) {
  const db = env.DB;
  assertRecord(a, 'banking', 'edit', r, 'Transaction');
  if (r.status === 'void') throw new HttpError(409, 'A voided transaction cannot be changed');
  const current = await transactionInput(db, r);
  const next: TxInput = { ...current, ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)), action: undefined };
  const t = now();
  const touchesLedger = LEDGER_FIELDS.some((k) => patch[k] !== undefined && JSON.stringify(patch[k]) !== JSON.stringify((current as any)[k]));
  if (r.status === 'posted') {
    if (!touchesLedger) {
      await db.batch([
        db.prepare('UPDATE fin_transactions SET payee = ?, reference = ?, description = ?, notes = ?, search = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind((next.payee ?? '').slice(0, 200), (next.reference ?? '').slice(0, 100), (next.description ?? '').slice(0, 500), (next.notes ?? '').slice(0, 4000), searchText(next.payee, next.description, next.reference), t, r.id, a.orgId),
        auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'transaction.updated', targetType: 'transaction', targetId: r.id, after: patch }),
      ]);
      return { status: r.status };
    }
    if (!a.perms.banking.approve) deny('Only people who can approve transactions can change a posted one');
    if (r.reconciled) throw new HttpError(409, 'This transaction is reconciled. Mark it unreconciled before changing its amount, account or date.');
    const { chart, priced } = await prepareTransaction(db, a, { ...next, action: 'post' });
    const rev = await reversalStmts(db, a, r.journal_id!, { memo: 'Changed: previous entry reversed' });
    const post = postStmts(db, a, chart, r.id, next, priced);
    await runBatch(db, [
      ...rev.stmts,
      ...post.stmts,
      db.prepare('DELETE FROM fin_transaction_lines WHERE transaction_id = ? AND org_id = ?').bind(r.id, a.orgId),
      ...lineStmts(db, a, r.id, priced.lines),
      db
        .prepare('UPDATE fin_transactions SET kind = ?, account_id = ?, to_account_id = ?, date = ?, contact_id = ?, payee = ?, reference = ?, description = ?, tax_mode = ?, total = ?, journal_id = ?, notes = ?, person_id = ?, search = ?, updated_at = ? WHERE id = ? AND org_id = ?')
        .bind(next.kind, next.accountId, next.kind === 'transfer' ? next.toAccountId : null, next.date, next.contactId ?? null, (next.payee ?? '').slice(0, 200), (next.reference ?? '').slice(0, 100), (next.description ?? '').slice(0, 500), next.kind === 'transfer' ? 'none' : priced.mode, priced.total, post.journalId, (next.notes ?? '').slice(0, 4000), next.personId ?? null, searchText(next.payee, next.description, next.reference), t, r.id, a.orgId),
      auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'transaction.reposted', targetType: 'transaction', targetId: r.id, before: { total: r.total, date: r.date, journal: r.journal_id }, after: { total: priced.total, date: next.date, journal: post.journalId, reversal: rev.reversalId } }),
    ]);
    return { status: 'posted' as const };
  }
  // Draft or submitted: rewrite, and post or submit if asked.
  const action = patch.action ?? (r.status === 'submitted' ? 'submit' : 'draft');
  const { chart, priced, status } = await prepareTransaction(db, a, { ...next, action });
  const post = status === 'posted' ? postStmts(db, a, chart, r.id, next, priced) : null;
  await runBatch(db, [
    ...(post?.stmts ?? []),
    db.prepare('DELETE FROM fin_transaction_lines WHERE transaction_id = ? AND org_id = ?').bind(r.id, a.orgId),
    ...lineStmts(db, a, r.id, priced.lines),
    db
      .prepare('UPDATE fin_transactions SET kind = ?, account_id = ?, to_account_id = ?, date = ?, contact_id = ?, payee = ?, reference = ?, description = ?, tax_mode = ?, total = ?, status = ?, journal_id = ?, notes = ?, person_id = ?, search = ?, submitted_at = ?, approved_by = ?, approved_at = ?, rejected_note = ?, updated_at = ? WHERE id = ? AND org_id = ?')
      .bind(
        next.kind,
        next.accountId,
        next.kind === 'transfer' ? next.toAccountId : null,
        next.date,
        next.contactId ?? null,
        (next.payee ?? '').slice(0, 200),
        (next.reference ?? '').slice(0, 100),
        (next.description ?? '').slice(0, 500),
        next.kind === 'transfer' ? 'none' : priced.mode,
        priced.total,
        status,
        post?.journalId ?? null,
        (next.notes ?? '').slice(0, 4000),
        next.personId ?? null,
        searchText(next.payee, next.description, next.reference),
        status === 'submitted' ? (r.submitted_at ?? t) : null,
        status === 'posted' ? a.userId : null,
        status === 'posted' ? t : null,
        status === 'draft' ? r.rejected_note : '',
        t,
        r.id,
        a.orgId,
      ),
    auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: `transaction.${status === 'posted' ? 'posted' : status === 'submitted' ? 'submitted' : 'updated'}`, targetType: 'transaction', targetId: r.id, after: { total: priced.total, date: next.date } }),
  ]);
  if (status === 'submitted' && r.status !== 'submitted') await notifyApprovers(env, a, r.id, priced.total, next.description || next.payee || 'A transaction', waitUntil);
  return { status };
}

/** Approve (post) a submitted or draft transaction. */
export async function approveTransaction(env: Env, a: FinAccess, r: TxRow, waitUntil?: (p: Promise<unknown>) => void) {
  if (!a.perms.banking.approve) deny('You cannot approve transactions');
  if (r.status === 'posted') return { status: 'posted' as const };
  if (r.status === 'void') throw new HttpError(409, 'This transaction is void');
  const input = await transactionInput(env.DB, r);
  const { chart, priced } = await prepareTransaction(env.DB, a, { ...input, action: 'post' });
  const post = postStmts(env.DB, a, chart, r.id, input, priced);
  const t = now();
  await runBatch(env.DB, [
    ...post.stmts,
    env.DB.prepare("UPDATE fin_transactions SET status = 'posted', journal_id = ?, approved_by = ?, approved_at = ?, rejected_note = '', updated_at = ? WHERE id = ? AND org_id = ? AND status IN ('draft','submitted')").bind(post.journalId, a.userId, t, t, r.id, a.orgId),
    auditStmt(env.DB, { orgId: a.orgId, actorId: a.userId, action: 'transaction.approved', targetType: 'transaction', targetId: r.id }),
  ]);
  if (r.created_by && r.created_by !== a.userId) {
    await finNotify(env, { orgId: a.orgId, orgName: a.org.name, userIds: [r.created_by], type: 'approved', title: `${a.userName} approved your transaction`, body: r.description || r.payee, link: `/o/${a.orgId}/transactions/${r.id}`, actorId: a.userId }, waitUntil);
  }
  return { status: 'posted' as const };
}

export async function voidTransaction(env: Env, a: FinAccess, r: TxRow, date?: string | null) {
  assertRecord(a, 'banking', 'edit', r, 'Transaction');
  if (!a.perms.banking.approve) deny('Only people who can approve transactions can void one');
  if (r.status !== 'posted') throw new HttpError(409, 'Only a posted transaction is voided; delete a draft instead');
  if (r.reconciled) throw new HttpError(409, 'This transaction is reconciled. Mark it unreconciled before voiding it.');
  const rev = await reversalStmts(env.DB, a, r.journal_id!, { date, memo: 'Transaction voided' });
  const t = now();
  await runBatch(env.DB, [
    ...rev.stmts,
    env.DB.prepare("UPDATE fin_transactions SET status = 'void', void_journal_id = ?, voided_at = ?, updated_at = ? WHERE id = ? AND org_id = ?").bind(rev.reversalId, t, t, r.id, a.orgId),
    env.DB.prepare("UPDATE fin_statement_lines SET status = 'unmatched', matched_type = NULL, matched_id = NULL WHERE org_id = ? AND matched_type = 'transaction' AND matched_id = ?").bind(a.orgId, r.id),
    auditStmt(env.DB, { orgId: a.orgId, actorId: a.userId, action: 'transaction.voided', targetType: 'transaction', targetId: r.id, after: { reversal: rev.reversalId, date: rev.date } }),
  ]);
}

/** Possible duplicates: the same amount and direction on the same account within a few days, not voided. */
export async function findDuplicates(db: D1Database, a: FinAccess, p: { accountId: string; date: string; total: number; kind: string; excludeId?: string }) {
  const days = a.settings.duplicateDays;
  const rows = await db
    .prepare(
      `SELECT id, date, total, payee, description, status FROM fin_transactions
       WHERE org_id = ? AND account_id = ? AND kind = ? AND total = ? AND date BETWEEN ? AND ? AND status <> 'void' AND deleted_at IS NULL AND id <> ? LIMIT 5`,
    )
    .bind(a.orgId, p.accountId, p.kind, p.total, addDays(p.date, -days), addDays(p.date, days), p.excludeId ?? '')
    .all<any>();
  return rows.results.map((r) => ({ id: r.id, date: r.date, total: r.total, description: r.description || r.payee, status: r.status }));
}

/**
 * Category suggestions for a bank line or new transaction: the workspace's rules first, then what was chosen the last
 * times the same payee or words appeared. Suggestions only: nothing is posted until a person saves it.
 */
export async function suggest(db: D1Database, a: FinAccess, text: string, direction: 'in' | 'out') {
  const t = text.toLowerCase().trim();
  if (!t) return [];
  const out: { accountId: string; taxCodeId: string | null; contactId: string | null; reason: string }[] = [];
  const rules = await db.prepare('SELECT * FROM fin_rules WHERE org_id = ? ORDER BY position, created_at').bind(a.orgId).all<any>();
  for (const r of rules.results) {
    if ((r.direction === 'any' || r.direction === direction) && t.includes(r.match_text)) out.push({ accountId: r.account_id, taxCodeId: r.tax_code_id, contactId: r.contact_id, reason: `Rule: text contains "${r.match_text}"` });
  }
  const words = t.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length >= 3 && !/^\d+$/.test(w)).slice(0, 2);
  if (words.length) {
    const like = `%${words.join('%')}%`;
    const hist = await db
      .prepare(
        `SELECT l.account_id, l.tax_code_id, t.contact_id, COUNT(*) AS n FROM fin_transactions t JOIN fin_transaction_lines l ON l.transaction_id = t.id
         WHERE t.org_id = ? AND t.status = 'posted' AND t.kind = ? AND t.search LIKE ? GROUP BY l.account_id, l.tax_code_id, t.contact_id ORDER BY n DESC LIMIT 3`,
      )
      .bind(a.orgId, direction === 'in' ? 'receive' : 'spend', like)
      .all<any>();
    for (const h of hist.results) if (!out.some((o) => o.accountId === h.account_id)) out.push({ accountId: h.account_id, taxCodeId: h.tax_code_id, contactId: h.contact_id, reason: `Used ${h.n} time${h.n === 1 ? '' : 's'} before for "${words.join(' ')}"` });
  }
  return out.slice(0, 5);
}

export async function lineMap(db: D1Database, orgId: string, ids: string[]) {
  if (!ids.length) return new Map<string, any[]>();
  const rows = await db.prepare(`SELECT * FROM fin_transaction_lines WHERE org_id = ? AND transaction_id IN (${placeholders(ids.length)}) ORDER BY line_no`).bind(orgId, ...ids).all<any>();
  const m = new Map<string, any[]>();
  for (const l of rows.results) {
    const list = m.get(l.transaction_id) ?? [];
    list.push(l);
    m.set(l.transaction_id, list);
  }
  return m;
}

export function txDTO(a: FinAccess, r: any, lines: any[] = []) {
  return {
    id: r.id,
    kind: r.kind,
    accountId: r.account_id,
    toAccountId: r.to_account_id,
    date: r.date,
    contactId: r.contact_id,
    contactName: r.contact_name ?? null,
    payee: r.payee,
    reference: r.reference,
    description: r.description,
    taxMode: r.tax_mode,
    total: r.total,
    tax: lines.reduce((n, l) => n + l.tax, 0),
    status: r.status,
    journalId: r.journal_id,
    reconciled: !!r.reconciled,
    recurringId: r.recurring_id,
    notes: r.notes,
    personId: r.person_id,
    createdBy: r.created_by,
    createdByName: r.created_by_name ?? null,
    submittedAt: r.submitted_at,
    approvedBy: r.approved_by,
    approvedAt: r.approved_at,
    rejectedNote: r.rejected_note,
    voidedAt: r.voided_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    fileCount: r.file_count ?? 0,
    lines: lines.map((l) => ({ id: l.id, accountId: l.account_id, description: l.description, amount: r.tax_mode === 'inclusive' ? l.net + l.tax : l.net, net: l.net, tax: l.tax, taxCodeId: l.tax_code_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id })),
    can: { edit: canRecord(a, 'banking', 'edit', r) && r.status !== 'void' && (r.status !== 'posted' || a.perms.banking.approve), delete: canRecord(a, 'banking', 'delete', r) && (r.status === 'draft' || r.status === 'submitted'), approve: a.perms.banking.approve && (r.status === 'draft' || r.status === 'submitted'), void: a.perms.banking.approve && r.status === 'posted' && canRecord(a, 'banking', 'edit', r) },
  };
}

export const canApproveBanking = (a: FinAccess) => hasPerm(a, 'banking', 'approve');
