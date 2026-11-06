# BIZOMAT platform infrastructure (runbook draft)

One Fly.io app, `bizomat` (Sydney, `syd`), runs the whole platform from one image. Each process group is a Machine
of its own with one role. Only the proxy is public.

```
                    https (Fly edge: TLS, HTTP/2, force_https)
 visitors, AI apps,          |
 CAD add-ins, Companions     v
                    +------------------+  Machine group "proxy" (shared-cpu-1x, 256 MB), port 8080
                    |  edge proxy      |  routes bizomat.ai by path, other hosts by name; streams bodies, passes WebSockets
                    +------------------+
          6PN (private IPv6)  |  web.process.bizomat.internal / work.process... / cad.process...
        +---------------------+----------------------+
        v                     v                      v
 +-------------+      +---------------+      +----------------+
 | web  :8003  |      | work  :8002   |      | cad   :8001    |
 | website and |      | Project Mgmt  |      | CAD Automation |
 | site APIs   |      | /data/work    |      | /data/cad      |
 +-------------+      +---------------+      +----------------+
  shared 512 MB        shared 512 MB          performance-1x 2 GB
  no volume            volume work_data       volume cad_data
```

| Path | What |
| --- | --- |
| `proxy/` | the edge proxy (Node 22, no dependencies): `routes.mjs` (the routing table), `headers.mjs` (header hygiene, trust model), `upstreams.mjs` (6PN lookups), `proxy.mjs`, `server.mjs`; tests in `proxy/test/` |
| `fly/Dockerfile` | the image (build context: the repository root; `.dockerignore` at the root) |
| `fly/entrypoint.sh` | `bizomat-entrypoint <role>`: volume checks, a clean environment per role, drop to the role's user |
| `../fly.toml` | the app: process groups, the one service, checks, volumes, Machine sizes, restart policy |
| `local/` | the same image as four compose services; stand-ins for unbuilt backends; the secret-isolation check |
| `smoke/smoke.mjs` | checks every host through the proxy (compose, `bizomat.fly.dev` before DNS, live after) |
| `migrate/` | data moves: `cad/` (the cados volume), `work/` (D1 and R2 to the work volume), `restore.sh` |
| `../.github/workflows/bizomat-*.yml` | CI, deploy (manual), work data migration (manual) |

## Roles

| Role | Command | Port | User (uid) | Data | Health | Machine |
| --- | --- | --- | --- | --- | --- | --- |
| proxy | `node /app/proxy/server.mjs` | 8080 (public via Fly) | bzproxy (10001) | none | `/__proxy/health` | shared-cpu-1x 256 MB |
| web | `node /app/web/dist-server/server.mjs` | 8003 | bzweb (10002) | none | `/healthz` | shared-cpu-1x 512 MB |
| work | `node /app/work/dist/node/server.mjs` | 8002 | bzwork (10003) | `/data/work` (`work_data`) | `/api/health` | shared-cpu-1x 512 MB |
| cad | `python -m opensketch --host :: --port 8001 --no-browser --supervise` | 8001 | bzcad (10004) | `/data/cad` (`cad_data`) | `/healthz` | performance-1x 2 GB |

Every role listens on all interfaces: IPv6 for the proxy's 6PN connections, IPv4 for Fly's top-level checks. Node
listens on `::` (dual-stack). The CAD server gets `--host ::` and opens the dual-stack socket itself
(`apps/cad/opensketch/__main__.py`, `listen_sockets`; IPv4 alone where the kernel has no IPv6): asyncio on its own would
make a `::` socket IPv6-only, and the CAD supervisor's `127.0.0.1` probe and Fly's IPv4 checks would then fail. Do not
pass `--host ''`: the CAD server reads it as `127.0.0.1`, which the proxy cannot reach.

work and cad must each run **exactly one Machine**: a volume belongs to one Machine and is never shared, so a second
Machine would start with an empty data folder. Never `fly scale count work=2` or `cad=2`. proxy and web are
stateless and can run two Machines (`fly scale count proxy=2 web=2 --region syd`).

## Routing

