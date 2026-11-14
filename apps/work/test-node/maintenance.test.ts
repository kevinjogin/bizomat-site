// Asset Management and Maintenance on the Node runtime (node:sqlite and the data folder's file store), over real HTTP:
// migration 0018 applies, numbering and the recursive hierarchy queries work on node:sqlite, a photo is stored on disk
// and served back, the timer's one-running index holds, and a completed work order is locked.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-maintenance-');
const staticDir = join(root, 'static');
mkdirSync(staticDir, { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');

let server: RunningServer;
beforeAll(async () => {
  server = await startServer(testConfig(join(root, 'data'), staticDir));
});
afterAll(async () => {
  await server?.close();
});

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...Array.from({ length: 64 }, (_, i) => i)]);

interface Session {
  cookie: string;
  csrf: string;
}

async function signup(): Promise<Session> {
  const res = await fetch(`${server.url}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: server.url },
    body: JSON.stringify({ email: `node.mt.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name: 'Node Maintainer', password: PASSWORD }),
  });
  expect(res.status).toBe(201);
  const data = (await res.json()) as { csrfToken: string };
  return { cookie: res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.includes('workos_sid='))!, csrf: data.csrfToken };
}

async function call(s: Session, method: string, path: string, body?: unknown) {
  const isForm = body instanceof FormData;
  return fetch(`${server.url}${path}`, {
    method,
    headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url, ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
}

async function json<T = any>(s: Session, method: string, path: string, body?: unknown): Promise<T> {
  const res = await call(s, method, path, body);
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return JSON.parse(text) as T;
}

describe('maintenance on the Node runtime', () => {
  it('runs an asset hierarchy, a work order with a photo and the timer, and locks it on completion', async () => {
    const s = await signup();
    const own = (await json(s, 'GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    expect(own.role).toBe('admin');
    const mt = (p: string) => `/api/maintenance/c/${own.id}${p}`;
    const line = await json(s, 'POST', mt('/assets'), { name: 'Production line' });
    const cnc = await json(s, 'POST', mt('/assets'), { name: 'CNC machine', parentId: line.id, manufacturer: 'Example', serialNumber: 'N-1' });
    const hyd = await json(s, 'POST', mt('/assets'), { name: 'Hydraulic system', parentId: cnc.id });
    expect([line.number, cnc.number, hyd.number]).toEqual(['A-0001', 'A-0002', 'A-0003']);
    expect((await json(s, 'GET', mt(`/assets/${hyd.id}`))).path.map((p: any) => p.number)).toEqual(['A-0001', 'A-0002', 'A-0003']);
    expect((await call(s, 'PATCH', mt(`/assets/${line.id}`), { parentId: hyd.id })).status).toBe(400);

    const wo = await json(s, 'POST', mt('/work-orders'), { assetId: hyd.id, description: 'Hose leak', tasks: ['Replace the hose'], parts: [{ part: 'Hose', quantity: 1 }], estimatedHours: 1 });
    expect(wo.number).toBe('WO-00001');
    expect((await json(s, 'GET', mt(`/work-orders?assetId=${line.id}&includeChildren=1`))).total).toBe(1);

    const fd = new FormData();
    fd.set('file', new File([PNG], 'leak.png', { type: 'image/png' }));
    fd.set('workOrderId', wo.id);
    const up = await call(s, 'POST', mt('/files'), fd);
    expect(up.status).toBe(201);
    const file = (await up.json()) as any;
    const dl = await call(s, 'GET', mt(`/files/${file.id}`));
    expect(dl.status).toBe(200);
    expect(new Uint8Array(await dl.arrayBuffer())).toEqual(PNG);

    expect((await call(s, 'POST', mt(`/work-orders/${wo.id}/timer/start`), {})).status).toBe(201);
    expect((await call(s, 'POST', mt(`/work-orders/${wo.id}/timer/start`), {})).status).toBe(409);
    await json(s, 'POST', mt(`/work-orders/${wo.id}/complete`), { notes: 'Hose replaced.' });
    const detail = await json(s, 'GET', mt(`/work-orders/${wo.id}`));
    expect(detail.workOrder.status).toBe('completed');
    expect(detail.totals.running).toEqual([]);
    expect((await call(s, 'POST', mt(`/work-orders/${wo.id}/tasks`), { text: 'Late' })).status).toBe(409);
    await json(s, 'POST', mt(`/work-orders/${wo.id}/reopen`), { reason: 'Pressure test not recorded' });
    expect((await json(s, 'GET', mt(`/work-orders/${wo.id}`))).workOrder.status).toBe('in_progress');

    const imported = await json(s, 'POST', mt('/assets/import'), { csv: 'Name,Parent,Serial number,Manufacturer\nGearbox,A-0002,G-1,Example\nCopy,,N-1,Example', dryRun: false });
    expect(imported.summary).toMatchObject({ ok: 1, duplicates: 1 });
    expect(imported.created).toBe(1);
  });
});
