// Configuration of the Node runtime from environment variables. This is the
// contract the platform's Docker image and proxy rely on; see
// docs/NODE-RUNTIME.md for every variable.

import { resolve } from 'node:path';

export interface WorkerVars {
  ENVIRONMENT: string;
  APP_NAME: string;
  APP_URL: string;
  ALLOW_SIGNUP: string;
  SESSION_TTL_HOURS: string;
  /** Pages asked for on another host answer 301 to the same path here (src/worker/mount.ts canonicalRedirect). */
  CANONICAL_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

/** An https address with an optional lowercase path, as canonicalRedirect (src/worker/mount.ts) accepts it. */
const CANONICAL = /^https:\/\/[a-z0-9.-]+(\/[a-z0-9-]+)*\/?$/i;

export interface NodeConfig {
  port: number;
  host: string;
  dataDir: string;
  staticDir: string;
  vars: WorkerVars;
  trustProxy: boolean;
  version: string | null;
  cron: boolean;
  /** Largest request body accepted (the Worker itself refuses uploads above 25 MB). */
  maxBodyBytes: number;
  shutdownTimeoutMs: number;
}

export class ConfigError extends Error {}

export const DEFAULT_PORT = 8002;
export const DEFAULT_MAX_BODY_BYTES = 32 * 1024 * 1024;

function int(name: string, raw: string | undefined, fallback: number, min: number, max: number): number {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) throw new ConfigError(`${name} must be an integer between ${min} and ${max}`);
  return n;
}

export function configFromEnv(env: Record<string, string | undefined> = process.env, cwd = process.cwd()): NodeConfig {
  const environment = env.ENVIRONMENT?.trim() || 'production';
  const appUrl = env.APP_URL?.trim() ?? '';
  if (appUrl) {
    let u: URL;
    try {
      u = new URL(appUrl);
    } catch {
      throw new ConfigError('APP_URL must be an absolute URL such as https://work.example.com');
    }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new ConfigError('APP_URL must use http or https');
  } else if (environment !== 'development' && environment !== 'test') {
    throw new ConfigError('APP_URL is required (the public origin, for example https://work.example.com)');
  }
  const signup = env.ALLOW_SIGNUP?.trim() || 'false';
  if (signup !== 'true' && signup !== 'false') throw new ConfigError('ALLOW_SIGNUP must be "true" or "false"');
  const ttl = env.SESSION_TTL_HOURS?.trim() || '336';
  if (!(Number(ttl) > 0)) throw new ConfigError('SESSION_TTL_HOURS must be a positive number of hours');
  const vars: WorkerVars = {
    ENVIRONMENT: environment,
    APP_NAME: env.APP_NAME?.trim() || 'Work',
    APP_URL: appUrl,
    ALLOW_SIGNUP: signup,
    SESSION_TTL_HOURS: ttl,
  };
  const canonical = env.CANONICAL_URL?.trim() ?? '';
  if (canonical && !CANONICAL.test(canonical)) throw new ConfigError('CANONICAL_URL must be an https address such as https://bizomat.ai/tasks');
  if (canonical) vars.CANONICAL_URL = canonical;
  if (env.GOOGLE_CLIENT_ID) vars.GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
  if (env.GOOGLE_CLIENT_SECRET) vars.GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
  return {
    port: int('PORT', env.PORT, DEFAULT_PORT, 0, 65535),
    host: env.HOST?.trim() || '::',
    dataDir: resolve(cwd, env.WORK_DATA_DIR?.trim() || './.data/work'),
    staticDir: resolve(cwd, env.WORK_STATIC_DIR?.trim() || 'dist/client'),
    vars,
    trustProxy: env.WORK_TRUST_PROXY === '1',
    version: env.WORK_VERSION?.trim() || null,
    cron: env.WORK_CRON !== '0',
    maxBodyBytes: int('WORK_MAX_BODY_BYTES', env.WORK_MAX_BODY_BYTES, DEFAULT_MAX_BODY_BYTES, 1024 * 1024, 1024 * 1024 * 1024),
    shutdownTimeoutMs: 10_000,
  };
}
