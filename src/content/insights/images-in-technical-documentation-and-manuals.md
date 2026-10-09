---
title: "Images in technical documentation and manuals: choosing, creating and managing visuals people can follow"
description: "Good images make manuals and work instructions clear, safe and easy to translate. When to use photos, line art, exploded views, screenshots or diagrams, and how to keep them accurate."
publishDate: 2026-10-09
category: "Products"
tags:
  - communication
  - design
  - quality
author: "KEVOS"
featured: false
draft: false
---

Installation manuals, operating instructions, maintenance procedures, work instructions and spare parts catalogues all depend on images. A clear picture can show in a second what a paragraph struggles to describe: which way a valve faces, where a cable gland goes, which bolt to loosen first, how a guard is removed. Poor images do the opposite. A dark, cluttered photo of the wrong product version, an unlabelled diagram or a screenshot of an old software screen leads people to guess, and guessing on machinery causes damage, rework and injuries.

Technical images are often created at the last minute, by whoever has a phone camera or a CAD seat, without a consistent approach. They then drift out of date as the product changes, because nobody links them to the design revisions they depict. For manufacturers, poor documentation also has legal and commercial consequences: in Australia, designers, manufacturers, importers and suppliers of plant have duties to provide information needed for its safe use, and unclear instructions show up as support calls, warranty claims and dissatisfied customers.

This article explains the main types of technical images and when to use each, principles for clear instructional visuals, how to create images from CAD models and photographs, how to handle screenshots, safety information and translation, accessibility, how to manage images through product changes, and how to test documentation with real users. It is general information for engineers, technical writers, product managers and anyone responsible for manuals and procedures.

## Why images matter in technical documents

Images help readers:

- **Recognise** parts, controls and locations.
- **Orient themselves**: which way up, from which side, in what sequence.
- **Understand relationships**: how parts fit together, how flows move, how systems connect.
- **Act correctly**: the right tool, position, direction and order.
- **Understand without fluent reading** of the document's language, which matters for multilingual workforces and international customers.

An international standard for preparing information for the use of products, IEC/IEEE 82079-1, sets out principles for user information, including that it should be clear, consistent and suited to the target audience. Instructions are part of the product, not an afterthought.

## Types of technical images and when to use them

| Type | Strengths | Limitations | Best for |
|---|---|---|---|
| Photographs | Realistic, quick to recognise, show actual environment | Clutter, reflections and shadows obscure detail; date quickly; hard to translate annotations | Identifying real installations, site conditions, recognition of parts |
| Line drawings and illustrations | Clear, simplified, consistent, easy to annotate and update | Need skill or CAD to create; less realistic | Most assembly, operation and maintenance steps |
| Exploded views | Show how parts fit and the order of assembly | Can be complex for large assemblies | Assembly instructions, spare parts catalogues |
| CAD renderings | Realistic appearance before the product exists | Can overstate finish or detail; may not match production | Early documentation, marketing, visualising hidden features |
| Screenshots | Show software screens exactly | Change with software updates; may contain sensitive data | Software and control system instructions |
| Schematics and diagrams | Show connections and logic clearly | Need the reader to understand symbols | Electrical, hydraulic, pneumatic and process systems |
| Symbols and icons | Compact, language-independent | Must be standard and understood | Safety signs, warnings, tool and action symbols |
| Videos and animations | Show motion and sequence | Harder to update and use offline; not a replacement for written records | Complex movements, training |

Most good manuals combine types: line art for step-by-step instructions, photographs for recognition and context, exploded views for parts and schematics for systems.

## Principles for clear instructional images

- **One step, one image.** Show what the reader needs for the current action, not everything at once.
- **Show the reader's viewpoint.** Draw or photograph from where the person will stand or kneel.
- **Remove clutter.** Hide or ghost parts that are not relevant, or crop tightly.
- **Highlight the action.** Use arrows for movement and direction, colour or bold outlines for the parts involved, and magnified detail views where small features matter.
- **Use callouts with numbers** that match the text or a parts list, rather than long labels inside the image.
- **Keep a consistent style**: line weights, colours, arrow styles, fonts and viewing angles throughout a document set.
- **Show orientation and scale** where they matter, for example with a reference to the front of the machine or a familiar object.
- **Place images next to the text** they support.
- **Make sure the image matches the product** version the document covers.

