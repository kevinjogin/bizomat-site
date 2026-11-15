# CAD Automation: Sign in with BIZOMAT and computer status in BIZOMAT ERP

Review of 15 Nov 2026, read from the code at kevinjogin/bizomat-site `5e0f2d8` and kevinjogin/bizomat-cad `ce0c810`
(the copy in `apps/cad` is the same commit). It covers what one shared secret switches on, how each side checks it,
the exact settings, the owner's setup steps, the checks after, and how to switch it off again.

No secret has been made, set or seen for this review. Every value below in angle brackets is a placeholder.

## 1. What the secret switches on

One secret, made by the owner, switches on two features at once:

1. **Sign in with BIZOMAT** on CAD Automation's sign-in pages (`opensketch/bizomat_id.py`). A person signs in to CAD
   Automation with their BIZOMAT account.
2. **Computer status in BIZOMAT ERP** (`opensketch/erpstatus.py`). CAD Automation reports each person's computers,
   recent jobs and AI apps. BIZOMAT ERP shows them under Products and Engineering.

CAD Automation (the Fly app `cados`) keeps the secret. BIZOMAT (the Fly app `bizomat`, work Machine) keeps only its
SHA-256.

## 2. Where it stands today

**Live since 15 Nov 2026** (the owner's repository secret in both repositories):
- **bizomat:** deploy run 40 (d5ae6ca) staged `WORK_BIZOMAT_ID_CLIENTS`. Its check "CAD sign-in client" passed: a made-up
  code with the repository secret was refused as `invalid_grant`.
- **cados:** deploy run 4 of kevinjogin/bizomat-cad (2428934, release v30) staged `BIZOMAT_ID_CLIENT_SECRET` and passed
  its new check. The sign-in page offers Sign in with BIZOMAT, and BIZOMAT holds the same secret.
- **Sign-in start:** "Continue with BIZOMAT" sends the browser to `https://bizomat.ai/company/authorize` with
  `client_id=cad`, the registered return address and PKCE S256.
- **Status reporting:** CAD's log (Fly status run 4) says "ERP status: on", then the POST to
  `/company/api/id/cad-status` answered 200: "reported 1 accounts".
- **Not yet checked:** a real sign-in with "Continue with BIZOMAT", and the computers shown on a company's Products and
  Engineering page. Both need the owner's own sign-in (section 7, step 8). The website keeps both features labelled In
  development until then.

Before (checked on 15 Nov 2026 with read-only requests):

- Both features were off. `https://bizomat.ai/cad/login` showed no "Continue with BIZOMAT" button, so
  `BIZOMAT_ID_CLIENT_SECRET` was not set on `cados`.
- The provider endpoints on bizomat.ai are deployed and answer 401 without credentials
  (`POST /company/api/id/token`, `POST /company/api/id/cad-status`).
- The ERP's Products and Engineering page says "CAD Automation is not reporting to the ERP yet". That box shows
  whenever no client with id `cad` is configured on the work app.
- The website still labels both features In development (`src/pages/systems/engineering/index.astro`, three rows;
  `guide.astro`, one answer). They change only after the checks in section 7 pass.

## 3. The settings

| Setting | Set on | How it reaches the code | Format | Default | Needed |
| --- | --- | --- | --- | --- | --- |
| `WORK_BIZOMAT_ID_CLIENTS` | Fly app `bizomat` (secret) | `infrastructure/fly/entrypoint.sh` maps it to `BIZOMAT_ID_CLIENTS` for the work role only (`map WORK_BIZOMAT_ID_CLIENTS BIZOMAT_ID_CLIENTS`); `apps/work/src/node/config.ts` `COMPANY_VARS` copies it into the app | JSON array, below | not set: no clients | Yes |
| `BIZOMAT_ID_CLIENTS` (file) | work volume: `/data/work/.secrets/BIZOMAT_ID_CLIENTS` | the entrypoint reads root-owned secret files whose name is in the work role's list | the same JSON | none | Alternative to the Fly secret |
| `BIZOMAT_ID_CLIENT_SECRET` | Fly app `cados` (secret), or the bizomat-cad repository secret of the same name, which `deploy.yml` stages on `cados` at each deploy | read from the environment by `bizomat_id.client()` | 32 to 500 characters, no spaces. Use 64 hex characters (section 6) | not set: both features off | Yes |
| `BIZOMAT_ID_CLIENT_ID` | `cados` | environment | letters, digits, `.`, `_`, `-` | `cad` | No. Leave unset in production |
| `BIZOMAT_ID_URL` | `cados` | environment | `https://...` | `<BIZOMAT_SITE_URL>/company`, that is `https://bizomat.ai/company` | No. Leave unset in production |

The shape of `WORK_BIZOMAT_ID_CLIENTS`, one line:

```json
[{"id":"cad","name":"CAD Automation","secretSha256":"<64 lowercase hex characters>","redirectUris":["https://bizomat.ai/cad/auth/bizomat/callback"]}]
```

Rules the work app applies (`apps/work/src/worker/company/id-provider.ts`, `idClients`):

- It must be valid JSON. If it is not, there are no clients, and the log says `BIZOMAT_ID_CLIENTS is not valid JSON`.
- `secretSha256` must match `^[0-9a-f]{64}$`. **Uppercase hex is dropped without a message**, and the client then
  does not exist.
- In production a return address must start with `https://`, and it must match exactly. There are no prefixes or
  wildcards.
- One secret per client id. Rotation therefore has a short gap (section 9).

## 4. How each side checks the other

### Sign in with BIZOMAT (OAuth 2.0 authorization code with PKCE S256)

1. CAD's `/auth/bizomat` sends the browser to `https://bizomat.ai/company/authorize` with `client_id`,
   `redirect_uri`, `state` and `code_challenge` (S256).
   - The state is random and kept in a short-lived signed cookie.
   - The code verifier is derived from the state with a key of the CAD server (`verifier_for`), so the cookie holds
     nothing secret.
2. The person signs in to BIZOMAT if needed and sees which application asks. Continue posts to
   `/api/company/id/authorize`. The work app checks the following, then returns the return address with a one-time
   code (10 minutes, stored as a SHA-256):
   - the client id is known;
   - the return address is registered exactly;
   - the state is 8 to 500 characters;
   - the challenge is S256.
3. CAD's server exchanges the code at `POST /company/api/id/token` with HTTP Basic (client id and secret), the code,
   the same `redirect_uri` and the code verifier. The work app checks, in order:
   - the client and the SHA-256 of the secret (constant-time compare);
   - the grant type;
   - the code belongs to this client, is unexpired and has the same return address;
   - the verifier matches the stored challenge;
   - the code is used once only, even when two requests race;
   - the account is not disabled.

   It returns an access token (1 hour, stored as a SHA-256).
4. CAD reads `GET /company/api/id/userinfo` with the token: `sub`, `email`, `email_verified`, `name`, companies.
5. CAD links or creates its account (`accounts.bizomat_user`):
   - the account already linked to this `sub`;
   - else the account with the same email, only if BIZOMAT says the email is confirmed;
   - else a new member, only from an invite link or with open sign-up.

   CAD keeps only the BIZOMAT id, not the companies.

### Computer status

- CAD posts to `POST https://bizomat.ai/company/api/id/cad-status` with HTTP Basic (client `cad` and the secret).
- The work app answers:
  - 401 for an unknown client or a wrong secret;
  - 403 for any client other than `cad`;
  - otherwise it stores one row per email in `sys_cad_status`, each report replacing the earlier one.
- Limits:
  - the work app takes 60 requests a minute per address, and at most 500 accounts a request;
  - CAD sends at most 100 accounts and 512 KiB a request;
  - each account carries up to 20 computers, 20 jobs and 20 AI apps, with texts cut to the work app's limits.
- CAD reports every 180 s, and 10 to 30 s after a change, in its own thread, never on the event loop. Each request
  times out after 10 s. Failures back off from 1 to 30 minutes, longer when the ERP sends `Retry-After`.
- CAD reports only accounts whose email it has proven (`accounts.confirmed_accounts`):
  - the owner's own account;
  - accounts made or linked by a confirmed Google or BIZOMAT sign-in.

  Typed emails are left out. An account no longer reported is withdrawn once (sent with `emailVerified: false`, no
  `sub` and empty lists).
- What is never sent:
  - a password, key, token or the secret;
  - a file name, path or document content;
  - the open document's name;
  - the Companion's version.

### Who sees what in BIZOMAT ERP (`apps/work/src/worker/system/system.ts`, `cadFor`)

- A report belongs to a person by their BIZOMAT account id (`sub`), or by an email both sides have confirmed.
- In a registered company, the owner and administrators see everyone's computers; every other person sees only their
  own; a company they only share a tool with shows nothing; the example company shows nothing.
- The "not reporting yet" box depends only on whether a client `cad` is configured (`system/routes.ts`,
  `cadConnected`), not on whether reports have arrived.

## 5. When only one side is set

| Set | What happens |
| --- | --- |
| Only `WORK_BIZOMAT_ID_CLIENTS` on bizomat | The ERP's "not reporting yet" box goes, and the page says no report has arrived yet. Nothing else changes. CAD shows no BIZOMAT button and sends nothing. |
| Only `BIZOMAT_ID_CLIENT_SECRET` on cados | CAD shows "Continue with BIZOMAT", but the provider answers 400 on authorize ("This application is not allowed") and 401 on the token, so nobody can sign in that way. Status reports get 401 and back off up to 30 minutes. They go through by themselves once bizomat is set, or at once after a restart of `cados`. Nothing breaks: password and Google sign-in keep working. |
| Both, but from different secrets | As the row above: 401 on the token exchange and on every report. CAD's Admin page, panel BIZOMAT ERP, shows the 401. |
| Neither (today) | Both features off. Everything else works. |

## 6. The secret: what kind, and why

Use 64 hex characters (`openssl rand -hex 32`). Other characters can break the exchange:

- The token exchange (`httpx` `auth=(id, secret)`) sends the secret in HTTP Basic without encoding it.
- The work app splits the decoded Basic value on `:` and then URL-decodes each part.
- So a secret with `:` or `%` in it would not match at the token exchange, even though the status report (which
  form-encodes both parts) would.

The SHA-256 is of the secret's exact characters (UTF-8, no newline), written in lowercase hex. `sha256sum` and
PowerShell's `ToString('x2')` both write lowercase.

## 7. Setup steps for the owner

**The way used on 15 Nov 2026: repository secrets only.** The owner saved the same `BIZOMAT_ID_CLIENT_SECRET` as a
repository secret in kevinjogin/bizomat-site and in kevinjogin/bizomat-cad. Then, in this order:
- **The website's deploy** (`.github/workflows/bizomat-deploy.yml`) does three things:
  - stages `WORK_BIZOMAT_ID_CLIENTS` on `bizomat` with the secret's SHA-256 and the return address above
    (`.github/scripts/stage-secrets.sh`);
  - after the deploy, proves the match (step "CAD sign-in client"): the token endpoint is asked to swap a made-up code
    with the client's credentials, and the right secret answers `invalid_grant` (400), never `invalid_client` (401);
  - never prints the secret: it reaches curl on standard input.
- **Then CAD's deploy** (kevinjogin/bizomat-cad, Deploy to Fly.io (cados), `confirm` = `DEPLOY`) stages the secret on
  `cados`.
- **Then the checks in step 8.**

The manual steps below are the other way, from a computer with `flyctl`.

Do this from a computer where `flyctl` is signed in to the organization that holds both apps.
- Use Git Bash on Windows, WSL, macOS or Linux; PowerShell 5.1 drops quotes inside JSON on the command line.
- Each command below holds the secret only in a shell variable. The secret is never typed, printed or saved, so it
  is not in the shell history.

The setup takes about 10 minutes, plus the deploys.

1. **Check flyctl.** `fly version` should be 0.5 or later (checked here: 0.5.10 has `fly secrets import --stage`, which
   reads `NAME=VALUE` lines from standard input).

2. **Make the secret and its SHA-256, in variables only:**

   ```bash
   S="$(openssl rand -hex 32)"
   H="$(printf %s "$S" | sha256sum | cut -d' ' -f1)"
   [ "${#S}" -eq 64 ] && [ "${#H}" -eq 64 ] && echo "secret and hash made (not shown)"
   ```

3. **Keep the secret in the password manager.** Copy it to the clipboard without showing it, paste it into a new
   password-manager entry "BIZOMAT CAD client secret", then clear the clipboard:
   - Windows (Git Bash or WSL): `printf %s "$S" | clip.exe`
   - macOS: `printf %s "$S" | pbcopy`
   - Linux: `printf %s "$S" | xclip -selection clipboard`

4. **BIZOMAT first**, so that CAD's first report is accepted. Stage the client on `bizomat` (it does not restart
   anything):

   ```bash
   printf 'WORK_BIZOMAT_ID_CLIENTS=[{"id":"cad","name":"CAD Automation","secretSha256":"%s","redirectUris":["https://bizomat.ai/cad/auth/bizomat/callback"]}]\n' "$H" \
     | fly secrets import --stage --app bizomat
   ```

   Apply it with the next run of the website's deploy workflow (kevinjogin/bizomat-site, Actions >
   BIZOMAT deploy (bizomat), `confirm` = `DEPLOY`). Its step "The optional secrets" then lists
   `WORK_BIZOMAT_ID_CLIENTS` as set.
   - Do not use `fly secrets deploy --app bizomat` for this. It restarts the proxy, web and work Machines together, the
     same outage as a deploy, without the workflow's checks.

