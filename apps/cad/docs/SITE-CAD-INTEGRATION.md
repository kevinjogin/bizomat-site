# How BIZOMAT Site and BIZOMAT CAD work together

The same file is kept in both repositories: `kevinjogin/bizomat-site` and `kevinjogin/bizomat-cad`
(`docs/SITE-CAD-INTEGRATION.md`). Change it in both, in the same week, when a contract below changes.

Written 9 Nov 2026, when the source moved to these two repositories. It describes production as it runs: two Fly.io
apps in the same Fly organization, in different regions. The figures below were read from Fly on 9 Nov 2026
(`fly scale show`, `fly volumes list`), and each repository's Fly configuration matches them.

| | BIZOMAT Site | BIZOMAT CAD |
| --- | --- | --- |
| Repository | `kevinjogin/bizomat-site` | `kevinjogin/bizomat-cad` |
| Fly app | `bizomat` | `cados` |
| Config deployed | `fly.website.toml` | `fly.toml` |
| Serves | `bizomat.ai` (website, sign-in page, Project Management at `/tasks`), and the router in front of everything | CAD MCP: the MCP endpoint, OAuth, the SOLIDWORKS device bridge, CAD pages at `/cad`, installer and update endpoints |
| Fly origin | `https://bizomat.fly.dev` (health only; pages 301 to bizomat.ai) | `https://cados.fly.dev` (all CAD paths, as connectors and computers use it) |
| Region | Sydney (`syd`) | **Amsterdam (`ams`)** |
| Machines | proxy (shared-cpu-1x, 256 MB), web and work (shared-cpu-1x, 512 MB each) | one Machine, `app` (shared CPU, 2 vCPUs, 2048 MB) |
| Volumes | `work_data` (3 GB, on work) | `opensketch_data` (1 GB) |
| Deploy workflow | `bizomat-deploy.yml`, secret `FLY_BIZOMAT_TOKEN`: on every merge to `main` (after CI and the preflight) and by hand | `deploy.yml`, secret `FLY_CADOS_TOKEN`: on every merge to `main` (after the tests and the preflight) and by hand |

**The two apps are on opposite sides of the world.** Every request for `bizomat.ai/cad` goes from the router in Sydney
to `cados` in Amsterdam and back, which adds roughly a quarter of a second, and AI apps and SOLIDWORKS computers in
Australia reach `cados.fly.dev` in Amsterdam. Moving `cados` to Sydney means a new volume in `syd` made from a snapshot
and the Machine moved onto it: a production change of its own, planned and done outside a code deploy (the deploy
preflight stops any deploy that would change the region).

## 1. Network: the router reaches CAD over Fly's private network

```
visitor --https--> bizomat.ai (DNS) --> Fly app bizomat, group proxy (:8080, the only public port)
                                          |-- /tasks/...            --> work  :8002  (same app, private network)
                                          |-- CAD_PATHS (below)     --> http://cados.internal:8080  (Fly app cados)
                                          '-- everything else       --> web   :8003  (same app, private network)

AI apps, SOLIDWORKS computers --https--> cados.fly.dev (or bizomat.ai/cad, or the old cados.kevos.com) --> Fly app cados :8080
```

