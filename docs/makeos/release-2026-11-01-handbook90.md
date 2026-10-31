# WORKOS release: batch handbook90, 1 November 2026

Two tools from the deep audit of Machinery’s Handbook pages, taking WORKOS from 981 to 983 tools (MAKEOS handbook tools 787 → 789). Requested by the owner ("continue to make next sets"; "Start handbook90"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (both tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Readings from the handbook’s design charts, oil properties, clearances and loads are always user inputs.

## Deep audit

Five journal and thrust bearing tools cite pp. 2328–2339 within 12- to 24-page ranges:

- `journal-bearing-design`
- `journal-bearing-oil-check`
- `journal-bearing-petroff`
- `thrust-bearing-pads`
- `thrust-pad-bearing-check`

They compute bearing pressure, Petroff friction, Sommerfeld number and simple heat balances. None follows the handbook’s own journal bearing lubrication analysis, which covers:

- the pressure-fed bearing, with its hydrodynamic and pressure flows
- the assumed-versus-actual temperature rise iteration
- the minimum film criterion

None follows its flat plate thrust bearing design either, which covers:

- the pad layout
- friction loss from the M chart
- the oil flow
- the feed chamfer depth

`MH_DEEP_AUDIT.md` in the generator folder records these pages as built.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Journal Bearing Lubrication Analysis](https://kevos.com/tools/journal-bearing-lubrication-analysis/) | Power Transmission | pb = W ÷ (K l d); P = 6.9 (1000 m)² pb ÷ (Z N); Cn = (l/d)² ÷ 60 P; Tf = T r² Z N ÷ (6900 × 1000 m); Pf = K Tf N l ÷ 63,000; QR = X Pf ÷ ta; Q1 = N l cd q d ÷ 294; Q2 = K′ ps cd³ d (1 + 1.5 ε²) ÷ (Z l); t = X Pf ÷ Q; repeat when \|t − ta\| > 5 °F; ho = ½ cd (1 − ε) against 200, 500 or 750 µin | Plain bearings by the numbers: supplying the oil; oil temperature and the heat balance |
| [Flat Plate Thrust Bearing Design](https://kevos.com/tools/flat-plate-thrust-bearing-design/) | Power Transmission | D2 = √(4W ÷ π Kg p + D1²); a = (D2 − D1) ÷ 2; B = π(D2 − a); b = (B − i s) ÷ i; p = W ÷ i a b; U = B N ÷ 12; Pf = i a b M; Q = 42.4 Pf ÷ c t; QF = 1.5 × 10⁵ i V h³ ps ÷ Z2; Qc = Q ÷ i; Q0c = Qc ÷ κ; g = ⁴√(Q0c l Z2 ÷ 4.74 × 10⁴ ps) | Plain bearings by the numbers: thrust bearings |

Both tools convert SI inputs to the handbook’s inch, pound, psi and °F units for its constants, and show results in SI with the inch values.

Knowledge connections: 3 approved relationships, each with the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`).

## Handbook values reproduced by the tests

- **Journal bearing example (2.3 × 1.9 in, 6000 lb, 4800 rpm, SAE 30 at 200 °F, single hole at 30 psi, cd = 0.003 in):**
  - First pass (assumed rise 20 °F):
    - pb = 1372 psi, P = 0.43, Cn = 0.027
    - Tf = 7.96 in·lb/in, Pf = 1.15 hp, QR = 0.69 gpm
    - Q1 = 0.306 gpm, Q2 = 0.044 gpm, Q = 0.350 gpm
    - t = 39.4 °F, so the tool asks for a repeat
  - Second pass (assumed rise 30 °F):
    - P = 0.49, Tf = 7.36, Pf = 1.07 hp, Cn = 0.023
    - Q1 = 0.317 gpm, Q2 = 0.050 gpm, Q = 0.367 gpm
    - t = 34.4 °F, so the rise is confirmed
    - ho = 0.00021 in
- **Flat plate thrust bearing example (900 lb, 4000 rpm, SAE 10 with c = 3.5 Btu/gal °F, 30 psi):**
  - D2 required 5.30 in, a = 1.25 in, B = 13.35 in, about 9 pads (10 taken)
  - b = 1.14 in, p = 63 psi, Pf = 2.7 hp, Q = 0.82 gpm
  - Qc = 0.082 gpm, Q0c = 0.186 gpm, g = 0.020 in

## Notes on the source

- **Journal bearing example:** it rounds 1000 m to 1.3 (the exact value is 1.304) and works with rounded intermediate values. The tool’s results agree within the tests’ tolerances: P to 0.01 and t to 0.5 °F.
- **Second pass:** step 21a multiplies X by 1.06 hp where step 13a gives 1.07 hp. With 1.07 hp the rise is 34.7 °F rather than 34.4 °F; both are within 5 °F of the assumed 30 °F.
- **Minimum film:** the example’s 0.00021 in film is below the handbook’s own 500 µin minimum for 1 to 4 in bearings. The tool flags it. The example shows a single trial clearance, and the handbook repeats the analysis over a range of clearances.
- **Thrust bearing, pitch-line velocity:** the example prints 4,430 ft/min. B N ÷ 12 = 13.35 × 4000 ÷ 12 = 4,450 ft/min.
- **Thrust bearing, film flow:** the example uses V = 1 (giving 0.038 gpm). The definition V = a ÷ b gives 1.10 and 0.041 gpm, which the tool uses.
- **Chamfer depth:** the "4" printed before the radical is the root index. g = ⁴√(Q0c l Z2 ÷ (4.74 × 10⁴ ps)) reproduces the example’s 0.02 in.

## Verification (on top of 82baba3, after rebasing over a READOS publish)

- `node scripts/tools/input-guides.mjs check --file handbook90`: 2 tools, 31 inputs, 0 problems. Inventory: 983 tools, 8,510 inputs, all covered.
- Calculator tests: 1,120/1,120.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,268/1,268
  - post-build checks: 4,144 pages verified
- `npm run knowledge:check`: valid (773 relationships with main’s new links). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 983/983 tools passed with 8,510 figures. The thrust bearing tool was also opened and run in the browser.
