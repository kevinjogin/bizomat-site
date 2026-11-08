# BIZOMAT on three services: GitHub Free, one Fly.io Machine, Cloudflare DNS

_8 Nov 2026. Source of truth: `jogkev-creator/bizomat`. Everything below is done in a browser (GitHub, the Fly.io
dashboard, the Cloudflare dashboard); nothing is built or deployed from a laptop, and no runner is installed on a
personal computer._

## 1. The three services

| Service | What it does | Plan | What it does not do |
| --- | --- | --- | --- |
| **GitHub** (`jogkev-creator/bizomat`, private) | Source code, pull requests, tests (Actions), Windows installer builds, the hand-started deploy | GitHub Free: no paid minutes, spending limit US$0 | Host anything; run on a schedule except one 1-minute weekly check |
| **Fly.io** (app `cados`) | Runs production: one Machine in `syd`, 1024 MB, the volume `opensketch_data` | Pay as you go (one small Machine and one volume) | A second Machine, more memory, another app |
| **Cloudflare** (zone `bizomat.ai`) | DNS only (records set to "DNS only", grey cloud) | Free | Hosting, Workers, containers, storage, proxying; no automatic DNS changes from CI |

No other hosting, build service or CI is used: no Oracle, no GitLab CI, no external builders, no self-hosted runners,
no Cloudflare Workers or Containers (removed on 8 Nov 2026, section 9).

| | |
| --- | --- |
| Fly.io app | `cados` (the existing app: its volume, secrets, IP addresses and `cados.fly.dev` are kept) |
| Machines | exactly one, region `syd`, `shared-cpu-2x`, **1024 MB**, always on, 512 MB swap as a safety margin |
| Process group | `app` (the group the existing Machine is in: a renamed group would make Fly create a new Machine with an empty volume; `check-config.py` refuses any other name) |
| Volume | the existing `opensketch_data` at `/data` (CAD MCP in `/data/cad`, Task Management in `/data/work`) |
| Primary domain | `https://bizomat.ai` (`www.bizomat.ai` answers 301 there) |
| Fly address | `https://cados.fly.dev`: every path goes to CAD MCP, as before (connectors and paired computers use it) |
| Deploys | `.github/workflows/deploy.yml`, **started by hand only** (Run workflow, `confirm` = `DEPLOY`, branch `main`) |
| To retire | the Fly app `bizomat` (`bizomat.fly.dev`), after the switch-over (section 6.6) |

```
   GitHub (code, tests, deploy by hand)  --flyctl, deploy token-->  Fly.io app cados
   Cloudflare DNS: bizomat.ai, www  --A/AAAA/CNAME, DNS only-->  Fly edge (TLS for bizomat.ai, www, cados.fly.dev)
                                                                     |
                        one Machine (cados, syd, 1 GB) : bizomat-entrypoint all
   proxy :8080 ----------------------------------------------------------------------------
     |  bizomat.ai /                 website (4 sections + contact/legal), inside the proxy
     |  bizomat.ai /cad/..., /mcp, /oauth/..., /v2/..., /.well-known/oauth-*  ->  cad :8001
     |  bizomat.ai /tasks/...                                                   ->  work :8002
     |  cados.fly.dev, cados.kevos.com  (every path)                            ->  cad :8001
   cad  :8001  CAD MCP: MCP server, OAuth, device bridge, installer and update endpoints  (user bzcad)
   work :8002  Task Management: accounts, projects, tasks, SQLite                        (user bzwork)
```

Each service runs as its own Linux user with only its own settings (the entrypoint builds a clean environment per
role); a service that stops is started again by the supervisor; a Machine restart starts all three.

## 2. Memory (measured, not assumed)

Measured with the real services running together (CAD MCP with an owner account, Task Management, the proxy with the
website inside), after 1,000 requests through the proxy:

| Process | RSS |
| --- | --- |
| CAD MCP (server and its supervisor) | 456 MB |
| Task Management | 114 MB |
| Proxy with the website | 88 MB |
| **Total** | **659 MB** (612 MB idle) |

