# WORKOS release: batch handbook95, 1 November 2026

Four tools from the deep audit of the Machinery’s Handbook bearing rating, disc spring and thread measurement pages, taking WORKOS from 998 to 1002 tools (MAKEOS handbook tools 804 → 808). Requested by the owner ("work on next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (all four tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. The bearing rating factors fc and fo (from the handbook tables), loads, required lives, static safety and disc spring stress limits are always user inputs.

## Deep audit

The audit script listed these pages as formula-heavy but cited only within wide ranges:

- **Ball and roller bearing ratings (pp. 2405–2418):** cited only within the 9- to 76-page ranges of the bearing tools. `bearing-l10-life`, `bearing-life-adjusted`, `bearing-selection-check` and `bearing-static-ratio` take the ratings C and Co as inputs; none works them out from the bearing’s geometry by the AFBMA formulas the handbook gives.
- **Disc springs (pp. 354–364):** cited by the disc spring tools for the basic Almen–László force and the stress at the top inner edge, and otherwise only within a 17-page hydraulics range. Nothing follows the handbook’s corrected outside diameter Da, the stresses at points 0 to 3, the critical-point rule, the fatigue life equations or the recommended dimension ratios.
- **Thread measurement (pp. 1993–2001):** the three-wire tools cover the general formula, the simplified Buckingham formula (`three-wire-lead-angle`), taper and buttress threads and the standard thread limits. None applies the exact involute helicoid formula (4).

Also examined and not built:

- **Machining econometrics (pp. 1153–1158):** the economic tool life TE = TV (1/n − 1) is the minimum-cost tool life of `taylor-tool-life`, and the equivalent tooling-cost time is in `slot-vs-high-speed-milling-cost`; recorded as covered.
- **Disc springs with contact surfaces (p. 357, Example 2 on p. 364):** the reduced-thickness method could not be made to reproduce Example 2’s stresses (the closest reading of its inputs is 2–3 % off), so springs with contact surfaces are left out until it can be checked.

`MH_DEEP_AUDIT.md` in the generator folder records these pages.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Ball Bearing Load Ratings from Geometry](https://kevos.com/tools/ball-bearing-load-ratings/) | Power Transmission | C = fc (i cos α)^0.7 Z^(2/3) D^1.8 (D ≤ 25.4 mm) or 3.647 fc (i cos α)^0.7 Z^(2/3) D^1.4; thrust Ca = fc Z^(2/3) D^1.8 at 90° or fc (cos α)^0.7 Z^(2/3) D^1.8 tan α; tandem and equal rows by the 0.7 power; Co = fo i Z D² cos α, Coa = fo Z D² sin α; L10 = (C ÷ P)³; Co ÷ Po | Machine elements: selecting bearings and lubrication |
| [Roller Bearing Load Ratings from Geometry](https://kevos.com/tools/roller-bearing-load-ratings/) | Power Transmission | C = fc (i leff cos α)^(7/9) Z^(3/4) D^(29/27); thrust Ca = fc leff^(7/9) Z^(3/4) D^(29/27) at 90° or with (leff cos α) and tan α; tandem and equal rows by the 7/9 power (formula 18); Co = 44 (1 − D cos α ÷ dm) i Z leff D cos α, Coa = 220 (1 − D cos α ÷ dm) Z leff D sin α; L10 = (C ÷ P)^(10/3); warnings for leff > 2.5 D and P > C/4 | Machine elements: selecting bearings and lubrication |
| [Disc Spring Forces, Stresses and Fatigue Life](https://kevos.com/tools/disc-spring-fatigue-life/) | Springs | Da = D − 2t (sin θ + cos θ ÷ 6); K1, K2, K3; F = 4E s [(h − s ÷ 2)(h − s) t + t³] ÷ [(1 − μ²) K1 Da²]; σ0, σ1, σ2, σ3; critical point by the larger σmax − 0.5 σmin; N = 10^(a − b (σmax − 0.5 σmin)) for Groups 1 and 2; allowed range (a − log N) ÷ b; ratios D ÷ d, h ÷ t, D ÷ t | Machine elements: specifying springs; Springs by the numbers: disc spring stacks |
| [Thread Measurement over Wires by the Involute Helicoid Formula](https://kevos.com/tools/thread-wire-involute-helicoid/) | Threads | tan B = L ÷ π E; tan F = tan An ÷ sin B; Rb = (E ÷ 2) cos F; Ta = T ÷ tan B; tan Hb = cos F tan H; inv G = Ta ÷ E + inv F + W ÷ (2 Rb cos Hb) − π ÷ S; M = 2 Rb ÷ cos G + W; compared with M = E + W (1 + sin An); pitch diameter from a reading | none (one rejected pairing) |

All four tools take millimetres, newtons and megapascals; the bearing factors are the metric columns of the handbook tables.

Knowledge connections: 4 approved and 2 rejected relationships (`docs/knowledge-links-review.md`). The rejected pairs are the ball bearing tool with the printed mechanisms bearing chapter (it uses the catalogue rating of a standard 608 bearing) and the involute helicoid tool with the fasteners and threads chapter (it only names the three-wire method for fastener threads).

## Handbook values reproduced by the tests

- **Disc spring Example 1 (80-41-4 Group 2 springs, E = 206,000 N/mm², μ = 0.3, deflections 0.9 and 1.32 mm):**
  - θ = 6.4°, Da = 77.78 mm, K1 = 0.6841, K2 = 1.2086, K3 = 1.3589
  - Fmin = 14,390 N, Fmax = 20,050 N; σ0 = 1103 N/mm²
  - σ2 = 654 and 1032 N/mm², σ3 = 815 and 1149 N/mm²; σmax − 0.5 σmin = 705 at point 2 and 741.5 at point 3, so point 3 governs
  - fatigue life 1,321,000 cycles (1,328,000 from the unrounded stresses)
- **Disc spring stress range:** for Group 2 at 5 × 10⁵ cycles, σmax − 0.5 σmin = 820, so σmin = 860 N/mm² with σmax = 1250 N/mm². Equation (22) gives 3 cycles from Example 2’s printed stresses.
- **Involute helicoid Example 3 (six starts, E = 0.6250 in, An = 20°, L = 0.864 in, W = 0.07013 in):** B = 23.751°, F = 42.104°, Rb = 0.23185, Ta = 0.16362, Hb = 59.328°, inv G = 0.20351, G = 44.350°, M = 0.71859 in; the simplified formula gives 0.71912 in, 0.00053 in more.
- **Buckingham Example 1 (two-start Acme, E = 2.75 in, lead 1 in):** B = 6.6025°, W = 0.25651 in, M = 3.0707 in, about 0.0001 in above the exact formula.
- **Buckingham Example 2 (triple-start worm, 30° lead angle, cutter angle reduced):** An = 26.565°, W = 0.72618 in, M = 3.532 in by the simplified formula and 3.515 in by the exact formula.
- **Bearing rating tables:** the metric and inch columns of the fc tables (46.7 and 3550 for radial ball bearings, 36.7 and 2790 for thrust ball bearings, 52.1 and 4680 for radial roller bearings, 105.4 and 9500 for thrust roller bearings) give the same rating to within 0.5 to 1 %, as do fo 12.7 and 1850 and the static constants 44 and 6430, 220 and 32150. Formulas (2) and (3a) meet at a 25.4 mm ball.

## Notes on the source

- **Thrust ball bearing static rating:** formula (21) reads Coa = fo Z D² cos α in the source text, which gives zero for 90° thrust bearings. The tool uses sin α, as the handbook’s thrust roller formula (23) does.
- **Multi-row thrust bearings:** formulas (10) and (18) with equal rows reduce to the number of rows to the 0.7 or 7/9 power; the tools apply them in that form.
- **Disc spring constants:** the extracted text drops the 1 ÷ π, 6 ÷ π and 3 ÷ π in K1, K2 and K3; the example’s values (0.6841, 1.2086, 1.3589) confirm them.
- **Compressive stress check:** the text sets 1600 N/mm² for a fully flattened spring, but its example checks point 0 at the maximum working deflection; the tool follows the example.
- **Disc spring fatigue life:** the equations cover 10⁴ to 2 × 10⁶ cycles; the tool reports 2 × 10⁶ or more as unlimited and flags a life below 10⁴.

## Verification (on top of 4a46953)

The batch was drafted on 5d213e0 and rebuilt on 4a46953 after the Springs and Bolted Joints books were published, adding the link to the Springs book’s disc spring chapter. The tool files and test changes are identical to the draft.

- `node scripts/tools/input-guides.mjs check --file handbook95`: 4 tools, 49 inputs, 0 problems. Inventory: 1002 tools, 8,691 inputs, all covered.
- Calculator tests: 1,144/1,144 (the tier-wording test first caught a capitalised word in one input tip, which was reworded).
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,292/1,292
  - post-build checks: 4,229 pages verified on 4a46953
- `npm run knowledge:check`: valid (893 relationships on 4a46953). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1002/1002 tools passed with 8,691 figures.
- The disc spring tool was also run in the browser, where it reports the fatigue life as below the requirement when the required life is raised to 1,500,000 cycles.
