# Sign-up protection

Owner's request (12 Nov 2026): only legitimate email addresses can create an account in BIZOMAT Project Management
and sign in. Code: `apps/work/src/worker/services/signup-guard.ts` (the rules), `services/email-verification.ts`
(confirmation links), `routes/auth.ts` (sign-up, sign-in, Google sign-in, confirm, resend), `routes/admin-signup.ts`
and `src/client/admin/pages/SignupProtection.tsx` (founder console), migration `0007_signup_protection.sql`.

## The rules

Set in **Founder console > Sign-up Protection** (`https://bizomat.ai/tasks/admin/signup`). Only the founder changes
them; other platform admins can read them and test addresses.

| Rule | Default | What it does |
| --- | --- | --- |
| Block disposable addresses | on | Refuses well-known temporary-mail services (`DISPOSABLE_DOMAINS`, 137 domains) and their subdomains. Privacy forwarding services (SimpleLogin, addy.io, Apple Hide My Email, Firefox Relay, DuckDuckGo) are not on the list: they reach a real person. |
| Require a domain that receives email | on | The domain must publish MX records, and not a "null MX" (RFC 7505). Catches made-up domains and typos such as `gmial.com`. Asked through DNS over HTTPS (`cloudflare-dns.com`), cached a day for working domains and an hour for refused ones. If DNS does not answer, the address is let through: a DNS outage must not stop real people. |
| Require email confirmation | on | A new account signs in only after opening the link sent to its address. Only while email is connected (Founder console > Email): without email nobody could confirm, so nobody is asked. |
| Blocked domains | none | The founder's own list; subdomains included. Applies to sign-up, invitations and sign-in. |
| Always allowed domains | none | Skips every check (your own company's domain, or a domain refused by mistake). |

Always on: a hidden field on the sign-up form that people never see (and screen readers skip) and only form-filling
robots fill; the existing limits of 10 sign-ups an hour per network address and of sign-in attempts per address and
network.

## Where the rules apply

- **Sign-up** (email and password): every rule. A refused address gets a plain answer (for example "Temporary or
  disposable email addresses cannot be used. Use your work or personal email address.").
- **Invitations**: when an administrator invites an address that has no account yet, the same rules apply, so the
  inviter hears it at once.
- **Sign-in**: blocked domains and disposable services (no DNS lookup at each sign-in), and confirmation. Checked only
  after the password is right, so the answers never reveal whether an account exists. **Platform administrators are
  never refused at sign-in**, so a rule change cannot lock the founder out.
- **Google sign-in**: Google verifies the address, so a Google account confirms the address; the domain rules apply to
  new accounts and to sign-in.

## Email confirmation

- At sign-up (when active) the account is created with its own workspace, but without a session: the person sees
  "Check your inbox" and gets the `verify_email` message (link valid 24 hours, single use, only its SHA-256 stored,
  body cleared from the outbox once sent). The link opens `/verify-email`, which confirms the address; the person then
  signs in.
- Signing in before confirming answers "Confirm your email address first" and sends a fresh link (at most one every
  two minutes and ten a day per account). "Send the link again" on the sign-in page does the same and answers the same
  for every address.
- Someone who signs up with an invitation link is confirmed by the invitation (it was sent to that address).
- **Existing accounts**: migration 0007 marked every account that existed before it as confirmed, so nobody already
  using the app is asked. Accounts created while email was not connected are not confirmed; once email is connected
  they are asked once, at their next sign-in (the link is sent automatically).
- The founder can mark an account as confirmed by hand (Sign-up Protection > Waiting to confirm), after checking with
  the person.

## What is recorded

Every refusal goes to the audit log (`signup.refused`, `auth.login.refused`, `invitation.refused`) with where it
happened, the reason and the domain only, never the whole address. The console shows the last 30 days, the accounts
waiting to confirm, and existing accounts on domains the rules now refuse (they cannot sign in until the domain is
allowed).

## Tests

`apps/work/test/signup-protection.test.ts` (14 tests): disposable services and subdomains, no MX, null MX, a domain
that does not exist, DNS down (let through), blocked and always-allowed domains, the hidden field, blocked domains at
sign-in with administrators exempt and wrong passwords still "invalid", invitations, sign-up without email (unchanged),
the confirmation link (no session before, link once, body cleared, only the hash stored), expiry and resend limits,
invitation sign-up confirmed, existing accounts unaffected, manual confirmation and switching confirmation off, console
access, and the DNS-over-HTTPS parser.
