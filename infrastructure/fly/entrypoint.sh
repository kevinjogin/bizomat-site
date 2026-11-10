#!/bin/bash
# BIZOMAT platform entrypoint: bizomat-entrypoint <proxy|web|work|cad|all>
#
# One image runs four roles; each Fly process group starts it with its role (fly.toml [processes]).
# `all` runs proxy, web and work together on one Machine, each exactly as its own role starts (see "all" below).
# It runs as root only long enough to:
#   1. for work and cad: check that the role's volume is mounted at /data (else refuse to start: the data would
#      be lost when the Machine is replaced; BIZOMAT_ALLOW_EPHEMERAL=1 allows a throwaway run), and give the
#      role's own directory (/data/work, /data/cad) to the role's user;
#   2. build a CLEAN environment holding only the role's own settings. Fly secrets are environment variables of
#      EVERY Machine of the app, so without this the website would hold CAD Automation's secrets. The service
#      never sees the rest: it is started with `env -i` and the allow-list below;
#   3. read the role's secret files, if any: /data/<role>/.secrets/NAME (root-owned directory, mode 0700; each
#      file root-owned, mode 0600) becomes the setting NAME. These live only on the role's own volume, so other
#      Machines never see them: the stronger option for the work and cad secrets;
#   4. exec the service as the role's unprivileged user (bzproxy, bzweb, bzwork, bzcad) with setpriv:
#      no supplementary groups but its own, no capabilities, no-new-privs. It cannot read /proc/1/environ or
#      any root-owned process's environment, and cannot regain root.
#
# Maintenance: when /data/.bizomat-maintenance exists (create it with `fly ssh console`), work and cad do not
# start; the Machine stays up for a restore (infrastructure/migrate). Remove the file and restart the Machine.
# cad then answers with its holding page (infrastructure/fly/cad-holding.py: /healthz 200 with "ok": false, every
# other request 503 "back shortly"), so the router shows a clear answer and Fly's check does not hold up a deploy.
#
# cad waits for its data: CAD Automation has no server password (CADOS#11), and a server with no account that others
# can reach offers only its setup page, where the first visitor becomes the owner. So cad never starts the CAD server
# on a volume without CAD data (/data/cad/users.json or accounts.enabled): it answers with the holding page until
# `bizomat.ps1 move cad` has put the data there. BIZOMAT_CAD_ALLOW_EMPTY=1 starts it anyway (a new, empty platform,
# whose owner then creates the owner account at once).
#
# Settings each role receives (fly.toml [env], Fly secrets, or secret files):
#   all roles  FLY_APP_NAME FLY_MACHINE_ID FLY_ALLOC_ID FLY_REGION FLY_PUBLIC_IP FLY_PRIVATE_IP FLY_IMAGE_REF
#              FLY_MACHINE_VERSION FLY_PROCESS_GROUP FLY_VM_MEMORY_MB PRIMARY_REGION BIZOMAT_VERSION TZ
#   proxy      UPSTREAM_WEB UPSTREAM_WORK UPSTREAM_CAD BIZOMAT_PREVIEW_ROUTING PROXY_*
#   web        CF_ACCOUNT_ID CF_AI_TOKEN ANTHROPIC_API_KEY TURNSTILE_SECRET_KEY WEB_*
#   work       WORK_* ; and as the app's own names: APP_URL <- WORK_APP_URL, APP_NAME <- WORK_APP_NAME,
#              ENVIRONMENT <- WORK_ENVIRONMENT, ALLOW_SIGNUP <- WORK_ALLOW_SIGNUP,
#              SESSION_TTL_HOURS <- WORK_SESSION_TTL_HOURS, CANONICAL_URL <- WORK_CANONICAL_URL,
#              GOOGLE_CLIENT_ID <- WORK_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET <- WORK_GOOGLE_CLIENT_SECRET
#   cad        OPENSKETCH_* ; GOOGLE_CLIENT_ID <- CAD_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET <- CAD_GOOGLE_CLIENT_SECRET
#   all        nothing of its own: proxy, web and work each get their settings as above, except that the proxy's
#              UPSTREAM_WEB and UPSTREAM_WORK are always http://127.0.0.1:8003 and http://127.0.0.1:8002
# The prefixed names keep the work and cad Google sign-in clients apart (both apps read GOOGLE_CLIENT_ID).
#
# all: one Machine for the platform (fly.website.toml since 10 Nov 2026, to cut cost: the work group's Machine, which
# holds the volume work_data, runs `bizomat-entrypoint all`). This script then stays as a small supervisor, as root,
# and starts this same script once per role (work, web, proxy), so each service keeps everything above: its clean
# environment, its own unprivileged user with no capabilities, and for work the volume check, secret files and
# maintenance mode (work then sleeps; the proxy answers 502 for /tasks and the website stays up). Like Fly's init, the
# supervisor holds the Machine's environment; the services, as other users, cannot read it.
#   - SIGTERM or SIGINT: SIGTERM to the proxy first, which stops taking requests and lets open ones finish
#     (PROXY_SHUTDOWN_GRACE_MS, 10 s; the supervisor waits 2 s more); then to web and work, which get 12 s; whatever
#     still runs is then killed; exit 0. fly.website.toml's kill_timeout (30 s) covers both waits. A second signal is
#     passed on to every service still running at once.
#   - a service exits: the others are stopped the same way and the supervisor exits non-zero (the service's status,
#     or 1), so Fly restarts the whole Machine ([[restart]] policy always) instead of leaving the platform half up.
# Fixed by this script (not overridable): PORT, HOST, the data and static directories, *_TRUST_PROXY, PATH,
# HOME, LANG, NODE_ENV.
set -euo pipefail
umask 077

