// The CRM automation engine: Trigger -> Conditions -> Actions.
//
// Event triggers run right after the change that causes them (dispatch, from the route, in waitUntil); scheduled ones
// (overdue activities, deals close to their expected close date) run in the app's existing 15-minute maintenance run
// (runCrmScheduled, called from src/worker/index.ts). No extra process or service is needed.
//
// Every execution writes one crm_automation_runs row keyed by a unique event_key, so the same event never runs the same
// automation twice, even when a schedule is replayed. Actions an automation takes may cause one more level of
// triggers (a created follow-up notifies its assignee), never more.

import type { Env } from '../env';
import { newId, now, parseJson, placeholders } from '../lib/util';
import { TRIGGERS, type AutomationAction, type AutomationCondition, type TriggerConfig, type TriggerType } from '../../shared/crm/automations';
import { orgSettings, type OrgSettings } from '../../shared/crm/defaults';
import { formatMoney } from '../../shared/crm/money';
import { crmNotify, membersWithRoles, type CrmNotificationType } from './notify';
import { addDays, eventStmt, fullName, recordLink, todayIn } from './util';

export interface AutoCtx {
  orgId: string;
  orgName: string;
  settings: OrgSettings;
  currency: string;
  timezone: string;
  actorId: string | null;
  actorName: string | null;
  depth?: number;
}

export function autoCtxFromAccess(a: { orgId: string; org: { name: string; currency: string; timezone: string }; settings: OrgSettings; userId: string; userName: string }): AutoCtx {
  return { orgId: a.orgId, orgName: a.org.name, settings: a.settings, currency: a.org.currency, timezone: a.org.timezone, actorId: a.userId, actorName: a.userName };
}

interface AutomationRow {
  id: string;
  org_id: string;
  name: string;
  trigger_type: TriggerType;
  trigger_json: string;
  conditions_json: string;
  actions_json: string;
}

type Entity = 'lead' | 'contact' | 'deal' | 'activity';

const camelToSnake = (k: string) => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

export function conditionsMatch(conds: AutomationCondition[], row: Record<string, unknown>): boolean {
  return conds.every((c) => {
    const v = row[camelToSnake(c.field)];
    switch (c.op) {
      case 'eq':
        return String(v ?? '') === String(c.value ?? '');
      case 'neq':
        return String(v ?? '') !== String(c.value ?? '');
      case 'gte':
        return Number(v ?? 0) >= Number(c.value);
      case 'lte':
        return Number(v ?? 0) <= Number(c.value);
      case 'in':
        return Array.isArray(c.value) && c.value.map(String).includes(String(v ?? ''));
      case 'contains':
        return String(v ?? '').toLowerCase().includes(String(c.value ?? '').toLowerCase());
      case 'empty':
        return v === null || v === undefined || v === '';
      case 'not_empty':
        return !(v === null || v === undefined || v === '');
      default:
        return false;
    }
  });
}

export interface TriggerExtra {
  /** Unique for the event (with the automation id it forms the run's event_key). */
  eventKey: string;
  toStageId?: string;
  stageName?: string;
  outcome?: 'won' | 'lost';
}

function triggerMatches(trigger: TriggerType, config: TriggerConfig, row: Record<string, any>, extra: TriggerExtra): boolean {
  if (trigger === 'deal.stage_changed') {
    if (config.pipelineId && row.pipeline_id !== config.pipelineId) return false;
    if (config.stageId && extra.toStageId !== config.stageId) return false;
  }
  if (trigger === 'deal.closed' && config.outcome && config.outcome !== 'any' && extra.outcome !== config.outcome) return false;
  return true;
}

function nameOf(entity: Entity, row: Record<string, any>): string {
  if (entity === 'deal' || entity === 'activity') return row.title || '(no title)';
  return fullName(row.first_name, row.last_name) || row.company_name || row.email || '(no name)';
}

