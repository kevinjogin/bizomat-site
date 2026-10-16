"""Immutable, version-labelled exports for MCP clients, with scoped expiring download links.

Downloads live under /mcp/artifacts so they do not need a browser login cookie. Each link grants
access to exactly one file for an hour, never access to the document or the MCP endpoint itself.
"""

from __future__ import annotations

import copy
import hashlib
import hmac
import json
import re
import tempfile
import threading
import time
import uuid
from pathlib import Path
from urllib.parse import urlencode

from . import assembly, auth, geometry, store

LIFETIME = 3600
MAX_ARTIFACT_BYTES = 128 * 1024 * 1024
MAX_STORED_BYTES = 512 * 1024 * 1024
MAX_ARTIFACTS = 128
FORMATS = {"osk": "application/json", "step": "model/step", "stl": "model/stl", "png": "image/png"}
_publish_lock = threading.Lock()


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


def validate_geometry(doc: dict) -> dict:
    """Do not silently export/preview the last good solid left by a failed feature or mate."""
    issues, warnings = [], []

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
            if built["solid"] is None:
                issues.append(f"Part {pid!r} has no solid body.")
        if not issues:
            result = assembly.regen_assembly(doc)
            statuses(result["mates"], "Mate ")
            statuses(result["components"], "Component ")
    else:
        st, _ = geometry.regen(doc)
        statuses(st.status, "Feature ")
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
    return hmac.new(auth.mcp_token().encode(), message.encode(), hashlib.sha256).hexdigest()


def _cleanup(directory: Path) -> None:
    # A grace period lets a just-authorized FileResponse finish reading before the file is removed.
    before = time.time() - 300
    for path in directory.glob("*.json"):
        if not re.fullmatch(r"[0-9a-f]{32}", path.stem):
            continue
        try:
            if json.loads(path.read_text())["expires_at"] < before:
                path.with_suffix(".bin").unlink(missing_ok=True)
                path.unlink(missing_ok=True)
        except (OSError, ValueError, KeyError, TypeError):
            continue


def publish(rec: dict, raw: bytes, fmt: str, name: str, part_id: str | None = None) -> dict:
    if fmt not in FORMATS or not raw:
        raise ArtifactError("Unsupported or empty artifact.")
    if len(raw) > MAX_ARTIFACT_BYTES:
        raise ArtifactError("The artifact exceeds the 128 MiB download limit.")
    with _publish_lock:
        return _publish(rec, raw, fmt, name, part_id)


def _publish(rec: dict, raw: bytes, fmt: str, name: str, part_id: str | None) -> dict:
    directory = _directory()
    _cleanup(directory)
    existing = list(directory.glob("*.bin"))
    if len(existing) >= MAX_ARTIFACTS or sum(p.stat().st_size for p in existing) + len(raw) > MAX_STORED_BYTES:
        raise ArtifactError("The download store is full. Retry after older links expire (at most 65 minutes).")
    artifact_id = uuid.uuid4().hex
    stem = re.sub(r"[^A-Za-z0-9_-]+", "_", name).strip("_")[:80] or "OpenSketch"
    filename = f"{stem}_v{rec['version']}.{fmt}"
    expires = int(time.time()) + LIFETIME
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
            json.dump(info, out)
    except Exception:
        payload.unlink(missing_ok=True)
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
    if expiry <= time.time() or not hmac.compare_digest(signature, _signature(artifact_id, filename, expiry)):
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


def preview_record(rec: dict, view: str, width: int, height: int, part_id: str | None = None) -> tuple[dict, bytes]:
    from .preview import render_preview
    doc = select_document(rec["doc"], part_id)
    report = validate_geometry(doc)
    raw = render_preview(doc, view=view, width=width, height=height)
    return (dict(publish(rec, raw, "png", doc.get("name") or rec["name"], part_id),
                 view=view, width=width, height=height, **report), raw)
