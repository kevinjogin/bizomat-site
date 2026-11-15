// BIZOMAT WHS, Release 1 on the Node runtime (node:sqlite and the data folder's file store), over real HTTP: migration
// 0026 is additive (it only creates whs_ tables, their indexes and triggers on them, lists no extensible kinds in a
// CHECK, and leaves every earlier table as it was); a hazard reported with a photo, rated, controlled, its action
// refused without evidence then completed, verified and closed; a serious incident flagged only by a rule verified by a
// platform administrator, with the due time worked out and the submission reference recorded; the database's own
// protections (no deletion of incidents, tracked changes, frozen submissions, append-only history) on node:sqlite; and
// the example company.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { applyMigrations, readMigrationsDir } from '../src/node/store/migrations.ts';
import { openDatabase } from '../src/node/store/sqlite.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-whs-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

describe('migration 0026', () => {
  const all = readMigrationsDir('migrations');
  const m = all.find((x) => x.name.startsWith('0026_'))!;
  const sql = m.sql
    .split('\n')
    .map((l) => l.replace(/--.*$/, ''))
    .join('\n');

  it('only creates whs_ tables, indexes and triggers on whs_ tables, and lists no extensible kinds in a CHECK', () => {
    expect(m.name).toBe('0026_whs_core.sql');
    const creates = sql.match(/^CREATE [^\n]*/gm) ?? [];
    expect(creates.length).toBeGreaterThan(60);
    for (const s of creates) expect(s, s.slice(0, 90)).toMatch(/^CREATE (TABLE whs_\w+ \(|(UNIQUE )?INDEX whs_\w+ ON whs_\w+\(|TRIGGER whs_\w+ (BEFORE|AFTER) (UPDATE|DELETE|INSERT)( OF [\w, ]+)? ON whs_\w+ )/);
    // nothing but CREATE statements at the top level; triggers only raise or write to their own revisions table
    const top = sql.replace(/BEGIN .*? END;/g, '');
    expect(top).not.toMatch(/^\s*(ALTER|DROP|INSERT|UPDATE|DELETE|REPLACE)\b/im);
    for (const body of sql.match(/BEGIN (.*?) END;/g) ?? []) expect(body, body.slice(0, 80)).toMatch(/^BEGIN (SELECT RAISE\(ABORT, '[^']+'\);|INSERT INTO whs_incident_revisions \()/);
    const checks = sql.match(/CHECK \((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)/g) ?? [];
    expect(checks.length).toBeGreaterThan(40);
    for (const kind of ['machinery', 'psychosocial', 'injury', 'near_miss', 'jsa', 'swms', 'legislation', 'model_law', 'company_policy', 'exposure_limits', 'engineering', 'ppe', 'hazard', 'inspection', 'audit', 'first_aid', 'fatality', 'whs_manager', 'health_officer', 'phone', 'online']) {
      expect(checks.filter((c) => c.includes(`'${kind}'`)), kind).toEqual([]);
    }
  });

  it('leaves every earlier table exactly as it was', () => {
    const db = openDatabase(join(root, 'additive.sqlite'));
    applyMigrations(db, all.filter((x) => x.name < m.name));
    const schema = () => db.prepare("SELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name").all() as any[];
    const before = schema();
    expect(applyMigrations(db, all.filter((x) => x.name <= m.name))).toContain(m.name);
    const after = schema();
    const old = new Set(before.map((r) => `${r.type}:${r.name}`));
    expect(after.filter((r) => old.has(`${r.type}:${r.name}`))).toEqual(before);
    expect(after.filter((r) => !old.has(`${r.type}:${r.name}`)).every((r) => r.name.startsWith('whs_'))).toBe(true);
    expect(after.filter((r) => r.type === 'trigger' && !old.has(`trigger:${r.name}`)).every((r) => /ON whs_/.test(r.sql))).toBe(true);
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
    body: JSON.stringify({ email: `node.whs.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name, password: PASSWORD }),
  });
  expect(res.status).toBe(201);
  const data = (await res.json()) as { csrfToken: string; user: { id: string } };
  return { cookie: res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.includes('workos_sid='))!, csrf: data.csrfToken, userId: data.user.id };
}

async function call(s: Session, method: string, path: string, body?: unknown) {
  const form = body instanceof FormData;
  return fetch(`${server.url}${path}`, {
    method,
    headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url, ...(body !== undefined && !form ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : form ? (body as FormData) : JSON.stringify(body),
  });
}

async function json<T = any>(s: Session, method: string, path: string, body?: unknown): Promise<T> {
  const res = await call(s, method, path, body);
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return JSON.parse(text) as T;
}

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5, 6, 7, 8]);
const photo = (kind: string, id: string) => {
  const fd = new FormData();
  fd.set('file', new File([PNG], 'photo.png', { type: 'image/png' }));
  fd.set('kind', kind);
  fd.set('id', id);
  return fd;
};
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

describe('BIZOMAT WHS on the Node runtime', () => {
  it('takes a hazard from a report with a photo to closure, refusing completion without evidence', async () => {
    const s = await signup('Node WHS Owner');
    const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const w = (p: string) => `/api/whs/c/${own.id}${p}`;
    const site = await json(s, 'POST', `/api/maintenance/c/${own.id}/sites`, { code: 'N1', name: 'Node site' });
    const hz = await json(s, 'POST', w('/hazards'), { title: 'Unguarded shaft', category: 'machinery', siteId: site.id });
    expect((await call(s, 'POST', w('/files'), photo('hazard', hz.id))).status).toBe(201);
    expect(await json(s, 'POST', w(`/hazards/${hz.id}/assess`), { likelihood: 4, consequence: 4 })).toMatchObject({ riskLevel: 'critical', status: 'assessment' });
    const ctl = await json(s, 'POST', w(`/hazards/${hz.id}/controls`), { actions: [{ title: 'Sign on the machine', hierarchy: 'administrative', evidenceRequired: true, responsibleId: s.userId }] });
    // a critical risk controlled by a sign only: the hierarchy-of-controls warning
    expect(ctl.warnings[0]).toMatch(/administrative controls and PPE/);
    const act = (await json(s, 'GET', w(`/hazards/${hz.id}`))).actions[0];
    expect((await call(s, 'POST', w(`/actions/${act.id}/complete`), { note: 'Done' })).status).toBe(409);
    expect((await call(s, 'POST', w('/files'), photo('action', act.id))).status).toBe(201);
    await json(s, 'POST', w(`/actions/${act.id}/complete`), { note: 'Sign fitted' });
    // alone in the company: verification by the person who completed it is the recorded exception
    expect((await json(s, 'POST', w(`/actions/${act.id}/verify`), { effective: true, note: 'Seen' })).verifySod).toBe(true);
    await json(s, 'POST', w(`/actions/${act.id}/close`), {});
    await json(s, 'POST', w(`/hazards/${hz.id}/advance`), { to: 'verification' });
    expect(await json(s, 'POST', w(`/hazards/${hz.id}/advance`), { to: 'closed', note: 'Guard ordered as well', residualLikelihood: 2, residualConsequence: 4 })).toMatchObject({ status: 'closed', residualLevel: 'high' });
  });

  it('flags a serious incident only under a verified rule, works out its due time and records the submission, with the database’s protections', async () => {
    const s = await signup('Node WHS Manager');
    const admin = await signup('Node Platform Admin');
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      db.prepare('INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, ?, ?, ?)').run(admin.userId, 'admin', 'test', Date.now());
    } finally {
      db.close();
    }
    const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const w = (p: string) => `/api/whs/c/${own.id}${p}`;
    const site = await json(s, 'POST', `/api/maintenance/c/${own.id}/sites`, { code: 'Q1', name: 'Brisbane yard' });
    await json(s, 'PUT', w(`/sites/${site.id}/jurisdictions`), { packIds: ['au-qld'] });
    const before = await json(s, 'POST', w('/incidents'), { kind: 'dangerous_occurrence', title: 'Crane load dropped', occurredDate: day(0), siteId: site.id, severity: 'serious' });
    expect((await json(s, 'GET', w(`/incidents/${before.id}/notification`))).checks.every((c: any) => !c.verified && c.dueAt === null)).toBe(true);
    // the seeded draft version of Queensland's notification rule, verified here for this test only
    const id = 'au-qld.notification@v2';
    await json(admin, 'PATCH', `/api/admin/whs/rules/${id}`, { effectiveFrom: day(-10), deadlineMinutes: 60, criteria: { kinds: ['dangerous_occurrence'] } });
    await json(admin, 'POST', `/api/admin/whs/rules/${id}/submit`, {});
    await json(admin, 'POST', `/api/admin/whs/rules/${id}/review`, { decision: 'approve', notes: 'Test only' });
    await json(admin, 'POST', `/api/admin/whs/rules/${id}/activate`, {});
    await json(admin, 'POST', `/api/admin/whs/rules/${id}/verify`, { sourceChecked: 'https://www.legislation.qld.gov.au/', notes: 'Verified in this test only' });
    const awareAt = Date.now() - 10 * 60_000;
    const inc = await json(s, 'POST', w('/incidents'), { kind: 'dangerous_occurrence', title: 'Second crane load dropped', occurredDate: day(0), siteId: site.id, severity: 'serious', awareAt });
    const n = await json(s, 'GET', w(`/incidents/${inc.id}/notification`));
    expect(n.checks.find((c: any) => c.verified)).toMatchObject({ matches: true, dueAt: awareAt + 60 * 60_000 });
    // the first incident, re-checked, keeps its first evaluation and now gets the verified rule too (it is in effect)
    expect((await json(s, 'POST', w(`/incidents/${before.id}/notification/evaluate`), {})).evaluations).toBe(2);
    const decided = await json(s, 'POST', w(`/incidents/${inc.id}/notification/decision`), { packId: 'au-qld', decision: 'notifiable', reasons: 'Dangerous incident', responsibleId: s.userId });
    const notice = decided.notices[0];
    expect(notice.dueAt).toBe(awareAt + 60 * 60_000);
    const done = await json(s, 'POST', w(`/incidents/${inc.id}/notification/${notice.id}/submission`), { method: 'phone', submittedAt: Date.now() - 1000, submittedById: s.userId, reference: 'QLD-NODE-1' });
    expect(done.incident.notificationStatus).toBe('submitted');
    await json(s, 'POST', w(`/incidents/${inc.id}/classify`), { kind: 'dangerous_occurrence', severity: 'serious', outcome: 'none', investigationRequired: false });
    await json(s, 'PATCH', w(`/incidents/${inc.id}`), { location: 'Crane pad 2' });
    const raw = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      expect((raw.prepare('SELECT COUNT(*) AS n FROM whs_incident_revisions WHERE incident_id = ?').get(inc.id) as { n: number }).n).toBe(1);
      expect(() => raw.prepare('DELETE FROM whs_incidents WHERE id = ?').run(inc.id)).toThrow(/WHS_PROTECTED/);
      expect(() => raw.prepare("UPDATE whs_reg_notices SET reference = 'X' WHERE id = ?").run(notice.id)).toThrow(/WHS_PROTECTED/);
      expect(() => raw.prepare("UPDATE whs_events SET summary = 'x' WHERE company_id = ?").run(own.id)).toThrow(/append-only/);
      expect(() => raw.prepare('DELETE FROM whs_rule_checks WHERE incident_id = ?').run(inc.id)).toThrow(/append-only/);
    } finally {
      raw.close();
    }
  });

  it('makes the example company’s health and safety records, and removes them with it', async () => {
    const s = await signup('Node WHS Example');
    const built = await json(s, 'POST', '/api/system/demo', {});
    expect(built.status).toBe('ready');
    const w = (p: string) => `/api/whs/c/${built.companyId}${p}`;
    expect((await json(s, 'GET', w('/hazards'))).hazards).toMatchObject([{ number: 'HZ-00001', status: 'implementation' }]);
    expect((await json(s, 'GET', w('/risk-assessments'))).assessments).toMatchObject([{ number: 'RA-00001', status: 'approved' }]);
    const incidents = (await json(s, 'GET', w('/incidents'))).incidents;
    expect(incidents.length).toBe(2);
    const injury = incidents.find((i: any) => i.kind === 'injury');
    const n = await json(s, 'GET', w(`/incidents/${injury.id}/notification`));
    expect(n.notices[0]).toMatchObject({ status: 'submitted', example: true });
    await json(s, 'POST', '/api/system/demo/remove', {});
    const db = openDatabase(join(root, 'data', 'db.sqlite'));
    try {
      const left = db.prepare('SELECT (SELECT COUNT(*) FROM whs_incidents WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_hazards WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_events WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_purges) AS n').get(built.companyId) as { n: number };
      expect(left.n).toBe(0);
    } finally {
      db.close();
    }
  });
});
