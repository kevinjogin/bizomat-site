-- BIZOMAT ERP: Asset Management and Maintenance, the field release (four parts built together: the lists, requests and
-- dashboard, parts and stocktakes, inspection rounds with readings and labels, and the job itself with its sign-off,
-- work recorded after it was done and alerts). Additive: new columns with NULL or constant defaults, new indexes and
-- new mt_* tables only. No table is rebuilt, no CHECK list changes and no existing row is changed (0018, 0021 and 0024
-- stay as they were applied).
--
--   Requests     a requester withdraws their own request before it becomes or joins a work order.
--   Work orders  indexes for the list's date filters and sorts, the sign-off when a work order is completed, and work
--                orders made and completed in one step for work already done.
--   Settings     whether completing a work order needs a signature, and whether technicians may record work already
--                done. Both off until a maintenance administrator switches them on.
--   Parts        required parts linked to ERP products, stock reserved for a work order and purchase requisitions
--                raised from one. A reservation is ERP Inventory's own (erp_reservations, made through StockOps) and a
--                requisition is Procurement's own (erp_requisitions, made through createRequisition). The tables here
--                only link them to the work order, so there is no second stock or purchasing record.
--   Stocktakes   a due date on ERP Inventory's counts. Counting stays in Inventory, which alone approves and posts.
--   Rounds       one inspection work order over many assets, each with its own checklist and a supervisor's review.
--
-- Companies and keys as in 0018 and 0024: company_id on every row and in every statement
-- (test-node/company-queries.test.ts), rows pointing at each other through (company_id, id) keys so a record can never
-- link to another company's. Kinds and statuses that later stages may extend are checked by the code
-- (src/worker/maintenance), never listed in a CHECK. Links point one way (parents first), as the data tooling needs.
-- Nothing is posted to Finance: stock values stay in ERP Inventory's ledger and labour costs on the work order. The
-- Readings page, the asset labels, the printable job card and the alerts need no schema of their own (alerts are
-- erp_alerts, from 0038).
--
-- Everything here ships on inside the Maintenance module switch (the owner chose "straight on for everyone" for the ERP
-- redesign, 20 Nov 2026, which this release completes for Maintenance). The one new flag,
-- maintenance_email_alerts (email copies of maintenance alerts), lives in src/worker/platform/flags.ts and ships off.
-- The example company never sends email.

-- ------------------------------------------------------------------ requests: withdrawal

-- A requester may withdraw their own request while it is submitted, awaiting approval, waiting for more information or
-- approved, and only before it becomes or joins a work order (src/worker/maintenance/routes-requests.ts). The status
-- CHECK of 0018 is not changed: a withdrawn request is 'closed', and these two columns say when it was withdrawn and
-- why. The person is requested_by, who alone may withdraw it.
ALTER TABLE mt_requests ADD COLUMN withdrawn_at INTEGER;
ALTER TABLE mt_requests ADD COLUMN withdraw_reason TEXT NOT NULL DEFAULT '';

-- ------------------------------------------------------------------ work orders: lists, sign-off and work already done

-- The work order list's date filters (raised, completed, due start) and its due-start sort.
CREATE INDEX mt_work_orders_created ON mt_work_orders(company_id, created_at);
CREATE INDEX mt_work_orders_due_start ON mt_work_orders(company_id, status, due_start);
CREATE INDEX mt_work_orders_completed ON mt_work_orders(company_id, completed_at) WHERE completed_at IS NOT NULL;

-- The sign-off when a work order is completed (optional unless the company asks for one,
-- mt_settings.require_signature): the name the person signing typed, their role (optional), when they signed, and the
-- picture of the signature drawn on screen. The picture is an mt_files row on the same work order. signature_file_id
-- names it and is checked by the code (src/worker/maintenance/signoff.ts), because ALTER TABLE cannot add a
-- (company_id, id) foreign key. The picture records who signed on screen. It is not a verified electronic signature.
-- Every completion writes these four again (NULL and '' when completed without a sign-off), so a work order reopened
-- and completed again carries only its last sign-off.
ALTER TABLE mt_work_orders ADD COLUMN signed_by_name TEXT;
ALTER TABLE mt_work_orders ADD COLUMN signed_by_role TEXT NOT NULL DEFAULT '';
ALTER TABLE mt_work_orders ADD COLUMN signed_at INTEGER;
ALTER TABLE mt_work_orders ADD COLUMN signature_file_id TEXT;
-- 1: made and completed in one step for work already done (POST /work-orders/done). 0: every other work order.
ALTER TABLE mt_work_orders ADD COLUMN recorded_done INTEGER NOT NULL DEFAULT 0;

-- ------------------------------------------------------------------ settings: completing work orders

-- Per company, written only as 0 or 1 by the code: whether completing a work order needs a signature, and whether
-- technicians may record work already done (their own only, while supervisors and administrators always may). Both are
-- off by default, so nothing changes until a maintenance administrator switches one on. A company without an
-- mt_settings row keeps the 0018 default for approval (required).
ALTER TABLE mt_settings ADD COLUMN require_signature INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mt_settings ADD COLUMN technicians_record_work INTEGER NOT NULL DEFAULT 0;

-- ------------------------------------------------------------------ parts: products, reservations and requisitions

-- 0018's comment on mt_wo_parts ("issuing from stores is a later stage") is out of date: parts have been issued from
-- the maintenance stores through ERP Inventory since stages M2 and M3 (mt_wo_stock, 0024). 0018 is not edited. A
-- required part may now name an ERP product. product_id is an erp_products row of the same company, checked by the code
-- (src/worker/maintenance/routes-parts.ts checkPartLines), because ALTER TABLE cannot add a (company_id, product_id)
-- foreign key, and mt_wo_parts (0018) comes before erp_products (0020). NULL is a free-text line, as every line was
-- before, so existing lines are unchanged.
ALTER TABLE mt_wo_parts ADD COLUMN product_id TEXT;
-- (company_id, id) as the key the reservations below point at, and one line per product on a work order.
CREATE UNIQUE INDEX mt_wo_parts_key ON mt_wo_parts(company_id, id);
CREATE UNIQUE INDEX mt_wo_parts_product ON mt_wo_parts(company_id, work_order_id, product_id) WHERE product_id IS NOT NULL;

