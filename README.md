# BIZOMAT

**Business Intelligence & Automation.** Connecting Intelligence. Empowering Progress.

One repository, one Fly.io app, one Machine: the BIZOMAT website, **CAD MCP** (BIZOMAT CAD Automation: the SOLIDWORKS
MCP server, its Windows add-in and installer) and **Task Management** (BIZOMAT Project Management), served at
`https://bizomat.ai` from the Fly app `cados` (Sydney, 1 GB). Three services only: **GitHub Free** (code, tests,
a deploy started by hand), **Fly.io** (one Machine) and **Cloudflare** (DNS only).

| Address | What |
| --- | --- |
| `https://bizomat.ai/` | Website: Home, `/cad-automation/`, `/work/`, `/engine-room/` (plus contact, sign-in, legal pages) |
| `https://bizomat.ai/cad/` | CAD MCP: sign-in, dashboard, docs, installer download; MCP connector `https://bizomat.ai/cad/mcp` |
| `https://bizomat.ai/tasks/` | Task Management |
| `https://cados.fly.dev` | The Fly app's own address: every path is CAD MCP's, as before (connectors and paired computers use it) |

The architecture, the measured memory, GitHub Free's limits, the DNS records and the one-time switch-over are in
[docs/BIZOMAT-SINGLE-APP.md](docs/BIZOMAT-SINGLE-APP.md).

## Repository

