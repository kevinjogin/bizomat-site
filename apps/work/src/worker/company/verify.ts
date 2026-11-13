// Checks for a company's registration details (owner's request, 13 Nov 2026: "genuine account creation with business
// number for verification, legitimate emails and contact numbers, and addresses with postcodes"). Each check says what
// it proves and nothing more:
//
//   * ABN: the 11 digits must pass the Australian Business Register's check-digit rule (modulus 89). That proves the
//     number is well formed, not that it is registered. When ABR_GUID is set (a free web services GUID from the ABR),
//     the number is looked up on the register: it must be active, and the register's entity name, entity type, GST
//     registration, state and postcode are stored with the company. Without the GUID, or when the register cannot be
//     reached, the company is marked "format checked" and the maintenance run looks it up later.
//   * ACN: 9 digits with the ASIC check digit.
//   * Phone: an Australian number in the numbering plan (mobile 04, geographic 02/03/07/08, 13, 1300, 1800), not one of
//     the numbers ACMA reserves for fiction, and not a run of one digit. There is no SMS provider, so a number is never
//     called "verified": it is "checked against the numbering plan".
//   * Postcode: four digits inside Australia Post's ranges for the state; compared with the ABR's main business
//     location when the register was consulted.
//   * Email: the sign-up checks (src/worker/services/signup-guard.ts: mail servers, disposable and blocked domains),
//     then a confirmation link (src/worker/company/routes.ts).

import type { Env } from '../env';

export const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'] as const;
export type State = (typeof STATES)[number];

export const STATE_NAMES: Record<State, string> = {
  ACT: 'Australian Capital Territory',
  NSW: 'New South Wales',
  NT: 'Northern Territory',
  QLD: 'Queensland',
  SA: 'South Australia',
  TAS: 'Tasmania',
  VIC: 'Victoria',
  WA: 'Western Australia',
};

const digitsOnly = (s: string) => s.replace(/[\s.\-()]/g, '');

// ------------------------------------------------------------------ ABN and ACN

const ABN_WEIGHTS = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

/** An ABN as 11 digits (spaces taken out), or null when it is not 11 digits. */
export function normaliseAbn(input: string): string | null {
  const d = digitsOnly(input);
  return /^\d{11}$/.test(d) ? d : null;
}

/** The ABR's check-digit rule: subtract 1 from the first digit, weight, sum, divisible by 89. */
export function abnValid(abn: string): boolean {
  if (!/^\d{11}$/.test(abn) || abn[0] === '0') return false;
  let sum = 0;
  for (let i = 0; i < 11; i++) sum += (Number(abn[i]) - (i === 0 ? 1 : 0)) * ABN_WEIGHTS[i];
  return sum % 89 === 0;
}

/** "51824753556" -> "51 824 753 556". */
export function formatAbn(abn: string): string {
  return abn.length === 11 ? `${abn.slice(0, 2)} ${abn.slice(2, 5)} ${abn.slice(5, 8)} ${abn.slice(8)}` : abn;
}

/** ASIC's ACN check digit: weights 8..1 on the first 8 digits, (10 - sum mod 10) mod 10. */
export function acnValid(acn: string): boolean {
  if (!/^\d{9}$/.test(acn)) return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(acn[i]) * (8 - i);
  return (10 - (sum % 10)) % 10 === Number(acn[8]);
}

export function normaliseAcn(input: string): string | null {
  const d = digitsOnly(input);
  return /^\d{9}$/.test(d) ? d : null;
}

// ------------------------------------------------------------------ postcodes

// Australia Post's postcode ranges by state, including PO box and large-volume-receiver ranges.
const POSTCODE_RANGES: Record<State, [number, number][]> = {
  NSW: [[1000, 1999], [2000, 2599], [2619, 2899], [2921, 2999]],
  ACT: [[200, 299], [2600, 2618], [2900, 2920]],
  VIC: [[3000, 3999], [8000, 8999]],
  QLD: [[4000, 4999], [9000, 9999]],
  SA: [[5000, 5999]],
  WA: [[6000, 6999]],
  TAS: [[7000, 7999]],
  NT: [[800, 999]],
};

/** The states whose postcode ranges include this postcode. */
export function statesForPostcode(postcode: string): State[] {
  if (!/^\d{4}$/.test(postcode)) return [];
  const n = Number(postcode);
  return STATES.filter((s) => POSTCODE_RANGES[s].some(([a, b]) => n >= a && n <= b));
}

export type Check = { ok: true } | { ok: false; field: string; message: string };

