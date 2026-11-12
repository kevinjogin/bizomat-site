# Project controls: scheduling, critical path, baselines and earned value

BIZOMAT Project Management gains professional planning and controls that stay out of the way of people who only
manage tasks: basic users keep tasks, owners, dates, status and the simple timeline; the board header's **Project
controls** button opens the advanced features (critical path, baselines, earned value, calendar and settings), and
every view can be filtered by criticality once a project uses dependencies.

Phase 1 inspection: [current-state-audit.md](current-state-audit.md). Workspace colours and category descriptions,
part of the same release: [workspace-and-categories.md](workspace-and-categories.md).

## Where things are

| Part | Code |
| --- | --- |
| Working calendar | `apps/work/src/worker/services/schedule/calendar.ts` |
| CPM engine | `apps/work/src/worker/services/schedule/cpm.ts` |
| EVM engine | `apps/work/src/worker/services/schedule/evm.ts` |
| Project schedule (WBS, durations, links, warnings) | `apps/work/src/worker/services/schedule/project.ts` |
| Task keys | `apps/work/src/worker/services/schedule/task-keys.ts` |
| Baselines | `apps/work/src/worker/services/schedule/baselines.ts` |
| Earned value for a project | `apps/work/src/worker/services/schedule/earned-value.ts` |
| API | `apps/work/src/worker/routes/schedule.ts` |
| Shared types and labels | `apps/work/src/shared/schedule.ts` |
| Data | `apps/work/migrations/0008_project_controls.sql` |
| Screens | `apps/work/src/client/board/controls/`, `views/TimelineView.tsx` (Gantt), the task panel's Schedule tab |

Complex calculations run on the server only; every view, the dashboards and the reports use the same results.

## Task IDs and the work breakdown structure

- Every task gets a permanent key `PREFIX-0001`. The prefix is chosen from the project name the first time (for
  "Laser installation": `LASER`) and can be changed by a project manager in Calendar and settings; it then applies to
  new tasks only. Keys are unique within the organisation.
- Allocation is concurrency-safe: one atomic `UPDATE boards SET task_seq = task_seq + 1 ... RETURNING task_seq`. The
  counter never decreases, so a deleted task's number is never reused; a key never changes when the task is renamed or
  moved. Tasks from before this release get keys when their board first loads, oldest first.
- Keys show in the table, Kanban, Gantt, task panel, task page, schedule tables and reports; a copy button sits in the
  task panel; search finds tasks by key; schedule tables sort and filter by key.
- WBS numbers are calculated, independent of keys: group = level 1 (`1`, `2`, ...), task = `1.1`, subtask =
  `1.1.1`, in board order. Tasks with subtasks are summary tasks: their dates, float and progress come from their
  subtasks (progress weighted by duration).

Example (from the review project):

| ID | WBS | Task |
| --- | --- | --- |
| LASER-0001 | 1.1 | Site preparation |
| LASER-0002 | 1.2 | Electrical installation |
| LASER-0003 | 1.3 | Compressed air installation |
| LASER-0004 | 2.1 | Machine delivery (milestone) |
| LASER-0005 | 2.2 | Machine positioning |
| LASER-0006 | 2.3 | Machine installation |
| LASER-0007 | 3.1 | Commissioning |
| LASER-0008 | 3.2 | Operator training |

## Scheduling data

Planned start and finish stay in the board's timeline column (so the board, the simple Gantt and automations keep
working). Each task can also have: a working duration in minutes, hours, working days or weeks; remaining duration;
actual start and finish; percent complete (the progress column when the board has one) and physical percent;
milestone; a constraint (as soon as possible, start or finish no earlier or no later than, must start or finish on);
scheduling type (fixed duration, the default; fixed work: duration = work / units; fixed units: work = duration ×
units), work and units; earning method and planned value curve.

Durations are working time on the project calendar; the elapsed calendar span is shown separately. People can enter
dates (the duration follows) or a duration with "Set finish from duration". A duration that does not fit the dates is
refused with an explanation; dates entered together with a duration win.

## Dependencies

Finish to start (FS), start to start (SS), finish to finish (FF) and start to finish (SF), each with a lag or lead
(negative lag) in minutes, hours, working days or weeks, counted in working time.

