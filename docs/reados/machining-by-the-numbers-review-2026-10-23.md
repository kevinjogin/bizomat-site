# Machining by the Numbers: editorial and release review

Reviewed 23 October 2026 against `main` at `0e86b64`. The owner explicitly approved publication.

**Speeds, feeds, power, tool life and cost for planning and quoting machined parts**

Category: Manufacturing · 11 chapters · 16,712 chapter-body words · 36 animated figures · Edition 1 · en-AU · cover: `category` variant (no new cover variant)

## Duplication check

The book was re-checked against the 20 October inventory (`engineering-books-inventory-2026-10-20.md`) and the two engineering books published since:

- **Machining and Metal Parts** (collection) explains processes and choices. This book is a continuous numerical case: one pump flange carried from cutting data to a priced quotation. It links to that collection instead of repeating it.
- **Fixtures That Repeat** covers workholding qualification. This book treats workholding only as an input to deflection and set-up time.
- **Fits That Work** covers tolerance budgets. It overlaps substantially with the draft *Tolerances That Work* written in the same task. For that reason the owner chose to **hold *Tolerances That Work* as an unpublished draft** (`status: draft`), so READOS does not carry two near-duplicate tolerance books.

## Chapters

| Order | Chapter | Body words | Figures |
| ---: | --- | ---: | ---: |
| 1 | [From drawing to cutting data](https://kevos.com/reados/publications/machining-by-the-numbers/from-drawing-to-cutting-data/) | 1,431 | 3 |
| 2 | [Cutting speed and spindle speed](https://kevos.com/reados/publications/machining-by-the-numbers/cutting-speed-and-spindle-speed/) | 1,427 | 4 |
| 3 | [Turning: feed, depth of cut, removal rate and surface finish](https://kevos.com/reados/publications/machining-by-the-numbers/turning-feed-depth-and-finish/) | 1,480 | 3 |
| 4 | [Milling: feed per tooth, chip thinning and feed rate](https://kevos.com/reados/publications/machining-by-the-numbers/milling-feed-and-chip-thinning/) | 1,485 | 3 |
| 5 | [Drilling, reaming and tapping calculations](https://kevos.com/reados/publications/machining-by-the-numbers/drilling-reaming-and-tapping/) | 1,580 | 3 |
| 6 | [Cutting force, power and torque](https://kevos.com/reados/publications/machining-by-the-numbers/cutting-force-power-and-torque/) | 1,625 | 3 |
| 7 | [Deflection, rigidity and chatter](https://kevos.com/reados/publications/machining-by-the-numbers/deflection-rigidity-and-chatter/) | 1,579 | 3 |
| 8 | [Tool life and the Taylor equation](https://kevos.com/reados/publications/machining-by-the-numbers/tool-life-and-the-taylor-equation/) | 1,338 | 3 |
| 9 | [Machining economics: choosing a cutting speed](https://kevos.com/reados/publications/machining-by-the-numbers/machining-economics-and-cutting-speed/) | 1,527 | 4 |
| 10 | [Estimating cycle time](https://kevos.com/reados/publications/machining-by-the-numbers/estimating-cycle-time/) | 1,547 | 3 |
| 11 | [Quoting a machined part](https://kevos.com/reados/publications/machining-by-the-numbers/quoting-a-machined-part/) | 1,693 | 4 |

## Editorial checks

- Every worked number was recomputed with scripted calculations: speeds, feeds, removal rates, power, deflection, the Taylor fit, minimum-cost speed, cycle time and quote. Each figure uses only numbers stated in its chapter.
- *Machinery's Handbook* (29th edition) was consulted only for its subject map and the standard relationships. No tables, cutting-data values, artwork or prose are reproduced. The illustrative cutting data is labelled as such, and readers are pointed to their tool supplier's data.
- Historical sources (Taylor 1907; Gilbert 1950) are cited for the tool-life and economics models, with ISO 3685 for tool-life testing.
- The book uses no client projects or claimed KEVOS results, and names no individual.
- `npm run verify` passes: type check, all tests and the production build.
