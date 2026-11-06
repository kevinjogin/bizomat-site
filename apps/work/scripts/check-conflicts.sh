#!/usr/bin/env bash
# READ-ONLY. Lists existing Cloudflare resources and reports whether any of
# the workos-platform-* resource names are already taken. Never creates or modifies
# anything. Requires CLOUDFLARE_API_TOKEN (+ CLOUDFLARE_ACCOUNT_ID) or
# `wrangler login`.
set -euo pipefail

ENVS=("${@:-dev preview production}")
ENVS=(${ENVS[@]})

WR="npx --no-install wrangler"
echo "== Cloudflare account =="
$WR whoami

echo "== Listing existing resources (read-only) =="
D1=$($WR d1 list --json 2>/dev/null || echo '[]')
R2=$($WR r2 bucket list 2>/dev/null || true)
KV=$($WR kv namespace list 2>/dev/null || echo '[]')
WORKERS_NOTE="(Worker names are checked by 'wrangler deployments list --name <name>')"

conflict=0
for env in "${ENVS[@]}"; do
  worker="workos-platform-${env}"
  db="workos-platform-${env}-db"
  bucket="workos-platform-${env}-files"
  kv="workos-platform-${env}-cache"
  echo "-- ${env}"
  if echo "$D1" | grep -q "\"name\": *\"${db}\""; then echo "   CONFLICT: D1 database ${db} already exists"; conflict=1; else echo "   ok: D1 ${db} is free"; fi
  if echo "$R2" | grep -qE "(^|[[:space:]])${bucket}([[:space:]]|$)"; then echo "   CONFLICT: R2 bucket ${bucket} already exists"; conflict=1; else echo "   ok: R2 ${bucket} is free"; fi
  if echo "$KV" | grep -q "\"title\": *\"${kv}\""; then echo "   CONFLICT: KV namespace ${kv} already exists"; conflict=1; else echo "   ok: KV ${kv} is free"; fi
  if $WR deployments list --name "${worker}" >/dev/null 2>&1; then echo "   CONFLICT: Worker ${worker} already exists"; conflict=1; else echo "   ok: Worker ${worker} is free ${WORKERS_NOTE}"; fi
done

if [ "$conflict" = 1 ]; then
  echo "One or more names are taken. Do NOT provision; choose a new prefix (see DEPLOYMENT.md)." >&2
  exit 2
fi
echo "No conflicts found."
