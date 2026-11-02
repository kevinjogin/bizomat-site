// What each KEVOS® tool asks for and reports, for the "Your Solution Path" steps (src/lib/discovery/plan.ts).
import { buildDiscoveryDetails } from '../utils/discovery-index.ts';

export function GET() {
  return new Response(JSON.stringify(buildDiscoveryDetails()), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
