#!/bin/bash
# Tests of infrastructure/fly/entrypoint.sh in the built image (CI after the image build, or by hand):
#   bash infrastructure/fly/test/entrypoint.test.sh <image>
# Each case starts a container with the app-wide environment Fly would give EVERY Machine (throwaway values), and a
# fake service (fake-server.mjs, mounted over the role's server file) that reports its uid and environment.
set -euo pipefail

IMAGE="${1:?usage: entrypoint.test.sh <image>}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FAKE="$HERE/fake-server.mjs"
tmp="$(mktemp -d)"
# A shell command as root in a throwaway container with $tmp at /t. Volume fixtures are made and inspected the way an
# operator makes them (as root, through fly ssh console), whoever runs this test: CI runs it as an unprivileged user,
# whose files the entrypoint rightly refuses as secrets, and who cannot look inside the role's 0700 folders.
as_root() { docker run --rm --network none -v "$tmp:/t" --entrypoint /bin/sh "$IMAGE" -c "$1"; }
rstat() { as_root "stat -c '$1' '/t/${2#"$tmp"/}'"; }
trap 'docker rm -f bz-ep-maint bz-ep-hold bz-ep-cadmaint bz-ep-all bz-ep-all-dies bz-ep-all-maint >/dev/null 2>&1 || true; as_root "rm -rf /t/*" >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
passed=0
ok() {
  passed=$((passed + 1))
  printf 'entrypoint: ok  %s\n' "$*"
}
bad() {
  printf 'entrypoint: FAIL %s\n' "$*" >&2
  exit 1
}

# what Fly gives every Machine of the app: [env] plus every secret
APP_ENV=(
  -e UPSTREAM_WEB=http://web:8003 -e UPSTREAM_WORK=http://work:8002 -e UPSTREAM_CAD=http://cad:8001
  -e BIZOMAT_PREVIEW_ROUTING=1 -e WORK_APP_URL=https://work.example.test -e WORK_ALLOW_SIGNUP=false
  -e WORK_CANONICAL_URL=https://example.test/tasks
  -e OPENSKETCH_PUBLIC_URL=https://cad.example.test -e OPENSKETCH_KEY_SECRET=throwaway-cad-key
  -e WORK_GOOGLE_CLIENT_ID=work-id -e WORK_GOOGLE_CLIENT_SECRET=throwaway-work-secret
  -e CAD_GOOGLE_CLIENT_ID=cad-id -e CAD_GOOGLE_CLIENT_SECRET=throwaway-cad-secret
  -e CF_AI_TOKEN=throwaway-web-token -e WEB_EXTRA=web-setting -e PROXY_LOG=0
  -e GOOGLE_CLIENT_SECRET=ambiguous-app-wide -e LD_PRELOAD=/nope.so -e NODE_OPTIONS=--inspect
  -e FLY_APP_NAME=bizomat-test -e FLY_REGION=syd -e FLY_MACHINE_ID=m123
)

run_role() { # role server-path [extra docker args...] -> the fake server's JSON report on stdout
  local role="$1" server="$2"
  shift 2
  docker run --rm --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP="$role" -v "$FAKE:$server:ro" "$@" \
    "$IMAGE" /usr/local/bin/bizomat-entrypoint "$role" 2>"$tmp/stderr"
}
has() { python3 -c 'import json,sys; r=json.load(open(sys.argv[1])); sys.exit(0 if sys.argv[2] in r["env"] else 1)' "$1" "$2"; }
val() { python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["env"].get(sys.argv[2], ""))' "$1" "$2"; }
uid() { python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["uid"])' "$1"; }

