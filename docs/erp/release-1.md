# BIZOMAT ERP, Release 1: Products and Engineering, and the supplier master

Owner's brief "BIZOMAT ERP — full enterprise functionality implementation" (14 Nov 2026), Release 1: sections 2
(foundations), 3 (product and engineering management), the supplier part of 4 (procurement), 11 (roles and
segregation of duties), 12 (audit), 14 (reports), 15 (Release 1) and 16 (Scenario A). Status by release:
`docs/erp/STATUS.md`.

Built inside the existing Project Management app (`apps/work`): the same Worker and Node server, database, file store,
accounts and session. No new app, Machine, database or sign-in. One additive migration.

| Part | Where |
| --- | --- |
| Migration (additive: 15 new `erp_*` tables and their indexes, nothing else changed) | `apps/work/migrations/0020_erp_engineering_procurement.sql` |
| Server, under `/api/erp` (signed in) | `apps/work/src/worker/erp/` |
| Screens, inside the ERP at `/erp/c/<company>/...` | `apps/work/src/client/system/erp/`, `apps/work/src/client/styles/erp.css` |
| Example company data | `apps/work/src/worker/system/example.ts` |
| Tests | `apps/work/test/erp.test.ts` (workerd, 13 tests), `apps/work/test-node/erp.test.ts` (Node, 3 tests) |

## Foundations

- **Companies** are resolved exactly as Maintenance resolves them (`erp/access.ts`): a registered company
  (`co_companies` and `co_members`), a person's own company (`sys_companies`, its owner only) or their example company
  (`sys_demo`, its owner only). People who only share a tool with a company (guests) and everyone outside it get 404.
  Every query filters on `company_id`; rows link through `(company_id, id)` keys, so the database itself refuses a link
  between two companies (a test inserts one directly and it fails).
- **Numbering** (`erp_counters`, `util.ts` `nextNumber`): PRD-00001, ECR-0001, ECO-0001, SUP-0001, DOC-0001. One upsert
  statement per number, so simultaneous creates get different numbers; the counter first moves past any number of the
  same form typed by hand. A number may also be typed (letters, digits and `. _ / -`, unique per company, any case).
- **History** (`erp_events`): every change, with who, when, a summary and the changed fields before and after. Never
  file contents. Shown on each record; the whole company's history is `GET /c/:company/events` (ERP administrators and
  executives).
- **ERP roles** (`erp_user_roles`, several per person; the capability matrix is `CAPABILITIES` in `access.ts`):

  | Role | May |
  | --- | --- |
  | ERP administrator | everything, including ERP roles |
  | Executive | read everything, the whole history |
  | Engineer | products, variants, bills of materials, revisions, change requests, draft change orders, documents |
  | Engineering approver | review change requests; approve and release change orders; approve documents; an engineer's work |
  | Buyer | suppliers, contacts, product supplier prices |
  | Procurement manager | approve, hold and block suppliers; a buyer's work |
  | Viewer | read products, engineering records and suppliers |

  A registered company's owner and administrators are always ERP administrators; other members are viewers until an
  ERP administrator gives them roles (Administration, ERP roles). In a person's own or example company the owner is
  the ERP administrator.
- **Segregation of duties** (`segregation` in `access.ts`): nobody approves or releases a change order they drafted, or
  approves a supplier they created (403). The one exception is a company of one person (own and example companies, a
  registered company with one member): the approval goes through and is recorded on the record (`sod_exception`), in
  its history and in the revisions and changes report.

## Products

- **Product master** (`products.ts`): number, SKU, name, description, category, subcategory, family, type (raw
  material, component, manufactured part, assembly, subassembly, finished product, purchased item, consumable,
  service), unit, manufacturer, standard and current cost, price, currency, weight and dimensions with units, material,
  free properties, lifecycle (draft, active, phased out, obsolete) and effective dates. Images and attachments through
  the file store, checked by `validateUpload` (`files.ts`). List with search, filters, sort, paging and CSV. Archive
  is refused while a product is used in a bill of materials in use.
