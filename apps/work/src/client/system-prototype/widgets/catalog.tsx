// The widget catalogue and the default layout of each of the twelve role dashboards (information architecture,
// section 5). Every figure links to the list behind it and every list row to its record. Figures are demonstration
// data, computed from the prototype's records where they can be.
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_REQUESTS, INVITATIONS, ADMIN_MODULES } from '../data/work';
import { PEOPLE } from '../data/core';
import * as SF from '../data/sales-finance';
import * as OP from '../data/operations';
import { addDays, compactMoney, daysFrom, fmtDate, money, monthLabel, relDue, TODAY } from '../format';
import { PIcon } from '../icons';
import { ModuleBadge, StatusBadge } from '../kit';
import { hrefFor } from '../links';
import { openWork, useErp } from '../state';
import type { RoleId, Tone } from '../types';
import { BarChart, ChartFrame, HBarChart, Legend, LineChart } from './charts';

export type Size = 's' | 'm' | 'l' | 'f';
export const SIZE_LABEL: Record<Size, string> = { s: 'Small', m: 'Medium', l: 'Large', f: 'Full width' };
export interface WidgetDef {
  id: string;
  title: string;
  kind: 'Figure' | 'Chart' | 'List';
  module: string;
  size: Size;
  render: () => ReactNode;
}

// ------------------------------------------------------------------ building blocks

function Kpi({ value, note, tone, to, label }: { value: string; note?: string; tone?: Tone; to: string; label: string }) {
  return (
    <div className="erp-wkpi">
      <Link to={to} className="erp-wkpi-value" aria-label={`${label}: ${value}. Open the list behind it`}>
        {value}
      </Link>
      {note ? <span className={`erp-wkpi-note${tone ? ` t-${tone}` : ''}`}>{tone === 'danger' ? <PIcon name="alert" size={13} /> : tone === 'success' ? <PIcon name="check" size={13} /> : null}{note}</span> : null}
    </div>
  );
}

