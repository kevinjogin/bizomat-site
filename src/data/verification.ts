// Test results shown on /proof-of-work/. Each row is a suite that was run, with the date and the count it reported.
// Update a row only from a real run (the command is in `how`); never round up or carry a result across a change.
export interface Verification {
  product: 'CAD Automation' | 'Project Management' | 'Website and Resources' | 'Platform';
  suite: string;
  how: string;
  result: string;
  date: string;
}

export const VERIFICATION: readonly Verification[] = [
  { product: 'Project Management', suite: 'API and service tests in the Workers runtime', how: 'npm test (apps/work)', result: '192 of 192 passed', date: '5 Nov 2026' },
  { product: 'Website and Resources', suite: 'Site, search, tools and content tests', how: 'npm test (repository root)', result: 'all passed', date: '5 Nov 2026' },
  { product: 'Website and Resources', suite: 'Build quality gate: metadata, one H1, links, images, JSON-LD', how: 'npm run build', result: '4,438 pages verified', date: '5 Nov 2026' },
];
