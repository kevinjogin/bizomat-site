#!/bin/bash
# Prove the secret isolation of the entrypoint on the running local stack (compose.yml): every service gets the
# same environment, secrets included, as on Fly; each service process must hold only its own role's settings,
# run as its own user with no capabilities and no-new-privs, and be unable to read PID 1's environment.
# Prints variable NAMES only, never values.
#
#   bash infrastructure/local/check-isolation.sh [--stub web,work]
# (COMPOSE_PROJECT_NAME selects another project, as for docker compose itself.)
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
files=(-f "$HERE/compose.yml")
stubs=""
if [ "${1:-}" = "--stub" ]; then
  stubs=",${2:-},"
  files+=(-f "$HERE/compose.stubs.yml")
fi
dc() { docker compose "${files[@]}" "$@"; }

# role -> the start of the service's command line, its uid, names it must have, names it must NOT have
declare -A MATCH=(
  [proxy]="/usr/local/bin/node /app/proxy/server.mjs"
  [web]="/usr/local/bin/node /app/web/dist-server/server.mjs"
  [work]="/usr/local/bin/node /app/work/dist/node/server.mjs"
  [cad]="/opt/cad/venv/bin/python -m opensketch"
)
declare -A UIDS=([proxy]=10001 [web]=10002 [work]=10003 [cad]=10004)
declare -A MUST=(
  [proxy]="UPSTREAM_WEB UPSTREAM_CAD HOME PATH"
  [web]="PORT HOST WEB_DIST_DIR WEB_TRUST_PROXY CF_AI_TOKEN"
  [work]="PORT HOST WORK_DATA_DIR WORK_STATIC_DIR APP_URL APP_NAME GOOGLE_CLIENT_SECRET"
  [cad]="OPENSKETCH_DATA OPENSKETCH_KEY_SECRET OPENSKETCH_PUBLIC_URL GOOGLE_CLIENT_SECRET"
)
declare -A MUST_NOT=(
  [proxy]="OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET CF_AI_TOKEN"
  [web]="OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET UPSTREAM_CAD"
  [work]="OPENSKETCH_KEY_SECRET CAD_GOOGLE_CLIENT_SECRET CF_AI_TOKEN UPSTREAM_CAD"
  [cad]="WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET CF_AI_TOKEN UPSTREAM_CAD WORK_APP_URL"
)

fail=0
for role in proxy web work cad; do
  if [[ $stubs == *",$role,"* ]]; then
    echo "SKIP  $role: a stand-in, not started by the entrypoint"
    continue
  fi
  # as the role's own user (only it, or root with CAP_SYS_PTRACE, may read the service's environment): find the
  # service process, list its variable names and its credentials (the script runs inside the container: its
  # expressions are meant to expand there, not here)
  # shellcheck disable=SC2016
  report="$(dc exec -T -u "${UIDS[$role]}" "$role" bash -c '
    want="$1"
    for p in /proc/[0-9]*; do
      [ "${p#/proc/}" = "$$" ] && continue
      cmd="$(tr "\0" " " < "$p/cmdline" 2>/dev/null)" || continue
      case "$cmd" in "$want"*) pid="${p#/proc/}"; break ;; esac
    done
    [ -n "${pid:-}" ] || { echo "nopid"; exit 0; }
    echo "uid $(awk "/^Uid:/ {print \$2}" /proc/$pid/status)"
    echo "nnp $(awk "/^NoNewPrivs:/ {print \$2}" /proc/$pid/status)"
    echo "capeff $(awk "/^CapEff:/ {print \$2}" /proc/$pid/status)"
    echo "capbnd $(awk "/^CapBnd:/ {print \$2}" /proc/$pid/status)"
    tr "\0" "\n" < /proc/$pid/environ | cut -d= -f1 | sed "s/^/env /"
  ' _ "${MATCH[$role]}")"
  if grep -q '^nopid' <<<"$report"; then
    echo "FAIL  $role: service process not found"
    fail=1
    continue
  fi
  names="$(sed -n 's/^env //p' <<<"$report" | sort | tr '\n' ' ')"
  problems=()
  [ "$(sed -n 's/^uid //p' <<<"$report")" = "${UIDS[$role]}" ] || problems+=("runs as uid $(sed -n 's/^uid //p' <<<"$report")")
  [ "$(sed -n 's/^nnp //p' <<<"$report")" = 1 ] || problems+=("no-new-privs is off")
  [ "$(sed -n 's/^capeff //p' <<<"$report")" = 0000000000000000 ] || problems+=("has capabilities")
  [ "$(sed -n 's/^capbnd //p' <<<"$report")" = 0000000000000000 ] || problems+=("capability bounding set not empty")
  for n in ${MUST[$role]}; do [[ " $names" == *" $n "* ]] || problems+=("missing $n"); done
  for n in ${MUST_NOT[$role]}; do [[ " $names" == *" $n "* ]] && problems+=("holds $n"); done
  # as the role's user: PID 1 (docker-init here, Fly's init on Fly) keeps the full environment and must stay unreadable
  if dc exec -T -u "${UIDS[$role]}" "$role" cat /proc/1/environ >/dev/null 2>&1; then problems+=("can read /proc/1/environ"); fi
  if [ "${#problems[@]}" -eq 0 ]; then
    echo "PASS  $role: $(wc -w <<<"$names" | tr -d ' ') settings, uid ${UIDS[$role]}, no capabilities, no-new-privs, /proc/1/environ unreadable"
  else
    echo "FAIL  $role: ${problems[*]}"
    fail=1
  fi
done
exit "$fail"
