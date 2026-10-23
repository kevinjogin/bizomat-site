# KEVOS security implementation report

Branch: `security/hardening` (cut from `main` at `8fa95eb`). Prepared 24 October 2026.

This report covers what was changed in the repository and how each change was checked. It does not claim that any Cloudflare dashboard setting was changed: no Cloudflare account access was available (Wrangler was not signed in), so dashboard items are listed separately in `CLOUDFLARE-SECURITY-CONFIGURATION.md`.

## Architecture found in discovery

- **Site:** Astro 7 static build (1,696 HTML pages), served by a Cloudflare **Worker with static assets** (`wrangler.toml`, Worker `throbbing-block-6c61`, route `kevos.com/*`). Deployed by Cloudflare Workers Builds on push to `main`; feature branches get preview builds.
- **Dynamic code:** `src/worker.ts` handles only non-asset requests: `/api/chat` (Workers AI assistant), `/api/contact` (REACHOS, Cloudflare Email + Turnstile), `/api/assessment` (enquiry intake), `/api/assessment/stripe-webhook` (disabled until a secret is set), and the retired `/insights/` redirects.
- **No accounts, logins, sessions, databases, file uploads or forums** exist on the site. Phase 4 (authentication) is therefore not applicable to the public site; it applies only to the owner's Cloudflare, GitHub, registrar and Proton accounts.
- **Third parties in the browser:** Cloudflare Web Analytics beacon, Cloudflare Turnstile (contact), hCaptcha and Web3Forms (assessment default provider). Fonts are self-hosted.
- **Existing controls that were already good:** hash-based CSP with no `unsafe-inline` or `unsafe-eval` for pages, HSTS, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, nosniff, strict referrer policy, restrictive Permissions-Policy, COOP; contact handler with same-origin check, streamed body cap, field allowlist, server-side Turnstile check of success, action and hostname; signed Stripe webhook verification; preview hostnames sent `X-Robots-Tag: noindex`; post-build check for `.env`, keys and SQL files in the output.

## Changes made

| Area | Change | Files |
|---|---|---|
| API headers | Worker-generated responses get baseline headers (HSTS, nosniff, frame denial, referrer, permissions, COOP). API responses get `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'`, `Cross-Origin-Resource-Policy: same-origin` and `Cache-Control: no-store`. Previously API responses carried none of these, because Wrangler compiles `src/worker.ts` directly and the build-time header injection only reached `dist/_worker.js`. | `src/server/security.ts`, `src/worker.ts` |
| Rate limiting | Workers Rate Limiting bindings: `CHAT_LIMITER` 10 POSTs/min/IP for `/api/chat` (protects the Workers AI allowance), `FORM_LIMITER` 5 POSTs/min/IP for `/api/contact` and `/api/assessment`. Over-limit requests get HTTP 429 with `Retry-After: 60`. A missing or failing limiter allows the request, so the forms cannot be taken down by the limiter itself. Previously no limit was active, because the optional KV limiter's binding is commented out. | `wrangler.toml`, `src/worker.ts`, `src/server/security.ts` |
| Request parsing | `/api/chat` and `/api/assessment` threw an uncaught exception (HTTP 500) on a malformed `Origin` header; both now refuse it with 403. Both now refuse `Sec-Fetch-Site: cross-site`. Both now cap the bytes actually streamed, not only the declared `Content-Length`. Chat rejects `null` and non-object JSON bodies with 400 instead of throwing. | `src/server/chat/handler.ts`, `src/server/assessment/handler.ts` |
| Copy deterrence | One shared script, loaded once by `BaseLayout`, suppresses the right-click menu on article content and imagery, prevents dragging images and figures, and ignores Ctrl/Cmd+S, Ctrl/Cmd+U, F12 and the developer-tools shortcuts. Exempt: links, buttons, inputs, textareas, selects, editable regions, code, forms, dialogs, live results, `[data-allow-copy]` regions, and the whole `/tools/` (WORKOS) area. Selection, copy, paste and printing are never blocked; no alerts, overlays, redirects or debugger tricks. | `src/scripts/content-guard.ts`, `src/layouts/BaseLayout.astro` |
| Disclosure | `/.well-known/security.txt` (RFC 9116), contact via the existing contact page, expiry 1 October 2027. The site deliberately publishes no email address, so none was added. | `public/.well-known/security.txt` |
| CI | Actions pinned to commit SHAs (`actions/checkout` v4.3.1, `actions/setup-node` v4.4.0), `persist-credentials: false`, 30-minute timeout, superseded runs cancelled, read-only token kept, new `audit` job running `npm audit --omit=dev --audit-level=high`. | `.github/workflows/verify.yml` |
| Dependencies | Dependabot weekly checks for npm and GitHub Actions. `npm audit fix` resolved three high-severity build-time advisories (vite 8.3.0–8.3.2 dev-server issues, zod memory exhaustion, http-cache-semantics) within existing ranges: 0 known vulnerabilities after the change. None of these packages runs in the production Worker. | `.github/dependabot.yml`, `package-lock.json` |
| Output scanning | The post-build check now fails if any `.map` source map, or any credential-shaped string (Stripe live/webhook keys, private keys, AWS, GitHub or Slack tokens), appears in `dist/`. | `scripts/postbuild.mjs` |

## Verification evidence

| Check | Result |
|---|---|
| `npm run verify` (astro check, tests, build, post-build) | Passed: 176 of 176 tests, 1,696 pages verified, 0 errors. |
| New tests (`tests/security.test.ts`, 8 tests) | API headers, 429 responses for chat and forms, fail-open limiter, malformed and cross-site origins refused without a 500, oversized and non-object bodies, guard exemptions, security.txt validity, no secrets in `wrangler.toml`. All pass. |
| `wrangler deploy --dry-run` | Bundles; reports `env.CHAT_LIMITER (10 requests/60s)` and `env.FORM_LIMITER (5 requests/60s)`. |
| Browser check (built site, `astro preview`) | On a chapter page: context menu and drag suppressed on paragraphs and figures; not suppressed on the chapter dropdown, links or header navigation; Ctrl+S, Ctrl+U and F12 suppressed; Ctrl+C and Ctrl+P untouched; text remains selectable. On `/tools/?tool=make-buy`: six inputs usable, calculator result rendered, no menu or shortcut suppression, no console errors. |
| `npm audit` | 0 vulnerabilities after the fix. |
| Live response headers (production, before this branch) | Pages and 404 carry the full CSP and headers. `/api/contact` carries none (fixed in this branch, not yet deployed). |

## Not yet verified

- The branch is not merged or deployed. Live checks of the new API headers, the 429 behaviour and `security.txt` must be repeated after merge (see `INCIDENT-RESPONSE-AND-ROLLBACK.md` for the commands).
- The Workers Builds preview of this branch and the GitHub Actions run on the pull request are the first test of the rate-limit bindings in Cloudflare and of the regenerated lockfile on Linux.
- Copy-deterrence behaviour was tested with synthetic events in Chromium. Safari, Firefox and real touch long-press on iOS and Android were not tested.