From `proxy/routes.mjs` (tested in `proxy/test/routes.test.mjs`). Everything lives under bizomat.ai, no subdomains: on
bizomat.ai the proxy routes by path, as the website's Worker does (`src/worker.ts`; the tests check that the two
`CAD_PATHS` are equal), every other host by its name. A path is matched as the website reads it (WHATWG URL: dot
segments resolved). The Host header is never rewritten; paths are never changed (each app takes its prefix off
itself).

| Host | Requests | Goes to |
| --- | --- | --- |
| `bizomat.ai` | `/cad`, `/cad/...`; the OAuth metadata at the root (`/.well-known/oauth-protected-resource...`, `/.well-known/oauth-authorization-server...`, `/.well-known/openid-configuration...`); the root program paths `/mcp...`, `/solidworks/mcp...`, `/oauth/...`, `/v2/...`, `/healthz`, `/.well-known/acme-challenge/...` | cad |
| | `/tasks`, `/tasks/...` (WebSockets included) | work |
| | GET, HEAD of `/CAD...`, `/Tasks/...` (any case but lowercase) | 301 to the lowercase path, query kept |
| | everything else | web |
| `www.bizomat.ai` | GET, HEAD / others | 301 / 308 to `https://bizomat.ai` + path + query |
| `cados.kevos.com` (CAD Automation's old address) | all paths, all methods, upgrades | cad |
| `work.kevos.com` (Project Management's old address) | all paths, WebSockets | work |
| `kevos.com`, `www.kevos.com` | GET, HEAD of `/cad`, `/cad/` (the old CAD Automation page) | 301 to `https://bizomat.ai/cad-automation/` + query |
| | GET, HEAD | 301 to `https://bizomat.ai` + same path + query (`/tools/...`, `/reados/...` exist there; `/insights/*` is sent as-is and the web app redirects it) |
| | other methods to `/api`, `/api/*` | web (old cached pages still post forms) |
| | other methods elsewhere | 308 to `https://bizomat.ai` + path + query |
| `<app>.fly.dev` | `/__proxy/health`, `/__proxy/ready` | the proxy itself |
| | `/__preview/cad`, `/work`, `/web`, `/clear` (only with `BIZOMAT_PREVIEW_ROUTING=1`) | sets or clears the host-only cookie `bizomat_preview`, then 303 to `/` (or `?next=/path`) |
| | everything else, with the cookie and preview routing on | the cookie's backend at the root, as the old addresses serve it (Host unchanged) |
| | everything else | as on bizomat.ai, by path (so `/cad/` and `/tasks/` work before DNS moves) |
| anything else (IPs, unknown names, `cad.bizomat.ai`, `work.bizomat.ai`) | `/__proxy/health`, `/__proxy/ready` | the proxy itself |
| | everything else | 421 |

`/__proxy/ready` asks each backend's health path (2.5 s timeout, answer cached 2 s) and answers 200 only when all
three answer; 503 otherwise, with each backend's status (no addresses). The proxy's Fly check uses
`/__proxy/health` (process alive), so a backend outage never blocks a proxy deploy.

## The proxy

- **Streaming:** request and response bodies are piped both ways, never buffered (large uploads, long polls,
  server-sent events). WebSocket and other upgrades are tunnelled byte for byte (`h2c` upgrades are refused).
- **Timeouts:** request headers 60 s; a request, response or WebSocket idle (no byte either way) for 620 s is closed
  (Fly's `http_options.idle_timeout` is 600 s; 25-60 s long polls and MCP calls that wait up to 240 s fit); a whole
  request body may take an hour; keep-alive from the edge 75 s. A backend silent past the idle timeout gives 504.
- **Retries:** one retry after a fresh DNS lookup, only when nothing has been sent yet (connection refused, or a reset
  on a reused keep-alive socket before any body byte). Otherwise 502. Lookups of `*.internal` are IPv6 only, cached
  5 s, dropped on any connection failure, rotated across addresses.
- **Errors:** 502/504 (and 400/404/405/421) are short BIZOMAT pages for browsers (`Accept: text/html`), plain text
  otherwise; no script, no style, `Content-Security-Policy: default-src 'none'`, `Cache-Control: no-store`.
- **Headers removed** from requests: hop-by-hop headers (and those named in `Connection`), `Expect`, every client-sent
  `X-Forwarded-*`, `Forwarded`, `X-Real-IP`, `True-Client-IP` and similar, every `Fly-*`, `CF-*` and `X-Bizomat-*`.
  **Set:** `X-Forwarded-For` (one address), `X-Real-IP`, `CF-Connecting-IP` (work reads it), `Fly-Client-IP` (cad reads
  it), all the same client IP; `X-Forwarded-Proto`; `X-Forwarded-Host` (the Host as received); `X-Bizomat-Request-Id`.
  **Responses:** hop-by-hop headers removed; `Strict-Transport-Security: max-age=31536000; includeSubDomains` added on
  the six production hosts when the backend sent none (the value kevos.com already uses); `X-Robots-Tag: noindex`
  on the preview host.
- **Log:** one JSON line per request on stdout: `t, host, method, path, status, upstream, ms, id` (+ `upgrade`,
  `aborted`, `err` code). The path has no query and credential-like segments are replaced by `:redacted` (private
  connector addresses `/mcp/<key>` and `/cad/mcp/<key>`, invite links, long tokens); no client IP, cookie or header is logged; an IP
  used as Host is logged as `ip`.
- **Stop:** on SIGTERM (fly.toml `kill_signal`) it stops accepting, lets open requests finish for 10 s, then closes
  long polls and WebSockets (clients reconnect) and exits 0. `kill_timeout` is 15 s.

### Client IP trust model

Fly's edge terminates TLS and connects to the proxy over the Machine's local virtual interface, setting
`Fly-Client-IP` and `X-Forwarded-Proto` itself. The only other way to reach port 8080 is the organisation's private
network (6PN, `fdaa::/16`): other Machines and apps of the org, and WireGuard peers such as `fly proxy`.

- `PROXY_CLIENT_IP_MODE=fly` (automatic when `FLY_APP_NAME` is set): a peer inside `PROXY_UNTRUSTED_PEERS` (default
  `fdaa::/16`) is not the edge, so its `Fly-Client-IP` and `X-Forwarded-*` are ignored and its socket address is the
  client. Any other peer is the edge: the client is `Fly-Client-IP`, the scheme `X-Forwarded-Proto` (https if absent).
- `PROXY_CLIENT_IP_MODE=socket` (automatic elsewhere, e.g. compose): no header is trusted.
- `PROXY_TRUST_CLOUDFLARE=1` only if a host's DNS record is proxied by Cloudflare (orange cloud): then Fly's client is a
  Cloudflare address, and `CF-Connecting-IP` is trusted only when `Fly-Client-IP` is inside Cloudflare's ranges
  (built in; `PROXY_CLOUDFLARE_RANGES` replaces them). The cutover below keeps every record DNS-only (grey), so this
  stays off.

Whatever the mode, the backends receive exactly one client IP; a client can never choose it.

## Settings and secrets

Fly secrets and `[env]` are environment variables of **every** Machine of the app. The entrypoint therefore starts each
service with `env -i` and an allow-list, as the role's own user (`setpriv --reuid --regid --init-groups
--no-new-privs`, no capabilities, empty bounding set), so the website never holds the CAD password, and a service
cannot read the full environment from `/proc/1/environ` or any other root process.

| Role | Receives (names) | From |
| --- | --- | --- |
| all | `FLY_APP_NAME FLY_MACHINE_ID FLY_ALLOC_ID FLY_REGION FLY_PUBLIC_IP FLY_PRIVATE_IP FLY_IMAGE_REF FLY_MACHINE_VERSION FLY_PROCESS_GROUP FLY_VM_MEMORY_MB PRIMARY_REGION BIZOMAT_VERSION TZ` | Fly, the image |
| proxy | `UPSTREAM_WEB UPSTREAM_WORK UPSTREAM_CAD BIZOMAT_PREVIEW_ROUTING PROXY_*` | `[env]` |
| web | `CF_ACCOUNT_ID CF_AI_TOKEN ANTHROPIC_API_KEY TURNSTILE_SECRET_KEY WEB_*`; fixed `PORT=8003 HOST WEB_DIST_DIR=/app/web/dist WEB_TRUST_PROXY=1` | secrets |
| work | `WORK_*`; `APP_URL APP_NAME ENVIRONMENT ALLOW_SIGNUP SESSION_TTL_HOURS` from `WORK_APP_URL ...`; `GOOGLE_CLIENT_ID/SECRET` from `WORK_GOOGLE_CLIENT_ID/SECRET`; fixed `PORT=8002 HOST WORK_DATA_DIR=/data/work WORK_STATIC_DIR WORK_TRUST_PROXY=1` | `[env]`, secrets, `/data/work/.secrets/` |
| cad | `OPENSKETCH_*`; `GOOGLE_CLIENT_ID/SECRET` from `CAD_GOOGLE_CLIENT_ID/SECRET`; fixed `OPENSKETCH_DATA=/data/cad` | `[env]`, secrets, `/data/cad/.secrets/` (where `bizomat.ps1 move cad` writes the settings it moves from cados) |

Both apps read `GOOGLE_CLIENT_ID`; the `WORK_` and `CAD_` prefixes keep their two Google clients apart.

Set the secrets with flyctl (staged, applied by the next deploy). Values come from the owner; never paste them into
files in the repository:

```bash
fly secrets set --stage --app bizomat CF_ACCOUNT_ID=... CF_AI_TOKEN=...          # or ANTHROPIC_API_KEY=...
fly secrets set --stage --app bizomat TURNSTILE_SECRET_KEY=...                   # optional
fly secrets set --stage --app bizomat WORK_GOOGLE_CLIENT_ID=... WORK_GOOGLE_CLIENT_SECRET=...   # optional
fly secrets list --app bizomat                                                   # names only
```

CAD Automation has no server password (CADOS#11), and its own settings (cados's `OPENSKETCH_*` secrets, its Google
client) are not Fly secrets of `bizomat`: `bizomat.ps1 move cad` reads them from the cados server and writes them as
the cad volume's secret files (below), so no other Machine of the app ever holds them.

**Stronger option for work and cad secrets: files on the role's own volume.** Only that Machine ever sees them; other
Machines' environments never contain them. A file `/data/<role>/.secrets/NAME` (root-owned folder, mode 0700; file
root-owned, 0600) becomes the setting `NAME` and wins over a Fly secret of the same name. Links, files not owned by
root and names outside the role's allow-list are skipped (named in the log, values never):

```bash
fly ssh console -a bizomat -g cad      # a root shell on the cad Machine
install -d -m 0700 /data/cad/.secrets
( umask 077; cat > /data/cad/.secrets/OPENSKETCH_ACCESS_CODE )   # paste, Enter, Ctrl-D
exit
fly machine restart <cad-machine-id> -a bizomat
```

The cad role never starts the CAD server on a volume without CAD data (`users.json` or `accounts.enabled`): a CAD
server without accounts offers its setup page, where the first visitor becomes the owner. Until `bizomat.ps1 move cad`
has put the data there (and in maintenance mode) it answers with its holding page (`fly/cad-holding.py`). A new, empty
platform starts it with `BIZOMAT_CAD_ALLOW_EMPTY=1`, and its owner then creates the owner account at once.

### Residual risks

- Fly secrets still reach every Machine's init environment (root-owned). Root on any Machine (`fly ssh console`, or a
  kernel or container escape) reads them all. Only volume secret files avoid that, for work and cad. web's secrets
  can only be Fly secrets (it has no volume).
- A compromised service keeps what its own role holds (cad: its settings and its data folder with every key; work:
  its Google client secret; web: the AI and Turnstile keys) and its own data folder.
- The entrypoint makes Fly's in-VM API socket `/.fly/api` root-only (`BIZOMAT_KEEP_FLY_API=1` leaves it alone):
  untested on a real Machine.
- Members of the Fly organisation can reach every Machine's port over 6PN; the backends trust the proxy's
  forwarding headers, so such a peer can claim any client IP to a backend directly (it cannot through the proxy).
- `[env]` values (public addresses, names) are visible to every role; they are not secret.

## Deploy

First time (from GitHub): add the repository secret `FLY_API_TOKEN` (an organisation token: `fly tokens create org -o
<org>`) and, if the org is not `personal`, the variable `FLY_ORG`. Run **Actions > BIZOMAT deploy**. The first run
creates the app, the volumes `cad_data` and `work_data` (syd, 3 GB, snapshots kept 30 days) and the public addresses,
and deploys
(`flyctl deploy --remote-only --config fly.toml --ha=false`), waits until `https://bizomat.fly.dev/__proxy/health`
shows the commit, and runs the smoke test through the preview cookie.

By hand, from the repository root:

```bash
fly apps create bizomat --org <org>
fly volumes create cad_data  --app bizomat --region syd --size 3 --snapshot-retention 30 --yes
fly volumes create work_data --app bizomat --region syd --size 3 --snapshot-retention 30 --yes
fly deploy --app bizomat --config fly.toml --remote-only --ha=false --build-arg BIZOMAT_VERSION=$(git rev-parse --short HEAD)
node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode preview --wait 180
```

Deploys are rolling, one Machine at a time; work and cad are offline for the 10-60 s their Machine is replaced (the
proxy answers 502 meanwhile; add-ins, Companions and WebSockets reconnect). Watch with `fly status -a bizomat` and
`fly logs -a bizomat`.

The owner's laptop deploys with `bizomat.ps1 deploy website` (`fly.website.toml`, every group) and, after the CAD
move, `bizomat.ps1 deploy cad` (the cad group alone, `--process-groups cad`).

Data moves: `migrate/cad/README.md` (the cados volume, `bizomat.ps1 move cad`) and **Actions > BIZOMAT migrate work data** (dry-run, then
apply). Maintenance mode for either: `touch /data/.bizomat-maintenance` on the Machine, restart it; the service stays
off and the Machine up until the file is removed and the Machine restarted.

## Rollback

- **A bad release:** `fly releases -a bizomat --image` lists the releases with their images; redeploy the previous one:
  `fly deploy -a bizomat --config fly.toml --image <registry.fly.io/bizomat:deployment-...> --ha=false`.
- **Bad data on a volume:** each restore keeps the replaced folder in `/data/backups/<role>-<time>/` (move it back in
  maintenance mode). Fly snapshots (daily, 30 days; the work migration also takes one before it applies):
  `fly volumes snapshots list <volume-id> -a bizomat`, then `fly volumes create cad_data --snapshot-id <snapshot-id>
  -s 3 -r syd -a bizomat` makes a new volume from one; move the Machine onto it with `fly machine clone
  <cad-machine-id> --attach-volume <new-volume-id>:/data -a bizomat`, check it, then destroy the old Machine (its
  volume stays until you delete it). Keep only one started Machine per group.
- **Back to the old platform:** keep the `cados` Fly app (frozen, not deleted), the kevos.com Worker
  `throbbing-block-6c61` and the `workos-platform-preview` Worker unchanged until the rollback window ends. Going back
  is a DNS change (and certificate) back to them, plus `freeze.sh cont` on cados.

## DNS cutover

Only after the new app passes its smoke tests through `bizomat.fly.dev`. Never from CI. All records **DNS-only**
(Cloudflare grey cloud): Fly issues and renews the certificates, and `Fly-Client-IP` is the real visitor. For each
host: the certificate on `bizomat` first, then the record.

1. Addresses and per-host instructions: `fly ips list -a bizomat` (shared IPv4 and IPv6), and for each host
   `fly certs add <host> -a bizomat`, then `fly certs setup <host> -a bizomat`: it prints the validation record
   (`_acme-challenge.<host>` CNAME, or `_fly-ownership` TXT). Add the validation record first: the certificate is then
   issued before traffic moves. `fly certs check <host> -a bizomat` until it reports issued.
2. Lower each record's TTL (60 s) a day before.
3. Per host, in this order (`docs/BIZOMAT-DEPLOYMENT.md`, section 6). bizomat.ai carries the website, CAD Automation
   (`/cad`) and Project Management (`/tasks`) by path, so it moves together with CAD's data, after Project Management:
   - `work.kevos.com` (after the work data apply): today a Workers custom domain of `workos-platform-preview`. If the
     website's `TASKS` service binding was made, comment it out and merge first (bizomat.ai/tasks then redirects to
     work.kevos.com). Remove the custom domain (Cloudflare: Workers > workos-platform-preview > Settings > Domains &
     Routes; this deletes its DNS record), then add the DNS-only CNAME `bizomat.fly.dev`. Keep the Worker itself.
   - `bizomat.ai`, `www.bizomat.ai` and `cados.kevos.com`, in one window, after `migrate/cad` (cados frozen, data
     imported and verified). Certificates first: point `_acme-challenge.bizomat.ai`, `_acme-challenge.www.bizomat.ai`
     and `_acme-challenge.cados.kevos.com` at the targets `fly certs setup` shows for bizomat and wait until all three
     are issued (if `fly certs add` refuses because cados holds a name, remove it there first: `fly certs remove
     <host> -a cados`). Then `bizomat.ai`: A to the shared IPv4 and AAAA to the IPv6 (apex: no CNAME), DNS only (if
     the records were proxied for the Worker, switching them to DNS only takes bizomat.ai off the Worker);
     `www.bizomat.ai`: CNAME `bizomat.fly.dev`, DNS only; `cados.kevos.com`: today a DNS-only CNAME to `cados.fly.dev`,
     change it to `bizomat.fly.dev`. `OPENSKETCH_PUBLIC_URL` is `https://bizomat.ai/cad` already (fly.toml), the same
     address the cados app serves, so connectors and paired computers keep their address.
   - `kevos.com`, `www.kevos.com`: today the Worker `throbbing-block-6c61` on route `kevos.com/*`. Remove the route
     (keep the Worker), then A/AAAA for `kevos.com` and a CNAME for `www.kevos.com` to bizomat, DNS-only. Every page
     then answers 301 to bizomat.ai with the same path (`/cad/`, the old CAD Automation page, to `/cad-automation/`).
     (Alternative without moving kevos.com: Cloudflare redirect rules, `/cad` and `/cad/` to
     `https://bizomat.ai/cad-automation/` first, then `https://bizomat.ai${path}` with the query kept; then the proxy's
     kevos.com rules stay unused.)
   - `cad.bizomat.ai`, `work.bizomat.ai`: no records (no subdomains); the proxy answers them 421.
4. After each host: `node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode live`.
5. When every host is live: set `BIZOMAT_PREVIEW_ROUTING = "0"` in fly.toml and deploy.

## Local stack

```bash
docker compose -f infrastructure/local/compose.yml up --build -d --wait
node infrastructure/smoke/smoke.mjs http://127.0.0.1:8080
bash infrastructure/local/check-isolation.sh
bash infrastructure/fly/test/entrypoint.test.sh bizomat:local
docker run --rm -v "$PWD/infrastructure/migrate/test:/t:ro" bizomat:local bash /t/roundtrip.sh
docker compose -f infrastructure/local/compose.yml down -v
node --test infrastructure/proxy          # the proxy alone, no Docker
```

Until the website's `build:server` and work's `build:node` exist, use the image without them and stand-ins:
`BIZOMAT_BUILD_TARGET=runtime-base docker compose -f infrastructure/local/compose.yml -f infrastructure/local/compose.stubs.yml up --build -d --wait`,
then `smoke.mjs http://127.0.0.1:8080 --stub web,work` and `check-isolation.sh --stub web,work`.

## Cost estimate

Fly prices from its pricing page (Ashburn base, Sydney is 1.269 times that), 30 days of continuous running, USD:

| Item | Size | Per month |
| --- | --- | ---: |
| proxy, 1 Machine | shared-cpu-1x, 256 MB | 2.78 |
| web, 1 Machine | shared-cpu-1x, 512 MB | 4.69 |
| work, 1 Machine | shared-cpu-1x, 512 MB | 4.69 |
| cad, 1 Machine | performance-1x, 2 GB | 41.88 |
| volumes `cad_data`, `work_data` | 2 x 3 GB at 0.15/GB | 0.90 |
| snapshots | first 10 GB free | 0.00 |
| IPv4 (shared), IPv6, 8 certificates (first 10 free) | | 0.00 |
| **Total** | | **about 55** |

Plus outbound data at 0.04 per GB from Sydney. Everything runs all the time: the backends have no service, so Fly
cannot wake them. Today's cados Machine suspends when idle, so cad costs more than now (up to 41.88 against its
running hours). A second proxy Machine for high availability adds 2.78, a second web Machine 4.69.
