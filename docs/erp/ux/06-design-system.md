# BIZOMAT ERP: design system and component library

Status: design for review. The ERP uses the design system that BIZOMAT Project Management, the Customer Relationship
Management (CRM) and Finance already share. Nothing here is new branding: the tokens come from
`shared/brand/` (copied into `apps/work/src/client/styles/bizomat-tokens.css`), the components from
`apps/work/src/client/styles/app.css`. The prototype adds its own layout classes in
`apps/work/src/client/system-prototype/erp.css` (all start with `erp-`), and changes no existing file.

Rules that never change (CLAUDE.md): navy `#0a1f33`, teal `#0f766e`, mark `#14b8a6`; Oxanium headings, Inter Tight
body; no third-party fonts, scripts or trackers; no inline `style=""` in the real app (the CSP forbids it; the
prototype sets only CSS custom properties from code, for bar widths and positions); plain language, no emojis.

## 1. Tokens

### 1.1 Colour

Brand tokens are the same in both themes except where a dark value is listed. App variables (right column) are what
components use; they follow the theme automatically.

| Token (`bizomat-tokens.css`) | Light | Dark | App variable (`app.css`) | Use |
| --- | --- | --- | --- | --- |
| `--bz-navy` | `#0a1f33` | `#0a1f33` | `--brand-ink` (light) | Wordmark, prototype banner, avatar |
| `--bz-teal` | `#0f766e` | `#2dd4bf` | `--accent`, `--brand`, `--focus-color` | Primary buttons, links, active navigation |
| `--bz-teal-hover` | `#115e59` | `#5eead4` | `--accent-2` | Primary button hover |
| `--bz-teal-soft` | `#e6f4f2` | `rgb(45 212 191 / .12)` (app: opaque mix) | `--accent-soft` | Active row, selected chip, Working badge |
| `--bz-teal-mark` | `#14b8a6` | `#14b8a6` | (logo only) | The arrow in the B |
| `--bz-amber` | `#f59e0b` | `#f59e0b` | `--warning` | Fills only: milestones, favourites star, meters near capacity |
| `--bz-paper` | `#f7f9fb` | `#0a111c` | `--bg` | Page background |
| `--bz-paper-2` | `#eef2f6` | `#0e1724` | `--surface-2` | Hover, sunken fills |
| `--bz-surface` | `#ffffff` | `#101a28` | `--surface` | Cards, header, sidebar, dialogs |
| `--bz-ink` | `#0e1726` | `#e6edf5` | `--text` | Body text |
| `--bz-ink-2` | `#334155` | `#c5d0dc` | `--text-2` | Secondary text, labels |
| `--bz-muted` | `#56657a` | `#9aa8ba` | `--text-3` | Hints, meta lines, table headers |
| `--bz-line` | `rgb(14 23 38 / .1)` | `rgb(230 237 245 / .1)` | `--border` | Card and row borders |
| `--bz-line-strong` | `rgb(14 23 38 / .2)` | `rgb(230 237 245 / .22)` | `--border-strong` | Inputs, buttons |
| `--bz-on-accent` | `#ffffff` | `#0a111c` | `--accent-text` | Text on teal |
| `--bz-success` / `-soft` | `#067647` / `#ecfdf3` | `#4ade80` / 12 % | `--success`, `--success-soft` | Paid, Approved, Passed |
| `--bz-warning` / `-soft` | `#b54708` / `#fffaeb` | `#fbbf24` / 12 % | `--warning-text`, `--warning-soft` | Awaiting approval, Partly paid, Low |
| `--bz-danger` / `-soft` | `#b42318` / `#fef3f2` | `#f97066` / 12 % | `--danger`, `--danger-soft` | Late, Overdue, Failed, over capacity |
| `--bz-info` / `-soft` | `#175cd3` / `#eff8ff` | `#84caff` / 12 % | `--info`, `--info-soft` | Draft, Connected badge |

