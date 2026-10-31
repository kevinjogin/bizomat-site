# WORKOS release: batch handbook91, 1 November 2026

Three tools completing the deep audit of the Machinery’s Handbook thrust bearing section, taking WORKOS from 983 to 986 tools (MAKEOS handbook tools 789 → 792). Requested by the owner ("Start handbook91"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (all three tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Readings from the handbook’s design charts, taper values, oil properties and accepted limits are always user inputs.

## Deep audit

Handbook90 built the flat plate thrust bearing. This batch builds the other three types on pp. 2345–2356, each from the handbook’s procedure and worked example. The live tools `thrust-bearing-pads` and `thrust-pad-bearing-check` check a thrust face’s unit load, PV and oil flow, but follow none of these procedures. `MH_DEEP_AUDIT.md` now records the whole thrust bearing section (pp. 2338–2356) as built.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Step Thrust Bearing Design](https://kevos.com/tools/step-thrust-bearing-design/) | Power Transmission | a = (D2 − D1) ÷ 2; B = π(D1 + D2) ÷ 2; b = B ÷ i − s; U = B N ÷ 12; h = √(2.09 × 10⁻⁹ i a³ U Z ÷ W); e = 0.7 h; Pf = 7.35 × 10⁻¹³ i a² U² Z ÷ h; b2 = 1.2 b ÷ 2.2; Q = 6.65 × 10⁻⁴ i a h U; Δt = 42.4 Pf ÷ c Q (no chart readings) | — |
| [Tapered Land Thrust Bearing Design](https://kevos.com/tools/tapered-land-thrust-bearing-design/) | Power Transmission | D2 = √(4W ÷ π Kg p + D1²); b = (B − i s) ÷ i; p = W ÷ i a b; YL = b ÷ (1 + π² b² ÷ 12 a²); K = 5.75 × 10⁶ p ÷ (U YL Z); Pf = 8.79 × 10⁻¹³ i a b J U² Z; Q = 42.4 Pf ÷ c Δt; YS = 8 a b ÷ (D2² − D1²); QF = 8.9 × 10⁻⁴ i δ2 D2³ N YG YS² ÷ (D2 − D1) | Plain bearings by the numbers: thrust bearings |
| [Tilting Pad Thrust Bearing Design](https://kevos.com/tools/tilting-pad-thrust-bearing-design/) | Power Transmission | i ≈ B Kg ÷ a; b ≈ B Kg ÷ i; p = W ÷ i a b; O = 1.45 × 10⁻⁷ Z2 U ÷ 5 p b; hmin = α b; Pf = f W U ÷ 33,000; Q = 0.0591 α i a b U; Δt = 0.0217 f p ÷ α c | Plain bearings by the numbers: thrust bearings |

All three tools convert SI inputs to the handbook’s inch, pound and °F units for its constants, and show results in SI with the inch values. The minimum film you accept is an input. The handbook suggests about 0.001 in for small bearings and 0.002 in for larger and high-speed bearings, but does not define "small".

Knowledge connections: 2 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the step thrust bearing with the plain bearings thrust chapter, because that chapter does not discuss step bearings.

## Handbook values reproduced by the tests

- **Step bearing (7/8 in shaft, 25 lb, 5000 rpm, 25 cP, 3.4 Btu/gal °F):**
  - a = 1 in, B = 6.28 in, 5.9 pads (6 taken), b = 0.985 in
  - U = 2620 fpm, h = 0.0057 in, e = 0.004 in
  - Pf = 0.133 hp, b2 = 0.537 in, Q = 0.060 gpm, Δt = 28 °F
- **Tapered land bearing (70,000 lb, 3600 rpm, 18 cP, 3.5 Btu/gal °F):**
  - D2 = 17.2 in, a = 5 in, B = 37.7 in, 6.85 pads (6 taken), b = 5.78 in
  - p = 404 psi, U = 11,300 fpm, YL = 2.75, K = 4150
  - Pf = 91 hp, Q = 22.0 gpm, YS = 0.963, D1/D2 = 0.41, QF = 26.7 gpm
- **Tilting pad bearing (70,000 lb, 3600 rpm, D2 = 15 in):**
  - a = 4 in, B = 34.6 in, 6.9 pads (6 taken), b ≈ 4.61 in (4.75 in taken)
  - U = 10,400 fpm, p = 614 psi, O = 1.86 × 10⁻⁶, hmin = 0.0014 in
  - Pf = 79.4 hp, Q = 21.02 gpm, Δt = 45.7 °F

## Notes on the source

- **Step bearing film thickness:** the formula is a square root, h = √(2.09 × 10⁻⁹ i a³ U Z ÷ W), as the page image shows. The text layer drops the radical.
- **Tapered land leakage factor:** the example reads YL = 2.75 from Fig. 8. The printed formula b ÷ (1 + π² b² ÷ 12 a²) gives 2.754, so the tool calculates it.
- **Tapered land film flow:** the formula uses the taper at the outside diameter, δ2, as the example does (0.005 in).
- **Tilting pad oil flow and temperature rise:** both include the film factor α, as the page image shows (Q = 0.0591 α i a b U, Δt = 0.0217 f p ÷ α c).
- **Tilting pad unit load:** the example works at 614 psi with the largest available outside diameter (15 in), above the 500 psi maximum in the handbook’s Table 1. The tool flags this. At 500 psi the outside diameter would need to be 16.5 in.
- **Rounded pitch-line velocities:** the examples round them. The tilting pad example uses 10,400 fpm where B N ÷ 12 gives 10,367, which moves Pf from 79.4 to 79.2 hp.

## Verification (on top of b06db5c, after rebasing over a READOS publish)

- `node scripts/tools/input-guides.mjs check --file handbook91`: 3 tools, 44 inputs, 0 problems. Inventory: 986 tools, 8,554 inputs, all covered.
- Calculator tests: 1,124/1,124.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,272/1,272
  - post-build checks: 4,169 pages verified
- `npm run knowledge:check`: valid (799 relationships with main’s new links). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 986/986 tools passed with 8,554 figures. The step bearing tool was also opened and run in the browser.
