# BIZOMAT CRM

_Built 13 Nov 2026 on the owner's brief (branch `claude/keen-bardeen-tb2f86`). Not deployed: deploying is the owner's
(`docs/deployment/fly-deployment.md`; GitHub Actions must run again first, `BIZOMAT-PROJECT-STATUS.md`, action 9)._

BIZOMAT CRM is a multi-organisation customer relationship manager for every BIZOMAT account: organisations with their
own members and roles, leads, contacts, companies, pipelines and deals, activities and follow-ups, notes and documents,
a unified customer timeline, dashboard and reports, automations, search and saved views.

## Where it runs: no new infrastructure

| | |
| --- | --- |
| Address | `https://bizomat.ai/crm/` (sign-in `https://bizomat.ai/crm/login`) |
| Code | `apps/work` (the Project Management app): API `src/worker/crm/`, screens `src/client/crm/`, shared definitions `src/shared/crm/`, styles `src/client/styles/crm.css` |
| Process | the existing `work` Machine of the Fly app `bizomat` (shared-cpu-1x, 512 MB). No new app, Machine, process group, volume, service or secret |
| Database | the existing SQLite database on the `work_data` volume (`/data/work/db.sqlite`; D1 on Cloudflare), migration `0010_crm.sql` |
| Files | the existing file store (`/data/work/files/` on Fly; R2 on Cloudflare), under `crm/<organisation>/...` |
| Accounts and sessions | Project Management's (one BIZOMAT login; sign-up protection, email confirmation, password rules unchanged) |
| Email | the existing outbox (Brevo, founder console > Email): invitations and notification emails only |
| Background work | the existing 15-minute maintenance run (`runMaintenance`): scheduled automations and CRM housekeeping |
| Routing | the edge proxy sends `/crm` and `/crm/...` to `work` like `/tasks` (`infrastructure/proxy/routes.mjs`, `CRM_PATHS`); the website Worker does the same on Cloudflare (`src/worker.ts`) |

The same SPA serves both products: under `/crm` (`<base href="/crm/">`) it renders the CRM (`src/client/App.tsx`,
`IS_CRM`), and the CRM's code is a separate lazily loaded chunk, so Project Management users do not download it.

### One session for both products

The app writes its session cookie for each path it is served under (`Path=/tasks` and `Path=/crm`,
`src/worker/mount.ts`), so signing in to either signs in to both; the website, CAD Automation and any other path of
bizomat.ai still never receive it. Sessions created before this release have the cookie on `/tasks` only: a CRM page
without a cookie goes once to `/tasks/api/crm-carry`, which (with a valid session) writes the same cookie for `/crm` and
returns, or sends the person to the CRM's sign-in page; a 60-second marker cookie prevents any loop. `crm-carry` only
ever redirects into `/crm`. A CRM page asked for on another host (work.kevos.com, bizomat.fly.dev) answers 301 to
bizomat.ai.

### Resource use on the 512 MB Machine

Every list, board, dashboard and report is computed in SQL with indexes on `(org_id, ...)` and returns at most one page
(50 rows by default, 200 at most; the board 1,000 open deals per pipeline; exports 10,000 rows in pages of 200).
Nothing is cached in memory and no process runs between requests. Scheduled automations are bounded per run (1,000
automations, 300 records each). The client chunk is about 56 kB compressed for the shell plus the page in use.

## Data model (migration `0010_crm.sql`, additive)

32 new tables, all named `crm_*`; no existing table, column or row changes. Money is integer minor units of the
organisation's currency.

| Area | Tables |
| --- | --- |
| Organisations | `crm_orgs`, `crm_members` (one owner per organisation, enforced by a unique partial index), `crm_invitations` (token hash only, 14-day expiry), `crm_role_permissions`, `crm_teams`, `crm_team_members` |
| Records | `crm_companies`, `crm_contacts`, `crm_leads`, `crm_pipelines`, `crm_stages`, `crm_deals`, `crm_deal_contacts`, `crm_products`, `crm_deal_items`, `crm_deal_stage_history`, `crm_activities`, `crm_notes`, `crm_files` |
| History and audit | `crm_events` (timelines), `crm_audit_log` (insert-only, no foreign key) |
| Configuration | `crm_custom_fields`, `crm_tags`, `crm_record_tags`, `crm_saved_views`, `crm_email_templates`, `crm_automations`, `crm_automation_runs` |
| People | `crm_notifications`, `crm_notification_prefs`, `crm_calendar_feeds` (token hash only) |
| Integration layer | `crm_mail_connections` (empty until a mailbox provider is configured) |

