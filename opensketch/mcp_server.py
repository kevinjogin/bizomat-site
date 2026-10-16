"""OpenSketch as an MCP server: Claude (in the Claude app, Claude Code, ...) builds parts and
assemblies in OpenSketch documents, and the user watches them change live in the browser.

Endpoint: /mcp/<token> (Streamable HTTP, stateless, JSON responses), so a server restart after an update
does not break Claude's connection. The token is the key (see auth.py); the app's Connect Claude
dialog shows the full address.

The modelling tools are the built-in AI's tools (ai.Session), run against a stored document
(store.py) instead of a chat proposal: every change is saved as a new version at once, the browser
follows it, and undo_last_change / restore_version go back.
"""

from __future__ import annotations

import base64
import binascii
import json
import re
from typing import Any, Literal

import anyio
from mcp.server.mcpserver import MCPServer
from mcp.server.streamable_http_manager import StreamableHTTPASGIApp
from mcp.server.transport_security import TransportSecuritySettings
from mcp.types import CallToolResult, ImageContent, TextContent, ToolAnnotations

from . import ai, artifacts, assembly, auth, geometry, importer, store

INSTRUCTIONS = """OpenSketch is a parametric CAD app that works like SOLIDWORKS. You build real feature trees
(sketches with relations and dimensions, extrudes, revolves, fillets...) and assemblies with mates, in
documents the user has open in their browser: every change you make appears there within a second or two.
Call get_modelling_guide once before your first change: it has the document format, the assembly workflow
and the rules (off-the-shelf parts first). Then: list_documents or create_document, get_document to read
one, and the modelling tools, which all take doc_id. Every change is saved immediately (undo_last_change
goes back). Work in the background by default: no browser is needed to model, import, inspect a PNG
preview, or export CAD. Use import_document for source files, preview_document for visual review and
export_document for .osk, STEP and STL downloads. Open the app only when the user asks or would benefit
from interactive inspection. After building, give the user the document's link from the tool result."""

MCP_PREFACE = """You are working in OpenSketch through MCP tools. Differences from the in-app copilot described
below: every tool takes a doc_id; there is no Accept/Reject step, each change is saved at once as a new
version (undo_last_change, list_versions, restore_version go back); the user sees the model update live in
their browser. Write one short line before each change as usual. Use your own web search if you have it
for real part sizes and standards. Modelling, imports, previews and exports run on the server without
opening a browser. Default to background work, use preview_document for visual inspection, and use
export_document for downloads (optional part_id exports one assembly part in its local coordinates).
Download URLs are read-only, artifact-specific links valid for one hour; they never contain the MCP
credential. Fetch them before expiry or call the tool again. Native .osk exports preserve the source
even if it needs repair; STEP/STL/PNG are refused when active geometry or mates fail to rebuild.
When done, give the user the "open" link from the last tool result and any requested download links.

"""

MateType = Literal["coincident", "concentric", "parallel", "perpendicular", "distance", "angle", "lock",
                   "hinge", "limit_distance", "limit_angle"]
StdKind = Literal["socket_head_cap_screw", "hex_head_screw", "counter_sunk_screw", "button_head_screw",
                  "set_screw", "hex_nut", "plain_washer", "ball_bearing"]

mcp = MCPServer(name="OpenSketch", instructions=INSTRUCTIONS)


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


def _apply_sync(doc_id: str, tool: str, inp: dict) -> str:
    with store.lock(doc_id):
        rec = store.get(doc_id)
        sess = ai.Session(rec["doc"])
        report, clean, _ = sess.apply(tool, {k: v for k, v in inp.items() if v is not None})
        if assembly.is_assembly(sess.work) and not assembly.is_assembly(rec["doc"]):
            sess.work["name"] = rec["name"]  # the document keeps its name when it becomes an assembly
        reqs = list(rec.get("requests") or [])
        for r in getattr(sess, "requests", []):
            item = {k: r.get(k) for k in ("part", "description", "mcmaster", "url")}
            reqs = [q for q in reqs if q.get("part") != item["part"]] + [item]
        changed = sess.work != rec["doc"] or reqs != (rec.get("requests") or [])
        if changed:
            rec = store.save(doc_id, sess.work, "claude", sess.summary or tool.replace("_", " ").capitalize(),
                             requests=reqs)
        return _result(rec, report, clean, changed)


async def _apply(doc_id: str, tool: str, **inp) -> str:
    try:
        return await anyio.to_thread.run_sync(_apply_sync, doc_id, tool, inp)
    except store.NotFound:
        return f"No document {doc_id!r}. Use list_documents or create_document."


# ----------------------------------------------------------------------------- documents

@mcp.tool()
def get_modelling_guide() -> str:
    """The OpenSketch document format, feature types, assembly workflow and design rules. Read it once
    before your first change."""
    return MCP_PREFACE + ai.SYSTEM


@mcp.tool()
def list_documents() -> str:
    """Documents on this OpenSketch server, newest first (id, name, part or assembly, version, last change)."""
    return json.dumps([dict(r, open=_link(r["id"])) for r in store.listing()])


@mcp.tool()
def create_document(name: str, kind: Literal["part", "assembly"] = "part") -> str:
    """Create an empty part or assembly document. A part document becomes an assembly by itself when you
    call create_part on it, so start with "part" unless the product clearly has several pieces."""
    rec = store.create(name, kind=kind, by="claude")
    return _result(rec)


def _read_sync(doc_id: str) -> str:
    rec = store.get(doc_id)
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
        for field in ("refs", "planes", "angle_refs"):
            if field in mate:
                object_list(mate[field], f"mate {field}")
    if "sequence" in doc and (not isinstance(doc["sequence"], list)
                              or not all(isinstance(item, str) for item in doc["sequence"])):
        raise ValueError("Assembly sequence must be a list of component IDs.")


