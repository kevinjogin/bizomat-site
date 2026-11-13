# BIZOMAT ERP: reusable screen designs

Status: design for review. Seven patterns every module uses. The prototype implements each one; the existing apps
already use most of the pieces (`.data-table`, `.card`, `PageHeader`, `Modal`, `StatusBadge`).

## 1. Dashboard

See `04-role-dashboards.md`. Anatomy: page header (title, role selector for people with several roles, Customise),
the 12-column widget grid, the widget catalogue drawer in customise mode.

## 2. Search and list view

```
+--------------------------------------------------------------------------------------------------+
| Procurement / Purchase orders                                              [Export] [+ New PO]  |
| Views: [All] [Awaiting approval*] [Open] [Late] [+ Save view]                                    |
| [Search number, supplier, reference ]  [+ Filter] Supplier is Coastline Steel x   [Columns] [Sort] |
+---+---------+------------------------+------------+------------+-----------+---------+-----------+
| o | Number  | Supplier               | Site       | Expected   | Status    |  Total  |  ...      |
| o | PO-0388 | Coastline Steel Supply | Brisbane   | 18 Nov     | Awaiting  | $12,480 | [...]     |
+---+---------+------------------------+------------+------------+-----------+---------+-----------+
| 2 selected: [Approve] [Export] [Assign buyer]                         Rows 1-25 of 61  < 1 2 3 > |
+--------------------------------------------------------------------------------------------------+
```

| Element | Behaviour |
| --- | --- |
| Saved views | Tabs; the person's own and the company's; the current one marked; "Save view" stores filters, sort and columns |
| Search | Searches the list's key fields; debounced; clear button |
| Filters | Builder: field, operator (is, is not, contains, before, after, between, is empty), value; chips show active filters; "Clear all" |
| Sort | Click a column header (asc, desc, none); shown with an arrow and `aria-sort` |
| Columns | Chooser: show, hide, reorder; saved in the view |
| Bulk selection | Checkbox per row and "select page"; a bulk bar shows the count and the actions valid for every selected row |
| Export | CSV of the current view (respects filters, needs the export right, audited) |
| Row actions | A menu at the row's end with the actions the person may take in the row's state |
| Pagination | 25, 50 or 100 rows; "Rows 1-25 of 61"; keyboard reachable |
| Phones | Rows become cards with the identifier, title, status and one figure; filters in a sheet |

## 3. Record details

```
+--------------------------------------------------------------------------------------------------+
| Manufacturing / Work orders / WO-1042                                   [* Pin]                  |
| WO-1042  Switchboard enclosure SB-400 x 4    [In progress] [Late]     [Report operation] [...]   |
| Site Brisbane · Due 28 Nov · Sales order SO-1048 · Revision C                                    |
+--------------------------------------------------------------------------------------------------+
| [Overview] [Details] [Related 4] [Documents 2] [Activity] [Audit]                                |
| Overview: progress by operation, materials (reserved, issued, short), key dates, linked tasks    |
+--------------------------------------------------------------------------------------------------+
```

| Element | Behaviour |
| --- | --- |
| Header | Breadcrumb, identifier, title, status badges (state plus attention, e.g. Late), pin, primary action, more actions |
| Key facts | One line of the facts people look for first, each a link where it is a record |
| Overview | The record's purpose at a glance: progress, figures, next step |
| Details | All fields, grouped as in the form, read-only until Edit |
| Related | Records in other modules with their state (sales order, invoice, tasks, inspections), with "Open in <module>" |
| Documents | Files with a preview panel (PDF, images); upload where allowed |
| Activity | Timeline of changes, comments and events from every module, newest first |
| Audit | Who changed what and when, with before and after values (rights permitting) |

## 4. Create and edit forms

| Rule | Detail |
| --- | --- |
| Grouping | Sections with a heading and one sentence of purpose ("Supplier and delivery") |
| Labels | Above the field; required fields marked "Required", not by colour |
| Descriptions | A short line under a field where the meaning is not obvious ("Lead time in working days") |
| Defaults | From the context (site, warehouse, today, the supplier's terms) and shown as normal values |
| Validation | On leaving a field and on save; messages under the field in plain words; a summary at the top on save |
| Actions | Save draft, Save and continue (to the next step, or a new one), Cancel |
| Unsaved changes | Leaving with changes asks "Leave without saving?" (also on browser back) |
| Long forms | A step bar or a section index; sticky actions at the bottom |
| Lines | An editable table (as Finance's line editor) with add, remove, reorder and totals |

## 5. Workflow and approval screens

- A step bar: Draft → Submitted → Approved (or Returned) → Released/Posted, with who and when at each step.
- The approver sees the record summary, the rule that sent it to them ("over $10,000"), the requester's note, and
  Approve or Return with a required comment when returning.
- Requesters see where their request is and can remind or withdraw.
- Approvals also appear in My Work and on the role dashboards.

## 6. Reporting

| Element | Behaviour |
| --- | --- |
| Filters | Date range with presets (this month, last quarter, financial year), company, site, department; applied as chips |
| Summary | Key figures of the report at the top |
| Charts | One or two charts; clicking a bar or point filters the table (drill-down) |
| Table | Detailed rows with subtotals; rows link to records |
| Export | CSV and PDF (the PDF through the same document engine as Finance) |
| Saved reports | Save the filters with a name; schedule monthly or quarterly into Documents (Finance's scheduler pattern) |

## 7. Administration

- People: list with company role, module levels and sites; invite; change role template; remove.
- Role templates: the persona templates with a module-by-level matrix (radio buttons per cell).
- Module access: switches per module for the company (a module switched off is hidden for everyone).
- Sites and branches: list and form (code, name, kind, address, time zone).
- Approval rules: per record type, conditions and steps.
- Audit: the enterprise audit view with filters by person, module, action and date.
