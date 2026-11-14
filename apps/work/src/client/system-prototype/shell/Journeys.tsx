// Guided journeys: the ten scenarios of the information architecture (section 8). Each step is a link that opens the
// right screen and highlights the row, tab or widget to look at. The panel is not modal, so the screens stay usable.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PHONE, useMedia } from '../format';
import { PIcon } from '../icons';
import { roleById } from '../nav';
import { useErp } from '../state';
import type { RoleId } from '../types';

export interface JourneyStep {
  label: string;
  to?: string;
  hl?: string;
  role?: RoleId;
  search?: string;
}
export interface Journey {
  n: number;
  title: string;
  role?: RoleId;
  shows: string;
  steps: JourneyStep[];
}

export const JOURNEYS: Journey[] = [
  {
    n: 1,
    title: 'CEO finds delayed orders',
    role: 'ceo',
    shows: 'A role dashboard, a list widget that drills down to its record, and the reason a record is late.',
    steps: [
      { label: 'Open Home as the CEO', to: '/', hl: 'widget-ceo-delayed', role: 'ceo' },
      { label: 'Find SO-1048 in "Delayed orders"', to: '/', hl: 'SO-1048' },
      { label: 'Open sales order SO-1048 and read why it is late', to: '/sales/orders/SO-1048', hl: 'delay-reason' },
    ],
  },
  {
    n: 2,
    title: "Sales manager reviews a customer's quotation",
    role: 'sales',
    shows: 'Global search grouped by type, a customer record with its own tabs, and a quote from Finance shown inside the ERP.',
    steps: [
      { label: 'Search for "Harbour"', search: 'Harbour', role: 'sales' },
      { label: 'Open the customer Harbour Builders', to: '/sales/customers/CUS-001', hl: 'record-header' },
      { label: 'Open the Quotes tab and find QU-0107', to: '/sales/customers/CUS-001?tab=quotes', hl: 'QU-0107' },
      { label: 'Open quote QU-0107', to: '/sales/quotes/QU-0107', hl: 'record-header' },
    ],
  },
  {
    n: 3,
    title: "Accountant checks an invoice's payment status",
    role: 'accountant',
    shows: 'A Working Finance list inside the ERP, the record pattern and the payments panel.',
    steps: [
      { label: 'Open Finance, Invoices', to: '/finance/invoices', hl: 'INV-2291', role: 'accountant' },
      { label: 'Open INV-2291 and read the payments panel', to: '/finance/invoices/INV-2291', hl: 'payments-panel' },
      { label: 'Open the Payments tab to record a payment', to: '/finance/invoices/INV-2291?tab=payments', hl: 'payments-tab' },
    ],
  },
  {
    n: 4,
    title: 'Engineer reviews a BOM revision',
    role: 'engineer',
    shows: 'The product master, the BOM tree with revisions and the compare view.',
    steps: [
      { label: 'Open Products & Engineering, Products', to: '/products/products', hl: 'PRD-1001', role: 'engineer' },
      { label: 'Open PRD-1001 and its BOM tab', to: '/products/products/PRD-1001?tab=bom', hl: 'tab-bom' },
      { label: 'Choose revision C', to: '/products/products/PRD-1001?tab=bom&rev=C', hl: 'rev-C' },
      { label: 'Compare revision C with B', to: '/products/products/PRD-1001?tab=bom&rev=C&compare=1', hl: 'bom-compare' },
    ],
  },
  {
    n: 5,
    title: 'Procurement manager finds a pending purchase order',
    role: 'procurement',
    shows: 'Saved views on a list and the workflow and approval pattern.',
    steps: [
      { label: 'Open Procurement, Purchase orders', to: '/procurement/purchase-orders', hl: 'view-approval', role: 'procurement' },
      { label: 'Choose the saved view "Awaiting approval"', to: '/procurement/purchase-orders?view=approval', hl: 'PO-0388' },
      { label: 'Open PO-0388 and approve or return it', to: '/procurement/purchase-orders/PO-0388', hl: 'approval' },
    ],
  },
  {
    n: 6,
    title: 'Warehouse operator reviews goods received',
    role: 'warehouse',
    shows: 'A planned module list and a goods receipt with short and rejected quantities.',
    steps: [
      { label: 'Open Inventory & Warehouse, Goods receipts', to: '/inventory/receipts', hl: 'GR-0215', role: 'warehouse' },
      { label: 'Open GR-0215 and check the lines', to: '/inventory/receipts/GR-0215', hl: 'receipt-lines' },
    ],
  },
  {
    n: 7,
    title: 'Production manager finds a delayed work order',
    role: 'production',
    shows: 'The production dashboard, drill-down to a work order, and its operations.',
    steps: [
      { label: 'Open Home as the Production manager', to: '/', hl: 'widget-pm-delayed', role: 'production' },
      { label: 'Find WO-1042 in "Delayed work orders"', to: '/', hl: 'WO-1042' },
      { label: 'Open WO-1042 and read why it is delayed', to: '/manufacturing/work-orders/WO-1042', hl: 'delay-reason' },
      { label: 'Open the Operations tab', to: '/manufacturing/work-orders/WO-1042?tab=operations', hl: 'wo-operations' },
    ],
  },
  {
    n: 8,
    title: 'Quality manager reviews an inspection',
    role: 'quality',
    shows: 'An inspection record and its checklist, built for tablets and phones too.',
    steps: [
      { label: 'Open Quality, Inspections', to: '/quality/inspections', hl: 'INS-0533', role: 'quality' },
      { label: 'Open INS-0533', to: '/quality/inspections/INS-0533', hl: 'record-header' },
      { label: 'Open the Checklist and find the failed check', to: '/quality/inspections/INS-0533?tab=checklist', hl: 'failed-check' },
    ],
  },
  {
    n: 9,
    title: 'Employee completes a task from My Work',
    shows: 'My Work tabs, one primary action per item and the undo.',
    steps: [
      { label: 'Open My Work', to: '/my-work', hl: 'tab-today' },
      { label: 'Choose "Due today" and complete the first task', to: '/my-work?tab=today', hl: 'action-MW-01' },
    ],
  },
  {
    n: 10,
    title: 'Executive generates a performance report',
    role: 'executive',
    shows: 'The report pattern: filters, chart to table to record drill-down, export and saved reports.',
    steps: [
      { label: 'Open Reports & Analytics, Enterprise dashboards', to: '/reports/enterprise', hl: 'report-company-performance', role: 'executive' },
      { label: 'Open the Company performance report', to: '/reports/enterprise/company-performance', hl: 'report-filters' },
      { label: 'Set the filters, for example Department: Sales', to: '/reports/enterprise/company-performance', hl: 'report-department' },
      { label: 'Export the table as CSV', to: '/reports/enterprise/company-performance', hl: 'report-export' },
    ],
  },
];

