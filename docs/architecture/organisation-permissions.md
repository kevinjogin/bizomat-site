# Organisations, roles and permissions

An organisation is a workspace; a project is a board. Every rule below is enforced by the API
(`apps/work/src/worker/services/access.ts`, `services/permissions.ts`; the rules themselves in
`src/shared/permissions.ts`). The interface only hides what the API would refuse anyway. Anything a person may not
see answers **404** (its existence is not revealed); anything they may see but not do answers **403**.

## Organisation roles

| Role | Can |
| --- | --- |
| Owner | Everything: organisation settings, members and roles (including owners), finance settings, email settings, every project, every report. At least one active owner always remains |
| Admin | Members and roles (not owners), invitations of any role but owner, settings, every project with full access, reports. Cannot be restricted on any project |
| Project manager | Create projects; manage the projects where they are a manager; invite members, viewers and guests; generate reports on projects they can edit |
| Member | Work on the organisation's shared projects (edit, create, assign, delete tasks by default); private projects only when added |
| Viewer | Read and comment on the organisation's shared projects |
| Guest / contractor | Nothing organisation-wide: no shared projects, documents, dashboards, goals, templates, teams or member list. Only projects or tasks shared with them explicitly |

A person can be in several organisations with a different role in each. A **suspended** membership keeps the account,
history and grants but counts as no membership: the organisation disappears from their list and every request answers
404. Restoring it gives everything back.

## Project access (per person, per project)

Level, in order of precedence:

1. Organisation owners and admins: always **Manage**; they cannot be restricted.
2. **No access** set for this person on this project: no access (404).
3. A project role set for the person (`board_members`: manager, editor, viewer): **Manage**, **Edit** or **View**.
4. Otherwise from the organisation role and the project's visibility: shared projects give members and project
   managers **Edit** and viewers **View**; private projects and guests give nothing.

Capabilities, with their defaults by level (each can be switched on or off per person, `board_permissions`):

| Capability | View | Edit | Manage | Notes |
| --- | --- | --- | --- | --- |
| View financial data | by organisation finance setting | by setting | yes | Setting: everyone (default, as before), editors, or managers only |
| Edit financial data | no | if finance visible | yes | Needs edit level and finance visibility |
| Manage project members | no | no | yes | Can be granted to an editor |
| Create tasks | no | yes | yes | Needs edit level |
| Assign tasks | no | yes | yes | Needs edit level |
| Delete tasks | no | yes | yes | Needs edit level |
| Generate reports | no | project managers only | yes | Can be granted to anyone with access |

Against privilege escalation: nobody changes their own project access (except owners and admins, who have full
access anyway); nobody gives a level above their own or a capability they do not have; organisation roles are changed
by admins only, owner by owners only; nobody raises their own organisation role; the last owner cannot be demoted,
suspended or removed.

## Task access (one task without its project)

`item_permissions` gives a person rights on one task and its subitems: **edit task**, **update status**, **add
comments**, **upload attachments**, **manage assignments**, **view task finances**. They see the task on its own page
(`/w/<org>/tasks/<task>`) and under My Work, "Shared with me". They do not see the board, its other tasks, the
organisation's projects or member list. Task access is given by people who manage the project's members or assign its
tasks, never above their own rights (no finance sharing without finance access). A guest invitation can carry access
to one task, given when the invitation is accepted.

Example: a contractor invited as a guest with access to one machine-maintenance task can update its status, comment
and upload photos, and gets 404 on everything else. An engineer can have Edit on project A and View on project B.

## Assigning tasks

The owner picker lists organisation members with their email, role and access to the task. A person can only be
assigned a task they can open (project access or task access); otherwise the API answers 422 with "Give this person
access to the project or the task before assigning it to them". A manager can share the task and assign it in one
step from the picker, or invite someone new.

## Financial data

Financial columns (every currency column, and number columns marked as money) are removed from every response for
people without finance access: the board, the task, task activity (the change is listed, the values are not), My
Work, search (before any filter runs), dashboards and charts, reports and report history. Editing them needs the edit
right.

## Invitations

1. An administrator (or a project manager, or a member when the organisation allows it) enters an email, a role and
   optionally a message and project or task access.
2. A random 32-byte token is created; only its SHA-256 is stored.
3. The invitation email is queued (Brevo); the link is also shown to the inviter when email is not configured.
4. The recipient opens `/invite/<token>`: existing users sign in, new users create an account (the token is passed
   with the sign-up).
5. The signed-in email must be the invited address. The invitation is claimed atomically (single use) and the
   membership created (no duplicate; an existing membership is left as it is). Grants are applied.
6. The person lands in the organisation (or on the shared task). The inviter is notified (in-app and email).

Rules: 7 days by default; one pending invitation per address (a new one replaces the old); **resend** issues a new
token (the previous link stops working) and a fresh 7 days, at most 5 times a day and once a minute; **revoke** at
any time; rate limits of 50 invitations per person per hour and 200 per organisation per day. Knowing an organisation's
address or that an email was invited never grants access: sign-up and sign-in no longer accept invitations by email
address.

## API

| Method and path | Who |
| --- | --- |
| `GET /api/workspaces/:ws/members` | members (guests: people on what is shared with them) |
| `GET /api/workspaces/:ws/members/directory` | admins: status, projects, task grants, inviter |
| `PATCH /api/workspaces/:ws/members/:user` | admins (`role`) |
| `POST /api/workspaces/:ws/members/:user/suspend` | admins (`suspended: true/false`) |
| `DELETE /api/workspaces/:ws/members/:user` | admins, or the member leaving |
| `GET/POST /api/workspaces/:ws/invitations` | admins (list); inviters (create: `email`, `role`, `message`, `grants`) |
| `POST /api/workspaces/:ws/invitations/:id/resend`, `DELETE .../:id` | admins |
| `GET /api/auth/invitations/:token`, `POST .../accept` | the invitation page |
| `GET /api/me/invitations` | pending invitations to my address |
| `GET /api/boards/:id/access`, `PUT /api/boards/:id/access/:user` | manage members on the project (`level`: default, none, view, edit, manage; `overrides`) |
| `PATCH /api/boards/:id/project` | managers (`currency`, `startDate`, `managerId`) |
| `GET /api/items/:id/access`, `PUT/DELETE /api/items/:id/access/:user` | manage members or assign tasks on the project |
| `GET /api/items/:id/assignable` | anyone who sees the task (the owner picker) |
| `GET /api/items/:id/context` | the standalone task page |
| `GET /api/workspaces/:ws/shared-tasks` | my task grants |
| `GET /api/workspaces/:ws/audit-events` | admins: the permanent audit trail by date and type |

## Audit trail

`audit_events` records, with actor, organisation, project, task, time, values before and after, and metadata: task
created, modified, completed, reopened, status, priority and due date changes, owner assigned and removed, financial
values changed, moved, archived, restored, deleted; project created, modified, currency changed, membership changed;
invitations sent, resent, accepted, revoked; permission changes and revocations; members suspended, restored, removed
or leaving; finance settings and column changes; reports generated and downloaded. The application only inserts into
it (no route updates or deletes a row) and it has no foreign keys, so it outlives what it describes. It is indexed by
organisation, project, task and type with time. The existing `activity_log` (task history since the first version)
and `audit_log` (sign-in and settings) are unchanged.
