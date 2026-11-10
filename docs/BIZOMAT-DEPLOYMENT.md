# BIZOMAT deployment

How the platform is built and deployed as one Fly.io app, and how each domain moves to it. Configuration:
`fly.toml`, `infrastructure/`, `.github/workflows/bizomat-*.yml`. Command-level detail: `infrastructure/README.md`.
Data moves: `BIZOMAT-MIGRATION.md`. Going back: `BIZOMAT-ROLLBACK.md`.

**Status (6 Nov 2026): prepared, not deployed.** The sessions that prepared it had no Fly.io token and could not
reach fly.io, Cloudflare or bizomat.ai, so nothing below has been run against them. Section 8 lists exactly what the
owner must do. Since 6 Nov the plan routes bizomat.ai by path (section 2), as the website's Worker does today.

## 1. What is deployed

**Production today (10 Nov 2026):** the app `bizomat` runs the router, the website and Project Management on one
Machine (the group `work`, `bizomat-entrypoint all`, shared-cpu-1x 1 GB, syd, volume `work_data`) once section 6e's
cutover has run; until then, three Machines (proxy 256 MB, web 512 MB, work 512 MB). CAD Automation is the separate
app `cados`. The table below is the earlier four-group plan (`fly.toml`, not deployed).

One image (`infrastructure/fly/Dockerfile`) holds the four services. Each Fly process group starts it with its role
(`bizomat-entrypoint proxy|web|work|cad`), or one Machine runs three of them (`bizomat-entrypoint all`).

| Group | Port | Machine | Volume | Reached from |
| --- | --- | --- | --- | --- |
| proxy | 8080 | shared-cpu-1x, 256 MB | none | The internet, through Fly's edge (the only `[http_service]`) |
| web | 8003 | shared-cpu-1x, 512 MB | none | The proxy, over the private network |
| work | 8002 | shared-cpu-1x, 512 MB | `work_data` (3 GB, auto-extend to 20 GB, daily snapshots kept 30 days) | The proxy, over the private network |
| cad | 8001 | performance-1x (dedicated core), 2 GB | `cad_data` (as above) | The proxy, over the private network |

Region: Sydney (`syd`). Deploy strategy: rolling, one Machine at a time (the only strategy Fly allows with volumes).

