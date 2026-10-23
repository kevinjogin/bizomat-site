---
title: "Drawings and documentation packages that suppliers can quote and make from"
description: "Vague drawings bring padded quotes, endless questions and wrong parts. What a complete package contains and how to dimension, annotate, control revisions and check drawings before release."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - manufacturing
  - communication
author: "KEVOS®"
featured: false
draft: false
---

A drawing is a contract. When a business sends parts out to be made, the drawing and its supporting documents are what the supplier prices, makes and inspects against. If something is missing or ambiguous, the supplier has three choices: ask, guess or price in the risk. Asking slows the quote. Guessing produces parts that do not fit. Pricing in risk produces quotes that vary wildly and are often too high.

Many businesses send out drawings that were good enough for an in-house workshop, where the designer could be asked over the bench. Material is described as "steel", tolerances are missing or copied from an old template, finishes are left to the supplier, welds are not specified and the 3D model does not match the drawing revision. Each gap costs time, money or quality. The fix is not more paperwork for its own sake; it is a complete, consistent package that a supplier who has never met the designer can price, make and prove without asking questions.

This article explains what a complete documentation package contains, the drawing conventions that make drawings readable, how to dimension and annotate for function, how to manage units, revisions and models, and how to check a package before release. It is general information for designers, engineers and buyers. In Australia, technical drawing conventions are set out in the AS 1100 series, and specific industries may have additional requirements.

## What a complete package contains

A package for manufactured parts or assemblies usually includes:

- **Detail drawings** for each made part, defining geometry, tolerances, material, finish and any treatments.
- **Assembly or general arrangement drawings** showing how parts go together, with item numbers.
- **A parts list or bill of materials** listing every item, quantity, material or specification and whether it is made or bought.
- **3D models**, usually in a neutral format such as STEP, for suppliers who program machines or cutters from models.
- **Specifications** for welding, coatings, heat treatment, testing and inspection, either on the drawing or in referenced documents.
- **Quality requirements**: inspection and test plans, certificates, first-article inspection and records required.
- **Commercial information** in the request for quote: quantities, batch sizes, delivery dates, packaging, marking, confidentiality and terms.

The [how much design before seeking quotes](/reados/collections/procurement-and-tendering/how-much-design-before-seeking-quotes/) article discusses how complete a design needs to be at different stages; this article focuses on the package for production parts.

## Drawing conventions

AS 1100.101 sets out general principles for technical drawing in Australia, with further parts for mechanical engineering and other disciplines. The key conventions include:

- **Sheet sizes** from the ISO A series, A0 to A4.
- **A title block** showing the organisation, drawing title, unique drawing number, revision, scale, projection method, units, and the names or signatures and dates of those who drew, checked and approved it.
- **Standard notes** near the title block, such as "Dimensions in millimetres" and "Do not scale", so the drawing is read from its figures, not measured.
- **Line types** with defined meanings: thick continuous for visible edges, thin dashed for hidden detail, thin chain for centre lines, thick-ended chain for cutting planes. Two line weights, thick and thin, keep drawings legible.
- **Projection method**: third-angle and first-angle projection place views differently. Both are used in Australian industry, and imported drawings often use first angle. The projection symbol must always be shown, because reading a drawing in the wrong projection puts features on the wrong side.
- **Views and sections**: use the fewest views that leave nothing ambiguous, and sections to show internal detail rather than masses of hidden lines.

Abbreviations should be standard and few. The guiding rule is simple: when in doubt, spell it out.

## Dimensioning for function

Good dimensioning follows three habits:

- **Dimension each feature once.** Repeated dimensions eventually disagree. Where a repeated value helps the reader, mark it as a reference dimension.
- **Dimension what matters to function**, such as hole positions from the mating face, rather than what was convenient in the CAD model.
- **Dimension from datums**, not in chains, because tolerances accumulate along a chain.

Three steps each dimensioned 20 ± 0.1 mm in a chain put the last face anywhere within 60 ± 0.3 mm. Dimensioned from one datum face as 20, 40 and 60 mm, each ± 0.1 mm, no face is worse than ± 0.1 mm. The tolerances are the same; the certainty is three times better.

