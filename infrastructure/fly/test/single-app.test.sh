#!/bin/bash
# Tests for the single application (docs/BIZOMAT-SINGLE-APP.md), without Docker or Fly:
#   1. adopt-cados-volume.sh: the old cados layout moves into cad/ byte for byte, a re-run changes nothing, an
#      interrupted run is finished, a volume with both layouts is refused, --check reports, --undo puts it back.
#   2. bizomat-entrypoint all: starts the four roles (each as `bizomat-entrypoint <role>` with its own process group),
#      starts a role again when it stops, and stops every role on SIGTERM.
# Run as root (the entrypoint refuses otherwise): bash infrastructure/fly/test/single-app.test.sh
# shellcheck disable=SC2015,SC2329 # `check && ok || bad` is the test idiom (bad exits); cleanup runs from the trap
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADOPT="$HERE/../adopt-cados-volume.sh"
ENTRY="$HERE/../entrypoint.sh"
tmp="$(mktemp -d)"
sup=""
cleanup() {
  set +e
  [ -n "$sup" ] && kill -TERM "$sup" 2>/dev/null
  pkill -f "$tmp/stub-entrypoint" 2>/dev/null
  rm -rf "$tmp"
  return 0
}
trap cleanup EXIT
pass=0
ok() { pass=$((pass + 1)); printf 'ok %d - %s\n' "$pass" "$1"; }
bad() {
  printf 'not ok - %s\n' "$1"
  exit 1
}
digest() { (cd "$1" && find . -type f -print0 | LC_ALL=C sort -z | xargs -0 -r sha256sum) | sha256sum | cut -d' ' -f1; }

# the old cados layout: CAD Automation's data folder at the volume's root
legacy() {
  local d="$1"
  mkdir -p "$d/uploads" "$d/artifacts/x" "$d/downloads" "$d/lost+found"
  echo '{"users":[]}' >"$d/users.json"
  head -c 4096 /dev/urandom >"$d/bridge.sqlite"
  echo 'PRIVATE KEY (test fixture)' >"$d/bridge-signing-key.pem"
  echo 'k' >"$d/secret.keys"
  echo 'release' >"$d/bridge-release.json"
  echo 'u' >"$d/uploads/a.step"
  echo 'e' >"$d/artifacts/x/b.pdf"
  echo 'h' >"$d/.hidden"
  touch "$d/accounts.enabled"
}

# ---------------------------------------------------------------- 1. adoption
v="$tmp/vol1"
legacy "$v"
before="$(cd "$v" && find . -path ./lost+found -prune -o -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum)"
[ "$(BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" --check)" = "old cados layout: CAD data at the root of $v (10 entries)" ] && ok "--check sees the old layout" || bad "--check old layout"
BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" 2>/dev/null
[ -f "$v/cad/users.json" ] && [ -f "$v/cad/bridge-signing-key.pem" ] && [ -f "$v/cad/.hidden" ] && [ -d "$v/lost+found" ] && ok "CAD data moved into cad/, lost+found left alone" || bad "moved"
[ ! -e "$v/users.json" ] && [ ! -e "$v/cad.adopting" ] && ok "nothing left at the root, no staging folder" || bad "root clean"
after="$(cd "$v/cad" && find . -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum)"
[ "$before" = "$after" ] && ok "every file is byte for byte the same, with the same relative path" || bad "digest"
grep -q '^files: 9$' "$v/ADOPTED-CADOS-LAYOUT.txt" && ok "the record counts the files" || bad "record"
d1="$(digest "$v")"
BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" 2>/dev/null
[ "$(digest "$v")" = "$d1" ] && ok "a second run changes nothing" || bad "idempotent"
[ "$(BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" --check)" = "single-app layout: CAD data in $v/cad" ] && ok "--check sees the new layout" || bad "--check new"

# undo
BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" --undo 2>/dev/null
undone="$(cd "$v" && find . -path ./lost+found -prune -o -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum)"
[ "$undone" = "$before" ] && [ ! -e "$v/cad" ] && [ ! -e "$v/ADOPTED-CADOS-LAYOUT.txt" ] && ok "--undo puts every file back at the root" || bad "undo"

# an interrupted run (two entries already in the staging folder) is finished by the next one
v="$tmp/vol2"
legacy "$v"
before="$(cd "$v" && find . -path ./lost+found -prune -o -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum)"
mkdir -m 0700 "$v/cad.adopting"
files="$(find "$v" -path "$v/lost+found" -prune -o -type f -print | wc -l)"
bytes="$(find "$v" -path "$v/lost+found" -prune -o -type f -printf '%s\n' | awk '{s += $1} END {print s}')"
echo "$files $bytes" >"$v/cad.adopting/.adopt-expected"
mv "$v/users.json" "$v/uploads" "$v/cad.adopting/"
[ "$(BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" --check)" = "adoption interrupted: $v/cad.adopting exists (the next start finishes it)" ] && ok "--check sees an interrupted run" || bad "--check interrupted"
BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" 2>/dev/null
after="$(cd "$v/cad" && find . -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum)"
[ "$before" = "$after" ] && [ ! -e "$v/cad.adopting" ] && ok "an interrupted adoption is finished, byte for byte" || bad "resume"

# both layouts at once: refused, nothing moved
v="$tmp/vol3"
legacy "$v"
mkdir -p "$v/cad"
echo '{"users":[1]}' >"$v/cad/users.json"
d1="$(digest "$v")"
if BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" 2>/dev/null; then bad "both layouts accepted"; fi
[ "$(digest "$v")" = "$d1" ] && ok "a volume with CAD data in both places is refused and left untouched" || bad "both untouched"

