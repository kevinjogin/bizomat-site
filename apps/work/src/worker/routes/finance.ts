// Finance settings and summaries. Existing amounts are never changed here: choosing a currency only states what the
// stored numbers mean, and it is an administrator's explicit decision (docs/architecture/financial-system.md).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { badRequest, body, clientIp, notFound, now, parseJson } from '../lib/util';
import { auditEventStmt, auditStmt } from '../services/audit';
import { columnDTO, groupDTO, itemDTO, type ColumnRow, type GroupRow } from '../services/mappers';
import { financePolicy, requireProject } from '../services/access';
import { requireWorkspace, type ItemRow } from '../services/permissions';
import { CURRENCIES, isSupportedCurrency } from '../../shared/money';
import { FINANCE_ROLES, FINANCE_ROLE_LABELS, sanitizeColumnSettings } from '../../shared/columns';
import { resolveColumnCurrency, summariseFinance } from '../../shared/finance';
import { isFinancialColumn } from '../../shared/permissions';
import { broadcast } from '../realtime/board-room';

export const financeRoutes = new Hono<AppEnv>();

financeRoutes.get('/finance/currencies', (c) => c.json(CURRENCIES));

/** The organisation's finance settings and every financial column with where its currency comes from. */
financeRoutes.get('/workspaces/:ws/finance', async (c) => {
  const wsId = c.req.param('ws');
  const role = await requireWorkspace(c.env.DB, wsId, c.get('user').id);
  const policy = await financePolicy(c.env.DB, wsId);
  const out: Record<string, unknown> = { defaultCurrency: policy.defaultCurrency, visibility: policy.visibility, enabledFields: policy.enabledFields, currencies: CURRENCIES, roles: FINANCE_ROLES.map((r) => ({ id: r, label: FINANCE_ROLE_LABELS[r] })) };
  if (role === 'owner' || role === 'admin') {
    const cols = await c.env.DB.prepare(
      `SELECT c.*, b.name AS board_name, b.currency AS board_currency,
         (SELECT COUNT(*) FROM items i WHERE i.board_id = c.board_id AND json_extract(i.values_json, '$."' || c.id || '"') IS NOT NULL) AS value_count
       FROM columns c JOIN boards b ON b.id = c.board_id WHERE c.workspace_id = ? AND c.type IN ('currency','number') AND b.kind != 'template' ORDER BY b.name, c.position`,
    )
      .bind(wsId)
      .all<ColumnRow & { board_name: string; board_currency: string | null; value_count: number }>();
    out.columns = cols.results
      .map((r) => ({ ...columnDTO(r), boardName: r.board_name, boardCurrency: r.board_currency, valueCount: r.value_count }))
      .filter((col) => isFinancialColumn(col) || /budget|cost|finance|price|amount|spend|expen|value|fee|\$/i.test(col.title))
      .map((col) => {
        const r = resolveColumnCurrency(col.settings, col.boardCurrency, policy.defaultCurrency);
        return {
          id: col.id,
          boardId: col.boardId,
          boardName: col.boardName,
          title: col.title,
          type: col.type,
          financial: isFinancialColumn(col),
          financeRole: col.settings.financeRole ?? null,
          storedCurrency: typeof col.settings.currency === 'string' ? col.settings.currency : null,
          currencyMode: col.settings.currencyMode ?? (col.settings.currency ? 'fixed' : 'inherit'),
          currency: r.currency,
          currencySource: r.source,
          confirmed: r.source === 'column' ? col.settings.currencyConfirmed === true : r.source !== 'unset',
          valueCount: col.valueCount,
        };
      });
  }
  return c.json(out);
});

financeRoutes.put('/workspaces/:ws/finance', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const input = await body(
    c,
    z.object({
      defaultCurrency: z.string().nullable().optional(),
      visibility: z.enum(['all', 'editors', 'managers']).optional(),
      enabledFields: z.array(z.enum(FINANCE_ROLES)).max(10).optional(),
    }),
  );
  if (input.defaultCurrency != null && !isSupportedCurrency(input.defaultCurrency)) throw badRequest('Choose one of the supported currencies');
  const row = await c.env.DB.prepare('SELECT settings_json, default_currency FROM workspaces WHERE id = ?').bind(wsId).first<{ settings_json: string; default_currency: string | null }>();
  const settings = parseJson<Record<string, any>>(row?.settings_json, {});
  const before = { defaultCurrency: row?.default_currency ?? null, ...(settings.finance ?? {}) };
  settings.finance = { ...(settings.finance ?? {}), ...(input.visibility ? { visibility: input.visibility } : {}), ...(input.enabledFields ? { enabledFields: input.enabledFields } : {}) };
  const currency = input.defaultCurrency !== undefined ? input.defaultCurrency : row?.default_currency ?? null;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE workspaces SET default_currency = ?, settings_json = ?, updated_at = ? WHERE id = ?').bind(currency, JSON.stringify(settings), now(), wsId),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'finance.settings_changed', metadata: input, ip: clientIp(c) }),
    auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: 'finance.settings_changed', before, after: { defaultCurrency: currency, ...settings.finance } }),
  ]);
  return c.json({ ok: true });
});

