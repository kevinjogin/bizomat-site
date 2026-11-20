// docs/erp/MODULES.md is generated from the 97-module catalogue (npx tsx scripts/erp/modules-doc.ts at the repository root).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { modulesMarkdown } from '../src/shared/erp-catalogue-doc';

describe('the 97-module catalogue document', () => {
  it('is in step with the catalogue', () => {
    expect(readFileSync('../../docs/erp/MODULES.md', 'utf8'), 'run: npx tsx scripts/erp/modules-doc.ts').toBe(modulesMarkdown());
  });
});

describe('the modules framework on screen', () => {
  it('gives every module an icon the ERP has', async () => {
    const { MODULE_DEFS } = await import('../src/shared/erp-objects');
    const icons = readFileSync('src/client/components/ui/Icon.tsx', 'utf8');
    for (const m of MODULE_DEFS) expect(icons, `${m.key}: icon ${m.icon}`).toMatch(new RegExp(`^\\s+${m.icon}: '`, 'm'));
  });
});
