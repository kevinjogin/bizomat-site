#!/bin/bash
# BIZOMAT platform entrypoint: bizomat-entrypoint <proxy|web|work|cad|all>
#
# One image runs four roles; each Fly process group starts it with its role (fly.toml [processes]).
# `all` runs the four in one Machine (the single application `cados`, fly.toml; docs/BIZOMAT-SINGLE-APP.md): it
# adopts the old cados volume layout once (adopt-cados-volume.sh), then starts each role exactly as its own process
# group would (`bizomat-entrypoint <role>`: own user, own clean environment, own secrets) and restarts any that stops.
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
# The prefixed names keep the work and cad Google sign-in clients apart (both apps read GOOGLE_CLIENT_ID).
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
  all     the four above in one Machine, supervised (the single application; one volume at /data)
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

# A Machine of one process group must never run another group's service (and get its volume or settings).
if [ "$ROLE" != all ] && [ -n "${FLY_PROCESS_GROUP:-}" ] && [ "$FLY_PROCESS_GROUP" != "$ROLE" ]; then
  die "this Machine is in process group '$FLY_PROCESS_GROUP' but was asked to run '$ROLE'"
fi

DATA=/data
case "$ROLE" in
  all) RUN_USER=root ;;
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

# ----------------------------------------------------------------------------------------------- all: one Machine

# The single application: every role in this Machine, each started as its own process group would start it. The
# supervisor holds no service itself: it stays root only to start the roles (each drops to its own user and builds its
# own clean environment, below), and it never passes one role's settings to another.
run_all() {
  local self="${BIZOMAT_ENTRYPOINT:-${BASH_SOURCE[0]}}"
  # The cados app's own Google sign-in names (GOOGLE_CLIENT_*), for CAD Automation only: the platform calls them
  # CAD_GOOGLE_*. They are given to the cad role's start alone; no other role is started with them.
  local cad_env=() n
  for n in CLIENT_ID CLIENT_SECRET; do
    if [[ -v CAD_GOOGLE_$n ]]; then
      local v="CAD_GOOGLE_$n"
      cad_env+=("CAD_GOOGLE_$n=${!v}")
    elif [[ -v GOOGLE_$n ]]; then
      local v="GOOGLE_$n"
      cad_env+=("CAD_GOOGLE_$n=${!v}")
    fi
  done
  unset GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_ID CAD_GOOGLE_CLIENT_SECRET
  # The old cados volume keeps CAD data at its root: move it into /data/cad once, before cad prepares its folder
  # (which would otherwise make an empty /data/cad and answer with the holding page, waiting for data).
  if [ "${BIZOMAT_ADOPT_CADOS_VOLUME:-1}" = 1 ] && is_mounted "$DATA"; then
    "${BIZOMAT_ADOPT_SCRIPT:-/usr/local/lib/bizomat/adopt-cados-volume.sh}" ||
      say "all: the volume adoption stopped (see above); cad waits with its holding page until that is resolved"
  fi

  # BIZOMAT_ROLES: which services this Machine runs (fly.toml). The single 1 GB application runs cad, work and the
  # proxy in front of them; the website's static pages are served by the proxy itself (no web process).
  local roles=() r
  read -r -a roles <<<"${BIZOMAT_ROLES:-cad work proxy}"
  for r in "${roles[@]}"; do
    case "$r" in proxy | web | work | cad) ;; *) die "BIZOMAT_ROLES: unknown role '$r'" ;; esac
  done
  declare -A PID=() STARTED=() FAILS=()
  STOPPING=0
  start_role() {
    if [ "$1" = cad ]; then
      /usr/bin/env "${cad_env[@]}" FLY_PROCESS_GROUP=cad "$self" cad &
    else
      FLY_PROCESS_GROUP="$1" "$self" "$1" &
    fi
    PID[$1]=$!
    STARTED[$1]=$SECONDS
    say "all: started $1 (pid ${PID[$1]})"
  }
  # shellcheck disable=SC2329 # invoked by the TERM/INT trap
  stop_all() {
    STOPPING=1
    local p
    for p in "${PID[@]}"; do kill -TERM "$p" 2>/dev/null || true; done
  }
  trap stop_all TERM INT
  for r in "${roles[@]}"; do start_role "$r"; done
  local done_pid rc role delay
  while :; do
    done_pid=""
    rc=0
    wait -n -p done_pid "${PID[@]}" || rc=$?
    [ "$STOPPING" = 1 ] && break
    [ -n "$done_pid" ] || continue
    role=""
    for r in "${!PID[@]}"; do [ "${PID[$r]}" = "$done_pid" ] && role="$r"; done
    [ -n "$role" ] || continue
    # a role that ran for a minute starts again at once; one that keeps failing waits longer each time (up to 30 s)
    if ((SECONDS - STARTED[$role] >= 60)); then FAILS[$role]=0; fi
    FAILS[$role]=$((${FAILS[$role]:-0} + 1))
    delay=$((FAILS[$role] > 4 ? 30 : (1 << FAILS[$role])))
    say "all: $role stopped (exit $rc); starting it again in ${delay}s"
    sleep "$delay" &
    wait $! || true
    [ "$STOPPING" = 1 ] && break
    start_role "$role"
  done
  say "all: stopping"
  wait || true
  exit 0
}
if [ "$ROLE" = all ]; then
  if [ -n "${FLY_PROCESS_GROUP:-}" ] && [ "$FLY_PROCESS_GROUP" != all ] && [ "$FLY_PROCESS_GROUP" != app ]; then
    die "this Machine is in process group '$FLY_PROCESS_GROUP' but was asked to run all roles"
  fi
  run_all
fi

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
    # /data/.bizomat-maintenance stops both; /data/.bizomat-maintenance-<role> stops only that role (the single
    # application keeps cad and work on one volume, so a work data move need not stop CAD Automation)
    if [ -e "$DATA/.bizomat-maintenance" ] || [ -e "$DATA/.bizomat-maintenance-$ROLE" ]; then
      say "maintenance mode: $DATA/.bizomat-maintenance or $DATA/.bizomat-maintenance-$ROLE exists, so $ROLE is not started."
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
    # BIZOMAT_EMBED_WEB=1 (the single 1 GB machine): the website runs inside the proxy's process, on 127.0.0.1:8003,
    # with the web role's own WEB_* settings only (no secrets: the contact form posts to its provider from the browser).
    if [ "${BIZOMAT_EMBED_WEB:-}" = 1 ]; then
      PREFIXES+=(WEB_)
      pass_prefix WEB_
      set_var PROXY_EMBED_WEB /app/web/dist-server/server.mjs
      set_var WEB_DIST_DIR /app/web/dist
      set_var WEB_HOST 127.0.0.1
      set_var WEB_PORT 8003
      map WEB_VERSION WEB_VERSION "$VERSION"
      if [ -z "${OUT[UPSTREAM_WEB]:-}" ]; then set_var UPSTREAM_WEB http://127.0.0.1:8003; fi
    fi
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
