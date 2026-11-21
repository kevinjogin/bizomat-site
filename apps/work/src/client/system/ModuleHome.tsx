// The ERP dashboard's progress of every module, and the overview pages of Engineering and Warehouse (owner, 20 Nov 2026:
// "Main Dashboard ... need to show all modules progress within company"). Every figure comes from the module's own summary
// on the server (erp/index.ts /overview and /operations, maintenance/index.ts /overview), which decides what this person
// may see; a module the person cannot open shows what it holds, without figures.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { PageHeader } from '../components/ui/ui';
import { localToday } from './maintenance/api';

interface ProductCounts {
  products: { total: number; active: number; unreleased: number };
  changeOrders: { draft: number; submitted: number; approved: number };
  changeRequests: { open: number };
  documents: { total: number; draft: number };
}
export interface OperationsCounts {
  requisitions: { draft: number; submitted: number; approved: number };
  rfqs: { open: number; awarded: number };
  purchaseOrders: { draft: number; awaitingApproval: number; toReceive: number };
  receipts: { last30Days: number; inspection: number };
  stock: { belowReorder: number; pendingAdjustments: number; openCounts: number; countsToApprove: number; warehouses: number; valueCents: number };
  manufacturing?: { draft: number; released: number; inProgress: number; toClose: number; late: number; inspections: number; suggestions: { make: number; buy: number; expedite: number } };
  quality?: { toInspect: number; openInspections: number; openNcrs: number; ncrsToDisposition: number; capasToApprove: number; overdueCapas: number };
  supplyChain?: { ordersDraft: number; ordersToAllocate: number; ordersLate: number; toPick: number; toPack: number; toDispatch: number; inTransit: number; toInvoice: number; returnsToAuthorise: number; returnsToReceive: number };
}
interface MaintenanceCounts {
  role: 'admin' | 'supervisor' | 'technician' | 'requester';
  awaitingApproval: number;
  openRequests: number;
  openWorkOrders: number;
  overdue: number;
  inProgress: number;
  assets: number;
  assetsDown: number;
  preventiveOpen: number;
  preventiveOverdue: number;
  newRequests: number;
  infoRequested: number;
  myRequests: number;
  myWork: number;
  dueThisWeek: number;
}

const enc = encodeURIComponent;
const useProductCounts = (id: string, on: boolean) => useQuery({ queryKey: ['erp', id, 'overview'], queryFn: () => get<ProductCounts>(`/erp/c/${enc(id)}/overview`), enabled: on, retry: false, staleTime: 60_000 });
export const useOperationsCounts = (id: string, on: boolean) => useQuery({ queryKey: ['erp', id, 'operations'], queryFn: () => get<OperationsCounts>(`/erp/c/${enc(id)}/operations`), enabled: on, retry: false, staleTime: 60_000 });
// The same query (and key) as the Maintenance overview, so the two share one answer: the person's own date.
const useMaintenanceCounts = (id: string, on: boolean) => {
  const today = localToday();
  return useQuery({ queryKey: ['mt', id, 'overview', today], queryFn: () => get<MaintenanceCounts>(`/maintenance/c/${enc(id)}/overview?today=${today}`), enabled: on, retry: false, staleTime: 60_000 });
};

const n = (v: number | undefined | null) => (v ?? 0).toLocaleString();
const dollars = (cents: number | undefined) => `$${Math.round((cents ?? 0) / 100).toLocaleString()}`;

type Figure = [label: string, value: string, warn?: boolean];

/** The Maintenance card's figures for the person's maintenance role (the server counts only what they may see). */
function maintenanceFigures(m: MaintenanceCounts): Figure[] {
  if (m.role === 'admin' || m.role === 'supervisor') {
    return [
      ['Open work orders', n(m.openWorkOrders)],
      ['Overdue', n(m.overdue), m.overdue > 0],
      ['Due this week', n(m.dueThisWeek)],
      ['Requests to approve', n(m.awaitingApproval), m.awaitingApproval > 0],
      ...(m.newRequests > 0 ? ([['New requests', n(m.newRequests)]] as Figure[]) : []),
      ['Assets down', n(m.assetsDown), m.assetsDown > 0],
    ];
  }
  if (m.role === 'technician') {
    return [
      ['My work', n(m.myWork)],
      ['Overdue', n(m.overdue), m.overdue > 0],
      ['Due this week', n(m.dueThisWeek)],
      ['My open requests', n(m.myRequests)],
    ];
  }
  return [
    ['My open requests', n(m.myRequests)],
    ['Waiting for your answer', n(m.infoRequested), m.infoRequested > 0],
    ['Work orders on my requests', n(m.openWorkOrders)],
  ];
}

