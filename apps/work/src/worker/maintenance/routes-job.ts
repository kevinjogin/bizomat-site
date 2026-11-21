// The job itself (migration 0040), under /api/maintenance/c/:company/...
//
//   GET   /work-orders/:id/job-card   what the printable job card shows (read only): the asset and its place, the work,
//                                     tasks, parts, inspections with their answer boxes, an inspection round's assets
//                                     with their checklists, labour, downtime, notes, photos (other files by name) and
//                                     the sign-off. Never a cost, rate or value. Anyone who may see the work order may
//                                     print it. The page prints in the browser, whose "Save as PDF" keeps it as a file:
//                                     there is no PDF made on the server.
//   POST  /work-orders/done           work already done, recorded in one step: a work order made and completed in one
//                                     transaction, with the time it took, any downtime and an optional sign-off.
//                                     Supervisors and administrators always may; technicians only their own work, and
//                                     only while the company's setting allows it. No parts are issued here: a locked
//                                     work order takes no stock, so a supervisor reopens it to issue some.
//   PATCH /settings/work-orders       the two settings for completing work orders (administrators).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { deny, isManager, requestScope, requireMt } from './access';
import { workOrderDTO } from './dto';
import { loadWorkOrder, workOrderStatements } from './routes-work';
// The work order's extras, and the downtime of work recorded after it was done (the statements of PUT /downtime).
import { downtimeStmts, workOrderExtras } from './routes-parts';
import { assetPath } from './routes-assets';
import { priceLabourStmt } from './routes-setup';
// An inspection round's assets on the card, from the rounds' own code.
import { roundForCard } from './routes-rounds';
import { JOB_TYPES, PRIORITY, commentsOf, eventStmt, filesOf, validDate, zId, zText } from './util';
import { DAY_MS, addDays, doneStmt, utcDate } from './m2util';
import { SIGN_OFF_SET, discardSignature, signOffValues, signatureBytes, signatureFileStmts, signatureSchema, storeSignature, workSettings, type PreparedSignature } from './signoff';

export const jobRoutes = new Hono<AppEnv>();

// ------------------------------------------------------------------ the job card

const ASSET_SQL = `SELECT a.number, a.name, a.category, a.type, a.manufacturer, a.model, a.serial_number, a.registration_number, a.location, a.criticality, a.status, a.department,
    d.name AS department_name, st.code AS site_code, st.name AS site_name
  FROM mt_assets a
  LEFT JOIN co_departments d ON d.company_id = a.company_id AND d.id = a.department_id
  LEFT JOIN mt_asset_sites xs ON xs.company_id = a.company_id AND xs.asset_id = a.id
  LEFT JOIN mt_sites st ON st.company_id = xs.company_id AND st.id = xs.site_id
 WHERE a.company_id = ? AND a.id = ?`;

