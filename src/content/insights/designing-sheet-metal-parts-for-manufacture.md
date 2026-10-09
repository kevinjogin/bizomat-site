---
title: "Designing sheet metal parts for economical manufacture: bends, holes, flat patterns, fasteners and tolerances"
description: "Sheet metal parts are cheap when designed for the cutter and press brake. How to set bend radii, place holes and flanges, get flat patterns right and tolerance folded parts."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - product-development
author: "KEVOS"
featured: false
draft: false
---

Sheet metal enclosures, brackets, panels and chassis are among the most common parts in machinery and equipment. They can be inexpensive and quick to make: a sheet is cut on a laser or turret punch, folded on a press brake and assembled. They can also be surprisingly costly. A part with four different bend radii needs four tool changes. A hole too close to a bend distorts when the part is folded. A flange too short will not sit on the brake die. Nuts welded on, corners welded and ground, and tight tolerances across several bends can double the labour and produce rework.

Most of that cost is designed in, as the [cost you commit before you spend](/insights/the-cost-you-commit-before-you-spend/) article explains for products generally. The fabricator can only make what the drawing asks for, and many sheet metal drawings are created by modelling solid shapes that happen to be thin, without the rules of folding in mind. Designing with the manufacturing process in mind, often called **design for manufacture**, keeps the part functional while making it cheaper, faster and more consistent to produce.

This article explains how sheet metal parts are made, the rules for bends, flanges, holes and reliefs, how flat patterns and bend allowances work, how to add fasteners and joints without welding, how to tolerance folded parts and when tooling for stamping becomes worthwhile. It is general information for designers, engineers and buyers. Exact minimum dimensions depend on material, thickness and the fabricator's tooling, so confirm them with the people making the parts.

## How sheet metal parts are made

Most low- and medium-volume sheet metal parts follow a common route:

1. **Cutting the flat blank** on a fibre laser or a CNC turret punch, which can also form features such as louvres, countersinks and extrusions.
2. **Deburring** the cut edges.
3. **Bending** on a CNC press brake, which folds the sheet between a punch and a V-shaped die, one bend at a time.
4. **Inserting hardware**, such as self-clinching nuts and studs, and **joining**, by welding, riveting or fastening.
5. **Finishing**, such as powder coating or plating.

For high volumes, parts may instead be made in **stamping dies**, including progressive dies that cut and form a part in a series of stations on each press stroke. Stamping gives very low part cost but needs expensive dedicated tooling.

Sheet is commonly specified by thickness in millimetres in Australia, although gauge numbers still appear. Gauge numbers run backwards, with higher numbers meaning thinner sheet, and depend on the material, so always state the thickness and material.

## Bend radius: choose one and keep it

The **inside bend radius** should suit the material and thickness. A common starting point for mild steel is an inside radius of about one material thickness; harder, stronger and less ductile materials, including some aluminium alloys and tempers, need larger radii to avoid cracking on the outside of the bend. Bending across the rolling direction of the sheet, rather than along it, also reduces cracking risk on tight bends.

Use the **same radius for every bend** on a part, and ideally across a product family, so the press brake can make all the bends without changing tools. Specify radii that match the fabricator's standard tooling.

## Choosing material and thickness

The material choice affects how easily a part bends, how much it springs back and how it will be finished:

- **Cold-rolled mild steel** bends well, takes tight radii and is the usual choice for painted or powder-coated enclosures and brackets.
- **Hot-rolled steel** is cheaper in heavier thicknesses but has mill scale and looser thickness tolerances.
- **Galvanised steel** gives corrosion protection without separate coating, although cut edges are unprotected and welding galvanised sheet produces zinc fume that must be controlled.
- **Stainless steels** such as 304 and 316 resist corrosion but are stronger, work harden as they are formed and spring back more, so they need more tonnage and larger allowances.
- **Aluminium** is light, but formability varies widely by alloy and temper. Alloys such as 5052 in a half-hard temper bend well, while 6061 in the fully heat-treated T6 temper is prone to cracking on tight bends and needs much larger radii.

Use the thinnest standard thickness that meets stiffness and strength needs, and add stiffness with flanges, hems and ribs rather than extra thickness. A thinner sheet cuts faster, bends with less force and weighs less, but very thin panels may need stiffening to avoid drumming and denting.

## Checking that the part can be bent

A part can be geometrically correct and still impossible to fold on the available equipment. Each bend must be made with the part held against the back gauge and the punch coming down into the die, and earlier flanges must clear the punch, the die and the machine as the part is turned for later bends.

Common problems include:

