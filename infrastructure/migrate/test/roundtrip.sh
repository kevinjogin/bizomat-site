#!/bin/bash
# Round trip of the CAD Automation data migration, inside the platform image (CI, and by hand):
#   docker run --rm -v "$PWD/infrastructure/migrate/test:/t:ro" bizomat:local bash /t/roundtrip.sh
# A made-up data folder with every kind of file -> export.sh -> verify.sh -> import.sh into a fresh data root ->
# refusals (second import without --force, a changed file, a link) -> import --force keeps a backup.
# Throwaway values only.
set -euo pipefail
M=/usr/local/lib/bizomat/migrate
work="$(mktemp -d)"
old="$work/old-data"
root="$work/new-root"
mkdir -p "$old/uploads" "$old/artifacts" "$old/bridge-files/c1" "$root"
ok() { printf 'roundtrip: ok  %s\n' "$*"; }
bad() {
  printf 'roundtrip: FAIL %s\n' "$*" >&2
  exit 1
}

python3 - "$old" <<'PY'
import json, os, secrets, sqlite3, sys
d = sys.argv[1]
def write(name, text):
    with open(os.path.join(d, name), "w") as fh:
        fh.write(text)
write("secret.keys", secrets.token_hex(32))
write("ai_keys.secret", secrets.token_hex(32))
write("users.json", json.dumps({"users": [{"id": "u1", "email": "owner@example.invalid", "role": "owner"}], "invites": []}))
write("accounts.enabled", "")
write("sessions.json", json.dumps({"0" * 64: {"user": "u1", "created": 1, "expires": 2}}))
write("mcp_oauth.json", json.dumps({"clients": {"c1": {}}, "grants": {}, "access": {}}))
write("swbridge.json", json.dumps({"keys": {"u1": 1}}))
write("bridge-signing-key.pem", "-----BEGIN PRIVATE KEY-----\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCA=\n-----END PRIVATE KEY-----\n")
write("users.json.123.tmp", "half-written")
write(os.path.join("uploads", "f.json"), "{}")
write(os.path.join("bridge-files", "c1", "x.part"), "chunk")
with open(os.path.join(d, "artifacts", "a.bin"), "wb") as fh:
    fh.write(os.urandom(4096))
con = sqlite3.connect(os.path.join(d, "bridge.sqlite"))
con.execute("CREATE TABLE devices (id TEXT)")
con.execute("CREATE TABLE commands (id TEXT)")
con.execute("INSERT INTO devices VALUES ('d1')")
con.commit()
con.close()
PY

# export: the stream's own checksum matches the file, the archive passes verify.sh --strict
bash "$M/cad/export.sh" "$old" >"$work/cados-data.tar" 2>"$work/export.log"
want="$(sed -n 's/^export: stream sha256 //p' "$work/export.log")"
got="$(sha256sum "$work/cados-data.tar" | cut -d' ' -f1)"
[ -n "$want" ] && [ "$want" = "$got" ] || bad "stream checksum $want != file checksum $got"
ok "export stream checksum"
grep -q 'critical present: bridge-signing-key.pem' "$work/export.log" || bad "EXPORT-INFO lists the key"
bash "$M/cad/verify.sh" --archive "$work/cados-data.tar" --strict 2>"$work/verify.log" || bad "verify --archive"
ok "verify --archive --strict"

# import into a fresh data root (a plain folder here, not a volume)
export BIZOMAT_DATA_ROOT="$root" BIZOMAT_ALLOW_EPHEMERAL=1
bash "$M/cad/import.sh" "$work/cados-data.tar" 2>"$work/import.log" || {
  cat "$work/import.log" >&2
  bad "import"
}
for f in secret.keys ai_keys.secret users.json accounts.enabled sessions.json mcp_oauth.json swbridge.json bridge-signing-key.pem bridge.sqlite uploads/f.json artifacts/a.bin bridge-files/c1/x.part; do
  cmp -s "$old/$f" "$root/cad/$f" || bad "$f differs after import"
done
[ ! -e "$root/cad/users.json.123.tmp" ] || bad "a .tmp file came across"
[ "$(stat -c %U "$root/cad/secret.keys")" = bzcad ] || bad "not owned by bzcad"
[ "$(stat -c %a "$root/cad")" = 700 ] || bad "data folder mode"
ok "import: every file byte for byte, owned by bzcad, no .tmp"

# refusals: existing data without --force, a changed file, a link
if bash "$M/cad/import.sh" "$work/cados-data.tar" 2>/dev/null; then bad "a second import without --force went ahead"; fi
ok "refuses to replace data without --force"
mkdir "$work/t1"
tar -xf "$work/cados-data.tar" -C "$work/t1"
echo tampered >>"$work/t1/data/users.json"
tar -cf "$work/changed.tar" -C "$work/t1" .
if bash "$M/cad/import.sh" "$work/changed.tar" --force 2>/dev/null; then bad "a changed archive was accepted"; fi
cmp -s "$old/users.json" "$root/cad/users.json" || bad "a refused import changed the data"
ok "refuses an archive whose files do not match its manifest"
mkdir "$work/t2"
tar -xf "$work/cados-data.tar" -C "$work/t2"
ln -s /etc/shadow "$work/t2/data/evil"
tar -cf "$work/link.tar" -C "$work/t2" .
if bash "$M/cad/import.sh" "$work/link.tar" --force 2>/dev/null; then bad "an archive with a link was accepted"; fi
ok "refuses an archive with a link"

# --force: the data in place is moved to backups first, the role's secret files stay
mkdir -m 0700 "$root/cad/.secrets"
echo kept >"$root/cad/.secrets/OPENSKETCH_ACCESS_CODE"
bash "$M/cad/import.sh" "$work/cados-data.tar" --force 2>/dev/null || bad "import --force"
compgen -G "$root/backups/cad-*" >/dev/null || bad "no backup of the previous data"
[ "$(cat "$root/cad/.secrets/OPENSKETCH_ACCESS_CODE")" = kept ] || bad ".secrets not kept"
ok "import --force keeps a backup and the role's secret files"

# the work archive tools: pack.sh -> restore (apply.sh's core) -> counts
mkdir -p "$work/w/files/a"
python3 -c "import sqlite3,sys; c=sqlite3.connect(sys.argv[1]); c.execute('create table items (id text)'); c.execute(\"insert into items values ('1')\"); c.commit()" "$work/w/db.sqlite"
echo file >"$work/w/files/a/one.txt"
bash "$M/work/pack.sh" "$work/w" "$work/work.tar" 2>/dev/null
bash "$M/work/apply.sh" "$work/work.tar" >"$work/apply.out" 2>/dev/null || bad "work apply"
grep -q '^counts: items 1$' "$work/apply.out" || bad "work counts"
cmp -s "$work/w/files/a/one.txt" "$root/work/files/a/one.txt" || bad "work file differs"
[ "$(stat -c %U "$root/work/db.sqlite")" = bzwork ] || bad "work data not owned by bzwork"
ok "work: pack, apply, counts"

rm -rf "$work"
echo "roundtrip: all checks passed"
