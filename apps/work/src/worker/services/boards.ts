// Board creation, templating and cloning.

import { columnTypes, defaultPriorityLabels, defaultStatusLabels, PALETTE, sanitizeColumnSettings } from '../../shared/columns';
import { addDays, todayIn } from '../../shared/dates';
import { newId, now, parseJson } from '../lib/util';
import { buildSearchText } from './item-ops';
import { columnDTO, type ColumnRow } from './mappers';

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  groups: { key: string; name: string; color?: string }[];
  columns: { key: string; title: string; type: string; settings?: Record<string, unknown>; width?: number }[];
  items?: { group: string; name: string; values?: Record<string, unknown>; subitems?: string[] }[];
  views?: { name: string; type: string; settings?: Record<string, unknown> }[];
  settings?: Record<string, unknown>;
}

const today = () => todayIn('UTC');

export const BLANK_TEMPLATE: TemplateDef = {
  id: 'blank',
  name: 'Blank board',
  description: 'Start from scratch with the essentials.',
  category: 'Basics',
  icon: 'grid',
  groups: [
    { key: 'g1', name: 'To do', color: PALETTE[3] },
    { key: 'g2', name: 'In progress', color: PALETTE[1] },
    { key: 'g3', name: 'Completed', color: PALETTE[0] },
  ],
  columns: [
    { key: 'owner', title: 'Owner', type: 'person', width: 120 },
    { key: 'status', title: 'Status', type: 'status', width: 150 },
    { key: 'due', title: 'Due date', type: 'date', width: 130 },
    { key: 'priority', title: 'Priority', type: 'priority', width: 130 },
  ],
  views: [
    { name: 'Main table', type: 'table' },
    { name: 'Kanban', type: 'kanban', settings: { kanbanColumnId: '@status' } },
  ],
};

