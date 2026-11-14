// Every kind of record in the prototype: its list columns, saved views, record tabs, related records, actions,
// approval steps and create form. The list, record and form patterns (patterns/) read these definitions, so every
// module looks and behaves the same.
import { useMemo } from 'react';
import { ITEMS, itemName } from './data/core';
import * as SF from './data/sales-finance';
import * as OP from './data/operations';
import { addDays, fmtDate, fmtDateTime, money, TODAY } from './format';
import { useErp } from './state';
import type { Column, ColKind, DocRef, EntityDef, FieldDef, RelatedRef, Row, WorkflowStep } from './types';
import { ENTITY_PATH } from './links';
import * as Parts from './pages/recordParts';

const c = (key: string, label: string, kind: ColKind = 'text', extra: Partial<Column> = {}): Column => ({ key, label, kind, ...extra });
const f = (name: string, label: string, type: FieldDef['type'], extra: Partial<FieldDef> = {}): FieldDef => ({ name, label, type, ...extra });

const CUSTOMER_NAMES = SF.customers.map((x) => x.name);
const SUPPLIER_NAMES = OP.suppliers.map((x) => x.name);
const SITES = ['Brisbane', 'Sydney'];
const PRODUCT_OPTIONS = ITEMS.map((i) => `${i[0]} ${i[1]}`);

function docsFor(r: Row, label: string): DocRef[] {
  return [
    { name: `${r.id}.pdf`, kind: `${label} (PDF)`, size: '84 KB', date: r.issued ?? r.ordered ?? r.date ?? r.raised ?? TODAY },
    { name: `${r.id}-attachments.zip`, kind: 'Attachments', size: '1.2 MB', date: r.issued ?? r.ordered ?? r.date ?? TODAY },
  ];
}

/** Approval steps from a record's status: who submitted, who approves and what happens next. */
function approval(r: Row, opts: { submittedBy: string; submittedAt: string; approver: string; approveLabel: string; next: string; nextBy: string; pre?: WorkflowStep[] }): WorkflowStep[] {
  const st = r.status as string;
  const approved = !['Draft', 'Awaiting approval', 'Returned', 'In review', 'Open', 'Awaiting review'].includes(st);
  const returned = st === 'Returned' || st === 'Rejected';
  const draft = st === 'Draft';
  return [
    { label: 'Submitted', who: opts.submittedBy, when: draft ? undefined : opts.submittedAt, state: draft ? 'current' : 'done' },
    ...(opts.pre ?? []).map((s) => ({ ...s, state: draft ? ('waiting' as const) : s.state })),
    {
      label: opts.approveLabel,
      who: r.approvedBy ?? opts.approver,
      when: r.approvedAt ?? r.returnedAt,
      state: draft ? 'waiting' : returned ? 'returned' : approved ? 'done' : 'current',
      comment: r.approvalComment ?? r.returnComment,
    },
    { label: opts.next, who: opts.nextBy, state: approved && !returned ? (['Approved', 'Rework'].includes(st) ? 'current' : 'done') : 'waiting' },
  ];
}

const related = (pairs: [string, string | undefined | null, string?][]): RelatedRef[] => pairs.filter(([, id]) => !!id).map(([entity, id, note]) => ({ entity, id: id as string, note }));

export const ENTITIES: Record<string, EntityDef> = {};
const def = (e: EntityDef) => (ENTITIES[e.key] = e);

// ------------------------------------------------------------------ Sales & Customers

def({
  key: 'customer',
  label: 'Customer',
  plural: 'Customers',
  path: ENTITY_PATH.customer,
  module: 'CRM',
  scope: 'Customers',
  rows: SF.customers,
  title: (r) => r.name,
  subtitle: (r) => `${r.segment} · ${r.city}`,
  columns: [c('id', 'Number', 'id'), c('name', 'Name', 'text', { card: true }), c('segment', 'Segment'), c('site', 'Site'), c('owner', 'Owner', 'text', { card: true }), c('ytdRevenue', 'Revenue this year', 'money', { card: true }), c('openPipeline', 'Open pipeline', 'money'), c('lastActivity', 'Last activity', 'date', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'active', label: 'Active', conditions: [{ field: 'status', op: 'is', value: 'Active' }], builtIn: true },
    { id: 'sydney', label: 'Sydney customers', conditions: [{ field: 'site', op: 'is', value: 'Sydney' }], builtIn: true },
  ],
  details: [
    { group: 'Company', keys: [['name', 'Name'], ['segment', 'Segment'], ['city', 'City'], ['terms', 'Payment terms']] },
    { group: 'Contact', keys: [['phone', 'Phone'], ['email', 'Accounts email'], ['owner', 'Account owner']] },
  ],
  tabs: [
    { id: 'quotes', label: 'Quotes', render: (r) => <Parts.CustomerQuotes r={r} /> },
    { id: 'orders', label: 'Orders', render: (r) => <Parts.CustomerOrders r={r} /> },
    { id: 'invoices', label: 'Invoices', render: (r) => <Parts.CustomerInvoices r={r} /> },
  ],
  related: (r) => [
    ...SF.contacts.filter((x) => x.customerId === r.id).map((x) => ({ entity: 'contact', id: x.id })),
    ...SF.opportunities.filter((x) => x.customerId === r.id).map((x) => ({ entity: 'opportunity', id: x.id })),
    ...OP.projects.filter((x) => x.customer === r.name).map((x) => ({ entity: 'project', id: x.id })),
  ],
  actions: () => [{ label: 'Log activity', icon: 'plus', toast: 'Activity form opens in the CRM (prototype).' }, { label: 'New quote', primary: true, icon: 'file', to: '/sales/quotes/new' }],
  form: {
    title: 'New customer',
    intro: 'Customers are kept in the Customer Relationship Management (CRM). This is its form, shown inside ERP.',
    groups: [
      { title: 'Company', description: 'The name customers know you by and how to reach them.', fields: [f('name', 'Company name', 'text', { required: true }), f('segment', 'Segment', 'select', { options: ['Construction', 'Mining', 'Rail', 'Utilities', 'Marine', 'Manufacturing', 'Logistics', 'Food'], default: 'Construction' }), f('site', 'Site', 'select', { options: SITES, default: 'Brisbane', description: 'The site that serves this customer.' })] },
      { title: 'Accounts', fields: [f('email', 'Accounts email', 'text', { description: 'Invoices and statements go here.' }), f('terms', 'Payment terms', 'select', { options: ['14 days', '30 days', '45 days'], default: '30 days' }), f('owner', 'Account owner', 'select', { options: ['Priya Nair', 'Ruby Fraser'], default: 'Priya Nair' })] },
    ],
    toRow: (v) => ({ name: v.name, segment: v.segment, site: v.site, city: v.site, owner: v.owner, terms: v.terms, email: v.email, ytdRevenue: 0, openPipeline: 0, status: 'Prospect', lastActivity: TODAY }),
  },
});

def({
  key: 'contact',
  label: 'Contact',
  plural: 'Contacts',
  path: ENTITY_PATH.contact,
  module: 'CRM',
  scope: 'Contacts',
  rows: SF.contacts,
  title: (r) => r.name,
  subtitle: (r) => `${r.title}, ${r.customer}`,
  columns: [c('id', 'Number', 'id'), c('name', 'Name', 'text', { card: true }), c('customer', 'Customer', 'text', { card: true }), c('title', 'Job title'), c('email', 'Email'), c('phone', 'Phone'), c('site', 'Site')],
  related: (r) => related([['customer', r.customerId]]),
});

def({
  key: 'lead',
  label: 'Lead',
  plural: 'Leads',
  path: ENTITY_PATH.lead,
  module: 'CRM',
  rows: SF.leads,
  title: (r) => r.company,
  subtitle: (r) => `${r.contact} · ${r.source}`,
  columns: [c('id', 'Number', 'id'), c('company', 'Company', 'text', { card: true }), c('contact', 'Contact'), c('source', 'Source'), c('score', 'Score', 'number', { card: true }), c('owner', 'Owner'), c('created', 'Created', 'date'), c('status', 'Status', 'status')],
  views: [{ id: 'qualified', label: 'Qualified', conditions: [{ field: 'status', op: 'is', value: 'Qualified' }], builtIn: true }],
  actions: () => [{ label: 'Convert to opportunity', primary: true, patch: { status: 'Qualified' }, toast: 'Lead converted (prototype: no record is created in the CRM).' }],
});

