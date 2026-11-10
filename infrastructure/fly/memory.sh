#!/bin/bash
# Memory of the Machine and of each BIZOMAT service on it (read-only; prints sizes and service names, nothing else).
# On the one Machine of fly.website.toml (bizomat-entrypoint all), from the laptop:
#   fly machine exec <machine id> -a bizomat "bash /usr/local/lib/bizomat/memory.sh"
# used = MemTotal - MemAvailable: what the services and the kernel hold that cannot simply be given back. rss counts
# the shared Node binary once per service, so the services' rss add up to more than they use together; anon is each
# one's own memory, and peak its largest rss since it started.
set -euo pipefail

awk '/^(MemTotal|MemAvailable|SwapTotal|SwapFree):/ { v[$1] = $2 }
  END {
    printf "machine   total %5d MB  available %5d MB  used %5d MB  swap %d of %d MB free\n",
      v["MemTotal:"] / 1024, v["MemAvailable:"] / 1024, (v["MemTotal:"] - v["MemAvailable:"]) / 1024,
      v["SwapFree:"] / 1024, v["SwapTotal:"] / 1024
  }' /proc/meminfo

for p in /proc/[0-9]*; do
  cmd="$(tr '\0' ' ' <"$p/cmdline" 2>/dev/null)" || continue
  case "$cmd" in
    "/usr/local/bin/node /app/proxy/server.mjs"*) role=proxy ;;
    "/usr/local/bin/node /app/web/dist-server/server.mjs"*) role=web ;;
    "/usr/local/bin/node /app/work/dist/node/server.mjs"*) role=work ;;
    "/bin/bash /usr/local/bin/bizomat-entrypoint all"*) role=supervisor ;;
    *) continue ;;
  esac
  awk -v role="$role" '/^(VmRSS|RssAnon|VmHWM):/ { v[$1] = $2 }
    END { printf "%-10s rss %5d MB  anon %5d MB  peak %5d MB\n", role, v["VmRSS:"] / 1024, v["RssAnon:"] / 1024, v["VmHWM:"] / 1024 }' \
    "$p/status" 2>/dev/null || true
done
