// Critical Path Method engine. Pure: no database, no dates; everything is in working minutes on the calendar's axis
// (calendar.ts), so lead and lag are working time by construction.
//
// Forward pass (topological order):
//   ES = max(project start, anchor for tasks without predecessors, status date for work not started,
//            FS: EF(p) + lag, SS: ES(p) + lag, FF: EF(p) + lag - D, SF: ES(p) + lag - D, constraints)
//   EF = ES + D
// Backward pass (reverse order):
//   LF = min(project finish, FS: LS(s) - lag, SS: LS(s) - lag + D, FF: LF(s) - lag, SF: LF(s) - lag + D, constraints)
//   LS = LF - D
// Total float TF = LS - ES. Free float = the smallest slack on any outgoing link (FS: ES(s) - lag - EF(p),
// SS: ES(s) - lag - ES(p), FF: EF(s) - lag - EF(p), SF: EF(s) - lag - ES(p)), or project finish - EF without successors.
// Critical: TF <= critical threshold; near-critical: TF <= near-critical threshold. A network with a loop cannot be
// scheduled: every task is then 'invalid' and the loop is reported.

import type { ConstraintType, LinkType } from '../../../shared/schedule';

export interface CpmTask {
  id: string;
  /** Working minutes, >= 0 (0: milestone). */
  duration: number;
  /** Earliest start for a task without predecessors (its planned start), working-minute offset. */
  anchor?: number | null;
  /** Start-type constraints carry a start offset, finish-type constraints a finish offset. */
  constraint?: { type: ConstraintType; offset: number } | null;
  actualStart?: number | null;
  actualFinish?: number | null;
  /** Remaining working minutes of a started task, counted from the status date. */
  remaining?: number | null;
}

export interface CpmLink {
  id: string;
  from: string;
  to: string;
  type: LinkType;
  /** Working minutes; negative is a lead. */
  lag: number;
}

export interface CpmOptions {
  projectStart: number;
  /** Status (data) date: work not started is not scheduled before it. Null: plan without a status date. */
  statusOffset?: number | null;
  /** Thresholds in working minutes. */
  critical: number;
  nearCritical: number;
  maxPaths?: number;
}

export type CpmCriticality = 'critical' | 'near_critical' | 'non_critical' | 'invalid';

export interface CpmTaskResult {
  es: number;
  ef: number;
  ls: number;
  lf: number;
  totalFloat: number;
  freeFloat: number;
  criticality: CpmCriticality;
  complete: boolean;
  predecessors: string[];
  successors: string[];
  conflicts: string[];
}

export interface CpmResult {
  valid: boolean;
  tasks: Map<string, CpmTaskResult>;
  /** Relationship slack (driving when 0) and whether the link lies on a critical path. */
  links: Map<string, { float: number; critical: boolean }>;
  projectStart: number;
  projectFinish: number;
  cycles: string[][];
  criticalPaths: string[][];
  /** Separate groups of linked tasks (1 when every task is connected). */
  components: number;
  order: string[];
}

function linkSlack(type: LinkType, lag: number, p: { es: number; ef: number }, s: { es: number; ef: number }): number {
  switch (type) {
    case 'FS':
      return s.es - lag - p.ef;
    case 'SS':
      return s.es - lag - p.es;
    case 'FF':
      return s.ef - lag - p.ef;
    case 'SF':
      return s.ef - lag - p.es;
  }
}

