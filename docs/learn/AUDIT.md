# Knowledge Centre audit (20 Nov 2026)

The owner's brief of 20 Nov 2026 ("BIZOMAT ERP: complete Knowledge Centre, tutorial consolidation and homepage
redesign") asked for an audit of the ecosystem before anything was built. This is that inventory: what existed, what
was duplicated or out of date, what is built and what is not, and what changed. The Knowledge Centre itself is
described in `docs/learn/README.md`; its coverage is tracked in `docs/learn/COVERAGE.md` (generated).

## 1. Where help lived before

| Place | What it was | Finding |
| --- | --- | --- |
| `/systems/erp/guide/` | ERP user guide, 402 lines of Astro, 5 sections | One long page, no search, no questions as accordions, no per-module tutorials. |
| `/systems/crm/guide/` | CRM user guide, 334 lines, 4 sections | Same shape as Finance and Projects; a few product screens. |
| `/systems/finance/guide/` | Finance user guide, 357 lines, 4 sections | Same. |
| `/systems/projects/guide/` | Projects user guide, 309 lines, 4 sections | Same. |
| `/systems/engineering/guide/` | CAD Automation user guide, 282 lines, 4 sections | Set-up steps repeated on the system page and in CAD's own `/cad/docs`. |
| `/systems/manufacturing/guide/` | One guide for Procurement, Inventory, Manufacturing, Quality, Maintenance and Supply Chain, 256 lines | Six modules in one page: no module had its own guide, buttons or questions. |
| `/systems/whs/guide/` | Health and Safety guide, 224 lines | Accurate on what is not verified and not built; no tutorials. |
| `/systems/*/` (7 pages) | Each system page ends with 8 to 10 questions | The same questions partly repeated in the guides; nowhere to search them together. |
| `/systems/` | The catalogue, with a "User guide" link per system | Kept; the links now go to the Knowledge Centre. |
| ERP app, Projects and Tasks | "Help and keyboard shortcuts" dialog | Shortcuts and one paragraph about boards; no link to any guide. |
| ERP app, CRM and Finance side menus | "CRM user guide", "Finance user guide" links | Linked to the old guide pages. |
| ERP app, the ERP's own side menu | No help link | Nothing in BIZOMAT ERP led to any guide. |
| CAD Automation `/cad/docs` | Set-up, connection, self test, troubleshooting, security | Kept in CAD Automation (kevinjogin/bizomat-cad); the Knowledge Centre links to it, never copies it. |
| AI Search (`/#ai-search`) | Discovery over products, docs, tools and the Library | Kept; the Knowledge Centre and its workflows are now in its catalogue. |
| `/search/` | Pagefind over every page | Kept; the Knowledge Centre's pages are indexed like the rest. |
| `/chat` | Pop-out of the BIZOMAT Assistant | The floating assistant is retired (`SITE.assistant.enabled` is false); unchanged. |
| `/resources/`, `/tools/`, `/reados/`, `/library/` | Free tools, the Library and guides, no sign-in | Not ERP help: kept apart and unchanged, as the brief asked. |

## 2. Duplication and inconsistency found

- Seven guides in four different shapes; the same set-up and permission questions answered in up to three places.
- No guide named the module rail's own labels consistently (for example "Health and Safety" in the rail, "BIZOMAT WHS"
  on the website). The Knowledge Centre uses the rail's label as each guide's title and gives the system name as a
  search word.
- Procurement, Inventory, Manufacturing, Quality, Supply Chain and Maintenance shared one guide; Products and
  Engineering had none of its own.
- No troubleshooting anywhere: sign-in, access, missing modules, records and connections were not covered.
- No administrator guide: members, roles, departments, security, tokens and data were spread over the system pages.

Differences between the documentation and the code, found while writing the guides (the guides follow the code):

- `src/data/erp-capabilities.ts` lists "Product classification" and "Product costing" as planned; the code records
  category, subcategory, family and lifecycle and rolls up material cost. `docs/erp/STATUS.md` already lists this as a
  decision for the owner. The guide describes what the screens do and lists only labour and machine cost from routings
  in the cost roll-up as planned.
- The ERP roles screen's subtitle still says roles cover "Products and Engineering, Procurement and Inventory"; the code
  also has manufacturing, quality and sales roles. The guide does not quote that subtitle.
- Requisitions can be raised by engineers, engineering approvers, buyers, procurement managers, warehouse and
  production staff and ERP administrators, not by quality or sales managers; the old manufacturing guide did not say so.
