// BIZOMAT WHS hours worked on the Node runtime (node:sqlite), over real HTTP: migration 0028 is additive (one whs_
// table, its indexes and triggers on it, nothing else) and leaves every earlier table as it was; its history is
// append-only on node:sqlite while an account's deletion still works (changed_by becomes NULL); hours are entered,
// changed with a reason and removed through the API, with the injury frequency rates worked out from them; and the
// example company's removal takes the history with it.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-whs-hours-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

describe('migration 0028', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0028_'))!;
  const sql = m.sql
    .split('\n')
    .map((l) => l.replace(/--.*$/, ''))
    .join('\n');

  it('only creates the whs_hours_revisions table, its indexes and its triggers', () => {
    expect(m.name).toBe('0028_whs_hours.sql');
    const creates = sql.match(/^CREATE [^\n]*/gm) ?? [];
    expect(creates.map((s) => s.split(/\s+/).slice(0, 3).join(' '))).toEqual(['CREATE TABLE whs_hours_revisions', 'CREATE INDEX whs_hours_revisions_company', 'CREATE INDEX whs_hours_revisions_month', 'CREATE TRIGGER whs_hours_revisions_append_only', 'CREATE TRIGGER whs_hours_revisions_no_delete']);
    for (const s of creates.filter((x) => x.startsWith('CREATE INDEX') || x.startsWith('CREATE TRIGGER'))) expect(s).toMatch(/ ON whs_hours_revisions[ (]/);
    const top = sql.replace(/BEGIN .*? END;/g, '');
    expect(top).not.toMatch(/^\s*(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/im);
    for (const body of sql.match(/BEGIN (.*?) END;/g) ?? []) expect(body).toMatch(/^BEGIN SELECT RAISE\(ABORT, '[^']+'\); END;$/);
  });

  it('leaves every earlier table exactly as it was, and keeps the history append-only while accounts can still be deleted', () => {
    const db = openDatabase(join(root, 'additive.sqlite'));
    applyMigrations(db, all.filter((x) => x.name < m.name));
    const schema = () => db.prepare("SELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name").all() as any[];
    const before = schema();
    expect(applyMigrations(db, all.filter((x) => x.name <= m.name))).toContain(m.name);
    const after = schema();
    const old = new Set(before.map((r) => `${r.type}:${r.name}`));
    expect(after.filter((r) => old.has(`${r.type}:${r.name}`))).toEqual(before);
    expect(after.filter((r) => !old.has(`${r.type}:${r.name}`)).map((r) => r.name).sort()).toEqual(['whs_hours_revisions', 'whs_hours_revisions_append_only', 'whs_hours_revisions_company', 'whs_hours_revisions_month', 'whs_hours_revisions_no_delete']);
    const t = Date.now();
    db.prepare('INSERT INTO users (id, email, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run('u-hours', 'hours.node@example.com', 'Hours tester', t, t);
    db.prepare("INSERT INTO whs_hours_revisions (id, company_id, site_id, month, before_hours, after_hours, reason, changed_by, changed_at) VALUES ('r1', 'co-1', '', '2026-01', NULL, 100, '', 'u-hours', ?)").run(t);
    expect(() => db.prepare("UPDATE whs_hours_revisions SET reason = 'x' WHERE id = 'r1'").run()).toThrow(/append-only/);
    expect(() => db.prepare("UPDATE whs_hours_revisions SET after_hours = 5 WHERE id = 'r1'").run()).toThrow(/append-only/);
    expect(() => db.prepare("DELETE FROM whs_hours_revisions WHERE id = 'r1'").run()).toThrow(/append-only/);
    expect(() => db.prepare("INSERT INTO whs_hours_revisions (id, company_id, month, after_hours, changed_at) VALUES ('r2', 'co-1', '2026-01', -1, 1)").run()).toThrow(/CHECK/);
    // an account's deletion sets the name of who made the change to NULL; the change itself stays
    db.prepare("DELETE FROM users WHERE id = 'u-hours'").run();
    expect(db.prepare("SELECT changed_by, after_hours FROM whs_hours_revisions WHERE id = 'r1'").get()).toEqual({ changed_by: null, after_hours: 100 });
    // a whole-company removal (the example company) passes through whs_purges
    db.prepare("INSERT INTO whs_purges (company_id, started_at) VALUES ('co-1', ?)").run(t);
    db.prepare("DELETE FROM whs_hours_revisions WHERE company_id = 'co-1'").run();
    db.close();
  });
});

let server: RunningServer;
beforeAll(async () => {
  server = await startServer(testConfig(join(root, 'data'), staticDir));
});
afterAll(async () => {
  await server?.close();
});

interface Session {
  cookie: string;
  csrf: string;
  userId: string;
}

async function signup(name: string): Promise<Session> {
  const res = await fetch(`${server.url}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: server.url },
    body: JSON.stringify({ email: `node.hours.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
  });
  expect(res.status).toBe(201);
  const data = (await res.json()) as { csrfToken: string; user: { id: string } };
  return { cookie: res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.includes('workos_sid='))!, csrf: data.csrfToken, userId: data.user.id };
}

async function call(s: Session, method: string, path: string, body?: unknown) {
  return fetch(`${server.url}${path}`, {
    method,
    headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function json<T = any>(s: Session, method: string, path: string, body?: unknown): Promise<T> {
  const res = await call(s, method, path, body);
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return JSON.parse(text) as T;
}

const mo = (n: number) => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - n, 1)).toISOString().slice(0, 7);
};
const lastDay = (m: string) => `${m}-${String(new Date(Date.UTC(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0)).getUTCDate()).padStart(2, '0')}`;

describe('BIZOMAT WHS hours worked on the Node runtime', () => {
  it('enters, changes with a reason and removes hours, keeps the history and works out the rates', async () => {
    const s = await signup('Node Hours Owner');
    const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const w = (p: string) => `/api/whs/c/${own.id}${p}`;
    const site = await json(s, 'POST', `/api/maintenance/c/${own.id}/sites`, { code: 'H1', name: 'Node hours site' });
    const m = mo(1);
    await json(s, 'POST', w('/incidents'), { kind: 'injury', title: 'Twisted ankle', occurredDate: `${m}-12`, siteId: site.id, outcome: 'lost_time', severity: 'moderate' });
    expect((await json(s, 'PUT', w('/hours'), { entries: [{ siteId: site.id, month: m, hours: 4000 }] })).changed).toBe(1);
    expect((await call(s, 'PUT', w('/hours'), { entries: [{ siteId: site.id, month: m, hours: 5000 }] })).status).toBe(400);
    expect((await json(s, 'PUT', w('/hours'), { entries: [{ siteId: site.id, month: m, hours: 5000 }], reason: 'Overtime added' })).changed).toBe(1);
    const dash = await json(s, 'GET', w(`/dashboard?from=${m}-01&to=${lastDay(m)}`));
    expect(dash.rates).toMatchObject({ available: true, hours: 5000, lti: 1, recordable: 1, ltifr: 200, trifr: 200 });
    const settings = await json(s, 'GET', w('/settings'));
    expect(settings.hoursHistory.map((r: any) => [r.before, r.after, r.reason])).toEqual([
      [4000, 5000, 'Overtime added'],
      [null, 4000, ''],
    ]);
    expect((await json(s, 'PUT', w('/hours'), { entries: [{ siteId: site.id, month: m, hours: null }], reason: 'Wrong month' })).changed).toBe(1);
    expect((await json(s, 'GET', w(`/dashboard?from=${m}-01&to=${lastDay(m)}`))).rates).toMatchObject({ available: false, missing: [{ month: m, siteId: site.id, reason: 'missing' }] });
  });

  it('removes the example company’s hours and their history with it', async () => {
    const s = await signup('Node Hours Example');
    const built = await json(s, 'POST', '/api/system/demo', {});
    expect(built.status).toBe('ready');
    const settings = await json(s, 'GET', `/api/whs/c/${built.companyId}/settings`);
    expect(settings.hours.length).toBe(12);
    expect(settings.hoursHistory.length).toBe(12);
    await json(s, 'POST', '/api/system/demo/remove', {});
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      const left = db.prepare('SELECT (SELECT COUNT(*) FROM whs_hours WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_hours_revisions WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_purges) AS n').get(built.companyId) as { n: number };
      expect(left.n).toBe(0);
    } finally {
      db.close();
    }
  });
});
