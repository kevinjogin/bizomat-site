"""Immutable, version-labelled exports for MCP clients, with scoped expiring download links.

Downloads live under /mcp/artifacts so they do not need a sign-in cookie. Each link grants
access to exactly one file for an hour (a preview PNG for ten minutes: the image itself comes back
in the tool's answer), never access to the document or the MCP endpoint itself.

Room is shared fairly: each person keeps at most PERSON_FILES files / PERSON_BYTES, and their own oldest
files make room for a new one; when the whole store is full, previews (anyone's, oldest first) go before
anything is refused. A preview is never refused for want of room: it comes back without a download link.
"""

from __future__ import annotations

import copy
import hashlib
import hmac
import json
import re
import tempfile
import time
import uuid
from pathlib import Path
from urllib.parse import urlencode

from . import assembly, auth, geometry, store

LIFETIME = 3600
PREVIEW_LIFETIME = 600
MAX_ARTIFACT_BYTES = 128 * 1024 * 1024
MAX_STORED_BYTES = 256 * 1024 * 1024   # the whole store (the Fly volume is 1 GB and holds the documents too)
MAX_ARTIFACTS = 128
PERSON_FILES = 32
PERSON_BYTES = 128 * 1024 * 1024
FORMATS = {"osk": "application/json", "step": "model/step", "stl": "model/stl", "png": "image/png",
           # files from SOLIDWORKS (sw_export): Parasolid, IGES, native files, PDF
           "x_t": "model/x-parasolid", "igs": "model/iges", "sldprt": "application/octet-stream",
           "sldasm": "application/octet-stream", "pdf": "application/pdf",
           # drawings (sw_create_drawing): the native file, and its sheets as AutoCAD DWG / DXF
           "slddrw": "application/octet-stream", "dwg": "image/vnd.dwg", "dxf": "image/vnd.dxf"}
_MISSING = object()


class ArtifactError(ValueError):
    pass


def select_document(doc: dict, part_id: str | None = None) -> dict:
    """Return a detached source snapshot. An assembly part keeps its own local coordinates."""
    if part_id is None:
        return copy.deepcopy(doc)
    if not assembly.is_assembly(doc):
        raise ArtifactError("part_id is only valid for an assembly document.")
    if not isinstance(part_id, str):
        raise ArtifactError("Invalid part_id.")
    part = (doc.get("parts") or {}).get(part_id)
    if part is None:
        raise ArtifactError(f"No part {part_id!r} in this assembly.")
    return copy.deepcopy(part)


def validate_geometry(doc: dict, export: bool = True) -> dict:
    """Do not silently export/preview the last good solid left by a failed feature or mate.

    A part left rolled back is not a failure: a preview shows it as it stands (with a warning), an
    export refuses and says which part to roll to the end."""
    issues, warnings = [], []
    if export and assembly.is_assembly(doc):
        problem = assembly.rollback_export_error(doc)
        if problem:
            raise ArtifactError(problem)

    def statuses(items, label):
        for s in items:
            message = f"{label}{s.get('id', '?')}: {s.get('message') or s.get('state')}"
            if s.get("state") == "error":
                issues.append(message)
            elif s.get("state") == "warning":
                warnings.append(message)

    if assembly.is_assembly(doc):
        active = [c for c in doc.get("components", []) if not c.get("suppressed")]
        if not active:
            raise ArtifactError("The assembly has no solid components.")
        parts = doc.get("parts") or {}
        for pid in {c.get("part") for c in active}:
            if pid not in parts:
                issues.append(f"Missing part {pid!r}.")
                continue
            built = assembly.build_part(parts[pid])
            statuses(built["status"], f"{pid}/")
            note = geometry.rollback_note(parts[pid], built["solid"] is not None)
            if note:
                warnings.append(f"{note} {assembly.ROLL_TO_END_HINT}")
            elif built["solid"] is None:
                issues.append(f"Part {pid!r} has no solid body.")
        if not issues:
            result = assembly.regen_assembly(doc)
            statuses(result["mates"], "Mate ")
            statuses(result["components"], "Component ")
    else:
        st = geometry.rebuilt(doc)  # shared with the export that follows (geometry.export)
        statuses(st.status, "Feature ")
        note = geometry.rollback_note(doc, st.part is not None)
        if note and st.part is None:
            raise ArtifactError(f"{note} Roll the part to the end (rollback bar below its last feature), then export again.")
        if note:
            warnings.append(note)
        if st.part is None:
            issues.append("No solid body.")
    if issues:
        raise ArtifactError("Cannot produce geometry with rebuild errors: " + "; ".join(issues))
    return {"clean": not warnings, "warnings": warnings}


