"""Headless previews show holes, solved placements, colours and visible surfaces."""
import copy
import struct
import zlib

import numpy as np
import pytest

from opensketch import preview
from opensketch.preview import BACKGROUND, render_preview
from tests.test_geometry import circle_ent, rect_sketch


def pixels(png):
    assert png[:8] == b"\x89PNG\r\n\x1a\n"
    pos, data, size = 8, b"", None
    while pos < len(png):
        n = struct.unpack(">I", png[pos:pos + 4])[0]
        kind, chunk = png[pos + 4:pos + 8], png[pos + 8:pos + 8 + n]
        assert zlib.crc32(kind + chunk) == struct.unpack(">I", png[pos + 8 + n:pos + 12 + n])[0]
        if kind == b"IHDR":
            size = struct.unpack(">IIBBBBB", chunk)
        if kind == b"IDAT":
            data += chunk
        pos += n + 12
    w, h, bits, color, *_ = size
    assert (bits, color) == (8, 2)
    rows = np.frombuffer(zlib.decompress(data), dtype=np.uint8).reshape(h, w * 3 + 1)
    assert (rows[:, 0] == 0).all()
    return rows[:, 1:].reshape(h, w, 3)


def block(hole=False, color="#ff0000"):
    return {"appearance": color, "features": [
        rect_sketch("s", {"ref": "Top Plane"}, 0, 0, 20, 20,
                    circle_ent("hole", 10, 10, 4) if hole else ()),
        {"id": "e", "type": "extrude", "sketch": "s", "depth": 5},
    ]}


def test_png_has_geometry_and_open_through_hole_without_mutating_doc():
    doc = block(hole=True)
    before = copy.deepcopy(doc)
    image = pixels(render_preview(doc, "top", 256, 192))
    assert image.shape == (192, 256, 3)
    assert tuple(image[96, 128]) == BACKGROUND
    assert tuple(image[0, 0]) == BACKGROUND
    assert image[96, 65, 0] > 100 and image[96, 65, 1] == 0
    assert doc == before


def test_depth_buffer_hides_back_component_in_both_orders():
    doc = {"type": "assembly", "parts": {"near": block(color="#ff0000"), "far": block(color="#0000ff")},
           "components": [
               {"id": "back", "part": "far", "fixed": True, "position": [0, 0, 0]},
               {"id": "front", "part": "near", "fixed": True, "position": [0, 10, 0]}], "mates": []}
    a = pixels(render_preview(doc, "top", 128, 128))
    doc["components"].reverse()
    b = pixels(render_preview(doc, "top", 128, 128))
    assert a[64, 64, 0] > 100 and a[64, 64, 2] == 0
    assert np.array_equal(a, b)
    doc["components"][0]["hidden"] = True
    c = pixels(render_preview(doc, "top", 128, 128))
    assert c[64, 64, 2] > 100 and c[64, 64, 0] == 0


@pytest.mark.parametrize("view", ["isometric", "top", "front", "right"])
def test_standard_views_contain_visible_geometry(view):
    image = pixels(render_preview(block(), view, 128, 128))
    assert np.any(np.any(image != BACKGROUND, axis=2))


def test_preview_rejects_partial_geometry_and_invalid_requests():
    doc = block()
    doc["features"].append({"id": "broken", "type": "extrude", "sketch": "missing", "depth": 2})
    with pytest.raises(ValueError, match="feature errors"):
        render_preview(doc)
    with pytest.raises(ValueError, match="No visible"):
        render_preview({"features": []})
    with pytest.raises(ValueError, match="View must"):
        render_preview(block(), "bad")
    for width in (True, 0, 1601, 128.5):
        with pytest.raises(ValueError, match="integers"):
            render_preview(block(), width=width)


def test_standard_view_orientation_and_rotated_component():
    doc = {"features": [rect_sketch("s", {"ref": "Top Plane"}, 0, 0, 20, 10),
                        {"id": "e", "type": "extrude", "sketch": "s", "depth": 5}]}

    def aspect(model, view):
        image = pixels(render_preview(model, view, 256, 256))
        y, x = np.where(np.any(image != BACKGROUND, axis=2))
        return (x.max() - x.min()) / (y.max() - y.min())

    assert aspect(doc, "top") == pytest.approx(2, rel=0.03)
    assert aspect(doc, "front") == pytest.approx(4, rel=0.03)
    assert aspect(doc, "right") == pytest.approx(2, rel=0.03)
    asm = {"type": "assembly", "parts": {"block": doc}, "mates": [],
           "components": [{"id": "b", "part": "block", "fixed": True,
                           "position": [30, 10, 20], "rotation": [0, 0, 90]}]}
    assert aspect(asm, "front") == pytest.approx(0.25, rel=0.03)


def test_preview_limits_projected_work_even_with_few_triangles(monkeypatch):
    monkeypatch.setattr(preview, "MAX_RASTER_PIXELS", 100)
    with pytest.raises(ValueError, match="too complex"):
        render_preview(block(), "top", 128, 128)
    monkeypatch.setattr(preview, "MAX_RASTER_PIXELS", 100_000_000)
    monkeypatch.setattr(preview, "MAX_EDGE_SAMPLES", 1)
    with pytest.raises(ValueError, match="too many edges"):
        render_preview(block(), "top", 128, 128)
