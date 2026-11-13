# BIZOMAT Finance

_Built 13 Nov 2026 on the owner's brief ("PROJECT: BIZOMAT FINANCE"). The product page `/finance-platform/` and the
user guide `/finance-platform/guide/` are on the website (below, "On the website")._

BIZOMAT Finance is a financial management application for every BIZOMAT account: personal, household and business
workspaces (as many businesses as needed), each with its own members, roles and permissions, chart of accounts,
transactions, bank statement import and reconciliation, invoices, bills, purchase orders, expense claims, budgets,
savings goals, documents, automation and reports. Underneath every workspace is a double-entry general ledger: every
record that moves money writes a balanced journal, and every report is computed from posted journals.

## What it does not do (stated in the app and on the website)

- **No bank connections.** It never connects to a bank and never asks for internet banking passwords. People import
  statements they download themselves (CSV, OFX or QIF). A live bank feed needs an approved provider (for example a
  Consumer Data Right accredited data recipient or an intermediary), which has not been chosen or approved.
- **No payment processing.** Recording a payment records money already received or paid. Nothing is charged, sent or
  collected, and no screen offers "pay now".
- **No lodgement, no certification.** The GST report is a worksheet to check before a BAS is lodged with the ATO by the
  business or its agent. BIZOMAT does not lodge, and is not a certified tax, payroll or statutory accounting product.
  It does not do payroll (PAYG withholding, super, Single Touch Payroll).
- **AI does not post.** Category suggestions come from the workspace's own rules and history; every posted entry and
  every calculation is the application's own validated logic.

## Where it runs: no new infrastructure

| | |
| --- | --- |
| Address | `https://bizomat.ai/finance/` (sign-in `https://bizomat.ai/finance/login`) |
| Code | `apps/work` (the Project Management app): API `src/worker/fin/` (mounted at `/api/fin`, because Project Management already has `/api/finance` for its board budgets), screens `src/client/fin/`, shared definitions `src/shared/fin/`, styles `src/client/styles/fin.css` (with the CRM's `crm.css` layouts) |
| Process | the existing `work` Machine of the Fly app `bizomat` (shared-cpu-1x, 512 MB). No new app, Machine, process group, volume, service, database or secret |
| Database | the existing SQLite database on the `work_data` volume (`/data/work/db.sqlite`; D1 on Cloudflare), migration `0011_finance.sql` |
| Files | the existing file store (`/data/work/files/` on Fly; R2 on Cloudflare), under `fin/<workspace>/...` |
| Backups | the existing ones: the pre-migration copy at start and the data folder's backups (`docs/BIZOMAT-OPERATIONS.md`) |
| Accounts and sessions | Project Management's (one BIZOMAT login for Project Management, the CRM and Finance) |
| Email | the existing outbox (Brevo): invitations and notification emails only |
| Background work | the existing 15-minute maintenance run: recurring records each run; alerts, summaries and scheduled reports once an hour |
| Routing | the edge proxy sends `/finance` and `/finance/...` to `work` (`infrastructure/proxy/routes.mjs`, `FINANCE_PATHS`); the website Worker does the same on Cloudflare (`src/worker.ts`) |

Under `/finance` (`<base href="/finance/">`) the SPA renders Finance (`src/client/App.tsx`, `IS_FINANCE`); its code is
a separate lazily loaded chunk. The session cookie is written for `/tasks`, `/crm` and `/finance`
(`src/worker/mount.ts`). A Finance page without a cookie goes once to `/tasks/api/app-carry`, which carries a valid
session over or sends the person to Finance's sign-in page (a 60-second `fin_carry` marker prevents loops; it only ever
redirects into `/finance`).

## Data model (migration `0011_finance.sql`, additive)

30 new tables, all named `fin_*`; no existing table, column or row changes. Money is integer cents of the workspace's
currency (AUD by default).

