---
title: "Designing parts for casting: walls, draft, cores, shrinkage and working with your foundry"
description: "How solidification shapes casting design, the rules for wall thickness, fillets, draft, cores and machining allowances, how to choose between sand and die casting on volume, and how to avoid porosity."
publishDate: 2026-10-16
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - product-development
author: "BIZOMAT"
featured: false
draft: false
---

Casting is one of the oldest ways of making metal parts and still one of the most capable. Pouring molten metal into a mould can produce complex internal passages, organic shapes and near-final geometry that would take hours to machine from solid or dozens of welded pieces to fabricate. Pump bodies, valve housings, gearbox cases, brackets, manifolds, impellers and countless hardware components are cast because no other process makes them as economically.

Casting also punishes designs that ignore how metal behaves as it cools. Thick sections next to thin ones leave shrinkage cavities. Sharp internal corners crack. Flat surfaces without draft stick in the mould. Features that need cores add cost and risk. Machined faces placed through porous zones leak. Many casting problems that appear as "foundry quality" issues are actually design decisions made before the foundry ever saw the part.

This article explains, in general terms, how castings solidify and why that drives design, the main design rules for walls, junctions, draft, cores and machining, how to choose between casting processes on volume and tooling cost, how to deal with porosity and why involving the foundry early is the single most valuable step. It is general information; foundries and casting designers can advise on specific alloys, processes and geometries.

## The main casting processes

| Process | Typical materials | Tooling cost | Typical volumes | Characteristics |
|---|---|---|---|---|
| Sand casting | Iron, steel, aluminium, copper alloys | Low to moderate (patterns) | One-off to medium | Flexible, large parts possible, rougher finish, larger tolerances |
| Shell moulding | Iron, steel | Moderate | Medium | Better finish and accuracy than green sand |
| Investment casting | Steels, stainless, superalloys, aluminium | Moderate (wax injection tools) | Low to high | Fine detail, thin walls, good finish |
| Gravity die (permanent mould) | Aluminium, copper alloys | Moderate to high | Medium | Better properties and finish than sand |
| Low-pressure die casting | Aluminium | High | Medium to high | Sound castings, good for wheels and housings |
| High-pressure die casting (HPDC) | Aluminium, zinc, magnesium | High | High | Thin walls, fine finish, fast cycles; porosity limits heat treatment and welding |

The [choosing a manufacturing process for metal parts](/reados/collections/engineering-design-practice/choosing-a-manufacturing-process-for-metal-parts/) article compares casting with forging, machining and fabrication. This article focuses on designing a part once casting has been chosen.

## How a casting solidifies

Understanding solidification explains most casting design rules.

As molten metal cools, it contracts in three stages: as a liquid, during the change from liquid to solid and as a solid. The contraction during solidification is the troublesome one. If a region of the casting solidifies while it is still surrounded by solid metal, with no liquid metal able to flow in to make up the shrinkage, a **shrinkage cavity** or **shrinkage porosity** forms.

Foundries manage this through **directional solidification**: arranging for the casting to solidify progressively from the thinnest, furthest regions towards **risers** or **feeders**, reservoirs of molten metal that supply liquid until the last moment. The design can help or hinder this.

Thick sections stay liquid longer than thin ones. A thick boss in the middle of a thin wall becomes an isolated **hot spot**, solidifying last with no way to be fed, and is a classic location for shrinkage porosity.

Other common defects include:

- **gas porosity**, from dissolved or entrapped gas;
- **cold shuts and misruns**, where metal freezes before filling thin or distant sections;
- **hot tears**, cracks formed when contraction is restrained while the metal is weak near its solidification temperature; and
- **inclusions** of sand, oxide or slag.

## Design rules

### Keep walls uniform

The most important rule is to keep wall thickness as uniform as practical. Uniform walls solidify at similar rates, reducing hot spots, distortion and residual stress. Where thickness must change, make the transition gradual rather than abrupt, so that sections can feed one another.

Each process has a practical **minimum wall thickness**, depending on the alloy, the size of the part and the process. High-pressure die casting can produce much thinner walls than sand casting. Ask the foundry for its practical limits.

### Use generous fillets and avoid hot-spot junctions

Sharp internal corners concentrate stress, cause hot tears and create hot spots. **Generous fillets** at internal corners improve metal flow, solidification and strength. Junctions where several walls meet are natural hot spots:

