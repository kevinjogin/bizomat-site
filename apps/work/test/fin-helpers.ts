// Helpers for the BIZOMAT Finance suites: workspaces, invitations and the chart of accounts.
import type { Client } from './helpers';

export async function createWs(c: Client, kind: 'personal' | 'household' | 'business' = 'business', extra: Record<string, unknown> = {}): Promise<string> {
  const r = await c.json('POST', '/api/fin/orgs', { name: `${kind} books`, kind, currency: 'AUD', timezone: 'Australia/Sydney', ...extra });
  return r.id as string;
}

/** Invite `invitee` into `orgId` with a role and accept with the token from the link. */
export async function joinWs(owner: Client, orgId: string, invitee: Client, role: 'admin' | 'accountant' | 'finance_manager' | 'contributor' | 'viewer' = 'contributor') {
  const inv = await owner.json('POST', `/api/fin/orgs/${orgId}/invitations`, { email: invitee.email, role });
  const token = decodeURIComponent(inv.inviteUrl.split('/join/')[1]);
  await invitee.json('POST', `/api/fin/invitations/${token}/accept`, {});
  return inv;
}

export async function accounts(c: Client, org: string): Promise<any[]> {
  return c.json('GET', `/api/fin/orgs/${org}/accounts`);
}

export function byCode(list: any[], code: string): string {
  const a = list.find((x) => x.code === code);
  if (!a) throw new Error(`no account ${code}`);
  return a.id;
}

export async function taxCodes(c: Client, org: string): Promise<Record<string, string>> {
  const list = await c.json('GET', `/api/fin/orgs/${org}/tax-codes`);
  return Object.fromEntries(list.map((t: any) => [t.code, t.id]));
}

export const fin = (org: string, path = '') => `/api/fin/orgs/${org}${path}`;

/** A report's rows as a map of first cell to the remaining cells. */
export function rowMap(report: any): Map<string, any[]> {
  return new Map(report.rows.map((r: any) => [String(r.cells[0]), r.cells.slice(1)]));
}
