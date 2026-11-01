# WORKOS release: batch handbook94, 1 November 2026

Four tools from the deep audit of the Machinery’s Handbook bevel gearing, straight-sided spline and roller chain sprocket pages, taking WORKOS from 994 to 998 tools (MAKEOS handbook tools 800 → 804). Requested by the owner ("next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (all four tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. The bevel gear offset factor (from the handbook table), the side pressure allowed on spline sides, torques, face widths and hob bores are always user inputs.

## Deep audit

The audit script listed these pages as formula-heavy but cited only within wide ranges:

- **Bevel gearing (pp. 2181–2190):** cited only as a ten-page range by `bevel-gear` and `bevel-gear-set-design`. Those tools give the pitch cone angles, pitch and outside diameters and cone distance, and a design check with forces and bending stress. Neither follows these handbook procedures:
  - the rules for milled bevel gears: addendum, dedendum, face, compound rest and cutting angles, angular addendum, vertex distances, small-end sizes, the widest face and the tooth numbers for selecting formed cutters
  - the offset of the cutter for milling bevel gears, the dividing head cutting angle and the chordal thickness and chordal addendum at both ends of the tooth
- **Straight-sided splines (pp. 2279–2281):** cited only within the 28-page range of the involute spline tools. No live tool gives the S.A.E. straight-sided spline proportions (Table 22) or their torque capacity T = 1000 N R h. (`spline-shaft-milling-cutter` covers only the cutter for milling a straight-sided spline.)
- **Roller chain sprockets (pp. 2554–2555):** cited only within the 20- to 70-page ranges of the chain drive tools. `sprocket-diameters` gives the pitch, outside, bottom and caliper diameters, and the silent chain tooth form is live, but nothing follows the ANSI B29.1M roller chain tooth form or the standard hob design.

Also examined and not built:

- **Pin measurement of involute splines (pp. 2271–2272):** the same involute calculation as the live `gear-over-pins` and `internal-gear-pin-measurement` tools, with the spline's space width or tooth thickness entered; recorded as covered.
- **Buttress thread form (p. 1949) and fine-pitch worm gearing (pp. 2191–2192):** already built by `buttress-thread` and `fine-pitch-worm-design`.
- **Chain length and the centre distance for a given length (pp. 2553, 2555):** already worked out by `chain-length`, which uses the exact centre distance rather than the handbook’s approximate formula.

`MH_DEEP_AUDIT.md` in the generator folder records these pages.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Milled Bevel Gear Dimensions](https://kevos.com/tools/milled-bevel-gear-dimensions/) | Gears | tan γP = sin Σ ÷ (NG ÷ NP + cos Σ); γG = Σ − γP; S = 1 ÷ P; S + A = 1.157 ÷ P; W = 2.157 ÷ P; T = 1.5708 ÷ P; C = D ÷ 2 sin γ; F (max) = C ÷ 3 or 8 ÷ P; s and t in the ratio (C − F) ÷ C; tan α = S ÷ C; tan δ = (S + A) ÷ C; face angle γ + α; compound rest 90° − γ − α; cutting angle γ − δ (or γ − α for uniform clearance); K = S cos γ; O = D + 2K; J = (O ÷ 2) cot (γ + α); j = J (C − F) ÷ C; N′ = N ÷ cos γ | none (one rejected pairing) |
| [Bevel Gear Milling Offset and Caliper Settings](https://kevos.com/tools/bevel-gear-milling-offset/) | Gears | C = D ÷ 2 sin γ; cutter measured at depth 1.157 ÷ P; offset = T ÷ 2 − factor ÷ P; cutting angle γ − α; Tc = T − T³ ÷ 6D²; Sc = S + T² cos γ ÷ 4D; tc and sc with D − 2F sin γ at the small end | none (one rejected pairing) |
| [S.A.E. Straight-Sided Spline Fitting](https://kevos.com/tools/sae-straight-sided-spline/) | Power Transmission | W, h and d as fractions of D for 4, 6, 10 and 16 splines and fits A, B and C; R = (D + d) ÷ 4; T = p N R h L (the handbook’s T = 1000 N R h at 1000 lbf/in²) | Machine part repairs: keyways, threads and splines; Machine elements: shafts, couplings and alignment |
| [Roller Chain Sprocket Tooth Form and Hob](https://kevos.com/tools/roller-chain-sprocket-tooth-form/) | Power Transmission | Ds = 1.005 Dr + 0.003 in; A = 35° + 60° ÷ N; B = 18° − 56° ÷ N; M, T, E, xy, yz, W, V; F; H = √(F² − (1.4 Dr − 0.5 P)²); S; OD ≈ P [0.6 + cot (180° ÷ N)]; pointed OD; pressure angles; hob Pn = 1.011 P, H = 0.27 P, E = 0.03 P, OD = 1.7 (bore + Dr + 0.7 P), sin M = Pn ÷ π Dh, lead Pn ÷ cos M, width | Machine part repairs: gears and sprockets; Machine elements: belt and chain drives |

All four tools take millimetres and show results in SI; the inch constants of the sprocket standard (0.003 and 0.0015 in) are converted. The tests check them against the handbook’s inch examples and tables.

Knowledge connections: 4 approved and 2 rejected relationships (`docs/knowledge-links-review.md`). The rejected pairs are the milled bevel gear tool with the gearbox selection chapter (bevel gears appear only as a gear type there) and the milling offset tool with the gear repair chapter (it rebuilds single teeth by welding, not milling whole bevel gears).

## Handbook values reproduced by the tests

- **Bevel gear cutters, Example 1 (4 diametral pitch, 70° shaft angle, 50 and 20 teeth):** tan γP = 0.33064, γP = 18°18′, γG = 51°42′; cutter tooth numbers 21.1 and 80.7.
- **Bevel gear cutters, Example 2 (24 and 12 teeth at 90°):** γP = 26°34′, γG = 63°26′; cutter tooth numbers 13.4 and 53.6 (exactly 53.67).
- **Offset for milling a bevel gear (24 teeth, 6 diametral pitch, 30° pitch cone angle, 1¼ in face, factor 0.280, cutter 0.1745 in thick):** C = 4 in, C ÷ F = 3.2, measuring depth 0.1928 in, offset 0.0406 in; cutter tooth number in the No. 4 range.
- **S.A.E. spline tables (at 1000 lbf/in² and 1 in of length):**
  - 6A at 1 in: W = 0.250 in, d = 0.900 in, T = 142.5 lbf·in (table 143)
  - 10B at 2 in: d = 1.720 in, T = 1302
  - 16C at 3 in: W = 0.294 in, d = 2.430 in, T = 6190
  - 4B at 1 in: W = 0.241 in, h = 0.125 in, T = 218.75 (table 219)
- **Sprocket seating curve (Table 11):** Ds = 0.204, 0.631 and 0.757 in for rollers of 0.200, 0.625 and 0.750 in.
- **Standard hob (Table 12, ¼ in pitch, 0.130 in roller, 1.250 in bore):** normal pitch 0.2527 in, H = 0.0675 in, fillet radius 0.0075 in, outside diameter about 2⅝ in, width 2½ in.
- The approximate sprocket outside diameter matches the live `sprocket-diameters` tool exactly.

## Notes on the source

- **Cutting angle:** the milled bevel gear table subtracts the dedendum angle from the pitch cone angle, but the note above it and the milling procedure on p. 2189 use the addendum angle for uniform clearance. The dimensions tool offers both; the offset tool uses the addendum angle, as the procedure does.
- **Cutter selection:** the tools give N′ = N ÷ cos γ rounded to a whole number and point to the live `gear-cutter-number` tool for the cutter number, so the cutter table is not reproduced here.
- **Offset factor:** the handbook table depends on the cutter number and C ÷ F; the tool shows C ÷ F and flags a ratio outside the table range (3 to 8), which also means the face is wider than one third of the cone radius.
- **Hob outside diameter:** the handbook calls 1.7 (bore + Dr + 0.7 P) approximate; for ¼ in pitch it gives 2.644 in against the tabulated 2⅝ in.

## Verification (on top of cf3d04d)

- `node scripts/tools/input-guides.mjs check --file handbook94`: 4 tools, 22 inputs, 0 problems. Inventory: 998 tools, 8,642 inputs, all covered.
- Calculator tests: 1,139/1,139.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,287/1,287
  - post-build checks: 4,203 pages verified
- `npm run knowledge:check`: valid (845 relationships). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 998/998 tools passed with 8,642 figures.
- The spline tool was also run in the browser, where it flags the torque as above the spline capacity when the torque to carry is raised to 20 N·m.
