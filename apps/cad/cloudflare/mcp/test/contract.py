"""The server's side of the data store, run by contract.test.ts against the Worker's side (src/persist.ts).

python contract.py <repository> <store url> <mode> <data folder>; prints one JSON object.
"""
import json
import os
import sqlite3
import sys
from pathlib import Path

repo, url, mode, folder = sys.argv[1:5]
sys.path.insert(0, repo)
os.environ["OPENSKETCH_PERSIST_URL"] = url
from opensketch import persist  # noqa: E402  (stdlib only)

folder = Path(folder)
quiet = lambda m: None  # noqa: E731
out = {}

if mode == "seed":
    folder.mkdir(parents=True)
    (folder / "accounts.enabled").write_bytes(b"")
    (folder / "users.json").write_text(json.dumps({"users": [{"id": "u1", "email": "owner@example.com"}]}))
    (folder / "secret.keys").write_bytes(bytes(range(256)) * 4)
    (folder / "users.json.lock").write_text("")
    (folder / "uploads").mkdir()
    (folder / "uploads" / "part.step").write_text("in transit")
    con = sqlite3.connect(folder / "bridge.sqlite", isolation_level=None)
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("CREATE TABLE devices (id TEXT)")
    con.executemany("INSERT INTO devices VALUES (?)", [(f"d{i}",) for i in range(500)])
    s = persist.Syncer(folder, every=60, log=quiet)
    out["sent"] = s.sync_once()
    out["again"] = s.sync_once()
    con.execute("INSERT INTO devices VALUES ('late')")  # lands in the -wal file
    out["after_change"] = s.sync_once()
    con.close()
    (folder / "google_oauth.json").write_text("{}")
    out["new_file"] = s.sync_once()
    (folder / "google_oauth.json").unlink()
    s.sync_once()
    s.sync_once()  # gone twice: removed from the store
    out["flushed"] = s.flush(attempts=1)
elif mode == "restore":
    got = persist.restore(folder, log=quiet)
    out["restored"] = sorted(got)
    out["devices"] = sqlite3.connect(folder / "bridge.sqlite").execute("SELECT count(*) FROM devices").fetchone()[0]
    out["users"] = json.loads((folder / "users.json").read_text())
    out["secret_ok"] = (folder / "secret.keys").read_bytes() == bytes(range(256)) * 4
    out["mode"] = oct((folder / "secret.keys").stat().st_mode & 0o777)
    out["resent"] = persist.Syncer(folder, sent=got, every=60, log=quiet).sync_once()
elif mode == "empty":
    try:
        persist.restore(folder, log=quiet)
        out["error"] = None
    except persist.StoreError as e:
        out["error"] = str(e)
print(json.dumps(out))
