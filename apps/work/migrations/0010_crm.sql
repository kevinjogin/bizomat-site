-- BIZOMAT CRM (owner's brief, 13 Nov 2026). Additive: new crm_* tables and indexes only; no existing table, column or
-- row is changed. The CRM runs inside this app (same Worker, same database, same accounts and sessions).
--
-- Organisation ownership is enforced by the database, not only by the queries:
--   * every CRM table carries org_id, and records cascade from crm_orgs;
--   * every link between two CRM records is a composite foreign key (org_id, <ref>_id) -> <table>(org_id, id), so a
--     contact can never point at another organisation's company, a deal at another organisation's stage, and so on;
--   * a deal's stage must belong to its pipeline (pipeline_id, stage_id) -> crm_stages(pipeline_id, id).
-- The links point one way only (leads -> the contact, company and deal they became; deals and activities -> their
-- records), so the tables have a parents-first order, which the data tooling needs (scripts/migrate/lib/d1-sql.mjs).
-- The origin pointers back to a lead (crm_contacts.lead_id, crm_deals.lead_id) are therefore plain columns, written
-- only by the server when it converts a lead of the same organisation.
-- Records are archived or deleted softly (archived_at, deleted_at); history (crm_events, crm_audit_log) is insert-only.
-- Money is integer minor units of the organisation's currency (cents for AUD).

CREATE TABLE crm_orgs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  currency TEXT NOT NULL DEFAULT 'AUD',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  logo_key TEXT,
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE TABLE crm_members (
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','manager','sales','member','viewer')),
  title TEXT NOT NULL DEFAULT '',
  invited_by TEXT,
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (org_id, user_id)
);
CREATE INDEX crm_members_user ON crm_members(user_id);
-- Exactly one owner per organisation (ownership moves with a transfer).
CREATE UNIQUE INDEX crm_members_one_owner ON crm_members(org_id) WHERE role = 'owner';

CREATE TABLE crm_invitations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('admin','manager','sales','member','viewer')),
  token_hash TEXT NOT NULL UNIQUE,
  message TEXT NOT NULL DEFAULT '',
  invited_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_sent_at INTEGER,
  send_count INTEGER NOT NULL DEFAULT 1,
  accepted_at INTEGER,
  accepted_by TEXT,
  declined_at INTEGER,
  revoked_at INTEGER,
  revoked_by TEXT
);
CREATE INDEX crm_invitations_org ON crm_invitations(org_id, created_at);
CREATE INDEX crm_invitations_email ON crm_invitations(email, accepted_at, revoked_at, declined_at);

-- Permission overrides per role and module (defaults live in src/shared/crm/roles.ts). Owner and admin are fixed.
CREATE TABLE crm_role_permissions (
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('manager','sales','member','viewer')),
  module TEXT NOT NULL,
  perms_json TEXT NOT NULL,
  updated_by TEXT,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (org_id, role, module)
);

CREATE TABLE crm_teams (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  lead_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, id)
);
CREATE TABLE crm_team_members (
  org_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (org_id, team_id) REFERENCES crm_teams(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, user_id) REFERENCES crm_members(org_id, user_id) ON DELETE CASCADE
);
CREATE INDEX crm_team_members_user ON crm_team_members(org_id, user_id);

CREATE TABLE crm_companies (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  size TEXT NOT NULL DEFAULT '',
  annual_revenue INTEGER,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  postcode TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'prospect',
  description TEXT NOT NULL DEFAULT '',
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  logo_key TEXT,
  custom_json TEXT NOT NULL DEFAULT '{}',
  search_text TEXT NOT NULL DEFAULT '',
  phone_keys TEXT NOT NULL DEFAULT '',
  last_activity_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  deleted_at INTEGER,
  UNIQUE (org_id, id)
);
CREATE INDEX crm_companies_list ON crm_companies(org_id, deleted_at, archived_at, updated_at);
CREATE INDEX crm_companies_owner ON crm_companies(org_id, owner_id);
CREATE INDEX crm_companies_name ON crm_companies(org_id, name COLLATE NOCASE);
CREATE INDEX crm_companies_domain ON crm_companies(org_id, domain);

