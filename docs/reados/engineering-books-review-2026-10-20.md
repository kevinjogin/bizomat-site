# Engineering books: editorial and release review

Reviewed 20 October 2026 against `main` at `b135b748ae5b551c023e18a5ab84bd2d74e8cc53`.

Scope: two original authored books, 20 chapters and 22,355 chapter-body words. New Markdown content and this review documentation only. The owner explicitly requested publication in the final instruction of the task. Both books were first completed as drafts; the draft snapshot is preserved at GitHub commit `db1b3a5f3f00a2e63e97d97d9cdd0dd206d58d88`. Publication flags are a separate subsequent change.

## Audit and selection

See [the complete baseline inventory](engineering-books-inventory-2026-10-20.md): 55 existing books/guides, 768 chapters, eight subjects. The audit includes every chapter title and canonical route. Neither new book duplicates an existing collection or reuses existing chapter prose.

The Engineering and Manufacturing opportunities were selected for depth: a continuous dimensional-release case and a complete fixture-qualification case. General CAD introductions, broad automation surveys, business development and generic project-delivery primers would overlap substantially with existing publications.

## Fits That Work

**Tolerance budgets, measurement decisions and evidence for assembly release**

Category: Engineering · 10 chapters · 11,351 chapter-body words · Edition 1 · en-AU

Readers: Mechanical designers, manufacturing engineers, quality practitioners and technical leads who can read a drawing and need to connect dimensional decisions with assembly performance.

Learning outcomes:

- Translate an assembly function into a signed dimensional model with explicit operating conditions.
- Distinguish guaranteed dimensional bounds from statistical predictions and measurement uncertainty.
- Evaluate temperature, geometry, process shifts and measurement decisions before tightening tolerances.
- Prepare a traceable release record and identify changes that invalidate its evidence.

