// Transactions: list, search and filters, create, change, submit, approve, reject, void, delete, bulk changes,
// duplicates, category suggestions, reconciled marks, history and CSV export.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, now, placeholders } from '../lib/util';
import { type FinAccess, assertRecord, canRecord, deny, requireOrg, requirePerm, scopeSql } from './access';
import { chartOf } from './ledger';
import { type TxInput, approveTransaction, createTransaction, findDuplicates, lineMap, loadTransaction, suggest, txDTO, updateTransaction, voidTransaction } from './transactions';
import { auditStmt, csvOf, finNotify, runBatch } from './util';

export const moneyRoutes = new Hono<AppEnv>();

const text = (max: number) => z.string().trim().max(max);
const id = () => z.string().max(64);
const isoDate = () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date as YYYY-MM-DD');

export const lineInput = z.object({
  accountId: id(),
  description: text(300).optional(),
  amount: z.number().int().min(-1_000_000_000_000).max(1_000_000_000_000),
  taxCodeId: id().nullable().optional(),
  departmentId: id().nullable().optional(),
  projectId: id().nullable().optional(),
  costCentreId: id().nullable().optional(),
});

const txInput = z.object({
  kind: z.enum(['receive', 'spend', 'transfer']),
  accountId: id(),
  toAccountId: id().nullable().optional(),
  date: isoDate(),
  contactId: id().nullable().optional(),
  payee: text(200).optional(),
  reference: text(100).optional(),
  description: text(500).optional(),
  taxMode: z.enum(['inclusive', 'exclusive', 'none']).optional(),
  notes: text(4000).optional(),
  personId: id().nullable().optional(),
  amount: z.number().int().min(1).max(1_000_000_000_000).optional(),
  lines: z.array(lineInput).max(100).optional(),
  action: z.enum(['draft', 'submit', 'post']).optional(),
});

interface ListParams {
  account?: string;
  from?: string;
  to?: string;
  q?: string;
  status?: string;
  kind?: string;
  category?: string;
  contact?: string;
  person?: string;
  reconciled?: string;
  min?: number;
  max?: number;
}

function listWhere(a: FinAccess, p: ListParams) {
  const scope = scopeSql(a, 'banking', 't');
  const where = ['t.org_id = ?', 't.deleted_at IS NULL', scope.sql];
  const args: unknown[] = [a.orgId, ...scope.args];
  if (p.account) {
    where.push('(t.account_id = ? OR t.to_account_id = ?)');
    args.push(p.account, p.account);
  }
  if (p.from) {
    where.push('t.date >= ?');
    args.push(p.from);
  }
  if (p.to) {
    where.push('t.date <= ?');
    args.push(p.to);
  }
  if (p.q) {
    where.push('t.search LIKE ?');
    args.push(`%${p.q.toLowerCase().replace(/[%_]/g, '')}%`);
  }
  if (p.status && ['draft', 'submitted', 'posted', 'void'].includes(p.status)) {
    where.push('t.status = ?');
    args.push(p.status);
  }
  if (p.kind && ['receive', 'spend', 'transfer'].includes(p.kind)) {
    where.push('t.kind = ?');
    args.push(p.kind);
  }
  if (p.category) {
    where.push('EXISTS (SELECT 1 FROM fin_transaction_lines l JOIN fin_accounts ac ON ac.id = l.account_id WHERE l.transaction_id = t.id AND (l.account_id = ? OR ac.parent_id = ?))');
    args.push(p.category, p.category);
  }
  if (p.contact) {
    where.push('t.contact_id = ?');
    args.push(p.contact);
  }
  if (p.person) {
    where.push('(t.person_id = ? OR (t.person_id IS NULL AND t.created_by = ?))');
    args.push(p.person, p.person);
  }
  if (p.reconciled === '1' || p.reconciled === '0') {
    where.push('t.reconciled = ?');
    args.push(Number(p.reconciled));
  }
  if (Number.isFinite(p.min)) {
    where.push('t.total >= ?');
    args.push(p.min);
  }
  if (Number.isFinite(p.max)) {
    where.push('t.total <= ?');
    args.push(p.max);
  }
  return { where: where.join(' AND '), args };
}

