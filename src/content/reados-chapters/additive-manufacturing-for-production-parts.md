---
title: "Additive manufacturing for production parts: when 3D printing earns a place on the line"
description: "Beyond prototypes: the main additive processes, design for additive manufacturing, post-processing, qualifying printed parts for real use and how to tell when printing beats tooling on cost."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - product-development
  - prototyping
author: "KEVOS"
featured: false
draft: false
---

Most businesses first meet 3D printing as a prototyping tool: a quick model to check fit, a concept to show a customer, a test part before committing to tooling. That role remains valuable. But additive manufacturing has also become a genuine production process for the right parts. Manufacturers print jigs and fixtures, end-of-arm tooling for robots, low-volume end-use components, spare parts for obsolete equipment, customised products and metal components with internal channels that no other process could make.

The step from prototype to production is larger than it looks. A printed prototype only has to work once, on a bench, for the person who made it. A production part has to work every time, for customers and operators, meet specifications, perform over its life and be made consistently across builds, machines and material batches. Printing a part is easy; qualifying a printed part for reliable use is a manufacturing discipline in its own right.

This article explains, in general terms, the main additive manufacturing processes, how designing for additive manufacturing differs from designing for conventional processes, the post-processing that most printed parts need, how to qualify printed parts for production and how to judge when printing is more economical than tooling. It is general information; process and material suppliers can advise on specific capabilities.

## The main process families

International standards group additive manufacturing processes into seven categories. The ones most commonly used for production parts are summarised below.

| Process family | Common examples | Typical materials | Strengths | Limitations |
|---|---|---|---|---|
| Material extrusion | Fused filament fabrication | Thermoplastics, including fibre-filled grades | Low cost, accessible, good for fixtures and tooling | Visible layers, anisotropic strength, moderate accuracy |
| Vat photopolymerisation | Stereolithography and related processes | Photopolymer resins | Fine detail and smooth surfaces | Material properties and ageing vary by resin |
| Powder bed fusion (polymer) | Laser sintering and similar processes | Nylons and other polymers | No support structures, good for functional parts and batches | Grainy surface; powder handling |
| Powder bed fusion (metal) | Laser and electron beam melting | Stainless steels, aluminium, titanium, nickel alloys, tool steels | Complex metal parts with internal features | High cost; supports, residual stress and post-processing |
| Binder jetting | Binder jetted metal or sand | Metals (sintered after printing), sand for moulds | Fast builds; printed sand moulds and cores for casting | Sintering shrinkage for metals |
| Material jetting | Inkjet-style deposition of photopolymers | Photopolymers, multi-material | High detail, multiple materials and colours | Material properties, cost |
| Directed energy deposition | Wire or powder fed into a melt pool | Metals | Large parts, repair and adding features | Lower resolution; machining usually required |

Printed sand moulds and cores deserve a special mention: they allow complex castings without patterns and can shorten casting lead times for prototypes and low volumes.

## Where additive manufacturing earns its place

Printing tends to be competitive when one or more of the following apply:

- **Low volumes**, where tooling cost cannot be spread over many parts.
- **Complex geometry**, such as internal channels, lattices or organic shapes that would be expensive or impossible to machine or mould.
- **Part consolidation**, where an assembly of several parts can be printed as one, removing fasteners and assembly time.
- **Customisation**, where each part is different, as in some medical and consumer products.
- **Speed**, where a part is needed before conventional tooling could be made.
- **Manufacturing aids**, such as jigs, fixtures, gauges and grippers, which are usually low volume and benefit from fast iteration. The [designing jigs and fixtures that pay for themselves](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-jigs-and-fixtures-that-pay/) article explains the principles that printed fixtures must still follow.
- **Spare parts**, especially for obsolete equipment, where the original supplier no longer exists.

It is usually not competitive for simple shapes in high volumes, where moulding, casting, stamping or machining are faster and cheaper per part.

## Designing for additive manufacturing

Designing for additive manufacturing differs from designing for machining or moulding. Key considerations include:

