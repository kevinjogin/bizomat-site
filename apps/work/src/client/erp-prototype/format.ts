// Formatting and small helpers for the ERP prototype. The prototype's "today" is fixed so the demonstration data
// always tells the same story.
import { useEffect, useState } from 'react';
import type { Tone } from './types';

export const TODAY = '2026-11-13';
export const STORAGE = 'bizomat-erp-prototype:';

const AUD0 = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
const AUD2 = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NUM = new Intl.NumberFormat('en-AU');

export const money = (n: number, cents = false) => (cents ? AUD2 : AUD0).format(n);
export const num = (n: number) => NUM.format(n);
export function compactMoney(n: number) {
  const a = Math.abs(n);
  const s = a >= 1e6 ? `$${(a / 1e6).toFixed(2)}m` : a >= 1e3 ? `$${(a / 1e3).toFixed(a >= 1e5 ? 0 : 1)}k` : `$${Math.round(a)}`;
  return n < 0 ? `-${s}` : s;
}

export function parseDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
export function fmtDate(iso?: string | null) {
  if (!iso) return '';
  return parseDate(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
export function fmtDateTime(iso?: string | null) {
  if (!iso) return '';
  const time = iso.length > 10 ? iso.slice(11, 16) : '';
  return `${fmtDate(iso)}${time ? `, ${time}` : ''}`;
}
export function addDays(iso: string, n: number) {
  const d = parseDate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function daysFrom(iso: string, from = TODAY) {
  return Math.round((parseDate(iso).getTime() - parseDate(from).getTime()) / 86_400_000);
}
export function relDue(iso: string) {
  const d = daysFrom(iso);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d === -1) return 'Yesterday';
  return d < 0 ? `${-d} days overdue` : `In ${d} days`;
}
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthLabel = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(2, 4)}`;

/** Deterministic pseudo-random numbers, so the demonstration data is the same on every visit. */
export function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const pick = <T,>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)];
export const between = (r: () => number, min: number, max: number) => Math.round(min + r() * (max - min));
export const pad = (n: number, w = 4) => String(n).padStart(w, '0');

/** The tone of a status word: one map for every module, so the same word always looks the same. */
const TONES: Record<string, Tone> = {};
const tone = (t: Tone, words: string[]) => words.forEach((w) => (TONES[w.toLowerCase()] = t));
tone('success', ['Paid', 'Approved', 'Completed', 'Complete', 'Done', 'Passed', 'Pass', 'Received', 'Delivered', 'Won', 'Active', 'Released', 'Closed', 'On track', 'In stock', 'OK', 'Matched', 'Reconciled', 'Accepted', 'Available', 'Running well', 'Converted to PO', 'Replied', 'Reviewed', 'Shipped', 'Current', 'Effective', 'Enabled', 'Valid', 'Put away', 'Lodged']);
tone('warning', ['Awaiting approval', 'Partly paid', 'Partly received', 'At risk', 'In review', 'Low', 'Due soon', 'Pending', 'Awaiting review', 'Awaiting put-away', 'Awaiting payment', 'Expiring', 'Negotiation', 'Waiting', 'Reminded', 'Invited', 'In transit', 'Scheduled', 'On hold', 'Rework', 'Planned', 'Under review', 'Needs review', 'Queued', 'Expires soon', 'Proposal', 'Variance', 'To match']);
tone('danger', ['Late', 'Overdue', 'Delayed', 'Failed', 'Fail', 'Rejected', 'Returned', 'Out of stock', 'Blocked', 'Lost', 'Breakdown', 'Open NCR', 'Critical', 'Expired', 'Short', 'Disqualified', 'Locked out']);
tone('accent', ['Open', 'In progress', 'Sent', 'Submitted', 'Qualified', 'Qualify', 'Contacted', 'New', 'Confirmed', 'Picking', 'Ready', 'Approved to send']);
tone('info', ['Draft', 'Quoted', 'To do', 'Not started', 'Prospect', 'N/A', 'Requested']);
export const toneFor = (status?: string): Tone => (status ? TONES[status.toLowerCase()] ?? 'neutral' : 'neutral');

export type ExportOutcome = 'file' | 'copied' | 'blocked';

/**
 * Exports rows as CSV (every list and report). Saved as a file normally; when the prototype runs inside another
 * page's frame (a published preview), files cannot be saved, so the CSV is copied to the clipboard instead.
 */
export async function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]): Promise<ExportOutcome> {
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
  let framed: boolean;
  try {
    framed = window.self !== window.top;
  } catch {
    framed = true;
  }
  if (framed) {
    try {
      await navigator.clipboard.writeText(csv);
      return 'copied';
    } catch {
      return 'blocked';
    }
  }
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'file';
}

/** What an export did, in words, for the toast. */
export function exportMessage(outcome: ExportOutcome, what: string, filename: string): string {
  if (outcome === 'file') return `${what} exported to ${filename} (demonstration data).`;
  if (outcome === 'copied') return `${what} copied to the clipboard as CSV: this preview cannot save files (demonstration data).`;
  return 'This preview cannot save files or use the clipboard. Run the prototype locally to export.';
}

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}
export const PHONE = '(max-width: 760px)';
export const TABLET = '(max-width: 1199px)';

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function writeStore(key: string, value: unknown) {
  try {
    if (value === undefined) localStorage.removeItem(STORAGE + key);
    else localStorage.setItem(STORAGE + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the choice lasts for this visit */
  }
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
