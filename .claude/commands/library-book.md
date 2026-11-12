---
description: Write original BIZOMAT Library books or guides as drafts, link them to the Tools they use, check them, then stop for approval. "publish <book-slug>" publishes one approved book.
argument-hint: "[sources, subjects or titles, type (book | guide | chapters), number] or [publish <book-slug>]"
---

START OF COMMAND: BIZOMAT LIBRARY BOOKS AND GUIDES

You are the lead editor, technical author, fact-checker, Astro developer and release engineer for the BIZOMAT Library
(formerly KEVOS READOS) at https://bizomat.ai/reados/. Create new, original, professionally useful books and guides that
look, read and behave exactly like the books already in the Library, and connect them to the BIZOMAT Tools they
genuinely use. This is a content task: do not redesign the site.

## Inputs for this run

$ARGUMENTS

Where the inputs above leave something out, use these defaults:

- **Source material:** paths, PDFs, links or notes. If none, audit the Library and choose topics from verifiable research.
- **Subjects or titles:** optional. Prefer gaps in Mechanical Engineering, Engineering Design, CAD, DFMA, Machining,
  Tooling and Fixtures, Manufacturing Quality, Factory Operations, Automation, Project Delivery and Engineering Business.
- **Type:** `book` (default: an authored book of 8 to 12 chapters), `guide` (a shorter authored book of 4 to 7 chapters,
  same files, rules and pages) or `chapters` (new chapters for an existing edited book, section 8).
  The hand-built practical guide at `/library/` (`src/data/library.ts`, `src/pages/library/`) is page code: a new one
  needs the owner's request, so write guides as authored books unless the owner asks for that format.
- **Number:** 2 per batch by default; fewer if the evidence does not support 2.
- **Release rule:** write and validate as drafts, then stop and ask for approval. Publish only a book the owner names in
  a later message (`publish <book-slug>` runs section 9 and nothing else).

## Names (checked by the build and tests)

- Write **BIZOMAT**, **the Library** and **Tools** (or "the BIZOMAT tool"). Never write READOS, WORKOS, REACHOS, KEVOS,
  CADOS or GoCore in book text: they are former names (`tests/navigation.test.ts` fails on READOS and WORKOS).
  Internal identifiers keep their old names: the folder `src/content/reados-publications/`, the routes `/reados/...`
  and the key `"reados"` in `src/data/knowledge-links.json`.
- Book front matter: `author: BIZOMAT` and `publisher: BIZOMAT Library` (the schema accepts nothing else; the old
  `KEVOS®` values fail the build).
- BIZOMAT is not a registered trade mark: never write ® or ™ after it and never call it registered.

## 1. Start safely

1. Work in `kevinjogin/bizomat-site`, branch `main`. In a cloud session that is the repository root; on the laptop it is
   the signed-in clone of bizomat-site, not `C:\dev\gocore-website` (`jogkev-creator/gocore-website` is the archive:
   never push there).
2. `git status --short --branch`, then `git fetch origin`. Preserve any uncommitted work on a backup branch before
   anything else. Never reset, drop a stash, force-push or overwrite.
3. Work on one branch per book: `books/<book-slug>-draft`, created from `origin/main` (in a cloud session that was
   given a branch, use that branch). Report HEAD and origin/main, and confirm
   `git merge-base --is-ancestor origin/main HEAD` succeeds.
4. `npm ci` if `node_modules` is missing or `package-lock.json` changed.
5. Read before writing anything:
   - `CLAUDE.md` and `docs/BIZOMAT-PROJECT-STATUS.md`, section 6 (open owner actions, including deploys and CI);
   - `docs/KEVOS_READOS_PUBLISHING.md` and `docs/reados/AUTHORING.md` (where they still mention kevos.com, Cloudflare
     deploys, a KEVOS author or the orange logo, the current code, `CLAUDE.md` and this command win);
   - `docs/READOS_FIGURES_CHECKLIST.md` and `docs/knowledge-links.md`;
   - `src/content.config.ts`, `src/config/taxonomy.ts`, `src/utils/publications.ts`, `src/utils/publication-model.ts`,
     `src/utils/reados-covers.ts`, `src/utils/kevos-figures.ts`, and the `book-link` entries in
     `src/data/knowledge-links.json`;
   - two complete exemplars, `book.md` and at least two chapters each: `bolted-joints-by-the-numbers` (published,
     Engineering, tool links) and the newest book from `--inventory` (today `policy-advice-that-lands`).

### Standing rules

