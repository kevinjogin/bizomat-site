# BIZOMAT brand system

One source for the logo, icons, colours, type and components used by the website, CAD Automation (`apps/cad`) and
Project Management (`apps/work`).

| File | What it is |
| --- | --- |
| `glyphs.mjs` | The wordmark geometry (single source). Every SVG, PNG and generated module comes from it. |
| `build.mjs` | Writes `dist/` and copies assets into the three apps. `--check` fails when any copy is out of date (CI). |
| `og.mjs` | Renders the 1200 x 630 social images in Chromium with the real fonts. |
| `tokens.css` | Design tokens: colour, type, spacing, radius, shadow, motion, light and dark themes. |
| `components.css` | `bz-*` components built only on the tokens: buttons, forms, cards, badges, alerts, tables, modal, dashboard tiles, loading, empty and error states, app header and footer. |
| `fonts/oxanium-latin.woff2` | Heading face (Latin subset of Oxanium, variable weight 200 to 800, SIL OFL 1.1). |

## Logo

- **Wordmark:** BIZOMAT in capitals, drawn (not typeset) with the construction rules of the earlier KEVOS and CADOS
  letterforms: 233-unit cap height, 45-unit bars, 50-unit stems, 54-unit 45-degree chamfers on the top-right and
  bottom-left corners, and a stencil cut at the top-left of closed letters. The A is the CADOS A, so the CAD product
  keeps its letterform. It is a new word mark; it does not reuse the KEVOS name or shapes beyond that construction.
- **Connector bar:** the middle bar of the B is the brand's single accent: teal in the full-colour logo and the mark.
  It stands for what the platform does: connecting work, systems and people.
- **Mark:** the B on a navy tile with the teal connector. Favicon, app icon and touch icon.
- **Variants:** `bizomat-logo-light.svg` (navy word, teal bar; light backgrounds), `bizomat-logo-dark.svg` (white
  word, bright teal bar; dark backgrounds), `bizomat-wordmark.svg` (one colour, `currentColor`), `bizomat-mark.svg`,
  `bizomat-b.svg` (the B alone, `currentColor`).
- **Clear space:** at least the height of the B's middle bar (45 units, about one fifth of the cap height) on every side.
  Minimum width: 96 px for the wordmark, 16 px for the mark.
- No "®" or "TM" after BIZOMAT: the name is not a registered trade mark (see docs/BIZOMAT-PROJECT-STATUS.md).

## Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bz-navy` | #0a1f33 | | Wordmark, inverse panels, the mark's tile |
| `--bz-teal` | #0f766e | #2dd4bf | Primary buttons, links, focus |
| `--bz-teal-mark` | #14b8a6 | | The connector bar in the mark |
| `--bz-amber` | #f59e0b | | Signal colour in diagrams (never body text on light) |
| `--bz-paper` / `--bz-surface` | #f7f9fb / #ffffff | #0a111c / #101a28 | Page and card backgrounds |
| `--bz-ink` / `--bz-ink-2` / `--bz-muted` | #0e1726 / #334155 / #56657a | #e6edf5 / #c5d0dc / #9aa8ba | Text |

Measured contrast (WCAG 2.2): ink on paper 17.0:1, muted on paper 5.6:1, teal on white 5.5:1, white on teal button
5.5:1, bright teal on dark paper 10.2:1, dark muted on dark surface 7.2:1, teal mark on navy 6.7:1. All text pairs
meet AA.

## Type

- **Headings (H1 to H4):** Oxanium, weight 650, slight negative tracking. Its chamfered, geometric forms match the
  wordmark's construction. Served from each product's own origin (`/fonts/oxanium-latin.woff2`); no third-party
  font requests.
- **Body, labels, forms:** Inter Tight (variable), already self-hosted by every product.
- **Technical labels:** the system monospace stack.
- Scale: `--bz-step--1` (labels) to `--bz-step-5` (homepage hero).

## Rules

- Change the logo only in `glyphs.mjs`, then run `node shared/brand/build.mjs` and `node shared/brand/og.mjs`.
- Apps never hand-edit their copies (CI runs `node shared/brand/build.mjs --check`).
- Light theme by default; dark is a per-session choice where the product offers it.
- Animation explains a product; it never decorates. Every animation stops under `prefers-reduced-motion`.
