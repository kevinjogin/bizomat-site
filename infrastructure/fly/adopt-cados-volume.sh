#!/bin/bash
# One-time adoption of the `cados` Fly app's volume by the single BIZOMAT application (docs/BIZOMAT-SINGLE-APP.md).
#
#   adopt-cados-volume.sh            adopt, if this volume still has the old layout (the entrypoint's `all` role runs it)
#   adopt-cados-volume.sh --check    say which layout the volume has; change nothing
#   adopt-cados-volume.sh --undo     put the CAD data back at the volume's root (rollback to the old cados image)
#
# The old cados image kept CAD Automation's data folder at the root of its volume (OPENSKETCH_DATA=/data):
# users.json, bridge.sqlite, bridge-signing-key.pem, secret.keys, uploads/, artifacts/, downloads/ ... The single
# application keeps it in /data/cad (and Project Management in /data/work), as the platform image always has.
#
# Safety:
#   - Only renames inside the same volume (mv on one file system): nothing is copied, rewritten or deleted.
#   - The entries go to /data/cad.adopting first, which becomes /data/cad in one rename at the end. A run that is
#     interrupted is finished by the next one (the entrypoint runs this at every start of the `all` role).
#   - It refuses to touch a volume that has CAD data both at the root and in /data/cad.
#   - It counts files and bytes before and after and refuses to finish if they differ.
#   - Take a volume snapshot before the first deploy (the runbook says how); --undo reverses the move.
# Prints names of top-level entries and counts only, never file contents.
set -euo pipefail
umask 077

DATA="${BIZOMAT_DATA_ROOT:-/data}"
CAD="$DATA/cad"
STAGE="$DATA/cad.adopting"
RECORD="$DATA/ADOPTED-CADOS-LAYOUT.txt"
# Entries at the root of the volume that are not the old CAD data folder's.
KEEP=(lost+found cad cad.adopting work incoming backups .bizomat-maintenance ADOPTED-CADOS-LAYOUT.txt)

say() { printf 'adopt-cados-volume: %s\n' "$*" >&2; }
die() {
  say "$*"
  exit 1
}

kept() {
  local x
  for x in "${KEEP[@]}"; do [ "$1" = "$x" ] && return 0; done
  return 1
}

# The old layout's entries at the root of the volume (dot files included), one per line.
legacy_entries() {
  local e name
  for e in "$DATA"/* "$DATA"/.[!.]* "$DATA"/..?*; do
    [ -e "$e" ] || [ -L "$e" ] || continue
    name="${e##*/}"
    kept "$name" || printf '%s\n' "$name"
  done
}

has_cad_data() { [ -e "$1/users.json" ] || [ -e "$1/accounts.enabled" ]; }

# files and bytes under the given paths (no links followed)
measure() {
  local files bytes
  files="$(find "$@" -xdev -type f 2>/dev/null | wc -l | tr -d ' ')"
  bytes="$(find "$@" -xdev -type f -printf '%s\n' 2>/dev/null | awk '{s += $1} END {print s + 0}')"
  printf '%s %s\n' "$files" "$bytes"
}

check() {
  if has_cad_data "$CAD"; then
    echo "single-app layout: CAD data in $CAD"
  elif [ -d "$STAGE" ]; then
    echo "adoption interrupted: $STAGE exists (the next start finishes it)"
  elif has_cad_data "$DATA"; then
    echo "old cados layout: CAD data at the root of $DATA ($(legacy_entries | wc -l | tr -d ' ') entries)"
  else
    echo "no CAD data on this volume"
  fi
}

