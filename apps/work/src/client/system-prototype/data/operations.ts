// Projects, engineering, procurement, inventory, manufacturing, quality, maintenance and supply chain records
// (demonstration data, invented for the prototype).
import { addDays, between, pad, pick, rng, TODAY } from '../format';
import type { Row } from '../types';
import { CUSTOMERS, ITEMS, SUPPLIERS, itemCost, itemName } from './core';
import { line, linesTotal, salesOrders, type Line } from './sales-finance';

const r = rng(1311);

// ------------------------------------------------------------------ projects and tasks

export const projects: Row[] = [
  ['PRJ-031', 'Harbour Builders conveyor upgrade', 'Harbour Builders', 'Hannah Brooks', '2026-09-01', '2026-12-18', 62, 420_000, 268_400, 'At risk'],
  ['PRJ-032', 'Northgate plant walkways', 'Northgate Mining Services', 'Hannah Brooks', '2026-08-11', '2026-11-28', 81, 285_000, 231_900, 'On track'],
  ['PRJ-033', 'Summit Rail stair access', 'Summit Rail Maintenance', 'Hannah Brooks', '2026-10-06', '2027-02-12', 24, 198_000, 41_300, 'On track'],
  ['PRJ-034', 'Greenfield screen house guarding', 'Greenfield Water Utilities', 'Tom Walsh', '2026-07-14', '2026-11-07', 96, 134_000, 139_800, 'Late'],
  ['PRJ-035', 'Westbridge dock levellers', 'Westbridge Logistics', 'Hannah Brooks', '2026-11-02', '2027-01-30', 8, 162_000, 9_800, 'On track'],
  ['PRJ-036', 'System rollout, Brisbane site', 'Example Engineering (internal)', 'Omar Siddiqui', '2026-10-01', '2027-03-31', 15, 90_000, 12_400, 'On track'],
  ['PRJ-030', 'Ridgeway site office stairs', 'Ridgeway Constructions', 'Hannah Brooks', '2026-05-04', '2026-09-26', 100, 76_000, 71_200, 'Completed'],
  ['PRJ-037', 'Coral Coast pump skids', 'Coral Coast Developments', 'Tom Walsh', '2026-11-16', '2027-02-26', 0, 214_000, 0, 'Not started'],
].map(([id, name, customer, manager, start, end, progress, budget, spent, status]) => ({ id: String(id), name, customer, manager, start, end, progress, budget, spent, status, site: String(customer).includes('Summit') || String(customer).includes('Westbridge') ? 'Sydney' : 'Brisbane' }));

const TASKS = [
  ['Confirm weld procedure for WO-1042 rework', 'PRJ-031', 'Alex Morgan', 0, 'In progress', 'High'],
  ['Issue revision C drawings to Harbour Builders', 'PRJ-031', 'Tom Walsh', 1, 'To do', 'High'],
  ['Book crane for frame installation', 'PRJ-031', 'Hannah Brooks', 5, 'To do', 'Medium'],
  ['Site measure, walkway level 3', 'PRJ-032', 'Zoe Martin', -2, 'In progress', 'High'],
  ['Galvanising quote for handrails', 'PRJ-032', 'Sara Haddad', -1, 'Blocked', 'Medium'],
  ['Prepare handover pack', 'PRJ-034', 'Tom Walsh', -6, 'In progress', 'High'],
  ['Stair stringer shop drawings', 'PRJ-033', 'Zoe Martin', 4, 'To do', 'Medium'],
  ['Kick-off meeting with Westbridge', 'PRJ-035', 'Hannah Brooks', 0, 'To do', 'Medium'],
  ['Map approval rules for requisitions', 'PRJ-036', 'Omar Siddiqui', 3, 'In progress', 'Low'],
  ['Train storepeople on scanning', 'PRJ-036', 'Luca Romano', 10, 'To do', 'Low'],
  ['Order handrail tube', 'PRJ-032', 'Sara Haddad', 0, 'To do', 'High'],
  ['Check coating spec with customer', 'PRJ-031', 'Priya Nair', -3, 'Done', 'Medium'],
  ['Load test platform', 'PRJ-032', 'Ben Carter', 2, 'To do', 'High'],
  ['Update project cost forecast', 'PRJ-031', 'Hannah Brooks', 0, 'To do', 'Medium'],
  ['Pump skid layout review', 'PRJ-037', 'Tom Walsh', 7, 'To do', 'Medium'],
  ['Final inspection, screen house', 'PRJ-034', 'Grace Kim', -4, 'Done', 'High'],
  ['Collect as-built dimensions', 'PRJ-033', 'Zoe Martin', 9, 'To do', 'Low'],
  ['Weekly progress report', 'PRJ-031', 'Alex Morgan', 1, 'To do', 'Low'],
] as const;
export const tasks: Row[] = TASKS.map(([title, project, assignee, due, status, priority], i) => ({
  id: `TSK-${pad(4101 + i)}`,
  title,
  project,
  assignee,
  due: addDays(TODAY, due),
  status,
  priority,
  site: project === 'PRJ-033' || project === 'PRJ-035' ? 'Sydney' : 'Brisbane',
}));

export const milestones = [
  { project: 'PRJ-031', name: 'Frames delivered', date: '2026-11-18' },
  { project: 'PRJ-032', name: 'Walkway handover', date: '2026-11-17' },
  { project: 'PRJ-033', name: 'Drawings approved', date: '2026-11-20' },
  { project: 'PRJ-035', name: 'Design freeze', date: '2026-12-04' },
];

// ------------------------------------------------------------------ products and engineering

export const products: Row[] = ITEMS.map(([id, name, type, uom, rev, cost], i) => ({
  id,
  name,
  type,
  uom,
  revision: rev,
  cost,
  price: type === 'Finished good' ? Math.round(Number(cost) * 1.45) : undefined,
  status: id === 'PRD-1001' ? 'Active' : i === 9 ? 'In review' : 'Active',
  onHand: type === 'Finished good' ? between(r, 0, 12) : between(r, 20, 400),
  site: i % 4 === 3 ? 'Sydney' : 'Brisbane',
  owner: type === 'Raw material' || type === 'Purchased part' ? 'Sara Haddad' : 'Tom Walsh',
  family: type === 'Raw material' || type === 'Purchased part' ? 'Materials' : name.includes('Conveyor') || name.includes('Idler') || name.includes('Belt') ? 'Conveyor' : 'Access and guarding',
}));
export const sellable = products.filter((p) => p.type === 'Finished good' || p.type === 'Sub-assembly');

