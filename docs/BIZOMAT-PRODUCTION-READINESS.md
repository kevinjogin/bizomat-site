# BIZOMAT production-readiness report

_Updated 5 Nov 2026, about 22:00 UTC. This repository is private: the report names runs, artifacts and hosts but
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
| 6 | Server password removed from CAD Automation (CADOS#11) | **TESTED**, deploy **BLOCKED** | Merged (1fec502); `main` tests passed (run 42112496988). Fly has not deployed `main` since (section 6) |
| 7 | `OPENSKETCH_PASSWORD` not set on the live CAD app | **LIVE** | The live app (0fc0cc9, accounts mode) answers `/reset` with 303 to `/login`, which that code does only without the password |
| 8 | CAD app ready for `cad.bizomat.ai` (alias, host-aware sign-in, phase B is one line) | **TESTED**, deploy **BLOCKED** | jogkev-creator/CADOS#12 merged (9e3f79f2): 104 host tests, 351 + 2 slow in all; `main` tests passed (run 42116359550) |
| 9 | Companion update manifest reachable on a server with accounts | **TESTED**, deploy **BLOCKED** | CADOS#12; the test reproduced the 303 to `/login` before the fix |
| 10 | Existing connectors, add-ins and Companions keep working | **TESTED** | Full sign-in through every address in both phases; live baseline recorded (section 6) for the re-check after deploy |
| 11 | `cad.bizomat.ai` DNS record and Fly certificate, then phase B | **BLOCKED** (Cloudflare and Fly access) | Section 5, step 1; phase B ready as draft jogkev-creator/CADOS#13 (352 tests, add-in 29 of 29 at 0.12.3) |
| 12 | bizomat.ai as the BIZOMAT homepage | **PENDING** (owner approval) | Worker routes ready (`wrangler deploy --dry-run` passes). Needs a merge to `main` (publishes the website, kevos.com too) and the bizomat.ai record set to proxied |
| 13 | Windows installer: silent install, registration, uninstall | **TESTED** | Installer test on windows-latest: all checks passed (section 7) |
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

**bizomat.ai is the BIZOMAT platform homepage. CAD Automation has its own address, `cad.bizomat.ai`.**

DNS today (Cloudflare, nameservers `uma` and `zac.ns.cloudflare.com`, same account as kevos.com):
- `bizomat.ai` A and AAAA point at the `cados` Fly app, DNS only. So bizomat.ai shows the CAD app's product page
  today, not the BIZOMAT website.
- `_acme-challenge.bizomat.ai` is Fly's validation record.
- `www`, `cad` and `work.bizomat.ai` do not exist.
- `cados.kevos.com` points at the same Fly app; `work.kevos.com` is proxied by Cloudflare to the Project Management
  Worker.

**What is ready:**
- **CAD app (CADOS#12, phase A):** the canonical address stays `cados.kevos.com` until `cad.bizomat.ai` exists.
  - `cad.bizomat.ai` is an alias that works as soon as its record and certificate exist; `cados.fly.dev` redirects
    pages.
  - The app never names bizomat.ai: its metadata on bizomat.ai names the canonical address, so no connector can
    come to depend on the website's domain.
  - Phase B is the single line `OPENSKETCH_PUBLIC_URL = 'https://cad.bizomat.ai'`, safe in any order. Old hosts
    then redirect pages, and programs keep working on the address they were set up with.
- **Website:** `wrangler.toml` routes `bizomat.ai/*` and `www.bizomat.ai/*` to the website Worker. They do nothing
  until the bizomat.ai record is proxied.

The owner's steps are in order, each with a check and a rollback, in `BIZOMAT-DEPLOYMENT.md`, section 6a:
1. Add `cad.bizomat.ai` (DNS-only CNAME to `cados.fly.dev`) and its Fly certificate.
2. Merge phase B in CADOS (with Windows 0.12.3 defaults).
3. Merge this repository to `main` and switch the bizomat.ai records to proxied.
4. Point the website's CAD links at `cad.bizomat.ai`.

The full platform cutover (section 6 there) comes later and moves both CAD hosts to the `bizomat` app with the data.

## 6. Live deployments and connector compatibility

| Address | 5 Nov, 21:40 UTC |
| --- | --- |
| `cados.kevos.com` | CAD app 0fc0cc9. Metadata, issuer, token endpoint and 401 pointer all name `cados.kevos.com`. MCP without a token 401; add-in link and device API 401 without credentials |
| `cados.fly.dev` | Same app; pages 301 to `cados.kevos.com`. Metadata names `cados.kevos.com` (after CADOS#12: `cados.fly.dev`) |
| `bizomat.ai` | Same app, product page. Metadata names `cados.kevos.com` |
| `cad.bizomat.ai` | No DNS record |
| `kevos.com` | Cloudflare Worker, the KEVOS 2.0 site on `main` |
| `work.kevos.com` | Project Management, health ok (`environment: preview`) |

- **CADOS `main`:** now 9e3f79f2 (#11 and #12); its tests passed. Fly had not deployed `main` 30 minutes after the
  first merge, and the repository has no `FLY_API_TOKEN` for `deploy.yml`, so nothing new is live yet.
  - Owner: deploy `main` from the Fly dashboard (app `cados`, Deploy), or `fly deploy -a cados` from a clean checkout
    of `main`. Alternatively, add a deploy token as `FLY_API_TOKEN` and run "Deploy to Fly.io" by hand.
  - Then re-run the read-only checks: every value above must be unchanged, except `cados.fly.dev`'s metadata
    (`cados.fly.dev`) and `/v2/bridge/update.json`, which answers 401 to a request without a device proof instead
    of 303.
- **PMO#1:** merged, deploys nothing (CI files only).

## 7. Installer distribution and Windows installation

**Windows installation, TESTED.** `installer-test.yml` (CADOS) builds the add-in, the Companion and the MSI on
windows-latest, then runs `.github/scripts/test-install.ps1`, which a test PC can also run:

- **Install:** silent, exit code 0; all nine files under `C:\Program Files\KEVOS\Bridge`.
- **Registration:** the add-in's COM class points at the installed DLL; SOLIDWORKS lists it as "CADOS".
- **Install record:** version 0.12.2 and the service address.
- **Start-up:** the Companion starts at sign-in.
- **Loading:** the add-in loads in .NET Framework.
- **Uninstall:** exit code 0; the files, the code base, the SOLIDWORKS listing and the start entry are removed.
- **Leftover:** the MSI leaves the empty "Implemented Categories" key under the add-in's CLSID. The fix
  (`ForceDeleteOnUninstall`) comes with 0.12.3, because a rebuilt 0.12.2 would install beside the old one: the MSI
  refuses same-version upgrades.

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
| PMO default (`claude/pensive-turing-azyn1m`) | 36277878 (PMO#1, squash of c951369) | PR run 42112332363 (lint, typecheck, tests, build, end-to-end): success; cleanup 42112322035: success |
| CADOS `main` | 9e3f79f2 (#12), after 1fec502 (#11) | Deploy to Fly.io 42116359550 and 42112496988 (tests on `main`): success |
| CADOS #12 head (merged) | 0d3f1a8 | Tests 42115247023 and 42115255436, installer test 42115247128 and 42115255471: success, 8 of 8 |
| CADOS #13 head (draft, phase B) | 31d4705 | Running at hand-off (tests, add-in and MSI, installer test) |
| gocore-website `claude/dazzling-mccarthy-31qg86` = `feat/bizomat-unified-platform` | the commit that adds this report | BIZOMAT CI (see the hand-off message); the previous head 0c9df4d: success, 7 of 7 |

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

1. **Medium:** CAD changes merged to `main` are not deployed until the owner deploys (section 6).
2. **Medium:** customers cannot download the installer while CADOS is private (section 7).
3. **Medium:** the two exposed accounts' passwords are unchanged until the people change them (section 3).
4. **Medium:** bizomat.ai shows the CAD app, not the BIZOMAT homepage, until section 5's steps are done.
5. **Low:** the MSI leaves one empty registry key on uninstall (fixed in 0.12.3).
6. **Low:** a brand-new public CAD server lets its first visitor create the owner account (section 4).
