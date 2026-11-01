# WORKOS release: batch handbook96, 1 November 2026

Four tools from the deep audit of the Machinery’s Handbook cam design pages and the torque–tension pages for fasteners, taking WORKOS from 1002 to 1006 tools (MAKEOS handbook tools 808 → 812). Requested by the owner ("next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (all four tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Friction coefficients, the dynamic factor on cam inertia forces, pressure angle and acceleration limits, loads and yield stresses are always user inputs.

## Deep audit

The audit script listed these pages as formula-heavy but cited only within wide ranges:

- **Cams (pp. 2285–2305):** cited only as a 26-page range by the four cam tools. `cam-motion`, `cam-follower-design`, `cam-pressure-angle` and `cam-return-spring-check` cover the standard motion laws, the pressure angle from a given base circle, contact force and the return spring. None follows these handbook procedures:
  - parabolic matching of a constant-velocity displacement diagram, with its displacement table
  - the smallest cam for a specified maximum pressure angle (formulas 6c to 9d) and the radius of curvature of the pitch curve with the undercut check (formulas 10 to 13)
  - the normal force with friction in the follower guide (19a), the cam torque (20) and the acceleration added by a surface error (21)
- **Torque and tension in fasteners (pp. 1529–1531):** cited within ranges by the bolted joint tools, which all take the nut factor K as an input. None works K out from the thread and bearing-face friction by the JIS relation, or gives the yield clamping force of equation (17).

Also examined and not built:

- **Shafts (pp. 299–302):** the ASA B17c formulas with Km, Kt and the hollow-shaft factor B are in `shaft-diameter`, `shaft-brittle-hollow` and `hollow-shaft-conversion`.
- **Sample stress calculations (pp. 217–218):** worked examples of simple stresses and stress concentration with notch sensitivity, all covered by the stress tools and `fatigue-notch-factor`.

`MH_DEEP_AUDIT.md` in the generator folder records these pages.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Modified Constant-Velocity Cam with Parabolic Matching](https://kevos.com/tools/modified-constant-velocity-cam/) | Mechanics | β1 = 2 y1 β2 ÷ y2; β3 = 2 y3 β2 ÷ y2; y = y1 (θ ÷ β1)², y1 + y2 (θ − β1) ÷ β2, (y1 + y2 + y3) − y3 ((βt − θ) ÷ β3)²; velocity y2 ω ÷ β2; accelerations 2 y1 ω² ÷ β1² and 2 y3 ω² ÷ β3² | none |
| [Cam Size for a Maximum Pressure Angle and Radius of Curvature](https://kevos.com/tools/cam-size-and-curvature/) | Mechanics | tan φ = r′ ÷ r; Rmin = 180 h ÷ (π β tan φmax) (uniform), 360 h ÷ (π β tan φmax) − h ÷ 2 (parabolic), by trial for simple harmonic and cycloidal motion; ρ = (r² + r′²)^1.5 ÷ (r² + 2 r′² − r r″); undercut when ρ ≤ rf; concave radius against the cutter | none |
| [Cam Follower Force Analysis](https://kevos.com/tools/cam-follower-force-analysis/) | Mechanics | a = h y″ ω² ÷ β²; m = mf + ms ÷ 3 + me; Fs = k R − mf g − Fe − Ff; Ks = (Fs − preload) ÷ ya; P = m a + (y Ks + preload) + mf g + Fe; Fn = P ÷ [cos φ − μ sin φ (2 l1 + l2 − μ d) ÷ l2]; To = (Rmin + y) Fn sin φ; Δa = 2 e (6 N ÷ ε)² | none (one rejected pairing) |
| [Bolt Torque Coefficient and Yield Clamping Force](https://kevos.com/tools/bolt-torque-coefficient-yield/) | Fasteners | As = (π ÷ 4)((d2 + d3) ÷ 2)²; tan α′ = tan α cos β; Dw = (2 ÷ 3)(Do³ − Di³) ÷ (Do² − Di²); K = (P ÷ π + μs d2 sec α′ + μw Dw) ÷ 2d; Ffy = σy As ÷ √(1 + 3 [(2 ÷ dA)(P ÷ π + μs d2 sec α′)]²); Tfy = K Ffy d | Bolted joints by the numbers: torque and the nut factor; designing for separation, proof and scatter |

All four tools take millimetres, kilograms, newtons and megapascals; the tests check them against the handbook’s inch examples.

Knowledge connections: 2 approved and 2 rejected relationships (`docs/knowledge-links-review.md`). The rejected pairs are the bolt tool with the stretch and angle chapter (it moves away from torque and friction) and the cam force tool with the spring surge chapter (the tool does not check surge). No READOS chapter covers cam design, so the three cam tools have no approved connection yet.

## Handbook values reproduced by the tests

- **Parabolic matching (rises of 1/4, 1 1/4 and 1/2 in, 50° for the constant velocity):** β1 = 20°, β3 = 40°, rise angle 110°; Table 1 displacements 0.016, 0.141, 0.750, 1.617, 1.719, 1.805, 1.930, 1.992 and 2.000 in.
- **Cam size (cycloidal, h = 1 in, β = 100°, φmax = 30°):** the largest pressure angle occurs at p = 44.94°; at that point the radius is 1.935 in and Rmin = 1.535 in (see the notes). Formulas (6c) and (7c) are reproduced for uniform velocity and parabolic motion.
- **Radius of curvature (h = 1 in, Rmin = 2.9 in, β = 60°):** 1.8 in for simple harmonic motion and 1.6 in for cycloidal motion, near θ = 0.75 β.
- **Force analysis (cycloidal, h = 1 in, β = 100°, 900 rpm, 2 lb follower, 10 lb external force, 36 lb preload):**
  - greatest deceleration −18,300 in/s² at θ = 75°; inertia force 95 lb; spring force 88 lb; ya = 0.909 in; spring rate 57 lb/in
  - at θ = 45°: acceleration 5660 in/s², rise 0.40 in, normal force 110 lb (with the handbook’s load), cam torque by formula (20), radius of curvature 2.26 in
  - a 0.001 in bump over 1° adds 58,320 in/s²
- **Yield clamping force (M10 × 1.5, class 8.8, σy = 640 MPa, μs = μw = 0.12):** As = 57.99 mm², d2 = 9.026 mm, β = 2.73°, α′ = 29.97°, Ffy = 30,463 N, and with the table’s K = 0.164 the torque to yield is 49.9 N·m. The tool’s own K for an M10 with a 16.15 mm bearing face and an 11 mm hole is 0.169.

## Notes on the source

- **Cycloidal cam size:** the example prints Rmax = 1.96 in and Rmin = 1.560 in, but formula (9c) gives 1.935 in at p = 44.94°, and the 30° limit is then met with Rmin = 1.535 in. The tool solves the pressure angle condition directly and agrees with 1.935 and 1.535.
- **Parabolic radius of curvature:** the example gives 2.02 in, the value at θ = β. On the decelerating curve at θ = β ÷ 2, formula (10) gives 1.90 in, which is smaller; the tool reports the smallest value along the rise.
- **Normal force example:** the worked value of 110 lb uses a load P that leaves out the 10 lb external force although formula (19b) includes it; with it the normal force is about 121 lb, which the tool gives.
- **Lead angle of the bolt thread:** the text writes tan β = l ÷ 2r, but its numbers (0.0477 for an M10 × 1.5) use l ÷ 2πr, which the tool follows.
- **Dynamic factor:** the handbook says the calculated inertia force should be multiplied by at least 2 for parabolic and 1.05 for cycloidal motion; the factor is an input.

## Verification (on top of 1b644a2)

The batch was drafted on 4a46953 and rebuilt on 1b644a2 after batch handbook95 was published, which moved the counts from 998 → 1002 to 1002 → 1006. The tool files and test changes are otherwise identical to the draft.

- `node scripts/tools/input-guides.mjs check --file handbook96`: 4 tools, 42 inputs, 0 problems.
- Calculator tests: 1,149/1,149 (one tolerance in the new bolt test was widened: the handbook truncates 49.96 N·m to 49.9).
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,297/1,297
  - post-build checks: 4,233 pages verified
- `npm run knowledge:check`: valid (897 relationships). `npm run seo:validate`: passed. Inventory: 1006 tools, 8,733 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1006/1006 tools passed with 8,733 figures.
- The cam size tool was also run in the browser, where it reports the cam as undercut when the roller radius is raised to 40 mm.
