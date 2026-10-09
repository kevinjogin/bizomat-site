---
title: "Choosing a cutting process for plate and sheet: laser, plasma, oxy-fuel, waterjet, sawing and punching"
description: "The cutting process decides edge quality, accuracy, heat effects, downstream work and cost. How laser, plasma, oxy-fuel, waterjet, EDM, sawing and punching compare, and how to choose."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - operations
author: "KEVOS"
featured: false
draft: false
---

Most fabricated and sheet metal products start with a cut: a profile from plate, a blank from sheet, a length from bar. The cutting process is often chosen by default. The drawing says "laser cut" because the last supplier had a laser, or the shop uses its plasma table for everything because it is there. Yet the process affects much more than the cut itself. It decides how accurate the part is, how the edge looks and behaves, whether the edge has been hardened by heat, how much grinding and deburring follow, whether paint will stick to the cut face and what the part costs.

Choosing deliberately, part by part, can reduce cost and avoid quality problems downstream. Specifying laser cutting for a 40 mm base plate wastes money; plasma-cutting a precision bolt pattern in a bracket that must align with a machined frame causes fit-up problems; oxy-fuel cutting a high-strength steel part that will later be bent can crack it at the bend.

This article compares the main cutting processes for metal plate, sheet and sections, explains how each affects the part and the work that follows, and sets out how to choose. It is general information for designers, engineers, buyers and fabricators. Capabilities vary widely between machines and suppliers, so confirm thickness ranges, tolerances and costs with the people who will do the work.

## The processes at a glance

| Process | Materials | Sweet spot | Strengths | Limitations |
|---|---|---|---|---|
| **Fibre laser** | Steels, stainless, aluminium, many non-ferrous metals | Sheet and thin to medium plate | Fine kerf, high accuracy, small heat-affected zone, fast on thin material | Cost rises with thickness; edges on thick mild steel may be rougher; flat material only |
| **Plasma** (including high-definition) | Any electrically conductive metal | Medium plate | Fast, lower machine cost, good on thicker plate | Wider kerf, slight edge bevel, dross, larger heat-affected zone than laser |
| **Oxy-fuel** | Carbon and low-alloy steels only | Thick plate | Cuts very thick steel, low equipment cost, multiple torches | Slow on thin plate, wide kerf, significant heat input and distortion; not for stainless or aluminium |
| **Abrasive waterjet** | Almost anything: metals, stone, glass, composites, plastics | Heat-sensitive or non-metallic materials and thick sections where heat is unacceptable | No heat-affected zone, very versatile | Slower, abrasive and running costs, slight taper on thick cuts |
| **Wire EDM** | Electrically conductive materials, including hardened steels | Tooling, dies, very precise profiles | Very high accuracy, cuts hardened material | Slow, expensive per part |
| **Sawing** | Bar, tube, sections | Lengths and mitres of stock material | Cheap, cold, straightforward | Straight cuts only |
| **Shearing and punching** | Sheet and thin plate | Straight cuts, hole patterns, formed features in volume | Fast and cheap per hit; turret punches form louvres and extrusions | Tooling for each shape; burrs; thickness limits |

## How thermal cutting works, and why it matters

Oxy-fuel, plasma and laser are **thermal** processes, and the way they remove metal explains their behaviour.

- **Oxy-fuel** preheats steel and then burns it in a jet of pure oxygen. It relies on the iron oxidising, which is why it works on carbon and low-alloy steels and not on stainless steel, aluminium or cast iron, whose oxides interfere with the reaction. Higher-carbon and alloy steels may need preheating to avoid cracking at the cut edge.
- **Plasma** uses an electric arc constricted through a nozzle to form a very hot, high-velocity gas jet that melts metal and blows it away. Because it melts rather than burns, it cuts any conductive metal. High-definition plasma systems use tighter arcs for narrower kerfs and squarer edges. Cutting over or under water reduces fume and noise.
- **Laser** focuses an intense beam onto a small spot. With oxygen assist gas on mild steel, the cut is partly a burning process; with nitrogen on stainless steel and aluminium, the molten metal is blown out without oxidising the edge. Fibre lasers now dominate sheet and thin plate cutting.

