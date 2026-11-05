// D1 parity: the same operations against Miniflare's D1 (workerd, the
// reference the Worker suite runs on) and against the Node binding, with the
// outcomes compared. Fields that describe the engine rather than the data
// (served_by, durations, sizes, rows read/written) are left out.

import { readD1Migrations } from '@cloudflare/vitest-plugin';
import { getPlatformProxy } from 'wrangler';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { NodeD1Database } from '../src/node/bindings/d1.ts';
import { D1_MIGRATIONS_DDL, applyMigrations, readMigrationsDir, schemaSnapshot } from '../src/node/store/migrations.ts';
import { DatabaseSync, openDatabase } from '../src/node/store/sqlite.ts';

type Proxy = Awaited<ReturnType<typeof getPlatformProxy>>;
let proxy: Proxy;
let reference: D1Database;
let node: NodeD1Database;

beforeAll(async () => {
  proxy = await getPlatformProxy({ configPath: 'wrangler.jsonc', persist: false });
  reference = (proxy.env as { DB: D1Database }).DB;
  node = new NodeD1Database(openDatabase(':memory:', { journal: 'DELETE' }));
}, 60_000);

afterAll(async () => {
  await proxy?.dispose();
});

function normalize(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(normalize);
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      if (['served_by', 'served_by_region', 'served_by_colo', 'duration', 'timings', 'size_after', 'rows_read', 'rows_written', 'changed_db', 'total_attempts'].includes(k)) continue;
      o[k] = normalize(x);
    }
    return o;
  }
  return v;
}

async function outcome(fn: () => unknown): Promise<unknown> {
  try {
    return { ok: normalize(await fn()) };
  } catch (e) {
    const err = e as Error & { cause?: Error };
    const clean = (s?: string) => s?.replace(/ at offset \d+/, '');
    return { error: clean(err.message), cause: clean(err.cause?.message) };
  }
}

type Case = [string, (db: D1Database) => unknown];

