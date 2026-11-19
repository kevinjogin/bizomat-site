-- Stage 1, R6: registration and verification (docs/platform/verification.md). Every capability here is behind a flag
-- that ships off. Reverse: migrations-reverse/0033_verification.sql.
--
-- company_verifications: each check of a company against a register (or a decision by hand), with what it found.
-- company_verification_history: each change of a company's registration status, with the old and new status, what set
-- it and why. Append only: triggers refuse edits and deletions.
-- company_registry_providers: each register's health (last answer, last error, failures in a row).
-- company_evidence: documents a company uploads for manual review (PDF, PNG or JPEG), kept privately.
-- company_join_requests: people asking to join a company that already exists, for its owner to decide.
CREATE TABLE company_verifications (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  country TEXT,
  registration_type TEXT,
  registration_number TEXT,
  outcome TEXT NOT NULL CHECK (outcome IN ('active', 'inactive', 'not_found', 'unavailable', 'manual', 'skipped')),
  registered_name TEXT,
  name_match TEXT CHECK (name_match IS NULL OR name_match IN ('exact', 'close', 'different')),
  status_before TEXT,
  status_after TEXT,
  error TEXT,
  trigger TEXT NOT NULL CHECK (trigger IN ('initial', 'on_demand', 'scheduled', 'details_changed', 'admin')),
  actor_id TEXT,
  checked_at INTEGER NOT NULL
);
CREATE INDEX company_verifications_company ON company_verifications(company_id, checked_at);

CREATE TABLE company_verification_history (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('registry', 'manual', 'format', 'system')),
  reason TEXT NOT NULL DEFAULT '',
  actor_id TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX company_verification_history_company ON company_verification_history(company_id, created_at);
CREATE INDEX company_verification_history_time ON company_verification_history(created_at);
CREATE TRIGGER company_verification_history_no_update BEFORE UPDATE ON company_verification_history BEGIN SELECT RAISE(ABORT, 'verification history is append only'); END;
CREATE TRIGGER company_verification_history_no_delete BEFORE DELETE ON company_verification_history BEGIN SELECT RAISE(ABORT, 'verification history is append only'); END;

CREATE TABLE company_registry_providers (
  id TEXT PRIMARY KEY,
  last_ok_at INTEGER,
  last_error_at INTEGER,
  last_error TEXT,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE TABLE company_evidence (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  file_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL CHECK (length(file_name) BETWEEN 1 AND 200),
  content_type TEXT NOT NULL CHECK (content_type IN ('application/pdf', 'image/png', 'image/jpeg')),
  size INTEGER NOT NULL CHECK (size > 0 AND size <= 10485760),
  sha256 TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  reviewed_by TEXT,
  reviewed_at INTEGER,
  review_note TEXT
);
CREATE INDEX company_evidence_company ON company_evidence(company_id, uploaded_at);

CREATE TABLE company_join_requests (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'withdrawn')),
  decided_by TEXT,
  decided_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX company_join_requests_pending ON company_join_requests(company_id, user_id) WHERE status = 'pending';
