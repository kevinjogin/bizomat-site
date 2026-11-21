-- Reverse of migrations/0040_maintenance_field.sql. Run only to take the field release back out, after a database copy,
-- with this release's code rolled back.
--
-- Before running it, while this release's code is still deployed: release every open maintenance reservation (on each
-- work order, or by completing or cancelling the work orders). Once mt_wo_reservations is gone, an ERP Inventory
-- reservation it linked would keep holding stock, and only Inventory's own release could free it.
--
-- Lost: inspection rounds with their assets, results and reviews, the links from work orders to their reservations and
-- requisitions (the reservations and requisitions themselves stay in ERP Inventory and Procurement), the product on
-- each required part line (the lines stay as text), stocktake due dates, the withdrawal details of requests, sign-offs,
-- which work orders were recorded after the work, and the two completing settings. Left in place, harmlessly: withdrawn
-- requests stay 'closed' (a 0018 status) with their 'Withdrawn: <reason>' comment, signature pictures stay as ordinary
-- photos of their work orders, the history in mt_events keeps every new action (round.*, request.withdrawn,
-- parts.reserved, work_order.recorded_done and the rest, with each sign-off's name in its completion line), mt_done
-- keeps its once-only keys, erp_alerts (0038) keeps the maintenance alerts already shown (dedupe keys starting mt:),
-- and the follow-up work orders and requests that rounds made are ordinary records.
--
-- Order matters: mt_wo_reservations points at mt_wo_parts(company_id, id) through the unique index mt_wo_parts_key, so
-- the table goes first. Dropping that index while a table still points at it makes every change or removal of a part
-- line fail with "foreign key mismatch".

-- inspection rounds (children first)
DROP INDEX IF EXISTS mt_round_results_item;
DROP TABLE IF EXISTS mt_round_results;
DROP INDEX IF EXISTS mt_round_assets_asset;
DROP INDEX IF EXISTS mt_round_assets_round;
DROP TABLE IF EXISTS mt_round_assets;
DROP TABLE IF EXISTS mt_rounds;

-- stocktakes
DROP INDEX IF EXISTS erp_counts_due;
ALTER TABLE erp_counts DROP COLUMN due_date;

-- parts: requisitions and reservations, then the product on required part lines
DROP INDEX IF EXISTS mt_wo_requisitions_wo;
DROP TABLE IF EXISTS mt_wo_requisitions;
DROP INDEX IF EXISTS mt_wo_reservations_part;
DROP INDEX IF EXISTS mt_wo_reservations_wo;
DROP TABLE IF EXISTS mt_wo_reservations;
DROP INDEX IF EXISTS mt_wo_parts_product;
DROP INDEX IF EXISTS mt_wo_parts_key;
ALTER TABLE mt_wo_parts DROP COLUMN product_id;

-- settings: completing work orders
ALTER TABLE mt_settings DROP COLUMN technicians_record_work;
ALTER TABLE mt_settings DROP COLUMN require_signature;

-- work orders: work already done, sign-off and the list's indexes
ALTER TABLE mt_work_orders DROP COLUMN recorded_done;
ALTER TABLE mt_work_orders DROP COLUMN signature_file_id;
ALTER TABLE mt_work_orders DROP COLUMN signed_at;
ALTER TABLE mt_work_orders DROP COLUMN signed_by_role;
ALTER TABLE mt_work_orders DROP COLUMN signed_by_name;
DROP INDEX IF EXISTS mt_work_orders_completed;
DROP INDEX IF EXISTS mt_work_orders_due_start;
DROP INDEX IF EXISTS mt_work_orders_created;

-- requests: withdrawal
ALTER TABLE mt_requests DROP COLUMN withdraw_reason;
ALTER TABLE mt_requests DROP COLUMN withdrawn_at;

-- The flag's stored values (the code that knew it is rolled back). Its change history in feature_flag_changes is append
-- only and stays.
DELETE FROM feature_flags WHERE key = 'maintenance_email_alerts';

DELETE FROM d1_migrations WHERE name = '0040_maintenance_field.sql';
