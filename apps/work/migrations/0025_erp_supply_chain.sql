-- BIZOMAT ERP, Release 5 part A (owner's brief "BIZOMAT ERP — full enterprise functionality", section 9): supply chain
-- and logistics. Sales orders (SO-00001) for the company's existing customer records, allocation of stock, make to order
-- through a linked manufacturing order, carriers, shipments (SHP-00001) with pick lists, packages, dispatch and delivery
-- confirmation, and returns (RMA-00001). Additive only: new tables and indexes, no existing table changed, no trigger.
--
-- As in Releases 1 to 4 (0020 to 0023), every row carries company_id and rows link through (company_id, id) keys, so the
-- database refuses a link between two companies. The customer is a reference to the CRM company and contact and the
-- Finance contact the company already keeps (never a copy); the name on a document is a snapshot, as Finance keeps on
-- its own documents. There is no foreign key to the CRM's or Finance's tables: they are read through their own access
-- rules. Kinds that later releases may extend (how a line is fulfilled, package kinds, return reasons) are checked by the
-- code, with a length check here; statuses are listed. Stock moves through Release 2's ledger (erp_stock_moves) with
-- the new movement type sales_dispatch and source shipment, which its open lists take without a rebuild. Draft invoices
-- and credit notes are made by Finance's own code and recorded in erp_integration_events (Release 2).
-- Code: src/worker/erp (sales.ts, logistics.ts, returns.ts, supply-reports.ts). Docs: docs/erp/release-5-supply-chain.md.

-- ------------------------------------------------------------------ carriers

-- A carrier: its services (a list of names) and the address of its tracking page, with {tracking} where the tracking
-- number goes.
CREATE TABLE erp_carriers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  code TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  services_json TEXT NOT NULL DEFAULT '[]',
  tracking_url TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  account_ref TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX erp_carriers_code ON erp_carriers(company_id, code);

-- ------------------------------------------------------------------ sales orders

CREATE TABLE erp_sales_orders (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','confirmed','partially_allocated','allocated','partially_shipped','shipped','invoiced','closed','cancelled')),
  -- 1 when first made; each amendment after confirmation adds one (erp_so_revisions keeps the earlier ones)
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  -- the customer: the CRM company and contact, and the Finance contact it is billed as (references only)
  crm_org_id TEXT,
  crm_company_id TEXT,
  crm_contact_id TEXT,
  crm_deal_id TEXT,
  fin_org_id TEXT,
  fin_contact_id TEXT,
  customer_name TEXT NOT NULL,
  contact_name TEXT NOT NULL DEFAULT '',
  order_date TEXT NOT NULL,
  requested_date TEXT,
  promised_date TEXT,
  delivery_address TEXT NOT NULL DEFAULT '',
  shipping_terms TEXT NOT NULL DEFAULT '',
  customer_po TEXT NOT NULL DEFAULT '',
  currency TEXT NOT NULL DEFAULT 'AUD',
  -- 'exclusive': prices before GST; 'inclusive': prices include GST; 'none': no tax
  tax_mode TEXT NOT NULL DEFAULT 'exclusive' CHECK (tax_mode IN ('exclusive','inclusive','none')),
  notes TEXT NOT NULL DEFAULT '',
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  confirmed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  confirmed_at INTEGER,
  cancelled_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  cancelled_at INTEGER,
  cancel_reason TEXT NOT NULL DEFAULT '',
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  close_reason TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (crm_company_id IS NOT NULL OR fin_contact_id IS NOT NULL)
);
CREATE UNIQUE INDEX erp_sales_orders_number ON erp_sales_orders(company_id, number);
CREATE INDEX erp_sales_orders_status ON erp_sales_orders(company_id, status, order_date);
CREATE INDEX erp_sales_orders_customer ON erp_sales_orders(company_id, crm_company_id);
CREATE INDEX erp_sales_orders_fin_contact ON erp_sales_orders(company_id, fin_contact_id);
-- one live sales order per won CRM deal (a cancelled one lets another be made)
CREATE UNIQUE INDEX erp_sales_orders_deal ON erp_sales_orders(company_id, crm_deal_id) WHERE crm_deal_id IS NOT NULL AND status <> 'cancelled';

-- A line: an ERP product, priced as Finance prices lines. allocated_qty is the stock reserved for it and not yet
-- shipped; the CHECKs refuse allocating or shipping more than ordered and returning more than shipped, so two people
-- allocating or dispatching the last units at the same moment cannot both succeed.
CREATE TABLE erp_so_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  so_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  quantity REAL NOT NULL CHECK (quantity > 0),
  uom TEXT NOT NULL DEFAULT 'each',
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp >= 0 AND discount_bp <= 10000),
  -- a Finance sales tax code of the order's workspace, else 'GST' or 'NONE'
  tax_code TEXT NOT NULL DEFAULT 'GST',
  tax_rate_bp INTEGER NOT NULL DEFAULT 0 CHECK (tax_rate_bp >= 0 AND tax_rate_bp <= 10000),
  net_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  promised_date TEXT,
  -- stock (from stock) or make (made to order); checked by sales.ts
  fulfil TEXT NOT NULL DEFAULT 'stock' CHECK (length(fulfil) BETWEEN 1 AND 20),
  allocated_qty REAL NOT NULL DEFAULT 0 CHECK (allocated_qty >= -1e-9),
  shipped_qty REAL NOT NULL DEFAULT 0 CHECK (shipped_qty >= -1e-9),
  returned_qty REAL NOT NULL DEFAULT 0 CHECK (returned_qty >= -1e-9),
  UNIQUE (company_id, id),
  CHECK (allocated_qty + shipped_qty <= quantity + 1e-9),
  CHECK (returned_qty <= shipped_qty + 1e-9),
  FOREIGN KEY (company_id, so_id) REFERENCES erp_sales_orders(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_so_lines_so ON erp_so_lines(company_id, so_id, position);
CREATE INDEX erp_so_lines_product ON erp_so_lines(company_id, product_id);

-- Each earlier version of an amended sales order: what it said, and why it changed.
CREATE TABLE erp_so_revisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  so_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  changed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  changed_at INTEGER NOT NULL,
  UNIQUE (company_id, so_id, revision),
  FOREIGN KEY (company_id, so_id) REFERENCES erp_sales_orders(company_id, id) ON DELETE CASCADE
);