export function checkPostcode(postcode: string, state: string): Check {
  if (!/^\d{4}$/.test(postcode)) return { ok: false, field: 'postcode', message: 'An Australian postcode has four digits.' };
  if (!(STATES as readonly string[]).includes(state)) return { ok: false, field: 'state', message: 'Choose the state or territory.' };
  const states = statesForPostcode(postcode);
  if (!states.length) return { ok: false, field: 'postcode', message: `${postcode} is not an Australian postcode.` };
  if (!states.includes(state as State)) {
    return { ok: false, field: 'postcode', message: `${postcode} is a postcode in ${states.map((s) => STATE_NAMES[s]).join(' or ')}, not ${STATE_NAMES[state as State]}.` };
  }
  return { ok: true };
}

/** A street address must carry a number (a street number, unit, lot, PO Box or Locked Bag number). */
export function checkStreet(line1: string, line2: string): Check {
  if (line1.trim().length < 4) return { ok: false, field: 'addressLine1', message: 'Enter the street address.' };
  if (!/\d/.test(line1 + ' ' + line2)) return { ok: false, field: 'addressLine1', message: 'Include the street number (or the PO Box or Locked Bag number).' };
  return { ok: true };
}

export function checkSuburb(suburb: string): Check {
  const s = suburb.trim();
  if (s.length < 2 || s.length > 60 || !/^[A-Za-z][A-Za-z .'-]*$/.test(s)) return { ok: false, field: 'suburb', message: 'Enter the suburb or town, in letters.' };
  return { ok: true };
}

// ------------------------------------------------------------------ phone numbers

export type PhoneKind = 'mobile' | 'landline' | 'local_rate' | 'freecall';
export type PhoneCheck = { ok: true; value: string; kind: PhoneKind; display: string } | { ok: false; field: 'phone'; message: string };

// Numbers ACMA sets aside for use in film, television, radio and print: never a real business's number.
const FICTION_MOBILES = new Set([
  '0491570006', '0491570156', '0491570157', '0491570158', '0491570159', '0491570110', '0491570313', '0491570737',
  '0491571266', '0491571491', '0491571804', '0491572549', '0491572665', '0491572983', '0491573770', '0491573087',
  '0491574118', '0491574632', '0491575254', '0491575789', '0491576398', '0491576801', '0491577426', '0491577644',
  '0491578957', '0491578148', '0491578888', '0491579212', '0491579760', '0491579455',
]);
const FICTION_FREECALL = new Set(['1800160401', '1800975707', '1800975708', '1800975709', '1800975710', '1800975711', '1300975707', '1300975708', '1300975709', '1300975710', '1300975711']);

function placeholder(subscriber: string): boolean {
  return /^(\d)\1+$/.test(subscriber) || subscriber === '12345678' || subscriber === '87654321' || subscriber === '123456' || subscriber === '654321';
}

/** An Australian phone number, checked against the numbering plan and stored in one form. */
export function parsePhone(input: string): PhoneCheck {
  const bad = (message: string): PhoneCheck => ({ ok: false, field: 'phone', message });
  let s = digitsOnly(input.trim());
  if (!s) return bad('Enter a phone number.');
  if (s.startsWith('+')) {
    if (!s.startsWith('+61')) return bad('Use an Australian phone number (company accounts are for Australia for now).');
    s = '0' + s.slice(3);
  } else if (s.startsWith('0061')) s = '0' + s.slice(4);
  else if (s.startsWith('61') && s.length === 11) s = '0' + s.slice(2);
  if (!/^\d+$/.test(s)) return bad('A phone number has digits only (spaces and a leading + are fine).');
  let kind: PhoneKind;
  let display: string;
  let value: string;
  if (/^04\d{8}$/.test(s)) {
    kind = 'mobile';
    display = `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7)}`;
    value = '+61' + s.slice(1);
  } else if (/^0[2378]\d{8}$/.test(s)) {
    kind = 'landline';
    display = `(${s.slice(0, 2)}) ${s.slice(2, 6)} ${s.slice(6)}`;
    value = '+61' + s.slice(1);
  } else if (/^1300\d{6}$/.test(s)) {
    kind = 'local_rate';
    display = `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7)}`;
    value = s;
  } else if (/^1800\d{6}$/.test(s)) {
    kind = 'freecall';
    display = `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7)}`;
    value = s;
  } else if (/^13\d{4}$/.test(s)) {
    kind = 'local_rate';
    display = `${s.slice(0, 2)} ${s.slice(2, 4)} ${s.slice(4)}`;
    value = s;
  } else {
    return bad('That is not an Australian phone number: use a mobile (04..), a landline with its area code (02, 03, 07 or 08), or a 13, 1300 or 1800 number.');
  }
  const subscriber = kind === 'mobile' || kind === 'landline' ? s.slice(2) : s.slice(s.startsWith('13') && s.length === 6 ? 2 : 4);
  if (placeholder(subscriber)) return bad('Enter the company’s real phone number.');
  if (FICTION_MOBILES.has(s) || FICTION_FREECALL.has(s) || (kind === 'landline' && /^0[2378](5550|7010)/.test(s))) {
    return bad('That number is reserved for use in fiction and cannot be a real business number.');
  }
  return { ok: true, value, kind, display };
}

/** How a stored number is shown. */
export function displayPhone(value: string): string {
  if (value.startsWith('+61')) {
    const r = parsePhone(value);
    return r.ok ? r.display : value;
  }
  const r = parsePhone(value);
  return r.ok ? r.display : value;
}

// ------------------------------------------------------------------ the Australian Business Register

export type AbrResult =
  | { status: 'active' | 'cancelled'; entityName: string; entityType: string; gstFrom: string | null; state: string; postcode: string; acn: string; businessNames: string[] }
  | { status: 'not_found' }
  | { status: 'unavailable'; reason: 'not_configured' | 'unreachable' | 'rejected' };

type AbrFetch = (url: string) => Promise<Response>;
let abrFetchForTests: AbrFetch | null = null;
/** Tests answer for the register (no request leaves the test). */
export function setAbrFetchForTests(f: AbrFetch | null) {
  abrFetchForTests = f;
}

export function abrConfigured(env: Env): boolean {
  return !!env.ABR_GUID?.trim();
}

/** The ABR's record for an ABN (its JSON web service), or why it could not be consulted. */
export async function abrLookup(env: Env, abn: string): Promise<AbrResult> {
  const guid = env.ABR_GUID?.trim();
  if (!guid) return { status: 'unavailable', reason: 'not_configured' };
  const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${encodeURIComponent(abn)}&callback=abr&guid=${encodeURIComponent(guid)}`;
  let text: string;
  try {
    const res = await (abrFetchForTests ?? ((u: string) => fetch(u, { signal: AbortSignal.timeout(8000) })))(url);
    if (!res.ok) return { status: 'unavailable', reason: 'unreachable' };
    text = await res.text();
  } catch {
    return { status: 'unavailable', reason: 'unreachable' };
  }
  let data: Record<string, unknown>;
  try {
    const m = /^\s*[A-Za-z_$][\w$]*\(([\s\S]*)\)\s*;?\s*$/.exec(text);
    data = JSON.parse(m ? m[1] : text);
  } catch {
    return { status: 'unavailable', reason: 'unreachable' };
  }
  const message = String(data.Message ?? '');
  if (!data.Abn) return /guid/i.test(message) ? { status: 'unavailable', reason: 'rejected' } : { status: 'not_found' };
  const status = String(data.AbnStatus ?? '').toLowerCase() === 'active' ? 'active' : 'cancelled';
  const names = Array.isArray(data.BusinessName) ? (data.BusinessName as unknown[]).map((n) => String(n)).filter(Boolean) : [];
  return {
    status,
    entityName: String(data.EntityName ?? ''),
    entityType: String(data.EntityTypeName ?? ''),
    gstFrom: data.Gst ? String(data.Gst) : null,
    state: String(data.AddressState ?? ''),
    postcode: String(data.AddressPostcode ?? ''),
    acn: String(data.Acn ?? ''),
    businessNames: names,
  };
}

const SUFFIXES = /\b(PTY\.?|PROPRIETARY|LIMITED|LTD\.?|INC\.?|INCORPORATED|THE TRUSTEE FOR|TRUSTEE FOR|CO\.?|COMPANY)\b/g;

function tokens(name: string): string[] {
  return name
    .toUpperCase()
    .replace(/&/g, ' AND ')
    .replace(SUFFIXES, ' ')
    .replace(/[^A-Z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Whether a name entered matches a name on the register (word order, case, punctuation and "Pty Ltd" aside). */
export function namesMatch(entered: string, registered: string): boolean {
  const a = tokens(entered);
  const b = tokens(registered);
  if (!a.length || !b.length) return false;
  const sa = new Set(a);
  const sb = new Set(b);
  const aInB = a.every((t) => sb.has(t));
  const bInA = b.every((t) => sa.has(t));
  return (aInB && bInA) || (aInB && a.length >= 2) || (bInA && b.length >= 2);
}
