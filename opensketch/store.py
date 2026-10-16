"""Documents kept on the server, so Claude (through the MCP) and the browser work on the same model.

Each document is one JSON file in the data folder (OPENSKETCH_DATA, default ~/opensketch-data):

    docs/<id>.json        {"id", "name", "version", "updated", "by", "summary", "doc", "requests"}
    docs/<id>/v<N>.json   earlier versions (the last KEEP), for undo

`version` goes up by one on every save. `by` is "claude" or "you", `summary` says what changed. The
browser polls the version to follow Claude's changes; a save names the version it was based on, and is
refused (Conflict) if someone else saved in between.
"""

from __future__ import annotations

import json
import os
import re
import threading
import time
import uuid
from pathlib import Path

KEEP = 50
_locks: dict[str, threading.RLock] = {}
_locks_guard = threading.Lock()


class Conflict(Exception):
    def __init__(self, current: dict):
        super().__init__("The document changed since it was opened")
        self.current = current


class NotFound(Exception):
    pass


def data_dir() -> Path:
    d = Path(os.environ.get("OPENSKETCH_DATA") or Path.home() / "opensketch-data")
    (d / "docs").mkdir(parents=True, exist_ok=True)
    return d


def lock(doc_id: str) -> threading.RLock:
    with _locks_guard:
        return _locks.setdefault(doc_id, threading.RLock())


def _path(doc_id: str) -> Path:
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", doc_id or ""):
        raise NotFound(doc_id)
    return data_dir() / "docs" / f"{doc_id}.json"


def _write(path: Path, rec: dict) -> None:
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(rec, separators=(",", ":")))
    os.replace(tmp, path)  # never a half-written file


def kind_of(doc: dict) -> str:
    return "assembly" if doc.get("type") == "assembly" else "part"


def empty_doc(name: str, kind: str = "part") -> dict:
    if kind == "assembly":
        return {"version": 1, "type": "assembly", "name": name, "units": "mm", "parts": {}, "components": [],
                "mates": [], "sequence": [], "seq": 1}
    return {"version": 1, "type": "part", "name": name, "units": "mm", "features": [], "rollback": None, "seq": 10}


def create(name: str, doc: dict | None = None, kind: str = "part", by: str = "you") -> dict:
    doc = doc or empty_doc(name, kind)
    doc["name"] = name or doc.get("name") or "Untitled"
    doc_id = uuid.uuid4().hex[:12]
    rec = {"id": doc_id, "name": doc["name"], "version": 1, "updated": time.time(), "by": by,
           "summary": "Created", "doc": doc, "requests": []}
    _write(_path(doc_id), rec)
    return rec


def get(doc_id: str) -> dict:
    try:
        return json.loads(_path(doc_id).read_text())
    except FileNotFoundError as exc:
        raise NotFound(doc_id) from exc


def head(doc_id: str) -> dict:
    """The small part of a record the browser polls."""
    r = get(doc_id)
    return {k: r.get(k) for k in ("id", "name", "version", "updated", "by", "summary")} | {"requests": len(r.get("requests") or [])}


def save(doc_id: str, doc: dict, by: str, summary: str = "", base_version: int | None = None,
         requests: list | None = None) -> dict:
    """Store a new version. base_version: refuse if the stored version is not this one."""
    with lock(doc_id):
        rec = get(doc_id)
        if base_version is not None and int(base_version) != rec["version"]:
            raise Conflict(rec)
        hist = _path(doc_id).with_suffix("")
        hist.mkdir(exist_ok=True)
        _write(hist / f"v{rec['version']}.json", rec)
        old = hist / f"v{rec['version'] - KEEP}.json"
        if old.exists():
            old.unlink()
        rec.update(version=rec["version"] + 1, updated=time.time(), by=by, summary=summary or "Changed",
                   doc=doc, name=doc.get("name") or rec["name"])
        if requests is not None:
            rec["requests"] = requests
        _write(_path(doc_id), rec)
        return rec


def undo(doc_id: str, by: str) -> dict:
    """Go back to the version before the latest one (stored as a new version, so it can be redone)."""
    with lock(doc_id):
        rec = get(doc_id)
        prev = _path(doc_id).with_suffix("") / f"v{rec['version'] - 1}.json"
        if not prev.exists():
            raise NotFound(f"No earlier version of {doc_id}")
        old = json.loads(prev.read_text())
        return save(doc_id, old["doc"], by, f"Undid: {rec.get('summary') or 'last change'}",
                    requests=old.get("requests") or [])


def versions(doc_id: str) -> list[dict]:
    """Earlier versions still kept, newest first: {version, by, summary, updated}."""
    hist = _path(doc_id).with_suffix("")
    out = []
    for p in hist.glob("v*.json") if hist.exists() else []:
        try:
            r = json.loads(p.read_text())
        except (OSError, ValueError):
            continue
        out.append({k: r.get(k) for k in ("version", "by", "summary", "updated")})
    return sorted(out, key=lambda r: -r["version"])


def restore(doc_id: str, version: int, by: str) -> dict:
    """Bring back an earlier version (as a new version, so nothing is lost)."""
    with lock(doc_id):
        p = _path(doc_id).with_suffix("") / f"v{int(version)}.json"
        if not p.exists():
            raise NotFound(f"Version {version} of {doc_id} is not kept")
        old = json.loads(p.read_text())
        return save(doc_id, old["doc"], by, f"Restored version {version}", requests=old.get("requests") or [])


def rename(doc_id: str, name: str, by: str = "you") -> dict:
    rec = get(doc_id)
    doc = dict(rec["doc"], name=name)
    return save(doc_id, doc, by, f"Renamed to {name}")


def listing() -> list[dict]:
    out = []
    for p in (data_dir() / "docs").glob("*.json"):
        try:
            r = json.loads(p.read_text())
        except (OSError, ValueError):
            continue
        out.append({"id": r["id"], "name": r["name"], "version": r["version"], "updated": r["updated"],
                    "by": r.get("by"), "summary": r.get("summary"), "kind": kind_of(r["doc"])})
    return sorted(out, key=lambda r: -r["updated"])