export const variants: Row[] = [
  ['PRD-1001-1200', 'PRD-1001', 'Belt width 1200 mm', 'Active'],
  ['PRD-1001-1400', 'PRD-1001', 'Belt width 1400 mm', 'Active'],
  ['PRD-1001-1600', 'PRD-1001', 'Belt width 1600 mm', 'In review'],
  ['PRD-1003-STD', 'PRD-1003', 'Standard mesh', 'Active'],
  ['PRD-1003-FINE', 'PRD-1003', 'Fine mesh', 'Active'],
  ['PRD-1006-GAL', 'PRD-1006', 'Galvanised', 'Active'],
  ['PRD-1006-PNT', 'PRD-1006', 'Painted', 'Active'],
  ['PRD-1010-900', 'PRD-1010', 'Width 900 mm', 'Active'],
].map(([id, product, option, status]) => ({ id: String(id), product, productName: itemName(product), option, status, site: 'Brisbane' }));

export interface BomNode {
  item: string;
  qty: number;
  uom: string;
  children?: BomNode[];
}
const n = (item: string, qty: number, children?: BomNode[]): BomNode => ({ item, qty, uom: ITEMS.find((i) => i[0] === item)?.[3] ?? 'each', children });
export const BOM_PRD1001: Record<'A' | 'B' | 'C', { status: string; date: string; author: string; summary: string; tree: BomNode[] }> = {
  A: {
    status: 'Superseded',
    date: '2025-06-12',
    author: 'Tom Walsh',
    summary: 'First release.',
    tree: [n('SA-3001', 1, [n('RM-2001', 2), n('RM-2002', 1), n('RM-2007', 1)]), n('PRD-1004', 2, [n('RM-2001', 1)]), n('RM-2009', 12), n('RM-2006', 4), n('RM-2004', 3)],
  },
  B: {
    status: 'Released',
    date: '2026-02-03',
    author: 'Tom Walsh',
    summary: 'Tensioner added; four more bolts.',
    tree: [n('SA-3001', 1, [n('RM-2001', 2), n('RM-2002', 1), n('RM-2007', 1)]), n('PRD-1004', 2, [n('RM-2001', 1)]), n('PRD-1008', 1), n('RM-2009', 16), n('RM-2006', 4), n('RM-2004', 3)],
  },
  C: {
    status: 'In review',
    date: '2026-11-10',
    author: 'Tom Walsh',
    summary: 'Longer M16 x 60 bolts and two-pack epoxy coating (ECO-0046). Frame plate up to three sheets.',
    tree: [n('SA-3001', 1, [n('RM-2001', 3), n('RM-2002', 1), n('RM-2007', 1)]), n('PRD-1004', 2, [n('RM-2001', 1)]), n('PRD-1008', 1), n('RM-2003', 16), n('RM-2006', 4), n('RM-2005', 2)],
  },
};

export const boms: Row[] = [
  { id: 'BOM-1001-C', product: 'PRD-1001', revision: 'C', status: 'In review', components: 6, effective: 'On approval of ECO-0046', owner: 'Tom Walsh' },
  { id: 'BOM-1001-B', product: 'PRD-1001', revision: 'B', status: 'Released', components: 6, effective: '2026-02-03', owner: 'Tom Walsh' },
  { id: 'BOM-1001-A', product: 'PRD-1001', revision: 'A', status: 'Superseded', components: 5, effective: '2025-06-12', owner: 'Tom Walsh' },
  { id: 'BOM-1002-B', product: 'PRD-1002', revision: 'B', status: 'Released', components: 9, effective: '2026-04-21', owner: 'Zoe Martin' },
  { id: 'BOM-1003-A', product: 'PRD-1003', revision: 'A', status: 'Released', components: 4, effective: '2025-09-30', owner: 'Zoe Martin' },
  { id: 'BOM-1005-D', product: 'PRD-1005', revision: 'D', status: 'Released', components: 5, effective: '2026-07-14', owner: 'Tom Walsh' },
  { id: 'BOM-1006-A', product: 'PRD-1006', revision: 'A', status: 'Released', components: 11, effective: '2025-11-02', owner: 'Zoe Martin' },
  { id: 'BOM-1008-C', product: 'PRD-1008', revision: 'C', status: 'Released', components: 7, effective: '2026-05-19', owner: 'Tom Walsh' },
  { id: 'BOM-1010-B', product: 'PRD-1010', revision: 'B', status: 'In review', components: 6, effective: 'On approval of ECO-0045', owner: 'Zoe Martin' },
].map((b) => ({ ...b, productName: itemName(b.product), site: 'Brisbane' }));

export const OPERATIONS_1001 = [
  { op: 10, name: 'Cut plate and RHS', centre: 'WC-CUT', setup: 0.5, run: 1.5 },
  { op: 20, name: 'Fold brackets', centre: 'WC-FOLD', setup: 0.5, run: 1.0 },
  { op: 30, name: 'Weld frame', centre: 'WC-WELD', setup: 0.5, run: 6.0 },
  { op: 40, name: 'Inspect welds and dimensions', centre: 'WC-QA', setup: 0, run: 1.0 },
  { op: 50, name: 'Blast and coat', centre: 'WC-PAINT', setup: 0.5, run: 2.5 },
  { op: 60, name: 'Assemble drive and tensioner', centre: 'WC-ASSY', setup: 0.25, run: 3.0 },
];
export const routings: Row[] = [
  ['RT-1001', 'PRD-1001', 'C', 6, 16.75, 'In review'],
  ['RT-1002', 'PRD-1002', 'B', 5, 11.5, 'Released'],
  ['RT-1003', 'PRD-1003', 'A', 3, 2.5, 'Released'],
  ['RT-1005', 'PRD-1005', 'D', 4, 3.25, 'Released'],
  ['RT-1006', 'PRD-1006', 'A', 5, 9.0, 'Released'],
  ['RT-1008', 'PRD-1008', 'C', 4, 4.5, 'Released'],
].map(([id, product, revision, ops, hours, status]) => ({ id: String(id), product, productName: itemName(String(product)), revision, ops, hours, status, site: 'Brisbane' }));