export function JourneysPanel() {
  const { setJourneyOpen, setHighlight, setRole, role, openSearch, setNavOpen } = useErp();
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(1);
  const [at, setAt] = useState<{ n: number; i: number } | null>(null);
  const phone = useMedia(PHONE);
  // On a phone the panel shrinks to one line after each step, so the highlighted part of the screen stays visible.
  const [small, setSmall] = useState(false);
  const go = (j: Journey, i: number) => {
    const s = j.steps[i];
    setAt({ n: j.n, i });
    if (phone) setSmall(true);
    setNavOpen(false);
    if (s.role && s.role !== role) setRole(s.role);
    setHighlight(s.hl ?? null);
    if (s.search !== undefined) openSearch(s.search);
    if (s.to) navigate(s.to);
  };
  const cur = at ? JOURNEYS.find((j) => j.n === at.n) : null;
  if (phone && small && cur && at)
    return (
      <aside className="erp-journeys small" aria-label="Guided journey">
        <div className="erp-journey-mini">
          <span className="grow small">
            <strong>
              Journey {cur.n}, step {at.i + 1} of {cur.steps.length}
            </strong>
            <br />
            {cur.steps[at.i].label}
          </span>
          {at.i < cur.steps.length - 1 ? (
            <button type="button" className="btn primary sm" onClick={() => go(cur, at.i + 1)}>
              Next
            </button>
          ) : null}
          <button type="button" className="btn sm" onClick={() => setSmall(false)} aria-label="Show all journey steps">
            Steps
          </button>
        </div>
      </aside>
    );
  return (
    <aside className="erp-journeys" aria-labelledby="journeys-title">
      <div className="erp-drawer-head">
        <h2 id="journeys-title" className="grow">
          Guided journeys
        </h2>
        <button
          type="button"
          className="btn ghost icon sm"
          aria-label="Close guided journeys"
          onClick={() => {
            setJourneyOpen(false);
            setHighlight(null);
          }}
        >
          <PIcon name="x" />
        </button>
      </div>
      <div className="erp-journeys-body">
        <p className="muted small">Ten scenarios from the information architecture. Each step opens a screen and highlights what to look at. The panel stays open while you click around.</p>
        <ol className="erp-journey-list">
          {JOURNEYS.map((j) => {
            const expanded = open === j.n;
            return (
              <li key={j.n} className={`erp-journey${expanded ? ' open' : ''}`}>
                <button type="button" className="erp-journey-btn" aria-expanded={expanded} aria-controls={`jn-${j.n}`} onClick={() => setOpen(expanded ? null : j.n)}>
                  <span className="erp-journey-n">{j.n}</span>
                  <span className="grow">{j.title}</span>
                  <PIcon name={expanded ? 'chevronDown' : 'chevronRight'} size={14} />
                </button>
                {expanded ? (
                  <div id={`jn-${j.n}`} className="erp-journey-steps">
                    <p className="small">{j.shows}</p>
                    {j.role ? <p className="muted small">Role: {roleById(j.role).label}</p> : null}
                    <ol>
                      {j.steps.map((s, i) => {
                        const current = at?.n === j.n && at.i === i;
                        return (
                          <li key={i}>
                            <button type="button" className={`erp-step-link${current ? ' current' : ''}`} aria-current={current ? 'step' : undefined} onClick={() => go(j, i)}>
                              <span className="erp-step-n">{i + 1}</span>
                              <span className="grow">{s.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                    {at?.n === j.n && at.i < j.steps.length - 1 ? (
                      <button type="button" className="btn primary sm" onClick={() => go(j, at.i + 1)}>
                        Next step <PIcon name="chevronRight" size={14} />
                      </button>
                    ) : at?.n !== j.n ? (
                      <button type="button" className="btn primary sm" onClick={() => go(j, 0)}>
                        Start
                      </button>
                    ) : (
                      <p className="small success-text">
                        <PIcon name="check" size={14} /> Journey complete.
                      </p>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
