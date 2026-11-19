-- Stage 1, R5: company roles (docs/platform/roles.md). Reverse: migrations-reverse/0032_roles.sql.
--
-- 1. The company roles of Stage 1 are owner, admin, manager, employee and read_only (migration 0030 made room for
--    them). The role member becomes employee, for people and for invitations not yet accepted. Nothing else changes:
--    each person keeps their role in every tool.
-- 2. support_access_grants: BIZOMAT support's time-limited access to one company, with a reason. Every grant is
--    written to the company's own audit log, its owner and administrators see it and can end it, and it lapses by itself.
-- 3. co_owner_handovers: when a company's owner's account is disabled, ownership passes to its longest-serving active
--    administrator. Each handover, or the lack of anyone to take over, is recorded here.
UPDATE co_members SET role = 'employee' WHERE role = 'member';
UPDATE co_invitations SET role = 'employee' WHERE role = 'member' AND accepted_at IS NULL;

CREATE TABLE support_access_grants (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  -- the platform admin who may look
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 3 AND 500),
  -- read: the company's people, tools and registration, never record content
  scope TEXT NOT NULL DEFAULT 'read' CHECK (scope IN ('read')),
  granted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER NOT NULL,
  revoked_at INTEGER,
  revoked_by TEXT,
  created_at INTEGER NOT NULL,
  CHECK (ends_at > starts_at)
);
CREATE INDEX support_access_company ON support_access_grants(company_id, ends_at);
CREATE INDEX support_access_user ON support_access_grants(user_id, ends_at);

CREATE TABLE co_owner_handovers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  from_user_id TEXT NOT NULL,
  -- NULL: nobody could take over (no active administrator), so the company needs a platform admin's attention
  to_user_id TEXT,
  reason TEXT NOT NULL CHECK (reason IN ('owner_disabled')),
  actor_id TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX co_owner_handovers_company ON co_owner_handovers(company_id, created_at);
