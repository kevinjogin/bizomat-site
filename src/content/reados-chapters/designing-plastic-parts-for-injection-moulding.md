---
title: "Designing plastic parts for injection moulding: walls, draft, ribs, bosses, gates and tooling"
description: "Injection moulding makes cheap parts from expensive tools, so design errors are costly. How to set walls, draft, ribs and bosses, plan gates and shrinkage, and make sound tooling decisions."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - product-development
author: "KEVOS®"
featured: false
draft: false
---

Injection moulding can produce complex plastic parts in seconds, with good dimensional consistency and little or no finishing. Housings, covers, clips, knobs, gears, closures and connectors are all made this way, from tiny medical components to large vehicle panels. Once a mould is running, the cost of each part is mostly material and a few seconds of machine time.

The catch is the mould. A production injection mould is a precision tool machined from hardened steel, often costing tens of thousands of dollars and taking weeks or months to make. Changing it is slow and expensive, and some changes are impossible without making a new tool. A design mistake that would be a quick fix on a machined part, such as a wall too thick or a feature that cannot be released from the tool, becomes a tooling modification, a delay or a part that never runs well. Injection moulding rewards design discipline more than almost any other process.

This article explains how plastics behave, how injection moulding works, the main part design rules for walls, corners, draft, ribs, bosses and undercuts, how shrinkage, gates and flow affect quality, and how to make sound tooling decisions. It is general information for product designers, engineers and buyers. Material data and design limits vary between grades and moulders, so confirm details with your material supplier and toolmaker.

## How plastics differ from metals

Plastics are **polymers**: long chain molecules, mostly built on carbon. The chains are held together far more weakly than atoms in a metal, which gives plastics their character.

- **Thermoplastics** soften when heated and harden again on cooling, repeatedly. They can be injection moulded quickly, welded and often recycled. Most moulded parts are thermoplastics.
- **Thermosets** cure chemically into a rigid network that cannot be remelted. Epoxies and phenolics are examples. They are more heat and creep resistant but are processed differently.

Three properties drive plastic part design:

- **Low stiffness.** Engineering plastics typically have an elastic modulus of about 1 to 4 GPa, compared with about 200 GPa for steel. A plastic part deflects far more under the same load, so designers add stiffness through geometry such as ribs and curved sections rather than relying on thickness.
- **Creep.** Plastics slowly deform under sustained load, even at room temperature, and more so when warm. A clip, boss or bracket under permanent stress keeps moving over months.
- **High thermal expansion.** Plastics commonly expand five to fifteen times as much as steel for the same temperature change. A plastic part rigidly fixed to metal can buckle, crack or pull loose as temperatures change, so assemblies need slots, clearances or floating mounts.

Design plastics for stiffness, creep and temperature, not just strength. They usually deflect too much before they break.

## Common moulding materials

| Material | Typical characteristics | Common uses |
|---|---|---|
| Polypropylene (PP) | Light, tough, chemical resistant, good for living hinges, low cost | Containers, closures, hinged lids, automotive trim |
| Polyethylene (PE) | Tough, flexible, chemical resistant | Containers, caps, tanks |
| ABS | Rigid, good surface finish, easy to mould and decorate | Housings, enclosures, consumer products |
| Polycarbonate (PC) | Very tough, clear grades available, higher heat resistance | Guards, lenses, electrical housings |
| Nylon (PA) | Tough, wear resistant, absorbs moisture, which changes dimensions and properties | Gears, bushes, clips, under-bonnet parts |
| Acetal (POM) | Stiff, low friction, dimensionally stable | Precision gears, mechanisms, fasteners |
| Glass-filled grades | Much stiffer and stronger, more abrasive, anisotropic shrinkage | Structural brackets, housings under load |

Material suppliers publish datasheets with mechanical, thermal and shrinkage data, and many offer design guides and moulding advice. Choose the grade early, because wall thickness, draft, shrinkage and gate design all depend on it.