- `UPSTREAM_CAD = "http://cados.internal:8080"` in the site's `fly.website.toml`. `cados.internal` is Fly's private DNS
  name for the app `cados`; it resolves only inside the same Fly organization. **Both apps must stay in the same Fly
  organization**, and `cados` must keep listening on `::` port 8080 (`python -m opensketch --host :: --port 8080`,
  the CAD Dockerfile's CMD).
- The `cados` Machine must be running for `bizomat.ai/cad` to answer. The CAD `fly.toml` has
  `auto_stop_machines = 'suspend'`, `min_machines_running = 0`: Fly's proxy wakes it for public requests, and the
  add-ins' long polls keep it awake. Requests over the private network do not wake a suspended Machine, so
  `bizomat.ai/cad` can fail while `cados` is suspended. The CAD branch `claude/practical-lovelace-hi2nio` (commit
  `c4a60c7`, "cados always on", not merged) proposes `auto_stop_machines = "off"` for this reason: a production
  change for the owner to decide.
- There is no shared database, queue or secret between the two apps. Each keeps its own data on its own volume:
  `bizomat` has `work_data` (Project Management); `cados` has `opensketch_data` (CAD accounts, OAuth grants, the
  bridge signing key, `bridge.sqlite`).

## 2. Paths: which requests on bizomat.ai belong to CAD

One regular expression, `CAD_PATHS`, decides it. It exists twice in the site repository and the site's tests check
that both copies are equal:

- `infrastructure/proxy/routes.mjs` (the Fly router)
- `src/server/platform-paths.ts` (the website's Cloudflare Worker, not deployed)

It matches `/cad` and `/cad/...`, and CAD's root program paths: `/mcp`, `/solidworks/mcp`, `/oauth/...`, `/v2/...`,
`/healthz`, and `/.well-known/oauth-protected-resource...`, `/.well-known/oauth-authorization-server...`,
`/.well-known/openid-configuration...`. The CAD app's own list of the paths it keeps at the root is
`opensketch/canonical.py` (`KEEP_PREFIXES`) in the CAD repository.

**Never change these paths, the MCP endpoints, the OAuth paths or the device API without changing both repositories
together:** AI app connectors and paired SOLIDWORKS computers depend on them. No page of the website may take one of
these paths (the site's `tests/worker.test.ts`).

## 3. Addresses: CAD lives under bizomat.ai/cad

- The CAD app's public address is `OPENSKETCH_PUBLIC_URL = https://bizomat.ai/cad` (CAD `fly.toml` and the deploy
  workflow). `opensketch/canonical.py` takes the `/cad` prefix off incoming paths and writes it back into every link,
  redirect and cookie it makes. The router never rewrites paths or the Host header.
- Its OAuth issuer is `https://bizomat.ai/cad`; the OAuth metadata is served at the root of bizomat.ai
  (`/.well-known/oauth-protected-resource/cad/mcp`, `/.well-known/oauth-authorization-server/cad`), which is why those
  paths are in `CAD_PATHS`.
- Old hosts keep working for programs: `OPENSKETCH_REDIRECT_HOSTS = cados.fly.dev,cados.kevos.com,cad.bizomat.ai`.
  Pages there answer 301 to `https://bizomat.ai/cad`; MCP, OAuth, `/v2/` (computers) and `/api/` keep answering at
  their root with that host's own address.
- Google sign-in for CAD returns to `https://bizomat.ai/cad/auth/google/callback` (registered in the Google client).
- Sign in with BIZOMAT (`opensketch/bizomat_id.py`): CAD is the client `cad` of the BIZOMAT sign-in provider in the
  website repository (`apps/work/src/worker/company/id-provider.ts`, `docs/company/README.md`). The browser goes to
  `https://bizomat.ai/company/authorize` and comes back to `https://bizomat.ai/cad/auth/bizomat/callback`; the CAD
  server swaps the code at `https://bizomat.ai/company/api/id/token` with the client secret and reads
  `/company/api/id/userinfo`. One secret, two settings: `BIZOMAT_ID_CLIENT_SECRET` on `cados` (Fly secret, or the
  repository secret of the same name, which `deploy.yml` passes on), and its SHA-256 in `WORK_BIZOMAT_ID_CLIENTS` on
  `bizomat`. Until both are set, CAD shows no BIZOMAT button. Accounts link by a confirmed email.
- CAD status in BIZOMAT ERP (`opensketch/erpstatus.py`, section 8): the same secret also turns on CAD's report of each
  account's computers, recent jobs and AI assistants to `POST https://bizomat.ai/company/api/id/cad-status`
  (`apps/work/src/worker/company/id-provider.ts`), which BIZOMAT ERP shows by company (`system/system.ts`, `cadFor`).

## 4. Brand and shared files

- The website's `shared/brand/` is the source of the brand (logo geometry, tokens, fonts). `npm run brand` copies it
  into each product; `npm run brand:check` (site CI) checks the copies.
- The corporate footer text (slogan, short description, copyright line) comes from the website's
  `src/config/platform.ts`; the CAD app repeats it in `opensketch/brand.py`. Change both together.
- CAD pages link to the website's contact page for support (`brand.support_url()`), never to GitHub.

## 5. The CAD copy inside the site repository (`apps/cad`)

The site repository carries `apps/cad`, a byte-for-byte copy of one CAD commit, pinned in `apps/cad-source.json`
(commit `e669cc6`, tree `e97f6f4`: CADOS `main` on 9 Nov 2026, the branch Fly built `cados` from). It came with the
earlier plan to run CAD inside the `bizomat` app. That plan's `cad` process group never ran and was removed from
`fly.website.toml` on 9 Nov 2026, but the site's image (`infrastructure/fly/Dockerfile`) still builds its CAD stages
from `apps/cad`, so the copy stays until those stages go. Nothing there is edited by hand:

- `node scripts/sync-cad.mjs check` proves `apps/cad` is exactly the pinned tree (site CI runs it).
- `node scripts/sync-cad.mjs to <commit> --cados <path to a bizomat-cad clone>` replaces it with another CAD commit,
  in a pull request of its own.

CAD is changed only in `kevinjogin/bizomat-cad`. Removing the CAD stages from the site's Dockerfile (and the
`cad` role from `infrastructure/fly/entrypoint.sh`) lets `apps/cad` and its pin go too, in one pull request of the site
repository with its image and entrypoint tests.

## 6. Installer downloads and updates

- The Windows installer (MSI) is built by the CAD repository (`solidworks.yml`, `installer/`), published as GitHub
  releases there (private: for the owner) and copied for the public to bizomat.ai downloads with
  `tools/laptop/cloudflare.ps1 publish installer` (R2 bucket `bizomat-downloads`).
- `/cad/download/solidworks` (signed in) is served by the CAD app: `OPENSKETCH_INSTALLER_URL`, else a file on the
  `cados` volume (`/data/downloads/`), else the published release record.
- The Companion's update manifest is `/v2/bridge/update.json` on the CAD app, signed by the gateway.

## 7. Checklist when one side changes

| Change | Site | CAD |
| --- | --- | --- |
| A new CAD root path | `CAD_PATHS` in both files, tests | `canonical.py` `KEEP_PREFIXES`, tests |
| CAD's public address | `UPSTREAM_CAD`, docs | `OPENSKETCH_PUBLIC_URL`, OAuth client callbacks |
| Fly app name, organization or private port | `UPSTREAM_CAD` | `fly.toml`, Dockerfile CMD |
| Brand or footer text | `shared/brand/`, `src/config/platform.ts` | `opensketch/brand.py`, the brand copies |
| A deploy | `bizomat-deploy.yml` (bizomat only) | `deploy.yml` (cados only) |
| The CAD status report (fields, limits, matching) | `id-provider.ts` (`cadReport`), `system/system.ts` (`cadFor`) | `opensketch/erpstatus.py` (its limits and `tests/test_erpstatus.py`'s stand-in ERP) |
| The BIZOMAT client secret | `WORK_BIZOMAT_ID_CLIENTS` (its SHA-256) | `BIZOMAT_ID_CLIENT_SECRET` |

## 8. Sign in with BIZOMAT and CAD status in BIZOMAT ERP: switching them on

One secret switches on both: "Continue with BIZOMAT" on CAD's sign-in pages (`opensketch/bizomat_id.py`) and CAD's
status report to BIZOMAT ERP (`opensketch/erpstatus.py`). CAD keeps the secret; BIZOMAT keeps only its SHA-256.

### What CAD reports

- Every 3 minutes, and about 10 to 30 seconds after a change (a computer pairs, connects or drops off, SOLIDWORKS starts
  or stops on it, a command finishes), one `POST https://bizomat.ai/company/api/id/cad-status` with HTTP Basic (client
  `cad` and the secret) for up to 100 accounts (more accounts: more requests).
- For each account: the email, the BIZOMAT account id once the person has signed in with BIZOMAT (`sub`), up to 20
  computers (name, online, SOLIDWORKS version and state such as "2022 SP5, ready", add-in version, last seen; the
  add-in's direct link counts as a computer while it is connected), the last 10 commands (id, the tool's plain name,
  status, time) and up to 20 AI assistants (name, connected, last used). Every text is cut to the ERP's limits.
- Never: a password, key, token or the secret, a file name or path, document content, the Windows version, the open
  document's name (the ERP's optional `open` is left out on purpose: document names can be confidential), or the
  Companion's version (the ERP's contract has no field for it).
