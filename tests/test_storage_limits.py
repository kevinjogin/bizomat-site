"""Storage that holds up: a malformed or damaged document never breaks anyone's Files, lock files only for documents
that exist, request bodies capped before anything reads them, history without identical or autosave-by-autosave
versions, imported geometry stored once, disk / document / account limits, per-person indexes, per-person download
and upload room, review links that go with their file, and files of removed accounts handed to the owner."""
import base64
import gzip
import json
import os
import shutil
import time
from collections import namedtuple

import pytest
from fastapi.testclient import TestClient

from opensketch import accounts, artifacts, auth, review, server, store, uploads
from tests.test_files import _block, _setup_owner_and_member
from tests.test_mcp import _rpc


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "http://testserver")
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def _imported(name="Imported", n=200_000, seed="A"):
    """A part with an import feature holding n characters of (fake) BREP data."""
    data = base64.b64encode((seed * n).encode())[:n].decode()
    return {"version": 1, "type": "part", "name": name, "units": "mm", "rollback": None, "seq": 10,
            "features": [{"id": "imp1", "type": "import", "name": "Imported1", "data": data}]}


def _docs():
    return store.data_dir() / "docs"


def test_a_malformed_document_is_refused_and_never_breaks_the_list():
    owner, member = _setup_owner_and_member()
    # the browser routes check the structure, as MCP imports do: nothing is stored
    for bad in ({"type": "part", "features": [None]}, {"type": "part", "features": [1]}, {"type": "assembly", "parts": []}):
        r = member.post("/api/docs", json={"name": "Bad", "doc": bad})
        assert r.status_code == 400 and "not a document" in r.json()["error"]
    assert member.get("/api/docs").json() == []
    ok = member.post("/api/docs", json={"name": "Good", "doc": _block()}).json()
    r = member.put(f"/api/docs/{ok['id']}", json={"doc": {"type": "part", "features": [None]}, "base_version": 1})
    assert r.status_code == 400 and store.get(ok["id"])["version"] == 1
    # a malformed model that got in anyway (an old file, a hand edit) still lists, for everyone
    rec = store.create("Odd", {"type": "part", "features": [1, None, "x"]}, owner="mallory")
    store._meta_path(rec["id"]).unlink()
    assert member.get("/api/docs").status_code == 200
    # a record nobody can read at all is left out of every listing (logged), never a 500
    (_docs() / "deadbeef0001.json").write_text("{not json")
    for c in (owner, member):
        assert c.get("/api/docs").status_code == 200
        assert c.get("/api/docs?trash=1").status_code == 200
        assert c.post("/api/docs", json={"name": "", "kind": "part"}).status_code == 200  # New part
    assert [m["id"] for m in store.listing() if m["id"] == "deadbeef0001"] == []
    with TestClient(server.app) as c:  # list_documents over MCP too (the owner's connector)
        listed = json.loads(_rpc(c, f"/mcp/{auth.mcp_token()}", "tools/call", {"name": "list_documents", "arguments": {}})["content"][0]["text"])
        assert isinstance(listed, list)


def test_a_damaged_record_comes_back_from_its_newest_kept_version():
    c = TestClient(server.app)
    rec = c.post("/api/docs", json={"name": "Plate", "doc": _block("Plate")}).json()
    doc_id = rec["id"]
    store.save(doc_id, _block("Plate v2"), "claude", "AI change")
    store.save(doc_id, _block("Plate v3"), "claude", "AI change 2")
    p = store._path(doc_id)
    p.write_bytes(p.read_bytes()[:40])  # a crash mid-write, or a hand edit
    got = c.get(f"/api/docs/{doc_id}")
    assert got.status_code == 200
    body = got.json()
    assert body["doc"]["name"] == "Plate v2" and body["version"] == 3 and body["recovered"]["from_version"] == 2
    assert c.get(f"/api/docs/{doc_id}/head").json()["version"] == 3
    assert c.get(f"/api/docs/{doc_id}/versions").status_code == 200
    # restoring works (it used to fail on the damaged record every time), and writes the record again
    back = c.post(f"/api/docs/{doc_id}/restore_version", json={"version": 1})
    assert back.status_code == 200 and back.json()["version"] == 4
    assert store.get(doc_id)["doc"]["name"] == "Plate" and "recovered" not in store.get(doc_id)
    assert p.with_suffix(".damaged").exists()  # the damaged file is kept beside it
    # saving over a damaged record works the same way
    p.write_text("garbage")
    r = c.put(f"/api/docs/{doc_id}", json={"doc": _block("Plate v5"), "base_version": 4, "summary": "Mine"})
    assert r.status_code == 200 and r.json()["version"] == 5
    # with nothing kept to come back from: a plain message, and the list still loads
    lone = c.post("/api/docs", json={"name": "Lone", "doc": _block("Lone")}).json()
    store._path(lone["id"]).write_text("{")
    r = c.get(f"/api/docs/{lone['id']}")
    assert r.status_code == 422 and "damaged" in r.json()["error"]
    assert c.get("/api/docs").status_code == 200


