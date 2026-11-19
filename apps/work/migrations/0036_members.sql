-- Company members, roles and ownership transfer (owner's brief of 19 Nov 2026; docs/platform/members.md). Additive only:
-- every column has a default that keeps today's behaviour, and nothing acts until the flag company_members_v2 is on
-- for a company. The Stage 1 tables are reused (co_members, co_invitations, co_audit); nothing is duplicated.

-- A member can be suspended in one company (their other companies are untouched); last_active_at is the last request
-- they made to this company; sensitive: whether a manager sees sensitive fields (NULL: the role's default).
ALTER TABLE co_members ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE co_members ADD COLUMN suspended_at INTEGER;
ALTER TABLE co_members ADD COLUMN suspended_by TEXT;
ALTER TABLE co_members ADD COLUMN suspend_reason TEXT;
ALTER TABLE co_members ADD COLUMN last_active_at INTEGER;
ALTER TABLE co_members ADD COLUMN sensitive INTEGER;

-- Module access and record visibility per member and module (company/members-access.ts). No row: the role's default
-- (every module; scope all, own for employees).
CREATE TABLE co_member_access (
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  module TEXT NOT NULL,
  access INTEGER NOT NULL DEFAULT 1,
  scope TEXT NOT NULL DEFAULT 'all',
  updated_by TEXT,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, user_id, module),
  FOREIGN KEY (company_id, user_id) REFERENCES co_members(company_id, user_id) ON DELETE CASCADE
);

-- What an invitation gives besides the role: modules and scopes, sensitive fields, and a personal message.
ALTER TABLE co_invitations ADD COLUMN access_json TEXT;
ALTER TABLE co_invitations ADD COLUMN message TEXT;
ALTER TABLE co_invitations ADD COLUMN resent_at INTEGER;
ALTER TABLE co_invitations ADD COLUMN resend_count INTEGER NOT NULL DEFAULT 0;

-- Ownership transfers: asked by the owner and accepted by the new owner, or forced by a platform admin with a reason
-- and evidence. At most one pending transfer per company.
CREATE TABLE co_ownership_transfers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  -- the role the old owner keeps afterwards
  from_new_role TEXT NOT NULL DEFAULT 'admin',
  status TEXT NOT NULL DEFAULT 'pending',
  kind TEXT NOT NULL DEFAULT 'request',
  reason TEXT,
  evidence TEXT,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  decided_at INTEGER,
  decided_by TEXT
);
CREATE UNIQUE INDEX co_ownership_transfers_pending ON co_ownership_transfers(company_id) WHERE status = 'pending';
CREATE INDEX co_ownership_transfers_to ON co_ownership_transfers(to_user_id, status);

-- In-app notices about a person's membership (invited, role changed, suspended, ownership transfer...). Email goes
-- through the outbox as well.
CREATE TABLE co_member_notices (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  created_at INTEGER NOT NULL,
  read_at INTEGER
);
CREATE INDEX co_member_notices_user ON co_member_notices(user_id, read_at, created_at);
