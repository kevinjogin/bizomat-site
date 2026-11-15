# BIZOMAT Billing: Phase 1 plan (discovery and planning)

_Written 15 Nov 2026 on the branch `billing-plan` (from `035e6062`). This is a plan only. No billing code exists, nothing
is deployed, and no call was made to `api.stripe.com` while writing it. Sources are listed at the end ([S1] and so on)._

The owner's brief asks for one central billing engine for BIZOMAT: paid company subscriptions on Stripe, optional usage
charges, and free CAD Automation, free Resources and the free example company kept free. This document covers the
brief's Phase 1 (discovery and planning) and the final deliverables that can be planned now. Building starts with
Phase A below, only after the owner has answered the decisions in section 12.

## Contents

1. Summary
2. Stripe tooling status (planner, CLI, agent setup, account)
3. Discovery: what exists today
4. Architecture
5. The key risks and how the plan answers them
6. Build order: Phases A to D
7. Test plan (the brief's 25 tests)
8. Fly secrets and how they reach the work Machine
9. Credentials the owner must supply
10. Stripe Dashboard configuration (sandbox first)
11. Deployment and rollback
12. Owner decisions
13. Unknowns and things to verify
14. Comparison with the existing implementation
15. Sources

---

## 1. Summary

- **Where billing lives:** in the work app (`apps/work`, the Hono app on Node that serves BIZOMAT ERP, Projects, the CRM,
  Finance and company accounts) on the existing `work` Machine of the Fly app `bizomat`, in its existing SQLite
  database. No new app, Machine, database or volume.
- **Checkout:** Stripe Checkout Sessions with `ui_mode: embedded_page` (the full checkout page embedded in a BIZOMAT ERP
  page on bizomat.ai), `mode: subscription`. Card details go from the browser straight to Stripe inside Stripe's frame;
  BIZOMAT never receives them. See 4.7.
- **Billing management:** BIZOMAT's own page in the ERP (plan, status, invoices, payment method, cancel, change), built on
  the Stripe API. The Stripe-hosted customer portal is not used by default: it runs on Stripe's own address, cannot be
  framed, and cannot change subscriptions that have several products, usage prices or trials [S7].
- **Webhooks:** one endpoint in the work app, `https://bizomat.ai/erp/api/billing/stripe-webhook`, thin events
  (Stripe's recommended format for new integrations [S10]), every event stored once by its event id, then processed by
  fetching the latest object from Stripe.
- **Entitlements:** enforced on the server at the existing access chokepoints (`loadErpAccess`, `loadMtAccess`, and the
  CRM, Finance and Projects organisation checks). Enforcement ships **off**, per module, and is switched on only by the
  owner. Existing companies get a recorded "Founding" grant so nobody is locked out on the day billing ships.
- **Free stays free:** Resources (website, no sign-in), CAD Automation (its own Fly app `cados`) and the example company
  (`sys_demo`) are outside billing by construction; a database trigger refuses a billing account for any example
  company id.
- **Test before live:** the work app accepts a live key only when `STRIPE_ENVIRONMENT=live`, refuses a test key in live,
  and checks `livemode` on every object Stripe returns. A misconfiguration turns billing off; it never stops Projects,
  the CRM or Finance from starting.
- **Biggest blockers (owner):** the legal entity, ABN and GST registration status (needed for tax invoices and for
  activating live payments: the Stripe account shows `charges_enabled: false`, `details_submitted: false`), the
  existing-users transition, the plan-to-module matrix, and replacing this environment's live Stripe key with a sandbox
  key.

## 2. Stripe tooling status

### 2.1 The implementation planner

- The brief asks for the Stripe implementation planner MCP tool. Stripe's MCP documentation names it
  `stripe_implementation_planner`, a tool of the Stripe MCP server at `https://mcp.stripe.com` [S43].
- **It is not available in this session.** No Stripe MCP tool is loaded, so its schema could not be read and nothing
  was submitted to it. This plan does not pretend otherwise. It is the substitute, built from Stripe's official
  documentation and from Stripe's own `stripe-best-practices` skill files (read from disk as reference text) [S48].
- To run the planner later: a new session with the Stripe plugin loaded, the MCP server connected to a **sandbox**
  (OAuth or an agent-tagged restricted key; Stripe MCP stops accepting full-access secret keys and untagged restricted
  keys from December 2026 [S43]), then submit the business context in Appendix A and compare its answer with this plan.

### 2.2 Stripe CLI and agent setup (facts from this session)

| Step in the brief | Result |
| --- | --- |
| Verify the CLI, install if missing | `npm install -g @stripe/cli` installed it. Re-checked while writing this plan: `stripe --version` prints `stripe version 1.55.11` (`/opt/node22/bin/stripe`). Stripe's docs prefer the install script (automatic updates); the npm package is also named in Stripe's skill [S43] [S48]. |
| `stripe agent setup` (Stripe's documented way to install its agent tooling [S44]) | Reported "Detected Claude Code — setting up its Stripe plugin ... 1 installed". On disk: the plugin `stripe@anthropic-plugin-directory`, version `0.11.40-5091f72943e6`, user scope, installed 15 Nov 2026 07:01 UTC. Its skills: `stripe-best-practices`, `upgrade-stripe`, `metronome`, `connect-recommend`, `connect-required-verification-information`, `stripe-apps`, `stripe-directory`, `stripe-docs`, `stripe-pay`, `stripe-projects`; its `.mcp.json` points at `https://mcp.stripe.com`. Skills load only in a new session. |
| Verify the agent skills | Present on disk (above); not loaded in this session. |
| `stripe login` | **Not run.** It needs the owner's browser. Not needed until development against a sandbox starts. |

The plugin's README says it sends skill-usage events to Stripe unconditionally, and that `DISABLE_TELEMETRY=1` or
`DO_NOT_TRACK=1` turns that off. That is an owner choice (section 12).

### 2.3 The owner's Stripe account (read-only calls made earlier in this session)

- Country AU, default currency AUD.
- `charges_enabled: false`, `details_submitted: false`: live payments are not activated yet.
- No products.

### 2.4 Warning: the key saved in this environment is live

- This cloud environment has one network secret for `api.stripe.com` (header `Authorization`), labelled
  "Stripe TEST secret key (sk_test only)". The read-only calls above showed it holds a **live** key.
- The network proxy injects it into **every** request to `api.stripe.com` from this environment, whatever key the code
  sends. An app-side check of its own configured key cannot see this. So: no code, test or CLI command may reach
  `api.stripe.com` from this environment until the owner replaces the value with a sandbox restricted key
  (`rk_test_...`), as section 9 describes.
- Stripe's go-live checklist advises rotating keys that were saved anywhere outside the code during development [S45].
  Rolling the live secret key once it is out of this environment is recommended (owner decision).

## 3. Discovery: what exists today

### 3.1 Existing Stripe code

- `src/server/assessment/stripe.ts` (website): `/api/assessment/stripe-webhook`. It verifies `Stripe-Signature`
  (HMAC-SHA256, 5-minute tolerance) by hand and, for a paid A$195 AUD Checkout Session, emails BIZOMAT a "payment
  verified" notice. It stores nothing and contacts no customer. Routed in `src/worker.ts`; documented in
  `docs/assessment/README.md`, which says no payment is taken on the site.
- `src/node/server.ts` `buildEnv()` copies `STRIPE_WEBHOOK_SECRET` from the process environment into the Worker env.
- **Finding:** on Fly, the web role never receives it. `infrastructure/fly/entrypoint.sh` gives the web role only
  `CF_ACCOUNT_ID CF_AI_TOKEN ANTHROPIC_API_KEY TURNSTILE_SECRET_KEY` and `WEB_*` names, and `buildEnv` reads only the
  unprefixed name. So on Fly the assessment webhook always answers 503 today. If the owner wants it, the web role needs
  `WEB_STRIPE_WEBHOOK_SECRET` mapped to `STRIPE_WEBHOOK_SECRET` (a separate small change, its own webhook destination
  and secret). The billing engine does not reuse this code: it lives in another app with its own secret.
- Nothing else: no Stripe dependency, no plan, subscription, seat or entitlement concept anywhere in `apps/work`
  (searched the migrations and `src/worker`).

### 3.2 Hosting, routing and secrets

- **Fly app `bizomat`** (`fly.website.toml`): three Machines in syd: proxy (256 MB), web (512 MB), work (512 MB), and
  the volume `work_data` on work. Deployed only by `.github/workflows/bizomat-deploy.yml` (by hand, `confirm` =
  `DEPLOY`); its preflight (`.github/scripts/fly-preflight.py`) stops any change to the Machines. The workflow snapshots
  `work_data` before deploying and prints the optional secrets by name only (`flyctl secrets list ... | jq -r` names,
  then a fixed list checked with `grep -qx`).
- **Proxy** (`infrastructure/proxy/routes.mjs`, `decide()`): on bizomat.ai, `/cad` and CAD's root paths go to the Fly
  app `cados`; `/tasks`, `/crm`, `/finance`, `/company`, `/system` and `/erp` go to work; everything else goes to web.
  The website Worker (`src/worker.ts`, `routeApps`) mirrors the same table. Headers starting `x-forwarded-`,
  `x-bizomat-`, `fly-` and `cf-` are stripped from requests; `Stripe-Signature` passes, and bodies stream through
  unchanged.
- **Paths the brief names:** `/pricing/`, `/checkout/`, `/account/...` and `/admin/...` are not application paths, so
  today they would reach the website (web).
- **Secrets to the work Machine** (`infrastructure/fly/entrypoint.sh`, `infrastructure/README.md` "Settings and
  secrets"): Fly secrets reach every Machine, so the entrypoint starts each role with `env -i` and an allow-list. The
  work role takes `WORK_*` names (`pass_prefix`) and maps some to the names the app reads (`map WORK_ABR_GUID ABR_GUID`
  and others). An unprefixed Fly secret never reaches work. A root-owned file `/data/work/.secrets/NAME` is the stronger
  option: only names in the role's `EXACT` list or with the `WORK_` prefix are accepted there.
- **In the app:** `apps/work/src/node/config.ts` copies only listed names (`EMAIL_VARS`, `COMPANY_VARS`) into the Worker
  env; `apps/work/src/worker/env.ts` types them. Billing needs a `BILLING_VARS` list the same way (section 8).
- **Outbound calls:** `apps/work/src/node/outbound.ts` wraps `fetch` so only public addresses are reached;
  `api.stripe.com` is public, so no change is needed.
- **Raw request bodies:** `apps/work/src/node/http.ts` (`toFetchRequest`) streams the request body unchanged (up to
  `WORK_MAX_BODY_BYTES`, 32 MB), and Hono parses nothing by itself, so a handler can read the exact bytes Stripe signed.
- **Cron:** `apps/work/src/node/scheduler.ts` runs `runMaintenance` (`apps/work/src/worker/index.ts`) every 15 minutes:
  the place for the billing event sweep, reconciliation and trial or grace notices.

### 3.3 Authentication and sessions

- `apps/work/src/worker/auth/session.ts`: a session cookie (`__Secure-workos_sid` under a path, scoped to each mount),
  a CSRF token required on every unsafe method, and an Origin check (`requireAuth`). Personal API tokens (`wos_...`)
  also authenticate (`authKind: 'token'`).
- `apps/work/src/worker/mount.ts`: one app, one session, served under `/tasks`, `/crm`, `/finance`, `/company`,
  `/system` and `/erp`; the cookie is written for each of these paths. The tools open inside the ERP at
  `/erp/<tool>`.

### 3.4 Companies, members and roles

| Kind | Table | Who is in it | Notes |
| --- | --- | --- | --- |
| Registered company | `co_companies` (migration `0013_company.sql`) | `co_members`: role `owner`, `admin` or `member`, plus a role per tool | ABN checked by check digits, and on the ABR when `ABR_GUID` is set; `country` is limited to `AU` by a CHECK constraint; one company per ABN; `suspended_at` |
| Own company | `sys_companies` (`0016_system.sql`, filled for every account by `0017_system_everyone.sql`) | its owner only | holds the tools a person owns that no registered company runs; never carries invented details |
| Example company | `sys_demo` (`0019_example_company.sql`) | its owner only | "Acme Studio (example)", invented data, private, no email, built through the app's own API (`apps/work/src/worker/system/example.ts`) |

- A tool belongs to a registered company when `co_tools` links it, otherwise to its owner's own company; the System
  works this out on every request (`companiesFor` in `apps/work/src/worker/system/system.ts`).
- `isExampleSpace()` and `refuseExample()` (409, code `EXAMPLE_COMPANY`) already keep the example company out of
  invitations, email and links.

### 3.5 Platform admins and the console

- `platform_admins` (`0004_founder_admin.sql`; the founder row from `0012_super_admin.sql`), roles `founder` and
  `admin`. `requirePlatformAdmin` (`apps/work/src/worker/services/platform-admin.ts`) answers 404 to everyone else and
  to API tokens; `founderOnly` in `apps/work/src/worker/system/admin.ts` restricts some actions to the founder.
- The console is `/erp/admin` (client `apps/work/src/client/system/SystemApp.tsx`, route `/admin/*`; API under
  `/api/admin/...`). The server does not even serve the admin page to non-admins (`apps/work/src/worker/app.ts`).
- Audit: `auditStmt` (`apps/work/src/worker/services/audit.ts`) writes `audit_log`.

### 3.6 The ERP shell and where entitlements can be enforced

- The module rail (`apps/work/src/client/components/layout/SuiteRail.tsx`): Dashboard, My Work, Sales and CRM, Finance
  and Accounting, Projects and Tasks, Products and Engineering, Maintenance, Operations, Reports, Administration.
- Server chokepoints, each already resolving the company and the person's role:
  - ERP Releases 1 to 5 (products, procurement, inventory, manufacturing, quality, supply chain): `loadErpAccess` and
    `requireErp(c, capability)` in `apps/work/src/worker/erp/access.ts`. Capabilities are named by area
    (`products.*`, `purchasing.*`, `inventory.*`, `manufacturing.*`, `quality.*`, `sales.*` and so on), so each maps
    to one billable module.
  - Maintenance: `loadMtAccess` / `requireMt` in `apps/work/src/worker/maintenance/access.ts`.
  - CRM: `requireOrg` in `apps/work/src/worker/crm/access.ts`; Finance: `requireOrg` and `requireBusiness` in
    `apps/work/src/worker/fin/access.ts`; Projects: the workspace access services.
- Hiding a rail item is display only. The brief's rule "do not activate paid features because a button is hidden" is
  met by checking at these chokepoints.

### 3.7 Finance

- Tables (`0011_finance.sql`, `0015_finance_sales.sql`): `fin_orgs` (kind personal, household or business;
  `gst_registered`, `abn`), `fin_tax_codes` (rate in basis points, BAS labels), `fin_contacts`, `fin_docs` (invoice,
  bill, purchase order, expense claim; `tax_mode` inclusive, exclusive or none), `fin_payments` (recorded, never moved),
  `fin_transactions` (receive, spend, transfer), the ledger with database-enforced balancing.
- `createDoc()` (`apps/work/src/worker/fin/docs.ts`) and `createTransaction()` (`apps/work/src/worker/fin/transactions.ts`)
  are the only writers other modules use (ERP Releases 2 and 5 call `createDoc`; they never write `fin_*` directly).
- GST: `apps/work/src/shared/fin/tax.ts` (`DEFAULT_TAX_CODES`: GST 10%, FRE, EXP and others; `splitTax()` rounds per
  line). `documentTitle()` in `apps/work/src/worker/fin/document.ts` titles an invoice "Tax invoice" only when a
  GST-registered business puts GST on it.
- Finance records payments; it never processes payments, connects to banks or lodges with the ATO (CLAUDE.md). Billing
  keeps that true: Stripe processes payments; Finance only records.

### 3.8 CRM and the company link

- `crm_companies` (`0010_crm.sql`); `co_customer_links` (`0014_company_links.sql`, `apps/work/src/worker/company/links.ts`)
  joins a CRM company to the Finance contact it is billed as, inside one registered company.
- These are a customer's own customer records. BIZOMAT's own customer list would need a company that is BIZOMAT itself
  (section 4.14).

### 3.9 Email

- `apps/work/src/worker/services/email/outbox.ts`: every email is written to `email_outbox` with a unique idempotency
  key, then sent through Brevo within a daily limit (default 250, with a reserve for critical templates). Templates in
  `templates.ts`. Billing notices go through it with keys such as `billing:payment_failed:<invoice id>`.

### 3.10 Content Security Policy and Permissions-Policy

- **Work app** (`apps/work/src/worker/app.ts`, `CSP`): `script-src 'self'`, `frame-src 'self' blob:`,
  `connect-src 'self' wss: ws:`, `img-src 'self' data: blob: https:`; `Permissions-Policy` includes `payment=()`;
  `Cross-Origin-Opener-Policy: same-origin`. A response that already carries a CSP keeps it.
- **Website** (`scripts/postbuild.mjs`): one hash-based CSP for every page, `payment=()` too.
- **What Stripe needs** [S8]:

  | Directive | Stripe.js (Elements, embedded Checkout) | Checkout | Link |
  | --- | --- | --- | --- |
  | `script-src` | `https://js.stripe.com https://*.js.stripe.com` (`https://maps.googleapis.com` only with the Address Element and an own Maps key) | `https://checkout.stripe.com` | |
  | `frame-src` | `https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com` (the last for 3D Secure and redirects) | `https://checkout.stripe.com` | `https://link.com https://*.link.com` |
  | `connect-src` | `https://api.stripe.com` | `https://checkout.stripe.com` | `https://link.com https://*.link.com` |
  | `img-src` | | `https://*.stripe.com` | `https://*.link.com` |

  Stripe.js must be loaded from `js.stripe.com`, never bundled or self-hosted [S3]. Stripe does not support
  cross-origin isolated pages [S8]; the work app is not cross-origin isolated (it sets COOP, not COEP).

### 3.11 What the brief mentions that does not exist

- **WHS:** no work health and safety module exists in the repository (only Maintenance prestart checks and
  inspections). Pricing must not claim WHS.
- **"Sites":** there is no single site concept. Maintenance has `mt_sites` (`0024_maintenance_m2_m3.sql`) and Inventory
  has `erp_warehouses`. What a billable site is must be decided (section 12).
- **International companies:** company accounts accept Australia only (`co_companies.country` CHECK).

## 4. Architecture

### 4.1 Where billing lives and why

The work app already holds the accounts, sessions, companies, roles, Finance, the CRM, the cron and the email outbox,
all in one database. Billing there needs no cross-app calls and no new infrastructure, and it keeps one place for
entitlement decisions. The website keeps only public pages (`/pricing/`) and redirects. CAD Automation is untouched.

```
 browser (bizomat.ai)
   |-- /pricing/ (web: static page, prices read from the work app's public plan list)
   |-- /erp/billing/... (work: pages, embedded Checkout, Stripe.js from js.stripe.com) --> card data --> Stripe
   |
 work app (apps/work, Fly Machine "work", db.sqlite on work_data)
   billing module --> api.stripe.com (secret restricted key, server only)
   webhook  <-- Stripe thin events: https://bizomat.ai/erp/api/billing/stripe-webhook
   entitlements --> ERP, Maintenance, CRM, Finance, Projects chokepoints
   cron (15 min) --> event sweep, reconciliation, notices
```

### 4.2 Code layout (Phase A unless noted)

| Path | What |
| --- | --- |
| `apps/work/migrations/0027_billing.sql` | The billing tables (4.5), additive |
| `apps/work/src/worker/billing/config.ts` | Reads and checks `STRIPE_*`; returns a working config or a reason billing is off (never a key value) |
| `apps/work/src/worker/billing/stripe.ts` | The one Stripe client: `stripe` npm package (v23.1.0, zero dependencies, no install scripts, pins API `2026-10-28.endive`), fetch HTTP client so it runs on Node and workerd, request timeout, retries, idempotency keys, and the `livemode` guard on every response |
| `.../billing/catalog.ts` | Plans, add-ons and prices; optional seeds from `STRIPE_PRICE_*`; verification against Stripe |
| `.../billing/accounts.ts` | One billing account (one Stripe Customer) per company and environment |
| `.../billing/checkout.ts` | Checkout Sessions (create, status, expire), payment-method update sessions |
| `.../billing/subscriptions.ts` | Sync from Stripe, preview and change, cancel, reactivate |
| `.../billing/invoices.ts` | Invoice and payment mirror, list, PDF download through the server |
| `.../billing/webhook.ts`, `events.ts` | Receive, verify, store; process with claims, retries and dead letters |
| `.../billing/entitlements.ts`, `companies.ts` | Decisions, enforcement modes, grants, shadow log; tool-to-company resolution |
| `.../billing/admin.ts`, `refunds.ts` | Console API; founder-only money actions |
| `.../billing/usage.ts` | Phase B |
| `.../billing/metrics.ts`, `reconcile.ts`, `finance-link.ts` | Phase C |
| `apps/work/src/shared/billing/` | Module keys, statuses, money display shared with the client |
| `apps/work/src/client/billing/` | The pages in 4.3 |

### 4.3 Pages and addresses

| Address | Served by | What |
| --- | --- | --- |
| `/pricing/` | web (Astro page) | Public. Four plans, monthly and annual, features, user and site allowances, free CAD, free Resources, the example company, FAQ, "Start" buttons into the ERP. Prices fetched at run time from `GET /erp/api/billing/public/plans`, so the admin catalogue is the one source. Built only after entitlements are implemented and tested (brief, Phase 14). Adding it to the navigation needs the owner's request (CLAUDE.md). |
| `/checkout/` | web: `public/_redirects` 302 | to `/erp/billing/checkout` (query kept; to verify in `src/node/assets.ts` tests) |
| `/account/billing/` | web: 302 | to `/erp/billing` |
| `/account/subscription/` | web: 302 | to `/erp/billing/subscription` |
| `/admin/billing/` | web: 302 | to `/erp/admin/billing` |
| `/erp/billing`, `/erp/billing/subscription` | work | Pick the company (only those the person may manage), then `/erp/c/<company>/billing` or `.../billing/subscription` |
| `/erp/c/<company>/billing` | work | Plan, status, next renewal, frequency, included and used users and sites, usage, payment method (brand and last four digits only), billing address, tax details, invoices (Stripe invoices), payments and receipts, refund requests |
| `/erp/c/<company>/billing/subscription` | work | Change plan or frequency (with the proration preview), add-ons, cancel at period end, reactivate |
| `/erp/billing/checkout?plan=&interval=` | work | Choose or create the company, confirm billing details, embedded Checkout, then the return page |
| `/erp/billing/checkout/return?session_id=` | work | Asks the server for the session's status; the server retrieves it from Stripe and syncs. Never trusts the browser. |
| `/erp/admin/billing/...` | work | Console (4.4, admin) |

Why redirects rather than new proxy paths: a new application path would need entries in `routes.mjs`, `src/worker.ts`,
`mount.ts` (one more cookie path) and the tests that keep them equal. Redirects into `/erp` reuse the session that
already exists there. If the owner wants the brief's addresses to serve the pages themselves, that is the alternative.

Stripe's CSP entries (3.10) apply only to billing documents: the server adds them to HTML responses under
`/billing/` and `/c/<company>/billing`, and links into billing pages load a full page (not a client-side route change),
so the document's CSP is the billing one. Every other ERP page keeps `script-src 'self'`.

### 4.4 API routes (inside the work app; reachable as `/erp/api/...`)

Public (registered before the authenticated `/api` routes, like `/api/email-webhooks`):

| Method and path | What |
| --- | --- |
| `POST /api/billing/stripe-webhook` | Signature-checked; 503 when billing is not configured, 400 on a bad signature or wrong `livemode`, 200 once stored |
| `GET /api/billing/public/plans` | Published plans with display prices for the current environment; cacheable |

Signed in (session only for anything that spends or changes money; API tokens get 403):

| Method and path | Who | What |
| --- | --- | --- |
| `GET /api/billing/config` | anyone signed in | `{ enabled, environment, publishableKey, audience }` (the publishable key is fetched at run time, never built into the client) |
| `GET /api/billing/companies` | anyone | Companies the person may bill: owner or admin of a registered company; their own company |
| `GET /api/billing/companies/:company` | owner, admin | Summary, entitlements, allowances, usage |
| `POST .../:company/checkout-session` | owner, admin | `{ planId, interval, addons }` → `{ clientSecret }`. Refused (409) for an example company, for a company with a subscription that is not ended (use change instead), and while billing is off |
| `GET /api/billing/checkout-sessions/:id/status` | creator | Server-side retrieve and sync |
| `POST .../:company/payment-method-session` | owner, admin | Checkout `mode: setup`, embedded → `{ clientSecret }` |
| `GET .../:company/invoices`, `GET .../:company/invoices/:id/pdf`, `GET .../:company/payments` | owner, admin | From the local mirror; the PDF streamed by the server |
| `POST .../:company/subscription/preview` and `/change` | owner, admin | Preview with `invoices.create_preview` [S29], then apply with the same parameters |
| `POST .../:company/subscription/cancel` and `/reactivate` | owner, admin | Cancel at period end; undo before the end |
| `PATCH .../:company/billing-details` | owner, admin | Billing name, email, address, tax ID (to the Stripe Customer) |
| `POST .../:company/refund-requests` | owner, admin | A request only; the founder decides |
| `GET /api/billing/entitlements?company=` | members | For the client to show or hide; the server decides independently |

Admin (`/api/admin/billing/...`, behind `requirePlatformAdmin`; marked actions founder-only, every action audited):
overview and metrics; customers; subscriptions; invoices; payments; refunds and refund requests; events (with failed
and dead filters) and "Reprocess"; "Reconcile with Stripe"; the plan catalogue (plans, add-ons, prices, "Verify price
in Stripe"); founder-only: refund, credit note, customer credit, cancel a subscription, apply a coupon, grants, the
enforcement switches and the billing audience.

### 4.5 Data model: migration `0027_billing.sql` (additive)

Numbering: 0026 is taken by BIZOMAT WHS Release 1 (`0026_whs_core.sql`, built in parallel); billing takes the next free number when it is built.

New tables, indexes and one trigger only; no existing table, column or row changes, so the previous image runs on the
migrated database (as `0013`, `0016`, `0019` and `0025` say of themselves). SQLite and D1 compatible. No foreign keys to `co_companies`
or `sys_companies` from the company columns (they name either table), so a company's soft delete never removes billing
history.

| Table | Key columns |
| --- | --- |
| `billing_settings` | `key` PK, `value`, `updated_by`, `updated_at`. Holds `audience` (`off`, `admins`, `everyone`; default `off`) and other switches the founder flips without a deploy |
| `billing_products` | `id` PK (`essentials`, `business`, `manufacturing`, `enterprise`, `extra_user`, `extra_site`, `module:<key>`, `usage:<meter>`), `kind` (`plan`, `addon`, `usage`), `name`, `description`, `status` (`draft`, `published`, `retired`), `sort_order`, `included_users`, `included_sites`, `modules_json` (module keys), `limits_json`, `trial_days`, `created_by`, `created_at`, `updated_at` |
| `billing_prices` | `id` PK, `product_id`, `environment` (`test`, `live`), `interval` (`month`, `year`), `usage_type` (`licensed`, `metered`), `currency` (`aud`), `unit_amount` (cents), `tax_behavior` (`inclusive`, `exclusive`), `stripe_product_id`, `stripe_price_id`, `stripe_meter_id`, `source` (`admin`, `env_seed`), `verified_at`, `active`, `created_by`, timestamps. UNIQUE (`environment`, `stripe_price_id`); partial UNIQUE (`product_id`, `environment`, `interval`, `currency`) WHERE `active = 1` |
| `billing_accounts` | `id` PK, `company_kind` CHECK IN (`registered`, `own`), `company_id`, `environment`, `stripe_customer_id` UNIQUE, `billing_email`, `legal_name`, `country`, `created_by`, timestamps. UNIQUE (`company_kind`, `company_id`, `environment`). A `BEFORE INSERT` and `BEFORE UPDATE` trigger aborts when `company_id` is any `sys_demo.company_id`, so an example company can never have one, whatever kind the code passes |
| `billing_checkout_sessions` | `id` PK (`cs_...`), `account_id`, `price_ids_json`, `status` (`open`, `complete`, `expired`), `subscription_id`, `created_by`, `created_at`, `expires_at` |
| `billing_subscriptions` | `id` PK (`sub_...`), `account_id`, `environment`, `status` (Stripe's), `plan_product_id`, `interval`, `current_period_start`, `current_period_end`, `trial_start`, `trial_end`, `cancel_at_period_end`, `canceled_at`, `ended_at`, `past_due_since`, `latest_invoice_id`, `pm_brand`, `pm_last4`, `pm_exp`, `synced_at` |
| `billing_subscription_items` | `id` PK (`si_...`), `subscription_id`, `price_id`, `product_id`, `quantity` |
| `billing_invoices` | `id` PK (`in_...`), `account_id`, `subscription_id`, `number`, `status`, `currency`, `subtotal`, `tax`, `total`, `amount_paid`, `amount_remaining`, `period_start`, `period_end`, `hosted_invoice_url`, `invoice_pdf`, `tax_json` (Stripe's tax amounts and taxability reasons), `created`, `finalized_at`, `paid_at`, `synced_at` |
| `billing_payments` | `id` PK, `invoice_id`, `charge_id`, `status`, `amount`, `amount_refunded`, `currency`, `method_type`, `brand`, `last4`, `receipt_url`, `failure_code`, `failure_message`, `created`, `synced_at` (brand, last four digits and expiry are allowed to be stored [S8]; never the card number or CVC) |
| `billing_refunds`, `billing_credit_notes` | Mirrors of `re_...` and `cn_...` with `invoice_id`, `amount`, `status`, `reason`, `requested_by`, `approved_by` |
| `billing_refund_requests` | `id`, `account_id`, `invoice_id`, `reason`, `status` (`open`, `approved`, `declined`, `refunded`), `requested_by`, `decided_by`, timestamps |
| `billing_events` | `id` PK (`evt_...`), `livemode`, `type`, `object_type`, `object_id`, `stripe_created`, `received_at`, `status` (`received`, `processing`, `processed`, `ignored`, `failed`, `dead`), `attempts`, `next_attempt_at`, `lease_until`, `last_error` (sanitised, 300 characters), `processed_at`. Index (`status`, `next_attempt_at`) |
| `billing_operations` | Outbound intent log: `id`, `account_id`, `kind`, `idempotency_key` UNIQUE, `request_hash`, `status`, `stripe_object_id`, `error`, `actor_id`, timestamps. A double click or retry reuses the same key [S34] |
| `billing_grants` | `id`, `company_kind`, `company_id`, `kind` (`founding`, `comp`, `manual`), `modules_json` (`["*"]` for all), `limits_json`, `starts_at`, `ends_at` (NULL: until the owner sets a date), `reason`, `granted_by`, `created_at`, `revoked_at`, `revoked_by` |
| `billing_enforcement` | `module` PK, `mode` (`off`, `shadow`, `on`), `changed_by`, `changed_at`, `note`. Every module starts `off` |
| `billing_shadow_denials` | (`day`, `company_kind`, `company_id`, `module`) PK, `count`: what enforcement would have refused |

Phase B adds `0027_billing_usage.sql`: `billing_meters`, `billing_usage_events` (`idempotency_key` UNIQUE),
`billing_usage_counters` (company, meter, period), `billing_usage_consents` (who accepted which disclosure version,
when, from where), `billing_usage_thresholds`. Phase C adds `0028_billing_reconciliation.sql`: `billing_finance_links`
(Stripe object id to the Finance record made from it, UNIQUE per Stripe id), `billing_payouts`, and daily metric
snapshots. Each is additive.

Audit: admin and money actions write `audit_log` through `auditStmt` (`billing.*` actions), never with card data,
secrets or full request bodies.

### 4.6 How BIZOMAT records map to Stripe objects

| BIZOMAT | Stripe | Rule |
| --- | --- | --- |
| A company (registered or own) in one environment | one Customer (`cus_...`) | Made at the first checkout or billing-details save, after claiming the local row; metadata `bizomat_company_id`, `bizomat_company_kind` as a fallback only. Events are resolved through Stripe's object graph (customer id to account), not through metadata [S48]. Customers v1, not Accounts v2 (public preview for non-Connect users [S37]) |
| A plan | one Product per plan, with a monthly and an annual Price | One Product per plan so invoices name the plan; several Prices only for frequencies or currencies of the same plan [S48] |
| Additional users, additional sites | an add-on Product each, per-unit Prices (quantity) | |
| Module add-ons | a Product each | |
| A company's subscription | one Subscription (`sub_...`), `billing_mode` flexible (the default from API `2025-09-30.clover`) [S28] | One active subscription per company, checked before checkout |
| Trials | free trial period: `subscription_data.trial_period_days` | Stripe's newer Trial Offers do not work with Checkout Sessions outside a private preview [S26] [S27] |
| Discounts and promotion codes | Coupons and Promotion codes; `allow_promotion_codes` on Checkout [S2] | Made in the Dashboard or by the founder in the console |
| Admin adjustments | credit notes, customer balance credits, refunds | Founder only, audited |

### 4.7 The checkout choice

Stripe now offers three payment UIs on the Checkout Sessions API [S1] [S2]. API version `2026-10-28.endive` names the
`ui_mode` values `hosted_page` (default), `embedded_page`, `form` and `elements`. (The brief's "embedded or custom"
are older names of the same ideas.)

| Option | For BIZOMAT |
| --- | --- |
| `hosted_page` | Redirects to a Stripe address. Fails "payments stay on bizomat.ai". |
| **`embedded_page`** (recommended) | Stripe's full checkout page inside a BIZOMAT ERP page. Stripe marks the full page "Recommended". Built-in support for Billing, Tax, Link, dynamic payment methods, trials, discounts and promotion codes, with the full order summary; low maintenance; customised through brand settings [S1] [S3]. Mounted with `stripe.createEmbeddedCheckoutPage({ fetchClientSecret })` [S3]. |
| `form` (embedded form) | One iframe, more styling (Appearance API, about 70 settings), but a limited order summary [S1] [S5]. A fallback if the owner wants a closer BIZOMAT look. |
| `elements` (Checkout Sessions with the Payment Element) | Full CSS control, but no order summary (BIZOMAT builds it), the most maintenance, and no trial offers [S1] [S4] [S27]. Not needed. |
| Payment Element with the Subscriptions API | More code; Stripe recommends Checkout Sessions instead unless asked [S6]. Not recommended. |

Session parameters (Phase A): `mode: subscription`; `ui_mode: embedded_page`; `customer` (existing or just made);
`line_items` from the catalogue (never from the browser); `return_url` with `{CHECKOUT_SESSION_ID}`;
`subscription_data.trial_period_days` when the plan has a trial; `allow_promotion_codes`; `billing_address_collection:
required`; `tax_id_collection` (B2B and reverse charge need the customer's tax ID [S48]); `customer_update` for name and
address; `automatic_tax` **only after** an active registration is confirmed (section 4.13); `client_reference_id` (the
company id); `integration_identifier` (API `2026-03-25.dahlia` or later [S48]); `consent_collection` for the terms of
sale once the owner has them; no `payment_method_types` (dynamic payment methods, chosen in the Dashboard [S48]).

Access is granted by the server only: from the webhook, or from the return page's status request, which retrieves the
session and subscription from Stripe on the server. A success page or a browser message never grants anything.

### 4.8 Billing management

- BIZOMAT's own page (4.3) covers every item of the brief's `/account/billing/` list.
- Plan changes: preview with `invoices.create_preview`, show the amount, then apply [S29]. Upgrades apply now with
  proration; downgrades take effect at the period end (owner decision, section 12).
- Payment method update: an embedded Checkout session in `setup` mode, then set the new method as both the customer's
  invoice default and the subscription's default, because Stripe keeps retrying on the subscription's own default if
  only the customer's changes [S30].
- An open invoice after a failed payment: pay it from BIZOMAT's page with the updated method (`invoices.pay` on the
  server; when the bank asks for authentication, Stripe.js completes it on the same page). To verify in the sandbox.
- Invoice PDFs are streamed through BIZOMAT's server so the person stays on bizomat.ai; Stripe's hosted invoice link is
  offered as a secondary "View at Stripe".
- The Stripe-hosted customer portal stays off. If the owner wants it as a fallback, it can be enabled later; it leaves
  bizomat.ai and only cancels subscriptions with several products or usage prices [S7].

### 4.9 Webhooks

- **Endpoint:** `POST https://bizomat.ai/erp/api/billing/stripe-webhook` (proxy: `/erp` to work; inside the app
  `/api/billing/stripe-webhook`, registered before the authenticated routes, so neither the session nor the CSRF check
  applies, as Stripe advises for webhook routes [S9]).
- **Format:** thin events, which Stripe recommends for new integrations: unversioned, typed in the SDK, and the handler
  fetches the latest state [S10]. That also answers ordering: Stripe does not guarantee order, and `created` must not
  be used to order events [S9]; fetching the current object each time makes every event a "sync this object" request.
- **Raw body:** read with `arrayBuffer()` before anything else touches it; verify with
  `stripe.parseEventNotificationAsync(body, signature, secret)` (stripe-node 23.1.0). Any change to the body breaks the
  signature [S9]. During a secret roll, both the current and the previous secret are tried (Stripe signs with each
  active secret for up to 7 days [S9]).
- **Checks before storing:** valid signature within the tolerance; `livemode` equals the configured environment.
- **Store, then answer:** `INSERT OR IGNORE INTO billing_events` keyed by the event id, then 200 at once. A duplicate
  delivery finds the row and gets 200 without processing again [S9]. Answering quickly matters: if `invoice.created`
  gets no 2xx, Stripe delays finalising invoices by up to 72 hours [S12].
- **Processing:** right after storing (in the background) and by the 15-minute sweep. A row is claimed with a
  conditional update and a lease, so two runs never process it together. The handler fetches the related object and
  upserts the local mirror keyed by the Stripe object id. Failures back off; after 8 attempts the row is `dead`, the
  console shows it, and the founder gets one notice. "Reprocess" re-queues it.
- **Recovery:** Stripe retries live deliveries for up to three days (sandbox: three times over a few hours); the
  Dashboard resends for 15 days and the CLI for 30; the Events API keeps 30 days [S9] [S10]. A daily reconciliation
  lists recently updated subscriptions and invoices and syncs any that differ, so a missed event is repaired even after
  those windows.
- **Duplicate subscriptions:** prevented before checkout (one open session per company; earlier open sessions are
  expired; a company with a live subscription goes to "change"). If Stripe still reports a second live subscription
  for one customer, it is flagged in the console and the founder decides; nothing is cancelled automatically.
- **Events subscribed** (thin, `v1.` prefix [S11]): `checkout.session.completed`, `.async_payment_succeeded`,
  `.async_payment_failed`, `.expired`; `customer.subscription.created`, `.updated`, `.deleted`, `.trial_will_end`,
  `.paused`, `.resumed`, `.pending_update_applied`, `.pending_update_expired`; `invoice.created`, `.finalized`,
  `.finalization_failed`, `.paid`, `.payment_failed`, `.payment_action_required`, `.marked_uncollectible`, `.voided`;
  `payment_intent.succeeded`, `.payment_failed`; `charge.refunded`, `refund.created`, `refund.updated`, `refund.failed`;
  `charge.dispute.created`, `.closed`; `radar.early_fraud_warning.created` (Stripe's skill says a subscription
  integration is not complete without the refund, dispute and fraud-warning events [S48]); `customer.updated`,
  `customer.tax_id.created`, `.updated`, `.deleted`; `credit_note.created`, `.voided`. Phase B adds
  `billing.meter.error_report_triggered` and `billing.meter.no_meter_found`; Phase C adds `payout.paid`, `payout.failed`.
- **IP allowlisting:** Stripe recommends it as well as signatures [S9]. Fly's edge and the proxy hide the client
  address unless the proxy forwards it; Phase A relies on signatures and records the forwarded address for review.
  Allowlisting against Stripe's published webhook ranges [S46] is a Phase A option if the proxy's client-IP mode makes
  the address trustworthy.

### 4.10 Entitlements and enforcement

- **Subject:** a company. A tool's company: `co_tools` link → registered company; `sys_demo` ids → example company;
  otherwise its owner's own company (the rule `companiesFor` already uses). Personal and household Finance workspaces
  belong to no company and are not gated unless the owner decides otherwise.
- **Module keys:** `tasks`, `crm`, `finance`, `maintenance`, `products` (Products and Engineering records; the CAD
  Automation set-up and computers page stays free), `procurement`, `inventory`, `manufacturing`, `quality`,
  `supply_chain`; limits `users` and `sites`. ERP capabilities map by prefix (`products.*`, `changes.*`, `documents.*`
  → products; `suppliers.*`, `product_suppliers.*`, `requisitions.*`, `purchasing.*`, `receiving.*` → procurement;
  `inventory.*` → inventory; `manufacturing.*`, `routings.*`, `production.*`, `mrp.*` → manufacturing; `quality.*`,
  `capa.*` → quality; `sales.*`, `shipping.*`, `carriers.*`, `returns.*` → supply_chain). Reports, roles and settings
  are never gated.
- **Decision order** (one function, cached per request):
  1. Example company: allowed (never billed).
  2. The module's enforcement mode is `off`: allowed.
  3. An active grant (founding, comp, manual) covers the module: allowed.
  4. Subscription `trialing` or `active` whose plan or add-ons include the module: allowed.
  5. `past_due`: allowed until `past_due_since` plus the grace days, with a banner.
  6. Otherwise, in `shadow` mode: allowed and counted in `billing_shadow_denials`; in `on` mode: reads allowed
     (read-only), writes refused with 402 and code `PLAN_REQUIRED`. Data is never deleted or hidden by billing.
- **Users and sites:** checked when a person is added (company invitation, tool invitation) or a site is created. In
  `on` mode an addition over the allowance is refused with a prompt to add users or sites; nothing is charged without
  the owner of the company accepting the price (owner decision).
- **Stripe Entitlements:** not used at first. BIZOMAT's own catalogue already has to express grants, the example
  company and enforcement modes, which Stripe cannot.

### 4.11 The plan catalogue

- `billing_products` and `billing_prices` are the only map from BIZOMAT plan ids to Stripe Product and Price ids, per
  environment (sandbox objects cannot be used in live [S45]). Edited in `/erp/admin/billing` by platform admins;
  publishing, retiring and price links are founder-only.
- Linking a price: the admin pastes a `price_...` id; the server retrieves it and checks currency, interval, amount,
  tax behaviour, active, the product, and `livemode` against the environment before saving.
- `STRIPE_PRICE_ESSENTIALS_MONTHLY` and the other seven names are optional seeds: read at start-up, used only to fill an
  empty slot, verified the same way, marked `source = env_seed`, and never overwrite an admin's choice.
- No Price id appears in code. A test fails if a `price_` literal appears outside test fixtures.
- Retired prices stay linked to existing subscriptions; customers move only by an explicit change.

### 4.12 Test and live safety, secrets and logs

| Setting | Rule |
| --- | --- |
| `STRIPE_ENVIRONMENT` | Exactly `test` or `live`. Missing or anything else: billing off |
| `STRIPE_SECRET_KEY` | test: `rk_test_` or `sk_test_`; live: `rk_live_` or `sk_live_`. A mismatch: billing off with the reason "live key in test" or "test key in live". Restricted keys recommended [S31] |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_` for test, `pk_live_` for live |
| `STRIPE_WEBHOOK_SECRET` | `whsec_`; without it the webhook answers 503 |
| Every Stripe response | `livemode` must equal the environment, or the request is treated as failed and the founder is notified. This also catches a key swapped in by a network proxy (2.4) |
| Every webhook event | `livemode` must equal the environment |

- "Billing off" means billing pages and routes say it is not available, and the webhook answers 503. Projects, the CRM,
  Finance and the ERP keep working. Refusing to start the whole app would lock everyone out (risk 1).
- Start-up logs say only `billing: on|off`, the environment, the key kind (`rk` or `sk`) and the reason when off. Never
  a key, secret or price id. Keys live only in Fly secrets or the work volume's secret files, are rotated on a schedule,
  and Stripe's request logs are reviewed for misuse, as Stripe's key guide advises [S32].
- Error messages are passed through a redaction step that removes anything shaped like `sk_`, `rk_`, `whsec_` or a
  `Bearer` token before `recordError` or the console sees it.
- The client never receives a secret: a test builds the client and fails on `sk_`, `rk_` or `whsec_` in `dist/client`,
  as `scripts/postbuild.mjs` already does for the website.
- Only the work role gets `STRIPE_*`; `infrastructure/local/check-isolation.sh` is extended to prove web, proxy and cad
  do not.

### 4.13 Tax and GST

- **Stripe Tax and Australia:** a business based in Australia can use Stripe Tax; Australian GST is supported for all
  product tax codes [S13] [S14]. When the business and the customer are both in Australia, Stripe calculates GST unless
  the sale is exempt or zero-rated [S14].
- **Registration first:** Stripe calculates tax only where an active registration is recorded; without one it returns
  zero with no error [S3] [S48]. So `automatic_tax` is turned on only after the owner confirms BIZOMAT's GST
  registration and it is recorded in Stripe (Tax > Locations).
- **If BIZOMAT is not registered for GST:** no GST is charged and Stripe's invoices are ordinary invoices, not tax
  invoices. Stripe's threshold monitoring can still be watched.
- **Inclusive or exclusive:** set per Price and **cannot be changed** once set to inclusive or exclusive [S15]. Stripe
  recommends the default tax behaviour "Automatic", which makes AUD prices inclusive [S15]. Example at the proposed
  prices:

  | Plan | A$ price as GST-inclusive (GST in it) | A$ price as GST-exclusive (total with GST) |
  | --- | --- | --- |
  | Essentials A$59 | 59.00 (GST 5.36) | 64.90 |
  | Business A$149 | 149.00 (GST 13.55) | 163.90 |
  | Manufacturing A$349 | 349.00 (GST 31.73) | 383.90 |
  | Enterprise A$799 | 799.00 (GST 72.64) | 878.90 |

- **Product tax code:** a candidate from Stripe's list is `txcd_10103001`, "Software as a service (SaaS) - business use"
  [S16]. The owner or their accountant confirms it; this plan does not choose a legal classification.
- **Customers' ABNs:** a registered company's ABN is sent to its Stripe Customer as tax ID type `au_abn`. Stripe
  validates ABNs with the ABR, but not the name, address or GST status [S17]. BIZOMAT shows that as Stripe's check and
  keeps its own rule: an ABN is "confirmed with the register" only when BIZOMAT's own lookup ran with `ABR_GUID`.
- **BIZOMAT's own ABN on invoices:** added once as an account tax ID in Settings > Billing > Invoice template > Tax, and
  set as default; it then shows on every invoice and credit note PDF; it cannot be changed after an invoice is finalised
  [S18].
- **Tax invoice wording:** the Stripe pages read for this plan do not say whether an Australian account's invoice PDF is
  titled "Tax invoice". To verify on a sandbox invoice before launch, with the owner's accountant checking every
  required element against the ATO's tax invoice rules (the ATO page could not be read from this session: it answered
  403).
- **Not every customer is Australian or GST-registered:** Stripe Tax decides by the customer's location, whether they are
  a business (a valid tax ID) and BIZOMAT's registrations [S14]; for cross-border B2B sales without a valid tax ID it
  treats the sale as B2C [S48]. Overseas registration duties are the owner's and their adviser's call; Stripe flags
  possible obligations under Tax > Locations > Needs attention [S14].
- **Cost:** Stripe Tax fees apply only once at least one registration is added [S49]. Stripe's pricing page (as served
  to this session, apparently in US terms) lists 0.5% per transaction where registered for no-code integrations
  (Billing, Checkout, Invoicing, Payment Links) [S20]. Australian pricing to confirm in the Dashboard. The alternative is
  Tax Rates, a free feature where BIZOMAT defines a fixed rate (10% GST for Australian customers) and Stripe maintains
  nothing [S49]: cheaper, but no threshold monitoring and no other countries.
- **Currencies:** AUD only at launch. Other currencies later through per-currency prices on the same Price.

### 4.14 Finance and CRM: reconciliation without duplicate invoices

The documents are kept apart and labelled so:

| Document | Issued by | Where it shows |
| --- | --- | --- |
| Stripe invoice (subscription) | Stripe; a tax invoice only if set up so (4.13) | The company's billing page; Stripe's email |
| Stripe payment receipt | Stripe (`receipt_url`) | Payments list |
| BIZOMAT sales invoice | BIZOMAT Finance (`fin_docs` kind invoice) for anything else BIZOMAT sells | Finance only |
| Tax invoice from BIZOMAT Finance | `documentTitle()` when GST applies | Finance only |

- **Rule:** BIZOMAT Finance never issues an invoice for a charge Stripe already invoiced.
- **BIZOMAT's own books (Phase C, owner decision):** if the owner designates a Finance business workspace as BIZOMAT's
  books, each paid Stripe invoice becomes a posted Finance *receive* transaction into a "Stripe clearing" money account
  (`createTransaction`, net and GST taken from Stripe's amounts, reference the Stripe invoice number); Stripe fees a
  *spend*; each payout a *transfer* from clearing to the bank account; refunds a *spend* or reversal. One record per
  Stripe object id (`billing_finance_links`), so a replay never doubles it. No `fin_docs` invoice is made, so no second
  tax invoice exists.
- **The customer's own books (Phase C, optional):** "Add to my Finance" makes a draft *bill* in the customer's Finance
  business workspace through `createDoc`, reference the Stripe invoice number; never posted or emailed automatically;
  once per invoice.
- **CRM:** the billing account takes its name, email and address from the registered company (`co_companies`), never
  copied into another record. If BIZOMAT's own company runs a CRM organisation, Phase C can keep a CRM company per
  paying customer, linked by the Stripe customer id. Both need the owner to designate BIZOMAT's own company (which also
  needs the legal entity and ABN).

### 4.15 Usage billing (Phase B)

- **Stripe's current guidance:** Metronome is Stripe's recommended platform for new usage-based billing; Billing Meters
  remain fully supported as a lower-level option [S21] [S22] [S23]. The comparison table shows Meters with full support
  for Checkout and the Dashboard, and Metronome with limited Checkout support and none for Connect or the Dashboard
  [S22]. The brief asks for Meters. **This is an owner decision**; the plan keeps a provider-neutral usage ledger so
  either can be used.
- **BIZOMAT's ledger:** each billable event is recorded once in `billing_usage_events` with a unique idempotency key
  made by its source (for example `erp:<company>:<record id>`). Counters per company, meter and billing period;
  allowances from the plan; thresholds with one notice per threshold per period. Stripe's own usage alerts exist too
  (up to 25 per meter and customer; billing thresholds do not apply during trials) [S25]; BIZOMAT's notices do not
  depend on them.
- **Sending to Stripe (if Meters):** `billing/meter_events` with `identifier` = the ledger row id (Stripe enforces
  uniqueness for at least 24 hours [S24]); timestamps within the past 35 days [S24]; retries reuse the identifier;
  Stripe aggregates asynchronously, so displayed totals come from BIZOMAT's ledger, labelled as such [S23].
- **No charge without disclosure and acceptance:** a usage price is billed only after (1) the founder publishes it with
  its disclosure text, (2) the company's owner or an admin accepts that version (recorded in `billing_usage_consents`),
  and (3) the usage item is added to the subscription. Before that, usage is shown as "counted, not billed".
- **Never metered:** anything public (Resources, AI search on the website), the example company, CAD Automation (free;
  its usage lives in the `cados` app and repository).

### 4.16 Connect, Terminal and Identity (Phase D, off)

| Product | Status in this plan | Needed before it can be enabled |
| --- | --- | --- |
| Connect (for platforms and marketplaces that move money between parties [S42]) | No code paths, no routes, no keys with Connect permissions | A business model (marketplace, provider payments, commissions), who is merchant of record, liability (Stripe's skill calls Standard accounts the safer default), onboarding by Stripe-hosted pages, tax liability, a separate event destination for connected accounts, terms for providers, Stripe's eligibility for the platform. Never used for BIZOMAT's own subscriptions (brief) |
| Terminal | Not built | Readers available in Australia include BBPOS WisePOS E, Stripe Reader S700, S710 and T600, BBPOS WisePad 3, and Tap to Pay on iPhone and Android; the receiving Stripe account and the reader's location must be in the same country, local currency only [S40]. A BIZOMAT customer taking payments from *their* customers at a counter would need their own Stripe account, so Terminal for customers depends on Connect |
| Identity | Not built | Australia is a supported business location [S41]; a sandbox runs no real checks [S31]. Needs a documented reason per use (for example verifying a company administrator), an update to the privacy page (owner request), retention and access rules, and pricing confirmed |

### 4.17 Emails and notices

- Stripe sends receipts and invoices if enabled in its settings; BIZOMAT does not duplicate them. Owner decision: which
  Stripe emails are on.
- BIZOMAT's outbox sends what Stripe cannot know: trial ending and what happens to access, payment failed and the grace
  end date, access becoming read-only, a refund decision, usage thresholds. Never for the example company.
- In-app banners on the ERP for the same states.

## 5. The key risks and how the plan answers them

1. **Existing users.** Enforcement ships `off` for every module; a migration-time grant (`founding`, all modules,
   `ends_at` NULL) is recorded for every existing registered and own company with any tool; the founder moves modules
   to `shadow` to see who would be affected, then sets the founding end date and turns modules `on` one at a time. A
   lapse means read-only, never deletion. The options are in section 12, decision 1.
2. **Free stays free.** Resources: website pages only, no billing code on web; the deploy workflow's existing public
   checks plus a billing test that web answers them without cookies. CAD Automation: another Fly app and repository;
   the ERP's CAD set-up page is not gated. The example company: allowed by rule 1 of 4.10, refused at checkout (409
   `EXAMPLE_COMPANY`), refused by the database for billing accounts (trigger), never metered, never emailed.
3. **Checkout.** `embedded_page` on bizomat.ai; card data only in Stripe's frames; BIZOMAT's own management page (4.7,
   4.8).
4. **GST.** Registration first, then Stripe Tax; inclusive or exclusive decided before any Price exists; tax IDs
   collected for B2B; Finance records Stripe's amounts, never a second invoice (4.13, 4.14).
5. **Usage.** Ledger with unique keys, Stripe identifiers, consent before any charge (4.15).
6. **Webhooks.** Thin events, event id unique, store then process, fetch latest, retries, reconciliation, the work app
   at `/erp/api/billing/stripe-webhook`, raw body on Node (4.9).
7. **Plan configuration.** Catalogue in the database per environment, editable in the console, env seeds optional,
   no ids in code (4.11).
8. **Test and live.** Key-shape and `livemode` checks; billing off rather than app down; no values in logs; this
   environment's live key replaced before development (2.4, 4.12).
9. **Connect, Terminal, Identity.** Not built; prerequisites listed (4.16).

Other risks found:

- **Proxy key injection** (2.4): solved only by replacing the environment secret; the `livemode` guard is the backstop.
- **Webhook during a deploy or maintenance:** work is offline 10 to 60 seconds on deploy, and in maintenance mode the
  service does not run. Stripe retries; nothing is lost if the outage is shorter than Stripe's retry window (three days
  live) [S9], and reconciliation repairs the rest.
- **Rolling back to an image without billing:** the webhook then answers 404 and Stripe retries; customers keep being
  charged by Stripe whatever BIZOMAT runs. Section 11 covers it.
- **BECS Direct Debit limits:** default 10,000 AUD per transaction and per week [S47]; several annual Enterprise
  purchases in one week could hit it. Cards are unaffected.
- **Apple Pay and other wallets:** need bizomat.ai registered as a payment method domain [S36]; the review preview's
  temporary address will not show them.
- **Permissions-Policy:** `payment=()` on ERP pages may block wallets inside Stripe's frames. To verify in the sandbox;
  billing pages may need `payment=(self "https://js.stripe.com")` or similar (not confirmed in the docs read).
- **Brevo limits:** billing notices share the daily limit; payment-failure notices should use the critical reserve.

## 6. Build order

Each phase is its own pull request (or several), reviewed and deployed by the owner, with the checks in section 7.

### Phase A: core billing

1. Migration `0027_billing.sql`; `config.ts`, `stripe.ts` (client, guards, redaction); entrypoint mapping, `config.ts`
   `BILLING_VARS`, `env.ts`, isolation test, local compose placeholders that are not key-shaped.
2. Catalogue and console editor; price verification; env seeds.
3. Billing accounts and Stripe Customers; billing details.
4. Embedded Checkout (subscription), return page, status sync; duplicate-subscription guards.
5. Webhook endpoint, event store, processor, sweep, reconciliation, failed-event console.
6. Subscription mirror, invoices and payments, PDF download, plan change with preview, cancel, reactivate,
   payment-method update.
7. Entitlement engine, enforcement switches (all `off`), founding grants recorded by a later data migration once the
   owner decides, shadow log.
8. Emails and banners; refund requests; founder refunds and credit notes.
9. Website: redirects; `/pricing/` last, once entitlements are tested and the owner has confirmed prices and the
   module matrix.

Exit: every Phase A test in section 7 passes in CI and in the sandbox on bizomat.ai with the audience `admins`.

### Phase B: usage

Ledger, counters, allowances, thresholds and notices, disclosure and consent, the chosen Stripe usage product
(Meters or Metronome), meter error events, usage on the billing page. No usage charge before an owner-approved price
and the company's acceptance.

### Phase C: admin analytics and reconciliation

Metrics from BIZOMAT's mirror of Stripe records, each with its definition and source, test-mode data labelled:
contracted recurring revenue (MRR, ARR) excluding GST and trials (Stripe also excludes trials from MRR [S27]), active
subscribers, trials, new subscriptions, churn, failed payments, outstanding invoices, revenue by plan; collected revenue
(paid invoices) shown apart from forecast, gross apart from refunds, GST apart from net. "No data yet" when there is
none; never an invented figure. Finance links (4.14) and payouts.

### Phase D: modular extras

Connect, Terminal and Identity only after their prerequisites (4.16). Optionally the A$195 assessment moved onto the
central engine (a one-time Checkout payment) so there is one Stripe integration.

## 7. Test plan

Layers: `apps/work/test/billing-*.test.ts` (vitest on workerd, Stripe faked at the HTTP layer), `apps/work/test-node/
billing-*.test.ts` (real HTTP on Node, raw body), `apps/work/e2e/billing.spec.ts` (Playwright), and sandbox runs with
test cards and test clocks [S38] [S39]. No unit or integration test reaches `api.stripe.com`; a test asserts that.
Webhook fixtures are signed with stripe-node's `generateTestHeaderStringAsync`.

| # | Brief's test | How |
| --- | --- | --- |
| 1 | New customer registration | Existing sign-up and company registration tests unchanged; a new account gets its own company and the example company; its entitlements follow the transition mode (workerd) |
| 2 | Free CAD Automation | ERP CAD page and `/company/api/id/cad-status` never gated in any mode (workerd); `/cad/` 200 in the smoke test |
| 3 | Free ACME example | Example company allowed in `on` mode; checkout 409; billing account insert refused by the trigger even with kind `own`; no usage rows; no billing email (workerd, Node) |
| 4 | Subscription checkout | Session parameters exact (faked Stripe); sandbox: Playwright mounts the embedded page and pays with `4242 4242 4242 4242` |
| 5 | Successful payment | Signed `v1.checkout.session.completed` and `v1.invoice.paid` → subscription active → module allowed; sandbox run |
| 6 | Failed payment | Sandbox card `4000 0000 0000 9995`; `v1.invoice.payment_failed` → `past_due` → grace banner → read-only after grace |
| 7 | Trial creation | `trial_period_days` sent; status `trialing`; modules allowed |
| 8 | Trial expiry | Test clock advanced past the trial; `trial_will_end` notice once; behaviour without a payment method as decided |
| 9 | Renewal | Test clock advanced one period; new invoice paid; period dates updated |
| 10 | Cancellation | Cancel at period end; reactivate before; `deleted` at the end → access per policy |
| 11 | Upgrade | Preview equals the applied proration; modules expand at once |
| 12 | Downgrade | Effective at period end (or as decided); users over the new allowance handled as decided |
| 13 | Proration | `create_preview` totals equal the sandbox invoice |
| 14 | GST handling | Sandbox with an AU registration: AU business with ABN, AU person, overseas business with a tax ID, overseas person; check `taxability_reason` and amounts for inclusive and exclusive prices; Finance records Stripe's tax, never recomputes |
| 15 | Invoice generation | `v1.invoice.finalized` mirrored; number; BIZOMAT's ABN on the sandbox PDF; "Tax invoice" wording checked (13) |
| 16 | Invoice downloads | PDF streams for the company's owner and admins; 404 for anyone else |
| 17 | Usage metering (Phase B) | Same key twice → one row; retry reuses the identifier; ledger totals equal Stripe's summary after aggregation |
| 18 | Usage thresholds (Phase B) | One notice per threshold per period; none for the example company |
| 19 | Duplicate webhooks | Same event twice and concurrently → processed once; an old event replayed → latest state kept; bad signature, stale timestamp, changed body and wrong `livemode` → 400 |
| 20 | Refunds | Founder refund and credit note; `charge.refunded` mirrored; admin (not founder) 403; others 404; Finance reversal in Phase C |
| 21 | Multi-company isolation | A person of company A gets 404 for every billing route of B; an event for A's customer never touches B; the client can never name a Stripe id |
| 22 | Entitlement enforcement | Every module in `off`, `shadow` and `on`; writes by direct API call refused with 402 when not entitled, whatever the client shows; founding grant; grace |
| 23 | Admin permissions | Non-admins 404; admins read; founder-only actions 403 for admins; API tokens refused |
| 24 | Payment reconciliation | Reconciliation repairs a deliberately skipped event; Phase C Finance records once per Stripe id |
| 25 | Mobile checkout | Playwright with phone viewports on the review preview in the sandbox; the owner on a real phone; wallets only on bizomat.ai once its domain is registered |

Also: key and environment guard matrix (every prefix in both environments), log and error redaction, client bundle
scan, CSP present only on billing documents, CSRF and Origin on every billing POST, rate limits on session creation,
entrypoint isolation (`infrastructure/fly/test/entrypoint.test.sh`, `check-isolation.sh`). Regression before any
deploy: `npm run verify` (website), `cd apps/work && npm run check` (lint, type checks, vitest, Node tests, build) and
`npm run test:e2e`, the proxy tests, and the local stack smoke test (`infrastructure/smoke/smoke.mjs`).

## 8. Fly secrets and how they reach the work Machine

Set by the owner on the Fly app `bizomat`. The work role takes only `WORK_*` names; the entrypoint maps them to the
names the app reads, as it does for `WORK_ABR_GUID`.

| Fly secret (owner sets) | The app reads | Notes |
| --- | --- | --- |
| `WORK_STRIPE_SECRET_KEY` | `STRIPE_SECRET_KEY` | `rk_test_...` first; `rk_live_...` only after approval |
| `WORK_STRIPE_PUBLISHABLE_KEY` | `STRIPE_PUBLISHABLE_KEY` | Not secret, but kept beside its secret key so test and live never mix |
| `WORK_STRIPE_WEBHOOK_SECRET` | `STRIPE_WEBHOOK_SECRET` | The destination's `whsec_...` for that environment |
| `WORK_STRIPE_WEBHOOK_SECRET_PREVIOUS` | `STRIPE_WEBHOOK_SECRET_PREVIOUS` | Only during a secret roll (up to 7 days) |
| `WORK_STRIPE_PRICE_ESSENTIALS_MONTHLY` ... `WORK_STRIPE_PRICE_ENTERPRISE_ANNUAL` (8 names) | `STRIPE_PRICE_*` | Optional seeds (4.11); usually not set |
| `WORK_STRIPE_ENVIRONMENT` in `fly.website.toml` `[env]` | `STRIPE_ENVIRONMENT` | Recommended in the reviewed configuration file, not a secret: going live then needs a reviewed pull request and a deploy, a second lock beside the key |

Code changes that come with it (Phase A): `infrastructure/fly/entrypoint.sh` (`EXACT` names and `map` lines, so secret
files under `/data/work/.secrets/` work too), `apps/work/src/node/config.ts` (`BILLING_VARS`), `apps/work/src/worker/env.ts`,
`infrastructure/README.md` (the table), `.github/workflows/bizomat-deploy.yml` (the names-only optional-secret list),
`infrastructure/local/compose.yml` (placeholders that are not key-shaped) and `check-isolation.sh`.

How the owner sets them, without the value on the command line or in shell history:

```bash
read -rs -p 'Sandbox restricted key (rk_test_...): ' K; echo
printf 'WORK_STRIPE_SECRET_KEY=%s\n' "$K" | fly secrets import --stage --app bizomat
unset K
```

`fly secrets import` reads `NAME=VALUE` lines from standard input; confirm that `--stage` is listed in
`fly secrets import --help` first. If it is not, `fly secrets set --stage --app bizomat NAME=...` typed with a leading
space (with `HISTCONTROL=ignorespace`) keeps it out of history. Staged secrets apply at the next run of the deploy
workflow; without `--stage` every Machine restarts at once. Alternative: a root-owned file
`/data/work/.secrets/STRIPE_SECRET_KEY` on the work volume (only the work Machine sees it), then restart that Machine.

## 9. Credentials the owner must supply

Never in chat, email, an issue, a pull request or a file in the repository.

| What | Where it goes | When |
| --- | --- | --- |
| Sandbox restricted key `rk_test_...` of the sandbox "BIZOMAT dev" | This cloud environment: environment menu in the session title bar > Edit > Network secrets: **replace** the value of the `api.stripe.com` secret (header `Authorization`); rename it truthfully | Before any development that calls Stripe |
| Sandbox restricted key `rk_test_...` of "BIZOMAT CI" | GitHub repository secret (for example `STRIPE_CI_TEST_KEY`) for the review preview and e2e runs with `stripe listen` | Phase A, before sandbox e2e |
| Sandbox `rk_test_...`, `pk_test_...` and the destination's `whsec_...` of "BIZOMAT on bizomat.ai (test)" | Fly secrets `WORK_STRIPE_SECRET_KEY`, `WORK_STRIPE_PUBLISHABLE_KEY`, `WORK_STRIPE_WEBHOOK_SECRET` | When Phase A is deployed with the audience `admins` |
| Live `rk_live_...`, `pk_live_...`, live `whsec_...` | The same Fly secrets, replacing the test ones | Only after the owner's explicit approval to go live |
| Business facts (not credentials): legal entity name, ABN, GST registration status and date, business address, support email and phone, statement descriptor | Stripe account settings; BIZOMAT docs once the owner records them | Before live; the ABN and GST status before any tax setting |
| Bank account for payouts, representative identity | Entered by the owner in Stripe only; never given to BIZOMAT | Account activation |
| Terms of sale and refund policy text, privacy page update | Owner (website legal pages need the owner's request) | Before the public pricing page and live payments |
| Optional `WORK_ABR_GUID` | Fly secret (already documented in `docs/company/README.md`) | Any time |

Restricted key permissions for Phase A (Dashboard labels may differ slightly; nothing else enabled): Customers (and
customer tax IDs) write; Checkout Sessions write; Subscriptions and subscription schedules write; Invoices write
(preview, pay); Credit notes write; Refunds write; PaymentIntents, Charges, SetupIntents, Payment methods read; Products
and Prices read (prices are made in the Dashboard); Coupons and Promotion codes read; Events read; Tax settings,
registrations and calculations read. Phase B adds Billing meters and meter events write; Phase C adds Balance
transactions and Payouts read. Connect, Terminal, Identity, Issuing and Treasury: none.

## 10. Stripe Dashboard configuration (sandbox first)

Menu paths are taken from the Stripe docs cited; where a label could not be confirmed it says so.

**A. Sandboxes** [S33]
1. Account picker > Sandboxes > create "BIZOMAT dev", "BIZOMAT CI" and "BIZOMAT on bizomat.ai (test)" (Stripe
   recommends separate general sandboxes for development and CI, not the shared test mode).
2. In each: Workbench > Overview > API versions: upgrade to `2026-10-28.endive` (the version stripe-node 23.1.0 pins)
   [S28] [S35].

**B. Keys** [S31]
3. API keys page (`dashboard.stripe.com/apikeys`) > Restricted keys > Create: name `bizomat-work-billing`, the
   permissions in section 9. Copy it straight into its destination (section 9). Note the publishable key.

**C. Business details and branding** (labels not confirmed in the docs read)
4. Settings > Business > public details: BIZOMAT, `https://bizomat.ai`, support email and phone (owner supplies), terms
   and privacy URLs once they exist. Settings > Branding: logo, navy `#0a1f33`, teal `#0f766e`.

**D. Billing settings**
5. Settings > Billing > Subscriptions and emails: Default billing mode "Flexible and hide classic" [S28]; trial
   ending event days (default 3) [S26]; which customer emails Stripe sends (owner decision).
6. Billing > Revenue recovery > Retries: Smart Retries (Stripe's default for new accounts is up to 8 retries in 2
   weeks) and what happens after the last retry: cancel, mark unpaid, or leave past due [S30]. Recommended: mark unpaid,
   so BIZOMAT shows read-only and payment can recover.
7. Settings > Billing > Invoice template: Tax tab: add BIZOMAT's ABN as an account tax ID and set it as default [S18];
   numbering: account-level (one sequence, prefix such as `BZM`) or customer-level (Stripe's default outside the EU and
   UK) [S19]; footer and memo after the accountant's review.

**E. Tax** [S14] [S15] [S48]
8. Tax > Settings: head office address (needed before any registration); preset product tax code (candidate
   `txcd_10103001`, to confirm); default tax behaviour (the owner's inclusive or exclusive decision).
9. Tax > Locations > Add registration: Australia, only if BIZOMAT is registered for GST. Then a test calculation for an
   Australian address must show a GST rate and a `taxability_reason` other than `not_collecting`.

**F. Payment methods**
10. Settings > Payment methods: cards (with Apple Pay, Google Pay and Link) and, if the owner agrees, AU BECS Direct
    Debit (Checkout collects the Direct Debit Request mandate itself [S47]).
11. Settings > Payment method domains (`dashboard.stripe.com/settings/payment_method_domains`) > Add a new domain:
    `bizomat.ai`. Registering in live mode also registers it in sandboxes [S36].

**G. Catalogue**
12. Product catalogue > Add product: Essentials, Business, Manufacturing, Enterprise (one product each), each with a
    monthly and an annual recurring AUD price, tax behaviour as decided (it cannot be changed later [S15]); add-ons
    "Additional user" and "Additional site" (per unit). Copy each price id into `/erp/admin/billing` (never into code).
    For live, "Copy to live mode" on each product [S3], then link the live ids.
13. Coupons and promotion codes only as the owner approves.

**H. Webhook destination** (only in "BIZOMAT on bizomat.ai (test)", later in live) [S9]
14. Workbench > Webhooks > Create an event destination > Your account > payload **Thin** > select the events in 4.9 >
    Webhook endpoint > URL `https://bizomat.ai/erp/api/billing/stripe-webhook` > Reveal secret > straight into
    `WORK_STRIPE_WEBHOOK_SECRET`.
15. Development and CI receive events with `stripe listen --forward-thin-to <local address>/erp/api/billing/stripe-webhook
    --thin-events "<the list>"` instead of a destination [S9].

**I. Customer portal**: leave off (Settings > Billing > Customer portal) unless the owner chooses the fallback (4.8).

**J. Team**: every Dashboard user with two-factor authentication and the smallest role.

**K. Live, after approval only**
16. Activate payments: complete the account details (legal entity, ABN, representative, bank account); today
    `charges_enabled` and `details_submitted` are false.
17. Repeat C to J in live mode (registrations, invoice settings, products and the destination do not carry over from
    sandboxes [S45] [S48]); a live restricted key; expire or roll the live key that sat in the development environment
    [S45].

## 11. Deployment and rollback

Deploy only through `.github/workflows/bizomat-deploy.yml` (`confirm` = `DEPLOY`), after CI passes, by the owner. No
Machine, process group, memory or volume changes; the preflight enforces it.

1. **Billing dark.** Phase A merged and deployed with no Stripe secrets: billing off, webhook 503,
   `GET /erp/api/billing/config` → `enabled: false`, every module `off`. Migration 0027 is additive; the server copies
   the database to `pre-migration-backups/` before applying it, and the workflow snapshots `work_data`.
2. **Test mode on production, admins only.** Test secrets staged; `WORK_STRIPE_ENVIRONMENT = "test"` in
   `fly.website.toml` by pull request; deploy; the founder sets the audience to `admins` in the console. Only platform
   admins see checkout; the sandbox tests of section 7 run on bizomat.ai with test cards.
3. **Owner decisions applied:** catalogue, founding grants, `shadow` mode, the public pricing page (website pull
   request).
4. **Live, after explicit approval:** live secrets staged; pull request `WORK_STRIPE_ENVIRONMENT = "live"`; deploy with
   the audience `admins`; one owner purchase on a real card, refunded; then the audience `everyone` by the founder.
   Enforcement modules `on` later, one at a time.
5. **After every production change:** the public checks in CLAUDE.md, plus the webhook (unsigned POST → 400),
   `/erp/api/billing/public/plans` (200), the billing page's CSP, and the smoke test. Nothing is called live until its
   public address has been checked.

Rollback:
- **Behaviour, no deploy:** the founder sets the audience to `off` (no new checkouts) and any enforcement module to
  `off` (nobody blocked). Webhooks keep being processed so records stay right.
- **Code:** `flyctl releases -a bizomat --image`, then `flyctl deploy --config fly.website.toml -a bizomat --image
  <previous> --ha=false` (the workflow's own instructions). The billing tables stay; older code ignores them.
- **Data:** `pre-migration-backups/` and the volume snapshots (`docs/deployment/fly-deployment.md`).
- **Stripe keeps charging:** rolling BIZOMAT back does not stop Stripe renewing subscriptions. While webhooks fail,
  Stripe retries for up to three days [S9]; after a longer gap the reconciliation catches up. Stopping charges means
  pausing collection or cancelling in Stripe: only by the owner's decision, with customers told.
- **Live to test:** replace the secrets with test ones and revert `WORK_STRIPE_ENVIRONMENT`; live subscriptions keep
  running in Stripe and are reconciled when live returns.

## 12. Owner decisions

| # | Decision | Options | Recommendation |
| --- | --- | --- | --- |
| 1 | Existing users (today every company uses every module free) | (a) Founding access for all existing companies until a date you set, with notices 60, 30 and 7 days before; (b) no grants, enforcement switched on per module only when you decide; (c) a permanent legacy plan for existing accounts; (d) (a) plus (b) | (d): ship with everything `off` and founding grants recorded; review `shadow` figures; then set the date. Optionally a founding discount |
| 2 | Prices | Confirm A$59, A$149, A$349, A$799 per month and 3, 10, 25, 50 included users; annual "about two months free", for example 10 times monthly: A$590, A$1,490, A$3,490, A$7,990 | Confirm or change before any Price is made |
| 3 | Which modules each plan includes | A matrix of the module keys in 4.10 (Appendix B has an unconfirmed starting point) | Needed before the pricing page; WHS cannot be listed (it does not exist) |
| 4 | GST-inclusive or exclusive | Inclusive (customers see one total; Stripe's AUD default) or exclusive (common for B2B) | Decide before creating prices; it cannot be changed per Price |
| 5 | Is BIZOMAT registered for GST, and Stripe Tax or manual rates | Stripe Tax (0.5% per transaction on the US-locale pricing page; confirm AU) or a manual 10% rate | Stripe Tax if registered and selling overseas; your accountant confirms |
| 6 | Legal entity and ABN for tax invoices | Must be supplied; none is recorded (CLAUDE.md) | Required before live and before any tax invoice |
| 7 | Terms of sale and refund policy | Your text (consumer guarantees under Australian law cannot be excluded); prorated credits, no refunds for part periods, refunds at your discretion | Needed before live; shown and accepted at checkout |
| 8 | Trial length and card | 14 or 30 days; with or without a card (`payment_method_collection: if_required`); what happens at the end without a card (cancel, pause, invoice) | 14 days without a card, cancel at the end, data kept |
| 9 | Grace period and lapse | Days of access after a failed payment; afterwards read-only or locked | Grace matching Stripe's retries (14 days), then read-only; never delete |
| 10 | Who can buy | Registered companies only, or own companies too (needed for overseas customers, since company accounts accept Australia only) | Both |
| 11 | What a user and a site are | Users: company members only, or anyone in the company's tools (guests too). Sites: Maintenance sites, warehouses, or a new site list | Users: members plus tool guests; sites: decide with the module matrix |
| 12 | Over the allowance | Block with a prompt to buy more, or add seats automatically with proration | Block and prompt (no charge without acceptance) |
| 13 | Downgrades | At period end, or now with a credit | At period end |
| 14 | Stripe or BIZOMAT emails | Which Stripe customer emails are on | Stripe: receipts, invoices; BIZOMAT: access notices |
| 15 | Usage billing product | Billing Meters (the brief) or Metronome (Stripe's current recommendation) | Decide at Phase B; the ledger supports either |
| 16 | BIZOMAT's own books and CRM | Designate a Finance business workspace and CRM organisation as BIZOMAT's (needs the legal entity) | Phase C |
| 17 | Payment methods | Cards and wallets only, or BECS Direct Debit too | Cards and wallets first; BECS when wanted (its weekly limit applies) |
| 18 | Test mode on production | Admins-only checkout on bizomat.ai with sandbox keys, or the review preview only | Both: preview for CI, admins-only for the real address |
| 19 | Pricing in the navigation | Add "Pricing" to Home, Systems, Resources, About, Contact | Your request is needed (CLAUDE.md) |
| 20 | Customer portal fallback | Off, or on (leaves bizomat.ai) | Off |
| 21 | Invoice numbering | Account-level sequence or Stripe's customer-level default | Account-level, your accountant to confirm |
| 22 | Plugin telemetry | Leave on, or set `DISABLE_TELEMETRY=1` in the environment | Your choice |
| 23 | The live key that was in this environment | Roll it after replacing the environment secret | Roll it |
| 24 | The assessment webhook on Fly | Leave off, map `WEB_STRIPE_WEBHOOK_SECRET`, or move it onto the billing engine later | Leave off until wanted |

## 13. Unknowns and things to verify

- Whether Stripe's invoice PDF for an Australian account says "Tax invoice": not in the docs read; check a sandbox PDF.
- The ATO's tax invoice requirements: the ATO page answered 403 to this session; the owner's accountant confirms.
- Stripe Tax pricing for Australian accounts in AUD.
- Exact restricted-key permission labels in the Dashboard; the Business and Branding menu labels.
- Whether `embedded_page` serves `mode: setup` for payment-method updates as expected (sandbox).
- Paying an open invoice on BIZOMAT's page, including authentication (sandbox).
- Whether `frame-src https://checkout.stripe.com` is needed beside the Stripe.js directives for the embedded page (both
  are included, then tightened from CSP reports in the sandbox), and the Permissions-Policy `payment` setting for
  wallets.
- `fly secrets import --stage` support in the installed flyctl.
- That `public/_redirects` keeps the query string on the website's Node server (`src/node/assets.ts`).
- The owner's GST registration status and legal entity.
- The planner tool's own output (not available; section 2.1).

## 14. Comparison with the existing implementation

| Area | Today | This plan |
| --- | --- | --- |
| Stripe code | One website webhook for the A$195 assessment; off on Fly | One billing engine in the work app; the assessment unchanged |
| Customers | Companies (registered, own, example) with roles; no Stripe link | One Stripe Customer per company and environment |
| Access | Every company, every module, free | Entitlements at the existing chokepoints, `off` until the owner switches them |
| Admin | `/erp/admin` console, founder-only actions | Billing section in the same console, money actions founder-only |
| Finance | Records invoices, payments and transactions; never moves money | Unchanged; optional records of Stripe charges in Phase C, never a second invoice |
| Email | Outbox with idempotency keys | Billing notices through it; Stripe's own receipts and invoices |
| CSP | `script-src 'self'` everywhere | Stripe origins added on billing documents only |
| Secrets | `WORK_*` mapped by the entrypoint | `WORK_STRIPE_*` mapped the same way |
| Infrastructure | Fly app `bizomat`, three Machines, one volume | The same; nothing added |

## 15. Sources

Stripe documentation read for this plan on 15 Nov 2026 (the Markdown form of each page, `<page>.md`):

- [S1] https://docs.stripe.com/payments/checkout
- [S2] https://docs.stripe.com/api/checkout/sessions/create
- [S3] https://docs.stripe.com/billing/subscriptions/build-subscriptions?payment-ui=checkout&ui=embedded-page&platform=web
- [S4] https://docs.stripe.com/billing/subscriptions/build-subscriptions?payment-ui=elements&api-integration=checkout
- [S5] https://docs.stripe.com/payments/checkout/how-checkout-works?payment-ui=checkout-form
- [S6] https://docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison
- [S7] https://docs.stripe.com/customer-management
- [S8] https://docs.stripe.com/security/guide
- [S9] https://docs.stripe.com/webhooks
- [S10] https://docs.stripe.com/events/how-events-work
- [S11] https://docs.stripe.com/api/v2/core/events/event-types
- [S12] https://docs.stripe.com/billing/subscriptions/webhooks
- [S13] https://docs.stripe.com/tax/supported-countries
- [S14] https://docs.stripe.com/tax/supported-countries/asia-pacific and
  https://docs.stripe.com/tax/supported-countries/asia-pacific/collect-tax?tax-jurisdiction-asia-pacific=australia
- [S15] https://docs.stripe.com/tax/products-prices-tax-codes-tax-behavior
- [S16] https://docs.stripe.com/tax/tax-codes
- [S17] https://docs.stripe.com/billing/customer/tax-ids
- [S18] https://docs.stripe.com/invoicing/taxes/account-tax-ids
- [S19] https://docs.stripe.com/invoicing/customize
- [S20] https://stripe.com/tax/pricing
- [S21] https://docs.stripe.com/billing/subscriptions/usage-based
- [S22] https://docs.stripe.com/billing/subscriptions/usage-based/compare-metronome
- [S23] https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage
- [S24] https://docs.stripe.com/api/billing/meter-event/create
- [S25] https://docs.stripe.com/billing/subscriptions/usage-based/monitor
- [S26] https://docs.stripe.com/billing/subscriptions/trials
- [S27] https://docs.stripe.com/billing/subscriptions/trials/compare
- [S28] https://docs.stripe.com/billing/subscriptions/billing-mode
- [S29] https://docs.stripe.com/billing/subscriptions/prorations
- [S30] https://docs.stripe.com/billing/revenue-recovery/smart-retries
- [S31] https://docs.stripe.com/keys
- [S32] https://docs.stripe.com/keys-best-practices
- [S33] https://docs.stripe.com/sandboxes
- [S34] https://docs.stripe.com/api/idempotent_requests
- [S35] https://docs.stripe.com/api/versioning
- [S36] https://docs.stripe.com/payments/payment-methods/pmd-registration?dashboard-or-api=dashboard
- [S37] https://docs.stripe.com/accounts-v2/use-accounts-as-customers
- [S38] https://docs.stripe.com/billing/testing
- [S39] https://docs.stripe.com/testing
- [S40] https://docs.stripe.com/terminal/payments/regional?integration-country=AU
- [S41] https://docs.stripe.com/identity
- [S42] https://docs.stripe.com/connect
- [S43] https://docs.stripe.com/mcp
- [S44] https://docs.stripe.com/building-with-ai and https://docs.stripe.com/stripe-cli/overview
- [S45] https://docs.stripe.com/get-started/checklist/go-live
- [S46] https://docs.stripe.com/ips
- [S47] https://docs.stripe.com/payments/au-becs-debit
- [S48] Stripe's `stripe-best-practices` skill (plugin `stripe@anthropic-plugin-directory` 0.11.40, `SKILL.md` and
  `references/billing.md`, `tax.md`, `security.md`), read as text from the plugin cache
- [S49] https://docs.stripe.com/billing/taxes/collect-taxes?tax-calculation=tax-rates

Also checked: the `stripe` npm package 23.1.0 (pinned API `2026-10-28.endive`, no runtime dependencies, no install
scripts, worker and workerd builds, `parseEventNotificationAsync`, `generateTestHeaderStringAsync`,
`createFetchHttpClient`).

---

## Appendix A: business context for the planner tool

To submit to `stripe_implementation_planner` when it is available (connected to a sandbox):

> BIZOMAT is an Australian technology and SaaS platform providing integrated ERP, CRM, Finance, Project Management,
> Manufacturing, Asset Management and Maintenance, and engineering automation. We offer paid company subscriptions,
> optional usage-based services, free CAD Automation access and free public engineering resources. Stripe account:
> Australia, AUD. Generate a tailored implementation plan covering Stripe Billing, Payments, Invoicing, usage-based
> billing, Terminal, Connect, Identity, Australian taxation and GST, the subscription lifecycle, security, webhooks,
> refunds, customer billing management, reconciliation, and testing and deployment.

(The brief's text also lists WHS; it is left out here because no WHS module exists.)

## Appendix B: an unconfirmed starting point for the module matrix

For the owner to change or replace; not a claim about any product, and not for publication until decided.

| Module | Essentials | Business | Manufacturing | Enterprise |
| --- | --- | --- | --- | --- |
| Projects and Tasks, Sales and CRM, Finance | yes | yes | yes | yes |
| Maintenance, Procurement, Inventory | | yes | yes | yes |
| Products and Engineering, Manufacturing, Quality, Supply Chain | | | yes | yes |
| Included users | 3 | 10 | 25 | 50 |
| Included sites | to decide | to decide | to decide | to decide |