- **Build orientation.** The orientation of the part in the build affects strength, surface finish, accuracy, support requirements, build time and cost. Many processes produce parts that are weaker between layers than along them, so orientation should align critical loads with the stronger direction.
- **Overhangs and supports.** Many processes need support structures for surfaces that overhang beyond a certain angle. Supports add material, time and post-processing, and leave marks. Self-supporting angles, chamfers instead of flat overhangs and teardrop-shaped horizontal holes reduce supports.
- **Minimum features.** Each process has practical minimum wall thicknesses, hole sizes and gaps. Thin features may not form properly; small holes may close up.
- **Powder and resin removal.** Internal cavities in powder and resin processes need escape holes so unfused material can be removed.
- **Consolidation.** Combining parts can remove fasteners and assembly, but it can also make maintenance and replacement harder. Consolidate deliberately.
- **Lightweighting.** Lattices and topology optimisation can reduce mass where weight matters, but they add design effort and can complicate inspection and cleaning.
- **Machining allowances.** Critical surfaces, holes and threads that need tight tolerances are often printed with extra material and machined afterwards. Plan datums for machining.

## Post-processing

Few printed production parts are used straight off the machine. Post-processing may include:

- removing supports and unfused powder or resin;
- curing, for resin processes;
- **stress relief and heat treatment**, often essential for metal powder bed parts to reduce residual stress and achieve properties;
- **hot isostatic pressing** for some critical metal parts, to close internal porosity;
- machining critical features;
- surface finishing, such as bead blasting, tumbling, polishing, dyeing or coating; and
- inspection.

Post-processing can be a large share of total cost and lead time, so it belongs in any cost comparison.

## Qualifying printed parts for production

Moving a printed part into production requires evidence that it will perform consistently. A practical qualification approach includes:

1. **Define the requirements**: loads, environment, temperature, chemical exposure, life, dimensional and cosmetic requirements and any regulatory obligations.
2. **Fix the process**: machine, material and its supplier, build parameters, orientation, post-processing steps and their parameters. Treat these as a controlled recipe, so changes are deliberate.
3. **Test the part, not just the material.** Material datasheets describe test specimens under particular conditions. Test real parts, or coupons printed in the same build and orientation, under conditions representing service.
4. **Check variation.** Compare parts from different positions in the build, different builds and, where relevant, different machines and material batches.
5. **Inspect appropriately.** Dimensional checks, visual inspection and, for critical metal parts, techniques such as CT scanning to detect internal defects.
6. **Approve a first article** and control changes thereafter, as for any production process.

The depth of qualification should match the consequences of failure. A printed cable clip needs little; a load-bearing bracket or a pressure-containing part needs much more. The [proving a process is ready for production](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) article describes the evidence that production readiness generally requires.

## Digital inventory and spare parts

One of the most practical uses of additive manufacturing is reducing the need to hold physical stock of slow-moving parts. Instead of storing dozens of rarely used brackets, covers or knobs, a business can hold a qualified digital file and print parts when needed. This is sometimes called a **digital inventory**.

A digital inventory only works if the files are controlled like any other engineering document: the correct revision, the material and process specification, orientation and post-processing instructions and the inspection requirements must travel with the file. Otherwise, a part printed in two years' time on a different machine or material may not match the original. Intellectual property also matters. Printing replacement parts for equipment designed by someone else may infringe rights, and it may transfer responsibility for performance to the business that prints the part. Check before printing parts you did not design.

## Health and safety

Additive manufacturing introduces hazards that are easy to overlook in an office or workshop setting:

- **Metal powders** can be combustible and, in some cases, explosive when dispersed in air, and fine powders can be harmful if inhaled. Handling, storage, inert gas systems and housekeeping need specific controls.
- **Resins** used in photopolymer processes can irritate skin and cause sensitisation; gloves and good handling practice are important.
- **Fumes and particles** from material extrusion and other processes may require ventilation, particularly in enclosed spaces.
- **Heat, lasers and moving parts** in industrial machines bring the usual machinery hazards.

These hazards fall within an employer's work health and safety duties. Safety data sheets for materials and machine manufacturers' instructions should guide controls, and higher-risk processes such as metal powder bed fusion usually need specialist facilities and training.

## Comparing cost with tooling

