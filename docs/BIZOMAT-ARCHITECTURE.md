# BIZOMAT architecture

BIZOMAT is one platform with three products, built from one repository (`jogkev-creator/gocore-website`) and run as
one Fly.io app (`bizomat`, Sydney). Each product keeps its own process, its own data and its own sign-in; they share
the brand, the design system, the domain and the edge.

```
                  visitors            teams                AI assistants (Claude, ChatGPT, MCP clients)
                     |                  |                          |
                     v                  v                          v
            +--------------------------------------------------------------------+
            |  Fly.io edge (TLS, HTTP/2)   bizomat.ai   cados.*  work.*  kevos.com  |
            +--------------------------------------------------------------------+
                                         |
                                 [proxy] process group (public, :8080)
                     routes bizomat.ai by path (/cad, /tasks), others by host
                     +-------------------+--------------------+
                     |                   |                    |
               [web] :8003         [work] :8002          [cad] :8001          (6PN only, not public)
          website + AI search   Project Management    CAD Automation
          dist/ + src/worker.ts  apps/work Worker      apps/cad (FastAPI,
          on Node               code on Node          OpenCascade, MCP)
          no customer data      volume work_data      volume cad_data
                                (SQLite + files)      (accounts, devices,
                                                       OAuth, commands)
                                                              ^
                                                              | outgoing HTTPS long poll (signed commands)
                                                     +-----------------+
                                                     | customer's PC:  |
                                                     | BIZOMAT         |
                                                     | Companion ->    |
                                                     | add-in ->       |
                                                     | SOLIDWORKS      |
                                                     +-----------------+
```

## Repository layout

