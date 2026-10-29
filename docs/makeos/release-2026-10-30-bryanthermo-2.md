# WORKOS release: batch bryanthermo, second pass, 30 October 2026

Two more thermodynamics tools added to the bryanthermo batch (MAKEOS collection), taking the directory from 923 to 925 tools. The owner approved both narrowed tools in the bryanthermo session on 29 October 2026 and asked for them to be published on 30 October 2026. They are appended to the existing bryanthermo files; none of that batch's three published tools, no other existing tool, and no shared tool code, layout, navigation or READOS content was changed.

Source: G. H. Bryan, *Thermodynamics: An Introductory Treatise Dealing Mainly with First Principles and Their Direct Applications* (B. G. Teubner, Leipzig, 1907), public domain, cited by section and page; methods restated in original words. Further reference: Çengel and Boles, *Thermodynamics: An Engineering Approach*.

| Tool | Category | Method (Bryan sections) | READOS connections |
|---|---|---|---|
| [Heat Engine Carnot Limit Check](https://kevos.com/tools/heat-engine-carnot-limit/) | Engineering | η_C = 1 − T_C ÷ T_H for fixed reservoirs, second-law efficiency, most work, least heat rejected, entropy generated and work lost (§§61–65, 74, 77) | Entropy by the Numbers (absolute temperature and the Carnot limit); Heat Pumps and Refrigeration (the second law and its limits) |
| [Least Work to Chill a Product Below Ambient](https://kevos.com/tools/chilling-least-work-check/) | Engineering | Least work C [T₀ ln(T_s ÷ T₂) − (T_s − T₂)] for cooling a stream from T_s = min(T₁, T₀) to T₂, ideal COP and the stated power's second-law efficiency (§§90, 93) | Entropy by the Numbers (lost work and exergy; heat pumps and refrigerators against the limit); Process Chillers (the chiller and its limit) |

Knowledge connections: 5 approved and 3 rejected relationships, as reviewed in the bryanthermo session.

## Overlaps the owner accepted

`heat-engine-carnot-limit` sits beside two live tools with a similar subject: `carnot-limit-check` (batch greiner) and `heat-engine-second-law-check` (batch handbook70). `chilling-least-work-check` differs from the fixed-temperature refrigerator limit because it integrates over a product that cools from its start temperature to its end temperature. The owner was told of the overlap before asking for publication.

## Verification

- Independent closed-form reference values for both tools, and cross-checks against Bryan's reversible-cycle forms. Work lost equals T_C × entropy generated and equals the most work less the stated work. At the Carnot efficiency no entropy is generated. The least work equals a midpoint-rule integral of dQ (T₀ ÷ T − 1). A narrow chilling range reduces to the fixed-temperature Carnot refrigerator. Heat removed above ambient needs no work. Pass, warn and fail verdicts and inputs that return CHECK INPUTS are tested.
- `node scripts/tools/input-guides.mjs check --file bryanthermo`: 5 tools, 42 inputs, 0 problems.
- Inventory: 925 tools, 7,923 inputs, all covered.
- `npm run verify` (on main at fe054a1 plus this batch): 1,193/1,193 tests; 3,751 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed (3,751 pages, 2,995 indexable, all in the sitemap).
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright 1.64.1 headless Chromium on the built site): 925/925 tools passed, 7,923 figures, including every tool on a 360 px phone screen.

## Limits stated in the tools

The Carnot check assumes reservoirs at fixed temperatures and enters efficiencies on one consistent basis. The chilling check assumes constant specific heat at constant pressure with no phase change; freezing the product or condensing moisture adds latent heat that it leaves out.
