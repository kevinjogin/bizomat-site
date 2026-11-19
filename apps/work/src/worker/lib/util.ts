import type { Context } from 'hono';
import type { ZodType } from 'zod';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const notFound = (what = 'Resource') => new HttpError(404, `${what} not found`);
export const forbidden = (msg = 'You do not have permission to do that') => new HttpError(403, msg);
export const badRequest = (msg: string, details?: unknown) => new HttpError(400, msg, details);

export function now(): number {
  return Date.now();
}

/** Random URL-safe id (96 bits of entropy). */
export function newId(): string {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return base64url(b);
}

export function base64url(bytes: Uint8Array): string {
  let s = '';
  for (const x of bytes) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function randomToken(bytes = 32): string {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return base64url(b);
}

export async function sha256Hex(input: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function parseJson<T>(s: string | null | undefined, fallback: T): T {
  if (s == null) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export async function body<T>(c: Context, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    throw badRequest('Request body must be valid JSON');
  }
  const r = schema.safeParse(raw);
  if (!r.success) {
    throw badRequest(
      'Invalid request',
      r.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    );
  }
  return r.data;
}

export function clientIp(c: Context): string {
  return c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() ?? 'local';
}

/** Clauses joined after a statement's own first condition: `WHERE x.company_id = ?${andAll(where)}`. */
export function andAll(clauses: string[]): string {
  return clauses.map((c) => ` AND ${c}`).join('');
}

/**
 * One row of a company's own table, inserted with its company written first in the statement: the row must carry a
 * non-empty company_id (test-node/company-queries.ts checks that every statement on a company table names it).
 */
export function insertCompanyRow(db: D1Database, table: string, row: Record<string, unknown>, opts: { orIgnore?: boolean } = {}): D1PreparedStatement {
  const { company_id: companyId, ...rest } = row;
  if (typeof companyId !== 'string' || !companyId) throw new Error(`A row of ${table} needs its company`);
  const keys = Object.keys(rest);
  for (const k of [table, ...keys]) if (!/^[a-z_][a-z0-9_]*$/.test(k)) throw new Error(`Not a column name: ${k}`);
  return db
    .prepare(`INSERT${opts.orIgnore ? ' OR IGNORE' : ''} INTO ${table} (company_id${keys.map((k) => `, ${k}`).join('')}) VALUES (?${keys.map(() => ', ?').join('')})`)
    .bind(companyId, ...keys.map((k) => rest[k]));
}

export function placeholders(n: number): string {
  return Array.from({ length: n }, () => '?').join(',');
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
