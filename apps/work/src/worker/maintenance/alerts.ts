// Maintenance alerts: people are told in BIZOMAT ERP (erp_alerts, the ERP's alerts bell) when something needs them.
//
//   a request raised (waiting for approval, or new when approval is off)  every supervisor and administrator
//   information given on a request that asked for it                      the supervisor who asked, else every
//                                                                          supervisor and administrator
//   a request approved, declined, asked for more information, made into
//   or added to a work order, or done (its work order completed)          the person who raised it
//   a work order given to a technician (made, from a request, changed,     that technician
//   or an inspection round made)
//   a request withdrawn while it waited for a decision or for more         the supervisor who last decided on it, else
//   information                                                            every supervisor and administrator
//
// The person acting is never alerted, and every recipient is checked against the company's people when the alert is
// sent: only active members with access to Maintenance there (never a suspended member, nor, while the members work
// acts for the company, one whose Maintenance access is off). Email copies go only while the flag maintenance_email_alerts is on (it ships off) and email is set up on this
// service, and never from the example company. No email carries an approve or decline action: it opens the record,
// after sign-in, where the person's own access applies. An alert is sent after its record is saved and never fails or
// undoes it: any error is swallowed (and logged without content).

import type { Context } from 'hono';
import type { AppEnv, Env } from '../env';
import { alert } from '../erp/objects/alerts';
import { flagOn } from '../platform/flags';
import { membersV2 } from '../company/members-access';
import { atLeast, companyPeople, type MtAccess } from './access';

export const MT_EMAIL_FLAG = 'maintenance_email_alerts';

export type MtAlertKind = 'approval' | 'request' | 'decision' | 'info' | 'work_order' | 'assigned' | 'completed';

export interface MtAlert {
  to: (string | null | undefined)[];
  /** Also every supervisor and administrator (and only them). */
  managers?: boolean;
  /** Only the supervisors and administrators in `to`; when none of them is one any more, every one instead. */
  orManagers?: boolean;
  kind: MtAlertKind;
  title: string;
  body?: string;
  link: string;
  recordId: string;
  dedupe: string;
}

export const requestLink = (companyId: string, id: string) => `/c/${companyId}/maintenance/requests/${id}`;
export const workOrderLink = (companyId: string, id: string) => `/c/${companyId}/maintenance/work-orders/${id}`;

const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const uniq = (xs: (string | null | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))];

type Sender = Pick<MtAccess, 'companyId' | 'kind' | 'companyName' | 'userId'>;

/**
 * The company's people who may be alerted about Maintenance: in a registered company, a member suspended there is left
 * out, and so is one whose Maintenance access is off while the members work (company_members_v2) acts for the company
 * (its owner and administrators always have it, as members-access.ts gives them).
 */
async function alertablePeople(db: D1Database, a: Sender) {
  const people = await companyPeople(db, a);
  if (a.kind !== 'registered' || !people.length) return people;
  const v2 = await membersV2(db, a.companyId);
  const rows = await db
    .prepare(
      `SELECT m.user_id, m.role, m.status, (SELECT x.access FROM co_member_access x WHERE x.company_id = m.company_id AND x.user_id = m.user_id AND x.module = 'maintenance') AS mt_access
         FROM co_members m WHERE m.company_id = ?`,
    )
    .bind(a.companyId)
    .all<{ user_id: string; role: string; status: string | null; mt_access: number | null }>();
  const left = new Set(rows.results.filter((r) => r.status === 'suspended' || (v2 && r.role !== 'owner' && r.role !== 'admin' && r.mt_access === 0)).map((r) => r.user_id));
  return people.filter((p) => !left.has(p.id));
}

/** Sends one alert; the number of people alerted (0 when nobody is left, or on any error). */
export async function sendMtAlert(env: Env, a: Sender, n: MtAlert, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  try {
    const people = await alertablePeople(env.DB, a);
    const everyone = new Set(people.map((p) => p.id));
    const managers = people.filter((p) => atLeast(p, 'supervisor')).map((p) => p.id);
    const onlyManagers = n.managers || n.orManagers;
    let to = uniq(n.to).filter((id) => (onlyManagers ? managers.includes(id) : everyone.has(id)));
    if (n.managers || (n.orManagers && !to.length)) to = uniq([...to, ...managers]);
    to = to.filter((id) => id !== a.userId);
    if (!to.length) return 0;
    const email = a.kind !== 'demo' && (await flagOn(env.DB, MT_EMAIL_FLAG, { companyId: a.companyId }).catch(() => false));
    return await alert(
      env,
      { companyId: a.companyId, kind: a.kind, companyName: a.companyName },
      { userIds: to, kind: n.kind, title: n.title.slice(0, 300), body: (n.body ?? '').slice(0, 1000), link: n.link, recordId: n.recordId, dedupe: `mt:${n.dedupe}`, email },
      waitUntil,
    );
  } catch (e) {
    console.error('maintenance alert not sent', (e as Error)?.name ?? 'Error');
    return 0;
  }
}

const waiter = (c: Context<AppEnv>) => (p: Promise<unknown>) => {
  try {
    c.executionCtx.waitUntil(p);
  } catch {
    void p;
  }
};

/** An alert from a request: in the app now, its email (when on) after the answer. */
export const mtAlert = (c: Context<AppEnv>, a: Sender, n: MtAlert) => sendMtAlert(c.env, a, n, waiter(c));

// ------------------------------------------------------------------ the events

