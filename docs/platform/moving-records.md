# Moving tasks and CRM records to another project or company

Owner's request, 20 Nov 2026: "allow tasks and entries to move between companies as user may mistakenly entered to wrong
company or department ... and allow mass selection move between companies."

**Status:** Projects and Tasks and CRM records (contacts, leads, companies) are built behind the flag `move_records`,
which ships **off**. Nothing changes for anyone until a platform admin switches it on, with the owner's approval, in the
Control Centre (`/erp/admin/controls`). Both companies must have it on: the one a record is in and the one it goes to.
Deals and Finance entries do not move (below).

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
| `GET /tasks/api/crm/orgs/<org>/transfer/status` | Whether moving is on for the CRM's company |
| `GET /tasks/api/crm/orgs/<org>/transfer/targets` | The CRMs of the person's other companies where moving is on |
| `POST /tasks/api/crm/orgs/<org>/{contacts,leads,companies}/transfer/preview` | `{ ids, toOrgId }`: what would move and stay |
| `POST /tasks/api/crm/orgs/<org>/{contacts,leads,companies}/transfer` | The same body: the move, record by record |

## CRM records (contacts, leads, companies)

The owner's decision (20 Nov 2026, "continue" on the recommended rule): a record moves with what belongs to it; a record
linked to something only the old company holds stays where it is, with the reason (`src/worker/crm/transfer.ts`).

- **Where:** a CRM list's selection bar, **Move to another company**, for many; a record's **More actions**, **Move to
  another company...**, for one. One popup: the company (the CRMs of the person's other companies where moving is on and
  they may add that kind of record), **Check what moves**, **Move**.
- **What goes with it:** the record keeps its id; its notes, files, activities and timeline go with it. A company takes
  its contacts (deleted ones too, as they still point at it). A contact takes the lead it was converted from.
- **What carries:** tags by name (where the new CRM has the tag), custom fields by label and type, statuses and activity
  types by key, then by name (else the new CRM's first). The owner stays if they work in the new CRM, else the person
  moving becomes the owner. A contact's or lead's company that stays: the new CRM's company of the same name, else
  none. Activities assigned to someone outside the new CRM are unassigned there. What does not carry is listed first,
  and the whole records as they were are kept in the old CRM's audit trail (`records.moved_out`, append only).
- **What stays (the record is refused, with the reason):** a record on a deal (deals stay with the company that made
  them), with activities on a deal, on an ERP sales order or linked to a Finance customer of the old company; a lead
  converted into a contact on its own (move the contact, the lead goes with it); a record the person may not delete in
  the old CRM. People who may not add that kind of record in the new CRM are refused.
- **Safety:** each record's move is one batch with foreign keys checked at its end, so a record and everything pointing
  at it change organisation together or not at all. The CRM's timeline in the new company says "Moved from another
  company". At most 100 records per move; 30 moves per person per 10 minutes.

## Not moved

- **Deals** stay with the company that made them (with their contacts and company, see above).
- **Finance entries** are never moved: a posted entry stays in its ledger. The way to correct one entered in the wrong
  business is to reverse it there and enter it again in the right one.
- **Department fields** on Maintenance, Procurement and WHS records are changed by editing the record, as today.

## Tests

`apps/work/test/transfer.test.ts`: off until both companies have the flag; one task with subtasks, comments, time and
history, its new key and both projects' records; many at once to another company with people who cannot follow listed;
viewers, other people's projects and company-limited API tokens refused; financial data only with the rights; the
column matching and value carrying rules. `apps/work/test/crm-transfer.test.ts`: off until both companies have the flag;
a company with its contacts, notes, activities, tags and custom fields, its audit records and no broken foreign key;
records on a deal and converted leads on their own stay, a contact takes its lead; people who may not add records there
and records of another CRM refused; the option and custom field mapping.
