# WORKOS release: batch handbook100, 2 November 2026

Five tools from the deep audit of the Machinery’s Handbook speed table adjustment, grinding, fastener torque and alternative power thread pages, taking WORKOS from 1025 to 1030 tools (MAKEOS handbook tools 831 → 836). Requested by the owner ("Next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 2 November 2026 (all five tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced.

The tools build in the handbook’s formulas. These are always user inputs:
- the speed table pair and the adjustment factors read from Tables 5a, 5c and 15b to 15d
- specific grinding forces and force ratios
- costs and rates
- Taylor constants
- friction coefficients and bolt strengths

## Deep audit

The audit flagged these pages because they are cited only inside wide page ranges:
- the milling speed adjustment pages (pp. 1040–1042, 1056), cited only within the 20-page ranges of the ball-nose and milling feed tools
- the grinding pages (pp. 1200–1204, 1215), cited only within the 70-page grinding range
- the torque and tension page (p. 1533), cited only within 15- and 16-page fastener ranges
- the alternative centralizing Acme page (p. 1944), cited only within the 26-page Acme range

What the existing tools cover:
- `inch-speeds-feeds` and `cutting-speed` turn a speed into spindle speed, but none applies the table adjustment factors.
- `grinding-wheel-life-plan` gives the Taylor line, SMRR and work speed, but not the forces or the economic life.
- `bolt-torque-preload` uses a single nut factor K.
- `acme-thread` and the handbook98 thread tools cover the Acme forms only.

The turning adjustment examples (pp. 1025, 1035) use the same method, so they are included in the same tool.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Cutting Speed Adjusted from the Feed and Speed Tables](https://kevos.com/tools/cutting-speed-table-adjustment/) | f ÷ fopt and Vavg ÷ Vopt to read the tables; V = Vopt Ff Fd (turning, drilling, full slot), VHSS Ff Fd, Vopt Ff Fd Far (face), Vopt Ff Far (slit, fed in); for partial-width end, side and slit milling fmax and fmin from the feed factors, Ff = Ff2 + (f − fmin) ÷ (fmax − fmin) × (Ff1 − Ff2), Fd read at f ÷ fmax; n = 1000 V ÷ πD; feed rate f z n | Machining: cutting speed and spindle speed |
| [Grinding Force, Torque and Power from Equivalent Chip Thickness](https://kevos.com/tools/grinding-force-and-power/) | Fc = Kc × ECT × CEL; FH = (FH ÷ FC) Fc; torque Fc D ÷ 2; power Fc V ÷ 60,000 | Machining: cutting force, power and torque |
| [Grinding Economic Wheel Life and Wheel Speed](https://kevos.com/tools/grinding-economic-wheel-life/) | TV = TRPL + 60 CE ÷ HR; TE = 3 TV; V = C ÷ TE^0.26; SMRR = 1000 ECT V; Vw = SMRR ÷ 1000 ar | Machining: machining economics and cutting speed |
| [Bolt Tightening Torque with Separate Thread and Bearing Friction](https://kevos.com/tools/bolt-torque-thread-friction/) | As by Equation (9); T = PB [l ÷ 2π + d2 μ1 ÷ (2 cos α) + (d + b) μ2 ÷ 4] (22); T = PB [0.159 l + d (0.531 μ1 + 0.625 μ2)] (23); T = PB (0.159 l + 1.156 μ d) (24) | Bolted joints: torque and the nut factor |
| [Square, Modified Square and 60° Stub Thread Basic Sizes](https://kevos.com/tools/power-thread-basic-sizes/) | square h = t = 0.5p, E = D − 0.5p, K = D − p; 10° modified square F = 0.4563p, G = 0.4563p − 0.17C; 60° stub h = 0.433p, F = 0.25p, G = 0.227p, E = D − 0.433p, K = D − 0.866p, clearance ≥ 0.02p | Machine elements: power screws and linear motion (one rejected pairing) |

Categories:
- the speed adjustment and the two grinding tools are in Manufacturing
- the bolt torque tool is in Fasteners
- the power thread tool is in Threads

Units: all inputs are SI (mm, m/min, N/mm², kW, MPa, kN). The table feeds and speeds are converted with the factors given at the head of each table.

Knowledge connections: 5 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the power thread tool with the bolted joints chapter on threads, tapped holes and screw lengths, which is about fastening threads.

## Handbook values reproduced by the tests

- **Speed adjustment:**
  - turning Example 1: 615 × 1.07 = 658 fpm
  - face milling: 2320 × 1.34 = 3109 fpm and 2970 rpm on a 4 in cutter
  - full slot: 80 × 6.86 = 548.8 fpm
  - the Table 15c note example: Ff = 7.27, V = 15 × 7.27 × 0.73 = 80 fpm, f ÷ fmax = 0.86
  - the slab milling feed rate: 108 rpm and about 7 in/min
  - Example 3: fmax = 0.0675, fmin = 0.0465 and f ÷ fmax = 0.74
- **Grinding:**
  - Example 5: 0.0017 mm² of chip area and 255 N of cutting force
  - economic lives of 6 and 15 minutes for TV of 2 and 5 minutes
  - SMRR of about 1000 mm³/mm/min at 1500 m/min and ECT 67 × 10⁻⁵ mm, with work speeds of about 100 and 150 m/min
- **Bolt torque:** the 1/2-13 grade 8 example, with a stress area of 0.1419 in², a preload of 11,707 lbf and a torque of 1158 lb-in by Equation (24).
- **Power threads:** the formulas of p. 1944. The handbook gives no worked example.

## Notes on the source

- **Example 3 (end milling, p. 1042):** the interpolation is printed as 7.90 + (0.050 − 0.0465) ÷ (0.0675 − 0.0465) × (7.01 − 7.90) = 7.75. That starts from Ff1 at the minimum feed. The Table 15c note gives Ff = Ff2 + (f − fmin) ÷ (fmax − fmin) × (Ff1 − Ff2), with Ff2 at the minimum feed, and its own example (7.27) follows that formula. The tool uses the note’s formula, so Example 3 gives Ff = 7.16, not the printed 7.75.
- **Table 15c note example:** fmax and fmin are rounded to 0.014 and 0.010 before interpolating. The test enters factors that give those feeds exactly.
- **Turning Example 2:** 615 × 1.07 × 1.03 is 677.8, against the printed 676 fpm.
- **Equation (22):** the first term is printed as "l ÷ 2" in the source text. The coefficient 0.159 in Equations (23) and (24) is 1 ÷ 2π, which confirms l ÷ 2π.

## Verification (on top of a5ddfa8)

- `node scripts/tools/input-guides.mjs check --file handbook100`: 5 tools, 44 inputs, 0 problems.
- Calculator tests: 1,171/1,171, including four new tests.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,422/1,422
  - post-build checks: 4,323 pages verified
- `npm run knowledge:check`: valid (867 published links). `npm run seo:validate`: passed. Inventory: 1030 tools, 8,933 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1030/1030 tools passed with 8,933 figures.
- The speed adjustment tool was also run in the browser with the Table 15c note example. It reports FEED IN THE RECOMMENDED RANGE, Ff 7.265 and V 79.55.
- **Build fixes:**
  - A "$" unit in a calculation was read as a replacement pattern by the generator and broke the build. The units now read "dollars" and "dollars per hour".
  - The grinding force tool's example inputs exceeded its default spindle power, so the default is now 10 kW.
- **Publishing:** main moved by one Library commit (a5ddfa8) while this batch was being committed. The batch was rebased onto it, and the knowledge links were rebuilt from main’s file with the batch’s links added again. Every gate above was then re-run on the rebased branch.
