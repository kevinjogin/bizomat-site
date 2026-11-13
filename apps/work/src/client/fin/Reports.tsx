// Finance reports: the list (what this workspace offers: aged reports for businesses, the GST worksheet for businesses
// registered for GST) and one screen that shows any report from the table the server computes from posted ledger
// entries: its parameters, chart, totals, checks and notes, with CSV and PDF exports and scheduled runs. The screen
// adds nothing to the figures; the CSV and PDF are the same table.
import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, del, errorMessage, get, post } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { BarChart, DonutChart } from '../components/charts/Charts';
import { PERIODS, type PeriodKey, addMonths, endOfMonth, fyStart, period, startOfMonth } from '../../shared/fin/dates';
import { appUrl, download, fin, shortDate, todayLocal, useCurrentOrg, useMoney, usePeople } from './lib';
import { AccountSelect, Hint, TrackingSelect, useHasTracking } from './ui';
import { GroupedBars, SignedLine, TEAL, seriesColor } from './finCharts';

type ReportKey =
  | 'profit_loss'
  | 'balance_sheet'
  | 'cash_flow'
  | 'general_ledger'
  | 'trial_balance'
  | 'account_transactions'
  | 'income_expenses'
  | 'budget_actual'
  | 'cash_forecast'
  | 'aged_receivables'
  | 'aged_payables'
  | 'gst';

interface ReportRow {
  cells: (string | number | null)[];
  style?: 'heading' | 'total' | 'subtotal' | 'normal';
  indent?: number;
  accountId?: string;
}

interface ReportDTO {
  key: string;
  title: string;
  subtitle?: string;
  columns: { label: string; align?: 'left' | 'right' }[];
  rows: ReportRow[];
  chart?: { kind: 'bar' | 'line' | 'donut'; series: { label: string; value: number }[]; compare?: { label: string; value: number }[] };
  summary?: Record<string, number | string | boolean | null>;
  notes?: string[];
  params: Record<string, string | number | undefined>;
}

interface ScheduleDTO {
  id: string;
  reportKey: string;
  frequency: 'monthly' | 'quarterly';
  format: 'pdf' | 'csv';
  nextDate: string;
  active: boolean;
  lastRunAt: number | null;
}

interface Spec {
  group: 'performance' | 'position' | 'cash' | 'tax' | 'books';
  about: string;
  range?: boolean;
  asAt?: boolean;
  compare?: ('previous_period' | 'previous_year' | 'months')[];
  filters?: boolean;
  account?: boolean;
  budget?: boolean;
  weeks?: boolean;
  basis?: boolean;
  /** The server can run it on a schedule (for the month or quarter just finished). */
  schedule?: boolean;
}

const SPECS: Record<ReportKey, Spec> = {
  profit_loss: { group: 'performance', about: 'Income less expenses for a period, by category, with comparisons.', range: true, compare: ['previous_period', 'previous_year', 'months'], filters: true, schedule: true },
  income_expenses: { group: 'performance', about: 'Income, expenses and what was kept, month by month.', range: true, filters: true, schedule: true },
  budget_actual: { group: 'performance', about: 'Each category against its budget, with the variance.', budget: true, range: true },
  balance_sheet: { group: 'position', about: 'What is owned and owed on a date, and the equity between them.', asAt: true, compare: ['previous_year'], schedule: true },
  aged_receivables: { group: 'position', about: 'What customers owe, by how many days past the due date.', asAt: true, schedule: true },
  aged_payables: { group: 'position', about: 'What you owe suppliers and claimants, by days past the due date.', asAt: true, schedule: true },
  cash_flow: { group: 'cash', about: 'Where cash came from and went: operating, investing and financing.', range: true, schedule: true },
  cash_forecast: { group: 'cash', about: 'Cash week by week from open invoices, bills and recurring items.', weeks: true },
  gst: { group: 'tax', about: 'GST on sales and purchases by tax code, and a BAS worksheet.', range: true, basis: true, schedule: true },
  trial_balance: { group: 'books', about: 'Every account’s debit or credit balance on a date. Debits equal credits.', asAt: true, schedule: true },
  general_ledger: { group: 'books', about: 'Every posted journal line, account by account, with running balances.', range: true, filters: true },
  account_transactions: { group: 'books', about: 'The posted entries of one account, with its opening and running balance.', range: true, account: true, filters: true },
};

