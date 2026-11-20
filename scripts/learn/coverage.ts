// Writes docs/learn/COVERAGE.md, the Knowledge Centre's coverage tracker, from src/data/learn/ (Node 22 runs TypeScript).
import { writeFileSync } from 'node:fs';
import { coverageMarkdown } from '../../src/data/learn/coverage.ts';

writeFileSync(new URL('../../docs/learn/COVERAGE.md', import.meta.url), coverageMarkdown());
console.log('docs/learn/COVERAGE.md written');
