"""Documents kept on the server: each person's Files, shared live with their AI (through the MCP endpoint).

Each document is a few files in the data folder (OPENSKETCH_DATA, default ~/opensketch-data):

    docs/<id>.json            {"id", "name", "version", "created", "updated", "by", "summary", "owner", "doc", "requests"}
    docs/<id>.meta.json       the same without "doc" and "requests", plus kind, counts and thumbnail: what the
                              Files list and the browser's poll read, so they never parse a whole model
    docs/<id>.thumb.webp|png  a picture of the model (from the browser, or rendered on the server)
    docs/<id>/v<N>.json       earlier versions (the last KEEP), for undo and version history

`version` goes up by one on every save. `by` is "claude" or "you", `summary` says what changed. `owner` is
the account id that owns the document (None: made before accounts, or on a server without accounts; the
server owner sees those). The browser polls the version to follow the AI's changes; a save names the version
it was based on, and is refused (Conflict) if someone else saved in between.

Deleting moves a document to the Trash (`deleted` = time); it is removed for good after TRASH_DAYS or when
emptied from the Trash.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import threading
import time
import uuid
from pathlib import Path

KEEP = 50
TRASH_DAYS = 30
THUMB_MAX = 600_000  # bytes
_locks: dict[str, threading.RLock] = {}
_locks_guard = threading.Lock()
META_KEYS = ("id", "name", "version", "created", "updated", "by", "summary", "owner", "deleted")


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


def valid_id(doc_id) -> bool:
    return isinstance(doc_id, str) and re.fullmatch(r"[A-Za-z0-9_-]{1,64}", doc_id) is not None


def _path(doc_id: str) -> Path:
    if not valid_id(doc_id):
        raise NotFound(doc_id)
    return data_dir() / "docs" / f"{doc_id}.json"


def _meta_path(doc_id: str) -> Path:
    return _path(doc_id).with_suffix(".meta.json")


def _write(path: Path, rec: dict) -> None:
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(rec, separators=(",", ":")))
    os.replace(tmp, path)  # never a half-written file


def kind_of(doc: dict) -> str:
    return "assembly" if doc.get("type") == "assembly" else "part"


def _counts(doc: dict) -> dict:
    if kind_of(doc) == "assembly":
        return {"components": len(doc.get("components") or []), "parts": len(doc.get("parts") or {}),
                "mates": len(doc.get("mates") or [])}
    feats = doc.get("features") or []
    return {"features": sum(1 for f in feats if f.get("type") != "sketch"),
            "sketches": sum(1 for f in feats if f.get("type") == "sketch"),
            "imported": any(f.get("type") == "import" for f in feats)}


def _meta_of(rec: dict, size: int | None = None, thumb: dict | None = None) -> dict:
    m = {k: rec.get(k) for k in META_KEYS}
    m["created"] = m["created"] or rec.get("updated")
    m["kind"] = kind_of(rec.get("doc") or {})
    m["counts"] = _counts(rec.get("doc") or {})
    m["requests"] = len(rec.get("requests") or [])
    m["size"] = size
    m["thumb"] = thumb
    return m


def _save_files(rec: dict, thumb: dict | None = "keep") -> None:
    """Write the record and its meta (keeping the thumbnail entry unless one is given)."""
    p = _path(rec["id"])
    _write(p, rec)
    if thumb == "keep":
        try:
            thumb = json.loads(_meta_path(rec["id"]).read_text()).get("thumb")
        except (OSError, ValueError):
            thumb = None
    _write(_meta_path(rec["id"]), _meta_of(rec, p.stat().st_size, thumb))


def empty_doc(name: str, kind: str = "part") -> dict:
    if kind == "assembly":
        return {"version": 1, "type": "assembly", "name": name, "units": "mm", "parts": {}, "components": [],
                "mates": [], "sequence": [], "seq": 1}
    return {"version": 1, "type": "part", "name": name, "units": "mm", "features": [], "rollback": None, "seq": 10}


def create(name: str, doc: dict | None = None, kind: str = "part", by: str = "you", owner: str | None = None,
           summary: str = "Created") -> dict:
    doc = doc or empty_doc(name, kind)
    doc["name"] = (name or doc.get("name") or "Untitled").strip()[:120] or "Untitled"
    doc_id = uuid.uuid4().hex[:12]
    now = time.time()
    rec = {"id": doc_id, "name": doc["name"], "version": 1, "created": now, "updated": now, "by": by,
           "summary": summary, "owner": owner, "doc": doc, "requests": []}
    _save_files(rec, thumb=None)
    return rec


def get(doc_id: str) -> dict:
    try:
        return json.loads(_path(doc_id).read_text())
    except FileNotFoundError as exc:
        raise NotFound(doc_id) from exc


def meta(doc_id: str) -> dict:
    """The small description of a document (no model). Built from the record once for older documents."""
    try:
        return json.loads(_meta_path(doc_id).read_text())
    except FileNotFoundError:
        pass
    except ValueError:
        pass
    with lock(doc_id):
        rec = get(doc_id)
        m = _meta_of(rec, _path(doc_id).stat().st_size, _existing_thumb(doc_id))
        _write(_meta_path(doc_id), m)
        return m


def head(doc_id: str) -> dict:
    """The small part of a record the browser polls."""
    m = meta(doc_id)
    return {k: m.get(k) for k in ("id", "name", "version", "updated", "by", "summary", "requests")}


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
        _trim_history(hist)
        rec.update(version=rec["version"] + 1, updated=time.time(), by=by, summary=summary or "Changed",
                   doc=doc, name=doc.get("name") or rec["name"])
        if requests is not None:
            rec["requests"] = requests
        _save_files(rec)
        return rec


HISTORY_MAX = 64 * 1024 * 1024  # bytes of kept versions per document (large imports), newest 5 always kept


def _trim_history(hist: Path) -> None:
    files = sorted(hist.glob("v*.json"), key=lambda p: int(p.stem[1:]) if p.stem[1:].isdigit() else 0)
    sizes = [f.stat().st_size for f in files]
    total = sum(sizes)
    for f, n in zip(files[:-5], sizes[:-5]):
        if total <= HISTORY_MAX:
            break
        f.unlink()
        total -= n


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


def get_version(doc_id: str, version: int) -> dict:
    """The record as it was at `version` (the current one, or one of the last KEEP kept in history)."""
    rec = get(doc_id)
    if int(version) == rec["version"]:
        return rec
    p = _path(doc_id).with_suffix("") / f"v{int(version)}.json"
    if not p.exists():
        raise NotFound(f"Version {version} of {doc_id} is not kept")
    return json.loads(p.read_text())


def restore(doc_id: str, version: int, by: str) -> dict:
    """Bring back an earlier version (as a new version, so nothing is lost)."""
    with lock(doc_id):
        p = _path(doc_id).with_suffix("") / f"v{int(version)}.json"
        if not p.exists():
            raise NotFound(f"Version {version} of {doc_id} is not kept")
        old = json.loads(p.read_text())
        return save(doc_id, old["doc"], by, f"Restored version {version}", requests=old.get("requests") or [])


def rename(doc_id: str, name: str, by: str = "you") -> dict:
    name = (name or "").strip()[:120]
    if not name:
        raise ValueError("Give the document a name.")
    with lock(doc_id):
        rec = get(doc_id)
        doc = dict(rec["doc"], name=name)
        return save(doc_id, doc, by, f"Renamed to {name}")


def duplicate(doc_id: str, owner: str | None, by: str = "you", name: str | None = None) -> dict:
    """A new document with the same model (history is not copied; the thumbnail is)."""
    src = get(doc_id)
    rec = create(name or f"{src['name']} copy", json.loads(json.dumps(src["doc"])), by=by, owner=owner,
                 summary=f"Copied from {src['name']}")
    old = _existing_thumb(doc_id)
    if old:
        ext = old["ext"]
        shutil.copyfile(_thumb_file(doc_id, ext), _thumb_file(rec["id"], ext))
        set_thumb_entry(rec["id"], dict(old, version=rec["version"]))
    return rec


# ----------------------------------------------------------------------------- trash

def trash(doc_id: str) -> dict:
    """Move to the Trash (kept TRASH_DAYS days)."""
    with lock(doc_id):
        rec = get(doc_id)
        rec["deleted"] = time.time()
        _save_files(rec)
        return meta(doc_id)


def untrash(doc_id: str) -> dict:
    with lock(doc_id):
        rec = get(doc_id)
        rec["deleted"] = None
        _save_files(rec)
        return meta(doc_id)


def purge(doc_id: str) -> None:
    """Remove a document, its history and its picture for good."""
    with lock(doc_id):
        p = _path(doc_id)
        for f in (p, _meta_path(doc_id), _thumb_file(doc_id, "webp"), _thumb_file(doc_id, "png")):
            try:
                f.unlink()
            except FileNotFoundError:
                pass
        shutil.rmtree(p.with_suffix(""), ignore_errors=True)


# ----------------------------------------------------------------------------- thumbnails

def _thumb_file(doc_id: str, ext: str) -> Path:
    return _path(doc_id).with_suffix(f".thumb.{ext}")


def _existing_thumb(doc_id: str) -> dict | None:
    for ext in ("webp", "png"):
        f = _thumb_file(doc_id, ext)
        if f.exists():
            return {"ext": ext, "version": 0, "source": "unknown", "updated": f.stat().st_mtime}
    return None


def set_thumb_entry(doc_id: str, entry: dict | None) -> None:
    with lock(doc_id):
        m = meta(doc_id)
        m["thumb"] = entry
        _write(_meta_path(doc_id), m)


def set_thumb(doc_id: str, data: bytes, ext: str, version: int, source: str) -> dict:
    """Store a picture of the document at `version` ("browser" or "server")."""
    if ext not in ("webp", "png"):
        raise ValueError("Pictures must be WebP or PNG")
    if not data or len(data) > THUMB_MAX:
        raise ValueError("The picture is empty or too big")
    magic = data[:4] == b"\x89PNG" if ext == "png" else (data[:4] == b"RIFF" and data[8:12] == b"WEBP")
    if not magic:
        raise ValueError("That is not a WebP or PNG picture")
    with lock(doc_id):
        m = meta(doc_id)
        cur = m.get("thumb") or {}
        if cur and int(cur.get("version") or 0) > int(version) and source == "server":
            return cur  # a newer picture is already there
        other = "png" if ext == "webp" else "webp"
        f = _thumb_file(doc_id, ext)
        tmp = f.with_name(f.name + ".tmp")
        tmp.write_bytes(data)
        os.replace(tmp, f)
        try:
            _thumb_file(doc_id, other).unlink()
        except FileNotFoundError:
            pass
        entry = {"ext": ext, "version": int(version), "source": source, "updated": time.time()}
        m["thumb"] = entry
        _write(_meta_path(doc_id), m)
        return entry


def thumb(doc_id: str) -> tuple[Path, dict] | None:
    m = meta(doc_id)
    t = m.get("thumb")
    if t:
        f = _thumb_file(doc_id, t["ext"])
        if f.exists():
            return f, t
    return None


# ----------------------------------------------------------------------------- who sees what

def owner_of(user: dict | None) -> str | None:
    """The owner id new documents get: the account, or None without accounts (or the old server password)."""
    return user["id"] if user and not user.get("legacy") else None


def can_see(m: dict, user: dict | None) -> bool:
    """Each person sees their own documents. The server owner also sees documents with no owner (made before
    accounts, or by the old server-wide connector address). Without accounts everyone sees everything."""
    if user is None or user.get("legacy"):
        return True
    own = m.get("owner")
    return own == user["id"] or (own is None and user.get("role") == "owner")


def visible_to(user: dict | None):
    return lambda m: can_see(m, user)


# ----------------------------------------------------------------------------- listing

def _all_meta() -> list[dict]:
    out = []
    for p in (data_dir() / "docs").glob("*.json"):
        name = p.name
        if name.endswith(".meta.json") or name.endswith(".tmp"):
            continue
        doc_id = name[:-5]
        if not valid_id(doc_id):
            continue
        try:
            out.append(meta(doc_id))
        except (NotFound, OSError, ValueError, KeyError):
            continue
    return out


def listing(visible=None, deleted: bool = False) -> list[dict]:
    """Documents newest first. visible(meta) -> bool filters by owner; deleted=True lists the Trash.
    Documents in the Trash longer than TRASH_DAYS are removed here."""
    out = []
    limit = time.time() - TRASH_DAYS * 86400
    for m in _all_meta():
        if m.get("deleted") and m["deleted"] < limit:
            purge(m["id"])
            continue
        if bool(m.get("deleted")) != deleted:
            continue
        if visible is not None and not visible(m):
            continue
        out.append(m)
    return sorted(out, key=lambda r: -(r.get("deleted") or r["updated"] if deleted else r["updated"]))
