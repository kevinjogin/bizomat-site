# BIZOMAT ERP: responsive layouts

Status: design for review. Desktop is the primary layout; tablets and phones get layouts of their own, not a squeezed
desktop. The prototype (`apps/work/src/client/erp-prototype/erp.css`, section "responsive") implements every rule
below; screenshots at 1440 × 900, 900 × 1100 and 390 × 844 are listed in `08-prototype-guide.md`.

## 1. Breakpoints

| Width | Name | What changes |
| --- | --- | --- |
| 1400 px and wider | Wide desktop | Record side column 340 px; report filters in five columns |
| 1200 to 1399 px | Desktop | Record side column 300 px; report filters in three columns |
| 981 to 1199 px | Tablet landscape | Sidebar starts as icons (a choice is remembered); dashboard in two columns (small widgets half width, others full); record side panels move under the main column in two columns; report charts stack; the guided journeys panel floats over the content |
| 761 to 980 px | Tablet portrait | Search becomes an icon button; two-column panels stack; documents list above the preview; report figures in two columns |
| 760 px and narrower | Phone | Drawer navigation; bottom bar; tables become cards; one column everywhere; larger touch targets (44 px) |

The sidebar collapse is a choice kept on the computer, like the theme. On the first visit it starts expanded on desktops
and as icons on tablets.

## 2. Desktop (1440 × 900)

```
+--------------------------------------------------------------------------------------------------------------+
|                    Design prototype: demonstration data, not connected to BIZOMAT.                           |
+--------------------------------------------------------------------------------------------------------------+
| [B] BIZOMAT [ERP] | Example Engineering v | All sites v | [ Search everything...  / ]     [+ New] [bell] [?] [AM] |
+-------------------+------------------------------------------------------------------------------------------+
| Home            C |  Home / Procurement / Purchase orders / PO-0388                       [Approve] [...]    |
| My Work      18 C |  Purchase order to Coastline Steel Supply                                                 |
| FAVOURITES        |  PO-0388  Awaiting approval  Working  Planned  *                                          |
|  * Production ... |  | Working / Planned  The purchase order document works in Finance ...  [Open in Finance] |
| RECENT            |  Overview  Details  Receiving  Approval  Related records  Documents  Activity  Audit      |
|  o PO-0388        |  +------------------------------------------------+  +-------------------------------+  |
| ----------------- |  | Summary (key facts, 4 columns)                 |  | Related records               |  |
| Sales & Cust.   > |  +------------------------------------------------+  |  SUP-01 Coastline Steel ...   |  |
| Finance         > |  | Approval  [Return] [Approve]                   |  |  WO-1042 ... Delayed          |  |
| Procurement     v |  |  (v) Submitted  (v) Budget check  ( ) Approval |  +-------------------------------+  |
|   Suppliers   W P |  +------------------------------------------------+                                     |
|   Purchase ord W P|  | Lines, totals                                  |                                     |
| ...               |  +------------------------------------------------+                                     |
| W Working C ... P |                                                                                            |
| < Collapse        |                                                                                            |
+-------------------+------------------------------------------------------------------------------------------+
```

- Dashboard: four key figures in a row, then charts and lists two to a row (medium), full-width lists last.
- Lists: full table with selection, sortable headers, row actions and pagination.
- Boards (pipeline, production planning): one lane per stage or day, all visible at 1440 px.

## 3. Tablet (900 × 1100)

```
+------------------------------------------------------------------------------+
|       Design prototype: demonstration data, not connected to BIZOMAT.        |
+------------------------------------------------------------------------------+
| [B] BIZOMAT [ERP] | Example Eng.. v | All sites v | [Q]     [+ New] [bell][?][AM] |
+----+-------------------------------------------------------------------------+
| [] |  Home / Dashboards / CEO / Business owner      [CEO v] [Customise]       |
| 18 |  Company performance dashboard                                          |
| *  |  +------------------------------+ +------------------------------+      |
| o  |  | Revenue this month           | | Gross margin                 |      |
| -- |  +------------------------------+ +------------------------------+      |
| $  |  +------------------------------+ +------------------------------+      |
| [] |  | Cash                         | | Orders late                  |      |
| .. |  +------------------------------+ +------------------------------+      |
|    |  +-------------------------------------------------------------+        |
|    |  | Revenue against target (chart, full width)                  |        |
|    |  +-------------------------------------------------------------+        |
|    |  | Delayed orders (list, full width)                           |        |
| >  |  +-------------------------------------------------------------+        |
+----+-------------------------------------------------------------------------+
```

