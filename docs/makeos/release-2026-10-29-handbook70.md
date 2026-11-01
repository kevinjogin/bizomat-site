# WORKOS release: batch handbook70, 29 October 2026

Six thermodynamics tools added to WORKOS (MAKEOS collection), taking the directory from 908 to 914 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: Bruno Linder, *Thermodynamics and Introductory Statistical Mechanics* (Wiley-Interscience, 2004; © John Wiley & Sons; ISBN 0-471-47459-2), cited by section and printed page. The supplied PDF was readable throughout; the cited sections were read in full. No tables, examples or text are reproduced. Further references named by scope only: AS/NZS 3823 series (air conditioner and heat pump ratings), AS/NZS 60079.10.1 (hazardous area classification), AS/NZS 3500.4 (heated water services), the IUPAC Gold Book entry for the osmotic coefficient, and safety data sheets. These tools do not cite *Machinery’s Handbook*, so batch handbook70 is registered in `TOOL_FILES` and the test `FILES` list but not in the handbook-only `HB_FILES` list.

## Overlap with tools already published

Four of the six repeat methods that other batches published on the same day: Clausius–Clapeyron boiling (`vapour-pressure-boiling-check`, `clausius-boiling-margin-check`), reverse osmosis pressure (`ro-pressure-check`, `ro-concentrate-pressure-check`), Joule–Thomson regulator cooling (`gas-throttling-temperature-check`) and the Carnot COP check (`heat-pump-cop-check`; engine claims in `waste-heat-recovery-limit`). The owner was shown the overlap twice and chose to publish all six. What each adds: the boiling tool gives the pressure needed for a temperature limit; the RO tool takes an osmotic coefficient and salt passage; the throttling tool integrates the van der Waals coefficient over the pressure drop and gives the inversion temperature; the second-law check covers a fixed-reservoir engine and reports entropy generated and lost work. The solvent headspace and water blending tools have no equivalent.

| Tool | Category | Method (Linder sections, printed pages) | READOS connections |
|---|---|---|---|
| [Heat Engine and Heat Pump Second-Law Check](https://kevos.com/tools/heat-engine-second-law-check/) | Engineering | Carnot limits, Clausius inequality, entropy with surroundings (§4.1–4.4, 4.11; pp. 32–41, 48) | Entropy; Heat Pumps and Refrigeration (two chapters); Process Chillers |
| [Gas Pressure Reduction Cooling Check](https://kevos.com/tools/gas-throttling-cooling-check/) | Pneumatics | Joule–Thomson coefficient; (∂H/∂P)_T = b − 2a/RT for a van der Waals gas (§3.7.4; pp. 29–31) | Real Gases; Entropy |
| [Boiling Point Under Vacuum](https://kevos.com/tools/vacuum-boiling-point/) | Engineering | Clapeyron and integrated Clausius–Clapeyron (§9.2–9.3; pp. 96–97) | Vacuum; Real Gases |
| [Solvent Vapour Headspace Check](https://kevos.com/tools/solvent-headspace-lel-check/) | Engineering | Clausius–Clapeyron and Raoult’s law (§9.3, 10.2.1; pp. 97, 104–105) | Welding Health and Safety |
| [Reverse Osmosis Pressure Check](https://kevos.com/tools/ro-osmotic-pressure-check/) | Hydraulics | van ’t Hoff osmotic pressure (§10.4.4; pp. 112–113) with a solute mass balance | Clean water as an engineered system |
| [Hot and Cold Water Blending Check](https://kevos.com/tools/hot-cold-water-blend-check/) | Hydraulics | ΔS = C_P ln(T₂/T₁) for a condensed phase, entropy of system and surroundings (§4.11, 4.13, 8.5; pp. 48–51, 91–93); lost work = T₀ S_gen | Entropy (two chapters) |

Knowledge connections: 12 approved and 4 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`). Rejected: Process Chillers’ saturation chapter (it shows Clausius–Clapeyron misses by more than 10 % for refrigerants), Process Chillers’ flash-gas chapter (two-phase refrigerant), Process Steam’s pressure reduction chapter (wet steam) and Combustion’s purge chapter (fuel gas, not solvent vapour).

## Verification

- Every tool has independent hand-calculated reference values: closed forms, the exact separable integral of the van der Waals Joule–Thomson equation (against the tool’s Runge–Kutta integration), Linder’s nitrogen constants giving an inversion temperature of about 866 K, and identity checks (lost work = T × S_gen, zero entropy at the Carnot COP, Clausius–Clapeyron round trips, the least RO feed pressure giving exactly the required tail pressure, the blending energy balance). Pass and fail verdicts and out-of-range inputs that return CHECK INPUTS are tested for every tool.
- `node scripts/tools/input-guides.mjs check --file handbook70`: 6 tools, 49 inputs, 0 problems. Inventory: 914 tools, 7,808 inputs, all covered.
- `npm run verify` (after rebasing on d788504): astro check 0 errors and 0 warnings; 1,170/1,170 tests; 3,740 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed (2,984 indexable pages, all in the sitemap).
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium headless shell 1248 on the built site): 914/914 tools passed, 7,808 figures, no failures; sampled tools on a 360 px phone screen without overflow.

## Limits stated in the tools

The second-law check uses two constant-temperature reservoirs. The van der Waals Joule–Thomson coefficient is a low-pressure estimate. Clausius–Clapeyron takes the enthalpy of vaporisation as constant. The headspace check assumes a saturated, ideal single-solvent headspace and is a screening aid only; area classification and entry need a competent person and a gas detector. The RO check takes the osmotic coefficient as constant and ignores concentration polarisation. The blending check is adiabatic with constant specific heat.
