// Sales, Customer Relationship Management and Finance records (demonstration data). The prototype's story: Harbour
// Builders is waiting for sales order SO-1048, which is late because work order WO-1042 failed a weld inspection.
import { addDays, between, money, pad, pick, rng, TODAY } from '../format';
import type { Row } from '../types';
import { CUSTOMERS, ITEMS, SUPPLIERS, itemName } from './core';

export interface Line {
  item: string;
  desc: string;
  qty: number;
  unit: string;
  price: number;
}
export const line = (item: string, qty: number, price?: number): Line => {
  const it = ITEMS.find((i) => i[0] === item);
  return { item, desc: itemName(item), qty, unit: it?.[3] ?? 'each', price: price ?? Number(it?.[5] ?? 0) };
};
export const linesTotal = (lines: Line[]) => lines.reduce((s, l) => s + l.qty * l.price, 0);

const FINISHED = ITEMS.filter((i) => i[2] === 'Finished good').map((i) => i[0]);
const r = rng(2026);

// ------------------------------------------------------------------ customers and CRM

const SEG_REVENUE: Record<string, number> = { 'CUS-001': 412_600, 'CUS-003': 538_900, 'CUS-005': 297_300 };
export const customers: Row[] = CUSTOMERS.map(([id, name, segment, site, owner], i) => ({
  id,
  name,
  segment,
  site,
  owner,
  city: site,
  status: i === 9 ? 'On hold' : i === 11 ? 'Prospect' : 'Active',
  ytdRevenue: SEG_REVENUE[id] ?? between(r, 40, 260) * 1000,
  openPipeline: between(r, 20, 320) * 1000,
  phone: `(0${site === 'Sydney' ? 2 : 7}) 5550 01${pad(i + 10, 2)}`,
  email: `accounts@${name.toLowerCase().replace(/[^a-z]+/g, '')}.example.com`,
  lastActivity: addDays(TODAY, -between(r, 0, 20)),
  terms: i % 3 === 0 ? '30 days' : '14 days',
}));

const FIRST = ['Olivia', 'James', 'Charlotte', 'William', 'Amelia', 'Lucas', 'Mia', 'Henry', 'Grace', 'Oscar', 'Sophie', 'Leo', 'Ella', 'Max', 'Chloe', 'Archie', 'Lily', 'Hugo', 'Ivy', 'Felix'];
const LAST = ['Bennett', 'Hughes', 'Reid', 'Shaw', 'Lawson', 'Pearce', 'Dunn', 'Fleming', 'Gibbs', 'Holt', 'Marsh', 'Nolan', 'Price', 'Quinn', 'Rowe', 'Sutton', 'Tate', 'Vaughan', 'Webb', 'Young'];
const TITLES = ['Project manager', 'Procurement officer', 'Site engineer', 'Accounts payable', 'Operations manager', 'Maintenance planner'];
export const contacts: Row[] = FIRST.map((f, i) => {
  const c = CUSTOMERS[i % CUSTOMERS.length];
  const name = `${f} ${LAST[i]}`;
  return {
    id: `CON-${pad(101 + i, 3)}`,
    name,
    customer: c[1],
    customerId: c[0],
    title: TITLES[i % TITLES.length],
    email: `${f.toLowerCase()}.${LAST[i].toLowerCase()}@${c[1].toLowerCase().replace(/[^a-z]+/g, '')}.example.com`,
    phone: `0491 570 ${['156', '157', '158', '159', '110'][i % 5]}`,
    site: c[3],
    status: 'Active',
  };
});
contacts[0] = { ...contacts[0], name: 'Olivia Bennett', title: 'Project manager' };

export const leads: Row[] = [
  ['Eastern Quarry Group', 'Website', 'New', 72],
  ['Riverbend Council Works', 'Referral', 'Contacted', 64],
  ['Gulf Port Services', 'Trade show', 'Qualified', 81],
  ['Highline Scaffolding', 'Website', 'New', 38],
  ['Tasman Aggregates', 'Referral', 'Qualified', 77],
  ['Clearwater Treatment', 'Email campaign', 'Contacted', 55],
  ['Redgum Agriculture', 'Website', 'Disqualified', 21],
  ['Stonefield Precast', 'Trade show', 'New', 46],
  ['Northern Pipeline Co', 'Referral', 'Contacted', 68],
  ['Bright Harbour Ferries', 'Website', 'New', 33],
  ['Granite Peak Resources', 'Trade show', 'Qualified', 85],
  ['Silverleaf Packaging', 'Email campaign', 'Contacted', 49],
].map(([company, source, status, score], i) => ({
  id: `LEAD-${pad(301 + i, 3)}`,
  company,
  contact: `${FIRST[(i + 5) % 20]} ${LAST[(i + 7) % 20]}`,
  source,
  status,
  score,
  owner: i % 2 ? 'Ruby Fraser' : 'Priya Nair',
  site: i % 3 ? 'Brisbane' : 'Sydney',
  created: addDays(TODAY, -between(r, 1, 40)),
}));

