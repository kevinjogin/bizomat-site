// Frequently asked questions: the GoCore Assistant's highest-priority source of truth.
// Edit them in src/data/faq.json, or online in Pages CMS under "Assistant FAQ".
// Keep every answer accurate and current; add a question whenever visitors ask something new.
import entries from './faq.json';

export const FAQ: ReadonlyArray<{ q: string; a: string }> = (entries as Array<{ question: string; answer: string }>)
  .filter((e) => e.question?.trim() && e.answer?.trim())
  .map((e) => ({ q: e.question.trim(), a: e.answer.trim() }));