moneyRoutes.get('/orgs/:org/transactions', async (c) => {
  const a = await requireOrg(c);
  if (a.perms.banking.view === 'none') deny('You cannot see transactions');
  const qp = c.req.query();
  const p: ListParams = { ...qp, min: qp.min ? Number(qp.min) : undefined, max: qp.max ? Number(qp.max) : undefined };
  const { where, args } = listWhere(a, p);
  const csv = qp.format === 'csv';
  const pageSize = csv ? 10_000 : Math.min(Math.max(Number(qp.pageSize) || 50, 1), 200);
  const page = Math.max(Number(qp.page) || 1, 1);
  const [count, rows] = await Promise.all([
    c.env.DB.prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(CASE WHEN t.kind = 'receive' AND t.status = 'posted' THEN t.total END), 0) AS money_in, COALESCE(SUM(CASE WHEN t.kind = 'spend' AND t.status = 'posted' THEN t.total END), 0) AS money_out FROM fin_transactions t WHERE ${where}`).bind(...args).first<{ n: number; money_in: number; money_out: number }>(),
    c.env.DB.prepare(
      `SELECT t.*, ct.name AS contact_name, u.name AS created_by_name, (SELECT COUNT(*) FROM fin_files f WHERE f.org_id = t.org_id AND f.parent_type = 'transaction' AND f.parent_id = t.id AND f.deleted_at IS NULL) AS file_count
       FROM fin_transactions t LEFT JOIN fin_contacts ct ON ct.id = t.contact_id LEFT JOIN users u ON u.id = t.created_by
       WHERE ${where} ORDER BY t.date DESC, t.created_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(...args, pageSize, (page - 1) * pageSize)
      .all<any>(),
  ]);
  const lines = await lineMap(c.env.DB, a.orgId, rows.results.map((r) => r.id));
  if (csv) {
    requirePerm(a, 'banking', 'export', 'You cannot export transactions');
    const chart = await chartOf(c.env.DB, a);
    const name = (accountId: string | null) => (accountId ? (chart.accounts.get(accountId)?.name ?? '') : '');
    const out: unknown[][] = [['Date', 'Type', 'Account', 'Payee or contact', 'Description', 'Reference', 'Category', 'Net', 'GST', 'Total', 'Status', 'Reconciled']];
    for (const r of rows.results) {
      const ls = lines.get(r.id) ?? [];
      const sign = r.kind === 'spend' ? -1 : 1;
      if (r.kind === 'transfer') out.push([r.date, 'Transfer', name(r.account_id), '', r.description, r.reference, `To ${name(r.to_account_id)}`, (r.total / 100).toFixed(2), '0.00', (r.total / 100).toFixed(2), r.status, r.reconciled ? 'Yes' : 'No']);
      for (const l of ls) out.push([r.date, r.kind === 'receive' ? 'Money in' : 'Money out', name(r.account_id), r.contact_name ?? r.payee, l.description || r.description, r.reference, name(l.account_id), ((sign * l.net) / 100).toFixed(2), ((sign * l.tax) / 100).toFixed(2), ((sign * (l.net + l.tax)) / 100).toFixed(2), r.status, r.reconciled ? 'Yes' : 'No']);
    }
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'transactions.exported', targetType: 'transaction', metadata: { rows: rows.results.length } }).run();
    return new Response(csvOf(out), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="transactions.csv"' } });
  }
  return c.json({ rows: rows.results.map((r) => txDTO(a, r, lines.get(r.id) ?? [])), total: count?.n ?? 0, page, pageSize, moneyIn: count?.money_in ?? 0, moneyOut: count?.money_out ?? 0 });
});

moneyRoutes.post('/orgs/:org/transactions', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, txInput);
  const r = await createTransaction(c.env, a, input as TxInput, [], (p) => c.executionCtx.waitUntil(p));
  return c.json(r, 201);
});

moneyRoutes.post('/orgs/:org/transactions/duplicates', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, z.object({ accountId: id(), date: isoDate(), total: z.number().int(), kind: z.enum(['receive', 'spend', 'transfer']), excludeId: id().optional() }));
  return c.json(await findDuplicates(c.env.DB, a, input));
});