export function builtinTemplates(): TemplateDef[] {
  const d = today();
  return [
    BLANK_TEMPLATE,
    {
      id: 'project-plan',
      name: 'Project plan',
      description: 'Phases, owners, timelines, dependencies and milestones.',
      category: 'Project management',
      icon: 'timeline',
      groups: [
        { key: 'plan', name: 'Planning', color: PALETTE[4] },
        { key: 'exec', name: 'Execution', color: PALETTE[1] },
        { key: 'close', name: 'Closing', color: PALETTE[0] },
      ],
      columns: [
        { key: 'owner', title: 'Owner', type: 'person' },
        { key: 'status', title: 'Status', type: 'status' },
        { key: 'timeline', title: 'Timeline', type: 'timeline', width: 200 },
        { key: 'priority', title: 'Priority', type: 'priority' },
        { key: 'deps', title: 'Depends on', type: 'dependency' },
        { key: 'progress', title: 'Progress', type: 'progress', settings: { mode: 'subitems' } },
        { key: 'effort', title: 'Effort (days)', type: 'number' },
        { key: 'budget', title: 'Budget', type: 'currency', settings: { currencyMode: 'inherit', decimals: 0, financeRole: 'approved_budget' } },
      ],
      items: [
        { group: 'plan', name: 'Define scope and goals', values: { status: 'done', timeline: { start: d, end: addDays(d, 3) }, priority: 'high', effort: 3 }, subitems: ['Stakeholder interviews', 'Write scope statement'] },
        { group: 'plan', name: 'Kick-off meeting', values: { status: 'done', timeline: { start: addDays(d, 4), end: addDays(d, 4) }, priority: 'medium', effort: 1 } },
        { group: 'exec', name: 'Build first release', values: { status: 'working', timeline: { start: addDays(d, 5), end: addDays(d, 20) }, priority: 'critical', effort: 15, budget: 12000 }, subitems: ['Design', 'Implementation', 'QA'] },
        { group: 'close', name: 'Launch', values: { status: 'todo', timeline: { start: addDays(d, 21), end: addDays(d, 21) }, priority: 'high', effort: 1 } },
      ],
      views: [
        { name: 'Main table', type: 'table' },
        { name: 'Gantt', type: 'timeline', settings: { timelineColumnId: '@timeline' } },
        { name: 'Kanban', type: 'kanban', settings: { kanbanColumnId: '@status' } },
        { name: 'Workload', type: 'workload', settings: { workloadPersonColumnId: '@owner', workloadEffortColumnId: '@effort' } },
      ],
    },
    {
      id: 'sprint',
      name: 'Sprint board',
      description: 'Plan sprints with story points and a kanban flow.',
      category: 'Software',
      icon: 'bolt',
      groups: [
        { key: 'backlog', name: 'Backlog', color: PALETTE[7] },
        { key: 'sprint', name: 'Current sprint', color: PALETTE[3] },
        { key: 'done', name: 'Done', color: PALETTE[0] },
      ],
      columns: [
        { key: 'assignee', title: 'Assignees', type: 'people' },
        { key: 'status', title: 'Status', type: 'status', settings: { labels: [
          { id: 'todo', label: 'To do', color: '#94a3b8' },
          { id: 'progress', label: 'In progress', color: '#f5a524' },
          { id: 'review', label: 'In review', color: '#a855f7' },
          { id: 'done', label: 'Done', color: '#00a36c', done: true },
        ] } },
        { key: 'points', title: 'Story points', type: 'number' },
        { key: 'type', title: 'Type', type: 'dropdown', settings: { multiple: false, options: [
          { id: 'feature', label: 'Feature', color: '#5b5bd6' },
          { id: 'bug', label: 'Bug', color: '#e5484d' },
          { id: 'chore', label: 'Chore', color: '#64748b' },
        ] } },
        { key: 'due', title: 'Due date', type: 'date' },
      ],
      items: [
        { group: 'sprint', name: 'User can reset password', values: { status: 'progress', points: 5, type: 'feature', due: addDays(d, 5) } },
        { group: 'sprint', name: 'Fix layout on mobile', values: { status: 'review', points: 2, type: 'bug', due: addDays(d, 2) } },
        { group: 'backlog', name: 'Audit dependencies', values: { status: 'todo', points: 3, type: 'chore' } },
      ],
      views: [
        { name: 'Kanban', type: 'kanban', settings: { kanbanColumnId: '@status' } },
        { name: 'Table', type: 'table' },
        { name: 'Points by status', type: 'chart', settings: { chartType: 'bar', chartGroupBy: '@status', chartMetric: { kind: 'sum', columnId: '@points' } } },
      ],
    },
    {
      id: 'crm',
      name: 'Sales pipeline',
      description: 'Track deals, value, contacts and stages.',
      category: 'Sales & CRM',
      icon: 'chart',
      groups: [
        { key: 'leads', name: 'Leads', color: PALETTE[4] },
        { key: 'active', name: 'Active deals', color: PALETTE[1] },
        { key: 'won', name: 'Closed', color: PALETTE[0] },
      ],
      columns: [
        { key: 'owner', title: 'Deal owner', type: 'person' },
        { key: 'stage', title: 'Stage', type: 'status', settings: { labels: [
          { id: 'new', label: 'New', color: '#0ea5e9' },
          { id: 'qualified', label: 'Qualified', color: '#5b5bd6' },
          { id: 'proposal', label: 'Proposal', color: '#f5a524' },
          { id: 'won', label: 'Won', color: '#00a36c', done: true },
          { id: 'lost', label: 'Lost', color: '#e5484d' },
        ] } },
        { key: 'value', title: 'Deal value', type: 'currency', settings: { currencyMode: 'inherit', decimals: 0, financeRole: 'other' } },
        { key: 'probability', title: 'Probability', type: 'percentage' },
        { key: 'forecast', title: 'Forecast', type: 'formula', settings: { formula: 'ROUND({Deal value} * {Probability} / 100, 0)' } },
        { key: 'email', title: 'Contact email', type: 'email' },
        { key: 'phone', title: 'Phone', type: 'phone' },
        { key: 'close', title: 'Expected close', type: 'date' },
        { key: 'location', title: 'Location', type: 'location' },
      ],
      items: [
        { group: 'active', name: 'Acme Corp — annual plan', values: { stage: 'proposal', value: 48000, probability: 60, email: 'buyer@acme.example', close: addDays(d, 14), location: { address: 'London, UK', lat: 51.5072, lng: -0.1276 } } },
        { group: 'leads', name: 'Globex pilot', values: { stage: 'new', value: 12000, probability: 20, close: addDays(d, 30), location: { address: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 } } },
      ],
      views: [
        { name: 'Pipeline', type: 'kanban', settings: { kanbanColumnId: '@stage' } },
        { name: 'Table', type: 'table' },
        { name: 'Value by stage', type: 'chart', settings: { chartType: 'bar', chartGroupBy: '@stage', chartMetric: { kind: 'sum', columnId: '@value' } } },
        { name: 'Map', type: 'map', settings: { mapColumnId: '@location' } },
      ],
    },
    {
      id: 'content-calendar',
      name: 'Content calendar',
      description: 'Plan and publish content on a calendar.',
      category: 'Marketing',
      icon: 'calendar',
      groups: [
        { key: 'ideas', name: 'Ideas', color: PALETTE[5] },
        { key: 'scheduled', name: 'Scheduled', color: PALETTE[3] },
        { key: 'published', name: 'Published', color: PALETTE[0] },
      ],
      columns: [
        { key: 'author', title: 'Author', type: 'person' },
        { key: 'status', title: 'Status', type: 'status' },
        { key: 'publish', title: 'Publish date', type: 'date' },
        { key: 'channel', title: 'Channels', type: 'tags' },
        { key: 'link', title: 'Link', type: 'link' },
        { key: 'rating', title: 'Quality', type: 'rating', settings: { max: 5 } },
      ],
      items: [
        { group: 'scheduled', name: 'Launch announcement', values: { status: 'working', publish: addDays(d, 3), channel: ['Blog', 'LinkedIn'] } },
        { group: 'ideas', name: 'Customer story', values: { status: 'todo', channel: ['Blog'] } },
      ],
      views: [
        { name: 'Calendar', type: 'calendar', settings: { calendarColumnId: '@publish', calendarMode: 'month' } },
        { name: 'Table', type: 'table' },
      ],
    },
    {
      id: 'requests',
      name: 'Request intake',
      description: 'Collect requests through a form and triage them.',
      category: 'Operations',
      icon: 'inbox',
      groups: [
        { key: 'new', name: 'New requests', color: PALETTE[4] },
        { key: 'triaged', name: 'Triaged', color: PALETTE[1] },
      ],
      columns: [
        { key: 'requester', title: 'Requester email', type: 'email' },
        { key: 'details', title: 'Details', type: 'long_text', width: 240 },
        { key: 'priority', title: 'Priority', type: 'priority' },
        { key: 'status', title: 'Status', type: 'status' },
        { key: 'owner', title: 'Owner', type: 'person' },
        { key: 'files', title: 'Files', type: 'files' },
      ],
      views: [
        { name: 'Table', type: 'table' },
        { name: 'Request form', type: 'form', settings: { formColumns: ['@requester', '@details', '@priority'], formTitle: 'Submit a request', formGroupId: '@@new' } },
        { name: 'Files', type: 'files' },
      ],
    },
  ];
}

