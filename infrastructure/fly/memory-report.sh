#!/bin/sh
# Memory of the single Machine: totals from /proc/meminfo, then the processes using the most (resident set, MB).
# Run inside the Machine (the deploy workflow does: flyctl ssh console -C /usr/local/lib/bizomat/memory-report.sh).
# Prints process names and sizes only; never their environment or arguments beyond the first few words.
grep -E '^(MemTotal|MemAvailable|SwapTotal|SwapFree):' /proc/meminfo
for p in /proc/[0-9]*; do
  rss="$(awk '/^VmRSS:/ {print $2}' "$p/status" 2>/dev/null)"
  [ -n "$rss" ] || continue
  cmd="$(tr '\0' ' ' <"$p/cmdline" 2>/dev/null | cut -d' ' -f1-4 | cut -c1-80)"
  printf 'rss %s %s\n' "$rss" "$cmd"
done | sort -k2 -rn | head -10 | awk '{ kb = $2; $1 = ""; $2 = ""; printf "%6d MB %s\n", kb / 1024, $0 }'
