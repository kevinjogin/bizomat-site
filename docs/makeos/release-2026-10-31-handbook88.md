# WORKOS release: batch handbook88, 31 October 2026

One tool from the last buildable candidate of the Machinery’s Handbook page ledger, taking WORKOS from 977 to 978 tools (MAKEOS handbook tools 783 → 784). Requested by the owner ("Continue to keep making tools from the book and keep record of all pages scanned and completed"; "Start handbook88"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 31 October 2026 (bolt-grip-thread-length).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced. Thread lengths (LT, b, B), transition thread lengths (Y), clamped thickness and the engagement needed are always user inputs.

## Page ledger

| Pages | Before this batch | After |
|---|---|---|
| Cited by a live tool | 2,040 | 2,040 (2,046 once this batch is live) |
| Cited by a draft tool (handbook79 and handbook88) | 19 | 25 |
| Read by hand: tool possible, not yet built | 4 | 3 |
| Read by hand: nothing to build | 152 | 151 |
| No formula lines (tables, prose, figures) | 1,102 | 1,098 |
| Formula lines, not yet read | 0 | 0 |

The only candidate left is the planetary gear arrangements (Figs. 1–24, pp. 2212–2214). Which gears mesh in several figures can't be read reliably from the page images, so no tool is built.

## Tools

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Bolt and Screw Grip Length Check](https://kevos.com/tools/bolt-grip-thread-length/) | Fasteners | Socket head cap screws: LG = L − LT, LTT = LT + 5P, LB = L − LTT (BS 4168: Lg max = L − b, Ls min = Lg max − 5P). Metric bolts and screws: Lg max = L − B. Heavy hex structural bolts: LG max = L − LT, LB min = LG max − Y max, threaded full length when LB min ≤ 2.5P (to 1 in) or 3.5P (over 1 in). Joint check: clamped thickness against the grip length (the minimum design grip), and the length beyond the joint against the engagement or nut length needed | Machine elements and mechanical design: choosing fasteners and threads |

Knowledge connections: 1 approved and 2 rejected relationships, each with the chapter text and the tool it was checked against (`docs/knowledge-links-review.md`). Rejected pairs:

- **Bolted joints that stay tight:** that chapter covers preload, torque, fatigue and locking, not grip or body lengths.
- **Drilling, reaming and tapping:** that chapter specifies tapped hole and drill depths, not screw lengths.

## Tests

The rules are checked by closed form:

- the socket screw grip, total thread and body lengths, which agree with the BS 4168 form
- the metric grip gauging length
- the structural bolt body length
- the full-thread limits of 2.5P and 3.5P, either side of 1 in
- the pass, fail and invalid-input verdicts

The handbook gives no worked example for these rules.

## Notes on the source

- **Grip gauging length:** the handbook defines it as the minimum design grip, usable for checking thread availability when choosing a bolt length. The tool’s joint check uses it that way: the clamped thickness should be at least the grip length, so that the nut or tapped hole works on full thread.
- **Thread lengths:** LT, b, B and Y are reference dimensions from the standards’ tables. They step with length (for example over 125 mm and 200 mm), so the tool takes them as inputs.

## Verification (on top of b0cfc59, after rebasing over a READOS publish)

- `node scripts/tools/input-guides.mjs check --file handbook88`: 1 tool, 9 inputs, 0 problems. Inventory: 978 tools, 8,450 inputs, all covered.
- Calculator tests: 1,113/1,113.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1,261/1,261
  - post-build checks: 4,117 pages verified
- `npm run knowledge:check`: valid (738 relationships with main’s new links). `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 978/978 tools passed with 8,450 figures. The grip length tool was also opened and run in the browser.
