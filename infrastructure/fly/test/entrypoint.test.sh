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
trap 'docker rm -f bz-ep-maint >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
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
  -e OPENSKETCH_PUBLIC_URL=https://cad.example.test -e OPENSKETCH_PASSWORD=throwaway-cad-password
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
mkdir -p "$tmp/cadvol"
if docker run --rm --network none -e FLY_APP_NAME=bizomat-test -v "$tmp/cadvol:/data" "$IMAGE" /usr/local/bin/bizomat-entrypoint cad 2>"$tmp/e" >/dev/null; then
  bad "cad started on Fly without OPENSKETCH_PASSWORD"
fi
grep -q "refusing to start an open CAD server" "$tmp/e" || bad "open-cad message"
ok "cad never starts on Fly without its password"

# proxy: only its own settings
run_role proxy /app/proxy/server.mjs >"$tmp/proxy.json"
[ "$(uid "$tmp/proxy.json")" = 10001 ] || bad "proxy uid"
for n in UPSTREAM_WEB UPSTREAM_CAD BIZOMAT_PREVIEW_ROUTING PROXY_LOG FLY_APP_NAME PROXY_HOST; do has "$tmp/proxy.json" "$n" || bad "proxy lacks $n"; done
for n in OPENSKETCH_PASSWORD WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET CF_AI_TOKEN WEB_EXTRA LD_PRELOAD NODE_OPTIONS; do
  if has "$tmp/proxy.json" "$n"; then bad "proxy holds $n"; fi
done
ok "proxy: its own settings only, uid 10001"

# web: its secrets, nothing of cad's or work's
run_role web /app/web/dist-server/server.mjs >"$tmp/web.json"
[ "$(uid "$tmp/web.json")" = 10002 ] || bad "web uid"
[ "$(val "$tmp/web.json" PORT)" = 8003 ] && [ "$(val "$tmp/web.json" WEB_DIST_DIR)" = /app/web/dist ] && [ "$(val "$tmp/web.json" WEB_TRUST_PROXY)" = 1 ] || bad "web fixed settings"
[ "$(val "$tmp/web.json" CF_AI_TOKEN)" = throwaway-web-token ] && [ "$(val "$tmp/web.json" WEB_EXTRA)" = web-setting ] || bad "web settings"
for n in OPENSKETCH_PASSWORD WORK_GOOGLE_CLIENT_SECRET CAD_GOOGLE_CLIENT_SECRET GOOGLE_CLIENT_SECRET UPSTREAM_CAD LD_PRELOAD NODE_OPTIONS; do
  if has "$tmp/web.json" "$n"; then bad "web holds $n"; fi
done
ok "web: PORT 8003, its own secrets only, uid 10002"

