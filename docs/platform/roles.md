# Company roles (Stage 1, R5)

Code: `apps/work/src/worker/company/access.ts` (roles and presets), `apps/work/src/worker/company/routes.ts` (people,
invitations, transfer, handover, the company's view of support access), `apps/work/src/worker/platform/support.ts`
(support access); migration `0032_roles.sql` (reverse in `apps/work/migrations-reverse/`); tests
`apps/work/test/company-roles.test.ts`.

## The five roles (brief Part 4)

| Role | In the company | Projects | CRM | Finance |
| --- | --- | --- | --- | --- |
| Owner | One per company. Owns every tool; links tools, transfers ownership, closes the account | Owner | Owner | Owner |
| Administrator | Manages people (not the owner), departments, invitations and details | Administrator | Administrator | Administrator |
| Manager | Sees the company and its people | Project manager | Manager | Finance manager |
| Employee | Sees the company and its people | Member | Member | Contributor |
| Read-only | Sees the company and its people | Viewer | Viewer | Viewer |

- The tool columns are **presets** (decision D9): choosing a company role sets each tool's role, and each tool's role can
  still be changed one by one. Each tool keeps its own roles and detail. ERP modules, Maintenance and WHS keep their own
  role screens; their defaults follow the company role (administrators are ERP and Maintenance administrators).
- The role `member` (before R5) became `employee` for every person and open invitation. The API still accepts `member`
  and stores `employee`.
- A company role never grants platform admin rights.

## Rules

- **One owner, always.** The owner cannot leave or be removed; ownership moves only by a transfer to an administrator.
- **Only the owner makes administrators**, of the company or of any tool (decision D5).
- **Nobody but the owner changes their own role**, in the company or in a tool (audit S4: administrators could raise
  their own tool roles to administrator).
- **Owner handover.** When a platform admin disables an owner's account, each registered company they own passes to its
  longest-serving active administrator: the same change as a transfer, in every tool. With no active administrator
  nothing changes and the company is recorded as needing attention. Each outcome is in `co_owner_handovers` and the
  company's activity.
- **Invitations listed by address** (in Projects, CRM, Finance and Company) show only to a person who has proved their
  email address (audit L4). Accepting still needs the invitation's link.

## Support access

- A platform admin opens access to one registered company with a reason, for 1 to 72 hours, after a fresh password and
  authenticator code (Control Centre, "Support access").
- While it lasts they can read the company's people and roles, tools and registration. They never sign in as anyone
  and never read records.
- Opening, each view and the end are written to the company's own activity. The owner and administrators see every
  grant, with its reason and end time, under Company settings, "BIZOMAT support access", and can end it at once.
