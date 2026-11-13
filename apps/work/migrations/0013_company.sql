-- BIZOMAT company accounts (owner's request, 13 Nov 2026): one company account over Project Management, the CRM and
-- Finance, served at /company by this app (same Worker, database, accounts and session). People work as a company,
-- not as individuals; a person who trades under their own name registers a company of kind 'individual'.
--
-- Additive: new co_* and id_* tables and indexes only; no existing table, column or row is changed. The tools keep
-- their own tables: a company links one Project Management workspace, one CRM organisation and one Finance business
-- workspace (co_tools), and keeps its people and departments in step with them (src/worker/company/sync.ts).
-- Personal and household Finance workspaces are never linked to a company: they stay private to their members.
--
-- Registration is checked, never taken on trust (src/worker/company/verify.ts): the ABN's check digits, and the
-- Australian Business Register's record when ABR_GUID is set (status, entity name, GST, state and postcode); the
-- email address as for sign-up (mail servers, disposable domains) and confirmed by a link; the phone number against
-- the Australian numbering plan; the postcode against the state. What was checked, and how, is stored with the company.
--
-- Links point one way only (parents first), as the data tooling needs (scripts/migrate/lib/d1-sql.mjs).

CREATE TABLE co_companies (
  id TEXT PRIMARY KEY,
  -- The name people see: the trading name, or the person's own name for kind 'individual'.
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('business','individual')),
  legal_name TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'AU' CHECK (country IN ('AU')),
  -- Australian Business Number: 11 digits with valid check digits. Required for kind 'business'.
  abn TEXT CHECK (abn IS NULL OR (length(abn) = 11 AND abn NOT GLOB '*[^0-9]*')),
  acn TEXT CHECK (acn IS NULL OR (length(acn) = 9 AND acn NOT GLOB '*[^0-9]*')),
  -- none: no ABN given (individuals only); format_ok: check digits valid, not yet confirmed with the ABR;
  -- active / cancelled / not_found: the ABR's answer.
  abn_status TEXT NOT NULL DEFAULT 'none' CHECK (abn_status IN ('none','format_ok','active','cancelled','not_found')),
  abr_entity_name TEXT NOT NULL DEFAULT '',
  abr_entity_type TEXT NOT NULL DEFAULT '',
  abr_gst_from TEXT,
  abr_state TEXT NOT NULL DEFAULT '',
  abr_postcode TEXT NOT NULL DEFAULT '',
  abr_checked_at INTEGER,
  email TEXT NOT NULL COLLATE NOCASE,
  email_verified_at INTEGER,
  -- E.164 (+61...) for mobile and geographic numbers; 13, 1300 and 1800 numbers as dialled in Australia.
  phone TEXT NOT NULL,
  phone_kind TEXT NOT NULL CHECK (phone_kind IN ('mobile','landline','local_rate','freecall')),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT NOT NULL DEFAULT '',
  suburb TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('ACT','NSW','NT','QLD','SA','TAS','VIC','WA')),
  postcode TEXT NOT NULL CHECK (length(postcode) = 4 AND postcode NOT GLOB '*[^0-9]*'),
  website TEXT NOT NULL DEFAULT '',
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  suspended_at INTEGER,
  deleted_at INTEGER
);
-- One company account per ABN.
CREATE UNIQUE INDEX co_companies_abn ON co_companies(abn) WHERE abn IS NOT NULL AND deleted_at IS NULL;

-- People of a company: a company role, and a role in each linked tool (NULL: no access to that tool). The owner is the
-- owner of every linked tool.
CREATE TABLE co_members (
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','member')),
  title TEXT NOT NULL DEFAULT '',
  tasks_role TEXT CHECK (tasks_role IS NULL OR tasks_role IN ('owner','admin','project_manager','member','viewer')),
  crm_role TEXT CHECK (crm_role IS NULL OR crm_role IN ('owner','admin','manager','sales','member','viewer')),
  fin_role TEXT CHECK (fin_role IS NULL OR fin_role IN ('owner','admin','accountant','finance_manager','contributor','viewer')),
  invited_by TEXT,
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, user_id)
);
CREATE INDEX co_members_user ON co_members(user_id);
CREATE UNIQUE INDEX co_members_one_owner ON co_members(company_id) WHERE role = 'owner';

CREATE TABLE co_invitations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('admin','member')),
  title TEXT NOT NULL DEFAULT '',
  tasks_role TEXT CHECK (tasks_role IS NULL OR tasks_role IN ('admin','project_manager','member','viewer')),
  crm_role TEXT CHECK (crm_role IS NULL OR crm_role IN ('admin','manager','sales','member','viewer')),
  fin_role TEXT CHECK (fin_role IS NULL OR fin_role IN ('admin','accountant','finance_manager','contributor','viewer')),
  department_ids TEXT NOT NULL DEFAULT '[]',
  token_hash TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  accepted_at INTEGER,
  accepted_by TEXT,
  revoked_at INTEGER
);
CREATE INDEX co_invitations_company ON co_invitations(company_id, accepted_at, revoked_at);

-- The tools a company runs: one of each, and each tool belongs to at most one company.
CREATE TABLE co_tools (
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  app TEXT NOT NULL CHECK (app IN ('tasks','crm','finance')),
  ref_id TEXT NOT NULL,
  linked_by TEXT,
  linked_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, app),
  UNIQUE (app, ref_id)
);

-- Departments, made once in the company: a team in Project Management and in the CRM, a department in Finance's
-- tracking. A department may sit under another (parent_id), one level or many.
CREATE TABLE co_departments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  parent_id TEXT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  head_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  pm_team_id TEXT,
  crm_team_id TEXT,
  fin_tracking_id TEXT,
  created_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, parent_id) REFERENCES co_departments(company_id, id)
);
CREATE INDEX co_departments_company ON co_departments(company_id, archived_at);

CREATE TABLE co_department_members (
  company_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  added_at INTEGER NOT NULL,
  PRIMARY KEY (department_id, user_id),
  FOREIGN KEY (company_id, department_id) REFERENCES co_departments(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, user_id) REFERENCES co_members(company_id, user_id) ON DELETE CASCADE
);
CREATE INDEX co_department_members_user ON co_department_members(company_id, user_id);

-- Confirmation links for a company's contact address (when it is not the owner's own confirmed sign-in address).
CREATE TABLE co_email_confirmations (
  token_hash TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);

-- The company's own activity log: who changed what (never record contents).
CREATE TABLE co_audit (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  actor_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX co_audit_company ON co_audit(company_id, created_at);

-- BIZOMAT sign-in for other BIZOMAT applications (CAD Automation): OAuth 2.0 authorization codes (PKCE S256) and
-- access tokens, stored as SHA-256 hashes only. The clients themselves are configured, not stored (BIZOMAT_ID_CLIENTS).
CREATE TABLE id_auth_codes (
  code_hash TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  redirect_uri TEXT NOT NULL,
  code_challenge TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE TABLE id_access_tokens (
  token_hash TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX id_access_tokens_user ON id_access_tokens(user_id);
