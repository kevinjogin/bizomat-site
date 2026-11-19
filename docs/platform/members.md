# Company members, roles and ownership transfer

Owner's brief of 19 Nov 2026 ("BIZOMAT – Company members, roles and ownership transfer"). Audit approved the same day,
with the owner's order of work: Members and Permissions first, then CAD Automation in the ERP. Everything here acts
only for a company where the flag `company_members_v2` is on (off by default; scopes: everyone, a rollout stage or one
company). With the flag off, every screen and rule is as it was.

Code: `apps/work/src/worker/company/members-access.ts` (the central permission service), `members-gate.ts` (applies it
to every request), `members-routes.ts` (the Members API), `apps/work/src/client/company/Members.tsx` (the page),
migration `0036_members.sql` (additive; reverse script in `migrations-reverse/`). Tests:
`apps/work/test/members.test.ts` (the brief's tests 1 to 13).

## The rule

A request must pass **both** the central service and the module's own rules (audit decision C4): job roles in the ERP,
Maintenance and Health and Safety; tool roles in Projects, Sales and CRM, and Finance. The central service never
widens access. Owner and administrators always have every module, every record and every field.

The Stage 1 tables are reused: `co_members` (role, and now status, sensitive fields and last activity),
`co_invitations` (now modules, scope and a personal message), `co_audit` (the company's activity) and `audit_log`
(the platform's). New tables: `co_member_access` (module and scope per member), `co_ownership_transfers` and
`co_member_notices` (in-app notices).

## The permission matrix (final)

| What | Owner | Admin | Manager | Employee | Read-only |
| --- | :-: | :-: | :-: | :-: | :-: |
| View company data (allowed modules) | Yes | Yes | Yes | Yes | Yes |
| Create and edit records | Yes | Yes | Yes | Own records | No |
| Delete records (and void) | Yes | Yes | Yes | No | No |
| Approve (approve, reject, release, decide, disposition, verify) | Yes | Yes | Yes | No | No |
| Export data (CSV and spreadsheet answers) | Yes | Yes | Yes | No | No |
| View sensitive fields | Yes | Yes | If given | No | No |
| Invite members | Yes | Yes | No | No | No |
| Manage managers, employees and read-only members | Yes | Yes | No | No | No |
| Grant or revoke the administrator role | Yes | No | No | No | No |
| Company settings and legal details | Yes | Yes | No | No | No |
| Transfer ownership | Yes | No | No | No | No |
| Delete or close the company | Yes | No | No | No | No |
| Records seen by default | All | All | All | Own | All |

The matrix is configuration (`ROLE_MATRIX` in `members-access.ts`) and the Roles & Access tab shows exactly it. Custom
roles are planned for a later stage.

Exceptions, on purpose: anyone in the company may report a hazard or an incident, or ask for maintenance, whatever their
role (safety reporting is never blocked). Personal settings inside a module (saved views, preferences, read marks) are
anyone's own.

## Modules (brief 1.2, audit decision C3)

Projects and Tasks, Sales and CRM, Finance and Accounting, Products and Engineering, Procurement, Inventory,
Manufacturing, Quality, Sales orders and logistics (supply chain), Maintenance, Health and Safety, Reports. The brief's
"Sales" and "Logistics" are the supply chain module; there is no Notes module. A module a member has no access to
answers 403 `MODULE_ACCESS` on every address of it.

## Record scope (brief 1.3)

All, team or own, per member and module. Team: everyone who shares a department with the person.

- **Sales and CRM, Finance:** the scope limits what is seen and changed (lists and single records: another person's
  record answers 404). It narrows the tool's own record scopes, never widens them.
- **The ERP modules, Maintenance and Health and Safety:** records are worked on by job role (a buyer, an operator, an inspector), so the scope limits
  changes and deletion to records the person (or their team) created, and seeing follows the job role (audit decision
  C1).

## Sensitive fields (brief 1.4)

One registry (`SENSITIVE_KEY` and `SENSITIVE_HEADING` in `members-access.ts`): costs (unit, standard, purchase,
current, replacement, outsourcing, freight), margins and profit, labour, machine, overhead and hourly rates, stock
values, salaries and wages, bank names, numbers, BSBs and account numbers, tax file numbers. Selling prices and deal
values are not sensitive; identifiers (a bank account's id) are never removed. For anyone who may not see them they are
removed from every JSON answer of a company module and every CSV export (by column heading), on the server.

Not yet: global search across companies and email notifications do not pass through the registry (search shows titles
and numbers, not costs; notification emails carry no amounts).

## Members page (brief Part 4)

Company area, People (also `/members`): tabs **Members** (search, filters by role, status and module, sort, pages; change
role, access, suspend or reactivate, remove, transfer ownership, remind to confirm an email; leave the company),
**Invitations** (one, many or a CSV file; role, modules and scope, a personal message; resend and revoke),
**Roles & Access** (the matrix) and **Activity** (who did what to whom, with old and new values). Only what the server
allows is shown.

## API (`/api/company/...`)

| Method and path | Who | What |
| --- | --- | --- |
| `GET c/:company/team` | any member | Members, with `q`, `role`, `status`, `module`, `sort` (role, name, joined, active), `page`, `pageSize` |
| `GET c/:company/team/roles` | any member | The matrix, modules and scopes |
| `PATCH c/:company/team/:userId/role` | owner, admin | `{ role }`; the tools' roles follow the role's preset |
| `PUT c/:company/team/:userId/access` | owner, admin | `{ modules: { key: { access, scope } }, sensitive? }` (sensitive: managers only) |
| `POST c/:company/team/:userId/suspend`, `.../reactivate` | owner, admin | `{ reason }`; tokens for the company end at once |
| `GET c/:company/team/:userId/open-items` | owner, admin | Open deals, leads, activities, work orders and safety actions |
| `POST c/:company/team/:userId/remove` | owner, admin | `{ reassignTo }` (a member, or null to leave them unassigned) |
| `POST c/:company/team/:userId/verification-reminder` | owner, admin | Once a day per person |
| `GET c/:company/team/activity` | owner, admin | 50 events a page |
| `POST c/:company/team/invitations` | owner, admin | `{ emails[1..100], role, modules?, sensitive?, message?, title? }`; per address: sent, invalid, already a member, already invited, over the limit |
| `POST c/:company/team/invitations/:id/resend` | owner, admin | A new link (the old one stops) and a new expiry |
| `GET`, `POST`, `DELETE c/:company/team/transfer` | see below | The pending transfer; ask; cancel |
| `GET transfers/mine`, `POST transfers/:id/accept`, `.../decline` | the person asked | Answer a transfer |
| `GET notices`, `POST notices/read` | anyone | Their in-app notices about their memberships |
| `POST /api/admin/platform/members/companies/:id/force-transfer` | platform admin, two-factor and a fresh password and code | `{ toUserId, reason (10+), evidence (3+), oldOwnerRole }` |

Refusals carry a code: `MEMBERS_V2_OFF` (404), `SELF_CHANGE`, `OWNER_PROTECTED`, `ADMIN_PROTECTED`, `ROLE_FORBIDS`
(with the capability), `READ_ONLY`, `MODULE_ACCESS`, `SCOPE`, `MEMBER_SUSPENDED`, `INVITE_LIMIT`, `REAUTH_INVALID`,
`NAME_MISMATCH`, `EMAIL_UNVERIFIED`, `TARGET_READ_ONLY`, `TARGET_SUSPENDED`, `TRANSFER_PENDING`, `TRANSFER_CLOSED`,
`TRANSFER_STALE`, `USE_TRANSFER_REQUEST`.

## Anti-escalation (brief 1.5)

Nobody changes their own role or access. Only the owner touches an administrator or makes one. Nobody changes,
suspends or removes the owner. Exactly one owner: a unique index in the database and the API. Changes act at once: the
service reads the database on every request (there is no permission cache), and realtime connections check again at
every event.

## Invitations (brief 4.2)

Single use, the token stored as a hash, bound to the invited address, 7 days once the flag is on (company setting
`invitation_days`, 1 to 30; 14 before), revocable and resendable. At most 30 invitations an hour and 100 a day per
company. An invitation sets the role, modules, scope and sensitive fields the person gets when they accept, and can
carry a personal message (in the email). New people sign up and join; existing people find the company in their list.

## Suspension and removal (brief Part 5)

Suspension: the person reaches nothing of that company but leaving it (403 `MEMBER_SUSPENDED`), their API tokens for
the company end, and their other companies are untouched. Removal (with or without the flag): access ends at once, API
tokens limited to the company are revoked, and their ERP and Maintenance roles are cleared, so being added again never
brings them back. Their records stay with the company. Before removal the page offers to give their open items (CRM
deals, leads and activities, Maintenance work orders, safety actions) to another member. Projects items are not
reassigned yet.

## Ownership transfer (brief Parts 2 and 3)

The owner picks an active member with a confirmed email (not read-only, not suspended), confirms with their password
and a code when they use two-factor sign-in, types the company's name, and chooses their own role afterwards
(administrator by default). The member gets an in-app notice and an email and must accept within 7 days (company setting
`transfer_days`). The owner can cancel until then. One pending transfer at a time (a unique index). On acceptance one
batch (one transaction) makes the new owner the owner of the company and every tool, sets the old owner's role, and
writes the audit; both people and every administrator are told. Who created each record does not change. With the
flag on, the earlier immediate transfer answers 409 `USE_TRANSFER_REQUEST`.

A platform admin can force a transfer for a recovery case (owner unreachable, left the business, deceased) with a
reason and evidence, after two-factor sign-in and a fresh password and code; it is recorded in the company's and the
platform's audit, and everyone concerned is told.

## Notifications (brief Part 6)

In the app (`co_member_notices`, on the company list and Members page) and by email through the outbox where email is
set up: role change, access change, suspension, reactivation, removal, ownership transfer request, acceptance,
cancellation, decline and forced transfer, and the email confirmation reminder. Invitations go by email as before, with
the personal message.

## Free

No seat limits and no paid-member prompts. The seat-count hook (`billing/seats.ts`, `requestSeatSync`) still runs after
membership changes and does nothing while billing is locked.

## Admin instructions

1. Deploy (the flag is off: nothing changes).
2. In the Control Centre, switch `company_members_v2` on for one company (company scope), with a reason.
3. In that company: People shows the Members page. Check the list, invite someone, set their modules, try an employee's
   access in Sales and CRM, and a transfer request and its cancellation.
4. Widen to the pilot stage, then everyone. To go back: switch the flag off (nothing is lost; the extra columns and
   tables are kept and ignored).

## Not built yet

- Projects and Tasks: own and team scope do not limit anything there yet (board membership and the tool role decide;
  the role rules for read-only members and employees do apply), and Projects items are not offered for reassignment on
  removal.
- Health and Safety keeps its confidential scopes; the central scope limits only changes there.
- Search and notification emails are outside the sensitive-field registry (see above).
- Custom roles (a later stage).
