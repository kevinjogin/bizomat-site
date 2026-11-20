# BIZOMAT staging

Staging is the Fly app **`bizomat-staging`** (Sydney) at **https://bizomat-staging.fly.dev**. Every release is tested
there before production (owner, 19 Nov 2026). It runs the production image with production's settings, so the
website and BIZOMAT ERP behave as they do on bizomat.ai. Staging never holds production data and never reaches
production.

## How it works

```
  browser ──https──> gate (password, noindex) ──> proxy ──> web   (the website)
  bizomat-staging.fly.dev                          │   └──> work  (BIZOMAT ERP, its own empty volume)
                                                   └──> /cad answers 502: CAD Automation runs only in production
```

| Part | What it does |
| --- | --- |
| `fly.staging.toml` | The app: the production groups `proxy`, `web` and `work` at production's sizes, plus `gate`, the only public service. Every upstream names one of staging's own Machines (`*.process.bizomat-staging.internal`) |
| Gate (`infrastructure/preview/gate.mjs`, role `gate`) | The same gate as the review preview. It asks for a password (HTTP Basic, user `review`), sends each request to the proxy as `bizomat.ai`, and rewrites every `https://bizomat.ai` link in answers to the staging address, so nothing leads to production. It adds `X-Robots-Tag: noindex` and drops HSTS. It stops by itself when nobody visits |
| Entrypoint role `gate` | Refused in any app whose name does not end in `-staging`, and refused without `GATE_PASSWORD`. Runs as the router's unprivileged user with only `GATE_*` settings |
| `.github/workflows/bizomat-staging.yml` | Deploys any branch, or starts or stops the Machines. After a deploy it checks every Machine and the pages through the gate. **When a check fails, it deploys the previous image again by itself** |
| `infrastructure/fly/test/check-config.py` | CI refuses a staging configuration that names a production address, puts a service on another group, changes a Machine size from production's, or leaves test mode |

**What staging does differently from production:**

- `ENVIRONMENT` is `staging`. Secure cookies and sign-up checks stay on, as in production.
- Email is written to the log only. Staging never sends mail.
- Stripe is in test mode, with no keys and no price, so billing is off. Test keys can be added later as Fly secrets
  of this app.
- There is no Google sign-in and no CAD Automation.

## Owner's steps

1. **Done (19 Nov 2026):**
   - The app was created with `fly apps create bizomat-staging --org personal`.
   - The repository secret `FLY_STAGING_TOKEN` holds a deploy token for `bizomat-staging` only.
2. **The gate's password.** Choose one of 16 characters or more: letters, digits and `._~+/=!@#%^&*,:;?-`, with no
   spaces, quotes or backslashes. Keep it in your password manager. Set it without it appearing on screen; the
   command asks for the value and hides it:

   ```bash
   gh secret set STAGING_PASSWORD --repo kevinjogin/bizomat-site
   ```

3. **The first deploy**, once this workflow is on `main`:
   - Go to Actions, then **BIZOMAT staging (bizomat-staging)**, then Run workflow.
   - Choose branch `main`, action `deploy`, and type `YES` in `allow_machine_change`.
   - This deploy creates the four Machines and the 1 GB volume.
   - Later deploys need no `YES`.
4. **Sign in.**
   - Open https://bizomat-staging.fly.dev, with user `review` and your password.
   - Then sign up for a BIZOMAT account in staging's own, empty database.
   - Sign-up needs an address whose domain receives mail (the same check as production). No email is sent, and no
     confirmation is needed on staging.

## Testing a branch

- Run the workflow on the branch, with action `deploy`.
- Its summary lists each check.
- If a check fails, the image that ran before is deployed again by itself, and the run fails.

## Verifying a release

After a deploy, run the staging workflow (`.github/workflows/bizomat-staging.yml`) again on the same branch with action
**`verify`** (or `verify-flags-off` for step 2 alone). It walks staging as a tester, through the gate, in a real browser (`infrastructure/staging/verify.mjs`):

1. **Prepare**: staging's own sign-up policy accepts invented `example.com` addresses (staging sends email to the log).
2. **Every flag off**: the website's pages (each must answer 200 and decode as sent), the old addresses that answer 301,
   sign-up, the example company and every ERP module, an invented company registered, no browser errors.
3. **Flags on** (action `verify`): `new_ui_enabled`, `company_members_v2`, `cad_in_erp` and `company_admin_console` on in staging only. The website must
   follow within 150 s (it asks Project Management every minute), every page and module must show the new UI, Compact
   density must be saved on the account and applied, and the Members page and an invitation must work.
4. **Flags off again**, always, even after a failed check, and the old look must come back.

The flags are switched in staging's database by `infrastructure/staging/staging-db.mjs`, sent to the work Machine with
flyctl (the staging token) and run as the work user; it refuses any app that is not `*-staging`. Production's flags are
changed only in the Control Centre, with the owner's approval. The tester's password is random, kept in a private file
for the run, and never printed.

## Cost

Staging bills while its Machines run.

- The gate stops by itself when idle.
- The proxy, web and work Machines do not, because they are reached over the private network.
- **Run the workflow with action `stop` when testing is done**, and `start` (or `deploy`) before the next test.
- A stopped Machine bills only for its disk image. The 1 GB volume is billed while it exists.

## Limits

- **No demo data yet.** Staging starts empty. The review preview's seed script refuses any address other than the
  local computer by design. Loading invented data on staging is a separate step, planned before the full test run
  (Stage 1, R8).
- **Personal API tokens do not work through the gate.** It removes the `Authorization` header after checking the
  password, so the apps never see the gate's password. Signed-in browser sessions work.
- **Shared private network.** Fly's private network is shared by every app of the organisation. Staging's
  configuration names only its own Machines, and CI checks this. An app in the same organisation could still reach
  staging's internal ports, as it can reach production's today.

## Rollback

- **Automatic** after a failed deploy check (above).
- **By hand:** list the images with `flyctl releases -a bizomat-staging --image`, then deploy the one you want, replacing
  `IMAGE_FROM_THE_LIST` with it:

```bash
flyctl deploy --config fly.staging.toml -a bizomat-staging --image IMAGE_FROM_THE_LIST --ha=false
```

- **Remove staging entirely** (the owner only; its data is invented). This deletes the app, its Machines and its
  volume:

```bash
fly apps destroy bizomat-staging
```
