-- Reverse of migrations/0040_cad_contract2.sql. Run only after a database copy: the record of downloads through AI
-- assistants' links (their entries in the companies' history stay) and who was asked to review a document are lost.
ALTER TABLE cad_review_tasks DROP COLUMN reviewer_id;
DROP INDEX IF EXISTS cad_downloads_when;
DROP TABLE IF EXISTS cad_downloads;
DELETE FROM d1_migrations WHERE name = '0040_cad_contract2.sql';