export const ecos: Row[] = [
  ['ECO-0046', 'Coating and bolt change, conveyor drive frame', 'PRD-1001', 'B to C', 'In review', 'Tom Walsh', 'High'],
  ['ECO-0045', 'Stair stringer width option 900 mm', 'PRD-1010', 'A to B', 'Awaiting approval', 'Zoe Martin', 'Medium'],
  ['ECO-0044', 'Idler roller bearing upgrade', 'PRD-1005', 'C to D', 'Released', 'Tom Walsh', 'Medium'],
  ['ECO-0043', 'Guard panel fixing clips', 'PRD-1003', 'A', 'Rejected', 'Zoe Martin', 'Low'],
  ['ECO-0042', 'Hopper chute wear liner', 'PRD-1002', 'A to B', 'Released', 'Tom Walsh', 'High'],
  ['ECO-0041', 'Tensioner spring rate', 'PRD-1008', 'B to C', 'Released', 'Tom Walsh', 'Medium'],
].map(([id, title, product, revision, status, owner, priority], i) => ({ id: String(id), title, product, productName: itemName(String(product)), revision, status, owner, priority, raised: addDays(TODAY, -6 - i * 19), site: 'Brisbane' }));

export const revisions: Row[] = [
  ['PRD-1001', 'C', '2026-11-10', 'In review', 'Bolts M16 x 60; two-pack epoxy; three plate sheets'],
  ['PRD-1001', 'B', '2026-02-03', 'Released', 'Belt tensioner added; four more bolts'],
  ['PRD-1001', 'A', '2025-06-12', 'Superseded', 'First release'],
  ['PRD-1005', 'D', '2026-07-14', 'Released', 'Sealed bearings'],
  ['PRD-1002', 'B', '2026-04-21', 'Released', 'Wear liner added'],
  ['PRD-1008', 'C', '2026-05-19', 'Released', 'Spring rate changed'],
  ['PRD-1010', 'B', '2026-11-04', 'In review', '900 mm width option'],
  ['PRD-1003', 'A', '2025-09-30', 'Released', 'First release'],
].map(([product, rev, date, status, summary], i) => ({ id: `REV-${pad(801 + i, 3)}`, product, productName: itemName(product), rev, date, status, summary, author: i % 3 ? 'Zoe Martin' : 'Tom Walsh' }));

export const drawings: Row[] = [
  ['DWG-1001-01', 'PRD-1001', 'Conveyor drive frame, general arrangement', 'C', 'In review'],
  ['DWG-1001-02', 'PRD-1001', 'Frame weldment details', 'C', 'In review'],
  ['DWG-1001-03', 'PRD-1001', 'Gearbox mount bracket', 'B', 'Released'],
  ['DWG-1002-01', 'PRD-1002', 'Hopper chute assembly', 'B', 'Released'],
  ['DWG-1005-01', 'PRD-1005', 'Idler roller set', 'D', 'Released'],
  ['DWG-1006-01', 'PRD-1006', 'Walkway platform 3 m', 'A', 'Released'],
  ['DWG-1008-01', 'PRD-1008', 'Belt tensioner unit', 'C', 'Released'],
  ['DWG-1010-01', 'PRD-1010', 'Stair stringer pair', 'B', 'In review'],
].map(([id, product, title, rev, status], i) => ({ id: String(id), product, title, rev, status, format: i % 2 ? 'SLDDRW and PDF' : 'SLDPRT, SLDDRW and PDF', updated: addDays(TODAY, -i * 9 - 3), owner: i % 2 ? 'Zoe Martin' : 'Tom Walsh' }));

export const cadJobs: Row[] = [
  ['CADJ-5108', 'Export PDF drawings, PRD-1001 rev C', 'Completed', '2026-11-12T15:42', '1 min 48 s'],
  ['CADJ-5107', 'Update BOM from model, PRD-1001 rev C', 'Completed', '2026-11-12T15:31', '2 min 05 s'],
  ['CADJ-5106', 'Generate flat patterns, SA-3001', 'Running', '2026-11-13T09:02', ''],
  ['CADJ-5105', 'Export DXF for laser, PRD-1004', 'Completed', '2026-11-11T11:18', '0 min 52 s'],
  ['CADJ-5104', 'Mass properties report, PRD-1010', 'Failed', '2026-11-10T16:45', '0 min 12 s'],
  ['CADJ-5103', 'Export STEP, PRD-1002 rev B', 'Completed', '2026-11-09T10:11', '1 min 10 s'],
  ['CADJ-5102', 'Configure variant 1600 mm, PRD-1001', 'Queued', '2026-11-13T09:05', ''],
].map(([id, title, status, started, duration]) => ({ id: String(id), title, status, started, duration, requestedBy: 'Tom Walsh', tool: 'CAD Automation (SolidWorks)' }));

/** CAD Automation's paired computers and AI connectors, as its own pages show them (demonstration data). */
export const CAD_CONNECTOR_URL = 'https://bizomat.ai/cad/mcp';
export const CAD_INSTALLER_URL = 'https://bizomat.ai/cad/download/solidworks';
export const CAD_APP_URL = 'https://bizomat.ai/cad/';
export const CAD_ADDIN_LATEST = '0.12.3';

export const cadComputers: Row[] = [
  { id: 'ENG-WS-01', person: 'Tom Walsh', status: 'Online', solidworks: 'SOLIDWORKS 2024 SP2', addin: '0.12.3', lastSeen: '2026-11-13T09:04', isDefault: true, open: 'PRD-1001 rev C (assembly)' },
  { id: 'ENG-LT-02', person: 'Zoe Martin', status: 'Online', solidworks: 'SOLIDWORKS 2023 SP5', addin: '0.12.1', lastSeen: '2026-11-13T08:58', isDefault: false, open: 'SA-3001 (part)' },
  { id: 'DESIGN-03', person: 'Tom Walsh', status: 'Offline', solidworks: 'SOLIDWORKS 2024 SP1', addin: '0.12.3', lastSeen: '2026-11-12T17:40', isDefault: false, open: '' },
];

export const cadConnectors: Row[] = [
  { id: 'AI-01', app: 'Claude', person: 'Tom Walsh', connected: '2026-11-03', lastUsed: '2026-11-13T09:02' },
  { id: 'AI-02', app: 'ChatGPT', person: 'Zoe Martin', connected: '2026-11-07', lastUsed: '2026-11-12T15:31' },
];

// ------------------------------------------------------------------ procurement

