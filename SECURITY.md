# Security

Report vulnerabilities privately to the repository owner. Do not open public issues for security problems.

## Controls

| Threat | Control | Where |
| --- | --- | --- |
| Credential theft | PBKDF2-SHA256 (100k iterations, per-user salt), constant-time compare, password policy, dummy-hash on unknown users (no timing oracle) | `src/worker/auth/password.ts` |
| Brute force | D1-backed fixed-window limits per IP and per email (login), per IP (signup/OAuth/invite lookup), per user (uploads, search, comments, invitations, exports); account lockout after 10 failures for 15 min | `auth/rate-limit.ts`, `routes/auth.ts` |
| Session hijack | 256-bit random tokens, only SHA-256 hash stored, `HttpOnly` + `Secure` + `SameSite=Lax` + `__Host-` prefix in deployed envs, absolute expiry (`SESSION_TTL_HOURS`), revocation, revoke-others on password change, cron purge | `auth/session.ts` |
| CSRF | Per-session synchroniser token in `X-CSRF-Token` for every unsafe cookie-authenticated request **plus** strict `Origin` check; login/signup check `Origin`; OAuth `state` bound to a cookie | `auth/session.ts`, `routes/auth.ts` |
| Auth bypass | All non-auth API routes mounted behind `requireAuth`; SPA navigations redirect to `/login` server-side; WebSocket upgrade authenticated + authorised + Origin-checked before reaching the Durable Object | `app.ts`, `routes/realtime.ts` |
| Tenant isolation / IDOR | Every handler resolves the record, then verifies workspace membership and board/document access via `services/permissions.ts`; foreign-tenant records return **404**; referenced ids (assignees, dependencies, files, groups, integrations, boards) are validated against the same workspace/board | `services/permissions.ts`, `services/item-ops.ts` |
| Privilege escalation | Role hierarchy enforced server-side; only owners grant/remove owner; last-owner protection; viewers cannot edit; private boards require board membership; structural column changes require board admin | `routes/workspaces.ts`, `routes/boards.ts` |
| SQL injection | Parameterised D1 statements only; dynamic SQL fragments are fixed literals or generated `?` lists; LIKE wildcards escaped | all routes |
| XSS | React escaping; no user HTML rendered; documents stored as ProseMirror JSON and **sanitised server-side** (allow-listed nodes/marks, `javascript:` links stripped, images limited to `/api/files/*` or https); strict CSP (`script-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`) | `routes/documents.ts`, `app.ts` |
| Malicious uploads | Extension allow-list, magic-byte checks for images/PDF, 25 MB cap (5 MB for avatars/logos), SVG/HTML not accepted, served with `nosniff`, `Content-Disposition` (inline only for images/PDF/media), sandboxing CSP, auth-checked on every download | `routes/files.ts` |
| SSRF via webhooks | https only, no IP literals, no localhost/internal names, Slack/Teams host allow-lists, manual redirects, 10 s timeout | `services/integrations.ts` |
| Secret leakage | Secrets only as Worker secrets; integration URLs and signing secrets never returned after creation; password/token hashes never serialised; CI secret-scan step; `.gitignore` covers `.env*`/`.dev.vars` | |
| CORS | No CORS headers emitted; preflights refused with 403 | `app.ts` |
| Clickjacking / misc headers | `X-Frame-Options: DENY`, HSTS, `Referrer-Policy`, `Permissions-Policy`, COOP | `app.ts` |
| Automation abuse | Depth limit, loop fingerprinting, per-board limits, references validated to stay inside the board/workspace | `services/automations.ts` |

Cloudflare administrative credentials (`CLOUDFLARE_API_TOKEN`) exist only in GitHub Actions secrets; they are never bundled into the Worker or sent to the browser.

## Audit results (automated, `npm test`)

The `test/security.test.ts`, `test/isolation.test.ts`, `test/auth.test.ts`, `test/files.test.ts` and `test/settings-permissions.test.ts` suites verify: unauthenticated access to every major route is 401; cross-workspace access to boards, items, columns, groups, views, updates, files, documents, dashboards, goals, automations, integrations and notifications is denied; CSRF token and Origin enforcement; CORS preflight refusal; session expiry, logout and revocation; login rate limits and lockout; password policy; API token lifecycle; injection-style input is inert; the document sanitiser strips scripts/unsafe links/images; upload type and content validation; secrets absent from responses; role/permission enforcement for settings.

## Known limitations

- Google OAuth is implemented but cannot be exercised end-to-end until real credentials are configured (callback/state handling is tested).
- Email delivery is not configured: invitation links are shown to the inviter to share manually; email notification preferences are stored but inactive.
- No MFA yet (planned; the identity model supports adding TOTP/WebAuthn).
- Rate limiting is per Worker database; for very high traffic consider the Cloudflare Rate Limiting binding in front.
