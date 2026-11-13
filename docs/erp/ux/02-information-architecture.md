# BIZOMAT ERP: information architecture and navigation map

Status: design for review (owner's briefs "Phase 0: discovery and design only" and "Enterprise UI/UX design and
interactive prototype", 13 Nov 2026). Nothing here is built in the production application. The clickable prototype
(`apps/work/src/client/erp-prototype/`, see `08-prototype-guide.md`) follows this map exactly.

## 1. Principles

- **One workspace, existing applications inside it.** ERP is the signed-in front door of BIZOMAT. Customer
  Relationship Management, Finance, Project Management and CAD Automation stay the systems of record for what they own
  and keep their own addresses (`/crm/`, `/finance/`, `/tasks/`, `/cad/`). ERP opens their screens; it never copies
  their data or logic.
- **Every page says what it is.** Three states, shown as a badge on every navigation item and page header:
  - **Working**: an existing BIZOMAT screen, opened in place (same sign-in, same data).
  - **Connected**: an ERP screen built on existing records (for example My Work, which gathers tasks from Project
    Management, approvals from Finance and follow-ups from the CRM).
  - **Planned**: a new ERP module, shown in the prototype only, with demonstration data.
- **Few levels.** Two levels in the sidebar (section, page); a third only as tabs inside a page. One section open at a
  time; the rest collapsed.
- **Role first.** Each person lands on the dashboard of their role, sees only the sections their roles allow, and can
  pin favourites.

## 2. Shell anatomy (desktop)

```
+--------------------------------------------------------------------------------------------------------------+
| [B] BIZOMAT  ERP | Company: Example Engineering v | Site: Brisbane v |  [ Search everything...  /]  [+ New] [bell] [?] [JD] |
+-----------------+--------------------------------------------------------------------------------------------+
| Home            |  Home / Dashboards / Production Manager                        [Customise] [Role: v]       |
| My Work      12 |  +----------------+ +----------------+ +----------------+ +----------------+            |
|  ---            |  | KPI            | | KPI            | | KPI            | | KPI            |            |
| Favourites      |  +----------------+ +----------------+ +----------------+ +----------------+            |
|  * Work orders  |  +-------------------------------------+ +-------------------------------------+         |
|  * Stock on hand|  | Chart                               | | List: delayed work orders           |         |
| Recent          |  +-------------------------------------+ +-------------------------------------+         |
|  - WO-1042      |                                                                                              |
|  ---            |                                                                                              |
| Sales & Customers >                                                                                           |
| Finance         >                                                                                             |
| Projects & Tasks>                                                                                             |
| Products & Eng. v                                                                                             |
|   Products      |                                                                                              |
|   BOMs          |                                                                                              |
|   ...           |                                                                                              |
| [<< Collapse]   |                                                                                              |
+-----------------+--------------------------------------------------------------------------------------------+
```

- **Header** (left to right): BIZOMAT mark and wordmark with the product label "ERP"; company selector (the BIZOMAT
  company account, `co_companies`); site or branch selector (new core entity, `co_sites`, "All sites" by default);
  global search (keyboard `/`); quick create (`+ New`); notification centre; help; user menu (profile, theme, sign
  out, "Open the standalone apps").
- **Sidebar**: Home, My Work (with a count), Favourites (pinned pages), Recent (last 5 records and pages), then the
  module sections. Collapses to icons (state remembered on the computer, like the theme). On tablets it starts
  collapsed; on phones it is a drawer.
- **Page header**: breadcrumb, title, identifier and status badge for records, primary actions on the right, a
  secondary actions menu.
- **Content area**: dashboard grid, list, record, form or report (patterns in `05-reusable-screens.md`).

## 3. Navigation map

Badges: (W) working today, (C) connected ERP screen over existing data, (P) planned module.
"Opens" names the existing route the ERP page shows.

### Home (C)
- Dashboard for the person's role (twelve role layouts, section 5), personalised widgets.

### My Work (C)
- Tabs: All, My tasks, Approvals, Due today, Overdue, Waiting, Mentions.
- Sources: Project Management items assigned to me (`/tasks/w/:ws/my-work`), Finance approvals (submitted bills,
  claims, invoices, credit notes), CRM activities due (`/crm/o/:org/tasks`), ERP approvals (planned: purchase
  requisitions, engineering changes, quality dispositions), documents to review, mentions.

### Sales & Customers
| Page | State | Opens / owns |
| --- | --- | --- |
| Overview | W | CRM overview `/crm/o/:org/overview` |
| Customers | W | CRM companies `/crm/o/:org/companies` |
| Contacts | W | CRM contacts `/crm/o/:org/contacts` |
| Leads | W | CRM leads `/crm/o/:org/leads` |
| Opportunities and pipeline | W | CRM deals `/crm/o/:org/deals` |
| Activities | W | CRM activities `/crm/o/:org/activities` |
| Quotes | W | Finance quotes `/finance/o/:org/quotes` |
| Sales orders | P | ERP (new), from an accepted quote or a won deal |
| Deliveries | P | ERP (new), from a sales order |
| Sales reports | W | CRM reports `/crm/o/:org/reports` |

### Finance
| Page | State | Opens |
| --- | --- | --- |
| Finance dashboard | W | `/finance/o/:org/dashboard` |
| Invoices | W | `/finance/o/:org/invoices` |
| Credit notes | W | `/finance/o/:org/credit-notes` |
| Bills | W | `/finance/o/:org/bills` |
| Expense claims | W | `/finance/o/:org/expense-claims` |
| Banking | W | `/finance/o/:org/banking`, `/transactions` |
| Accounting | W | `/finance/o/:org/accounting/chart` (chart, journals, tax codes, numbering, period lock) |
| GST and BAS | W (worksheet) / P (BAS module) | `/finance/o/:org/reports/gst`; the BAS module with lodged-period snapshots is Stage 2 of the Finance brief |
| Budgets | W | `/finance/o/:org/budgets` |
| Financial reports | W | `/finance/o/:org/reports` |

### Projects & Tasks
| Page | State | Opens |
| --- | --- | --- |
| Projects | W | Project Management boards `/tasks/w/:ws/boards` |
| My tasks | W | `/tasks/w/:ws/my-work` (also gathered in My Work) |
| Teams | W | `/tasks/w/:ws/settings` (members and teams) and company departments `/company/c/:co/departments` |
| Schedule | W | board timeline and workload views (`/tasks/w/:ws/boards/:board/views/:view`) |
| Project dashboards | W | `/tasks/w/:ws/dashboards` |
| Project costs | W | company projects with Finance figures `/company/c/:co/projects` |

### Products & Engineering
| Page | State | Owns / opens |
| --- | --- | --- |
| Products | P | ERP product master (new) |
| Variants | P | tab of the product |
| Bills of materials | P | ERP (new) |
| Routings | P | ERP (new), shared with Manufacturing |
| Engineering changes | P | ERP (new): change requests and orders |
| Revisions | P | tab of the product and the BOM |
| Drawings and models | W (CAD) / P (ERP link) | CAD Automation `/cad/` operates the SOLIDWORKS files on the engineer's computer; ERP keeps the link, the revision and the released exports |
| CAD automation jobs | W | CAD Automation (SolidWorks MCP) `/cad/` |

### Procurement
| Page | State | Owns / opens |
| --- | --- | --- |
| Suppliers | W (contact) / P (profile) | Finance contacts of kind supplier `/finance/o/:org/contacts`, with an ERP supplier profile (new) |
| Requisitions | P | ERP (new) |
| Requests for quotation | P | ERP (new) |
| Purchase orders | W (document) / P (receiving) | Finance purchase orders `/finance/o/:org/purchase-orders`, with ERP lines and receiving (new) |
| Supplier bills | W | Finance bills `/finance/o/:org/bills` |
| Supplier performance | P | ERP report (new) |

### Inventory & Warehouse
- Stock on hand, Stock movements, Goods receipts, Transfers, Stock counts, Warehouses and locations, Scan (mobile).
  All P (new ERP), valued in Finance through journals (`06-integration-specification.md` in `architecture/`).

### Manufacturing
- Production orders (work orders), Production planning, Work centres, Routings (shared), Shop floor (mobile). All P.

### Quality
- Inspections, Nonconformances, Corrective actions, Inspection plans, Certificates. All P.

### Assets & Maintenance
- Assets, Maintenance plans, Work requests, Maintenance orders, Downtime. All P. Depreciation stays in Finance
  (fixed assets are Stage 3 of the Finance brief).

### Supply Chain
- Shipments, Carriers, Delivery schedule, Returns, Demand plan. All P.

### Reports & Analytics
| Page | State | Opens |
| --- | --- | --- |
| Enterprise dashboards | C | ERP (cross-module figures) |
| Financial reports | W | Finance reports |
| Sales reports | W | CRM reports |
| Project reports | W | Project Management dashboards |
| Operations reports | P | Inventory, production, quality, maintenance |
| Saved and scheduled reports | W (Finance, Project Management) / P (ERP) | |

### Administration
| Page | State | Opens |
| --- | --- | --- |
| Company | W | `/company/c/:co/overview` |
| People and roles | W | `/company/c/:co/people` |
| Departments | W | `/company/c/:co/departments` |
| Sites and branches | P | new core entity |
| Tools and modules | W / P | `/company/c/:co/tools`; module access for ERP modules is new |
| Approval workflows | P | ERP (new), reusing Finance's approval rules |
| Numbering | W (Finance) / P (ERP) | Finance numbering; ERP series for new records |
| Audit trail | W | per tool today; an ERP view across them is C |

## 4. ERP routes

The ERP application is a new mount of the existing work app, as `/crm`, `/finance` and `/company` are (same Worker or
Node server, same session cookie, one more entry in `MOUNTS`). Routes inside `/erp`:

```
/erp/                       -> Home (role dashboard)
/erp/my-work/               -> My Work (tabs as query: ?tab=approvals)
/erp/sales/...              /erp/finance/...           /erp/projects/...
/erp/products/...           /erp/engineering/...       /erp/procurement/...
/erp/inventory/...          /erp/manufacturing/...     /erp/quality/...
/erp/maintenance/...        /erp/supply-chain/...      /erp/reports/...
/erp/administration/...
```

A "Working" page inside ERP renders the existing screen inside the ERP shell (the same React routes, the same API),
with a link "Open in Finance" (or CRM, Project Management, CAD Automation) to its standalone address. The prototype
uses `#/...` addresses so it runs as static files.

## 5. Roles, sections and dashboards

Default section visibility per role (an administrator can change it; the server checks every record anyway).

| Role | Home layout | Sections shown by default |
| --- | --- | --- |
| CEO / Business owner | Company performance | All |
| Executive manager | Operations overview | All except Administration |
| Sales manager | Sales | Sales & Customers, Finance (quotes, invoices read), Projects, Reports |
| Finance manager | Finance | Finance, Sales (read), Procurement (read), Reports |
| Accountant | Accounting | Finance, Reports |
| Engineer | Engineering | Products & Engineering, Projects, Quality (read) |
| Procurement manager | Purchasing | Procurement, Inventory (read), Finance (bills read), Reports |
| Production manager | Production | Manufacturing, Inventory, Quality, Projects, Reports |
| Warehouse manager | Warehouse | Inventory & Warehouse, Procurement (receiving), Supply Chain |
| Quality manager | Quality | Quality, Manufacturing (read), Procurement (read) |
| Project manager | Projects | Projects & Tasks, Sales (read), Reports |
| Administrator | Administration | Administration, all sections for set-up |

Widgets per role layout (all from the widget catalogue in `04-role-dashboards.md`):

| Role | KPIs | Charts | Lists and alerts |
| --- | --- | --- | --- |
| CEO | Revenue this month, gross margin, cash, orders late | Revenue against target, order intake by month | Delayed orders, approvals waiting, top customers |
| Executive | On-time delivery, open orders, utilisation, open NCRs | Throughput by week | Delayed orders, escalations |
| Sales manager | Pipeline value, win rate, quotes awaiting answer, orders this month | Pipeline by stage | Quotes expiring, follow-ups due |
| Finance manager | Cash, receivables, payables, GST payable | Cash forecast | Overdue invoices, bills due, approvals |
| Accountant | Unreconciled lines, journals this month, period lock date | Receivables ageing | Statement lines to match, draft documents |
| Engineer | Open engineering changes, BOMs in review, drawings pending | Changes by status | My engineering tasks, CAD jobs |
| Procurement manager | Open POs, late deliveries, spend this month | Spend by supplier | Requisitions to approve, POs awaiting receipt |
| Production manager | Work orders in progress, late, yield, capacity load | Load by work centre | Delayed work orders, shortages |
| Warehouse manager | Receipts today, picks waiting, stock value, counts due | Movements by day | Goods received to put away, low stock |
| Quality manager | Inspections due, open NCRs, first-pass yield, CAPAs overdue | NCRs by cause | Inspections today, open NCRs |
| Project manager | Projects active, tasks overdue, budget used | Burn-down | Overdue tasks, milestones this week |
| Administrator | People, pending invitations, modules on, failed sign-ins | Active users by week | Invitations, access requests |

## 6. My Work item model

Every item shows: what it is (icon and type), title, source module badge, due date, status, who is waiting, and one
primary action (Complete, Approve, Review, Reply), with "Open in <module>" to its originating record.

| Type | Source today | Primary action |
| --- | --- | --- |
| Task | Project Management item assigned to me | Complete |
| Follow-up | CRM activity assigned to me | Complete |
| Approval | Finance submitted invoice, bill, claim, credit note; ERP (planned) requisition, ECO, NCR disposition | Approve or Return |
| Review | Document awaiting review (planned) | Review |
| Mention | Project Management or CRM comment mentioning me | Reply |
| Waiting for | An item I sent for approval or asked about | Remind |

Filters: All, My tasks, Approvals, Due today, Overdue, Waiting. Grouping: by due date (default), by module, by type.

## 7. Global search and quick create

- **Search** scopes: Everything, Customers, Contacts, Opportunities, Quotes, Invoices, Products, Purchase orders,
  Work orders, Projects, Tasks, Documents. Results grouped by type, each with its module badge; `Enter` opens the top
  result; recent searches remembered on the computer. Each source answers from its own API and its own permissions
  (CRM search, Finance list search, Project Management search; ERP adds its own).
- **Quick create**: Task, Customer, Opportunity, Quote, Invoice, Bill, Product, Purchase requisition, Work order,
  Inspection. Each opens the owning module's own form.

## 8. Scenarios the prototype demonstrates

| # | Scenario | Path in the prototype |
| --- | --- | --- |
| 1 | CEO finds delayed orders | Home (CEO) > "Delayed orders" widget > sales order SO-1048 |
| 2 | Sales manager reviews a customer's quotation | Search "Harbour" > customer > Quotes tab > QU-0107 |
| 3 | Accountant checks an invoice's payment status | Finance > Invoices > INV-2291 > Payments panel |
| 4 | Engineer reviews a BOM revision | Products & Engineering > Products > PRD-1001 > BOM tab > revision C |
| 5 | Procurement manager finds a pending PO | Procurement > Purchase orders > saved view "Awaiting approval" > PO-0388 |
| 6 | Warehouse operator reviews goods received | Inventory & Warehouse > Goods receipts > GR-0215 |
| 7 | Production manager finds a delayed work order | Home (Production) > "Delayed work orders" > WO-1042 |
| 8 | Quality manager reviews an inspection | Quality > Inspections > INS-0533 |
| 9 | Employee completes a task from My Work | My Work > Due today > Complete |
| 10 | Executive generates a performance report | Reports & Analytics > Company performance > filters > Export |