def _import_sync(filename: str, data: str, name: str | None) -> str:
    if not re.fullmatch(r"[^/\\\x00-\x1f]{1,255}", filename) or filename in (".", ".."):
        raise ValueError("Use a filename without directory components.")
    if len(data) > 4 * ((MAX_IMPORT_BYTES + 2) // 3):
        raise ValueError("Import is limited to 32 MiB before base64 encoding.")
    try:
        raw = base64.b64decode(data, validate=True)
    except (ValueError, binascii.Error):
        raise ValueError("data must be valid base64 file content.") from None
    if not raw or len(raw) > MAX_IMPORT_BYTES:
        raise ValueError("Import requires a non-empty file of at most 32 MiB.")
    if filename.lower().endswith((".osk", ".json")):
        doc = json.loads(raw)
        _native_structure(doc)
    else:
        doc = importer.import_file(raw, filename)
    rec = store.create(name or doc.get("name") or filename.rsplit(".", 1)[0], doc=doc, by="claude")
    return _result(rec, report={"source_filename": filename, "size_bytes": len(raw)})


@mcp.tool()
async def import_document(filename: str, data: str, name: str | None = None) -> str:
    """Import a source file as a NEW stored document; never overwrites existing work. data is base64
    file bytes, at most 32 MiB decoded. Supports .osk/.json, STEP/.stp, EAGLE XML .brd, or a zip with one
    supported CAD file. EAGLE supplies PCB geometry, not populated component solids. Runs in background."""
    try:
        return await anyio.to_thread.run_sync(_import_sync, filename, data, name)
    except (ValueError, importer.ImportError_) as exc:
        return json.dumps({"error": f"Cannot import: {exc}"})


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def export_document(doc_id: str, format: Literal["osk", "step", "stl"], part_id: str | None = None) -> str:
    """Export a saved document without a browser or changing its version. Returns an immutable file,
    source version, SHA-256 and a read-only download_url valid for one hour. Optional part_id exports
    an assembly part in LOCAL coordinates. STEP/STL refuse failed rebuilds; .osk preserves source."""
    try:
        rec = store.get(doc_id)
        result = await anyio.to_thread.run_sync(artifacts.export_record, rec, format, part_id)
        return json.dumps(dict(result, open=_link(doc_id)))
    except (store.NotFound, artifacts.ArtifactError, geometry.FeatureError, assembly.AssemblyError) as exc:
        return json.dumps({"error": f"Cannot export: {exc}"})


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def preview_document(doc_id: str, view: Literal["isometric", "top", "front", "right"] = "isometric",
                           width: int = 960, height: int = 720, part_id: str | None = None) -> CallToolResult:
    """Render a PNG of saved geometry without a browser. Returns the image directly for inspection,
    plus an immutable PNG download_url valid for one hour. Views: isometric, top, front, right. Dimensions
    128..1600 pixels. Optional part_id previews an assembly part in local coordinates. No document edits."""
    try:
        if not 128 <= width <= 1600 or not 128 <= height <= 1600:
            raise artifacts.ArtifactError("Preview dimensions must be between 128 and 1600 pixels.")
        rec = store.get(doc_id)
        result, raw = await anyio.to_thread.run_sync(artifacts.preview_record, rec, view, width, height, part_id)
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
        return _result(store.undo(doc_id, "claude"))
    except store.NotFound as exc:
        return f"Cannot undo: {exc}"


@mcp.tool()
def list_versions(doc_id: str) -> str:
    """Earlier versions of a document still kept (the last 50), newest first."""
    try:
        return json.dumps(store.versions(doc_id))
    except store.NotFound:
        return f"No document {doc_id!r}."


@mcp.tool()
def restore_version(doc_id: str, version: int) -> str:
    """Bring back an earlier version of the document (saved as a new version, so nothing is lost)."""
    try:
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
                   min: float | None = None, max: float | None = None) -> str:
    """Add a mate between two components and re-solve. refs: two references in each component's part
    coordinates, e.g. {"component": "c1", "plane": {"point": [x,y,z], "normal": [x,y,z]}}, {"component":
    "c2", "axis": {"point": [...], "dir": [...]}}, or {"component": "c1", "ref": "Top Plane"}. value: mm or
    degrees for distance / angle. hinge: refs = two axes, planes = two faces that stay together,
    angle_refs + angle_min / angle_max = travel limits. limit_distance / limit_angle: refs + min / max."""
    return await _apply(doc_id, "add_mate", type=type, refs=refs, value=value, align=align, flip=flip, planes=planes,
                        angle_refs=angle_refs, angle_min=angle_min, angle_max=angle_max, min=min, max=max)


@mcp.tool()
async def delete_items(doc_id: str, components: list[str] | None = None, mates: list[str] | None = None,
                       parts: list[str] | None = None) -> str:
    """Delete components, mates or parts from an assembly by id (mates on deleted components go too)."""
    return await _apply(doc_id, "delete_items", components=components, mates=mates, parts=parts)


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


# ----------------------------------------------------------------------------- HTTP

_http_app = None


class _TokenGate:
    """ASGI app (a class, so Starlette routes it as ASGI, not as a request handler): 404 unless the token
    in the path is right."""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        if not auth.check_token(scope.get("path_params", {}).get("token", "")):
            await send({"type": "http.response.start", "status": 404, "headers": [(b"content-type", b"text/plain")]})
            await send({"type": "http.response.body", "body": b"Not found"})
            return
        await self.inner(scope, receive, send)


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
