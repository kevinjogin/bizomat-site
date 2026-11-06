"""Fonts come from OpenSketch itself, not Google Fonts: no third-party request on any page (the privacy page says
so), nothing render-blocking on another host."""
import pytest
from fastapi.testclient import TestClient

from opensketch import auth, server


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def test_pages_load_no_fonts_from_other_sites():
    owner = TestClient(server.app)
    owner.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"})
    anon = TestClient(server.app)
    pages = {"login": anon.get("/login").text, "privacy": anon.get("/privacy").text, "home": owner.get("/").text}
    for name, html in pages.items():
        assert "googleapis" not in html and "gstatic" not in html, name
        assert "fonts/fonts.css" in html, name
    assert "load nothing from other sites" in pages["privacy"]
    # signed out: the sign-in pages need the fonts, which hold no data
    css = anon.get("/fonts/fonts.css")
    assert css.status_code == 200 and "font-face" in css.text
    names = [line.split("url(")[1].split(")")[0] for line in css.text.splitlines() if "url(" in line]
    assert {"inter-latin.woff2", "inter-tight-latin.woff2"} <= set(names)
    for n in names:
        r = anon.get("/fonts/" + n)
        assert r.status_code == 200 and r.headers["content-type"] == "font/woff2" and r.content[:4] == b"wOF2", n
    assert "Open Font License" in anon.get("/fonts/OFL.txt").text
    # the dashboard still needs sign-in; the design system (CSS, icon, sharing image) holds no data
    assert anon.get("/dashboard", follow_redirects=False).status_code == 303
    assert auth.PUBLIC_DIRS == ("/fonts/", "/ui/")
    for name in ("cados.css", "og.png", "icon-180.png"):
        assert anon.get("/ui/" + name).status_code == 200, name
    for name, html in {"product": anon.get("/").text, "docs": anon.get("/docs").text}.items():
        assert "googleapis" not in html and "/ui/cados.css" in html, name
    # the BIZOMAT design tokens (linked before the app's own CSS) and the heading face, Oxanium, come from here too
    for name, html in pages.items():
        assert html.index("/ui/bizomat-tokens.css") < html.index("/ui/cados.css"), name
    tokens = anon.get("/ui/bizomat-tokens.css")
    # relative to the stylesheet, so under bizomat.ai/cad the font is /cad/fonts/..., not the website's /fonts/
    assert tokens.status_code == 200 and "url('../fonts/oxanium-latin.woff2')" in tokens.text and "googleapis" not in tokens.text
    assert "--bz-teal: #0f766e" in tokens.text and "'Oxanium'" in anon.get("/ui/cados.css").text.replace('"', "'")
    for font in ("oxanium-latin.woff2", "inter-tight-latin.woff2"):
        r = anon.get("/fonts/" + font)
        assert r.status_code == 200 and r.headers["content-type"] == "font/woff2" and r.content[:4] == b"wOF2", font
    assert "Open Font License" in anon.get("/fonts/OFL-Oxanium.txt").text
