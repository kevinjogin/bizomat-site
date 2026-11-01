# WORKOS release: batch handbook82, 31 October 2026

Six tools from Machinery’s Handbook pages that no earlier tool cited, taking WORKOS from 939 to 945 tools (MAKEOS handbook tools 745 → 751). Requested by the owner ("Continue to keep making tools from the book and keep record of all pages scanned and completed"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (all six tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced; allowable stresses and pressures, rope constants, moduli and limits are always user inputs.

## How the pages were found: the page ledger

A new page-by-page ledger records every printed page of the handbook: the body (pp. 3–2,700) and the CD supplement (pp. 2,874–3,492), 3,317 pages in all. Each page is scanned for formula lines and table rows and matched against the pages every live and draft WORKOS tool cites. Pages that have been read by hand are marked with a verdict. The ledger lives in the generator folder (`mh-ledger.mjs`, `mh-ledger-review.json`, `MH_PAGE_LEDGER.csv`, `MH_PAGE_LEDGER.md`) and is re-run after every batch.

| Pages | Before this batch | After |
|---|---|---|
| Cited by a live tool | 1,930 | 1,930 (1,936 once this batch is live) |
| Cited by a draft tool (handbook79 and handbook82) | 19 | 45 |
| Read by hand: tool possible, not yet built | 0 | 22 |
| Read by hand: nothing to build | 0 | 19 |
| No formula lines (tables, prose, figures) | 1,128 | 1,121 |
| Formula lines, not yet read | 240 | 180 |

The CD supplement had never been scanned. The earlier coverage script read only the body, so the supplement held the largest uncited formula runs: gear geometry factors, worm gearing and wire rope.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Gear Pitting Geometry Factor I](https://kevos.com/tools/gear-pitting-geometry-factor/) | Gears | AGMA 908-B89 equations (1)–(39) as the handbook gives them: line-of-action distances C₁–C₆, transverse and axial contact ratios, L_min and load sharing for helicals, helical overlap factor, radii of curvature and I, for external spur and helical pairs | Surface contact stress; Helical gears and axial thrust; Centre distance and contact ratio |
| [Fine-Pitch Worm and Wormgear Design](https://kevos.com/tools/fine-pitch-worm-design/) | Gears | ANSI B6.9-1977 Table 1 proportions from axial pitch, lead angle, threads and teeth; face width and threaded length; threads or lead angle for a target centre distance | — |
| [Internal Gear Measurement Between Pins](https://kevos.com/tools/internal-gear-pin-measurement/) | Gears | inv φ_w = e ÷ D + inv φ − d_p ÷ D_b; between pins 2R_w − d_p (even) or 2R_w cos(90° ÷ z) − d_p (odd); space width from a reading; pin contact diameter | Measuring and specifying a gear |
| [Wire Rope on Sheaves and Drums](https://kevos.com/tools/wire-rope-sheave-drum-check/) | Mechanics | Radial pressure 2T ÷ (D d); bending stress E d_w ÷ D and load s_b Q d²; factor on tension plus bending load; drum capacity (A + D) A B K | — |
| [Shock Stress in Beams and Springs](https://kevos.com/tools/shock-stress-check/) | Strength | p = p_s(1 + √(1 + 2h ÷ y)) for three beam cases and round or square wire springs, the approximate forms, and ½Mv² for a moving body | Load paths (designing welded joints) |
| [Thin Ring Loaded Across a Diameter](https://kevos.com/tools/thin-ring-load-check/) | Strength | S = P D d ÷ (4π I); diameter changes (π/4 − 2/π) and (2/π − ½) × P R³ ÷ (E I); load at the allowable stress | — |

Knowledge connections: 5 approved and 4 rejected relationships, each with the chapter text and the tool checked (`docs/knowledge-links-review.md`). The worm, rope and ring tools have no READOS chapter that discusses their calculation.

## Handbook values reproduced by the tests

- Geometry factor I: all 28 equal-addendum values of the 25° tables (pp. 3299–3300) to the printed three decimals, for example 0.086 for 14/14 and 0.121 for 21/55. The tables give I for spur gears only, so the helical path was checked against a separate implementation of the same equations and for continuity with the spur result as the helix angle goes to zero.
- Fine-pitch worm: Example 1 (0.160 in axial pitch, 30°, 10 threads, 100 teeth): d = 0.8821, D = 5.0930, C = 2.9876, do = 0.9703 in, 10.04 threads for a 3 in centre distance. Example 2: d = 0.3037, D = 0.7958, C = 0.5498 in, cot λ = 19.1152. Face width and threaded length agree within 0.0005 and 0.001 in; the handbook works them from rounded dimensions.
- Internal gear between pins: eleven values of the Van Keuren tables (pp. 2226–2229) to the fourth decimal, even and odd teeth, 14½° to 30°.
- Wire rope: bending example (½ in 6 × 19 fibre core over a 24 in sheave): s_b = 15,750 psi and P_b ≈ 1,595 lb (the handbook rounds the area to 0.101 in² and prints 1,590 lb); drum example (B 24, D 18, H 30 in, K 0.741): 2,561 ft.
- Shock: the table formulas for all five members, the approximate forms, a sudden load giving twice the static stress, and the round-spring constant 1.27 as 4 ÷ π.
- Thin ring: the constants 1.621, 0.617 and 0.0186 and "about 92 %", and the diameter change by a separate Castigliano integration.

## Notes on the source

- Eq. (29) for I is printed with 1/ρ₁ + 1/ρ₂ only, so the tool covers external gears. The J factor is referred to AGMA 908-B89 and is not calculated.
- The ring formulas use the exact coefficients (π/4 − 2/π) ÷ 8 = 0.018597 and the matching decrease, which the handbook rounds to 0.0186 and "about 92 %".
- ANSI B6.9's whole depth 0.7003 P_n + 0.002 in is applied as + 0.0508 mm.
- Overlap: `shock-stress-check` repeats the simply supported and cantilever cases of the live `beam-impact` tool; it adds the fixed-ended beam, springs and moving bodies.
- Not built: polygon shaft connections (pp. 2282–2283). The printed three-sided Z_P formula is about 15 % above the handbook's own table values, so that tool waits until the conflict is resolved (recorded in the ledger).

## Verification (on top of 1be4d74)

- `node scripts/tools/input-guides.mjs check --file handbook82`: 6 tools, 65 inputs, 0 problems. Inventory: 945 tools, 8,197 inputs, all covered.
- Calculator tests: 1,075/1,075.
- `npm run verify`: astro check 0 errors and 0 warnings; 1,223/1,223 tests; 3,856 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 945/945 tools passed, 8,197 figures, including every tool on a 360 px phone screen.
