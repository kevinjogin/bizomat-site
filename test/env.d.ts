// Types for the `cloudflare:test` env inside the Workers test runtime.
import type { Env as WorkerEnv } from '../src/worker/env';

declare global {
  namespace Cloudflare {
    interface Env extends WorkerEnv {
      TEST_MIGRATIONS: import('cloudflare:test').D1Migration[];
    }
  }
}

export {};
