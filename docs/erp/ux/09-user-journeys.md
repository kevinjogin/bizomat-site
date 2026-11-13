# BIZOMAT ERP: user journeys

Status: design for review. The ten scenarios of `02-information-architecture.md` (section 8), walked by clicking in
the prototype (`08-prototype-guide.md`). Each journey starts on Home with the person already in their role (switch
the role on Home or in the account menu, "View as role"); the role switch is not counted. A click is one press of a
link, button, tab or menu choice; typing and keys are listed separately. Every journey was run in a headless browser
with no console errors.

The same journeys are in the prototype under Help, **Guided journeys**: each step there is a link that opens the
screen and outlines the row, tab or widget to look at. On a phone the panel shrinks to one line after each step, with
Next and Steps buttons.

## Summary

| # | Scenario | Role | Clicks | Also |
| --- | --- | --- | --- | --- |
| 1 | CEO finds delayed orders | CEO / Business owner | 1 | |
| 2 | Sales manager reviews a customer's quotation | Sales manager | 2 | `/`, type "Harbour", Enter (4 clicks with the mouse only) |
| 3 | Accountant checks an invoice's payment status | Accountant | 3 | +1 to record a payment |
| 4 | Engineer reviews a BOM revision | Engineer | 6 | 5 without the compare |
| 5 | Procurement manager finds a pending purchase order | Procurement manager | 6 | an optional comment |
| 6 | Warehouse operator reviews goods received | Warehouse manager | 3 | |
| 7 | Production manager finds a delayed work order | Production manager | 2 | |
| 8 | Quality manager reviews an inspection | Quality manager | 4 | |
| 9 | Employee completes a task from My Work | any | 3 | Undo in the toast |
| 10 | Executive generates a performance report | Executive manager | 5 | +1 for the optional drill-down on a month |

Opening a sidebar section counts as one click; when the person is already in that section it is open and the click
is not needed.

## 1. CEO finds delayed orders

Path: Home (CEO) > "Delayed orders" widget > sales order SO-1048.

| Step | Click | Result |
| --- | --- | --- |
| 1 | On Home, in the "Delayed orders" widget, **SO-1048** | Sales order SO-1048 for Harbour Builders, status Late. A red note says why: work order WO-1042 failed its weld inspection (INS-0533, NCR-0121) and waits for plate on PO-0388. Related records link to each. |

Demonstrates: a role dashboard (four key figures, revenue against target, order intake, delayed orders, approvals,
top customers); a list widget that drills down to its record; "Orders late 3" opens the filtered list; the record
pattern with a delay reason and related records across modules.

## 2. Sales manager reviews a customer's quotation

Path: Search "Harbour" > customer > Quotes tab > QU-0107.

| Step | Action | Result |
| --- | --- | --- |
| 1 | Press `/`, type **Harbour** | Results grouped by type, each with its module badge and status: Customers (Harbour Builders, CRM), Projects, Contacts, Opportunities, Quotes (QU-0107, Finance), Sales orders, Invoices. The top result is marked Enter. |
| 2 | Press Enter | Customer Harbour Builders (a Working CRM screen, "Open in CRM"). |
| 3 | Click the **Quotes** tab | The customer's quotes; QU-0107, Sent, expires 20 Nov 2026. |
| 4 | Click **QU-0107** | Quote for Harbour Builders: lines (four conveyor drive frames revision C, tensioners, idler sets), totals with GST, actions Mark as accepted and Send reminder. |

Clicks: 2 (plus `/`, typing and Enter). With the mouse only: click the search box, type, click the result, the tab,
the quote: 4 clicks.

Demonstrates: global search with `/`, grouping, module badges, Enter on the top result, recent searches; a Working CRM
record and a Working Finance record inside one shell; a record's own tab (Quotes) next to the standard tabs.

## 3. Accountant checks an invoice's payment status

Path: Finance > Invoices > INV-2291 > Payments panel.

| Step | Click | Result |
| --- | --- | --- |
| 1 | Sidebar **Finance** | The Finance section opens (the other sections close). Each page shows W: these are Working Finance screens. |
| 2 | **Invoices** | The invoice list, newest first, with saved views All, Unpaid and Overdue. |
| 3 | **INV-2291** | Invoice to Harbour Builders. The Payments panel beside the summary: paid $20,000.00, balance $28,620.00, due 27 Nov 2026, 41% paid, the payment received on 5 Nov (bank transfer HB-PAY-5521), the last reminder. |
| (4) | **Payments** tab or **Record payment** | The same panel with a form to record a payment; the balance and status update, with Undo. Finance records payments; it never moves money or connects to a bank. |

Demonstrates: a Working page with "This page opens the working Finance screen" and "Open in Finance"; the list
pattern; a record side panel; a form with validation (amount greater than zero and not more than the balance).

## 4. Engineer reviews a BOM revision

Path: Products & Engineering > Products > PRD-1001 > BOM tab > revision C.

| Step | Click | Result |
| --- | --- | --- |
| 1 | Sidebar **Products & Engineering** | The section opens; pages are P (planned). |
| 2 | **Products** | The product master, with saved views Finished goods and Materials. |
| 3 | **PRD-1001** | Conveyor drive frame 1200, revision C, with tabs BOM, Variants, Routing, Revisions, Drawings. |
| 4 | **BOM** tab | The released revision B as a tree (frame weldment with its plate, sections and wire; brackets; tensioner; bolts; bearings; paint). |
| 5 | **Rev C** | Revision C, In review, with a note: work orders still build to B until ECO-0046 is approved. |
| 6 | **Compare with B** | The changes from B to C: plate 2 to 3 sheets, bolts M16 × 50 removed and M16 × 60 added, enamel removed and two-pack epoxy added. |

