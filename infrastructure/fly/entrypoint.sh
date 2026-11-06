#!/bin/bash
# BIZOMAT platform entrypoint: bizomat-entrypoint <proxy|web|work|cad>
#
# One image runs four roles; each Fly process group starts it with its role (fly.toml [processes]).
# It runs as root only long enough to:
#   1. for work and cad: check that the role's volume is mounted at /data (else refuse to start: the data would
#      be lost when the Machine is replaced; BIZOMAT_ALLOW_EPHEMERAL=1 allows a throwaway run), and give the
#      role's own directory (/data/work, /data/cad) to the role's user;
#   2. build a CLEAN environment holding only the role's own settings. Fly secrets are environment variables of
#      EVERY Machine of the app, so without this the website would hold the CAD server password. The service
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
EOF
}

ROLE="${1:-}"
case "$ROLE" in
  proxy | web | work | cad) ;;
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
if [ -n "${FLY_PROCESS_GROUP:-}" ] && [ "$FLY_PROCESS_GROUP" != "$ROLE" ]; then
  die "this Machine is in process group '$FLY_PROCESS_GROUP' but was asked to run '$ROLE'"
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

case "$ROLE" in
  work | cad)
    prepare_volume
    if [ -e "$DATA/.bizomat-maintenance" ]; then
      say "maintenance mode: $DATA/.bizomat-maintenance exists, so $ROLE is not started."
      say "Restore or inspect the data with 'fly ssh console', then remove the file and restart this Machine."
      exec sleep infinity
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
    EXACT=(UPSTREAM_WEB UPSTREAM_WORK UPSTREAM_CAD BIZOMAT_PREVIEW_ROUTING)
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
    map OPENSKETCH_VERSION OPENSKETCH_VERSION "$VERSION"
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
    set_var PATH "/opt/cad/venv/bin:$BASE_PATH"
    set_var OPENSKETCH_DATA "$ROLE_DIR"
    set_var PYTHONUNBUFFERED 1
    set_var PYTHONDONTWRITEBYTECODE 1
    # On Fly the CAD server is public: never start it without its password (an open server lets anyone in).
    if [ -n "${FLY_APP_NAME:-}" ] && [ -z "${OUT[OPENSKETCH_PASSWORD]:-}" ] && [ "${BIZOMAT_ALLOW_OPEN_CAD:-}" != 1 ]; then
      die "OPENSKETCH_PASSWORD is not set (fly secrets set OPENSKETCH_PASSWORD=... or /data/cad/.secrets/OPENSKETCH_PASSWORD); refusing to start an open CAD server"
    fi
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
