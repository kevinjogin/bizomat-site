# KEVOS contact email integration

Prepared 21 October 2026 against verified production main `f2103857ac8c3eb2bce760e5a848707fa40832ad`.

## Architecture and scope

The site is Astro static output served by the existing Cloudflare Worker `throbbing-block-6c61`, configured in `wrangler.toml`. `src/worker.ts` already routes `/api/contact` to `src/server/contact/handler.ts`; no Pages Function, second Worker, framework or dependency is added.

The contact form uses `/api/contact` and the existing widget `0x4AAAAAAFfDUjBHF2Y7_omi`, rendered in its existing CAPTCHA container with action `contact`. The form's visible markup, labels, button, CSS and status styling are unchanged. Only provider-specific hidden fields, delivery logic and CAPTCHA loading change. The separate assessment and assistant forms retain their existing Web3Forms/hCaptcha paths. Do not switch `PUBLIC_CONTACT_PROVIDER` as part of this release.

The endpoint accepts JSON, URL-encoded or multipart text fields, rejects files and duplicate form fields, bounds the actual streamed request to 32,000 bytes, validates lengths and email, and rejects foreign origins. Turnstile must return boolean `success: true`, action `contact` and hostname `kevos.com` or `www.kevos.com` before the EMAIL binding is called. The production allowlist deliberately excludes localhost and preview domains. Existing optional KV rate limiting remains; no D1 or enquiry persistence is added.

Email uses fixed recipient `kevin@kevos.com` and fixed sender `contact-form@kevos.com`. Reply-To is the validated visitor email. The supplied subject becomes `New KEVOS enquiry: …`; without one, the subject is `New KEVOS website enquiry`. The current visible form has a service selector rather than a subject field, so its normal submissions use that fallback and include the service in the body. Plain-text and escaped HTML include the existing fields, UTC submission time and trusted Cloudflare country metadata when available. No message, token, provider error or secret is logged by this path. A resolved Email Service result with a message ID is required before a success response.

## Cloudflare dashboard settings required before production activation

Account: `21a5414f507ae268302531c39e888f95`.

1. **Turnstile → existing widget:** use the supplied site key; confirm hostname coverage for `kevos.com` and `www.kevos.com`. Preserve the widget's existing mode and clearance setting. Do not create a replacement widget. The backend checks action `contact` set by this form; this action is not a separate dashboard secret.
2. **Workers & Pages → throbbing-block-6c61 → Settings → Variables and Secrets:** add an **encrypted secret** named `TURNSTILE_SECRET_KEY`, using the secret belonging to that existing widget. Do not put it in a build variable, source file, plaintext Wrangler variable or any `PUBLIC_` setting.
3. **Worker → Settings → Build → build variables:** set `PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFfDUjBHF2Y7_omi`. Astro reads it at build time. The supplied public key is also the source fallback, so an absent build setting does not substitute a new widget.
4. **Compute → Email Service → Email Sending:** onboard `kevos.com` as the sending domain and complete Cloudflare's sender-domain DNS verification. Review existing mail DNS before accepting changes. Do not replace the domain's existing inbox MX records as a shortcut; sending-domain onboarding and inbox delivery are distinct.
5. **Email Service destination addresses:** ensure `kevin@kevos.com` is a verified permitted destination. The committed `[[send_email]]` binding named `EMAIL` restricts delivery to this address. Confirm it appears on the existing Worker after release. The sender `contact-form@kevos.com` must be permitted by the onboarded KEVOS domain.

These dashboard states have **not** been verified in this session. No authenticated Cloudflare connector or approved external Wrangler executable was available. There is no claim that email has reached the inbox.

## Secret command and existing-widget flow

The user requested Cloudflare's existing-widget Spin flow:
https://developers.cloudflare.com/turnstile/spin/prompt.md

The prompt was retrieved from Cloudflare's published source at `cloudflare/cloudflare-docs/public/turnstile/spin/prompt.md` after the web reader rejected its Markdown content type; a direct retrieval also succeeded. The widget is reused. No secret was retrieved, written, printed or committed.

For an agent-assisted secret write, Spin requires an explicitly approved canonical absolute Wrangler executable **outside the project**, exact version **4.109 or later**, a confirmed existing Worker destination and an approved write manifest. The manifest must name this account, site key, production hostnames, repository root, canonical configuration path, production/default environment, Worker and binding `TURNSTILE_SECRET_KEY`. It requires confirmation immediately before the secret-bearing retrieval/write. Do not use `npx`, package scripts or the project's Wrangler binary for that operation. Do not install another Wrangler automatically.

