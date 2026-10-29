# READOS ↔ WORKOS knowledge connections

One relationship file connects READOS books and WORKOS tools in both directions: **Learn → Apply → Verify → Improve**.

- READOS book and chapter pages show **Apply This in Practice** (tools that apply or illustrate the reading) and **Related Tools and Examples** (tools useful alongside it).
- WORKOS tool pages (`/tools/<id>/`) and the calculator (`/tools/?tool=<id>`) show **Learn the Concepts Behind This Tool**.
- Learning pathways appear on the book where they start and on the tool they apply.

A relationship is stored once and shown on both sides. There are no lists in book or tool files to keep in step.

## Files

| File | Role |
|---|---|
| `src/data/knowledge-links.json` | **Source of truth.** Every approved, rejected (and, optionally, suggested) relationship. |
| `src/data/learning-pathways.json` | Guided pathways, each built on an approved relationship. |
| `src/data/knowledge-link-suggestions.json` | Generated leads for review (`npm run knowledge:suggest`). **Never published.** |
| `src/utils/knowledge.ts` | Reads both catalogues from source, validates, builds both directions and the pathways. The build stops on invalid data. |
| `src/components/knowledge/*.astro` | `ApplyInPractice`, `LearnConcepts`, `LearningPathway`. |
| `src/pages/tools/knowledge.json.ts` | `/tools/knowledge.json`, the readings per tool for the calculator (`public/tools/ui.js`). |
| `scripts/knowledge/check.mjs`, `scripts/knowledge/suggest.mjs` | `npm run knowledge:check [-- --report]`, `npm run knowledge:suggest`. |
| `docs/knowledge-links-review.md` | Generated list of items for human review. |
| `tests/knowledge-links.test.ts` | Validity, both directions, duplicates, unapproved links hidden, author links in sync, routes, pathways, calculator. |

## Relationship format

```json
{
  "reados": "publication/sheet-metal-parts-by-the-numbers",
  "chapter": "neutral-axis-k-factor-and-bend-allowance",
  "tool": "bend-allowance",
  "type": "applies",
  "note": "Gives bend allowance, setback and deduction for any bend from a K-factor you supply.",
  "status": "approved",
  "evidence": "book-link"
}
```

| Field | Required | Meaning |
|---|---|---|
| `reados` | yes | `publication/<folder in src/content/reados-publications>` or `collection/<slug in src/utils/reados-collections.ts>`. Stable ids, never titles. |
| `chapter` | no | A publication chapter's `chapterSlug`, or a collection chapter's file slug. Use it whenever one chapter covers the tool; the link then also shows on that chapter page. |
| `tool` | yes | A WORKOS tool `id` from `public/tools/data-*.js`. |
| `type` | yes | `explains` (the reading explains the concept behind the tool), `applies` (the tool applies the reading's method), `example` (the tool is a worked example of the concept), `complements` (useful together). The first three show under *Apply This in Practice*, `complements` under *Related Tools and Examples*. |
| `note` | yes | 20–260 characters, shown on READOS pages: what the tool does for this reading. Describe the tool accurately; never claim it calculates something it does not. |
| `learn` | no | 20–260 characters, shown on WORKOS pages. Defaults to the chapter's (or book's) description. |
| `status` | yes | `approved` (published), `suggested` (kept for later, not published), `rejected` (not published, and not suggested again). |
| `evidence` | yes | `book-link` (the author links the tool in the book's text) or `review` (an editor checked both items). |
| `reason` | for `review` | What was checked, for example "Chapter explains NPSH and cavitation; tool checks NPSH available". |
| `order` | no | Whole number; lower shows first. Otherwise: explains, applies, example, complements, then A–Z. |

Only `approved` links between **published** pages appear. A link to a draft book or chapter is kept but hidden until it is published.

## How to

- **Add a relationship.** Check the chapter text and the tool's calculation. Add an entry with `status: "approved"`, the right `evidence`, a `note`, and (for `review`) a `reason`. Then run `npm run knowledge:check`.
- **When an author links a tool in a book** (`[Bend allowance](/tools/bend-allowance/)`), add an `approved` entry with `evidence: "book-link"` for that book, the chapter and the tool. `tests/knowledge-links.test.ts` fails until you do, so the data cannot drift from the books.
- **Approve a suggestion.** Copy the pair from `knowledge-link-suggestions.json` (or `docs/knowledge-links-review.md`) into `knowledge-links.json`. Write your own `note` and `reason`; the score and matched terms are not evidence.
- **Reject a suggestion.** Add it with `status: "rejected"` and a `reason`, so it is not suggested again.
- **Edit.** Change `note`, `learn`, `type` or `order` in place.
- **Remove.** Delete the entry. If a pathway uses it, remove or change the pathway too: the check reports this.
- **Refresh suggestions.** Run `npm run knowledge:suggest` (options: `-- --per-book 6 --min 0.12`), then `npm run knowledge:check -- --report`.
- **Add a pathway.** Add an entry to `learning-pathways.json` with `id`, `title`, `summary`, `learn` (`reados` and `chapter`), `apply` (`tool`) and optional `next` (`reados` and `chapter`). Learn → apply must be an approved relationship. Verify and Improve are built from the tool's own checks, stated limitations, report and share features; nothing is saved for the reader.

After any change: `npm run knowledge:check`, then `npm run verify`. Publishing is the normal route: a verified commit merged to `main` (see `CLAUDE.md`). No environment variables are needed.

## How suggestions are made

`scripts/knowledge/suggest.mjs` compares each published READOS book with each WORKOS tool using TF-IDF cosine similarity. For a book it uses the title, subtitle, description and chapter titles and descriptions; for a tool, the name, question, description, keywords, category and guide purpose and uses. A pair scores by the whole book or by its best chapter, whichever is higher.

- It keeps up to 6 tools per book scoring 0.12 or more.
- It flags `weak match` below 0.22, and `no clear chapter`.
- It records the matched terms, and skips pairs already decided.

It reads metadata only, not chapter text, so word coincidences happen. For example, "letters of intent" matched a letter drill-size table. Every suggestion therefore needs a human decision.

## Taxonomy

No new taxonomy was added. READOS keeps its eight categories and controlled tags (`src/config/taxonomy.ts`); WORKOS keeps its 27 categories in nine topics (`src/utils/workos-topics.ts`). The only cross-mapping, `DISCOVERY_TOPIC` in `src/utils/knowledge.ts`, picks the WORKOS topic offered on a book with no connections:

| READOS category | WORKOS topic |
|---|---|
| Engineering | Engineering & Design |
| Manufacturing, Operations | Manufacturing & Production |
| Projects | Projects & Improvement |
| Business | Business & Commercial |
| Products, Technology, Ideas | none (no topic fits well enough) |

## Known points for the owner

- *First-of-a-Kind Technology by the Numbers*, chapter "Contingency that grows with novelty", says the Contingency Allowance tool "performs the same comparison of an estimate against its percentiles". The tool actually gives a screening contingency from ratings of uncertainty, complexity and risk. The relationship is kept as `complements` with an accurate note; the book sentence needs an editorial check.
- `/reados/books/<volume>/` category volume pages (which point their canonical address at the collections) do not show connections; the collection pages do.