-- Stock allocated to a line: Release 2's reservations (erp_reservations), made and consumed through StockOps.
CREATE TABLE erp_so_allocations (
  company_id TEXT NOT NULL,
  so_line_id TEXT NOT NULL,
  reservation_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, reservation_id),
  FOREIGN KEY (company_id, so_line_id) REFERENCES erp_so_lines(company_id, id),
  FOREIGN KEY (company_id, reservation_id) REFERENCES erp_reservations(company_id, id)
);
CREATE INDEX erp_so_allocations_line ON erp_so_allocations(company_id, so_line_id);

-- Make to order: a manufacturing order made for a line (one line per order; a line may have several orders).
CREATE TABLE erp_so_mo_links (
  company_id TEXT NOT NULL,
  so_line_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, so_line_id, mo_id),
  FOREIGN KEY (company_id, so_line_id) REFERENCES erp_so_lines(company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id)
);
CREATE UNIQUE INDEX erp_so_mo_links_mo ON erp_so_mo_links(company_id, mo_id);

-- ------------------------------------------------------------------ shipments

CREATE TABLE erp_shipments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  so_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','picking','picked','packed','dispatched','delivered','cancelled')),
  carrier_id TEXT,
  service TEXT NOT NULL DEFAULT '',
  tracking_number TEXT NOT NULL DEFAULT '',
  -- what the carrier charges the company, and what the company charges the customer (a line on the invoice)
  freight_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (freight_cost_cents >= 0),
  freight_charge_cents INTEGER NOT NULL DEFAULT 0 CHECK (freight_charge_cents >= 0),
  freight_tax_code TEXT NOT NULL DEFAULT 'GST',
  planned_date TEXT,
  window_start TEXT,
  window_end TEXT,
  ship_to TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  -- an email to the customer when it is dispatched, asked for per shipment; notify_status says what happened to it
  notify INTEGER NOT NULL DEFAULT 0 CHECK (notify IN (0, 1)),
  notify_email TEXT NOT NULL DEFAULT '',
  notify_status TEXT NOT NULL DEFAULT '' CHECK (length(notify_status) <= 40),
  group_id TEXT,
  dispatched_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  dispatched_at INTEGER,
  delivered_at INTEGER,
  received_by TEXT NOT NULL DEFAULT '',
  delivery_note TEXT NOT NULL DEFAULT '',
  delivery_recorded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  cancelled_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  cancelled_at INTEGER,
  cancel_reason TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (window_start IS NULL OR window_end IS NULL OR window_start <= window_end),
  FOREIGN KEY (company_id, so_id) REFERENCES erp_sales_orders(company_id, id),
  FOREIGN KEY (company_id, carrier_id) REFERENCES erp_carriers(company_id, id)
);
CREATE UNIQUE INDEX erp_shipments_number ON erp_shipments(company_id, number);
CREATE INDEX erp_shipments_status ON erp_shipments(company_id, status, planned_date);
CREATE INDEX erp_shipments_so ON erp_shipments(company_id, so_id, created_at);
CREATE INDEX erp_shipments_carrier ON erp_shipments(company_id, carrier_id, dispatched_at);