The cost of a printed part is driven mainly by machine time, material, labour for set-up and post-processing and inspection. In powder bed processes, build height strongly influences machine time, and parts can be nested to fill the build volume. Conventional processes have high tooling costs but low piece prices.

As an illustration, consider a complex plastic duct needed at about 300 parts a year. Injection moulding would need a tool costing $18,000, with a piece price of $3. Polymer powder bed fusion would cost about $22 per part, including finishing, with no tooling. The total cost of n parts is $18,000 + $3n for moulding and $22n for printing. They are equal when 19n = 18,000, or at about 950 parts. At 300 parts a year, printing is cheaper for roughly the first three years of production, and it allows design changes without modifying a tool. If volumes grow or the design stabilises, moulding becomes the cheaper option.

## A worked example

This is an illustrative example. The figures are hypothetical.

A small food equipment manufacturer uses about 25 assembly and inspection fixtures a year, each machined from aluminium at an average cost of $650, including design and machining, with a lead time of two to three weeks. Many are used for small batches and modified frequently.

The business buys an industrial material extrusion printer and fibre-filled nylon filament. For suitable fixtures, it prints the body and adds machined steel locating pins and threaded inserts at critical points. A typical printed fixture costs about $90 in material and labour, takes about six hours to print and is ready in two days.

The business sets rules. Printed fixtures are not used where they would carry significant loads, heat or cutting forces. Locating features that need accuracy use metal pins pressed into reamed holes. Each fixture design is checked on a first article before use. Over a year, about 18 of the 25 fixtures are printed. At a saving of about $560 each, the business saves around $10,000, and fixtures are available in days rather than weeks, which shortens its new product introductions.

## How this applies to a small Australian business

- **Start with manufacturing aids.** Jigs, fixtures, gauges and grippers are low-risk, high-value applications.
- **Choose the process for the requirement.** Different processes suit different materials, accuracies and volumes.
- **Design for the process.** Orientation, supports, minimum features and machining allowances matter.
- **Include post-processing in costs.**
- **Qualify before relying on printed parts.** Fix the process and test real parts.
- **Compare total cost at realistic volumes**, including tooling, post-processing and design change.
- **Use service bureaus** for processes you do not own, especially metal printing.
- **Control the files.** Treat print files, settings and post-processing instructions as controlled documents.

## Common mistakes

- **Using prototype parts in production** without qualification.
- **Relying on material datasheets** without testing real printed parts.
- **Ignoring build orientation** and the weaker direction between layers.
- **Forgetting post-processing costs and time.**
- **Printing simple, high-volume parts** that conventional processes make more cheaply.
- **Uncontrolled process changes**, such as new material batches or parameters, without checking them against the qualified recipe.

## Frequently asked questions

**Are printed metal parts as strong as machined ones?** Properly processed and heat-treated metal printed parts can achieve properties comparable to cast or, in some cases, wrought material, but they can contain defects and anisotropy. Properties must be verified for the specific process and part.

**Can we print spare parts for equipment we bought?** Technically often yes, but consider intellectual property, the original part's requirements and whether the printed part will perform safely.

**Should we buy a printer or use a service bureau?** Service bureaus give access to many processes and materials without capital investment and are ideal while learning. Owning a machine makes sense when demand for a particular process is regular and the business can build the skills to run it well.

## Questions to ask

- Which of our parts are low volume, complex, customised or urgently needed?
- Which manufacturing aids could be printed faster and cheaper?
- What are the real requirements for a printed production part, and how will we test them?
- Is our process fixed and controlled, including material and parameters?
- At what volume does tooling become cheaper than printing for each candidate part?

## Bringing it together

Additive manufacturing has moved beyond prototyping into production for the right parts: low volumes, complex shapes, consolidated assemblies, customised products, manufacturing aids and spares. Success depends on choosing the right process, designing for its characteristics, planning post-processing and qualifying parts with a controlled process and real testing. Comparing total cost at realistic volumes shows where printing beats tooling, and where conventional processes remain the better choice. The [notes on prototyping early](/reados/collections/product-development-and-launch/notes-on-prototyping/) article covers the earlier, exploratory role of printed parts.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
