# WORKOS release: batch norton4, 3 November 2026

Three tools from Norton’s *Design of Machinery*, taking WORKOS from 1052 to 1055 tools. Requested by the owner ("Next Norton set"). No shared tool code, layout, navigation, READOS content or existing tool was changed. The batch is not a Machinery’s Handbook batch, so it is not counted among the handbook tools.

Approved for publication by the owner on 3 November 2026 (all three tools).

Source: Robert L. Norton, *Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines*, 2nd edition (McGraw-Hill, 1999), chapters 4, 5, 6, 7 and 14, cited by topic and page only. No tables, figures, examples or text are reproduced. Every equation was read from the page images. In the PDF, chapter 14 appears twice; the printed page numbers are cited.

The tools build in Norton’s equations only. These are always user inputs:
- link lengths, gear ratio and phase angle
- crank phase angles, vee angle and throw spacing
- reciprocating mass, crank radius, rod length and speed
- the precision-point moves and coupler rotations, and the free choices of the synthesis

## Coverage before this batch

- `inline-engine-balance` (norton2) covers inline engines only; its limitations note that vee engines need the bank angle and are not covered.
- `fourbar-kinematics` (norton1) covers the fourbar. No tool covered a geared fivebar or any linkage with more than four bars.
- No tool synthesised a linkage. `fourbar-grashof-check` and `fourbar-time-ratio` (norton1) classify a fourbar that is already designed.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Vee Engine Shaking Force, Shaking Moment and Inertia Torque](https://kevos.com/tools/vee-engine-balance/) | θ = ωt − φi (eq. 14.10a); bank forces at θ ± γ (eq. 14.10d); Fx = (FL + FR) cos γ, Fy = (FL − FR) sin γ (eq. 14.10j); moments (eqs. 14.11); inertia torque (eqs. 14.12); followed over one revolution at 1,440 crank angles, with balanced, constant-magnitude rotating or varying reported for each harmonic | Vibration monitoring: unbalance and balancing |
| [Geared Fivebar Linkage Position, Velocity and Acceleration](https://kevos.com/tools/geared-fivebar-kinematics/) | θ5 = λθ2 + φ (eq. 4.23c); θ4 by the half-angle solution (eq. 4.24h); θ3 from the loop (eqs. 4.24e, f); ω3 and ω4 from the velocity equations (eqs. 6.32, 6.33); α3 and α4 (eqs. 7.29a, b); transmission angle, coupler point, and whether it assembles through a crank turn | none (one rejected pairing) |
| [Fourbar Three-Position Motion Synthesis](https://kevos.com/tools/fourbar-three-position-synthesis/) | the two dyads by the 4 × 4 linear systems of eqs. 5.24–5.27 and 5.30–5.31; V = Z − S and G = W + V − U (eqs. 5.2); fixed pivots from the first precision point; circuit at each position by comparison with the open and crossed fourbar solutions (eq. 4.10); transmission angle and Grashof class | none (one rejected pairing) |

All three tools are in Mechanics.

Knowledge connections: 1 approved and 2 rejected relationships (`docs/knowledge-links-review.md`). The rejected pairs are the geared fivebar with the louvre linkage chapter, which uses a parallel crank and link bar with no gears, and the synthesis tool with the clamping force chapter.

## Values reproduced by the tests

- **Example 5-2 (three-position synthesis, in inches):**
  - W = (0.055, 6.832), Z = (1.179, 0.940), U = (−2.628, −1.825), S = (−0.109, 1.487)
  - V = (1.288, −0.547), G = (3.971, 8.110)
  - O2 = (−1.234, −7.772), O4 = (2.737, 0.338)
  - links 9.03, 6.83, 1.40 and 3.20, crossed circuit, coupler point 1.51 from A (Table 5-1)
- **Synthesis identities**, for Example 5-2 and for a second set of free choices:
  - `fourbar-kinematics` with the synthesised links gives the tool’s rocker angle at each position
  - its coupler point passes through all three precision points to 10⁻⁶
- **Vee engine:**
  - a cross-plane 90° V8 (0, 90, 270, 180°) has zero primary and secondary forces and zero secondary moment, with a primary moment of constant magnitude √10 × spacing
  - a 90° V-twin has a primary force of constant magnitude mB rω² and a secondary peak of √2 (r/l) mB rω²
  - at a 0° vee the primary and secondary forces and the primary moment are twice the inline sums from `inline-engine-balance`
  - the inertia torque of one throw equals the two-bank sum of eq. 14.12
- **Geared fivebar:**
  - for both roots the loop closes (eqs. 4.24c, d) to 10⁻⁹
  - ω3, ω4, α3 and α4 equal finite differences of the positions and rates
  - α5 = λα2
  - with λ = 0 and link 5 held on the X axis, θ3, θ4, ω3, ω4, α3 and α4 equal those from `fourbar-kinematics`

## Notes on the source

- **Table 5-1 coupler point:** the table gives the coupler point as 1.51 at 61.31°. From the vectors of Example 5-2 (Z at 38.56°, V at −23.01°) the angle from line AB is 61.57°, which is what the tool reports. The distance 1.51 agrees.
- **Table 5-1 crank angles:** the table lists program start and final crank angles of 29° and 11°, and a step of −9°. These do not follow from the synthesised vectors: measured from the ground line, the crank is at 25.6°, 7.9° and 350.4° in the three positions. The tests do not use these table entries.
- **Gear ratio sign:** Norton defines λ as the ratio of the gear diameters (eq. 4.23c). For external gears link 5 turns opposite to link 2, so the tool asks for λ with its sign: negative for external gears.
- **Fivebar roots:** Norton gives the ± of eq. 4.24h without naming the circuits. The tool labels them by the sign taken.

## Verification (on top of f0a2e1f)

- `node scripts/tools/input-guides.mjs check --file norton4`: 3 tools, 37 inputs, 0 problems.
- Calculator tests: 1,196/1,196, including three new tests.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,475/1,475
  - post-build checks: 4,436 pages verified
- `npm run knowledge:check`: valid (952 published links). `npm run seo:validate`: passed. Inventory: 1,055 tools, 9,134 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1,055/1,055 tools passed with 9,134 figures.
- The synthesis and vee engine tools were also run in the browser:
  - With the default inputs, the synthesis gives the Example 5-2 linkage in millimetres, crossed at all three positions, with its position table.
  - A 90° V-twin gives a constant primary of 1 × mB rω² turning with the crank and a secondary peak of 0.4041 (√2 × r/l). The console shows no errors.
- **Fix during the draft:** the first calculator test run failed the tier-wording test on the label "Free choice" in four synthesis inputs. They now read "Chosen input link rotation" and "Chosen output link rotation", and every gate was run again after the change.