jobRoutes.get('/c/:company/work-orders/:id/job-card', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const w = await loadWorkOrder(db, a, c.req.param('id'));
  const rq = requestScope(a, 'r');
  const [assetRows, requests, tasks, parts] = await db.batch([
    db.prepare(ASSET_SQL).bind(a.companyId, w.asset_id),
    db.prepare(`SELECT r.number, r.description, r.created_at, u.name AS requester_name FROM mt_requests r LEFT JOIN users u ON u.id = r.requested_by WHERE r.company_id = ? AND r.work_order_id = ? AND ${rq.sql} ORDER BY r.created_at`).bind(a.companyId, w.id, ...rq.args),
    db.prepare('SELECT t.position, t.text, t.done_at, u.name AS done_by_name FROM mt_wo_tasks t LEFT JOIN users u ON u.id = t.done_by WHERE t.company_id = ? AND t.work_order_id = ? ORDER BY t.position, t.created_at').bind(a.companyId, w.id),
    // A part line may name an ERP product (migration 0040): its number is what technicians pick by.
    db.prepare('SELECT p.position, p.part, p.quantity, pr.number AS product_number, pr.uom FROM mt_wo_parts p LEFT JOIN erp_products pr ON pr.company_id = p.company_id AND pr.id = p.product_id WHERE p.company_id = ? AND p.work_order_id = ? ORDER BY p.position, p.created_at').bind(a.companyId, w.id),
  ]);
  const asset = (assetRows.results[0] ?? {}) as any;
  const extras = await workOrderExtras(db, a, w);
  const files = await filesOf(db, a.companyId, 'work_order_id', w.id);
  const signed = (w.status === 'completed' || w.status === 'closed') && !!w.signed_at && !!w.signature_file_id;
  return c.json({
    company: { id: a.companyId, name: a.companyName },
    printedAt: now(),
    printedBy: a.userName,
    workOrder: workOrderDTO(w),
    asset: {
      id: w.asset_id,
      number: asset.number ?? w.asset_number,
      name: asset.name ?? w.asset_name,
      category: asset.category ?? '',
      type: asset.type ?? '',
      manufacturer: asset.manufacturer ?? '',
      model: asset.model ?? '',
      serialNumber: asset.serial_number ?? '',
      registrationNumber: asset.registration_number ?? '',
      location: asset.location ?? '',
      criticality: asset.criticality ?? '',
      status: asset.status ?? '',
      department: asset.department_name ?? asset.department ?? '',
      siteCode: asset.site_code ?? null,
      siteName: asset.site_name ?? null,
    },
    assetPath: await assetPath(db, a.companyId, w.asset_id),
    requests: (requests.results as any[]).map((r) => ({ number: r.number, description: r.description, requestedByName: r.requester_name ?? null, createdAt: r.created_at })),
    tasks: (tasks.results as any[]).map((t) => ({ position: t.position, text: t.text, done: !!t.done_at, doneAt: t.done_at ?? null, doneByName: t.done_by_name ?? null })),
    parts: (parts.results as any[]).map((p) => ({ position: p.position, part: p.part, quantity: p.quantity, productNumber: p.product_number ?? null, uom: p.uom ?? null })),
    partsIssued: extras.stock.byProduct.filter((p) => p.issued > 1e-9).map((p) => ({ number: p.number, name: p.name, uom: p.uom, quantity: p.issued })),
    inspections: extras.inspections.map((i) => ({
      id: i.id,
      templateName: i.templateName,
      status: i.status,
      completedAt: i.completedAt ?? null,
      completedByName: i.completedByName,
      items: i.items.map((x: any) => ({ id: x.id, position: x.position, label: x.label, kind: x.kind, unit: x.unit ?? '', min: x.min ?? null, max: x.max ?? null, critical: !!x.critical })),
      results: i.results.map((r: any) => ({ itemId: r.itemId, label: r.label, kind: r.kind, unit: r.unit ?? '', passed: r.passed, value: r.value ?? null, text: r.text ?? '', note: r.note ?? '' })),
    })),
    // An inspection round: each asset with its checklist (null for any other work order).
    round: await roundForCard(db, a, w),
    labour: extras.labourCosts.map((l) => ({ workDate: l.workDate, userName: l.userName, minutes: l.minutes, entry: l.entry })),
    totals: { actualMinutes: w.actual_minutes ?? 0, estimatedMinutes: w.estimated_minutes ?? null },
    downtime: extras.downtime ? { startedAt: extras.downtime.startedAt, endedAt: extras.downtime.endedAt, minutes: extras.downtime.minutes, cause: extras.downtime.cause } : null,
    notes: (await commentsOf(db, a.companyId, 'work_order_id', w.id)).map((n) => ({ authorName: n.authorName, at: n.at, body: n.body })),
    files: {
      images: files.filter((f) => f.isImage && f.id !== w.signature_file_id).map((f) => ({ id: f.id, name: f.name, url: f.url })),
      documents: files.filter((f) => !f.isImage).map((f) => ({ id: f.id, name: f.name, mime: f.mime, size: f.size })),
    },
    signOff: signed ? { name: w.signed_by_name, role: w.signed_by_role ?? '', at: w.signed_at, url: `/api/maintenance/c/${a.companyId}/files/${w.signature_file_id}` } : null,
  });
});

