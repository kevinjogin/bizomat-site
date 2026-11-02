# WORKOS release: batch handbook101, 2 November 2026

Four tools from the deep audit of the Machinery’s Handbook spline inspection, BS ISO limits, volumes of solids and investment pages, taking WORKOS from 1030 to 1034 tools (MAKEOS handbook tools 836 → 840). Requested by the owner ("Next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 2 November 2026 (all four tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced.

The tools build in the handbook’s formulas. These are always user inputs:
- the fundamental deviations, IT values and delta values read from the ISO tables
- actual space widths and tooth thicknesses
- rates of return and tax rates
- costs, revenues and expenses

## Deep audit

This batch takes pages from the not-examined list in `MH_DEEP_AUDIT.md`:
- the spline pin measurement page (p. 2272), cited only within a 28-page spline range
- the BS ISO limits page (p. 664), cited only within 34- and 38-page ranges
- the volumes of solids pages (pp. 70–87)
- the investment pages (p. 138 and following)

The ledger’s other open candidates (the engine flywheel, silent chain sprocket tolerance and socket screw grip pages) were found to be built already, by `engine-flywheel-rim-and-arms`, handbook87 and handbook88.

What the existing tools cover:
- `involute-spline`, `involute-spline-design` and `spline-joint-design` give sizes and strength but no pin measurement.
- `it-tolerance-grade` and `interference-fit-limits-check` work out IT values from the tolerance unit, but not limits from tabulated deviations with the delta values.
- `solid-volume` has the hoof cut through the base diameter only.
- `interest-factors`, `investment-appraisal` and `equipment-finance-plan` do not give the after-tax NPV with depreciation recovery.

The MJ thread pages (pp. 1900–1903) give designations and tolerance classes but no limit formulas, so no tool was built from them.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Inch Involute Spline Measurement Between or Over Pins](https://kevos.com/tools/spline-pin-measurement/) | inv φi = s ÷ D + inv φD − di ÷ Db; inv φe = t ÷ D + inv φD + de ÷ Db − π ÷ N; M = Db sec φ ∓ d (even N) or Db cos(90° ÷ N) sec φ ∓ d (odd N); standard pins 1.7280 ÷ P or 1.9200 ÷ P | Gears: measuring and specifying a gear (one rejected pairing) |
| [ISO Limits of Size and Fit from the Fundamental Deviations](https://kevos.com/tools/iso-fit-limits-from-deviations/) | ei = es − IT, es = ei + IT; EI = ES − IT with ES + Δ for K, M, N (to IT8) and P to ZC (to IT7), ES = EI + IT; H, h, Js, js; largest and smallest clearance and the fit type | Tolerances that work: choosing and calculating fits; Checking drawings: limits and fits from the drawings |
| [Volume and Surface of a Cylinder Cut by a Plane](https://kevos.com/tools/cylinder-portion-volume/) | ungula V = (2/3 a³ ± b × area ABC) h ÷ (r ± b), S = (a d ± b × arc ABC) h ÷ (r ± b); cut across V = π r² (h1 + h2) ÷ 2, S = π r (h1 + h2) | Practical mathematics: areas, volumes and masses for the workshop |
| [After-Tax Net Present Value of Two Alternatives with Depreciation Recovery](https://kevos.com/tools/after-tax-npv-comparison/) | NPV = −P + (AR − AE − (A/G) G)(1 − TR)(P/A) + L ÷ (1 + i)ⁿ + TR (P − L) ÷ n × (P/A) | Investment appraisal: NPV, IRR and payback answer different questions |

Categories:
- the spline tool is in Gears
- the ISO limits tool is in Quality
- the cylinder tool is in Geometry
- the NPV tool is in Money

Units:
- The spline tool works in inches, as the B92.1 standard does, and also shows the measurement in millimetres.
- The ISO limits tool takes millimetres and micrometres.
- The cylinder tool takes millimetres.

Knowledge connections: 5 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the spline tool with the drawing-checking chapter on limits and fits, because pin measurement is a gear inspection method.

## Handbook values reproduced by the tests

- **Spline (p. 2272):** the 30°, 3/6 pitch, 20-tooth internal spline:
  - D = 6.66667 and Db = 5.7735 in
  - di = 0.576 in
  - inv φi = 0.03300, with φi = 25° 46.18′ and sec φi = 1.11044
  - Mi = 5.8352 in
- **ISO limits (p. 664):** Examples 1 to 5:
  - g9 at 133 mm: 132.986 and 132.886
  - D3 at 20 mm: 20.069 and 20.065
  - M5 at 32 mm with Δ = 4 µm: 31.995 and 31.984
  - h8 at 40 mm: 40.000 and 39.961
  - js7 at 60 mm: 60.015 and 59.985
- **Cylinder portions (pp. 83–84):**
  - the half-circle ungula: 8.33 in³, with an area ABC of 9.82
  - the cylinder cut off at an angle: 1534 cm³ and 490.9 cm²
- **After-tax NPV (p. 141):**
  - continuous process: −14,775 + 15,056 = 281
  - batch process: 1,135 + 7,026 = 8,161
  - batch chosen

## Notes on the source

- **External spline formula:** the extracted text drops the π in the last term, printing it as a bare "N". The tool uses π ÷ N, which is the standard over-pins relation for external teeth. The handbook gives no external example to check against.
- **Rounding:** the spline example works with five-figure trigonometric values, so Mi is 5.8351 by direct calculation against the printed 5.8352. The handbook’s rounded constants 0.3927 and 1.5708 give 1,533,984 mm³ for the cut-off cylinder, against 1,533,981 mm³ with π.
- **ISO limits Example 1:** the text prints the lower deviation as "0.114 mm" without its minus sign. The printed limits (132.986 and 132.886) confirm −0.114 mm.

## Verification (on top of 77ee2c2)

- `node scripts/tools/input-guides.mjs check --file handbook101`: 4 tools, 34 inputs, 0 problems.
- Calculator tests: 1,175/1,175, including four new tests.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,426/1,426
  - post-build checks: 4,327 pages verified
- `npm run knowledge:check`: valid (871 published links). `npm run seo:validate`: passed. Inventory: 1034 tools, 8,967 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1034/1034 tools passed with 8,967 figures.
- The spline tool was also run in the browser with the handbook example. It gives 25° 46.19′ at the pin centre and Mi = 5.8351 in (148.21 mm).