const GROUPS: { key: Spec['group']; title: string }[] = [
  { key: 'performance', title: 'Performance' },
  { key: 'position', title: 'Position' },
  { key: 'cash', title: 'Cash' },
  { key: 'tax', title: 'Tax' },
  { key: 'books', title: 'Ledger' },
];

const COMPARE_LABELS = { none: 'No comparison', previous_period: 'Previous period', previous_year: 'Same period last year', months: 'Month by month' } as const;

const PARAM_KEYS = ['from', 'to', 'date', 'compare', 'account', 'department', 'project', 'costCentre', 'person', 'budget', 'basis', 'weeks'] as const;

function useReportList() {
  const org = useCurrentOrg();
  return useQuery({ queryKey: ['fin', org.id, 'reports'], queryFn: () => get<{ key: ReportKey; title: string }[]>(fin(org.id, '/reports')), enabled: org.perms.reports.view, staleTime: 60_000 });
}

function useSchedules() {
  const org = useCurrentOrg();
  return useQuery({ queryKey: ['fin', org.id, 'report-schedules'], queryFn: () => get<ScheduleDTO[]>(fin(org.id, '/report-schedules')), enabled: org.perms.reports.view });
}

function NoReports() {
  return (
    <div className="page crm-page">
      <PageHeader title="Reports" icon="chart" />
      <EmptyState icon="chart" title="Your role does not include reports">Ask an owner or administrator of this workspace if you need them.</EmptyState>
    </div>
  );
}

// ------------------------------------------------------------------ the list