function fill(template: string, entity: Entity, row: Record<string, any>, ctx: AutoCtx, extra: TriggerExtra): string {
  const vals: Record<string, string> = {
    record: nameOf(entity, row),
    value: entity === 'deal' ? formatMoney(row.value ?? 0, ctx.currency) : entity === 'lead' && row.estimated_value ? formatMoney(row.estimated_value, ctx.currency) : '',
    stage: extra.stageName ?? row.stage_name ?? '',
    actor: ctx.actorName ?? 'An automation',
    outcome: extra.outcome ?? row.status ?? '',
    closeDate: row.expected_close_date ?? '',
  };
  return template.replace(/\{(record|value|stage|actor|outcome|closeDate)\}/g, (_m, k: string) => vals[k] ?? '').slice(0, 300);
}

const NOTIFY_TYPE: Partial<Record<TriggerType, CrmNotificationType>> = {
  'lead.assigned': 'assignment',
  'activity.assigned': 'task',
  'activity.overdue': 'overdue',
  'deal.closing_soon': 'due',
  'deal.stage_changed': 'deal',
  'deal.closed': 'won_lost',
};

async function recipients(db: D1Database, ctx: AutoCtx, entity: Entity, row: Record<string, any>, to: string, userIds: string[] = []): Promise<string[]> {
  const ownerish = entity === 'activity' ? row.assigned_to : row.owner_id;
  switch (to) {
    case 'owner':
    case 'assignee':
      return ownerish ? [ownerish] : [];
    case 'actor':
      return ctx.actorId ? [ctx.actorId] : [];
    case 'managers':
      return membersWithRoles(db, ctx.orgId, ['owner', 'admin', 'manager']);
    case 'admins':
      return membersWithRoles(db, ctx.orgId, ['owner', 'admin']);
    case 'everyone':
      return membersWithRoles(db, ctx.orgId, ['owner', 'admin', 'manager', 'sales', 'member', 'viewer']);
    case 'users':
      return userIds.slice(0, 50);
    default:
      return [];
  }
}

const TABLE: Record<Entity, string> = { lead: 'crm_leads', contact: 'crm_contacts', deal: 'crm_deals', activity: 'crm_activities' };

