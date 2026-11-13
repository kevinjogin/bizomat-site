// The migration scripts (scripts/migrate/*.mjs), run as the operator runs them,
// on a dump written in the format `wrangler d1 export` produces.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { FileStore, openRuntimeDatabase } from '../src/node/store/file-store.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { DatabaseSync, openDatabase } from '../src/node/store/sqlite.ts';
import { tempDir } from './helpers.ts';
// @ts-expect-error plain JavaScript module without type declarations
import { exactRows } from '../scripts/migrate/lib/common.mjs';

const root = tempDir('work-migrate-');
const SECRET_EMAIL = 'person.secret@example.com';
const SECRET_HASH = 'pbkdf2$100000$c2FsdHNhbHQ=$aGFzaGhhc2g=';
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5]);
const PDF = Buffer.from('%PDF-1.4 synthetic');
// No backslash-n next to the line breaks: D1's export format cannot keep that combination
// (repair-text-from-d1.mjs restores it from D1; the dry run covers that).
const TRICKY = "line1\nline2\r\nback\\slash; 'quoted' -- not a comment\u0000nul";

function run(script: string, ...args: string[]) {
  const r = spawnSync(process.execPath, [join('scripts/migrate', script), ...args], { encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

/** SQL in the format of `wrangler d1 export` (tables alphabetically, newlines through replace(), NUL bytes raw). */
function d1Dump(db: DatabaseSync): string {
  const lit = (v: unknown): string => {
    if (v === null) return 'NULL';
    if (typeof v === 'number' || typeof v === 'bigint') return String(v);
    if (v instanceof Uint8Array) return `X'${Buffer.from(v).toString('hex')}'`;
    const s = String(v).replace(/'/g, "''");
    if (!/[\r\n]/.test(s)) return `'${s}'`;
    let e = `'${s.replace(/\r/g, '\\r').replace(/\n/g, '\\n')}'`;
    if (s.includes('\r')) e = `replace(${e},'\\r',char(13))`;
    if (s.includes('\n')) e = `replace(${e},'\\n',char(10))`;
    return e;
  };
  const out = ['PRAGMA defer_foreign_keys=TRUE;'];
  const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all() as { name: string; sql: string }[];
  for (const t of tables) {
    out.push(`${t.sql};`);
    const cols = (db.prepare(`PRAGMA table_info("${t.name}")`).all() as { name: string }[]).map((c) => `"${c.name}"`).join(',');
    for (const row of exactRows(db, t.name, 'rowid') as Iterable<unknown[]>) out.push(`INSERT INTO "${t.name}" (${cols}) VALUES(${row.map(lit).join(',')});`);
  }
  out.push('DELETE FROM sqlite_sequence;');
  for (const r of db.prepare('SELECT name, seq FROM sqlite_sequence').all() as { name: string; seq: number }[]) out.push(`INSERT INTO "sqlite_sequence" ("name","seq") VALUES('${r.name}',${r.seq});`);
  for (const i of db.prepare("SELECT sql FROM sqlite_master WHERE type IN ('index', 'trigger') AND sql IS NOT NULL ORDER BY type = 'trigger', name").all() as { sql: string }[]) out.push(`${i.sql};`);
  return `${out.join('\n')}\n`;
}

let dump: string;
const ids = { u1: 'User1AAAAAAAAAAA', u2: 'User2AAAAAAAAAAA', ws: 'WorkspaceAAAAAAA', board: 'BoardAAAAAAAAAAA', group: 'GroupAAAAAAAAAAA', item: 'ItemAAAAAAAAAAAA', sub: 'SubItemAAAAAAAAA', att: 'AttachAAAAAAAAAA' };
const keys = { att: `ws/${ids.ws}/boards/${ids.board}/${ids.att}`, avatar: `users/${ids.u1}/avatar-AvatarAA`, doc: `ws/${ids.ws}/docs/DocAAAAAAAAAAAA/PdfAAAAAAAAAAAA` };

beforeAll(() => {
  const db = openDatabase(join(root, 'source.sqlite'), { journal: 'DELETE' });
  applyMigrations(db, readMigrationsDir('migrations'));
  const t = 1_790_000_000_000;
  db.prepare('INSERT INTO users (id, email, name, password_hash, avatar_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(ids.u1, SECRET_EMAIL, 'Person One', SECRET_HASH, keys.avatar, t, t);
  db.prepare('INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').run(ids.u2, 'second.person@example.com', 'Person Two', SECRET_HASH, t, t);
  db.prepare('INSERT INTO workspaces (id, name, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(ids.ws, 'Synthetic', ids.u1, t, t);
  db.prepare("INSERT INTO workspace_members (workspace_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?)").run(ids.ws, ids.u1, t);
  db.prepare("INSERT INTO workspace_members (workspace_id, user_id, role, joined_at) VALUES (?, ?, 'member', ?)").run(ids.ws, ids.u2, t);
  db.prepare('INSERT INTO boards (id, workspace_id, name, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').run(ids.board, ids.ws, 'Board', ids.u1, t, t);
  db.prepare('INSERT INTO groups (id, workspace_id, board_id, name, position, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(ids.group, ids.ws, ids.board, 'Group', 1024.0, t);
  db.prepare('INSERT INTO items (id, workspace_id, board_id, group_id, name, description, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(ids.item, ids.ws, ids.board, ids.group, 'Item', TRICKY, 1.5, ids.u1, t, t);
  db.prepare('INSERT INTO items (id, workspace_id, board_id, group_id, parent_item_id, name, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(ids.sub, ids.ws, ids.board, ids.group, ids.item, 'Sub', 0.25, ids.u2, t, t);
  db.prepare("INSERT INTO attachments (id, workspace_id, board_id, item_id, scope, uploader_id, file_name, content_type, size, r2_key, created_at) VALUES (?, ?, ?, ?, 'item', ?, 'a.pdf', 'application/pdf', ?, ?, ?)").run(ids.att, ids.ws, ids.board, ids.item, ids.u1, PDF.length, keys.att, t);
  db.prepare("INSERT INTO rate_limits VALUES (?, ?, 1)").run(`login:email:${SECRET_EMAIL}`, t);
  db.prepare("INSERT INTO documents (id, workspace_id, title, content_json, created_by, created_at, updated_at) VALUES ('DocAAAAAAAAAAAA', ?, 'Long', ?, ?, ?, ?)").run(ids.ws, JSON.stringify({ type: 'doc', text: 'x'.repeat(250_000) }), ids.u1, t, t);
  dump = d1Dump(db);
  db.close();
  writeFileSync(join(root, 'dump.sql'), dump);
  mkdirSync(join(root, 'objects', ...keys.att.split('/').slice(0, -1)), { recursive: true });
  writeFileSync(join(root, 'objects', ...keys.att.split('/')), PDF);
  mkdirSync(join(root, 'objects', 'users', ids.u1), { recursive: true });
  writeFileSync(join(root, 'objects', ...keys.avatar.split('/')), PNG);
});

const report = (dir: string) => JSON.parse(readFileSync(join(dir, 'migration-report.json'), 'utf8'));
const reportText = (dir: string) => readFileSync(join(dir, 'migration-report.json'), 'utf8') + readFileSync(join(dir, 'migration-report.md'), 'utf8');

describe('import-d1-dump.mjs', () => {
  const data = join(root, 'data');

  it('imports a D1 export with the exact schema and every row', () => {
    const r = run('import-d1-dump.mjs', join(root, 'dump.sql'), data);
    expect(r.code, r.out).toBe(0);
    const imp = report(data).import;
    expect(imp.ok).toBe(true);
    expect(imp.schema.differences).toEqual([]);
    expect(imp.migrations.pending).toEqual([]);
    expect(imp.failedRows).toEqual([]);
    expect(imp.tables.items).toMatchObject({ dump: 2, database: 2 });
    expect(imp.nulFixups).toBe(1);
    const db = new DatabaseSync(join(data, 'db.sqlite'), { readOnly: true });
    expect((db.prepare('SELECT hex(CAST(description AS BLOB)) AS h FROM items WHERE id = ?').get(ids.item) as { h: string }).h).toBe(Buffer.from(TRICKY).toString('hex').toUpperCase());
    expect(imp.textWithNul).toEqual({ items: 1 });
    expect((db.prepare('SELECT password_hash FROM users WHERE id = ?').get(ids.u1) as { password_hash: string }).password_hash).toBe(SECRET_HASH);
    expect(db.prepare("SELECT typeof(position) AS t FROM groups").get()).toEqual({ t: 'real' });
    expect((db.prepare("SELECT count(*) AS n FROM sqlite_master WHERE name LIKE '\\_cf\\_%' ESCAPE '\\'").get() as { n: number }).n).toBe(0);
    db.close();
    expect(reportText(data)).not.toContain(SECRET_EMAIL);
    expect(reportText(data)).not.toContain(SECRET_HASH);
    expect(r.out).not.toContain(SECRET_EMAIL);
  });

  it('never overwrites without --replace, keeps a copy with it, and is idempotent', () => {
    expect(run('import-d1-dump.mjs', join(root, 'dump.sql'), data).code).toBe(2);
    const r = run('import-d1-dump.mjs', join(root, 'dump.sql'), data, '--replace');
    expect(r.code, r.out).toBe(0);
    const imp = report(data).import;
    expect(imp.previousRun.identical).toBe(true);
    expect(readdirSync(data).some((f) => f.startsWith('db.sqlite.bak-'))).toBe(true);
    expect(readdirSync(data).filter((f) => f.startsWith('.import-'))).toEqual([]);
  });

  it('refuses to touch the data of a running server', () => {
    writeFileSync(join(data, 'server.lock'), JSON.stringify({ pid: process.pid, host: (process.getBuiltinModule('node:os') as typeof import('node:os')).hostname(), startedAt: 'now' }));
    try {
      const r = run('import-d1-dump.mjs', join(root, 'dump.sql'), data, '--replace');
      expect(r.code).toBe(2);
      expect(r.out).toContain('Stop it first');
    } finally {
      (process.getBuiltinModule('node:fs') as typeof import('node:fs')).unlinkSync(join(data, 'server.lock'));
    }
  });

  it('records duplicate primary keys and failed rows by key only, and imports nothing', () => {
    const dir = join(root, 'dup');
    const dupLine = dump.split('\n').find((l) => l.startsWith('INSERT INTO "users"') && l.includes(ids.u1))!;
    writeFileSync(join(root, 'dup.sql'), `${dump}${dupLine.replace('Person One', 'Someone Else')}\n`);
    const r = run('import-d1-dump.mjs', join(root, 'dup.sql'), dir);
    expect(r.code).toBe(1);
    const imp = report(dir).import;
    expect(imp.ok).toBe(false);
    expect(imp.duplicates).toEqual([{ table: 'users', primaryKey: ids.u1 }]);
    expect(imp.failedRows).toEqual([{ table: 'users', primaryKey: ids.u1, reason: 'duplicate primary key' }]);
    expect(existsSync(join(dir, 'db.sqlite'))).toBe(false);
    expect(reportText(dir)).not.toContain('Someone Else');
    expect(reportText(dir)).not.toContain(SECRET_EMAIL);
  });

  it('lists every missing relationship and accepts them only when told to', () => {
    const dir = join(root, 'fk');
    const orphan = `INSERT INTO "workspace_members" ("workspace_id","user_id","role","joined_at") VALUES('${ids.ws}','GhostAAAAAAAAAAA','viewer',1);`;
    writeFileSync(join(root, 'fk.sql'), `${dump}${orphan}\n`);
    expect(run('import-d1-dump.mjs', join(root, 'fk.sql'), dir).code).toBe(1);
    expect(report(dir).import.foreignKeyViolations).toEqual([{ table: 'workspace_members', primaryKey: `${ids.ws},GhostAAAAAAAAAAA`, column: 'user_id', parent: 'users' }]);
    expect(existsSync(join(dir, 'db.sqlite'))).toBe(false);
    const r = run('import-d1-dump.mjs', join(root, 'fk.sql'), dir, '--accept-fk-violations');
    expect(r.code, r.out).toBe(0);
    expect(report(dir).import.acceptedForeignKeyViolations).toBe(true);
  });

  it('hashes keys that are not ids (emails, IPs, tokens) in reports', () => {
    const dir = join(root, 'rl');
    const dupLimit = dump.split('\n').find((l) => l.startsWith('INSERT INTO "rate_limits"'))!;
    writeFileSync(join(root, 'rl.sql'), `${dump}${dupLimit}\n`);
    run('import-d1-dump.mjs', join(root, 'rl.sql'), dir);
    const key = report(dir).import.duplicates[0].primaryKey;
    expect(key).toMatch(/^#[0-9a-f]{12}$/);
    expect(reportText(dir)).not.toContain(SECRET_EMAIL);
  });
});

describe('copy-r2-objects.mjs and verify-data-dir.mjs', () => {
  const data = join(root, 'data');

  it('copies referenced objects from a folder, with the metadata the Worker gave them, idempotently', () => {
    const r = run('copy-r2-objects.mjs', data, '--from-dir', join(root, 'objects'));
    expect(r.code, r.out).toBe(0);
    const files = report(data).files;
    expect(files).toMatchObject({ referenced: 2, copied: 2, verified: 2, missing: [], sizeMismatches: [] });
    const store = new FileStore(join(data, 'files'), openRuntimeDatabase(join(data, 'runtime.sqlite')));
    expect(store.head('FILES', keys.att)).toMatchObject({ size: PDF.length, httpMetadata: { contentType: 'application/pdf' }, customMetadata: { uploader: ids.u1 } });
    expect(store.head('FILES', keys.avatar)).toMatchObject({ httpMetadata: { contentType: 'image/png' }, sha256: createHash('sha256').update(PNG).digest('hex') });
    const again = run('copy-r2-objects.mjs', data, '--from-dir', join(root, 'objects'));
    expect(again.code).toBe(0);
    expect(report(data).files).toMatchObject({ copied: 0, alreadyPresent: 2 });
    expect(run('verify-data-dir.mjs', data).code).toBe(0);
    expect(report(data).verify.ok).toBe(true);
  });

  it('reports missing objects and size mismatches', () => {
    const dir = join(root, 'data-missing');
    run('import-d1-dump.mjs', join(root, 'dump.sql'), dir);
    const db = new DatabaseSync(join(dir, 'db.sqlite'));
    db.prepare('UPDATE attachments SET size = size + 1').run();
    db.prepare("UPDATE workspaces SET logo_key = 'ws/x/logo-missing'").run();
    db.close();
    const r = run('copy-r2-objects.mjs', dir, '--from-dir', join(root, 'objects'));
    expect(r.code).toBe(1);
    const files = report(dir).files;
    expect(files.missing).toEqual([{ kind: 'logo', id: ids.ws, note: 'not found in the folder' }]);
    expect(files.sizeMismatches).toEqual([{ kind: 'attachment', id: ids.att, expected: PDF.length + 1, actual: PDF.length }]);
    expect(run('verify-data-dir.mjs', dir).code).toBe(1);
  });

  it('verify-data-dir detects a changed or lost file', () => {
    const store = new FileStore(join(data, 'files'), openRuntimeDatabase(join(data, 'runtime.sqlite')));
    const o = store.head('FILES', keys.att)!;
    const file = store.path('FILES', keys.att, o.version);
    try {
      writeFileSync(file, Buffer.from('%PDF-1.4 same size!'.slice(0, PDF.length)));
      expect(run('verify-data-dir.mjs', data).code).toBe(1);
      expect(report(data).verify.problems.join(' ')).toContain('sha256 mismatch');
      writeFileSync(file, Buffer.from('%PDF-1.4 a different length'));
      expect(run('verify-data-dir.mjs', data).code).toBe(1);
      expect(report(data).verify.problems.join(' ')).toContain('size mismatch');
      (process.getBuiltinModule('node:fs') as typeof import('node:fs')).unlinkSync(file);
      expect(run('verify-data-dir.mjs', data).code).toBe(1);
      expect(report(data).verify.problems.join(' ')).toContain('file missing');
    } finally {
      writeFileSync(file, PDF);
    }
    expect(run('verify-data-dir.mjs', data).code).toBe(0);
  });
});

describe('export-for-d1.mjs', () => {
  it('writes SQL that loads into an empty database with identical data, chunking long text, plus the objects', () => {
    const data = join(root, 'data');
    const out = join(root, 'rollback', 'rollback.sql');
    const r = run('export-for-d1.mjs', data, out, '--files', join(root, 'rollback', 'files'));
    expect(r.code, r.out).toBe(0);
    const ex = report(data).export;
    expect(ex.roundTrip).toBe(true);
    expect(ex.tables.items).toBe(2);
    const sql = readFileSync(out, 'utf8');
    expect(sql).toContain("CAST(X'");
    expect(Math.max(...sql.split('\n').map((l) => l.length))).toBeLessThan(100_000);
    expect(sql).toMatch(/UPDATE "documents" SET "content_json" = "content_json" \|\| '/);
    expect(sql.indexOf('CREATE TABLE users')).toBeLessThan(sql.indexOf('INSERT INTO "attachments"'));
    const manifest = JSON.parse(readFileSync(join(root, 'rollback', 'files', 'manifest.json'), 'utf8'));
    expect(manifest.map((m: { key: string }) => m.key).sort()).toEqual([keys.att, keys.avatar].sort());
    expect(readFileSync(join(root, 'rollback', 'files', 'upload-to-r2.sh'), 'utf8')).toContain(`"$BUCKET"/'${keys.att}'`);
    // ... and the exported file imports back with the same checksums.
    const back = join(root, 'data-back');
    expect(run('import-d1-dump.mjs', out, back).code).toBe(0);
    const a = report(data).import.tables;
    const b = report(back).import.tables;
    for (const t of Object.keys(a)) expect(b[t]?.sha256, t).toBe(a[t].sha256);
  });
});

describe('backup-data-dir.mjs', () => {
  it('copies a data folder consistently and the copy verifies', () => {
    const data = join(root, 'data');
    const backup = join(root, 'backup');
    const r = run('backup-data-dir.mjs', data, backup);
    expect(r.code, r.out).toBe(0);
    expect(r.out).toContain('2 objects');
    expect(run('backup-data-dir.mjs', data, backup).code).toBe(2);
    expect(run('verify-data-dir.mjs', backup).code).toBe(0);
    const a = report(data).verify.tables;
    const b = report(backup).verify.tables;
    for (const t of Object.keys(a)) expect(b[t].sha256, t).toBe(a[t].sha256);
  });
});