| Area | Tables |
| --- | --- |
| Workspaces | `fin_orgs` (kind personal, household or business; currency; financial year start; GST settings; ABN; lock date; settings), `fin_members` (exactly one owner, unique partial index), `fin_invitations` (token hash only), `fin_role_permissions`, `fin_counters` |
| Chart and tax | `fin_accounts` (type and subtype, parent for subcategories, code, system accounts), `fin_tax_codes` (rate, sales or purchases, BAS labels), `fin_tracking` (departments, projects, cost centres) |
| Ledger | `fin_journals`, `fin_journal_lines` (one-sided positive debit or credit, signed tax amount, contact, tracking, person) |
| Money | `fin_transactions`, `fin_transaction_lines`, `fin_statement_imports`, `fin_statement_lines`, `fin_reconciliations`, `fin_rules` |
| Sales and purchases | `fin_contacts`, `fin_docs` (invoice, bill, purchase order, expense claim), `fin_doc_lines`, `fin_payments`, `fin_doc_templates` |
| Planning | `fin_budgets`, `fin_budget_lines`, `fin_goals`, `fin_recurring`, `fin_report_schedules` |
| Documents and people | `fin_files` (versions), `fin_notifications`, `fin_notification_prefs`, `fin_audit_log` |

### Ledger integrity

- A journal is inserted as a draft, its lines added, and it is posted in the same atomic batch. The server validates
  first (lock date, at least two lines, whole positive one-sided amounts, accounts and tax codes of the workspace,
  debits equal credits); six database triggers refuse anything that gets past it:
  `fin_journal_post_balanced` (posting needs two or more lines that balance), `fin_journal_post_locked` (nothing on or
  before the lock date), `fin_journal_posted_frozen` (a posted journal keeps its date, number, status and source; only
  the pointer to its reversal is written), `fin_journal_posted_no_delete`, `fin_journal_lines_posted_no_update`,
  `fin_journal_lines_posted_no_delete`.
- Corrections are reversals: changing a posted transaction or approved document reverses its journal and posts a new
  one; voiding reverses. A reversal in a locked period needs a later date.
- Retained and current-year earnings are computed in the balance sheet and trial balance, so no year-end closing
  journal is needed.
- Every link between two Finance rows is a composite foreign key `(org_id, ref_id) -> table(org_id, id)`: the database
  refuses links between workspaces.
- The triggers fire on UPDATE and DELETE only, so the data tools still load rows into a fresh database: the move to
  Cloudflare (`scripts/migrate/to-cloudflare.mjs`) accepts them, its `clear.sql` drops and re-creates them inside the
  same transaction when it replaces rows, and it refuses to append a long row in pieces to a guarded table. Each
  trigger is written on one line in the migration for that reason.

### Isolation

Membership first (`src/worker/fin/access.ts`, `requireOrg`: a non-member gets 404), every query scoped by `org_id` and
the person's view scope, and the composite foreign keys above. Personal workspaces are private to their owner until
the owner invites someone. Files are served only to people who can see the record they belong to.

## Roles and permissions

| Role | Default |
| --- | --- |
| Owner | Complete control, including ownership transfer and deletion (exactly one) |
| Administrator | Members, permissions, settings and every financial record |
| Accountant | Every record, the chart of accounts, tax codes, journals and the period lock; not members |
| Finance Manager | Transactions, invoices, bills, approvals, budgets and reports; views the chart, no journals, lock or settings |
| Contributor | Adds transactions, receipts, bills and expense claims and sees their own; in business workspaces they wait for approval |
| Viewer | Reads records and reports; changes nothing |

Record modules (money accounts and transactions, sales, purchases, contacts, documents) take view, edit and delete as
all, own or none, and create, approve, import and export as on or off; accounting (view, manage, journals, lock),
reports (view, export), budgets (view, manage), settings and members are on or off. Owners and administrators can
change the four other roles per workspace; a stored setting never widens beyond the code, and editing or deleting never
reaches beyond viewing (`src/shared/fin/roles.ts`, `resolvePerms`). In personal and household workspaces contributors
see every transaction, the reports and the budgets. The server checks every permission.

## Features

