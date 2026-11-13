# 4. Master data ownership matrix

Status: proposal for review. One owner per record. Every other module refers to it by identifier, reads it through
the owner's service, and never keeps a second copy that can drift.

## 4.1 Rules

1. **One authoritative record.** Each business object has exactly one owning module and one table. Other modules hold
   a reference (`<app>:<id>`), never a copy of the editable fields.
2. **Extend, do not duplicate.** When ERP needs more about an existing record (a supplier's lead time, a purchase order
   line's received quantity), it adds an extension table keyed by the owner's identifier, or an additive nullable
   column written only by the server. It never creates a parallel "ERP supplier" or "ERP customer".
3. **Writes go through the owner.** ERP creates an invoice by calling Finance's `createDoc`, a task by calling Project
   Management's item service, a customer by calling the CRM. The owner's permission checks, numbering, validation and
   audit apply unchanged.
4. **Snapshots only where the law or the document needs them.** A sent quote keeps its version as it was sent; an
   invoice keeps the customer name and address it was issued with (Finance does this today through its PDF and
   documents). Snapshots are never edited back into the master.
5. **Same company.** A reference between two tools is valid only if both belong to the same BIZOMAT company
   (`co_tools`), checked on every write, as `src/worker/company/links.ts` does today.

## 4.2 Matrix

Legend: **O** owns (creates, edits, deletes, numbers), **R** reads by reference, **X** extends with its own fields in its
own table, **L** links (keeps a reference only), **-** no use.

| Object | Core | CRM | Finance | Projects | ERP | CAD | Table that is authoritative |
| --- | --- | --- | --- | --- | --- | --- | --- |
| User (person, sign-in) | O | R | R | R | R | R (planned, BIZOMAT sign-in) | `users`, `sessions`, `api_tokens` |
| Company (organisation) | O | R | R | R | R | - | `co_companies` |
| Legal entity | O (new) | - | R | - | R | - | `co_legal_entities` (new; a company's first legal entity mirrors `co_companies`) |
| Business site / branch | O (new) | R | R | R | R | - | `co_sites` (new) |
| Department | O | R (team) | R (tracking) | R (team) | R | - | `co_departments` |
| Membership and tool roles | O | R | R | R | R | - | `co_members` (+ tool member tables kept in step by `sync.ts`) |
| ERP module access | O (new) | - | - | - | R | - | `co_module_access` (new) |
| Customer (organisation) | R | **O** | X (billing contact) | L | L | - | `crm_companies`, billed as `fin_contacts` via `co_customer_links` |
| Contact person | - | **O** | R | L | L | - | `crm_contacts` |
| Lead, opportunity, pipeline | - | **O** | L | L | L | - | `crm_leads`, `crm_deals`, `crm_pipelines`, `crm_stages` |
| Sales activity, notes, emails | - | **O** | - | - | L (delivery history events) | - | `crm_activities`, `crm_notes`, `crm_events` |
| Supplier | - | - | **O** | - | X (supplier profile) | - | `fin_contacts` (kind supplier or both) + `erp_supplier_profiles` (new) |
| Product (master) | - | X (deal catalogue link) | X (line reference) | - | **O** | L (models, drawings) | `erp_products` (new); `crm_products` gains `erp_product_id`; `fin_doc_lines` gains `product_id` |
| Product variant | - | - | R | - | **O** | L | `erp_product_variants` (new) |
| BOM, BOM line | - | - | - | - | **O** | L | `erp_boms`, `erp_bom_lines` (new) |
| Engineering revision | - | - | - | - | **O** | L (file revision) | `erp_revisions` (new) |
| Engineering change (request, order) | - | - | - | L (tasks) | **O** | L | `erp_changes` (new) |
| CAD model and drawing (the SOLIDWORKS file) | - | - | - | - | L + released copies | **O** (operates) | The master copy is the SOLIDWORKS file on the engineer's computer; CAD Automation (separate app `cados`) operates it through the add-in and keeps no models. ERP keeps the link (file name and path as reported, CAD revision) and the released exports (PDF, STEP, DXF) as its own documents (`erp_cad_links`, `erp_documents`) |
| CAD command (job) | - | - | - | - | L | **O** | CAD Automation's command history (`bridge.sqlite`); ERP keeps the command id and status it started |
| Routing, operation, work centre | - | - | - | - | **O** | - | `erp_routings`, `erp_operations`, `erp_work_centres` (new) |
| Quotation | - | L (deal) | **O** | - | R | - | `fin_quotes` (built in Finance Stage 1) |
| Sales order, delivery | - | L (history) | L (invoice) | L | **O** | - | `erp_sales_orders`, `erp_deliveries` (new) |
| Invoice, credit note, payment | - | R (owed figures) | **O** | - | R | - | `fin_docs` (invoice), `fin_credit_notes`, `fin_payments` |
| Purchase requisition, RFQ | - | - | - | - | **O** | - | `erp_requisitions`, `erp_rfqs` (new) |
| Purchase order (document) | - | - | **O** | - | X (receiving, product lines) | - | `fin_docs` kind `purchase_order` + `erp_po_extensions` (new) |
| Goods receipt | - | - | L (bill match) | - | **O** | - | `erp_goods_receipts` (new) |
| Supplier bill | - | - | **O** | - | R (three-way match) | - | `fin_docs` kind `bill` |
| Warehouse, location, bin | - | - | - | - | **O** | - | `erp_warehouses`, `erp_locations` (new) |
| Stock (on hand, lots, serials) | - | - | R (valuation) | - | **O** | - | `erp_stock_moves` (ledger), `erp_stock_balances` (derived) |
| Inventory valuation journal | - | - | **O** | - | L (source) | - | `fin_journals` with `origin = 'erp_inventory'` (new column) |
| Production order (work order) | - | - | L (WIP journal) | L (tasks) | **O** | - | `erp_work_orders` (new) |
| Quality inspection, NCR, CAPA | - | - | - | L (actions as tasks) | **O** | - | `erp_inspections`, `erp_ncrs`, `erp_capas` (new) |
| Asset (physical) | - | - | X (fixed asset, depreciation: Finance Stage 3) | - | **O** | - | `erp_assets` (new); Finance's fixed asset register links to it |
| Maintenance plan and order | - | - | - | L | **O** | - | `erp_maintenance_plans`, `erp_maintenance_orders` (new) |
| Shipment, carrier | - | L (history) | - | - | **O** | - | `erp_shipments`, `erp_carriers` (new) |
| Project, task, assignment | - | L | L (tracking project for costs) | **O** | L | - | `boards`, `items`, `task_*`, `co_project_links` |
| Project cost and budget | - | - | **O** (posted figures) | X (budget) | R | - | `fin_journal_lines` with tracking project; `co_project_links.budget` |
| Ledger, accounts, tax codes, BAS | - | - | **O** | - | R | - | `fin_journals`, `fin_accounts`, `fin_tax_codes` |
| Document (file) | O (store) | X | X | X | X | - (files stay on the engineer's computer; exports are short-lived links) | Today each tool keeps its own file table (`attachments`, `crm_files`, `fin_files`); ERP adds `erp_documents`; one shared file service later (section 4.4) |
| Approval request | - | - | O (Finance documents) | - | O (ERP records) | - | Finance status columns today; `erp_approvals` (new) for ERP records |
| Audit record | O (company) | O | O | O | O | O | `co_audit`, `crm_audit_log`, `fin_audit_log`, `audit_log`/`audit_events`, `erp_audit_log` (new); an enterprise view reads them all |

## 4.3 Conflicts resolved

| Overlap found | Decision | Why |
| --- | --- | --- |
| CRM has a product catalogue (`crm_products`) used on deals | ERP's product master becomes the master. When a CRM organisation belongs to a company with ERP, its products are linked once to ERP products (`crm_products.erp_product_id`, additive), new products are made in ERP, and the CRM catalogue shows them. Existing CRM products are never deleted. | One product list, no drift in prices and codes |
| Finance has purchase orders (`fin_docs` kind `purchase_order`) and converts them to bills | Keep Finance's purchase order as the one PO document (number, supplier, lines, approval, PDF, convert to bill). ERP adds what procurement needs in `erp_po_extensions` (site, warehouse, requisition, expected date, receiving status) and a `product_id` on `fin_doc_lines`. | No second PO table; the bill conversion and approvals already work |
| Suppliers exist only as Finance contacts | Finance contact stays the supplier record; ERP adds `erp_supplier_profiles` keyed by `fin_contacts.id` | Payables, bills and remittance stay in one place |
| Customers exist in the CRM and in Finance | Already resolved by `co_customer_links`: CRM company is the relationship, Finance contact is the billing record, linked once | Built in kevinjogin/bizomat-site#41 |
| Quotes could belong to CRM or Finance | Finance owns quotation documents (built in Stage 1: priced, taxed, numbered, versioned, accepted online); the CRM deal links to them | The quote converts into invoices, which Finance owns |
| Fixed assets (Finance Stage 3) and physical assets (ERP) | ERP owns the physical asset and its maintenance; Finance owns cost, depreciation and disposal; one link `fin_fixed_assets.erp_asset_id` when built | Accounting stays in the ledger |
| Inventory value | ERP owns quantities and costs per move; Finance owns the journals; ERP posts through Finance's journal service, never by writing journal rows itself | Ledger triggers, lock dates and audit keep applying |

## 4.4 Shared services owned by BIZOMAT Core

- **Identity**: users, sessions, API tokens, the BIZOMAT sign-in provider for other apps (`src/worker/company/id-provider.ts`).
- **Organisation**: companies, legal entities (new), sites (new), departments, memberships, tool roles, module access (new).
- **Numbering**: per company and record kind (`erp_counters`, same pattern as `fin_counters`).
- **Notifications**: today per tool (`notifications`, `crm_notifications`, `fin_notifications`); My Work reads all of them.
- **Email outbox**: shared already (`email_outbox`).
- **Files**: one storage (R2 in the Worker, the volume on Node) already shared; a common document index (`co_documents`, later) can point at each tool's file rows without moving files.
- **Audit**: each tool writes its own log; Core provides the enterprise audit view and retention rules.
