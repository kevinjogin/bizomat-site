// D1Database over node:sqlite.
//
// The Worker code talks to this class exactly as it talks to D1. The behaviour
// follows what D1 does (checked against Miniflare's D1 in
// test-node/d1-parity.test.ts), not what node:sqlite does by default:
//
//  * statements are compiled when they run, not in prepare();
//  * bind() accepts numbers, strings, booleans (1/0), null and byte arrays,
//    and throws D1_TYPE_ERROR synchronously for undefined, objects and bigint;
//    numbers are bound as REAL, as D1 does;
//  * the number of bindings must match the statement (D1 rejects too few and
//    too many; node:sqlite would bind missing ones as NULL);
//  * every call runs inside one transaction, like D1: a multi-statement string
//    is atomic, PRAGMA foreign_keys has no effect, BEGIN/COMMIT/SAVEPOINT are
//    refused and only D1's PRAGMA allow-list is authorised;
//  * batch() runs all statements in one transaction and rolls all of them back
//    on the first error; exec() runs one statement per line, atomically;
//  * meta.changes is the change in total_changes() (rows changed by foreign key
//    actions count, as in D1); meta.last_row_id is last_insert_rowid();
//  * results are plain objects (a repeated column name keeps the last value),
//    integers beyond 2^53 lose precision and BLOBs come back as arrays of
//    numbers, as D1's JSON results do; non-finite numbers come back as null.
//
// node:sqlite is synchronous: a statement runs to completion before any other
// JavaScript runs, so a transaction never spans an await.

import type { DatabaseSync, StatementSync } from 'node:sqlite';
import { analyzeSql, type SqlAnalysis, type SqlStatement } from './sql-lexer.ts';

type Bound = null | number | string | Uint8Array;
type Mode = 'all' | 'first';

interface Executed {
  columns: string[];
  rows: unknown[][];
  meta: D1Meta & Record<string, unknown>;
}

const TRANSACTION_KEYWORDS = new Set(['BEGIN', 'COMMIT', 'END', 'ROLLBACK', 'SAVEPOINT', 'RELEASE']);
const READ_KEYWORDS = new Set(['SELECT', 'VALUES', 'EXPLAIN', 'PRAGMA']);
const SCHEMA_KEYWORDS = new Set(['CREATE', 'DROP', 'ALTER']);
/** PRAGMAs D1 authorises (https://developers.cloudflare.com/d1/sql-api/sql-statements/). */
const ALLOWED_PRAGMAS = new Set([
  'table_list',
  'table_info',
  'table_xinfo',
  'index_list',
  'index_info',
  'index_xinfo',
  'quick_check',
  'foreign_key_check',
  'foreign_key_list',
  'case_sensitive_like',
  'ignore_check_constraints',
  'legacy_alter_table',
  'recursive_triggers',
  'reverse_unordered_selects',
  'foreign_keys',
  'defer_foreign_keys',
  'optimize',
  'data_version',
]);
const TRANSACTION_MESSAGE =
  "To execute a transaction, please use the state.storage.transaction() or state.storage.transactionSync() APIs instead of the SQL BEGIN TRANSACTION or SAVEPOINT statements. The JavaScript API is safer because it will automatically roll back on exceptions, and because it interacts correctly with Durable Objects' automatic atomic write coalescing.";