That fits 1 GB with about 250 MB to spare for the kernel and peaks **only because CAD geometry runs inside the CAD
server process** (`OPENSKETCH_CAD_WORKERS=0` in `fly.toml`). With separate CAD worker processes (the earlier 2 GB
design) each worker adds about 400 MB (measured: 422 MB after a representative part and its STEP export), so even
one would exceed 1 GB.

The trade-off, stated plainly: while one heavy geometry call runs (for example reading a large assembly back from
SOLIDWORKS), the CAD server answers other requests only after it; the add-in and MCP clients retry. Typical calls
take well under a second.

Every deploy runs the image it is about to ship in a container capped at 1 GB with the smoke test
(`infrastructure/fly/test/single-machine-1gb.sh`), then reports the Machine's memory in the job summary and warns
below 150 MB available. If real use shows 1 GB is not enough (out-of-memory restarts in `fly logs`, or the warning),
the fix is a memory change in `fly.toml`, which **needs the owner's approval** (`check-config.py` fails CI until the
file and that decision agree).

## 3. GitHub Free: what it allows and how the workflows stay inside it

GitHub Free for a private repository includes **2,000 Actions minutes a month** and **500 MB of artifact storage**,
shared by every private repository of the account. Linux runners count 1x; **Windows runners count 2x**. Each job is
rounded up to the next whole minute. With a spending limit of US$0 (the default) GitHub does not charge for more:
it stops starting jobs until the next month. Public repositories have unlimited minutes, but this one stays private.

### 3.1 The workflows (5)

| Workflow | Starts on | Runner minutes (estimate) |
| --- | --- | --- |
| `bizomat-ci.yml` BIZOMAT CI | a pull request that changes code (not docs or `*.md` only); a newer push to the same pull request cancels the older run; by hand | about 25-30 (5 Linux jobs in parallel, each rounded up); with `image` = true about 40 more |
| `deploy.yml` Deploy | **by hand only**, `confirm` = `DEPLOY`, branch `main` | about 25-30 (CI) + 30 (one image build, the 1 GB test, push, checks) |
| `cad-windows.yml` BIZOMAT CAD for Windows | a pull request that changes the add-in or installer; a tag `bridge-v*`; by hand | about 10 Linux + 2 x 20 Windows = **about 50** |
| `consolidate.yml` Consolidate into cados | by hand only (inspect, move-work-data, retire-bizomat) | about 5 |
| `live-tls.yml` Live TLS | Monday 07:41 Sydney; by hand; a pull request that changes it | about 1 (about 5 a month) |

These are estimates from the jobs' contents: the runs on this repository so far were blocked before they started
(3.2), so none has been measured here yet. Nothing runs on every push, nothing deploys on a push or merge, and
nothing builds the platform image twice. Dependabot opens at most three update pull requests a month (minor and
patch only; each runs the CI once). Artifacts: the Windows package (5 days) and the MSI (14 days), a few MB each; no
other workflow uploads anything (`tests/artifact-policy.test.ts`).

A month of ordinary work (10 pull requests, 2 deploys, 1 add-in change, the weekly check) is about 250 + 110 + 50 + 5
= **about 415 minutes**, well inside 2,000 if the other private repositories use little.

### 3.2 The block seen on 8 Nov 2026

Every job on this repository failed before starting with: "The job was not started because recent account payments
have failed or your spending limit needs to be increased." GitHub shows the same text for every billing cause, so
the cause cannot be read from the API. What points to the free minutes being used up: CADOS recorded the same block
on 7 Nov 2026 after heavy CI and Windows jobs, and the account's other private repositories (CADOS, gocore-website,
PMO) share the same 2,000 minutes.

What the owner checks (no purchase, no spending change):

1. github.com > profile picture > **Settings > Billing and licensing > Usage**: Actions minutes used this month and
   which repositories used them. **Payment information**: whether a failed payment is recorded (a failed payment
   can block Actions even within the free minutes; updating the card is not a purchase).
