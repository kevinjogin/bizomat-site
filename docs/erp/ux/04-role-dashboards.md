# BIZOMAT ERP: role-based dashboard designs

Status: design for review. The prototype implements every layout below with demonstration data.

## 1. Grid and widget sizes

- A 12-column grid on desktop (gap 16 px), 6 columns on tablets, 1 column on phones.
- Widget sizes: **S** 3 columns (a figure), **M** 6 columns (a chart or a short list), **L** 9 columns, **F** full
  width (a table). Heights follow content within limits (a list shows 5 rows and "View all").
- Row 1 is always the role's four key figures (S each); the rest is the role's charts and lists.

```
Desktop (12 columns)
+--------+--------+--------+--------+
|  KPI S |  KPI S |  KPI S |  KPI S |
+--------+--------+--------+--------+
|   Chart M       |   List M        |
+-----------------+-----------------+
|   Table F (attention list)        |
+-----------------------------------+
```

## 2. Widget catalogue

| Widget | Kinds | Interaction |
| --- | --- | --- |
| Key figure | value, comparison with the previous period (up or down, with words, not colour alone), sparkline | Click: the list behind it |
| Line chart | trend over time (12 months, 13 weeks) | Hover or focus: point values; click a point: that period's list |
| Bar chart | by category (stage, supplier, work centre, cause) | Click a bar: the filtered list |
| Donut | share of a whole, at most five parts plus "Other" | Click: the filtered list |
| Record list | top 5 rows with identifier, title, status, date | Click: the record; "View all": the list |
| Attention list | delayed, overdue, failed, waiting: rows with the reason | Primary action on the row (approve, chase, open) |
| Approvals | items waiting for me | Approve or Return in place |
| Upcoming | tasks and deadlines this week | Complete in place |
| Alerts | stock low, inspection failed, invoice overdue | Open the record |
| Text note | a pinned note for the team (administrator) | Edit |

## 3. Layouts per role

Each layout: key figures (row 1), then charts and lists. "→" names the drill-down target.

### CEO / Business owner: "Company performance"
- Figures: Revenue this month → invoices this month; Gross margin → margin report; Cash at bank → Finance banking;
  Orders late → delayed sales orders.
- Charts: Revenue against target (line, 12 months) → month's invoices; Order intake by month (bar) → sales orders.
- Lists: Delayed orders (attention: SO-1048 "promised 2 Dec, work order WO-1042 late") → sales order; Approvals
  waiting; Top customers this year → customer.

### Executive manager: "Operations overview"
- Figures: On-time delivery (13 weeks), Open sales orders, Production utilisation, Open nonconformances.
- Charts: Throughput by week (bar); Late orders by cause (bar).
- Lists: Delayed orders; Escalations (NCRs over 7 days, POs late over 5 days).

### Sales manager: "Sales"
- Figures: Pipeline value → CRM deals; Win rate (90 days); Quotes awaiting an answer → Finance quotes; Orders this
  month → sales orders.
- Charts: Pipeline by stage (bar) → deals in stage; Won by month (line).
- Lists: Quotes expiring in 7 days; Follow-ups due (CRM activities).

### Finance manager: "Finance"
- Figures: Cash → banking; Receivables (overdue in red with the word "overdue") → aged receivables; Payables due in
  14 days → bills; GST payable this period → GST worksheet.
- Charts: Cash forecast 13 weeks (line).
- Lists: Overdue invoices; Bills due; Approvals waiting (bills, claims).

### Accountant: "Accounting"
- Figures: Statement lines to match → reconciliation; Journals this month → journals; Draft documents; Period locked
  to (date).
- Charts: Receivables ageing (bar).
- Lists: Statement lines to match; Draft invoices and bills.

### Engineer: "Engineering"
- Figures: Open engineering changes; BOMs in review; Drawings waiting for CAD; My tasks due.
- Charts: Changes by status (bar).
- Lists: My engineering tasks; Recent CAD Automation jobs (status) → CAD Automation.

### Procurement manager: "Purchasing"
- Figures: Open purchase orders; Late deliveries; Spend this month; Requisitions to approve.
- Charts: Spend by supplier (bar, top 5 plus other).
- Lists: Requisitions to approve (approve in place); POs awaiting receipt (PO-0388).

### Production manager: "Production"
- Figures: Work orders in progress; Late work orders; Yield (first pass); Capacity load this week.
- Charts: Load by work centre (bar against capacity line).
- Lists: Delayed work orders (WO-1042 "operation 30 waiting for material") → work order; Material shortages.

### Warehouse manager: "Warehouse"
- Figures: Receipts today; Picks waiting; Stock value → valuation report; Counts due.
- Charts: Movements by day (bar: in and out).
- Lists: Goods received to put away (GR-0215); Low stock.

### Quality manager: "Quality"
- Figures: Inspections due today; Open nonconformances; First-pass yield; Corrective actions overdue.
- Charts: Nonconformances by cause (Pareto bar).
- Lists: Inspections today (INS-0533); Open NCRs.

### Project manager: "Projects"
- Figures: Active projects; Tasks overdue; Budget used (Finance figures via the company's project links); Milestones
  this week.
- Charts: Burn-down of the main project (line).
- Lists: Overdue tasks; Milestones this week.

### Administrator: "Administration"
- Figures: People; Pending invitations; Modules switched on; Failed sign-ins (7 days).
- Charts: Active people by week (line).
- Lists: Invitations waiting; Access requests.

## 4. Personalisation rules

- A personal layout is saved per person and role; "Restore default" returns to the role layout.
- A widget that needs a right the person lacks is not offered in the catalogue.
- Administrators can change a role's default layout for the company (later stage; the prototype shows the control
  disabled with a note).