| Path | What it is | Toolchain |
| --- | --- | --- |
| `/` (root: `src/`, `public/`, `tests/`, `scripts/`) | The BIZOMAT website: home, `/cad/`, `/work/`, `/resources/` (Tools at `/tools/`, Library at `/reados/`, guides at `/library/`), `/engine-room/` (The Engine Room: the founder, principles and proof of work; `/about/` and `/proof-of-work/` redirect to it), legal pages, AI search | Astro 7, Node 22, `npm test`, `npm run build` |
| `src/node/` | The website on Node: the same Worker (`src/worker.ts`) with Node bindings (static assets with Cloudflare `_headers`/`_redirects` semantics, Workers AI over REST, rate limits) | `npm run build:server` |
| `apps/cad/` | CAD Automation (formerly CADOS): Python server `opensketch/`, SOLIDWORKS add-in and Companion `solidworks/` (C#), installer `installer/` (WiX), Windows scripts | Python 3.12, pytest, .NET 8 SDK; AGPL-3.0-only (`apps/cad/LICENSE`) |
| `apps/work/` | Project Management (formerly KEVOS Work / WorkOS): Hono Worker `src/worker/`, React SPA `src/client/`, shared logic `src/shared/`, Node runtime `src/node/`, migrations, migration tooling `scripts/migrate/` | Node 22, Vitest (workerd and Node), Playwright |
| `shared/brand/` | Logo geometry, generated logos and icons, tokens, components, fonts; copied into every product by `build.mjs` | Node |
| `infrastructure/` | Proxy, Dockerfile, entrypoint, local compose stack, smoke tests, CAD volume migration scripts | Docker, Fly |
| `fly.toml` | The `bizomat` Fly app: process groups, volumes, checks | flyctl |
| `docs/BIZOMAT-*.md` | Architecture, migration, deployment, data inventory, security, rollback, operations, status | |

`apps/cad` and `apps/work` were brought in with `git subtree` and keep their full history (225 and 14 commits).
The original repositories (`jogkev-creator/CADOS`, `jogkev-creator/PMO`) are unchanged and remain the source of the
current production deployments until cutover.

## Hosts and routing

| Host | Process | Notes |
| --- | --- | --- |
| `bizomat.ai` | web, cad, work by path | Everything lives under bizomat.ai, no subdomains: the website at the root; CAD Automation at `/cad` (and the OAuth metadata and program paths it keeps at the root, the Worker's `CAD_PATHS`); Project Management at `/tasks`, WebSockets on `/tasks/api/live/boards/:id` included. Paths reach the apps unchanged; each takes its prefix off itself. `www.bizomat.ai` redirects to it. |
| `cados.kevos.com` | cad | CAD Automation's old address, every path: pages answer 301 to `https://bizomat.ai/cad`; MCP (`/mcp`, `/solidworks/mcp`), OAuth, `/v2/device/*` and `/mcp/sw/*` keep working with its own OAuth metadata (`OPENSKETCH_ALIAS_HOSTS`). |
| `work.kevos.com` | work | Project Management's old address, every path at the root, including WebSockets on `/api/live/boards/:id`. |
| `kevos.com`, `www.kevos.com` | proxy redirect | `301` to `https://bizomat.ai` with the same path and query for GET and HEAD; form posts to `/api/*` are passed to web so cached pages keep working. |
| `bizomat.fly.dev` | as bizomat.ai, by path (and a preview switch) | Before DNS: `/cad/` and `/tasks/` work there; `/__preview/cad` or `/__preview/work` sets a preview cookie on this host only that shows one app at the root, as the old addresses serve it. |

Paths on bizomat.ai keep the old kevos.com structure (`/tools/...`, `/reados/...`, `/library/...`), so a kevos.com
link becomes a bizomat.ai link by changing only the host. The 1,600+ redirects for retired URLs in
`public/_redirects` keep working on both hosts.

## Why one app with process groups

The owner's target is one Fly app. Process groups give each product its own Machine (separate memory, CPU, crash
domain and volume) from one image and one deploy. The proxy is the only public service; web, work and cad have no
`[[services]]` section, so they are reachable only over Fly's private network (`<group>.process.bizomat.internal`).
Volumes are per Machine and never shared; each stateful product has exactly one Machine with its own volume.

Fly secrets are app-wide: every Machine receives every secret as an environment variable. To keep, for example, the
CAD server password out of the web and work processes, the entrypoint (`infrastructure/fly/entrypoint.sh`) starts
each role with a clean environment containing only that role's allowlisted variables, as an unprivileged user of its
own, so it cannot read init's environment either. The most sensitive keys never are Fly secrets: CAD's signing and
data keys live on the CAD volume. `docs/BIZOMAT-SECURITY.md` describes the residual risk and the stronger alternative
(a separate Fly app for CAD in the same private network) if it is ever needed.

## Identity: one BIZOMAT login, two account stores

| | Project Management | CAD Automation |
| --- | --- | --- |
| Accounts | `users` in its SQLite database | `users.json` on its volume |
| Passwords | PBKDF2-SHA256 (100,000 iterations, WebCrypto) | scrypt |
| Sessions | `__Host-workos_sid` cookie, CSRF token, Origin check | Server-side sessions, 90 days |
| Other sign-in | Google OIDC when configured; personal API tokens | Google when configured; OAuth 2.1 with PKCE for AI apps; device keys for computers |

Existing accounts move unchanged (same ids, same hashes), so everyone signs in with the password they already use.
The website's **Sign in** menu and `/sign-in/` page are the single entry point; each opens the application's own
secure sign-in. The two stores are not merged by email address: an email match does not prove the same person owns
both accounts. Single sign-on across the two products is designed in `BIZOMAT-SECURITY.md` ("Next: one BIZOMAT ID"):
Project Management becomes the BIZOMAT identity provider (OpenID Connect), CAD Automation signs in with it as it
does with Google today, and accounts are linked only after the person signs in to both.

## AI search

`/api/discover` (Worker code, unchanged contract) asks the AI provider for search terms and, optionally, for picks
from a shortlist of real catalogue entries by number. Ranking happens in the browser over `/discovery-index.json`:
1,055 tools, 218 books, 2,358 chapters and 26 public platform pages (`src/data/platform-catalog.ts`). Every result is
a real page with the reason it matched. The index is built from public content only; no application data can reach
it. Without an AI provider the search works on keywords, synonyms and spelling correction; without JavaScript the box
submits to `/search/` (Pagefind).

## Data at rest

| Product | Store | Backup |
| --- | --- | --- |
| Website | Git | Git history |
| Project Management | `/data/work/db.sqlite` (exact D1 schema), `/data/work/runtime.sqlite` (file index, KV), `/data/work/files/` | Fly volume snapshots (daily, 30 days) and portable copies; see `BIZOMAT-OPERATIONS.md` |
| CAD Automation | `/data/cad/*` (see `BIZOMAT-DATA-INVENTORY.md`) | Fly volume snapshots (daily, 30 days) and portable copies (`infrastructure/migrate/cad/export.sh`) |

## What stays where it is

- SOLIDWORKS work always runs on the customer's computer. The cloud never runs SOLIDWORKS.
- The old deployments (Cloudflare Worker for kevos.com, the `workos-platform-preview` Worker for work.kevos.com and
  the `cados` Fly app) stay untouched until BIZOMAT is verified and the rollback window has passed
  (`BIZOMAT-ROLLBACK.md`).
