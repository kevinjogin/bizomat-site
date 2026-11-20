// CAD Automation inside BIZOMAT ERP: the ERP's API for its CAD module (docs/cad/README.md). Every address is
// /api/erp/c/<company>/cad/..., so the company context, the module switch and the members gate (module 'cad') apply as
// for every other module; requireCad then checks the flag cad_in_erp and the brief's permissions (access.ts). What CAD
// Automation holds (computers, AI connections, commands, exports) is read and changed in its engine, server to server
// with a signed assertion (client.ts); what the ERP keeps (saved documents, bill of materials proposals, review tasks,
// settings, history) is written here. Every change and every download is recorded in the company's history.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { assertCan, can } from '../erp/access';
import { eventStmt, nextNumber, searchText } from '../erp/util';
import { docDTO, loadDoc, validateEngineeringUpload, versionStatements } from '../erp/documents';
import { assertEditable, assertNoCycle, loadRevision } from '../erp/engineering';
import { MAX_FILE_BYTES } from '../routes/files';
import { companyOfTool } from '../platform/context';
import { loadBoardAuth } from '../services/permissions';
import { createItem } from '../services/item-ops';
import { svcFromContext } from '../services/context';
import { loadColumns } from '../services/mappers';
import { CAD_SUBFLAGS, type CadAccess, DOWNLOAD_DEFAULTS, cadCompanies, cadOn, downloadConfig, need, requireCad } from './access';
import { cadFile, cadJson, cadUnavailable } from './client';

export const cadRoutes = new Hono<AppEnv>();

const zId = z.string().trim().min(1).max(64);
const enc = (s: string) => encodeURIComponent(s);
const DOC_KIND_BY_EXT: Record<string, 'drawing' | 'pdf' | 'dxf' | 'step' | 'image' | 'model' | 'other'> = { pdf: 'drawing', dwg: 'drawing', dxf: 'dxf', step: 'step', stp: 'step', png: 'image', jpg: 'image', jpeg: 'image' };

async function flagsOf(db: D1Database, companyId: string) {
  const out: Record<string, boolean> = {};
  for (const f of CAD_SUBFLAGS) out[f.replace('cad_', '')] = await cadOn(db, companyId, f);
  return out as { products: boolean; bom: boolean; manufacturing: boolean; quality: boolean; projects: boolean };
}

const event = (c: any, a: CadAccess, action: string, entityType: Parameters<typeof eventStmt>[1]['entityType'], entityId: string | null, summary: string, extra: { productId?: string | null; after?: unknown } = {}) =>
  eventStmt(c.env.DB, { companyId: a.erp.companyId, actorId: a.erp.userId, action, entityType, entityId, productId: extra.productId ?? null, summary, after: extra.after });

// ------------------------------------------------------------------ the module's state

// The companies where the person can open CAD Automation in the ERP (the module rail's entry and the pairing page,
// /erp/cad and /erp/cad/pair?code=..., choose among them).
cadRoutes.get('/cad/companies', async (c) => {
  const user = c.get('user');
  return c.json({ companies: await cadCompanies(c.env, user, { operate: false }) });
});

cadRoutes.get('/c/:company/cad', async (c) => {
  const a = await requireCad(c);
  const db = c.env.DB;
  const base = {
    company: { id: a.erp.companyId, name: a.erp.companyName, kind: a.erp.kind },
    role: a.role,
    perms: { ...a.perms, team: undefined },
    limits: a.limits,
    flags: await flagsOf(db, a.erp.companyId),
    erp: { documentsEdit: can(a.erp, 'documents.edit'), productsEdit: can(a.erp, 'products.edit') },
  };
  // ?part=flags: what this person may do here, without asking CAD Automation (the product, order and document pages).
  if (c.req.query('part') === 'flags') return c.json(base);
  const why = cadUnavailable(c.env);
  if (why) return c.json({ ...base, cad: { connected: false, reason: why } });
  try {
    const state = await cadJson<Record<string, unknown>>(c.env, a.claims, 'state');
    return c.json({ ...base, cad: { connected: true, ...state } });
  } catch (e) {
    if (e instanceof HttpError && e.status < 500) throw e;
    return c.json({ ...base, cad: { connected: false, reason: e instanceof Error ? e.message : 'CAD Automation could not be reached.' } });
  }
});

// ------------------------------------------------------------------ computers

