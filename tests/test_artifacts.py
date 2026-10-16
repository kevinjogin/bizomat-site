"""Background file operations: real MCP calls, immutable downloads and scoped access."""
import base64
import hashlib
import json
import struct
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

import pytest
from build123d import import_step
from fastapi.testclient import TestClient

from opensketch import artifacts, auth, geometry, importer, mcp_server, server, store
from tests.test_assembly import asm_doc, plate
from tests.test_mcp import _rpc


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "http://testserver")
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def _call(client, tool_name, **arguments):
    result = _rpc(client, f"/mcp/{auth.mcp_token()}", "tools/call", {"name": tool_name, "arguments": arguments})
    assert not result.get("isError"), result
    return json.loads(result["content"][0]["text"])


def test_mcp_export_immutable_source_without_browser(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "secret")
    rec = store.create("Plate", doc=plate())
    with TestClient(server.app) as client:
        names = {t["name"] for t in _rpc(client, f"/mcp/{auth.mcp_token()}", "tools/list")["tools"]}
        assert {"export_document", "preview_document", "import_document"} <= names
        result = _call(client, "export_document", doc_id=rec["id"], format="osk")
        assert result["version"] == 1 and result["filename"] == "Plate_v1.osk"
        assert auth.mcp_token() not in result["download_url"]
        assert client.get(f"/api/docs/{rec['id']}").status_code == 401
        downloaded = client.get(result["download_url"])
        assert downloaded.status_code == 200
        assert downloaded.json() == rec["doc"]
        assert downloaded.headers["cache-control"] == "no-store"
        assert hashlib.sha256(downloaded.content).hexdigest() == result["sha256"]
        assert store.get(rec["id"]) == rec  # a read does not create a document version
        store.save(rec["id"], dict(rec["doc"], name="Changed"), "you")
        assert client.get(result["download_url"]).content == downloaded.content


def test_scoped_download_rejects_tampering_expiry_and_password_rotation(monkeypatch):
    rec = store.create("Plate", doc=plate())
    result = artifacts.export_record(rec, "osk")
    client = TestClient(server.app)
    url = urlsplit(result["download_url"])
    assert client.get(url.path).status_code == 404
    assert client.get(result["download_url"].replace("Plate_v1.osk", "Other.osk")).status_code == 404
    unicode_signature = urlunsplit(url._replace(query=urlencode({"expires": result["expires_at"], "signature": "é" * 64})))
    assert client.get(unicode_signature).status_code == 404
    args = parse_qs(url.query)
    args["expires"] = [str(result["expires_at"] + 3600)]
    tampered = urlunsplit(url._replace(query=urlencode(args, doseq=True)))
    assert client.get(tampered).status_code == 404
    assert client.get(f"/mcp/artifacts/not-an-id/{result['filename']}?{url.query}").status_code == 404
    assert client.get(f"/mcp/artifacts/{result['artifact_id']}/%2Fetc%2Fpasswd?{url.query}").status_code == 404
    # An artifact signature does not authorize any document operation or the MCP endpoint.
    signature = parse_qs(url.query)["signature"][0]
    assert client.post(f"/mcp/{signature}").status_code == 404
    with monkeypatch.context() as scoped:
        scoped.setenv("OPENSKETCH_PASSWORD", "new password")
        assert client.get(result["download_url"]).status_code == 404
    monkeypatch.setattr(artifacts.time, "time", lambda: result["expires_at"] + 1)
    assert client.get(result["download_url"]).status_code == 404


def test_step_and_stl_export_part_local_coordinates(tmp_path):
    doc = asm_doc()
    rec = store.create("Fixture", doc=doc)
    before = store.get(rec["id"])
    with TestClient(server.app) as client:
        result = _call(client, "export_document", doc_id=rec["id"], format="step", part_id="pin")
        assert result["clean"] and result["part_id"] == "pin"
        raw = client.get(result["download_url"]).content
        path = tmp_path / "pin.step"
        path.write_bytes(raw)
        imported = import_step(path)
        bb = imported.bounding_box()
        assert geometry.vlist(bb.min) == pytest.approx([-5, 0, -5])
        assert geometry.vlist(bb.max) == pytest.approx([5, 40, 5])
        result = _call(client, "export_document", doc_id=rec["id"], format="stl", part_id="pin")
        raw = client.get(result["download_url"]).content
        assert len(raw) > 84 and len(raw) == 84 + struct.unpack("<I", raw[80:84])[0] * 50
        assert store.get(rec["id"]) == before