// ------------------------------------------------------------------ work already done

const doneSchema = z.object({
  assetId: zId,
  description: zText(5000).min(1, 'Describe the job'),
  jobType: z.enum(JOB_TYPES).optional(),
  priority: z.enum(PRIORITY).optional(),
  trade: zText(80).optional(),
  contractor: zText(200).optional(),
  department: zText(120).optional(),
  departmentId: zId.nullable().optional(),
  projectRef: zText(120).optional(),
  customerRef: zText(120).optional(),
  doneDate: z.string().max(20),
  doneBy: zId.optional(),
  minutes: z.number().int().min(0).max(24 * 60).optional(),
  notes: zText(10000).min(1, 'Write what was done'),
  downtime: z.object({ startedAt: z.number().int().positive(), endedAt: z.number().int().positive(), cause: zText(500).optional() }).optional(),
  signature: signatureSchema.optional(),
  requestKey: z.string().trim().min(8).max(80).optional(),
  // The browser's getTimezoneOffset(): the work is placed at noon of the day done in the person's own time zone.
  tzOffset: z.number().int().min(-840).max(840).optional(),
});

jobRoutes.post('/c/:company/work-orders/done', async (c) => {
  const a = await requireMt(c, 'technician');
  const db = c.env.DB;
  await rateLimit(db, `mt-done:${a.userId}`, 30, 60_000);
  const ws = await workSettings(db, a.companyId);
  if (!isManager(a) && !ws.techniciansRecordWork) deny('Only supervisors and administrators record work already done. An administrator can let technicians do it in Maintenance settings.');
  const input = await body(c, doneSchema);
  const doneBy = input.doneBy ?? a.userId;
  if (!isManager(a) && doneBy !== a.userId) deny('Technicians record only their own work');
  if (!validDate(input.doneDate)) throw new HttpError(400, 'Use a date like 2026-11-14');
  const t0 = now();
  if (input.doneDate > utcDate(t0 + DAY_MS)) throw new HttpError(400, 'Work cannot be recorded for a future date');
  if (input.doneDate < addDays(utcDate(t0), -366)) throw new HttpError(400, 'Record work done within the last year');
  const dt = input.downtime;
  if (dt && (dt.endedAt < dt.startedAt || dt.endedAt > t0 + 5 * 60_000 || dt.startedAt < t0 - 400 * DAY_MS)) throw new HttpError(400, 'Check the downtime: it must have ended, and cannot end before it starts or in the future');
  // The sign-off is checked before a work order number is used; the picture is stored last, just before the transaction.
  const bytes = signatureBytes(input.signature, ws);
  const made = await workOrderStatements(db, a, {
    assetId: input.assetId,
    description: input.description,
    jobType: input.jobType ?? 'corrective',
    priority: input.priority ?? 'medium',
    trade: input.trade,
    contractor: input.contractor,
    department: input.department,
    departmentId: input.departmentId,
    projectRef: input.projectRef,
    customerRef: input.customerRef,
    assignedTo: doneBy,
    dueStart: input.doneDate,
    dueFinish: input.doneDate,
  });
  const t = made.at;
  const completedAt = Math.min(t, Date.parse(`${input.doneDate}T12:00:00Z`) + (input.tzOffset ?? 0) * 60_000);
  const minutes = input.minutes ?? 0;
  // The downtime goes in as PUT /downtime records it (routes-parts.ts); its times were checked above. Read before the
  // picture is stored, so nothing outside the transaction is written before the last read.
  const downtime = dt ? await downtimeStmts(db, a, { id: made.id, asset_id: input.assetId }, dt, t) : [];
  const sig: PreparedSignature | null = bytes && input.signature ? await storeSignature(c, a, { id: made.id, number: made.number }, input.signature, bytes) : null;
  const stmts: D1PreparedStatement[] = [
    ...(input.requestKey ? [doneStmt(db, a.companyId, `wo-done:${a.userId}:${input.requestKey}`, t)] : []),
    ...made.stmts,
    db
      .prepare(`UPDATE mt_work_orders SET status = 'completed', completion_notes = ?, completed_at = ?, completed_by = ?, recorded_done = 1, updated_at = ?, ${SIGN_OFF_SET} WHERE company_id = ? AND id = ? AND status IN ('open','assigned')`)
      .bind(input.notes, completedAt, a.userId, t, ...signOffValues(sig, t), a.companyId, made.id),
    ...signatureFileStmts(db, a, { id: made.id }, sig, t),
  ];
  if (minutes > 0) {
    // Time entered by hand is dated by the day it was worked (the convention of POST /labour).
    const labourId = newId();
    const start = Date.parse(`${input.doneDate}T00:00:00Z`);
    stmts.push(
      db.prepare('INSERT INTO mt_labour (id, company_id, work_order_id, user_id, started_at, ended_at, minutes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(labourId, a.companyId, made.id, doneBy, start, start + minutes * 60_000, minutes, t),
      priceLabourStmt(db, a.companyId, made.id, { labourId }, { entry: 'manual', note: 'Recorded with the work done', t }),
    );
  }
  stmts.push(...downtime);
  stmts.push(
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'work_order.recorded_done',
      assetId: input.assetId,
      workOrderId: made.id,
      summary: `Work order ${made.number} recorded as done on ${input.doneDate}${minutes ? `: ${minutes} min` : ''}${sig ? `, signed off by ${sig.name}` : ''}`,
      after: { doneDate: input.doneDate, doneBy, minutes, notes: input.notes, ...(sig ? { signedBy: sig.name, signedByRole: sig.role } : {}) },
      at: t,
    }),
  );
  try {
    await db.batch(stmts);
  } catch (e) {
    discardSignature(c, sig);
    if (/mt_done/.test(String((e as Error)?.message ?? e))) throw new HttpError(409, 'This was already recorded: refresh to see it');
    throw e;
  }
  return c.json(workOrderDTO(await loadWorkOrder(db, a, made.id)), 201);
});

