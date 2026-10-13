# Win Work You Can Deliver: editorial and source record

Baseline: c4665b64251951bb13b04b0daed067a881b24e1f. Prepared 13 October 2026. Owner authorises an original book, supporting authored-publication mechanism, PR, tested merge and publication. Scope excludes unrelated audit fixes and the three books in the older KEVOS-BOOKS worktree.

## Sources actually examined

- Charlie Pidcock, *Managing Your Opportunities* (file named Managing-Your-Opportunities-Workbook.pdf). Nineteen pages, all text extracted and all pages visually reviewed. Author identity is visible in the cover/footer branding and closing biography. Publisher/edition/publication year are not stated. PDF creation metadata is September 2024; that is not proof of publication year. No open licence or reproduction permission found. Treat as copyrighted. It is a workshop workbook: action planning, sales opportunities, preparation, communication, questions, listening, conversion and customer relationships, mostly blank prompts. It does not supply the missing percentages, frameworks or instructor commentary. Those are not reconstructed. No artwork, quotations, worksheet designs or distinctive named rules are reused.
- *How To Start Your Own Online Business.pdf*: file found, but EBX security handler prevents normal extraction/rendering. No text read; author, publisher, date and licence unverified. Not a substantive source. Owner explicitly authorised proceeding with the readable workbook and verified public references. Do not cite it as consulted or attempt protection removal.
- Authoritative public references: business.gov.au on market research, quotes and cash-flow statements; ACMA on electronic marketing; ACCC on truthful claims and consumer guarantees; OAIC on small-business privacy; Australian Cyber Security Centre on small-business security. Links and claim locations appear in the manuscript/bibliography. Accessed 13 October 2026. Legal statements are limited, qualified and linked to current regulators; no individual legal advice.

## Blueprint and overlap decision

Title: **Win Work You Can Deliver**. Subtitle: **A practical guide to enquiries, viable offers and customer commitments**. Primary category Business. Tags sales, customers, operations, finance, validation. Reader: owner-operators, small service businesses and first-time sales leads; beginner to intermediate. Excludes enterprise sales certification, neuroscience claims, tax advice, contract drafting and promises of guaranteed income.

The archive already covers individual sales skills and contains two automatically grouped Sales, Marketing and Customer Decisions volumes. This authored book adds a sequenced operating method joining evidence, capacity, contribution, cash timing and delivery. It is not a rewrite or compilation of those articles. Use an original fictional business, Fieldnote Studio, that prepares customer-facing service documents. No invented KEVOS clients or results.

| Chapter | Learning goal | Original exercise/example |
|---|---|---|
| 1. Decide which work deserves a yes | Define a viable opportunity across customer outcome and supplier constraints | Accept/decline conditions and an opportunity decision note |
| 2. Test a customer problem before building an offer | Separate observations, assumptions and commitments | Interview record and bounded pilot hypothesis |
| 3. Build a route to enquiries you can maintain | Compare acquisition channels by useful evidence and cost | Two-channel test with matched qualification definitions |
| 4. Turn a conversation into a decision record | Discover requirements without manipulating the buyer | Correctable meeting summary and evidence gaps |
| 5. Price the promise, including the work around it | Calculate contribution, capacity and cash exposure | A$3,600 package, A$2,640 cost, timing and downside checks |
| 6. Make the offer easy to assess | Define outputs, boundaries, acceptance and changes | A bounded option comparison and quote review |
| 7. Run a pipeline that tells the truth | Distinguish status, forecast and committed work | Cohort conversion, ageing and scenario cash expectations |
| 8. Carry the promise into delivery | Transfer customer context and control changes | Handover record and an extra-revision decision |
| 9. Earn the next conversation | Respond to outcomes, failures and appropriate follow-up | Evidence-based review and proportionate service recovery |
| 10. Put the system to work in thirty days | Build a repeatable review habit with few tools | Four-week implementation and a completed decision example |

## Claim and originality controls

The workbook motivates the importance of learning, communication and follow-through. It is not evidence for any neurological mechanism, conversion percentage or prescribed funnel stage. Chapter structure, case, numerical examples, tables and decision records are original KEVOS editorial work. Do not replicate its identify/qualify/satisfy/solidify architecture, quotes, diagrams, 12×12 rule or unnamed blanks.

Regulator-derived summaries should remain short and narrowly cited. Most content consists of original practical reasoning and explicitly hypothetical examples. Arithmetic must be tested independently. Examples exclude GST unless expressly stated; analytical owner-time cost is distinguished from cash outflow. Contribution is not net profit; pipeline probability is not a payment commitment. Avoid inferred legal exemptions and universal benchmarks.

## Integration decision

Use new validated Astro collections for authored book metadata and chapter Markdown. Route them under `/reados/publications/<book>/<chapter>/` to avoid the existing `/reados/books/` generator. One source file per chapter; one canonical route and Pagefind body per chapter. Stable explicit chapter slugs and numeric order, independent of alphabetical collection sorting. Reuse the shared animated cover with an optional book-specific opportunity-path motif. Existing Insights and auto-collections remain unchanged.

## Review record

The ten completed chapters contain approximately 10,817 whitespace-delimited words, excluding frontmatter and the separate introduction/bibliography. Reviewed for chapter progression, case continuity, assumptions, limitations and unsupported claims. Numerical scenarios cover channel effort, contribution and discount sensitivity, capacity, payment timing, conversion denominators and repeat-purchase eligibility; arithmetic is independently checked in `tests/publications.test.ts`.

All source material remains outside the website repository. A twelve-word normalised phrase comparison found no matches between the manuscript and the workbook extraction or the existing Insights corpus. This is a supplementary overlap check, not proof of rights or a substitute for editorial review. The structure, case, worksheets and explanations are independently authored; no workbook quotations or illustrations are reproduced. The protected second source is excluded with the owner's approval.

The security reference was updated to the accessible official January 2025 PDF after HTML guidance addresses failed direct retrieval. Only the guide's basic security recommendations are summarised; its case studies and graphics are not reused. Eight public primary references plus the workbook are listed in the book bibliography.

Local QA: dependency installation succeeded; `npm run verify` passed 45 tests with 0 Astro errors, 0 warnings and 8 existing hints. Build generated 2,307 pages, with 1,933 Pagefind entries; metadata, H1, link, image, JSON-LD and CSP postbuild checks passed. Existing dependency audit reports four high advisories; no dependencies were added or upgraded in this publication change. The existing Markdown configuration deprecation remains outside scope.

Browser review at desktop and 390-pixel mobile viewport confirmed the cover, dark/light themes, readable chapter layout, no horizontal page overflow, table wrapping, chapter selector and larger-text control (19.84 to 22.4 pixels at the desktop test size). Search for the unique fictional case returned exactly the book and its ten chapters; title search ranked the book first. Previous/next links, final references and catalogue placement are checked as part of release QA. Cover animations retain the existing reduced-motion CSS rule; no browser preference-emulation facility was available for a separate reduced-motion runtime test.

Publication status must be established from the PR, production deployment and public URL checks. This editorial record alone is not proof of release.

The Cloudflare branch build successfully generated and verified all 2,307 pages, then failed its configured `npx wrangler preview` step because the repository lacked a `previews` block. The owner's supplied build log established the cause. Add the explicit `[previews.ai]` binding supported by Wrangler 4.147.0; production configuration remains unchanged. [Cloudflare Preview configuration](https://developers.cloudflare.com/workers/previews/configuration/) keeps assets and compatibility settings at the top level while preview bindings are explicit. Branch previews are public unless separately access-controlled; this release contains only publication-ready website content. No second production Worker or manual production deployment is required by this fix.