def({
  key: 'opportunity',
  label: 'Opportunity',
  plural: 'Opportunities',
  path: ENTITY_PATH.opportunity,
  module: 'CRM',
  scope: 'Opportunities',
  rows: SF.opportunities,
  title: (r) => r.title,
  subtitle: (r) => r.customer,
  columns: [c('id', 'Number', 'id'), c('title', 'Opportunity', 'text', { card: true }), c('customer', 'Customer', 'text', { card: true }), c('stage', 'Stage', 'status'), c('value', 'Value', 'money', { card: true }), c('probability', 'Probability', 'percent'), c('close', 'Expected close', 'date'), c('owner', 'Owner')],
  related: (r) => related([['customer', r.customerId], ['quote', r.quote]]),
  actions: (r) => [{ label: 'Mark as won', primary: true, patch: { stage: 'Won', probability: 100 }, toast: `${r.id} marked as won.`, when: (x) => x.stage !== 'Won' }],
  form: {
    title: 'New opportunity',
    intro: 'Opportunities are kept in the CRM. This is its form, shown inside ERP.',
    groups: [{ title: 'Opportunity', fields: [f('title', 'Title', 'text', { required: true }), f('customer', 'Customer', 'select', { options: CUSTOMER_NAMES, required: true }), f('value', 'Value (AUD, excluding GST)', 'money', { required: true, min: 1 }), f('close', 'Expected close', 'date', { default: addDays(TODAY, 30) }), f('stage', 'Stage', 'select', { options: ['Qualify', 'Proposal', 'Negotiation'], default: 'Qualify' })] }],
    toRow: (v) => ({ title: v.title, customer: v.customer, value: Number(v.value), close: v.close, stage: v.stage, probability: 20, owner: 'Alex Morgan', site: 'Brisbane' }),
  },
});

def({
  key: 'activity',
  label: 'Activity',
  plural: 'Activities',
  path: ENTITY_PATH.activity,
  module: 'CRM',
  rows: SF.activities,
  title: (r) => r.subject,
  subtitle: (r) => `${r.type} · ${r.customer}`,
  columns: [c('id', 'Number', 'id'), c('subject', 'Subject', 'text', { card: true }), c('type', 'Type'), c('customer', 'Customer'), c('due', 'Due', 'date', { card: true }), c('owner', 'Owner'), c('status', 'Status', 'status')],
  views: [{ id: 'open', label: 'Open', conditions: [{ field: 'status', op: 'is', value: 'Open' }], builtIn: true }],
  related: (r) => related([['customer', r.customerId]]),
  actions: () => [{ label: 'Complete', primary: true, icon: 'check', patch: { status: 'Done' }, toast: 'Activity completed.', when: (x) => x.status !== 'Done' }],
});

def({
  key: 'quote',
  label: 'Quote',
  plural: 'Quotes',
  path: ENTITY_PATH.quote,
  module: 'Finance',
  scope: 'Quotes',
  rows: [...SF.quotes].reverse(),
  title: (r) => `Quote for ${r.customer}`,
  subtitle: (r) => `Issued ${fmtDate(r.issued)} · expires ${fmtDate(r.expires)}`,
  columns: [c('id', 'Number', 'id'), c('customer', 'Customer', 'text', { card: true }), c('issued', 'Issued', 'date'), c('expires', 'Expires', 'date', { card: true }), c('total', 'Total incl. GST', 'money', { card: true }), c('owner', 'Owner'), c('site', 'Site', 'text', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'awaiting', label: 'Awaiting answer', conditions: [{ field: 'status', op: 'is', value: 'Sent' }], builtIn: true },
    { id: 'expiring', label: 'Expiring in 14 days', conditions: [{ field: 'status', op: 'is', value: 'Sent' }, { field: 'expires', op: 'before', value: addDays(TODAY, 14) }], builtIn: true },
  ],
  overview: (r) => (
    <>
      {r.note ? <p className="erp-note">{r.note}</p> : null}
      <Parts.LinesTable lines={r.lines} />
    </>
  ),
  related: (r) => related([['customer', r.customerId], ['opportunity', r.opportunity]]),
  docs: (r) => docsFor(r, 'Quote'),
  actions: (r) => [
    { label: 'Mark as accepted', patch: { status: 'Accepted' }, toast: `${r.id} accepted. A sales order can now be created.`, when: (x) => x.status === 'Sent' },
    { label: 'Create sales order', primary: true, icon: 'cart', to: '/sales/orders/new', when: (x) => x.status === 'Accepted' },
    { label: 'Send reminder', primary: true, icon: 'mail', toast: 'Reminder sent from Finance (prototype: nothing is sent).', when: (x) => x.status === 'Sent' },
  ],
  form: {
    title: 'New quote',
    intro: 'Quotes are kept in Finance. This is its form, shown inside ERP.',
    groups: [
      { title: 'Customer', fields: [f('customer', 'Customer', 'select', { options: CUSTOMER_NAMES, required: true }), f('issued', 'Issue date', 'date', { default: TODAY }), f('expires', 'Expiry date', 'date', { default: addDays(TODAY, 30), description: 'Quotes are valid for 30 days by default.' })] },
      { title: 'Line', description: 'Add more lines on the quote after saving.', fields: [f('item', 'Product', 'select', { options: PRODUCT_OPTIONS, required: true }), f('qty', 'Quantity', 'number', { default: 1, min: 1, required: true })] },
    ],
    toRow: (v) => {
      const id = String(v.item).split(' ')[0];
      const lines = [SF.line(id, Number(v.qty))];
      return { customer: v.customer, issued: v.issued, expires: v.expires, lines, total: SF.linesTotal(lines) * 1.1, owner: 'Alex Morgan', site: 'Brisbane' };
    },
  },
});

def({
  key: 'salesOrder',
  label: 'Sales order',
  plural: 'Sales orders',
  path: ENTITY_PATH.salesOrder,
  module: 'ERP',
  scope: 'Orders',
  rows: [...SF.salesOrders].reverse(),
  title: (r) => `Sales order for ${r.customer}`,
  subtitle: (r) => `Ordered ${fmtDate(r.ordered)} · promised ${fmtDate(r.promised)}`,
  columns: [c('id', 'Number', 'id'), c('customer', 'Customer', 'text', { card: true }), c('ordered', 'Ordered', 'date'), c('promised', 'Promised', 'date', { card: true }), c('total', 'Total incl. GST', 'money', { card: true }), c('site', 'Site'), c('owner', 'Owner', 'text', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'late', label: 'Late', conditions: [{ field: 'status', op: 'is', value: 'Late' }], builtIn: true },
    { id: 'open', label: 'Open', conditions: [{ field: 'status', op: 'isNot', value: 'Delivered' }, { field: 'status', op: 'isNot', value: 'Invoiced' }], builtIn: true },
  ],
  overview: (r) => (
    <>
      <Parts.DelayNote r={r} />
      <Parts.LinesTable lines={r.lines} />
    </>
  ),
  tabs: [{ id: 'fulfilment', label: 'Fulfilment', render: (r) => <Parts.OrderFulfilment r={r} /> }],
  related: (r) => related([['customer', r.customerId], ['quote', r.quote, 'Accepted quote'], ['workOrder', r.workOrder, 'Makes the conveyor frames'], ...(r.id === 'SO-1048' ? ([['inspection', 'INS-0533', 'Failed one check'], ['ncr', 'NCR-0121', 'Rework'], ['purchaseOrder', 'PO-0388', 'Replacement plate'], ['project', 'PRJ-031', 'Project']] as [string, string, string][]) : [])]),
  docs: (r) => docsFor(r, 'Order confirmation'),
  actions: (r) => [
    { label: 'Notify customer of delay', icon: 'mail', toast: 'Delay notice drafted for Olivia Bennett (prototype: nothing is sent).', when: (x) => x.status === 'Late' },
    { label: 'Open work order', primary: true, icon: 'factory', to: r.workOrder ? `/manufacturing/work-orders/${r.workOrder}` : undefined, when: (x) => !!x.workOrder },
    { label: 'Create invoice', primary: true, icon: 'doc', to: '/finance/invoices/new', when: (x) => x.status === 'Delivered' },
  ],
  bulk: [{ label: 'Mark as confirmed', patch: { status: 'Confirmed' }, toast: 'Orders marked as confirmed.' }],
  form: {
    title: 'New sales order',
    intro: 'Planned ERP module. A sales order is usually created from an accepted quote or a won deal.',
    groups: [
      { title: 'Customer', fields: [f('customer', 'Customer', 'select', { options: CUSTOMER_NAMES, required: true }), f('reference', 'Customer reference', 'text', { description: 'Their purchase order number, printed on documents.' }), f('promised', 'Promised date', 'date', { default: addDays(TODAY, 21), required: true })] },
      { title: 'Line', fields: [f('item', 'Product', 'select', { options: PRODUCT_OPTIONS, required: true }), f('qty', 'Quantity', 'number', { default: 1, min: 1, required: true })] },
      { title: 'Delivery', fields: [f('site', 'Ship from', 'select', { options: SITES, default: 'Brisbane' }), f('notes', 'Delivery notes', 'textarea', { wide: true })] },
    ],
    toRow: (v) => {
      const id = String(v.item).split(' ')[0];
      const lines = [SF.line(id, Number(v.qty))];
      return { customer: v.customer, ordered: TODAY, promised: v.promised, lines, total: SF.linesTotal(lines) * 1.1, site: v.site, owner: 'Alex Morgan' };
    },
  },
});

