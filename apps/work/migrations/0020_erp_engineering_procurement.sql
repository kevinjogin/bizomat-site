-- BIZOMAT ERP, Release 1 (owner's brief "BIZOMAT ERP — full enterprise functionality", 14 Nov 2026): the ERP's own
-- roles, numbering and history; the product master with variants; engineering revisions with change requests and change
-- orders; multi-level bills of materials; engineering documents with honest CAD references; and the supplier master
-- (the procurement foundation). Additive only: new tables and indexes, no existing table changed.
--
-- Every row carries company_id: a registered company (co_companies), a person's own company (sys_companies) or their
-- example company (sys_demo). There is no foreign key to those (one column names any of the three); rows link to each
-- other through (company_id, id) keys, so the database itself refuses a link between two companies. Code:
-- src/worker/erp. Docs: docs/erp/release-1.md.

-- ------------------------------------------------------------------ foundations

-- ERP roles per company. A person may hold several. The company's owner and administrators are ERP administrators
-- without a row here; other members are viewers until an ERP administrator gives them roles.
CREATE TABLE erp_user_roles (
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('erp_admin','executive','engineer','engineering_approver','buyer','procurement_manager','viewer')),
  set_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  set_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, user_id, role)
);

-- Per-company numbering: PRD-00001, ECR-0001, ECO-0001, SUP-0001, DOC-0001.
CREATE TABLE erp_counters (
  company_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('product','change_request','change_order','supplier','document')),
  value INTEGER NOT NULL,
  PRIMARY KEY (company_id, kind)
);

-- The history of every create, change and decision, with before and after values. Never file contents or secrets.
CREATE TABLE erp_events (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  product_id TEXT,
  summary TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX erp_events_company ON erp_events(company_id, created_at);
CREATE INDEX erp_events_entity ON erp_events(company_id, entity_type, entity_id, created_at);
CREATE INDEX erp_events_product ON erp_events(company_id, product_id, created_at);

-- ------------------------------------------------------------------ product master

CREATE TABLE erp_products (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  sku TEXT COLLATE NOCASE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  subcategory TEXT NOT NULL DEFAULT '',
  family TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('raw_material','component','manufactured_part','assembly','subassembly','finished_product','purchased_item','consumable','service')),
  uom TEXT NOT NULL DEFAULT 'each',
  manufacturer TEXT NOT NULL DEFAULT '',
  standard_cost_cents INTEGER CHECK (standard_cost_cents IS NULL OR standard_cost_cents >= 0),
  current_cost_cents INTEGER CHECK (current_cost_cents IS NULL OR current_cost_cents >= 0),
  price_cents INTEGER CHECK (price_cents IS NULL OR price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'AUD',
  weight REAL CHECK (weight IS NULL OR weight >= 0),
  weight_unit TEXT NOT NULL DEFAULT 'kg',
  length REAL CHECK (length IS NULL OR length >= 0),
  width REAL CHECK (width IS NULL OR width >= 0),
  height REAL CHECK (height IS NULL OR height >= 0),
  dimension_unit TEXT NOT NULL DEFAULT 'mm',
  material TEXT NOT NULL DEFAULT '',
  properties_json TEXT NOT NULL DEFAULT '[]',
  lifecycle TEXT NOT NULL DEFAULT 'draft' CHECK (lifecycle IN ('draft','active','phased_out','obsolete')),
  effective_from TEXT,
  effective_to TEXT,
  -- a variant is a product of its own (its own number, BOM and revisions) with the attributes that set it apart
  variant_of TEXT,
  variant_json TEXT NOT NULL DEFAULT '{}',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, variant_of) REFERENCES erp_products(company_id, id)
);
CREATE UNIQUE INDEX erp_products_number ON erp_products(company_id, number);
CREATE UNIQUE INDEX erp_products_sku ON erp_products(company_id, sku) WHERE sku IS NOT NULL AND sku <> '';
CREATE INDEX erp_products_variant ON erp_products(company_id, variant_of) WHERE variant_of IS NOT NULL;
CREATE INDEX erp_products_list ON erp_products(company_id, archived_at, updated_at);

-- ------------------------------------------------------------------ engineering revisions and change control

CREATE TABLE erp_change_requests (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','under_review','approved','rejected')),
  requested_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at INTEGER,
  decision_note TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX erp_change_requests_number ON erp_change_requests(company_id, number);

CREATE TABLE erp_change_request_products (
  company_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  PRIMARY KEY (company_id, request_id, product_id),
  FOREIGN KEY (company_id, request_id) REFERENCES erp_change_requests(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);

CREATE TABLE erp_change_orders (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  request_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','released','cancelled')),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  released_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  released_at INTEGER,
  cancelled_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  cancelled_at INTEGER,
  -- a one-time value written by the release that won: the rest of that release's statements run only while it is there
  release_token TEXT,
  decision_note TEXT NOT NULL DEFAULT '',
  -- 1 when the person who drafted it also approved it, allowed only in a one-person company and recorded here
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  search TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, request_id) REFERENCES erp_change_requests(company_id, id)
);
CREATE UNIQUE INDEX erp_change_orders_number ON erp_change_orders(company_id, number);
CREATE INDEX erp_change_orders_status ON erp_change_orders(company_id, status, updated_at);

-- A product's engineering revisions. The bill of materials belongs to a revision. Only draft and in_change revisions can
-- change; a released revision is locked; releasing a new one supersedes the previous released revision.
CREATE TABLE erp_revisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  label TEXT NOT NULL COLLATE NOCASE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_change','released','superseded')),
  description TEXT NOT NULL DEFAULT '',
  change_reason TEXT NOT NULL DEFAULT '',
  effective_date TEXT,
  -- the change order that carries it to release (one at a time)
  eco_id TEXT,
  released_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  released_at INTEGER,
  superseded_by TEXT,
  superseded_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, eco_id) REFERENCES erp_change_orders(company_id, id)
);
CREATE UNIQUE INDEX erp_revisions_label ON erp_revisions(company_id, product_id, label);
-- one released revision per product at any time
CREATE UNIQUE INDEX erp_revisions_released ON erp_revisions(company_id, product_id) WHERE status = 'released';
CREATE INDEX erp_revisions_eco ON erp_revisions(company_id, eco_id) WHERE eco_id IS NOT NULL;

