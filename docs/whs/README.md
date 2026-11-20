# BIZOMAT WHS: Work Health & Safety Management System (Release 1, the core)

Owner's WHS brief (15 Nov 2026). BIZOMAT WHS is the **Health and Safety** module of BIZOMAT ERP, in the existing
Project Management app (`apps/work`): the same accounts, session, companies, database and Machine. No new server,
Machine, database, login or dependency.

**Status: live since 15 Nov 2026** (kevinjogin/bizomat-site#74, deploy run 37, version e0cad51, migration 0026). The public page says "Available, some modules planned" (`src/config/systems.ts`, status
`partial`), so the website should go out with the application.

## What BIZOMAT WHS does not do

- It does not submit notifications to regulators. A person notifies the regulator and records the submission.
- It never decides whether an incident is notifiable. A WHS manager decides, with reasons.
- Its legal packs are **Not verified**. A rule that is not verified never flags an incident or computes a deadline;
  the screen says "Deadline not verified: check with the regulator."
- It is not legal advice, and no independent body has assessed it. No text may call it compliant or certified, or call
  its content legally verified (`tests/whs-claims.test.ts` fails on such words in the WHS pages, catalogue entries and
  the application's WHS screens).

## Where it is

| What | Where |
| --- | --- |
| Rail entry | "Health and Safety" (icon shield), between Maintenance and Operations (`SuiteRail.tsx`) |
| Module | `/erp/c/<company>/whs`; `/erp/whs` opens the company used last |
| Tabs | Overview (dashboard), Hazards, Incidents, Risk assessments (with the risk register), Actions, Jurisdictions, Settings |
| Reporting | `/erp/c/<company>/whs/report/hazard` and `/report/incident`: the first two buttons, large on a phone |
| ERP dashboard | A Health and Safety card with real counts |
| My Work | "Health and safety" section, by company: actions and hazards I am responsible for, investigations I lead or am on, notifications I am responsible for, risk assessments waiting for my approval, unread alerts |
| Reports | A Health and Safety group: WHS dashboard, hazard register, incident register, risk register and heat map, actions register (CSV) |
| Administration | WHS roles with the other ERP roles, and Health and Safety settings |
| Platform console | `/erp/admin`, tab "WHS legal packs" (platform admins only) |
| API | `/api/whs` (company routes under `/c/:company`), `/api/admin/whs` (legal packs) |
| Server | `apps/work/src/worker/whs/` (access, util, seed, legal, hazards, risk, incidents, actions, dashboard, index) |
| Screens | `apps/work/src/client/system/whs/`, styles `apps/work/src/client/styles/whs.css` (tokens only) |
| Migration | `apps/work/migrations/0026_whs_core.sql` (additive: CREATE TABLE, CREATE INDEX and triggers on its own tables) |
| Public pages | `/systems/whs/` and its guide in the Knowledge Centre, `/learn/whs/` (since 20 Nov 2026; `/systems/whs/guide/` answers 301 there) |

## Roles and access

Every person in a company (registered, own or example) reports hazards and incidents and sees their own reports.
People who only share a tool with the company do not. Records of another company answer 404. Every check is on the
server (`whs/access.ts`).

| Role (`erp_role_grants`) | May |
| --- | --- |
| WHS manager (`whs_manager`) | Everything below except medical details: approve, decide notifications, settings, policies, matrix, hours; reads confidential reports |
| WHS officer or supervisor (`whs_officer`) | View registers, assess hazards, classify incidents, draft risk assessments, investigate, raise, verify and close actions |
| Incident investigator (`whs_investigator`) | View, and investigate incidents |
| Health and safety representative (`whs_hsr`) | View registers and add consultation comments |
| Health officer (`health_officer`) | View; the only role that reads and writes medical treatment details (`whs_health`); reads confidential reports |
| Executive (`executive`) | View registers |
| ERP administrator (`erp_admin`) | What a WHS manager may, except medical details; reads confidential reports only while nobody holds WHS manager or health officer |

- **Medical details:** only health officers. A WHS manager does not read them, unless also given Health officer. In a
  company of one person (own and example companies) that person holds every capability, as elsewhere in the ERP. The
  company's owner and administrators cannot be given Health officer at all (ERP roles go to members only), so medical
  access is always a grant to a named member, recorded in the ERP's history.
- **Confidential reports:** psychosocial, violence and fatigue hazards and psychosocial incidents can be marked
  confidential. They are read by the reporter, WHS managers and health officers (and ERP administrators while no one
  holds either role); the form says who before it is sent.
- **Segregation of duties:** a risk assessment is approved, an investigation approved, and an action verified by
  someone other than the drafter, lead or submitter, or completer; the one-person exception is recorded, as in the
  ERP. Platform legal rules follow the same rule (a lone platform admin is the recorded exception).

## Data (migrations 0026 and 0028)

32 tables, all prefixed `whs_`. Company tables carry `company_id` and use composite `(company_id, id)` keys.

- **Platform:** `whs_packs`, `whs_instruments`, `whs_rules` (versioned; one open draft per rule key; a verified rule
  needs `verified_at` and `effective_from`), `whs_legal_events` (append-only), `whs_meta` (seed version).
- **Company settings:** `whs_counters` (HZ-, RA-, INC-, INV-, ACT-, POL- numbers), `whs_matrices` (versions),
  `whs_settings`, `whs_site_packs` (sites from `mt_sites` to packs), `whs_hours`, `whs_policies`.
- **Records:** `whs_hazards`; `whs_risk_assessments`, `whs_ra_steps`, `whs_ra_hazards`, `whs_ra_controls`;
  `whs_incidents`, `whs_incident_revisions`, `whs_health`; `whs_investigations`, `whs_inv_team`, `whs_inv_timeline`,
  `whs_inv_statements`; `whs_rule_checks`, `whs_reg_notices`; `whs_actions` (polymorphic source); `whs_links`,
  `whs_comments`, `whs_files`, `whs_alerts`, `whs_events`; `whs_purges`.
- **Hours worked history** (migration `0028_whs_hours.sql`, additive): `whs_hours_revisions`, one row per change to
  one site and month (hours before and after, who, when, reason). Append-only by trigger (only the example company's
  removal passes, through `whs_purges`); an account's deletion only clears who made the change.
- **Protections in the database:** incidents, health records and notification records cannot be deleted; a recorded
  submission cannot be changed and needs its method, time, who and reference (a CHECK); the history tables
  (`whs_events`, `whs_legal_events`, `whs_incident_revisions`, `whs_rule_checks`) are append-only. Every change to a
  tracked field of a classified incident writes a revision with the before and after values (trigger
  `whs_incidents_track`). The example company's removal is the one way out, through `whs_purges` in the same
  transaction.
- Kinds and categories are labels in code (`whs/util.ts`), never a CHECK list, so new kinds need no migration.
  Statuses are CHECKed.
- The seed (packs, instruments, rules) is written by code (`whs/seed.ts`, `INSERT OR IGNORE`, `whs_meta.seed_version`)
  on first use, because the migration may only create.

## The jurisdiction engine

- **Packs** are platform-level: a jurisdiction, its regulator and its instruments, each typed: legislation,
  regulation, code of practice, standard, guidance, model law or company policy (company policies are a company's own,
  in `whs_policies`).
- **Rules** are versioned and effective-dated: notification criteria, exposure limits, record retention. A rule
  applies only when its version is **active and verified** and in effect on the incident's date (`rulesInEffect`:
  latest `effective_from`, then the highest version). Seeded rules carry no deadline or threshold as fact.
