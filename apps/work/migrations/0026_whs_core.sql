-- BIZOMAT WHS, Release 1 (the core): a Work Health & Safety Management System inside BIZOMAT ERP, served by this app
-- with the same accounts, session, database and files (docs/whs/README.md). Additive: only new whs_ tables, their
-- indexes, and triggers on these new tables (the audit trails are append-only; incidents, health records, rule checks
-- and regulator notices are never deleted). No earlier table is changed.
--
-- Kinds, categories and types (hazard categories, incident kinds, instrument kinds, rule kinds, sources of actions,
-- hierarchy of controls) are checked by the code (src/worker/whs/util.ts) with a length check here, so later releases can
-- add to them; statuses are listed in CHECKs.
--
-- Jurisdiction packs, their instruments and rules are platform data (no company), kept by BIZOMAT platform
-- administrators. Every seeded instrument and rule is "Not verified" until a platform administrator verifies it against
-- the official source in the app. A rule applies to an incident only when it is active, verified and in effect on the
-- incident's date; each evaluation is kept as a snapshot (whs_rule_checks), so later rule versions never change it.

-- ------------------------------------------------------------------ jurisdiction packs (platform data)

CREATE TABLE whs_packs (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL CHECK (length(country) = 2),
  region TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  framework TEXT NOT NULL DEFAULT '',
  regulator TEXT NOT NULL DEFAULT '',
  regulator_url TEXT NOT NULL DEFAULT '',
  -- 0: a reference pack (the model laws) that applies to no site
  assignable INTEGER NOT NULL DEFAULT 1 CHECK (assignable IN (0, 1)),
  -- core (the Australian packs of Release 1), skeleton (regulator and primary legislation only), reference
  coverage TEXT NOT NULL DEFAULT 'skeleton' CHECK (length(coverage) BETWEEN 1 AND 20),
  notes TEXT NOT NULL DEFAULT '',
  -- moves on whenever an instrument or a rule version of the pack is activated, verified or changed
  version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  sort INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Legislation, regulations, approved codes of practice, standards, government guidance and model laws of a pack.
CREATE TABLE whs_instruments (
  id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL REFERENCES whs_packs(id),
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
  citation TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL CHECK (length(source_url) BETWEEN 8 AND 500),
  effective_from TEXT,
  amended_at TEXT,
  summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'not_verified' CHECK (status IN ('not_verified', 'verified', 'retired')),
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at INTEGER,
  verified_source TEXT NOT NULL DEFAULT '',
  verified_notes TEXT NOT NULL DEFAULT '',
  verify_sod INTEGER NOT NULL DEFAULT 0 CHECK (verify_sod IN (0, 1)),
  -- what the session that seeded it could check, and when (never a verification)
  source_check TEXT NOT NULL DEFAULT '',
  sort INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX whs_instruments_pack ON whs_instruments(pack_id, sort);

-- Versioned rules: notifiable incident categories and deadlines, required information, site preservation, record
-- retention, exposure limits. The rule in effect on a date for a rule key is the active version whose effective range
-- covers it (the latest effective_from, then the highest version). It applies only when verified.
CREATE TABLE whs_rules (
  id TEXT PRIMARY KEY,
  rule_key TEXT NOT NULL CHECK (length(rule_key) BETWEEN 1 AND 80),
  version INTEGER NOT NULL CHECK (version >= 1),
  pack_id TEXT NOT NULL REFERENCES whs_packs(id),
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
  instrument_id TEXT REFERENCES whs_instruments(id),
  provision TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL CHECK (length(source_url) BETWEEN 8 AND 500),
  effective_from TEXT,
  effective_to TEXT,
  body TEXT NOT NULL DEFAULT '',
  -- which incidents it covers (incident kinds, outcomes): used only once the rule is verified
  criteria_json TEXT NOT NULL DEFAULT '{}',
  deadline_minutes INTEGER CHECK (deadline_minutes IS NULL OR deadline_minutes > 0),
  deadline_from TEXT NOT NULL DEFAULT 'awareness' CHECK (deadline_from IN ('awareness', 'occurrence')),
  deadline_text TEXT NOT NULL DEFAULT '',
  required_info_json TEXT NOT NULL DEFAULT '[]',
  site_preservation TEXT NOT NULL DEFAULT '',
  responsible_party TEXT NOT NULL DEFAULT '',
  procedure_text TEXT NOT NULL DEFAULT '',
  retention TEXT NOT NULL DEFAULT '',
  regulator TEXT NOT NULL DEFAULT '',
  notify_url TEXT NOT NULL DEFAULT '',
  change_note TEXT NOT NULL DEFAULT '',
  source_check TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'reviewed', 'active', 'withdrawn')),
  verification TEXT NOT NULL DEFAULT 'not_verified' CHECK (verification IN ('not_verified', 'verified')),
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at INTEGER,
  verified_source TEXT NOT NULL DEFAULT '',
  verified_notes TEXT NOT NULL DEFAULT '',
  verify_sod INTEGER NOT NULL DEFAULT 0 CHECK (verify_sod IN (0, 1)),
  drafted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at INTEGER,
  review_notes TEXT NOT NULL DEFAULT '',
  review_sod INTEGER NOT NULL DEFAULT 0 CHECK (review_sod IN (0, 1)),
  activated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  activated_at INTEGER,
  withdrawn_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  withdrawn_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (rule_key, version),
  CHECK (effective_from IS NULL OR effective_to IS NULL OR effective_from <= effective_to),
  CHECK (verification = 'not_verified' OR (verified_at IS NOT NULL AND effective_from IS NOT NULL))
);
CREATE INDEX whs_rules_pack ON whs_rules(pack_id, kind, status);
-- one version of a rule being drafted or reviewed at a time
CREATE UNIQUE INDEX whs_rules_one_open ON whs_rules(rule_key) WHERE status IN ('draft', 'in_review', 'reviewed');

