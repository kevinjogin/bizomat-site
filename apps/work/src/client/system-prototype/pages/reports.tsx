// Reports & Analytics: the enterprise dashboards, the company performance report and the other reports, all on the
// report pattern (patterns/ReportView.tsx).
import { Link } from 'react-router-dom';
import { COMPANIES, itemCost, itemName } from '../data/core';
import * as OP from '../data/operations';
import * as SF from '../data/sales-finance';
import { compactMoney, fmtDate, rng } from '../format';
import { PIcon } from '../icons';
import { Empty, Meter, Panel, StateBadges, StatusBadge } from '../kit';
import { pageByPath, STATE_LABEL } from '../nav';
import { ReportView, savedReports, type ReportDef, type ReportRow } from '../patterns/ReportView';
import { PageHeader, StateNote, useVisit } from '../shell/PageHeader';
import { HBarChart } from '../widgets/charts';
import { ModulePage } from './common';
import type { NavPage } from '../types';

const CO = COMPANIES[0].name;
const r = rng(77);
const invoiceRows: ReportRow[] = SF.invoices.map((v) => {
  const value = v.total / 1.1;
  return { id: v.id, date: v.issued, label: v.customer, company: CO, department: v.department, site: v.site, value, cost: value * (0.62 + r() * 0.1), status: v.status };
});

export const REPORTS: Record<string, ReportDef & { page: string; blurb: string }> = {
  'company-performance': {
    id: 'company-performance',
    page: 'reports/enterprise',
    title: 'Company performance',
    blurb: 'Revenue against target, margin and the invoices behind them, across Finance and the System.',
    valueLabel: 'Revenue',
    breakdownLabel: 'Customer',
    breakdown: (x) => x.label,
    rows: invoiceRows,
    target: (m) => 190_000 + Number(m.slice(5, 7)) * 3_000,
    labelHeader: 'Customer',
  },
  sales: {
    id: 'sales',
    page: 'reports/sales',
    title: 'Sales by month',
    blurb: 'Order intake by month and by sales person.',
    valueLabel: 'Order intake',
    breakdownLabel: 'Owner',
    breakdown: (x) => x.group ?? '',
    rows: SF.salesOrders.map((s) => {
      const value = s.total / 1.1;
      return { id: s.id, date: s.ordered, label: s.customer, company: CO, department: 'Sales', group: s.owner, site: s.site, value, cost: value * 0.68, status: s.status };
    }),
    labelHeader: 'Customer',
  },
  financial: {
    id: 'financial',
    page: 'reports/financial',
    title: 'Revenue and margin',
    blurb: 'Revenue and gross margin by month and department, from Finance.',
    valueLabel: 'Revenue',
    breakdownLabel: 'Department',
    breakdown: (x) => x.department,
    rows: invoiceRows,
    labelHeader: 'Customer',
  },
  operations: {
    id: 'operations',
    page: 'reports/operations',
    title: 'Production output',
    blurb: 'Value of finished production by month and work centre.',
    valueLabel: 'Output value',
    breakdownLabel: 'Work centre',
    breakdown: (x) => x.group ?? '',
    rows: OP.workOrders.map((w) => {
      const cost = Number(w.qty) * itemCost(w.item);
      return { id: w.id, date: w.due, label: itemName(w.item), group: OP.workCentres.find((c) => c.id === w.centre)?.name ?? w.centre, company: CO, department: 'Production', site: w.site, value: cost * 1.45, cost, status: w.status };
    }),
    labelHeader: 'Product',
  },
};

export function ReportPage({ id }: { id: string }) {
  const def = REPORTS[id];
  const page = pageByPath(def.page) as NavPage;
  const isSub = def.page === 'reports/enterprise';
  useVisit(isSub ? `/${def.page}/${id}` : `/${def.page}`, def.title);
  return (
    <div className="erp-page wide">
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Reports & Analytics', to: '/reports/enterprise' }, ...(isSub ? [{ label: page.label, to: `/${page.path}` }] : []), { label: isSub ? def.title : page.label }]}
        title={isSub ? def.title : page.label}
        subtitle={def.blurb}
        states={page.state}
        pinPath={isSub ? `/${def.page}/${id}` : `/${def.page}`}
        pinLabel={def.title}
      />
      <StateNote page={page} />
      <ReportView def={def} />
    </div>
  );
}