say() { printf 'bizomat-entrypoint: %s\n' "$*" >&2; }
die() {
  say "$*"
  exit 1
}

usage() {
  cat >&2 <<'EOF'
usage: bizomat-entrypoint <role>
  proxy   the edge proxy (port 8080): routes every BIZOMAT host to its backend
  web     the website (port 8003)
  work    BIZOMAT Project Management (port 8002, volume /data/work)
  cad     CAD Automation (port 8001, volume /data/cad)
  all     proxy, web and work together on this Machine (the work group's, with its volume)
EOF
}

ROLE="${1:-}"
case "$ROLE" in
  proxy | web | work | cad | all) ;;
  help | -h | --help | "")
    usage
    exit 64
    ;;
  *)
    usage
    die "unknown role '$ROLE'"
    ;;
esac

[ "$(id -u)" = 0 ] || die "start this as root: it gives the $ROLE service its own unprivileged user"

# A Machine of one process group must never run another group's service (and get its volume or settings). The one
# exception is `all`, on the Machine of a group in ALL_GROUPS: work, the group that holds the volume work_data. The
# supervisor marks the roles it starts there with BIZOMAT_UNDER_ALL=1 (never passed on to a service).
ALL_GROUPS=(work)
in_all_group() {
  local g
  for g in "${ALL_GROUPS[@]}"; do [ "$1" = "$g" ] && return 0; done
  return 1
}
if [ -n "${FLY_PROCESS_GROUP:-}" ] && [ "$FLY_PROCESS_GROUP" != "$ROLE" ]; then
  if [ "$ROLE" = all ] && in_all_group "$FLY_PROCESS_GROUP"; then
    :
  elif [ "${BIZOMAT_UNDER_ALL:-}" = 1 ] && in_all_group "$FLY_PROCESS_GROUP" && [[ $ROLE =~ ^(proxy|web|work)$ ]]; then
    :
  else
    die "this Machine is in process group '$FLY_PROCESS_GROUP' but was asked to run '$ROLE'"
  fi
fi

# ----------------------------------------------------------------------------------------------- all