-- The legal update history (platform): every change to a pack, instrument or rule, with before and after.
CREATE TABLE whs_legal_events (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  pack_id TEXT,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX whs_legal_events_pack ON whs_legal_events(pack_id, created_at);
CREATE INDEX whs_legal_events_entity ON whs_legal_events(entity_type, entity_id, created_at);
CREATE TRIGGER whs_legal_events_append_only BEFORE UPDATE OF id, action, pack_id, entity_type, entity_id, summary, before_json, after_json, created_at ON whs_legal_events BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: the legal update history is append-only'); END;
CREATE TRIGGER whs_legal_events_no_delete BEFORE DELETE ON whs_legal_events BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: the legal update history is append-only'); END;

-- Platform settings of WHS (the version of the seeded packs).
CREATE TABLE whs_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- ------------------------------------------------------------------ company settings

-- Whole-company removal (the example company, on its owner's request): written first in the same transaction, so the
-- triggers that protect incidents and audit trails let that one removal through, and taken out at the end.
CREATE TABLE whs_purges (
  company_id TEXT PRIMARY KEY,
  started_at INTEGER NOT NULL
);

CREATE TABLE whs_counters (
  company_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  value INTEGER NOT NULL,
  PRIMARY KEY (company_id, kind)
);

-- Risk matrices: each change is a new version, so an assessment keeps the matrix it was rated on.
CREATE TABLE whs_matrices (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version >= 1),
  matrix_json TEXT NOT NULL CHECK (length(matrix_json) BETWEEN 2 AND 20000),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, version)
);

CREATE TABLE whs_settings (
  company_id TEXT PRIMARY KEY,
  matrix_id TEXT,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (company_id, matrix_id) REFERENCES whs_matrices(company_id, id)
);

-- The jurisdictions of each site (Maintenance's sites, mt_sites): one or more per site.
CREATE TABLE whs_site_packs (
  company_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  pack_id TEXT NOT NULL REFERENCES whs_packs(id),
  assigned_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  assigned_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, site_id, pack_id),
  FOREIGN KEY (company_id, site_id) REFERENCES mt_sites(company_id, id)
);
CREATE INDEX whs_site_packs_pack ON whs_site_packs(pack_id);

-- Hours worked per site and month, entered by a WHS manager, so injury frequency rates can be worked out. '' is hours
-- not split by site.
CREATE TABLE whs_hours (
  company_id TEXT NOT NULL,
  site_id TEXT NOT NULL DEFAULT '',
  month TEXT NOT NULL CHECK (length(month) = 7),
  hours REAL NOT NULL CHECK (hours >= 0 AND hours <= 100000000),
  entered_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  entered_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, site_id, month)
);

