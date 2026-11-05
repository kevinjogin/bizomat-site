#!/usr/bin/env bash
# Gives the KEVOS gateway on Fly its own address on a domain managed in Cloudflare (docs/KEVOS-CLOUDFLARE.md, option A):
#   1. finds the Cloudflare zone for HOST,
#   2. adds the DNS record HOST -> <app>.fly.dev (CNAME, DNS only: Fly must see the requests to issue the certificate),
#   3. asks Fly for a certificate for HOST,
#   4. adds the validation record Fly asks for (_acme-challenge CNAME),
#   5. sets the app's OPENSKETCH_PUBLIC_URL to https://HOST,
#   6. waits until Fly has issued the certificate and https://HOST/healthz answers.
# Safe to run again: records already right are left alone. An existing record of another kind under the same name,
# or a CNAME pointing elsewhere, is never replaced unless REPLACE=yes.
#
# Needs: HOST (e.g. bridge.example.com), CLOUDFLARE_API_TOKEN (Zone Read + DNS Edit on that domain), FLY_API_TOKEN.
# Optional: APP (default cados), REPLACE (yes), CF_API, FLYCTL, HEALTH_URL, WAIT_TRIES, WAIT_SECONDS (for tests).
set -euo pipefail

APP="${APP:-cados}"
CF_API="${CF_API:-https://api.cloudflare.com/client/v4}"
FLYCTL="${FLYCTL:-flyctl}"
WAIT_TRIES="${WAIT_TRIES:-40}"
WAIT_SECONDS="${WAIT_SECONDS:-15}"
SUMMARY="${GITHUB_STEP_SUMMARY:-/dev/null}"

fail() { echo "::error::$*" >&2; echo "Stopped: $*" >> "$SUMMARY"; exit 1; }
say() { echo "$*"; echo "- $*" >> "$SUMMARY"; }

HOST="$(printf '%s' "${HOST:-}" | tr 'A-Z' 'a-z' | sed -E 's#^https?://##; s#/.*$##; s#\.$##')"
[[ "$HOST" =~ ^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$ ]] || fail "'$HOST' is not a host name like bridge.example.com."
[[ "$HOST" == *.fly.dev ]] && fail "Give your own domain, not a fly.dev name."
[ -n "${CLOUDFLARE_API_TOKEN:-}" ] || fail "The repository secret CLOUDFLARE_API_TOKEN is not set (Cloudflare > My Profile > API Tokens > Edit zone DNS, for this domain only)."
[ -n "${FLY_API_TOKEN:-}" ] || fail "The repository secret FLY_API_TOKEN is not set (Fly dashboard > the app > Tokens, or 'fly tokens create deploy -a $APP')."
HEALTH_URL="${HEALTH_URL:-https://$HOST/healthz}"
TARGET="$APP.fly.dev"

cf() {  # method path [json]: the Cloudflare API, failing with Cloudflare's own message
  local out
  out="$(curl -sS -X "$1" "$CF_API$2" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" ${3:+--data "$3"})" \
    || fail "Cloudflare could not be reached ($1 $2)."
  if [ "$(jq -r '.success' <<<"$out" 2>/dev/null)" != "true" ]; then
    fail "Cloudflare refused $1 $2: $(jq -r '[.errors[]?.message] | join("; ")' <<<"$out" 2>/dev/null || echo "$out")"
  fi
  printf '%s' "$out"
}

# 1. the zone: the longest ending of HOST that Cloudflare manages for this token
zone_id=""; zone=""; rest="$HOST"
while [[ "$rest" == *.* ]]; do
  id="$(cf GET "/zones?name=$rest" | jq -r '.result[0].id // empty')"
  if [ -n "$id" ]; then zone_id="$id"; zone="$rest"; break; fi
  rest="${rest#*.}"
done
[ -n "$zone_id" ] || fail "No Cloudflare zone for $HOST. Is the domain in this Cloudflare account, and may the token read it (Zone Read)?"
say "Cloudflare zone: $zone"

