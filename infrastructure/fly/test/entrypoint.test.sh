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
trap 'docker rm -f bz-ep-maint bz-ep-hold bz-ep-cadmaint >/dev/null 2>&1 || true; as_root "rm -rf /t/*" >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
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
  -e WORK_BREVO_API_KEY=throwaway-brevo-key -e WORK_EMAIL_FROM_ADDRESS=notifications@example.test
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
for n in OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET CF_AI_TOKEN WEB_EXTRA LD_PRELOAD NODE_OPTIONS WORK_BREVO_API_KEY BREVO_API_KEY; do
  if has "$tmp/proxy.json" "$n"; then bad "proxy holds $n"; fi
done
ok "proxy: its own settings only, uid 10001"

# web: its secrets, nothing of cad's or work's
run_role web /app/web/dist-server/server.mjs >"$tmp/web.json"
[ "$(uid "$tmp/web.json")" = 10002 ] || bad "web uid"
[ "$(val "$tmp/web.json" PORT)" = 8003 ] && [ "$(val "$tmp/web.json" WEB_DIST_DIR)" = /app/web/dist ] && [ "$(val "$tmp/web.json" WEB_TRUST_PROXY)" = 1 ] || bad "web fixed settings"
[ "$(val "$tmp/web.json" CF_AI_TOKEN)" = throwaway-web-token ] && [ "$(val "$tmp/web.json" WEB_EXTRA)" = web-setting ] || bad "web settings"
for n in OPENSKETCH_KEY_SECRET WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET UPSTREAM_CAD LD_PRELOAD NODE_OPTIONS WORK_BREVO_API_KEY BREVO_API_KEY; do
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
[ "$(val "$tmp/work.json" BREVO_API_KEY)" = throwaway-brevo-key ] || bad "BREVO_API_KEY from WORK_BREVO_API_KEY"
[ "$(val "$tmp/work.json" EMAIL_FROM_ADDRESS)" = notifications@example.test ] || bad "EMAIL_FROM_ADDRESS from WORK_EMAIL_FROM_ADDRESS"
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

echo "entrypoint: all $passed checks passed"
