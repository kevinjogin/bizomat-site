# Company Admin console

Owner's request of 20 Nov 2026: the super admin's ERP console (`/erp/admin`) manages every account and company; company
administrators need their own console to manage their own team.

**Status:** built behind the flag `company_admin_console` (scopes everyone, rollout stage, company), which ships off.
Switching it on needs the owner's approval.

## Who

The owner and administrators of a registered company, active in it. Checked on the server
(`apps/work/src/worker/company/admin-console.ts`, `requireConsole`):

| Person | Answer |
| --- | --- |
| Owner or administrator, console on for the company | The console |
| Owner or administrator, console off | 404 `COMPANY_ADMIN_OFF` (the screen points to Administration) |
| Suspended administrator | 403 `MEMBER_SUSPENDED` |
| Manager, employee or read-only member | 403 |
| Anyone outside the company | 404 (they cannot tell the company exists) |

Personal and example companies have no team and no console.

## Where

- `/erp/c/<company>/company-admin`, and `/erp/company-admin` (the company used last where the person administers, or a
  choice).
- "Company Admin" in the module rail and in the ERP's side menu, only for people who may open it
  (`GET /company/admin/companies`), and a card on the Administration page.

## Tabs

| Tab | What | Source |
| --- | --- | --- |
| Overview | The team at a glance (active and suspended members, pending invitations, requests to join, departments, API tokens), what needs attention (ranked: high, medium, information), people by role, recent activity, the access review download | `GET /company/c/:company/admin/overview` |
| Members | Invitations, company roles, each tool's role, suspension and removal, ownership transfer; with `company_members_v2` the Members page (module access, scopes, Activity) | The company area's own page |
| Departments | Departments and their heads | The company area's own page |
| Roles and access | What each company role gives in each tool, each tool's own team page, modules switched off, the access review on screen and as CSV | `GET /company/c/:company/admin/access-review` |
| ERP roles | Who may change products, buy, approve, receive, count and produce | The ERP roles page |
| Security | API tokens made for this company, with revoke; BIZOMAT support access, with "End now"; the ownership transfer state | `GET /company/c/:company/admin/tokens`, `POST .../tokens/:id/revoke` |
| Activity | The company account's history | The company area's own page |
| Settings | Company details, contact email confirmation, registration checks, leaving or deleting | The company area's own page |

What needs attention: requests to join, a waiting ownership transfer, open support access, invitations expiring within
two days or expired in the last 30, an unconfirmed contact email, a single administrator, members in no department,
members inactive for 30 days, suspended members, API tokens unused for 90 days, members with older tokens not limited to
one company, and modules switched off. The registration status is shown as the registry holds it; nothing is called
verified unless its status says so.

## API tokens

Only tokens limited to this company are listed (`api_tokens.company_id`). An administrator can revoke any of them except
the owner's (only the owner, or the person, can). A revocation needs a reason. It takes effect at once, is recorded in
the company's activity and the platform's audit log, and the token's owner is told in the app. Tokens not limited to a
company belong to their person alone: the console only counts the members who still have one.

## Access review

Everyone in the company, with their company role, status, title, departments, each tool's role, module access (where
`company_members_v2` is on), API tokens for this company, when they joined and when they were last active. On screen
and as CSV. Each review is recorded in the company's activity.

## Tests

`apps/work/test/company-admin.test.ts`:
- the access matrix, and isolation between companies;
- the overview and what needs attention;
- token listing and revocation, including the owner's tokens and another company's;
- the access review as JSON and CSV, with its record in the company's activity.
