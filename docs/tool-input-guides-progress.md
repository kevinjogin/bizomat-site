# WORKOS input guides: progress and implementation report

Status on 29 October 2026, branch `claude/loving-mccarthy-oubwh2` (not merged to `main`, not deployed).

Every input of every WORKOS tool now has a "What this means" panel under it, with a small animated SVG figure. The figure shows the field's own label, its symbol and the value typed in the input, and follows that value while the user types.

## Result

| Measure | Count |
|---|---|
| Tools expected (register in `public/tools/data-*.js`) | 837 |
| Tools inspected and updated | 837 (no duplicates, aliases or unavailable tools; ids are unique) |
| Input fields identified (form headings excluded) | 7,049 (plus 466 headings, which are not inputs) |
| Fields with a verified, field-specific explanation | 7,049 |
| Documented exceptions (meaning could not be established) | 0 |
| Fields with an illustration | 7,049: 6,525 domain figures, 352 option-list figures (select inputs), 172 number-line figures (plain numbers with no better picture) |
| Fields with an "effect on the result" line checked against the calc | 3,949 |
| Fields with a "get it right" tip | 5,726 |
| Tools passing the browser sweep | 837 of 837 |
| Static tool pages carrying the same guides | 827 (`/tools/<id>/`, the tools whose guide stands alone) |

Field-level detail for every tool is in `docs/tool-input-guides-inventory.json`. Browser results are in `docs/tool-input-guides-browser.json`.

## What was built

- **`public/tools/input-guides.js`**: the shared renderer. It builds each guide as a native `<details>` element, so it opens by keyboard and works with screen readers without extra scripting. It has 55 figure kinds (length, diameter, thread, angle, stress, torque, pressure gauge, flow, feed, percent bar, slider score, option list and others) and keeps each figure in step with its input. The units and accepted range ("Units and format") and the worked example ("Example") are generated from the field definition itself, so they cannot drift from the form. Bounds of 10⁹ or more are treated as "no practical limit".
- **`public/tools/inputs-<file>.js`** (78 files, one per tool file): the words for each field. These are `what` (a plain-language definition), `tip` (the likely mistake), `effect` (how the value moves the result, only where verified in the calc), `fig` (the figure kind) and `sym` (the symbol used by the method).
- **`public/tools/ui.js`**: renders the guide under each input. Each input is now described (`aria-describedby`) by its source hint and its definition, and the figures resync after "Reset to examples" and shared links. Calculation, validation, sensitivity, reports and sharing are unchanged.
- **`src/pages/tools/[tool].astro`**: the same guides rendered at build time on the static tool pages, in a "What each input means" card. They show the worked example rather than a typed value.
- **`src/styles/tools.css`**: panel and figure styles from the existing tokens, in both themes. Motion runs only under `prefers-reduced-motion: no-preference`, and only while a guide is open. Guides are left out of printed results. Figures have a fixed aspect ratio, so opening one causes no layout shift.
- **`src/utils/workos-tools.ts`**: loads the inputs files and the renderer at build time.

## Checks and how to run them

| Check | Command | Result |
|---|---|---|
| Coverage check (every field covered, not generic, not a repeated label, no placeholder, valid figure) | `node scripts/tools/input-guides.mjs check` | 837 tools complete, 0 problems |
| Inventory | `node scripts/tools/input-guides.mjs inventory` | writes `docs/tool-input-guides-inventory.json` |
| Unit tests | `node --test tests/tool-input-guides.test.ts` | 11/11 pass. They check that every guide renders and names its input; titles and descriptions exist; SVG markup is well formed with no inline style; every figure kind renders; units, range and example text; figures follow the value; results are byte-identical for all 837 tools with and without the guides; the form integration; and the reduced-motion and print rules |
| Full verification | `npm run verify` | astro check 0 errors and 0 warnings; 1,018/1,018 tests; 3,566 pages built and verified by the postbuild checks |
| Browser sweep (needs a static server on `dist/`, for example `cd dist && python3 -m http.server 4322`) | `node scripts/tools/input-guides-browser.mjs http://127.0.0.1:4322` | 837/837 tools: every input has its guide and definition; all 7,049 figures draw inside their box; each figure follows a typed value; every tool still shows a result; no console errors. On 14 sampled tools, Enter opens and closes the guide, a 360 px screen has no sideways scroll, and reduced motion stops all figure animation |

Three existing tests needed nothing more than markup order and wording. `aria-describedby` sits before `name` on selects, and five tips no longer begin with "Free air", because an existing test keeps tier wording out of `public/tools/`. No existing test was weakened.

## How the explanations were written and checked

The words were written file by file, with the calc code as the authority. Agents worked from a fixed brief: read the calculation for every tool, never invent formulas, constants, material properties, recommended values or prices, and use `unclear` instead of guessing. Every file had to pass the coverage check.

