"""OpenSketch as an MCP server: an AI app (Claude, ChatGPT...) builds native SOLIDWORKS parts and assemblies in the
user's own SOLIDWORKS, through the OpenSketch add-in on their PC (swbridge.py). The tools are in sw_tools.py and
sw_selftest.py; they register on `mcp` here.

Addresses: <site>/mcp, where the AI app signs in (OAuth, mcpauth.py; Bearer token), and <site>/mcp/<key>, the
private address for apps that cannot sign in (auth.resolve_mcp). /solidworks/mcp is the same server under the
address it had on 2026-10-20 while the browser app still owned /mcp. Streamable HTTP, stateless, JSON responses,
so a server restart after an update does not break the AI app's connection.

The browser CAD app and its document tools are archived (branch archive/opensketch-app).
"""

from __future__ import annotations

import contextlib
import contextvars
import json
import re
from typing import Annotated, Literal

from mcp.server.mcpserver import MCPServer
from mcp.server.streamable_http_manager import StreamableHTTPASGIApp
from mcp.server.transport_security import TransportSecuritySettings
from pydantic import Field

from . import auth, uploads

NAME = "OpenSketch"
PATHS = ("/mcp", "/solidworks/mcp")  # the first is the address people are given

INSTRUCTIONS = """OpenSketch: you build native SOLIDWORKS parts and assemblies in the user's own files, in the
SOLIDWORKS running on their PC (through the OpenSketch add-in). Everything you make is a real SOLIDWORKS feature:
sketches with relations and dimensions, extrudes, revolves, holes, fillets, patterns, mates.

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

StdKind = Literal["socket_head_cap_screw", "hex_head_screw", "counter_sunk_screw", "button_head_screw",
                  "set_screw", "hex_nut", "plain_washer", "ball_bearing"]
MAX_IMPORT_BYTES = 32 * 1024 * 1024

mcp = MCPServer(name=NAME, instructions=INSTRUCTIONS)

# The person whose sign-in or private address made this request: set by the gates for the request and copied
# into the tool's task and worker threads. None = a server without accounts.
_mcp_user: contextvars.ContextVar = contextvars.ContextVar("opensketch_mcp_user", default=None)


def _who() -> dict | None:
    return _mcp_user.get()


def _check_filename(filename: str | None) -> str:
    if not isinstance(filename, str) or not re.fullmatch(r"[^/\\\x00-\x1f]{1,255}", filename) or filename in (".", ".."):
        raise ValueError("Use a filename without directory components.")
    return filename


def _shell_quote(s: str) -> str:
    return "'" + s.replace("'", "'\\''") + "'"


@mcp.tool()
def request_upload(filename: Annotated[str, Field(description="The file's name, e.g. bracket.step or housing.x_t")],
                   size_bytes: Annotated[int | None, Field(description="Optional: the file size, to refuse a too-big file before sending it")] = None) -> str:
    """Get a one-time link to send a file for sw_import(upload_id=...). Use it for any file bigger than about
    100 KB instead of base64 data. Send the file's raw bytes as the body of an HTTP PUT (or POST) to upload_url,
    e.g. curl -sS -T model.step '<upload_url>'; a gzipped body works with the header Content-Encoding: gzip. The
    link is for this account only, takes one upload, expires after 10 minutes, and carries no other access; the
    file waits 30 minutes for sw_import. Max 32 MiB."""
    try:
        out = uploads.create(_who(), filename, MAX_IMPORT_BYTES, size_bytes)
    except uploads.UploadError as exc:
        return json.dumps({"error": f"Cannot make an upload link: {exc}"})
    out["how"] = f"curl -sS -T {_shell_quote(filename)} '{out['upload_url']}'"
    out["next"] = f'sw_import(upload_id="{out["upload_id"]}")'
    return json.dumps(out)


from . import sw_selftest, sw_tools  # noqa: E402,F401  (the sw_ tools register on `mcp`)


def tool_names() -> list[str]:
    return sorted(mcp._tool_manager._tools)


# ----------------------------------------------------------------------------- HTTP

class _TokenGate:
    """ASGI app for <path>/<key> (a class, so Starlette routes it as ASGI): 404 unless the key is right."""

    def __init__(self, endpoint: "Endpoint"):
        self.endpoint = endpoint

    async def __call__(self, scope, receive, send):
        ok, user = auth.resolve_mcp(scope.get("path_params", {}).get("token", ""))
        if not ok:
            await send({"type": "http.response.start", "status": 404, "headers": [(b"content-type", b"text/plain")]})
            await send({"type": "http.response.body", "body": b"Not found"})
            return
        token = _mcp_user.set(user)
        try:
            await self.endpoint.inner(scope, receive, send)
        finally:
            _mcp_user.reset(token)


class _BearerGate:
    """ASGI app for the sign-in address: the AI app signed in (mcpauth.py) and sends `Authorization: Bearer
    <token>`. No or a bad token: 401 with the WWW-Authenticate pointer the MCP spec asks for, so the app starts
    sign-in. A server without sign-in (open mode) needs no token."""

    def __init__(self, endpoint: "Endpoint"):
        self.endpoint = endpoint

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
        path = scope.get("path", PATHS[0]).rstrip("/") or PATHS[0]
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
                    (b"www-authenticate", mcpauth.challenge(headers, "invalid_token" if tok else "", path).encode())]})
                await send({"type": "http.response.body", "body": body})
                return

        async def send_cors(msg):
            if msg["type"] == "http.response.start":
                msg = dict(msg, headers=list(msg.get("headers", [])) + cors)
            await send(msg)
        token = _mcp_user.set(user)
        try:
            await self.endpoint.inner(scope, receive, send_cors)
        finally:
            _mcp_user.reset(token)


class Endpoint:
    """The MCP server on the web server: for each path in PATHS, the path itself (signed in) and path/<key>."""

    def __init__(self):
        self.inner = None
        self.token_gate = _TokenGate(self)
        self.bearer_gate = _BearerGate(self)
        self.configure()

    def configure(self):
        # The SDK's session manager has a single-use lifespan: a fresh one for each application startup (including
        # repeated test lifespans), behind the same mounted gates.
        mcp.streamable_http_app(stateless_http=True, json_response=True,
                                max_request_body_size=4 * ((MAX_IMPORT_BYTES + 2) // 3) + 65536,
                                transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False))
        self.inner = StreamableHTTPASGIApp(mcp.session_manager)

    def routes(self) -> list:
        from starlette.routing import Route
        signed, keyed = ["GET", "POST", "DELETE", "OPTIONS"], ["GET", "POST", "DELETE"]
        out = []
        for p in PATHS:
            out += [Route(p, endpoint=self.bearer_gate, methods=signed),
                    Route(p + "/", endpoint=self.bearer_gate, methods=signed),
                    Route(p + "/{token}", endpoint=self.token_gate, methods=keyed),
                    Route(p + "/{token}/", endpoint=self.token_gate, methods=keyed)]
        return out


_endpoint: Endpoint | None = None


def endpoint() -> Endpoint:
    global _endpoint
    if _endpoint is None:
        _endpoint = Endpoint()
    return _endpoint


@contextlib.asynccontextmanager
async def lifespan_context():
    """Run the MCP session manager while the server runs."""
    ep = endpoint()
    ep.configure()
    async with mcp.session_manager.run():
        yield
