# 7. User roles, permissions, security and data integrity

Status: proposal for review. It keeps every existing permission model and adds one layer for ERP modules.

## 7.1 Layers (evaluated in this order, on the server, for every request)

| # | Layer | Exists | Source |
| --- | --- | --- | --- |
| 1 | Signed in (session cookie or `wos_` API token), account not disabled, password reset not pending | Yes | `src/worker/auth/session.ts` |
| 2 | Member of the company | Yes | `co_members` |
| 3 | Company role: owner, admin, member | Yes | `co_members.role` |
| 4 | Tool role for each existing tool (Project Management, CRM, Finance) | Yes | `co_members.tasks_role`, `crm_role`, `fin_role`, synced into each tool's members table by `src/worker/company/sync.ts`; each tool checks its own |
| 5 | **ERP module level** per module: none, view, contribute, approve, manage | New | `co_module_access` |
| 6 | **Site scope** for site-scoped modules (inventory, manufacturing, quality, maintenance, logistics) | New | `co_site_access` (empty = all sites) |
| 7 | Record rules: own records only (as Finance's "own" scope), department head sees the department, confidential flags | Partly (Finance, CRM) | per module |
| 8 | Workflow state: what an action may do in the record's status (a released revision cannot be edited; a posted move cannot be changed) | Yes (Finance) / new (ERP) | service checks plus database triggers |

The screens only hide what a person cannot use; the server decides. A record outside a person's company or scope is
reported as 404, never 403, so its existence is not revealed (the rule Finance and the CRM already follow).

## 7.2 Module levels

| Level | Means |
| --- | --- |
| none | The module is hidden and its API answers 404 |
| view | Read records and reports, export if the module allows it |
| contribute | Create and change own drafts; submit for approval; record day-to-day transactions (receive goods, report operations, record inspections) |
| approve | Everything in contribute plus approve, release, post and void in that module |
| manage | Everything plus module settings (numbering, approval rules, templates, master data such as work centres and warehouses) |

## 7.3 Role templates (the twelve personas)

A template sets the ERP module levels and the existing tool roles together when a person is invited or changed.
Administrators can edit templates per company and adjust any person individually.

ERP modules: PRD products & engineering, PRC procurement, INV inventory & warehouse, MFG manufacturing, QLT quality,
AST assets & maintenance, SCM supply chain, SAL sales orders & deliveries, RPT enterprise reports, ADM administration.

| Template | PRD | PRC | INV | MFG | QLT | AST | SCM | SAL | RPT | ADM | CRM role | Finance role | Project Management role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CEO / Business owner | approve | approve | approve | approve | approve | approve | approve | approve | view | manage | owner or admin | owner or admin | admin |
| Executive manager | view | approve | view | approve | view | view | view | approve | view | none | manager | finance_manager | project_manager |
| Sales manager | view | none | view | view | none | none | view | approve | view | none | manager | contributor (quotes, invoices of own) | member |
| Finance manager | view | approve | view | view | none | view | view | view | view | none | viewer | finance_manager | viewer |
| Accountant | view | view | view | view | none | view | none | view | view | none | none | accountant | none |
| Engineer | manage | view | view | contribute | contribute | view | none | view | view | none | none | none | member |
| Procurement manager | view | manage | contribute | view | view | view | contribute | view | view | none | none | contributor (bills) | member |
| Production manager | view | contribute | contribute | manage | contribute | contribute | view | view | view | none | none | none | project_manager |
| Warehouse manager | view | contribute | manage | view | contribute | none | approve | view | view | none | none | none | member |
| Quality manager | view | view | view | view | manage | view | none | none | view | none | none | none | member |
| Project manager | view | view | view | view | view | none | none | view | view | none | sales | viewer | project_manager |
| Administrator | manage | manage | manage | manage | manage | manage | manage | manage | view | manage | admin | admin | admin |

Notes:
- Finance roles keep Finance's own rules (approvals, own/all scopes, locked periods). An ERP level never widens a
  Finance, CRM or Project Management right: ERP calls them with the person's own tool role.
- "Administrator" administers access; whether it should see financial figures is the owner's choice (the Finance role
  in the template can be lowered).

