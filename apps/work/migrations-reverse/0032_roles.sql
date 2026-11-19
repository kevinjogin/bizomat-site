-- Reverse of migrations/0032_roles.sql (Stage 1, R5). Run only to take R5 back out, after a database copy. People with
-- the role manager or read_only must be given admin or employee first (the earlier code knows owner, admin and member).
DROP TABLE IF EXISTS co_owner_handovers;
DROP TABLE IF EXISTS support_access_grants;
UPDATE co_members SET role = 'member' WHERE role = 'employee';
UPDATE co_invitations SET role = 'member' WHERE role = 'employee';
DELETE FROM d1_migrations WHERE name = '0032_roles.sql';
