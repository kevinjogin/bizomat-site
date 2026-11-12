# Workspace names and colours, and category descriptions

_Project Management (`apps/work`), 12 Nov 2026. Two features: renaming a workspace and giving it an identification
colour, and descriptions on a board's categories (its groups), with a Categories section in project reports._

## 1. Workspace renaming and colour

A workspace keeps one record (`workspaces`: `name`, `color`). Renaming changes the name only: the id, every link
(`/w/<id>/...`), board, task, document and member stay as they are. Nothing creates a second workspace.

### Where people rename and recolour

| Place | What it offers |
| --- | --- |
| Workspace switcher (top bar), its menu | Every workspace with its colour dot; **Rename or change colour** (owners and admins) |
| Workspace switcher, right-click | **Rename workspace**, **Change colour** (owners and admins), Workspace settings, All workspaces |
| Settings > Workspace | Name and colour fields with Save and Cancel, beside description, logo and member settings |
| Workspaces page | A rename button on each workspace the person owns or administers |

Each opens the same rules: a name field, the colour palette and a custom colour, **Save** and **Cancel**, and a toast
when saved ("Workspace renamed to ...", "Workspace colour changed"). The new name and colour show at once: the app
updates the signed-in session it keeps (`['me']`, which every workspace list and heading reads), then reloads it and
the workspace's settings.

### Colours

Ten named colours in `src/shared/workspace-colors.ts`, restrained 600 to 700 shades:

| Name | Hex | Name | Hex |
| --- | --- | --- | --- |
| Blue | `#2563eb` | Red | `#b91c1c` |
| Teal | `#0f766e` (BIZOMAT teal, the default) | Purple | `#7e22ce` |
| Green | `#15803d` | Pink | `#be185d` |
| Orange | `#c2410c` | Indigo | `#4338ca` |
| Amber | `#a16207` | Grey | `#4b5563` |

Each keeps white text at 4.5:1 or more (the initial on a workspace tile) and 3:1 or more against the light page. None
is a task status colour (`#94a3b8`, `#f5a524`, `#e5484d`, `#00a36c`) or a priority colour (`#7f1d1d`, `#e5484d`,
`#f5a524`, `#0ea5e9`), and Red and Amber are darker than the bright red and amber used for critical and near-critical
work. Any other colour can be chosen as a custom `#rrggbb` (colour picker or typed; `#` optional when typing). On the
dark theme the dot has a thin ring so dark colours stay visible. Existing workspaces keep their colour.

