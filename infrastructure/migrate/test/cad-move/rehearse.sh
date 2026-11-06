#!/bin/bash
# A full rehearsal of the CAD Automation move (infrastructure/migrate/cad/to-fly.mjs) on one Linux computer, with
# fake-fly.mjs standing in for flyctl: the old cados Machine and the cad Machine each run in their own mount and PID
# namespaces with their own /data and /tmp; the cad Machine runs the real entrypoint (holding page, then the CAD server),
# the real export, verify, import and restore scripts; the router is the real proxy. The CAD server is cad-standin.py.
#
#   sudo bash infrastructure/migrate/test/cad-move/rehearse.sh
#
# Root only, on a throwaway computer or container (CI): it adds the platform's four users (bzproxy ... bzcad, as the
# image has them) and empty mount points (/data, /app/cad, /usr/local/lib/bizomat, /opt/cad/venv/bin/python,
# /usr/local/bin/bizomat-entrypoint) if they are missing, uses ports 8080, 8001 and 18080, and works in
# /var/tmp/bizomat-cad-rehearsal (not /tmp: each Machine has a /tmp of its own). Throwaway data and values only.
# SC2016: the single-quoted scripts run inside a Machine or later (eval); SC2015: A && B || bad means both must hold
# shellcheck disable=SC2016,SC2015
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../../../.." && pwd)"
TOOL="$REPO/infrastructure/migrate/cad/to-fly.mjs"
W=/var/tmp/bizomat-cad-rehearsal
PY="$(command -v python3)"
NODE="$(command -v node)"
passed=0
ok() {
  passed=$((passed + 1))
  printf 'rehearse: ok  %s\n' "$*"
}
bad() {
  printf 'rehearse: FAIL %s\n' "$*" >&2
  exit 1
}

[ "$(id -u)" = 0 ] || bad "run as root (namespaces, the platform users, bind mounts)"
for t in unshare nsenter setpriv tar sha256sum; do command -v "$t" >/dev/null || bad "$t is missing"; done
"$PY" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 12) else 1)' || bad "python3 3.12 or newer is needed (tarfile data filter)"

cleanup() {
  if [ -f "$W/state.json" ]; then
    for id in m_old m_cad m_proxy; do
      pid="$("$PY" -c 'import json,sys; m=json.load(open(sys.argv[1]))["machines"].get(sys.argv[2], {}); print(m.get("pid") or 0)' "$W/state.json" "$id" 2>/dev/null || echo 0)"
      [ "$pid" != 0 ] && kill -9 "$pid" 2>/dev/null || true
    done
  fi
}
trap cleanup EXIT
cleanup
rm -rf "$W"
mkdir -p "$W/bin" "$W/libbz" "$W/appcad/opensketch" "$W/out"
chmod 0755 "$W" "$W/appcad" "$W/appcad/opensketch"

# the platform's users and the mount points, as in the image
for spec in bzproxy:10001 bzweb:10002 bzwork:10003 bzcad:10004; do
  name="${spec%%:*}"
  id="${spec##*:}"
  getent group "$name" >/dev/null || groupadd --system --gid "$id" "$name"
  id -u "$name" >/dev/null 2>&1 || useradd --system --uid "$id" --gid "$id" --home-dir "/home/$name" --create-home --shell /usr/sbin/nologin "$name"
done
mkdir -p /data /app/cad /usr/local/lib/bizomat /opt/cad/venv/bin
[ -e /opt/cad/venv/bin/python ] || touch /opt/cad/venv/bin/python
[ -e /usr/local/bin/bizomat-entrypoint ] || touch /usr/local/bin/bizomat-entrypoint
# the image's Python is /usr/local/bin/python3 (the entrypoint starts the holding page with it)
[ -e /usr/local/bin/python3 ] || ln -s "$PY" /usr/local/bin/python3

