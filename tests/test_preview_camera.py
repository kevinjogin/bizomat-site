"""preview_document camera (yaw, pitch, target, view_width) and section cut (idea from SolidCraft)."""
import json
import struct
import zlib

import numpy as np
import pytest

from opensketch import preview

SHELL = json.load(open("tests/reference_parts/shell_open_top.json"))


def pixels(png: bytes) -> np.ndarray:
    """Decode the renderer's own PNG (8-bit RGB, filter 0) back to an array."""
    w, h = struct.unpack(">II", png[16:24])
    raw = zlib.decompress(png[png.index(b"IDAT") + 4:png.index(b"IEND") - 8])
    rows = np.frombuffer(raw, np.uint8).reshape(h, 1 + 3 * w)[:, 1:]
    return rows.reshape(h, w, 3)


def orange(img) -> int:
    return int(np.sum((img[..., 0] > 120) & (img[..., 2] < 110) & (img[..., 0] - img[..., 2] > 60)))


def test_camera_direction_matches_named_views():
    assert np.allclose(preview.camera_direction(0, 0), [0, 0, 1])
    assert np.allclose(preview.camera_direction(90, 0), [1, 0, 0])
    assert np.allclose(preview.camera_direction(0, 90), [0, 1, 0], atol=1e-12)
    iso = preview.camera_direction(45, np.degrees(np.arctan(1 / np.sqrt(2))))
    assert np.allclose(iso, np.array([1, 1, 1]) / np.sqrt(3))


def test_yaw_pitch_equals_named_view():
    doc = {"features": SHELL["features"]}
    a = pixels(preview.render_preview(doc, "front", 256, 192))
    b = pixels(preview.render_preview(doc, "isometric", 256, 192, yaw=0, pitch=0))
    assert np.array_equal(a, b)


def test_section_shows_cut_faces_and_close_up_zooms():
    doc = {"features": SHELL["features"]}
    plain = pixels(preview.render_preview(doc, width=320, height=240, yaw=60, pitch=25))
    cut = pixels(preview.render_preview(doc, width=320, height=240, yaw=60, pitch=25,
                                        section={"point": [20, 15, 10], "normal": [1, 0, 0]}))
    assert orange(plain) == 0 and orange(cut) > 500
    wide = pixels(preview.render_preview(doc, width=320, height=240, yaw=30, pitch=40))
    close = pixels(preview.render_preview(doc, width=320, height=240, yaw=30, pitch=40, target=[40, 30, 20], view_width=15))
    bg = np.array(preview.BACKGROUND)
    assert np.mean(np.all(close == bg, axis=-1)) < np.mean(np.all(wide == bg, axis=-1))  # the part fills the frame


@pytest.mark.parametrize("kw,msg", [({"section": {"point": [0, 0]}}, "section"), ({"section": {"point": [0, 0, 0], "normal": [0, 0, 0]}}, "non-zero"),
                                    ({"pitch": 120}, "pitch"), ({"view_width": -1}, "view_width"), ({"target": [1, 2]}, "target"),
                                    ({"section": {"point": [-100, 0, 0], "normal": [1, 0, 0]}}, "removes all")])
def test_bad_camera_or_section(kw, msg):
    with pytest.raises(ValueError, match=msg):
        preview.render_preview({"features": SHELL["features"]}, width=200, height=200, **kw)


