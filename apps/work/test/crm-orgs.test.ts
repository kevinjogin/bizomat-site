// BIZOMAT CRM: organisations, memberships, invitations, roles and permissions, and isolation between organisations.
import { describe, expect, it } from 'vitest';
import { env } from 'cloudflare:test';
import { raw, signup, uniqueEmail } from './helpers';
import { createOrg, joinOrg, q, tokenOf } from './crm-helpers';

describe('CRM organisations', () => {
  it('any signed-in person creates an organisation and becomes its owner, with a pipeline and the starting automations', async () => {
    const a = await signup('Ava Owner');
    const orgId = await createOrg(a, 'ABC Engineering', { industry: 'engineering', website: 'abc.example.com' });
    const org = await a.json('GET', `/api/crm/orgs/${orgId}`);
    expect(org.name).toBe('ABC Engineering');
    expect(org.role).toBe('owner');
    expect(org.perms.members.manage).toBe(true);
    expect(org.currency).toBe('AUD');
    const pipelines = await a.json('GET', `/api/crm/orgs/${orgId}/pipelines`);
    expect(pipelines).toHaveLength(1);
    expect(pipelines[0].isDefault).toBe(true);
    expect(pipelines[0].stages.map((s: any) => s.name)).toEqual(['Qualification', 'Needs analysis', 'Proposal', 'Negotiation', 'Contract sent']);
    const autos = await a.json('GET', `/api/crm/orgs/${orgId}/automations`);
    expect(autos.automations).toHaveLength(7);
    expect(autos.automations.every((x: any) => x.enabled)).toBe(true);
    // The Proposal stage was filled into its follow-up automation.
    const proposal = pipelines[0].stages.find((s: any) => s.name === 'Proposal');
    expect(autos.automations.find((x: any) => x.preset === 'proposal_follow_up').config.stageId).toBe(proposal.id);
    const members = await a.json('GET', `/api/crm/orgs/${orgId}/members`);
    expect(members).toEqual([expect.objectContaining({ userId: a.userId, role: 'owner' })]);
  });

  it('a person belongs to several organisations with one login and switches between them', async () => {
    const a = await signup('Multi Org');
    const one = await createOrg(a, 'Org One');
    const two = await createOrg(a, 'Org Two');
    const b = await signup('Other Owner');
    const three = await createOrg(b, 'XYZ Manufacturing');
    await joinOrg(b, three, a, 'sales');
    const list = await a.json('GET', '/api/crm/orgs');
    expect(list.orgs.map((o: any) => o.name).sort()).toEqual(['Org One', 'Org Two', 'XYZ Manufacturing']);
    expect(list.orgs.find((o: any) => o.id === three).role).toBe('sales');
    expect((await a.json('GET', `/api/crm/orgs/${one}`)).role).toBe('owner');
    expect((await a.json('GET', `/api/crm/orgs/${two}`)).role).toBe('owner');
    expect((await a.json('GET', `/api/crm/orgs/${three}`)).role).toBe('sales');
  });

  it('refuses requests without a session and cross-site writes', async () => {
    expect((await raw('GET', '/api/crm/orgs')).status).toBe(401);
    const a = await signup('Csrf Owner');
    const res = await raw('POST', '/api/crm/orgs', { body: { name: 'X' }, cookie: a.cookie }); // no CSRF token
    expect(res.status).toBe(403);
  });

  it('settings: administrators change details, lists are validated, the currency is fixed once there are deals', async () => {
    const a = await signup('Settings Owner');
    const orgId = await createOrg(a);
    const updated = await a.json('PATCH', `/api/crm/orgs/${orgId}`, {
      phone: '+61 2 0000 0000',
      settings: { sources: [{ key: 'web', label: 'Web form' }, { key: 'trade', label: 'Trade show' }], closingSoonDays: 14 },
    });
    expect(updated.phone).toBe('+61 2 0000 0000');
    expect(updated.settings.sources.map((s: any) => s.key)).toEqual(['web', 'trade']);
    expect(updated.settings.closingSoonDays).toBe(14);
    // A converted lead status always exists.
    const statuses = await a.json('PATCH', `/api/crm/orgs/${orgId}`, { settings: { leadStatuses: [{ key: 'new', label: 'New', kind: 'open' }] } });
    expect(statuses.settings.leadStatuses.map((s: any) => s.key)).toEqual(['new', 'converted']);
    expect((await a.req('PATCH', `/api/crm/orgs/${orgId}`, { settings: { sources: [{ key: 'Bad Key!', label: 'x' }] } })).status).toBe(400);
    await a.json('POST', `/api/crm/orgs/${orgId}/deals`, { title: 'First deal', value: 100000 });
    expect((await a.req('PATCH', `/api/crm/orgs/${orgId}`, { currency: 'USD' })).status).toBe(409);
  });
});

