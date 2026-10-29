# WORKOS release: batch handbook68, 29 October 2026

Seven integrated design checks added to WORKOS (MAKEOS collection), taking the directory from 837 to 844 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Further references: Newnan, Eschenbach and Lavelle, *Engineering Economic Analysis*; Silver, Pyke and Thomas, *Inventory and Production Management in Supply Chains*; Esposito, *Fluid Power with Applications*; the NIST/SEMATECH e-Handbook (binomial distribution); Minitab’s methods page for the Type 1 Gage Study; VDA Volume 5 and AS/NZS 1554.1 named by number and scope only.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Machine Economic Life Check](https://kevos.com/tools/machine-economic-life/) | Money | EUAC for each life from capital recovery, sinking fund and gradient factors; the existing machine’s cost of one more year | NPV, IRR and payback; Before you buy |
| [Butt Weld Quantity and Cost Check](https://kevos.com/tools/groove-weld-cost-check/) | Fabrication | Groove area for single-V, double-V, single-bevel and square butt, with parabolic caps; weld metal, arc time and cost as the weld cost tool | Butt welds; Weld volume, cost and distortion; Pipe joint preparation and fit-up |
| [Cutting Insert Consumption and Reorder Plan](https://kevos.com/tools/insert-consumption-reorder-plan/) | Manufacturing | Taylor tool life, whole parts per edge, monthly use, safety stock z σ √L and reorder point | Demand forecasting; Cutting tool materials and coatings |
| [Bearing Fleet Spares Plan](https://kevos.com/tools/bearing-fleet-spares-plan/) | Maintenance | L10 rating life, Weibull characteristic life from L10, binomial spares for a service level | Selecting bearings and lubrication; Maintenance that prevents breakdowns |
| [Hydraulic Press Cycle Check](https://kevos.com/tools/hydraulic-press-cycle-check/) | Hydraulics | F = p A, v = Q ÷ A with a standard or regenerative approach, cycle time, motor power p Q ÷ 600 η | Hydraulic and servo presses |
| [Vacuum Table Workholding Check](https://kevos.com/tools/vacuum-table-workholding-check/) | Manufacturing | Vacuum holding force and friction against the mean cutting force P_c ÷ v_c with a peak factor | Workholding and toolholding |
| [Gauge Repeatability and Bias Check](https://kevos.com/tools/gauge-repeatability-bias-check/) | Quality | Type 1 study: Cg, Cgk, share of tolerance, two-sided bias t-test, resolution | Measurement system analysis |

Knowledge connections: 12 approved and 8 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

## Verification

- Every tool has independent hand-calculated reference values (closed forms, binomial sums and a Simpson integral of the t density, computed separately in Node), cross-checks against the existing tools it chains, pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook68`: 7 tools, 94 inputs, 0 problems. Inventory: 844 tools, 7,143 inputs, all covered.
- `npm run verify`: astro check 0 errors and 0 warnings; 1,047/1,047 tests; 3,650 pages verified by the post-build checks.
- `npm run knowledge:check`: valid, 227 relationships (212 approved) after rebasing on f9bf96c. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium 130 on the built site): 844/844 tools passed, 7,143 figures, including the 360 px phone check.

## Limits stated in the tools

Economic life assumes end-of-year cash flows and like-for-like replacement without tax or inflation. The butt weld groove and cap are idealised and preparation dimensions come from the user’s standard or procedure. Insert use relies on the user’s Taylor constants. The spares plan ignores renewals within the period and warns above 30 % failure per bearing. The press check uses ideal flow. The vacuum check covers sliding only, not lift-off. The gauge check is a type 1 study only (no reproducibility or linearity).
