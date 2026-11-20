-- Reverse of migrations/0037_cad.sql. Run only to take CAD Automation in the ERP back out, after a database copy: the
-- account mapping and review list, the record of automation runs, where saved CAD documents came from, bill of
-- materials proposals and review task links are lost. The documents, bill of materials lines and tasks themselves stay.
DROP INDEX IF EXISTS cad_review_tasks_document;
DROP TABLE IF EXISTS cad_review_tasks;
DROP INDEX IF EXISTS cad_bom_proposals_revision;
DROP TABLE IF EXISTS cad_bom_proposals;
DROP INDEX IF EXISTS cad_document_sources_document;
DROP TABLE IF EXISTS cad_document_sources;
DROP INDEX IF EXISTS cad_runs_when;
DROP TABLE IF EXISTS cad_runs;
DROP INDEX IF EXISTS cad_accounts_status;
DROP INDEX IF EXISTS cad_accounts_user;
DROP TABLE IF EXISTS cad_accounts;
DELETE FROM d1_migrations WHERE name = '0037_cad.sql';