def _directory() -> Path:
    path = store.data_dir() / "artifacts"
    path.mkdir(exist_ok=True)
    return path


def _signature(artifact_id: str, filename: str, expires: int) -> str:
    # Domain separation prevents a download signature from being used as any other credential.
    message = f"opensketch-artifact-v1\n{artifact_id}\n{filename}\n{expires}"
    # keyed by the random data-folder secret and the connector address: a new server password still revokes
    # every link, but a short password cannot be guessed offline from one
    key = hmac.new(auth.data_secret("artifact-download"), auth.mcp_token().encode(), hashlib.sha256).digest()
    return hmac.new(key, message.encode(), hashlib.sha256).hexdigest()


def _cleanup(directory: Path) -> None:
    # A grace period lets a just-authorized FileResponse finish reading before the file is removed.
    before = time.time() - 300
    for path in directory.glob("*.json"):
        if not re.fullmatch(r"[0-9a-f]{32}", path.stem):
            continue
        try:
            if json.loads(path.read_text())["expires_at"] < before:
                _drop(directory, path.stem)
        except (OSError, ValueError, KeyError, TypeError):
            continue


def _drop(directory: Path, artifact_id: str) -> None:
    (directory / f"{artifact_id}.bin").unlink(missing_ok=True)
    (directory / f"{artifact_id}.json").unlink(missing_ok=True)


def _items(directory: Path) -> list[dict]:
    """Stored artifacts, oldest first."""
    out = []
    for path in directory.glob("*.json"):
        if not re.fullmatch(r"[0-9a-f]{32}", path.stem):
            continue
        try:
            info = json.loads(path.read_text())
            size = (directory / f"{path.stem}.bin").stat().st_size
        except (OSError, ValueError):
            continue
        if isinstance(info, dict):
            out.append(dict(info, _size=size, _id=path.stem))
    return sorted(out, key=lambda i: i.get("created") or i.get("expires_at") or 0)


def _person() -> str | None:
    """Whose download this is when the caller did not say: the person whose connector is calling (MCP)."""
    try:
        from . import mcp_server
        return store.owner_of(mcp_server._who())
    except Exception:
        return None


def publish(rec: dict, raw: bytes, fmt: str, name: str, part_id: str | None = None, owner=_MISSING,
            lifetime: int = LIFETIME) -> dict:
    """Store a download for one hour (`lifetime`). owner: whose share of the store it counts against (default: the
    document's owner, else the person calling)."""
    if fmt not in FORMATS or not raw:
        raise ArtifactError("Unsupported or empty artifact.")
    if len(raw) > MAX_ARTIFACT_BYTES:
        raise ArtifactError("The artifact exceeds the 128 MiB download limit.")
    if owner is _MISSING:
        owner = rec["owner"] if "owner" in rec else _person()
    try:
        store.check_disk(len(raw), extra=store.RESERVE)  # downloads never take the last room documents need
    except store.DiskFull as exc:
        raise ArtifactError(str(exc)) from None
    with store.file_lock(_directory() / ".lock"):  # web server and CAD worker processes publish
        return _publish(rec, raw, fmt, name, part_id, owner, lifetime)


