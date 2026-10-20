"""Security fixes from the 2026-10-19 audit (auth stream): private AI addresses never derived from the server
password, new addresses and app sign-outs on a password change, and the rest of the sign-in hardening."""
import hashlib
import hmac
import json

import pytest
from fastapi.testclient import TestClient

from opensketch import accounts, auth, mcpauth, server

ACCEPT = {"Accept": "application/json, text/event-stream"}


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "OPENSKETCH_PUBLIC_URL", "CODESPACE_NAME", "ANTHROPIC_API_KEY",
              "ANTHROPIC_AUTH_TOKEN", "OPENSKETCH_ACCESS_CODE", "OPENSKETCH_SHARE_SERVER_KEY", "OPENSKETCH_AI_DEMO",
              "OPENSKETCH_MAX_TESTERS"):
        monkeypatch.delenv(k, raising=False)
    auth._fails.clear()
    mcpauth._codes.clear()
    mcpauth._reg_hits.clear()
    return tmp_path


def _owner(pw="correct horse"):
    c = TestClient(server.app)
    r = c.post("/setup", data={"name": "YZ", "email": "yz@example.com", "new_password": pw, "next": "/",
                               "server_password": auth.password()}, follow_redirects=False)
    assert r.status_code == 303, r.text
    return c


def _member(owner, email="mei@example.com", pw="battery staple"):
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    m = TestClient(server.app)
    assert m.post(f"/join/{token}", data={"name": "Mei", "email": email, "new_password": pw}, follow_redirects=False).status_code == 303
    return m


def _key(c) -> str:
    return c.get("/api/solidworks").json()["private_url"].split("/mcp/")[1]


def _tools_list(app, key):
    return app.post(f"/mcp/{key}", json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}, headers=ACCEPT)


def test_private_addresses_are_not_keyed_by_the_server_password(monkeypatch):
    """auth-security-0: a member's or tester's private address was HMAC(server password, "mcp:" + id), an offline
    test for the password. Now it comes from the data folder's random secret; the owner's address is unchanged."""
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "hunter22")
    monkeypatch.setenv("OPENSKETCH_ACCESS_CODE", "access20")
    owner = _owner()
    member = _member(owner)
    tester = TestClient(server.app)
    tester.post("/access", data={"code": "access20"})
    assert _key(owner) == auth.mcp_token()  # existing connectors keep working
    for c in (member, tester):
        me = c.get("/api/account").json()["user"]
        key = _key(c)
        old = hmac.new(b"hunter22", ("mcp:" + me["id"]).encode(), hashlib.sha256).hexdigest()[:32]
        assert key != old and len(key) == 32
        assert auth.resolve_mcp(key) == (True, accounts.get(me["id"]))
        assert auth.resolve_mcp(old) == (False, None)  # the old password-derived form is gone
        monkeypatch.setenv("OPENSKETCH_PASSWORD", "something-else")
        assert _key(c) == key  # a new server password no longer moves it
        monkeypatch.setenv("OPENSKETCH_PASSWORD", "hunter22")
    with TestClient(server.app) as app:
        assert _tools_list(app, _key(member)).status_code == 200
        assert _tools_list(app, "0" * 32).status_code == 404
    assert auth.resolve_mcp("x" * 5000) == (False, None)