/** Replace `@key` (column) / `@@key` (group) placeholders anywhere in a JSON value. */
function resolveKeys(value: unknown, cols: Map<string, string>, groups: Map<string, string>): unknown {
  const json = JSON.stringify(value ?? null).replace(/"(@@?)([A-Za-z0-9_-]+)"/g, (m, at: string, key: string) => {
    const id = at === '@@' ? groups.get(key) : cols.get(key);
    return id ? JSON.stringify(id) : m;
  });
  return JSON.parse(json);
}

export async function instantiateTemplate(
  db: D1Database,
  def: TemplateDef,
  opts: { workspaceId: string; name: string; createdBy: string; kind?: 'board' | 'personal' | 'template'; visibility?: 'workspace' | 'private'; withItems?: boolean },
): Promise<string> {
  const boardId = newId();
  const t = now();
  const colIds = new Map(def.columns.map((c) => [c.key, newId()]));
  const groupIds = new Map(def.groups.map((g) => [g.key, newId()]));
  const stmts: D1PreparedStatement[] = [];
  const columns = def.columns.map((c, i) => {
    const type = c.type in columnTypes ? c.type : 'text';
    const settings = sanitizeColumnSettings(type, resolveKeys(c.settings ?? {}, colIds, groupIds));
    if (type === 'status' && !c.settings?.labels) settings.labels = defaultStatusLabels();
    if (type === 'priority' && !c.settings?.labels) settings.labels = defaultPriorityLabels();
    return { id: colIds.get(c.key)!, title: c.title, type, settings, width: c.width ?? 150, position: (i + 1) * 1000 };
  });
  const statusCol = columns.find((c) => c.type === 'status');
  const boardSettings = { ...(resolveKeys(def.settings ?? {}, colIds, groupIds) as object), statusColumnId: statusCol?.id };
  stmts.push(
    db
      .prepare(
        'INSERT INTO boards (id, workspace_id, name, description, kind, visibility, icon, settings_json, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(boardId, opts.workspaceId, opts.name, def.description, opts.kind ?? 'board', opts.visibility ?? 'workspace', def.icon, JSON.stringify(boardSettings), t, opts.createdBy, t, t),
    db.prepare("INSERT INTO board_members (board_id, workspace_id, user_id, role) VALUES (?, ?, ?, 'owner')").bind(boardId, opts.workspaceId, opts.createdBy),
  );
  def.groups.forEach((g, i) =>
    stmts.push(
      db
        .prepare('INSERT INTO groups (id, workspace_id, board_id, name, color, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(groupIds.get(g.key), opts.workspaceId, boardId, g.name, g.color ?? PALETTE[i % PALETTE.length], (i + 1) * 1000, t),
    ),
  );
  for (const c of columns) {
    stmts.push(
      db
        .prepare('INSERT INTO columns (id, workspace_id, board_id, title, type, settings_json, position, width, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(c.id, opts.workspaceId, boardId, c.title, c.type, JSON.stringify(c.settings), c.position, c.width, t),
    );
  }
  const colDTOs = columns.map((c) => ({ ...c, boardId, hidden: false, required: false, description: '' }));
  if (opts.withItems !== false) {
    let pos = 1000;
    for (const it of def.items ?? []) {
      const itemId = newId();
      const values: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(it.values ?? {})) if (colIds.has(k)) values[colIds.get(k)!] = v;
      const doneIds = columns.filter((c) => c.type === 'status').flatMap((c) => (c.settings.labels ?? []).filter((l) => l.done).map((l) => l.id));
      const done = columns.some((c) => c.type === 'status' && doneIds.includes(values[c.id] as string));
      stmts.push(
        db
          .prepare(
            'INSERT INTO items (id, workspace_id, board_id, group_id, name, position, values_json, search_text, created_by, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          )
          .bind(itemId, opts.workspaceId, boardId, groupIds.get(it.group) ?? groupIds.values().next().value, it.name, pos, JSON.stringify(values), buildSearchText(it.name, '', values, colDTOs), opts.createdBy, t, t, done ? t : null),
      );
      pos += 1000;
      (it.subitems ?? []).forEach((s, si) =>
        stmts.push(
          db
            .prepare('INSERT INTO items (id, workspace_id, board_id, group_id, parent_item_id, name, position, search_text, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(newId(), opts.workspaceId, boardId, groupIds.get(it.group) ?? groupIds.values().next().value, itemId, s, (si + 1) * 1000, s.toLowerCase(), opts.createdBy, t, t),
        ),
      );
    }
  }
  (def.views ?? [{ name: 'Main table', type: 'table' }]).forEach((v, i) =>
    stmts.push(
      db
        .prepare('INSERT INTO views (id, workspace_id, board_id, name, type, settings_json, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), opts.workspaceId, boardId, v.name, v.type, JSON.stringify(resolveKeys(v.settings ?? {}, colIds, groupIds)), (i + 1) * 1000, opts.createdBy, t, t),
    ),
  );
  await db.batch(stmts);
  return boardId;
}

/**
 * Deep-copy a board (structure, optionally items/subitems, views and
 * automations). All ids are regenerated and every reference remapped.
 */
export async function cloneBoard(
  db: D1Database,
  sourceId: string,
  opts: { name: string; createdBy: string; kind?: 'board' | 'personal' | 'template'; withItems: boolean; withAutomations?: boolean; targetWorkspaceId?: string },
): Promise<string> {
  const src = await db.prepare('SELECT * FROM boards WHERE id = ?').bind(sourceId).first<any>();
  if (!src) throw new Error('Source board not found');
  const wsId = opts.targetWorkspaceId ?? src.workspace_id;
  const [groups, columns, items, views, automations] = await Promise.all([
    db.prepare('SELECT * FROM groups WHERE board_id = ? AND archived_at IS NULL').bind(sourceId).all<any>(),
    db.prepare('SELECT * FROM columns WHERE board_id = ?').bind(sourceId).all<ColumnRow>(),
    opts.withItems ? db.prepare('SELECT * FROM items WHERE board_id = ? AND archived_at IS NULL ORDER BY parent_item_id IS NOT NULL').bind(sourceId).all<any>() : Promise.resolve({ results: [] as any[] }),
    db.prepare('SELECT * FROM views WHERE board_id = ? AND owner_id IS NULL').bind(sourceId).all<any>(),
    opts.withAutomations ? db.prepare('SELECT * FROM automations WHERE board_id = ?').bind(sourceId).all<any>() : Promise.resolve({ results: [] as any[] }),
  ]);
  const map = new Map<string, string>();
  map.set(sourceId, newId());
  for (const r of [...groups.results, ...columns.results, ...items.results]) map.set(r.id, newId());
  const remap = (s: string) => {
    let out = s;
    for (const [from, to] of map) if (out.includes(from)) out = out.split(from).join(to);
    return out;
  };
  const boardId = map.get(sourceId)!;
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db
      .prepare('INSERT INTO boards (id, workspace_id, name, description, kind, visibility, icon, settings_json, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(boardId, wsId, opts.name, src.description, opts.kind ?? 'board', src.visibility, src.icon, remap(src.settings_json), t, opts.createdBy, t, t),
    db.prepare("INSERT INTO board_members (board_id, workspace_id, user_id, role) VALUES (?, ?, ?, 'owner')").bind(boardId, wsId, opts.createdBy),
  ];
  for (const g of groups.results) {
    stmts.push(
      db
        .prepare('INSERT INTO groups (id, workspace_id, board_id, name, color, position, collapsed, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(map.get(g.id), wsId, boardId, g.name, g.color, g.position, g.collapsed, g.description ?? '', t),
    );
  }
  for (const c of columns.results) {
    stmts.push(
      db
        .prepare('INSERT INTO columns (id, workspace_id, board_id, title, type, settings_json, position, width, hidden, required, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(map.get(c.id), wsId, boardId, c.title, c.type, remap(c.settings_json), c.position, c.width, c.hidden, c.required, c.description, t),
    );
  }
  const fileCols = columns.results.filter((c) => c.type === 'files').map((c) => map.get(c.id)!);
  for (const it of items.results) {
    if (!map.has(it.group_id)) continue;
    const values = parseJson<Record<string, unknown>>(remap(it.values_json), {});
    for (const fc of fileCols) delete values[fc];
    stmts.push(
      db
        .prepare(
          'INSERT INTO items (id, workspace_id, board_id, group_id, parent_item_id, name, description, position, values_json, search_text, created_by, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        )
        .bind(map.get(it.id), wsId, boardId, map.get(it.group_id), it.parent_item_id ? map.get(it.parent_item_id) ?? null : null, it.name, it.description, it.position, JSON.stringify(values), it.search_text, opts.createdBy, t, t, it.completed_at),
    );
  }
  for (const v of views.results) {
    stmts.push(
      db
        .prepare('INSERT INTO views (id, workspace_id, board_id, name, type, settings_json, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), wsId, boardId, v.name, v.type, remap(v.settings_json), v.position, opts.createdBy, t, t),
    );
  }
  for (const a of automations.results) {
    stmts.push(
      db
        .prepare('INSERT INTO automations (id, workspace_id, board_id, name, enabled, trigger_json, conditions_json, actions_json, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), wsId, boardId, a.name, opts.kind === 'template' ? 0 : a.enabled, remap(a.trigger_json), remap(a.conditions_json), remap(a.actions_json), opts.createdBy, t, t),
    );
  }
  // D1 batches are transactional; keep each batch at a reasonable size.
  for (let i = 0; i < stmts.length; i += 400) await db.batch(stmts.slice(i, i + 400));
  return boardId;
}

export { columnDTO };
