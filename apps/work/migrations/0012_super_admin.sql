-- The owner's account, kevin@kevos.com, is the platform's super admin (role "founder" in platform_admins) for the
-- Project Management founder console and the CRM and Finance super admin consoles (owner's request, 13 Nov 2026).
-- Migration 0004 granted it already when that account existed; this makes sure, and upgrades an "admin" row to
-- "founder". Only a confirmed, enabled account with that address is granted: an address nobody has confirmed gets
-- nothing. Additive and idempotent: no table changes; a database without that account is unchanged.
INSERT INTO platform_admins (user_id, role, granted_by, granted_at, note)
SELECT id, 'founder', 'migration-0012', CAST(strftime('%s', 'now') AS INTEGER) * 1000, 'Super admin for Project Management, the CRM and Finance'
FROM users
WHERE email = 'kevin@kevos.com' COLLATE NOCASE AND disabled_at IS NULL AND email_verified_at IS NOT NULL
ON CONFLICT(user_id) DO UPDATE SET role = 'founder';