def test_a_new_private_address_and_a_password_change_end_old_access(monkeypatch):
    """auth-security-11: a person can replace their private address; a password change replaces it and signs every
    AI app out too, so someone who copied it or clicked Allow on a borrowed laptop loses access."""
    owner = _owner()
    member = _member(owner)
    old = _key(member)
    new = member.post("/api/connect/new_address").json()["mcp_url"].split("/mcp/")[1]
    assert new != old and _key(member) == new
    assert not auth.resolve_mcp(old)[0] and auth.resolve_mcp(new)[0]
    # an AI app that signed in, then a password change
    mid = member.get("/api/account").json()["user"]["id"]
    with mcpauth._lock:
        d = mcpauth._load()
        d["grants"]["osg_test"] = {"user": mid, "client_id": "osc_x", "name": "Claude", "host": "claude.ai",
                                   "created": 1, "last_used": 1, "refresh": "x", "refresh_exp": 4102444800}
        mcpauth._save(d)
    assert member.get("/api/account/apps").json()["apps"]
    r = member.post("/api/account", json={"current_password": "battery staple", "new_password": "another password"})
    assert r.json()["signed_out"]
    assert not auth.resolve_mcp(new)[0]
    assert mcpauth.grants_for(mid) == []
    # the owner's first new address leaves the server-wide one
    server_wide = _key(owner)
    owner_new = owner.post("/api/connect/new_address").json()["mcp_url"].split("/mcp/")[1]
    assert owner_new != server_wide and auth.resolve_mcp(owner_new)[1]["role"] == "owner"
    assert not auth.resolve_mcp(server_wide)[0]
    # Disconnect all
    with mcpauth._lock:
        d = mcpauth._load()
        d["grants"]["osg_2"] = {"user": accounts.owner()["id"], "client_id": "osc_y", "name": "Codex", "host": "x",
                                "created": 1, "last_used": 1, "refresh": "y", "refresh_exp": 4102444800}
        mcpauth._save(d)
    assert owner.delete("/api/account/apps").json() == {"apps": []}
    assert owner.get("/api/account/apps").json()["apps"] == []


def test_account_files_are_read_once_and_shared(tmp_path):
    """auth-security-6: every request read users.json and sessions.json through several deep copies. Now they are
    parsed once per change; writers work on their own copy, so a reader never sees half a change."""
    owner = _owner()
    first = accounts._users()
    assert accounts._users() is first  # no copy per read
    owner.post("/api/account", json={"name": "Yuanzheng"})
    assert accounts._users() is not first and accounts.get(accounts.owner()["id"])["name"] == "Yuanzheng"
    assert first["users"][0]["name"] == "YZ"  # the writer did not change the shared copy
    (tmp_path / "data" / "users.json").write_text(json.dumps(accounts._users()).replace("Yuanzheng", "Y Z"))
    assert accounts.owner()["name"] == "Y Z"  # another process's write is seen


def _trickle_server(delay=0.3, total=40):
    """An HTTP server that answers 200 and then sends one byte every `delay` seconds."""
    import socket
    import threading
    srv = socket.socket()
    srv.bind(("127.0.0.1", 0))
    srv.listen(8)
    stop = threading.Event()

    def serve():
        srv.settimeout(0.2)
        while not stop.is_set():
            try:
                conn, _ = srv.accept()
            except OSError:
                continue

            def one(c=conn):
                try:
                    c.recv(4096)
                    c.sendall(b"HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: 100000\r\n\r\n")
                    for _ in range(total):
                        if stop.is_set():
                            break
                        c.sendall(b" ")
                        import time as _t
                        _t.sleep(delay)
                except OSError:
                    pass
                finally:
                    c.close()
            threading.Thread(target=one, daemon=True).start()
    threading.Thread(target=serve, daemon=True).start()
    return srv.getsockname()[1], stop


def test_a_slow_metadata_address_is_given_up_on_time(monkeypatch):
    """auth-security-2: httpx's timeout is per read, so a server trickling a byte at a time held the fetch (and a
    request thread) for hours. Now the whole fetch has a deadline."""
    import time
    from opensketch import providers
    port, stop = _trickle_server()
    try:
        monkeypatch.setattr(mcpauth, "CIMD_DEADLINE", 1.0)
        monkeypatch.setattr(providers, "pinned", lambda url: (f"http://127.0.0.1:{port}/c.json", {"Host": "slow.example"}, {}))
        mcpauth._cimd.clear()
        t = time.monotonic()
        assert mcpauth.metadata_client("https://slow.example/c.json") is None
        assert time.monotonic() - t < 3
        assert mcpauth.client("https://slow.example/c.json", fetch=False) is None  # remembered as failed for a minute
    finally:
        stop.set()


