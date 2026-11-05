import { describe, expect, it } from 'vitest';
import { sanitizeDoc, docText } from '../src/worker/routes/documents';
import { addMember, createBoard, signup } from './helpers';

const para = (text: string, marks?: any[]) => ({ type: 'paragraph', content: [{ type: 'text', text, ...(marks ? { marks } : {}) }] });

describe('document sanitiser (XSS)', () => {
  it('keeps allowed rich text and strips dangerous content', () => {
    const input = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 9, onclick: 'x' }, content: [{ type: 'text', text: 'Title' }] },
        para('link', [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }]),
        para('ok link', [{ type: 'link', attrs: { href: 'https://example.com' } }, { type: 'bold' }, { type: 'evilMark' }]),
        { type: 'script', content: [{ type: 'text', text: 'alert(1)' }] },
        { type: 'image', attrs: { src: 'javascript:alert(1)' } },
        { type: 'image', attrs: { src: 'http://insecure.example/x.png' } },
        { type: 'image', attrs: { src: '/api/files/abc123', alt: 'ok', onerror: 'x' } },
        { type: 'taskList', content: [{ type: 'taskItem', attrs: { checked: 'yes' }, content: [para('todo')] }] },
        { type: 'table', content: [{ type: 'tableRow', content: [{ type: 'tableCell', attrs: { colspan: 999 }, content: [para('cell')] }] }] },
        { type: 'paragraph', content: [{ type: 'text', text: '<img src=x onerror=alert(1)>' }] },
      ],
    };
    const out = sanitizeDoc(input);
    const json = JSON.stringify(out);
    expect(json).not.toContain('javascript:');
    expect(json).not.toContain('onclick');
    expect(json).not.toContain('"onerror"');
    expect(json).not.toContain('script');
    expect(json).not.toContain('evilMark');
    expect(json).not.toContain('insecure.example');
    expect(out.content[0].attrs.level).toBe(6);
    expect(out.content[1].content[0].marks).toBeUndefined();
    expect(out.content[2].content[0].marks[0]).toEqual({ type: 'link', attrs: { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer nofollow' } });
    const images = out.content.filter((n: any) => n.type === 'image');
    expect(images).toEqual([{ type: 'image', attrs: { src: '/api/files/abc123', alt: 'ok' } }]);
    expect(out.content.find((n: any) => n.type === 'taskList').content[0].attrs.checked).toBe(true);
    expect(out.content.find((n: any) => n.type === 'table').content[0].content[0].attrs.colspan).toBe(20);
    // Text containing markup is preserved as inert text (rendered as text by the editor).
    expect(docText(out)).toContain('<img src=x onerror=alert(1)>');
    expect(sanitizeDoc({ type: 'iframe' })).toBeNull();
  });
});

