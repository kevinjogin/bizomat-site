# BIZOMAT company accounts

Owner's request, 13 Nov 2026:
- People work as a company, not as individuals; someone working alone registers in their own name.
- One company account runs Project Management, the Customer Relationship Management (CRM) and Finance together.
- People sign in once and reach every tool and department.
- Departments are made once and appear in every tool, and can sit under one another.
- Registration is checked: the business number, email, phone number, and address with its postcode.

Served at `https://bizomat.ai/company` by the Project Management app (`apps/work`). It shares the app's accounts, session,
database and Machine with the other tools; no new app, Machine, database or volume. Code: `apps/work/src/worker/company`
(server) and `apps/work/src/client/company` (pages). Migration: `apps/work/migrations/0013_company.sql`, additive
(`co_*` and `id_*` tables only).

## What a company is

- **Registration** (`/company/new`): a business (with its ABN) or a person in their own name (ABN optional). The
  person who registers is the **owner**.
- **Tools**:
  - Registration creates one of each tool for the company: a Project Management workspace, a CRM organisation and a
    Finance *business* workspace.
  - Instead of creating one, the owner can bring in a tool they already own (`co_tools`). Each tool belongs to at most
    one company.
  - Personal and household Finance workspaces are never offered: they stay private.
- **People**:
  - A company role: owner, administrator or member.
  - A role in each tool (`co_members.tasks_role`, `crm_role`, `fin_role`), using that tool's own roles. No role means
    no access to that tool.
  - The company writes these roles into each tool's members table (`src/worker/company/sync.ts`).
  - Taking a role away removes the person from that tool, as the tool's own "remove member" does.
  - A tool's owner is never changed there except by a transfer of the company.
- **Invitations**:
  - The invitation sets the company role, the tool roles and the departments.
  - Accepting needs the invited email address, and confirms it.
  - The link works for 14 days.
- **Departments**:
  - Made once; in every tool the company runs, a department is:
    - a team in Project Management;
    - a team in the CRM, led by the department's head;
    - a department in Finance's tracking.
  - A department can sit under another, to any depth.
  - Administrators manage them; a department's head can change who is in it and in the departments under it.
  - Archiving a department removes its teams and archives its Finance department (posted entries keep pointing to it).
- **Transfer and closing**:
  - The owner can hand the company, and every tool it runs, to an administrator.
  - Closing the company account leaves the tools and their records as they are.
- **People who joined a tool directly** are listed under People as "in a tool, not in the company". An administrator
  can add them, keeping their roles.

The tools keep working for people who are not in a company. Project Management's Home page, the CRM and Finance show a
short prompt to register a company or open an invitation; it can be put away for the browser session.

## The control centre (Overview)

The Overview shows totals from each tool, for the company and for each department (and the departments under it).
Totals only, never records (`src/worker/company/summary.ts`):

| Tool | Company | Department |
| --- | --- | --- |
| Project Management | Open tasks, overdue, due in 7 days, done in 30 days, on shared boards (private and personal boards left out) | The same, for tasks assigned to its people |
| CRM | Open deals and their value, won in 30 days, open leads, follow-ups due | The same, for its people's records |
| Finance | Income, expenses and net this financial year from posted journals; owed to and by the business | Income, expenses and net on its Finance department |

Who sees a tool's figures: someone who could see them in the tool, by the tool's own permissions
(`src/worker/company/overview.ts`):
- Project Management: the company owner and administrators, and the workspace's owners, administrators and project
  managers.