Every text pairing above meets WCAG 2.2 AA (ratios are listed in `shared/brand/README.md`); for example `--bz-muted`
on white is 5.9:1 and teal `#0f766e` on white is 5.5:1.

Prototype-only variables (`erp.css`):

| Variable | Light | Dark | Use |
| --- | --- | --- | --- |
| `--erp-series-1` | `#0d9488` | `#14a090` | First chart series (teal family) |
| `--erp-series-2` | `#2f6fd0` | `#5a86e0` | Second chart series |
| `--erp-series-3` | `#c2570c` | `#d0800c` | Third chart series |
| `--erp-hl` | `#b45309` | `#fbbf24` | Guided-journey highlight outline |
| `--erp-top` | set from the banner's height | | Drawers and dialogs open below the prototype banner |

The chart series were run through a colour-vision check (lightness band, chroma, separation under protanopia,
deuteranopia and tritanopia, contrast with the surface) in both themes: all pass. Charts never rely on colour alone:
every chart has a legend for two or more series, a "Show table" switch, and status (over capacity, below goal) is
written as a word beside the bar.

### 1.2 Typography

| Role | Family | Size / weight | Class or element |
| --- | --- | --- | --- |
| Page title | Oxanium (`--bz-font-display`) | 22 px / 650, tracking -0.012em (19 px on phones) | `h1` in `.erp-title` |
| Panel and section title | Oxanium | 15 px / 650 | `h2` in `.erp-panel-head` |
| Widget title | Inter Tight | 13.5 px / 650 | `.erp-widget-head h2` |
| Body | Inter Tight (`--bz-font-sans`) | 14 px / 400, line height 1.45 | `body` |
| Table cell | Inter Tight | 13 px | `.data-table td` |
| Table header | Inter Tight | 12 px / 600, upper case, 0.03em | `.data-table th` |
| Label | Inter Tight | 12 px / 600 | `.field > label` |
| Hint, meta | Inter Tight | 12 to 12.5 px, `--text-3` | `.hint`, `.muted.small` |
| Identifier | system monospace (`--bz-font-mono`) | 12.5 px | `.erp-id`, `.erp-rowlink` |
| Key figure | Oxanium | 30 px (widget), 26 px (report), tabular figures | `.erp-wkpi-value`, `.erp-kpi-value` |

Fonts load from the product's own origin (`/fonts/oxanium-latin.woff2`, `/fonts/inter-tight-latin.woff2`) with
metric-matched fallbacks, so text does not jump when they arrive. Numbers in tables use tabular figures.

### 1.3 Spacing, shape, depth and layout widths

| Item | Value | Source |
| --- | --- | --- |
| Spacing steps used | 4, 6, 8, 10, 12, 14, 16, 18, 24, 28 px | `erp.css` (grid gap 14 px; panel padding 14 × 16 px; page padding 18 × 28 px) |
| Radius small / default / large | 6 / 8 / 12 px | `--radius-sm`, `--radius`, `--radius-lg` |
| Shadow 1 (cards) | `0 1px 2px rgb(10 31 51/.05), 0 4px 16px rgb(10 31 51/.05)`; none on dark | `--shadow-1` |
| Shadow 2 (menus, bulk bar, tooltips) | `0 12px 32px rgb(10 31 51/.14)`; dark `0 14px 36px rgb(0 0 0/.5)` | `--shadow-2` |
| Shadow 3 (dialogs, drawers) | `0 24px 60px rgb(10 31 51/.22)`; dark `rgb(0 0 0/.6)` | `--shadow-3` |
| Focus ring | 2 px surface gap, then 2 px `--focus-color` | `--focus` on `:focus-visible` |
| Prototype banner | 28 px (wraps to two lines on phones) | `.erp-banner` |
| Header | 56 px (52 px on phones) | `--erp-header-h` |
| Sidebar | 256 px; 64 px as icons | `--erp-side-w`, `--erp-side-icons` |
| Guided journeys panel | 340 px | `--erp-journeys-w` |
| Content width | 1440 px (1680 px for wide boards and reports) | `.erp-page`, `.erp-page.wide` |
| Record side column | 340 px (300 px below 1400 px wide) | `.erp-record-grid` |
| Dashboard grid | 4 equal tracks, gap 14 px | `.erp-dash` |

