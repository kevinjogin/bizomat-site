-- bizomat:foreign-keys-off
-- Reverse of migrations/0030_company_identity.sql (Stage 1, R3). Run only to take R3 back out, after a database copy,
-- with foreign keys switched off (sqlite3: PRAGMA foreign_keys = OFF before, PRAGMA foreign_key_check after).
-- It fails, and changes nothing, while any company is outside Australia or any person or invitation has a Stage 1
-- role (manager, employee, read_only): move them back first. The companies registry, company settings, the legacy id
-- record and how each email was proven are lost.
BEGIN;
DROP TABLE IF EXISTS legacy_company_id_map;
DROP TABLE IF EXISTS company_settings;
DROP TABLE IF EXISTS companies;
ALTER TABLE users DROP COLUMN email_verified_via;

CREATE TABLE co_companies_old (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('business','individual')),
  legal_name TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'AU' CHECK (country IN ('AU')),
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
INSERT INTO co_companies_old (id, name, kind, legal_name, country, abn, acn, abn_status, abr_entity_name, abr_entity_type, abr_gst_from, abr_state, abr_postcode, abr_checked_at, email, email_verified_at, phone, phone_kind, address_line1, address_line2, suburb, state, postcode, website, settings_json, created_by, created_at, updated_at, suspended_at, deleted_at) SELECT id, name, kind, legal_name, country, abn, acn, abn_status, abr_entity_name, abr_entity_type, abr_gst_from, abr_state, abr_postcode, abr_checked_at, email, email_verified_at, phone, phone_kind, address_line1, address_line2, suburb, state, postcode, website, settings_json, created_by, created_at, updated_at, suspended_at, deleted_at FROM co_companies;
DROP TABLE co_companies;
ALTER TABLE co_companies_old RENAME TO co_companies;
CREATE UNIQUE INDEX co_companies_abn ON co_companies(abn) WHERE abn IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE co_members_old (
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
INSERT INTO co_members_old (company_id, user_id, role, title, tasks_role, crm_role, fin_role, invited_by, joined_at) SELECT company_id, user_id, role, title, tasks_role, crm_role, fin_role, invited_by, joined_at FROM co_members;
DROP TABLE co_members;
ALTER TABLE co_members_old RENAME TO co_members;
CREATE INDEX co_members_user ON co_members(user_id);
CREATE UNIQUE INDEX co_members_one_owner ON co_members(company_id) WHERE role = 'owner';

CREATE TABLE co_invitations_old (
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
INSERT INTO co_invitations_old (id, company_id, email, role, title, tasks_role, crm_role, fin_role, department_ids, token_hash, invited_by, created_at, expires_at, accepted_at, accepted_by, revoked_at) SELECT id, company_id, email, role, title, tasks_role, crm_role, fin_role, department_ids, token_hash, invited_by, created_at, expires_at, accepted_at, accepted_by, revoked_at FROM co_invitations;
DROP TABLE co_invitations;
ALTER TABLE co_invitations_old RENAME TO co_invitations;
CREATE INDEX co_invitations_company ON co_invitations(company_id, accepted_at, revoked_at);

DELETE FROM d1_migrations WHERE name = '0030_company_identity.sql';
COMMIT;