def test_failed_features_and_mates_never_export_partial_solids():
    bad = plate()
    bad["features"].append({"id": "bad", "type": "extrude", "sketch": "missing", "depth": 3})
    rec = store.create("Broken", doc=bad)
    with pytest.raises(artifacts.ArtifactError, match="rebuild errors.*bad"):
        artifacts.export_record(rec, "step")
    assert artifacts.export_record(rec, "osk")["format"] == "osk"  # recoverable source backup
    asm = asm_doc()
    asm["parts"]["plate"] = bad
    with pytest.raises(artifacts.ArtifactError, match="plate/bad"):
        artifacts.export_record(store.create("Broken assembly", doc=asm), "stl")
    asm = asm_doc()
    asm["components"][1]["part"] = "missing"
    with pytest.raises(artifacts.ArtifactError, match="Missing part"):
        artifacts.export_record(store.create("Missing", doc=asm), "step")
    asm = asm_doc()
    asm["components"][1]["fixed"] = True  # fixed at the wrong pose, so both mates conflict
    with pytest.raises(artifacts.ArtifactError, match="Mate"):
        artifacts.export_record(store.create("Conflicting", doc=asm), "step")


def test_export_validation():
    rec = store.create("Plate", doc=plate())
    with pytest.raises(artifacts.ArtifactError, match="osk, step or stl"):
        artifacts.export_record(rec, "../../anything")
    with pytest.raises(artifacts.ArtifactError, match="only valid for an assembly"):
        artifacts.export_record(rec, "osk", "plate")
    asm = store.create("Assembly", doc=asm_doc())
    with pytest.raises(artifacts.ArtifactError, match="No part"):
        artifacts.export_record(asm, "osk", "../plate")
    with pytest.raises(artifacts.ArtifactError, match="No part"):
        artifacts.export_record(asm, "osk", "absent")
    with pytest.raises(artifacts.ArtifactError, match="No solid body"):
        artifacts.export_record(store.create("Empty"), "step")


def test_artifact_names_quota_and_expired_cleanup(monkeypatch):
    rec = store.create("../../unsafe\r\nname", doc=plate())
    result = artifacts.export_record(rec, "osk")
    assert result["filename"] == "unsafe_name_v1.osk"
    monkeypatch.setattr(artifacts, "MAX_ARTIFACTS", 1)
    with pytest.raises(artifacts.ArtifactError, match="store is full"):
        artifacts.export_record(rec, "osk")
    monkeypatch.setattr(artifacts.time, "time", lambda: result["expires_at"] + 301)
    next_result = artifacts.export_record(rec, "osk")
    assert next_result["artifact_id"] != result["artifact_id"]
    assert len(list((store.data_dir() / "artifacts").glob("*.bin"))) == 1
    monkeypatch.setattr(artifacts, "MAX_ARTIFACT_BYTES", 1)
    with pytest.raises(artifacts.ArtifactError, match="download limit"):
        artifacts.export_record(rec, "osk")


def test_mcp_import_native_and_step_new_documents(tmp_path):
    rec = store.create("Original", doc=plate())
    path = tmp_path / "source.step"
    geometry.export(plate(), "step", str(path))
    with TestClient(server.app) as client:
        imported = _call(client, "import_document", filename="original.osk",
                         data=base64.b64encode(json.dumps(rec["doc"]).encode()).decode(), name="Copy")
        assert imported["doc_id"] != rec["id"] and imported["name"] == "Copy" and imported["version"] == 1
        result = _call(client, "import_document", filename="plate.step", data=base64.b64encode(path.read_bytes()).decode())
        assert result["doc_id"] not in (rec["id"], imported["doc_id"])
        assert store.get(result["doc_id"])["doc"]["features"][0]["type"] == "import"
        assert store.get(rec["id"]) == rec


@pytest.mark.parametrize("filename,raw", [("../part.osk", "e30="), ("part.osk", "not base64"),
                                         ("part.osk", "W10="), ("part.osk", "e30="), ("part.osk", "")])
def test_mcp_import_rejects_invalid_without_creating_document(filename, raw):
    with TestClient(server.app) as client:
        result = _call(client, "import_document", filename=filename, data=raw)
        assert "error" in result
        assert store.listing() == []


