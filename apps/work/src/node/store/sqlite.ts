// Opening SQLite databases for the Node runtime and the migration scripts.
//
// Durability: WAL journal (readers never block the writer) with
// synchronous=FULL, so the WAL is fsynced at every commit and a committed
// transaction survives a power loss, not only a process crash. Foreign keys
// are enforced (D1 enforces them). Double-quoted string literals are accepted
// because D1 accepts them. A busy timeout covers short locks taken by an
// operator's backup or sqlite3 shell.

import type * as NodeSqlite from 'node:sqlite';

/**
 * node:sqlite, loaded without its one-line "experimental feature" warning on
 * stderr (Node 22 prints it on first load; the module works unflagged).
 */
function loadSqlite(): typeof NodeSqlite {
  const emit = process.emitWarning;
  process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
    const message = typeof warning === 'string' ? warning : warning?.message;
    if (typeof message === 'string' && message.includes('SQLite is an experimental feature')) return;
    return (emit as (...a: unknown[]) => void).call(process, warning, ...rest);
  }) as typeof process.emitWarning;
  try {
    return process.getBuiltinModule('node:sqlite') as typeof NodeSqlite;
  } finally {
    process.emitWarning = emit;
  }
}

export const { DatabaseSync } = loadSqlite();
export type DatabaseSync = NodeSqlite.DatabaseSync;

export interface OpenOptions {
  readOnly?: boolean;
  /** Journal mode for a writable database: 'WAL' (default) or 'DELETE' (single-file, for building a database to move into place). */
  journal?: 'WAL' | 'DELETE';
  busyTimeoutMs?: number;
}

export function openDatabase(path: string, options: OpenOptions = {}): DatabaseSync {
  const db = new DatabaseSync(path, {
    readOnly: options.readOnly ?? false,
    enableForeignKeyConstraints: true,
    enableDoubleQuotedStringLiterals: true,
    timeout: options.busyTimeoutMs ?? 5000,
  });
  if (!options.readOnly) {
    db.exec(`PRAGMA journal_mode = ${options.journal ?? 'WAL'}`);
    db.exec('PRAGMA synchronous = FULL');
  }
  db.exec('PRAGMA foreign_keys = ON');
  return db;
}

export function pragma(db: DatabaseSync, name: string): unknown {
  const row = db.prepare(`PRAGMA ${name}`).get() as Record<string, unknown> | undefined;
  return row ? Object.values(row)[0] : undefined;
}

/** `PRAGMA integrity_check` (or quick_check) as a list of problems; empty when the database is sound. */
export function integrityProblems(db: DatabaseSync, quick = false): string[] {
  const rows = db.prepare(quick ? 'PRAGMA quick_check' : 'PRAGMA integrity_check').all() as Record<string, unknown>[];
  const out = rows.map((r) => String(Object.values(r)[0]));
  return out.length === 1 && out[0] === 'ok' ? [] : out;
}

export interface ForeignKeyViolation {
  table: string;
  rowid: number | null;
  parent: string;
  fkid: number;
}

export function foreignKeyViolations(db: DatabaseSync): ForeignKeyViolation[] {
  const rows = db.prepare('PRAGMA foreign_key_check').all() as { table: string; rowid: number | bigint | null; parent: string; fkid: number | bigint }[];
  return rows.map((r) => ({ table: r.table, rowid: r.rowid == null ? null : Number(r.rowid), parent: r.parent, fkid: Number(r.fkid) }));
}

/** Quote an identifier for SQLite. */
export function ident(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}