```figure
type: svg
title: Chain or datum dimensioning
alt: Three steps dimensioned in a chain, each 20 plus or minus 0.1 millimetres, let the last face vary by plus or minus 0.3. The same steps dimensioned from one datum face at 20, 40 and 60 millimetres keep every face within plus or minus 0.1.
caption: Tolerances add up along a chain; dimensions from one datum do not.
viewbox: 0 0 600 220
body:
<text class="txb" x="20" y="30">Chain</text>
<path class="ln" d="M80 70H200V50H320V30H440"/>
<path class="lf" d="M80 90H200M200 90H320M320 90H440"/>
<text class="tx txs" x="140" y="104" text-anchor="middle">20 ± 0.1</text>
<text class="tx txs" x="260" y="104" text-anchor="middle">20 ± 0.1</text>
<text class="tx txs" x="380" y="104" text-anchor="middle">20 ± 0.1</text>
<text class="txa" x="520" y="60" text-anchor="middle">last face ± 0.3</text>
<text class="txb" x="20" y="150">Datum</text>
<path class="la" d="M80 190H200V170H320V150H440"/>
<path class="lf" d="M80 200V140"/>
<text class="tx txs" x="200" y="214" text-anchor="middle">20</text>
<text class="tx txs" x="320" y="214" text-anchor="middle">40</text>
<text class="tx txs" x="440" y="214" text-anchor="middle">60</text>
<text class="txb" x="520" y="180" text-anchor="middle">every face ± 0.1</text>
```

**Every dimension needs a tolerance**, either stated on the dimension or covered by a general tolerance note, such as a reference to ISO 2768 medium class. Apply tight tolerances only where function requires, because they drive cost. Where position, form or orientation matter, **geometric dimensioning and tolerancing**, under ISO GPS standards or ASME Y14.5, defines them unambiguously relative to datums. State which system the drawing follows.

**Define the result, not the process**, unless the process matters. A note saying "drill" where a hole is required stops a supplier using a cheaper equivalent method. Specify a process only when it affects function, such as reaming for a precise fit or forging for grain flow.

## Notes and specifications

Notes turn geometry into a part. Include:

- **Material**: the standard and grade, and condition if relevant, such as "Steel to AS/NZS 3678 grade 350" or "Aluminium 6061-T6", never just "steel" or "aluminium".
- **Finish**: coating system, thickness, colour and preparation, or plating with its standard and thickness.
- **Heat treatment**: process, hardness range with scale, case depth and test locations.
- **Edges**: a general note such as "Break all sharp edges 0.2 to 0.5 mm".
- **Surface texture**: using standard symbols, only on surfaces where it matters.
- **Threads**: full designation, such as M10 × 1.5-6H, and depth.
- **Welding**: standard weld symbols under AS 1101.3, and the welding standard and category, such as AS/NZS 1554.1 and its weld category.
- **Inspection**: critical characteristics, testing such as non-destructive examination, and certificates required.
- **Marking and packaging**, where needed.

Mark **critical-to-function characteristics** clearly, so the supplier knows which features need the most care and which will be inspected.

## Units

Use SI units throughout, with millimetres for dimensions, and avoid mixing units on one drawing. Be careful with imported or legacy drawings in inches. One inch is exactly 25.4 mm, so converted dimensions should be rounded sensibly for their tolerance rather than carried to many decimal places. Convert pressure, force and torque consistently: one pound-force is about 4.448 newtons and one pound per square inch about 6.895 kilopascals. Surface finish values in microinches convert to micrometres by multiplying by 0.0254. Write units with values in notes, and check conversions on critical values.

## Models, drawings and which one governs

Many suppliers now program machines, laser cutters and inspection directly from 3D models. Models and drawings must match. Release them together, at the same revision, and state on the drawing or in the request which governs if they conflict. Some businesses adopt **model-based definition**, where tolerances and notes are attached to the 3D model itself, removing the separate drawing for some parts. This works well when suppliers can read and use the annotated models; check before adopting it.

Provide models in a neutral format such as STEP for geometry exchange, and native files only when agreed. The [preparing CAD files for a reliable handover](/reados/collections/cad-drafting-and-drawing-standards/preparing-cad-files-for-a-reliable-handover/) article covers preparing models and files for others to use.

## Revision control

A changed drawing gets a new revision identifier and a record of what changed, never a silent edit. Practical rules:

- **Keep a drawing register** listing current revisions of all drawings and models.
- **Describe each change** in a revision table, and cloud or flag changed areas where helpful.
- **Withdraw superseded revisions** from suppliers and the workshop.
- **Quote the revision** on purchase orders, so the supplier makes the right one.
- **Assess changes** for their effect on parts in stock, in production and in service.

Use clear **release states**, such as preliminary, for quotation and approved for manufacture, and show the state on each sheet. Suppliers should never make production parts from drawings marked for quotation only. A product data management system can enforce these states and keep models, drawings and parts lists linked, but a disciplined register and folder structure works for smaller businesses.

## Assembly drawings and parts lists

Assembly drawings show how parts fit together, not how each part is made. They should identify every item with a balloon number matching the parts list, show key assembly dimensions and clearances, and include assembly instructions that affect function, such as fastener tightening torques, adhesives, lubricants, shimming and adjustment. Exploded views help where the assembly sequence matters.

The **parts list** links everything: item numbers, part numbers, descriptions, quantities, materials or specifications, and whether each item is made, bought or supplied by the customer. Keep it consistent with the assembly drawing and the bill of materials in the business's systems, so purchasing, production and suppliers all work from the same list.

