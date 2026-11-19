# Existing users, the company rule, exports and deletion (Stage 1, R7)

Every capability here ships switched off, and every step that affects people is a dry run first. Code:
`apps/work/src/worker/compliance/` (`core.ts` classification, notices, deadlines, suspension and the gate; `export.ts`;
`deletion.ts`; `routes.ts`), `apps/work/src/worker/routes/password-reset.ts`; migration `0034_compliance.sql` (reverse
in `apps/work/migrations-reverse/`); tests `apps/work/test/compliance.test.ts`.

## Flags, in the order to switch them on

| Flag | What it does |
| --- | --- |
| `company_registration_required` | The company rule applies: people in no registered company follow the individual accounts policy. Off: nothing changes for anyone, whatever the policy says |
| `individual_accounts_policy` | `ALLOW_PERSONAL_WORKSPACE` (default): a personal workspace, labelled "Unverified – Personal", that cannot invite anyone. `INVITATION_ONLY`: sign in only to register a company or accept an invitation. `REQUIRE_COMPANY`: deadline, suspension and deletion |
| `migration_notifications` | Sending an approved list of notices |
| `compliance_countdown` | Deadlines start, only after a notice was delivered or displayed; reminders |
| `auto_suspension` | Accounts are suspended after their deadline |
| `legal_review_completed` | Set only by recording the privacy and legal review |
| `auto_deletion` | Final warnings and deletion of approved batches; refused until a legal review is recorded |
| `self_service_password_reset` | "Forgot your password?" on the sign-in page (audit S6) |

Exempt people (testers, partners, staff; a reason and an optional end date) and platform admins are never notified,
suspended or deleted.

## Classification (brief 7.1)

Control Centre, "Existing users and the company rule": active accounts; owners, administrators and other members;
people in several companies; registered companies not verified; people in no company, with how many have a pending
invitation and how many have tools of their own; exempt people, platform admins and suspended accounts; the policy.
Counts only, so the policy can be decided before anything is enforced.

## Notices (brief 7.2)

1. "Who would be told (dry run)" lists the people: active, not exempt, not platform admins, in no registered company,
   not told before. The list and the exact text are shown for review. Each group gets its own text; people without a
   business are not sent the company owner's text.
2. The founder approves the list, after a fresh password and code.
3. With `migration_notifications` on, "Send" emails each person and puts the notice in their ERP. Each email and each
   display is recorded per person.

## Deadlines, reminders and suspension (brief 7.3 and 7.4)

- With `compliance_countdown` on, a person's deadline starts at the first recorded delivery or display of their notice,
  never before: 7 days by default, with reminders on days 3, 5 and 6 (settings, founder). Stored in UTC, shown in the
  person's own time.
- Extensions for one person, one company or everyone, each with a reason.
- With `auto_suspension` on, an account still in no company after its deadline is suspended and told by email. It can
  still sign in, register a company, accept an invitation, contact support and export its data. Registering or
  joining a company restores access at once.

## Data export (brief 7.6)

- Every person can export their data at any time (Settings, Security, "Export your data"): profile, sign-in methods,
  sessions, notification settings, notifications, their own activity, and the records they made in tools of personal
  companies and of registered companies that allow it (company setting `export.personal_records`, off unless set).
- A company's owner and administrators can export the company (Company settings): every company table, the Projects,
  CRM and Finance tools, and attached files up to 50 MB per export (the rest are listed).
- JSON and CSV per module in a ZIP. Built by the 15-minute run, then downloadable for 7 days, only signed in as the
  person who asked. Asking, building and downloading are each in the audit log. Passwords, hashes, secrets and tokens
  are never exported.

## Deletion (brief 7.5 and 7.6)

1. **Legal review first.** `auto_deletion` is refused until the founder records the review: reviewer, date,
   jurisdictions and the approved retention periods. Recording it sets `legal_review_completed`.
2. **Final warning.** After the grace period (30 days after suspension by default), an email at least 7 days before
   deletion, with how to export the data and how to recover the account.
3. **Dry run.** A report of who would be deleted in the next batch (at most 50 by default) and why others are held
   back: deadline not passed, not suspended, now in a company, legal hold, exempt, platform admin, owner of a tool
   others still use, an export in progress, or a pending invitation (under `INVITATION_ONLY`).
4. **Approval.** The founder approves a reviewed batch after a fresh password and code (until "automatic" mode is
   chosen in the settings).
5. **Deletion.** The 15-minute run deletes an approved batch, checking each account again. The person is anonymised:
   name, email, password, sign-in methods, sessions, tokens, notifications and preferences go, and personal tools only
   they used are closed. Records in tools other people use stay, as their company's.
6. **Backups.** Each batch records when the backups that still hold the data expire (30 days by default); deletion is
   not complete before then.

No public address starts or changes a deletion. A platform admin can put a legal hold on an account or recover it
during the grace period (access back, the deadline extended, the warning cleared).

## Account safety

- **Forgotten password (S6).** A one-use link valid for an hour, sent only to a proven address; the answer is the same
  whether or not the account exists; setting the new password ends every session and API token.
- **Google sign-in (L1, S3).** If someone signed up first with an address and a password without proving the address,
  the owner's Google sign-in removes that password and ends its sessions and tokens before linking the account.
- **The first founder.** The Fly secret `WORK_PLATFORM_ADMIN_BOOTSTRAP` (an email) makes that account the founder,
  only if it is active, its email is proven, and no founder exists. Remove the secret once it has acted.
- **The audit log is append only (S10):** database triggers refuse edits and deletions.

## Not built yet

- Reminder and notice texts are in English only.
