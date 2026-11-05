# BIZOMAT deployment

How the platform is built and deployed as one Fly.io app, and how each domain moves to it. Configuration:
`fly.toml`, `infrastructure/`, `.github/workflows/bizomat-*.yml`. Command-level detail: `infrastructure/README.md`.
Data moves: `BIZOMAT-MIGRATION.md`. Going back: `BIZOMAT-ROLLBACK.md`.

**Status (5 Nov 2026): prepared, not deployed.** This session had no Fly.io token and could not reach fly.io,
Cloudflare or bizomat.ai, so nothing below has been run against them. Section 8 lists exactly what the owner must do.

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

**Addresses (owner's decision, 5 Nov 2026):** everything lives under bizomat.ai, with no subdomains: CAD Automation is
`https://bizomat.ai/cad` and Project Management `https://bizomat.ai/tasks`. Today the website's Worker routes those
paths (section 6a). This single-app plan predates that decision and still names `work.bizomat.ai` and
`cad.bizomat.ai`. Before it is used: the proxy (`infrastructure/proxy`) must route `/cad` and `/tasks` by path as
the Worker does, and `apps/cad` and `apps/work` must take the path changes made in their source repositories
(jogkev-creator/CADOS#14 and the page policy after it; jogkev-creator/PMO#2).

| Host | Served by | Notes |
| --- | --- | --- |
| `bizomat.ai` | web | Canonical website |
| `www.bizomat.ai` | proxy | 301 to `https://bizomat.ai` with the same path and query |
| `work.bizomat.ai`, `work.kevos.com` | work | Every path unchanged, WebSockets included |
| `cad.bizomat.ai`, `cados.kevos.com` | cad | Every path unchanged: MCP, OAuth, device and add-in links. `cad.bizomat.ai` is CAD Automation's own address; `cados.kevos.com` stays the canonical one (`OPENSKETCH_PUBLIC_URL`) until `cad.bizomat.ai` is verified (section 6a) |
| `kevos.com`, `www.kevos.com` | proxy | 301 to `https://bizomat.ai` with the same path and query (GET, HEAD); form posts to `/api/*` go to web |
| `bizomat.fly.dev` | web, plus a preview switch | `/__preview/work`, `/__preview/cad`, `/__preview/web`, `/__preview/clear` route one browser to a service before DNS moves (only while `BIZOMAT_PREVIEW_ROUTING=1`) |

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
4. **Google sign-in** (only if used): add the new redirect URIs to each Google OAuth client:
   `https://work.bizomat.ai/api/auth/oauth/google/callback` (Project Management) and
   `https://cad.bizomat.ai/auth/google/callback` (CAD Automation builds it from the host the person uses). Keep the
   kevos.com ones during the rollback window.

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
3. In a browser on `https://bizomat.fly.dev`: the website; then `/__preview/work` (Project Management sign-in page)
   and `/__preview/cad` (CAD Automation product page and sign-in); `/__preview/clear` to return.
4. For data cutovers, the migration reports show no unexplained difference (`BIZOMAT-MIGRATION.md`).

## 6. Domains, in order

Certificates first: for each host, `fly certs add <host> -a bizomat`, then `fly certs setup <host> -a bizomat`
shows the `_acme-challenge` CNAME to add. With it, Fly issues the certificate before any traffic moves (DNS-01
validation). Records for Fly must be **DNS only** in Cloudflare (grey cloud), as `cados.kevos.com` is today.

Before changing any record, write down its current value in the cutover log; that value is the rollback. Lower the
TTL of each record that will change to 60 seconds a day before. Never change the kevos.com MX, SPF, DKIM or DMARC
records. After each host: `node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode live`. The exact
per-host steps are in `infrastructure/README.md`, "DNS cutover".

| Step | Host | Change | When |
| --- | --- | --- | --- |
| 1 | `bizomat.ai`, `www.bizomat.ai` | A and AAAA records to the app's addresses (`fly ips list -a bizomat`; allocate a dedicated IPv4 with `fly ips allocate-v4` if the shared one is not wanted) | After section 5 passes |
| 2 | `work.bizomat.ai`, `cad.bizomat.ai` | CNAME to `bizomat.fly.dev` (or the same A and AAAA records) | After step 1; reachable before any data moves, so test with throwaway accounts only, then empty the volumes again |
| 3 | `work.kevos.com` | Project Management data cutover (`BIZOMAT-MIGRATION.md`), then: remove the custom domain from the `workos-platform-preview` Worker and add a DNS-only CNAME `work` to `bizomat.fly.dev` | After its data is imported and verified |
| 4 | `cados.kevos.com` | CAD Automation data cutover, then: point `_acme-challenge.cados.kevos.com` at the target `fly certs setup` shows for `bizomat`, wait for the certificate, and change the DNS-only CNAME `cados` from `cados.fly.dev` to `bizomat.fly.dev` (if Fly refuses the certificate because `cados` holds the name, remove it there in the same window: `fly certs remove cados.kevos.com -a cados`) | After its data is imported and verified |
| 5 | `kevos.com`, `www.kevos.com` | Recommended (option A): a Cloudflare redirect rule on the kevos.com zone (Rules, Redirect Rules): when the hostname is `kevos.com` or `www.kevos.com` and the path does not start with `/api/` (cached pages may still post forms there; the Worker keeps answering them), dynamic redirect to `concat("https://bizomat.ai", http.request.uri.path)`, status 301, query string preserved. Option B: move both records to Fly (DNS only) and let the proxy redirect | When the owner decides kevos.com should become bizomat.ai |

Option A keeps the Worker route `kevos.com/*` in place behind the rule, so turning the rule off is the rollback, and
nothing about kevos.com moves to Fly. Option B is described in `infrastructure/README.md`; the proxy already answers
kevos.com with the same redirects.

### 6a. Today's deployments under bizomat.ai (owner's decision, 5 Nov 2026: everything under bizomat.ai, no subdomains)

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
| 1 | Deploy CADOS `main` (with jogkev-creator/CADOS#14) to the `cados` app: from a fresh clone made with `git clone --config core.autocrlf=false https://github.com/jogkev-creator/CADOS`, `fly deploy -a cados` in that folder (not from another directory), or the Fly dashboard | `https://bizomat.ai/healthz` shows the new commit; `https://bizomat.ai/cad/` is the CAD app; `https://cados.kevos.com/docs` answers 301 to `https://bizomat.ai/cad/docs`; `https://cados.kevos.com/.well-known/oauth-protected-resource/mcp` still names `cados.kevos.com` | `fly releases -a cados --image`, then `fly deploy -a cados --image <the previous image>` |
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
treats the name as an old host (pages 301 to `https://bizomat.ai/cad`).

## 7. After cutover

- Set `BIZOMAT_PREVIEW_ROUTING = "0"` in `fly.toml` and deploy.
- Project Management keeps today's open sign-up and 72-hour sessions (`fly.toml`, `WORK_ALLOW_SIGNUP`,
  `WORK_SESSION_TTL_HOURS`). Closing sign-up (new people then need an invitation) or changing the session length is
  the owner's decision.
- CAD Automation's public address is `OPENSKETCH_PUBLIC_URL = "https://bizomat.ai/cad"` (as on the `cados` app). The
  old hosts keep serving their own OAuth metadata, so connections made with them keep working.
- Website links to the apps follow `PUBLIC_CAD_APP_URL` and `PUBLIC_WORK_APP_URL` (build-time settings; defaults
  `https://bizomat.ai/cad` and `https://bizomat.ai/tasks`).
- Merging to `main` also publishes the website at kevos.com through Cloudflare's GitHub integration. Leave it on
  while kevos.com is served by the Worker; disconnect it after step 5 if the Worker is no longer used.
- Leave the old deployments running for the rollback window (`BIZOMAT-ROLLBACK.md`).

## 8. What the owner must do (not possible from this session)

1. Confirm the registration and DNS provider of `bizomat.ai` (not verifiable here) and give access to change its
   records.
2. Create the Fly token and the app (section 3, steps 1 and 2).
3. Set `OPENSKETCH_PASSWORD` and any optional secrets (section 3, step 4).
4. Run the deploy workflow, then the checks in section 5.
5. Make each DNS change in section 6, in order, after its checks pass.
6. Provide a Cloudflare API token with D1 read and R2 read for the Project Management export
   (`BIZOMAT-MIGRATION.md`).
