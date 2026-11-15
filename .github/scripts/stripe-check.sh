#!/usr/bin/env bash
# Checks the three live Stripe secrets the deploy would stage, before any deploy (.github/workflows/stripe-check.yml).
# Nothing is created, changed or charged in Stripe, nothing is staged on Fly, and no value is printed: only names, the
# key kind (rk/sk/pk/whsec) and Stripe's answers.
#
#   WORK_STRIPE_SECRET_KEY       a live secret or restricted key. It must read the price fly.website.toml names (so it
#                                belongs to the account that owns it) and hold every permission the app uses
#                                (docs/billing/README.md, "Restricted key permissions"). Reads list one object (only the
#                                HTTP status is kept, never the body); writes are sent with a made-up parameter, which Stripe refuses
#                                with 400 after its permission check (403 when the key lacks the permission), so no
#                                object is ever made.
#   WORK_STRIPE_PUBLISHABLE_KEY  a live publishable key (format only: Stripe has no read with a publishable key).
#   WORK_STRIPE_WEBHOOK_SECRET   a webhook signing secret (format only: Stripe never shows it again; a delivery proves it).
#
# Environment: STRIPE_SECRET, STRIPE_PUBLISHABLE, STRIPE_WEBHOOK; CONFIG (default fly.website.toml); STRIPE_API (default
# https://api.stripe.com, for a test).
set -uo pipefail
CONFIG="${CONFIG:-fly.website.toml}"
API="${STRIPE_API:-https://api.stripe.com}"
fails=0
say() { echo "$1"; echo "- $1" >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; }
ok() { say "ok: $1"; }
bad() { say "FAILED: $1"; fails=$((fails + 1)); }

read -r mode price < <(python3 -c 'import sys, tomllib; e = tomllib.load(open(sys.argv[1], "rb")).get("env", {}); print(e.get("WORK_STRIPE_ENVIRONMENT", "-"), e.get("WORK_STRIPE_PRICE_SEAT_MONTHLY", "-"))' "$CONFIG")
say "Production configuration ($CONFIG): WORK_STRIPE_ENVIRONMENT = $mode, WORK_STRIPE_PRICE_SEAT_MONTHLY = $price"
[ "$mode" = live ] || bad "production is not set to live billing"

# One request with the secret key: the key goes to curl on standard input, never on a command line. Prints the HTTP
# status, a space and Stripe's error code (empty when none).
call() { # method path [form data]
  local out status
  out="$(printf 'header = "Authorization: Bearer %s"\n' "$STRIPE_SECRET" | curl -s -K - --max-time 20 -X "$1" -w '\n%{http_code}' \
    ${3:+--data "$3"} "$API$2")"
  status="$(tail -n1 <<<"$out")"
  echo "$status $(head -n -1 <<<"$out" | python3 -c 'import json, sys
try: print((json.load(sys.stdin).get("error") or {}).get("code") or "")
except Exception: print("")' 2>/dev/null)"
}

if [ -z "${STRIPE_SECRET:-}" ]; then
  bad "WORK_STRIPE_SECRET_KEY is not set in this repository"
elif [[ ! "$STRIPE_SECRET" =~ ^(rk|sk)_live_[A-Za-z0-9]+$ ]]; then
  bad "WORK_STRIPE_SECRET_KEY is not a live secret or restricted key (a test key never reaches production)"
else
  ok "WORK_STRIPE_SECRET_KEY is set: a live ${STRIPE_SECRET%%_*} key"
  [[ "$STRIPE_SECRET" == sk_* ]] && say "note: a full secret key; a restricted key (rk_live_) with only the permissions below is safer"
  read -r st code < <(call GET "/v1/prices/$price?expand%5B%5D=product")
  if [ "$st" = 200 ]; then ok "it reads the configured price $price (so it belongs to the account that owns it)"
  else bad "it cannot read the configured price $price (HTTP $st ${code:-}): a key of another account, or no Prices: Read"; fi
  # permission | method | path | form data. A 403 means the key lacks it; anything else means Stripe let it through.
  while IFS='|' read -r what method path data; do
    read -r st code < <(call "$method" "$path" "$data")
    if [ "$st" = 403 ] || [ "$code" = more_permissions_required ]; then bad "the key lacks $what (HTTP $st)"
    elif [ "$st" = 401 ]; then bad "the key is not accepted by Stripe (HTTP 401)"
    else ok "$what (HTTP $st${code:+ $code}; nothing made)"; fi
  done <<'EOF'
Products: Read|GET|/v1/products?limit=1|
Customers: Write|POST|/v1/customers|bizomat_check_unknown_parameter=1
Customer tax IDs: Write|POST|/v1/customers/cus_bizomatcheck/tax_ids|bizomat_check_unknown_parameter=1
Checkout Sessions: Write|POST|/v1/checkout/sessions|bizomat_check_unknown_parameter=1
Subscriptions: Write|POST|/v1/subscriptions/sub_bizomatcheck|bizomat_check_unknown_parameter=1
Payment Methods: Read|GET|/v1/payment_methods?limit=1|
Invoices: Write|POST|/v1/invoices/in_bizomatcheck|bizomat_check_unknown_parameter=1
SetupIntents: Read|GET|/v1/setup_intents?limit=1|
Charges: Read|GET|/v1/charges?limit=1|
Disputes: Read|GET|/v1/disputes?limit=1|
Radar early fraud warnings: Read|GET|/v1/radar/early_fraud_warnings?limit=1|
EOF
fi

if [ -z "${STRIPE_PUBLISHABLE:-}" ]; then bad "WORK_STRIPE_PUBLISHABLE_KEY is not set in this repository"
elif [[ "$STRIPE_PUBLISHABLE" =~ ^pk_live_[A-Za-z0-9]+$ ]]; then ok "WORK_STRIPE_PUBLISHABLE_KEY is set: a live publishable key"
else bad "WORK_STRIPE_PUBLISHABLE_KEY is not a live publishable key"; fi

if [ -z "${STRIPE_WEBHOOK:-}" ]; then bad "WORK_STRIPE_WEBHOOK_SECRET is not set in this repository"
elif [[ "$STRIPE_WEBHOOK" =~ ^whsec_[A-Za-z0-9+/=_-]{16,}$ ]]; then ok "WORK_STRIPE_WEBHOOK_SECRET is set: a webhook signing secret (a delivery proves it is the live webhook's)"
else bad "WORK_STRIPE_WEBHOOK_SECRET is not a webhook signing secret"; fi

if [ "$fails" -gt 0 ]; then say "$fails check(s) failed: billing would stay off, or not work, after a deploy"; exit 1; fi
say "All live Stripe settings are ready for a deploy"
