# BIZOMAT on one Fly.io Machine: architecture and switch-over runbook

_8 Nov 2026. Source of truth: `jogkev-creator/bizomat`. Everything below is done in a browser (GitHub, the Fly.io
dashboard, Cloudflare DNS); nothing is built or deployed from a laptop._

## 1. Target

| | |
| --- | --- |
| Fly.io app | `cados` (the existing app: its volume, secrets, IP addresses and `cados.fly.dev` are kept) |
| Machines | exactly one, region `syd`, `shared-cpu-2x`, **1024 MB**, always on, 512 MB swap as a safety margin |
| Volume | the existing `opensketch_data` at `/data` (CAD MCP in `/data/cad`, Task Management in `/data/work`) |
| Primary domain | `https://bizomat.ai` (`www.bizomat.ai` answers 301 there) |
| Fly address | `https://cados.fly.dev`: every path goes to CAD MCP, as before (connectors and paired computers use it) |
| Deploys | GitHub Actions only: `.github/workflows/deploy.yml` on every push to `main` |
| Retired | the Fly app `bizomat` (`bizomat.fly.dev`): its Machines are stopped and its IPs released; its volumes are kept for the rollback window |

```
                       Fly edge (TLS for bizomat.ai, www.bizomat.ai, cados.fly.dev)
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

Every deploy reports the Machine's memory in the job summary (`/proc/meminfo` and the largest processes) and warns
below 150 MB available. CI runs the same image in a container capped at 1 GB, smoke test inside, on every push. If
real use shows 1 GB is not enough (out-of-memory restarts in `fly logs`, or the warning), the fix is a memory change
in `fly.toml`, which **needs the owner's approval** (`check-config.py` fails CI until the file and that decision agree).

## 3. One-time switch-over (in this order)

### 3.1 GitHub (repository `jogkev-creator/bizomat`)

1. Make `main`: merge the branch `claude/vigilant-johnson-g8ecmi` (Pull requests > New, base `main`), or, while the
   repository has no `main`, create `main` from that branch (Code > branches > New branch) and set it as the default
   branch (Settings > General).
2. Actions minutes: CADOS recorded that minutes for private repositories ran out on 7 Nov 2026 (every job then fails
   at once with no log). Check Settings > Billing and plans > Actions before relying on the workflows.
3. Secrets (Settings > Secrets and variables > Actions > New repository secret):
   - `FLY_API_TOKEN`: a deploy token for `cados` (Fly dashboard > cados > Tokens > Create deploy token).
   - `FLY_BIZOMAT_TOKEN`: a deploy token for `bizomat` (same place, app bizomat). Only for the switch-over; delete it
     after section 3.6.
   - Optional, for signed installers: `KEVOS_SIGN_PFX_BASE64` and `KEVOS_SIGN_PASSWORD` (as in CADOS).

### 3.2 Stop the old automatic deploys of CADOS to cados

The `cados` app is linked to the CADOS repository in Fly and builds every push to CADOS `main`. Unlink it, or a later
CADOS push would replace the single application: Fly dashboard > cados > Settings (or Deployments) > GitHub >
Disconnect. From now on only this repository's `deploy.yml` deploys `cados`.

### 3.3 Inspect

Actions > **Consolidate into cados** > Run workflow, mode `inspect`. The summary lists, for both apps: Machines
(region, CPU, memory, state, image), volumes, IP addresses, certificates and secret names (never values), the
secrets `bizomat` has and `cados` lacks, the cados volume's layout and Task Management's table counts. Expect
`cados` to show one Machine and the volume `opensketch_data`. If a listed secret is needed by a retained service,
set it on cados (Fly dashboard > cados > Secrets). The website needs none (its contact form posts to Web3Forms from
the browser); Task Management signs in with email and password and needs none.

### 3.4 First deploy (the switch from the CADOS image)

Actions > **Deploy** > Run workflow, `first_switch` = `SWITCH`. It runs the whole CI, snapshots the volume, builds the
image on the GitHub runner, deploys it to the one Machine and checks: one Machine, `syd`, 1024 MB, version, smoke test
inside the Machine, memory, and the public CAD paths on `cados.fly.dev`.

On its first start the Machine moves the CAD data on the volume from its root into `/data/cad`
(`infrastructure/fly/adopt-cados-volume.sh`: renames on the same disk only, file and byte counts checked, resumable,
refuses an ambiguous layout). CAD MCP is offline for the restart (about a minute). During this step `bizomat.ai/cad`
keeps working: the old `bizomat` router sends `/cad` to `cados.internal:8080`, which is now this proxy.

Rollback: Fly dashboard > cados > Volumes > the snapshot taken by the workflow, or run
`/usr/local/lib/bizomat/adopt-cados-volume.sh --undo` and deploy the previous CADOS image (Deploy > Run workflow,
`rollback_image`).

### 3.5 Move Task Management's data, then DNS (one short window)

Task Management is offline from the start of 3.5.1 until DNS reaches cados. Announce a short window.

1. Actions > **Consolidate into cados**, mode `move-work-data`, confirm `MOVE`. It snapshots both volumes, puts the old
   Task Management in maintenance (no more changes there), packs its data with a checksum manifest, copies it through
   the runner (SHA-256 equal on bizomat, the runner and cados), puts it in place on cados (anything already there is
   moved to `/data/backups`, never deleted; SQLite integrity check) and requires equal table counts on both sides. Only
   Task Management restarts on cados; CAD MCP keeps running. The old copy stays untouched on the bizomat volume.
2. Certificates: Fly dashboard > cados > Certificates > Add `bizomat.ai`, then `www.bizomat.ai`. Fly shows the DNS
   records it needs. Add the `_acme-challenge` CNAME it shows first: the certificate is then issued before traffic
   moves. If Fly refuses because the name is still on the `bizomat` app, remove it there first (Fly dashboard >
   bizomat > Certificates), then add it to cados.
3. DNS (Cloudflare dashboard > bizomat.ai > DNS): point `bizomat.ai` and `www.bizomat.ai` at cados (the A and AAAA
   addresses Fly shows for cados, or `cados.fly.dev` as CNAME for `www`), DNS only, as today. Keep the old values
   noted for rollback.
4. Check: Actions > Deploy > Run workflow (no inputs). Its public checks now include `bizomat.ai`: the four pages 200,
   `/resources/` 301, `/tasks/api/health` 200, `/cad/healthz` 200, `www` 301. Then by hand: sign in to Task
   Management (`https://bizomat.ai/tasks/login`) and open a project; in an AI app, the CAD connector answers
   (`sw_status`); a SOLIDWORKS computer shows online (`sw_list_devices`); the installer download
   (`https://bizomat.ai/cad/download/solidworks`, signed in).