-- The company's own policies, shown beside the packs' instruments. Internal: never law.
CREATE TABLE whs_policies (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
  pack_id TEXT REFERENCES whs_packs(id),
  summary TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  effective_from TEXT,
  review_date TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'retired')),
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, number)
);

-- ------------------------------------------------------------------ hazard register

CREATE TABLE whs_hazards (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (length(category) BETWEEN 1 AND 40),
  site_id TEXT,
  location TEXT NOT NULL DEFAULT '',
  department_id TEXT,
  asset_id TEXT,
  activity TEXT NOT NULL DEFAULT '',
  people_exposed TEXT NOT NULL DEFAULT '',
  consequence_text TEXT NOT NULL DEFAULT '',
  existing_controls TEXT NOT NULL DEFAULT '',
  proposed_controls TEXT NOT NULL DEFAULT '',
  likelihood INTEGER CHECK (likelihood IS NULL OR likelihood BETWEEN 1 AND 9),
  consequence INTEGER CHECK (consequence IS NULL OR consequence BETWEEN 1 AND 9),
  risk_level TEXT CHECK (risk_level IS NULL OR length(risk_level) BETWEEN 1 AND 30),
  risk_rank INTEGER,
  matrix_id TEXT,
  residual_likelihood INTEGER CHECK (residual_likelihood IS NULL OR residual_likelihood BETWEEN 1 AND 9),
  residual_consequence INTEGER CHECK (residual_consequence IS NULL OR residual_consequence BETWEEN 1 AND 9),
  residual_level TEXT CHECK (residual_level IS NULL OR length(residual_level) BETWEEN 1 AND 30),
  residual_rank INTEGER,
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'assessment', 'controls_assigned', 'implementation', 'verification', 'closed', 'cancelled')),
  confidential INTEGER NOT NULL DEFAULT 0 CHECK (confidential IN (0, 1)),
  reported_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  assessed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  assessed_at INTEGER,
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at INTEGER,
  verification_note TEXT NOT NULL DEFAULT '',
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  closure_note TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, number),
  FOREIGN KEY (company_id, matrix_id) REFERENCES whs_matrices(company_id, id)
);
CREATE INDEX whs_hazards_status ON whs_hazards(company_id, status, created_at);
CREATE INDEX whs_hazards_reporter ON whs_hazards(company_id, reported_by);
CREATE INDEX whs_hazards_responsible ON whs_hazards(company_id, responsible_id, status);

-- ------------------------------------------------------------------ risk assessments

-- A risk assessment (JSA, JHA, SWMS, task, workplace, plant, chemical, manual handling, construction, environmental,
-- psychosocial, contractor). Revisions share the number; one draft or submitted and one approved per number.
CREATE TABLE whs_risk_assessments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision >= 1),
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  activity TEXT NOT NULL DEFAULT '',
  scope TEXT NOT NULL DEFAULT '',
  site_id TEXT,
  location TEXT NOT NULL DEFAULT '',
  department_id TEXT,
  asset_id TEXT,
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  review_date TEXT,
  matrix_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'superseded', 'cancelled')),
  confidential INTEGER NOT NULL DEFAULT 0 CHECK (confidential IN (0, 1)),
  -- why this revision was made: a change in the work, equipment, controls or circumstances, a review, an incident
  review_trigger TEXT NOT NULL DEFAULT '' CHECK (length(review_trigger) <= 30),
  review_reason TEXT NOT NULL DEFAULT '',
  drafted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  approval_note TEXT NOT NULL DEFAULT '',
  approval_sod INTEGER NOT NULL DEFAULT 0 CHECK (approval_sod IN (0, 1)),
  warnings_acknowledged INTEGER NOT NULL DEFAULT 0 CHECK (warnings_acknowledged IN (0, 1)),
  superseded_at INTEGER,
  search TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, number, revision),
  FOREIGN KEY (company_id, matrix_id) REFERENCES whs_matrices(company_id, id)
);
CREATE INDEX whs_ra_status ON whs_risk_assessments(company_id, status, review_date);
CREATE UNIQUE INDEX whs_ra_one_open ON whs_risk_assessments(company_id, number) WHERE status IN ('draft', 'submitted');
CREATE UNIQUE INDEX whs_ra_one_approved ON whs_risk_assessments(company_id, number) WHERE status = 'approved';

