// Meters and gauges with their readings (/api/maintenance/c/:company/meters): stage M2. A meter rises (hours,
// kilometres, cycles) and refuses a lower reading unless it is marked as a reset; a gauge (temperature, pressure) takes
// any value. Each reading is checked against the expected range, adds to the meter's life total, and runs the meter-
// and condition-based preventive maintenance of that meter straight away (generation is idempotent: pm.ts).
// Supervisors and administrators set meters up; anyone with access to the company may enter readings (by hand, from a
// work order or in a prestart check). The Readings page (the field release) lists the live meters with filters (site,
// kind, not read for some days, an asset and the assets under it, search) and sends several readings at once: each is
// recorded on its own, as one reading would be, so one refused reading never undoes the others.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { isManager, requireMt, type MtAccess } from './access';
import { SUBTREE_SQL, loadAsset } from './routes-assets';
import { loadWorkOrder } from './routes-work';
import { eventStmt, likeOf, zId, zText } from './util';
import { generateDue } from './pm';
import { DAY_MS, inSiteSql, isUnique, todayNear } from './m2util';

export const meterRoutes = new Hono<AppEnv>();

const q6 = (n: number) => Math.round(n * 1e6) / 1e6;

export function meterDTO(m: any) {
  return {
    id: m.id,
    assetId: m.asset_id,
    assetNumber: m.asset_number ?? null,
    assetName: m.asset_name ?? null,
    name: m.name,
    unit: m.unit,
    rising: !!m.rising,
    rolloverValue: m.rollover_value,
    expectedMin: m.expected_min,
    expectedMax: m.expected_max,
    lastValue: m.last_value,
    lastTotal: m.last_total,
    lastReadAt: m.last_read_at,
    readings: m.last_seq,
    archived: !!m.archived_at,
  };
}

/** A row of the Readings page: the meter with its asset's location and site, and whether its last value is outside the range. */
export function readingRowDTO(m: any) {
  const last = m.last_value;
  return {
    ...meterDTO(m),
    assetLocation: (m.asset_location ?? '') as string,
    siteCode: (m.site_code ?? null) as string | null,
    siteName: (m.site_name ?? null) as string | null,
    lastOutOfRange: last !== null && last !== undefined && ((m.expected_min !== null && last < m.expected_min) || (m.expected_max !== null && last > m.expected_max)),
  };
}

export const readingDTO = (r: any) => ({
  id: r.id,
  meterId: r.meter_id,
  seq: r.seq,
  value: r.value,
  delta: r.delta,
  total: r.total,
  reset: !!r.reset,
  outOfRange: !!r.out_of_range,
  source: r.source,
  workOrderId: r.work_order_id,
  workOrderNumber: r.wo_number ?? null,
  prestartId: r.prestart_id,
  note: r.note,
  readAt: r.read_at,
  enteredBy: r.entered_by,
  enteredByName: r.entered_by_name ?? null,
});

export async function loadMeter(db: D1Database, companyId: string, id: string) {
  const m = await db.prepare('SELECT m.*, a.number AS asset_number, a.name AS asset_name FROM mt_meters m JOIN mt_assets a ON a.company_id = m.company_id AND a.id = m.asset_id WHERE m.company_id = ? AND m.id = ?').bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!m) throw notFound('Meter');
  return m;
}

export interface ReadingInput {
  value: number;
  reset?: boolean;
  readAt?: number;
  note?: string;
  source: 'manual' | 'work_order' | 'prestart';
  workOrderId?: string | null;
  prestartId?: string | null;
}

/**
 * The statements that record a reading: the reading with the next sequence number of its meter (unique, so two readings
 * at once cannot both be next), then the meter's last value and life total. A rising meter refuses a lower reading
 * unless it is marked as a reset: usage then counts on from zero, or past the rollover value where the meter has one.
 */