def({
  key: 'delivery',
  label: 'Delivery',
  plural: 'Deliveries',
  path: ENTITY_PATH.delivery,
  module: 'ERP',
  rows: SF.deliveries,
  title: (r) => `Delivery to ${r.customer}`,
  columns: [c('id', 'Number', 'id'), c('order', 'Sales order', 'id', { card: true }), c('customer', 'Customer', 'text', { card: true }), c('date', 'Date', 'date', { card: true }), c('carrier', 'Carrier'), c('packages', 'Packages', 'number'), c('site', 'Site'), c('status', 'Status', 'status')],
  related: (r) => related([['salesOrder', r.order], ['customer', r.customerId]]),
  docs: (r) => docsFor(r, 'Delivery docket'),
  actions: () => [{ label: 'Print docket', icon: 'download', toast: 'Docket ready to print (prototype).' }],
});

// ------------------------------------------------------------------ Finance

def({
  key: 'invoice',
  label: 'Invoice',
  plural: 'Invoices',
  path: ENTITY_PATH.invoice,
  module: 'Finance',
  scope: 'Invoices',
  rows: [...SF.invoices].reverse(),
  title: (r) => `Invoice to ${r.customer}`,
  subtitle: (r) => `Issued ${fmtDate(r.issued)} · due ${fmtDate(r.due)}`,
  columns: [c('id', 'Number', 'id'), c('customer', 'Customer', 'text', { card: true }), c('issued', 'Issued', 'date'), c('due', 'Due', 'date', { card: true }), c('total', 'Total', 'money'), c('balance', 'Balance', 'money', { card: true }), c('site', 'Site', 'text', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'unpaid', label: 'Unpaid', conditions: [{ field: 'balance', op: 'gt', value: '0' }], builtIn: true },
    { id: 'overdue', label: 'Overdue', conditions: [{ field: 'status', op: 'is', value: 'Overdue' }], builtIn: true },
  ],
  overview: (r) => <Parts.InvoiceSummary r={r} />,
  side: (r) => <Parts.PaymentsPanel r={r} />,
  tabs: [{ id: 'payments', label: 'Payments', render: (r) => <Parts.PaymentsPanel r={r} full /> }],
  related: (r) => related([['customer', r.customerId], ['salesOrder', r.order]]),
  docs: (r) => docsFor(r, 'Tax invoice'),
  actions: (r) => [
    { label: 'Send reminder', icon: 'mail', toast: 'Reminder drafted in Finance (prototype: nothing is sent).', when: (x) => x.balance > 0 },
    { label: 'Record payment', primary: true, icon: 'dollar', to: `/finance/invoices/${r.id}?tab=payments`, when: (x) => x.balance > 0 },
  ],
  bulk: [{ label: 'Send reminders', toast: 'Reminders drafted (prototype: nothing is sent).' }],
  form: {
    title: 'New invoice',
    intro: 'Invoices are kept in Finance. This is its form, shown inside ERP.',
    groups: [
      { title: 'Customer', fields: [f('customer', 'Customer', 'select', { options: CUSTOMER_NAMES, required: true }), f('issued', 'Issue date', 'date', { default: TODAY }), f('due', 'Due date', 'date', { default: addDays(TODAY, 30), description: 'From the customer’s payment terms.' })] },
      { title: 'Amount', fields: [f('total', 'Total including GST (AUD)', 'money', { required: true, min: 1 }), f('reference', 'Reference', 'text', { description: 'For example the sales order number.' })] },
    ],
    toRow: (v) => ({ customer: v.customer, issued: v.issued, due: v.due, total: Number(v.total), paid: 0, balance: Number(v.total), site: 'Brisbane', department: 'Sales' }),
  },
});

def({
  key: 'creditNote',
  label: 'Credit note',
  plural: 'Credit notes',
  path: ENTITY_PATH.creditNote,
  module: 'Finance',
  rows: SF.creditNotes,
  title: (r) => `Credit note for ${r.customer}`,
  columns: [c('id', 'Number', 'id'), c('customer', 'Customer', 'text', { card: true }), c('date', 'Date', 'date'), c('invoice', 'Invoice', 'id'), c('total', 'Total', 'money', { card: true }), c('status', 'Status', 'status')],
  related: (r) => related([['invoice', r.invoice]]),
  workflow: (r) => approval(r, { submittedBy: 'Mei Lin', submittedAt: `${r.date}T10:00`, approver: 'Daniel Okafor', approveLabel: 'Finance manager approval', next: 'Apply to invoice', nextBy: 'Mei Lin' }),
});

def({
  key: 'bill',
  label: 'Bill',
  plural: 'Bills',
  path: ENTITY_PATH.bill,
  module: 'Finance',
  rows: SF.bills,
  title: (r) => `Bill from ${r.supplier}`,
  subtitle: (r) => `Reference ${r.reference} · due ${fmtDate(r.due)}`,
  columns: [c('id', 'Number', 'id'), c('supplier', 'Supplier', 'text', { card: true }), c('reference', 'Reference'), c('date', 'Date', 'date'), c('due', 'Due', 'date', { card: true }), c('total', 'Total', 'money', { card: true }), c('status', 'Status', 'status')],
  views: [{ id: 'approval', label: 'Awaiting approval', conditions: [{ field: 'status', op: 'is', value: 'Awaiting approval' }], builtIn: true }],
  related: (r) => related([['purchaseOrder', r.order, 'Three-way match'], ['supplier', r.supplierId]]),
  docs: (r) => docsFor(r, 'Supplier bill'),
  workflow: (r) => approval(r, { submittedBy: 'Mei Lin', submittedAt: `${r.date}T09:30`, approver: 'Daniel Okafor', approveLabel: 'Approval', next: 'Pay in the next pay run', nextBy: 'Finance' }),
  form: {
    title: 'New bill',
    intro: 'Bills are kept in Finance. This is its form, shown inside ERP.',
    groups: [{ title: 'Supplier', fields: [f('supplier', 'Supplier', 'select', { options: SUPPLIER_NAMES, required: true }), f('reference', 'Supplier reference', 'text', { required: true }), f('date', 'Bill date', 'date', { default: TODAY }), f('due', 'Due date', 'date', { default: addDays(TODAY, 30) }), f('total', 'Total including GST (AUD)', 'money', { required: true, min: 1 })] }],
    toRow: (v) => ({ supplier: v.supplier, reference: v.reference, date: v.date, due: v.due, total: Number(v.total), site: 'Brisbane' }),
  },
});

def({
  key: 'expenseClaim',
  label: 'Expense claim',
  plural: 'Expense claims',
  path: ENTITY_PATH.expenseClaim,
  module: 'Finance',
  rows: SF.expenseClaims,
  title: (r) => r.purpose,
  subtitle: (r) => r.person,
  columns: [c('id', 'Number', 'id'), c('person', 'Person', 'text', { card: true }), c('purpose', 'Purpose', 'text', { card: true }), c('date', 'Date', 'date'), c('total', 'Total', 'money', { card: true }), c('status', 'Status', 'status')],
  workflow: (r) => approval(r, { submittedBy: r.person, submittedAt: `${r.date}T17:10`, approver: 'Daniel Okafor', approveLabel: 'Manager approval', next: 'Reimburse', nextBy: 'Finance' }),
});

// ------------------------------------------------------------------ Projects & Tasks

