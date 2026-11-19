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
| `international_registration` (everyone or a country) | Registration outside Australia: the registration page offers the countries where it is on (`GET /api/company/registration-options`), with the country's own numbers and legal structures, and posts to `POST /api/company/companies/international` |
| `join_requests` (everyone or a country) | "Request to join" a company that already exists |
| `evidence_scanning` (everyone) | Uploaded documents are handed to the malware scanner. Off: they wait, and none can be opened or accepted |

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
  downloaded by platform admins only as attachments, and only after a clean malware scan (below).
- They can ask for a manual review, with a note.
- Platform admins (Control Centre, Verification; two-factor sign-in) see totals by status, the review queue, recent
  changes, the last and next check, the registers' health, and can check a company now. A decision (approve, reject,
  ask for more information, or any status as an override) needs a reason and a fresh password and code, and is
  recorded with the old and new status and the time.

## Malware scan (owner, 19 Nov 2026)

Every uploaded document is scanned with ClamAV before anyone may open or accept it (`src/worker/company/scan.ts`).
Until then a platform admin's download and any decision that accepts it answer 409 `NOT_SCANNED`, whether the flag is
on or not; rejecting a document needs no scan.

- **Where it runs.** ClamAV needs about 1 GB while it scans (measured with ClamAV 1.5.4 and the full signature set:
  1,000 MB at its peak, about 12 s a file; the daily set alone 660 MB). This app's Machines have 512 MB, so the owner
  chose the one existing Machine with room: CAD Automation's (`cados`, 2 GB, Amsterdam). No Machine was added or
  resized. The scanner is `opensketch/evidencescan.py` in kevinjogin/bizomat-cad.
- **How.** The scanner asks this app; nothing calls out. `POST /company/api/id/scan/next` with CAD's BIZOMAT client
  credentials (HTTP Basic, client `cad`, the same as the CAD status report: no new secret) answers 204, or one
  document's bytes with its id and SHA-256; it is "scanning" until a verdict comes, or for 15 minutes. `POST
  /company/api/id/scan/result` takes clean, infected (with the signature) or error, and refuses a verdict on bytes
  whose SHA-256 differs from the upload. Other clients get 403, a wrong secret 401.
- **Verdicts.** Clean: the document can be opened and accepted. Infected: the file is deleted from storage at once,
  the document is marked refused, and the company is asked for a clean copy (company and platform audit). Error: back
  in the queue; after five attempts "could not be scanned" (the company uploads another copy). Files over ClamAV's
  limits and encrypted documents count as infected.
- **On the scanner's Machine.** One document at a time, only while 1,300 MB are free (CAD work comes first), at the
  lowest CPU priority; written to a private temporary folder, scanned and deleted at once; never kept or logged.
  Signatures are fetched from ClamAV's own servers every 6 hours to the Machine's disk.
- **Screens.** The company's Verification card says each document's scan; the Control Centre's Verification card
  shows the scanner's queue (waiting, clean, refused, could not be scanned) and its last verdict.
- **Before switching it on.** Deploy CAD Automation with the scanner (its own repository's deploy), then switch on
  `evidence_scanning`. The documents travel from Sydney to the scanner in Amsterdam over HTTPS and are not kept there:
  the privacy notice should say so before customers upload documents (the owner's decision).

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

- "Request to join" from the Australian registration form: the API exists; the form still says to ask the owner.
- The country table is code, reviewed with every change; it is not edited in the console.
