import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('all KEVOS calculator bundles parse', () => {
  for (let i = 1; i <= 7; i++) {
    const file = join(process.cwd(), 'public', 'tools', `calc-${i}.js`);
    const source = readFileSync(file, 'utf8');
    assert.doesNotThrow(() => new Function(source), `calc-${i}.js must parse`);
  }
});
