import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// The policy itself lives with Project Management (apps/work), where it also runs in that app's own CI.
import { uploads, violations } from '../apps/work/scripts/check-artifact-policy.mjs';

// Security remediation, 5 Nov 2026: two Cloudflare D1 exports with account data were uploaded as workflow artifacts in
// the public PMO repository. No workflow anywhere in this repository may upload a database, a dump, a backup or a
// secrets file as an artifact; backups are D1 restore points or Fly volume snapshots, which never leave the provider.
const FOLDERS = ['.github/workflows', 'apps/work/.github/workflows'];

test('no workflow in the repository uploads a database, dump, backup or secrets file', () => {
  assert.deepEqual(FOLDERS.flatMap(violations), []);
});

test('the policy recognises a forbidden upload in every YAML form it can take', () => {
  const step = (body: string) => `jobs:\n  a:\n    steps:\n${body}`;
  assert.equal(uploads(step('      - uses: actions/upload-artifact@v4\n        with:\n          name: x\n          path: backup-1.sql\n'))[0].values.join(' '), 'x backup-1.sql');
  const block = uploads(step('      - name: keep\n        uses: actions/upload-artifact@v4\n        with:\n          path: |\n            out/db.sqlite\n            report/\n'))[0];
  assert.ok(block.values.includes('out/db.sqlite') && block.values.includes('report/'));
  for (const bad of ['backup-*.sql', 'data/db.sqlite', 'd1-backup-x', '.dev.vars', 'secrets.json', 'dump.db']) {
    assert.match(bad, /\.(sql|sqlite3?|db|dump|bak)\b|backup|d1-export|\.dev\.vars|(^|[\s/])\.env\b|\.wrangler|secret|credential/i, bad);
  }
});

test('the consolidation workflow never uploads an artifact and deletes the archive from the runner', () => {
  const wf = readFileSync('.github/workflows/consolidate.yml', 'utf8');
  assert.doesNotMatch(wf, /upload-artifact/);
  assert.match(wf, /remove the archive from bizomat and from this runner"\n\s+if: always\(\) && inputs\.mode == 'move-work-data'[\s\S]*rm -rf "\$W"/);
});

test('the deploy workflow takes its token from GitHub secrets only and builds on the runner', () => {
  const wf = readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.doesNotMatch(wf, /upload-artifact/);
  assert.match(wf, /branches: \[main\]/);
  assert.match(wf, /uses: \.\/\.github\/workflows\/bizomat-ci\.yml/, 'the full CI gates every deploy');
  assert.match(wf, /flyctl deploy --app "\$APP" --config fly\.toml --local-only --ha=false/, 'built on the GitHub runner, one Machine');
  for (const m of wf.matchAll(/FLY_API_TOKEN: (.+)/g)) assert.equal(m[1].trim(), '${{ secrets.FLY_API_TOKEN }}');
  assert.doesNotMatch(wf, /FlyV1 |fo1_/, 'no token in the file');
});
