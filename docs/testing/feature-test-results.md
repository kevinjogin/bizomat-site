# Platform upgrade: test results

_12 Nov 2026, branch `claude/gallant-mccarthy-eoyq46`, commit `abdafed`. Every result below is from a run in this
session; commands from `apps/work`._

## Automated suites

| Suite | Command | Before the change (`d485514`) | After |
| --- | --- | --- | --- |
| Lint | `npm run lint` | pass | pass |
| Type checks (client, Worker, Node) | `npm run typecheck` | pass | pass |
| Workers runtime (workerd, Miniflare D1/R2) | `npm test` | 207 of 207 | **248 of 248** |
| Node runtime (the production runtime) | `npm run test:node` | 322 of 322 | **364 of 364** |
| Browser end to end on the Node server, desktop and phone | `npx playwright test --config playwright.node.config.ts` | 10 of 10 (earlier run) | **10 of 10** |
| Production build (client, Worker bundle, Node server with 6 migrations) | `npm run build` | pass | pass |
| Fly configuration check | `python3 infrastructure/fly/test/check-config.py` (repository root) | pass | pass |
| Platform scripts syntax | `bash -n` on the entrypoint and its test | pass | pass |

Not run here: the entrypoint's Docker test (`infrastructure/fly/test/entrypoint.test.sh` needs the platform image,
which the deploy builds); it now also checks that `WORK_BREVO_API_KEY` reaches only the work role.

## New tests

`test/platform-org.test.ts` (18), `test/platform-finance-reports.test.ts` (21),
`test-node/pre-migration-backup.test.ts` (1), and additions to `test/auth.test.ts` (2).

| Area | Covered |
| --- | --- |
| Organisation | Invite; token hash only; seven-day expiry; resend rotates the token (old link 404); existing user joins with the token; new user registers with the token; inviter notified; expired (410) and revoked (404) invitations; a second invitation replaces the first; duplicate membership refused (409); signing up or in with an invited address but without the token joins nothing; single use; member removal removes project and task grants; suspension and restore; only admins invite admins and project managers |
| Permissions | Owner, admin, project manager, member, viewer, guest; guests see only what is shared; edit on project A and view on project B for one person; "no access" on a shared project, never for admins; capabilities switched off (create, delete, assign); no escalation (cannot give more than you have, cannot change your own access, cannot raise your own role); 11 direct API calls across organisations all refused (403/404) |
| Task access | A contractor sees one task (status update, comment) and gets 404 on its board, other tasks and other projects; cannot rename, delete or move it; task page context holds only that task; Shared with me; assigning someone without access is refused (422) until the task is shared; the owner picker shows "this task only"; an invitation can carry task access; viewers cannot share tasks |
| Finance | AUD, USD, INR (international digit grouping, INR 1,234,567.89), JPY (no decimals), EUR, GBP, NZD, CAD, SGD, CHF, CNY formatting; 0.1 + 0.2 = 0.30 exactly; half-away-from-zero rounding; exponent input; amounts kept per currency, never added; group totals; remaining budget, variance, utilisation; existing stored amount byte-for-byte unchanged after choosing the organisation currency; unconfirmed old column; project override; invalid codes refused; only admins change settings; finance hidden from a member on board, task, activity, search filters, edits, summary and board copies |
| Reports | Monthly report from history: a task completed last month and reopened today shows as completed in that month and blocked now; started tasks; inception, custom range, outstanding report sections; carried-forward work; disclosure when no change was recorded and when history starts after the board; commentary escaped and labelled; PDF starts with `%PDF-`; Excel has the workbook, sheets and a Finance sheet with the exact amount; CSV formula injection prefixed; HTML shows the amount and classification; versions 1 and 2; the saved PDF and HTML are byte-identical after the project changes; members without the report right get 403/404; finance reports hidden from people without finance access (listed as hidden, download 403); a report by them leaves finance out; project managers can report; signed-out 401 |
| Email | Not configured: nothing queued, invitations return their link; invitation sent through the provider with the required subject, link, inviter and role, body cleared after sending, never sent twice; idempotency key duplicates refused; assignment email with project, inviter and permitted actions; retry on 503 then sent; daily limit defers normal mail to the next UTC day while an invitation uses the reserve; 400 fails without retry; invalid address refused; Brevo request shape (endpoint, `api-key` header, sender, recipient, both bodies, `X-Mailin-custom`, sandbox header) and error mapping (400, 401, 402, 429, 500, network); webhook 401 without or with a wrong token, 200 with it, hard bounce recorded and the address suppressed, a later "delivered" does not undo it; admin status page and test email to self only; all 12 templates escape input and carry a plain-text part and the footer |
| Migration safety | 0006 applied on a database with data: rows, roles, join times, invitation fields preserved; a copy of the database taken before the migration (and none when nothing is pending) |

Existing tests changed because behaviour changed on purpose (none disabled): invited sign-up now passes the token
(`auth.test.ts`); assignment email defaults to on (`notifications.test.ts`); a new currency column no longer assumes
USD (`shared-columns.test.ts`); two migration fixtures name their columns (`migrate.test.ts`,
`to-cloudflare.test.ts`).

## Browser walkthrough (local Node server, Chromium)

Owner signs up, creates a project from the Project plan template, sets AUD, enters 12,500.50, 0.10 and 0.20: the
board toolbar shows Members, Activity, Automate, Finance, Reports; the report preview renders the corporate report;
saving lists version 1 with PDF, Excel, Print (HTML) and CSV (the PDF downloads, `%PDF-1.7`, 15.9 KB); the Finance
panel shows AUD 12,500.80 approved and remaining, group subtotals 12,500.60 and 0.20; Permissions, Members,
Finance, Email and Audit trail settings load. A contractor invited as a guest with one task signs up through the link
on a 390 px phone screen, sees the task under "Shared with me", opens it, and gets 404 for the board. No page errors
(one expected 401 from the signed-out session check on the sign-up page).

## Live checks after deployment

See the section added after the deploy.