def test_made_up_document_ids_leave_nothing_behind():
    owner, member = _setup_owner_and_member()
    before = set(os.listdir(_docs()))
    for i in range(50):
        assert member.get(f"/api/docs/nosuch{i:04d}/head").status_code == 404
        assert member.get(f"/api/docs/nosuch{i:04d}/versions").status_code == 404
        assert member.put(f"/api/docs/nosuch{i:04d}", json={"doc": _block()}).status_code == 404
    assert set(os.listdir(_docs())) == before
    assert not [k for k in store._locks if k.startswith("nosuch")]
    with pytest.raises(store.NotFound):
        store.meta("nosuch9999")
    assert not (_docs() / "nosuch9999.lock").exists()


def test_request_bodies_are_capped_before_anything_reads_them(monkeypatch):
    c = TestClient(server.app)
    # public OAuth: a big body is refused from its Content-Length, unread
    r = c.post("/oauth/register", content=b"x" * (server.BODY_SMALL + 1), headers={"Content-Type": "application/json"})
    assert r.status_code == 413 and "too big" in r.json()["error"]
    r = c.post("/oauth/token", content=b"a=" + b"x" * (server.BODY_SMALL + 10),
               headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert r.status_code == 413

    def chunks(n, size=16384):  # no Content-Length: counted as it arrives
        for _ in range(n):
            yield b"x" * size
    r = c.post("/oauth/token", content=chunks(10), headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert r.status_code == 413
    r = c.post("/login", content=chunks(10), headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert r.status_code == 413
    # a small OAuth body still gets its normal answer
    assert c.post("/oauth/token", data={"grant_type": "nope"}).status_code in (400, 401)
    # API routes: a document's worth (BODY_MAX), here made small
    monkeypatch.setattr(server, "BODY_MAX", 2000)
    rec = store.create("Plate", _block())
    r = c.put(f"/api/docs/{rec['id']}", json={"doc": dict(_block(), pad="y" * 3000)})
    assert r.status_code == 413
    r = c.post("/api/regen", content=chunks(1, 4000), headers={"Content-Type": "application/json"})
    assert r.status_code == 413
    # uploads keep their own, larger streamed caps
    raw = b"ISO-10303-21;" + b"x" * 5000
    r = c.post("/api/import/raw?filename=a.step", content=gzip.compress(raw), headers={"X-OpenSketch-Gzip": "1"})
    assert r.status_code != 413


def test_identical_saves_make_no_version_and_a_retry_is_not_a_conflict():
    c = TestClient(server.app)
    rec = c.post("/api/docs", json={"name": "Plate", "doc": _block("Plate")}).json()
    doc_id = rec["id"]
    r = c.put(f"/api/docs/{doc_id}", json={"doc": _block("Plate"), "base_version": 1})
    assert r.status_code == 200 and r.json()["version"] == 1  # nothing changed: no new version
    r = c.put(f"/api/docs/{doc_id}", json={"doc": _block("Plate 2"), "base_version": 1})
    assert r.json() == {k: r.json()[k] for k in server.SAVED_KEYS} and r.json()["version"] == 2  # no model sent back
    retry = c.put(f"/api/docs/{doc_id}", json={"doc": _block("Plate 2"), "base_version": 1})
    assert retry.status_code == 200 and retry.json()["version"] == 2  # the same save again: not a conflict
    stale = c.put(f"/api/docs/{doc_id}", json={"doc": _block("Plate 3"), "base_version": 1})
    assert stale.status_code == 409
    assert stale.json()["current"] == {k: stale.json()["current"][k] for k in server.SAVED_KEYS}  # the head only
    assert c.patch(f"/api/docs/{doc_id}", json={"name": "Plate 2"}).json()["version"] == 2  # same name: no version


def test_autosaves_in_one_run_keep_one_version(monkeypatch):
    clock = [1_000_000.0]
    monkeypatch.setattr(store.time, "time", lambda: clock[0])
    rec = store.create("Plate", _block("Plate"))
    doc_id = rec["id"]
    store.save(doc_id, _block("AI"), "claude", "AI built it")  # v2: keeps v1
    for i in range(30):  # a run of editing: 30 autosaves a few seconds apart
        clock[0] += 5
        store.save(doc_id, _block(f"edit {i}"), "you", "Edited in OpenSketch", autosave=True)
    assert store.get(doc_id)["version"] == 32
    assert [v["version"] for v in store.versions(doc_id)] == [2, 1]  # the AI's version stays; the run keeps none yet
    clock[0] += store.AUTOSAVE_RUN  # ten minutes later the run is over: its last state is kept
    store.save(doc_id, _block("later"), "you", "Edited in OpenSketch", autosave=True)
    assert [v["version"] for v in store.versions(doc_id)] == [32, 2, 1]
    # an explicit change (AI, restore, rename) always keeps what was there
    store.save(doc_id, _block("AI again"), "claude", "AI change")
    assert [v["version"] for v in store.versions(doc_id)][:2] == [33, 32]
    clock[0] += 1
    store.save(doc_id, _block("mine"), "you", "Edited in OpenSketch", autosave=True)  # after the AI: kept too
    assert [v["version"] for v in store.versions(doc_id)][0] == 34
    # undo goes to the newest kept version (version numbers skip what autosaves merged)
    u = store.undo(doc_id, "claude")
    assert u["doc"]["name"] == "AI again" and u["summary"].startswith("Undid")


def test_version_list_reads_its_index_not_the_versions():
    rec = store.create("Plate", _block("Plate"))
    for i in range(3):
        store.save(rec["id"], _block(f"v{i}"), "claude", f"Change {i}")
    (store._hist_dir(rec["id"]) / "v2.json").write_text("{this would not parse")
    vs = store.versions(rec["id"])
    assert [v["version"] for v in vs] == [3, 2, 1] and vs[1]["summary"] == "Change 0"
    # versions kept before the index existed are read once and indexed
    (store._hist_dir(rec["id"]) / "versions.json").unlink()
    assert [v["version"] for v in store.versions(rec["id"])] == [3, 1]  # the damaged one cannot be described
    assert (store._hist_dir(rec["id"]) / "versions.json").exists()


def test_imported_geometry_is_stored_once_for_every_version():
    doc = _imported()
    data = doc["features"][0]["data"]
    rec = store.create("Imported", doc)
    doc_id = rec["id"]
    for i in range(5):
        d = _imported()
        d["features"].append({"id": f"s{i}", "type": "sketch", "entities": [], "constraints": []})
        store.save(doc_id, d, "claude", f"Change {i}")
    assert store._path(doc_id).stat().st_size < 5000  # the record holds a reference, not 200 KB
    blobs = list(store._blob_dir(doc_id).iterdir())
    assert len(blobs) == 1 and blobs[0].stat().st_size == len(data)
    assert all(p.stat().st_size < 5000 for p in store._hist_dir(doc_id).glob("v*.json"))
    assert store.get(doc_id)["doc"]["features"][0]["data"] == data
    assert store.get_version(doc_id, 1)["doc"]["features"][0]["data"] == data
    m = store.meta(doc_id)
    assert m["size"] > len(data) and m["counts"]["imported"]  # the Files list shows the model's real size
    # restore and duplicate carry the data
    store.restore(doc_id, 1, "you")
    assert store.get(doc_id)["doc"]["features"][0]["data"] == data
    cp = store.duplicate(doc_id, None)
    assert store.get(cp["id"])["doc"]["features"][0]["data"] == data
    # data nothing refers to any more goes when its last version goes
    other = _imported(seed="B")
    store.save(doc_id, other, "claude", "Re-imported")
    import opensketch.store as st
    old_keep = st.KEEP
    try:
        st.KEEP = 1
        store.save(doc_id, dict(other, name="x"), "claude", "Renamed")
    finally:
        st.KEEP = old_keep
    assert len(list(store._blob_dir(doc_id).iterdir())) == 1
    # records written before blobs existed (data inline) still load and save
    old = store.create("Old", _imported(seed="C"))
    full = dict(store.get(old["id"]))
    store._path(old["id"]).write_text(json.dumps(full))
    shutil.rmtree(store._hist_dir(old["id"]), ignore_errors=True)
    assert store.get(old["id"]) == full
    assert store.save(old["id"], dict(full["doc"], name="Old 2"), "you", "Edited")["version"] == 2
    store.purge(doc_id)
    assert not store._hist_dir(doc_id).exists()


def test_document_size_account_quota_and_disk_reserve(monkeypatch):
    owner, member = _setup_owner_and_member()
    monkeypatch.setattr(store, "DOC_MAX", 3000)
    r = member.post("/api/docs", json={"name": "Big", "doc": dict(_block(), pad="x" * 5000)})
    assert r.status_code == 413 and "too big" in r.json()["error"]
    monkeypatch.setattr(store, "DOC_MAX", 64 * 2**20)
    # a member's Files have a limit; the server owner's do not
    size = len(json.dumps(_block()))
    monkeypatch.setattr(store, "QUOTA", int(size * 3.5))
    a = member.post("/api/docs", json={"name": "A", "doc": _block("A")}).json()
    store.save(a["id"], _block("A2"), "claude", "AI change")  # A and its version 1: two of the 3.5 allowed
    member.post("/api/docs", json={"name": "B", "doc": _block("B")})
    r = member.post("/api/docs", json={"name": "C", "doc": _block("C")})
    assert r.status_code == 507 and "Your Files are full" in r.json()["error"]
    for i in range(5):
        assert owner.post("/api/docs", json={"name": f"O{i}", "doc": _block(f"O{i}")}).status_code == 200
    # older versions of a file make room for its next save before anything is refused
    assert member.put(f"/api/docs/{a['id']}", json={"doc": _block("A3"), "summary": "Mine"}).status_code == 200
    assert [v["version"] for v in store.versions(a["id"])] == [2]
    # the number of files is limited too
    monkeypatch.setattr(store, "QUOTA", 10**9)
    monkeypatch.setattr(store, "MAX_DOCS", 2)
    r = member.post("/api/docs", json={"name": "", "kind": "part"})
    assert r.status_code == 507 and "files" in r.json()["error"]
    monkeypatch.setattr(store, "MAX_DOCS", 1000)
    # the disk nearly full: document writes stop with a plain message, sign-in still works
    Usage = namedtuple("Usage", "total used free")
    monkeypatch.setattr(store.shutil, "disk_usage", lambda p: Usage(10**9, 10**9 - 2**20, 2**20))
    r = owner.put(f"/api/docs/{a['id']}", json={"doc": _block("A4"), "summary": "x"})
    assert r.status_code == 404  # not the owner's file
    r = member.put(f"/api/docs/{a['id']}", json={"doc": _block("A4"), "summary": "x"})
    assert r.status_code == 507 and "disk is nearly full" in r.json()["error"]
    again = TestClient(server.app)
    assert again.post("/login", data={"email": "mei@example.com", "password": "battery staple", "next": "/"},
                      follow_redirects=False).status_code in (302, 303)
    assert again.get("/api/docs").status_code == 200
    assert store.get(a["id"])["doc"]["name"] == "A3"  # nothing half-written


def test_listing_reads_only_the_persons_own_documents(monkeypatch):
    owner, member = _setup_owner_and_member()
    mei = member.get("/api/account").json()["user"]["id"]
    for i in range(30):
        store.create(f"Someone else {i}", owner="someone")
    mine = [member.post("/api/docs", json={"name": f"Mine {i}", "doc": _block(f"Mine {i}")}).json()["id"] for i in range(3)]
    read = []
    real = store._read_meta
    monkeypatch.setattr(store, "_read_meta", lambda doc_id: (read.append(doc_id), real(doc_id))[1])
    assert sorted(f["id"] for f in member.get("/api/docs").json()) == sorted(mine)
    assert set(read) <= set(mine)
    # an index from before (or a damaged one) is rebuilt from the documents
    (store._owners_dir() / f"{mei}.json").write_text("{nope")
    assert sorted(f["id"] for f in member.get("/api/docs").json()) == sorted(mine)
    shutil.rmtree(store._owners_dir())
    store._index_ready.clear()
    assert sorted(f["id"] for f in member.get("/api/docs").json()) == sorted(mine)
    assert len(owner.get("/api/docs").json()) == 0


def test_an_untouched_new_file_can_be_discarded():
    c = TestClient(server.app)
    new = c.post("/api/docs", json={"name": "", "kind": "part"}).json()
    named = c.post("/api/docs", json={"name": "Bracket", "kind": "part"}).json()
    used = c.post("/api/docs", json={"name": "", "kind": "part"}).json()
    store.save(used["id"], dict(_block(), name=used["name"]), "you", "Edited")
    assert c.delete(f"/api/docs/{new['id']}?untouched=1").json() == {"deleted": new["id"], "forever": True}
    assert c.delete(f"/api/docs/{named['id']}?untouched=1").json() == {"kept": True}
    assert c.delete(f"/api/docs/{used['id']}?untouched=1").json() == {"kept": True}
    assert sorted(f["name"] for f in c.get("/api/docs").json()) == ["Bracket", used["name"]]