CREATE TABLE crm_contacts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  job_title TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  emails_json TEXT NOT NULL DEFAULT '[]',
  phone TEXT NOT NULL DEFAULT '',
  mobile TEXT NOT NULL DEFAULT '',
  phones_json TEXT NOT NULL DEFAULT '[]',
  company_id TEXT,
  website TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  postcode TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  priority TEXT NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL DEFAULT '',
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  avatar_key TEXT,
  custom_json TEXT NOT NULL DEFAULT '{}',
  search_text TEXT NOT NULL DEFAULT '',
  phone_keys TEXT NOT NULL DEFAULT '',
  last_contacted_at INTEGER,
  next_follow_up TEXT,
  last_activity_at INTEGER,
  lead_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  deleted_at INTEGER,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, company_id) REFERENCES crm_companies(org_id, id)
);
CREATE INDEX crm_contacts_list ON crm_contacts(org_id, deleted_at, archived_at, updated_at);
CREATE INDEX crm_contacts_owner ON crm_contacts(org_id, owner_id);
CREATE INDEX crm_contacts_company ON crm_contacts(org_id, company_id);
CREATE INDEX crm_contacts_email ON crm_contacts(org_id, email);
CREATE INDEX crm_contacts_follow_up ON crm_contacts(org_id, next_follow_up);

CREATE TABLE crm_leads (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  job_title TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  score INTEGER NOT NULL DEFAULT 0,
  score_locked INTEGER NOT NULL DEFAULT 0,
  estimated_value INTEGER,
  priority TEXT NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL DEFAULT '',
  follow_up_date TEXT,
  unqualified_reason TEXT NOT NULL DEFAULT '',
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  custom_json TEXT NOT NULL DEFAULT '{}',
  search_text TEXT NOT NULL DEFAULT '',
  phone_keys TEXT NOT NULL DEFAULT '',
  converted_at INTEGER,
  converted_by TEXT,
  contact_id TEXT,
  company_id TEXT,
  deal_id TEXT,
  last_activity_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  deleted_at INTEGER,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES crm_contacts(org_id, id),
  FOREIGN KEY (org_id, company_id) REFERENCES crm_companies(org_id, id),
  FOREIGN KEY (org_id, deal_id) REFERENCES crm_deals(org_id, id)
);
CREATE INDEX crm_leads_list ON crm_leads(org_id, deleted_at, archived_at, updated_at);
CREATE INDEX crm_leads_owner ON crm_leads(org_id, owner_id);
CREATE INDEX crm_leads_status ON crm_leads(org_id, status, created_at);
CREATE INDEX crm_leads_email ON crm_leads(org_id, email);

CREATE TABLE crm_pipelines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  position REAL NOT NULL DEFAULT 0,
  is_default INTEGER NOT NULL DEFAULT 0,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, id)
);
CREATE INDEX crm_pipelines_org ON crm_pipelines(org_id, position);

CREATE TABLE crm_stages (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  pipeline_id TEXT NOT NULL,
  name TEXT NOT NULL,
  probability INTEGER NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  position REAL NOT NULL DEFAULT 0,
  rot_days INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, id),
  UNIQUE (pipeline_id, id),
  FOREIGN KEY (org_id, pipeline_id) REFERENCES crm_pipelines(org_id, id) ON DELETE CASCADE
);
CREATE INDEX crm_stages_pipeline ON crm_stages(org_id, pipeline_id, position);

CREATE TABLE crm_deals (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  pipeline_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  title TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL,
  probability INTEGER CHECK (probability IS NULL OR probability BETWEEN 0 AND 100),
  expected_close_date TEXT,
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  company_id TEXT,
  lead_id TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','won','lost')),
  won_at INTEGER,
  lost_at INTEGER,
  lost_reason TEXT NOT NULL DEFAULT '',
  competitors TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  flagged INTEGER NOT NULL DEFAULT 0,
  flag_reason TEXT NOT NULL DEFAULT '',
  custom_json TEXT NOT NULL DEFAULT '{}',
  search_text TEXT NOT NULL DEFAULT '',
  position REAL NOT NULL DEFAULT 0,
  stage_entered_at INTEGER NOT NULL,
  last_activity_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  deleted_at INTEGER,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, pipeline_id) REFERENCES crm_pipelines(org_id, id),
  FOREIGN KEY (org_id, stage_id) REFERENCES crm_stages(org_id, id),
  FOREIGN KEY (pipeline_id, stage_id) REFERENCES crm_stages(pipeline_id, id),
  FOREIGN KEY (org_id, company_id) REFERENCES crm_companies(org_id, id)
);
CREATE INDEX crm_deals_list ON crm_deals(org_id, deleted_at, archived_at, updated_at);
CREATE INDEX crm_deals_board ON crm_deals(org_id, pipeline_id, status, stage_id, position);
CREATE INDEX crm_deals_owner ON crm_deals(org_id, owner_id, status);
CREATE INDEX crm_deals_company ON crm_deals(org_id, company_id);
CREATE INDEX crm_deals_close ON crm_deals(org_id, status, expected_close_date);
CREATE INDEX crm_deals_won ON crm_deals(org_id, status, won_at);

