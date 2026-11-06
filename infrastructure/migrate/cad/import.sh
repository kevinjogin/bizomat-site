#!/bin/bash
# Import the old CAD Automation data (an archive from export.sh) into /data/cad on the NEW cad Machine.
# Runs as root on that Machine, in maintenance mode, from the image:
#
#   fly ssh console -a bizomat -g cad -C "/usr/local/lib/bizomat/migrate/cad/import.sh /data/incoming/cados-data.tar"
#
# Refuses unless the cad service is stopped; refuses to replace existing data without --force (which first moves
# it to /data/backups/cad-<time>/). Checks every file against the manifest before and after, then checks the
# important files can be read (verify.sh). See README.md for the whole procedure.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

archive="${1:-}"
force="${2:-}"
[ -n "$archive" ] || {
  echo "usage: import.sh <archive.tar> [--force]" >&2
  exit 64
}
if [ -n "$force" ] && [ "$force" != "--force" ]; then
  echo "usage: import.sh <archive.tar> [--force]" >&2
  exit 64
fi
bash "$HERE/../restore.sh" cad "$archive" ${force:+"$force"}
bash "$HERE/verify.sh" --installed "${BIZOMAT_DATA_ROOT:-/data}/cad"
