// Earned Value Management engine. Pure: inputs are already resolved for one status date (task budgets from the
// selected baseline, the working-time position of the status date in each task's baseline window, progress and
// actual cost recorded on or before the status date). Money is exact: BigInt in units of 1/10000 of the currency
// (src/shared/money.ts SCALE = 4). Ratios are plain numbers. Anything that cannot be calculated is null, never
// Infinity, NaN or a guessed value.
//
//   PV  = sum of BAC x planned fraction at the status date (time-phased by the task's planned value profile)
//   EV  = sum of BAC x earned fraction (by the task's earning method)
//   AC  = sum of actual cost recorded on or before the status date
//   CV = EV - AC   SV = EV - PV   CPI = EV / AC   SPI = EV / PV
//   EAC (CPI)        = BAC / CPI                    = BAC x AC / EV
//   EAC (budget)     = AC + (BAC - EV)
//   EAC (CPI x SPI)  = AC + (BAC - EV) / (CPI x SPI) = AC + (BAC - EV) x AC x PV / EV^2
//   ETC = EAC - AC   VAC = BAC - EAC
//   TCPI (BAC) = (BAC - EV) / (BAC - AC)          TCPI (EAC) = (BAC - EV) / (EAC - AC)

import type { EarningMethod, PvProfile } from '../../../shared/schedule';

export interface PvCurve {
  profile: PvProfile;
  /** custom: [time fraction, cumulative value fraction] points from (0,0) to (1,1). */
  points?: [number, number][];
  /** milestones: working-minute offsets and weights. */
  milestones?: { offset: number; weight: number }[];
}

/** Cumulative planned fraction of a task's budget at working-time fraction t of its planned window. */
export function plannedFraction(curve: PvCurve, t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  switch (curve.profile) {
    case 'front':
      return 1 - (1 - t) * (1 - t);
    case 'back':
      return t * t;
    case 's_curve':
      return t * t * (3 - 2 * t);
    case 'start':
      return 1;
    case 'finish':
      return 0;
    case 'custom': {
      const pts = [[0, 0], ...(curve.points ?? []).filter(([x]) => x > 0 && x < 1), [1, 1]].sort((a, b) => a[0] - b[0]) as [number, number][];
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        if (t <= x1) return x1 === x0 ? y1 : y0 + ((t - x0) / (x1 - x0)) * (y1 - y0);
      }
      return 1;
    }
    case 'linear':
    case 'milestones':
    default:
      return t;
  }
}

export interface EvmTaskInput {
  id: string;
  /** Budget at completion (baseline), scaled. */
  bac: bigint;
  /** Baseline window in working minutes. */
  start: number;
  finish: number;
  curve: PvCurve;
  method: EarningMethod;
  /** Progress known at the status date. */
  percentComplete: number | null;
  physicalPercent: number | null;
  started: boolean;
  finished: boolean;
  milestones?: { weight: number; done: boolean }[];
  unitsDone?: number | null;
  unitsTotal?: number | null;
  /** Actual cost on or before the status date, scaled; null when none is recorded. */
  ac: bigint | null;
}

export interface EvmTaskResult {
  id: string;
  bac: bigint;
  pv: bigint;
  ev: bigint;
  ac: bigint | null;
  plannedPercent: number;
  earnedPercent: number;
  /** Why EV could not be measured from the chosen method, when it could not. */
  note: string | null;
}

export interface EvmMetrics {
  bac: bigint;
  pv: bigint;
  ev: bigint;
  ac: bigint | null;
  cv: bigint | null;
  sv: bigint;
  cpi: number | null;
  spi: number | null;
  eac: { cpi: bigint | null; budget: bigint | null; cpiSpi: bigint | null };
  etc: { cpi: bigint | null; budget: bigint | null; cpiSpi: bigint | null };
  vac: { cpi: bigint | null; budget: bigint | null; cpiSpi: bigint | null };
  tcpiBac: number | null;
  tcpiEac: number | null;
  /** Share of tasks (by budget) with actual cost recorded. */
  acCoverage: { tasks: number; withActuals: number };
  earlyStage: boolean;
}

const ratio = (a: bigint, b: bigint): number | null => (b === 0n ? null : Math.round((Number(a) / Number(b)) * 10000) / 10000);

/** Rounded division of BigInts (half away from zero). */
function div(a: bigint, b: bigint): bigint {
  if (b === 0n) throw new Error('division by zero');
  const neg = a < 0n !== b < 0n;
  const aa = a < 0n ? -a : a;
  const bb = b < 0n ? -b : b;
  const q = (aa + bb / 2n) / bb;
  return neg ? -q : q;
}

function times(scaled: bigint, fraction: number): bigint {
  // Fractions carry 1e-9 precision; budgets up to about 9e9 currency units stay exact to the cent.
  return div(scaled * BigInt(Math.round(fraction * 1e9)), 1_000_000_000n);
}