- **Only accounts whose email CAD has proven** (`accounts.confirmed_accounts`, the account's `email_verified`): the
  owner's own account (the server's setup), and accounts made or linked by a confirmed Google or BIZOMAT sign-in.
  Accounts whose email was typed (sign-up, invite with a password, added by the owner on the Admin page, early
  testers) are left out, because the ERP matches a report to a person by email, and an email nobody proved could show
  one person's computers to someone else. Such a person is reported once they sign in with BIZOMAT (or Google) once.
  The Admin page counts them as "left out".
- An account reported before and no longer reported (removed, or its email changed) is withdrawn once: sent with
  `emailVerified: false`, no `sub` and empty lists, so the ERP's earlier report matches nobody.
- In its own thread, never on the event loop; each request times out after 10 s; failures back off from 1 minute to
  30 minutes (longer when the ERP sends `Retry-After`); nothing is sent on a server without accounts.

### The owner's steps

1. **Make the secret** (letters and digits only, so nothing needs escaping), and keep it in the password manager:
   `openssl rand -hex 32`, or `python -c "import secrets; print(secrets.token_hex(32))"`.
2. **Its SHA-256** (64 hex characters): in Git Bash or WSL `printf %s 'THE_SECRET' | sha256sum`; in PowerShell
   `-join ([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes('THE_SECRET')) | ForEach-Object { $_.ToString('x2') })`.
