// Reading-time check for READOS chapters, using the same formula as src/utils/content.ts
// (220 words per minute, rounded). Target for every chapter: 10–20 minutes.
// Usage: npm run reading-time [-- slug another-slug]
import fs from 'node:fs';

const dir = new URL('../src/content/reados-chapters/', import.meta.url);
const only = process.argv.slice(2).map((s) => s.replace(/\.md$/, ''));
const rows = [];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const slug = file.replace(/\.md$/, '');
  if (only.length && !only.includes(slug)) continue;
  const raw = fs.readFileSync(new URL(file, dir), 'utf8');
  const body = raw.replace(/^---[\s\S]*?---/, '');
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 220));
  const draft = /^draft:\s*true/m.test(raw) ? ' (draft)' : '';
  rows.push({ mins, words, slug: slug + draft });
}

rows.sort((a, b) => a.mins - b.mins);
for (const r of rows) {
  const flag = r.mins < 10 ? 'SHORT' : r.mins > 20 ? 'LONG ' : 'ok   ';
  console.log(`${String(r.mins).padStart(3)} min ${String(r.words).padStart(6)} words  ${flag}  ${r.slug}`);
}
const ok = rows.filter((r) => r.mins >= 10 && r.mins <= 20).length;
console.log(`\n${ok}/${rows.length} within 10–20 min`);
if (ok !== rows.length) process.exitCode = 1;
