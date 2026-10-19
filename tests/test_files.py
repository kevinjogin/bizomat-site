"""Files: each person's documents (owner), rename, duplicate, Trash, version restore, pictures (browser and
server-drawn), the light meta the poll reads, per-person connector addresses, and the installable-app files."""
import json
import struct
import zlib

import pytest
from fastapi.testclient import TestClient

from opensketch import auth, server, store
from tests.test_mcp import _rpc


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def _setup_owner_and_member():
    owner = TestClient(server.app)
    owner.post("/setup", data={"name": "YZ", "email": "yz@example.com", "new_password": "correct horse", "next": "/"})
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    member = TestClient(server.app)
    member.post(f"/join/{token}", data={"name": "Mei", "email": "mei@example.com", "new_password": "battery staple"})
    assert member.get("/api/account").json()["user"]["role"] == "member"
    return owner, member


def _block(name="Block"):
    from opensketch import demo
    return {"version": 1, "name": name, "units": "mm", "seq": 1000, "rollback": None, "features": demo.bracket_features()}


def _png(w=4, h=3):
    rows = b"".join(b"\x00" + b"\x10\x20\x30" * w for _ in range(h))
    chunk = lambda k, d: struct.pack(">I", len(d)) + k + d + struct.pack(">I", zlib.crc32(k + d))
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(rows)) + chunk(b"IEND", b"")


def test_each_person_sees_their_own_files():
    owner, member = _setup_owner_and_member()
    legacy = store.create("Made before accounts")  # no owner
    mine = owner.post("/api/docs", json={"name": "", "kind": "part"}).json()
    assert mine["name"] == "Part 1" and mine["owner"]  # the next free name
    assert owner.post("/api/docs", json={"name": "", "kind": "part"}).json()["name"] == "Part 2"
    theirs = member.post("/api/docs", json={"name": "Mei's bracket", "doc": _block()}).json()
    assert theirs["name"] == "Mei's bracket"
    names = lambda c: sorted(f["name"] for f in c.get("/api/docs").json())
    assert names(owner) == ["Made before accounts", "Part 1", "Part 2"]  # the owner also sees unowned files
    assert names(member) == ["Mei's bracket"]
    # the member cannot open, save, rename, delete or picture the owner's files (404, never 403)
    for c, doc_id in ((member, mine["id"]), (member, legacy["id"]), (owner, theirs["id"])):
        assert c.get(f"/api/docs/{doc_id}").status_code == 404
        assert c.get(f"/api/docs/{doc_id}/head").status_code == 404
        assert c.put(f"/api/docs/{doc_id}", json={"doc": _block()}).status_code == 404
        assert c.patch(f"/api/docs/{doc_id}", json={"name": "x"}).status_code == 404
        assert c.delete(f"/api/docs/{doc_id}").status_code == 404
        assert c.post(f"/api/docs/{doc_id}/duplicate", json={}).status_code == 404
        assert c.put(f"/api/docs/{doc_id}/thumb?version=1", content=_png(), headers={"Content-Type": "image/png"}).status_code == 404
    card = member.get("/api/docs").json()[0]
    assert card["kind"] == "part" and card["counts"]["features"] >= 1 and card["size"] > 0 and "doc" not in card


def test_rename_duplicate_trash_restore_purge_and_versions():
    c = TestClient(server.app)  # no accounts: everything is shared, as before
    rec = c.post("/api/docs", json={"name": "Block", "doc": _block()}).json()
    doc_id = rec["id"]
    r = c.patch(f"/api/docs/{doc_id}", json={"name": "  Base plate  "}).json()
    assert r["name"] == "Base plate" and r["version"] == 2
    assert c.patch(f"/api/docs/{doc_id}", json={"name": "  "}).status_code == 400
    assert c.get(f"/api/docs/{doc_id}").json()["doc"]["name"] == "Base plate"
    copy = c.post(f"/api/docs/{doc_id}/duplicate", json={}).json()
    assert copy["name"] == "Base plate copy" and copy["version"] == 1 and copy["id"] != doc_id
    # Trash: out of the list, into the Trash list, back, then gone for good
    assert c.delete(f"/api/docs/{copy['id']}?forever=1").status_code == 400  # not from the list in one step
    t = c.delete(f"/api/docs/{copy['id']}").json()
    assert t["deleted"]
    assert [f["id"] for f in c.get("/api/docs").json()] == [doc_id]
    assert [f["id"] for f in c.get("/api/docs?trash=1").json()] == [copy["id"]]
    assert c.get(f"/api/docs/{copy['id']}").status_code == 404  # a trashed file does not open
    assert c.post(f"/api/docs/{copy['id']}/restore").json()["deleted"] is None
    assert len(c.get("/api/docs").json()) == 2
    c.delete(f"/api/docs/{copy['id']}")
    assert c.delete(f"/api/docs/{copy['id']}?forever=1").json()["forever"]
    assert c.get("/api/docs?trash=1").json() == []
    assert not list((store.data_dir() / "docs").glob(f"{copy['id']}*"))
    # version history: restore v1 as a new version
    vs = c.get(f"/api/docs/{doc_id}/versions").json()
    assert [v["version"] for v in vs] == [1]
    back = c.post(f"/api/docs/{doc_id}/restore_version", json={"version": 1}).json()
    assert back["version"] == 3 and back["name"] == "Block"
    assert c.post(f"/api/docs/{doc_id}/restore_version", json={"version": 99}).status_code == 404


