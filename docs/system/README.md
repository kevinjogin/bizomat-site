# BIZOMAT ERP (live at bizomat.ai/erp; BIZOMAT System at /system before)

> **Update, 14 Nov 2026 (owner's "Systems consolidation and ERP-first" brief):** the workspace is **BIZOMAT ERP** at
> `https://bizomat.ai/erp` (`ERP_MOUNT` in `apps/work/src/worker/mount.ts`). Pages at `/system/...` answer 302 to the
> same page under `/erp/...`, and the tools open at `/erp/tasks`, `/erp/crm`, `/erp/finance` and `/erp/company`. The API
> under `/system` still answers, for tabs opened before. The cookie is written for `/erp` too; the session-carry
> marker there is `erp_carry`.
>
> - **Module rail:** Dashboard, My Work, Sales and CRM, Finance and Accounting, Projects and Tasks, Products and
>   Engineering, Maintenance, Operations, Reports, Administration; "Report a fault" at its foot raises a maintenance
>   request from any screen.
>   Products and Engineering opens `/erp/products` (the company used last).
> - **Maintenance** (Asset Management and Maintenance, Stage M1): the asset register, requests and work orders of
>   each company, at `/erp/c/<company>/maintenance` (`docs/maintenance/README.md`, migration `0018_maintenance.sql`).
>   Stages M2 and M3 (Release 4, part B; migration `0024_maintenance_m2_m3.sql`; live since 15 Nov 2026,
>   kevinjogin/bizomat-site#68) add the tabs Preventive, Checklists, Prestart, Scan and Reports:
>   preventive maintenance made into work orders by the 15-minute run, readings, inspections, prestart checks, parts
>   through ERP Inventory, labour costs, downtime, sites, QR labels and the reliability reports.
> - **ERP Release 1** (live since 14 Nov 2026; `docs/erp/release-1.md`, status by release in `docs/erp/STATUS.md`,
>   migration `0020_erp_engineering_procurement.sql`, API `/api/erp`):
>   - Products and Engineering at `/erp/c/<company>/products`: products and variants, multi-level bills of materials,
>     revisions, change requests and change orders, engineering documents, and the CAD Automation set-up as a tab;
>   - Procurement's supplier master at `/erp/c/<company>/procurement`, opened from Operations;
>   - ERP roles at `/erp/c/<company>/erp-roles` (Administration) and six reports at `/erp/c/<company>/erp-reports`
>     (Reports).
> - **ERP Release 2** (live since 15 Nov 2026, kevinjogin/bizomat-site#63; `docs/erp/release-2.md`,
>   migration `0021_erp_purchasing_inventory.sql`, the same API):
>   - Procurement at `/erp/c/<company>/procurement`: suppliers, requisitions, requests for quotation with the
>     comparison, purchase orders (approval limits, amendments, PDF), goods receipts and one draft bill in Finance per
>     receipt;
>   - Inventory at `/erp/c/<company>/inventory`: stock, warehouses and locations with QR labels, movements, adjustments,
>     counts, valuation, traceability and the warehouse screen for phones; both in the company's side menu and on the
>     Operations page;
>   - Purchasing and inventory settings at `/erp/c/<company>/erp-settings` (Administration) and ten more reports at
>     `/erp/c/<company>/erp-reports`;
>   - stock value is not posted to Finance's ledger: each posting is recorded as planned (Release 3).
> - **ERP Release 3** (live since 15 Nov 2026, kevinjogin/bizomat-site#65;
>   `docs/erp/release-3.md`, migration `0022_erp_manufacturing.sql`, the same API):
>   - Manufacturing at `/erp/c/<company>/manufacturing`, in the company's side menu and on the Operations page: orders
>     (materials, operations, time, output, inspections, finished-goods receipts, costs), the shop floor for phones,
>     planning (master production schedule, MRP, rough-cut capacity, planning data), work centres and machines, and
>     routings with revisions;
>   - production manager and production operator roles; manufacturing settings with the purchasing and inventory
>     settings (Administration, "Purchasing, inventory and manufacturing settings"); eight more reports at
>     `/erp/c/<company>/erp-reports`;
>   - stock and production value are not posted to Finance's ledger: each posting is recorded as planned, with the
>     note "Planned: Finance posting, not built yet"; the options are in `docs/erp/release-3.md`.
> - **ERP Release 4 part A, quality** (live since 15 Nov 2026, kevinjogin/bizomat-site#67;
>   `docs/erp/release-4-quality.md`, migration `0023_erp_quality.sql`, the same API):
>   - Quality at `/erp/c/<company>/quality`, in the company's side menu and on the Operations page: the overview (what
>     waits for inspection, open nonconformances, corrective actions due and overdue), inspections recorded on a phone
>     with the result worked out from the limits, quarantine and release, nonconformances with their disposition, and
>     corrective and preventive actions; inspection plans with versions;
>   - quality manager and quality inspector roles; seven more reports at `/erp/c/<company>/erp-reports`;
>   - goods receipts, manufacturing orders, traceability and the supplier page show their inspections and NCRs;
>   - nothing is written to Finance: scrap and returns under an NCR record their posting as planned, as every stock
>     movement does.
> - **ERP Release 5 part A, supply chain and logistics** (live since 15 Nov 2026, kevinjogin/bizomat-site#70; `docs/erp/release-5-supply-chain.md`, migration `0025_erp_supply_chain.sql`, the same API):
>   - Supply Chain at `/erp/c/<company>/supply-chain`, in the company's side menu and on the Operations page: the
>     overview, sales orders (for the company's CRM and Finance customer record, nothing copied), pick and dispatch for
>     phones, shipments, the delivery schedule, returns and carriers;
>   - stock allocated through StockOps, lines made to order through a linked manufacturing order with its job
>     profitability, confirmed orders as demand in MRP, dispatch once (`sales_dispatch`), delivery with proof, an
>     optional dispatch email, one draft invoice per shipment and one draft credit note per return through Finance's
>     own code;
>   - the sales manager role; seven more reports at `/erp/c/<company>/erp-reports`;
>   - the value of stock sold is not posted to Finance's ledger: each posting is recorded as planned.
> - **BIZOMAT WHS, Release 1** (live since 15 Nov 2026, kevinjogin/bizomat-site#74; `docs/whs/README.md`, migration
>   `0026_whs_core.sql`, API `/api/whs` and `/api/admin/whs`):
>   - Health and Safety in the rail (between Maintenance and Operations) at `/erp/c/<company>/whs`; `/erp/whs` opens the
>     company used last: report a hazard or an incident (first, large on a phone), hazards, incidents with
>     investigations and the regulator notification record, risk assessments with the register, actions,
>     jurisdictions and settings;
>   - a Health and Safety card on the dashboard, a Health and safety section in My Work, a Health and Safety group in
>     Reports, WHS roles with the ERP roles in Administration, and "WHS legal packs" in the platform console;
>   - every legal pack is Not verified until a platform administrator verifies it; BIZOMAT does not submit
>     notifications to regulators and never decides whether an incident is notifiable.
> - **New ERP pages:**
>   - My Work: the Projects and Tasks My Work of the workspace used last.
>   - Operations: what waits in the company (approvals, orders to receive, products to reorder, adjustments and counts,
>     production, inspections, shipments and returns), then the modules: Procurement, Inventory, Manufacturing, Quality
>     and, with Release 5 part A, Supply Chain live; Maintenance and Products and Engineering records partly live.
>   - Reports: every report of the company's tools, in its own module.
>   - Administration: company, tool teams and settings, your profile, and the ERP console for platform admins.
> - **Own companies for everyone:** migration `0017_system_everyone.sql` gives every existing active account its own
>   company. The maintenance run makes any that are still missing, up to 5,000 a day.
> - **The public website** describes the software as **Systems** at `/systems/` (`src/config/systems.ts`):
>   - one page and one user guide per system;
>   - Manufacturing and Operations is Available since Release 5 part A was deployed (every module works; what is not
>     built inside them is labelled Planned), with its own guide at `/systems/manufacturing/guide/`;
>   - BIZOMAT WHS at `/systems/whs/` with its guide `/systems/whs/guide/` (Available, some modules planned), on the
>     WHS branch, so the website says so only once that branch is deployed;
>   - the old product pages answer 301 there (`public/_redirects`).
>
> The sections below say "System" and `/system`; read them as "ERP" and `/erp`.


Owner's request, 14 Nov 2026:
- Bring the data of Project Management, the CRM, Finance and CAD Automation into the System, with a company for each
  existing user.
- When people share tools, the data stays in its own place, and each person reaches everything from one tool.
- In CAD Automation, only a company's administrators see the company's CAD computers, and never another company's.
- The founder is the super admin: every user and company in one place, with their activity.

Served at `https://bizomat.ai/system` by the Project Management app (`apps/work`), like the CRM, Finance and Company
accounts:
- It uses the same accounts, session, database and Machine as those tools. No new app, Machine, database or volume.
- Code: `apps/work/src/worker/system` (server) and `apps/work/src/client/system` (pages).
- Migration: `apps/work/migrations/0016_system.sql`. It is additive: two new tables, nothing else changed.

The design preview with demonstration data is retired (owner, 14 Nov 2026): it is no longer built or linked, and
`/system-preview/` answers 301 to `/systems/erp/`. The planned operations modules (inventory, procurement,
manufacturing and the rest) are not built.

## One system (owner, 14 Nov 2026)

Owner's request: "I want one system and everything should work within it without leaving this environment, for all
logged-in users and organisations."

- **Every tool opens inside the System:**

  | Tool | Address |
  | --- | --- |
  | Project Management | `/system/tasks/...` |
  | The CRM | `/system/crm/...` |
  | Finance | `/system/finance/...` |
  | Company accounts | `/system/company/...` |

  It is the same app and the same screens, under a longer path (`SUITE_MOUNTS` in `apps/work/src/worker/mount.ts`).
- **The module rail:** every screen inside the System has it at its left (a bar along the bottom on a phone):
  - Home, Project Management, CRM, Finance, CAD Automation, Company;
  - Super admin, for platform admins only.

  Each tool keeps its own navigation beside the rail (`apps/work/src/client/components/layout/SuiteRail.tsx`).
- **Links stay inside the System:**
  - Links between tools use `toolUrl` and `PLATFORM_URLS` (`apps/work/src/client/lib/base.ts`, `lib/brand.ts`).
  - The System's tool cards point to `/system/<tool>/...`.
- **The old addresses lead in.** A page at a tool's own address answers 302 to the same page inside the System (`suiteRedirect`):
  - `/crm/o/x` goes to `/system/crm/o/x`.
  - The website's Sign in (`/tasks/login` without a `next`) goes to `/system/login`.
  - The API (`/<tool>/api/...`), the files and a customer's online document (`/finance/view/...`) stay where they are.
  - Emails, bookmarks and the website keep working.
- **One session.**
  - Cookies are written for `/system` and the other paths, never for `/system/<tool>`.
  - A page without a cookie goes through `/tasks/api/app-carry` as before; its marker is `sys_carry`.
  - A sign-in provider returns to the tool's own address, the one registered with it (`appOf`).
- **CAD Automation's own application** (computers, connector, installer) is a separate app and opens at `/cad`. The
  System's CAD Automation page has the setup and the company's computers.
- **Tests:**
  - `apps/work/test/mount.test.ts` ("one system");
  - the page tests in `company`, `crm-records` and `fin-access`;
  - `test-node/server.test.ts`;
  - the smoke test and the deploy's public checks (`/system/<tool>/login` 200, a page at `/crm/login` 302).

## Example company (owner, 14 Nov 2026)

Owner's request: "add example site (Acme) to all users so they can learn and ensure its demo site only for accounts".

- **What:** every account gets its own company of invented data, "Acme Studio (example)". It has:
  - a Projects and Tasks workspace: two example projects, a dashboard, a brief and favourites;
  - a Sales and CRM organisation: three companies, contacts, deals, two leads and two activities;
  - a Finance business workspace: an opening balance, four transactions, a customer and a draft quote;
  - Maintenance: a seven-asset hierarchy, three requests and two work orders; with stages M2 and M3, a
    site, trades and a rate, a meter and a gauge with readings, schedules (one that made and completed its work order),
    an inspection with a failed item, a store with spare bolts issued, a breakdown with downtime and a prestart.
    Example companies made before them are not changed;
  - Products and Engineering and Procurement (ERP Release 1): a shelf bracket kit with a variant and a two-level bill of
    materials released through a change order (the one-person exception recorded), a change request, a draft change
    order, a CAD reference and two suppliers, one approved. Example companies made before Release 1 are not changed.
  - Purchasing and inventory (ERP Release 2): a warehouse with a location tree, two more approved suppliers, an
    approved requisition, a request for quotation with two quotations to compare, and a purchase order received into
    stock. Example companies made before Release 2 are not changed.
  - Manufacturing (ERP Release 3): three work centres with two machines linked to the Maintenance
    assets, released routings, a manufacturing order for ten weldments in progress (materials reserved, gusset plates
    issued, laser cutting done with its time, welding started), confirmed and forecast demand for kits, and an MRP run
    with open suggestions. Example companies made before Release 3 are not changed; removing and remaking one adds them.
  - Quality (ERP Release 4 part A): a released incoming inspection plan for the bracket arms, their
    failed incoming inspection, a nonconformance with containment and root cause, and a corrective action in progress.
    No stock moves. Example companies made before Release 4 are not changed; removing and remaking one adds them.
  - Supply chain (ERP Release 5 part A): a carrier, a confirmed sales order for Harbour Cafe with six kits from stock
    and ten weldments made to order (MO-00002), a shipment delivered with its draft invoice in Finance, and a damaged
    kit returned into quarantine with its draft credit note. No email is sent. Example companies made before Release 5
    are not changed; removing and remaking one adds them.

  Every name is invented, and every address is on example.com. No other accounts are made.
- **When:** the ERP asks for it on the person's first visit (`POST /api/system/demo`). It takes about 0.5 s on Node
  with the Release 1 records (0.3 s before), and the dashboard never waits for it.
  - Once removed, it is never made again automatically. Administration offers "Add the example company again"
    (`{ again: true }`).
  - Concurrent requests make one company.
  - A build that stopped is retried after five minutes.
- **How it is made:** through the app's own API (`src/worker/system/example.ts`). A personal API token exists for the
  build only and is deleted in a `finally` block. Every record therefore goes through the same checks, ledger,
  numbering, search and audit as a person's own.
- **Where it shows:**
  - Its tools are grouped under a company of kind `demo` (`sys_demo`, migration `0019_example_company.sql`, additive),
    never under the person's own company.
  - It is listed last, and the dashboard opens on a real company first.
  - Its pages carry an "Example company" banner.
  - Maintenance gives its owner the administrator role, with nobody else in it.
- **Private and quiet:**
  - Only its owner sees it: another account gets 404 for the company, its maintenance and its tools.
  - Invitations into its tools answer 409 (`EXAMPLE_COMPANY`), and its tools cannot join a registered company.
  - Its notifications stay in the app, with no email from Projects, CRM or Finance.
  - Its Finance documents are not emailed (409).
- **Remove:** `POST /api/system/demo/remove`, from Administration. It soft-deletes its workspace, CRM organisation and
  Finance workspace, as a person's delete does. It also erases its `mt_*` and `erp_*` records and their files.
- **Console:** the super admin console counts example companies apart ("Example companies"), and its tool totals
  exclude them.
- **Tests:** `apps/work/test/example-company.test.ts` (workerd) and `apps/work/test-node/example-company.test.ts` (Node,
  real HTTP).

## Companies

- **Registered companies.** These are the companies from Company accounts (`co_companies`). Each person keeps their
  company role there (owner, administrator, member).
- **Own company** (`sys_companies`): every person has one, in their own name. It is not registered and has no ABN.
  - It holds the tools the person owns that no registered company runs.
  - It is made the first time the person opens the System. The daily maintenance run makes the rest, 200 at a time.
    The founder can also run "Make the missing own companies now" in the console.
  - It records only an id, the owner, a name and dates. It never needs a phone number or address, so none is
    invented.
- **Tools are not copied or moved.** The System works out each tool's company every time it is asked:
  - A tool linked to a registered company (`co_tools`) belongs to that company.
  - Any other tool belongs to its owner's own company.
  - A new tool, a transferred tool or a tool newly linked to a company therefore always shows in the right place.
- **Shared with you.** A person added straight to a tool, without being a member of that tool's company, sees the
  company under "Shared with you" (role guest), with that tool only. They never see the company's other tools, its
  people or its CAD computers.
- **Permissions stay in each tool.** The System never gives access to anything:
  - It lists only the tools the person is a member of.
  - A tool's figures are shown only when the person's role in that tool may see them. These are the rules of the
    company overview: Project Management owner, administrator or project manager; CRM `deals.view` all; Finance
    reports view.
- A person who is in no company can't open another company's page: its address and its CAD page answer 404.

## CAD Automation in the System

- **Set up.** The CAD Automation page gives the four steps: sign in, install, pair the computer, add the connector.
  - Its links go to CAD Automation itself. The connector address is copied from CAD Automation's own CAD Assistant
    page, because CAD Automation decides it.
  - The connector, installer, add-in and Companion are unchanged.
- **Who sees which computers** (`cadFor` in `system.ts`):
  - In a registered company, the owner and administrators see the computers, AI apps and recent jobs of every person
    in the company.
  - A member sees only their own.
  - In an own company, the person sees their own.
  - A guest sees none.
  - Nobody sees another company's.
- **Where the status comes from.** CAD Automation reports each account's status to
  `POST https://bizomat.ai/company/api/id/cad-status`:
  - It authenticates with HTTP Basic, using the client `cad` and its secret: the same BIZOMAT client as "Sign in with
    BIZOMAT", so there is no new secret.
  - Only the client `cad` is accepted (403 for any other, 401 for a wrong secret).
  - The body has at most 500 accounts. Each has at most 20 computers, 20 jobs and 20 AI apps, with bounded text.
  - Each account's report replaces its earlier one (`sys_cad_status`).
  - A report is matched to a person by their BIZOMAT account id (`sub`, known once they used Sign in with BIZOMAT), or
    by email when both CAD Automation and BIZOMAT have confirmed that email.
- **Not live yet.** Until CAD Automation sends reports, the page says that it is not reporting yet and links to the
  computers page in CAD Automation. Live data needs four things:
  1. The owner makes the client secret.
  2. The secret is set on `cados` (`BIZOMAT_ID_CLIENT_SECRET`).
  3. Its SHA-256 goes into `WORK_BIZOMAT_ID_CLIENTS` on `bizomat` (`docs/company/README.md`).
  4. CAD Automation's reporter is merged and deployed in kevinjogin/bizomat-cad.

  The System shows "reporting" only when a client `cad` is configured.

## Super admin console (`/system/admin`)

The console is for platform admins only (`platform_admins`, founder or admin). For everyone else
`/api/admin/system/*` answers 404, as the other consoles do.
- **Overview:**
  - Accounts: total, active in 7 and 30 days, disabled, email not confirmed.
  - Registered companies (and how many are suspended) and own companies.
  - Workspaces, CRM organisations and Finance workspaces.
  - CAD Automation accounts reported.
  - Links to each tool's own console.
- **Users:** search by name or email. Each account shows:
  - its own company and its registered companies with the role in each;
  - its tool counts, CAD status, last activity and status;
  - an Activity button.
- **Companies:** registered and own companies together, with owner, people, tools and status.
- **Activity:** newest first, 100 at a time, filtered by tool and by account. It comes from each tool's audit log, the
  company audit and sign-ins. It is usage only: who did what kind of thing, where and when, never a record's contents.
- **Founder-only actions,** each audited:
  - disable an account, which also signs it out everywhere, and enable it again (never the founder's own account or
    another founder);
  - suspend or resume a registered company;
  - make the missing own companies.
- The founder is the account migration `0012_super_admin.sql` granted (the owner's confirmed address).

## Routing

- `/system` and `/system/...` (the tools under `/system/<tool>` included) go to the work app:
  - in the proxy (`infrastructure/proxy/routes.mjs`, `SYSTEM_PATHS`);
  - in the website Worker (`src/worker.ts`).
- `/system-preview/` stays with the website, which answers 301 to `/systems/erp/` (the preview is retired).
- The session cookie is written for `/system` too (`apps/work/src/worker/mount.ts`).
- Checks:
  - the smoke test: `/system/api/health`, `/system/login`, carrying the session and 401 for the API when signed out;
  - the deploy workflow: `/system/login` answers 200.

## Tests

- `apps/work/test/system.test.ts`:
  - own companies (on first use and by backfill);
  - tools grouped by company, with guests;
  - isolation between companies;
  - CAD scoping (owner and administrator, member, guest, outsider) and email matching;
  - the CAD status endpoint's authentication and limits;
  - the console: 404 for non-admins, founder-only actions, activity filters.
- `test/mount.test.ts` checks the cookie paths.
- `infrastructure/proxy/test/routes.test.mjs` and `tests/worker.test.ts` check the routing.
