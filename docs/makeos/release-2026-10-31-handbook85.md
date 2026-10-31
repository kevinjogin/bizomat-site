# WORKOS release: batch handbook85, 31 October 2026

Seven tools from Machinery’s Handbook pages that the page ledger listed as open or as candidates, taking WORKOS from 958 to 965 tools (MAKEOS handbook tools 764 → 771). Requested by the owner ("Continue to keep making tools from the book and keep record of all pages scanned and completed"; "continue working on next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (all seven tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Brinell hardness, land width, feeds, tap table tolerances (A, B, D), chain ratings, service factors and required forming pressures are always user inputs.

## Page ledger

| Pages | Before this batch | After |
|---|---|---|
| Cited by a live tool | 1,999 | 1,999 (2,013 once this batch is live) |
| Cited by a draft tool (handbook79 and handbook85) | 19 | 33 |
| Read by hand: tool possible, not yet built | 8 | 4 |
| Read by hand: nothing to build | 32 | 58 |
| No formula lines (tables, prose, figures) | 1,111 | 1,107 |
| Formula lines, not yet read | 148 | 116 |

Read in this batch and recorded without a tool, because live tools already cover them or they hold only definitions or data:

- BS ISO metric thread tolerances (pp. 1914–1915)
- Differential indexing check (pp. 2105–2106)
- Unit systems (pp. 150–152)
- CNC thread depth (p. 1303)
- Transformation temperature symbols (p. 465)
- Brinell formula and tensile strength from Brinell hardness (pp. 505, 509)
- Plastics resistivity and wall conduction (pp. 570–573)
- Forming tool step depth (p. 796)
- Wrench clearances (p. 1556)
- CNC feeds (pp. 3171–3172)
- APT statements (p. 3198)
- Tap drill tables (pp. 2021–2026)

Still candidates:

- **Planetary gear Figs. 1–24 (pp. 2212–2214):** which planet meshes which gear can't be read reliably from the figures.
- **Engine flywheel examples and arm proportions (p. 3011).**

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Milling Cutter Clearance Grinding Set-up](https://kevos.com/tools/cutter-clearance-grinding-setup/) | Manufacturing | Clearance needed C = 45860 ÷ (D B) (1.5 L + F ÷ (π D) √(d (D − d))); offsets: wheel above centre Dw ½ sin c, below centre Dc ½ sin c, centres in line Dw Dc sin(c ÷ 2) ÷ (Dw + Dc), cup wheel Dc ½ sin c; indicator drop = distance × tan(angle) | — |
| [Spline Shaft Milling Cutter](https://kevos.com/tools/spline-shaft-milling-cutter/) | Manufacturing | B = 360° ÷ N; sin A = W ÷ d; C = d sin(180° ÷ N − A) | Specialised machining operations: broaching, keyways, splines, knurling and indexing |
| [Top Knurling Cam Rise](https://kevos.com/tools/top-knurling-cam-rise/) | Manufacturing | c = √((R + r)² − (R + r − d)²); revolutions = c ÷ feed; sharp-V depth from pitch and tooth angle | — |
| [Rubber Pad (Guerin) Forming Pressure](https://kevos.com/tools/rubber-pad-forming-pressure/) | Manufacturing | p = F × 2000 ÷ A (SI: force ÷ pad area); pad thickness usually 3 and at least 1.5 times the form block height; pad 50–70 Shore | Deep drawing and spinning by the numbers: draw, spin or something else |
| [Angular Backlash of a Gear Pair](https://kevos.com/tools/gear-angular-backlash/) | Gears | θ = 6875 B ÷ D minutes for each gear; backlash change ≈ 2 Δc tan φ | Gears by the numbers: backlash and tooth thickness |
| [Unified Inch Cut Thread Tap Limits](https://kevos.com/tools/unified-cut-thread-tap-limits/) | Threads | ASME B94.9 Table 3: min major = basic + B + C, max = min + A; min PD = basic PD + B, max = min + D; C = 20 % or 25 % of 0.216506 P | — |
| [Silent Chain Width for a Power](https://kevos.com/tools/silent-chain-width/) | Power Transmission | Capacity per inch = rating ÷ service factor; width = power × service factor ÷ rating per inch; lubrication type check | — |

Knowledge connections: 3 approved and 3 rejected relationships, each with the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`). Rejected pairs:

- **Grinding, honing and lapping** with cutter grinding: that chapter names tool and cutter grinding only in passing.
- **Broaching, knurling and indexing** with knurling cam rise: that chapter covers knurling methods and pitch tracking, not screw machine cams.
- **Drilling, reaming and tapping** with the inch cut-thread tap tool: that chapter uses metric taps only.

## Handbook values reproduced by the tests

- **Wheel offset tables:** "wheel above centre" for 3 in and 10 in wheels, and "wheel below centre" for a 2 in cutter, at every angle from 1° to 12°.
- **Indicator drops:** Table 4 (face rake) at 1°, 10°, 12°, 15° and 20°, and Table 3 (side and end relief) at 1° and 9°.
- **Top knurling example:** 32-pitch 90° knurl on 5/16 in stock gives a tooth depth of 0.0156 in and a cam rise of 0.120 in. That takes 24 revolutions at 0.005 in feed and 15 revolutions at 0.008 in.
- **Rubber pad:** p = F × 2000 ÷ A gives 5000 psi for 1000 tons on 400 in².
- **Cut thread tap constant C:** all 35 table entries from 2 to 80 TPI reproduce, except 6 TPI (see below).
- **Closed forms:** the clearance angle formula, in-line offset, spline chord, angular backlash constant (6875 ≈ 21600 ÷ π) and silent chain width rules.

## Notes on the source

- **Cut thread taps:** Table 3 prints C = 0.0078 in for 6 threads per inch. The table's own rule (25 % of the theoretical truncation 0.216506 P for 6 to 80 TPI) gives 0.0090 in. Every other entry agrees with the rule, so the tool uses the rule.
- **Cutter grinding:** the handbook gives tables, not formulas, for indicator drop. The tool uses distance × tan(angle), which reproduces Tables 3 and 4. The radial relief check on peripheral teeth (Table 1) depends on cutter diameter and relief type, so it is left to that table.
- **Clearance formula:** the handbook writes d in "inches (mm)". The tool converts every length to inches, as the constant 45860 requires.

## Verification (on top of e1fc98b, after rebasing over three READOS publishes)

- `node scripts/tools/input-guides.mjs check --file handbook85`: 7 tools, 46 inputs, 0 problems. Inventory: 965 tools, 8,368 inputs, all covered.
- Calculator tests: 1,098/1,098.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,246/1,246
  - post-build checks: 4,058 pages verified
- `npm run knowledge:check`: valid (674 relationships with main’s new links). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 965/965 tools passed with 8,368 figures. The clearance grinding tool was also opened and run in the browser.
