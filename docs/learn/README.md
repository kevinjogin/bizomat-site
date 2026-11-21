# BIZOMAT ERP Knowledge Centre

The one place to learn BIZOMAT ERP (owner's brief of 20 Nov 2026): https://bizomat.ai/learn/. Public, indexable and
open without signing in, like the rest of the website. The audit that came before it is `docs/learn/AUDIT.md`; what each
guide covers is `docs/learn/COVERAGE.md` (generated).

## Addresses

| Address | What |
| --- | --- |
| `/learn/` | One page (owner, 20 Nov 2026: "tutorials for all modules under one page with toggle"): search, a jump list, then every guide and workflow as a toggle, section by section, and the first questions people ask |
| `/learn/#<guide>` | A guide's toggle, for example `/learn/#procurement`, `/learn/#crm`, `/learn/#trouble-access`; the address opens it |
| `/learn/#tutorial-<guide>-<id>` | A tutorial inside its guide; the address opens both |
| `/learn/#<guide>-q<n>` | A question inside its guide; the address opens both |
| `/learn/#workflow-<id>` | A workflow's toggle; `/learn/#workflows` is the section |
| `/learn/search.json` | The search index (built from the content at build time); a result opens its toggle |
| `/learn/<guide>/`, `/learn/workflows/<id>/`, `/learn/workflows/` | The earlier pages: answer 301 to the toggle (`public/_redirects`) |
| `/erp/learn`, `/erp/learn/<guide>`, `/erp/help` | Answer 301 to `/learn/` or `/learn/#<guide>` from the router (`infrastructure/proxy/routes.mjs`, `LEARN_ALIASES`) |
| `/systems/*/guide/`, `/crm-platform/guide/`, `/finance-platform/guide/`, `/help/`, `/knowledge-centre/` | Answer 301 to the matching guide's toggle (`public/_redirects`) |

Inside a guide's toggle: what it is and its status, what it is for and who uses it, how to open it (the path and a screen
outline of BIZOMAT ERP with the module rail), the tutorials (each a toggle with Previous, Next, progress and Finish, beside
a screen outline whose highlighted control follows the step on show), the important buttons, the questions (toggles), how
it connects, what is not available yet and the button that opens it. The guide's content is `src/components/learn/GuideBody.astro`,
a workflow's `WorkflowBody.astro`; every id in them starts with the guide's id (or `workflow-<id>`), so nothing collides on
the one page.

## Content

Typed data in `src/data/learn/` (`types.ts` is the model). A guide has the brief's structure A to J: what it is, what it
is for, who uses it, how to open it (the module rail path and a link into the ERP), tutorials (steps with the screen
element to look for), the important buttons, questions, related modules, related workflows and the link into the ERP.
Each guide also lists what is not built yet (Planned or In development), search words people use, the files the facts
were read from and the date it was last checked.

Rules (checked by `tests/learn.test.ts`):

- Only what the code does. A feature behind a flag that ships off is In development; one not built is Planned; neither is
  ever written up as a working tutorial. Labels are the application's own.
- No prices, no compliance, certification or legal claims, no tax invoices, no "confirmed with the register", no
  invented customers or numbers, no emojis.
- Every link in the text is a path in brackets, for example `(/learn/crm/)`, and must lead to a real page; the page shows
  it as a link named after the guide.
- Every module guide has at least two tutorials, three buttons explained and five questions.
- Tutorials only explain: nothing in the Knowledge Centre sends anything to the ERP or changes a record.
- Diagrams are SVG files in `src/assets/learn/` (a title, a description, no styles, scripts or outside files), labelled
  Illustration; screen outlines (`ErpScreen.astro`) show where a control is, never a fake screenshot.

To add a guide: write `src/data/learn/guides/<id>.ts`, import it in `src/data/learn/index.ts` and add it to `GUIDES`,
add its two redirect lines (`/learn/<id>` and `/learn/<id>/` to `/learn/#<id>`) to `public/_redirects`, then run
`node scripts/learn/coverage.ts` and `npm test`. A workflow goes in `workflows/` the same way.

## Where it is linked

The navigation's **Systems** menu, whose Learn group lists the Knowledge Centre and each of its sections (owner,
20 Nov 2026: Learn under Systems; `LEARN_LINKS` in `src/config/site.ts`, checked against `SECTIONS` by
`tests/navigation.test.ts`), and the footer; the homepage (hero, the learning band and the module grid); every
system's section ("Guides and tutorials"); `/systems/` (its hero, the systems at a glance and its Learn section, from
the same list); AI Search's catalogue (`doc:learn`, `doc:learn-workflows` and the
module guides); `/llms.txt`; inside BIZOMAT ERP, the side menu's Help, every tool's platform footer, the CRM and Finance
menus and the Projects help dialog.
