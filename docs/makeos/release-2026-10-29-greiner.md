# WORKOS release: batch greiner, 29 October 2026

Seven thermodynamics tools added to WORKOS (MAKEOS collection), taking the directory from 898 to 905 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: Walter Greiner, Ludwig Neise and Horst Stöcker, *Thermodynamics and Statistical Mechanics* (Springer-Verlag, New York, 1995; corrected second printing 1997), cited by printed page and equation only. The supplied PDF is a scanned copy without a text layer; each cited section was read as page images (PDF page = printed page + 10). No tables, examples or text are reproduced. Further references: Peng and Robinson, *A New Two-Constant Equation of State*, Ind. Eng. Chem. Fundam. 15 (1976) 59–64; Poling, Prausnitz and O’Connell, *The Properties of Gases and Liquids*, 5th ed.; NIST Chemistry WebBook and IAPWS-IF97 (property data the user enters or checks against); Timoshenko and Gere, *Mechanics of Materials*; Crowl and Louvar, *Chemical Process Safety*; Çengel and Boles; ASM Handbook Vol. 4A. API 521, AS 4343 and the AS/NZS 3823 series are named by number and scope only. The batch is registered in `TOOL_FILES` and the test `FILES` list but not in the handbook-only `HB_FILES` list.

| Tool | Category | Method (Greiner pages) | READOS connections |
|---|---|---|---|
| [Blocked-In Liquid Thermal Pressure Rise Check](https://kevos.com/tools/blocked-in-liquid-pressure-check/) | Hydraulics | (∂p/∂T)ᵥ = α/κ (pp. 22, 111) with thin-wall pipe volumetric strain | Thermal Expansion; Water Hammer |
| [Gas Cylinder Contents and Duration Check](https://kevos.com/tools/gas-cylinder-real-gas-duration/) | Pneumatics | Van der Waals from the critical point (pp. 17–20, 67–70); Peng–Robinson (default) | Real Gases (three chapters); Industrial Gases |
| [Boiling Point and Vapour Pressure at Operating Pressure](https://kevos.com/tools/boiling-point-at-pressure/) | Engineering | Integrated Clausius–Clapeyron (pp. 64–67) | Real Gases; Vacuum; Process Chillers; Process Steam |
| [Heat Pump, Chiller or Heat Engine Claim Check](https://kevos.com/tools/carnot-limit-check/) | Engineering | Carnot limits and heat pump against electric heating (pp. 52–58) | Entropy (two chapters); Heat Pumps and Refrigeration; Process Chillers |
| [Compressed Gas Stored Energy Check](https://kevos.com/tools/compressed-gas-stored-energy/) | Pneumatics | Free energy as isothermal work (pp. 52–53, 91–95); isentropic and Brode energies | Entropy (two chapters); Compressed Air Plant (two chapters) |
| [Nitrogen or Oxygen Generator Energy Check](https://kevos.com/tools/gas-generator-energy-check/) | Pneumatics | Mixing entropy (p. 132, eq. 5.40) and isothermal reversible work | Industrial Gases |
| [Quench Tank Temperature Check](https://kevos.com/tools/quench-tank-temperature-check/) | Materials | Mixture temperature and entropy generated (Exercise 2.6, pp. 55–56) | Entropy (two chapters); Heating and Cooling Times |

Knowledge connections: 22 approved and 9 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

Overlap with batch handbook69 (published earlier the same day): `boiling-point-at-pressure` uses the same Clausius–Clapeyron method as `vapour-pressure-boiling-check`, and `carnot-limit-check` the same Carnot COP check as `heat-pump-cop-check` (it adds a heat-engine mode and the saving over resistance heating). `gas-cylinder-real-gas-duration` adds Peng–Robinson and running time to the van der Waals contents of `real-gas-cylinder-contents`. Batch handbook71 (Guggenheim) then published `trapped-liquid-pressure-check` and `clausius-boiling-margin-check`, which use the same methods as `blocked-in-liquid-pressure-check` and `boiling-point-at-pressure`, and a `gas-separation-energy-check` with the same method and the id first planned for this batch; this batch’s generator tool is therefore published as `gas-generator-energy-check`. It also overlaps the least separation work in `gas-mixture-properties` (batch bryanthermo). The owner chose to publish all seven.

## Verification

- Every tool has independent hand-calculated reference values (closed forms; Cardano roots of the van der Waals and Peng–Robinson cubics against the tool’s Newton solution; the pure-oxygen limit RT ln(1 ÷ 0.2095) quoted in *Industrial Gases by the Numbers*), pass and fail verdicts, and invalid inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file greiner`: 7 tools, 64 inputs, 0 problems. Inventory: 905 tools, 7,717 inputs, all covered.
- `npm run verify` on origin/main 5643416 plus this batch: astro check 0 errors; 1,152/1,152 tests; 3,731 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): run again on the published commit (see the follow-up docs commit); before publication it passed 894/894 tools, every one also on a 360 px phone screen, on b638cd1 plus this batch.

## Limits stated in the tools

The blocked-in check assumes a completely liquid-full section and constant β and K; a gas pocket lowers the real rise sharply. Cubic equations of state are approximate near the critical point and for hydrogen and helium; liquefied gases are refused. Clausius–Clapeyron takes latent heat as constant (about 1 K low for water at 20 kPa from 100 °C). The Carnot check is an upper bound at the temperatures entered. Stored energies are for an ideal gas, and burst energies are upper bounds. Gas separation treats air as an oxygen–nitrogen mixture with argon counted as nitrogen. The quench balance ignores losses and evaporation. Safety-related results are screening aids; qualified review governs real work.
