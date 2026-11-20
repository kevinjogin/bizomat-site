# Moving tasks to another project or company

Owner's request, 20 Nov 2026: "allow tasks and entries to move between companies as user may mistakenly entered to wrong
company or department ... and allow mass selection move between companies."

**Status:** Projects and Tasks is built behind the flag `move_records`, which ships **off**. Nothing changes for anyone
until a platform admin switches it on, with the owner's approval, in the Control Centre (`/erp/admin/controls`). Both
companies must have it on: the one a task is in and the one it goes to. CRM records are the next step (below).

## What a person sees

- In a project, a task's menu (in the table, on the board view's card menu and in the task panel) has **Move to another
  project...**. Selecting several tasks shows **Move to another project** in the selection bar.
- One popup: the company (this company first, then the other companies the person works in where moving is on), the
  project and the group. **Check what moves** lists each task, its subtasks, and any value that will not carry over, with
  the reason. **Move** then moves them. Tasks that cannot move stay where they are and are listed with the reason.
- In a department's project by mistake: move the task to the right department's project in the same company.

## What moves with a task

The task keeps its id (links to it keep working) and gets a new key from the new project's counter; the old key stays in
its history. With it go its subtasks, comments and replies, files (task and comment files), time entries, schedule,
progress and cost records and its history. Dependency links between tasks moved together go with them; links to tasks
that stay are removed, in both directions. Grants on the single task (task access) belong to the old project and are
removed. People who cannot open the new place lose the task from their planner, favourites and recent list. A document
linked to the task stays in its workspace and is unlinked when the task leaves the workspace. A CRM activity's task link
and a CAD design review task follow within the same company and are unlinked when the task goes to another company.
Automations of the new project do not run on a task that arrives; nobody is notified.

## How values carry over

Column by column (`services/item-transfer.ts`, `matchColumns` and `carryValue`):

| Column | Carried when |
| --- | --- |
| Any | the new project has a column of the same type and title, else the only column of that type on both sides |
| Status, priority, dropdown | the new column has a label of the same name (any case) |
| People | the person may open the new project, and the person moving may assign people there |
| Dependencies | the task it depends on is moved in the same move |
| Amounts (currency) | both columns are in the same currency (or one has none set) |
| Formula, created, updated, calculated progress | never: worked out again in the new project |

A value that cannot carry over is listed before the move, recorded on the task's history (`item_transferred`), and kept
whole in the audit trail (`task.moved_out`, append only, with every value as it was).

## Who may move

- On the project the task is in: edit access and the right to take tasks out of it (`deleteTasks`, which editors have).
- On the new project: the right to add tasks (`createTasks`). Assigning people needs `assignTasks` there; without it the
  people are not carried over (listed).
- A task with financial data (a value in a financial column, or a cost record) moves only for someone who may see
  financial data in the old project and change it in the new one; otherwise it stays, with the reason. Financial data is
  never stripped from a task to let it move.
- Where a company's member rules act (`company_members_v2`), both companies' rules apply: no suspended access, the
  Projects and Tasks module allowed, a role that may change records; a role that cannot delete records may move only
  tasks the person created.
- The example company's invented data stays in it, and nothing moves into it from another company.
- An API token limited to one company may move tasks only within that company.
- At most 200 tasks per move (each with its subtasks); 30 moves per person per 10 minutes.

## API

| Method and path | What |
| --- | --- |
| `GET /tasks/api/transfer/status?from=<board>` | Whether moving is on for the project's company |
| `GET /tasks/api/transfer/targets?from=<board>` | The companies, projects and groups the person may move to |
| `POST /tasks/api/boards/<board>/items/transfer/preview` | `{ itemIds, toBoardId, toGroupId? }`: what would move and what would not, changing nothing |
| `POST /tasks/api/boards/<board>/items/transfer` | The same body: the move. Answers each task's result and its new key |

## Not in this change (next)

- **CRM records** (contacts, leads, companies, deals) between CRM organisations: planned. Deals need their pipeline and
  stage matched, their products and contacts, and a company linked to Finance or to ERP sales orders must stay with the
  company that invoiced it.
- **Finance entries** are never moved: a posted entry stays in its ledger. The way to correct one entered in the wrong
  business is to reverse it there and enter it again in the right one.
- **Department fields** on Maintenance, Procurement and WHS records are changed by editing the record, as today.

## Tests

`apps/work/test/transfer.test.ts`: off until both companies have the flag; one task with subtasks, comments, time and
history, its new key and both projects' records; many at once to another company with people who cannot follow listed;
viewers, other people's projects and company-limited API tokens refused; financial data only with the rights; the
column matching and value carrying rules.