export function runCpm(tasks: CpmTask[], links: CpmLink[], opts: CpmOptions): CpmResult {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const incoming = new Map<string, CpmLink[]>();
  const outgoing = new Map<string, CpmLink[]>();
  for (const t of tasks) {
    incoming.set(t.id, []);
    outgoing.set(t.id, []);
  }
  const usable = links.filter((l) => byId.has(l.from) && byId.has(l.to) && l.from !== l.to);
  for (const l of usable) {
    incoming.get(l.to)!.push(l);
    outgoing.get(l.from)!.push(l);
  }

  // Topological order (Kahn), stable by input order.
  const indeg = new Map(tasks.map((t) => [t.id, incoming.get(t.id)!.length]));
  const queue: string[] = tasks.filter((t) => indeg.get(t.id) === 0).map((t) => t.id);
  const order: string[] = [];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    order.push(id);
    for (const l of outgoing.get(id)!) {
      const n = indeg.get(l.to)! - 1;
      indeg.set(l.to, n);
      if (n === 0) queue.push(l.to);
    }
  }

  const results = new Map<string, CpmTaskResult>();
  const linkResults = new Map<string, { float: number; critical: boolean }>();
  const predsOf = (id: string) => incoming.get(id)!.map((l) => l.from);
  const succsOf = (id: string) => outgoing.get(id)!.map((l) => l.to);

  if (order.length < tasks.length) {
    // Every unprocessed task has an unprocessed predecessor: walking predecessors must come back round. Report the
    // loops found that way (each once).
    const left = new Set(tasks.map((t) => t.id).filter((id) => !order.includes(id)));
    const cycles: string[][] = [];
    const seen = new Set<string>();
    for (const startId of left) {
      if (seen.has(startId)) continue;
      const path: string[] = [];
      const pos = new Map<string, number>();
      let cur = startId;
      while (!pos.has(cur) && !seen.has(cur)) {
        pos.set(cur, path.length);
        path.push(cur);
        cur = incoming.get(cur)!.map((l) => l.from).find((p) => left.has(p))!;
      }
      if (pos.has(cur)) cycles.push(path.slice(pos.get(cur)!).reverse());
      path.forEach((p) => seen.add(p));
      if (cycles.length >= 10) break;
    }
    for (const t of tasks) {
      results.set(t.id, { es: 0, ef: 0, ls: 0, lf: 0, totalFloat: 0, freeFloat: 0, criticality: 'invalid', complete: false, predecessors: predsOf(t.id), successors: succsOf(t.id), conflicts: left.has(t.id) ? ['Part of, or after, a dependency loop'] : [] });
    }
    return { valid: false, tasks: results, links: linkResults, projectStart: opts.projectStart, projectFinish: opts.projectStart, cycles, criticalPaths: [], components: 0, order: [] };
  }

  const status = opts.statusOffset ?? null;
  const es = new Map<string, number>();
  const ef = new Map<string, number>();
  const conflicts = new Map<string, string[]>(tasks.map((t) => [t.id, []]));
  const complete = new Set<string>();

  // ---------------------------------------------------------------- forward pass
  for (const id of order) {
    const t = byId.get(id)!;
    const d = Math.max(0, t.duration);
    let s: number;
    let f: number;
    if (t.actualStart != null && t.actualFinish != null) {
      s = t.actualStart;
      f = Math.max(t.actualStart, t.actualFinish);
      complete.add(id);
    } else if (t.actualStart != null) {
      s = t.actualStart;
      f = t.remaining != null && status != null ? Math.max(s, status) + Math.max(0, t.remaining) : s + d;
    } else {
      s = opts.projectStart;
      const ins = incoming.get(id)!;
      if (!ins.length && t.anchor != null) s = Math.max(s, t.anchor);
      for (const l of ins) {
        const pes = es.get(l.from)!;
        const pef = ef.get(l.from)!;
        const req = l.type === 'FS' ? pef + l.lag : l.type === 'SS' ? pes + l.lag : l.type === 'FF' ? pef + l.lag - d : pes + l.lag - d;
        if (req > s) s = req;
      }
      if (status != null && status > s) s = status;
      const c = t.constraint;
      if (c) {
        switch (c.type) {
          case 'SNET':
            s = Math.max(s, c.offset);
            break;
          case 'FNET':
            s = Math.max(s, c.offset - d);
            break;
          case 'MSO':
            if (s > c.offset) conflicts.get(id)!.push('Predecessors push the start past its "must start on" date');
            s = c.offset;
            break;
          case 'MFO':
            if (s > c.offset - d) conflicts.get(id)!.push('Predecessors push the finish past its "must finish on" date');
            s = c.offset - d;
            break;
          case 'SNLT':
            if (s > c.offset) conflicts.get(id)!.push('Cannot start by its "start no later than" date');
            break;
          case 'FNLT':
            if (s + d > c.offset) conflicts.get(id)!.push('Cannot finish by its "finish no later than" date');
            break;
          default:
            break;
        }
      }
      f = s + d;
    }
    es.set(id, s);
    ef.set(id, f);
  }

  let projectFinish = opts.projectStart;
  for (const id of order) projectFinish = Math.max(projectFinish, ef.get(id)!);

  // ---------------------------------------------------------------- backward pass
  const ls = new Map<string, number>();
  const lf = new Map<string, number>();
  for (let i = order.length - 1; i >= 0; i--) {
    const id = order[i];
    const t = byId.get(id)!;
    const dEff = ef.get(id)! - es.get(id)!;
    let f = projectFinish;
    for (const l of outgoing.get(id)!) {
      const sls = ls.get(l.to)!;
      const slf = lf.get(l.to)!;
      const req = l.type === 'FS' ? sls - l.lag : l.type === 'SS' ? sls - l.lag + dEff : l.type === 'FF' ? slf - l.lag : slf - l.lag + dEff;
      if (req < f) f = req;
    }
    const c = t.constraint;
    if (c && !complete.has(id)) {
      if (c.type === 'SNLT' || c.type === 'MSO') f = Math.min(f, c.offset + dEff);
      else if (c.type === 'FNLT' || c.type === 'MFO') f = Math.min(f, c.offset);
    }
    lf.set(id, f);
    ls.set(id, f - dEff);
  }

  // ---------------------------------------------------------------- floats, links, criticality
  for (const id of order) {
    const tes = es.get(id)!;
    const tef = ef.get(id)!;
    const tf = ls.get(id)! - tes;
    let ff = projectFinish - tef;
    const outs = outgoing.get(id)!;
    if (outs.length) {
      ff = Infinity;
      for (const l of outs) {
        const slack = linkSlack(l.type, l.lag, { es: tes, ef: tef }, { es: es.get(l.to)!, ef: ef.get(l.to)! });
        if (slack < ff) ff = slack;
      }
    }
    ff = Math.min(ff, tf);
    const cx = conflicts.get(id)!;
    if (tf < 0 && !complete.has(id)) cx.push(`Negative float: ${-tf} working minutes late against its constraints or successors`);
    const criticality: CpmCriticality = complete.has(id) ? 'non_critical' : tf <= opts.critical ? 'critical' : tf <= opts.nearCritical ? 'near_critical' : 'non_critical';
    results.set(id, { es: tes, ef: tef, ls: ls.get(id)!, lf: lf.get(id)!, totalFloat: tf, freeFloat: ff, criticality, complete: complete.has(id), predecessors: predsOf(id), successors: succsOf(id), conflicts: cx });
  }
  for (const l of usable) {
    const p = results.get(l.from)!;
    const s = results.get(l.to)!;
    const float = linkSlack(l.type, l.lag, p, s);
    linkResults.set(l.id, { float, critical: p.criticality === 'critical' && s.criticality === 'critical' && float <= opts.critical });
  }

  // ---------------------------------------------------------------- critical paths (chains of driving critical links)
  const maxPaths = opts.maxPaths ?? 10;
  const critOut = new Map<string, string[]>();
  const critIn = new Map<string, number>();
  for (const l of usable) {
    if (!linkResults.get(l.id)!.critical) continue;
    critOut.set(l.from, [...(critOut.get(l.from) ?? []), l.to]);
    critIn.set(l.to, (critIn.get(l.to) ?? 0) + 1);
  }
  const criticalPaths: string[][] = [];
  const starts = order.filter((id) => results.get(id)!.criticality === 'critical' && !critIn.get(id));
  for (const s of starts) {
    // Iterative depth-first enumeration, bounded.
    const stack: string[][] = [[s]];
    while (stack.length && criticalPaths.length < maxPaths) {
      const path = stack.pop()!;
      const next = critOut.get(path[path.length - 1]) ?? [];
      if (!next.length) criticalPaths.push(path);
      else for (let i = next.length - 1; i >= 0; i--) stack.push([...path, next[i]]);
    }
    if (criticalPaths.length >= maxPaths) break;
  }

  // ---------------------------------------------------------------- connected groups (undirected)
  const parent = new Map(tasks.map((t) => [t.id, t.id]));
  const find = (x: string): string => {
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r)!;
    let c = x;
    while (parent.get(c) !== r) {
      const n = parent.get(c)!;
      parent.set(c, r);
      c = n;
    }
    return r;
  };
  for (const l of usable) parent.set(find(l.from), find(l.to));
  const components = new Set(tasks.map((t) => find(t.id))).size;

  return { valid: true, tasks: results, links: linkResults, projectStart: opts.projectStart, projectFinish, cycles: [], criticalPaths, components, order };
}