// ------------------------------------------------------------------ settings

jobRoutes.patch('/c/:company/settings/work-orders', async (c) => {
  const a = await requireMt(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, z.object({ requireSignature: z.boolean().optional(), techniciansRecordWork: z.boolean().optional() }));
  if (input.requireSignature === undefined && input.techniciansRecordWork === undefined) throw new HttpError(400, 'Nothing to change');
  const before = await workSettings(db, a.companyId);
  const after = { requireSignature: input.requireSignature ?? before.requireSignature, techniciansRecordWork: input.techniciansRecordWork ?? before.techniciansRecordWork };
  const said: string[] = [];
  if (after.requireSignature !== before.requireSignature) said.push(after.requireSignature ? 'Completing a work order now needs a signature' : 'Completing a work order no longer needs a signature');
  if (after.techniciansRecordWork !== before.techniciansRecordWork) said.push(after.techniciansRecordWork ? 'Technicians can now record work already done' : 'Technicians can no longer record work already done');
  if (!said.length) return c.json(after);
  const t = now();
  await db.batch([
    db
      .prepare(
        'INSERT INTO mt_settings (company_id, require_signature, technicians_record_work, updated_by, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id) DO UPDATE SET require_signature = excluded.require_signature, technicians_record_work = excluded.technicians_record_work, updated_by = excluded.updated_by, updated_at = excluded.updated_at',
      )
      .bind(a.companyId, after.requireSignature ? 1 : 0, after.techniciansRecordWork ? 1 : 0, a.userId, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'settings.changed', summary: said.join('; '), before, after, at: t }),
  ]);
  return c.json(after);
});