def test_metadata_fetches_never_hold_request_threads(monkeypatch):
    """auth-security-2: 40 token requests naming slow https client_ids used up AnyIO's 40 request threads, so
    /healthz failed and the supervisor restarted the server in a loop. Now the fetches run in mcpauth's own pool of
    CIMD_WORKERS, the rest are refused at once, and the server keeps answering."""
    import threading
    import time
    monkeypatch.setattr(mcpauth, "CIMD_DEADLINE", 1.5)
    monkeypatch.setattr(mcpauth, "TOKEN_LIMIT", 1000)

    def slow(url):
        time.sleep(4)
        raise mcpauth.OAuthError("invalid_client", "slow")
    monkeypatch.setattr(mcpauth, "_read_metadata", slow)
    mcpauth._cimd.clear()
    mcpauth._token_hits.clear()
    _owner()
    results = []
    with TestClient(server.app) as c:
        def call(i):
            t = time.monotonic()
            r = c.post("/oauth/token", data={"grant_type": "refresh_token", "refresh_token": "osr_x",
                                             "client_id": f"https://attacker.example/c/{i}"})
            results.append((r.status_code, time.monotonic() - t))
        threads = [threading.Thread(target=call, args=(i,)) for i in range(45)]
        for th in threads:
            th.start()
        time.sleep(0.3)
        t = time.monotonic()
        assert c.get("/healthz").status_code == 200
        assert time.monotonic() - t < 1.0
        for th in threads:
            th.join(10)
    assert len(results) == 45 and max(d for _, d in results) < 4
    codes = [code for code, _ in results]
    assert codes.count(503) >= 45 - mcpauth.CIMD_WORKERS and set(codes) <= {401, 503}


def _stream(c, prompt="a plate"):
    r = c.post("/api/ai/stream", json={"doc": {"version": 1, "name": "P", "units": "mm", "features": []}, "prompt": prompt})
    return [json.loads(line) for line in r.text.splitlines() if line.strip()]








def _google(monkeypatch, info):
    from opensketch import oauth
    monkeypatch.setenv("GOOGLE_CLIENT_ID", "cid.apps.googleusercontent.com")
    monkeypatch.setenv("GOOGLE_CLIENT_SECRET", "secret")

    async def fake(code, redirect_uri):
        return dict(info)
    monkeypatch.setattr(oauth, "exchange", fake)