| Path | Component |
| --- | --- |
| `src/`, `public/`, `tests/`, `scripts/` | Website (Astro static pages; `src/worker.ts` for the contact API, redirects and app routing; `src/node/` runs it on Node) |
| `apps/cad/` | CAD MCP: Python server (`opensketch/`: MCP, OAuth, device bridge, kernel), SOLIDWORKS add-in, Companion and manual installer (`solidworks/`, C#), MSI (`installer/`), docs (`docs/`). Imported from `jogkev-creator/CADOS` at e669cc6 (`apps/cad-source.json`); changed here from now on |
| `apps/work/` | Task Management: Hono + React, SQLite on Node (`src/node/`), migrations, its own docs |
| `shared/brand/` | Logo geometry, tokens, components and fonts, copied into the website and both apps (`npm run brand`) |
| `infrastructure/fly/` | Image (`Dockerfile`), entrypoint (`all` runs cad, work and the proxy in one Machine), volume adoption, config checks |
| `infrastructure/proxy/` | The edge proxy: routing by host and path, headers, streaming; hosts the website in its process |
| `infrastructure/migrate/` | Data tools: pack, restore with manifests and backups, counts (never row content) |
| `infrastructure/smoke/` | Smoke test of every host and path through the proxy |
| `fly.toml` | The single application: app `cados`, `syd`, one Machine, 1 GB, volume `opensketch_data` |
| `.github/workflows/` | `bizomat-ci.yml` (all checks), `deploy.yml` (deploy to cados, by hand only), `consolidate.yml` (one-time switch-over, by hand), `cad-windows.yml` (add-in and MSI), `live-tls.yml` (weekly certificate check) |
| `docs/` | Platform docs: single app runbook, architecture, deployment, security, rollback, operations |

## Development workflow (no laptop deployment)

1. Work on a branch and open a pull request. **BIZOMAT CI** checks the website, CAD MCP (pytest, solver), Task
   Management (lint, types, tests, builds), the proxy, the single-machine scripts and `fly.toml` (not for changes to
   documentation only). Run it by hand with `image` to also build the image and run it in 1 GB.
2. Merge to `main`. Nothing is deployed by a merge or a push.
3. Deploy: Actions > **Deploy** > Run workflow on `main`, `confirm` = `DEPLOY`. It runs the CI, snapshots the volume,
   builds the image once on the GitHub runner, runs it in a 1 GB container with the smoke test, deploys that image to
   `cados`, and checks: exactly one Machine in `syd` with 1024 MB, the new version, the smoke test inside the
   Machine, memory, public CAD MCP paths and (once DNS points at cados) `bizomat.ai`. A failure turns the run red
   with the reason in its summary.
4. Rollback: Actions > Deploy > Run workflow, `confirm` = `DEPLOY`, `rollback_image` = an earlier image (shown in
   each run's summary).
5. Windows add-in and installer: **BIZOMAT CAD for Windows** builds and tests on Linux and Windows for a pull request
   that changes them, installs, repairs and uninstalls the MSI; a tag `bridge-v<version>` makes a release.

GitHub Free gives 2,000 Actions minutes a month for all private repositories together (Windows minutes count
double). An ordinary month here is estimated at about 400 minutes. If Actions is blocked, see
docs/BIZOMAT-SINGLE-APP.md, sections 3.2 and 3.3 (what to check, and deploying through Fly.io's own GitHub
integration, with its trade-offs).

### GitHub secrets

| Secret | Used by | What |
| --- | --- | --- |
| `FLY_API_TOKEN` | deploy, consolidate | Fly deploy token for the app `cados` |
| `FLY_BIZOMAT_TOKEN` | consolidate | Fly deploy token for the old app `bizomat` (switch-over only; delete after retirement) |
| `KEVOS_SIGN_PFX_BASE64`, `KEVOS_SIGN_PASSWORD` | cad-windows (optional) | Code-signing certificate for the MSI; without them the MSI is an unsigned test build |

Production secrets (CAD MCP's keys, Google sign-in) stay as Fly secrets on `cados`; none is in this repository.

## Working locally (optional)

Needs Node 22.12+, Python 3.12 and, for the add-in, the .NET 8 SDK.

```bash
npm ci
```

```bash
npm run dev
```

```bash
npm run verify
```

```bash
node --test 'infrastructure/proxy/test/*.test.mjs'
```

```bash
sudo bash infrastructure/fly/test/single-app.test.sh
```

```bash
cd apps/work && npm ci && npm run check
```

```bash
cd apps/cad && python3.12 -m venv .venv && .venv/bin/pip install --require-hashes -r requirements-dev.txt && npm ci && .venv/bin/pytest -q
```

```bash
cd apps/cad && bash solidworks/build.sh test
```

## Website content rules

- Four sections only: Home, CAD Automation, Work, The Engine Room. Resources (Tools, Library, guides, learning paths,
  AI search) was retired on 8 Nov 2026; every old address answers 301 with the page that replaces it
  (`public/_redirects`, `src/server/platform-paths.ts`). The retired content is kept, unchanged, in the history of
  `jogkev-creator/gocore-website`.
- One design system (`shared/brand/`), light theme by default, no third-party scripts or trackers, a strict CSP (no
  inline styles), one H1, a 50-200 character description and a canonical URL on every page (the build fails
  otherwise).
- Claims come only from the code (`src/data/platform-catalog.ts`). BIZOMAT is not a registered trade mark (KEVOS is,
  No. 2469816): never write "®" after BIZOMAT.

## Open items

- The first switch-over (docs/BIZOMAT-SINGLE-APP.md, section 6) is the owner's: it needs the Fly tokens, the Fly
  dashboard and the Cloudflare DNS, which the build environment could not reach.
- GitHub Actions jobs were blocked by billing on 8 Nov 2026 (most likely the shared free minutes used up); the checks
  and the fix are in docs/BIZOMAT-SINGLE-APP.md, section 3.2.
- The BIZOMAT CAD add-in 0.14.0 (new name and `Documents\BIZOMAT CAD`) is built and unit-tested on Linux and its MSI is
  installed and removed on a Windows runner, but it has not been run inside SOLIDWORKS yet (no SOLIDWORKS in CI).
- Publishing a new MSI to every computer (the signed update record) still needs the record and file put where CAD MCP
  reads them; automating that is the next step for installer releases.

## Licences

The website and Task Management are proprietary to BIZOMAT. CAD MCP (`apps/cad`) is AGPL-3.0-only
(`apps/cad/LICENSE`). Fonts are under the SIL Open Font Licence (`public/fonts/`).