- **Sites** get one or more jurisdictions (Settings). An incident is checked only against its own site's packs, never
  another jurisdiction's (Test 11). Each check is kept as a snapshot (`whs_rule_checks`).
- **Verification workflow** (platform console): draft, submitted for review, reviewed by another platform admin,
  activated, then verified with who, when, the source and notes; content changes reset verification; a rule can be
  withdrawn or unverified. Company WHS managers see each instrument's and rule's status and add their own policies.

### Seeded packs (all Not verified)

| Pack | Content |
| --- | --- |
| `au-model` | Reference only (not assignable to a site): Safe Work Australia's model Act, Regulations and codes, DEWR; the December 2025 notification amendments and the workplace exposure limits from 1 December 2026 as effective-dated drafts |
| `au-cth` | Comcare; WHS Act 2011 (Cth) and WHS Regulations 2011 (Cth); notification v1 active, v2 draft; retention |
| `au-nsw`, `au-qld`, `au-sa`, `au-tas`, `au-wa`, `au-act`, `au-nt` | Harmonised laws: the jurisdiction's Act, Regulations, codes and regulator guidance; notification v1 active and v2 draft (the December 2025 amendments); exposure limits v1 to 30 November 2026 and v2 from 1 December 2026; retention |
| `au-vic` | Victoria's own Occupational Health and Safety Act 2004 and Regulations, WorkSafe Victoria |
| `nz`, `uk-gb`, `ca-federal`, `ca-on`, `ca-bc`, `ca-ab`, `ca-qc`, `sg`, `za` | Skeletons: the regulator and the primary legislation (Great Britain also MHSWR, RIDDOR, COSHH, PUWER, LOLER) |