run_all() {
  local self pid status grace_ms proxy_wait=12 rest_wait=12
  self="$(readlink -f "${BASH_SOURCE[0]}")"
  grace_ms="${PROXY_SHUTDOWN_GRACE_MS:-10000}"
  if [[ $grace_ms =~ ^[0-9]{1,7}$ ]]; then proxy_wait=$(((10#$grace_ms + 999) / 1000 + 2)); fi
  declare -gA ALL_PIDS=() # pid -> role, of the services still running
  ALL_STOPPING=""

  all_alive() { [ -r "/proc/$1/status" ] && ! grep -q '^State:[[:space:]]*Z' "/proc/$1/status" 2>/dev/null; }
  all_signal() { # signal role...: send the signal to those roles' services
    local sig="$1" p r
    shift
    for p in "${!ALL_PIDS[@]}"; do
      for r in "$@"; do
        if [ "${ALL_PIDS[$p]}" = "$r" ]; then kill "-$sig" "$p" 2>/dev/null || true; fi
      done
    done
  }
  all_wait() { # seconds role...: wait until those roles' services have exited, at most that long
    local limit=$(($1 * 10)) i p r busy
    shift
    for ((i = 0; i < limit; i++)); do
      busy=""
      for p in "${!ALL_PIDS[@]}"; do
        for r in "$@"; do
          if [ "${ALL_PIDS[$p]}" = "$r" ] && all_alive "$p"; then busy=1; fi
        done
      done
      [ -n "$busy" ] || return 0
      sleep 0.1
    done
  }
  all_stop() {
    say "all: stopping the proxy (waiting up to ${proxy_wait} s for its open requests), then web and work (up to ${rest_wait} s)"
    all_signal TERM proxy
    all_wait "$proxy_wait" proxy
    all_signal TERM web work
    all_wait "$rest_wait" proxy web work
    local p
    for p in "${!ALL_PIDS[@]}"; do
      if all_alive "$p"; then
        say "all: ${ALL_PIDS[$p]} still running: killed"
        kill -KILL "$p" 2>/dev/null || true
      fi
    done
    wait 2>/dev/null || true
  }
  all_on_signal() {
    if [ -n "$ALL_STOPPING" ]; then
      say "all: second $1: passing SIGTERM to every service still running"
      all_signal TERM proxy web work
    fi
    ALL_STOPPING="$1"
  }
  all_start() { # role [NAME=value...]: start that role as this script would on its own Machine
    local role="$1"
    shift
    env "$@" BIZOMAT_UNDER_ALL=1 /bin/bash "$self" "$role" &
    ALL_PIDS[$!]="$role"
  }

  trap 'all_on_signal SIGTERM' TERM
  trap 'all_on_signal SIGINT' INT
  say "all: starting work, web and proxy on this Machine; the proxy reaches web and work on 127.0.0.1"
  all_start work
  all_start web
  all_start proxy UPSTREAM_WEB=http://127.0.0.1:8003 UPSTREAM_WORK=http://127.0.0.1:8002

  while :; do
    pid=""
    status=0
    wait -n -p pid "${!ALL_PIDS[@]}" || status=$?
    if [ -n "$ALL_STOPPING" ]; then
      say "all: $ALL_STOPPING received"
      all_stop
      say "all: stopped"
      exit 0
    fi
    if [ -n "${pid:-}" ]; then
      say "all: ${ALL_PIDS[$pid]} exited with status $status; stopping the others so that Fly restarts this Machine"
      unset "ALL_PIDS[$pid]"
      all_stop
      [ "$status" != 0 ] || status=1
      exit "$status"
    fi
  done
}

if [ "$ROLE" = all ]; then
  [ "${BIZOMAT_UNDER_ALL:-}" != 1 ] || die "all cannot start all"
  run_all
fi

DATA=/data
case "$ROLE" in
  proxy) RUN_USER=bzproxy ;;
  web) RUN_USER=bzweb ;;
  work) RUN_USER=bzwork ;;
  cad) RUN_USER=bzcad ;;
esac
RUN_UID="$(id -u "$RUN_USER")" || die "user $RUN_USER is missing from the image"
RUN_GID="$(id -g "$RUN_USER")"
ROLE_DIR="$DATA/$ROLE"

# ----------------------------------------------------------------------------------------------- volume

is_mounted() {
  if command -v mountpoint >/dev/null 2>&1; then
    mountpoint -q "$1"
  else
    awk -v d="$1" '$5 == d { found = 1 } END { exit !found }' /proc/self/mountinfo
  fi
}

