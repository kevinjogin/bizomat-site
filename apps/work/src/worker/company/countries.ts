// Countries, their registration numbers and their registers (Stage 1, R6; brief 5.2; docs/platform/verification.md).
// One table of data: for each country, the identifiers it accepts, how each is checked for format, and the register
// (provider) that can be asked about it, if any. Countries not listed are verified by hand, with evidence. Change this
// table, not the code that reads it.

import { abnValid, acnValid } from './verify';

export type ProviderId = 'abr' | 'companies_house';

export interface IdentifierRule {
  /** Stored as companies.registration_type. */
  type: string;
  label: string;
  /** Turns what was typed into the stored form (spaces and dashes out, upper case where the format needs it). */
  normalise: (input: string) => string;
  /** Whether the stored form has the right shape (and check digits, where the identifier has them). */
  valid: (value: string) => boolean;
  example: string;
  /** The register that can be asked about it. None: verified by hand. */
  provider?: ProviderId;
  /** Checked for format only, never a proof of registration (the United States EIN). */
  formatOnly?: boolean;
}

export interface CountryRule {
  code: string;
  name: string;
  identifiers: IdentifierRule[];
  /** Legal structures, for the form. Structures in noNumber register without a number and are verified by hand. */
  structures: { id: string; label: string }[];
  noNumber: string[];
  note: string;
}

const digits = (s: string) => s.replace(/[\s-]/g, '');
const upper = (s: string) => s.replace(/\s+/g, '').toUpperCase();

export const COUNTRIES: Record<string, CountryRule> = {
  AU: {
    code: 'AU',
    name: 'Australia',
    identifiers: [
      { type: 'ABN', label: 'Australian Business Number (ABN)', normalise: digits, valid: abnValid, example: '51 824 753 556', provider: 'abr' },
      { type: 'ACN', label: 'Australian Company Number (ACN)', normalise: digits, valid: acnValid, example: '004 085 616' },
    ],
    structures: [
      { id: 'company', label: 'Company' },
      { id: 'sole_trader', label: 'Sole trader' },
      { id: 'partnership', label: 'Partnership' },
      { id: 'trust', label: 'Trust' },
      { id: 'other', label: 'Other' },
    ],
    noNumber: [],
    note: 'ABNs are looked up on the Australian Business Register (ABN Lookup) when it is set up; ACNs are checked for format.',
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    identifiers: [{ type: 'CRN', label: 'Companies House number', normalise: upper, valid: (v) => /^(?:\d{8}|[A-Z]{2}\d{6})$/.test(v), example: '01234567', provider: 'companies_house' }],
    structures: [
      { id: 'limited_company', label: 'Limited company' },
      { id: 'llp', label: 'Limited liability partnership' },
      { id: 'sole_trader', label: 'Sole trader' },
      { id: 'partnership', label: 'Partnership' },
    ],
    noNumber: ['sole_trader', 'partnership'],
    note: 'Company numbers are looked up on Companies House when it is set up. Sole traders and partnerships are verified by hand.',
  },
  IN: {
    code: 'IN',
    name: 'India',
    identifiers: [
      { type: 'CIN', label: 'Corporate Identification Number (CIN)', normalise: upper, valid: (v) => /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(v), example: 'U72900KA2015PTC123456' },
      { type: 'LLPIN', label: 'LLP Identification Number (LLPIN)', normalise: upper, valid: (v) => /^[A-Z]{3}-\d{4}$/.test(v), example: 'AAB-1234' },
      { type: 'GSTIN', label: 'GST Identification Number (GSTIN)', normalise: upper, valid: (v) => /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v), example: '29ABCDE1234F1Z5' },
    ],
    structures: [
      { id: 'private_limited', label: 'Private limited company' },
      { id: 'public_limited', label: 'Public limited company' },
      { id: 'llp', label: 'Limited liability partnership' },
      { id: 'sole_proprietor', label: 'Sole proprietor' },
      { id: 'partnership', label: 'Partnership' },
    ],
    noNumber: ['sole_proprietor', 'partnership'],
    note: 'No permitted official lookup is in place, so Indian companies are verified by hand with evidence.',
  },
  US: {
    code: 'US',
    name: 'United States',
    identifiers: [
      { type: 'STATE_ENTITY', label: 'State and state entity number (for example DE:1234567)', normalise: upper, valid: (v) => /^[A-Z]{2}:[A-Z0-9-]{1,20}$/.test(v), example: 'DE:1234567' },
      { type: 'EIN', label: 'Employer Identification Number (format check only)', normalise: digits, valid: (v) => /^\d{9}$/.test(v), example: '12-3456789', formatOnly: true },
    ],
    structures: [
      { id: 'corporation', label: 'Corporation' },
      { id: 'llc', label: 'Limited liability company' },
      { id: 'partnership', label: 'Partnership' },
      { id: 'sole_proprietor', label: 'Sole proprietor' },
    ],
    noNumber: ['sole_proprietor', 'partnership'],
    note: 'There is no national register: United States companies are verified by hand with evidence. State registers may be added later.',
  },
};

/** Any other country: a registration number of up to 40 letters, digits and dashes, verified by hand. */
const OTHER: IdentifierRule = { type: 'OTHER', label: 'Registration number', normalise: upper, valid: (v) => /^[A-Z0-9/.-]{2,40}$/.test(v), example: 'As on the certificate' };

export function countryRule(code: string): CountryRule {
  const c = COUNTRIES[code];
  if (c) return c;
  return { code, name: code, identifiers: [OTHER], structures: [{ id: 'company', label: 'Company' }, { id: 'sole_trader', label: 'Sole trader' }, { id: 'other', label: 'Other' }], noNumber: ['sole_trader'], note: 'Verified by hand with evidence.' };
}

export const isCountryCode = (s: string) => /^[A-Z]{2}$/.test(s);

/** Checks and normalises a registration number for a country. */
export function checkIdentifier(country: string, type: string, input: string): { ok: true; type: string; value: string; rule: IdentifierRule } | { ok: false; message: string } {
  const rule = countryRule(country).identifiers.find((i) => i.type === type);
  if (!rule) return { ok: false, message: `Choose one of the registration numbers used in ${countryRule(country).name}` };
  const value = rule.normalise(input);
  if (!rule.valid(value)) return { ok: false, message: `That does not look like a valid ${rule.label} (for example ${rule.example})` };
  return { ok: true, type: rule.type, value, rule };
}

/** The register that can verify an identifier, if any (an EIN is format only). */
export function providerFor(country: string, type: string): ProviderId | null {
  const rule = countryRule(country).identifiers.find((i) => i.type === type);
  return rule && !rule.formatOnly ? (rule.provider ?? null) : null;
}

/** The countries and their rules, for the registration form (no functions). */
export function countryOptions() {
  return Object.values(COUNTRIES).map((c) => ({
    code: c.code,
    name: c.name,
    identifiers: c.identifiers.map((i) => ({ type: i.type, label: i.label, example: i.example, register: i.provider && !i.formatOnly ? i.provider : null })),
    structures: c.structures,
    noNumber: c.noNumber,
    note: c.note,
  }));
}