- Sidebar as icons (64 px). A section icon opens its pages in a small menu beside it; Favourites and Recent too.
- Records: one main column; the side panels (payments, related records) sit under it, two side by side.
- Wide tables keep a horizontal scroll inside their card; the page itself never scrolls sideways.
- Guided journeys float over the right edge of the content.

## 4. Phone (390 × 844)

```
+----------------------------------+      +----------------------------------+
| Design prototype: demonstration  |      | Design prototype: demonstration  |
|  data, not connected to BIZOMAT. |      |  data, not connected to BIZOMAT. |
+----------------------------------+      +----------------------------------+
| [=] [B][ERP] [Q]   [+] [bell][?][AM]|   | [=] [B][ERP] [Q]   [+] [bell][?][AM]|
+----------------------------------+      +-------------------+--------------+
| Home / Procurement / Purchase... |      | Home            C | (dimmed      |
| Purchase orders                  |      | My Work      18 C |  content)    |
| Working  Planned  *              |      | FAVOURITES        |              |
| [All] [Awaiting approval] [...]  |      |  * Production ... |              |
| [ Search purchase orders       ] |      | RECENT            |              |
| [Filter]  16 records [Export]    |      | ----------------- |              |
| +------------------------------+ |      | Sales & Cust.   > |              |
| | PO-0395            Received  | |      | Finance         > |              |
| | Purchase order to Delta ...  | |      | Procurement     v |              |
| | Supplier      Delta Indus... | |      |   Purchase orders |              |
| | Expected        16 Nov 2026  | |      | ...               |              |
| +------------------------------+ |      +-------------------+--------------+
| +------------------------------+ |      |                                  |
| | PO-0394 ...                  | |      |                                  |
+----------------------------------+      +----------------------------------+
| Home  My Work  Scan  Approvals More|    | Home  My Work  Scan  Approvals More|
+----------------------------------+      +----------------------------------+
        List as cards                           Drawer navigation ("More")
```

- The banner wraps to two lines rather than cutting off; it stays visible above every drawer and dialog.
- Header: menu, mark, "ERP", search icon, New (icon), notifications, help, account. Company and site move into the
  account menu.
- Bottom bar: Home, My Work (count), Scan, Approvals (count), More (opens the navigation drawer). Escape or a tap on
  the dimmed area closes the drawer.
- Tables become cards: identifier, status, title and two or three key values; the whole card opens the record.
  Wide tables that are the point of the page (BOM tree, permission matrix) keep a horizontal scroll.
- Record actions sit under the title; tabs scroll sideways; the form action bar sticks above the bottom bar.
- Dialogs and the search open full width; search fills the screen below the banner.
- Charts keep their table view; dashboards are one column of widgets.

## 5. Mobile priorities

The phone is for doing a few things away from a desk, quickly. These screens are designed phone first:

| Task | Screen in the prototype | What makes it work on a phone |
| --- | --- | --- |
| Approvals | My Work, Approvals tab (`#/my-work?tab=approvals`; bottom bar "Approvals") | One card per item, large Approve and Return buttons, comment dialog, undo |
| Tasks | My Work, My tasks (`#/my-work?tab=tasks`) | Complete in one tap, grouped by due date |
| Notifications | Bell (full-screen drawer) and `#/notifications` | Unread state, "Mark all as read", one tap opens the record |
| Stock scanning | Scan (`#/inventory/scan`; bottom bar "Scan") | Camera placeholder, manual code entry with a large monospace field, a result card with Move, Count and Open record |
| Inspection checklist | `#/quality/inspections/INS-0533?tab=checklist` | Pass, Fail, N/A as a full-width segmented control (40 px), measured value field, failed checks marked and linked to the nonconformance, Add photo |
| Maintenance report | Report a fault (`#/maintenance/requests/new`) | Few fields, asset picker, "The machine is stopped" switch raises priority |
| Quick record access | `#/quick` | Type a record number, or pick from Recent and Favourites; Scan and Search buttons |
| Shop floor | `#/manufacturing/shop-floor` | Current operation, large Start, Pause, Complete operation, good and scrap quantities, Report a problem |

What phones do not get: the dashboard customiser's drag and drop (Earlier and Later still work), the permission
matrix as a primary task, wide boards as columns (lanes stack instead).
