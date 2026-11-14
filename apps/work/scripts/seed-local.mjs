#!/usr/bin/env node
// Seeds a running LOCAL Worker with clearly fictional demo content, through the public API only:
// a workspace "Acme Studio" with four teammates, two project boards ("Website relaunch", "Product launch") with
// groups, owners, statuses, timelines, dependencies and comments, a dashboard, a linked document and work assigned
// to the demo user (overdue, due today and upcoming). Used for screenshots and manual testing.
//
//   npm run db:migrate:local && npm run dev          # in one terminal
//   npm run seed:local                                # in another (or: node scripts/seed-local.mjs --url http://localhost:8787)
//
// Sign in afterwards as demo@example.com with the password printed at the end. All names and addresses are
// invented (example.com is reserved for examples). The script refuses any host other than localhost/127.0.0.1.

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const BASE = (arg('--url') ?? process.env.SEED_URL ?? 'http://localhost:8787').replace(/\/$/, '');
const { hostname } = new URL(BASE);
if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname)) {
  console.error(`Refusing to seed ${BASE}: demo content is only for a local Worker.`);
  process.exit(1);
}

const PASSWORD = 'Granite-harbour-2026!';
const DEMO = { name: 'Demo User', email: 'demo@example.com' };
const TEAM = [
  { key: 'alex', name: 'Alex Rivera', email: 'alex.rivera@example.com' },
  { key: 'priya', name: 'Priya Nair', email: 'priya.nair@example.com' },
  { key: 'sam', name: 'Sam Okafor', email: 'sam.okafor@example.com' },
  { key: 'mia', name: 'Mia Chen', email: 'mia.chen@example.com' },
];
const ip = `10.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}.${(Math.random() * 250) | 0}`;

// ------------------------------------------------------------------ HTTP

async function request(method, path, { body, session } = {}) {
  const headers = { Origin: BASE, 'CF-Connecting-IP': ip };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (session) {
    headers.Cookie = session.cookie;
    headers['X-CSRF-Token'] = session.csrf;
  }
  const res = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { res, data };
}

async function api(session, method, path, body) {
  const { res, data } = await request(method, path, { body, session });
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

function sessionFrom(res, data) {
  const cookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).filter((c) => c.includes('_sid=')).join('; ');
  return { cookie, csrf: data.csrfToken, user: data.user, workspaces: data.workspaces };
}

async function signupOrLogin(person) {
  let { res, data } = await request('POST', '/api/auth/signup', { body: { name: person.name, email: person.email, password: PASSWORD } });
  if (res.status === 409) ({ res, data } = await request('POST', '/api/auth/login', { body: { email: person.email, password: PASSWORD } }));
  if (!res.ok) throw new Error(`Could not sign in ${person.email}: ${res.status} ${JSON.stringify(data)}`);
  return sessionFrom(res, data);
}

// ------------------------------------------------------------------ dates

const DAY = 86_400_000;
const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
const d = (offset) => new Date(today.getTime() + offset * DAY).toISOString().slice(0, 10);
const span = (from, to) => ({ start: d(from), end: d(to) });

// ------------------------------------------------------------------ content

