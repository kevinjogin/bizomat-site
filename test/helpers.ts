import { SELF } from 'cloudflare:test';

export const ORIGIN = 'http://example.com';

let counter = 0;
export function uniqueEmail(prefix = 'user') {
  counter++;
  return `${prefix}.${Date.now().toString(36)}${counter}${Math.random().toString(36).slice(2, 6)}@example.com`;
}

export const PASSWORD = 'correct-horse-42!';

export interface Client {
  cookie: string;
  csrf: string;
  userId: string;
  email: string;
  name: string;
  workspaceId: string;
  req: (method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>) => Promise<Response>;
  json: <T = any>(method: string, path: string, body?: unknown) => Promise<T>;
}

function cookieFrom(res: Response): string {
  const raw = res.headers.getSetCookie?.() ?? [res.headers.get('Set-Cookie') ?? ''];
  return raw
    .map((c) => c.split(';')[0])
    .filter((c) => c.startsWith('workos_sid='))
    .join('; ');
}

export async function raw(method: string, path: string, opts: { body?: unknown; cookie?: string; csrf?: string; headers?: Record<string, string> } = {}) {
  const headers: Record<string, string> = { Origin: ORIGIN, ...(opts.headers ?? {}) };
  if (opts.cookie) headers.Cookie = opts.cookie;
  if (opts.csrf) headers['X-CSRF-Token'] = opts.csrf;
  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) body = opts.body;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  return SELF.fetch(`${ORIGIN}${path}`, { method, headers, body, redirect: 'manual' });
}

export async function signup(name = 'Test User', email = uniqueEmail()): Promise<Client> {
  const res = await raw('POST', '/api/auth/signup', { body: { email, name, password: PASSWORD } });
  if (res.status !== 201) throw new Error(`signup failed ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as any;
  return makeClient(cookieFrom(res), data.csrfToken, data.user, data.workspaces[0]?.id);
}

export async function login(email: string, password = PASSWORD): Promise<Client> {
  const res = await raw('POST', '/api/auth/login', { body: { email, password } });
  if (res.status !== 200) throw new Error(`login failed ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as any;
  return makeClient(cookieFrom(res), data.csrfToken, data.user, data.workspaces[0]?.id);
}

function makeClient(cookie: string, csrf: string, user: { id: string; email: string; name: string }, workspaceId: string): Client {
  const req = (method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>) => raw(method, path, { body, cookie, csrf, headers: extraHeaders });
  return {
    cookie,
    csrf,
    userId: user.id,
    email: user.email,
    name: user.name,
    workspaceId,
    req,
    json: async (method, path, body) => {
      const res = await req(method, path, body);
      const text = await res.text();
      if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
      return text ? JSON.parse(text) : null;
    },
  };
}

/** Invite `invitee` (by email) into `owner`'s workspace and accept. */
export async function addMember(owner: Client, invitee: Client, role: 'admin' | 'member' | 'viewer' = 'member', wsId = owner.workspaceId) {
  const inv = await owner.json('POST', `/api/workspaces/${wsId}/invitations`, { email: invitee.email, role });
  const token = inv.inviteUrl.split('/invite/')[1];
  await invitee.json('POST', `/api/auth/invitations/${token}/accept`, {});
}

export async function createBoard(c: Client, name = 'Test board', extra: Record<string, unknown> = {}) {
  const board = await c.json('POST', `/api/workspaces/${c.workspaceId}/boards`, { name, ...extra });
  return c.json('GET', `/api/boards/${board.id}`);
}
