# WORKOS release: batch handbook93, 1 November 2026

Four tools from the deep audit of the Machinery’s Handbook spur gearing section, taking WORKOS from 990 to 994 tools (MAKEOS handbook tools 796 → 800). Requested by the owner ("Start handbook93"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (all four tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Dedendum and hob tip radius constants, hob addendums and tip radii, pinion enlargements from the handbook tables, accepted contact ratios, operating pressure angle ranges and shaving allowances are always user inputs.

## Deep audit

The spur gearing pages (pp. 2131–2159) are cited within 20- to 39-page ranges by more than twenty live gear tools. These already cover a lot:

- the standard formulas (`dp-spur-gear`, `inch-spur-gear-check`)
- contact diameters, contact ratio, LPSTC and the maximum hob tip radius (`spur-contact-diameters`)
- interference against a TIF diameter you enter (`gear-mesh-interference-check`)
- profile shift for a given centre distance (`gear-centre-distance-design`, `profile-shift`)
- chordal thickness and caliper settings (`chordal-tooth`, `gear-tooth-caliper-setting`)

None of them follows these handbook procedures:

- the highest point of single tooth contact, the true involute form diameter from the dedendum and hob tip radius constants, the hobbed undercut limit, and roll angles for the involute profile checker
- the handbook procedure for gears of standard pitch cut by a hob of given addendum to run at a non-standard centre distance, where each gear takes the basic tooth thickness at its operating pitch circle
- enlarged pinions by outside diameter enlargement: tooth thickness t = p ÷ 2 ± e tan φ, the centre distance for no backlash, and the smallest reduced gear N = 2 a csc² φ
- the centre-distance method for the stock left on preshaved gears

`MH_DEEP_AUDIT.md` in the generator folder records these pages as built.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Spur Gear Profile Checker Settings](https://kevos.com/tools/spur-gear-profile-checker/) | Gears | cos A = N cos φ ÷ Do P; tan b = tan φ − (N ÷ n)(tan A − tan φ); contact ratio by (7a), (7b) and (7c); tan c = tan a − 2π ÷ n; tan d = tan b + 2π ÷ n; rc (max) = (0.785398 cos φ − b sin φ) ÷ (1 − sin φ); (b − rc) ÷ sin φ + rc ≤ 0.5 n sin φ; tan e = tan φ − (4 ÷ n)[(b − rc) ÷ sin 2φ + rc ÷ 2 cos φ]; diameters n cos φ ÷ P cos of each angle; roll angle = tan × 57.2958 | Gears by the numbers: centre distance and contact ratio; undercut and profile shift |
| [Spur Gears Cut for a Given Centre Distance and Ratio](https://kevos.com/tools/spur-gears-for-given-centre-distance/) | Gears | P1 = (NP + NG) ÷ 2 C1; φ1 = arccos (P1 cos φ ÷ P); t1 = 1.5708 ÷ P1; tP = (NP ÷ P)(1.5708 ÷ NP + inv φ1 − inv φ); bP1 = bc − (tP − 1.5708 ÷ P) ÷ 2 tan φ; DPR1 = NP ÷ P − 2 bP1; DPO = 2 C1 − DGR1 − 2 (bc − 1 ÷ P) | Gears by the numbers: centre distance and contact ratio; undercut and profile shift |
| [Enlarged Spur Pinion Mesh](https://kevos.com/tools/enlarged-spur-pinion-mesh/) | Gears | t = p ÷ 2 + e tan φ; T = p ÷ 2 − e tan φ; inv φ1 = inv φ + (P (t + T) − π) ÷ (n + N); C1 = C cos φ ÷ cos φ1; N = 2 a csc² φ; Nmin = 2 P csc² φ [aH − rt (1 − sin φ)] | Gears by the numbers: undercut and profile shift |
| [Gear Shaving Stock Check](https://kevos.com/tools/gear-shaving-stock-check/) | Gears | t2 = 2 tan φ × d; checked by the tight-mesh involute relation | Gears by the numbers: backlash and tooth thickness |

All four tools take the module in millimetres (25.4 ÷ P) and show results in SI. The tests check them against the handbook’s inch examples.

Knowledge connections: 6 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the profile checker tool with the gears book’s measuring chapter, because that chapter covers span measurement, identifying gears and accuracy grades, not profile inspection by roll angle.

## Handbook values reproduced by the tests

- **Significant diameters (10 diametral pitch, 20°, 23-tooth pinion of 2.5 in outside diameter, 31-tooth gear of 3.3 in):**
  - contact diameters 2.1815 in and 2.9725 in
  - contact ratio 1.626 by both formulas, and the same by (7c)
  - LPSTC 2.2616 in and 3.0672 in
  - HPSTC 2.3362 in and 3.1433 in
  - rc (max) = 0.4719; with rc = 0.30, 3.0776 < 3.9332, so no undercut
  - TIF diameters 2.1681 in and 2.9468 in
- **Gears for a given centre distance (8 diametral pitch, 20°, 28 and 88 teeth, 7.50 in, hob addendum 0.169 in):**
  - P1 = 7.7333, φ1 = 24.719°
  - operating pitch diameters 3.6207 in and 11.3794 in; base diameters 3.2889 in and 10.3367 in; t1 = 0.20312 in
  - tooth thicknesses 0.2454 in and 0.3505 in; dedendums 0.1016 in and −0.0428 in
  - root diameters 3.2968 in and 11.0856 in; outside diameters 3.8264 in and 11.6152 in
- **Enlarged and reduced teeth (10 teeth, 5 diametral pitch, 14½°, 0.2746 in):** arc thicknesses 0.3852 in and 0.2432 in at the standard centre distance.
- **Centre distance for no backlash (10 and 30 teeth, 100 diametral pitch, 20°, pinion 0.01873 in thick):**
  - inv φ1 = 0.022459, φ1 = 22°49′
  - C = 0.2000 in, C1 = 0.2039 in
- **Reduced gear for an enlarged 24-tooth pinion (1 diametral pitch, 14½°, enlarged 0.4954 in):** N = 39.8, use 40.
- **Enlarged 14-tooth pinion (6 diametral pitch, 20°):** outside diameters 2.745 in and 10.255 in for the 60-tooth gear.

## Notes on the source

- **Gear contact diameter:** the example gives 2.9725 in with cos B rounded to 0.98000. With tan B = 0.20267 exactly, cos B = 0.98007 and Dc = 2.9723 in.
- **Gear contact step:** the example’s working for tan B prints 0.36937 for tan 20°, but its result 0.20267 uses the correct 0.36397.
- **Undercut and TIF:** the two formulas agree. When the undercut test fails, tan e comes out negative, and the tool then reports the TIF at the base circle and flags the undercut.
- **Minimum teeth for a reduced gear:** the handbook gives N = 2 a csc² φ with a the enlarged pinion’s addendum, for a gear reduced by the same amount. The tool works a from the gear’s own reduction, which gives the same result in that case.
- **Shaving stock:** the handbook formula t2 = 2 tan φ × d is the small-change form of the tight-mesh relation on p. 2155. The tool shows both, and they agree to within 0.0002 mm for the example.

## Verification (on top of 9f26268)

- `node scripts/tools/input-guides.mjs check --file handbook93`: 4 tools, 32 inputs, 0 problems. Inventory: 994 tools, 8,620 inputs, all covered.
- Calculator tests: 1,134/1,134.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,282/1,282
  - post-build checks: 4,199 pages verified
- `npm run knowledge:check`: valid (839 relationships). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 994/994 tools passed with 8,620 figures. The profile checker tool was also opened and run in the browser, where it flags fillet interference when the gear outside diameter is raised to 86.36 mm.
