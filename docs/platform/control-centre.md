# BIZOMAT Admin Control Centre (Stage 1, R2)

The Control Centre is where platform admins switch Stage 1 capabilities on, for everyone or step by step. It lives in
the platform console at `/erp/admin/controls`, with two-factor sign-in at `/erp/admin/security`. Code:
`apps/work/src/worker/platform/` (server), `apps/work/src/client/admin/pages/Controls.tsx` and `Security.tsx` (screens),
migration `0029_platform_controls.sql` (reverse: `apps/work/migrations-reverse/0029_platform_controls.sql`).

## Rules

- **Every new capability ships off.** Nothing changes for anyone until a platform admin switches it on.
- **The server decides.** The pages only read flags; every check runs on the server (`flagValue`, `flagOn`, `billingMode`,
  `moduleEnabled` in `platform/flags.ts`).
- **Every change is recorded** in `feature_flag_changes`, with who, when, the old and new value, and the reason. That
  table is append only: database triggers refuse edits and deletions. Each change is also written to `audit_log`.
- **Scopes.** A value can be set for everyone, a rollout stage (internal or pilot), a country (ISO code) or one company.
  The most specific value wins: company, then stage, then country, then everyone, then the default.
- **Rollout stages.** Mark BIZOMAT's own test companies `internal` and the first customers `pilot` (founder only, with a
  re-authentication). Switch a flag on for `internal`, then `pilot`, then everyone.
- **Billing mode** stays `free` while the server's billing lock is set (`BIZOMAT_BILLING_LOCK`), whatever is stored.
  "Paid" is refused with `BILLING_LOCKED`.

## Two-factor sign-in and re-authentication

- **Set up:** Security, then Set up two-factor sign-in. Scan the QR code with an authenticator app, enter its code and
  keep the ten recovery codes; they are shown once.
- **The Control Centre always needs it.** The rest of the console needs it as soon as you have set it up, once per
  session.
- **A lost phone:** use a recovery code (each works once), then Security, Move to a new phone.
- **Dangerous actions** ask for your password and a code again; the confirmation lasts 10 minutes. These are high and
  highest risk flags, the kill switch, rollout stages and moving to a new phone.
- **Secrets.** The authenticator secret is encrypted with the server's settings key, and recovery codes are stored only
  as hashes. Codes, secrets and passwords are never logged.

## Flags

| Flag | Values (default first) | Scopes | Risk | Kill switch | Acts from |
| --- | --- | --- | --- | --- | --- |
| `company_registration_required` | off, on | everyone, stage, country | medium | yes | R6 |
| `registry_verification_enabled` | off, on | everyone, country | low | no | R6 |
| `verification_enforcement` | off, on | everyone, stage, country, company | high | yes | R6 |
| `scheduled_reverification` | off, on | everyone | low | no | R6 |
| `migration_notifications` | off, on | everyone, stage, company | medium | yes | R7 |
| `compliance_countdown` | off, on | everyone, stage, company | high | yes | R7 |
| `auto_suspension` | off, on | everyone, stage | high | yes | R7 |
| `legal_review_completed` | off, on | everyone | high | no | R7 (set by the legal review record, not here) |
| `auto_deletion` | off, on | everyone | highest | yes | R7 (refused until a legal review is recorded) |
| `individual_accounts_policy` | ALLOW_PERSONAL_WORKSPACE, INVITATION_ONLY, REQUIRE_COMPANY | everyone | high | yes | R7 |
| `billing_mode` | free, paid | everyone | highest | yes | R1 (paid refused while locked) |
| `module_<name>_enabled` | on, off | everyone, stage, company | medium | no | Maintenance and WHS now; the other modules in R4 |

The modules are `maintenance`, `whs`, `tasks`, `crm`, `finance`, `products`, `procurement`, `inventory`,
`manufacturing`, `quality` and `supply_chain`.

**Who may change what.**
- Low and medium risk flags: any platform admin with a verified session.
- High and highest risk flags: the founder only, with the flag's key typed to confirm and a re-authentication.

**Module switches.** A module switched off for a company answers 403 `MODULE_DISABLED` to that company's people.
Anyone else gets the usual 404, so a company's existence is never revealed.

**Kill switch.** It removes every value of every enforcement flag, everywhere, so they return to their defaults: off,
free, and personal workspaces allowed. Non-enforcement flags (registry checks, re-verification, modules) are left
alone. Any platform admin may use it, with a re-authentication and "KILL SWITCH" typed.

## Safe order for switching things on (admin manual, to be completed as R6 and R7 land)

1. Set up two-factor sign-in, and keep the recovery codes offline.
2. Mark BIZOMAT's own test companies `internal` and the first customers `pilot`.
3. Registration and verification (R6):
   - first `registry_verification_enabled` for one country;
   - then `company_registration_required` for `internal`, then `pilot`, then everyone;
   - `verification_enforcement` last, and only after every existing company has had a chance to verify.
4. Existing users (R7):
   - decide `individual_accounts_policy` from the classification report;
   - `migration_notifications` (the recipient list is shown for approval first);
   - then `compliance_countdown`;
   - `auto_suspension` only after the deadlines have passed and the dry run has been reviewed.
5. `auto_deletion` stays off until a privacy and legal review is recorded, and then runs only in reviewed batches.
6. If anything goes wrong, use the kill switch, then investigate.
