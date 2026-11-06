"""One-time upload links for MCP clients: request_upload -> send the file to the link -> sw_import(upload_id).

A tool call carries its arguments as text, so sw_import's `data` had to hold the whole file as base64:
about 1.6 million characters for a 6.5 MB STEP, which a model cannot write out reliably (one wrong character
breaks the file). Instead the client asks for a link, sends the file's bytes to it with a plain HTTP PUT
(`curl -T model.step '<url>'`), and passes the upload_id to sw_import.

- The link is a capability for one upload, like an artifact download link: signed with the data-folder secret
  and the server-wide connector address, valid LINK_LIFETIME seconds, used once.
  It carries no MCP credential and opens nothing else.
- The upload belongs to the person whose connector asked for it; sw_import refuses anyone else's id.
- The file is capped at the import limit (32 MiB, the same as base64 imports), after unzipping a gzip body.
  It is kept KEEP seconds for sw_import and removed once imported.
- Room: files waiting for sw_import take at most MAX_RESERVED on the server, counted as they arrive (`room`),
  so a link that is never used holds nothing; and nothing is taken when the data disk is nearly full
  (store.check_disk). The records are shared by the web server and the CAD workers (sw_import runs there),
  so they change under a file lock.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import time
import uuid
from pathlib import Path
from urllib.parse import urlencode

from . import auth, canonical, store

LINK_LIFETIME = 600          # seconds a link takes an upload
KEEP = 1800                  # seconds an uploaded file waits for sw_import
MAX_PENDING = 4              # links per person waiting for a file or an import
MAX_RESERVED = 192 * 2**20   # bytes of uploaded files waiting for sw_import (Fly volume is 1 GB)
_ID = re.compile(r"[0-9a-f]{32}")
_NAME = re.compile(r"[^/\\\x00-\x1f]{1,255}")


class UploadError(ValueError):
    """status: the HTTP status the upload route answers with."""

    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def _owner(user: dict | None) -> str | None:
    return store.owner_of(user)


def _directory() -> Path:
    path = store.data_dir() / "uploads"
    path.mkdir(exist_ok=True)
    return path


def _signature(upload_id: str, owner: str | None, expires: int) -> str:
    message = f"opensketch-upload-v1\n{upload_id}\n{owner or ''}\n{expires}"
    key = hmac.new(auth.data_secret("upload-link"), auth.mcp_token().encode(), hashlib.sha256).digest()
    return hmac.new(key, message.encode(), hashlib.sha256).hexdigest()


def _meta_path(upload_id: str) -> Path:
    return _directory() / f"{upload_id}.json"


def _read(upload_id: str) -> dict | None:
    try:
        return json.loads(_meta_path(upload_id).read_text())
    except (OSError, ValueError):
        return None


def _write(meta: dict) -> None:
    path = _meta_path(meta["upload_id"])
    tmp = path.with_name(f"{path.name}.{uuid.uuid4().hex[:8]}.tmp")
    tmp.write_text(json.dumps(meta))
    os.replace(tmp, path)


def _remove(upload_id: str) -> None:
    d = _directory()
    for suffix in (".bin", ".part", ".json"):
        (d / f"{upload_id}{suffix}").unlink(missing_ok=True)


def _cleanup(now: float) -> list[dict]:
    """Drop expired links and files; return the records still alive."""
    alive = []
    for path in _directory().glob("*.json"):
        if not _ID.fullmatch(path.stem):
            continue
        m = _read(path.stem)
        if m is None:
            continue
        state = m.get("state")
        dead = ((state == "waiting" and m["expires_at"] + 300 < now)          # grace for an upload in flight
                or (state == "received" and m.get("keep_until", 0) < now)
                or (state == "imported" and m.get("imported_at", 0) + KEEP < now))
        if dead:
            _remove(path.stem)
        else:
            alive.append(m)
    return alive


def _locked():
    return store.file_lock(_directory() / ".lock")


def _held() -> int:
    """Bytes the upload area holds now: files waiting for sw_import and uploads arriving."""
    total = 0
    for p in _directory().iterdir():
        if p.suffix in (".bin", ".part") and _ID.fullmatch(p.stem):
            try:
                total += p.stat().st_size
            except OSError:
                pass
    return total


def room() -> int:
    """Bytes an arriving upload may still take (the upload area's share, and the disk's)."""
    left = MAX_RESERVED - _held()
    try:
        import shutil
        left = min(left, shutil.disk_usage(store.data_dir()).free - 2 * store.RESERVE)
    except OSError:
        pass
    return max(0, left)


def create(user: dict | None, filename: str, cap: int, size_bytes: int | None = None) -> dict:
    """A new one-time upload link for this person."""
    if not _NAME.fullmatch(filename or "") or filename in (".", ".."):
        raise UploadError("Use a filename without directory components, e.g. model.step.")
    if size_bytes is not None and size_bytes > cap:
        raise UploadError(f"The file is {size_bytes} bytes; imports are limited to {cap // 2**20} MiB.")
    owner = _owner(user)
    now = time.time()
    with _locked():
        alive = _cleanup(now)
        mine = [m for m in alive if m.get("owner") == owner and m.get("state") in ("waiting", "received")]
        if len(mine) >= MAX_PENDING:
            raise UploadError(f"You already have {len(mine)} upload links open. Import or let them expire "
                              f"(links last {LINK_LIFETIME // 60} minutes, uploads {KEEP // 60}).")
        if room() < (size_bytes or 1):
            raise UploadError("The upload area is full. Try again in a few minutes.")
        upload_id = uuid.uuid4().hex
        expires = int(now) + LINK_LIFETIME
        meta = {"upload_id": upload_id, "owner": owner, "filename": filename, "state": "waiting",
                "created": int(now), "expires_at": expires}
        _write(meta)
    query = urlencode({"expires": expires, "signature": _signature(upload_id, owner, expires)})
    url = f"{canonical.machine_base() or auth.public_url()}/mcp/uploads/{upload_id}?{query}"
    return {"upload_id": upload_id, "upload_url": url, "method": "PUT", "filename": filename,
            "expires_at": expires, "expires_in_seconds": LINK_LIFETIME, "max_bytes": cap}


def check_link(upload_id: str, expires: str, signature: str) -> dict:
    """The record for a signed, unexpired, unused link. Anything not signed by us is a plain 404."""
    if not _ID.fullmatch(upload_id or "") or not re.fullmatch(r"[0-9a-f]{64}", signature or ""):
        raise UploadError("No such upload link.", 404)
    try:
        expiry = int(expires)
    except (TypeError, ValueError):
        raise UploadError("No such upload link.", 404) from None
    m = _read(upload_id)
    if m is None or m.get("expires_at") != expiry or not hmac.compare_digest(
            signature.encode(), _signature(upload_id, m.get("owner"), expiry).encode()):
        raise UploadError("No such upload link.", 404)
    if m.get("state") != "waiting":
        raise UploadError("This upload link was already used. Ask for a new one with request_upload.", 409)
    if expiry <= time.time():
        raise UploadError("This upload link has expired. Ask for a new one with request_upload.", 410)
    return m


def begin(upload_id: str):
    """Claim the link for this request (a second upload at the same time gets 409). Returns an open file."""
    try:
        return (_directory() / f"{upload_id}.part").open("xb")
    except FileExistsError:
        raise UploadError("An upload to this link is already in progress.", 409) from None


def abort(upload_id: str) -> None:
    """A failed or refused upload leaves the link usable until it expires."""
    (_directory() / f"{upload_id}.part").unlink(missing_ok=True)


def finish(upload_id: str, size: int, sha256: str) -> dict:
    with _locked():
        m = _read(upload_id)
        if m is None or m.get("state") != "waiting":
            abort(upload_id)
            raise UploadError("This upload link was already used. Ask for a new one with request_upload.", 409)
        d = _directory()
        os.replace(d / f"{upload_id}.part", d / f"{upload_id}.bin")
        now = int(time.time())
        m.update(state="received", size_bytes=size, sha256=sha256, received_at=now, keep_until=now + KEEP)
        _write(m)
    return {"upload_id": upload_id, "filename": m["filename"], "size_bytes": size, "sha256": sha256,
            "next": f'Call sw_import with upload_id "{upload_id}" within {KEEP // 60} minutes.'}


def take(upload_id: str, user: dict | None) -> tuple[bytes, dict]:
    """The uploaded bytes for sw_import, if this person's upload is there."""
    if not _ID.fullmatch(upload_id or ""):
        raise UploadError("Unknown upload_id.")
    with _locked():
        _cleanup(time.time())
        m = _read(upload_id)
        if m is None or m.get("owner") != _owner(user):
            raise UploadError("Unknown upload_id, or it expired. Ask for a new link with request_upload.")
        if m["state"] == "imported":
            raise UploadError(f"That upload was already imported as document {m.get('doc_id')!r}.")
        if m["state"] == "waiting":
            left = int(m["expires_at"] - time.time())
            raise UploadError("Nothing has been sent to that link yet. PUT the file to upload_url first"
                              + (f" (it is open for {left} more seconds)." if left > 0 else "; it has expired, ask for a new one."))
        try:
            raw = (_directory() / f"{upload_id}.bin").read_bytes()
        except OSError:
            raise UploadError("The uploaded file is gone. Ask for a new link with request_upload.") from None
    if hashlib.sha256(raw).hexdigest() != m["sha256"]:
        raise UploadError("The uploaded file changed on disk. Ask for a new link and send it again.")
    return raw, m


def mark_imported(upload_id: str, doc_id: str) -> None:
    """Free the bytes; keep the record a while so a second import says where the first one went."""
    with _locked():
        m = _read(upload_id)
        if m is None:
            return
        (_directory() / f"{upload_id}.bin").unlink(missing_ok=True)
        m.update(state="imported", doc_id=doc_id, imported_at=int(time.time()))
        _write(m)
