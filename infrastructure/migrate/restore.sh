#!/bin/bash
# Put a data archive in place of a role's data folder, on that role's own Machine (run as root through
# `fly ssh console`). Used by cad/import.sh and by the work migration workflow.
#
#   restore.sh <cad|work> <archive.tar> [--force]
#
# The archive (cad/export.sh or work/pack.sh) holds MANIFEST.sha256 and data/... . Steps:
#   1. refuse unless the role's service is stopped (maintenance mode: /data/.bizomat-maintenance, then restart);
#   2. check the archive's layout (no links, no paths outside data/), unpack it on the same volume, and check
#      every file against the manifest (and that nothing unlisted came with it);
#   3. if /data/<role> already holds data: only with --force, and it is first moved (not copied, not deleted) to
#      /data/backups/<role>-<time>/;
#   4. move the new data in, keep the role's /data/<role>/.secrets, give everything to the role's user;
#   5. check the files in place against the manifest again, and keep the manifest under /data/backups/.
# Prints counts and file names, never file contents. Leaves maintenance mode on: remove the flag and restart.
set -euo pipefail
umask 077

say() { printf 'restore: %s\n' "$*" >&2; }
die() {
  say "$*"
  exit 1
}

ROLE="${1:-}"
ARCHIVE="${2:-}"
FORCE=0
[ "${3:-}" = "--force" ] && FORCE=1
case "$ROLE" in
  cad) RUN_USER=bzcad ;;
  work) RUN_USER=bzwork ;;
  *) die "usage: restore.sh <cad|work> <archive.tar> [--force]" ;;
esac
[ -n "$ARCHIVE" ] && [ -f "$ARCHIVE" ] || die "no archive at '$ARCHIVE' (upload it first: fly ssh sftp put ...)"
[ "$(id -u)" = 0 ] || die "run as root (fly ssh console runs as root)"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA="${BIZOMAT_DATA_ROOT:-/data}"
TARGET="$DATA/$ROLE"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
STAGE="$DATA/.restore-$ROLE-$STAMP"
BACKUPS="$DATA/backups"

if ! mountpoint -q "$DATA" && [ "${BIZOMAT_ALLOW_EPHEMERAL:-}" != 1 ]; then
  die "$DATA is not a mounted volume"
fi

# 1. the service must not be running (it caches keys and holds SQLite files open)
service_running() {
  local p cmd
  for p in /proc/[0-9]*; do
    [ "${p#/proc/}" = "$$" ] && continue
    cmd="$(tr '\0' ' ' <"$p/cmdline" 2>/dev/null)" || continue
    case "$ROLE:$cmd" in
      cad:*"-m opensketch"* | cad:*multiprocessing* | work:*"/app/work/dist/node/server.mjs"*) return 0 ;;
    esac
  done
  return 1
}
if service_running; then
  die "the $ROLE service is running. Put the Machine in maintenance first: touch $DATA/.bizomat-maintenance, then restart it (fly machine restart)."
fi

MANIFEST_PY="$HERE/lib/manifest.py"

# 2. unpack on the same volume (so step 4 is a rename) and check
mkdir -m 0700 "$STAGE"
trap 'rm -rf "$STAGE"' EXIT
say "checking and unpacking $(basename "$ARCHIVE")"
counts="$(python3 "$HERE/lib/safe_tar.py" extract "$ARCHIVE" "$STAGE")" || die "the archive was refused"
say "archive: $counts"
[ -d "$STAGE/data" ] || die "the archive has no data/ folder"
python3 "$MANIFEST_PY" check "$STAGE" >&2 ||
  die "the files do not match the manifest (damaged, incomplete or extra files); nothing was changed"

# 3. keep what is there now
mkdir -p "$BACKUPS"
chmod 0700 "$BACKUPS"
if [ -d "$TARGET" ] && [ -n "$(find "$TARGET" -mindepth 1 -maxdepth 1 ! -name .secrets -print -quit)" ]; then
  [ "$FORCE" = 1 ] || die "$TARGET already holds data. Run again with --force to move it to $BACKUPS/$ROLE-$STAMP first."
  mv "$TARGET" "$BACKUPS/$ROLE-$STAMP"
  say "previous data moved to $BACKUPS/$ROLE-$STAMP"
elif [ -d "$TARGET" ]; then
  mv "$TARGET" "$BACKUPS/$ROLE-$STAMP-empty"
fi

# 4. move the new data in, keep the role's secret files
mv "$STAGE/data" "$TARGET"
for old in "$BACKUPS/$ROLE-$STAMP" "$BACKUPS/$ROLE-$STAMP-empty"; do
  if [ -d "$old/.secrets" ] && [ ! -e "$TARGET/.secrets" ]; then
    mv "$old/.secrets" "$TARGET/.secrets"
    say "kept $TARGET/.secrets"
  fi
done
rmdir "$BACKUPS/$ROLE-$STAMP-empty" 2>/dev/null || true
uid="$(id -u "$RUN_USER")"
gid="$(id -g "$RUN_USER")"
find "$TARGET" -path "$TARGET/.secrets" -prune -o -exec chown -h "$uid:$gid" {} +
find "$TARGET" -path "$TARGET/.secrets" -prune -o ! -type l -exec chmod go-rwx {} +
chmod 0700 "$TARGET"

# 5. check again in place, keep the manifest for later checks (verify.sh --installed)
mkdir -p "$BACKUPS/import-$ROLE-$STAMP"
cp "$STAGE/MANIFEST.sha256" "$BACKUPS/import-$ROLE-$STAMP/"
[ -f "$STAGE/EXPORT-INFO" ] && cp "$STAGE/EXPORT-INFO" "$BACKUPS/import-$ROLE-$STAMP/"
python3 "$MANIFEST_PY" check "$DATA" --manifest "$BACKUPS/import-$ROLE-$STAMP/MANIFEST.sha256" --rename "data/=$ROLE/" >&2 ||
  die "files in $TARGET do not match the manifest after the move"
say "restored $(wc -l <"$BACKUPS/import-$ROLE-$STAMP/MANIFEST.sha256") files into $TARGET (manifest kept in $BACKUPS/import-$ROLE-$STAMP)"
say "maintenance mode is still on: rm $DATA/.bizomat-maintenance, then restart the Machine"