moneyRoutes.get('/orgs/:org/suggest', async (c) => {
  const a = await requireOrg(c);
  const direction = c.req.query('direction') === 'in' ? 'in' : 'out';
  return c.json(await suggest(c.env.DB, a, (c.req.query('text') ?? '').slice(0, 300), direction));
});

moneyRoutes.post('/orgs/:org/transactions/bulk', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, z.object({ ids: z.array(id()).min(1).max(200), action: z.enum(['post', 'delete', 'void', 'categorise', 'contact', 'reconcile', 'unreconcile']), accountId: id().optional(), contactId: id().nullable().optional() }));
  const rows = await c.env.DB.prepare(`SELECT * FROM fin_transactions WHERE org_id = ? AND deleted_at IS NULL AND id IN (${placeholders(input.ids.length)})`).bind(a.orgId, ...input.ids).all<any>();
  let done = 0;
  const errors: { id: string; message: string }[] = [];
  for (const r of rows.results) {
    try {
      if (!canRecord(a, 'banking', 'view', r)) continue;
      if (input.action === 'post') await approveTransaction(c.env, a, r);
      else if (input.action === 'void') await voidTransaction(c.env, a, r);
      else if (input.action === 'delete') {
        assertRecord(a, 'banking', 'delete', r, 'Transaction');
        if (r.status === 'posted' || r.status === 'void') throw new HttpError(409, 'Posted transactions are voided, not deleted');
        await c.env.DB.batch([c.env.DB.prepare('UPDATE fin_transactions SET deleted_at = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(now(), now(), r.id, a.orgId), auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'transaction.deleted', targetType: 'transaction', targetId: r.id })]);
      } else if (input.action === 'categorise') {
        if (!input.accountId) throw new HttpError(400, 'Choose a category');
        if (r.kind === 'transfer') throw new HttpError(400, 'Transfers have no category');
        const lines = (await lineMap(c.env.DB, a.orgId, [r.id])).get(r.id) ?? [];
        if (lines.length !== 1) throw new HttpError(400, 'Split transactions are changed one at a time');
        const l = lines[0];
        await updateTransaction(c.env, a, r, { lines: [{ accountId: input.accountId, description: l.description, amount: r.tax_mode === 'inclusive' ? l.net + l.tax : l.net, taxCodeId: l.tax_code_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id }] });
      } else if (input.action === 'contact') await updateTransaction(c.env, a, r, { contactId: input.contactId ?? null });
      else {
        if (!a.perms.banking.approve) deny('You cannot reconcile transactions');
        if (r.status !== 'posted') throw new HttpError(409, 'Only posted transactions are reconciled');
        await c.env.DB.prepare('UPDATE fin_transactions SET reconciled = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(input.action === 'reconcile' ? 1 : 0, now(), r.id, a.orgId).run();
      }
      done++;
    } catch (e) {
      errors.push({ id: r.id, message: e instanceof Error ? e.message : 'Failed' });
    }
  }
  return c.json({ done, errors });
});

moneyRoutes.get('/orgs/:org/transactions/:id', async (c) => {
  const a = await requireOrg(c);
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  const extra = await c.env.DB.prepare('SELECT ct.name AS contact_name, u.name AS created_by_name FROM fin_transactions t LEFT JOIN fin_contacts ct ON ct.id = t.contact_id LEFT JOIN users u ON u.id = t.created_by WHERE t.id = ?').bind(r.id).first<any>();
  const lines = (await lineMap(c.env.DB, a.orgId, [r.id])).get(r.id) ?? [];
  return c.json(txDTO(a, { ...r, ...extra }, lines));
});

moneyRoutes.patch('/orgs/:org/transactions/:id', async (c) => {
  const a = await requireOrg(c);
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  const input = await body(c, txInput.partial());
  return c.json(await updateTransaction(c.env, a, r, input as Partial<TxInput>, (p) => c.executionCtx.waitUntil(p)));
});

moneyRoutes.post('/orgs/:org/transactions/:id/submit', async (c) => {
  const a = await requireOrg(c);
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  if (r.status !== 'draft') throw new HttpError(409, 'Only a draft is submitted');
  return c.json(await updateTransaction(c.env, a, r, { action: 'submit' }, (p) => c.executionCtx.waitUntil(p)));
});

moneyRoutes.post('/orgs/:org/transactions/:id/approve', async (c) => {
  const a = await requireOrg(c);
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  return c.json(await approveTransaction(c.env, a, r, (p) => c.executionCtx.waitUntil(p)));
});

moneyRoutes.post('/orgs/:org/transactions/:id/reject', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.banking.approve) deny('You cannot approve transactions');
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  if (r.status !== 'submitted') throw new HttpError(409, 'Only a submitted transaction is returned');
  const { note } = await body(c, z.object({ note: text(500).min(1, 'Say why it is returned') }));
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE fin_transactions SET status = 'draft', rejected_note = ?, submitted_at = NULL, updated_at = ? WHERE id = ? AND org_id = ?").bind(note, now(), r.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'transaction.returned', targetType: 'transaction', targetId: r.id, after: { note } }),
  ]);
  if (r.created_by) await finNotify(c.env, { orgId: a.orgId, orgName: a.org.name, userIds: [r.created_by], type: 'approved', title: `${a.userName} returned your transaction`, body: note, link: `/o/${a.orgId}/transactions/${r.id}`, actorId: a.userId }, (p) => c.executionCtx.waitUntil(p));
  return c.json({ ok: true });
});

