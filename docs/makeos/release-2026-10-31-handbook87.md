# WORKOS release: batch handbook87, 31 October 2026

Six tools from the last open and candidate pages of the Machinery’s Handbook page ledger, taking WORKOS from 971 to 977 tools (MAKEOS handbook tools 777 → 783). Requested by the owner ("Continue to keep making tools from the book and keep record of all pages scanned and completed"; "Start handbook87"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (all six tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Measurements, roughness readings, heat demand and appliance efficiency are always user inputs.

## Page ledger

With this batch every page with formula lines has been read by hand or is cited by a tool.

| Pages | Before this batch | After |
|---|---|---|
| Cited by a live tool | 2,026 | 2,026 (2,040 once this batch is live) |
| Cited by a draft tool (handbook79 and handbook87) | 19 | 33 |
| Read by hand: tool possible, not yet built | 6 | 4 |
| Read by hand: nothing to build | 84 | 152 |
| No formula lines (tables, prose, figures) | 1,104 | 1,102 |
| Formula lines, not yet read | 78 | 0 |

Read in this batch and recorded without a tool:

- **Reference mathematics (pp. 4–8, 14–17, 30–31, 35, 56, 58–60, 2932, 2989–2992, 3489–3490):** arithmetic, algebra, series, calculus tables, geometrical propositions, logarithms and the slide rule.
- **Unit and conversion tables already covered:**
  - SI units and length tables (pp. 2656–2674), covered by `length-converter`
  - phonetic alphabet (p. 2700)
  - sphere table (p. 2974), covered by `sphere-sections`
- **Formulas in live tools:**
  - force system moments (p. 164), in the force system tools
  - equivalent chip thickness (p. 1022), in `ect-cutting-forces`
  - thread depth (p. 1302), in the thread tools
  - 75 % tap drill rule (p. 3284), in `tap-drill`
  - drill point length (p. 889)
- **Data and examples:**
  - fit deviations (p. 670)
  - forming tool and end mill tables (pp. 807, 817)
  - washers (p. 1567)
  - alloy and heat treatment tables (pp. 392–534)
  - surface texture symbology (pp. 748, 752–753)
  - CNC macro examples (pp. 1313, 3169–3193)

Candidates left:

- **Socket screw grip and shank lengths (p. 1696):** L_g max = L − b, L_s min = L_g max − 5P. With the structural bolt rule on p. 1573 this could make a grip-length check.
- **Planetary gear Figs. 1–24 (pp. 2212–2214).**

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Area Converter](https://kevos.com/tools/area-converter/) | Units | m², km², hectare, are, cm², mm², µm², in², ft², yd², acre, mile², square mil, circular mil, circular inch from 1 in = 0.0254 m | — |
| [Volume and Capacity Converter](https://kevos.com/tools/volume-converter/) | Units | m³, litre, mL, mm³, hL, in³, ft³, yd³, US and Imperial gallon, quart, pint and fluid ounce, US and Imperial bushel | — |
| [Moment of Inertia, Section Modulus and Momentum Converter](https://kevos.com/tools/inertia-converter/) | Units | Mass moment of inertia (kg·m², lb·ft², lb·in², slug·ft², lbf·in·s² and others), second moment of area, section modulus and momentum, within each kind | — |
| [Silent Chain Sprocket Inspection](https://kevos.com/tools/silent-chain-sprocket-inspection/) | Power Transmission | PD = P ÷ sin(180°/N); over-pin diameter over 0.625P pins (even and odd N); over-pin tolerance −(0.004 + 0.001 P √N) in; eccentricity 0.001 PD within 0.006 to 0.032 in TIR; guide groove P(cot 180°/N − 1.16), +0, −0.030 in | — |
| [Fuel Oil Heating Value from Baumé Gravity](https://kevos.com/tools/fuel-oil-heating-value/) | Engineering | SG = 140 ÷ (130 + °Bé); BTU/lb ≈ 18,650 + 40 (°Bé − 10); MJ/kg, MJ/L and BTU per US gallon; oil burned = output ÷ (efficiency × heating value) | Combustion by the numbers: fuel, air and the reaction |
| [Surface Roughness Acceptance](https://kevos.com/tools/surface-roughness-acceptance/) | Quality | 16 % rule: at most 16 % of values above the upper limit or below the lower limit, with the handbook’s mean + σ exception; max rule: no value beyond the limit; evaluation length ln = 5 lr | — |

Knowledge connections: 1 approved and 3 rejected relationships, each with the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`). Rejected pairs:

- **Combustion: available heat and the furnace load** with the fuel oil tool: that chapter treats a natural gas furnace, not oil gravity.
- **Permanent-magnet servo motors** with the inertia converter: that chapter uses kg·m² throughout and does not convert units.
- **Arc welding: duty cycle, supply and cables** with the area converter: that chapter sizes cables in mm² only.

## Handbook values reproduced by the tests

- **Square measure (Table 16):**
  - 1 acre = 4046.856 m²
  - 1 ha = 2.471 acres
  - 1 m² = 10.764 ft² = 1.196 yd²
  - 1 mile² = 2.5899 km²
  - 1 cm² = 0.155 in²
  - 1 in² = 1,273,239 circular mils
  - 1 yd² = 0.83612736 m²
- **Cubic measure (Table 21):**
  - 1 m³ = 1.30795 yd³ = 35.314667 ft³ = 61,023.74 in³ = 264.17205 US gal = 219.96925 Imperial gal
  - 1 in³ = 0.55411256 US fl oz
  - 1 US fl oz = 29.57353 mL; 1 Imperial fl oz = 28.41306 mL
  - 1 ft³ = 7.4805 US gal; 1 yd³ = 201.97403 US gal
  - 1 US bushel = 1.2445 ft³
- **Moment of inertia and momentum (Tables 57 and 58):** all twelve moment of inertia, section and section modulus factors and the four momentum factors.
- **Silent chain sprockets (Table 3a):** pitch, rounded-tooth outside and over-pin diameters for 96, 124, 125 and 150 teeth at 1 in pitch.
- **Silent chain tolerances (Table 4a):** the over-pin tolerances at 3/8, 1 and 2 in pitch, against the footnote formula. Eccentricity limits are checked at 0.001 PD and at the 0.006 and 0.032 in bounds.
- **Fuel oil:** 26.9 °Bé gives SG 0.8923 and 18,650 + 40 × 16.9 = 19,326 BTU/lb. The handbook’s 143,950 BTU per gallon follows from its 19,376 BTU/lb at that gravity, within 0.2 %.
- **Surface roughness:** the 16 % rule, its exception, the max rule, a lower limit and ln = 5 lr, by closed form.

## Notes on the source

- **Table 4a:** the over-pin tolerances depart from the table’s own footnote formula (0.004 + 0.001 P √N) by up to 0.0014 in. The tool uses the formula at the actual number of teeth.
- **Table 3b (3/16 in pitch):** the over-pin column does not follow the 3/16 in formulas (it lists 0.414 in for 11 teeth against a pitch diameter of 0.666 in). The tool is limited to 3/8 in and larger pitch.
- **Table 57:** prints 61,023.76 in³ per m³. The exact value, also printed in Table 21, is 61,023.74. The momentum factors are rounded in the sixth or seventh figure.
- **Fuel oil:** the handbook quotes 19,376 BTU/lb for 26.9 °Bé mid-continent oil, while its own formula gives 19,326 BTU/lb. The tool uses the formula and asks for the supplier’s tested value for contracts.
- **Surface roughness:** the handbook’s wording of the normal-distribution exception is brief. The tool marks an acceptance under it as needing a check that the values are normally distributed.

## Verification (on top of 311df42, after rebasing over a READOS publish)

- `node scripts/tools/input-guides.mjs check --file handbook87`: 6 tools, 29 inputs, 0 problems. Inventory: 977 tools, 8,441 inputs, all covered.
- Calculator tests: 1,111/1,111.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,259/1,259
  - post-build checks: 4,094 pages verified
- `npm run knowledge:check`: valid (711 relationships with main’s new links). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 977/977 tools passed with 8,441 figures. The sprocket inspection and roughness acceptance tools were also opened and run in the browser.
