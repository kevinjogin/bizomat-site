// The numbers of the company control centre (GET /api/company/c/:company/overview): totals from each tool, for the
// whole company and for each department. Totals only, never records. Each figure comes from the tool's own tables:
//
//   Project Management  tasks on the workspace's shared boards (private boards and personal boards are left out):
//                       open, overdue, due in the next 7 days, completed in the last 30 days. For a department: the
//                       tasks assigned to its members.
//   CRM                 open deals and their value, deals won in the last 30 days and their value, open leads (not converted or archived), open
//                       follow-ups due by today. For a department: the deals, leads and follow-ups of its members.
//   Finance             income, expenses and net for the current financial year from posted journals (the profit and
//                       loss rule: revenue and expense accounts), money owed to the business (approved invoices not
//                       yet paid) and owed by it (approved bills). For a department: income, expenses and net on its
//                       Finance department (tracking) and those of the departments under it.

import { isItemDone } from '../../shared/filters';
import { assigneesOf, dueDateOf } from '../../shared/items';
import { addDays, fyStart, todayIn } from '../../shared/fin/dates';
import { columnDTO, type ColumnRow } from '../services/mappers';
import { parseJson, placeholders, now } from '../lib/util';

export interface TasksNumbers {
  open: number;
  overdue: number;
  dueSoon: number;
  completed30d: number;
  projects: number;
}

export async function tasksNumbers(db: D1Database, wsId: string, userIds: string[] | null, timezone = 'Australia/Sydney'): Promise<TasksNumbers> {
  const boards = (await db.prepare("SELECT id FROM boards WHERE workspace_id = ? AND kind = 'board' AND visibility = 'workspace' AND archived_at IS NULL").bind(wsId).all<{ id: string }>()).results.map((b) => b.id);
  const out: TasksNumbers = { open: 0, overdue: 0, dueSoon: 0, completed30d: 0, projects: boards.length };
  if (!boards.length || (userIds && !userIds.length)) return out;
  const cols = await db.prepare(`SELECT * FROM columns WHERE board_id IN (${placeholders(boards.length)}) AND type IN ('person','people','status','date','timeline')`).bind(...boards).all<ColumnRow>();
  const byBoard = new Map<string, ReturnType<typeof columnDTO>[]>();
  for (const col of cols.results.map(columnDTO)) byBoard.set(col.boardId, [...(byBoard.get(col.boardId) ?? []), col]);
  const today = todayIn(timezone);
  const soon = addDays(today, 7);
  const since = now() - 30 * 86_400_000;
  const items = await db
    .prepare(`SELECT board_id, values_json, completed_at FROM items WHERE workspace_id = ? AND archived_at IS NULL AND parent_item_id IS NULL AND board_id IN (${placeholders(boards.length)}) LIMIT 20000`)
    .bind(wsId, ...boards)
    .all<{ board_id: string; values_json: string; completed_at: number | null }>();
  const who = userIds ? new Set(userIds) : null;
  for (const r of items.results) {
    const bc = byBoard.get(r.board_id) ?? [];
    const values = parseJson<Record<string, unknown>>(r.values_json, {});
    if (who && !assigneesOf(values, bc).some((u) => who.has(u))) continue;
    const done = isItemDone({ values }, bc);
    if (done) {
      if (r.completed_at && r.completed_at >= since) out.completed30d++;
      continue;
    }
    out.open++;
    const due = dueDateOf(values, bc);
    if (due && due < today) out.overdue++;
    else if (due && due <= soon) out.dueSoon++;
  }
  return out;
}

export interface CrmNumbers {
  currency: string;
  openDeals: number;
  openValue: number;
  won30d: number;
  wonValue30d: number;
  openLeads: number;
  followUpsDue: number;
}