5. **Check BIZOMAT before going on.** Sign in at `https://bizomat.ai/erp` and open a company's Products and
   Engineering page.
   - The box "CAD Automation is not reporting to the ERP yet" is gone.
   - The page says no CAD Automation report has arrived yet.
   - If the box is still there, the JSON or the hash is wrong. Check the work Machine's log with
     `fly logs --app bizomat` for `BIZOMAT_ID_CLIENTS is not valid JSON`, then repeat step 4.

6. **Then CAD Automation.** Choose one of the two ways and use only that one:
   - **Recommended:** stage the secret on `cados` and apply it.

     ```bash
     printf 'BIZOMAT_ID_CLIENT_SECRET=%s\n' "$S" | fly secrets import --stage --app cados
     fly secrets deploy --app cados
     ```

     `fly secrets deploy` restarts the one `cados` Machine. CAD Automation is offline for about 15 to 90 seconds,
     as in its own deploys; the computers' Companions reconnect by themselves. You can instead leave it staged until
     the next CAD deploy.
   - **Or, through GitHub:** in kevinjogin/bizomat-cad, add the repository secret `BIZOMAT_ID_CLIENT_SECRET`
     (paste from the password manager), then run Actions > Deploy to Fly.io (cados) with `confirm` = `DEPLOY`. Its
     step "Pass optional secrets to Fly" stages it, and the deploy applies it. If you use this way, the repository
     secret is set again on every later CAD deploy, so it is the one to change or remove (section 8).

