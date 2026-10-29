# WORKOS release: batch handbook77, 30 October 2026

Three integrated design checks added to WORKOS (MAKEOS collection), taking the directory from 905 to 908 tools. Requested by the owner ("Build another batch"). No shared tool code, layout, navigation, READOS content or existing tool was changed. Batch number handbook76 was already in use by another session, so this batch is handbook77.

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced; bearing ratings, case depth factors, resistivity, ratio limits and allowables are always user inputs.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Countershaft Bearing Check](https://kevos.com/tools/countershaft-bearing-check/) | Power Transmission | Spur tooth forces F_t = 2T ÷ d, F_r = F_t tan φ (as the gear tooth forces tool), resolved by mesh angle; reactions in two planes; L10 = (C ÷ P)^p × 10⁶ ÷ 60n (as the bearing L10 life tool); s₀ = C₀ ÷ P; combined shaft stress √(σ² + 3τ²) | Selecting bearings and lubrication for reliable machines |
| [Carburizing Case Depth Plan](https://kevos.com/tools/carburizing-case-depth-plan/) | Materials | Total case = (effective + stock ÷ 2) ÷ ratio; time t = (d ÷ K)²; cycle and cost per part; case share of the half-section | Carburising the shaft; Heat treatment and surface hardening explained |
| [Induction Hardening Plan](https://kevos.com/tools/induction-hardening-plan/) | Materials | Reference depth δ = 503 √(ρ ÷ μ_r f); frequency for a target depth; heated layer energy m c_p ΔT; work and generator power; power density | Induction and infrared; Heat treatment and surface hardening explained |

Knowledge connections: 5 approved relationships, each with the chapter text and the tool's calculation checked (`docs/knowledge-links-review.md`).

## Verification

- Every tool has independent reference values computed separately in Node (two-plane reactions and moments, rating life, parabolic case growth, reference depth and layer energy), cross-checks against the tools it chains (gear tooth forces, bearing L10 life, bearing static ratio), pass and fail verdicts for every outcome, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook77`: 3 tools, 42 inputs, 0 problems.
- `npm run verify` on the tree as pushed (d788504, rebased twice as the Greiner batch landed): astro check clean; 1,158/1,158 tests; 3,734 pages verified by the post-build checks. `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep: Playwright is not installed on the machine used, so `scripts/tools/input-guides-browser.mjs` was not run; it should be run in the cloud environment.

## Limits stated in the tools

The countershaft check covers spur gears on a simply supported shaft with steady torque; helical axial forces, preload and fatigue at keyways are not included. The carburizing plan uses the parabolic law with a constant factor, which does not describe boost-diffuse cycles exactly. The induction plan uses the electromagnetic reference depth and the energy of the heated layer only; conduction into the core and surface losses add to the real demand, so trial parts must be sectioned.
