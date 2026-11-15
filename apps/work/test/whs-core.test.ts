// BIZOMAT WHS, Release 1 (src/worker/whs): the owner's WHS brief, Tests 1, 2, 3, 11, 12, 13 and 14 end to end, and the
// rules the brief and the project set: the evidence an action needs, the incident's tracked changes and protection
// from deletion, the configurable risk matrix with the hierarchy-of-controls warning, rule effective dates (a rule not
// yet in effect does not apply; an unverified rule gives no deadline), the legal update workflow for platform
// administrators, roles, overdue escalation, My Work and the example company.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { rulesInEffect } from '../src/worker/whs/legal';
import { escalateOverdue } from '../src/worker/whs/actions';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registerCompany(c: Client, name: string) {
  const res = await c.req('POST', '/api/company/companies', { kind: 'business', name, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return data.company.id as string;
}

async function joinCompany(owner: Client, companyId: string, invitee: Client) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

type Who = 'manager' | 'officer' | 'investigator' | 'hsr' | 'health' | 'worker' | 'exec';

/** A registered company with the WHS roles, and two sites. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const co = await registerCompany(owner, `${label} Works`);
  const people = {} as Record<Who, Client>;
  for (const [key, role] of [
    ['manager', 'whs_manager'],
    ['officer', 'whs_officer'],
    ['investigator', 'whs_investigator'],
    ['hsr', 'whs_hsr'],
    ['health', 'health_officer'],
    ['worker', null],
    ['exec', 'executive'],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p);
    if (role) await owner.json('PUT', `/api/erp/c/${co}/roles/${p.userId}`, { roles: [role] });
    people[key] = p;
  }
  const siteA = await owner.json('POST', `/api/maintenance/c/${co}/sites`, { code: 'A', name: `${label} site A` });
  const siteB = await owner.json('POST', `/api/maintenance/c/${co}/sites`, { code: 'B', name: `${label} site B` });
  return { owner, co, siteA: siteA.id as string, siteB: siteB.id as string, ...people };
}

const w = (co: string, path = '') => `/api/whs/c/${co}${path}`;
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5, 6, 7, 8]);

async function upload(c: Client, co: string, kind: string, id: string, name = 'photo.png') {
  const fd = new FormData();
  fd.set('file', new File([PNG], name, { type: 'image/png' }));
  fd.set('kind', kind);
  fd.set('id', id);
  return c.req('POST', w(co, '/files'), fd);
}

const grantAdmin = (c: Client, role: 'founder' | 'admin' = 'admin') => env.DB.prepare('INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, ?, ?, ?)').bind(c.userId, role, 'test', Date.now()).run();

/** A platform administrator takes a seeded draft version of a rule through review, activation and verification. */
async function verifyRule(admin: Client, ruleId: string, edit: Record<string, unknown>) {
  await admin.json('PATCH', `/api/admin/whs/rules/${ruleId}`, edit);
  await admin.json('POST', `/api/admin/whs/rules/${ruleId}/submit`, {});
  await admin.json('POST', `/api/admin/whs/rules/${ruleId}/review`, { decision: 'approve', notes: 'Read against the enacted Act (test only)' });
  await admin.json('POST', `/api/admin/whs/rules/${ruleId}/activate`, {});
  return admin.json('POST', `/api/admin/whs/rules/${ruleId}/verify`, { sourceChecked: 'https://www.legislation.tas.gov.au/', notes: 'Verified inside this test only: not a real verification' });
}

describe('BIZOMAT WHS jurisdiction packs', () => {
  it('seeds the packs with every instrument and rule not verified, Victoria apart, the model laws applying to no site', async () => {
    const u = await signup('Pack Reader');
    const packs = (await u.json('GET', '/api/whs/packs')).packs as any[];
    const ids = packs.map((p) => p.id);
    for (const id of ['au-model', 'au-cth', 'au-nsw', 'au-qld', 'au-sa', 'au-tas', 'au-wa', 'au-act', 'au-nt', 'au-vic', 'nz', 'uk-gb', 'ca-federal', 'ca-on', 'sg', 'za']) expect(ids, id).toContain(id);
    expect(packs.find((p) => p.id === 'au-model').assignable).toBe(false);
    const all = await env.DB.prepare("SELECT (SELECT COUNT(*) FROM whs_instruments WHERE status <> 'not_verified') + (SELECT COUNT(*) FROM whs_rules WHERE verification <> 'not_verified' AND rule_key NOT LIKE 'au-tas.%') AS n").first<{ n: number }>();
    expect(all!.n).toBe(0);
    const vic = await u.json('GET', '/api/whs/packs/au-vic');
    expect(vic.pack.framework).toMatch(/not the harmonised/);
    expect(vic.instruments.map((i: any) => i.title)).toContain('Occupational Health and Safety Act 2004 (Vic)');
    expect(vic.notice).toMatch(/competent person must verify/);
    // the December 2025 model-law amendments: a draft version in each harmonised jurisdiction, never active by itself
    const drafts = await env.DB.prepare("SELECT rule_key, status FROM whs_rules WHERE version = 2 AND kind = 'notification'").all<any>();
    expect(drafts.results.filter((r) => r.rule_key !== 'au-tas.notification').every((r) => r.status === 'draft')).toBe(true);
    expect(drafts.results.length).toBe(8);
    // the workplace exposure limits: version 2 from 1 December 2026, version 1 before it
    expect((await rulesInEffect(env.DB, 'au-nsw', '2026-11-30', 'exposure_limits'))[0].version).toBe(1);
    expect((await rulesInEffect(env.DB, 'au-nsw', '2026-12-01', 'exposure_limits'))[0].version).toBe(2);
    // a seeded instrument records what could be checked, and when
    const cth = await u.json('GET', '/api/whs/packs/au-cth');
    expect(cth.instruments.find((i: any) => i.title.startsWith('Work Health and Safety Act 2011')).sourceCheck).toMatch(/compilation 16/);
    expect(cth.instruments.every((i: any) => i.statusLabel === 'Not verified')).toBe(true);
  });

  it('keeps the legal update workflow to platform administrators, with review by someone else, and never changes an active version', async () => {
    const outsider = await signup('Not An Admin');
    expect((await outsider.req('GET', '/api/admin/whs/overview')).status).toBe(404);
    const a1 = await signup('Admin One');
    const a2 = await signup('Admin Two');
    await grantAdmin(a1);
    await grantAdmin(a2);
    const draft = await a1.json('POST', '/api/admin/whs/packs/au-act/rules', { key: 'test-retention', kind: 'retention', title: 'Test rule', sourceUrl: 'https://www.legislation.act.gov.au/', body: 'Draft' });
    expect(draft.status).toBe('draft');
    await a1.json('POST', `/api/admin/whs/rules/${draft.id}/submit`, {});
    // the drafter does not review their own version while another administrator can
    expect((await a1.req('POST', `/api/admin/whs/rules/${draft.id}/review`, { decision: 'approve', notes: 'Looks right' })).status).toBe(403);
    await a2.json('POST', `/api/admin/whs/rules/${draft.id}/review`, { decision: 'approve', notes: 'Checked' });
    expect((await a2.req('POST', `/api/admin/whs/rules/${draft.id}/verify`, { sourceChecked: 'https://www.legislation.act.gov.au/', notes: 'Checked' })).status).toBe(400); // no effective date
    await a2.json('POST', `/api/admin/whs/rules/${draft.id}/activate`, {});
    expect((await a1.req('PATCH', `/api/admin/whs/rules/${draft.id}`, { title: 'Changed' })).status).toBe(409);
    const v2 = await a1.json('POST', `/api/admin/whs/rules/${draft.id}/versions`, { title: 'Test rule, version 2', effectiveFrom: day(30) });
    expect(v2.version).toBe(2);
    expect((await a1.req('POST', `/api/admin/whs/rules/${draft.id}/versions`, {})).status).toBe(409); // one open version at a time
    const events = await a1.json('GET', '/api/admin/whs/packs/au-act');
    expect(events.events.some((e: any) => e.action === 'rule.reviewed')).toBe(true);
    // the history is append-only
    await expect(env.DB.prepare('DELETE FROM whs_legal_events').run()).rejects.toThrow(/append-only/);
  });
});

describe('BIZOMAT WHS: the brief’s acceptance tests', () => {
  it('Test 1: a worker reports a hazard, a supervisor reviews it, a risk assessment is made, controls are assigned, the action is verified and the hazard closed', async () => {
    const t = await team('T1');
    // the worker reports from a phone: the short form and a photo
    const hz = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Oil on the floor by the press', category: 'slips_trips', siteId: t.siteA, location: 'Press 2' });
    expect(hz.number).toMatch(/^HZ-\d{5}$/);
    expect((await upload(t.worker, t.co, 'hazard', hz.id)).status).toBe(201);
    // a worker may not assess; the supervisor (WHS officer) rates it on the matrix
    expect((await t.worker.req('POST', w(t.co, `/hazards/${hz.id}/assess`), { likelihood: 4, consequence: 3 })).status).toBe(403);
    const rated = await t.officer.json('POST', w(t.co, `/hazards/${hz.id}/assess`), { likelihood: 4, consequence: 3 });
    expect(rated).toMatchObject({ status: 'assessment', riskLevel: 'high', riskLabel: 'High', high: true });
    // a risk assessment made for it, approved by the WHS manager (not the officer who drafted it)
    const ra = await t.officer.json('POST', w(t.co, '/risk-assessments'), {
      kind: 'task',
      title: 'Cleaning around the presses',
      hazardId: hz.id,
      reviewDate: day(180),
      content: { steps: [{ key: 'a', step: 'Find the leak' }], lines: [{ stepKey: 'a', hazard: 'Oil on the floor', harm: 'Slips and falls', likelihood: 4, consequence: 3, residualLikelihood: 2, residualConsequence: 2, controls: [{ stage: 'additional', hierarchy: 'engineering', description: 'Drip tray under the press' }] }] },
    });
    await t.officer.json('POST', w(t.co, `/risk-assessments/${ra.assessment.id}/submit`), {});
    expect((await t.officer.req('POST', w(t.co, `/risk-assessments/${ra.assessment.id}/approve`), {})).status).toBe(403);
    expect((await t.manager.json('POST', w(t.co, `/risk-assessments/${ra.assessment.id}/approve`), { note: 'OK' })).assessment.status).toBe('approved');
    expect((await t.officer.json('GET', w(t.co, `/hazards/${hz.id}`))).links.map((l: any) => l.type)).toContain('risk_assessment');
    // controls assigned: an engineering action for the worker, needing evidence
    const ctl = await t.officer.json('POST', w(t.co, `/hazards/${hz.id}/controls`), { proposedControls: 'Drip tray and a daily check', actions: [{ title: 'Fit a drip tray under press 2', hierarchy: 'engineering', responsibleId: t.worker.userId, dueDate: day(7), evidenceRequired: true, evidenceNote: 'A photo of the tray' }] });
    expect(ctl.hazard.status).toBe('controls_assigned');
    expect(ctl.warnings).toEqual([]);
    const action = (await t.officer.json('GET', w(t.co, `/hazards/${hz.id}`))).actions[0];
    expect(action.number).toMatch(/^ACT-\d{5}$/);
    // the evidence rule: completing without a file is refused on the server
    const early = await t.worker.req('POST', w(t.co, `/actions/${action.id}/complete`), { note: 'Fitted' });
    expect(early.status).toBe(409);
    expect(((await early.json()) as any).details.code).toBe('EVIDENCE_REQUIRED');
    expect((await upload(t.worker, t.co, 'action', action.id, 'tray.png')).status).toBe(201);
    await t.worker.json('POST', w(t.co, `/actions/${action.id}/complete`), { note: 'Tray fitted' });
    // the worker may not verify their own action; the supervisor does, and closes it
    expect((await t.worker.req('POST', w(t.co, `/actions/${action.id}/verify`), { effective: true, note: 'x' })).status).toBe(403);
    await t.officer.json('POST', w(t.co, `/actions/${action.id}/verify`), { effective: true, note: 'Checked on the floor: no oil' });
    await t.officer.json('POST', w(t.co, `/actions/${action.id}/close`), {});
    await t.officer.json('POST', w(t.co, `/hazards/${hz.id}/advance`), { to: 'implementation' });
    await t.officer.json('POST', w(t.co, `/hazards/${hz.id}/advance`), { to: 'verification' });
    const closed = await t.officer.json('POST', w(t.co, `/hazards/${hz.id}/advance`), { to: 'closed', note: 'Tray in place, floor dry for a week', residualLikelihood: 2, residualConsequence: 2 });
    expect(closed).toMatchObject({ status: 'closed', residualLevel: 'medium', verificationNote: 'Tray in place, floor dry for a week' });
    const view = await t.officer.json('GET', w(t.co, `/hazards/${hz.id}`));
    expect(view.history.map((e: any) => e.action)).toEqual(expect.arrayContaining(['hazard.reported', 'hazard.assessed', 'hazard.controls_assigned', 'hazard.closed', 'file.added']));
    // the worker still follows their own report
    expect((await t.worker.json('GET', w(t.co, '/hazards?mine=1'))).hazards.map((h: any) => h.id)).toEqual([hz.id]);
  });

  it('Test 2: a worker reports an incident; it is classified, investigated, its corrective actions done and it is closed', async () => {
    const t = await team('T2');
    const inc = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Hand caught in the conveyor', occurredDate: day(-1), occurredTime: '09:40', siteId: t.siteA, outcome: 'first_aid', immediateResponse: 'Conveyor stopped' });
    expect(inc).toMatchObject({ number: expect.stringMatching(/^INC-\d{5}$/), status: 'reported', full: false });
    await t.officer.json('POST', w(t.co, `/incidents/${inc.id}/respond`), { immediateResponse: 'Conveyor stopped and locked out; first aid given', firstAid: true });
    expect((await t.investigator.req('POST', w(t.co, `/incidents/${inc.id}/classify`), { kind: 'injury', severity: 'moderate', outcome: 'first_aid', investigationRequired: true })).status).toBe(403);
    await t.officer.json('POST', w(t.co, `/incidents/${inc.id}/classify`), { kind: 'injury', severity: 'moderate', outcome: 'first_aid', bodyPart: 'Right hand', injuryNature: 'Bruising', investigationRequired: true });
    // without the approved investigation it cannot move to corrective action
    expect((await t.officer.req('POST', w(t.co, `/incidents/${inc.id}/advance`), { to: 'corrective_action' })).status).toBe(409);
    const started = await t.investigator.json('POST', w(t.co, `/incidents/${inc.id}/investigation`), { method: 'both', team: [t.officer.userId] });
    const inv = started.investigation;
    expect(inv.number).toMatch(/^INV-\d{5}$/);
    expect(started.incident.status).toBe('investigation');
    await t.investigator.json('POST', w(t.co, `/investigations/${inv.id}/timeline`), { at: `${day(-1)} 09:40`, description: 'Hand caught at the tail pulley' });
    await t.investigator.json('POST', w(t.co, `/investigations/${inv.id}/statements`), { witness: 'Witness One (test)', statement: 'I saw the guard was off.' });
    expect((await t.investigator.req('POST', w(t.co, `/investigations/${inv.id}/submit`), {})).status).toBe(409); // no root cause yet
    await t.investigator.json('PATCH', w(t.co, `/investigations/${inv.id}`), {
      whys: ['The hand reached the pulley', 'The guard was off', 'It was removed for cleaning', 'No refit check'],
      fishbone: { plant: ['Guard removable without tools'], methods: ['No refit check after cleaning'] },
      rootCause: 'Guards can be removed without tools and are not checked after cleaning.',
      factors: ['Night shift'],
      failedControls: [{ control: 'Tail pulley guard', hierarchy: 'engineering', why: 'Not refitted' }],
    });
    await t.investigator.json('POST', w(t.co, `/investigations/${inv.id}/submit`), {});
    // the lead does not approve their own investigation; the WHS manager does
    expect((await t.investigator.req('POST', w(t.co, `/investigations/${inv.id}/approve`), { decision: 'approve' })).status).toBe(403);
    const approved = await t.manager.json('POST', w(t.co, `/investigations/${inv.id}/approve`), { decision: 'approve', note: 'Agreed' });
    expect(approved.incident.status).toBe('corrective_action');
    expect(approved.investigation).toMatchObject({ status: 'approved', fishbone: { plant: ['Guard removable without tools'] }, whys: expect.arrayContaining(['The guard was off']) });
    const act = await t.officer.json('POST', w(t.co, '/actions'), { sourceType: 'investigation', sourceId: inv.id, title: 'Fit guards that need a tool to remove', hierarchy: 'engineering', responsibleId: t.investigator.userId, dueDate: day(10) });
    expect((await t.officer.req('POST', w(t.co, `/incidents/${inc.id}/advance`), { to: 'verification' })).status).toBe(409);
    await t.investigator.json('POST', w(t.co, `/actions/${act.id}/complete`), { note: 'Fixed guards fitted' });
    await t.officer.json('POST', w(t.co, `/actions/${act.id}/verify`), { effective: true, note: 'Tried: needs a spanner' });
    await t.officer.json('POST', w(t.co, `/actions/${act.id}/close`), {});
    await t.officer.json('POST', w(t.co, `/incidents/${inc.id}/advance`), { to: 'verification' });
    expect((await t.officer.req('POST', w(t.co, `/incidents/${inc.id}/advance`), { to: 'closed', note: 'Verified' })).status).toBe(403);
    const closed = await t.manager.json('POST', w(t.co, `/incidents/${inc.id}/advance`), { to: 'closed', note: 'Guards checked on every shift for a week' });
    expect(closed.incident.status).toBe('closed');
    expect(closed.actions.map((x: any) => x.status)).toEqual(['closed']);
  });

  it('Test 3: a serious incident under a verified rule is flagged, the officer alerted, the checklist done and the submission reference recorded', async () => {
    const t = await team('T3');
    const admin = await signup('T3 Platform Admin');
    await grantAdmin(admin);
    await t.manager.json('PUT', w(t.co, `/sites/${t.siteA}/jurisdictions`), { packIds: ['au-tas'] });
    // before the rule is verified: no flag and no deadline, only "check with the regulator"
    // an incident sixty days ago: before the version verified below takes effect
    const early = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Fall from a ladder', occurredDate: day(-60), siteId: t.siteA, outcome: 'hospital_inpatient', severity: 'serious' });
    let n = await t.manager.json('GET', w(t.co, `/incidents/${early.id}/notification`));
    expect(n.checks.length).toBeGreaterThan(0);
    expect(n.checks.every((c: any) => !c.verified && c.matches === null && c.dueAt === null)).toBe(true);
    expect(n.checks[0].dueNote).toBe('Deadline not verified: check with the regulator.');
    expect((await env.DB.prepare('SELECT potentially_notifiable FROM whs_incidents WHERE id = ?').bind(early.id).first<any>()).potentially_notifiable).toBe(0);
    // the seeded draft of the Tasmanian notification rule, verified inside this test only, in effect from 30 days ago
    const rule = await verifyRule(admin, 'au-tas.notification@v2', { effectiveFrom: day(-30), deadlineMinutes: 120, deadlineFrom: 'awareness', criteria: { outcomes: ['hospital_inpatient', 'fatality'], kinds: ['dangerous_occurrence'] }, requiredInfo: ['Who is notifying', 'What happened'] });
    expect(rule).toMatchObject({ verification: 'verified', status: 'active', applies: true });
    // a serious incident: the WHS manager is alerted at once, and the verified rule flags it with a due time
    const awareAt = Date.now() - 30 * 60_000;
    const inc = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Fall through a skylight', occurredDate: day(0), siteId: t.siteA, outcome: 'hospital_inpatient', severity: 'critical', awareAt });
    expect(inc.serious).toBe(true);
    const alerts = await t.manager.json('GET', w(t.co, '/alerts'));
    expect(alerts.alerts.map((x: any) => x.kind)).toEqual(expect.arrayContaining(['serious_incident', 'potentially_notifiable']));
    n = await t.manager.json('GET', w(t.co, `/incidents/${inc.id}/notification`));
    const hit = n.checks.find((c: any) => c.verified);
    expect(hit).toMatchObject({ verified: true, matches: true, dueAt: awareAt + 120 * 60_000, ruleVersion: 2 });
    expect(n.incident.potentiallyNotifiable).toBe(true);
    // the system decides nothing: an officer may not record the decision, the WHS manager does, with reasons
    expect((await t.officer.req('POST', w(t.co, `/incidents/${inc.id}/notification/decision`), { packId: 'au-tas', decision: 'notifiable', reasons: 'Hospital' })).status).toBe(403);
    n = await t.manager.json('POST', w(t.co, `/incidents/${inc.id}/notification/decision`), { packId: 'au-tas', decision: 'notifiable', reasons: 'Admitted to hospital: covered by the rule', responsibleId: t.officer.userId });
    const notice = n.notices[0];
    expect(notice).toMatchObject({ status: 'to_submit', dueAt: awareAt + 120 * 60_000, dueNote: '' });
    expect((await t.manager.json('GET', w(t.co, '/summary'))).notifications).toBe(1);
    // the responsible officer is alerted, completes the checklist and records the submission with the reference
    expect((await t.officer.json('GET', w(t.co, '/alerts'))).alerts.some((x: any) => x.kind === 'notification_due')).toBe(true);
    await t.officer.json('PUT', w(t.co, `/incidents/${inc.id}/notification/${notice.id}/checklist`), { items: notice.checklist.map((x: any) => ({ ...x, done: true })) });
    expect((await t.officer.req('POST', w(t.co, `/incidents/${inc.id}/notification/${notice.id}/submission`), { method: 'phone', submittedAt: Date.now(), submittedById: t.officer.userId, reference: '' })).status).toBe(400);
    expect((await upload(t.officer, t.co, 'notice', notice.id, 'confirmation.png')).status).toBe(201);
    n = await t.officer.json('POST', w(t.co, `/incidents/${inc.id}/notification/${notice.id}/submission`), { method: 'online', submittedAt: Date.now() - 60_000, submittedById: t.officer.userId, reference: 'TAS-TEST-123' });
    expect(n.notices[0]).toMatchObject({ status: 'submitted', reference: 'TAS-TEST-123', method: 'online' });
    expect(n.incident.notificationStatus).toBe('submitted');
    expect(n.notices[0].files.length).toBe(1);
    // a recorded submission is never changed, and nothing marks an incident submitted without one
    await expect(env.DB.prepare("UPDATE whs_reg_notices SET reference = 'X' WHERE id = ?").bind(notice.id).run()).rejects.toThrow(/WHS_PROTECTED/);
    await expect(env.DB.prepare("UPDATE whs_reg_notices SET status = 'submitted' WHERE incident_id = ?").bind(early.id).run()).resolves.toBeTruthy(); // no notice row: nothing changes
    const other = await t.manager.json('POST', w(t.co, `/incidents/${early.id}/notification/decision`), { packId: 'au-tas', decision: 'notifiable', reasons: 'Checked with the regulator' });
    // an incident before the rule took effect keeps the unverified version: no deadline
    expect(other.notices[0]).toMatchObject({ dueAt: null, dueNote: 'Deadline not verified: check with the regulator.' });
    await expect(env.DB.prepare("UPDATE whs_reg_notices SET status = 'submitted' WHERE id = ?").bind(other.notices[0].id).run()).rejects.toThrow(/CHECK/);
    // the old incident re-checked later: its first evaluation is kept, the new one uses the rule in effect on its date
    const again = await t.officer.json('POST', w(t.co, `/incidents/${early.id}/notification/evaluate`), {});
    expect(again.evaluations).toBe(2);
    expect(again.checks.find((c: any) => c.ruleKey === 'au-tas.notification')).toMatchObject({ ruleVersion: 1, verified: false });
  });

  it('Test 11: one jurisdiction’s rules are never applied to another', async () => {
    const t = await team('T11');
    const admin = await signup('T11 Platform Admin');
    await grantAdmin(admin);
    await verifyRule(admin, 'au-tas.notification@v2', { effectiveFrom: day(-30), deadlineMinutes: 60, criteria: { outcomes: ['fatality', 'hospital_inpatient'] } }).catch(() => null);
    await t.manager.json('PUT', w(t.co, `/sites/${t.siteA}/jurisdictions`), { packIds: ['au-tas'] });
    await t.manager.json('PUT', w(t.co, `/sites/${t.siteB}/jurisdictions`), { packIds: ['au-vic'] });
    // the model laws are a reference, never a site's jurisdiction
    expect((await t.manager.req('PUT', w(t.co, `/sites/${t.siteB}/jurisdictions`), { packIds: ['au-model'] })).status).toBe(400);
    const same = { kind: 'injury', title: 'Fall', occurredDate: day(0), outcome: 'hospital_inpatient', severity: 'serious' };
    const tas = await t.worker.json('POST', w(t.co, '/incidents'), { ...same, siteId: t.siteA });
    const vic = await t.worker.json('POST', w(t.co, '/incidents'), { ...same, siteId: t.siteB });
    const nt = await t.manager.json('GET', w(t.co, `/incidents/${tas.id}/notification`));
    const nv = await t.manager.json('GET', w(t.co, `/incidents/${vic.id}/notification`));
    expect(nt.checks.every((c: any) => c.packId === 'au-tas')).toBe(true);
    expect(nt.incident.potentiallyNotifiable).toBe(true);
    expect(nv.checks.length).toBeGreaterThan(0);
    expect(nv.checks.every((c: any) => c.packId === 'au-vic')).toBe(true);
    expect(nv.incident.potentiallyNotifiable).toBe(false);
    expect(nv.checks.every((c: any) => c.dueAt === null)).toBe(true);
    // a decision under another site's jurisdiction is refused
    expect((await t.manager.req('POST', w(t.co, `/incidents/${vic.id}/notification/decision`), { packId: 'au-tas', decision: 'notifiable', reasons: 'Wrong state' })).status).toBe(400);
    // a New Zealand site: only New Zealand's notifiable events
    const nzSite = await t.owner.json('POST', `/api/maintenance/c/${t.co}/sites`, { code: 'NZ', name: 'Auckland depot' });
    await t.manager.json('PUT', w(t.co, `/sites/${nzSite.id}/jurisdictions`), { packIds: ['nz'] });
    const nzInc = await t.worker.json('POST', w(t.co, '/incidents'), { ...same, siteId: nzSite.id });
    const nn = await t.manager.json('GET', w(t.co, `/incidents/${nzInc.id}/notification`));
    expect(nn.checks.map((c: any) => c.ruleKey)).toEqual(['nz.notification']);
    expect(nn.checks[0].pack.regulator).toBe('WorkSafe New Zealand');
  });

  it('Test 12: health information and confidential reports stay with the people allowed to read them', async () => {
    const t = await team('T12');
    const secret = 'Sutured at the clinic, five stitches (test)';
    const inc = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Cut finger', occurredDate: day(0), siteId: t.siteA, outcome: 'medical_treatment', health: { personName: 'Test worker', treatment: secret, daysLost: 1 } });
    // a supervisor, the WHS manager, the reporter and an HSR get 403 on medical fields; the health officer reads them
    for (const who of [t.officer, t.manager, t.worker, t.hsr, t.owner]) expect((await who.req('GET', w(t.co, `/incidents/${inc.id}/health`))).status, who.name).toBe(403);
    const h = await t.health.json('GET', w(t.co, `/incidents/${inc.id}/health`));
    expect(h.health).toMatchObject({ treatment: secret, daysLost: 1 });
    // nothing of it in the incident, its history or the register the officer reads
    const asOfficer = JSON.stringify(await t.officer.json('GET', w(t.co, `/incidents/${inc.id}`))) + JSON.stringify(await t.officer.json('GET', w(t.co, '/incidents')));
    expect(asOfficer).not.toContain('Sutured');
    const events = await env.DB.prepare('SELECT before_json, after_json, summary FROM whs_events WHERE entity_id = ?').bind(inc.id).all<any>();
    expect(JSON.stringify(events.results)).not.toContain('Sutured');
    expect((await t.officer.json('GET', w(t.co, `/incidents/${inc.id}`))).healthRecorded).toBe(true);
    // health files: only the health officer adds and reads them
    expect((await upload(t.officer, t.co, 'health', inc.id, 'certificate.png')).status).toBe(403);
    const file = (await (await upload(t.health, t.co, 'health', inc.id, 'certificate.png')).json()) as any;
    expect((await t.officer.req('GET', w(t.co, `/files/${file.id}`))).status).toBe(403);
    expect((await t.health.req('GET', w(t.co, `/files/${file.id}`))).status).toBe(200);
    await t.health.json('PUT', w(t.co, `/incidents/${inc.id}/health`), { restrictions: 'Light duties for a week (test)' });
    expect(JSON.stringify((await t.health.json('GET', w(t.co, `/incidents/${inc.id}/health`))).history)).not.toContain('Light duties');
    // a confidential psychosocial report: the reporter, WHS managers and health officers; never a supervisor
    expect((await t.worker.req('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'x', occurredDate: day(0), confidential: true })).status).toBe(400);
    const conf = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'psychosocial', title: 'Repeated shouting by a team leader', occurredDate: day(0), confidential: true });
    for (const who of [t.officer, t.hsr, t.exec, t.investigator]) {
      expect((await who.req('GET', w(t.co, `/incidents/${conf.id}`))).status, who.name).toBe(404);
      expect((await who.json('GET', w(t.co, '/incidents'))).incidents.map((i: any) => i.id), who.name).not.toContain(conf.id);
    }
    for (const who of [t.manager, t.health, t.worker]) expect((await who.req('GET', w(t.co, `/incidents/${conf.id}`))).status, who.name).toBe(200);
    // the company's owner is an ERP administrator: with a WHS manager appointed, not a reader of confidential reports
    expect((await t.owner.req('GET', w(t.co, `/incidents/${conf.id}`))).status).toBe(404);
    const me = await t.worker.json('GET', w(t.co, '/me'));
    expect(me.confidentialReaders.names.sort()).toEqual([t.health.name, t.manager.name].sort());
    // confidential hazards too
    const ch = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Workload in dispatch', category: 'psychosocial', confidential: true });
    expect((await t.officer.req('GET', w(t.co, `/hazards/${ch.id}`))).status).toBe(404);
    expect((await t.manager.req('GET', w(t.co, `/hazards/${ch.id}`))).status).toBe(200);
  });

  it('Test 13: other companies get 404 for every WHS record and route, and the sites of a company are kept apart', async () => {
    const t = await team('T13');
    const other = await signup('T13 Outsider');
    const ownOther = (await other.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own').id;
    const hz = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Loose handrail', category: 'slips_trips', siteId: t.siteA });
    const inc = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'near_miss', title: 'Dropped tool', occurredDate: day(0), siteId: t.siteB });
    const act = await t.officer.json('POST', w(t.co, '/actions'), { sourceType: 'hazard', sourceId: hz.id, title: 'Fix handrail' });
    const file = (await (await upload(t.worker, t.co, 'hazard', hz.id)).json()) as any;
    for (const path of ['/me', '/summary', '/dashboard', '/settings', '/hazards', `/hazards/${hz.id}`, `/incidents/${inc.id}`, `/actions/${act.id}`, `/files/${file.id}`, '/alerts', '/risk-register']) {
      expect((await other.req('GET', w(t.co, path))).status, path).toBe(404);
    }
    expect((await other.req('POST', w(t.co, '/hazards'), { title: 'x', category: 'fire' })).status).toBe(404);
    // the outsider's own company cannot reach the first company's records by id, nor name its sites
    expect((await other.req('GET', w(ownOther, `/hazards/${hz.id}`))).status).toBe(404);
    expect((await other.req('POST', w(ownOther, '/hazards'), { title: 'x', category: 'fire', siteId: t.siteA })).status).toBe(400);
    expect((await other.req('POST', w(ownOther, '/actions'), { sourceType: 'hazard', sourceId: hz.id, title: 'x' })).status).toBe(400);
    // multi-site: the dashboard of site A counts only site A
    const all = await t.manager.json('GET', w(t.co, '/dashboard'));
    const onlyB = await t.manager.json('GET', w(t.co, `/dashboard?site=${t.siteB}`));
    expect(all.hazards.active).toBe(1);
    expect(onlyB.hazards.active).toBe(0);
    expect(onlyB.incidents.nearMisses).toBe(1);
    expect(all.sites.find((s: any) => s.id === t.siteA).hazards).toBe(1);
  });

  it('Test 14: reporting from a phone is a short form with a photo, for every person in the company', async () => {
    const t = await team('T14');
    // the shortest hazard report: a title and a category
    const hz = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Blocked fire exit', category: 'fire' });
    expect(hz.status).toBe('reported');
    expect((await upload(t.worker, t.co, 'hazard', hz.id, 'exit.pdf')).status).toBe(400); // the content must match its type
    expect((await upload(t.worker, t.co, 'hazard', hz.id, 'exit.png')).status).toBe(201);
    // the shortest incident report: what kind, a title and the date
    const inc = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'near_miss', title: 'Pallet fell from a rack', occurredDate: day(0) });
    expect(inc.status).toBe('reported');
    expect((await upload(t.worker, t.co, 'incident', inc.id)).status).toBe(201);
    // the reporter sees their own reports, not the register
    const other = await t.officer.json('POST', w(t.co, '/hazards'), { title: 'Officer report', category: 'noise' });
    const mine = await t.worker.json('GET', w(t.co, '/hazards'));
    expect(mine.hazards.map((h: any) => h.id)).toEqual([hz.id]);
    expect((await t.worker.req('GET', w(t.co, `/hazards/${other.id}`))).status).toBe(404);
    expect((await t.worker.req('GET', w(t.co, '/dashboard'))).status).toBe(403);
    expect((await t.worker.json('GET', w(t.co, '/summary'))).scope).toBe('own');
    // a reporter cannot report in the future
    expect((await t.worker.req('POST', w(t.co, '/incidents'), { kind: 'near_miss', title: 'x', occurredDate: day(5) })).status).toBe(400);
  });
});