- The capability registry (`src/data/erp-capabilities.ts`, shown on the ERP's system page) had stale entries, corrected
  in this change: company roles listed as owner, administrator and member (the code has owner, admin, manager, employee
  and read only); segregation of duties and approval limits called planned (both enforced in the ERP modules today:
  `apps/work/src/worker/erp/access.ts` and purchase orders' approval limit); scoped API tokens called planned (tokens
  are limited to one company, optionally some applications or reading only, and expire); the access review called
  planned (built in the Company Admin console, behind its flag: now In development); Sign in with BIZOMAT for CAD
  Automation called in development (live: Continue with BIZOMAT).
- The retired ERP guide still described company roles as "Owner, administrator or member" and said CAD computers were
  not reported yet; both out of date.
- Some actions exist only in the API (recording time for another person, scrapping materials against an order, the
  whole-company ERP history): the guides describe only what the screens offer.
- A draft sales order from a won deal: the server route exists (`POST /c/:company/sales-orders/from-deal`,
  `apps/work/src/worker/erp/sales.ts`) and the capability registry calls it connected, but no screen calls it. The
  guides tell people to create the order in Supply Chain.
- Invoice approval: older guide text said only approvers post invoices. By default invoices need no approval
  (`approvals.invoices: false`, `shared/fin/settings.ts`) unless a workspace turns it on; transactions, bills and expense
  claims need approval by default in business workspaces. The guides follow the code.
- The CRM's Member role: `docs/crm/README.md` and the catalogue say a Member "never deletes records"; Members can delete
  their own activities (`shared/crm/roles.ts`). The guides say Members never delete leads, contacts, companies or deals.
- Projects: the role help says project managers create projects; the server lets Members create shared boards, and a
  deal's "Start a project" needs Member or above. The guides say Member or above.
- Maintenance: the Operations page's Asset Management and Maintenance card has no badge set, so it shows "Partly live"
  and the page subtitle says "partly live"; `docs/maintenance/README.md` and the capability registry say stages M1 to M3
  are live. The guide says live.
- Health and Safety: the old guide said "tick Confidential" (the app's label is "Keep this report confidential") and to
  choose To corrective action every time (approving the investigation moves the incident there by itself; the button is
  for incidents that were not investigated). The guide follows the app.
- Invoicing a deal's accepted quote in Finance does not mark the deal invoiced, so "Make a draft invoice" stays offered:
  nothing stops both routes. The deal-to-invoice workflow tells people to use one.

## 3. What BIZOMAT ERP has, and what it does not

Built and documented as working (the module rail, `apps/work/src/client/components/layout/SuiteRail.tsx`): Dashboard,
My Work, Sales and CRM, Finance and Accounting, Projects and Tasks, Products and Engineering (with CAD Automation),
Operations (Procurement, Inventory, Manufacturing, Quality, Supply Chain), Maintenance, Health and Safety, Reports,
Administration, Company Admin (behind its flag) and "Report a fault".

Behind a flag that ships off (documented as In development, never as working): CAD Automation inside the ERP and its
connections to products, bills of materials, manufacturing, quality and projects; Company Admin console; the new
Members page; moving records between companies; registry verification; the new UI.

Not built (named Planned, or not mentioned as a feature): human resources and payroll, a service desk, billing from
timesheets, carrier bookings and landed costs, forecasting, posting stock, production and maintenance value to
Finance's ledger, WHS inspections, permits, contractors, training, chemicals, PPE, emergency management, consultation,
health surveillance and the compliance register, and Maintenance's AI scheduling assistant and offline field work.
There is no "MSP" product; CAD Automation's AI connection uses MCP (the Model Context Protocol).

## 4. What changed

- One Knowledge Centre at `https://bizomat.ai/learn/` (public and indexable, like the rest of the website), with a guide
  per module and topic (structure A to J), step-by-step tutorials, the important buttons, questions as accordions,
  workflows across modules, diagrams drawn in SVG, and its own search over every guide, tutorial, question and button.
- `https://bizomat.ai/erp/learn` (and `/erp/help`) answers 301 there from the router, so the ERP's own address works.
- The seven old guide pages are gone; each old address answers 301 to its guide (`public/_redirects`), and so do the
  older `/crm-platform/guide/` and `/finance-platform/guide/`.
- The navigation gained **Learn** (Home, Systems, Learn, Resources, About, Contact) and the footer a Knowledge Centre
  link; the systems pages say "Guides and tutorials" and link their guide.
- BIZOMAT ERP links the Knowledge Centre from its side menu (Help), every tool's platform footer, the CRM and Finance
  menus and the Projects help dialog.
- The homepage leads with BIZOMAT ERP and learning it: Open BIZOMAT ERP, Explore modules, Learn BIZOMAT, Tools and
  Resources; the Knowledge Centre's search and where to start, by who you are; the module rail's groups, each linked to
  its guide. AI Search, the proof, Tools and the Library stay.
- AI Search's catalogue and `/llms.txt` name the Knowledge Centre and its module guides.