All thermal processes create a **heat-affected zone** along the cut, where the metal has been heated and cooled quickly. In hardenable steels this zone can be hard and brittle, which matters if the edge will be bent, machined, welded or loaded in fatigue. The zone is narrowest with laser, wider with plasma and widest with oxy-fuel. Waterjet, sawing and punching are cold processes with no heat-affected zone.

## Edge quality and accuracy

Thermal cut quality can be classified using ISO 9013, which grades cut faces by perpendicularity and roughness, so a drawing can specify the quality required rather than a process. Practical differences:

- **Laser** gives the best accuracy and squarest edges on thin material, with small, clean holes.
- **Plasma** leaves a slight bevel on one side of the cut and some dross, and small holes tend to be tapered and less accurate. High-definition plasma narrows the gap with laser on many plate thicknesses.
- **Oxy-fuel** leaves a wider kerf and more variable edge, usually needing grinding where appearance or fit matters.
- **Waterjet** gives good edges with a slight taper on thick cuts unless the machine compensates.

Holes deserve particular attention. Small holes relative to the plate thickness are difficult for plasma and oxy-fuel. Where bolt holes must align accurately with other parts, consider laser cutting, or cutting undersize and drilling or reaming afterwards.

## Effects on the work that follows

The cut edge affects downstream processes:

- **Bending**: hardened heat-affected zones and rough edges can crack during bending, especially in higher-strength steels. Laser or cold-cut edges, or edge grinding, reduce the risk.
- **Welding**: oxide, dross and hardened edges can cause weld defects. Clean edges, sometimes ground, give better welds.
- **Coating**: laser cutting mild steel with oxygen leaves a thin oxide layer on the cut face that can reduce the adhesion of powder coat and paint. Removing it by grinding or blasting, or cutting with nitrogen, avoids coating failures at edges.
- **Machining**: hard edges from thermal cutting wear cutting tools quickly.
- **Deburring and dross removal** add labour to almost every thermal cut part, more for plasma and oxy-fuel than for laser.

Count these downstream costs when comparing processes. The cheapest cut is not always the cheapest finished part.

## What drives cutting cost

For profile cutting, cost per part is driven by:

- **Machine time**: cutting length divided by speed, plus the time to pierce each hole start, plus moves between cuts.
- **Machine hour rate**, which differs widely between process types and between suppliers.
- **Consumables and gases**: nozzles, electrodes, assist gases and, for waterjet, abrasive.
- **Material use**: how efficiently parts are **nested** on the sheet or plate, and the kerf width.
- **Secondary operations**: dross removal, deburring, edge grinding, drilling and cleaning.
- **Set-up and handling**, which dominate for small batches.

Design choices change these drivers. Fewer pierces, fewer small holes, common cut lines between parts, standard plate thicknesses and generous tolerances where function allows all reduce cost.

## A practical way to choose

1. **Start from the material and thickness.** That alone narrows the options: oxy-fuel only for carbon and low-alloy steels, laser and plasma for most metals within their thickness ranges, waterjet for non-metals and heat-sensitive materials.
2. **Set the accuracy and edge quality the part actually needs**, especially for holes and mating edges.
3. **Consider what happens next**: bending, welding, coating, machining or appearance.
4. **Check heat sensitivity**: hardenable steels, heat-treated parts and materials that must not be altered by heat.
5. **Consider volume and shape**: punching for repetitive hole patterns and formed features in sheet; laser for complex profiles; sawing for sections and bar.
6. **Compare total cost** per finished part, including secondary operations.
7. **Specify the result, not just the process**, where possible: tolerances, edge quality class and any edge treatment, so suppliers can choose the most economical route.

## Cut in-house or buy cut parts

Many fabricators eventually ask whether to buy their own cutting machine. A machine in-house shortens lead times, gives control over priorities and can lower cost per part once utilisation is high enough. It also brings capital cost, floor space, power and gas supply, fume extraction, maintenance, programming skills, nesting software and the risk of an under-used asset. Before buying, analyse a year of cut parts by material, thickness and volume, estimate realistic machine utilisation and compare the full cost of ownership with what suppliers charge. Keep using specialist suppliers for the families your machine would handle poorly, such as very thick plate or high-precision thin parts. The [make or buy](/insights/make-or-buy-in-house-manufacturing-or-outsourcing/) article sets out how to compare in-house and outsourced manufacturing, and the [should-cost modelling for bought parts](/insights/should-cost-modelling-for-bought-parts/) article shows how to estimate what a cut part ought to cost from its cutting length, pierces, material and handling.