const PRIMARY_CODES: Record<number, string> = {
  1: 'SQLITE_ERROR',
  2: 'SQLITE_INTERNAL',
  3: 'SQLITE_PERM',
  4: 'SQLITE_ABORT',
  5: 'SQLITE_BUSY',
  6: 'SQLITE_LOCKED',
  7: 'SQLITE_NOMEM',
  8: 'SQLITE_READONLY',
  9: 'SQLITE_INTERRUPT',
  10: 'SQLITE_IOERR',
  11: 'SQLITE_CORRUPT',
  12: 'SQLITE_NOTFOUND',
  13: 'SQLITE_FULL',
  14: 'SQLITE_CANTOPEN',
  15: 'SQLITE_PROTOCOL',
  16: 'SQLITE_EMPTY',
  17: 'SQLITE_SCHEMA',
  18: 'SQLITE_TOOBIG',
  19: 'SQLITE_CONSTRAINT',
  20: 'SQLITE_MISMATCH',
  21: 'SQLITE_MISUSE',
  22: 'SQLITE_NOLFS',
  23: 'SQLITE_AUTH',
  24: 'SQLITE_FORMAT',
  25: 'SQLITE_RANGE',
  26: 'SQLITE_NOTADB',
  27: 'SQLITE_NOTICE',
  28: 'SQLITE_WARNING',
};
const EXTENDED_CODES: Record<number, string> = {
  261: 'SQLITE_BUSY_RECOVERY',
  517: 'SQLITE_BUSY_SNAPSHOT',
  773: 'SQLITE_BUSY_TIMEOUT',
  262: 'SQLITE_LOCKED_SHAREDCACHE',
  275: 'SQLITE_CONSTRAINT_CHECK',
  531: 'SQLITE_CONSTRAINT_COMMITHOOK',
  787: 'SQLITE_CONSTRAINT_FOREIGNKEY',
  1043: 'SQLITE_CONSTRAINT_FUNCTION',
  1299: 'SQLITE_CONSTRAINT_NOTNULL',
  1555: 'SQLITE_CONSTRAINT_PRIMARYKEY',
  1811: 'SQLITE_CONSTRAINT_TRIGGER',
  2067: 'SQLITE_CONSTRAINT_UNIQUE',
  2323: 'SQLITE_CONSTRAINT_VTAB',
  2579: 'SQLITE_CONSTRAINT_ROWID',
  2835: 'SQLITE_CONSTRAINT_PINNED',
  3091: 'SQLITE_CONSTRAINT_DATATYPE',
  266: 'SQLITE_IOERR_READ',
  522: 'SQLITE_IOERR_SHORT_READ',
  778: 'SQLITE_IOERR_WRITE',
  1034: 'SQLITE_IOERR_FSYNC',
  3082: 'SQLITE_IOERR_NOMEM',
  267: 'SQLITE_CORRUPT_VTAB',
  1032: 'SQLITE_READONLY_DBMOVED',
};

/** An error shaped like the ones D1 throws: "D1_ERROR: <message>", with the bare message as cause. */
export function d1Error(message: string, prefix = 'D1_ERROR'): Error {
  return new Error(`${prefix}: ${message}`, { cause: new Error(message) });
}

/** "<sqlite message>: SQLITE_X (extended: SQLITE_X_Y)", the text D1 puts after its prefix. */
function sqliteMessage(e: unknown): string {
  const err = e as { message?: string; errcode?: number; code?: string };
  if (typeof err?.errcode === 'number') {
    const primary = err.errcode & 0xff;
    let msg = `${err.message}: ${PRIMARY_CODES[primary] ?? 'SQLITE_ERROR'}`;
    if (err.errcode !== primary) msg += ` (extended: ${EXTENDED_CODES[err.errcode] ?? String(err.errcode)})`;
    return msg;
  }
  return err?.message ?? String(e);
}

class D1Failure extends Error {
  /** The message without the D1_ERROR prefix (used by exec()). */
  inner: string;
  constructor(inner: string) {
    super(`D1_ERROR: ${inner}`, { cause: new Error(inner) });
    this.inner = inner;
  }
}

function fail(e: unknown): D1Failure {
  return e instanceof D1Failure ? e : new D1Failure(sqliteMessage(e));
}

function toBound(v: unknown): Bound {
  const t = typeof v;
  if (t === 'number' || t === 'string') return v as number | string;
  if (t === 'boolean') return v ? 1 : 0;
  if (t === 'object') {
    if (v === null) return null;
    if (Array.isArray(v) && v.every((b) => typeof b === 'number' && b >= 0 && b < 256)) return Uint8Array.from(v as number[]);
    if (v instanceof ArrayBuffer) return new Uint8Array(v.slice(0));
    if (ArrayBuffer.isView(v)) return new Uint8Array(v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength) as ArrayBuffer);
  }
  throw d1Error(`Type '${t}' not supported for value '${String(v)}'`, 'D1_TYPE_ERROR');
}

function fromSqlite(v: unknown): unknown {
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (v instanceof Uint8Array) return Array.from(v);
  return v;
}

function toObject(columns: string[], row: unknown[]): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (let i = 0; i < columns.length; i++) o[columns[i]] = fromSqlite(row[i]);
  return o;
}

const MAX_CACHED_STATEMENTS = 1000;

export class NodeD1Database implements D1Database {
  readonly #db: DatabaseSync;
  readonly #statements = new Map<string, StatementSync>();
  readonly #analyses = new Map<string, SqlAnalysis>();
  #counters: StatementSync | null = null;
  #size: StatementSync | null = null;
  #inTransaction = false;

