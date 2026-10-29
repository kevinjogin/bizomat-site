# WORKOS release: batch handbook74, 29 October 2026

Five integrated design checks added to WORKOS (MAKEOS collection), taking the directory from 882 to 887 tools. Requested by the owner on 29 October 2026 ("continue to publish"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced; cutting data, allowables, limits and fits are always user inputs.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Boring Bar Overhang Check](https://kevos.com/tools/boring-bar-overhang-check/) | Manufacturing | Cutting force k_c a_p f, cantilever deflection F L³ ÷ 3EI as the boring bar deflection tool, diameter error 2δ, first natural frequency (1.8751² ÷ 2π)√(EI ÷ ρAL⁴), longest overhang and feed for the allowance, a stiffer alternative material | Deflection, rigidity and chatter |
| [Slender Work Turning Check](https://kevos.com/tools/slender-work-turning-check/) | Manufacturing | Work deflection F L³ ÷ 48EI between centres or F L³ ÷ 3EI in a chuck, as the beam deflection tool; longest span, steady rests, largest feed | Deflection, rigidity and chatter; Workholding and toolholding |
| [Reaming Plan](https://kevos.com/tools/reaming-plan/) | Manufacturing | Pilot drill from the allowance, stock window, speeds and feed rates, drilling time as the drilling cycle planner, reaming time with retract at feed, holes per reamer | Drilling, reaming and tapping calculations; Drilling, reaming and tapping holes |
| [Dowel Pin Joint Check](https://kevos.com/tools/dowel-pin-joint-check/) | Fasteners | Pin shear and bearing as the bolt and pin shear and bearing tool, interference range and fit type from pin and hole limits, engagement ratio | Draw the load path before sizing the clamp; Drilling, reaming and tapping holes |
| [Taper Shank Holding Check](https://kevos.com/tools/taper-shank-holding-check/) | Manufacturing | Drilling torque and thrust as the drilling cycle planner; normal force F_a ÷ (sin α + μ cos α), friction torque μ N D_m ÷ 2, self-holding when tan α < μ | Workholding and toolholding |

Knowledge connections: 8 approved relationships, each with the chapter text and the tool's calculation checked (`docs/knowledge-links-review.md`).

## Verification

- Every tool has independent reference values computed separately in Node (cantilever and simply supported beam formulas, the clamped-cantilever frequency, drilling power and torque), cross-checks against the tools it chains (boring bar deflection, beam deflection, bolt and pin shear and bearing, drilling cycle planner), pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook74`: 5 tools, 61 inputs, 0 problems.
- `npm run verify` on the tree as pushed (cc7734c, rebased on handbook73): astro check clean; 1,130/1,130 tests; 3,713 pages verified by the post-build checks. `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser check: Playwright is not installed on the machine used, so `scripts/tools/input-guides-browser.mjs` was not run for this batch. The five tool pages were checked in a browser on the built site instead: every input has its guide and figure, the "Learn the Concepts" links show, the calculator recalculates on input (boring bar at 150 mm overhang: 67.05 µm, DEFLECTION TOO HIGH) and the console logs no errors. The full sweep should be run in the cloud environment with the next batch.

## Limits stated in the tools

The boring bar is a solid round bar rigidly clamped; chatter is not predicted. The slender work check treats the part as a uniform round beam on rigid supports. The reaming plan takes speeds, feeds, allowance and reamer life as inputs and checks only stock and time. The dowel check assumes equal load sharing and no moment on the pattern. The taper check uses Coulomb friction on a fully seated cone with the cutting thrust as the only seating force, so it estimates the order of the holding torque rather than rating it.
