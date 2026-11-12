// Numerical tests of the scheduling engines against results worked out by hand (independent of the code).
// D = one working day = 480 working minutes (08:00-17:00 with a 12:00-13:00 break).

import { describe, expect, it } from 'vitest';
import { WorkCalendar, calendarProblems } from '../src/worker/services/schedule/calendar';
import { runCpm, type CpmLink, type CpmTask } from '../src/worker/services/schedule/cpm';
import { evaluateTasks, evmMetrics, indexStatus, metricsFrom, plannedFraction, taskPlannedFraction, type EvmTaskInput } from '../src/worker/services/schedule/evm';
import { DEFAULT_CALENDAR } from '../src/shared/schedule';

const D = 480;
const opts = { projectStart: 0, critical: 0, nearCritical: 5 * D };
const task = (id: string, days: number, extra: Partial<CpmTask> = {}): CpmTask => ({ id, duration: days * D, ...extra });
const link = (from: string, to: string, type: CpmLink['type'] = 'FS', lagDays = 0): CpmLink => ({ id: `${from}-${to}`, from, to, type, lag: lagDays * D });
const $ = (n: number) => BigInt(Math.round(n * 10000));

describe('working-time calendar', () => {
  const cal = new WorkCalendar(DEFAULT_CALENDAR, '2026-10-01');

  it('has 8 working hours a day and Monday to Friday working days', () => {
    expect(cal.minutesPerDay).toBe(480);
    expect(cal.hoursPerDay).toBe(8);
    expect(cal.isWorkingDay('2026-11-02')).toBe(true); // Monday
    expect(cal.isWorkingDay('2026-11-07')).toBe(false); // Saturday
    expect(cal.isWorkingDay('2026-11-08')).toBe(false); // Sunday
  });

  it('counts durations in working days across weekends and holidays', () => {
    expect(cal.finishDateFor('2026-11-02', 3 * D)).toBe('2026-11-04'); // Mon-Wed
    expect(cal.finishDateFor('2026-11-05', 4 * D)).toBe('2026-11-10'); // Thu, Fri, Mon, Tue
    const hol = new WorkCalendar({ ...DEFAULT_CALENDAR, exceptions: [{ start: '2026-11-09', end: '2026-11-09', name: 'Holiday', working: false }] }, '2026-10-01');
    expect(hol.finishDateFor('2026-11-05', 4 * D)).toBe('2026-11-11'); // Monday off
    expect(hol.workingMinutesBetween('2026-11-02', '2026-11-13')).toBe(9 * D);
    const shutdown = new WorkCalendar({ ...DEFAULT_CALENDAR, exceptions: [{ start: '2026-12-24', end: '2027-01-01', name: 'Shutdown', working: false }, { start: '2026-12-26', end: '2026-12-26', name: 'Stocktake Saturday', working: true }] }, '2026-10-01');
    expect(shutdown.isWorkingDay('2026-12-28')).toBe(false);
    expect(shutdown.isWorkingDay('2026-12-26')).toBe(true);
  });

  it('places sub-day work inside working hours, skipping the break', () => {
    const s = cal.offsetAt('2026-11-02', 8 * 60);
    expect(cal.timeAt(s + 4 * 60, true)).toBe('12:00');
    expect(cal.timeAt(s + 6 * 60, true)).toBe('15:00'); // 08-12 then 13-15
    expect(cal.timeAt(s + 8 * 60, true)).toBe('17:00');
    expect(cal.dateAtFinish(s + 8 * 60)).toBe('2026-11-02');
    expect(cal.dateAtStart(s + 8 * 60)).toBe('2026-11-03');
    // A start on a Saturday moves to Monday; a finish on a Sunday belongs to Friday.
    expect(cal.dateAtStart(cal.startOffset('2026-11-07'))).toBe('2026-11-09');
    expect(cal.dateAtFinish(cal.finishOffset('2026-11-08'))).toBe('2026-11-06');
  });

  it('refuses calendars that cannot be used', () => {
    expect(calendarProblems(DEFAULT_CALENDAR)).toEqual([]);
    expect(calendarProblems({ ...DEFAULT_CALENDAR, workingDays: [] })).toContain('Choose at least one working day');
    expect(calendarProblems({ ...DEFAULT_CALENDAR, dayStart: '17:00', dayEnd: '08:00' })).toContain('The working day must end after it starts');
    expect(calendarProblems({ ...DEFAULT_CALENDAR, timezone: 'Mars/Olympus' })[0]).toMatch(/Unknown time zone/);
  });
});