## How injection moulding works

An injection moulding machine has three main parts:

- **The injection unit** takes plastic pellets from a hopper, melts them in a heated barrel using a rotating screw and injects the melt into the mould.
- **The mould** contains the cavity that shapes the part, with channels to feed the plastic, cool the part and eject it.
- **The clamping unit** holds the mould halves closed against injection pressure and opens them to release the part.

Each part is made in a **cycle**: the mould closes and clamps; melt is injected to fill the cavity; pressure is held to pack in more material as the plastic shrinks; the part cools until it is rigid enough to eject; then the mould opens and ejector pins push the part off.

Cooling is often the longest part of the cycle. Because plastics conduct heat poorly, cooling time rises roughly with the square of wall thickness. Doubling the wall roughly quadruples the cooling time. Thick walls therefore cost money on every single part.

## How moulds are built

The mould has two halves. The **cavity** side usually forms the outside of the part and the **core** side forms the inside. The surface where they meet is the **parting line**. Its position decides where witness lines appear, which way surfaces must be drafted and which features can be formed without extra mechanisms.

Moulds vary in several ways:

- **Cavities**: a single-cavity mould makes one part per cycle; a multi-cavity mould makes several, increasing output but requiring balanced filling. A **family mould** makes different parts together.
- **Construction**: simple two-plate moulds; three-plate moulds that separate the feed system; and moulds with **slides and lifters** that move sideways to form undercuts, adding cost, maintenance and cycle time.
- **Feed system**: **cold runners** leave a runner to be removed and often reground; **hot runners** keep the feed molten and eliminate runner scrap at higher tool cost.
- **Ejection**: pins push the part off locally and can leave marks; stripper plates push around the perimeter.
- **Tool material**: hardened tool steel for long production runs; softer pre-hardened steel or aluminium for lower volumes, prototypes or bridge tooling.

## Part design rules

### Keep walls uniform and as thin as function allows

Choose a **nominal wall thickness** early and keep it consistent. Uniform walls fill, pack and cool evenly, which limits warpage, sink marks and internal voids. Thin walls reduce material and cycle time. Many housings and covers work with walls of roughly 1.5 to 3 mm, but the right value depends on the material, flow length and loads.

Where thickness must change, make the transition gradual rather than a sudden step. Core out thick areas rather than leaving solid sections.

### Round corners

Sharp internal corners concentrate stress and disrupt flow. Use internal radii of at least about half the wall thickness, and outside radii equal to the inside radius plus the wall thickness, so the wall stays uniform around the corner.

### Add draft

Apply **draft**, a slight taper, to every wall parallel to the direction the mould opens, so the part releases cleanly. Without draft, parts drag, scuff, stick or distort on ejection. Draft of about 0.5 to 2 degrees is common for smooth surfaces, with more on deep features. Textured surfaces need more draft, as specified by the texture supplier and toolmaker.

### Stiffen with ribs, not thickness

Use **ribs** to add stiffness instead of thickening walls. Ribs should be thinner than the wall they join, commonly around 50 to 80% of the nominal wall, to avoid sink marks on the opposite face. Keep ribs reasonably short relative to their thickness, add draft and radius their base, and space them far enough apart for the tool to be cooled and machined.

### Support bosses properly

**Bosses** carry screws, inserts and locating pins. A solid boss is a thick section that sinks and voids. Core the boss out, keep its wall thinner than the nominal wall, and connect it to nearby walls with ribs or gussets for support. Size bosses for self-tapping screws using the screw maker's recommendations for the specific plastic.

### Minimise undercuts

An **undercut** is any feature that prevents the part from being pulled straight out of the mould, such as a side hole, a clip catch or an internal groove. Each undercut usually needs a slide, lifter or collapsing core. Many undercuts can be removed by moving the parting line, by **pass-through coring**, where a hole in the opposite wall lets steel from the other mould half form the catch, or by redesigning the feature.

