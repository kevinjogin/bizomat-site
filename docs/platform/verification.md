# Registration and verification (Stage 1, R6)

Every part of this ships switched off. Code: `apps/work/src/worker/company/countries.ts` (the countries and their
numbers), `verification.ts` (the service and the registers), `verification-routes.ts` (company and platform routes,
requests to join, registration outside Australia); migration `0033_verification.sql` (reverse in
`apps/work/migrations-reverse/`); tests `apps/work/test/verification.test.ts`.

## Flags

| Flag | What it switches on |
| --- | --- |
| `registry_verification_enabled` (everyone or a country) | Checks with the country's register: at registration, when the number or legal name changes, and on request |
| `scheduled_reverification` (everyone) | The 15-minute run checks companies that are due: first checks, and every 30 days after |
| `verification_enforcement` (everyone, stage, country or company) | An unverified registered company keeps its company area (details, people, verification) and support; its tools and ERP answer 403 `VERIFICATION_REQUIRED` to its people |
| `international_registration` (everyone or a country) | Registration outside Australia (`POST /api/company/companies/international`) |
| `join_requests` (everyone or a country) | "Request to join" a company that already exists |

## Countries (brief 5.2)

One data table (`COUNTRIES` in `countries.ts`): for each country, the numbers it accepts, how each is checked for format
(and check digits), and the register that can be asked.

| Country | Numbers | Register |
| --- | --- | --- |
| Australia | ABN (check digits), ACN (check digits) | ABN Lookup for ABNs; ACNs format only |
| United Kingdom | Companies House number; sole traders and partnerships register without one | Companies House |
| India | CIN, LLPIN, GSTIN (format) | None in place: verified by hand with evidence |
| United States | State and state entity number; EIN for format only | None: verified by hand with evidence |
| Any other | A registration number of up to 40 characters | None: verified by hand with evidence |

One legal entity is one company: the registry refuses a second company with the same country, number type and number.

## Statuses (brief 5.3)

Not registered, Registration pending, Verification in progress, Verified, Verification failed, Requires manual review,
Registration status changed, Suspended, Deregistered (`companies.registration_status`). Every change is in
`company_verification_history` (append only) with the old and new status, what set it (registry, manual, system) and
why. A company never sets its own status: only the service and a platform admin's decision do.

## The service (brief Part 6)

- A register's answer and the name decide the status. Names are compared after case, punctuation and company suffixes
  (Pty Ltd, Limited, LLC, Inc and the like) are set aside:
  - active and the same name: **Verified**;
  - active and a similar name: **Requires manual review** (never an automatic failure);
  - active and another name, or not found: **Verification failed**;
  - not active: **Deregistered**, or **Registration status changed** for a company that was verified.
- **A register that cannot be reached is never a failure.** The check is recorded, the status stays, it is tried again
  in an hour (three attempts each time, with growing pauses), and the platform admins get an email once a day while a
  register has failed five times in a row.
- Each check is recorded in `company_verifications`; each register's health in `company_registry_providers`.
- **Notifications:** every change of status emails the company's owner and administrators and the platform admins:
  what changed, the old and new status, the source, the date, what to do, and how to ask for a manual review.

## Manual review (brief 6.4)

- The owner or an administrator uploads documents (Company settings, Verification): PDF, PNG or JPEG only, up to
  10 MB, checked by their first bytes, kept privately under `evidence/<company>/` in the app's file storage, and
  downloaded by platform admins only as attachments. **Not yet scanned for malware** (decision D7): scanning comes
  before manual review is switched on for customers.
- They can ask for a manual review, with a note.
- Platform admins (Control Centre, Verification; two-factor sign-in) see totals by status, the review queue, recent
  changes, the last and next check, the registers' health, and can check a company now. A decision (approve, reject,
  ask for more information, or any status as an override) needs a reason and a fresh password and code, and is
  recorded with the old and new status and the time.

## Request to join (brief 5.4)

Someone whose company already exists sends a request with the country and number (`POST /api/company/join-requests`).
The answer is the same whether or not the number is registered, so nobody can find out which numbers are. The owner and
administrators get an email and see the request on the People page, and approve it with a role (its preset sets each
tool's role) or decline it.

## Access to each register (brief 6.2)

| Register | Access | Setting |
| --- | --- | --- |
| ABN Lookup (Australian Business Register) | Free web services GUID, from abr.business.gov.au, after agreeing to its terms | Fly secret `WORK_ABR_GUID` |
| Companies House (United Kingdom) | Free API key from the Companies House developer hub; rate limit 600 requests per 5 minutes | Fly secret `WORK_COMPANIES_HOUSE_API_KEY` |
| India (Ministry of Corporate Affairs) | No official API for this use is in place: manual review | None |
| United States | No national register; state registers may be added later where an official API exists | None |

No register is scraped.

## Not built yet

- The registration form outside Australia: the API exists behind its flag; the screen comes before the flag is
  switched on.
- "Request to join" from the Australian registration form: the API exists; the form still says to ask the owner.
- Malware scanning of uploaded documents (decision D7).
- The country table is code, reviewed with every change; it is not edited in the console.
