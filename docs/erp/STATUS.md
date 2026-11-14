# BIZOMAT ERP: status by release

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026). A module is Working only when
its acceptance tests pass; nothing is labelled live to look further along than it is. The public statuses are
`src/data/erp-capabilities.ts` and `src/config/systems.ts`; this file is the engineering view behind them.

Updated 14 Nov 2026, with ERP Release 1 built on the branch `erp-release-1` (not merged, not deployed: production does
not have it until it is reviewed, merged and deployed).

## Working

Built, tested and live at `bizomat.ai/erp` unless marked "Release 1 (not deployed)".

| Area | What | Evidence |
| --- | --- | --- |
| ERP workspace | Module rail, company switcher, dashboard by company, My Work, Reports hub, Administration, own company per person, example company, platform console | `docs/system/README.md`, `apps/work/test/system.test.ts`, `example-company.test.ts` |
| Sales and CRM, Finance and Accounting, Projects and Tasks, Company accounts | Each tool inside the ERP, with the links between them | `docs/crm/`, `docs/finance/`, `docs/company/` and their tests |
| Maintenance, Stage M1 | Asset register and hierarchy, requests with approval, work orders, labour timer, files | `docs/maintenance/README.md`, `apps/work/test/maintenance.test.ts` |
| CAD Automation set-up | The set-up steps in Products and Engineering | `apps/cad/CLAUDE.md` |
| **Release 1 (not deployed)**: ERP foundations | Per-company numbering, the ERP history with before and after values, ERP roles (several per person) with the capability matrix, segregation of duties with the recorded one-person exception, ERP roles screen | `docs/erp/release-1.md`; `apps/work/test/erp.test.ts` (roles, numbering, isolation) |
| **Release 1 (not deployed)**: Product master | Products with every master field, variants, lifecycle and effective dates, images and attachments, product suppliers, list with search, filters, sort, paging and CSV | Scenario A; lists and CSV tests |
| **Release 1 (not deployed)**: Revisions and change control | Revisions (draft, in a change order, released, superseded), change requests, change orders with approval and release by someone other than the drafter, release in one transaction, a concurrent release refused | Scenario A; segregation and concurrent-release tests (workerd and Node) |
| **Release 1 (not deployed)**: Bills of materials | Multi-level lines, loops refused, structure, explosion with CSV, where-used, revision comparison, cost roll-up with missing costs and currencies flagged | Scenario A; roll-up, loop, effective-date tests |
| **Release 1 (not deployed)**: Engineering documents | Versions as files or CAD references, approval, DXF and STEP checked and downloaded only | Documents test; Node STEP test |
| **Release 1 (not deployed)**: Supplier master | Suppliers with approval, hold and block, ABN format check, contacts, documents, products supplied, link to Finance's supplier (refused without a Finance role) | Supplier lifecycle and Finance link tests |
| **Release 1 (not deployed)**: Reports | Product catalogue, lifecycle, bill of materials cost, where-used, revisions and changes, supplier list; drill-down and CSV | Reports and CSV test |
| **Release 1 (not deployed)**: Example company | A kit with a released two-level bill of materials, a draft change order, a CAD reference, two suppliers (one approved) | Example company test |

## In development

| What | Where it stands |
| --- | --- |
| CAD computers and jobs in the ERP | The ERP side is built; CAD Automation does not report yet. |
| Sign in with BIZOMAT for CAD Automation | Built in both repositories; not switched on. |

## Blocked

| What | Blocked by |
| --- | --- |
| Drawings generated from an ERP product | Sign in with BIZOMAT in CAD Automation (above). Engineering documents can reference a CAD file today. |
| Supplier performance figures | Purchase orders and receipts (Release 2). The supplier page says "Measured from purchase orders (Release 2)". |
| Component availability in bills of materials | Inventory (Release 2). The screens say so. |

## Planned

| Release | What |
| --- | --- |
| Release 2 | Purchase requisitions with approval, requests for quotation, purchase orders in the ERP, receiving and three-way matching, supplier performance; inventory and warehouse (stock, locations, movements, counts) |
| Release 3 | Manufacturing: routings and work centres, production orders, a planning board, shop-floor reporting |
| Release 4 | Quality (inspections, nonconformances, corrective actions) and the later Maintenance stages (M2 to M4) |
| Release 5 | Supply chain (sales orders, deliveries, shipments, returns) and the cross-module analytics and AI listed in `docs/erp/architecture/15-erp-roadmap-2026.md` |

Also planned, not in a numbered release yet: segregation-of-duties rules beyond change orders and suppliers, amount
limits on approvals, routings in the cost roll-up, sharing the CRM's product catalogue with the product master.

## Decisions waiting for the owner

- Merge and deploy Release 1 (branch `erp-release-1`, one additive migration; the deploy's pre-migration backup covers
  it).
- `src/data/erp-capabilities.ts` keeps "Product classification", "Lifecycle status" and "Product costing" as Planned, as
  the brief asked (only the named features changed), although the product master now records type, category,
  subcategory, family and lifecycle, and bills of materials roll up material cost. Changing them to Live is a one-line
  change each, if wanted.
- Whether a registered company of one person should keep the recorded segregation-of-duties exception (today: yes, as
  for own and example companies).
