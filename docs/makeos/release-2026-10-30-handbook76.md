# WORKOS release: batch handbook76, 30 October 2026

Six tools for quality, reliability, maintenance, operations and fabrication, taking WORKOS from 914 to 920 tools. Approved for publication by the owner on 30 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Sources (all checkable): NIST/SEMATECH e-Handbook of Statistical Methods §6.3.2.2 (individuals control charts), §6.3.3.2 (proportions control charts) and §8.3.1.1 (exponential reliability tests); NIST Dataplot reference manual, *P Control Chart*; MathWorks, *Rolling Element Bearing Fault Diagnosis*; Randall and Antoni, *Mechanical Systems and Signal Processing* 25 (2) 485–520 (2011); Kleinrock, *Queueing Systems, Volume 1: Theory* (Wiley, 1975); Little, *Operations Research* 9 (3) 383–387 (1961); *Machinery’s Handbook*, 29th edition, pp. 1338–1339 (cutoff and parting: nesting blanks on the stock so scrap is avoided; the layout geometry in the tool is original). Not every tool cites the handbook, so the batch is in `TOOL_FILES` and the test `FILES` list but not in `HB_FILES`.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Bearing Defect Frequency Check](https://kevos.com/tools/bearing-defect-frequency-check/) | Maintenance | BPFO, BPFI, ball spin and cage frequencies from the bearing geometry; first three harmonics matched to a measured peak within a tolerance | Maintenance that prevents breakdowns; Selecting bearings and lubrication for reliable machines |
| [Individuals Control Chart Check](https://kevos.com/tools/individuals-chart-check/) | Quality | Mean ± 3 × average moving range ÷ 1.128 from up to 12 readings, points beyond the limits | Statistical process control on the shop floor |
| [p-Chart Check](https://kevos.com/tools/p-chart-check/) | Quality | p̄ ± 3√(p̄(1 − p̄)/n) for equal samples, lower limit held at zero, defective count that signals | Statistical process control on the shop floor |
| [Reliability Demonstration Test Plan](https://kevos.com/tools/reliability-demonstration-test/) | Maintenance | Test length = MTBF × ½χ²(confidence; 2(r + 1)), per unit and in calendar days | Qualification testing; How many units, and for how long |
| [Queue Wait Check](https://kevos.com/tools/queue-wait-check/) | Operations | M/M/c Erlang C chance of waiting, average wait and queue (Little’s law), servers needed for a target | Queues in the test lab |
| [Sheet Nesting Yield Check](https://kevos.com/tools/sheet-nesting-yield/) | Fabrication | Straight grids both ways and two-block layouts, utilisation, sheets for the order and material cost per blank | Material, blanks and nesting; Nesting the blanks and material yield; Strip layout and material yield; Material, nesting and mass; Checking, nesting and keeping patterns |

Knowledge connections: 12 approved and 7 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

Known limits and overlap, stated on the tool pages:

- The bearing frequencies assume no slip; the match tolerance allows for the 1–2 % slip of real bearings.
- The moving-range chart is not included, because its constant is not on the cited NIST page. The p chart assumes equal sample sizes. The reliability test assumes a constant failure rate.
- The nesting tool reports the best of the layouts it tries, not a full nesting search: an exhaustive guillotine search fits 46 blanks on the example sheet where the tool finds 45. `sheet-metal-part-cost` already counts parts per sheet on a straight grid as one step of costing a bent part; this tool covers nesting on its own. The owner approved it knowing of the overlap.

## Verification (on top of 15d3eb1)

- Independent hand-calculated reference values for every tool: closed forms, a Poisson-identity chi-square CDF, birth–death state probabilities for the queue and a separate two-block count. NIST’s published reliability test factors (2.30 for no failures at 90 %, 2.99 for one failure at 80 %) are reproduced exactly. Identity checks, pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook76`: 6 tools, 51 inputs, 0 problems. Inventory: 920 tools, 7,859 inputs, all covered.
- `npm run verify`: astro check 0 errors and 0 warnings; 1,181/1,181 tests; 3,746 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium 130 on the built site): 920/920 tools passed, 7,859 figures, including every tool on a 360 px phone screen.
