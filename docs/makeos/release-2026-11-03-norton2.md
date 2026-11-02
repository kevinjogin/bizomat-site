# WORKOS release: batch norton2, 3 November 2026

Four engine dynamics tools from Norton’s *Design of Machinery*, taking WORKOS from 1045 to 1049 tools. Requested by the owner ("Next Norton set"). No shared tool code, layout, navigation, READOS content or existing tool was changed. The batch is not a Machinery’s Handbook batch, so it is not counted among the handbook tools.

Approved for publication by the owner on 3 November 2026 (all four tools).

Source: Robert L. Norton, *Design of Machinery: An Introduction to the Synthesis and Analysis of Mechanisms and Machines*, 2nd edition (McGraw-Hill, 1999), chapters 13 and 14, cited by topic and page only. No tables, figures, examples or text are reproduced. Every equation was read from the page images, because these pages have no text layer. In the PDF, chapter 14 appears twice and chapter 11 pages are bound inside it; the printed page numbers are cited.

The tools build in Norton’s equations. These are always user inputs:
- crank radius, rod length and bore
- speed and crank angle
- gas pressure
- link masses, centre of gravity distances and moment of inertia
- crank phase angles and cylinder spacing

## Coverage before this batch

WORKOS had no tool for:
- piston motion
- gas torque
- engine shaking forces or inertia torque
- multicylinder engine balance

The existing balancing tools (`rotating-balance-plane`, `two-plane-balance`, `rotor-balancing-check`, `balance-grade`) cover rotating unbalance only. `engine-flywheel-rim-and-arms` sizes a flywheel rim, and `flywheel-rim-design` covers the general flywheel.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Engine Piston Position, Velocity and Acceleration](https://kevos.com/tools/engine-piston-motion/) | exact x, ẋ, ẍ (eqs. 13.1d–f); Fourier approximations (eqs. 13.3c–e); peak at TDC rω²(1 + r/l) | Power presses: the crank press force curve |
| [Engine Gas Force and Gas Torque at a Crank Angle](https://kevos.com/tools/engine-gas-torque/) | Fg = Pg πB²/4 (eq. 13.4); side force Fg tan φ (eq. 13.5a); exact Tg = Fg tan φ x (eq. 13.6d); approximate Tg ≈ Fg r sin ωt (1 + r/l cos ωt) (eq. 13.8b) | Inertia and flywheels: flywheels and speed fluctuation |
| [Engine Lumped Masses, Shaking Force and Inertia Torque](https://kevos.com/tools/engine-inertia-forces/) | m3a and m3b (eq. 13.10); centre of percussion (eq. 13.9e); m2a (eq. 13.11); mA and mB (eq. 13.12); shaking force (eq. 13.14); inertia torque (eq. 13.15e) | Vibrating machine elements: waves, modes and excitations |
| [Inline Multicylinder Engine Balance](https://kevos.com/tools/inline-engine-balance/) | force sums (eq. 14.3), inertia torque sums (eq. 14.5), moment sums (eq. 14.7); unbalanced amplitudes from eqs. 14.2d and 14.6b; even firing interval (eq. 14.8) | none (one rejected pairing) |

All four tools are in Mechanics. Lengths are in millimetres, masses in kilograms, pressures in MPa, and forces and torques in N and N·m.

Knowledge connections: 3 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the balance tool with the vibration chapter on isolating a fan on springs.

## Values reproduced by the tests

- **Norton’s example engine (Fig. 13-8):** 3.54 in stroke, L/R 3.5, 3,400 rpm.
  - Peak piston acceleration: the formula gives 288,491 in/s², against the plotted 288,228 in/s². That is 747 g, as the text states.
  - Peak velocity: about 656 in/s, against the plotted 653 in/s.
  - The plots come from Norton’s program using the stroke and ratio rounded on the figure, so the tests allow 0.1 % and 0.6 %.
- **Table 14-1 (0, 90, 180, 270° four-cylinder):**
  - every force sum is zero except Σ cos 4φ = 4
  - the inertia torque sums for harmonics 1 to 3 are zero
  - verdict: forces balanced, moments not
- **Table 14-2 (moment sums):** −2, −2; 0, −2; 0, 6; 0, −2.
- **Equation checks:**
  - the exact piston velocity and acceleration equal finite differences of the exact position
  - the two-harmonic acceleration is within 1 % of the peak
  - the approximate gas torque is within 1 % of the exact one
  - the approximate inertia torque is within 6 % of mB ẍ tan φ x from the exact motion (2.5 % in the test case)
  - a mirror-symmetric inline six is fully balanced
  - a single cylinder has primary force mB rω² and secondary force (r/l) mB rω²

## Notes on the source

- **Table 14-2:** the heading states z1 = 1, z2 = 2, z3 = 3, z4 = 4. The printed sums (for example Σ zi cos 4φi = 6) are obtained with z = 0, 1, 2, 3, that is, moments taken about cylinder 1. With z = 1 to 4 the fourth harmonic sum would be 10. The tool takes the distance of cylinder 1 from the reference and the spacing, so either convention can be entered. The test uses z1 = 0 to reproduce the printed table.
- **Shaking force sign:** equation 13.14 gives the inertia force, which Norton sets equal to the shaking force on the frame (eq. 13.14f). The tool reports it with that sign.

## Verification (on top of f7bb20d)

- `node scripts/tools/input-guides.mjs check --file norton2`: 4 tools, 34 inputs, 0 problems.
- Calculator tests: 1,190/1,190, including four new tests.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,469/1,469
  - post-build checks: 4,408 pages verified
- `npm run knowledge:check`: valid (932 published links). `npm run seo:validate`: passed. Inventory: 1,049 tools, 9,073 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1,049/1,049 tools passed with 9,073 figures.
- The balance tool was also run in the browser for Norton’s 0, 90, 180, 270° four-cylinder with z1 = 0 and unit spacing. It shows Table 14-1 and Table 14-2 and reports FORCES BALANCED, MOMENTS NOT.