- **Variants:** a variant is a product of its own (`variant_of`) with the attributes that set it apart (size, model,
  configuration, material, finish, options). A variant cannot have variants.
- **Product suppliers** (`erp_product_suppliers`): supplier part number, price, currency, lead time, minimum order and
  one preferred supplier per product. A blocked supplier cannot be added.

## Revisions, change requests and change orders

- A new product starts with **revision A as a draft**. A product has at most one open revision (draft or in a change
  order) and at most one released revision (a partial unique index enforces it).
- A **bill of materials belongs to a revision.** It can change only while the revision is a draft, or in a change
  order that is still a draft. Submitted, approved, released and superseded revisions are locked (409).
- **Change requests** (ECR): submitted, under review, approved or rejected (a reason is required) by an engineering
  approver. An approved request becomes a change order with its products.
- **Change orders** (ECO): drafted with products; each gets its open draft revision, or a new revision with the lines
  of its released revision. Draft, submitted, approved, released or cancelled. An approver can return a submitted or
  approved order to draft (with a reason), which unlocks its revisions. Cancelling returns them to plain drafts.
- **Release** (`changes.ts`): one transaction sets the order released, supersedes each product's released revision
  (pointing at its successor) and releases the order's revisions. The first statement writes a one-time token on the
  order (`release_token`); every other statement, history lines included, runs only while that token is there. A
  second release at the same moment changes nothing and answers 409 (tested on workerd and on node:sqlite).

## Bills of materials

- **Lines:** component, quantity, unit, scrap allowance (%), reference designators, position, effective dates,
  optional, alternative group, notes.
