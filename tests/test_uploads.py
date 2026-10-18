"""One-time upload links: request_upload -> PUT the file -> import_document(upload_id), over real MCP calls."""
import base64
import gzip
import hashlib
import json
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

import pytest
from fastapi.testclient import TestClient

from opensketch import auth, geometry, mcp_server, server, store, uploads
from tests.test_assembly import plate
from tests.test_files import _setup_owner_and_member
from tests.test_mcp import _rpc


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "http://testserver")
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def _tool(client, url, tool, **arguments):
    result = _rpc(client, url, "tools/call", {"name": tool, "arguments": arguments})
    assert not result.get("isError"), result
    return json.loads(result["content"][0]["text"])


def _step_bytes(tmp_path) -> bytes:
    path = tmp_path / "plate.step"
    geometry.export(plate(), "step", str(path))
    return path.read_bytes()


def _path(url: str) -> str:
    s = urlsplit(url)
    return f"{s.path}?{s.query}"


def test_upload_then_import_without_base64(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "secret")  # the site is signed-in; the link alone is the key
    raw = _step_bytes(tmp_path)
    url = f"/mcp/{auth.mcp_token()}"
    with TestClient(server.app) as c:
        tools = {t["name"]: t for t in _rpc(c, url, "tools/list")["tools"]}
        assert "request_upload" in tools and "upload_id" in tools["import_document"]["inputSchema"]["properties"]
        assert "filename" not in tools["import_document"]["inputSchema"].get("required", [])
        link = _tool(c, url, "request_upload", filename="plate.step", size_bytes=len(raw))
        assert link["method"] == "PUT" and link["max_bytes"] == 32 * 2**20 and link["expires_in_seconds"] == 600
        assert auth.mcp_token() not in link["upload_url"] and link["upload_url"].startswith("http://testserver/mcp/uploads/")
        assert link["how"].startswith("curl -sS -T 'plate.step' 'http://testserver/mcp/uploads/")
        # nothing sent yet: import says so and the link stays usable
        early = _tool(c, url, "import_document", upload_id=link["upload_id"])
        assert "Nothing has been sent" in early["error"]
        r = c.put(_path(link["upload_url"]), content=raw)
        assert r.status_code == 201, r.text
        assert r.json()["sha256"] == hashlib.sha256(raw).hexdigest() and r.json()["size_bytes"] == len(raw)
        assert r.headers["cache-control"] == "no-store"
        # one upload per link
        again = c.put(_path(link["upload_url"]), content=b"other")
        assert again.status_code == 409 and "already used" in again.json()["error"]
        # a client with the old tool list (filename and data required) sends data "" beside the upload_id
        out = _tool(c, url, "import_document", filename="plate.step", data="", upload_id=link["upload_id"],
                    name="Uploaded plate")
        assert out["name"] == "Uploaded plate" and out["report"]["size_bytes"] == len(raw)
        assert out["report"]["source_filename"] == "plate.step" and out["report"]["upload_id"] == link["upload_id"]
        assert store.get(out["doc_id"])["doc"]["features"][0]["type"] == "import"
        assert not list((store.data_dir() / "uploads").glob("*.bin"))  # bytes freed after the import
        second = _tool(c, url, "import_document", upload_id=link["upload_id"])
        assert out["doc_id"] in second["error"] and len(store.listing()) == 1
        # the base64 route still works for small files
        small = _tool(c, url, "import_document", filename="copy.osk",
                      data=base64.b64encode(json.dumps(plate()).encode()).decode())
        assert small["doc_id"] != out["doc_id"]
        both = _tool(c, url, "import_document", filename="x.osk", data="e30=", upload_id=link["upload_id"])
        assert "either data" in both["error"]
        assert "either data" in _tool(c, url, "import_document", filename="x.osk")["error"]


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
        assert _tool(c, url, "import_document", upload_id=link["upload_id"])["doc_id"]
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
        link = _tool(c, url, "request_upload", filename="part.osk")
        s = urlsplit(link["upload_url"])
        args = parse_qs(s.query)
        put = lambda p: c.put(p, content=json.dumps(plate()).encode())
        assert put(s.path).status_code == 404                                          # no signature
        assert put(f"{s.path}?{urlencode({'expires': args['expires'][0], 'signature': 'a' * 64})}").status_code == 404
        later = urlencode({"expires": int(args["expires"][0]) + 3600, "signature": args["signature"][0]})
        assert put(f"{s.path}?{later}").status_code == 404                              # expiry is signed
        other = _tool(c, url, "request_upload", filename="part.osk")
        swapped = urlunsplit(s._replace(path=urlsplit(other["upload_url"]).path))
        assert put(_path(swapped)).status_code == 404                                   # signature is per link
        assert c.put(f"/mcp/uploads/../{auth.mcp_token()}?{s.query}", content=b"x").status_code in (404, 405)
        assert c.post(f"/mcp/{args['signature'][0]}").status_code == 404                # not an MCP key
        assert c.get(_path(link["upload_url"])).status_code in (404, 405)               # nothing to read back
        with monkeypatch.context() as scoped:  # a new server password voids open links
            scoped.setenv("OPENSKETCH_PASSWORD", "new password")
            assert put(_path(link["upload_url"])).status_code == 404
        monkeypatch.setattr(uploads.time, "time", lambda: link["expires_at"] + 1)
        late = put(_path(link["upload_url"]))
        assert late.status_code == 410 and "expired" in late.json()["error"]


def test_uploads_belong_to_one_account():
    owner, member = _setup_owner_and_member()
    m_url = "/mcp/" + member.get("/api/connect").json()["mcp_url"].split("/mcp/")[1]
    o_url = f"/mcp/{auth.mcp_token()}"
    with TestClient(server.app) as c:
        link = _tool(c, m_url, "request_upload", filename="part.osk")
        assert c.put(_path(link["upload_url"]), content=json.dumps(plate()).encode()).status_code == 201
        # the owner's connector cannot import the member's upload, and is not told it exists
        stolen = _tool(c, o_url, "import_document", upload_id=link["upload_id"])
        assert "Unknown upload_id" in stolen["error"] and store.listing() == []
        mine = _tool(c, m_url, "import_document", upload_id=link["upload_id"])
        assert store.meta(mine["doc_id"])["owner"] == member.get("/api/account").json()["user"]["id"]
        assert [f["name"] for f in member.get("/api/docs").json()] == ["Plate"]
        # a few open links per person, then a plain refusal
        for _ in range(uploads.MAX_PENDING):
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
        gone = _tool(c, url, "import_document", upload_id=sent["upload_id"])
        assert "expired" in gone["error"]
        assert "expired" in _tool(c, url, "import_document", upload_id=waiting["upload_id"])["error"]
        assert list((store.data_dir() / "uploads").iterdir()) == []
