// The Node server end to end over real HTTP and WebSocket connections.

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import WebSocket from 'ws';
import type { LogFields } from '../src/node/log.ts';
import { startServer, type RunningServer } from '../src/node/runtime.ts';
import { PASSWORD, tempDir, testConfig } from './helpers.ts';

const root = tempDir('work-server-');
const staticDir = join(root, 'static');
mkdirSync(join(staticDir, 'assets'), { recursive: true });
writeFileSync(join(staticDir, 'index.html'), '<!doctype html><title>Work</title><div id="root"></div>');
writeFileSync(join(staticDir, 'assets', 'app-abc.js'), 'console.log("app")');

const logs: LogFields[] = [];
let server: RunningServer;
let proxied: RunningServer;

beforeAll(async () => {
  server = await startServer(testConfig(join(root, 'data'), staticDir, { maxBodyBytes: 2 * 1024 * 1024 }), { log: (f) => logs.push(f) });
  proxied = await startServer(testConfig(join(root, 'data-proxied'), staticDir, { trustProxy: true, vars: { ENVIRONMENT: 'development', APP_NAME: 'Work', APP_URL: 'https://work.example.com', ALLOW_SIGNUP: 'true', SESSION_TTL_HOURS: '336' } }));
});

afterAll(async () => {
  await proxied?.close();
  await server?.close();
});

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...Array.from({ length: 300 }, (_, i) => i % 256)]);
let n = 0;
const email = () => `node.server.${Date.now()}.${++n}@example.com`;

interface Session {
  cookie: string;
  csrf: string;
  userId: string;
  workspaceId: string;
  email: string;
}

async function signup(base: string, headers: Record<string, string> = {}): Promise<Session> {
  const address = email();
  const res = await fetch(`${base}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base, ...headers },
    body: JSON.stringify({ email: address, name: 'Node Tester', password: PASSWORD }),
  });
  if (res.status !== 201) throw new Error(`signup ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { csrfToken: string; user: { id: string }; workspaces: { id: string }[] };
  const cookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => c.includes('workos_sid='))!;
  return { cookie, csrf: data.csrfToken, userId: data.user.id, workspaceId: data.workspaces[0].id, email: address };
}