The dashboard grid has four tracks; widget sizes span 1, 2, 3 or 4 of them. This is the same proportion as the
12-column grid of `04-role-dashboards.md` (S 3, M 6, L 9, F 12 columns).

## 2. Components

Each component lists its states and what implements it. "app.css" classes and `components/ui/*` components exist in
the working applications; "erp.css" classes and `system-prototype/*` files are the prototype's.

### 2.1 Buttons

| Variant | Class | States |
| --- | --- | --- |
| Default | `.btn` | hover (`--surface-2`), focus ring, disabled (55 % opacity, not-allowed), pressed (`aria-pressed`) |
| Primary (one per area) | `.btn.primary` | hover `--accent-2`; on dark, dark text on bright teal |
| Destructive | `.btn.danger` | used only to confirm a loss ("Leave without saving") |
| Quiet | `.btn.ghost` | for icon buttons and secondary actions in toolbars |
| Sizes | `.btn.sm` (26 px), default (32 px), `.btn.lg` (40 px, phone-first screens) | |
| Icon only | `.btn.icon` | always has `aria-label` |
| Toggle | `.btn.active` + `aria-pressed` | "Compare with B", "Filter (1)" |
| Segmented | `.erp-seg` around `.btn` with `role="radio"` | Board/List, revision A/B/C, Pass/Fail/N/A |

### 2.2 Inputs and forms

| Component | Class / file | States |
| --- | --- | --- |
| Text, number, date | `.input` (34 px; `.sm` 28 px; 44 px on scan and quick access) | focus (teal border and soft ring), invalid (`.invalid`, `aria-invalid`), disabled |
| Select | `.select` | same as input |
| Text area | `.textarea` | same as input |
| Checkbox | `.checkbox` | checked, indeterminate (select all on a page) |
| Switch | `.switch` with `role="switch"` | on, off, focus; the word On or Off is shown beside it |
| Field | `.field` with `label`, `.hint`, `.error` | hint and error are linked by `aria-describedby`; required fields say "(required)" |
| Form | `patterns/FormView.tsx`, `.erp-form`, `.erp-form-grid` | grouped panels with a description; error summary (`.erp-error-summary`, `role="alert"`, links to fields); sticky action bar (`.erp-form-actions`): Cancel, Save draft, Save and continue; "Leave without saving?" dialog while changes are unsaved |

### 2.3 Dropdowns and menus

| Component | Implementation | Behaviour |
| --- | --- | --- |
| Menu button | `kit.tsx` `MenuButton` over `components/ui/overlays.tsx` `Popover` | `aria-haspopup`, `aria-expanded`; opens with Enter, Space or Arrow Down; focus moves to the first item; Arrow keys move; Escape closes and returns focus; Tab closes |
| Menu item | `.menu-item`, `MenuEntry` (`role="menuitem"` or `menuitemradio` with a tick) | hover, focus, active, disabled |
| Menu link | `MenuLink`; external links open in a new tab and say so to screen readers | |
| Menu label and separator | `.menu-label`, `.menu-sep` | |
| Used for | company, site, quick create, help, user menu, row actions, page "More actions", collapsed sidebar flyouts | |

### 2.4 Tabs

`kit.tsx` `Tabs` (`.tabs`, `.tab`, `.erp-tabs`): `role="tablist"`, `role="tab"` with `aria-selected`, roving
`tabindex`, Arrow Left and Right, Home and End. Optional count (`.erp-tab-count`). States: default, hover, active
(teal underline), focus. The tab is kept in the address (`?tab=payments`), so a link can open a record on a tab.

### 2.5 Tables and lists

