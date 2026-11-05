// D1 migrations for the Node runtime, recorded exactly like
// `wrangler d1 migrations apply` records them, so db.sqlite can be exported
// back to D1 and wrangler sees the same applied migrations.
//
// Shared by the server (pending migrations at startup), the build (migrations
// are embedded in dist/node/server.mjs) and scripts/migrate/*.mjs.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from './sqlite.ts';

export interface Migration {
  name: string;
  sql: string;
}

/** Wrangler's table, byte for byte (wrangler-dist getCreateMigrationsTableQuery), so sqlite_master matches D1. */
export const D1_MIGRATIONS_DDL = `CREATE TABLE IF NOT EXISTS "d1_migrations"(
\t\tid         INTEGER PRIMARY KEY AUTOINCREMENT,
\t\tname       TEXT UNIQUE,
\t\tapplied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;

function leadingNumber(name: string): number {
  return Number.parseInt(name.split('_')[0], 10);
}

/** Wrangler's order: by leading number, then by name. */
export function compareMigrationNames(a: string, b: string): number {
  const x = leadingNumber(a);
  const y = leadingNumber(b);
  if (x !== y) {
    if (Number.isFinite(x) && Number.isFinite(y)) return x - y;
    if (Number.isFinite(x)) return -1;
    if (Number.isFinite(y)) return 1;
  }
  return a < b ? -1 : a > b ? 1 : 0;
}

export function readMigrationsDir(dir: string): Migration[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort(compareMigrationNames)
    .map((name) => ({ name, sql: readFileSync(join(dir, name), 'utf8') }));
}

function tableExists(db: DatabaseSync, name: string): boolean {
  return !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name);
}

export function appliedMigrations(db: DatabaseSync): string[] {
  if (!tableExists(db, 'd1_migrations')) return [];
  return (db.prepare('SELECT name FROM "d1_migrations" ORDER BY id').all() as { name: string }[]).map((r) => String(r.name));
}

export interface MigrationStatus {
  applied: string[];
  pending: string[];
  /** Applied in the database but not known to this code (the database is newer). */
  unknown: string[];
}

export function migrationStatus(db: DatabaseSync, migrations: Migration[]): MigrationStatus {
  const applied = appliedMigrations(db);
  const known = new Set(migrations.map((m) => m.name));
  const done = new Set(applied);
  return {
    applied,
    pending: migrations.filter((m) => !done.has(m.name)).map((m) => m.name),
    unknown: applied.filter((n) => !known.has(n)),
  };
}

/**
 * Applies pending migrations in order. Like wrangler, each migration file and
 * its d1_migrations row are one atomic unit; a failing migration is rolled
 * back and stops the run. Returns the names applied.
 */
export function applyMigrations(db: DatabaseSync, migrations: Migration[]): string[] {
  db.exec(D1_MIGRATIONS_DDL);
  const done = new Set(appliedMigrations(db));
  const applied: string[] = [];
  for (const m of [...migrations].sort((a, b) => compareMigrationNames(a.name, b.name))) {
    if (done.has(m.name)) continue;
    db.exec('BEGIN IMMEDIATE');
    try {
      db.exec(m.sql);
      db.prepare('INSERT INTO "d1_migrations" (name) values (?)').run(m.name);
      db.exec('COMMIT');
    } catch (e) {
      if (db.isTransaction) db.exec('ROLLBACK');
      throw new Error(`Migration ${m.name} failed: ${(e as Error).message}`, { cause: e });
    }
    applied.push(m.name);
  }
  return applied;
}

export interface SchemaEntry {
  type: string;
  name: string;
  tbl_name: string;
  sql: string | null;
}

/** The user-visible schema (no sqlite_* internals, no D1 _cf_* tables), in a stable order. */
export function schemaSnapshot(db: DatabaseSync): SchemaEntry[] {
  return db
    .prepare(
      "SELECT type, name, tbl_name, sql FROM sqlite_master WHERE substr(name, 1, 7) <> 'sqlite_' AND substr(name, 1, 4) <> '_cf_' ORDER BY type, name",
    )
    .all() as unknown as SchemaEntry[];
}

/** The schema an empty D1 database has after the given migrations. */
export function expectedSchema(migrations: Migration[]): SchemaEntry[] {
  const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true, enableDoubleQuotedStringLiterals: true });
  try {
    applyMigrations(db, migrations);
    return schemaSnapshot(db);
  } finally {
    db.close();
  }
}

/** Differences between two schema snapshots, as readable lines. */
export function diffSchema(expected: SchemaEntry[], actual: SchemaEntry[]): string[] {
  const key = (e: SchemaEntry) => `${e.type} ${e.name}`;
  const a = new Map(actual.map((e) => [key(e), e]));
  const x = new Map(expected.map((e) => [key(e), e]));
  const out: string[] = [];
  for (const [k, e] of x) {
    const got = a.get(k);
    if (!got) out.push(`missing ${k}`);
    else if ((got.sql ?? '') !== (e.sql ?? '')) out.push(`different ${k}`);
  }
  for (const k of a.keys()) if (!x.has(k)) out.push(`unexpected ${k}`);
  return out;
}