/**
 * Settle what an existing column's amounts are in: keep its stored code (confirmed), follow the project's or the
 * organisation's currency, or set a code. Mark a number column as holding money. The amounts are never touched.
 */
financeRoutes.post('/workspaces/:ws/finance/columns/:columnId', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const input = await body(
    c,
    z.object({
      action: z.enum(['confirm', 'inherit', 'set', 'mark_financial', 'unmark_financial', 'role']),
      currency: z.string().optional(),
      financeRole: z.enum(FINANCE_ROLES).nullable().optional(),
    }),
  );
  const col = await c.env.DB.prepare('SELECT * FROM columns WHERE id = ? AND workspace_id = ?').bind(c.req.param('columnId'), wsId).first<ColumnRow>();
  if (!col) throw notFound('Column');
  const settings = parseJson<Record<string, any>>(col.settings_json, {});
  const next: Record<string, any> = { ...settings };
  if (input.action === 'confirm') {
    if (col.type !== 'currency' || !settings.currency) throw badRequest('Only a currency column with a stored code can be confirmed');
    next.currencyMode = 'fixed';
    next.currencyConfirmed = true;
  } else if (input.action === 'inherit') {
    if (col.type !== 'currency') throw badRequest('Only currency columns have a currency');
    next.currencyMode = 'inherit';
    next.currencyConfirmed = true;
  } else if (input.action === 'set') {
    if (col.type !== 'currency') throw badRequest('Only currency columns have a currency');
    if (!isSupportedCurrency(input.currency)) throw badRequest('Choose one of the supported currencies');
    next.currency = input.currency;
    next.currencyMode = 'fixed';
    next.currencyConfirmed = true;
  } else if (input.action === 'mark_financial' || input.action === 'unmark_financial') {
    if (col.type !== 'number') throw badRequest('Only number columns can be marked as financial (currency columns always are)');
    next.financial = input.action === 'mark_financial';
  } else if (input.action === 'role') {
    if (col.type !== 'currency' && col.type !== 'number') throw badRequest('Only amount columns have a finance role');
    if (input.financeRole) next.financeRole = input.financeRole;
    else delete next.financeRole;
  }
  const clean = sanitizeColumnSettings(col.type, next);
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE columns SET settings_json = ? WHERE id = ?').bind(JSON.stringify(clean), col.id),
    auditEventStmt(c.env.DB, { workspaceId: wsId, boardId: col.board_id, actorId: user.id, type: 'finance.column_changed', before: { currency: settings.currency ?? null, currencyMode: settings.currencyMode ?? null, financial: settings.financial ?? null, financeRole: settings.financeRole ?? null }, after: { currency: clean.currency ?? null, currencyMode: clean.currencyMode ?? null, financial: clean.financial ?? null, financeRole: clean.financeRole ?? null }, metadata: { columnId: col.id, columnTitle: col.title, action: input.action } }),
  ]);
  c.executionCtx.waitUntil(broadcast(c.env, col.board_id, { kind: 'columns_changed', actorId: user.id }));
  return c.json({ ok: true, settings: clean });
});

/** Totals for a project: per column, per finance role (remaining, variance, utilisation), per group and per task. */
financeRoutes.get('/boards/:id/finance', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'viewFinance');
  const db = c.env.DB;
  const policy = await financePolicy(db, p.board.workspace_id);
  const [cols, groups, items] = await Promise.all([
    db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').bind(p.board.id).all<ColumnRow>(),
    db.prepare('SELECT * FROM groups WHERE board_id = ? AND archived_at IS NULL ORDER BY position').bind(p.board.id).all<GroupRow>(),
    db.prepare('SELECT * FROM items WHERE board_id = ? AND archived_at IS NULL').bind(p.board.id).all<ItemRow>(),
  ]);
  const summary = summariseFinance(cols.results.map(columnDTO), items.results.map(itemDTO), groups.results.map(groupDTO), {
    boardCurrency: p.board.currency ?? null,
    workspaceCurrency: policy.defaultCurrency,
  });
  return c.json({ ...summary, boardCurrency: p.board.currency ?? null, workspaceCurrency: policy.defaultCurrency, canEdit: p.caps.editFinance });
});

