-- BIZOMAT ERP, Release 2 (owner's brief "BIZOMAT ERP — full enterprise functionality", sections 4 and 5): purchase
-- requisitions, requests for quotation and supplier quotations, purchase orders with approval limits and amendment
-- history, goods receipts, the controlled link to Finance (integration events), and inventory: warehouses and locations,
-- stock by product, location, lot and serial, an append-only movement ledger, reservations, counts, and valuation by
-- weighted average or FIFO. Additive only: new tables and indexes, no existing table changed.
--
-- As in Release 1 (0020), every row carries company_id (a registered company, a person's own company or their example
-- company) and rows link through (company_id, id) keys, so the database refuses a link between two companies.
-- Code: src/worker/erp (procurement.ts, purchasing.ts, inventory.ts, integration.ts). Docs: docs/erp/release-2.md.

-- ------------------------------------------------------------------ foundations, extended

-- ERP roles given from Release 2 on (Release 1's erp_user_roles lists its seven roles in a CHECK and is still read).
-- The code checks the role names; the warehouse roles exist only here.
CREATE TABLE erp_role_grants (
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  set_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  set_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, user_id, role)
);

-- Numbering for the kinds Release 2 adds (REQ-00001, RFQ-0001, PO-00001, GR-00001, CNT-0001, ADJ-0001). Release 1's
-- erp_counters keeps its own five kinds.
CREATE TABLE erp_sequences (
  company_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (company_id, kind)
);

-- Per-company settings for purchasing and inventory.
CREATE TABLE erp_settings (
  company_id TEXT PRIMARY KEY,
  -- Purchase orders at or below this total (cents, in the order's currency) are approved when a buyer submits them;
  -- above it a procurement manager approves. NULL: every purchase order needs a procurement manager.
  po_approval_limit_cents INTEGER CHECK (po_approval_limit_cents IS NULL OR po_approval_limit_cents >= 0),
  -- Stock adjustments worth more than this (cents, absolute value) wait for a warehouse manager. NULL: every adjustment does.
  adjustment_approval_cents INTEGER CHECK (adjustment_approval_cents IS NULL OR adjustment_approval_cents >= 0),
  allow_negative_stock INTEGER NOT NULL DEFAULT 0 CHECK (allow_negative_stock IN (0, 1)),
  -- chosen before the first stock movement, then locked
  costing_method TEXT CHECK (costing_method IS NULL OR costing_method IN ('weighted_average', 'fifo')),
  costing_locked_at INTEGER,
  currency TEXT NOT NULL DEFAULT 'AUD',
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL
);

-- Operations that must happen once (posting a count, an adjustment's approval): each writes its key here in the same
-- transaction, so a second attempt at the same moment fails as a whole and changes nothing.
CREATE TABLE erp_done (
  company_id TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, key)
);

-- Files on procurement records (requisitions, requests for quotation, quotations, purchase orders, receipts).
CREATE TABLE erp_record_files (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  -- requisition, rfq, quotation, purchase_order, receipt (checked by record-files.ts; later releases add kinds)
  entity_type TEXT NOT NULL CHECK (length(entity_type) BETWEEN 1 AND 40),
  entity_id TEXT NOT NULL,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  UNIQUE (company_id, id)
);
CREATE INDEX erp_record_files_entity ON erp_record_files(company_id, entity_type, entity_id, created_at);

-- ------------------------------------------------------------------ purchase requisitions

CREATE TABLE erp_requisitions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  title TEXT NOT NULL DEFAULT '',
  requester_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  department_id TEXT REFERENCES co_departments(id) ON DELETE SET NULL,
  required_date TEXT,
  budget_ref TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected','converted','cancelled')),
  estimated_total_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'AUD',
  submitted_at INTEGER,
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at INTEGER,
  decision_note TEXT NOT NULL DEFAULT '',
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX erp_requisitions_number ON erp_requisitions(company_id, number);
CREATE INDEX erp_requisitions_status ON erp_requisitions(company_id, status, created_at);

CREATE TABLE erp_requisition_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  requisition_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  product_id TEXT,
  item TEXT NOT NULL DEFAULT '',
  specification TEXT NOT NULL DEFAULT '',
  quantity REAL NOT NULL CHECK (quantity > 0),
  uom TEXT NOT NULL DEFAULT 'each',
  est_unit_cost_cents INTEGER CHECK (est_unit_cost_cents IS NULL OR est_unit_cost_cents >= 0),
  UNIQUE (company_id, id),
  CHECK (product_id IS NOT NULL OR item <> ''),
  FOREIGN KEY (company_id, requisition_id) REFERENCES erp_requisitions(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_requisition_lines_req ON erp_requisition_lines(company_id, requisition_id, position);

-- ------------------------------------------------------------------ requests for quotation and quotations

CREATE TABLE erp_rfqs (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  title TEXT NOT NULL DEFAULT '',
  requisition_id TEXT,
  required_date TEXT,
  reply_by TEXT,
  currency TEXT NOT NULL DEFAULT 'AUD',
  delivery_address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  -- draft: being prepared; sent: with suppliers; awarded: a quotation chosen, waiting for approval; approved; ordered: a
  -- purchase order was made from it; cancelled
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','awarded','approved','ordered','cancelled')),
  selected_quotation_id TEXT,
  selection_reason TEXT NOT NULL DEFAULT '',
  selected_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  selected_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, requisition_id) REFERENCES erp_requisitions(company_id, id)
);
CREATE UNIQUE INDEX erp_rfqs_number ON erp_rfqs(company_id, number);
CREATE INDEX erp_rfqs_status ON erp_rfqs(company_id, status, created_at);

CREATE TABLE erp_rfq_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  rfq_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  product_id TEXT,
  item TEXT NOT NULL DEFAULT '',
  specification TEXT NOT NULL DEFAULT '',
  quantity REAL NOT NULL CHECK (quantity > 0),
  uom TEXT NOT NULL DEFAULT 'each',
  UNIQUE (company_id, id),
  CHECK (product_id IS NOT NULL OR item <> ''),
  FOREIGN KEY (company_id, rfq_id) REFERENCES erp_rfqs(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_rfq_lines_rfq ON erp_rfq_lines(company_id, rfq_id, position);

-- The suppliers an RFQ goes to, and how it was sent (download and send by hand, recorded).
CREATE TABLE erp_rfq_suppliers (
  company_id TEXT NOT NULL,
  rfq_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  sent_at INTEGER,
  sent_via TEXT CHECK (sent_via IS NULL OR sent_via IN ('manual')),
  sent_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (company_id, rfq_id, supplier_id),
  FOREIGN KEY (company_id, rfq_id) REFERENCES erp_rfqs(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);

CREATE TABLE erp_quotations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  rfq_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  reference TEXT NOT NULL DEFAULT '',
  received_date TEXT,
  valid_until TEXT,
  lead_time_days INTEGER CHECK (lead_time_days IS NULL OR (lead_time_days >= 0 AND lead_time_days <= 1000)),
  freight_cents INTEGER NOT NULL DEFAULT 0 CHECK (freight_cents >= 0),
  payment_terms_days INTEGER CHECK (payment_terms_days IS NULL OR (payment_terms_days >= 0 AND payment_terms_days <= 365)),
  currency TEXT NOT NULL DEFAULT 'AUD',
  notes TEXT NOT NULL DEFAULT '',
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, rfq_id, supplier_id),
  FOREIGN KEY (company_id, rfq_id) REFERENCES erp_rfqs(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);

CREATE TABLE erp_quotation_lines (
  company_id TEXT NOT NULL,
  quotation_id TEXT NOT NULL,
  rfq_line_id TEXT NOT NULL,
  unit_price_cents INTEGER CHECK (unit_price_cents IS NULL OR unit_price_cents >= 0),
  lead_time_days INTEGER CHECK (lead_time_days IS NULL OR (lead_time_days >= 0 AND lead_time_days <= 1000)),
  note TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (company_id, quotation_id, rfq_line_id),
  FOREIGN KEY (company_id, quotation_id) REFERENCES erp_quotations(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, rfq_line_id) REFERENCES erp_rfq_lines(company_id, id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------ purchase orders

CREATE TABLE erp_purchase_orders (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  supplier_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','awaiting_approval','approved','sent','partially_received','received','cancelled','closed')),
  -- 1 when first made; each amendment after approval adds one (erp_po_revisions keeps the earlier ones)
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  requisition_id TEXT,
  rfq_id TEXT,
  quotation_id TEXT,
  order_date TEXT NOT NULL,
  required_date TEXT,
  delivery_address TEXT NOT NULL DEFAULT '',
  payment_terms_days INTEGER CHECK (payment_terms_days IS NULL OR (payment_terms_days >= 0 AND payment_terms_days <= 365)),
  currency TEXT NOT NULL DEFAULT 'AUD',
  -- 'exclusive': prices before GST; 'inclusive': prices include GST; 'none': no tax
  tax_mode TEXT NOT NULL DEFAULT 'exclusive' CHECK (tax_mode IN ('exclusive','inclusive','none')),
  -- the Finance business workspace whose tax codes the lines use (NULL: GST or none)
  fin_org_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  terms TEXT NOT NULL DEFAULT '',
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  -- which rule approved it: 'within_limit' (a buyer's order at or below the limit), 'manager' (a procurement manager or
  -- ERP administrator), 'solo' (the one-person company exception)
  approval_rule TEXT CHECK (approval_rule IS NULL OR approval_rule IN ('within_limit','manager','solo')),
  approval_limit_cents INTEGER,
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  sent_at INTEGER,
  sent_via TEXT CHECK (sent_via IS NULL OR sent_via IN ('manual')),
  sent_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  cancelled_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  cancelled_at INTEGER,
  cancel_reason TEXT NOT NULL DEFAULT '',
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id),
  FOREIGN KEY (company_id, requisition_id) REFERENCES erp_requisitions(company_id, id),
  FOREIGN KEY (company_id, rfq_id) REFERENCES erp_rfqs(company_id, id),
  FOREIGN KEY (company_id, quotation_id) REFERENCES erp_quotations(company_id, id)
);
CREATE UNIQUE INDEX erp_purchase_orders_number ON erp_purchase_orders(company_id, number);
CREATE INDEX erp_purchase_orders_status ON erp_purchase_orders(company_id, status, order_date);
CREATE INDEX erp_purchase_orders_supplier ON erp_purchase_orders(company_id, supplier_id, order_date);

CREATE TABLE erp_po_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  po_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  product_id TEXT,
  item TEXT NOT NULL DEFAULT '',
  specification TEXT NOT NULL DEFAULT '',
  quantity REAL NOT NULL CHECK (quantity > 0),
  uom TEXT NOT NULL DEFAULT 'each',
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp >= 0 AND discount_bp <= 10000),
  -- a Finance tax code of fin_org_id, else 'GST' or 'NONE'
  tax_code TEXT NOT NULL DEFAULT 'GST',
  tax_rate_bp INTEGER NOT NULL DEFAULT 0 CHECK (tax_rate_bp >= 0 AND tax_rate_bp <= 10000),
  net_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  received_qty REAL NOT NULL DEFAULT 0 CHECK (received_qty >= 0),
  rejected_qty REAL NOT NULL DEFAULT 0 CHECK (rejected_qty >= 0),
  required_date TEXT,
  UNIQUE (company_id, id),
  CHECK (product_id IS NOT NULL OR item <> ''),
  -- never more accepted than ordered
  CHECK (received_qty <= quantity + 1e-9),
  FOREIGN KEY (company_id, po_id) REFERENCES erp_purchase_orders(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_po_lines_po ON erp_po_lines(company_id, po_id, position);
CREATE INDEX erp_po_lines_product ON erp_po_lines(company_id, product_id);

-- Each earlier version of an amended purchase order: what it said, and why it changed.
CREATE TABLE erp_po_revisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  po_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  changed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  changed_at INTEGER NOT NULL,
  UNIQUE (company_id, po_id, revision),
  FOREIGN KEY (company_id, po_id) REFERENCES erp_purchase_orders(company_id, id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------ warehouses, locations and stock

CREATE TABLE erp_warehouses (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  code TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX erp_warehouses_code ON erp_warehouses(company_id, code);

CREATE TABLE erp_locations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  parent_id TEXT,
  code TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'bin' CHECK (level IN ('store','zone','rack','shelf','bin')),
  kind TEXT NOT NULL DEFAULT 'normal' CHECK (kind IN ('normal','quarantine','work_in_progress','finished_goods','receiving','dispatch')),
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, warehouse_id) REFERENCES erp_warehouses(company_id, id),
  FOREIGN KEY (company_id, parent_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_locations_code ON erp_locations(company_id, warehouse_id, code);

-- How a product is stocked: tracking, inspection on receipt, reorder levels (company-wide).
CREATE TABLE erp_product_stock (
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  track_lots INTEGER NOT NULL DEFAULT 0 CHECK (track_lots IN (0, 1)),
  track_serials INTEGER NOT NULL DEFAULT 0 CHECK (track_serials IN (0, 1)),
  track_expiry INTEGER NOT NULL DEFAULT 0 CHECK (track_expiry IN (0, 1)),
  inspection_required INTEGER NOT NULL DEFAULT 0 CHECK (inspection_required IN (0, 1)),
  reorder_point REAL CHECK (reorder_point IS NULL OR reorder_point >= 0),
  min_qty REAL CHECK (min_qty IS NULL OR min_qty >= 0),
  max_qty REAL CHECK (max_qty IS NULL OR max_qty >= 0),
  default_location_id TEXT,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, product_id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, default_location_id) REFERENCES erp_locations(company_id, id)
);

-- Stock on hand and reserved, per product, location, lot and serial. neg_ok copies the company's "allow negative
-- stock" setting, so the CHECK refuses any change that would take stock below zero or reserve more than is there:
-- two people issuing the last unit at the same moment cannot both succeed.
CREATE TABLE erp_stock (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  expiry TEXT,
  on_hand REAL NOT NULL DEFAULT 0,
  reserved REAL NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  neg_ok INTEGER NOT NULL DEFAULT 0 CHECK (neg_ok IN (0, 1)),
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (neg_ok = 1 OR (on_hand >= -1e-9 AND reserved <= on_hand + 1e-9)),
  -- a serial number is one unit
  CHECK (serial = '' OR on_hand <= 1 + 1e-9),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_stock_key ON erp_stock(company_id, product_id, location_id, lot, serial);
CREATE INDEX erp_stock_location ON erp_stock(company_id, location_id);
CREATE UNIQUE INDEX erp_stock_one_serial ON erp_stock(company_id, product_id, serial) WHERE serial <> '' AND on_hand > 0;

-- The movement ledger: append-only (triggers below refuse changes and deletions). One operation writes one or more rows
-- with the same group_id (a transfer writes its out and in); on_hand_delta and reserved_delta are what it did to stock.
CREATE TABLE erp_stock_moves (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  -- receipt, issue, transfer_out, transfer_in, reserve, unreserve, adjust_in, adjust_out, customer_return,
  -- supplier_return, count_in, count_out, quarantine_out, quarantine_in, release_out, release_in, scrap. The names are
  -- checked by stock.ts, not listed here, so later releases (manufacturing) add movement types without rebuilding this
  -- append-only table.
  move_type TEXT NOT NULL CHECK (length(move_type) BETWEEN 1 AND 40),
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  expiry TEXT,
  on_hand_delta REAL NOT NULL DEFAULT 0,
  reserved_delta REAL NOT NULL DEFAULT 0,
  unit_cost_cents REAL,
  value_delta_cents INTEGER NOT NULL DEFAULT 0,
  -- receipt, issue, transfer, reservation, adjustment, customer_return, supplier_return, count, quarantine, scrap
  -- (checked by stock.ts, as move_type)
  source_type TEXT NOT NULL CHECK (length(source_type) BETWEEN 1 AND 40),
  source_id TEXT,
  reference TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE INDEX erp_stock_moves_company ON erp_stock_moves(company_id, created_at);
CREATE INDEX erp_stock_moves_product ON erp_stock_moves(company_id, product_id, created_at);
CREATE INDEX erp_stock_moves_source ON erp_stock_moves(company_id, source_type, source_id);
CREATE INDEX erp_stock_moves_lot ON erp_stock_moves(company_id, product_id, lot) WHERE lot <> '';
CREATE INDEX erp_stock_moves_serial ON erp_stock_moves(company_id, product_id, serial) WHERE serial <> '';
CREATE INDEX erp_stock_moves_group ON erp_stock_moves(company_id, group_id);

-- The ledger is append-only: no movement can be changed (only created_by may be cleared, when an account is deleted)
-- or deleted. The one exception is removing a whole company's ERP data (the example company, on its owner's request):
-- the removal first writes the company to erp_purges, in the same transaction, and takes it out at the end.
CREATE TABLE erp_purges (
  company_id TEXT PRIMARY KEY,
  started_at INTEGER NOT NULL
);
CREATE TRIGGER erp_stock_moves_append_only BEFORE UPDATE OF id, company_id, group_id, move_type, product_id, location_id, lot, serial, expiry, on_hand_delta, reserved_delta, unit_cost_cents, value_delta_cents, source_type, source_id, reference, reason, created_at ON erp_stock_moves BEGIN SELECT RAISE(ABORT, 'ERP_LEDGER: the stock movement ledger is append-only'); END;
CREATE TRIGGER erp_stock_moves_no_delete BEFORE DELETE ON erp_stock_moves WHEN NOT EXISTS (SELECT 1 FROM erp_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'ERP_LEDGER: the stock movement ledger is append-only'); END;

-- Valuation per product (company-wide): quantity and value of stock on hand. Weighted average issues at value/qty.
CREATE TABLE erp_valuation (
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 0,
  value_cents INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, product_id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);

-- FIFO cost layers: each receipt (or return, or adjustment in) adds a layer; issues consume the oldest first.
CREATE TABLE erp_cost_layers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  received_at INTEGER NOT NULL,
  seq INTEGER NOT NULL,
  qty_in REAL NOT NULL CHECK (qty_in > 0),
  qty_remaining REAL NOT NULL CHECK (qty_remaining >= -1e-9),
  unit_cost_cents REAL NOT NULL CHECK (unit_cost_cents >= 0),
  source_move_id TEXT,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_cost_layers_open ON erp_cost_layers(company_id, product_id, received_at, seq) WHERE qty_remaining > 0;

CREATE TABLE erp_reservations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  stock_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  issued_qty REAL NOT NULL DEFAULT 0 CHECK (issued_qty >= 0),
  released_qty REAL NOT NULL DEFAULT 0 CHECK (released_qty >= 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','issued','released')),
  reference TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (issued_qty + released_qty <= quantity + 1e-9),
  FOREIGN KEY (company_id, stock_id) REFERENCES erp_stock(company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_reservations_open ON erp_reservations(company_id, status, created_at);

-- Adjustments above the company's threshold wait here for a warehouse manager.
CREATE TABLE erp_adjustments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  expiry TEXT,
  quantity REAL NOT NULL CHECK (quantity <> 0),
  unit_cost_cents REAL,
  value_cents INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','posted','rejected')),
  requested_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at INTEGER,
  decision_note TEXT NOT NULL DEFAULT '',
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  group_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_adjustments_number ON erp_adjustments(company_id, number);

-- Stocktakes and cycle counts: the expected quantities when the count was opened, what was counted, then (approved by
-- a warehouse manager who did not count) the adjusting movements.
CREATE TABLE erp_counts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  kind TEXT NOT NULL DEFAULT 'stocktake' CHECK (kind IN ('stocktake','cycle')),
  warehouse_id TEXT NOT NULL,
  location_id TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','submitted','posted','cancelled')),
  notes TEXT NOT NULL DEFAULT '',
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  group_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, warehouse_id) REFERENCES erp_warehouses(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_counts_number ON erp_counts(company_id, number);

CREATE TABLE erp_count_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  count_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  expected_qty REAL NOT NULL DEFAULT 0,
  counted_qty REAL CHECK (counted_qty IS NULL OR counted_qty >= 0),
  counted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  counted_at INTEGER,
  UNIQUE (company_id, id),
  UNIQUE (company_id, count_id, product_id, location_id, lot, serial),
  FOREIGN KEY (company_id, count_id) REFERENCES erp_counts(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);

-- ------------------------------------------------------------------ goods receipts

CREATE TABLE erp_receipts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  po_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  received_date TEXT NOT NULL,
  delivery_ref TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  -- the client's key for this submission: a double click or a retry finds the receipt already made
  request_key TEXT,
  on_time INTEGER CHECK (on_time IS NULL OR on_time IN (0, 1)),
  inspection_required INTEGER NOT NULL DEFAULT 0 CHECK (inspection_required IN (0, 1)),
  group_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, po_id) REFERENCES erp_purchase_orders(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);
CREATE UNIQUE INDEX erp_receipts_number ON erp_receipts(company_id, number);
CREATE UNIQUE INDEX erp_receipts_request ON erp_receipts(company_id, request_key) WHERE request_key IS NOT NULL;
CREATE INDEX erp_receipts_po ON erp_receipts(company_id, po_id, created_at);
CREATE INDEX erp_receipts_supplier ON erp_receipts(company_id, supplier_id, received_date);

CREATE TABLE erp_receipt_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  receipt_id TEXT NOT NULL,
  po_line_id TEXT NOT NULL,
  product_id TEXT,
  location_id TEXT,
  received_qty REAL NOT NULL CHECK (received_qty >= 0),
  accepted_qty REAL NOT NULL CHECK (accepted_qty >= 0),
  damaged_qty REAL NOT NULL DEFAULT 0 CHECK (damaged_qty >= 0),
  rejected_qty REAL NOT NULL DEFAULT 0 CHECK (rejected_qty >= 0),
  reason TEXT NOT NULL DEFAULT '',
  lot TEXT NOT NULL DEFAULT '',
  serials_json TEXT NOT NULL DEFAULT '[]',
  expiry TEXT,
  unit_cost_cents REAL,
  inspection_required INTEGER NOT NULL DEFAULT 0 CHECK (inspection_required IN (0, 1)),
  UNIQUE (company_id, id),
  CHECK (abs(received_qty - accepted_qty - damaged_qty - rejected_qty) < 1e-6),
  FOREIGN KEY (company_id, receipt_id) REFERENCES erp_receipts(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, po_line_id) REFERENCES erp_po_lines(company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE INDEX erp_receipt_lines_receipt ON erp_receipt_lines(company_id, receipt_id);
CREATE INDEX erp_receipt_lines_po_line ON erp_receipt_lines(company_id, po_line_id);

-- ------------------------------------------------------------------ the controlled link to other systems

-- One row per thing the ERP asks another system to do. idempotency_key is unique, so a retry or a double request finds
-- the row and never does it twice. last_error is a short reason only, never record content.
CREATE TABLE erp_integration_events (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  -- finance.draft_bill, finance.inventory_posting (checked by the code; later releases add kinds)
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 40),
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT 'finance',
  idempotency_key TEXT NOT NULL,
  -- planned: recorded for a later release (inventory postings), not sent
  status TEXT NOT NULL CHECK (status IN ('pending','done','failed','planned')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT NOT NULL DEFAULT '',
  target_ref TEXT,
  target_org_id TEXT,
  amount_cents INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX erp_integration_events_key ON erp_integration_events(idempotency_key);
CREATE INDEX erp_integration_events_source ON erp_integration_events(company_id, source_type, source_id);
CREATE INDEX erp_integration_events_status ON erp_integration_events(company_id, status, created_at);
