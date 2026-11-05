// The Worker's cron trigger ("*/15 * * * *") for the Node runtime: runs at
// minutes 0, 15, 30 and 45 of every hour (UTC), on the quarter hour, and skips
// a slot while the previous run is still going. Like Cloudflare's cron it does
// not catch up on slots missed while the machine was stopped.

import { errorSummary, type Logger } from './log.ts';

export const QUARTER_HOUR_MS = 15 * 60_000;
export const CRON = '*/15 * * * *';

/** The first quarter-hour boundary strictly after `now`. */
export function nextQuarterHour(now: number): number {
  return Math.floor(now / QUARTER_HOUR_MS) * QUARTER_HOUR_MS + QUARTER_HOUR_MS;
}

export class QuarterHourScheduler {
  readonly #run: (scheduledTime: number) => Promise<void>;
  readonly #log: Logger;
  readonly #now: () => number;
  #timer: ReturnType<typeof setTimeout> | null = null;
  #running: Promise<void> | null = null;
  #stopped = true;

  constructor(run: (scheduledTime: number) => Promise<void>, log: Logger, now: () => number = Date.now) {
    this.#run = run;
    this.#log = log;
    this.#now = now;
  }

  start(): void {
    if (!this.#stopped) return;
    this.#stopped = false;
    this.#arm(this.#now());
  }

  get running(): boolean {
    return this.#running !== null;
  }

  #arm(from: number): void {
    if (this.#stopped) return;
    const at = nextQuarterHour(Math.max(this.#now(), from));
    this.#timer = setTimeout(() => this.#fire(at), Math.max(0, at - this.#now()));
    this.#timer.unref?.();
  }

  #fire(at: number): void {
    this.#timer = null;
    if (this.#stopped) return;
    if (this.#running) {
      this.#log({ event: 'scheduled_skipped', reason: 'previous run still in progress', scheduledTime: new Date(at).toISOString() });
    } else {
      const started = this.#now();
      this.#running = this.#run(at)
        .then(
          () => this.#log({ event: 'scheduled', scheduledTime: new Date(at).toISOString(), ms: this.#now() - started }),
          (e) => this.#log({ event: 'scheduled_failed', scheduledTime: new Date(at).toISOString(), ...errorSummary(e) }),
        )
        .finally(() => {
          this.#running = null;
        });
    }
    this.#arm(at);
  }

  /** Stops arming new runs and waits for a run in progress until the deadline. Returns true when nothing is still running. */
  async stop(deadline = Number.POSITIVE_INFINITY): Promise<boolean> {
    this.#stopped = true;
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
    const running = this.#running;
    if (!running) return true;
    const left = deadline - this.#now();
    if (left <= 0) return false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finished = await Promise.race([
      running.then(() => true),
      new Promise<boolean>((r) => {
        if (Number.isFinite(left)) timer = setTimeout(() => r(false), left);
      }),
    ]);
    if (timer) clearTimeout(timer);
    return finished;
  }
}