async function api<T = any>(s: Session, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${server.url}${path}`, {
    method,
    headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return (text ? JSON.parse(text) : null) as T;
}

function wsUrl(path: string) {
  return server.url.replace('http://', 'ws://') + path;
}

/** Opens a socket; resolves with it, or with the HTTP status of a refused upgrade. */
function connect(path: string, headers: Record<string, string>): Promise<WebSocket | number> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl(path), { headers });
    ws.once('open', () => resolve(ws));
    ws.once('unexpected-response', (_req, res) => {
      resolve(res.statusCode ?? 0);
      res.resume();
    });
    ws.once('error', (e) => reject(e));
  });
}

function nextMessage(ws: WebSocket, timeoutMs = 3000): Promise<string> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('no message')), timeoutMs);
    ws.once('message', (data) => {
      clearTimeout(t);
      resolve(data.toString());
    });
  });
}

describe('Node server: HTTP', () => {
  it('serves the Worker with its security headers', async () => {
    const res = await fetch(`${server.url}/api/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'ok', db: 'ok', environment: 'development' });
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('serves the SPA and assets through the Worker route', async () => {
    const page = await fetch(`${server.url}/w/x/boards`, { headers: { Accept: 'text/html' }, redirect: 'manual' });
    expect(page.status).toBe(302);
    expect(page.headers.get('location')).toBe('/login?next=%2Fw%2Fx%2Fboards');
    const login = await fetch(`${server.url}/login`, { headers: { Accept: 'text/html' } });
    expect(login.status).toBe(200);
    expect(await login.text()).toContain('<div id="root">');
    const js = await fetch(`${server.url}/assets/app-abc.js`);
    expect(js.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(js.headers.get('content-type')).toBe('text/javascript; charset=utf-8');
  });

  it('records the socket address, not a spoofed CF-Connecting-IP, without a trusted proxy', async () => {
    const s = await signup(server.url, { 'CF-Connecting-IP': '6.6.6.6', 'X-Forwarded-For': '7.7.7.7' });
    const row = server.runtime.db.prepare('SELECT ip FROM sessions WHERE user_id = ?').get(s.userId) as { ip: string };
    expect(row.ip).toBe('127.0.0.1');
  });

  it('trusts CF-Connecting-IP and X-Forwarded-Host/Proto from the platform proxy', async () => {
    const headers = { 'CF-Connecting-IP': '198.51.100.23', 'X-Forwarded-Host': 'work.example.com', 'X-Forwarded-Proto': 'https' };
    const res = await fetch(`${proxied.url}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://work.example.com', ...headers },
      body: JSON.stringify({ email: email(), name: 'Proxied', password: PASSWORD }),
    });
    expect(res.status).toBe(201);
    const { user } = (await res.json()) as { user: { id: string } };
    expect((proxied.runtime.db.prepare('SELECT ip FROM sessions WHERE user_id = ?').get(user.id) as { ip: string }).ip).toBe('198.51.100.23');
    // The same headers sent straight to a server that does not trust a proxy are ignored: the Origin no longer matches.
    const direct = await fetch(`${server.url}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://work.example.com', ...headers },
      body: JSON.stringify({ email: email(), name: 'Direct', password: PASSWORD }),
    });
    expect(direct.status).toBe(403);
  });

  it('treats a protocol-relative request target as a path on its own host', async () => {
    const res = await new Promise<{ status: number; type: string }>((resolve, reject) => {
      const req = httpRequest({ host: '127.0.0.1', port: server.port, path: '//evil.example/api/health', headers: { Host: `127.0.0.1:${server.port}` } }, (r) => {
        r.resume();
        resolve({ status: r.statusCode ?? 0, type: String(r.headers['content-type']) });
      });
      req.on('error', reject);
      req.end();
    });
    // Not the health API and not another host: the SPA fallback for the path "//evil.example/api/health".
    expect(res).toEqual({ status: 200, type: 'text/html; charset=utf-8' });
  });

  it('refuses request bodies over the limit with 413', async () => {
    const big = new Uint8Array(3 * 1024 * 1024);
    const declared = await fetch(`${server.url}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: server.url }, body: big });
    expect(declared.status).toBe(413);
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(c) {
        if (sent >= 3 * 1024 * 1024) return c.close();
        sent += 256 * 1024;
        c.enqueue(new Uint8Array(256 * 1024));
      },
    });
    const chunked = await fetch(`${server.url}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: server.url }, body: stream, duplex: 'half' } as RequestInit);
    expect(chunked.status).toBe(413);
  });

  it('uploads and downloads files byte for byte through R2 on disk', async () => {
    const s = await signup(server.url);
    const board = await api(s, 'POST', `/api/workspaces/${s.workspaceId}/boards`, { name: 'Files' });
    const item = await api(s, 'POST', `/api/boards/${board.id}/items`, { name: 'With file' });
    const form = new FormData();
    form.set('file', new File([PNG], 'pixel.png', { type: 'image/png' }));
    form.set('scope', 'item');
    form.set('itemId', item.id);
    const up = await fetch(`${server.url}/api/files`, { method: 'POST', headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: server.url }, body: form });
    expect(up.status).toBe(201);
    const att = (await up.json()) as { id: string; size: number };
    expect(att.size).toBe(PNG.length);
    const down = await fetch(`${server.url}/api/files/${att.id}`, { headers: { Cookie: s.cookie } });
    expect(down.status).toBe(200);
    expect(down.headers.get('content-type')).toBe('image/png');
    expect(down.headers.get('etag')).toBe(`"${createHash('md5').update(PNG).digest('hex')}"`);
    const bytes = new Uint8Array(await down.arrayBuffer());
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(createHash('sha256').update(PNG).digest('hex'));
    const head = await fetch(`${server.url}/api/files/${att.id}`, { method: 'HEAD', headers: { Cookie: s.cookie } });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe('');
    const stranger = await signup(server.url);
    expect((await fetch(`${server.url}/api/files/${att.id}`, { headers: { Cookie: stranger.cookie } })).status).toBe(404);
  });

  it('logs one JSON line per request without query strings, addresses or tokens', async () => {
    await (await fetch(`${server.url}/api/health?token=secret-value`, { headers: { 'CF-Connecting-IP': '6.6.6.6' } })).text();
    await (await fetch(`${server.url}/invite/aVeryLongInvitationTokenValue1234567890`, { headers: { Accept: 'text/html' }, redirect: 'manual' })).text();
    await new Promise((r) => setTimeout(r, 50));
    const requests = logs.filter((l) => 'method' in l);
    expect(requests.length).toBeGreaterThan(3);
    for (const l of requests) expect(Object.keys(l).sort()).toEqual(expect.arrayContaining(['method', 'ms', 'path', 'status']));
    const text = JSON.stringify(logs);
    expect(text).not.toContain('secret-value');
    expect(text).not.toContain('127.0.0.1');
    expect(text).not.toContain('6.6.6.6');
    expect(text).not.toContain('aVeryLongInvitationTokenValue');
    expect(text).not.toContain(PASSWORD);
    expect(requests.some((l) => l.path === '/invite/:token')).toBe(true);
  });

  it('runs the scheduled maintenance through the Worker handler', async () => {
    await server.runtime.scheduled(Date.now());
    const row = server.runtime.db.prepare("SELECT value FROM system_kv WHERE key = 'last_maintenance'").get() as { value: string };
    expect(JSON.parse(row.value)).toHaveProperty('scheduled');
  });
});

