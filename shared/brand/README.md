# BIZOMAT brand system

One source for the logo, icons, colours, type and components used by the website, CAD Automation (`apps/cad`) and
Project Management (`apps/work`).

| File | What it is |
| --- | --- |
| `construct.py` | Constructs the logo from the font and writes `glyphs.mjs` (needs fonttools, brotli, shapely). |
| `glyphs.mjs` | The logo geometry (generated, single source). Every SVG, PNG and generated module comes from it. |
| `build.mjs` | Writes `dist/` and copies assets into the three apps. `--check` fails when any copy is out of date (CI). |
| `og.mjs` | Renders the 1200 x 630 social images in Chromium with the real fonts. |
| `tokens.css` | Design tokens: colour, type, spacing, radius, shadow, motion, light and dark themes. |
| `components.css` | `bz-*` components built only on the tokens: buttons, forms, cards, badges, alerts, tables, modal, dashboard tiles, loading, empty and error states, app header and footer. |
| `fonts/oxanium-latin.woff2` | Heading face (Latin subset of Oxanium, variable weight 200 to 800, SIL OFL 1.1). |

## Logo

- **Wordmark:** BIZOMAT in capitals, Saira SemiBold (SIL OFL 1.1, `brand-source/fonts/`), tracked +5 %, converted to
  outlines (never typeset). Clean, squared curves that match the Oxanium headings and the rounded tile.
- **The arrow:** the B's lower counter is a forward arrow, the logo's one accent (teal `#14b8a6`). It says what the
  platform does: work that moves on by itself, business automation that connects systems and gets work done.
- **Mark:** the same B, white, on a navy rounded tile (radius 112 on 512), the arrow teal. Favicon, app icons, the hub
  of the diagrams, the SOLIDWORKS add-in.
- **Lockup:** the mark, then the wordmark (cap height 44 % of the tile, 30 % of the tile between them). Website header
  and footer, social images. On dark paper the tile is lifted to `#16324f`.
- **Files:** `bizomat-lockup-light.svg` / `-dark.svg`, `bizomat-logo-light.svg` (navy word, teal arrow) /
  `-dark.svg` (white word), `bizomat-wordmark.svg` (one colour, `currentColor`, the arrow a hole),
  `bizomat-mark.svg`, `bizomat-b.svg` (the B alone, `currentColor`).
- **Clear space:** at least half the tile (or the height of the B's arrow, for the wordmark alone) on every side.
  Minimum sizes: 96 px wide for the wordmark, 16 px for the mark.
- **Geometry:** `construct.py` builds it from the font and writes `glyphs.mjs`. Every path is straight segments only
  (M/L/Z), so the SOLIDWORKS add-in's GDI+ drawer reads the same paths as the browsers.
- No "®" or "TM" after BIZOMAT: the name is not a registered trade mark (see docs/BIZOMAT-PROJECT-STATUS.md).

## Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bz-navy` | #0a1f33 | | Wordmark, inverse panels, the mark's tile |
| `--bz-teal` | #0f766e | #2dd4bf | Primary buttons, links, focus |
| `--bz-teal-mark` | #14b8a6 | | The forward arrow in the logo |
| `--bz-amber` | #f59e0b | | Signal colour in diagrams (never body text on light) |
| `--bz-paper` / `--bz-surface` | #f7f9fb / #ffffff | #0a111c / #101a28 | Page and card backgrounds |
| `--bz-ink` / `--bz-ink-2` / `--bz-muted` | #0e1726 / #334155 / #56657a | #e6edf5 / #c5d0dc / #9aa8ba | Text |

Measured contrast (WCAG 2.2): ink on paper 17.0:1, muted on paper 5.6:1, teal on white 5.5:1, white on teal button
5.5:1, bright teal on dark paper 10.2:1, dark muted on dark surface 7.2:1, teal mark on navy 6.7:1. All text pairs
meet AA.

## Type

- **Headings (H1 to H4):** Oxanium, weight 650, slight negative tracking. Its squared, geometric forms match the
  wordmark's. Served from each product's own origin (`/fonts/oxanium-latin.woff2`); no third-party
  font requests.
- **Body, labels, forms:** Inter Tight (variable), already self-hosted by every product.
- **Technical labels:** the system monospace stack.
- Scale: `--bz-step--1` (labels) to `--bz-step-5` (homepage hero).

## Rules

- Change the logo only in `construct.py`, then run `python3 shared/brand/construct.py`, `node shared/brand/build.mjs`
  and `node shared/brand/og.mjs`.
- Apps never hand-edit their copies (CI runs `node shared/brand/build.mjs --check`).
- Light theme by default; dark is a per-session choice where the product offers it.
- Animation explains a product; it never decorates. Every animation stops under `prefers-reduced-motion`.
