# BIZOMAT rollback

How to go back to the previous deployments at any point of the move to BIZOMAT, product by product. The move is
designed so that rollback is always a DNS change plus, at most, copying back data written after cutover. Nothing old
is deleted, renamed or overwritten.

## 1. What stays untouched during the rollback window

| Product | Old deployment | Its data | State during the move |
| --- | --- | --- | --- |
| Website and Resources | Cloudflare Worker `throbbing-block-6c61`, route `kevos.com/*` | Git (nothing to restore) | Keeps serving kevos.com until the owner adds the redirect to bizomat.ai |
| Project Management | Cloudflare Worker `workos-platform-preview`, custom domain `work.kevos.com` | D1 `workos-platform-preview-db`, R2 `workos-platform-preview-files` | Read for the export, never written by the migration |
| CAD Automation | Fly app `cados` (one Machine in Amsterdam), host `cados.kevos.com` (DNS-only A record to cados's shared address) | Volume `opensketch_data` at `/data` | Paused (SIGSTOP) while its data is copied, then stopped with autostart off (`bizomat.ps1 move cad`): its volume keeps the data as it was at the move; never destroyed in the window |

**Rollback window:** 30 days after the last product's cutover, or longer if the owner chooses. Only after it ends,
and only with the owner's explicit decision, may the old Workers, the `cados` app, its volume, the D1 database or the
R2 bucket be retired. Retiring them is not part of this project.

## 2. When to roll back

Roll back a product (not the whole platform) when, after its cutover:

- its smoke test fails and the cause is not fixed within 30 minutes
  (`node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode live`);
- people cannot sign in with their existing passwords;
- the migration report shows a difference that cannot be explained (counts, checksums, missing relationships);
- for CAD Automation: paired computers do not reconnect, or AI apps lose their connection and cannot sign in again;
- for Project Management: files cannot be opened, or realtime board updates stop working.

Fly volume snapshots and the migration archives make it possible to fix forward instead; rollback is the safe
default when in doubt.

## 3. Website (bizomat.ai and kevos.com)

bizomat.ai is a new domain: before cutover nobody depends on it, so there is nothing to roll back to.

| Situation | Rollback |
| --- | --- |
| A bad website release on Fly | Redeploy the previous image: `fly releases -a bizomat --image`, then `fly deploy -a bizomat --image <previous image>`; or run the deploy workflow on the previous commit. |
| A bad website release on kevos.com (Cloudflare) | Cloudflare dashboard, Workers, `throbbing-block-6c61`, Deployments, roll back to the previous version; then revert the commit on `main` (every push to `main` deploys there). |
| kevos.com already redirects to bizomat.ai and bizomat.ai fails | Remove (or disable) the Cloudflare redirect rule on the kevos.com zone. The Worker route `kevos.com/*` is still in place and serves the site at once. If kevos.com's DNS was moved to Fly instead (option B in `BIZOMAT-DEPLOYMENT.md`), restore the proxied records it had before (saved in the cutover log) and the Worker route. |

Never touch the kevos.com MX, SPF, DKIM or DMARC records during a rollback: email for kevos.com depends on them.

## 4. Project Management (work.kevos.com, bizomat.ai/tasks)

### Before data cutover
Nothing to do: work.kevos.com still points at the Cloudflare Worker and its D1 database.

### After data cutover
1. Put the BIZOMAT side in maintenance mode so nothing more is written:
   `fly ssh console -a bizomat -g work -C "touch /data/.bizomat-maintenance"`, then `fly machine restart <work machine id> -a bizomat`.
2. Decide whether data written on BIZOMAT since cutover must be kept (check `updated_at` maxima in the migration
   report against the old D1 data; with 2 users, ask them).
   - **Nothing new was written:** go to step 4.
   - **New data must be kept:** export the BIZOMAT database for D1 with the Project Management tooling
     (`apps/work/scripts/migrate/export-for-d1.mjs`, see `apps/work/docs/migration/`), which writes an SQL file in the
     exact D1 schema. Before importing it, take a D1 backup point: D1 Time Travel keeps 30 days
     (`npx wrangler d1 time-travel info workos-platform-preview-db`, record the bookmark). Import into the old
     database only after checking the file on a copy (`wrangler d1 create`, then `wrangler d1 execute --remote --file`);
     copy new files to R2 with their keys (`wrangler r2 object put workos-platform-preview-files/<key> --file ...`).
     The files to copy are those whose keys are in the database but not in the bucket (the export report lists them).
3. If anything in step 2 goes wrong: `npx wrangler d1 time-travel restore workos-platform-preview-db --bookmark <bookmark>`
   returns the old database to the recorded point.
4. In Cloudflare (zone kevos.com): delete the DNS-only CNAME `work` that points at Fly, then in Workers,
   `workos-platform-preview`, Settings, Domains and Routes, add the custom domain `work.kevos.com` again.
   Cloudflare creates its DNS record and certificate within minutes.
5. Check https://work.kevos.com/api/health and sign in. People's sessions on the old host may still be valid; if
   not, they sign in again with the same password (hashes were never changed).
6. Leave the BIZOMAT work process in maintenance mode, so nobody writes to the BIZOMAT copy while the old one is
   live. If bizomat.ai already points at the BIZOMAT app (`BIZOMAT-DEPLOYMENT.md`, section 6, step 2), its `/tasks`
   reaches that copy and answers 502: tell people to use https://work.kevos.com until the cutover is tried again, or
   roll bizomat.ai back too (section 5).

Hashes stay compatible both ways during the window because the Node runtime keeps PBKDF2-SHA256 at 100,000
iterations, the same as the Worker (`BIZOMAT-SECURITY.md`, F4). Do not raise the iteration count until the window
has passed.

## 5. CAD Automation (bizomat.ai/cad, cados.kevos.com)

Since `bizomat.ps1 move cad` (`infrastructure/migrate/cad/README.md`), bizomat.ai/cad is the cad group of `bizomat`
in Sydney: the router's `UPSTREAM_CAD` points at it, and `cados` is stopped with autostart off. No DNS record changed
for the move: going back is a change of the router and a start of `cados`.

### During the move
Automatic: if any step of `move cad` fails before its end, it sends the router back to `cados`, resumes it, puts the
cad Machine in maintenance and removes the copies from both Machines.

### After the move
1. On the laptop: `.\bizomat.ps1 back cad` (`-DryRun` first shows where things are). It starts `cados` again with
   autostart on (its data as it was at the move), sends bizomat.ai/cad back to it (`fly machine update` of the router's
   Machine, no build), puts the cad Machine in maintenance (it keeps its copy) and runs the live checks: the CAD server
   answers, the same signing key at `/cad/v2/keys`, setup closed, OAuth metadata.
2. If the route was made permanent on GitHub (`UPSTREAM_CAD` on the cad group in `fly.website.toml`), revert that
   change before the next `deploy website` (it refuses while the router and the file disagree).
3. What changed in the cad group since the move stays on its volume and is not carried back: new sign-ins, AI apps
   whose sign-in was renewed there (connect them again), computers paired since. To keep it instead, export it from
   the cad Machine (`export.sh /data/cad`, `verify.sh --archive`) and import it on `cados` in place of `/data` after
   moving the old folder aside (never delete it); both run the same CAD Automation code.
4. If `cados.kevos.com` was moved to `bizomat` (optional step of the move), put its record back to cados's address and
   its certificate back on `cados` (`fly certs add cados.kevos.com -a cados`).
5. Ask one person to check that their Companion shows "Connected" and that `sw_status` answers from their AI app.

### After retirement
None: `retire cados` (public addresses released) and `delete cados` (the app and its volume deleted) cannot be undone,
which is why each needs the owner's go-ahead and a typed phrase. After them, the cad volume's daily snapshots and
`/data/backups` on it are the copies left.

## 6. The platform as a whole

| Change | How to undo it |
| --- | --- |
| A bad deploy of the `bizomat` app | `fly deploy --config fly.website.toml -a bizomat --ha=false --image <previous image>`; volumes are untouched by deploys |
| The one Machine (section 6e of `BIZOMAT-DEPLOYMENT.md`) does not work out | Section 6a below: back to three Machines, no data moved |
| Corrupted data on a volume | Restore the latest good snapshot (`fly volumes snapshots list <volume id>`, `fly volumes create <name> --snapshot-id <id> -r syd`, then move the Machine to the new volume), or restore the migration archive kept under `/data/backups/` with `infrastructure/migrate/restore.sh` |
| A secret set wrongly | `fly secrets set` / `fly secrets unset`; for volume-held secrets, edit `/data/<role>/.secrets/<NAME>` as root and restart the Machine |
| The proxy routes a host or path wrongly | Redeploy the previous image; the routing table is in `infrastructure/proxy/routes.mjs` and covered by its tests |
| DNS record changed by mistake | Each DNS step in `BIZOMAT-DEPLOYMENT.md` records the old value before it is changed; put the old value back |

### 6a. Back to three Machines (after the one-Machine cutover, `BIZOMAT-DEPLOYMENT.md`, section 6e)

No data moves either way: the volume `work_data` stays on the work Machine `80e971da556628` throughout. The
three-Machine configuration is `fly.website.toml` as it was before the change, in Git: in the laptop's clone,
`git show 738e48b:fly.website.toml > fly.three-machines.toml` (at the repository root; the commands below deploy an
existing image, so nothing is built). On Windows, `python3` below is `py -3` (Python 3.11 or newer), and
`ALLOW_MACHINE_CHANGE=YES` in front of a command is `$env:ALLOW_MACHINE_CHANGE = 'YES'` on the line before. Note each
step in the cutover log.

**While proxy and web are parked** (stopped, section 6e step 6; a few minutes, no build):

1. Start the old Machines, the website first: `fly machine start <WEB_ID> -a bizomat`; then the router:
   `fly machine update <PROXY_ID> -a bizomat --autostart=true --skip-start -y` and `fly machine start <PROXY_ID> -a
   bizomat`. They still run the image and settings they had before the cutover; the router reaches web over the
   private network and Project Management on the work Machine (`work.process.bizomat.internal:8002`, which the work
   Machine still answers). Both the old router and the work Machine now serve bizomat.ai.
2. Put the work Machine back to its own role, without the public service and at 512 MB. Pick the image: the one noted
   before the cutover (section 6e step 0), or the current one from `fly releases -a bizomat --image` (it has the `all`
   mode and the single roles). Check, then deploy the work group alone:
   `ALLOW_MACHINE_CHANGE=YES python3 .github/scripts/fly-preflight.py --app bizomat --config fly.three-machines.toml --process-groups work`
   (it must not say that no Machine would serve: the router from step 1 must be started), then
   `fly deploy --config fly.three-machines.toml --app bizomat --ha=false --process-groups work --image <image>`.
   `/tasks` answers 502 while work restarts (10-60 s); the website stays up.
3. Check: `fly machine list -a bizomat` (three started), `fly checks list -a bizomat`, the public checks of
   `BIZOMAT-DEPLOYMENT.md`, section 6e step 7, and `/__proxy/ready`.
4. Make the repository match: a pull request that puts `fly.website.toml` back (`git revert` of the change), merged
   before the next deploy. A normal deploy from `main` then brings proxy and web to the current code.

**After the removal** (section 6e step 8 done; a deploy creates the two Machines again):

1. `ALLOW_MACHINE_CHANGE=YES python3 .github/scripts/fly-preflight.py --app bizomat --config fly.three-machines.toml`
   lists proxy and web as created and work back to 512 MB.
2. `fly deploy --config fly.three-machines.toml --app bizomat --ha=false --image <image>`. flyctl creates the new
   proxy and web Machines before it updates work, so the new router serves before the work Machine gives up the
   public service.
3. Steps 3 and 4 above.

If the work Machine itself will not start after the cutover (all three services down): the old router still serves
the website and `/cad` while proxy and web are not yet parked; otherwise do step 1 above first, then step 2. If the data
on the volume is damaged, section 6, "Corrupted data on a volume" (the snapshot of section 6e step 1).

## 7. Rollback log

For every rollback, record in `docs/BIZOMAT-PROJECT-STATUS.md`: date and time, product, trigger, steps taken, data
copied back (counts only, never contents), who approved it, and the follow-up needed before the next attempt.