moneyRoutes.post('/orgs/:org/transactions/:id/void', async (c) => {
  const a = await requireOrg(c);
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  const { date } = await body(c, z.object({ date: isoDate().nullable().optional() }));
  await voidTransaction(c.env, a, r, date);
  return c.json({ ok: true });
});

moneyRoutes.delete('/orgs/:org/transactions/:id', async (c) => {
  const a = await requireOrg(c);
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  assertRecord(a, 'banking', 'delete', r, 'Transaction');
  if (r.status === 'posted' || r.status === 'void') throw new HttpError(409, 'Posted transactions are voided, not deleted');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_transactions SET deleted_at = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(now(), now(), r.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'transaction.deleted', targetType: 'transaction', targetId: r.id }),
  ]);
  return c.json({ ok: true });
});

moneyRoutes.post('/orgs/:org/transactions/:id/reconciled', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.banking.approve) deny('You cannot reconcile transactions');
  const r = await loadTransaction(c.env.DB, a, c.req.param('id'));
  if (r.status !== 'posted') throw new HttpError(409, 'Only posted transactions are reconciled');
  const { reconciled } = await body(c, z.object({ reconciled: z.boolean() }));
  await runBatch(c.env.DB, [
    c.env.DB.prepare('UPDATE fin_transactions SET reconciled = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(reconciled ? 1 : 0, now(), r.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: reconciled ? 'transaction.reconciled' : 'transaction.unreconciled', targetType: 'transaction', targetId: r.id }),
  ]);
  return c.json({ ok: true });
});

/** The record's history: who created, changed, approved, voided it (from the audit trail). */
moneyRoutes.get('/orgs/:org/history/:type/:id', async (c) => {
  const a = await requireOrg(c);
  const type = c.req.param('type');
  const targetId = c.req.param('id');
  if (type === 'transaction') await loadTransaction(c.env.DB, a, targetId);
  else if (type === 'doc') {
    const d = await c.env.DB.prepare('SELECT kind, created_by, claimant_id FROM fin_docs WHERE id = ? AND org_id = ?').bind(targetId, a.orgId).first<any>();
    if (!d) throw new HttpError(404, 'Record not found');
    assertRecord(a, d.kind === 'invoice' ? 'sales' : 'purchases', 'view', d);
  } else throw new HttpError(404, 'Record not found');
  const rows = await c.env.DB.prepare('SELECT l.action, l.created_at, l.after_json, u.name AS actor FROM fin_audit_log l LEFT JOIN users u ON u.id = l.actor_id WHERE l.org_id = ? AND l.target_id = ? ORDER BY l.created_at DESC LIMIT 100').bind(a.orgId, targetId).all<any>();
  return c.json(rows.results.map((r) => ({ action: r.action, actor: r.actor, at: r.created_at })));
});