export const suppliers: Row[] = SUPPLIERS.map(([id, name, category, site], i) => ({
  id,
  name,
  category,
  site,
  onTime: [86, 97, 92, 95, 89, 98, 94, 99, 91, 78][i],
  quality: [96, 99, 98, 100, 97, 99, 100, 100, 95, 97][i],
  leadTime: [5, 2, 10, 4, 7, 6, 2, 3, 4, 21][i],
  spendYtd: [412_000, 46_800, 88_300, 39_100, 61_200, 52_700, 27_400, 18_900, 74_500, 128_600][i],
  status: i === 9 ? 'Under review' : 'Active',
  contact: `${['Mark', 'Lena', 'Raj', 'Tess', 'Owen', 'Kim', 'Paul', 'Nina', 'Sam', 'Dev'][i]} at ${name.split(' ')[0]}`,
}));

export const requisitions: Row[] = [
  ['REQ-0412', 'Steel plate 10 mm, replacement for WO-1042', 'RM-2001', 6, 'Ben Carter', '2026-11-17', 'Converted to PO'],
  ['REQ-0413', 'Welding wire for November', 'RM-2007', 8, 'Ben Carter', '2026-11-20', 'Awaiting approval'],
  ['REQ-0414', 'Flange bearings for PRJ-033', 'RM-2006', 24, 'Hannah Brooks', '2026-11-27', 'Awaiting approval'],
  ['REQ-0415', 'Epoxy coating for revision C frames', 'RM-2005', 40, 'Tom Walsh', '2026-11-24', 'Draft'],
  ['REQ-0411', 'Gearboxes for SO-1051', 'RM-2008', 2, 'Ben Carter', '2026-11-04', 'Converted to PO'],
  ['REQ-0410', 'Hex bolts M16 x 60', 'RM-2003', 400, 'Luca Romano', '2026-11-08', 'Approved'],
  ['REQ-0409', 'Safety yellow enamel', 'RM-2004', 20, 'Luca Romano', '2026-10-30', 'Converted to PO'],
].map(([id, title, item, qty, requester, needed, status]) => ({ id: String(id), title, item, qty, requester, needed, status, estimate: Number(qty) * itemCost(String(item)), site: 'Brisbane', department: 'Production' }));

export const rfqs: Row[] = [
  { id: 'RFQ-061', title: 'Steel plate 10 mm, 40 sheets', item: 'RM-2001', closes: '2026-11-15', status: 'Open', responses: [['Coastline Steel Supply', 486, 5], ['Precision Laser Cutting', 512, 4], ['Metro Fasteners', 0, 0]] },
  { id: 'RFQ-060', title: 'Helical gearbox 7.5 kW, 6 units', item: 'RM-2008', closes: '2026-11-08', status: 'Closed', responses: [['Riverside Gearboxes', 2240, 21], ['Summit Bearings', 2385, 12]] },
  { id: 'RFQ-059', title: 'Two-pack epoxy, 200 L', item: 'RM-2005', closes: '2026-11-21', status: 'Open', responses: [['Apex Coatings', 58, 7]] },
  { id: 'RFQ-058', title: 'Pallets and crating, Q1', item: '', closes: '2026-10-31', status: 'Closed', responses: [['Outback Timber & Pallets', 42, 3]] },
].map((q) => ({ ...q, itemName: q.item ? itemName(q.item) : 'Packaging', invited: q.responses.length, received: q.responses.filter((x) => Number(x[1]) > 0).length, site: 'Brisbane', buyer: 'Sara Haddad' }));

const PO_STATUS = ['Received', 'Received', 'Closed', 'Partly received', 'Sent', 'Approved', 'Draft'];
export const purchaseOrders: Row[] = Array.from({ length: 16 }, (_, i) => {
  const num = 380 + i;
  const s = SUPPLIERS[(i * 3 + 1) % SUPPLIERS.length];
  const items = ITEMS.filter((it) => it[0].startsWith('RM-'));
  const qty = (id: string, lo: number, hi: number) => (itemCost(id) > 500 ? between(r, 1, 4) : between(r, lo, hi));
  const a = pick(r, items)[0];
  const b = pick(r, items)[0];
  const lines: Line[] = [line(a, qty(a, 4, 40)), line(b, qty(b, 2, 20))];
  const ordered = addDays(TODAY, -between(r, 1, 30) - (15 - i));
  return { id: `PO-0${num}`, supplier: s[1], supplierId: s[0], ordered, expected: addDays(ordered, 7 + between(r, 0, 10)), status: PO_STATUS[i % PO_STATUS.length], lines, total: linesTotal(lines) * 1.1, buyer: i % 2 ? 'Jack Nguyen' : 'Sara Haddad', site: s[3] === 'Sydney' && i % 2 ? 'Sydney' : 'Brisbane' };
});
const setPo = (id: string, patch: Partial<Row>) => {
  const i = purchaseOrders.findIndex((p) => p.id === id);
  purchaseOrders[i] = { ...purchaseOrders[i], ...patch };
  if (patch.lines) purchaseOrders[i].total = linesTotal(patch.lines) * 1.1;
};
setPo('PO-0385', { supplier: 'Coastline Steel Supply', supplierId: 'SUP-01', ordered: '2026-11-02', expected: '2026-11-12', status: 'Partly received', lines: [line('RM-2001', 40, 486), line('RM-2002', 60, 214)], site: 'Brisbane', buyer: 'Sara Haddad' });
setPo('PO-0388', {
  supplier: 'Coastline Steel Supply',
  supplierId: 'SUP-01',
  ordered: '2026-11-12',
  expected: '2026-11-18',
  status: 'Awaiting approval',
  lines: [line('RM-2001', 30, 486), line('RM-2002', 12, 214)],
  site: 'Brisbane',
  buyer: 'Sara Haddad',
  requisition: 'REQ-0412',
  reason: 'Replacement and buffer plate for WO-1042 rework and the next two conveyor frames.',
});
setPo('PO-0391', { status: 'Awaiting approval', supplier: 'Apex Coatings', supplierId: 'SUP-05' });
setPo('PO-0393', { status: 'Awaiting approval', supplier: 'Summit Bearings', supplierId: 'SUP-06' });
setPo('PO-0389', { status: 'Sent', supplier: 'Riverside Gearboxes', supplierId: 'SUP-10', expected: '2026-11-11' });

// ------------------------------------------------------------------ inventory