- **Workspaces:** create (personal, household or business, with a starting chart of accounts; a business also starts
  with the tax codes, used once it is registered for GST), switch, rename and settings, logo, invite by email (accept, decline, resend, withdraw; the
  invited address must match), roles, permissions, remove members, leave, transfer ownership, delete (owner).
- **Chart of accounts:** assets, liabilities, equity, income, cost of goods sold, operating and other expenses, bank,
  cash, credit cards, loans, receivables, payables and GST; categories and subcategories; codes; rename, reorder,
  archive (at a zero balance), delete when never used; opening balances; departments, projects and cost centres;
  personal charts of everyday categories, business charts with Australian-style codes.
- **Transactions:** money in, money out and transfers; split across categories; GST inclusive, exclusive or none;
  tracking; payee, contact, reference, notes and attachments; drafts, submission and approval; edit (reverse and
  repost), void, delete drafts; bulk post, void, delete, categorise, set contact, reconcile; search and filters;
  duplicate warnings; category suggestions from rules and history; history of every change.
- **Bank statements:** CSV with column mapping and a preview, OFX and QIF; duplicates skipped by FITID or by date,
  amount, description and reference; match a line to a recorded transaction or payment, create a categorised
  transaction or transfer (and remember the category as a rule), ignore, unmatch; reconcile against the statement's
  closing balance with the difference and history.
- **Invoices, bills, purchase orders, expense claims (business):** automatic or custom numbers with prefixes, customers
  and suppliers with terms, due dates, lines with quantity, price, discount, account, GST and tracking; approval;
  partial payments (overpayment refused); overdue tracking; purchase order to bill; PDF invoices (titled "Tax invoice"
  when the business is registered for GST, with the seller's name and ABN, the date, each line's description, quantity
  and price, the GST or "Total price includes GST", and the customer's name and ABN when recorded; the ATO requires the
  buyer's identity or ABN on tax invoices of $1,000 or more, so record it on the customer); void (after payments are
  voided); recurring invoices and bills.
- **Reports (from posted journals):** profit and loss (with comparisons), balance sheet, cash flow statement (direct
  method, reconciled to cash), general ledger, trial balance, account transactions, income and expenses by month,
  budget against actual, cash flow forecast, aged receivables, aged payables, GST and BAS worksheet; filters by dates,
  department, project, cost centre and (household) person; CSV and PDF; scheduled monthly or quarterly into Documents.
- **Budgets and goals:** monthly budgets by category for twelve or more months, by department, project or cost centre,
  filled from last year's actuals with an uplift; budget against actual; savings goals tracked from an account or by
  hand.
- **Documents:** upload, folders, link to an account, attach to transactions, invoices, bills, journals or contacts,
  versions, search, download (attachment, sandboxed), delete (kept for the audit trail).
- **Automation:** recurring transactions, invoices and bills (weekly, fortnightly, monthly, quarterly, yearly; the day
  of the month kept); alerts for invoices and bills due soon or overdue, budgets nearly spent, a monthly summary,
  approvals and scheduled reports; each notification sent once (dedupe key), in the app and by email where connected.
- **Dashboard:** income, expenses and net for a period, cash and debts, money accounts, receivables and payables,
  budget, upcoming payments, recent transactions, approvals waiting, statement lines to match, goals, a 12-month trend
  and spending by category.

## Australian GST and BAS: what was checked

Checked against the ATO's published guidance on 13 Nov 2026: GST is 1/11 of a taxable price that includes GST (10% of
the GST-exclusive price); simpler BAS reports G1 (total sales), 1A (GST on sales) and 1B (GST on purchases); full
reporting adds G2 (exports), G3 (other GST-free sales), G10 (capital purchases) and G11 (non-capital purchases); the
cash basis counts GST when payment is received or made, the accrual basis when invoiced; tax invoices carry the details
listed above. The tax codes (`src/shared/fin/tax.ts`) map to those labels. The worksheet
rounds to whole dollars as the BAS form does and carries the disclaimers. Rules change: check the ATO before relying on
it, and have a registered tax or BAS agent review a BAS.

