# WORKOS release: batch handbook102, 2 November 2026

Three tools from the Machinery’s Handbook deep audit run at lower thresholds (cited ranges of 10 or more pages, 5 or more formula lines), taking WORKOS from 1034 to 1037 tools (MAKEOS handbook tools 840 → 843). Requested by the owner ("continue to work on next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 3 November 2026 (all three tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced.

The tools build in the handbook’s formulas. These are always user inputs:
- BA pitches and major diameters
- pipe diameters and wall thicknesses
- densities of the contents
- Young’s modulus, fracture toughness, microhardness and the constant A

## Deep audit

At the lower thresholds the audit lists 80 pages. Most of them belong to tools built in earlier batches, which cite them inside wide ranges:
- grinding (handbook89 and handbook100)
- the thread and Acme pages (handbook98)
- disc springs (built in an earlier deep audit batch)
- shaft alignment (handbook99)

Of the pages not built before:
- **BA threads (pp. 1981–1982):** cited only within a 10-page Whitworth range. `whitworth-thread` and `whitworth-wire-inspection` do not cover the 47½° BA form or BS 93.
- **Steel pipe (p. 3392):** cited only within the 13-page flange range. No tool gives the B36.10M plain-end mass.
- **Ductile-regime micromachining (pp. 1109–1110):** cited only within the turning cost and tool life ranges. No tool gives the critical depth of cut.

These pages are already covered and were not built:
- radius of gyration (pp. 228–231), covered by `mass-moment-inertia` and `mass-inertia-more` with the parallel axis
- motor acceleration (p. 2574), covered by `rotor-run-up-time`
- torsion spring Method 2 (p. 337), covered by `torsion-spring-designer`
- broach pitch (p. 980), covered by `broach-pitch`
- gear measurement over wires (p. 2236), covered by `gear-over-pins`

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [British Association (BA) Thread Basic Sizes and Limits (BS 93)](https://kevos.com/tools/ba-thread-limits/) | H = 1.13634p, h = 0.6p, r = 0.18083p, s = 0.26817p, E = D − h, K = D − 2h; bolt tolerances close 0.15p, 0.08p + 0.02, 0.16p + 0.04; normal 0.20p (0.25p above 10 BA), 0.10p + 0.025, 0.20p + 0.05 with 0.025 mm allowance to 10 BA; nut 0.12p + 0.03 and 0.375p | Machine elements: choosing fasteners and threads |
| [Wrought Steel Pipe Plain-End Mass (ASME B36.10M)](https://kevos.com/tools/steel-pipe-mass/) | Wpe = 0.02466 (D − t) t kg/m (D to 0.1 mm, t to 0.01 mm); Wpe = 10.68 (D − t) t lb/ft (to 0.001 in); bore, length and contents | Pipe welding: sizes, walls and pressure (one rejected pairing) |
| [Ductile-Regime Critical Depth of Cut for Brittle Materials](https://kevos.com/tools/ductile-regime-critical-depth/) | dc = A (E ÷ H)(Kc ÷ H)²; ductile when the depth is below dc; ploughing below half the edge radius | Machining and metal parts: EDM and micromachining |

Categories:
- the BA tool is in Threads
- the pipe tool is in Materials
- the critical depth tool is in Manufacturing

Units:
- The BA tool works in millimetres, as BS 93 does.
- The pipe tool takes millimetres and also gives lb/ft by the inch formula.
- The critical depth tool takes GPa, MPa·√m and µm.

Knowledge connections: 3 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the pipe tool with the shaft alignment chapter on pipe strain, which deals with forces from connected piping rather than pipe mass.

## Handbook values reproduced by the tests

- **BA threads (p. 1982):**
  - 0 BA basic depth 0.600, effective diameter 5.400, minor diameter 4.80 and radius 0.1808 mm
  - 4 BA depth and minor diameter of 0.396 and 2.808 mm, against the table’s 0.395 and 2.81
  - the tolerance formulas for each class
- **Steel pipe (p. 3393, Table 1):** the 2 in pipe with a 0.154 in wall at 3.65 lb/ft, and the 3/4 in pipe with a 0.154 in wall at 1.47 lb/ft, both by the inch formula.
- **Critical depth:** the formula only.

## Notes on the source

- **BA table rounding:** the table rounds the depth 0.6p to three decimals. For 4 BA (p = 0.66 mm) the formula gives 0.396 mm and the table prints 0.395.
- **Critical depth, Table 5:** the experimental critical depths in Table 5 (0.2 to 1.0 µm) are larger than the equation gives with A between 0.1 and 0.6 and the tabulated properties. The handbook notes that the properties depend on crystal orientation, surface condition and cutting fluid. The tool gives the equation’s value, and tells you to confirm the depth with test cuts.

## Verification (on top of c923150)

- `node scripts/tools/input-guides.mjs check --file handbook102`: 3 tools, 14 inputs, 0 problems. The first check flagged the pipe length guide as shorter than 30 characters, so it was lengthened.
- Calculator tests: 1,178/1,178, including three new tests.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,457/1,457
  - post-build checks: 4,352 pages verified
- `npm run knowledge:check`: valid (887 published links). `npm run seo:validate`: passed. Inventory: 1037 tools, 8,981 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1037/1037 tools passed with 8,981 figures.
- The BA tool was also run in the browser for 0 BA. It gives a depth of 0.6 mm, effective and minor diameters of 5.4 and 4.8 mm, and a radius of 0.1808 mm, as in the handbook table.
- **Publishing:** main moved twice before this batch was published (a1c7d0f, PR #40; then c923150, two Library books). The batch was rebased each time, the knowledge links rebuilt from main’s file with the batch’s links added again, and every gate above was re-run on the rebased branch.
