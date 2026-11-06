"""One-time upload links: request_upload -> PUT the file -> sw_import(upload_id), over real MCP calls. sw_import
itself needs SOLIDWORKS (tests/test_swbridge.py); here the server side takes the bytes with uploads.take, as it does."""
import gzip
import hashlib
import json
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

import pytest
from fastapi.testclient import TestClient

from opensketch import auth, geometry, mcp_server, server, store, uploads
from tests.mcp_reply import rpc
from tests.test_assembly import plate


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "http://testserver")
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    # a public server answers MCP only once someone owns it; the owner's first private address is the server-wide one
    from opensketch import accounts
    accounts.create_owner("owner@example.com", "Owner", "correct horse")
    return tmp_path


def _signed_in_owner():
    owner = TestClient(server.app)
    assert owner.post("/login", data={"email": "owner@example.com", "password": "correct horse", "next": "/"},
                      follow_redirects=False).status_code == 303
    return owner


def _rpc(c, url, method, params=None):
    r = c.post(url, json={"jsonrpc": "2.0", "id": 1, "method": method, "params": params or {}},
               headers={"Accept": "application/json, text/event-stream"})
    assert r.status_code == 200, r.text
    return rpc(r)["result"]


def _tool(client, url, tool, **arguments):
    result = _rpc(client, url, "tools/call", {"name": tool, "arguments": arguments})
    assert not result.get("isError"), result
    return json.loads(result["content"][0]["text"])


def _take(upload_id, user=None):
    from opensketch import accounts
    try:
        return uploads.take(upload_id, user if user is not None else accounts.owner())[0]
    except uploads.UploadError as exc:
        return str(exc)


def _step_bytes(tmp_path) -> bytes:
    path = tmp_path / "plate.step"
    geometry.export(plate(), "step", str(path))
    return path.read_bytes()


def _path(url: str) -> str:
    s = urlsplit(url)
    return f"{s.path}?{s.query}"


def _setup_owner_and_member():
    owner = _signed_in_owner()
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    member = TestClient(server.app)
    member.post(f"/join/{token}", data={"name": "Mei", "email": "mei@example.com", "new_password": "battery staple"})
    assert member.get("/api/account").json()["user"]["role"] == "member"
    return owner, member


def test_upload_then_take_without_base64(tmp_path, monkeypatch):
    raw = _step_bytes(tmp_path)
    url = f"/mcp/{auth.mcp_token()}"
    with TestClient(server.app) as c:
        tools = {t["name"]: t for t in _rpc(c, url, "tools/list")["tools"]}
        assert "request_upload" in tools and "upload_id" in tools["sw_import"]["inputSchema"]["properties"]
        link = _tool(c, url, "request_upload", filename="plate.step", size_bytes=len(raw))
        assert link["method"] == "PUT" and link["max_bytes"] == 32 * 2**20 and link["expires_in_seconds"] == 600
        assert auth.mcp_token() not in link["upload_url"] and link["upload_url"].startswith("http://testserver/mcp/uploads/")
        assert link["how"].startswith("curl -sS -T 'plate.step' 'http://testserver/mcp/uploads/")
        assert link["next"] == f'sw_import(upload_id="{link["upload_id"]}")'
        assert "Nothing has been sent" in _take(link["upload_id"])  # and the link stays usable
        r = c.put(_path(link["upload_url"]), content=raw)
        assert r.status_code == 201, r.text
        assert r.json()["sha256"] == hashlib.sha256(raw).hexdigest() and r.json()["size_bytes"] == len(raw)
        assert r.headers["cache-control"] == "no-store" and "sw_import" in r.json()["next"]
        again = c.put(_path(link["upload_url"]), content=b"other")
        assert again.status_code == 409 and "already used" in again.json()["error"]
        assert _take(link["upload_id"]) == raw
        uploads.mark_imported(link["upload_id"], "solidworks")
        assert not list((store.data_dir() / "uploads").glob("*.bin"))  # bytes freed after the import
        assert "already imported" in _take(link["upload_id"])