export const WAREHOUSES = [
  { id: 'BNE-WH1', name: 'Brisbane main store', site: 'Brisbane', zones: [{ zone: 'A', label: 'Plate and sections', bins: 12 }, { zone: 'B', label: 'Fasteners and parts', bins: 18 }, { zone: 'C', label: 'Finished goods', bins: 8 }, { zone: 'R', label: 'Receiving and quarantine', bins: 4 }] },
  { id: 'SYD-WH1', name: 'Sydney branch store', site: 'Sydney', zones: [{ zone: 'A', label: 'Parts', bins: 10 }, { zone: 'C', label: 'Finished goods', bins: 6 }, { zone: 'R', label: 'Receiving', bins: 2 }] },
];

export const stock: Row[] = ITEMS.map(([id, name, type, uom, , cost], i) => {
  const site = i % 4 === 3 ? 'Sydney' : 'Brisbane';
  const onHand = id === 'RM-2001' ? 14 : type === 'Finished good' ? between(r, 0, 10) : between(r, 6, 420);
  const reorder = id === 'RM-2001' ? 20 : type === 'Finished good' ? 2 : Math.round(onHand * (i % 5 === 0 ? 1.3 : 0.4));
  const allocated = id === 'RM-2001' ? 12 : Math.round(onHand * (between(r, 0, 40) / 100));
  const status = onHand === 0 ? 'Out of stock' : onHand <= reorder ? 'Low' : 'In stock';
  return {
    id: `STK-${id}`,
    item: id,
    name,
    type,
    uom,
    warehouse: site === 'Sydney' ? 'SYD-WH1' : 'BNE-WH1',
    bin: `${type === 'Finished good' ? 'C' : type === 'Purchased part' ? 'B' : 'A'}-${pad((i % 9) + 1, 2)}-${['01', '02', '03'][i % 3]}`,
    onHand,
    allocated,
    available: onHand - allocated,
    reorder,
    value: Math.round(onHand * Number(cost)),
    status,
    site,
  };
});

export const movements: Row[] = Array.from({ length: 28 }, (_, i) => {
  const st = stock[(i * 7) % stock.length];
  const type = ['Receipt', 'Issue', 'Issue', 'Transfer', 'Adjustment', 'Receipt'][i % 6];
  const qty = between(r, 1, 30);
  return {
    id: `MOV-${pad(77001 + i, 5)}`,
    date: addDays(TODAY, -Math.floor(i / 3)),
    item: st.item,
    name: st.name,
    type,
    qty: type === 'Issue' ? -qty : qty,
    from: type === 'Receipt' ? 'Receiving' : st.bin,
    to: type === 'Issue' ? `WO-${1040 + (i % 8)}` : type === 'Transfer' ? 'SYD-WH1 A-01-01' : st.bin,
    reference: type === 'Receipt' ? `GR-0${210 + (i % 10)}` : type === 'Issue' ? `WO-${1040 + (i % 8)}` : type === 'Transfer' ? 'TRF-031' : 'CNT-018',
    by: pick(r, ['Luca Romano', 'Isla Turner', 'Noah Becker']),
    site: st.site,
  };
});

const RECEIVED = purchaseOrders.filter((p) => ['Received', 'Closed', 'Partly received'].includes(p.status));
export const receipts: Row[] = Array.from({ length: 11 }, (_, i) => {
  const num = 210 + i;
  const po = RECEIVED[i % RECEIVED.length];
  const lines = (po.lines as Line[]).map((l) => ({ ...l, received: l.qty, accepted: l.qty, bin: 'R-01-01' }));
  return { id: `GR-0${num}`, po: po.id, supplier: po.supplier, supplierId: po.supplierId, date: addDays(TODAY, -(11 - i) * 2), status: i < 8 ? 'Put away' : 'Awaiting put-away', lines, receivedBy: i % 2 ? 'Isla Turner' : 'Luca Romano', site: po.site, packingSlip: `PS-${between(r, 100000, 999999)}` };
});
{
  const i = receipts.findIndex((g) => g.id === 'GR-0215');
  receipts[i] = {
    ...receipts[i],
    po: 'PO-0385',
    supplier: 'Coastline Steel Supply',
    supplierId: 'SUP-01',
    date: '2026-11-12',
    status: 'Awaiting put-away',
    receivedBy: 'Luca Romano',
    site: 'Brisbane',
    packingSlip: 'CSS-PS-220871',
    inspection: 'INS-0531',
    lines: [
      { ...line('RM-2001', 40, 486), received: 38, accepted: 38, bin: 'A-01-02', note: 'Two sheets short; supplier to deliver with PO-0388.' },
      { ...line('RM-2002', 60, 214), received: 60, accepted: 58, bin: 'A-03-01', note: 'Two lengths bent in transit: quarantine bin R-02-01.' },
    ],
  };
}

export const transfers: Row[] = [
  ['TRF-031', 'BNE-WH1', 'SYD-WH1', '2026-11-12', 'In transit', 3],
  ['TRF-030', 'BNE-WH1', 'SYD-WH1', '2026-11-06', 'Received', 5],
  ['TRF-029', 'SYD-WH1', 'BNE-WH1', '2026-10-29', 'Received', 2],
  ['TRF-032', 'BNE-WH1', 'SYD-WH1', '2026-11-17', 'Draft', 4],
].map(([id, from, to, date, status, lines]) => ({ id: String(id), from, to, date, status, lines, carrier: 'Bluewater Freight', site: 'Brisbane' }));

export const counts: Row[] = [
  ['CNT-019', 'BNE-WH1', 'Zone B (fasteners)', '2026-11-14', 'Scheduled', 0, 0],
  ['CNT-018', 'BNE-WH1', 'Zone A (plate)', '2026-11-07', 'Completed', 46, 2],
  ['CNT-017', 'SYD-WH1', 'All bins', '2026-10-31', 'Completed', 58, 1],
  ['CNT-020', 'SYD-WH1', 'Zone C (finished goods)', '2026-11-21', 'Scheduled', 0, 0],
].map(([id, warehouse, scope, date, status, counted, variances]) => ({ id: String(id), warehouse, scope, date, status, counted, variances, counter: 'Isla Turner', site: String(warehouse).startsWith('SYD') ? 'Sydney' : 'Brisbane' }));

// ------------------------------------------------------------------ manufacturing

export const workCentres: Row[] = [
  ['WC-CUT', 'Laser cutter', 76, 64],
  ['WC-FOLD', 'Press brake', 76, 52],
  ['WC-WELD', 'Welding bay', 152, 179],
  ['WC-QA', 'Quality bench', 38, 30],
  ['WC-PAINT', 'Paint booth', 76, 71],
  ['WC-ASSY', 'Assembly line', 114, 88],
  ['WC-MACH', 'CNC machining', 76, 41],
].map(([id, name, capacity, load]) => ({ id: String(id), name, capacity, load, loadPct: Math.round((Number(load) / Number(capacity)) * 100), status: Number(load) > Number(capacity) ? 'Over capacity' : 'Running well', site: 'Brisbane', shift: 'Day shift, 7:00 to 15:30' }));