prepare_volume() {
  if ! is_mounted "$DATA"; then
    if [ "${BIZOMAT_ALLOW_EPHEMERAL:-}" = 1 ]; then
      say "WARNING: $DATA is not a mounted volume; $ROLE data is lost when this Machine is replaced (BIZOMAT_ALLOW_EPHEMERAL=1)"
    else
      die "$DATA is not a mounted volume, so $ROLE will not start (its data would be lost). Mount the role's volume (fly.toml [[mounts]]), or set BIZOMAT_ALLOW_EPHEMERAL=1 for a throwaway run."
    fi
  fi
  mkdir -p "$DATA"
  chown root:root "$DATA"
  chmod 0755 "$DATA"
  # where restores are uploaded (fly ssh sftp put ... /data/incoming/...): root only
  install -d -o root -g root -m 0700 "$DATA/incoming"
  if [ -L "$ROLE_DIR" ]; then die "$ROLE_DIR is a symbolic link; refusing to use it"; fi
  install -d -o "$RUN_UID" -g "$RUN_GID" -m 0700 "$ROLE_DIR"
  chown "$RUN_UID:$RUN_GID" "$ROLE_DIR"
  chmod 0700 "$ROLE_DIR"
  # Anything not owned by the role (a restore copied in as root, an older layout): give it to the role.
  # find does not follow links and chown -h changes a link itself, never what it points to.
  find "$ROLE_DIR" -xdev -path "$ROLE_DIR/.secrets" -prune -o \
    \( ! -user "$RUN_UID" -o ! -group "$RUN_GID" \) -exec chown -h "$RUN_UID:$RUN_GID" {} +
  if [ -e "$ROLE_DIR/.secrets" ] || [ -L "$ROLE_DIR/.secrets" ]; then
    if [ -L "$ROLE_DIR/.secrets" ] || [ ! -d "$ROLE_DIR/.secrets" ]; then
      die "$ROLE_DIR/.secrets must be a directory, not a link or a file"
    fi
    chown root:root "$ROLE_DIR/.secrets"
    chmod 0700 "$ROLE_DIR/.secrets"
  fi
}

# cad only: the holding page instead of the CAD server (see the top of this file), in maintenance or waiting for data
HOLD=""
case "$ROLE" in
  work | cad)
    prepare_volume
    if [ -e "$DATA/.bizomat-maintenance" ]; then
      say "maintenance mode: $DATA/.bizomat-maintenance exists, so $ROLE is not started."
      say "Restore or inspect the data with 'fly ssh console', then remove the file and restart this Machine."
      if [ "$ROLE" = cad ]; then HOLD=maintenance; else exec sleep infinity; fi
    elif [ "$ROLE" = cad ] && [ ! -e "$ROLE_DIR/users.json" ] && [ ! -e "$ROLE_DIR/accounts.enabled" ]; then
      if [ "${BIZOMAT_CAD_ALLOW_EMPTY:-}" = 1 ]; then
        say "WARNING: $ROLE_DIR holds no CAD data; starting an empty CAD server (BIZOMAT_CAD_ALLOW_EMPTY=1): until an owner account exists, its first visitor can create it"
      else
        say "waiting for data: $ROLE_DIR holds no CAD data (no users.json), so the CAD server is not started."
        say "bizomat.ps1 move cad puts the data there (infrastructure/migrate/cad/README.md); until then this Machine answers with a holding page."
        HOLD=waiting-for-data
      fi
    fi
    ;;
esac

# ----------------------------------------------------------------------------------------------- environment

declare -A OUT=()
set_var() { OUT["$1"]="$2"; }
pass() {
  local n
  for n in "$@"; do
    if [[ -v $n ]]; then set_var "$n" "${!n}"; fi
  done
}
pass_prefix() {
  local p n
  for p in "$@"; do
    while IFS= read -r n; do
      if [[ $n == "$p"* ]]; then set_var "$n" "${!n}"; fi
    done < <(compgen -e)
  done
}
# map SOURCE TARGET [DEFAULT]: TARGET gets SOURCE's value, else DEFAULT (if given)
map() {
  if [[ -v $1 ]]; then
    set_var "$2" "${!1}"
  elif [ "$#" -ge 3 ]; then
    set_var "$2" "$3"
  fi
}

COMMON=(FLY_APP_NAME FLY_MACHINE_ID FLY_ALLOC_ID FLY_REGION FLY_PUBLIC_IP FLY_PRIVATE_IP FLY_IMAGE_REF
  FLY_MACHINE_VERSION FLY_PROCESS_GROUP FLY_VM_MEMORY_MB PRIMARY_REGION BIZOMAT_VERSION TZ)
pass "${COMMON[@]}"