CREATE TABLE whs_ra_steps (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  ra_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  step TEXT NOT NULL CHECK (length(step) BETWEEN 1 AND 500),
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, ra_id) REFERENCES whs_risk_assessments(company_id, id)
);
CREATE INDEX whs_ra_steps_ra ON whs_ra_steps(company_id, ra_id, seq);

-- A hazard of an assessment (with its step, if any): the harm, who is affected, the initial and residual rating.
CREATE TABLE whs_ra_hazards (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  ra_id TEXT NOT NULL,
  step_id TEXT,
  hazard_id TEXT,
  seq INTEGER NOT NULL,
  hazard TEXT NOT NULL CHECK (length(hazard) BETWEEN 1 AND 500),
  harm TEXT NOT NULL DEFAULT '',
  persons TEXT NOT NULL DEFAULT '',
  likelihood INTEGER NOT NULL CHECK (likelihood BETWEEN 1 AND 9),
  consequence INTEGER NOT NULL CHECK (consequence BETWEEN 1 AND 9),
  level TEXT NOT NULL,
  rank INTEGER NOT NULL,
  residual_likelihood INTEGER CHECK (residual_likelihood IS NULL OR residual_likelihood BETWEEN 1 AND 9),
  residual_consequence INTEGER CHECK (residual_consequence IS NULL OR residual_consequence BETWEEN 1 AND 9),
  residual_level TEXT,
  residual_rank INTEGER,
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, ra_id) REFERENCES whs_risk_assessments(company_id, id)
);
CREATE INDEX whs_ra_hazards_ra ON whs_ra_hazards(company_id, ra_id, seq);

-- A control of a hazard line, tagged with its place in the hierarchy of controls.
CREATE TABLE whs_ra_controls (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  ra_id TEXT NOT NULL,
  line_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('existing', 'additional')),
  hierarchy TEXT NOT NULL CHECK (length(hierarchy) BETWEEN 1 AND 30),
  description TEXT NOT NULL CHECK (length(description) BETWEEN 1 AND 500),
  effectiveness TEXT NOT NULL DEFAULT 'not_assessed' CHECK (length(effectiveness) BETWEEN 1 AND 30),
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, ra_id) REFERENCES whs_risk_assessments(company_id, id),
  FOREIGN KEY (company_id, line_id) REFERENCES whs_ra_hazards(company_id, id)
);
CREATE INDEX whs_ra_controls_line ON whs_ra_controls(company_id, line_id, seq);

-- ------------------------------------------------------------------ incidents