def test_gzip_body_bounds_and_retry(tmp_path, monkeypatch):
    raw = _step_bytes(tmp_path)
    url = f"/mcp/{auth.mcp_token()}"
    with TestClient(server.app) as c:
        link = _tool(c, url, "request_upload", filename="plate.step")
        path = _path(link["upload_url"])
        # a damaged gzip is refused and the link can be used again
        bad = c.put(path, content=gzip.compress(raw)[:-20], headers={"Content-Encoding": "gzip"})
        assert bad.status_code == 400 and "damaged" in bad.json()["error"]
        assert c.post(path, content=b"", headers={}).status_code == 400  # empty
        form = c.post(path, files={"file": ("plate.step", raw)})
        assert form.status_code == 400 and "not a form" in form.json()["error"]
        ok = c.put(path, content=gzip.compress(raw), headers={"Content-Encoding": "gzip"})
        assert ok.status_code == 201 and ok.json()["sha256"] == hashlib.sha256(raw).hexdigest()
        assert _take(link["upload_id"]) == raw
        # the 32 MiB cap applies after unzipping: a small gzip that unpacks to more is refused, not unpacked
        monkeypatch.setattr(mcp_server, "MAX_IMPORT_BYTES", 1000)
        link = _tool(c, url, "request_upload", filename="big.step")
        bomb = gzip.compress(b"0" * 100_000)
        assert len(bomb) < 1000
        r = c.put(_path(link["upload_url"]), content=bomb, headers={"Content-Encoding": "gzip"})
        assert r.status_code == 413
        assert c.put(_path(link["upload_url"]), content=b"x" * 1001).status_code == 413
        assert c.put(_path(link["upload_url"]), content=b"x" * 1000).status_code == 201  # exactly the cap
        assert not list((store.data_dir() / "uploads").glob("*.part"))
        assert "error" in _tool(c, url, "request_upload", filename="big.step", size_bytes=1001)


def test_links_are_signed_expire_and_open_nothing_else(monkeypatch):
    url = f"/mcp/{auth.mcp_token()}"
    with TestClient(server.app) as c:
        link = _tool(c, url, "request_upload", filename="part.json")
        s = urlsplit(link["upload_url"])
        args = parse_qs(s.query)
        put = lambda p: c.put(p, content=json.dumps(plate()).encode())
        assert put(s.path).status_code == 404                                          # no signature
        assert put(f"{s.path}?{urlencode({'expires': args['expires'][0], 'signature': 'a' * 64})}").status_code == 404
        later = urlencode({"expires": int(args["expires"][0]) + 3600, "signature": args["signature"][0]})
        assert put(f"{s.path}?{later}").status_code == 404                              # expiry is signed
        other = _tool(c, url, "request_upload", filename="part.json")
        swapped = urlunsplit(s._replace(path=urlsplit(other["upload_url"]).path))
        assert put(_path(swapped)).status_code == 404                                   # signature is per link
        assert c.put(f"/mcp/uploads/../{auth.mcp_token()}?{s.query}", content=b"x").status_code in (404, 405)
        assert c.post(f"/mcp/{args['signature'][0]}").status_code == 404                # not an MCP key
        assert c.get(_path(link["upload_url"])).status_code in (404, 405)               # nothing to read back
        monkeypatch.setattr(uploads.time, "time", lambda: link["expires_at"] + 1)
        late = put(_path(link["upload_url"]))
        assert late.status_code == 410 and "expired" in late.json()["error"]


def test_uploads_belong_to_one_account():
    owner, member = _setup_owner_and_member()
    m_url = "/mcp/" + member.get("/api/solidworks").json()["private_url"].split("/mcp/")[1]
    o_url = f"/mcp/{auth.mcp_token()}"
    member_user = member.get("/api/account").json()["user"]
    with TestClient(server.app) as c:
        link = _tool(c, m_url, "request_upload", filename="part.json")
        assert c.put(_path(link["upload_url"]), content=json.dumps(plate()).encode()).status_code == 201
        # the owner cannot take the member's upload, and is not told it exists
        assert "Unknown upload_id" in _take(link["upload_id"], owner.get("/api/account").json()["user"])
        assert _take(link["upload_id"], member_user) == json.dumps(plate()).encode()
        # a few open links per person, then a plain refusal
        for _ in range(uploads.MAX_PENDING - 1):
            assert "upload_id" in _tool(c, m_url, "request_upload", filename="a.step")
        assert "already have" in _tool(c, m_url, "request_upload", filename="a.step")["error"]
        assert "upload_id" in _tool(c, o_url, "request_upload", filename="a.step")  # the owner has their own
        assert "error" in _tool(c, m_url, "request_upload", filename="../a.step")


def test_expired_uploads_are_cleaned_up(tmp_path, monkeypatch):
    raw = _step_bytes(tmp_path)
    url = f"/mcp/{auth.mcp_token()}"
    with TestClient(server.app) as c:
        waiting = _tool(c, url, "request_upload", filename="a.step")
        sent = _tool(c, url, "request_upload", filename="b.step")
        assert c.put(_path(sent["upload_url"]), content=raw).status_code == 201
        now = uploads.time.time()
        monkeypatch.setattr(uploads.time, "time", lambda: now + uploads.KEEP + 1)
        assert "expired" in _take(sent["upload_id"])
        assert "expired" in _take(waiting["upload_id"])
        assert [p for p in (store.data_dir() / "uploads").iterdir() if p.name != ".lock"] == []