const STAGES = ['Qualify', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const OPP_TITLES = ['Conveyor upgrade', 'Plant walkway package', 'Hopper replacement', 'Guarding retrofit', 'Stair access package', 'Idler change-out program', 'Control cabinet bases', 'Discharge spout rework'];
export const opportunities: Row[] = Array.from({ length: 18 }, (_, i) => {
  const c = CUSTOMERS[(i * 5) % CUSTOMERS.length];
  const stage = i === 0 ? 'Negotiation' : STAGES[i % 5 === 4 && i > 10 ? 4 : i % 4];
  return {
    id: `OPP-${pad(201 + i, 3)}`,
    title: `${OPP_TITLES[i % OPP_TITLES.length]}`,
    customer: c[1],
    customerId: c[0],
    stage,
    value: between(r, 18, 240) * 1000,
    probability: { Qualify: 20, Proposal: 45, Negotiation: 70, Won: 100, Lost: 0 }[stage],
    close: addDays(TODAY, between(r, -10, 60)),
    owner: c[4],
    site: c[3],
  };
});
opportunities[0] = { ...opportunities[0], title: 'Conveyor drive frames, stage 2', customer: 'Harbour Builders', customerId: 'CUS-001', value: 96_400, owner: 'Priya Nair', site: 'Sydney', quote: 'QU-0107' };

const ACT_TYPES = ['Call', 'Meeting', 'Email', 'Follow-up'];
export const activities: Row[] = Array.from({ length: 16 }, (_, i) => {
  const c = CUSTOMERS[(i * 7) % CUSTOMERS.length];
  const due = addDays(TODAY, between(r, -4, 10));
  return {
    id: `ACT-${pad(501 + i, 3)}`,
    type: ACT_TYPES[i % 4],
    subject: ['Confirm delivery window', 'Review quotation', 'Site visit', 'Send revised drawings', 'Check payment status', 'Discuss stage 2 scope'][i % 6],
    customer: c[1],
    customerId: c[0],
    due,
    owner: c[4],
    status: due < TODAY && i % 3 ? 'Done' : 'Open',
    site: c[3],
  };
});
activities[0] = { ...activities[0], subject: 'Follow up QU-0107 with Olivia Bennett', customer: 'Harbour Builders', customerId: 'CUS-001', due: TODAY, owner: 'Priya Nair', status: 'Open', type: 'Follow-up' };

// ------------------------------------------------------------------ quotes

export const quotes: Row[] = Array.from({ length: 16 }, (_, i) => {
  const n = 100 + i;
  const c = CUSTOMERS[(i * 3 + 1) % CUSTOMERS.length];
  const lines = [line(pick(r, FINISHED), between(r, 1, 6)), line(pick(r, FINISHED), between(r, 2, 12))];
  const issued = addDays(TODAY, -between(r, 2, 50));
  const status = i < 5 ? 'Accepted' : i % 4 === 0 ? 'Expired' : i % 3 === 0 ? 'Draft' : 'Sent';
  return { id: `QU-${pad(n)}`, customer: c[1], customerId: c[0], issued, expires: addDays(issued, 30), status, lines, total: linesTotal(lines) * 1.1, owner: c[4], site: c[3] };
});
const qu107 = [line('PRD-1001', 4, 4850), line('PRD-1008', 4, 720), line('PRD-1005', 16, 410)];
quotes[7] = {
  id: 'QU-0107',
  customer: 'Harbour Builders',
  customerId: 'CUS-001',
  issued: '2026-11-04',
  expires: '2026-11-20',
  status: 'Sent',
  lines: qu107,
  total: linesTotal(qu107) * 1.1,
  owner: 'Priya Nair',
  site: 'Sydney',
  opportunity: 'OPP-201',
  note: 'Stage 2 of the conveyor upgrade at the Harbour Builders yard. Revision C frames.',
};

// ------------------------------------------------------------------ sales orders

const SO_STATUS = ['Confirmed', 'In production', 'Ready', 'Delivered', 'Delivered', 'Invoiced'];
export const salesOrders: Row[] = Array.from({ length: 60 }, (_, i) => {
  const n = 1001 + i;
  const c = CUSTOMERS[(i * 7 + 3) % CUSTOMERS.length];
  const ordered = addDays(TODAY, -Math.round((60 - i) * 5.6) - between(r, 0, 3));
  const lines = [line(pick(r, FINISHED), between(r, 1, 5)), ...(i % 3 ? [line(pick(r, FINISHED), between(r, 2, 10))] : [])];
  const promised = addDays(ordered, between(r, 18, 34));
  let status = i < 40 ? (i % 9 === 0 ? 'Invoiced' : 'Delivered') : promised < TODAY ? 'Delivered' : SO_STATUS[i % 3];
  if (i >= 40 && promised >= TODAY) status = SO_STATUS[i % 3];
  return { id: `SO-${n}`, customer: c[1], customerId: c[0], ordered, promised, status, lines, total: linesTotal(lines) * 1.1, owner: c[4], site: c[3], department: 'Sales' };
});
const so1048Lines = [line('PRD-1001', 2, 4850), line('PRD-1005', 8, 410)];
const patchSo = (id: string, patch: Partial<Row>) => {
  const i = salesOrders.findIndex((s) => s.id === id);
  salesOrders[i] = { ...salesOrders[i], ...patch };
};
patchSo('SO-1048', {
  customer: 'Harbour Builders',
  customerId: 'CUS-001',
  ordered: '2026-10-09',
  promised: '2026-11-06',
  status: 'Late',
  lines: so1048Lines,
  total: linesTotal(so1048Lines) * 1.1,
  owner: 'Priya Nair',
  site: 'Brisbane',
  workOrder: 'WO-1042',
  quote: 'QU-0098',
  delayReason: 'Work order WO-1042 failed its weld inspection (INS-0533, NCR-0121) and is waiting for replacement plate on PO-0388.',
});
patchSo('SO-1051', { status: 'Late', promised: '2026-11-10', delayReason: 'Gearbox from Riverside Gearboxes arrived late.' });
patchSo('SO-1053', { status: 'Late', promised: '2026-11-12', delayReason: 'Paint booth extraction fan out of service (MO-0612).' });
patchSo('SO-1049', { status: 'In production', promised: '2026-11-19' });
patchSo('SO-1044', { customer: 'Harbour Builders', customerId: 'CUS-001', status: 'Invoiced', site: 'Sydney', owner: 'Priya Nair' });
patchSo('SO-1050', { status: 'Ready', promised: '2026-11-14' });

export const deliveries: Row[] = salesOrders
  .filter((s) => ['Delivered', 'Invoiced', 'Ready'].includes(s.status))
  .slice(-14)
  .map((s, i) => ({
    id: `DEL-${pad(3301 + i)}`,
    order: s.id,
    customer: s.customer,
    customerId: s.customerId,
    date: s.status === 'Ready' ? addDays(TODAY, 1) : addDays(s.promised, -between(r, 0, 2)),
    carrier: ['Bluewater Freight', 'Redline Transport', 'Own vehicle'][i % 3],
    status: s.status === 'Ready' ? 'Scheduled' : 'Delivered',
    site: s.site,
    packages: between(r, 1, 6),
  }));

// ------------------------------------------------------------------ invoices, credit notes, bills, claims

export const invoices: Row[] = Array.from({ length: 100 }, (_, i) => {
  const n = 2200 + i;
  const c = CUSTOMERS[(i * 5 + 2) % CUSTOMERS.length];
  const issued = addDays(TODAY, -Math.round((100 - i) * 3.4) - between(r, 0, 2));
  const terms = c[0] === 'CUS-001' || i % 3 === 0 ? 30 : 14;
  const due = addDays(issued, terms);
  const amount = between(r, 60, 420) * 100 * 1.1;
  let status = 'Paid';
  if (i >= 85) status = due < TODAY ? (i % 3 === 0 ? 'Overdue' : 'Paid') : i > 96 ? 'Draft' : 'Awaiting payment';
  const paid = status === 'Paid' ? amount : 0;
  return {
    id: `INV-${n}`,
    customer: c[1],
    customerId: c[0],
    issued,
    due,
    total: Math.round(amount * 100) / 100,
    paid,
    balance: Math.round((amount - paid) * 100) / 100,
    status,
    site: c[3],
    department: i % 4 === 0 ? 'Projects' : 'Sales',
    order: i >= 40 ? `SO-${1001 + i - 40}` : undefined,
  };
});
{
  const i = invoices.findIndex((v) => v.id === 'INV-2291');
  invoices[i] = {
    ...invoices[i],
    customer: 'Harbour Builders',
    customerId: 'CUS-001',
    issued: '2026-10-28',
    due: '2026-11-27',
    total: 48_620,
    paid: 20_000,
    balance: 28_620,
    status: 'Partly paid',
    site: 'Sydney',
    order: 'SO-1044',
    payments: [{ date: '2026-11-05', method: 'Bank transfer', reference: 'HB-PAY-5521', amount: 20_000, by: 'Mei Lin' }],
    reminders: [{ date: '2026-11-12', note: 'Statement sent to accounts@harbourbuilders.example.com' }],
  };
}

export const creditNotes: Row[] = [
  ['CN-0041', 'Harbour Builders', '2026-10-30', 1_320, 'INV-2287', 'Applied'],
  ['CN-0042', 'Ridgeway Constructions', '2026-11-03', 486, 'INV-2289', 'Approved'],
  ['CN-0043', 'Bayside Fabrication', '2026-11-08', 2_150, 'INV-2290', 'Awaiting approval'],
  ['CN-0044', 'Northgate Mining Services', '2026-11-11', 742, 'INV-2286', 'Draft'],
  ['CN-0040', 'Pinnacle Plant Hire', '2026-10-21', 360, 'INV-2279', 'Applied'],
  ['CN-0039', 'Summit Rail Maintenance', '2026-10-14', 1_980, 'INV-2273', 'Applied'],
].map(([id, customer, date, total, invoice, status]) => ({ id: String(id), customer, date, total, invoice, status, reason: 'Pricing correction', site: 'Brisbane' }));

export const bills: Row[] = Array.from({ length: 24 }, (_, i) => {
  const s = SUPPLIERS[(i * 3) % SUPPLIERS.length];
  const date = addDays(TODAY, -between(r, 2, 45));
  const due = addDays(date, 30);
  const status = i < 3 ? 'Awaiting approval' : due < TODAY ? (i % 4 === 0 ? 'Overdue' : 'Paid') : i % 3 === 0 ? 'Approved' : 'Awaiting payment';
  return { id: `BILL-${pad(711 + i)}`, supplier: s[1], supplierId: s[0], date, due, total: between(r, 4, 120) * 110, status, site: s[3], reference: `${s[1].split(' ')[0].toUpperCase()}-${between(r, 10000, 99999)}`, order: i < 8 ? `PO-0${378 + i}` : undefined };
});
bills[0] = { ...bills[0], supplier: 'Coastline Steel Supply', supplierId: 'SUP-01', total: 9_856, status: 'Awaiting approval', order: 'PO-0385', reference: 'CSS-48817' };

export const expenseClaims: Row[] = [
  ['EXP-0091', 'Hannah Brooks', 'Site visit, Harbour Builders yard', 212.4, 'Awaiting approval'],
  ['EXP-0090', 'Tom Walsh', 'Calibration gauges', 148.0, 'Approved'],
  ['EXP-0089', 'Priya Nair', 'Client lunch, Summit Rail', 96.5, 'Paid'],
  ['EXP-0088', 'Ben Carter', 'Safety boots, new starter', 189.0, 'Paid'],
  ['EXP-0087', 'Ethan Wu', 'Hire of scissor lift (1 day)', 340.0, 'Approved'],
  ['EXP-0086', 'Luca Romano', 'Pallet wrap, urgent', 74.9, 'Paid'],
  ['EXP-0085', 'Grace Kim', 'Training course, weld inspection', 680.0, 'Paid'],
  ['EXP-0084', 'Ruby Fraser', 'Travel, Sydney customer visits', 412.3, 'Returned'],
].map(([id, person, purpose, total, status], i) => ({ id: String(id), person, purpose, total, status, date: addDays(TODAY, -i * 3 - 1), site: i % 3 ? 'Brisbane' : 'Sydney' }));

// ------------------------------------------------------------------ banking and accounting

export const bankAccounts = [
  { id: 'BA-1', name: 'Operating account', number: '•••• 4821', balance: 486_210.55, unreconciled: 9 },
  { id: 'BA-2', name: 'Tax holding account', number: '•••• 7790', balance: 92_400.0, unreconciled: 0 },
  { id: 'BA-3', name: 'Business card', number: '•••• 1043', balance: -6_842.18, unreconciled: 3 },
];
export const statementLines: Row[] = [
  ['2026-11-12', 'HARBOUR BUILDERS HB-PAY-5521', 20_000, 'INV-2291', 'Matched'],
  ['2026-11-12', 'COASTLINE STEEL SUPPLY', -9_856, 'BILL-0711', 'To match'],
  ['2026-11-12', 'NORTHGATE MINING SVCS', 14_872.5, 'INV-2288', 'To match'],
  ['2026-11-11', 'METRO FASTENERS PTY', -1_243.1, 'BILL-0714', 'To match'],
  ['2026-11-11', 'DELTA INDUSTRIAL GASES', -688.4, '', 'To match'],
  ['2026-11-10', 'SUMMIT RAIL MAINT', 22_110, 'INV-2285', 'To match'],
  ['2026-11-10', 'BANK FEE', -18, '', 'To match'],
  ['2026-11-09', 'APEX COATINGS', -2_430.8, 'BILL-0717', 'To match'],
  ['2026-11-08', 'PAYROLL CLEARING', -84_312.66, '', 'To match'],
  ['2026-11-08', 'RIDGEWAY CONSTRUCTIONS', 6_820, 'INV-2283', 'Matched'],
].map(([date, description, amount, suggestion, status], i) => ({ id: `BSL-${pad(9301 + i)}`, date, description, amount, suggestion, status, account: 'Operating account' }));

export const chartOfAccounts = [
  ['1-1100', 'Operating account', 'Bank', 486_210.55],
  ['1-1200', 'Accounts receivable', 'Current asset', 312_884.2],
  ['1-1300', 'Inventory: raw materials', 'Current asset', 148_302.0],
  ['1-1310', 'Inventory: work in progress', 'Current asset', 61_940.0],
  ['1-1320', 'Inventory: finished goods', 'Current asset', 92_115.0],
  ['1-2100', 'Plant and equipment', 'Fixed asset', 1_284_000.0],
  ['2-1100', 'Accounts payable', 'Current liability', -158_420.9],
  ['2-1300', 'GST collected', 'Current liability', -64_218.4],
  ['2-1310', 'GST paid', 'Current liability', 31_906.7],
  ['4-1000', 'Sales: fabricated products', 'Income', -2_918_400.0],
  ['4-2000', 'Sales: project services', 'Income', -486_200.0],
  ['5-1000', 'Cost of goods sold', 'Cost of sales', 1_962_300.0],
  ['6-1000', 'Wages and salaries', 'Expense', 884_120.0],
  ['6-2000', 'Rent', 'Expense', 186_000.0],
  ['6-3000', 'Repairs and maintenance', 'Expense', 48_920.0],
].map(([code, name, type, balance]) => ({ code, name, type, balance }));

export const gstPeriods = [
  { period: 'Oct 2026', sales: 642_180, gstOnSales: 64_218, purchases: 319_067, gstOnPurchases: 31_907, status: 'Prepared' },
  { period: 'Sep 2026', sales: 588_420, gstOnSales: 58_842, purchases: 301_550, gstOnPurchases: 30_155, status: 'Lodged' },
  { period: 'Aug 2026', sales: 611_090, gstOnSales: 61_109, purchases: 296_400, gstOnPurchases: 29_640, status: 'Lodged' },
];

export const budgets = [
  ['Sales: fabricated products', 2_850_000, 2_918_400],
  ['Sales: project services', 520_000, 486_200],
  ['Cost of goods sold', 1_880_000, 1_962_300],
  ['Wages and salaries', 905_000, 884_120],
  ['Repairs and maintenance', 42_000, 48_920],
  ['Freight', 64_000, 58_310],
].map(([name, budget, actual]) => ({ name, budget, actual }));

export const fmtLineTotal = (l: Line) => money(l.qty * l.price, true);
