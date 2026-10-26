// WORKOS tool registry, read at build time from the same browser scripts the tools page runs
// (public/tools/data-*.js and guides-*.js), so static pages and the live calculators never drift apart.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

export const TOOL_FILES = ['decide', 'money', 'projects', 'operations', 'manufacturing', 'engineering', 'quoting', 'inventory', 'improvement', 'planning', 'business', 'makeos', 'workshop', 'handbook3', 'handbook4', 'handbook5', 'handbook6', 'handbook7', 'handbook8', 'handbook9', 'handbook10', 'handbook11', 'handbook12', 'handbook13', 'handbook14', 'handbook15', 'handbook16', 'handbook17', 'handbook18', 'handbook19', 'handbook20', 'handbook21', 'handbook22', 'handbook23', 'handbook24', 'handbook25', 'handbook26', 'handbook27', 'handbook28', 'handbook29', 'handbook30', 'handbook31', 'handbook32', 'handbook33', 'handbook34', 'handbook35', 'handbook36', 'handbook37', 'handbook38', 'handbook39'];

export interface ToolField { key: string; label: string; type?: string; unit?: string; min?: number; max?: number; default?: unknown; heading?: string }
export interface Tool { id: string; name: string; category: string; collection?: string; question: string; description: string; keywords?: string[]; fields: ToolField[] }
export interface ToolGuide {
  purpose?: string; uses?: string[]; users?: string[]; inputs?: Record<string, string>; outputs?: string[];
  method?: string[]; limitations?: string[]; interpret?: string[]; refs?: string[]; verify?: string[];
}

let cache: { tools: Tool[]; guides: Record<string, ToolGuide> } | null = null;

export function loadWorkosTools(): { tools: Tool[]; guides: Record<string, ToolGuide> } {
  if (cache) return cache;
  const sandbox: { window: Record<string, any> } = { window: {} };
  for (const kind of ['data', 'guides']) {
    for (const f of TOOL_FILES) runInNewContext(readFileSync(join(process.cwd(), 'public', 'tools', `${kind}-${f}.js`), 'utf8'), sandbox);
  }
  cache = { tools: sandbox.window.GOCORE_TOOLS, guides: sandbox.window.WORKOS_GUIDES };
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