# usage and refusals
set +e
docker run --rm "$IMAGE" /usr/local/bin/bizomat-entrypoint help >/dev/null 2>&1
[ "$?" = 64 ] || bad "help should exit 64"
docker run --rm "$IMAGE" /usr/local/bin/bizomat-entrypoint nope >/dev/null 2>&1
[ "$?" = 1 ] || bad "an unknown role should exit 1"
set -e
ok "usage and unknown roles"
if docker run --rm -e FLY_PROCESS_GROUP=web "$IMAGE" /usr/local/bin/bizomat-entrypoint work 2>"$tmp/e" >/dev/null; then bad "group mismatch accepted"; fi
grep -q "process group 'web'" "$tmp/e" || bad "group mismatch message"
ok "a Machine of one group never runs another group's role"
if docker run --rm "$IMAGE" /usr/local/bin/bizomat-entrypoint work 2>"$tmp/e" >/dev/null; then bad "work started without a volume"; fi
grep -q "not a mounted volume" "$tmp/e" || bad "no-volume message"
if docker run --rm "$IMAGE" /usr/local/bin/bizomat-entrypoint cad 2>"$tmp/e" >/dev/null; then bad "cad started without a volume"; fi
ok "work and cad refuse to start without their volume"
# A request to the holding page from inside its container: "<status> <body>"
# (LD_PRELOAD= : the container's hostile app-wide environment above holds LD_PRELOAD, which docker exec inherits)
hold_get() { docker exec -e LD_PRELOAD= "$1" python3 -c 'import sys, urllib.request, urllib.error
try:
    r = urllib.request.urlopen(urllib.request.Request("http://127.0.0.1:8001" + sys.argv[1], method=sys.argv[2]), timeout=5)
except urllib.error.HTTPError as e:
    r = e
print(r.status, r.headers.get("Retry-After") or "-", r.read().decode())' "$2" "${3:-GET}"; }
wait_log() { for _ in $(seq 1 30); do grep -q "$2" <<<"$(docker logs "$1" 2>&1)" && return 0; sleep 1; done; return 1; }

# cad on a volume without CAD data (a new volume, before the data move): the holding page, never the CAD server
mkdir -p "$tmp/cadvol"
docker run -d --name bz-ep-hold --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=cad -v "$tmp/cadvol:/data" \
  "$IMAGE" /usr/local/bin/bizomat-entrypoint cad >/dev/null
wait_log bz-ep-hold "answering on port 8001" || bad "the holding page did not start"
grep -q "waiting for data" <<<"$(docker logs bz-ep-hold 2>&1)" || bad "waiting-for-data message"
health="$(hold_get bz-ep-hold /healthz)"
[[ $health == "200 - "*'"ok": false'*'"status": "waiting-for-data"'* ]] || bad "holding /healthz: $health"
for probe in "/cad/ GET" "/mcp POST" "/cad/setup GET" "/v2/device/hello POST"; do
  read -r path method <<<"$probe"
  [[ "$(hold_get bz-ep-hold "$path" "$method")" == "503 30 "*CAD_UNAVAILABLE* ]] || bad "holding page: $method $path must be 503"
done
[ "$(docker exec -e LD_PRELOAD= bz-ep-hold sh -c 'for p in /proc/[0-9]*; do case "$(tr "\0" " " <$p/cmdline 2>/dev/null)" in *cad-holding.py*) awk "/^Uid:/ {print \$2}" $p/status;; esac; done' | head -1)" = 10004 ] || bad "the holding page must run as bzcad"
if docker exec -e LD_PRELOAD= bz-ep-hold sh -c 'for p in /proc/[0-9]*; do tr "\0" " " <$p/cmdline 2>/dev/null; echo; done' | grep -q -- "-m opensketch"; then bad "the CAD server started on an empty volume"; fi
[ "$(rstat %u "$tmp/cadvol/cad")" = 10004 ] || bad "/data/cad not given to bzcad"
if as_root 'test -e /t/cadvol/cad/users.json'; then bad "the holding page wrote CAD data"; fi
docker rm -f bz-ep-hold >/dev/null
ok "cad without its data: the holding page (200 health with ok false, 503 elsewhere), as bzcad; no CAD server"

# BIZOMAT_CAD_ALLOW_EMPTY=1 starts the CAD server on an empty volume (the fake service stands in for it)
mkdir -p "$tmp/cadvol3"
docker run --rm --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=cad -e BIZOMAT_CAD_ALLOW_EMPTY=1 -v "$tmp/cadvol3:/data" -v "$FAKE:/fake.mjs:ro" \
  "$IMAGE" bash -c '
    sed "s#CMD=(/opt/cad/venv/bin/python -m opensketch#CMD=(/usr/local/bin/node /fake.mjs#" /usr/local/bin/bizomat-entrypoint >/tmp/ep
    bash /tmp/ep cad' >"$tmp/cad-empty.json" 2>"$tmp/stderr"
[ "$(uid "$tmp/cad-empty.json")" = 10004 ] || bad "BIZOMAT_CAD_ALLOW_EMPTY=1 did not start the CAD server"
grep -q "starting an empty CAD server" "$tmp/stderr" || bad "empty-start warning"
ok "cad starts an empty CAD server only with BIZOMAT_CAD_ALLOW_EMPTY=1, and says so"

# proxy: only its own settings
run_role proxy /app/proxy/server.mjs >"$tmp/proxy.json"
[ "$(uid "$tmp/proxy.json")" = 10001 ] || bad "proxy uid"
for n in UPSTREAM_WEB UPSTREAM_CAD BIZOMAT_PREVIEW_ROUTING PROXY_LOG FLY_APP_NAME PROXY_HOST; do has "$tmp/proxy.json" "$n" || bad "proxy lacks $n"; done
for n in OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET CF_AI_TOKEN WEB_EXTRA LD_PRELOAD NODE_OPTIONS; do
  if has "$tmp/proxy.json" "$n"; then bad "proxy holds $n"; fi
done
ok "proxy: its own settings only, uid 10001"

# web: its secrets, nothing of cad's or work's
run_role web /app/web/dist-server/server.mjs >"$tmp/web.json"
[ "$(uid "$tmp/web.json")" = 10002 ] || bad "web uid"
[ "$(val "$tmp/web.json" PORT)" = 8003 ] && [ "$(val "$tmp/web.json" WEB_DIST_DIR)" = /app/web/dist ] && [ "$(val "$tmp/web.json" WEB_TRUST_PROXY)" = 1 ] || bad "web fixed settings"
[ "$(val "$tmp/web.json" CF_AI_TOKEN)" = throwaway-web-token ] && [ "$(val "$tmp/web.json" WEB_EXTRA)" = web-setting ] || bad "web settings"
for n in OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET UPSTREAM_CAD LD_PRELOAD NODE_OPTIONS; do
  if has "$tmp/web.json" "$n"; then bad "web holds $n"; fi
done
ok "web: PORT 8003, its own secrets only, uid 10002"

# work: mapped names, the work Google client (never the app-wide or cad one), a secret file, its volume
as_root 'mkdir -p /t/workvol/work/.secrets /t/workvol/work/files
  echo from-the-volume >/t/workvol/work/.secrets/WORK_EXTRA_SECRET
  chmod 0644 /t/workvol/work/.secrets/WORK_EXTRA_SECRET
  echo not-for-work >/t/workvol/work/.secrets/OPENSKETCH_KEY_SECRET
  echo x >/t/workvol/work/.secrets/LD_PRELOAD
  ln -s /etc/shadow /t/workvol/work/.secrets/GOOGLE_CLIENT_ID
  touch /t/workvol/work/files/old-file'
run_role work /app/work/dist/node/server.mjs -v "$tmp/workvol:/data" >"$tmp/work.json"
[ "$(uid "$tmp/work.json")" = 10003 ] || bad "work uid"
[ "$(val "$tmp/work.json" APP_URL)" = https://work.example.test ] || bad "APP_URL from WORK_APP_URL"
[ "$(val "$tmp/work.json" CANONICAL_URL)" = https://example.test/tasks ] || bad "CANONICAL_URL from WORK_CANONICAL_URL"
[ "$(val "$tmp/work.json" APP_NAME)" = "BIZOMAT Project Management" ] || bad "APP_NAME default"
[ "$(val "$tmp/work.json" ALLOW_SIGNUP)" = false ] && [ "$(val "$tmp/work.json" SESSION_TTL_HOURS)" = 72 ] || bad "work defaults"
[ "$(val "$tmp/work.json" GOOGLE_CLIENT_SECRET)" = throwaway-work-secret ] || bad "GOOGLE_CLIENT_SECRET must be the work one"
[ "$(val "$tmp/work.json" GOOGLE_CLIENT_ID)" = work-id ] || bad "a linked secret file must be skipped"
[ "$(val "$tmp/work.json" WORK_EXTRA_SECRET)" = from-the-volume ] || bad "secret file not read"
[ "$(val "$tmp/work.json" WORK_DATA_DIR)" = /data/work ] && [ "$(val "$tmp/work.json" PORT)" = 8002 ] || bad "work fixed settings"
for n in OPENSKETCH_KEY_SECRET CAD_GOOGLE_CLIENT_SECRET CF_AI_TOKEN LD_PRELOAD NODE_OPTIONS UPSTREAM_CAD; do
  if has "$tmp/work.json" "$n"; then bad "work holds $n"; fi
done
[ "$(rstat %u "$tmp/workvol/work")" = 10003 ] && [ "$(rstat %a "$tmp/workvol/work")" = 700 ] || bad "/data/work owner or mode"
[ "$(rstat %u "$tmp/workvol/work/files/old-file")" = 10003 ] || bad "files in /data/work given to bzwork"
[ "$(rstat %u "$tmp/workvol/work/.secrets")" = 0 ] && [ "$(rstat %a "$tmp/workvol/work/.secrets")" = 700 ] || bad ".secrets must stay root 0700"
[ "$(rstat %a "$tmp/workvol/work/.secrets/WORK_EXTRA_SECRET")" = 600 ] || bad "secret file mode not fixed to 0600"
grep -q "secret file OPENSKETCH_KEY_SECRET skipped" "$tmp/stderr" || bad "another role's setting in a secret file must be skipped"
grep -q "secret file GOOGLE_CLIENT_ID skipped: not a regular file" "$tmp/stderr" || bad "link not reported"
if grep -q "throwaway\|from-the-volume\|not-for-work" "$tmp/stderr"; then bad "a value reached the log"; fi
ok "work: mapped names, its own Google client, secret files (links and other roles' names refused), volume prepared"

# cad: its own settings, the cad Google client, a setting from its volume, the CADOS commit as its version (the volume
# holds CAD data, as after the data move)
as_root 'mkdir -p /t/cadvol2/cad/.secrets
  printf %s "{\"users\": [], \"invites\": []}" >/t/cadvol2/cad/users.json
  printf %s from-the-cad-volume >/t/cadvol2/cad/.secrets/OPENSKETCH_PASSWORD'
docker run --rm --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=cad -v "$tmp/cadvol2:/data" -v "$FAKE:/fake.mjs:ro" \
  "$IMAGE" bash -c '
    # the real entrypoint, with only the final command swapped for the fake service (env -i and setpriv kept)
    sed "s#CMD=(/opt/cad/venv/bin/python -m opensketch#CMD=(/usr/local/bin/node /fake.mjs#" /usr/local/bin/bizomat-entrypoint >/tmp/ep
    bash /tmp/ep cad' >"$tmp/cad.json" 2>"$tmp/stderr"
[ "$(uid "$tmp/cad.json")" = 10004 ] || bad "cad uid"
[ "$(val "$tmp/cad.json" OPENSKETCH_DATA)" = /data/cad ] && [ "$(val "$tmp/cad.json" OPENSKETCH_KEY_SECRET)" = throwaway-cad-key ] || bad "cad settings"
[ "$(val "$tmp/cad.json" OPENSKETCH_PASSWORD)" = from-the-cad-volume ] || bad "a setting from the cad volume (.secrets)"
[ "$(val "$tmp/cad.json" GOOGLE_CLIENT_SECRET)" = throwaway-cad-secret ] || bad "GOOGLE_CLIENT_SECRET must be the cad one"
pin="$(docker run --rm --entrypoint python3 "$IMAGE" -c 'import json; print(json.load(open("/app/cad/cad-source.json"))["commit"][:7])')"
[ -n "$pin" ] && [ "$(val "$tmp/cad.json" OPENSKETCH_VERSION)" = "$pin" ] || bad "OPENSKETCH_VERSION must be the CADOS commit of apps/cad ($pin)"
if grep -q "from-the-cad-volume\|throwaway" "$tmp/stderr"; then bad "a value reached the log"; fi
for n in WORK_GOOGLE_CLIENT_SECRET CF_AI_TOKEN WORK_APP_URL UPSTREAM_CAD LD_PRELOAD NODE_OPTIONS; do
  if has "$tmp/cad.json" "$n"; then bad "cad holds $n"; fi
done
ok "cad: its own settings, its own Google client, its volume's settings, the CADOS commit as version, uid 10004"

# maintenance mode: the service is not started, the Machine stays up
mkdir -p "$tmp/maint"
touch "$tmp/maint/.bizomat-maintenance"
docker run -d --name bz-ep-maint --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=work -v "$tmp/maint:/data" \
  "$IMAGE" /usr/local/bin/bizomat-entrypoint work >/dev/null
# The entrypoint prepares the volume before it says so: wait for the message (a fixed 2 s lost the race on a busy
# runner), then check the Machine is still up a moment later. The logs are read whole, not piped into grep -q,
# which under pipefail can fail a pipeline whose text matched (docker logs gets SIGPIPE).
for _ in $(seq 1 30); do grep -q "maintenance mode" <<<"$(docker logs bz-ep-maint 2>&1)" && break; sleep 1; done
grep -q "maintenance mode" <<<"$(docker logs bz-ep-maint 2>&1)" || bad "maintenance message"
sleep 2
[ "$(docker inspect -f '{{.State.Running}}' bz-ep-maint)" = true ] || bad "maintenance container stopped"
docker rm -f bz-ep-maint >/dev/null
ok "maintenance mode keeps the Machine up without the service"

# cad in maintenance (data in place): the holding page says so; the CAD server does not start
mkdir -p "$tmp/cadmaint"
touch "$tmp/cadmaint/.bizomat-maintenance"
as_root 'mkdir -p /t/cadmaint/cad && printf %s "{}" >/t/cadmaint/cad/users.json'
docker run -d --name bz-ep-cadmaint --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=cad -v "$tmp/cadmaint:/data" \
  "$IMAGE" /usr/local/bin/bizomat-entrypoint cad >/dev/null
wait_log bz-ep-cadmaint "answering on port 8001" || bad "cad maintenance: no holding page"
[[ "$(hold_get bz-ep-cadmaint /healthz)" == *'"status": "maintenance"'* ]] || bad "cad maintenance status"
[[ "$(hold_get bz-ep-cadmaint /cad/login)" == "503 30 "* ]] || bad "cad maintenance must answer 503"
docker rm -f bz-ep-cadmaint >/dev/null
ok "cad maintenance mode: the holding page, the CAD server not started"

# ------------------------------------------------------------------------------------------------ all
# fly.website.toml's one Machine: `bizomat-entrypoint all` on the work group's Machine runs the real proxy, website and
# Project Management together on the volume.
in_get() { # container port path [Host]: "<status> <body>" of a GET from inside the container (redirects not followed)
  docker exec -e LD_PRELOAD= "$1" python3 -c 'import sys, urllib.request, urllib.error
class Keep(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
h = {"Host": sys.argv[3]} if sys.argv[3] else {}
try:
    r = urllib.request.build_opener(Keep).open(urllib.request.Request("http://127.0.0.1:" + sys.argv[1] + sys.argv[2], headers=h), timeout=5)
except urllib.error.HTTPError as e:
    r = e
except Exception as e:
    print(0, type(e).__name__)
    sys.exit(0)
print(r.status, r.read().decode(errors="replace")[:4000])' "$2" "$3" "${4:-}"
}
# the proxy reports web and work healthy (cad is the cados app, out of reach here)
all_ready() {
  local r
  for _ in $(seq 1 60); do
    r="$(in_get "$1" 8080 /__proxy/ready 2>/dev/null || true)"
    if python3 -c 'import json, sys; u = json.loads(sys.argv[1].split(" ", 1)[1])["upstreams"]; sys.exit(0 if u["web"]["ok"] and u["work"]["ok"] else 1)' "$r" 2>/dev/null; then return 0; fi
    sleep 1
  done
  return 1
}
proc_env() { # container uid script: UID=<uid> then the environment of the node process running that script, read as
  # the service's own user (only it, or root with CAP_SYS_PTRACE, may read it)
  docker exec -e LD_PRELOAD= -u "$2" "$1" python3 -c 'import os, sys
for p in sorted(x for x in os.listdir("/proc") if x.isdigit()):
    try:
        cmd = open(f"/proc/{p}/cmdline", "rb").read().split(b"\0")
    except OSError:
        continue
    if len(cmd) > 1 and cmd[0].endswith(b"/node") and cmd[1].decode() == sys.argv[1]:
        st = open(f"/proc/{p}/status").read()
        print("UID=" + [l.split()[1] for l in st.splitlines() if l.startswith("Uid:")][0])
        print(open(f"/proc/{p}/environ", "rb").read().replace(b"\0", b"\n").decode())
        break' "$3"
}
in_env() { grep -qx -- "$2" <<<"$1"; }
has_name() { grep -q -- "^$2=" <<<"$1"; }

# refusals: all only on the work group's Machine, and the roles it starts never run alone on it
if docker run --rm -e FLY_PROCESS_GROUP=web "$IMAGE" /usr/local/bin/bizomat-entrypoint all 2>"$tmp/e" >/dev/null; then bad "all accepted on a web Machine"; fi
grep -q "process group 'web' but was asked to run 'all'" "$tmp/e" || bad "all on another group: message"
if docker run --rm -e FLY_PROCESS_GROUP=work "$IMAGE" /usr/local/bin/bizomat-entrypoint proxy 2>"$tmp/e" >/dev/null; then bad "proxy accepted on the work Machine without all"; fi
if docker run --rm -e FLY_PROCESS_GROUP=work -e BIZOMAT_UNDER_ALL=1 "$IMAGE" /usr/local/bin/bizomat-entrypoint cad 2>"$tmp/e" >/dev/null; then bad "cad accepted under all"; fi
ok "all: only on the work group's Machine; proxy, web and cad never run there on their own"

# without the volume, work refuses to start, and all stops the rest and exits non-zero (Fly restarts the Machine)
set +e
timeout 60 docker run --rm --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=work -e PROXY_SHUTDOWN_GRACE_MS=500 \
  "$IMAGE" /usr/local/bin/bizomat-entrypoint all >/dev/null 2>"$tmp/e"
rc=$?
set -e
[ "$rc" != 0 ] && [ "$rc" != 124 ] || bad "all without the volume must exit non-zero by itself (got $rc)"
grep -q "not a mounted volume" "$tmp/e" || bad "all without the volume: work's message"
grep -q "all: work exited with status 1" "$tmp/e" || bad "all without the volume: which service stopped"
ok "all: work without its volume stops the Machine (exit $rc)"

# the three services, each as its own user with its own settings; the proxy on 127.0.0.1 for web and work
mkdir -p "$tmp/allvol"
docker run -d --name bz-ep-all --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=work -e PROXY_SHUTDOWN_GRACE_MS=1000 \
  -v "$tmp/allvol:/data" "$IMAGE" /usr/local/bin/bizomat-entrypoint all >/dev/null
all_ready bz-ep-all || bad "all: the proxy does not see web and work ($(docker logs bz-ep-all 2>&1 | tail -5))"
p="$(proc_env bz-ep-all 10001 /app/proxy/server.mjs)"
w="$(proc_env bz-ep-all 10002 /app/web/dist-server/server.mjs)"
k="$(proc_env bz-ep-all 10003 /app/work/dist/node/server.mjs)"
in_env "$p" UID=10001 || bad "all: proxy must run as bzproxy"
in_env "$w" UID=10002 || bad "all: web must run as bzweb"
in_env "$k" UID=10003 || bad "all: work must run as bzwork"
in_env "$p" UPSTREAM_WEB=http://127.0.0.1:8003 || bad "all: the proxy must reach web on 127.0.0.1"
in_env "$p" UPSTREAM_WORK=http://127.0.0.1:8002 || bad "all: the proxy must reach work on 127.0.0.1"
in_env "$p" UPSTREAM_CAD=http://cad:8001 || bad "all: UPSTREAM_CAD comes from the configuration"
for n in OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET CF_AI_TOKEN GOOGLE_CLIENT_SECRET LD_PRELOAD NODE_OPTIONS BIZOMAT_UNDER_ALL; do
  if has_name "$p" "$n"; then bad "all: proxy holds $n"; fi
done
in_env "$w" CF_AI_TOKEN=throwaway-web-token || bad "all: web settings"
for n in OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET UPSTREAM_CAD UPSTREAM_WEB LD_PRELOAD NODE_OPTIONS BIZOMAT_UNDER_ALL; do
  if has_name "$w" "$n"; then bad "all: web holds $n"; fi
done
in_env "$k" GOOGLE_CLIENT_SECRET=throwaway-work-secret || bad "all: work must have its own Google client"
in_env "$k" WORK_DATA_DIR=/data/work || bad "all: work's data directory"
for n in OPENSKETCH_KEY_SECRET CAD_GOOGLE_CLIENT_SECRET CF_AI_TOKEN UPSTREAM_CAD LD_PRELOAD NODE_OPTIONS BIZOMAT_UNDER_ALL; do
  if has_name "$k" "$n"; then bad "all: work holds $n"; fi
done
[ "$(rstat %u "$tmp/allvol/work")" = 10003 ] || bad "all: /data/work given to bzwork"
ok "all: proxy, web and work each as its own user with only its own settings; the proxy reaches the others on 127.0.0.1"

[[ "$(in_get bz-ep-all 8080 /tasks/api/health bizomat.ai)" == "200 "* ]] || bad "all: bizomat.ai/tasks/api/health through the proxy"
[[ "$(in_get bz-ep-all 8080 / bizomat.ai)" == "200 "*BIZOMAT* ]] || bad "all: the website through the proxy"
[[ "$(in_get bz-ep-all 8003 /healthz)" == "200 "* ]] && [[ "$(in_get bz-ep-all 8002 /api/health)" == "200 "* ]] || bad "all: the health checks on 8003 and 8002"
ok "all: bizomat.ai and bizomat.ai/tasks through the proxy; each health endpoint answers"

# SIGTERM (fly machine stop, a deploy): the proxy stops first, then web and work; exit 0
started=$SECONDS
docker kill -s TERM bz-ep-all >/dev/null
rc="$(timeout 40 docker wait bz-ep-all || echo timeout)"
[ "$rc" = 0 ] || bad "all: SIGTERM must end with exit 0 (got $rc)"
[ $((SECONDS - started)) -lt 30 ] || bad "all: SIGTERM took $((SECONDS - started)) s"
docker logs bz-ep-all >"$tmp/all.log" 2>&1
grep -q "all: SIGTERM received" "$tmp/all.log" || bad "all: SIGTERM message"
grep -q "all: stopped" "$tmp/all.log" || bad "all: stopped message"
a="$(grep -n '"msg":"stopped"' "$tmp/all.log" | head -1 | cut -d: -f1)"
b="$(grep -n '"event":"shutdown"' "$tmp/all.log" | head -1 | cut -d: -f1)"
[ -n "$a" ] && [ -n "$b" ] && [ "$a" -lt "$b" ] || bad "all: the proxy must stop before work (proxy line ${a:-none}, work line ${b:-none})"
if grep -q "still running: killed" "$tmp/all.log"; then bad "all: a service had to be killed"; fi
docker rm -f bz-ep-all >/dev/null
ok "all: SIGTERM stops the proxy, then web and work, and exits 0 ($((SECONDS - started)) s)"

# a service that dies takes the others down, and all exits with its status (Fly restarts the Machine)
docker run -d --name bz-ep-all-dies --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=work -e PROXY_SHUTDOWN_GRACE_MS=1000 \
  -v "$tmp/allvol:/data" "$IMAGE" /usr/local/bin/bizomat-entrypoint all >/dev/null
all_ready bz-ep-all-dies || bad "all: second start"
docker exec -e LD_PRELOAD= bz-ep-all-dies sh -c 'for p in /proc/[0-9]*; do case "$(tr "\0" " " <$p/cmdline 2>/dev/null)" in "/usr/local/bin/node /app/web/dist-server/server.mjs"*) kill -KILL "${p#/proc/}";; esac; done'
rc="$(timeout 40 docker wait bz-ep-all-dies || echo timeout)"
[ "$rc" = 137 ] || bad "all: after web was killed, exit with its status 137 (got $rc)"
grep -q "all: web exited with status 137" <<<"$(docker logs bz-ep-all-dies 2>&1)" || bad "all: which service died"
docker rm -f bz-ep-all-dies >/dev/null
ok "all: a service that dies stops the others; exit with its status"

# maintenance mode: work is not started, the Machine stays up, the website answers and /tasks is 502
mkdir -p "$tmp/allmaint"
touch "$tmp/allmaint/.bizomat-maintenance"
docker run -d --name bz-ep-all-maint --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=work -e PROXY_SHUTDOWN_GRACE_MS=1000 \
  -v "$tmp/allmaint:/data" "$IMAGE" /usr/local/bin/bizomat-entrypoint all >/dev/null
for _ in $(seq 1 60); do [[ "$(in_get bz-ep-all-maint 8080 / bizomat.ai 2>/dev/null)" == "200 "* ]] && break; sleep 1; done
[[ "$(in_get bz-ep-all-maint 8080 / bizomat.ai)" == "200 "* ]] || bad "all in maintenance: the website must answer"
[[ "$(in_get bz-ep-all-maint 8080 /tasks/api/health bizomat.ai)" == "502 "* ]] || bad "all in maintenance: /tasks must be 502"
grep -q "maintenance mode" <<<"$(docker logs bz-ep-all-maint 2>&1)" || bad "all in maintenance: message"
[ "$(docker inspect -f '{{.State.Running}}' bz-ep-all-maint)" = true ] || bad "all in maintenance: stopped"
docker rm -f bz-ep-all-maint >/dev/null
ok "all in maintenance mode: work not started, the website up, /tasks 502"

echo "entrypoint: all $passed checks passed"
