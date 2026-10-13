type BookEntry = { id: string; data: { status: string; publishDate: Date } };
type ChapterEntry = { id: string; body?: string; data: { book: { id: string }; chapterSlug: string; order: number; draft: boolean } };

/** Enforce complete, stable authored editions before producing any public routes. */
export function assemblePublications<B extends BookEntry, C extends ChapterEntry>(books: B[], chapters: C[], today: string, preview = false) {
  const ids = new Set(books.map(book => book.id));
  if (ids.size !== books.length) throw new Error('Duplicate publication ID');
  for (const chapter of chapters) if (!ids.has(chapter.data.book.id)) throw new Error(`Unknown publication for ${chapter.id}`);
  return books.filter(book => preview || (book.data.status === 'published' && book.data.publishDate.toISOString().slice(0, 10) <= today)).map(book => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.id)) throw new Error(`Invalid publication slug: ${book.id}`);
    const ordered = chapters.filter(chapter => chapter.data.book.id === book.id).sort((a, b) => a.data.order - b.data.order);
    if (!ordered.length) throw new Error(`Publication has no chapters: ${book.id}`);
    const slugs = new Set<string>();
    ordered.forEach((chapter, index) => {
      if (chapter.data.order !== index + 1) throw new Error(`Chapter order must be contiguous in ${book.id}`);
      if (slugs.has(chapter.data.chapterSlug)) throw new Error(`Duplicate chapter slug in ${book.id}`);
      slugs.add(chapter.data.chapterSlug);
      if (!chapter.body?.trim()) throw new Error(`Empty chapter: ${chapter.id}`);
      if (!preview && chapter.data.draft) throw new Error(`Published book contains draft chapter: ${chapter.id}`);
    });
    return { book, chapters: ordered };
  });
}
export const publicationHref = (id: string) => `/reados/publications/${id}/`;
export const publicationChapterHref = (id: string, slug: string) => `${publicationHref(id)}${slug}/`;
