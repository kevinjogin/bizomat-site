-- BIZOMAT billing (docs/billing/README.md): one Stripe customer and one subscription per registered company, priced per
-- active member (a "seat"). Stripe holds the money, the prices and the invoices; these tables are BIZOMAT's own record of
-- them, filled from Stripe by the webhook and by the server (src/worker/billing/).
--
-- Additive only: new tables, indexes and triggers, no change to any existing table, so the previous release runs on a
-- database with this migration applied. The company columns name co_companies.id without a foreign key, so removing or
-- soft-deleting a company never removes its billing history. Every row carries the Stripe environment ('test' or 'live')
-- so test and live records never mix.

-- Switches the founder sets in the console without a deploy: who may start a subscription ('audience': off, admins,
-- everyone; default off) and how subscriptions are enforced ('enforcement': off, shadow, on; default off), plus the
-- verified details of each configured Stripe price ('price:<environment>:<price id>', JSON). Never a key or a secret.
CREATE TABLE billing_settings (
  key TEXT PRIMARY KEY CHECK (length(key) BETWEEN 1 AND 120),
  value TEXT NOT NULL CHECK (length(value) <= 4000),
  updated_by TEXT,
  updated_at INTEGER NOT NULL
);

-- One Stripe customer per registered company and environment.
CREATE TABLE billing_accounts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('test', 'live')),
  stripe_customer_id TEXT NOT NULL UNIQUE CHECK (stripe_customer_id LIKE 'cus_%'),
  created_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, environment)
);

-- An example company ("Acme Studio (example)") is never billed, whatever the code passes.
CREATE TRIGGER billing_accounts_no_example BEFORE INSERT ON billing_accounts
WHEN EXISTS (SELECT 1 FROM sys_demo WHERE company_id = NEW.company_id)
BEGIN
  SELECT RAISE(ABORT, 'example companies are never billed');
END;

-- The company's subscription as Stripe last reported it. quantity is the number of seats Stripe bills; seat_version
-- counts the seat changes BIZOMAT applied, so two changes can never be applied from the same starting point.
CREATE TABLE billing_subscriptions (
  id TEXT PRIMARY KEY CHECK (id LIKE 'sub_%'),
  account_id TEXT NOT NULL REFERENCES billing_accounts(id),
  company_id TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('test', 'live')),
  status TEXT NOT NULL CHECK (length(status) BETWEEN 1 AND 40),
  item_id TEXT,
  price_id TEXT,
  interval TEXT CHECK (interval IS NULL OR interval IN ('month', 'year')),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  seat_version INTEGER NOT NULL DEFAULT 0,
  unit_amount INTEGER,
  currency TEXT,
  tax_behavior TEXT,
  current_period_start INTEGER,
  current_period_end INTEGER,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0 CHECK (cancel_at_period_end IN (0, 1)),
  cancel_at INTEGER,
  canceled_at INTEGER,
  ended_at INTEGER,
  trial_end INTEGER,
  past_due_since INTEGER,
  latest_invoice_id TEXT,
  pm_brand TEXT,
  pm_last4 TEXT,
  pm_exp_month INTEGER,
  pm_exp_year INTEGER,
  stripe_created INTEGER,
  synced_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX billing_subscriptions_company ON billing_subscriptions(company_id, environment, status);

-- Embedded Checkout sessions BIZOMAT started: to start a subscription, or to save a new payment method.
CREATE TABLE billing_checkout_sessions (
  id TEXT PRIMARY KEY CHECK (id LIKE 'cs_%'),
  company_id TEXT NOT NULL,
  account_id TEXT NOT NULL REFERENCES billing_accounts(id),
  environment TEXT NOT NULL CHECK (environment IN ('test', 'live')),
  mode TEXT NOT NULL CHECK (mode IN ('subscription', 'setup')),
  interval TEXT CHECK (interval IS NULL OR interval IN ('month', 'year')),
  quantity INTEGER,
  status TEXT NOT NULL CHECK (length(status) BETWEEN 1 AND 20),
  subscription_id TEXT,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  completed_at INTEGER
);
CREATE INDEX billing_checkout_company ON billing_checkout_sessions(company_id, status);