def _publish(rec: dict, raw: bytes, fmt: str, name: str, part_id: str | None, owner, lifetime: int) -> dict:
    directory = _directory()
    _cleanup(directory)
    items = _items(directory)
    mine = [i for i in items if i.get("owner") == owner]
    while mine and (len(mine) >= PERSON_FILES or sum(i["_size"] for i in mine) + len(raw) > PERSON_BYTES):
        old = mine.pop(0)  # this person's oldest download makes room for their new one
        _drop(directory, old["_id"])
        items.remove(old)
    full = lambda: len(items) >= MAX_ARTIFACTS or sum(i["_size"] for i in items) + len(raw) > MAX_STORED_BYTES
    for old in [i for i in items if i.get("format") == "png"]:
        if not full():
            break
        _drop(directory, old["_id"])  # previews (their image went back with the answer) before refusing
        items.remove(old)
    if full():
        raise ArtifactError("The download store is full. Retry after older links expire (at most 65 minutes).")
    artifact_id = uuid.uuid4().hex
    stem = re.sub(r"[^A-Za-z0-9_-]+", "_", name).strip("_")[:80] or "export"
    filename = f"{stem}_v{rec['version']}.{fmt}"
    now = time.time()
    expires = int(now) + int(lifetime)
    info = {"artifact_id": artifact_id, "doc_id": rec["id"], "version": rec["version"],
            "filename": filename, "format": fmt, "media_type": FORMATS[fmt], "size_bytes": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest(), "expires_at": expires}
    if part_id is not None:
        info["part_id"] = part_id
    payload = directory / f"{artifact_id}.bin"
    try:
        with payload.open("xb") as out:
            out.write(raw)
        with (directory / f"{artifact_id}.json").open("x") as out:
            json.dump(dict(info, owner=owner, created=now), out)
    except Exception:
        payload.unlink(missing_ok=True)
        (directory / f"{artifact_id}.json").unlink(missing_ok=True)
        raise
    query = urlencode({"expires": expires, "signature": _signature(artifact_id, filename, expires)})
    return dict(info, download_url=f"{auth.public_url()}/mcp/artifacts/{artifact_id}/{filename}?{query}")


def resolve(artifact_id: str, filename: str, expires: str, signature: str) -> tuple[Path, dict]:
    """Resolve only a signed, unexpired, exact artifact path; callers return 404 for every failure."""
    if (not re.fullmatch(r"[0-9a-f]{32}", artifact_id)
            or not re.fullmatch(r"[A-Za-z0-9_.-]{1,128}", filename)
            or not re.fullmatch(r"[0-9a-f]{64}", signature)):
        raise ArtifactError("No such artifact.")
    try:
        expiry = int(expires)
    except (TypeError, ValueError):
        raise ArtifactError("No such artifact.") from None
    if expiry <= time.time() or not hmac.compare_digest(str(signature).encode(), _signature(artifact_id, filename, expiry).encode()):
        raise ArtifactError("No such artifact.")
    path = _directory() / f"{artifact_id}.bin"
    try:
        info = json.loads(path.with_suffix(".json").read_text())
        if info["filename"] != filename or info["expires_at"] != expiry or not path.is_file():
            raise ArtifactError("No such artifact.")
    except (OSError, ValueError, KeyError):
        raise ArtifactError("No such artifact.") from None
    return path, info


def export_record(rec: dict, fmt: str, part_id: str | None = None) -> dict:
    if fmt not in ("osk", "step", "stl"):
        raise ArtifactError("Use osk, step or stl.")
    doc = select_document(rec["doc"], part_id)
    report = {}
    if fmt == "osk":
        # Native source backups remain available even when the feature tree needs repair.
        raw = json.dumps(doc, indent=2).encode()
    else:
        report = validate_geometry(doc)
        with tempfile.TemporaryDirectory(prefix="opensketch-export-") as tmp:
            path = Path(tmp) / f"model.{fmt}"
            if assembly.is_assembly(doc):
                assembly.export(doc, fmt, str(path))
            else:
                geometry.export(doc, fmt, str(path))
            raw = path.read_bytes()
    return dict(publish(rec, raw, fmt, doc.get("name") or rec["name"], part_id), **report)


def preview_record(rec: dict, view: str, width: int, height: int, part_id: str | None = None,
                   camera: dict | None = None, section: dict | None = None) -> tuple[dict, bytes]:
    from .preview import render_preview
    doc = select_document(rec["doc"], part_id)
    report = validate_geometry(doc, export=False)
    cam ={k: v for k, v in (camera or {}).items() if k in ("yaw", "pitch", "target", "view_width") and v is not None}
    raw = render_preview(doc, view=view, width=width, height=height, section=section, **cam)
    extra = {"camera": cam} if cam else {}
    if section:
        extra["section"] = section
    try:
        link = publish(rec, raw, "png", doc.get("name") or rec["name"], part_id, lifetime=PREVIEW_LIFETIME)
    except ArtifactError as exc:  # the image still goes back with the answer; only the link is missing
        link = {"doc_id": rec["id"], "version": rec["version"], "format": "png", "size_bytes": len(raw),
                "download_url": None, "note": f"No download link this time: {exc}"}
    return (dict(link, view=view, width=width, height=height, **extra, **report), raw)