**Organisation isolation is enforced three times:**

1. **Membership first.** Every route resolves the caller's membership of the organisation in the address
   (`src/worker/crm/access.ts`, `requireOrg`); a non-member gets 404, so another organisation's existence is never
   revealed.
2. **Every query is scoped.** Records are read with `org_id = ?` and the caller's visibility scope; filters and sorts
   can only name fields defined in code (`src/shared/crm/fields.ts`) or the organisation's own custom fields, with
   values always bound.
3. **The database refuses cross-organisation links.** Every link between two CRM records is a composite foreign key
   `(org_id, <ref>_id) -> <table>(org_id, id)`, and a deal's stage must belong to its pipeline. A contact can never point
   at another organisation's company, even through a bug in the application.

Records are archived or deleted softly (`archived_at`, `deleted_at`) and can be restored; history and audit rows are
insert-only. Deleting an organisation (owner only, typing its name) hides it from every member and stops its
invitations; its data stays stored (an operator can recover it, or purge it: the schema cascades from `crm_orgs`).

## Roles and permissions

| Role | Default |
| --- | --- |
| Owner | Everything, including ownership transfer and deleting the organisation (exactly one) |
| Administrator | Everything else: members, roles, permissions, settings, all records |
| Manager | All records, pipelines, fields, lists, products, automations, teams; invites, but does not change roles |
| Sales Executive | Views all records; creates; edits and deletes the records they own; reports; no export or import |
| Member | Views all; creates; edits what they own; never deletes records |
| Viewer | Read only |

Owners and administrators can change Manager, Sales Executive, Member and Viewer per module (leads, contacts,
companies, deals, activities, reports, automations, settings, members) and action (view, create, edit, delete with
"all", "own" or "none"; export, import, manage, invite, teams). A stored setting can never widen what the code defines,
and editing or deleting never reaches beyond viewing (`resolvePerms`). The server enforces every permission; the
screens only hide what a person cannot use. Only the owner gives or removes the administrator role; nobody changes
their own role; removing a member can hand their records and open activities to someone else.

## Features

- **Organisations:** create (the creator is the owner; a sales pipeline and seven automations are set up, no sample
  records), details and logo, currency (fixed once there are deals) and time zone, members and roles, invitations by
  email (accept, decline, resend with a new link, withdraw; one active invitation per address; the invited address must
  match the account; single use), teams, ownership transfer, leaving, switching between organisations, audit trail.
- **Contacts, companies, leads:** every field of the brief, more emails and phones per contact, profile pictures and
  logos, tags, custom fields (eleven types), duplicate warnings while typing (email, phone, name, company name,
  website), archive, delete and restore, related records and timelines.
- **Leads:** statuses (New, Contacted, Engaged, Qualified, Unqualified, Converted; customisable, each counted as open,
  qualified, unqualified or converted), an explainable lead score (recalculated on every change unless set by hand),
  conversion into a new or existing contact, a new or existing company and a deal in one step. A lead converts once; a
  contact with the same email blocks a second one unless the person confirms; the lead's activities follow.