## Super admin console

`https://bizomat.ai/finance/admin`, for platform admins only (the founder, who is the super admin, and the admins the founder adds): usage, people, activity and health of every workspace as counts, never amounts, balances or descriptions; personal and household workspaces are shown by their kind, not their name, and two audited support actions (restore a deleted workspace; hand over ownership, founder only). Everyone else gets 404. Details: `apps/work/docs/ADMIN.md`, "Super admin consoles for the CRM and Finance".

## Deployment and rollback

1. Merge to `main` by pull request; deploy with **BIZOMAT deploy (bizomat)** (`confirm` = `DEPLOY`). One image carries
   the proxy (with `/finance` routing) and the work app (Finance API and screens).
2. At start, the work server copies the database (`pre-migration-backups/`) and applies `0011_finance.sql` in one
   transaction. Additive only.
3. The workflow then checks `https://bizomat.ai/finance/login`; `infrastructure/smoke/smoke.mjs` checks
   `/finance/api/health`, the page, the carry redirect and 401 without a session.

**Rollback:** redeploying the previous image is safe with the new tables in place (the previous code never reads them).
The previous proxy sends `/finance` to the website again (404). No data needs restoring.

## Tests

`apps/work/test/fin-access.test.ts`, `fin-ledger.test.ts`, `fin-banking.test.ts` (workerd and Node): workspaces and
their charts, isolation (404 to non-members, other workspaces' accounts refused, statement lines and files out of
reach), invitations, roles and permission overrides, personal privacy and household views, GST splitting, balanced
journals, database refusals of changes to posted entries and unbalanced posting, reverse and repost, void, period lock,
invoices, bills, purchase orders, expense claims, payments and numbering, the balance sheet and trial balance balancing,
cash flow reconciling, GST on accrual and cash bases, aged receivables, CSV and PDF exports, CSV, OFX and QIF import
with duplicates, matching, rules and reconciliation, recurring records and the scheduled alerts, summary and reports,
budgets, goals, documents, the dashboard, and the `/finance` address with its session carry. `test/mount.test.ts`
checks the cookie for all three paths; the data tools' tests (`test-node/migrate.test.ts`, `to-cloudflare.test.ts`)
cover the ledger triggers. Proxy: `infrastructure/proxy/test/routes.test.mjs`. Website: `tests/worker.test.ts`,
`tests/navigation.test.ts`, `tests/homepage.test.ts`, `tests/platform-catalog.test.ts`.

## Not in this release

- Live bank feeds and payment collection (no approved provider; above).
- Payroll, PAYG withholding, superannuation and Single Touch Payroll.
- BAS lodgement (the worksheet is for checking).
- Multi-currency within one workspace (one currency per workspace, so totals are never mixed).
- Sending invoices to customers by email from BIZOMAT (download the PDF and send it from your own email; mark it sent).

## On the website

- `/finance-platform/`: the product page (what it does, workspaces, the ledger, banking, invoices, reports, GST, roles,
  security, what it does not do, getting started). It cannot be `/finance/`, which is the application.
- `/finance-platform/guide/`: the user guide, step by step, with the application's own labels.
- Both read their facts from `src/data/platform-catalog.ts` (`FINANCE`); `tests/platform-catalog.test.ts` compares the
  reports, roles, tax codes and frequencies with this application's code. Screens: `src/data/screenshots.ts`
  (`product: 'finance'`), captured from a local instance with fictional example data.
- `/finance-platform/guide/` has sixteen steps and common questions; fifteen product screens were captured from a local
  instance with a fictional business ("Harbourside Design").
- Finance is in the main navigation, the Sign in menu, the footer, the homepage products, `/products/`, `/solutions/`,
  `/sign-in/`, the Engine Room and AI Search. With six items the header row needs more room: the menu button now
  takes over up to 1140 px (was 1000), and between 1141 and 1300 px the links sit closer and AI Search shows its icon
  only (`src/components/Header.astro`), measured at every width from 1141 to 1920 px.