def({
  key: 'project',
  label: 'Project',
  plural: 'Projects',
  path: ENTITY_PATH.project,
  module: 'Project Management',
  scope: 'Projects',
  rows: OP.projects,
  title: (r) => r.name,
  subtitle: (r) => `${r.customer} · ${r.manager}`,
  columns: [c('id', 'Number', 'id'), c('name', 'Project', 'text', { card: true }), c('customer', 'Customer'), c('manager', 'Manager'), c('end', 'Due', 'date', { card: true }), c('progress', 'Progress', 'percent', { card: true }), c('budget', 'Budget', 'money', { visible: false }), c('spent', 'Spent', 'money', { visible: false }), c('status', 'Status', 'status')],
  views: [{ id: 'risk', label: 'At risk or late', conditions: [{ field: 'status', op: 'isNot', value: 'On track' }, { field: 'status', op: 'isNot', value: 'Completed' }, { field: 'status', op: 'isNot', value: 'Not started' }], builtIn: true }],
  tabs: [{ id: 'tasks', label: 'Tasks', render: (r) => <Parts.ProjectTasks r={r} /> }],
  related: (r) => (r.id === 'PRJ-031' ? related([['customer', 'CUS-001'], ['salesOrder', 'SO-1048'], ['quote', 'QU-0107'], ['workOrder', 'WO-1042']]) : []),
});

def({
  key: 'task',
  label: 'Task',
  plural: 'Tasks',
  path: ENTITY_PATH.task,
  module: 'Project Management',
  scope: 'Tasks',
  rows: OP.tasks,
  title: (r) => r.title,
  subtitle: (r) => `${r.project} · ${r.assignee}`,
  columns: [c('id', 'Number', 'id'), c('title', 'Task', 'text', { card: true }), c('project', 'Project', 'id'), c('assignee', 'Assignee', 'text', { card: true }), c('due', 'Due', 'date', { card: true }), c('priority', 'Priority'), c('status', 'Status', 'status')],
  views: [
    { id: 'mine', label: 'Assigned to me', conditions: [{ field: 'assignee', op: 'is', value: 'Alex Morgan' }], builtIn: true },
    { id: 'overdue', label: 'Overdue', conditions: [{ field: 'due', op: 'before', value: TODAY }, { field: 'status', op: 'isNot', value: 'Done' }], builtIn: true },
  ],
  related: (r) => related([['project', r.project]]),
  actions: () => [{ label: 'Complete', primary: true, icon: 'check', patch: { status: 'Done' }, toast: 'Task completed.', when: (x) => x.status !== 'Done' }],
  bulk: [{ label: 'Complete', patch: { status: 'Done' }, toast: 'Tasks completed.' }],
  form: {
    title: 'New task',
    intro: 'Tasks are kept in Project Management. This is its form, shown inside ERP.',
    groups: [{ title: 'Task', fields: [f('title', 'Title', 'text', { required: true }), f('project', 'Project', 'select', { options: OP.projects.map((p) => p.id), default: 'PRJ-031' }), f('assignee', 'Assignee', 'select', { options: ['Alex Morgan', 'Hannah Brooks', 'Tom Walsh', 'Ben Carter'], default: 'Alex Morgan' }), f('due', 'Due date', 'date', { default: addDays(TODAY, 7) }), f('priority', 'Priority', 'select', { options: ['Low', 'Medium', 'High'], default: 'Medium' })] }],
    toRow: (v) => ({ title: v.title, project: v.project, assignee: v.assignee, due: v.due, priority: v.priority, status: 'To do', site: 'Brisbane' }),
  },
});

// ------------------------------------------------------------------ Products & Engineering

def({
  key: 'product',
  label: 'Product',
  plural: 'Products',
  path: ENTITY_PATH.product,
  module: 'ERP',
  scope: 'Products',
  rows: OP.products,
  title: (r) => r.name,
  subtitle: (r) => `${r.type} · revision ${r.revision}`,
  columns: [c('id', 'Number', 'id'), c('name', 'Name', 'text', { card: true }), c('type', 'Type', 'text', { card: true }), c('family', 'Family'), c('revision', 'Revision'), c('cost', 'Standard cost', 'money', { card: true }), c('onHand', 'On hand', 'number'), c('owner', 'Owner', 'text', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'finished', label: 'Finished goods', conditions: [{ field: 'type', op: 'is', value: 'Finished good' }], builtIn: true },
    { id: 'materials', label: 'Materials', conditions: [{ field: 'family', op: 'is', value: 'Materials' }], builtIn: true },
  ],
  tabs: [
    { id: 'bom', label: 'BOM', render: (r) => <Parts.BomPanel product={r.id} /> },
    { id: 'variants', label: 'Variants', render: (r) => <Parts.ProductVariants r={r} /> },
    { id: 'routing', label: 'Routing', render: (r) => <Parts.RoutingOps product={r.id} /> },
    { id: 'revisions', label: 'Revisions', render: (r) => <Parts.ProductRevisions r={r} /> },
    { id: 'drawings', label: 'Drawings', render: (r) => <Parts.ProductDrawings r={r} /> },
  ],
  related: (r) => [
    ...OP.ecos.filter((x) => x.product === r.id).map((x) => ({ entity: 'eco', id: x.id })),
    ...OP.workOrders.filter((x) => x.item === r.id && x.status !== 'Completed').map((x) => ({ entity: 'workOrder', id: x.id })),
    ...OP.boms.filter((x) => x.product === r.id).map((x) => ({ entity: 'bom', id: x.id })),
  ],
  docs: (r) => [{ name: `${r.id}-datasheet.pdf`, kind: 'Datasheet (PDF)', size: '220 KB', date: '2026-11-10' }],
  actions: () => [{ label: 'Start engineering change', primary: true, icon: 'edit', to: '/engineering/changes/new' }],
  form: {
    title: 'New product',
    intro: 'Planned ERP module: the product master.',
    groups: [
      { title: 'Identity', fields: [f('name', 'Name', 'text', { required: true }), f('type', 'Type', 'select', { options: ['Finished good', 'Sub-assembly', 'Raw material', 'Purchased part'], default: 'Finished good' }), f('uom', 'Unit of measure', 'select', { options: ['each', 'set', 'kit', 'pair', 'sheet', 'length', 'litre'], default: 'each' })] },
      { title: 'Costing', description: 'Used to value stock in Finance.', fields: [f('cost', 'Standard cost (AUD)', 'money', { required: true, min: 0.01 }), f('family', 'Family', 'select', { options: ['Conveyor', 'Access and guarding', 'Materials'], default: 'Conveyor' })] },
    ],
    toRow: (v) => ({ name: v.name, type: v.type, uom: v.uom, cost: Number(v.cost), family: v.family, revision: 'A', onHand: 0, owner: 'Tom Walsh', site: 'Brisbane' }),
  },
});

def({
  key: 'variant',
  label: 'Variant',
  plural: 'Variants',
  path: ENTITY_PATH.variant,
  module: 'ERP',
  rows: OP.variants,
  title: (r) => `${r.productName}, ${r.option}`,
  columns: [c('id', 'Number', 'id'), c('productName', 'Product', 'text', { card: true }), c('option', 'Option', 'text', { card: true }), c('status', 'Status', 'status')],
  related: (r) => related([['product', r.product]]),
});

def({
  key: 'bom',
  label: 'Bill of materials',
  plural: 'Bills of materials',
  path: ENTITY_PATH.bom,
  module: 'ERP',
  rows: OP.boms,
  title: (r) => `${r.productName}, revision ${r.revision}`,
  columns: [c('id', 'Number', 'id'), c('productName', 'Product', 'text', { card: true }), c('revision', 'Revision', 'text', { card: true }), c('components', 'Components', 'number'), c('effective', 'Effective'), c('owner', 'Owner'), c('status', 'Status', 'status')],
  views: [{ id: 'review', label: 'In review', conditions: [{ field: 'status', op: 'is', value: 'In review' }], builtIn: true }],
  tabs: [{ id: 'tree', label: 'Structure', render: (r) => <Parts.BomPanel product={r.product} revision={r.revision} /> }],
  related: (r) => related([['product', r.product], ['eco', r.product === 'PRD-1001' && r.revision === 'C' ? 'ECO-0046' : null]]),
});

def({
  key: 'routing',
  label: 'Routing',
  plural: 'Routings',
  path: ENTITY_PATH.routing,
  module: 'ERP',
  rows: OP.routings,
  title: (r) => `Routing for ${r.productName}`,
  columns: [c('id', 'Number', 'id'), c('productName', 'Product', 'text', { card: true }), c('revision', 'Revision'), c('ops', 'Operations', 'number', { card: true }), c('hours', 'Standard hours', 'number'), c('status', 'Status', 'status')],
  tabs: [{ id: 'ops', label: 'Operations', render: (r) => <Parts.RoutingOps product={r.product} /> }],
  related: (r) => related([['product', r.product]]),
});

