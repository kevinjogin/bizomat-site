"""OpenSketch for SOLIDWORKS: the connector on its own.

An AI app (Claude, ChatGPT...) adds one address, <site>/solidworks/mcp, and gets only the SOLIDWORKS tools: the
sw_ tools of sw_tools.py (and sw_selftest), plus request_upload for big imports. No OpenSketch documents, no
browser CAD app: the person sets it up on the /solidworks page (sign in, download the add-in, copy the key, copy
this address) and works in SOLIDWORKS itself.

The tools are the same functions OpenSketch's own endpoint (/mcp) serves, registered on a second MCP server, so the
two never drift apart. Sign-in is the same OAuth (mcpauth.py) with its own resource: a token made for one endpoint
does not work on the other, and connecting Claude to both keeps both connections.
"""

from __future__ import annotations

import json
from typing import Annotated

from mcp.server.mcpserver import MCPServer
from pydantic import Field

from . import mcp_server, sw_selftest, sw_tools  # noqa: F401  (the sw_ tools register on mcp_server.mcp on import)

PATH = "/solidworks/mcp"
NAME = "OpenSketch for SOLIDWORKS"

INSTRUCTIONS = """OpenSketch for SOLIDWORKS: you build native SOLIDWORKS parts and assemblies in the user's own files,
in the SOLIDWORKS running on their PC (through the OpenSketch add-in). Everything you make is a real SOLIDWORKS
feature: sketches with relations and dimensions, extrudes, revolves, holes, fillets, patterns, mates.

- Call sw_status first. If SOLIDWORKS is not connected, tell the user what it says and stop.
- Call sw_get_guide once before your first change: it has the workflow and the feature format.
- The user may change the same file by hand between your calls: read it with sw_get_document before you write.
- Build in small stages with sw_batch (if a step fails, the whole batch is taken back). Predict the volume and
  bounding box before each stage and compare with the result; a difference means a wrong plane, direction or depth.
- Pick faces and edges with sw_body_topology (pass each item's `ref`). Check with sw_inspect_design,
  sw_measure_items and sw_preview; assemblies with sw_check_interference.
- To bring in a file over about 100 KB: request_upload, send the file with an HTTP PUT, then sw_import(upload_id).
- New documents are saved when made; later changes are saved with sw_save (or by the user).
- When the user asks to test the setup, run sw_selftest (stages plate, shapes, assembly) and pass on its report."""

sw_mcp = MCPServer(name=NAME, instructions=INSTRUCTIONS)


def sw_tool_names() -> list[str]:
    """Every sw_ tool OpenSketch's endpoint has (sw_selftest included), in name order."""
    return sorted(n for n in mcp_server.mcp._tool_manager._tools if n.startswith("sw_"))


def _register() -> None:
    for name in sw_tool_names():
        t = mcp_server.mcp._tool_manager.get_tool(name)
        sw_mcp.add_tool(t.fn, name=t.name, title=t.title, description=t.description, annotations=t.annotations,
                        icons=t.icons, meta=t.meta)


_register()


@sw_mcp.tool(name="request_upload")
def request_upload(filename: Annotated[str, Field(description="The file's name, e.g. bracket.step or housing.x_t")],
                   size_bytes: Annotated[int | None, Field(description="Optional: the file size, to refuse a too-big file before sending it")] = None) -> str:
    """Get a one-time link to send a file for sw_import(upload_id=...). Use it for any file bigger than about
    100 KB instead of base64 data. Send the file's raw bytes as the body of an HTTP PUT (or POST) to upload_url,
    e.g. curl -sS -T model.step '<upload_url>'; a gzipped body works with the header Content-Encoding: gzip. The
    link is for this account only, takes one upload, expires after 10 minutes, and carries no other access; the
    file waits 30 minutes for sw_import. Max 32 MiB."""
    out = json.loads(mcp_server.request_upload(filename, size_bytes))
    if "upload_id" in out:
        out["next"] = f'sw_import(upload_id="{out["upload_id"]}")'
    return json.dumps(out)


_endpoint: mcp_server.Endpoint | None = None


def endpoint() -> mcp_server.Endpoint:
    global _endpoint
    if _endpoint is None:
        _endpoint = mcp_server.Endpoint(sw_mcp, PATH)
    return _endpoint
