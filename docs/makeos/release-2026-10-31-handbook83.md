# WORKOS release: batch handbook83, 31 October 2026

Six tools from Machinery’s Handbook pages that the page ledger had marked as candidates, taking WORKOS from 945 to 951 tools (MAKEOS handbook tools 751 → 757). Requested by the owner ("Continue to keep making tools from the book and keep record of all pages scanned and completed"; "Start next batch"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (all six tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced; friction coefficients, tap table allowances (X, Y, Z, C, D), tolerances, cutting data, tool lives and costs are always user inputs.

## Page ledger

| Pages | Before this batch | After |
|---|---|---|
| Cited by a live tool | 1,956 | 1,956 (1,977 once this batch is live) |
| Cited by a draft tool (handbook79 and handbook83) | 19 | 40 |
| Read by hand: tool possible, not yet built | 22 | 4 |
| Read by hand: nothing to build | 19 | 20 |
| No formula lines (tables, prose, figures) | 1,121 | 1,120 |
| Formula lines, not yet read | 180 | 177 |

Still a candidate after this batch:

- **Planetary and differential gearing, Figs. 1–24 (pp. 2212–2214).** Read from the page images. Each formula belongs to its drawing. In several compound figures, which planet meshes which gear cannot be read reliably at the image resolution, so a description without the drawing could give a wrong ratio. Not built.
- **Cut thread tap limits (Table 3, p. 910).** This could become a cut-thread option of the Unified tap tool.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Worm Profile Change with Cutter or Grinding Wheel Size](https://kevos.com/tools/worm-cutter-profile-correction/) | Gears | ANSI B6.9 formulas (1)–(8): ρ_ni = r sin φn ÷ sin²λ; ρ_n = ρ_ni + r ρ_ni ÷ (R cos²λ); Δφ = 5400 r sin³λ ÷ (n (R cos²λ + r)) minutes; q = a sec φn; y = q² ÷ 2ρ_n; s = 0.000582 q Δφ; Δy and Δs between two tools | — |
| [Industrial Worm Gearing Proportions](https://kevos.com/tools/industrial-worm-gearing-design/) | Gears | Table 4 rules: D = T P ÷ π, d = 2C − D, tan λ = L ÷ π d; AGMA addendum and whole depth (axial or normal pitch); outside and throat diameters; face width; thread length P (4.5 + 0.02 T); rubbing speed; efficiency by friction angle and the empirical rules; hunting tooth, 40-total and pressure angle checks | Choosing gearboxes and geared motors |
| [Wormgear Hob Design](https://kevos.com/tools/worm-hob-design/) | Gears | O = D + 2A + 2C + S, root D − 2A, D_h = D + S; AGMA sharpening allowance 0.075 P_n [16 − (h − H)] ÷ 16 + 0.010 in, solved with the diameters; setting angle λ − λ_h; flutes ≈ 3 O ÷ 2P with common-factor checks; helical flutes N = F ÷ cos²α and flute lead L F ÷ (N − F) | — |
| [Metric Ground Thread Tap Limits](https://kevos.com/tools/metric-tap-thread-limits/) | Threads | ASME B94.9 M profile: basic PD = D − 0.64951905 P; standard (basic + Y), D or DU limits in 0.013 mm steps; minimum major = max PD − Y + 0.64951904 P + 0.08 P; measured tap checked | Drilling, reaming and tapping (machining by the numbers) |
| [Unified Inch Ground Thread Tap Limits](https://kevos.com/tools/unified-tap-thread-limits/) | Threads | ASME B94.9 Unified: standard (basic + C), H or L limits in 0.0005 in steps; maximum major = min PD − C + 0.64951904 P + 0.130 P; B = 0.087, 0.076 or 0.065 P by threads per inch; measured tap checked | — |
| [Slot Milling against High-Speed End Milling](https://kevos.com/tools/slot-vs-high-speed-milling-cost/) | Manufacturing | rpm = 1000 V ÷ π D; FR = z f_z rpm; T_V = T_RPL + 60 C_E ÷ HR; c_tot = HR (passes × Dist ÷ FR)(1 + T_V ÷ T) ÷ 60 for both strategies, with ratio and saving per batch (A$, ex GST) | Milling feed and chip thinning; Milling cutters and milling strategies |

Knowledge connections: 4 approved and 2 rejected relationships. Each records the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`). No READOS chapter discusses the worm profile, hob proportions or Unified tap limits, so those tools have no links.

## Handbook values reproduced by the tests

- **Worm profile, Example 3** (r 0.4410 in, 30°, 20°, 10 threads, a 0.0441 in; 2 in cutter and 20 in wheel):
  - ρ_ni 0.6033 in
  - ρ_n 0.9581 and 0.6387 in
  - Δφ 24.99′ and 3.749′
  - q 0.0469 in
  - y 0.00115 and 0.00172 in
  - s 0.000682 and 0.000102 in
  - Δy 0.00057 in and Δs 0.000580 in
- **Industrial worm:**
  - 36/6 at 0.5 in pitch on 3.6 in centres gives D 5.729 in, d 1.471 in and a lead angle of about 33°.
  - The commercial 29/4 series from 4 to 8.25 in centres gives d, D and the lead angle to the printed minute.
- **Taps:**
  - M1.6 × 0.35 D3: 1.412 / 1.397 mm.
  - M6 × 1 DU4: 5.298 / 5.323 mm.
  - 3/8-16 H1: 0.3349 / 0.3344 in.
  - 3/8-16 L2: 0.3334 / 0.3339 in.
  - 7/16-14 plus 0.0017.
  - Table 2 constants A and B from their formulas at 80, 48, 40, 16, 12 and 4 TPI.
- **Milling cost:** full slot A$0.338 (6 teeth) and A$0.638 (2 teeth); high-speed A$0.0607 (printed 0.0606) and A$0.180.
- **Hob:** the allowance satisfies the AGMA formula at its own diameters. The handbook's N = 10.432 for F = 7 at 35° is reproduced, and the flute leads for N = 10 and 10½ are exact.

## Notes on the source

- **Worm profile, Example 3:** the handbook prints the 2 in cutter's y with the wheel's radius of curvature, and Δs as "0.00580". The tool applies formula (5) to each tool, which reproduces the example's own final values Δy = 0.00057 in and Δs = 0.000580 in.
- **Tap tables:**
  - Table 4 prints "Minimum pitch diameter = Max. pitch dia. + Z", and the D-limit step as 0.0013. The worked examples use minus and 0.013 mm, as here.
  - Table 2 prints A for 12 TPI as 0.1080; the formula A = 0.130 P gives 0.0108.
- **Worm proportions:**
  - The AGMA depth and face width rules are given for one to four threads. The tool applies the triple-and-quadruple rules for more threads and flags this.
  - The inch constants (0.25 in and 0.20 in face width allowance, 0.010 in sharpening allowance, C^0.875 ÷ 3 and the empirical worm diameter) are converted to millimetres at the boundary.
- **Overlap:**
  - `industrial-worm-gearing-design` repeats the friction-angle efficiency of the live `worm-gear` tool. It adds the coarse-pitch proportions, the empirical rules and the wormgear-driving case.
  - `slot-vs-high-speed-milling-cost` uses the same total-cost relation as `milling-cost-per-part`, applied to a comparison of two strategies.

## Verification (on top of 80de912, after rebasing over two READOS publishes)

- `node scripts/tools/input-guides.mjs check --file handbook83`: 6 tools, 65 inputs, 0 problems. Inventory: 951 tools, 8,262 inputs, all covered.
- Calculator tests: 1,081/1,081.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,229/1,229
  - post-build checks: 3,930 pages verified
- `npm run knowledge:check`: valid (590 relationships with main’s new links). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 951/951 tools passed with 8,262 figures. The A$ cost lines were checked in the built page.