# what the cad Machine's image holds
cp -r "$REPO/infrastructure/migrate" "$W/libbz/migrate"
cp "$REPO/infrastructure/fly/cad-holding.py" "$W/libbz/cad-holding.py"
cp "$REPO/apps/cad-source.json" "$W/appcad/cad-source.json"
cp "$HERE/cad-standin.py" "$W/cad-standin.py"
printf '#!/bin/sh\nexec %s %s "$@"\n' "$PY" "$W/cad-standin.py" >"$W/python-wrapper"
chmod -R a+rX "$W/libbz" "$W/appcad" "$W/cad-standin.py"
chmod 0755 "$W/python-wrapper"
PIN="$("$PY" -c 'import json,sys; print(json.load(open(sys.argv[1]))["commit"][:7])' "$REPO/apps/cad-source.json")"

# the old app's data folder: every kind of file CAD Automation keeps (throwaway values)
for id in m_old m_cad; do
  mkdir -p "$W/m/$id/data" "$W/m/$id/tmp"
  chmod 1777 "$W/m/$id/tmp"
done
OLD="$W/m/m_old/data"
mkdir -p "$OLD/uploads/u1" "$OLD/artifacts" "$OLD/bridge-files/c1"
"$NODE" -e 'const {generateKeyPairSync}=require("crypto"); process.stdout.write(generateKeyPairSync("ec",{namedCurve:"P-256"}).privateKey.export({type:"pkcs8",format:"pem"}))' >"$OLD/bridge-signing-key.pem"
"$PY" - "$OLD" <<'PY'
import json, os, secrets, sqlite3, sys
d = sys.argv[1]
def w(name, value):
    with open(os.path.join(d, name), "w") as fh:
        fh.write(value if isinstance(value, str) else json.dumps(value))
w("secret.keys", secrets.token_hex(32))
w("secret", secrets.token_hex(32))
w("ai_keys.secret", secrets.token_hex(32))
w("users.json", {"users": [{"id": "u1", "email": "owner@example.test", "role": "owner"},
                           {"id": "u2", "email": "member@example.test", "role": "member"}], "invites": [], "settings": {}})
w("accounts.enabled", "")
w("sessions.json", {secrets.token_hex(32): {"user": "u1", "created": 1, "expires": 4102444800}})
w("mcp_oauth.json", {"clients": {"c1": {}, "c2": {}}, "access": {},
                     "grants": {"g1": {"user": "u1", "client_id": "c1", "resource": "https://bizomat.ai/cad/mcp"},
                                "g2": {"user": "u2", "client_id": "c2", "resource": "https://cados.kevos.com/mcp"}}})
w("swbridge.json", {"keys": {"u1": 1}})
w("google_oauth.json", {"client_id": "throwaway"})
w("users.json.42.tmp", "half-written, never moved")
w(os.path.join("uploads", "u1", "a.json"), {"name": "part.step"})
w(os.path.join("bridge-files", "c1", "x.part"), "chunk")
with open(os.path.join(d, "artifacts", "big.bin"), "wb") as fh:
    fh.write(os.urandom(3 << 20))
con = sqlite3.connect(os.path.join(d, "bridge.sqlite"))
con.execute("PRAGMA journal_mode=WAL")
con.execute("CREATE TABLE devices (id TEXT PRIMARY KEY, owner TEXT)")
con.execute("CREATE TABLE pairings (id TEXT)")
con.execute("CREATE TABLE commands (id TEXT)")
con.executemany("INSERT INTO devices VALUES (?, ?)", [("d1", "u1"), ("d2", "u2")])
con.executemany("INSERT INTO commands VALUES (?)", [("k1",), ("k2",), ("k3",)])
con.commit()
con.close()
PY

