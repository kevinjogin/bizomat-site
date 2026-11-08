"""The data folder kept in an object store, for Cloudflare Containers whose disk does not last (persist.py)."""
import hashlib
import http.server
import json
import socketserver
import sqlite3
import threading
import urllib.parse

import pytest

from opensketch import persist, supervisor


class Store:
    """A stand-in for the Worker's store (cloudflare/mcp/src/persist.ts): the four calls, in memory."""

    def __init__(self):
        self.objects: dict[str, bytes] = {}
        self.calls: list[tuple[str, str]] = []
        self.fail = False
        self.refuse: set[str] = set()  # keys whose PUT is answered 400 (R2 refused them)
        store = self

        class H(http.server.BaseHTTPRequestHandler):
            def _send(self, code, body=b"", ctype="application/octet-stream"):
                self.send_response(code)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)

            def _key(self):
                return urllib.parse.unquote(self.path[len("/o/"):]) if self.path.startswith("/o/") else None

            def do_GET(self):
                store.calls.append(("GET", self.path))
                if store.fail:
                    return self._send(503)
                if self.path == "/list":
                    objs = [{"key": k, "size": len(v), "sha256": hashlib.sha256(v).hexdigest()} for k, v in store.objects.items()]
                    return self._send(200, json.dumps({"objects": objs}).encode(), "application/json")
                k = self._key()
                if k in store.objects:
                    return self._send(200, store.objects[k])
                self._send(404)

            def do_PUT(self):
                store.calls.append(("PUT", self.path))
                body = self.rfile.read(int(self.headers["Content-Length"]))
                if store.fail:
                    return self._send(503)
                if hashlib.sha256(body).hexdigest() != self.headers.get("X-Content-SHA256") or self._key() in store.refuse:
                    return self._send(400, b"not stored: refused", "text/plain")
                store.objects[self._key()] = body
                self._send(204)

            def do_DELETE(self):
                store.calls.append(("DELETE", self.path))
                store.objects.pop(self._key(), None)
                self._send(204)

            def log_message(self, *a):
                pass

        socketserver.ThreadingTCPServer.allow_reuse_address = True
        self.srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), H)
        self.srv.daemon_threads = True
        self.url = f"http://127.0.0.1:{self.srv.server_address[1]}"
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()

    def puts(self):
        return [p for m, p in self.calls if m == "PUT"]


@pytest.fixture
def store(monkeypatch):
    s = Store()
    monkeypatch.setenv("OPENSKETCH_PERSIST_URL", s.url)
    yield s
    s.srv.shutdown()


def test_restore_fails_closed_without_accounts(store, tmp_path):
    """An empty server would offer /setup to anyone: without the accounts marker in the store it never starts."""
    store.objects["data/users.json"] = b"{}"
    with pytest.raises(persist.StoreError, match="no accounts"):
        persist.restore(tmp_path / "data")
    assert not (tmp_path / "data" / "users.json").exists()
    assert persist.restore(tmp_path / "data", allow_empty=True)  # a deliberate first start


def test_restore_writes_every_state_file_and_checks_it(store, tmp_path):
    store.objects.update({"data/accounts.enabled": b"", "data/users.json": b'{"users": [1]}',
                          "data/bridge-signing-key.pem": b"KEY", "data/../evil": b"x", "other/x": b"x"})
    got = persist.restore(tmp_path / "data", log=lambda m: None)
    assert sorted(got) == ["accounts.enabled", "bridge-signing-key.pem", "users.json"]
    assert (tmp_path / "data" / "users.json").read_bytes() == b'{"users": [1]}'
    assert not (tmp_path / "evil").exists()


def test_restore_stops_when_the_store_does_not_answer(monkeypatch, tmp_path):
    monkeypatch.setenv("OPENSKETCH_PERSIST_URL", "http://127.0.0.1:9")
    with pytest.raises(persist.StoreError, match="did not answer"):
        persist.restore(tmp_path)