Wall thickness, ribs and bosses interact. A thick rib causes a sink mark; a boss without ribs is weak; a boss thickened to compensate causes the same sink. Design them together against the nominal wall.

## Snap fits, hinges, threads and inserts

Moulding allows features that remove separate parts and assembly steps:

- **Snap fits** join parts without fasteners. Design them within the material's allowable strain, with radiused roots, and decide whether they are meant to be released.
- **Living hinges**, thin flexible sections, work well in polypropylene for lids and closures.
- **Moulded threads** suit closures; for screwed assemblies that will be opened repeatedly, **threaded metal inserts**, installed by heat, ultrasonics or moulding in, give durable threads.
- **Self-tapping screws** designed for plastics form threads directly in bosses.

## Shrinkage, tolerances and warpage

Plastics shrink as they cool, so the mould is made larger than the part by the material's **shrinkage allowance**. Amorphous plastics such as ABS and polycarbonate generally shrink less and more evenly than semi-crystalline plastics such as polypropylene, nylon and acetal. Glass fibres reduce shrinkage but make it different along and across the flow, which can cause warpage.

Uneven shrinkage, from varying wall thickness, uneven cooling or fibre orientation, distorts parts. Uniform walls, symmetrical geometry and good mould cooling reduce it.

Moulding tolerances depend on material, part size and tool quality. Ask the moulder what is achievable before setting tight tolerances, and apply them only where function needs them. Toolmakers often cut critical features **steel safe**, leaving extra steel so dimensions can be adjusted after the first samples by removing metal, which is far easier than adding it.

## Gates, flow and mould flow analysis

The **gate** is where plastic enters the cavity. Its location affects how the part fills, where weld lines form, where air is trapped and how evenly the part is packed.

- **Weld lines** form where melt fronts meet, for example around holes or between gates. They are weaker and may be visible. They cannot always be avoided but can be moved away from loaded or cosmetic areas by changing the gate.
- **Air traps** occur where the melt encloses air that cannot escape, causing short shots or burn marks. Vents at the parting line or ejector pins let air out.
- **Gate position** affects pressure and packing. Gating near thicker sections helps pack them; central gating shortens flow length and lowers pressure.

**Mould flow analysis** software simulates filling, packing, cooling and warpage, predicting fill patterns, weld lines, air traps, pressure, sink and distortion before the tool is cut. It is especially useful for large, thin, cosmetic or tightly toleranced parts and multi-cavity tools.

## Common moulding defects

| Defect | Appearance | Typical design or process causes |
|---|---|---|
| Sink marks | Shallow depressions on surfaces | Thick sections, thick ribs or bosses, insufficient packing |
| Voids | Internal bubbles in thick sections | Thick sections shrinking away from a solidified skin |
| Warpage | Distorted, twisted parts | Uneven walls, uneven cooling, fibre orientation |
| Short shots | Incomplete parts | Long flow lengths, thin walls, poor venting, low pressure |
| Flash | Thin fins at the parting line | Worn tools, low clamp force, excessive pressure |
| Weld lines | Visible lines, weak zones | Flow around holes and cores, multiple gates |
| Burn marks | Dark marks at the end of fill | Trapped air compressed and heated |
| Ejection marks and drag | Scuffs, pin marks, stress whitening | Insufficient draft, poor ejection design |

## Tooling decisions

Tooling is a major investment, so decide deliberately:

- **Prototype first.** Use 3D printing or machined parts to test form, fit and function before cutting a tool. The [notes on prototyping](/reados/collections/product-development-and-launch/notes-on-prototyping/) article covers matching prototypes to the questions they need to answer.
- **Bridge tooling.** Aluminium or soft steel tools can make early production quantities quickly, at lower cost but with shorter life.
- **Cavitation.** More cavities raise output and reduce cost per part but increase tool cost.
- **Hot or cold runner.** Hot runners save material and cycle time at higher tool cost and complexity.
- **Ownership and maintenance.** Agree who owns the tool, where it is kept, how it is maintained and what happens if the moulder changes.
- **Sampling and approval.** Plan first samples, dimensional checks, corrections and formal approval before production. The [proving a process is ready for production](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) article covers process approval in more detail.