upsert() {  # name target: a DNS-only CNAME, made or corrected; other kinds of record are never touched
  local name="$1" target="$2" recs other cid ccontent body
  recs="$(cf GET "/zones/$zone_id/dns_records?name=$name&per_page=100")"
  other="$(jq -r '[.result[] | select(.type != "CNAME") | .type] | join(", ")' <<<"$recs")"
  [ -z "$other" ] || fail "$name already has a record of type $other in Cloudflare. Remove it (or use another host name), then run this again."
  cid="$(jq -r '.result[] | select(.type == "CNAME") | .id' <<<"$recs" | head -n1)"
  ccontent="$(jq -r '.result[] | select(.type == "CNAME") | .content' <<<"$recs" | head -n1 | tr 'A-Z' 'a-z')"
  body="$(jq -nc --arg n "$name" --arg t "$target" --arg c "KEVOS gateway (Fly app $APP)" \
          '{type: "CNAME", name: $n, content: $t, proxied: false, ttl: 1, comment: $c}')"
  if [ -z "$cid" ]; then
    cf POST "/zones/$zone_id/dns_records" "$body" >/dev/null
    say "DNS record added: $name CNAME $target (DNS only)"
  elif [ "$ccontent" = "$(tr 'A-Z' 'a-z' <<<"$target")" ]; then
    cf PATCH "/zones/$zone_id/dns_records/$cid" '{"proxied": false}' >/dev/null
    say "DNS record already right: $name CNAME $target"
  elif [ "${REPLACE:-}" = "yes" ]; then
    cf PUT "/zones/$zone_id/dns_records/$cid" "$body" >/dev/null
    say "DNS record replaced: $name CNAME $target (it pointed to $ccontent)"
  else
    fail "$name already points to $ccontent. Run again with replace_existing ticked to point it to $target."
  fi
}

# 2. the address itself
upsert "$HOST" "$TARGET"

# 3. the certificate
if ! "$FLYCTL" certs show "$HOST" --app "$APP" >/dev/null 2>&1; then
  "$FLYCTL" certs add "$HOST" --app "$APP" >/dev/null || fail "Fly did not accept a certificate for $HOST on app $APP."
  say "Fly certificate requested for $HOST"
else
  say "Fly certificate for $HOST already requested"
fi
cert="$("$FLYCTL" certs show "$HOST" --app "$APP" --json)"

# 4. the validation record Fly asks for (it lets Fly issue and renew the certificate through DNS)
vh="$(jq -r '.DNSValidationHostname // .dnsValidationHostname // .Certificate.DNSValidationHostname // empty' <<<"$cert" | sed 's#\.$##')"
vt="$(jq -r '.DNSValidationTarget // .dnsValidationTarget // .Certificate.DNSValidationTarget // empty' <<<"$cert" | sed 's#\.$##')"
if [ -n "$vh" ] && [ -n "$vt" ]; then
  upsert "$vh" "$vt"
else
  say "Fly asked for no validation record (it validates through the address itself)"
fi

# 5. the server's public address (OAuth metadata, pairing links, download links use it)
"$FLYCTL" secrets set --app "$APP" "OPENSKETCH_PUBLIC_URL=https://$HOST" >/dev/null || fail "Fly did not take the secret OPENSKETCH_PUBLIC_URL."
say "Fly secret OPENSKETCH_PUBLIC_URL set to https://$HOST (the app restarts with it)"

# 6. wait for the certificate and the site
for i in $(seq 1 "$WAIT_TRIES"); do
  "$FLYCTL" certs check "$HOST" --app "$APP" >/dev/null 2>&1 || true
  status="$("$FLYCTL" certs show "$HOST" --app "$APP" --json 2>/dev/null | jq -r '.ClientStatus // .clientStatus // empty')"
  if curl -sSf -m 10 "$HEALTH_URL" >/dev/null 2>&1; then
    say "https://$HOST is live: $HEALTH_URL answers (certificate: ${status:-issued})"
    echo
    echo "Done. Connector address for AI apps: https://$HOST/mcp  Installer property: GATEWAY_URL=https://$HOST"
    echo "Connector address for AI apps: https://$HOST/mcp. Installer: GATEWAY_URL=https://$HOST. Set the repository variable PUBLIC_URL to https://$HOST so later deploys keep it." >> "$SUMMARY"
    exit 0
  fi
  echo "waiting for the certificate and the site ($i/$WAIT_TRIES): certificate ${status:-pending}"
  sleep "$WAIT_SECONDS"
done
fail "The records and the certificate request are in place, but https://$HOST did not answer within $((WAIT_TRIES * WAIT_SECONDS)) s (certificate: ${status:-pending}). DNS can take a while: run this again later, or check 'flyctl certs show $HOST -a $APP'."