interface ListItem {
  id: string;
  title: string;
  meta?: string;
  status?: string;
  to?: string;
}
function WList({ items, empty = 'Nothing here.', more }: { items: ListItem[]; empty?: string; more?: { to: string; label: string } }) {
  return (
    <div className="erp-wlist-wrap">
      {items.length ? (
        <ul className="erp-wlist">
          {items.map((i) => (
            <li key={i.id} data-hl={i.id}>
              <Link to={i.to ?? hrefFor(i.id) ?? '/'} className="erp-wlist-link">
                <span className="erp-wlist-main">
                  <span className="erp-wlist-id">{i.id}</span>
                  <span className="erp-wlist-title">{i.title}</span>
                </span>
                {i.meta ? <span className="erp-wlist-meta">{i.meta}</span> : null}
              </Link>
              {i.status ? <StatusBadge status={i.status} /> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">{empty}</p>
      )}
      {more ? (
        <Link to={more.to} className="erp-wmore">
          {more.label} <PIcon name="chevronRight" size={13} />
        </Link>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ figures from the data

const months12 = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(Date.UTC(2025, 11 + i, 1));
  return d.toISOString().slice(0, 7);
});
const revenueByMonth = months12.map((m) => SF.invoices.filter((v) => v.issued.startsWith(m)).reduce((s, v) => s + v.total / 1.1, 0));
const target = (m: string) => 190_000 + Number(m.slice(5, 7)) * 3_000;
const intakeByMonth = months12.map((m) => SF.salesOrders.filter((v) => v.ordered.startsWith(m)).reduce((s, v) => s + v.total / 1.1, 0));
const thisMonth = TODAY.slice(0, 7);
const revenueThisMonth = revenueByMonth[11];
const cash = SF.bankAccounts.reduce((s, a) => s + a.balance, 0);
const receivables = SF.invoices.reduce((s, v) => s + v.balance, 0);
const payables = SF.bills.filter((b) => b.status !== 'Paid').reduce((s, b) => s + b.total, 0);
const lateOrders = SF.salesOrders.filter((s) => s.status === 'Late');
const openOrders = SF.salesOrders.filter((s) => !['Delivered', 'Invoiced'].includes(s.status));
const openNcrs = OP.ncrs.filter((n) => n.status !== 'Closed');
const openOpps = SF.opportunities.filter((o) => !['Won', 'Lost'].includes(o.stage));
const won = SF.opportunities.filter((o) => o.stage === 'Won').length;
const lost = SF.opportunities.filter((o) => o.stage === 'Lost').length;
const avgLoad = Math.round(OP.workCentres.reduce((s, w) => s + w.loadPct, 0) / OP.workCentres.length);
const weeks8 = Array.from({ length: 8 }, (_, i) => `Wk ${38 + i}`);
const passed = OP.inspections.filter((i) => i.status === 'Passed').length;
const failed = OP.inspections.filter((i) => i.status === 'Failed').length;

function DelayedOrders() {
  return <WList items={lateOrders.map((s) => ({ id: s.id, title: s.customer, meta: `Promised ${fmtDate(s.promised)} · ${money(s.total)}`, status: s.status }))} more={{ to: '/sales/orders?view=late', label: 'All late orders' }} />;
}
function ApprovalsWaiting({ modules }: { modules?: string[] }) {
  const { work } = useErp();
  const items = openWork(work).filter((w) => w.type === 'Approval' && (!modules || modules.includes(w.module)));
  return (
    <WList
      items={items.map((w) => ({ id: w.record ?? w.id, title: w.title.replace(/^Approve (\w)/, (_, c: string) => c.toUpperCase()), meta: `${w.who} · ${w.due ? relDue(w.due) : 'No due date'}`, to: w.to.split('?')[0] }))}
      empty="No approvals waiting."
      more={{ to: '/my-work?tab=approvals', label: 'All approvals in My Work' }}
    />
  );
}
function MyWorkSummary() {
  const { work } = useErp();
  const open = openWork(work);
  const due = open.filter((w) => w.due === TODAY).length;
  const over = open.filter((w) => w.due && w.due < TODAY).length;
  const appr = open.filter((w) => w.type === 'Approval').length;
  return (
    <div className="erp-wsum">
      <Link to="/my-work?tab=today">
        <strong>{due}</strong> due today
      </Link>
      <Link to="/my-work?tab=overdue">
        <strong>{over}</strong> overdue
      </Link>
      <Link to="/my-work?tab=approvals">
        <strong>{appr}</strong> approvals
      </Link>
    </div>
  );
}

function ChartLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="erp-wmore">
      {label} <PIcon name="chevronRight" size={13} />
    </Link>
  );
}

function RevenueTarget() {
  const navigate = useNavigate();
  return (
    <>
      <ChartFrame headers={['Month', 'Revenue', 'Target']} rows={months12.map((m, i) => [monthLabel(`${m}-01`), money(revenueByMonth[i]), money(target(m))])} legend={<Legend items={[{ name: 'Revenue', cls: 'erp-s1' }, { name: 'Target', cls: 'target', dashed: true }]} />}>
        <BarChart label="Revenue against target, last 12 months" labels={months12.map((m) => monthLabel(`${m}-01`))} series={[{ name: 'Revenue', values: revenueByMonth }]} target={{ name: 'Target', values: months12.map(target) }} format={compactMoney} onSelect={() => navigate('/reports/enterprise/company-performance')} />
      </ChartFrame>
      <ChartLink to="/reports/enterprise/company-performance" label="Company performance report" />
    </>
  );
}
function PipelineByStage() {
  const navigate = useNavigate();
  const stages = ['Qualify', 'Proposal', 'Negotiation'];
  return (
    <>
      <HBarChart label="Pipeline value by stage" items={stages.map((s) => ({ label: s, value: openOpps.filter((o) => o.stage === s).reduce((a, o) => a + o.value, 0), note: `${openOpps.filter((o) => o.stage === s).length} deals` }))} format={compactMoney} onSelect={() => navigate('/sales/opportunities')} />
      <ChartLink to="/sales/opportunities" label="Pipeline board" />
    </>
  );
}
function LoadByCentre() {
  const navigate = useNavigate();
  return (
    <>
      <HBarChart label="Load by work centre this week, against capacity" items={OP.workCentres.map((w) => ({ label: w.name, value: w.loadPct, over: w.loadPct > 100, note: w.loadPct > 100 ? 'Over capacity' : undefined }))} format={(n) => `${Math.round(n)}%`} limit={100} limitLabel="Capacity (100%)" onSelect={(i) => navigate(`/manufacturing/work-centres/${OP.workCentres[i].id}`)} />
    </>
  );
}

// ------------------------------------------------------------------ catalogue

const W: WidgetDef[] = [];
const add = (id: string, title: string, kind: WidgetDef['kind'], module: string, size: Size, render: () => ReactNode) => W.push({ id, title, kind, module, size, render });

// CEO
add('ceo-revenue', 'Revenue this month', 'Figure', 'Finance', 's', () => <Kpi label="Revenue this month" value={compactMoney(revenueThisMonth)} note={`Month to date · target ${compactMoney(target(thisMonth))} for the month`} to="/reports/enterprise/company-performance" />);
add('ceo-margin', 'Gross margin', 'Figure', 'Finance', 's', () => <Kpi label="Gross margin" value="31.8%" note="Last month 30.9%" tone="success" to="/reports/enterprise/company-performance" />);
add('ceo-cash', 'Cash', 'Figure', 'Finance', 's', () => <Kpi label="Cash" value={compactMoney(cash)} note="Three accounts, from Finance" to="/finance/banking" />);
add('ceo-late', 'Orders late', 'Figure', 'System', 's', () => <Kpi label="Orders late" value={String(lateOrders.length)} note="Promised date passed" tone="danger" to="/sales/orders?view=late" />);
add('ceo-revenue-target', 'Revenue against target', 'Chart', 'Finance', 'm', () => <RevenueTarget />);
add('ceo-intake', 'Order intake by month', 'Chart', 'System', 'm', () => (
  <ChartFrame headers={['Month', 'Order intake']} rows={months12.map((m, i) => [monthLabel(`${m}-01`), money(intakeByMonth[i])])}>
    <BarChart label="Order intake by month, last 12 months" labels={months12.map((m) => monthLabel(`${m}-01`))} series={[{ name: 'Order intake', values: intakeByMonth }]} format={compactMoney} />
  </ChartFrame>
));
add('ceo-delayed', 'Delayed orders', 'List', 'System', 'm', () => <DelayedOrders />);
add('approvals', 'Approvals waiting', 'List', 'My Work', 'm', () => <ApprovalsWaiting />);
add('ceo-top-customers', 'Top customers', 'List', 'CRM', 'm', () => (
  <WList items={[...SF.customers].sort((a, b) => b.ytdRevenue - a.ytdRevenue).slice(0, 5).map((c) => ({ id: c.id, title: c.name, meta: `${compactMoney(c.ytdRevenue)} this year` }))} more={{ to: '/sales/customers', label: 'All customers' }} />
));

// Executive
add('ex-otd', 'On-time delivery', 'Figure', 'System', 's', () => <Kpi label="On-time delivery" value="91.4%" note="Last 90 days · goal 95%" tone="warning" to="/sales/deliveries" />);
add('ex-open-orders', 'Open orders', 'Figure', 'System', 's', () => <Kpi label="Open orders" value={String(openOrders.length)} note={`${compactMoney(openOrders.reduce((s, o) => s + o.total, 0))} to deliver`} to="/sales/orders?view=open" />);
add('ex-utilisation', 'Utilisation', 'Figure', 'System', 's', () => <Kpi label="Utilisation" value={`${avgLoad}%`} note="Average load of work centres" to="/manufacturing/work-centres" />);
add('ex-ncrs', 'Open nonconformances', 'Figure', 'System', 's', () => <Kpi label="Open nonconformances" value={String(openNcrs.length)} note="One for a late order" tone="warning" to="/quality/nonconformances?view=open" />);
add('ex-throughput', 'Throughput by week', 'Chart', 'System', 'm', () => {
  const vals = [11, 13, 12, 14, 10, 15, 12, 9];
  return (
    <ChartFrame headers={['Week', 'Work orders completed']} rows={weeks8.map((w, i) => [w, vals[i]])}>
      <BarChart label="Work orders completed by week" labels={weeks8} series={[{ name: 'Completed', values: vals }]} format={(n) => String(Math.round(n))} />
    </ChartFrame>
  );
});
add('ex-escalations', 'Escalations', 'List', 'System', 'm', () => (
  <WList
    items={[
      { id: 'NCR-0121', title: 'Weld rework holds SO-1048', meta: 'Quality · raised 11 Nov', status: 'Open' },
      { id: 'AST-004', title: 'Paint booth fan breakdown', meta: 'Maintenance · since 12 Nov', status: 'Breakdown' },
      { id: 'PO-0388', title: 'Plate order over approval limit', meta: 'Procurement · waiting 1 day', status: 'Awaiting approval' },
    ]}
  />
));

// Sales manager
add('sa-pipeline', 'Pipeline value', 'Figure', 'CRM', 's', () => <Kpi label="Pipeline value" value={compactMoney(openOpps.reduce((s, o) => s + o.value, 0))} note={`${openOpps.length} open opportunities`} to="/sales/opportunities" />);
add('sa-winrate', 'Win rate', 'Figure', 'CRM', 's', () => <Kpi label="Win rate" value={`${Math.round((won / Math.max(1, won + lost)) * 100)}%`} note="Last 12 months" to="/sales/reports" />);
add('sa-quotes', 'Quotes awaiting answer', 'Figure', 'Finance', 's', () => <Kpi label="Quotes awaiting answer" value={String(SF.quotes.filter((q) => q.status === 'Sent').length)} note="Sent, not yet accepted" to="/sales/quotes?view=awaiting" />);
add('sa-orders', 'Orders this month', 'Figure', 'System', 's', () => <Kpi label="Orders this month" value={String(SF.salesOrders.filter((s) => s.ordered.startsWith(thisMonth)).length)} note={compactMoney(intakeByMonth[11])} to="/sales/orders" />);
add('sa-pipeline-stage', 'Pipeline by stage', 'Chart', 'CRM', 'm', () => <PipelineByStage />);
add('sa-expiring', 'Quotes expiring', 'List', 'Finance', 'm', () => (
  <WList items={SF.quotes.filter((q) => q.status === 'Sent').sort((a, b) => (a.expires < b.expires ? -1 : 1)).slice(0, 5).map((q) => ({ id: q.id, title: q.customer, meta: `Expires ${fmtDate(q.expires)} · ${compactMoney(q.total)}`, status: daysFrom(q.expires) <= 7 ? 'Expires soon' : 'Sent' }))} more={{ to: '/sales/quotes?view=expiring', label: 'All expiring quotes' }} />
));
add('sa-followups', 'Follow-ups due', 'List', 'CRM', 'm', () => (
  <WList items={SF.activities.filter((a) => a.status === 'Open' && a.due <= addDays(TODAY, 3)).slice(0, 5).map((a) => ({ id: a.id, title: a.subject, meta: `${a.customer} · ${relDue(a.due)}` }))} more={{ to: '/sales/activities?view=open', label: 'All activities' }} />
));

// Finance manager
add('fi-cash', 'Cash', 'Figure', 'Finance', 's', () => <Kpi label="Cash" value={compactMoney(cash)} note="Operating, tax and card" to="/finance/banking" />);
add('fi-ar', 'Receivables', 'Figure', 'Finance', 's', () => <Kpi label="Receivables" value={compactMoney(receivables)} note={`${SF.invoices.filter((v) => v.status === 'Overdue').length} invoices overdue`} tone="warning" to="/finance/invoices?view=unpaid" />);
add('fi-ap', 'Payables', 'Figure', 'Finance', 's', () => <Kpi label="Payables" value={compactMoney(payables)} note="Bills not yet paid" to="/finance/bills" />);
add('fi-gst', 'GST payable', 'Figure', 'Finance', 's', () => <Kpi label="GST payable" value={money(SF.gstPeriods[0].gstOnSales - SF.gstPeriods[0].gstOnPurchases)} note="October worksheet" to="/finance/gst-bas" />);
add('fi-forecast', 'Cash forecast', 'Chart', 'Finance', 'm', () => {
  const wk = Array.from({ length: 13 }, (_, i) => `${fmtDate(addDays(TODAY, i * 7)).slice(0, -5)}`);
  const vals = wk.map((_, i) => 571_000 + i * 9_400 - (i % 4 === 1 ? 88_000 : 0) + Math.round(Math.sin(i) * 14_000));
  return (
    <ChartFrame headers={['Week starting', 'Forecast cash']} rows={wk.map((w, i) => [w, money(vals[i])])}>
      <LineChart label="Cash forecast, next 13 weeks" labels={wk} series={[{ name: 'Forecast cash', values: vals }]} format={compactMoney} area />
    </ChartFrame>
  );
});
add('fi-overdue', 'Overdue invoices', 'List', 'Finance', 'm', () => (
  <WList items={SF.invoices.filter((v) => v.status === 'Overdue').map((v) => ({ id: v.id, title: v.customer, meta: `${money(v.balance)} · ${relDue(v.due)}`, status: 'Overdue' }))} empty="No overdue invoices." more={{ to: '/finance/invoices?view=overdue', label: 'All overdue invoices' }} />
));
add('fi-bills', 'Bills due', 'List', 'Finance', 'm', () => (
  <WList items={SF.bills.filter((b) => b.status !== 'Paid' && b.due <= addDays(TODAY, 14)).slice(0, 5).map((b) => ({ id: b.id, title: b.supplier, meta: `${money(b.total)} · due ${fmtDate(b.due)}`, status: b.status }))} more={{ to: '/finance/bills', label: 'All bills' }} />
));
add('fi-approvals', 'Finance approvals', 'List', 'Finance', 'm', () => <ApprovalsWaiting modules={['Finance', 'System']} />);

// Accountant
add('ac-unrec', 'Unreconciled lines', 'Figure', 'Finance', 's', () => <Kpi label="Unreconciled lines" value={String(SF.statementLines.filter((l) => l.status === 'To match').length)} note="Operating account" tone="warning" to="/finance/banking" />);
add('ac-journals', 'Journals this month', 'Figure', 'Finance', 's', () => <Kpi label="Journals this month" value="42" note="Including 6 manual" to="/finance/accounting" />);
add('ac-lock', 'Period lock date', 'Figure', 'Finance', 's', () => <Kpi label="Period lock date" value="31 Oct 2026" note="October is closed" tone="success" to="/finance/accounting" />);
add('ac-ageing', 'Receivables ageing', 'Chart', 'Finance', 'm', () => {
  const buckets = ['Current', '1–30', '31–60', '61–90', '90+'];
  const vals = [0, 0, 0, 0, 0];
  SF.invoices.filter((v) => v.balance > 0).forEach((v) => {
    const d = -daysFrom(v.due);
    vals[d <= 0 ? 0 : d <= 30 ? 1 : d <= 60 ? 2 : d <= 90 ? 3 : 4] += v.balance;
  });
  return (
    <ChartFrame headers={['Days overdue', 'Balance']} rows={buckets.map((b, i) => [b, money(vals[i])])}>
      <BarChart label="Receivables by days overdue" labels={buckets} series={[{ name: 'Balance', values: vals }]} format={compactMoney} />
    </ChartFrame>
  );
});
add('ac-match', 'Statement lines to match', 'List', 'Finance', 'm', () => (
  <WList items={SF.statementLines.filter((l) => l.status === 'To match').slice(0, 5).map((l) => ({ id: l.id, title: l.description, meta: `${money(l.amount, true)} · ${fmtDate(l.date)}`, to: '/finance/banking' }))} more={{ to: '/finance/banking', label: 'Reconcile in Banking' }} />
));
add('ac-drafts', 'Draft documents', 'List', 'Finance', 'm', () => (
  <WList items={[...SF.invoices.filter((v) => v.status === 'Draft'), ...SF.creditNotes.filter((v) => v.status === 'Draft')].map((v) => ({ id: v.id, title: v.customer, meta: money(v.total), status: 'Draft' }))} />
));

// Engineer
add('en-ecos', 'Open engineering changes', 'Figure', 'System', 's', () => <Kpi label="Open engineering changes" value={String(OP.ecos.filter((e) => !['Released', 'Rejected'].includes(e.status)).length)} note="ECO-0046 in review" to="/engineering/changes" />);
add('en-boms', 'BOMs in review', 'Figure', 'System', 's', () => <Kpi label="BOMs in review" value={String(OP.boms.filter((b) => b.status === 'In review').length)} note="Revision C of PRD-1001" to="/products/boms?view=review" />);
add('en-drawings', 'Drawings pending', 'Figure', 'CAD Automation', 's', () => <Kpi label="Drawings pending" value={String(OP.drawings.filter((d) => d.status === 'In review').length)} note="Waiting for approval" to="/engineering/drawings" />);
add('en-changes', 'Changes by status', 'Chart', 'System', 'm', () => {
  const st = ['In review', 'Awaiting approval', 'Released', 'Rejected'];
  return <HBarChart label="Engineering changes by status" items={st.map((s) => ({ label: s, value: OP.ecos.filter((e) => e.status === s).length }))} format={(n) => String(Math.round(n))} />;
});
add('en-tasks', 'My engineering tasks', 'List', 'Project Management', 'm', () => (
  <WList items={OP.tasks.filter((t) => t.assignee === 'Tom Walsh' && t.status !== 'Done').map((t) => ({ id: t.id, title: t.title, meta: relDue(t.due), status: t.status }))} more={{ to: '/projects/my-tasks', label: 'All tasks' }} />
));
add('cad-status', 'CAD Automation', 'Figure', 'CAD Automation', 's', () => {
  const on = OP.cadComputers.filter((c) => c.status === 'Online').length;
  const busy = OP.cadJobs.filter((j) => ['Running', 'Queued'].includes(j.status)).length;
  return <Kpi label="CAD computers online" value={`${on} of ${OP.cadComputers.length}`} note={`computers online · ${busy} jobs in progress · ${OP.cadConnectors.length} AI connectors`} to="/cad/overview" />;
});
add('en-cad', 'CAD jobs', 'List', 'CAD Automation', 'm', () => <WList items={OP.cadJobs.slice(0, 5).map((j) => ({ id: j.id, title: j.title, status: j.status }))} more={{ to: '/cad/jobs', label: 'All CAD jobs' }} />);

// Procurement manager
add('pr-open', 'Open purchase orders', 'Figure', 'Finance', 's', () => <Kpi label="Open purchase orders" value={String(OP.purchaseOrders.filter((p) => !['Received', 'Closed'].includes(p.status)).length)} note={`${OP.purchaseOrders.filter((p) => p.status === 'Awaiting approval').length} awaiting approval`} to="/procurement/purchase-orders" />);
add('pr-late', 'Late deliveries', 'Figure', 'System', 's', () => <Kpi label="Late deliveries" value={String(OP.purchaseOrders.filter((p) => ['Sent', 'Partly received'].includes(p.status) && p.expected < TODAY).length)} note="Expected date passed" tone="danger" to="/procurement/purchase-orders?view=receipt" />);
add('pr-spend', 'Spend this month', 'Figure', 'Finance', 's', () => <Kpi label="Spend this month" value={compactMoney(OP.purchaseOrders.filter((p) => p.ordered.startsWith(thisMonth)).reduce((s, p) => s + p.total, 0))} note="Purchase orders raised" to="/procurement/performance" />);
add('pr-spend-supplier', 'Spend by supplier', 'Chart', 'System', 'm', () => (
  <HBarChart label="Spend by supplier this year" items={[...OP.suppliers].sort((a, b) => b.spendYtd - a.spendYtd).slice(0, 6).map((s) => ({ label: s.name, value: s.spendYtd }))} format={compactMoney} />
));
add('pr-reqs', 'Requisitions to approve', 'List', 'System', 'm', () => (
  <WList items={OP.requisitions.filter((r) => r.status === 'Awaiting approval').map((r) => ({ id: r.id, title: r.title, meta: `${r.requester} · needed ${fmtDate(r.needed)}`, status: r.status }))} more={{ to: '/procurement/requisitions?view=approval', label: 'All requisitions' }} />
));
add('pr-receipt', 'Purchase orders awaiting receipt', 'List', 'System', 'm', () => (
  <WList items={OP.purchaseOrders.filter((p) => ['Sent', 'Partly received'].includes(p.status)).map((p) => ({ id: p.id, title: p.supplier, meta: `Expected ${fmtDate(p.expected)}`, status: p.expected < TODAY ? 'Late' : p.status }))} />
));

// Production manager
add('pm-wip', 'Work orders in progress', 'Figure', 'System', 's', () => <Kpi label="Work orders in progress" value={String(OP.workOrders.filter((w) => w.status === 'In progress').length)} note={`${OP.workOrders.filter((w) => w.status === 'Released').length} released, waiting to start`} to="/manufacturing/work-orders?view=active" />);
add('pm-late', 'Late work orders', 'Figure', 'System', 's', () => <Kpi label="Late work orders" value={String(OP.workOrders.filter((w) => w.status === 'Delayed').length)} note="Past their due date" tone="danger" to="/manufacturing/work-orders?view=delayed" />);
add('pm-yield', 'Yield', 'Figure', 'System', 's', () => <Kpi label="Yield" value="96.2%" note="First time through, this month" to="/reports/operations" />);
add('pm-capacity', 'Capacity load', 'Figure', 'System', 's', () => <Kpi label="Capacity load" value={`${avgLoad}%`} note="Welding bay at 118%" tone="warning" to="/manufacturing/work-centres" />);
add('pm-load', 'Load by work centre', 'Chart', 'System', 'm', () => <LoadByCentre />);
add('pm-delayed', 'Delayed work orders', 'List', 'System', 'm', () => (
  <WList items={OP.workOrders.filter((w) => w.status === 'Delayed').map((w) => ({ id: w.id, title: `${w.itemName} × ${w.qty}`, meta: `Due ${fmtDate(w.due)}${w.order ? ` · for ${w.order}` : ''}`, status: w.status }))} more={{ to: '/manufacturing/work-orders?view=delayed', label: 'All delayed work orders' }} />
));
add('pm-shortages', 'Shortages', 'List', 'System', 'm', () => (
  <WList
    items={[
      { id: 'RM-2001', title: 'Steel plate 10 mm: short 2 sheets for WO-1042', meta: 'PO-0388 expected 18 Nov', status: 'Short' },
      ...OP.stock.filter((s) => s.status !== 'In stock' && s.item !== 'RM-2001').slice(0, 3).map((s) => ({ id: s.item, title: `${s.name}: ${s.onHand} on hand`, meta: `Reorder point ${s.reorder}`, status: s.status })),
    ]}
  />
));

// Warehouse manager
add('wh-receipts', 'Receipts today', 'Figure', 'System', 's', () => <Kpi label="Receipts today" value={String(OP.receipts.filter((g) => g.date === TODAY).length + 2)} note="Two more expected this afternoon" to="/inventory/receipts" />);
add('wh-picks', 'Picks waiting', 'Figure', 'System', 's', () => <Kpi label="Picks waiting" value="6" note="For three sales orders" to="/sales/orders?view=open" />);
add('wh-value', 'Stock value', 'Figure', 'System', 's', () => <Kpi label="Stock value" value={compactMoney(OP.stock.reduce((s, x) => s + x.value, 0))} note="Both warehouses" to="/inventory/stock" />);
add('wh-counts', 'Counts due', 'Figure', 'System', 's', () => <Kpi label="Counts due" value={String(OP.counts.filter((c) => c.status === 'Scheduled').length)} note="Next: Zone B tomorrow" to="/inventory/counts" />);
add('wh-movements', 'Movements by day', 'Chart', 'System', 'm', () => {
  const days = Array.from({ length: 7 }, (_, i) => fmtDate(addDays(TODAY, i - 6)).slice(0, -5));
  const rec = [8, 5, 0, 0, 9, 7, 11];
  const iss = [12, 9, 0, 0, 14, 10, 8];
  return (
    <ChartFrame headers={['Day', 'Receipts', 'Issues']} rows={days.map((d, i) => [d, rec[i], iss[i]])} legend={<Legend items={[{ name: 'Receipts', cls: 'erp-s1' }, { name: 'Issues', cls: 'erp-s2' }]} />}>
      <BarChart label="Stock movements by day, last 7 days" labels={days} series={[{ name: 'Receipts', values: rec }, { name: 'Issues', values: iss }]} format={(n) => String(Math.round(n))} />
    </ChartFrame>
  );
});
add('wh-putaway', 'Goods received to put away', 'List', 'System', 'm', () => (
  <WList items={OP.receipts.filter((g) => g.status === 'Awaiting put-away').map((g) => ({ id: g.id, title: g.supplier, meta: `Received ${fmtDate(g.date)} · ${g.po}`, status: g.status }))} more={{ to: '/inventory/receipts?view=putaway', label: 'All receipts awaiting put-away' }} />
));
add('wh-low', 'Low stock', 'List', 'System', 'm', () => (
  <WList items={OP.stock.filter((s) => s.status !== 'In stock').slice(0, 5).map((s) => ({ id: s.id, title: s.name, meta: `${s.onHand} on hand · reorder at ${s.reorder}`, status: s.status }))} more={{ to: '/inventory/stock?view=low', label: 'All low stock' }} />
));

// Quality manager
add('qa-due', 'Inspections due', 'Figure', 'System', 's', () => <Kpi label="Inspections due" value={String(OP.inspections.filter((i) => ['Scheduled', 'Open', 'Awaiting review'].includes(i.status)).length)} note="Today and scheduled" to="/quality/inspections?view=today" />);
add('qa-ncrs', 'Open nonconformances', 'Figure', 'System', 's', () => <Kpi label="Open nonconformances" value={String(openNcrs.length)} note="NCR-0121 holds a late order" tone="warning" to="/quality/nonconformances?view=open" />);
add('qa-fpy', 'First-pass yield', 'Figure', 'System', 's', () => <Kpi label="First-pass yield" value={`${((passed / Math.max(1, passed + failed)) * 100).toFixed(1)}%`} note="Inspections passed first time" to="/quality/inspections" />);
add('qa-capa', 'Corrective actions overdue', 'Figure', 'System', 's', () => <Kpi label="Corrective actions overdue" value={String(OP.capas.filter((c) => c.status === 'Overdue').length)} note="CAPA-029" tone="danger" to="/quality/corrective-actions" />);
add('qa-causes', 'Nonconformances by cause', 'Chart', 'System', 'm', () => {
  const causes = Array.from(new Set(OP.ncrs.map((n) => n.cause)));
  return <HBarChart label="Nonconformances by cause, last 90 days" items={causes.map((c) => ({ label: c, value: OP.ncrs.filter((n) => n.cause === c).length })).sort((a, b) => b.value - a.value)} format={(n) => String(Math.round(n))} />;
});
add('qa-today', 'Inspections today', 'List', 'System', 'm', () => (
  <WList items={OP.inspections.filter((i) => ['Open', 'Awaiting review', 'Scheduled'].includes(i.status)).map((i) => ({ id: i.id, title: `${i.type} of ${i.subject}`, meta: `${fmtDate(i.date)} · ${i.inspector}`, status: i.status }))} more={{ to: '/quality/inspections?view=today', label: 'All open inspections' }} />
));
add('qa-open-ncrs', 'Open nonconformances list', 'List', 'System', 'm', () => <WList items={openNcrs.map((n) => ({ id: n.id, title: n.title, meta: `${n.source} · ${n.disposition}`, status: n.status }))} />);

// Project manager
add('pj-active', 'Projects active', 'Figure', 'Project Management', 's', () => <Kpi label="Projects active" value={String(OP.projects.filter((p) => !['Completed', 'Not started'].includes(p.status)).length)} note="Two at risk or late" tone="warning" to="/projects/projects" />);
add('pj-overdue', 'Tasks overdue', 'Figure', 'Project Management', 's', () => <Kpi label="Tasks overdue" value={String(OP.tasks.filter((t) => t.due < TODAY && t.status !== 'Done').length)} note="Across all projects" tone="danger" to="/projects/my-tasks?view=overdue" />);
add('pj-budget', 'Budget used', 'Figure', 'Company', 's', () => {
  const b = OP.projects.reduce((s, p) => s + p.budget, 0);
  const sp = OP.projects.reduce((s, p) => s + p.spent, 0);
  return <Kpi label="Budget used" value={`${Math.round((sp / b) * 100)}%`} note={`${compactMoney(sp)} of ${compactMoney(b)}`} to="/projects/costs" />;
});
add('pj-burndown', 'Burn-down', 'Chart', 'Project Management', 'm', () => {
  const days = Array.from({ length: 10 }, (_, i) => fmtDate(addDays('2026-11-02', i * 2)).slice(0, -5));
  const ideal = days.map((_, i) => Math.round(120 - (120 / 9) * i));
  const actual = [120, 116, 108, 104, 101, 96, 90, 88, 86, 84];
  return (
    <ChartFrame headers={['Day', 'Remaining (h)', 'Ideal (h)']} rows={days.map((d, i) => [d, actual[i], ideal[i]])} legend={<Legend items={[{ name: 'Remaining', cls: 'erp-s1' }, { name: 'Ideal', cls: 'erp-s2', dashed: true }]} />}>
      <LineChart label="Burn-down of PRJ-031, hours remaining" labels={days} series={[{ name: 'Remaining', values: actual }, { name: 'Ideal', values: ideal }]} format={(n) => `${Math.round(n)} h`} />
    </ChartFrame>
  );
});
add('pj-overdue-list', 'Overdue tasks', 'List', 'Project Management', 'm', () => (
  <WList items={OP.tasks.filter((t) => t.due < TODAY && t.status !== 'Done').map((t) => ({ id: t.id, title: t.title, meta: `${t.assignee} · ${relDue(t.due)}`, status: 'Overdue' }))} more={{ to: '/projects/my-tasks?view=overdue', label: 'All overdue tasks' }} />
));
add('pj-milestones', 'Milestones this week', 'List', 'Project Management', 'm', () => <WList items={OP.milestones.map((m) => ({ id: m.project, title: m.name, meta: fmtDate(m.date) }))} />);

// Administrator
add('ad-people', 'People', 'Figure', 'Company', 's', () => <Kpi label="People" value={String(PEOPLE.filter((p) => p.status === 'Active').length)} note="Active accounts" to="/administration/people" />);
add('ad-invites', 'Pending invitations', 'Figure', 'Company', 's', () => <Kpi label="Pending invitations" value={String(INVITATIONS.length)} note="Oldest sent 3 Nov" to="/administration/people" />);
add('ad-modules', 'Modules on', 'Figure', 'Company', 's', () => <Kpi label="Modules on" value={`${ADMIN_MODULES.filter((m) => m.on).length} of ${ADMIN_MODULES.length}`} note="Tools and modules" to="/administration/modules" />);
add('ad-failed', 'Failed sign-ins', 'Figure', 'Company', 's', () => <Kpi label="Failed sign-ins" value="3" note="This week, none locked out" tone="success" to="/administration/audit" />);
add('ad-active', 'Active users by week', 'Chart', 'Company', 'm', () => {
  const vals = [14, 15, 15, 16, 17, 16, 18, 19];
  return (
    <ChartFrame headers={['Week', 'Active users']} rows={weeks8.map((w, i) => [w, vals[i]])}>
      <BarChart label="Active users by week" labels={weeks8} series={[{ name: 'Active users', values: vals }]} format={(n) => String(Math.round(n))} />
    </ChartFrame>
  );
});
add('ad-invitations', 'Invitations', 'List', 'Company', 'm', () => <WList items={INVITATIONS.map((i) => ({ id: i.name, title: `${i.role}, ${i.email}`, meta: `Sent ${fmtDate(i.sent)}`, status: 'Invited', to: '/administration/people' }))} />);
add('ad-requests', 'Access requests', 'List', 'Company', 'm', () => <WList items={ACCESS_REQUESTS.map((i) => ({ id: i.name, title: i.wants, meta: `${i.reason} · ${fmtDate(i.date)}`, status: 'Pending', to: '/administration/people?tab=roles' }))} />);

// Shared
add('mywork', 'My Work summary', 'List', 'My Work', 's', () => <MyWorkSummary />);
add('notices', 'Latest notifications', 'List', 'System', 'm', () => <Notices />);
function Notices() {
  const { notices } = useErp();
  return (
    <ul className="erp-wlist">
      {notices.slice(0, 4).map((n) => (
        <li key={n.id}>
          <Link to={n.to} className="erp-wlist-link">
            <span className="erp-wlist-main">
              <ModuleBadge module={n.module} />
              <span className="erp-wlist-title">{n.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const WIDGETS: Record<string, WidgetDef> = Object.fromEntries(W.map((w) => [w.id, w]));
export const WIDGET_LIST = W;

const L = (...items: [string, Size?][]) => items.map(([id, size]) => ({ id, size: size ?? WIDGETS[id].size }));
export const DEFAULT_LAYOUTS: Record<RoleId, { id: string; size: Size }[]> = {
  ceo: L(['ceo-revenue'], ['ceo-margin'], ['ceo-cash'], ['ceo-late'], ['ceo-revenue-target'], ['ceo-delayed'], ['ceo-intake'], ['approvals'], ['cad-status'], ['ceo-top-customers', 'f']),
  executive: L(['ex-otd'], ['ex-open-orders'], ['ex-utilisation'], ['ex-ncrs'], ['ex-throughput'], ['ceo-delayed'], ['cad-status'], ['ex-escalations', 'f']),
  sales: L(['sa-pipeline'], ['sa-winrate'], ['sa-quotes'], ['sa-orders'], ['sa-pipeline-stage'], ['sa-expiring'], ['sa-followups', 'f']),
  finance: L(['fi-cash'], ['fi-ar'], ['fi-ap'], ['fi-gst'], ['fi-forecast'], ['fi-overdue'], ['fi-bills'], ['fi-approvals']),
  accountant: L(['ac-unrec'], ['ac-journals'], ['ac-lock'], ['mywork'], ['ac-ageing'], ['ac-match'], ['ac-drafts', 'f']),
  engineer: L(['cad-status'], ['en-ecos'], ['en-boms'], ['en-drawings'], ['en-changes'], ['en-tasks'], ['mywork'], ['en-cad', 'f']),
  procurement: L(['pr-open'], ['pr-late'], ['pr-spend'], ['mywork'], ['pr-spend-supplier'], ['pr-reqs'], ['pr-receipt', 'f']),
  production: L(['pm-wip'], ['pm-late'], ['pm-yield'], ['pm-capacity'], ['pm-load'], ['pm-delayed'], ['pm-shortages', 'f']),
  warehouse: L(['wh-receipts'], ['wh-picks'], ['wh-value'], ['wh-counts'], ['wh-movements'], ['wh-putaway'], ['wh-low', 'f']),
  quality: L(['qa-due'], ['qa-ncrs'], ['qa-fpy'], ['qa-capa'], ['qa-causes'], ['qa-today'], ['qa-open-ncrs', 'f']),
  project: L(['pj-active'], ['pj-overdue'], ['pj-budget'], ['mywork'], ['pj-burndown'], ['pj-overdue-list'], ['pj-milestones', 'f']),
  admin: L(['ad-people'], ['ad-invites'], ['ad-modules'], ['cad-status'], ['ad-failed'], ['ad-active'], ['ad-invitations'], ['ad-requests', 'f']),
};