  constructor(db: DatabaseSync) {
    this.#db = db;
  }

  prepare(query: string): D1PreparedStatement {
    return new NodeD1PreparedStatement(this, String(query), []);
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    if (!Array.isArray(statements) || statements.length === 0) throw new D1Failure('No SQL statements detected.');
    const own = statements.map((s) => {
      if (!(s instanceof NodeD1PreparedStatement) || s.database !== this) throw new TypeError('batch() expects statements prepared by this database');
      return s;
    });
    return this.#transaction('BEGIN IMMEDIATE', () => own.map((s) => this.#execute(s.sql, s.params, 'all'))).map((r) => result<T>(r));
  }

  async exec(query: string): Promise<D1ExecResult> {
    const start = performance.now();
    const lines = String(query)
      .trim()
      .split('\n')
      .filter((l) => l.trim() !== '');
    if (lines.length === 0) throw d1Error('No SQL statements detected.', 'D1_EXEC_ERROR');
    this.#transaction('BEGIN IMMEDIATE', () => {
      lines.forEach((line, i) => {
        try {
          this.#execute(line, [], 'all');
        } catch (e) {
          const inner = e instanceof D1Failure ? e.inner : sqliteMessage(e);
          throw d1Error(`Error in line ${i + 1}: ${line}: ${inner}`, 'D1_EXEC_ERROR');
        }
      });
    });
    return { count: lines.length, duration: performance.now() - start };
  }

  withSession(): D1DatabaseSession {
    return {
      prepare: (q: string) => this.prepare(q),
      batch: <T = unknown>(s: D1PreparedStatement[]) => this.batch<T>(s),
      getBookmark: () => null,
    } as D1DatabaseSession;
  }

  async dump(): Promise<ArrayBuffer> {
    throw d1Error('dump() is not supported; use the export scripts in scripts/migrate/.', 'D1_DUMP_ERROR');
  }

  /** @internal Runs one prepared statement in its own transaction (used by NodeD1PreparedStatement). */
  runStatement(sql: string, params: Bound[], mode: Mode): Executed {
    if (this.#inTransaction) return this.#execute(sql, params, mode);
    const analysis = this.#analysis(sql);
    const readOnly = analysis.statements.every((s) => READ_KEYWORDS.has(s.keyword));
    return this.#transaction(readOnly ? 'BEGIN' : 'BEGIN IMMEDIATE', () => this.#execute(sql, params, mode));
  }

  #transaction<R>(begin: string, fn: () => R): R {
    this.#db.exec(begin);
    this.#inTransaction = true;
    try {
      const r = fn();
      this.#db.exec('COMMIT');
      return r;
    } catch (e) {
      if (this.#db.isTransaction) this.#db.exec('ROLLBACK');
      throw e;
    } finally {
      this.#inTransaction = false;
    }
  }

  #analysis(sql: string): SqlAnalysis {
    let a = this.#analyses.get(sql);
    if (!a) {
      a = analyzeSql(sql);
      if (this.#analyses.size >= MAX_CACHED_STATEMENTS) this.#analyses.delete(this.#analyses.keys().next().value as string);
      this.#analyses.set(sql, a);
    }
    return a;
  }

  #statement(text: string): StatementSync {
    let s = this.#statements.get(text);
    if (s) {
      this.#statements.delete(text);
      this.#statements.set(text, s);
      return s;
    }
    s = this.#db.prepare(text);
    s.setReturnArrays(true);
    s.setReadBigInts(true);
    if (this.#statements.size >= MAX_CACHED_STATEMENTS) this.#statements.delete(this.#statements.keys().next().value as string);
    this.#statements.set(text, s);
    return s;
  }

  #readCounters(): [number, number] {
    if (!this.#counters) {
      this.#counters = this.#db.prepare('SELECT total_changes(), last_insert_rowid()');
      this.#counters.setReturnArrays(true);
      this.#counters.setReadBigInts(true);
    }
    const row = this.#counters.get() as unknown as [bigint, bigint];
    return [Number(row[0]), Number(row[1])];
  }

  #sizeAfter(): number {
    if (!this.#size) {
      this.#size = this.#db.prepare('SELECT page_count * page_size FROM pragma_page_count(), pragma_page_size()');
      this.#size.setReturnArrays(true);
    }
    const row = this.#size.get() as unknown as [number];
    return Number(row[0]);
  }

  #check(sql: string, params: Bound[]): SqlStatement[] {
    if (sql.trim() === '') throw new D1Failure('No SQL statements detected.');
    const a = this.#analysis(sql);
    if (a.emptyStatement || a.statements.length === 0) throw new D1Failure('SQL code did not contain a statement.');
    for (const s of a.statements) {
      if (TRANSACTION_KEYWORDS.has(s.keyword)) throw new D1Failure(TRANSACTION_MESSAGE);
      if (s.keyword === 'ATTACH' || s.keyword === 'DETACH') throw new D1Failure('not authorized: SQLITE_AUTH');
      if (s.keyword === 'PRAGMA' && !ALLOWED_PRAGMAS.has(s.pragma ?? '')) throw new D1Failure('not authorized: SQLITE_AUTH');
    }
    const last = a.statements[a.statements.length - 1];
    if (a.statements.slice(0, -1).some((s) => s.paramCount > 0)) {
      throw new D1Failure('When executing multiple SQL statements in a single call, only the last statement can have parameters.');
    }
    if (params.length !== last.paramCount) throw new D1Failure('Wrong number of parameter bindings for SQL query.');
    return a.statements;
  }

  #execute(sql: string, params: Bound[], mode: Mode): Executed {
    const statements = this.#check(sql, params);
    const started = performance.now();
    const [totalBefore] = this.#readCounters();
    let columns: string[] = [];
    let rows: unknown[][] = [];
    try {
      for (let i = 0; i < statements.length; i++) {
        const stmt = this.#statement(statements[i].text);
        if (i < statements.length - 1) {
          stmt.all();
          continue;
        }
        columns = stmt.columns().map((c) => c.name);
        if (mode === 'first') {
          const row = stmt.get(...params) as unknown as unknown[] | undefined;
          rows = row === undefined ? [] : [row];
        } else rows = stmt.all(...params) as unknown as unknown[][];
      }
    } catch (e) {
      throw fail(e);
    }
    const [totalAfter, lastRowId] = this.#readCounters();
    const changes = totalAfter - totalBefore;
    const ms = performance.now() - started;
    const schema = statements.some((s) => SCHEMA_KEYWORDS.has(s.keyword));
    return {
      columns,
      rows,
      meta: {
        served_by: 'node-sqlite',
        served_by_primary: true,
        total_attempts: 1,
        timings: { sql_duration_ms: ms },
        duration: ms,
        changes,
        last_row_id: lastRowId,
        changed_db: changes > 0 || schema,
        size_after: this.#sizeAfter(),
        rows_read: rows.length,
        rows_written: changes,
      },
    };
  }
}