- **Deep boxes and return flanges** that collide with a straight punch. Gooseneck punches and segmented box tooling help, but have limits on flange height.
- **Narrow channels** where the flanges are tall compared with the width between them, so the second flange hits the punch.
- **Short offsets or joggles**, where two opposite bends are too close together for standard tooling.
- **Long parts** that exceed the brake length or need more tonnage than the machine provides.
- **Hardware inserted before bending** that then fouls the tooling, or hardware that cannot be reached by the insertion press after bending.

Fabricators check bend sequences in offline programming software or by experience. A short conversation before the design is fixed costs far less than a part that has to be redesigned or welded together from pieces.

## Flanges, holes and reliefs

A few geometric rules prevent most bending problems:

- **Minimum flange length**: the flange must be long enough to span the V-die opening. A rough guide is about four times the material thickness, but it depends on the die used.
- **Holes near bends**: holes and slots too close to a bend line stretch out of shape when the part is folded. Keep them a few material thicknesses plus the bend radius away from the bend, or cut them after bending.
- **Holes near edges and each other**: leave at least about one to two thicknesses between a hole and an edge or another hole.
- **Minimum hole size**: for punched holes, the hole diameter should generally be at least the sheet thickness.
- **Bend reliefs**: where a bend ends at an edge or meets another bend, a small cut-out relief lets the metal fold without tearing or bulging.
- **Corner reliefs**: where two flanges meet at a corner, a relief prevents interference and makes a neater corner.

Hems, which fold an edge back on itself, stiffen edges and remove sharp edges for safety. Ribs and embossed features add stiffness to large flat panels without adding thickness.

## Flat patterns and bend allowance

Before a folded part can be cut, its **flat pattern** must be known: the shape and size of the blank that becomes the finished part after bending. When sheet bends, the outside stretches and the inside compresses. The length of the bent zone is calculated along a **neutral line** that neither stretches nor compresses. Its position is described by the **K-factor**: the distance of the neutral line from the inside surface as a fraction of the thickness. Values often fall between about 0.3 and 0.5, depending on material, radius and bending method.

The **bend allowance**, the length of the neutral line through the bend, is the bend angle in radians multiplied by the inside radius plus K times the thickness. For a 90° bend in 2 mm steel with a 2 mm inside radius and a K-factor of 0.4, the bend allowance is about 1.571 × (2 + 0.8), or roughly 4.4 mm. An L-bracket with outside legs of 50 and 30 mm has straight portions of 46 and 26 mm once the radius and thickness are subtracted from each leg, so the blank is about 46 + 26 + 4.4, or 76.4 mm long, not the 80 mm the outside dimensions suggest. Errors of a millimetre or so per bend add up quickly on a part with several folds.

CAD sheet metal tools calculate flat patterns automatically from the thickness, radius and K-factor or bend allowance. Default values are only starting points. Press brakes, tooling and material batches behave differently, so fabricators establish their own bend allowances by bending and measuring test pieces. Use the fabricator's values, or send the folded model and let them develop the flat pattern. Model sheet metal parts with proper sheet metal features, not as solid extrusions, so they can be unfolded correctly.

**Springback** also matters: when the press releases, part of the bend recovers elastically and the angle opens slightly. Fabricators compensate by over-bending, and springback is larger for stronger materials and larger radii.

## Fasteners and joints without welding

Welding sheet metal is slow, distorts thin parts and usually requires grinding and refinishing. Alternatives often work better:

- **Self-clinching nuts, studs and standoffs** are pressed into punched or laser-cut holes, giving strong threads in thin sheet without welding.
- **Rivet nuts** and blind rivets join parts from one side.
- **Tab-and-slot designs** let parts locate themselves for welding or fastening, reducing the need for fixtures.
- **Hemmed and clinched joints** join sheets without consumables.
- **Spot welding** suits volume joining of steel sheet with little distortion.

Where welding is necessary, design joints for easy access and minimal heat, and consider whether corners can be closed by bending and riveting instead.

## Tolerancing folded parts

Each bend adds variation, because the bend line position, the angle and the bend allowance all vary slightly. Tolerances across several bends accumulate. Practical rules:

- **Do not apply tight tolerances** to dimensions that span several bends unless function demands it.
- **Dimension from a datum** feature, usually a flat face or a key hole pattern, rather than from bend to bend.
- **Keep critical hole patterns on one flat face**, where their positions come from the accurate cutting process rather than the bending process.
- **Use slotted holes** or adjustable features where assemblies must line up across folded parts.
- **Specify bend angles** with realistic tolerances, and state which side of the material a dimension is to.

## Material and sheet use

Design parts to nest efficiently on standard sheet sizes, which in Australia are commonly 2400 × 1200 mm and 3000 × 1500 mm, and use standard thicknesses that suppliers stock. Consider pre-finished material, such as galvanised or pre-painted sheet, where cut edges are acceptable. For parts that will be powder coated, include hanging holes and avoid tight internal pockets that trap coating or prevent even coverage.