def test_import_payload_bound_before_decode(monkeypatch):
    monkeypatch.setattr(mcp_server, "MAX_IMPORT_BYTES", 3)
    with pytest.raises(ValueError, match="limited to"):
        mcp_server._import_sync("part.osk", "a" * 8, None)
    assert not store.listing()


@pytest.mark.parametrize("doc", [
    {"features": [None]}, {"features": [{}]}, {"features": [{"id": "a", "type": 42}]},
    {"features": [{"id": "a", "type": "import", "data": 12}]},
    {"features": [{"id": "a", "type": "sketch", "entities": [None]}]},
    {"features": [{"id": "a", "type": "sketch", "constraints": "wrong"}]},
    {"features": [], "pcb": []},
    {"type": "assembly", "parts": {"p": None}, "components": []},
    {"type": "assembly", "parts": {"p": {"features": [None]}}, "components": []},
    {"type": "assembly", "parts": {}, "components": [None]},
    {"type": "assembly", "parts": {}, "components": [{"id": "c", "part": {}}]},
    {"type": "assembly", "parts": {}, "components": [], "mates": [None]},
    {"type": "assembly", "parts": {}, "components": [], "mates": [{"id": "m", "type": "hinge", "refs": [None]}]},
])
def test_native_import_rejects_bad_nested_structure_before_saving(doc):
    with TestClient(server.app) as client:
        result = _call(client, "import_document", filename="bad.osk",
                       data=base64.b64encode(json.dumps(doc).encode()).decode())
        assert "error" in result
        assert store.listing() == []


def test_native_import_preserves_repairable_feature_errors():
    doc = {"features": [{"id": "bad", "type": "extrude", "sketch": "absent", "depth": 5}]}
    with TestClient(server.app) as client:
        result = _call(client, "import_document", filename="repair.osk",
                       data=base64.b64encode(json.dumps(doc).encode()).decode())
        read = _call(client, "get_document", doc_id=result["doc_id"])
        assert read["state"]["errors"][0]["id"] == "bad"


@pytest.mark.parametrize("part_id", ["Arduino UNO", "../Arduino UNO"])
def test_existing_part_keys_are_not_treated_as_filesystem_paths(part_id):
    rec = store.create("Board", doc={"type": "assembly", "parts": {part_id: plate()}, "components": [], "mates": []})
    with TestClient(server.app) as client:
        result = _call(client, "export_document", doc_id=rec["id"], format="osk", part_id=part_id)
        assert result["part_id"] == part_id
        assert client.get(result["download_url"]).json() == rec["doc"]["parts"][part_id]
        assert result["filename"] == "Plate_v1.osk"


def test_mcp_preview_background_and_bounds():
    rec = store.create("Plate", doc=plate())
    with TestClient(server.app) as client:
        rpc = _rpc(client, f"/mcp/{auth.mcp_token()}", "tools/call", {"name": "preview_document",
                   "arguments": {"doc_id": rec["id"], "view": "top", "width": 320, "height": 240}})
        assert not rpc.get("isError")
        result = json.loads(rpc["content"][0]["text"])
        assert rpc["content"][1]["type"] == "image"
        raw = client.get(result["download_url"]).content
        assert base64.b64decode(rpc["content"][1]["data"]) == raw
        assert raw.startswith(b"\x89PNG\r\n\x1a\n")
        assert struct.unpack(">II", raw[16:24]) == (320, 240)
        assert store.get(rec["id"]) == rec
        result = _rpc(client, f"/mcp/{auth.mcp_token()}", "tools/call", {"name": "preview_document",
                      "arguments": {"doc_id": rec["id"], "width": 50000}})
        assert result["isError"] and "error" in json.loads(result["content"][0]["text"])


def test_mcp_preview_hidden_geometry_has_readable_error():
    doc = asm_doc()
    for component in doc["components"]:
        component["hidden"] = True
    rec = store.create("Hidden", doc=doc)
    with TestClient(server.app) as client:
        result = _rpc(client, f"/mcp/{auth.mcp_token()}", "tools/call", {"name": "preview_document",
                      "arguments": {"doc_id": rec["id"]}})
        assert result["isError"]
        error = json.loads(result["content"][0]["text"])["error"]
        assert "Cannot preview" in error and "visible" in error
        assert store.get(rec["id"]) == rec
