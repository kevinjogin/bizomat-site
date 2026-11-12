# Email templates

All templates are in `apps/work/src/worker/services/email/templates.ts`. Each message has a responsive HTML part
(tables and inline styles, 600 px wide, no images so nothing is blocked; navy header with the BIZOMAT wordmark, a teal
button with the plain address under it) and a plain-text part with the same content. Everything people wrote (names,
task titles, descriptions, comments) is escaped. Every message ends with why it was sent, a link to the notification
settings (where applicable), the contact page, the slogan "Connecting Intelligence. Empowering Progress." and
"© <year> BIZOMAT. All rights reserved."

| # | Template | Sent when | Default | Subject |
| --- | --- | --- | --- | --- |
| 1 | `invitation` | Someone is invited (and on each resend) | always | You've been invited to join an organisation on BIZOMAT |
| 2 | `invitation_accepted` | An invitation you sent is accepted | on | <person> joined <organisation> |
| 3 | `project_assignment` | You are given access to a project | on | You have been added to the project <project> |
| 4 | `task_assignment` | You are assigned a task | on | New task assigned to you – <task> |
| 5 | `task_reassignment` | A task is reassigned to you from someone else | on | Task reassigned to you – <task> |
| 6 | `due_reminder` | A task assigned to you is due today or tomorrow | on | Due soon – <task> |
| 7 | `overdue` | A task assigned to you is past due (once per due date) | on | Overdue – <task> |
| 8 | `status_update` | The status of a task assigned to you changes | off | Status changed – <task>: <status> |
| 9 | `comment_mention` | You are mentioned, or someone comments or replies on your task | mention on, comment and reply off | <person> mentioned you on <task> |
| 10 | `project_membership` | Your project access or organisation membership changes, or a task is shared with you | on | Your access to <project> changed |
| 11 | `permission_change` | Your role or permissions change | on | Your permissions on <project> changed |
| 12 | `report_generated` | A report is generated on a project you manage | off | Report ready – <project>: <report> |
| | `test` | An administrator sends a test to themselves | | BIZOMAT test email |
| | `notification` | Any other notification type | | The notification's title |

"Default" is the email setting for people who never changed it; each person changes it per type in Settings >
Notifications. Invitations go to people who are not members yet, so they are always sent (when email is configured).

## Content

- **Invitation**: organisation, who invited, role, access given (project or task), expiry date and time (UTC), the
  personal message, the Accept invitation button and link, instructions for existing users (sign in, then accept) and
  new users (create an account with this address), that the link works once for this address only, and the contact
  page.
- **Task assignment and reassignment**: organisation, project, task, description (first 1,200 characters), priority,
  due date, status, assigned by (and previously assigned to, for a reassignment), a link that opens the task (on its
  board for project members, on its own for task-only access), and the actions this person may take on it (view,
  edit, update status, comment, upload, change assignments), worked out from their own permissions.
- **Reminders**: the same task details with the due date.

## Delivery rules

Idempotency keys: `invite:<invitation>:<send number>` (each resend is a new message with a new link),
`notify:<notification row or de-duplication key>` (one email per notification), `member-removed:...`, `test:...`.
Priority: invitations and tests are sent first and may use the reserve above the daily limit. See
[brevo-setup.md](brevo-setup.md) for limits, retries, suppression and webhooks.
