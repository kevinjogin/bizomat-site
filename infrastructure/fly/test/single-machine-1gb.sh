#!/bin/bash
# The production Machine as fly.toml runs it, in one Docker container capped at 1 GB with no extra swap:
# `bizomat-entrypoint all` (cad, work, the proxy with the website inside) and fly.toml's [env]. A throwaway owner
# account is made first so CAD MCP starts (an empty CAD server waits with its holding page). The smoke test then runs
# inside the container through the proxy, and the memory used is printed. Fails if the container runs out of memory.
#
#   bash infrastructure/fly/test/single-machine-1gb.sh <image> [summary-file]
#
# Used by .github/workflows/bizomat-ci.yml (image job) and .github/workflows/deploy.yml (on the image it deploys).
# Needs Docker and python3. Uses a container and a volume named bz1g, removed at the end.
set -euo pipefail
IMAGE="${1:?usage: single-machine-1gb.sh <image> [summary-file]}"
SUMMARY="${2:-/dev/null}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

cleanup() {
  set +e
  if [ "${failed:-0}" = 1 ]; then docker logs bz1g 2>&1 | tail -150; fi
  docker rm -f bz1g >/dev/null 2>&1
  docker volume rm bz1g >/dev/null 2>&1
  return 0
}
trap cleanup EXIT
failed=1

docker rm -f bz1g >/dev/null 2>&1 || true
docker volume rm bz1g >/dev/null 2>&1 || true
docker volume create bz1g >/dev/null
docker run --rm -v bz1g:/data "$IMAGE" bash -c 'install -d -o 10004 -g 10004 -m 0700 /data/cad && cd /app/cad &&
  setpriv --reuid=10004 --regid=10004 --init-groups env OPENSKETCH_DATA=/data/cad HOME=/tmp /opt/cad/venv/bin/python -c \
  "from opensketch import accounts; accounts.create_owner(\"owner@example.invalid\", \"Test Owner\", \"test-only-passphrase-123456\")"'

envs=()
while IFS='=' read -r k v; do envs+=(-e "$k=$v"); done < <(python3 -c 'import sys, tomllib; [print(f"{k}={v}") for k, v in tomllib.load(open(sys.argv[1], "rb"))["env"].items()]' "$ROOT/fly.toml")
# No Fly edge in front here: the proxy treats the local requests as HTTPS, as the compose stack does.
docker run -d --name bz1g --memory 1g --memory-swap 1g -v bz1g:/data "${envs[@]}" -e PROXY_ASSUME_HTTPS=1 \
  "$IMAGE" /usr/local/bin/bizomat-entrypoint all >/dev/null

ok=""
for _ in $(seq 1 60); do
  if docker exec bz1g node -e "fetch('http://127.0.0.1:8080/__proxy/ready').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))" 2>/dev/null; then
    ok=1
    break
  fi
  sleep 5
done
[ -n "$ok" ] || { echo "the single machine did not become ready within 5 minutes" >&2; exit 1; }

docker exec bz1g node /usr/local/lib/bizomat/smoke/smoke.mjs http://127.0.0.1:8080 --mode hosts
{
  echo "### Single machine in 1 GB"
  echo '```'
  docker exec bz1g /usr/local/lib/bizomat/memory-report.sh
  echo "container: $(docker stats --no-stream --format '{{.MemUsage}}' bz1g) (limit 1 GiB, no extra swap)"
  echo '```'
} | tee -a "$SUMMARY"
[ "$(docker inspect -f '{{.State.OOMKilled}}' bz1g)" = false ] || { echo "out of memory at 1 GB" >&2; exit 1; }
failed=0