7. **Forget the variables:** `unset S H`.

8. **Check it works.**
   - `https://bizomat.ai/cad/login` shows "Continue with BIZOMAT".
   - CAD's Admin page (`https://bizomat.ai/cad/admin`, owner only), panel BIZOMAT ERP: On. Within about 20 seconds
     of the start it shows "Last report: <time>, N people" and no error. If it shows an error:
     - 401: the secret and the hash are not from the same secret;
     - 403: the client id is not `cad`;
     - "Could not reach": the network.
   - `fly logs --app cados` shows `OpenSketch ERP status: on` and `reported N accounts`.
   - Sign in to CAD Automation once with "Continue with BIZOMAT". This links your CAD account to your BIZOMAT
     account, and makes your email proven, so you are reported.
   - In BIZOMAT ERP, the company's Products and Engineering page lists your computers under
     "Computers in <company>". A member sees only their own.

9. **Then the website** (a pull request of its own, after step 8 passes): change the three In development rows on
   `/systems/engineering/` and the answer in its guide to say the features are live.

## 8. Switching it off (rollback)

1. **CAD first.** Remove the secret on `cados`; both features stop at once:
   - Recommended: `fly secrets unset --stage --app cados BIZOMAT_ID_CLIENT_SECRET`, then
     `fly secrets deploy --app cados` (one CAD restart, 15 to 90 seconds).
   - If you used the GitHub way, also delete the repository secret `BIZOMAT_ID_CLIENT_SECRET` in
     kevinjogin/bizomat-cad. Otherwise the next CAD deploy sets it again.
