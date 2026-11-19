# One company identity (Stage 1, R3)

Every company of every kind now has one row in the table `companies`, with the id it already had. Code:
`apps/work/src/worker/company/identity.ts`; migration `apps/work/migrations/0030_company_identity.sql` (reverse:
`apps/work/migrations-reverse/0030_company_identity.sql`); tests `apps/work/test/company-identity.test.ts` and
`apps/work/test-node/company-identity.test.ts`. Nothing people see changes in R3.

## The registry

| Type | Source table (unchanged) | Who is in it |
| --- | --- | --- |
| `registered` | `co_companies` | Its members (`co_members`) |
| `personal` | `sys_companies` | The person it belongs to |
| `example` | `sys_demo` | The person it was made for |

- **Same ids.** No id changed, so every record that names a company (Maintenance, ERP, WHS, billing) still points at
  it. `legacy_company_id_map` records which table each company came from at the migration.
- **Expand first.** The source tables keep their details and their code. Folding them into `companies` is a later
  "contract" step and needs the owner's approval (brief, Part 9).
- **Kept in step.** Every write to a source table, and every change of a registered company's owner, updates the
  registry in the same request (`syncCompany`, `syncCompanyStatements`). The 15-minute maintenance run repairs
  anything a write missed and marks a company whose source is gone as deleted (`syncAllCompanies`, step
  `companyRegistry`). `companyDrift` counts what is out of step (missing, mismatched, orphaned); R4's integrity check
  reads it.
- **Registration.** Country, registration type and number, and status live in the registry, for every country. One
  legal entity per country, registration type and number (a unique index; deleted companies excluded).
- **Statuses** (brief 5.3): `not_registered`, `registration_pending`, `verification_in_progress`, `verified`,
  `verification_failed`, `manual_review`, `status_changed`, `suspended`, `deregistered`. `status_source` says what set
  it: `none`, `format`, `registry`, `manual`, `system` or `migration`.
- **No claim beyond the checks.** Until R6's verification service takes over, a registered company's status comes from
  its ABN checks. An ABN whose format was checked, or that the register found active, is `registration_pending`: the
  register was never compared with the company's name, so nothing is `verified`. A cancelled ABN is `deregistered`; an
  ABN the register did not find goes to `manual_review`. A status a platform admin set by hand is kept until the
  number changes.

## The one rebuild window

`co_companies`, `co_members` and `co_invitations` were rebuilt with the same names, columns, ids and rows, only to
accept more:

- any country (ISO 3166 alpha-2 code), with the Australian state, postcode and ABN rules kept for Australian
  companies, an `international` phone kind and a `trading_name`;
- the company roles of Stage 1: owner, admin, manager, employee, read_only. The existing role `member` stays valid;
  R5 moves people to the new roles.

The migration's first line, `-- bizomat:foreign-keys-off`, tells the runner (`apps/work/src/node/store/migrations.ts`)
to switch foreign keys off around it, so dropping the old tables cannot cascade into their children. The migration
commits only when `PRAGMA foreign_key_check` finds nothing, and foreign keys are switched back on either way. On D1
such a migration may only be applied to an empty database, which is what the Cloudflare move tool does.

## Other tables

- `company_settings` (company, key, value): company-level settings, kept apart from people's own preferences.
- `users.email_verified_via`: how an email was proven (`link`, `google`, `admin`, `invitation`). Emails proven before
  the migration say `legacy`.

## Differences from the approved plan

- **Personal and example companies were not moved into `co_companies`.** About 25 queries treat a row in
  `co_companies` as a registered company, billing's "own and example companies are never billed" among them. Moving
  them would have changed what those queries mean. The registry gives one identity without that risk, as the brief's
  expand-then-contract rule asks.
- **No `company_id` column on `workspaces`, `crm_orgs` and `fin_orgs`.** The owner's standing rule is that a tool's
  company is worked out, never copied (`apps/work/src/worker/system/system.ts`). A stored copy would drift whenever a
  tool is linked, unlinked or handed over. R4 resolves a tool's company in the shared data-access layer instead.

## Taking it back out

Make a copy of the database first. Move every company back to Australia and every person and invitation back to
owner, admin or member, then run the reverse script with foreign keys off (sqlite3: `PRAGMA foreign_keys = OFF`
before, `PRAGMA foreign_key_check` after). The test runs it and applies 0030 again on top.
