// `cloudflare:test` for running the Worker test suite on Node
// (vitest.node.config.ts aliases the module to this file).
//
// It exports what the suite imports from the Workers test runtime, backed by
// the Node runtime instead of Miniflare:
//   env                the Worker's Env built from the Node bindings (D1 over
//                      node:sqlite, R2 over the file store, KV, ASSETS, the
//                      realtime hub) plus TEST_MIGRATIONS;
//   SELF.fetch         a request into the Worker's default export, as
//                      SELF.fetch does in workerd;
//   applyD1Migrations  the same algorithm as @cloudflare/vitest-plugin's.
// Each test file gets a fresh data directory (vitest isolates test files).

import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { inject } from 'vitest';
import type { NodeConfig, WorkerVars } from '../../src/node/config.ts';
import { createRuntime } from '../../src/node/runtime.ts';

export interface D1Migration {
  name: string;
  queries: string[];
}

declare module 'vitest' {
  export interface ProvidedContext {
    TEST_MIGRATIONS: D1Migration[];
    WORKER_VARS: WorkerVars;
  }
}

const dataDir = mkdtempSync(join(tmpdir(), 'work-node-suite-'));
let staticDir = resolve('dist/client');
if (!existsSync(join(staticDir, 'index.html'))) {
  staticDir = join(dataDir, 'static');
  mkdirSync(staticDir, { recursive: true });
  writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>WorkOS</title><div id="root"></div>');
}
process.on('exit', () => rmSync(dataDir, { recursive: true, force: true }));

const config: NodeConfig = {
  port: 0,
  host: '127.0.0.1',
  dataDir,
  staticDir,
  vars: inject('WORKER_VARS'),
  trustProxy: true,
  version: null,
  cron: false,
  maxBodyBytes: 32 * 1024 * 1024,
  shutdownTimeoutMs: 1000,
};

// As in the Workers pool, the database starts empty and test/setup.ts applies
// the migrations through the D1 binding.
const runtime = createRuntime(config, { migrations: [] });

export const env = { ...runtime.env, TEST_MIGRATIONS: inject('TEST_MIGRATIONS') } as Cloudflare.Env;

export const SELF = {
  fetch: (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => runtime.fetch(new Request(input, init)),
};

export async function applyD1Migrations(db: D1Database, migrations: D1Migration[], migrationsTableName = 'd1_migrations'): Promise<void> {
  const table = `"${migrationsTableName.replace(/"/g, '""')}"`;
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS ${table} (
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
	);`,
    )
    .run();
  const applied = (await db.prepare(`SELECT name FROM ${table};`).all<{ name: string }>()).results.map((r) => r.name);
  const insert = db.prepare(`INSERT INTO ${table} (name) VALUES (?);`);
  for (const m of migrations) {
    if (applied.includes(m.name)) continue;
    await db.batch([...m.queries.map((q) => db.prepare(q)), insert.bind(m.name)]);
  }
}
