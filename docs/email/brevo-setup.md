# Email through Brevo: setup

BIZOMAT Project Management sends transactional email (invitations, task assignments, reminders, access changes,
reports) through Brevo's transactional API. Until the steps below are done, nothing is sent: invitations show their
link to the person who created them, exactly as before, and every other notification stays in the app.

Code: `apps/work/src/worker/services/email/` (provider abstraction, Brevo provider, outbox, templates, console
settings in `settings.ts`), routes in `src/worker/routes/email.ts` and `src/worker/routes/admin-email.ts` (founder
console). Another provider can be added as a second `EmailProvider` in `provider.ts` without
changing anything else.

## What BIZOMAT does

- `POST https://api.brevo.com/v3/smtp/email` with the `api-key` header (server only; never in the browser or logs),
  `sender`, `to`, `replyTo`, `subject`, `htmlContent`, `textContent`, `tags` and the header
  `X-Mailin-custom: outbox_id:<id>` so delivery events find their message. Brevo answers 201 with a `messageId`.
- Every message is first written to an outbox with a unique idempotency key (one event, one email; a retry of the
  same request queues nothing), then sent at once and again by the 15-minute maintenance run.
- Errors: 400-class rejections fail at once (not retried); 401 and 403 (key, sender or authorised IPs) and 5xx and
  network errors are retried with backoff (1 min to 12 h, 8 attempts); 429 waits for `Retry-After`; 402 (credits)
  waits for the next UTC day. A message interrupted mid-send is not resent automatically (it may have gone out); an
  administrator can resend it.
- **Daily limit**: at most `EMAIL_DAILY_LIMIT` (default 250) messages per UTC day, plus `EMAIL_CRITICAL_RESERVE`
  (default 40) for invitations and test messages, so 290 stays under Brevo Free's 300. Over the limit, messages wait
  ("deferred", shown to administrators as delayed) and go out after 00:00 UTC. Nothing is dropped.
- Addresses that hard-bounce, are invalid, blocked, complain or unsubscribe are recorded and not emailed again.
- Invitation emails carry the secret link: their bodies are cleared from the outbox once sent or given up. Other
  bodies are kept 30 days for diagnostics, then cleared; the delivery record stays.
- Notification preferences (Settings > Notifications) decide which types are emailed. On by default: assignments,
  mentions, due soon, overdue, invitations, invitation accepted, project access and permission changes.

## 1. Brevo account and API key

1. Sign in at <https://app.brevo.com/>.
2. Profile menu > **SMTP & API** > **API keys** > **Generate a new API key** (name it "BIZOMAT Project Management").
   Copy it once; Brevo does not show it again.
