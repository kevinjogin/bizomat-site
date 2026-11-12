# Authored Library books

The authored-publication mechanism supplements the edited Library books (`src/utils/reados-collections.ts`, chapters in `src/content/reados-chapters/`, the former Insights articles) and the finance guide at `/library/` ("Read the Numbers, Understand the Business", `src/data/library.ts`). It does not change their URLs or content. Authored chapters are independent Markdown documents, not copies of edited-book chapters. Before 2 November 2026 these were "ReadOS" books; book text now says "the Library" (`docs/KEVOS_READOS_PUBLISHING.md`, "Chapter rules").

The full workflow for writing, checking and publishing a book or guide is the `/library-book` command (`.claude/commands/library-book.md`). Its checker reports what needs fixing in one book, read-only:

- `node scripts/library/check-book.mjs <book-slug>`: reading time, figures, structure, former names, tool links, knowledge links and cover;
- `--inventory` (every authored book), `--free-covers` (cover pairings no book uses yet), `--find-tools <words>` (tools that match the words).

This file records how the mechanism works.

## Create an edition

Create `src/content/reados-publications/<stable-book-slug>/book.md` and a `chapters/` directory beneath it. Follow the validated metadata in the existing books (for example `win-work-you-can-deliver`) and `src/content.config.ts`: `author: BIZOMAT` and `publisher: BIZOMAT Library` are literals (the schema accepts nothing else) and `language` is `en-AU`. BIZOMAT is not a registered trade mark: no ® or ™. Categories and tags come from `src/config/taxonomy.ts`.

Keep `status: draft` while writing. Each chapter references its book slug, has a permanent `chapterSlug`, an explicit integer `order` beginning at 1, a title and description, and a `draft` flag. The filenames aid editing; the explicit slugs determine chapter URLs. Do not change published slugs casually.

The book body supplies its introduction and source-use explanation. Metadata supplies audience, learning outcomes, bibliography, reference-check date and relevant existing links. Do not invent publication metadata or imply that a source author endorses the book. Covers come from `src/utils/reados-covers.ts` (an illustration and a colourway); two published authored books may not share a pairing (`tests/reados-covers.test.ts`), and covers keep the existing reduced-motion rule.

## Preview and publish

`npm run dev` includes draft and scheduled editions for local preview. Production builds exclude draft and future-dated books. A published book with a draft/empty chapter, duplicate chapter slug, missing chapter number or no chapters fails validation. Unknown book references and duplicate book IDs also fail. These checks cannot judge editorial completeness: a human/editorial review is still necessary.

After editorial review and the owner's approval, set every completed chapter to `draft: false`, set the book to `status: published`, and use the actual publication date. Run `npm ci`, `npm run verify` and the checker; inspect desktop/mobile views, navigation, text size, search and metadata. Then open a pull request to `main` (the command's sections 7 and 9). Merging does not publish, and a metadata flag does not mean the public site has deployed: bizomat.ai is the Fly app `bizomat`, deployed only by the owner (`docs/KEVOS_READOS_PUBLISHING.md`, step 10; `CLAUDE.md`, "Deployment"). Check the live pages on https://bizomat.ai after the owner's deploy.

## Routes and maintenance

- Book: `/reados/publications/<book>/`.
- Chapter: `/reados/publications/<book>/<chapterSlug>/`.
- Catalogue: book automatically appears in its primary category at `/reados/`.
- Chapter order: metadata order, independent of filenames and historical collection sorting.
- SEO: Book/Chapter structured data and canonical URLs, sitemap integration through the existing Astro sitemap build.
- Search: Pagefind indexes the book overview and each chapter at one canonical authored route; the overview does not repeat full chapters.
- No new database, image service, JavaScript framework or package is required.

Changing `status` to draft removes the generated routes on the next production build. For a previously published book, plan redirects or an appropriate withdrawal page before doing so. Preserve already published URLs when issuing corrected editions.
