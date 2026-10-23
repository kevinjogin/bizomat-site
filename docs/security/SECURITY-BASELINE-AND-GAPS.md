# KEVOS security baseline and open gaps

Observed 24 October 2026 from the repository and from public, non-intrusive requests to kevos.com. No Cloudflare dashboard, GitHub settings or registrar access was available.

## Threat model in brief

| Asset | Main threats (OWASP reference) | Current controls |
|---|---|---|
| Public site and READOS books | Defacement through supply chain (A06, A08), content scraping | Static build, CSP with hashes, pinned CI, Dependabot, copy deterrence (courtesy only) |
| Contact and assessment forms | Spam, abuse, injection into email (A03), resource exhaustion | Same-origin check, field allowlist, size caps, honeypot, Turnstile/hCaptcha, edge rate limit, plain-text email composition |
| KEVOS Assistant (`/api/chat`) | Cost exhaustion of Workers AI, prompt injection, data leakage | Edge rate limit, 600-character messages, 8 turns, answers grounded only in published content, no personal data stored |
| Stripe webhook | Forged payment events (A08) | Disabled until secret set; HMAC signature and timestamp verified |
| Deployment pipeline | Credential theft, malicious dependency (A08) | Read-only CI token, pinned actions, no secrets in repo, lockfile installs |
| Owner accounts (Cloudflare, GitHub, registrar, Proton) | Account takeover (A07) | Not observable from here; see owner actions |

## Gaps found and their status

| # | Gap | Severity | Status |
|---|---|---|---|
| 1 | Plain HTTP requests for pages are served over HTTP (`http://kevos.com/about/` returns 200, not a redirect). The Worker's upgrade code never runs for static assets. HSTS protects returning visitors only. | High | **Requires owner action:** enable *Always Use HTTPS* (SSL/TLS → Edge Certificates). Free. |
| 2 | TLS 1.0 and 1.1 are accepted. | Medium | **Requires owner action:** set *Minimum TLS Version* to 1.2. Free. |
| 3 | API responses carried no security headers. | Medium | Implemented on branch; verify after deploy. |
| 4 | No active rate limiting on chat, contact or assessment. | Medium | Implemented on branch (Workers Rate Limiting). Verify after deploy. |
| 5 | Malformed `Origin` header caused HTTP 500 on chat and assessment. | Low | Implemented on branch. |
| 6 | Build-time dependency advisories (vite, zod, http-cache-semantics). | Low (build only) | Implemented on branch; 0 known vulnerabilities. |
| 7 | No `security.txt`. | Low | Implemented on branch. |
| 8 | DNSSEC not enabled (no DS record for kevos.com). | Medium | **Requires owner action:** enable DNSSEC in Cloudflare DNS, then add the DS record at the registrar. |
| 9 | No CAA record restricting which authorities may issue certificates. | Low | **Requires owner action:** add CAA records for the authorities Cloudflare uses (check Cloudflare's current list before adding, or certificate renewal can fail). |
| 10 | DMARC is `p=quarantine` with no reporting address. SPF ends `~all`. | Low | **Requires owner action:** add `rua=` reporting (Proton or a DMARC report service) and, after reviewing reports, consider `p=reject` and `-all`. DKIM is published for three Proton selectors. |
| 11 | GitHub secret scanning, push protection, branch protection and required status checks could not be confirmed. | Medium | **Requires owner action** (GitHub → Settings → Code security, and Branches). |
| 12 | Cloudflare WAF managed rules, Bot Fight Mode, security level and AI crawler settings could not be confirmed. | Medium | **Requires owner action;** see `CLOUDFLARE-SECURITY-CONFIGURATION.md`. |
| 13 | The `/api/assessment` Worker path has no captcha of its own; it relies on the default Web3Forms + hCaptcha path being used. If `PUBLIC_CONTACT_PROVIDER=worker` is ever set, add a server-side Turnstile check to the assessment handler first, as the contact handler does. | Low today | Documented; no change. |
| 14 | `wrangler.toml` names the contact destination address. It is a routing address already used by the contact handler's error messages, not a credential, but it identifies a person. | Info | Documented; owner to decide whether to switch to a role address. |
| 15 | Long-window per-IP limits (per hour) still depend on the optional KV binding, which is not configured. | Low | Optional: create the KV namespace and uncomment `CONTACT_RATE_LIMIT` in `wrangler.toml`. |
| 16 | `X-Frame-Options` and `frame-ancestors` both deny framing, so the site cannot be embedded anywhere, including by KEVOS. | Info | Intended. Revisit only if an embed is ever needed. |

## Risks not tested

- No authenticated or destructive testing was performed, and none was needed: there are no accounts or stored records.
- Prompt-injection resistance of the assistant was reviewed by reading its rules, not by adversarial testing.
- Email header injection was reviewed by reading `composeContactEmail` and the control-character checks; it was not fuzzed.
- Performance and Core Web Vitals were not re-measured. The added script is about 1.5 kB and runs only on user events; no layout or render path changed.