export function Reports() {
  const org = useCurrentOrg();
  const list = useReportList();
  usePageTitle('Reports');
  if (!org.perms.reports.view) return <NoReports />;
  const base = `/o/${org.id}`;
  return (
    <div className="page crm-page">
      <PageHeader title="Reports" icon="chart" subtitle={`${org.name}: worked out from posted ledger entries each time you open one.`} />
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {!list.data ? (
        <Loading />
      ) : (
        <div className="stack-lg">
          {GROUPS.map((g) => {
            const items = list.data.filter((r) => SPECS[r.key]?.group === g.key);
            if (!items.length) return null;
            return (
              <section key={g.key}>
                <h2 className="crm-subhead">{g.title}</h2>
                <div className="grid-cards">
                  {items.map((r) => (
                    <Link key={r.key} to={`${base}/reports/${r.key}`} className="tile">
                      <strong>{r.title}</strong>
                      <span className="muted small">{SPECS[r.key].about}</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
          <Schedules titles={Object.fromEntries(list.data.map((r) => [r.key, r.title]))} />
        </div>
      )}
    </div>
  );
}

function Schedules({ titles }: { titles: Record<string, string> }) {
  const org = useCurrentOrg();
  const q = useSchedules();
  const toast = useToast();
  const confirm = useConfirm();
  const base = `/o/${org.id}`;
  const rows = q.data ?? [];
  if (!rows.length && !org.perms.reports.export) return null;
  const remove = async (s: ScheduleDTO) => {
    if (!(await confirm({ title: 'Stop this scheduled report?', message: 'Reports it already made stay in Documents.', confirmLabel: 'Stop', danger: true }))) return;
    try {
      await del(fin(org.id, `/report-schedules/${s.id}`));
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section>
      <h2 className="crm-subhead">Scheduled reports</h2>
      <Hint>
        A scheduled report runs on its date for the month or quarter just finished and is saved in <Link to={`${base}/documents?folder=Reports`}>Documents, in the Reports folder</Link>. You are notified when it is ready. Open a report to schedule it.
      </Hint>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {rows.length ? (
        <div className="card crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Every</th>
                <th>Format</th>
                <th>Next run</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td><Link to={`${base}/reports/${s.reportKey}`}>{titles[s.reportKey] ?? s.reportKey}</Link></td>
                  <td>{s.frequency === 'monthly' ? 'Month' : 'Quarter'}</td>
                  <td>{s.format.toUpperCase()}</td>
                  <td>{shortDate(s.nextDate)}</td>
                  <td>{s.active ? <span className="badge success">Active</span> : <span className="badge danger" title="It failed on its last run, or its creator can no longer export reports">Stopped</span>}</td>
                  <td className="fin-num">{org.perms.reports.export ? <button className="btn sm ghost" onClick={() => remove(s)}>Delete</button> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted small">No scheduled reports.</p>
      )}
    </section>
  );
}

// ------------------------------------------------------------------ one report

export function ReportPage() {
  const org = useCurrentOrg();
  const { key = '' } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const list = useReportList();
  const spec = SPECS[key as ReportKey] as Spec | undefined;
  const qs = new URLSearchParams();
  for (const k of PARAM_KEYS) {
    const v = params.get(k);
    if (v) qs.set(k, v);
  }
  const missing = spec?.account && !qs.get('account') ? 'account' : spec?.budget && !qs.get('budget') ? 'budget' : null;
  // Budget against actual covers the chosen budget's months unless other dates are chosen.
  const budgets = useBudgetList(!!spec?.budget);
  const chosenBudget = budgets.data?.find((b) => b.id === qs.get('budget'));
  if (chosenBudget && !qs.get('from') && !qs.get('to')) {
    qs.set('from', `${chosenBudget.startMonth}-01`);
    qs.set('to', endOfMonth(addMonths(`${chosenBudget.startMonth}-01`, chosenBudget.months - 1)));
  }
  const waitForBudget = !!spec?.budget && !!qs.get('budget') && org.perms.budgets.view && !budgets.data && !budgets.error;
  const q = useQuery({
    queryKey: ['fin', org.id, 'report', key, qs.toString()],
    queryFn: () => get<ReportDTO>(`${fin(org.id, `/reports/${key}`)}?${qs.toString()}`),
    enabled: org.perms.reports.view && !!spec && !missing && !waitForBudget,
    placeholderData: keepPreviousData,
    retry: (n, e) => !(e instanceof ApiError && e.status < 500) && n < 2,
  });
  const listed = list.data?.find((r) => r.key === key);
  const [scheduling, setScheduling] = useState(false);
  usePageTitle(listed?.title ?? 'Report');
  if (!org.perms.reports.view) return <NoReports />;
  if (!spec || (list.data && !listed)) {
    return (
      <div className="page crm-page">
        <PageHeader title="Report not available" icon="chart" />
        <EmptyState icon="chart" title="This report is not available in this workspace" action={<Link className="btn" to={`/o/${org.id}/reports`}>All reports</Link>} />
      </div>
    );
  }
  // The server answers account transactions as a general ledger of one account.
  const r = q.data && (q.data.key === key || (key === 'account_transactions' && q.data.key === 'general_ledger')) ? q.data : undefined;
  // Shown values: what the person chose, else what the server used.
  const value = (k: (typeof PARAM_KEYS)[number]) => params.get(k) ?? (r?.params[k] !== undefined && r?.params[k] !== null ? String(r.params[k]) : '');
  const set = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true });
  };
  const exportUrl = (format: 'csv' | 'pdf') => {
    const e = new URLSearchParams(qs);
    // Keep the dates the screen shows, so the file matches it.
    for (const k of PARAM_KEYS) if (!e.get(k) && r?.params[k] !== undefined && r?.params[k] !== null && r.params[k] !== 'none') e.set(k, String(r.params[k]));
    e.set('format', format);
    return appUrl(`/api${fin(org.id, `/reports/${key}`)}?${e.toString()}`);
  };
  const canExport = org.perms.reports.export && !missing && !!r;
  return (
    <div className="page crm-page">
      <PageHeader
        title={listed?.title ?? r?.title ?? 'Report'}
        icon="chart"
        subtitle={r?.subtitle ?? spec.about}
        actions={
          <>
            {q.isFetching ? <Spinner /> : null}
            <button className="btn" onClick={() => navigate(`/o/${org.id}/reports`)}>
              <Icon name="chevronLeft" size={14} /> All reports
            </button>
            {org.perms.reports.export ? (
              <>
                <button className="btn" disabled={!canExport} onClick={() => download(exportUrl('csv'))}>
                  <Icon name="download" size={14} /> CSV
                </button>
                <button className="btn" disabled={!canExport} onClick={() => download(exportUrl('pdf'))}>
                  <Icon name="download" size={14} /> PDF
                </button>
                {spec.schedule ? (
                  <button className="btn" onClick={() => setScheduling(true)}>
                    <Icon name="clock" size={14} /> Schedule
                  </button>
                ) : null}
              </>
            ) : null}
          </>
        }
      />
      <Controls spec={spec} value={value} set={set} budgets={budgets.data ?? []} />
      {missing === 'account' ? <EmptyState icon="list" title="Choose an account">The report lists the posted entries of the account you choose above.</EmptyState> : null}
      {missing === 'budget' ? <EmptyState icon="target" title="Choose a budget">The report compares the budget you choose above with what actually happened.</EmptyState> : null}
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!missing && !r && !q.error ? <Loading /> : null}
      {!missing && r ? <ReportView r={r} reportKey={key as ReportKey} value={value} /> : null}
      {scheduling ? <ScheduleModal reportKey={key} title={listed?.title ?? r?.title ?? key} onClose={() => setScheduling(false)} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ parameters

interface BudgetLite {
  id: string;
  name: string;
  startMonth: string;
  months: number;
  archived: boolean;
}

function useBudgetList(wanted: boolean) {
  const org = useCurrentOrg();
  return useQuery({ queryKey: ['fin', org.id, 'budgets'], queryFn: () => get<BudgetLite[]>(fin(org.id, '/budgets')), enabled: wanted && org.perms.budgets.view });
}

function Controls({ spec, value, set, budgets }: { spec: Spec; value: (k: (typeof PARAM_KEYS)[number]) => string; set: (c: Record<string, string | null>) => void; budgets: BudgetLite[] }) {
  const org = useCurrentOrg();
  const tracking = useHasTracking();
  const people = usePeople();
  const today = todayLocal();
  const from = value('from');
  const to = value('to');
  const presets = (Object.keys(PERIODS) as PeriodKey[]).map((k) => ({ key: k, label: PERIODS[k], ...period(k, today, org.fyStartMonth) }));
  const currentPreset = presets.find((p) => p.from === from && p.to === to)?.key ?? '';
  const asAtPresets = [
    { key: 'today', label: 'Today', date: today },
    { key: 'last_month', label: 'End of last month', date: endOfMonth(addMonths(startOfMonth(today), -1)) },
    { key: 'last_fy', label: 'End of last financial year', date: dayBefore(fyStart(today, org.fyStartMonth)) },
  ];
  const date = value('date');
  const items: ReactNode[] = [];
  if (spec.budget) {
    if (!org.perms.budgets.view) items.push(<span key="b" className="muted small">Your role does not include budgets, so no budget can be chosen.</span>);
    else
      items.push(
        <label key="budget" className="field">
          <span className="small muted">Budget</span>
          <select className="select" value={value('budget')} onChange={(e) => set({ budget: e.target.value || null, from: null, to: null })}>
            <option value="">Choose a budget…</option>
            {budgets.filter((b) => !b.archived || b.id === value('budget')).map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>,
      );
  }
  if (spec.account) {
    items.push(
      <label key="account" className="field">
        <span className="small muted">Account</span>
        <AccountSelect value={value('account') || null} onChange={(v) => set({ account: v })} kind="any" emptyLabel="Choose an account…" ariaLabel="Account" />
      </label>,
    );
  }
  if (spec.range) {
    items.push(
      <label key="preset" className="field">
        <span className="small muted">Period</span>
        <select className="select" value={currentPreset} onChange={(e) => { const p = presets.find((x) => x.key === e.target.value); if (p) set({ from: p.from, to: p.to }); }}>
          <option value="">Custom dates</option>
          {presets.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </label>,
      <label key="from" className="field">
        <span className="small muted">From</span>
        <input className="input" type="date" value={from} max={to || undefined} onChange={(e) => e.target.value && set({ from: e.target.value })} />
      </label>,
      <label key="to" className="field">
        <span className="small muted">To</span>
        <input className="input" type="date" value={to} min={from || undefined} onChange={(e) => e.target.value && set({ to: e.target.value })} />
      </label>,
    );
  }
  if (spec.asAt) {
    items.push(
      <label key="date" className="field">
        <span className="small muted">As at</span>
        <input className="input" type="date" value={date} onChange={(e) => e.target.value && set({ date: e.target.value })} />
      </label>,
      <label key="asat" className="field">
        <span className="small muted">Quick dates</span>
        <select className="select" value={asAtPresets.find((p) => p.date === date)?.key ?? ''} onChange={(e) => { const p = asAtPresets.find((x) => x.key === e.target.value); if (p) set({ date: p.date }); }}>
          <option value="">Other date</option>
          {asAtPresets.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </label>,
    );
  }
  if (spec.compare) {
    const options = ['none', ...spec.compare] as (keyof typeof COMPARE_LABELS)[];
    items.push(
      <label key="compare" className="field">
        <span className="small muted">Compare with</span>
        <select className="select" value={value('compare') || 'none'} onChange={(e) => set({ compare: e.target.value === 'none' ? null : e.target.value })}>
          {options.map((o) => (
            <option key={o} value={o}>{COMPARE_LABELS[o]}</option>
          ))}
        </select>
      </label>,
    );
  }
  if (spec.weeks) {
    items.push(
      <label key="weeks" className="field">
        <span className="small muted">Weeks ahead</span>
        <select className="select" value={value('weeks') || '13'} onChange={(e) => set({ weeks: e.target.value })}>
          {[4, 8, 13, 26].map((w) => (
            <option key={w} value={w}>{w} weeks</option>
          ))}
        </select>
      </label>,
    );
  }
  if (spec.basis) {
    items.push(
      <label key="basis" className="field">
        <span className="small muted">Basis</span>
        <select className="select" value={value('basis') || org.gstBasis} onChange={(e) => set({ basis: e.target.value })}>
          <option value="accrual">Accrual (invoices and bills by their date)</option>
          <option value="cash">Cash (as payments are made and received)</option>
        </select>
      </label>,
    );
  }
  if (spec.filters) {
    for (const k of ['department', 'project', 'cost_centre'] as const) {
      if (!tracking[k]) continue;
      const param = k === 'cost_centre' ? 'costCentre' : k;
      items.push(
        <label key={k} className="field">
          <span className="small muted">{k === 'cost_centre' ? 'Cost centre' : k === 'project' ? 'Project' : 'Department'}</span>
          <TrackingSelect kind={k} value={value(param) || null} onChange={(v) => set({ [param]: v })} />
        </label>,
      );
    }
    if (org.kind === 'household' && people.members.length > 1) {
      items.push(
        <label key="person" className="field">
          <span className="small muted">Person</span>
          <select className="select" value={value('person')} onChange={(e) => set({ person: e.target.value || null })}>
            <option value="">Everyone</option>
            {people.members.map((m) => (
              <option key={m.userId} value={m.userId}>{m.name}</option>
            ))}
          </select>
        </label>,
      );
    }
  }
  if (!items.length) return null;
  return <div className="row fin-toolbar crm-rangebar fin-report-controls">{items}</div>;
}

function dayBefore(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ------------------------------------------------------------------ the table, chart, totals and notes

const SUMMARY_LABELS: Record<string, string> = {
  income: 'Income',
  expenses: 'Expenses',
  net: 'Net',
  assets: 'Assets',
  liabilities: 'Liabilities',
  netAssets: 'Net assets',
  equity: 'Equity',
  opening: 'Cash at the start',
  closing: 'Cash at the end',
  debits: 'Debits',
  credits: 'Credits',
  total: 'Total outstanding',
  overdue: 'Overdue',
  lowest: 'Lowest cash',
  incomeBudget: 'Income budgeted',
  incomeActual: 'Income actual',
  expenseBudget: 'Expenses budgeted',
  expenseActual: 'Expenses actual',
};

function ReportView({ r, reportKey, value }: { r: ReportDTO; reportKey: ReportKey; value: (k: (typeof PARAM_KEYS)[number]) => string }) {
  const org = useCurrentOrg();
  const { fmt, currency } = useMoney();
  const personal = org.kind !== 'business';
  const major = (minor: number) => (currency === 'JPY' ? minor : minor / 100);
  const fmtMajor = (v: number) => fmt(currency === 'JPY' ? v : Math.round(v * 100));
  const base = `/o/${org.id}`;
  // Rows with an account open its transactions for the report's period (or the financial year to its date).
  const linkFrom = r.params.from ? String(r.params.from) : r.params.date ? fyStart(String(r.params.date), org.fyStartMonth) : '';
  const linkTo = r.params.to ? String(r.params.to) : r.params.date ? String(r.params.date) : '';
  const accountLink = (id: string) => `${base}/reports/account_transactions?account=${id}${linkFrom ? `&from=${linkFrom}` : ''}${linkTo ? `&to=${linkTo}` : ''}`;
  const summary = r.summary ?? {};
  const label = (k: string) => (personal && k === 'expenses' ? 'Spending' : personal && k === 'netAssets' ? 'Net worth' : SUMMARY_LABELS[k]);
  const figures = reportKey === 'gst' ? [] : Object.entries(summary).filter(([k, v]) => typeof v === 'number' && SUMMARY_LABELS[k]);
  const checks: ReactNode[] = [];
  if (typeof summary.balanced === 'boolean') checks.push(summary.balanced ? <span key="b" className="badge success">Balances</span> : <span key="b" className="badge danger">Does not balance: tell your accountant</span>);
  if (typeof summary.reconciles === 'boolean') checks.push(summary.reconciles ? <span key="r" className="badge success">Opening cash plus the net change equals closing cash</span> : <span key="r" className="badge danger">Cash does not reconcile</span>);
  const cell = (v: string | number | null, j: number, row: ReportRow) => {
    if (v === null || v === '') return '';
    if (typeof v === 'number') return <span className={`fin-amount${v < 0 ? ' neg' : ''}`}>{fmt(v)}</span>;
    if (j > 0 && /^\d{4}-\d{2}-\d{2}$/.test(v)) return shortDate(v);
    if (j === 0 && row.accountId && reportKey !== 'account_transactions' && row.style !== 'subtotal' && row.style !== 'total') {
      return <Link to={accountLink(row.accountId)} className="fin-row-link">{v}</Link>;
    }
    return v;
  };
  const chart = r.chart && r.chart.series.length ? r.chart : null;
  const gst = reportKey === 'gst';
  return (
    <div className="stack-lg">
      {gst && r.notes?.length ? (
        <div className="card card-pad fin-gst-note" role="note">
          {r.notes.map((n) => (
            <p key={n} className="small">{n}</p>
          ))}
        </div>
      ) : null}
      {figures.length || checks.length ? (
        <div className="crm-stats">
          {figures.map(([k, v]) => (
            <div key={k} className="crm-stat card">
              <span className="crm-stat-label">{label(k)}</span>
              <span className={`crm-stat-value${(v as number) < 0 ? ' danger' : ''}`}>{fmt(v as number)}</span>
              {k === 'lowest' && summary.lowestWeek ? <span className="crm-stat-hint">Week of {shortDate(String(summary.lowestWeek))}</span> : null}
            </div>
          ))}
          {checks.length ? (
            <div className="crm-stat card">
              <span className="crm-stat-label">Check</span>
              <div className="row wrap">{checks}</div>
            </div>
          ) : null}
        </div>
      ) : null}
      {chart ? (
        <section className="card card-pad">
          {chart.kind === 'donut' ? (
            <>
              <h2 className="crm-subhead">{personal ? 'Spending' : 'Expenses'} by category <span className="muted small">({currency})</span></h2>
              <DonutChart data={chart.series.map((s, i) => ({ key: s.label, label: s.label, value: major(s.value), color: seriesColor(i) }))} centerLabel={currency} />
            </>
          ) : chart.kind === 'line' ? (
            <>
              <h2 className="crm-subhead">Closing cash by week <span className="muted small">({currency})</span></h2>
              <SignedLine data={chart.series.map((s, i) => ({ key: `${i}`, label: s.label, value: major(s.value) }))} format={fmtMajor} />
            </>
          ) : chart.compare ? (
            <>
              <h2 className="crm-subhead">Income and {personal ? 'spending' : 'expenses'} by month <span className="muted small">({currency})</span></h2>
              <GroupedBars
                groups={chart.series.map((s, i) => ({ key: `${i}`, label: s.label, values: [major(s.value), major(chart.compare![i]?.value ?? 0)] }))}
                series={[{ label: 'Income', color: seriesColor(0) }, { label: personal ? 'Spending' : 'Expenses', color: seriesColor(1) }]}
                format={fmtMajor}
              />
            </>
          ) : (
            <>
              <h2 className="crm-subhead">Outstanding by age <span className="muted small">({currency})</span></h2>
              <BarChart data={chart.series.map((s) => ({ key: s.label, label: s.label, value: major(s.value), color: TEAL }))} height={190} />
            </>
          )}
        </section>
      ) : null}
      <section className="card">
        {r.rows.length ? (
          <div className="crm-table-scroll">
            <table className="data-table fin-report-table">
              <thead>
                <tr>
                  {r.columns.map((c, i) => (
                    <th key={i} className={c.align === 'right' ? 'fin-num' : undefined}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.rows.map((row, i) => (
                  <tr key={i} className={row.style && row.style !== 'normal' ? row.style : undefined}>
                    {row.cells.map((v, j) => (
                      <td key={j} className={[j === 0 && row.indent ? `indent-${Math.min(2, row.indent)}` : '', r.columns[j]?.align === 'right' ? 'fin-num' : ''].filter(Boolean).join(' ') || undefined}>
                        {cell(v, j, row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="chart" title="Nothing to show">No posted entries match these choices. Drafts and records waiting for approval are not in reports.</EmptyState>
        )}
      </section>
      {!gst && r.notes?.length ? (
        <ul className="fin-notes">
          {r.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}
      {gst ? <p className="muted small">GST basis and BAS reporting method come from Settings, Workspace. The basis above changes this worksheet only.</p> : null}
      {value('compare') === 'months' ? <p className="muted small">Month by month shows up to the last twelve months of the period.</p> : null}
    </div>
  );
}

// ------------------------------------------------------------------ scheduling

function ScheduleModal({ reportKey, title, onClose }: { reportKey: string; title: string; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const schedules = useSchedules();
  const firstOfNext = addMonths(startOfMonth(todayLocal()), 1);
  const [f, setF] = useState({ frequency: 'monthly' as 'monthly' | 'quarterly', format: 'pdf' as 'pdf' | 'csv', nextDate: firstOfNext });
  const [busy, setBusy] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await post(fin(org.id, '/report-schedules'), { reportKey, frequency: f.frequency, format: f.format, nextDate: f.nextDate });
      await schedules.refetch();
      toast(`${title} scheduled`);
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={`Schedule: ${title}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="fin-schedule" disabled={busy}>{busy ? 'Saving…' : 'Schedule'}</button>
        </>
      }
    >
      <form id="fin-schedule" className="stack" onSubmit={save}>
        <p className="muted small">
          Each run covers the {f.frequency === 'monthly' ? 'month' : 'three months'} just finished (balance-style reports as at its last day) and is saved in Documents, in the Reports folder. The choices on this screen, such as filters and comparisons, are not kept.
        </p>
        <div className="field">
          <label htmlFor="sch-freq">Run every</label>
          <select id="sch-freq" className="select" value={f.frequency} onChange={(e) => setF({ ...f, frequency: e.target.value as 'monthly' | 'quarterly' })}>
            <option value="monthly">Month</option>
            <option value="quarterly">Quarter</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="sch-format">Format</label>
          <select id="sch-format" className="select" value={f.format} onChange={(e) => setF({ ...f, format: e.target.value as 'pdf' | 'csv' })}>
            <option value="pdf">PDF</option>
            <option value="csv">CSV (for spreadsheets)</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="sch-date">First run</label>
          <input id="sch-date" className="input" type="date" required value={f.nextDate} onChange={(e) => setF({ ...f, nextDate: e.target.value })} />
        </div>
      </form>
    </Modal>
  );
}
