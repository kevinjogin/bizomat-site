// Tools browsing topics. Each tool category (the `category` field in public/tools/data-*.js) belongs to exactly
// one topic and becomes a subcategory inside it, so every published tool is reachable from the topic grid.
// Categories stay as search metadata; MAKEOS stays a collection label, not a separate browsing system.
import type { Tool } from './workos-tools.ts';
import type { LibraryIconName } from '../components/library/icons.ts';

export interface WorkosTopic { slug: string; name: string; description: string; icon: LibraryIconName; categories: string[] }

export const WORKOS_TOPICS: WorkosTopic[] = [
  { slug: 'engineering-design', name: 'Engineering & Design', icon: 'compass', description: 'Mechanics, strength, springs, bearings and design checks.', categories: ['Engineering', 'Mechanics', 'Strength', 'Springs'] },
  { slug: 'manufacturing-production', name: 'Manufacturing & Production', icon: 'factory', description: 'Machining, fabrication, operations, capacity and stock.', categories: ['Manufacturing', 'Fabrication', 'Operations', 'Inventory'] },
  { slug: 'machinery-power-transmission', name: 'Machinery & Power Transmission', icon: 'gear', description: 'Gears, drives, fasteners and threads.', categories: ['Power Transmission', 'Gears', 'Fasteners', 'Threads'] },
  { slug: 'hydraulics-pneumatics', name: 'Hydraulics & Pneumatics', icon: 'drop', description: 'Fluid power circuits, cylinders, pumps and compressed air.', categories: ['Hydraulics', 'Pneumatics'] },
  { slug: 'quality-materials', name: 'Quality & Materials', icon: 'check', description: 'Inspection, capability, tolerances and material behaviour.', categories: ['Quality', 'Materials'] },
  { slug: 'maintenance-reliability', name: 'Maintenance & Reliability', icon: 'wrench', description: 'Alignment, lubrication, oil cleanliness and asset life.', categories: ['Maintenance'] },
  { slug: 'projects-improvement', name: 'Projects & Improvement', icon: 'flag', description: 'Project health, planning, workload and improvement cases.', categories: ['Projects', 'Improvement', 'Planning'] },
  { slug: 'business-commercial', name: 'Business & Commercial', icon: 'briefcase', description: 'Costing, quoting, investment and business decisions.', categories: ['Money', 'Quoting', 'Decide', 'Business'] },
  { slug: 'reference-utilities', name: 'Reference & Utilities', icon: 'ruler', description: 'Unit conversion, geometry and engineering mathematics.', categories: ['Units', 'Geometry', 'Mathematics'] },
];

/** Friendlier subcategory names where the stored category is terse. */
const SUB_LABELS: Record<string, string> = { Decide: 'Decisions', Money: 'Costs & investment', Units: 'Unit conversion' };

export const subcategoryLabel = (category: string) => SUB_LABELS[category] ?? category;
export const subcategorySlug = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export function topicForCategory(category: string): WorkosTopic {
  const topic = WORKOS_TOPICS.find((t) => t.categories.includes(category));
  if (!topic) throw new Error(`Tools category "${category}" has no topic in src/utils/workos-topics.ts`);
  return topic;
}

/**
 * Topics with their tools and subcategories, counted from the register itself. Tools are listed by subcategory, then A–Z;
 * `preview` picks tools round-robin across the subcategories so a topic's first few cards show its range.
 */
export function groupToolsByTopic(tools: Tool[], previewSize: number) {
  for (const t of tools) topicForCategory(t.category); // every category must belong to a topic
  return WORKOS_TOPICS.map((topic) => {
    const subs = topic.categories
      .map((c) => ({ slug: subcategorySlug(c), name: subcategoryLabel(c), tools: tools.filter((t) => t.category === c).sort((a, b) => a.name.localeCompare(b.name, 'en-AU')) }))
      .filter((s) => s.tools.length > 0);
    const preview = new Set<string>();
    for (let round = 0; preview.size < previewSize && subs.some((s) => s.tools.length > round); round++) {
      for (const s of subs) if (s.tools[round] && preview.size < previewSize) preview.add(s.tools[round].id);
    }
    return { ...topic, items: subs.flatMap((s) => s.tools), preview, subs: subs.map(({ slug, name, tools: list }) => ({ slug, name, count: list.length })) };
  }).filter((t) => t.items.length > 0);
}