export function earnedFraction(t: EvmTaskInput): { fraction: number; note: string | null } {
  const pct = (v: number | null) => Math.min(100, Math.max(0, v ?? 0)) / 100;
  switch (t.method) {
    case 'physical':
      return t.physicalPercent == null ? { fraction: 0, note: 'No physical progress recorded' } : { fraction: pct(t.physicalPercent), note: null };
    case 'weighted_milestones': {
      const ms = t.milestones ?? [];
      const total = ms.reduce((n, m) => n + Math.max(0, m.weight), 0);
      if (!total) return { fraction: 0, note: 'No weighted milestones defined' };
      return { fraction: ms.filter((m) => m.done).reduce((n, m) => n + Math.max(0, m.weight), 0) / total, note: null };
    }
    case 'zero_hundred':
      return { fraction: t.finished ? 1 : 0, note: null };
    case 'fifty_fifty':
      return { fraction: t.finished ? 1 : t.started ? 0.5 : 0, note: null };
    case 'units':
      if (!t.unitsTotal || t.unitsTotal <= 0) return { fraction: 0, note: 'No total units set' };
      return { fraction: Math.min(1, Math.max(0, (t.unitsDone ?? 0) / t.unitsTotal)), note: null };
    case 'percent_complete':
    default:
      return { fraction: t.finished ? 1 : pct(t.percentComplete), note: null };
  }
}

/** Planned fraction of one task at a status offset. */
export function taskPlannedFraction(t: Pick<EvmTaskInput, 'start' | 'finish' | 'curve'>, status: number): number {
  if (t.curve.profile === 'milestones' && t.curve.milestones?.length) {
    const total = t.curve.milestones.reduce((n, m) => n + Math.max(0, m.weight), 0);
    return total ? t.curve.milestones.filter((m) => m.offset <= status).reduce((n, m) => n + Math.max(0, m.weight), 0) / total : 0;
  }
  if (t.finish <= t.start) return status >= t.finish ? 1 : 0;
  if (t.curve.profile === 'start') return status >= t.start ? 1 : 0;
  if (t.curve.profile === 'finish') return status >= t.finish ? 1 : 0;
  return plannedFraction(t.curve, (status - t.start) / (t.finish - t.start));
}

export function evaluateTasks(tasks: EvmTaskInput[], status: number): EvmTaskResult[] {
  return tasks.map((t) => {
    const pf = taskPlannedFraction(t, status);
    const { fraction, note } = earnedFraction(t);
    return { id: t.id, bac: t.bac, pv: times(t.bac, pf), ev: times(t.bac, fraction), ac: t.ac, plannedPercent: Math.round(pf * 10000) / 100, earnedPercent: Math.round(fraction * 10000) / 100, note };
  });
}

export function evmMetrics(rows: EvmTaskResult[]): EvmMetrics {
  let bac = 0n;
  let pv = 0n;
  let ev = 0n;
  let acSum = 0n;
  let withActuals = 0;
  for (const r of rows) {
    bac += r.bac;
    pv += r.pv;
    ev += r.ev;
    if (r.ac != null) {
      acSum += r.ac;
      withActuals++;
    }
  }
  return metricsFrom(bac, pv, ev, withActuals ? acSum : null, { tasks: rows.length, withActuals });
}

/** The formulas, on totals. Exposed separately so they can be checked against textbook numbers. */
export function metricsFrom(bac: bigint, pv: bigint, ev: bigint, ac: bigint | null, acCoverage = { tasks: 0, withActuals: 0 }): EvmMetrics {
  const cv = ac == null ? null : ev - ac;
  const sv = ev - pv;
  const cpi = ac == null ? null : ratio(ev, ac);
  const spi = ratio(ev, pv);
  const remaining = bac - ev;
  // EAC by CPI = BAC x AC / EV (exact; undefined without earned value or actual cost).
  const eacCpi = ac != null && ev !== 0n && ac !== 0n ? div(bac * ac, ev) : null;
  const eacBudget = ac == null ? null : ac + remaining;
  // EAC by CPI x SPI = AC + (BAC - EV) x AC x PV / EV^2.
  const eacCpiSpi = ac != null && ev !== 0n && ac !== 0n && pv !== 0n ? ac + div(remaining * ac * pv, ev * ev) : null;
  const minus = (a: bigint | null, b: bigint | null) => (a == null || b == null ? null : a - b);
  const tcpiBac = ac == null ? null : ratio(remaining, bac - ac);
  const tcpiEac = eacCpi == null || ac == null ? null : ratio(remaining, eacCpi - ac);
  return {
    bac,
    pv,
    ev,
    ac,
    cv,
    sv,
    cpi,
    spi,
    eac: { cpi: eacCpi, budget: eacBudget, cpiSpi: eacCpiSpi },
    etc: { cpi: minus(eacCpi, ac), budget: minus(eacBudget, ac), cpiSpi: minus(eacCpiSpi, ac) },
    vac: { cpi: minus(bac, eacCpi), budget: minus(bac, eacBudget), cpiSpi: minus(bac, eacCpiSpi) },
    tcpiBac,
    tcpiEac,
    acCoverage,
    // Indices swing widely before about a tenth of the work is earned.
    earlyStage: bac > 0n && ev * 10n < bac,
  };
}

export type IndexStatus = 'unavailable' | 'below' | 'on' | 'above';

/** CPI/SPI against 1.00 at two decimals. */
export function indexStatus(v: number | null): IndexStatus {
  if (v == null) return 'unavailable';
  const r = Math.round(v * 100) / 100;
  return r < 1 ? 'below' : r > 1 ? 'above' : 'on';
}