- **Pipelines and deals:** several pipelines with custom stages and probabilities, a drag-and-drop board (with a menu and
  keyboard alternative) including Won and Lost drop zones, a list view, products and services with quantity and
  discount (then the deal's value is their total), contacts with roles, competitors, lost reasons, flags, weighted
  value, stage history with time in each stage.
- **Activities:** calls, emails, meetings, appointments, follow-ups, presentations, demonstrations, proposals, visits,
  tasks, general (customisable); assigned to colleagues; due date and time; priority; outcome; My activities, Today,
  Overdue, Upcoming, Team, Completed; a calendar; the Tasks page (tasks and follow-ups); .ics download.
- **Timeline:** every record's history, activities, notes and documents in one list, newest first; a company's includes
  its contacts' and deals', a contact's the deals they are on.
- **Notes and documents:** notes, internal comments and meeting notes with @mentions (the person is notified), pinning;
  documents (proposals, quotes, contracts...) with versions, in the app's file store, served only to people who can see
  the record.
- **Dashboard:** open pipeline, weighted forecast, won and lost, win rate, new, qualified and converted leads, lead
  conversion, contacts and companies, overdue follow-ups; revenue by month, open deals by stage, conversion funnel,
  lead sources, completed activities per week, team performance, upcoming meetings, recent activities; filters for
  dates, owner, team and pipeline.
- **Reports:** lead conversion, sales pipeline, revenue, monthly and quarterly trends, won and lost (with reasons),
  salesperson performance, lead sources, activities, forecast (weighted and commit), deal ageing, sales cycle; each
  with figures, a chart, a table and CSV export.
- **Search, filters and views:** organisation-wide search (contacts, companies, leads, deals, activities, notes),
  filters on any field, tag or custom field with all/any conditions, sortable and configurable columns, pages, bulk
  actions (assign, status, priority, tag, archive, delete, restore, complete), built-in views (My contacts, All contacts,
  New leads, My leads, Open deals, Won deals, Lost deals, Closing soon, Overdue follow-ups, Recently updated...) and
  saved views, private or shared by managers and administrators.
- **CSV:** import with column mapping and duplicate handling (skip, update or create), export of what the person can
  see; formulas are neutralised; imports and exports are in the audit trail.
- **Automations:** triggers (lead created, assigned or changing status; contact created; deal created, entering a
  stage, won or lost, close to its expected close date; activity assigned or overdue), conditions, actions (notify,
  create a follow-up, set the priority, flag the deal, assign an owner), on and off, execution history. Event triggers
  run right after the change; scheduled ones in the 15-minute maintenance run. Each event runs an automation at most
  once (unique `event_key`).
- **Notifications:** in the app (bell, page, per organisation) and by email per type and person when email is connected.
- **Project Management link:** any activity becomes a task in a Project Management project the person can add tasks to
  (Project Management's own permission checks); the task links back to the CRM.

## Email, calendar and mailbox integrations

| | Status |
| --- | --- |
| Logging emails | Working. Write from a template, send from your own mail program (the CRM opens it filled in), and the email is logged as "logged", never "sent" |
| Invitations and notifications by email | Working through the existing Brevo outbox when the founder console has a key; otherwise invitations show a link to share and notifications stay in the app |
| Calendar | Working. .ics per activity and a private, revocable subscription address per person and organisation |
| Gmail and Microsoft 365 synchronisation | **Not configured.** The integration layer is `src/worker/crm/mailbox.ts` and the table `crm_mail_connections`. To switch a provider on: an OAuth client with mail scopes (Google requires app verification for Gmail scopes; Microsoft an Entra app registration with Graph `Mail.Read`, `Mail.Send`, `offline_access`), its credentials as secrets of the work process (`CRM_GOOGLE_CLIENT_ID`/`_SECRET`, `CRM_MICROSOFT_CLIENT_ID`/`_SECRET`), and the connector itself (authorise, token exchange with PKCE, refresh, sync by contact address in the maintenance run, tokens encrypted with the settings key). Settings > Integrations says so; no button offers it |

BIZOMAT does not send customer email itself: the platform's transactional quota (Brevo) is shared with invitations and
security messages, and sending as a person needs their own mailbox.

## Deployment and rollback

1. Merge to `main` by pull request; deploy with **BIZOMAT deploy (bizomat)** (`confirm` = `DEPLOY`). One image carries
   the proxy (with `/crm` routing) and the work app (CRM API and screens).
2. At start, the work server copies the database (`pre-migration-backups/`) and applies `0010_crm.sql` in one
   transaction. Additive only.
3. After the deploy the workflow also checks `https://bizomat.ai/crm/login`; `infrastructure/smoke/smoke.mjs` checks
   `/crm/api/health`, the page, the carry redirect and 401 without a session.
4. Then `CLAUDE.md`, "After any production change", plus `/crm/` signed in.

**Rollback:** redeploying the previous image is safe with the new tables in place (the previous code never reads
them; migrations are forward-compatible). The proxy of the previous image sends `/crm` to the website again (404). No
data needs restoring.

## Tests

`apps/work/test/crm-orgs.test.ts` and `crm-records.test.ts` (28 tests, workerd and Node): organisations, invitations,
roles and permission overrides, isolation by every address (organisation id, record ids swapped across
organisations, links refused by the API and by the database), records, conversion, pipelines and deals, activities,
scheduled and event automations, timeline, notes and files, dashboard and reports, CSV, the `/crm` address and session
carry. `test/mount.test.ts` checks the cookie for both paths. Proxy: `infrastructure/proxy/test/routes.test.mjs`.
Website: `tests/worker.test.ts`, `tests/navigation.test.ts`.

## Not in this release

- Gmail and Microsoft 365 synchronisation (above), and sending customer email from BIZOMAT.
- Merging two duplicate records (duplicates are detected and warned about; merging is by hand).
- Real-time updates between people looking at the same board (lists refresh on focus and after each change).
- Multi-currency deals within one organisation (one currency per organisation, so totals are never mixed).
- A public product page on the website for the CRM (product claims need the owner's wording); the CRM is in the
  website's Sign in menu, footer and `/sign-in/` page.