- **L and T junctions** should have fillets and avoid excessive thickening.
- **X junctions**, where two walls cross, should be avoided by staggering them into two T junctions.
- **Ribs** are better than thick sections for adding stiffness, but they should be thinner than the wall they join and spaced to avoid creating hot spots where they meet.

### Provide draft

Surfaces parallel to the direction in which the pattern or casting is withdrawn from the mould need **draft**, a slight taper, so they release cleanly. Required draft varies with the process, surface finish and depth; sand castings typically need more than die castings. Internal surfaces usually need more draft than external ones, because the metal shrinks onto internal cores and die features. Designing draft in from the start is far easier than adding it later.

### Choose the parting line deliberately

The **parting line** is where the mould halves meet. It affects draft direction, the location of flash, the need for cores and how features are dimensioned. A parting line on a flat plane is simpler and cheaper than a stepped or irregular one. Critical features should not straddle the parting line, where mould shift can introduce mismatch.

### Minimise and support cores

**Cores** form internal cavities and undercuts. They add cost, can shift or break and must be supported and vented. Simplify internal passages where possible, provide openings for core support and removal and avoid long, thin, unsupported cores. In die casting, undercuts require moving slides, which add tooling cost.

### Design bosses and holes carefully

Bosses for bolts and holes are frequent hot spots. Cored holes reduce boss mass. Keep bosses connected to walls with consistent thickness and avoid isolated thick lumps. Small holes are often better drilled after casting than cored.

### Allow for machining

Most castings are machined on some surfaces. Good practice includes:

- **Machining allowances** appropriate to the process and size, enough to clean up the cast surface without cutting deeply into potentially porous material.
- **Datum features or targets** cast on the part, so the machinist can locate the casting consistently for the first operation.
- **Avoiding machined sealing faces** through regions likely to contain porosity, where possible.
- **Clear distinction on the drawing** between cast and machined surfaces.

### Specify realistic tolerances

Castings have tolerances that depend on the process, size and dimension type. International standards define casting tolerance grades for dimensions and machining allowances, which foundries use to state what they can achieve. Requiring machined-level tolerances on cast surfaces drives cost and rejections. The [specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) article explains how to apply tight tolerances only where function requires them.

## Porosity, leak paths and properties

Some porosity is normal in many castings. Whether it matters depends on where it is and what the part does.

- **Pressure-tight parts** may leak if porosity connects to the surface. Pressure testing and, where appropriate, **vacuum impregnation** with a sealant can seal micro-porosity.
- **Strength-critical parts** may need radiographic or other inspection in critical zones, specified on the drawing.
- **Heat treatment and welding** can be affected by porosity. Conventional high-pressure die castings typically contain entrapped gas and are generally not suitable for solution heat treatment or welding because the gas can expand and blister the surface.
- **Mechanical properties** of castings are usually lower and more variable than those of wrought material of similar composition, so design data should come from casting-specific sources, and critical properties may be verified with test bars or samples.

## Working with the foundry

The most effective step in casting design is involving the foundry early, before the design is frozen. Foundries can advise on:

- the most suitable process and alloy for the requirements and volume;
- where to place the parting line, gates and risers;
- how to simplify cores;
- realistic wall thicknesses, draft and tolerances; and
- where porosity is likely and how to manage it.

Many foundries use **casting simulation software** to model filling and solidification, predicting where defects are likely and allowing the design or gating to be improved before tooling is made. The [from approved design to first production](/reados/collections/product-development-and-launch/from-approved-design-to-first-production/) article covers how tooling, first-off samples and corrections are managed.

## Patterns, tooling and ownership

Patterns, core boxes and dies represent a significant investment and are often stored at the foundry for years. Several practical points prevent later problems:

- **Agree ownership in writing.** State who owns the pattern or die, who insures it and what happens to it if the relationship ends or the foundry closes.
- **Mark and record tooling.** Identify each pattern or die with the part number and revision, and keep a register of where each item is and its condition.
- **Maintain it.** Wooden and resin patterns wear and can warp; dies wear and crack with use. Agree who maintains tooling and how wear is reported.
- **Control revisions.** When the design changes, make sure the tooling is modified and re-marked, and that superseded tooling cannot be used by mistake.
- **Plan for second sources.** For critical parts, consider whether tooling could be transferred to another foundry, and keep the drawings and data needed to do so.

## Choosing a process on volume