| Component | Class / file | States |
| --- | --- | --- |
| Data table | `.data-table` + `.erp-table` | row hover, selected (`tr.selected`), sticky bulk bar, numeric columns right-aligned (`.num`) |
| Sortable header | `.erp-sort` button in `th` with `aria-sort` | none, ascending, descending (icon and `aria-sort`) |
| List view | `patterns/ListView.tsx` | loading (skeleton rows), empty ("No … match" with Clear), filtered (count announced), paged |
| Saved views | `.erp-view` chips with `aria-pressed` | active, changed ("(changed)"), deletable (own views) |
| Filter builder | `.erp-filters`, `.erp-cond` | field, operator, value per condition; "Add condition"; "Clear all" |
| Column chooser | `Popover` with `role="dialog"`, `.erp-colchooser` | first column always shown |
| Bulk bar | `.erp-bulkbar` (`role="region"`) | appears when rows are selected |
| Pagination | `.erp-pager` (`nav`) | rows per page 10, 25, 50; Previous and Next disabled at the ends |
| Phone cards | `.erp-cards`, `.erp-card` | the whole card is one link; shows identifier, status, title and the columns marked `card` |
| Widget list | `.erp-wlist` | five rows, identifier, title, meta, status, "All …" link |

### 2.6 Cards and panels

| Component | Class | Notes |
| --- | --- | --- |
| Card | `.card` (app.css) | surface, 1 px border, 12 px radius, shadow 1 |
| Panel | `kit.tsx` `Panel`, `.erp-panel` | `section` with a heading (`aria-labelledby`), optional actions |
| Key facts | `Facts`, `.erp-facts` (2, 3 or 4 columns) | `dl` of label and value; empty values read "Not set" |
| Key figure | `.erp-wkpi`, `.erp-kpi` | the value is a link to the list behind it; the note says the comparison in words |
| Link card | `.erp-linkcard` | reports on Enterprise dashboards |
| Paper | `.erp-paper` | document preview; always light, even in the dark theme |

### 2.7 Charts

`widgets/charts.tsx`: `BarChart` (vertical bars, optional dashed target line, one or more series), `HBarChart`
(horizontal bars with an optional limit line), `LineChart` (one or two series, crosshair), `ChartFrame` (legend and
"Show table" switch), `Legend`.

| Rule | How |
| --- | --- |
| One axis | never two scales; a second measure gets its own chart |
| Thin marks | bars at about 64 % of the slot, 4 px rounded top, square base; 2 px lines |
| Labels | recessive grid and axis (`--border`), values in tooltips and in the table view; text uses text colours, never the series colour |
| Interaction | tooltip on hover and keyboard focus; bars that drill down are buttons (`role="button"`, Enter or Space) |
| Accessibility | `role="img"` with a label naming the chart; legend for two or more series; "Show table" for exact values |
| Status | over capacity or below goal: danger fill plus the words "Over capacity" or "Below 85% goal" |

### 2.8 Badges

| Badge | Class | Meaning |
| --- | --- | --- |
| Status | `StatusBadge`, `.badge.erp-badge-{success, warning, danger, accent, info, neutral}` | one tone per word, the same in every module (`format.ts` `toneFor`) |
| Page state | `StateBadges`, `.erp-state-W` (teal), `.erp-state-C` (blue), `.erp-state-P` (dashed outline) | Working, Connected, Planned; in the sidebar the letter only, with the word for screen readers |
| Module | `ModuleBadge`, `.erp-module` | ERP, CRM, Finance, Projects, CAD, Company |
| Count | `.erp-count`, `.erp-tab-count`, `.erp-bell-count`, `.erp-bb-count` | with an `aria-label` such as "18 open" |

### 2.9 Dialogs and drawers