describe('critical path method', () => {
  it('finish-to-start network: early and late dates, total and free float, critical and near-critical', () => {
    // A3 -> B4 -> D5, A3 -> C2 -> D5. Worked by hand:
    // A 0-3, B 3-7, C 3-5, D 7-12; LF: D 12, B 7, C 7, A 3. TF: A0 B0 C2 D0. FF(C) = ES(D) - EF(C) = 2.
    const r = runCpm([task('A', 3), task('B', 4), task('C', 2), task('D', 5)], [link('A', 'B'), link('A', 'C'), link('B', 'D'), link('C', 'D')], opts);
    expect(r.valid).toBe(true);
    const t = (id: string) => r.tasks.get(id)!;
    expect([t('A').es, t('A').ef, t('A').ls, t('A').lf].map((x) => x / D)).toEqual([0, 3, 0, 3]);
    expect([t('B').es, t('B').ef, t('B').ls, t('B').lf].map((x) => x / D)).toEqual([3, 7, 3, 7]);
    expect([t('C').es, t('C').ef, t('C').ls, t('C').lf].map((x) => x / D)).toEqual([3, 5, 5, 7]);
    expect([t('D').es, t('D').ef, t('D').ls, t('D').lf].map((x) => x / D)).toEqual([7, 12, 7, 12]);
    expect(t('C').totalFloat / D).toBe(2);
    expect(t('C').freeFloat / D).toBe(2);
    expect(r.projectFinish / D).toBe(12);
    expect(['A', 'B', 'C', 'D'].map((id) => t(id).criticality)).toEqual(['critical', 'critical', 'near_critical', 'critical']);
    expect(r.criticalPaths).toEqual([['A', 'B', 'D']]);
    expect(r.links.get('A-C')!.critical).toBe(false);
    expect(r.links.get('B-D')!.critical).toBe(true);
  });

  it('start-to-start with lag: B starts 2 days after A starts', () => {
    // A4 SS+2 B3: B 2-5; finish 5; LF(A) = LS(B) - lag + D(A) = 2 - 2 + 4 = 4 -> TF(A) 0.
    const r = runCpm([task('A', 4), task('B', 3)], [link('A', 'B', 'SS', 2)], opts);
    expect([r.tasks.get('B')!.es / D, r.tasks.get('B')!.ef / D]).toEqual([2, 5]);
    expect(r.tasks.get('A')!.lf / D).toBe(4);
    expect(r.tasks.get('A')!.totalFloat).toBe(0);
    expect(r.criticalPaths).toEqual([['A', 'B']]);
  });

  it('finish-to-finish with lag: B cannot finish before 1 day after A finishes', () => {
    // A5 FF+1 B2: EF(B) >= 6 -> ES(B) = 4; LF(A) = LF(B) - 1 = 5.
    const r = runCpm([task('A', 5), task('B', 2)], [link('A', 'B', 'FF', 1)], opts);
    expect([r.tasks.get('B')!.es / D, r.tasks.get('B')!.ef / D]).toEqual([4, 6]);
    expect(r.tasks.get('A')!.lf / D).toBe(5);
    expect(r.tasks.get('A')!.criticality).toBe('critical');
  });

  it('start-to-finish: B cannot finish before A starts', () => {
    // A3 starts at day 5 (planned start, no predecessors). SF: EF(B) >= ES(A) = 5 -> B 3-5. Finish 8.
    // B has no successors: LF 8, TF 3. LF(A) = min(8, LF(B) - 0 + 3 = 11) = 8 -> TF(A) 0.
    const r = runCpm([task('A', 3, { anchor: 5 * D }), task('B', 2)], [link('A', 'B', 'SF', 0)], opts);
    expect([r.tasks.get('B')!.es / D, r.tasks.get('B')!.ef / D]).toEqual([3, 5]);
    expect(r.projectFinish / D).toBe(8);
    expect(r.tasks.get('B')!.totalFloat / D).toBe(3);
    expect(r.tasks.get('A')!.totalFloat).toBe(0);
  });

  it('a lead (negative lag) lets B start before A finishes', () => {
    // A3 FS-1 B2: ES(B) = 3 - 1 = 2, EF 4; LF(A) = LS(B) + 1 = 3.
    const r = runCpm([task('A', 3), task('B', 2)], [link('A', 'B', 'FS', -1)], opts);
    expect([r.tasks.get('B')!.es / D, r.tasks.get('B')!.ef / D]).toEqual([2, 4]);
    expect(r.tasks.get('A')!.totalFloat).toBe(0);
  });

  it('finds every critical path, and float on parallel unlinked work', () => {
    const r = runCpm([task('A', 2), task('B', 2), task('C', 3)], [link('A', 'C'), link('B', 'C')], opts);
    expect(r.criticalPaths).toEqual([['A', 'C'], ['B', 'C']]);
    // Multiple start and end activities, not linked: X2 alongside Y5 -> X has 3 days of float (near-critical).
    const p = runCpm([task('X', 2), task('Y', 5)], [], opts);
    expect(p.tasks.get('X')!.totalFloat / D).toBe(3);
    expect(p.tasks.get('X')!.criticality).toBe('near_critical');
    expect(p.tasks.get('Y')!.criticality).toBe('critical');
    expect(p.components).toBe(2);
    expect(runCpm([task('X', 2), task('Y', 9)], [], opts).tasks.get('X')!.criticality).toBe('non_critical');
  });

  it('a milestone has no duration and can be critical', () => {
    const r = runCpm([task('A', 3), task('M', 0)], [link('A', 'M')], opts);
    expect([r.tasks.get('M')!.es, r.tasks.get('M')!.ef]).toEqual([3 * D, 3 * D]);
    expect(r.tasks.get('M')!.criticality).toBe('critical');
  });

  it('detects a dependency loop and refuses to schedule', () => {
    const r = runCpm([task('A', 1), task('B', 1), task('C', 1), task('Z', 1)], [link('A', 'B'), link('B', 'C'), link('C', 'A'), link('C', 'Z')], opts);
    expect(r.valid).toBe(false);
    expect(r.cycles).toHaveLength(1);
    expect([...r.cycles[0]].sort()).toEqual(['A', 'B', 'C']);
    expect(r.tasks.get('Z')!.criticality).toBe('invalid');
  });

  it('reports constraints that cannot be met as conflicts with negative float', () => {
    // A5 FS B2, B must start on day 3: B is held at 3, A's late finish becomes 3 -> TF(A) = -2 days.
    const r = runCpm([task('A', 5), task('B', 2, { constraint: { type: 'MSO', offset: 3 * D } })], [link('A', 'B')], opts);
    expect(r.tasks.get('B')!.es / D).toBe(3);
    expect(r.tasks.get('B')!.conflicts[0]).toMatch(/must start on/);
    expect(r.tasks.get('A')!.totalFloat / D).toBe(-2);
    expect(r.tasks.get('A')!.criticality).toBe('critical');
    // Start no earlier than / finish no later than.
    const s = runCpm([task('A', 2, { constraint: { type: 'SNET', offset: 4 * D } })], [], opts);
    expect(s.tasks.get('A')!.es / D).toBe(4);
    const f = runCpm([task('A', 2), task('B', 3, { constraint: { type: 'FNLT', offset: 4 * D } })], [link('A', 'B')], opts);
    expect(f.tasks.get('B')!.conflicts[0]).toMatch(/finish no later than/);
  });

  it('respects the status date and recorded actual dates', () => {
    const r = runCpm([task('A', 2), task('B', 2, { actualStart: 0, actualFinish: 3 * D })], [], { ...opts, statusOffset: 2 * D });
    expect(r.tasks.get('A')!.es / D).toBe(2); // not started: not before the status date
    expect(r.tasks.get('B')!.complete).toBe(true);
    expect(r.tasks.get('B')!.ef / D).toBe(3);
    expect(r.tasks.get('B')!.criticality).toBe('non_critical');
    const inProgress = runCpm([task('A', 4, { actualStart: 0, remaining: 3 * D })], [], { ...opts, statusOffset: 2 * D });
    expect(inProgress.tasks.get('A')!.ef / D).toBe(5);
  });

  it('schedules on real dates across a weekend and a public holiday', () => {
    // A 3 days from Mon 2 Nov, FS+2d to B 4 days. A ends Wed 4 Nov; Thu and Fri are the lag; B Mon 9 - Thu 12 Nov.
    // With Monday 9 Nov a holiday: B Tue 10 - Fri 13 Nov.
    for (const [exceptions, finish] of [
      [[], '2026-11-12'],
      [[{ start: '2026-11-09', end: '2026-11-09', name: 'Holiday', working: false }], '2026-11-13'],
    ] as const) {
      const cal = new WorkCalendar({ ...DEFAULT_CALENDAR, exceptions: [...exceptions] }, '2026-10-01');
      const start = cal.startOffset('2026-11-02');
      const r = runCpm([task('A', 3), task('B', 4)], [link('A', 'B', 'FS', 2)], { ...opts, projectStart: start });
      expect(cal.dateAtFinish(r.tasks.get('A')!.ef)).toBe('2026-11-04');
      expect(cal.dateAtFinish(r.tasks.get('B')!.ef)).toBe(finish);
    }
  });

  it('stays fast on large networks', () => {
    const n = 5000;
    const tasks = Array.from({ length: n }, (_, i) => task(`T${i}`, 1 + (i % 5)));
    const links: CpmLink[] = [];
    for (let i = 1; i < n; i++) {
      links.push(link(`T${i - 1}`, `T${i}`));
      if (i > 10) links.push(link(`T${i - 10}`, `T${i}`, 'SS', 1));
    }
    const t0 = Date.now();
    const r = runCpm(tasks, links, opts);
    const ms = Date.now() - t0;
    expect(r.valid).toBe(true);
    expect(r.tasks.size).toBe(n);
    expect(ms).toBeLessThan(2000);
  });
});