# work: mapped names, the work Google client (never the app-wide or cad one), a secret file, its volume
mkdir -p "$tmp/workvol/work/.secrets" "$tmp/workvol/work/files"
echo "from-the-volume" >"$tmp/workvol/work/.secrets/WORK_EXTRA_SECRET"
chmod 0644 "$tmp/workvol/work/.secrets/WORK_EXTRA_SECRET"
echo "not-for-work" >"$tmp/workvol/work/.secrets/OPENSKETCH_PASSWORD"
echo "x" >"$tmp/workvol/work/.secrets/LD_PRELOAD"
ln -s /etc/shadow "$tmp/workvol/work/.secrets/GOOGLE_CLIENT_ID"
touch "$tmp/workvol/work/files/old-file"
run_role work /app/work/dist/node/server.mjs -v "$tmp/workvol:/data" >"$tmp/work.json"
[ "$(uid "$tmp/work.json")" = 10003 ] || bad "work uid"
[ "$(val "$tmp/work.json" APP_URL)" = https://work.example.test ] || bad "APP_URL from WORK_APP_URL"
[ "$(val "$tmp/work.json" APP_NAME)" = "BIZOMAT Project Management" ] || bad "APP_NAME default"
[ "$(val "$tmp/work.json" ALLOW_SIGNUP)" = false ] && [ "$(val "$tmp/work.json" SESSION_TTL_HOURS)" = 336 ] || bad "work defaults"
[ "$(val "$tmp/work.json" GOOGLE_CLIENT_SECRET)" = throwaway-work-secret ] || bad "GOOGLE_CLIENT_SECRET must be the work one"
[ "$(val "$tmp/work.json" GOOGLE_CLIENT_ID)" = work-id ] || bad "a linked secret file must be skipped"
[ "$(val "$tmp/work.json" WORK_EXTRA_SECRET)" = from-the-volume ] || bad "secret file not read"
[ "$(val "$tmp/work.json" WORK_DATA_DIR)" = /data/work ] && [ "$(val "$tmp/work.json" PORT)" = 8002 ] || bad "work fixed settings"
for n in OPENSKETCH_PASSWORD CAD_GOOGLE_CLIENT_SECRET CF_AI_TOKEN LD_PRELOAD NODE_OPTIONS UPSTREAM_CAD; do
  if has "$tmp/work.json" "$n"; then bad "work holds $n"; fi
done
[ "$(stat -c %u "$tmp/workvol/work")" = 10003 ] && [ "$(stat -c %a "$tmp/workvol/work")" = 700 ] || bad "/data/work owner or mode"
[ "$(stat -c %u "$tmp/workvol/work/files/old-file")" = 10003 ] || bad "files in /data/work given to bzwork"
[ "$(stat -c %u "$tmp/workvol/work/.secrets")" = 0 ] && [ "$(stat -c %a "$tmp/workvol/work/.secrets")" = 700 ] || bad ".secrets must stay root 0700"
[ "$(stat -c %a "$tmp/workvol/work/.secrets/WORK_EXTRA_SECRET")" = 600 ] || bad "secret file mode not fixed to 0600"
grep -q "secret file OPENSKETCH_PASSWORD skipped" "$tmp/stderr" || bad "another role's setting in a secret file must be skipped"
grep -q "secret file GOOGLE_CLIENT_ID skipped: not a regular file" "$tmp/stderr" || bad "link not reported"
if grep -q "throwaway\|from-the-volume\|not-for-work" "$tmp/stderr"; then bad "a value reached the log"; fi
ok "work: mapped names, its own Google client, secret files (links and other roles' names refused), volume prepared"

# cad: its own settings, the cad Google client
mkdir -p "$tmp/cadvol2"
docker run --rm --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=cad -v "$tmp/cadvol2:/data" -v "$FAKE:/fake.mjs:ro" \
  "$IMAGE" bash -c '
    # the real entrypoint, with only the final command swapped for the fake service (env -i and setpriv kept)
    sed "s#CMD=(/opt/cad/venv/bin/python -m opensketch#CMD=(/usr/local/bin/node /fake.mjs#" /usr/local/bin/bizomat-entrypoint >/tmp/ep
    bash /tmp/ep cad' >"$tmp/cad.json" 2>"$tmp/stderr"
[ "$(uid "$tmp/cad.json")" = 10004 ] || bad "cad uid"
[ "$(val "$tmp/cad.json" OPENSKETCH_DATA)" = /data/cad ] && [ "$(val "$tmp/cad.json" OPENSKETCH_PASSWORD)" = throwaway-cad-password ] || bad "cad settings"
[ "$(val "$tmp/cad.json" GOOGLE_CLIENT_SECRET)" = throwaway-cad-secret ] || bad "GOOGLE_CLIENT_SECRET must be the cad one"
[ "$(val "$tmp/cad.json" OPENSKETCH_VERSION)" != "" ] || bad "OPENSKETCH_VERSION"
for n in WORK_GOOGLE_CLIENT_SECRET CF_AI_TOKEN WORK_APP_URL UPSTREAM_CAD LD_PRELOAD NODE_OPTIONS; do
  if has "$tmp/cad.json" "$n"; then bad "cad holds $n"; fi
done
ok "cad: its own settings, its own Google client, uid 10004"

# maintenance mode: the service is not started, the Machine stays up
mkdir -p "$tmp/maint"
touch "$tmp/maint/.bizomat-maintenance"
docker run -d --name bz-ep-maint --network none "${APP_ENV[@]}" -e FLY_PROCESS_GROUP=work -v "$tmp/maint:/data" \
  "$IMAGE" /usr/local/bin/bizomat-entrypoint work >/dev/null
sleep 2
[ "$(docker inspect -f '{{.State.Running}}' bz-ep-maint)" = true ] || bad "maintenance container stopped"
docker logs bz-ep-maint 2>&1 | grep -q "maintenance mode" || bad "maintenance message"
docker rm -f bz-ep-maint >/dev/null
ok "maintenance mode keeps the Machine up without the service"

echo "entrypoint: all $passed checks passed"