Demonstrates: a planned module; a tree with expand and collapse (also with Arrow Left and Right); revisions as a
segmented control kept in the address (`?rev=C`); compare; links to the engineering change and to CAD Automation for
drawings.

## 5. Procurement manager finds a pending purchase order

Path: Procurement > Purchase orders > saved view "Awaiting approval" > PO-0388.

| Step | Click | Result |
| --- | --- | --- |
| 1 | Sidebar **Procurement** | The section opens. |
| 2 | **Purchase orders** | 16 purchase orders (W for the Finance document, P for ERP lines and receiving). |
| 3 | Saved view **Awaiting approval** | Three rows: PO-0393, PO-0391, PO-0388. The view is a filter condition the person can open, change and save as a new view. |
| 4 | **PO-0388** | Purchase order to Coastline Steel Supply, $18,862.80, with the approval steps: Submitted (Sara Haddad), Budget check (automatic), Approval over $10,000 (Daniel Okafor, waiting), Send to supplier. |
| 5 | **Approve** | A dialog with an optional comment (Return requires one). |
| 6 | **Approve** in the dialog | Status Approved; the step shows who and when; "Send to supplier" becomes the next step; Undo in the toast. |

Demonstrates: saved views; the workflow and approval pattern (steps with who and when, Approve or Return with a
comment); a mixed W/P page.

## 6. Warehouse operator reviews goods received

Path: Inventory & Warehouse > Goods receipts > GR-0215.

| Step | Click | Result |
| --- | --- | --- |
| 1 | Sidebar **Inventory & Warehouse** | The section opens (the warehouse role also sees Purchase orders for receiving, and Supply Chain). |
| 2 | **Goods receipts** | Receipts, newest first; GR-0215 Awaiting put-away. |
| 3 | **GR-0215** | Goods received from Coastline Steel Supply against PO-0385: 38 of 40 sheets of plate (two short), 60 lengths of RHS received and 58 accepted (two bent, in quarantine). Related: the receiving inspection, the nonconformance, the mill certificate and the return to the supplier. Action: Confirm put-away. |

Demonstrates: role-based sections; a planned module; received and accepted quantities with notes; documents
(packing slip scan, photos) with a preview.

## 7. Production manager finds a delayed work order

Path: Home (Production) > "Delayed work orders" > WO-1042.

| Step | Click | Result |
| --- | --- | --- |
| 1 | On the Production dashboard, in "Delayed work orders", **WO-1042** | Work order for two conveyor drive frames for SO-1048, Delayed, with the reason (weld undercut at INS-0533, plate short until PO-0388) and the new expected date. |
| 2 | **Operations** tab | Operations 10 to 60 with work centre, operator, planned and actual hours; operation 30 Weld frame is in Rework with actual hours over plan. Materials tab: plate short by two sheets. |

Demonstrates: the production dashboard (load by work centre with the welding bay over capacity, shortages); a
record's own tabs; links to the shop floor screen and production planning.

## 8. Quality manager reviews an inspection

Path: Quality > Inspections > INS-0533.

| Step | Click | Result |
| --- | --- | --- |
| 1 | Sidebar **Quality** | The section opens. |
| 2 | **Inspections** | Inspections, with saved views Today and open, and Failed. |
| 3 | **INS-0533** | In-process inspection of WO-1042, Awaiting review, action Mark as reviewed. |
| 4 | **Checklist** tab | Eight checks with specification, measured value and Pass, Fail or N/A; check 2 (undercut 1.2 mm against 0.5 mm) is marked Fail and linked to NCR-0121. Save results, Add photo. |

Demonstrates: a checklist built for tablets and phones (large segmented controls); links between inspection,
nonconformance, corrective action and work order.

## 9. Employee completes a task from My Work

Path: My Work > Due today > Complete.

| Step | Click | Result |
| --- | --- | --- |
| 1 | Sidebar **My Work** (count 18) | All items grouped by due date: Overdue, Today, This week, Later, No due date. |
| 2 | **Due today** tab | Six items due today from Project Management, the CRM and ERP. |
| 3 | **Complete** on "Confirm weld procedure for WO-1042 rework" | The item shows Done and moves to "Finished in this visit"; the counts drop at once; the toast offers Undo. |

Demonstrates: the My Work model (type icon, title, module badge, due date, status, who is waiting, one primary
action: Complete, Approve or Return, Review, Reply, Remind) and "Open in <module>"; grouping by due date, module or
type.

## 10. Executive generates a performance report

Path: Reports & Analytics > Company performance > filters > Export.

| Step | Click | Result |
| --- | --- | --- |
| 1 | Sidebar **Reports & Analytics** | The section opens. |
| 2 | **Enterprise dashboards** | Report cards: Company performance (C), Production output (P), Sales by month (W), Revenue and margin (W). |
| 3 | **Company performance** | Filters (from, to, company, department, site, presets), key figures, revenue by month against target, revenue by customer, detailed records. |
| 4 | Department **Sales** | Everything recalculates for the Sales department. |
| (5) | A month's bar, for example **Oct 26** | The table shows only that month's invoices; each row opens its invoice (chart to table to record). |
| 6 | **Export CSV** | Downloads `company-performance.csv` with the rows in the table. Save report keeps the filters on this computer; Saved and scheduled reports lists them. |

Demonstrates: the report pattern (date range and company, department and site filters, charts, detailed table,
drill-down, export, saved reports); the "Company performance" report sits under Enterprise dashboards, one click
deeper than the scenario's short path.