describe('BIZOMAT WHS rules', () => {
  it('tracks every change to an incident after classification and never deletes one', async () => {
    const t = await team('Track');
    const inc = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Sprained ankle', occurredDate: day(-1), siteId: t.siteA });
    await t.worker.json('PATCH', w(t.co, `/incidents/${inc.id}`), { description: 'On the loading ramp' });
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM whs_incident_revisions WHERE incident_id = ?').bind(inc.id).first<any>()).n).toBe(0);
    await t.officer.json('POST', w(t.co, `/incidents/${inc.id}/classify`), { kind: 'injury', severity: 'minor', outcome: 'first_aid', investigationRequired: false });
    // the reporter may not change it once it is classified
    expect((await t.worker.req('PATCH', w(t.co, `/incidents/${inc.id}`), { title: 'x' })).status).toBe(403);
    const after = await t.officer.json('PATCH', w(t.co, `/incidents/${inc.id}`), { severity: 'moderate', location: 'Ramp 2' });
    expect(after.revisions[0].changes).toEqual(expect.arrayContaining([{ field: 'severity', before: 'minor', after: 'moderate' }, { field: 'location', before: '', after: 'Ramp 2' }]));
    const ev = after.history.find((e: any) => e.action === 'incident.changed' && e.summary.includes('after classification'));
    expect(ev.before).toMatchObject({ severity: 'minor' });
    expect(ev.after).toMatchObject({ severity: 'moderate' });
    await expect(env.DB.prepare('DELETE FROM whs_incidents WHERE id = ?').bind(inc.id).run()).rejects.toThrow(/WHS_PROTECTED/);
    await expect(env.DB.prepare('DELETE FROM whs_events WHERE entity_id = ?').bind(inc.id).run()).rejects.toThrow(/append-only/);
    await expect(env.DB.prepare('UPDATE whs_incident_revisions SET after_json = ? WHERE incident_id = ?').bind('{}', inc.id).run()).rejects.toThrow(/append-only/);
    expect((await t.manager.req('DELETE', w(t.co, `/incidents/${inc.id}`))).status).toBe(404);
  });

  it('rates on the company’s own risk matrix, keeps each rating’s matrix, and warns when a high risk has only administrative controls and PPE', async () => {
    const t = await team('Matrix');
    const settings = await t.manager.json('GET', w(t.co, '/settings'));
    expect(settings.matrix.likelihood.length).toBe(5);
    expect(settings.matrix.consequence.length).toBe(5);
    const old = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Noise at the saw', category: 'noise' });
    await t.officer.json('POST', w(t.co, `/hazards/${old.id}/assess`), { likelihood: 5, consequence: 5 });
    // a 3 x 3 matrix with its own labels
    const m3 = { likelihood: [1, 2, 3].map((v) => ({ value: v, label: `L${v}` })), consequence: [1, 2, 3].map((v) => ({ value: v, label: `C${v}` })), levels: [{ key: 'low', label: 'Green', rank: 1, action: '' }, { key: 'high', label: 'Red', rank: 2, action: '' }], grid: [['low', 'low', 'high'], ['low', 'high', 'high'], ['high', 'high', 'high']], highFrom: 2 };
    expect((await t.officer.req('PUT', w(t.co, '/settings/matrix'), { matrix: m3 })).status).toBe(403);
    expect((await t.manager.req('PUT', w(t.co, '/settings/matrix'), { matrix: { ...m3, grid: [['low']] } })).status).toBe(400);
    expect((await t.manager.json('PUT', w(t.co, '/settings/matrix'), { matrix: m3 })).matrixVersion).toBe(2);
    const fresh = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Dust at the sander', category: 'chemical' });
    expect((await t.officer.req('POST', w(t.co, `/hazards/${fresh.id}/assess`), { likelihood: 5, consequence: 5 })).status).toBe(400);
    expect(await t.officer.json('POST', w(t.co, `/hazards/${fresh.id}/assess`), { likelihood: 2, consequence: 2 })).toMatchObject({ riskLevel: 'high', riskLabel: 'Red' });
    expect((await t.officer.json('GET', w(t.co, `/hazards/${old.id}`))).hazard.riskLabel).toBe('Critical');
    // the hierarchy-of-controls warning on a high risk with only PPE: approval needs it acknowledged
    const ra = await t.officer.json('POST', w(t.co, '/risk-assessments'), { kind: 'jsa', title: 'Sanding', content: { steps: [], lines: [{ hazard: 'Dust', likelihood: 2, consequence: 2, controls: [{ stage: 'existing', hierarchy: 'ppe', description: 'P2 mask' }] }] } });
    expect(ra.warnings[0]).toMatch(/only administrative controls and PPE/);
    await t.officer.json('POST', w(t.co, `/risk-assessments/${ra.assessment.id}/submit`), {});
    const refused = await t.manager.req('POST', w(t.co, `/risk-assessments/${ra.assessment.id}/approve`), {});
    expect(refused.status).toBe(409);
    expect(((await refused.json()) as any).details.code).toBe('WARNINGS');
    const ok = await t.manager.json('POST', w(t.co, `/risk-assessments/${ra.assessment.id}/approve`), { acknowledgeWarnings: true });
    expect(ok.assessment).toMatchObject({ status: 'approved', warningsAcknowledged: true });
    // a new revision after a change: the earlier one is superseded once the new one is approved
    const rev = await t.officer.json('POST', w(t.co, `/risk-assessments/${ra.assessment.id}/revise`), { trigger: 'equipment', reason: 'Dust extraction fitted' });
    expect(rev.assessment).toMatchObject({ revision: 2, status: 'draft', reviewTrigger: 'equipment' });
    expect(rev.lines[0].controls[0].description).toBe('P2 mask');
    await t.officer.json('PUT', w(t.co, `/risk-assessments/${rev.assessment.id}/content`), { steps: [], lines: [{ hazard: 'Dust', likelihood: 2, consequence: 2, residualLikelihood: 1, residualConsequence: 1, controls: [{ stage: 'existing', hierarchy: 'engineering', description: 'Dust extraction at the sander' }, { stage: 'existing', hierarchy: 'ppe', description: 'P2 mask' }] }] });
    await t.officer.json('POST', w(t.co, `/risk-assessments/${rev.assessment.id}/submit`), {});
    await t.manager.json('POST', w(t.co, `/risk-assessments/${rev.assessment.id}/approve`), {});
    expect((await t.officer.json('GET', w(t.co, `/risk-assessments/${ra.assessment.id}`))).assessment.status).toBe('superseded');
    const reg = await t.manager.json('GET', w(t.co, '/risk-register'));
    expect(reg.heatMap.initial.length).toBe(3);
    expect(reg.heatMap.initial[1][1]).toBe(2); // the approved revision's line and the hazard, both 2 x 2
  });

  it('gives each role what it may do', async () => {
    const t = await team('Roles');
    const hz = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Trip hazard', category: 'slips_trips' });
    // an HSR reads the register and comments in consultation, but does not assess
    expect((await t.hsr.json('GET', w(t.co, '/hazards'))).hazards.length).toBe(1);
    expect((await t.hsr.req('POST', w(t.co, `/hazards/${hz.id}/assess`), { likelihood: 1, consequence: 1 })).status).toBe(403);
    expect((await t.hsr.req('POST', w(t.co, '/comments'), { entityType: 'hazard', entityId: hz.id, kind: 'consultation', body: 'The workers ask for a mat here' })).status).toBe(201);
    expect((await t.worker.req('POST', w(t.co, '/comments'), { entityType: 'hazard', entityId: hz.id, kind: 'consultation', body: 'x' })).status).toBe(403);
    // an executive reads the dashboard; an investigator cannot change WHS settings; the owner (ERP administrator) can
    expect((await t.exec.req('GET', w(t.co, '/dashboard'))).status).toBe(200);
    expect((await t.exec.req('POST', w(t.co, `/hazards/${hz.id}/assess`), { likelihood: 1, consequence: 1 })).status).toBe(403);
    expect((await t.investigator.req('PUT', w(t.co, `/sites/${t.siteA}/jurisdictions`), { packIds: ['au-nsw'] })).status).toBe(403);
    expect((await t.owner.req('PUT', w(t.co, `/sites/${t.siteA}/jurisdictions`), { packIds: ['au-nsw'] })).status).toBe(200);
    const me = await t.manager.json('GET', w(t.co, '/me'));
    expect(me.can).toMatchObject({ view: true, approve: true, notify: true, manage: true, health: false, confidential: true });
    expect((await t.health.json('GET', w(t.co, '/me'))).can).toMatchObject({ health: true, confidential: true, approve: false });
    expect((await t.officer.json('GET', w(t.co, '/me'))).can).toMatchObject({ assess: true, confidential: false, health: false, approve: false });
    // the ERP roles list offers the WHS roles
    const roles = await t.owner.json('GET', `/api/erp/c/${t.co}/roles`);
    expect(roles.roles.map((r: any) => r.value)).toEqual(expect.arrayContaining(['whs_manager', 'whs_officer', 'whs_investigator', 'whs_hsr', 'health_officer']));
  });

  it('escalates overdue actions once, in the app, and lists what is assigned in My Work', async () => {
    const t = await team('Overdue');
    const hz = await t.worker.json('POST', w(t.co, '/hazards'), { title: 'Frayed cable', category: 'electrical' });
    const act = await t.officer.json('POST', w(t.co, '/actions'), { sourceType: 'hazard', sourceId: hz.id, title: 'Replace the cable', responsibleId: t.worker.userId, dueDate: day(-3) });
    expect((await t.worker.json('GET', w(t.co, '/alerts'))).alerts.some((x: any) => x.kind === 'assigned')).toBe(true);
    expect(await escalateOverdue(env, day(0), t.co)).toBe(1);
    expect(await escalateOverdue(env, day(0), t.co)).toBe(0);
    expect((await t.worker.json('GET', w(t.co, '/alerts'))).alerts.some((x: any) => x.kind === 'overdue_action')).toBe(true);
    expect((await t.manager.json('GET', w(t.co, '/alerts'))).alerts.some((x: any) => x.kind === 'overdue_action')).toBe(true);
    const mw = await t.worker.json('GET', '/api/whs/my-work');
    const entry = mw.companies.find((c: any) => c.company.id === t.co);
    expect(entry.items).toEqual([expect.objectContaining({ type: 'action', id: act.id, overdue: true })]);
    const dash = await t.manager.json('GET', w(t.co, '/dashboard'));
    expect(dash.actions).toMatchObject({ open: 1, overdue: 1 });
    expect(dash.rates.available).toBe(false);
    expect(dash.rates.note).toMatch(/hours worked/);
    // with hours worked for every month of the period, the rates are worked out
    const months = dash.trend.map((x: any) => x.month);
    await t.manager.json('PUT', w(t.co, '/hours'), { entries: months.map((m: string) => ({ siteId: null, month: m, hours: 1000 })) });
    const withHours = await t.manager.json('GET', w(t.co, '/dashboard'));
    expect(withHours.rates).toMatchObject({ available: true, hours: 1000 * months.length, ltifr: 0, trifr: 0 });
  });
});

