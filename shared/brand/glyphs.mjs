// BIZOMAT wordmark geometry: the single source for every logo, icon and component.
//
// Construction (same rules as the KEVOS and CADOS letterforms it descends from):
//   cap height 233 units (y 4 to 237), horizontal bars 45, vertical stems 50, 45-degree chamfers of 54 units on the
//   top-right and bottom-left corners, and the stencil cut at the top-left of closed letters (the top bar ends in a
//   short curve that stops short of the stem). The A is the CADOS A unchanged, so the CAD product keeps its letterform.
// Paths are drawn on a 241-unit-high canvas and filled with fill-rule evenodd.

export const CAP = { top: 4, bottom: 237, height: 241 };

/** Glyph outlines with their own origin at x = 0, and their advance width. */
export const GLYPHS = {
  B: {
    width: 332,
    // Outer outline (open top counter through the stencil cut) and the closed lower counter.
    d: 'M33 4L256 4L310 58L310 110L332 132L332 237L54 237L0 183L0 48L50 48L50 96L261 96L261 49L104 49L76 40L63 33L48 21Z'
      + 'M50 141L283 141L283 192L50 192Z',
    // The middle bar on its own: the "connection" accent of the two-tone mark.
    bar: 'M50 96L272 96L272 141L50 141Z',
  },
  I: { width: 50, d: 'M0 4L50 4L50 237L0 237Z' },
  Z: { width: 332, d: 'M0 4L332 4L332 49L92 192L332 192L332 237L0 237L0 192L240 49L0 49Z' },
  O: { width: 332, d: 'M33 4L278 4L332 58L332 237L54 237L0 183L0 48L50 48L50 192L283 192L283 49L104 49L76 40L63 33L48 21Z' },
  M: { width: 420, d: 'M0 4L56 4L210 150L364 4L420 4L420 237L370 237L370 63L210 215L50 63L50 237L0 237Z' },
  A: { width: 384, d: 'M0 237L56 237L186 4L130 4ZM198 4L254 4L384 237L328 237ZM92 142L292 142L292 186L92 186Z' },
  T: { width: 332, d: 'M0 4L332 4L332 49L191 49L191 237L141 237L141 49L0 49Z' },
};

/** Letter positions (optically spaced: 50 units between upright letters, closer where the A leans). */
export const LAYOUT = [
  ['B', 0],
  ['I', 382],
  ['Z', 482],
  ['O', 864],
  ['M', 1246],
  ['A', 1678],
  ['T', 1997],
];
export const WORDMARK_WIDTH = 1997 + GLYPHS.T.width; // 2329

/** Move every coordinate of an absolute M/L/Z path by dx. */
export function shift(d, dx) {
  return d.replace(/([ML])(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, cmd, x, y) => `${cmd}${+x + dx} ${y}`);
}

/** The whole word as one path. */
export function wordmarkPath() {
  return LAYOUT.map(([g, x]) => shift(GLYPHS[g].d, x)).join('');
}

/** Brand colours (also in shared/brand/tokens.css). */
export const COLORS = {
  navy: '#0a1f33', // wordmark and ink on light backgrounds
  ink: '#0e1726',
  teal: '#0f766e', // accent for buttons and links on light (5.5:1 on white)
  tealBright: '#2dd4bf', // accent on dark backgrounds and in the mark
  tealMark: '#14b8a6',
  paper: '#f7f9fb',
  white: '#ffffff',
  darkPaper: '#0a111c',
};
