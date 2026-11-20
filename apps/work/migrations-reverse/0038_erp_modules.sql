-- Reverse of migrations/0038_erp_modules.sql. Run only to take the modules framework back out, after a database copy:
-- every record of the new modules (People and HR, payroll, timesheets, service, contracts, fleet, calibration, fixed
-- assets, industry solutions and the rest), their lines, comments, alerts and saved filters are lost. Their history in
-- erp_events and their files in erp_record_files stay (remove them by entity_type 'record' and 'object' if wanted).
DROP TABLE IF EXISTS erp_object_marks;
DROP INDEX IF EXISTS erp_object_views_user;
DROP TABLE IF EXISTS erp_object_views;
DROP INDEX IF EXISTS erp_alerts_user;
DROP TABLE IF EXISTS erp_alerts;
DROP INDEX IF EXISTS erp_object_comments_record;
DROP TABLE IF EXISTS erp_object_comments;
DROP INDEX IF EXISTS erp_object_refs_target;
DROP TABLE IF EXISTS erp_object_refs;
DROP INDEX IF EXISTS erp_object_lines_record;
DROP TABLE IF EXISTS erp_object_lines;
DROP INDEX IF EXISTS erp_objects_assignee;
DROP INDEX IF EXISTS erp_objects_owner;
DROP INDEX IF EXISTS erp_objects_due;
DROP INDEX IF EXISTS erp_objects_status;
DROP INDEX IF EXISTS erp_objects_list;
DROP TABLE IF EXISTS erp_objects;
DELETE FROM d1_migrations WHERE name = '0038_erp_modules.sql';
