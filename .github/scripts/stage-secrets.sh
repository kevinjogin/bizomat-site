#!/usr/bin/env bash
# Stages optional settings on the Fly app from GitHub repository secrets, for the deploy that follows to apply
# (.github/workflows/bizomat-deploy.yml). A value is never printed: only which settings were staged. A secret that is
# not set in GitHub stages nothing, so a value already on Fly is kept.
#
#   BIZOMAT_ID_CLIENT_SECRET     the CAD sign-in shared secret (docs/cad/SIGN-IN-SETUP.md): only its SHA-256 reaches
#                                this app, as WORK_BIZOMAT_ID_CLIENTS; the secret itself goes to the app cados
#   WORK_STRIPE_SECRET_KEY       billing (docs/billing/README.md): staged only when WORK_STRIPE_ENVIRONMENT in
#   WORK_STRIPE_PUBLISHABLE_KEY  fly.website.toml is "live", and only live keys (a test key stops the deploy before
#   WORK_STRIPE_WEBHOOK_SECRET   anything is staged); otherwise they stay in GitHub and billing stays off
#
# Environment: APP, CONFIG, FLY_API_TOKEN, and the secrets above as CAD_CLIENT_SECRET, STRIPE_SECRET,
# STRIPE_PUBLISHABLE, STRIPE_WEBHOOK.
set -euo pipefail
: "${APP:?}" "${CONFIG:?}"

summary() { echo "$1"; echo "- $1" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; }
fail() { echo "::error::$1 Nothing was staged."; exit 1; }

lines=()

if [ -n "${CAD_CLIENT_SECRET:-}" ]; then
  [[ "$CAD_CLIENT_SECRET" =~ ^[0-9a-fA-F]{32,500}$ ]] || fail "BIZOMAT_ID_CLIENT_SECRET must be hex, 32 to 500 characters (make it with: openssl rand -hex 32)."
  sha="$(printf '%s' "$CAD_CLIENT_SECRET" | sha256sum | cut -d' ' -f1)"
  lines+=("WORK_BIZOMAT_ID_CLIENTS=[{\"id\":\"cad\",\"name\":\"CAD Automation\",\"secretSha256\":\"$sha\",\"redirectUris\":[\"https://bizomat.ai/cad/auth/bizomat/callback\"]}]")
  summary "CAD sign-in: staged WORK_BIZOMAT_ID_CLIENTS (the client cad, with the secret's SHA-256 only)"
fi

mode="$(python3 -c 'import sys, tomllib; print(tomllib.load(open(sys.argv[1], "rb")).get("env", {}).get("WORK_STRIPE_ENVIRONMENT", ""))' "$CONFIG")"
# Production takes live Stripe settings only (owner, 15 Nov 2026): sandbox keys are never staged here. Until the
# configuration says live, Stripe secrets in GitHub are left where they are and billing stays off.
if [ -n "${STRIPE_SECRET:-}${STRIPE_PUBLISHABLE:-}${STRIPE_WEBHOOK:-}" ] && [ "$mode" != live ]; then
  summary "Billing: Stripe secrets in GitHub were NOT staged: production billing is not set to live (WORK_STRIPE_ENVIRONMENT in $CONFIG is '${mode:-unset}'), so billing stays off"
  STRIPE_SECRET="" STRIPE_PUBLISHABLE="" STRIPE_WEBHOOK=""
fi
if [ -n "${STRIPE_SECRET:-}${STRIPE_PUBLISHABLE:-}${STRIPE_WEBHOOK:-}" ]; then
  [ "$mode" = live ] || fail "Stripe secrets can only be staged for live billing."
  if [ -n "${STRIPE_SECRET:-}" ]; then
    [[ "$STRIPE_SECRET" =~ ^(rk|sk)_${mode}_[A-Za-z0-9]+$ ]] || fail "WORK_STRIPE_SECRET_KEY is not a Stripe secret or restricted key for the $mode environment."
    lines+=("WORK_STRIPE_SECRET_KEY=$STRIPE_SECRET")
    summary "Billing: staged WORK_STRIPE_SECRET_KEY ($mode, ${STRIPE_SECRET%%_*} key)"
  fi
  if [ -n "${STRIPE_PUBLISHABLE:-}" ]; then
    [[ "$STRIPE_PUBLISHABLE" =~ ^pk_${mode}_[A-Za-z0-9]+$ ]] || fail "WORK_STRIPE_PUBLISHABLE_KEY is not a publishable key for the $mode environment."
    lines+=("WORK_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE")
    summary "Billing: staged WORK_STRIPE_PUBLISHABLE_KEY ($mode)"
  fi
  if [ -n "${STRIPE_WEBHOOK:-}" ]; then
    [[ "$STRIPE_WEBHOOK" =~ ^whsec_[A-Za-z0-9+/=_-]+$ ]] || fail "WORK_STRIPE_WEBHOOK_SECRET is not a Stripe webhook signing secret."
    lines+=("WORK_STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK")
    summary "Billing: staged WORK_STRIPE_WEBHOOK_SECRET"
  fi
fi

if [ "${#lines[@]}" -eq 0 ]; then
  summary "No settings from repository secrets to stage."
  exit 0
fi
# NAME=VALUE lines on standard input: never on a command line, never in the log.
printf '%s\n' "${lines[@]}" | flyctl secrets import --stage --app "$APP" > /dev/null
summary "Staged ${#lines[@]} setting(s) on $APP; the deploy below applies them."