CREATE TABLE crm_deal_contacts (
  org_id TEXT NOT NULL,
  deal_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  PRIMARY KEY (deal_id, contact_id),
  FOREIGN KEY (org_id, deal_id) REFERENCES crm_deals(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, contact_id) REFERENCES crm_contacts(org_id, id) ON DELETE CASCADE
);
CREATE INDEX crm_deal_contacts_contact ON crm_deal_contacts(org_id, contact_id);

CREATE TABLE crm_products (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL DEFAULT '',
  unit_price INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, id)
);
CREATE INDEX crm_products_org ON crm_products(org_id, active, name);

-- Products and services on a deal. quantity_milli is the quantity in thousandths; discount_bp in basis points.
CREATE TABLE crm_deal_items (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  deal_id TEXT NOT NULL,
  product_id TEXT,
  name TEXT NOT NULL,
  quantity_milli INTEGER NOT NULL DEFAULT 1000,
  unit_price INTEGER NOT NULL DEFAULT 0,
  discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp BETWEEN 0 AND 10000),
  position REAL NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, deal_id) REFERENCES crm_deals(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, product_id) REFERENCES crm_products(org_id, id)
);
CREATE INDEX crm_deal_items_deal ON crm_deal_items(org_id, deal_id, position);

-- Every stage or status change of a deal (stage tracking, deal ageing, sales cycle). Stage names are copied so the
-- history reads correctly after a stage is renamed or removed.
CREATE TABLE crm_deal_stage_history (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  deal_id TEXT NOT NULL,
  pipeline_id TEXT NOT NULL,
  from_stage_id TEXT,
  from_stage_name TEXT,
  to_stage_id TEXT,
  to_stage_name TEXT,
  from_status TEXT,
  to_status TEXT NOT NULL,
  time_in_stage_ms INTEGER,
  moved_by TEXT,
  moved_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, deal_id) REFERENCES crm_deals(org_id, id) ON DELETE CASCADE
);
CREATE INDEX crm_stage_history_deal ON crm_deal_stage_history(org_id, deal_id, moved_at);
CREATE INDEX crm_stage_history_org ON crm_deal_stage_history(org_id, moved_at);

CREATE TABLE crm_activities (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
  due_date TEXT,
  due_time TEXT,
  duration_min INTEGER,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','done','cancelled')),
  done_at INTEGER,
  done_by TEXT,
  outcome TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  email_direction TEXT CHECK (email_direction IS NULL OR email_direction IN ('outbound','inbound')),
  email_to TEXT NOT NULL DEFAULT '',
  email_delivery TEXT,
  contact_id TEXT,
  company_id TEXT,
  deal_id TEXT,
  lead_id TEXT,
  pm_workspace_id TEXT,
  pm_item_id TEXT,
  reminded_at INTEGER,
  search_text TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES crm_contacts(org_id, id),
  FOREIGN KEY (org_id, company_id) REFERENCES crm_companies(org_id, id),
  FOREIGN KEY (org_id, deal_id) REFERENCES crm_deals(org_id, id),
  FOREIGN KEY (org_id, lead_id) REFERENCES crm_leads(org_id, id)
);
CREATE INDEX crm_activities_due ON crm_activities(org_id, deleted_at, status, due_date);
CREATE INDEX crm_activities_assignee ON crm_activities(org_id, assigned_to, status, due_date);
CREATE INDEX crm_activities_contact ON crm_activities(org_id, contact_id);
CREATE INDEX crm_activities_company ON crm_activities(org_id, company_id);
CREATE INDEX crm_activities_deal ON crm_activities(org_id, deal_id);
CREATE INDEX crm_activities_lead ON crm_activities(org_id, lead_id);
CREATE INDEX crm_activities_done ON crm_activities(org_id, status, done_at);

