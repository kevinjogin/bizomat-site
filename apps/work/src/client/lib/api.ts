// Thin fetch wrapper: same-origin cookies, CSRF header on unsafe methods,
// consistent error objects.
import { appUrl } from './base';

let csrfToken: string | null = null;

export function setCsrfToken(t: string | null) {
  csrfToken = t;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
    public body?: any,
  ) {
    super(message);
  }
}

type Opts = { method?: string; body?: unknown; form?: FormData; signal?: AbortSignal; allowStatuses?: number[] };

export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const method = opts.method ?? (opts.body !== undefined || opts.form ? 'POST' : 'GET');
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (method !== 'GET' && method !== 'HEAD' && csrfToken) headers['X-CSRF-Token'] = csrfToken;
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  let res: Response;
  try {
    res = await fetch(appUrl(path.startsWith('/api') ? path : `/api${path}`), { method, headers, body, credentials: 'same-origin', signal: opts.signal });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    throw new ApiError(0, 'Network error — check your connection and try again.');
  }
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok && !opts.allowStatuses?.includes(res.status)) {
    if (res.status === 401 && !path.includes('/auth/')) window.dispatchEvent(new CustomEvent('workos:unauthorized'));
    // The account must choose a new password (founder reset or security reset): the session reloads and the app shows
    // the Choose a new password page.
    if (res.status === 403 && data?.details?.code === 'PASSWORD_RESET_REQUIRED') window.dispatchEvent(new CustomEvent('workos:password-reset-required'));
    throw new ApiError(res.status, (data && data.error) || `Request failed (${res.status})`, data?.details, data);
  }
  return data as T;
}

/** POST and receive a file (a document preview): its bytes, or the error the server gave. */
export async function postForBlob(path: string, body: unknown, signal?: AbortSignal): Promise<Blob> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/pdf, application/json' };
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  const res = await fetch(appUrl(path.startsWith('/api') ? path : `/api${path}`), { method: 'POST', headers, body: JSON.stringify(body), credentials: 'same-origin', signal });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // not JSON
    }
    throw new ApiError(res.status, message);
  }
  return res.blob();
}

export const get = <T = any>(p: string, signal?: AbortSignal) => api<T>(p, { signal });
export const post = <T = any>(p: string, body?: unknown) => api<T>(p, { method: 'POST', body: body ?? {} });
export const patch = <T = any>(p: string, body: unknown) => api<T>(p, { method: 'PATCH', body });
export const put = <T = any>(p: string, body: unknown) => api<T>(p, { method: 'PUT', body });
export const del = <T = any>(p: string, body?: unknown) => api<T>(p, { method: 'DELETE', body });

export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return 'Something went wrong';
}

export async function upload(form: FormData) {
  return api('/files', { method: 'POST', form });
}
