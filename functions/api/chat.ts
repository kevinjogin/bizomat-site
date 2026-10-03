// Cloudflare Pages Function: POST /api/chat (GoCore Assistant)
// Needs the Workers AI binding "AI" (see wrangler.toml). All logic lives in src/server/chat.
import { handleChat, type ChatEnv } from '../../src/server/chat/handler.ts';

export const onRequest = (context: { request: Request; env: ChatEnv }) => handleChat(context.request, context.env);
