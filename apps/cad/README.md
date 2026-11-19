# BIZOMAT – CAD

BIZOMAT CAD Automation: the SOLIDWORKS MCP server, the CAD automation engine, the BIZOMAT CAD add-in for SOLIDWORKS,
the Companion and the Windows installer. AI apps (Claude, ChatGPT and other MCP clients) call its `sw_` tools; the
server checks each sketch and feature with its own CAD kernel and sends the work to SOLIDWORKS on the person's own
computer, where the add-in builds native SOLIDWORKS features. It runs on the Fly.io app **`cados`** in Amsterdam (`ams`).

Formerly CADOS by KEVOS; the code keeps OpenSketch as its internal name (the `opensketch` package, `OPENSKETCH_*`
settings, the add-in's COM ids and file names). The BIZOMAT website and Project Management are in a separate
repository, [`kevinjogin/bizomat-site`](https://github.com/kevinjogin/bizomat-site), on the Fly app `bizomat`. How the
two work together: [docs/SITE-CAD-INTEGRATION.md](docs/SITE-CAD-INTEGRATION.md).

- Repository: `kevinjogin/bizomat-cad` (private). Default branch `main`.
- Production: Fly app `cados`, region `ams` (Amsterdam), one Machine, deployed by hand from `main` with `fly.toml`.
- Public address: <https://bizomat.ai/cad> (through the `bizomat` router). Origin: <https://cados.fly.dev> (every CAD
  path; connectors and paired computers use it). Old hosts kept for programs: `cados.kevos.com`, `cad.bizomat.ai`.
- Versions on `main` (9 Nov 2026): server 0.8.0 (`pyproject.toml`), add-in and installer 0.13.0
  (`solidworks/Directory.Build.props`).
- Project instructions for AI coding agents: [CLAUDE.md](CLAUDE.md). The earlier product README (what the AI can do,
  install and use): [docs/README-cad-guide.md](docs/README-cad-guide.md).

## Contents

1. [Product purpose](#1-product-purpose)
2. [Architecture](#2-architecture)
3. [How the Site and CAD communicate](#3-how-the-site-and-cad-communicate)
4. [Folder structure](#4-folder-structure)
5. [Dependencies](#5-dependencies)
6. [Local setup](#6-local-setup)
7. [Environment variables and secrets](#7-environment-variables-and-secrets)
8. [Testing](#8-testing)
9. [Fly.io deployment](#9-flyio-deployment)
10. [The add-in, the installer and releases](#10-the-add-in-the-installer-and-releases)
11. [GitHub Actions](#11-github-actions)
12. [Recovery and maintenance](#12-recovery-and-maintenance)
13. [Repository history](#13-repository-history)
14. [Security rules](#14-security-rules)

## 1. Product purpose

- **SOLIDWORKS MCP server** (`opensketch/mcp_server.py`, `sw_tools.py`): one MCP server with 31 tools at `/mcp` (and
  the older `/solidworks/mcp`), signed in with OAuth (`mcpauth.py`): sketches, features, assemblies, drawings,
  exports, previews, measurements, the self test.
- **CAD automation engine**: the feature registry (`opensketch/features/`), the build123d/OpenCascade kernel
  (`geometry.py`, `assembly.py`, `inspection.py`, `measure.py`, `preview.py`, `importer.py`) and the sketch solver
  (`opensketch/solver/`, JavaScript). Every feature is checked and its result predicted before SOLIDWORKS sees it.
- **Device bridge** (`swbridge.py`, `devicebridge.py`): the link that paired Windows computers poll over outgoing HTTPS
  (`/v2/device/*`, signed both ways), with every command recorded in `bridge.sqlite`.
- **Accounts and pages**: sign-in, Sign in with BIZOMAT, Google sign-in, invites, the owner's Admin page, the signed-in app (Home, CAD
  Assistant, SOLIDWORKS, Tools, History, Settings) and the public product pages under `/cad`.
- **Status in BIZOMAT ERP** (`erpstatus.py`): each account's computers, recent jobs and AI assistants, reported to
  BIZOMAT ERP in a background thread when the BIZOMAT client secret is set (only accounts whose email is proven).
- **BIZOMAT CAD for Windows** (`solidworks/`): the SOLIDWORKS add-in (C#, .NET Framework 4.8, COM `ISwAddin`), the
  Companion tray app (`KEVOS.Companion.exe`) that holds the signed link and hands commands to the add-in over a
  local named pipe, and `OpenSketchSW.exe`.
- **Windows installer** (`installer/`): one WiX 5 MSI, "BIZOMAT CAD Automation for SOLIDWORKS", that installs the
  add-in and the Companion; its build, development signing and release.

## 2. Architecture

```
AI app (Claude, ChatGPT, ...) --MCP over https--> /mcp  (bizomat.ai/cad, cados.fly.dev)
                                                    |
  Fly app cados (ams), one Machine ---------------------------------------------------------------
  |  python -m opensketch --supervise   :8080 (listens on ::, public through Fly and private as cados.internal)
  |    MCP tools -> feature checks (kernel, solver) -> command queue (swbridge / devicebridge)
  |    volume opensketch_data at /data: accounts, OAuth grants, keys, bridge.sqlite, uploads
  ------------------------------------------------------------------------------------------------
                                                    ^
                     outgoing https long poll       |  signed commands and results
                                                    |
  Windows computer: KEVOS Companion (tray, paired) --named pipe--> BIZOMAT CAD add-in inside SOLIDWORKS
```

- **One process, supervised.** The image's CMD is `python -m opensketch --host :: --port 8080 --no-browser
  --supervise`: `supervisor.py` restarts the server after 120 s without a health answer.
- **CAD work** runs in worker processes (`cadworker.py`), at most `OPENSKETCH_CAD_LANES` at once, or in threads with
  `OPENSKETCH_CAD_WORKERS=0`.
- **SOLIDWORKS is the master copy.** The server keeps no SOLIDWORKS document; reads export a STEP of the bodies that
  changed.
- **Contracts:** the feature format (`docs/DOCUMENT.md`) between the AI, the kernel and the add-in; the bridge
  protocol (`docs/BRIDGE-PROTOCOL.md`) between the server, the Companion and the add-in. Change the document first.
- **Production, read from Fly on 9 Nov 2026 (`fly scale show`, `fly volumes list`):** one Machine in **Amsterdam
  (`ams`)**, shared CPU, 2 vCPUs, 2048 MB, and the volume `opensketch_data` (1 GB) in `ams`. `fly.toml` matches it:
  `primary_region = 'ams'`, `[[vm]] size = 'shared-cpu-2x'`, `memory = '2gb'`, the volume at `/data`,
  `auto_stop_machines = 'suspend'`, `min_machines_running = 0`. (Until 9 Nov 2026 the file said `syd` and
  performance-1x; the app was never in Sydney.)
- **The app is far from Sydney.** The `bizomat` router (in `syd`) reaches it in Amsterdam, which adds roughly a quarter
  of a second to each `bizomat.ai/cad` request. Moving it to `syd` means a new volume made from a snapshot: a planned
  production change of its own, never part of a deploy ([docs/SITE-CAD-INTEGRATION.md](docs/SITE-CAD-INTEGRATION.md)).
- **Not deployed:** `cloudflare/mcp` (a Cloudflare Worker and Container to host CAD on Cloudflare; rehearsed locally on
  7 Nov 2026, never deployed) and `windows/` (running the server on one Windows PC).

## 3. How the Site and CAD communicate

In short (the full contract, with a change checklist: [docs/SITE-CAD-INTEGRATION.md](docs/SITE-CAD-INTEGRATION.md)):

- The `bizomat` app's router sends CAD's requests on bizomat.ai to this app over Fly's private network,
  `http://cados.internal:8080`. Keep this app in the same Fly organization as `bizomat`, listening on `::` port 8080.
- Its public address is `OPENSKETCH_PUBLIC_URL = https://bizomat.ai/cad`. `opensketch/canonical.py` takes the `/cad`
  prefix off and writes it back into links, redirects and cookies; the OAuth issuer is `https://bizomat.ai/cad`.
- The root paths it keeps on bizomat.ai (`/mcp`, `/solidworks/mcp`, `/oauth/...`, `/v2/...`, `/healthz`, the OAuth
  `/.well-known/` documents) are listed in the site's `CAD_PATHS` and in `canonical.py` (`KEEP_PREFIXES`). Never
  change the MCP endpoints, OAuth paths or the device API without the site repository: AI apps and paired computers
  depend on them.
- The two apps share no database, queue or secret. The footer text and brand follow the website's
  `src/config/platform.ts` and `shared/brand/` (`opensketch/brand.py` repeats them).
- The site repository holds a pinned, read-only copy of one commit of this repository (`apps/cad`, commit `e669cc6`).
  Change CAD only here.
- A suspended `cados` Machine is not woken by the router's private-network requests; see the integration document
  (the unmerged branch `claude/practical-lovelace-hi2nio` proposes keeping it always on).

## 4. Folder structure

| Path | What |
| --- | --- |
| `opensketch/` | The server: `server.py` (app, routes), `mcp_server.py`, `sw_tools.py`, `sw_selftest.py` (MCP), `swbridge.py`, `devicebridge.py` (computers), `auth.py`, `accounts.py`, `oauth.py`, `mcpauth.py` (sign-in), `canonical.py` (the `/cad` prefix), `site.py`, `app_pages.py`, `brand.py` (pages), the kernel modules, `features/`, `solver/`, `cadworker.py`, `supervisor.py`, `persist.py`, `store.py`, `static/` |
| `tests/` | Python tests (`pytest`), including the stand-in Companion `bridge_fakes.py` and the slow end-to-end tests |
| `solidworks/` | BIZOMAT CAD for Windows: `src/Addin` (the SOLIDWORKS add-in), `src/Companion`, `src/App` (`OpenSketchSW.exe`), `src/Core`, `src/Shared`; `tests/`; `package/` (manual package, launcher macro); `build.sh`; `Directory.Build.props` (the version) |
| `installer/` | The MSI: `KEVOS-Bridge.wxs` (WiX 5), `build.ps1`, `sign-development.ps1`, `signing/` (the public development certificate and its notes) |
| `backups/installer/` | Released installers kept as they were: `original/2026-11-07` (0.13.0, the released MSI) and `development-signed/`. Never overwritten |
| `docs/` | The feature format, the bridge protocol, add-in architecture, install, build, signing, security, versions, release notes, test report, troubleshooting; the integration contract; the earlier README |
| `windows/` | Running the server on one Windows PC: `setup.ps1`, `start.ps1`, `update-addin.ps1`, `connect-claude.ps1` |
| `tools/laptop/` | The owner's laptop tools: `bizomat.ps1` (setup, deploys, status), `cloudflare.ps1` (publishing installers, the Cloudflare plan) |
| `cloudflare/mcp/` | The Cloudflare Worker and Container for CAD (not deployed) |
| `.github/workflows/`, `.github/scripts/` | CI, the add-in and installer builds, releases, the deploy (section 11); `fly-preflight.py`, `kevos-domain.sh`, `test-install.ps1` |
| `Dockerfile`, `fly.toml` | The production image (Python 3.12, with the add-in built in a .NET 8 stage) and the Fly configuration |
| `pyproject.toml`, `requirements.txt`, `requirements-dev.txt`, `package.json` | Python package and pinned dependencies (with hashes); the solver's Node package |

## 5. Dependencies

- **Python 3.12** with the pinned packages in `requirements.txt` (the image) and `requirements-dev.txt` (tests),
  installed with hashes. Main libraries: FastAPI/Starlette, the MCP SDK, build123d and OpenCascade (OCP), uvicorn.
- **Node.js 20 or newer** for the sketch solver (`npm test`); Node 22 for `cloudflare/mcp`.
- **.NET 8 SDK** to build and test the add-in and Companion (`bash solidworks/build.sh test`, on Linux or Windows; the
  targets are .NET Framework 4.8 with the SOLIDWORKS 2022 interop embedded).
- **Windows with WiX 5** to build the MSI (`installer/build.ps1`; CI does it on `windows-latest`). SignTool from the
  Windows SDK for signing.
- **Docker** for the production image; `flyctl` for deploys and operations.
- **On each user's computer:** Windows x64 and SOLIDWORKS (built against the 2022 interop).
- **External services:** Fly.io (hosting), BIZOMAT sign-in and BIZOMAT ERP's CAD status on bizomat.ai (optional), Google sign-in (optional), Cloudflare R2 for public installer downloads
  (`bizomat-downloads`, published from the laptop), Cloudflare DNS for the old hosts.

## 6. Local setup

```bash
git clone https://github.com/kevinjogin/bizomat-cad.git
cd bizomat-cad
python3.12 -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt && pip install --no-deps -e .
npm ci
python -m opensketch --no-browser      # http://127.0.0.1:8000
```

There is no server password. Until the first account exists the server is open only to this machine; a public server
(`OPENSKETCH_PUBLIC_URL` set, or any outside request) shows only the setup page, where the first person to create an
account becomes the owner.

The production image:

```bash
docker build -t bizomat-cad .
docker run -p 8080:8080 -e OPENSKETCH_PUBLIC_URL=http://localhost:8080 -v bizomat-cad-data:/data bizomat-cad
```

The add-in and Companion: `bash solidworks/build.sh test` (.NET 8 SDK). The MSI, on Windows: `installer/build.ps1`
(steps and options in [docs/KEVOS-BUILD.md](docs/KEVOS-BUILD.md)). The Windows PC server: [windows/README.md](windows/README.md).

## 7. Environment variables and secrets

Values are never in the repository. Production secrets are Fly secrets of the app `cados` (`fly secrets list -a cados`
shows names only).

**Server settings** (`[env]` in `fly.toml`, Fly secrets, or the environment of a local run)

| Name | Meaning |
| --- | --- |
| `OPENSKETCH_DATA` | Data folder: accounts, OAuth grants, keys, `bridge.sqlite`, uploads (`/data` on Fly) |
| `OPENSKETCH_PUBLIC_URL` | The public address: `https://bizomat.ai/cad` in production |
| `OPENSKETCH_REDIRECT_HOSTS` | Old hosts that keep working for programs and send pages to the public address |
| `OPENSKETCH_ALIAS_HOSTS`, `OPENSKETCH_MCP_URL` | Other addresses of the same server; the connector address shown to people |
| `OPENSKETCH_REQUIRE_SIGNIN` | Treat the server as public (setup page first) even without a public address |
| `OPENSKETCH_ACCESS_CODE` | Optional early access code (secret) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional Google sign-in (secret; callback `https://bizomat.ai/cad/auth/google/callback`) |
| `BIZOMAT_ID_CLIENT_SECRET` | Optional Sign in with BIZOMAT and the status report to BIZOMAT ERP (secret, at least 32 characters; its SHA-256 is in the BIZOMAT side's `BIZOMAT_ID_CLIENTS`; callback `https://bizomat.ai/cad/auth/bizomat/callback`; the owner's steps: [docs/SITE-CAD-INTEGRATION.md](docs/SITE-CAD-INTEGRATION.md), section 8). `BIZOMAT_ID_CLIENT_ID` (default `cad`) and `BIZOMAT_ID_URL` (default `https://bizomat.ai/company`) are for a test server |
| `OPENSKETCH_KEY_SECRET` | Optional key for the secrets the server stores (secret; else a random key in the data folder) |
| `OPENSKETCH_MCP_TOKEN`, `OPENSKETCH_PASSWORD` | Legacy: the seed of an old owner's private address. No server password is used |
| `OPENSKETCH_INSTALLER_URL`, `OPENSKETCH_ADDIN_URL`, `OPENSKETCH_SW_ZIP` | Where the installer, the add-in update and the manual package come from |
| `OPENSKETCH_CAD_WORKERS`, `OPENSKETCH_CAD_LANES`, `OPENSKETCH_CAD_LIMIT`, `OPENSKETCH_WORKER_MAX_MB`, `OPENSKETCH_JOB_ROOM_MB`, `OPENSKETCH_BUILT_CACHE_MB` | CAD worker processes and memory limits |
| `OPENSKETCH_MIN_FREE_MB`, `OPENSKETCH_DISK_RESERVE_MB` | Disk space guards |
| `OPENSKETCH_BOOT_SECONDS`, `OPENSKETCH_HANG_SECONDS` | The supervisor's start and hang limits |
| `OPENSKETCH_CLIENT_IP_HEADER` | The header that carries the visitor's address behind a trusted proxy |
| `OPENSKETCH_MAX_TESTERS` | Limit on early access accounts |
| `OPENSKETCH_PERSIST_URL`, `OPENSKETCH_PERSIST_SECONDS`, `OPENSKETCH_PERSIST_EMPTY_OK` | Copying the data folder to an object store (the Cloudflare plan only) |
| `OPENSKETCH_VERSION` | Set at build time (`--build-arg`); reported by `/healthz` |

**GitHub Actions (Settings > Secrets and variables > Actions)**

| Name | Used by |
| --- | --- |
| `FLY_CADOS_TOKEN` | `deploy.yml`, `fly-status.yml`, `domain.yml`: a deploy token for the `cados` app only |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENSKETCH_ACCESS_CODE`, `BIZOMAT_ID_CLIENT_SECRET` | `deploy.yml`, optional: passed to Fly as the app's secrets (staged, applied by that deploy) |
| `KEVOS_SIGN_PFX_BASE64`, `KEVOS_SIGN_PASSWORD` | `solidworks.yml`, optional: a code-signing certificate (.pfx, base64) and its password. Without them the MSI is built unsigned |
| `CLOUDFLARE_API_TOKEN` | `domain.yml` only (DNS for an extra host) |

**On the Windows development computer**: `KEVOS_SIGN_THUMBPRINT` (the certificate in the Windows certificate store
that `installer/build.ps1` signs with). The private key never leaves that store.

## 8. Testing

```bash
pytest -q                          # Python tests (needs node for the sketch solver)
pytest -q -m slow                  # the slow end-to-end tests (the C# Companion and add-in link need the .NET 8 SDK)
npm test                           # the sketch solver
bash solidworks/build.sh test      # the add-in and Companion (.NET 8 SDK)
cd cloudflare/mcp && npm ci && npm run check   # the Cloudflare Worker (not deployed)
```

On Windows: `installer-test.yml` builds the MSI, signs it with a throwaway certificate and installs and removes it
(`.github/scripts/test-install.ps1`). The checklist for a real SOLIDWORKS computer is in
[docs/KEVOS-TEST-REPORT.md](docs/KEVOS-TEST-REPORT.md), section 4.

## 9. Fly.io deployment

**Production is the Fly app `cados`, one Machine, deployed from `main` by GitHub Actions only** (`deploy.yml`; the
owner's decision of 16 Nov 2026). A merge to `main` that changes what the image is built from (`Dockerfile`,
`.dockerignore`, `requirements.txt`, `opensketch/`, `solidworks/` but not its tests) or `fly.toml` deploys, once the
tests and the image's smoke test pass. Docs, workflows, scripts, tests, the installer and backups reach `main` without
restarting production. Keep `main` releasable. A merge commit whose message contains `[skip ci]` is not deployed. No
other branch, tag or schedule deploys, and Fly never builds or deploys anything by itself.

**One-time setup**

1. Fly dashboard > `cados` > Tokens > Create deploy token. GitHub: Settings > Secrets and variables > Actions > New
   repository secret `FLY_CADOS_TOKEN`.
2. Settings > Actions > General: allow Actions (they were turned off for the move, so that copying the branches
   started no workflow).
3. **One deploy source.** No GitHub repository may be connected to the `cados` app in Fly (Fly dashboard > `cados` >
   Settings). One was on 15 and 16 Nov 2026: Fly then built and deployed every push to `main` itself, untested, as
   version `dev`. **The owner disconnected it on 16 Nov 2026**, and Fly's API confirmed it before and after the merge
   of pull request #13 (`hasDeploymentSource: false`, `deploymentSource: null`; that merge made no release). GitHub
   Actions is now the single deployment authority: never connect one again. `fly-status.yml` checks this on every run
   and fails when Fly reports a deployment source; the deploy workflow warns when production reports `dev` and reports
   any release it did not make.

**Deploy**: automatically on such a merge, or by hand: Actions > **Deploy to Fly.io (cados)** > Run workflow on
`main`, `action` = `deploy`, `confirm` = `DEPLOY` (to redeploy, or after a change the paths leave out). It:

1. runs the tests (`tests.yml`) and, beside them, **builds the image once** on the runner (`OPENSKETCH_VERSION` = the
   commit's first 7 characters), **smoke-tests it as a container** (`.github/scripts/image-smoke.sh`: the version, MCP
   refusing a request without a token, the OAuth metadata, the product page, the installer download behind sign-in, an
   old host's redirect, the add-in package) and pushes it to `registry.fly.io/cados:sha-<commit>`. Only a deploy by
   hand can skip the tests (`skip_tests`); the smoke test always runs;
2. runs the **preflight** (`.github/scripts/fly-preflight.py`): reads the live Machine and compares it with
   `fly.toml`. It stops, deploying nothing, when the deploy would add or remove a Machine or change its size, memory or
   region. Only a deploy by hand can let a deliberate change through (`allow_machine_change` = `YES`);
3. records the image the Machine runs now and passes the optional secrets to Fly;
4. deploys **that exact image**, without building: `flyctl deploy --app cados --config fly.toml --image
   registry.fly.io/cados:sha-<commit> --ha=false` (the one Machine is updated in place with its volume; CAD MCP is
   offline for about 15 s; add-ins and Companions reconnect by themselves);
5. **core checks** (`.github/scripts/cados-checks.sh core`): `https://cados.fly.dev/healthz` reports the commit within 3
   minutes, the Machine runs the pushed image digest, MCP answers 401 with a Bearer challenge, the OAuth metadata
   answers. If one fails, it **deploys the recorded image again** (automatic rollback) and the run fails;
6. checks through bizomat.ai (the app's page, the installer download behind sign-in, the OAuth metadata of `/cad/mcp`)
   and Sign in with BIZOMAT; a failure there fails the run without a rollback (the website may be the cause);
7. reports any release it did not make (Fly building by itself).

One deploy at a time (concurrency `deploy-cados`): a running deploy always finishes, and of the runs waiting behind it
only the newest is kept. A re-run of a commit that is already live deploys nothing. Two more modes by hand:
`action` = `rollback` with `image` = `sha-<commit>` (or a `deployment-<id>` from `flyctl releases -a cados --image`)
deploys an image already in the registry, no build; `action` = `build-only`, on any branch, builds, smoke-tests and
pushes `check-<commit>-<run>` and deploys nothing. The laptop's `bizomat.ps1 deploy cad` starts this workflow with the
GitHub CLI; it never deploys from the laptop.

**`fly.toml` matches production** (9 Nov 2026): the preflight passes for it, so a deploy ships new code onto the same
Machine in `ams`. A change to the Machine (size, memory or region) is a decision of its own: change `fly.toml` in a
pull request, then deploy with `allow_machine_change` = `YES`. (Each CAD worker process uses about 400 MB; with less
than 2 GB set `OPENSKETCH_CAD_WORKERS = "0"`.)

`fly-status.yml` (by hand) prints the Machines, volumes, secret names, releases, logs and `/healthz`, then checks
that no repository is connected to `cados` in Fly (`.github/scripts/fly-deploy-source.sh`: one read-only query to
Fly's API with the deploy token, which reaches curl on standard input; only plain fields are printed). It passes with
no deployment source, fails with an error naming what is connected, and fails without claiming anything when Fly's
answer cannot be read. It changes, disconnects and deploys nothing. `domain.yml` (by hand) gives the app an extra host
on a Cloudflare domain. Neither touches `bizomat`.

## 10. The add-in, the installer and releases

- **Version:** `solidworks/Directory.Build.props` (0.13.0 on `main`). Bump it whenever the add-in learns a command;
  the server tells people when their add-in is too old (`swbridge.addin_too_old`).
- **Build:** `solidworks.yml` builds and tests the add-in on Linux and keeps the package as an artifact; its
  `installer` job builds the MSI on Windows (`installer/build.ps1`) as `BIZOMAT-CAD-Automation-<version>-x64.msi`,
  the stable `BIZOMAT-CAD-Automation-x64.msi` and the 0.12 name `CADOS-for-SOLIDWORKS-x64.msi`, each with a
  `.sha256` file and `release.json`. The UpgradeCode never changes, so a new MSI upgrades CADOS for SOLIDWORKS and
  KEVOS Bridge installs.
- **Signing:** with the repository secrets `KEVOS_SIGN_PFX_BASE64` and `KEVOS_SIGN_PASSWORD` the MSI and the three
  own binaries are signed in CI; without them it is unsigned. Development signing runs on the Windows development
  computer with a self-signed `CN=BIZOMAT Development` certificate from its certificate store
  (`installer/sign-development.ps1`, [docs/BIZOMAT-DEV-SIGNING.md](docs/BIZOMAT-DEV-SIGNING.md)). Only the public
  certificate (`installer/signing/BIZOMAT-Development.cer`) is in the repository.
- **Releases (private, for the owner):** a push to `main` that changes `solidworks/` or `installer/` replaces the
  `addin-latest` and `bridge-latest` releases; a tag `bridge-v<version>` makes a versioned release. The tags
  `addin-latest` and `bridge-latest` were copied from CADOS. The release files of `jogkev-creator/CADOS` stay there;
  the 0.13.0 MSI it released is also in `backups/installer/original/2026-11-07` (same SHA-256).
- **Public downloads:** `tools/laptop/cloudflare.ps1 publish installer -File <msi>` copies the MSI, its checksum and
  the release record to bizomat.ai downloads (R2 bucket `bizomat-downloads`). Signed-in people download through
  `/cad/download/solidworks`.
- **Backups:** `backups/installer/` keeps every released and development-signed MSI as it was. Never overwrite or
  delete them.

## 11. GitHub Actions

| Workflow | Starts on | Does |
| --- | --- | --- |
| `tests.yml` Tests | pull request, push to a branch other than `main`, by hand, called by the deploy | `pytest` (main and slow), `npm test`, the Cloudflare Worker's check |
| `solidworks.yml` SOLIDWORKS add-in | push of `solidworks/`, `installer/` or itself (any branch), tags, pull request, by hand | Add-in build and tests; the MSI on Windows; releases on `main` and on tags |
| `installer-test.yml` Installer test | pull request and push (not `main`) touching the installer, by hand | Builds, test-signs, installs and removes the MSI on Windows |
| `deploy.yml` Deploy to Fly.io (cados) | push to `main` changing the image's files or `fly.toml`; by hand (deploy, rollback, build-only) | Tests and one image build with a smoke test, then preflight, deploy of that image, checks and automatic rollback (section 9) |
| `fly-status.yml` Fly status | by hand | Read-only status of `cados`; fails if a repository is connected to it in Fly |
| `domain.yml` | by hand | An extra host for `cados` on a Cloudflare domain |
| `live-tls.yml` Live TLS | daily 07:41 Sydney, by hand | Checks the certificates of the public addresses (read-only) |

**Ruleset for main** (`.github/rulesets/main.json`, kept in step with `tests.yml` by `tests/test_ruleset.py`): a
pull request is required, with the four `tests.yml` checks passing (pytest main and worker processes, npm test, the
Cloudflare Worker; reported by GitHub Actions only); force pushes and deleting `main` are blocked; nobody bypasses it.
No approval is required, because GitHub does not let an account approve its own pull request. `tests.yml` runs on every
pull request, docs-only ones included, so the required checks always report. The owner applies it (it needs admin
access) from a checkout of `main`:
`gh api -X POST repos/kevinjogin/bizomat-cad/rulesets --input .github/rulesets/main.json` (or Settings > Rules >
Rulesets > New ruleset > Import a ruleset, with the same file). To change it later: `gh api -X PUT
repos/kevinjogin/bizomat-cad/rulesets/<id> --input .github/rulesets/main.json` (`gh api
repos/kevinjogin/bizomat-cad/rulesets` lists the id). To check it: `gh api repos/kevinjogin/bizomat-cad/rules/branches/main
--jq '.[].type'` lists `deletion`, `non_fast_forward`, `pull_request` and `required_status_checks`.

Windows jobs count double against GitHub Free's monthly minutes for private repositories. When the minutes run out
every job fails at once with a billing message (seen on 7-8 Nov 2026).

## 12. Recovery and maintenance

- **A bad release:** a deploy whose core checks fail rolls itself back. To go back by hand: Actions > Deploy to Fly.io
  (cados) > Run workflow, `action` = `rollback`, `image` = `sha-<the earlier commit>` (or a `deployment-<id>` from
  `flyctl releases -a cados --image`), `confirm` = `DEPLOY`. From a computer, in an emergency: `flyctl deploy -a cados
  --image registry.fly.io/cados:<that tag> --ha=false`.
- **Data:** the volume `opensketch_data` holds accounts, OAuth grants, the bridge signing key and `bridge.sqlite`.
  Take a snapshot before risky work (Fly dashboard > `cados` > Volumes > Snapshot). To restore, make a new volume from
  a snapshot and move the Machine onto it; never delete the old volume until the restored one is checked. Losing the
  bridge signing key means every computer must pair again.
- **Logs and state:** `flyctl status -a cados`, `flyctl logs -a cados`, or Actions > `fly-status.yml`.
- **Fly deploying by itself:** when `fly-status.yml` reports a deployment source, or a deploy reports a release it did
  not make (or production reports version `dev`), disconnect the repository by hand: Fly dashboard > `cados` >
  Settings. Nothing in this repository disconnects it. Then run `fly-status.yml` again: it passes once Fly reports
  `hasDeploymentSource: false` and `deploymentSource: null`.
- **Owner password:** there is no reset page. The owner resets other people on Admin, and their own password with
  `python -m opensketch --reset-password EMAIL` on the server (`fly ssh console -a cados`).
- **A stuck server:** the supervisor restarts it after 120 s without a health answer. A Machine restart:
  `flyctl machine restart <id> -a cados`.
- **Troubleshooting:** [docs/KEVOS-TROUBLESHOOTING.md](docs/KEVOS-TROUBLESHOOTING.md); security notes:
  [docs/KEVOS-SECURITY.md](docs/KEVOS-SECURITY.md), [SECURITY.md](SECURITY.md).
- **Dependencies:** Python pins with hashes in `requirements*.txt`; review Dependabot pull requests with the tests.

## 13. Repository history

This repository was created on 9 Nov 2026 from the source of the live `cados` app:

- **`main` and every other branch and tag** are `jogkev-creator/CADOS` exactly as it was on 9 Nov 2026 (formerly
  `jogkev-creator/opensketchyz`): 9 branches, the tags `addin-latest` and `bridge-latest`, the full history with the
  same commit ids. `main` continues it with the move's own commits. The site's pin (`e669cc6`) is a commit here.
- **`archive/bizomat-repo/*`**: the CAD part of `jogkev-creator/bizomat` (8-9 Nov 2026, never deployed), with
  `apps/cad` as the repository root and the installer backups kept. Each commit keeps its author, date and message,
  with an `Archived-From:` line naming the original commit. `archive/bizomat-repo/main` has the 0.14.0 rename and the
  TLS 1.2 fix; `archive/bizomat-repo/claude/vigilant-johnson-g8ecmi` (the newest, 9 Nov 2026) adds the drafting
  intelligence engine and tools, add-in 0.15, the task pane Connect fix and the Pack and Go test copies. Review and
  test before merging: it changes the add-in, the installer names and the MCP tools.
- The old repositories (`jogkev-creator/CADOS`, `jogkev-creator/bizomat`, `jogkev-creator/gocore-website`) were not
  changed or deleted.

## 14. Security rules

- Never commit `.env` files, Fly or Cloudflare tokens, signing certificates with private keys (`.pfx`, `.p12`,
  `.pvk`, private `.pem`/`.key`), passwords, the data folder, databases, uploads or personal data. `.gitignore`
  covers the usual names; check `git diff --cached --stat` before every commit.
- History was scanned with gitleaks on 9 Nov 2026: no secret. The only findings are fake keys in a test, listed with
  the reason in `.gitleaksignore`. Run `gitleaks git . --redact` before pushing anything unusual.
- The tests check that the signing scripts never export a private key and that the repository holds none.
- Report a security problem as [SECURITY.md](SECURITY.md) says; never in a public place.
- License: AGPL-3.0-only ([LICENSE](LICENSE)).