# the stand-in flyctl and its two apps (the throwaway secret values are checked below never to be printed)
cat >"$W/bin/fly" <<EOF
#!/bin/sh
FAKEFLY_HOME="$W" exec "$NODE" "$HERE/fake-fly.mjs" "\$@"
EOF
chmod 0755 "$W/bin/fly"
SECRET_VALUES=(rehearsal-legacy-password-1 rehearsal-access-code-2 rehearsal-google-id-3 rehearsal-google-secret-4 rehearsal-sentry-5)
"$PY" - "$W" "$PY" "$REPO" <<'PY'
import json, sys
W, PY, REPO = sys.argv[1:4]
redirect = "cados.fly.dev,cados.kevos.com,cad.bizomat.ai"
state = {
    "network": {"http://cados.internal:8080": "http://127.0.0.1:8080", "http://cad.process.bizomat.internal:8001": "http://127.0.0.1:8001"},
    "apps": {
        "cados": {"machines": ["m_old"],
                  "secrets": {"OPENSKETCH_PASSWORD": "rehearsal-legacy-password-1", "OPENSKETCH_ACCESS_CODE": "rehearsal-access-code-2",
                              "GOOGLE_CLIENT_ID": "rehearsal-google-id-3", "GOOGLE_CLIENT_SECRET": "rehearsal-google-secret-4",
                              "SENTRY_DSN": "rehearsal-sentry-5"},
                  "volumes": [{"id": "vol_old", "name": "opensketch_data", "region": "ams", "size_gb": 1, "attached_machine_id": "m_old", "state": "created"}],
                  "ips": [{"Address": "66.241.125.206", "Type": "shared_v4", "Region": "global"}, {"Address": "2a09:8280:1::aaaa:bbbb", "Type": "v6", "Region": "global"}],
                  "certs": [{"hostname": "cados.kevos.com"}]},
        "bizomat": {"machines": ["m_proxy", "m_cad"], "secrets": {},
                    "volumes": [{"id": "vol_cad", "name": "cad_data", "region": "syd", "size_gb": 3, "attached_machine_id": "m_cad", "state": "created"}],
                    "ips": [{"Address": "66.241.125.221", "Type": "shared_v4", "Region": "global"}], "certs": []},
    },
    "machines": {
        "m_old": {"app": "cados", "group": "app", "kind": "cados", "region": "ams", "state": "stopped",
                  "env": {"OPENSKETCH_DATA": "/data", "OPENSKETCH_PUBLIC_URL": "https://bizomat.ai/cad", "OPENSKETCH_REDIRECT_HOSTS": redirect, "OPENSKETCH_VERSION": "685cf0d"},
                  "services": [{"internal_port": 8080, "autostart": True, "autostop": "suspend"}],
                  "mounts": [{"path": "/data", "volume": "vol_old", "name": "opensketch_data"}],
                  "binds": [[f"{W}/m/m_old/data", "/data"], [f"{W}/m/m_old/tmp", "/tmp"]],
                  "main": f"{PY} {W}/cad-standin.py -m opensketch --host :: --port 8080 --no-browser --supervise"},
        "m_cad": {"app": "bizomat", "group": "cad", "kind": "cad", "region": "syd", "state": "stopped",
                  "env": {"OPENSKETCH_PUBLIC_URL": "https://bizomat.ai/cad", "OPENSKETCH_REDIRECT_HOSTS": redirect, "BIZOMAT_VERSION": "rehearsal"},
                  "services": [], "mounts": [{"path": "/data", "volume": "vol_cad", "name": "cad_data"}],
                  "binds": [[f"{W}/m/m_cad/data", "/data"], [f"{W}/m/m_cad/tmp", "/tmp"], [f"{W}/libbz", "/usr/local/lib/bizomat"],
                            [f"{REPO}/infrastructure/fly/entrypoint.sh", "/usr/local/bin/bizomat-entrypoint"], [f"{W}/appcad", "/app/cad"],
                            [f"{W}/python-wrapper", "/opt/cad/venv/bin/python"]],
                  "main": "/bin/bash /usr/local/bin/bizomat-entrypoint cad"},
        "m_proxy": {"app": "bizomat", "group": "proxy", "kind": "proxy", "region": "syd", "state": "stopped",
                    "env": {"UPSTREAM_CAD": "http://cados.internal:8080", "UPSTREAM_WEB": "http://127.0.0.1:9", "UPSTREAM_WORK": "http://127.0.0.1:9",
                            "PROXY_PORT": "18080", "PROXY_HOST": "0.0.0.0", "PROXY_CLIENT_IP_MODE": "socket", "PROXY_LOG": "0", "BIZOMAT_VERSION": "rehearsal"},
                    "services": [{"internal_port": 8080, "autostart": True, "autostop": "off"}], "mounts": [],
                    "main": f"{REPO}/infrastructure/proxy/server.mjs"},
    },
}
json.dump(state, open(f"{W}/state.json", "w"), indent=2)
PY
FLY="$W/bin/fly"
for m in "m_old cados" "m_proxy bizomat" "m_cad bizomat"; do
  read -r id app <<<"$m"
  "$FLY" machine start "$id" --app "$app" >/dev/null
