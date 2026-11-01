# WORKOS release: batch bryanthermo, 29 October 2026

Three thermodynamics tools added to WORKOS (MAKEOS collection), taking the directory from 856 to 859 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: G. H. Bryan, *Thermodynamics: An Introductory Treatise Dealing Mainly with First Principles and Their Direct Applications* (B. G. Teubner, Leipzig, 1907), cited by section and page. The author died in 1928 and the work is in the public domain; methods are restated in original words and no text, tables or figures are reproduced. The supplied PDF is a scan without a text layer; each cited section was read as page images. Further references: Çengel and Boles, *Thermodynamics: An Engineering Approach*; NIST Chemistry WebBook (property data the user enters); Rowe (ed.), *CRC Handbook of Thermoelectrics* (1995); Ioffe, *Semiconductor Thermoelements and Thermoelectric Cooling* (1957).

| Tool | Category | Method (Bryan sections) | READOS connections |
|---|---|---|---|
| [Liquid Adiabatic Compression](https://kevos.com/tools/liquid-adiabatic-compression/) | Hydraulics | (∂T/∂p)_s = T α ÷ (ρ c_p), c_p − c_v = T α² K_T ÷ ρ, K_s = γ K_T, wave speed √(K_s ÷ ρ) (§33 eq. 35, §§113–116, §121) | Water Hammer: wave speed in a pipe (complements) |
| [Gas Mixture Properties](https://kevos.com/tools/gas-mixture-properties/) | Pneumatics | Dalton’s law; mixture R, c_p, c_v, γ, density, speed of sound; mixing entropy and least separation work (§§121, 124–128, eqs. 166–179) | Industrial Gases: shielding and purging gases (complements) |
| [Thermoelectric Cooler Check](https://kevos.com/tools/thermoelectric-cooler-check/) | Engineering | Ideal module model with S, R, K fitted from the datasheet maximum point; junction heat proportional to absolute temperature (§§164–166) | none yet |

Knowledge connections: 2 approved and 3 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

Four further tools built in the same batch were not published because batch handbook69 (Fermi), released while this batch was in review, already covers their calculations: a Carnot limit check, a stream exergy check, a vapour pressure and boiling check (same id) and a battery heat check.

## Verification

- Every tool has independent hand-calculated reference values and cross-checks against Bryan’s own forms: Bryan (166) and (179) for the mixture gas constant and mixing entropy, (35) for K_s ÷ K_T = γ, α = 0 giving no heating and γ = 1, a negative expansion coefficient cooling the liquid, and zero heat pumped with V = V_max at the module’s rated maximum point. Pass and fail verdicts and out-of-range inputs that return CHECK INPUTS are tested.
- `node scripts/tools/input-guides.mjs check --file bryanthermo`: 3 tools, 29 inputs, 0 problems. Inventory: 859 tools, 7,294 inputs, all covered.
- `npm run verify` (after rebasing on 588097b): astro check 0 errors and 0 warnings; 1,077/1,077 tests; 3,685 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs` on the built site): 859/859 tools passed, 7,294 figures, including every tool on a 360 px phone screen. Playwright’s browser download was blocked on this machine, so the unchanged script ran in the installed Microsoft Edge through Playwright’s `msedge` channel.

## Limits stated in the tools

Liquid compression takes the expansion coefficient, density and specific heat as constant and applies to the liquid alone; entrained air, hoses and pipe walls lower the effective modulus. The gas mixture tool is for perfect gases with constant specific heats entered at the mixture temperature, and its separation work is for complete separation into pure gases. The thermoelectric model fits constant S, R and K at one rated point, neglects the Thomson effect and takes the face temperatures as inputs.

## Open points for the owner

- The tier-wording test matches the substring “tier”, which occurs in “Peltier”, so the thermoelectric tool cannot use that word in its name, keywords or guide; searches for “Peltier” will not find it.