CREATE TABLE whs_incidents (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 40),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  description TEXT NOT NULL DEFAULT '',
  occurred_date TEXT NOT NULL CHECK (length(occurred_date) = 10),
  occurred_time TEXT NOT NULL DEFAULT '',
  occurred_at INTEGER NOT NULL,
  aware_at INTEGER NOT NULL,
  site_id TEXT,
  location TEXT NOT NULL DEFAULT '',
  department_id TEXT,
  activity TEXT NOT NULL DEFAULT '',
  people_involved TEXT NOT NULL DEFAULT '',
  witnesses TEXT NOT NULL DEFAULT '',
  asset_id TEXT,
  assets_text TEXT NOT NULL DEFAULT '',
  immediate_response TEXT NOT NULL DEFAULT '',
  first_aid INTEGER NOT NULL DEFAULT 0 CHECK (first_aid IN (0, 1)),
  initial_notification TEXT NOT NULL DEFAULT '',
  -- what happened to the person (none, first aid, medical treatment, lost time, ...): the classification, not the
  -- medical details, which are in whs_health
  outcome TEXT NOT NULL DEFAULT 'none' CHECK (length(outcome) BETWEEN 1 AND 30),
  body_part TEXT NOT NULL DEFAULT '',
  injury_nature TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'minor' CHECK (length(severity) BETWEEN 1 AND 20),
  serious INTEGER NOT NULL DEFAULT 0 CHECK (serious IN (0, 1)),
  investigation_required INTEGER NOT NULL DEFAULT 0 CHECK (investigation_required IN (0, 1)),
  confidential INTEGER NOT NULL DEFAULT 0 CHECK (confidential IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'immediate_response', 'classified', 'investigation', 'corrective_action', 'verification', 'closed')),
  -- flagged by a verified rule in effect (a prompt for a person, never a decision)
  potentially_notifiable INTEGER NOT NULL DEFAULT 0 CHECK (potentially_notifiable IN (0, 1)),
  -- not_assessed, assessing, not_notifiable, notifiable, submitted: worked out from the notice records
  notification_status TEXT NOT NULL DEFAULT 'not_assessed' CHECK (notification_status IN ('not_assessed', 'assessing', 'not_notifiable', 'notifiable', 'submitted')),
  reported_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  responded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  responded_at INTEGER,
  classified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  classified_at INTEGER,
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at INTEGER,
  verification_note TEXT NOT NULL DEFAULT '',
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  closure_note TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, number)
);
CREATE INDEX whs_incidents_status ON whs_incidents(company_id, status, occurred_date);
CREATE INDEX whs_incidents_date ON whs_incidents(company_id, occurred_date);
CREATE INDEX whs_incidents_reporter ON whs_incidents(company_id, reported_by);
-- An incident is never deleted (only the example company's removal passes, through whs_purges).
CREATE TRIGGER whs_incidents_no_delete BEFORE DELETE ON whs_incidents WHEN NOT EXISTS (SELECT 1 FROM whs_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'WHS_PROTECTED: an incident record cannot be deleted'); END;

-- Every change to an incident once it is classified, written by the database itself: the record's fields before and
-- after, whenever one of them changes (an update of updated_at alone writes nothing). Append-only.
CREATE TABLE whs_incident_revisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  before_json TEXT NOT NULL,
  after_json TEXT NOT NULL,
  changed_at INTEGER NOT NULL
);
CREATE INDEX whs_incident_revisions_incident ON whs_incident_revisions(company_id, incident_id, changed_at);
CREATE TRIGGER whs_incidents_track AFTER UPDATE ON whs_incidents WHEN OLD.classified_at IS NOT NULL AND (OLD.kind IS NOT NEW.kind OR OLD.title IS NOT NEW.title OR OLD.description IS NOT NEW.description OR OLD.occurred_date IS NOT NEW.occurred_date OR OLD.occurred_time IS NOT NEW.occurred_time OR OLD.site_id IS NOT NEW.site_id OR OLD.location IS NOT NEW.location OR OLD.department_id IS NOT NEW.department_id OR OLD.activity IS NOT NEW.activity OR OLD.people_involved IS NOT NEW.people_involved OR OLD.witnesses IS NOT NEW.witnesses OR OLD.asset_id IS NOT NEW.asset_id OR OLD.assets_text IS NOT NEW.assets_text OR OLD.immediate_response IS NOT NEW.immediate_response OR OLD.first_aid IS NOT NEW.first_aid OR OLD.outcome IS NOT NEW.outcome OR OLD.body_part IS NOT NEW.body_part OR OLD.injury_nature IS NOT NEW.injury_nature OR OLD.severity IS NOT NEW.severity OR OLD.investigation_required IS NOT NEW.investigation_required OR OLD.confidential IS NOT NEW.confidential OR OLD.status IS NOT NEW.status OR OLD.potentially_notifiable IS NOT NEW.potentially_notifiable OR OLD.notification_status IS NOT NEW.notification_status) BEGIN INSERT INTO whs_incident_revisions (id, company_id, incident_id, before_json, after_json, changed_at) VALUES (lower(hex(randomblob(12))), NEW.company_id, NEW.id, json_object('kind', OLD.kind, 'title', OLD.title, 'description', OLD.description, 'occurred_date', OLD.occurred_date, 'occurred_time', OLD.occurred_time, 'site_id', OLD.site_id, 'location', OLD.location, 'department_id', OLD.department_id, 'activity', OLD.activity, 'people_involved', OLD.people_involved, 'witnesses', OLD.witnesses, 'asset_id', OLD.asset_id, 'assets_text', OLD.assets_text, 'immediate_response', OLD.immediate_response, 'first_aid', OLD.first_aid, 'outcome', OLD.outcome, 'body_part', OLD.body_part, 'injury_nature', OLD.injury_nature, 'severity', OLD.severity, 'investigation_required', OLD.investigation_required, 'confidential', OLD.confidential, 'status', OLD.status, 'potentially_notifiable', OLD.potentially_notifiable, 'notification_status', OLD.notification_status), json_object('kind', NEW.kind, 'title', NEW.title, 'description', NEW.description, 'occurred_date', NEW.occurred_date, 'occurred_time', NEW.occurred_time, 'site_id', NEW.site_id, 'location', NEW.location, 'department_id', NEW.department_id, 'activity', NEW.activity, 'people_involved', NEW.people_involved, 'witnesses', NEW.witnesses, 'asset_id', NEW.asset_id, 'assets_text', NEW.assets_text, 'immediate_response', NEW.immediate_response, 'first_aid', NEW.first_aid, 'outcome', NEW.outcome, 'body_part', NEW.body_part, 'injury_nature', NEW.injury_nature, 'severity', NEW.severity, 'investigation_required', NEW.investigation_required, 'confidential', NEW.confidential, 'status', NEW.status, 'potentially_notifiable', NEW.potentially_notifiable, 'notification_status', NEW.notification_status), CAST(strftime('%s', 'now') AS INTEGER) * 1000); END;
CREATE TRIGGER whs_incident_revisions_append_only BEFORE UPDATE ON whs_incident_revisions BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: incident revisions are append-only'); END;
CREATE TRIGGER whs_incident_revisions_no_delete BEFORE DELETE ON whs_incident_revisions WHEN NOT EXISTS (SELECT 1 FROM whs_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: incident revisions are append-only'); END;

-- Confidential health information of an incident (medical treatment details): its own table, read only by health
-- officers (src/worker/whs/access.ts). Never in the incident's history values.
CREATE TABLE whs_health (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  person_name TEXT NOT NULL DEFAULT '',
  person_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  treatment TEXT NOT NULL DEFAULT '',
  provider TEXT NOT NULL DEFAULT '',
  restrictions TEXT NOT NULL DEFAULT '',
  days_lost INTEGER CHECK (days_lost IS NULL OR days_lost BETWEEN 0 AND 3650),
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, incident_id),
  FOREIGN KEY (company_id, incident_id) REFERENCES whs_incidents(company_id, id)
);
CREATE TRIGGER whs_health_no_delete BEFORE DELETE ON whs_health WHEN NOT EXISTS (SELECT 1 FROM whs_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'WHS_PROTECTED: a health record cannot be deleted'); END;

