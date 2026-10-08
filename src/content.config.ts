import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_NAMES, TAG_SLUGS } from './config/taxonomy.ts';
import { WORK_STATUSES, WORK_TYPES } from './config/work.ts';

/** Optional fields left blank in the online editor (Pages CMS) arrive as "" or null; treat them as not set. */
const optional = <T extends z.ZodType>(schema: T) => z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

/**
 * Insights articles: src/content/insights/<slug>.md or .mdx
 * The file name is the permanent URL: /insights/<slug>/ (no dates in URLs).
 */
const insights = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/insights' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(5).max(120),
        description: z.string().min(50).max(200),
        publishDate: z.coerce.date(),
        updatedDate: optional(z.coerce.date()),
        category: z.enum(CATEGORY_NAMES),
        tags: z.array(z.enum(TAG_SLUGS)).min(1).max(5),
        author: z.string().default('KEVOS'),
        draft: z.boolean().default(false), // published unless explicitly marked as a draft
        featured: z.boolean().default(false),
        image: optional(image()),
        imageAlt: optional(z.string()),
        canonicalURL: optional(z.url()),
      })
      .refine((d) => !d.image || !!d.imageAlt, { message: 'imageAlt is required when image is set', path: ['imageAlt'] })
      .refine((d) => !d.updatedDate || d.updatedDate >= d.publishDate, { message: 'updatedDate must be on or after publishDate', path: ['updatedDate'] })
      .refine((d) => new Set(d.tags).size === d.tags.length, { message: 'tags must not repeat', path: ['tags'] }),
});

/**
 * Work entries: src/content/work/<slug>.md
 * Projects, products, experiments, research and concepts. A detail page is generated when the
 * entry has body content or `detailPage: true`.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(2).max(100),
        summary: z.string().min(20).max(260),
        type: z.enum(WORK_TYPES),
        status: z.enum(WORK_STATUSES),
        date: z.coerce.date(),
        image: optional(image()),
        imageAlt: optional(z.string()),
        gallery: z.preprocess((v) => v ?? [], z.array(z.object({ src: image(), alt: z.string(), caption: optional(z.string()) }))),
        relatedInsights: z.preprocess((v) => v ?? [], z.array(reference('insights'))),
        externalUrl: optional(z.url()),
        detailPage: optional(z.boolean()),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        order: z.number().default(100),
      })
      .refine((d) => !d.image || !!d.imageAlt, { message: 'imageAlt is required when image is set', path: ['imageAlt'] }),
});

export const collections = { insights, work };