A simple cost model helps compare options: material cost per part, plus the machine hourly rate divided by the parts made per hour, plus tooling cost spread over the expected volume.

## A worked example

This is an illustrative example. A small equipment business designs an ABS cover for a sensor unit, expected to sell about 20,000 a year. The first design has 4 mm walls, solid screw bosses, no draft on the side walls and a side clip catch that needs a slide. The moulder quotes a two-cavity steel tool and estimates a 45-second cycle, of which about 30 seconds is cooling.

**Design review.** The designer works through the design rules with the moulder:

- Walls are reduced to 2.5 mm, with ribs at about 60% of the wall to keep stiffness.
- Bosses are cored out and supported by gussets.
- Side walls are given 1 degree of draft.
- The clip catch is redesigned with pass-through coring, removing the slide.
- A mould flow study moves the gate so that the weld line forms away from a screw boss.

**Results.** Cooling time scales roughly with the square of wall thickness, so cooling falls to about (2.5 ÷ 4)², or 39%, of its original 30 seconds, about 12 seconds. The cycle falls from 45 to about 27 seconds. At a machine rate of $60 an hour, the two-cavity tool's output rises from 160 to about 267 parts an hour, and machine cost per part falls from about 37.5 cents to about 22.5 cents, saving about $3,000 a year. Part weight falls from 85 to 60 grams, saving another $1,500 a year in material at $3 a kilogram. Removing the slide reduces the tool cost and removes a maintenance item. Sink marks over the bosses, which the moulder had warned about, do not appear.

## Applying this in an Australian business

- **Choose the material grade early** and get the supplier's design data.
- **Set a nominal wall** and keep walls uniform.
- **Add draft and radii** to all suitable features.
- **Use ribs and gussets** for stiffness, thinner than the wall.
- **Core out bosses** and thick sections.
- **Remove undercuts** where possible before accepting slides.
- **Involve the moulder and toolmaker** before the design is fixed.
- **Use mould flow analysis** for complex, cosmetic or critical parts.
- **Prototype before tooling** and plan sampling and approval.
- **Agree tool ownership and maintenance** in writing.

## Where plastic part designs go wrong

- **Metal-style designs** with thick sections, sharp corners and no draft.
- **Thick ribs and solid bosses** causing sink marks and voids.
- **Undercuts that a small change** would have removed.
- **Tight tolerances everywhere**, without asking what moulding can achieve.
- **Ignoring thermal expansion and creep** in assemblies with metal.
- **Choosing gate positions** without considering weld lines and packing.
- **Cutting the tool before** the design has been tested.

## Questions to ask before releasing a moulded part for tooling

- Which material grade have we chosen, and have we used its design data?
- Are walls uniform, and are thick sections cored out?
- Does every face parallel to the mould opening have draft?
- How many undercuts remain, and can any be designed out?
- Where will the gate, weld lines and air traps be?
- Which tolerances truly matter, and has the moulder confirmed them?
- Have we tested the design with prototypes?

## Bringing it together

Injection moulded parts are economical when they are designed for the process. Respect the way plastics behave: low stiffness, creep and high thermal expansion. Keep walls uniform and as thin as function allows, add draft and radii, stiffen with ribs rather than thickness, core out bosses and remove undercuts where possible. Plan for shrinkage and warpage, place gates thoughtfully and use mould flow analysis where it is warranted. Prototype before tooling, involve the moulder and toolmaker early, and agree how tools will be sampled, approved, owned and maintained. The result is a tool that runs reliably and parts that cost less on every cycle.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on plastics, injection moulding and mould design from CAD models, and mould flow analysis, together with established moulding practice. The worked example is illustrative. This article is general information; confirm design limits with your material supplier and moulder.*