CREATE TABLE erp_bom_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  component_id TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  uom TEXT NOT NULL DEFAULT 'each',
  scrap_pct REAL NOT NULL DEFAULT 0 CHECK (scrap_pct >= 0 AND scrap_pct < 1000),
  ref_designator TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  effective_from TEXT,
  effective_to TEXT,
  optional INTEGER NOT NULL DEFAULT 0 CHECK (optional IN (0, 1)),
  -- lines sharing a group are alternatives to one another
  alt_group TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, revision_id) REFERENCES erp_revisions(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, component_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_bom_lines_revision ON erp_bom_lines(company_id, revision_id, position);
CREATE INDEX erp_bom_lines_component ON erp_bom_lines(company_id, component_id);

-- ------------------------------------------------------------------ engineering documents

CREATE TABLE erp_documents (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  product_id TEXT NOT NULL,
  revision_id TEXT,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('drawing','model','pdf','dxf','step','specification','image','other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','obsolete')),
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, revision_id) REFERENCES erp_revisions(company_id, id)
);
CREATE UNIQUE INDEX erp_documents_number ON erp_documents(company_id, number);
CREATE INDEX erp_documents_product ON erp_documents(company_id, product_id, revision_id);

-- Each version is either a file kept in the app's file store, or a reference to a CAD file on the engineer's own
-- computer (path, configuration, file name): CAD files are never assumed to live on the server.
CREATE TABLE erp_document_versions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  doc_revision TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL CHECK (source IN ('file','cad_reference')),
  file_name TEXT,
  mime TEXT,
  size INTEGER,
  r2_key TEXT,
  cad_path TEXT,
  cad_config TEXT,
  cad_file_name TEXT,
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, document_id) REFERENCES erp_documents(company_id, id),
  CHECK ((source = 'file' AND r2_key IS NOT NULL) OR (source = 'cad_reference' AND cad_path IS NOT NULL))
);
CREATE UNIQUE INDEX erp_document_versions_number ON erp_document_versions(company_id, document_id, version);

-- ------------------------------------------------------------------ suppliers (the procurement foundation)

CREATE TABLE erp_suppliers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  legal_name TEXT NOT NULL,
  trading_name TEXT NOT NULL DEFAULT '',
  abn TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  postal_address TEXT NOT NULL DEFAULT '',
  delivery_address TEXT NOT NULL DEFAULT '',
  payment_terms_days INTEGER CHECK (payment_terms_days IS NULL OR (payment_terms_days >= 0 AND payment_terms_days <= 365)),
  currency TEXT NOT NULL DEFAULT 'AUD',
  delivery_terms TEXT NOT NULL DEFAULT '',
  lead_time_days INTEGER CHECK (lead_time_days IS NULL OR (lead_time_days >= 0 AND lead_time_days <= 1000)),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','on_hold','blocked')),
  status_note TEXT NOT NULL DEFAULT '',
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  -- the Finance supplier contact it is paid as (fin_contacts); linked, never copied
  fin_org_id TEXT,
  fin_contact_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX erp_suppliers_number ON erp_suppliers(company_id, number);
CREATE UNIQUE INDEX erp_suppliers_fin ON erp_suppliers(company_id, fin_contact_id) WHERE fin_contact_id IS NOT NULL;
CREATE INDEX erp_suppliers_list ON erp_suppliers(company_id, archived_at, status);

CREATE TABLE erp_supplier_contacts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_supplier_contacts_supplier ON erp_supplier_contacts(company_id, supplier_id);

-- Who supplies a product: the supplier's part number, price, lead time and minimum order; one preferred supplier.
CREATE TABLE erp_product_suppliers (
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_part_number TEXT NOT NULL DEFAULT '',
  price_cents INTEGER CHECK (price_cents IS NULL OR price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'AUD',
  lead_time_days INTEGER CHECK (lead_time_days IS NULL OR (lead_time_days >= 0 AND lead_time_days <= 1000)),
  moq REAL CHECK (moq IS NULL OR moq > 0),
  preferred INTEGER NOT NULL DEFAULT 0 CHECK (preferred IN (0, 1)),
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, product_id, supplier_id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);
CREATE UNIQUE INDEX erp_product_suppliers_preferred ON erp_product_suppliers(company_id, product_id) WHERE preferred = 1;
CREATE INDEX erp_product_suppliers_supplier ON erp_product_suppliers(company_id, supplier_id);

-- ------------------------------------------------------------------ attachments (product images and documents, supplier documents)

CREATE TABLE erp_files (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  product_id TEXT,
  supplier_id TEXT,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  UNIQUE (company_id, id),
  CHECK ((product_id IS NULL) <> (supplier_id IS NULL)),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);
CREATE INDEX erp_files_product ON erp_files(company_id, product_id) WHERE product_id IS NOT NULL;
CREATE INDEX erp_files_supplier ON erp_files(company_id, supplier_id) WHERE supplier_id IS NOT NULL;