export function Enterprise({ page }: { page: NavPage }) {
  const cards = [
    { id: 'company-performance', to: '/reports/enterprise/company-performance', title: 'Company performance', text: REPORTS['company-performance'].blurb, state: 'C' as const },
    { id: 'operations', to: '/reports/operations', title: 'Production output', text: REPORTS.operations.blurb, state: 'P' as const },
    { id: 'sales', to: '/reports/sales', title: 'Sales by month', text: REPORTS.sales.blurb, state: 'W' as const },
    { id: 'financial', to: '/reports/financial', title: 'Revenue and margin', text: REPORTS.financial.blurb, state: 'W' as const },
  ];
  return (
    <ModulePage page={page} subtitle="Cross-module figures: Finance, CRM, Project Management and the System modules together.">
      <div className="erp-cardgrid">
        {cards.map((c) => (
          <Link key={c.id} to={c.to} className="card erp-linkcard" data-hl={`report-${c.id}`}>
            <span className="erp-linkcard-icon" aria-hidden>
              <PIcon name="chart" />
            </span>
            <span className="grow">
              <strong>{c.title}</strong>
              <span className="muted small">{c.text}</span>
            </span>
            <StateBadges states={[c.state]} />
          </Link>
        ))}
      </div>
    </ModulePage>
  );
}

export function ProjectReports({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="Budget used and progress of each project, from Project Management and Company.">
      <div className="erp-two">
        <Panel title="Budget used by project">
          <HBarChart label="Budget used by project" items={OP.projects.filter((p) => p.budget).map((p) => ({ label: p.name, value: Math.round((p.spent / p.budget) * 100), over: p.spent > p.budget, note: p.spent > p.budget ? 'Over budget' : `${p.progress}% done` }))} format={(n) => `${n}%`} limit={100} limitLabel="Budget (100%)" />
        </Panel>
        <Panel title="Projects">
          <div className="erp-table-scroll">
            <table className="data-table erp-table">
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col" className="num">
                    Budget
                  </th>
                  <th scope="col" className="num">
                    Spent
                  </th>
                  <th scope="col">Progress</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {OP.projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link to={`/projects/projects/${p.id}`}>{p.name}</Link>
                    </td>
                    <td className="num">{compactMoney(p.budget)}</td>
                    <td className="num">{compactMoney(p.spent)}</td>
                    <td>
                      <Meter value={p.progress} label={`${p.progress}% done`} />
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </ModulePage>
  );
}

export function SavedReports({ page }: { page: NavPage }) {
  const saved = savedReports();
  const working = [
    ['Aged receivables, monthly', 'Finance', 'Every month on the 1st, to Daniel Okafor'],
    ['Profit and loss, last month', 'Finance', 'Every month on the 3rd'],
    ['Project workload', 'Project Management', 'Every Monday, to project managers'],
  ];
  return (
    <ModulePage page={page}>
      <div className="erp-two">
        <Panel title="Your saved reports (this computer)">
          {saved.length ? (
            <ul className="erp-plain-list">
              {saved.map((s) => (
                <li key={s.id}>
                  <Link to={REPORTS[s.report]?.page === 'reports/enterprise' ? `/reports/enterprise/${s.report}?saved=${s.id}` : `/${REPORTS[s.report]?.page}?saved=${s.id}`}>{s.name}</Link>
                  <span className="muted small">
                    {' '}
                    · {REPORTS[s.report]?.title} · {fmtDate(s.filters.from)} to {fmtDate(s.filters.to)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon="star" title="No saved reports yet" action={<Link className="btn" to="/reports/enterprise/company-performance">Open Company performance</Link>}>
              Set the filters on any report and choose Save report.
            </Empty>
          )}
        </Panel>
        <Panel title="Scheduled reports">
          <ul className="erp-plain-list">
            {working.map(([n, m, w]) => (
              <li key={n}>
                <strong>{n}</strong> <span className="muted small">· {m} ({STATE_LABEL.W}) · {w}</span>
              </li>
            ))}
            <li>
              <strong>Company performance, weekly</strong> <span className="muted small">· System ({STATE_LABEL.P}) · scheduling is planned</span>
            </li>
          </ul>
        </Panel>
      </div>
    </ModulePage>
  );
}