VERSION="${BIZOMAT_VERSION:-dev}"
case "$ROLE" in
  proxy)
    EXACT=(UPSTREAM_WEB UPSTREAM_WORK UPSTREAM_CAD BIZOMAT_PREVIEW_ROUTING TASKS_REDIRECT_ORIGIN)
    PREFIXES=(PROXY_)
    pass "${EXACT[@]}"
    pass_prefix "${PREFIXES[@]}"
    ;;
  web)
    EXACT=(CF_ACCOUNT_ID CF_AI_TOKEN ANTHROPIC_API_KEY TURNSTILE_SECRET_KEY)
    PREFIXES=(WEB_)
    pass "${EXACT[@]}"
    pass_prefix "${PREFIXES[@]}"
    map WEB_VERSION WEB_VERSION "$VERSION"
    ;;
  work)
    EXACT=(APP_URL APP_NAME ENVIRONMENT ALLOW_SIGNUP SESSION_TTL_HOURS CANONICAL_URL GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET)
    PREFIXES=(WORK_)
    pass_prefix "${PREFIXES[@]}"
    map WORK_APP_URL APP_URL "https://bizomat.ai/tasks"
    map WORK_APP_NAME APP_NAME "BIZOMAT Project Management"
    map WORK_ENVIRONMENT ENVIRONMENT "production"
    map WORK_ALLOW_SIGNUP ALLOW_SIGNUP "false"
    map WORK_SESSION_TTL_HOURS SESSION_TTL_HOURS "72"
    map WORK_CANONICAL_URL CANONICAL_URL
    map WORK_GOOGLE_CLIENT_ID GOOGLE_CLIENT_ID
    map WORK_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET
    map WORK_VERSION WORK_VERSION "$VERSION"
    ;;
  cad)
    EXACT=(GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET)
    PREFIXES=(OPENSKETCH_)
    pass_prefix "${PREFIXES[@]}"
    map CAD_GOOGLE_CLIENT_ID GOOGLE_CLIENT_ID
    map CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET
    # /healthz reports the CADOS commit apps/cad is a copy of (apps/cad-source.json, in the image), so it says which
    # CAD code runs, as it did on the cados app; without the pin, the platform's version
    CAD_VERSION=""
    if [ -f /app/cad/cad-source.json ]; then
      CAD_VERSION="$(python3 -c 'import json, sys; c = json.load(open(sys.argv[1]))["commit"]; print(c[:7] if len(c) == 40 else "")' /app/cad/cad-source.json 2>/dev/null || true)"
    fi
    map OPENSKETCH_VERSION OPENSKETCH_VERSION "${CAD_VERSION:-$VERSION}"
    ;;
esac

allowed_name() {
  local n="$1" x
  [[ $n =~ ^[A-Z][A-Z0-9_]{0,127}$ ]] || return 1
  for x in "${EXACT[@]}"; do [ "$n" = "$x" ] && return 0; done
  for x in "${PREFIXES[@]}"; do [[ $n == "$x"* ]] && return 0; done
  return 1
}

load_secret_files() {
  local dir="$ROLE_DIR/.secrets" f name value
  [ -d "$dir" ] || return 0
  for f in "$dir"/*; do
    [ -e "$f" ] || [ -L "$f" ] || continue
    name="${f##*/}"
    if [ -L "$f" ] || [ ! -f "$f" ]; then
      say "secret file $name skipped: not a regular file"
      continue
    fi
    if [ "$(stat -c %u "$f")" != 0 ]; then
      say "secret file $name skipped: not owned by root"
      continue
    fi
    if ! allowed_name "$name"; then
      say "secret file $name skipped: not a setting of the $ROLE role"
      continue
    fi
    chmod 0600 "$f"
    value="$(cat -- "$f")"
    set_var "$name" "$value"
    say "setting $name read from the $ROLE volume"
  done
}
case "$ROLE" in work | cad) load_secret_files ;; esac

# The address to listen on: every interface, IPv6 and IPv4 ('::' is dual-stack for Node), or 0.0.0.0 where the
# kernel has no IPv6 (some local Docker hosts). Fly's private network is IPv6; Fly's health checks use IPv4.
listen_host() {
  if [ -n "${BIZOMAT_LISTEN_HOST:-}" ]; then
    printf '%s' "$BIZOMAT_LISTEN_HOST"
  elif python3 -c 'import socket; socket.socket(socket.AF_INET6).bind(("::", 0))' 2>/dev/null; then
    printf '::'
  else
    printf '0.0.0.0'
  fi
}

