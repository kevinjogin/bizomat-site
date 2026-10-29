// WORKOS tool registry, read at build time from the same browser scripts the tools page runs
// (public/tools/data-*.js, guides-*.js and the input guides in inputs-*.js), so static pages and the live calculators never drift apart.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

export const TOOL_FILES = ['decide', 'money', 'projects', 'operations', 'manufacturing', 'engineering', 'quoting', 'inventory', 'improvement', 'planning', 'business', 'makeos', 'workshop', 'handbook3', 'handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8', 'handbook9', 'handbook10', 'handbook11', 'handbook12', 'handbook13', 'handbook14', 'handbook15', 'handbook16', 'handbook17', 'handbook18', 'handbook19', 'handbook20', 'handbook21', 'handbook22', 'handbook23', 'handbook24', 'handbook25', 'handbook26', 'handbook27', 'handbook28', 'handbook29', 'handbook30', 'handbook31', 'handbook32', 'handbook33', 'handbook34', 'handbook35', 'handbook36', 'handbook37', 'handbook38', 'handbook39', 'handbook40', 'handbook41', 'handbook42', 'handbook43', 'handbook44', 'handbook45', 'handbook46', 'handbook47', 'handbook48', 'handbook49', 'handbook50', 'handbook51', 'handbook52', 'handbook53', 'handbook54', 'handbook55', 'handbook56', 'handbook57', 'handbook58', 'handbook59', 'handbook60', 'handbook61', 'handbook62', 'handbook63', 'handbook64', 'handbook65', 'handbook66', 'handbook67', 'handbook68', 'handbook69', 'polymers', 'bryanthermo', 'handbook72', 'callen', 'handbook71'];

export interface ToolField { key: string; label: string; type?: string; unit?: string; min?: number; max?: number; default?: unknown; heading?: string }
export interface Tool { id: string; name: string; category: string; collection?: string; question: string; description: string; keywords?: string[]; fields: ToolField[] }
export interface ToolGuide {
  purpose?: string; uses?: string[]; users?: string[]; inputs?: Record<string, string>; outputs?: string[];
  method?: string[]; limitations?: string[]; interpret?: string[]; refs?: string[]; verify?: string[];
}

/** One field's entry in public/tools/inputs-*.js: the words behind its "What this means" panel. */
export interface InputEntry { what?: string; tip?: string; effect?: string; fig?: string; sym?: string; unclear?: string }
/** The renderer in public/tools/input-guides.js, shared by the live calculator and the static tool pages. */
export interface InputGuideRenderer {
  fieldGuide(tool: Tool, field: ToolField, entry: InputEntry | undefined, opts?: { prefix?: string; inputId?: string | null; value?: unknown; example?: boolean }): string;
}

let cache: { tools: Tool[]; guides: Record<string, ToolGuide>; inputs: Record<string, Record<string, InputEntry>>; inputGuide: InputGuideRenderer; fileOf: Record<string, string> } | null = null;

export function loadWorkosTools() {
  if (cache) return cache;
  const sandbox: { window: Record<string, any> } = { window: {} };
  const run = (name: string) => runInNewContext(readFileSync(join(process.cwd(), 'public', 'tools', name), 'utf8'), sandbox, { filename: name });
  // fileOf: tool id → the file name its data-, guides-, inputs- and calc- scripts share (the tools page loads them on demand).
  const fileOf: Record<string, string> = {};
  for (const f of TOOL_FILES) {
    const before = (sandbox.window.GOCORE_TOOLS ?? []).length;
    run(`data-${f}.js`);
    for (const t of sandbox.window.GOCORE_TOOLS.slice(before)) fileOf[t.id] = f;
  }
  for (const kind of ['guides', 'inputs']) for (const f of TOOL_FILES) run(`${kind}-${f}.js`);
  run('input-guides.js');
  cache = { tools: sandbox.window.GOCORE_TOOLS as Tool[], guides: sandbox.window.WORKOS_GUIDES as Record<string, ToolGuide>, inputs: sandbox.window.WORKOS_INPUTS ?? {}, inputGuide: sandbox.window.WORKOS_INPUT_GUIDE as InputGuideRenderer, fileOf };
  return cache;
}

/**
 * A tool earns its own indexable page only when its guide is complete enough to stand alone:
 * a purpose, input guidance, at least two method steps and at least one stated limitation.
 * Thinner guides stay inside the WORKOS app until their content is reviewed and extended.
 */
export function hasStandaloneGuide(guide: ToolGuide | undefined): boolean {
  return Boolean(guide?.purpose && guide.inputs && (guide.method?.length ?? 0) >= 2 && (guide.limitations?.length ?? 0) >= 1);
}

export const toolPageHref = (id: string) => `/tools/${id}/`;
export const toolAppHref = (id: string) => `/tools/?tool=${id}`;