def test_trash_older_than_30_days_is_removed(monkeypatch):
    rec = store.create("Old")
    store.trash(rec["id"])
    m = store.meta(rec["id"])
    full = store.get(rec["id"])
    full["deleted"] = m["deleted"] - 31 * 86400
    store._save_files(full)
    assert store.listing(deleted=True) == []
    assert not store._path(rec["id"]).exists()


def test_poll_and_list_read_the_meta_not_the_model():
    rec = store.create("Block", _block())
    store.save(rec["id"], _block(), "claude", "Added a fillet", requests=[{"part": "screw"}])
    # a large model file is never parsed for the poll or the list once its meta exists
    p = store._path(rec["id"])
    real = p.read_text()
    p.write_text("{not json")
    try:
        h = store.head(rec["id"])
        assert h["version"] == 2 and h["by"] == "claude" and h["requests"] == 1
        assert store.listing()[0]["summary"] == "Added a fillet"
    finally:
        p.write_text(real)
    # documents saved before the meta file existed get one on first read
    store._meta_path(rec["id"]).unlink()
    assert store.meta(rec["id"])["version"] == 2 and store._meta_path(rec["id"]).exists()


def test_pictures_from_the_browser_and_drawn_on_the_server():
    c = TestClient(server.app)
    rec = c.post("/api/docs", json={"name": "Block", "doc": _block()}).json()
    doc_id = rec["id"]
    card = c.get("/api/docs").json()[0]
    assert card["thumb"] is None
    # no picture yet: the server draws one (transparent PNG) and keeps it
    r = c.get(f"/api/docs/{doc_id}/thumb")
    assert r.status_code == 200 and r.headers["content-type"] == "image/png" and r.content[:4] == b"\x89PNG"
    assert r.content[25] == 6  # colour type 6: RGBA
    card = c.get("/api/docs").json()[0]
    assert card["thumb"].startswith(f"/api/docs/{doc_id}/thumb?v=1-") and not card["thumb_stale"]
    # the browser's picture replaces it
    bad = c.put(f"/api/docs/{doc_id}/thumb?version=1", content=b"GIF89a....", headers={"Content-Type": "image/png"})
    assert bad.status_code == 400
    assert c.put(f"/api/docs/{doc_id}/thumb?version=1", content=b"x", headers={"Content-Type": "image/gif"}).status_code == 415
    assert c.put(f"/api/docs/{doc_id}/thumb?version=1", content=b"\x89PNG" + b"0" * (store.THUMB_MAX + 10),
                 headers={"Content-Type": "image/png"}).status_code == 413
    ok = c.put(f"/api/docs/{doc_id}/thumb?version=1", content=_png(), headers={"Content-Type": "image/png"}).json()
    assert ok["thumb"]["source"] == "browser"
    assert c.get(f"/api/docs/{doc_id}/thumb").content == _png()
    # you change the model: the browser's picture stays until the browser sends a new one
    store.save(doc_id, _block("Block 2"), "you", "Edited")
    assert c.get(f"/api/docs/{doc_id}/thumb").content == _png()
    # the AI changes it: the server draws the new version
    store.save(doc_id, _block("Block 3"), "claude", "AI change")
    redrawn = c.get(f"/api/docs/{doc_id}/thumb")
    assert redrawn.content != _png() and store.meta(doc_id)["thumb"] == dict(store.meta(doc_id)["thumb"], source="server", version=3)
    # an empty document has no picture
    empty = c.post("/api/docs", json={"name": "", "kind": "part"}).json()
    assert c.get(f"/api/docs/{empty['id']}/thumb").status_code == 404
    # a duplicate keeps the picture
    cp = c.post(f"/api/docs/{doc_id}/duplicate", json={}).json()
    assert cp["thumb"] and c.get(f"/api/docs/{cp['id']}/thumb").status_code == 200



def test_server_pictures_spare_the_server(monkeypatch):
    """Files visits must not redraw heavy models again and again (2026-10-19: the 19-part Lavilock assembly was
    redrawn on every visit and the Fly machine stopped answering): big models are left to the browser, and a model
    that failed to draw is not tried again until it changes."""
    from opensketch import preview
    calls = []

    def failing(*a, **k):
        calls.append(1)
        raise RuntimeError("cannot draw")
    monkeypatch.setattr(preview, "render_preview", failing)
    c = TestClient(server.app)
    doc_id = c.post("/api/docs", json={"name": "Block", "doc": _block()}).json()["id"]
    assert c.get(f"/api/docs/{doc_id}/thumb").status_code == 404 and len(calls) == 1
    assert c.get(f"/api/docs/{doc_id}/thumb").status_code == 404 and len(calls) == 1  # same version: not again
    store.save(doc_id, _block("Block 2"), "claude", "AI change")
    assert c.get(f"/api/docs/{doc_id}/thumb").status_code == 404 and len(calls) == 2  # changed: tried again
    # a big model (an imported STEP assembly) is never drawn on the server: the browser draws it when opened
    monkeypatch.setattr(server, "THUMB_SERVER_MAX", 10)
    big = c.post("/api/docs", json={"name": "Big", "doc": _block()}).json()["id"]
    assert c.get(f"/api/docs/{big}/thumb").status_code == 404 and len(calls) == 2
    assert c.put(f"/api/docs/{big}/thumb?version=1", content=_png(), headers={"Content-Type": "image/png"}).status_code == 200
    assert c.get(f"/api/docs/{big}/thumb").content == _png()


