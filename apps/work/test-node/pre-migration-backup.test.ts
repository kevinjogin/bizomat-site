// Before the server applies a migration to an existing database it keeps a copy of the database (12 Nov 2026).
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { afterAll, describe, expect, it } from 'vitest';
import { createRuntime } from '../src/node/runtime.ts';
import { readMigrationsDir } from '../src/node/store/migrations.ts';
import type { NodeConfig } from '../src/node/config.ts';

const dirs: string[] = [];
afterAll(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));

function config(dataDir: string): NodeConfig {
  return { port: 0, host: '127.0.0.1', dataDir, staticDir: dataDir, vars: { ENVIRONMENT: 'test', APP_NAME: 'T', APP_URL: 'http://example.com', ALLOW_SIGNUP: 'true', SESSION_TTL_HOURS: '1' }, trustProxy: false, version: null, cron: false, maxBodyBytes: 1 << 20, shutdownTimeoutMs: 1000 };
}

describe('pre-migration backup', () => {
  it('copies the database before applying 0006 to an existing one, and keeps every row', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'work-premig-'));
    dirs.push(dir);
    const all = readMigrationsDir('migrations');
    const before = all.filter((m) => m.name < '0006');
    const events: Record<string, unknown>[] = [];
    // A database as production has it today: migrations up to 0005, with members and an invitation.
    let rt = createRuntime(config(dir), { migrations: before });
    await rt.env.DB.batch([
      rt.env.DB.prepare("INSERT INTO users (id, email, name, created_at, updated_at) VALUES ('u1','a@example.com','A',1,1), ('u2','b@example.com','B',1,1)"),
      rt.env.DB.prepare("INSERT INTO workspaces (id, name, created_by, created_at, updated_at) VALUES ('w1','W','u1',1,1)"),
      rt.env.DB.prepare("INSERT INTO workspace_members (workspace_id, user_id, role, joined_at) VALUES ('w1','u1','owner',5), ('w1','u2','viewer',6)"),
      rt.env.DB.prepare("INSERT INTO invitations (id, workspace_id, email, role, token_hash, invited_by, created_at, expires_at) VALUES ('i1','w1','c@example.com','member','h','u1',1,9)"),
    ]);
    rt.close();
    expect(existsSync(join(dir, 'pre-migration-backups'))).toBe(false);
    // The new version starts: a copy first, then the migration.
    rt = createRuntime(config(dir), { migrations: all, log: (e) => events.push(e) });
    const backups = readdirSync(join(dir, 'pre-migration-backups'));
    expect(backups).toHaveLength(1);
    expect(backups[0]).toMatch(/^db-before-0006_platform_upgrade-.*\.sqlite$/);
    expect(events.some((e) => e.event === 'pre_migration_backup')).toBe(true);
    const copy = new DatabaseSync(join(dir, 'pre-migration-backups', backups[0]), { readOnly: true });
    expect((copy.prepare('SELECT COUNT(*) AS n FROM workspace_members').get() as { n: number }).n).toBe(2);
    expect((copy.prepare("SELECT COUNT(*) AS n FROM d1_migrations WHERE name LIKE '0006%'").get() as { n: number }).n).toBe(0);
    copy.close();
    const members = await rt.env.DB.prepare('SELECT user_id, role, status, joined_at FROM workspace_members ORDER BY user_id').all();
    expect(members.results).toEqual([
      { user_id: 'u1', role: 'owner', status: 'active', joined_at: 5 },
      { user_id: 'u2', role: 'viewer', status: 'active', joined_at: 6 },
    ]);
    const inv = await rt.env.DB.prepare('SELECT id, role, token_hash, send_count FROM invitations').all();
    expect(inv.results).toEqual([{ id: 'i1', role: 'member', token_hash: 'h', send_count: 0 }]);
    rt.close();
    // Nothing pending: no new copy on the next start.
    rt = createRuntime(config(dir), { migrations: all });
    expect(readdirSync(join(dir, 'pre-migration-backups'))).toHaveLength(1);
    rt.close();
  });
});
