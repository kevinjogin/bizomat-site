// My Work items, notifications and administration records (demonstration data).
import { addDays, TODAY } from '../format';
import type { ModuleId, RoleId } from '../types';

export type WorkType = 'Task' | 'Follow-up' | 'Approval' | 'Review' | 'Mention' | 'Waiting for';
export interface WorkItem {
  id: string;
  type: WorkType;
  title: string;
  module: ModuleId;
  due: string | null;
  status: string;
  /** Who is waiting, or who the item waits on. */
  who: string;
  /** The record inside the prototype. */
  to: string;
  record?: string;
  amount?: number;
}

const w = (id: string, type: WorkType, title: string, module: ModuleId, due: number | null, who: string, to: string, extra: Partial<WorkItem> = {}): WorkItem => ({
  id,
  type,
  title,
  module,
  due: due === null ? null : addDays(TODAY, due),
  status: type === 'Waiting for' ? 'Waiting' : 'Open',
  who,
  to,
  ...extra,
});

export const WORK_ITEMS: WorkItem[] = [
  w('MW-01', 'Task', 'Confirm weld procedure for WO-1042 rework', 'Project Management', 0, 'Ben Carter is waiting', '/projects/my-tasks/TSK-4101', { record: 'TSK-4101' }),
  w('MW-02', 'Approval', 'Approve purchase order PO-0388, Coastline Steel Supply', 'System', 0, 'Sara Haddad submitted', '/procurement/purchase-orders/PO-0388', { record: 'PO-0388', amount: 18_862.8 }),
  w('MW-03', 'Follow-up', 'Follow up QU-0107 with Olivia Bennett, Harbour Builders', 'CRM', 0, 'Priya Nair assigned', '/sales/quotes/QU-0107', { record: 'QU-0107' }),
  w('MW-04', 'Approval', 'Approve bill BILL-0711, Coastline Steel Supply', 'Finance', 1, 'Mei Lin submitted', '/finance/bills/BILL-0711', { record: 'BILL-0711', amount: 9_856 }),
  w('MW-05', 'Review', 'Review BOM revision C, conveyor drive frame', 'System', 1, 'Tom Walsh asked', '/products/products/PRD-1001?tab=bom&rev=C', { record: 'PRD-1001' }),
  w('MW-06', 'Mention', 'Hannah Brooks mentioned you: "Can we still make 18 Nov?"', 'Project Management', null, 'Hannah Brooks', '/projects/projects/PRJ-031', { record: 'PRJ-031' }),
  w('MW-07', 'Approval', 'Disposition for NCR-0121, weld undercut', 'System', -1, 'Grace Kim submitted', '/quality/nonconformances/NCR-0121', { record: 'NCR-0121' }),
  w('MW-08', 'Task', 'Update project cost forecast, PRJ-031', 'Project Management', 0, 'Hannah Brooks assigned', '/projects/my-tasks/TSK-4114', { record: 'TSK-4114' }),
  w('MW-09', 'Waiting for', 'Expense claim EXP-0091 waiting for Daniel Okafor', 'Finance', -2, 'Daniel Okafor', '/finance/expense-claims/EXP-0091', { record: 'EXP-0091' }),
  w('MW-10', 'Approval', 'Approve requisition REQ-0413, welding wire', 'System', 2, 'Ben Carter submitted', '/procurement/requisitions/REQ-0413', { record: 'REQ-0413' }),
  w('MW-11', 'Task', 'Weekly progress report', 'Project Management', 1, 'Hannah Brooks assigned', '/projects/my-tasks/TSK-4118', { record: 'TSK-4118' }),
  w('MW-12', 'Follow-up', 'Call Northgate about walkway handover date', 'CRM', -3, 'Priya Nair assigned', '/sales/activities/ACT-502', { record: 'ACT-502' }),
  w('MW-13', 'Review', 'Review inspection INS-0533 checklist', 'System', 0, 'Grace Kim asked', '/quality/inspections/INS-0533', { record: 'INS-0533' }),
  w('MW-14', 'Mention', 'Mei Lin mentioned you on INV-2291: "Balance due 27 Nov"', 'Finance', null, 'Mei Lin', '/finance/invoices/INV-2291', { record: 'INV-2291' }),
  w('MW-15', 'Waiting for', 'Engineering change ECO-0046 waiting for Grace Kim', 'System', 2, 'Grace Kim', '/engineering/changes/ECO-0046', { record: 'ECO-0046' }),
  w('MW-16', 'Approval', 'Approve credit note CN-0043, Bayside Fabrication', 'Finance', 3, 'Mei Lin submitted', '/finance/credit-notes/CN-0043', { record: 'CN-0043' }),
  w('MW-17', 'Task', 'Order handrail tube', 'Project Management', 0, 'Sara Haddad assigned', '/projects/my-tasks/TSK-4111', { record: 'TSK-4111' }),
  w('MW-18', 'Follow-up', 'Send revised drawings to Summit Rail', 'CRM', 4, 'Priya Nair assigned', '/sales/activities/ACT-504', { record: 'ACT-504' }),
];