cadRoutes.post('/c/:company/cad/computers/:device/default', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot change computers.');
  const out = await cadJson<{ name: string }>(c.env, a.claims, 'computers/default', { device: c.req.param('device') });
  await event(c, a, 'cad.computer_default', 'cad_computer', c.req.param('device'), `${out.name} is now the default computer`).run();
  return c.json(out);
});

// POST, not DELETE: removing one's own computer is operating it, which employees may do (the members gate refuses
// DELETE to roles that cannot delete records; removing other people's computers needs 'delete', checked by CAD).
cadRoutes.post('/c/:company/cad/computers/:device/remove', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate || a.perms.delete, 'Your role cannot remove computers.');
  const out = await cadJson<{ name: string; owner: string | null }>(c.env, a.claims, 'computers/remove', { device: c.req.param('device') });
  await event(c, a, 'cad.computer_removed', 'cad_computer', c.req.param('device'), `Computer ${out.name} removed${out.owner && out.owner !== a.erp.userId ? ' (another person’s)' : ''}`).run();
  return c.json(out);
});

// Pairing a computer: the Companion shows a code and opens /erp/cad/pair?code=...; the person chooses the company.
cadRoutes.get('/c/:company/cad/pairing/:code', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot pair computers in this company.');
  await rateLimit(c.env.DB, `cad-pair:${a.erp.userId}`, 30, 10 * 60_000);
  return c.json(await cadJson(c.env, a.claims, 'pair/lookup', { code: c.req.param('code') }));
});

cadRoutes.post('/c/:company/cad/pairing/:code', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot pair computers in this company.');
  await rateLimit(c.env.DB, `cad-pair:${a.erp.userId}`, 30, 10 * 60_000);
  const out = await cadJson<{ device: string; name: string }>(c.env, a.claims, 'pair/approve', { code: c.req.param('code') });
  await event(c, a, 'cad.computer_paired', 'cad_pairing', out.device, `Computer ${out.name} paired`).run();
  return c.json(out);
});

// ------------------------------------------------------------------ AI assistants (connections bound to one company)

cadRoutes.post('/c/:company/cad/assistants/:grant/remove', async (c) => {
  const a = await requireCad(c);
  const out = await cadJson<{ name: string; owner: string | null }>(c.env, a.claims, 'assistants/remove', { grant: c.req.param('grant') });
  await event(c, a, 'cad.assistant_removed', 'cad_assistant', c.req.param('grant'), `AI assistant ${out.name} disconnected${out.owner && out.owner !== a.erp.userId ? ' (another person’s)' : ''}`).run();
  return c.json(out);
});

cadRoutes.post('/c/:company/cad/assistants/:grant/assign', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot use AI assistants in this company.');
  const out = await cadJson<{ name: string }>(c.env, a.claims, 'assistants/assign', { grant: c.req.param('grant') });
  await event(c, a, 'cad.assistant_assigned', 'cad_assistant', c.req.param('grant'), `AI assistant ${out.name} now works in ${a.erp.companyName}`).run();
  return c.json(out);
});

// ------------------------------------------------------------------ commands (the job history)

cadRoutes.get('/c/:company/cad/commands/:id', async (c) => {
  const a = await requireCad(c);
  return c.json(await cadJson(c.env, a.claims, 'commands/get', { id: c.req.param('id') }));
});

cadRoutes.post('/c/:company/cad/commands/:id/cancel', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot cancel CAD Automation work.');
  const out = await cadJson<{ tool: string }>(c.env, a.claims, 'commands/cancel', { id: c.req.param('id') });
  await event(c, a, 'cad.command_cancelled', 'cad_command', c.req.param('id'), `${out.tool || 'A command'} cancelled`).run();
  return c.json(out);
});

// ------------------------------------------------------------------ exports: download (recorded) and save to a revision

