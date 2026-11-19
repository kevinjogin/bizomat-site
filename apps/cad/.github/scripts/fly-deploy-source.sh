#!/usr/bin/env bash
# Is a repository connected to the Fly app as its deployment source? Read only.
#
# With a deployment source (Fly dashboard > the app > Settings: a GitHub repository), Fly builds and deploys every push
# to that repository itself, without deploy.yml's tests, preflight or checks. cados had one on 15 and 16 Nov 2026; the
# owner disconnected it on 16 Nov 2026, and GitHub Actions (deploy.yml) is the only way to production since.
# fly-status.yml runs this on every status read.
#
# One read-only GraphQL query to Fly's API with the deploy token in FLY_API_TOKEN: the app's hasDeploymentSource and
# four fields of deploymentSource (connected, provider, repositoryUrl, ref; never backend, ids or anything else). The
# token goes to curl on standard input, never on a command line. The raw answer is never printed; the few values shown
# are cut to plain characters, and credentials in a repository address are dropped. It changes nothing and never
# disconnects anything: that stays a person's decision in the Fly dashboard.
#
# Exit 0: no deployment source. Exit 1: Fly reports one (an ::error:: says what, and how to disconnect it by hand).
# Exit 2: the answer could not be read, so nothing is claimed either way.
set -euo pipefail

APP="${APP:-cados}"
API="https://api.fly.io/graphql"
SUMMARY="${GITHUB_STEP_SUMMARY:-/dev/null}"

unknown() {
  echo "::error title=Fly deployment source unknown::$1 Nothing is claimed about whether Fly deploys $APP by itself; nothing was changed."
  echo "- Fly deployment source of \`$APP\`: **unknown** ($1)" >> "$SUMMARY"
  exit 2
}

[[ "$APP" =~ ^[a-z0-9][a-z0-9-]{0,62}$ ]] || { APP="(not a Fly app name)"; unknown "APP is not a Fly app name."; }
[ -n "${FLY_API_TOKEN:-}" ] || unknown "FLY_API_TOKEN is not set."
case "$FLY_API_TOKEN" in
  *'"'* | *'\'* | *$'\n'* | *$'\r'*) unknown "FLY_API_TOKEN has an unexpected form." ;;
esac
case "$FLY_API_TOKEN" in
  "FlyV1 "* | "Bearer "*) auth="$FLY_API_TOKEN" ;;
  fm1* | fm2*) auth="FlyV1 $FLY_API_TOKEN" ;;
  *) auth="Bearer $FLY_API_TOKEN" ;;
esac

# APP is checked above, so it can sit in the JSON as it is. A query, never a mutation.
query='{"query":"query($name: String!) { app(name: $name) { name hasDeploymentSource deploymentSource { connected provider repositoryUrl ref } } }","variables":{"name":"'"$APP"'"}}'

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
code="$(printf 'header = "Authorization: %s"\n' "$auth" |
  curl -sS --max-time 20 -K - -H 'Content-Type: application/json' --data "$query" \
    -o "$tmp/answer.json" -w '%{http_code}' "$API" 2> "$tmp/curl.err")" || code="${code:-000}"
unset auth

[ "$code" != 000 ] || unknown "Fly's API could not be reached ($(head -c 160 "$tmp/curl.err" | tr -cd 'A-Za-z0-9 ._:()-'))."
[ "$code" = 200 ] || unknown "Fly's API answered HTTP $(printf %s "$code" | tr -cd 0-9)."
jq -e 'type == "object"' "$tmp/answer.json" > /dev/null 2>&1 || unknown "Fly's API did not answer with JSON."

# Error messages, one line each, without anything shaped like a token.
errors="$(jq -r '[.errors[]?.message // empty | tostring | gsub("[\\r\\n]"; " ") | .[0:160]] | join("; ")' "$tmp/answer.json" |
  sed -E 's/(FlyV1|Bearer) [^ ;]+/(token removed)/g; s/f[mo][0-9]_[A-Za-z0-9_+\/=,.-]+/(token removed)/g' | tr -cd 'A-Za-z0-9 ._:;,()/-')"
[ -z "$errors" ] || unknown "Fly's API answered with an error: $errors"

[ "$(jq -r '.data.app | type' "$tmp/answer.json")" = object ] || unknown "Fly's API knows no app $APP for this token."
has="$(jq -r '.data.app.hasDeploymentSource | if type == "boolean" then tostring else "missing" end' "$tmp/answer.json")"
[ "$has" != missing ] || unknown "the answer has no hasDeploymentSource."
source_type="$(jq -r '.data.app.deploymentSource | type' "$tmp/answer.json")"
[ "$source_type" = null ] || [ "$source_type" = object ] || unknown "the answer's deploymentSource is a $source_type."

if [ "$has" = false ] && [ "$source_type" = null ]; then
  echo "No deployment source: Fly reports hasDeploymentSource false and deploymentSource null for $APP."
  echo "Fly does not build or deploy $APP from a repository; GitHub Actions (deploy.yml) is the only way to production."
  echo "- Fly deployment source of \`$APP\`: **none** (\`hasDeploymentSource: false\`, \`deploymentSource: null\`): only deploy.yml deploys it" >> "$SUMMARY"
  exit 0
fi

# What is connected, in plain characters only (a repository address loses its scheme, any user:password@ and query).
what="$(jq -r '(.data.app.deploymentSource // {}) | [
    "provider " + ((.provider // "not given") | tostring | gsub("[^A-Za-z0-9._-]"; "") | .[0:40]),
    "repository " + ((.repositoryUrl // "not given") | tostring | sub("^[A-Za-z][A-Za-z0-9+.-]*://"; "") | sub("^[^/@]*@"; "")
      | sub("[?#].*$"; "") | gsub("[^A-Za-z0-9._/ -]"; "") | .[0:120]),
    "ref " + ((.ref // "not given") | tostring | gsub("[^A-Za-z0-9._/ -]"; "") | .[0:80]),
    "connected " + (if .connected == null then "not given" else (.connected | tostring) end)
  ] | join(", ")' "$tmp/answer.json")"
echo "Fly reports a deployment source for $APP: hasDeploymentSource $has; $what."
echo "::error title=Fly deploys $APP by itself::Fly reports a deployment source for $APP (hasDeploymentSource $has; $what). Fly then builds and deploys pushes itself, without deploy.yml's tests, preflight or checks. Disconnect it by hand: Fly dashboard > $APP > Settings. Nothing was changed."
echo "- Fly deployment source of \`$APP\`: **connected** (hasDeploymentSource $has; $what). Disconnect it in the Fly dashboard > $APP > Settings; nothing was changed" >> "$SUMMARY"
exit 1
