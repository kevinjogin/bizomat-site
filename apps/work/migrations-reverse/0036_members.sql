-- Reverse of migrations/0036_members.sql. Run only to take the members work back out, after a database copy: member
-- suspensions, module access and scopes, invitation messages, ownership transfer records and member notices are lost.
DROP TABLE IF EXISTS co_member_notices;
DROP INDEX IF EXISTS co_ownership_transfers_to;
DROP INDEX IF EXISTS co_ownership_transfers_pending;
DROP TABLE IF EXISTS co_ownership_transfers;
ALTER TABLE co_invitations DROP COLUMN resend_count;
ALTER TABLE co_invitations DROP COLUMN resent_at;
ALTER TABLE co_invitations DROP COLUMN message;
ALTER TABLE co_invitations DROP COLUMN access_json;
DROP TABLE IF EXISTS co_member_access;
ALTER TABLE co_members DROP COLUMN sensitive;
ALTER TABLE co_members DROP COLUMN last_active_at;
ALTER TABLE co_members DROP COLUMN suspend_reason;
ALTER TABLE co_members DROP COLUMN suspended_by;
ALTER TABLE co_members DROP COLUMN suspended_at;
ALTER TABLE co_members DROP COLUMN status;
DELETE FROM d1_migrations WHERE name = '0036_members.sql';