def _google_round(c, query=""):
    from urllib.parse import parse_qs, urlparse
    r = c.get("/auth/google" + query, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("https://accounts.google.com/")
    state = parse_qs(urlparse(r.headers["location"]).query)["state"][0]
    return c.get(f"/auth/google/callback?state={state}&code=good-code", follow_redirects=False)


def test_testers_are_capped_and_scripts_cannot_make_thousands(monkeypatch):
    """auth-security-6: /access made a new account for every right code with no cap."""
    monkeypatch.setenv("OPENSKETCH_ACCESS_CODE", "access20")
    monkeypatch.setenv("OPENSKETCH_MAX_TESTERS", "3")
    monkeypatch.setattr(auth, "_made", {})
    owner = _owner()
    codes = [TestClient(server.app).post("/access", data={"code": "access20"}, follow_redirects=False).status_code for _ in range(4)]
    assert codes == [303, 303, 303, 503]
    full = TestClient(server.app).post("/access", data={"code": "access20"}, follow_redirects=False)
    assert b"Early access is full" in full.content
    owner.delete("/api/account/testers")
    monkeypatch.setattr(auth, "NEW_PER_HOUR", 2)
    monkeypatch.setattr(auth, "_made", {})
    codes = [TestClient(server.app).post("/access", data={"code": "access20"}, follow_redirects=False).status_code for _ in range(3)]
    assert codes == [303, 303, 429]
    accounts.set_open_signup(True)
    r = TestClient(server.app).post("/signup", data={"name": "A", "email": "a@example.com", "new_password": "long enough"},
                                    follow_redirects=False)
    assert r.status_code == 429 and b"Too many new accounts" in r.content  # the same limit for open sign-up


def test_sign_in_limits_use_their_window_and_ipv6_networks(monkeypatch):
    """auth-security-13: the window was 60 s (CLAUDE.md says 15 minutes for an email), filling the table cleared
    every counter, and each IPv6 address in a /64 counted on its own."""
    import time
    assert auth._net("2001:db8:1:2:aaaa::1") == auth._net("2001:db8:1:2:bbbb::9") == "2001:db8:1:2::/64"
    assert auth._net("::ffff:203.0.113.9") == "203.0.113.9" and auth._net("203.0.113.9") == "203.0.113.9"
    k = "email:yz@example.com"
    for _ in range(auth.LIMIT):
        auth._failed(k)
    assert auth._limited(k)
    real = time.time
    monkeypatch.setattr(time, "time", lambda: real() + 10 * 60)
    assert auth._limited(k)  # still limited 10 minutes later (was a minute)
    monkeypatch.setattr(time, "time", lambda: real() + 16 * 60)
    assert not auth._limited(k)
    monkeypatch.setattr(time, "time", real)
    for _ in range(auth.LIMIT):
        auth._failed(k)
    for i in range(6000):  # an attacker filling the table with other emails
        auth._fails[f"email:x{i}@example.com"] = [real()]
    auth._failed("email:last@example.com")
    assert auth._limited(k)  # the target's counter survives


def test_invite_links_can_be_listed_and_revoked():
    """auth-security-14: an invite pasted in the wrong chat could not be revoked for 7 days."""
    owner = _owner()
    made = owner.post("/api/account/invites", json={"note": "for Alex"}).json()
    token = made["url"].split("/join/")[1]
    owner.post("/api/account/invites")  # no note
    listed = owner.get("/api/account/invites").json()["invites"]
    assert [i["note"] for i in listed] == ["for Alex", ""] and token not in json.dumps(listed)
    assert owner.get("/api/account").json()["pending_invites"] == 2
    alex = next(i for i in listed if i["note"] == "for Alex")
    assert [i["note"] for i in owner.delete(f"/api/account/invites/{alex['id']}").json()["invites"]] == [""]
    assert owner.delete(f"/api/account/invites/{alex['id']}").status_code == 404
    late = TestClient(server.app)
    assert late.get(f"/join/{token}").status_code == 410
    assert late.post(f"/join/{token}", data={"name": "A", "email": "a@example.com", "new_password": "long enough"}).status_code == 400
    member = _member(owner)
    assert member.get("/api/account/invites").status_code == 403
    assert member.delete(f"/api/account/invites/{listed[1]['id']}").status_code == 403


def test_a_typed_email_never_keeps_a_google_owner_out(monkeypatch):
    """auth-security-10: anyone could sign up as victim@gmail.com with their own password; when the victim later used
    Continue with Google, they were linked into that account and both could use it. Now the person Google vouches
    for takes it over: the typed password, its sessions, its AI apps and its private address end."""
    owner = _owner()
    accounts.set_open_signup(True)
    attacker = TestClient(server.app)
    attacker.post("/signup", data={"name": "Victim", "email": "victim@gmail.com", "new_password": "attacker pw"})
    uid = attacker.get("/api/account").json()["user"]["id"]
    old_key = _key(attacker)
    with mcpauth._lock:
        d = mcpauth._load()
        d["grants"]["osg_a"] = {"user": uid, "client_id": "osc_a", "name": "Evil", "host": "evil.example", "created": 1,
                                "last_used": 1, "refresh": "z", "refresh_exp": 4102444800}
        mcpauth._save(d)
    _google(monkeypatch, {"sub": "g-victim", "email": "victim@gmail.com", "email_verified": True, "name": "Victim"})
    victim = TestClient(server.app)
    assert _google_round(victim).status_code == 303
    assert victim.get("/api/account").json()["user"]["id"] == uid
    assert attacker.get("/api/solidworks").status_code == 401  # signed out
    assert accounts.verify("victim@gmail.com", "attacker pw") is None  # the typed password is gone
    assert mcpauth.grants_for(uid) == [] and not auth.resolve_mcp(old_key)[0]
    # the owner (who set the server up) and a verified Google account are never taken over this way
    _google(monkeypatch, {"sub": "g-owner", "email": "yz@example.com", "email_verified": True, "hd": "example.com"})
    assert _google_round(TestClient(server.app)).status_code == 303
    assert accounts.verify("yz@example.com", "correct horse") is not None and owner.get("/api/solidworks").status_code == 200


def test_testers_keep_their_work_with_an_email_and_password(monkeypatch):
    """ux-product-0: a tester's only link to their files was the session cookie; signing out lost everything. Now
    they can add an email and password (or Google) and sign in again; they stay a tester."""
    monkeypatch.setenv("OPENSKETCH_ACCESS_CODE", "access20")
    owner = _owner()
    t = TestClient(server.app)
    t.post("/access", data={"code": "access20"})
    key = t.get("/api/solidworks").json()["key"]
    assert t.post("/api/account/keep", json={"email": "bad", "password": "long enough"}).status_code == 400
    assert t.post("/api/account/keep", json={"email": "yz@example.com", "password": "long enough"}).status_code == 400  # taken
    assert t.post("/api/account/keep", json={"email": "sam@example.com", "password": "short"}).status_code == 400
    me = t.post("/api/account/keep", json={"name": "Sam", "email": "Sam@Example.com", "password": "long enough"}).json()["user"]
    assert me["tester"] and me["has_password"] and me["email"] == "sam@example.com" and me["name"] == "Sam"
    assert owner.post("/api/account/keep", json={"email": "o@example.com", "password": "long enough"}).status_code == 400
    again = t.post("/api/account/keep", json={"email": "evil@example.com", "password": "taken over"})
    assert again.status_code == 400 and "kept already" in again.json()["error"]  # no change without the current password
    t.get("/logout")
    back = TestClient(server.app)
    assert back.post("/login", data={"email": "sam@example.com", "password": "long enough"}, follow_redirects=False).status_code == 303
    assert back.get("/api/solidworks").json()["key"] == key  # the same account: same SOLIDWORKS key
    assert back.get("/api/account").json()["user"]["role"] == "tester"  # early access still decides their AI
    # Google instead of a password
    g = TestClient(server.app)
    g.post("/access", data={"code": "access20"})
    _google(monkeypatch, {"sub": "g-kim", "email": "kim@gmail.com", "email_verified": True, "name": "Kim"})
    r = _google_round(g, "?keep=1&next=/%3Fview%3Dfiles")
    assert r.status_code == 303 and r.headers["location"] == "/?view=files"
    me = g.get("/api/account").json()["user"]
    assert me["tester"] and me["google"] and me["email"] == "kim@gmail.com" and me["name"] == "Kim"
    other = TestClient(server.app)
    other.post("/access", data={"code": "access20"})
    r = _google_round(other, "?keep=1")
    assert r.status_code == 409 and b"already" in r.content  # one Google account, one OpenSketch account


def test_the_code_link_keeps_where_the_person_was_going(monkeypatch):
    """ux-product-0: an AI app's sign-in sent a tester to /login; the code link dropped `next`, so the app never
    got its answer."""
    monkeypatch.setenv("OPENSKETCH_ACCESS_CODE", "access20")
    _owner()
    c = TestClient(server.app)
    page = c.get("/login?next=/oauth/authorize%3Fclient_id%3Dx").text
    assert 'href="/access?next=%2Foauth%2Fauthorize%3Fclient_id%3Dx"' in page
    r = c.post("/access", data={"code": "access20", "next": "/oauth/authorize?client_id=x"}, follow_redirects=False)
    assert r.headers["location"] == "/oauth/authorize?client_id=x"


def test_sign_in_pages_tie_errors_and_notes_to_fields():
    """dialogs-a11y:12: errors and notes are read out with their fields; the setup page talks to a new owner."""
    setup = TestClient(server.app).get("/setup").text
    assert "now uses accounts" not in setup and "You will own this server" in setup
    assert 'aria-describedby="new_password-note"' in setup and 'id="new_password-note"' in setup
    _owner()
    bad = TestClient(server.app).post("/login", data={"email": "yz@example.com", "password": "nope"}).text
    assert 'id="err"' in bad and 'aria-invalid="true"' in bad and 'aria-describedby="err"' in bad
    assert "a:focus-visible" in bad


def test_one_connection_per_app_and_registrations_are_bounded(monkeypatch):
    """auth-security-9 and -15: Claude registers again on every connect, so each reconnect added a grant; anyone could
    fill the 2,000 registrations and lock every new app out; registrations could carry 10 x 2,000-character URLs."""
    import base64
    import re
    import secrets
    from urllib.parse import parse_qs, urlparse
    owner = _owner()
    with TestClient(server.app) as app:
        def register(**extra):
            r = app.post("/oauth/register", json={"client_name": "Claude", "redirect_uris": ["https://claude.ai/api/mcp/auth_callback"], **extra})
            assert r.status_code == 201, r.text
            return r.json()["client_id"]

        def connect(cid):
            v = secrets.token_urlsafe(48)
            chal = base64.urlsafe_b64encode(hashlib.sha256(v.encode()).digest()).decode().rstrip("=")
            page = owner.get("/oauth/authorize", params={"response_type": "code", "client_id": cid, "state": "s",
                                                         "redirect_uri": "https://claude.ai/api/mcp/auth_callback",
                                                         "code_challenge": chal, "code_challenge_method": "S256"})
            req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
            loc = owner.post("/oauth/authorize", data={"req": req}, follow_redirects=False).headers["location"]
            code = parse_qs(urlparse(loc).query)["code"][0]
            return app.post("/oauth/token", data={"grant_type": "authorization_code", "code": code, "client_id": cid,
                                                  "code_verifier": v, "redirect_uri": "https://claude.ai/api/mcp/auth_callback"}).json()
        first = connect(register())
        second = connect(register())
        apps = owner.get("/api/account/apps").json()["apps"]
        assert len(apps) == 1  # the reconnect replaced the old connection
        assert app.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}},
                        headers={**ACCEPT, "Authorization": f"Bearer {first['access_token']}"}).status_code == 401
        assert app.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}},
                        headers={**ACCEPT, "Authorization": f"Bearer {second['access_token']}"}).status_code == 200
        # bounded registrations
        long = "https://claude.ai/" + "a" * 600
        assert app.post("/oauth/register", json={"redirect_uris": [long]}).status_code == 400
        many = [f"https://x{i}.example/cb" for i in range(mcpauth.MAX_REDIRECTS + 1)]
        assert app.post("/oauth/register", json={"redirect_uris": many}).status_code == 400
        # full: the oldest unused registration makes room, the one in use stays
        monkeypatch.setattr(mcpauth, "MAX_CLIENTS", 3)
        mcpauth._reg_hits.clear()
        used = {g["client_id"] for g in mcpauth._view()["grants"].values()}
        for _ in range(4):
            register()
        clients = mcpauth._view()["clients"]
        assert len(clients) == 3 and used <= set(clients)
    # registrations from one IPv6 /64 count together
    mcpauth._reg_hits.clear()
    assert all(mcpauth._rate_ok(auth._net(f"2001:db8::{i:x}")) for i in range(mcpauth.REGISTER_LIMIT))
    assert not mcpauth._rate_ok(auth._net("2001:db8::ffff"))


def test_the_mcp_token_store_is_not_parsed_per_request(monkeypatch):
    """auth-security-9: every Bearer request read and parsed mcp_oauth.json (up to 40 MB) on the event loop."""
    _owner()
    mcpauth._save({"clients": {}, "grants": {}, "access": {}})
    reads = []
    real = type(mcpauth._file()).read_text
    monkeypatch.setattr(type(mcpauth._file()), "read_text", lambda self, *a, **k: reads.append(self.name) or real(self, *a, **k))
    for _ in range(20):
        assert mcpauth.user_for_access("osa_" + "x" * 40) == (False, None)
    assert reads.count("mcp_oauth.json") == 0
    assert mcpauth.user_for_access("osa_" + "x" * 200) == (False, None)
