# BIZOMAT ERP: enterprise workspace update

Status: 14 Nov 2026. BIZOMAT ERP is live at `https://bizomat.ai/erp` (`docs/system/README.md`). Documents 01 to 10 in
this folder were the design for review, made before anything was built. This page records the workspace as built,
what each person sees first, and the screens still to come, so the design and the product do not drift. It refers to
the earlier documents rather than repeating them. Statuses follow `src/data/erp-capabilities.ts` (live, connected,
in-development, planned); the full matrix is `../architecture/13-enterprise-capability-matrix.md` and the stages are in
`../architecture/15-erp-roadmap-2026.md`.

## 1. What was built, and how it differs from the design

| Design (documents 01 to 10) | As built (live) | Why or what next |
| --- | --- | --- |
| Header with company and site selectors, global search, quick create, notifications, help, user menu (`02-information-architecture.md` section 2) | Header with the BIZOMAT lockup, the company switcher (your companies, then "Shared with you"), the theme switch and the profile menu (Profile and security, Sign out) | Sites come with S2; search and notifications with S1; quick create after the first ERP records (S3) |
| Two-level sidebar with one section open at a time (`01-ux-specification.md` 4.1) | A module rail at the left of every screen, a bar along the bottom on a phone (`SuiteRail.tsx`). Each tool keeps its own navigation beside the rail | The tools already had complete navigation; the rail joins them without rebuilding them |
| Existing apps rendered inside the ERP shell with a link base and an "embedded" flag (`../architecture/03-modular-erp-architecture.md` 3.4) | Every tool opens inside the ERP at `/erp/tasks`, `/erp/crm`, `/erp/finance` and `/erp/company`, the same screens under a longer path; links between tools stay inside (`toolUrl`) | Done differently and more simply: the same app is served under each suite path |
| Role dashboards (`04-role-dashboards.md`) | The Dashboard is by company: one card per tool with its figures, read on request under each tool's own rules | Role layouts come with S1 (first screen by role) and S13 (widgets across modules) |
| My Work across every module (`01-ux-specification.md` 4.4) | My Work opens Projects' My Work for the workspace used last | Across tools in S1 |
| Planned modules visible with demonstration data | The Operations page lists them with a Planned badge and links to the design preview at `/system-preview/` | The preview stays demonstration data and out of search |

## 2. The module rail as built