## Planning the illustration set

Documentation images are easier and cheaper when planned with the product rather than after it:

- **Write an illustration list** early, naming each figure, its purpose, its type and the product revision it must show.
- **Agree a short style guide** covering viewing angles, line weights, colours, callout style, arrow shapes, fonts and file formats.
- **Decide who creates which images**: engineers exporting CAD views, technical writers annotating them, or specialist illustrators for complex work.
- **Schedule documentation** alongside the product's design freeze and pilot builds, so images show the production version and are ready at launch.

## Creating images from CAD models

For manufacturers with 3D CAD, models are the best source of technical illustrations:

- **Line art views** with hidden lines removed and consistent line weights reproduce clearly in print and on screen.
- **Exploded views** show assemblies with parts separated along their assembly paths, with trails showing how they fit.
- **Shaded or rendered views** help where surfaces and shapes matter.
- **Cutaway and section views** reveal internal features.
- **Configurations** of the model can show different product variants without separate models.

Export illustrations in **vector formats**, such as SVG or PDF, so they stay sharp at any size and are small files. Keep a link between each illustration and the model and revision it came from. Clear views follow the same principles as technical drawings; the [choosing clear views for technical drawings](/insights/choosing-clear-views-for-technical-drawings/) article covers choosing views that explain a design.

## Photographs for documentation

Photographs are best when the real appearance or environment matters. To make them useful:

- **Use a production unit** that matches the documented version, not a prototype.
- **Clean and light the subject** with soft, even light, and remove unrelated tools and debris.
- **Shoot from the user's viewpoint** with a consistent angle across steps.
- **Annotate** with numbered callouts or arrows, keeping text outside the image where possible.
- **Check for confidential content**, such as customer equipment, drawings or screens in the background.

Photographs date quickly when products change, so record which product revision each one shows.

## Screenshots

Screenshots in software and control system instructions should:

- **Be cropped** to the relevant part of the screen.
- **Use consistent window sizes and display settings** so text and controls appear the same size throughout.
- **Highlight** the control to click or the field to complete.
- **Contain no real customer or personal data**; use test data.
- **Be captured as PNG**, which keeps text sharp, rather than JPEG, which blurs it.
- **Be reviewed when software is updated.**

## Safety information in images

Safety warnings must be clear and consistent. Common practice includes:

- **Standard safety signs**: the international standard ISO 7010 defines registered safety signs and symbols, and AS 1319 covers safety signs for the occupational environment in Australia.
- **Signal words** such as danger, warning and caution, used consistently according to the level of risk, with the hazard, its consequence and how to avoid it.
- **Placing warnings before the step** where the hazard arises, with an image of the hazard where helpful.
- **Showing guards and safety equipment in place** in images, unless a step specifically requires their removal under stated conditions.

Information for safe use is part of the duties that work health and safety laws place on designers, manufacturers, importers and suppliers of plant; the [so far as is reasonably practicable](/insights/so-far-as-is-reasonably-practicable/) article explains how those duties are judged.

## Designing for translation and international use

Images reduce translation effort when they are designed for it:

- **Keep text out of images**, using numbered callouts explained in the text, so only the text needs translating.
- **Where text must appear**, keep it on separate editable layers in the source file.
- **Avoid culturally specific gestures, symbols and examples.**
- **Use standard symbols** for tools, actions and hazards.
- **Allow space for longer text**, since translations are often longer than English.

## Accessibility

Documentation is increasingly delivered digitally. Make it accessible:

- **Write alternative text** describing what each meaningful image shows and why it matters for the step.
- **Do not rely on colour alone** to convey meaning; add labels, patterns or line styles, as the Web Content Accessibility Guidelines recommend.
- **Ensure sufficient contrast** between lines, labels and backgrounds.
- **Use tagged, accessible PDFs** or web formats that work with screen readers.
- **Provide text for content in images**, such as captions or transcripts for videos.

## Managing images through product changes

