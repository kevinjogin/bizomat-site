# WORKOS release: batch handbook86, 31 October 2026

Six tools from Machinery’s Handbook pages that the page ledger listed as open or as candidates, taking WORKOS from 965 to 971 tools (MAKEOS handbook tools 771 → 777). Requested by the owner ("Continue to keep making tools from the book and keep record of all pages scanned and completed"; "Start handbook86"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (all six tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Densities, ball grade tolerances, ball gauges, container marking increments and the factor of energy excess are always user inputs.

## Page ledger

| Pages | Before this batch | After |
|---|---|---|
| Cited by a live tool | 2,013 | 2,013 (2,026 once this batch is live) |
| Cited by a draft tool (handbook79 and handbook86) | 19 | 32 |
| Read by hand: tool possible, not yet built | 4 | 6 |
| Read by hand: nothing to build | 58 | 84 |
| No formula lines (tables, prose, figures) | 1,107 | 1,104 |
| Formula lines, not yet read | 116 | 78 |

Read in this batch and recorded without a tool:

- **Sintered bearing loads (p. 2363):** the over-200 fpm rule P = 50,000 ÷ V is a PV limit of 50,000 psi·fpm, which `journal-bearing-pv` already takes as an input.
- **Wrought-iron crane chain (p. 3440):** W = 54,000 D² is an empirical rule for an obsolete chain material. Lifting chain is rated by its maker’s working load limit, so a breaking-load tool would mislead.
- **Data and definitions:**
  - module tooth dimensions (p. 2218)
  - lead of helix tables (pp. 2073–2075)
  - tap chamfer lengths and NPSF tap constants (pp. 920, 931, 939)
  - socket screw designations (p. 1694)
  - lag screw tables (pp. 1543–1544)
  - forming process descriptions (pp. 1366, 1369)
  - nine more pages of tables and prose (pp. 492–493, 557–558, 1376, 1380, 1566, 1573, 1976, 2055, 3258)

New candidates:

- **Silent chain sprocket diameter tolerances (pp. 3463–3464):** 0.004 + 0.001 P √N. They would suit a sprocket inspection tool; the existing `silent-chain-sprocket` tool is not changed.
- **Fuel oil heating value (p. 3012):** 18,650 + 40 (Baumé − 10) BTU/lb, but the Baumé scale is not given on that page.

Still a candidate: planetary gear Figs. 1–24 (pp. 2212–2214).

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Spherical Sections: Areas and Volumes](https://kevos.com/tools/sphere-sections/) | Geometry | Sphere 4πR², (4/3)πR³; wall G; sector K 2πR²(1 − cos ½φ), 2πR²F ÷ 3; segment S π(F² + E²/4), πF(E²/8 + F²/6); zone T radius √(((P² − Q² − 4H²) ÷ 8H)² + P²/4), 2πRH, H(π/6)(H² + 3Q²/4 + 3P²/4); hollow sector U (2π/3)(R₁³ − R₂³)(1 − cos ½φ); ring W 4π²R₁R₂, 2π²R₁R₂²; part ring Z × φ ÷ 360 | Tanks and hoppers by the numbers: cones, pyramids and frustums; Hand forming sheet metal by the numbers: sizing the blank for a dome |
| [Conic Section from Its General Equation](https://kevos.com/tools/conic-section-equation/) | Mathematics | Ax² + Cy² + Dx + Ey + F = 0 by completing squares: parabola (y − k)² = 4p(x − h) or (x − h)² = 4p(y − k) with focus, directrix and latus rectum; ellipse or circle; hyperbola with c² = a² + b², e = c ÷ a and asymptotes | — |
| [Four-Arc Oval Approximating an Ellipse](https://kevos.com/tools/four-arc-oval/) | Geometry | r = (B² ÷ 2A)(A ÷ B)^0.38; X = (A²/4 − Ar + Br − B²/4) ÷ (B − 2r); R = B/2 + X; arc centres, angles, tangent points, perimeter and area against πAB ÷ 4 | Oval sheet metal work by the numbers: constructing a four-centre oval |
| [Locating Three Holes by the Disk Method](https://kevos.com/tools/hole-location-disks/) | Manufacturing | r_A = (x − y + z) ÷ 2, r_B = x − r_A, r_C = y − r_B; triangle angles and the position of hole C | — |
| [Standard Metal Ball Lot Check](https://kevos.com/tools/metal-ball-lot-check/) | Quality | DwmL and VDwL from the largest and smallest balls; acceptance about Dw + ball gauge within the limits entered; specific diameter = DwmL rounded to the marking increment − Dw; balls per kilogram 1 ÷ (π/6 Dw³ ρ) (handbook 1,910,000 ÷ D³ρ) | — |
| [Engine Flywheel Rim Weight and Arm Proportions](https://kevos.com/tools/engine-flywheel-rim-and-arms/) | Power Transmission | m = n E ÷ v², E = c × work per revolution (the handbook’s W = 387,587,500 c n HP ÷ D²N³ and 11,745 n E ÷ D²N² in consistent units); rim section m ÷ (ρπD); arm width 1.3 D (6 arms) or 1.2 D (8 arms), thickness half, rim area at least two-thirds of the hub area | — |

Knowledge connections: 3 approved and 3 rejected relationships, each with the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`). Rejected pairs:

- **Power presses: flywheel energy and slowdown** with the engine flywheel tool: that chapter covers a press flywheel’s energy and slowdown per stroke, not engine energy-excess factors or arms.
- **Marking out: large arcs, ellipses and curves by points** with the conic tool: that chapter marks out ellipses from their axes, not from equations.
- **Marking out: large arcs, ellipses and curves by points** with the four-arc oval: that chapter mentions the four-centre oval in one sentence and refers to the oval book.

The oval book’s running case (1800 × 900 mm, end radius 300 mm) gives the same side radius, 1575 mm, in the four-arc oval tool with the end radius entered.

## Handbook values reproduced by the tests

- **Spherical sections, Examples 7–11:**
  - wall G: 3220.13 cm² and 3992.44 cm³
  - sector K: 414.07 cm²
  - segment S: 392.70 cm² and 850.85 cm³
  - hollow sector U: 8.78 in²
  - ring W: 789.56 in² and 1579.13 in³
- **Spherical zone T:** a zone cut 20 and 60 mm from the centre of a 100 mm sphere returns that radius, area and volume.
- **Parabola example:** 4y² − 8x − 12y + 1 = 0 gives vertex (−1, 3/2) and p = 1/2.
- **Hyperbola example:** 9x² − 4y² − 36x + 8y − 4 = 0 gives h = 2, k = 1, a = 2, b = 3, c = √13 and e = √13 ÷ 2.
- **Disk method example:** 0.930, 0.720 and 0.860 in give disk A 1.070 in diameter, radius B 0.395 in and radius C 0.325 in.
- **Metal ball marking examples:**
  - Inch: 1/4 in, −0.0002 in ball gauge. The lot is accepted from 0.249760 to 0.249850 in, and 0.249823 in measured is marked −0.000180 in.
  - Metric: 6 mm, −4 µm ball gauge. The lot is accepted from 5.99500 to 5.99725 mm, and 5.99627 mm measured is marked −3.75 µm.
  - Balls per kilogram match 1,910,000 ÷ (D³ ρ).
- **Engine flywheel Example 1:** 150 hp, 200 rpm, 2 %, c = 0.209 and a 6 ft rim give 2110 lb nearly.
- **Engine flywheel Example 2:** 158,340 ft·lb per revolution, c = 0.163, 1 %, an 18 ft rim and 75 rpm give 16,650 lb nearly, within 40 lb because 11,745 uses g = 32.2 ft/s².
- **Four-arc oval:** the area is checked against a numerical integration of the outline.

## Notes on the source

- **Hollow sector U:** the table prints Uv = 2π(R₁³ − R₂³)(1 − cos ½φ), and Example 10 gives 13.06 in³. The sector K formula (2πR²F ÷ 3 with F = R(1 − cos ½φ)) gives (2π/3)(R₁³ − R₂³)(1 − cos ½φ) = 4.35 in³, a third of the printed value. The tool uses (2π/3); the test confirms that the printed value is exactly three times it.
- **Sector K, Example 8:** the example enters a depth F = 5.0 cm with φ = 90° on a 15 cm sphere. Those values do not agree, because the depth for 90° is R(1 − cos 45°) = 4.39 cm. The tool finds F from R and φ, so its volume differs from the printed 2356.19 cm³; the area of 414.07 cm² is reproduced.
- **Hyperbola:** the text says a hyperbola’s eccentricity "is always less than 1". It is always greater than 1, as the handbook’s own example (e = √13 ÷ 2 ≈ 1.80) shows.
- **Four-arc oval:** with equation (1), the oval’s area is about 2.5 % below the ellipse at a 4 : 1 length-to-width ratio. The handbook makes no accuracy claim, and the tool reports the difference.

## Verification (on top of a15012d)

- `node scripts/tools/input-guides.mjs check --file handbook86`: 6 tools, 44 inputs, 0 problems. Inventory: 971 tools, 8,412 inputs, all covered.
- Calculator tests: 1,105/1,105.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,253/1,253
  - post-build checks: 4,064 pages verified
- `npm run knowledge:check`: valid (680 relationships). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 971/971 tools passed with 8,412 figures. The four-arc oval tool was also opened and run in the browser.