done

export FLYCTL="$FLY" BIZOMAT_ROUTER_ADDR=127.0.0.1:18080 BIZOMAT_READY_URL=http://127.0.0.1:18080/__proxy/ready BIZOMAT_MOVE_WAIT=60
get() { # a request to bizomat.ai through the router: get <path> [curl options]
  local path="$1"
  shift
  curl -sS -m 10 -H 'Host: bizomat.ai' "$@" "http://127.0.0.1:18080$path"
}
field() { "$PY" -c 'import json,sys; v=json.load(sys.stdin); print(eval("v" + sys.argv[1]))' "$1"; }
mstate() { "$PY" -c 'import json,sys; m=json.load(open(sys.argv[1]))["machines"][sys.argv[2]]; print(m["state"], m["services"][0]["autostart"] if m["services"] else "-")' "$W/state.json" "$1"; }
frozen() { # Python processes paused (state T) in a Machine's namespace
  local pid
  pid="$("$PY" -c 'import json,sys; print(json.load(open(sys.argv[1]))["machines"][sys.argv[2]]["pid"])' "$W/state.json" "$1")"
  nsenter --target "$pid" --mount --pid -- sh -c 'n=0; for p in /proc/[0-9]*; do case "$(readlink $p/exe)" in */python3*) [ "$(cut -d" " -f3 $p/stat)" = T ] && n=$((n+1));; esac; done; echo $n'
}
run() { # run the tool; its whole output is kept and checked for setting values
  local name="$1"
  shift
  set +e
  "$NODE" "$TOOL" "$@" >"$W/out/$name.log" 2>&1
  local rc=$?
  set -e
  for v in "${SECRET_VALUES[@]}"; do if grep -q "$v" "$W/out/$name.log"; then bad "$name printed a setting value"; fi; done
  return $rc
}
wait_for() { for _ in $(seq 1 60); do if eval "$1"; then return 0; fi; sleep 1; done; return 1; }

wait_for '[ "$(get /cad/healthz | field "[\"version\"]" 2>/dev/null)" = 685cf0d ]' || bad "the old app does not answer through the router"
wait_for 'get /cad/healthz >/dev/null && curl -sS -m 5 http://127.0.0.1:8001/healthz | grep -q waiting-for-data' || bad "the cad Machine does not show its holding page"
KID="$(get /cad/v2/keys | field '["keys"][0]["kid"]')"
ok "the stage: cados serves bizomat.ai/cad (685cf0d), the cad Machine waits for its data (holding page)"

# status and check: read only
[ "$("$NODE" "$TOOL" status --json 2>/dev/null | field '["route"]')" = old ] || bad "status should say old"
run check check "$W/f1" || bad "check failed: $(tail -5 "$W/out/check.log")"
grep -q "Nothing was changed" "$W/out/check.log" || bad "check output"
[ "$(get /cad/healthz | field '["version"]')" = 685cf0d ] || bad "check changed the route"
[ ! -e "$W/m/m_cad/data/cad/users.json" ] || bad "check put data on the cad volume"
[ ! -e "$W/m/m_old/tmp/bizomat-cad" ] || bad "check left its copy on cados"
[ "$(frozen m_old)" = 0 ] || bad "check left cados frozen"
ok "check: the rehearsal copy verified here, the upload way tested, nothing changed"

# a write on the old server before the move: it must come across
before_sessions="$(sha256sum "$OLD/sessions.json" | cut -d' ' -f1)"
get /cad/api/touch -X POST >/dev/null
[ "$(sha256sum "$OLD/sessions.json" | cut -d' ' -f1)" != "$before_sessions" ] || bad "the stand-in did not write"