## When stamping tooling pays

Laser cutting and press brake bending need no part-specific tooling, so they suit low and medium volumes and frequent design changes. Stamping in dedicated dies costs far less per part but needs a significant tooling investment and a stable design. The force needed also matters: blanking or piercing force is roughly the cut perimeter times the thickness times the material's shear strength. Blanking a 50 mm disc from 2 mm steel with a shear strength of 350 MPa needs about 110 kN, plus a margin.

Compare total costs over the expected volume: tooling cost divided by the saving per part gives the breakeven quantity. Turret punching with standard tools sits between the two, suiting repetitive holes and formed features without dedicated dies. The [value engineering is not cost cutting](/insights/value-engineering-is-not-cost-cutting/) article covers reviewing designs for function and whole-of-life value, which applies directly to sheet metal redesigns.

## A worked example

This is an illustrative example. A 30-person business makes electrical control enclosures in 1.6 mm mild steel, about 1,500 a year across several sizes. Each enclosure takes about 2.1 hours to fabricate, and a share need rework because doors do not line up.

**Review.** The engineer and the fabrication supervisor review the design against sheet metal rules and find:

- Four different inside bend radii, requiring tool changes.
- Nuts welded inside the enclosure for mounting rails, followed by grinding and touch-up.
- Corners closed by welding and grinding.
- Door hinge holes dimensioned across three bends with a tight tolerance.
- Holes for cable glands too close to a bend, distorting when folded.

**Redesign.**

- A single inside radius matching the brake's standard tooling.
- Self-clinching studs and nuts replace welded nuts.
- Corner reliefs and overlapping tabs closed with blind rivets replace welded corners, with a sealing strip for the required ingress protection.
- Hinge holes placed on a single flat face, dimensioned from a datum hole, with slotted holes on the door for adjustment.
- Gland holes moved further from the bend.
- Flat patterns developed using the fabricator's measured bend allowances.

**Result.** Fabrication time falls from about 2.1 to about 1.2 hours per enclosure, saving roughly 1,350 hours a year at current volumes, and door alignment rework stops. Welding and grinding are almost eliminated, which also reduces fume and noise.

**Stamping decision.** The business asks whether to tool a progressive die for the most common enclosure body. Tooling is quoted at about $60,000, saving about $9 per part, giving a breakeven of about 6,700 parts. At current volumes of that size, that would take several years, and the design is still evolving, so the business stays with laser cutting and press brake bending.

## Applying this in an Australian business

- **Design with the press brake in mind**, using sheet metal modelling tools.
- **Choose one inside bend radius** to suit material and tooling.
- **Respect flange, hole and edge distances**, and add bend and corner reliefs.
- **Use the fabricator's bend allowances** for flat patterns.
- **Replace welded nuts and corners** with self-clinching hardware, rivets and tabs where suitable.
- **Keep critical features on one face** and dimension from datums.
- **Nest parts efficiently** on standard sheet sizes and thicknesses.
- **Run a breakeven check** before investing in stamping tooling.
- **Talk to your fabricator** before the design is fixed.

## Where sheet metal designs go wrong

- **Parts modelled as solids** that cannot be unfolded.
- **Many different bend radii** on one part.
- **Holes too close to bends**, distorting when folded.
- **Flanges too short** for the tooling.
- **Tight tolerances across several bends.**
- **Welding where hardware or rivets would do.**
- **Software default bend allowances** that do not match the shop.

## Questions to ask before releasing a sheet metal part

- Can this part be unfolded correctly, using our fabricator's bend values?
- How many different bend radii and tool set-ups does it need?
- Are holes, slots and flanges far enough from bends and edges?
- Which dimensions cross several bends, and do they need to be tight?
- Could self-clinching hardware, rivets or tabs replace welding?
- At what volume would stamping tooling pay for itself?

## Bringing it together

Sheet metal parts are economical when they are designed for the way they are made. Use proper sheet metal modelling, one inside bend radius suited to the material and tooling, and sensible distances between holes, flanges, edges and bends, with reliefs where metal must move. Develop flat patterns from the fabricator's measured bend allowances, replace welding with self-clinching hardware, rivets and tabs where possible and keep critical features on single faces dimensioned from datums. Nest efficiently, check stamping breakevens before investing in tooling and involve the fabricator early. The result is parts that fold right first time, assemble without fuss and cost less to make.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS manufacturing handbooks on sheet metal working and presses, press tools, punches and dies, process selection for press work, and sheet metal design in CAD, together with established fabrication practice. The worked example is illustrative. This article is general information; confirm minimum dimensions with your fabricator.*