const cases: Case[] = [
  // Miniflare writes its own metadata row when it creates a database, which
  // moves last_insert_rowid(); one insert puts both engines at the same value.
  ['seed last_insert_rowid', (db) => db.prepare('CREATE TABLE seed (a)').run().then(() => db.prepare('INSERT INTO seed VALUES (1)').run())],
  ['create tables', (db) => db.batch([
    db.prepare('CREATE TABLE p (id TEXT PRIMARY KEY)'),
    db.prepare('CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT UNIQUE, r REAL, n INTEGER, p TEXT REFERENCES p(id) ON DELETE CASCADE)'),
    db.prepare('CREATE TABLE x (a INTEGER PRIMARY KEY, b TEXT)'),
  ])],
  ['number and boolean binding types', (db) => db.prepare('SELECT typeof(?) a, typeof(?) b, typeof(?) c, typeof(?) d, typeof(?) e, ? f').bind(5, 5.5, true, 2 ** 53 + 2, -0, 1e300).first()],
  ['text binding type', (db) => db.prepare('SELECT typeof(?) AS t').bind('5').first()],
  ['booleans', (db) => db.prepare('SELECT ? AS t, ? AS f').bind(true, false).first()],
  ['repeated column names', (db) => db.prepare('SELECT 1 AS a, 2 AS a, 3 AS b').all()],
  ['raw', (db) => db.prepare('SELECT 1 AS a, 2 AS a, 3 AS b').raw()],
  ['raw with column names', (db) => db.prepare('SELECT 1 AS a, 2 AS a, 3 AS b').raw({ columnNames: true })],
  ['undefined binding', (db) => db.prepare('SELECT ?').bind(undefined).first()],
  ['object binding', (db) => db.prepare('SELECT ?').bind({ a: 1 }).first()],
  ['bigint binding', (db) => db.prepare('SELECT ?').bind(5n).first()],
  ['byte array binding', (db) => db.prepare('SELECT ? AS a, typeof(?) AS t').bind([1, 2], new Uint8Array([1])).first()],
  ['ArrayBuffer binding', (db) => db.prepare('SELECT ? AS b').bind(new Uint8Array([1, 2, 3]).buffer).first()],
  ['null binding', (db) => db.prepare('SELECT ? AS n').bind(null).first()],
  ['NaN and Infinity', (db) => db.prepare('SELECT ? AS x, ? AS y').bind(Number.NaN, Number.POSITIVE_INFINITY).first()],
  ['large integers and reals', (db) => db.prepare('SELECT 9007199254740993 AS x, 1730000000000 AS y, 1.0 AS z, 0.1 + 0.2 AS w').first()],
  ['too few bindings', (db) => db.prepare('SELECT ?, ?').bind(1).first()],
  ['too many bindings', (db) => db.prepare('SELECT ?').bind(1, 2).first()],
  ['numbered parameters', (db) => db.prepare('SELECT ?2 AS b, ?1 AS a, ?2 AS c').bind('x', 'y').first()],
  ['numbered parameter gap', (db) => db.prepare('SELECT ?3 AS c').bind(1, 2, 3).first()],
  ['numbered and anonymous', (db) => db.prepare('SELECT ?2 AS b, ? AS c').bind(1, 2, 3).first()],
  ['named parameter bound by position', (db) => db.prepare('SELECT :a AS a').bind(1).first()],
  ['insert', (db) => db.prepare('INSERT INTO t (name, r) VALUES (?, ?)').bind('a', 1).run()],
  ['insert returning via run', (db) => db.prepare('INSERT INTO t (name, r) VALUES (?, ?) RETURNING id, name').bind('b', 2.5).run()],
  ['insert returning via all', (db) => db.prepare('INSERT INTO t (name, r) VALUES (?, ?) RETURNING id, name').bind('c', 2.5).all()],
  ['insert returning via first', (db) => db.prepare('INSERT INTO t (name, r) VALUES (?, ?) RETURNING id, name').bind('d', 2.5).first()],
  ['unique violation', (db) => db.prepare('INSERT INTO t (name) VALUES (?)').bind('a').run()],
  ['primary key violation', (db) => db.batch([db.prepare("INSERT INTO p VALUES ('k')"), db.prepare("INSERT INTO p VALUES ('k')")])],
  ['foreign key violation', (db) => db.prepare('INSERT INTO t (name, p) VALUES (?, ?)').bind('z', 'nope').run()],
  ['not null violation', (db) => db.prepare('CREATE TABLE nn (a TEXT NOT NULL)').run().then(() => db.prepare('INSERT INTO nn VALUES (NULL)').run())],
  ['insert or ignore', (db) => db.prepare('INSERT OR IGNORE INTO t (name) VALUES (?)').bind('a').run()],
  ['update', (db) => db.prepare('UPDATE t SET r = r + 1').run()],
  ['select', (db) => db.prepare('SELECT * FROM t WHERE id > ?1 AND id < ?2 ORDER BY id').bind(0, 100).all()],
  ['select via run', (db) => db.prepare('SELECT id, name FROM t ORDER BY id').run()],
  ['first without rows', (db) => db.prepare('SELECT * FROM t WHERE id = ?').bind(999).first()],
  ['first column', (db) => db.prepare('SELECT name FROM t WHERE id = ?').bind(1).first('name')],
  ['first column without rows', (db) => db.prepare('SELECT name FROM t WHERE id = ?').bind(999).first('name')],
  ['first missing column', (db) => db.prepare('SELECT name FROM t WHERE id = ?').bind(1).first('zzz')],
  ['first null column', (db) => db.prepare('SELECT NULL AS x').first('x')],
  ['cascade changes', (db) => db.batch([db.prepare("INSERT INTO p VALUES ('c1')"), db.prepare("INSERT INTO t (name, p) VALUES ('ca', 'c1')"), db.prepare("INSERT INTO t (name, p) VALUES ('cb', 'c1')")]).then(() => db.prepare("DELETE FROM p WHERE id = 'c1'").run())],
  ['changes of a select after an update', (db) => db.prepare('UPDATE t SET n = 1').run().then(() => db.prepare('SELECT 1 AS one').run())],
  ['syntax error', (db) => db.prepare('SELEC 1').first()],
  ['no such table', (db) => db.prepare('SELECT * FROM nope').all()],
  ['double-quoted string literal', (db) => db.prepare('SELECT "abc" AS x').first()],
  ['json_set with a bound number', (db) => db.prepare("SELECT json_set('{}', '$.a', json(?)) AS j, json_set('{}', '$.b', ?) AS k").bind('5', 5).first()],
  ['with clause', (db) => db.prepare('WITH c AS (SELECT ? AS v) SELECT v FROM c').bind(5).first()],
  ['update returning', (db) => db.prepare('UPDATE t SET name = ? WHERE id = 1 RETURNING id, name').bind('aa').first()],
  ['batch', (db) => db.batch([db.prepare('INSERT INTO t (name) VALUES (?)').bind('e'), db.prepare('SELECT count(*) AS n FROM t')])],
  ['batch failure', (db) => db.batch([db.prepare('INSERT INTO t (name) VALUES (?)').bind('f'), db.prepare('INSERT INTO t (name) VALUES (?)').bind('aa')])],
  ['batch failure rolled back', (db) => db.prepare("SELECT count(*) AS n FROM t WHERE name = 'f'").first()],
  ['batch syntax error', (db) => db.batch([db.prepare('SELECT 1'), db.prepare('SELEC 2')])],
  ['empty batch', (db) => db.batch([])],
  ['empty statement', (db) => db.prepare('').all()],
  ['comment only', (db) => db.prepare('-- hi').all()],
  ['trailing semicolon', (db) => db.prepare('SELECT 1 AS a;').first()],
  ['double semicolon', (db) => db.prepare('SELECT 1 AS a;;').first()],
  ['multiple statements', (db) => db.prepare('INSERT INTO x (b) VALUES (9); SELECT count(*) AS n FROM x').all()],
  ['multiple statements with parameters', (db) => db.prepare('SELECT ?; SELECT ?').bind(1).all()],
  ['transaction statement', (db) => db.prepare('BEGIN').run()],
  ['savepoint', (db) => db.prepare('SAVEPOINT s').run()],
  ['attach', (db) => db.prepare("ATTACH DATABASE 'x.db' AS y").run()],
  ['vacuum', (db) => db.prepare('VACUUM').run()],
  ['pragma journal_mode', (db) => db.prepare('PRAGMA journal_mode').first()],
  ['pragma integrity_check', (db) => db.prepare('PRAGMA integrity_check').first()],
  ['pragma table_info', (db) => db.prepare('PRAGMA table_info(x)').all()],
  ['pragma quick_check', (db) => db.prepare('PRAGMA quick_check').first()],
  ['pragma foreign_keys off has no effect', (db) => db.prepare('PRAGMA foreign_keys = OFF').run().then(() => db.prepare('PRAGMA foreign_keys').first())],
  ['pragma defer_foreign_keys', (db) => db.prepare('PRAGMA defer_foreign_keys = ON').run()],
  ['create trigger', (db) => db.prepare('CREATE TABLE tr (a)').run().then(() => db.prepare('CREATE TRIGGER trg AFTER INSERT ON tr BEGIN UPDATE tr SET a = a + 1; END').run())],
  ['trigger fires', (db) => db.prepare('INSERT INTO tr VALUES (1)').run().then(() => db.prepare('SELECT a FROM tr').all())],
  ['exec', (db) => db.exec('INSERT INTO x (b) VALUES (1);\n\nINSERT INTO x (b) VALUES (2);').then((r) => r.count)],
  ['exec is atomic', (db) => db.exec("INSERT INTO x (b) VALUES ('atomic');\nINSERT INTO nope VALUES (1);").catch(() => db.prepare("SELECT count(*) AS n FROM x WHERE b = 'atomic'").first())],
];

