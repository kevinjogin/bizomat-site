# 11. Testing and migration strategy

Status: proposal for review.

## 11.1 Test layers (the ones the repository already runs, extended)

| Layer | Tool and location | What ERP adds | Runs in |
| --- | --- | --- | --- |
| Unit and API, Cloudflare runtime | Vitest with the Workers pool (`apps/work/test/*.test.ts`, migrations applied from `TEST_MIGRATIONS`) | One file per module: `erp-core.test.ts`, `erp-products.test.ts`, `erp-inventory.test.ts`, ... | CI job `work` |
| Same tests on Node | `vitest.node.config.ts` (node:sqlite, the production runtime) | Nothing to add: every test runs on both runtimes | CI job `work` |
| Browser | Playwright (`apps/work/e2e/*.spec.ts`) on the built Node server, desktop and phone projects | `erp-shell.spec.ts` (navigation, roles, My Work), one journey spec per stage | Locally and before release |
| Proxy and routing | `infrastructure/proxy/test/routes.test.mjs`, `tests/worker.test.ts` | `/erp` routed to work; no website page may take `/erp` | CI job `proxy and platform files`, `website` |
| Website | `npm run verify` (astro check, 1500+ tests, build) | ERP navigation item, product page if any | CI job `website` |
| Image and stack | Docker build and local compose smoke (`infrastructure/smoke/smoke.mjs`) | `/erp/api/health`, `/erp/login`, carry and 401 checks | CI job `image and local stack`, and live after deploy |
| Live | `smoke.mjs --mode live` and the page checks in CLAUDE.md | `/erp/` added to the list | After each deploy |

## 11.2 What every ERP stage must prove (acceptance tests)

1. **Isolation**: a member of company A gets 404 for every record of company B, through every route, search and
   export; references to another company's records are refused on write.
2. **Permissions**: each module level (none, view, contribute, approve, manage) allows exactly its actions; site scope
   hides other sites' records; the requester cannot approve their own request.
3. **Ownership**: ERP never writes CRM, Finance or Project Management tables directly (a test greps the `erp/`
   source for their table names outside the owners' services); documents created through owners carry the owner's
   numbering and audit.
4. **No duplicates**: creating a sales order twice from the same quote, receiving the same PO line twice, or linking a
   CRM product twice is refused or returns the existing record (idempotency keys tested).
5. **Ledger**: every journal ERP causes balances, respects the lock date, appears with its origin, and the trial
   balance stays balanced after a full journey (purchase, receive, produce, deliver, invoice, pay).
6. **Regression**: the existing suites pass unchanged (today 420 workerd, 540 Node, 1522 website tests), plus the
   existing browser specs for Project Management, the CRM and Finance.
7. **Reversibility**: the release can be rolled back to the previous image with the new tables in place (the old code
   never reads them).

### Example journey test (Stage 5 and 6)

```
given a company with CRM, Finance and ERP, a product PRD-1001 (standard cost $50.00) and a supplier
when a buyer raises REQ-0091 for 10, a manager approves it, and PO-0388 is created through Finance
and the warehouse receives 10 into BNE-A-01 (GR-0215)
then on hand is 10, a journal Dr Inventory 500.00 / Cr GRNI 500.00 is posted with origin erp_inventory
when an accepted quote QU-0107 for 4 becomes SO-1048, delivery DL-0311 ships 4, and it is invoiced
then on hand is 6, a journal Dr COGS 200.00 / Cr Inventory 200.00 is posted, INV-2291 is a draft in Finance
and the CRM company's timeline shows "Delivery DL-0311 for SO-1048 completed" without amounts
and the trial balance balances, and the quote cannot make a second sales order
```

## 11.3 Data migration

ERP starts with **no data migration of existing records**. Everything it needs either already exists (customers,
suppliers, quotes, invoices, purchase orders, projects) or is new.

| Item | Approach | Reversible |
| --- | --- | --- |
| Schema | Additive migrations only (`0016_erp_core.sql`, `0017_erp_products.sql`, ...): new `co_*` and `erp_*` tables, plus nullable columns on `crm_products`, `fin_doc_lines`, `fin_quote_lines`, `fin_credit_note_lines`, `fin_journals`. No table rebuild, no CHECK widened, no row rewritten. | Yes: the previous code ignores them |
| Applying | As today: the work server copies the database to `pre-migration-backups/` and applies pending migrations in one transaction at start; D1 in tests applies the same files | Restore the copy if ever needed |
| CRM products | A one-time, per-company, owner-started "Link the CRM's products" action: for each CRM product, find an ERP product with the same SKU or create one, then set `crm_products.erp_product_id`. Nothing is deleted or renamed in the CRM. | Clear the column |
| Item codes on Finance lines | Optional matching of `item_code` to product codes on future documents only; past posted documents are not changed | n/a |
| Suppliers | ERP supplier profiles are created when first needed, keyed by the Finance contact | Delete the profile |
| Opening stock | An "Opening stock" count per warehouse creates stock moves and one opening journal (Dr Inventory, Cr Opening balance equity), dated by the person, refused in a locked period | Reverse the journal and the moves |
| Spreadsheet imports | CSV import for products, BOMs, suppliers' part numbers and stock, with a preview and a dry run that reports counts only (the rule of the migration tooling: counts, never row content, in logs) | Delete the imported batch while nothing references it |

## 11.4 Migration of navigation (from separate apps to ERP)

| Step | What changes | Reversible |
| --- | --- | --- |
| Now | Standalone apps at `/tasks`, `/crm`, `/finance`, `/company`, `/cad` | - |
| Stage 1 | ERP added at `/erp` and in the website navigation; standalone apps unchanged | Remove the menu item |
| After all ERP stages are approved | The owner may choose to show only ERP in the website navigation; every standalone address keeps working (bookmarks, links in emails and PDFs) | Restore the menu items |
| Never | Removing the standalone routes or their data | - |
