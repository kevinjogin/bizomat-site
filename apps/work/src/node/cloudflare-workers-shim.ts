// Stand-in for the `cloudflare:workers` module when the Worker code runs on
// Node (esbuild and vitest alias the module to this file). The only import the
// Worker makes is DurableObject, the base class of BoardRoom. On Node the
// BoardRoom class is never instantiated: the in-process hub in realtime.ts
// serves env.BOARD_ROOMS instead.

export class DurableObject<Env = unknown> {
  ctx: unknown;
  env: Env;
  constructor(ctx: unknown, env: Env) {
    this.ctx = ctx;
    this.env = env;
  }
}

export class WorkerEntrypoint<Env = unknown> {
  ctx: unknown;
  env: Env;
  constructor(ctx: unknown, env: Env) {
    this.ctx = ctx;
    this.env = env;
  }
}
