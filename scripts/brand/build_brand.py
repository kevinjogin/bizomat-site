"""Builds the GoCore wordmark and brand artwork.

The logo is a wordmark only: "GoCore" set in Archivo (OFL, brand-source/fonts) at a heavy weight
and slightly extended width, inclined at 75 degrees like standard engineering lettering
(IS 9609 / ISO 3098; the same angle as the site's headings, see scripts/brand/build_fonts.py). "Go" is shaded blue and "Core"
orange-red, each with a deeper-coloured depth layer, carrying over the colours of the original
GoCore logo. The same colours read on light and dark backgrounds, so one version serves both.

Text is converted to outlines, so no font is needed wherever the logo appears.

Outputs:
  src/data/logo.json                 geometry for src/components/Logo.astro and the hero graphic
  brand-source/generated/*.svg       artwork rasterised by scripts/prepare-brand.mjs

Requirements: Python 3.10+, `pip install fonttools uharfbuzz`.
Run: python scripts/brand/build_brand.py && node scripts/prepare-brand.mjs
"""
import json
import math
import os

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
FONT = os.path.join(ROOT, "brand-source", "fonts", "Archivo-Variable.ttf")
OUT_JSON = os.path.join(ROOT, "src", "data", "logo.json")
OUT_DIR = os.path.join(ROOT, "brand-source", "generated")

# Colours carried over from the original logo: shaded blue for "Go", shaded orange-red for "Core".
BLUE = ["#4f95ff", "#1a5cf0", "#0a3bc4"]     # top, middle, bottom
BLUE_DEPTH = "#0a2f99"
ORANGE = ["#ffae33", "#ff6a13", "#ef3b00"]
ORANGE_DEPTH = "#b83000"
INK_DARK = "#0f0f0e"
INK_LIGHT = "#f2f0ea"

AXES = {"wght": 900, "wdth": 118}
TRACKING = -0.03       # em
SLANT = 15.0           # degrees from vertical: engineering lettering inclined at 75 degrees
SIZE = 64.0            # design size; the viewBox is expressed in these units
DEPTH = 0.03           # depth layer offset, as a fraction of the size


def n(v):
    s = "%.2f" % v
    return s.rstrip("0").rstrip(".") if "." in s else s


_cache = {}


def _font(axes):
    key = tuple(sorted(axes.items()))
    if key not in _cache:
        face = hb.Face(hb.Blob.from_file_path(FONT))
        font = hb.Font(face)
        font.set_variations(axes)
        _cache[key] = (face, font)
    return _cache[key]


def shape(text, size, axes, tracking=0.0, x=0.0, y=0.0, slant=0.0):
    """Shape `text` with kerning. Returns per-glyph SVG paths (y-down, baseline at y), bounds and advance."""
    face, font = _font(axes)
    upem = face.upem
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True})
    s = size / upem
    k = math.tan(math.radians(slant))
    glyphs, rec, pen_x = [], RecordingPen(), 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        g = RecordingPen()
        font.draw_glyph_with_pen(info.codepoint, g)
        # Font units are y-up; flip to y-down and lean the glyph forward around the baseline.
        m = (s, 0, s * k, -s, x + (pen_x + pos.x_offset) * s, y - pos.y_offset * s)
        pen = SVGPathPen(None, ntos=n)
        g.replay(TransformPen(pen, m))
        g.replay(TransformPen(rec, m))
        glyphs.append(pen.getCommands())
        pen_x += pos.x_advance + tracking * upem
    bp = BoundsPen(None)
    rec.replay(bp)
    return glyphs, bp.bounds, (pen_x - tracking * upem) * s


def metrics(size, axes):
    face, _ = _font(axes)
    os2 = TTFont(FONT)["OS/2"]
    return os2.sCapHeight * size / face.upem, os2.sxHeight * size / face.upem