| Rail item | Opens | What it shows | State |
| --- | --- | --- | --- |
| Dashboard | `/erp/` (the company used last) | The company's tools as cards with their figures, and the Products and Engineering card | live shell; figures connected |
| My Work | `/erp/my-work` | Projects' My Work for the workspace used last | live (Projects only); across tools planned (S1) |
| Sales and CRM | `/erp/crm/` | The CRM | live |
| Finance and Accounting | `/erp/finance/` | Finance | live |
| Projects and Tasks | `/erp/tasks/` | Projects | live |
| Products and Engineering | `/erp/cad` (the company's CAD page) | CAD Automation's four setup steps and the company's CAD computers | setup live; computers in-development (the page says CAD Automation is not reporting yet) |
| Operations | `/erp/operations` | Procurement, inventory, manufacturing, quality, asset management and maintenance, supply chain and product records, each with a Planned badge | planned modules |
| Reports | `/erp/reports` | Every report of the company's tools; each opens in its module with its permissions | live |
| Administration | `/erp/administration` | Company overview, people and roles, departments, tools and settings; each tool's team and settings; your profile; the ERP console for platform administrators | live |

On the ERP's own pages a narrow sidebar sits beside the rail: Dashboard, Products and Engineering and Company for the
current company; "Open a tool" with the company's tools; the ERP console for platform administrators; and "Open CAD
Automation", whose application keeps its own sign-in for now.

Keep the rail at nine items. A new module is reached from the page of its rail group (for example Operations) until
the owner decides it needs its own item; a phone's bottom bar has no room for many more.

## 3. Role-based workspaces

Today everyone lands on the Dashboard of the company they used last. What they see is decided by each tool's own role
rules: a tool's figures appear only to people whose role in that tool may see them, and the card says so otherwise.
ERP module levels and role templates come in S2; a first screen chosen by role comes in S1. The planned layouts are in
`04-role-dashboards.md` section 3.

| Role | Sees first today | Sees first when built | Built in |
| --- | --- | --- | --- |
| Owner | Dashboard with every tool's figures (the company owner may see them all) | Company performance: revenue, margin, cash, late orders, approvals waiting (`04-role-dashboards.md`, CEO) | S1, S13 |
| Administrator | Dashboard; Administration for people, departments, tools; the ERP console for platform administrators | Administration: people, invitations, modules switched on, access requests | S1, S2 |
| Finance | Dashboard with Finance figures when their Finance role may view reports; Finance and Accounting | Finance manager and accountant layouts: cash, receivables, payables, GST, lines to match | S1, S13 |
| Sales | Dashboard with CRM figures; Sales and CRM | Sales: pipeline, win rate, quotes awaiting an answer, orders this month | S1, S4 |
| Engineering | Products and Engineering (CAD setup) | Engineering: open changes, BOMs in review, CAD jobs, my engineering tasks | S1 (CAD jobs), S7 |
| Operations | Operations (planned modules) | Maintenance first (requests to approve, open work orders, overdue preventive work), then purchasing, warehouse, production and quality layouts | M1, then S5, S6, S8, S9 |
| Employee | My Work (Projects tasks) | My Work across tools; raise a maintenance request from a phone | S1, M1 |

## 4. Executive dashboard

- **Today (connected):** the company's name and kind (registered, own, or shared with you); one card per tool with
  figures: Projects (open tasks, overdue, due in 7 days, projects), CRM (open deals, pipeline value, won in 30 days,
  follow-ups due), Finance (income, expenses, owed to you, you owe, this financial year from posted entries); the
  Products and Engineering card. Each card opens its tool inside the ERP. Figures are read on request; nothing is
  stored by the ERP.
- **Planned:** the role layouts and widget catalogue of `04-role-dashboards.md` (S1 and S13), every figure opening the
  list behind it, and measures across modules (on-time delivery, utilisation, maintenance compliance) once their
  modules exist.

## 5. My Work

- **Today (live):** the rail's My Work opens Projects' My Work.
- **Planned (S1):** the tabs and item model of `01-ux-specification.md` 4.4 and `02-information-architecture.md`
  section 6, reading Projects tasks, CRM follow-ups and Finance approvals, each with its own permission check. Later
  sources: ERP approvals (S2), maintenance requests to approve and work orders assigned to me (once M1 is live), and
  inspections and counts due (S6, S9).

## 6. Universal search (planned, S1)

- Design: `02-information-architecture.md` section 7; the result shape and in-process merge:
  `10-implementation-recommendations.md` section 3.
- Each source answers from its own search and permissions; another company's records never appear.
- Until then each tool has its own: Projects' search across a workspace, the CRM's organisation-wide search and
  Finance's list searches.

## 7. Department entry screens

| Department | Entry today | State | Entry when built (design reference) | Stage |
| --- | --- | --- | --- | --- |
| Sales and CRM | `/erp/crm/`: the CRM's overview | live | Adds sales orders and deliveries (`02-information-architecture.md`, Sales & Customers) | S4, S6 |
| Finance | `/erp/finance/`: the Finance dashboard | live | Unchanged; ERP journals appear with their origin | F1 |
| Engineering | `/erp/cad`: CAD Automation setup and computers | setup live; computers in-development | Products, BOMs, revisions, changes, drawings (journey 4 in `09-user-journeys.md`) | S1, S3, S7 |
| Procurement | Operations card (Planned). Suppliers, purchase orders and bills are in Finance today | planned | Requisitions, RFQs, purchase orders with receiving (journey 5) | S5 |
| Inventory | Operations card (Planned) | planned | Stock on hand, movements, receipts, counts, scanning (journey 6) | S6 |
| Manufacturing | Operations card (Planned) | planned | Work orders, planning board, shop floor (journey 7) | S8 |
| Quality | Operations card (Planned) | planned | Inspections, NCRs, corrective actions (journey 8) | S9 |
| Maintenance | Its own rail item, Maintenance, and "Report a fault" at the foot of the rail (owner's brief, 14 Nov 2026) | M1 live | Requests and work orders first (section 8) | M2 to M4 |
| Supply Chain | Operations card (Planned) | planned | Shipments, carriers, delivery schedule, returns | S10 |
| Reports | `/erp/reports` | live | Enterprise and operational reports, saved and scheduled (journey 10) | S13 |
| Administration | `/erp/administration` | live | Sites, legal entities, module access, role templates, approval rules, numbering, one audit view | S2 |

When a module is released, its Operations card changes from Planned to its real state and opens the module. A card
never shows a planned module as working.

## 8. Maintenance screens (CMMS)

Owner's brief, 14 Nov 2026, with MEX as a functional reference only (no branding, design or text taken). Stage M1 is
being built; nothing below is live yet. For M1 this table is design intent: the screens as built decide, and this page
is updated when M1 is released. The screens use the patterns of `05-reusable-screens.md` (L list, R record, F form,
W workflow or approval, M phone-first).

| Screen | Who uses it | Pattern | What it shows and does | Stage | State |
| --- | --- | --- | --- | --- | --- |
| Maintenance requests | Requesters raise; supervisors or administrators approve when the company requires approval (maintenance roles: administrator, supervisor, technician, requester) | L, F, W, M | Raise a request with a description, priority, department, location and the date it is needed, against an asset where known, with photos; approve it, decline it or ask for more information; an approved request becomes a work order | M1 | in-development |
| Work orders | Planners, supervisors, technicians | L, R, F | List by status, asset, priority, job type and technician; the record with its tasks, required parts (text lines until stores exist), labour, notes, photos and documents, and the history of every change. Later: inspections (M2), parts issued from stores and costs (M3) | M1 (later tabs M2, M3) | in-development (base) |
| Assets | Maintenance staff, administrators | L, R, F | Register with search and filters; hierarchy as a tree (assets within assets and locations); asset record with details, documents and work history. Later: readings and trend charts (M2), drawings and manuals from Engineering (M4) | M1 (later tabs M2, M4) | in-development (base) |
| Technician mobile | Technicians on a phone | M | My work orders today; start and stop the labour timer (one running at a time); add photos and notes; complete. Works online only: offline is not offered until its queue, reconnection, conflict resolution and audit are tested | M1 (offline M4) | in-development; offline planned |
| Preventive plans and calendar | Planners | L, F, calendar | Plans by time, usage or condition; the calendar of upcoming and overdue work; recurring work orders | M2 | planned |
| Inspections | Technicians, supervisors | M, F | Checklists across several assets; answers pass, fail, observation, not applicable, number, text, photo, signature; a failed answer raises a request or work order by rule, shown on the answer | M2 | planned |
| Prestarts | Operators of equipment | M | A short checklist before use; a failed item can raise a request, by the same rules as inspections | M3 | planned |
| Stocktake | Store staff, approvers | M, W | Count by store and bin with barcode or QR scanning or typed codes; variances over the threshold go for approval; posted through the central inventory service, never a maintenance stock table | M3 | planned |
| Scheduling assistant | Planners | W | A proposed schedule shown on the calendar beside the current one, with an explanation for each assignment; edit it, then accept or reject; every proposal and decision kept. It never changes a work order on its own | M4 | planned |
| Reliability reports | Managers | Rp | Mean time between failures and to repair, failure frequency, downtime, preventive maintenance compliance, repeat failures, cost by asset and department, with exports | M4 | planned |
| Maintenance administration | Administrators | F | Custom and mandatory fields, labels, categories, job types, priorities, approval rules, templates, field-level edit rights, and an audit of every configuration change | M2 to M4 | planned |

Placement (built with M1): Maintenance has its own rail item, between Products and Engineering and Operations, and the
Operations page lists what of it is live and what is planned. "Report a fault" at the foot of the rail raises a request
from any ERP screen. Technicians reach their work orders
from My Work once My Work gathers ERP items (S1 and M1).

## 9. Shared components and interaction patterns

Built from what the apps already use; tokens and components are those of `06-design-system.md` and `shared/brand/`.

| Component or pattern | As built | Use it for |
| --- | --- | --- |
| Module rail | `SuiteRail.tsx`, left on desktop, bottom bar on a phone | Moving between modules; never for pages inside one |
| Page header | `PageHeader` (title, subtitle, actions) | Every ERP page; one primary action |
| Cards | Tool and module cards on the Dashboard, Operations, Reports | Entry points; figures with a word, not colour alone |
| Badges | Planned, Online and Offline, statuses | State in words. A Planned badge never sits on a working feature |
| Tables | `data-table responsive` (rows become cards on a phone) | Lists; the full list pattern is `05-reusable-screens.md` section 2 |
| Menus | `Dropdown`, `MenuItem` | Company switcher, profile, row actions |
| Loading, error, empty | `Loading`, `ErrorBox` with Retry, `EmptyState` | Every page; empty states say what the page is for |
| "Figures are shown to people whose role shows them" | Tool cards | Any figure the person's role may not see: say why, never show a zero |
| Open in its module | Cards and links (`toolUrl`) | Going to the owning tool's record without leaving the ERP |

Patterns still to build, each with its tests (codes in `../architecture/13-enterprise-capability-matrix.md` 1.3):
- **Approval panel** (`05-reusable-screens.md` section 5): approve or return with a reason; the requester never
  approves their own (T-PERM). First users: maintenance requests (M1), then S2's engine.
- **Proposal review** for AI: preview, explanation, edit, accept or reject, history, comparison (T-AI). First user: the
  scheduling assistant (M4).
- **Scanning input**: camera or typed code, with the same result either way (S6.2, M3).
- **Checklist answers**: the answer types of section 8, each accessible by keyboard and screen reader (M2).
- **Offline indicator**: only after T-OFF passes; until then screens say they need a connection.

Rules that hold for every new screen: plain language and Australian spelling (`01-ux-specification.md` 4.8); the
computer's theme (4.9); no inline styles (the CSP); keyboard reach, visible focus and AA contrast in both themes
(`06-design-system.md` section 3); phone layouts as in `07-responsive-layouts.md`.

## 10. Live and planned at a glance

| Area | Live or connected | In development | Planned |
| --- | --- | --- | --- |
| Shell | Rail, tools inside, company switcher, theme, profile, Operations page, Reports, Administration, ERP console | - | Search, notification centre, quick create, sites |
| Dashboard | By company, figures from each tool | - | Role layouts, widgets, drill-down |
| My Work | Projects' My Work | - | Across tools |
| Engineering | CAD setup | CAD computers and jobs | Product records, BOMs, changes |
| Maintenance | - | Requests, work orders, assets, technician mobile | Plans, inspections, prestarts, stocktake, scheduling assistant, reliability, administration, offline |
| Other operations | - | - | Procurement, inventory, manufacturing, quality, supply chain |