| Component | Implementation | Behaviour |
| --- | --- | --- |
| Dialog | `components/ui/overlays.tsx` `Modal` (`.overlay`, `.modal`) | `role="dialog"`, `aria-modal`, focus to the first field, focus trapped, Escape closes, focus returns to the opener |
| Drawer | `kit.tsx` `Drawer` (`.sidepanel.erp-drawer`) | from the right, 440 px, full width on phones; same focus rules as a dialog |
| Search | `shell/Search.tsx` | combobox with listbox, `aria-activedescendant`, grouped results, Enter opens the active result |
| Non-modal panel | `shell/Journeys.tsx` (`aside.erp-journeys`) | the page stays usable; on phones it shrinks to one line after each step |
| Confirm leave | `FormView` `LeaveGuard` | "Stay on this form" or "Leave without saving" |

All overlays open below the prototype banner, which stays visible.

### 2.10 Notifications and feedback

| Component | Implementation | States |
| --- | --- | --- |
| Notification centre | `shell/Notifications.tsx` drawer and `/notifications` page | unread (dot, teal tint, bold title, "Unread:" for screen readers), read; All and Unread tabs; "Mark all as read" |
| Toast | `components/ui/overlays.tsx` `ToastProvider` | `role="status"`; actions such as Undo after Complete, Approve, Return or a stage change |
| Inline alert | `.erp-alert.{danger, warning, info}` | delay reasons, review notes, error summary |
| Page state note | `.erp-statenote.s-{W,C,P}` | what the page is and, for Working pages, "Open in <app>" |
| Highlight | `.erp-hl` | outline used by guided journeys for six seconds; no pulse under reduced motion |

### 2.11 Empty, loading and error states

| State | Implementation | Wording rule |
| --- | --- | --- |
| Empty | `kit.tsx` `Empty` (`.empty.erp-empty`) | says what the page is for and offers the next step ("Clear search and filters", "Open Company performance") |
| Loading | `SkeletonRows` (`.skeleton`, `aria-busy`) | skeleton rows in the shape of the table, never a blank page; shown for 0.2 s in the prototype to demonstrate it |
| Error in a form | `.field .error` and `.erp-error-summary` | says what to do ("Enter short description.") |
| Not found | `App.tsx` `NotFound`, `RecordView` | names the number that was not found and links back |
| Read-only role | badge "Read only for the <role> role" in the state note | |

### 2.12 Shell

| Part | File and class | Notes |
| --- | --- | --- |
| Banner | `.erp-banner` (`role="note"`) | "Design prototype: demonstration data, not connected to BIZOMAT." on every screen |
| Header | `shell/Shell.tsx` `Header`, `.erp-header` | brand (`BrandMark`, `Wordmark`, `.erp-product` "ERP"), company and site menus, search trigger (`/`), New, notifications, help, user menu |
| Sidebar | `Sidebar`, `.erp-sidebar` | Home, My Work, Favourites (reorder dialog), Recent, one open section, state letters, collapse to icons with flyouts |
| Page header | `shell/PageHeader.tsx`, `.erp-page-header` | breadcrumb (`nav aria-label="Breadcrumb"`, `aria-current="page"`), title, identifier, status, state badges, favourite star (`aria-pressed`), actions, More actions |
| Bottom bar | `BottomBar`, `.erp-bottombar` | phones only: Home, My Work, Scan, Approvals, More |
| Skip link | `.erp-skip` | first Tab stop, moves focus to the main area |

## 3. Accessibility checklist (as built in the prototype)

- Landmarks: banner note, `header`, `nav` (main navigation, breadcrumb, shortcuts, pages), `main`, `aside`.
- Every control has a visible or screen-reader label; icon buttons have `aria-label`.
- Visible focus on every interactive element (`--focus`), including chart bars and bins.
- Keyboard: menus, tabs, dialogs, search, the BOM tree (Arrow Left and Right collapse and expand), the pipeline and
  planning boards (a stage or day menu on each card), the dashboard customiser (Earlier, Later, Size, Remove, with
  announcements in a live region).
- Colour is never the only signal: status words in badges, "Over capacity" beside red bars, legends and tables for
  charts, underline on hover for figures.
- `prefers-reduced-motion` turns off transitions and the highlight pulse.
