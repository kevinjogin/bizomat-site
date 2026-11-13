// The Finance dashboard: the period's income, spending and result, cash and debts, what is owed both ways, budget
// progress, what falls due soon, recent transactions, approvals, statement lines to match, savings goals and twelve
// months of trend. Every figure comes from the server (GET /dashboard), computed from posted ledger entries, and
// links to the screen or report it comes from. People whose role has no reports see their own records only.
import { Link, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { DonutChart } from '../components/charts/Charts';
import { PERIODS, type PeriodKey } from '../../shared/fin/dates';
import { DOC_LABELS, type DocKind } from '../../shared/fin/settings';
import { accountLabel, fin, shortDate, useAccounts, useCurrentOrg, useMoney } from './lib';
import { Money, Stat, StatusBadge } from './ui';
import { GroupedBars, SignedLine, seriesColor } from './finCharts';

interface TxLite {
  id: string;
  kind: 'receive' | 'spend' | 'transfer';
  accountId: string;
  toAccountId: string | null;
  date: string;
  payee: string;
  description: string;
  contactName: string | null;
  total: number;
  status: string;
  lines: { accountId: string }[];
}

interface Owed {
  count: number;
  amount: number;
  overdueCount: number;
  overdueAmount: number;
}

interface DashLimited {
  limited: true;
  period: { key: PeriodKey; from: string; to: string };
  recent: TxLite[];
  approvals: { transactions: number; documents: number };
}

interface DashFull {
  limited: false;
  period: { key: PeriodKey; from: string; to: string };
  income: number;
  expenses: number;
  net: number;
  cash: number;
  debt: number;
  moneyAccounts: { id: string; name: string; subtype: string; balance: number }[];
  receivables: Owed | null;
  payables: Owed | null;
  budget: { id: string; name: string; monthBudget: number; monthActual: number; yearBudget: number; yearActual: number } | null;
  upcoming: { kind: string; id: string; title: string; date: string; amount: number; direction: 'in' | 'out'; overdue: boolean }[];
  recent: TxLite[];
  approvals: { transactions: number; documents: number };
  unmatched: number;
  goals: { id: string; name: string; targetAmount: number; saved: number; progressPct: number }[];
  trend: { month: string; label: string; income: number; expenses: number; cash: number }[];
  spending: { label: string; value: number }[];
}

const PERIOD_KEYS = Object.keys(PERIODS) as PeriodKey[];

/** Where documents waiting for approval are listed: bills when the person approves purchases, else invoices. */
function approvalsPath(perms: { purchases: { approve: boolean } }, base: string) {
  return perms.purchases.approve ? `${base}/bills?status=awaiting` : `${base}/invoices?status=awaiting`;
}

export function Dashboard() {
  const org = useCurrentOrg();
  const [params, setParams] = useSearchParams();
  const chosen = params.get('period');
  const periodKey = chosen && chosen in PERIODS ? (chosen as PeriodKey) : null;
  usePageTitle('Dashboard');
  const q = useQuery({
    queryKey: ['fin', org.id, 'dashboard', periodKey ?? 'default'],
    queryFn: () => get<DashLimited | DashFull>(`${fin(org.id, '/dashboard')}${periodKey ? `?period=${periodKey}` : ''}`),
    placeholderData: keepPreviousData,
  });
  const d = q.data;
  const current = d?.period.key ?? periodKey ?? (org.kind === 'business' ? 'this_fy' : 'this_month');
  const picker = (
    <div className="row">
      {q.isFetching ? <Spinner /> : null}
      {d && !d.limited ? (
        <select className="select" aria-label="Period" value={current} onChange={(e) => setParams({ period: e.target.value }, { replace: true })}>
          {PERIOD_KEYS.map((k) => (
            <option key={k} value={k}>
              {PERIODS[k]}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
  return (
    <div className="page crm-page crm-dashboard">
      <PageHeader title="Dashboard" icon="home" subtitle={d && !d.limited ? `${org.name}: ${PERIODS[current]}, ${shortDate(d.period.from)} to ${shortDate(d.period.to)}` : org.name} actions={picker} />
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!d ? <Loading /> : d.limited ? <Limited d={d} /> : <Full d={d} />}
    </div>
  );
}

// ------------------------------------------------------------------ limited view

function Limited({ d }: { d: DashLimited }) {
  const org = useCurrentOrg();
  const base = `/o/${org.id}`;
  const waiting = d.approvals.transactions + d.approvals.documents;
  return (
    <>
      <p className="muted small fin-hint">Your role shows your own records here. Reports and totals for the whole workspace are not part of it.</p>
      {waiting ? (
        <div className="crm-stats">
          {d.approvals.transactions ? <Stat label="Transactions to approve" value={String(d.approvals.transactions)} to={`${base}/transactions?status=submitted`} tone="danger" /> : null}
          {d.approvals.documents ? <Stat label="Invoices, bills and claims to approve" value={String(d.approvals.documents)} to={approvalsPath(org.perms, base)} tone="danger" /> : null}
        </div>
      ) : null}
      <div className="crm-dash-grid">
        <section className="card card-pad crm-span-2">
          <RecentList recent={d.recent} />
        </section>
        <section className="card card-pad">
          <h2 className="crm-subhead">Get started</h2>
          <ul className="crm-mini-list">
            {org.perms.banking.create ? (
              <li><Icon name="plus" size={14} /><Link to={`${base}/transactions`}>Record a transaction</Link></li>
            ) : null}
            {org.kind === 'business' && org.perms.purchases.create ? (
              <li><Icon name="dollar" size={14} /><Link to={`${base}/expense-claims`}>Claim an expense</Link></li>
            ) : null}
            {org.perms.documents.create ? (
              <li><Icon name="upload" size={14} /><Link to={`${base}/documents`}>Upload a receipt</Link></li>
            ) : null}
            <li><Icon name="users" size={14} /><Link to={`${base}/team`}>See who is in this workspace</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ full view

function Full({ d }: { d: DashFull }) {
  const org = useCurrentOrg();
  const { fmt, currency } = useMoney();
  const base = `/o/${org.id}`;
  const business = org.kind === 'business';
  const range = `from=${d.period.from}&to=${d.period.to}`;
  const pl = `${base}/reports/profit_loss?${range}`;
  const major = (minor: number) => (currency === 'JPY' ? minor : minor / 100);
  const fmtMajor = (v: number) => fmt(currency === 'JPY' ? v : Math.round(v * 100));
  const hasDebt = d.moneyAccounts.some((m) => m.subtype === 'credit_card' || m.subtype === 'loan');
  const trendHasData = d.trend.some((t) => t.income || t.expenses);
  const spending = d.spending.map((s, i) => ({ key: s.label, label: s.label, value: major(s.value), color: seriesColor(i) }));
  return (
    <>
      <div className="crm-stats">
        <Stat label="Income" value={fmt(d.income)} hint={business ? 'Sales and other income' : 'Money earned'} to={pl} />
        <Stat label={business ? 'Expenses' : 'Spending'} value={fmt(d.expenses)} hint={business ? 'Costs and operating expenses' : 'Everything spent'} to={pl} />
        <Stat
          label={business ? (d.net < 0 ? 'Net loss' : 'Net profit') : d.net < 0 ? 'Overspent' : 'Left over'}
          value={fmt(Math.abs(d.net))}
          tone={d.net < 0 ? 'danger' : d.net > 0 ? 'success' : undefined}
          hint={business ? 'Income less expenses' : 'Income less spending'}
          to={pl}
        />
        <Stat label={business ? 'Cash in bank' : 'Money in the bank'} value={fmt(d.cash)} tone={d.cash < 0 ? 'danger' : undefined} hint="Bank and cash accounts today" to={`${base}/banking`} />
        {hasDebt || d.debt ? <Stat label="Cards and loans owing" value={fmt(d.debt)} hint="Credit cards and loans today" to={`${base}/banking`} /> : null}
        {d.receivables ? (
          <Stat
            label="Owed to you"
            value={fmt(d.receivables.amount)}
            tone={d.receivables.overdueAmount ? 'danger' : undefined}
            hint={d.receivables.overdueCount ? `${d.receivables.overdueCount} overdue: ${fmt(d.receivables.overdueAmount)}` : `${d.receivables.count} open invoices`}
            to={`${base}/invoices`}
          />
        ) : null}
        {d.payables ? (
          <Stat
            label="You owe"
            value={fmt(d.payables.amount)}
            tone={d.payables.overdueAmount ? 'danger' : undefined}
            hint={d.payables.overdueCount ? `${d.payables.overdueCount} overdue: ${fmt(d.payables.overdueAmount)}` : `${d.payables.count} open bills and claims`}
            to={`${base}/bills`}
          />
        ) : null}
        {d.approvals.transactions ? <Stat label="Transactions to approve" value={String(d.approvals.transactions)} tone="danger" to={`${base}/transactions?status=submitted`} /> : null}
        {d.approvals.documents ? <Stat label="Documents to approve" value={String(d.approvals.documents)} tone="danger" hint="Invoices, bills, orders and claims" to={approvalsPath(org.perms, base)} /> : null}
        {d.unmatched ? <Stat label="Statement lines to match" value={String(d.unmatched)} hint="Imported from your bank statements" to={`${base}/banking`} /> : null}
      </div>
      <div className="crm-dash-grid">
        <section className="card card-pad crm-span-2">
          <div className="row">
            <h2 className="crm-subhead grow">{business ? 'Income and expenses' : 'Income and spending'} <span className="muted small">(last 12 months, {currency})</span></h2>
            <Link to={`${base}/reports/income_expenses`} className="small">Report</Link>
          </div>
          {trendHasData ? (
            <GroupedBars
              groups={d.trend.map((t) => ({ key: t.month, label: t.label, values: [major(t.income), major(t.expenses)] }))}
              series={[{ label: 'Income', color: seriesColor(0) }, { label: business ? 'Expenses' : 'Spending', color: seriesColor(1) }]}
              format={fmtMajor}
              height={210}
            />
          ) : (
            <p className="muted">Nothing posted in the last twelve months yet. Record transactions or import a bank statement to see the trend.</p>
          )}
        </section>
        <section className="card card-pad">
          <div className="row">
            <h2 className="crm-subhead grow">{business ? 'Expenses by category' : 'Spending by category'}</h2>
            <Link to={pl} className="small">Report</Link>
          </div>
          {spending.length ? <DonutChart data={spending} centerLabel={currency} /> : <p className="muted">No {business ? 'expenses' : 'spending'} in the period.</p>}
        </section>
        <section className="card card-pad">
          <div className="row">
            <h2 className="crm-subhead grow">Cash at the end of each month</h2>
            <Link to={`${base}/reports/cash_flow`} className="small">Cash flow</Link>
          </div>
          {trendHasData || d.cash ? <SignedLine data={d.trend.map((t) => ({ key: t.month, label: t.label, value: major(t.cash) }))} format={fmtMajor} /> : <p className="muted">No bank or cash balances yet.</p>}
        </section>
        <section className="card card-pad">
          <div className="row">
            <h2 className="crm-subhead grow">Accounts</h2>
            <Link to={`${base}/reports/balance_sheet`} className="small">{business ? 'Balance sheet' : 'Net worth'}</Link>
            <Link to={`${base}/banking`} className="small">All</Link>
          </div>
          {d.moneyAccounts.length ? (
            <ul className="crm-mini-list">
              {d.moneyAccounts.map((m) => (
                <li key={m.id}>
                  <Icon name={m.subtype === 'credit_card' ? 'dollar' : m.subtype === 'loan' ? 'flag' : 'building'} size={14} />
                  <Link to={`${base}/banking/${m.id}`} className="grow ellipsis">{m.name}</Link>
                  <Money value={m.subtype === 'credit_card' || m.subtype === 'loan' ? -m.balance || 0 : m.balance} tone />
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No bank accounts yet.</p>
          )}
        </section>
        <BudgetCard d={d} />
        <section className="card card-pad">
          <div className="row">
            <h2 className="crm-subhead grow">Coming up <span className="muted small">(next 14 days)</span></h2>
          </div>
          {d.upcoming.length ? (
            <ul className="crm-mini-list">
              {d.upcoming.map((u) => (
                <li key={`${u.kind}:${u.id}`}>
                  <Icon name={u.kind === 'recurring' ? 'refresh' : u.direction === 'in' ? 'download' : 'upload'} size={14} />
                  <div className="grow">
                    <Link to={u.kind === 'recurring' ? `${base}/recurring` : `${base}/${DOC_LABELS[u.kind as DocKind]?.path ?? 'invoices'}/${u.id}`}>{u.title}</Link>
                    <div className="muted small">
                      {u.kind === 'recurring' ? 'Recurring' : DOC_LABELS[u.kind as DocKind]?.one} · {u.overdue ? 'was due' : 'due'} {shortDate(u.date)} {u.overdue ? <StatusBadge status="overdue" /> : null}
                    </div>
                  </div>
                  {u.amount ? <Money value={u.direction === 'in' ? u.amount : -u.amount} tone /> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nothing due in the next two weeks.</p>
          )}
        </section>
        {d.goals.length ? (
          <section className="card card-pad">
            <div className="row">
              <h2 className="crm-subhead grow">Savings goals</h2>
              <Link to={`${base}/goals`} className="small">All</Link>
            </div>
            <ul className="crm-mini-list">
              {d.goals.map((g) => (
                <li key={g.id} className="fin-goal-mini">
                  <div className="grow">
                    <div className="row">
                      <span className="grow ellipsis">{g.name}</span>
                      <span className="small muted">{g.progressPct}%</span>
                    </div>
                    <div className="fin-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={g.progressPct} aria-label={`${g.name}: ${g.progressPct}% saved`}>
                      <span style={{ width: `${g.progressPct}%` }} />
                    </div>
                    <div className="muted small">{fmt(g.saved)} of {fmt(g.targetAmount)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="card card-pad crm-span-2">
          <RecentList recent={d.recent} />
        </section>
      </div>
      <p className="muted small fin-hint">Figures come from posted entries in the ledger. Drafts and records waiting for approval are not counted until they are posted.</p>
    </>
  );
}

function BudgetCard({ d }: { d: DashFull }) {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const base = `/o/${org.id}`;
  if (!org.perms.budgets.view) return null;
  const b = d.budget;
  const bar = (actual: number, budget: number, label: string) => {
    const used = budget > 0 ? Math.round((actual / budget) * 100) : 0;
    return (
      <div className="stack">
        <div className="row">
          <span className="grow small">{label}</span>
          <span className="small">{fmt(actual)} of {fmt(budget)}</span>
        </div>
        <div className={`fin-bar${used > 100 ? ' over' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, used)} aria-label={`${label}: ${used}% of the budget spent`}>
          <span style={{ width: `${Math.min(100, Math.max(0, used))}%` }} />
        </div>
        <span className={`small ${used > 100 ? 'warning-text' : 'muted'}`}>{budget > 0 ? (used > 100 ? `${used}% spent: over budget by ${fmt(actual - budget)}` : `${used}% spent, ${fmt(budget - actual)} left`) : 'No amount budgeted'}</span>
      </div>
    );
  };
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">Budget</h2>
        {b ? <Link to={`${base}/budgets/${b.id}`} className="small">{b.name}</Link> : null}
      </div>
      {b ? (
        <div className="stack">
          {bar(b.monthActual, b.monthBudget, `${org.kind === 'business' ? 'Expenses' : 'Spending'} this month`)}
          {bar(b.yearActual, b.yearBudget, 'So far in the budget')}
          <Link to={`${base}/reports/budget_actual?budget=${b.id}`} className="small">Budget against actual</Link>
        </div>
      ) : (
        <p className="muted">
          No budget covers this month.{' '}
          {org.perms.budgets.manage ? <Link to={`${base}/budgets`}>Set up a budget</Link> : null}
        </p>
      )}
    </section>
  );
}

function RecentList({ recent }: { recent: TxLite[] }) {
  const org = useCurrentOrg();
  const accounts = useAccounts().data ?? [];
  const byId = new Map(accounts.map((a) => [a.id, a]));
  const base = `/o/${org.id}`;
  return (
    <>
      <div className="row">
        <h2 className="crm-subhead grow">Recent transactions</h2>
        {org.perms.banking.view !== 'none' ? <Link to={`${base}/transactions`} className="small">All</Link> : null}
      </div>
      {recent.length ? (
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Who or what</th>
                <th>Category</th>
                <th>Status</th>
                <th className="fin-num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => {
                const category = t.kind === 'transfer' ? `Transfer to ${accountLabel(byId.get(t.toAccountId ?? ''))}` : t.lines.length > 1 ? 'Split' : accountLabel(byId.get(t.lines[0]?.accountId ?? ''));
                return (
                  <tr key={t.id}>
                    <td>{shortDate(t.date)}</td>
                    <td>
                      <Link to={`${base}/transactions/${t.id}`} className="fin-row-link">{t.payee || t.contactName || t.description || (t.kind === 'transfer' ? 'Transfer' : 'Transaction')}</Link>
                    </td>
                    <td className="muted">{category}</td>
                    <td>{t.status !== 'posted' ? <StatusBadge status={t.status} /> : null}</td>
                    <td className="fin-num">
                      <Money value={t.kind === 'spend' ? -t.total : t.total} tone={t.kind !== 'transfer'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="list" title="No transactions yet">
          {org.perms.banking.create ? <Link to={`${base}/transactions`}>Record one</Link> : 'Transactions appear here once they are recorded.'}
        </EmptyState>
      )}
    </>
  );
}