Spot checks against the calculations:
- the project-gate weights;
- the turning-power proportionalities;
- the Lewis factor;
- `change-gears`;
- the y-coordinate ranges.

An audit of every number in the text found only:
- definitional conversions (25.4 mm per inch, 1.01325 bar per atmosphere, 9.80665 kN per tonne);
- worked unit examples;
- thresholds quoted from the tools' own formulas.

One tip was wrong and has been corrected. The handbook50 Lewis form factor tip warned against the π-included factor, which is the one the formula uses (σ = F ÷ (b m Y), with Y = π y).

Fifteen batches stopped at a usage limit before their final report: makeos, workshop, handbook3–5, 7–18, 21–24, 27–28, 32–49. Their files pass every check above, but no notes on possible tool issues were collected for those tools.

## Tool issues found (formulas and tools not changed: owner decisions)

These came to light while reading the calculations. None of them was changed, because the task preserves existing calculations. Each affected guide entry describes what the code actually does.

1. **`change-gears.fixed` (handbook6)**: the label ("spindle to stud, :1") and the guide ("fixed reduction") read as a reduction. The calc divides the required ratio by it as stud turns per spindle turn, so a 2:1 reduction must be entered as 0.5. A user who types 2 gets gears for a lead four times too large. Align the label and guide with the code, or invert the calc.
2. **`bend-feasibility-check.R` (handbook58)**: the label and guide say it is the finished inside radius. The calc treats it as the radius formed before springback (Rf = R ÷ ratio, limits checked against R).
3. **`wood-moisture-density.G` (handbook20)**: the guide describes G on a volume-at-moisture basis. The formula ρ = 1000 G (1 + M/100) ÷ (1 + 0.009 G M) is the oven-dry-volume form. Check against the source.
4. **`internal-gear.form` (handbook20)**: only changes the minimum tooth-difference check. Diameters and arc tooth thickness always use 20° full-depth rules.
5. **`equipment-finance-plan` (handbook52)**: double-declining-balance depreciation never switches to straight line, so it may not reach the salvage value at end of life.
6. **Inputs collected but never used:**
   - `retention-selector.dia`;
   - `outdoor-cabinet-wind-tipping.hcg`;
   - `conveyor-takeup-plan.D` (`eta` and `marg` there only change a motor power value that is not displayed).
7. **Limits that cannot be entered:**
   - `retention-selector.maxTempA/B/C` cannot take a rating at or below 0 °C (0 means "not supplied");
   - `uniform-acceleration` cannot take an upward initial velocity in fall mode.
8. **Description promises more than the calc does:** `cone-clutch-engagement` mentions "engagements per hour"; the calc only gives a verify check.
9. **Hard-coded limit, against the rule that users supply limits:** `moulded-part-cost` shot-size window of 20–80 %.
10. **Inconsistent rounding:** `years` is rounded in `business-case` and `buy-lease`, but used as typed in `build-buy-software`.
11. **Label or display details:**
    - `chain-conveyor-sizing.L` is horizontal length;
    - `crank-press-capacity.Ef` and `coolant-system-sizing.nz` treat 0 as "skip" without saying so in the label;
    - `prony-brake` key `tare` holds the loaded reading;
    - `viscosity-units` rounds 37.8 °C to 40 °C in an option label;
    - `pipe-bend-thrust-check` and `spring-clamp-hydraulic-release` print one value without its unit;
    - `thread-engagement` guide method text shows a stray `n`;
    - `compression-spring-designer` has a no-op line.

Many tools ignore some inputs in some modes by design. The guide entries say which mode uses each field.

## Known limitations

- **Page weight:** the 78 inputs files add 2.0 MB (496 KB gzipped) and the renderer 43 KB (14 KB gzipped) to `/tools/`. That page already loads 6.1 MB (1.26 MB gzipped) of tool scripts up front, so this is about 40 % more transfer. They load up front because basic explanations must not need a network request. The alternative is to load a tool's inputs file when the tool opens: one cached request of about 25 KB.
- **Figures are parametrised primitives:** 55 kinds, each labelled with the field's own name, symbol and value; they are not 7,049 bespoke drawings. The select inputs (352) show the option list, and 172 plain numbers (statistical means, equation coefficients) show a number line.
- **Browsers tested:** the browser sweep ran in Chromium only.
- **Not live:** nothing is merged or deployed. Per `CLAUDE.md`, publish by merging a verified commit to `main`, then check the public tool pages.

## Next steps

1. Owner review of the tool issues above, especially items 1 to 3, which can produce wrong inputs or answers.
2. Decide whether to keep up-front loading or switch to loading per tool.
3. Optional: a second-opinion review of the files from the 15 batches written without a final agent report, focused on tool issues.
4. Merge to `main` through a pull request, let Cloudflare deploy, then check `/tools/`, several `/tools/?tool=…` links and several `/tools/<id>/` pages on kevos.com.
