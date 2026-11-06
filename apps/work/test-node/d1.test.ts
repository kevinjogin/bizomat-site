import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { NodeD1Database } from '../src/node/bindings/d1.ts';
import { openDatabase, pragma } from '../src/node/store/sqlite.ts';
import { tempDir } from './helpers.ts';

const dir = tempDir('work-d1-');
const raw = openDatabase(join(dir, 'db.sqlite'));
const db = new NodeD1Database(raw);

beforeAll(async () => {
  await db.batch([
    db.prepare('CREATE TABLE p (id TEXT PRIMARY KEY)'),
    db.prepare('CREATE TABLE c (id TEXT PRIMARY KEY, p TEXT NOT NULL REFERENCES p(id) ON DELETE CASCADE, n INTEGER, r REAL, name TEXT UNIQUE)'),
    db.prepare('CREATE TABLE seq (id INTEGER PRIMARY KEY AUTOINCREMENT, v TEXT)'),
  ]);
});

const errorOf = async (p: Promise<unknown> | (() => unknown)) => {
  try {
    await (typeof p === 'function' ? p() : p);
  } catch (e) {
    return e as Error;
  }
  throw new Error('expected an error');
};

describe('D1 binding: database file settings', () => {
  it('uses WAL, full sync, foreign keys and a busy timeout', () => {
    expect(pragma(raw, 'journal_mode')).toBe('wal');
    expect(pragma(raw, 'synchronous')).toBe(2);
    expect(pragma(raw, 'foreign_keys')).toBe(1);
    expect(Number(pragma(raw, 'busy_timeout'))).toBe(5000);
  });
});

describe('D1 binding: binding values', () => {
  it('binds ? and ?NNN parameters', async () => {
    expect(await db.prepare('SELECT ? AS a, ? AS b').bind(1, 'x').first()).toEqual({ a: 1, b: 'x' });
    expect(await db.prepare('SELECT ?2 AS b, ?1 AS a, ?2 AS c').bind('x', 'y').first()).toEqual({ b: 'y', a: 'x', c: 'y' });
    expect(await db.prepare('SELECT ?3 AS c').bind(1, 2, 3).first()).toEqual({ c: 3 });
  });

  it('turns booleans into 1/0 and binds numbers as REAL, like D1', async () => {
    expect(await db.prepare('SELECT ? AS t, ? AS f').bind(true, false).first()).toEqual({ t: 1, f: 0 });
    expect(await db.prepare('SELECT typeof(?) AS a, typeof(?) AS b, typeof(?) AS c').bind(5, 2.5, true).first()).toEqual({ a: 'real', b: 'real', c: 'real' });
    expect(await db.prepare("SELECT json_set('{}', '$.b', ?) AS j").bind(5).first('j')).toBe('{"b":5.0}');
  });

  it('rejects undefined, objects and bigint synchronously in bind()', () => {
    expect(() => db.prepare('SELECT ?').bind(undefined)).toThrow("D1_TYPE_ERROR: Type 'undefined' not supported for value 'undefined'");
    expect(() => db.prepare('SELECT ?').bind({ a: 1 })).toThrow("D1_TYPE_ERROR: Type 'object' not supported for value '[object Object]'");
    expect(() => db.prepare('SELECT ?').bind(5n)).toThrow("D1_TYPE_ERROR: Type 'bigint' not supported for value '5'");
  });

  it('binds byte arrays as BLOBs and returns BLOBs as arrays of numbers', async () => {
    const r = await db.prepare('SELECT ? AS a, ? AS b, ? AS c, typeof(?) AS t').bind(new Uint8Array([1, 2]), new Uint8Array([3]).buffer, [4, 5], new Uint8Array([9])).first();
    expect(r).toEqual({ a: [1, 2], b: [3], c: [4, 5], t: 'blob' });
  });

  it('returns null for NaN and Infinity, and loses precision past 2^53 as D1 does', async () => {
    expect(await db.prepare('SELECT ? AS x, ? AS y').bind(Number.NaN, Number.POSITIVE_INFINITY).first()).toEqual({ x: null, y: null });
    expect(await db.prepare('SELECT 9007199254740993 AS x, 1730000000000 AS y').first()).toEqual({ x: 9007199254740992, y: 1730000000000 });
  });

  it('requires exactly as many bindings as the statement has', async () => {
    expect((await errorOf(db.prepare('SELECT ?, ?').bind(1).first())).message).toBe('D1_ERROR: Wrong number of parameter bindings for SQL query.');
    expect((await errorOf(db.prepare('SELECT ?').bind(1, 2).first())).message).toBe('D1_ERROR: Wrong number of parameter bindings for SQL query.');
    expect((await errorOf(db.prepare('SELECT ?').first())).message).toBe('D1_ERROR: Wrong number of parameter bindings for SQL query.');
  });
});

