# BIZOMAT ERP: Asset Management and Maintenance (Stage 1)

Owner's brief, 14 Nov 2026: "BIZOMAT ERP — Asset Management & Maintenance module, MEX-inspired". It asks for a
maintenance management system (CMMS) inside BIZOMAT ERP, in four stages (M1 to M4). MEX is a functional reference only:
no MEX branding, interface designs, source code or content are used.

Stage M1 is built and tested: the asset register, maintenance requests and work orders. Everything after it is planned
and labelled Planned on every page. The plan of the stages is in `docs/erp/architecture/15-erp-roadmap-2026.md`
(section 5 and the acceptance tests A to J in 5.1). The capability rows are in
`docs/erp/architecture/13-enterprise-capability-matrix.md` (3.10). The flows are in
`docs/erp/architecture/14-application-integration-map.md` (section 5).

## Where it runs

It is not a separate application. It is a module of BIZOMAT ERP, served by the Project Management app (`apps/work`),
and uses the same accounts, session, database, file store and Machine. There is no new app, Machine, database or volume.

| What | Where |
| --- | --- |
| The module | `https://bizomat.ai/erp/c/<company>/maintenance` (Overview, Assets, Requests, Work orders, Settings) |
| The rail | Maintenance opens the company used last (`/erp/maintenance`). "Report a fault", at the foot of the rail, opens the request form over any ERP screen, inside the CRM, Finance and Projects too |
| API | `/api/maintenance/...`, signed in (`apps/work/src/worker/maintenance/`) |
| Screens | `apps/work/src/client/system/maintenance/`, styles in `apps/work/src/client/styles/maintenance.css` |
| Tables | `apps/work/migrations/0018_maintenance.sql`, additive: twelve `mt_*` tables, no existing table changed |
| Tests | `apps/work/test/maintenance.test.ts` (workerd and Node) and `apps/work/test-node/maintenance.test.ts` (real HTTP on the Node runtime) |

## Companies and roles

- **Companies.** Every record belongs to a company: a registered company (`co_companies`) or a person's own company
  (`sys_companies`). Rows link to each other through `(company_id, id)` keys, so the database itself refuses a link
  between two companies.
- **Who can open it.** A company's members can open it, and so can the owner of an own company, who is its only person.
  People who only share a tool with a company (guests) cannot: they get 404, as does anyone outside the company.
- **Roles** (`mt_roles`, per company):

  | Role | What it may do |
  | --- | --- |
  | Administrator | Everything: assets and their import, requests, work orders, roles and settings |
  | Supervisor | Assets; approving requests; making, assigning, closing and reopening work orders |
  | Technician | The work orders assigned to them: timer, tasks, parts, notes, photos, completing |
  | Requester | Raises requests and follows their own; views the asset register |

  The company's owner is always an administrator. Its administrators start as maintenance administrators and its
  other members as requesters, until an administrator gives them another role. An action above a person's role
  answers 403.
- **What each person sees.** Supervisors and administrators see every request and work order. A technician sees the
  work orders assigned to them and the requests behind them. A requester sees their own requests, and the work order
  made from one, read-only.

## What Stage 1 does

- **Assets** (`mt_assets`):
  - a register with a hierarchy to any depth (a site, an area, a line, a machine, a part), with loops refused;
  - numbers unique per company, ignoring case;
  - make, model, serial number, registration, location, department, responsible person, criticality, operating status,
    maintenance strategy, purchase and warranty details, and specifications;
  - archive and restore (no deletion);
  - import from a CSV file, with a preview of each row as ready, a duplicate or an error before anything is saved;
  - the asset's page shows its path from the top, the assets under it, its outstanding work, open requests, files and
    history.
- **Requests** (`mt_requests`):
  - raised from Report a fault or Requests, with an asset if known, a priority, a department and photos;
  - the approval rule (`mt_settings`) is on by default; a supervisor approves, declines with a reason, or asks for
    more information, which the requester answers;
  - a request becomes one work order, or joins an open work order on the same asset, never two. This is enforced in
    one database transaction, so two people pressing the button at once cannot make two.
- **Work orders** (`mt_work_orders`, `mt_wo_tasks`, `mt_wo_parts`, `mt_labour`, `mt_comments`):
  - job type, priority, technician, due dates, estimate, instructions, safety requirements, tasks and required parts
    (as text lines: stock comes with Inventory, planned);
  - lists with filters and sort, including "include child assets";
  - a labour timer, one running timer per person and work order (a unique index), shown against the estimate;
  - Complete with notes. A completed, closed or cancelled work order is locked (409) until a supervisor reopens it with
    a reason;
  - on a phone the timer, Complete and Add a photo are large buttons, and lists become cards.
- **Files** (`mt_files`): photos and documents on assets, requests and work orders, in the existing file store with
  the same upload checks as every other file (`validateUpload`). A file is served only to people who can see what it
  belongs to.
- **History** (`mt_events`): every create, change and decision, with who made it and when.

## Not in Stage 1

- **Planned stages:**
  - M2: preventive maintenance by time, usage or condition, readings, inspections.
  - M3: prestart checks, spare parts and stocktakes, barcode and QR code labels, more than one site.
  - M4: the AI scheduling assistant (it only proposes; a person approves), downtime and reliability reporting (mean
    time between failures, mean time to repair), offline field work.
- **Small gaps:**
  - no notifications or emails yet;
  - no manual time entry or labour costs;
  - no asset deletion (archive only);
  - removing someone from a company leaves their maintenance role on record, but it gives no access.
- **Decisions to confirm with the owner:**
  - technicians see only the work orders assigned to them;
  - a supervisor making a work order from a request awaiting approval approves it;
  - cancelling a work order leaves its requests at "Work order made", for a supervisor to close;
  - a work order's status does not change the asset's operating status.

## Upgrade rehearsal (14 Nov 2026)

Before release, the upgrade from production (`origin/main`, which runs migrations 0001 to 0016) to this release was
rehearsed on a local copy, with invented data made through production's own API. It was never run against the
production volume.
- **The data:**
  - every tool: Projects with a file, CRM, Finance;
  - a registered company running the existing Projects workspace, with two members and two departments;
  - sessions made by production (cookies for `/tasks`, `/crm`, `/finance`, `/company` and `/system` only);
  - one account that already had its own company, and one disabled account.
- **Upgrade:**
  - The copy of the database was written to `pre-migration-backups/` first, then 0017 and 0018 applied.
  - No table was removed, and every existing table except two was byte for byte unchanged.
  - `d1_migrations` gained two rows.
  - `sys_companies` gained one own company for each active account that had none. The existing one was kept, and the
    disabled account got none.
  - The twelve `mt_*` tables were added, empty.
  - The integrity and foreign key checks were clean.
- **After the upgrade** (24 checks in a browser, all passed):
  - Production's sessions followed every old address into `/erp`, signed in, and gained the `/erp` cookie.
  - A file from before the upgrade downloaded unchanged.
  - The existing company, its departments and its members appeared in Maintenance with their default roles.
  - A member raised a request, which became a work order with a running timer.
  - Someone who only shares a tool with the company got 404.
- **Rollback:** production's build started on the upgraded database, maintenance records included. Its sessions,
  every tool's API, the earlier file and sign-in all worked. Upgrading again applied nothing and kept the
  maintenance records.
- **Deploy check:** `bizomat-deploy.yml` now also checks that the maintenance API refuses calls without a session. Today
  production answers 404 there; after this release, 401.
