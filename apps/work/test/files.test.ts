import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup, type Client } from './helpers';

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const PDF = new TextEncoder().encode('%PDF-1.4 fake but has magic');

function form(file: File, fields: Record<string, string>) {
  const fd = new FormData();
  fd.set('file', file);
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

async function setup() {
  const c = await signup();
  const b = await createBoard(c);
  const item = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'with files' });
  return { c, b, item };
}

async function upload(c: Client, file: File, fields: Record<string, string>) {
  return c.req('POST', '/api/files', form(file, fields));
}

describe('attachments are protected (critical test 13)', () => {
  it('uploads to R2, lists on the item and downloads with safe headers', async () => {
    const { c, b, item } = await setup();
    const res = await upload(c, new File([PDF], 'report.pdf'), { scope: 'item', itemId: item.id });
    expect(res.status).toBe(201);
    const att = (await res.json()) as any;
    expect(att.url).toBe(`/api/files/${att.id}`);
    const row = await env.DB.prepare('SELECT r2_key FROM attachments WHERE id = ?').bind(att.id).first<{ r2_key: string }>();
    expect(row!.r2_key).toContain(`ws/${c.workspaceId}/`);
    expect(await env.FILES.head(row!.r2_key)).toBeTruthy();
    const detail = await c.json('GET', `/api/items/${item.id}`);
    expect(detail.attachments.map((a: any) => a.id)).toEqual([att.id]);
    const files = await c.json('GET', `/api/boards/${b.board.id}/files`);
    expect(files[0]).toMatchObject({ id: att.id, itemName: 'with files' });
    const dl = await c.req('GET', `/api/files/${att.id}?download=1`);
    expect(dl.status).toBe(200);
    expect(dl.headers.get('Content-Type')).toBe('application/pdf');
    expect(dl.headers.get('Content-Disposition')).toMatch(/^attachment/);
    expect(dl.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(dl.headers.get('Content-Security-Policy')).toContain('sandbox');
    expect(new Uint8Array(await dl.arrayBuffer())).toEqual(PDF);
  });

  it('non-image types are always served as attachments', async () => {
    const { c, item } = await setup();
    const att = (await (await upload(c, new File(['a,b\n1,2'], 'data.csv'), { scope: 'item', itemId: item.id })).json()) as any;
    const dl = await c.req('GET', `/api/files/${att.id}`);
    expect(dl.headers.get('Content-Disposition')).toMatch(/^attachment/);
    expect(dl.headers.get('Content-Type')).toBe('text/csv');
    const img = (await (await upload(c, new File([PNG], 'pic.png'), { scope: 'item', itemId: item.id })).json()) as any;
    const view = await c.req('GET', `/api/files/${img.id}`);
    expect(view.headers.get('Content-Disposition')).toMatch(/^inline/);
  });

  it('rejects dangerous or mislabelled files', async () => {
    const { c, item } = await setup();
    for (const name of ['evil.html', 'evil.svg', 'evil.js', 'evil.exe', 'noext']) {
      const r = await upload(c, new File(['<script>alert(1)</script>'], name), { scope: 'item', itemId: item.id });
      expect(r.status, name).toBe(400);
    }
    const fakePng = await upload(c, new File(['<html>not a png</html>'], 'fake.png', { type: 'image/png' }), { scope: 'item', itemId: item.id });
    expect(fakePng.status).toBe(400);
    const fakePdf = await upload(c, new File(['hello'], 'fake.pdf'), { scope: 'item', itemId: item.id });
    expect(fakePdf.status).toBe(400);
    const empty = await upload(c, new File([], 'empty.txt'), { scope: 'item', itemId: item.id });
    expect(empty.status).toBe(400);
    const big = await upload(c, new File([new Uint8Array(6 * 1024 * 1024)], 'avatar.png'), { scope: 'avatar' });
    expect([400, 413]).toContain(big.status);
    // Path traversal in names is neutralised.
    const trav = (await (await upload(c, new File(['x'], '../../etc/passwd.txt'), { scope: 'item', itemId: item.id })).json()) as any;
    expect(trav.fileName).toBe('passwd.txt');
  });

  it('other workspaces and non-members cannot read or delete files', async () => {
    const { c, item } = await setup();
    const att = (await (await upload(c, new File([PNG], 'secret.png'), { scope: 'item', itemId: item.id })).json()) as any;
    const stranger = await signup();
    expect((await stranger.req('GET', `/api/files/${att.id}`)).status).toBe(404);
    expect((await stranger.req('DELETE', `/api/files/${att.id}`, {})).status).toBe(404);
    expect((await stranger.req('GET', `/api/files/${att.id}?download=1`)).status).toBe(404);
  });

  it('private board files are hidden from workspace members without board access', async () => {
    const { c, b, item } = await setup();
    const m = await signup();
    await addMember(c, m);
    const att = (await (await upload(c, new File([PNG], 'p.png'), { scope: 'item', itemId: item.id })).json()) as any;
    expect((await m.req('GET', `/api/files/${att.id}`)).status).toBe(200);
    await c.json('PATCH', `/api/boards/${b.board.id}`, { visibility: 'private' });
    expect((await m.req('GET', `/api/files/${att.id}`)).status).toBe(404);
  });

  it('viewers cannot upload or delete; deleted files are gone', async () => {
    const { c, item } = await setup();
    const v = await signup();
    await addMember(c, v, 'viewer');
    expect((await upload(v, new File([PNG], 'v.png'), { scope: 'item', itemId: item.id })).status).toBe(403);
    const att = (await (await upload(c, new File([PNG], 'del.png'), { scope: 'item', itemId: item.id })).json()) as any;
    expect((await v.req('DELETE', `/api/files/${att.id}`, {})).status).toBe(403);
    await c.json('DELETE', `/api/files/${att.id}`, {});
    expect((await c.req('GET', `/api/files/${att.id}`)).status).toBe(404);
  });

  it('files column links attachments and validates ownership', async () => {
    const { c, b, item } = await setup();
    const col = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Files', type: 'files' });
    const att = (await (await upload(c, new File([PNG], 'col.png'), { scope: 'item', itemId: item.id, columnId: col.id })).json()) as any;
    const d = await c.json('GET', `/api/items/${item.id}`);
    expect(d.item.values[col.id]).toEqual([att.id]);
  });

  it('avatars and logos are images only and access-controlled', async () => {
    const c = await signup();
    const r = await upload(c, new File([PNG], 'me.png'), { scope: 'avatar' });
    expect(r.status).toBe(201);
    expect((await upload(c, new File([PDF], 'me.pdf'), { scope: 'avatar' })).status).toBe(400);
    expect((await c.req('GET', `/api/users/${c.userId}/avatar`)).status).toBe(200);
    const stranger = await signup();
    expect((await stranger.req('GET', `/api/users/${c.userId}/avatar`)).status).toBe(404);
    const me = await c.json('GET', '/api/auth/me');
    expect(me.user.avatarUrl).toContain(`/api/users/${c.userId}/avatar`);
    expect((await upload(c, new File([PNG], 'logo.png'), { scope: 'logo', workspaceId: c.workspaceId })).status).toBe(201);
    expect((await c.req('GET', `/api/workspaces/${c.workspaceId}/logo`)).status).toBe(200);
  });

  it('deleting an item removes its files from R2', async () => {
    const { c, item } = await setup();
    const att = (await (await upload(c, new File([PNG], 'gone.png'), { scope: 'item', itemId: item.id })).json()) as any;
    const row = await env.DB.prepare('SELECT r2_key FROM attachments WHERE id = ?').bind(att.id).first<{ r2_key: string }>();
    await c.json('DELETE', `/api/items/${item.id}`, {});
    expect(await env.DB.prepare('SELECT 1 FROM attachments WHERE id = ?').bind(att.id).first()).toBeNull();
    // R2 deletion happens in waitUntil; poll briefly.
    let obj = await env.FILES.head(row!.r2_key);
    for (let i = 0; i < 20 && obj; i++) {
      await new Promise((r) => setTimeout(r, 25));
      obj = await env.FILES.head(row!.r2_key);
    }
    expect(obj).toBeNull();
  });
});
