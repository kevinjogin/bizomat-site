// /learn/search.json: everything in the Knowledge Centre that a person can search (guides, tutorials, questions,
// buttons, workflows), read by the search on /learn/ (src/scripts/learn.ts). Built with the site; public content only.
import type { APIRoute } from 'astro';
import { searchEntries } from '../../data/learn/index.ts';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchEntries()), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