3. **BIZOMAT first** (so CAD's first report is accepted), on the Fly app `bizomat`, in Git Bash or WSL (PowerShell
   5.1 drops the quotes inside the JSON):

   ```bash
   fly secrets set --stage --app bizomat \
     'WORK_BIZOMAT_ID_CLIENTS=[{"id":"cad","name":"CAD Automation","secretSha256":"THE_SHA256","redirectUris":["https://bizomat.ai/cad/auth/bizomat/callback"]}]'
   ```

   Then apply it with the website's deploy workflow (kevinjogin/bizomat-site, `bizomat-deploy.yml`, `confirm` =
   `DEPLOY`) or `fly secrets deploy --app bizomat`. Without `--stage` the Machines restart at once. The shape is the
   website's `docs/company/README.md` ("Clients"); the return address must match exactly.
   Check: in BIZOMAT ERP, a company's Products and Engineering page (CAD Automation) no longer says "CAD Automation is
   not reporting to the ERP yet" (it says no report has arrived yet).
4. **Then CAD**, on the Fly app `cados`, once this reporter is merged and deployed (a merge to `main` deploys):
   `fly secrets set --app cados BIZOMAT_ID_CLIENT_SECRET=THE_SECRET` (restarts the Machine at once), or set the
   repository secret `BIZOMAT_ID_CLIENT_SECRET` in kevinjogin/bizomat-cad, which `deploy.yml` passes on with the next
   deploy (Actions > Deploy to Fly.io (cados), `confirm` = `DEPLOY`).
5. **Check it works:**
   - `https://bizomat.ai/cad/login` shows "Continue with BIZOMAT".
   - CAD's Admin page (`https://bizomat.ai/cad/admin`, the owner), panel **BIZOMAT ERP**: "On", then within about
     20 seconds of the start "Last report: <time>, N people", and "No errors". An error says what is wrong: 401, the
     secret and the SHA-256 are not from the same secret; 403, the client is not `cad`; 404, the ERP is not deployed
     with CAD status; "Could not reach", the network.
   - `fly logs --app cados` shows `OpenSketch ERP status: on: ...` and `reported N accounts in 1 requests`.
   - The owner signs in to CAD once with "Continue with BIZOMAT" (links the CAD account to the BIZOMAT account).
   - In BIZOMAT ERP (`https://bizomat.ai/erp`), the company's Products and Engineering page lists the computers under
     "Computers in <company>" for its owner and administrators, and a member sees only their own.

If CAD is switched on first, its reports get 401 and back off (at most 30 minutes); they go through by themselves once
step 3 is done (or at once after a restart of `cados`). To switch both off, unset `BIZOMAT_ID_CLIENT_SECRET` on
`cados`; the ERP keeps the last reports until it is told otherwise.

