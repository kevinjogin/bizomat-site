"""What visitors saw during a deploy (.github/workflows/bizomat-deploy.yml, docs/deployment/DOWNTIME-REVIEW.md,
recommendation 1). Reads the lines "<HH:MM:SS> <url> <status>" written once a second while the deploy ran, and prints a
Markdown summary: per address, the seconds that failed (no answer or 5xx), the first and the last.

    python3 .github/scripts/outage-summary.py <log>
"""

from __future__ import annotations

import sys
from collections import defaultdict


def main(path: str) -> None:
    samples: dict[str, list[tuple[str, str]]] = defaultdict(list)
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                parts = line.split()
                if len(parts) == 3:
                    samples[parts[1]].append((parts[0], parts[2]))
    except FileNotFoundError:
        print("- Outage: not measured (no samples).")
        return
    print("### What visitors saw during the deploy (one request a second)")
    for url, rows in samples.items():
        bad = [t for t, code in rows if code == "000" or code.startswith("5")]
        if not bad:
            print(f"- {url}: answered every time ({len(rows)} samples)")
        else:
            print(f"- {url}: {len(bad)} of {len(rows)} samples failed, from {bad[0]} to {bad[-1]} UTC")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "")