# the move, with the raw ways failing so the fallback ways carry the copy both ways
FAKEFLY_FAIL=sftp-get,ssh-stdin run apply apply "$W/f2" || bad "apply failed: $(tail -15 "$W/out/apply.log")"
[ "$(get /cad/healthz | field '["version"]')" = "$PIN" ] || bad "bizomat.ai/cad does not run CADOS $PIN after the move"
[ "$(get /cad/v2/keys | field '["keys"][0]["kid"]')" = "$KID" ] || bad "the signing key changed"
[ "$(mstate m_old)" = "stopped False" ] || bad "cados should be stopped with autostart off: $(mstate m_old)"
(cd "$OLD" && find . -type f ! -name '*.tmp' -print0) | while IFS= read -r -d '' f; do
  cmp -s "$OLD/$f" "$W/m/m_cad/data/cad/$f" || bad "$f differs on the cad volume"
done
[ ! -e "$W/m/m_cad/data/cad/users.json.42.tmp" ] || bad "a .tmp file came across"
for n in OPENSKETCH_PASSWORD OPENSKETCH_ACCESS_CODE GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET; do
  [ -f "$W/m/m_cad/data/cad/.secrets/$n" ] || bad "setting $n not moved"
  [ "$(stat -c '%u %a' "$W/m/m_cad/data/cad/.secrets/$n")" = "0 600" ] || bad "setting file $n must be root 0600"
done
[ "$(cat "$W/m/m_cad/data/cad/.secrets/OPENSKETCH_PASSWORD")" = rehearsal-legacy-password-1 ] || bad "OPENSKETCH_PASSWORD value"
[ ! -e "$W/m/m_cad/data/cad/.secrets/SENTRY_DSN" ] || bad "a setting that is not CAD Automation's moved"
pid="$(pgrep -f "cad-standin.py -m opensketch --host :: --port 8001" | head -1)"
tr '\0' '\n' <"/proc/$pid/environ" | grep -qx 'OPENSKETCH_ACCESS_CODE=rehearsal-access-code-2' || bad "the CAD server on cad did not get the moved settings"
[ "$(stat -c %U "$W/m/m_cad/data/cad/secret.keys")" = bzcad ] || bad "the data must belong to bzcad"
[ -z "$(ls -A "$W/m/m_cad/data/incoming")" ] || bad "the archive was left on the cad volume"
[ ! -e "$W/m/m_old/tmp/bizomat-cad" ] || bad "the export was left on cados"
[ -f "$W/f2/move.json" ] && ls "$W/f2"/cados-data-*.tar >/dev/null || bad "move.json and the archive belong in the folder"
grep -q "not brought with sftp" "$W/out/apply.log" && grep -q "not sent over ssh" "$W/out/apply.log" || bad "the fallback ways were not used"
grep -q "AI app connections by the address they were made with: bizomat.ai 1, cados.kevos.com 1" "$W/out/apply.log" || bad "connections by address"
ok "apply: bizomat.ai/cad on the cad group with every file byte for byte, the same key, the settings as root-only files; cados stopped"

run apply-again apply "$W/f3" && bad "a second move went ahead"
grep -q "already goes to the cad group" "$W/out/apply-again.log" || bad "second move message"
ok "a second move is refused while CAD runs in the cad group"

# the way back
run back back "$W/f2" || bad "back failed: $(tail -10 "$W/out/back.log")"
[ "$(get /cad/healthz | field '["version"]')" = 685cf0d ] || bad "bizomat.ai/cad is not cados after back"
[ "$(mstate m_old)" = "started True" ] || bad "cados should be started with autostart on: $(mstate m_old)"
[ -e "$W/m/m_cad/data/.bizomat-maintenance" ] || bad "the cad Machine should be in maintenance after back"
curl -sS -m 5 http://127.0.0.1:8001/healthz | grep -q '"maintenance"' || bad "the cad Machine should show maintenance"
ok "back: bizomat.ai/cad on cados again, cados starts by itself again, the cad Machine in maintenance"