-- Notes, internal comments and meeting notes on one record (exactly one of contact, company, deal or lead).
CREATE TABLE crm_notes (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'note' CHECK (kind IN ('note','comment','meeting')),
  body TEXT NOT NULL,
  contact_id TEXT,
  company_id TEXT,
  deal_id TEXT,
  lead_id TEXT,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  pinned INTEGER NOT NULL DEFAULT 0,
  mentions_json TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  CHECK ((contact_id IS NOT NULL) + (company_id IS NOT NULL) + (deal_id IS NOT NULL) + (lead_id IS NOT NULL) = 1),
  FOREIGN KEY (org_id, contact_id) REFERENCES crm_contacts(org_id, id),
  FOREIGN KEY (org_id, company_id) REFERENCES crm_companies(org_id, id),
  FOREIGN KEY (org_id, deal_id) REFERENCES crm_deals(org_id, id),
  FOREIGN KEY (org_id, lead_id) REFERENCES crm_leads(org_id, id)
);
CREATE INDEX crm_notes_contact ON crm_notes(org_id, contact_id, created_at);
CREATE INDEX crm_notes_company ON crm_notes(org_id, company_id, created_at);
CREATE INDEX crm_notes_deal ON crm_notes(org_id, deal_id, created_at);
CREATE INDEX crm_notes_lead ON crm_notes(org_id, lead_id, created_at);

-- Documents and attachments on one record, stored in the app's file store (R2 on Cloudflare, the volume on Fly).
-- A new version of a document points at the one it replaces (previous_id).
CREATE TABLE crm_files (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'document' CHECK (kind IN ('document','proposal','contract','quote','other')),
  contact_id TEXT,
  company_id TEXT,
  deal_id TEXT,
  lead_id TEXT,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  previous_id TEXT,
  uploader_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  deleted_by TEXT,
  CHECK ((contact_id IS NOT NULL) + (company_id IS NOT NULL) + (deal_id IS NOT NULL) + (lead_id IS NOT NULL) = 1),
  FOREIGN KEY (org_id, contact_id) REFERENCES crm_contacts(org_id, id),
  FOREIGN KEY (org_id, company_id) REFERENCES crm_companies(org_id, id),
  FOREIGN KEY (org_id, deal_id) REFERENCES crm_deals(org_id, id),
  FOREIGN KEY (org_id, lead_id) REFERENCES crm_leads(org_id, id)
);
CREATE INDEX crm_files_contact ON crm_files(org_id, contact_id);
CREATE INDEX crm_files_company ON crm_files(org_id, company_id);
CREATE INDEX crm_files_deal ON crm_files(org_id, deal_id);
CREATE INDEX crm_files_lead ON crm_files(org_id, lead_id);

-- The record history shown in timelines: created, changed, assigned, stage and status changes, conversions. Insert-only.
CREATE TABLE crm_events (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  actor_id TEXT,
  contact_id TEXT,
  company_id TEXT,
  deal_id TEXT,
  lead_id TEXT,
  summary TEXT NOT NULL,
  data_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE INDEX crm_events_contact ON crm_events(org_id, contact_id, created_at);
CREATE INDEX crm_events_company ON crm_events(org_id, company_id, created_at);
CREATE INDEX crm_events_deal ON crm_events(org_id, deal_id, created_at);
CREATE INDEX crm_events_lead ON crm_events(org_id, lead_id, created_at);
CREATE INDEX crm_events_org ON crm_events(org_id, created_at);

-- The audit trail of important changes (members, roles, permissions, settings, deletions, imports, exports).
-- Insert-only and without a foreign key, so it outlives what it describes. Never holds passwords, tokens or bodies.
CREATE TABLE crm_audit_log (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  actor_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  before_json TEXT,
  after_json TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX crm_audit_org ON crm_audit_log(org_id, created_at);

CREATE TABLE crm_custom_fields (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  entity TEXT NOT NULL CHECK (entity IN ('contact','company','lead','deal')),
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text','textarea','number','money','date','select','multiselect','checkbox','url','email','phone')),
  options_json TEXT NOT NULL DEFAULT '[]',
  required INTEGER NOT NULL DEFAULT 0,
  position REAL NOT NULL DEFAULT 0,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, id)
);
CREATE INDEX crm_custom_fields_org ON crm_custom_fields(org_id, entity, position);

CREATE TABLE crm_tags (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL COLLATE NOCASE,
  color TEXT NOT NULL DEFAULT '#0f766e',
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, name),
  UNIQUE (org_id, id)
);
CREATE TABLE crm_record_tags (
  org_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  entity TEXT NOT NULL CHECK (entity IN ('contact','company','lead','deal')),
  record_id TEXT NOT NULL,
  PRIMARY KEY (tag_id, entity, record_id),
  FOREIGN KEY (org_id, tag_id) REFERENCES crm_tags(org_id, id) ON DELETE CASCADE
);
CREATE INDEX crm_record_tags_record ON crm_record_tags(org_id, entity, record_id);

