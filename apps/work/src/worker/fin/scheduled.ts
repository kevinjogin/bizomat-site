// Finance work done by the app's 15-minute maintenance run (src/worker/index.ts, runMaintenance): recurring
// transactions, invoices and bills; reminders for invoices and bills due soon or overdue; budget warnings; the monthly
// summary; and reports generated on a schedule. Each notification has a key, so it is sent once however often this runs.
// Recurring records run every time; the alerts once an hour.

import type { Env } from '../env';
import { newId, now, parseJson } from '../lib/util';
import { addDays, addMonths, endOfMonth, monthOf, startOfMonth, todayIn } from '../../shared/fin/dates';
import { finSettings } from '../../shared/fin/settings';
import type { WorkspaceKind } from '../../shared/fin/roles';
import { type FinAccess, loadAccess, membersWithPerm } from './access';
import { runRecurringOnce } from './routes-plan';
import { REPORTS, type ReportKey, defaultParams, reportCsv, runReport, sums } from './reports';
import { reportPdf } from './pdf';
import { auditStmt, csvOf, finNotify } from './util';

const DAY = 86_400_000;

export async function runFinanceScheduled(env: Env, at: number, waitUntil?: (p: Promise<unknown>) => void) {
  const out = { recurring: 0, alerts: 0, reports: 0, errors: 0 };
  const db = env.DB;
  // Recurring records due today or earlier in their workspace's time zone (a day ahead of UTC at most).
  const due = await db
    .prepare('SELECT r.*, o.timezone FROM fin_recurring r JOIN fin_orgs o ON o.id = r.org_id WHERE r.active = 1 AND o.deleted_at IS NULL AND r.next_date <= ? ORDER BY r.next_date LIMIT 200')
    .bind(new Date(at + DAY).toISOString().slice(0, 10))
    .all<any>();
  for (const r0 of due.results) {
    let r = r0;
    for (let i = 0; i < 5 && r && r.active && r.next_date <= todayIn(r.timezone, at); i++) {
      try {
        await runRecurringOnce(env, r);
        out.recurring++;
      } catch (e) {
        out.errors++;
        const msg = e instanceof Error ? e.message : 'failed';
        await db.prepare('UPDATE fin_recurring SET active = 0, last_error = ?, updated_at = ? WHERE id = ?').bind(msg.slice(0, 300), now(), r.id).run();
        if (r.created_by) await finNotify(env, { orgId: r.org_id, orgName: '', userIds: [r.created_by], type: 'recurring', title: `Recurring "${r.name}" was paused`, body: msg, link: `/o/${r.org_id}/recurring`, dedupeKey: `recurring-error:${r.id}:${r.next_date}` }, waitUntil).catch(() => 0);
        break;
      }
      r = await db.prepare('SELECT r.*, o.timezone FROM fin_recurring r JOIN fin_orgs o ON o.id = r.org_id WHERE r.id = ?').bind(r.id).first<any>();
    }
  }
  // The alerts and scheduled reports, once an hour.
  if (new Date(at).getUTCMinutes() >= 15) return out;
  const orgs = await db.prepare('SELECT id, name, kind, timezone, settings_json, fy_start_month FROM fin_orgs WHERE deleted_at IS NULL ORDER BY id LIMIT 2000').all<{ id: string; name: string; kind: WorkspaceKind; timezone: string; settings_json: string; fy_start_month: number }>();
  for (const o of orgs.results) {
    try {
      out.alerts += await orgAlerts(env, o, at, waitUntil);
    } catch {
      out.errors++;
    }
  }
  const schedules = await db
    .prepare('SELECT s.*, o.timezone FROM fin_report_schedules s JOIN fin_orgs o ON o.id = s.org_id WHERE s.active = 1 AND o.deleted_at IS NULL AND s.next_date <= ? LIMIT 50')
    .bind(new Date(at + DAY).toISOString().slice(0, 10))
    .all<any>();
  for (const s of schedules.results) {
    if (s.next_date > todayIn(s.timezone, at)) continue;
    try {
      await runSchedule(env, s, at);
      out.reports++;
    } catch {
      out.errors++;
      await db.prepare('UPDATE fin_report_schedules SET active = 0 WHERE id = ?').bind(s.id).run();
    }
  }
  return out;
}

