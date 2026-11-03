# WORKOS release: batch norton3, 3 November 2026

Three tools from Norton’s *Design of Machinery*, taking WORKOS from 1049 to 1052 tools. Requested by the owner ("Next Norton set"). No shared tool code, layout, navigation, READOS content or existing tool was changed. The batch is not a Machinery’s Handbook batch, so it is not counted among the handbook tools.

Approved for publication by the owner on 3 November 2026 (all three tools).

Source: Robert L. Norton, *Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines*, 2nd edition (McGraw-Hill, 1999), chapters 4, 6, 7, 8 and 12, cited by topic and page only. No tables, figures, examples or text are reproduced. Every equation was read from the page images.

The tools build in Norton’s equations and the published coefficients of the modified trapezoid and modified sine cam functions. These are always user inputs:
- lengths and angles
- masses and centre of gravity positions
- lift, cam angle and speed

## Coverage before this batch

- `cam-motion` gives peak velocity and acceleration for four laws only. It has no jerk, no values at a chosen cam angle, and no modified trapezoid, modified sine or 4-5-6-7 polynomial.
- `cam-follower-design`, `cam-size-and-curvature` and `cam-follower-force-analysis` deal with cam size and forces.
- No tool covered the inverted slider-crank or linkage force balancing; the balancing tools cover rotating parts only.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Inverted Slider-Crank Position, Velocity and Acceleration](https://kevos.com/tools/inverted-slider-crank-kinematics/) | θ4 from P sin θ4 + Q cos θ4 + R = 0 (eqs. 4.21, 4.22), θ3 = θ4 ± γ (eq. 4.18), b (eq. 4.20a); ω4 and ḃ (eqs. 6.25, 6.29, 6.30); α4 and b̈ from eqs. 7.25 with the Coriolis term 2ḃω3 | Buckling: rods in machines |
| [Cam Follower Displacement, Velocity, Acceleration and Jerk](https://kevos.com/tools/cam-svaj-functions/) | simple harmonic (eq. 8.6), cycloidal (eq. 8.12), modified trapezoid (eq. 8.13), modified sine (eq. 8.14), 3-4-5 (eq. 8.20) and 4-5-6-7 (eq. 8.21) with exact derivatives; time values by ω, ω², ω³; peaks over the segment | Inertia and flywheels: move profiles and RMS torque (one rejected pairing) |
| [Fourbar Linkage Complete Force Balance](https://kevos.com/tools/fourbar-force-balance/) | (m2b2) and (m4b4) components (eqs. 12.8c, 12.8d), less the existing unbalance, as magnitude and angle from each link’s line of centres | Vibrating machine elements: waves, modes and excitations |

All three tools are in Mechanics.

Knowledge connections: 3 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the cam tool with the metal fatigue chapter on springs.

## Values reproduced by the tests

- **Table 8-2 peak factors** (as h/β, h/β², h/β³):
  - cycloidal: 2.000, 6.283 and 40
  - modified trapezoid: 2.000, 4.888 and 61
  - modified sine: 1.760, 5.528 and 69
  - 3-4-5: 1.875, 5.777 and 60
  - 4-5-6-7: 2.188, 7.526 and 52
  - simple harmonic velocity: 1.571
- **Example 8-2 (simple harmonic, 1 in in 90° at 1 rev/s):** 6.28 in/s and about 78.8 in/s².
- **Example 8-3 (cycloidal):** 8 in/s, 100.4 in/s² and about 2,523 in/s³.
- **Cam checks:**
  - every function starts at 0 and ends at h, and every fall ends at 0
  - the modified trapezoid and modified sine are continuous in s and a where their pieces join
  - for the 3-4-5, v and a equal finite differences
- **Inverted slider-crank:** for both circuits and for γ = 90° and 70°:
  - the loop closes (eq. 4.19)
  - ω4, ḃ, α4 and b̈ equal finite differences of the positions and rates
  - the Coriolis term equals 2ḃω
- **Force balance:** with the required counterweights, the mass moment of the linkage is constant to 10⁻⁶ at crank angles of 0°, 45°, 120°, 200° and 300°. The positions come from `fourbar-kinematics`. A constant mass moment means the global mass centre is stationary and the shaking force is zero.

## Notes on the source

- **Table 8-2:**
  - The simple harmonic peak acceleration is printed as 4.945 h/β². Equation 8.6c gives π²/2 = 4.935 h/β².
  - The 4-5-6-7 peak acceleration is printed as 7.526 h/β². The maximum of the derivative of eq. 8.21 is 7.513 h/β².
  - The tests allow for this rounding. The tool reports the values from the equations.
  - The table lists the jerk of the simple harmonic as infinite, because of the jump at the dwells. Within the segment it is π³/2 h/β³; the tool reports that value and flags the break in the fundamental law.
- **Examples 8-2 and 8-3:** the printed 78.8 in/s² and 2,523 in/s³ are rounded. The equations give 78.96 and 2,526.6.
- **Inverted slider-crank roots:** Norton gives two roots of eq. 4.22c and two signs of γ in eq. 4.18 without pairing them. For each sign of γ, exactly one root gives a positive slider distance b. The tool takes that root, so choosing the circuit decides the solution.

## Verification (on top of 4bfca69)

- `node scripts/tools/input-guides.mjs check --file norton3`: 3 tools, 24 inputs, 0 problems.
- Calculator tests: 1,193/1,193, including three new tests.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,472/1,472
  - post-build checks: 4,411 pages verified
- `npm run knowledge:check`: valid (935 published links). `npm run seo:validate`: passed. Inventory: 1,052 tools, 9,097 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1,052/1,052 tools passed with 9,097 figures.
- The cam and force balance tools were also run in the browser:
  - The modified sine gives peak factors of 1.760, 5.528 and 69.47.
  - The force balance puts the rocker counterweight at 210°, opposite the coupler CG at 30°, as eq. 12.8d requires.
- **Fix during the draft:** the first browser check showed rounding noise (about 10⁻¹³) as the cam acceleration at mid-rise. Values below 10⁻⁹ of the segment peak are now shown as 0. The calculator tests, verify and sweep were re-run after the change.
