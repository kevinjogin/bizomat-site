// AI provider abstraction for BIZOMAT features (Ask BIZOMAT discovery and learning paths).
//
// Features ask for a JSON reply with completeJson(); which provider and models answer is decided here, so the provider
// can change (for example to another hosted model) without touching the features. Today the provider is the Worker's
// Cloudflare Workers AI binding (env.AI): no API key exists in code or in the browser.
//
// One time budget covers every model tried for a request: the primary model gets most of it and the fallback the rest,
// so a slow primary cannot make a visitor wait for two full timeouts.

export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface CompletionRequest { messages: ChatMessage[]; maxTokens: number; temperature?: number }
export interface AiProvider { readonly name: string; complete(model: string, request: CompletionRequest): Promise<string> }

/** The Workers AI binding's shape (env.AI). */
export interface AiBinding { run(model: string, input: Record<string, unknown>): Promise<unknown> }

/** Text from a Workers AI reply (chat models return { response }, some return OpenAI-style choices). */
export function extractText(result: unknown): string {
  const r = result as { response?: unknown; choices?: Array<{ message?: { content?: string } }> };
  if (typeof r?.response === 'string') return r.response;
  if (r?.response && typeof r.response === 'object') return JSON.stringify(r.response);
  return r?.choices?.[0]?.message?.content ?? '';
}

export function workersAi(binding: AiBinding): AiProvider {
  return {
    name: 'workers-ai',
    complete: async (model, req) => extractText(await binding.run(model, { messages: req.messages, max_tokens: req.maxTokens, temperature: req.temperature ?? 0.1 })),
  };
}

export const DEFAULT_MODELS = ['@cf/meta/llama-4-scout-17b-16e-instruct', '@cf/meta/llama-3.1-8b-instruct-fp8'];

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), ms); });
  return Promise.race([p, limit]).finally(() => clearTimeout(timer));
}

/**
 * Ask the models in order for a reply that `parse` accepts (it returns null for anything unusable), within one total
 * budget. Returns the parsed value and the model that produced it, or null when no model gave a usable reply in time.
 */
export async function completeJson<T>(opts: { provider: AiProvider; models: string[]; request: CompletionRequest; budgetMs: number; parse: (raw: string) => T | null; label: string }): Promise<{ value: T; model: string } | null> {
  const start = Date.now();
  const models = [...new Set(opts.models.filter(Boolean))];
  for (const [i, model] of models.entries()) {
    const left = opts.budgetMs - (Date.now() - start);
    if (left < 250) break;
    // The first model may use three quarters of the budget, leaving time for the fallback.
    const slice = i < models.length - 1 ? Math.max(250, Math.round(left * 0.75)) : left;
    try {
      const value = opts.parse(await withTimeout(opts.provider.complete(model, opts.request), slice));
      if (value !== null) {
        console.log(JSON.stringify({ [opts.label]: 'ok', model, ms: Date.now() - start }));
        return { value, model };
      }
      console.log(JSON.stringify({ [opts.label]: 'unusable_reply', model }));
    } catch (err) {
      console.log(JSON.stringify({ [opts.label]: 'model_failed', model, error: String(err).slice(0, 160) }));
    }
  }
  return null;
}

/** The first {...} block of a reply, parsed; null when there is none. */
export function jsonObject(raw: string): Record<string, unknown> | null {
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const o: unknown = JSON.parse(m[0]);
    return o && typeof o === 'object' && !Array.isArray(o) ? (o as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