## Bought-out and standard parts

Bought-out items, such as bearings, motors, fasteners, seals and fittings, should be specified by manufacturer and part number, or by standard and grade where any compliant part will do. State whether substitutes are acceptable and who approves them. For fasteners, give the full designation, property class, finish and standard. Ambiguous descriptions such as "M10 bolt" invite parts of the wrong strength, length or coating.

## Protecting confidential information

Packages sent for quotation carry design information that may be valuable or confidential. Send only what each supplier needs to quote and make their parts, not complete product designs. Use confidentiality agreements where appropriate, mark documents with their confidentiality status, and agree how files will be stored and deleted if the supplier is not successful. Check that packages do not include information belonging to customers or other suppliers that the business is not entitled to share.

## Checking before release

An independent check catches most errors before they cost money. A drawing checker asks:

- Can every feature be made and inspected from the information given?
- Is every dimension present once, with a tolerance?
- Are datums functional and consistent with how the part mates?
- Are material, finish, treatments and welds fully specified?
- Do the drawing and model match, at the same revision?
- Are units, projection and scale stated?
- Are critical characteristics identified?
- Is the parts list complete and consistent with the assembly?

## Preparing the request for quote

The request for quote should include the package, quantities and batch sizes, required delivery, inspection and documentation requirements, packaging, confidentiality terms and the response format, so quotes can be compared fairly. Invite suppliers to suggest changes that would reduce cost without affecting function; good suppliers often know cheaper ways to achieve the same result.

## A worked example

This is an illustrative example. A business sends a welded steel frame out for quotation to five fabricators. The drawing package consists of an assembly drawing with overall dimensions, a note saying "weld all round" and "paint", and a 3D model at a different revision. Quotes range from about $1,800 to $4,600 per frame, and the business receives about 30 questions from suppliers.

**Revision.** The engineer rebuilds the package:

- Detail drawings for each cut and folded part, with a parts list.
- Material specified to AS/NZS 3679.1 grade 300 for sections and AS/NZS 3678 grade 250 for plate.
- Weld symbols on each joint, referencing AS/NZS 1554.1 and the required weld category.
- Datum-based dimensioning of mounting holes from the frame's base, with tight tolerances only on the mounting pattern.
- A general tolerance note for everything else.
- A coating specification with surface preparation, primer and topcoat thickness and colour.
- Inspection requirements, including first-article dimensional checks and coating thickness records.
- A STEP model at the same revision, with a note that the drawing governs.

**Result.** Revised quotes fall within about $2,300 to $2,900, questions drop to a handful, and the first frames fit at installation without rework. The narrower spread shows suppliers are pricing the same job rather than different guesses.

```figure
type: range
title: Fabricator quotes for the same steel frame
unit: $
min: 1500
max: 5000
caption: About 30 supplier questions before; a handful after, and the first frames fitted without rework.
- First package: incomplete | 1800 | 4600
- *Revised package | 2300 | 2900
```

## Applying this in an Australian business

- **Treat the package as a contract** for price, manufacture and inspection.
- **Follow AS 1100 conventions**, including title blocks and projection symbols.
- **Dimension once, for function, from datums**, with tolerances everywhere.
- **Specify materials, finishes, treatments and welds** by standard and grade.
- **Use SI units consistently** and check conversions.
- **Release models and drawings together**, stating which governs.
- **Control revisions** with a register and change records.
- **Check independently** before release.

## Where documentation packages go wrong

- **"Steel", "paint" and "weld all round"** as the only specifications.
- **Missing tolerances** or tight tolerances everywhere.
- **Chain dimensioning** of features that must line up.
- **Models and drawings at different revisions.**
- **No projection symbol** on imported or legacy drawings.
- **Silent edits** without revision changes.
- **Requests for quote** without quantities, inspection or delivery requirements.

## Questions to ask before sending a package out

- Could a supplier who has never seen this product make and inspect it from this package alone?
- Is every material, finish, treatment and weld specified?
- Are dimensions functional, from datums, with tolerances?
- Do the model and drawings match, and which governs?
- Which characteristics are critical, and how will they be checked?
- Is the revision status clear on every document?

## Bringing it together

A documentation package is the contract between designer and supplier. Make it complete: detail and assembly drawings, parts list, models, specifications, quality requirements and commercial terms. Follow drawing conventions so anyone can read it, dimension once for function from datums with sensible tolerances, and specify materials, finishes, treatments and welds properly. Use consistent units, release matching models and drawings, control revisions and check before release. The result is faster, more consistent quotes, fewer questions and parts that fit first time.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on technical drawing principles, drafting practices, engineering drawings and drafting standards in CAD, detail drafting, symbols and abbreviations, and measuring units and conversions, together with established engineering documentation practice. The worked example is illustrative. This article is general information; follow the AS 1100 series and industry requirements.*
