// The key that encrypts secrets saved in the founder console: a file in the data folder, made once (12 Nov 2026).
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { createRuntime, settingsKey } from '../src/node/runtime.ts';
import { readMigrationsDir } from '../src/node/store/migrations.ts';
import type { NodeConfig } from '../src/node/config.ts';
import { canEncrypt, decryptSecret, encryptSecret } from '../src/worker/services/email/settings.ts';

const dirs: string[] = [];
afterAll(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));
const tmp = () => {
  const d = mkdtempSync(join(tmpdir(), 'work-settings-key-'));
  dirs.push(d);
  return d;
};

function config(dataDir: string, extra: Record<string, string> = {}): NodeConfig {
  return { port: 0, host: '127.0.0.1', dataDir, staticDir: dataDir, vars: { ENVIRONMENT: 'test', APP_NAME: 'T', APP_URL: 'http://example.com', ALLOW_SIGNUP: 'true', SESSION_TTL_HOURS: '1', ...extra }, trustProxy: false, version: null, cron: false, maxBodyBytes: 1 << 20, shutdownTimeoutMs: 1000 };
}

describe('settings encryption key', () => {
  it('is created once, readable only by the server, and kept across restarts', async () => {
    const dir = tmp();
    const migrations = readMigrationsDir('migrations');
    let rt = createRuntime(config(dir), { migrations });
    const key = rt.env.SETTINGS_ENCRYPTION_KEY!;
    expect(Buffer.from(key, 'base64')).toHaveLength(32);
    expect(statSync(join(dir, 'settings.key')).mode & 0o777).toBe(0o600);
    expect(canEncrypt(rt.env)).toBe(true);
    const enc = await encryptSecret(rt.env, 'secret-value');
    rt.close();
    rt = createRuntime(config(dir), { migrations });
    expect(rt.env.SETTINGS_ENCRYPTION_KEY).toBe(key);
    expect(await decryptSecret(rt.env, enc)).toBe('secret-value');
    rt.close();
    // Not in the database.
    expect(readFileSync(join(dir, 'db.sqlite')).includes(Buffer.from(key))).toBe(false);
  });

  it('uses SETTINGS_ENCRYPTION_KEY from the environment instead, without writing a file', () => {
    const dir = tmp();
    const envKey = Buffer.alloc(32, 3).toString('base64');
    const rt = createRuntime(config(dir, { SETTINGS_ENCRYPTION_KEY: envKey }), { migrations: readMigrationsDir('migrations') });
    expect(rt.env.SETTINGS_ENCRYPTION_KEY).toBe(envKey);
    rt.close();
    expect(() => statSync(join(dir, 'settings.key'))).toThrow();
  });

  it('refuses to start with a damaged key file rather than replacing it', () => {
    const dir = tmp();
    writeFileSync(join(dir, 'settings.key'), 'not-a-key\n');
    expect(() => settingsKey(dir)).toThrow(/not a 32-byte base64 key/);
    expect(readFileSync(join(dir, 'settings.key'), 'utf8')).toBe('not-a-key\n');
  });
});