export function readingStatements(db: D1Database, companyId: string, actorId: string | null, m: any, input: ReadingInput, t = now()) {
  if (m.archived_at) throw new HttpError(400, `Meter ${m.name} is archived`);
  if (!Number.isFinite(input.value)) throw new HttpError(400, 'Enter a number');
  const readAt = input.readAt ?? t;
  if (readAt > t + 5 * 60_000) throw new HttpError(400, 'A reading cannot be in the future');
  if (m.last_read_at && readAt < m.last_read_at) throw new HttpError(400, 'Enter readings in order: this one is earlier than the last reading');
  const value = q6(input.value);
  let delta: number | null = null;
  let total: number | null = null;
  const reset = !!input.reset;
  if (m.rising) {
    if (value < 0) throw new HttpError(400, 'A meter reading cannot be below zero');
    if (m.last_value === null || m.last_value === undefined) {
      total = value;
    } else if (value >= m.last_value && !reset) {
      delta = q6(value - m.last_value);
      total = q6(Number(m.last_total ?? m.last_value) + delta);
    } else {
      if (!reset) throw new HttpError(409, `The reading ${value} is lower than the last reading (${m.last_value}${m.unit ? ` ${m.unit}` : ''}). If the meter was reset, replaced or rolled over, mark the reading as a reset.`);
      delta = m.rollover_value && value <= m.rollover_value ? q6(m.rollover_value - m.last_value + value) : value;
      if (delta < 0) delta = value;
      total = q6(Number(m.last_total ?? m.last_value) + delta);
    }
  }
  const outOfRange = (m.expected_min !== null && value < m.expected_min) || (m.expected_max !== null && value > m.expected_max);
  const id = newId();
  const seq = Number(m.last_seq) + 1;
  const stmts = [
    db
      .prepare('INSERT INTO mt_readings (id, company_id, meter_id, asset_id, seq, value, delta, total, reset, out_of_range, source, work_order_id, prestart_id, note, read_at, entered_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, companyId, m.id, m.asset_id, seq, value, delta, total, reset ? 1 : 0, outOfRange ? 1 : 0, input.source, input.workOrderId ?? null, input.prestartId ?? null, (input.note ?? '').slice(0, 500), readAt, actorId, t),
    db.prepare('UPDATE mt_meters SET last_seq = ?, last_value = ?, last_total = ?, last_read_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND last_seq = ?').bind(seq, value, total, readAt, t, companyId, m.id, m.last_seq),
    eventStmt(db, {
      companyId,
      actorId,
      action: 'reading.recorded',
      assetId: m.asset_id,
      workOrderId: input.workOrderId ?? null,
      summary: `${m.name}: ${value}${m.unit ? ` ${m.unit}` : ''}${reset ? ' (reset)' : ''}${outOfRange ? ' (outside the expected range)' : ''}`,
      after: { meterId: m.id, value, delta, total, reset, outOfRange, source: input.source },
      at: t,
    }),
  ];
  return { id, seq, value, delta, total, outOfRange, stmts };
}

const meterSchema = z.object({
  assetId: zId,
  name: zText(120).min(1),
  unit: zText(20).optional(),
  rising: z.boolean().optional(),
  rolloverValue: z.number().positive().max(1e12).nullable().optional(),
  expectedMin: z.number().finite().nullable().optional(),
  expectedMax: z.number().finite().nullable().optional(),
});

function checkRange(min: number | null | undefined, max: number | null | undefined) {
  if (min !== null && min !== undefined && max !== null && max !== undefined && min > max) throw new HttpError(400, 'The expected minimum cannot be above the maximum');
}

/**
 * The company's meters. Without filters, as before: every live meter (archived ones too with archived=1). The Readings
 * page adds view=readings (assets not archived, with their site and location), siteId, q, notReadForDays, kind,
 * assetId with includeChildren, sort=lastRead and paging; total counts every match.
 */
meterRoutes.get('/c/:company/meters', async (c) => {
  const a = await requireMt(c);
  const qp = (k: string) => c.req.query(k) ?? '';
  const view = qp('view') === 'readings';
  const where: string[] = [];
  const args: unknown[] = [];
  const assetId = qp('assetId').slice(0, 64);
  if (assetId && qp('includeChildren') === '1') {
    where.push(`m.asset_id IN (${SUBTREE_SQL})`);
    args.push(a.companyId, assetId, a.companyId);
  } else if (assetId) {
    where.push('m.asset_id = ?');
    args.push(assetId);
  }
  if (qp('archived') !== '1') where.push('m.archived_at IS NULL');
  if (view) where.push('a.archived_at IS NULL');
  if (qp('siteId')) {
    where.push(inSiteSql('a'));
    args.push(qp('siteId').slice(0, 64));
  }
  if (qp('q').trim()) {
    where.push('(a.search LIKE ? OR lower(m.name) LIKE ?)');
    args.push(likeOf(qp('q')), likeOf(qp('q')));
  }
  const days = Number(qp('notReadForDays'));
  if (Number.isInteger(days) && days >= 1 && days <= 3650) {
    where.push('(m.last_read_at IS NULL OR m.last_read_at < ?)');
    args.push(now() - days * DAY_MS);
  }
  if (qp('kind') === 'meter') where.push('m.rising = 1');
  else if (qp('kind') === 'gauge') where.push('m.rising = 0');
  const cond = where.map((w) => ` AND ${w}`).join('');
  const order = qp('sort') === 'lastRead' ? 'COALESCE(m.last_read_at, 0) ASC, a.number COLLATE NOCASE, m.name COLLATE NOCASE' : 'a.number COLLATE NOCASE, m.name COLLATE NOCASE';
  const limit = Math.min(Math.max(Number(qp('limit')) || (view ? 200 : 500), 1), 500);
  const offset = Math.max(Number(qp('offset')) || 0, 0);
  const db = c.env.DB;
  const [rows, total] = await db.batch([
    view
      ? db
          .prepare(
            `SELECT m.*, a.number AS asset_number, a.name AS asset_name, a.location AS asset_location, s.code AS site_code, s.name AS site_name FROM mt_meters m
               JOIN mt_assets a ON a.company_id = m.company_id AND a.id = m.asset_id
               LEFT JOIN mt_asset_sites ms ON ms.company_id = a.company_id AND ms.asset_id = a.id
               LEFT JOIN mt_sites s ON s.company_id = ms.company_id AND s.id = ms.site_id
              WHERE m.company_id = ?${cond} ORDER BY ${order} LIMIT ? OFFSET ?`,
          )
          .bind(a.companyId, ...args, limit, offset)
      : db.prepare(`SELECT m.*, a.number AS asset_number, a.name AS asset_name FROM mt_meters m JOIN mt_assets a ON a.company_id = m.company_id AND a.id = m.asset_id WHERE m.company_id = ?${cond} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(a.companyId, ...args, limit, offset),
    db.prepare(`SELECT COUNT(*) AS n FROM mt_meters m JOIN mt_assets a ON a.company_id = m.company_id AND a.id = m.asset_id WHERE m.company_id = ?${cond}`).bind(a.companyId, ...args),
  ]);
  return c.json({ meters: (rows.results as any[]).map(view ? readingRowDTO : meterDTO), total: (total.results[0] as any)?.n ?? 0, can: { manage: isManager(a) } });
});

meterRoutes.post('/c/:company/meters', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const input = await body(c, meterSchema);
  const asset = await loadAsset(db, a.companyId, input.assetId).catch(() => {
    throw new HttpError(400, 'Choose an asset from this company');
  });
  if (asset.archived_at) throw new HttpError(400, 'That asset is archived');
  checkRange(input.expectedMin, input.expectedMax);
  const rising = input.rising ?? true;
  if (!rising && input.rolloverValue) throw new HttpError(400, 'Only a rising meter rolls over');
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare('INSERT INTO mt_meters (id, company_id, asset_id, name, unit, rising, rollover_value, expected_min, expected_max, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, asset.id, input.name, input.unit ?? '', rising ? 1 : 0, input.rolloverValue ?? null, input.expectedMin ?? null, input.expectedMax ?? null, a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'meter.created', assetId: asset.id, summary: `${rising ? 'Meter' : 'Gauge'} ${input.name} added`, after: input, at: t }),
  ]);
  return c.json(meterDTO(await loadMeter(db, a.companyId, id)), 201);
});

meterRoutes.patch('/c/:company/meters/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const m = await loadMeter(db, a.companyId, c.req.param('id'));
  const input = await body(c, meterSchema.omit({ assetId: true, rising: true }).partial().extend({ archived: z.boolean().optional() }));
  const next = {
    name: input.name ?? m.name,
    unit: input.unit ?? m.unit,
    rollover_value: input.rolloverValue !== undefined ? input.rolloverValue : m.rollover_value,
    expected_min: input.expectedMin !== undefined ? input.expectedMin : m.expected_min,
    expected_max: input.expectedMax !== undefined ? input.expectedMax : m.expected_max,
    archived_at: input.archived === undefined ? m.archived_at : input.archived ? (m.archived_at ?? now()) : null,
  };
  checkRange(next.expected_min, next.expected_max);
  if (!m.rising && next.rollover_value) throw new HttpError(400, 'Only a rising meter rolls over');
  const t = now();
  await db.batch([
    db.prepare('UPDATE mt_meters SET name = ?, unit = ?, rollover_value = ?, expected_min = ?, expected_max = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(next.name, next.unit, next.rollover_value, next.expected_min, next.expected_max, next.archived_at, t, a.companyId, m.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'meter.updated', assetId: m.asset_id, summary: `Meter ${next.name} changed`, before: { name: m.name, unit: m.unit, rolloverValue: m.rollover_value, expectedMin: m.expected_min, expectedMax: m.expected_max, archived: !!m.archived_at }, after: { name: next.name, unit: next.unit, rolloverValue: next.rollover_value, expectedMin: next.expected_min, expectedMax: next.expected_max, archived: !!next.archived_at }, at: t }),
  ]);
  return c.json(meterDTO(await loadMeter(db, a.companyId, m.id)));
});

meterRoutes.get('/c/:company/meters/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const m = await loadMeter(db, a.companyId, c.req.param('id'));
  const before = Number(c.req.query('before')) || Number.MAX_SAFE_INTEGER;
  const [readings, schedules] = await db.batch([
    db.prepare('SELECT r.*, u.name AS entered_by_name, w.number AS wo_number FROM mt_readings r LEFT JOIN users u ON u.id = r.entered_by LEFT JOIN mt_work_orders w ON w.company_id = r.company_id AND w.id = r.work_order_id WHERE r.company_id = ? AND r.meter_id = ? AND r.seq < ? ORDER BY r.seq DESC LIMIT 200').bind(a.companyId, m.id, before),
    db.prepare('SELECT id, name, trigger_kind, meter_interval, next_due_meter, cond_below, cond_above, active FROM mt_pm_schedules WHERE company_id = ? AND meter_id = ? ORDER BY name').bind(a.companyId, m.id),
  ]);
  return c.json({
    meter: meterDTO(m),
    readings: (readings.results as any[]).map(readingDTO),
    schedules: (schedules.results as any[]).map((s) => ({ id: s.id, name: s.name, triggerKind: s.trigger_kind, meterInterval: s.meter_interval, nextDueMeter: s.next_due_meter, condBelow: s.cond_below, condAbove: s.cond_above, active: !!s.active })),
    can: { manage: isManager(a), read: true },
  });
});

/** Records a reading, then makes any preventive work order it triggers (meter- or condition-based) at once. */
meterRoutes.post('/c/:company/meters/:id/readings', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const input = await body(c, z.object({ value: z.number().finite().min(-1e12).max(1e12), reset: z.boolean().optional(), readAt: z.number().int().positive().optional(), note: zText(500).optional(), workOrderId: zId.nullable().optional(), today: z.string().optional() }));
  const reading = await recordReading(db, a, c.req.param('id'), input);
  return c.json(reading, 201);
});

/**
 * Several readings at once (the Readings page), each of another meter. The whole body is checked first; then each
 * reading is recorded on its own, in order, exactly as one reading is (its own transaction and its own preventive
 * maintenance), and gets its own result: one refused reading never undoes the others.
 */
meterRoutes.post('/c/:company/readings/batch', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const entry = z.object({ meterId: zId, value: z.number().finite().min(-1e12).max(1e12), reset: z.boolean().optional(), readAt: z.number().int().positive().optional(), note: zText(500).optional() });
  const input = await body(c, z.object({ entries: z.array(entry).min(1).max(50), today: z.string().optional() }));
  const seen = new Set<string>();
  for (const e of input.entries) {
    if (seen.has(e.meterId)) throw new HttpError(400, 'Each meter takes one reading per send: a meter appears twice', { code: 'DUPLICATE_METER', meterId: e.meterId });
    seen.add(e.meterId);
  }
  const results: Record<string, unknown>[] = [];
  for (const e of input.entries) {
    try {
      const r = await recordReading(db, a, e.meterId, { value: e.value, reset: e.reset, readAt: e.readAt, note: e.note, today: input.today });
      results.push({ meterId: e.meterId, ok: true, ...r });
    } catch (err) {
      if (err instanceof HttpError) {
        results.push({ meterId: e.meterId, ok: false, status: err.status, error: err.message });
      } else {
        // Never the value or the note: the meter and the kind of error only.
        console.error('readings batch: row failed', { meterId: e.meterId, error: (err as Error)?.name });
        results.push({ meterId: e.meterId, ok: false, status: 500, error: 'This reading was not saved. Try again.' });
      }
    }
  }
  const saved = results.filter((r) => r.ok).length;
  return c.json({ saved, failed: results.length - saved, results });
});

export async function recordReading(db: D1Database, a: MtAccess, meterId: string, input: { value: number; reset?: boolean; readAt?: number; note?: string; workOrderId?: string | null; today?: string }) {
  const m = await loadMeter(db, a.companyId, meterId);
  let source: ReadingInput['source'] = 'manual';
  if (input.workOrderId) {
    const w = await loadWorkOrder(db, a, input.workOrderId);
    if (w.asset_id !== m.asset_id) throw new HttpError(400, `${w.number} is not on the asset of this meter`);
    source = 'work_order';
  }
  const r = readingStatements(db, a.companyId, a.userId, m, { value: input.value, reset: input.reset, readAt: input.readAt, note: input.note, source, workOrderId: input.workOrderId ?? null });
  try {
    await db.batch(r.stmts);
  } catch (e) {
    if (isUnique(e)) throw new HttpError(409, 'Someone entered a reading of this meter at the same moment. Refresh and try again.');
    throw e;
  }
  const generated = await generateDue(db, { companyId: a.companyId, meterId: m.id, today: todayNear(input.today), actorId: a.userId });
  return { reading: { id: r.id, seq: r.seq, value: r.value, delta: r.delta, total: r.total, outOfRange: r.outOfRange }, generated: generated.made };
}
