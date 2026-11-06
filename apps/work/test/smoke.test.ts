import { describe, expect, it } from 'vitest';
import { raw, signup } from './helpers';

describe('smoke', () => {
  it('health endpoint reports database status', async () => {
    const res = await raw('GET', '/api/health');
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.status).toBe('ok');
    expect(body.db).toBe('ok');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('Content-Security-Policy')).toContain("frame-ancestors 'none'");
  });

  it('signup creates a user, session and default workspace', async () => {
    const c = await signup('Ada Lovelace');
    expect(c.workspaceId).toBeTruthy();
    const me = await c.json('GET', '/api/auth/me');
    expect(me.user.name).toBe('Ada Lovelace');
    expect(me.workspaces).toHaveLength(1);
    expect(me.workspaces[0].role).toBe('owner');
  });
});