interface RequestRow {
  id: string;
  number: string;
  status?: string;
  description?: string;
  asset_number?: string | null;
  asset_name?: string | null;
  requested_by?: string | null;
  decided_by?: string | null;
}

interface WorkOrderRow {
  id: string;
  number: string;
  assigned_to?: string | null;
  asset_number?: string | null;
  asset_name?: string | null;
  description?: string;
  due_finish?: string | null;
}

/** A new request: waiting for approval, or (approval off) submitted. */
export function alertRequestRaised(c: Context<AppEnv>, a: Sender, r: RequestRow, t: number) {
  const awaiting = r.status === 'awaiting_approval';
  return mtAlert(c, a, {
    to: [],
    managers: true,
    kind: awaiting ? 'approval' : 'request',
    title: awaiting ? `Request ${r.number} is waiting for your approval` : `New request ${r.number}`,
    body: cut(`${r.asset_number ? `${r.asset_number} ${r.asset_name ?? ''}: ` : ''}${r.description ?? ''}`, 300),
    link: requestLink(a.companyId, r.id),
    recordId: r.id,
    dedupe: `req:${r.id}:raised:${r.status}:${t}`,
  });
}

/** The requester answered a request for more information: it goes back to whoever asked. */
export function alertInfoGiven(c: Context<AppEnv>, a: Sender, r: RequestRow, comment: string, to: string, t: number) {
  return mtAlert(c, a, {
    to: [r.decided_by],
    orManagers: true,
    kind: to === 'awaiting_approval' ? 'approval' : 'request',
    title: `Request ${r.number} has the information you asked for`,
    body: cut(comment, 300),
    link: requestLink(a.companyId, r.id),
    recordId: r.id,
    dedupe: `req:${r.id}:info_given:${t}`,
  });
}

/** A supervisor's decision on a request, to the person who raised it. */
export function alertRequestDecided(c: Context<AppEnv>, a: Sender, r: RequestRow, what: 'approved' | 'declined' | 'info_requested', text: string, t: number) {
  const title = what === 'approved' ? `Your request ${r.number} was approved` : what === 'declined' ? `Your request ${r.number} was declined` : `More information is needed on your request ${r.number}`;
  return mtAlert(c, a, {
    to: [r.requested_by],
    kind: what === 'info_requested' ? 'info' : 'decision',
    title,
    body: cut(what === 'declined' ? `Reason: ${text}` : text, 300),
    link: requestLink(a.companyId, r.id),
    recordId: r.id,
    dedupe: `req:${r.id}:${what}:${t}`,
  });
}

/** The statuses in which a withdrawal is news to a supervisor: the request was still waiting for one of them. */
const WITHDRAWN_ALERTED = ['submitted', 'awaiting_approval', 'info_requested'];

/**
 * The person who raised a request withdrew it: the supervisor who last decided on it (asked for more information, say),
 * else every supervisor and administrator, so an earlier "waiting for your approval" is not left to act on. Only while
 * it was submitted, awaiting approval or waiting for information; `r` is the request as it was before the withdrawal.
 */
export function alertRequestWithdrawn(c: Context<AppEnv>, a: Sender, r: RequestRow, reason: string, t: number) {
  if (!WITHDRAWN_ALERTED.includes(r.status ?? '')) return Promise.resolve(0);
  return mtAlert(c, a, {
    to: [r.decided_by],
    orManagers: true,
    kind: 'request',
    title: `Request ${r.number} was withdrawn`,
    body: cut(reason, 300),
    link: requestLink(a.companyId, r.id),
    recordId: r.id,
    dedupe: `req:${r.id}:withdrawn:${t}`,
  });
}

/** The request was made into, or added to, a work order. */
export function alertRequestOnWorkOrder(c: Context<AppEnv>, a: Sender, r: RequestRow, wo: { id: string; number: string }, how: 'converted' | 'attached') {
  return mtAlert(c, a, {
    to: [r.requested_by],
    kind: 'work_order',
    title: how === 'converted' ? `Work order ${wo.number} was made from your request ${r.number}` : `Your request ${r.number} was added to work order ${wo.number}`,
    link: requestLink(a.companyId, r.id),
    recordId: r.id,
    dedupe: `req:${r.id}:wo:${wo.id}`,
  });
}

/** A work order given to a technician. */
export function alertWorkOrderAssigned(c: Context<AppEnv>, a: Sender, w: WorkOrderRow, t: number) {
  if (!w.assigned_to) return Promise.resolve(0);
  return mtAlert(c, a, {
    to: [w.assigned_to],
    kind: 'assigned',
    title: `Work order ${w.number} was given to you`,
    body: cut(`${w.asset_number ?? ''} ${w.asset_name ?? ''}: ${w.description ?? ''}${w.due_finish ? ` Due ${w.due_finish}.` : ''}`.trim(), 300),
    link: workOrderLink(a.companyId, w.id),
    recordId: w.id,
    dedupe: `wo:${w.id}:assigned:${w.assigned_to}:${t}`,
  });
}

/** The requests a completed work order was made from are done. */
export async function alertRequestsCompleted(c: Context<AppEnv>, a: Sender, w: { number: string }, linked: RequestRow[], t: number) {
  let n = 0;
  for (const r of linked) {
    n += await mtAlert(c, a, {
      to: [r.requested_by],
      kind: 'completed',
      title: `Your request ${r.number} is done`,
      body: `Work order ${w.number} was completed.`,
      link: requestLink(a.companyId, r.id),
      recordId: r.id,
      dedupe: `req:${r.id}:completed:${t}`,
    });
  }
  return n;
}
