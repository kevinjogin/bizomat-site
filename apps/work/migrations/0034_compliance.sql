-- Stage 1, R7: existing users, notifications, deadlines, suspension, data export and deletion (docs/platform/compliance.md).
-- Every capability here is behind a flag that ships off, and every run is a dry run first. Reverse:
-- migrations-reverse/0034_compliance.sql.
--
-- compliance_exemptions: people a platform admin exempts (testers, partners, staff), with a reason and an optional end.
-- compliance_recipient_lists: who would be told, worked out as a dry run and approved before anything is sent.
-- compliance_notifications: each notice per person and channel, with when it was delivered or displayed.
-- compliance_accounts: each person's deadline (starting only after a recorded delivery or display), reminders,
--   extensions, suspension, legal hold, the final warning and deletion.
-- compliance_extensions: deadline extensions for one person, one company or everyone, with a reason.
-- legal_reviews: the privacy and legal review that must be recorded before automatic deletion can be switched on.
-- deletion_batches: each deletion batch, its dry-run report, who approved it and what happened.
-- data_exports: personal and company exports, built in the background and fetched with an expiring link.
-- password_resets: self-service password reset links (one use, one hour).
-- audit_log is made append only: triggers refuse edits and deletions (audit S10).
CREATE TABLE compliance_exemptions (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 3 AND 500),
  expires_at INTEGER,
  created_by TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE compliance_recipient_lists (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('migration')),
  audience TEXT NOT NULL CHECK (audience IN ('no_company', 'invitation_only', 'require_company')),
  user_ids_json TEXT NOT NULL,
  count INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent', 'cancelled')),
  created_by TEXT,
  created_at INTEGER NOT NULL,
  approved_by TEXT,
  approved_at INTEGER,
  sent_at INTEGER
);

CREATE TABLE compliance_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('migration', 'reminder', 'suspension', 'final_warning')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app')),
  list_id TEXT,
  day INTEGER,
  status TEXT NOT NULL CHECK (status IN ('queued', 'delivered', 'displayed', 'failed')),
  outbox_key TEXT,
  delivered_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX compliance_notifications_once ON compliance_notifications(user_id, kind, channel, COALESCE(day, -1));

CREATE TABLE compliance_accounts (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  notified_at INTEGER,
  deadline_at INTEGER,
  suspended_at INTEGER,
  restored_at INTEGER,
  legal_hold INTEGER NOT NULL DEFAULT 0 CHECK (legal_hold IN (0, 1)),
  final_warning_at INTEGER,
  deletion_due_at INTEGER,
  deleted_at INTEGER,
  updated_at INTEGER NOT NULL
);

CREATE TABLE compliance_extensions (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL CHECK (scope IN ('user', 'company', 'global')),
  scope_id TEXT NOT NULL DEFAULT '',
  days INTEGER NOT NULL CHECK (days BETWEEN 1 AND 365),
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 3 AND 500),
  created_by TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE legal_reviews (
  id TEXT PRIMARY KEY,
  reviewer TEXT NOT NULL CHECK (length(reviewer) BETWEEN 2 AND 200),
  reviewed_on TEXT NOT NULL,
  jurisdictions_json TEXT NOT NULL,
  retention_json TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  recorded_by TEXT NOT NULL,
  recorded_at INTEGER NOT NULL
);

CREATE TABLE deletion_batches (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('dry_run', 'approved', 'running', 'done', 'cancelled')),
  max_accounts INTEGER NOT NULL CHECK (max_accounts BETWEEN 1 AND 500),
  report_json TEXT NOT NULL,
  created_by TEXT,
  created_at INTEGER NOT NULL,
  approved_by TEXT,
  approved_at INTEGER,
  done_at INTEGER,
  -- backups still hold the data until then: deletion is not complete before it
  backups_expire_at INTEGER
);

CREATE TABLE data_exports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('personal', 'company')),
  company_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'ready', 'failed', 'expired')),
  file_key TEXT,
  size INTEGER,
  token_hash TEXT,
  expires_at INTEGER,
  error TEXT,
  created_at INTEGER NOT NULL,
  completed_at INTEGER
);
CREATE INDEX data_exports_user ON data_exports(user_id, created_at);
CREATE INDEX data_exports_status ON data_exports(status, created_at);

CREATE TABLE password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  ip TEXT
);
CREATE INDEX password_resets_user ON password_resets(user_id, created_at);

CREATE TRIGGER audit_log_no_update BEFORE UPDATE ON audit_log BEGIN SELECT RAISE(ABORT, 'the audit log is append only'); END;
CREATE TRIGGER audit_log_no_delete BEFORE DELETE ON audit_log BEGIN SELECT RAISE(ABORT, 'the audit log is append only'); END;
