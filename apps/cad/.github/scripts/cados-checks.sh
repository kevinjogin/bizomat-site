#!/usr/bin/env bash
# Checks of the live CAD app after a deploy (.github/workflows/deploy.yml). Read only.
#
#   bash .github/scripts/cados-checks.sh core     the server itself, on its origin (a failure rolls the deploy back):
#                                                 /healthz answers with the expected version, the Machine runs the
#                                                 expected image digest, MCP refuses a request without a token with a
#                                                 Bearer challenge, the OAuth metadata answers
#   bash .github/scripts/cados-checks.sh public   through bizomat.ai (the website's router in front): the app's page,
#                                                 the installer download behind sign-in, the OAuth metadata of /cad/mcp
#
# Environment: APP (cados), ORIGIN (https://cados.fly.dev), PUBLIC_URL (https://bizomat.ai/cad); for core also WANT (the
# version /healthz must report; empty: any), WANT_DIGEST (sha256:...; empty: not checked), WANT_CONFIG (the image's config
# digest, sha256:...; empty: not used) and FLY_API_TOKEN. The Machine runs the expected image when Fly reports the
# pushed manifest digest, or, since Fly deploys an image under its own deployment-<id> tag with a rewritten manifest,
# when the manifest it reports has the pushed image's config digest (.github/scripts/image-config.sh).
# Exit 0 only when every check passed.
set -uo pipefail
part="${1:?core or public}"
APP="${APP:-cados}"
ORIGIN="${ORIGIN:-https://cados.fly.dev}"
PUBLIC_URL="${PUBLIC_URL:-https://bizomat.ai/cad}"
fails=0
say() { echo "$1"; echo "- $1" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; }
check() { # what, then a command that succeeds when it holds
  local what="$1"; shift
  if "$@"; then say "ok: $what"; else say "FAILED: $what"; fails=$((fails + 1)); fi
}
# An answer's status, a space and one header's value: the last response's (a proxy's CONNECT answer is skipped).
ask() { # header-name, then curl arguments
  local header="$1"; shift
  curl -s -o /dev/null -D - --max-time 15 "$@" | tr -d '\r' |
    awk -v h="$(tr '[:upper:]' '[:lower:]' <<<"$header")" '/^HTTP\//{s=$2; v=""} tolower($0) ~ "^"h":"{sub(/^[^:]*: */,""); v=$0} END{print s" "v}'
}

if [ "$part" = core ]; then
  WANT="${WANT:-}"
  WANT_DIGEST="${WANT_DIGEST:-}"
  # The new server takes a while to start (the supervisor, then the CAD kernel): up to 3 minutes.
  version=""
  for _ in $(seq 1 36); do
    version="$(curl -fsS --max-time 10 "$ORIGIN/healthz" 2>/dev/null | jq -r 'select(.ok == true) | .version // empty' 2>/dev/null || true)"
    if [ -n "$version" ] && { [ -z "$WANT" ] || [ "$version" = "$WANT" ]; }; then break; fi
    sleep 5
  done
  version_ok() { [ -n "$version" ] && { [ -z "$WANT" ] || [ "$version" = "$WANT" ]; }; }
  check "$ORIGIN/healthz answers ok with version ${WANT:-(any)} (got: ${version:-no answer})" version_ok

  WANT_CONFIG="${WANT_CONFIG:-}"
  digest="$(flyctl machine list --app "$APP" --json 2>/dev/null | jq -r 'first(.[] | .image_ref.digest // empty)' 2>/dev/null || true)"
  config=""
  if [ -n "$WANT_DIGEST" ] && [ -n "$digest" ] && [ "$digest" != "$WANT_DIGEST" ] && [ -n "$WANT_CONFIG" ]; then
    flyctl auth docker >/dev/null 2>&1 || true
    config="$(bash "$(dirname "$0")/image-config.sh" "${REGISTRY_IMAGE:-registry.fly.io/$APP}@$digest" || true)"
  fi
  digest_ok() { [ -z "$WANT_DIGEST" ] || [ "$digest" = "$WANT_DIGEST" ] || { [ -n "$WANT_CONFIG" ] && [ "$config" = "$WANT_CONFIG" ]; }; }
  check "the Machine runs image ${WANT_DIGEST:-(digest not checked)}${WANT_CONFIG:+ (config $WANT_CONFIG)} (got: ${digest:-unknown}${config:+, config $config})" digest_ok

  read -r st auth < <(ask www-authenticate -X POST -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' --data '{}' "$ORIGIN/mcp")
  mcp_ok() { [ "$st" = 401 ] && [[ "$auth" == Bearer* ]]; }
  check "MCP refuses a request without a token: 401 with a Bearer challenge (got: ${st:-no answer})" mcp_ok

  meta="$(curl -fsS --max-time 15 "$ORIGIN/.well-known/oauth-protected-resource/mcp" 2>/dev/null | jq -r '.resource // empty' 2>/dev/null || true)"
  meta_ok() { [[ "$meta" == */mcp ]]; }
  check "the OAuth metadata answers (resource: ${meta:-none})" meta_ok
elif [ "$part" = public ]; then
  host="$(sed -E 's#^https?://([^/]+).*#\1#' <<<"$PUBLIC_URL")"
  read -r st _ < <(ask location "$PUBLIC_URL/")
  page_ok() { [ "$st" = 200 ]; }
  check "$PUBLIC_URL/ answers (got: ${st:-no answer})" page_ok

  read -r st loc < <(ask location "$PUBLIC_URL/download/solidworks")
  download_ok() { [[ "$st" =~ ^30[1237]$ ]] && [[ "$loc" == */cad/login* ]]; }
  check "the installer download still needs sign-in ($st to ${loc:-nowhere})" download_ok

  meta="$(curl -fsS --max-time 15 "https://$host/.well-known/oauth-protected-resource/cad/mcp" 2>/dev/null | jq -r '.resource // empty' 2>/dev/null || true)"
  public_meta_ok() { [ "$meta" = "$PUBLIC_URL/mcp" ]; }
  check "the OAuth metadata of $PUBLIC_URL/mcp answers (resource: ${meta:-none})" public_meta_ok
else
  echo "core or public"; exit 2
fi

if [ "$fails" -gt 0 ]; then echo "$fails check(s) failed"; exit 1; fi
