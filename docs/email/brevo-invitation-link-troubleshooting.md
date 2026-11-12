# Invitation links in emails: troubleshooting (Brevo)

Report of 12 Nov 2026: an invitation email showed a link like `https://r.www.bizomat.ai/tr/cl/...` instead of the
invitation page `https://bizomat.ai/tasks/invite/<token>`.

## What a link goes through

1. **BIZOMAT writes the original address** into the email: `https://bizomat.ai/tasks/invite/<token>` (the app is
   mounted at `/tasks`), in the HTML button, in the "copy this address" line under it and in the plain-text part.
2. **Brevo rewrites every link** for click tracking before delivery: the received email links to
   `https://r.<tracking domain>/tr/cl/<data>`. With Brevo's own tracking domain that is `r.brevolinks.com`; with a
   *branded* tracking subdomain set up in Brevo it is `r.<branded subdomain>`. `r.www.bizomat.ai` therefore means the
   branded subdomain entered in Brevo is `www.bizomat.ai`. The `/tr/cl/` path is Brevo's; BIZOMAT never writes it.
3. **The click goes to Brevo's tracking server**, which records it and redirects the browser to the original address.

A link works only if all three hold: the original address is right, the tracking host exists in DNS and has a valid
certificate, and its redirect goes to the original address.

## Root cause found

| Question | Finding |
| --- | --- |
| A. Does BIZOMAT generate the wrong original address? | **Yes, in some cases, now fixed.** Invitation links were built from the address of the request that created the invitation (its Host or X-Forwarded-Host header): `new URL(c.req.url).origin + BASE_PATH`. Created through `bizomat.ai/tasks` they were right; created through another host (the old `work.kevos.com` address, which the router still serves, a preview, or a forged Host header) they carried that host, and on `work.kevos.com` without `/tasks`. Every other email already used the configured address. |
| B. Does Brevo rewrite a correct address? | **Yes, by design.** The `r.…/tr/cl/…` link is Brevo's click tracking, not an address BIZOMAT generated. The transactional API has no per-email switch for click tracking. |
| C. Is the tracking domain misconfigured? | **Likely: confirm in DNS and Brevo.** The tracking host is `r.www.bizomat.ai`. From the investigation session neither `www.bizomat.ai` nor `r.www.bizomat.ai` could be resolved by two different resolvers, while `bizomat.ai` resolved; those resolvers may be restricted, so this is not proof. Using `www` as Brevo's branded subdomain also collides with the website's own `www` name. If `r.www.bizomat.ai` has no DNS record (or the record is proxied, or has no valid certificate), every tracked link fails, whatever BIZOMAT writes. The founder console now checks this from the server (below). |
| D. Is APP_BASE_URL wrong? | **No.** Production sets `APP_URL = https://bizomat.ai/tasks` and `CANONICAL_URL = https://bizomat.ai/tasks` (`fly.website.toml`, work role); `APP_BASE_URL` is not needed. The app now refuses to build links from a wrong setting. |

## The fix in BIZOMAT

- `apps/work/src/worker/services/app-url.ts` is the one place that builds addresses of the app for emails:
  `inviteUrl(env, token)` gives `https://bizomat.ai/tasks/invite/<token>` (the token encoded once, as one path
  segment), `verifyEmailUrl`, `appLink` for notification links. It reads `APP_BASE_URL`, else `APP_URL`, never the
  request.
- In production the address must be `https`, a public host (not localhost, an IP address or an internal name),
  without user name, password, query or fragment, and equal to `CANONICAL_URL` when that is set (so
  `https://www.bizomat.ai/tasks` or a tracking host is refused). A wrong setting stops invitations with a clear error
  and no email with links is sent, instead of wrong links.
- Invitations (create and resend), task and project notifications, email confirmation links, the Brevo webhook address
  shown in the console, and the test emails all use it.
- Tests: `apps/work/test/email-links.test.ts` (configuration rules, token encoding, an invitation created on another
  host, the exact HTML `href` and plain-text address, the request body sent to Brevo, other email links, the
  invitation page being public without being accepted by opening it, and the link checker).

## Correct configuration

| Setting | Value | Where |
| --- | --- | --- |
| `APP_URL` (work role) | `https://bizomat.ai/tasks` | `fly.website.toml`: `WORK_APP_URL` |
| `CANONICAL_URL` (work role) | `https://bizomat.ai/tasks` | `fly.website.toml`: `WORK_CANONICAL_URL` |
| `APP_BASE_URL` | not set (or exactly `https://bizomat.ai/tasks`) | Fly secret `WORK_APP_BASE_URL` |

Founder console > Email shows "Links in emails: https://bizomat.ai/tasks/invite/<token>", or the problem.

## What to check and change in Brevo and DNS (by hand)

Nothing here is changed automatically, and no existing Brevo record should be deleted.

1. Brevo > **Senders, domains & dedicated IPs** > **Domains**: look at the branded subdomain. If it is `www.bizomat.ai`,
   either add the DNS records Brevo lists for it (including the **redirection** record that makes `r.www.bizomat.ai`
   work), or, better, set the branded subdomain to a dedicated name such as `mail.bizomat.ai` (tracking links then use
   `r.mail.bizomat.ai`) and add its records. Brevo's help on branded subdomains says that for shared-IP accounts the
   branded subdomain can be skipped; then links use Brevo's own `r.brevolinks.com`, which always works.
2. In Cloudflare DNS for bizomat.ai, every Brevo record must be **DNS only** (grey cloud). A proxied tracking record
   breaks the redirect.
3. Brevo cannot switch click tracking off per email; turning it off for transactional emails is available on request
   or on Enterprise plans. "Anonymous tracking" (Settings > Transactional emails > Tracking) anonymises the click
   records but still rewrites links, so it does not fix a broken tracking domain.

## How to test (after any change)

1. Founder console > **Email** > **Send a test email to me**.
2. In the email, click **Check an email link**. It must open the page "Email links work", which shows the address
   reached: `https://bizomat.ai/tasks/invite/link-check`. This tests the whole chain (Brevo's rewrite, its tracking
   host, its redirect) without a real invitation.
3. Or copy that link (right-click, copy link address) into founder console > Email > **Check an email link**: the
   server shows whether the tracking host exists in DNS, the HTTPS result and each redirect, with tokens masked.
4. To test a real invitation, invite an address you own, open the email and click **Accept invitation**: it must end
   on `https://bizomat.ai/tasks/invite/…` with the invitation's organisation. Check the plain-text version too.
5. Never paste a real person's invitation link into tickets, logs or screenshots: the token in it lets its holder
   join the organisation.

Sources: Brevo help, [Set up your domain in Brevo](https://help.brevo.com/hc/en-us/articles/35337929909778) and
[FAQs: about branded subdomains](https://help.brevo.com/hc/en-us/articles/35946791638802-FAQs-About-branded-subdomains);
Brevo community, [No way to disable tracking in transactional email](https://community.brevo.com/t/no-way-to-disable-by-option-tracking-in-transactional-e-mail/201);
[Anymail's Brevo notes](https://anymail.readthedocs.io/esps/brevo/) (no per-message click tracking control).
