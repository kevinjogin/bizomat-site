import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup } from './helpers';

describe('folders', () => {
  it('creates coloured, nested folders and files documents into them', async () => {
    const a = await signup('Folder Owner');
    const root = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Clients', color: '#F97316' });
    expect(root.color).toBe('#F97316');
    const child = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Acme', color: '#0ea5e9', parentId: root.id });
    expect(child.parentId).toBe(root.id);

    const doc = await a.json('POST', `/api/workspaces/${a.workspaceId}/documents`, { title: 'Proposal', folderId: child.id });
    expect(doc.folderId).toBe(child.id);
    const list = await a.json('GET', `/api/workspaces/${a.workspaceId}/documents`);
    expect(list.find((d: any) => d.id === doc.id).folderId).toBe(child.id);

    // Move to root folder, then out of folders entirely.
    await a.json('PATCH', `/api/documents/${doc.id}`, { folderId: root.id });
    expect((await a.json('GET', `/api/documents/${doc.id}`)).folderId).toBe(root.id);
    await a.json('PATCH', `/api/documents/${doc.id}`, { folderId: null });
    expect((await a.json('GET', `/api/documents/${doc.id}`)).folderId).toBeNull();

    // Recolour and rename.
    const recoloured = await a.json('PATCH', `/api/folders/${child.id}`, { color: '#00a36c', name: 'Acme Corp' });
    expect(recoloured.color).toBe('#00a36c');
    expect(recoloured.name).toBe('Acme Corp');

    const folders = await a.json('GET', `/api/workspaces/${a.workspaceId}/folders?scope=documents`);
    expect(folders.map((f: any) => f.id).sort()).toEqual([root.id, child.id].sort());
  });

  it('rejects invalid colours, cycles and cross-scope filing', async () => {
    const a = await signup();
    const f1 = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'One' });
    const f2 = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Two', parentId: f1.id });
    expect((await a.req('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Bad', color: 'red' })).status).toBe(400);
    expect((await a.req('PATCH', `/api/folders/${f1.id}`, { parentId: f2.id })).status).toBe(400);
    expect((await a.req('PATCH', `/api/folders/${f1.id}`, { parentId: f1.id })).status).toBe(400);
    const board = await createBoard(a);
    // A documents folder cannot hold a board.
    expect((await a.req('PATCH', `/api/boards/${board.board.id}`, { folderId: f1.id })).status).toBe(400);
  });

  it('files boards and dashboards', async () => {
    const a = await signup();
    const bf = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'boards', name: 'Projects', color: '#a855f7' });
    const board = await createBoard(a);
    await a.json('PATCH', `/api/boards/${board.board.id}`, { folderId: bf.id });
    const boards = await a.json('GET', `/api/workspaces/${a.workspaceId}/boards`);
    expect(boards.find((b: any) => b.id === board.board.id).folderId).toBe(bf.id);

    const df = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'dashboards', name: 'Exec' });
    const dash = await a.json('POST', `/api/workspaces/${a.workspaceId}/dashboards`, { name: 'Overview', folderId: df.id, withDefaultWidgets: false });
    expect(dash.folderId).toBe(df.id);
  });

  it('deleting a folder keeps its content and moves it up a level', async () => {
    const a = await signup();
    const parent = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Parent' });
    const mid = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Mid', parentId: parent.id });
    const leaf = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Leaf', parentId: mid.id });
    const doc = await a.json('POST', `/api/workspaces/${a.workspaceId}/documents`, { title: 'Keep me', folderId: mid.id });
    await a.json('DELETE', `/api/folders/${mid.id}`);
    expect((await a.json('GET', `/api/documents/${doc.id}`)).folderId).toBe(parent.id);
    const folders = await a.json('GET', `/api/workspaces/${a.workspaceId}/folders?scope=documents`);
    expect(folders.find((f: any) => f.id === leaf.id).parentId).toBe(parent.id);
    expect(folders.find((f: any) => f.id === mid.id)).toBeUndefined();
  });

  it('enforces workspace isolation and roles', async () => {
    const a = await signup();
    const b = await signup();
    const f = await a.json('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'Secret' });
    // Other workspace: cannot list, edit, delete, or file into it.
    expect((await b.req('GET', `/api/workspaces/${a.workspaceId}/folders`)).status).toBe(404);
    expect((await b.req('PATCH', `/api/folders/${f.id}`, { color: '#000000' })).status).toBe(404);
    expect((await b.req('DELETE', `/api/folders/${f.id}`)).status).toBe(404);
    expect((await b.req('POST', `/api/workspaces/${b.workspaceId}/documents`, { title: 'x', folderId: f.id })).status).toBe(400);
    // Viewer can see but not create or change folders.
    const v = await signup('Viewer');
    await addMember(a, v, 'viewer');
    const vClient = { ...v, workspaceId: a.workspaceId };
    expect((await vClient.req('GET', `/api/workspaces/${a.workspaceId}/folders`)).status).toBe(200);
    expect((await vClient.req('POST', `/api/workspaces/${a.workspaceId}/folders`, { scope: 'documents', name: 'No' })).status).toBe(403);
    expect((await vClient.req('PATCH', `/api/folders/${f.id}`, { color: '#000000' })).status).toBe(403);
    // A member who did not create it cannot delete it; the owner can.
    const m = await signup('Member');
    await addMember(a, m, 'member');
    expect((await m.req('DELETE', `/api/folders/${f.id}`)).status).toBe(403);
    expect((await a.req('DELETE', `/api/folders/${f.id}`)).status).toBe(200);
  });
});
