# Codex prompt: write Insights articles from source material

Paste everything inside the block into Codex (opened on the `gocore-website` repository), then add your notes, text or file paths under **SOURCE MATERIAL** at the end. Codex writes new article files but does not commit or deploy. When it finishes, hand the result back to Claude to review, verify, commit and publish.

```text
You are writing Insights articles for the GoCore website (gocore.com.au). This repository is an Astro site; articles are Markdown files in src/content/insights/.

TASK
Turn the source material at the end into as many high-quality, standalone Insights articles as it genuinely supports. One clear topic per article. Don't pad thin material and don't split one idea across several thin articles.
Save each article as a NEW Markdown file in src/content/insights/.
Do not edit, rename or delete any existing file. Do not commit, push or deploy. Leave the new files for review.

ABOUT GOCORE
- GoCore is an Australian technical-services business providing engineering and CAD support, manufacturing support, operations improvement and engineering project support (including the GoCore Factory Fix), for Sydney and NSW businesses with suitable remote work Australia-wide.
- Never invent clients, projects, results, statistics or prices, and never describe services or capabilities beyond those on the Services page (src/data/services.ts). Never use or describe information belonging to any employer, client or supplier.
- These articles also feed the website's AI assistant, so each article must stand alone: define terms the first time they appear, avoid "as mentioned in another article", and keep each section focused under a clear heading.

LENGTH (HARD REQUIREMENT)
- Every article must take 10–20 minutes to read. The site calculates reading time as body words ÷ 220, rounded.
- Body text (excluding front matter) must be 2,300–4,000 words. Anything under 2,150 words fails.
- Reach the length with substance (explanation, step-by-step methods, worked examples, tables, common mistakes, practical checklists), never with filler or repetition.
- Check with: npm run reading-time -- <file-name-without-.md>
  (If that script is missing, count the body words yourself.)

FILE NAME
- The file name is the URL slug: lowercase words separated by hyphens, no dates, under about 60 characters, ending in .md (e.g. pricing-a-new-product.md).
- It must not match any existing file in src/content/insights/.

FRONT MATTER (use exactly this format)
---
title: "Plain, specific title"
description: "One or two sentences summarising the article."
publishDate: YYYY-MM-DD
category: "Business"
tags:
  - finance
  - strategy
author: "GoCore"
featured: false
draft: false
---
Rules:
- title: 5–120 characters.
- description: aim for 120–190 characters; hard limits 50–200 characters or the build fails.
- publishDate: today's date in Sydney. Never a future date (future-dated posts are hidden from the site).
- category: exactly one of Engineering, Manufacturing, Operations, Projects, Ideas, Products, Technology, Business. Prefer the first four for articles on those subjects.
- tags: 2–5, chosen only from this list: product-development, manufacturing, prototyping, design, automation, ai, systems, operations, strategy, experimentation, customers, validation, process-improvement, finance, sales. Do not invent tags; if one is genuinely needed, recommend it in your report instead.
- Only add image fields if I supply images: image: "./images/<file-name>" plus a required imageAlt: "<description>", with the file saved in src/content/insights/images/.

BODY STRUCTURE
- Never use a level-1 heading (a line starting with "# "). The page shows the title as the only H1. Use ## for sections and ### for subsections.
- Open with 2–3 paragraphs, before any heading, that state the problem or question and why it matters.
- Adapt this shape to the topic rather than forcing it: the core idea explained plainly; how it works or a step-by-step method; a worked example that begins "This is an illustration."; how it applies to a small Australian business or founder; common mistakes; "Questions to ask" (a short bulleted checklist); "Bringing it together" (a short conclusion).
- Use Markdown tables when a comparison is clearer than prose. Use bullet lists sparingly; prefer well-built paragraphs of 2–5 sentences.
- Bold key terms the first time they are defined.
- Finish with a horizontal rule and one italic source and disclaimer line, for example:
  ---
  *Source: <author>, <title> (<year>). Figures in this article are illustrations, not data. This article is general information, not financial, legal or investment advice.*
  Keep only the parts of the disclaimer that fit the topic. If the source is my own notes, write "Source: GoCore notes."

INTERNAL LINKS
- Where genuinely useful, link to 1–3 existing articles using this exact form: [Article title](/insights/<existing-file-name-without-.md>/). The trailing slash is required.
- Link only to files that already exist in src/content/insights/ or that you are creating in this task.
- Do not invent external URLs. Include an external link only if it appears in my source material or is an official site you are certain exists.

STYLE
- Australian English: organise, colour, analyse, behaviour, centre, licence (noun), practise (verb).
- Plain, calm, practical and expert, not academic. Writing to the reader as "you" is fine.
- Avoid hype and AI clichés: "dive in", "game changer", "unlock", "leverage" as a verb, "in today's fast-paced world", "revolutionary", motivational filler, rhetorical questions as headings.

ACCURACY AND COPYRIGHT
- Base the articles on my source material, explained in your own words. Do not copy sentences or paragraphs from it. Use at most one direct quote per article, under 15 words, in quotation marks, with attribution.
- Do not invent statistics, studies, quotes, people, customers, case studies, dates, or legal or tax rules. Well-established general knowledge is fine.
- Where Australian law, tax or regulation is relevant, keep it general and tell readers to check current rules with an adviser or the relevant authority (for example the ATO, ASIC, ACCC or Fair Work).
- Label hypothetical examples as illustrations, use round and plausible numbers, and double-check every calculation.
- If the source is thin, unclear or contradictory on a point, leave that point out and list it in your report rather than guessing.

FINAL CHECKS (run them if you can execute commands)
1. npm run reading-time -- <each new file name>: every new article must show "ok" (10–20 min).
2. Every description is 50–200 characters.
3. No body contains a line starting with "# ".
4. If Node.js is available: run npm ci (only if node_modules is missing), then npm run verify, and fix any errors it reports in your new files.

FINAL REPORT
For each new file, list: file name, title, category, tags, word count and reading minutes.
Then list: anything from the source you left out or were unsure about; any facts I should verify; any new tag you recommend.

SOURCE MATERIAL
<paste notes or text here, or list file paths Codex can read>
```

## After Codex finishes

Tell Claude, for example: "Codex has added new Insights articles, review and publish them." Claude will check facts, length, front matter and links, run `npm run verify`, then commit, push and deploy.