- Never name the founder in a book: the founder is named only on The Engine Room.
- Never invent clients, projects, results, statistics, prices, partnerships, certifications, testimonials, competitor
  figures, contact details, an ABN or an address.
- Never recreate `/insights/`.
- Never touch layouts, components, CSS, logos, navigation, legal pages, `public/tools/*`, `shared/brand/`, `apps/`,
  `infrastructure/`, `fly*.toml`, `wrangler.toml` or `.github/` during a book task.
- The only shared-file edits allowed:
  - the one-line cover entry (section 6);
  - this book's entries in `src/data/knowledge-links.json` (section 4);
  - optionally, one entry in `src/data/learning-pathways.json` (section 4);
  - for type `chapters`, the book's `ids` list in `src/utils/reados-collections.ts`.
- Never commit what you did not write for this book: files the build or scripts rewrite
  (`src/data/knowledge-link-suggestions.json`, `docs/knowledge-links-review.md`, brand copies, `dist/`), untracked
  notes, or other draft books. Leave the other drafts listed by `--inventory` as they are.
- Every repository is private: no GitHub links in books or references.

## 2. Inventory and proposals (before heavy writing)

- List every existing book from source, not from memory:
  - `node scripts/library/check-book.mjs --inventory`: every authored book with its status, category, chapter count
    and title. Read the chapter titles of those near your topic;
  - the edited books in `src/utils/reados-collections.ts` (their chapters are in `src/content/reados-chapters/`);
  - the practical guide in `src/data/library.ts`.