export interface Notice {
  id: string;
  title: string;
  body: string;
  module: ModuleId;
  at: string;
  to: string;
  read: boolean;
}
export const NOTICES: Notice[] = [
  { id: 'N-01', title: 'SO-1048 is late', body: 'Promised 6 Nov to Harbour Builders. Work order WO-1042 is delayed.', module: 'System', at: `${TODAY}T08:02`, to: '/sales/orders/SO-1048', read: false },
  { id: 'N-02', title: 'PO-0388 needs your approval', body: 'Coastline Steel Supply, $18,862.80, submitted by Sara Haddad.', module: 'System', at: `${TODAY}T07:48`, to: '/procurement/purchase-orders/PO-0388', read: false },
  { id: 'N-03', title: 'Inspection INS-0533 failed one check', body: 'Weld undercut at joint W7. NCR-0121 raised.', module: 'System', at: '2026-11-11T14:20', to: '/quality/inspections/INS-0533', read: false },
  { id: 'N-04', title: 'Payment received on INV-2291', body: '$20,000.00 from Harbour Builders. Balance $28,620.00.', module: 'Finance', at: '2026-11-05T10:12', to: '/finance/invoices/INV-2291', read: true },
  { id: 'N-05', title: 'Goods received GR-0215', body: 'Coastline Steel Supply. Two sheets short; two lengths quarantined.', module: 'System', at: '2026-11-12T11:35', to: '/inventory/receipts/GR-0215', read: false },
  { id: 'N-06', title: 'CAD job failed', body: 'CADJ-5104: mass properties report for PRD-1010 stopped.', module: 'CAD Automation', at: '2026-11-10T16:46', to: '/cad/jobs/CADJ-5104', read: true },
  { id: 'N-07', title: 'Hannah Brooks mentioned you', body: '"Can we still make 18 Nov?" on Harbour Builders conveyor upgrade.', module: 'Project Management', at: '2026-11-12T16:05', to: '/projects/projects/PRJ-031', read: false },
  { id: 'N-08', title: 'Quote QU-0107 expires in 7 days', body: 'Harbour Builders, stage 2 conveyor frames.', module: 'Finance', at: `${TODAY}T06:00`, to: '/sales/quotes/QU-0107', read: true },
  { id: 'N-09', title: 'Paint booth fan breakdown', body: 'AST-004 out of service. MO-0612 in progress.', module: 'System', at: '2026-11-12T09:15', to: '/maintenance/orders/MO-0612', read: true },
];

export const ADMIN_MODULES = [
  { id: 'crm', name: 'Customer Relationship Management', state: 'W', on: true },
  { id: 'finance', name: 'Finance', state: 'W', on: true },
  { id: 'pm', name: 'Project Management', state: 'W', on: true },
  { id: 'cad', name: 'CAD Automation', state: 'W', on: true },
  { id: 'products', name: 'Products & Engineering', state: 'P', on: true },
  { id: 'procurement', name: 'Procurement', state: 'P', on: true },
  { id: 'inventory', name: 'Inventory & Warehouse', state: 'P', on: true },
  { id: 'manufacturing', name: 'Manufacturing', state: 'P', on: true },
  { id: 'quality', name: 'Quality', state: 'P', on: true },
  { id: 'maintenance', name: 'Assets & Maintenance', state: 'P', on: false },
  { id: 'supply', name: 'Supply Chain', state: 'P', on: false },
] as const;

export const SITES = [
  { id: 'SITE-BNE', name: 'Brisbane', kind: 'Head office and factory', address: 'Example Industrial Estate, Brisbane QLD', warehouses: 1, people: 16, status: 'Active' },
  { id: 'SITE-SYD', name: 'Sydney', kind: 'Sales branch and store', address: 'Example Business Park, Sydney NSW', warehouses: 1, people: 5, status: 'Active' },
];