**Sources checked (15 Nov 2026, from the build session):** legislation.gov.au answered for the WHS Act 2011 (Cth)
(latest compilation 16, C2024C00243, in force from 1 July 2024; Part 3, sections 35 to 39 headings listed) and the WHS
Regulations 2011 (Cth) (compilation 28, F2025C00381, in force from 25 March 2025). Their section text was not read.
Every other source was refused by the session's network and was **not** checked: Safe Work Australia, DEWR, Comcare,
the state and territory legislation sites and regulators, WorkSafe Victoria, and the New Zealand, United Kingdom,
Canadian, Singapore and South African sites. Each instrument records what was and was not reached. None is a
verification.

## Workflows

- **Hazards:** Reported, Assessment, Controls assigned, Implementation, Verification, Closed (also cancelled and
  reopened). Rated on the company matrix (the rating keeps its matrix version); controls are actions with a hierarchy
  level; a high risk relying on administrative controls and PPE alone shows a warning; verification needs no open
  control actions; closing needs a note and verified actions; links to risk assessments, incidents and Maintenance
  work orders.
- **Risk assessments:** twelve kinds; steps, hazards (harm, people affected, initial rating, existing and additional
  controls, residual rating); approval by a WHS manager who did not draft it (409 `WARNINGS` until acknowledged);
  review dates and revisions (triggers: work, equipment, controls, circumstances, incident, scheduled); the approved
  revision stays until the next is approved; the register with initial and residual heat maps.
- **Incidents:** Reported, Immediate response, Classification, Investigation, Corrective action, Verification,
  Closure. A serious incident (severity serious or critical, an outcome of death or hospital in-patient treatment, or a
  dangerous occurrence) alerts the
  WHS managers in the app and by email through the outbox (never for the example company). Corrective action needs
  an approved investigation where one is required; closing needs the notification decided or recorded and the actions
  verified.
- **Investigations:** lead and team, timeline, witness statements (seen by investigators, approvers and the team),
  evidence, five whys, fishbone, contributing factors, failed controls, root cause; approval with segregation.
- **Regulator notification:** the check of the site's rules; the decision with reasons; a standard checklist; the
  due time only from a verified rule in effect; the submission (method, time, who, reference, confirmation file),
  after which the record is frozen. The incident never shows as notified without a recorded submission.
- **Actions:** number, source, responsible, priority, due date, evidence required (completion refused with
  `EVIDENCE_REQUIRED` until a file is attached), completion, verification by someone else, closure; overdue actions are
  escalated in the app (once each) to the responsible person and WHS managers by the 15-minute run and on the
  dashboard, and show in My Work.
- **Dashboard:** counts from the records only, filtered by site, department, dates, incident kind and risk level;
  twelve months of incidents and hazards; sites and departments compared. Lost time and recordable injury frequency
  rates: see "Hours worked and injury frequency rates" below.

