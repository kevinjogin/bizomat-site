"""The app's own files: gzipped once and kept, revalidated by ETag, the minified three.js, and a start page that
preloads every module the app loads (and /api/features) so the browser fetches them in one round instead of
three import levels."""
import gzip
import re

import pytest
from fastapi.testclient import TestClient

from opensketch import server, store

GZ = {"Accept-Encoding": "gzip, deflate, br"}


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    store.data_dir()
    return TestClient(server.app)


def test_app_files_are_gzipped_and_revalidated(client):
    raw = (server.STATIC / "js" / "app.js").read_bytes()
    r = client.get("/js/app.js", headers=GZ)
    assert r.status_code == 200 and r.headers["content-encoding"] == "gzip"
    assert r.headers["vary"] == "Accept-Encoding" and r.headers["cache-control"] == "no-cache"
    assert r.content == raw  # httpx undoes the gzip; the wire size is the header's
    assert int(r.headers["content-length"]) < len(raw) / 3
    etag = r.headers["etag"]
    assert etag.startswith('W/"')  # the gzipped bytes are not the file's bytes
    again = client.get("/js/app.js", headers={**GZ, "If-None-Match": etag})
    assert again.status_code == 304 and again.content == b"" and again.headers["vary"] == "Accept-Encoding"
    # no gzip asked for (or refused with q=0): the file as it is, with its strong ETag, still revalidated
    for enc in ("identity", "gzip;q=0"):
        plain = client.get("/js/app.js", headers={"Accept-Encoding": enc})
        assert "content-encoding" not in plain.headers and plain.content == raw
        again = client.get("/js/app.js", headers={"Accept-Encoding": enc, "If-None-Match": plain.headers["etag"]})
        assert again.status_code == 304
    assert "content-encoding" not in client.get("/js/app.js", headers={**GZ, "Range": "bytes=0-9"}).headers
    css = client.get("/css/linear.css", headers=GZ)
    assert css.headers["content-encoding"] == "gzip" and "text/css" in css.headers["content-type"]
    icon = client.get("/icons/icon-192.png", headers=GZ)  # pictures are compressed already
    assert "content-encoding" not in icon.headers and icon.headers["cache-control"] == "public, max-age=604800"
    # a changed file is compressed again (the cache is keyed by the file's version)
    cached = server._gz_cache[str(server.STATIC / "js" / "app.js")]
    server._gz_cache[str(server.STATIC / "js" / "app.js")] = ((0, 0), b"stale")
    try:
        assert client.get("/js/app.js", headers=GZ).content == raw
    finally:
        server._gz_cache[str(server.STATIC / "js" / "app.js")] = cached


def test_three_is_the_minified_r170_build(client):
    imports = server._import_map()
    assert imports == {"three": "vendor/three.module.min.js"}
    r = client.get("/vendor/three.module.min.js", headers=GZ)
    assert r.status_code == 200 and r.headers["content-encoding"] == "gzip"
    assert 'const t="170"' in r.text[:400]  # REVISION, the same three.js version as before, minified
    assert int(r.headers["content-length"]) < 200_000
    assert (server.STATIC / "vendor" / "three.LICENSE").is_file()
    assert "/vendor/three.module.min.js" in server._shell_assets()


def test_start_page_preloads_the_module_graph(client):
    r = client.get("/", headers=GZ)
    assert r.status_code == 200 and r.headers["content-encoding"] == "gzip" and r.headers["cache-control"] == "no-cache"
    page = r.text
    links = re.findall(r'<link rel="modulepreload" href="([^"]+)">', page)
    # every module app.js reaches through static imports, and the import map's three.js first; app.js itself is
    # the page's module script; aikeys.js and connect.js are imported later, on demand
    for m in ("vendor/three.module.min.js", "js/viewer.js", "js/ui/pm.js", "js/sketch/solver.js", "js/sketch/offset.js",
              "js/asmsolver.js", "js/md.js", "js/files.js"):
        assert m in links, m
    assert links[0] == "vendor/three.module.min.js" and "js/app.js" not in links and "js/connect.js" not in links
    assert len(links) == len(set(links))
    for m in links:
        assert client.get("/" + m).status_code == 200, m
    # after the import map (a modulepreload before it would make the browser ignore the map) and before app.js
    assert page.index('type="importmap"') < page.index('rel="modulepreload"') < page.index('src="js/app.js"')
    assert '<link rel="preload" href="/api/features" as="fetch" crossorigin>' in page.split("</head>")[0]
    assert client.get("/", headers={**GZ, "If-None-Match": r.headers["etag"]}).status_code == 304
    # the review viewer gets the same links, relative, so they load from /review/
    from opensketch import review
    viewer = server._preload_modules(review.viewer_page("x" * 32, server.STATIC))
    assert '<link rel="modulepreload" href="js/viewer.js">' in viewer and "manifest" not in viewer


def test_service_worker_and_review_files(client):
    sw = client.get("/sw.js", headers=GZ)
    assert sw.status_code == 200 and sw.headers["content-encoding"] == "gzip" and server.VERSION in sw.text
    assert sw.headers["service-worker-allowed"] == "/" and sw.headers["cache-control"] == "no-cache"
    assert client.get("/sw.js", headers={**GZ, "If-None-Match": sw.headers["etag"]}).status_code == 304
    for asset in server._shell_assets():  # everything the service worker precaches exists
        assert client.get(asset).status_code == 200, asset
    m = client.get("/manifest.webmanifest", headers=GZ)
    assert m.headers["content-type"].startswith("application/manifest+json") and m.json()["display"] == "standalone"
    rv = client.get("/review/js/app.js", headers=GZ)
    assert rv.status_code == 200 and rv.headers["content-encoding"] == "gzip"
    assert client.get("/review/js/app.js", headers={"If-None-Match": rv.headers["etag"]}).status_code == 304
    assert client.get("/review/js/../../server.py").status_code == 404
    assert client.get("/review/docs/x.json").status_code == 404
    # a published review's data is gzipped on disk and sent as it is, never gzipped twice
    p = store.data_dir() / "reviews"
    p.mkdir(parents=True, exist_ok=True)
    token = "t" * 32
    (p / f"{token}.json.gz").write_bytes(gzip.compress(b'{"ok": true}'))
    d = client.get(f"/review/{token}/data", headers=GZ)
    assert d.status_code == 200 and d.headers["content-encoding"] == "gzip" and d.json() == {"ok": True}