async function orgAlerts(env: Env, o: { id: string; name: string; kind: WorkspaceKind; timezone: string; settings_json: string }, at: number, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  const db = env.DB;
  const s = finSettings(parseJson(o.settings_json, {}), o.kind);
  const today = todayIn(o.timezone, at);
  const access = { orgId: o.id, org: { kind: o.kind } } as unknown as FinAccess;
  let sent = 0;
  const base = { orgId: o.id, orgName: o.name };
  if (o.kind === 'business') {
    const docs = await db
      .prepare("SELECT id, kind, number, due_date, total - amount_paid AS due, created_by FROM fin_docs WHERE org_id = ? AND deleted_at IS NULL AND status IN ('approved','part_paid') AND kind IN ('invoice','bill','expense_claim') AND due_date IS NOT NULL AND due_date <= ? LIMIT 500")
      .bind(o.id, addDays(today, Math.max(s.alerts.invoiceDueDays, s.alerts.billDueDays)))
      .all<any>();
    const week = Math.floor(at / (7 * DAY));
    const sales = docs.results.some((d) => d.kind === 'invoice') ? await membersWithPerm(db, access, 'sales', 'approve') : [];
    const purchases = docs.results.some((d) => d.kind !== 'invoice') ? await membersWithPerm(db, access, 'purchases', 'approve') : [];
    for (const d of docs.results) {
      const invoice = d.kind === 'invoice';
      const overdue = d.due_date < today;
      const soonDays = invoice ? s.alerts.invoiceDueDays : s.alerts.billDueDays;
      const wantOverdue = invoice ? s.alerts.overdueInvoices : s.alerts.overdueBills;
      if (overdue ? !wantOverdue : !soonDays || d.due_date > addDays(today, soonDays)) continue;
      const what = invoice ? `Invoice ${d.number}` : `${d.kind === 'bill' ? 'Bill' : 'Expense claim'} ${d.number}`;
      sent += await finNotify(env, {
        ...base,
        userIds: [...(invoice ? sales : purchases), d.created_by].filter(Boolean),
        type: invoice ? 'invoice_due' : 'bill_due',
        title: overdue ? `${what} is overdue` : `${what} is due on ${d.due_date}`,
        body: `${(d.due / 100).toFixed(2)} ${invoice ? 'still to be received' : 'still to be paid'}.${invoice ? ' Remind the customer from your own email.' : ''}`,
        link: `/o/${o.id}/${invoice ? 'invoices' : d.kind === 'bill' ? 'bills' : 'expense-claims'}/${d.id}`,
        dedupeKey: overdue ? `overdue:${d.id}:${week}` : `due:${d.id}:${d.due_date}`,
      }, waitUntil);
    }
  }
  if (s.alerts.budgets) {
    const month = monthOf(today);
    const budgets = await db.prepare('SELECT * FROM fin_budgets WHERE org_id = ? AND archived_at IS NULL AND start_month <= ?').bind(o.id, month).all<any>();
    for (const b of budgets.results) {
      if (monthOf(addMonths(`${b.start_month}-01`, b.months - 1)) < month) continue;
      const lines = await db.prepare("SELECT bl.account_id, bl.amount, ac.name FROM fin_budget_lines bl JOIN fin_accounts ac ON ac.id = bl.account_id WHERE bl.budget_id = ? AND bl.org_id = ? AND bl.month = ? AND ac.type = 'expense' AND bl.amount > 0").bind(b.id, o.id, month).all<any>();
      if (!lines.results.length) continue;
      const actual = await sums(db, o.id, `${month}-01`, today, { department: b.department_id ?? undefined, project: b.project_id ?? undefined, costCentre: b.cost_centre_id ?? undefined });
      const managers = await membersWithPerm(db, access, 'budgets', 'manage');
      for (const l of lines.results) {
        const spent = actual.get(l.account_id) ?? 0;
        const pct = Math.round((spent / l.amount) * 100);
        if (pct < b.alert_pct) continue;
        sent += await finNotify(env, { ...base, userIds: managers, type: 'budget', title: `${l.name}: ${pct}% of this month's budget spent`, body: `${(spent / 100).toFixed(2)} of ${(l.amount / 100).toFixed(2)} in "${b.name}".`, link: `/o/${o.id}/budgets/${b.id}`, dedupeKey: `budget:${b.id}:${l.account_id}:${month}:${pct >= 100 ? 'over' : 'near'}` }, waitUntil);
      }
    }
  }
  if (s.alerts.monthlySummary && Number(today.slice(8)) <= 3) {
    const last = addMonths(startOfMonth(today), -1);
    const from = last;
    const to = endOfMonth(last);
    const rows = await db
      .prepare("SELECT ac.type, SUM(l.debit) - SUM(l.credit) AS v FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id JOIN fin_accounts ac ON ac.id = l.account_id WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ? AND ac.type IN ('revenue','expense') GROUP BY ac.type")
      .bind(o.id, from, to)
      .all<{ type: string; v: number }>();
    const income = -(rows.results.find((r) => r.type === 'revenue')?.v ?? 0);
    const expenses = rows.results.find((r) => r.type === 'expense')?.v ?? 0;
    if (income || expenses) {
      const readers = await membersWithPerm(db, access, 'reports', 'view');
      const monthName = new Date(`${last}T00:00:00Z`).toLocaleDateString('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      sent += await finNotify(env, { ...base, userIds: readers, type: 'summary', title: `${o.name}: ${monthName} in summary`, body: `Income ${(income / 100).toFixed(2)}, expenses ${(expenses / 100).toFixed(2)}, ${income - expenses >= 0 ? 'surplus' : 'shortfall'} ${(Math.abs(income - expenses) / 100).toFixed(2)}.`, link: `/o/${o.id}/reports/income_expenses`, dedupeKey: `summary:${o.id}:${monthOf(last)}` }, waitUntil);
    }
  }
  return sent;
}

async function runSchedule(env: Env, s: any, at: number) {
  const db = env.DB;
  const user = s.created_by ? await db.prepare('SELECT id, name FROM users WHERE id = ? AND disabled_at IS NULL').bind(s.created_by).first<{ id: string; name: string }>() : null;
  if (!user) throw new Error('creator gone');
  const a = await loadAccess(db, s.org_id, user);
  if (!a.perms.reports.export) throw new Error('no longer allowed');
  const today = todayIn(a.org.timezone, at);
  const key = s.report_key as ReportKey;
  // The period just finished: last month or last quarter (balance-style reports as at its last day).
  const end = addDays(startOfMonth(today), -1);
  const start = s.frequency === 'quarterly' ? addMonths(startOfMonth(end), -2) : startOfMonth(end);
  const params = { ...defaultParams(a, key, today), from: start, to: end, date: end };
  const report = await runReport(db, a, key, params, today);
  const bytes = s.format === 'csv' ? new TextEncoder().encode(csvOf(reportCsv(report))) : await reportPdf(report, { name: a.org.name, currency: a.org.currency });
  const fid = newId();
  const name = `${REPORTS[key]} ${start} to ${end}.${s.format}`;
  await env.FILES.put(`fin/${a.orgId}/files/${fid}`, bytes, { httpMetadata: { contentType: s.format === 'csv' ? 'text/csv' : 'application/pdf' } });
  const next = s.frequency === 'quarterly' ? addMonths(s.next_date, 3) : addMonths(s.next_date, 1);
  await db.batch([
    db.prepare("INSERT INTO fin_files (id, org_id, parent_type, folder, name, mime, size, r2_key, search, uploaded_by, created_at) VALUES (?, ?, 'none', 'Reports', ?, ?, ?, ?, ?, ?, ?)").bind(fid, a.orgId, name, s.format === 'csv' ? 'text/csv' : 'application/pdf', bytes.length, `fin/${a.orgId}/files/${fid}`, name.toLowerCase(), user.id, now()),
    db.prepare('UPDATE fin_report_schedules SET next_date = ?, last_run_at = ? WHERE id = ?').bind(next, now(), s.id),
    auditStmt(db, { orgId: a.orgId, actorId: user.id, action: 'report.generated', targetType: 'report', targetId: key, metadata: { file: fid, from: start, to: end } }),
  ]);
  await finNotify(env, { orgId: a.orgId, orgName: a.org.name, userIds: [user.id], type: 'report', title: `${REPORTS[key]} for ${start} to ${end} is ready`, body: 'It is in Documents, in the Reports folder.', link: `/o/${a.orgId}/documents?folder=Reports`, dedupeKey: `report:${s.id}:${s.next_date}` });
}

/** Housekeeping: read notifications after 180 days. */
export function financeHousekeeping(db: D1Database, wall: number): D1PreparedStatement[] {
  return [db.prepare('DELETE FROM fin_notifications WHERE read_at IS NOT NULL AND read_at < ?').bind(wall - 180 * DAY)];
}