# ---------- wordmark ----------
CAP, _XH = metrics(SIZE, AXES)
PAD = 2.0
_, raw_bounds, _ = shape("GoCore", SIZE, AXES, TRACKING, 0, 0, SLANT)
X0 = PAD - raw_bounds[0]
BASELINE = PAD - raw_bounds[1]
GLYPHS, BOUNDS, _ = shape("GoCore", SIZE, AXES, TRACKING, X0, BASELINE, SLANT)
GO_D = " ".join(GLYPHS[:2])
CORE_D = " ".join(GLYPHS[2:])
DEPTH_Y = SIZE * DEPTH
WIDTH = math.ceil(BOUNDS[2] + PAD)
HEIGHT = math.ceil(BOUNDS[3] + DEPTH_Y + PAD)
GRAD_TOP, GRAD_BOTTOM = BASELINE - CAP, BASELINE + 2


def defs(prefix, top=GRAD_TOP, bottom=GRAD_BOTTOM):
    def grad(name, stops):
        return (
            f'<linearGradient id="{prefix}-{name}" x1="0" y1="{n(top)}" x2="0" y2="{n(bottom)}" gradientUnits="userSpaceOnUse">'
            f'<stop offset="0" stop-color="{stops[0]}"/><stop offset="0.55" stop-color="{stops[1]}"/>'
            f'<stop offset="1" stop-color="{stops[2]}"/></linearGradient>'
        )
    return grad("go", BLUE) + grad("core", ORANGE)


def wordmark_body(prefix, go_d=GO_D, core_d=CORE_D, depth=DEPTH_Y):
    return (
        f'<g transform="translate(0 {n(depth)})"><path d="{go_d}" fill="{BLUE_DEPTH}"/><path d="{core_d}" fill="{ORANGE_DEPTH}"/></g>'
        f'<path d="{go_d}" fill="url(#{prefix}-go)"/><path d="{core_d}" fill="url(#{prefix}-core)"/>'
    )


def wordmark_svg(scale=4):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" width="{WIDTH * scale}" height="{HEIGHT * scale}">'
        f"<title>GoCore</title><defs>{defs('gc')}</defs>{wordmark_body('gc')}</svg>"
    )


# ---------- monogram icon (favicons, app icons, assistant avatar) ----------
def monogram(size, cx, cy):
    """'G' blue and 'C' orange-red, centred on (cx, cy), in the wordmark style."""
    glyphs, b, _ = shape("GC", size, AXES, -0.01, 0, 0, SLANT)
    dx = cx - (b[0] + b[2]) / 2
    dy = cy - (b[1] + b[3]) / 2
    glyphs, b, _ = shape("GC", size, AXES, -0.01, dx, dy, SLANT)
    cap, _ = metrics(size, AXES)
    return glyphs[0], glyphs[1], dy - cap, dy + 2, size * DEPTH


def tile_svg(px=512, rounded=True, letter_size=33.0):
    s = 64
    r = 14 if rounded else 0
    g_d, c_d, top, bottom, depth = monogram(letter_size, 32, 31.2)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {s} {s}" width="{px}" height="{px}">'
        f'<defs><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f29"/>'
        f'<stop offset="1" stop-color="#0b0d12"/></linearGradient>{defs("i", top, bottom)}</defs>'
        f'<rect width="{s}" height="{s}" rx="{r}" fill="url(#t)"/>'
        f'{wordmark_body("i", g_d, c_d, depth)}</svg>'
    )


