import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { raw, signup } from './helpers';
import { DEFAULT_COLOR, PRODUCT } from '../src/shared/brand';
import { BRAND_COLORS } from '../src/client/lib/bizomat-brand';

describe('BIZOMAT branding', () => {
  it('serves the product as BIZOMAT Project Management', async () => {
    const cfg = (await (await raw('GET', '/api/auth/config')).json()) as { appName: string };
    expect(cfg.appName).toBe('BIZOMAT Project Management');
    expect(PRODUCT.full).toBe(`${PRODUCT.platform} ${PRODUCT.name}`);
  });

  it('gives new workspaces and folders BIZOMAT teal and keeps the colours owners chose', async () => {
    // The shared default must stay equal to the generated brand colour.
    expect(DEFAULT_COLOR).toBe(BRAND_COLORS.teal);

    const c = await signup('Teal Owner');
    const me = await c.json('GET', '/api/auth/me');
    expect(me.workspaces[0].color).toBe(DEFAULT_COLOR); // made at sign-up

    const fresh = await c.json('POST', '/api/workspaces', { name: 'Fresh' });
    expect(fresh.color).toBe(DEFAULT_COLOR);

    const chosen = await c.json('POST', '/api/workspaces', { name: 'Chosen', color: '#F97316' });
    await c.json('PATCH', `/api/workspaces/${chosen.id}`, { name: 'Chosen and renamed' });
    expect((await c.json('GET', `/api/workspaces/${chosen.id}`)).color).toBe('#F97316');

    const folder = await c.json('POST', `/api/workspaces/${c.workspaceId}/folders`, { scope: 'documents', name: 'Default colour' });
    expect(folder.color).toBe(DEFAULT_COLOR);
  });

  it('has no migration that rewrites existing workspace colours (user data), apart from the historical 0002', () => {
    expect(env.TEST_MIGRATIONS.length).toBeGreaterThan(0);
    for (const m of env.TEST_MIGRATIONS) {
      if (m.name.startsWith('0002_')) continue;
      expect(m.queries.join('\n'), m.name).not.toMatch(/UPDATE\s+workspaces\s+SET\s+color/i);
    }
  });
});