-- What a shipment carries of each sales order line: planned, picked and shipped.
CREATE TABLE erp_shipment_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  shipment_id TEXT NOT NULL,
  so_line_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  picked_qty REAL NOT NULL DEFAULT 0 CHECK (picked_qty >= 0),
  shipped_qty REAL NOT NULL DEFAULT 0 CHECK (shipped_qty >= 0),
  UNIQUE (company_id, id),
  UNIQUE (company_id, shipment_id, so_line_id),
  CHECK (picked_qty <= quantity + 1e-9),
  CHECK (shipped_qty <= picked_qty + 1e-9),
  FOREIGN KEY (company_id, shipment_id) REFERENCES erp_shipments(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, so_line_id) REFERENCES erp_so_lines(company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_shipment_lines_so_line ON erp_shipment_lines(company_id, so_line_id);

-- The pick list: where to take each line from (the allocated stock, soonest expiry first, then the oldest), and what was
-- picked there.
CREATE TABLE erp_pick_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  shipment_id TEXT NOT NULL,
  shipment_line_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  expiry TEXT,
  reservation_id TEXT,
  suggested_qty REAL NOT NULL CHECK (suggested_qty > 0),
  picked_qty REAL CHECK (picked_qty IS NULL OR picked_qty >= 0),
  picked_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  picked_at INTEGER,
  UNIQUE (company_id, id),
  CHECK (picked_qty IS NULL OR picked_qty <= suggested_qty + 1e-9),
  FOREIGN KEY (company_id, shipment_id) REFERENCES erp_shipments(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, shipment_line_id) REFERENCES erp_shipment_lines(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id),
  FOREIGN KEY (company_id, reservation_id) REFERENCES erp_reservations(company_id, id)
);
CREATE INDEX erp_pick_lines_shipment ON erp_pick_lines(company_id, shipment_id, position);
CREATE INDEX erp_pick_lines_reservation ON erp_pick_lines(company_id, reservation_id);

-- Packages of a shipment: kind (box, carton, pallet, crate, envelope, other; checked by logistics.ts), weight,
-- dimensions and contents.
CREATE TABLE erp_packages (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  shipment_id TEXT NOT NULL,
  seq INTEGER NOT NULL CHECK (seq >= 1),
  kind TEXT NOT NULL DEFAULT 'box' CHECK (length(kind) BETWEEN 1 AND 20),
  weight_kg REAL CHECK (weight_kg IS NULL OR weight_kg >= 0),
  length_cm REAL CHECK (length_cm IS NULL OR length_cm >= 0),
  width_cm REAL CHECK (width_cm IS NULL OR width_cm >= 0),
  height_cm REAL CHECK (height_cm IS NULL OR height_cm >= 0),
  contents_json TEXT NOT NULL DEFAULT '[]',
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, shipment_id, seq),
  FOREIGN KEY (company_id, shipment_id) REFERENCES erp_shipments(company_id, id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------ returns

-- A return (RMA-00001): asked for, authorised by a sales manager (or rejected), received back into stock through the
-- customer return movement (into quarantine if chosen), then closed. It may name a Quality inspection or NCR of the
-- same company. reason: damaged, wrong_item, faulty, not_needed, other (checked by returns.ts).
CREATE TABLE erp_rmas (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  so_id TEXT NOT NULL,
  shipment_id TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','authorised','received','closed','rejected','cancelled')),
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 1 AND 30),
  details TEXT NOT NULL DEFAULT '',
  customer_name TEXT NOT NULL DEFAULT '',
  authorised_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  authorised_at INTEGER,
  decision_note TEXT NOT NULL DEFAULT '',
  received_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  received_at INTEGER,
  group_id TEXT,
  inspection_id TEXT,
  ncr_id TEXT,
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, so_id) REFERENCES erp_sales_orders(company_id, id),
  FOREIGN KEY (company_id, shipment_id) REFERENCES erp_shipments(company_id, id),
  FOREIGN KEY (company_id, inspection_id) REFERENCES erp_qc_inspections(company_id, id),
  FOREIGN KEY (company_id, ncr_id) REFERENCES erp_qc_ncrs(company_id, id)
);
CREATE UNIQUE INDEX erp_rmas_number ON erp_rmas(company_id, number);
CREATE INDEX erp_rmas_status ON erp_rmas(company_id, status, created_at);
CREATE INDEX erp_rmas_so ON erp_rmas(company_id, so_id);

CREATE TABLE erp_rma_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  rma_id TEXT NOT NULL,
  so_line_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  received_qty REAL NOT NULL DEFAULT 0 CHECK (received_qty >= 0),
  location_id TEXT,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  unit_cost_cents REAL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, rma_id, so_line_id),
  CHECK (received_qty <= quantity + 1e-9),
  FOREIGN KEY (company_id, rma_id) REFERENCES erp_rmas(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, so_line_id) REFERENCES erp_so_lines(company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE INDEX erp_rma_lines_so_line ON erp_rma_lines(company_id, so_line_id);
