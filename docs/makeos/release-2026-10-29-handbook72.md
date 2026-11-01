# WORKOS release: batch handbook72, 29 October 2026

Seven thermodynamics tools added to WORKOS (MAKEOS collection, Engineering category), taking the directory from 859 to 866 tools. The owner approved these seven by name on 29 October 2026; an eighth tool built in the same batch (a Carnot-limit claim check) was not approved, because it repeated the method of a second-law tool built in another session, and it was removed before release. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: Y. A. Çengel and M. A. Boles, *Thermodynamics: An Engineering Approach*, 5th edition (McGraw-Hill, 2006), cited by chapter and section only. The supplied PDF has no copyright page and one damaged compressed stream; the sections used were readable. No tables, figures, worked examples or text are reproduced. Saturation pressure of water vapour uses the Hyland–Wexler equations (ASHRAE Handbook—Fundamentals, chapter 1), checked against the steam-table values printed in Çengel to within 0.02 % from 0.01 to 100 °C. Standards are named by number and scope only (AS/NZS 5149, AS/NZS 5601, AS 3814, AHRI 410, ISO 5389, ASME PTC 10, ISO 1217). These tools do not cite *Machinery’s Handbook*, so batch handbook72 is in `TOOL_FILES` and the test `FILES` list but not in the handbook-only `HB_FILES` list (which stays at 729). Batch names handbook70 and handbook71 had been claimed by other sessions' unpublished work; handbook72 was the next free name.

| Tool | Method (Çengel and Boles sections) | READOS connections |
|---|---|---|
| [Air-Standard Otto and Diesel Cycle Check](https://kevos.com/tools/otto-diesel-cycle-check/) | Cold-air-standard Otto and Diesel cycles, MEP, peak pressure (9-3 to 9-6) | Engines after steam (engineering history collection) |
| [Gas Turbine (Brayton) Cycle Check with Regenerator](https://kevos.com/tools/brayton-regenerator-check/) | Brayton cycle with component isentropic efficiencies and regenerator effectiveness (7-12, 9-8, 9-9) | Engines after steam (engineering history collection) |
| [Vapour-Compression Refrigeration or Heat Pump Cycle Check](https://kevos.com/tools/vapour-compression-cycle-check/) | Cycle from user-entered refrigerant enthalpies, isentropic compressor, reversed-Carnot comparison (6-12, 11-1 to 11-4) | Process Chillers (two chapters); Heat Pumps and Refrigeration |
| [Moist Air Dew Point and Surface Condensation Check](https://kevos.com/tools/surface-dew-point-check/) | Humidity ratio, enthalpy, dew and frost point, surface margin (14-1 to 14-3) | Condensation Control (two chapters); Roof Lights; Cooling Towers; Psychrometrics for HVAC |
| [Cooling Coil Load with Dehumidification](https://kevos.com/tools/cooling-coil-dehumidification-check/) | Steady-flow mass and energy balance, condensate, sensible heat ratio (14-2, 14-7) | Psychrometrics for HVAC |
| [Hydrocarbon Combustion Air and Flue Gas Check](https://kevos.com/tools/combustion-air-flue-gas-check/) | Complete combustion of CₓHᵧ with excess air, dry flue analysis, water dew point (15-1, 15-2) | Combustion (three chapters) |
| [Gas Compressor or Turbine Isentropic Efficiency from Measured Temperatures](https://kevos.com/tools/compressor-turbine-efficiency-check/) | Isentropic efficiency and ideal-gas entropy change from test readings (7-9, 7-12) | Entropy (two chapters); Compressed-Air Plant |

Knowledge connections: 17 approved and 10 rejected relationships, each with the chapter text and the tool's calculation checked (`docs/knowledge-links-review.md`). One learning pathway: "Check whether a cold surface will sweat" (Condensation Control, water in air → dew point check → cold pipes and insulation).

## Verification

- Every tool has independent hand-calculated reference values (closed forms, and Hyland–Wexler saturation pressures solved by a separate bisection), identity checks (energy-balance efficiency equals the closed-form Otto and Diesel efficiency; heating COP = cooling COP + 1; sensible + latent = total coil load; flue mole fractions sum to one; an isentropic outlet gives 100 % and no entropy change), every verdict, and invalid inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook72`: 7 tools, 56 inputs, 0 problems. Inventory: 866 tools, 7,350 inputs, all covered.
- `npm run verify` (after rebasing on c8b627a): astro check 0 errors and 0 warnings; 1,092/1,092 tests; 3,692 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs` on the built site, unchanged): Playwright could not download its own Chromium on this machine, so the sweep ran on the installed Microsoft Edge (Chromium engine) through a launch preload. 866/866 tools passed, 7,350 figures, including every tool on a 360 px phone screen (`docs/tool-input-guides-browser.json`).

## Limits stated in the tools

The cycle tools use the cold-air standard (constant specific heats, no losses), so real engines and turbines fall well short of them; they are screening aids, not engine or turbine designs. The refrigeration tool relies on the user's enthalpies from one consistent property source and excludes motor, fan and pipe losses. The moist-air tools assume uniform, steady air; the dew point tool accepts air from 0 to 90 °C. The combustion tool assumes complete combustion with dry air and does not predict the acid dew point of sulfur-bearing fuels; it uses 3.76 mol N₂ per mol O₂, so its dew point for methane at 15 % excess air (56.5 °C) is 0.1 K above the Combustion book's 56.4 °C (3.773). The efficiency tool is for adiabatic machines only: oil-injected or cooled compressors cannot be tested by temperature.

## Release and live checks

Released as `610df1c` on `main` (Cloudflare Workers Builds deploys `main`; no manual deploy). Checked on https://kevos.com after the build: all seven `/tools/<id>/` pages return 200 with the input guide and "Learn the Concepts Behind This Tool"; each `/tools/?tool=<id>` calculator opens with a "What this means" guide under every input, the example verdict, checks and the report buttons, with no console errors; each tool is in the WORKOS directory and in `sitemap-0.xml`; `/tools/knowledge.json` lists its readings; the connected READOS chapters checked (Combustion ch. 2, Condensation Control ch. 1, Process Chillers ch. 3, Entropy ch. 9) show the tool under "Apply This in Practice"; on a 375 px phone screen the calculator opens directly without the directory and without sideways scroll.
