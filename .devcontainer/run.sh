#!/usr/bin/env bash
# Keeps OpenSketch running in the codespace and up to date with GitHub.
#
# Every OPENSKETCH_UPDATE_SECONDS (default 60) it fetches origin/main. When there is something new it
# fast-forwards, reinstalls the Python package if pyproject.toml changed, and restarts the server, so a
# push to main reaches the open codespace within about a minute. The browser tab notices the new
# version (/api/version) and offers to reload. It also restarts the server if it ever stops.
#
# It never throws work away: if files in the codespace were edited (tracked changes) or the branch has
# its own commits, it does not update and says so in the browser instead.
# OPENSKETCH_AUTO_UPDATE=0 turns updating off (the server is still kept running).

cd "$(dirname "$0")/.." || exit 1
SELF="$(pwd)/.devcontainer/run.sh"
PORT="${OPENSKETCH_PORT:-8000}"
EVERY="${OPENSKETCH_UPDATE_SECONDS:-60}"
NOTE="${OPENSKETCH_UPDATE_NOTE:-$HOME/.opensketch-update-note}"
PY="${OPENSKETCH_PYTHON:-python}"
LOG() { echo "[opensketch $(date +%H:%M:%S)] $*"; }
note() { [ "$(cat "$NOTE" 2>/dev/null)" = "$1" ] && return; printf '%s\n' "$1" > "$NOTE"; LOG "$1"; }

server_pid=""
start_server() {
  "$PY" -m opensketch --host 0.0.0.0 --port "$PORT" --no-browser &
  server_pid=$!
  LOG "server started (pid $server_pid) at $(git rev-parse --short HEAD 2>/dev/null)"
}
stop_server() {
  [ -n "$server_pid" ] || return
  kill "$server_pid" 2>/dev/null
  for _ in $(seq 1 50); do kill -0 "$server_pid" 2>/dev/null || break; sleep 0.1; done
  kill -9 "$server_pid" 2>/dev/null
  wait "$server_pid" 2>/dev/null
  server_pid=""
}
trap 'stop_server; exit 0' INT TERM

update() {
  [ "${OPENSKETCH_AUTO_UPDATE:-1}" = "0" ] && return 1
  git fetch -q origin main 2>/dev/null || return 1  # offline or no access: try again later
  local head new
  head=$(git rev-parse HEAD) new=$(git rev-parse origin/main) || return 1
  [ "$head" = "$new" ] && return 1
  if ! git merge-base --is-ancestor HEAD origin/main; then
    note "Not updated: this codespace has its own commits. Push them, or create a new codespace."
    return 1
  fi
  if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    note "Not updated: files in this codespace were edited. Commit or discard the edits to get updates."
    return 1
  fi
  local changed
  changed=$(git diff --name-only HEAD origin/main)
  git merge -q --ff-only origin/main || { note "Not updated: git could not fast-forward."; return 1; }
  rm -f "$NOTE"
  LOG "updated $(git rev-parse --short "$head") -> $(git rev-parse --short HEAD)"
  if grep -qx 'pyproject.toml' <<<"$changed"; then
    LOG "pyproject.toml changed: reinstalling"
    "$PY" -m pip install --no-cache-dir -q -e ".[ai,dev]" || note "Updated, but installing the new requirements failed. See the terminal."
  fi
  grep -qx '.devcontainer/run.sh' <<<"$changed" && RESTART_SELF=1
  if grep -Eq '^\.devcontainer/(devcontainer\.json|setup\.sh)$' <<<"$changed"; then
    note "Updated. This update changes the codespace setup: rebuild it once (Command Palette > Codespaces: Rebuild Container)."
  fi
  return 0
}

# Everything runs from main(), so bash has read the whole file before an update can replace it.
main() {
  RESTART_SELF=0
  start_server
  while true; do
    sleep "$EVERY"
    if update; then
      stop_server
      if [ "$RESTART_SELF" = "1" ]; then LOG "run.sh changed: restarting it"; exec bash "$SELF"; fi
      start_server
    elif ! kill -0 "$server_pid" 2>/dev/null; then
      LOG "server stopped: restarting"
      start_server
    fi
  done
}
main; exit