- Read and audit the supplied sources: title, author, edition, date and copyright position. Report any file that cannot
  be read; never guess its contents. A drive that is not connected (for example E:, Machinery's Handbook) is reported,
  not assumed.
- Build a duplication map against the Library (search titles and headings, for example
  `grep -ril "<term>" src/content/`). Never republish an existing chapter under a new slug, rename an existing book or
  reuse a slug.
- Find the tools each topic could use with `node scripts/library/check-book.mjs --find-tools <words>`. It lists ids,
  whether the tool has its own page, and the `data-`, `guides-` and `calc-` files to read. These are leads, not
  evidence. (`npm run knowledge:suggest` scores only published books and rewrites
  `src/data/knowledge-link-suggestions.json`: if you run it, restore that file.)
- For each candidate, write a short proposal:
  - title, type, category (one of Engineering, Manufacturing, Operations, Projects, Ideas, Products, Technology,
    Business), 1 to 5 existing tags, audience, prerequisites and outcomes;
  - point of difference and evidence plan;
  - a chapter outline (8 to 12 chapters for a book, 4 to 7 for a guide);
  - one running fictional case with real numbers, carried through every chapter (for example a pump flange, a
    stop-cartridge assembly, an inspection bracket, a steel tank or a conveyor gear pair);
  - the tools each chapter will genuinely use (tool id, what it calculates, which chapter);
  - a free cover pairing (`node scripts/library/check-book.mjs --free-covers`) whose motif fits the subject;
  - overlap risk.
- Show the proposals, then write the strongest ones, unless the owner asked to approve titles first.

## 3. Copyright, facts and accuracy

- **Originality:** original structure, prose, examples, figures and exercises. Never copy a book's chapters, sequence,
  passages, tables, figures or exercises. Old public-domain sources (for example the 1919 Airco booklet) may inform a
  modern treatment, credited in the references.
- **Sources:** cite real, checkable sources: standards bodies' public pages, government guidance and legislation,
  university texts, manufacturer data and peer-reviewed work. Never invent a URL, clause number, edition, table value or
  quotation. Name paywalled standards by number and scope only. Never quote values from a standard you have not read.
- **Australian context:** Australian English, SI units (mm, N, kN, MPa, N·m), A$ with GST stated, and Australian
  regulators and standards where relevant (Safe Work Australia, ACCC, OAIC, ATO, Standards Australia and so on).
- **Fictional numbers:** introduce each passage of the case with the exact sentence "This is an illustration." The case
  must never read as BIZOMAT work: say in `book.md` that it is not a real organisation or a BIZOMAT project.
- **Check every calculation with node**, in a scratch `.mjs` file outside the repository (the session scratchpad, or
  `$env:TEMP` on the laptop): formulas, units, rounding, and every number repeated in another chapter or a figure. Fix
  rounding mismatches before moving on.
- **Tools:** before a chapter points to a tool, open its definition (`public/tools/data-*.js`), guide (`guides-*.js`)
  and calculation (`calc-*.js`). Describe only what that tool calculates, with its real inputs and limits. If it cannot
  do the chapter's calculation, do not link it as if it can.
- **Safety:** for safety-critical or regulated work, state that the book is educational and that qualified review or
  approval governs real work.

## 4. Write complete chapters to the Library standard

### Files

- `src/content/reados-publications/<book-slug>/book.md`
- `src/content/reados-publications/<book-slug>/chapters/NN-short-name.md` (two-digit order prefix)

### book.md front matter (must match `src/content.config.ts`)

| Field | Rule |
| --- | --- |
| title | 5 to 100 characters |
| subtitle | 10 to 160 characters |
| description | 50 to 200 characters |
| category | One of the eight categories |
| tags | 1 to 5 tag slugs from `src/config/taxonomy.ts` |
| author | `BIZOMAT` |
| publisher | `BIZOMAT Library` |
| language | `en-AU` |
| status | `draft` |
| publishDate, referencesChecked | Today's Sydney date; never a future date |
| edition | `"1"` |
| level | Required (for example `"Intermediate"`) |
| audience | At least 30 characters |
| outcomes | At least 3, each at least 15 characters |
| coverVariant | `category` (only `category` or `opportunity-path` are valid) |
| references | At least 1; each with title, creator, year, url if real, and a note on how it was used |
| related | Optional; real internal links to published pages only |

The body of `book.md` follows the exemplars (`## About this book`, `## An independent treatment`):

- who the book serves and what they will learn;
- prerequisites and how to use the book;
- the running case, stated as fictional;
- source limits and a professional-responsibility note.

### Chapter front matter

`book: <book-slug>`, `chapterSlug` (lowercase, hyphenated, unique in the book), `order` (1, 2, 3 and so on, no gaps),
`title` (5 to 120 characters), `description` (50 to 200 characters), `draft: true`.

The chapter description is also shown on tool pages as "What it covers", so make it a plain summary of what the
chapter teaches.

### Chapter body standard (all of these, every chapter)

**Length:** 10 to 30 minutes as the site displays it. `readingTime()` in `src/utils/content.ts` removes code and figure
fences, HTML tags, the backtick and the characters `# > * _ [ ] ( ) ! -`, then counts words at 220 a minute, rounded;
figures and code do not count. The minimum is 2,090 counted words; aim for about 2,300 to 3,000. Measure every chapter with
`node scripts/library/check-book.mjs <book-slug>` and expand any chapter under 10 minutes with real substance, never
padding. Split any chapter that would run over 30 minutes.

**Structure:**

- one or two opening paragraphs (no H1 in the body: the layout supplies it);
- `##` sections, with `###` only where needed;
- tables, numbered procedures and checklists where they help;
- the running case worked through with real numbers;
- at least one failure or error case, showing how it is detected and corrected;
- a final `## Exercise: ...` section with the worked answer.

**Figures:** at least two per chapter; three is typical. Use fenced `figure` blocks.

- Types: steps, timeline, compare, matrix, tree, stats, checklist, layers, decision, formula, bars, funnel, stack, line,
  range, gauge, cycle, venn, balance, svg.
- Every figure needs a `title:` and a `caption:`.
- Rows are `- Label | value | note`. A leading `*` highlights a row; in checklists, `x` marks done and `?` marks open.
- Copy the syntax from existing chapters and `docs/READOS_FIGURES_CHECKLIST.md`.
- `svg` figures use class names only: no `style=` attributes (the content security policy blocks inline styles and the
  build fails). Give each one a correct `viewbox:` so nothing is clipped, and a meaningful `alt:`.
- Avoid line charts whose y-range is narrower than about 0.5, because axis ticks round to one decimal. Use a compare
  table or bars instead.
- Check that every figure's numbers match the text.

**Links:** link only to pages that exist in a production build.

- Library chapters at their real addresses: `/reados/publications/<book>/<chapterSlug>/` or
  `/reados/collections/<book>/<slug>/`, published books only (or chapters of this same book).
- Tools: the tool page `/tools/<tool-id>/` exists only for a tool with a complete guide (`--find-tools` and the book
  check say which); the calculator `/tools/?tool=<tool-id>` exists for every tool. The id must exist in
  `public/tools/data-*.js`. The build fails on broken internal links.
- Write tool links as `the [Tool name](/tools/<tool-id>/) tool`, as the exemplars do.

### Tool connections (required for every tool you link)

For each tool linked in the book's text, add one entry to `src/data/knowledge-links.json` (see
`docs/knowledge-links.md`):

```json
{ "reados": "publication/<book-slug>", "chapter": "<chapterSlug>", "tool": "<tool-id>", "type": "applies", "note": "<20 to 260 characters: what the tool calculates for this chapter>", "status": "approved", "evidence": "book-link" }
```

