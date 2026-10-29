# WORKOS release: batch callen, 29 October 2026

One thermodynamics tool added to WORKOS (MAKEOS collection), taking the directory from 866 to 867 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: Herbert B. Callen, *Thermodynamics and an Introduction to Thermostatistics*, 2nd edition (John Wiley & Sons, 1985), cited by section and page only. The supplied PDF is a scanned copy without a text layer; each cited section was read as page images. No tables, examples, problems or text are reproduced. Property values are entered by the user (NIST Chemistry WebBook named as a public source). The batch is named `callen`, not `handbookNN`, because several concurrent sessions were preparing handbook-numbered batches. It is registered in `TOOL_FILES` and the test `FILES` list but not in the handbook-only `HB_FILES` list (which stays at 729).

| Tool | Category | Method (Callen) | READOS connections |
|---|---|---|---|
| [Liquid Throttling Temperature Rise](https://kevos.com/tools/liquid-throttling-temperature-rise/) | Hydraulics | Constant-enthalpy throttling (eq. 6.37) and the Joule–Thomson relation dT = (v ÷ cp)(T β − 1) dP (eq. 6.41) applied to a liquid, with the expansion coefficient defined in §3.9; pp. 84–86, 160–165 | Real Gases (Joule–Thomson at the regulator); Entropy (throttling, mixing and friction), both as related tools |

Knowledge connections: 2 approved and 2 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

Scope as approved: the owner approved only the liquid tool, reduced to its throttling part if the bryanthermo batch published its liquid adiabatic compression tool first, which it did (`liquid-adiabatic-compression`, f555858). The adiabatic compression, isothermal heat and bulk-modulus outputs were therefore removed. Seven further tools built from the same source (Carnot limit, stream exergy, stream mixing, blocked-in liquid pressure, Clausius–Clapeyron boiling point, reverse osmosis pressure, thermoelectric cooler) were withdrawn before release as duplicates of tools that are live or in progress elsewhere.

## Verification

- Independent hand-calculated reference values: the oil example (40 °C, 870 kg/m³, β 700 × 10⁻⁶/K, cp 1.9 kJ/(kg·K), 300 bar dropped) warms 14.171 K against a simple estimate of 18.149 K (T β = 21.92 %), and water at 20 °C warms 0.225 K per 10 bar. An identity check (β = 0 gives Δp ÷ ρ cp), pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS are tested.
- `node scripts/tools/input-guides.mjs check --file callen`: 1 tool, 6 inputs, 0 problems. Inventory: 867 tools, 7,356 inputs, all covered.
- `npm run verify` (on 610df1c): astro check 0 errors and 0 warnings; 1,094/1,094 tests; 3,693 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright 1.55.1 headless Chromium on the built site): 867/867 tools passed, 7,356 figures, including every tool on a 360 px phone screen.

## Limits stated in the tool

Properties are taken at the inlet and held constant. The rise is for the liquid alone with no heat loss to pipes, tank or cooler. The liquid must stay liquid: if the outlet pressure falls below its vapour pressure it flashes or cavitates and the result does not apply.
