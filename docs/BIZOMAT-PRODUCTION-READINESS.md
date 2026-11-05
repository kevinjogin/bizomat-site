# BIZOMAT production-readiness report

_5 Nov 2026, about 20:00 to 21:00 UTC. Covers the security remediation for the public PMO repository, the move of
CAD Automation (CADOS) to bizomat.ai, and the state of the BIZOMAT platform. This repository is private; it names
artifacts and runs but holds no personal data. Nothing here changed production data or DNS, and nothing was deleted._

## 1. Summary

| Area | State |
| --- | --- |
| Exposed database exports (PMO artifacts) | **Found, still downloadable.** Two artifacts. Deleting them needs the owner (section 3) |
| Upload of exports prevented | Fixed and tested on a branch: [jogkev-creator/PMO#1](https://github.com/jogkev-creator/PMO/pull/1). In force once merged (deploys nothing) |
| Affected accounts | Two Project Management accounts. Passwords to change now; forced reset ready in this repository (section 4) |
| Secrets in code and history | None found in the trees or full histories of gocore-website, CADOS and PMO (test fixtures only) |
| OPENSKETCH_PASSWORD | A server-wide master key on the live CAD server, not a customer password. Removal is in [jogkev-creator/CADOS#11](https://github.com/jogkev-creator/CADOS/pull/11) (section 2.5) |
| bizomat.ai | Live since 5 Nov, served by the old `cados` Fly app. The app's address move is ready: [jogkev-creator/CADOS#12](https://github.com/jogkev-creator/CADOS/pull/12) |
| BIZOMAT platform (`bizomat` Fly app) | Built and tested here, not deployed: no Fly token. bizomat.ai now serving CADOS changes the host plan (section 7) |

## 2. Security remediation evidence

### 2.1 The exposure

`jogkev-creator/PMO` is **public**. Its manual workflows uploaded a full export of the Project Management database as
a workflow artifact before each deploy. Any signed-in GitHub user can download a public repository's artifacts.

| Artifact | Run (workflow) | Commit | Created (UTC) | Size | Expires |
| --- | --- | --- | --- | --- | --- |
| 13305479166 `d1-backup-preview-41797102620` | [41797102620](https://github.com/jogkev-creator/PMO/actions/runs/41797102620) | 20a6161 | 4 Nov 08:08 | 6,816 B | 4 Dec 2026 |
| 13305958137 `d1-backup-preview-41797783441` | [41797783441](https://github.com/jogkev-creator/PMO/actions/runs/41797783441) | 905f174 | 4 Nov 08:14 | 6,816 B | 4 Dec 2026 |

- "preview" is the database behind work.kevos.com, so these are the live users' records. `/api/health` there
  reports `"environment":"preview"`.
- Both artifacts were re-checked at 20:5x UTC on 5 Nov: `expired: false`, still listed, still downloadable.
- **Duplicates:** all 32 workflow runs in the repository were listed on 5 Nov. These two are the only database
  artifacts.
  - The 5 other "Provision and publish" runs and both "Admin operations" runs have no artifacts.
  - CI uploads only a Playwright report of synthetic test data, and only when a test fails. Its one failed run has
    none.
  - "Deploy preview" never ran (skipped).
  - `jogkev-creator/CADOS` and `jogkev-creator/gocore-website` are private and upload no database or secrets file
    (`tests/artifact-policy.test.ts` checks all three workflow folders here).
- **What an export holds:** the schema's tables, which include each user's name and email and a PBKDF2-SHA256 password
  hash (100,000 iterations, per-user salt). Session, API and invite tokens are stored only as SHA-256 hashes of 32
  random bytes: a stolen hash cannot be used as a token. Integration secrets are stored as plain text. The content
  was not opened in this session and is not reproduced anywhere.

### 2.2 Prevention

[jogkev-creator/PMO#1](https://github.com/jogkev-creator/PMO/pull/1) (branch `claude/dazzling-mccarthy-31qg86`, head
6362dd2):

- Backups are Cloudflare D1 Time Travel restore points. `wrangler d1 time-travel info` records a bookmark; nothing
  leaves Cloudflare. This applies before every deploy and to the admin-ops `backup` operation.
- `scripts/check-artifact-policy.mjs` fails CI on any `upload-artifact` step whose name or path looks like a
  database, dump, backup, `.env`/`.dev.vars`, `.wrangler`, a secret or a credential. CI runs it on every push.
- CI on 6362dd2: [run 42101635405](https://github.com/jogkev-creator/PMO/actions/runs/42101635405), success.
- It is in force only on the default branch (`claude/pensive-turing-azyn1m`): manual workflows run the default
  branch's files. Merging deploys nothing (`CLOUDFLARE_DEPLOY_ENABLED` is not `true`; production deploys run on `main`
  or by hand). This session's attempt to fast-forward the default branch was stopped by its permission rules as a
  production action, so the merge is the owner's.

This repository runs the same policy over its own and both apps' workflow folders (`tests/artifact-policy.test.ts`).
The CAD data migration workflow never uploads an artifact and deletes its export from the runner.

### 2.3 Secrets, logs and environment handling

- **Scan:** a regex scanner covered 16 rules: private keys, AWS, GitHub, Slack, Teams, Google API and OAuth, Anthropic,
  OpenAI, Stripe, Fly, Cloudflare Turnstile, JWTs, URLs with passwords, and assigned secrets. It ran over the tracked
  tree and every line ever added in the full history of each repository.
  - gocore-website: 18 tree and 15 history matches
  - CADOS: 9 and 7
  - PMO: 5 and 4

  Every match is a test fixture: fake keys and passwords in tests, a PEM header comparison, a stub key in a
  round-trip test, and a demo password that only seeds a local Worker. The three diffs published today (CADOS
  0fc0cc9..6d78e60, this repository 066b8ee..d2e73a8, PMO 64b2cf4..6362dd2) have no matches. The gitleaks binary
  could not be run in this session.
- **Logs:** the migration tooling prints counts, never row content. The CAD request log has method, path, status
  and time. Device and MCP audit rows have ids, never tokens. Findings and fixes from the platform review are in
  `BIZOMAT-SECURITY.md` (F1 to F8).
- **Environment:** the platform entrypoint gives each process group only its own variables and drops privileges
  (`infrastructure/fly/entrypoint.sh`, `check-isolation.sh`). The CAD role is the only one that sees CAD secrets.

### 2.4 Sessions and tokens

The exports hold no usable session, API or invite token (hashes only). The risk is offline guessing of weak
passwords from the hashes, and plain-text integration secrets.

### 2.5 OPENSKETCH_PASSWORD (live CADOS, `opensketch/auth.py` at 0fc0cc9)

What it controls today:

1. **Setup:** with no account yet, the server password is the key to create the owner account. Before that, an old
   password-only sign-in also accepts it.
2. **`/reset`, the real risk:** with accounts, the server password plus any account's email sets a new password for
   that account and signs in as it. It is a master key over every account, the owner's included.
3. **Derived secrets:** `_base_secret()` is the password when it is set. So the owner's server-wide private MCP
   address (`mcp_token()`, `/mcp/<token>`, unless `OPENSKETCH_MCP_TOKEN` is set) and the old password-mode session
   value are HMACs of it. Whoever holds the password can compute that address and use MCP as the owner.
4. **Shown on the Admin page:** since CADOS #10 the owner can view it after sign-in.

It is not a customer-facing password: people sign in with their own accounts, AI apps with OAuth or a per-person
private address keyed by the data folder's random secret, and computers with device keys. It is a shared server
credential.

The open [jogkev-creator/CADOS#11](https://github.com/jogkev-creator/CADOS/pull/11), from another session, removes
it: setup mode until the owner exists, per-person MCP access, suspension. Its CI passed on 3059b80. This report does
not duplicate that change. CAD Automation in this repository (`apps/cad`) still has the password; take #11 in with the
next CAD sync, before cutover.

Until #11 is live: keep the password long and random, do not share it, and use New address on the owner's Settings
page so the owner's private MCP address no longer derives from it. After #11 is live, unset the Fly secret.

## 3. Exposed artifact cleanup: owner actions

1. Delete both artifacts: on each run page (links in 2.1), open Artifacts, then the bin icon. Or from a signed-in
   terminal:

   ```bash
   gh api -X DELETE repos/jogkev-creator/PMO/actions/artifacts/13305479166
   ```

   ```bash
   gh api -X DELETE repos/jogkev-creator/PMO/actions/artifacts/13305958137
   ```

2. Verify: each run's Artifacts list is empty, or `gh api repos/jogkev-creator/PMO/actions/runs/41797102620/artifacts`
   (and `.../41797783441/artifacts`) returns `"total_count": 0`. The download URL then answers 404 or 410.
3. Merge [jogkev-creator/PMO#1](https://github.com/jogkev-creator/PMO/pull/1) so no later manual run uploads another
   export.

Status at the end of this session: **not deleted** (no tool here can delete artifacts). **Not merged** (stopped by
the session's permission rules).

## 4. Affected accounts

Two Project Management accounts existed when the exports were made (PMO's own deployment record of 4 Nov: "2
users / 2 workspaces"). This session did not open the exports.

Now, in production as it is (PMO code):

1. Each of the two people changes their password in Settings. This already ends every other session of theirs
   (`POST /api/me/password` revokes them). Each can also check Settings > Sessions.
2. If any integration with a secret (a webhook) was set up before 4 Nov 08:15 UTC, rotate that secret.
3. Do not log or email anyone's details while doing this. Tell the people only that a security precaution needs a
   new password.

Ready in this repository (commit d2e73a8, `apps/work`; workerd 201 of 201 and Node 296 of 296 tests):

- An account can be flagged to choose a new password (migration 0005). Until it does, every API call and the realtime
  socket answer 403 `PASSWORD_RESET_REQUIRED`, except changing the password and signing out, and the app shows a
  Choose a new password page. The new password must differ from the old one.
- The founder's password reset for a person sets the flag.
- **Security reset** (Sessions page, founder only; `POST /api/admin/security-reset`, 5 an hour): ends every session
  but the founder's and, if asked, flags every other account with a password. It returns counts only and writes one
  audit event.

It reaches production with the platform cutover, or sooner if ported to PMO and deployed by hand (it adds one
column; `publish-cloudflare.yml` applies migrations). Porting it is not done: PMO is the live app and its deploys are
manual.

**Notification:** names, emails and password hashes of two people were publicly downloadable from 4 Nov. Assess
this under the Notifiable Data Breaches scheme (Privacy Act 1988) if the operator is covered, and tell the two
people. This is not legal advice.

## 5. Commits and CI

| Repository and branch | Commit | CI on that exact commit |
| --- | --- | --- |
| gocore-website `claude/dazzling-mccarthy-31qg86` and `feat/bizomat-unified-platform` (code) | d2e73a8 | BIZOMAT CI run 42106881456: success, 7 of 7 jobs |
| gocore-website, this report (docs only) | the commit that adds this file | _see the hand-off message_ |
| CADOS `claude/dazzling-mccarthy-31qg86` ([#12](https://github.com/jogkev-creator/CADOS/pull/12)) | 6d78e60 | Tests and SOLIDWORKS add-in: success, 10 of 10 checks |
| CADOS `main` (live on Fly) | 0fc0cc9 | Deploy to Fly.io run 42009555931: success |
| PMO `claude/dazzling-mccarthy-31qg86` ([#1](https://github.com/jogkev-creator/PMO/pull/1)) | 6362dd2 | CI run 42101635405: success |
| PMO `claude/pensive-turing-azyn1m` (default) | 64b2cf4 | unchanged |

Local runs on the same commits:

- CADOS: pytest 308 passed, the slow end-to-end pytest 2 passed, npm test passed, add-in and Companion 29 of 29.
- Project Management: lint, typecheck, workerd 201 of 201, Node 296 of 296, build.
- Website: `npm test` 1,493 of 1,493.

## 6. Live check (5 Nov 2026, about 20:30 UTC)

| Address | Answer |
| --- | --- |
| https://bizomat.ai/ | 200 from Fly: the CADOS product page (`CADOS by KEVOS`). `/healthz` `{"ok":true,"version":"0fc0cc9"}`. Certificate Let's Encrypt, `CN=bizomat.ai`, until 3 Feb 2027 |
| https://bizomat.ai/.well-known/oauth-protected-resource/mcp | Names `https://cados.kevos.com/mcp`: a connector added at bizomat.ai/mcp fails its sign-in check until CADOS#12 is live |
| https://cados.kevos.com/ | 200 from Fly, same app and version. Certificate Let's Encrypt until 3 Feb 2027 |
| https://cados.fly.dev/healthz | 200, same version |
| https://www.bizomat.ai/, cad.bizomat.ai, work.bizomat.ai, bizomat.fly.dev | No answer (no DNS record, or no app) |
| https://kevos.com/ | 200 from Cloudflare: `KEVOS® \| Make Difficult Work Simple` (the KEVOS 2.0 site on `main`). Certificate Google Trust Services until 2 Feb 2027 |
| https://work.kevos.com/api/health | 200 `{"status":"ok","db":"ok","environment":"preview"}` |
| GitHub release downloads of CADOS (installer, add-in) | 404 without a GitHub sign-in: the CADOS repository is private |

## 7. Remaining deployment requirements

What changed: the owner pointed bizomat.ai at the old `cados` Fly app. The platform plan put the BIZOMAT website on
bizomat.ai and CAD Automation on cad.bizomat.ai (`BIZOMAT-ARCHITECTURE.md`). Connectors, add-ins and Companions set
up with bizomat.ai from now on depend on bizomat.ai serving the CAD app's program paths (`/mcp*`, `/oauth/*`,
`/.well-known/oauth-*`, `/v2/*`, `/mcp/sw/*`, and CAD's `/api/*`). **Owner decision needed** before cutover:

- (a) bizomat.ai stays the CAD product and the platform website takes another host; or
- (b) at cutover the platform proxy routes those program paths on bizomat.ai to the cad group. The website must then
  not use `/api/` on bizomat.ai. Ideally, choose before many people connect.

In order, all the owner's:

1. Merge [jogkev-creator/PMO#1](https://github.com/jogkev-creator/PMO/pull/1) and delete the two artifacts
   (section 3). Ask both people to change their passwords (section 4).
2. Merge [jogkev-creator/CADOS#12](https://github.com/jogkev-creator/CADOS/pull/12). Fly deploys `main` itself. Then:
   - bizomat.ai's metadata names bizomat.ai, and cados.kevos.com's still names cados.kevos.com
   - `https://cados.kevos.com/docs` answers 301 to bizomat.ai
   - if bizomat.ai still names cados.kevos.com, a Fly secret `OPENSKETCH_PUBLIC_URL` overrides fly.toml: set it to
     `https://bizomat.ai`
   - keep the DNS of cados.kevos.com and cados.fly.dev
3. Review and merge [jogkev-creator/CADOS#11](https://github.com/jogkev-creator/CADOS/pull/11). Then unset
   `OPENSKETCH_PASSWORD` on the `cados` app.
4. The installer download: CADOS is private, so its GitHub release assets are not public. Set
   `OPENSKETCH_INSTALLER_URL` on the app to a public location, or publish the MSI from a public repository.
5. The platform:
   - choose (a) or (b) above
   - `FLY_API_TOKEN` in this repository, then "BIZOMAT deploy"
   - Cloudflare token for the Project Management data move: dry run, then apply
   - CAD data move
   - smoke tests
   - DNS one host at a time (`BIZOMAT-DEPLOYMENT.md`)
   - merge to `main` only when kevos.com should show BIZOMAT
6. Legal: operator entity, ABN, address and contact; BIZOMAT trade mark search; terms and privacy review
   (`BIZOMAT-PROJECT-STATUS.md`, section 7). CAD Automation is AGPL-3.0-only and its repository is now private:
   offering it as a network service obliges offering its source to its users.

## 8. Data migration readiness

- **Repeatable:** both migrations are dry-run first and idempotent.
  - Project Management: D1 export, verified import into node:sqlite, R2 copy with checksums; reruns skip what
    matches and refuse what differs.
  - CAD: byte-for-byte copy with refusals.
  - Dry run: 45 of 45 checks. CAD round trip in the image: passed.
  - Neither run has touched production; both wait for credentials.
- **Backups:**
  - Project Management: a D1 Time Travel restore point, recorded before every apply and every deploy (30 days, never
    leaves Cloudflare).
  - CAD: a Fly volume snapshot before the copy. The old apps and their data stay untouched until the rollback window
    has passed.
- **Rollback:** `BIZOMAT-ROLLBACK.md`: DNS back to the old apps, which keep running, and restore points for data.
  Nothing is deleted during migration.

## 9. CI results on the exact commits

| Commit | Runs | Result |
| --- | --- | --- |
| gocore-website d2e73a8 | BIZOMAT CI [42106881456](https://github.com/jogkev-creator/gocore-website/actions/runs/42106881456): website (check, 1,493 tests, build), work (lint, typecheck, workerd and Node tests, builds), cad pytest (main) and (worker processes), cad npm test, proxy and platform files, image and local stack (image, entrypoint isolation, migration round trip, smoke test through the proxy, secret isolation) | Success, 7 of 7 |
| CADOS 6d78e60 | Tests [42106519588](https://github.com/jogkev-creator/CADOS/actions/runs/42106519588) and [42106576403](https://github.com/jogkev-creator/CADOS/actions/runs/42106576403); SOLIDWORKS add-in [42106519616](https://github.com/jogkev-creator/CADOS/actions/runs/42106519616) and [42106576661](https://github.com/jogkev-creator/CADOS/actions/runs/42106576661) (build and tests, Windows MSI) | Success, 10 of 10 |
| PMO 6362dd2 | CI [42101635405](https://github.com/jogkev-creator/PMO/actions/runs/42101635405) and [42106607733](https://github.com/jogkev-creator/PMO/actions/runs/42106607733) | Success |

The commit that adds this report changes documentation only. Its own CI result is given at hand-off.

## 10. Outstanding production risks

1. **High:** the two artifacts are public until deleted; personal data of two people.
2. **High:** the live CAD server's `OPENSKETCH_PASSWORD` is a master key over every account (2.5), until CADOS#11 is
   live.
3. **High:** connectors set up at bizomat.ai fail OAuth until CADOS#12 is live, because the metadata names
   cados.kevos.com.
4. **Medium:** installer downloads fail for customers while CADOS is private (no public release assets), unless
   `OPENSKETCH_INSTALLER_URL` is set.
5. **Medium:** bizomat.ai now serving the CAD app conflicts with the platform host plan (section 7).
6. **Medium:** Project Management's production deploy path is manual. The forced-reset feature is not in PMO.
7. **Low:** Google sign-in, if turned on later, needs `https://bizomat.ai/auth/google/callback` added to the Google
   OAuth client. People signed in on cados.kevos.com sign in once more on bizomat.ai.