const WO_STATUS = ['Completed', 'Completed', 'Completed', 'In progress', 'Released', 'Planned'];
export const workOrders: Row[] = Array.from({ length: 40 }, (_, i) => {
  const num = 1011 + i;
  const so = salesOrders[20 + i];
  const it = so?.lines?.[0]?.item ?? 'PRD-1003';
  const start = addDays(TODAY, -Math.round((40 - i) * 1.6));
  const due = addDays(start, between(r, 3, 8));
  let status = WO_STATUS[i % WO_STATUS.length];
  if (i < 26) status = 'Completed';
  return { id: `WO-${num}`, item: it, itemName: itemName(it), qty: so?.lines?.[0]?.qty ?? 2, order: so?.id, customer: so?.customer, start, due, status, centre: pick(r, ['WC-WELD', 'WC-ASSY', 'WC-CUT', 'WC-PAINT']), progress: status === 'Completed' ? 100 : status === 'In progress' ? between(r, 20, 80) : 0, site: 'Brisbane', planner: 'Liam Kelly' };
});
const setWo = (id: string, patch: Partial<Row>) => {
  const i = workOrders.findIndex((w) => w.id === id);
  workOrders[i] = { ...workOrders[i], ...patch };
};
setWo('WO-1042', {
  item: 'PRD-1001',
  itemName: itemName('PRD-1001'),
  qty: 2,
  order: 'SO-1048',
  customer: 'Harbour Builders',
  start: '2026-10-27',
  due: '2026-11-04',
  status: 'Delayed',
  centre: 'WC-WELD',
  progress: 45,
  bomRevision: 'B',
  delayReason: 'Weld undercut found at inspection INS-0533 (NCR-0121): rework at the welding bay. Plate for the second frame short until PO-0388 arrives.',
  newDue: '2026-11-19',
});
setWo('WO-1046', { status: 'Delayed', due: '2026-11-11', newDue: '2026-11-15', delayReason: 'Gearbox late from Riverside Gearboxes.', item: 'PRD-1002', itemName: itemName('PRD-1002'), order: 'SO-1051' });
setWo('WO-1049', { status: 'Delayed', due: '2026-11-12', newDue: '2026-11-17', delayReason: 'Paint booth extraction fan out of service.', item: 'PRD-1006', itemName: itemName('PRD-1006'), order: 'SO-1053' });

export const WO1042_OPS = [
  { ...OPERATIONS_1001[0], status: 'Completed', planned: 2.0, actual: 2.2, who: 'Noah Becker' },
  { ...OPERATIONS_1001[1], status: 'Completed', planned: 1.5, actual: 1.4, who: 'Noah Becker' },
  { ...OPERATIONS_1001[2], status: 'Rework', planned: 6.5, actual: 8.1, who: 'Noah Becker' },
  { ...OPERATIONS_1001[3], status: 'Waiting', planned: 1.0, actual: 0.8, who: 'Grace Kim' },
  { ...OPERATIONS_1001[4], status: 'Waiting', planned: 3.0, actual: 0, who: '' },
  { ...OPERATIONS_1001[5], status: 'Waiting', planned: 3.25, actual: 0, who: '' },
];
export const WO1042_MATERIALS = [
  { item: 'RM-2001', required: 6, issued: 4, available: 2, note: 'Short 2 sheets until PO-0388 (expected 18 Nov)' },
  { item: 'RM-2002', required: 2, issued: 2, available: 52, note: '' },
  { item: 'RM-2007', required: 2, issued: 2, available: 9, note: '' },
  { item: 'PRD-1008', required: 2, issued: 0, available: 3, note: '' },
  { item: 'RM-2009', required: 32, issued: 0, available: 512, note: '' },
  { item: 'RM-2006', required: 8, issued: 0, available: 44, note: '' },
];

// ------------------------------------------------------------------ quality

const INS_TYPES = ['Receiving inspection', 'In-process inspection', 'Final inspection'];
export const inspections: Row[] = Array.from({ length: 16 }, (_, i) => {
  const num = 525 + i;
  const type = INS_TYPES[i % 3];
  const date = addDays(TODAY, -Math.round((15 - i) * 0.8) + (i > 12 ? 1 : 0));
  return {
    id: `INS-0${num}`,
    type,
    subject: type === 'Receiving inspection' ? `GR-0${205 + (i % 10)}` : `WO-${1030 + i}`,
    item: pick(r, ['PRD-1001', 'PRD-1005', 'RM-2001', 'PRD-1006', 'PRD-1003']),
    inspector: i % 2 ? 'Grace Kim' : 'Ava Singh',
    date,
    status: date > TODAY ? 'Scheduled' : date === TODAY ? 'Open' : i % 5 === 0 ? 'Failed' : 'Passed',
    site: i % 4 === 0 ? 'Sydney' : 'Brisbane',
    plan: type === 'Receiving inspection' ? 'IP-03' : type === 'Final inspection' ? 'IP-02' : 'IP-01',
  };
});
{
  const i = inspections.findIndex((x) => x.id === 'INS-0533');
  inspections[i] = { ...inspections[i], type: 'In-process inspection', subject: 'WO-1042', item: 'PRD-1001', inspector: 'Noah Becker (self-check), Grace Kim', date: '2026-11-11', status: 'Awaiting review', site: 'Brisbane', plan: 'IP-01', operation: '30 Weld frame', ncr: 'NCR-0121' };
  const j = inspections.findIndex((x) => x.id === 'INS-0531');
  inspections[j] = { ...inspections[j], type: 'Receiving inspection', subject: 'GR-0215', item: 'RM-2001', inspector: 'Ava Singh', date: '2026-11-12', status: 'Passed', site: 'Brisbane', plan: 'IP-03' };
}
export const INS0533_CHECKS = [
  { id: 'c1', check: 'Fillet weld size per drawing DWG-1001-02', spec: '6 mm minimum', measured: '6.2 mm', result: 'Pass' },
  { id: 'c2', check: 'Visual: undercut', spec: '0.5 mm maximum', measured: '1.2 mm at joint W7', result: 'Fail' },
  { id: 'c3', check: 'Visual: porosity and cracks', spec: 'None visible', measured: 'None', result: 'Pass' },
  { id: 'c4', check: 'Overall length', spec: '1200 mm ± 2', measured: '1201.0 mm', result: 'Pass' },
  { id: 'c5', check: 'Squareness across diagonals', spec: '3 mm maximum difference', measured: '1.5 mm', result: 'Pass' },
  { id: 'c6', check: 'Gearbox mount hole positions', spec: '± 0.5 mm', measured: 'Within', result: 'Pass' },
  { id: 'c7', check: 'Surface preparation', spec: 'Before coating only', measured: '', result: 'N/A' },
  { id: 'c8', check: 'Identification marks and heat numbers', spec: 'Legible, traceable', measured: 'Heat 77A-1193', result: 'Pass' },
];

