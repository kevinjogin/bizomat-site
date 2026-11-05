#!/bin/bash
# Pack a Project Management data folder (db.sqlite, files/ ...) into a restore archive for restore.sh.
# Used by .github/workflows/bizomat-migrate-work.yml on the runner; works on any Linux with GNU tar.
#
#   bash pack.sh <folder> <archive.tar>
#
# The archive holds MANIFEST.sha256 ("sha256  data/<path>" for every file), EXPORT-INFO (counts) and data/.
# Prints counts only.
set -euo pipefail

src="${1:-}"
out="${2:-}"
say() { printf 'pack: %s\n' "$*" >&2; }
die() {
  say "$*"
  exit 1
}
[ -n "$src" ] && [ -n "$out" ] || die "usage: pack.sh <folder> <archive.tar>"
[ -f "$src/db.sqlite" ] || die "$src/db.sqlite is missing"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
(cd "$src" && find . -type f ! -name '*.tmp' -print0 | LC_ALL=C sort -z) >"$tmp/files"
count="$(tr -cd '\0' <"$tmp/files" | wc -c | tr -d ' ')"
(cd "$src" && xargs -0 -r sha256sum -- <"$tmp/files") | sed 's#  \./#  data/#' >"$tmp/MANIFEST.sha256"
bytes="$(cd "$src" && xargs -0 -r stat -c %s -- <"$tmp/files" | awk '{s += $1} END {print s + 0}')"
{
  echo "source: Project Management migration (D1 + R2 export)"
  echo "made: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "files: $count"
  echo "bytes: $bytes"
} >"$tmp/EXPORT-INFO"
tar --create --file="$out" --format=gnu --numeric-owner --owner=0 --group=0 \
  -C "$tmp" MANIFEST.sha256 EXPORT-INFO \
  -C "$src" --transform='s,^\./,data/,' --null --files-from="$tmp/files"
say "packed $count files, $bytes bytes"
