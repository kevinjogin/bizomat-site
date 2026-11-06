#!/bin/bash
# Export the CAD Automation data folder from the OLD `cados` Machine, as one tar stream on stdout.
# Read-only: it changes nothing in the data folder (run cad/freeze.sh first so nothing changes during the copy).
#
#   fly ssh sftp put infrastructure/migrate/cad/export.sh /tmp/bizomat-export.sh -a cados
#   fly ssh console -a cados -q -C "bash /tmp/bizomat-export.sh /data" > cados-data.tar 2> cados-export.log
#
# The stream holds:
#   MANIFEST.sha256   one "sha256  data/<path>" line per file (checked by import.sh and verify.sh)
#   EXPORT-INFO       counts, time and which of the important files were present (no contents)
#   data/...          every file of the data folder except lost+found and the *.tmp files of atomic writes
# The last line on stderr is the SHA-256 of the whole stream: compare it with `sha256sum cados-data.tar` locally.
# Nothing secret is printed: names and counts only.
set -euo pipefail

DATA="${1:-/data}"
say() { printf 'export: %s\n' "$*" >&2; }
die() {
  say "$*"
  exit 1
}

[ -t 1 ] && die "stdout is a terminal: redirect it to a file (... > cados-data.tar)"
[ -d "$DATA" ] || die "$DATA is not a directory"
command -v sha256sum >/dev/null || die "sha256sum is missing"
command -v tar >/dev/null || die "tar is missing"

# The files whose loss changes what people and computers see (the README says what each one is).
CRITICAL=(secret.keys users.json accounts.enabled sessions.json mcp_oauth.json bridge-signing-key.pem bridge.sqlite swbridge.json)
OPTIONAL=(secret ai_keys.secret google_oauth.json bridge-release.json)

tmp="$(mktemp -d /tmp/bizomat-export.XXXXXX)"
trap 'rm -rf "$tmp"' EXIT

cd "$DATA"
find . -xdev \( -path ./lost+found -o -path ./incoming -o -path ./backups \) -prune -o \
  -type f ! -name '*.tmp' -print0 | LC_ALL=C sort -z >"$tmp/files"
count="$(tr -cd '\0' <"$tmp/files" | wc -c | tr -d ' ')"
[ "$count" -gt 0 ] || die "no files in $DATA"
xargs -0 -r sha256sum -- <"$tmp/files" | sed 's#  \./#  data/#' >"$tmp/MANIFEST.sha256"
[ "$(wc -l <"$tmp/MANIFEST.sha256" | tr -d ' ')" = "$count" ] || die "could not checksum every file"
bytes="$(xargs -0 -r stat -c %s -- <"$tmp/files" | awk '{s += $1} END {print s + 0}')"

{
  echo "source: $DATA on ${FLY_APP_NAME:-unknown app} (machine ${FLY_MACHINE_ID:-unknown})"
  echo "made: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "files: $count"
  echo "bytes: $bytes"
  for f in "${CRITICAL[@]}"; do
    if [ -f "$f" ]; then echo "critical present: $f"; else echo "critical MISSING: $f"; fi
  done
  for f in "${OPTIONAL[@]}"; do
    if [ -f "$f" ]; then echo "optional present: $f"; fi
  done
  for d in uploads artifacts bridge-files; do
    if [ -d "$d" ]; then echo "folder $d: $(find "$d" -type f | wc -l | tr -d ' ') files"; fi
  done
} >"$tmp/EXPORT-INFO"
sed 's/^/  /' "$tmp/EXPORT-INFO" >&2

# one stream: the manifest and info first, then the data; its SHA-256 goes to stderr
{
  tar --create --file=- --format=gnu --numeric-owner \
    -C "$tmp" MANIFEST.sha256 EXPORT-INFO \
    -C "$DATA" --transform='s,^\./,data/,' --null --files-from="$tmp/files" |
    tee /dev/fd/3 | sha256sum | awk '{print "export: stream sha256 " $1}' >&2
} 3>&1
say "done: $count files, $bytes bytes"
