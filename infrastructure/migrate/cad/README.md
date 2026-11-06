# CAD Automation data: from the `cados` app to `bizomat`

The CAD server keeps everything in its data folder: `/data` on the old Fly app `cados`, `/data/cad` on the `cad`
Machine of `bizomat` (`OPENSKETCH_DATA`). Moving it is a copy of that folder, byte for byte, while nothing writes to
it. The scripts here do the copy and prove it; the order below keeps a way back at every step.

| Script | Runs on | Does |
| --- | --- | --- |
| `freeze.sh stop\|cont\|status` | old `cados` Machine | pauses (SIGSTOP) or resumes every Python process, so the folder is still |
| `export.sh [/data]` | old `cados` Machine | one tar stream on stdout: `MANIFEST.sha256`, `EXPORT-INFO`, `data/...`; read-only; stream SHA-256 on stderr |
| `verify.sh --archive F` / `--tree D` / `--installed D` | anywhere with bash and python3 | every file against the manifest, then the important files readable (JSON, SQLite integrity on a copy, PEM) |
| `import.sh ARCHIVE [--force]` | new `cad` Machine (in the image) | `../restore.sh cad`: refuses unless the service is stopped; checks; moves old data to `/data/backups/cad-<time>/`; installs; gives it to `bzcad`; checks again; `verify.sh --installed` |

Nothing prints file contents: names and counts only. The archive itself holds credentials: save it outside the
repository checkout (the root `.dockerignore` keeps `*.tar` out of image builds, but git does not ignore it), and
delete it when the rollback window ends.

## What must come across

Read from `apps/cad/opensketch/` (`store.py`, `auth.py`, `accounts.py`, `mcpauth.py`, `devicebridge.py`,
`swbridge.py`, `secretbox.py`, `oauth.py`, `uploads.py`, `artifacts.py`). All of them come across; the table says what
breaks if one did not.

| File | Holds | If it were lost |
| --- | --- | --- |
| `secret.keys` | the folder's random root key: every member's private connector address, the SOLIDWORKS add-in keys, upload and download link signatures, OAuth consent and Google sign-in state | **critical**: every member's private connector address and add-in key change; open links fail |
| `users.json` | accounts (scrypt hashes, roles), invites, settings (access code, open sign-up) | **critical**: every account is gone |
| `accounts.enabled` | marker that accounts exist | **critical for safety**: without it a missing `users.json` would read as "no accounts" and open the server |
| `mcp_oauth.json` | the OAuth store: AI app clients (registration), grants, access and refresh tokens (hashed) | **critical**: every AI app connector must be connected again |
| `bridge-signing-key.pem` | the gateway's P-256 key; the Companion verifies every command and update manifest with it | **critical**: every computer must be paired again |
| `bridge.sqlite` (+ `-wal`, `-shm`) | paired computers (public keys), pairings, command history | **critical**: every computer must be paired again |
| `swbridge.json` | counters of the direct-link add-in keys (keys = HMAC of `secret.keys` and the counter) | add-in keys made with "New key" change |
| `sessions.json` | browser sessions (SHA-256 of the cookies) | everyone signs in again |
| `ai_keys.secret` | the key that encrypts the Google client secret in `google_oauth.json` (unless `OPENSKETCH_KEY_SECRET` is set) | Google sign-in set up in the app stops |
| `google_oauth.json` | Google sign-in client set up from the app | Google sign-in stops |
| `secret` | the base secret, used only when no `OPENSKETCH_PASSWORD` is set | the old connector address of a password-less server |
| `bridge-release.json` | the Companion release published by the operator | no update offer until published again |
| `uploads/`, `artifacts/` | upload links and files waiting for import; short-lived exports and their links | links in flight fail (they expire within hours) |
| `bridge-files/` | chunked files of commands in flight | nothing: open commands are marked unknown at restart |

Not copied: `*.tmp` (half-written files of atomic writes) and `lost+found`.

Outside the folder, on the new app, as Fly secrets (`flyctl secrets set --stage --app bizomat ...`):

- `OPENSKETCH_PASSWORD`: **the same value as on `cados`**. The owner's server-wide private connector address is
  derived from it; a different value changes that address and the server password people were told.