describe('earned value management', () => {
  it('matches the textbook example (BAC 100,000; PV 50,000; EV 40,000; AC 45,000)', () => {
    const m = metricsFrom($(100000), $(50000), $(40000), $(45000));
    expect(m.cv).toBe($(-5000));
    expect(m.sv).toBe($(-10000));
    expect(m.cpi).toBe(0.8889);
    expect(m.spi).toBe(0.8);
    expect(m.eac.cpi).toBe($(112500)); // 100,000 / 0.8889 = 100,000 x 45,000 / 40,000
    expect(m.eac.budget).toBe($(105000)); // 45,000 + 60,000
    expect(m.eac.cpiSpi).toBe($(129375)); // 45,000 + 60,000 / (0.8889 x 0.8)
    expect(m.etc.cpi).toBe($(67500));
    expect(m.vac.cpi).toBe($(-12500));
    expect(m.tcpiBac).toBe(1.0909); // 60,000 / 55,000
    expect(m.tcpiEac).toBe(0.8889); // 60,000 / 67,500
    expect(indexStatus(m.cpi)).toBe('below');
    expect(indexStatus(m.spi)).toBe('below');
    expect(indexStatus(1.004)).toBe('on');
    expect(indexStatus(1.2)).toBe('above');
  });

  it('never divides by zero: no actual cost, zero actual cost, zero planned value, no earned value', () => {
    const none = metricsFrom($(1000), $(500), $(250), null);
    expect([none.cv, none.cpi, none.eac.cpi, none.eac.budget, none.eac.cpiSpi, none.tcpiBac]).toEqual([null, null, null, null, null, null]);
    const zeroAc = metricsFrom($(1000), $(500), $(250), 0n);
    expect(zeroAc.cpi).toBeNull();
    expect(zeroAc.eac.cpi).toBeNull();
    expect(zeroAc.eac.budget).toBe($(750));
    expect(zeroAc.tcpiBac).toBe(0.75);
    const zeroPv = metricsFrom($(1000), 0n, 0n, 0n);
    expect(zeroPv.spi).toBeNull();
    expect(zeroPv.eac.cpiSpi).toBeNull();
    const noEv = metricsFrom($(1000), $(200), 0n, $(100));
    expect(noEv.cpi).toBe(0);
    expect(noEv.eac.cpi).toBeNull();
    expect(noEv.earlyStage).toBe(true);
    const overspent = metricsFrom($(1000), $(1000), $(900), $(1000));
    expect(overspent.tcpiBac).toBeNull(); // BAC - AC = 0
    for (const v of [none, zeroAc, zeroPv, noEv, overspent].flatMap((m) => [m.cpi, m.spi, m.tcpiBac, m.tcpiEac])) {
      if (v != null) expect(Number.isFinite(v)).toBe(true);
    }
  });

  const base: EvmTaskInput = { id: 'T', bac: $(100000), start: 0, finish: 10 * D, curve: { profile: 'linear' }, method: 'percent_complete', percentComplete: 40, physicalPercent: null, started: true, finished: false, ac: $(45000) };

  it('time-phases planned value and earns value by each method', () => {
    const [r] = evaluateTasks([base], 5 * D);
    expect(r.pv).toBe($(50000));
    expect(r.ev).toBe($(40000));
    const m = evmMetrics([r]);
    expect(m.cpi).toBe(0.8889);
    const ev = (over: Partial<EvmTaskInput>) => evaluateTasks([{ ...base, ...over }], 5 * D)[0];
    expect(ev({ method: 'zero_hundred' }).ev).toBe(0n);
    expect(ev({ method: 'zero_hundred', finished: true }).ev).toBe($(100000));
    expect(ev({ method: 'fifty_fifty' }).ev).toBe($(50000));
    expect(ev({ method: 'fifty_fifty', started: false }).ev).toBe(0n);
    expect(ev({ method: 'weighted_milestones', milestones: [{ weight: 1, done: true }, { weight: 1, done: true }, { weight: 2, done: false }] }).ev).toBe($(50000));
    expect(ev({ method: 'units', unitsDone: 30, unitsTotal: 120 }).ev).toBe($(25000));
    expect(ev({ method: 'physical', physicalPercent: 35 }).ev).toBe($(35000));
    const noPhysical = ev({ method: 'physical' });
    expect(noPhysical.ev).toBe(0n);
    expect(noPhysical.note).toMatch(/No physical progress/);
    expect(ev({ finished: true, percentComplete: 90 }).ev).toBe($(100000));
  });

  it('distributes planned value along the chosen curve', () => {
    expect(plannedFraction({ profile: 'linear' }, 0.5)).toBe(0.5);
    expect(plannedFraction({ profile: 'front' }, 0.5)).toBe(0.75);
    expect(plannedFraction({ profile: 'back' }, 0.5)).toBe(0.25);
    expect(plannedFraction({ profile: 's_curve' }, 0.5)).toBe(0.5);
    expect(plannedFraction({ profile: 's_curve' }, 0.25)).toBeCloseTo(0.15625, 10);
    expect(plannedFraction({ profile: 'custom', points: [[0.5, 0.2]] }, 0.75)).toBeCloseTo(0.6, 10);
    expect(taskPlannedFraction({ start: 0, finish: 10 * D, curve: { profile: 'start' } }, 1)).toBe(1);
    expect(taskPlannedFraction({ start: 0, finish: 10 * D, curve: { profile: 'finish' } }, 9 * D)).toBe(0);
    expect(taskPlannedFraction({ start: 0, finish: 10 * D, curve: { profile: 'milestones', milestones: [{ offset: 2 * D, weight: 30 }, { offset: 8 * D, weight: 70 }] } }, 5 * D)).toBe(0.3);
    // Before the window: nothing planned; after: everything.
    expect(taskPlannedFraction({ start: 2 * D, finish: 4 * D, curve: { profile: 'linear' } }, D)).toBe(0);
    expect(taskPlannedFraction({ start: 2 * D, finish: 4 * D, curve: { profile: 'linear' } }, 9 * D)).toBe(1);
  });

  it('adds up several tasks, and reports how many carry actual cost', () => {
    const rows = evaluateTasks(
      [
        { ...base, id: 'A' },
        { ...base, id: 'B', bac: $(50000), percentComplete: 10, ac: null },
      ],
      5 * D,
    );
    const m = evmMetrics(rows);
    expect(m.bac).toBe($(150000));
    expect(m.pv).toBe($(75000));
    expect(m.ev).toBe($(45000));
    expect(m.ac).toBe($(45000));
    expect(m.acCoverage).toEqual({ tasks: 2, withActuals: 1 });
  });
});