-- Stock reserved for a work order. The reservation itself is ERP Inventory's own row (erp_reservations, made and
-- released through StockOps.reserve), and this side table names the work order and the required-part line, as
-- erp_mo_reservations (0022) does for manufacturing orders. Completing or cancelling the work order releases what is
-- still reserved, in the same transaction. part_id is set to NULL by the code before its line is removed (a composite
-- key cannot use ON DELETE SET NULL while company_id is NOT NULL), so the reservation's history stays.
CREATE TABLE mt_wo_reservations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  reservation_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  part_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, reservation_id),
  FOREIGN KEY (company_id, reservation_id) REFERENCES erp_reservations(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, part_id) REFERENCES mt_wo_parts(company_id, id)
);
CREATE INDEX mt_wo_reservations_wo ON mt_wo_reservations(company_id, work_order_id);
CREATE INDEX mt_wo_reservations_part ON mt_wo_reservations(company_id, part_id);

-- Purchase requisitions raised from a work order. Each is made by Procurement's own createRequisition
-- (src/worker/erp/procurement.ts), in its own transaction with this link, so erp_requisitions is unchanged and the
-- requisition is approved and ordered in Procurement under its own rules.
CREATE TABLE mt_wo_requisitions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  requisition_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, requisition_id),
  FOREIGN KEY (company_id, requisition_id) REFERENCES erp_requisitions(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id)
);
CREATE INDEX mt_wo_requisitions_wo ON mt_wo_requisitions(company_id, work_order_id);

-- ------------------------------------------------------------------ stocktakes

-- The date by which an ERP Inventory count (a stocktake or a cycle count) should be finished, YYYY-MM-DD. NULL: no due
-- date, as every count before. Maintenance's Stocktakes page lists the counts of maintenance stores by it. Counting,
-- approval and posting the differences stay in ERP Inventory (src/worker/erp/inventory.ts).
ALTER TABLE erp_counts ADD COLUMN due_date TEXT;
CREATE INDEX erp_counts_due ON erp_counts(company_id, status, due_date);

-- ------------------------------------------------------------------ inspection rounds

-- An inspection round is ONE work order (job type inspection) covering many assets, each with its own checklist. The
-- work order keeps its timer, labour, photos, parts and status as any other, and it cannot be completed while an asset
-- of the round is still open. mt_wo_inspections (0024) cannot hold several assets: its table constraint UNIQUE
-- (company_id, work_order_id, template_id) allows one row per template on a work order and cannot be widened without
-- rebuilding the table, and mt_insp_results' CHECK names exactly one of inspection_id and prestart_id. So a round has
-- tables of its own with the same rules, and the checklist code is shared
-- (src/worker/maintenance/routes-inspections.ts, routes-rounds.ts).

-- The round: one per work order, with the checklist chosen for it (each asset may take another).
CREATE TABLE mt_rounds (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, work_order_id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, template_id) REFERENCES mt_insp_templates(company_id, id)
);

-- One asset of a round with its checklist. status: open, passed or failed. attempt: 1, plus one each time a supervisor
-- marks it not approved (it is then open again, its results kept to be corrected). review: '' (not reviewed), approved
-- or not_approved, decided by a supervisor or administrator who did not complete it. When no other supervisor or
-- administrator is in the company, the one there may decide their own, and the history says so. A failed asset makes at
-- most one follow-up, on that asset (once-only key round-asset:<id>:<attempt> in mt_done). work_order_id is the round's
-- work order, copied for lookups.
CREATE TABLE mt_round_assets (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  round_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (length(status) BETWEEN 1 AND 20),
  attempt INTEGER NOT NULL DEFAULT 1 CHECK (attempt >= 1),
  completed_at INTEGER,
  completed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  follow_up_work_order_id TEXT,
  follow_up_request_id TEXT,
  review TEXT NOT NULL DEFAULT '' CHECK (length(review) <= 20),
  review_note TEXT NOT NULL DEFAULT '',
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, work_order_id, asset_id),
  FOREIGN KEY (company_id, round_id) REFERENCES mt_rounds(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, template_id) REFERENCES mt_insp_templates(company_id, id),
  FOREIGN KEY (company_id, follow_up_work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, follow_up_request_id) REFERENCES mt_requests(company_id, id)
);
CREATE INDEX mt_round_assets_round ON mt_round_assets(company_id, round_id, position);
CREATE INDEX mt_round_assets_asset ON mt_round_assets(company_id, asset_id, completed_at);

-- The result of each checklist item of a round's asset, with the item as it was when recorded (as mt_insp_results), so
-- a later change to the template never changes a recorded result.
CREATE TABLE mt_round_results (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  round_asset_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  kind TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  min_value REAL,
  max_value REAL,
  critical INTEGER NOT NULL DEFAULT 0 CHECK (critical IN (0, 1)),
  passed INTEGER CHECK (passed IS NULL OR passed IN (0, 1)),
  value_num REAL,
  value_text TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  recorded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  recorded_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, round_asset_id) REFERENCES mt_round_assets(company_id, id),
  FOREIGN KEY (company_id, item_id) REFERENCES mt_insp_items(company_id, id)
);
CREATE UNIQUE INDEX mt_round_results_item ON mt_round_results(company_id, round_asset_id, item_id);