export async function crmNumbers(db: D1Database, orgId: string, ownerIds: string[] | null): Promise<CrmNumbers> {
  const org = await db.prepare('SELECT currency, timezone FROM crm_orgs WHERE id = ?').bind(orgId).first<{ currency: string; timezone: string }>();
  const out: CrmNumbers = { currency: org?.currency ?? 'AUD', openDeals: 0, openValue: 0, won30d: 0, wonValue30d: 0, openLeads: 0, followUpsDue: 0 };
  if (ownerIds && !ownerIds.length) return out;
  const own = (col: string) => (ownerIds ? ` AND ${col} IN (${placeholders(ownerIds.length)})` : '');
  const ids = ownerIds ?? [];
  const since = now() - 30 * 86_400_000;
  const today = todayIn(org?.timezone || 'UTC');
  const [deals, won, leads, acts] = await db.batch([
    db.prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(value), 0) AS v FROM crm_deals WHERE org_id = ? AND status = 'open' AND archived_at IS NULL AND deleted_at IS NULL${own('owner_id')}`).bind(orgId, ...ids),
    db.prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(value), 0) AS v FROM crm_deals WHERE org_id = ? AND status = 'won' AND won_at >= ? AND deleted_at IS NULL${own('owner_id')}`).bind(orgId, since, ...ids),
    db.prepare(`SELECT COUNT(*) AS n FROM crm_leads WHERE org_id = ? AND converted_at IS NULL AND archived_at IS NULL AND deleted_at IS NULL${own('owner_id')}`).bind(orgId, ...ids),
    db.prepare(`SELECT COUNT(*) AS n FROM crm_activities WHERE org_id = ? AND status = 'open' AND deleted_at IS NULL AND due_date IS NOT NULL AND due_date <= ?${own('assigned_to')}`).bind(orgId, today, ...ids),
  ]);
  const one = (r: D1Result) => (r.results[0] ?? {}) as { n?: number; v?: number };
  out.openDeals = one(deals).n ?? 0;
  out.openValue = one(deals).v ?? 0;
  out.won30d = one(won).n ?? 0;
  out.wonValue30d = one(won).v ?? 0;
  out.openLeads = one(leads).n ?? 0;
  out.followUpsDue = one(acts).n ?? 0;
  return out;
}

export interface FinanceNumbers {
  currency: string;
  /** The financial year so far: 'YYYY-MM-DD' to 'YYYY-MM-DD'. */
  from: string;
  to: string;
  income: number;
  expenses: number;
  net: number;
  /** Company-wide only (a department has no invoices of its own). */
  receivable?: number;
  payable?: number;
}

export async function financeNumbers(db: D1Database, orgId: string, departmentTrackingIds: string[] | null): Promise<FinanceNumbers> {
  const org = await db.prepare('SELECT currency, timezone, fy_start_month FROM fin_orgs WHERE id = ?').bind(orgId).first<{ currency: string; timezone: string; fy_start_month: number }>();
  const today = todayIn(org?.timezone || 'Australia/Sydney');
  const from = fyStart(today, org?.fy_start_month ?? 7);
  const dept = departmentTrackingIds ? ` AND l.department_id IN (${placeholders(departmentTrackingIds.length)})` : '';
  const pl = await db
    .prepare(
      `SELECT a.type, COALESCE(SUM(l.debit), 0) - COALESCE(SUM(l.credit), 0) AS bal
       FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id AND j.org_id = l.org_id JOIN fin_accounts a ON a.id = l.account_id AND a.org_id = l.org_id
       WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ? AND a.type IN ('revenue','expense')${dept} GROUP BY a.type`,
    )
    .bind(orgId, from, today, ...(departmentTrackingIds ?? []))
    .all<{ type: 'revenue' | 'expense'; bal: number }>();
  const income = -(pl.results.find((r) => r.type === 'revenue')?.bal ?? 0);
  const expenses = pl.results.find((r) => r.type === 'expense')?.bal ?? 0;
  const out: FinanceNumbers = { currency: org?.currency ?? 'AUD', from, to: today, income, expenses, net: income - expenses };
  if (!departmentTrackingIds) {
    const owed = await db
      .prepare(`SELECT kind, COALESCE(SUM(total - amount_paid), 0) AS due FROM fin_docs WHERE org_id = ? AND kind IN ('invoice','bill') AND status IN ('approved','part_paid') AND deleted_at IS NULL GROUP BY kind`)
      .bind(orgId)
      .all<{ kind: 'invoice' | 'bill'; due: number }>();
    out.receivable = owed.results.find((r) => r.kind === 'invoice')?.due ?? 0;
    out.payable = owed.results.find((r) => r.kind === 'bill')?.due ?? 0;
  }
  return out;
}
