#!/bin/bash
# Put a Project Management restore archive (work/pack.sh) in place on the work Machine, in maintenance mode.
# Runs as root from the image; the migration workflow calls it through fly ssh console:
#
#   fly ssh console -a bizomat -g work -C "/usr/local/lib/bizomat/migrate/work/apply.sh /data/incoming/work-<time>.tar"
#
# What is in /data/work now is moved to /data/backups/work-<time>/ first (never deleted), the archive is checked
# against its manifest before and after, db.sqlite passes SQLite's integrity check, and the row count of each
# table is printed (counts only, never rows).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
archive="${1:-}"
[ -n "$archive" ] || {
  echo "usage: apply.sh <archive.tar>" >&2
  exit 64
}
bash "$HERE/../restore.sh" work "$archive" --force
python3 "$HERE/counts.py" "${BIZOMAT_DATA_ROOT:-/data}/work/db.sqlite"
