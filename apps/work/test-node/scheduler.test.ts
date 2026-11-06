import { afterEach, describe, expect, it, vi } from 'vitest';
import { QUARTER_HOUR_MS, QuarterHourScheduler, nextQuarterHour } from '../src/node/scheduler.ts';
import type { LogFields } from '../src/node/log.ts';

afterEach(() => {
  vi.useRealTimers();
});

describe('quarter-hour scheduler', () => {
  it('computes the next quarter-hour boundary', () => {
    const t = Date.UTC(2026, 10, 5, 14, 7, 31, 250);
    expect(new Date(nextQuarterHour(t)).toISOString()).toBe('2026-11-05T14:15:00.000Z');
    expect(new Date(nextQuarterHour(Date.UTC(2026, 10, 5, 14, 15))).toISOString()).toBe('2026-11-05T14:30:00.000Z');
    expect(new Date(nextQuarterHour(Date.UTC(2026, 10, 5, 23, 59, 59, 999))).toISOString()).toBe('2026-11-06T00:00:00.000Z');
  });

  it('runs on the quarter hour with the boundary as scheduledTime', async () => {
    vi.useFakeTimers({ now: Date.UTC(2026, 10, 5, 14, 7) });
    const runs: number[] = [];
    const s = new QuarterHourScheduler(async (t) => void runs.push(t), () => {});
    s.start();
    await vi.advanceTimersByTimeAsync(8 * 60_000);
    expect(runs.map((t) => new Date(t).toISOString())).toEqual(['2026-11-05T14:15:00.000Z']);
    await vi.advanceTimersByTimeAsync(2 * QUARTER_HOUR_MS);
    expect(runs.map((t) => new Date(t).toISOString())).toEqual(['2026-11-05T14:15:00.000Z', '2026-11-05T14:30:00.000Z', '2026-11-05T14:45:00.000Z']);
    await s.stop();
  });

  it('skips a slot while the previous run is still going', async () => {
    vi.useFakeTimers({ now: Date.UTC(2026, 10, 5, 14, 14) });
    const logs: LogFields[] = [];
    let release!: () => void;
    let started = 0;
    const s = new QuarterHourScheduler(
      () => {
        started++;
        return new Promise<void>((r) => (release = r));
      },
      (f) => logs.push(f),
    );
    s.start();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(started).toBe(1);
    expect(s.running).toBe(true);
    await vi.advanceTimersByTimeAsync(QUARTER_HOUR_MS);
    expect(started).toBe(1);
    expect(logs.some((l) => l.event === 'scheduled_skipped')).toBe(true);
    release();
    await vi.advanceTimersByTimeAsync(QUARTER_HOUR_MS);
    expect(started).toBe(2);
    release();
    await s.stop();
  });

  it('stop() waits for a run in progress until the deadline', async () => {
    vi.useFakeTimers({ now: Date.UTC(2026, 10, 5, 14, 14, 59) });
    let release!: () => void;
    const s = new QuarterHourScheduler(() => new Promise<void>((r) => (release = r)), () => {});
    s.start();
    await vi.advanceTimersByTimeAsync(2000);
    const stopped = s.stop(Date.now() + 5000);
    release();
    await expect(stopped).resolves.toBe(true);
    s.start();
    await vi.advanceTimersByTimeAsync(QUARTER_HOUR_MS);
    const late = s.stop(Date.now() + 1000);
    await vi.advanceTimersByTimeAsync(1500);
    await expect(late).resolves.toBe(false);
    release();
  });
});