The colour is a small indicator only, never a page colour: the switcher button and its menu, the right-click menu,
the home heading ("Here's what's happening in ● Harbour Studio"), the board breadcrumb above every board's title
(● workspace > Boards, new), and the workspace tile on the Workspaces page. The same elements are used on phones
(the switcher stays in the top bar; the rename dialog's palette becomes two columns).

### Rules (API, `PATCH /api/workspaces/:ws`)

- **Who:** organisation owners and admins (`requireWorkspace(..., 'admin')`, unchanged). Members, viewers and guests
  get 403; people outside the workspace 404.
- **Name:** trimmed, 1 to 100 characters (400 otherwise). It must differ, ignoring letter case and surrounding spaces,
  from every other workspace the person belongs to: otherwise **409** "You already belong to a workspace called "X".
  Choose a different name." Changing only the letter case of a workspace's own name is allowed. The check applies to
  renaming; creating a workspace is unchanged.
- **Colour:** `#` and six hex digits (400 otherwise), stored as given.
- The response now also returns the updated `workspace` (as in `GET /api/workspaces`), besides `ok: true`.

### Audit

Both records, only when the value really changes (colour compared without letter case):

| Event | `audit_log` (Settings > Administration > Sign-in and settings log) | `audit_events` (Settings > Administration > Audit trail, filter "Workspace (name and colour)") |
| --- | --- | --- |
| `workspace.renamed` | `metadata: { from, to }`, target the workspace | `before`: old name, `after`: new name |
| `workspace.color_changed` | `metadata: { from, to }`, target the workspace | `before`: old colour, `after`: new colour |

The existing `workspace.updated` row is still written for every accepted change. A refused change writes nothing.

## 2. Category descriptions

A board's categories are its **groups** (`groups` table). Each group can now have a description: plain text, up to
5,000 characters. No separate category system exists.

### Format

Paragraphs separated by a blank line; a line starting with `- ` or `* ` is a bullet. Nothing else is interpreted.
The app renders it as React text elements (`src/client/board/GroupDescription.tsx`), never as HTML; the reports
escape every character. Shared parsing: `src/shared/group-description.ts`.

### On the board (Table view)

- An **information icon** next to a group's name when it has a description.
- Clicking the icon, or the group's name when the group has a description, opens the **group details** panel: the
  name, the full description, and the group's figures (tasks, completed, open, and overdue when the board has a date
  or timeline column; every task in the group, whatever the view's filters).
- People who may edit the board **edit, save and clear** the description there (a counter shows the 5,000 limit;
  Ctrl or Cmd + Enter saves; clearing offers Undo in its toast). Unsaved text is never dropped by a stray click: the
  panel asks to save or cancel first.
- The group's menu has **Edit description** (or **Add description**).
- A **one-line preview** under the group's header, truncated, with **Show more** and **Show less**.
- Unchanged: a group without a description still renames when its name is clicked (people who may edit), and
  "Rename group", colour, move up and down, collapse, duplicate, archive, delete and "Add new group" work as before.
  None of them changes which group a task is in.

### Rules (API)

- `PATCH /api/groups/:groupId` accepts `description` (string; line endings normalised, control characters removed,
  trimmed; `""` clears it; over 5,000 characters is 400). The response includes the saved `description`.
  `POST /api/boards/:id/groups` accepts it too.
- **Who:** the right that already renames, recolours, collapses and reorders groups: **edit access to the board**
  (organisation owners and admins; project managers and members on projects they can edit; anyone a project grants
  edit). People with view access (viewers, members restricted to view) read descriptions in the board but get 403
  when changing them; people without access get 404. Note: this is the existing group right, so members with edit
  access can change descriptions, as they can rename groups.
- People who see only a single task (task access, no project access) do not receive the group's description, like
  the project's own description.
- `GroupDTO.description: string` (always present, `""` when empty).
- Board duplication, saving as a template, creating a board from a saved template (`cloneBoard`) and duplicating a
  group copy the description. Workspace JSON export includes it (the `groups` rows).
- Changes are recorded in the board's activity (`group_description_changed`, `group_description_cleared`).

### Reports: section K, Categories

`REPORT_SECTIONS` ends with `categories` ("K. Categories"); it is on by default for every report type except the
financial report, and can be switched on or off like the others. For each group (in board order; groups archived
before the period's end, or created after it with no tasks, are left out): name, colour, description, total tasks,
completed, in progress, outstanding, overdue, unassigned, and the assigned owners. Counts use the report's own task
rows at the end of the period, so they add up to the overview. Every task is counted, whatever the list filters;
tasks are counted in the group they are in today.

Financial totals per category (each financial column in its own currency, never added across currencies) appear only
when the report also includes the financial summary (section H). That section already requires the person
generating the report to be allowed to see the project's finances, and a report with it is marked as containing
financial data (`reports.includes_finance`), so only people who may see finances can open it later.

Where it appears: the report snapshot (`ReportData.categories`, stored with the report), the HTML and PDF (a summary
table, then each category's description as paragraphs and bullets, and its amounts), the Excel workbook (a
**Categories** sheet, last), and the task CSV (a last column, **Category description**, so the other columns keep
their place).

## 3. Data changes

| Change | Detail |
| --- | --- |
| Migration `apps/work/migrations/0009_group_descriptions.sql` | `ALTER TABLE groups ADD COLUMN description TEXT NOT NULL DEFAULT ''`. Additive; the previous Worker version runs unchanged on it. Number 0008 is left for the scheduling work being built in parallel |
| Workspaces | No schema change; colours and names are existing columns. No migration rewrites an existing colour |

## 4. Tests

`cd apps/work && npm run check` (lint, type checks, Workers and Node suites, builds). Result on 12 Nov 2026: lint and
type checks pass; Workers runtime 291 of 291 (28 files, 19 of them new); Node runtime 410 of 410 (43 files); the client,
Worker and Node builds pass (the Node bundle embeds migration 0009).

- `test/workspace-identity.test.ts`: the palette (ten distinct named colours, teal default, none of the status or
  priority colours, strict custom parsing); rename persists, keeps the id, boards, items, groups and members, and
  shows for every member; duplicate names refused with 409 ignoring case and spaces (own case change allowed, other
  people's workspaces ignored); empty and over-long names refused, trimmed name stored; palette and custom colours
  accepted, invalid colours refused; members, viewers (403) and outsiders (404) cannot rename or recolour, admins
  can; `workspace.renamed` and `workspace.color_changed` in both audit records only when the value changes; a refused
  rename writes nothing; boards still open after a rename.
- `test/group-descriptions.test.ts`: the format (paragraphs, bullets, nothing interpreted); create, view, edit and
  clear; the 5,000-character limit; rename, reorder, collapse and recolour keep every task in its group; viewers read
  but cannot edit, outsiders get 404, members with edit access can, a member restricted to view cannot; board
  duplication, group duplication, save as template and a board from that template carry descriptions; section K in
  the preview and in the saved snapshot (figures add up to the overview; HTML escaped with bullets as a list; the
  snapshot and the saved HTML keep the description after it changes; CSV column; PDF and Excel download); amounts
  per category only with the financial summary; the section is left out when not chosen.

## 5. Screenshots

Example data only (example.com addresses, made-up workspaces and a made-up project), taken with Playwright against
the built Node server:

- `screenshots/workspace-colours.png`: the switcher's menu with each workspace's colour dot, and the home heading.
- `screenshots/workspace-rename.png`: the rename dialog with the palette, custom colour and preview.
- `screenshots/workspace-renamed-toast.png`: the confirmation, and the new name in the switcher and heading.
- `screenshots/category-description.png`: a board with the information icon, the preview line and the group details.
- `screenshots/category-description-edit.png`: editing a description in the group details.
- `screenshots/category-report.png`: section K of a project report.
- `screenshots/workspace-colours-mobile.png`, `workspace-rename-mobile.png`, `category-description-mobile.png`: the
  same on a phone.
