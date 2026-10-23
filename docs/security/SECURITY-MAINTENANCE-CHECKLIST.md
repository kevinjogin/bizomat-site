# Security maintenance checklist

## Weekly

- [ ] Review and merge Dependabot pull requests after their Verify run passes. Never merge a red run.
- [ ] Check the latest GitHub Actions runs on `main`, including the `audit` job.
- [ ] Glance at Cloudflare Security → Events and Workers logs for spikes on `/api/*` or many 429 responses.
- [ ] Confirm the contact form still delivers (send a test enquiry if none arrived that week).

## Monthly

- [ ] Run the post-deploy header checks in `INCIDENT-RESPONSE-AND-ROLLBACK.md` against the live site.
- [ ] `npm audit` on a fresh clone; fix anything high or critical.
- [ ] Review Cloudflare notifications and any firewall rule false positives.
- [ ] Check that no new third-party script, font or embed was added without updating the CSP deliberately.
- [ ] Confirm `public/` and `dist/` contain nothing internal (`docs/`, brand sources, drafts).

## Quarterly

- [ ] Review who has access to Cloudflare, GitHub, the registrar and the mailbox; remove anyone who no longer needs it.
- [ ] Confirm security keys or passkeys are enrolled on each of those accounts and recovery codes are stored offline.
- [ ] Review Cloudflare API tokens and Worker secrets; delete unused ones; rotate any older than a year.
- [ ] Run the restore test: fresh clone, `npm ci`, `npm run verify`, `npx wrangler deploy --dry-run`.
- [ ] Review DMARC reports (once a reporting address is configured) and the SPF, DKIM and DMARC policy.
- [ ] Review the rate limits against real traffic and adjust if legitimate users are reaching them.
- [ ] Walk through one incident playbook as a short tabletop exercise.

## Each year

- [ ] Update `Expires` in `public/.well-known/security.txt` before 1 October (the test fails once it is in the past).
- [ ] Review the privacy policy and terms against what the site actually collects and does.
- [ ] Reconsider the open items in `SECURITY-BASELINE-AND-GAPS.md`, including HSTS preload and the AI crawler decision.