/** One module's card on the dashboard: its figures, or what it holds when this person has none to see. */
function ModuleCard({ icon, title, to, what, figures, loading }: { icon: string; title: string; to: string; what: string; figures: Figure[] | null; loading: boolean }) {
  return (
    <section className="card card-pad co-tool-card sys-tool-card erp-module-card">
      <div className="row">
        <Icon name={icon} /> <strong className="grow ellipsis">{title}</strong>
        <Link className="btn sm" to={to}>Open</Link>
      </div>
      <p className="muted small">{what}</p>
      {figures ? (
        <dl className="co-figures">
          {figures.map(([label, value, warn]) => (
            <div key={label}><dt>{label}</dt><dd className={warn ? 'warning-text' : ''}>{value}</dd></div>
          ))}
        </dl>
      ) : loading ? (
        <p className="muted small">Loading figures…</p>
      ) : null}
    </section>
  );
}

/** The ERP modules' cards on a company's dashboard, in the order of the module rail. */
export function ModuleProgress({ companyId, guest }: { companyId: string; guest: boolean }) {
  const on = !guest;
  const p = useProductCounts(companyId, on);
  const o = useOperationsCounts(companyId, on);
  const m = useMaintenanceCounts(companyId, on);
  if (guest) return null;
  const base = `/c/${companyId}`;
  const ops = o.data;
  const eng: Figure[] | null = p.data || ops ? [
    ['Open change requests', n(p.data?.changeRequests.open)],
    ['Change orders to approve', n(p.data?.changeOrders.submitted)],
    ['Orders in production', n(ops?.manufacturing?.inProgress), false],
    ['Orders late', n(ops?.manufacturing?.late), !!ops?.manufacturing?.late],
    ['Open nonconformances', n(ops?.quality?.openNcrs), !!ops?.quality?.openNcrs],
    ['Waiting for inspection', n(ops?.quality?.toInspect)],
  ] : null;
  return (
    <>
      <ModuleCard
        icon="diamond" title="Product Management" to={`${base}/products`} loading={p.isLoading}
        what="Your products and variants, their lifecycle and released revisions."
        figures={p.data ? [
          ['Products', n(p.data.products.total)],
          ['Active', n(p.data.products.active)],
          ['Without a released revision', n(p.data.products.unreleased), p.data.products.unreleased > 0],
          ['Documents in draft', n(p.data.documents.draft)],
        ] : null}
      />
      <ModuleCard
        icon="bolt" title="Engineering" to={`${base}/engineering`} loading={p.isLoading || o.isLoading}
        what="Design changes and documents, CAD Automation, manufacturing and quality."
        figures={eng}
      />
      <ModuleCard
        icon="inbox" title="Procurement" to={`${base}/procurement`} loading={o.isLoading}
        what="Suppliers, requisitions, quotations, purchase orders and receipts."
        figures={ops ? [
          ['Requisitions to approve', n(ops.requisitions.submitted), ops.requisitions.submitted > 0],
          ['Purchase orders to approve', n(ops.purchaseOrders.awaitingApproval), ops.purchaseOrders.awaitingApproval > 0],
          ['Purchase orders to receive', n(ops.purchaseOrders.toReceive)],
          ['Receipts in 30 days', n(ops.receipts.last30Days)],
        ] : null}
      />
      <ModuleCard
        icon="archive" title="Warehouse" to={`${base}/warehouse`} loading={o.isLoading}
        what="Stock, warehouses, movements and counts; sales orders, picking, dispatch and returns."
        figures={ops ? [
          ['Stock value', dollars(ops.stock.valueCents)],
          ['Products to reorder', n(ops.stock.belowReorder), ops.stock.belowReorder > 0],
          ['Orders to allocate', n(ops.supplyChain?.ordersToAllocate)],
          ['To pick, pack or dispatch', n((ops.supplyChain?.toPick ?? 0) + (ops.supplyChain?.toPack ?? 0) + (ops.supplyChain?.toDispatch ?? 0))],
        ] : null}
      />
      <ModuleCard
        icon="wrench" title="Maintenance" to={`${base}/maintenance`} loading={m.isLoading}
        what="Requests, work orders, assets, preventive maintenance and inspections."
        figures={m.data ? maintenanceFigures(m.data) : null}
      />
    </>
  );
}

function Section({ title, icon, to, label, children }: { title: string; icon: string; to: string; label: string; children: ReactNode }) {
  return (
    <section className="card card-pad stack">
      <div className="row">
        <Icon name={icon} /> <h2 className="crm-subhead grow">{title}</h2>
        <Link className="btn sm" to={to}>{label}</Link>
      </div>
      {children}
    </section>
  );
}

function Stats({ items }: { items: [label: string, value: string, to: string][] }) {
  return (
    <div className="sys-stats">
      {items.map(([label, value, to]) => (
        <Link key={label} to={to} className="card card-pad sys-stat">
          <strong>{value}</strong>
          <span className="muted small">{label}</span>
        </Link>
      ))}
    </div>
  );
}