function result<T>(r: Executed): D1Result<T> {
  return { success: true, meta: r.meta, results: r.rows.map((row) => toObject(r.columns, row)) as T[] };
}

export class NodeD1PreparedStatement implements D1PreparedStatement {
  readonly database: NodeD1Database;
  readonly sql: string;
  readonly params: Bound[];

  constructor(database: NodeD1Database, sql: string, params: Bound[]) {
    this.database = database;
    this.sql = sql;
    this.params = params;
  }

  bind(...values: unknown[]): D1PreparedStatement {
    return new NodeD1PreparedStatement(this.database, this.sql, values.map(toBound));
  }

  first<T = unknown>(colName: string): Promise<T | null>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  async first<T>(colName?: string): Promise<T | null> {
    const r = this.database.runStatement(this.sql, this.params, 'first');
    if (r.rows.length === 0) return null;
    const row = toObject(r.columns, r.rows[0]);
    if (colName === undefined) return row as T;
    if (row[colName] === undefined) {
      throw new Error(`D1_COLUMN_NOTFOUND: Column not found (${colName})`, { cause: new Error('Column not found') });
    }
    return row[colName] as T;
  }

  async run<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    return result<T>(this.database.runStatement(this.sql, this.params, 'all'));
  }

  async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    return result<T>(this.database.runStatement(this.sql, this.params, 'all'));
  }

  raw<T = unknown[]>(options: { columnNames: true }): Promise<[string[], ...T[]]>;
  raw<T = unknown[]>(options?: { columnNames?: false }): Promise<T[]>;
  async raw<T = unknown[]>(options?: { columnNames?: boolean }): Promise<T[] | [string[], ...T[]]> {
    const r = this.database.runStatement(this.sql, this.params, 'all');
    const rows = r.rows.map((row) => row.map(fromSqlite)) as T[];
    return options?.columnNames ? [r.columns, ...rows] : rows;
  }
}