async function executeAction(env: Env, ctx: AutoCtx, auto: AutomationRow, entity: Entity, row: Record<string, any>, action: AutomationAction, extra: TriggerExtra, waitUntil?: (p: Promise<unknown>) => void): Promise<string> {
  const db = env.DB;
  const t = now();
  const link = recordLink(ctx.orgId, entity, row.id);
  switch (action.type) {
    case 'notify': {
      const ids = await recipients(db, ctx, entity, row, action.to, action.userIds);
      const title = fill(action.message || `${auto.name}: {record}`, entity, row, ctx, extra);
      const n = await crmNotify(
        env,
        {
          orgId: ctx.orgId,
          orgName: ctx.orgName,
          userIds: ids,
          type: NOTIFY_TYPE[auto.trigger_type] ?? 'automation',
          title,
          body: `Automation: ${auto.name}`,
          link,
          entityType: entity,
          entityId: row.id,
          actorId: ctx.actorId,
          // Scheduled reminders and explicit choices reach the actor too; changes people make themselves do not.
          includeActor: action.to === 'actor' || action.to === 'users' || !ctx.actorId,
          dedupeKey: `auto:${auto.id}:${extra.eventKey}`,
        },
        waitUntil,
      );
      return `notified ${n}`;
    }
    case 'create_activity': {
      if (entity === 'activity') return 'skipped (activities cannot create activities)';
      const assignee = action.assignTo === 'owner' ? (row.owner_id ?? ctx.actorId) : action.assignTo === 'actor' ? ctx.actorId : (action.userId ?? null);
      if (assignee) {
        const m = await db.prepare('SELECT 1 FROM crm_members WHERE org_id = ? AND user_id = ?').bind(ctx.orgId, assignee).first();
        if (!m) return 'skipped (the assignee is not a member)';
      }
      const type = ctx.settings.activityTypes.some((x) => x.key === action.activityType) ? action.activityType : 'follow_up';
      const due = addDays(todayIn(ctx.timezone), Math.max(0, Math.min(365, Math.round(action.dueInDays || 0))));
      const id = newId();
      const refs = {
        contact_id: entity === 'contact' ? row.id : null,
        company_id: entity === 'deal' ? (row.company_id ?? null) : entity === 'contact' ? (row.company_id ?? null) : null,
        deal_id: entity === 'deal' ? row.id : null,
        lead_id: entity === 'lead' ? row.id : null,
      };
      const title = fill(action.title, entity, row, ctx, extra).slice(0, 200) || 'Follow up';
      await db.batch([
        db
          .prepare(
            `INSERT INTO crm_activities (id, org_id, type, title, assigned_to, due_date, priority, status, contact_id, company_id, deal_id, lead_id, search_text, created_by, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, NULL, ?, ?)`,
          )
          .bind(id, ctx.orgId, type, title, assignee, due, action.priority && ['low', 'medium', 'high', 'urgent'].includes(action.priority) ? action.priority : 'medium', refs.contact_id, refs.company_id, refs.deal_id, refs.lead_id, title.toLowerCase(), t, t),
        eventStmt(db, { orgId: ctx.orgId, type: 'automation', actorId: null, refs: { contactId: refs.contact_id, dealId: refs.deal_id, leadId: refs.lead_id }, summary: `Automation "${auto.name}" scheduled: ${title} (due ${due})` }),
      ]);
      if ((ctx.depth ?? 0) < 1 && assignee) {
        const act = await db.prepare('SELECT * FROM crm_activities WHERE id = ?').bind(id).first<any>();
        if (act) await dispatch(env, { ...ctx, depth: (ctx.depth ?? 0) + 1 }, 'activity.assigned', 'activity', act, { eventKey: `assigned:${id}:${assignee}` }, waitUntil);
      }
      return `created activity ${id}`;
    }
    case 'set_priority': {
      if (!['low', 'medium', 'high', 'urgent'].includes(action.priority)) return 'skipped (unknown priority)';
      await db.prepare(`UPDATE ${TABLE[entity]} SET priority = ?, updated_at = ? WHERE org_id = ? AND id = ?`).bind(action.priority, t, ctx.orgId, row.id).run();
      return `priority ${action.priority}`;
    }
    case 'flag_deal': {
      if (entity !== 'deal') return 'skipped (only deals can be flagged)';
      await db.batch([
        db.prepare('UPDATE crm_deals SET flagged = 1, flag_reason = ?, updated_at = ? WHERE org_id = ? AND id = ?').bind((action.reason ?? 'Flagged by an automation').slice(0, 200), t, ctx.orgId, row.id),
        eventStmt(db, { orgId: ctx.orgId, type: 'flagged', actorId: null, refs: { dealId: row.id }, summary: `Flagged by "${auto.name}": ${action.reason ?? ''}`.trim() }),
      ]);
      return 'flagged';
    }
    case 'assign_owner': {
      if (entity === 'activity') return 'skipped';
      const m = await db.prepare('SELECT u.name FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND m.user_id = ?').bind(ctx.orgId, action.userId).first<{ name: string }>();
      if (!m) return 'skipped (that person is not a member)';
      if (row.owner_id === action.userId) return 'already the owner';
      await db.batch([
        db.prepare(`UPDATE ${TABLE[entity]} SET owner_id = ?, updated_at = ? WHERE org_id = ? AND id = ?`).bind(action.userId, t, ctx.orgId, row.id),
        eventStmt(db, { orgId: ctx.orgId, type: 'assigned', actorId: null, refs: { [`${entity}Id`]: row.id }, summary: `Assigned to ${m.name} by "${auto.name}"` }),
      ]);
      if (entity === 'lead' && (ctx.depth ?? 0) < 1) {
        await dispatch(env, { ...ctx, depth: (ctx.depth ?? 0) + 1 }, 'lead.assigned', 'lead', { ...row, owner_id: action.userId }, { eventKey: `assigned:${row.id}:${action.userId}:${t}` }, waitUntil);
      }
      return `assigned to ${m.name}`;
    }
  }
}

