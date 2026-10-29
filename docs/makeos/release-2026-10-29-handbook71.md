# WORKOS release: batch handbook71, 29 October 2026

Seven thermodynamics tools added to WORKOS (MAKEOS collection), taking the directory from 867 to 874 tools. Approved for publication by the owner on 29 October 2026 (all seven). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: E. A. Guggenheim, *Thermodynamics: An Advanced Treatment for Chemists and Physicists*, 5th revised edition (North-Holland, 1967; © Elsevier Science Publishers), cited by section only. The supplied PDF is a scanned copy without a text layer; the contents and each method’s pages were read as page images. No tables, examples or text are reproduced. Properties, ratings and limits are entered by the user. The batch is named `handbook71` because handbook69 and handbook70 were taken by concurrent sessions. It is registered in `TOOL_FILES` and the test `FILES` list but not in the handbook-only `HB_FILES` list (which stays at 729).

| Tool | Category | Method (Guggenheim) | READOS connections |
|---|---|---|---|
| [Trapped Liquid Thermal Pressure Check](https://kevos.com/tools/trapped-liquid-pressure-check/) | Hydraulics | (∂p/∂T)_V = α ÷ κ (§1.46), with thin-walled closed-end pipe stretch and growth | Water Hammer (wave speed in a pipe); Machine Elements (pressure vessels and thin-walled cylinders), both related |
| [Reverse Osmosis Concentrate-End Check](https://kevos.com/tools/ro-concentrate-pressure-check/) | Engineering | Π = φ ν c R T with the osmotic coefficient (§5.10, §5.16, §5.28, §7.06–7.08); solute balance to the concentrate end | none |
| [pH Electrode Two-Buffer Calibration Check](https://kevos.com/tools/ph-electrode-calibration-check/) | Quality | Nernst slope ln 10 × RT/F (ch. 8) with exact SI R and F; IUPAC 2002 pH recommendations | none |
| [Boiling Margin Check](https://kevos.com/tools/clausius-boiling-margin-check/) | Engineering | Integrated Clausius–Clapeyron (§3.37–3.39), keep-liquid or make-it-boil margin | Real Gases (liquefied gases), Vacuum (vapour and outgassing), Centrifugal Pumps (NPSH) |
| [Gas Throttling Temperature Check](https://kevos.com/tools/gas-throttling-temperature-check/) | Pneumatics | μ = (T dB/dT − B) ÷ Cp with the van der Waals B, integrated exactly, or a known coefficient (§3.11, §3.20–3.22) | Real Gases (Joule–Thomson at the regulator); Entropy (throttling, mixing and friction) |
| [Filter Membrane Bubble Point Check](https://kevos.com/tools/filter-bubble-point-check/) | Quality | Young–Laplace Δp = 4 k γ ÷ d (§1.60–1.61); ASTM F316 named by scope | none |
| [Gas Separation Energy Check](https://kevos.com/tools/gas-separation-energy-check/) | Pneumatics | Least separation work from the ideal Gibbs energy of mixing RT Σ x ln x (§4.18–4.20) | Entropy (what entropy counts; lost work and exergy) |

Knowledge connections: 9 approved and 6 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

Scope as approved: after the owner’s approval, batch handbook69 published `vapour-pressure-boiling-check` (the id first used here) and `ro-pressure-check` with similar methods. The owner chose to publish both of this batch’s tools under new ids and distinct names: `clausius-boiling-margin-check` and `ro-concentrate-pressure-check`.

## Verification

- Independent hand-calculated reference values (separate node scripts; the throttling case by fourth-order Runge–Kutta integration of dT/dp): water shut in at 5 bar g in DN50 steel pipe rises 3.2991 bar/K; 35 g/L NaCl at 25 °C has 27.318 bar osmotic pressure and 49.557 bar at the concentrate end at 45 % recovery; the ideal pH slope at 25 °C is 59.159 mV; water boils at 68.29 °C under 30 kPa from its 100 °C point; methane throttled 70 → 7 bar abs from 15 °C leaves at −13.048 °C; 99 % nitrogen from air at an air factor of 3 needs at least 603.66 J/mol. Limiting cases, pass and fail verdicts, and out-of-range or contradictory inputs that return CHECK INPUTS are tested.
- `node scripts/tools/input-guides.mjs check --file handbook71`: 7 tools, 64 inputs, 0 problems. Inventory: 874 tools, 7,420 inputs, all covered.
- `npm run verify` (on 7b5ce4b): astro check 0 errors; 1,108/1,108 tests; 3,700 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed (3,700 pages, 2,944 indexable, all in the sitemap).
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright 1.64.1 headless Chromium on the built site): 874/874 tools passed, 7,420 figures, including every tool on a 360 px phone screen.

## Limits stated in the tools

The trapped-liquid, gas-throttling and bubble-point tools state that they are screening aids and that qualified review (AS 4041 for pressure piping, gas codes for pressure reduction stations, the filter maker’s method for regulated filtration) governs real work. The gas-throttling guide repeats Guggenheim’s caution that no two-constant formula fits the second virial coefficient quantitatively.