describe('the example company in BIZOMAT WHS', () => {
  it('has a NSW site, a hazard being controlled, an approved JSA, two incidents with an investigation, actions and an example notification record, and no email', async () => {
    const a = await signup('WHS Example');
    const res = await a.req('POST', '/api/system/demo', {});
    expect(res.status).toBe(201);
    const co = ((await res.json()) as any).companyId as string;
    const me = await a.json('GET', w(co, '/me'));
    expect(me.sites[0].packs.map((p: any) => p.id)).toEqual(['au-nsw']);
    expect(me.can).toMatchObject({ health: true, confidential: true, approve: true });
    const hazards = (await a.json('GET', w(co, '/hazards'))).hazards;
    expect(hazards).toEqual([expect.objectContaining({ status: 'implementation', riskLevel: 'high', number: 'HZ-00001' })]);
    const ras = (await a.json('GET', w(co, '/risk-assessments'))).assessments;
    expect(ras).toEqual([expect.objectContaining({ kind: 'jsa', status: 'approved', approvalSod: true })]);
    const incidents = (await a.json('GET', w(co, '/incidents'))).incidents;
    expect(incidents.map((i: any) => i.kind).sort()).toEqual(['injury', 'near_miss']);
    const injury = incidents.find((i: any) => i.kind === 'injury');
    const detail = await a.json('GET', w(co, `/incidents/${injury.id}`));
    expect(detail.investigation).toMatchObject({ status: 'approved', approvalSod: true });
    expect(detail.investigation.whys.length).toBe(5);
    const n = await a.json('GET', w(co, `/incidents/${injury.id}/notification`));
    expect(n.notices[0]).toMatchObject({ status: 'submitted', example: true, reference: 'EXAMPLE-0001 (invented)', dueAt: null, dueNote: 'Deadline not verified: check with the regulator.' });
    expect(n.notices[0].submissionNotes).toMatch(/no notification was made/);
    const actions = (await a.json('GET', w(co, '/actions'))).actions;
    expect(actions.length).toBe(5);
    expect(actions.filter((x: any) => x.overdue).length).toBe(1);
    const dash = await a.json('GET', w(co, '/dashboard'));
    expect(dash.rates).toMatchObject({ available: true, hours: 1520 * 12, ltifr: 0 });
    expect((await a.json('GET', w(co, `/incidents/${injury.id}/health`))).health.treatment).toMatch(/^Example only/);
    // no email from the example company's alerts
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM whs_alerts WHERE company_id = ? AND emailed = 1').bind(co).first<any>()).n).toBe(0);
    // removed with everything else, through the purge the triggers allow
    await a.json('POST', '/api/system/demo/remove', {});
    const left = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM whs_incidents WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_events WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_reg_notices WHERE company_id = ?1) + (SELECT COUNT(*) FROM whs_purges WHERE company_id = ?1) AS n').bind(co).first<any>();
    expect(left.n).toBe(0);
  });
});
