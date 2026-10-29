# WORKOS release: batch handbook73, 29 October 2026

Eight tools for project delivery, engineering business, factory operations, maintenance, quality and machining, taking WORKOS from 866 to 874 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Sources (all checkable; standards named by number and scope only): U.S. GAO, *GAO-20-195G Cost Estimating and Assessment Guide* (2020), chapters 17–19 on earned value; AS 4817-2006 (named only); Malcolm, Roseboom, Clark and Fazar, *Operations Research* 7 (5) 646–669 (1959) for PERT; Little, *Operations Research* 9 (3) 383–387 (1961) and Roser, *AllAboutLean* (2014) for Little’s law; Silver, Pyke and Thomas, *Inventory and Production Management in Supply Chains* (CRC Press) for the economic production quantity; NIST/SEMATECH e-Handbook §6.1.6 (capability confidence bounds) and §1.3.6.6.19 (Poisson distribution); *Machinery’s Handbook*, 29th edition, pp. 134–136 (nominal and effective interest) and pp. 1084–1101 (cutting force and power). Not every tool cites the handbook, so the batch is in `TOOL_FILES` and the test `FILES` list but not in `HB_FILES`. A planned kanban card count was dropped because no open source for the exact Toyota formula could be verified.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Earned Value Check](https://kevos.com/tools/earned-value-check/) | Projects | CV, SV, CPI, SPI, two estimates at completion, TCPI | Earned value: what it shows; Schedule compression and recovery |
| [PERT Schedule Check](https://kevos.com/tools/pert-schedule-check/) | Projects | Three-point estimates, path spread, normal probability of meeting the deadline | How confident is that finish date?; Critical path scheduling; The harvest deadline |
| [Early Payment Discount Check](https://kevos.com/tools/early-payment-discount-check/) | Money | Nominal and effective annual rate of forgoing a discount | When customers fund the business |
| [Economic Production Quantity Check](https://kevos.com/tools/economic-production-quantity/) | Inventory | Batch size with a finite production rate, run and cycle length, cost of the current batch | Cutting lead time with flow and pull; Quoting a machined part |
| [WIP and Lead Time Check](https://kevos.com/tools/wip-lead-time-check/) | Operations | Little’s law, flow efficiency, WIP limit for a target | Cutting lead time with flow and pull |
| [Critical Spares Plan](https://kevos.com/tools/critical-spares-poisson-plan/) | Maintenance | Poisson failures over the lead time, spares for a service level | Maintenance that prevents breakdowns |
| [Capability Confidence Check](https://kevos.com/tools/capability-confidence-check/) | Quality | Lower confidence bounds on Cp and Cpk, sample size to prove | Proving a process is ready for production |
| [Parting-Off Plan](https://kevos.com/tools/parting-off-plan/) | Manufacturing | Constant surface speed to the spindle limit, cutting force and power, integrated parting time | none |

Knowledge connections: 11 approved and 7 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

## Verification (after rebasing on ea9284b)

- Independent hand-calculated reference values for every tool (closed forms, Simpson integration of the normal and chi-square densities, direct Poisson sums and a numerical integration of the parting time), identity checks, pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook73`: 8 tools, 65 inputs, 0 problems. Inventory: 874 tools, 7,415 inputs, all covered.
- `npm run verify`: astro check 0 errors and 0 warnings; 1,104/1,104 tests; 3,700 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium 130 on the built site): 874/874 tools passed, 7,415 figures, including every tool on a 360 px phone screen.
