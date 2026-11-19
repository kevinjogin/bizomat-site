-- bizomat:foreign-keys-off
-- Stage 1, R3: one company identity (docs/platform/company-identity.md). Reverse:
-- migrations-reverse/0030_company_identity.sql.
--
-- 1. The one rebuild window of Stage 1. co_companies, co_members and co_invitations are rebuilt with the same names,
--    columns, ids and rows, only to widen what they accept: any country (ISO 3166 alpha-2 code), with the Australian
--    state, postcode and ABN rules kept for Australian companies, an international phone kind, a trading name, and
--    the company roles of Stage 1 (owner, admin, manager, employee, read_only). The existing role member stays valid
--    and nothing is converted here. The runner switches foreign keys off for this file (its first line) and commits
--    only when PRAGMA foreign_key_check finds nothing, so dropping the old tables cannot cascade into their children.
--    On D1 apply it only to an empty database.
-- 2. companies: one row for every company of every kind, with the same id it already has: registered companies
--    (co_companies), each person's own company (sys_companies) and example companies (sys_demo). Those tables stay as
--    they are (expand first, contract only with the owner's approval), and the app keeps this table in step
--    (src/worker/company/identity.ts). Registration number and status live here, for every country, unique per
--    country, registration type and number.
-- 3. company_settings: company-level settings, apart from the people's own preferences.
-- 4. legacy_company_id_map: where each company came from. Ids are unchanged, so it is a record, not a translation.
-- 5. users.email_verified_via: how an email was proven (link, google, admin, invitation, or legacy for emails proven
--    before this migration). No CHECK, so the reverse script can drop the column: the app writes only those values.

CREATE TABLE co_companies_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('business','individual')),
  legal_name TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'AU' CHECK (length(country) = 2 AND country NOT GLOB '*[^A-Z]*'),
  abn TEXT CHECK (abn IS NULL OR (length(abn) = 11 AND abn NOT GLOB '*[^0-9]*')),
  acn TEXT CHECK (acn IS NULL OR (length(acn) = 9 AND acn NOT GLOB '*[^0-9]*')),
  abn_status TEXT NOT NULL DEFAULT 'none' CHECK (abn_status IN ('none','format_ok','active','cancelled','not_found')),
  abr_entity_name TEXT NOT NULL DEFAULT '',
  abr_entity_type TEXT NOT NULL DEFAULT '',
  abr_gst_from TEXT,
  abr_state TEXT NOT NULL DEFAULT '',
  abr_postcode TEXT NOT NULL DEFAULT '',
  abr_checked_at INTEGER,
  email TEXT NOT NULL COLLATE NOCASE,
  email_verified_at INTEGER,
  phone TEXT NOT NULL,
  phone_kind TEXT NOT NULL CHECK (phone_kind IN ('mobile','landline','local_rate','freecall','international')),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT NOT NULL DEFAULT '',
  suburb TEXT NOT NULL,
  state TEXT NOT NULL CHECK (CASE WHEN country = 'AU' THEN state IN ('ACT','NSW','NT','QLD','SA','TAS','VIC','WA') ELSE length(state) <= 60 END),
  postcode TEXT NOT NULL CHECK (CASE WHEN country = 'AU' THEN length(postcode) = 4 AND postcode NOT GLOB '*[^0-9]*' ELSE length(postcode) <= 12 END),
  website TEXT NOT NULL DEFAULT '',
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  suspended_at INTEGER,
  deleted_at INTEGER,
  trading_name TEXT NOT NULL DEFAULT ''
);
INSERT INTO co_companies_new (id, name, kind, legal_name, country, abn, acn, abn_status, abr_entity_name, abr_entity_type, abr_gst_from, abr_state, abr_postcode, abr_checked_at, email, email_verified_at, phone, phone_kind, address_line1, address_line2, suburb, state, postcode, website, settings_json, created_by, created_at, updated_at, suspended_at, deleted_at)
  SELECT id, name, kind, legal_name, country, abn, acn, abn_status, abr_entity_name, abr_entity_type, abr_gst_from, abr_state, abr_postcode, abr_checked_at, email, email_verified_at, phone, phone_kind, address_line1, address_line2, suburb, state, postcode, website, settings_json, created_by, created_at, updated_at, suspended_at, deleted_at FROM co_companies;
DROP TABLE co_companies;
ALTER TABLE co_companies_new RENAME TO co_companies;
CREATE UNIQUE INDEX co_companies_abn ON co_companies(abn) WHERE abn IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE co_members_new (
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','manager','employee','read_only','member')),
  title TEXT NOT NULL DEFAULT '',
  tasks_role TEXT CHECK (tasks_role IS NULL OR tasks_role IN ('owner','admin','project_manager','member','viewer')),
  crm_role TEXT CHECK (crm_role IS NULL OR crm_role IN ('owner','admin','manager','sales','member','viewer')),
  fin_role TEXT CHECK (fin_role IS NULL OR fin_role IN ('owner','admin','accountant','finance_manager','contributor','viewer')),
  invited_by TEXT,
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, user_id)
);
INSERT INTO co_members_new (company_id, user_id, role, title, tasks_role, crm_role, fin_role, invited_by, joined_at)
  SELECT company_id, user_id, role, title, tasks_role, crm_role, fin_role, invited_by, joined_at FROM co_members;
DROP TABLE co_members;
ALTER TABLE co_members_new RENAME TO co_members;
CREATE INDEX co_members_user ON co_members(user_id);
CREATE UNIQUE INDEX co_members_one_owner ON co_members(company_id) WHERE role = 'owner';

