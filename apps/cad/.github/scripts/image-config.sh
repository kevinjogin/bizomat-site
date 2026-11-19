#!/usr/bin/env bash
# The config digest of an image in a registry (.github/workflows/deploy.yml): the digest of the image's configuration,
# which names every layer (their diff ids) and the image's settings. It identifies the exact image even when Fly deploys
# it under its own deployment-<id> tag with a rewritten manifest, whose manifest digest differs from the one pushed.
#
#   bash .github/scripts/image-config.sh registry.fly.io/cados@sha256:...   prints sha256:... (linux/amd64 for an index)
#
# Docker must be signed in to the registry (flyctl auth docker). Prints nothing and exits 1 when it cannot be read.
set -uo pipefail
ref="${1:?image reference}"
raw="$(docker buildx imagetools inspect --raw "$ref" 2>/dev/null)" || exit 1
config="$(jq -r '.config.digest // empty' <<<"$raw" 2>/dev/null)"
if [ -z "$config" ]; then
  # An index (a list of manifests): the linux/amd64 one, the platform the Machine runs.
  sub="$(jq -r 'first(.manifests[]? | select(.platform.os == "linux" and .platform.architecture == "amd64") | .digest) // empty' <<<"$raw" 2>/dev/null)"
  [ -n "$sub" ] || exit 1
  raw="$(docker buildx imagetools inspect --raw "${ref%@*}@$sub" 2>/dev/null)" || exit 1
  config="$(jq -r '.config.digest // empty' <<<"$raw" 2>/dev/null)"
fi
[[ "$config" =~ ^sha256:[0-9a-f]{64}$ ]] || exit 1
echo "$config"