describe('documents', () => {
  it('create, autosave with versions, conflict detection, history and restore', async () => {
    const c = await signup();
    const d = await c.json('POST', `/api/workspaces/${c.workspaceId}/documents`, { title: 'Spec', content: { type: 'doc', content: [para('v1')] } });
    expect(d.version).toBe(1);
    const s1 = await c.json('PATCH', `/api/documents/${d.id}`, { content: { type: 'doc', content: [para('v2')] }, baseVersion: 1 });
    expect(s1.version).toBe(2);
    // Stale save is rejected with 409 and the latest content.
    const stale = await c.req('PATCH', `/api/documents/${d.id}`, { content: { type: 'doc', content: [para('stale')] }, baseVersion: 1 });
    expect(stale.status).toBe(409);
    expect(((await stale.json()) as any).latest.version).toBe(2);
    await c.json('PATCH', `/api/documents/${d.id}`, { title: 'Spec v3', content: { type: 'doc', content: [para('v3')] }, baseVersion: 2, snapshot: true });
    const got = await c.json('GET', `/api/documents/${d.id}`);
    expect(got.title).toBe('Spec v3');
    expect(docText(got.content)).toBe('v3');
    const versions = await c.json('GET', `/api/documents/${d.id}/versions`);
    expect(versions.length).toBeGreaterThanOrEqual(2);
    const first = versions.find((v: any) => v.version === 1);
    const v1 = await c.json('GET', `/api/documents/${d.id}/versions/${first.id}`);
    expect(docText(v1.content)).toBe('v1');
    const r = await c.json('POST', `/api/documents/${d.id}/versions/${first.id}/restore`, {});
    expect(r.version).toBe(4);
    expect(docText((await c.json('GET', `/api/documents/${d.id}`)).content)).toBe('v1');
    // Saved content is sanitised server-side.
    await c.json('PATCH', `/api/documents/${d.id}`, { content: { type: 'doc', content: [para('x', [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }])] } });
    expect(JSON.stringify((await c.json('GET', `/api/documents/${d.id}`)).content)).not.toContain('javascript');
  });

  it('links to boards/items, archive, duplicate, delete', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Has doc' });
    const d = await c.json('POST', `/api/workspaces/${c.workspaceId}/documents`, { title: 'Item notes', itemId: it.id });
    expect(d.boardId).toBe(b.board.id);
    expect(d.itemId).toBe(it.id);
    const byItem = await c.json('GET', `/api/workspaces/${c.workspaceId}/documents?itemId=${it.id}`);
    expect(byItem.map((x: any) => x.id)).toEqual([d.id]);
    const dup = await c.json('POST', `/api/documents/${d.id}/duplicate`, {});
    await c.json('POST', `/api/documents/${d.id}/archive`, { archived: true });
    expect((await c.json('GET', `/api/workspaces/${c.workspaceId}/documents`)).map((x: any) => x.id)).toEqual([dup.id]);
    expect((await c.req('PATCH', `/api/documents/${d.id}`, { title: 'x' })).status).toBe(409);
    await c.json('DELETE', `/api/documents/${d.id}`, {});
    expect((await c.req('GET', `/api/documents/${d.id}`)).status).toBe(404);
  });

  it('sharing: private docs, members with roles', async () => {
    const owner = await signup();
    const m = await signup();
    await addMember(owner, m);
    const pub = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/documents`, { title: 'Public' });
    const priv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/documents`, { title: 'Private', visibility: 'private' });
    expect((await m.json('GET', `/api/documents/${pub.id}`)).access).toBe('edit');
    expect((await m.req('GET', `/api/documents/${priv.id}`)).status).toBe(404);
    expect((await m.json('GET', `/api/workspaces/${owner.workspaceId}/documents`)).map((x: any) => x.id)).toEqual([pub.id]);
    await owner.json('PUT', `/api/documents/${priv.id}/members`, { userId: m.userId, role: 'viewer' });
    expect((await m.json('GET', `/api/documents/${priv.id}`)).access).toBe('view');
    expect((await m.req('PATCH', `/api/documents/${priv.id}`, { title: 'x' })).status).toBe(403);
    expect((await m.req('PATCH', `/api/documents/${pub.id}`, { visibility: 'private' })).status).toBe(403);
    await owner.json('PUT', `/api/documents/${priv.id}/members`, { userId: m.userId, role: 'editor' });
    expect((await m.req('PATCH', `/api/documents/${priv.id}`, { title: 'Edited by member' })).status).toBe(200);
    await owner.json('DELETE', `/api/documents/${priv.id}/members/${m.userId}`, {});
    expect((await m.req('GET', `/api/documents/${priv.id}`)).status).toBe(404);
  });

  it('comments with mentions, replies and resolve', async () => {
    const owner = await signup('Owner');
    const m = await signup('M');
    await addMember(owner, m);
    const d = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/documents`, { title: 'Discuss' });
    const c1 = await owner.json('POST', `/api/documents/${d.id}/comments`, { body: `Thoughts @[M](user:${m.userId})?` });
    await m.json('POST', `/api/documents/${d.id}/comments`, { body: 'Looks good', parentId: c1.id });
    const n = await m.json('GET', `/api/notifications?workspaceId=${owner.workspaceId}`);
    expect(n.notifications.some((x: any) => x.type === 'mention' && x.link === `/w/${owner.workspaceId}/docs/${d.id}`)).toBe(true);
    const on = await owner.json('GET', `/api/notifications?workspaceId=${owner.workspaceId}`);
    expect(on.notifications.some((x: any) => x.type === 'reply')).toBe(true);
    await owner.json('PATCH', `/api/document-comments/${c1.id}`, { resolved: true });
    const list = await m.json('GET', `/api/documents/${d.id}/comments`);
    expect(list).toHaveLength(2);
    expect(list.find((x: any) => x.id === c1.id).resolvedAt).toBeGreaterThan(0);
    expect((await m.req('PATCH', `/api/document-comments/${c1.id}`, { body: 'hijack' })).status).toBe(403);
    await owner.json('DELETE', `/api/document-comments/${c1.id}`, {});
    expect(await m.json('GET', `/api/documents/${d.id}/comments`)).toHaveLength(0);
  });

  it('document attachments', async () => {
    const c = await signup();
    const d = await c.json('POST', `/api/workspaces/${c.workspaceId}/documents`, { title: 'With image' });
    const fd = new FormData();
    fd.set('file', new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0])], 'img.png'));
    fd.set('scope', 'document');
    fd.set('documentId', d.id);
    const r = await c.req('POST', '/api/files', fd);
    expect(r.status).toBe(201);
    const att = (await r.json()) as any;
    const got = await c.json('GET', `/api/documents/${d.id}`);
    expect(got.attachments.map((a: any) => a.id)).toEqual([att.id]);
    expect((await c.req('GET', att.url)).status).toBe(200);
    const stranger = await signup();
    expect((await stranger.req('GET', att.url)).status).toBe(404);
  });
});