/** Run the organisation's enabled automations for one event. Never throws: failures are recorded on the run. */
export async function dispatch(env: Env, ctx: AutoCtx, trigger: TriggerType, entity: Entity, row: Record<string, any>, extra: TriggerExtra, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  if ((ctx.depth ?? 0) > 1) return 0;
  const db = env.DB;
  let ran = 0;
  try {
    const autos = await db.prepare('SELECT * FROM crm_automations WHERE org_id = ? AND enabled = 1 AND trigger_type = ?').bind(ctx.orgId, trigger).all<AutomationRow>();
    for (const auto of autos.results) {
      const config = parseJson<TriggerConfig>(auto.trigger_json, {});
      if (!triggerMatches(trigger, config, row, extra)) continue;
      const conds = parseJson<AutomationCondition[]>(auto.conditions_json, []);
      if (!conditionsMatch(conds, row)) continue;
      const runId = newId();
      const claim = await db
        .prepare("INSERT OR IGNORE INTO crm_automation_runs (id, org_id, automation_id, event_key, trigger_type, entity_type, entity_id, status, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'success', '', ?)")
        .bind(runId, ctx.orgId, auto.id, `${auto.id}:${extra.eventKey}`.slice(0, 400), trigger, entity, row.id, now())
        .run();
      if (!claim.meta.changes) continue; // this event already ran this automation
      const details: string[] = [];
      let failed = false;
      for (const action of parseJson<AutomationAction[]>(auto.actions_json, []).slice(0, 10)) {
        try {
          details.push(await executeAction(env, ctx, auto, entity, row, action, extra, waitUntil));
        } catch (e) {
          failed = true;
          details.push(`${action.type} failed: ${e instanceof Error ? e.message.slice(0, 200) : 'error'}`);
        }
      }
      await db.batch([
        db.prepare('UPDATE crm_automation_runs SET status = ?, detail = ? WHERE id = ?').bind(failed ? 'failed' : 'success', details.join('; ').slice(0, 1000), runId),
        db.prepare('UPDATE crm_automations SET run_count = run_count + 1, last_run_at = ? WHERE id = ?').bind(now(), auto.id),
      ]);
      ran++;
    }
  } catch (e) {
    console.error('crm automation dispatch failed', e);
  }
  return ran;
}

/** Fire-and-forget from a route: the response does not wait for automations. */
export function dispatchLater(c: { env: Env; executionCtx: { waitUntil(p: Promise<unknown>): void } }, ctx: AutoCtx, trigger: TriggerType, entity: Entity, row: Record<string, any>, extra: TriggerExtra) {
  const waitUntil = (p: Promise<unknown>) => {
    try {
      c.executionCtx.waitUntil(p);
    } catch {
      void p.catch(() => {});
    }
  };
  waitUntil(dispatch(c.env, ctx, trigger, entity, row, extra, waitUntil));
}

/**
 * Scheduled triggers, from the maintenance run (every 15 minutes). Bounded work per run: at most 1,000 automations and
 * 300 records each. Each event fires once (event_key), however often this runs.
 */
