"""The JSON-RPC message in an MCP answer. The server answers a request as server-sent events (a long tool call keeps
its connection alive with comments); the Streamable HTTP transport also allows a plain JSON body, read the same way."""

from __future__ import annotations

import json


def rpc(r) -> dict:
    """The JSON-RPC response (the message with an id and a result or an error) in an httpx response."""
    if not r.headers.get("content-type", "").startswith("text/event-stream"):
        return r.json()
    for block in r.text.replace("\r\n", "\n").split("\n\n"):
        data = "\n".join(line[5:].removeprefix(" ") for line in block.split("\n") if line.startswith("data:"))
        if data:
            msg = json.loads(data)
            if "id" in msg and ("result" in msg or "error" in msg):
                return msg
    raise AssertionError(f"no JSON-RPC response in the event stream: {r.text[:300]!r}")
