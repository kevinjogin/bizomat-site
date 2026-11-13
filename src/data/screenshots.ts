// Real product screens for the Engine Room (/engine-room/), /cad-automation/, /work/, /crm-platform/ and /finance-platform/ (with their guides). Each was captured from the running application (a
// local instance with example data, never a customer's), in Chromium at 1440 x 900. A screen whose file is not in
// public/ is skipped at build time, so a page never links a missing image.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export interface Screenshot { src: string; product: 'cad' | 'work' | 'crm' | 'finance'; title: string; caption: string }

const ALL: readonly Screenshot[] = [
  { src: '/proof-of-work/product/cad-dashboard.webp', product: 'cad', title: 'CAD Automation: Home', caption: 'The signed-in home: connection status, set-up steps and recent activity.' },
  { src: '/proof-of-work/product/cad-assistant.webp', product: 'cad', title: 'CAD Automation: CAD Assistant', caption: 'The connector address for AI apps, connected apps and example requests.' },
  { src: '/proof-of-work/product/cad-solidworks.webp', product: 'cad', title: 'CAD Automation: SOLIDWORKS', caption: 'The installer, paired computers and how the add-in connects.' },
  { src: '/proof-of-work/product/cad-tools.webp', product: 'cad', title: 'CAD Automation: Tools', caption: 'Every tool the assistant can call, in plain words.' },
  { src: '/proof-of-work/product/cad-overview.webp', product: 'cad', title: 'CAD Automation: product page', caption: 'The application\'s own product page.' },
  { src: '/proof-of-work/product/cad-signin.webp', product: 'cad', title: 'CAD Automation: sign in', caption: 'Sign-in for people and for AI apps.' },
  { src: '/proof-of-work/product/work-table.webp', product: 'work', title: 'Project Management: board, Table view', caption: 'Groups, items, owners, statuses and dates on one board.' },
  { src: '/proof-of-work/product/work-kanban.webp', product: 'work', title: 'Project Management: Kanban view', caption: 'The same items as cards, by status.' },
  { src: '/proof-of-work/product/work-timeline.webp', product: 'work', title: 'Project Management: Timeline', caption: 'Dates and dependencies on a Gantt timeline.' },
  { src: '/proof-of-work/product/work-dashboard.webp', product: 'work', title: 'Project Management: Dashboard', caption: 'Widgets computed from live board data.' },
  { src: '/proof-of-work/product/work-document.webp', product: 'work', title: 'Project Management: Document', caption: 'A rich-text document linked to the work.' },
  { src: '/proof-of-work/product/work-mywork.webp', product: 'work', title: 'Project Management: My Work', caption: 'Everything assigned to you, across boards.' },
  { src: '/proof-of-work/product/work-signin.webp', product: 'work', title: 'Project Management: sign in', caption: 'Sign in with an existing account.' },
  // Customer Relationship Management (CRM), captured 13 Nov 2026 from a local instance with a fictional organisation.
  { src: '/proof-of-work/product/crm-overview.webp', product: 'crm', title: 'Customer Relationship Management: Overview', caption: 'Open pipeline, forecast, win rate and follow-ups, computed from the records.' },
  { src: '/proof-of-work/product/crm-board.webp', product: 'crm', title: 'Customer Relationship Management: Deals board', caption: 'Deals by stage with value, owner and expected close. Drag a card to move it.' },
  { src: '/proof-of-work/product/crm-deal.webp', product: 'crm', title: 'Customer Relationship Management: a deal', caption: 'The stage path, details, notes, activities and stage history of one deal.' },
  { src: '/proof-of-work/product/crm-contact.webp', product: 'crm', title: 'Customer Relationship Management: a contact', caption: 'Details and the timeline: notes, meeting notes and planned calls.' },
  { src: '/proof-of-work/product/crm-leads.webp', product: 'crm', title: 'Customer Relationship Management: Leads', caption: 'Open leads with source, status, lead score and estimated value.' },
  { src: '/proof-of-work/product/crm-activities.webp', product: 'crm', title: 'Customer Relationship Management: Activities', caption: 'Activities grouped by due date, completed with one click.' },
  { src: '/proof-of-work/product/crm-report.webp', product: 'crm', title: 'Customer Relationship Management: Forecast report', caption: 'Open deals by expected close month: total, weighted and commit.' },
  { src: '/proof-of-work/product/crm-automations.webp', product: 'crm', title: 'Customer Relationship Management: Automations', caption: 'The seven automations a new organisation starts with, and their runs.' },
  { src: '/proof-of-work/product/crm-permissions.webp', product: 'crm', title: 'Customer Relationship Management: Permissions', caption: 'What each role may view, create, edit, delete, export and import.' },
  // Finance, captured 13 Nov 2026 from a local instance with a fictional business ("Harbourside Design") and example data.
  { src: '/proof-of-work/product/finance-dashboard.webp', product: 'finance', title: 'Finance: Dashboard', caption: 'Income, expenses, cash, what is owed both ways, approvals, budget and the year so far.' },
  { src: '/proof-of-work/product/finance-transactions.webp', product: 'finance', title: 'Finance: Transactions', caption: 'Money in, out and between accounts, with category, status and totals for the filters.' },
  { src: '/proof-of-work/product/finance-transaction-form.webp', product: 'finance', title: 'Finance: a new transaction', caption: 'One payment split across two categories, with GST worked out on each line.' },
  { src: '/proof-of-work/product/finance-statement.webp', product: 'finance', title: 'Finance: Statement lines', caption: 'An imported bank statement: lines matched to what is recorded, or recorded in one step.' },
  { src: '/proof-of-work/product/finance-reconcile.webp', product: 'finance', title: 'Finance: Reconcile', caption: 'The statement balance against the books, with what is not yet reconciled.' },
  { src: '/proof-of-work/product/finance-invoices.webp', product: 'finance', title: 'Finance: Invoices', caption: 'Invoices by status with what is still to be received and what is overdue.' },
  { src: '/proof-of-work/product/finance-invoice.webp', product: 'finance', title: 'Finance: an invoice', caption: 'Lines with GST and tracking, a part payment and what is still owed.' },
  { src: '/proof-of-work/product/finance-report.webp', product: 'finance', title: 'Finance: Profit and loss', caption: 'Income and expenses for the financial year to date, from posted journals.' },
  { src: '/proof-of-work/product/finance-balance-sheet.webp', product: 'finance', title: 'Finance: Balance sheet', caption: 'Assets, liabilities and equity on one date, with the check that they balance.' },
  { src: '/proof-of-work/product/finance-gst.webp', product: 'finance', title: 'Finance: GST and BAS worksheet', caption: 'GST by tax code and the BAS labels for a quarter: a worksheet to check, not a lodgement.' },
  { src: '/proof-of-work/product/finance-budget.webp', product: 'finance', title: 'Finance: a budget', caption: 'Amounts by category and month for the financial year.' },
  { src: '/proof-of-work/product/finance-chart.webp', product: 'finance', title: 'Finance: Chart of accounts', caption: 'Accounts by type with codes, default GST codes and balances.' },
  { src: '/proof-of-work/product/finance-permissions.webp', product: 'finance', title: 'Finance: Roles and permissions', caption: 'What a role may view, create, edit, delete, approve, import and export.' },
  { src: '/proof-of-work/product/finance-start.webp', product: 'finance', title: 'Finance: workspaces', caption: 'Personal, household and business workspaces, and creating another.' },
  { src: '/proof-of-work/product/finance-personal.webp', product: 'finance', title: 'Finance: a personal workspace', caption: 'Income and spending for the month, by category, with the accounts.' },
];

const exists = (src: string) => existsSync(join(process.cwd(), 'public', src));
export const screenshots = (product?: Screenshot['product']) => ALL.filter((s) => (!product || s.product === product) && exists(s.src));