cadRoutes.get('/c/:company/cad/exports/:id/file', async (c) => {
  const a = await requireCad(c);
  need(a.perms.export, 'Your role cannot download CAD files in this company. Ask an administrator.', 'CAD_EXPORT_FORBIDDEN');
  await rateLimit(c.env.DB, `cad-download:${a.erp.userId}`, 120, 60 * 60_000);
  const f = await cadFile(c.env, a.claims, `exports/${enc(c.req.param('id'))}/file`, 128 * 1024 * 1024);
  await event(c, a, 'cad.export_downloaded', 'cad_export', c.req.param('id'), `Downloaded ${f.name} (${Math.round(f.size / 1024)} KB)`, { after: { sha256: f.sha256 } }).run();
  return new Response(f.bytes, {
    headers: {
      'Content-Type': f.type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${enc(f.name)}`,
      'Content-Length': String(f.size),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
});

// The installer, handed out by the ERP itself (setup step 1): nobody signs in to CAD Automation separately for it.
cadRoutes.get('/c/:company/cad/installer', async (c) => {
  const a = await requireCad(c);
  await rateLimit(c.env.DB, `cad-installer:${a.erp.userId}`, 20, 60 * 60_000);
  const f = await cadFile(c.env, a.claims, 'installer/file', 64 * 1024 * 1024);
  return new Response(f.bytes, {
    headers: {
      'Content-Type': 'application/x-msi',
      'Content-Disposition': `attachment; filename*=UTF-8''${enc(f.name)}`,
      'Content-Length': String(f.size),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Content-SHA256': f.sha256,
    },
  });
});

// ------------------------------------------------------------------ the person's own keys (CAD Automation's Settings)
// Owner, 20 Nov 2026: everything of CAD Automation inside the ERP. The private connector address (for AI apps that cannot
// sign in) and the add-in key (for the direct link without the Companion) are the person's own: CAD Automation hands them
// only to their owner, and the ERP passes them through without keeping them. Renewing one is in the company's history.

cadRoutes.get('/c/:company/cad/access', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot use CAD Automation in this company.');
  await rateLimit(c.env.DB, `cad-access:${a.erp.userId}`, 60, 10 * 60_000);
  const out = await cadJson<{ privateUrl: string; addinKey: string; service: string; package: boolean }>(c.env, a.claims, 'access');
  c.header('Cache-Control', 'no-store');
  return c.json(out);
});

cadRoutes.post('/c/:company/cad/access/private/new', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot use CAD Automation in this company.');
  await rateLimit(c.env.DB, `cad-access-new:${a.erp.userId}`, 10, 60 * 60_000);
  const out = await cadJson<{ privateUrl: string }>(c.env, a.claims, 'access/private/new');
  await event(c, a, 'cad.private_address_renewed', 'cad_access', null, 'Made a new private connector address (the old one stopped working)').run();
  c.header('Cache-Control', 'no-store');
  return c.json(out);
});

cadRoutes.post('/c/:company/cad/access/addin-key/new', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot use CAD Automation in this company.');
  await rateLimit(c.env.DB, `cad-access-new:${a.erp.userId}`, 10, 60 * 60_000);
  const out = await cadJson<{ addinKey: string }>(c.env, a.claims, 'access/addin-key/new');
  await event(c, a, 'cad.addin_key_renewed', 'cad_access', null, 'Made a new add-in key (the direct link stops until it is pasted in)').run();
  c.header('Cache-Control', 'no-store');
  return c.json(out);
});

// The add-in package for a manual installation (CAD Automation's SOLIDWORKS page), handed out by the ERP.
cadRoutes.get('/c/:company/cad/addin-package', async (c) => {
  const a = await requireCad(c);
  need(!!a.perms.operate, 'Your role cannot use CAD Automation in this company.');
  await rateLimit(c.env.DB, `cad-installer:${a.erp.userId}`, 20, 60 * 60_000);
  const f = await cadFile(c.env, a.claims, 'addin/package', 64 * 1024 * 1024);
  return new Response(f.bytes, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename*=UTF-8''${enc(f.name)}`,
      'Content-Length': String(f.size),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
});

const saveSchema = z.object({
  productId: zId,
  revisionId: zId.nullable().optional(),
  documentId: zId.optional(),
  title: z.string().trim().max(200).optional(),
  kind: z.enum(['drawing', 'model', 'pdf', 'dxf', 'step', 'specification', 'image', 'other']).optional(),
  docRevision: z.string().trim().max(20).optional(),
});

cadRoutes.post('/c/:company/cad/exports/:id/save', async (c) => {
  const a = await requireCad(c);
  const db = c.env.DB;
  need(await cadOn(db, a.erp.companyId, 'cad_products'), 'Saving CAD exports to products is not switched on for this company.', 'CAD_FEATURE_OFF');
  need(a.perms.export, 'Your role cannot take CAD files out of CAD Automation in this company.', 'CAD_EXPORT_FORBIDDEN');
  assertCan(a.erp, 'documents.edit');
  await rateLimit(db, `erp-upload:${a.erp.userId}`, 60, 60_000);
  const input = await body(c, saveSchema);
  const p = await db.prepare('SELECT id, number, archived_at FROM erp_products WHERE company_id = ? AND id = ?').bind(a.erp.companyId, input.productId).first<{ id: string; number: string; archived_at: number | null }>();
  if (!p) throw notFound('Product');
  if (p.archived_at) throw new HttpError(409, `${p.number} is archived: restore it first`);
  let revLabel: string | null = null;
  if (input.revisionId) {
    const r = await db.prepare('SELECT label FROM erp_revisions WHERE company_id = ? AND id = ? AND product_id = ?').bind(a.erp.companyId, input.revisionId, p.id).first<{ label: string }>();
    if (!r) throw notFound('Revision');
    revLabel = r.label;
  }
  const exportId = c.req.param('id');
  const f = await cadFile(c.env, a.claims, `exports/${enc(exportId)}/file`, MAX_FILE_BYTES);
  // The same checks as a person's upload: the type is known and its content matches it.
  let file: { name: string; type: string; bytes: Uint8Array };
  try {
    file = await validateEngineeringUpload(new File([f.bytes], f.name, { type: f.type }));
  } catch (e) {
    if (e instanceof HttpError && e.status === 400) throw new HttpError(400, `The ERP keeps PDF, DWG, DXF, STEP and image files. ${e.message}. Download this one instead.`, { code: 'CAD_EXPORT_TYPE' });
    throw e;
  }
  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  const kind = input.kind ?? DOC_KIND_BY_EXT[ext] ?? 'other';
  const t = now();
  const source = (docId: string, versionId: string) =>
    db
      .prepare('INSERT INTO cad_document_sources (company_id, version_id, document_id, export_id, command_id, format, file_name, sha256, size, saved_by, saved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(a.erp.companyId, versionId, docId, exportId, c.req.query('command') ?? null, ext, file.name, f.sha256, file.bytes.byteLength, a.erp.userId, t);
  const v = { fields: {}, file, cad: null };
  if (input.documentId) {
    const d = await db.prepare('SELECT id, number, product_id, status FROM erp_documents WHERE company_id = ? AND id = ?').bind(a.erp.companyId, input.documentId).first<{ id: string; number: string; product_id: string; status: string }>();
    if (!d || d.product_id !== p.id) throw notFound('Document');
    if (d.status === 'obsolete') throw new HttpError(409, `${d.number} is obsolete`);
    const n = await db.prepare('SELECT COALESCE(MAX(version), 0) + 1 AS n FROM erp_document_versions WHERE company_id = ? AND document_id = ?').bind(a.erp.companyId, d.id).first<{ n: number }>();
    const ver = await versionStatements(c, a.erp, d.id, Number(n?.n ?? 1), v, input.docRevision ?? '', 'From CAD Automation', t);
    try {
      await db.batch([
        ver.stmt,
        // A new version needs approval again, as for any upload.
        db.prepare("UPDATE erp_documents SET status = 'draft', approved_by = NULL, approved_at = NULL, updated_at = ? WHERE company_id = ? AND id = ?").bind(t, a.erp.companyId, d.id),
        source(d.id, ver.id),
        event(c, a, 'cad.export_saved', 'cad_export', exportId, `CAD export ${file.name} saved as version ${n?.n ?? 1} of ${d.number}`, { productId: p.id, after: { sha256: f.sha256 } }),
      ]);
    } catch (e) {
      c.executionCtx.waitUntil(c.env.FILES.delete(`erp/${a.erp.companyId}/documents/${d.id}/${ver.id}`));
      throw e;
    }
    return c.json(docDTO(await loadDoc(db, a.erp.companyId, d.id)), 201);
  }
  const id = newId();
  const number = await nextNumber(db, a.erp.companyId, 'document');
  const title = input.title || file.name.replace(/\.[^.]+$/, '');
  const ver = await versionStatements(c, a.erp, id, 1, v, input.docRevision ?? '', 'From CAD Automation', t);
  try {
    await db.batch([
      db
        .prepare("INSERT INTO erp_documents (id, company_id, number, product_id, revision_id, title, kind, status, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)")
        .bind(id, a.erp.companyId, number, p.id, input.revisionId ?? null, title, kind, searchText(number, title, p.number, file.name, 'CAD Automation'), a.erp.userId, t, t),
      ver.stmt,
      source(id, ver.id),
      eventStmt(db, { companyId: a.erp.companyId, actorId: a.erp.userId, action: 'document.created', entityType: 'document', entityId: id, productId: p.id, summary: `Document ${number} added to ${p.number}${revLabel ? ` revision ${revLabel}` : ''}: ${title} (from CAD Automation, ${file.name})`, after: { title, kind, version: 1 }, at: t }),
      event(c, a, 'cad.export_saved', 'cad_export', exportId, `CAD export ${file.name} saved as ${number} on ${p.number}`, { productId: p.id, after: { sha256: f.sha256 } }),
    ]);
  } catch (e) {
    c.executionCtx.waitUntil(c.env.FILES.delete(`erp/${a.erp.companyId}/documents/${id}/${ver.id}`));
    throw e;
  }
  return c.json(docDTO(await loadDoc(db, a.erp.companyId, id)), 201);
});

// Where saved documents came from (for the product and revision pages).
cadRoutes.get('/c/:company/cad/sources', async (c) => {
  const a = await requireCad(c);
  const productId = c.req.query('productId') ?? '';
  const rows = await c.env.DB
    .prepare(
      `SELECT s.version_id, s.document_id, s.export_id, s.command_id, s.format, s.file_name, s.sha256, s.size, s.saved_at, u.name AS saved_by_name
         FROM cad_document_sources s JOIN erp_documents d ON d.company_id = s.company_id AND d.id = s.document_id
         LEFT JOIN users u ON u.id = s.saved_by
        WHERE s.company_id = ? AND d.product_id = ? ORDER BY s.saved_at DESC LIMIT 500`,
    )
    .bind(a.erp.companyId, productId.slice(0, 64))
    .all<any>();
  return c.json({ sources: rows.results.map((r) => ({ versionId: r.version_id, documentId: r.document_id, exportId: r.export_id, commandId: r.command_id, format: r.format, fileName: r.file_name, sha256: r.sha256, size: r.size, savedAt: r.saved_at, savedByName: r.saved_by_name })) });
});

// ------------------------------------------------------------------ bill of materials proposals (5.2)

interface ProposalLine {
  name: string;
  file: string;
  quantity: number;
  productId: string | null;
  productNumber: string | null;
}

/** Top-level components of an assembly read, grouped by part file, matched to products by number (else by name). */
export async function linesFromAssembly(db: D1Database, companyId: string, result: any): Promise<{ assembly: string; lines: ProposalLine[] }> {
  if (!result || typeof result !== 'object' || result.kind !== 'assembly' || !Array.isArray(result.components)) {
    throw new HttpError(409, 'That read is not of an assembly. Open the assembly in SOLIDWORKS and read it again.', { code: 'CAD_NOT_ASSEMBLY' });
  }
  const groups = new Map<string, { name: string; file: string; quantity: number }>();
  for (const comp of result.components as any[]) {
    if (!comp || comp.suppressed) continue;
    const file = String(comp.file ?? '').slice(0, 1000);
    const base = (file.split(/[\\/]/).pop() ?? '').replace(/\.(sldprt|sldasm|prt|asm)$/i, '') || String(comp.name ?? '').replace(/-\d+$/, '');
    if (!base) continue;
    const key = base.toLowerCase();
    const g = groups.get(key) ?? { name: base.slice(0, 200), file, quantity: 0 };
    g.quantity += 1;
    groups.set(key, g);
  }
  const lines: ProposalLine[] = [];
  for (const g of groups.values()) {
    const match =
      (await db.prepare('SELECT id, number FROM erp_products WHERE company_id = ? AND number = ? COLLATE NOCASE AND archived_at IS NULL').bind(companyId, g.name).first<{ id: string; number: string }>()) ??
      (await db.prepare('SELECT id, number FROM erp_products WHERE company_id = ? AND name = ? COLLATE NOCASE AND archived_at IS NULL LIMIT 1').bind(companyId, g.name).first<{ id: string; number: string }>());
    lines.push({ ...g, productId: match?.id ?? null, productNumber: match?.number ?? null });
  }
  lines.sort((x, y) => x.name.localeCompare(y.name));
  return { assembly: String(result.title ?? '').slice(0, 260), lines: lines.slice(0, 500) };
}

cadRoutes.post('/c/:company/cad/assembly/read', async (c) => {
  const a = await requireCad(c);
  need(await cadOn(c.env.DB, a.erp.companyId, 'cad_bom'), 'Bill of materials proposals are not switched on for this company.', 'CAD_FEATURE_OFF');
  need(!!a.perms.operate, 'Your role cannot send work to computers in this company.');
  assertCan(a.erp, 'products.edit');
  const input = await body(c, z.object({ device: zId.optional() }));
  const out = await cadJson<{ commandId: string }>(c.env, a.claims, 'assembly/read', { device: input.device ?? null });
  await event(c, a, 'cad.assembly_read', 'cad_command', out.commandId, 'Asked SOLIDWORKS to read the open assembly for a bill of materials').run();
  return c.json(out, 202);
});

const proposalDTO = (r: any) => ({
  id: r.id,
  productId: r.product_id,
  revisionId: r.revision_id,
  commandId: r.command_id,
  assembly: r.assembly,
  lines: parseJson<ProposalLine[]>(r.lines_json, []),
  status: r.status,
  note: r.note,
  createdBy: r.created_by,
  createdByName: r.created_by_name ?? null,
  createdAt: r.created_at,
  decidedByName: r.decided_by_name ?? null,
  decidedAt: r.decided_at,
});

cadRoutes.post('/c/:company/cad/bom-proposals', async (c) => {
  const a = await requireCad(c);
  const db = c.env.DB;
  need(await cadOn(db, a.erp.companyId, 'cad_bom'), 'Bill of materials proposals are not switched on for this company.', 'CAD_FEATURE_OFF');
  assertCan(a.erp, 'products.edit');
  const input = await body(c, z.object({ commandId: zId, revisionId: zId }));
  const r = await loadRevision(db, a.erp.companyId, input.revisionId);
  assertEditable(r);
  const cmd = await cadJson<{ command: { status: string; tool: string; result: unknown } }>(c.env, a.claims, 'commands/get', { id: input.commandId });
  if (cmd.command.status !== 'succeeded') throw new HttpError(409, ['failed', 'rejected', 'denied', 'unknown', 'expired', 'cancelled'].includes(cmd.command.status) ? 'SOLIDWORKS could not read the assembly. See the command in the history.' : 'SOLIDWORKS has not finished reading the assembly yet.', { code: 'CAD_NOT_DONE' });
  const { assembly, lines } = await linesFromAssembly(db, a.erp.companyId, cmd.command.result);
  if (!lines.length) throw new HttpError(409, 'The assembly has no components to propose.', { code: 'CAD_EMPTY_ASSEMBLY' });
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare('INSERT INTO cad_bom_proposals (id, company_id, product_id, revision_id, command_id, assembly, lines_json, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.erp.companyId, r.product_id, r.id, input.commandId, assembly, JSON.stringify(lines), a.erp.userId, t),
    event(c, a, 'cad.bom_proposed', 'cad_bom_proposal', id, `Bill of materials proposed from ${assembly || 'an assembly'} for revision ${r.label} of ${r.product_number}: ${lines.length} lines, ${lines.filter((l) => !l.productId).length} without a matching product`, { productId: r.product_id }),
  ]);
  const row = await db.prepare('SELECT p.*, u.name AS created_by_name FROM cad_bom_proposals p LEFT JOIN users u ON u.id = p.created_by WHERE p.company_id = ? AND p.id = ?').bind(a.erp.companyId, id).first<any>();
  return c.json(proposalDTO(row), 201);
});

cadRoutes.get('/c/:company/cad/bom-proposals', async (c) => {
  const a = await requireCad(c);
  const rows = await c.env.DB
    .prepare(
      `SELECT p.*, u.name AS created_by_name, d.name AS decided_by_name FROM cad_bom_proposals p LEFT JOIN users u ON u.id = p.created_by LEFT JOIN users d ON d.id = p.decided_by
        WHERE p.company_id = ? AND p.revision_id = ? ORDER BY p.created_at DESC LIMIT 50`,
    )
    .bind(a.erp.companyId, (c.req.query('revisionId') ?? '').slice(0, 64))
    .all<any>();
  return c.json({ proposals: rows.results.map(proposalDTO) });
});

async function loadProposal(db: D1Database, companyId: string, id: string) {
  const p = await db.prepare('SELECT * FROM cad_bom_proposals WHERE company_id = ? AND id = ?').bind(companyId, id).first<any>();
  if (!p) throw notFound('Proposal');
  if (p.status !== 'proposed') throw new HttpError(409, `This proposal was already ${p.status}.`);
  return p;
}

// Applying adds or changes lines of the proposal's draft or in-change revision only (assertEditable); a released bill of
// materials is never touched. Lines without a matching product are left out, and said so.
cadRoutes.post('/c/:company/cad/bom-proposals/:id/apply', async (c) => {
  const a = await requireCad(c);
  const db = c.env.DB;
  need(await cadOn(db, a.erp.companyId, 'cad_bom'), 'Bill of materials proposals are not switched on for this company.', 'CAD_FEATURE_OFF');
  assertCan(a.erp, 'products.edit');
  const p = await loadProposal(db, a.erp.companyId, c.req.param('id'));
  const r = await loadRevision(db, a.erp.companyId, p.revision_id);
  assertEditable(r);
  const lines = parseJson<ProposalLine[]>(p.lines_json, []);
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let added = 0;
  let changed = 0;
  const skipped: string[] = [];
  let pos = Number((await db.prepare('SELECT COALESCE(MAX(position), 0) AS p FROM erp_bom_lines WHERE company_id = ? AND revision_id = ?').bind(a.erp.companyId, r.id).first<{ p: number }>())?.p ?? 0);
  for (const l of lines) {
    if (!l.productId) {
      skipped.push(`${l.name} (no product with this number)`);
      continue;
    }
    if (l.productId === r.product_id) {
      skipped.push(`${l.name} (the product itself)`);
      continue;
    }
    const comp = await db.prepare('SELECT id, number, uom, archived_at FROM erp_products WHERE company_id = ? AND id = ?').bind(a.erp.companyId, l.productId).first<any>();
    if (!comp || comp.archived_at) {
      skipped.push(`${l.name} (product archived or gone)`);
      continue;
    }
    try {
      await assertNoCycle(db, a.erp.companyId, r.product_id, comp.id);
    } catch {
      skipped.push(`${l.name} (would make the structure contain itself)`);
      continue;
    }
    const existing = await db.prepare('SELECT id, quantity FROM erp_bom_lines WHERE company_id = ? AND revision_id = ? AND component_id = ? ORDER BY position LIMIT 1').bind(a.erp.companyId, r.id, comp.id).first<{ id: string; quantity: number }>();
    if (existing) {
      if (Number(existing.quantity) === l.quantity) continue;
      stmts.push(db.prepare('UPDATE erp_bom_lines SET quantity = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(l.quantity, t, a.erp.companyId, existing.id));
      changed++;
    } else {
      pos += 10;
      stmts.push(
        db
          .prepare(
            `INSERT INTO erp_bom_lines (id, company_id, revision_id, component_id, quantity, uom, scrap_pct, ref_designator, position, effective_from, effective_to, optional, alt_group, notes, created_by, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 0, '', ?, NULL, NULL, 0, '', ?, ?, ?, ?)`,
          )
          .bind(newId(), a.erp.companyId, r.id, comp.id, l.quantity, comp.uom ?? 'each', pos, 'From CAD Automation', a.erp.userId, t, t),
      );
      added++;
    }
  }
  const note = skipped.length ? `Not applied: ${skipped.join('; ')}`.slice(0, 2000) : '';
  stmts.push(
    db.prepare("UPDATE cad_bom_proposals SET status = 'applied', note = ?, decided_by = ?, decided_at = ? WHERE company_id = ? AND id = ? AND status = 'proposed'").bind(note, a.erp.userId, t, a.erp.companyId, p.id),
    db.prepare('UPDATE erp_revisions SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.erp.companyId, r.id),
    eventStmt(db, { companyId: a.erp.companyId, actorId: a.erp.userId, action: 'bom.cad_applied', entityType: 'revision', entityId: r.id, productId: r.product_id, summary: `Bill of materials proposal from CAD Automation applied to revision ${r.label} of ${r.product_number}: ${added} added, ${changed} changed, ${skipped.length} left out`, at: t }),
  );
  await db.batch(stmts);
  return c.json({ added, changed, skipped });
});

cadRoutes.post('/c/:company/cad/bom-proposals/:id/reject', async (c) => {
  const a = await requireCad(c);
  const db = c.env.DB;
  assertCan(a.erp, 'products.edit');
  const p = await loadProposal(db, a.erp.companyId, c.req.param('id'));
  const input = await body(c, z.object({ note: z.string().trim().max(1000).optional() }));
  const t = now();
  await db.batch([
    db.prepare("UPDATE cad_bom_proposals SET status = 'rejected', note = ?, decided_by = ?, decided_at = ? WHERE company_id = ? AND id = ? AND status = 'proposed'").bind(input.note ?? '', a.erp.userId, t, a.erp.companyId, p.id),
    event(c, a, 'cad.bom_rejected', 'cad_bom_proposal', p.id, 'Bill of materials proposal from CAD Automation rejected', { productId: p.product_id }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ review tasks in Projects (5.6)

/** Boards of the company's Projects and Tasks workspaces the person can add tasks to. */
cadRoutes.get('/c/:company/cad/review-boards', async (c) => {
  const a = await requireCad(c);
  const db = c.env.DB;
  if (!(await cadOn(db, a.erp.companyId, 'cad_projects')) || !can(a.erp, 'documents.edit')) return c.json({ enabled: false, boards: [] });
  const ws = await db.prepare("SELECT m.workspace_id FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id AND w.deleted_at IS NULL WHERE m.user_id = ? AND m.status = 'active'").bind(a.erp.userId).all<{ workspace_id: string }>();
  const boards: { id: string; name: string }[] = [];
  for (const w of ws.results) {
    if ((await companyOfTool(db, 'tasks', w.workspace_id)) !== a.erp.companyId) continue;
    const bs = await db.prepare('SELECT id FROM boards WHERE workspace_id = ? AND archived_at IS NULL ORDER BY name LIMIT 100').bind(w.workspace_id).all<{ id: string }>();
    for (const b of bs.results) {
      const auth = await loadBoardAuth(db, b.id, a.erp.userId);
      if (auth && auth.access !== 'view') boards.push({ id: b.id, name: auth.board.name });
    }
  }
  return c.json({ enabled: true, boards });
});

cadRoutes.post('/c/:company/cad/documents/:id/review', async (c) => {
  const a = await requireCad(c);
  const db = c.env.DB;
  need(await cadOn(db, a.erp.companyId, 'cad_projects'), 'Review tasks in Projects are not switched on for this company.', 'CAD_FEATURE_OFF');
  assertCan(a.erp, 'documents.edit');
  const input = await body(c, z.object({ boardId: zId, note: z.string().trim().max(1000).optional() }));
  const d = docDTO(await loadDoc(db, a.erp.companyId, c.req.param('id')));
  const auth = await loadBoardAuth(db, input.boardId, a.erp.userId);
  if (!auth || auth.access === 'view') throw notFound('Board');
  if ((await companyOfTool(db, 'tasks', auth.board.workspace_id)) !== a.erp.companyId) throw notFound('Board');
  const link = `/erp/c/${a.erp.companyId}/products/${d.productId}`;
  const item = await createItem(svcFromContext(c), auth.board, {
    name: `Review ${d.number}: ${d.title}`.slice(0, 250),
    description: [`Please review engineering document ${d.number} (${d.kindLabel}) of ${d.productNumber ?? 'the product'}${d.revisionLabel ? `, revision ${d.revisionLabel}` : ''}.`, input.note ?? '', `Open it in BIZOMAT ERP: ${link}`].filter(Boolean).join('\n\n'),
  }, await loadColumns(db, auth.board.id));
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO cad_review_tasks (company_id, document_id, item_id, board_id, requested_by, requested_at) VALUES (?, ?, ?, ?, ?, ?)').bind(a.erp.companyId, d.id, item.id, auth.board.id, a.erp.userId, t),
    event(c, a, 'cad.review_requested', 'cad_review', d.id, `Review of ${d.number} asked for in Projects (${auth.board.name})`, { productId: d.productId }),
  ]);
  return c.json({ itemId: item.id, boardId: auth.board.id, workspaceId: auth.board.workspace_id }, 201);
});

// ------------------------------------------------------------------ company settings: who may download

cadRoutes.get('/c/:company/cad/settings', async (c) => {
  const a = await requireCad(c);
  return c.json({ download: await downloadConfig(c.env.DB, a.erp.companyId), defaults: DOWNLOAD_DEFAULTS, canChange: a.role === 'owner' || a.role === 'admin' });
});

cadRoutes.put('/c/:company/cad/settings', async (c) => {
  const a = await requireCad(c);
  need(a.role === 'owner' || a.role === 'admin', 'Only the owner and administrators can change who may download CAD files.');
  const input = await body(c, z.object({ download: z.object({ manager: z.boolean(), employee: z.boolean() }) }));
  const t = now();
  await c.env.DB.batch([
    c.env.DB
      .prepare("INSERT INTO company_settings (company_id, key, value_json, updated_by, updated_at) VALUES (?, 'cad.download', ?, ?, ?) ON CONFLICT(company_id, key) DO UPDATE SET value_json = excluded.value_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at")
      .bind(a.erp.companyId, JSON.stringify(input.download), a.erp.userId, t),
    event(c, a, 'cad.settings_changed', 'cad_settings', null, `CAD downloads: managers ${input.download.manager ? 'may' : 'may not'}, employees ${input.download.employee ? 'may' : 'may not'}`, { after: input.download }),
  ]);
  return c.json({ download: input.download });
});