After the executable and destination are approved, run from the checkout, using the approved executable path in `WRANGLER_BIN`:

```bash
CLOUDFLARE_ACCOUNT_ID=21a5414f507ae268302531c39e888f95 \
WRANGLER_WRITE_LOGS=false WRANGLER_LOG=log WRANGLER_LOG_SANITIZE=true \
"$WRANGLER_BIN" secret list --name throbbing-block-6c61 --config wrangler.toml

CLOUDFLARE_ACCOUNT_ID=21a5414f507ae268302531c39e888f95 \
WRANGLER_WRITE_LOGS=false WRANGLER_LOG=log WRANGLER_LOG_SANITIZE=true \
"$WRANGLER_BIN" secret put TURNSTILE_SECRET_KEY --name throbbing-block-6c61 --config wrangler.toml
```

Use the secure prompt/standard input, never an inline secret argument. If no approved executable is available, use the existing Worker's dashboard secret manager. Agent recovery of the widget secret must follow Spin's full metadata validation, dummy-token validation and stdin-only write flow; the commands above are the direct secret-store operations, not a substitute for its guarded recovery flow.

## Deployment

Preferred repository procedure: verify the latest `main`, merge the reviewed PR, and push through GitHub. Cloudflare's existing GitHub integration builds and deploys the same Worker. Keep this PR unmerged until the required secret and Email Service configuration are confirmed, because switching the live form first would intentionally fail closed.

The repository's exact manual deployment command is:

```bash
npm run deploy
```

It runs verification and then `wrangler deploy`. Per `CLAUDE.md`, use it only from a clean checkout equal to freshly verified `origin/main`. Never upload an old `dist` or deploy this feature branch manually. Restore generated icon changes after a build and stage files explicitly.

## Verification and manual acceptance

Local validation completed:

- `npm run verify`: 164 tests passed, zero type-check errors, six pre-existing hints; Astro build, Pagefind and postbuild succeeded. No lint script is defined in `package.json`.
- All 1,651 generated pages passed metadata, H1, links, images and JSON-LD checks.
- 26 contact tests cover HTTP methods, validation, body limits, missing/invalid/replayed tokens, action and hostname, email success/failure, fixed addresses, escaping, origin rules, optional rate limiting, no sensitive logs, same-origin client submission, duplicate-submit locking, failure retention and the widget lifecycle.
- The contact component's visible markup and complete style block were compared against main and are byte-identical. No stylesheets, page layouts, labels or global navigation were edited.
- The browser service timed out; interactive visual checks and an actual widget challenge are not claimed. No real test email has been sent or received.

After the settings and release are complete:

1. Open `https://kevos.com/contact/` in a new session. Check the existing desktop/mobile layout and dark/light styling. Confirm the existing widget appears in the CAPTCHA slot.
2. Submit a clearly labelled test enquiry using an email you control. Verify the button cannot submit twice, remains the same size and returns to normal after completion.
3. Confirm `/api/contact` returns 200 with `{ "success": true, "message": "Thank you. Your message has been sent." }` and only then resets the form/widget.
4. Confirm receipt in `kevin@kevos.com` (also check junk). Inspect From, Reply-To, subject, text/HTML, UTC time and country if present. Reply-To must be the visitor, never From.
5. Repeat the original token against the endpoint: it must be rejected and no second email sent. Test missing token, malformed email and missing required fields; all must fail safely.
6. Simulate a delivery error in a controlled test environment: the form must keep all entered values and display the fallback email message. Restore the test configuration afterwards.
7. Check `/`, `/services/`, `/reados/`, `/about/`, the orange K favicon and existing navigation after production release.

Token lifecycle follows the user's explicit requirement to reset the form and widget only after success. On a failed attempted send, the client discards its cached single-use token but preserves the fields and widget. Turnstile's automatic expiration refresh supplies a new token (tokens normally expire after five minutes); immediate retry can therefore require waiting for that refresh. This differs from Spin's generic suggestion to reset the widget after every attempt. The user's direct reset requirement takes precedence. A future immediate-retry change would reset only the widget, never the entered enquiry.

## References

- Cloudflare Email Service Workers API (structured `EMAIL.send` and message ID): https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
- Restricted send bindings: https://developers.cloudflare.com/email-service/configuration/send-bindings/
- Email Sending domain onboarding: https://developers.cloudflare.com/email-service/get-started/send-emails/
- Turnstile server verification and single-use tokens: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