describe('D1 binding: results', () => {
  it('first() is null without rows, first(col) reads one column and checks it exists', async () => {
    expect(await db.prepare('SELECT * FROM p WHERE id = ?').bind('none').first()).toBeNull();
    expect(await db.prepare('SELECT * FROM p WHERE id = ?').bind('none').first('id')).toBeNull();
    expect(await db.prepare("SELECT 'v' AS x").first('x')).toBe('v');
    expect(await db.prepare('SELECT NULL AS x').first('x')).toBeNull();
    const e = await errorOf(db.prepare("SELECT 'v' AS x").first('zzz'));
    expect(e.message).toBe('D1_COLUMN_NOTFOUND: Column not found (zzz)');
  });

  it('all() returns { results, success, meta } with plain objects; a repeated column keeps the last value', async () => {
    const r = await db.prepare('SELECT 1 AS a, 2 AS a, 3 AS b').all();
    expect(r.success).toBe(true);
    expect(r.results).toEqual([{ a: 2, b: 3 }]);
    expect(Object.getPrototypeOf(r.results[0])).toBe(Object.prototype);
    expect(r.meta).toMatchObject({ changes: 0, changed_db: false, served_by_primary: true });
    expect(typeof r.meta.duration).toBe('number');
    expect(typeof r.meta.size_after).toBe('number');
  });

  it('raw() returns arrays, optionally with column names first', async () => {
    expect(await db.prepare('SELECT 1 AS a, 2 AS a, 3 AS b').raw()).toEqual([[1, 2, 3]]);
    expect(await db.prepare('SELECT 1 AS a, 2 AS a, 3 AS b').raw({ columnNames: true })).toEqual([['a', 'a', 'b'], [1, 2, 3]]);
  });

  it('run() reports changes and last_row_id, and returns RETURNING rows', async () => {
    await db.prepare('INSERT INTO p (id) VALUES (?)').bind('p1').run();
    const ins = await db.prepare('INSERT INTO seq (v) VALUES (?)').bind('a').run();
    expect(ins.meta.changes).toBe(1);
    expect(ins.meta.last_row_id).toBe(1);
    expect(ins.meta.changed_db).toBe(true);
    const ret = await db.prepare('INSERT INTO seq (v) VALUES (?) RETURNING id, v').bind('b').run();
    expect(ret.results).toEqual([{ id: 2, v: 'b' }]);
    expect(await db.prepare('INSERT INTO seq (v) VALUES (?) RETURNING id').bind('c').first('id')).toBe(3);
    const upd = await db.prepare('UPDATE seq SET v = v || ?').bind('!').run();
    expect(upd.meta.changes).toBe(3);
    const sel = await db.prepare('SELECT 1').run();
    expect(sel.meta.changes).toBe(0);
  });

  it('counts rows changed by foreign key actions in meta.changes (as D1 does)', async () => {
    await db.batch([
      db.prepare('INSERT INTO p (id) VALUES (?)').bind('cascade'),
      db.prepare('INSERT INTO c (id, p) VALUES (?, ?)').bind('c1', 'cascade'),
      db.prepare('INSERT INTO c (id, p) VALUES (?, ?)').bind('c2', 'cascade'),
    ]);
    const del = await db.prepare('DELETE FROM p WHERE id = ?').bind('cascade').run();
    expect(del.meta.changes).toBe(3);
    expect(await db.prepare("SELECT count(*) AS n FROM c WHERE p = 'cascade'").first('n')).toBe(0);
  });

  it('INSERT OR IGNORE reports 0 changes when ignored', async () => {
    await db.prepare('INSERT INTO c (id, p, name) VALUES (?, ?, ?)').bind('u1', 'p1', 'unique-name').run();
    const r = await db.prepare('INSERT OR IGNORE INTO c (id, p, name) VALUES (?, ?, ?)').bind('u2', 'p1', 'unique-name').run();
    expect(r.meta.changes).toBe(0);
  });
});

