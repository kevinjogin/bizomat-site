# WORKOS release: batch handbook99, 2 November 2026

Five tools from the deep audit of the Machinery’s Handbook shaft alignment, riveted joint, uniform strength beam and machining econometrics pages, taking WORKOS from 1020 to 1025 tools (MAKEOS handbook tools 826 → 831). Requested by the owner ("work on next sets and publish all"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 2 November 2026 ("work on next sets and publish all").

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced.

The tools build in the handbook’s formulas and the signs of its sixteen dial indicator arrangements. These are always user inputs:
- allowable and safe stresses
- alignment tolerances
- measured finishes and indicator readings
- loads, distances and bolt threads

## Deep audit

The audit flagged these pages because they are cited only inside wide page ranges:
- the shaft alignment pages (pp. 2627–2650), cited only within a 38-page range of the lifting tools
- the riveted joint formulas (pp. 1731–1734), cited only within 16-page ranges of the joint tools
- the beams of uniform strength tables (pp. 271–272), cited only within 18- to 21-page beam ranges
- the machining econometrics pages (pp. 1143–1145), cited only within the 51-page range of `turning-cost-per-part`

What the existing tools cover:
- `rim-face-alignment` and `shaft-alignment-plan` handle the usual arrangement only, with thermal growth in `alignment-thermal-growth`.
- `riveted-joint` gives the efficiency of a lap joint by rows and shear planes.
- `beam-sizing` and `beam-cases` cover uniform beams.
- `feed-for-finish` and `finish-turning-setup` use the geometric finish rule.

None applies:
- the sixteen indicator arrangements, extra feet or bracket sag
- jackbolt turns
- the six riveted joint types with their combined failure modes
- beams of uniform strength
- the Colding nose radius rule

The surface finish constants equation on p. 1144 needs the five laboratory constants of a tool and work pair, so it is recorded as not built in `MH_DEEP_AUDIT.md` in the generator folder.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Rim and Face Alignment for Any of the 16 Indicator Arrangements](https://kevos.com/tools/rim-face-arrangement-shims/) | F = r ÷ (±2) + f B ÷ (±A), R = r ÷ (±2) + f C ÷ (±A) with the signs of the chosen arrangement; signed distances for extra feet; bracket sag added (zeroed at 12 o’clock) or subtracted (zeroed at 6 o’clock) | Shaft alignment: rim and face; indicators, brackets and sag |
| [Jackbolt Turns and Flats for an Alignment Move](https://kevos.com/tools/jackbolt-alignment-turns/) | advance per turn = 1 ÷ TPI or the pitch; per flat ÷ 4 (square) or ÷ 6 (hex); turns = move ÷ pitch, rounded to the nearest flat | Shaft alignment: making the moves |
| [Riveted Joint Strength by Joint Type](https://kevos.com/tools/riveted-joint-strength-by-type/) | the handbook’s shear, tearing, crushing and combined resistances for single and double lap joints, lap joints with an inside cover plate, and double and triple butt joints; least resistance, efficiency against P t St, seam load, 1.5 d edge distance | Machine elements: choosing a joining method |
| [Beam of Uniform Strength: Safe Load, Size and Outline](https://kevos.com/tools/uniform-strength-beam/) | P = S b h² ÷ 6l, S b h² ÷ 3l, S b h² l ÷ 6ac, 2 S b h² ÷ 3l and 4 S b h² ÷ 3l; solved for P, h or b; section at a point from the outline | Springs: torsion bars and flat springs (one rejected pairing) |
| [Surface Finish Change with Tool Nose Radius (Colding Rule)](https://kevos.com/tools/nose-radius-finish-change/) | Ra1 ÷ Ra2 = (r2 ÷ r1)^0.5 in finishing; roughing 1.5 × finishing; the geometric rule Ra ∝ 1 ÷ r for comparison; r for a target Ra | Machining: turning feed, depth and finish |

Categories:
- the alignment and jackbolt tools are in Maintenance
- the riveted joint tool is in Fasteners
- the beam tool is in Strength
- the nose radius tool is in Manufacturing

Units: all inputs are SI (mm, MPa, kN, µm). The jackbolt tool also takes inch threads by threads per inch. The handbook’s inch examples are reproduced by entering inches, because the alignment and joint formulas are linear.

Knowledge connections: 6 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the beam tool with the gear bending chapter: that chapter treats a gear tooth as a cantilever in the Lewis equation, and the tool sizes tapered beams and levers.

## Handbook values reproduced by the tests

- **Rim and face (Figs. 1a to 16a):**
  - the front and rear shims of every worked example, arrangements 1 to 16
  - the ten-foot motor of Fig. 17: 0.183, 0.098, −0.030, −0.144 and −0.300 in
  - the bracket sag rule: +0.006 in when zeroed at 12 o’clock
- **Jackbolts (p. 2632):**
  - 1/2-13: 0.0769 in per turn, 0.0192 in per square flat and 0.0128 in per hex flat
  - 5/8-11: 0.7040 turn (3 flats) at the front and 1.0011 turn (4 flats) at the rear
- **Riveted joints (p. 1731 Example 1):** 15,647 lb in shear, 18,750 lb in bearing, 19,688 lb in tearing, and an efficiency of 52.2 %.
- **Nose radius (p. 1144 Examples 1 and 2):** Ra1/Ra2 of 1.414 and 1.224, with finishing values 0.7 and 0.82 Ra1 and roughing values 1.05 and 1.23 Ra1.
- **Beams of uniform strength:** the formulas of Tables 3a and 3b. The handbook gives no worked example.

## Notes on the source

- **Arrangement signs:** the extracted formulas lose some minus signs. The signs of each arrangement were taken from its worked example, and every example is reproduced. They repeat in the pattern (−2, A), (−2, −A), (2, −A), (2, A) for arrangements 1–4, 5–8, 9–12 and 13–16.
- **Fig. 17, ten-foot motor:** the SF2 working prints 0.027 + (−0.156), but 0.032 × 8 ÷ 4.5 is 0.0569. The printed result, −0.030 in, is correct.
- **Arrangement 6:** the handbook notes that its diagram suggests removing shims at both feet, while the formula adds 0.005 in at the front. The tool follows the formula, as the handbook advises.
- **Nose radius examples:** the text writes "Ra2 = Ra1 × 1.414 = 0.7 Ra1"; it should read Ra1 ÷ 1.414. The roughing values 1.05 and 1.23 Ra1 come from the rounded 0.7 and 0.82.
- **Riveted joints:** the formula list defines d as the hole diameter but uses both d and D. The worked examples use the rivet diameter for shear and bearing and the hole diameter for tearing. The tool takes both diameters, so entering the same value in each uses the hole diameter throughout.
- **Riveted joints, Example 2:** the butt joint has 3 inner and 2 outer rivets in a 12-inch section, which does not repeat at one outer pitch, so it is not used as a test.

## Verification (on top of 0a7ec8b)

- `node scripts/tools/input-guides.mjs check --file handbook99`: 5 tools, 46 inputs, 0 problems.
- Calculator tests: 1,167/1,167, including five new tests. The first run failed because the riveted joint example's stresses in psi were above the MPa input limits. That test now enters them in ksi, which the linear formulas allow.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,418/1,418
  - post-build checks: 4,296 pages verified
- The first verify run failed in three test files. The rejected gear pairing used the chapter file name `bending` instead of its slug `tooth-bending-strength`; once corrected, all files passed.
- `npm run knowledge:check`: valid (844 published links). `npm run seo:validate`: passed. Inventory: 1025 tools, 8,889 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1025/1025 tools passed with 8,889 figures.
- The rim and face tool was also run in the browser with the ten-foot motor of Fig. 17 (arrangement 14). It gives 0.1834, 0.0981, −0.0299, −0.1437 and −0.3001 in, as the handbook does.
