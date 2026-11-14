#!/usr/bin/env node
// BIZOMAT review preview: invented demo data for a temporary preview stack (.github/workflows/review-preview.yml),
// made through the apps' own API, through the gate (infrastructure/preview/gate.mjs). Never for production: it refuses
// any address other than this computer.
//
//   1. apps/work/scripts/seed-local.mjs: the "Acme Studio" Projects workspace, four teammates, boards and documents.
//   2. Sales and CRM: an organisation with deals and leads.
//   3. Finance and Accounting: a business workspace with an opening balance and transactions.
//   4. Maintenance: the demo user's own company, renamed "Acme Studio", with an asset hierarchy, requests and work
//      orders.
// Every name is invented; addresses use example.com. Sign in as demo@example.com (password printed by seed-local).
//
// Usage: node infrastructure/preview/seed-demo.mjs http://127.0.0.1:8090

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = (process.argv[2] || 'http://127.0.0.1:8090').replace(/\/$/, '');
if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(base)) throw new Error('The demo data is for a local preview stack only.');
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PASSWORD = 'Granite-harbour-2026!';
const today = new Date();
const day = (n) => new Date(today.getTime() + n * 86_400_000).toISOString().slice(0, 10);

const seed = spawnSync(process.execPath, [join(root, 'apps/work/scripts/seed-local.mjs'), '--url', `${base}/tasks`], { encoding: 'utf8' });
process.stdout.write(seed.stdout.split('\n').filter((l) => !/password/i.test(l)).join('\n'));
if (seed.status !== 0) {
  process.stderr.write(seed.stderr);
  process.exit(1);
}