def({
  key: 'eco',
  label: 'Engineering change',
  plural: 'Engineering changes',
  path: ENTITY_PATH.eco,
  module: 'ERP',
  rows: OP.ecos,
  title: (r) => r.title,
  subtitle: (r) => `${r.productName} · revision ${r.revision}`,
  columns: [c('id', 'Number', 'id'), c('title', 'Change', 'text', { card: true }), c('productName', 'Product'), c('revision', 'Revision'), c('priority', 'Priority'), c('owner', 'Owner'), c('raised', 'Raised', 'date', { card: true }), c('status', 'Status', 'status')],
  overview: (r) => (r.id === 'ECO-0046' ? <Parts.BomCompare product="PRD-1001" from="B" to="C" /> : null),
  related: (r) => related([['product', r.product], ['bom', r.id === 'ECO-0046' ? 'BOM-1001-C' : null], ['drawing', r.id === 'ECO-0046' ? 'DWG-1001-02' : null]]),
  workflow: (r) =>
    approval(r, {
      submittedBy: r.owner,
      submittedAt: `${r.raised}T10:20`,
      approver: 'Grace Kim, Quality manager',
      approveLabel: 'Quality and production review',
      next: 'Release revision and notify Manufacturing',
      nextBy: 'Tom Walsh',
      pre: [{ label: 'Engineering check', who: 'Zoe Martin', when: `${addDays(r.raised, 1)}T14:05`, state: 'done', comment: 'Drawings and BOM agree.' }],
    }),
  form: {
    title: 'New engineering change',
    intro: 'Planned ERP module: change requests and orders.',
    groups: [{ title: 'Change', fields: [f('title', 'Title', 'text', { required: true }), f('product', 'Product', 'select', { options: PRODUCT_OPTIONS, required: true }), f('priority', 'Priority', 'select', { options: ['Low', 'Medium', 'High'], default: 'Medium' }), f('reason', 'Reason for the change', 'textarea', { required: true, wide: true, description: 'What is wrong today and what the change fixes.' })] }],
    toRow: (v) => ({ title: v.title, product: String(v.product).split(' ')[0], productName: itemName(String(v.product).split(' ')[0]), priority: v.priority, revision: 'next', owner: 'Alex Morgan', raised: TODAY, site: 'Brisbane' }),
  },
});

def({
  key: 'revision',
  label: 'Revision',
  plural: 'Revisions',
  path: ENTITY_PATH.revision,
  module: 'ERP',
  rows: OP.revisions,
  title: (r) => `${r.productName}, revision ${r.rev}`,
  columns: [c('id', 'Number', 'id'), c('productName', 'Product', 'text', { card: true }), c('rev', 'Revision', 'text', { card: true }), c('date', 'Date', 'date'), c('summary', 'Summary'), c('author', 'Author', 'text', { visible: false }), c('status', 'Status', 'status')],
  related: (r) => related([['product', r.product]]),
});

def({
  key: 'drawing',
  label: 'Drawing',
  plural: 'Drawings and models',
  path: ENTITY_PATH.drawing,
  module: 'CAD Automation',
  scope: 'Documents',
  rows: OP.drawings,
  title: (r) => r.title,
  subtitle: (r) => `${r.product} · revision ${r.rev}`,
  columns: [c('id', 'Number', 'id'), c('title', 'Title', 'text', { card: true }), c('product', 'Product', 'id'), c('rev', 'Revision', 'text', { card: true }), c('format', 'Files'), c('updated', 'Updated', 'date'), c('status', 'Status', 'status')],
  related: (r) => related([['product', r.product]]),
  docs: (r) => [{ name: `${r.id}-${r.rev}.pdf`, kind: 'Drawing (PDF)', size: '640 KB', date: r.updated }],
  actions: () => [{ label: 'Open in CAD Automation', primary: true, icon: 'share', external: 'https://bizomat.ai/cad/' }],
});

def({
  key: 'cadJob',
  label: 'CAD automation job',
  plural: 'CAD automation jobs',
  path: ENTITY_PATH.cadJob,
  module: 'CAD Automation',
  rows: OP.cadJobs,
  title: (r) => r.title,
  columns: [c('id', 'Number', 'id'), c('title', 'Job', 'text', { card: true }), c('started', 'Started', 'text', { render: (r) => fmtDateTime(r.started) }), c('duration', 'Duration'), c('requestedBy', 'Requested by'), c('status', 'Status', 'status', { card: true })],
  actions: () => [{ label: 'Open in CAD Automation', primary: true, icon: 'share', external: 'https://bizomat.ai/cad/' }],
});

// ------------------------------------------------------------------ Procurement

def({
  key: 'supplier',
  label: 'Supplier',
  plural: 'Suppliers',
  path: ENTITY_PATH.supplier,
  module: 'Finance',
  rows: OP.suppliers,
  title: (r) => r.name,
  subtitle: (r) => r.category,
  columns: [c('id', 'Number', 'id'), c('name', 'Name', 'text', { card: true }), c('category', 'Category'), c('onTime', 'On time', 'percent', { card: true }), c('quality', 'Quality', 'percent'), c('leadTime', 'Lead time (days)', 'number'), c('spendYtd', 'Spend this year', 'money', { card: true }), c('status', 'Status', 'status')],
  tabs: [{ id: 'performance', label: 'Performance', render: (r) => <Parts.SupplierPerformance r={r} /> }],
  related: (r) => OP.purchaseOrders.filter((p) => p.supplierId === r.id).map((p) => ({ entity: 'purchaseOrder', id: p.id })),
});

def({
  key: 'requisition',
  label: 'Purchase requisition',
  plural: 'Requisitions',
  path: ENTITY_PATH.requisition,
  module: 'ERP',
  rows: OP.requisitions,
  title: (r) => r.title,
  subtitle: (r) => `Requested by ${r.requester}`,
  columns: [c('id', 'Number', 'id'), c('title', 'Request', 'text', { card: true }), c('qty', 'Quantity', 'number'), c('requester', 'Requested by'), c('needed', 'Needed by', 'date', { card: true }), c('estimate', 'Estimate', 'money'), c('status', 'Status', 'status')],
  views: [{ id: 'approval', label: 'Awaiting approval', conditions: [{ field: 'status', op: 'is', value: 'Awaiting approval' }], builtIn: true }],
  related: (r) => related([['product', r.item], ['purchaseOrder', r.id === 'REQ-0412' ? 'PO-0388' : null]]),
  workflow: (r) => approval(r, { submittedBy: r.requester, submittedAt: `${addDays(r.needed, -7)}T08:40`, approver: 'Sara Haddad', approveLabel: 'Procurement approval', next: 'Convert to purchase order', nextBy: 'Sara Haddad' }),
  bulk: [{ label: 'Approve', patch: { status: 'Approved' }, toast: 'Requisitions approved.' }],
  form: {
    title: 'New purchase requisition',
    intro: 'Planned ERP module. Ask procurement to buy something; it goes for approval first.',
    groups: [
      { title: 'What you need', fields: [f('item', 'Item', 'select', { options: PRODUCT_OPTIONS.filter((o) => o.startsWith('RM-')), required: true }), f('qty', 'Quantity', 'number', { required: true, min: 1, default: 1 }), f('needed', 'Needed by', 'date', { required: true, default: addDays(TODAY, 7) })] },
      { title: 'Why', fields: [f('title', 'Short description', 'text', { required: true, description: 'Shown to the approver.' }), f('job', 'Work order or project', 'text', { description: 'For example WO-1042 or PRJ-031.' })] },
    ],
    toRow: (v) => ({ title: v.title, item: String(v.item).split(' ')[0], qty: Number(v.qty), needed: v.needed, requester: 'Alex Morgan', estimate: Number(v.qty) * OP.products.find((p) => p.id === String(v.item).split(' ')[0])!.cost, site: 'Brisbane' }),
  },
});

def({
  key: 'rfq',
  label: 'Request for quotation',
  plural: 'Requests for quotation',
  path: ENTITY_PATH.rfq,
  module: 'ERP',
  rows: OP.rfqs,
  title: (r) => r.title,
  columns: [c('id', 'Number', 'id'), c('title', 'Request', 'text', { card: true }), c('closes', 'Closes', 'date', { card: true }), c('invited', 'Invited', 'number'), c('received', 'Responses', 'number'), c('buyer', 'Buyer'), c('status', 'Status', 'status')],
  tabs: [{ id: 'responses', label: 'Responses', render: (r) => <Parts.RfqResponses r={r} /> }],
});

