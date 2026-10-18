"""Browser-free orthographic CAD previews, rendered from the rebuilt tessellation.

This is a geometry preview, not a browser screenshot. A depth buffer hides back
faces and edges. NumPy and the standard PNG encoder keep it usable on headless
Codespaces/Fly hosts without Chromium, a display server, or a graphics driver.
"""
from __future__ import annotations

import re
import struct
import zlib

import numpy as np

from . import assembly, geometry

VIEWS = {
    "isometric": ((1, 0.8, 1), (0, 1, 0)),
    "top": ((0, 1, 0), (0, 0, -1)),
    "front": ((0, 0, 1), (0, 1, 0)),
    "right": ((1, 0, 0), (0, 1, 0)),
}
BACKGROUND = (245, 247, 250)
MAX_RASTER_PIXELS = 100_000_000
MAX_EDGE_SAMPLES = 1_000_000


def _color(value):
    if not isinstance(value, str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", value):
        value = "#a8b8c8"
    return np.array([int(value[i:i + 2], 16) for i in (1, 3, 5)], dtype=float)


CUT_COLOR = np.array([214.0, 134.0, 60.0])  # section faces, like SOLIDWORKS section caps


def _section_mesh(solid, matrix, section):
    """The solid with everything on the section normal's side removed, meshed (cut faces are real faces)."""
    from build123d import Keep, Plane
    inv = np.linalg.inv(matrix)
    p = inv[:3, :3] @ np.array(section["point"], float) + inv[:3, 3]
    n = inv[:3, :3] @ np.array(section["normal"], float)
    kept = solid.split(Plane(origin=tuple(p), z_dir=tuple(n)), keep=Keep.BOTTOM)
    if kept is None or not getattr(kept, "volume", 0):
        return {"faces": [], "edges": []}, (p, n / np.linalg.norm(n))
    return geometry.mesh_shape(kept), (p, n / np.linalg.norm(n))


def _check_section(section):
    if section is None:
        return None
    try:
        pt, nm = [float(x) for x in section["point"]], [float(x) for x in section["normal"]]
    except (KeyError, TypeError, ValueError):
        raise ValueError('section must be {"point": [x, y, z], "normal": [x, y, z]}') from None
    if len(pt) != 3 or len(nm) != 3 or not np.all(np.isfinite(pt + nm)) or np.linalg.norm(nm) < 1e-9:
        raise ValueError('section must be {"point": [x, y, z], "normal": [x, y, z]} with a non-zero normal')
    return {"point": pt, "normal": nm}


def _meshes(doc, section=None):
    """Yield visible meshes, their solved transforms, appearance colours and the local cut plane (if any)."""
    if not assembly.is_assembly(doc):
        result = geometry.regen_result(doc)
        if any(s["state"] == "error" for s in result["status"]):
            raise ValueError("Fix feature errors before rendering a preview")
        if section:
            st, _ = geometry.regen(doc)
            body, cut = _section_mesh(st.part, np.eye(4), section)
            yield body, np.eye(4), _color(doc.get("appearance")), cut
            return
        yield result["body"], np.eye(4), _color(doc.get("appearance")), None
        return
    result = assembly.regen_assembly(doc)
    if any(m["state"] == "error" for m in result["mates"]):
        raise ValueError("Fix mate errors before rendering a preview")
    originals = {c["id"]: c for c in doc.get("components", [])}
    for c in result["components"]:
        original = originals[c["id"]]
        if original.get("suppressed"):
            continue
        part = result["parts"].get(c["part"])
        if c["state"] == "error" or part is None:
            raise ValueError(f"Component {c['id']} has no usable part")
        if any(s["state"] == "error" for s in part["status"]):
            raise ValueError(f"Fix feature errors in {c['part']} before rendering a preview")
        if not part["body"]["faces"]:
            raise ValueError(f"Component {c['id']} has no solid body")
        if not original.get("hidden"):
            matrix = np.array(c["matrix"]).reshape(4, 4)
            if section:
                solid = assembly.build_part(assembly.part_of(doc, original))["solid"]
                body, cut = _section_mesh(solid, matrix, section)
                yield body, matrix, _color(part.get("appearance")), cut
            else:
                yield part["body"], matrix, _color(part.get("appearance")), None


def _png(rgb):
    height, width, channels = rgb.shape

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))

    rows = b"".join(b"\x00" + row.tobytes() for row in rgb)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6 if channels == 4 else 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(rows)) + chunk(b"IEND", b""))