- CRM: the company owner and administrators, and roles that see every deal (all the default roles do).
- Finance: the company owner, and roles that may view reports (custom role settings included).
- A department's head sees that department's figures in every tool (owner's decision).

## Registration checks

Each check says what it proves and nothing more (`src/worker/company/verify.ts`); what was checked is stored with the
company and shown under Company checks.

| Detail | Check | What it does not prove |
| --- | --- | --- |
| ABN | The register's check-digit rule (modulus 89). One company account per ABN. With `ABR_GUID` set: looked up on the Australian Business Register (ABR) JSON web service. Must be active; the register's entity name becomes the legal name; entity type, GST date, state and postcode are stored. Name or location differences are shown as warnings. | Without `ABR_GUID`, only that the number is well formed ("format checked"). The maintenance run looks such ABNs up once the GUID is set. |
| ACN | ASIC's check digit; must match the register's ACN when looked up | |
| Email | Sign-up protection: mail servers (MX), disposable and blocked domains. Then a confirmation link, unless it is the owner's own confirmed sign-in address. | Until the link is opened, only that the domain receives mail |
| Phone | The Australian numbering plan: 04 mobile, 02/03/07/08 geographic, 13, 1300, 1800. Numbers ACMA reserves for fiction and runs of one digit are refused. | That the company answers it: there is no SMS provider, so numbers are never called "verified" |
| Address | A street, PO Box or Locked Bag number. The postcode inside Australia Post's ranges for the state. Compared with the register's main business location when looked up. | That the address exists: there is no address-validation provider |

Company accounts are for Australia for now (`country` = `AU`): other countries need their own business-number, phone
and postcode rules.

### Turning on the register lookup

1. Register for an ABR web services GUID (free) at `abr.business.gov.au` (Web services).
2. Set it as the secret `ABR_GUID` on the Fly app `bizomat`, on the `work` process: the owner's step, with the laptop
   tool or `fly secrets set`.
   - Setting a secret restarts the Machines.
   - `fly.website.toml` does not change.
3. Only the ABN is sent to the register, from the server, never from the browser.

## BIZOMAT sign-in for CAD Automation

People who use CAD Automation can sign in there with their BIZOMAT account, so one login reaches every tool. This app
is the sign-in provider: OAuth 2.0 authorization code with PKCE (`src/worker/company/id-provider.ts`).

- **Clients:** configured only, in the secret `BIZOMAT_ID_CLIENTS`:
  `[{"id":"cad","name":"CAD Automation","secretSha256":"<sha256 of the client secret>","redirectUris":["https://bizomat.ai/cad/auth/bizomat/callback"]}]`.
  - Return addresses must match exactly.
  - Codes and tokens are stored as SHA-256 hashes.
- **Authorize:** `https://bizomat.ai/company/authorize?client_id=…&redirect_uri=…&state=…&code_challenge=…&code_challenge_method=S256`.
  - Signed-in people see which application asks and continue or cancel.
  - Signed-out people sign in first.
- **Token:** `POST https://bizomat.ai/company/api/id/token`, with the client secret (Basic or form) and the code
  verifier. Gives a one-hour access token. Each code works once, for 10 minutes.
- **Userinfo:** `GET https://bizomat.ai/company/api/id/userinfo` with `Authorization: Bearer`. Returns `sub`, `email`,
  `email_verified`, `name` and the person's companies.
- **Linking accounts:** CAD Automation should link an existing CAD account only by a confirmed email
  (`email_verified: true`), as it does for Google. Its MCP connectors and paired computers then keep working.

The CAD side (a "Sign in with BIZOMAT" button and its callback) is a change to `kevinjogin/bizomat-cad`, deployed to
the Fly app `cados` from there. Until it is made, CAD Automation keeps its own sign-in.

## Routing

`/company` and `/company/...` go to the work app, like `/tasks`, `/crm` and `/finance`:
- the edge proxy (`COMPANY_PATHS` in `infrastructure/proxy/routes.mjs`);
- the website's Worker (`src/worker.ts`);
- the local stub.

The session cookie is written for `/company` too (`MOUNTS` in `apps/work/src/worker/mount.ts`). A `/company` page
without a cookie goes through `/tasks` once, so an older session carries over. Pages are titled "BIZOMAT Company".

The smoke test checks `/company/api/health`, the page, the carry and 401 without a session. The deploy workflow waits
for `/company/login`.

## Tests

`apps/work/test/company.test.ts` covers:
- the checks (ABN, ACN, phone, postcode, names, the ABR lookup with a stubbed register);
- registration refusals;
- the three tools and their owner;
- one company per ABN and per person;
- linking tools, including refusing personal Finance workspaces and other people's tools;
- invitations with tool roles and departments, and role changes reaching each tool;
- leaving;
- isolation between companies and between roles;
- who sees which figures;
- nested departments, loops refused, archive and restore in every tool;
- ownership transfer in every tool;
- the email confirmation link;
- the sign-in provider (code, PKCE, one use, token, userinfo, nothing stored in the clear);
- the `/company` mount.
