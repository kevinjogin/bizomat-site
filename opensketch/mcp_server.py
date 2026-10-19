"""OpenSketch as an MCP server: Claude (in the Claude app, Claude Code, ...) builds parts and
assemblies in OpenSketch documents, and the user watches them change live in the browser.

Endpoint: /mcp/<token> (Streamable HTTP, stateless, JSON responses), so a server restart after an update
does not break Claude's connection. The token is the key (see auth.py); the app's Connect AI
dialog shows the full address.

The modelling tools are the built-in AI's tools (ai.Session), run against a stored document
(store.py) instead of a chat proposal: every change is saved as a new version at once, the browser
follows it, and undo_last_change / restore_version go back.
"""

from __future__ import annotations

import base64
import binascii
import contextvars
import json
import re
import inspect
from pathlib import Path
from typing import Annotated, Any, Literal

import anyio
from mcp.server.mcpserver import MCPServer
from mcp.server.streamable_http_manager import StreamableHTTPASGIApp
from mcp.server.transport_security import TransportSecuritySettings
from mcp.types import CallToolResult, ImageContent, TextContent, ToolAnnotations

from pydantic import Field

from . import ai, artifacts, assembly, auth, features, geometry, importer, inspection, measure, store, uploads

INSTRUCTIONS = """OpenSketch is a parametric CAD app that works like SOLIDWORKS. You build real feature trees
(sketches with relations and dimensions, extrudes, revolves, fillets...) and assemblies with mates, in
documents the user has open in their browser: every change you make appears there within a second or two.
Call get_modelling_guide once before your first change: it has the document format, the assembly workflow
and the rules (off-the-shelf parts first). Then: list_documents or create_document, get_document to read
one, and the modelling tools, which all take doc_id (add_<feature> tools such as add_draft or add_fillet add
one feature; propose_features writes many at once). Every change is saved immediately (undo_last_change
goes back). For more than two changes use batch: the steps run as one change and nothing is saved if a step fails.
Pick edges and faces with body_topology (pass their `ref`), and check results with inspect_design. Work in the background by default: no browser is needed to model, import, inspect a PNG
preview, or export CAD. Use import_document for source files (for anything over about 100 KB, get a link
with request_upload, PUT the file to it, then import_document with the upload_id instead of base64 data),
preview_document for visual review and export_document for .osk, STEP and STL downloads. Open the app only
when the user asks or would benefit from interactive inspection. After building, give the user the
document's link from the tool result."""

MCP_PREFACE = """You are working in OpenSketch through MCP tools. Differences from the in-app copilot described
below: every tool takes a doc_id; there is no Accept/Reject step, each change is saved at once as a new
version (undo_last_change, list_versions, restore_version go back); the user sees the model update live in
their browser. Write one short line before each change as usual. Use your own web search if you have it
for real part sizes and standards. Modelling, imports, previews and exports run on the server without
opening a browser. Default to background work, use preview_document for visual inspection, and use
export_document for downloads (optional part_id exports one assembly part in its local coordinates).
To import a file bigger than about 100 KB, do not write it out as base64: call request_upload, send the
file with an HTTP PUT to upload_url (curl -sS -T file.step '<upload_url>'), then import_document(upload_id=...).
Download URLs are read-only, artifact-specific links valid for one hour; they never contain the MCP
credential. Fetch them before expiry or call the tool again. Native .osk exports preserve the source
even if it needs repair; STEP/STL/PNG are refused when active geometry or mates fail to rebuild.
When done, give the user the "open" link from the last tool result and any requested download links.

Predict, then measure:
- Before each stage, work out the volume and bounding box you expect (a box minus its holes is simple
  arithmetic). After it, compare with the batch result or inspect_design. A difference means a wrong plane,
  direction or depth: fix it now, not three features later.
- Build in stages with batch (one to four features each), not one call per feature and not the whole part
  at once. A failed batch saves nothing; read `failed`, fix that step, send the batch again.
- A cut with volume_change_mm3 = 0 missed the body. A boss that adds nothing is buried inside it.
- Fillets, chamfers, shells and drafts: call body_topology (near the spot) and pass the `ref` of the edges or
  faces you want. Do not guess midpoints. Refs carry persistent names (e1:end|e1:side:s1L1), so picks
  stay put when the part changes size. face_angle_deg 0 means already smooth; never fillet a seam edge.
- Use measure_items for hole sizes, spacing, walls and gaps; preview_document with yaw/pitch and a section
  to look inside. Set global variables (set_parameter) for the numbers a designer would change.
- Delete with delete_items dry_run first.
- Fillet last: after holes, ribs and shells, small radii first.

"""

MateType = Literal["coincident", "concentric", "parallel", "perpendicular", "distance", "angle", "lock",
                   "hinge", "limit_distance", "limit_angle", "coupler"]
StdKind = Literal["socket_head_cap_screw", "hex_head_screw", "counter_sunk_screw", "button_head_screw",
                  "set_screw", "hex_nut", "plain_washer", "ball_bearing"]

mcp = MCPServer(name="OpenSketch", instructions=INSTRUCTIONS)

# The person whose connector address made this request (auth.resolve_mcp): set by _TokenGate for the
# request and copied into the tool's task and worker threads. None = a server without accounts.
_mcp_user: contextvars.ContextVar = contextvars.ContextVar("opensketch_mcp_user", default=None)


def _who() -> dict | None:
    return _mcp_user.get()


def _get(doc_id: str) -> dict:
    """A document this connector may use (its person's Files), else NotFound."""
    rec = store.get(doc_id)
    if rec.get("deleted") or not store.can_see(rec, _who()):
        raise store.NotFound(doc_id)
    return rec


def _check(doc_id: str) -> None:
    m = store.meta(doc_id)
    if m.get("deleted") or not store.can_see(m, _who()):
        raise store.NotFound(doc_id)


def _link(doc_id: str) -> str:
    return f"{auth.public_url()}/?doc={doc_id}"


def _result(rec: dict, report: Any = None, clean: bool | None = None, changed: bool = True) -> str:
    out = {"doc_id": rec["id"], "name": rec["name"], "version": rec["version"], "open": _link(rec["id"])}
    if clean is not None:
        out["clean"] = clean
    if not changed:
        out["note"] = "Nothing changed."
    if report is not None:
        try:
            out["report"] = json.loads(report) if isinstance(report, str) else report
        except ValueError:
            out["report"] = report
    return json.dumps(out)


