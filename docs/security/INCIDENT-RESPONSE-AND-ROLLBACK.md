# Incident response and rollback

## Contacts

- **Owner and decision-maker:** the KEVOS account owner (Cloudflare, GitHub, registrar and Proton accounts). Keep a current phone number and a backup contact in a password manager, not in this repository.
- **Cloudflare support:** through the dashboard (support availability depends on plan).
- **Reporters:** `https://kevos.com/.well-known/security.txt` directs them to the contact page.

## Roll back a bad release

The site deploys from `main` through Cloudflare Workers Builds.

1. **Fastest:** in the Cloudflare dashboard, open Workers & Pages → `throbbing-block-6c61` → Deployments, and roll back to the previous version. This restores both the Worker code and the static assets of that version.
2. **Then fix the source:** on a clean checkout, `git revert <bad commit>`, run `npm run verify`, restore the build side-effect icons (`git restore public/brand/kevos-favicon-k-orange.svg public/brand/kevos-icon.svg public/favicon.svg public/favicon.ico`), and push to `main`. Never force-push `main`.
3. **Check live:** the home page, `/reados/`, one READOS chapter, `/tools/`, `/contact/` and the response headers (below).

To back out only the rate limits without a code change, remove the two `[[ratelimits]]` blocks from `wrangler.toml` and push: the Worker treats missing limiters as "allow".

To switch the copy deterrent off quickly, remove the `<script>` that imports `content-guard.ts` from `src/layouts/BaseLayout.astro`, or add `data-content-guard="off"` to the `<html>` element.

## Post-deploy checks

```bash
curl -sI https://kevos.com/ | grep -iE "content-security|strict-transport|x-frame"
curl -sI https://kevos.com/api/contact | grep -iE "^HTTP|content-security|nosniff|cross-origin-resource"
curl -s https://kevos.com/.well-known/security.txt
```

Expected: the page CSP on `/`; `405`, the `default-src 'none'` CSP, nosniff and CORP on `/api/contact`; the security.txt text.

## Incident playbooks

| Situation | First actions |
|---|---|
| Site defaced or wrong content live | Roll back the deployment (above). Check recent commits and GitHub audit log for unexpected pushes. Rotate GitHub credentials if a push was not yours. |
| Contact form or assistant flooded | Confirm with Workers logs (Observability is enabled). Tighten `FORM_LIMITER` or `CHAT_LIMITER`, add a Cloudflare rate-limiting rule for `/api/*`, or temporarily raise the security level. Turnstile secret stays unchanged unless leaked. |
| Workers AI allowance exhausted | The assistant returns a friendly "unavailable" message; no action is required beyond reducing `CHAT_LIMITER` if abuse is the cause. |
| Secret leaked (Turnstile, Stripe, API token) | Rotate it at the provider, update the Worker secret (`wrangler secret put NAME`), redeploy, then remove the leak from wherever it appeared. Do not paste secrets into issues or chat. |
| Suspected account takeover | Change the password, revoke sessions and tokens, re-enrol security keys, review DNS records, Worker routes and email forwarding rules, then review the audit logs. |
| DDoS | Cloudflare mitigates automatically. Use *I'm Under Attack* mode only briefly; it challenges every visitor. |
| Vulnerability report received | Acknowledge within a few working days, reproduce safely on a preview, fix on a branch, deploy, and thank the reporter. Keep the report private until fixed. |

## Recovery assets

- **Code:** GitHub repository (history), plus the local backup copy described in the project notes.
- **Configuration:** `wrangler.toml` and this folder. Dashboard-only settings must be recorded in `CLOUDFLARE-SECURITY-CONFIGURATION.md` when changed, so they can be rebuilt.
- **Data:** the site stores no enquiries or user data; contact submissions exist only in the receiving mailbox.
- **Restore test:** a fresh clone, `npm ci`, `npm run verify`, `npx wrangler deploy --dry-run` should succeed without any secret. Run it each quarter.