export const ncrs: Row[] = [
  ['NCR-0121', 'Weld undercut at joint W7', 'WO-1042', 'Workmanship', 'Open', 'Rework', 'Grace Kim', '2026-11-11'],
  ['NCR-0120', 'Two RHS lengths bent in transit', 'GR-0215', 'Supplier', 'Open', 'Return to supplier', 'Ava Singh', '2026-11-12'],
  ['NCR-0119', 'Coating thickness low on walkway', 'WO-1038', 'Process', 'Closed', 'Rework', 'Grace Kim', '2026-11-03'],
  ['NCR-0118', 'Wrong bolt grade supplied', 'GR-0211', 'Supplier', 'Closed', 'Return to supplier', 'Ava Singh', '2026-10-28'],
  ['NCR-0117', 'Hole position out by 1.5 mm', 'WO-1033', 'Drawing', 'Closed', 'Use as is (engineering approval)', 'Grace Kim', '2026-10-20'],
  ['NCR-0116', 'Paint run on guard panels', 'WO-1031', 'Process', 'Closed', 'Rework', 'Grace Kim', '2026-10-14'],
  ['NCR-0115', 'Missing heat number on plate', 'GR-0207', 'Supplier', 'Closed', 'Use as is (certificate on file)', 'Ava Singh', '2026-10-06'],
  ['NCR-0122', 'Bearing noise at test', 'WO-1044', 'Material', 'Awaiting review', 'Pending', 'Grace Kim', '2026-11-13'],
].map(([id, title, source, cause, status, disposition, owner, raised]) => ({ id: String(id), title, source, cause, status, disposition, owner, raised, site: 'Brisbane' }));

export const capas: Row[] = [
  ['CAPA-031', 'Welder refresher on undercut control', 'NCR-0121', 'Ben Carter', '2026-11-28', 'Open'],
  ['CAPA-030', 'Supplier packing standard for RHS', 'NCR-0120', 'Sara Haddad', '2026-11-30', 'Open'],
  ['CAPA-029', 'Coating thickness gauge at booth exit', 'NCR-0119', 'Grace Kim', '2026-11-10', 'Overdue'],
  ['CAPA-028', 'Bolt grade check at receiving', 'NCR-0118', 'Luca Romano', '2026-11-05', 'Completed'],
  ['CAPA-027', 'Drawing check list update', 'NCR-0117', 'Tom Walsh', '2026-10-31', 'Completed'],
].map(([id, title, ncr, owner, due, status]) => ({ id: String(id), title, ncr, owner, due, status, site: 'Brisbane' }));

export const inspectionPlans: Row[] = [
  ['IP-01', 'Welded frames, in-process', 'In-process inspection', 8, 'Active'],
  ['IP-02', 'Finished conveyor products, final', 'Final inspection', 12, 'Active'],
  ['IP-03', 'Steel plate and sections, receiving', 'Receiving inspection', 6, 'Active'],
  ['IP-04', 'Coated products, coating check', 'In-process inspection', 5, 'Active'],
  ['IP-05', 'Purchased drives and gearboxes', 'Receiving inspection', 4, 'In review'],
].map(([id, name, type, checks, status]) => ({ id: String(id), name, type, checks, status, owner: 'Grace Kim', site: 'Brisbane' }));

export const certificates: Row[] = [
  ['CERT-7781', 'Mill certificate, plate heat 77A-1193', 'Coastline Steel Supply', 'GR-0215', '2026-11-12', 'Valid'],
  ['CERT-7779', 'Mill certificate, RHS heat 41C-0872', 'Coastline Steel Supply', 'GR-0215', '2026-11-12', 'Valid'],
  ['CERT-7770', 'Coating batch certificate, epoxy', 'Apex Coatings', 'GR-0212', '2026-11-04', 'Valid'],
  ['CERT-7764', 'Bolt grade certificate, M16 8.8', 'Metro Fasteners', 'GR-0211', '2026-10-28', 'Rejected'],
  ['CERT-7750', 'Welder qualification, N. Becker', 'Internal', 'WPQR-12', '2025-12-01', 'Expires soon'],
].map(([id, title, issuer, reference, date, status]) => ({ id: String(id), title, issuer, reference, date, status, site: 'Brisbane' }));

// ------------------------------------------------------------------ assets and maintenance

export const assets: Row[] = [
  ['AST-001', 'Fibre laser cutter 6 kW', 'WC-CUT', 'Brisbane', 'Running well', '2026-12-02'],
  ['AST-002', 'Press brake 160 t', 'WC-FOLD', 'Brisbane', 'Running well', '2026-11-26'],
  ['AST-003', 'Welding robot cell', 'WC-WELD', 'Brisbane', 'Running well', '2026-11-19'],
  ['AST-004', 'Paint booth extraction fan', 'WC-PAINT', 'Brisbane', 'Breakdown', '2026-11-13'],
  ['AST-005', 'Forklift 2.5 t (LPG)', 'Warehouse', 'Brisbane', 'Running well', '2026-11-21'],
  ['AST-006', 'Air compressor 37 kW', 'Services', 'Brisbane', 'Running well', '2026-12-09'],
  ['AST-007', 'Overhead crane 5 t', 'WC-ASSY', 'Brisbane', 'Due soon', '2026-11-15'],
  ['AST-008', 'Forklift 1.8 t (electric)', 'Warehouse', 'Sydney', 'Running well', '2026-12-14'],
  ['AST-009', 'CNC machining centre', 'WC-MACH', 'Brisbane', 'Running well', '2027-01-08'],
].map(([id, name, location, site, status, nextService]) => ({ id: String(id), name, location, site, status, nextService, owner: 'Ethan Wu' }));