describe('Node server: realtime', () => {
  let owner: Session;
  let member: Session;
  let outsider: Session;
  let boardId: string;

  beforeAll(async () => {
    owner = await signup(server.url);
    member = await signup(server.url);
    outsider = await signup(server.url);
    const inv = await api(owner, 'POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: member.email, role: 'member' });
    await api(member, 'POST', `/api/auth/invitations/${inv.inviteUrl.split('/invite/')[1]}/accept`, {});
    boardId = (await api(owner, 'POST', `/api/workspaces/${owner.workspaceId}/boards`, { name: 'Live' })).id;
  });

  it('refuses unauthenticated, cross-site and foreign-board upgrades with no socket', async () => {
    expect(await connect(`/api/live/boards/${boardId}`, { Origin: server.url })).toBe(401);
    expect(await connect(`/api/live/boards/${boardId}`, { Origin: 'https://evil.example', Cookie: owner.cookie })).toBe(403);
    expect(await connect(`/api/live/boards/${boardId}`, { Origin: server.url, Cookie: outsider.cookie })).toBe(404);
    expect(await connect(`/api/live/boards/nope`, { Origin: server.url, Cookie: owner.cookie })).toBe(404);
    expect(await connect(`/api/health`, { Origin: server.url, Cookie: owner.cookie })).toBe(200);
    expect(server.runtime.hub.connections).toBe(0);
  });

  it('answers ping with pong and fans board events out to every member socket', async () => {
    const a = (await connect(`/api/live/boards/${boardId}`, { Origin: server.url, Cookie: owner.cookie })) as WebSocket;
    const b = (await connect(`/api/live/boards/${boardId}`, { Origin: server.url, Cookie: member.cookie })) as WebSocket;
    expect(server.runtime.hub.connections).toBe(2);
    const pong = nextMessage(a);
    a.send('ping');
    expect(await pong).toBe('pong');
    const got = Promise.all([nextMessage(a), nextMessage(b)]);
    const item = await api(member, 'POST', `/api/boards/${boardId}/items`, { name: 'Realtime item' });
    const [ma, mb] = (await got).map((m) => JSON.parse(m));
    expect(ma).toEqual(mb);
    expect(ma).toMatchObject({ boardId, actorId: member.userId });
    expect(JSON.stringify(ma)).toContain(item.id);
    a.close();
    b.close();
    await new Promise((r) => setTimeout(r, 100));
    expect(server.runtime.hub.connections).toBe(0);
  });
});

describe('Node server: under /tasks, as the platform proxy sends bizomat.ai/tasks', () => {
  const pageDir = join(root, 'static-tasks');
  const page = `<!doctype html><html><head><title>Work</title><script type="module" src="./assets/app-abc.js"></script></head><body><div id="root"></div></body></html>${' '.repeat(2000)}`;
  let app: RunningServer;

  beforeAll(async () => {
    mkdirSync(join(pageDir, 'assets'), { recursive: true });
    writeFileSync(join(pageDir, 'index.html'), page);
    writeFileSync(join(pageDir, 'assets', 'app-abc.js'), 'console.log("app")'.repeat(100));
    app = await startServer(testConfig(join(root, 'data-tasks'), pageDir));
    await app.runtime.assets.precompress(); // as at startup: files are compressed, pages never
  });

  afterAll(async () => {
    await app?.close();
  });

  it('starts each page with <base href> for its path, and serves the files under it', async () => {
    // One system: Project Management's pages open inside BIZOMAT System (/tasks/... answers 302 to /system/tasks/...).
    // Signed out, /system/tasks/ ends on the System's sign-in page (through the session carry).
    for (const [path, base] of [['/system/tasks/login', '/system/tasks/'], ['/system/tasks/', '/system/'], ['/system/login', '/system/'], ['/login', '/']]) {
      const res = await fetch(`${app.url}${path}`, { headers: { Accept: 'text/html', 'Accept-Encoding': 'br, gzip' } });
      expect(res.status, path).toBe(200);
      expect(res.headers.get('content-encoding'), path).toBeNull();
      const html = page.replace('<head>', `<head><base href="${base}">`);
      // Inside the System the page carries its title.
      expect(await res.text(), path).toBe(base.startsWith('/system/') ? html.replace('<title>Work</title>', '<title>BIZOMAT System</title>') : html);
    }
    const js = await fetch(`${app.url}/tasks/assets/app-abc.js`, { headers: { 'Accept-Encoding': 'br' } });
    expect(js.status).toBe(200);
    expect(js.headers.get('content-encoding')).toBe('br');
    expect((await fetch(`${app.url}/system/tasks/assets/app-abc.js`)).status).toBe(200);
    const inside = await fetch(`${app.url}/tasks/w/abc/home`, { headers: { Accept: 'text/html' }, redirect: 'manual' });
    expect(inside.status).toBe(302);
    expect(inside.headers.get('location')).toBe('/system/tasks/w/abc/home');
    const away = await fetch(`${app.url}/system/tasks/w/abc/home`, { headers: { Accept: 'text/html', Cookie: 'sys_carry=1' }, redirect: 'manual' });
    expect(away.status).toBe(302);
    expect(away.headers.get('location')).toBe(`/system/tasks/login?next=${encodeURIComponent('/w/abc/home')}`);
  });

  it('scopes the session to /tasks and upgrades the live board socket there', async () => {
    const s = await signup(`${app.url}/tasks`, { Origin: app.url });
    const res = await fetch(`${app.url}/tasks/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: app.url },
      body: JSON.stringify({ email: email(), name: 'Path Tester', password: PASSWORD }),
    });
    expect(res.headers.getSetCookie().find((c) => c.startsWith('workos_sid='))).toMatch(/;\s*path=\/tasks(;|$)/i);
    const me = await fetch(`${app.url}/tasks/api/auth/me`, { headers: { Cookie: s.cookie } });
    expect(me.status).toBe(200);
    const board = await fetch(`${app.url}/tasks/api/workspaces/${s.workspaceId}/boards`, {
      method: 'POST',
      headers: { Cookie: s.cookie, 'X-CSRF-Token': s.csrf, Origin: app.url, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Under a path' }),
    });
    expect(board.status).toBe(201);
    const { id } = (await board.json()) as { id: string };
    const ws = await new Promise<WebSocket | number>((resolve, reject) => {
      const socket = new WebSocket(`${app.url.replace('http://', 'ws://')}/tasks/api/live/boards/${id}`, { headers: { Origin: app.url, Cookie: s.cookie } });
      socket.once('open', () => resolve(socket));
      socket.once('unexpected-response', (_req, r) => {
        resolve(r.statusCode ?? 0);
        r.resume();
      });
      socket.once('error', reject);
    });
    expect(ws).toBeInstanceOf(WebSocket);
    const live = ws as WebSocket;
    const pong = nextMessage(live);
    live.send('ping');
    expect(await pong).toBe('pong');
    live.close();
  });
});

describe('Node server: lock file', () => {
  it('takes over a lock left by a crashed server and removes it on stop', async () => {
    const dir = join(root, 'data-lock');
    mkdirSync(dir, { recursive: true });
    const { hostname } = await import('node:os');
    writeFileSync(join(dir, 'server.lock'), JSON.stringify({ pid: process.ppid, host: hostname(), startedAt: 'earlier' }));
    const lines: LogFields[] = [];
    const s = await startServer(testConfig(dir, staticDir), { log: (f) => lines.push(f) });
    expect(lines.some((l) => l.event === 'lock_taken_over')).toBe(true);
    const { readFileSync, existsSync } = await import('node:fs');
    expect(JSON.parse(readFileSync(join(dir, 'server.lock'), 'utf8')).pid).toBe(process.pid);
    await s.close();
    expect(existsSync(join(dir, 'server.lock'))).toBe(false);
  });
});

describe('Node server: shutdown', () => {
  it('finishes in-flight requests and background work, then refuses new connections', async () => {
    const stopping = await startServer(testConfig(join(root, 'data-stop'), staticDir));
    let finishBody!: () => void;
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(new TextEncoder().encode('{"email":"nobody@example.com",'));
        finishBody = () => {
          c.enqueue(new TextEncoder().encode('"password":"wrong-password-1"}'));
          c.close();
        };
      },
    });
    const inFlight = fetch(`${stopping.url}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: stopping.url }, body, duplex: 'half' } as RequestInit);
    await new Promise((r) => setTimeout(r, 100));
    let backgroundDone = false;
    stopping.runtime.tracker.add(new Promise<void>((r) => setTimeout(() => ((backgroundDone = true), r()), 300)));
    const closed = stopping.close();
    finishBody();
    const res = await inFlight;
    expect(res.status).toBe(401);
    await closed;
    expect(backgroundDone).toBe(true);
    await expect(fetch(`${stopping.url}/api/health`)).rejects.toThrow();
  });
});