def camera_direction(yaw: float, pitch: float) -> np.ndarray:
    """Unit vector from the target toward the eye. yaw (deg) turns about +Y from the front (+Z) toward the
    right (+X); pitch (deg) lifts the eye above the XZ plane. yaw 0, pitch 0 = Front; yaw 90 = Right;
    pitch 90 = Top; yaw 45, pitch 35.26 = isometric."""
    y, p = np.radians(yaw), np.radians(pitch)
    return np.array([np.sin(y) * np.cos(p), np.sin(p), np.cos(y) * np.cos(p)])


def render_preview(doc: dict, view: str = "isometric", width: int = 960, height: int = 720,
                   yaw: float | None = None, pitch: float | None = None, target: list | None = None,
                   view_width: float | None = None, section: dict | None = None, transparent: bool = False) -> bytes:
    """Render a part or solved assembly to PNG without changing its document.

    Views use OpenSketch's Y-up convention. Hidden/suppressed components are not
    drawn. Bounds are fitted to the visible geometry with an eight percent margin,
    unless target / view_width ask for a close-up. yaw and pitch (degrees) give any
    direction. section {point, normal} cuts the solids and removes the normal's side;
    cut faces are drawn in orange. transparent=True gives an RGBA PNG with no background (thumbnails).
    """
    if view not in VIEWS:
        raise ValueError("View must be isometric, top, front or right")
    if any(isinstance(v, bool) or not isinstance(v, int) or not 128 <= v <= 1600 for v in (width, height)):
        raise ValueError("Preview width and height must be integers from 128 to 1600")
    section = _check_section(section)
    if view_width is not None and not (isinstance(view_width, (int, float)) and 0 < view_width < 1e6):
        raise ValueError("view_width is the width shown, in mm, more than 0")
    if target is not None and not (isinstance(target, list) and len(target) == 3 and all(isinstance(v, (int, float)) for v in target)):
        raise ValueError("target must be [x, y, z]")
    direction, up = (np.array(v, dtype=float) for v in VIEWS[view])
    if yaw is not None or pitch is not None:
        pitch = float(pitch or 0)
        if not -90 <= pitch <= 90:
            raise ValueError("pitch must be from -90 to 90 degrees")
        direction = camera_direction(float(yaw or 0), pitch)
        up = np.array([0.0, 1.0, 0.0]) if abs(pitch) < 89.9 else np.array([0.0, 0.0, -np.sign(pitch)])
    direction /= np.linalg.norm(direction)
    right = np.cross(up, direction)
    right /= np.linalg.norm(right)
    up = np.cross(direction, right)
    camera = np.array([right, up, direction]).T
    faces, edges = [], []
    for mesh, matrix, color, cut in _meshes(doc, section):
        def world(points):
            return np.array(points, dtype=float).reshape(-1, 3) @ matrix[:3, :3].T + matrix[:3, 3]
        for face in mesh["faces"]:
            local = np.array(face["positions"], dtype=float).reshape(-1, 3)
            vertices = world(face["positions"])
            indices = np.array(face["indices"], dtype=int).reshape(-1, 3)
            on_cut = cut is not None and len(local) and np.all(np.abs((local - cut[0]) @ cut[1]) < 1e-4 * max(1.0, float(np.ptp(local))))
            if len(indices):
                faces.append((vertices, indices, CUT_COLOR if on_cut else color))
        edges.extend(world(edge["points"]) for edge in mesh["edges"])
    if not faces:
        raise ValueError("No visible solid body to preview" + (" (the section removes all of it)" if section else ""))
    if sum(len(indices) for _, indices, _ in faces) > 250_000:
        raise ValueError("Preview exceeds 250,000 triangles; select a smaller part")
    vertices = np.concatenate([v for v, _, _ in faces])
    if not np.all(np.isfinite(vertices)):
        raise ValueError("Preview geometry contains non-finite coordinates")
    center = (vertices.min(0) + vertices.max(0)) / 2
    projected = (vertices - center) @ camera
    lo, hi = projected.min(0), projected.max(0)
    span = np.maximum(hi[:2] - lo[:2], 1e-9)
    scale = min(width * 0.84 / span[0], height * 0.84 / span[1])
    middle = (lo[:2] + hi[:2]) / 2
    if target is not None:  # close-up: centre the view on the target point
        middle = ((np.array(target, dtype=float) - center) @ camera)[:2]
    if view_width is not None:
        scale = width / float(view_width)

    def project(points):
        p = (points - center) @ camera
        p[:, 0] = (p[:, 0] - middle[0]) * scale + width / 2
        p[:, 1] = -(p[:, 1] - middle[1]) * scale + height / 2
        return p

    rgb = np.full((height, width, 3), BACKGROUND, dtype=np.uint8)
    depth = np.full((height, width), -np.inf)
    light = np.array([0.3, 0.9, 0.5])
    light /= np.linalg.norm(light)
    raster_pixels = 0
    for vertices, indices, color in faces:
        screen = project(vertices)
        for tri in indices:
            a, b, c = screen[tri]
            xmin = max(0, int(np.floor(min(a[0], b[0], c[0]))))
            xmax = min(width - 1, int(np.ceil(max(a[0], b[0], c[0]))))
            ymin = max(0, int(np.floor(min(a[1], b[1], c[1]))))
            ymax = min(height - 1, int(np.ceil(max(a[1], b[1], c[1]))))
            denominator = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
            if abs(denominator) < 1e-10 or xmin > xmax or ymin > ymax:
                continue
            raster_pixels += (ymax - ymin + 1) * (xmax - xmin + 1)
            if raster_pixels > MAX_RASTER_PIXELS:
                raise ValueError("Preview is too complex; select a smaller part or reduce image dimensions")
            normal = np.cross(vertices[tri[1]] - vertices[tri[0]], vertices[tri[2]] - vertices[tri[0]])
            normal /= np.linalg.norm(normal) or 1
            shade = 0.58 + 0.42 * abs(float(normal @ light))
            # Limit transient arrays even when one face fills the maximum-size image.
            for row in range(ymin, ymax + 1, 128):
                end = min(row + 128, ymax + 1)
                yy, xx = np.mgrid[row:end, xmin:xmax + 1]
                x, y = xx + 0.5, yy + 0.5
                w0 = ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / denominator
                w1 = ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / denominator
                w2 = 1 - w0 - w1
                z = w0 * a[2] + w1 * b[2] + w2 * c[2]
                target = depth[row:end, xmin:xmax + 1]
                mask = (w0 >= -1e-8) & (w1 >= -1e-8) & (w2 >= -1e-8) & (z > target)
                target[mask] = z[mask]
                rgb[row:end, xmin:xmax + 1][mask] = np.clip(color * shade, 0, 255).astype(np.uint8)
    # Draw only visible model edges; do not reveal edges through solid faces.
    edge_samples = 0
    for line in edges:
        screen = project(line)
        for a, b in zip(screen[:-1], screen[1:]):
            count = max(2, int(np.ceil(np.max(np.abs(b[:2] - a[:2])))) + 1)
            edge_samples += count
            if edge_samples > MAX_EDGE_SAMPLES:
                raise ValueError("Preview has too many edges; select a smaller part")
            points = a + np.linspace(0, 1, count)[:, None] * (b - a)
            xy = np.floor(points[:, :2]).astype(int)
            inside = (xy[:, 0] >= 0) & (xy[:, 0] < width) & (xy[:, 1] >= 0) & (xy[:, 1] < height)
            xy, points = xy[inside], points[inside]
            visible = points[:, 2] >= depth[xy[:, 1], xy[:, 0]] - 0.8 / scale
            xy = xy[visible]
            rgb[xy[:, 1], xy[:, 0]] = (55, 66, 76)
    if transparent:
        alpha = np.where(np.isfinite(depth), 255, 0).astype(np.uint8)
        return _png(np.dstack([rgb, alpha]))
    return _png(rgb)