run apply-noforce apply "$W/f4" && bad "a move onto data went ahead without -Force"
grep -q "Run again with -Force" "$W/out/apply-noforce.log" || bad "the -Force message"
ok "a move onto a cad volume with data needs -Force"

# a failure in the middle: the way back at once
FAKEFLY_FAIL="script:verify.sh --archive" run apply-fail apply "$W/f5" --force && bad "the injected failure did not stop the move"
grep -q "The way back" "$W/out/apply-fail.log" || bad "no way back after the failure"
[ "$(get /cad/healthz | field '["version"]')" = 685cf0d ] || bad "after a failed move bizomat.ai/cad must be cados again"
[ "$(frozen m_old)" = 0 ] || bad "cados must be resumed after a failed move"
curl -sS -m 5 http://127.0.0.1:8001/healthz | grep -q '"ok": false' || bad "the cad Machine must not serve after a failed move"
[ -z "$(ls -A "$W/m/m_cad/data/incoming")" ] && [ ! -e "$W/m/m_old/tmp/bizomat-cad" ] || bad "a failed move left a copy on a Machine"
ok "a failure in the middle (the check on the cad Machine) takes the way back at once: cados resumed, the router back"

FAKEFLY_FAIL=sftp-get,sftp-put,ssh-stdin,ssh-stdout run apply-force apply "$W/f6" --force || bad "apply --force failed: $(tail -10 "$W/out/apply-force.log")"
[ "$(get /cad/healthz | field '["version"]')" = "$PIN" ] || bad "after apply --force"
compgen -G "$W/m/m_cad/data/backups/cad-*" >/dev/null || bad "the earlier copy must be kept in /data/backups"
grep -q "sent in base64 pieces" "$W/out/apply-force.log" && grep -q "brought here in base64 pieces" "$W/out/apply-force.log" || bad "the base64 ways were not used"
ok "apply -Force (copy carried in base64 pieces both ways): moved again; the cad volume's earlier copy kept in /data/backups"

# retirement: refused while fly.website.toml still routes to cados, previews change nothing, then the real thing
BIZOMAT_FLY_CONFIG="$REPO/fly.website.toml" run retire-early retire-ips --confirm cados && bad "retirement went ahead with fly.website.toml on cados"
grep -q "still sends bizomat.ai/cad to the old app" "$W/out/retire-early.log" || bad "retire-early message"
sed 's#^  UPSTREAM_CAD = "http://cados.internal:8080"#  UPSTREAM_CAD = "http://cad.process.bizomat.internal:8001"#' "$REPO/fly.website.toml" >"$W/fly.website.toml"
export BIZOMAT_FLY_CONFIG="$W/fly.website.toml"
run retire-preview retire-ips || bad "retire preview: $(tail -5 "$W/out/retire-preview.log")"
grep -q "Nothing released" "$W/out/retire-preview.log" && [ "$("$FLY" ips list --app cados --json | "$PY" -c 'import json,sys; print(len(json.load(sys.stdin)))')" = 2 ] || bad "the preview released something"
run retire retire-ips --confirm cados || bad "retire-ips: $(tail -5 "$W/out/retire.log")"
[ "$("$FLY" ips list --app cados --json | "$PY" -c 'import json,sys; print(len(json.load(sys.stdin)))')" = 0 ] || bad "addresses left"
run delete-preview delete-app || bad "delete preview"
grep -q "Nothing deleted" "$W/out/delete-preview.log" && "$FLY" status --app cados >/dev/null || bad "the preview deleted something"
run delete delete-app --confirm cados || bad "delete-app: $(tail -5 "$W/out/delete.log")"
if "$FLY" status --app cados >/dev/null 2>&1; then bad "cados still exists"; fi
[ "$(get /cad/healthz | field '["version"]')" = "$PIN" ] || bad "bizomat.ai/cad after the retirement"
ok "retirement: refused until fly.website.toml agrees; previews change nothing; addresses released; app deleted; CAD still answers"

echo "rehearse: all $passed checks passed (logs in $W/out)"
