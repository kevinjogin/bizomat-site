# BIZOMAT production-readiness report

_Updated 5 Nov 2026, about 23:45 UTC. This repository is private: the report names runs, artifacts and hosts but
holds no personal data, no credential and no database content. Nothing here changed production data. No production
DNS record was changed, and the only deletion was the two exposed artifacts, as the owner asked._

## 1. Production checklist

- **LIVE**: running in production and checked at its public address.
- **TESTED**: built and passing on the exact commit (CI, and locally where stated), not live yet.
- **PENDING**: ready, and waits for the owner's decision or action.
- **BLOCKED**: needs access this session does not have (credentials, DNS, dashboards, a Windows PC with SOLIDWORKS).

| # | Item | State | Evidence or what it waits for |
| --- | --- | --- | --- |
| 1 | The two exposed PMO database exports deleted | **LIVE** | Deleted 21:24 UTC (section 2.1); both runs list 0 artifacts; both IDs answer 404 |
| 2 | No workflow can upload a database, dump, backup or secrets file; backups are D1 restore points; daily cleanup | **LIVE** | jogkev-creator/PMO#1 merged (36277878) on the default branch; CI and the cleanup ran green |
| 3 | The two Project Management users change their passwords | **PENDING** (owner) | They must be told (section 3). A change ends their other sessions in today's app |
| 4 | Forced new password and founder security reset | **TESTED** | Monorepo d2e73a8, CI green; reaches production with the platform, or by a port to PMO |
| 5 | Secret scan of all three repositories, trees and full histories | **TESTED** | Test fixtures only; the diffs published today scanned clean |
| 6 | Server password removed from CAD Automation (CADOS#11) | **TESTED**, deploy **PENDING** (owner) | In CADOS `main` (1fec502, then #12 and #14). The live app does not run `main` yet (section 6) |
| 7 | `OPENSKETCH_PASSWORD` not set on the live CAD app | **LIVE** | The live app (accounts mode) answers `/reset` with 303 to `/login`, which its code does only without the password |
| 8 | CAD Automation at `https://bizomat.ai/cad` (prefix, links, cookies, OAuth metadata at the root, old hosts kept for programs) | **TESTED**, deploy **PENDING** (owner) | jogkev-creator/CADOS#14 merged (c853a6a): 363 tests and the Windows installer test passed on its head d7cff31 |
| 9 | Long CAD tool calls survive Cloudflare (event-stream answers with a 15 s keep-alive) | **TESTED** | CADOS#14; the new test fails with the old JSON answers |
| 9a | A Content Security Policy on every CAD page (needed now that bizomat.ai is one origin for three applications) | **TESTED**, deploy **PENDING** (owner) | jogkev-creator/CADOS#15 merged (b3e2be2): CI 6 of 6, 364 tests locally; checked in Chromium with no policy error (section 5) |
| 10 | Existing connectors, add-ins and Companions keep working | **TESTED** | Sign-in and MCP through `bizomat.ai/cad`, `cados.kevos.com`, `cados.fly.dev`; a computer paired under `/cad`; the live metadata names `cados.kevos.com`, so connections were made with an address that stays (section 6) |
| 11 | Website Worker routes bizomat.ai: website at `/`, `/cad` to the CAD app, `/tasks` to Project Management | **TESTED**, **PENDING** (owner) | gocore-website c237e4e9: 1,501 tests, type check, 4,441 pages built. Needs the steps in section 5 |
| 12 | Project Management at `https://bizomat.ai/tasks` (one build serves both addresses; session cookie scoped to `/tasks`) | **TESTED**, deploy **PENDING** (owner) | jogkev-creator/PMO#2 merged (e88fa79) after CI passed (tests, build, end-to-end); 198 tests and 7 of 7 end-to-end (one under `/tasks`) locally. Until it is deployed and bound, `bizomat.ai/tasks` redirects to `work.kevos.com` |
| 13 | Windows installer 0.12.3: silent install, registration, uninstall with every COM key removed | **TESTED** | Installer test on windows-latest for CADOS#14 passed, including the strict CLSID check (section 7) |
| 14 | Public installer download | **BLOCKED** (owner decision) | CADOS is private: its release files answer 404 without a GitHub sign-in (section 7) |
| 15 | CADOS for SOLIDWORKS in a real SOLIDWORKS | **BLOCKED** (Windows PC with SOLIDWORKS) | `docs/KEVOS-TEST-REPORT.md`, section 4, in the CADOS repository |
| 16 | Signed MSI | **BLOCKED** (code-signing certificate) | Builds are unsigned; unsigned Companions never update themselves |
| 17 | BIZOMAT platform app `bizomat` on Fly | **TESTED**, **BLOCKED** (Fly token) | CI image and smoke test 39 of 39; `FLY_API_TOKEN` missing in this repository |
| 18 | Data migration (Project Management, CAD) | **TESTED** (dry runs), **BLOCKED** (tokens, approval) | Section 9 |
| 19 | Operator legal details, trade mark, terms, privacy | **BLOCKED** (owner) | `BIZOMAT-PROJECT-STATUS.md`, section 7 |

## 2. Security remediation

### 2.1 The exposed artifacts: resolved

`jogkev-creator/PMO` is public. Two workflow runs of 4 Nov 2026 uploaded full exports of the Project Management
database (the one behind work.kevos.com) as artifacts:

| Artifact | Run | Uploaded (UTC) | Deleted (UTC) |
| --- | --- | --- | --- |
| 13305479166 `d1-backup-preview-41797102620` (6,816 B) | 41797102620 | 4 Nov 08:08 | 5 Nov 21:24 |
| 13305958137 `d1-backup-preview-41797783441` (6,816 B) | 41797783441 | 4 Nov 08:14 | 5 Nov 21:24 |

**How:** a workflow added with PMO#1 (`.github/workflows/artifact-policy-cleanup.yml`) deletes every artifact the
policy forbids. It uses GitHub's REST API with the workflow's own token and prints counts only. Its first run
([42112322035](https://github.com/jogkev-creator/PMO/actions/runs/42112322035)) logged "Deleted 2 forbidden
artifact(s); 0 left."

**Verified afterwards:**
- Both runs list no artifacts (`total_count: 0`).
- A download request for either artifact ID answers 404 Not Found.
- All 32 runs in the repository had been listed before deletion; these were the only database artifacts.
- CADOS and this repository are private and upload no database or secrets file (`tests/artifact-policy.test.ts`).

The exports were downloadable by any signed-in GitHub user for about 37 hours. GitHub keeps no download log for
artifacts, so treat them as possibly copied. Nobody in this session opened them.

### 2.2 Prevention, in force

PMO's default branch (since 36277878):
- Backups before every deploy and the admin-ops `backup` are Cloudflare D1 Time Travel restore points; nothing
  leaves Cloudflare.
- `scripts/check-artifact-policy.mjs` fails CI on any upload of a database, dump, backup, `.env`/`.dev.vars`,
  `.wrangler`, secret or credential file.
- The cleanup workflow runs daily (02:41 UTC), by hand, and whenever the policy changes.

This repository checks its own and both apps' workflow folders with the same policy (`tests/artifact-policy.test.ts`).

### 2.3 Secrets, logs and environment

The regex scanner (16 rules: private keys, cloud and SaaS tokens, JWTs, URLs with passwords, assigned secrets)
covered the tracked tree and every line ever added in the full history of each repository. Every match was a test
fixture, a header comparison, a stub key in a round-trip test, or a local-only demo password. The diffs published
today have no matches.

- Migration tooling and request logs print counts, methods, paths and status codes only.
- The platform entrypoint gives each process group only its own variables (`BIZOMAT-SECURITY.md`, F1 to F8).

## 3. Affected accounts

Two Project Management accounts existed when the exports were made, per PMO's deployment record of 4 Nov. The
exports hold names, emails and PBKDF2-SHA256 password hashes (100,000 iterations, per-user salt). Session, API and
invite tokens are stored only as SHA-256 hashes of random values, so they cannot be used. Integration secrets are
stored as plain text.

**Owner, now:**
1. Ask both people to change their Project Management password, without details. Today's app ends every other
   session of an account when its password changes; Settings > Sessions shows the rest.
2. If an integration with a secret (a webhook) existed before 4 Nov 08:15 UTC, rotate its secret.
3. Assess the event under the Notifiable Data Breaches scheme (Privacy Act 1988) if the operator is covered, and
   tell the two people. This is not legal advice.

**Ready for the platform** (monorepo d2e73a8, `apps/work`):
- **Forced new password:** an account flagged to choose a new password gets 403 `PASSWORD_RESET_REQUIRED` on every
  call and on the realtime socket, except a password change and sign-out. The founder's reset sets the flag.
- **Founder security reset** (Sessions page; 5 an hour): ends every other session and can flag every account with
  a password. It returns counts only and writes one audit event.

## 4. The server password (`OPENSKETCH_PASSWORD`) and CADOS#11

What it controlled before #11:
1. The key for creating the owner account.
2. An old password-only sign-in.
3. `/reset`: a master key that set any account's password.
4. The seed of the owner's server-wide private MCP address.
5. Shown to the owner on the Admin page.

It was never a customer password. In production it was also not set: the live app (accounts mode) answers `/reset`
with 303 to `/login`, which 0fc0cc9 does only when the password is empty. So the master key was never active on the
live server, and the owner's private MCP address there comes from the data folder's random secret.

[jogkev-creator/CADOS#11](https://github.com/jogkev-creator/CADOS/pull/11) (another session's work) was reviewed
here and merged on the owner's instruction (1fec502).

**Review points:**
- No `/reset`, no password-only sign-in, no server password at setup or on Admin.
- Suspension covers every way in: sign-in, OAuth, private addresses, add-in keys and paired computers.
- Recovery is a command on the server (`python -m opensketch --reset-password EMAIL`, over `fly ssh`).
- Crafted paths (dot segments, `//`, backslashes) are refused.
- Existing OAuth grants keep working.

**Residual notes:**
- **New public server:** a server with no account lets the first visitor create the owner account. Production has
  its owner; on any new deployment, create the owner account at once.
- **Self-hosted Windows server:** the owner's private address changes if the password is no longer entered at
  start-up; reconnect Claude Desktop with `connect-claude.ps1`.
- **Fly secret:** if `OPENSKETCH_PASSWORD` is ever found set on Fly, use New address in Settings first, then unset
  the secret.

## 5. Domain architecture (owner's decision, 5 Nov 2026)

**Everything lives under bizomat.ai, with no subdomains.** bizomat.ai is the BIZOMAT website; `/cad` is CAD
Automation and `/tasks` is Project Management. The earlier plan for `cad.bizomat.ai` is withdrawn (its draft,
jogkev-creator/CADOS#13, is closed).

DNS today (Cloudflare, nameservers `uma` and `zac.ns.cloudflare.com`, same account as kevos.com):
- `bizomat.ai` A and AAAA point at the `cados` Fly app, DNS only, so bizomat.ai shows the CAD app today.
- `_acme-challenge.bizomat.ai` is Fly's validation record; `cad.bizomat.ai` has a Fly certificate but no record.
- `cados.kevos.com` points at the same Fly app; `work.kevos.com` is the Project Management Worker's custom domain.

**What is ready:**
- **Website Worker** (`src/worker.ts`):
  - It answers `bizomat.ai` and `www.bizomat.ai` once their records are proxied.
  - `/cad/...` is passed to the CAD app with `fetch(request)`: the proxied record keeps Fly as its origin.
  - The CAD app also receives its OAuth discovery paths and the program paths it keeps at the root (`/mcp`,
    `/oauth/`, `/v2/`, `/healthz`).
  - `/tasks/...` goes to Project Management: its Worker through a service binding once it is deployed, a redirect
    to `work.kevos.com` until then.
  - `/CAD` and `/TASKS` answer 301 to the lowercase paths. `www` answers 301 to the apex. kevos.com's old CAD page
    `/cad/` answers 301 to `/cad-automation/`.
- **CAD app** (CADOS#14): public address `https://bizomat.ai/cad`.
  - `cados.kevos.com`, `cados.fly.dev` and `cad.bizomat.ai` are old hosts: pages 301 to `bizomat.ai/cad`, and
    programs keep working there with their own address.
  - Google sign-in returns to `https://bizomat.ai/cad/auth/google/callback`.
- **Project Management** (PMO#2): the same build answers `work.kevos.com` and `bizomat.ai/tasks`.
  - Under `/tasks` its session cookie is `__Secure-workos_sid` with `Path=/tasks`.
  - Google returns to `https://bizomat.ai/tasks/api/auth/oauth/google/callback`.

**One origin for three applications.** Under one host, the website, CAD Automation and Project Management share a
browser origin, so a script injected into any one of them could call the others with the visitor's sessions.
Subdomains would have kept them apart. What contains it:
- each application keeps its session cookie to its own path (`/cad`, `/tasks`); the website has none;
- changes need same-origin requests in both applications;
- the website and Project Management send a strict Content Security Policy. CAD pages sent none until
  jogkev-creator/CADOS#15 (merged, not deployed yet), which adds one (scripts only from the CAD app, its two inline
  scripts by hash) and is checked on every page.

Keep the three policies strict, and never serve user-supplied HTML or scripts on bizomat.ai.

The owner's steps, in order, each with a check and a rollback, are in `BIZOMAT-DEPLOYMENT.md`, section 6a:
1. Deploy CADOS `main` to `cados` from a fresh clone (`git clone --config core.autocrlf=false`, then `fly deploy` in
   that folder).
2. Add the `_acme-challenge` record Fly lists for `bizomat.ai`, so its certificate renews behind the proxy.
3. Merge this repository to `main` (publishes the website, kevos.com included).
4. Straight after, switch the `bizomat.ai` records to proxied, add a proxied `www`, and set SSL/TLS to Full (strict).
   Turn Bot Fight Mode off and bypass the cache for the CAD paths.
5. Deploy PMO's default branch (PMO#2) to `workos-platform-preview`, then uncomment the website's `TASKS` binding.
6. If Google sign-in is used, add the two return addresses above to the Google clients.

## 6. Live deployments and connector compatibility

| Address | 5 Nov, 23:35 UTC (read-only checks) |
| --- | --- |
| `cados.kevos.com` | CAD app. `/healthz` reports version `9e3f79f`. Metadata, issuer and token endpoint name `cados.kevos.com` |
| `cados.fly.dev` | Same app; pages 301 to `cados.kevos.com`; metadata names `cados.kevos.com` |
| `bizomat.ai` | Same app (DNS only): the CADOS product page; `/cad/` answers 303 to `/login` |
| `kevos.com` | Cloudflare Worker, the KEVOS 2.0 site on `main` |
| `work.kevos.com` | Project Management, health ok (`environment: preview`) |

**The live CAD app is not running CADOS `main`.** It reports `9e3f79f`, but it lacks three behaviours that commit
has:
- it answers `cad.bizomat.ai` with `cados.kevos.com`'s metadata;
- `cados.fly.dev` does not name itself;
- `/v2/bridge/update.json` still answers 303 to the sign-in page instead of 401.

So the image was built from older code. Owner: deploy `main` (b3e2be2) from a fresh clone, then repeat these checks:
- `https://bizomat.ai/healthz` reports `b3e2be2`;
- `https://bizomat.ai/cad/` is the CAD app;
- `https://cados.kevos.com/docs` answers 301 to `https://bizomat.ai/cad/docs`;
- `https://cados.kevos.com/.well-known/oauth-protected-resource/mcp` still names `cados.kevos.com`.

Connections made so far named `cados.kevos.com` (the only address the live metadata has ever given), and that host
keeps serving MCP, OAuth and the Companion API at its root after the deploy.

## 7. Installer distribution and Windows installation

**Windows installation, TESTED.** `installer-test.yml` (CADOS) builds the add-in, the Companion and the MSI on
windows-latest, then runs `.github/scripts/test-install.ps1`, which a test PC can also run:

- **Install:** silent, exit code 0; all nine files under `C:\Program Files\KEVOS\Bridge`.
- **Registration:** the add-in's COM class points at the installed DLL; SOLIDWORKS lists it as "CADOS".
- **Install record:** the version (0.12.3 since CADOS#14) and the service address (`https://bizomat.ai/cad`).
- **Start-up:** the Companion starts at sign-in.
- **Loading:** the add-in loads in .NET Framework.
- **Uninstall:** exit code 0; the files, the code base, the SOLIDWORKS listing and the start entry are removed.
- **Leftover:** fixed in 0.12.3 (`ForceDeleteOnUninstall`): the test now requires the add-in's CLSID keys to be
  gone after uninstall, and passed on CADOS#14.

**Public distribution, BLOCKED.** CADOS is private, so `https://github.com/jogkev-creator/CADOS/releases/...` answers
404 without a GitHub sign-in. `/download/solidworks` then sends signed-in customers to a page they cannot open,
unless the app has its own `OPENSKETCH_INSTALLER_URL`. The owner chooses one:

- (a) **Make CADOS public.** Recommended: it is AGPL-3.0-only, and the license already obliges offering the source
  to its users; the history scanned clean.
- (b) **Host the MSI publicly and point the app at it:** for example a public R2 bucket, then
  `fly secrets set OPENSKETCH_INSTALLER_URL=<https address> -a cados`.
- (c) **A read-only GitHub token on the server** that redirects signed-in people to GitHub's short-lived download
  link (code not written).

## 8. Commits and CI on the exact commits

| Repository and branch | Commit | CI on that commit |
| --- | --- | --- |
| CADOS `main` | b3e2be2 (#15), after c853a6a (#14), 9e3f79f (#12) and 1fec502 (#11) | #15 head d9937f1: tests (main and worker processes) and npm, 6 of 6 success; #14 head d7cff31: tests, add-in build, MSI install and installer test, 9 of 9 success |
| PMO default (`claude/pensive-turing-azyn1m`) | e88fa79 (PMO#2) | #2 head b82a714: lint, typecheck, tests, build and end-to-end, twice each: success; preview deploy skipped (switched off) |
| gocore-website `claude/dazzling-mccarthy-31qg86` = `feat/bizomat-unified-platform` | c237e4e9 and the docs commit after it | `npm run verify` locally: success; BIZOMAT CI running at hand-off |

## 9. Data migration readiness (unchanged)

Project Management:
- D1 export, verified import into node:sqlite, R2 copy with checksums.
- Reruns skip what matches and refuse what differs; dry run 45 of 45.

CAD:
- Byte-for-byte copy with refusals; round trip in the image passed.

Both:
- **Backups:** D1 restore point and a Fly volume snapshot before each apply.
- **Old apps:** stay untouched until the rollback window has passed.
- **Not run yet:** neither migration has touched production; both wait for tokens and the owner's go.
- **Rollback:** `BIZOMAT-ROLLBACK.md`.

## 10. Outstanding risks

1. **High until deployed:** the live CAD app runs code older than CADOS `main` (section 6). Nothing merged since #11
   is live.
2. **Medium:** the three applications share one browser origin on bizomat.ai (section 5).
3. **Medium:** customers cannot download the installer while CADOS is private (section 7).
4. **Medium:** the two exposed accounts' passwords are unchanged until the people change them (section 3).
5. **Medium:** bizomat.ai shows the CAD app, not the BIZOMAT homepage, until section 5's steps are done. Between
   publishing the website and proxying bizomat.ai, the website's `/tasks` links reach the CAD app: do the two steps
   together.
6. **Low:** if the `_acme-challenge` record is missing, Fly cannot renew the `bizomat.ai` certificate behind the
   proxy, and `/cad` fails with 526 when it expires.
7. **Low:** a brand-new public CAD server lets its first visitor create the owner account (section 4).