2. **Then BIZOMAT:** `fly secrets unset --stage --app bizomat WORK_BIZOMAT_ID_CLIENTS`, applied with the next website
   deploy. The ERP page shows "not reporting yet" again.
3. What stays after a rollback:
   - **Earlier reports.** The ERP keeps the last reports in `sys_cad_status` and still shows them. Clearing them
     needs a database change on the work volume (owner decision).
   - **Accounts first made through "Continue with BIZOMAT".** They have no CAD password. The owner sets one for them
     on CAD's Admin page, or they sign in with Google if it is on.
   - **Links between CAD and BIZOMAT accounts.** They stay, and do nothing while the secret is off.

## 9. Rotating the secret

There is one secret per client id, so a rotation has a short gap. Run steps 2 to 8 with a new secret, BIZOMAT first.

Between the two applies:
- sign-ins with BIZOMAT fail;
- reports get 401 and back off.

Restart `cados` at the end (step 6 does) so reports resume at once. Then replace the password-manager entry.

## 10. The local SOLIDWORKS connections do not depend on it

- **Paired computers (the Companion).** Pairing and the signed device link (`opensketch/devicebridge.py`, `/v2/devices/pair/*`,
  `/v2/device/*`) use CAD's own accounts and device keys. The only link to this feature is `_changed()`, which sets a
  flag for the reporter inside `try/except` and does nothing when reporting is off.