3. If **Security > Authorised IPs** is on in Brevo, API calls from unknown addresses are refused (BIZOMAT shows "Brevo
   refused the request ... authorised IPs"). Either turn the restriction off for this key or add the outgoing IP
   addresses of the Fly app `bizomat` (`fly ips list -a bizomat` shows inbound addresses; outbound addresses of Fly
   Machines can change, so turning the restriction off for this key is the reliable choice).

## 2. Sender and domain authentication (bizomat.ai)

Brevo will only send as `notifications@bizomat.ai` once the domain is authenticated (or the single sender verified).
Nothing in BIZOMAT assumes it is done.

1. Brevo > **Senders, domains & dedicated IPs** > **Domains** > **Add a domain**: `bizomat.ai`.
2. Add the DNS records Brevo shows, in the DNS of bizomat.ai (Cloudflare):
   - the **Brevo code**: a TXT record at the root (`bizomat.ai` / `@`) proving ownership;
   - **DKIM**: one TXT record at `brevo1._domainkey` or two CNAME records (`brevo1._domainkey`, `brevo2._domainkey`;
     Brevo recommends the CNAMEs where TXT values are limited to 255 characters);
   - **DMARC**: a TXT record at `_dmarc`. If one exists, add Brevo's report address (`rua=mailto:rua@dmarc.brevo.com`)
     to it rather than adding a second record.
   Keep them **DNS only** in Cloudflare (no proxy on these records).
3. Back in Brevo, click **Authenticate this email domain**. DNS changes can take a while to be seen.
4. **Senders** > **Add a sender**: name `BIZOMAT`, email `notifications@bizomat.ai`.
5. Optional: a mailbox for replies, then set `EMAIL_REPLY_TO` (for example a support address once one exists).

## 3. Connect Brevo in the founder console (recommended)

Added on 12 Nov 2026 so the founder can connect email without a deploy or a command line.

1. Sign in as the founder and open <https://bizomat.ai/tasks/admin/email> (**Founder console** > **Email (Brevo)**).
2. Paste the API key from step 1, check the sender name and address (`BIZOMAT`, `notifications@bizomat.ai`), and
   optionally a reply-to address.
3. **Check key**: BIZOMAT reads the Brevo account, its senders and its domains with the key (`GET /v3/account`,
   `/v3/senders`, `/v3/senders/domains`; nothing is sent) and says whether Brevo accepts the key, whether the sender
   is active and whether its domain is authenticated.
4. **Save**. Email is on from that moment, for every organisation; the Status card says "Connected to Brevo".
5. **Send a test email to me** (top of the page): one message to the signed-in founder's own address. The page says
   whether Brevo accepted it; acceptance is not delivery, so check the inbox (and spam folder).

How the key is kept:

- Encrypted with AES-256-GCM before it is stored (`system_kv`, key `email_settings`). The encryption key is the
  file `settings.key` in the data folder (`/data/work/settings.key` on Fly), made once on first start with mode 0600,
  never in the database: a copy or export of the database holds no usable key. `SETTINGS_ENCRYPTION_KEY` (32 bytes,
  base64) in the environment replaces the file.
- Write-only: after saving, the page shows only "Saved key ending abcd". The API never returns it, the audit log says
  only "replaced" or "removed", and it is never logged.
- Only the founder can change the connection; other platform admins can read the status and send themselves a test;
  everyone else gets "not found".
- A database restored on another server cannot decrypt the key: the page says so and asks for it again.
- A value saved in the console wins over the server's environment; **Remove saved key** falls back to it.
- **Send email** off stops all email whatever the key; **Sandbox** makes Brevo accept and drop every message.

## 3b. Or: secrets on the Fly app `bizomat`

Secrets are app-wide on Fly; the entrypoint gives the `work` role only its own `WORK_*` names, under the names the
app reads, so the website process never receives the key.

```bash
fly secrets set WORK_BREVO_API_KEY='<the key from step 1>' -a bizomat --stage
```

```bash
fly secrets set WORK_BREVO_WEBHOOK_TOKEN="$(openssl rand -hex 32)" -a bizomat --stage
```

`--stage` stores them without restarting; the next deploy (or `fly secrets deploy -a bizomat`) applies them.
Optional, not secret (defaults in brackets): `WORK_EMAIL_FROM_ADDRESS` (`notifications@bizomat.ai`),
`WORK_EMAIL_FROM_NAME` (`BIZOMAT`), `WORK_EMAIL_REPLY_TO` (none), `WORK_APP_BASE_URL` (`https://bizomat.ai/tasks`),
`WORK_EMAIL_DAILY_LIMIT` (250), `WORK_EMAIL_CRITICAL_RESERVE` (40), `WORK_EMAIL_SANDBOX` (`1` makes Brevo accept and
drop every message: a safe first test), `WORK_EMAIL_PROVIDER` (`brevo` when a key is set).

Elsewhere (local Node server, Cloudflare): the same settings without the `WORK_` prefix (`BREVO_API_KEY`, ...);
names only in `apps/work/.env.example`.

## 4. Delivery events (webhook, optional)

1. Founder console > Email (Brevo) > **Delivery events** > **Create token**. Copy the token: it is shown once and
   stored encrypted like the API key. (Or use the value of `WORK_BREVO_WEBHOOK_TOKEN` from step 3b; a console token
   wins over it.)
2. Brevo > **Transactional** > **Settings** > **Webhook** (or the API `POST /v3/webhooks` with `type`
   `transactional`): URL `https://bizomat.ai/tasks/api/email-webhooks/brevo` (the console shows it with a Copy
   button), events delivered, hard bounce, soft bounce, blocked, invalid email, error, deferred, spam, unsubscribed.
   Authentication: **token** (bearer) with that value. (Via the API: `"auth": {"type": "bearer", "token": "<value>"}`.)
3. BIZOMAT accepts the call only with `Authorization: Bearer <token>` (or Basic authentication with the token as the
   password), compared in constant time; without a token the endpoint answers 503, with a wrong token 401.

## 5. Test

1. Founder console > **Email (Brevo)**: connection, today's count against the limit, recent emails across every
   organisation (kind and status, never content), suppressed addresses, and **Send delayed emails now**.
2. Settings > **Email** (organisation owners and admins): the same status for their organisation. While email is not
   connected, its test button is off and the page points to the founder console.
3. **Send a test email to me** (either page): queued and handed to Brevo at once; the page reports whether Brevo
   accepted it. Acceptance is not delivery: check the inbox, and Brevo's logs or the delivery events for the result.
4. Invite a test address you control and check the invitation email and link.

## 6. Development

No key is needed. With `ENVIRONMENT=development` (or `EMAIL_PROVIDER=log`) messages are stored in the outbox and
logged as one line each (template and outbox id, never the content), and nothing leaves the machine. Tests replace the
provider (`setEmailProviderForTests`).

## Sources

Brevo developer documentation: [Send a transactional email](https://developers.brevo.com/docs/send-a-transactional-email),
[API reference](https://developers.brevo.com/reference/send-transac-email),
[Transactional webhooks](https://developers.brevo.com/docs/transactional-webhooks),
[Secure webhook calls](https://developers.brevo.com/docs/secured-webhooks),
[Create a webhook](https://developers.brevo.com/reference/create-webhook),
[Sandbox mode](https://developers.brevo.com/docs/using-sandbox-mode); Brevo help:
[Authenticate your domain (Brevo code, DKIM, DMARC)](https://help.brevo.com/hc/en-us/articles/12163873383186). These
were read through search results on 12 Nov 2026 (the session's network did not allow opening Brevo's pages directly);
check the current pages when configuring. The 300 emails per day of the Free plan is as stated by the owner.