def test_changed_state_files_go_to_the_store_and_nothing_else(store, tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    (d / "users.json").write_text('{"a": 1}')
    (d / "accounts.enabled").write_text("")
    (d / "users.json.lock").write_text("")
    (d / ".hidden").write_text("x")
    (d / "uploads").mkdir()
    (d / "uploads" / "big.step").write_text("in transit")
    s = persist.Syncer(d, every=60, log=lambda m: None)
    assert s.sync_once() == 2
    assert sorted(store.objects) == ["data/accounts.enabled", "data/users.json"]
    assert s.sync_once() == 0  # unchanged: nothing sent
    (d / "users.json").write_text('{"a": 2}')
    assert s.sync_once() == 1 and store.objects["data/users.json"] == b'{"a": 2}'


def test_one_refused_file_never_holds_back_the_others(store, tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    for name in ("accounts.enabled", "bridge-release.json", "users.json"):
        (d / name).write_text(name)
    store.refuse.add("data/accounts.enabled")  # sorted first: the others still go
    s = persist.Syncer(d, every=60, log=lambda m: None)
    with pytest.raises(persist.StoreError, match=r"accounts\.enabled \(HTTP 400: not stored: refused\)"):
        s.sync_once()
    assert sorted(store.objects) == ["data/bridge-release.json", "data/users.json"]
    store.refuse.clear()
    assert s.sync_once() == 1 and "data/accounts.enabled" in store.objects  # tried again, though unchanged


def test_names_the_store_would_refuse_stay_on_the_disk(store, tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    for name in ("users.json", "space name.json", "caf\u00e9.json", "a..b", "-dash.json"):
        (d / name).write_text("x")
    assert [p.name for p in persist.state_files(d)] == ["users.json"]
    assert persist.Syncer(d, every=60, log=lambda m: None).sync_once() == 1
    assert sorted(store.objects) == ["data/users.json"]


def test_restored_files_are_the_servers_alone(store, tmp_path):
    store.objects.update({"data/accounts.enabled": b"", "data/secret.keys": b"k"})
    persist.restore(tmp_path / "data", log=lambda m: None)
    assert (tmp_path / "data" / "secret.keys").stat().st_mode & 0o777 == 0o600


def test_a_sqlite_database_is_copied_whole_even_in_wal_mode(store, tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    con = sqlite3.connect(d / "bridge.sqlite", isolation_level=None)
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("CREATE TABLE devices (id TEXT)")
    con.execute("INSERT INTO devices VALUES ('one')")
    s = persist.Syncer(d, every=60, log=lambda m: None)
    s.sync_once()
    con.execute("INSERT INTO devices VALUES ('two')")  # lands in the -wal file: the main file may not change
    assert s.sync_once() == 1
    copy = tmp_path / "copy.sqlite"
    copy.write_bytes(store.objects["data/bridge.sqlite"])
    assert [r[0] for r in sqlite3.connect(copy).execute("SELECT id FROM devices ORDER BY id")] == ["one", "two"]
    assert "data/bridge.sqlite-wal" not in store.objects
    con.close()


def test_a_removed_state_file_leaves_the_store_after_two_checks(store, tmp_path):
    d = tmp_path / "data"
    d.mkdir()
    (d / "google_oauth.json").write_text("{}")
    s = persist.Syncer(d, every=60, log=lambda m: None)
    s.sync_once()
    (d / "google_oauth.json").unlink()
    s.sync_once()
    assert "data/google_oauth.json" in store.objects  # one check: maybe a file being replaced
    s.sync_once()
    assert "data/google_oauth.json" not in store.objects


def test_files_restored_unchanged_are_not_sent_again(store, tmp_path):
    store.objects.update({"data/accounts.enabled": b"", "data/users.json": b"{}"})
    d = tmp_path / "data"
    got = persist.restore(d, log=lambda m: None)
    s = persist.Syncer(d, sent=got, every=60, log=lambda m: None)
    store.calls.clear()
    assert s.sync_once() == 0 and store.puts() == []


def test_flush_retries_until_the_store_has_it(store, tmp_path, monkeypatch):
    monkeypatch.setattr(persist.time, "sleep", lambda s: None)
    d = tmp_path / "data"
    d.mkdir()
    (d / "users.json").write_text("{}")
    s = persist.Syncer(d, every=60, log=lambda m: None)
    store.fail = True
    assert s.flush(attempts=2) is False
    store.fail = False
    assert s.flush(attempts=2) is True and "data/users.json" in store.objects


def test_the_supervisor_does_not_start_a_server_without_the_data(store, tmp_path, monkeypatch):
    """With OPENSKETCH_PERSIST_URL and an empty store, `--supervise` exits with code 2 before starting anything."""
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    started = []
    monkeypatch.setattr(supervisor, "Supervisor", lambda *a, **k: started.append(1))
    assert supervisor.main("127.0.0.1", 9) == 2
    assert started == []


def test_the_supervisor_restores_runs_then_flushes(store, tmp_path, monkeypatch):
    store.objects.update({"data/accounts.enabled": b"", "data/users.json": b'{"users": []}'})
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PERSIST_SECONDS", "60")

    class FakeSupervisor:
        def __init__(self, *a, **k):
            self.url, self.hang = "http://x", 1

        def run(self):  # the server ran and changed a file, then was asked to stop
            assert (tmp_path / "data" / "users.json").read_bytes() == b'{"users": []}'
            (tmp_path / "data" / "users.json").write_text('{"users": [1]}')
            return 0

    monkeypatch.setattr(supervisor, "Supervisor", FakeSupervisor)
    monkeypatch.setattr(supervisor.signal, "signal", lambda *a: None)
    assert supervisor.main("127.0.0.1", 9) == 0
    assert store.objects["data/users.json"] == b'{"users": [1]}'


def test_behind_the_worker_the_visitor_address_is_cf_connecting_ip(monkeypatch):
    from opensketch import auth
    scope = {"type": "http", "client": ("10.0.0.9", 1), "headers": [(b"cf-connecting-ip", b"203.0.113.7"),
                                                                     (b"x-forwarded-for", b"198.51.100.1")]}
    assert auth._client(scope) == auth._net("198.51.100.1")  # on Fly: Fly's own header, never CF from anyone
    monkeypatch.setenv("OPENSKETCH_CLIENT_IP_HEADER", "cf-connecting-ip")
    assert auth._client(scope) == auth._net("203.0.113.7")


def test_the_connector_address_can_be_the_mcp_host(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    from opensketch import accounts, server
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "https://bizomat.ai/cad")
    monkeypatch.setenv("OPENSKETCH_MCP_URL", "https://mcp.bizomat.ai/mcp")
    accounts.create_owner("owner@example.com", "Owner", "owner-pass-1")
    c = TestClient(server.app, base_url="https://bizomat.ai")
    c.post("/cad/login", data={"email": "owner@example.com", "password": "owner-pass-1"})
    r = c.get("/cad/api/solidworks").json()
    assert r["url"] == "https://mcp.bizomat.ai/mcp" and r["private_url"].startswith("https://mcp.bizomat.ai/mcp/")
    monkeypatch.setenv("OPENSKETCH_MCP_URL", "not an address")
    assert c.get("/cad/api/solidworks").json()["url"] == "https://bizomat.ai/cad/mcp"