const BOARDS = [
  {
    name: 'Website relaunch',
    groups: [
      { name: 'Discovery', color: '#0ea5e9' },
      { name: 'Design and build', color: '#f5a524' },
      { name: 'Launch', color: '#00a36c' },
    ],
    items: [
      { key: 'audit', group: 0, name: 'Audit current site content', owner: 'priya', status: 'done', timeline: span(-20, -14), priority: 'medium', effort: 5, budget: 1200, subitems: ['Export page inventory', 'Flag outdated pages'] },
      { key: 'interviews', group: 0, name: 'Interview sales and support', owner: 'alex', status: 'done', timeline: span(-16, -12), priority: 'high', effort: 3 },
      { key: 'sitemap', group: 0, name: 'Define site map and goals', owner: 'demo', status: 'done', timeline: span(-13, -9), priority: 'high', effort: 4, deps: ['audit'] },
      { key: 'wireframes', group: 1, name: 'Wireframes for key pages', owner: 'mia', status: 'done', timeline: span(-8, -4), priority: 'high', effort: 5, budget: 2500, deps: ['sitemap'] },
      { key: 'design', group: 1, name: 'Visual design system', owner: 'mia', status: 'working', timeline: span(-3, 3), priority: 'high', effort: 6, budget: 4000, deps: ['wireframes'], subitems: ['Colour and type', 'Components', 'Page templates'] },
      { key: 'copy', group: 1, name: 'Write new product page copy', owner: 'demo', status: 'working', timeline: span(-2, 0), priority: 'critical', effort: 3 },
      { key: 'cms', group: 1, name: 'Build CMS templates', owner: 'sam', status: 'working', timeline: span(-2, 8), priority: 'high', effort: 8, budget: 6000, deps: ['wireframes'] },
      { key: 'blog', group: 1, name: 'Migrate blog posts', owner: 'demo', status: 'stuck', timeline: span(-5, -1), priority: 'medium', effort: 4 },
      { key: 'qa', group: 2, name: 'QA on staging', owner: 'demo', status: 'todo', timeline: span(9, 12), priority: 'high', effort: 4, deps: ['cms'] },
      { key: 'redirects', group: 2, name: 'Set up redirects', owner: 'sam', status: 'todo', timeline: span(10, 12), priority: 'medium', effort: 2 },
      { key: 'live', group: 2, name: 'Go live', owner: 'alex', status: 'todo', timeline: span(13, 13), priority: 'critical', effort: 1, deps: ['qa', 'redirects'] },
    ],
  },
  {
    name: 'Product launch',
    groups: [
      { name: 'Prepare', color: '#5b5bd6' },
      { name: 'Launch week', color: '#f5a524' },
      { name: 'After launch', color: '#00a36c' },
    ],
    items: [
      { key: 'pricing', group: 0, name: 'Finalise pricing and packaging', owner: 'alex', status: 'done', timeline: span(-14, -9), priority: 'critical', effort: 5 },
      { key: 'messaging', group: 0, name: 'Launch messaging and positioning', owner: 'demo', status: 'done', timeline: span(-8, -5), priority: 'high', effort: 4, deps: ['pricing'] },
      { key: 'presskit', group: 0, name: 'Press kit and screenshots', owner: 'mia', status: 'working', timeline: span(-3, 2), priority: 'medium', effort: 3, budget: 1500 },
      { key: 'deck', group: 0, name: 'Sales enablement deck', owner: 'priya', status: 'working', timeline: span(-3, 4), priority: 'high', effort: 4, deps: ['messaging'] },
      { key: 'help', group: 0, name: 'Update help centre articles', owner: 'demo', status: 'todo', timeline: span(1, 5), priority: 'medium', effort: 3 },
      { key: 'email', group: 1, name: 'Email announcement', owner: 'demo', status: 'todo', timeline: span(6, 7), priority: 'high', effort: 2, deps: ['messaging'] },
      { key: 'webinar', group: 1, name: 'Launch webinar', owner: 'priya', status: 'todo', timeline: span(9, 9), priority: 'high', effort: 1, budget: 800 },
      { key: 'social', group: 1, name: 'Social campaign', owner: 'mia', status: 'stuck', timeline: span(4, 10), priority: 'medium', effort: 3, budget: 2000 },
      { key: 'feedback', group: 2, name: 'Collect early customer feedback', owner: 'alex', status: 'todo', timeline: span(12, 20), priority: 'medium', effort: 5 },
      { key: 'retro', group: 2, name: 'Launch retrospective', owner: 'demo', status: 'todo', timeline: span(21, 21), priority: 'low', effort: 1 },
    ],
  },
];

const text = (t, marks) => ({ type: 'text', text: t, ...(marks ? { marks } : {}) });
const para = (...content) => ({ type: 'paragraph', content });
const heading = (level, t) => ({ type: 'heading', attrs: { level }, content: [text(t)] });
const bullets = (...items) => ({ type: 'bulletList', content: items.map((t) => ({ type: 'listItem', content: [para(text(t))] })) });
const tasks = (...items) => ({ type: 'taskList', content: items.map(([t, checked]) => ({ type: 'taskItem', attrs: { checked }, content: [para(text(t))] })) });
const cell = (type, t) => ({ type, content: [para(text(t))] });
const table = (head, rows) => ({
  type: 'table',
  content: [{ type: 'tableRow', content: head.map((h) => cell('tableHeader', h)) }, ...rows.map((r) => ({ type: 'tableRow', content: r.map((c) => cell('tableCell', c)) }))],
});

const BRIEF = {
  type: 'doc',
  content: [
    para(text('This brief is fictional demo content for '), text('Acme Studio', [{ type: 'bold' }]), text('. It sets out why the website is being relaunched and how the team will get there.')),
    heading(2, 'Goal'),
    para(text('Relaunch the website with a clearer product story, faster pages and a content system the team can update without help.')),
    heading(2, 'Scope'),
    bullets('New home, product and pricing pages', 'Blog moved to the new content system', 'Redirects for every retired page', 'Analytics events agreed with marketing'),
    heading(2, 'Milestones'),
    table(
      ['Milestone', 'Owner', 'Date'],
      [
        ['Wireframes approved', 'Mia Chen', d(-4)],
        ['Design system ready', 'Mia Chen', d(3)],
        ['Content system live on staging', 'Sam Okafor', d(9)],
        ['Go live', 'Alex Rivera', d(13)],
      ],
    ),
    heading(2, 'Open questions'),
    tasks(['Confirm analytics events with marketing', true], ['Decide whether to keep the older case studies', false], ['Agree the content freeze date', false]),
    { type: 'blockquote', content: [para(text('Every page should answer one question for one audience.'))] },
  ],
};

// ------------------------------------------------------------------ run