BASE_PATH=/usr/local/bin:/usr/bin:/bin
case "$ROLE" in
  proxy)
    WORKDIR=/app/proxy
    CMD=(/usr/local/bin/node /app/proxy/server.mjs)
    set_var NODE_ENV production
    set_var PATH "$BASE_PATH"
    if [ -z "${OUT[PROXY_HOST]:-}" ]; then set_var PROXY_HOST "$(listen_host)"; fi
    ;;
  web)
    WORKDIR=/app/web
    CMD=(/usr/local/bin/node /app/web/dist-server/server.mjs)
    [ -f "${CMD[1]}" ] || die "${CMD[1]} is missing from this image (npm run build:server did not run)"
    set_var NODE_ENV production
    set_var PATH "$BASE_PATH"
    set_var PORT 8003
    set_var HOST "$(listen_host)"
    set_var WEB_DIST_DIR /app/web/dist
    set_var WEB_TRUST_PROXY 1
    ;;
  work)
    WORKDIR=/app/work
    CMD=(/usr/local/bin/node /app/work/dist/node/server.mjs)
    [ -f "${CMD[1]}" ] || die "${CMD[1]} is missing from this image (npm run build:node did not run)"
    set_var NODE_ENV production
    set_var PATH "$BASE_PATH"
    set_var PORT 8002
    set_var HOST "$(listen_host)"
    set_var WORK_DATA_DIR "$ROLE_DIR"
    set_var WORK_STATIC_DIR /app/work/dist/client
    set_var WORK_TRUST_PROXY 1
    ;;
  cad)
    WORKDIR=/app/cad
    # --host ::: every address. The CAD server opens one dual-stack socket for it itself (opensketch/__main__.py
    # listen_sockets: IPv6 and IPv4, or IPv4 alone where the kernel has no IPv6), so the proxy's 6PN connections,
    # Fly's IPv4 checks and the supervisor's 127.0.0.1 probe all reach it. (asyncio alone would make '::' IPv6 only;
    # and '' now means 127.0.0.1 to the CAD server, so it must not be used here.)
    CMD=(/opt/cad/venv/bin/python -m opensketch --host "${BIZOMAT_CAD_HOST:-::}" --port 8001 --no-browser --supervise)
    # No server password: CAD Automation signs people in with accounts (CADOS#11). What keeps a server without accounts
    # from being claimed is the wait for data above. OPENSKETCH_PASSWORD, if a server still has it, only seeds the
    # owner's old private connector address, so it moves with the data (bizomat.ps1 move cad) and is not required.
    if [ -n "$HOLD" ]; then
      # the holding page, as the same unprivileged user, on the same port; it never reads /data
      CMD=(/usr/local/bin/python3 /usr/local/lib/bizomat/cad-holding.py "$HOLD" 8001)
    fi
    set_var PATH "/opt/cad/venv/bin:$BASE_PATH"
    set_var OPENSKETCH_DATA "$ROLE_DIR"
    set_var PYTHONUNBUFFERED 1
    set_var PYTHONDONTWRITEBYTECODE 1
    ;;
esac
set_var HOME "/home/$RUN_USER"
set_var USER "$RUN_USER"
set_var LOGNAME "$RUN_USER"
set_var LANG C.UTF-8

# ----------------------------------------------------------------------------------------------- hardening

# Fly's in-VM API socket (/.fly/api) acts for the Machine without a token. No service needs it; keep it
# root-only so a compromised service cannot use it. BIZOMAT_KEEP_FLY_API=1 leaves it as it is.
if [ -S /.fly/api ] && [ "${BIZOMAT_KEEP_FLY_API:-}" != 1 ]; then
  chmod 0600 /.fly/api 2>/dev/null || say "could not restrict /.fly/api (continuing)"
fi

CAPS=(--inh-caps=-all --bounding-set=-all)
if ! setpriv --inh-caps=-all --bounding-set=-all true 2>/dev/null; then
  say "cannot clear the capability bounding set here (no CAP_SETPCAP); continuing with no-new-privs only"
  CAPS=(--inh-caps=-all)
fi

ENV_ARGS=()
for k in "${!OUT[@]}"; do ENV_ARGS+=("$k=${OUT[$k]}"); done

say "starting $ROLE as $RUN_USER with ${#ENV_ARGS[@]} settings"
cd "$WORKDIR"
exec /usr/bin/env -i "${ENV_ARGS[@]}" /usr/bin/setpriv --reuid="$RUN_UID" --regid="$RUN_GID" --init-groups \
  --no-new-privs "${CAPS[@]}" -- "${CMD[@]}"
