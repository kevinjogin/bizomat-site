# BIZOMAT security

Security review of the integrated platform (5 Nov 2026), the controls in each product, the single-app isolation
design, and the findings that need the owner's action. Product-level detail stays in `apps/work/SECURITY.md` and
`apps/cad/SECURITY.md`, `apps/cad/docs/KEVOS-SECURITY.md`.

## 1. Findings that need action now

| # | Severity | Finding | Action |
| --- | --- | --- | --- |
| F1 | **High** | The repository `jogkev-creator/PMO` is **public**, and two unexpired GitHub Actions artifacts in it, `d1-backup-preview-41797102620` and `d1-backup-preview-41797783441` (created 4 Nov 2026, expiring 4 Dec 2026), contain full SQL exports of the database behind work.kevos.com: names, email addresses, PBKDF2 password hashes, session-token hashes and all workspace content. Artifacts of public repositories can be downloaded by any signed-in GitHub user. The `publish-cloudflare.yml` and `admin-ops.yml` (backup) workflows upload such dumps on every run. | 1. Delete both artifacts now (Actions, the run, Artifacts, delete). 2. Make `jogkev-creator/PMO` private, or stop uploading dumps (the BIZOMAT workflows never upload raw dumps; see `bizomat-migrate-work.yml`). 3. Ask the two account holders to change their Project Management passwords (PBKDF2 at 100,000 iterations can be attacked offline for weak passwords). Session hashes are SHA-256 of random tokens and cannot be reversed; ending all sessions is still prudent. This session could not delete the artifacts (no tool for it) and did not download them. |
| F2 | Medium | No Fly API token is configured anywhere (`FLY_API_TOKEN` is missing in the CADOS repository too), so `fly-status.yml` fails and the current `cados` app cannot be inspected or redeployed from GitHub. | Create an org token for the `bizomat` deploy (`fly tokens create org`) and store it as a repository secret of `jogkev-creator/gocore-website` only. |
| F3 | Medium | On a fresh volume with no `OPENSKETCH_PASSWORD`, CAD Automation starts in "open" mode, in which the first visitor can create the owner account. | The BIZOMAT entrypoint refuses to start the cad role without `OPENSKETCH_PASSWORD` (or existing accounts on the volume) unless explicitly allowed for local testing. Set the secret before the first deploy. |
| F4 | Low | Project Management passwords use PBKDF2-SHA256 with 100,000 iterations (the Workers CPU limit). | Keep 100,000 during the rollback window (the Cloudflare deployment must still verify migrated hashes). Afterwards raise to 600,000 on Node and rehash at sign-in. |
| F5 | Low | Project Management has no self-service password recovery (no email provider) and no account-deletion feature. | **Addressed for recovery:** the founder sets a new password in Admin, People (`POST /api/admin/users/:id/password`: founder only, rate limited, password rules, ends the person's sessions, clears lockout, audited; 3 tests). Self-service recovery waits for an email provider. Account erasure is an operator procedure (`BIZOMAT-OPERATIONS.md`) until a feature exists. |
| F6 | Info | The website's Content-Security-Policy still allows `static.cloudflareinsights.com` (Cloudflare Web Analytics), which BIZOMAT does not use on Fly. | Remove from `scripts/postbuild.mjs` after the Cloudflare deployment is retired. |
| F7 | Low | CAD Automation's HTML pages send no Content-Security-Policy (they use inline styles and two small inline scripts; this predates BIZOMAT). Framing is already refused (`X-Frame-Options: DENY`) and the proxy adds HSTS. | Move the inline styles and scripts into files, then send a strict CSP like the website's. |
| F8 | Info | Inside the Fly organisation, any Machine can reach the web, work and cad processes directly over the private network and send its own client-address headers (the apps trust the proxy's). | Accepted: the private network belongs to the operator. Keep the organisation's members to the people who run BIZOMAT. |

## 2. Controls by area

### Authentication and sessions
- Project Management: PBKDF2-SHA256 via WebCrypto with constant-time comparison and equal work for unknown accounts;
  `__Host-` session cookies (Secure, HttpOnly, SameSite, Path=/); session tokens stored only as SHA-256; CSRF token
  plus Origin check on unsafe methods; sign-in rate limits and lockout; sessions listable and revocable; API tokens
  hashed; Google OIDC with PKCE and state bound to a cookie.
- CAD Automation: scrypt; server-side sessions (90 days) stored as hashes; owner/member roles; invitation tokens
  hashed; OAuth 2.1 for AI apps (dynamic client registration, client metadata documents fetched through an SSRF-safe
  fetcher that allows only public HTTPS and pins the resolved address, PKCE S256 required, refresh-token rotation,
  revocation); pairing for computers with ES256 device proofs (method, path, time, one-time id, body hash).
- Migrated accounts keep their hashes unchanged; nothing is re-hashed or merged during migration.

### Authorisation and data separation
- Project Management: every workspace-owned row carries `workspace_id`; every query filters on it after membership
  is checked (`requireWorkspace`, `requireBoard`, `requireItem`, `requireDocument`); a dedicated isolation test suite
  (`apps/work/test/isolation.test.ts`) and the same suite on the Node runtime verify that one workspace never reads
  another; WebSocket upgrades go through the same checks before a socket is accepted.
- CAD Automation: an AI app's token acts only for its person; commands go only to that person's paired computers;
  commands are signed by the gateway (ES256 JWS), checked by the Companion (signature, device, expiry, replay) and run
  at most once; destructive operations ask for confirmation in SOLIDWORKS by default.
- Website and AI search: public content only. The search index is built from public pages
  (`tests/platform-catalog.test.ts` checks it carries no application data); the AI returns search terms and numbers
  from a shortlist, never content, and replies are validated in the server.

### Input handling
- SQL: parameterised statements everywhere (D1 API, `node:sqlite` adapter); no string-built SQL with user input.
- XSS: React escaping in Project Management; server-rendered CAD pages escape all values; the website renders static
  HTML with a strict CSP (hashed scripts, no inline styles).
- Uploads: Project Management checks size, type and magic bytes for images and PDF, serves files inline only for an
  allowlist, always with `nosniff` and a sandboxing CSP; CAD uploads are one-time links that expire in 30 minutes.
- Body limits on every service (website API 1 MiB; CAD BodyLimit middleware; Project Management upload limit).

### Transport and headers
- TLS terminates at Fly's edge; the proxy adds HSTS on production hosts; every app sets its own security headers
  (CSP, `X-Frame-Options`/`frame-ancestors`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP).
- CORS: Project Management and the website are same-origin only; CAD's MCP endpoints allow any origin because they
  authenticate with Bearer tokens, never cookies.

### Rate limits
Website: per client per minute (AI search and learning 10, forms 5) plus Turnstile on Worker-delivered forms.
Project Management: sign-in, uploads and API windows in the database. CAD: sign-in and pairing limits.
Behind the proxy the client address comes from Fly's `Fly-Client-IP` (or, only when the edge client is inside
Cloudflare's published ranges, `CF-Connecting-IP`). The proxy removes every client-sent address and forwarding header
and sets exactly one value in each of `X-Forwarded-For`, `X-Real-IP`, `CF-Connecting-IP` and `Fly-Client-IP`, plus
`X-Forwarded-Proto` and `X-Forwarded-Host` (`infrastructure/proxy/headers.mjs`, tested). Each app believes them only
in its proxy mode: the website with `WEB_TRUST_PROXY=1`, Project Management with `WORK_TRUST_PROXY=1` (otherwise it
replaces them with the socket address), CAD Automation from `Fly-Client-IP` on Fly or from trusted proxy addresses
(`OPENSKETCH_TRUSTED_PROXIES`, loopback by default; `opensketch/proxy.py`). Run outside the proxy, none of them can be
fooled by these headers. The preview switch (`/__preview/*` on `*.fly.dev`) only exists while
`BIZOMAT_PREVIEW_ROUTING=1`; turn it off after cutover.

### Outbound requests
Project Management sends webhooks and Slack or Teams messages to addresses its users enter. On Cloudflare, Workers
cannot reach private networks; on Node the runtime refuses destinations whose DNS answers are private, loopback,
link-local or otherwise non-public, including Fly's private network (`apps/work/src/node/outbound.ts`, tested). A DNS
answer could change between the check and the connection; HTTPS certificate checks still apply to the connection. CAD Automation
fetches OAuth client metadata only from public HTTPS addresses, pinned after resolution (`safefetch.py`).

### Logging
Request logs record method, host, path without query string, status and time: no IP addresses, cookies, tokens or
bodies. Project Management keeps sanitised error records for 90 days.

## 3. Secrets in one Fly app

Fly secrets are app-wide environment variables on every Machine (verified in Fly's documentation, 4 Nov 2026).

| Secret | Needed by | Where it lives |
| --- | --- | --- |
| `OPENSKETCH_PASSWORD` | cad | Fly secret, passed only to the cad role by the entrypoint allowlist; or the stronger option, `/data/cad/.secrets/OPENSKETCH_PASSWORD` on the CAD volume |
| CAD data keys (`secret.keys`, `bridge-signing-key.pem`, `ai_keys.secret`) | cad | CAD volume only (never Fly secrets) |
| `GOOGLE_CLIENT_ID` / `_SECRET` (each app) | work, cad | Fly secrets, per-role allowlist |
| `CF_ACCOUNT_ID` / `CF_AI_TOKEN` | web | Fly secrets, per-role allowlist; the token needs only Workers AI read/run permission |
| `TURNSTILE_SECRET_KEY` | web | Fly secret, per-role allowlist |

Each role runs as its own unprivileged user with a clean environment, so a compromised web or work process cannot
read the CAD password from its environment or from init's. Residual risk: root on any Machine of the app can read
all Fly secrets. If that is not acceptable, run CAD Automation as a second Fly app (`bizomat-cad`) in the same
organisation: the proxy reaches it over the same private network, and its secrets are then separate. Nothing else
changes.

## 4. Account migration rules

- Existing users keep their ids, hashes and roles; the importer never rewrites a hash or merges accounts.
- Accounts in different products are never merged because their email addresses match; linking requires the person
  to sign in to both.
- Sessions move with the data, but session cookies are per host (`__Host-`), so people sign in again when they first
  use a new host. Their password is unchanged.

## 5. Next: one BIZOMAT ID (single sign-on), designed, not built

1. Project Management becomes the BIZOMAT identity provider: OpenID Connect discovery, authorisation code with PKCE,
   ID tokens signed with a key held on the work volume, consent per application.
2. CAD Automation adds "Sign in with BIZOMAT" using the code path it already has for Google sign-in.
3. Linking: a person signed in to CAD Automation chooses "Link my BIZOMAT account" and signs in there; only then is
   the CAD account linked to the BIZOMAT subject. No automatic linking by email.
4. The website's Sign in menu then offers one button.
