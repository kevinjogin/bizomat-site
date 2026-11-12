# Project controls: current state audit (Phase 1)

Inspection of BIZOMAT Project Management (`apps/work`) on 12 Nov 2026, at `main` = `76f6b45`, before the project
planning and controls work on branch `feature/project-controls-cpm-evm`. It records what already existed, what was
missing, and the design chosen to fill the gaps without a second task or project system.

## What exists

| Area | Implementation | Notes |
| --- | --- | --- |
| Project | A board (`boards`): name, description, settings JSON, currency, start date and manager (migration 0006), groups, columns, views | One project = one board |
| Task | A board item (`items`): name, description, group, `parent_item_id` (one level of subtasks), `position`, `values_json` keyed by column id, `completed_at` | Values are typed by the board's columns (`src/shared/columns.ts`) |
| Task ID | Random text id (`newId()`), not human readable | No numbering, no prefix |
| Ordering | Groups by `position`, items by `position` within a group, subtasks under their parent | Fractional positions |
| Start and due dates | Column types `date` (one date) and `timeline` ({start, end}, inclusive dates) | Dates only (YYYY-MM-DD), no times |
| Duration | Not stored; the Gantt derives a span in calendar days from a timeline value | No working-time notion |
| Progress | Column type `progress` (0 to 100), status labels marked "done" set `completed_at` | No history of progress |
| Ownership | Column types `person` and `people` (user ids) | |
| Finance | Currency columns with a finance role (`approved_budget`, `estimated_cost`, `actual_cost`, `committed`), per-project and organisation currencies (migration 0006), exact decimal arithmetic (`src/shared/money.ts`), finance permission per person | Amounts are current totals: no dates, so no time-phased actual cost |
| Gantt | `TimelineView.tsx`: bars from a timeline column, drag and resize, day/week/month zoom, a status colour, arrows from a `dependency` column | Arrows are drawn as finish to start; nothing is calculated |
| Dependencies | Column type `dependency`: a list of predecessor item ids | No type, no lag, no validation, no loop detection |
| Calendar | None: weekends are only shaded in the day zoom | No working days, hours or holidays |
| Reports | `services/reports/build.ts` builds a snapshot from recorded history; HTML, PDF, Excel and CSV renderers; immutable saved versions; finance-gated | Ten sections (A to J), seven report types |
| Audit | `audit_log` (security and admin) and `audit_events` (permanent, insert-only, before/after) | |
| Permissions | Organisation roles; project levels view/edit/manage with capabilities (view and edit finance, members, create, assign, delete tasks, reports); task grants (`services/access.ts`) | Every API route checks them |

## What was missing

- Permanent, readable task IDs with a project prefix; search by ID.
- A work breakdown structure numbering.
- Scheduling data: working duration and its unit, remaining duration, actual start and finish, physical percent
  complete, milestones, constraints, scheduling type (fixed duration, work or units), work and units.
- Typed dependencies (FS, SS, FF, SF) with lead and lag, stored by stable ids, validated against loops.
- Working calendars: working days and hours, breaks, holidays, shutdowns, exceptions, time zone.
- A critical path calculation (forward and backward pass, total and free float, criticality).
- Baselines (approved, immutable, numbered, revisable) and their comparison.
- Time-phased planned value, earning methods, dated actual costs and progress history: everything earned value needs.
- A project controls summary and report sections for all of the above.

## Database changes (migration 0008, additive)

- `boards.task_prefix`, `boards.task_seq` (only increases); `items.task_number`, `items.task_key`, with a unique key per
  organisation.
- `task_schedules`: one row per task with the scheduling fields above (planned dates stay in the timeline column, so
  the board, the Gantt and existing automations keep working).
- `task_links`: predecessor, successor, type, lag in working minutes, lag unit; unique pair; no self links.
- `project_calendars`: the organisation default and per-project calendars (JSON definition).
- `project_baselines` and `baseline_tasks`: insert-only snapshots.
- `task_progress_entries` and `task_cost_entries`: dated history for earned value.

Migration 0009 (from the workspace and category work in the same release) adds `groups.description`.

## Dependency architecture

Typed links live in `task_links` and reference item ids, never positions. The existing `dependency` column is not
duplicated or migrated: its values are read as finish-to-start links with no lag (a typed link for the same pair
wins). New links are refused when they would close a loop (depth-first search from the successor); loops already in
the Dependency column are reported and the schedule is marked invalid. Links to summary tasks (tasks with subtasks)
are ignored with a warning: link their subtasks.

## CPM calculation design

`src/worker/services/schedule/calendar.ts` maps the calendar onto a straight axis of working minutes, so durations,
leads, lags and float are plain arithmetic; `cpm.ts` runs a topological forward pass and a reverse backward pass:

- ES = max(project start, the task's planned start when it has no predecessors, the status date for work not yet
  started, FS: EF(p)+lag, SS: ES(p)+lag, FF: EF(p)+lag−D, SF: ES(p)+lag−D, constraints); EF = ES + D.
- LF = min(project finish, FS: LS(s)−lag, SS: LS(s)−lag+D, FF: LF(s)−lag, SF: LF(s)−lag+D, constraints); LS = LF − D.
- Total float = LS − ES; free float = the smallest outgoing link slack (or project finish − EF).
- Critical when total float ≤ the critical threshold (default 0 working days), near-critical up to the near-critical
  threshold (default 5); thresholds per project.
- Actual dates fix started and finished work; remaining duration reschedules started work from the status date.

The engine is pure (no database) and runs on the server only; the browser displays its results.

## Baseline design

Approving a baseline freezes the plan-mode schedule (no status date applied), per-task budgets from the budget
column in the project currency, planned value curves, earning methods, owners, work and dependencies, plus the
calendar and settings. Numbers start at 0 (original); each revision records its reason, approver, date and the
baseline it replaces. Rows are never updated or deleted by the application (a test enforces it).

## EVM calculation design

`evm.ts` computes, on exact decimal amounts: PV (time-phased by curve: linear, front, back, S-curve, start, finish,
custom points, milestone payments), EV (percent complete, physical percent, weighted milestones, 0/100, 50/50, units),
AC (dated cost entries only; today's actual cost column value is used for today only, marked), and CV, SV, CPI, SPI,
EAC by three labelled methods, ETC, VAC, TCPI to BAC and to EAC. Every ratio with a zero or missing denominator is
"unavailable", never Infinity, NaN or 0.

## Migration and compatibility risks

| Risk | Handling |
| --- | --- |
| Existing tasks without keys | Keys are given when a board loads, oldest first (`ensureTaskKeys`); concurrent loads cannot give two tasks the same number (atomic counter, conditional update) |
| Existing timeline and dependency data | Used as they are: planned dates stay in the timeline column, dependency column values are read as FS links |
| Database copies and the move to Cloudflare | No triggers (the move tool refuses them); new tables hold plain rows; tooling tests pass |
| Schema checks of the migration tools | `migrate.test.ts` and `to-cloudflare.test.ts` run against the new schema |
| Reports already saved | Unchanged: snapshots are immutable; new sections are optional for existing report types |
| Finance visibility | Earned value and baseline budgets need the finance capability; the summary says why they are hidden |
| Large projects | O(V+E) calculation: 5,000 tasks with 10,000 links in about 65 ms (measured) |