async function main() {
  console.log(`Seeding ${BASE}`);
  const demo = await signupOrLogin(DEMO);
  const existing = demo.workspaces.find((w) => w.name === 'Acme Studio');
  if (existing) {
    console.log('Already seeded: the demo user has an "Acme Studio" workspace. Reset the local database to seed again.');
    return;
  }
  const wsId = demo.workspaces.find((w) => w.role === 'owner')?.id;
  if (!wsId) throw new Error('The demo user has no workspace of their own.');
  await api(demo, 'PATCH', `/api/workspaces/${wsId}`, { name: 'Acme Studio', description: 'Fictional demo workspace' });

  // Teammates: invite first, so signing up joins Acme Studio instead of making a workspace of their own.
  const people = { demo: demo.user.id };
  const sessions = { demo };
  for (const p of TEAM) {
    const invitation = await api(demo, 'POST', `/api/workspaces/${wsId}/invitations`, { email: p.email, role: 'member' });
    const s = await signupOrLogin(p);
    let inv = (await api(s, 'GET', '/api/auth/me')).workspaces.find((w) => w.id === wsId);
    // Accounts made after the invitation join when they accept it with the link's token, as a person would.
    const token = invitation?.inviteUrl ? decodeURIComponent(invitation.inviteUrl.split('/invite/')[1] ?? '') : '';
    if (!inv && token) {
      await api(s, 'POST', `/api/auth/invitations/${encodeURIComponent(token)}/accept`, {});
      inv = (await api(s, 'GET', '/api/auth/me')).workspaces.find((w) => w.id === wsId);
    }
    if (!inv) throw new Error(`${p.email} did not join the demo workspace`);
    people[p.key] = s.user.id;
    sessions[p.key] = s;
  }

  const boardIds = [];
  const itemIds = {};
  for (const def of BOARDS) {
    const created = await api(demo, 'POST', `/api/workspaces/${wsId}/boards`, { name: def.name, templateId: 'project-plan', withSampleItems: false });
    const bundle = await api(demo, 'GET', `/api/boards/${created.id}`);
    boardIds.push(created.id);
    const col = (type, title) => bundle.columns.find((c) => c.type === type && (!title || c.title === title))?.id;
    const C = { owner: col('person'), status: col('status'), timeline: col('timeline'), priority: col('priority'), deps: col('dependency'), effort: col('number', 'Effort (days)'), budget: col('currency') };
    const groups = [...bundle.groups].sort((a, b) => a.position - b.position);
    for (const [i, g] of def.groups.entries()) await api(demo, 'PATCH', `/api/groups/${groups[i].id}`, g);
    for (const it of def.items) {
      const values = { [C.owner]: people[it.owner], [C.status]: it.status, [C.timeline]: it.timeline, [C.priority]: it.priority, [C.effort]: it.effort };
      if (it.budget) values[C.budget] = it.budget;
      if (it.deps) values[C.deps] = it.deps.map((k) => itemIds[k]);
      const item = await api(demo, 'POST', `/api/boards/${created.id}/items`, { name: it.name, groupId: groups[it.group].id, values, position: 'bottom' });
      itemIds[it.key] = item.id;
      for (const [n, name] of (it.subitems ?? []).entries()) {
        const sub = await api(demo, 'POST', `/api/boards/${created.id}/items`, { name, parentItemId: item.id, values: { [C.owner]: people[it.owner] }, position: 'bottom' });
        if (it.status === 'done' || n === 0) await api(demo, 'PATCH', `/api/items/${sub.id}`, { values: { [C.status]: 'done' } });
      }
    }
    await api(demo, 'POST', `/api/workspaces/${wsId}/favourites`, { type: 'board', id: created.id });
  }

  // Conversation on the item due today, with a mention of the demo user.
  await api(sessions.alex, 'POST', `/api/items/${itemIds.copy}/updates`, { body: `Draft reads well. @[${DEMO.name}](user:${people.demo}) can you add the pricing note before Thursday's review?` });
  await api(sessions.mia, 'POST', `/api/items/${itemIds.design}/updates`, { body: 'Colour and type are done. Components next, then page templates.' });
  await api(sessions.sam, 'POST', `/api/items/${itemIds.blog}/updates`, { body: `Blocked: the old blog export drops images. @[${DEMO.name}](user:${people.demo}) can we get a full backup from the current host?` });

  const dash = await api(demo, 'POST', `/api/workspaces/${wsId}/dashboards`, { name: 'Delivery overview', description: 'Website relaunch and product launch at a glance', boardIds });
  await api(demo, 'POST', `/api/workspaces/${wsId}/favourites`, { type: 'dashboard', id: dash.id });

  const doc = await api(demo, 'POST', `/api/workspaces/${wsId}/documents`, { title: 'Website relaunch brief', content: BRIEF, boardId: boardIds[0] });
  await api(demo, 'POST', `/api/workspaces/${wsId}/favourites`, { type: 'document', id: doc.id });

  console.log(`Seeded workspace "Acme Studio" (${wsId}): ${boardIds.length} boards, ${Object.keys(itemIds).length} items, 1 dashboard, 1 document.`);
  console.log(`Sign in at ${BASE}/login as ${DEMO.email} with password ${PASSWORD}`);
  console.log(JSON.stringify({ workspaceId: wsId, boards: boardIds, dashboard: dash.id, document: doc.id }));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