export async function runCrmScheduled(env: Env, at = now(), waitUntil?: (p: Promise<unknown>) => void) {
  const db = env.DB;
  const scheduled = (Object.keys(TRIGGERS) as TriggerType[]).filter((k) => TRIGGERS[k].scheduled);
  const autos = await db
    .prepare(
      `SELECT a.*, o.name AS org_name, o.settings_json, o.currency, o.timezone FROM crm_automations a JOIN crm_orgs o ON o.id = a.org_id
       WHERE a.enabled = 1 AND o.deleted_at IS NULL AND a.trigger_type IN (${placeholders(scheduled.length)}) ORDER BY a.org_id LIMIT 1000`,
    )
    .bind(...scheduled)
    .all<AutomationRow & { org_name: string; settings_json: string; currency: string; timezone: string }>();
  let fired = 0;
  for (const auto of autos.results) {
    const ctx: AutoCtx = { orgId: auto.org_id, orgName: auto.org_name, settings: orgSettings(parseJson(auto.settings_json, {})), currency: auto.currency, timezone: auto.timezone, actorId: null, actorName: null };
    const today = todayIn(auto.timezone, at);
    if (auto.trigger_type === 'activity.overdue') {
      const rows = await db
        .prepare("SELECT * FROM crm_activities WHERE org_id = ? AND status = 'open' AND deleted_at IS NULL AND due_date IS NOT NULL AND due_date < ? ORDER BY due_date DESC LIMIT 300")
        .bind(auto.org_id, today)
        .all<any>();
      for (const r of rows.results) fired += await dispatchOne(env, ctx, auto, 'activity', r, { eventKey: `overdue:${r.id}:${r.due_date}` }, waitUntil);
    } else if (auto.trigger_type === 'deal.closing_soon') {
      const daysAhead = Math.max(0, Math.min(365, Math.round(parseJson<TriggerConfig>(auto.trigger_json, {}).days ?? ctx.settings.closingSoonDays)));
      const rows = await db
        .prepare("SELECT d.*, s.name AS stage_name FROM crm_deals d LEFT JOIN crm_stages s ON s.id = d.stage_id WHERE d.org_id = ? AND d.status = 'open' AND d.deleted_at IS NULL AND d.archived_at IS NULL AND d.expected_close_date BETWEEN ? AND ? LIMIT 300")
        .bind(auto.org_id, today, addDays(today, daysAhead))
        .all<any>();
      for (const r of rows.results) fired += await dispatchOne(env, ctx, auto, 'deal', r, { eventKey: `closing:${r.id}:${r.expected_close_date}:${daysAhead}` }, waitUntil);
    }
  }
  return { automations: autos.results.length, fired };
}

/** Run one automation for one record (scheduled triggers check each automation separately). */
async function dispatchOne(env: Env, ctx: AutoCtx, auto: AutomationRow, entity: Entity, row: Record<string, any>, extra: TriggerExtra, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  const db = env.DB;
  if (!conditionsMatch(parseJson<AutomationCondition[]>(auto.conditions_json, []), row)) return 0;
  const runId = newId();
  const claim = await db
    .prepare("INSERT OR IGNORE INTO crm_automation_runs (id, org_id, automation_id, event_key, trigger_type, entity_type, entity_id, status, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'success', '', ?)")
    .bind(runId, ctx.orgId, auto.id, `${auto.id}:${extra.eventKey}`.slice(0, 400), auto.trigger_type, entity, row.id, now())
    .run();
  if (!claim.meta.changes) return 0;
  const details: string[] = [];
  let failed = false;
  for (const action of parseJson<AutomationAction[]>(auto.actions_json, []).slice(0, 10)) {
    try {
      details.push(await executeAction(env, ctx, auto, entity, row, action, extra, waitUntil));
    } catch (e) {
      failed = true;
      details.push(`${action.type} failed: ${e instanceof Error ? e.message.slice(0, 200) : 'error'}`);
    }
  }
  await db.batch([
    db.prepare('UPDATE crm_automation_runs SET status = ?, detail = ? WHERE id = ?').bind(failed ? 'failed' : 'success', details.join('; ').slice(0, 1000), runId),
    db.prepare('UPDATE crm_automations SET run_count = run_count + 1, last_run_at = ? WHERE id = ?').bind(now(), auto.id),
  ]);
  return 1;
}
