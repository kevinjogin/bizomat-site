# Company context (Stage 1, R4)

Every request is for one company, worked out on the server from the address, and every check that depends on the
company runs there. Code: `apps/work/src/worker/platform/context.ts` (company of an address, scoped API tokens, module
switches), `apps/work/src/worker/platform/integrity.ts` (integrity check), `apps/work/test-node/company-queries.ts`
(the query check); migration `0031_api_token_scope.sql` (reverse in `apps/work/migrations-reverse/`).

## The company of an address

- **The address is the only source of the active company.** ERP, Maintenance, WHS, company administration and billing
  addresses carry the company (`/api/erp/c/<company>/...`). A tool belongs to exactly one company, so a tool's address
  (`/api/workspaces/<id>`, `/api/crm/orgs/<id>`, `/api/fin/orgs/<id>`, and Projects records such as boards and items)
  is just as explicit. Nothing stored about "the current company" is trusted for a write.
- **A tool's company is worked out, never copied** (the owner's rule): the registered company that runs it, else the
  example company it was made for, else its owner's own company (`companyOfTool`).
- **The last-used company** is a preference on that computer only, used to choose where to land.
- **Switching company** in the ERP header drops every cached record of the old company before the new one opens;
  leaving its pages closes their live connections and open forms. Only the list of companies is kept.

## API tokens limited to one company (audit E3 and S5)

- A new token names one company the person is in, optionally some of its applications (Projects, CRM, Finance, ERP
  modules, company administration), and can be read only.
- Every address it calls must belong to that company and, when it names applications, to one of them. An address of no
  single company (notifications, search across tools, lists of every workspace) is refused with 403 `TOKEN_SCOPE`. A
  scoped token finds its company's tools at `GET /api/system/companies/<company>`.
- New tokens expire after 90 days unless a period up to a year is chosen. There is no "never" any more.
- Every token of a person ends when they change their password or an administrator sets it, and every token but the
  founder's ends at a security reset (`revoked_reason` records why).
- Tokens made before R4 have no company and keep acting as their person until they expire or are revoked; the token
  list says so.

## Module switches for every module

The switches of the Control Centre now act for every module: Projects (`tasks`), CRM, Finance, and the ERP's
products, procurement, inventory, manufacturing, quality and supply chain (by the address's section; overview, reports,
files, events, roles and settings are shared and have no switch). Maintenance and WHS keep their own gate. A module
switched off for a company answers 403 `MODULE_DISABLED` to the people of that company's tool or ERP; anyone else gets
the route's usual answer, so a switch never reveals that a company exists. While no module is switched off anywhere,
the check costs one small query per request.

## Realtime (audit E2)

A board's live updates check each connected person's access again at every event: the person must still be active and
still see the board. Anyone who lost access has their connection closed (code 4403) at the next event, instead of
receiving notices until they reconnect. Both the Cloudflare Durable Object and the Node hub do this.

## Integrity check

Control Centre, "Integrity check" (platform admins with two-factor sign-in; `GET /api/admin/platform/integrity`):
counts of records in every company table whose company is not in the registry, tools still linked to a deleted
company, and the company registry's drift. Counts only, never names or content.

## The query check

`test-node/company-queries.test.ts` reads the schema for every table with a `company_id` column (not the CRM's, where
`company_id` is a CRM company) and scans the server code: every SQL statement on such a table must name `company_id`.
The statements that were there when the check began were scoped by their company on 19 Nov 2026 (owner's request),
and the list of unscoped ones (`statements` in `test-node/fixtures/company-queries-baseline.json`) is empty:

- a statement that found its row within the company also names it when it changes or reads it again
  (`WHERE company_id = ? AND id = ?`, with the company already known);
- a list built in code writes its company condition in the statement itself: `WHERE x.company_id = ?${andAll(where)}`
  (the SQL it produces is unchanged);
- a row built from an object is inserted through `insertCompanyRow`, which refuses a row without its company;
- a shared SELECT fragment (`const SO_SELECT = ...`) counts as scoped only when every statement using it names
  `company_id`.

A new statement without `company_id` fails the test. `platformWide` lists the statements that must read across
companies, each with its reason: the platform console's totals, the billing sweep and Stripe webhook, the check that a
tool belongs to no company yet, a public link found by its token, the malware scanner's queue and platform
jurisdiction packs.

## Audit fixes in R4

- **E1:** documents of a deleted workspace are closed to its members.
- **L2:** a confidential WHS record linked to an open one is left out of the links for people who may not open it (its
  number, title, status and existence).
- **L3:** the contacts and Finance customers offered for a sales order follow the person's own-records rights in the CRM
  and Finance.
- **E4:** contacts and tracking named on Finance journal lines, transaction lines and bank rules must be from the same
  workspace, and each tracking option of the right kind (a clear 400, before anything is written).

## Not done in R4

- Tool addresses keep their tool id rather than moving under `/erp/c/<company>/...`; the tool id names the company
  unambiguously, so this was not needed for safety.
- The shared data-access layer is the context module and the query check, not a wrapper every query goes through.