def({
  key: 'purchaseOrder',
  label: 'Purchase order',
  plural: 'Purchase orders',
  path: ENTITY_PATH.purchaseOrder,
  module: 'Finance',
  scope: 'Purchase orders',
  rows: [...OP.purchaseOrders].reverse(),
  title: (r) => `Purchase order to ${r.supplier}`,
  subtitle: (r) => `Ordered ${fmtDate(r.ordered)} · expected ${fmtDate(r.expected)}`,
  columns: [c('id', 'Number', 'id'), c('supplier', 'Supplier', 'text', { card: true }), c('ordered', 'Ordered', 'date'), c('expected', 'Expected', 'date', { card: true }), c('total', 'Total incl. GST', 'money', { card: true }), c('buyer', 'Buyer'), c('site', 'Site', 'text', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'approval', label: 'Awaiting approval', conditions: [{ field: 'status', op: 'is', value: 'Awaiting approval' }], builtIn: true },
    { id: 'receipt', label: 'Awaiting receipt', conditions: [{ field: 'status', op: 'is', value: 'Sent' }], builtIn: true },
  ],
  overview: (r) => (
    <>
      {r.reason ? <p className="erp-note">{r.reason}</p> : null}
      <Parts.LinesTable lines={r.lines} />
    </>
  ),
  tabs: [{ id: 'receiving', label: 'Receiving', render: (r) => <Parts.PoReceiving r={r} /> }],
  related: (r) => related([['supplier', r.supplierId], ['requisition', r.requisition], ...(r.id === 'PO-0388' ? ([['workOrder', 'WO-1042', 'Plate for the rework'], ['salesOrder', 'SO-1048', 'Late order']] as [string, string, string][]) : []), ...OP.receipts.filter((g) => g.po === r.id).map((g) => ['receipt', g.id] as [string, string])]),
  docs: (r) => docsFor(r, 'Purchase order'),
  workflow: (r) =>
    approval(r, {
      submittedBy: `${r.buyer}, Procurement`,
      submittedAt: `${r.ordered}T16:51`,
      approver: 'Daniel Okafor, Finance manager',
      approveLabel: r.total > 10_000 ? 'Approval (over $10,000)' : 'Approval',
      next: 'Send to supplier',
      nextBy: r.buyer,
      pre: [{ label: 'Budget check', who: 'BIZOMAT (automatic)', when: `${r.ordered}T16:51`, state: 'done', comment: 'Within the production materials budget.' }],
    }),
  actions: () => [{ label: 'Send to supplier', primary: true, icon: 'mail', patch: { status: 'Sent' }, toast: 'Purchase order sent (prototype: nothing is sent).', when: (x) => x.status === 'Approved' }],
  bulk: [{ label: 'Approve', patch: { status: 'Approved' }, toast: 'Purchase orders approved.' }],
});

// ------------------------------------------------------------------ Inventory & Warehouse

def({
  key: 'stock',
  label: 'Stock item',
  plural: 'Stock on hand',
  path: ENTITY_PATH.stock,
  module: 'ERP',
  rows: OP.stock,
  title: (r) => r.name,
  subtitle: (r) => `${r.item} · ${r.warehouse} ${r.bin}`,
  columns: [c('item', 'Item', 'id'), c('name', 'Description', 'text', { card: true }), c('warehouse', 'Warehouse'), c('bin', 'Bin', 'text', { card: true }), c('onHand', 'On hand', 'number', { card: true }), c('allocated', 'Allocated', 'number'), c('available', 'Available', 'number'), c('reorder', 'Reorder point', 'number', { visible: false }), c('value', 'Value', 'money'), c('status', 'Status', 'status')],
  views: [{ id: 'low', label: 'Low or out', conditions: [{ field: 'status', op: 'isNot', value: 'In stock' }], builtIn: true }],
  related: (r) => related([['product', r.item]]),
  actions: (r) => [{ label: 'Move stock', icon: 'refresh', toast: 'Move form (prototype).' }, { label: 'Count', primary: true, icon: 'listOrdered', toast: `Count started for ${r.item} in ${r.bin} (prototype).` }],
});

def({
  key: 'movement',
  label: 'Stock movement',
  plural: 'Stock movements',
  path: ENTITY_PATH.movement,
  module: 'ERP',
  rows: OP.movements,
  title: (r) => `${r.type}: ${r.name}`,
  columns: [c('id', 'Number', 'id'), c('date', 'Date', 'date', { card: true }), c('type', 'Type', 'status', { card: true }), c('item', 'Item', 'id'), c('qty', 'Quantity', 'number', { card: true }), c('from', 'From'), c('to', 'To'), c('reference', 'Reference', 'id'), c('by', 'By', 'text', { visible: false })],
  related: (r) => related([['product', r.item]]),
});

def({
  key: 'receipt',
  label: 'Goods receipt',
  plural: 'Goods receipts',
  path: ENTITY_PATH.receipt,
  module: 'ERP',
  rows: [...OP.receipts].reverse(),
  title: (r) => `Goods received from ${r.supplier}`,
  subtitle: (r) => `${fmtDate(r.date)} · packing slip ${r.packingSlip}`,
  columns: [c('id', 'Number', 'id'), c('supplier', 'Supplier', 'text', { card: true }), c('po', 'Purchase order', 'id'), c('date', 'Received', 'date', { card: true }), c('receivedBy', 'Received by'), c('site', 'Site'), c('status', 'Status', 'status')],
  views: [{ id: 'putaway', label: 'Awaiting put-away', conditions: [{ field: 'status', op: 'is', value: 'Awaiting put-away' }], builtIn: true }],
  overview: (r) => <Parts.ReceiptLines r={r} />,
  related: (r) => related([['purchaseOrder', r.po], ['supplier', r.supplierId], ['inspection', r.inspection, 'Receiving inspection'], ...(r.id === 'GR-0215' ? ([['ncr', 'NCR-0120', 'Bent lengths'], ['certificate', 'CERT-7781', 'Mill certificate'], ['return', 'RMA-022', 'Return to supplier']] as [string, string, string][]) : [])]),
  docs: (r) => [
    { name: `${r.packingSlip}.pdf`, kind: 'Packing slip (scan)', size: '310 KB', date: r.date },
    { name: `${r.id}-photos.zip`, kind: 'Photos', size: '4.8 MB', date: r.date },
  ],
  actions: () => [{ label: 'Confirm put-away', primary: true, icon: 'check', patch: { status: 'Put away' }, toast: 'Put-away confirmed. Stock is available.', when: (x) => x.status === 'Awaiting put-away' }],
});

def({
  key: 'transfer',
  label: 'Transfer',
  plural: 'Transfers',
  path: ENTITY_PATH.transfer,
  module: 'ERP',
  rows: OP.transfers,
  title: (r) => `Transfer ${r.from} to ${r.to}`,
  columns: [c('id', 'Number', 'id'), c('from', 'From', 'text', { card: true }), c('to', 'To', 'text', { card: true }), c('date', 'Date', 'date'), c('lines', 'Lines', 'number'), c('carrier', 'Carrier'), c('status', 'Status', 'status')],
});

def({
  key: 'count',
  label: 'Stock count',
  plural: 'Stock counts',
  path: ENTITY_PATH.count,
  module: 'ERP',
  rows: OP.counts,
  title: (r) => `Count of ${r.scope}`,
  columns: [c('id', 'Number', 'id'), c('warehouse', 'Warehouse'), c('scope', 'Scope', 'text', { card: true }), c('date', 'Date', 'date', { card: true }), c('counted', 'Bins counted', 'number'), c('variances', 'Variances', 'number'), c('status', 'Status', 'status')],
});

// ------------------------------------------------------------------ Manufacturing

