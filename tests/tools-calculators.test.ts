import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

test('all KEVOS calculator bundles parse', () => {
  for (let i = 1; i <= 7; i++) {
    const file = join(process.cwd(), 'public', 'tools', `calc-${i}.js`);
    const source = readFileSync(file, 'utf8');
    assert.doesNotThrow(() => new Function(source), `calc-${i}.js must parse`);
  }
});

test('every calculator default is accepted by its numeric field constraints', () => {
  const context = { window: {} as Record<string, any> };
  for (let i = 1; i <= 7; i++) {
    runInNewContext(readFileSync(join(process.cwd(), 'public', 'tools', `data-${i}.js`), 'utf8'), context);
  }
  assert.equal(context.window.GOCORE_TOOLS.length, 62);
  for (const tool of context.window.GOCORE_TOOLS) {
    for (const field of tool.fields) {
      if (field.type !== 'number' && field.type !== 'range') continue;
      const label = `${tool.id}/${field.key}`;
      assert.ok(Number.isFinite(field.default), `${label} has a numeric default`);
      if (field.min !== undefined) assert.ok(field.default >= field.min, `${label} meets its minimum`);
      if (field.max !== undefined) assert.ok(field.default <= field.max, `${label} meets its maximum`);
      if (typeof field.step === 'number') {
        const steps = (field.default - (field.min ?? 0)) / field.step;
        assert.ok(Math.abs(steps - Math.round(steps)) < 1e-8, `${label} aligns with its HTML input step`);
      }
    }
  }
});