2. Stop the archived repositories from using the shared minutes: CADOS, gocore-website and PMO > Settings >
   Actions > General > **Disable actions** (their code and history stay; only their workflows stop). This is the
   single largest saving.
3. Wait for the monthly reset (the Usage page shows the date), then run BIZOMAT CI by hand once to confirm.

Do not raise the spending limit or buy minutes (the owner's rule).

### 3.3 If Actions stays blocked: deploying without GitHub Actions

A self-hosted runner on a personal computer is not used (the owner's rule). The one option inside the three
services is **Fly.io's own GitHub integration**: Fly builds the image from the repository on its own builders and
deploys it. It uses no Actions minutes.

How (Fly dashboard > `cados` > Settings or Deployments > GitHub > Connect, repository `jogkev-creator/bizomat`,
branch `main` or better a branch of its own such as `production`, Dockerfile `infrastructure/fly/Dockerfile`, config
`fly.toml`).

Trade-offs, plainly:

| | `deploy.yml` (GitHub Actions) | Fly.io GitHub integration |
| --- | --- | --- |
| Starts | by hand only, `DEPLOY` | every push to the linked branch |
| Tests before deploying | the whole CI, then the same image in 1 GB with the smoke test | none |
| Volume snapshot first | yes | no (Fly's daily automatic snapshots only) |
| Checks after | one Machine, syd, 1024 MB, version, smoke test, memory, public addresses | Fly's health checks in `fly.toml` only |
| Version in `/healthz` | the commit | `dev` (no build argument) |
| Access | a deploy token for `cados` in GitHub Secrets | the Fly app gets read access to the repository |
| First switch | `first_switch` = `SWITCH` after the checks in 6.3 | linking the repository **is** the first switch: no inspect, no snapshot |

If it is used: link a dedicated `production` branch (not `main`), take a volume snapshot by hand first (Fly
dashboard > cados > Volumes > Snapshot), keep `fly.toml`'s process group `app`, and push to `production` only
commits that passed the tests somewhere (a pull request's CI once minutes return). Unlink it again once Actions works,
so there is one deploy path. The data move and the retirement of `bizomat` (6.5, 6.6) need `flyctl`; without Actions
they wait for the minutes to return.

## 4. Fly.io

- Only `deploy.yml` changes production. Before it changes anything it checks `fly.toml` (`check-config.py`: app
  `cados`, `syd`, one VM of 1 GB, group `app`, the volume mount) and the live app: at most one Machine, in the group
  `app`, with the volume `opensketch_data` attached. It refuses otherwise.
- `flyctl deploy --ha=false`: the one Machine is replaced in place; no second Machine is created. No workflow creates
  or deletes volumes (`deploy.yml` makes a snapshot of the existing one only).
- Memory and Machine count change only with the owner's approval (section 2).
- Secrets live in Fly (Fly dashboard > cados > Secrets) and GitHub Secrets (`FLY_API_TOKEN`); never in the repository.

## 5. Cloudflare: DNS and TLS requirements

Cloudflare is the DNS host for `bizomat.ai` only. TLS certificates are issued and renewed by Fly.io (Let's Encrypt);
Cloudflare does not terminate TLS, so every record that points at Fly stays **DNS only** (grey cloud). No workflow or
script changes DNS: every change below is made by the owner in the Cloudflare dashboard, after the checks in 6.5.

| Record | Type | Value | Proxy | When |
| --- | --- | --- | --- | --- |
| `_acme-challenge.bizomat.ai` | CNAME | the value Fly shows under cados > Certificates > bizomat.ai | DNS only | before the switch (certificate issued before traffic moves) |
| `_acme-challenge.www.bizomat.ai` | CNAME | the value Fly shows for www.bizomat.ai | DNS only | same |
| `bizomat.ai` | A | the IPv4 address of `cados` (`fly ips list -a cados`, or Fly dashboard > cados > IP addresses) | DNS only | at the switch |
| `bizomat.ai` | AAAA | the IPv6 address of `cados` | DNS only | at the switch |
| `www.bizomat.ai` | CNAME | `cados.fly.dev` | DNS only | at the switch |
| `cados.kevos.com` (zone `kevos.com`) | as today | keep pointing at `cados` | DNS only | no change |
| MX, SPF (TXT), DKIM, DMARC | as today | keep | n/a | no change |
| `mcp.bizomat.ai`, `cad.bizomat.ai`, `work.bizomat.ai` | as today | unused by this setup; leave, or remove later | n/a | no change now |

Also check:

- **CAA**: if the zone has CAA records, one must allow `letsencrypt.org`, or Fly cannot issue the certificate.
- **SSL/TLS mode** (Cloudflare > SSL/TLS): irrelevant while the records are DNS only; do not turn on proxying, "Always
  Use HTTPS" redirects or other Cloudflare features for these names (the proxy would sit in front of Fly's own
  certificate and change the visitor's address the apps see).
- **Before the switch** note the current values of `bizomat.ai` and `www` (they point at the `bizomat` app today):
  they are the rollback.
- After the switch, Live TLS (weekly) checks the certificates of `bizomat.ai`, `www.bizomat.ai`, `cados.fly.dev` and
  `cados.kevos.com` from outside.

## 6. One-time switch-over (in this order)

### 6.1 GitHub (repository `jogkev-creator/bizomat`)

1. `main` exists (it holds the reviewed work). Merge this branch into it with a pull request, then set `main` as the
   default branch (Settings > General).
2. Actions minutes: section 3.2.
3. Secrets (Settings > Secrets and variables > Actions > New repository secret):
   - `FLY_API_TOKEN`: a deploy token for `cados` (Fly dashboard > cados > Tokens > Create deploy token).
   - `FLY_BIZOMAT_TOKEN`: a deploy token for `bizomat` (same place, app bizomat). Only for the switch-over; delete it
     after section 6.6.
   - Optional, for signed installers: `KEVOS_SIGN_PFX_BASE64` and `KEVOS_SIGN_PASSWORD` (as in CADOS).

### 6.2 Stop the old automatic deploys of CADOS to cados

The `cados` app is linked to the CADOS repository in Fly and builds every push to CADOS `main`. Unlink it, or a later
CADOS push would replace the single application: Fly dashboard > cados > Settings (or Deployments) > GitHub >
Disconnect. From then on only this repository deploys `cados` (`deploy.yml`, or the fallback in 3.3, never both).

### 6.3 Inspect

Actions > **Consolidate into cados** > Run workflow, mode `inspect`. The summary lists, for both apps: Machines
(region, CPU, memory, state, image, process group), volumes, IP addresses, certificates and secret names (never
values), the secrets `bizomat` has and `cados` lacks, the cados volume's layout and Task Management's table counts.
Expect `cados` to show one Machine in the group `app` and the volume `opensketch_data`. If a listed secret is needed by
a retained service, set it on cados (Fly dashboard > cados > Secrets). The website needs none (its contact form posts
to Web3Forms from the browser); Task Management signs in with email and password and needs none.

### 6.4 First deploy (the switch from the CADOS image)

Actions > **Deploy** > Run workflow on `main`, `confirm` = `DEPLOY`, `first_switch` = `SWITCH`. It runs the CI,
snapshots the volume, builds the image once on the GitHub runner, runs it in 1 GB with the smoke test, deploys that
image to the one Machine and checks: one Machine, `syd`, 1024 MB, version, smoke test inside the Machine, memory, and
the public CAD paths on `cados.fly.dev`.

On its first start the Machine moves the CAD data on the volume from its root into `/data/cad`
(`infrastructure/fly/adopt-cados-volume.sh`: renames on the same disk only, file and byte counts checked, resumable,
refuses an ambiguous layout). CAD MCP is offline for the restart (about a minute). Paired computers and AI app
connections keep their keys and tokens (the same data, the same addresses). During this step `bizomat.ai/cad` keeps
working: the old `bizomat` router sends `/cad` to `cados.internal:8080`, which is now this proxy.

Rollback: Fly dashboard > cados > Volumes > the snapshot taken by the workflow, or run
`/usr/local/lib/bizomat/adopt-cados-volume.sh --undo` and deploy the previous CADOS image (Deploy > Run workflow,
`confirm` = `DEPLOY`, `rollback_image`).

### 6.5 Move Task Management's data, then DNS (one short window)

Task Management is offline from the start of step 1 until DNS reaches cados. Announce a short window.

1. Actions > **Consolidate into cados**, mode `move-work-data`, confirm `MOVE`. It snapshots both volumes, puts the old
   Task Management in maintenance (no more changes there), packs its data with a checksum manifest, copies it through
   the runner (SHA-256 equal on bizomat, the runner and cados), puts it in place on cados (anything already there is
   moved to `/data/backups`, never deleted; SQLite integrity check) and requires equal table counts on both sides. Only
   Task Management restarts on cados; CAD MCP keeps running. The old copy stays untouched on the bizomat volume.
2. Certificates: Fly dashboard > cados > Certificates > Add `bizomat.ai`, then `www.bizomat.ai`. Add the
   `_acme-challenge` CNAMEs Fly shows (section 5) so the certificate is issued before traffic moves. If Fly refuses
   because the name is still on the `bizomat` app, remove it there first (Fly dashboard > bizomat > Certificates).
3. DNS (Cloudflare dashboard > bizomat.ai > DNS): the records in section 5, DNS only. Keep the old values for rollback.
4. Check: Actions > Deploy > Run workflow, `confirm` = `DEPLOY` (a deploy of the same commit). Its public checks now
   include `bizomat.ai`: the four pages 200, `/resources/` 301, `/tasks/api/health` 200, `/cad/healthz` 200, `www`
   301. Then by hand: sign in to Task Management (`https://bizomat.ai/tasks/login`) and open a project; in an AI app,
   the CAD connector answers (`sw_status`); a SOLIDWORKS computer shows online (`sw_list_devices`); the installer
   download (`https://bizomat.ai/cad/download/solidworks`, signed in).

Rollback: set the DNS records back to the old values; on bizomat remove `/data/.bizomat-maintenance` on the work
Machine and restart it (Fly dashboard > bizomat > Machines > the work Machine > Restart after removing the flag with
the web console), so the old Task Management takes changes again.

### 6.6 Retire `bizomat`

After a few days without problems: Actions > **Consolidate into cados**, mode `retire-bizomat`, confirm `RETIRE`. It
refuses unless `bizomat.ai` is served by cados (the new site answers `/resources/` with 301) and cados has the Task
Management data. It then releases bizomat's public IP addresses (`bizomat.fly.dev` stops answering) and stops its
Machines. The app, its volumes (`work_data`, `cad_data`) and their snapshots are kept.

After the rollback window (30 days is suggested), the owner deletes the app in the Fly dashboard (this deletes its
volumes) and deletes the secret `FLY_BIZOMAT_TOKEN` in GitHub. Do not delete the CADOS or gocore-website
repositories: they hold the full history and the installer backups.

## 7. Future development (no laptop needed)

1. Change code on a branch (in GitHub's editor, a Codespace within its free hours, or any clone), open a pull request:
   **BIZOMAT CI** runs (website, CAD MCP, Task Management, proxy, single-app scripts, `fly.toml`).
2. Merge to `main`. Nothing deploys yet.
3. Deploy: Actions > **Deploy** > Run workflow on `main`, `confirm` = `DEPLOY`. It runs the CI again, builds the
   image once, tests it in 1 GB, deploys it to `cados`, verifies, and goes red with the reason if anything fails.
4. Windows add-in or installer changes (`apps/cad/solidworks`, `apps/cad/installer`): **BIZOMAT CAD for Windows**
   builds and tests them on the pull request, builds the MSI on Windows, installs, repairs and uninstalls it; a tag
   `bridge-v<version>` makes a release (by hand: Run workflow with `publish` replaces the `bridge-latest`
   pre-release).
5. Rollback: Actions > Deploy > Run workflow with `confirm` = `DEPLOY` and `rollback_image` (the image of an earlier
   run, in its summary).

## 8. Installer releases and updates

The MSI is built by `cad-windows.yml` and attached to the GitHub releases of this (private) repository. Computers are
offered updates by CAD MCP's signed update record (`/v2/bridge/update.json`, from `bridge-release.json` in CAD's data
folder); people download the installer at `https://bizomat.ai/cad/download/solidworks` (signed in), which serves an MSI
placed in `/data/cad/downloads/` or redirects to the published record's `msi_url`. Both mechanisms are unchanged.
Publishing a new MSI for every computer is the one step not yet automated end to end: until it is, put the MSI and its
record in `/data/cad/downloads/` on the volume (Fly dashboard > cados > Machines > console, or `fly ssh sftp` from a
Codespace). The earlier R2 route (`apps/cad/tools/laptop/cloudflare.ps1 publish installer`) is superseded: no R2 bucket
is part of the three-service setup.

## 9. Dependencies

### 9.1 Removed on 8 Nov 2026 (unused or superseded by the single Fly app)

| Removed | Why |
| --- | --- |
| `wrangler.toml`, `scripts/deploy-guard.mjs` and its test, the `wrangler` dev dependency, `npm run preview` / `deploy` | the website Worker on Cloudflare; the website runs inside the proxy on Fly |
| `apps/cad/cloudflare/` (Worker `bizomat-mcp`, Container, R2 persistence, the Fly-to-R2 move script) | CAD MCP in a Cloudflare Container; CAD MCP runs on the Fly volume |
| `apps/work/.github/workflows/` (5 workflows: Cloudflare previews and production, admin ops) | inert (GitHub runs only the root `.github/workflows`) and for Cloudflare deploys that are not used |
| `apps/cad/.github/dependabot.yml` | inert; the root `.github/dependabot.yml` covers the repository |

### 9.2 Kept, and why

| Kept | Why |
| --- | --- |
| `apps/work/wrangler.jsonc` | Task Management's Workers-runtime tests read it (`npm run check`); nothing deploys it |
| `src/server/downloads.ts` | serves `/downloads/` from an R2 binding when one exists; on Fly there is none, so it answers 404 and costs nothing |
| `apps/cad/tools/laptop/` | the earlier laptop tools, superseded (banner in its README); kept for the installer-publishing record and rollback history |
| `docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`, `docs/BIZOMAT-DEPLOYMENT.md` | history of the earlier plans, marked superseded |
| COM ids, `OpenSketch.Sw.dll`, `HKCU\Software\OpenSketch`, the `opensketch` Python package and `OPENSKETCH_*` settings | compatibility: installed add-ins, macros, saved keys and the server's settings depend on them; people see BIZOMAT CAD |

### 9.3 Outside services the code calls (none paid, none needs an account change)

Web3Forms (the contact form, from the visitor's browser), Cloudflare Turnstile (spam check on that form), Google
sign-in for CAD MCP (optional, only if configured), Resend (optional email for Task Management, not configured),
Slack or Teams webhooks (only if a Task Management user adds one), OpenStreetMap tiles (Task Management's map). The
CSP also allows Cloudflare Web Analytics, but no page loads its beacon.

## 10. Running cost (estimate, not an invoice)

From Fly.io's published prices for Sydney, to be checked on the invoice: one `shared-cpu-2x` Machine with 1 GB always
on is in the order of US$8-10 a month, plus the volume at about US$0.15 per GB-month, plus IPv4 if dedicated. The
previous setup ran `cados` (performance-1x, 2 GB, about US$30-35 a month when awake) plus the `bizomat` app's four
Machines (proxy, web, work, cad: performance-1x 2 GB for cad alone). GitHub Free and Cloudflare DNS cost nothing.
These figures could not be verified from the build environment (no access to the Fly or GitHub billing pages).
