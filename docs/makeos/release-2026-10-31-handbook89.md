# WORKOS release: batch handbook89, 31 October 2026

Three tools from a deeper audit of Machinery’s Handbook pages, taking WORKOS from 978 to 981 tools (MAKEOS handbook tools 784 → 787). Requested by the owner ("continue to make next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (all three tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Taylor constants, wheel speed ratings, effective relief angles and target chip thicknesses are always user inputs.

## Deep audit

Every formula page in the page ledger was already cited by a tool or read by hand. Some pages, however, were cited only because a tool cites a wide page range, so their own formulas may never have been built. A new script, `mh-deep-audit.cjs` in the generator folder, lists formula-heavy pages whose every citation is a range six or more pages wide. `MH_DEEP_AUDIT.md` records what was found on each page examined. This batch built from three of the listed sections:

- **Grinding feeds and speeds (pp. 1205–1214):** five grinding tools cited the 70-page grinding section, but none used the handbook’s grinding data system. That system works through Taylor lines at a chosen equivalent chip thickness, with a shop calibration.
- **Milling chip geometry (pp. 1162–1166):** mean and equivalent chip thickness against the radial depth of cut.
- **Thread cutting (pp. 2040–2041):** relief and nose angles of single-point thread cutting tools.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Grinding Wheel Life and Removal Rate Plan](https://kevos.com/tools/grinding-wheel-life-plan/) | Manufacturing | V T^0.26 = C at the chosen ECT; V = C ÷ T^0.26; SMRR = 1000 ECT V; Vw = SMRR ÷ (1000 ar); shop calibration CU = VU TU^0.26, ratio CU ÷ C; wheel and work rpm, side feed, feed rate, removal rate and time per pass; wheel speed against the marked rating | Machining and metal parts: grinding, honing and lapping |
| [Single-Point Thread Cutting Tool Relief and Nose Angles](https://kevos.com/tools/thread-tool-relief-angles/) | Threads | tan ψ = lead ÷ πK, tan φ = lead ÷ πD; a = ae + ψ, a′ = ae − φ; tan b = tan a cos ½ thread angle; tan n = (tan a − tan a′) ÷ (2 tan ½ thread angle) | — |
| [Milling Mean Chip Thickness and Equivalent Chip Thickness](https://kevos.com/tools/milling-chip-thickness-ect/) | Manufacturing | cos AE = 1 − 2 ar/D (end) or 1 − 2 (ar/D)² (face, centred); hm = fz (1 − cos AE) ÷ AE or fz 2 sin ½AE ÷ AE; ECT = fz z ÷ π (ar/D) aa/CEL; feed per tooth for a target chip and its ratio to the reference feed | Machining by the numbers: milling feed and chip thinning; Machining and metal parts: milling cutters and milling strategies |

Knowledge connections: 3 approved and 1 rejected relationship, each with the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`). The rejected pair is **Grinding on a magnetic chuck** with the grinding wheel life plan, because that chapter covers holding the work, not wheel life.

## Handbook values reproduced by the tests

- **Grinding, Example 6:** C = 4690 gives V15 = 2319 m/min and V45 = 1743 m/min.
- **Grinding, Table 1 (group 1, ECT 0.00033):** V10 = 3830 m/min, V100 = 2105 m/min and SMRR10 = 1265 mm³/mm/min.
- **Grinding, Example 7 (shop calibration):**
  - At ECT 0.00017: CU = 2985 m/min, ratio 0.564, V10U = 1640 m/min, V100U = 900 m/min and SMRR1U = 507 mm³/mm/min.
  - At ECT 0.00033: V10U = 1455 m/min, V100U = 800 m/min and SMRR10U = 480 mm³/mm/min.
  - At ECT 0.00050: V9 = 1144 m/min and SMRR = 572 mm³/mm/min.
- **Thread tool, double Acme example (1 in, 5 tpi, 0.400 in lead, 29°, 10° effective relief):** ψ = 9.27°, φ = 7.26°, a = 19.27°, a′ = 2.74°, b = 18.70°, b′ = 2.65° and n = 30.26°.
- **Milling, Table 2a:** the engagement angle, hm ÷ fz and fz/fz0 for end milling (11 rows) and face milling (9 rows).
- **Milling, Table 2b:** ECT at 0.17 mm per tooth for end milling (z = 2) and face milling (z = 8). The reference hm is 0.108 mm at full slot.

## Notes on the source

- **Grinding:** the procedure on p. 1207 writes the Taylor line as (V × T)^0.26 = C, with the exponent on the product. The tables, Examples 6 and 7, and the formula on p. 1205 all follow V × T^0.26 = C (V = C ÷ T^0.26), which the tool uses.
- **Milling, Table 2a:** the ar/D = 0.5 rows print hm ÷ fz = 0.674 (end milling) and 1.025 (face milling), with ECT/hm = 0.558. The table’s own geometry gives 0.637 and 0.955, and the text says fz/fz0 = 1.0 at ar/D = 0.5, which only 0.637 satisfies. The tool follows the geometry, and the tests skip those rows. The face milling ECT/hm column does not follow from the formulas given and is not used.
- **Milling, worked ECT examples (p. 1165):** these start from a table ECT that already includes aa/CEL = 0.95 and multiply by 0.95 again. The tool uses the basic formula ECT = fz z ÷ π × (ar/D) × aa/CEL from p. 1164 once.
- **Thread tool:** the example rounds b′ to 2.65° and n to 30.26°. The formulas give 2.657° and 30.255°.

## Verification (on top of b5352e6)

- `node scripts/tools/input-guides.mjs check --file handbook89`: 3 tools, 29 inputs, 0 problems. Inventory: 981 tools, 8,479 inputs, all covered.
- Calculator tests: 1,117/1,117.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,265/1,265
  - post-build checks: 4,120 pages verified
- `npm run knowledge:check`: valid (742 relationships). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 981/981 tools passed with 8,479 figures. The thread tool was also opened and run in the browser.
