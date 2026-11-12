// Approved baselines are insert-only (migration 0008): no server code updates or deletes their rows. Only deleting
// the whole project removes them (ON DELETE CASCADE).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(ts|mjs)$/.test(f) ? [p] : [];
  });
}

describe('approved baselines', () => {
  it('are never updated or deleted by the application', () => {
    const offenders = [...files('src'), ...files('scripts')].filter((f) => /\b(UPDATE\s+(project_baselines|baseline_tasks)|DELETE\s+FROM\s+(project_baselines|baseline_tasks))\b/i.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