describe('D1 binding: errors and constraints', () => {
  it('enforces foreign keys and formats errors like D1', async () => {
    const fk = await errorOf(db.prepare('INSERT INTO c (id, p) VALUES (?, ?)').bind('orphan', 'missing').run());
    expect(fk.message).toBe('D1_ERROR: FOREIGN KEY constraint failed: SQLITE_CONSTRAINT (extended: SQLITE_CONSTRAINT_FOREIGNKEY)');
    const uq = await errorOf(db.prepare('INSERT INTO p (id) VALUES (?)').bind('p1').run());
    expect(uq.message).toBe('D1_ERROR: UNIQUE constraint failed: p.id: SQLITE_CONSTRAINT (extended: SQLITE_CONSTRAINT_PRIMARYKEY)');
    const nn = await errorOf(db.prepare('INSERT INTO c (id) VALUES (?)').bind('nn').run());
    expect(nn.message).toContain('NOT NULL constraint failed: c.p: SQLITE_CONSTRAINT');
    expect((await errorOf(db.prepare('SELECT * FROM nope').all())).message).toBe('D1_ERROR: no such table: nope: SQLITE_ERROR');
    expect((await errorOf(db.prepare('SELEC 1').all())).message).toMatch(/^D1_ERROR: near "SELEC": syntax error/);
    expect(((await errorOf(db.prepare('SELEC 1').all())) as Error & { cause: Error }).cause.message).toMatch(/^near "SELEC"/);
  });

  it('compiles statements when they run, not in prepare()', () => {
    expect(() => db.prepare('THIS IS NOT SQL')).not.toThrow();
  });

  it('refuses transaction statements and unauthorised pragmas; PRAGMA foreign_keys cannot switch enforcement off', async () => {
    expect((await errorOf(db.prepare('BEGIN').run())).message).toMatch(/^D1_ERROR: To execute a transaction/);
    expect((await errorOf(db.prepare('SAVEPOINT x').run())).message).toMatch(/^D1_ERROR: To execute a transaction/);
    expect((await errorOf(db.prepare('PRAGMA journal_mode = DELETE').run())).message).toBe('D1_ERROR: not authorized: SQLITE_AUTH');
    expect((await errorOf(db.prepare("ATTACH DATABASE 'x.db' AS x").run())).message).toBe('D1_ERROR: not authorized: SQLITE_AUTH');
    expect((await db.prepare('PRAGMA table_info(p)').all()).results).toHaveLength(1);
    await db.prepare('PRAGMA foreign_keys = OFF').run();
    expect(await db.prepare('PRAGMA foreign_keys').first()).toEqual({ foreign_keys: 1 });
    expect(pragma(raw, 'journal_mode')).toBe('wal');
  });

  it('handles empty input and multiple statements like D1', async () => {
    expect((await errorOf(db.prepare('').all())).message).toBe('D1_ERROR: No SQL statements detected.');
    expect((await errorOf(db.prepare('-- nothing').all())).message).toBe('D1_ERROR: SQL code did not contain a statement.');
    expect((await errorOf(db.prepare('SELECT 1;;').all())).message).toBe('D1_ERROR: SQL code did not contain a statement.');
    expect(await db.prepare('SELECT 1 AS a;').first()).toEqual({ a: 1 });
    const multi = await db.prepare("INSERT INTO p (id) VALUES ('m1'); SELECT count(*) AS n FROM p WHERE id = 'm1'").all();
    expect(multi.results).toEqual([{ n: 1 }]);
    expect(multi.meta.changes).toBe(1);
    expect((await errorOf(db.prepare('SELECT ?; SELECT ?').bind(1).all())).message).toBe(
      'D1_ERROR: When executing multiple SQL statements in a single call, only the last statement can have parameters.',
    );
  });

  it('a failing multi-statement call changes nothing', async () => {
    await errorOf(db.prepare("INSERT INTO p (id) VALUES ('m2'); INSERT INTO nope VALUES (1)").run());
    expect(await db.prepare("SELECT count(*) AS n FROM p WHERE id = 'm2'").first('n')).toBe(0);
  });
});

describe('D1 binding: batch and exec', () => {
  it('batch() returns one result per statement', async () => {
    const r = await db.batch([db.prepare('INSERT INTO p (id) VALUES (?)').bind('b1'), db.prepare("SELECT count(*) AS n FROM p WHERE id = 'b1'")]);
    expect(r).toHaveLength(2);
    expect(r[0].meta.changes).toBe(1);
    expect(r[1].results).toEqual([{ n: 1 }]);
  });

  it('batch() is atomic: one failure rolls every statement back', async () => {
    const e = await errorOf(db.batch([db.prepare('INSERT INTO p (id) VALUES (?)').bind('b2'), db.prepare('INSERT INTO p (id) VALUES (?)').bind('p1')]));
    expect(e.message).toMatch(/^D1_ERROR: UNIQUE constraint failed: p.id/);
    expect(await db.prepare("SELECT count(*) AS n FROM p WHERE id = 'b2'").first('n')).toBe(0);
    expect(raw.isTransaction).toBe(false);
  });

  it('batch() of nothing is an error', async () => {
    expect((await errorOf(db.batch([]))).message).toBe('D1_ERROR: No SQL statements detected.');
  });

  it('exec() runs one statement per line, atomically', async () => {
    const r = await db.exec("INSERT INTO p (id) VALUES ('e1');\n\nINSERT INTO p (id) VALUES ('e2');");
    expect(r.count).toBe(2);
    const e = await errorOf(db.exec("INSERT INTO p (id) VALUES ('e3');\nINSERT INTO nope VALUES (1);"));
    expect(e.message).toBe('D1_EXEC_ERROR: Error in line 2: INSERT INTO nope VALUES (1);: no such table: nope: SQLITE_ERROR');
    expect(await db.prepare("SELECT count(*) AS n FROM p WHERE id = 'e3'").first('n')).toBe(0);
  });

  it('withSession() serves the same database', async () => {
    const s = db.withSession('first-primary');
    expect(await s.prepare("SELECT count(*) AS n FROM p WHERE id = 'e1'").first('n')).toBe(1);
    expect(s.getBookmark()).toBeNull();
  });
});
