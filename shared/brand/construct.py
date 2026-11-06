#!/usr/bin/env python3
"""Constructs the BIZOMAT logo and writes shared/brand/glyphs.mjs, the geometry every other brand file is built from.

    python3 shared/brand/construct.py        (needs: pip install fonttools brotli shapely)
    node shared/brand/build.mjs              (then the SVG, PNG and ICO files, and the copies in each app)
    node shared/brand/og.mjs                 (then the social images)

The logo (6 Nov 2026):
- Wordmark: BIZOMAT in Saira SemiBold (SIL OFL 1.1, brand-source/fonts/), tracked +5 %. Clean, squared curves that
  match the Oxanium headings and the rounded tile.
- The B: Saira's B with its lower counter cut as a forward arrow. The arrow is the brand's one accent (teal): work
  that moves on by itself. That is what BIZOMAT does: business automation that connects systems and gets work done.
- Mark: the same B, white, on a navy rounded tile, the arrow teal. Favicon, app icons, the hub of the diagrams.
- Lockup: the mark and the wordmark side by side (headers and footers).

Every outline is flattened to straight segments (at most 0.15 unit from the curve, on a 240-unit cap height:
invisible at any size a logo is shown) so that every consumer reads M/L/Z paths only, the SOLIDWORKS add-in's GDI+
drawer included. Coordinates: y down, cap height 240 from y = 3 to y = 243 (the O overshoots by 2.8), the B's stem at
x = 0. The B, the arrow and the wordmark share these coordinates.
"""
from __future__ import annotations

import json
import os

from fontTools.pens.basePen import BasePen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont
from shapely.geometry import Polygon
from shapely.geometry.polygon import orient
from shapely.ops import unary_union  # noqa: F401 (the word's width)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
FONT = os.path.join(ROOT, 'brand-source', 'fonts', 'Saira-SemiBold-latin.woff2')

CAP = 240.0           # cap height in logo units
TOP = 3.0             # room above the cap height for the O's overshoot
TRACKING = 0.05       # extra space between letters, in em
TOLERANCE = 0.15      # largest distance between a flattened segment and the curve
ARROW_TIP = 0.5       # length of the arrow's point, as a share of the counter's height
TILE, RADIUS = 512, 112
MARK_B_HEIGHT = 0.50  # the B's cap height on the tile, as a share of the tile
LOCKUP_WORD = 0.44    # the wordmark's cap height in the lockup, as a share of the tile
LOCKUP_GAP = 0.30     # space between tile and wordmark, as a share of the tile

COLORS = {
    'navy': '#0a1f33',        # wordmark and ink on light backgrounds, the tile
    'ink': '#0e1726',
    'teal': '#0f766e',        # buttons and links on light (5.5:1 on white)
    'tealBright': '#2dd4bf',  # accent on dark backgrounds
    'tealMark': '#14b8a6',    # the arrow in the logo, everywhere
    'tileDark': '#16324f',    # the tile in the dark-theme lockup (the navy tile disappears on dark paper)
    'paper': '#f7f9fb',
    'white': '#ffffff',
    'darkPaper': '#0a111c',
}

font = TTFont(FONT)
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
K = CAP / font['OS/2'].sCapHeight
EM = font['head'].unitsPerEm * K