export const NUMBERING = [
  ['Invoices', 'INV-', 2300, 'Finance', 'W'],
  ['Quotes', 'QU-', 116, 'Finance', 'W'],
  ['Purchase orders', 'PO-', 396, 'Finance', 'W'],
  ['Sales orders', 'SO-', 1061, 'System', 'P'],
  ['Work orders', 'WO-', 1051, 'System', 'P'],
  ['Goods receipts', 'GR-', 221, 'System', 'P'],
  ['Inspections', 'INS-', 541, 'System', 'P'],
  ['Nonconformances', 'NCR-', 123, 'System', 'P'],
] as const;

export const AUDIT = [
  ['2026-11-13T08:02', 'System', 'System', 'SO-1048', 'Status', 'In production', 'Late'],
  ['2026-11-12T16:51', 'Sara Haddad', 'System', 'PO-0388', 'Status', 'Draft', 'Awaiting approval'],
  ['2026-11-12T11:35', 'Luca Romano', 'System', 'GR-0215', 'Created', '', 'Awaiting put-away'],
  ['2026-11-11T14:20', 'Grace Kim', 'System', 'INS-0533', 'Result', 'Open', 'Awaiting review'],
  ['2026-11-10T09:12', 'Tom Walsh', 'System', 'BOM-1001-C', 'Created', '', 'In review'],
  ['2026-11-05T10:12', 'Mei Lin', 'Finance', 'INV-2291', 'Payment', '$0.00', '$20,000.00'],
  ['2026-11-04T15:03', 'Priya Nair', 'Finance', 'QU-0107', 'Status', 'Draft', 'Sent'],
  ['2026-11-03T08:30', 'Omar Siddiqui', 'Company', 'Ava Singh', 'Invitation', '', 'Sent'],
] as const;

export const INVITATIONS = [
  { name: 'Ava Singh', email: 'ava.singh@example.com', role: 'Quality inspector', sent: '2026-11-03' },
  { name: 'Jack Nguyen', email: 'jack.nguyen@example.com', role: 'Buyer', sent: '2026-11-07' },
];
export const ACCESS_REQUESTS = [
  { name: 'Ruby Fraser', wants: 'Finance: invoices (read)', reason: 'Answer customer payment questions', date: '2026-11-12' },
  { name: 'Liam Kelly', wants: 'Inventory: stock counts', reason: 'Plan Saturday count', date: '2026-11-11' },
];

/** Default module access per role, for the permission matrix (None, Read, Edit, Full). */
export const MATRIX_MODULES = ['Sales', 'Finance', 'Projects', 'Products', 'Procurement', 'Inventory', 'Manufacturing', 'Quality', 'Maintenance', 'Supply Chain', 'Reports', 'Administration'] as const;
export const MATRIX: Record<RoleId, string[]> = {
  ceo: ['Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full'],
  executive: ['Edit', 'Edit', 'Edit', 'Edit', 'Edit', 'Edit', 'Edit', 'Edit', 'Edit', 'Edit', 'Full', 'None'],
  sales: ['Full', 'Read', 'Edit', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'Edit', 'None'],
  finance: ['Read', 'Full', 'None', 'None', 'Read', 'None', 'None', 'None', 'None', 'None', 'Full', 'None'],
  accountant: ['None', 'Edit', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'Edit', 'None'],
  engineer: ['None', 'None', 'Edit', 'Full', 'None', 'None', 'None', 'Read', 'None', 'None', 'None', 'None'],
  procurement: ['None', 'Read', 'None', 'None', 'Full', 'Read', 'None', 'None', 'None', 'None', 'Edit', 'None'],
  production: ['None', 'None', 'Edit', 'None', 'None', 'Edit', 'Full', 'Edit', 'None', 'None', 'Edit', 'None'],
  warehouse: ['None', 'None', 'None', 'None', 'Edit', 'Full', 'None', 'None', 'None', 'Full', 'None', 'None'],
  quality: ['None', 'None', 'None', 'None', 'Read', 'None', 'Read', 'Full', 'None', 'None', 'None', 'None'],
  project: ['Read', 'None', 'Full', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'Edit', 'None'],
  admin: ['Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full', 'Full'],
};
