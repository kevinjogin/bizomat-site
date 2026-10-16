# Authored ReadOS books

The authored-publication mechanism supplements the existing article collections and finance guide. It does not change their URLs or content. Chapters are independent Markdown documents, not copies of READOS book chapters (the former Insights articles).

## Create an edition

Create `src/content/reados-publications/<stable-book-slug>/book.md` and a `chapters/` directory beneath it. Follow the validated metadata in the existing `win-work-you-can-deliver` example and `src/content.config.ts`. Categories and tags come from `src/config/taxonomy.ts`.

Keep `status: draft` while writing. Each chapter references its book slug, has a permanent `chapterSlug`, an explicit integer `order` beginning at 1, a title and description, and a `draft` flag. The filenames aid editing; the explicit slugs determine chapter URLs. Do not change published slugs casually.

The book body supplies its introduction and source-use explanation. Metadata supplies audience, learning outcomes, bibliography, reference-check date and relevant existing links. Do not invent publication metadata or imply that a source author endorses the book. The common cover defaults to the category design; optional motifs should remain reusable and use the existing reduced-motion rule.

## Preview and publish

`npm run dev` includes draft and scheduled editions for local preview. Production builds exclude draft and future-dated books. A published book with a draft/empty chapter, duplicate chapter slug, missing chapter number or no chapters fails validation. Unknown book references and duplicate book IDs also fail. These checks cannot judge editorial completeness: a human/editorial review is still necessary.

After editorial review, set every completed chapter to `draft: false`, set the book to `status: published`, and use the actual publication date. Run `npm ci` and `npm run verify`; inspect desktop/mobile views, navigation, text size, search and metadata. Use the existing approved feature-branch/PR/release process. A metadata flag does not mean the public site has deployed.

## Routes and maintenance

- Book: `/reados/publications/<book>/`.
- Chapter: `/reados/publications/<book>/<chapterSlug>/`.
- Catalogue: book automatically appears in its primary category at `/reados/`.
- Chapter order: metadata order, independent of filenames and historical collection sorting.
- SEO: Book/Chapter structured data and canonical URLs, sitemap integration through the existing Astro sitemap build.
- Search: Pagefind indexes the book overview and each chapter at one canonical authored route; the overview does not repeat full chapters.
- No new database, image service, JavaScript framework or package is required.

Changing `status` to draft removes the generated routes on the next production build. For a previously published book, plan redirects or an appropriate withdrawal page before doing so. Preserve already published URLs when issuing corrected editions.