def test_connector_addresses_are_personal_and_scoped():
    owner, member = _setup_owner_and_member()
    owner_url = owner.get("/api/connect").json()["mcp_url"]
    member_info = member.get("/api/connect").json()
    assert owner_url.endswith(f"/mcp/{auth.mcp_token()}")  # the owner keeps the address from before accounts
    assert member_info["personal"] and not member_info["mcp_url"].endswith(auth.mcp_token())
    mine = owner.post("/api/docs", json={"name": "Owner part", "doc": _block()}).json()
    with TestClient(server.app) as c:
        def tools(url):
            return lambda name, args: json.loads(_rpc(c, url, "tools/call", {"name": name, "arguments": args})["content"][0]["text"])
        m_url = "/mcp/" + member_info["mcp_url"].split("/mcp/")[1]
        o_url = "/mcp/" + owner_url.split("/mcp/")[1]
        for u in (m_url, o_url):
            _rpc(c, u, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}})
        m, o = tools(m_url), tools(o_url)
        made = m("create_document", {"name": "Member part"})
        assert [d["name"] for d in m("list_documents", {})] == ["Member part"]
        assert sorted(d["name"] for d in o("list_documents", {})) == ["Owner part"]
        # the member's connector cannot read or change the owner's file
        txt = _rpc(c, m_url, "tools/call", {"name": "get_document", "arguments": {"doc_id": mine["id"]}})["content"][0]["text"]
        assert "No document" in txt
        txt = _rpc(c, m_url, "tools/call", {"name": "undo_last_change", "arguments": {"doc_id": mine["id"]}})["content"][0]["text"]
        assert "Cannot undo" in txt
        # what the member's AI made is in the member's Files, not the owner's
        assert [f["name"] for f in member.get("/api/docs").json()] == ["Member part"]
        assert "Member part" not in [f["name"] for f in owner.get("/api/docs").json()]
        assert store.meta(made["doc_id"])["owner"] == member.get("/api/account").json()["user"]["id"]
        assert c.post("/mcp/not-a-token", json={}).status_code == 404


def test_installable_app_files_are_public_and_versioned():
    owner, _ = _setup_owner_and_member()
    anon = TestClient(server.app)
    m = anon.get("/manifest.webmanifest")
    assert m.status_code == 200 and m.headers["content-type"].startswith("application/manifest+json")
    man = m.json()
    assert man["display"] == "standalone" and man["start_url"].startswith("/") and any(i["purpose"] == "maskable" for i in man["icons"])
    for i in man["icons"]:
        assert anon.get(i["src"]).status_code == 200
    sw = anon.get("/sw.js")
    assert sw.status_code == 200 and "javascript" in sw.headers["content-type"] and server.VERSION in sw.text
    assert "__ASSETS__" not in sw.text and "/js/app.js" in sw.text and "/api/" not in sw.text.split("const ASSETS")[1].split(";")[0]
    assert anon.get("/favicon.svg").status_code == 200
    assert anon.get("/css/app.css", follow_redirects=False).status_code == 303  # the app itself still needs sign-in
    js = owner.get("/js/app.js")
    assert js.headers["cache-control"] == "no-cache"
    # a shared review page is not offered as the installable app
    from opensketch import review
    assert "manifest" not in review.viewer_page("x" * 32, server.STATIC)


def test_history_is_capped_by_size(monkeypatch):
    monkeypatch.setattr(store, "HISTORY_MAX", 3000)
    rec = store.create("Big", {"version": 1, "features": [], "name": "Big", "blob": "x" * 1000})
    for i in range(12):
        store.save(rec["id"], {"version": 1, "features": [], "name": "Big", "blob": "y" * 1000 + str(i)}, "you")
    assert [v["version"] for v in store.versions(rec["id"])] == [12, 11]  # as many as fit in HISTORY_MAX
    monkeypatch.setattr(store, "HISTORY_MAX", 10)
    store.save(rec["id"], {"version": 1, "features": [], "name": "Big", "blob": "z"}, "you")
    assert [v["version"] for v in store.versions(rec["id"])] == [13]  # the newest is always kept
    monkeypatch.setattr(store, "HISTORY_MAX", 10**9)
    monkeypatch.setattr(store, "KEEP", 3)
    for i in range(5):
        store.save(rec["id"], {"version": 1, "features": [], "name": "Big", "n": i}, "claude")
    assert [v["version"] for v in store.versions(rec["id"])] == [18, 17, 16]  # and at most KEEP
