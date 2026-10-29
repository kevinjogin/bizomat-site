# WORKOS release: batch cengel2, 29 October 2026

Six more thermodynamics tools added to WORKOS (MAKEOS collection, Engineering category), taking the directory from 887 to 893 tools. The owner approved all six by name on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: Y. A. Çengel and M. A. Boles, *Thermodynamics: An Engineering Approach*, 5th edition (McGraw-Hill, 2006), cited by chapter and section only; no tables, figures, worked examples or text are reproduced. Moist-air saturation pressure uses the Hyland–Wexler equations (ASHRAE Handbook—Fundamentals, chapter 1), checked against Çengel’s steam-table values to within 0.02 % from 0.01 to 100 °C. The CHP primary energy saving follows the method of Directive 2012/27/EU, Annex II; its reference values are not reproduced and the user enters reference efficiencies. Steam properties in the examples are steam-table values (IAPWS-IF97) used as illustrations: the 10 kPa saturation values and the 100 kPa, 150 °C superheated enthalpy appear in Çengel’s text; the 1 MPa saturation values (762.51 and 2,014.6 kJ/kg) are standard IAPWS-IF97 values entered from reference knowledge. Batch cengel2 is in `TOOL_FILES` and the test `FILES` list but not in the handbook-only `HB_FILES` list.

| Tool | Method (Çengel and Boles sections) | READOS connections |
|---|---|---|
| [Steam Rankine Cycle Check](https://kevos.com/tools/rankine-cycle-check/) | Pump and turbine with isentropic efficiencies, efficiency, heat rate, steam flow, exhaust dryness (10-2 to 10-4) | none (three suggestions rejected) |
| [Wet Steam Dryness by Throttling Calorimeter](https://kevos.com/tools/steam-dryness-throttling-check/) | Constant-enthalpy throttling, dryness fraction, superheat validity (3-5, 5-4) | Process Steam (two chapters) |
| [Cogeneration (CHP) Utilisation and Primary Energy Saving Check](https://kevos.com/tools/cogeneration-saving-check/) | Utilisation factor (10-8); primary energy saving against user reference efficiencies | none (one suggestion rejected) |
| [Adiabatic Mixing of Two Air Streams](https://kevos.com/tools/air-stream-mixing-check/) | Dry-air mass-weighted humidity and enthalpy, mixed state, fog (14-2, 14-7) | Psychrometrics for HVAC |
| [Direct Evaporative Cooler Check](https://kevos.com/tools/evaporative-cooler-check/) | Wet-bulb from the adiabatic saturation balance, pad effectiveness, water use (14-4, 14-7) | Psychrometrics for HVAC; Passive and low-energy cooling; HVAC for commercial and industrial buildings; Cooling Towers |
| [Heating with Humidification](https://kevos.com/tools/heating-humidification-check/) | Heater load and water or steam added (14-7) | Psychrometrics for HVAC |

Knowledge connections: 8 approved and 10 rejected relationships, each with the chapter text and the tool's calculation checked (`docs/knowledge-links-review.md`). One learning pathway: "Measure how wet your steam is" (Process Steam, reading the steam table → dryness check → pressure reduction and distribution).

## Verification

- Every tool has independent hand-calculated reference values (closed forms, and Hyland–Wexler states with a separately coded secant solution of the wet-bulb), identity checks (heat added = net work + heat rejected; an ideal turbine gives the isentropic drop; a 100 % effective cooler reaches the wet-bulb at saturation; one air stream alone keeps its state; separate production at the CHP utilisation factor saves nothing), every verdict, and invalid inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file cengel2`: 6 tools, 51 inputs, 0 problems. Inventory: 893 tools, 7,597 inputs, all covered.
- `npm run verify` (after rebasing on b638cd1): astro check 0 errors and 0 warnings; 1,142/1,142 tests; 3,719 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs` on the built site, unchanged script; run on the installed Microsoft Edge because Playwright could not download its own Chromium on this machine): 893/893 tools passed, 7,597 figures, including every tool on a 360 px phone screen.

## Limits stated in the tools

The Rankine check is a simple cycle without reheat, feed heating, pressure losses or auxiliaries. The throttling calorimeter cannot measure steam wetter than about 0.95 at moderate pressures, and heat loss makes steam look wetter. The CHP check is one steady load point, energy only, and needs one heating-value basis throughout. The air tools assume perfect mixing and steady flow, accept air from 0 to 60 °C (relative humidity over liquid water), and do not cover water treatment or Legionella management of evaporative equipment.

## Release and live checks

Released as `0979441` on `main` (Cloudflare Workers Builds deploys `main`; no manual deploy). Checked on https://kevos.com after the build: all six `/tools/<id>/` pages return 200 with the input guide, and the four with readings show "Learn the Concepts Behind This Tool"; each `/tools/?tool=<id>` calculator opens with a "What this means" guide under every input, the example verdict, checks and the report buttons, with no console errors; each tool is in the WORKOS directory and in `sitemap-0.xml`; `/tools/knowledge.json` lists the readings; Process Steam, reading the steam table, and the Psychrometrics for HVAC collection chapter show the tools under "Apply This in Practice"; on a 375 px phone screen the calculator opens directly without the directory and without sideways scroll.

## Knowledge links re-review (29 October 2026, `ac05fb1`)

At the owner's request the ten rejected READOS pairs were re-read in full. One is now approved: Cooling Towers chapter 2 (moist air and the wet-bulb) links the air-stream mixing check, because the chapter explains the tower plume as saturated exhaust mixing with cooler outside air until its vapour condenses into fog. Two better readings were found elsewhere: Entropy chapter 6 (entropy generated by heat transfer) explains the cogeneration check, and Heat Pumps and Refrigeration chapter 1 (the second law and its limits) complements the Rankine check. The other nine pairs stay rejected, each with the re-check recorded in its reason. The batch now has 11 approved and 9 rejected relationships, and all six tools show "Learn the Concepts Behind This Tool". `npm run verify` before the push: 1,142/1,142 tests, 3,719 pages; SEO gate passed.
