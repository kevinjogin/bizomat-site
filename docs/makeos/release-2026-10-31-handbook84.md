# WORKOS release: batch handbook84, 31 October 2026

Seven tools from Machinery’s Handbook pages that the page ledger listed as open (formula lines not yet read), taking WORKOS from 951 to 958 tools (MAKEOS handbook tools 757 → 764). Requested by the owner ("Continue to keep making tools from the book and keep record of all pages scanned and completed"; "continue to next batch"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (all seven tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Product thread limits, gauge tolerances, motor data, process pressures, power measurements and accepted ranges are always user inputs.

## Page ledger

| Pages | Before this batch | After |
|---|---|---|
| Cited by a live tool | 1,977 | 1,977 (1,999 once this batch is live) |
| Cited by a draft tool (handbook79 and handbook84) | 19 | 41 |
| Read by hand: tool possible, not yet built | 4 | 8 |
| Read by hand: nothing to build | 20 | 32 |
| No formula lines (tables, prose, figures) | 1,120 | 1,111 |
| Formula lines, not yet read | 177 | 148 |

Read in this batch and recorded without a tool:

- **Speeds and feeds tables (pp. 1031–1038):** cutting data, entered by the user in the existing tools.
- **Face milling cost curves (p. 1161):** the total-cost relation is already in two live tools.
- **Bearing material ratings (pp. 2360–2361):** data; the PV check is in `journal-bearing-pv`.
- **Punching force (p. 3227):** already in `punching-force` and `punching-operation-plan`.

New candidates:

- **Angular backlash (pp. 2168–2169):** 6875 B ÷ D minutes.
- **Engine flywheel examples and arm proportions (p. 3011).**
- **Silent chain width from the rating per inch (p. 3476).**

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Compound Indexing on a Dividing Head](https://kevos.com/tools/compound-indexing/) | Threads | Simple indexing when worm ratio × circle ÷ N is whole; compound movements w + a/A ± b/B on two circles of one Brown & Sharpe plate or Cincinnati side; approximate movements over R revolutions (R prime to N) with precise divisions 40R ÷ M, the handbook’s diameter at which the error is 0.001, and the error at your diameter; check mode for a table movement | Specialised machining operations: broaching, keyways, splines, knurling and indexing |
| [Unified Inch Thread Gauge Sizes](https://kevos.com/tools/unified-thread-gauge-limits/) | Threads | ANSI/ASME B1.2 Table 5 formulas 1–22: GO and NOT GO rings, plugs and plain gauges, setting plugs (truncation 0.060 ∛p² + 0.017 p, the 0.001 in crest rule) and setting rings, each with its tolerance direction; gauge zones checked inside the product tolerance | Choosing and using measuring instruments |
| [Forging Hammer Efficiency by the Heim Test](https://kevos.com/tools/forging-hammer-efficiency/) | Manufacturing | A = (H − H₁) ÷ H; Work = 36.75 D³ [8.85 A + 13.12 (A² + A⁴)] ft·lb; useful power at the blow rate; efficiency against power supplied | Power presses by the numbers: screw presses, fly presses and drop hammers |
| [Hydraulic Press Gauge Pressure for a Pressure on the Work](https://kevos.com/tools/press-gauge-pressure-for-work/) | Hydraulics | C = 0.7854 D² P (printed 0.00039 D² P tons); Pa = C ÷ A; P = A Pa ÷ 0.7854 D²; checked against the press limit | Power presses by the numbers: hydraulic and servo presses |
| [Permanent-Magnet Control Motor Constants](https://kevos.com/tools/pm-dc-motor-constants/) | Power Transmission | I_STo = V ÷ R; K_T = T_STo ÷ I_STo; K_E = V ÷ ω_NL; K_M = K_T ÷ √R; D_M = T_STo ÷ ω_NL; T_M = J_M ÷ D_M; torque at the current limit and rated current on the straight-line characteristic; f_n = √(K ÷ J_L) ÷ 2π against the control bandwidth | — |
| [Silent Chain Sprocket Tooth Form, Hub and Hob Diameters](https://kevos.com/tools/silent-chain-sprocket-tooth-form/) | Power Transmission | E = P (cot 180°/N − 0.22); B = P √(1.515213 + (cot 180°/N − 1.1)²); faces 60° − 720°/N (70° for 3/16 in); maximum hub P (cot 180°/N − 1.33 or − 1.25); hob generating diameter; depth 0.6875 P | — |
| [Helical Gear Helix Angle for a Fixed Centre Distance](https://kevos.com/tools/helical-gear-helix-for-centre-distance/) | Gears | cos ψ = m_n (z₁ + z₂) ÷ 2C; transverse module and pitch diameters; leads π z m_n ÷ sin ψ; helix angle at the outside diameter | Gears by the numbers: helical gears and axial thrust |

Knowledge connections: 5 approved and 2 rejected relationships, each with the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`). Rejected pairs:

- `selecting-electric-motors-and-drives` with the motor constants tool: that chapter covers induction motors and VSDs, not servo constants.
- `choose-the-instrument-for-the-tolerance` with the thread gauge tool: that chapter uses only plain metric bore plugs.

## Handbook values reproduced by the tests

- **Compound indexing, Table 1b:** nine approximate movements reproduced to the printed precise divisions and diameters at which the error is 0.001.
  - 51a: 51.00005 / 322.55
  - 53: 52.99926 / 22.89 and 53.00006 / 263.90
  - 167: 167.00058 / 92.34
  - 199: 198.99937 / 101.29
  - 209a: 208.99870 / 51.16
  - 219: 218.99642 / 19.45
  - 242: 242.00222 / 34.63
  - 244: 243.99453 / 14.19
- **Compound indexing, exact movements:** 51, 52, 54, 152 and 160 are exact.
- **Compound indexing, 127-division example:** 126.99769 divisions, measure 17.50, about 0.00045 in at 7.9 in.
- **Compound indexing, searches:** 35 divisions give 1 turn and 3/21. The searches for 53 and 127 do at least as well as the table.
- **Heim test:** all eleven Table 6 factors B for A = 0.10–0.60 are reproduced. The example gives 1376 ft·lb per blow, 4128 ft·lb/s and about 72 % efficiency on 10.3 hp.
- **Hydraulic press capacity:** a 10 in ram at 3100, 3200, 3900 and 4000 psi gives 122, 126, 153 and 157 tons; a 20 in ram at 4000 psi gives 628 tons.
- **Silent chain hub diameters (Table 5):** 17–31 teeth, hobbed and straddle-cut, all reproduced.
- **Silent chain hob generating diameters (Table 10):** at 1 in pitch, 20, 28, 38, 51, 69 and 95 teeth reproduce. At 3/8 in pitch, 20 and 28 teeth give 2.311 and 3.247 in.
- **Helical gear:** P_n 6 with 18 and 30 teeth on 4.5 in centres gives ψ = 27.266°, L₁ = 20.5728 in and L₂ = 34.2880 in.
- **Unified gauges and motor constants:** checked against the closed forms, including the crest-width geometry behind the 0.0017 in constant.

## Notes on the source

- **Compound indexing:** the handbook explains the diameter-at-0.001 measure in words. The tool uses 0.001 N ÷ (π |N − N′|), which reproduces every table entry tested.
  - Approximate movements require the number of revolutions to share no factor with N. Every table entry meets this.
  - When two movements leave the same error, the search prefers the one with fewer holes to count. It may therefore show an equivalent form of a table movement, such as 1 turn + 2/39 − 5/47 for 42/47 + 2/39.
- **Silent chain:**
  - Table 5 is titled "Minimum Hub Diameters", but the text and formulas give maximum hub diameters. The tool uses the maximum.
  - Table 10 prints 41.026 in for 130 teeth at 1 in pitch, where the formula gives 41.030 in (0.01 %). All other entries agree to the last digit.
- **Hydraulic press:** the inch formula C = 0.00039 D² P rounds 0.7854 ÷ 2000 = 0.0003927. The tool uses the exact area, which matches the printed capacity table.
- **Heim test:** the handbook example rounds A to 0.35 (B = 4.9) from measured values that give A = 0.356. The test reproduces it with A = 0.35.
- **Unified gauges:** the formula text for item 13 is 0.060 ∛p² + 0.017 p, checked against the page image.
- **Overlap:** `helical-gear-helix-for-centre-distance` inverts the centre distance relation of the live `helical-gear` tool. `press-gauge-pressure-for-work` shares F = p × A with the cylinder tools and adds the pressure on the work.

## Verification (on top of ae7b2a2, after rebasing over two READOS publishes)

- `node scripts/tools/input-guides.mjs check --file handbook84`: 7 tools, 60 inputs, 0 problems. Inventory: 958 tools, 8,322 inputs, all covered.
- Calculator tests: 1,090/1,090.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,238/1,238
  - post-build checks: 3,983 pages verified
- `npm run knowledge:check`: valid (628 relationships with main’s new links). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 958/958 tools passed with 8,322 figures. The compound indexing page was also opened and run in the browser.