CREATE TABLE co_invitations_new (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('admin','manager','employee','read_only','member')),
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
INSERT INTO co_invitations_new (id, company_id, email, role, title, tasks_role, crm_role, fin_role, department_ids, token_hash, invited_by, created_at, expires_at, accepted_at, accepted_by, revoked_at)
  SELECT id, company_id, email, role, title, tasks_role, crm_role, fin_role, department_ids, token_hash, invited_by, created_at, expires_at, accepted_at, accepted_by, revoked_at FROM co_invitations;
DROP TABLE co_invitations;
ALTER TABLE co_invitations_new RENAME TO co_invitations;
CREATE INDEX co_invitations_company ON co_invitations(company_id, accepted_at, revoked_at);

-- Registration statuses (brief 5.3): not_registered, registration_pending, verification_in_progress, verified,
-- verification_failed, manual_review, status_changed, suspended, deregistered. status_source says what set the status:
-- none, format (a number whose format was checked), registry (an official register answered), manual (a platform admin
-- decided, with a reason), system (BIZOMAT set it, for example a review asked for) or migration (carried over by this
-- file).
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('registered','personal','example')),
  name TEXT NOT NULL,
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  country TEXT CHECK (country IS NULL OR (length(country) = 2 AND country NOT GLOB '*[^A-Z]*')),
  legal_structure TEXT,
  registration_type TEXT,
  registration_number TEXT,
  registration_status TEXT NOT NULL DEFAULT 'not_registered' CHECK (registration_status IN ('not_registered','registration_pending','verification_in_progress','verified','verification_failed','manual_review','status_changed','suspended','deregistered')),
  status_source TEXT NOT NULL DEFAULT 'none' CHECK (status_source IN ('none','format','registry','manual','system','migration')),
  status_changed_at INTEGER,
  verified_at INTEGER,
  next_check_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  suspended_at INTEGER,
  deleted_at INTEGER,
  CHECK ((registration_type IS NULL) = (registration_number IS NULL))
);
CREATE UNIQUE INDEX companies_registration ON companies(country, registration_type, registration_number) WHERE registration_number IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX companies_owner ON companies(owner_id);
CREATE INDEX companies_type ON companies(type, registration_status);

-- Registered companies. The number is the ABN, else the ACN when no other company holds the same ACN. What the ABN
-- checks found is carried over without claiming more: a number whose format was checked, or that the register found
-- active, is pending (the register was never compared with the company's name), not verified. A cancelled ABN is
-- deregistered and one the register did not find goes to manual review.
INSERT INTO companies (id, type, name, owner_id, country, legal_structure, registration_type, registration_number, registration_status, status_source, status_changed_at, verified_at, next_check_at, created_at, updated_at, suspended_at, deleted_at)
  SELECT co.id, 'registered', co.name,
         (SELECT m.user_id FROM co_members m WHERE m.company_id = co.id AND m.role = 'owner'),
         co.country, co.kind,
         CASE WHEN co.abn IS NOT NULL THEN 'ABN' WHEN co.acn IS NOT NULL AND (SELECT COUNT(*) FROM co_companies x WHERE x.acn = co.acn AND x.abn IS NULL AND x.deleted_at IS NULL) = 1 THEN 'ACN' END,
         CASE WHEN co.abn IS NOT NULL THEN co.abn WHEN co.acn IS NOT NULL AND (SELECT COUNT(*) FROM co_companies x WHERE x.acn = co.acn AND x.abn IS NULL AND x.deleted_at IS NULL) = 1 THEN co.acn END,
         CASE co.abn_status WHEN 'format_ok' THEN 'registration_pending' WHEN 'active' THEN 'registration_pending' WHEN 'cancelled' THEN 'deregistered' WHEN 'not_found' THEN 'manual_review' ELSE 'not_registered' END,
         CASE co.abn_status WHEN 'none' THEN 'none' ELSE 'migration' END,
         CASE co.abn_status WHEN 'none' THEN NULL ELSE COALESCE(co.abr_checked_at, co.updated_at) END,
         NULL, NULL, co.created_at, co.updated_at, co.suspended_at, co.deleted_at
    FROM co_companies co;

-- Each person's own company (not registered) and example companies (invented data, never registered).
INSERT INTO companies (id, type, name, owner_id, created_at, updated_at)
  SELECT s.id, 'personal', s.name, s.owner_id, s.created_at, s.updated_at FROM sys_companies s;
INSERT INTO companies (id, type, name, owner_id, created_at, updated_at, deleted_at)
  SELECT d.company_id, 'example', d.name, d.user_id, d.created_at, d.updated_at, CASE WHEN d.status = 'removed' THEN COALESCE(d.removed_at, d.updated_at) END FROM sys_demo d;

CREATE TABLE company_settings (
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, key)
);

CREATE TABLE legacy_company_id_map (
  company_id TEXT PRIMARY KEY,
  legacy_table TEXT NOT NULL CHECK (legacy_table IN ('co_companies','sys_companies','sys_demo')),
  legacy_id TEXT NOT NULL,
  recorded_at INTEGER NOT NULL
);
INSERT INTO legacy_company_id_map (company_id, legacy_table, legacy_id, recorded_at) SELECT id, 'co_companies', id, CAST(strftime('%s','now') AS INTEGER) * 1000 FROM co_companies;
INSERT INTO legacy_company_id_map (company_id, legacy_table, legacy_id, recorded_at) SELECT id, 'sys_companies', id, CAST(strftime('%s','now') AS INTEGER) * 1000 FROM sys_companies;
INSERT INTO legacy_company_id_map (company_id, legacy_table, legacy_id, recorded_at) SELECT company_id, 'sys_demo', user_id, CAST(strftime('%s','now') AS INTEGER) * 1000 FROM sys_demo;

ALTER TABLE users ADD COLUMN email_verified_via TEXT;
UPDATE users SET email_verified_via = 'legacy' WHERE email_verified_at IS NOT NULL;