| Link | Meaning |
| --- | --- |
| A FS B | B starts after A finishes |
| A SS+2d B | B starts two working days after A starts |
| A FF B | B cannot finish before A finishes |
| A FS−1d B | B may start one working day before A finishes |

Added and edited in the task panel (Schedule tab), and in the Gantt ("Link tasks", then click the predecessor and the
successor; click a line to remove it). Links reference task ids. Refused: a task linked to itself, a duplicate, a link
that would close a loop (the message names the loop, for example "LASER-0003 → LASER-0001 → LASER-0002 →
LASER-0003"). Values of the existing Dependency column count as finish-to-start links with no lag.

Schedule quality warnings: dependency loops; constraints that cannot be met (negative float); planned dates earlier
than the links allow; tasks without dates or duration; tasks starting after the project start without a predecessor
or finishing before the end without a successor (missing logic); separate networks of linked tasks; links to summary
tasks; actual dates after the status date.

## Calendars

Default: Monday to Friday, 08:00 to 17:00 with a 12:00 to 13:00 break (8 working hours a day), UTC. Project managers
set working days, day start and end, breaks, the time zone, public holidays, company shutdowns, project non-working
days and extra working days, for the project; organisation administrators can save it as the organisation default.
One working day is the calendar's hours (never 24 hours). Dates are calendar dates in the calendar's time zone; the
status date ("today") is read in that zone.

Not built in this release: individual resource calendars (see Known limitations).

## Critical path method

The calendar is turned into a straight axis of working minutes; on it:

- Forward pass, in topological order: ES = max(project start; for a task without predecessors, its planned start;
  for work not started, the status date; FS: EF(p) + lag; SS: ES(p) + lag; FF: EF(p) + lag − D; SF: ES(p) + lag − D;
  constraints). EF = ES + D.
- Backward pass, in reverse order: LF = min(project finish; FS: LS(s) − lag; SS: LS(s) − lag + D; FF: LF(s) − lag;
  SF: LF(s) − lag + D; constraints). LS = LF − D.
- Total float = LS − ES. Free float = the smallest slack on any outgoing link (FS: ES(s) − lag − EF(p), SS: ES(s) −
  lag − ES(p), FF: EF(s) − lag − EF(p), SF: EF(s) − lag − ES(p)), or project finish − EF.
- Critical: total float ≤ the critical threshold (default 0 working days). Near-critical: ≤ the near-critical
  threshold (default 5). Otherwise non-critical. Invalid: the network has a loop; nothing is calculated.
- Started work keeps its actual start; finished work its actual dates (and is not counted as critical). A task
  marked done without recorded actual dates finished on its planned finish, or on the day it was marked done if that
  came first; a task with progress but no actual start started on its planned start. Work not
  started is never scheduled before the status date, which gives the current forecast; baselines are taken in plan
  mode, without that.
- Multiple critical paths are listed (chains of critical tasks joined by links with no slack), as are multiple start
  and end activities and milestones.

Worked example (engine test, 1 d = 8 h): A 3 d → B 4 d, A → C 2 d, B → D 5 d, C → D (all FS).

| Task | ES | EF | LS | LF | Total float | Free float | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | 0 | 3 | 0 | 3 | 0 | 0 | Critical |
| B | 3 | 7 | 3 | 7 | 0 | 0 | Critical |
| C | 3 | 5 | 5 | 7 | 2 | 2 | Near-critical |
| D | 7 | 12 | 7 | 12 | 0 | 0 | Critical |

Project duration 12 working days; critical path A → B → D. On real dates from Monday 2 November 2026 the API test
gets finish 17 November 2026 and the same floats; a public holiday on 9 November moves a dependent finish by a day.

### In the views

- Gantt: critical bars red with a flag icon, near-critical amber with a clock icon, others in their status colour;
  completed bars striped with a tick; milestones as diamonds; dependency lines for all four types with critical
  links emphasised; baseline overlay (grey outline); dashed outline where the forecast differs from the plan; zoom by
  day, week, month or quarter; schedule columns (ID, WBS, task, start, finish, duration, progress, owner,
  predecessors, float); subtasks expand and collapse; drag and resize where permitted; project finish, critical path
  duration and a legend. Colour is never the only signal.
- Table and Kanban: the key and a criticality badge on each task.
- Every view: the "Critical path" filter (critical, critical and near-critical, near-critical, non-critical, no
  dependencies, scheduling conflicts), shown once a project has dependencies.
- Task panel, Schedule tab: ID, WBS, criticality, floats, early and late dates, planned and actual dates, duration,
  predecessors and successors, baseline comparison, progress history and cost entries.
- Project controls > Critical path: the full schedule table (ID, WBS, early and late start and finish, duration, total
  and free float, predecessors and successors with type and lag, planned dates, status), filters, search, sorting,
  the critical paths, "Apply calculated dates", and charts of criticality and critical tasks by status.
- Project controls > Overview: people on critical tasks (each critical task counted once per assignee).

## Baselines

Project managers approve baselines (Project controls > Baselines): name, approved by, approval date, notes, and for a
revision the reason. Each records, per task: key, name, WBS, planned start and finish, duration, work, owners, planned
cost in the project currency, planned value curve, earning method, milestone flag and predecessors; plus the project
start and finish, budget at completion, calendar and settings. Baselines are numbered 0 (original), 1, 2, ...; each
revision points to the one it replaces. They are never changed or deleted (insert-only; a test checks that no code
updates them; there is no route to change one).

Comparison, against any baseline: start, finish and duration variance in working days, progress variance (percent
complete minus the percent planned by the status date), cost variance (current budget minus baseline budget), the
current forecast finish against the baseline finish and against the original. Example (API test): baseline 0 finish
13 November; the plan moved to 20 November; revised baseline 1 records the reason; the comparison shows a finish
variance of +5 working days against the original.

## Earned value management

Measured against the selected approved baseline at a status date (default today).

- BAC: the baseline budgets. PV: each task's budget spread over its baseline dates by its curve (linear, front-loaded,
  back-loaded, S-curve, all at start, all at finish, custom points, or milestone payments), in working time on the
  baseline's calendar.