async function api(method, path, body, s) {
  const headers = { Origin: base, 'Content-Type': 'application/json' };
  if (s) { headers.Cookie = s.cookie; headers['X-CSRF-Token'] = s.csrf; }
  const res = await fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} ${res.status} ${text.slice(0, 200)}`);
  return { res, data: text ? JSON.parse(text) : null };
}

const login = await api('POST', '/erp/api/auth/login', { email: 'demo@example.com', password: PASSWORD });
const s = { cookie: login.res.headers.getSetCookie().map((c) => c.split(';')[0]).find((c) => /(^|-)workos_sid=/.test(c)), csrf: login.data.csrfToken };
const A = (p) => `/erp/api${p}`;

// Sales and CRM.
const org = (await api('POST', A('/crm/orgs'), { name: 'Acme Studio', currency: 'AUD', timezone: 'Australia/Sydney' }, s)).data.id;
for (const [title, value] of [['Website relaunch for Harbour Cafe', 1850000], ['Brand refresh for Northside Physio', 940000], ['Product launch campaign for Ridge Tools', 2600000], ['Annual support for Coastline Realty', 720000], ['Online store for Fernleaf Florist', 1300000]]) {
  await api('POST', A(`/crm/orgs/${org}/deals`), { title, value }, s);
}
for (const [firstName, lastName] of [['Tara', 'Quinn'], ['Leo', 'Marsh'], ['Ana', 'Ruiz']]) {
  await api('POST', A(`/crm/orgs/${org}/leads`), { firstName, lastName, email: `${firstName.toLowerCase()}@example.com` }, s);
}

// Finance and Accounting.
const fin = (await api('POST', A('/fin/orgs'), { name: 'Acme Studio', kind: 'business', currency: 'AUD', timezone: 'Australia/Sydney', gstRegistered: true, gstBasis: 'accrual', basMethod: 'full' }, s)).data.id;
const accounts = (await api('GET', A(`/fin/orgs/${fin}/accounts`), undefined, s)).data;
const code = (c) => accounts.find((a) => a.code === c).id;
const tax = Object.fromEntries((await api('GET', A(`/fin/orgs/${fin}/tax-codes`), undefined, s)).data.map((t) => [t.code, t.id]));
await api('POST', A(`/fin/orgs/${fin}/accounts/${code('090')}/opening-balance`), { amount: 2500000, date: '2026-06-30' }, s);
for (const [kind, date, acct, amount, t] of [['receive', '2026-07-21', '200', 1210000, 'GST'], ['receive', '2026-08-18', '200', 880000, 'GST'], ['receive', '2026-10-02', '200', 1650000, 'GST'], ['spend', '2026-08-05', '453', 132000, 'GSTP'], ['spend', '2026-09-12', '453', 275000, 'GSTP']]) {
  await api('POST', A(`/fin/orgs/${fin}/transactions`), { kind, accountId: code('090'), date, taxMode: 'inclusive', lines: [{ accountId: code(acct), amount, taxCodeId: tax[t] }] }, s);
}

// The demo user's own company carries the studio's name.
const me = (await api('GET', A('/system/me'), undefined, s)).data;
const own = me.companies.find((c) => c.kind === 'own');
await api('PATCH', A(`/system/companies/${own.id}`), { name: 'Acme Studio' }, s);

// Maintenance.
const mt = (p) => A(`/maintenance/c/${own.id}${p}`);
const mtMe = (await api('GET', mt('/me'), undefined, s)).data;
const asset = async (b) => (await api('POST', mt('/assets'), b, s)).data;
const site = await asset({ number: 'SITE-01', name: 'Riverside workshop', category: 'Site', location: '12 Example Street', criticality: 'high' });
const area = await asset({ number: 'AREA-02', name: 'Fabrication bay', category: 'Area', parentId: site.id, criticality: 'high' });
const line = await asset({ number: 'LINE-03', name: 'Cutting line', category: 'Line', parentId: area.id, criticality: 'high' });
const laser = await asset({ number: 'MC-0104', name: 'Laser cutter', category: 'Machine', type: 'CNC laser', manufacturer: 'Example Machines', model: 'LX-3015', serialNumber: 'EX-55210', parentId: line.id, criticality: 'critical', strategy: 'preventive', purchaseDate: '2023-03-14', warrantyUntil: '2027-03-13', specs: [{ key: 'Power', value: '6 kW' }, { key: 'Bed size', value: '3000 x 1500 mm' }] });
await asset({ number: 'MC-0104-CH', name: 'Chiller unit', category: 'Component', parentId: laser.id, criticality: 'high' });
const brake = await asset({ number: 'MC-0107', name: 'Press brake', category: 'Machine', manufacturer: 'Example Machines', model: 'PB-160', parentId: line.id, criticality: 'high' });
const comp = await asset({ number: 'UT-0201', name: 'Air compressor', category: 'Utility', parentId: area.id, criticality: 'medium', status: 'under_maintenance' });
const req = async (b) => (await api('POST', mt('/requests'), b, s)).data;
const r1 = await req({ assetId: laser.id, priority: 'high', description: 'Chiller alarm on the laser cutter: coolant temperature high after twenty minutes of cutting.' });
await req({ assetId: brake.id, priority: 'medium', description: 'Back gauge does not return to zero after a job change.' });
await req({ assetId: comp.id, priority: 'urgent', description: 'Air compressor tripping the breaker on start-up.' });
await api('POST', mt(`/requests/${r1.id}/convert`), {
  jobType: 'corrective', priority: 'high', assignedTo: mtMe.user.id, dueStart: day(0), dueFinish: day(3), estimatedHours: 3,
  instructions: 'Check the coolant level and the chiller filter. Clean the condenser fins. Run the laser for thirty minutes and record the coolant temperature.',
  safety: 'Isolate and lock out the laser and the chiller before opening any panel.',
  tasks: ['Isolate and lock out', 'Check the coolant level and top up', 'Replace the chiller filter', 'Test run and record the temperature'],
  parts: [{ part: 'Chiller filter cartridge', quantity: 1 }],
}, s);
await api('POST', mt('/work-orders'), { assetId: brake.id, description: 'Quarterly check of the press brake hydraulics', jobType: 'inspection', priority: 'medium', dueFinish: day(6), assignedTo: mtMe.user.id, estimatedHours: 2 }, s);

console.log(`\nDemo data ready: Projects, Sales and CRM, Finance and Maintenance for "Acme Studio" (company ${own.id}).`);