## 7.4 Record-level security

| Rule | Where it applies | How |
| --- | --- | --- |
| Company isolation | Every ERP table | `company_id` on every row; composite foreign keys; every query filters by the company in the path after membership is checked |
| Site isolation | Site-scoped modules | `site_id` on the record; list queries add `site_id IN (allowed)` |
| Own records | Contribute level in modules that allow it (requisitions, inspections) | `created_by = me` for edit; view per module setting |
| Department visibility | Reports and dashboards | Department heads see their department's figures (the rule already used on the company overview) |
| Confidential costs | Product costs, supplier prices, margins | Visible with `view` in Finance-sensitive fields only to people whose Finance role may see reports; others see quantities, not money |
| Personal data | Contacts, users | Only fields needed for the task; exports audited |

## 7.5 Approval workflows

- Rules per company and record type (`erp_approval_rules`): conditions (amount over a limit, site, department,
  supplier status, change class) and steps (a role or named person; any one or all must approve).
- Approvals for Finance documents stay in Finance (its approval settings and `mayApprove`); ERP approvals cover ERP
  records: requisitions, engineering changes, NCR dispositions, write-offs, count adjustments over a threshold,
  maintenance orders over a cost.
- Segregation of duties: the requester can never approve their own request (enforced on the server); approval of a
  stock write-off and posting of its journal are by different people when the company turns this on.
- Every decision is recorded with person, time, comment and the record's state at that moment.

## 7.6 Audit history

- Every create, change, state transition, approval, export and permission change writes an audit row
  (`erp_audit_log`, the shape of `fin_audit_log`: actor, action, target, before, after, metadata, IP, time).
- Posted records are never edited: stock moves and journals are corrected by reversing entries, so the history is the
  audit.
- An enterprise audit view (Administration) reads `co_audit`, `crm_audit_log`, `fin_audit_log`, the Project Management
  audit tables and `erp_audit_log`, filtered by the reader's rights.

## 7.7 Document security

- Files are stored where every tool stores them today (R2 binding in the Worker, the volume on Node), under keys that
  are never guessable, and are served only through an API that first checks the person may see the parent record.
- Downloads are sent as attachments with `Content-Security-Policy: default-src 'none'; sandbox` (the rule Finance and
  the CRM use); inline previews are limited to images and PDFs from the same origin.
- Drawings from CAD Automation are shown through ERP only as links and previews the person's CAD access allows.

## 7.8 API authorisation

- Sessions: the existing HttpOnly, SameSite=Lax cookie written for every mount; CSRF token on every unsafe method.
- API tokens (`wos_`): scoped to the person; ERP adds optional module scopes (`erp:inventory:contribute`) so a scanner
  or integration gets only what it needs.
- BIZOMAT sign-in for other apps (OAuth 2.0 with PKCE, exists): CAD Automation will receive a token for the person and
  call ERP's narrow callback endpoints with it.
- Rate limits on public endpoints (existing `rate_limits` table) and on bulk operations.

## 7.9 Cross-module data integrity

| Risk | Control |
| --- | --- |
| A reference to another company's record | Same-company check against `co_tools` before storing any cross-tool reference |
| Two records for one customer, supplier or product | Single owners (section 4), unique keys, "find before create" in every linking action |
| Quantities invoiced or received twice | Guarded updates; idempotency keys on create and action calls |
| Ledger changed outside Finance | ERP never writes Finance tables; journals only through Finance's service; database triggers refuse edits to posted journals and posting into locked periods |
| A deleted record still referenced | Soft deletes; references show "deleted" rather than breaking |
| Partial failure across modules | Claim, call, confirm or release (section 6.4); outbox for reactions |
| Schema drift between Worker (D1) and Node (SQLite) | The same migrations run on both, and both test suites run in CI (as today) |