- `OPENSKETCH_KEY_SECRET`, `OPENSKETCH_MCP_TOKEN`, `OPENSKETCH_ACCESS_CODE`: the same values, if `cados` has them
  (`flyctl secrets list -a cados` shows the names).
- Google sign-in set by environment on `cados` (`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`) becomes
  `CAD_GOOGLE_CLIENT_ID`/`CAD_GOOGLE_CLIENT_SECRET` (work has its own Google client).

## Order

Freeze writes, copy, verify checksums, then switch DNS. Until step 7 the old app is the live one and a rollback is
`freeze.sh cont`.

0. **Ready.** `bizomat` is deployed and its `cad` Machine runs with an empty `/data/cad`; the secrets above are set.
   Lower the TTL of the `cados.kevos.com` DNS record a day before (Cloudflare: 60 s). Tell users of a short pause.

1. **New Machine into maintenance** (the cad service stops; the Machine stays up for `fly ssh`):

   ```bash
   fly ssh console -a bizomat -g cad -C "touch /data/.bizomat-maintenance"
   fly machines list -a bizomat                      # note the cad Machine id
   fly machine restart <cad-machine-id> -a bizomat --skip-health-checks
   ```

2. **Keep the old Machine awake, copy the scripts there** (it auto-suspends when idle; `update` restarts it once):

   ```bash
   fly machines list -a cados                        # note the Machine id
   fly machine update <cados-machine-id> -a cados --autostop=off --yes
   fly ssh sftp put infrastructure/migrate/cad/freeze.sh /tmp/bizomat-freeze.sh -a cados
   fly ssh sftp put infrastructure/migrate/cad/export.sh /tmp/bizomat-export.sh -a cados
   ```

3. **Freeze writes** on the old app (requests wait and time out from here):

   ```bash
   fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh stop"
   fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh status"   # all Python processes stopped
   ```

4. **Export and check the copy** (read-only on the old Machine):

   ```bash
   fly ssh console -a cados -q -C "bash /tmp/bizomat-export.sh /data" > cados-data.tar 2> cados-export.log
   cat cados-export.log                    # counts, which important files were there, "stream sha256 <hash>"
   sha256sum cados-data.tar                # must equal the stream sha256: the transfer is intact
   bash infrastructure/migrate/cad/verify.sh --archive cados-data.tar --strict
   ```

5. **Upload and import** on the new Machine:

   ```bash
   fly ssh sftp put cados-data.tar /data/incoming/cados-data.tar -a bizomat -g cad -m 0600
   fly ssh console -a bizomat -g cad -C "/usr/local/lib/bizomat/migrate/cad/import.sh /data/incoming/cados-data.tar"
   ```

   It refuses if the service runs or the archive does not match its manifest. If `/data/cad` already holds data
   (an earlier attempt), add `--force`: the data in place moves to `/data/backups/cad-<time>/` first.

6. **Start the new service and check it** (before DNS moves, through the preview cookie):

   ```bash
   fly ssh console -a bizomat -g cad -C "rm /data/.bizomat-maintenance /data/incoming/cados-data.tar"
   fly machine restart <cad-machine-id> -a bizomat
   node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode preview --skip web,work
   ```

   Then by hand: open `https://bizomat.fly.dev/cad/`, sign in as the owner; Admin lists the same people;
   Settings shows the same private connector address as on `https://bizomat.ai/cad`; SOLIDWORKS lists the same
   computers.
   `fly ssh console -a bizomat -g cad -C "bash /usr/local/lib/bizomat/migrate/cad/verify.sh --installed /data/cad"`
   repeats the file checks.

7. **Switch DNS** for `bizomat.ai`, `www.bizomat.ai` and `cados.kevos.com` together (`infrastructure/README.md`, DNS
   cutover): the certificates on `bizomat` first, then the records. The old app keeps no traffic and stays frozen.

8. **Rollback** (any time in the window): `fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh cont"` resumes
   the old server where it stopped; point `cados.kevos.com` back at `cados.fly.dev` and `bizomat.ai` back to its
   logged records (`docs/BIZOMAT-ROLLBACK.md`, section 5). Changes made on the new app
   after the switch stay there (export them the same way to carry them back). When the window ends: remove
   `cados-data.tar` everywhere, then retire the old app.
