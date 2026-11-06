# CAD Automation into the Fly app `bizomat`, with its data

CAD Automation (bizomat.ai/cad) ran in a Fly app of its own, `cados`: one Machine and its volume `opensketch_data` in
Amsterdam, reached by the router of the `bizomat` app (Sydney) over Fly's private network at `cados.internal:8080`, so
every request from Australia crossed the world. It moves into the `bizomat` app as the process group `cad`, in Sydney,
with its own volume `cad_data`, and the router sends bizomat.ai/cad there instead. The data is the same folder, byte
for byte: the same accounts, AI app connections (OAuth clients and tokens), paired computers, signing keys and files,
so connectors (`https://bizomat.ai/cad/mcp`) and paired computers keep working without being set up again.

Everything runs from the owner's laptop (CADOS `tools/laptop/bizomat.ps1`): nothing goes through GitHub or CI.

## What runs where

| Piece | Where | What it is |
| --- | --- | --- |
| The cad group | `fly.website.toml` (`[processes] cad`, `[[mounts]] cad_data`, performance-1x 2 GB like cados) | Built from `apps/cad`, which is an exact copy of a CADOS commit (`apps/cad-source.json`; `scripts/sync-cad.mjs check` proves it by git's tree hash). CADOS stays where CAD Automation is changed and tested |
| Its start | `infrastructure/fly/entrypoint.sh cad` | No server password (CADOS#11). On a volume without CAD data it never starts the CAD server: it shows the holding page (`infrastructure/fly/cad-holding.py`: `/healthz` 200 with `"ok": false`, everything else 503 "being moved"). Also in maintenance mode |
| The move | `infrastructure/migrate/cad/to-fly.mjs` | `check`, `apply`, `back`, `status`, `retire-ips`, `delete-app` (each one's steps are at the top of the file). Node 22 and flyctl only |
| The scripts it runs on the Machines | `freeze.sh`, `export.sh` (sent to cados), `verify.sh`, `import.sh` and `../restore.sh` (in the image) | Unchanged in what they check; `export.sh` now leaves a role's `.secrets` out |
| The laptop's commands | CADOS `tools/laptop/bizomat.ps1` | `deploy website`, `move cad`, `back cad`, `deploy cad`, `sync cad`, `retire cados`, `delete cados` |
| The rehearsal | `../test/cad-move/rehearse.sh` | The whole move against a stand-in flyctl (`fake-fly.mjs`): each Machine in its own namespaces, the real entrypoint, holding page, scripts and router. CI runs it |

Nothing prints a setting's value or a file's contents: names, counts, ids and checksums only. The copy on the laptop
(`C:\BIZOMAT\moves\cad-<time>\`) holds every key of CAD Automation: it stays there, and is deleted at the end of the
rollback window.

## What moves

The whole data folder (`/data` on cados, `/data/cad` on the cad Machine), every file except the `*.tmp` of atomic
writes and `lost+found`:

| File | Holds | If it did not come across |
| --- | --- | --- |
| `secret.keys` | the folder's root key: every member's private connector address, the add-in keys, link signatures, OAuth consent and Google sign-in state | every private connector address and add-in key would change |
| `users.json`, `accounts.enabled` | accounts (scrypt hashes, roles, suspension), invites, settings; the marker that accounts exist | every account gone; without the marker a lost `users.json` would read as a new server |
| `mcp_oauth.json` | AI app clients, grants (with the address each was made with), access and refresh tokens (hashed) | every AI app connected again |
| `bridge-signing-key.pem` | the gateway's P-256 key; Companions verify every command and update with it | every computer paired again |
| `bridge.sqlite` (+ `-wal`, `-shm`) | paired computers, pairings, command history | every computer paired again |
| `swbridge.json`, `sessions.json`, `ai_keys.secret`, `google_oauth.json`, `secret`, `bridge-release.json` | add-in key counters, browser sessions, the key of the Google client secret, Google sign-in, the base secret, the Companion release | new add-in keys, everyone signs in again, Google sign-in set up again, the update offer published again |
| `uploads/`, `artifacts/`, `bridge-files/` | short-lived uploads and exports; chunks of commands in flight | links in flight fail (they expire within hours) |

And CAD Automation's own settings that cados has as Fly secrets (`OPENSKETCH_*`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`): read from the paused server's environment, never shown, and written on the cad volume as
`/data/cad/.secrets/NAME` (root only, 0600), which the entrypoint gives the cad role alone (no other Machine of
`bizomat` ever holds them). `OPENSKETCH_PASSWORD`, if cados still has it, only seeds the owner's old server-wide
private connector address (CADOS `auth._legacy_password`): it moves too, so that address keeps working. Other secret
names are listed and left behind. Plain settings (`OPENSKETCH_PUBLIC_URL`, `OPENSKETCH_REDIRECT_HOSTS`) must already
be the same in `fly.website.toml`; the check stops otherwise.

## Order (the owner, on the laptop)

1. **The cad group.** Merge the gocore-website change with the cad group (it keeps `UPSTREAM_CAD` on cados), then
   `.\bizomat.ps1 deploy website`. It checks `apps/cad` against CADOS, makes the volume `cad_data` (3 GB in Sydney, a
   snapshot every day kept 30 days), deploys, and the cad Machine starts with its holding page. bizomat.ai/cad is
   still served by cados. Nothing else changes.
2. **The rehearsal.** `.\bizomat.ps1 move cad -DryRun`: both apps, the router's route to the cad group over the private
   network, the settings (names), room on both sides; then a copy of the data taken while cados keeps running, brought
   to the laptop and checked file by file (and its signing key against the one bizomat.ai/cad serves), and a test file
   sent to the cad volume and removed. Nothing changes.
3. **The move.** Tell the people who use CAD Automation about a pause of a few minutes, then `.\bizomat.ps1 move cad`:
   the same checks, then you type yes, and it runs `to-fly.mjs apply`:
   - cados is kept awake (autostop off: its Machine restarts once);
   - the router sends bizomat.ai/cad to the cad group, which says "being moved" (`UPSTREAM_CAD`, on the router's
     Machine; nothing is built);
   - cados is frozen (every Python process paused), the data exported there, its settings read, the copy brought to
     the laptop and checked;
   - the copy goes to the cad volume (the first way that arrives intact: ssh, sftp, or base64 pieces), is checked
     there with the same counts, imported (what the volume held moves to `/data/backups/cad-<time>/`), the settings
     written, and the cad Machine restarted: the CAD server starts with the data;
   - live checks through bizomat.ai: the CAD server answers with its CADOS version, `/cad/v2/keys` has the same key id
     (paired computers keep trusting it), `/cad/setup` goes to sign-in (the accounts are there), `/cad/mcp` asks for
     OAuth with the metadata at the root, the protected resource is still `https://bizomat.ai/cad/mcp`;
   - cados is stopped and kept stopped (autostart off), its volume as it was at the freeze, for the way back.
   If a step fails before the end, it takes the way back by itself: the router to cados, cados resumed, the cad
   Machine in maintenance, no copy left on either Machine.
4. **Check it yourself.** Sign in at https://bizomat.ai/cad/login: Admin lists the same people, Settings shows the same
   private connector address, SOLIDWORKS lists the same computers; an AI app connected with
   `https://bizomat.ai/cad/mcp` runs `sw_status`.
5. **Make the route permanent.** Merge the gocore-website change that sets `UPSTREAM_CAD =
   "http://cad.process.bizomat.internal:8001"` in `fly.website.toml` (title with `[skip ci]`). Until it is merged,
   `deploy website` refuses: a deploy would send bizomat.ai/cad back to the old copy.
6. **Retire cados**, with the owner's go-ahead (below).

From then on, CAD Automation deploys with `.\bizomat.ps1 deploy cad`: it needs `apps/cad` to be CADOS main
(`.\bizomat.ps1 sync cad` makes the gocore-website branch that brings it across), deploys the cad group alone
(`--process-groups cad`), and checks the version, the key, setup and OAuth. `deploy website` restarts the cad group
only when `apps/cad` or the platform scripts changed since the commit it runs (each deploy tags its image
`bizomat-<commit>`).

## Old addresses

`cados.kevos.com` (an A record to cados's shared address, DNS only) and `cados.fly.dev` reach cados directly. When the
move stops cados they get no answer:
- Computers with the 0.13 Companion use `https://bizomat.ai/cad` by themselves (CADOS#22) and stay paired. Older
  Companions paired with an old address need the 0.13 installer.
- AI app connections made with an old address (the check counts them by address, from the grants) stop until they are
  connected again with `https://bizomat.ai/cad/mcp`, or until `cados.kevos.com` points at `bizomat`.
- To keep `cados.kevos.com` (the router already sends that host to the cad group, programs at its root with its own
  address): `fly certs remove cados.kevos.com -a cados`, `fly certs add cados.kevos.com -a bizomat`, the validation
  record `fly certs setup cados.kevos.com -a bizomat` shows, then the record `cados` in the kevos.com zone to
  `bizomat.fly.dev` (CNAME, DNS only). A production DNS change: the owner's, with approval. `cados.fly.dev` cannot
  move: it is the old app's own name.

## The way back

- **During the move:** automatic (above).
- **After it:** `.\bizomat.ps1 back cad`: cados started again (autostart on) with its data as at the move, the router to
  cados, the cad Machine into maintenance (it keeps its copy; a new move needs `-Force`, which keeps it in
  `/data/backups`). What changed in the cad group since the move stays there and is not carried back: sign-ins, AI apps
  whose sign-in was renewed there (connect them again), computers paired since. If the route was made permanent
  (step 5), revert it on GitHub before the next `deploy website` (it checks).
- **Bad data on the cad volume later:** `/data/backups/cad-<time>/` (what an import replaced) and the volume's daily
  snapshots (`fly volumes snapshots list <volume id> -a bizomat`).

## Retirement (irreversible; the owner's go-ahead first)

Only after the owner confirms CAD Automation works from the cad group, in two steps, each of which shows what it
will do and needs a typed phrase:

1. `.\bizomat.ps1 retire cados`: refuses unless bizomat.ai/cad is the cad group, `fly.website.toml` agrees and cados is
   stopped; shows cados's public addresses and every name that stops answering with them (`cados.fly.dev`, and
   `cados.kevos.com` unless it was moved); type `release cados` and it runs `fly ips release` for each.
2. Later, at the end of the rollback window: `.\bizomat.ps1 delete cados`: the same checks and no public address left;
   takes a snapshot of the cad volume, shows what goes (the Machine, the volume `opensketch_data` with its snapshots);
   type `delete cados` and it runs `fly apps destroy cados`. Then delete the laptop's `moves\cad-*` folders.

By hand, without the laptop's script, the same steps are `node infrastructure/migrate/cad/to-fly.mjs retire-ips` and
`delete-app` (previews), then with `--confirm cados`.