/** Engineering's overview: Design, CAD Automation, Manufacturing and Quality, with what waits in each. */
export function EngineeringHome({ companyId, companyName, cad }: { companyId: string; companyName: string; cad: boolean }) {
  usePageTitle('Engineering');
  const p = useProductCounts(companyId, true);
  const o = useOperationsCounts(companyId, true);
  const base = `/c/${companyId}`;
  const mfg = o.data?.manufacturing;
  const q = o.data?.quality;
  return (
    <div className="page crm-page">
      <PageHeader title="Engineering" subtitle={`Design, CAD Automation, manufacturing and quality for ${companyName}.`} />
      <Section title="Design" icon="history" to={`${base}/products/changes`} label="Engineering changes">
        <p className="muted small">Engineering changes (requests and orders, approved and released by someone who did not draft them), bills of materials and revisions on each product, and engineering documents.</p>
        {p.data ? (
          <Stats items={[
            [`Change requests open`, n(p.data.changeRequests.open), `${base}/products/changes`],
            [`Change orders to approve`, n(p.data.changeOrders.submitted), `${base}/products/changes`],
            [`Documents in draft`, n(p.data.documents.draft), `${base}/products/documents`],
          ]} />
        ) : null}
      </Section>
      <Section title="CAD Automation" icon="bolt" to={cad ? `${base}/cad` : `${base}/products/cad`} label="Open CAD Automation">
        <p className="muted small">Your AI assistant builds native SOLIDWORKS parts, assemblies and drawings on your own computers: set-up, computers, AI assistants, history and exports.</p>
      </Section>
      <Section title="Manufacturing" icon="layers" to={`${base}/manufacturing`} label="Orders">
        <p className="muted small">Manufacturing orders from release to close, the shop floor, planning with MRP and capacity, work centres and routings.</p>
        {mfg ? (
          <Stats items={[
            ['Orders to release', n(mfg.draft), `${base}/manufacturing?status=draft`],
            ['In production', n(mfg.inProgress), `${base}/manufacturing`],
            ['Late', n(mfg.late), `${base}/manufacturing?late=1`],
            ['MRP suggestions open', n(mfg.suggestions.make + mfg.suggestions.buy + mfg.suggestions.expedite), `${base}/manufacturing/planning`],
          ]} />
        ) : null}
      </Section>
      <Section title="Quality" icon="checkSquare" to={`${base}/quality`} label="Quality overview">
        <p className="muted small">Inspection plans, inspections from receipt to finished goods, nonconformances and corrective actions.</p>
        {q ? (
          <Stats items={[
            ['Waiting for inspection', n(q.toInspect), `${base}/quality`],
            ['Nonconformances to disposition', n(q.ncrsToDisposition), `${base}/quality/ncrs?status=open`],
            ['Corrective actions overdue', n(q.overdueCapas), `${base}/quality/capas?overdue=1`],
          ]} />
        ) : null}
      </Section>
    </div>
  );
}

/** Warehouse's overview: Stock (Inventory) and Orders and dispatch (Supply Chain), with what waits in each. */
export function WarehouseHome({ companyId, companyName }: { companyId: string; companyName: string }) {
  usePageTitle('Warehouse');
  const o = useOperationsCounts(companyId, true);
  const base = `/c/${companyId}`;
  const d = o.data;
  const sc = d?.supplyChain;
  return (
    <div className="page crm-page">
      <PageHeader title="Warehouse" subtitle={`Stock and dispatch for ${companyName}: what is where, every movement and count, and every order from allocation to delivery.`} />
      <Section title="Stock" icon="layers" to={`${base}/inventory`} label="Stock">
        <p className="muted small">Warehouses and locations, stock by lot and serial, movements, adjustments, counts and valuation, and the warehouse screen for phones.</p>
        {d ? (
          <Stats items={[
            ['Stock value', dollars(d.stock.valueCents), `${base}/inventory/valuation`],
            ['Products to reorder', n(d.stock.belowReorder), `${base}/erp-reports/shortages`],
            ['Adjustments to approve', n(d.stock.pendingAdjustments), `${base}/inventory/adjustments`],
            ['Counts to approve', n(d.stock.countsToApprove), `${base}/inventory/counts`],
          ]} />
        ) : null}
      </Section>
      <Section title="Orders and dispatch" icon="globe" to={`${base}/supply-chain`} label="Dispatch overview">
        <p className="muted small">Sales orders and allocation, pick, pack and dispatch, shipments and deliveries, returns and carriers.</p>
        {sc ? (
          <Stats items={[
            ['Orders to allocate', n(sc.ordersToAllocate), `${base}/supply-chain/orders?status=confirmed`],
            ['To pick, pack or dispatch', n(sc.toPick + sc.toPack + sc.toDispatch), `${base}/supply-chain/floor`],
            ['In transit', n(sc.inTransit), `${base}/supply-chain/shipments`],
            ['Returns to authorise or receive', n(sc.returnsToAuthorise + sc.returnsToReceive), `${base}/supply-chain/returns?status=open`],
          ]} />
        ) : null}
      </Section>
    </div>
  );
}