def({
  key: 'workOrder',
  label: 'Work order',
  plural: 'Production orders',
  path: ENTITY_PATH.workOrder,
  module: 'ERP',
  scope: 'Work orders',
  rows: [...OP.workOrders].reverse(),
  title: (r) => `${r.itemName} × ${r.qty}`,
  subtitle: (r) => `For ${r.order ?? 'stock'}${r.customer ? `, ${r.customer}` : ''}`,
  columns: [c('id', 'Number', 'id'), c('itemName', 'Product', 'text', { card: true }), c('qty', 'Quantity', 'number'), c('order', 'Sales order', 'id'), c('start', 'Start', 'date'), c('due', 'Due', 'date', { card: true }), c('progress', 'Progress', 'percent', { card: true }), c('centre', 'Work centre', 'text', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'delayed', label: 'Delayed', conditions: [{ field: 'status', op: 'is', value: 'Delayed' }], builtIn: true },
    { id: 'active', label: 'In progress', conditions: [{ field: 'status', op: 'is', value: 'In progress' }], builtIn: true },
  ],
  overview: (r) => (r.delayReason ? <Parts.DelayNote r={r} /> : null),
  tabs: [
    { id: 'operations', label: 'Operations', render: (r) => <Parts.WorkOrderOps r={r} /> },
    { id: 'materials', label: 'Materials', render: (r) => <Parts.WorkOrderMaterials r={r} /> },
  ],
  related: (r) => related([['salesOrder', r.order], ['product', r.item], ['routing', r.item === 'PRD-1001' ? 'RT-1001' : null], ...(r.id === 'WO-1042' ? ([['inspection', 'INS-0533', 'Failed one check'], ['ncr', 'NCR-0121', 'Weld undercut'], ['purchaseOrder', 'PO-0388', 'Replacement plate'], ['bom', 'BOM-1001-B', 'Released BOM used']] as [string, string, string][]) : [])]),
  docs: (r) => [{ name: `${r.id}-traveller.pdf`, kind: 'Job traveller (PDF)', size: '96 KB', date: r.start }],
  actions: (r) => [{ label: 'Reschedule', icon: 'calendar', to: '/manufacturing/planning' }, { label: 'Open on shop floor', primary: true, icon: 'play', to: `/manufacturing/shop-floor?wo=${r.id}` }],
  bulk: [{ label: 'Release', patch: { status: 'Released' }, toast: 'Work orders released.' }],
  form: {
    title: 'New work order',
    intro: 'Planned ERP module. Make products for a sales order or for stock.',
    groups: [
      { title: 'What to make', fields: [f('item', 'Product', 'select', { options: OP.sellable.map((p) => `${p.id} ${p.name}`), required: true }), f('qty', 'Quantity', 'number', { required: true, min: 1, default: 1 }), f('order', 'For sales order', 'text', { description: 'Leave empty to make for stock.' })] },
      { title: 'When', fields: [f('start', 'Start', 'date', { default: addDays(TODAY, 1), required: true }), f('due', 'Due', 'date', { default: addDays(TODAY, 8), required: true })] },
    ],
    toRow: (v) => {
      const id = String(v.item).split(' ')[0];
      return { item: id, itemName: itemName(id), qty: Number(v.qty), order: v.order || undefined, start: v.start, due: v.due, progress: 0, centre: 'WC-WELD', site: 'Brisbane', planner: 'Alex Morgan' };
    },
  },
});

def({
  key: 'workCentre',
  label: 'Work centre',
  plural: 'Work centres',
  path: ENTITY_PATH.workCentre,
  module: 'ERP',
  rows: OP.workCentres,
  title: (r) => r.name,
  subtitle: (r) => r.shift,
  columns: [c('id', 'Number', 'id'), c('name', 'Name', 'text', { card: true }), c('capacity', 'Capacity (h/week)', 'number'), c('load', 'Load (h)', 'number'), c('loadPct', 'Load', 'percent', { card: true }), c('status', 'Status', 'status')],
  tabs: [{ id: 'load', label: 'Load', render: (r) => <Parts.WorkCentreLoad r={r} /> }],
  related: (r) => OP.workOrders.filter((w) => w.centre === r.id && w.status !== 'Completed').map((w) => ({ entity: 'workOrder', id: w.id })),
});

// ------------------------------------------------------------------ Quality

def({
  key: 'inspection',
  label: 'Inspection',
  plural: 'Inspections',
  path: ENTITY_PATH.inspection,
  module: 'ERP',
  rows: [...OP.inspections].reverse(),
  title: (r) => `${r.type} of ${r.subject}`,
  subtitle: (r) => `${fmtDate(r.date)} · ${r.inspector}`,
  columns: [c('id', 'Number', 'id'), c('type', 'Type', 'text', { card: true }), c('subject', 'Subject', 'id', { card: true }), c('item', 'Item', 'id'), c('inspector', 'Inspector'), c('date', 'Date', 'date'), c('site', 'Site', 'text', { visible: false }), c('status', 'Status', 'status')],
  views: [
    { id: 'today', label: 'Today and open', conditions: [{ field: 'status', op: 'isNot', value: 'Passed' }, { field: 'status', op: 'isNot', value: 'Failed' }], builtIn: true },
    { id: 'failed', label: 'Failed', conditions: [{ field: 'status', op: 'is', value: 'Failed' }], builtIn: true },
  ],
  tabs: [{ id: 'checklist', label: 'Checklist', render: (r) => <Parts.Checklist r={r} /> }],
  related: (r) => related([[r.subject?.startsWith('GR-') ? 'receipt' : 'workOrder', r.subject], ['product', r.item], ['inspectionPlan', r.plan], ['ncr', r.ncr, 'Raised from this inspection']]),
  docs: (r) => (r.id === 'INS-0533' ? [{ name: 'INS-0533-joint-W7.jpg', kind: 'Photo of joint W7', size: '2.1 MB', date: '2026-11-11' }, { name: 'INS-0533.pdf', kind: 'Inspection report (PDF)', size: '120 KB', date: '2026-11-11' }] : docsFor(r, 'Inspection report')),
  actions: () => [{ label: 'Mark as reviewed', primary: true, icon: 'check', patch: { status: 'Reviewed' }, toast: 'Inspection reviewed. NCR-0121 stays open for the rework.', when: (x) => x.status === 'Awaiting review' }],
  form: {
    title: 'New inspection',
    intro: 'Planned ERP module. Schedule an inspection from a plan.',
    groups: [{ title: 'Inspection', fields: [f('type', 'Type', 'select', { options: ['Receiving inspection', 'In-process inspection', 'Final inspection'], default: 'In-process inspection' }), f('subject', 'Subject', 'text', { required: true, description: 'A goods receipt (GR-) or work order (WO-) number.' }), f('plan', 'Inspection plan', 'select', { options: OP.inspectionPlans.map((p) => p.id), default: 'IP-01' }), f('date', 'Date', 'date', { default: TODAY }), f('inspector', 'Inspector', 'select', { options: ['Grace Kim', 'Ava Singh'], default: 'Grace Kim' })] }],
    toRow: (v) => ({ type: v.type, subject: v.subject, plan: v.plan, date: v.date, inspector: v.inspector, item: 'PRD-1001', site: 'Brisbane' }),
  },
});

def({
  key: 'ncr',
  label: 'Nonconformance',
  plural: 'Nonconformances',
  path: ENTITY_PATH.ncr,
  module: 'ERP',
  rows: OP.ncrs,
  title: (r) => r.title,
  subtitle: (r) => `From ${r.source} · ${r.cause}`,
  columns: [c('id', 'Number', 'id'), c('title', 'Problem', 'text', { card: true }), c('source', 'Source', 'id'), c('cause', 'Cause'), c('disposition', 'Disposition', 'text', { card: true }), c('owner', 'Owner'), c('raised', 'Raised', 'date'), c('status', 'Status', 'status')],
  views: [{ id: 'open', label: 'Open', conditions: [{ field: 'status', op: 'isNot', value: 'Closed' }], builtIn: true }],
  related: (r) => related([[r.source?.startsWith('GR-') ? 'receipt' : 'workOrder', r.source], ['inspection', r.id === 'NCR-0121' ? 'INS-0533' : null], ['capa', OP.capas.find((x) => x.ncr === r.id)?.id]]),
  workflow: (r) => approval(r, { submittedBy: r.owner, submittedAt: `${r.raised}T14:20`, approver: 'Grace Kim, Quality manager', approveLabel: `Disposition: ${r.disposition}`, next: 'Verify and close', nextBy: 'Grace Kim' }),
});

def({
  key: 'capa',
  label: 'Corrective action',
  plural: 'Corrective actions',
  path: ENTITY_PATH.capa,
  module: 'ERP',
  rows: OP.capas,
  title: (r) => r.title,
  columns: [c('id', 'Number', 'id'), c('title', 'Action', 'text', { card: true }), c('ncr', 'From', 'id'), c('owner', 'Owner'), c('due', 'Due', 'date', { card: true }), c('status', 'Status', 'status')],
  related: (r) => related([['ncr', r.ncr]]),
  actions: () => [{ label: 'Complete', primary: true, icon: 'check', patch: { status: 'Completed' }, toast: 'Corrective action completed.', when: (x) => x.status !== 'Completed' }],
});

