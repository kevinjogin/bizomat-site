# WORKOS release: batch handbook75, 29 October 2026

Five integrated design checks added to WORKOS (MAKEOS collection), taking the directory from 893 to 898 tools. Requested by the owner on 29 October 2026 ("Build another batch"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced; cutting data, grinding ratios, allowables, ratings and angle derating are always user inputs.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Trepanning Plan](https://kevos.com/tools/trepanning-plan/) | Manufacturing | Ring cut power k_c w f v_m ÷ 60,000, torque, time, volume removed and core mass and value; solid drill power and time as the drilling cycle planner | Cutting force, power and torque |
| [Grinding Wheel Cost Plan](https://kevos.com/tools/grinding-wheel-cost-plan/) | Manufacturing | Stock volume, wheel wear V_w ÷ G (G as the grinding geometry tool), dressing volume per part, usable wheel volume, parts per wheel, wheel and time cost per part | Grinding, honing and lapping |
| [Drill Bushing Position Check](https://kevos.com/tools/drill-bushing-position-check/) | Quality | Radial clearance from the drill and bushing limits plus wear, tilt 2c ÷ L_b, offset at the work c + tilt × gap, position error 2e against the zone, chip gap ratio | Designing jigs and fixtures that pay |
| [Woodruff Key Check](https://kevos.com/tools/woodruff-key-check/) | Fasteners | Key shear F ÷ wL as the parallel key tool, hub bearing on the height above the shaft, shaft bearing, shaft torsion K_t 16T ÷ πd³ | Broaching, knurling and indexing |
| [Eyebolt Lift Check](https://kevos.com/tools/eyebolt-lift-check/) | Mechanics | Hook equilibrium T₁ = W sin a₂ ÷ sin(a₁ + a₂), T₂ = W sin a₁ ÷ sin(a₁ + a₂) (equal legs reduce to the sling tension tool), capacity at the angle, thread engagement | None found that covers eyebolts |

Knowledge connections: 4 approved relationships, each with the chapter text and the tool's calculation checked (`docs/knowledge-links-review.md`). No READOS chapter covers eyebolts, so that tool has none.

## Verification

- Every tool has independent reference values computed separately in Node, cross-checks against the tools it chains (drilling cycle planner, grinding geometry, parallel key stress, sling tension), pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook75`: 5 tools, 56 inputs, 0 problems.
- `npm run verify` on the tree as pushed (9f39439, rebased on aa2c1c7): astro check clean; 1,150/1,150 tests; 3,724 pages verified by the post-build checks. `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Fixed before release: two eyebolt field labels contained an apostrophe, which the calculator report escapes, so the report test could not find them; they were reworded. Money values in metrics use the shared `money()` helper, because the build's string replacement would have dropped the `$` from `A$` literals.
- Browser sweep: Playwright is not installed on the machine used, so `scripts/tools/input-guides-browser.mjs` was not run; it should be run in the cloud environment.

## Limits stated in the tools

The trepanning plan is a unit-power estimate and does not check chips or the stiffness of the long tool. The grinding plan holds the grinding ratio constant. The bushing check covers clearance and tilt at the start of the hole, not drill flexure or the jig's own errors. The Woodruff check assumes uniform stress along the key and static torsion. The eyebolt check is static equilibrium of two legs at one hook, and the allowed share at an angle must come from the eyebolt maker.
