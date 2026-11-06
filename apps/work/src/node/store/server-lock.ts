// WORK_DATA_DIR/server.lock: written by a running server, removed when it
// stops. The migration scripts refuse to replace or modify the data of a live
// server (SQLite's own locks cannot tell an idle server from no server, hence
// this file). A server never refuses to start because of it: after a crash the
// file stays behind and, in a container, its pid may belong to another
// process by now; the server takes the lock over and logs that it did.

import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { hostname } from 'node:os';
import { join } from 'node:path';

export interface LockInfo {
  pid: number;
  host: string;
  startedAt: string;
}

export interface LockHolder extends LockInfo {
  /** True when the process is alive on this host; null when it runs on another host (cannot be checked). */
  alive: boolean | null;
}

export const LOCK_FILE = 'server.lock';

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return (e as NodeJS.ErrnoException).code === 'EPERM';
  }
}

export function lockHolder(dataDir: string): LockHolder | null {
  const p = join(dataDir, LOCK_FILE);
  if (!existsSync(p)) return null;
  try {
    const info = JSON.parse(readFileSync(p, 'utf8')) as LockInfo;
    const sameHost = info.host === hostname();
    return { ...info, alive: sameHost ? info.pid === process.pid || isAlive(info.pid) : null };
  } catch {
    return null;
  }
}

/** Takes the lock for this process. Returns the release function and the previous holder, if one looked alive. */
export function acquireServerLock(dataDir: string): { release: () => void; previous: LockHolder | null } {
  const holder = lockHolder(dataDir);
  const previous = holder && holder.pid !== process.pid && holder.alive !== false ? holder : null;
  const p = join(dataDir, LOCK_FILE);
  const info: LockInfo = { pid: process.pid, host: hostname(), startedAt: new Date().toISOString() };
  writeFileSync(p, `${JSON.stringify(info)}\n`, { mode: 0o600 });
  const release = () => {
    try {
      const now = JSON.parse(readFileSync(p, 'utf8')) as LockInfo;
      if (now.pid === info.pid && now.startedAt === info.startedAt) unlinkSync(p);
    } catch {
      /* already gone */
    }
  };
  return { release, previous };
}