Tooling cost and piece price trade against each other. As an illustration of the reasoning, suppose a part could be sand cast with a pattern costing $6,000 and a piece price of $45, or high-pressure die cast with a tool costing $60,000 and a piece price of $12. The total cost of n parts is $6,000 + $45n for sand casting and $60,000 + $12n for die casting. The two are equal when 33n = 54,000, or at about 1,640 parts. Below that volume, sand casting is cheaper; above it, die casting becomes cheaper, provided its other characteristics, such as thinner walls, finish and porosity behaviour, suit the part. Real decisions also consider lead times, tool life, machining and quality costs.

```figure
type: line
title: Sand casting against high-pressure die casting
x: Parts made
y: Total cost ($'000)
ymin: 0
ymax: 110
caption: $6,000 + $45n against $60,000 + $12n: break-even at about 1,640 parts, if die casting suits the part.
legend: Sand casting | High-pressure die casting
- 0 | 6 | 60
- 1000 | 51 | 72
- 1640 | 79.8 | 79.7
- 2000 | 96 | 84
```

## A worked example

This is an illustrative example. The part and events are hypothetical.

A small manufacturer converts a welded steel gearbox housing into an aluminium sand casting to reduce fabrication and machining cost. The first castings leak at a cast-in oil gallery and show shrinkage porosity beneath a large bearing boss after machining.

A review with the foundry shows the boss is about three times the surrounding wall thickness, forming an isolated hot spot, and the oil gallery passes close to the boss. The foundry's simulation confirms the boss solidifies last without feeding.

The design is revised. The boss is cored out, with ribs connecting it to the walls at a thickness similar to the wall. A gradual transition replaces the abrupt step. The gallery is moved slightly away from the boss. The foundry relocates a feeder to the boss region. Machining datums are added as small cast pads, and the drawing specifies pressure testing of the gallery, with vacuum impregnation permitted for micro-porosity. Subsequent castings machine cleanly and pass the leak test.

```figure
type: compare
title: Shrinkage porosity under a bearing boss
cols: First casting | Revised design
best: 2
caption: The foundry's simulation showed the heavy boss solidifying last, with no feeding.
- Boss | About three times the wall thickness | Cored out, ribbed to the wall at wall thickness
- Transition | Abrupt step | Gradual
- Oil gallery | Close to the boss: it leaked | Moved slightly away
- *Feeding | None to the boss | A feeder relocated to the boss region
```

## How this applies to a small Australian business

- **Talk to the foundry before finalising the design.** It is the most valuable step in casting design.
- **Keep walls uniform** and transitions gradual.
- **Avoid isolated thick sections** and crossing walls.
- **Design draft, parting lines and cores deliberately.**
- **Plan machining**: allowances, datums and avoidance of porous zones for sealing faces.
- **Use casting tolerances** for cast surfaces.
- **Specify inspection and testing** where porosity matters.
- **Compare processes on total cost at your volume**, including tooling.

## Common mistakes

- **Designing a casting like a machined or fabricated part**, with abrupt thickness changes and sharp corners.
- **Thick bosses and isolated mass** that create shrinkage.
- **No draft**, forcing redesign or expensive tooling.
- **Complex cores** where simpler internal shapes would work.
- **Tight tolerances on cast surfaces.**
- **Machining sealing faces through porosity-prone zones.**
- **Assuming die castings can be heat treated or welded** like wrought material.

## Frequently asked questions

**Why does porosity appear after machining?** Porosity often lies just below the cast skin or in thick sections. Machining removes the skin and exposes it. Uniform walls, proper feeding and sensible machining allowances reduce the problem.

**Can a casting replace a fabrication?** Often, especially for complex shapes in moderate to high volumes, but the design must be adapted to casting rules rather than copied from the fabrication.

## Questions to ask

- Which casting process and alloy best suit our part and volume?
- Where are the thick sections and junctions, and how will they be fed?
- Have draft, parting line and cores been agreed with the foundry?
- Which surfaces are machined, and what allowances and datums are provided?
- Which features must be pressure-tight or strength-critical, and how will they be inspected?
- At what volume does a different casting process become cheaper overall?

## Bringing it together

Casting produces complex parts economically when the design respects how metal solidifies. Uniform walls, gradual transitions, generous fillets, deliberate draft and parting lines, minimal cores, well-designed bosses, sensible machining allowances and realistic tolerances prevent most defects before they start. Porosity is managed through design, feeding, inspection and, where appropriate, impregnation. Choosing the process on total cost at the expected volume, and involving the foundry early, turns casting from a source of quality problems into a powerful manufacturing option.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