export const maintenancePlans: Row[] = [
  ['MP-11', 'Laser cutter quarterly service', 'AST-001', 'Every 3 months', '2026-12-02'],
  ['MP-12', 'Press brake hydraulic check', 'AST-002', 'Monthly', '2026-11-26'],
  ['MP-13', 'Robot cell torch and cable check', 'AST-003', 'Weekly', '2026-11-19'],
  ['MP-14', 'Paint booth filters', 'AST-004', 'Monthly', '2026-11-20'],
  ['MP-15', 'Forklift service', 'AST-005', 'Every 250 hours', '2026-11-21'],
  ['MP-16', 'Crane statutory inspection', 'AST-007', 'Every 12 months', '2026-11-15'],
].map(([id, name, asset, frequency, next]) => ({ id: String(id), name, asset, frequency, next, status: next <= addDays(TODAY, 3) ? 'Due soon' : 'Scheduled', site: 'Brisbane' }));

export const workRequests: Row[] = [
  ['WR-208', 'Extraction fan noisy then stopped', 'AST-004', 'Ben Carter', 'High', 'Converted'],
  ['WR-209', 'Forklift horn not working', 'AST-005', 'Luca Romano', 'Low', 'New'],
  ['WR-207', 'Leak at press brake cylinder', 'AST-002', 'Noah Becker', 'Medium', 'Converted'],
  ['WR-206', 'Compressor oil warning light', 'AST-006', 'Ethan Wu', 'Medium', 'Closed'],
].map(([id, title, asset, requester, priority, status], i) => ({ id: String(id), title, asset, requester, priority, status, date: addDays(TODAY, -i - 1), site: 'Brisbane' }));

export const maintenanceOrders: Row[] = [
  ['MO-0612', 'Replace extraction fan bearing', 'AST-004', 'Corrective', 'In progress', 'Ethan Wu', '2026-11-13'],
  ['MO-0611', 'Press brake cylinder seal', 'AST-002', 'Corrective', 'Completed', 'Ethan Wu', '2026-11-10'],
  ['MO-0613', 'Crane statutory inspection', 'AST-007', 'Preventive', 'Scheduled', 'External inspector', '2026-11-15'],
  ['MO-0614', 'Robot cell weekly check', 'AST-003', 'Preventive', 'Scheduled', 'Ethan Wu', '2026-11-19'],
  ['MO-0610', 'Forklift 250-hour service', 'AST-005', 'Preventive', 'Completed', 'Ethan Wu', '2026-11-04'],
].map(([id, title, asset, type, status, technician, date]) => ({ id: String(id), title, asset, type, status, technician, date, site: 'Brisbane', hours: status === 'Completed' ? 3.5 : 0 }));

export const downtime: Row[] = [
  ['DT-0441', 'AST-004', 'Paint booth extraction fan', '2026-11-12', 7.5, 'Breakdown', 'MO-0612'],
  ['DT-0440', 'AST-002', 'Press brake 160 t', '2026-11-09', 2.0, 'Breakdown', 'MO-0611'],
  ['DT-0439', 'AST-003', 'Welding robot cell', '2026-11-06', 1.0, 'Planned', 'MO-0609'],
  ['DT-0438', 'AST-001', 'Fibre laser cutter 6 kW', '2026-11-03', 0.5, 'Changeover', ''],
  ['DT-0437', 'AST-005', 'Forklift 2.5 t (LPG)', '2026-11-04', 3.0, 'Planned', 'MO-0610'],
  ['DT-0436', 'AST-001', 'Fibre laser cutter 6 kW', '2026-10-29', 4.0, 'Breakdown', 'MO-0605'],
].map(([id, asset, name, date, hours, reason, order]) => ({ id: String(id), asset, name, date, hours, reason, order, site: 'Brisbane' }));

// ------------------------------------------------------------------ supply chain

export const carriers: Row[] = [
  ['CAR-01', 'Bluewater Freight', 'General freight', 96, 'Active'],
  ['CAR-02', 'Redline Transport', 'Oversize loads', 91, 'Active'],
  ['CAR-03', 'Southern Haul Logistics', 'Interstate', 88, 'Active'],
  ['CAR-04', 'Own vehicle', 'Local deliveries', 99, 'Active'],
].map(([id, name, service, onTime, status]) => ({ id: String(id), name, service, onTime, status, site: 'Brisbane' }));

export const shipments: Row[] = Array.from({ length: 12 }, (_, i) => {
  const so = salesOrders[44 + i];
  const date = addDays(TODAY, i - 5);
  return {
    id: `SHP-${pad(6101 + i)}`,
    order: so.id,
    customer: so.customer,
    carrier: ['Bluewater Freight', 'Redline Transport', 'Southern Haul Logistics', 'Own vehicle'][i % 4],
    date,
    destination: so.site === 'Sydney' ? 'Sydney NSW' : 'Brisbane QLD',
    status: date < TODAY ? 'Delivered' : date === TODAY ? 'In transit' : so.status === 'Late' ? 'On hold' : 'Scheduled',
    site: so.site,
    tracking: `TRK${between(r, 1000000, 9999999)}`,
  };
});

export const returns: Row[] = [
  ['RMA-021', 'Kestrel Marine Services', 'SO-1036', 'PRD-1005', 'Bearing noise', 'Awaiting review'],
  ['RMA-020', 'Bayside Fabrication', 'SO-1031', 'PRD-1003', 'Wrong mesh option', 'Approved'],
  ['RMA-019', 'Ridgeway Constructions', 'SO-1027', 'PRD-1010', 'Transport damage', 'Closed'],
  ['RMA-022', 'Coastline Steel Supply (to supplier)', 'GR-0215', 'RM-2002', 'Bent in transit', 'Open'],
].map(([id, party, reference, item, reason, status], i) => ({ id: String(id), party, reference, item, reason, status, date: addDays(TODAY, -i * 6 - 1), site: 'Brisbane' }));

export const demandPlan = sellableDemand();
function sellableDemand() {
  const months = ['Dec 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27'];
  return ['PRD-1001', 'PRD-1002', 'PRD-1005', 'PRD-1006', 'PRD-1010'].map((item, i) => ({ item, name: itemName(item), months, forecast: months.map((_, m) => Math.max(0, Math.round(4 + i * 2 + Math.sin(m + i) * 3))), confirmed: months.map((_, m) => (m < 2 ? Math.round(3 + i * 1.5) : 0)) }));
}

export const customersForSelect = CUSTOMERS.map((c) => c[1]);
