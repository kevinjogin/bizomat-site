"""Row counts of a SQLite database, and its integrity check, on a copy (python3 counts.py DB [--markdown]).

Prints table names and numbers only, never a row. Exit 1 when the integrity check fails.
Used on the runner (dry run, before upload) and on the work Machine (after apply.sh).
"""

from __future__ import annotations

import os
import shutil
import sqlite3
import sys
import tempfile


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__.strip().splitlines()[0], file=sys.stderr)
        return 64
    db = argv[1]
    markdown = "--markdown" in argv[2:]
    if not os.path.isfile(db):
        print(f"counts: no database at {db}", file=sys.stderr)
        return 1
    with tempfile.TemporaryDirectory() as tmp:
        copy = os.path.join(tmp, "copy.sqlite")
        for suffix in ("", "-wal", "-shm", "-journal"):
            if os.path.isfile(db + suffix):
                shutil.copy2(db + suffix, copy + suffix)
        con = sqlite3.connect(copy)
        ok = con.execute("PRAGMA integrity_check").fetchone()[0]
        names = [r[0] for r in con.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")]
        rows = []
        for name in names:
            quoted = '"' + name.replace('"', '""') + '"'
            rows.append((name, con.execute(f"SELECT count(*) FROM {quoted}").fetchone()[0]))
        con.close()
    if markdown:
        print("| Table | Rows |")
        print("| --- | ---: |")
        for name, n in rows:
            print(f"| `{name}` | {n} |")
        print(f"\nIntegrity check: {ok}. Tables: {len(rows)}. Rows: {sum(n for _, n in rows)}.")
    else:
        for name, n in rows:
            print(f"counts: {name} {n}")
        print(f"counts: integrity {ok}, {len(rows)} tables, {sum(n for _, n in rows)} rows")
    return 0 if ok == "ok" else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