-- Stripe's invoices for the company (amounts in cents, as Stripe gives them). Stripe issues them; BIZOMAT Finance never
-- issues a second invoice for the same charge.
CREATE TABLE billing_invoices (
  id TEXT PRIMARY KEY CHECK (id LIKE 'in_%'),
  account_id TEXT NOT NULL REFERENCES billing_accounts(id),
  company_id TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('test', 'live')),
  subscription_id TEXT,
  number TEXT,
  status TEXT NOT NULL CHECK (length(status) BETWEEN 1 AND 40),
  billing_reason TEXT,
  currency TEXT NOT NULL,
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  amount_due INTEGER NOT NULL DEFAULT 0,
  amount_paid INTEGER NOT NULL DEFAULT 0,
  amount_remaining INTEGER NOT NULL DEFAULT 0,
  period_start INTEGER,
  period_end INTEGER,
  hosted_invoice_url TEXT,
  invoice_pdf TEXT,
  stripe_created INTEGER NOT NULL,
  paid_at INTEGER,
  synced_at INTEGER NOT NULL
);
CREATE INDEX billing_invoices_company ON billing_invoices(company_id, environment, stripe_created DESC);

-- Stripe's webhook events, stored once each by their id (a repeated delivery finds the row and is not processed again),
-- then processed with a lease so two runs never process one event together.
CREATE TABLE billing_events (
  id TEXT PRIMARY KEY CHECK (id LIKE 'evt_%'),
  livemode INTEGER NOT NULL CHECK (livemode IN (0, 1)),
  type TEXT NOT NULL CHECK (length(type) BETWEEN 1 AND 100),
  object_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('received', 'processing', 'processed', 'ignored', 'failed', 'dead')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at INTEGER NOT NULL,
  lease_until INTEGER,
  last_error TEXT CHECK (last_error IS NULL OR length(last_error) <= 300),
  stripe_created INTEGER,
  received_at INTEGER NOT NULL,
  processed_at INTEGER
);
CREATE INDEX billing_events_due ON billing_events(status, next_attempt_at);

-- Every change BIZOMAT made (or tried to make) to a subscription's seat count, with the key Stripe saw, so a retry or a
-- second request for the same change is the same request to Stripe.
CREATE TABLE billing_seat_changes (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  subscription_id TEXT NOT NULL,
  from_quantity INTEGER NOT NULL,
  to_quantity INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 1 AND 60),
  proration_behavior TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'failed')),
  error TEXT CHECK (error IS NULL OR length(error) <= 300),
  actor_id TEXT,
  created_at INTEGER NOT NULL,
  applied_at INTEGER
);
CREATE INDEX billing_seat_changes_company ON billing_seat_changes(company_id, created_at DESC);

-- The company's billing history as its administrators see it: append only. ref (a Stripe id, or a seat change id) makes
-- each entry once.
CREATE TABLE billing_history (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('test', 'live')),
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 40),
  summary TEXT NOT NULL CHECK (length(summary) BETWEEN 1 AND 300),
  ref TEXT,
  actor_id TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE (kind, ref)
);
CREATE INDEX billing_history_company ON billing_history(company_id, environment, created_at DESC);
CREATE TRIGGER billing_history_no_update BEFORE UPDATE ON billing_history
BEGIN
  SELECT RAISE(ABORT, 'billing history is append only');
END;
CREATE TRIGGER billing_history_no_delete BEFORE DELETE ON billing_history
BEGIN
  SELECT RAISE(ABORT, 'billing history is append only');
END;

-- Free access the founder records for a company (founding customers, complimentary access). ends_at NULL: until the
-- founder sets a date or revokes it.
CREATE TABLE billing_grants (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('founding', 'comp', 'manual')),
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 1 AND 300),
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  granted_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER,
  revoked_by TEXT
);
CREATE INDEX billing_grants_company ON billing_grants(company_id);

-- In "shadow" enforcement: how many changes a company made that "on" would have refused, per day. Counts only.
CREATE TABLE billing_shadow_denials (
  day TEXT NOT NULL,
  company_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, company_id)
);
