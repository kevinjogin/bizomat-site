// Test results shown in the Engine Room (/engine-room/#tests). Each row is a suite that was run, with the date and the count it reported.
// Update a row only from a real run (the command is in `how`); never round up or carry a result across a change.
export interface Verification {
  product: 'CAD Automation' | 'Project Management' | 'Website and Resources' | 'Platform';
  suite: string;
  how: string;
  result: string;
  date: string;
}

export const VERIFICATION: readonly Verification[] = [
  { product: 'CAD Automation', suite: 'Server, MCP tools, sign-in, OAuth and device bridge (with a stand-in computer)', how: 'pytest (apps/cad)', result: '294 passed, 2 skipped (IPv6 and .NET not on the test machine)', date: '5 Nov 2026' },
  { product: 'CAD Automation', suite: 'SOLIDWORKS add-in and Companion: build and unit tests', how: 'bash solidworks/build.sh test (.NET 8 SDK)', result: '32 of 32 passed, 0 build warnings', date: '5 Nov 2026' },
  { product: 'CAD Automation', suite: 'Sketch solver', how: 'npm test (apps/cad)', result: '9 of 9 passed', date: '5 Nov 2026' },
  { product: 'Project Management', suite: 'API and service tests in the Workers runtime', how: 'npm test (apps/work)', result: '198 of 198 passed', date: '5 Nov 2026' },
  { product: 'Project Management', suite: 'The same suite and the runtime tests on Node 22 (the BIZOMAT platform)', how: 'npm run test:node (apps/work)', result: '293 of 293 passed', date: '5 Nov 2026' },
  { product: 'Project Management', suite: 'Browser tests, desktop and phone, on both runtimes', how: 'npm run test:e2e and test:e2e:node (apps/work)', result: '9 of 9 passed on each', date: '5 Nov 2026' },
  { product: 'Project Management', suite: 'Data migration dry run: Cloudflare D1 and R2 to Node, and back', how: 'node scripts/migrate/dry-run.mjs (apps/work)', result: '45 of 45 checks passed', date: '5 Nov 2026' },
  { product: 'Website and Resources', suite: 'Site, search, tools and content tests', how: 'npm test (repository root)', result: '1,490 of 1,490 passed', date: '5 Nov 2026' },
  { product: 'Website and Resources', suite: 'Build quality gate: metadata, one H1, links, images, JSON-LD', how: 'npm run build', result: '4,441 pages verified', date: '5 Nov 2026' },
  { product: 'Platform', suite: 'Edge proxy: routing, headers, streaming, WebSockets, long polls', how: 'node --test infrastructure/proxy', result: '59 of 59 passed', date: '5 Nov 2026' },
];