The entrypoint, for every role: checks that `work` and `cad` have their volume mounted (it refuses to start
otherwise), gives each role a clean environment with only its own settings, reads optional secret files from the
role's volume, and runs the service as the role's own unprivileged user with no capabilities. CAD Automation has no
server password (CADOS#11): the `cad` role never starts the CAD server on a volume without CAD data, so it can never
come up as a new server whose first visitor becomes its owner; until its data is there it shows a holding page
(section 6d).

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
| `cados.kevos.com` | cad | CAD Automation's old address, every path at the root: pages answer 301 to the same path under `https://bizomat.ai/cad`; programs (MCP, OAuth, the device and add-in links) keep working there with that address in their metadata (`OPENSKETCH_REDIRECT_HOSTS`, as on the cados app), so connectors and computers set up with it carry on. Today its DNS record still points at the cados app (section 6d, "Old addresses") |
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
   volumes `cad_data` and `work_data` (Sydney, 3 GB, snapshots kept 30 days) and the public addresses. The owner's
   laptop does the same with `.\bizomat.ps1 deploy website` (section 6b). By hand instead: the commands in
   `infrastructure/README.md`, "Deploy". The name
   `bizomat` must be free on Fly; if it is not, choose another and change `app` in `fly.toml` and the
   `bizomat.internal` names in its `[env]`.
3. **Secrets.** Run `fly secrets import --stage -a bizomat`, type the lines below, then Ctrl-D (values do not appear
   in shell history or output): optional `CF_ACCOUNT_ID` and `CF_AI_TOKEN` (AI search through Workers AI; the token
   needs only Workers AI permission), `TURNSTILE_SECRET_KEY`, `WORK_GOOGLE_CLIENT_ID` and `WORK_GOOGLE_CLIENT_SECRET`.
   CAD Automation's own settings (`OPENSKETCH_*` secrets of cados, its Google client, and `OPENSKETCH_PASSWORD` if
   cados still has it: it only seeds the owner's old private connector address) are not set here: `bizomat.ps1 move
   cad` reads them from the cados server and writes them on the cad volume, where only the cad Machine sees them
   (section 6d).
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
| `bizomat.ai/cad/...`, CAD's OAuth discovery and root program paths | Fly app `cados`, reached by the router over the private network (`cados.internal:8080`; CADOS listens on `::` since jogkev-creator/CADOS#16), until it moves into `bizomat` (section 6d) |
| `bizomat.ai/tasks/...` | 302 to `https://work.kevos.com/...` (prefix off; `TASKS_REDIRECT_ORIGIN`) until Project Management moves into `bizomat` with its data (`fly.toml`, the full plan) |
| `kevos.com` | Cloudflare Worker `throbbing-block-6c61`: the KEVOS site (the version built from c79e297), no longer deployed from this repository |
| `cados.kevos.com`, `cados.fly.dev` | `cados` directly, as before (pages 301 to `bizomat.ai/cad`, programs served there) |

| Order | Owner's step | Check | Rollback |
| --- | --- | --- | --- |
| 1 | `.\bizomat.ps1 restore kevos` (CADOS `tools/laptop`): with wrangler's sign-in, puts back the deployment that was live before 6 Nov 2026 01:03 UTC (the KEVOS site built from c79e297) and sets the Worker's routes to `kevos.com/*` alone (`bizomat.ai/*` and `www.bizomat.ai/*` removed). Then Cloudflare, Worker `throbbing-block-6c61`: Settings > Build > Disconnect (until then `scripts/deploy-guard.mjs` stops its builds) | The script checks that kevos.com shows KEVOS and bizomat.ai BIZOMAT; the assistant and forms answer on kevos.com | The rollback command the script prints before it starts |
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
| 1 | Once, the volume (`fly deploy` does not create one for a group added to an existing app): `fly volumes create work_data --region syd --size 3 --app bizomat`. Then `.\bizomat.ps1 deploy website`: the first deploy with `work` creates its Machine on that volume. The copy on Fly starts empty; `bizomat.ai/tasks` still answers 302 to work.kevos.com | The script's live checks; `https://bizomat.fly.dev/__proxy/ready` shows `work` ok | Deploy the previous commit |
| 2 | Tell the people who use work.kevos.com about a short pause, and stop using it until step 5: what is written there after the export stays in the old database | | |
| 3 | `.\bizomat.ps1 move tasks`: export, import, repair, copy the files, verify and pack (counts and checksums on screen, the data in `C:\BIZOMAT\moves\tasks-<time>\`); type yes; it uploads the archive, compares its SHA-256 on the Machine, puts the Machine in maintenance, runs `apply.sh` (what was there is moved to `/data/backups`), ends maintenance and waits until Project Management is healthy | The counts per table; `migration-report.md` in the folder | Run it again (it replaces the data and keeps the previous copy in `/data/backups`) |
| 4 | Open `https://bizomat.fly.dev/__preview/work`, sign in with your own email and password, compare a board, a document and a file with work.kevos.com; `https://bizomat.fly.dev/__preview/clear` returns to the website | The same boards, items, documents and files | Nothing has moved yet: work.kevos.com and `bizomat.ai/tasks` (302) are unchanged |
| 5 | The switch: `TASKS_REDIRECT_ORIGIN` removed, `BIZOMAT_PREVIEW_ROUTING = "0"` and `WORK_CANONICAL_URL = "https://bizomat.ai/tasks"` in `fly.website.toml` (a pull request), then `.\bizomat.ps1 deploy website`. With it, the router sends `bizomat.ai/login` (and `/log-in`, `/signin`) to the website's `/sign-in/`, and every `bizomat.fly.dev` address to the same path on bizomat.ai | `https://bizomat.ai/tasks/` is Project Management; the website's buttons (`/tasks/login`) open its sign-in; sign in once more (a session belongs to its address) | Put `TASKS_REDIRECT_ORIGIN = "https://work.kevos.com"` back and deploy; what was written on Fly since step 3 can go back to D1 with `export-for-d1.mjs` (`BIZOMAT-MIGRATION.md`) |
| 6 | work.kevos.com to Fly, with the same data: `fly certs add work.kevos.com -a bizomat`; Cloudflare: remove the custom domain `work.kevos.com` from the Worker `workos-platform-preview`, then a DNS-only CNAME `work` to `bizomat.fly.dev` on kevos.com. `WORK_CANONICAL_URL` (set in step 5) makes its pages answer 301 to `bizomat.ai/tasks`; its API keeps answering open tabs | `https://work.kevos.com/` answers 301 to `https://bizomat.ai/tasks/` | The custom domain back on the Worker (it still holds the data of step 3) |

Project Management on Fly is in the BIZOMAT brand (the wordmark, "Sign in to BIZOMAT", the platform links, teal for new
workspaces and folders; privacy requests to info@bizomat.ai). Workspace colours chosen before stay as they are (a
colour is the workspace owner's data; KEVOS orange was the old default): change one in the workspace's settings.

### 6d. CAD Automation into the bizomat app, in Sydney, with its data (owner's decision, 6 Nov 2026)

One Fly app for the whole platform: CAD Automation leaves its own app `cados` (one Machine and its volume in
Amsterdam, so every request from Australia crossed the world) for the `cad` group of `bizomat` in Sydney, with its own
volume `cad_data`. `apps/cad` is CADOS exactly (a pinned commit, `apps/cad-source.json`, `scripts/sync-cad.mjs`): CADOS
is what runs and where CAD Automation changes. `OPENSKETCH_PUBLIC_URL` stays `https://bizomat.ai/cad`, and the data is
the same folder byte for byte, so connectors and paired computers carry on. The steps, what moves, the old addresses,
the way back and the retirement are in `infrastructure/migrate/cad/README.md`; all run on the owner's laptop.

| Order | Owner's step | Check | Rollback |
| --- | --- | --- | --- |
| 1 | Merge the cad group change (`UPSTREAM_CAD` stays on cados), then `.\bizomat.ps1 deploy website`: it checks `apps/cad` against CADOS, makes the volume `cad_data`, deploys; the cad Machine shows its holding page | The script's live checks: bizomat.ai/cad still served by cados; the cad group runs | Deploy the previous commit |
| 2 | `.\bizomat.ps1 move cad -DryRun`: everything checked, a copy of the data taken while cados runs and verified on the laptop | The counts (accounts, AI apps, computers), the signing key's id | Nothing changed |
| 3 | `.\bizomat.ps1 move cad`, type yes: a few minutes off line ("being moved"); the router to the cad group, cados frozen, the data copied, checked on both sides, imported, the CAD server started, live checks, cados stopped (autostart off) | The same key at `/cad/v2/keys`, `/cad/setup` goes to sign-in, OAuth metadata; then sign in, Admin, Settings (the private connector address), SOLIDWORKS (the computers), `sw_status` from an AI app | Automatic if a step fails; afterwards `.\bizomat.ps1 back cad` |
| 4 | Merge the change that sets `UPSTREAM_CAD = "http://cad.process.bizomat.internal:8001"` (until then `deploy website` refuses) | `.\bizomat.ps1 status` | Revert it together with `back cad` |
| 5 | Optional, with approval: `cados.kevos.com` to `bizomat` (certificate, then its DNS record), so connections made with it keep working | `https://cados.kevos.com/healthz` answers from the cad group | The record back to cados's address |
| 6 | With the owner's go-ahead: `.\bizomat.ps1 retire cados` (its public addresses released), later `.\bizomat.ps1 delete cados` | bizomat.ai/cad still answers | None: both are irreversible, so each asks for a typed phrase |

### 6e. One Machine for the bizomat app (owner's request, 10 Nov 2026: cut cost)

The router, the website and Project Management move onto one Machine: the existing `work` Machine
(`80e971da556628`), which keeps its volume `work_data` (`vol_vz8om6ze77n5dmqv`, 3 GB, daily snapshots kept 30 days),
its region (`syd`) and its group name. It runs `bizomat-entrypoint all`: the entrypoint starts the three services
exactly as their own Machines did (each its own user, its own settings, work's volume checks and maintenance mode),
the router reaches the other two on `127.0.0.1`, SIGTERM stops the router first, and if any service exits the Machine
exits and Fly restarts it. The Machine is shared-cpu-1x with 1 GB to start. `cados` is not changed, and no `cad` group
is created.

| | Before (9 Nov 2026) | After |
| --- | --- | --- |
| Machines | proxy 256 MB, web 512 MB, work 512 MB (shared-cpu-1x, syd) | work 1 GB (shared-cpu-1x, syd), all three services |
| Public service and checks | on proxy (checks on each group) | on work: `/__proxy/health` :8080, `/healthz` :8003, `/api/health` :8002 |
| Router to backends | `web.process.bizomat.internal:8003`, `work.process.bizomat.internal:8002` | `127.0.0.1:8003`, `127.0.0.1:8002` |
| Compute per month (Sydney list prices, `infrastructure/README.md`) | about 12.2 USD | about 8.5 at 1 GB; about 6.6 at 768 MB; about 4.7 at 512 MB |
| A deploy or restart | each Machine restarts in turn | bizomat.ai offline for the Machine's restart (about 10-60 s) |
| A crash | one product down | all three restart together |

**Memory.** Measured on 10 Nov 2026 with the real router, website and Project Management in one container (the
production image's layout, `bizomat-entrypoint all`, 4,440 website pages and Project Management's APIs through the
router): about 85 MB idle; at most 262 MB under a 450 MB limit and 316 MB with room, at 48 requests at a time (about
1,100 a second), with no out-of-memory kill. The web process holds most of it (up to 166 MB of its own), then the
router and Project Management (about 70 MB each). Production has to confirm this with its own traffic, AI search and
uploads (Project Management accepts up to 32 MB a request): read it with
`fly machine exec 80e971da556628 -a bizomat "bash /usr/local/lib/bizomat/memory.sh"` (the Machine's used and
available memory, and each service's) and Fly's metrics for the Machine (memory over time). Suggested rule: after at
least a week, go to 768 MB if the Machine's used memory stayed under 400 MB, and to 512 MB if it stayed under 300 MB.
Each step is a pull request changing `memory` in `[[vm]]`, deployed with `allow_machine_change` = `YES`.

**Why the work group alone is deployed first.** `flyctl deploy` destroys the Machines of groups that are no longer in
the file before it updates any other Machine (flyctl v0.5.6, `deployMachinesApp`), and asks nothing. A plain deploy of
this file would therefore destroy proxy and web first, leaving bizomat.ai with no Machine until work has restarted,
and remove the fallback before anything was checked. `--process-groups work` takes proxy and web out of the deploy
entirely: work takes over the public service while the old router still serves, and proxy and web are parked, then
removed only after verification. The preflight knows both cases (`.github/scripts/fly-preflight.py`, and its tests).

**Until the cutover is done, deploy nothing else.** Once this change is on `main`, `fly.website.toml` describes one
Machine while production still has three. The deploy workflow's preflight stops a deploy then (proxy and web are not
in the file); `.\bizomat.ps1 deploy website` (bizomat-cad `tools/laptop`) runs no preflight and would run the plain
deploy above (it also still deploys from a clone of the archived `jogkev-creator/gocore-website`: do not use it for the
website). Merge and cut over in one sitting.

**Where each step runs.** The deploy (steps 3 and 4) runs in the deploy workflow, as every deploy of `bizomat` does:
it builds the image on the GitHub runner (Fly's remote builder stopped answering on 10 Nov 2026) and, with
`process_groups` = `work`, deploys the work group alone. The snapshot, the checks and parking the old Machines are
`fly` commands on the laptop (machine and volume operations, not deploys).

The laptop steps run in a clean clone of `kevinjogin/bizomat-site` at `origin/main` with this change, made with
`git clone --config core.autocrlf=false https://github.com/kevinjogin/bizomat-site` (the deploy uploads the laptop's
files to Fly's builder: with Windows line endings the entrypoint script would not run, and the Machine would not start;
`git config core.autocrlf` in the clone must say `false`), signed in with
`fly auth login`, with Python 3.11 or newer (the preflight reads TOML with `tomllib`) and Node.js 22.19 or newer (the
smoke test). Commands are the same in PowerShell, except where noted; on Windows, `python3` below is `py -3`. Write each
value below into the cutover log.

| Step | Do | Check | If it goes wrong |
| --- | --- | --- | --- |
| 0 | `git fetch origin`, `git status`: `main` at `origin/main`, nothing changed. `fly machine list -a bizomat`: note the ids of the proxy and web Machines (PROXY_ID, WEB_ID below); work is `80e971da556628`. `fly volumes list -a bizomat`: `work_data` `vol_vz8om6ze77n5dmqv` attached to `80e971da556628`. `fly releases -a bizomat --image`: note the current image (the way back) | Three Machines started in syd; the volume attached to work | Stop: production is not what this section expects |
| 1 | Snapshot: `fly volumes snapshots create vol_vz8om6ze77n5dmqv -a bizomat`, then `fly volumes snapshots list vol_vz8om6ze77n5dmqv -a bizomat` until the new snapshot is listed as created. Note its id | A snapshot from the last minutes | Do not go on without it |
| 2 | **STOP. Confirm your own backup of Project Management's data** (for example the portable copy in `BIZOMAT-OPERATIONS.md`, section 4, kept outside Fly) **before the switch.** The steps so far changed nothing | | |
| 3 | Dry run: Actions > BIZOMAT deploy (bizomat) > Run workflow on `main`: `confirm` = `DEPLOY`, `allow_machine_change` empty, `process_groups` = `work`. The preflight stops the run, deploying nothing; its summary must list one change only, `80e971da556628` from 512 to 1024 MB, with proxy and web "left as it is". (The same on the laptop: `python3 .github/scripts/fly-preflight.py --app bizomat --config fly.website.toml --process-groups work`.) | Only that change | Any other change listed: stop |
| 4 | The switch: the same run with `allow_machine_change` = `YES` and `process_groups` = `work`. The runner builds the image (about 10 minutes), then only `80e971da556628` is updated: the new image, `bizomat-entrypoint all`, 1 GB, the public service and the three checks. The old router keeps serving meanwhile; `/tasks` answers 502 while work restarts (10-60 s). The run then asks the work Machine for its version and runs the public checks | The run is green; the work Machine reports the new version | If Fly cannot give the Machine 1 GB on its host, or the Machine does not become healthy: the old router still serves; go back with `BIZOMAT-ROLLBACK.md`, section 6a, step 2 |
| 5 | Check the new Machine directly (the header sends a request to that Machine only): `curl -sS -H "fly-force-instance-id: 80e971da556628" https://bizomat.fly.dev/__proxy/health` (the new version) and `.../__proxy/ready` (web, work and cad ok); then with the same header `https://bizomat.ai/` (200), `https://bizomat.ai/tasks/` (200 or 302), `https://bizomat.ai/cad/` (200), `https://bizomat.ai/login` (301). `fly checks list -a bizomat`: the three checks of `80e971da556628` passing. (PowerShell: `curl.exe`.) | All as listed | As in step 4 |
| 6 | Park the old Machines (zero running, kept for the way back): `fly machine stop <PROXY_ID> -a bizomat`, then `fly machine update <PROXY_ID> -a bizomat --autostart=false --skip-start -y` (so Fly's proxy never starts it for a request), then `fly machine stop <WEB_ID> -a bizomat` | `fly machine list -a bizomat`: `80e971da556628` started, the other two stopped | `BIZOMAT-ROLLBACK.md`, section 6a |
| 7 | Public checks without the header: `/`, `/cad-automation/`, `/work/`, `/resources/`, `/tools/`, `/reados/`, `/engine-room/` (and `/about/`, `/proof-of-work/` redirecting to it), `/privacy/`, `/terms/`, `/disclaimer/`; `/tasks/` and `/cad/`; `node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode live`; in a browser: the wordmark, the navigation, sign-in to Project Management, AI search. Memory: `fly machine exec 80e971da556628 -a bizomat "bash /usr/local/lib/bizomat/memory.sh"` | Everything answers; note the memory figures | `BIZOMAT-ROLLBACK.md`, section 6a |
| 8 | Later, after the owner has verified it (a few days of normal use): remove the parked Machines, `fly machine destroy <PROXY_ID> -a bizomat` and `fly machine destroy <WEB_ID> -a bizomat`. Then `python3 .github/scripts/fly-preflight.py --app bizomat --config fly.website.toml` reports no change, and `fly machine list -a bizomat` shows one Machine. From then on the deploy workflow and `bizomat.ps1 deploy website` deploy the one Machine as usual | One Machine; the preflight passes | `BIZOMAT-ROLLBACK.md`, section 6a, "after the removal" |

While proxy and web are parked, a deploy of this file without `--process-groups work` is stopped by the preflight
(they are not in the file); with `allow_machine_change` = `YES` it would destroy them, which is step 8 done early.
Parked Machines cost only their stored image, not compute.

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
- Merging to `main` publishes nothing on Cloudflare: `wrangler.toml` is the Worker `bizomat`, and
  `scripts/deploy-guard.mjs` refuses Cloudflare's Workers Builds, any deploy but the laptop tool's from origin/main,
  any other Worker name and any kevos.com route (the move to Cloudflare: `BIZOMAT-CLOUDFLARE-MIGRATION.md`).
- Leave the old deployments running for the rollback window (`BIZOMAT-ROLLBACK.md`).

## 8. What the owner must do (not possible from this session)

1. Confirm the registration and DNS provider of `bizomat.ai` (not verifiable here) and give access to change its
   records.
2. Create the Fly token and the app (section 3, steps 1 and 2).
3. Set any optional secrets (section 3, step 3). CAD Automation needs no server password; its own settings move with
   its data (section 6d).
4. Run the deploy workflow, then the checks in section 5.
5. Make each DNS change in section 6, in order, after its checks pass.
6. Provide a Cloudflare API token with D1 read and R2 read for the Project Management export
   (`BIZOMAT-MIGRATION.md`).