def _save_session(rec: dict, sess: "ai.Session", summary: str) -> tuple[dict, bool]:
    """Save the session's work as one new version (if anything changed). Returns (record, changed)."""
    if assembly.is_assembly(sess.work) and not assembly.is_assembly(rec["doc"]):
        sess.work["name"] = rec["name"]  # the document keeps its name when it becomes an assembly
    reqs = list(rec.get("requests") or [])
    for r in getattr(sess, "requests", []):
        item = {k: r.get(k) for k in ("part", "description", "mcmaster", "url")}
        reqs = [q for q in reqs if q.get("part") != item["part"]] + [item]
    changed = sess.work != rec["doc"] or reqs != (rec.get("requests") or [])
    if changed:
        rec = store.save(rec["id"], sess.work, "claude", summary, requests=reqs)
    return rec, changed


def _apply_sync(doc_id: str, tool: str, inp: dict) -> str:
    with store.lock(doc_id):
        rec = _get(doc_id)
        sess = ai.Session(rec["doc"])
        report, clean, _ = sess.apply(tool, {k: v for k, v in inp.items() if v is not None})
        rec, changed = _save_session(rec, sess, sess.summary or tool.replace("_", " ").capitalize())
        return _result(rec, report, clean, changed)


async def _apply(doc_id: str, tool: str, **inp) -> str:
    try:
        return await anyio.to_thread.run_sync(_apply_sync, doc_id, tool, inp)
    except store.NotFound:
        return f"No document {doc_id!r}. Use list_documents or create_document."


# ----------------------------------------------------------------------------- documents

SKILL_DIR = Path(__file__).resolve().parent.parent / "skills" / "opensketch-cad"


def _skill_reference() -> str:
    """The opensketch-cad skill's reference (planes, argument shapes, errors and fixes, red flags), so a
    connector without the skill installed gets the same guidance."""
    try:
        return "\n\n" + (SKILL_DIR / "reference.md").read_text()
    except OSError:
        return ""


@mcp.tool()
def get_modelling_guide() -> str:
    """The OpenSketch document format, feature types, assembly workflow, design rules, plane tables, errors
    and their fixes. Read it once before your first change."""
    return MCP_PREFACE + ai.SYSTEM + _skill_reference()


@mcp.tool()
def list_documents() -> str:
    """Documents on this OpenSketch server, newest first (id, name, part or assembly, version, last change)."""
    keys = ("id", "name", "kind", "version", "updated", "by", "summary")
    return json.dumps([dict({k: r.get(k) for k in keys}, open=_link(r["id"])) for r in store.listing(store.visible_to(_who()))])


@mcp.tool()
def create_document(name: str, kind: Literal["part", "assembly"] = "part") -> str:
    """Create an empty part or assembly document. A part document becomes an assembly by itself when you
    call create_part on it, so start with "part" unless the product clearly has several pieces."""
    rec = store.create(name, kind=kind, by="claude", owner=store.owner_of(_who()))
    return _result(rec)


def _read_sync(doc_id: str) -> str:
    rec = _get(doc_id)
    doc = rec["doc"]
    out: dict = {"doc_id": doc_id, "name": rec["name"], "version": rec["version"], "open": _link(doc_id),
                 "last_change": {"by": rec.get("by"), "summary": rec.get("summary")},
                 "document": ai.model_view(doc)}
    try:
        if assembly.is_assembly(doc):
            res = assembly.regen_assembly(doc)
            out["state"] = ai._asm_report(doc, res)
        elif doc.get("features"):
            st, _ = geometry.regen(doc)
            out["state"], _ = ai._part_report(st)
    except Exception as exc:  # report, don't fail: Claude can fix the document
        out["state"] = {"error": f"Rebuild failed: {exc}"}
    if rec.get("requests"):
        out["bought_parts_requested"] = rec["requests"]
    return json.dumps(out)


@mcp.tool()
async def get_document(doc_id: str) -> str:
    """Read a document: its features or parts, components and mates (imported geometry summarised), and
    the rebuild state (feature errors, mate states, degrees of freedom). Read it before editing a
    document the user has been working on: they may have changed it by hand."""
    try:
        return await anyio.to_thread.run_sync(_read_sync, doc_id)
    except store.NotFound:
        return f"No document {doc_id!r}."


# These are MCP file operations, not tools offered to the in-app ai.Session. Export and preview do
# not change the document, so they have no Session/live.js build events. Import creates a new stored
# document and the browser can follow its returned open link, just like create_document.
MAX_IMPORT_BYTES = 32 * 1024 * 1024


def _native_structure(doc: dict) -> None:
    """Check the containers read by the UI/model_view, not feature validity or rebuild success.

    Missing sketch references, unsupported feature types and other repairable modelling errors
    remain importable. A null feature or a scalar part is not a document that those readers can use.
    """
    def object_list(value, label, fields=()):
        if not isinstance(value, list):
            raise ValueError(f"{label} must be a list.")
        seen = set()
        for item in value:
            if not isinstance(item, dict):
                raise ValueError(f"Every {label} entry must be an object.")
            for field in fields:
                if not isinstance(item.get(field), str) or not item[field]:
                    raise ValueError(f"Every {label} entry needs a non-empty string {field}.")
            if "id" in fields:
                if item["id"] in seen:
                    raise ValueError(f"{label} IDs must be unique.")
                seen.add(item["id"])
        return value

    def metadata(item, label):
        for field in ("name", "units", "appearance"):
            if field in item and not isinstance(item[field], str):
                raise ValueError(f"{label} {field} must be a string.")
        for field in ("material", "pcb"):
            if field in item and not isinstance(item[field], dict):
                raise ValueError(f"{label} {field} must be an object.")

    def part(item, label):
        if not isinstance(item, dict) or item.get("type", "part") != "part":
            raise ValueError(f"{label} must be a part document.")
        metadata(item, label)
        for feature in object_list(item.get("features"), f"{label} features", ("id", "type")):
            if feature["type"] == "import" and "data" in feature and not isinstance(feature["data"], str):
                raise ValueError("Imported feature data must be a base64 string.")
            if feature["type"] == "sketch":
                if "entities" in feature:
                    object_list(feature["entities"], "sketch entities", ("id", "type"))
                if "constraints" in feature:
                    object_list(feature["constraints"], "sketch constraints", ("type",))

    if not isinstance(doc, dict) or doc.get("type", "part") not in ("part", "assembly"):
        raise ValueError("The file must contain an OpenSketch part or assembly document.")
    if not assembly.is_assembly(doc):
        part(doc, "Part")
        return
    metadata(doc, "Assembly")
    if not isinstance(doc.get("parts"), dict):
        raise ValueError("Assembly parts must be an object.")
    for key, value in doc["parts"].items():
        part(value, f"Part {key!r}")
    object_list(doc.get("components"), "assembly components", ("id", "part"))
    for mate in object_list(doc.get("mates", []), "assembly mates", ("id", "type")):
        for field in ("refs", "planes", "angle_refs", "input_refs"):
            if field in mate:
                object_list(mate[field], f"mate {field}")
    if "sequence" in doc and (not isinstance(doc["sequence"], list)
                              or not all(isinstance(item, str) for item in doc["sequence"])):
        raise ValueError("Assembly sequence must be a list of component IDs.")