class FlatPen(BasePen):
    """A glyph as polygons: curves flattened finely (simplified later), y flipped, baseline at TOP + CAP."""

    def __init__(self, dx: float):
        super().__init__(glyph_set)
        self.dx, self.rings, self.ring, self.last = dx, [], None, None

    def _xy(self, p):
        return (self.dx + p[0] * K, TOP + CAP - p[1] * K)

    def _moveTo(self, p):
        self.ring, self.last = [self._xy(p)], p

    def _lineTo(self, p):
        self.ring.append(self._xy(p)); self.last = p

    def _curveToOne(self, a, b, c):
        p0, n = self.last, 48
        for i in range(1, n + 1):
            t = i / n; u = 1 - t
            self.ring.append(self._xy((u**3 * p0[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t**3 * c[0],
                                       u**3 * p0[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t**3 * c[1])))
        self.last = c

    def _qCurveToOne(self, a, b):
        p0, n = self.last, 48
        for i in range(1, n + 1):
            t = i / n; u = 1 - t
            self.ring.append(self._xy((u * u * p0[0] + 2 * u * t * a[0] + t * t * b[0],
                                       u * u * p0[1] + 2 * u * t * a[1] + t * t * b[1])))
        self.last = b

    def _closePath(self):
        self.rings.append(Polygon(self.ring)); self.ring = None

    _endPath = _closePath


def letter(ch: str, dx: float):
    """A letter as one shapely geometry (outer contours minus counters)."""
    pen = FlatPen(dx)
    glyph_set[cmap[ord(ch)]].draw(pen)
    rings = sorted(pen.rings, key=lambda p: -p.area)
    shape = None
    for r in rings:  # the largest is filled; one inside a filled area is a counter
        if shape is not None and shape.contains(r.representative_point()):
            shape = shape.difference(r)
        else:
            shape = r if shape is None else shape.union(r)
    return shape, pen.rings


def ink_left(ch: str) -> float:
    bp = BoundsPen(glyph_set)
    glyph_set[cmap[ord(ch)]].draw(bp)
    return bp.bounds[0] * K


def soften(poly, r):
    return poly.buffer(-r, quad_segs=32).buffer(r, quad_segs=32)


def path(geom) -> str:
    geom = orient(geom.simplify(TOLERANCE, preserve_topology=True)) if geom.geom_type == 'Polygon' else geom
    parts = [geom] if geom.geom_type == 'Polygon' else list(geom.geoms)

    def num(v):
        s = f'{v:.1f}'.rstrip('0').rstrip('.')
        return '0' if s == '-0' else s

    def ring(coords):
        pts = list(coords)[:-1]
        return 'M' + 'L'.join(f'{num(x)} {num(y)}' for x, y in pts) + 'Z'

    out = []
    for p in parts:
        p = orient(p.simplify(TOLERANCE, preserve_topology=True))
        out.append(ring(p.exterior.coords))
        out += [ring(i.coords) for i in p.interiors]
    return ''.join(out)


# ---------- the B with the forward-arrow counter ----------
x0 = -ink_left('B')                                     # the stem at x = 0
_, b_rings = letter('B', x0)
b_rings.sort(key=lambda p: -p.area)
outer, counters = b_rings[0], sorted(b_rings[1:], key=lambda p: p.bounds[1])
upper, lower = counters
lx0, ly0, lx1, ly1 = lower.bounds
cy, h = (ly0 + ly1) / 2, ly1 - ly0
tip = h * ARROW_TIP
arrow = soften(Polygon([(lx0, ly0), (lx1 - tip, ly0), (lx1 + h * 0.06, cy), (lx1 - tip, ly1), (lx0, ly1)]), 5.0)
b_shape = Polygon(outer.exterior.coords).difference(Polygon(upper.exterior.coords)).difference(arrow)
b_width = outer.bounds[2]

# ---------- the word ----------
shapes, x = [b_shape], 0.0
advance = lambda ch: glyph_set[cmap[ord(ch)]].width * K
x = x0 + advance('B') + TRACKING * EM
for ch in 'IZOMAT':
    shapes.append(letter(ch, x)[0])
    x += advance(ch) + TRACKING * EM
word = unary_union(shapes)
word_width = round(word.bounds[2], 1)
word_path = ''.join(path(s) for s in shapes)   # letter by letter, left to right: the word starts with the same B
height = TOP * 2 + CAP

# ---------- mark and lockup placement ----------
s_mark = TILE * MARK_B_HEIGHT / CAP
mark_tx = TILE / 2 - b_width / 2 * s_mark + TILE * 0.01   # optical centre: the stem carries the weight on the left
mark_ty = TILE / 2 - (TOP + CAP / 2) * s_mark
s_word = TILE * LOCKUP_WORD / CAP
word_tx = TILE * (1 + LOCKUP_GAP)
word_ty = TILE / 2 - (TOP + CAP / 2) * s_word
lockup_width = round(word_tx + word_width * s_word, 1)

geometry = {
    'cap': {'top': TOP, 'bottom': TOP + CAP, 'height': height},
    'wordmarkWidth': word_width,
    'word': word_path,
    'b': {'width': round(b_width, 1), 'd': path(b_shape)},
    'arrow': path(arrow),
    'mark': {'size': TILE, 'radius': RADIUS, 'transform': f'translate({mark_tx:.2f} {mark_ty:.2f}) scale({s_mark:.5f})'},
    'lockup': {'width': lockup_width, 'height': TILE, 'wordTransform': f'translate({word_tx:.2f} {word_ty:.2f}) scale({s_word:.5f})'},
}

with open(os.path.join(HERE, 'glyphs.mjs'), 'w', encoding='utf-8') as f:
    f.write(f"""// BIZOMAT logo geometry: the single source for every logo, icon and component.
// Generated by shared/brand/construct.py (Saira SemiBold letters; the B's lower counter is a forward arrow). Do not
// edit by hand: change construct.py, run it, then node shared/brand/build.mjs and node shared/brand/og.mjs.
// Paths are M/L/Z only, y down, cap height from y = {TOP:g} to y = {TOP + CAP:g}, the B's stem at x = 0. The B, the arrow and the
// wordmark share these coordinates, so the arrow sits in the B of the word as it does in the B alone.

export const CAP = {json.dumps(geometry['cap'])};

export const WORDMARK_WIDTH = {word_width};

/** The word in one colour; the B's counters (the upper one and the arrow) are holes. */
export const WORD = '{geometry['word']}';

/** The B alone, with the same holes. */
export const B = {{ width: {geometry['b']['width']}, d: '{geometry['b']['d']}' }};

/** The accent: the forward arrow that fills the B's lower counter (teal in the full-colour logo and the mark). */
export const ARROW = '{geometry['arrow']}';

/** The mark: the B on a navy rounded tile. */
export const MARK = {json.dumps(geometry['mark'])};

/** The lockup: the mark, then the wordmark (headers and footers). */
export const LOCKUP = {json.dumps(geometry['lockup'])};

/** Brand colours (also in shared/brand/tokens.css). */
export const COLORS = {json.dumps(COLORS, indent=2)};

/** The whole word as one path (kept for callers of the earlier module). */
export function wordmarkPath() {{
  return WORD;
}}
""")
print(f"glyphs.mjs written: wordmark {word_width} x {height:g}, B {b_width:.1f}, lockup {lockup_width} x {TILE}; "
      f"path sizes word {len(geometry['word'])}, B {len(geometry['b']['d'])}, arrow {len(geometry['arrow'])}")
