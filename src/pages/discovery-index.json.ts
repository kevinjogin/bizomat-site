// /discovery-index.json: the catalogue searched by the homepage discovery box (src/lib/discovery/search.ts).
// Built from the same sources as the site, so every tool, book and chapter in it exists.
import { buildDiscoveryIndex } from '../utils/discovery-index.ts';

export function GET() {
  return new Response(JSON.stringify(buildDiscoveryIndex()), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