describe('CRM invitations', () => {
  it('an owner invites by email; the invited person previews, accepts once and joins with the role', async () => {
    const owner = await signup('Inv Owner');
    const orgId = await createOrg(owner, 'Invite Co');
    const email = uniqueEmail('invitee');
    const inv = await owner.json('POST', `/api/crm/orgs/${orgId}/invitations`, { email, role: 'sales', message: 'Welcome aboard' });
    expect(inv.status).toBe('pending');
    expect(inv.inviteUrl).toMatch(/^http:\/\/example\.com\/crm\/join\//);
    expect(inv.emailDelivery).toBe('not_configured');
    const token = tokenOf(inv.inviteUrl);
    // Only the hash is stored.
    const stored = await env.DB.prepare('SELECT token_hash FROM crm_invitations WHERE id = ?').bind(inv.id).first<{ token_hash: string }>();
    expect(stored!.token_hash).not.toContain(token);
    const preview = await (await raw('GET', `/api/crm-public/invitations/${token}`)).json<any>();
    expect(preview).toMatchObject({ orgName: 'Invite Co', role: 'sales', status: 'pending', email });
    // An unregistered invitee creates an account with the invited address, then accepts.
    const invitee = await signup('New Colleague', email);
    const seen = await invitee.json('GET', '/api/crm/orgs');
    expect(seen.invitations).toEqual([expect.objectContaining({ orgName: 'Invite Co', role: 'sales' })]);
    const accepted = await invitee.json('POST', `/api/crm/invitations/${token}/accept`, {});
    expect(accepted.orgId).toBe(orgId);
    expect((await invitee.json('GET', `/api/crm/orgs/${orgId}`)).role).toBe('sales');
    // Single use: someone else cannot use it.
    const other = await signup('Someone Else');
    expect((await other.req('POST', `/api/crm/invitations/${token}/accept`, {})).status).toBe(410);
    const list = await owner.json('GET', `/api/crm/orgs/${orgId}/invitations`);
    expect(list[0].status).toBe('accepted');
  });

  it('only the invited address can accept; declining, revoking and resending work, and an old link stops working', async () => {
    const owner = await signup('Inv Owner 2');
    const orgId = await createOrg(owner, 'Invite Co 2');
    const invitee = await signup('Invitee 2');
    const wrong = await signup('Wrong Person');
    const inv = await owner.json('POST', `/api/crm/orgs/${orgId}/invitations`, { email: invitee.email, role: 'member' });
    expect((await wrong.req('POST', `/api/crm/invitations/${tokenOf(inv.inviteUrl)}/accept`, {})).status).toBe(403);
    const again = await owner.json('POST', `/api/crm/orgs/${orgId}/invitations/${inv.id}/resend`, {});
    expect((await invitee.req('POST', `/api/crm/invitations/${tokenOf(inv.inviteUrl)}/accept`, {})).status).toBe(404);
    await invitee.json('POST', `/api/crm/invitations/${tokenOf(again.inviteUrl)}/decline`, {});
    expect((await invitee.req('POST', `/api/crm/invitations/${tokenOf(again.inviteUrl)}/accept`, {})).status).toBe(410);
    expect((await invitee.req('GET', `/api/crm/orgs/${orgId}`)).status).toBe(404);
    const third = await owner.json('POST', `/api/crm/orgs/${orgId}/invitations`, { email: invitee.email, role: 'viewer' });
    await owner.json('DELETE', `/api/crm/orgs/${orgId}/invitations/${third.id}`);
    expect((await invitee.req('POST', `/api/crm/invitations/${tokenOf(third.inviteUrl)}/accept`, {})).status).toBe(410);
  });

  it('only the owner invites administrators; members cannot invite; a member cannot be invited twice', async () => {
    const owner = await signup('Inv Owner 3');
    const orgId = await createOrg(owner);
    const admin = await signup('An Admin');
    const member = await signup('A Member');
    await joinOrg(owner, orgId, admin, 'admin');
    await joinOrg(owner, orgId, member, 'member');
    expect((await member.req('POST', `/api/crm/orgs/${orgId}/invitations`, { email: uniqueEmail(), role: 'member' })).status).toBe(403);
    expect((await admin.req('POST', `/api/crm/orgs/${orgId}/invitations`, { email: uniqueEmail(), role: 'admin' })).status).toBe(201);
    expect((await owner.req('POST', `/api/crm/orgs/${orgId}/invitations`, { email: member.email, role: 'member' })).status).toBe(409);
  });
});

describe('CRM roles and permissions', () => {
  it('viewer is read-only; sales edits only what they own; member cannot delete; manager runs pipelines but not roles', async () => {
    const owner = await signup('Role Owner');
    const orgId = await createOrg(owner);
    const viewer = await signup('Vee Viewer');
    const sales = await signup('Sam Sales');
    const member = await signup('Mem Member');
    const manager = await signup('Man Manager');
    await joinOrg(owner, orgId, viewer, 'viewer');
    await joinOrg(owner, orgId, sales, 'sales');
    await joinOrg(owner, orgId, member, 'member');
    await joinOrg(owner, orgId, manager, 'manager');
    const ownersContact = await owner.json('POST', `/api/crm/orgs/${orgId}/contacts`, { firstName: 'Owned', lastName: 'ByOwner' });
    // viewer
    expect((await viewer.req('POST', `/api/crm/orgs/${orgId}/contacts`, { firstName: 'X' })).status).toBe(403);
    expect((await viewer.req('PATCH', `/api/crm/orgs/${orgId}/contacts/${ownersContact.id}`, { jobTitle: 'X' })).status).toBe(403);
    expect((await viewer.json('GET', `/api/crm/orgs/${orgId}/contacts/${ownersContact.id}`)).can).toEqual({ edit: false, delete: false });
    expect((await viewer.req('POST', `/api/crm/orgs/${orgId}/notes`, { entity: 'contact', recordId: ownersContact.id, body: 'hi' })).status).toBe(403);
    // sales: own record yes, another's no
    const mine = await sales.json('POST', `/api/crm/orgs/${orgId}/contacts`, { firstName: 'Sales', lastName: 'Own' });
    expect(mine.ownerId).toBe(sales.userId);
    expect((await sales.req('PATCH', `/api/crm/orgs/${orgId}/contacts/${mine.id}`, { jobTitle: 'Buyer' })).status).toBe(200);
    expect((await sales.req('PATCH', `/api/crm/orgs/${orgId}/contacts/${ownersContact.id}`, { jobTitle: 'Buyer' })).status).toBe(403);
    expect((await sales.req('DELETE', `/api/crm/orgs/${orgId}/contacts/${ownersContact.id}`)).status).toBe(403);
    expect((await sales.req('DELETE', `/api/crm/orgs/${orgId}/contacts/${mine.id}`)).status).toBe(200);
    expect((await sales.req('GET', `/api/crm/orgs/${orgId}/contacts/export`)).status).toBe(403);
    // member: create and edit own, never delete
    const m = await member.json('POST', `/api/crm/orgs/${orgId}/contacts`, { firstName: 'Member', lastName: 'Own' });
    expect((await member.req('DELETE', `/api/crm/orgs/${orgId}/contacts/${m.id}`)).status).toBe(403);
    // manager: pipelines and others' records, not roles
    expect((await manager.req('PATCH', `/api/crm/orgs/${orgId}/contacts/${ownersContact.id}`, { jobTitle: 'Engineer' })).status).toBe(200);
    expect((await manager.req('POST', `/api/crm/orgs/${orgId}/pipelines`, { name: 'Service renewals', stages: [{ name: 'Due', probability: 50 }] })).status).toBe(201);
    expect((await manager.req('PATCH', `/api/crm/orgs/${orgId}/members/${member.userId}`, { role: 'viewer' })).status).toBe(403);
    expect((await sales.req('POST', `/api/crm/orgs/${orgId}/pipelines`, { name: 'Nope', stages: [{ name: 'A', probability: 1 }] })).status).toBe(403);
    // Bulk actions skip records the person may not change.
    const bulk = await sales.json('POST', `/api/crm/orgs/${orgId}/contacts/bulk`, { ids: [ownersContact.id, m.id], action: 'priority', value: 'high' });
    expect(bulk.updated).toBe(0);
    expect(bulk.skipped).toHaveLength(2);
  });

  it('administrators change roles; only the owner gives the admin role; ownership transfers; the owner cannot leave', async () => {
    const owner = await signup('Transfer Owner');
    const orgId = await createOrg(owner);
    const admin = await signup('Tr Admin');
    const member = await signup('Tr Member');
    await joinOrg(owner, orgId, admin, 'admin');
    await joinOrg(owner, orgId, member, 'member');
    await admin.json('PATCH', `/api/crm/orgs/${orgId}/members/${member.userId}`, { role: 'manager' });
    expect((await member.json('GET', `/api/crm/orgs/${orgId}`)).role).toBe('manager');
    expect((await admin.req('PATCH', `/api/crm/orgs/${orgId}/members/${member.userId}`, { role: 'admin' })).status).toBe(403);
    expect((await admin.req('PATCH', `/api/crm/orgs/${orgId}/members/${admin.userId}`, { role: 'manager' })).status).toBe(403);
    expect((await owner.req('POST', `/api/crm/orgs/${orgId}/leave`, {})).status).toBe(400);
    expect((await admin.req('POST', `/api/crm/orgs/${orgId}/transfer`, { userId: member.userId })).status).toBe(403);
    await owner.json('POST', `/api/crm/orgs/${orgId}/transfer`, { userId: member.userId });
    expect((await member.json('GET', `/api/crm/orgs/${orgId}`)).role).toBe('owner');
    expect((await owner.json('GET', `/api/crm/orgs/${orgId}`)).role).toBe('admin');
    const owners = await env.DB.prepare("SELECT COUNT(*) AS n FROM crm_members WHERE org_id = ? AND role = 'owner'").bind(orgId).first<{ n: number }>();
    expect(owners!.n).toBe(1);
    // The former owner leaves and hands their records over.
    const contact = await owner.json('POST', `/api/crm/orgs/${orgId}/contacts`, { firstName: 'Handed', lastName: 'Over' });
    await owner.json('POST', `/api/crm/orgs/${orgId}/leave`, { reassignTo: member.userId });
    expect((await owner.req('GET', `/api/crm/orgs/${orgId}`)).status).toBe(404);
    expect((await member.json('GET', `/api/crm/orgs/${orgId}/contacts/${contact.id}`)).ownerId).toBe(member.userId);
    // Removing a member takes their access away at once.
    await member.json('DELETE', `/api/crm/orgs/${orgId}/members/${admin.userId}`, {});
    expect((await admin.req('GET', `/api/crm/orgs/${orgId}/contacts`)).status).toBe(404);
    const audit = await member.json('GET', `/api/crm/orgs/${orgId}/audit`);
    expect(audit.map((x: any) => x.action)).toEqual(expect.arrayContaining(['org.created', 'member.joined', 'member.role_changed', 'org.ownership_transferred', 'member.left', 'member.removed']));
  });

  it('permission changes per role and module are enforced on the server: view "own" hides other people\'s records', async () => {
    const owner = await signup('Perm Owner');
    const orgId = await createOrg(owner);
    const sales = await signup('Perm Sales');
    await joinOrg(owner, orgId, sales, 'sales');
    const theirs = await owner.json('POST', `/api/crm/orgs/${orgId}/contacts`, { firstName: 'Secret', lastName: 'Contact' });
    const mine = await sales.json('POST', `/api/crm/orgs/${orgId}/contacts`, { firstName: 'Open', lastName: 'Contact' });
    expect((await sales.json('GET', `/api/crm/orgs/${orgId}/contacts`)).total).toBe(2);
    expect((await sales.req('PUT', `/api/crm/orgs/${orgId}/permissions/sales`, { contacts: { view: 'own' } })).status).toBe(403);
    await owner.json('PUT', `/api/crm/orgs/${orgId}/permissions/sales`, { contacts: { view: 'own', export: true } });
    const list = await sales.json('GET', `/api/crm/orgs/${orgId}/contacts`);
    expect(list.rows.map((r: any) => r.id)).toEqual([mine.id]);
    expect((await sales.req('GET', `/api/crm/orgs/${orgId}/contacts/${theirs.id}`)).status).toBe(404);
    expect((await sales.req('GET', `/api/crm/orgs/${orgId}/timeline/contact/${theirs.id}`)).status).toBe(404);
    const search = await sales.json('GET', `/api/crm/orgs/${orgId}/search?q=contact`);
    expect(search.results.contact.map((r: any) => r.id)).toEqual([mine.id]);
    const csv = await (await sales.req('GET', `/api/crm/orgs/${orgId}/contacts/export`)).text();
    expect(csv).toContain('Open');
    expect(csv).not.toContain('Secret');
    // Invalid permissions are refused; owner and admin cannot be restricted.
    expect((await owner.req('PUT', `/api/crm/orgs/${orgId}/permissions/sales`, { contacts: { view: 'everything' } })).status).toBe(400);
    expect((await owner.req('PUT', `/api/crm/orgs/${orgId}/permissions/admin`, { contacts: { view: 'none' } })).status).toBe(400);
    await owner.json('DELETE', `/api/crm/orgs/${orgId}/permissions/sales`);
    expect((await sales.json('GET', `/api/crm/orgs/${orgId}/contacts`)).total).toBe(2);
  });
});

describe('CRM isolation between organisations', () => {
  it('a member of organisation A cannot reach anything of organisation B, by any address', async () => {
    const a = await signup('Iso A');
    const b = await signup('Iso B');
    const orgA = await createOrg(a, 'A Pty Ltd');
    const orgB = await createOrg(b, 'B Pty Ltd');
    const coB = await b.json('POST', `/api/crm/orgs/${orgB}/companies`, { name: 'B Customer' });
    const ctB = await b.json('POST', `/api/crm/orgs/${orgB}/contacts`, { firstName: 'Bea', lastName: 'Bee', email: 'bea@b.example.com', companyId: coB.id });
    const dealB = await b.json('POST', `/api/crm/orgs/${orgB}/deals`, { title: 'B secret deal', value: 999900, companyId: coB.id });
    const leadB = await b.json('POST', `/api/crm/orgs/${orgB}/leads`, { firstName: 'Lee', companyName: 'Lead Co' });
    const actB = await b.json('POST', `/api/crm/orgs/${orgB}/activities`, { title: 'B call', type: 'call', contactId: ctB.id });
    const noteB = await b.json('POST', `/api/crm/orgs/${orgB}/notes`, { entity: 'contact', recordId: ctB.id, body: 'B private note' });
    const form = new FormData();
    form.set('file', new File(['secret'], 'b.txt', { type: 'text/plain' }));
    form.set('entity', 'contact');
    form.set('recordId', ctB.id);
    const fileB = await (await b.req('POST', `/api/crm/orgs/${orgB}/files`, form)).json<any>();

    // 1. B's organisation itself: 404 for A (its existence is not revealed).
    for (const path of ['', '/members', '/contacts', '/pipelines', '/dashboard', '/reports/revenue', '/automations', '/audit', '/notifications', '/search?q=bea', '/tags', '/custom-fields', '/views']) {
      expect((await a.req('GET', `/api/crm/orgs/${orgB}${path}`)).status, path).toBe(404);
    }
    expect((await a.req('POST', `/api/crm/orgs/${orgB}/contacts`, { firstName: 'Intruder' })).status).toBe(404);
    expect((await a.req('PATCH', `/api/crm/orgs/${orgB}`, { name: 'Taken' })).status).toBe(404);
    // 2. B's records through A's own organisation (id swapping): not found.
    for (const [path, id] of [['contacts', ctB.id], ['companies', coB.id], ['deals', dealB.id], ['leads', leadB.id], ['activities', actB.id]]) {
      expect((await a.req('GET', `/api/crm/orgs/${orgA}/${path}/${id}`)).status, path).toBe(404);
      expect((await a.req('PATCH', `/api/crm/orgs/${orgA}/${path}/${id}`, { priority: 'high' })).status, path).toBe(404);
      expect((await a.req('DELETE', `/api/crm/orgs/${orgA}/${path}/${id}`)).status, path).toBe(404);
    }
    expect((await a.req('GET', `/api/crm/orgs/${orgA}/timeline/contact/${ctB.id}`)).status).toBe(404);
    expect((await a.req('GET', `/api/crm/orgs/${orgA}/files/${fileB.id}`)).status).toBe(404);
    expect((await a.req('DELETE', `/api/crm/orgs/${orgA}/notes/${noteB.id}`)).status).toBe(404);
    expect((await a.req('GET', `/api/crm/orgs/${orgA}/notes?entity=contact&recordId=${ctB.id}`)).status).toBe(404);
    expect((await a.req('POST', `/api/crm/orgs/${orgA}/deals/${dealB.id}/move`, { stageId: 'x' })).status).toBe(404);
    expect((await a.req('POST', `/api/crm/orgs/${orgA}/leads/${leadB.id}/convert`, { contact: { mode: 'create' }, company: { mode: 'none' }, deal: { create: false } })).status).toBe(404);
    // 3. Linking A's records to B's: refused (and the database would refuse it too).
    expect((await a.req('POST', `/api/crm/orgs/${orgA}/contacts`, { firstName: 'Link', companyId: coB.id })).status).toBe(400);
    expect((await a.req('POST', `/api/crm/orgs/${orgA}/activities`, { title: 'x', dealId: dealB.id })).status).toBe(400);
    const pipesB = await b.json('GET', `/api/crm/orgs/${orgB}/pipelines`);
    expect((await a.req('POST', `/api/crm/orgs/${orgA}/deals`, { title: 'x', stageId: pipesB[0].stages[0].id })).status).toBe(400);
    await expect(
      env.DB.prepare("INSERT INTO crm_contacts (id, org_id, company_id, created_at, updated_at) VALUES ('forged', ?, ?, 1, 1)").bind(orgA, coB.id).run(),
    ).rejects.toThrow(/FOREIGN KEY/);
    // 4. Lists, search, reports and filters in A never show B's data.
    expect((await a.json('GET', `/api/crm/orgs/${orgA}/contacts?${q({ filters: [{ field: 'companyId', op: 'in', value: [coB.id] }] })}`)).total).toBe(0);
    const search = await a.json('GET', `/api/crm/orgs/${orgA}/search?q=bea`);
    expect(Object.values(search.results).flat()).toHaveLength(0);
    const dash = await a.json('GET', `/api/crm/orgs/${orgA}/dashboard`);
    expect(dash.kpis.totalContacts).toBe(0);
    expect(dash.kpis.pipelineValue).toBe(0);
    // 5. A cannot accept B's members' roles, read B's invitations or change B's automations.
    expect((await a.req('GET', `/api/crm/orgs/${orgB}/invitations`)).status).toBe(404);
    const autoB = (await b.json('GET', `/api/crm/orgs/${orgB}/automations`)).automations[0];
    expect((await a.req('POST', `/api/crm/orgs/${orgA}/automations/${autoB.id}/enabled`, { enabled: false })).status).toBe(404);
    // B still has everything.
    expect((await b.json('GET', `/api/crm/orgs/${orgB}/contacts/${ctB.id}`)).email).toBe('bea@b.example.com');
  });

  it('a deleted organisation is gone for every member, and its pending invitations stop working', async () => {
    const a = await signup('Del Owner');
    const orgId = await createOrg(a, 'Short Lived');
    const other = await signup('Del Member');
    await joinOrg(a, orgId, other, 'admin');
    const inv = await a.json('POST', `/api/crm/orgs/${orgId}/invitations`, { email: uniqueEmail(), role: 'member' });
    expect((await other.req('DELETE', `/api/crm/orgs/${orgId}`, { confirmName: 'Short Lived' })).status).toBe(403);
    expect((await a.req('DELETE', `/api/crm/orgs/${orgId}`, { confirmName: 'Wrong' })).status).toBe(400);
    await a.json('DELETE', `/api/crm/orgs/${orgId}`, { confirmName: 'Short Lived' });
    expect((await a.req('GET', `/api/crm/orgs/${orgId}`)).status).toBe(404);
    expect((await other.req('GET', `/api/crm/orgs/${orgId}/contacts`)).status).toBe(404);
    expect((await raw('GET', `/api/crm-public/invitations/${tokenOf(inv.inviteUrl)}`)).status).toBe(404);
  });
});
