// Stronger password hashing on the Node server (Stage 1, audit S7; src/node/password.ts): scrypt at OWASP's cost,
// PBKDF2 hashes from before still accepted and replaced at the next sign-in.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { scryptHasher } from '../src/node/password.ts';
import { hashPassword, needsRehash, setStrongHasher, verifyPassword } from '../src/worker/auth/password.ts';
import { createRuntime } from '../src/node/runtime.ts';
import type { NodeConfig } from '../src/node/config.ts';

const dirs: string[] = [];
afterAll(() => {
  setStrongHasher(null);
  dirs.forEach((d) => rmSync(d, { recursive: true, force: true }));
});

describe('scrypt on the Node server', () => {
  it('hashes at the recommended cost, verifies, refuses a wrong password and knows an outdated hash', async () => {
    const h = scryptHasher();
    const stored = await h.hash('correct-horse-42!');
    expect(stored).toMatch(/^scrypt\$15\$8\$3\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/);
    expect(await h.verify('correct-horse-42!', stored)).toBe(true);
    expect(await h.verify('wrong-horse-42!', stored)).toBe(false);
    expect(h.outdated(stored)).toBe(false);
    expect(h.outdated((await scryptHasher(12).hash('x-horse-1')))).toBe(true);
    // Settings out of range are refused rather than run.
    expect(await h.verify('correct-horse-42!', stored.replace('scrypt$15$', 'scrypt$40$'))).toBe(false);
  });

  it('accepts a PBKDF2 hash from before and marks it for replacement; new hashes are scrypt', async () => {
    setStrongHasher(null);
    const old = await hashPassword('correct-horse-42!');
    expect(old.startsWith('pbkdf2$')).toBe(true);
    setStrongHasher(scryptHasher(10));
    expect(await verifyPassword('correct-horse-42!', old)).toBe(true);
    expect(needsRehash(old)).toBe(true);
    const fresh = await hashPassword('correct-horse-42!');
    expect(fresh.startsWith('scrypt$10$')).toBe(true);
    expect(await verifyPassword('correct-horse-42!', fresh)).toBe(true);
    expect(needsRehash(fresh)).toBe(false);
    expect(await verifyPassword('anything-else-1', null)).toBe(false);
  });

  it('replaces a PBKDF2 hash with scrypt at the next sign-in on the server', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'work-scrypt-'));
    dirs.push(dir);
    const config: NodeConfig = { port: 0, host: '127.0.0.1', dataDir: dir, staticDir: dir, vars: { ENVIRONMENT: 'test', APP_NAME: 'T', APP_URL: 'http://example.com', ALLOW_SIGNUP: 'true', SESSION_TTL_HOURS: '1' }, trustProxy: false, version: null, cron: false, maxBodyBytes: 1 << 20, shutdownTimeoutMs: 1000 };
    setStrongHasher(null);
    const old = await hashPassword('correct-horse-42!');
    const rt = createRuntime(config);
    try {
      rt.db.prepare("INSERT INTO users (id, email, name, password_hash, email_verified_at, created_at, updated_at) VALUES ('u-old', 'old@example.com', 'Old', ?, 1, 1, 1)").run(old);
      const res = await rt.fetch(new Request('http://example.com/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://example.com' }, body: JSON.stringify({ email: 'old@example.com', password: 'correct-horse-42!' }) }));
      expect(res.status).toBe(200);
      const after = rt.db.prepare("SELECT password_hash FROM users WHERE id = 'u-old'").get() as { password_hash: string };
      expect(after.password_hash.startsWith('scrypt$')).toBe(true);
      const again = await rt.fetch(new Request('http://example.com/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://example.com' }, body: JSON.stringify({ email: 'old@example.com', password: 'correct-horse-42!' }) }));
      expect(again.status).toBe(200);
    } finally {
      rt.close();
    }
  });
});
