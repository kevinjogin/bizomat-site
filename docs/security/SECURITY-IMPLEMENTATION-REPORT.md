# KEVOS security implementation report

Branch: `security/hardening` (cut from `main` at `8fa95eb`). Prepared 24 October 2026. Merged into `main` as `e15755f` (fast-forward) and deployed to kevos.com by Cloudflare Workers Builds the same day; live results are recorded under *Live verification after deployment*.

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
| Rate limiting | Workers Rate Limiting bindings: `CHAT_LIMITER` 10 POSTs/min/IP for `/api/chat` (protects the Workers AI allowance), `FORM_LIMITER` 5 POSTs/min/IP for `/api/contact` and `/api/assessment`. Over-limit requests get HTTP 429 with `Retry-After: 60`. A missing or failing limiter allows the request, so the forms cannot be taken down by the limiter itself. Previously no limit was active, because the optional KV limiter's binding is commented out. The limits are approximate: Cloudflare counts asynchronously per location, so they throttle sustained abuse rather than enforcing an exact count, and a short fast burst can pass before the counter catches up. | `wrangler.toml`, `src/worker.ts`, `src/server/security.ts` |
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
| Live response headers (production, before this branch) | Pages and 404 carry the full CSP and headers. `/api/contact` carried none. |
| Pull request checks | Reported passed by the owner before merge. |

## Live verification after deployment

Checked against https://kevos.com on 24 October 2026, after `e15755f` was deployed (about two minutes after the push to `main`). Test requests were deliberately incomplete, so the handlers rejected them before any email was sent or any Workers AI call was made.

| Check | Result |
|---|---|
| `/.well-known/security.txt` | 200, `text/plain`, contents as committed (contact page, expiry 1 October 2027). |
| API headers on `/api/contact`, `/api/chat`, `/api/assessment` and an unknown `/api/*` path | All present: `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Cross-Origin-Resource-Policy: same-origin`, `Strict-Transport-Security`, `Referrer-Policy`, `Cache-Control: no-store`. |
| Malformed `Origin` on `/api/chat` | 403 (previously a 500). A `Sec-Fetch-Site: cross-site` request also gets 403. |
| Contact and assessment limit (5 per minute) | Active. With requests about half a second apart, the 429 responses began at roughly the 9th request; with requests one second apart, at the 6th. Some later requests still passed between 429s. |
| Chat limit (10 per minute) | Active. With requests about half a second apart, the 429 responses began at roughly the 20th request. |
| 429 response | `HTTP 429`, `Retry-After: 60`, the API CSP and nosniff, JSON body "Too many requests. Please wait a minute and try again." It comes from the Worker's new code, not the older KV limiter. |
| Fast burst (8 contact and 13 chat requests back to back) | No 429: every request passed before the asynchronous counter caught up. This is expected behaviour of the Cloudflare Rate Limiting API. |
| Key pages: `/`, `/reados/`, a READOS chapter, `/tools/`, `/contact/`, `/about/`, `/services/` | All 200, KEVOS wordmark present, copy guard included; the page CSP now lists 13 script hashes, the guard's included. |
| Copy guard on a live chapter (Chromium) | Menu blocked on paragraphs and figures; not blocked on the chapter dropdown or links; Ctrl+S blocked; Ctrl+C and Ctrl+P not blocked; chapter dropdown lists all 10 chapters; no console errors. |

### What the rate-limit results mean

The Workers limits are approximate. Cloudflare counts asynchronously and per location, so a burst can complete before the counter catches up, and a few requests can still pass after the limit is reached. They reliably slow sustained automated use of the forms and the assistant, which is their purpose, but they are not an exact cap. If an exact or stricter limit is ever needed, add a Cloudflare WAF rate-limiting rule for `/api/*` (one rule is included on the Free plan), as listed in `CLOUDFLARE-SECURITY-CONFIGURATION.md`.

## Not yet verified

- The GitHub Actions run and the Workers Builds result were not read directly, because the repository is private and neither `gh` nor Wrangler was signed in. The owner reported the pull request checks as passed, and the deployment is evidenced by the live behaviour above.
- Copy-deterrence behaviour was tested with synthetic events in Chromium. Safari, Firefox and real touch long-press on iOS and Android were not tested.
- The two dashboard gaps remain open until the owner changes them: plain HTTP page requests are not redirected (*Always Use HTTPS*), and TLS 1.0/1.1 are still accepted (*Minimum TLS Version 1.2*).