- EV: budget × earned fraction by the task's earning method: percent complete, physical percent complete, weighted
  milestones, 0/100, 50/50, or units completed. Progress comes from the progress recorded on or before the status
  date (history is kept); today's values count for today only.
- AC: dated cost entries on or before the status date. With no dated entry, today's actual-cost column value is used
  for today only, and marked; for a past date it is unavailable. Estimates are never used as actual cost. Costs in
  another currency are not converted and are reported.

| Measure | Formula |
| --- | --- |
| CV | EV − AC |
| SV | EV − PV |
| CPI | EV / AC |
| SPI | EV / PV |
| EAC (current cost performance) | BAC / CPI |
| EAC (remaining work at budget) | AC + (BAC − EV) |
| EAC (cost and schedule performance) | AC + (BAC − EV) / (CPI × SPI) |
| ETC | EAC − AC |
| VAC | BAC − EAC |
| TCPI to BAC | (BAC − EV) / (BAC − AC) |
| TCPI to EAC | (BAC − EV) / (EAC − AC) |

Amounts are exact decimals; a ratio whose denominator is zero or missing is "unavailable" (never Infinity, NaN or a
made-up 0). CPI or SPI below 1.00 reads "over budget" or "behind plan", 1.00 "on", above 1.00 "better" or "ahead";
before a tenth of the budget is earned the screen warns that indices can swing.

Worked example (engine and API tests, AUD): BAC 100,000; one task, 10 working days, linear; status after 5 days, 40%
complete; costs 30,000 and 15,000 before the status date, 5,000 after.

| PV | EV | AC | CV | SV | CPI | SPI | EAC (CPI) | EAC (budget) | EAC (CPI × SPI) | ETC (CPI) | VAC (CPI) | TCPI (BAC) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50,000 | 40,000 | 45,000 | −5,000 | −10,000 | 0.8889 | 0.80 | 112,500 | 105,000 | 129,375 | 67,500 | −12,500 | 1.0909 |

The Earned value tab shows the 12 measures with their formulas, the forecast method in words, selectors for the
status date, baseline and category (a board group), and charts: PV, EV and AC over time; CPI and SPI over time;
budget against the three forecasts; planned against earned progress; the baseline's planned cost distribution; actual
cost by category. It creates a saved Earned value report (PDF, Excel, HTML, CSV).

