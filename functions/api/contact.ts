// Cloudflare Pages Function: POST /api/contact
// All logic lives in src/server/contact so it can move to a standalone Worker unchanged.
// Configure environment variables in Cloudflare (see .dev.vars.example).
import { handleContact, type ContactEnv } from '../../src/server/contact/handler.ts';

export const onRequest = (context: { request: Request; env: ContactEnv }) => handleContact(context.request, context.env);
