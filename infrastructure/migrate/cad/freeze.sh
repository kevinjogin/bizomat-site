#!/bin/bash
# Freeze (or thaw) the CAD server on the OLD `cados` Machine, so no file changes while it is copied.
#
#   fly ssh sftp put infrastructure/migrate/cad/freeze.sh /tmp/bizomat-freeze.sh -a cados
#   fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh stop"     # before export.sh
#   fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh status"
#   fly ssh console -a cados -C "bash /tmp/bizomat-freeze.sh cont"     # rollback: the old server carries on
#
# "stop" sends SIGSTOP to every Python process (the supervisor, the server and its CAD workers): they keep
# their memory and open files but run nothing, so the data folder is still while it is copied, and SQLite's WAL
# and journal files are copied in a consistent state. Requests to the old app wait (and time out) meanwhile.
# "cont" resumes them exactly where they were (the supervisor notices the pause and carries on).
# The image has no procps, so processes are found through /proc.
set -euo pipefail

action="${1:-status}"
pids() {
  local p pid exe
  for p in /proc/[0-9]*; do
    pid="${p#/proc/}"
    [ "$pid" = "$$" ] && continue
    exe="$(readlink "$p/exe" 2>/dev/null)" || continue
    case "$exe" in */python3* | */python) echo "$pid" ;; esac
  done
}
state() { awk '{print $3}' "/proc/$1/stat" 2>/dev/null || echo "?"; }

mapfile -t list < <(pids)
if [ "${#list[@]}" -eq 0 ]; then
  echo "freeze: no Python processes found (is this the cados Machine?)" >&2
  exit 1
fi
case "$action" in
  stop)
    kill -STOP "${list[@]}"
    sleep 1
    ;;
  cont)
    kill -CONT "${list[@]}"
    sleep 1
    ;;
  status) ;;
  *)
    echo "usage: freeze.sh stop|cont|status" >&2
    exit 64
    ;;
esac
stopped=0
for pid in "${list[@]}"; do [ "$(state "$pid")" = T ] && stopped=$((stopped + 1)); done
echo "freeze: ${#list[@]} Python processes, $stopped stopped"
