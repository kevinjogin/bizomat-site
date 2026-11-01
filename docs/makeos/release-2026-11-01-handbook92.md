# WORKOS release: batch handbook92, 1 November 2026

Four tools from the deep audit of the Machinery’s Handbook helical gearing section, taking WORKOS from 986 to 990 tools (MAKEOS handbook tools 792 → 796). Requested by the owner ("Start handbook92"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (all four tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Cutter sizes, tooth thicknesses read from the handbook’s table, machine constants, the gears fitted and accepted lead errors are always user inputs.

## Deep audit

Six live tools cite the helical gearing pages (pp. 2197–2208) within 6- to 16-page ranges:

- `crossed-helical-gears`
- `crossed-helical-drive-check`
- `helical-gear`
- `helical-gear-set-design`
- `gear-shaft-sizing`
- `gear-forces`

The crossed helical tools take the helix angle as given, for shafts at 90° only. `helical-gear-helix-for-centre-distance` fits parallel helical gears to a centre distance, and `gear-cutter-number` uses the approximate formula N ÷ cos³ α. None of them follows these handbook procedures:

- crossed helical gears at an exact centre distance, found by trial, for any shaft angle (cases 4A and 6)
- the helix angle for the least centre distance (case 4B)
- the preferred cutter formula, which allows for the cutter diameter
- enlargement of helical pinions, with the tight-mesh centre distance
- change gears for hobbing helical gears without a differential

`MH_DEEP_AUDIT.md` in the generator folder records these pages as built.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Crossed Helical Gears at an Exact Centre Distance](https://kevos.com/tools/crossed-helical-exact-centre-distance/) | Gears | n ≈ 2 C Pn cos αa cos βa ÷ (R cos βa + cos αa); solve R sec α + sec β = 2 C Pn ÷ n with α + β = Σ; D = N ÷ Pn cos α; d = n ÷ Pn cos β; O = D + 2 ÷ Pn; L = π D cot α; least C where R sec α + sec β is smallest (cot α = R^⅓ at 90°); N′ = N sec³ α + Pn Dc tan² α | — |
| [Helical Gear Milling Cutter Selection](https://kevos.com/tools/helical-milling-cutter-selection/) | Gears | N′ = N K + Q K′ with K = sec³ α, K′ = tan² α, Q = Pn Dc; involute cutter series; L = π D cot α; whole depth 2.157 ÷ Pn; tooth thickness 1.571 ÷ Pn | Gears by the numbers: helical gears and axial thrust |
| [Enlarged Helical Pinion](https://kevos.com/tools/enlarged-helical-pinion/) | Gears | Pt = Pn cos ψ; d = n ÷ Pt; tan φt = tan φn ÷ cos ψ; Kh = 2.1 − (n ÷ cos ψ)(sin φt − cos φt tan 5°) sin φt; do = d + (2 + Kh) ÷ Pn; inv φ = inv φt + (tnP + tnG − π) ÷ (n + N); C′ = C cos φt ÷ cos φ | Gears by the numbers: helical gears and axial thrust; centre distance and contact ratio |
| [Helical Gear Hobbing Change Gears](https://kevos.com/tools/helical-hobbing-change-gears/) | Gears | R = L ÷ (L ∓ F) × K T ÷ N; F = L (N R − K T) ÷ N R; feed gears F ÷ M; L = F N R ÷ (N R − K T) | Machining and metal parts: broaching, keyways, splines, knurling and indexing |

All four tools take the normal module in millimetres (25.4 ÷ Pn) and show results in SI. The tests check them against the handbook’s inch examples.

Knowledge connections: 4 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the crossed helical tool with the gears book’s helical chapter, because that chapter covers parallel shafts only.

## Handbook values reproduced by the tests

- **Shafts at right angles, exact centre distance (Pn = 8, R = 3, C = 10 in, αa = 45°):**
  - n ≈ 28 (28 taken), N = 84
  - α = 46°6′, β = 43°54′
  - D = 15.143 in, d = 4.857 in, O = 15.393 in, o = 5.107 in
  - L = 45.78 in, l = 15.857 in
  - cutter teeth N′ = 275, n′ = 94
- **Least centre distance for the same pair:**
  - α = 34°44′
  - D = 12.777 in, d = 6.143 in, C = 9.460 in
- **Shafts at 60°, both helix angles 30° (Pn = 8, 132 and 33 teeth):**
  - D = 19.052 in, d = 4.763 in
  - L = 103.66 in, l = 25.92 in
  - cutter teeth 203 and 51 by the approximate formula
  - With the example’s centre distance of 11.9075 in, the tool finds 30° on both gears.
- **Cutter selection (15 teeth, 30°, Pn = 20, Q = 37.80):**
  - K = 1.540, K′ = 0.333
  - N′ = 35.70: cutter No. 3
  - the approximate formula gives 23, cutter No. 5
- **Enlarged pinion (12 teeth, Pn = 32, ψ = 18°, with a standard 24-tooth gear):**
  - d = 0.3943 in, do = 0.4834 in
  - C = 0.5914 in, φt = 20°56′30″
  - inv φ = 0.027647, φ = 24°22′7″, C′ = 0.606 in
- **Hobbing (48 teeth, lead 44.0894 in, feed 0.035 in, K = 30, M = 0.075, single-thread hob of the same hand):**
  - R = 0.62549654
  - index gears (34 × 53) ÷ (43 × 67) = 0.625477265
  - feed corrected to 0.0336417 in, feed gear ratio 0.448556
  - feed gears (71 × 75) ÷ (106 × 112) = 0.448534, giving a feed of 0.03364 in
  - about 0.00005 in lead error per inch of lead

## Notes on the source

- **Cutter teeth N′ for case 4A:** the example gives 275 and 94 (cutter Q = 20.88 for Pn = 8). The preferred formula gives 274.5 and 94.2 at the exact helix angles.
- **Enlargement Kh:** the example reads 0.851 from the graph, and formula (4) gives 0.857. The outside diameter differs by 0.0002 in.
- **Lead obtained:** the example gives 44.087196 in. With the exact gear ratios, formula (4) gives 44.0869 in. The result is sensitive to the rounding of N R − K T, which is only 0.0229. Both are about 0.00005 in per inch of lead.
- **Pinion teeth estimate:** the case 4A example prints 28.25. The formula gives 28.28, and both round to 28.
- **Cutter pitch diameter:** the cutter table’s note gives Dc = Do − 2(1.57 ÷ Pn), which does not reproduce the table; for example, it gives 5.36 in for Pn = 1 against the 6.18 in listed. With 1.157 in place of 1.57 most entries match (6.186 in for Pn = 1, 1.884 in for Pn = 20), so 1.57 appears to be a misprint, though a few entries (Pn = 1¼, 1¾, 6 and 8) still differ. The tool takes the cutter’s pitch diameter as an input.

## Verification (on top of 64a5c5d, after rebasing over a READOS publish)

- `node scripts/tools/input-guides.mjs check --file handbook92`: 4 tools, 34 inputs, 0 problems. Inventory: 990 tools, 8,588 inputs, all covered.
- Calculator tests: 1,129/1,129.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,277/1,277
  - post-build checks: 4,195 pages verified
- `npm run knowledge:check`: valid (832 relationships). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 990/990 tools passed with 8,588 figures. The crossed helical tool was also opened and run in the browser.