def _check_filename(filename: str | None) -> str:
    if not isinstance(filename, str) or not re.fullmatch(r"[^/\\\x00-\x1f]{1,255}", filename) or filename in (".", ".."):
        raise ValueError("Use a filename without directory components.")
    return filename


def _import_raw(raw: bytes, filename: str, name: str | None, report: dict) -> tuple[dict, dict]:
    if not raw or len(raw) > MAX_IMPORT_BYTES:
        raise ValueError("Import requires a non-empty file of at most 32 MiB.")
    if filename.lower().endswith((".osk", ".json")):
        try:
            doc = json.loads(raw)
        except ValueError:
            raise ValueError("The .osk file is not valid JSON.") from None
        _native_structure(doc)
    else:
        doc = importer.import_file(raw, filename)
    rec = store.create(name or doc.get("name") or filename.rsplit(".", 1)[0], doc=doc, by="claude", owner=store.owner_of(_who()))
    return rec, dict({"source_filename": filename, "size_bytes": len(raw)}, **report)


def _import_sync(filename: str | None, data: str | None, name: str | None, upload_id: str | None = None) -> str:
    if upload_id and data == "":
        data = None  # a client still holding the old tool list (data required) sends data "" with the upload_id
    if (data is None) == (upload_id is None):
        raise ValueError("Give either data (base64 file bytes) or upload_id (from request_upload), not both.")
    if upload_id is not None:
        raw, meta = uploads.take(upload_id, _who())
        filename = _check_filename(filename or meta["filename"])
        rec, report = _import_raw(raw, filename, name, {"upload_id": upload_id, "sha256": meta["sha256"]})
        uploads.mark_imported(upload_id, rec["id"])
        return _result(rec, report=report)
    filename = _check_filename(filename)
    if len(data) > 4 * ((MAX_IMPORT_BYTES + 2) // 3):
        raise ValueError("Import is limited to 32 MiB before base64 encoding. Use request_upload for big files.")
    try:
        raw = base64.b64decode(data, validate=True)
    except (ValueError, binascii.Error):
        raise ValueError("data must be valid base64 file content.") from None
    rec, report = _import_raw(raw, filename, name, {})
    return _result(rec, report=report)


@mcp.tool()
async def import_document(filename: Annotated[str | None, Field(description="e.g. bracket.step; picks the reader. Optional with upload_id (the name given to request_upload)")] = None,
                          data: Annotated[str | None, Field(description="Base64 file bytes. Only for small files (under ~100 KB); otherwise use upload_id")] = None,
                          name: str | None = None,
                          upload_id: Annotated[str | None, Field(description="From request_upload, after the file was sent to its upload_url")] = None) -> str:
    """Import a source file as a NEW stored document; never overwrites existing work. Give the file either as
    data (base64, small files only) or as upload_id: call request_upload, send the file's bytes to its
    upload_url with an HTTP PUT (curl -T file.step '<upload_url>'), then pass the upload_id here. At most
    32 MiB either way. Supports .osk/.json, STEP/.stp, EAGLE XML .brd, or a zip with one supported CAD file.
    EAGLE supplies PCB geometry, not populated component solids. Runs in background."""
    try:
        return await anyio.to_thread.run_sync(_import_sync, filename, data, name, upload_id)
    except (ValueError, importer.ImportError_) as exc:
        return json.dumps({"error": f"Cannot import: {exc}"})


@mcp.tool()
def request_upload(filename: Annotated[str, Field(description="The file's name, e.g. assembly.step or model.zip")],
                   size_bytes: Annotated[int | None, Field(description="Optional: the file size, to refuse a too-big file before sending it")] = None) -> str:
    """Get a one-time link to send a file to OpenSketch, for import_document(upload_id=...). Use it for any
    file bigger than about 100 KB instead of base64 data. Send the file's raw bytes as the body of an HTTP
    PUT (or POST) to upload_url, e.g. curl -sS -T model.step '<upload_url>'; a gzipped body works with the
    header Content-Encoding: gzip. The link is for this connector's account only, takes one upload, expires
    after 10 minutes, and carries no other access; the file waits 30 minutes for import_document. Max 32 MiB."""
    try:
        out = uploads.create(_who(), filename, MAX_IMPORT_BYTES, size_bytes)
    except uploads.UploadError as exc:
        return json.dumps({"error": f"Cannot make an upload link: {exc}"})
    out["how"] = f"curl -sS -T {_shell_quote(filename)} '{out['upload_url']}'"
    out["next"] = f'import_document(upload_id="{out["upload_id"]}", name=...)'
    return json.dumps(out)


def _shell_quote(s: str) -> str:
    return "'" + s.replace("'", "'\\''") + "'"


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def export_document(doc_id: str, format: Literal["osk", "step", "stl"], part_id: str | None = None) -> str:
    """Export a saved document without a browser or changing its version. Returns an immutable file,
    source version, SHA-256 and a read-only download_url valid for one hour. Optional part_id exports
    an assembly part in LOCAL coordinates. STEP/STL refuse failed rebuilds; .osk preserves source."""
    try:
        rec = _get(doc_id)
        result = await anyio.to_thread.run_sync(artifacts.export_record, rec, format, part_id)
        return json.dumps(dict(result, open=_link(doc_id)))
    except (store.NotFound, artifacts.ArtifactError, geometry.FeatureError, assembly.AssemblyError) as exc:
        return json.dumps({"error": f"Cannot export: {exc}"})


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def preview_document(doc_id: str, view: Literal["isometric", "top", "front", "right"] = "isometric",
                           width: int = 960, height: int = 720, part_id: str | None = None,
                           yaw: Annotated[float | None, Field(description="Degrees about +Y from the front (+Z) toward the right (+X); with pitch, replaces view")] = None,
                           pitch: Annotated[float | None, Field(description="Degrees the eye is above the XZ plane (-90..90; 90 = top)")] = None,
                           target: Annotated[list[float] | None, Field(description="[x,y,z] mm to centre on (close-ups)")] = None,
                           view_width: Annotated[float | None, Field(description="Width shown, in mm (zoom); default fits the model")] = None,
                           section: Annotated[dict | None, Field(description='{"point": [x,y,z], "normal": [x,y,z]}: cut the model and remove the normal\'s side; cut faces are orange')] = None
                           ) -> CallToolResult:
    """Render a PNG of saved geometry without a browser. Returns the image directly for inspection,
    plus an immutable PNG download_url valid for one hour. Views: isometric, top, front, right, or any
    direction with yaw/pitch (yaw 0 pitch 0 = front, yaw 90 = right, pitch 90 = top, yaw 45 pitch 35 =
    isometric). target + view_width give a close-up (e.g. view_width 20 around a boss). section cuts the
    model to look inside (wall thickness, a bore, a snap fit). Dimensions 128..1600 pixels. Optional
    part_id previews an assembly part in local coordinates. No document edits."""
    try:
        if not 128 <= width <= 1600 or not 128 <= height <= 1600:
            raise artifacts.ArtifactError("Preview dimensions must be between 128 and 1600 pixels.")
        rec = _get(doc_id)
        camera = {"yaw": yaw, "pitch": pitch, "target": target, "view_width": view_width}
        result, raw = await anyio.to_thread.run_sync(artifacts.preview_record, rec, view, width, height, part_id,
                                                     camera, section)
        result["open"] = _link(doc_id)
        return CallToolResult(content=[TextContent(type="text", text=json.dumps(result)),
                                       ImageContent(type="image", data=base64.b64encode(raw).decode(), mime_type="image/png")],
                              structured_content=result)
    except (store.NotFound, ValueError, geometry.FeatureError, assembly.AssemblyError) as exc:
        return CallToolResult(content=[TextContent(type="text", text=json.dumps({"error": f"Cannot preview: {exc}"}))],
                              is_error=True)


@mcp.tool()
def undo_last_change(doc_id: str) -> str:
    """Undo the latest change to the document (whoever made it). Calling it again redoes it; to go back
    further use list_versions and restore_version."""
    try:
        _check(doc_id)
        return _result(store.undo(doc_id, "claude"))
    except store.NotFound as exc:
        return f"Cannot undo: {exc}"


@mcp.tool()
def list_versions(doc_id: str) -> str:
    """Earlier versions of a document still kept (the last 50), newest first."""
    try:
        _check(doc_id)
        return json.dumps(store.versions(doc_id))
    except store.NotFound:
        return f"No document {doc_id!r}."


@mcp.tool()
def restore_version(doc_id: str, version: int) -> str:
    """Bring back an earlier version of the document (saved as a new version, so nothing is lost)."""
    try:
        _check(doc_id)
        return _result(store.restore(doc_id, version, "claude"))
    except store.NotFound as exc:
        return f"Cannot restore: {exc}"


# ----------------------------------------------------------------------------- modelling (ai.Session tools)

@mcp.tool()
async def propose_features(doc_id: str, mode: Literal["append", "replace"], summary: str, features: list[dict]) -> str:
    """Write features into a part document ("append" adds to the tree, "replace" rewrites it). The part is
    rebuilt and the status of each feature, the bounding box and the volume come back. Part documents
    only; for assemblies use create_part."""
    return await _apply(doc_id, "propose_features", mode=mode, summary=summary, features=features)


@mcp.tool()
async def create_part(doc_id: str, part_id: str, name: str, features: list[dict], material: str | None = None,
                      appearance: str | None = None) -> str:
    """Create a part in an assembly (or replace the part with the same part_id). A part document becomes an
    assembly. Returns rebuild status, bounding box, and the part's planar faces and cylinder axes to mate
    to. material e.g. "6061 Alloy", "AISI 304", "ABS"; appearance a hex colour."""
    return await _apply(doc_id, "create_part", part_id=part_id, name=name, features=features, material=material,
                        appearance=appearance)


@mcp.tool()
async def insert_component(doc_id: str, component_id: str, part: str, position: list[float] | None = None,
                           rotation: list[float] | None = None, fixed: bool | None = None) -> str:
    """Insert a part as a component (or update the component with this id). position [x,y,z] mm and
    rotation [rx,ry,rz] degrees are a starting guess; mates finish the placement. The first component is
    fixed. Returns the solved assembly."""
    return await _apply(doc_id, "insert_component", component_id=component_id, part=part, position=position,
                        rotation=rotation, fixed=fixed)


@mcp.tool()
async def add_mate(doc_id: str, type: MateType, refs: list[dict], value: float | None = None,
                   align: Literal["anti", "aligned", "auto"] | None = None, flip: bool | None = None,
                   planes: list[dict] | None = None, angle_refs: list[dict] | None = None,
                   angle_min: float | None = None, angle_max: float | None = None,
                   min: float | None = None, max: float | None = None,
                   input_refs: list[dict] | None = None, input: Literal["angle", "distance"] | None = None,
                   output: Literal["angle", "distance"] | None = None, law: list[list[float]] | None = None,
                   ratio: float | None = None, offset: float | None = None, name: str | None = None) -> str:
    """Add a mate between two components and re-solve. refs: two references in each component's part
    coordinates, e.g. {"component": "c1", "plane": {"point": [x,y,z], "normal": [x,y,z]}}, {"component":
    "c2", "axis": {"point": [...], "dir": [...]}}, or {"component": "c1", "ref": "Top Plane"}. value: mm or
    degrees for distance / angle. hinge: refs = two axes, planes = two faces that stay together,
    angle_refs + angle_min / angle_max = travel limits. limit_distance / limit_angle: refs + min / max.
    coupler (one part drives another): input_refs + input = the driver's angle or distance, refs + output =
    the driven one, law = [[driver, driven], ...] (driver increasing; flat = dwell) or ratio + offset."""
    return await _apply(doc_id, "add_mate", type=type, refs=refs, value=value, align=align, flip=flip, planes=planes,
                        angle_refs=angle_refs, angle_min=angle_min, angle_max=angle_max, min=min, max=max,
                        input_refs=input_refs, input=input, output=output, law=law, ratio=ratio, offset=offset, name=name)


@mcp.tool()
async def add_contact(doc_id: str, a: str | None = None, b: str | None = None, joint: str | None = None,
                      from_value: float | None = None, to_value: float | None = None, name: str | None = None,
                      remove: str | None = None) -> str:
    """Declare that components a and b must touch (a pin on a tongue, a cam on its follower). The review
    checks it through joint's travel (a hinge or limit mate id) between from_value and to_value (that
    joint's units), or at rest without a joint. remove: delete that contact id."""
    return await _apply(doc_id, "add_contact", a=a, b=b, joint=joint, name=name, remove=remove,
                        **{"from": from_value, "to": to_value})


@mcp.tool()
async def delete_items(doc_id: str, components: list[str] | None = None, mates: list[str] | None = None,
                       parts: list[str] | None = None, features: list[str] | None = None, part_id: str | None = None,
                       delete_absorbed: bool | None = None, dry_run: bool | None = None) -> str:
    """Delete components, mates or parts from an assembly (mates on deleted components go too), or features
    from a part (part_id in an assembly). Features take their dependants with them, as in SOLIDWORKS: an
    extrude whose sketch goes, a pattern left with nothing to copy, and sketches only they used (unless
    delete_absorbed is false). Features that would break (a sketch on a deleted plane, a fillet whose edge
    is gone) stay and show the error. dry_run=true reports deleted_with_it, absorbed, patterns_trimmed,
    would_fail and would_warn (assemblies: mates that would fail) and deletes nothing. Dry-run first."""
    return await _apply(doc_id, "delete_items", components=components, mates=mates, parts=parts, features=features,
                        part_id=part_id, delete_absorbed=delete_absorbed, dry_run=dry_run)


@mcp.tool()
async def set_parameter(doc_id: str, name: str, expression: str | None = None, unit: str | None = None,
                        comment: str | None = None, part_id: str | None = None, remove: bool | None = None,
                        force: bool | None = None) -> str:
    """Create, change or remove a global variable of a part (SOLIDWORKS Equations > Global Variables).
    expression: a number or an equation using other variables ("2", "wall * 2", "length / 2 - 6", "1in";
    units mm cm m in deg rad; functions abs min max sqrt round floor ceil sin cos tan in degrees). Every
    equation using it is recomputed (sketches re-solved) and the part rebuilt. The result has the variables
    with values and where each is used, `recomputed` (field, old, new) and `now_failing`. Put the sensible
    range in comment. Use variables for the few numbers a designer would change (wall, length, hole size)."""
    return await _apply(doc_id, "set_parameter", name=name, expression=expression, unit=unit, comment=comment,
                        part_id=part_id, remove=remove, force=force)


@mcp.tool()
async def set_equation(doc_id: str, feature: str, field: str, expression: str | None = None,
                       part_id: str | None = None) -> str:
    """Drive one number with an equation of global variables: a feature field by name ("depth", "radius",
    "count", "spacing", "dir2.depth") or a sketch dimension by its id or name ("D1"). Empty expression
    removes the equation and keeps the current value. Equations can also be written directly in features:
    "eq": {"depth": "wall * 5"} on a feature, "eq": "width" on a sketch dimension."""
    return await _apply(doc_id, "set_equation", feature=feature, field=field, expression=expression, part_id=part_id)


@mcp.tool()
async def check_interference(doc_id: str) -> str:
    """Check every pair of components in the assembly for overlapping volume."""
    return await _apply(doc_id, "check_interference")


@mcp.tool()
async def find_mate_candidates(doc_id: str) -> str:
    """Likely mates from the assembly's geometry (shafts in holes, faces lying on each other), with
    references ready for add_mate. Useful after a STEP import, which has no mates."""
    return await _apply(doc_id, "find_mate_candidates")


@mcp.tool()
async def standard_part(doc_id: str, part_id: str, kind: StdKind, size: str, length: float | None = None) -> str:
    """Create a standard (Toolbox) part made to size: ISO screws, nuts, washers, ball bearings. size e.g.
    "M6-1" for screws, nuts and washers, "M8-22-7" (bore-OD-width) for bearings; length in mm for screws.
    Then insert_component it. Prefer these over modelling fasteners."""
    return await _apply(doc_id, "standard_part", part_id=part_id, kind=kind, size=size, length=length)


@mcp.tool()
async def request_part_file(doc_id: str, part_id: str, description: str, mcmaster_part_number: str | None = None,
                            url: str | None = None) -> str:
    """Ask the user to download a bought part's STEP (McMaster-Carr or another supplier) and drop it into
    OpenSketch, where it replaces the placeholder part with this part_id. Also create that placeholder with
    create_part (the right envelope) so the assembly can go on."""
    return await _apply(doc_id, "request_part_file", part_id=part_id, description=description,
                        mcmaster_part_number=mcmaster_part_number, url=url)


# ----------------------------------------------------------------------------- batch, topology, inspect
# Borrowed from SolidCraft (bherbruck/solidcraft): a batch that rolls back as a whole, a topology
# readout that names edges and faces by points, and a numeric inspect.

BATCH_TOOLS = ("propose_features", "create_part", "insert_component", "add_mate", "delete_items", "standard_part",
               "request_part_file", "check_interference", "find_mate_candidates", "set_parameter", "set_equation",
               "add_contact")
MAX_BATCH_STEPS = 100


def _batch_tool_ok(name: str) -> bool:
    return name in BATCH_TOOLS or features.type_for_tool(name) is not None


def _problem_keys(rep: Any, kind: str) -> set[str]:
    """Identity of each error (kind="errors") or warning in a report, without its message text, so a known
    problem whose wording changes is not counted as new."""
    if not isinstance(rep, dict):
        return set()
    keys = set()
    for e in rep.get(kind) or []:
        ident = {k: e.get(k) for k in ("part", "id", "mate", "component", "code") if e.get(k) is not None}
        keys.add(json.dumps(ident or e, sort_keys=True, default=str))
    return keys


def _baseline(doc: dict) -> dict:
    try:
        if assembly.is_assembly(doc):
            return ai._asm_report(doc, assembly.regen_assembly(doc))
        if doc.get("features"):
            return ai._part_report(geometry.regen(doc)[0])[0]
    except Exception:
        pass
    return {}


def _compact(rep: Any) -> Any:
    """The parts of a step report worth seeing in a batch result (the last step gets the full report)."""
    if not isinstance(rep, dict):
        return rep
    keep = ("rebuilt", "clean", "errors", "warnings", "input_problems", "feature", "part_id", "volume", "bbox_min",
            "bbox_max", "this_mate", "interferences")
    out = {k: rep[k] for k in keep if k in rep}
    if "errors" in out:  # status rows carry diagnostics; the id and message are enough here
        out["errors"] = [{k: e[k] for k in ("part", "id", "mate", "component", "message") if k in e} for e in out["errors"]]
    return out


def _batch_sync(doc_id: str, steps: list[dict], summary: str, stop_on_warnings: bool, dry_run: bool) -> CallToolResult:
    def reply(body: dict, error: bool) -> CallToolResult:
        return CallToolResult(content=[TextContent(type="text", text=json.dumps(body))], is_error=error)

    if not steps:
        return reply({"ok": False, "error": "steps is empty."}, True)
    if len(steps) > MAX_BATCH_STEPS:
        return reply({"ok": False, "error": f"At most {MAX_BATCH_STEPS} steps per batch."}, True)
    for i, s in enumerate(steps):
        name = s.get("tool") if isinstance(s, dict) else None
        if not isinstance(name, str) or not _batch_tool_ok(name):
            return reply({"ok": False, "completed": 0, "failed": {"index": i, "tool": name,
                          "error": f"Not a modelling tool. Use one of {', '.join(BATCH_TOOLS)} or an add_<feature> tool."},
                          "rolled_back": True}, True)
        if not isinstance(s.get("args", {}), dict):
            return reply({"ok": False, "completed": 0, "failed": {"index": i, "tool": name,
                          "error": "args must be an object."}, "rolled_back": True}, True)

    with store.lock(doc_id):
        rec = _get(doc_id)
        sess = ai.Session(rec["doc"])
        base = _baseline(rec["doc"])
        known_err, known_warn = _problem_keys(base, "errors"), _problem_keys(base, "warnings")
        results = []
        for i, s in enumerate(steps):
            name = s["tool"]
            args = {k: v for k, v in (s.get("args") or {}).items() if v is not None and k != "doc_id"}
            try:
                report, clean, _ = sess.apply(name, args)
            except Exception as exc:  # a crash in one step must not leave half a batch saved
                report, clean = f"{type(exc).__name__}: {exc}", False
            try:
                rep = json.loads(report) if isinstance(report, str) else report
            except ValueError:
                rep = report
            why = None
            if not isinstance(rep, dict):
                if not clean:
                    why = str(rep)  # tools answer plain text when they refuse ("Unknown part ...")
            else:
                new_err = _problem_keys(rep, "errors") - known_err
                new_warn = _problem_keys(rep, "warnings") - known_warn
                if rep.get("input_problems"):
                    why = "Input problems: " + "; ".join(map(str, rep["input_problems"]))
                elif new_err:
                    msgs = [e.get("message") or json.dumps(e) for e in rep.get("errors", [])
                            if _problem_keys({"errors": [e]}, "errors") & new_err]
                    why = "Rebuild errors: " + "; ".join(map(str, msgs))
                elif stop_on_warnings and new_warn:
                    msgs = [w.get("message") for w in rep.get("warnings", []) if _problem_keys({"warnings": [w]}, "warnings") & new_warn]
                    why = "Warnings (stop_on_warnings): " + "; ".join(map(str, msgs))
                if not why:
                    known_err |= _problem_keys(rep, "errors")
                    known_warn |= _problem_keys(rep, "warnings")
            if why:
                return reply({"ok": False, "completed": i, "failed": {"index": i, "tool": name, "error": why,
                                                                       "report": _compact(rep)},
                              "rolled_back": True, "results": results,
                              "note": f"Nothing was saved: the document is still version {rec['version']}. "
                                      "Fix that step and send the whole batch again."}, True)
            results.append({"index": i, "tool": name, "clean": clean, "summary": sess.summary,
                            "report": _compact(rep) if i < len(steps) - 1 else rep})
        if dry_run:
            return reply({"ok": True, "dry_run": True, "completed": len(steps), "results": results,
                          "note": f"Dry run: nothing saved, the document is still version {rec['version']}."}, False)
        rec, changed = _save_session(rec, sess, summary or f"{len(steps)} steps")
        body = json.loads(_result(rec, None, all(r["clean"] for r in results), changed))
        return reply(dict(body, ok=True, completed=len(steps), results=results), False)


@mcp.tool()
async def batch(doc_id: str, steps: Annotated[list[dict], Field(description=(
                    'Steps in order, each {"tool": "<modelling tool>", "args": {...}} with the same args as that tool, '
                    'without doc_id. Tools: propose_features, create_part, insert_component, add_mate, delete_items, '
                    'standard_part, request_part_file, check_interference, find_mate_candidates, add_<feature>.'))],
                summary: str = "", stop_on_warnings: bool = False, dry_run: bool = False) -> CallToolResult:
    """Run several modelling steps as ONE change. If any step fails (a refused input, a new rebuild error, a
    failing mate, or with stop_on_warnings a new warning), nothing is saved and the reply says which step
    failed and why; already existing problems do not count. On success the whole batch is one version (one
    undo). dry_run=true checks the batch without saving. Prefer this for anything over two steps: build a
    part in stages of a few features, checking volume and bounding box in the results after each stage."""
    try:
        return await anyio.to_thread.run_sync(_batch_sync, doc_id, steps, summary, stop_on_warnings, dry_run)
    except store.NotFound:
        return CallToolResult(content=[TextContent(type="text", text=f"No document {doc_id!r}.")], is_error=True)


def _part_doc(doc: dict, part_id: str | None) -> dict:
    if assembly.is_assembly(doc):
        parts = doc.get("parts") or {}
        if part_id not in parts:
            raise ValueError(f"This is an assembly: give part_id, one of {sorted(parts)}." if not part_id
                             else f"Unknown part {part_id!r}; parts: {sorted(parts)}.")
        return parts[part_id]
    return doc


def _topology_sync(doc_id, part_id, kind, near, limit) -> str:
    rec = _get(doc_id)
    part = _part_doc(rec["doc"], part_id)
    st, _ = geometry.regen(part)
    out = inspection.body_topology(st.part, kind, near, limit, st.namer)
    out.update(doc_id=doc_id, version=rec["version"], **({"part_id": part_id} if part_id else {}))
    if assembly.is_assembly(rec["doc"]):
        out["coordinates"] = "part (local)"
    return json.dumps(out)


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def body_topology(doc_id: str, part_id: str | None = None,
                        kind: Literal["both", "faces", "edges"] = "both",
                        near: Annotated[list[float] | None, Field(description="[x,y,z] mm: list the faces and edges nearest this point first")] = None,
                        limit: Annotated[int, Field(ge=1, le=500)] = 60) -> str:
    """Faces and edges of a part's body, to pick them by name instead of guessing. Every face and edge has a
    persistent `name` from how it was made (e1:side:s1L2 = the side of extrude e1 made by sketch curve s1L2;
    e1:end, e1:start; f1:blend:<edge>; edges are "<face A>|<face B>"), so a fillet on an edge stays on it
    when the part changes size. Faces: type, area, centre,
    an on-face point, normal (planes), axis and radius (cylinders, cones), and `ref`. Edges: type, midpoint,
    start, end, length, direction or centre and radius, the two faces it joins, face_angle_deg (90 = square
    corner, 0 = smooth), seam (where a hole or shaft surface meets itself: never fillet it) and `ref`. Pass an edge's `ref` as-is in fillet / chamfer edges and a face's `ref`
    in shell / draft faces. Use near=[x,y,z] to get the items around a spot. Assembly parts are in part
    coordinates (give part_id)."""
    try:
        return await anyio.to_thread.run_sync(_topology_sync, doc_id, part_id, kind, near, limit)
    except store.NotFound:
        return f"No document {doc_id!r}."
    except ValueError as exc:
        return json.dumps({"error": str(exc)})


def _inspect_sync(doc_id, part_id, sketches) -> str:
    rec = _get(doc_id)
    out = inspection.inspect_design(rec["doc"], part_id, sketches)
    out.update(doc_id=doc_id, version=rec["version"])
    return json.dumps(out)


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def inspect_design(doc_id: str, part_id: str | None = None, sketches: bool = True) -> str:
    """Numbers to check the model against what you meant, in one call. Part: rebuild state of every feature
    (with its volume change), the body's volume, area, centre of mass, bounding box and size, face and edge
    counts, mass when a material is set, and each sketch's degrees of freedom (dof, status under / fully /
    over, conflicting relations, under-defined curves). Assembly: component and mate states, free DOF,
    under-defined components and each part's body numbers; give part_id for one part with its sketches.
    Work out the volume and bounding box you expect before building, then compare. A cut whose volume
    change is 0 missed the body."""
    try:
        return await anyio.to_thread.run_sync(_inspect_sync, doc_id, part_id, sketches)
    except store.NotFound:
        return f"No document {doc_id!r}."


def _review_sync(doc_id, compare_version, title, notes) -> str:
    from . import review
    _check(doc_id)  # only this connector's person's documents
    try:
        out = review.publish(doc_id, compare_version, title, notes, by="claude")
    except store.NotFound:
        raise
    except (review.ReviewError, assembly.AssemblyError, geometry.FeatureError) as exc:
        return json.dumps({"error": f"Cannot publish: {exc}"})
    out["open"] = _link(doc_id)
    return json.dumps(out)


@mcp.tool()
async def publish_review(doc_id: str,
                         compare_version: Annotated[int | None, Field(description="An earlier version to compare with: changed parts in black, the old version as a ghost, the change list")] = None,
                         title: str | None = None,
                         notes: Annotated[str | None, Field(description="What the reader should know, plain text; blank lines between paragraphs. Say what changed and why, what is open.")] = None) -> str:
    """Publish a read-only link to the document's current version and return it (`url`): OpenSketch opens
    on it with Motion Review, the 3D model, a slider for every joint with travel (hinge with angle limits,
    limit_distance, limit_angle; couplers make driven parts follow), solved live, and a record: what
    changed since compare_version (parts and mates), checks (rebuild and mate errors, clashes as shown and
    through each joint's travel, smallest gap, how far each joint reaches, contacts that stop touching).
    It shares shapes, not the feature history. The link works without the OpenSketch password, so YZ can
    send it or open it on a phone; it does not change when the model does. Use it at the end of a design
    round; give YZ the url and the checks summary."""
    try:
        return await anyio.to_thread.run_sync(_review_sync, doc_id, compare_version, title, notes)
    except store.NotFound:
        return f"No document {doc_id!r}."


def _measure_sync(doc_id, a, b, part_id) -> str:
    rec = _get(doc_id)
    try:
        out = measure.measure(rec["doc"], a, b, part_id)
    except (measure.MeasureError, geometry.FeatureError) as exc:
        return json.dumps({"error": str(exc)})
    out.update(doc_id=doc_id, version=rec["version"])
    return json.dumps(out)


_PICK = ('{"face": ref} | {"edge": ref} | {"point": [x,y,z]} | {"name": "<face or edge name>"}, refs and names as '
         'body_topology gives them; in an assembly add "component": "<id>" for assembly coordinates')


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def measure_items(doc_id: str, a: Annotated[dict, Field(description=_PICK)],
                        b: Annotated[dict | None, Field(description="Optional second item, same form")] = None,
                        part_id: str | None = None) -> str:
    """Measure like SOLIDWORKS Evaluate > Measure. One item: area, length, diameter, axis, normal, whether a
    cylinder is a hole, and for a planar face the round holes and slots through it (diameter, width,
    centre distance, overall length, centres). Two items: min_distance with the closest points and delta,
    center_distance between axes (holes, shafts, circular edges), axis_angle_deg, angle_deg and
    plane_distance for planes, axis_to_plane distance. Use it to check positions, gaps and hole sizes that
    volume and centre of mass cannot show, e.g. the clearance between two components."""
    try:
        return await anyio.to_thread.run_sync(_measure_sync, doc_id, a, b, part_id)
    except store.NotFound:
        return f"No document {doc_id!r}."


# ----------------------------------------------------------------------------- feature commands (registry)

def _py_type(p) -> Any:
    k = p.kind
    if k in ("length", "angle", "number"):
        return float
    if k == "int":
        return int
    if k == "bool":
        return bool
    if k in ("string", "sketch", "sketch_line"):
        return str
    if k == "enum":
        return Literal[tuple(o[0] for o in p.options)]
    if k in ("axis", "direction"):
        return str | dict
    if k in ("faces", "edges"):
        return list[dict]
    if k == "features":
        return list[str]
    return dict


def _feature_tool(ft):
    """An MCP tool add_<type>(doc_id, <required params>, part_id, name, <optional params>) for one feature type."""
    from pydantic import Field

    name = features.tool_name(ft)
    P = inspect.Parameter
    params = [P("doc_id", P.POSITIONAL_OR_KEYWORD, annotation=str)]
    hints: dict = {"doc_id": str, "return": str}
    for p in ft.params:
        if p.required:
            t = Annotated[_py_type(p), Field(description=features.describe_param(p))]
            params.append(P(p.name, P.POSITIONAL_OR_KEYWORD, annotation=t))
            hints[p.name] = t
    for extra, doc in (("part_id", "Assembly documents: the part to add the feature to."),
                       ("name", f"Optional tree name (default {ft.base}N).")):
        t = Annotated[str | None, Field(description=doc)]
        params.append(P(extra, P.POSITIONAL_OR_KEYWORD, annotation=t, default=None))
        hints[extra] = t
    for p in ft.params:
        if not p.required:
            t = Annotated[_py_type(p) | None, Field(description=features.describe_param(p))]
            params.append(P(p.name, P.POSITIONAL_OR_KEYWORD, annotation=t, default=None))
            hints[p.name] = t

    async def tool(**kw) -> str:
        doc_id = kw.pop("doc_id")
        return await _apply(doc_id, name, **kw)

    tool.__name__ = name
    tool.__signature__ = inspect.Signature(params, return_annotation=str)
    tool.__annotations__ = hints
    tool.__doc__ = features.tool_description(ft)
    return tool


for _ft in features.REGISTRY.values():
    if _ft.tool:
        mcp.add_tool(_feature_tool(_ft), name=features.tool_name(_ft), description=features.tool_description(_ft))


# ----------------------------------------------------------------------------- HTTP

_http_app = None


class _TokenGate:
    """ASGI app (a class, so Starlette routes it as ASGI, not as a request handler): 404 unless the token
    in the path is right."""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        ok, user = auth.resolve_mcp(scope.get("path_params", {}).get("token", ""))
        if not ok:
            await send({"type": "http.response.start", "status": 404, "headers": [(b"content-type", b"text/plain")]})
            await send({"type": "http.response.body", "body": b"Not found"})
            return
        token = _mcp_user.set(user)
        try:
            await self.inner(scope, receive, send)
        finally:
            _mcp_user.reset(token)


class _BearerGate:
    """ASGI app for /mcp: the AI app signed in (mcpauth.py) and sends `Authorization: Bearer <token>`.
    No or a bad token: 401 with the WWW-Authenticate pointer the MCP spec asks for, so the app starts sign-in.
    A server without sign-in (open mode) needs no token."""

    async def __call__(self, scope, receive, send):
        from . import mcpauth
        headers = {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}
        cors = [(b"access-control-allow-origin", b"*"),
                (b"access-control-expose-headers", b"mcp-session-id, mcp-protocol-version, www-authenticate")]
        if scope.get("method") == "OPTIONS":
            await send({"type": "http.response.start", "status": 204, "headers": cors + [
                (b"access-control-allow-methods", b"GET, POST, DELETE, OPTIONS"),
                (b"access-control-allow-headers", b"authorization, content-type, mcp-protocol-version, mcp-session-id, last-event-id"),
                (b"access-control-max-age", b"600")]})
            await send({"type": "http.response.body", "body": b""})
            return
        if auth.mode() == "open":
            ok, user = True, None
        else:
            authz = headers.get("authorization", "")
            tok = authz[7:].strip() if authz[:7].lower() == "bearer " else ""
            ok, user = mcpauth.user_for_access(tok) if tok else (False, None)
            if not ok:
                body = json.dumps({"error": "invalid_token" if tok else "unauthorized",
                                   "error_description": "Sign in to OpenSketch to use it from this app."}).encode()
                await send({"type": "http.response.start", "status": 401, "headers": cors + [
                    (b"content-type", b"application/json"),
                    (b"www-authenticate", mcpauth.challenge(headers, "invalid_token" if tok else "").encode())]})
                await send({"type": "http.response.body", "body": body})
                return

        async def send_cors(msg):
            if msg["type"] == "http.response.start":
                msg = dict(msg, headers=list(msg.get("headers", [])) + cors)
            await send(msg)
        token = _mcp_user.set(user)
        try:
            await http_app().inner(scope, receive, send_cors)
        finally:
            _mcp_user.reset(token)


_bearer_app = None


def bearer_app():
    global _bearer_app
    if _bearer_app is None:
        _bearer_app = _BearerGate()
    return _bearer_app


def http_app():
    """The ASGI app for /mcp/<token> (token checked here) and the session manager to run in the lifespan."""
    global _http_app
    if _http_app is None:
        _http_app = _TokenGate(None)
        _configure_http()
    return _http_app


def _configure_http():
    # The SDK's session manager has a single-use lifespan. Keep the mounted gate stable while
    # creating a fresh manager for each application startup (including repeated test lifespans).
    mcp.streamable_http_app(stateless_http=True, json_response=True,
                            max_request_body_size=4 * ((MAX_IMPORT_BYTES + 2) // 3) + 65536,
                            transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False))
    _http_app.inner = StreamableHTTPASGIApp(mcp.session_manager)


def lifespan_context():
    """Run the MCP session manager while the server runs."""
    http_app()
    _configure_http()
    return mcp.session_manager.run()
