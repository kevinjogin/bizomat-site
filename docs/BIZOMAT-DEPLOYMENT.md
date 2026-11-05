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

| Host | Served by | Notes |
| --- | --- | --- |
| `bizomat.ai` | web | Canonical website |
| `www.bizomat.ai` | proxy | 301 to `https://bizomat.ai` with the same path and query |
| `work.bizomat.ai`, `work.kevos.com` | work | Every path unchanged, WebSockets included |
| `cad.bizomat.ai`, `cados.kevos.com` | cad | Every path unchanged: MCP, OAuth, device and add-in links. `cados.kevos.com` stays the canonical CAD address (`OPENSKETCH_PUBLIC_URL`) until `cad.bizomat.ai` is verified |
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

## 7. After cutover

- Set `BIZOMAT_PREVIEW_ROUTING = "0"` in `fly.toml` and deploy.
- Project Management keeps today's open sign-up and 72-hour sessions (`fly.toml`, `WORK_ALLOW_SIGNUP`,
  `WORK_SESSION_TTL_HOURS`). Closing sign-up (new people then need an invitation) or changing the session length is
  the owner's decision.
- Keep `OPENSKETCH_PUBLIC_URL = "https://cados.kevos.com"` until the owner decides to make `cad.bizomat.ai`
  canonical. Both hosts already serve their own OAuth metadata; changing the canonical address later changes the
  links CAD Automation shows and the address new AI app connections use, while existing connections keep working
  on the host they were made with.
- Website links to the apps follow `PUBLIC_CAD_APP_URL` and `PUBLIC_WORK_APP_URL` (build-time settings; defaults are
  the kevos.com hosts, which work before and after cutover). Change them to the bizomat.ai hosts once those are live.
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
