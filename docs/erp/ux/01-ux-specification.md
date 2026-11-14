# BIZOMAT ERP: UX specification

Status: design for review (owner's brief "Enterprise UI/UX design and interactive prototype", 13 Nov 2026). This is
the experience every BIZOMAT application and department will share. The clickable prototype shows it with
demonstration data (`08-prototype-guide.md`); nothing here changes the working applications yet.

## 1. Who it is for

A small company that may grow into a multi-department, multi-site organisation: an owner who wears every hat today, then
sales, finance, engineering, purchasing, production, warehouse, quality and project people, each with their own work.
The same screens must suit one person with everything and fifty people with narrow roles.

## 2. Design principles

| Principle | What it means on screen | Learned from (not copied) |
| --- | --- | --- |
| Role first | Each person lands on their role's dashboard and sees only the sections their roles open | SAP Fiori's role-based launchpad |
| One place for my work | Tasks, approvals, follow-ups, reviews and mentions from every module in one list with one primary action each | Microsoft Dynamics 365's activity and approvals centre |
| Work in context | A record shows what is related to it (the customer's quotes, orders, invoices, deliveries) without leaving it | Epicor Kinetic's record panels |
| Few clicks, clear next step | One primary action per page, contextual actions on rows, quick create from anywhere, search that opens records directly | Modern Odoo's lean forms and smart buttons |
| Information density with calm | Compact tables, tabular figures, restrained colour; colour only for state and attention | Enterprise practice |
| Say what is real | Every page carries its state: Working, Connected or Planned; demonstration data is labelled | BIZOMAT rule: never present unfinished screens as working |
| Same family | BIZOMAT brand and the design tokens of the existing apps; ERP looks like the CRM and Finance grown up | `shared/brand/`, `apps/work/src/client/styles/` |

## 3. The experience in one paragraph

You sign in once at bizomat.ai. ERP opens on your role's dashboard: four figures that matter to you, two charts, and
the lists that need attention, each a click from the record. The header keeps the company and site you are working in,
a search box that finds anything you may see, a "New" button for the records you create most, your notifications and
help. The sidebar has My Work at the top with its count, your pinned pages and recent records, then one section per
department; only the section you are in is open. Every list can be searched, filtered, sorted, saved as a view, selected
in bulk and exported. Every record has the same header, tabs, related records, documents, activity and audit. Every
form groups its fields, explains them, checks them as you go, and warns before you lose changes. Existing CRM, Finance
and Project Management screens open inside this frame, so nothing is learned twice.

## 4. Experience requirements

### 4.1 Navigation
- Two levels in the sidebar; tabs inside a page for a third; never more.
- One expanded section at a time; the current page highlighted; sections the person cannot use are not shown.
- Collapsed sidebar shows icons with tooltips; state remembered on the computer.
- Favourites: pin any page or saved view from its header; reorder by drag or keyboard.
- Recent: the last five records and pages.
- Breadcrumbs on every page: Section / Page / Record.

### 4.2 Search
- One box, keyboard `/` to focus; results as you type, grouped by type, each with its module badge and status.
- `Enter` opens the top result; arrow keys move; recent searches shown when empty.
- Scopes to narrow (Customers, Products, Orders...). Results respect each module's permissions.

### 4.3 Dashboards
- A role layout by default; personal layouts per role saved on the account (the prototype saves on the computer).
- Customise: add from the widget catalogue, remove, rearrange (drag and drop, or Move earlier and Move later for
  keyboard users), resize (small, medium, large, full width), restore the default.
- Every figure drills down to the list behind it, and every list row to its record.

### 4.4 My Work
- Tabs: All, My tasks, Approvals, Due today, Overdue, Waiting, Mentions.
- Each item: type, title, source module, due date, status, who is waiting, one primary action, "Open in <module>".
- Completing or approving updates the count at once and leaves an undo for a few seconds.

### 4.5 Lists, records, forms, reports
Defined in `05-reusable-screens.md`; every module uses the same patterns.

### 4.6 Feedback and states
- Toasts for completed actions (with undo where possible); inline messages for errors in forms; banners for page-level
  problems with a retry.
- Empty states say what the page is for and offer the first action.
- Loading states use skeletons in the shape of the content, never a blank page.
- Destructive actions confirm and name what will happen ("Void INV-2291: the ledger entry is reversed").

### 4.7 Accessibility
- WCAG 2.2 AA contrast (the token pairs in `bizomat-tokens.css` are chosen for it), visible focus, keyboard reach for
  every action, labelled controls, landmarks, `prefers-reduced-motion` respected, and text that reflows at 200% zoom.

### 4.8 Language
- Plain, short sentences; Australian spelling; the same word for the same thing in every module (for example
  "Approve", never "Authorise" in one place and "Approve" in another); numbers formatted for the company's locale and
  currency.

### 4.9 Theme
- Opens in the computer's system theme; a choice is remembered on that computer only (the BIZOMAT rule).

## 5. Deliverables in this folder

| # | Deliverable | File |
| --- | --- | --- |
| 1 | UX specification | `01-ux-specification.md` (this file) |
| 2 | Information architecture | `02-information-architecture.md` |
| 3 | Navigation map | `02-information-architecture.md`, section 3 |
| 4 | Role-based dashboard designs | `04-role-dashboards.md` |
| 5 | Reusable screen designs | `05-reusable-screens.md` |
| 6 | Design system and component library | `06-design-system.md` |
| 7 | Responsive layouts | `07-responsive-layouts.md` |
| 8 | Clickable prototype | `08-prototype-guide.md` and `apps/work/src/client/system-prototype/` |
| 9 | User journeys | `09-user-journeys.md` |
| 10 | Implementation recommendations | `10-implementation-recommendations.md` |
