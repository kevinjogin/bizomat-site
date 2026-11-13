#!/usr/bin/env node
// Make a `wrangler d1 export` dump importable into an empty database.
//
// D1 exports tables alphabetically, so a table can be created (and filled)
// before a table its foreign keys reference — import then fails with
// "no such table". This tool re-orders statements: all CREATE TABLE first,
// then data (INSERT), then everything else (indexes, triggers, views).
// Statements are split on ';' outside quoted strings/identifiers, so data
// containing semicolons or quotes is preserved exactly.
//
//   node scripts/reorder-dump.mjs <in.sql> <out.sql>
import { readFileSync, writeFileSync } from 'node:fs';

export function splitStatements(sql) {
  const out = [];
  let cur = '';
  let quote = null; // "'" | '"' | '`' | '['
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    cur += ch;
    if (quote) {
      if ((quote === '[' && ch === ']') || (quote !== '[' && ch === quote)) {
        if (quote !== '[' && sql[i + 1] === quote) {
          cur += sql[++i]; // escaped quote ('' or "")
        } else quote = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`' || ch === '[') quote = ch;
    else if (ch === '-' && sql[i + 1] === '-') {
      const nl = sql.indexOf('\n', i);
      const end = nl < 0 ? sql.length : nl;
      cur += sql.slice(i + 1, end);
      i = end - 1;
    } else if (ch === ';') {
      const s = cur.trim();
      // A trigger's body holds statements of its own: it ends at END; (Finance's ledger guards).
      if (/^CREATE\s+(?:TEMP\s+|TEMPORARY\s+)?TRIGGER\b/i.test(s.replace(/^(--[^\n]*\n\s*)+/, '')) && !/\bEND\s*;$/i.test(s)) continue;
      if (s && s !== ';') out.push(s);
      cur = '';
    }
  }
  if (cur.trim()) out.push(cur.trim().endsWith(';') ? cur.trim() : cur.trim() + ';');
  return out;
}

export function reorder(sql) {
  const stmts = splitStatements(sql).filter((s) => !/^(BEGIN|COMMIT|PRAGMA)\b/i.test(s.replace(/^--.*\n/gm, '').trim()));
  const head = (s) => s.replace(/^(--[^\n]*\n)+/g, '').trim();
  const skip = (s) => /\b_cf_[A-Za-z]+/.test(head(s).split('(')[0]);
  const creates = stmts.filter((s) => /^CREATE\s+TABLE/i.test(head(s)) && !skip(s));
  const inserts = stmts.filter((s) => /^INSERT\s+INTO/i.test(head(s)) && !skip(s));
  const seqReset = stmts.filter((s) => /^DELETE\s+FROM\s+"?sqlite_sequence/i.test(head(s)));
  const rest = stmts.filter((s) => !creates.includes(s) && !inserts.includes(s) && !seqReset.includes(s) && !skip(s));
  return [...creates, ...seqReset, ...inserts, ...rest].join('\n') + '\n';
}

if (process.argv[1] && process.argv[1].endsWith('reorder-dump.mjs')) {
  const [, , input, output] = process.argv;
  if (!input || !output) {
    console.error('usage: reorder-dump.mjs <in.sql> <out.sql>');
    process.exit(1);
  }
  const src = readFileSync(input, 'utf8');
  const result = reorder(src);
  writeFileSync(output, result);
  console.log(`Reordered ${splitStatements(src).length} statements → ${output}`);
}
