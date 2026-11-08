// The server's own data store client (opensketch/persist.py, what the supervisor runs) against this Worker's store
// (src/persist.ts) over real HTTP: both sides must agree on paths, lengths, checksums and listings.
import { execFile } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { handlePersist, PERSIST_HOST, type StoreBucket } from '../src/persist';
import { bucket } from './bucket';

const run = promisify(execFile);
const REPO = fileURLToPath(new URL('../../..', import.meta.url));
const SCRIPT = fileURLToPath(new URL('./contract.py', import.meta.url));
const PYTHON = process.env.PYTHON ?? 'python3';

let active: StoreBucket = bucket();
let server: Server;
let base = '';
const work = mkdtempSync(join(tmpdir(), 'persist-contract-'));

async function answer(req: IncomingMessage, res: ServerResponse) {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string' && k !== 'host' && k !== 'connection') headers.set(k, v);
  const method = req.method ?? 'GET';
  const request = new Request(`http://${PERSIST_HOST}${req.url}`, { method, headers, body: method === 'PUT' ? Buffer.concat(chunks) : undefined });
  const r = await handlePersist(request, active);
  res.writeHead(r.status, Object.fromEntries(r.headers));
  res.end(Buffer.from(await r.arrayBuffer()));
}

async function python(mode: string, folder: string): Promise<Record<string, unknown>> {
  const { stdout } = await run(PYTHON, ['-I', SCRIPT, REPO, base, mode, join(work, folder)], { timeout: 60_000 });
  return JSON.parse(stdout);
}

beforeAll(async () => {
  server = createServer((req, res) => void answer(req, res).catch((e) => { res.statusCode = 500; res.end(String(e)); }));
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise((ok) => server.close(ok));
  rmSync(work, { recursive: true, force: true });
});

// Linux and macOS only: the stand-ins are POSIX (a fly script run with sh, python3, mkfifo, symlinks). They run in CI
// and on Linux; on the Windows laptop deploy mcp runs the typecheck and the other tests.
describe.skipIf(process.platform === 'win32')('persist.py against the Worker store', () => {
  it('copies the state files up, then restores them on a fresh disk', async () => {
    const b = bucket(2); // small pages: the client must follow every page of the listing
    active = b;
    const seed = await python('seed', 'first');
    expect(seed).toEqual({ sent: 4, again: 0, after_change: 1, new_file: 1, flushed: true });
    expect([...b.items.keys()].sort()).toEqual(['data/accounts.enabled', 'data/bridge.sqlite', 'data/secret.keys', 'data/users.json']);
    for (const o of b.items.values()) expect(o.customMetadata?.sha256).toMatch(/^[0-9a-f]{64}$/);

    const back = await python('restore', 'second');
    expect(back).toMatchObject({
      restored: ['accounts.enabled', 'bridge.sqlite', 'secret.keys', 'users.json'],
      devices: 501,
      users: { users: [{ id: 'u1', email: 'owner@example.com' }] },
      secret_ok: true,
      mode: '0o600',
    });
    expect(back.resent).toBeLessThanOrEqual(1); // at most the SQLite copy, whose header SQLite may rewrite
  });

  it('does not start a server on an empty store', async () => {
    active = bucket();
    const r = await python('empty', 'third');
    expect(String(r.error)).toMatch(/holds no accounts/);
  });
});
