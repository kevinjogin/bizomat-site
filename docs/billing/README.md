# BIZOMAT billing: per-user subscriptions (built 15 Nov 2026)

The owner's brief of 15 Nov 2026 replaced the four-plan model in `docs/billing/PLAN.md` with one per-user price. This page
describes what is built, the live and sandbox configuration in Stripe, the owner's steps to go live, and what still
needs a decision. `PLAN.md` stays as the discovery record; where the two differ, this page is the current design.

**Status (15 Nov 2026):**
- Built and tested; kevinjogin/bizomat-site#77.
- **The live price** was created by the owner in Stripe's live mode, and read here with a read-only key:

  | | Live Stripe |
  | --- | --- |
  | Product | `prod_VdED2AiKMDhIgM`, "BIZOMAT Business Subscription", active, tax code `txcd_10103001` |
  | Price | `price_1UbyE5Rs74vQph6MdBU51OeG` (the product's default price), active, lookup key `bizomat_user_monthly_aud` |
  | Amount | AUD 10.00 per unit, monthly, licensed, per unit |
  | Tax behaviour | **unspecified** when read; to be set to **exclusive** (owner, 15 Nov 2026) |
  | Annual price | `price_1UbyE6Rs74vQph6MNviG9cbJ`, AUD 100.00 a year, active: exists, **not offered** (monthly only) |
  | Stripe Tax | Active; head office AU; an **active Australian registration**; default tax behaviour exclusive |
  | Live webhook | `we_1Uc3Z4Rs74vQph6MS0nSGbCs`, `https://bizomat.ai/erp/api/billing/stripe-webhook`, API version `2026-10-28.endive`; 259 events when created, to be cut to the 25 in `HANDLED_EVENTS` |

  `fly.website.toml` sets `WORK_STRIPE_ENVIRONMENT = "live"` and this price; `src/config/pricing.ts` names the same
  id and amount for the pages, and `tests/pricing.test.ts` keeps the two equal.
- **GST: exclusive** (owner, 15 Nov 2026).
  - Production sets `WORK_STRIPE_AUTOMATIC_TAX = "on"`, so Stripe Tax adds GST at Checkout and on each invoice,
    from the Australian registration and the billing address Checkout collects.
  - The pages say "plus GST" and give A$11.00 including 10% GST for a customer in Australia.
  - The app sells a live price only when its tax behaviour is inclusive or exclusive (`checkPrice` in
    `apps/work/src/worker/billing/stripe.ts`), so the live price must be set to exclusive in Stripe first.
- **Billing on or off in production:**
  - It is on only when the live secret key, publishable key and webhook signing secret are on Fly. They come from
    repository secrets at each deploy, and the deploy summary names any that is missing.
  - The deploy's public checks say which: the webhook answers 503 when billing is off, and 400 to an unsigned delivery
    when it is on.
- **Subscriptions are not open:** even with billing on, nobody can subscribe until the founder sets "Who may start a
  subscription" in the console (default: nobody).
- **The public page** `/pricing/` shows A$10.00 per active user per month and says subscriptions are not open yet. It
  does not say whether GST is included or added.
- **Stripe sandbox objects, made for testing only** (owner's approval):
  - the product "BIZOMAT ERP, per active user";
  - a monthly AUD 10.00 price, GST exclusive, `price_1Uc2bqRymx2K9qJ1EVaxV6Hd`, lookup key `bizomat_seat_monthly_aud`;
  - a webhook `we_1Uc2bxRymx2K9qJ1iPRF5jUV`, now **disabled**: it points at bizomat.ai, which takes live events
    only.

## What it does

- **One Stripe customer and one subscription per registered company** (`co_companies`). A person's own unregistered
  company and the example company are never billed (the server also refuses an example company's id before making a
  Stripe customer).
- **Charged per active user.** The quantity is the company's active members: the owner, administrators and members
  (`co_members`) whose BIZOMAT account is not disabled. Pending invitations, removed people and disabled accounts are not
  billed. Each person is counted once per company (the table's primary key). The browser never sends a quantity.
- **Prices come from Stripe.** The code holds no price. The configuration names Stripe Price ids (monthly required,
  annual optional). The server reads each Price from Stripe and checks it before use: AUD, recurring every month or year,
  licensed (charged by quantity), per unit, active, and in the configured environment. The check is cached for six
  hours. The page shows the amount Stripe holds, so a price change in Stripe needs no code change.
- **Seat changes follow membership.** After someone joins (added, or accepts an invitation), leaves, is removed, or has
  their account disabled or enabled again, the subscription quantity is updated in the background. The 15-minute
  scheduled check catches anything missed. Each change:
  - is recorded first in `billing_seat_changes` with an idempotency key (subscription, version, new quantity, failed
    tries), so a double click, a retry or the cron at the same moment is one change at Stripe;
  - is applied with Stripe's proration (`STRIPE_PRORATION`, default `create_prorations`: a new user is charged for the
    rest of the period on the next invoice, a removed user is credited for the unused time);
  - moves the stored version on only from the version it read, so two changes are never applied from the same start;
  - is written to the company's billing history with a plain explanation.
- **Embedded payments.** Stripe's embedded Checkout (`ui_mode: embedded_page`) runs on BIZOMAT's own billing page, both
  to start the subscription and to save a new payment method. Card details go to Stripe only. Stripe.js is loaded from
  `js.stripe.com` on the billing page only. That page gets its own Content Security Policy (`BILLING_CSP` in
  `apps/work/src/worker/app.ts`); every other page keeps `script-src 'self'`.
- **Webhook:** `POST https://bizomat.ai/erp/api/billing/stripe-webhook`.
  - Stripe's signature is verified on the exact bytes received. The previous secret is also accepted during a roll.
  - The event's environment must match the configuration.
  - Each event is stored once by its id; a repeated delivery is answered 200 and not processed again.
  - Processing re-reads the object from Stripe, so order does not matter. It uses a lease, retries with back-off, and
    marks an event dead after 8 failures (shown in the console).
  - Billing off: 503, so Stripe retries later.
- **Failed payments:** recorded per attempt in the history. The page shows a warning and the payment method can be
  updated. Saving a new method retries the open invoice once. While enforcement is on, a company keeps full access for
  `STRIPE_GRACE_DAYS` (default 14) after the first failure.
- **Cancellation:** at the end of the paid period, with "Keep the subscription" until then. A company with a
  subscription that has not ended cannot be deleted.
- **Monthly or annual:** switching shows Stripe's own preview of the next invoice first.
- **Estimated next invoice:** from Stripe's invoice preview, with prorations marked.
- **Payment history:** Stripe's invoices (number, period, total, GST, status, links to Stripe's invoice and PDF) and an
  append-only billing history.

### Entitlements (enforced on the server)

`entitlementGate` (`apps/work/src/worker/billing/entitlements.ts`) runs on every signed-in API request. It never refuses
a read, and billing never hides or deletes data.

| Mode (founder sets it in the console) | Effect |
| --- | --- |
| `off` (default) | Nothing is refused. Today's behaviour. |
| `shadow` | Nothing is refused. Each write that `on` would refuse is counted per company and day. |
| `on` | A registered company with no active subscription, no grant and no grace left can read its records but not change them (402, code `PLAN_REQUIRED`). |

- **What is gated:** writes to a registered company's paid tools:
  - the ERP (`/erp/c/:company`), Maintenance and Health and Safety;
  - the company's CRM, Finance and Projects workspace;
  - Projects records (boards, items and the rest) by their workspace.
- **What is never gated:** company administration (people, invitations, departments), billing itself, the console, a
  person's own settings and workspaces, own and example companies, CAD Automation (its own app) and the public Resources
  (the website).
- **If billing is not configured,** nothing is refused, whatever the mode.
- **Grants** (founding, complimentary, other) give free access until a date or until revoked. They are recorded by the
  founder in the console.

### Who can do what

| Person | Can |
| --- | --- |
| Company owner or administrator | See billing; start, change and cancel the subscription; update the payment method. Money actions only from a signed-in browser (an API token gets 403). |
| Company member | Nothing in billing (403). |
| Platform admin | The console's Billing tab (read). |
| Founder | Change who may subscribe (`off`, `admins`, `everyone`; default `off`) and enforcement; add and revoke grants; reprocess events; reconcile. Every change is written to the audit log. |

## Configuration (environment; Fly secrets on the app `bizomat`)

The work role receives `WORK_STRIPE_*` under these names (`infrastructure/fly/entrypoint.sh`). Billing is off, with the
reason shown to platform admins (never a key), until all the required settings are present and belong to one Stripe
environment. A live key in a test environment, or the reverse, turns billing off.

**Production takes live settings only** (owner, 15 Nov 2026):
- The app refuses `STRIPE_ENVIRONMENT=test` when `ENVIRONMENT=production`.
- The deploy workflow (`.github/scripts/stage-secrets.sh`) stages the Stripe repository secrets only when
  `fly.website.toml` sets `WORK_STRIPE_ENVIRONMENT = "live"`, and only live keys.
- Sandbox keys kept in GitHub are left there, and billing stays off.
- Test mode runs in development, in the tests and in a sandbox run, never on bizomat.ai.

| Fly secret | App reads | Required | Notes |
| --- | --- | --- | --- |
| `WORK_STRIPE_ENVIRONMENT` | `STRIPE_ENVIRONMENT` | yes | `test` or `live`. Live only after the owner's explicit approval. |
| `WORK_STRIPE_SECRET_KEY` | `STRIPE_SECRET_KEY` | yes | A restricted key (`rk_test_...` first) with the permissions below. Server only. |
| `WORK_STRIPE_PUBLISHABLE_KEY` | `STRIPE_PUBLISHABLE_KEY` | yes | `pk_test_...`; sent to the billing page. |
| `WORK_STRIPE_WEBHOOK_SECRET` | `STRIPE_WEBHOOK_SECRET` | yes | The destination's `whsec_...`. |
| `WORK_STRIPE_WEBHOOK_SECRET_PREVIOUS` | `STRIPE_WEBHOOK_SECRET_PREVIOUS` | no | Only while rolling the secret. |
| `WORK_STRIPE_PRICE_SEAT_MONTHLY` | `STRIPE_PRICE_SEAT_MONTHLY` | yes | `price_...` of the monthly per-user price. |
| `WORK_STRIPE_PRICE_SEAT_ANNUAL` | `STRIPE_PRICE_SEAT_ANNUAL` | no | `price_...` of the annual per-user price; without it, annual billing is not offered. |
| `WORK_STRIPE_PRORATION` | `STRIPE_PRORATION` | no | `create_prorations` (default), `always_invoice` or `none`. |
| `WORK_STRIPE_AUTOMATIC_TAX` | `STRIPE_AUTOMATIC_TAX` | no | `on` turns on Stripe Tax. Only after BIZOMAT's GST registration is recorded in Stripe. |
| `WORK_STRIPE_GRACE_DAYS` | `STRIPE_GRACE_DAYS` | no | 0 to 60, default 14. |
| none | `STRIPE_API_BASE` | no | Development and tests only (a stand-in for Stripe). Refused in production and live. The Node server's outbound guard (`apps/work/src/node/outbound.ts`) only reaches public https addresses, so a stand-in on this computer is not reachable from it; the tests replace `fetch` instead. |

**Restricted key permissions**, traced from every Stripe call in `apps/work/src/worker/billing/` (nothing else is
called):

| Call | Permission |
| --- | --- |
| `prices.retrieve` (with the product expanded) | Prices: read; Products: read |
| `customers.create` (with the company's ABN as `au_abn`), `customers.update` (default payment method) | Customers: write (if the Dashboard lists customer tax IDs separately, write there too) |
| `checkout.sessions.create`, `.retrieve`, `.expire` | Checkout Sessions: write |
| `subscriptions.retrieve`, `.update` (seats, frequency, cancel, payment method; `default_payment_method` expanded) | Subscriptions: write; Payment Methods: read |
| `invoices.retrieve`, `invoices.createPreview`, `invoices.pay` | Invoices: write |
| `setupIntents.retrieve` | SetupIntents: read |
| `charges.retrieve`, `disputes.retrieve`, `radar.earlyFraudWarnings.retrieve` | Charges: read; Disputes: read; Radar early fraud warnings: read |
| `webhooks.constructEventAsync` | none (local signature check) |

The sandbox run below used a full sandbox secret key. Before live, run the same flow once with the restricted key: a
missing permission shows as a 403 in the billing page's message, and nothing is half applied.

## Stripe configuration (the proposal of 15 Nov 2026)

The owner created the live product and price themselves (see Status above). The product name, description and tax
behaviour differ from the proposal below. The live webhook destination follows this table and is created by the owner
(Going live, below). The sandbox objects follow the proposal.

| Object | Setting | Proposed value | Decision needed |
| --- | --- | --- | --- |
| Product | Name (shown on invoices) | `BIZOMAT ERP, per active user` | Confirm the wording |
| | Description | `BIZOMAT ERP for one company, charged for each active user.` | |
| | Tax code | `txcd_10103001` (Software as a service, business use) | Accountant to confirm |
| | Metadata | `bizomat_plan=seats` | |
| Price, monthly | Currency, amount | AUD, `1000` cents (A$10.00) per user | Confirm A$10 |
| | Recurring | every 1 month, usage type licensed, billing scheme per unit | |
| | Tax behaviour | exclusive (GST added) or inclusive (GST in the A$10). It cannot be changed once set. | Owner and accountant |
| | Lookup key | `bizomat_seat_monthly_aud` | |
| Price, annual (optional) | Currency, amount | AUD, an amount the owner chooses. No discount is assumed. 12 times monthly would be A$120.00. | Owner chooses, or leaves annual off |
| | Recurring | every 1 year, licensed, per unit; the same tax behaviour as monthly | |
| Webhook destination | URL | `https://bizomat.ai/erp/api/billing/stripe-webhook` | |
| | Payload | Snapshot events (the server re-reads each object from Stripe) | |
| | Events | The 25 events in `HANDLED_EVENTS` (`apps/work/src/worker/billing/webhook.ts`): checkout session, customer subscription, invoice, `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed` and `radar.early_fraud_warning.created` | |
| Settings | Customer portal | Off: BIZOMAT's own page manages billing | |
| | Smart Retries | Stripe's default, and after the last retry: mark the subscription unpaid | Confirm |
| | Payment methods | Cards and wallets (dynamic payment methods; the code never names payment method types) | BECS Direct Debit later if wanted |

Example amounts at A$10.00 per user per month (the live price). The GST columns apply only if the owner makes the price GST exclusive and BIZOMAT is registered for GST:

| Users | Per month | GST (if registered and exclusive) | Total |
| --- | --- | --- | --- |
| 1 | A$10.00 | A$1.00 | A$11.00 |
| 5 | A$50.00 | A$5.00 | A$55.00 |
| 10 | A$100.00 | A$10.00 | A$110.00 |
| 25 | A$250.00 | A$25.00 | A$275.00 |
| 50 | A$500.00 | A$50.00 | A$550.00 |

With GST-inclusive prices, the totals are the first column, and Stripe shows the GST inside them (A$0.91 per user).

## GST

- **What the page shows today:**
  - each price's tax behaviour as Stripe holds it;
  - whether Stripe calculates GST (`STRIPE_AUTOMATIC_TAX`);
  - the GST on each invoice and on the estimate, as Stripe charged or calculated it.
- **GST exclusive** (owner, 15 Nov 2026): Stripe Tax has an active Australian registration, and production turns on
  automatic tax. The live price's tax behaviour, unspecified when read, is set to exclusive; until it is, the app does
  not sell it.
- **Stripe Tax stays off until** the owner confirms BIZOMAT's GST registration and records it in Stripe (Tax >
  Registrations). Without a registration, Stripe charges no tax and gives no error.
- **No claims:** nothing in BIZOMAT says its invoices are tax invoices or that its billing is tax compliant.
  - Whether Stripe's invoice PDF for an Australian account meets the ATO's tax invoice rules is to be checked on a
    sandbox invoice by the owner's accountant.
  - BIZOMAT's ABN and legal name must be added to Stripe's invoice settings first; they are not recorded anywhere yet.

## Stripe test-mode setup (the owner's steps; never paste a key into chat, a file or a pull request)

1. **Tools:**
   - Node.js 22 and npm are needed for the code; the Stripe CLI (1.55.11 here) is optional.
   - Install the CLI with `npm i -g @stripe/cli` or from Stripe's CLI page, and sign in with `stripe login`.
2. **Sandbox:** in the Stripe Dashboard, account picker > Sandboxes > create `BIZOMAT test`. Stripe recommends separate
   sandboxes over the shared test mode.
3. **Catalogue:** after approving the table above, create the product and price(s) in that sandbox and note the
   `price_...` ids.
4. **Key:** Developers > API keys > Create restricted key `bizomat-work-billing-test`, with the permissions above. Copy it
   straight into the Fly secret, without showing it on screen or keeping it in shell history:

   ```bash
   read -rs -p 'Sandbox restricted key (rk_test_...): ' K; echo
   printf 'WORK_STRIPE_SECRET_KEY=%s\n' "$K" | fly secrets import --stage --app bizomat
   unset K
   ```

5. **Webhook:** Workbench > Webhooks > Create an event destination, with the URL, Snapshot payload and the events above.
   Reveal the signing secret and stage it the same way as `WORK_STRIPE_WEBHOOK_SECRET`.
6. **The other settings:** stage these the same way, or with `fly secrets set --stage` (they are not secret):
   - `WORK_STRIPE_PUBLISHABLE_KEY` (`pk_test_...`);
   - `WORK_STRIPE_ENVIRONMENT=test`;
   - `WORK_STRIPE_PRICE_SEAT_MONTHLY`, and `WORK_STRIPE_PRICE_SEAT_ANNUAL` if wanted.

   Staged secrets apply at the next deploy, which needs the owner's approval.
7. **Turn it on for testing:**
   - After the deploy, the console's Billing tab shows "On, Stripe test mode" and checks the prices.
   - Set "Who may start a subscription" to **Platform admins only**.
   - Subscribe a registered company with Stripe's test card `4242 4242 4242 4242`, any future date and any CVC. Use
     `4000 0000 0000 0341` to test a failed payment.
   - Invite and remove people and watch the quantity and history change.
8. **This development environment** (its settings, Network secrets, for `api.stripe.com`):
   - It held a live secret key until 15 Nov 2026, replaced by a sandbox key. Roll that live key in the Stripe Dashboard:
     it was exposed to a development environment.
   - For the release, the owner added a **live, read-only** restricted key ("bizomat-release-readonly"), with Products:
     Read only, so far. Reading the price list, the webhook endpoints and the tax settings also needs Prices,
     Webhook Endpoints, Tax Settings and Tax Registrations: Read.
   - Remove that key when the release checks are done.
9. **Local development:**
   - `stripe listen --forward-to localhost:8002/api/billing/stripe-webhook` gives a local `whsec_...` signing secret.
   - Set the `STRIPE_*` names in the local environment, never in a committed file.

## Going live (the owner's steps; values never in chat, a file or a pull request)

Done: the live product and price (owner); `WORK_STRIPE_ENVIRONMENT = "live"` and the price id in `fly.website.toml`.

1. **GST (decided: exclusive).** Stripe Tax holds the Australian registration. The live monthly price's tax behaviour
   is set to exclusive (Stripe allows it once on an unspecified price; the amount does not change), and production
   sets `WORK_STRIPE_AUTOMATIC_TAX = "on"`.
2. **The app's key:** in live mode, Developers > API keys > Create restricted key `bizomat-work-billing-live`, with the
   permissions in the table above. Save it as the repository secret `WORK_STRIPE_SECRET_KEY` of
   kevinjogin/bizomat-site (Settings > Secrets and variables > Actions).
3. **The publishable key** (`pk_live_...`) as the repository secret `WORK_STRIPE_PUBLISHABLE_KEY`.
4. **The live webhook:** Workbench > Webhooks > Create an event destination, in live mode:
   - the address `https://bizomat.ai/erp/api/billing/stripe-webhook`;
   - the payload style Snapshot;
   - the 25 events in `HANDLED_EVENTS`.

   Save its signing secret as the repository secret `WORK_STRIPE_WEBHOOK_SECRET`. Create it shortly before the
   deploy: until billing is on, production answers 503 and Stripe retries.
5. **Deploy** (Actions > Deploy BIZOMAT, `confirm` = `DEPLOY`):
   - the run's summary names each staged setting and each missing one;
   - a test key stops the deploy before anything is staged;
   - the public checks say "billing is configured" (the webhook answers 400 to an unsigned delivery).
6. **The console** (`/erp/admin/billing`, the founder): it shows "On, live" and the price checked with Stripe. Until
   step 1 is done, it says the price does not say whether GST is included or added.
7. **Open subscriptions:** "Who may start a subscription", first Platform admins, then everyone. A real subscription
   charges a real card: only with the owner's explicit approval.

Also before customers pay: the account activated (legal entity, ABN, bank account), terms of sale and a refund policy,
and Stripe named on the privacy page.

## Tests

`apps/work/test/billing.test.ts` (23 tests) runs the official Stripe SDK against an in-memory stand-in for
`api.stripe.com`. The stand-in keeps customers, sessions, subscriptions and invoices, honours idempotency keys and
records every request; no network call is made. Webhook signatures are made with Stripe's own test helper. Billing is
switched on only for that file's requests, so the rest of the suite runs with billing off, as production does.

Covered:
- **Configuration:** every reason billing stays off; keys never appear in reasons, responses or the console.
- **The live GST gate:** a live price is sold only when its tax behaviour is inclusive or exclusive (the owner's live
  price, unspecified on 15 Nov 2026, is refused); the sandbox may test either way.
- **The website** (`tests/pricing.test.ts`): `fly.website.toml` names the price `src/config/pricing.ts` publishes, in
  live mode, never the sandbox price or a key; the pages write no amount of their own; no page states a GST treatment
  while it is unconfirmed.
- **Seats:**
  - who counts;
  - members and strangers refused;
  - the server's count used even when the browser sends one;
  - one Stripe customer per company;
  - a second subscription refused;
  - API tokens refused;
  - a wrongly configured price refused.
- **Webhook:**
  - unsigned, wrongly signed, other-environment and billing-off events refused;
  - the previous secret accepted;
  - duplicate deliveries processed once.
- **Payments:** failed and recovered payments with tax amounts.
- **Seat changes:**
  - on join and removal, with the proration explanation;
  - two racing changes applied once, with one key;
  - a failed change retried with a new key;
  - a company with nobody billable left for a person.
- **Subscription changes:**
  - the invoice estimate;
  - the switch to annual;
  - cancel and keep;
  - deletion refused while subscribed;
  - cancellation recorded;
  - a payment method saved through setup Checkout.
- **Entitlements:**
  - every mode;
  - reads never refused;
  - company administration and own workspaces never gated;
  - grants;
  - the grace period;
  - billing not configured means nothing refused.
- **Database and safety:** the example company never reaching billing; append-only history.
- **Security policy:** the billing page's own policy, and only there.
- **Cron:** does nothing while billing is off.
- **Console:** admins only, changes by the founder only, audited.

Also checked: the billing page rendered by the built server at 1440 and 390 px (no horizontal overflow, no console
errors, the billing security policy applied, the Administration link a full page load), with the per-user prices taken
from the server's verified-price record.

**Against the real Stripe sandbox** (15 Nov 2026, the app's own code through the work app's Node runtime; temporary
test, not committed; objects cleaned up):
- the sandbox price was read and checked: A$10.00 per user per month (a test amount, not the approved price), exclusive;
- an embedded Checkout session was created. It took the server's seat count (1) when the request asked for 99, and
  the same session was shown again on a repeat;
- the Australian customer was created with its ABN (`au_abn`, pending Stripe's check);
- a signed `customer.subscription.created` was recorded once (the second delivery was not processed again);
- the first invoice was recorded as paid;
- a member added: Stripe's quantity went from 1 to 2, and the next-invoice preview shows Stripe's proration lines;
- a member removed: the scheduled reconciliation brought the quantity back to 1;
- cancel at period end, then keep;
- a cancellation in Stripe was recorded;
- **a declined renewal** (test clock moved 36 days, card `pm_card_chargeCustomerFail`): Stripe's subscription went
  `past_due`, the invoice was open after 2 attempts, the app recorded `past_due` with the failure in the history, and
  with enforcement on the company stayed entitled during the grace period.

What that run showed: Stripe holds a new invoice until every enabled webhook endpoint has accepted `invoice.created`
(up to 72 hours). A webhook must therefore point at a host that accepts that environment's events, which is why the
sandbox webhook is disabled.

Not tested yet:
- completing Stripe's embedded Checkout in a browser with a test card (it needs the sandbox publishable key on a page
  that may use test mode, and production never does);
- wallets and 3D Secure;
- a delivery signed by Stripe itself (the run signed events with Stripe's own test helper);
- a restricted key with the permissions above.

## Decisions still open (from `PLAN.md` section 12, updated for the per-user model)

Settled by the brief of 15 Nov 2026:
- **#2 Prices:** one price per active user per month (the amount is **not approved yet**; A$10 is a proposal, used in the sandbox only), and an optional annual price with no assumed discount.
- **#3 Modules per plan:** one price covers everything paid.
- **#11 What a user is:** active company members.
- **#12 Over the allowance:** the quantity follows membership, with proration.
- **#13 Downgrades:** prorated credit by default.

Open:

| # | Decision | Recommendation |
| --- | --- | --- |
| 1 | Existing companies | Keep enforcement `off`; record founding grants; review `shadow` counts; then set a date |
| 4 | GST-inclusive or exclusive prices (cannot be changed per Price) | Exclusive is common for business customers; the accountant confirms |
| 5 | GST registration and Stripe Tax | Turn on `STRIPE_AUTOMATIC_TAX` only after the registration is recorded in Stripe |
| 6 | Legal entity, ABN, address for invoices | Required before live; none is recorded |
| 7 | Terms of sale and refund policy | Required before live |
| 8 | Trial | None built. A trial can be added to Checkout (`trial_period_days`) on request |
| 9 | Grace after a failed payment | 14 days, then read-only (enforcement `on` only) |
| 10 | Own (unregistered) companies | Not billed today. Billing them would need a customer per person |
| 14 | Which Stripe emails | Stripe: receipts and invoices. BIZOMAT sends none yet |
| 17 | Payment methods | Cards and wallets first |
| 18 | Test mode on production | Settled: never (owner, 15 Nov 2026). Production takes live settings only |
| 19 | A public pricing page | Built: `/pricing/` (owner's request, 15 Nov 2026), linked from the footer, `/systems/` and `/systems/erp/`; it names no price until one is approved |
| 21 | Invoice numbering | Account-level sequence, accountant to confirm |
| 23 | The live key in this environment | Replace it with a sandbox key, then roll it |
| new | Proration on removal | Credit (default) or no credit (`STRIPE_PRORATION=none` charges changes from the next period) |
| new | Annual price amount | Owner chooses, or leaves annual off |

## Files

- **Database:** `apps/work/migrations/0027_billing.sql`. Additive: new tables, indexes and triggers only.
- **Server:** `apps/work/src/worker/billing/`:
  - `config.ts`: settings and redaction;
  - `stripe.ts`: client, environment check and price check;
  - `store.ts`, `sync.ts`, `seats.ts`, `webhook.ts`, `entitlements.ts`;
  - `routes.ts`: the company API;
  - `admin.ts`: the console API and reconciliation.
- **Screens:** `apps/work/src/client/system/billing/Billing.tsx` (`/erp/c/<company>/billing`, linked from
  Administration as a full page load) and `BillingAdmin.tsx` (`/erp/admin/billing`).
- **Wiring:**
  - `apps/work/src/worker/app.ts`: routes, gate and `BILLING_CSP`;
  - `index.ts`: the cron;
  - `company/routes.ts` and `system/admin.ts`: seat changes and the deletion guard;
  - `src/node/config.ts` and `env.ts`: settings;
  - `infrastructure/fly/entrypoint.sh` and `.github/workflows/bizomat-deploy.yml`: names only.