-- One investigation per incident: team, timeline, statements, evidence, five whys and fishbone, contributing factors and
-- failed controls; approved by someone who did not lead it.
CREATE TABLE whs_investigations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  lead_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'submitted', 'approved')),
  method TEXT NOT NULL DEFAULT 'five_whys' CHECK (length(method) BETWEEN 1 AND 30),
  scope TEXT NOT NULL DEFAULT '',
  whys_json TEXT NOT NULL DEFAULT '[]',
  fishbone_json TEXT NOT NULL DEFAULT '{}',
  root_cause TEXT NOT NULL DEFAULT '',
  factors_json TEXT NOT NULL DEFAULT '[]',
  failed_controls_json TEXT NOT NULL DEFAULT '[]',
  findings TEXT NOT NULL DEFAULT '',
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  approval_note TEXT NOT NULL DEFAULT '',
  approval_sod INTEGER NOT NULL DEFAULT 0 CHECK (approval_sod IN (0, 1)),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, number),
  UNIQUE (company_id, incident_id),
  FOREIGN KEY (company_id, incident_id) REFERENCES whs_incidents(company_id, id)
);

CREATE TABLE whs_inv_team (
  company_id TEXT NOT NULL,
  investigation_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  added_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  added_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, investigation_id, user_id),
  FOREIGN KEY (company_id, investigation_id) REFERENCES whs_investigations(company_id, id)
);
CREATE INDEX whs_inv_team_user ON whs_inv_team(company_id, user_id);

CREATE TABLE whs_inv_timeline (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  investigation_id TEXT NOT NULL,
  at_text TEXT NOT NULL CHECK (length(at_text) BETWEEN 1 AND 40),
  description TEXT NOT NULL CHECK (length(description) BETWEEN 1 AND 1000),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, investigation_id) REFERENCES whs_investigations(company_id, id)
);
CREATE INDEX whs_inv_timeline_inv ON whs_inv_timeline(company_id, investigation_id, at_text);

CREATE TABLE whs_inv_statements (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  investigation_id TEXT NOT NULL,
  witness TEXT NOT NULL CHECK (length(witness) BETWEEN 1 AND 200),
  taken_on TEXT,
  statement TEXT NOT NULL CHECK (length(statement) BETWEEN 1 AND 10000),
  taken_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, investigation_id) REFERENCES whs_investigations(company_id, id)
);
CREATE INDEX whs_inv_statements_inv ON whs_inv_statements(company_id, investigation_id, created_at);

