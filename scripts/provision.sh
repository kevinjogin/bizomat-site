#!/usr/bin/env bash
# Creates the NEW, isolated Cloudflare resources for ONE WorkOS environment.
#
#   scripts/provision.sh preview       # or: dev | production
#
# Safety:
#   * runs scripts/check-conflicts.sh first and aborts if any name exists;
#   * only ever runs `create` commands for workos-platform-* names;
#   * never deletes, updates or deploys anything.
# After it finishes, paste the printed IDs into wrangler.jsonc.
set -euo pipefail

ENV_NAME="${1:?usage: provision.sh <dev|preview|production>}"
case "$ENV_NAME" in dev|preview|production) ;; *) echo "invalid env" >&2; exit 1;; esac

HERE="$(cd "$(dirname "$0")" && pwd)"
"$HERE/check-conflicts.sh" "$ENV_NAME"

WR="npx --no-install wrangler"
DB="workos-platform-${ENV_NAME}-db"
BUCKET="workos-platform-${ENV_NAME}-files"
KV="workos-platform-${ENV_NAME}-cache"

echo "== Creating D1 database ${DB}"
$WR d1 create "$DB"
echo "== Creating R2 bucket ${BUCKET}"
$WR r2 bucket create "$BUCKET"
echo "== Creating KV namespace ${KV}"
$WR kv namespace create "$KV"

cat <<EOF

Done. Next steps for '${ENV_NAME}':
  1. Copy the database_id and KV id printed above into wrangler.jsonc
     (env.${ENV_NAME} block; top-level block for 'dev').
  2. Apply migrations:   npx wrangler d1 migrations apply DB --remote $( [ "$ENV_NAME" = dev ] || echo "--env $ENV_NAME" )
  3. Deploy (CI does this automatically; see DEPLOYMENT.md).
EOF
