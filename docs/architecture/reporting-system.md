# Project reporting

Every project board has a **Reports** button (toolbar: Members, Activity, Automate, Finance, Reports) for people
allowed to generate reports on it. It opens a report builder with a live preview, commentary fields, saved versions
and downloads. Code: `apps/work/src/worker/services/reports/` (build, HTML, PDF, Excel and CSV), routes in
`src/worker/routes/reports.ts`, interface `src/client/board/ReportsDialog.tsx`, definitions `src/shared/reports.ts`.

## Report types

| Type | Period |
| --- | --- |
| Project inception to date | Project start date (or the board's creation day) to today |
| Previous month | The whole previous calendar month |
| Current month to date | The first of this month to today |
| Custom date range | Any start and end date |
| Monthly progress report | A chosen month (default: last month) |
| Project completion report | Inception to today, focused on completion, remaining work and finance |
| Financial report | Inception to today: cover, summary and finances |
| Outstanding tasks report | Inception to today: current and remaining work, risks, next period |

Dates are calendar dates in the person's time zone (their profile setting), shown on the report.

Options: project (any project the person can report on in the organisation), statuses and owners listed (totals
always count every task), include finances, activity history, risks and issues, upcoming work, and each section on
or off. Commentary: overall status in the manager's judgement, executive summary, achievements, problems, decisions
required, next priorities, resource requirements, and a classification label (for example "Confidential") on every
page.

## Sections (CEO report structure)

A. Cover (organisation, project, project manager, start date, period, generated date and by whom, version,
classification). B. Executive summary (calculated status with its rule, completion, achievements = tasks recorded as
completed, developments, problems, decisions required = tasks awaiting approval or review). C. Overview (totals by
state, chart, milestones). D. Activities in the period (completed, started, new, reassigned, reopened, milestones
achieved, comments). E. Current activities (in progress, blocked or awaiting approval at the end of the period, with
descriptions, owners, due dates, priority). F. Remaining work (outstanding, overdue, blocked, pending approvals,
carried forward, unassigned). G. Risks and issues (a recorded register when the board has a Risks or Issues group or
tag; otherwise derived from blocked, overdue, waiting and approval states; suggested actions are a fixed rule and
labelled as such). H. Financial summary (per currency: approved budget, estimated cost (estimate), actual cost
(actual), committed, remaining budget, variance, utilisation; by column, group and task; financial changes in the
period). I. Next period plan (open tasks due or starting in the next month, milestones, critical and high priority
tasks, open tasks per person). J. Activity timeline (status, owner and date changes, created and deleted tasks,
membership changes, reports, oldest first).

## How past states are known

`activity_log` has recorded every change to a task's columns, with the value before and after, since the application's
first version. A task's value at a moment T is its current value with every recorded change after T undone, newest
first. So a monthly report shows the status each task had at the start and end of that month, not today's. From
that:

- **Completed in the period**: a recorded change into a done status within the period, or created done in it.
- **Started**: a change from not started to in progress, blocked or awaiting approval.
- **Still active at the end**: not done at the end of the period.
- **Carried forward**: existed before the period, not done just before it began, not done at its end.
- **New**: created in the period. **Overdue**: open at the end with a due date before the end.
- Status classes come from the labels: a label marked done; "Stuck/Blocked/On hold"; "Approval/Review/Pending";
  "Not started/To do/Backlog"; the rest in progress.

The overall status is a stated rule on recorded data: Complete when every task is done; Off track when more than 25%
of open tasks are overdue or more than 20% blocked; At risk when any is overdue or blocked; otherwise On track. The
manager's own assessment is shown beside it, labelled as judgement.

## Accuracy rules

- Nothing is invented: achievements are task names recorded as completed; figures are counts and sums of recorded
  values; risks are recorded or derived from task states; suggested actions are labelled as rule-based.
- Commentary is printed in a separate, labelled block ("Management commentary, entered by <name>, not derived from
  recorded data").
- Every report says from when reliable history is available, and notes what is missing: no recorded change since the
  tasks were created, history starting after the board was created, a status column whose type was changed, deleted
  columns, deleted or archived tasks, lists cut at 500 tasks.
- Estimates and actual figures are labelled; amounts in different currencies are never added together.

## Exports and history

| Format | What |
| --- | --- |
| PDF | A4, white pages, navy headings, cover page, KPI tiles, status chart, tables that repeat their header, "Page n of N", project and period, generated date and classification on every page. Standard Helvetica fonts: characters outside Western European text are replaced in the PDF only |
| Excel | Sheets Summary, Tasks, Completed, Outstanding, Risks, Finance, Timeline; frozen header rows; amounts as numbers with the currency in its own column |
| HTML | The same page as the preview, self-contained, print rules for A4 |
| CSV | The task list (UTF-8 with BOM; cells starting with `= + - @` are prefixed so spreadsheets do not run them) |

**Preview** builds the report without saving it and shows the exact HTML page. **Save** builds it once more, writes a
snapshot of the report data and all four files to storage (`reports/<org>/<project>/<report>/...` in the files
store), records SHA-256 checksums, and adds a row to `reports` with organisation, project, period, type, version
(per project, 1, 2, 3...), sections, options, who and when, and file references. Downloads are served from those
stored files, so a saved report never changes when the project does (tested byte for byte).

## Access

Preview, save, history and downloads need the **Generate reports** capability on the project (organisation owners and
admins have it; project managers on projects they can edit; others when granted). Reports that contain financial data
are listed and downloadable only for people who may see the project's finances; a report generated by someone without
finance access never contains them. Saving notifies the project's managers (in-app; email if they switch it on), and
records `report.generated` (and `report.downloaded` on each download) in the audit trail.

## API

| Method and path | |
| --- | --- |
| `POST /api/boards/:id/reports/preview` | Build without saving: `{ report, html }` |
| `POST /api/boards/:id/reports` | Save: `{ id, version, files }` |
| `GET /api/boards/:id/reports` | History |
| `GET /api/reports/:id` | One saved report and its HTML |
| `GET /api/reports/:id/download/:format` | `pdf`, `xlsx`, `html` or `csv`, with `X-Report-SHA256` |