-- ------------------------------------------------------------------ regulatory notification

-- Each evaluation of an incident against the rules of its site's jurisdictions: a snapshot of the rule version as it
-- stood then (whether it was verified and in effect, what it covers, the due time it gives). Append-only.
CREATE TABLE whs_rule_checks (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  evaluation_id TEXT NOT NULL,
  pack_id TEXT NOT NULL,
  site_id TEXT,
  rule_id TEXT NOT NULL,
  rule_key TEXT NOT NULL,
  rule_version INTEGER NOT NULL,
  verified INTEGER NOT NULL CHECK (verified IN (0, 1)),
  -- 1: covered by the rule's criteria; 0: not covered; NULL: not checked because the rule is not verified
  matches INTEGER CHECK (matches IS NULL OR matches IN (0, 1)),
  due_at INTEGER,
  snapshot_json TEXT NOT NULL,
  -- plain ids (no foreign key): an append-only record keeps who did it
  evaluated_by TEXT,
  evaluated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, incident_id) REFERENCES whs_incidents(company_id, id)
);
CREATE INDEX whs_rule_checks_incident ON whs_rule_checks(company_id, incident_id, evaluated_at);
CREATE TRIGGER whs_rule_checks_append_only BEFORE UPDATE ON whs_rule_checks BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: rule checks are append-only'); END;
CREATE TRIGGER whs_rule_checks_no_delete BEFORE DELETE ON whs_rule_checks WHEN NOT EXISTS (SELECT 1 FROM whs_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: rule checks are append-only'); END;

-- The notification of an incident to one jurisdiction's regulator: the decision (made by an authorised person, never by
-- the system), the person responsible for notifying, the checklist, and the submission as a person recorded it. BIZOMAT
-- does not submit to regulators.
CREATE TABLE whs_reg_notices (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  pack_id TEXT NOT NULL,
  rule_check_id TEXT,
  regulator TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'assessing' CHECK (status IN ('assessing', 'not_notifiable', 'to_submit', 'submitted')),
  decision TEXT CHECK (decision IS NULL OR decision IN ('notifiable', 'not_notifiable')),
  decision_reasons TEXT NOT NULL DEFAULT '',
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at INTEGER,
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  due_at INTEGER,
  due_note TEXT NOT NULL DEFAULT '',
  checklist_json TEXT NOT NULL DEFAULT '[]',
  method TEXT CHECK (method IS NULL OR length(method) BETWEEN 1 AND 30),
  submitted_at INTEGER,
  -- a plain id (no foreign key): a recorded submission keeps who made it
  submitted_by TEXT,
  reference TEXT,
  submission_notes TEXT NOT NULL DEFAULT '',
  recorded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  recorded_at INTEGER,
  example INTEGER NOT NULL DEFAULT 0 CHECK (example IN (0, 1)),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, incident_id, pack_id),
  FOREIGN KEY (company_id, incident_id) REFERENCES whs_incidents(company_id, id),
  -- submitted only with the method, the time, who submitted it and the regulator's reference
  CHECK (status <> 'submitted' OR (method IS NOT NULL AND submitted_at IS NOT NULL AND submitted_by IS NOT NULL AND reference IS NOT NULL AND length(reference) > 0 AND decision = 'notifiable'))
);
CREATE INDEX whs_reg_notices_status ON whs_reg_notices(company_id, status, due_at);
CREATE TRIGGER whs_reg_notices_submitted_frozen BEFORE UPDATE OF method, submitted_at, submitted_by, reference, decision, status ON whs_reg_notices WHEN OLD.status = 'submitted' BEGIN SELECT RAISE(ABORT, 'WHS_PROTECTED: a recorded submission cannot be changed'); END;
CREATE TRIGGER whs_reg_notices_no_delete BEFORE DELETE ON whs_reg_notices WHEN NOT EXISTS (SELECT 1 FROM whs_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'WHS_PROTECTED: a notification record cannot be deleted'); END;

-- ------------------------------------------------------------------ actions register

