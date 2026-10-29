# WORKOS release: batch handbook69, 29 October 2026

Six thermodynamics tools added to WORKOS (MAKEOS collection), taking the directory from 844 to 850 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: Enrico Fermi, *Thermodynamics* (Dover Publications, 1956; an unaltered republication of the 1937 Prentice-Hall edition), cited by page only. The supplied PDF is a scanned copy without a text layer; each cited section was read as page images. No tables, examples or text are reproduced. Further references: NIST Chemistry WebBook (property data the user enters); CRC Handbook of Chemistry and Physics (van der Waals constants the user enters); Hydranautics, *What Is Membrane Performance Normalization?* (net driving pressure and log-mean concentration factor); Bernardi, Pawlikowski and Newman, *A General Energy Balance for Battery Systems*, J. Electrochem. Soc. 132 (1) 5–12 (1985); Çengel and Boles, *Thermodynamics: An Engineering Approach* (exergy). These tools do not cite *Machinery’s Handbook*, so batch handbook69 is registered in `TOOL_FILES` and the test `FILES` list but not in the handbook-only `HB_FILES` list (which stays at 729).

| Tool | Category | Method (Fermi pages) | READOS connections |
|---|---|---|---|
| [Vapour Pressure and Boiling Check](https://kevos.com/tools/vapour-pressure-boiling-check/) | Hydraulics | Integrated Clausius–Clapeyron from one known point (pp. 63–68) | Vacuum; Real Gases; Process Chillers; Condensation Control; Centrifugal Pumps |
| [Real Gas Cylinder Contents Check](https://kevos.com/tools/real-gas-cylinder-contents/) | Pneumatics | Van der Waals gas root, compressibility, critical point of the constants (pp. 69–76) | Real Gases (three chapters) |
| [Reverse Osmosis Pressure Check](https://kevos.com/tools/ro-pressure-check/) | Hydraulics | Van ’t Hoff osmotic pressure (pp. 118–122) with the Hydranautics net driving pressure | Clean water as an engineered system |
| [Battery Pack Heat Check](https://kevos.com/tools/battery-heat-check/) | Engineering | Bernardi heat balance; reversible heat from Helmholtz’s cell equation (pp. 94–97) | none yet |
| [Heat Pump and Chiller COP Check](https://kevos.com/tools/heat-pump-cop-check/) | Engineering | Reversed Carnot COP, second-law efficiency (pp. 31–45) | Heat Pumps and Refrigeration; Entropy; Process Chillers |
| [Waste Heat Recovery Limit Check](https://kevos.com/tools/waste-heat-recovery-limit/) | Engineering | Stream exergy from the integrated Carnot efficiency (pp. 44, 48–58) | Entropy (two chapters) |

Knowledge connections: 14 approved and 6 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

## Verification

- Every tool has independent hand-calculated reference values (closed forms, a bisection solution of the van der Waals cubic, Simpson integration of the Carnot efficiency for exergy), identity checks (a = b = 0 gives the ideal gas; heating COP = cooling COP + 1; boiling at the vapour pressure returns the liquid temperature), pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook69`: 6 tools, 56 inputs, 0 problems. Inventory: 850 tools, 7,199 inputs, all covered.
- `npm run verify`: VERIFY_RESULT
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium 130 on the built site): 850/850 tools passed, 7,199 figures, including every tool on a 360 px phone screen.

## Limits stated in the tools

Clausius–Clapeyron takes latent heat as constant and the vapour as ideal, so it is approximate away from the reference point (over 10 % for refrigerants). Van der Waals can be several per cent out at 200 bar and above. Van ’t Hoff’s law is for dilute solutions; the dissociation factor should be fitted to measured data. The battery model is lumped and is a screening aid only. The COP check uses the user’s approach temperatures. The exergy check covers sensible heat only, without condensation.
