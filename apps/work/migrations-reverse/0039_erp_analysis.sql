-- Reverse of migrations/0039_erp_analysis.sql. Run only to take the sales and margin analysis back out, after a
-- database copy: the views people saved are lost. Nothing else changes (the analysis wrote no other records).
DROP INDEX IF EXISTS erp_analysis_views_list;
DROP TABLE IF EXISTS erp_analysis_views;
DELETE FROM d1_migrations WHERE name = '0039_erp_analysis.sql';
