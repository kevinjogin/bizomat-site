"""The signed-in CADOS app (app_pages.py): six sections behind sign-in, the KEVOS brand on each, no old product name,
a Tools list that matches exactly what the AI assistant can call, and a History backed by the real command record."""
import asyncio

import httpx
from fastapi.testclient import TestClient

from opensketch import catalog, mcp_server, server
from tests.bridge_fakes import FakeCompanion
from tests.test_devicebridge import Canned, _mcp, base, companions, data  # noqa: F401  (fixtures)

SECTIONS = {
    "/dashboard": "Engineering, made intelligent.",
    "/assistant": "Work in SOLIDWORKS by asking.",
    "/solidworks": "Your SOLIDWORKS connection.",
    "/tools": "Everything CADOS can do.",
    "/history": "What your assistant has done.",
    "/settings": "Account and access.",
}


def _owner():
    c = TestClient(server.app)
    c.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"})
    return c


def test_tools_page_lists_exactly_the_registered_tools():
    registered = {t.name for t in asyncio.run(mcp_server.mcp.list_tools())}
    listed = [name for _, tools in catalog.GROUPS for name, _, _ in tools]
    assert len(listed) == len(set(listed)) and set(listed) == registered


def test_every_section_needs_sign_in_and_carries_the_brand():
    owner = _owner()
    anon = TestClient(server.app)
    for path, heading in SECTIONS.items():
        r = anon.get(path, follow_redirects=False)
        assert r.status_code == 303 and r.headers["location"] == f"/login?next={path}", path
        page = owner.get(path)
        assert page.status_code == 200 and heading in page.text, path
        t = page.text
        assert "/ui/app.js" in t and "https://kevos.com/" in t and "https://work.kevos.com/" in t, path
        assert "OpenSketch" not in t and "oss_" not in t, path  # no old name, and no key in the page source
        for href, label, _ in [(h, lbl, k) for h, lbl, k in __import__("opensketch.brand", fromlist=["APP_NAV"]).APP_NAV]:
            assert f'href="{href}"' in t and label in t, (path, label)
    assert "Automation" not in owner.get("/dashboard").text  # no section without a real feature behind it
    # the signed-in home page is the app's Home
    assert "Engineering, made intelligent." in owner.get("/").text
    # the app script and the official KEVOS marks are public files with no data
    for f in ("/ui/app.js", "/ui/kevos-wordmark.svg", "/favicon.svg", "/favicon.ico"):
        assert anon.get(f).status_code == 200, f


def test_a_missing_page_is_branded_for_browsers_and_json_for_programs():
    owner = _owner()
    r = owner.get("/no-such-page", headers={"Accept": "text/html"})
    assert r.status_code == 404 and "This page does not exist." in r.text and "CADOS" in r.text
    j = owner.get("/api/no-such-thing", headers={"Accept": "text/html"})
    assert j.status_code == 404 and j.headers["content-type"].startswith("application/json")


def test_history_shows_the_real_command_record(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    assert httpx.get(base + "/api/commands").json() == {"commands": []}
    res, out = _mcp(base, "sw_get_document", {"doc": "C:\\OS\\Box.SLDPRT"})
    assert not res.get("isError"), out
    res, out = _mcp(base, "sw_delete_items", {"doc": "C:\\OS\\Box.SLDPRT", "features": ["Boss-Extrude1"]})
    assert res.get("isError")  # the person at the computer declined (the stand-in says no to destructive changes)
    got = httpx.get(base + "/api/commands", params={"limit": 10}).json()["commands"]
    assert [c["title"] for c in got[:2]] == ["Delete features", "Read a document"]
    newest, older = got[0], got[1]
    assert newest["status"] == "failed" and newest["device"] == pc.name and newest["error"]["code"] == "APPROVAL_DENIED"  # shown as Declined
    assert older["status"] == "succeeded" and older["device"] == pc.name and "error" not in older
    assert all(set(c) >= {"id", "tool", "title", "status", "created_at", "device", "app"} for c in got)
    assert len(httpx.get(base + "/api/commands", params={"limit": 1}).json()["commands"]) == 1