## Safety and environment

Thermal cutting produces fume, intense light, noise, heat and fire risk; lasers add eye and skin hazards; waterjets operate at very high pressures; punching and shearing have crush and cut hazards. Fume extraction, enclosures, guarding, interlocks, hot work controls and training are essential, and plant risk assessments are required under work health and safety law.

## A worked example

This is an illustrative example. A 25-person business designs and assembles agricultural equipment and buys all its cut parts from a laser cutting supplier, because its drawings say "laser cut". Monthly cutting spend has grown, and some thick parts have long lead times.

**Review by part family.** The engineer groups the cut parts into four families and reviews each:

- **Thin mild steel and stainless brackets and panels (1.5 to 6 mm)**: accuracy, small holes and clean edges matter. Laser remains the right choice. Stainless panels are specified to be cut with nitrogen to avoid edge oxide, and mild steel parts that will be powder coated get a note requiring cut-edge oxide to be removed, after early coating failures at edges.
- **Medium plate brackets and gussets (8 to 16 mm)**: the profiles are simple and most holes are clearance holes. High-definition plasma meets the requirements at lower cost. The three bolt holes that align with a machined gearbox mount are specified as cut undersize and drilled to size.
- **Thick base plates (25 to 40 mm)**: oxy-fuel cutting is quoted at a fraction of the laser price and shorter lead time. Edges that will be welded are specified to be ground clean.
- **Rubber and composite wear strips**: currently cut by hand. Waterjet cutting from sheet gives accurate, consistent parts and frees about a day of labour each month.

**Drawings and suppliers.** Drawings now specify tolerances, edge quality where it matters and edge treatments, rather than naming a process for every part. Two suppliers are invited to quote by part family.

**Result.** Cutting spend on the medium and thick plate families falls noticeably, lead times on base plates shorten, coating failures at edges stop and assembly fit-up problems at the gearbox mount disappear. The thin precision parts stay with the laser supplier, where they belong.

## Applying this in an Australian business

- **Choose the cutting process per part family**, not by habit.
- **Start from material and thickness**, then accuracy and edge needs.
- **Remember oxy-fuel is for carbon and low-alloy steels only.**
- **Watch the heat-affected zone** on parts to be bent, machined or fatigue loaded.
- **Treat holes carefully**, drilling where accuracy matters.
- **Remove oxide from laser-cut mild steel edges** before coating, or cut with nitrogen.
- **Compare finished-part cost**, including dross removal, deburring and grinding.
- **Specify tolerances and edge quality**, letting suppliers propose the process.
- **Control fume, light, noise and other hazards.**

## Where cutting choices go wrong

- **One process specified for everything.**
- **Laser-cutting thick plate** that plasma or oxy-fuel would cut far more cheaply.
- **Plasma-cutting precise hole patterns.**
- **Bending hardened thermal-cut edges** in high-strength steel.
- **Coating over laser oxide** and getting edge failures.
- **Ignoring secondary operations** in cost comparisons.
- **Poor nesting** wasting material.

## Questions to ask about your cut parts

- Which material and thickness ranges make up most of our cutting spend?
- Which parts truly need laser accuracy, and which do not?
- Which cut edges will be bent, welded, machined or coated?
- How much time do we spend removing dross and grinding edges?
- Do our drawings specify the result needed or just a process?
- Would a different supplier or process suit some part families better?

## Bringing it together

Cutting is the first operation for most fabricated parts, and the process chosen shapes accuracy, edge quality, heat effects, downstream work and cost. Fibre laser suits sheet and thin plate needing accuracy; plasma suits medium plate economically; oxy-fuel suits thick carbon steel; waterjet suits heat-sensitive and non-metallic materials; wire EDM suits precise tooling; sawing and punching suit sections and repetitive sheet features. Choose part family by part family, starting from material and thickness, then accuracy, edge needs, heat sensitivity and what happens next, and compare the cost of the finished part rather than the cut alone. Specify results rather than habits, and let capable suppliers find the most economical way to meet them.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS manufacturing handbooks on process selection for cutting metals with flame, arc, plasma and lasers, metal cutting processes and electrical discharge machining, together with established fabrication practice. The worked example is illustrative. This article is general information; confirm capabilities with your suppliers.*
