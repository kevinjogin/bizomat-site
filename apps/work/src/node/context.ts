// ExecutionContext for the Node runtime. Promises passed to waitUntil() run in
// the background as on Cloudflare; the tracker remembers them so shutdown can
// wait for them and failures are logged instead of crashing the process.

import { errorSummary, type Logger } from './log.ts';

export class WaitUntilTracker {
  readonly #pending = new Set<Promise<void>>();
  readonly #log: Logger;

  constructor(log: Logger) {
    this.#log = log;
  }

  add(p: unknown): void {
    const tracked: Promise<void> = Promise.resolve(p)
      .then(
        () => {},
        (e) => this.#log({ event: 'waitUntil_failed', ...errorSummary(e) }),
      )
      .finally(() => this.#pending.delete(tracked));
    this.#pending.add(tracked);
  }

  get size(): number {
    return this.#pending.size;
  }

  /** Waits for every tracked promise (including ones added while waiting) until the deadline. Returns true when none is left. */
  async drain(deadline = Number.POSITIVE_INFINITY): Promise<boolean> {
    while (this.#pending.size > 0) {
      const left = deadline - Date.now();
      if (left <= 0) return false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      await Promise.race([
        Promise.allSettled([...this.#pending]),
        new Promise<void>((r) => {
          if (Number.isFinite(left)) timer = setTimeout(r, left);
        }),
      ]);
      if (timer) clearTimeout(timer);
    }
    return true;
  }

  context(): ExecutionContext {
    return {
      waitUntil: (p: Promise<unknown>) => this.add(p),
      passThroughOnException: () => {},
      props: {},
    } as unknown as ExecutionContext;
  }
}