# an empty cad/ (made by an earlier start of the platform image) is replaced; a non-empty one without data is refused
v="$tmp/vol4"
legacy "$v"
mkdir -p "$v/cad"
BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" 2>/dev/null
[ -f "$v/cad/users.json" ] && ok "an empty cad/ folder does not block the adoption" || bad "empty cad"
v="$tmp/vol5"
legacy "$v"
mkdir -p "$v/cad"
echo x >"$v/cad/stray"
d1="$(digest "$v")"
if BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" 2>/dev/null; then bad "stray cad accepted"; fi
[ "$(digest "$v")" = "$d1" ] && ok "a cad/ folder with other files is refused and left untouched" || bad "stray untouched"

# a new volume, or one with Project Management only: nothing to do
v="$tmp/vol6"
mkdir -p "$v/work"
echo db >"$v/work/db.sqlite"
d1="$(digest "$v")"
BIZOMAT_DATA_ROOT="$v" bash "$ADOPT" 2>/dev/null
[ "$(digest "$v")" = "$d1" ] && [ ! -e "$v/cad" ] && ok "a volume without old CAD data is left alone" || bad "no-op"

# ---------------------------------------------------------------- 2. the supervisor
[ "$(id -u)" = 0 ] || {
  echo "# skipping the supervisor tests: not root"
  echo "1..$pass"
  exit 0
}
log="$tmp/roles.log"
stub="$tmp/stub-entrypoint"
cat >"$stub" <<EOF
#!/bin/bash
# stands in for bizomat-entrypoint <role>: records the role and its process group, then runs until stopped
echo "\$1 \$FLY_PROCESS_GROUP \${CAD_GOOGLE_CLIENT_ID:-none} \${GOOGLE_CLIENT_ID:-none}" >>"$log"
trap 'echo "stop \$1" >>"$log"; exit 0' TERM
if [ "\$1" = web ] && [ ! -e "$tmp/web-crashed" ]; then touch "$tmp/web-crashed"; sleep 0.3; exit 3; fi
while :; do sleep 0.1; done
EOF
chmod +x "$stub"
FLY_PROCESS_GROUP=all BIZOMAT_ENTRYPOINT="$stub" BIZOMAT_ADOPT_CADOS_VOLUME=0 GOOGLE_CLIENT_ID=cados-google \
  BIZOMAT_ROLES="cad work web proxy" bash "$ENTRY" all >/dev/null 2>"$tmp/all.err" &
sup=$!
for _ in $(seq 1 60); do
  n="$(grep -c '^web ' "$log" 2>/dev/null || true)"
  [ "${n:-0}" -ge 2 ] && break
  sleep 0.1
done
for r in cad work web proxy; do grep -q "^$r $r " "$log" || bad "$r started with its own process group"; done
ok "all starts cad, work, web and proxy, each in its own process group"
grep -q '^cad cad cados-google none$' "$log" && ok "the cados app's GOOGLE_CLIENT_ID reaches cad as CAD_GOOGLE_CLIENT_ID only" || bad "google map"
grep -q '^work work none none$' "$log" && ok "no other role receives it" || bad "google isolation"
[ "$(grep -c '^web ' "$log")" -ge 2 ] && grep -q 'all: web stopped (exit 3); starting it again in 2s' "$tmp/all.err" && ok "a role that stops is started again" || bad "restart"
kill -TERM "$sup"
for _ in $(seq 1 50); do kill -0 "$sup" 2>/dev/null || break; sleep 0.1; done
kill -0 "$sup" 2>/dev/null && bad "the supervisor did not stop"
sup=""
for r in cad work web proxy; do grep -q "^stop $r$" "$log" || bad "$r stopped on SIGTERM"; done
ok "SIGTERM stops every role and the supervisor"
# a single-role Machine still refuses another group's role, and all refuses a foreign process group
if FLY_PROCESS_GROUP=web bash "$ENTRY" cad 2>/dev/null; then bad "cad ran in the web group"; fi
if FLY_PROCESS_GROUP=web bash "$ENTRY" all 2>/dev/null; then bad "all ran in the web group"; fi
ok "process-group guards still hold"
# the default role list is the single 1 GB application's: cad, work and the proxy (no web process)
: >"$log"
touch "$log"
FLY_PROCESS_GROUP=app BIZOMAT_ENTRYPOINT="$stub" BIZOMAT_ADOPT_CADOS_VOLUME=0 bash "$ENTRY" all >/dev/null 2>/dev/null &
sup=$!
for _ in $(seq 1 50); do [ "$(wc -l <"$log")" -ge 3 ] && break; sleep 0.1; done
sleep 0.5
[ "$(cut -d' ' -f1 "$log" | sort | tr '\n' ' ')" = "cad proxy work " ] && ok "by default all runs cad, work and proxy only" || bad "default roles: $(cat "$log")"
kill -TERM "$sup"; wait "$sup" 2>/dev/null || true; sup=""
if BIZOMAT_ROLES="cad mail" BIZOMAT_ADOPT_CADOS_VOLUME=0 bash "$ENTRY" all 2>/dev/null; then bad "unknown role accepted"; fi
ok "an unknown role in BIZOMAT_ROLES is refused"
echo "1..$pass"
exit 0