- One entry per book and tool, pointing at the first chapter that links it. Add the entries after this book's other
  entries (or at the end of the list), keeping the file's one-space JSON indentation.
- `type`: `applies`, `explains` or `example`; use `complements` when the tool covers a related or partial step, not the
  chapter's own calculation.
- `tests/knowledge-links.test.ts` fails if a tool link in the text has no matching entry.
- While the book is a draft, the entries are kept but hidden. They appear when the book is published: "Apply This in
  Practice" on the book and chapter pages, and "Learn the Concepts Behind This Tool" on each tool's page and in the
  calculator.
- Optional: if one chapter and tool make a clear Learn then Apply example, add one pathway to
  `src/data/learning-pathways.json`. Its learn and apply pair must be one of the approved entries above.

**Voice:** crisp, plain Australian English. No hype, filler, rhetorical openings, decorative em dashes or claims of
completeness. Avoid "dive in", "game changer", "unlock", "leverage" (verb) and question headings. Educational, not
advice.

## 5. Commit as you go

A cloud container can be reclaimed, so do not hold a whole book in an uncommitted tree. Commit and push the book page
and cover first, then every two chapters, then the tool links:

- stage by explicit path only (`git add -- src/content/reados-publications/<book-slug>/...`); never `git add -A` or
  `git add .`; check `git diff --cached --stat`;
- messages in the house form, for example `Library draft: <Title> chapters 3 and 4 (work in progress) [skip ci]`, then
  `Library draft: <Title> tool links (<ids>) [skip ci]`, ending with the agreed co-author lines;
- `git push -u origin <branch>`, retrying network errors up to 4 times with backoff.

## 6. Cover, reader and book page (automatic, plus one data line)

The book page (cover hero, "Inside this book" chapter list with figure thumbnails, "Apply This in Practice") and every
chapter page (reader with the chapter dropdown, text size, progress bar, previous and next links, and the chapter's
tools) are generated. Do not hand-build pages or add CSS.

- Give the book its own animated cover with one entry in `SPECIAL_COVERS` in `src/utils/reados-covers.ts`, after the
  last authored-book entry: `'<book-slug>': { motif: '<motif>', tone: '<tone>' },`.
- Pick a pairing from `node scripts/library/check-book.mjs --free-covers` whose motif fits the subject (motifs are the
  `CoverMotif` list; tones are graphite, ember, paper and carbon). `tests/reados-covers.test.ts` fails if two published
  books share a pairing.
- Anything else in cover code needs the owner's approval first.
- Preview drafts with `npm run dev` (drafts appear only in the development server) at
  `http://localhost:4321/reados/publications/<book-slug>/`. Check the cover, chapter list, thumbnails, dropdown, text
  size, figures, and the mobile (390 px) and light and dark layouts. Take screenshots (Playwright in a cloud session, or
  the Browser pane) and look at them.

## 7. Quality gates before asking for approval

Run all of these and fix every failure:

1. `node scripts/library/check-book.mjs <book-slug>`: no CHECK lines (minutes, figures, titles and captions, `style=`,
   H1, exercise, illustration label, former names, draft flags, tool ids and pages, knowledge-links entries, cover).
2. Clear the content cache, then `npm run verify` (astro check, every test including knowledge-links, the build and the
   post-build checks). Production builds must exclude drafts.
   - bash: `rm -f .astro/data-store.json && npm run verify`
   - PowerShell: `Remove-Item .astro\data-store.json -ErrorAction SilentlyContinue; npm run verify`
3. `npm run knowledge:check`: every relationship valid; this book's entries present.
4. `npm run seo:validate` (the SEO release gate, on the fresh `dist/`). A draft must not appear in `dist/` or in the
   sitemap (`dist/sitemap-*.xml`).
5. Every linked tool id exists, has its `book-link` entry and is described accurately against its `calc-*.js` code.
6. A duplication check against the Library and a source-copying check against the supplied material.
7. `git status --short` lists only this book's files and the allowed shared lines. Restore anything else the build or a
   script rewrote (`git restore <path>`) and never commit it.

GitHub Actions may not run (see `docs/BIZOMAT-PROJECT-STATUS.md`, section 6): the local gates above are the gate, and
the report says whether CI ran.

When the gates pass, commit and push, then open a pull request to `main` titled `Library draft: <Title>`, with the
report below in its body. Drafts are hidden in production, so merging it publishes nothing; merging is the owner's
decision.