Rollback: set the DNS records back to the old values; on bizomat remove `/data/.bizomat-maintenance` on the work
Machine and restart it (Fly dashboard > bizomat > Machines > the work Machine > Restart after removing the flag with
the web console), so the old Task Management takes changes again.

### 3.6 Retire `bizomat`

After a few days without problems: Actions > **Consolidate into cados**, mode `retire-bizomat`, confirm `RETIRE`. It
refuses unless `bizomat.ai` is served by cados (the new site answers `/resources/` with 301) and cados has the Task
Management data. It then releases bizomat's public IP addresses (`bizomat.fly.dev` stops answering) and stops its
Machines. The app, its volumes (`work_data`, `cad_data`) and their snapshots are kept.

After the rollback window (30 days is suggested), the owner deletes the app in the Fly dashboard (this deletes its
volumes) and deletes the secret `FLY_BIZOMAT_TOKEN` in GitHub. Do not delete the CADOS or gocore-website
repositories: they hold the full history and the installer backups.

## 4. Future development (no laptop needed)

1. Change code on a branch (in GitHub's editor, Codespaces, or any clone), open a pull request: **BIZOMAT CI** runs
   (website, CAD MCP, Task Management, proxy, single-app tests, the image in 1 GB).
2. Merge to `main`: **Deploy** runs the CI again, builds on the runner, deploys to `cados`, verifies, and goes red
   with the reason if anything fails. GitHub notifies the person who pushed.
3. Windows add-in or installer changes (`apps/cad/solidworks`, `apps/cad/installer`): **BIZOMAT CAD for Windows**
   builds and tests them, builds the MSI on Windows, installs and uninstalls it, and on `main` updates the
   `bridge-latest` pre-release; a tag `bridge-v<version>` makes a release.
4. Rollback: Actions > Deploy > Run workflow with `rollback_image` (the image of an earlier run, in its summary).

## 5. Installer releases and updates

The MSI is built by `cad-windows.yml` and attached to the GitHub releases of this (private) repository. Computers are
offered updates by CAD MCP's signed update record (`/v2/bridge/update.json`, from `bridge-release.json` in CAD's data
folder); people download the installer at `https://bizomat.ai/cad/download/solidworks` (signed in), which serves an MSI
placed in `/data/cad/downloads/` or redirects to the published record's `msi_url`. Both mechanisms are unchanged.
Publishing a new MSI for every computer is the one step not yet automated end to end: until it is, put the MSI and its
record on the volume (or in the R2 bucket the record points at) as before. See the open items in `README.md`.

## 6. Running cost (estimate, not an invoice)

From Fly.io's published prices for Sydney, to be checked on the invoice: one `shared-cpu-2x` Machine with 1 GB always
on is in the order of US$8-10 a month, plus the volume at about US$0.15 per GB-month, plus IPv4 if dedicated. The
previous setup ran `cados` (performance-1x, 2 GB, about US$30-35 a month when awake) plus the `bizomat` app's four
Machines (proxy, web, work, cad: performance-1x 2 GB for cad alone). These figures could not be verified from the
build environment (no access to the Fly account).