| Order | Chapter | Body words |
| ---: | --- | ---: |
| 1 | [Define the function before the tolerance](https://kevos.com/reados/publications/fits-that-work/define-the-function-before-the-tolerance/) | 1,253 |
| 2 | [Calculate the dimensional bounds](https://kevos.com/reados/publications/fits-that-work/calculate-the-dimensional-bounds/) | 1,167 |
| 3 | [Use statistics without losing the limits](https://kevos.com/reados/publications/fits-that-work/use-statistics-without-losing-the-limits/) | 1,094 |
| 4 | [Carry the stack through temperature](https://kevos.com/reados/publications/fits-that-work/carry-the-stack-through-temperature/) | 1,081 |
| 5 | [Connect size to datums and geometry](https://kevos.com/reados/publications/fits-that-work/connect-size-to-datums-and-geometry/) | 1,156 |
| 6 | [Make measurement and acceptance agree](https://kevos.com/reados/publications/fits-that-work/make-measurement-and-acceptance-agree/) | 1,094 |
| 7 | [Spend the tolerance budget deliberately](https://kevos.com/reados/publications/fits-that-work/spend-the-tolerance-budget-deliberately/) | 1,161 |
| 8 | [Make a pilot answer the right question](https://kevos.com/reados/publications/fits-that-work/make-a-pilot-answer-the-right-question/) | 1,020 |
| 9 | [Preserve the evidence when the design changes](https://kevos.com/reados/publications/fits-that-work/preserve-the-evidence-when-the-design-changes/) | 1,158 |
| 10 | [Assemble a defensible release decision](https://kevos.com/reados/publications/fits-that-work/assemble-a-defensible-release-decision/) | 1,167 |

### Source coverage

- *Machinery's Handbook, 29th edition* — Erik Oberg, Franklin D. Jones, Holbrook L. Horton and Henry H. Ryffel; Christopher J. McCauley, senior editor (2012). Industrial Press. Supplied reference examined selectively: contents, thermal-property context, allowances and tolerances, and measuring instruments. Printed pages 376, 629 and 675 are examples of the material consulted. Historical background only; no tables, artwork, fit values or prose reproduced.
- [Fundamental Good Practice in Dimensional Metrology, Good Practice Guide 80](https://eprintspublications.npl.co.uk/3360/1/mgpg80.pdf) — National Physical Laboratory (2005; online edition consulted). Reference for temperature effects and practical dimensional measurement. Chapter 4 uses independently chosen dimensions and explicitly assumed expansion coefficients.
- [Guidelines for Evaluating and Expressing the Uncertainty of NIST Measurement Results, Technical Note 1297](https://www.nist.gov/pml/nist-technical-note-1297) — Barry N. Taylor and Chris E. Kuyatt, NIST (1994). Sections 5 and 6 support the distinction between combined standard uncertainty and expanded uncertainty in Chapter 6. The numerical budget is original.
- [Evaluation of measurement data: The role of measurement uncertainty in conformity assessment, JCGM 106](https://www.bipm.org/en/doi/10.59161/jcgm106-2012) — Joint Committee for Guides in Metrology (2012). Background for agreeing a conformity decision rule and understanding guard bands. The book's interval-containment rule is an explicitly chosen teaching rule, not a claim of mandatory compliance.
- [What is Process Capability? NIST/SEMATECH e-Handbook, section 6.1.6](https://itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm) — NIST/SEMATECH (online handbook). Supports the limited capability discussion in Chapter 8, including the need for process stability and appropriate distribution assumptions.
- [Gauge R & R studies, NIST/SEMATECH e-Handbook, section 2.4](https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm) — NIST/SEMATECH (online handbook). Further study on separating measurement effects, operators and time. The small pilot in this book is deliberately not presented as a complete gauge R&R study.

## Fixtures That Repeat

**From locating decisions and load paths to a qualified production method**

Category: Manufacturing · 10 chapters · 11,004 chapter-body words · Edition 1 · en-AU

Readers: Manufacturing engineers, tool designers, machinists and production leads who need to turn a promising workholding concept into a documented, repeatable production method.

Learning outcomes:

- Separate locating, supporting and clamping functions and trace forces through a fixture.
- Check simplified reactions, friction and deflection while recognising the limits of each model.
- Plan access, changeover and trials that distinguish fixture behaviour from measurement error.
- Build an evidence-based release, wear response and spare-parts plan for a controlled fixture.

| Order | Chapter | Body words |
| ---: | --- | ---: |
| 1 | [Define the fixture as a production method](https://kevos.com/reados/publications/fixtures-that-repeat/define-the-fixture-as-a-production-method/) | 1,174 |
| 2 | [Locate the part without overconstraint](https://kevos.com/reados/publications/fixtures-that-repeat/locate-the-part-without-overconstraint/) | 1,097 |
| 3 | [Draw the load path before sizing the clamp](https://kevos.com/reados/publications/fixtures-that-repeat/draw-the-load-path-before-sizing-the-clamp/) | 1,073 |
| 4 | [Choose clamping force that reaches the part](https://kevos.com/reados/publications/fixtures-that-repeat/choose-clamping-force-that-reaches-the-part/) | 1,120 |
| 5 | [Control deflection as well as strength](https://kevos.com/reados/publications/fixtures-that-repeat/control-deflection-as-well-as-strength/) | 1,107 |
| 6 | [Make the toolpath and fixture agree](https://kevos.com/reados/publications/fixtures-that-repeat/make-the-toolpath-and-fixture-agree/) | 1,086 |
| 7 | [Separate fixture repeatability from measurement noise](https://kevos.com/reados/publications/fixtures-that-repeat/separate-fixture-repeatability-from-measurement-noise/) | 1,012 |
| 8 | [Make correct loading and changeover repeatable](https://kevos.com/reados/publications/fixtures-that-repeat/make-correct-loading-and-changeover-repeatable/) | 1,124 |
| 9 | [Control wear, spares and return to service](https://kevos.com/reados/publications/fixtures-that-repeat/control-wear-spares-and-return-to-service/) | 1,061 |
| 10 | [Qualify the fixture and the business case](https://kevos.com/reados/publications/fixtures-that-repeat/qualify-the-fixture-and-the-business-case/) | 1,150 |

### Source coverage

- *Machinery's Handbook, 29th edition* — Erik Oberg, Franklin D. Jones, Holbrook L. Horton and Henry H. Ryffel; Christopher J. McCauley, senior editor (2012). Industrial Press. Supplied reference reviewed selectively for the subject map, dimensional location and workshop measurement background. No fixture drawings, tables, machining recommendations or prose are reproduced.
- [Locating and Clamping Principles for Jig and Fixture Design](https://www.carrlane.com/engineering-resources/fixture-design-principles/locating-clamping-principles) — Carr Lane Manufacturing (current engineering resource). Reference for the distinction between locating and clamping, contact placement and directing loads into support. This book uses its own case, coordinates, equilibrium calculations and trial method.
- [Beam Displacements](https://ocw.mit.edu/courses/3-11-mechanics-of-materials-fall-1999/resources/mit3_11f99_bdisp/) — David Roylance, Massachusetts Institute of Technology (2000). The lecture note dated 30 November 2000 supplies a reference for the standard simply supported beam equation used in Chapter 5. No lecture illustrations or examples are reused.
- [Milling formulas and definitions](https://www.sandvik.coromant.com/en-gb/knowledge/machining-formulas-definitions/milling-formulas-definitions) — Sandvik Coromant (current technical reference). Reference for spindle-speed, table-feed and ideal machining-time relationships in Chapter 6. All chosen inputs are teaching assumptions, not recommended cutting data.
- [Gauge R & R studies, NIST/SEMATECH e-Handbook, section 2.4](https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm) — NIST/SEMATECH (online handbook). Supports distinguishing repeatability, reproducibility and other measurement effects. Chapter 7's short reload trial is not a formal measurement-system approval.
- [What is Process Capability? NIST/SEMATECH e-Handbook, section 6.1.6](https://itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm) — NIST/SEMATECH (online handbook). Further reading on why a short successful trial does not establish stable long-run capability.

## Technical and originality review

- Six reference entries per book: eight distinct primary web resources plus the supplied handbook. Web references were opened and checked. The handbook was reviewed selectively, not claimed to have been read cover to cover. It is the 29th edition (2012); historical background is distinguished from current requirements.
- All case dimensions, expansion coefficients, loads, datasets, costs and acceptance rules are explicitly labelled teaching assumptions. No client project, manufacturer endorsement or KEVOS result is asserted.
- [69 reproducible calculation checks](engineering-books-calculations-2026-10-20.py) pass using only Python standard-library arithmetic. Coverage includes dimensional/thermal corners, geometry, uncertainty, correlation, pilot statistics, fixture reactions, contact loss, friction, deflection, feed/time, wear and simple payback.
- All four Python examples embedded in the books execute successfully and reproduce their reported results. Exercises contain answers or explicit evaluation criteria.
- A normalised, contiguous 12-word comparison found no prose matches against 769 existing Markdown documents and the supplied handbook text after excluding fenced code and Markdown link destinations. This screening does not prove originality across all literature; the chapters, cases, exercises and tables were independently authored.
- Australian English reviewed, including CNC “program”, “centre”, “behaviour”, “aluminium” where relevant, units, decimal precision and consistent revision names. No unfinished placeholders or copied source artwork/tables.

### Technical limits kept visible

Fits That Work bounds the specified teaching assembly under its stated free-expansion, uniform-temperature and geometry assumptions. It explicitly rejects extending that conclusion to arbitrary gradients, coatings or unqualified processes. Fixtures That Repeat ends with a completed qualification decision that holds the fictional fixture pending unresolved deflection, operator and access evidence. That is the worked result, not an unfinished chapter or approval to build a real fixture. Neither book supplies certified production designs or replaces the applicable current standard and competent application review.

## Integration and visual review

- The current authored-book schema is used without modification: book status, chapter draft flags, explicit permanent slugs and contiguous chapter order 1–10.
- Existing automatic routes, contents, category links, breadcrumbs, previous/next navigation, canonical metadata, Book/Chapter JSON-LD, sitemap, Pagefind and assistant knowledge integration are retained.
- Existing `coverVariant: category` is reused. Fits That Work receives the orange Engineering geometry cover; Fixtures That Repeat receives the graphite Manufacturing factory cover. Both show the correct title and 10-chapter count. No global component, cover variant, CSS, font or branding file was edited for release.
- Local browser preview verified both book overviews, title wrapping, covers, light/dark themes, start-reading navigation, the chapter selector, the larger-text button and category placement. Desktop width was 1348 CSS pixels with no document-level horizontal overflow in the inspected views.
- Accessible cover names, labelled chapter controls, one H1, table headers and existing reduced-motion CSS were inspected. Responsive source rules retain the single-column book hero below 650 px, flexible reader controls and horizontally scrollable table/code containers.
- Verification limitation: this browser interface did not expose viewport/device emulation. Mobile layout and reduced-motion behaviour received source inspection, not a physical-device or emulated-mobile runtime test. This release changes content only and uses the existing reader.
- Preview used a temporary, local-only `terminal.local` development-host allowance. The original Astro configuration was restored byte-for-byte before the production build; the preview server was stopped.

## Build and preservation checks

- `npm ci` completed using the existing lockfile; no dependency changes.
- Baseline `npm run verify`: 95 tests passed, 0 errors, 0 warnings; 1,629 HTML pages verified; 769 Pagefind pages.
- Release `npm run verify`: 95 tests passed, 0 failed; Astro check 0 errors, 0 warnings (six pre-existing hints); 1,651 HTML pages verified; 791 Pagefind pages. The post-build validator checks metadata, H1 count, internal links, images and JSON-LD.
- A subsequent clean production build passed. Public output comparison adds exactly 22 authored HTML routes and updates the READOS catalogue, sitemap, assistant knowledge and search assets. All existing non-READOS HTML, CSS, fonts, logos, favicon outputs and Worker output match the baseline hashes.
- Local compiler staging under `dist/.prerender` remained after a build and was removed before comparing public outputs; it is generated intermediate material and is not committed. Cloudflare builds from committed source through the existing integration.
- Tracked build-generated icons were restored. Untracked generated PNG icons were not staged. Existing authored and edited books, WORKOS, REACHOS, global structure and the retired Insights redirects remain unchanged. Documentation is committed separately from content.

## Release gate and outstanding items

The manuscripts have no known unresolved editorial or arithmetic issues within their declared scope. This report records pre-release review; it does not by itself establish a live deployment. Before reporting publication, recheck the latest main commit, pass GitHub verification, merge only this batch, observe the existing Cloudflare build, and request every new public book/chapter URL. Check the existing home, services, about and READOS pages and branding assets as regression controls. The final delivery message should identify the release commit and the actually observed deployment result.

The mobile runtime verification limitation above remains explicit. A specialist review for a particular real application would require its actual requirements, materials, load data and equipment; this educational publication does not claim that review.