- **The add-in's direct link.** It uses the per-person key in `opensketch/swbridge.py` (`/mcp/sw/*`) and has the same
  guarded `_changed()` hook.
- **The server.** It starts and stops the reporter in `server.lifespan` through `_erp_status`, which catches every
  error.
- **The MCP connector.** Its OAuth (`opensketch/mcpauth.py`) is separate from Sign in with BIZOMAT.

Tests run for this review, without the secret set, all passed:
- `tests/test_devicebridge.py`, `tests/test_mcp_access.py`, `tests/test_canonical.py`: 140 passed;
- `tests/test_swbridge.py`, `tests/test_connector.py`: 13 passed.

## 11. Tests for the feature itself

Run on 15 Nov 2026:

| Where | Command | Result |
| --- | --- | --- |
| bizomat-cad `ce0c810` | `BIZOMAT_WORK_APP=<built apps/work> pytest -q tests/test_bizomat_id.py tests/test_erpstatus.py -m "slow or not slow"` | 24 passed, including the slow test against the real work app built from bizomat-site `5e0f2d8` (its 26 migrations): it checks who sees which computer |
| bizomat-site `5e0f2d8`, `apps/work` | `npx vitest run test/company.test.ts test/system.test.ts` | 24 passed (the provider: code, token, account; CAD status only from the `cad` client with its secret; who sees what; email matching only when both sides confirmed it) |
| bizomat-site `5e0f2d8`, `apps/work` | `npx vitest run --config vitest.node.config.ts test-node/config.test.ts` | 4 passed (settings reach the app) |
