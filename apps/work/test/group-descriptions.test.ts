// Board group (category) descriptions (owner's request, 12 Nov 2026): plain text up to 5,000 characters on each group,
// edited with the same right that renames a group, read by everyone who sees the board, carried by duplication and
// templates, and reported in section K (Categories) of project reports.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { addMember, createBoard, signup, type Client } from './helpers';
import { GROUP_DESCRIPTION_MAX, groupDescriptionOneLine, normalizeGroupDescription, parseGroupDescription } from '../src/shared/group-description';
import { REPORT_SECTIONS, SECTION_LABELS } from '../src/shared/reports';

async function project(owner: Client, name = 'Clinic refurbishment') {
  const b = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/boards`, { name, templateId: 'project-plan', withSampleItems: true });
  return owner.json('GET', `/api/boards/${b.id}`);
}

const groupOf = (bundle: any, id: string) => bundle.groups.find((g: any) => g.id === id);

describe('description format', () => {
  it('reads paragraphs and bullets from plain text and never interprets markup', () => {
    const text = 'Site works before handover.\r\nKeep the lobby open.\n\n\n- Demolition\n* Electrical first fix\n  - Plastering\n\nAsk <b>Jo</b> & the PM.';
    expect(normalizeGroupDescription(`  ${text}  `)).toBe(text.replace(/\r\n/g, '\n'));
    expect(parseGroupDescription(text)).toEqual([
      { kind: 'paragraph', lines: ['Site works before handover.', 'Keep the lobby open.'] },
      { kind: 'list', items: ['Demolition', 'Electrical first fix', 'Plastering'] },
      { kind: 'paragraph', lines: ['Ask <b>Jo</b> & the PM.'] },
    ]);
    expect(groupDescriptionOneLine(text)).toBe('Site works before handover. Keep the lobby open. Demolition Electrical first fix Plastering Ask <b>Jo</b> & the PM.');
    expect(parseGroupDescription('   \n\n ')).toEqual([]);
    expect(normalizeGroupDescription('a\u0000b\u0007c\td')).toBe('abc\td');
  });
});

describe('group descriptions on the API', () => {
  it('creates, shows, edits and clears a description', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Fit-out');
    const g = await c.json('POST', `/api/boards/${b.board.id}/groups`, { name: 'Procurement', position: 'bottom', description: 'Orders over the counter.\n\n- Steel\n- Glass' });
    expect(g.description).toBe('Orders over the counter.\n\n- Steel\n- Glass');
    let bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(groupOf(bundle, g.id).description).toBe('Orders over the counter.\n\n- Steel\n- Glass');
    // Groups without one have an empty description.
    expect(bundle.groups.filter((x: any) => x.id !== g.id).every((x: any) => x.description === '')).toBe(true);

    const r = await c.json('PATCH', `/api/groups/${g.id}`, { description: '  Long-lead items only.\r\n- Lifts\r\n' });
    expect(r.description).toBe('Long-lead items only.\n- Lifts');
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(groupOf(bundle, g.id).description).toBe('Long-lead items only.\n- Lifts');

    await c.json('PATCH', `/api/groups/${g.id}`, { description: '' });
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(groupOf(bundle, g.id).description).toBe('');
    // The change is in the board's activity.
    const activity = await c.json('GET', `/api/boards/${b.board.id}/activity`);
    expect(activity.map((a: any) => a.action)).toEqual(expect.arrayContaining(['group_description_changed', 'group_description_cleared']));
  });

  it('accepts up to 5,000 characters once trimmed and refuses more', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const g = b.groups[0];
    expect((await c.req('PATCH', `/api/groups/${g.id}`, { description: 'x'.repeat(GROUP_DESCRIPTION_MAX + 1) })).status).toBe(400);
    expect((await c.req('POST', `/api/boards/${b.board.id}/groups`, { name: 'Too long', description: 'x'.repeat(GROUP_DESCRIPTION_MAX + 1) })).status).toBe(400);
    expect((await c.req('PATCH', `/api/groups/${g.id}`, { description: 42 })).status).toBe(400);
    await c.json('PATCH', `/api/groups/${g.id}`, { description: `\n  ${'y'.repeat(GROUP_DESCRIPTION_MAX)}  \n` });
    expect(groupOf(await c.json('GET', `/api/boards/${b.board.id}`), g.id).description).toHaveLength(GROUP_DESCRIPTION_MAX);
  });

  it('rename, reorder, collapse and describe keep every task in its group', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const g = await c.json('POST', `/api/boards/${b.board.id}/groups`, { name: 'Backlog', position: 'bottom' });
    const ids: string[] = [];
    for (const name of ['first task', 'second task', 'third task']) ids.push((await c.json('POST', `/api/boards/${b.board.id}/items`, { name, groupId: g.id })).id);
    const others = (await c.json('GET', `/api/boards/${b.board.id}`)).items.filter((i: any) => i.groupId !== g.id).map((i: any) => `${i.id}:${i.groupId}`).sort();

    await c.json('PATCH', `/api/groups/${g.id}`, { name: 'Icebox', description: 'Ideas we are not doing yet.' });
    await c.json('PATCH', `/api/groups/${g.id}`, { position: b.groups[0].position - 500 });
    await c.json('PATCH', `/api/groups/${g.id}`, { collapsed: true });
    await c.json('PATCH', `/api/groups/${g.id}`, { collapsed: false, color: '#0ea5e9' });

    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.groups[0]).toMatchObject({ id: g.id, name: 'Icebox', description: 'Ideas we are not doing yet.', color: '#0ea5e9', collapsed: false });
    expect(bundle.items.filter((i: any) => i.groupId === g.id).map((i: any) => i.id).sort()).toEqual([...ids].sort());
    expect(bundle.items.filter((i: any) => i.groupId !== g.id).map((i: any) => `${i.id}:${i.groupId}`).sort()).toEqual(others);
    // A rename alone keeps the description.
    await c.json('PATCH', `/api/groups/${g.id}`, { name: 'Parked' });
    expect(groupOf(await c.json('GET', `/api/boards/${b.board.id}`), g.id)).toMatchObject({ name: 'Parked', description: 'Ideas we are not doing yet.' });
  });

  it('uses the right that renames groups: viewers read but cannot edit; outsiders see nothing', async () => {
    const owner = await signup('Owner');
    const member = await signup('Member');
    const viewer = await signup('Viewer');
    const outsider = await signup('Outsider');
    await addMember(owner, member, 'member');
    await addMember(owner, viewer, 'viewer');
    const b = await createBoard(owner, 'Shared board');
    const g = b.groups[0];
    await owner.json('PATCH', `/api/groups/${g.id}`, { description: 'Written by the owner.' });

    // Viewers see the description and may neither describe nor rename the group.
    expect(groupOf(await viewer.json('GET', `/api/boards/${b.board.id}`), g.id).description).toBe('Written by the owner.');
    expect((await viewer.req('PATCH', `/api/groups/${g.id}`, { description: 'Changed by a viewer' })).status).toBe(403);
    expect((await viewer.req('PATCH', `/api/groups/${g.id}`, { name: 'Renamed by a viewer' })).status).toBe(403);
    expect((await outsider.req('PATCH', `/api/groups/${g.id}`, { description: 'x' })).status).toBe(404);
    expect((await outsider.req('GET', `/api/boards/${b.board.id}`)).status).toBe(404);

    // Members with edit access rename groups, so they describe them too.
    await member.json('PATCH', `/api/groups/${g.id}`, { description: 'Updated by a member.' });
    expect(groupOf(await owner.json('GET', `/api/boards/${b.board.id}`), g.id).description).toBe('Updated by a member.');

    // A member restricted to viewing this project cannot.
    await owner.json('PUT', `/api/boards/${b.board.id}/access/${member.userId}`, { level: 'view' });
    expect((await member.req('PATCH', `/api/groups/${g.id}`, { description: 'Again' })).status).toBe(403);
    expect(groupOf(await member.json('GET', `/api/boards/${b.board.id}`), g.id).description).toBe('Updated by a member.');
  });

  it('board duplication, group duplication and templates carry descriptions', async () => {
    const c = await signup();
    const b = await createBoard(c, 'Original');
    const g = b.groups[0];
    await c.json('PATCH', `/api/groups/${g.id}`, { description: 'Carry me along.\n- with a bullet' });

    const copy = await c.json('POST', `/api/boards/${b.board.id}/duplicate`, { name: 'Copy' });
    const copied = await c.json('GET', `/api/boards/${copy.id}`);
    expect(copied.groups.find((x: any) => x.name === g.name).description).toBe('Carry me along.\n- with a bullet');

    const dup = await c.json('POST', `/api/groups/${g.id}/duplicate`, {});
    expect(groupOf(await c.json('GET', `/api/boards/${b.board.id}`), dup.id).description).toBe('Carry me along.\n- with a bullet');

    const tpl = await c.json('POST', `/api/boards/${b.board.id}/save-as-template`, { name: 'Described template' });
    const tplGroups = await env.DB.prepare('SELECT name, description FROM groups WHERE board_id = ?').bind(tpl.id).all<{ name: string; description: string }>();
    expect(tplGroups.results.find((x) => x.name === g.name)?.description).toBe('Carry me along.\n- with a bullet');
    const fromTpl = await createBoard(c, 'From template', { templateId: tpl.id });
    expect(fromTpl.groups.find((x: any) => x.name === g.name).description).toBe('Carry me along.\n- with a bullet');
  });
});

describe('section K, Categories, in project reports', () => {
  it('follows J (the project controls sections L to N come after it) and is offered by default', () => {
    expect(REPORT_SECTIONS.indexOf('categories')).toBe(REPORT_SECTIONS.indexOf('timeline') + 1);
    expect(REPORT_SECTIONS.slice(REPORT_SECTIONS.indexOf('categories') + 1)).toEqual(['schedule', 'baseline', 'evm']);
    expect(SECTION_LABELS.categories).toBe('K. Categories');
  });

  it('lists every group with its description and task figures in the preview and the saved snapshot', async () => {
    const owner = await signup('Pat Manager');
    const a = await project(owner);
    const status = a.columns.find((c: any) => c.type === 'status');
    const g = a.groups[0];
    const description = 'Everything before construction starts.\n\n- Permits\n- Surveys\n\n<script>alert(1)</script>';
    await owner.json('PATCH', `/api/groups/${g.id}`, { description });
    const inGroup = a.items.filter((i: any) => !i.parentItemId && i.groupId === g.id);

    const { report, html } = await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', timezone: 'UTC' });
    expect(report.meta.sections).toContain('categories');
    const row = report.categories.rows.find((r: any) => r.groupId === g.id);
    expect(row).toMatchObject({ name: g.name, description, total: inGroup.length });
    expect(row.completed + row.outstanding).toBe(row.total);
    expect(row.completed).toBe(inGroup.filter((i: any) => i.values[status.id] === 'done').length);
    // The groups' totals add up to the overview's.
    expect(report.categories.rows.reduce((n: number, r: any) => n + r.total, 0)).toBe(report.overview.total);
    expect(report.categories.rows.reduce((n: number, r: any) => n + r.completed, 0)).toBe(report.overview.completed);
    // Rendered as text: the HTML escapes it and shows the bullets as a list.
    expect(html).toContain('K. Categories');
    expect(html).toContain('<li>Permits</li>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');

    // Finalised: the snapshot keeps the description, and later edits do not change it.
    const saved = await owner.json('POST', `/api/boards/${a.board.id}/reports`, { type: 'inception', timezone: 'UTC' });
    await owner.json('PATCH', `/api/groups/${g.id}`, { description: 'Changed after the report.' });
    const rec = await env.DB.prepare('SELECT snapshot_key, files_json, sections_json FROM reports WHERE id = ?').bind(saved.id).first<{ snapshot_key: string; files_json: string; sections_json: string }>();
    expect(JSON.parse(rec!.sections_json)).toContain('categories');
    const snap = JSON.parse(await (await env.FILES.get(rec!.snapshot_key))!.text());
    expect(snap.categories.rows.find((r: any) => r.groupId === g.id).description).toBe(description);
    const files = JSON.parse(rec!.files_json);
    const savedHtml = await (await env.FILES.get(files.html.key))!.text();
    expect(savedHtml).toContain('Everything before construction starts.');
    expect(savedHtml).not.toContain('Changed after the report.');
    const csv = await (await env.FILES.get(files.csv.key))!.text();
    expect(csv.split('\r\n')[0]).toMatch(/,Category description$/);
    const pdf = await owner.req('GET', `/api/reports/${saved.id}/download/pdf`);
    expect(pdf.status).toBe(200);
    const xlsx = await owner.req('GET', `/api/reports/${saved.id}/download/xlsx`);
    expect(xlsx.status).toBe(200);
  });

  it('adds financial totals per category only when the report includes finances', async () => {
    const owner = await signup('Fin Owner');
    const a = await project(owner, 'Budgeted project');
    const budget = a.columns.find((c: any) => c.type === 'currency');
    const g = a.groups[0];
    const task = a.items.find((i: any) => !i.parentItemId && i.groupId === g.id);
    await owner.json('PUT', `/api/workspaces/${owner.workspaceId}/finance`, { defaultCurrency: 'AUD' });
    await owner.json('PATCH', `/api/items/${task.id}`, { values: { [budget.id]: 1250.5 } });

    const withFinance = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', timezone: 'UTC', sections: ['overview', 'finance', 'categories'] })).report;
    expect(withFinance.categories.financeIncluded).toBe(true);
    const fin = withFinance.categories.rows.find((r: any) => r.groupId === g.id).finance.find((f: any) => f.columnId === budget.id);
    expect(fin).toMatchObject({ currency: 'AUD', amount: '1250.50', count: 1 });
    expect(fin.display).toContain('AUD');

    // Without the financial summary, no amounts appear in the categories either.
    const without = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', timezone: 'UTC', sections: ['overview', 'categories'] })).report;
    expect(without.categories.financeIncluded).toBe(false);
    expect(without.categories.rows.every((r: any) => r.finance === null)).toBe(true);
    const noFinance = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', timezone: 'UTC', includeFinance: false })).report;
    expect(noFinance.categories.rows.every((r: any) => r.finance === null)).toBe(true);
  });

  it('is left out when not chosen', async () => {
    const owner = await signup();
    const a = await project(owner);
    const r = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'financial', timezone: 'UTC' })).report;
    expect(r.meta.sections).not.toContain('categories');
    expect(r.categories).toBeUndefined();
  });
});
