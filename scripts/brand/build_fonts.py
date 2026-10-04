"""Builds "GoCore Display", the heading typeface: Archivo (OFL) inclined at 75 degrees.

Engineering lettering (IS 9609 / ISO 3098, as taught in N. D. Bhatt's Engineering Drawing) is either
vertical or inclined at 75 degrees to the horizontal, 15 degrees from vertical. Browsers can only fake
an oblique at an angle of their choosing, so this script shears the outlines by exactly 15 degrees and
ships them as real font files. The wordmark uses the same angle (scripts/brand/build_brand.py).

Stroke weight follows size: in drawings, line thickness is a fixed fraction of letter height, and on
screens smaller letters need relatively heavier strokes to stay legible. So large display and section
headings use 600 (stroke about h/5), smaller headings use 700 (about h/4.5), and body text stays upright
Inter Tight 400 (about h/8). Measured with fontTools; see the comments in src/styles/global.css.

Outputs public/fonts/gocore-display-600.woff2 and gocore-display-700.woff2 (Latin subset, kerned).
Requirements: Python 3.10+, `pip install fonttools brotli`.
Run: python scripts/brand/build_fonts.py
"""
import math
import os

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
FONT = os.path.join(ROOT, "brand-source", "fonts", "Archivo-Variable.ttf")
OUT = os.path.join(ROOT, "public", "fonts")

SLANT = 15.0     # degrees from vertical, i.e. lettering inclined at 75 degrees
WIDTH = 104      # Archivo width axis: slightly extended, like drafting lettering
WEIGHTS = (600, 700)

UNICODES = (
    list(range(0x20, 0x7F))            # Basic Latin
    + list(range(0xA0, 0x180))         # Latin-1 Supplement and Latin Extended-A
    + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x2032, 0x2033, 0x20AC, 0x2122, 0x2192, 0x2212]
)


def build(weight):
    font = instancer.instantiateVariableFont(TTFont(FONT), {"wght": weight, "wdth": WIDTH})

    opts = subset.Options()
    opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "tnum", "lnum", "pnum", "case"]
    opts.hinting = False
    opts.notdef_outline = True
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)

    # Shear every outline about the baseline: x' = x + y * tan(15 degrees).
    k = math.tan(math.radians(SLANT))
    glyph_set = font.getGlyphSet()
    sheared = {}
    for name in font.getGlyphOrder():
        rec = DecomposingRecordingPen(glyph_set)
        glyph_set[name].draw(rec)
        pen = TTGlyphPen(None)
        rec.replay(TransformPen(pen, (1, 0, k, 1, 0, 0)))
        sheared[name] = pen.glyph()
    glyf, hmtx = font["glyf"], font["hmtx"]
    for name, glyph in sheared.items():
        glyf[name] = glyph
        glyph.recalcBounds(glyf)
        advance, _ = hmtx[name]
        # Keep the glyph origin where it was: the left side bearing must equal the new xMin.
        hmtx[name] = (advance, glyph.xMin if glyph.numberOfContours else 0)

    for tag in ("fpgm", "prep", "cvt ", "hdmx", "LTSH", "VDMX"):
        if tag in font:
            del font[tag]
    font["post"].italicAngle = -SLANT
    font["OS/2"].usWeightClass = weight
    font["OS/2"].fsSelection = (font["OS/2"].fsSelection | 0x01) & ~0x40  # italic, not regular
    font["head"].macStyle |= 0x02
    names = font["name"]
    style = f"{weight} Inclined"
    for rec in list(names.names):
        if rec.nameID in (1, 16):
            names.setName("GoCore Display", rec.nameID, rec.platformID, rec.platEncID, rec.langID)
        elif rec.nameID in (2, 17):
            names.setName(style, rec.nameID, rec.platformID, rec.platEncID, rec.langID)
        elif rec.nameID == 4:
            names.setName(f"GoCore Display {style}", rec.nameID, rec.platformID, rec.platEncID, rec.langID)
        elif rec.nameID == 6:
            names.setName(f"GoCoreDisplay-{weight}Inclined", rec.nameID, rec.platformID, rec.platEncID, rec.langID)

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"gocore-display-{weight}.woff2")
    font.flavor = "woff2"
    font.save(path)
    return path, os.path.getsize(path)


if __name__ == "__main__":
    for w in WEIGHTS:
        path, size = build(w)
        print(f"{os.path.relpath(path, ROOT)}  {size / 1024:.1f} KB")