describe('D1 parity with Miniflare', () => {
  it('every operation has the same outcome on Node as on workerd', async () => {
    const differences: string[] = [];
    for (const [name, fn] of cases) {
      const expected = await outcome(() => fn(reference));
      const actual = await outcome(() => fn(node));
      if (JSON.stringify(actual) !== JSON.stringify(expected)) differences.push(`${name}\n  workerd: ${JSON.stringify(expected)}\n  node:    ${JSON.stringify(actual)}`);
    }
    expect(differences, differences.join('\n')).toEqual([]);
  }, 60_000);

  it('migrations give exactly the schema D1 has', async () => {
    const db = reference;
    await db.prepare(D1_MIGRATIONS_DDL).run();
    for (const m of await readD1Migrations('migrations')) {
      await db.batch([...m.queries.map((q) => db.prepare(q)), db.prepare('INSERT INTO "d1_migrations" (name) values (?)').bind(m.name)]);
    }
    const d1 = (
      await db
        .prepare(
          "SELECT type, name, tbl_name, sql FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' AND substr(name, 1, 4) <> '_cf_' AND name NOT IN ('seed', 'p', 't', 'x', 'nn', 'tr', 'trg') ORDER BY type, name",
        )
        .all()
    ).results;
    const local = new DatabaseSync(':memory:');
    applyMigrations(local, readMigrationsDir('migrations'));
    expect(schemaSnapshot(local)).toEqual(d1);
    local.close();
  }, 60_000);
});