def({
  key: 'inspectionPlan',
  label: 'Inspection plan',
  plural: 'Inspection plans',
  path: ENTITY_PATH.inspectionPlan,
  module: 'ERP',
  rows: OP.inspectionPlans,
  title: (r) => r.name,
  columns: [c('id', 'Number', 'id'), c('name', 'Plan', 'text', { card: true }), c('type', 'Type', 'text', { card: true }), c('checks', 'Checks', 'number'), c('owner', 'Owner'), c('status', 'Status', 'status')],
  tabs: [{ id: 'checks', label: 'Checks', render: () => <Parts.PlanChecks /> }],
});

def({
  key: 'certificate',
  label: 'Certificate',
  plural: 'Certificates',
  path: ENTITY_PATH.certificate,
  module: 'ERP',
  scope: 'Documents',
  rows: OP.certificates,
  title: (r) => r.title,
  columns: [c('id', 'Number', 'id'), c('title', 'Certificate', 'text', { card: true }), c('issuer', 'Issuer'), c('reference', 'Reference', 'id'), c('date', 'Date', 'date'), c('status', 'Status', 'status', { card: true })],
  docs: (r) => [{ name: `${r.id}.pdf`, kind: 'Certificate (PDF)', size: '180 KB', date: r.date }],
});

// ------------------------------------------------------------------ Assets & Maintenance

def({
  key: 'asset',
  label: 'Asset',
  plural: 'Assets',
  path: ENTITY_PATH.asset,
  module: 'ERP',
  rows: OP.assets,
  title: (r) => r.name,
  subtitle: (r) => `${r.location} · ${r.site}`,
  columns: [c('id', 'Number', 'id'), c('name', 'Asset', 'text', { card: true }), c('location', 'Location'), c('site', 'Site'), c('nextService', 'Next service', 'date', { card: true }), c('status', 'Condition', 'status')],
  related: (r) => [...OP.maintenanceOrders.filter((m) => m.asset === r.id).map((m) => ({ entity: 'maintenanceOrder', id: m.id })), ...OP.maintenancePlans.filter((m) => m.asset === r.id).map((m) => ({ entity: 'maintenancePlan', id: m.id }))],
  actions: () => [{ label: 'Report a fault', primary: true, icon: 'alert', to: '/maintenance/requests/new' }],
});
def({
  key: 'maintenancePlan',
  label: 'Maintenance plan',
  plural: 'Maintenance plans',
  path: ENTITY_PATH.maintenancePlan,
  module: 'ERP',
  rows: OP.maintenancePlans,
  title: (r) => r.name,
  columns: [c('id', 'Number', 'id'), c('name', 'Plan', 'text', { card: true }), c('asset', 'Asset', 'id'), c('frequency', 'Frequency'), c('next', 'Next due', 'date', { card: true }), c('status', 'Status', 'status')],
  related: (r) => related([['asset', r.asset]]),
});
def({
  key: 'workRequest',
  label: 'Work request',
  plural: 'Work requests',
  path: ENTITY_PATH.workRequest,
  module: 'ERP',
  rows: OP.workRequests,
  title: (r) => r.title,
  columns: [c('id', 'Number', 'id'), c('title', 'Problem', 'text', { card: true }), c('asset', 'Asset', 'id'), c('requester', 'Reported by'), c('priority', 'Priority', 'text', { card: true }), c('date', 'Reported', 'date'), c('status', 'Status', 'status')],
  related: (r) => related([['asset', r.asset]]),
  form: {
    title: 'Report a fault',
    intro: 'Planned ERP module. Tell maintenance what is wrong; a technician picks it up.',
    groups: [
      { title: 'What is wrong', fields: [f('asset', 'Asset', 'select', { options: OP.assets.map((a) => `${a.id} ${a.name}`), required: true }), f('title', 'Problem', 'text', { required: true, description: 'One line, for example "Fan noisy then stopped".' }), f('details', 'Details', 'textarea', { wide: true })] },
      { title: 'How urgent', fields: [f('priority', 'Priority', 'select', { options: ['Low', 'Medium', 'High'], default: 'Medium' }), f('stopped', 'The machine is stopped', 'checkbox', { default: false })] },
    ],
    toRow: (v) => ({ asset: String(v.asset).split(' ')[0], title: v.title, priority: v.stopped ? 'High' : v.priority, requester: 'Alex Morgan', date: TODAY, status: 'New', site: 'Brisbane' }),
  },
});
def({
  key: 'maintenanceOrder',
  label: 'Maintenance order',
  plural: 'Maintenance orders',
  path: ENTITY_PATH.maintenanceOrder,
  module: 'ERP',
  rows: OP.maintenanceOrders,
  title: (r) => r.title,
  columns: [c('id', 'Number', 'id'), c('title', 'Work', 'text', { card: true }), c('asset', 'Asset', 'id'), c('type', 'Type'), c('technician', 'Technician'), c('date', 'Date', 'date', { card: true }), c('status', 'Status', 'status')],
  related: (r) => related([['asset', r.asset]]),
  actions: () => [{ label: 'Complete', primary: true, icon: 'check', patch: { status: 'Completed' }, toast: 'Maintenance order completed.', when: (x) => x.status !== 'Completed' }],
});
def({
  key: 'downtime',
  label: 'Downtime',
  plural: 'Downtime',
  path: ENTITY_PATH.downtime,
  module: 'ERP',
  rows: OP.downtime,
  title: (r) => `${r.name}, ${r.hours} h`,
  columns: [c('id', 'Number', 'id'), c('name', 'Asset', 'text', { card: true }), c('date', 'Date', 'date', { card: true }), c('hours', 'Hours', 'number', { card: true }), c('reason', 'Reason', 'status'), c('order', 'Order', 'id')],
  related: (r) => related([['asset', r.asset], ['maintenanceOrder', r.order]]),
});

// ------------------------------------------------------------------ Supply Chain

def({
  key: 'shipment',
  label: 'Shipment',
  plural: 'Shipments',
  path: ENTITY_PATH.shipment,
  module: 'ERP',
  rows: OP.shipments,
  title: (r) => `Shipment to ${r.customer}`,
  columns: [c('id', 'Number', 'id'), c('order', 'Sales order', 'id'), c('customer', 'Customer', 'text', { card: true }), c('carrier', 'Carrier'), c('date', 'Date', 'date', { card: true }), c('destination', 'Destination'), c('status', 'Status', 'status')],
  related: (r) => related([['salesOrder', r.order]]),
});
def({
  key: 'carrier',
  label: 'Carrier',
  plural: 'Carriers',
  path: ENTITY_PATH.carrier,
  module: 'ERP',
  rows: OP.carriers,
  title: (r) => r.name,
  columns: [c('id', 'Number', 'id'), c('name', 'Carrier', 'text', { card: true }), c('service', 'Service'), c('onTime', 'On time', 'percent', { card: true }), c('status', 'Status', 'status')],
});
def({
  key: 'return',
  label: 'Return',
  plural: 'Returns',
  path: ENTITY_PATH.return,
  module: 'ERP',
  rows: OP.returns,
  title: (r) => `Return: ${r.reason}`,
  columns: [c('id', 'Number', 'id'), c('party', 'Customer or supplier', 'text', { card: true }), c('reference', 'Reference', 'id'), c('item', 'Item', 'id'), c('reason', 'Reason'), c('date', 'Date', 'date'), c('status', 'Status', 'status', { card: true })],
});

// ------------------------------------------------------------------ data access

/** Rows of a kind, with the records created and the changes made during this visit. */
export function useRows(key: string): Row[] {
  const { patches, created } = useErp();
  const e = ENTITIES[key];
  return useMemo(() => {
    const base = [...(created[key] ?? []), ...(e?.rows ?? [])];
    return base.map((r) => (patches[`${key}:${r.id}`] ? { ...r, ...patches[`${key}:${r.id}`] } : r));
  }, [key, e, patches, created]);
}
export function useRecord(key: string, id: string | undefined): Row | undefined {
  const rows = useRows(key);
  return rows.find((r) => r.id === id);
}
export function findStatic(key: string, id: string): Row | undefined {
  return ENTITIES[key]?.rows.find((r) => r.id === id);
}

/** A value of a column, as text: what search, sort, filters and the export use. */
export function cellText(col: Column, r: Row): string {
  const v = r[col.key];
  if (v === undefined || v === null) return '';
  if (col.kind === 'money') return money(Number(v));
  if (col.kind === 'date') return fmtDate(String(v));
  if (col.kind === 'percent') return `${v}%`;
  return String(v);
}
export const sortValue = (col: Column, r: Row) => {
  const v = r[col.key];
  return col.kind === 'money' || col.kind === 'number' || col.kind === 'percent' ? Number(v ?? 0) : String(v ?? '').toLowerCase();
};