## Hours worked and injury frequency rates

Follow-up of 15 Nov 2026 (owner's brief, task 2). Code: `apps/work/src/worker/whs/hours.ts`.

- **Who enters hours:** WHS managers and ERP administrators, in WHS settings, per site and month. BIZOMAT does not
  track hours and has no payroll link. People who read the WHS registers (WHS staff, health and safety
  representatives, health officers, executives, ERP administrators) see the hours and their history; a person who only
  reports sees neither.
- **Rules (checked on the server):** a month like 2026-11, from January 2000 to the current month (never a month that
  has not started); hours a number from 0 to 10,000,000 per site and month, kept to two decimals; each site and month
  once per save; a site of the company (archived sites too, for the months they were in use). A month has either one
  figure for the whole company (not split by site) or figures by site, never both, so no hours are counted twice.
  Entering the same figure again changes nothing.
- **History:** every entry, change and removal is a row of `whs_hours_revisions` written in the same transaction as
  the change, with the figure before read inside that transaction. Changing or removing a recorded figure needs a
  reason (at least three characters). WHS settings lists the last changes; the WHS history (`whs_events`) records each
  save with its reason. Figures saved before migration 0028 have no history row of their own; their first change
  after it records the figure before.
- **Rates:** worked out on the dashboard, company-wide (or for the site filtered) and for each site:
  - LTIFR = lost time injuries x 1,000,000 / hours worked; TRIFR = recordable injuries x 1,000,000 / hours worked.
  - Lost time injuries are incidents classified "Lost time (unable to work a shift or more)". Recordable injuries are
    incidents classified Medical treatment, Restricted or alternative duties, Lost time, Admitted to hospital as an
    in-patient, or Death. These are BIZOMAT's counting rules from the outcome recorded on each incident, said on the
    screen, not a regulator's definition. Medical details (`whs_health`, days lost included) are never used.
  - Only whole calendar months count, because hours are entered by month: a period that starts or ends inside a month
    leaves that month out (the default period, twelve months to today, covers the eleven finished months). No whole
    month, or more than ten years: no figure, and the screen says why.
  - Every site in use needs a figure for each month (0 for a month it did not operate): the date a site was added to
    BIZOMAT is not the date it opened, so leaving out a site added later could undercount hours and overstate the
    rates. An archived site needs hours from the month it was added to the month it was archived, and any month it
    has hours or incidents. A company with no sites enters one figure for the whole company.
  - When anything is missing the figure is not shown: "Cannot be calculated: hours worked missing for <site>
    (<months>) ...". Hours that add up to zero, and a month with both a whole-company and site figures (possible only
    for figures saved before this follow-up), also give no figure, with the reason. Department and incident-type
    filters give no rates (hours are per site).
  - The incidents counted are those the person may see (the dashboard's rule). For someone who does not read
    confidential reports the screen says the figures of WHS managers also count confidential reports.

## Medical privacy review (15 Nov 2026)

Checked against the owner's brief (task 2, points 1 to 8):

| Point | Result |
| --- | --- |
| Medical details only for health officers | Held. `whs_health` is read only by `GET .../incidents/:id/health`, which needs the health capability (health officers, or the one person of a one-person company). Health files are added and served only to health officers. Tested for the WHS manager, WHS officer, investigator, representative, executive, owner and the reporter: the incident, the list, the CSV export, search, the dashboard, settings, alerts, My Work and the summary carry none of it (`apps/work/test/whs-hours.test.ts`). |
| Managers and supervisors never automatically | Held. The WHS manager and ERP administrators do not get it; owners and administrators cannot be given Health officer. |
| History and search | The incident's tracked changes (`whs_incident_revisions`) have no medical fields; the health history names the fields changed, never values; the search text is the number, title, description and location only. |
| Platform console | `/api/admin/whs` holds the legal packs only, no company records. |
| Regulator reporting stays human | Held. The decision is a person's; the submission is a person's record ("Submission recorded"); BIZOMAT sends nothing to a regulator. |
| Legal packs Not verified | Held. Every seeded rule is Not verified until a platform administrator verifies it in the app with the source checked. |
| No compliance or certification claims | Held (`tests/whs-claims.test.ts`, which also reads the new screens and messages). |
| Planned modules | Held: listed with the Planned label on the dashboard and the public pages. |

Found and changed in this follow-up: WHS settings returned the hours worked to every member of the company, including
people who only report; they now go only to people who read the WHS registers. Not a medical field, but company data a
reporter does not need.

## Example company

`apps/work/src/worker/system/example.ts` adds, through the app's own API: hours for the site, the site's jurisdiction
(New South Wales), a pinch-point hazard rated high with an interlocked guard and isolation as controls, an approved
JSA for changing the laser cutter's lens, a forklift near miss with a walkway action, a hand-cut injury with an
approved investigation and two actions, and a regulator notification record marked "Example data" with the
reference "EXAMPLE-0001 (invented)". It sends no email. Existing example companies are unchanged until removed and
made again; removal deletes the WHS records through `whs_purges`.

## Tests

- `apps/work/test/whs-core.test.ts` (workerd): packs seeded and Not verified, effective dates, the legal workflow with
  segregation, Tests 1, 2, 3 (a rule verified inside the test only: due time computed; unverified: no deadline;
  reference recorded), 11, 12, 13, 14, incident edit history and no deletion, matrix configuration and warning, roles,
  overdue escalation, My Work, injury rates, example company and its removal.
- `apps/work/test-node/whs-core.test.ts` (Node runtime): the migration is additive with no kind lists in CHECKs,
  earlier tables unchanged, a hazard to closure with the evidence refusal, a verified rule's due time and submission,
  database protections, example company.
- `apps/work/test/whs-hours.test.ts` (workerd): who may enter hours, the validation rules, the history with reasons and
  its database protection, company isolation, LTIFR and TRIFR (whole months, every site, the "cannot be calculated"
  notes, zero hours, filters), and that medical details reach nobody but health officers.
- `apps/work/test-node/whs-hours.test.ts` (Node runtime): migration 0028 is additive and leaves earlier tables as they
  were, the history is append-only on node:sqlite while an account can still be deleted, hours and rates over HTTP,
  and the example company's removal.
- `tests/whs-claims.test.ts` (website): no compliance or certification claims; planned parts labelled Planned.

## Planned (not built)

Inspections and audits; safe work procedures, document control and SWMS acknowledgement; permits to work; contractor
and visitor safety; training, competency and licences; chemicals and safety data sheets; plant and equipment safety;
PPE; emergency management; consultation and safety committees (consultation comments on records work today); health
surveillance; the compliance and obligations register; electronic submission to regulators; verified legal content.

## Decisions for the owner

- WHS managers do not read medical details; only health officers do. Say if WHS managers should.
- ERP administrators read confidential reports only while the company has no WHS manager or health officer.
- Injury frequency rates need hours worked entered by a WHS manager per site and month; there is no payroll or
  timesheet source. Every site in use needs a figure for each month, so a site added later needs 0 for its earlier
  months before past rates show again. Say if a quicker way to enter those is wanted.
- The counting rules for rates (which outcomes are lost time and recordable) are BIZOMAT's, from the incident's
  recorded outcome. Say if your organisation counts differently (for example deaths as lost time injuries).
- The body part and nature of injury are part of the incident's classification, which everyone who reads the
  registers sees (executives and health and safety representatives too). Say if they should be limited to WHS staff.
- The injured person cannot read their own confidential health record in BIZOMAT; a health officer can give it to
  them. Say if they should see it themselves.
- My Work now shows Health and Safety items (earlier releases kept ERP records out of My Work).
- Sites come from Maintenance only; WHS does not create sites.
- The rail has eleven entries now (Health and Safety added). Say if it should sit under Operations instead.
- A new email template, `whs_alert`, for serious incidents.
- The harmonised notification v2 drafts (December 2025 amendments) are left as drafts for a verifier.
- Who verifies the legal packs, and against which sources: until then every rule stays Not verified.