-- Corrective and preventive actions from any source: hazard, incident, investigation, risk assessment, and later
-- inspection, audit, meeting, contractor and regulatory finding (source_type is checked by the code).
CREATE TABLE whs_actions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  description TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'corrective' CHECK (length(kind) BETWEEN 1 AND 30),
  source_type TEXT NOT NULL CHECK (length(source_type) BETWEEN 1 AND 30),
  source_id TEXT,
  hierarchy TEXT CHECK (hierarchy IS NULL OR length(hierarchy) BETWEEN 1 AND 30),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (length(priority) BETWEEN 1 AND 20),
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  due_date TEXT,
  evidence_required INTEGER NOT NULL DEFAULT 0 CHECK (evidence_required IN (0, 1)),
  evidence_note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'verified', 'closed', 'cancelled')),
  confidential INTEGER NOT NULL DEFAULT 0 CHECK (confidential IN (0, 1)),
  started_at INTEGER,
  completed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  completed_at INTEGER,
  completion_note TEXT NOT NULL DEFAULT '',
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at INTEGER,
  verification_note TEXT NOT NULL DEFAULT '',
  verify_sod INTEGER NOT NULL DEFAULT 0 CHECK (verify_sod IN (0, 1)),
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  closure_note TEXT NOT NULL DEFAULT '',
  close_sod INTEGER NOT NULL DEFAULT 0 CHECK (close_sod IN (0, 1)),
  escalated_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  search TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, number)
);
CREATE INDEX whs_actions_status ON whs_actions(company_id, status, due_date);
CREATE INDEX whs_actions_responsible ON whs_actions(company_id, responsible_id, status);
CREATE INDEX whs_actions_source ON whs_actions(company_id, source_type, source_id);

-- ------------------------------------------------------------------ links, notes, files, alerts, history

-- Links between WHS records and records elsewhere in the company (a hazard to its incident, risk assessment or
-- Maintenance work order). Both ends are checked by the code to be in the company.
CREATE TABLE whs_links (
  company_id TEXT NOT NULL,
  a_type TEXT NOT NULL CHECK (length(a_type) BETWEEN 1 AND 30),
  a_id TEXT NOT NULL,
  b_type TEXT NOT NULL CHECK (length(b_type) BETWEEN 1 AND 30),
  b_id TEXT NOT NULL,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, a_type, a_id, b_type, b_id)
);
CREATE INDEX whs_links_b ON whs_links(company_id, b_type, b_id);

-- Notes and consultation comments (health and safety representatives) on a record.
CREATE TABLE whs_comments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (length(entity_type) BETWEEN 1 AND 30),
  entity_id TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'note' CHECK (kind IN ('note', 'consultation')),
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 5000),
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE INDEX whs_comments_entity ON whs_comments(company_id, entity_type, entity_id, created_at);

-- Photos and documents of WHS records, in the app's file store with the same checks as every upload. A file is served
-- only to people who may see its record (health files only to health officers).
CREATE TABLE whs_files (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (length(entity_type) BETWEEN 1 AND 30),
  entity_id TEXT NOT NULL,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  UNIQUE (company_id, id)
);
CREATE INDEX whs_files_entity ON whs_files(company_id, entity_type, entity_id, created_at);

-- In-app alerts (serious incidents, potentially notifiable incidents, overdue actions, assignments). Never confidential
-- details: a number, a title and a link.
CREATE TABLE whs_alerts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  entity_type TEXT,
  entity_id TEXT,
  dedupe_key TEXT UNIQUE,
  read_at INTEGER,
  emailed INTEGER NOT NULL DEFAULT 0 CHECK (emailed IN (0, 1)),
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE INDEX whs_alerts_user ON whs_alerts(company_id, user_id, read_at, created_at);

-- The WHS history of a company: every step and change, with before and after values. Append-only.
CREATE TABLE whs_events (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX whs_events_entity ON whs_events(company_id, entity_type, entity_id, created_at);
CREATE INDEX whs_events_company ON whs_events(company_id, created_at);
CREATE TRIGGER whs_events_append_only BEFORE UPDATE OF id, company_id, action, entity_type, entity_id, summary, before_json, after_json, created_at ON whs_events BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: the WHS history is append-only'); END;
CREATE TRIGGER whs_events_no_delete BEFORE DELETE ON whs_events WHEN NOT EXISTS (SELECT 1 FROM whs_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: the WHS history is append-only'); END;