- **Loops are refused** on the server, at any depth, through released and open revisions (400).
- **Structure** with expand and collapse (each component's released bill of materials underneath); **explosion** of
  every level with extended quantities (scrap included), effective "as of" a date, components without a released
  revision flagged, and CSV; **where-used** (direct parents and the top-level products through released structures);
  **comparison** of any two revisions (added, removed, changed lines and changed revision fields).
- **Cost roll-up:** quantity times (1 + scrap) at the component's rolled-up cost when it has a released bill of
  materials, else its standard cost. Optional lines and alternatives after the first of their group are not counted.
  Missing costs and other currencies are listed and left out, never guessed or converted.
- **Availability is not shown:** it needs Inventory (Release 2). The screens say so.

## Engineering documents

- `documents.ts`: a document (DOC-0001) per product and, optionally, one of its revisions; kind (drawing, 3D model,
  PDF, DXF, STEP, specification, image, other); a document revision label per version; draft, approved (by an
  engineering approver) or obsolete; every version kept.
- A version is an **uploaded file** or a **CAD reference**: the path, configuration and file name of a SOLIDWORKS file
  on the engineer's own computer. The server never has that file and never says it does.
- **DXF and STEP** are accepted only when their content starts the way the format requires (DXF section header or
  binary sentinel; STEP `ISO-10303-21;`), and are always served as `application/octet-stream` attachments. Anything
  else goes through `validateUpload` as every upload does.
- The document page links to CAD Automation. Nothing in Release 1 generates drawings.

## Suppliers (Procurement, partly live)

- `suppliers.ts`: number, legal and trading names, ABN, category, email, phone, website, postal and delivery addresses,
  payment terms, currency, delivery terms, lead time, notes; contacts with one primary; documents; the products each
  supplies.
- **ABN:** checked for its form and check digits (`abnValid`) and described as "Format checked", never "verified"; it
  is not looked up on the register. A change of legal name or ABN after approval sends the supplier back to pending.
- **Status:** pending, approved, on hold (from approved, with a reason), blocked (with a reason); approval by a
  procurement manager or ERP administrator who did not create the supplier.
- **Finance link, never a copy** (as `company/links.ts` does for customers): the Finance workspace is the company's own
  (a registered company's Finance, the example's, or for an own company a business workspace its owner owns that no
  registered company runs). Linking an existing Finance supplier needs a Finance role that sees contacts; creating one
  needs a Finance role that creates contacts, checked with Finance's own permissions. People without a Finance role are
  refused (403). One Finance supplier backs at most one ERP supplier. Unlinking keeps the Finance contact.
- **Performance** is "Measured from purchase orders (Release 2)": no figures are shown.

## Screens

- **Products and Engineering** (`/erp/c/<company>/products`; the rail and `/erp/products` open the company used last):
  tabs Products, Changes, Documents and CAD Automation (the existing set-up and computers). A product opens on
  Overview, Bill of materials (Structure, All levels, Cost roll-up), Revisions (with comparison), Where used,
  Documents, Suppliers and History.
- **Procurement** (`/erp/c/<company>/procurement`), opened from Operations, whose Procurement card reads "Partly live:
  suppliers".
- **Administration, ERP roles** (`/erp/c/<company>/erp-roles`): ERP administrators give roles; others see their own.
- **Reports** (`/erp/c/<company>/erp-reports/<report>`, linked from the Reports page): product catalogue, lifecycle,
  bill of materials cost, where-used, revisions and changes, supplier list. Each filters, links every row to its record
  and exports CSV.
- Desktop and phone (tables become cards), empty states, no inline styles (CSP), the ERP shell and design system.

## Example company

`makeExample` now adds, through the API, a shelf bracket kit with a variant, a two-level bill of materials released by
ECO-0001 (the one-person exception recorded), a change request, a draft ECO-0002 with its revision, a CAD reference,
and two suppliers (one approved, with a contact and preferred product prices). No ABNs: an invented number that passes
the check could belong to a real business. Removing the example erases its `erp_*` records and files. Example companies
made before Release 1 are not changed.

## Tests

`apps/work/test/erp.test.ts` (workerd):
- **Scenario A** end to end: product master, variants, a two-level bill of materials, a change request reviewed and
  approved, a change order drafted from it, locking on submit, segregation of duties, release, locked released
  revision, explosion, cost roll-up (8,918 cents, worked by hand), where-used, revision B through a second change
  order, comparison, supersession, history, CSV.
- Roll-up flags (missing costs, other currencies, alternatives), effective dates, archive rules, one open revision.
- A loop through released revisions refused; cancel and return-to-draft unlock revisions.
- Segregation of duties in a company of several; two simultaneous releases (exactly one succeeds, one history line);
  the recorded exception in a company of one.
- Documents: CAD reference, STEP accepted and downloaded as an attachment, a fake STEP and an `.exe` refused, DXF,
  approval, new version back to draft, obsolete.
- Supplier lifecycle with segregation of duties; ABN checksum (good, bad, duplicate); "Format checked" wording;
  performance placeholder; contacts; documents.
- Finance link: refused without a Finance role and for a viewer; created once (no duplicate); hidden from people without
  Finance access; existing contact linked; one contact per supplier; another company's Finance refused; unlink keeps
  the contact; a Finance viewer can link but not create.
- Isolation: another company, a guest, an outsider, an own company and the example company; the database refusing a
  cross-company line.
- Every role's allowed and refused actions; numbering under concurrency and past hand-typed numbers; lists, filters,
  sort, paging, all reports and every CSV.
- The example company's ERP records and their removal.

`apps/work/test-node/erp.test.ts` (Node, node:sqlite, real HTTP): migration 0020 only creates `erp_` tables and
indexes and leaves every earlier table's schema unchanged; a release with two simultaneous attempts; a STEP file stored
on disk and served back; a supplier approved; 404 for another person.

## Not in Release 1

Routings and work centres, purchase requisitions, requests for quotation, purchase orders in the ERP, receiving and
three-way matching, supplier performance figures, stock and availability, drawings generated from an ERP product, and
segregation-of-duties rules beyond change orders and suppliers. See `docs/erp/STATUS.md`.
