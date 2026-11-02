# WORKOS release: batch norton1, 3 November 2026

Five planar linkage tools from a new source, taking WORKOS from 1040 to 1045 tools. Requested by the owner, who chose Norton for linkages when the Machinery’s Handbook audit was exhausted ("Norton, linkages"). No shared tool code, layout, navigation, READOS content or existing tool was changed. The batch is not a Machinery’s Handbook batch, so it is not counted among the handbook tools.

Approved for publication by the owner on 3 November 2026 (all five tools).

Source: Robert L. Norton, *Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines*, 2nd edition (McGraw-Hill, 1999), cited by topic and page only. No tables, figures, examples or text are reproduced. The source is a scanned PDF with no text layer on many pages, so every equation used was read from the page images.

The tools build in Norton’s equations. These are always user inputs:
- link lengths and offsets
- input angles, angular velocities and angular accelerations
- joint counts
- the time ratio wanted

## Coverage before this batch

WORKOS had no tool for:
- the Grashof condition or fourbar classification
- the transmission and toggle angles
- the quick-return time ratio
- fourbar position, velocity and acceleration
- Gruebler mobility

One existing tool mentions a slider-crank in its description, but none gives the slider-crank kinematics.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Linkage Degree of Freedom (Gruebler and Kutzbach)](https://kevos.com/tools/linkage-mobility/) | M = 3(L − 1) − 2J1 − J2 (eq. 2.1c); spatial M = 6(L − 1) − 5J1 − 4J2 − 3J3 − 2J4 − J5 (eq. 2.2); mechanism, structure or preloaded structure | none |
| [Fourbar Linkage Grashof Condition, Type, Transmission and Toggle Angles](https://kevos.com/tools/fourbar-grashof-check/) | S + L against P + Q (eq. 2.8), Class I, II or III and the motion of the inversion; extreme transmission angles (eq. 4.29); non-Grashof toggle angles (eq. 4.33) and the transmission angle with input and coupler in line (eq. 4.30) | Louvres and ventilators: movable louvres (one rejected pairing) |
| [Fourbar Crank-Rocker Quick-Return Time Ratio](https://kevos.com/tools/fourbar-time-ratio/) | TR = α ÷ β, α + β = 360°, δ = \|180° − α\| (eqs. 3.1, 3.2); toggle positions of a given crank-rocker by the cosine law in the extended and overlapped positions; rocker swing | none |
| [Fourbar Linkage Position, Velocity and Acceleration (Analytical)](https://kevos.com/tools/fourbar-kinematics/) | Freudenstein constants and θ4 (eqs. 4.8, 4.10), θ3 from the loop (eqs. 4.6c, 4.6d), ω3 and ω4 (eq. 6.18), α3 and α4 (eq. 7.12), transmission angle (eq. 4.28), coupler point position (eq. 4.27) and velocity | none |
| [Offset Slider-Crank Position, Velocity and Acceleration (Analytical)](https://kevos.com/tools/slider-crank-kinematics/) | θ3 and d (eqs. 4.16, 4.17), ω3 and ḋ (eq. 6.22), α3 and d̈ (eqs. 7.16d, 7.16e) | Power presses: the crank press force curve |

All five tools are in Mechanics. Lengths are in millimetres, angles in degrees, and angular rates in rad/s and rad/s².

Knowledge connections: 2 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the Grashof tool with the fixtures chapter on clamping force, which treats toggle clamps as bought-in devices.

## Values reproduced by the tests

Norton gives no numeric worked examples for these analytical solutions; his examples are graphical. The tests therefore check the equations against his figures and against identities:
- **Mobility:**
  - Fig. 2-6a, 8 links and 10 joints: one DOF
  - Fig. 2-6b, 6 links with 7 full joints and 1 half joint: zero DOF
  - Fig. 2-7: a mechanism, a structure and a preloaded structure
- **Time ratio:** Example 3-9’s ratio of 1:1.25 gives α = 160°, β = 200° and δ = 20°.
- **Grashof:**
  - each class and inversion
  - the extreme transmission angles of eq. 4.29 equal the transmission angle of the position solution at θ2 = 0° and 180°
  - the eq. 4.33 toggle angle is where the position solution stops assembling: it assembles 0.01° inside the toggle angle and not 0.01° beyond it
- **Crank-rocker rocker swing:** equals the range of θ4 over a full crank turn.
- **Fourbar kinematics:**
  - the open and crossed solutions close the vector loop to 10⁻⁹
  - ω3 and ω4 equal finite differences of θ3 and θ4
  - α3 and α4 equal finite differences of ω3 and ω4
  - the coupler point speed equals the finite difference of its position
- **Slider-crank:**
  - the loop closes
  - ḋ, d̈ and ω3 equal finite differences of the positions
  - the in-line top dead centre acceleration is aω²(1 + a/b)

## Notes on the source

- **Slider-crank circuits:** with Norton’s convention that θ3 is measured at the slider pin, his first arcsin solution (eq. 4.16a) puts the slider on the −X side of the crank pivot. The second solution (eq. 4.17) gives the arrangement of his Figure 4-9, with the slider on the +X side. The tool labels the two circuits by the side the slider is on, and the default follows Figure 4-9.
- **Fourbar coupler angle:** θ3 is found from the loop equations (4.6c, 4.6d) once θ4 is known. This always pairs θ3 with the same circuit as θ4, and agrees with Norton’s separate quadratic for θ3 (eq. 4.13).

## Verification (on top of 10549c9)

- `node scripts/tools/input-guides.mjs check --file norton1`: 5 tools, 34 inputs, 0 problems.
- Calculator tests: 1,186/1,186, including five new tests.
- **Fixes during the draft:**
  - The build first stopped on the Grashof tool, whose optional angles were NaN for linkages they do not apply to. They are now reported as 0.
  - The first test run failed to load because `-100 ** 2` is not valid JavaScript; it now reads `-(100 ** 2)`.
  - The register script first added norton1 to the Machinery’s Handbook file list, because its handbook section had not been removed. This was found before testing and reverted.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,465/1,465
  - post-build checks: 4,404 pages verified
- `npm run knowledge:check`: valid (929 published links). `npm run seo:validate`: passed. Inventory: 1,045 tools, 9,039 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1,045/1,045 tools passed with 9,039 figures.
- The fourbar tool was also run in the browser with d = 100, a = 40, b = 120 and c = 80 mm, θ2 = 40° and ω2 = 10 rad/s. It gives θ3 = 20.298°, θ4 = 57.325°, ω4 = 2.7992 rad/s and a transmission angle of 37.03°, the values the finite-difference tests confirm.
- **Publishing:** main moved to 10549c9 (two Library books) while the publish gates ran. The batch was rebased onto it, and the knowledge links were rebuilt from main’s file with the batch’s links added again. Every gate was then re-run on the rebased branch.
