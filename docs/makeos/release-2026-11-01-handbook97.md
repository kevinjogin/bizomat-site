# WORKOS release: batch handbook97, 1 November 2026

Seven tools from the deep audit of the Machinery’s Handbook belt drive section, taking WORKOS from 1006 to 1013 tools (MAKEOS handbook tools 812 → 819). Requested by the owner ("work on next big sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 1 November 2026 (all seven tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. The rating formulas the handbook prints for each belt standard are built in, with their cross-section constants. Every correction factor the handbook gives only as a table is a user input:
- speed ratio factors
- length and length-flex factors
- arc of contact and tension ratio factors
- width factors
- the combined light duty factor and the 2a differential

Service factors, loads and rim speed limits are also user inputs. The tools show the speed ratio, arc of contact and other values needed to read the tables.

## Deep audit

The belt pages (pp. 2484–2536) are cited only within 50- to 63-page ranges by the belt tools:
- `v-belt-drive-design`, `v-belt-motor-load-check` and `fan-drive-sizing` size V-belt drives from friction, tension ratio and an allowable tension per belt you enter.
- `timing-belt` and `timing-belt-drive-design` cover synchronous belt geometry and a width from an allowable tension per millimetre.

None applies the ANSI/RMA power rating formulas the handbook prints for each belt type:
- IP-22 narrow, IP-20 classical, IP-23 light duty, IP-26 V-ribbed and IP-25 variable-speed belts
- the IP-21 allowable tight side tension method for double V-belts
- the IP-24 torque and power ratings for synchronous belts

`MH_DEEP_AUDIT.md` in the generator folder records these pages and the others examined in this pass: shaft alignment, forming tools, riveted joints, knurling, drawing and balancing are already covered by live tools, and pages above 2700 that the audit lists are index and table pages.

## Tools

| Tool | Method | READOS connections |
|---|---|---|
| [Narrow V-Belt Power Rating](https://kevos.com/tools/narrow-v-belt-rating/) | HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log (dp r)] + KSR r for 3VX, 5VX, 5V and 8V; × length and arc factors; arc 2 cos⁻¹ ((D − d) ÷ 2C); belts = design power ÷ corrected rating | Machine elements: belt and chain drives |
| [Classical V-Belt Power Rating](https://kevos.com/tools/classical-v-belt-rating/) | HP = dp r [K1 − K2 ÷ dp − K3 (dp r)² − K4 log (dp r)] + K2 r (1 − 1 ÷ KSR) for A, AX, B, BX, C, CX and D; corrections and number of belts as above | Machine elements: belt and chain drives |
| [Double V-Belt Drive by Allowable Tight Side Tension](https://kevos.com/tools/double-v-belt-tension/) | S = r d ÷ 3.820; Te = 33 Pd ÷ S; TT = Te R ÷ (R − 1); TS = TT − Te; Tr = K1 − K2 ÷ d − K3 S² − K4 log S for AA, BB, CC and DD on each sheave; Nb = TT ÷ (Tr Kf) | none (one rejected pairing) |
| [Light Duty V-Belt Power Rating](https://kevos.com/tools/light-duty-v-belt-rating/) | HP = r [K1 d^0.91 ÷ r^0.09 − K2 − K3 r² d³] with d = d0 − 2a for 3L, 4L and 5L; ÷ combined correction factor | none |
| [V-Ribbed Belt Power Rating per Rib](https://kevos.com/tools/v-ribbed-belt-rating/) | HP = dp r [K1 ÷ (dp r)^0.09 − K2 ÷ dp − K3 (dp r)²] + K2 r (1 − 1 ÷ KSR) per rib for J, L and M; corrections and number of ribs | none |
| [Variable-Speed Belt Drive](https://kevos.com/tools/variable-speed-belt-drive/) | speed variation PDmax ÷ PDmin or (DR DN) ÷ (dr dn); HP = dp r [K1 (dp r)^−0.09 − K2 ÷ dp − K3 (dp r)²] + Kr r (1 − 1 ÷ KSR) for the twelve sections 1422V to 4836V; rim speed π Do n | none (one rejected pairing) |
| [Synchronous (Timing) Belt Rating](https://kevos.com/tools/synchronous-belt-rating/) | MXL Qr = d [a − b d²] for 0.12, 0.19 and 0.25 in widths; XL to XXH HP = d r [K1 − K2 (d r)²] for the widest standard belt; Kz = 0.2 (teeth − 1) below six teeth in mesh; × width factor; 33 m/s limit | Machine elements: belt and chain drives |

All seven tools are in Power Transmission. They take millimetres, rpm and kilowatts; the formulas are applied in the handbook’s inch units and converted (1 hp = 0.7457 kW).

Knowledge connections: 3 approved and 2 rejected relationships (`docs/knowledge-links-review.md`). The rejected pairs are the double V-belt tool with the belt tension by frequency chapter (it sets installed tension, not working tensions) and the variable-speed belt tool with the inertia through gears and belts chapter.

## Handbook values reproduced by the tests

- **Double V-belt allowable tight side tension (Tables 16 and 19):** AA 30, 57 and 88 lbf on 3.0, 4.0 and 6.5 in sheaves at 200 ft/min, and 38 lbf on 4.0 in at 1000 ft/min; DD 243 and 503 lbf on 12 and 20 in at 200 ft/min, and 291 lbf on 16 in at 1000 ft/min.
- **MXL torque ratings (Table 47):** 0.29 and 0.86 lbf·in for a 0.12 in belt on 10 and 30 groove pulleys; 0.48 and 1.44 for 0.19 in; 0.67, 1.34 and 2.01 for 0.25 in on 10, 20 and 30 grooves.
- **Teeth in mesh factor (Table 46):** 0.60 with four teeth and 0.20 with two.
- **Rating formulas:** each section’s formula, with its speed ratio term, is checked directly; for example 5V on a 7.1 in sheave at 1750 rpm rates about 16 hp.

## Notes on the source

- **Narrow V-belt constants:** the handbook gives K1 to K4 in Table 5, which the source text extracts out of line; the column order was checked against the size of each constant and against typical published ratings for all four sections before being built in.
- **4430V variable-speed belt:** the source prints 7.854 in the bracket (the same as 3230V) but 9.818 in the speed ratio term. The tool follows the print and says so.
- **Teeth in mesh factor:** Table 46 lowers the rating by 0.20 for each tooth below six (0.80 for five, down to 0.20 for two); the tool applies that rule rather than storing the table.

## Verification (on top of 21caf56)

The batch was drafted on 7c48d34 and rebuilt on 21caf56 after a READOS publish; the tool files and test changes are identical to the draft.

- `node scripts/tools/input-guides.mjs check --file handbook97`: 7 tools, 74 inputs, 0 problems.
- New calculator tests: 6/6 (the teeth in mesh rule was corrected from 0.2 × teeth to 0.2 × (teeth − 1) when the test against Table 46 failed).
- Calculator tests: 1,154/1,154.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,302/1,302
  - post-build checks: 4,262 pages verified
- `npm run knowledge:check`: valid (936 relationships). `npm run seo:validate`: passed. Inventory: 1013 tools, 8,807 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1013/1013 tools passed with 8,807 figures.
- The synchronous belt tool was also run in the browser, where three teeth in mesh give Kz = 0.40 and it reports the belt as too narrow for the power.