# ---------- social card ----------
def og_svg():
    W, H = 1200, 630
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><defs>',
        '<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.045"/></pattern>',
        '<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#1456e8" stop-opacity="0.3"/><stop offset="1" stop-color="#1456e8" stop-opacity="0"/></radialGradient>',
        defs("og"),
        "</defs>",
        f'<rect width="{W}" height="{H}" fill="#0f0f0e"/><rect width="{W}" height="{H}" fill="url(#grid)"/>',
    ]
    # Right: four numbered service nodes on an orbit around the core.
    ox, oy, orad = 935, 318, 200
    p.append(f'<circle cx="{ox}" cy="{oy}" r="290" fill="url(#glow)"/>')
    p.append(f'<circle cx="{ox}" cy="{oy}" r="{orad}" fill="none" stroke="#4f95ff" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="3 9"/>')
    labels = ["Engineering & CAD", "Manufacturing", "Operations", "Projects"]
    for i, a in enumerate((-135, -45, 45, 135)):
        x, y = ox + orad * math.cos(math.radians(a)), oy + orad * math.sin(math.radians(a))
        p.append(f'<circle cx="{n(x)}" cy="{n(y)}" r="27" fill="#0f0f0e" stroke="#ff6a13" stroke-width="2"/>')
        g, b, _ = shape(f"0{i + 1}", 19, {"wght": 700, "wdth": 100}, 0.02)
        g, _, _ = shape(f"0{i + 1}", 19, {"wght": 700, "wdth": 100}, 0.02, x - (b[0] + b[2]) / 2, y - (b[1] + b[3]) / 2)
        p.append(f'<path d="{" ".join(g)}" fill="#ff8a3d"/>')
        lg, lb, _ = shape(labels[i], 17, {"wght": 600, "wdth": 100}, 0)
        lx = x - (lb[0] + lb[2]) / 2
        ly = y - 40 if a < 0 else y + 40 + (lb[3] - lb[1])
        lg, _, _ = shape(labels[i], 17, {"wght": 600, "wdth": 100}, 0, lx, ly - lb[3])
        p.append(f'<path d="{" ".join(lg)}" fill="#c9c6be"/>')
    g_d, c_d, top, bottom, depth = monogram(118, ox, oy)
    p.append(f'<defs>{defs("ogm", top, bottom)}</defs>{wordmark_body("ogm", g_d, c_d, depth)}')
    # Left: wordmark, headline, line of services, address.
    k = 1.45
    p.append(f'<g transform="translate(70 66) scale({k})">{wordmark_body("og")}</g>')
    y = 268
    head = {"wght": 600, "wdth": 104}
    for line in ("Engineering support", "that gets manufacturing"):
        g, _, _ = shape(line, 50, head, -0.02, 72, y, SLANT)
        p.append(f'<path d="{" ".join(g)}" fill="{INK_LIGHT}"/>')
        y += 60
    g1, _, a1 = shape("work ", 50, head, -0.02, 72, y, SLANT)
    g2, _, _ = shape("moving.", 50, head, -0.02, 72 + a1, y, SLANT)
    p.append(f'<path d="{" ".join(g1)}" fill="{INK_LIGHT}"/><path d="{" ".join(g2)}" fill="#ff7a29"/>')
    g, _, _ = shape("CAD · Manufacturing · Operations · Projects", 21, {"wght": 560, "wdth": 100}, 0, 72, 520)
    p.append(f'<path d="{" ".join(g)}" fill="#c9c6be"/>')
    g, _, _ = shape("gocore.com.au", 19, {"wght": 560, "wdth": 100}, 0.01, 72, 566)
    p.append(f'<path d="{" ".join(g)}" fill="#8a867e"/>')
    p.append("</svg>")
    return "".join(p)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    data = {
        "_comment": "Generated by scripts/brand/build_brand.py. Do not edit by hand.",
        "width": WIDTH,
        "height": HEIGHT,
        "go": GO_D,
        "core": CORE_D,
        "depth": round(DEPTH_Y, 2),
        "gradient": {"top": round(GRAD_TOP, 2), "bottom": round(GRAD_BOTTOM, 2)},
        "blue": BLUE,
        "blueDepth": BLUE_DEPTH,
        "orange": ORANGE,
        "orangeDepth": ORANGE_DEPTH,
    }
    with open(OUT_JSON, "w", encoding="utf8", newline="\n") as f:
        json.dump(data, f, indent=2)
        f.write("\n")
    files = {
        "gocore-logo.svg": wordmark_svg(),
        "gocore-icon.svg": tile_svg(512),
        "gocore-icon-small.svg": tile_svg(64, letter_size=36),
        "gocore-icon-square.svg": tile_svg(512, rounded=False, letter_size=31),
        "og-default.svg": og_svg(),
    }
    for name, svg in files.items():
        with open(os.path.join(OUT_DIR, name), "w", encoding="utf8", newline="\n") as f:
            f.write(svg)
    print(f"logo.json + {len(files)} SVGs written; wordmark {WIDTH}x{HEIGHT}")


if __name__ == "__main__":
    main()