## Project controls summary

Project controls > Overview answers, from calculated values only: are we on schedule (finish variance, SPI); on
budget (CPI, EAC against BAC); what delays completion (late critical tasks, or what the finish depends on); which
activities are critical; what work remains; the projected completion date; the forecast final cost; and which tasks
need intervention (conflicts, negative float, critical tasks past their planned finish). Upcoming milestones, delayed
tasks, people on critical tasks and schedule quality warnings complete it. Missing data reads "Unavailable".

## Reports

The existing report system gains optional sections L (schedule and critical path: task IDs and WBS, dependency
register, critical path, near-critical activities, float, planned against actual dates, milestones), M (baseline
comparison) and N (earned value and forecasts), and report types: project controls, critical path, baseline
comparison, earned value and project completion forecast. They use the same services as the screens; earned value
appears only for people allowed to see finances, and every earned value report names its baseline and status date.

## API

All under `/tasks/api`, all checked against the existing organisation, project and task permissions.

| Endpoint | Permission |
| --- | --- |
| `GET /boards/:id/schedule?statusDate=` | view the project |
| `PUT /boards/:id/schedule/settings` | manage the project |
| `GET`, `PUT`, `DELETE /boards/:id/schedule/calendar` | view; manage (organisation scope: organisation admin) |
| `GET`, `PATCH /items/:id/schedule` | view; edit the task |
| `POST /boards/:id/links`, `PATCH`, `DELETE /links/:id` | edit the project |
| `POST /boards/:id/schedule/apply` | edit the project |
| `GET`, `POST /boards/:id/baselines`, `GET /boards/:id/baselines/compare` | view (budgets need finance); approve: manage |
| `POST /items/:id/progress` | update the task's status |
| `POST /items/:id/costs` | edit finance on the task |
| `GET /boards/:id/evm?statusDate=&baseline=&group=` | view finance |
| `GET /boards/:id/controls` | view (earned value part needs finance) |

## Performance and reliability

The CPM engine is linear in tasks and links (Kahn ordering, one pass each way). Measured on Node 22: 500 tasks and
988 links 5 ms; 2,000 and 3,988: 27 ms; 5,000 and 9,988: 65 ms; 10,000 and 19,988: 187 ms. So the schedule is
recalculated on every request instead of in the background: results are never stale. Each result carries an inputs
fingerprint (`inputsVersion`) over every input (tasks, scheduling data, links, calendar, settings, status date); the
browser refetches the schedule whenever the board's tasks, groups or columns change. Indexes cover links by board and
successor, scheduling data, progress and costs by board and date, and task keys.

## Security

Every endpoint uses the existing permission checks: view to read; edit (or the task's own edit and status rights) to
change scheduling data, links and progress; manage for settings, calendars and baselines; finance rights for budgets,
costs and earned value (baseline budgets and cost variances are hidden without them). People outside the organisation
get 404. Audit events record schedule settings and calendar changes, task scheduling changes, link changes,
progress, costs, baseline approvals and applying calculated dates. The tests cover viewer, member and outsider
access.

## Deployment and migration

- Migrations 0008 (project controls) and 0009 (category descriptions) are additive: new columns and tables only.
- The work server copies the database before applying migrations (`pre-migration-backups/`), and the deploy workflow
  requests a volume snapshot.
- After deploying, the first load of each board gives its tasks keys; nothing else changes until people use the new
  features. Existing timeline and dependency data is used as it is.
- This release is published for review only: not merged and not deployed.

## Known limitations

- Resource calendars and resource levelling are not built: the workload view does not yet use criticality, and
  durations are not stretched by individual availability.
- Elapsed-time lags (calendar days regardless of working time) and percentage lags are not supported; lags are working
  time.
- The Chart view and Workload view were not extended; the charts of critical tasks by status, by person and critical
  path progress are in Project controls.
- Planned dates are days (the timeline column has no times); sub-day durations are kept and calculated in minutes but
  displayed as dates.
- Summary tasks cannot be linked (their subtasks can).
- Budgets in another currency than the project's are left out of baselines (no exchange rates are assumed).
- Earned value needs dated cost entries for history; today's actual cost column value counts for today only.
