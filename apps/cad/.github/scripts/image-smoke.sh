#!/usr/bin/env bash
# Smoke test of a built CAD image, before it may be pushed or deployed (.github/workflows/deploy.yml, job "image").
# It starts the image the way Fly runs it (an empty /data, the public address and the old hosts of fly.toml) and checks
# what production must also answer: the version, MCP refusing a request without a token, the OAuth metadata, the public
# product page, the installer download behind sign-in, the old host's redirect, and the add-in package in the image.
# A fresh /data has no account, so the server waits in setup mode, as a new server would.
#
#   bash .github/scripts/image-smoke.sh <image> <expected version (the commit's first 7 characters)>
#
# Exit 0 only when every check passed. The container's log goes to $RUNNER_TEMP/cados-smoke.log.
set -uo pipefail
image="${1:?image}"
want="${2:?expected version}"
name="cados-smoke-$$"
port=18080
data="$(mktemp -d)"
log="${RUNNER_TEMP:-/tmp}/cados-smoke.log"
fails=0

cleanup() {
  docker logs "$name" > "$log" 2>&1 || true
  docker rm -f "$name" > /dev/null 2>&1 || true
}
trap cleanup EXIT

check() { # what, then a command that succeeds when it holds
  local what="$1"; shift
  if "$@"; then echo "ok    $what"; else echo "FAIL  $what"; fails=$((fails + 1)); fi
}
has_zip() { docker run --rm --entrypoint sh "$image" -c 'test -s /app/opensketch/static/downloads/OpenSketch-SOLIDWORKS.zip'; }
check "the image holds the add-in package (static/downloads/OpenSketch-SOLIDWORKS.zip)" has_zip

docker run -d --name "$name" -p "127.0.0.1:$port:8080" -v "$data:/data" \
  -e OPENSKETCH_PUBLIC_URL=https://bizomat.ai/cad \
  -e OPENSKETCH_REDIRECT_HOSTS=cados.fly.dev,cados.kevos.com,cad.bizomat.ai \
  "$image" > /dev/null
base="http://127.0.0.1:$port"

version=""
for _ in $(seq 1 90); do
  version="$(curl -fsS --max-time 5 "$base/healthz" 2>/dev/null | jq -r '.version // empty' 2>/dev/null || true)"
  [ -n "$version" ] && break
  sleep 2
done
same_version() { [ "$version" = "$want" ]; }
check "it starts and /healthz reports version $want (got: ${version:-no answer in 180 s})" same_version

# An answer's status, a space and one header's value (empty when absent): the last response's, so a proxy's
# CONNECT answer before it is skipped.
ask() { # header-name, then curl arguments
  local header="$1"; shift
  curl -s -o /dev/null -D - --max-time 15 "$@" | tr -d '\r' |
    awk -v h="$(tr '[:upper:]' '[:lower:]' <<<"$header")" '/^HTTP\//{s=$2; v=""} tolower($0) ~ "^"h":"{sub(/^[^:]*: */,""); v=$0} END{print s" "v}'
}
public=(-H "Host: bizomat.ai" -H "X-Forwarded-Proto: https")

read -r st auth < <(ask www-authenticate "${public[@]}" -X POST -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' --data '{}' "$base/cad/mcp")
mcp_refuses() { [ "$st" = 401 ] && [[ "$auth" == Bearer* ]]; }
check "MCP refuses a request without a token: 401 with a Bearer challenge (got $st)" mcp_refuses

meta="$(curl -fsS --max-time 15 "${public[@]}" "$base/.well-known/oauth-protected-resource/cad/mcp" 2>/dev/null | jq -r '.resource // empty' 2>/dev/null || true)"
meta_ok() { [[ "$meta" == */cad/mcp ]]; }
check "the OAuth metadata names the MCP resource (got: ${meta:-none})" meta_ok

read -r st _ < <(ask location "${public[@]}" "$base/cad/overview")
page_ok() { [ "$st" = 200 ]; }
check "the public product page answers (/cad/overview: $st)" page_ok

read -r st loc < <(ask location "${public[@]}" "$base/cad/download/solidworks")
download_gated() { [[ "$st" =~ ^30[1237]$ ]] && [[ "$loc" == */cad/login* || "$loc" == */cad/setup* ]]; }
check "the installer download needs sign-in (/cad/download/solidworks: $st to ${loc:-nowhere})" download_gated

read -r st loc < <(ask location -H "Host: cados.fly.dev" "$base/overview")
old_host_ok() { [ "$st" = 301 ] && [[ "$loc" == https://bizomat.ai/cad/overview* ]]; }
check "an old host sends pages to bizomat.ai/cad (cados.fly.dev/overview: $st to ${loc:-nowhere})" old_host_ok

if [ "$fails" -gt 0 ]; then
  echo "$fails smoke check(s) failed. The container's log: $log"
  exit 1
fi
echo "All smoke checks passed for $image"