CREATE TABLE crm_saved_views (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity TEXT NOT NULL CHECK (entity IN ('contact','company','lead','deal','activity')),
  name TEXT NOT NULL,
  config_json TEXT NOT NULL,
  shared INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX crm_saved_views_org ON crm_saved_views(org_id, entity, user_id);

CREATE TABLE crm_notifications (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  entity_type TEXT,
  entity_id TEXT,
  actor_id TEXT,
  dedupe_key TEXT,
  read_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX crm_notifications_user ON crm_notifications(user_id, org_id, read_at, created_at);
CREATE UNIQUE INDEX crm_notifications_dedupe ON crm_notifications(user_id, dedupe_key) WHERE dedupe_key IS NOT NULL;

CREATE TABLE crm_notification_prefs (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  in_app INTEGER NOT NULL DEFAULT 1,
  email INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, type)
);

CREATE TABLE crm_automations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  trigger_type TEXT NOT NULL,
  trigger_json TEXT NOT NULL DEFAULT '{}',
  conditions_json TEXT NOT NULL DEFAULT '[]',
  actions_json TEXT NOT NULL DEFAULT '[]',
  enabled INTEGER NOT NULL DEFAULT 1,
  preset TEXT,
  run_count INTEGER NOT NULL DEFAULT 0,
  last_run_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, id)
);
CREATE INDEX crm_automations_trigger ON crm_automations(org_id, enabled, trigger_type);
CREATE INDEX crm_automations_scheduled ON crm_automations(enabled, trigger_type);

-- One row per execution; event_key is unique, so the same event never runs the same automation twice.
CREATE TABLE crm_automation_runs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  automation_id TEXT NOT NULL,
  event_key TEXT NOT NULL UNIQUE,
  trigger_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('success','failed','skipped')),
  detail TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, automation_id) REFERENCES crm_automations(org_id, id) ON DELETE CASCADE
);
CREATE INDEX crm_automation_runs_org ON crm_automation_runs(org_id, created_at);
CREATE INDEX crm_automation_runs_automation ON crm_automation_runs(automation_id, created_at);

CREATE TABLE crm_email_templates (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  shared INTEGER NOT NULL DEFAULT 1,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX crm_email_templates_org ON crm_email_templates(org_id, name);

-- Private calendar subscription addresses (iCalendar feeds of a person's CRM activities). Only the hash is stored.
CREATE TABLE crm_calendar_feeds (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  last_used_at INTEGER,
  revoked_at INTEGER
);
CREATE INDEX crm_calendar_feeds_user ON crm_calendar_feeds(org_id, user_id);

-- Mailbox connections (Gmail, Microsoft 365) for email synchronisation. The integration layer is in
-- src/worker/crm/mailbox.ts; no provider is enabled until its OAuth client is configured, so this table stays empty
-- until then. Tokens would be stored encrypted (AES-256-GCM with the settings key), never in clear.
CREATE TABLE crm_mail_connections (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES crm_orgs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('gmail','microsoft')),
  account_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','connected','error','revoked')),
  token_ciphertext TEXT,
  scopes TEXT NOT NULL DEFAULT '',
  last_sync_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, user_id, provider)
);