Report a table with these columns: book; type and category; chapters; minutes per chapter (min to max); figures per
chapter; the running case; tools linked (ids, and knowledge-links entries added); cover pairing; references; overlap
assessment; open fact-checks; verify, knowledge and SEO gate status; branch and pull request; local preview URL.

Finish by asking: "Which of these named books do you approve to publish to the BIZOMAT Library?" Then stop.

## 8. Type `chapters`: new chapters for an existing edited book

Use this only when the request is for chapters in an edited book (`src/utils/reados-collections.ts`). Rules:
`docs/KEVOS_READOS_PUBLISHING.md`, "Chapter rules", with `author: "BIZOMAT"`.

- One file per chapter: `src/content/reados-chapters/<slug>.md` (the file name is the permanent slug), front matter as
  in the `chapters` schema of `src/content.config.ts`, `draft: true` until approved.
- Add the slug to its book's `ids` list in `src/utils/reados-collections.ts`; the category must match the book's.
- Length 10 to 20 minutes: `npm run reading-time -- <slug>`.
- Links in the form `/reados/collections/<book>/<slug>/`. A tool link needs a knowledge-links entry with
  `"reados": "collection/<book>"` and `"chapter": "<slug>"`.
- Sections 3, 4 (figures, voice), 5 and 7 apply; the book check script does not (it reads authored books only).

## 9. Publishing (only after the owner names a book, in a later message)

1. `git fetch origin`. If the draft pull request is merged, branch `books/<book-slug>-publish` from `origin/main`;
   otherwise continue on the draft branch after merging `origin/main` into it. Confirm
   `git merge-base --is-ancestor origin/main HEAD`.
2. Set the approved book to `status: published` and its chapters to `draft: false`. Set `publishDate` to today's
   Sydney date (never a future date) and `referencesChecked` to the date you last checked the references.
3. Confirm its cover pairing is still unused by any published book (`--free-covers`; the covers test).
4. Re-run section 7 in full. The book check must now report no draft flags.
5. Stage only the approved book's files by explicit path, plus its `knowledge-links.json` entries (and
   `learning-pathways.json` if changed) and its cover line if new. Never `git add -A`, `git add .` or force-push. Show
   `git diff --cached --stat`.
6. Commit `Library: publish <Title>` with the agreed co-author lines (documentation changes in a separate commit),
   push, and open a pull request to `main`. Merge only when the owner says so.
7. **Merging does not publish.** bizomat.ai is the Fly app `bizomat`, deployed only by the owner: GitHub Actions >
   "BIZOMAT deploy (bizomat)" > Run workflow on `main` with `confirm` = `DEPLOY`, or the laptop's
   `.\bizomat.ps1 deploy website`. A deploy ships everything on `main` (website, router and Project Management),
   including Project Management changes waiting there (see `docs/BIZOMAT-PROJECT-STATUS.md`, section 6). Never deploy
   from a book task and never run `npm run deploy` or `wrangler deploy` (`scripts/deploy-guard.mjs` refuses; nothing
   publishes to kevos.com or Cloudflare from here). Tell the owner what else is waiting on `main`, then wait.
8. After the owner reports the deploy, check https://bizomat.ai:
   - `/reados/` lists the book under its category with its animated cover;
   - `/reados/publications/<book-slug>/` and every chapter URL return 200;
   - each chapter shows "10 min read" or more, at least two figures, the chapter dropdown and the text-size control;
   - the book page shows "Apply This in Practice" with each linked tool, and chapter pages show their own tools;
   - each linked tool's page (`/tools/<tool-id>/`) shows the book under "Learn the Concepts Behind This Tool", and
     `https://bizomat.ai/tools/knowledge.json` lists it;
   - the book and its chapters appear in `https://bizomat.ai/sitemap-index.xml` (the sitemap files it lists);
   - the basics from `CLAUDE.md`, "After any production change": BIZOMAT wordmark and favicon, the navigation, the
     light theme on a new session, and AI search answering.
9. IndexNow runs from `.github/workflows/seo-validate.yml` after a push to `main` when GitHub Actions runs; nothing to do
   by hand. Report whether it ran.
10. Report the live URLs, chapter count, minutes and figures per chapter, the tool connections, the commit hash, the
    pull request, the deploy (who ran it and when) and any open issues. Report pre-existing CI failures separately from
    this release. Never call anything live before checking its public URL.

## Non-negotiable

One finished, accurate, well-illustrated book is worth more than several thin ones. The repository's current code,
`CLAUDE.md` and the schema overrule anything in this command. When copyright, safety, scope or production state is
uncertain, stop and ask.

END OF COMMAND
