// The example company on the Node runtime (node:sqlite), over real HTTP and under the ERP's /erp address: migration 0019
// applies, the build calls the app's own API from inside the server, its token is removed, and it is removed again.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-example-');
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

interface Session {
  cookie: string;
  csrf: string;
}

async function signup(): Promise<Session> {
  const res = await fetch(`${server.url}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: server.url },
    body: JSON.stringify({ email: `node.ex.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`, name: 'Node Learner', password: PASSWORD }),
  });
  expect(res.status).toBe(201);
  const data = (await res.json()) as { csrfToken: string };
  return { cookie: res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.includes('workos_sid='))!, csrf: data.csrfToken };
}

async function call(s: Session, method: string, path: string, body?: unknown) {
  return fetch(`${server.url}${path}`, {
    method,
    headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('the example company on the Node runtime', () => {
  it('is built through the API inside the server, listed under the ERP, and removed', async () => {
    const s = await signup();
    const started = Date.now();
    const res = await call(s, 'POST', '/api/system/demo', {});
    const took = Date.now() - started;
    expect(res.status).toBe(201);
    const built = (await res.json()) as { status: string; companyId: string };
    expect(built.status).toBe('ready');
    console.log(`example company built in ${took} ms (Node runtime)`);
    expect(took).toBeLessThan(15_000);

    const me = (await (await call(s, 'GET', '/api/system/me')).json()) as any;
    expect(me.example.status).toBe('ready');
    expect(me.companies.find((c: any) => c.kind === 'demo')?.toolCount).toBe(3);
    const overview = (await (await call(s, 'GET', `/api/maintenance/c/${built.companyId}/overview`)).json()) as any;
    expect(overview.assets).toBe(7);

    const removed = await call(s, 'POST', '/api/system/demo/remove', {});
    expect(removed.status).toBe(200);
    const after = (await (await call(s, 'GET', '/api/system/me')).json()) as any;
    expect(after.example.status).toBe('removed');
    expect(after.companies.some((c: any) => c.kind === 'demo')).toBe(false);
  });
});
