#!/usr/bin/env node
// Artifact policy: no workflow may upload a database, a dump, a backup or a secrets file as a workflow artifact.
// This repository is public: any signed-in GitHub user can download its artifacts. Backups are Cloudflare D1 Time
// Travel restore points instead (admin-ops `backup`, and before every deploy): they never leave Cloudflare.
//
//   node scripts/check-artifact-policy.mjs [workflow folder ...]     (default: .github/workflows)
//
// Exit 0 when every upload-artifact step is allowed, 1 otherwise. No dependencies: the step's `name:` and `path:`
// values are read from the YAML text (single values and `|` blocks).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN = /\.(sql|sqlite3?|db|dump|bak)\b|backup|d1-export|\.dev\.vars|(^|[\s/])\.env\b|\.wrangler|secret|credential/i;

export function uploads(text) {
  const lines = text.split(/\r?\n/);
  const found = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^(\s*)(-\s+)?uses:\s*actions\/upload-artifact\b/.exec(lines[i]);
    if (!m) continue;
    // the step starts at its "- " line: the uses line itself, or the nearest line above it at a lower indent
    let start = i;
    if (!m[2]) {
      while (start > 0 && !/^\s*-\s/.test(lines[start])) start--;
    }
    const stepIndent = /^(\s*)/.exec(lines[start])[1].length;
    const values = [];
    for (let j = start; j < lines.length; j++) {
      const line = lines[j];
      if (j > start && line.trim() && /^(\s*)/.exec(line)[1].length <= stepIndent) break;
      const kv = /^\s*(-\s+)?(name|path):\s*(.*)$/.exec(line);
      if (!kv) continue;
      const value = kv[3].trim();
      if (value === '|' || value === '>') {
        const blockIndent = /^(\s*)/.exec(line)[1].length;
        for (let k = j + 1; k < lines.length && (!lines[k].trim() || /^(\s*)/.exec(lines[k])[1].length > blockIndent); k++) {
          if (lines[k].trim()) values.push(lines[k].trim());
        }
      } else values.push(value);
    }
    found.push({ line: i + 1, values });
  }
  return found;
}

export function violations(folder) {
  const out = [];
  let files = [];
  try {
    files = readdirSync(folder).filter((f) => /\.ya?ml$/.test(f));
  } catch {
    return out;
  }
  for (const f of files) {
    const text = readFileSync(join(folder, f), 'utf8');
    for (const u of uploads(text)) {
      const bad = u.values.filter((v) => FORBIDDEN.test(v.replace(/#.*$/, '')));
      if (bad.length) out.push(`${join(folder, f)}:${u.line}: upload-artifact of ${bad.join(', ')}`);
    }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const folders = process.argv.slice(2).length ? process.argv.slice(2) : ['.github/workflows'];
  const problems = folders.flatMap(violations);
  if (problems.length) {
    console.error('Artifact policy: databases, dumps, backups and secrets must never be uploaded as workflow artifacts.');
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`Artifact policy: ok (${folders.join(', ')})`);
}
