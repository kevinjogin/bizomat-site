# BIZOMAT ERP: Asset Management and Maintenance (stages M1 to M3 and the field release)

Owner's brief, 14 Nov 2026: "BIZOMAT ERP — Asset Management & Maintenance module, MEX-inspired". It asks for a
maintenance management system (CMMS) inside BIZOMAT ERP, in four stages (M1 to M4). MEX is a functional reference only:
no MEX branding, interface designs, source code or content are used.

- **Stage M1** is live in production: the asset register, maintenance requests and work orders.
- **Stages M2 and M3** (ERP Release 4, part B, owner's ERP brief of 14 Nov 2026, section 8) are live in production since
  15 Nov 2026 (kevinjogin/bizomat-site#68, migration `0024_maintenance_m2_m3.sql`). They cover preventive maintenance,
  meters and readings, inspections, prestart checks, parts through ERP Inventory, trades and labour costs, downtime,
  sites, QR labels and scanning, and the reliability reports.
- **The field release** (21 Nov 2026, migration `0040_maintenance_field.sql`; the owner's "Maintenance additions using
  MEX", with MEX's field app guide as the functional reference) brings the field app's work order, request, stocktake and
  readings features into BIZOMAT: see "The field release" below. It ships on for everyone inside the Maintenance module
  switch (the owner chose "straight on for everyone" for the ERP redesign this completes); the one new flag,
  `maintenance_email_alerts` (email copies of alerts), ships off.
- **Planned** (labelled Planned on every page): the AI scheduling assistant, technician workload planning, offline field
  work, maintenance costs posted to Finance, and the rest of M4 (predictive maintenance, IoT feeds, fuel records).

The plan of the stages is in `docs/erp/architecture/15-erp-roadmap-2026.md` (section 5 and the acceptance tests A to J
in 5.1). The capability rows are in `docs/erp/architecture/13-enterprise-capability-matrix.md` (3.10). The flows are in
`docs/erp/architecture/14-application-integration-map.md` (section 5).

## Where it runs

It is not a separate application. It is a module of BIZOMAT ERP, served by the Project Management app (`apps/work`),
and uses the same accounts, session, database, file store and Machine. There is no new app, Machine, database or volume.

| What | Where |
| --- | --- |
| The module | `https://bizomat.ai/erp/c/<company>/maintenance` (Overview, Assets, Requests, Work orders, Settings) |
| The rail | Maintenance opens the company used last (`/erp/maintenance`). "Report a fault", at the foot of the rail, opens the request form over any ERP screen, inside the CRM, Finance and Projects too |
| API | `/api/maintenance/...`, signed in (`apps/work/src/worker/maintenance/`) |
| Screens | `apps/work/src/client/system/maintenance/`, styles in `apps/work/src/client/styles/maintenance.css`. M2 and M3 add the tabs Preventive, Checklists, Prestart, Scan and Reports, and the label sheet at `.../maintenance/labels` |
| Tables | `apps/work/migrations/0018_maintenance.sql` (M1): twelve `mt_*` tables. `0024_maintenance_m2_m3.sql` (M2 and M3): 21 more `mt_*` tables and their indexes. Both additive: no existing table, column or row is changed |
| Cron | `runMaintenance` in `apps/work/src/worker/index.ts` (every 15 minutes, on Workers and on Node) runs preventive maintenance generation for every company |
| Tests | M1: `apps/work/test/maintenance.test.ts` (workerd and Node) and `apps/work/test-node/maintenance.test.ts` (real HTTP). M2 and M3: `apps/work/test/maintenance-m2-m3.test.ts` (workerd and Node) and `apps/work/test-node/maintenance-m2-m3.test.ts` (real HTTP, the migration's additivity) |

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
  | Technician | The work orders assigned to them: timer, time entered by hand, tasks, parts issued and returned, inspections, downtime, readings, notes, photos, completing |
  | Requester | Raises requests and follows their own; views the asset register; enters readings and prestart checks |

  The company's owner is always an administrator. Its administrators start as maintenance administrators and its
  other members as requesters, until an administrator gives them another role. An action above a person's role
  answers 403.

  Stages M2 and M3 add, by role:
  - supervisors and administrators set up preventive maintenance, templates, meters, inspection templates, prestart
    checklists, sites, trades and labour rates, run "Generate due work orders now", and open the reports;
  - only administrators mark ERP warehouses as maintenance stores;
  - labour rates and costs are shown to supervisors and administrators only;
  - issuing parts needs no ERP role: Maintenance's own permission decides (the assigned technician for their own work
    orders, supervisors and administrators for any), and ERP Inventory's StockOps runs with an ERP access resolved for
    the same person and company (`loadErpAccess`). No ERP role is given.
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
    (as text lines; parts from the stores came with stage M3, below);
  - lists with filters and sort, including "include child assets";
  - a labour timer, one running timer per person and work order (a unique index), shown against the estimate;
  - Complete with notes. A completed, closed or cancelled work order is locked (409) until a supervisor reopens it with
    a reason;
  - on a phone the timer, Complete and Add a photo are large buttons, and lists become cards.
- **Files** (`mt_files`): photos and documents on assets, requests and work orders, in the existing file store with
  the same upload checks as every other file (`validateUpload`). A file is served only to people who can see what it
  belongs to.
- **History** (`mt_events`): every create, change and decision, with who made it and when.

## What stages M2 and M3 do

### Preventive maintenance (`pm.ts`, tab Preventive)

- **Schedules** per asset (`mt_pm_schedules`), or per class of assets through a **template** (`mt_pm_templates`): a
  template covers every asset of a category, in one site if chosen, and gives each its own schedule, including assets
  added later (applied on save, by "Apply to new assets now" and at each generation run). A meter or condition template
  names the meter each asset must have; assets without it are skipped and listed.
- **Triggers:**
  - time based: every N days, weeks or months, counted from the last completion or on fixed dates (a month keeps the
    first due date's day where the month has it: 31 Jan, 28 Feb, 31 Mar);
  - meter based: every N units of a meter's life total;
  - condition based: a reading below or above the schedule's limits (or the gauge's expected range).
- Each schedule carries the work order it makes: job type (preventive or inspection), priority, tasks, required parts,
  estimate, trade, technician, instructions, safety, an inspection template, and **lead days** (time based: made that
  many days before it is due; meter and condition based: due that many days after it is made). Active or paused.
- **Generation** (`generateDue`) runs from the cron every 15 minutes, from "Generate due work orders now"
  (supervisors), and straight after each reading for that meter's schedules. It is idempotent:
  - each due occurrence has a key, unique per schedule (`t:<due date>`, `m:<due meter total>`, `c:<reading id>`);
  - a schedule holds at most one outstanding occurrence (a unique partial index on `open_slot`);
  - both are written in the same transaction as the work order, so two runs at once (two crons, or the cron and the
    button) make one work order; the other transaction fails whole and counts as skipped;
  - a condition schedule counts only readings taken after its last work order was completed or cancelled;
  - a fixed-date schedule more than one occurrence behind starts from the latest due date that has come, and the
    history says how many earlier ones were passed over.
- **When the work order is completed**, the schedule moves on: completion basis from the completion date (or the meter's
  total then); fixed basis it already moved on when the work order was made. Cancelling it skips that occurrence (a
  completion-based schedule moves on from its due). Reopening it takes its place back (unless a newer one is open)
  without moving the schedule back. These statements are guarded on the completion, cancellation or reopening itself,
  in the same transaction as Stage 1's.
- **Calendar** (`/pm/forecast`): open preventive work orders, the next due date of each time-based schedule and the
  dates after it as if each is done on time, and meter-based schedules projected from the meter's average daily use over
  its last 90 days of readings. Condition-based schedules cannot be forecast and are listed apart.

### Meters and readings (`routes-meters.ts`, on the asset's page)

- A **meter** rises (hours, kilometres, cycles); a **gauge** takes any value (temperature, pressure). Each has a unit
  and an optional expected minimum and maximum; a meter may roll over at a value.
- Readings are entered by hand, from a work order, or in a prestart check. A rising meter refuses a lower reading
  (409) unless it is marked as a reset: usage then counts on from zero, or past the rollover value where the meter has
  one. Each reading records the usage it added and the meter's **life total**, which meter-based schedules use.
- Each reading takes the next sequence number of its meter (unique), so two readings at the same moment cannot both be
  next; readings must be entered in order of time. A reading outside the expected range is flagged.

### Inspections (`routes-inspections.ts`, tab Checklists and the work order)

- **Inspection templates** (`mt_insp_templates`, `mt_insp_items`): pass/fail, number (with limits) and text items, each
  required or not, and critical or not. Items left out of an edit are archived; recorded results keep their own copy.
  The template says what a failed inspection makes: one corrective work order, one request, or nothing.
- A template is attached to a work order by hand, or by the schedule that made it. The technician records each item;
  completing the inspection needs every required item, locks the results, and makes the **follow-up once**: a once-only
  key (`mt_done`) in the same transaction, so two completions at the same moment make one follow-up (the other gets 409).

### Prestart checks (tab Prestart, a phone screen)

- A supervisor sets an asset's prestart checklist. Anyone with access to the company opens Prestart (or scans the
  asset's label), answers with large Pass and Fail buttons, and may enter a meter reading.
- Any failed item raises **one request** (urgent when an item is critical). A failed **critical** item also sets the asset
  **out of service**. This is the one place Maintenance changes an asset's status by itself: it is explicit on the
  screen, recorded on the prestart with the status before, and in the asset's history (`asset.out_of_service`, with
  before and after). A supervisor puts the asset back in service by editing it. A work order's status still never
  changes the asset's status (the owner's decision below is kept).
- A check sent twice with the same key (a double tap) is recorded once.

### Parts through ERP Inventory (`routes-parts.ts`, the work order's Parts used)

- No second stock system: parts are ERP products, and a **maintenance store** is an ERP warehouse an administrator marks
  as one (`mt_stores`). Stock, receiving, moves and **stocktakes** stay in Inventory; the Settings tab lists each store's
  recent counts and links to them.
- Parts are **issued** to a work order and **returned** from it through `StockOps`, in one transaction with the movement
  in the ledger: new movement types `maintenance_issue` and `maintenance_return`, source type `work_order` (StockOps's
  lists are open; the ledger's columns are checked by length only). Stock never goes below zero, so two people issuing
  the last unit at the same moment cannot both succeed. `mt_wo_stock` keeps the net quantity per product, with a CHECK
  that refuses returning more than was issued, also when two returns arrive together. A return is valued at the
  average cost the work order took the part at.
- The work order shows each movement and the **parts cost** (the ledger's value, issued less returned). Its Finance
  posting is recorded as planned (`finance.maintenance_posting`, status planned), as in Releases 2 and 3: nothing is
  posted to Finance.
- Stage 1's free-text required-parts lines still work beside it.

### Trades, technicians and labour

- Trades (`mt_trades`) with an hourly rate, people linked to trades, and a rate per person (`mt_technicians`).
- Labour: Stage 1's timer, plus **time entered by hand** (a date, minutes and a note; supervisors may enter it for a
  technician). Each line is **priced once, when it is recorded** (`mt_labour_costs`): the person's own rate, else the rate
  of the work order's trade, else the highest rate of the person's trades, else no rate (counted as "without a rate").
  Cost = minutes x hourly rate / 60, rounded to whole cents. A later change of rate never changes past costs. Labour
  recorded before this stage has no cost line.

### Downtime, sites, QR labels

- **Downtime** (`mt_downtime`): when the asset stopped and started again, on its work order.
- **Sites** (`mt_sites`): per company. Assets are placed in a site through the side table `mt_asset_sites` (chosen over a
  nullable column on `mt_assets`: no change to a live table, and one more join is cheap); a new asset under a parent
  takes the parent's site, and a site can be set for an asset and every asset under it. Lists, the calendar and the
  reports filter by site.
- **QR labels**: an SVG per asset made on the server (`qr.ts`, as Inventory's), holding `ASSET:<number>`, and a printable
  label sheet. **Scan** takes that code, an asset number, a serial or a registration number, and offers the asset, its
  prestart check and a fault report. The camera is used where the browser can read codes; typing always works.

### Reports (`reports.ts`, tab Reports, supervisors and administrators)

Each takes a period (from and to, inclusive UTC days; 90 days to today by default) and a site, lists the assets and
work orders behind its figures (drill-down), and downloads as CSV (`?format=csv`).

- **Reliability.** A *failure* is a breakdown, emergency repair or corrective work order (not cancelled) whose downtime
  started in the period and has ended. Per asset:
  - downtime (h) = sum of (downtime end - downtime start);
  - MTTR (h) = downtime / failures;
  - MTBF (h) = (hours in the period - downtime) / failures;
  - availability (%) = (hours in the period - downtime) / hours in the period x 100.
  Example (tested): ten days (240 h), two failures of 2 h and 4 h: MTTR 3 h, MTBF 117 h, availability 97.5%. Assets down
  now (downtime not ended) are listed apart.
- **Backlog.** Open work now (open, assigned, in progress, on hold) by priority and by age since it was made: 0-7, 8-30,
  31-90 and over 90 days, with the estimated hours. The period does not apply.
- **PM compliance.** Preventive occurrences due in the period up to today. On time = completed (or closed) on or before
  the due date (the UTC date of completion); late = completed after it; missed = still open past its due date;
  skipped = its work order was cancelled. Compliance (%) = on time / due x 100. Example (tested): one on time, one late,
  one missed, one skipped: 25%.
- **Breakdown trends.** Per month: breakdown and emergency repair work orders made, corrective work orders made, and
  failures with their downtime.
- **Asset costs.** Per asset: labour cost (by the date of the work), labour minutes without a rate, parts cost (by the
  date of the movement) and the total. Not posted to Finance.

### Example company

Every new example company also gets: a site holding every asset; two trades and the owner's labour rate; a meter (laser
hours) with readings and a gauge (coolant temperature); an inspection template and a prestart checklist; a monthly
service schedule that made its work order, which was inspected (a failed item raised a request), had labour recorded and
was completed, so its next due date moved on; a meter-based and a condition-based schedule; a template for the class of
machines; the workshop store marked as a maintenance store, with spare bolts received and issued to the chiller work
order (all of them, so the earlier releases' stock and product figures are unchanged); a breakdown with its downtime;
and a passed prestart. Stage 1's figures stay seven assets and two open work orders. **Existing example companies are not
changed**: their owners can remove and remake them in Administration.

## The field release (21 Nov 2026)

Design records: `docs/maintenance/design/` (the gap analysis of MEX's field app against Maintenance, with its two checks,
and the four work streams' designs). Tests: `apps/work/test/maintenance-A.test.ts` to `maintenance-D.test.ts`.

### Lists, the asset and requests (`lists.ts`, `asset-summary.ts`, `routes-requests.ts`)

- **Work order list:** filters by date raised, due start, due finish and completed (the person's local day), department,
  raised by, contractor, trade, job type, status, priority, asset with the assets under it, and site; quick lists My work,
  Outstanding, Due today, Due this week (today to Sunday), Overdue, Unassigned (managers) and All; sorts including due
  start; paging; CSV of the filtered list (up to 5,000 rows, formula cells made safe).
- **Request list:** Needing approval (managers), Outstanding, My requests and All, with asset (and the assets under it),
  requester, department, site, status and priority filters; each row shows the other open requests and work orders on its
  asset; CSV.
- **The asset on a job:** the work order and the request show the asset's identity, path and site, and the other open work
  on it. Counts and lists cover only what the person may see (managers see all), and an inspection round's open line counts
  as open work on its asset.
- **Duplicate warning:** the request form and Report a fault list the asset's other open work before sending. It never
  blocks sending.
- **Withdrawal:** the person who raised a request may withdraw it with a reason until it becomes or joins a work order
  (approved included). It is closed (the status list of 0018 is unchanged) with `withdrawn_at` and the reason, and shows
  as Withdrawn. Whoever was deciding it is alerted when it was waiting for a decision.
- **Dashboard:** "Requests to approve" now counts only requests awaiting approval, and shows only to supervisors and
  administrators; the Maintenance card on the ERP dashboard shows figures by role.

### Parts, reservations, requisitions and stocktakes (`routes-parts.ts`, `routes-stock.ts`)

- **Required parts** may name an ERP product (one line per product on a work order) or stay free text. Each line shows what
  is free in the maintenance stores and its status: in the stores, short, reserved, on a requisition, issued, not stocked or
  a service. Preventive maintenance templates and schedules carry products too.
- **Reservations** are ERP Inventory's own (`erp_reservations`, made and released through StockOps); `mt_wo_reservations`
  only links them to the work order and the part line. The assigned technician, supervisors and administrators reserve and
  release; issuing takes the work order's reservation first. Completing or cancelling the work order releases what is
  still reserved, in the same transaction, never through an ERP role. Inventory's own reservation screen refuses to release
  or issue a maintenance reservation. Reserving and releasing write no Finance record.
- **Requisitions** for what is short are Procurement's own (`createRequisition`), raised from the work order by someone
  who holds the ERP right `requisitions.raise`; `mt_wo_requisitions` links them. Procurement approves and orders them.
- **Stocktakes** are ERP Inventory counts of the maintenance stores, listed in Maintenance with a due date
  (`erp_counts.due_date`). Starting, submitting and cancelling one need the ERP right `inventory.operate` (owners and
  administrators are ERP administrators); technicians and above enter counted quantities without an ERP role. Only a
  warehouse manager who did not submit it approves it in Inventory, which posts the differences. The Stocktakes menu item
  hides when the company's Warehouse: stock module is off.

### Inspection rounds, readings and labels (`routes-rounds.ts`, `round-guard.ts`, `routes-meters.ts`, `routes-setup.ts`)

- **Inspection rounds** are one work order (job type inspection) over many assets (up to 300), each with its own checklist
  (`mt_rounds`, `mt_round_assets`, `mt_round_results`). The work order keeps its timer, labour and photos, and cannot be
  completed while an asset is open. Lists: Incomplete, Exceptions (a failed item), Awaiting approval and Not approved, with
  an asset search. A failed asset makes its follow-up once per attempt. A supervisor or administrator who did not complete
  an asset approves it or marks it not approved with a reason (which opens it again). When no other active supervisor or
  administrator is in the company, the one there may decide their own, and the history records the exception (this
  differs from the ERP's own one-person rule; see the decisions below). Approval never blocks completing the round.
- **Readings page:** every meter the person may update, with its last reading, filters (site, search, not read for N days)
  and one entry per row; several readings are saved at once with a result per row, each exactly as a single reading
  (preventive maintenance by meter included).
- **Labels** hold the asset's address in BIZOMAT ERP (`/erp/c/<company>/maintenance/scan?code=<number>`), so a phone's own
  camera opens it after sign-in; older labels holding `ASSET:<number>` still work with Scan an asset.

### The job (`routes-job.ts`, `signoff.ts`, `alerts.ts`)

- **Job card:** a printable page of the work order (outside the ERP's frame, opened in a new tab): asset and path,
  instructions and safety, tasks with tick boxes, required parts, inspections and round assets with blank answer boxes or
  the recorded answers, labour, downtime, notes, photos inline (other files by name) and the sign-off. It never shows costs
  or rates. There is no server PDF: the browser's print saves one.
- **Sign-off:** completing may carry a typed name, an optional role and a signature drawn on screen (a PNG checked for size
  and format, stored as a file of the work order), or, for someone who cannot draw on the screen (a keyboard or a screen
  reader, for example), the typed name alone, recorded as a typed sign-off. Required only when a maintenance administrator
  switches on "Completion needs a signature" (a typed sign-off counts). An earlier picture stays on record after a reopen
  but never shows as a photo. It records who signed on screen; it is not a verified electronic signature.
- **Work recorded after it was done:** supervisors and administrators (and technicians, when "Technicians can record work
  already done" is on) make and complete a work order in one step with the date done, time, downtime and notes. It counts
  in the reports like any completed work order. No parts are issued in that step.
- **Alerts** go to the ERP's alerts (`erp_alerts`): a request waiting for approval (supervisors and administrators), a
  request decided, asked about, made into or attached to a work order, or withdrawn, work given to a technician (rounds
  included), and requests completed. The Alerts button shows them only where the person has Maintenance in that company.
  Email copies are sent only when `maintenance_email_alerts` is on (it ships off) and never for the example company; no
  email carries an approve or decline action.

### Example company

New example companies also get: the chiller work order's bolts as a required part (then issued), a duplicate request
withdrawn by the person who raised it, a belt change recorded after it was done, and a completed inspection round over
three assets (one failed label with no follow-up, one approved, one awaiting approval). The figures of the earlier
releases are unchanged (seven assets, two open work orders). Existing example companies are not changed.

## Not built yet

- **Planned:** the AI scheduling assistant (it would only propose; a person would approve), technician workload
  planning, offline field work, maintenance costs posted to Finance, predictive maintenance, IoT feeds, fuel records,
  photo and signature answers in checklist items, inspection rounds made by preventive maintenance, trend charts of
  readings, repeat-failure and department breakdowns in the reports, a server-made PDF of the job card, and alerts for
  comments, overdue work orders, follow-ups and preventive work orders.
- **Built but switched off:** email copies of maintenance alerts (`maintenance_email_alerts`).
- **Small gaps:**
  - no asset deletion (archive only);
  - removing someone from a company leaves their maintenance role on record, but it gives no access;
  - downtime, parts and inspections are recorded only while a work order is open (reopen it to correct them);
  - labour recorded by the Stage 1 timer before this stage has no cost line.

## Decisions to confirm with the owner

Stage 1's four decisions, all kept as they are:
- technicians see only the work orders assigned to them;
- a supervisor making a work order from a request awaiting approval approves it;
- cancelling a work order leaves its requests at "Work order made", for a supervisor to close;
- a work order's status does not change the asset's operating status.

Stages M2 and M3:
- a failed critical prestart item sets the asset out of service automatically (and raises an urgent request); say if
  it should instead ask a supervisor first;
- anyone with access to the company (requesters included) may record prestart checks and readings;
- a schedule holds one outstanding work order at a time: on fixed dates, a due date that comes while the last one is
  still open waits for it (then counts as late), and dates more than one interval behind are passed over, recorded;
- labour rates resolve person, then the work order's trade, then the highest of the person's trades;
- parts are issued only from warehouses marked as maintenance stores, and only while the work order is open;
- maintenance costs (labour and parts) are recorded and reported but not posted to Finance; which accounts, if any;
- existing example companies are not changed; remaking one shows the M2 and M3 records.

The field release:
- it ships on for everyone inside the Maintenance module switch (the owner's "straight on for everyone"); only email copies
  of alerts sit behind a flag, off;
- an inspection round's review: the one supervisor or administrator in a company may decide their own asset, recorded,
  while the ERP's rule allows that only to the only person in the company; say which rule should hold;
- M3's issue and return routes do not check the Warehouse: stock switch (reserving and stocktakes do);
- Settings does not refuse to unmark a maintenance store that holds open work order reservations;
- Inventory does not refuse to release manufacturing order reservations (as before this release);
- counts and duplicate warnings cover only what each person may see (managers see all).

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
