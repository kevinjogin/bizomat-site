# BIZOMAT deployment

How the platform is built and deployed as one Fly.io app, and how each domain moves to it. Configuration:
`fly.toml`, `infrastructure/`, `.github/workflows/bizomat-*.yml`. Command-level detail: `infrastructure/README.md`.
Data moves: `BIZOMAT-MIGRATION.md`. Going back: `BIZOMAT-ROLLBACK.md`.

**Status (6 Nov 2026): prepared, not deployed.** The sessions that prepared it had no Fly.io token and could not
reach fly.io, Cloudflare or bizomat.ai, so nothing below has been run against them. Section 8 lists exactly what the
owner must do. Since 6 Nov the plan routes bizomat.ai by path (section 2), as the website's Worker does today.

## 1. What is deployed

One image (`infrastructure/fly/Dockerfile`) holds the four services. Each Fly process group starts it with its role
(`bizomat-entrypoint proxy|web|work|cad`).

| Group | Port | Machine | Volume | Reached from |
| --- | --- | --- | --- | --- |
| proxy | 8080 | shared-cpu-1x, 256 MB | none | The internet, through Fly's edge (the only `[http_service]`) |
| web | 8003 | shared-cpu-1x, 512 MB | none | The proxy, over the private network |
| work | 8002 | shared-cpu-1x, 512 MB | `work_data` (3 GB, auto-extend to 20 GB, daily snapshots kept 30 days) | The proxy, over the private network |
| cad | 8001 | performance-1x (dedicated core), 2 GB | `cad_data` (as above) | The proxy, over the private network |

Region: Sydney (`syd`). Deploy strategy: rolling, one Machine at a time (the only strategy Fly allows with volumes).

The entrypoint, for every role: checks that `work` and `cad` have their volume mounted (it refuses to start
otherwise), gives each role a clean environment with only its own settings, reads optional secret files from the
role's volume, and runs the service as the role's own unprivileged user with no capabilities. The `cad` role refuses
to start on Fly without `OPENSKETCH_PASSWORD`, so CAD Automation can never come up as an open server.

## 2. Hosts

**Everything lives under bizomat.ai, with no subdomains (owner's decision, 5 Nov 2026):** the website at the root,
CAD Automation at `https://bizomat.ai/cad` and Project Management at `https://bizomat.ai/tasks`. The proxy
(`infrastructure/proxy/routes.mjs`) routes bizomat.ai by path, as the website's Worker does today (section 6a; the
proxy's tests check that its `CAD_PATHS` is the Worker's, character for character), and every other host by its name.
Paths and Host headers reach the apps unchanged: each app takes its prefix off itself and writes it back into its
links, Location headers and cookie paths (`apps/cad/opensketch/canonical.py`, from jogkev-creator/CADOS#14;
`apps/work/src/worker/mount.ts`, from jogkev-creator/PMO#2). Paths are matched as the website reads them (dot segments
resolved), so the website never has an application's request to pass on.

