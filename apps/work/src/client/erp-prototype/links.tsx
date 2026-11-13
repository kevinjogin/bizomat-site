// Where each kind of record lives in the prototype, so any identifier in any screen can link to its record.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const ENTITY_PATH: Record<string, string> = {
  customer: 'sales/customers',
  contact: 'sales/contacts',
  lead: 'sales/leads',
  opportunity: 'sales/opportunities',
  activity: 'sales/activities',
  quote: 'sales/quotes',
  salesOrder: 'sales/orders',
  delivery: 'sales/deliveries',
  invoice: 'finance/invoices',
  creditNote: 'finance/credit-notes',
  bill: 'finance/bills',
  expenseClaim: 'finance/expense-claims',
  project: 'projects/projects',
  task: 'projects/my-tasks',
  product: 'products/products',
  variant: 'products/variants',
  bom: 'products/boms',
  routing: 'products/routings',
  eco: 'engineering/changes',
  revision: 'products/revisions',
  drawing: 'engineering/drawings',
  cadJob: 'engineering/cad-jobs',
  supplier: 'procurement/suppliers',
  requisition: 'procurement/requisitions',
  rfq: 'procurement/rfqs',
  purchaseOrder: 'procurement/purchase-orders',
  stock: 'inventory/stock',
  movement: 'inventory/movements',
  receipt: 'inventory/receipts',
  transfer: 'inventory/transfers',
  count: 'inventory/counts',
  workOrder: 'manufacturing/work-orders',
  workCentre: 'manufacturing/work-centres',
  inspection: 'quality/inspections',
  ncr: 'quality/nonconformances',
  capa: 'quality/corrective-actions',
  inspectionPlan: 'quality/plans',
  certificate: 'quality/certificates',
  asset: 'maintenance/assets',
  maintenancePlan: 'maintenance/plans',
  workRequest: 'maintenance/requests',
  maintenanceOrder: 'maintenance/orders',
  downtime: 'maintenance/downtime',
  shipment: 'supply-chain/shipments',
  carrier: 'supply-chain/carriers',
  return: 'supply-chain/returns',
};

const PREFIX: [string, string][] = [
  ['SO-', 'salesOrder'], ['QU-', 'quote'], ['INV-', 'invoice'], ['PO-', 'purchaseOrder'], ['GR-', 'receipt'], ['WO-', 'workOrder'],
  ['INS-', 'inspection'], ['NCR-', 'ncr'], ['PRD-', 'product'], ['RM-', 'product'], ['SA-', 'product'], ['CUS-', 'customer'],
  ['SUP-', 'supplier'], ['BILL-', 'bill'], ['CN-', 'creditNote'], ['EXP-', 'expenseClaim'], ['PRJ-', 'project'], ['TSK-', 'task'],
  ['REQ-', 'requisition'], ['RFQ-', 'rfq'], ['ECO-', 'eco'], ['DWG-', 'drawing'], ['CADJ-', 'cadJob'], ['BOM-', 'bom'],
  ['RT-', 'routing'], ['TRF-', 'transfer'], ['CNT-', 'count'], ['WC-', 'workCentre'], ['CAPA-', 'capa'], ['IP-', 'inspectionPlan'],
  ['CERT-', 'certificate'], ['AST-', 'asset'], ['MP-', 'maintenancePlan'], ['WR-', 'workRequest'], ['MO-', 'maintenanceOrder'],
  ['DT-', 'downtime'], ['SHP-', 'shipment'], ['CAR-', 'carrier'], ['RMA-', 'return'], ['OPP-', 'opportunity'], ['LEAD-', 'lead'],
  ['ACT-', 'activity'], ['CON-', 'contact'], ['DEL-', 'delivery'], ['MOV-', 'movement'], ['STK-', 'stock'], ['REV-', 'revision'],
];

export function entityOf(id: string): string | null {
  if (/^PRD-\d+-\w+$/.test(id)) return 'variant';
  return PREFIX.find(([p]) => id.startsWith(p))?.[1] ?? null;
}
export function hrefFor(id: string | undefined | null): string | null {
  if (!id) return null;
  const e = entityOf(id);
  return e ? `/${ENTITY_PATH[e]}/${id}` : null;
}
export const recordHref = (entity: string, id: string) => `/${ENTITY_PATH[entity]}/${id}`;

/** An identifier that links to its record when the prototype has one. */
export function RecLink({ id, children, className }: { id?: string | null; children?: ReactNode; className?: string }) {
  if (!id) return null;
  const href = hrefFor(id);
  if (!href) return <span className={className}>{children ?? id}</span>;
  return (
    <Link to={href} className={`erp-reclink${className ? ` ${className}` : ''}`}>
      {children ?? id}
    </Link>
  );
}
