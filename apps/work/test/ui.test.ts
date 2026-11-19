// The new UI (owner's UI brief of 19 Nov 2026; docs/ui/README.md): the flag new_ui_enabled reaches the website (public,
// global value only) and each person (everyone, or a company they belong to), with their density from their account.
import { SELF, env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail } from './helpers';
import { abnValid } from '../src/worker/company/verify';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

const flag = (scope: 'global' | 'company', scopeId = '') =>
  env.DB.prepare("INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('new_ui_enabled', ?, ?, 'on', 'test', 'test', 1)").bind(scope, scopeId).run();
const clear = () => env.DB.prepare("DELETE FROM feature_flags WHERE key = 'new_ui_enabled'").run();

describe('the new UI flag', () => {
  it('is off by default, on for everyone when switched on, and tells the website only the global value', async () => {
    await clear();
    const pub = async () => (await (await SELF.fetch('http://example.com/api/ui/public')).json()) as any;
    expect(await pub()).toEqual({ newUi: false });
    const me = await signup('Una Ui');
    expect((await me.json('GET', '/api/auth/me')).ui).toEqual({ newUi: false, density: 'comfortable' });
    await flag('global');
    expect(await pub()).toEqual({ newUi: true });
    expect((await me.json('GET', '/api/auth/me')).ui.newUi).toBe(true);
    await clear();
  });

  it('is on for the people of a company it is switched on for, and keeps each person’s density on their account', async () => {
    await clear();
    const owner = await signup('Cora Company');
    const res = await owner.req('POST', '/api/company/companies', {
      kind: 'business', name: 'Ui Works', legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432',
      addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '',
    });
    expect(res.status).toBe(201);
    const co = ((await res.json()) as any).company.id as string;
    const other = await signup('Otto Other');
    await flag('company', co);
    expect((await owner.json('GET', '/api/auth/me')).ui.newUi).toBe(true);
    expect((await other.json('GET', '/api/auth/me')).ui.newUi).toBe(false);
    // The website hears only the global value.
    expect(((await (await SELF.fetch('http://example.com/api/ui/public')).json()) as any).newUi).toBe(false);
    await owner.json('PATCH', '/api/me', { preferences: { density: 'compact' } });
    expect((await owner.json('GET', '/api/auth/me')).ui.density).toBe('compact');
    await owner.json('PATCH', '/api/me', { preferences: { density: 'anything else' } });
    expect((await owner.json('GET', '/api/auth/me')).ui.density).toBe('comfortable');
    await clear();
  });
});
