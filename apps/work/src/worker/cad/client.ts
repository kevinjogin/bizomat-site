// Calls from the ERP's server to CAD Automation's engine (docs/cad/README.md, "The contract"). The engine stays in the
// Fly app cados (Amsterdam); the ERP reaches it at CAD_URL (on Fly, its private address http://cados.internal:8080).
// Every call carries a one-minute assertion signed by the ERP (keys.ts) for the signed-in person in one company.
// Without CAD_URL (staging, tests) the module says CAD Automation is not connected on this server.

import type { Env } from '../env';
import { HttpError } from '../lib/util';
import { type AssertionClaims, signAssertion } from './keys';

export const CAD_API = '/api/erp/v1';
const TIMEOUT = 25_000;

export function cadBase(env: Env): string | null {
  const u = (env.CAD_URL ?? '').trim().replace(/\/+$/, '');
  return /^https?:\/\/[^\s/]+/.test(u) ? u : null;
}

/** Why CAD Automation cannot be asked, in plain words, or null when it can. */
export function cadUnavailable(env: Env): string | null {
  return cadBase(env) ? null : 'CAD Automation is not connected to this server (CAD_URL is not set).';
}

async function send(env: Env, claims: AssertionClaims, method: 'GET' | 'POST', op: string, body?: unknown): Promise<Response> {
  const base = cadBase(env);
  if (!base) throw new HttpError(503, cadUnavailable(env)!, { code: 'CAD_NOT_CONNECTED' });
  const path = `${CAD_API}/${op.replace(/^\/+/, '')}`;
  const text = method === 'POST' ? JSON.stringify(body ?? {}) : '';
  const assertion = await signAssertion(env, claims, { method, path, body: text });
  let r: Response;
  try {
    r = await fetch(base + path, {
      method,
      headers: { Authorization: `BIZOMAT-ERP ${assertion}`, Accept: 'application/json', ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}) },
      body: method === 'POST' ? text : undefined,
      signal: AbortSignal.timeout(TIMEOUT),
      redirect: 'manual',
    });
  } catch {
    throw new HttpError(502, 'CAD Automation could not be reached. Try again in a minute.', { code: 'CAD_UNREACHABLE' });
  }
  return r;
}

/** A JSON answer from CAD Automation; its own refusals (4xx) pass through with their message, anything else is 502. */
export async function cadJson<T>(env: Env, claims: AssertionClaims, op: string, body?: unknown): Promise<T> {
  const r = await send(env, claims, 'POST', op, body);
  let data: any = null;
  try {
    data = await r.json();
  } catch {
    data = null;
  }
  if (r.ok && data && typeof data === 'object') return data as T;
  const message = typeof data?.error?.message === 'string' ? data.error.message.slice(0, 300) : null;
  const code = typeof data?.error?.code === 'string' ? data.error.code.slice(0, 60) : 'CAD_ERROR';
  if (r.status >= 400 && r.status < 500 && message) throw new HttpError(r.status, message, { code });
  throw new HttpError(502, message ?? 'CAD Automation answered with an error. Try again in a minute.', { code: r.status >= 500 ? 'CAD_ERROR' : code });
}

/** A file from CAD Automation (an export), with its name, type and SHA-256 as CAD Automation reports them. */
export async function cadFile(env: Env, claims: AssertionClaims, op: string, maxBytes: number): Promise<{ bytes: Uint8Array; name: string; type: string; sha256: string; size: number }> {
  const r = await send(env, claims, 'GET', op);
  if (!r.ok) {
    let message: string | null = null;
    try {
      message = ((await r.json()) as any)?.error?.message ?? null;
    } catch {
      message = null;
    }
    throw new HttpError(r.status === 404 ? 404 : r.status === 403 ? 403 : 502, message ?? 'The export could not be read from CAD Automation.', { code: 'CAD_EXPORT' });
  }
  const size = Number(r.headers.get('content-length') ?? '0');
  if (size > maxBytes) throw new HttpError(413, 'The export is larger than the ERP keeps.', { code: 'CAD_EXPORT_TOO_LARGE' });
  const bytes = new Uint8Array(await r.arrayBuffer());
  if (bytes.byteLength > maxBytes) throw new HttpError(413, 'The export is larger than the ERP keeps.', { code: 'CAD_EXPORT_TOO_LARGE' });
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (b) => b.toString(16).padStart(2, '0')).join('');
  const claimed = (r.headers.get('x-sha256') ?? '').toLowerCase();
  if (claimed && claimed !== digest) throw new HttpError(502, 'The export changed on the way from CAD Automation. Try again.', { code: 'CAD_EXPORT_CHECKSUM' });
  const disposition = r.headers.get('content-disposition') ?? '';
  const name = /filename\*=UTF-8''([^;]+)/i.exec(disposition)?.[1] ?? /filename="([^"]+)"/i.exec(disposition)?.[1] ?? 'export';
  let decoded = name;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    decoded = name;
  }
  return { bytes, name: decoded.replace(/[\\/\x00-\x1f]/g, '_').slice(0, 200), type: (r.headers.get('content-type') ?? 'application/octet-stream').split(';')[0].trim(), sha256: digest, size: bytes.byteLength };
}