| Host and path | Served by | Notes |
| --- | --- | --- |
| `bizomat.ai`: `/cad`, `/cad/...` | cad | CAD Automation (`OPENSKETCH_PUBLIC_URL = "https://bizomat.ai/cad"`): pages, MCP at `/cad/mcp`, OAuth, the add-in and Companion links. Every page carries a Content Security Policy (CADOS#15): bizomat.ai is one origin for three products |
| `bizomat.ai`: `/.well-known/oauth-protected-resource...`, `/.well-known/oauth-authorization-server...`, `/.well-known/openid-configuration...` | cad | RFC 9728 and RFC 8414 put the OAuth metadata of `https://bizomat.ai/cad/mcp` at the root of the host (`/.well-known/oauth-protected-resource/cad/mcp`, `/.well-known/oauth-authorization-server/cad`) |
| `bizomat.ai`: `/mcp...`, `/solidworks/mcp...`, `/oauth/...`, `/v2/...`, `/healthz`, `/.well-known/acme-challenge/...` | cad | Root program paths, kept for connectors and computers set up while CAD answered at the root of bizomat.ai |
| `bizomat.ai`: `/tasks`, `/tasks/...` | work | Project Management (`WORK_APP_URL = "https://bizomat.ai/tasks"`), WebSockets included. Pages start with `<base href="/tasks/">`; the session cookie is scoped to `/tasks` |
| `bizomat.ai`: `/CAD...`, `/Tasks/...` in any case but lowercase | proxy | GET and HEAD: 301 to the lowercase path (other methods reach the website, which has nothing there) |
| `bizomat.ai`: everything else | web | The website. The CAD Automation product page is `/cad-automation/` (`/cad` is the application) |
| `www.bizomat.ai` | proxy | 301 (308 for other methods) to `https://bizomat.ai` with the same path and query |
| `cados.kevos.com` | cad | CAD Automation's old address, every path at the root: pages answer 301 to the same path under `https://bizomat.ai/cad`; programs (MCP, OAuth, the device and add-in links) keep working there with that address in their metadata (`OPENSKETCH_ALIAS_HOSTS` and `OPENSKETCH_REDIRECT_HOSTS`), so connectors and computers set up with it carry on |
| `work.kevos.com` | work | Project Management's old address, every path at the root, WebSockets included. Once `WORK_CANONICAL_URL` is set (section 7) its pages answer 301 to `https://bizomat.ai/tasks/...`; `/api/` and the files keep answering for open tabs |
| `kevos.com`, `www.kevos.com` | proxy | 301 to `https://bizomat.ai` with the same path and query (GET, HEAD); `/cad` and `/cad/`, the old CAD Automation page, to `https://bizomat.ai/cad-automation/`; form posts to `/api/*` go to web |
| `bizomat.fly.dev` | as bizomat.ai, by path; plus a preview switch | `/cad/` and `/tasks/` work there before DNS moves. `/__preview/cad`, `/__preview/work`, `/__preview/web` send every path of one browser to one service at the root, as the old addresses serve it; `/__preview/clear` returns (only while `BIZOMAT_PREVIEW_ROUTING=1`) |
| `cad.bizomat.ai`, `work.bizomat.ai` | nobody (421) | Not used: no subdomains |

## 3. Before the first deploy (owner, once)

1. **Fly.io token.** `fly tokens create org -o <organisation>` (needed to create the app). Store it as the Actions
   secret `FLY_API_TOKEN` of `jogkev-creator/gocore-website` only, and set the Actions variable `FLY_ORG` if the
   organisation is not `personal`. After the app exists, a deploy token for this app alone is enough:
   `fly tokens create deploy -a bizomat`.
2. **App, volumes and addresses.** Run Actions, "BIZOMAT deploy" once: the first run creates the app `bizomat`, the
   volumes `cad_data` and `work_data` (Sydney, 3 GB, snapshots kept 30 days) and the public addresses, then stops and
   asks for `OPENSKETCH_PASSWORD`. By hand instead: the commands in `infrastructure/README.md`, "Deploy". The name
   `bizomat` must be free on Fly; if it is not, choose another and change `app` in `fly.toml` and the
   `bizomat.internal` names in its `[env]`.
3. **Secrets.** Run `fly secrets import --stage -a bizomat`, type the lines below, then Ctrl-D (values do not appear
   in shell history or output):
   - `OPENSKETCH_PASSWORD=<the same value as on the cados app>` (required: the owner's private MCP address is
     derived from it; Fly cannot show the old value, so take it from the password manager it was saved in);
   - optional: `CF_ACCOUNT_ID` and `CF_AI_TOKEN` (AI search through Workers AI; the token needs only Workers AI
     permission), `TURNSTILE_SECRET_KEY`, `WORK_GOOGLE_CLIENT_ID` and `WORK_GOOGLE_CLIENT_SECRET`,
     `CAD_GOOGLE_CLIENT_ID` and `CAD_GOOGLE_CLIENT_SECRET`, `OPENSKETCH_ACCESS_CODE`.
   - and any other `OPENSKETCH_*` secret that `fly secrets list -a cados` shows (for example `OPENSKETCH_KEY_SECRET`
     or `OPENSKETCH_MCP_TOKEN`), with the same values.
4. **Google sign-in** (only if used): add the redirect URIs under bizomat.ai to each Google OAuth client:
   `https://bizomat.ai/tasks/api/auth/oauth/google/callback` (Project Management) and
   `https://bizomat.ai/cad/auth/google/callback` (CAD Automation; each app builds it from the address the sign-in
   started on, path included). Keep `https://work.kevos.com/api/auth/oauth/google/callback` while work.kevos.com
   serves pages, and the other kevos.com ones during the rollback window.

## 4. Deploy

- **GitHub:** Actions, "BIZOMAT deploy", Run workflow. Manual only; nothing deploys on push. It builds on Fly's
  remote builder, deploys, waits until `https://bizomat.fly.dev/__proxy/health` shows the new commit and runs the
  smoke test through the preview cookie. `BIZOMAT CI` runs the website, Project Management, CAD Automation and proxy
  tests and builds the image on pull requests.
- **By hand**, from a clean checkout whose `HEAD` is the commit to deploy:
  `flyctl deploy --remote-only --config fly.toml --ha=false --build-arg BIZOMAT_VERSION=$(git rev-parse --short HEAD)`.
  `--ha=false` keeps one Machine per group: `work` and `cad` must never have two.
- Take snapshots of both volumes before every deploy after data has moved in (`BIZOMAT-OPERATIONS.md`).

## 5. Checks before any DNS change

1. `fly status -a bizomat`: four Machines started, every check passing.
2. Smoke test against the preview host: `node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode preview`.
   It checks the website, `/cad/` and `/tasks/` there by path, and the old addresses through the preview cookie.
3. In a browser on `https://bizomat.fly.dev`: the website; `/cad/` (CAD Automation's product page and sign-in, every
   link under `/cad`) and `/tasks/` (Project Management's sign-in page); then `/__preview/cad` and `/__preview/work`
   show each app at the root, as `cados.kevos.com` and `work.kevos.com` serve it; `/__preview/clear` to return.
4. For data cutovers, the migration reports show no unexplained difference (`BIZOMAT-MIGRATION.md`).

## 6. Domains, in order

bizomat.ai carries all three products by path, so the step that moves bizomat.ai also moves CAD Automation's live
address (`https://bizomat.ai/cad`: AI apps' connectors and paired computers use it since CADOS#14) and Project
Management's (`/tasks`). Project Management moves first on its own host; then bizomat.ai and `cados.kevos.com` move
together with the CAD data, in one window.

Certificates first: for each host, `fly certs add <host> -a bizomat`, then `fly certs setup <host> -a bizomat`
shows the `_acme-challenge` CNAME to add. With it, Fly issues the certificate before any traffic moves (DNS-01
validation). Records for Fly must be **DNS only** in Cloudflare (grey cloud), as `cados.kevos.com` is today; the
proxy then sees the visitor's own address (`PROXY_TRUST_CLOUDFLARE` stays off). Where the `cados` app holds a name's
certificate and Fly refuses it on `bizomat`, remove it there in the same window (`fly certs remove <host> -a cados`).

Before changing any record, write down its current value in the cutover log; that value is the rollback. Lower the
TTL of each record that will change to 60 seconds a day before. Never change the kevos.com MX, SPF, DKIM or DMARC
records. After each step: `node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode live`. The exact
per-host steps are in `infrastructure/README.md`, "DNS cutover".

| Step | Host | Change | When |
| --- | --- | --- | --- |
| 1 | `work.kevos.com` | Project Management data cutover (`BIZOMAT-MIGRATION.md`), then: remove the custom domain from the `workos-platform-preview` Worker and add a DNS-only CNAME `work` to `bizomat.fly.dev`. If the website's `TASKS` service binding was made (section 6a, step 5), comment it out and merge first, so that `bizomat.ai/tasks` sends people to `work.kevos.com` (now the bizomat app) and not to the old Worker | After its data is imported and verified |
| 2 | `bizomat.ai`, `www.bizomat.ai`, `cados.kevos.com` | One window. CAD Automation data cutover (`BIZOMAT-MIGRATION.md`, `infrastructure/migrate/cad/README.md`: the `cados` app is frozen first). Then: `_acme-challenge.bizomat.ai`, `_acme-challenge.www.bizomat.ai` and `_acme-challenge.cados.kevos.com` to the targets `fly certs setup` shows for `bizomat`, and wait for the three certificates; the `bizomat.ai` A and AAAA records to the app's addresses (`fly ips list -a bizomat`; a dedicated IPv4 with `fly ips allocate-v4` if the shared one is not wanted), **DNS only** (proxied until now if section 6a was followed: the Worker then stops seeing bizomat.ai); `www.bizomat.ai` a DNS-only CNAME to `bizomat.fly.dev`; the DNS-only CNAME `cados` from `cados.fly.dev` to `bizomat.fly.dev`. Check: `/`, `/cad/`, `/tasks/`, an AI app connected with `https://bizomat.ai/cad/mcp` and one with `https://cados.kevos.com/mcp` both list the tools, a paired computer reconnects | After step 1, and after CAD's data is imported and verified. `apps/cad` does not have CADOS#11 yet (no server password, setup mode, suspension), which the `cados` app runs: take it in, or check its data against this code, before the CAD data moves (`BIZOMAT-PROJECT-STATUS.md`, section 6) |
| 3 | `kevos.com`, `www.kevos.com` | Recommended (option A): Cloudflare redirect rules on the kevos.com zone (Rules, Redirect Rules). First, when the hostname is `kevos.com` or `www.kevos.com` and the path is `/cad` or `/cad/` (the old CAD Automation page; on bizomat.ai `/cad` is the application): static redirect to `https://bizomat.ai/cad-automation/`, status 301, query string preserved. Then, for the same hostnames when the path does not start with `/api/` (cached pages may still post forms there; the Worker keeps answering them): dynamic redirect to `concat("https://bizomat.ai", http.request.uri.path)`, status 301, query string preserved. Option B: move both records to Fly (DNS only) and let the proxy redirect (it has both rules) | When the owner decides kevos.com should become bizomat.ai |

Rollback of step 2: the four records back to their logged values (bizomat.ai and www to the `cados` app, proxied again
if they were; `cados` back to `cados.fly.dev`), `freeze.sh cont` on `cados`; anything written on `bizomat` since the
switch stays there (`BIZOMAT-ROLLBACK.md`). Option A keeps the Worker route `kevos.com/*` in place behind the rules,
so turning the rules off is the rollback, and nothing about kevos.com moves to Fly. Option B is described in
`infrastructure/README.md`; the proxy already answers kevos.com with the same redirects.

### 6a. Today's deployments under bizomat.ai (owner's decision, 5 Nov 2026: everything under bizomat.ai, no subdomains)

_Superseded on 6 Nov 2026 by 6b: the website moved to Fly.io; this routing through Cloudflare is not used._

bizomat.ai is the BIZOMAT platform: the website at the root and each application under a path of its own. This
repository's Worker (`throbbing-block-6c61`, `src/worker.ts`) answers bizomat.ai and sends each path to what runs it
today. Both zones are in the owner's Cloudflare account (nameservers `uma` and `zac.ns.cloudflare.com`).

| Path on bizomat.ai | Application | Served by today | How the Worker reaches it |
| --- | --- | --- | --- |
| `/` and every website page | BIZOMAT website | this Worker | its static files (`env.ASSETS`) |
| `/cad`, `/cad/...` | CAD Automation | the `cados` Fly app, public address `https://bizomat.ai/cad` (jogkev-creator/CADOS#14) | `fetch(request)`: the proxied `bizomat.ai` record keeps the Fly app as its origin |
| `/.well-known/oauth-protected-resource...`, `/.well-known/oauth-authorization-server...`, `/.well-known/openid-configuration...` | CAD Automation | `cados` | as above: RFC 9728 and RFC 8414 put the OAuth metadata of `https://bizomat.ai/cad/mcp` at the root of the host |
| `/mcp...`, `/solidworks/mcp...`, `/oauth/...`, `/v2/...`, `/healthz` | CAD Automation | `cados` | as above: kept for connectors and computers set up while CAD answered at the root of bizomat.ai |
| `/tasks`, `/tasks/...` | Project Management | the `workos-platform-preview` Worker (`work.kevos.com`) | a temporary redirect (302) to `https://work.kevos.com/...`, until Project Management serves `/tasks` itself; then the `TASKS` service binding (`wrangler.toml`) |

Any other case (`/CAD`, `/Tasks/...`) answers 301 to the lowercase path. `www.bizomat.ai` answers 301 (308 for a
POST) to `https://bizomat.ai`. kevos.com keeps the website; its old CAD Automation page `/cad/` answers 301 to
`/cad-automation/`, the page's new address (on bizomat.ai, `/cad` is the application itself).

| Order | Owner's change | Check | Rollback |
| --- | --- | --- | --- |
| 1 | Deploy CADOS `main` (b3e2be2: jogkev-creator/CADOS#14 and #15) to the `cados` app: from a fresh clone made with `git clone --config core.autocrlf=false https://github.com/jogkev-creator/CADOS`, `fly deploy -a cados` in that folder (not from another directory), or the Fly dashboard | `https://bizomat.ai/healthz` shows the new commit; `https://bizomat.ai/cad/` is the CAD app; `https://cados.kevos.com/docs` answers 301 to `https://bizomat.ai/cad/docs`; `https://cados.kevos.com/.well-known/oauth-protected-resource/mcp` still names `cados.kevos.com` | `fly releases -a cados --image`, then `fly deploy -a cados --image <the previous image>` |
| 2 | bizomat.ai zone: the `_acme-challenge` CNAME that `fly certs show bizomat.ai -a cados` lists, **DNS only**. Behind the proxy Fly can renew the `bizomat.ai` certificate only by DNS, and Cloudflare (Full (strict)) refuses an expired one | `fly certs show bizomat.ai -a cados` reports the DNS validation | Delete the record |
| 3 | Merge this repository to `main`: Workers Builds publishes the BIZOMAT website (on kevos.com too) with the routes `bizomat.ai/*` and `www.bizomat.ai/*` | kevos.com shows the BIZOMAT website | Revert the merge |
| 4 | Straight after 3 (until then the website's links to `/tasks` reach the CAD app): switch the `bizomat.ai` A and AAAA records to **proxied** (their targets stay the Fly addresses), add a proxied CNAME `www` to `bizomat.ai`, SSL/TLS mode **Full (strict)**, and the CAD settings below | `https://bizomat.ai/` is the BIZOMAT homepage; `/cad/` the CAD app; `/CAD` answers 301 to `/cad`; `/tasks/` reaches Project Management; an AI app connected with `https://bizomat.ai/cad/mcp` and one connected with `https://cados.kevos.com/mcp` both list the tools | Switch the records back to DNS only: they still point at the CAD app |
| 5 | Later: Project Management serves its pages under `/tasks`; then uncomment the `TASKS` service binding in `wrangler.toml` and merge | `/tasks/` is Project Management without a redirect | Comment the binding out again |

CAD settings on the bizomat.ai zone (detail: jogkev-creator/CADOS, `docs/KEVOS-CLOUDFLARE.md`):

- **Bot Fight Mode off.** AI apps' servers and the Companions are programs and cannot solve a challenge; on the Free
  plan Bot Fight Mode cannot be limited to some paths. Leave "Block AI bots" off too, or skip it for the CAD paths
  above: AI apps call `/cad/mcp` from their servers.
- **No challenge or managed rule** for `/cad/mcp*`, `/cad/solidworks/mcp*`, `/cad/oauth/*`, `/cad/v2/*`, `/.well-known/*`
  and the root program paths in the first table (a WAF skip rule if one is added later).
- **Cache Rule: bypass cache** for `/cad*` and the root program paths (the CAD app sends `no-store`; this makes it
  certain). The website's own files keep their caching.
- Limits that apply and are met: request bodies of 100 MB (the Companion uploads in 32 MiB chunks) and 100 s without
  a byte (long polls are held 25 s; MCP answers send a keep-alive every 15 s while a tool runs).

`cad.bizomat.ai` is not used: the certificate added with `fly certs add cad.bizomat.ai -a cados` can stay or go
(`fly certs remove cad.bizomat.ai -a cados`), and no DNS record is needed. If a record is ever made, the CAD app
treats the name as an old host (pages 301 to `https://bizomat.ai/cad`); the bizomat app's proxy refuses it (421).

This is today's deployment. The single-app plan routes the same paths in the bizomat app's proxy (section 2); after
section 6, step 2, bizomat.ai's records point at the bizomat app (DNS only) and this Worker serves kevos.com alone.

### 6b. The website on Fly.io (owner's decision, 6 Nov 2026; replaces the Cloudflare routing of 6a)

The owner chose Fly.io for the BIZOMAT website, deploys from the laptop (CADOS `tools/laptop/bizomat.ps1`), and the
old KEVOS site back on kevos.com.

| Address | Served by |
| --- | --- |
| `bizomat.ai/` and every website page | Fly app `bizomat`: the router (`proxy`) and the website (`web`), `fly.website.toml` |
| `bizomat.ai/cad/...`, CAD's OAuth discovery and root program paths | Fly app `cados`, reached by the router over the private network (`cados.internal:8080`; CADOS listens on `::` since jogkev-creator/CADOS#16) |
| `bizomat.ai/tasks/...` | 302 to `https://work.kevos.com/...` (prefix off; `TASKS_REDIRECT_ORIGIN`) until Project Management moves into `bizomat` with its data (`fly.toml`, the full plan) |
| `kevos.com` | Cloudflare Worker `throbbing-block-6c61`: the KEVOS site (the version built from c79e297), no longer deployed from this repository |
| `cados.kevos.com`, `cados.fly.dev` | `cados` directly, as before (pages 301 to `bizomat.ai/cad`, programs served there) |

| Order | Owner's step | Check | Rollback |
| --- | --- | --- | --- |
| 1 | Cloudflare, Worker `throbbing-block-6c61`: Settings > Builds > Disconnect; Deployments: deploy the version built from c79e297 (5 Nov); Settings > Domains & Routes: remove `bizomat.ai/*` and `www.bizomat.ai/*` | kevos.com is the KEVOS site; its assistant and forms answer | Deploy the later version again |
| 2 | `.\bizomat.ps1 deploy cad` (CADOS `main` with #16) | `https://bizomat.ai/cad/` and `https://cados.kevos.com/docs` as before | `fly releases -a cados --image`, then `fly deploy -a cados --image <previous>` |
| 3 | Optional, for the assistant and AI search on Fly: a Cloudflare API token with Workers AI permission, then `fly secrets set CF_ACCOUNT_ID=<account id> CF_AI_TOKEN=<token> -a bizomat` | `/api/chat` answers questions | `fly secrets unset ...` (search falls back to keywords) |
| 4 | `.\bizomat.ps1 deploy website`: creates `bizomat` the first time (after asking), deploys, checks `bizomat.fly.dev` | The script's live checks: the router's version, the website, its APIs, `/cad/` through the private network, `/tasks/` 302 | `fly releases -a bizomat --image`, then redeploy the previous image; or leave bizomat.ai on `cados` (step 5 not done) |
| 5 | Certificates, then DNS (bizomat.ai zone, all records DNS only): `fly certs add bizomat.ai -a bizomat` and `fly certs add www.bizomat.ai -a bizomat`. If Fly refuses because `cados` holds the name, first `fly certs remove bizomat.ai -a cados` (bizomat.ai/cad is then without a certificate until step 5 ends: do it in one sitting). Point `_acme-challenge.bizomat.ai` at the target `fly certs setup bizomat.ai -a bizomat` shows; when `fly certs show bizomat.ai -a bizomat` says Issued, change the `bizomat.ai` A and AAAA records to `fly ips list -a bizomat` and add `www` (CNAME `bizomat.fly.dev`). Then `fly certs remove bizomat.ai -a cados` if still there | `https://bizomat.ai/` is the website; `/cad/` CAD Automation; `/CAD` 301; `/tasks/` 302 to work.kevos.com; an AI app connected with `https://bizomat.ai/cad/mcp` and one with `https://cados.kevos.com/mcp` both list tools | The A and AAAA records back to `66.241.125.206` and `2a09:8280:1::1e8:c21b:1` (`cados`) and its certificate back (`fly certs add bizomat.ai -a cados`) |

Known differences on Fly, compared with the Worker:
- The site's contact address is `info@bizomat.ai` (owner, 6 Nov 2026: `SITE.email`, footer, contact and privacy
  pages). It receives mail only once bizomat.ai has mail records (no MX record on 6 Nov). The contact form is set up
  later: until then it answers "Please email info@bizomat.ai" (the Worker sent mail with Cloudflare's email binding,
  which Fly does not have, and the Resend adapter, `src/server/contact/mail.ts`, is not wired to the form yet).
- DNS changes on bizomat.ai (step 5) touch only the apex and `www` A, AAAA and CNAME records and `_acme-challenge`:
  never the MX, SPF, DKIM or DMARC records that mail for info@bizomat.ai uses.
- The assistant and AI search need step 3; without it, search runs on keywords and the assistant says it is off.

### 6c. Project Management on Fly.io at bizomat.ai/tasks (owner's decision, 6 Nov 2026)

Project Management moves into the `bizomat` app (process group `work`, volume `work_data`, `fly.website.toml`) with
its data from Cloudflare (D1 `workos-platform-preview-db`, R2 `workos-platform-preview-files`). The move runs on the
owner's laptop, where wrangler and flyctl are signed in: `.\bizomat.ps1 move tasks` (CADOS `tools/laptop`), which
runs `apps/work/scripts/migrate/to-fly.mjs` (the steps of `BIZOMAT-MIGRATION.md`, section 2; Cloudflare is only read).
It signs people in with email and password only (Google sign-in is off on work.kevos.com), so no secret is needed.

| Order | Owner's step | Check | Rollback |
| --- | --- | --- | --- |
| 1 | `.\bizomat.ps1 deploy website`: the first deploy with `work` creates its Machine and its volume (3 GB, daily snapshots). The copy on Fly starts empty; `bizomat.ai/tasks` still answers 302 to work.kevos.com | The script's live checks; `https://bizomat.fly.dev/__proxy/ready` shows `work` ok | Deploy the previous commit |
| 2 | Tell the people who use work.kevos.com about a short pause, and stop using it until step 5: what is written there after the export stays in the old database | | |
| 3 | `.\bizomat.ps1 move tasks`: export, import, repair, copy the files, verify and pack (counts and checksums on screen, the data in `C:\BIZOMAT\moves\tasks-<time>\`); type yes; it uploads the archive, compares its SHA-256 on the Machine, puts the Machine in maintenance, runs `apply.sh` (what was there is moved to `/data/backups`), ends maintenance and waits until Project Management is healthy | The counts per table; `migration-report.md` in the folder | Run it again (it replaces the data and keeps the previous copy in `/data/backups`) |
| 4 | Open `https://bizomat.fly.dev/__preview/work`, sign in with your own email and password, compare a board, a document and a file with work.kevos.com; `https://bizomat.fly.dev/__preview/clear` returns to the website | The same boards, items, documents and files | Nothing has moved yet: work.kevos.com and `bizomat.ai/tasks` (302) are unchanged |
| 5 | The switch: `TASKS_REDIRECT_ORIGIN` removed and `BIZOMAT_PREVIEW_ROUTING = "0"` in `fly.website.toml` (a pull request), then `.\bizomat.ps1 deploy website` | `https://bizomat.ai/tasks/` is Project Management; sign in once more (a session belongs to its address) | Put `TASKS_REDIRECT_ORIGIN = "https://work.kevos.com"` back and deploy; what was written on Fly since step 3 can go back to D1 with `export-for-d1.mjs` (`BIZOMAT-MIGRATION.md`) |
| 6 | work.kevos.com to Fly, with the same data: `fly certs add work.kevos.com -a bizomat`; Cloudflare: remove the custom domain `work.kevos.com` from the Worker `workos-platform-preview`, then a DNS-only CNAME `work` to `bizomat.fly.dev` on kevos.com; then `WORK_CANONICAL_URL = "https://bizomat.ai/tasks"` in `fly.website.toml` and deploy: its pages answer 301 to `bizomat.ai/tasks`, its API keeps answering open tabs | `https://work.kevos.com/` answers 301 to `https://bizomat.ai/tasks/` | The custom domain back on the Worker (it still holds the data of step 3) |

Project Management on Fly is in the BIZOMAT brand (the wordmark, "Sign in to BIZOMAT", the platform links, teal for new
workspaces and folders; privacy requests to info@bizomat.ai). Workspace colours chosen before stay as they are (a
colour is the workspace owner's data; KEVOS orange was the old default): change one in the workspace's settings.

## 7. After cutover

- Set `BIZOMAT_PREVIEW_ROUTING = "0"` in `fly.toml` and deploy.
- Project Management keeps today's open sign-up and 72-hour sessions (`fly.toml`, `WORK_ALLOW_SIGNUP`,
  `WORK_SESSION_TTL_HOURS`). Closing sign-up (new people then need an invitation) or changing the session length is
  the owner's decision.
- CAD Automation's public address is `OPENSKETCH_PUBLIC_URL = "https://bizomat.ai/cad"` (as on the `cados` app). The
  old address `cados.kevos.com` keeps serving its own OAuth metadata, so connections made with it keep working.
- When `https://bizomat.ai/tasks` is checked, uncomment `WORK_CANONICAL_URL = "https://bizomat.ai/tasks"` in
  `fly.toml` and deploy: pages asked for on `work.kevos.com` then answer 301 to the same path there, while `/api/`
  and the files keep answering for open tabs. People sign in once more under `/tasks` (a session belongs to its host).
- Website links to the apps follow `PUBLIC_CAD_APP_URL` and `PUBLIC_WORK_APP_URL` (build-time settings; defaults
  `https://bizomat.ai/cad` and `https://bizomat.ai/tasks`).
- Merging to `main` also publishes the website at kevos.com through Cloudflare's GitHub integration. Leave it on
  while kevos.com is served by the Worker; disconnect it after section 6, step 3 (option B) if the Worker is no
  longer used.
- Leave the old deployments running for the rollback window (`BIZOMAT-ROLLBACK.md`).

## 8. What the owner must do (not possible from this session)

1. Confirm the registration and DNS provider of `bizomat.ai` (not verifiable here) and give access to change its
   records.
2. Create the Fly token and the app (section 3, steps 1 and 2).
3. Set `OPENSKETCH_PASSWORD` and any optional secrets (section 3, step 3).
4. Run the deploy workflow, then the checks in section 5.
5. Make each DNS change in section 6, in order, after its checks pass.
6. Provide a Cloudflare API token with D1 read and R2 read for the Project Management export
   (`BIZOMAT-MIGRATION.md`).