Out-of-date images are a common cause of errors. Treat illustrations as controlled design documents:

- **Link each image to the part numbers, models and revisions it shows.**
- **Store source files**, such as CAD-generated drawings and editable illustration files, not just exported images.
- **Name files consistently** with document, figure and revision identifiers.
- **Include documentation in change control**: when a design change affects a part shown in an image, flag the affected documents and figures for update.
- **Reuse a single library** of approved images across manuals, parts catalogues, training and service information.

The [issue, change and configuration control](/insights/issue-change-and-configuration-control/) article explains how to keep documents aligned with the designs they describe.

## Testing with real users

The best test of an instructional image is whether someone can follow it. Practical methods:

- **Observe a few typical users** following the instructions without help, noting where they hesitate, make mistakes or ask questions.
- **Ask what they think each image shows** before reading the text.
- **Review support calls, warranty claims and installation errors** for patterns pointing to unclear instructions.
- **Fix the images and text** where problems cluster, then retest.

Even a handful of observed users usually reveals most of the serious problems.

## A worked example

This is an illustrative example. A manufacturer of packaged pump skids supplies a 40-page installation and maintenance manual illustrated with photographs of a prototype unit. Installers frequently fit a check valve the wrong way round, route cables through the wrong glands and miss a step in commissioning. The business receives about 12 support calls a month related to installation and several warranty claims a year traced to incorrect installation.

**Review.** The engineering and service teams review the manual and recent calls. They find that the photographs show an earlier prototype with a different layout, that the check valve's flow direction arrow is invisible in the photo, that cable glands are not identified and that two steps are shown in one cluttered image.

**Changes.**

- Installation steps are re-illustrated with line art generated from the current CAD model, one step per image, from the installer's viewpoint.
- An exploded view shows the valve assembly, with a large flow-direction arrow and a magnified detail.
- Cable glands are numbered in an illustration keyed to a table listing each cable.
- Warnings use standard safety signs and appear before the relevant steps.
- Text is kept out of illustrations, with numbered callouts explained in the text.
- Each figure is linked to the model revision, and the manual is added to the change control process.
- Five installers test the draft manual on a production skid while the team observes, leading to two further image changes.

**Result.** Over the following months, installation-related support calls fall to about three a month, and no warranty claims are traced to installation errors in the first year. Translating the manual for an export customer requires translating only the text and callout tables.

## Applying this in an Australian business

- **Choose image types** to suit each purpose: line art for steps, photos for recognition, exploded views for assembly, schematics for systems.
- **Show one step per image** from the user's viewpoint.
- **Generate illustrations from CAD** and export them as vectors.
- **Use standard safety signs** and consistent warnings.
- **Keep text out of images** to simplify translation.
- **Make digital documents accessible.**
- **Control images through design changes.**
- **Test instructions with real users.**

## Where technical images go wrong

- **Photos of prototypes** that do not match production units.
- **Cluttered images** showing several steps at once.
- **Labels inside images** that need redrawing for every language.
- **Screenshots of old software versions.**
- **Colour-only meaning** that some readers cannot see.
- **Images not updated** when the design changes.
- **No testing** with the people who will use the instructions.

## Questions to ask about your documentation images

- Does each image show one clear action from the user's viewpoint?
- Does every image match the product version the document covers?
- Are safety warnings standard, consistent and placed before the hazard?
- Could the document be translated without redrawing images?
- Would a reader using a screen reader or with colour vision deficiency understand it?
- How are images updated when the design changes?

## Bringing it together

Images are often the most important part of technical documentation. Choose the right type for each purpose, keep each image focused on one step from the user's viewpoint, and use CAD to create clear, consistent line art and exploded views. Treat photographs and screenshots carefully, use standard safety symbols, keep text out of images and make digital documents accessible. Above all, manage illustrations as controlled design information, updated with every relevant change, and test them with the people who will use them. The result is documentation that people can follow safely, fewer support calls and products that are installed and maintained correctly.

---

*Source: KEVOS editorial notes, drawing on established technical communication, documentation and illustration practice. The worked example is illustrative. This article is general information and does not replace the work health and safety duties that apply to plant and equipment.*
