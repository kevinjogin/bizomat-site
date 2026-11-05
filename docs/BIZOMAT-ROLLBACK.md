# BIZOMAT rollback

How to go back to the previous deployments at any point of the move to BIZOMAT, product by product. The move is
designed so that rollback is always a DNS change plus, at most, copying back data written after cutover. Nothing old
is deleted, renamed or overwritten.

## 1. What stays untouched during the rollback window

| Product | Old deployment | Its data | State during the move |
| --- | --- | --- | --- |
| Website and Resources | Cloudflare Worker `throbbing-block-6c61`, route `kevos.com/*` | Git (nothing to restore) | Keeps serving kevos.com until the owner adds the redirect to bizomat.ai |
| Project Management | Cloudflare Worker `workos-platform-preview`, custom domain `work.kevos.com` | D1 `workos-platform-preview-db`, R2 `workos-platform-preview-files` | Read for the export, never written by the migration |
| CAD Automation | Fly app `cados` (Sydney), host `cados.kevos.com` (DNS-only CNAME to `cados.fly.dev`) | Volume `opensketch_data` at `/data` | Paused (SIGSTOP) while its data is copied, then left paused or resumed; never destroyed |

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

## 4. Project Management (work.kevos.com, work.bizomat.ai)

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
6. Leave `work.bizomat.ai` pointing at Fly in maintenance mode, or remove its DNS record, so nobody writes to the
   BIZOMAT copy while the old one is live.

Hashes stay compatible both ways during the window because the Node runtime keeps PBKDF2-SHA256 at 100,000
iterations, the same as the Worker (`BIZOMAT-SECURITY.md`, F4). Do not raise the iteration count until the window
has passed.

## 5. CAD Automation (cados.kevos.com, cad.bizomat.ai)

Paired computers, AI apps and the SOLIDWORKS add-ins connect to `cados.kevos.com`. The BIZOMAT cad process serves
the same host with the same data (accounts, OAuth grants, the command-signing key, device keys), so moving the DNS
record back is invisible to them apart from reconnecting.

### Before data cutover
Nothing to do. If the old app was paused for a rehearsal, resume it:
`fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh cont"`.

### After data cutover
1. Put the BIZOMAT cad process in maintenance mode (as for Project Management, with `-g cad`).
2. Decide whether data written on BIZOMAT since cutover must be kept (new accounts, newly paired computers, new AI
   app connections). Commands in flight are not worth copying: they expire.
   - **Keep it:** export from the BIZOMAT cad Machine with the same script used for the move
     (`infrastructure/migrate/cad/export.sh /data/cad`), check it with `verify.sh --archive`, and import it on the
     old Machine in place of `/data` after moving the old folder aside (never delete it). The data format is the
     same in both directions because both run the same CAD Automation code, as long as the old app has not been
     redeployed with an older version.
3. Resume the old server: `fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh cont"`, then check
   https://cados.fly.dev/healthz.
4. In Cloudflare (zone kevos.com), set the DNS-only CNAME `cados` back to `cados.fly.dev`.
5. Certificates: check `fly certs show cados.kevos.com -a cados`. If the certificate was removed from `cados` during
   cutover, add it again (`fly certs add cados.kevos.com -a cados`). If it has expired because its `_acme-challenge`
   record points at the BIZOMAT app, set that record back to the value `fly certs setup cados.kevos.com -a cados`
   shows; Fly issues it within minutes once the CNAME points at `cados.fly.dev` again. (A certificate is valid for 90
   days and renews 30 days before expiry, so expiry matters only for a late rollback.)
6. Check https://cados.kevos.com/healthz, sign in, and ask one person to check that their Companion shows
   "Connected" and that `sw_status` answers from their AI app.

## 6. The platform as a whole

| Change | How to undo it |
| --- | --- |
| A bad deploy of the `bizomat` app | `fly deploy --image <previous image>`; volumes are untouched by deploys |
| Corrupted data on a volume | Restore the latest good snapshot (`fly volumes snapshots list <volume id>`, `fly volumes create <name> --snapshot-id <id> -r syd`, then move the Machine to the new volume), or restore the migration archive kept under `/data/backups/` with `infrastructure/migrate/restore.sh` |
| A secret set wrongly | `fly secrets set` / `fly secrets unset`; for volume-held secrets, edit `/data/<role>/.secrets/<NAME>` as root and restart the Machine |
| The proxy routes a host wrongly | Redeploy the previous image; the routing table is in `infrastructure/proxy/routes.mjs` and covered by its tests |
| DNS record changed by mistake | Each DNS step in `BIZOMAT-DEPLOYMENT.md` records the old value before it is changed; put the old value back |

## 7. Rollback log

For every rollback, record in `docs/BIZOMAT-PROJECT-STATUS.md`: date and time, product, trigger, steps taken, data
copied back (counts only, never contents), who approved it, and the follow-up needed before the next attempt.
