import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll } from 'vitest';
import type { NodeConfig } from '../src/node/config.ts';

/** A temporary directory removed after the test file. */
export function tempDir(prefix = 'work-node-'): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

export function testConfig(dataDir: string, staticDir: string, overrides: Partial<NodeConfig> = {}): NodeConfig {
  return {
    port: 0,
    host: '127.0.0.1',
    dataDir,
    staticDir,
    vars: { ENVIRONMENT: 'development', APP_NAME: 'Work', APP_URL: 'http://localhost', ALLOW_SIGNUP: 'true', SESSION_TTL_HOURS: '336' },
    trustProxy: false,
    version: 'test-version',
    cron: false,
    maxBodyBytes: 32 * 1024 * 1024,
    shutdownTimeoutMs: 5000,
    ...overrides,
  };
}

export const PASSWORD = 'correct-horse-42!';
