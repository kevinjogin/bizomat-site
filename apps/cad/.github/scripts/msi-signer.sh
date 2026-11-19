#!/usr/bin/env bash
# Prints "<SHA-1 thumbprint> subject=<subject>" for every certificate in an MSI's Authenticode signature (needs
# osslsigncode and openssl). Used by .github/workflows/installer-volume.yml to check who signed an installer.
set -euo pipefail
f="$1"; work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
osslsigncode extract-signature -in "$f" -out "$work/sig.der" >/dev/null 2>&1 || { echo "no Authenticode signature" >&2; exit 1; }
openssl pkcs7 -inform DER -in "$work/sig.der" -print_certs -out "$work/certs.pem" 2>/dev/null
awk -v d="$work" '/BEGIN CERT/{n++} n{print > (d "/c" n ".pem")}' "$work/certs.pem"
for c in "$work"/c*.pem; do
  openssl x509 -in "$c" -noout -fingerprint -sha1 -subject | paste -sd' ' | sed -E 's/^sha1 Fingerprint=//I; s/://g'
done