adopt() {
  [ -d "$DATA" ] || die "$DATA does not exist"
  if has_cad_data "$CAD"; then
    if has_cad_data "$DATA"; then
      die "CAD data is both at the root of $DATA and in $CAD. Refusing to guess which is current: inspect with fly ssh console."
    fi
    return 0 # already adopted
  fi
  if [ ! -d "$STAGE" ] && ! has_cad_data "$DATA"; then
    return 0 # a new or Project-Management-only volume: nothing to adopt
  fi
  if [ -e "$CAD" ] || [ -L "$CAD" ]; then
    # an empty folder left by a start of the platform image before adoption (it creates /data/cad): remove it
    if [ -d "$CAD" ] && [ ! -L "$CAD" ] && [ -z "$(ls -A "$CAD")" ]; then
      rmdir "$CAD"
    else
      die "$CAD exists without CAD data but is not an empty folder. Refusing: inspect with fly ssh console."
    fi
  fi

  mapfile -t entries < <(legacy_entries)
  if [ ! -d "$STAGE" ]; then
    [ "${#entries[@]}" -gt 0 ] || die "no entries to move at the root of $DATA"
    read -r files_before bytes_before < <(measure "${entries[@]/#/$DATA/}")
    install -d -o root -g root -m 0700 "$STAGE"
    printf '%s %s\n' "$files_before" "$bytes_before" >"$STAGE/.adopt-expected"
    say "adopting the old cados layout: ${#entries[@]} entries, $files_before files, $bytes_before bytes -> $CAD"
  else
    say "finishing an interrupted adoption (${#entries[@]} entries left at the root)"
  fi
  read -r files_before bytes_before <"$STAGE/.adopt-expected"

  local e
  for e in "${entries[@]}"; do
    [ -e "$STAGE/$e" ] || [ -L "$STAGE/$e" ] && die "$STAGE/$e already exists; refusing to overwrite it"
    mv -- "$DATA/$e" "$STAGE/$e"
  done
  rm -f "$STAGE/.adopt-expected"
  read -r files_after bytes_after < <(measure "$STAGE")
  if [ "$files_after" != "$files_before" ] || [ "$bytes_after" != "$bytes_before" ]; then
    printf '%s %s\n' "$files_before" "$bytes_before" >"$STAGE/.adopt-expected"
    die "counts differ after the move ($files_before files, $bytes_before bytes before; $files_after, $bytes_after after). Left in $STAGE for inspection; nothing was deleted."
  fi
  has_cad_data "$STAGE" || die "$STAGE holds no users.json or accounts.enabled after the move. Left as it is for inspection."
  mv -- "$STAGE" "$CAD"
  {
    echo "CAD data moved from the root of $DATA into $CAD by adopt-cados-volume.sh"
    echo "when: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "files: $files_after"
    echo "bytes: $bytes_after"
    echo "undo: /usr/local/lib/bizomat/adopt-cados-volume.sh --undo (with the old cados image, or in maintenance mode)"
  } >"$RECORD"
  chmod 0600 "$RECORD"
  say "done: $files_after files, $bytes_after bytes now in $CAD"
}

undo() {
  has_cad_data "$CAD" || die "$CAD holds no CAD data; nothing to undo"
  has_cad_data "$DATA" && die "CAD data is already at the root of $DATA; refusing"
  local e name
  for e in "$CAD"/* "$CAD"/.[!.]* "$CAD"/..?*; do
    [ -e "$e" ] || [ -L "$e" ] || continue
    name="${e##*/}"
    if kept "$name" || [ -e "$DATA/$name" ] || [ -L "$DATA/$name" ]; then
      die "$DATA/$name would be overwritten or is reserved; refusing (nothing more was moved)"
    fi
  done
  read -r files bytes < <(measure "$CAD")
  for e in "$CAD"/* "$CAD"/.[!.]* "$CAD"/..?*; do
    [ -e "$e" ] || [ -L "$e" ] || continue
    mv -- "$e" "$DATA/${e##*/}"
  done
  rmdir "$CAD"
  rm -f "$RECORD"
  say "undone: $files files, $bytes bytes back at the root of $DATA (the old cados image reads them there)"
}

case "${1:-}" in
  "") adopt ;;
  --check) check ;;
  --undo) undo ;;
  *) die "usage: adopt-cados-volume.sh [--check|--undo]" ;;
esac
