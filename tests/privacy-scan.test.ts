// The malware scan of company registration documents runs in Amsterdam (CAD Automation's Machine): the privacy pages
// must say so before the flag evidence_scanning can be switched on (owner, 19 Nov 2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

test('the website privacy policy discloses the malware scan in Amsterdam and where CAD Automation keeps its data', () => {
  const privacy = read('src/pages/privacy.astro');
  assert.match(privacy, /malware/i);
  assert.match(privacy, /scanned for malware with ClamAV and deleted straight after the scan/);
  assert.match(privacy, /CAD Automation stores its data on servers in Amsterdam, the Netherlands/);
  assert.doesNotMatch(privacy, /CAD Automation stores its data on servers in Sydney/);
});

test('the ERP says it beside the upload and in its own privacy table', () => {
  assert.match(read('apps/work/src/client/company/Pages.tsx'), /scanned for malware on BIZOMAT’s server in Amsterdam, the Netherlands/);
  assert.match(read('apps/work/src/client/pages/Privacy.tsx'), /malware scan \(BIZOMAT’s server in Amsterdam, the Netherlands\)/);
});
